# Capability-on-Demand for `<ch5-button>` (and beyond)

> Fourth in the architecture-review doc series.
> Companion to `MIGRATION.md` (Phase 1 inventory),
> `LIST_VIRTUALIZATION.md` (Phase 2 case for list family),
> and `BUTTON_PERFORMANCE.md` (per-instance cost analysis).
>
> Status: design discussion. No code shipped against this. The
> intent is to align the team on whether it's worth a focused
> prototype before any commitment is made.

---

## The question

Today, every `<ch5-button>` instance allocates the full capability
surface up front — all signal subscriptions, all observers, all
mode-state machinery, all CSS class enumeration — even if the
authored markup only uses `label` and `sendEventOnClick`. Can we
make the component allocate **only what the authoring actually
asks for**?

The short answer: yes, and CH5 is unusually well-positioned for it
because the toolchain has visibility into every customer project.

---

## The two meanings of "build what's needed on the fly"

These are complementary, not competing.

### A. Runtime-lazy composition

The component starts as a minimal shell. Each *capability* (label,
icon, modes, `receiveStateLabel`, `sendEventOnClick`, custom CSS,
pressable…) is encapsulated as an installable **feature**. A
feature is installed only when its triggering attribute appears.

### B. Build-time pruning

The CH5 HTML5 UI Builder already sees every `<ch5-button>` in every
project. At build time it can determine the union of capabilities
the project actually uses and emit a tailored bundle — or annotate
each button with what it needs.

The two combine well: **build-time decides which features to ship;
runtime decides which features to instantiate per button.**

---

## How — runtime-lazy, concretely

The pattern most appropriate for CH5's constraints is a **feature
registry** with lazy installation, triggered by attribute presence.
The architectural shape:

```ts
// Each capability is a small self-contained module
interface Feature {
  install(el: Ch5Button): FeatureInstance;
}

interface FeatureInstance {
  update(value: string | null): void;
  dispose(): void;
}

const featureRegistry: Record<string, Feature> = {
  // Cheap, always-on
  label: LabelFeature,
  iconclass: IconClassFeature,

  // Signal-bound
  receivestatelabel: ReceiveStateFeature('label', 'string'),
  receivestateselected: ReceiveStateFeature('selected', 'boolean'),
  receivestatemode: ReceiveStateFeature('mode', 'number'),

  // Send-event side
  sendeventonclick: SendEventFeature('click'),
  sendeventontouch: SendEventFeature('touch'),

  // Heavier behaviours
  mode: ModeFeature,
  customclass: CustomClassFeature,
  pressable: PressableFeature,        // installed by attribute OR by sendEventOn*
};

class Ch5Button extends HTMLElement {
  static observedAttributes = Object.keys(featureRegistry);

  private _features = new Map<string, FeatureInstance>();
  private _shell: HTMLButtonElement;

  connectedCallback() {
    this._shell = this.renderShell();   // 1 DOM node + maybe an icon slot
    this.appendChild(this._shell);
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (value === null) {
      this._features.get(name)?.dispose();
      this._features.delete(name);
      return;
    }
    let inst = this._features.get(name);
    if (!inst) {
      inst = featureRegistry[name].install(this);
      this._features.set(name, inst);
    }
    inst.update(value);
  }

  disconnectedCallback() {
    this._features.forEach(f => f.dispose());
    this._features.clear();
  }
}
```

A button with `<ch5-button label="Play" sendEventOnClick="play.sig">`
instantiates **two** features. The current implementation
instantiates *all* of them. That's the win.

### Three things make this work cleanly in CH5

1. **The attribute set already declares intent.** `<ch5-button>`
   already lists every capability via `receiveState*` /
   `sendEvent*` / `label` / `mode` etc. We don't need a new
   authoring model — the existing attributes ARE the lazy-install
   triggers.

2. **The Phase 1 subscription discipline is the foundation.** Each
   `FeatureInstance.dispose()` is exactly the cleanup contract
   Phase 1 installed on `Ch5Common`. The bridge `subKey` pattern and
   `_baseClassSubscriptions[]` drain map directly onto per-feature
   lifecycle.

3. **The `Ch5Common` decomposition (Phase 2 maintainability work)
   makes the features expressible.** Today, "subscribe to
   `receiveStateLabel`" is entangled in 1,938 LOC of base class.
   Once `Ch5Common` is split into mixins/services, each feature is
   just a small composition target.

---

## How — build-time pruning, concretely

The toolchain has unusually clear visibility into every customer
project. A build pipeline could:

1. **Parse the project's HTML/templates** and collect the set of
   attributes ever used on `<ch5-button>` (and other components).
2. **Emit a feature manifest:**
   ```json
   { "ch5-button": ["label","sendEventOnClick","mode","receiveStateLabel"] }
   ```
3. **Tree-shake the feature modules** at bundle time. Features not
   in the manifest are not registered, so their code never ships.
4. **For projects that DO need runtime dynamism** (signal-driven
   attribute changes that introduce features at runtime), the
   toolchain emits a "full" bundle and skips the prune.

The manifest can even be customer-by-customer: a panel that only
ever shows static labels gets a tiny bundle; one that uses every
capability gets the existing footprint.

---

## Pros

| Concern | Runtime-lazy (A) | Build-time prune (B) | Combined |
|---|---|---|---|
| Per-button memory | 15–25 KB → **2–5 KB typical** | unchanged | **2–5 KB typical** |
| Per-button observers | 2 → **0 unless attribute present** | unchanged | **0 unless attribute present** |
| Per-button signal subs | 10 → **as authored, typically 1–3** | unchanged | **1–3** |
| Bundle size | unchanged | **30–60% smaller for trimmed projects** | **30–60% smaller** |
| Initial render time | ↓ for sparse buttons | unchanged | ↓ |
| Authoring model | unchanged | unchanged | unchanged |
| Compatibility with existing projects | high (same HTML) | high (same HTML) | high |
| Testability | each feature is independently testable | unchanged | each feature is independently testable |
| Fits with Phase 1 work | very well — extends the same lifecycle discipline | well | very well |
| Fits with `Ch5Common` decomposition (Phase 2) | this **is** the structural target | independent | converges nicely |

---

## Cons / what's hard

1. **Inter-feature coordination.** Some attributes are mutually
   exclusive or have precedence (`label` vs `scriptLabelHtml`;
   `mode` vs explicit `type`/`shape`). Lazy install needs a small
   mediator so features don't trample each other — usually a
   "claims" pattern: each feature declares what part of the button
   it owns; the registry rejects conflicts.

2. **Attribute order sensitivity.** If features depend on each
   other (e.g., `receiveStateMode` only matters once `mode` is
   interpretable), install order must be deterministic. Solvable
   by topological install when multiple attributes arrive in the
   same microtask, but it's a real concern.

3. **Debuggability.** When something doesn't work, "which feature
   is responsible for the broken behaviour?" is one more lookup
   than "it's in `ch5-button-base.ts` somewhere". Mitigated with
   strong naming and a `__features` debug accessor.

4. **Snapshot/migration risk.** Today, every receive-state
   subscription is set up in the ctor regardless of whether the
   corresponding attribute is present. Lazy install means the
   signal is subscribed *later*, which subtly changes when the
   first value arrives. Most consumers won't notice, but a few
   might depend on "value is available immediately after
   construction" — needs validation against real customer
   projects.

5. **Build-time prune requires toolchain buy-in.** The HTML5 UI
   Builder team needs to add the manifest emit; the runtime needs
   a way to pick the trimmed bundle. Not technically hard, but
   it's organizational work.

6. **Runtime feature install is not free.** There's a small
   indirection cost per attribute-change. For a button whose
   attributes never change after init, the per-attribute install
   cost is paid once and forgotten. For a button whose
   `receiveStateLabel` is rapidly mutated, it's already cached.
   The pathological case (rapidly toggling an attribute on and
   off, causing repeated install/dispose) is unusual but worth a
   benchmark.

7. **Some "always-on" parts can't be lazy.** Accessibility ARIA
   roles, the click semantics that send the `sendEventOnClick` —
   those are part of the always-on shell. The lazy registry only
   covers *opt-in* capabilities. (This is actually fine — it just
   clarifies what the always-on shell is.)

---

## CH5-specific considerations

- **The toolchain is a unique asset.** Most web-component
  libraries can't assume a build channel. CH5 can. Build-time
  pruning is unusually attractive here for that reason.
- **Reactive controllers / Lit have validated the pattern.** This
  isn't experimental — Lit's `ReactiveController` and FAST's
  directives are essentially this idea. CH5 doesn't need to copy
  them, but it can copy what they got right.
- **The Phase 1 work is the runway.** The shared observers, the
  leak fix, the test harness, the bridge-subscription discipline
  — those are exactly the foundation the feature registry sits
  on. Phase 1 was not "perf tweaks", it was "make this kind of
  refactor safe."

---

## Pragmatic suggestion — a falsifiable proof of concept

If we want to validate the idea before committing to a full
refactor, here's a low-risk way:

1. **Pick one capability that's genuinely opt-in** —
   `receiveStateScriptLabelHtml` is a good candidate: used by
   perhaps 5% of buttons in the wild, currently allocated in 100%
   of them.
2. **Extract it to a feature module.** No registry yet — just
   demonstrate that the capability can live outside the ctor.
3. **Wire it through `attributeChangedCallback`** instead of the
   ctor. Measure: per-button bytes, observer count, first-paint
   time, in a benchmark with 100 buttons (extending the Phase 1
   perf-test pattern).
4. **If the numbers land**, generalise the pattern, build the
   registry, migrate the next 2–3 capabilities. Each migration is
   independently shippable.
5. **In parallel**, prototype the manifest emitter in the
   toolchain — even just as a separate script that scans a
   project directory and reports the set of attributes used.
   Confirms how much trimming is realistically available.

That's roughly two weeks of focused work for a falsifiable
proof-of-concept, and tells us whether the bigger refactor is
worth the investment **without committing to it**.

---

## Open questions for the team

- **How much project-to-project variation is there?** If 80% of
  customer projects use the same ~5 attributes on `<ch5-button>`,
  build-time pruning has obvious leverage. If every project is a
  snowflake using every attribute, runtime-lazy is still useful
  but build-time prune is less so.
- **Are there signal-bound attributes whose initial subscription
  timing is load-bearing?** I.e. consumers who depend on the
  current "subscribe-in-ctor" semantics rather than the proposed
  "subscribe-when-attribute-arrives" semantics.
- **What's the appetite for shipping multiple bundles?** A
  "full" bundle and a "trimmed" bundle is the simplest delivery
  model. A per-project bundle is the strongest perf story but
  more infra.
- **Where else would this pattern apply first?** `<ch5-button>`
  is the right pilot because of its allocation density and
  per-project count. After that, `<ch5-list>` items, then the
  rest of the component family.

---

## Relationship to the rest of the doc series

- **Phase 1 (`MIGRATION.md`)** ships the lifecycle discipline this
  pattern needs.
- **Phase 2 maintainability** decomposes `Ch5Common` — without
  that, features can't cleanly opt in/out of base behaviours.
- **`BUTTON_PERFORMANCE.md`** quantifies the per-button cost
  surface this pattern attacks.
- **`LIST_VIRTUALIZATION.md`** addresses an orthogonal problem
  (rendering many items efficiently), but the same feature-registry
  idea applies to list-item templates: render only what's
  declared, install what's referenced.

This doc is the **why** and **how**. If the team is interested,
the next step is a focused two-week prototype (see "Pragmatic
suggestion" above) to make it concrete.

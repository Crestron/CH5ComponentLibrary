# `<ch5-button>` vs Bootstrap `.btn` — runtime cost on TSW-770

> Companion analysis to the CH5 architecture review.
> Sibling to `MIGRATION.md` (Phase 1 inventory) and
> `LIST_VIRTUALIZATION.md` (Phase 2 case for list family).
> Target hardware: Crestron TSW-770 (7" tabletop touch panel, embedded
> ARM, modest RAM, no GPU compositing on touch).

---

## The asymmetry (so we're honest about it)

These solve different problems:

- **Bootstrap `.btn`** is mostly CSS — a `<button>` with classes that
  pick up styling. There's *no* per-instance JS unless you opt in to
  the toggle plugin (Bootstrap 5's `button.js` is ~50 LOC, one
  delegated body-level listener for the whole page).
- **`<ch5-button>`** is a reactive custom element bound to the
  Crestron signal bus — `receiveState*` for label/icon/mode/selected,
  `sendEvent*` for press/release/click, pressable behaviour for
  panel-appropriate touch handling, and a mode-state matrix.

So a flat "Bootstrap is 30× faster" claim is misleading. But it's
also true that **the current `ch5-button` pays far more than its real
requirements demand**. The interesting part isn't that ch5 is heavier
— it's *how much* of that weight is incidental.

---

## Per-instance cost (hard numbers)

All citations are against `master` (not the Phase 1 research branch).

|                                       | Bootstrap `.btn`            | `<ch5-button>` (master) |
|---------------------------------------|-----------------------------|--------------------------|
| DOM nodes                              | **1**                       | **6–9**  *(`ch5-button-base.ts:2022–2048`)* |
| Heap objects allocated on init        | 0–1                         | **20–30**                |
| Bound closures stashed in fields      | 0                           | **~15**                  |
| Native event listeners                 | 0 (delegated, if any)       | **8–10** *(`ch5-pressable.ts:165–179`, `ch5-button-base.ts:1441–1452`)* |
| Browser-level observers                | 0                           | **2 per instance** — one `MutationObserver`, one `ResizeObserver`  *(`ch5-button-base.ts:1211, 1451`)* |
| Signal subscriptions                   | 0                           | **10+** *(`ch5-button-signal.ts:22–31` + base)* |
| Memory per instance (rough)            | < 1 KB                      | **15–25 KB**             |
| classList ops on attribute change     | 0 (CSS-driven)              | **30–40** per render *(`ch5-button-base.ts:2897–2950`)* |
| Render after `label=` change          | n/a                         | `this._elButton.innerHTML = ''` + rebuild *(line 2815)* |

A back-of-envelope for a typical panel project: ~100 buttons across
all subpages (subpages stay resident for instant switching) →
**~2 MB of button instance state alone**, on a panel that has limited
headroom for that. Plus 100 `MutationObserver`s and 100
`ResizeObserver`s, each firing independently on every relevant DOM
event.

---

## The three worst hot spots

These are the ones where the cost is *incidental* — removing them
does not change what the component does.

### 1. `updateCssClasses()` enumerates the full class set on every change *(lines 2897–2950)*

```ts
this._listOfAllPossibleComponentCssClasses.forEach(cssClass => {
  if (setOfCssClassesToBeApplied.has(cssClass)) targetEl.classList.add(cssClass);
  else targetEl.classList.remove(cssClass);
});
```

On every type/shape/size/stretch change — i.e. every signal-driven
mode flip — this walks ~40 candidate classes and calls `classList.add`
or `remove` for each. The browser observes every `classList`
mutation; with the per-instance `MutationObserver` watching for
`style` and `inert`, *each* call enters and exits the observer's
record queue. That's why ch5-button feels heavy when modes change
rapidly under signal traffic.

**Bootstrap equivalent:** a single class swap
(`.btn-primary` → `.btn-success`), or just sit on the static class
and let CSS handle hover/active/disabled via pseudo-classes.

### 2. Two browser-level observers per button *(line 1211 + 1451)*

```ts
initCommonMutationObserver(this);                                       // MutationObserver
resizeObserver(this._elContainer, this.onWindowResizeHandler.bind(this)); // ResizeObserver
```

100 buttons on a panel → 200 observers running. The
`MutationObserver` exists to detect parent-driven visibility changes
(`style`, `inert`); the `ResizeObserver` exists to handle the rare
case of vertical orientation needing re-layout. **Phase 1's
shared-observer pool already fixes this** (see `MIGRATION.md`) — but
on master it's per-instance.

**Bootstrap equivalent:** none. Buttons don't need observers.
Visibility cascades via CSS; orientation is handled by media queries.

### 3. `innerHTML = ''` + rebuild on label/icon change *(line 2815)*

```ts
this._elButton.innerHTML = '';
this._elButton.appendChild(this._elSpanForLabelOnly);
…
this._elSpanForLabelOnly.innerHTML = this._label;   // line 2600
```

Wiping and rebuilding the button's interior on every label change is
the wrong shape. It re-parses HTML, triggers layout, and destroys +
recreates the label span. A swap to `textContent =` on the existing
span is one line and orders of magnitude cheaper.

**Bootstrap equivalent:** `button.textContent = newLabel`. Done.

---

## Why ch5 is so much heavier — and what's actually load-bearing

Of the 15–25 KB per button, the part that is **genuinely required**
for CH5's semantics:

- Some signal subscriptions (label / selected / mode + send-events)
  — but probably 3–5, not 10.
- Pressable behaviour (panel touch ergonomics differ from desktop) —
  but a single delegated body-level pointer handler (Bootstrap's
  model) would do.
- A mode-state lookup (mode → visual state) — a small object, not a
  class hierarchy.
- Selected / pressed / disabled state tracking — three booleans.

The rest is **incidental**:

- The 6–9-node DOM scaffold (a single `<button>` with `::before` /
  `::after` pseudo-elements or an inline `<i>` could cover icon +
  label).
- The per-instance observers (Phase 1 pools fix this).
- The 30+-class enumeration (a state-diff-based approach replaces it).
- Eager allocation of `Ch5Properties`, `Ch5ButtonSignal`, the binding
  closures, etc. — many could be lazy or shared.
- `Ch5Common`'s baseline cost — every button drags in the entire
  lifecycle of the 1,938-LOC common base, including parts (gestures,
  viewport intersection, custom-CSS-class binding) most buttons
  never use.

---

## Improvements, ranked by ROI on TSW-770

| # | Change | Effort | Per-button win | Notes |
|---|---|---|---|---|
| 1 | **Switch class application to a delta-set** — only `add` / `remove` classes that actually changed. | small | 30–40 classList ops → 0–2 | Pure code change inside `updateCssClasses`. Big win on signal-driven mode flips. |
| 2 | **Replace `innerHTML = ''` rebuilds with targeted `textContent` / `setAttribute` updates.** | small | One synchronous parse + reflow → none | Already isolated to label/icon paths; doesn't change the public API. |
| 3 | **Adopt the Phase 1 shared observer pools** for the per-button `MutationObserver` and `ResizeObserver`. | already done on the branch | 200 observers → 2 | This work exists; merging it deletes the per-instance observer cost across all components. |
| 4 | **Flatten the internal DOM** to 1–2 nodes (the button + an optional icon) using CSS pseudo-elements for selected / pressed dressing. | medium | 6–9 nodes → 1–2 | The visual states Bootstrap gets from `:hover` / `:active` / `:disabled` / `:focus-visible` can be reused; CH5 just adds `[data-selected]` / `[data-mode]` attribute selectors. |
| 5 | **Lazy-allocate the signal subscriptions** — only subscribe when an attribute is set (most buttons have only label + sendEvent, not all 10). | medium | 10 subs → 1–3 | Already partially in code structure; needs to be pulled out of constructor into setter paths. |
| 6 | **Delegate touch handling** — one body-level pointer router instead of per-button listeners (Bootstrap-style). | medium | 8–10 listeners → 0 per button | The delegated handler resolves `event.target.closest('ch5-button')` and routes. |
| 7 | **Skip `Ch5Common` features the button doesn't use** — gestures, viewport intersection, custom CSS binding cost time even when unused. Mixin / trait composition (the maintainability Phase 2 work) makes this possible. | large | 5–8 KB | The structural refactor flagged in the original review. |

The first three are the cheapest big wins. The combination of
(1) + (2) + (3) on master is probably a **5–10× reduction in
per-button steady-state cost** without touching the public API or
the visual design.

(4) and beyond start to look architectural — they're the same
arguments as the "decompose `Ch5Common` into mixins" recommendation
from the architecture review.

---

## On TSW-770 specifically

The relevant constraints for any 7" embedded panel:

- A single main thread shared with signal-bus traffic.
- Limited RAM, no swap — heap pressure matters more than transient
  CPU spikes.
- Modest CPU and weak / no GPU compositing on touch interactions.
- Multiple subpages typically kept resident for instant switching,
  so per-button costs multiply by the *total* component count, not
  the *visible* count.

The shape of those constraints is what makes the per-button
improvements above unusually high-ROI compared to the same change
on a desktop browser. A 5–10× per-instance reduction times 100+
buttons resident is the difference between "the panel feels snappy"
and "the panel hesitates when a subpage opens."

---

## Suggested sequencing

1. **Land Phase 1** (the research branch). That's already done; merging
   gives all components — buttons included — the shared-observer
   savings and the leak fix.
2. **Hot-spot fix #1 (delta classList) + #2 (targeted text updates)**
   inside `ch5-button-base.ts`. Contained surface, no public-API
   change, each fix can ship with its own Jest regression test using
   the Phase 1 harness.
3. **Hot-spot fix #4 (flatten DOM) + #5 (lazy subscriptions)** —
   bigger, want to do them behind a benchmark test that asserts
   DOM-node-count and observer-count per button.
4. **#6 (delegated touch) and #7 (Ch5Common decomposition)** — fold
   into the Phase 2 maintainability work.

---

## Open questions for the team

Before any of (1)–(7) becomes a real PR:

- **Visual parity.** Are there visual states today that genuinely
  require the multi-node scaffold, or is everything achievable with a
  flatter DOM + pseudo-elements?
- **Mode-state matrix.** How dynamic is mode switching in real
  customer projects? If a button typically lives in one mode and
  rarely switches, the delta-set fix is enough; if modes flip
  frequently under signal traffic, the win is bigger.
- **Signal-subscription coverage.** What percentage of `<ch5-button>`
  instances in real customer projects actually use the rarer
  receive-state attributes (`receiveStateScriptLabelHtml`,
  `receiveStateIconUrl`)? If most use only label + sendEvent, lazy
  allocation is the biggest win.
- **Pressable semantics.** Is there real divergence between
  ch5-pressable behaviour and what a delegated pointer handler could
  provide, or has Pointer Events caught up enough that we can
  retire the per-instance ch5-pressable cost?

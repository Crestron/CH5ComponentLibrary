# ch5-light-button vs ch5-button

> A lightweight, presentation-only button web component built as an alternative to the full-featured `ch5-button`. This page documents the differences, the attributes implemented, the engineering challenges, the good practices followed, and the performance results.

---

## 1. Overview

`ch5-light-button` is a **lightweight custom element** that renders a themeable button with an optional label (with optional multi-line, height-aware clamping and ellipsis truncation) and icon. Unlike `ch5-button`, it does **not** extend `Ch5Common` and carries **no** always-on signal / join / contract machinery. Instead it extends a tiny, purpose-built base class, `Ch5LightBaseClass` (which extends `HTMLElement` directly), that adds only the shared presentation attributes `show` / `noshowtype` — with no `MutationObserver` or debounce timers. Signals are supported only as a **strictly opt-in** feature: six signal attributes — `receivestatetype` (drives the button `type`), `receivestateselected` (drives the `selected` state), `receivestatelabel` (drives the label), `receivestateiconclass` (drives the icon class), `receivestateiconurl` (drives the icon URL), and `receivestatebackgroundimageurl` (drives the background image URL) — can be used, and each costs nothing (no subscription, no closure, no signal object) unless its attribute is actually present. The first two style through a separate `data-signal-*` CSS channel (their targets are pure-CSS attributes); the last four are rendered in JS and so **write straight into the corresponding static slot** (`label` / `iconClass` / `iconUrl` / `backgroundImageUrl`). Two further signals, **`receivestateenable`** and **`receivestateshow`**, are owned by the **base class** (`Ch5LightBaseClass`) rather than the button, so *every* light component inherits them. `receivestateenable` enables/disables the host and — like `type` / `selected` — styles through its own separate `data-signal-enable` CSS channel, never mutating the author's `disabled`. `receivestateshow` shows/hides the host (honouring `noshowtype`) and, because `show` is a **JS-rendered** state rather than a pure-CSS one, needs **no CSS channel at all** — it simply write-throughs the resolved value into the shared `show` slot and takes priority over the static `show` attribute. The base class also owns its first **send** signal, **`sendeventonshow`** — the outbound counterpart of `receivestateshow` — which, when set, **publishes** the host's current show state (`true` when shown, `false` when hidden) whenever the show state is (re)applied; it is stateless and, like every other signal here, costs nothing (no publish, no signal object) unless its attribute is present. Beyond signals, the button raises the same **user-interaction events** as `ch5-button`: it publishes a momentary boolean on **click** through the opt-in `sendeventonclick` send signal (press → `true`, release → `false`, and — mirroring `ch5-button` — **repeat-digital** re-sends `true` every 200 ms while held), it re-emits the native **`focus`** and **`blur`** DOM events from the host so consumers can listen on `<ch5-light-button>` directly (these events don't bubble, and in the flattened light DOM the real target is the inner `<button>`, so the component clones and re-dispatches them from the host), and it exposes a **`pressed`** visual state plus bubbling **`press`** / **`release`** DOM events via a lightweight, shared `Ch5LightPressable` helper (the perf-preserving counterpart of `Ch5Pressable` — no RxJS, no `Ch5Common`). It is designed for pages that need a large number of visually-rich buttons where control-system binding is mostly not required, and where **render performance at scale** is the priority.

> This is **version one**. It intentionally ships a focused set of attributes that cover the most common presentation needs. Additional capabilities will be introduced **incrementally** in later versions (see the roadmap in section 2).

| | ch5-button | ch5-light-button |
|---|---|---|
| Base class | `Ch5Common` → `Ch5CommonInput` → `HTMLElement` | `Ch5LightBaseClass` → `HTMLElement` |
| Purpose | Full interactive control (signals, modes, feedback) | Presentation / lightweight button |
| Signal / join support | Yes (`receiveState*`, `sendEventOn*`, contracts) | Opt-in signals — six on the button (`receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl`) plus `receivestateenable` and `receivestateshow` on the base class, and two send signals — `sendeventonclick` (button) and `sendeventonshow` (base class); zero cost when unused |
| Multi-mode support | Yes (`ch5-button-mode`, `-mode-state`, `-label`) | No |
| Styling of variants | Mix of JS class toggling + CSS | 100% CSS attribute selectors |
| DOM depth | Host → wrapper `div` → `button` → (label, icon, checkbox, span) | Host → `button` → (icon, label) |
| Per-instance JS work | High | Minimal |

---

## 2. Attributes implemented in ch5-light-button

The component's own JavaScript handles **six** presentation attributes (`label`, `iconclass`, `iconurl`, `backgroundimageurl`, and the two label-wrapping attributes `multilinesupport` / `truncatetext`) plus **six opt-in signal** attributes (`receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl`). Two more — `show` and `noshowtype` — are handled in JavaScript by the shared lightweight base class (`Ch5LightBaseClass`), and `disabled` is resolved with **pure CSS**. The base class also adds lightweight **diagnostics** — `debug` / `trace` logging plus a reflected, framework-unique `data-ch5-id` — an automatic accessibility **`role`**, and its own opt-in signals **`receivestateenable`** (enable/disable, styled through a separate `data-signal-enable` CSS channel), **`receivestateshow`** (show/hide, honouring `noshowtype`, driven by a **write-through** into the `show` slot with **no CSS change**) and the **send** signal **`sendeventonshow`** (publishes the host's show state, `true`/`false`, whenever it changes), all engineered to cost effectively nothing when unused (no logger is allocated while logging is off; `role` / `id` / `data-ch5-id` are never observed; and no base signal allocates any signal machinery unless its attribute is present). The standard HTML attributes **`id`**, **`class`** and **`style`** are supported **natively** — the browser reflects and applies them directly on the host with no component JS. Everything else is **pure CSS**, driven by attribute selectors on the host element.

| Attribute | Handled by | Values | Notes |
|---|---|---|---|
| `label` | **JavaScript** | any string | Renders a `<span class="ch5-light-button--label">`; created lazily only when a label is present. |
| `labelInnerHTML` | **JavaScript** | any HTML string | Renders **raw HTML** into the label span (via `innerHTML` after `decodeInnerHTMLForAttribute`), mirroring `ch5-advance-button` / `ch5-text`. Sits third in the label-source priority (see below): it outranks the plain-text `label` but yields to either label signal. Reuses the same lazy `<span>` and the shared `_onLabelChange` render callback; the decode + `innerHTML` write cost is paid **only** by buttons that actually set it (text-only buttons still use the cheaper `textContent` path). |
| `receivestatescriptlabelhtml` | **JavaScript (opt-in signal)** | a string signal name | Subscribes to a Crestron **string** signal and **writes its value straight into the `scriptLabelHtml` slot** (the **write-through** pattern), then re-renders through `handleLabel` as **HTML** (decoded via `decodeInnerHTMLForAttribute`). Ranks **HIGHEST** of the four label sources — the resolved order is `receivestatescriptlabelhtml` > `receivestatelabel` > `labelinnerhtml` > `label`. Because both label signals write into their own slots (`scriptLabelHtml` / `label`), the active branch is chosen by which signal **name** is present, so a signal always outranks the static HTML/text below it — decided by a few cheap store reads, **one branch only**, no allocation. **Strictly opt-in and zero-cost when absent** (no signal object/subscription/closure unless the attribute is set); reuses the shared lazy `Ch5LightSignal` helper, torn down on disconnect and re-established on reconnect. |
| `multilinesupport` | **JavaScript** (+ CSS classes) | bare `multilinesupport`, `true`, `false` (default `false`) | Enables multi-line label text. When `true`, the label wraps and is **clamped to the number of lines that fit the button's current height** (the button is never resized), written as an inline `-webkit-line-clamp` (or an inline `max-height` when `truncatetext="false"`). When `false` (default) the label stays on one line. The visual is driven by CSS classes (`--label-multiline-support-true`/`-false`); only this opt-in path performs a **layout measurement**, and it runs **only while `multilinesupport` is on**, so single-line buttons pay no measurement cost. Unlike `ch5-button` there is **no `ResizeObserver` / viewport / resize listener** (the light family bans them): the clamp is (re)measured on connect and on label/attribute changes only. Shares one cached callback (`updateLabelTextWrapping()`) with `truncatetext`. |
| `truncatetext` | **JavaScript** (+ CSS classes) | bare `truncatetext`, `true`, `false` (default `true`) | Truncates overflowing label text with an ellipsis. Defaults to `true`: a single-line ellipsis (`text-overflow:ellipsis`) when `multilinesupport` is off, or an ellipsis on the last visible line when it is on (`-webkit-line-clamp`). When `false` the text is clipped **without** an ellipsis (a `max-height` clamp in multi-line mode). Driven by CSS classes (`--label-truncate-text-true`/`-false`) and shares the same `updateLabelTextWrapping()` path as `multilinesupport`, so the **default single-line ellipsis is pure CSS** (the default classes) — the JS measurement only runs when `multilinesupport` is on. |
| `iconclass` | **JavaScript** | Font Awesome / Material class(es) | Renders an `<i class="ch5-light-button--icon ...">`; created lazily only when present. |
| `iconurl` | **JavaScript** | any image URL | Renders the icon as a background image on an `<i class="ch5-light-button--img">`. **Takes priority over `iconclass`** — when both are set, `iconurl` wins (the `--img` and `--icon` classes are mutually exclusive, matching `ch5-button`). Created lazily. |
| `backgroundimageurl` | **JavaScript** | any image URL | Applies the URL as an inline `background-image` **directly on the `<button>` element** (same approach as `ch5-button`). A URL from an attribute cannot be injected with pure CSS, so only this one line runs in JS. |
| `receivestatetype` | **JavaScript (opt-in signal)** | a string signal name | Subscribes to a Crestron **string** signal and writes its value (validated against the `type` list; unknown values fall back to `default`) to a **separate `data-signal-type` attribute — never the author's `type`**. The theme SCSS styles `[data-signal-type]` with priority over `[type]` (static `[type]` selectors carry a `:not([data-signal-type])` guard), so the signal has **absolute priority over the static `type` even if `type` is changed at runtime** — with no JS observe/render step. Removing the attribute simply removes `data-signal-type`, so the author's static `type` styles the button again. **Strictly opt-in and zero-cost when absent**: no signal object, subscription, or closure is created unless the attribute is present. Reuses the shared `Ch5SignalFactory`; the subscription is torn down on disconnect and re-established on reconnect. It shares its lazy subscription helper with `receivestateselected`. |
| `receivestateselected` | **JavaScript (opt-in signal)** | a boolean signal name | Subscribes to a Crestron **boolean** signal and writes its value to a **separate `data-signal-selected` attribute — never the author's `selected`**. The theme SCSS styles `[data-signal-selected]` with priority over `[selected]` (static `[selected]` selectors carry a `:not([data-signal-selected])` guard), so the signal has **absolute priority over the static `selected` even if `selected` is changed at runtime** — with no JS observe/render step. `data-signal-selected="true"` applies the selected look; `"false"` forces the not-selected look while still suppressing the static `selected`, so the signal can drive **either** state. The selected colours are type-dependent, so each signal rule resolves the effective type the same way the `type` channel does (`data-signal-type` wins over `type`). Removing the attribute removes `data-signal-selected`, so the author's static `selected` styles the button again. **Strictly opt-in and zero-cost when absent**: no signal object, subscription, or closure is created unless the attribute is present. Reuses the same lazy `Ch5LightSignal` helper as `receivestatetype`; the subscription is torn down on disconnect and re-established on reconnect. |
| `receivestateiconclass` | **JavaScript (opt-in signal)** | a string signal name | Subscribes to a Crestron **string** signal and **writes its value straight into the `iconClass` slot** (the same property the static `iconclass` uses), then re-renders through the normal icon pipeline. Unlike `type` / `selected` (which use a separate `data-signal-*` CSS channel), the icon is **rendered in JS**, so there is no CSS channel to duplicate — the signal simply supersedes the static value (the **write-through** pattern, same as `ch5-animation`). Relies on the platform contract that only the signal updates the icon class at runtime (the static `iconclass` is design-time only), so the signal is always the last writer and always wins. **Strictly opt-in and zero-cost when absent.** Reuses the shared lazy `Ch5LightSignal` helper; torn down on disconnect, re-established on reconnect. |
| `receivestateiconurl` | **JavaScript (opt-in signal)** | a string signal name | Same **write-through** pattern as `receivestateiconclass`, but into the `iconUrl` slot. `iconurl` still wins over `iconclass`, so a signal-driven URL renders the `--img` variant. The `iconurlfilltype` CSS keeps working unchanged because it is scoped to `[iconurlfilltype]` and the JS-created `--img` element (**not** to the `[iconurl]` attribute). **Opt-in and zero-cost when absent.** |
| `receivestatebackgroundimageurl` | **JavaScript (opt-in signal)** | a string signal name | Same **write-through** pattern into the `backgroundImageUrl` slot (inline `background-image` on the `<button>`). **Additionally reflects the `backgroundimageurl` attribute onto the host** so the `backgroundimageurlfilltype` CSS — which is scoped to `ch5-light-button[backgroundimageurl]` — matches for signal-driven URLs exactly as it does for static ones. Without this reflection the fill type would be ignored when the URL comes from a signal. **Opt-in and zero-cost when absent.** |
| `receivestatelabel` | **JavaScript (opt-in signal)** | a string signal name | Same **write-through** pattern as `receivestateiconclass`, but into the `label` slot (`handleLabel` renders/updates the `<span class="ch5-light-button--label">`). This is the simplest write-through case — the label has no fill-type CSS, so no host-attribute reflection is needed. Relies on the platform contract that only the signal updates the label at runtime (the static `label` is design-time only), so the signal is always the last writer and always wins. **Opt-in and zero-cost when absent.** |
| `sendeventonclick` | **JavaScript (opt-in signal, send)** | a boolean signal name | The first **send** (outbound) signal, now **driven by the always-on pressable** rather than its own pointer listeners. On press it publishes **`true`** and then, mirroring `ch5-button`, **retriggers `true` every 200 ms while the button is held** (**repeat-digital**); on release it publishes a final **`false`**. Each tick is sent in the **repeat-digital object form** — `{ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value }` (i.e. `{ "repeatdigital": true/false }`) via the stateless `Ch5LightSignal.sendRepeatDigital()` → `getObjectAsBooleanSignal(name).publish({ repeatdigital: value })` — **exactly like `ch5-button` / `ch5-image` / `ch5-dpad`**, so the control system handles the auto-repeat identically to the heavy twin (this is why the light button uses the object form for the *click* signal, while `sendeventonshow`, a plain digital, still uses the plain-boolean `sendBoolean()`). The send is wired as the pressable's `onChange` (`handlePressedChange()` → `startClickRepeatDigital()` / `stopClickRepeatDigital()`), so it shares the pressable's single `pointerdown` listener (no duplicate listener) and is force-released on `blur` too. **Strictly opt-in and zero-cost when absent**: `startClickRepeatDigital()` early-returns before allocating the `setInterval` unless a signal name is set. A `disabled` button (button `pointer-events:none`) never presses, so nothing is sent while disabled. |
| `click` (event) | **native** (browser default) | — (not an attribute) | The plain DOM **`click`** event needs **no component code at all** — it is handled entirely by **default browser behaviour**. Unlike `focus` / `blur`, `click` **bubbles**, so the inner `<button>`'s native click propagates up through the flattened light DOM to the host on its own; a consumer can add a `click` listener on `<ch5-light-button>` and it just works. The component neither attaches a `click` listener nor re-dispatches anything (only `focus`/`blur`, which don't bubble, need that). Note this is separate from `sendeventonclick`, which is the opt-in Crestron **signal** version of a press/release — the native `click` event is always available regardless of whether `sendeventonclick` is set. |
| `focus` (event) | **JavaScript (DOM event)** | — (not an attribute) | A native DOM **event**, not an attribute — re-emitted from the host so consumers can listen on `<ch5-light-button>` directly. The listener sits on the inner `<button>`; the handler **clones the event and re-dispatches it from the host** (`new Event('focus', event)` → `dispatchEvent(this)`), then `preventDefault()` + `stopPropagation()` the original. Required because `focus` **does not bubble**, so in the flattened light DOM (inner `<button>` is a child of the host) a host-level listener would otherwise never fire. **Always wired** (it carries no signal), with a cached `_onFocus` handler and a `_focusListenersWired` guard; wired in `connectedCallback`, torn down in `disconnectedCallback`. Idle cost is ~0 — it fires only on a real focus change. Mirrors `ch5-button`. |
| `blur` (event) | **JavaScript (DOM event)** | — (not an attribute) | The counterpart of `focus`, handled identically: a native DOM **event** re-dispatched from the host via the same `reDispatchFocusEvent()` path (clone → `dispatchEvent(this)` → `preventDefault()` + `stopPropagation()`), because `blur` also **does not bubble**. **Always wired** with a cached `_onBlur` handler under the same `_focusListenersWired` guard. On blur it also **force-releases any in-flight press** (`_pressable.setPressed(false)`) so a button that loses focus mid-press does not stay stuck `pressed` — matching `ch5-button`, whose `_onBlur` also does `this.pressed = false`. |
| `press` / `release` (events) + `pressed` (state) | **JavaScript (shared `Ch5LightPressable`)** | — (not attributes) | The button's press/release behaviour, provided by the **shared, lightweight `Ch5LightPressable`** helper in `ch5-light-base` (the perf-preserving counterpart of `Ch5Pressable`). On press (`pointerdown`) it sets the host **`pressed`** attribute (themed in **pure CSS** via `ch5-light-button[pressed]` — see the theme-editor `_light-button-pressed.scss`, generated per type like `[selected]` and imported after it so an active press overrides the selected look) and dispatches a bubbling **`press`** CustomEvent from the host; on release (`pointerup` / `pointerleave` / `pointercancel`) it removes `pressed` and dispatches a bubbling **`release`** event. It also exposes an **`onChange`** callback, which the button uses to drive the `sendeventonclick` send signal + repeat-digital (above). **Always wired** (like `focus`/`blur`, not signal-gated) so consumers can always listen on `<ch5-light-button>`. Listens on the inner `<button>`, so a `disabled` (`pointer-events:none`) button blocks presses for free. On **touch panels** the inner `<button>` sets **`touch-action: none`** in the theme CSS so a finger moving *within* the button does not trigger a scroll gesture (which fires `pointercancel`) and release the press mid-drag — mirroring `ch5-button`'s press-time `touch-action: none`, but declaratively (no JS). Because touch also does **implicit pointer capture** (so `pointerleave` won't fire when the finger slides off), the pressable additionally runs a **`pointermove` hit-test** while pressed and releases once the pointer leaves the button's bounds (matching `ch5-button`'s move tracking). **Perf:** the pressable keeps only **one idle `pointerdown` listener** and wires the `up`/`leave`/`cancel` release listeners **lazily, only while a press is in flight**; all handlers are cached and the `press`/`release` events are created once. |
| `receivestateenable` | **JavaScript (opt-in signal, base class)** | a boolean signal name | One of **two signals owned by the base class** (`Ch5LightBaseClass`), so it is available to *every* light component, not just the button. Subscribes to a Crestron **boolean** signal (`true` = enabled, `false` = disabled — matching `Ch5Common.receiveStateEnable`) and writes the resolved state to a **separate `data-signal-enable` attribute — never the author's `disabled`**. The theme SCSS guards the static `[disabled]` rule with `:not([data-signal-enable])` and styles `[data-signal-enable="false"]` as disabled, so the signal has **absolute priority over the static `disabled` even if `disabled` is toggled at runtime** — with no JS observe/render step — while the author's own `disabled` attribute is **preserved and restored** the moment the signal is removed. **Strictly opt-in and zero-cost when absent**: the base allocates no signal helper, subscription, or closure unless the attribute is present, and its lazy `Ch5LightSignal` helper is kept **separate** from the button's so the two never clash. The signal name is stored in the shared `Ch5LightProperties` store (same pattern as `receivestateselected`); the subscription is torn down on disconnect and re-established on reconnect. |
| `receivestateshow` | **JavaScript (opt-in signal, base class)** | a boolean signal name | The base class's **second** signal (also inherited by *every* light component). Subscribes to a Crestron **boolean** signal (`true` = shown, `false` = hidden — matching `Ch5Common.receiveStateShow`) and shows/hides the host **honouring the current `noshowtype`** (`display` / `visibility` / `remove`) exactly like the static `show` attribute, because it drives the **same `handleShow()` path**. Unlike `receivestateenable`, `show` is a **JS-rendered** state (not pure CSS), so there is **no separate `data-signal-*` channel and no CSS change**: the resolved value is **written straight into the `show` slot** (the **write-through** pattern, like `label` / `iconclass`) and re-applied. While bound it has **priority over the static `show` attribute** — the `show` setter is guarded so direct `show` writes are ignored — and because the author's `show` attribute is **never mutated**, clearing the signal **restores** it. **Strictly opt-in and zero-cost when absent**: reuses the base's same lazy `Ch5LightSignal` helper as `receivestateenable` (subscriptions are keyed by name, so both coexist) and its name is stored in the shared `Ch5LightProperties` store. Torn down on disconnect and re-established on reconnect; a `noshowtype="remove"` self-hide deliberately keeps the subscription alive so a later `true` can reattach the host. |
| `sendeventonshow` | **JavaScript (opt-in signal, send · base class)** | a boolean signal name | The base class's first **send** (outbound) signal — the counterpart of `receivestateshow`, inherited by *every* light component (mirrors `Ch5Common.sendEventOnShow`). Whenever the show state is (re)applied through the base's `handleShow()`, it **publishes** the current show value — **`true`** when shown, **`false`** when hidden — as a plain **boolean** (via the stateless `Ch5LightSignal.sendBoolean()`, i.e. `getBooleanSignal(name).publish(value)`, *not* the repeat-digital object form). Because the publish is driven from the single `handleShow()` chokepoint, it fires no matter what changed the visibility — the static `show` attribute, the `receivestateshow` signal, or a programmatic write. **Strictly opt-in and zero-cost when absent**: it is a single property read plus a truthiness check on the hot path, so nothing is published or allocated unless the attribute is set; when set, publishing reuses the base's same lazy `Ch5LightSignal` helper. Being **stateless** there is no subscription or listener — so, unlike the receive signals, there is **nothing to tear down** on disconnect. The signal name is stored in the shared `Ch5LightProperties` store; setting it needs **no change callback** (the value is only ever published from the show path). |
| `show` | **JavaScript** (base class) | `true` (default), `false` | Shows / hides the host. Handled by `Ch5LightBaseClass` with **no signals** — it toggles a lightweight host CSS class (or performs a DOM detach for `noshowtype="remove"`). The hide strategy is chosen by `noshowtype`. Can be overridden at runtime by the base class's `receivestateshow` signal, which **write-throughs** the resolved value into this same `show` slot and takes priority while bound (the `show` setter ignores direct writes then), restoring the author's `show` when removed. |
| `noshowtype` | **JavaScript** (base class) | `display` (default), `visibility`, `remove` | Chooses how `show="false"` hides the element: `display` → adds `ch5-hide-dis` (`display:none`); `visibility` → adds `ch5-hide-vis` (`visibility:hidden`, keeps its layout space); `remove` → detaches the host from the DOM (caching parent / next sibling) and reattaches it when shown again. Mirrors `ch5-button` / `Ch5BaseClass` semantics, implemented by toggling two lightweight host CSS classes (shipped in the theme) rather than writing inline styles. |
| `debug` | **JavaScript** (base class) | bare `debug`, `true`, `false` | Turns on per-instance debug logging (same semantics as `ch5-button` / `Ch5Common`). **Observed and reactive**, so it can be toggled at runtime. **Allocation-free when off:** the logger object is created **lazily**, only on the first log emitted while `debug`/`trace` is on, so 1000+ idle buttons allocate **zero** loggers. The logger reused is the shared leaf `Ch5CommonLog` (imports only `Ch5Debug`), so enabling logging pulls in **no** heavy `ch5-common` code. |
| `trace` | **JavaScript** (base class) | bare `trace`, `true`, `false` | Turns on trace logging and wraps each method entry/exit in a console **group** (mirrors `ch5-button`). Same lazy, allocation-free logger as `debug`. `console.group` / `console.groupEnd` are **feature-detected**, so `trace` is safe on runtimes (e.g. some panels) that don't implement them — it falls back to a plain `console.log`. |
| `role` | **JavaScript** (base class, **non-observed**) | any ARIA role | Accessibility role applied **once** in `connectedCallback`, and **only when the author has not set one** — a user-provided `role` always wins. The default comes from the component itself (`ch5-light-button` → `button`). Non-observed, so it costs a single `hasAttribute` check per connect (plus one `setAttribute` on the first connect only) and never runs on the attribute-change path. Kept dependency-free — see §3. |
| `id` | **native** (non-observed) | any string | The standard reflected HTML `id`. No JS is added — the browser reflects `id` ↔ property natively. |
| `class` | **native** (non-observed) | any class list | Standard HTML `class` on the host. No JS is added — the browser applies it natively, and it composes with the component's own `ch5-light-button` host class. (The component only ever writes `classList` on its **internal** `<button>`, never on the host, so an author's host classes are never touched.) |
| `style` | **native** (non-observed) | any inline CSS | Standard inline `style` on the host. No JS is added — the browser applies it natively. (The component only ever writes `.style` on its **internal** elements, e.g. the icon/background, never on the host.) Note the host's own `display` still comes from the theme; author host styles layer on top. |
| `data-ch5-id` | **JavaScript** (base class, reflected · read-only) | auto `cr-id-N` | A framework-unique id assigned to **every** instance (from `Ch5Uid`, a counter increment) and reflected onto the host **once** in `connectedCallback` (idempotent on reconnect), exactly like `ch5-button` / `ch5-image` / `ch5-common`. Purely for inspection / diagnostics — not authored; read it in code via `getCrId()`. |
| `disabled` | **CSS** | bare `disabled`, `true`, `false` | Greys out the button and blocks interaction (`pointer-events:none`, `user-select:none`, reduced opacity). The element is disabled for a bare `disabled` attribute or `disabled="true"`, but **not** for `disabled="false"` (case-insensitive). Resolved purely with the CSS selector `ch5-light-button[disabled]:not([disabled="false" i])` — no JavaScript. |
| `selected` | **CSS** | bare `selected`, `true`, `false` | Applies the selected visual state (per-type background, border, label and icon colours) using the existing `--ch5-light-button--{type}-selected-*` theme variables. Rules are generated per type and scoped to `ch5-light-button[type="…"][selected]:not([selected="false" i])` (plus a default-type variant), so each `[selected]` selector wins on specificity over its base type without `!important`. `selected="false"` is treated as not-selected. This is the **static** selected look only — no JS, no signal/toggle behaviour; a consumer sets or removes the attribute itself. It can be overridden at runtime by the `receivestateselected` signal, which styles through a **separate** `data-signal-selected` channel (every static `[selected]` selector is guarded with `:not([data-signal-selected])`), so the signal wins while active. |
| `iconposition` | **CSS** | `first` (default), `last`, `top`, `bottom` | Uses the CSS `order` property, so DOM order is irrelevant. Applies to both the `--icon` and `--img` variants. |
| `halignlabel` | **CSS** | `center` (default), `left`, `right` | Horizontally aligns the icon + label group inside the `<button>`. Pure CSS: maps to the flex container's `justify-content` (row layouts) or `align-items` (column layouts, i.e. `iconposition="top"/"bottom"`), plus `text-align` on the label for multi-line text. The `center` default is the flex centering already set by `iconposition`, so only `left`/`right` add rules. |
| `valignlabel` | **CSS** | `middle` (default), `top`, `bottom` | Vertically aligns the icon + label group inside the `<button>`. Pure CSS: maps to the flex container's `align-items` (row layouts) or `justify-content` (column layouts). The `middle` default is the flex centering already set by `iconposition`, so only `top`/`bottom` add rules. |
| `checkboxshow` | **CSS** | bare `checkboxshow`, `true`, `false` | Shows a checkbox glyph on the button. Rendered **purely** with a `::before` pseudo-element on the inner `<button>` (no extra DOM, no JavaScript) - just another flex child positioned with the CSS `order` property. Shows an unchecked box (☐, `\2610`) by default and the checked box (☑, `\2611`) when the button is **selected**. Selected is resolved from both channels used by `selected`: the static `selected` attribute (guarded with `:not([data-signal-selected])`) and the `receivestateselected` signal's `data-signal-selected="true"`, so the signal keeps priority with no JS. Only shown for `checkboxshow="true"`. |
| `checkboxposition` | **CSS** | `left` (default), `right` | Positions the checkbox glyph relative to the icon/label group by setting the `order` of the `::before` (`left` = `order:-1`, `right` = `order:100`), so it works regardless of DOM order or `iconposition`. Pure CSS, only the `right` value adds a rule over the `left` default. |
| `iconurlfilltype` | **CSS** | `null` (default), `stretch`, `stretch-aspect`, `center`, `tile`, `initial` | Sets how the `iconurl` image fills the button via the CSS `background-size` property. Only affects the `--img` (iconUrl) variant, never the `--icon` font glyph. For `stretch` / `stretch-aspect` / `center` / `tile` the image is taken out of flow and stretched to fill the whole button, with the label kept on top (`z-index`). |
| `backgroundimageurlfilltype` | **CSS** | `stretch-aspect` (default), `stretch`, `center`, `tile` | Sets how the `backgroundimageurl` image fills the button via the CSS `background-size` / `background-position` / `background-repeat` properties, applied to the `<button>` element itself. Rules are scoped to `ch5-light-button[backgroundimageurl]` so buttons without a background image are never matched. Matches `ch5-button`'s `BACKGROUND_IMAGE_FILL_TYPE`. |
| `shape` | **CSS** | `rounded-rectangle` (default), `rectangle`, `circle`, `oval`, `tab` | Attribute selectors + a shape mixin. |
| `size` | **CSS** | `regular` (default), `x-small`, `small`, `large`, `x-large` | Attribute selectors + a size mixin. |
| `type` | **CSS** | `default`, `primary`, `secondary`, `info`, `success`, `warning`, `danger`, `text` | Attribute selectors + a content/colour mixin. The author's `type` attribute is **never mutated** by the component. It can be overridden at runtime by the `receivestatetype` signal, which styles through a **separate** `data-signal-type` channel (see below); every static `[type]` selector is guarded with `:not([data-signal-type])` so the signal wins while active. |
| `stretch` | **CSS** | `width`, `height`, `both` | Overrides only the stretched dimension; keeps a per-size min-height. |

### Roadmap — introduced step by step

`ch5-light-button` follows a phased approach. **Version one** implements the attributes listed above. The following `ch5-button` capabilities are **not part of version one** and are candidates to be introduced in later versions as the need arises:

`mode`, `orientation`, `sgIcon*`, `customClass`, `customStyle`, `formType`, and the remaining `receiveState*` / `sendEventOn*` signal attributes (of the signal attributes, only `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestatescriptlabelhtml`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl`, and the base class's `receivestateenable` / `receivestateshow`, plus the send signals `sendeventonclick` and `sendeventonshow`, are implemented in version one).

Keeping the initial surface small is deliberate — it is what lets version one stay lightweight and fast at scale. Features will be added only when required, so the component grows in controlled steps rather than carrying the full `ch5-button` weight up front.

---

## 3. What we changed compared to ch5-button

1. **Removed the `Ch5Common` inheritance.** `ch5-light-button` extends a tiny `Ch5LightBaseClass` (which extends `HTMLElement` directly). The base class adds only `show` / `noshowtype` (and the `disabled` attribute contract) with **no** always-on signal machinery. This removes, per instance: the property registry, the `MutationObserver`, blanket signal subscription/unsubscription, debounce timers, and the common attribute-processing pipeline. Signals are re-introduced only as **opt-in** `receivestatetype` / `receivestateselected` / `receivestatelabel` / `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl` attributes that subscribe lazily and cost nothing when unused.
2. **Removed the wrapper `<div>`.** In `ch5-button` the primary class lives on an internal wrapper `div`. In `ch5-light-button` the **host element itself** carries the `ch5-light-button` class and the `<button>` is its only structural child. This flattens the DOM.
3. **Moved all variant styling to CSS.** `shape`, `size`, `type`, `stretch`, `iconposition`, `halignlabel`, `valignlabel`, `selected`, `checkboxshow`, `checkboxposition`, `iconurlfilltype`, and `backgroundimageurlfilltype` are resolved entirely with **attribute selectors** (e.g. `ch5-light-button[shape="circle"]`) and **CSS custom properties**. No JavaScript runs for these. The checkbox in particular is drawn with a `::before` glyph (☐ / ☑) so it needs no extra DOM either.
4. **Minimised the JavaScript surface.** Only `label`, `iconclass`, `iconurl`, `backgroundimageurl`, and the two label-wrapping attributes `multilinesupport` / `truncatetext` are processed in JS, and all elements are created **lazily** (only when a value is present). When both `iconurl` and `iconclass` are set, `iconurl` wins. `backgroundimageurl` is a single inline-style assignment on the `<button>` (no element created). The six opt-in signal attributes subscribe only when present. `receivestatetype` and `receivestateselected` write their resolved values to separate `data-signal-type` / `data-signal-selected` attributes — styling stays 100% CSS, and the author's `type` / `selected` are never mutated. The other four (`receivestatelabel` / `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl`) drive JS-rendered content, so they **write straight into** the corresponding `label` / `iconClass` / `iconUrl` / `backgroundImageUrl` slot and re-render through the normal pipeline (`receivestatebackgroundimageurl` also reflects the `backgroundimageurl` host attribute so the fill-type CSS matches).
5. **Single, off-DOM build.** The button subtree is built while detached and appended to the host in **one** DOM mutation.
6. **Added lightweight diagnostics and accessibility in the base class.** `debug` / `trace` bring the same logging as `ch5-button`, but the logger is created **lazily** (never while logging is off) and reuses the leaf `Ch5CommonLog`, so idle buttons allocate nothing. Every instance gets a framework-unique `data-ch5-id` (from `Ch5Uid`) reflected once on connect. An accessibility `role` is applied automatically (and only when the author hasn't set one), kept **non-observed** and dependency-free. See the subsection below.
7. **Added the base class's first opt-in signal, `receivestateenable`.** Unlike the button's six signals, this one lives on `Ch5LightBaseClass`, so **every** light component inherits an enable/disable receive signal for free. It follows the same **separate-channel** model as `type` / `selected`: the resolved boolean is written to a `data-signal-enable` attribute (never the author's `disabled`), and the theme guards the static `[disabled]` rule with `:not([data-signal-enable])`. This gives the signal absolute priority over a static `disabled` while **preserving and restoring** the author's attribute, with no JS render step. It stays strictly opt-in and zero-cost when absent (its own lazy `Ch5LightSignal` helper, separate from the button's), and stores its signal name in the shared `Ch5LightProperties` store exactly like `receivestateselected` — so no dedicated per-instance field is needed. See the subsection below.
8. **Added the base class's second opt-in signal, `receivestateshow`.** Also on `Ch5LightBaseClass`, so every light component inherits a show/hide receive signal for free. Unlike `receivestateenable`, it needs **no CSS change**: `show` is a JS-rendered state, so instead of a separate `data-signal-*` channel it uses the **write-through** approach (like `label` / `iconclass`) — the resolved boolean is written straight into the shared `show` slot and re-applied through the same `handleShow()` path, so `noshowtype` (`display` / `visibility` / `remove`) is honoured identically. While bound it takes **priority over the static `show` attribute** (the `show` setter ignores direct writes), and because the author's `show` is never mutated it is **restored** when the signal clears. It reuses the base's same lazy `_baseSignals` helper as `receivestateenable` and stores its name in the shared `Ch5LightProperties` store; the disconnect handler keeps the subscription alive during a `noshowtype="remove"` self-hide so a later `true` can reattach the host. See the subsection below.
9. **Added the base class's first *send* signal, `sendeventonshow`.** The outbound counterpart of `receivestateshow`, also on `Ch5LightBaseClass`, so every light component can **report** its visibility for free. It needs **no CSS change** (a send signal has nothing to style): whenever the base's `handleShow()` runs, it publishes the current show state — `true` shown / `false` hidden — as a **plain boolean** via the stateless `Ch5LightSignal.sendBoolean()` (not the repeat-digital object form). The publish is wired at the **single `handleShow()` chokepoint**, so it fires regardless of what changed the visibility (static `show`, `receivestateshow`, or a programmatic write) with no extra bookkeeping. It stays strictly opt-in and zero-cost when absent (a property read + truthiness check on the hot path; the lazy `Ch5LightSignal` helper is only touched when the attribute is set), and because it is **stateless** there is no subscription or listener and therefore nothing to tear down on disconnect. Its name is stored in the shared `Ch5LightProperties` store and — unlike the receive signals — the setter needs **no change callback**. See the subsection below.
10. **Added a lazy, observer-free multi-line label (`multilinesupport` / `truncatetext`).** The label can wrap over multiple lines, **clamped to the number of lines that fit the button's current height** (never resizing the button), with an optional ellipsis. Both attributes are JS-observed booleans that share a single cached callback (`_onLabelWrapChange` → `updateLabelTextWrapping()`), which toggles four CSS classes (`--label-multiline-support-*` / `--label-truncate-text-*`) — so the **default single-line ellipsis is pure CSS** and costs no measurement. Only the opt-in multi-line path runs a layout read (`fitEllipsisForMultiline()`), and **only while `multilinesupport` is on**. Unlike `ch5-button`, there is **no `ResizeObserver` / viewport / window-resize listener** (the light family bans them): the clamp is (re)measured on connect and on label/attribute changes only — a deliberate trade-off that keeps the component observer-free at scale. See the subsection below.
11. **Added user-interaction events — `click`, `focus`, `blur`, plus `press` / `release`.** The button reports the same interaction events as `ch5-button`. **`click`** comes in two forms: the plain DOM **`click`** event is **pure default browser behaviour** — it bubbles, so the inner `<button>`'s native click reaches the host with **no component code**; and the opt-in `sendeventonclick` **signal** (documented above) publishes a momentary **plain boolean** — `true` on press (`pointerdown`), `false` on release (`pointerup` / `pointerleave` / `pointercancel`) — attached only while the attribute is set. **`focus`** and **`blur`** are native DOM events that are **always wired** (they carry no signal, and firing only on a real focus change makes them effectively free at idle): the listeners live on the inner `<button>` and each handler **clones the event and re-dispatches it from the host** (`new Event(type, event)` → `dispatchEvent(this)` → `preventDefault()` → `stopPropagation()`). This mirrors `ch5-button` and is required because `focus`/`blur` **do not bubble** (whereas `click` does), so in the flattened light DOM (inner `<button>` is a child of the host) a listener on `<ch5-light-button>` would otherwise never fire. `handleFocus` / `handleBlur` are kept as **separate** methods (not merged) so `blur` can reset the pressed state (as `ch5-button`'s `_onBlur` does). **`press`** and **`release`** are provided by the new **shared `Ch5LightPressable`** helper (see change point #12 and the subsection below): they set the host `pressed` state and dispatch bubbling `press`/`release` events. See the subsection below.
12. **Added `Ch5LightPressable` — a shared, lightweight pressable for the whole light family.** `ch5-button` relies on `Ch5Pressable`, which imports `Ch5Common` and an RxJS `Subject` and leans on the heavy `elementIsInViewPort` / `logger` machinery — far too heavy for the light family. `Ch5LightPressable` (in `ch5-light-base`, alongside `Ch5LightSignal` / `Ch5LightProperties`) is a **dependency-free** re-implementation of the *visible* pressable behaviour: a `pressed` boolean, the host `pressed` attribute (pure-CSS themable), bubbling `press` / `release` DOM CustomEvents, an optional CSS-class toggle, and an optional `onChange(pressed)` callback. It is built for scale: a **single always-on `pointerdown` listener**, with the `pointerup` / `pointerleave` / `pointercancel` release listeners wired **lazily only while a press is in flight**; cached handlers; and the `press`/`release` events created once per instance. `ch5-light-button` wires it **always-on** (like `focus`/`blur`) on the inner `<button>`, reusing the same `init()` / `destroy()` teardown on connect/disconnect, and force-releases it on `blur`. Being in the base package it is ready to reuse across other light components. See the subsection below.

### DOM structure comparison

```html
<!-- ch5-button (simplified) -->
<ch5-button>
  <div class="ch5-button">           <!-- wrapper -->
    <button class="cb-btn">
      <i class="cb-icon"></i>
      <i class="cb-checkbox-icon"></i>
      <span class="cb-lbl">...</span>
    </button>
  </div>
</ch5-button>

<!-- ch5-light-button (iconclass variant) -->
<ch5-light-button class="ch5-light-button" shape="circle" size="large" type="danger">
  <button class="ch5-light-button--btn">
    <i class="ch5-light-button--icon fas fa-bell"></i>
    <span class="ch5-light-button--label">Test 5</span>
  </button>
</ch5-light-button>

<!-- ch5-light-button (iconurl variant + iconurlfilltype) -->
<ch5-light-button class="ch5-light-button" iconurl="assets/img/bell.png" iconurlfilltype="stretch">
  <button class="ch5-light-button--btn">
    <i class="ch5-light-button--img" style="background-image:url('assets/img/bell.png')"></i>
    <span class="ch5-light-button--label">Test 5</span>
  </button>
</ch5-light-button>

<!-- ch5-light-button (backgroundimageurl variant + backgroundimageurlfilltype) -->
<ch5-light-button class="ch5-light-button" backgroundimageurl="assets/img/bg.png" backgroundimageurlfilltype="stretch">
  <button class="ch5-light-button--btn" style="background-image:url('assets/img/bg.png')">
    <span class="ch5-light-button--label">Test 5</span>
  </button>
</ch5-light-button>
```

### CSS change for `receivestatetype` (the separate styling channel)

The signal is styled through its **own** attribute channel so it never mutates the author's `type`. Two things changed in the theme SCSS (`_light-button-type.scss`):

**1. Every static `[type]` selector is now guarded with `:not([data-signal-type])`** — so while a signal is active the static rules stop matching:

```scss
/* BEFORE — static type was the only channel */
ch5-light-button:not([type="primary"])…:not([type="secondary"]) {
  @include ch5-light-button-content("default");
}
@each $type in $ch5-light-button--types {
  ch5-light-button[type="#{$type}"] {
    @include ch5-light-button-content($type);
  }
}

/* AFTER — static channel is disabled whenever data-signal-type is present */
ch5-light-button:not([type="primary"])…:not([type="secondary"]):not([data-signal-type]) {
  @include ch5-light-button-content("default");
}
@each $type in $ch5-light-button--types {
  ch5-light-button[type="#{$type}"]:not([data-signal-type]) {
    @include ch5-light-button-content($type);
  }
}
```

**2. A new parallel `[data-signal-type]` channel was added** — the JS writes the resolved signal value here (never to `type`), and these rules win because they are the only ones matching while the signal is active:

```scss
/* NEW — signal styling channel (default is explicit; the signal always
   resolves to a valid type) */
ch5-light-button[data-signal-type="default"] {
  @include ch5-light-button-content("default");
}
@each $type in $ch5-light-button--types {
  ch5-light-button[data-signal-type="#{$type}"] {
    @include ch5-light-button-content($type);
  }
}
```

**Result:** the signal has **absolute priority** over the static `type` — even if the author changes `type` at runtime — with **zero JS render/observe step** (one `setAttribute` on the host). Removing the `receivestatetype` attribute removes `data-signal-type`, so the author's static `type` styles the button again. The cost is paid in CSS: each type's colour rules are declared **twice** (once per channel). The JS constant `Ch5LightButton.SIGNAL_TYPE_ATTRIBUTE = 'data-signal-type'` must stay in sync with these selectors.

### CSS change for `receivestateselected` (the separate styling channel)

Exactly like `receivestatetype`, the selected signal is styled through its **own** attribute channel so it never mutates the author's `selected`. Two things changed in the theme SCSS (`_light-button-selected.scss`):

**1. Every static `[selected]` selector is now guarded with `:not([data-signal-selected])`** — so while a signal is active the static rules stop matching:

```scss
/* BEFORE — static selected was the only channel */
ch5-light-button[type="#{$type}"][selected]:not([selected="false" i]) {
  @include ch5-light-button-selected-set($type);
}

/* AFTER — static channel is disabled whenever data-signal-selected is present */
ch5-light-button[type="#{$type}"][selected]:not([selected="false" i]):not([data-signal-selected]) {
  @include ch5-light-button-selected-set($type);
}
```

**2. A new parallel `[data-signal-selected="true"]` channel was added** — the JS writes `"true"` / `"false"` here (never to `selected`). Because the selected colours depend on the effective type, each rule resolves the type the same way the type channel does (`data-signal-type` wins over `type`):

```scss
/* NEW — signal styling channel; "true" applies the selected look, resolving
   the effective type (data-signal-type over the static type) */
@each $type in $ch5-light-button--types {
  ch5-light-button[type="#{$type}"]:not([data-signal-type])[data-signal-selected="true"],
  ch5-light-button[data-signal-type="#{$type}"][data-signal-selected="true"] {
    @include ch5-light-button-selected-set($type);
  }
}
```

**Result:** the signal has **absolute priority** over the static `selected` — even if the author toggles `selected` at runtime — with **zero JS render/observe step** (one `setAttribute`). `"false"` keeps the attribute present so the static `selected` stays suppressed, letting the signal force the not-selected state too. Removing the `receivestateselected` attribute removes `data-signal-selected`, so the author's static `selected` styles the button again. The cost is paid in CSS: the selected rules are declared twice and multiplied by the effective-type combinations. The JS constant `Ch5LightButton.SIGNAL_SELECTED_ATTRIBUTE = 'data-signal-selected'` must stay in sync with these selectors.

### CSS for the `pressed` state (pure-CSS press feedback)

`pressed` is **not an authored attribute** — it is a **runtime host attribute** that the shared `Ch5LightPressable` helper sets on `pointerdown` and removes on release (`pointerup` / `pointerleave` / `pointercancel`). Unlike `ch5-button`, which toggles a JS class (`.ch5-button--pressed`) and re-renders, `ch5-light-button` themes the press feedback **100% in CSS** off the host `pressed` attribute (`ch5-light-button[pressed]`), so the JS does nothing beyond flipping one attribute. The theme SCSS lives in the theme-editor file `_light-button-pressed.scss`.

Because the pressed colours are **type-dependent**, the rules are generated **per type** (exactly like `selected`), with a default-type variant plus one rule per named type:

```scss
/* Default type (no explicit type) when pressed */
ch5-light-button:not([type="primary"])…:not([type="secondary"])[pressed]:not([pressed="false" i]):not([data-signal-pressed]) {
  @include ch5-light-button--set-pressed("default");
}

/* One rule per named type */
@each $type in $ch5-light-button--types {
  ch5-light-button[type="#{$type}"][pressed]:not([pressed="false" i]):not([data-signal-pressed]) {
    @include ch5-light-button--set-pressed($type);
  }
}
```

Three details make the press feedback correct:

- **Source order beats `selected`.** Each `[pressed]` selector ties the `[selected]` selector on specificity, so `_light-button-pressed.scss` is **imported *after* `_light-button-selected.scss`** — an active press therefore overrides the selected look purely through cascade order, no `!important` needed.
- **`pressed="false"` counts as not-pressed.** The `:not([pressed="false" i])` guard means an explicit `pressed="false"` never styles as pressed (case-insensitive), matching the `selected` / `disabled` convention.
- **A reserved `:not([data-signal-pressed])` channel.** Every rule carries `:not([data-signal-pressed])` so a future `receivestatepressed` signal channel can be added the same way `type` / `selected` were, without touching these selectors. It is unused today, so it always matches.

The shared look is applied by the root `@mixin ch5-light-button--set-pressed($type)`, which targets the inner `<button>` for background / border / line-height and the `--label` / icon / checkbox for colour, reading the per-type theme variables `--ch5-light-button--{type}-pressed-*` (e.g. `-pressed-background-color`, `-pressed-border-color`, `-pressed-label-font-color`, `-pressed-icon-color`, `-pressed-checkbox-color`).

**Result:** press feedback with **zero JS render step** — the component only sets/removes the `pressed` attribute; the entire visual (per type, overriding selected) is CSS. There is no `data-signal-*` duplication cost today (the signal channel is reserved but unwired), and the only JS ↔ CSS contract is the attribute name `pressed` itself.

### CSS change for `receivestateenable` (the separate styling channel, base class)

Like `type` / `selected`, the enable signal is styled through its **own** attribute channel so it never mutates the author's `disabled`. Because `receivestateenable` lives on `Ch5LightBaseClass`, this change is in the **base** button styling (`_light-button-default.scss`), so any future light component reuses it. Two things changed:

**1. The static `[disabled]` selector is now guarded with `:not([data-signal-enable])`** — so while a signal is active the static rule stops matching:

```scss
/* BEFORE — static disabled was the only channel */
ch5-light-button[disabled]:not([disabled="false" i]) button {
  cursor: not-allowed;
  pointer-events: none;
  user-select: none;
  opacity: var(--ch5-light-button--disabled-opacity, 0.5);
}

/* AFTER — static channel is disabled whenever data-signal-enable is present */
ch5-light-button[disabled]:not([disabled="false" i]):not([data-signal-enable]) {
  @include ch5-light-button-disabled-set;
}
```

**2. A new parallel `[data-signal-enable="false"]` channel was added** — the JS writes `"true"` / `"false"` here (never to `disabled`); `"false"` applies the disabled look, `"true"` leaves the button enabled even if a static `disabled` is present:

```scss
/* NEW — signal styling channel; "false" applies the disabled look */
ch5-light-button[data-signal-enable="false"] {
  @include ch5-light-button-disabled-set;
}
```

The shared look was extracted into a root `@mixin ch5-light-button-disabled-set` so both channels apply identical styling from one place.

**Result:** the signal has **absolute priority** over the static `disabled` — even if the author toggles `disabled` at runtime — with **zero JS render/observe step** (one `setAttribute` on the host). Because the author's `disabled` is never touched, it is **preserved and restored** the instant the `receivestateenable` attribute is removed (`data-signal-enable` is dropped, so the static `[disabled]` rule matches again). The base constant `Ch5LightBaseClass.SIGNAL_ATTRIBUTE_ENABLE = 'data-signal-enable'` must stay in sync with these selectors. Note this channel lives in the **base** class, so every current and future light component gets the same enable/disable-by-signal behaviour for free.

### No CSS change for `receivestateshow` (write-through into the `show` slot, base class)

`receivestateshow` deliberately takes a **different** approach from `type` / `selected` / `receivestateenable`, and it is the reason **no theme SCSS change is required** for it. Those three drive **pure-CSS** attributes, so the only way to give a signal priority is a parallel `data-signal-*` channel plus `:not(...)` guards on the static rules. `show`, by contrast, is a **JS-rendered** state — hiding is done by toggling the theme classes `ch5-hide-dis` / `ch5-hide-vis` **already shipped for the static `show` attribute**, or by a DOM detach for `noshowtype="remove"`. There is therefore no static CSS rule to out-specify, so the signal uses the simpler **write-through** pattern (the same one `label` / `iconclass` / `iconurl` use):

```ts
// Base class — signal value is written straight into the shared `show` slot,
// then the normal show pipeline runs (honouring the current noshowtype).
protected applyShowSignal(shown: boolean): void {
  this._ch5Properties.setValue<boolean>('show', shown); // bypasses the guarded setter
  this.handleShow();                                    // display / visibility / remove
}
```

Priority over the static `show` is enforced **in JS, not CSS**: the `show` setter early-returns while a `receivestateshow` name is bound, so author/attribute writes cannot fight the signal (mirroring `Ch5Common.set show`). The signal write uses `setValue` (which bypasses that guard) so it is never blocked by its own rule. Crucially the base's `show` setter **never reflects to the `show` attribute**, so the author's markup value is left intact and is simply **re-read and re-applied** when the signal name is cleared — the restore path.

**Result:** show/hide by signal with **no new SCSS, no duplicated rules, and no data-signal attribute** — it reuses the exact same hide classes and `handleShow()` logic as the static `show`, so `noshowtype` behaves identically. The only JS constant to keep correct is the property name `'show'`; there is nothing to keep in sync with a stylesheet. One edge case is handled in JS: a `noshowtype="remove"` self-hide fires `disconnectedCallback`, so the base guards it (`if (this._isDetachedFromDom) return;`) to keep the subscription alive — otherwise a `false` would remove the host and kill the very subscription needed to bring it back on the next `true`.

### No CSS change for `sendeventonshow` (a stateless *send* signal, base class)

`sendeventonshow` is the **outbound** counterpart of `receivestateshow`, and like it requires **no theme SCSS change** — but for a different reason: a *send* signal produces no visual state of its own, it only **reports** the host's current visibility to the control system. So there is nothing to style, no `data-signal-*` channel, and no `:not(...)` guards.

The entire feature is a **single publish at one chokepoint**. `show` is only ever applied through the base's `handleShow()`, so that is the one place the value is published — whatever drove the change (static `show`, the `receivestateshow` signal, or a programmatic write) flows through it:

```ts
// Base class — the single show chokepoint publishes the resulting state.
protected handleShow(): void {
  if (this.show) { this.applyShowState(); } else { this.applyHideState(); }
  this.sendShowSignal(this.show);   // no-op unless `sendeventonshow` is set
}

// Publishes a PLAIN boolean (not the repeat-digital object), zero-cost when absent.
protected sendShowSignal(value: boolean): void {
  const signalName = this.sendEventOnShow;
  if (!signalName) { return; }                                   // hot-path early-out
  (this._baseSignals ??= new Ch5LightSignal()).sendBoolean(signalName, value);
}
```

**Performance:** the cost on the show path when the attribute is absent — the overwhelmingly common case — is a single property read of `sendEventOnShow` plus a falsy check, then an immediate return; **nothing is allocated or published**. Only a button that actually carries `sendeventonshow` ever touches the lazy `Ch5LightSignal` helper (created on first publish and shared with the receive signals). Because the signal is **stateless** (`sendBoolean` tracks nothing), there is no subscription, no listener, and therefore **nothing to unsubscribe** in `disconnectedCallback` — the existing `_isDetachedFromDom` guard there is untouched. The setter stores the name in the shared `Ch5LightProperties` store **without a change callback**, because setting the name has no side effect (the value is only ever published from `handleShow()`), so runtime name changes allocate no closure. The name is re-synced from the DOM in `initLightBaseAttributes()` **before** the first `handleShow()`, so the initial visibility is reported correctly on (re)connect.

**Result:** outbound show reporting with **no SCSS, no observers, and no per-instance state** — one guarded publish bolted onto the show path that light components already run. The only JS constant to keep correct is the property name `'sendEventOnShow'` (and the attribute `sendeventonshow`); there is nothing to keep in sync with a stylesheet.

### JS write-through for `receivestatelabel` / `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl`

Unlike `type` / `selected` — which are **pure-CSS** attributes and therefore need a separate `data-signal-*` channel so the cascade can prioritise the signal — `label`, `iconclass`, `iconurl`, and `backgroundimageurl` are **rendered in JS**. There is no static CSS channel to override, so these signals take the simpler **write-through** approach used by `ch5-animation`: the signal value is written **straight into the same slot** the static attribute uses (`label` / `iconClass` / `iconUrl` / `backgroundImageUrl`), which re-renders through the normal label / icon / background pipeline. No new attribute channel, no duplicated CSS.

This is safe because of the platform contract that, **at runtime, only the signal updates these values** — the static `label` / `iconclass` / `iconurl` / `backgroundimageurl` are set once at design time and never re-written live. So the signal is always the last writer and therefore always wins.

One extra step is needed for the background image only: the `backgroundimageurlfilltype` CSS is scoped to the host selector `ch5-light-button[backgroundimageurl]` (for performance — buttons with no background image are never matched). A static author sets that attribute in markup, but a signal-driven URL would leave the host without it, so the fill type would be ignored (every mode looks identical). `applySignalBackgroundImageUrl` therefore **reflects the `backgroundimageurl` attribute onto the host** (removing it when the signal clears), so the fill type works identically for static and signal values. `receivestateiconurl` needs no such step: the `iconurlfilltype` CSS is scoped to `[iconurlfilltype]` and the JS-created `--img` element, **not** to the `[iconurl]` attribute.

### Multi-line label & truncation (`multilinesupport` / `truncatetext`)

`ch5-light-button` supports the same multi-line / truncation behaviour as `ch5-button`, but implemented to fit the light family's **no-observer** rule. Both attributes are boolean, both feed one shared handler, and the visual is **class-driven**:

- `multilinesupport` (default `false`) — when on, the label wraps and is clamped to the number of lines that fit the button's height (the button is never resized).
- `truncatetext` (default `true`) — when on, overflow ends in an ellipsis (single-line, or on the last visible line in multi-line mode); when off, the text is clipped with no ellipsis.

The two setters share one cached callback, `_onLabelWrapChange → updateLabelTextWrapping()`, which swaps four CSS classes on the label span and only measures on the opt-in path:

```ts
span.classList.add(`${p}--label-multiline-support-${this.multilineSupport}`);
span.classList.add(`${p}--label-truncate-text-${this.truncateText}`);
if (this.multilineSupport) { this.fitEllipsisForMultiline(); }
else { span.style.removeProperty('-webkit-line-clamp'); span.style.removeProperty('max-height'); }
```

The theme SCSS (`_light-button-default.scss`) ships those classes — including the **essential `min-width:0`** on `--label` (a flex child defaults to `min-width:auto`, which blocks shrink and would stop the ellipsis from ever triggering). The default pair (`multiline-support-false` + `truncate-text-true`) reproduces the familiar single-line "Font Ic…" ellipsis **with zero JS measurement**.

Only the opt-in multi-line path measures layout, in `fitEllipsisForMultiline()`:

```ts
const lineHeight = this.getLabelLineHeight(span);          // swap in &nbsp;, read offsetHeight, restore
const containerHeight = button.clientHeight - 20;          // minus top/bottom padding
const numberOfLines = containerHeight < lineHeight ? 1 : Math.floor(containerHeight / lineHeight);
if (this.truncateText) span.style.setProperty('-webkit-line-clamp', String(numberOfLines));
else span.style.setProperty('max-height', `${numberOfLines * lineHeight}px`);
```

It is guarded to run **only** when `multilinesupport` is on **and** the button is connected (its height is unreadable off-DOM), so the real measurement happens once in `connectedCallback` and again only on label/attribute changes. **No `ResizeObserver` or resize/viewport listener is used** — the accepted trade-off is that a runtime container resize won't re-clamp, which keeps the component observer-free (and therefore cheap) at 1000+ instances. Inline styles are set with `style.setProperty` / `removeProperty` (never `setAttribute('style')`) so they don't clobber other inline styles.

### User-interaction events: `click`, `focus`, `blur`

`ch5-light-button` raises the same three interaction events as `ch5-button`, split into two mechanisms by whether they carry a signal.

**`click` — the `sendeventonclick` send signal (opt-in).** Covered in the attribute table and change point #19: on `pointerdown` it publishes **`true`**, on `pointerup` / `pointerleave` / `pointercancel` it publishes **`false`** — a plain momentary boolean (not the repeat-digital object form). The pointer listeners are attached **only while the attribute is set**, so signal-free buttons wire nothing; a `_clickPressed` flag keeps press/release balanced, and a `disabled` button (`pointer-events:none`) never fires them.

**The plain DOM `click` event — nothing added, pure browser default.** Separate from the `sendeventonclick` signal, the ordinary DOM **`click`** event needs **no component code**: unlike `focus`/`blur`, `click` **bubbles**, so the inner `<button>`'s native click propagates through the flattened light DOM up to the host by itself. A consumer can simply `addEventListener('click', …)` on `<ch5-light-button>` and it works — the component neither listens for nor re-dispatches `click`. This is why only `focus`/`blur` need the re-dispatch treatment below.

**`focus` / `blur` — native DOM events, always wired, re-dispatched from the host.** Unlike `click`, these carry **no signal**, so they are wired unconditionally in `connectedCallback` (via `wireFocusBlur()`) and torn down in `disconnectedCallback` (via `unwireFocusBlur()`), guarded by a `_focusListenersWired` flag. The cost at idle is effectively zero — they fire only on a genuine focus change. The listeners sit on the inner `<button>`, and each handler simply re-emits the event from the host:

```ts
// Cached handlers (allocated once per instance).
private readonly _onFocus = (event: FocusEvent) => this.handleFocus(event);
private readonly _onBlur  = (event: FocusEvent) => this.handleBlur(event);

private handleFocus(event: FocusEvent): void { this.reDispatchFocusEvent(event); }
private handleBlur(event: FocusEvent): void  { this.reDispatchFocusEvent(event); }

// focus/blur DON'T bubble, so clone the event and fire it from the host so
// `<ch5-light-button>` consumers receive it, then stop the original.
private reDispatchFocusEvent(event: FocusEvent): void {
  const clonedEvent: Event = new Event(event.type, event);
  this.dispatchEvent(clonedEvent);
  event.preventDefault();
  event.stopPropagation();
}
```

**Why re-dispatch?** `focus` and `blur` are **non-bubbling**. In the flattened light DOM the inner `<button>` is a child of the host, so an author's `<ch5-light-button>`-level listener would never see the button's native event. Cloning and re-dispatching from the host (exactly what `ch5-button` does) makes `<ch5-light-button>` a first-class event target. `handleFocus` and `handleBlur` are deliberately **kept separate** rather than merged into one listener, so `blur` can reset the pressed state — `ch5-button`'s `_onBlur` does `this.pressed = false`, and the light button's `handleBlur` calls `_pressable.setPressed(false)` so a button that loses focus mid-press does not stay stuck `pressed`.

**`press` / `release` + the `pressed` state — the shared `Ch5LightPressable`.** Press/release is provided by a new **lightweight, reusable** helper, `Ch5LightPressable`, that lives in `ch5-light-base` next to `Ch5LightSignal` and `Ch5LightProperties`. It is the perf-preserving counterpart of `Ch5Pressable`: it reproduces the *visible* behaviour — a `pressed` boolean, the host **`pressed` attribute** (so themes style `ch5-light-button[pressed]` in pure CSS), bubbling **`press`** / **`release`** DOM `CustomEvent`s, an optional CSS-class toggle, and an optional `onChange(pressed)` callback — but imports **nothing** (no RxJS `Subject`, no `Ch5Common`, no `elementIsInViewPort` / `logger`).

```ts
// ch5-light-base/ch5-light-pressable.ts (essence)
public init(): void {                       // one always-on listener
  this._target.addEventListener('pointerdown', this._onPointerDown);
}
public setPressed(value: boolean): void {
  if (value === this._pressed) { return; }  // no-op when unchanged
  this._pressed = value;
  if (value) { this._onPress(); } else { this._onRelease(); }
  this._onChange?.(value);
}
private _onPress(): void {
  this._attachReleaseListeners();            // up/leave/cancel wired ONLY now
  this._host.setAttribute('pressed', 'true');
  this._host.dispatchEvent(this._pressEvent);
}
private _onRelease(): void {
  this._detachReleaseListeners();            // …and torn down again on release
  this._host.removeAttribute('pressed');
  this._host.dispatchEvent(this._releaseEvent);
}
```

`ch5-light-button` creates it lazily on first connect (`new Ch5LightPressable(this, this._elButton)` — host for the attribute/events, inner `<button>` as the pointer target so a `disabled` `pointer-events:none` button blocks presses for free) and wires it **always-on** like `focus`/`blur` via `wirePressable()` / `unwirePressable()` in the connect/disconnect lifecycle. **Performance:** an idle button carries just **one `pointerdown` listener**; the three release listeners exist only during an actual press, all handlers are cached fields, and the `press`/`release` events are allocated once. Because the helper lives in the base package with no dependencies, other light components can reuse it as-is.

**Touch panels — holding `pressed` during a finger move (`touch-action: none`).** Because the pressable treats `pointercancel` as a release (alongside `pointerup` / `pointerleave`), the inner `<button>` needs **`touch-action: none`** in the theme CSS. With the browser default (`touch-action: auto`), a finger drag *within* the button is interpreted as a scroll/pan gesture — the browser then claims the pointer and fires `pointercancel`, which would release the press mid-drag (a mouse never generates a scroll gesture, so the desktop path is unaffected). Setting `touch-action: none` on the button tells the browser not to hijack the drag, so the press survives a finger move and only ends on a real lift/cancel. This mirrors `ch5-button`, which forces `touch-action: none` during a press through `Ch5Pressable`'s `touchMove` option; the light button does it declaratively in CSS (in the theme-editor `_light-button-default.scss`) so there is **no JS cost**.

**Touch panels — releasing when the finger leaves the button (a `pointermove` hit-test).** There is a second-order effect of the capture behaviour: on touch the browser does **implicit pointer capture** on `pointerdown`, so the target keeps receiving pointer events wherever the finger travels — which means `pointerleave` **never fires** when the finger slides off the button, and the press would stay stuck (whereas `ch5-button` releases as the finger leaves). To match that, while a press is in flight `Ch5LightPressable` also listens for **`pointermove`** and releases once the pointer moves outside the target's bounds. The bounds are read **once per press** (`getBoundingClientRect()` cached after the `pressed` styles apply) and compared per move — no per-move layout read. `pointerleave` is kept as a cheap fast-path for the mouse (`setPressed(false)` is idempotent, so a redundant release is a no-op). This is the light-family equivalent of `Ch5Pressable`'s move tracking, but simpler: a plain element-bounds test with no `CLICK_MOVE_THRESHOLD`.

### Diagnostics, accessibility & native attributes from the base class (`debug` / `trace` / `data-ch5-id` / `role` / `id` / `class` / `style`)

These four are provided by `Ch5LightBaseClass` (shared by every light component) and mirror the behaviour of the heavy `ch5-button` / `Ch5Common`, but are engineered to stay **allocation-free until actually used**, so 1000+ idle instances pay effectively nothing.

**`debug` / `trace` — lazy, zero-cost logging.** Both are **observed reactive booleans** (so they can be toggled live), backed by two cached flags (`_isDebugEnabled` / `_isTraceEnabled`) that default off. The key is that the **logger object is never created while logging is off**: `_logger` stays `null` until the first log made while `debug`/`trace` is on, and even the setters only touch the logger if it *already* exists — they never allocate one just to flip a flag that is off. The logger reused is the shared leaf `Ch5CommonLog`, which imports only `Ch5Debug`, so turning logging on pulls in **no** heavy `ch5-common` machinery. All logging routes through guarded helpers (`log()` / `logStart()` / `logStop()`) that are a single boolean check and return immediately when both flags are off. `trace` additionally opens a `console.group` per method entry; `console.group` / `console.groupEnd` are **feature-detected** in `Ch5CommonLog`, so it is safe on runtimes (some panels) that don't implement them — it falls back to a plain `console.log`.

**Early-log ordering fix.** Custom-element attribute reactions are **batched**: for markup like `<ch5-light-button label="test" debug>`, every `attributeChangedCallback` runs before `connectedCallback`, and because the reactions are batched the `label` callback can fire *before* the `debug` callback has set its flag — so a naive implementation would silently drop the `label` log even though `debug` is present. To fix this without adding hot-path cost, the guarded log helpers first call `syncDiagnosticsFromDom()`, which reads `debug`/`trace` straight from the DOM (at most two `hasAttribute` checks, and it never turns a flag *off*). This is gated by a `_diagnosticsInitialized` flag that flips true on first connect, so after initialization the sync is a **single boolean check — zero ongoing cost** on the attribute-change path.

**`data-ch5-id` — framework-unique instance id.** Every instance is assigned a unique `cr-id-N` from `Ch5Uid` (a counter increment) as a field initializer, and reflects it onto the host as the `data-ch5-id` attribute **once** in `connectedCallback` (idempotent on reconnect) — exactly like `ch5-button` / `ch5-image` / `ch5-common`. It exists purely so an instance is identifiable in the DOM and in logs; it is read in code via `getCrId()` and is never authored.

**`role` — automatic, override-safe accessibility, kept dependency-free.** `role` is a **non-observed** attribute, so it costs nothing on the attribute-change path. On each connect the base calls `applyDefaultRole()`, which sets the role **only when the author has not already provided one** (`!hasAttribute('role')`) — a user-set `role` always wins. The value comes from `getDefaultRole()`, a plain overridable method (`ch5-light-button` returns `'button'`; the base returns `null` = no role). Crucially, the base deliberately does **not** import the shared `Ch5RoleAttributeMapping` constants the heavy components use — each component's default is a bare string literal — so the light family stays fully self-contained and tree-shakeable, with no extra module coupling. The whole feature is a single `hasAttribute` check per connect, plus one `setAttribute` on the first connect only.

**`id` / `class` / `style` — native, no JS.** These standard HTML attributes are intentionally **not** observed and carry **no** component code: the browser already reflects `id` ↔ property and applies `class` / `style` directly on the host, so re-implementing them would only add hot-path work for behaviour that is free. The component writes `classList` / `.style` **only on its internal elements** (the inner `<button>`, icon, background) and never on the host, so an author's host `class` / `style` are never clobbered and simply compose with the component's own `ch5-light-button` host class. (`dir` is likewise left native.)

---

## 4. Challenges faced

| # | Challenge | Resolution |
|---|---|---|
| 1 | **Attributes not available in the constructor** for parser-created elements. | Build the DOM in `connectedCallback`, not the constructor. |
| 2 | **Label / icon disappeared on page re-navigation** (second connect). The host is disconnected and reconnected; the cached child references became stale. | On every connect, reset `_elLabel`/`_elIcon` to `null` and rebuild into a fresh button. |
| 3 | **Setter short-circuit on reconnect.** Because the stored `label`/`iconClass` values were retained, the setters skipped the rebuild and the button rendered empty. | `initAttributes()` writes the values straight into the shared property store via `setValue` (bypassing the change callbacks); the handlers are then called explicitly, exactly once. |
| 4 | **Double render on first connect** (setters + explicit handlers) caused a measurable regression at 1200 instances. | Bypass the setter callbacks during init (`setValue`) so handlers run **once** per connect. |
| 5 | **Icon position without reordering the DOM.** | Use the CSS `order` property; the icon can always be appended last. |
| 6 | **`shape="circle"` staying a perfect circle across all sizes.** | Bind the height to the width custom property per size in CSS. |
| 7 | **`stretch` working with every size.** | Override only the stretched dimension and keep a per-size `min-height`. |
| 8 | **`iconurl` vs `iconclass` conflict.** Both can be set on the same button. | `iconurl` takes priority: render the icon as a background image on a `--img` element and clear the font-icon class. The `--img` and `--icon` classes are mutually exclusive, matching `ch5-button`. |
| 9 | **`iconurlfilltype` filling the button without disturbing the label.** | Handle it purely in CSS: take the `--img` out of flow (`position:absolute`, full width/height) and set `background-size` per fill type, keeping the label above via `z-index`. |
| 10 | **A URL from an attribute cannot be set with pure CSS.** The CSS `attr()` function only works reliably for the `content` property, not as a `url()` in `background-image`. | Apply `iconurl` / `backgroundimageurl` as an inline `background-image` from JS (one line each); keep only the *fill type* (`background-size`) in CSS. |
| 11 | **`backgroundimageurlfilltype` matching cost at 1200 instances.** | Scope every fill-type rule to `ch5-light-button[backgroundimageurl]` so buttons with no background image are never matched, and share one rule for the default + explicit `stretch-aspect`. |
| 12 | **Adding a signal (`receivestatetype`) without reintroducing the per-instance signal cost the light button was built to avoid.** | Make it **strictly opt-in and lazy**: no signal helper, subscription, or callback closure is created unless the attribute is present. The plumbing is a thin reusable helper (`Ch5LightSignal`) that imports only `Ch5Signal` / `Ch5SignalFactory` and exposes a generic `subscribe` / `unsubscribeAll`; the helper object itself is created lazily on first subscribe and the closure is allocated at subscribe time, so signal-free buttons pay nothing. The signal writes the resolved value to a separate `data-signal-type` attribute, keeping all styling in CSS. |
| 13 | **Signal priority vs the static `type`, and restoring it — matching `ch5-button` where the signal wins even if `type` is changed at runtime, but WITHOUT a JS render step or observing `type`.** | Give the signal its **own styling channel**: write the resolved value to a separate `data-signal-type` attribute (never the author's `type`), and guard every static `[type]` selector in the theme with `:not([data-signal-type])`. While a signal is active only the `[data-signal-type]` rules match, so the signal has absolute priority over `type` (even a runtime `type` change) with zero JS beyond a single `setAttribute`. Removing the `receivestatetype` attribute removes `data-signal-type`, so the author's static `type` styles the button again. Cost is paid in CSS (the type colour rules are declared twice — one per channel), not at runtime. |
| 14 | **Subscription leaks across disconnect / reconnect.** | Tear the subscription down in `disconnectedCallback` (keeping the signal name) and re-subscribe in `connectedCallback`, so a detached button holds no live listener yet reconnects transparently. |
| 15 | **A second signal (`receivestateselected`) that must override the static `selected` — the same problem as `type`, but for a boolean state whose colours also depend on the (possibly signal-driven) type.** | Reuse the exact `receivestatetype` pattern: a separate `data-signal-selected` channel with `:not([data-signal-selected])` guards on every static `[selected]` rule and a parallel `[data-signal-selected="true"]` channel that resolves the effective type (`data-signal-type` over `type`). `"false"` suppresses the static look without selecting, so the signal drives **either** state. No JS render step; the author's `selected` is never mutated. |
| 16 | **Two `receiveState*` signals coexisting on one element without interfering** — the original plumbing tracked a single subscription globally (`hasSubscriptions` / `unsubscribeAll`), so a second signal would have been blocked or torn down with the first. | Generalised the shared `Ch5LightSignal` helper with per-signal `unsubscribe(name)` / `isSubscribedTo(name)` (alongside `unsubscribeAll`), and consolidated the button's subscribe / teardown / channel-clear logic into three shared generics (`subscribeSignal`, `clearSignalSubscription`, `clearSignalChannel`). Each `receiveState*` is now a thin wrapper, so a signal is torn down independently and neither interferes with the other. None of this runs on the hot path (a signal value change routes straight to `applySignal*`), so it is free. |
| 17 | **Signal-driving the JS-rendered `label` / `iconclass` / `iconurl` / `backgroundimageurl`, where there is no static CSS channel to override (unlike `type` / `selected`).** | Use a **write-through** pattern (as in `ch5-animation`): the signal value is written straight into the shared `label` / `iconClass` / `iconUrl` / `backgroundImageUrl` slot and re-renders through the normal pipeline. The platform contract guarantees only the signal updates these at runtime (static values are design-time only), so the signal is always the last writer and wins — no `data-signal-*` channel, no duplicated CSS. |
| 18 | **`backgroundimageurlfilltype` ignored when the URL comes from `receivestatebackgroundimageurl`.** The fill-type CSS is scoped to `ch5-light-button[backgroundimageurl]`, but a signal-driven URL never sets that host attribute, so no fill-type rule matched (all modes looked identical). | Reflect the `backgroundimageurl` attribute onto the host from `applySignalBackgroundImageUrl` (and remove it when the signal clears), so the fill-type rules match for signal-driven URLs exactly as for static ones. `receivestateiconurl` needs no equivalent because `iconurlfilltype` is scoped to `[iconurlfilltype]` + the JS-created `--img` element, not to `[iconurl]`. |
| 19 | **Adding the first *send* signal (`sendeventonclick`) without reintroducing always-on listeners the light button avoids, while still matching `ch5-button`'s wire format.** | Drive the send from the always-on pressable's `onChange` (no extra listeners), so signal-free buttons attach nothing beyond the pressable's single `pointerdown`. Publish in the **repeat-digital object form** — `{ [REPEAT_DIGITAL_KEY]: value }` (`{ "repeatdigital": true/false }`) via a tiny stateless `Ch5LightSignal.sendRepeatDigital()` (`getObjectAsBooleanSignal(name).publish({ repeatdigital: value })`) — **exactly like `ch5-button` / `ch5-image` / `ch5-dpad`**, since the light button supports repeat-digital and must present the same shape to the control system. (The plain-boolean `sendBoolean()` is reserved for plain digitals such as `sendeventonshow`.) The pressable balances press/release; `disabled` (host `pointer-events:none`) blocks events with no JS guard. |
| 20 | **Per-instance logging (`debug` / `trace`) without allocating a logger for every idle button** — the heavy components create a logger eagerly, which at 1000+ instances is 1000+ objects for a feature that is almost never on. | Keep the logger **lazy**: `_logger` stays `null` until the first log made while `debug`/`trace` is on; the setters only update a logger that already exists (never allocate to flip an off flag); and all logging routes through guarded helpers that are a single boolean check when off. Reuse the leaf `Ch5CommonLog` (imports only `Ch5Debug`), so enabling logging pulls in no heavy `ch5-common` code. |
| 21 | **Early logs dropped due to batched attribute reactions.** Every `attributeChangedCallback` runs before `connectedCallback`, and reactions are batched, so for `<ch5-light-button label="test" debug>` the `label` log fired while the `debug` flag was still false. | Have the guarded log helpers call `syncDiagnosticsFromDom()` (reads `debug`/`trace` straight from the DOM, never turns a flag off), gated by a `_diagnosticsInitialized` flag so it becomes a single boolean check after the first connect — no hot-path cost. |
| 22 | **A default ARIA `role` the author can always override, without an attribute-change callback or coupling to the heavy role-mapping constants.** | Make `role` **non-observed** and apply it once per connect via `applyDefaultRole()` — set only when `!hasAttribute('role')` (user value wins). The default comes from an overridable `getDefaultRole()` returning a bare string literal (`ch5-light-button` → `'button'`), so the base imports **no** `Ch5RoleAttributeMapping` and stays self-contained. Cost is one `hasAttribute` per connect. |
| 23 | **`console.group` / `console.groupEnd` missing on some runtimes** (e.g. certain panels) crashing `trace`. | Feature-detect them in the shared `Ch5CommonLog` (`typeof console.group === 'function'`), falling back to a plain `console.log` when absent. |
| 24 | **Giving the whole light family (not just the button) an enable/disable receive signal, without reintroducing per-instance signal cost and without letting it fight the button's own signals.** | Implement `receivestateenable` **in the base class** (`Ch5LightBaseClass`) as its first opt-in signal, with its **own** lazy `Ch5LightSignal` helper kept separate from any a subclass owns (so the two never clash — a private-field name clash was avoided by giving the base its own `_baseSignals`). Reuse the separate-channel priority model: write the resolved boolean to a `data-signal-enable` attribute (never the author's `disabled`) and guard the static `[disabled]` rule with `:not([data-signal-enable])`, so the signal wins over a static `disabled` even at runtime while the author's attribute is preserved and restored on removal. The signal **name is stored in the shared `Ch5LightProperties` store** (like `receivestateselected`), so no extra per-instance field is needed and the store's change callback hands back the old name for clean unsubscription. Still zero-cost when the attribute is absent. |
| 25 | **Adding a show/hide receive signal (`receivestateshow`) that must honour `noshowtype` and take priority over the static `show` — but where `show` is JS-rendered, so the `data-signal-*` CSS-channel trick used for `type` / `selected` / `enable` does not apply.** | Use the **write-through** pattern instead of a CSS channel (so **no theme SCSS change** is needed): the signal value is written straight into the shared `show` slot via `setValue` and re-applied through the existing `handleShow()`, so `display` / `visibility` / `remove` behave exactly as for the static `show`. Priority is enforced **in JS** — the `show` setter early-returns while a `receivestateshow` name is bound (mirroring `Ch5Common.set show`), and the signal's own write bypasses that guard via `setValue`. The base setter never reflects to the `show` attribute, so the author's markup value survives untouched and is re-read/re-applied to **restore** it when the signal clears. Reuses the base's same `_baseSignals` helper (keyed by name, so it coexists with `receivestateenable`) and the shared `Ch5LightProperties` store. Edge case: a `noshowtype="remove"` self-hide triggers `disconnectedCallback`, so it is guarded (`if (this._isDetachedFromDom) return;`) to keep the subscription alive so a later `true` can reattach the host. Zero-cost when absent. |
| 26 | **Adding the *send* counterpart (`sendeventonshow`) that reports visibility whenever it changes — no matter what changed it — without adding per-instance state or hot-path cost to the many buttons that never use it.** | Wire a single guarded publish at the **one show chokepoint** every driver already funnels through: `handleShow()` ends with `sendShowSignal(this.show)`, which early-returns on an empty name (a property read + falsy check) so signal-free buttons pay effectively nothing, and otherwise publishes a **plain boolean** via the stateless `Ch5LightSignal.sendBoolean()` — reusing the base's same lazy `_baseSignals` helper. Because it publishes from `handleShow()`, the static `show`, the `receivestateshow` signal and programmatic writes are all covered by one line. Being **stateless** there is no subscription/listener, so nothing is added to `disconnectedCallback`; the name lives in the shared `Ch5LightProperties` store and its setter needs **no change callback** (setting it has no side effect). The name is synced from the DOM before the first `handleShow()` so the initial state is reported on (re)connect. |
| 27 | **Multi-line label clamped to the button height without a `ResizeObserver`** — `ch5-button` recomputes the line clamp on resize/viewport changes, but the light family forbids per-instance observers. | Measure lazily and **only when `multilinesupport` is on**: `fitEllipsisForMultiline()` reads the single-line height (briefly swapping in `&nbsp;`), divides the button's `clientHeight` by it, and writes an inline `-webkit-line-clamp` (or `max-height` when `truncatetext` is off). It runs solely in `connectedCallback` (height is unreadable off-DOM) and on label/attribute changes — no observers. The trade-off (no re-clamp on a runtime container resize) is accepted for the perf win. |
| 28 | **Keeping the default single-line ellipsis free of any layout read.** | Drive both attributes with **CSS classes** (`--label-multiline-support-*` / `--label-truncate-text-*`) through one shared `updateLabelTextWrapping()`, so the default pair (`multiline-support-false` + `truncate-text-true`) gives the single-line ellipsis in pure CSS. The JS measurement runs only on the opt-in multi-line branch. Also required `min-width:0` on the `--label` flex child, without which the ellipsis never triggers. |
| 29 | **Surfacing `focus` / `blur` on `<ch5-light-button>` when the events don't bubble and the real target is the inner `<button>`.** In the flattened light DOM a host-level listener never sees the button's native `focus`/`blur` (they are non-bubbling), so consumers couldn't listen on the custom element. | Mirror `ch5-button`: attach `focus`/`blur` listeners to the inner `<button>` and, in each handler, **clone the event and re-dispatch it from the host** (`new Event(type, event)` → `dispatchEvent(this)`), then `preventDefault()` + `stopPropagation()` the original. The listeners are **always wired** (no signal to gate them, and they fire only on real focus changes so idle cost is ~0), with cached handlers (`_onFocus` / `_onBlur`) and a `_focusListenersWired` guard, torn down on disconnect. `handleFocus` / `handleBlur` are kept **separate** so `blur` resets the pressed state (as `ch5-button`'s `_onBlur` does). |
| 30 | **Adding press/release (the `pressed` state + `press`/`release` events) without dragging in `Ch5Pressable`'s weight** — `Ch5Pressable` imports `Ch5Common` + an RxJS `Subject` and uses `elementIsInViewPort` / `logger`, all of which break the light family's dependency/allocation budget. | Write a **new, dependency-free `Ch5LightPressable`** in `ch5-light-base` (reusable by every light component) that reproduces only the *visible* pressable behaviour: a `pressed` boolean, the host `pressed` attribute (pure-CSS themable), bubbling `press`/`release` `CustomEvent`s, an optional CSS-class toggle, and an optional `onChange` callback — with **zero imports**. Keep it cheap at scale: a **single idle `pointerdown` listener**, with `pointerup`/`pointerleave`/`pointercancel` wired **only while a press is in flight**, cached handlers, and the `press`/`release` events created once. `ch5-light-button` wires it always-on on the inner `<button>` (so `disabled` blocks it for free) and force-releases it on `blur`. |

---

## 5. Good practices followed

- **Build off-DOM, append once** — construct the entire `button > (icon + label)` subtree while detached, then perform a single `appendChild` to the host. Minimises layout/reflow.
- **Lazy element creation** — the `<i>` and `<span>` are created only when `iconclass` / `iconurl` / `label` are actually set (icon-only or label-only buttons stay minimal).
- **CSS-first variants** — `shape`, `size`, `type`, `stretch`, `iconposition`, `halignlabel`, `valignlabel`, `selected`, `checkboxshow`, `checkboxposition`, `iconurlfilltype`, `backgroundimageurlfilltype` are declarative CSS. Zero JS cost, and themeable via CSS custom properties.
- **`className =` over `classList.add()`** for freshly created nodes (single assignment vs API calls).
- **`appendChild` over `insertBefore`** — no `firstChild` lookup; position handled by CSS `order`.
- **Minimal `observedAttributes`** — only the JS-managed attributes (`label`, `iconclass`, `iconurl`, `backgroundimageurl`, `multilinesupport`, `truncatetext`, `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl` plus the base class's `show` / `noshowtype` / `debug` / `trace` / `receivestateenable` / `receivestateshow` / `sendeventonshow`) are observed, so CSS-only attribute changes (`disabled`, `shape`, `size`, …) never trigger a JS callback. Accessibility `role`, the native `id`, and the reflected `data-ch5-id` are **non-observed**, so they add no attribute-change work.
- **Lazy, allocation-free diagnostics** — `debug` / `trace` never allocate a logger while off; the shared leaf `Ch5CommonLog` (imports only `Ch5Debug`) is created only on the first log, and all logging goes through guarded single-boolean-check helpers, so 1000+ idle buttons allocate **zero** loggers. `console.group` / `console.groupEnd` are feature-detected for runtime safety.
- **Non-observed, override-safe `role`** — the accessibility `role` is applied once per connect and only when the author hasn't set one; its default is a plain string literal (no import of `Ch5RoleAttributeMapping`), keeping the base self-contained and tree-shakeable.
- **Native `id` / `class` / `style` — no re-implementation** — the standard host attributes are left entirely to the browser (reflected/applied natively) instead of being observed and handled in JS, so they add zero hot-path cost. The component writes `classList` / `.style` only on its **internal** elements (inner `<button>`, icon, background), never on the host, so an author's host `class` / `style` are never clobbered and simply compose with the component's own `ch5-light-button` host class. (`dir` is likewise native.)
- **Opt-in, lazy signals** — `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, and `receivestatebackgroundimageurl` are the button's signal attributes, and the **base class** adds three more, `receivestateenable` (enable/disable), `receivestateshow` (show/hide, honouring `noshowtype`) and the send signal `sendeventonshow` (reports the show state), owned by `Ch5LightBaseClass` so every light component inherits them (they share one lazy `_baseSignals` helper, kept separate from the button's so the two never clash; their names live in the shared `Ch5LightProperties` store). `receivestateenable` uses a separate `data-signal-enable` CSS channel, whereas `receivestateshow` and `sendeventonshow` need **no CSS change** — `receivestateshow` write-throughs into the `show` slot and reuses the existing `handleShow()` / hide classes, and `sendeventonshow` simply publishes the show state from that same `handleShow()` chokepoint (a stateless send, so it also has nothing to tear down). None creates a signal helper, subscription, or callback closure unless its attribute is actually present; the subscription callback is allocated at subscribe time rather than as a per-instance class field, so signal-free buttons stay at zero cost. The subscribe/unsubscribe plumbing lives in a tiny reusable helper (`Ch5LightSignal`, in `ch5-light-base`) that imports only `Ch5Signal` / `Ch5SignalFactory` (no lodash / `Ch5Property` / `Ch5Common`) and exposes a thin generic surface — `subscribe(name, type, onValue)`, per-signal `unsubscribe(name)` / `isSubscribedTo(name)`, `unsubscribeAll()`, and the stateless `sendBoolean(name, value)` used by the send signals. The button consolidates its signal wiring into three shared generics (`subscribeSignal` / `clearSignalSubscription` / `clearSignalChannel`), so each `receiveState*` is a thin wrapper and the signals never interfere. Two styling strategies are used: `type` / `selected` write a separate `data-signal-*` CSS channel (their targets are pure-CSS attributes), while `label` / `iconclass` / `iconurl` / `backgroundimageurl` are JS-rendered and so **write straight into** the matching `label` / `iconClass` / `iconUrl` / `backgroundImageUrl` slot. Each reuses the shared `Ch5SignalFactory`, tears down on disconnect, and re-subscribes on reconnect.
- **Opt-in, observer-free layout measurement** — the multi-line clamp (`multilinesupport`) is the **only** layout-reading path and runs **only when it is on**, measured in `connectedCallback` and on label/attribute changes. No `ResizeObserver` / viewport / resize listener is used (the light family bans them), and the default single-line ellipsis (`truncatetext`) is pure CSS classes with **no** measurement. Inline clamp styles are written via `style.setProperty` / `removeProperty` so they never clobber other inline styles.
- **Host-level `focus` / `blur` via cheap re-dispatch** — the inner `<button>`'s non-bubbling `focus`/`blur` are cloned and re-emitted from the host so consumers can listen on `<ch5-light-button>` directly (matching `ch5-button`). The listeners are always wired but fire only on real focus changes, so idle cost is effectively zero; handlers are cached fields (`_onFocus` / `_onBlur`) with a `_focusListenersWired` guard and are torn down on disconnect. `click` is instead the opt-in `sendeventonclick` send signal, which attaches its pointer listeners only when the attribute is present.
- **Shared, dependency-free `Ch5LightPressable`** — press/release is handled by a reusable base-package helper that mirrors `Ch5Pressable`'s *visible* behaviour (the `pressed` attribute + bubbling `press`/`release` events) with **no RxJS / `Ch5Common`**. It keeps a single idle `pointerdown` listener and wires the release listeners only during an active press, with cached handlers and once-created events — so per-instance cost stays minimal and any light component can reuse it.
- **Change-detection in setters** — runtime property assignments only touch the DOM when the value actually changes.
- **Shared lightweight property store** — both the base class (`show` / `noshowtype`) and the button (`label` / `iconclass` / `iconurl` / `backgroundimageurl`) use a single, dependency-free `Ch5LightProperties` instance (plain key/value map + change detection, **no** signals / lodash / reflection). The button registers its own properties onto the base store via `add()`, so no second store is allocated.
- **Idempotent, reconnect-safe lifecycle** — `connectedCallback` fully rebuilds; `disconnectedCallback` is a no-op.

---

## 6. Main performance boosters

1. **No `Ch5Common` base class** — eliminates per-instance signal subscriptions, `MutationObserver`, debounce timers, and the property registry. This is the single biggest win. (The signals that exist — the six button signals `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl` and `receivestatebackgroundimageurl`, plus the base class's `receivestateenable`, `receivestateshow` and the send signal `sendeventonshow`, and the button's send signal `sendeventonclick` — are all opt-in and only do work when present.)
2. **CSS-only variants** — `shape` / `size` / `type` / `stretch` / `iconposition` / `halignlabel` / `valignlabel` / `selected` / `checkboxshow` / `checkboxposition` / `iconurlfilltype` / `backgroundimageurlfilltype` cost **zero** JavaScript.
3. **Off-DOM build + single append** — ~1 live-DOM mutation per instance instead of 3–4.
4. **Lazy icon/label creation** — no empty nodes, fewer elements to lay out. The label's multi-line clamp is measured **only** when `multilinesupport` is on (and never via an observer), so the common single-line case does no layout read.
5. **Flattened DOM** — no wrapper `div`; 2–3 nodes per button instead of 5+.
6. **Single-pass initialization** — property values written directly into the store, handlers run once.
7. **Minimal observed attributes** — fewer `attributeChangedCallback` invocations during parse.
8. **Lazy logger + non-observed diagnostics/accessibility** — `debug` / `trace` allocate no logger while off, and `role` / `id` / `data-ch5-id` add no attribute-change callbacks, so diagnostics and accessibility are effectively free at scale.

---

## 7. Performance results

**Test page:** Page 13 — **1200** `ch5-light-button` components, a random unique mix covering all `shape` / `size` / `type` / `iconclass` / `iconposition` values.
**Metric:** page "load time (trigger → painted)" reported in the console.

### 7.1 ch5-light-button — before vs after optimization (1200 components)

| Scenario | Before optimization | After optimization | Improvement |
|---|---|---|---|
| First page load (cold) | ~279 ms | ~249 ms | ~11% |
| Steady-state reload | ~165–185 ms | **~82–86 ms** | **~2× faster** |

The steady-state render time for 1200 buttons was roughly **halved** by the off-DOM build, the removal of the double render, and the CSS-first approach.

### 7.2 Measured head-to-head — plain `<button>` vs ch5-button vs ch5-light-button

Same test page and count for all three, measured under two scenarios: **zero attributes** (bare button) and **with a label**. Lower is better.

| Scenario (1200 buttons) | Plain HTML `<button>` | ch5-button | ch5-light-button |
|---|---|---|---|
| Zero attributes | **74 ms** | 1279 ms | 96 ms |
| With label | **84 ms** | 1858 ms | 121 ms |

**Takeaways:**

- `ch5-light-button` renders in **~96–121 ms**, only **~22–37 ms** slower than a plain HTML `<button>` — it sits right next to the theoretical floor.
- `ch5-button` costs **~1279–1858 ms** for the same page: roughly **13×–15× slower** than `ch5-light-button` and **~17×–22× slower** than plain HTML. This is the cost of the `Ch5Common` stack (signals, `MutationObserver`, debounce, modes) running per instance.
- Adding a label adds only **~10 ms** to plain HTML, **~25 ms** to `ch5-light-button`, but **~579 ms** to `ch5-button` — the light button's lazy, single-append label creation scales far better.

### 7.3 Architectural comparison — ch5-button vs ch5-light-button vs plain HTML `<button>`

The rankings below are backed by the **measured** figures in section 7.2.

| Aspect (1200 buttons) | Plain HTML `<button>` | ch5-light-button | ch5-button |
|---|---|---|---|
| Base class | none | `HTMLElement` | `Ch5Common` stack |
| Per-instance JS on load | none | minimal (label + icon + icon-url + bg-image) | high (signals, observer, debounce, modes) |
| DOM nodes per button | 1 | 2–3 | 5+ (incl. wrapper) |
| Variant styling | CSS | CSS | JS + CSS |
| Signal / join support | no | no | yes |
| Zero-attribute render (1200) | **74 ms** | 96 ms | 1279 ms |
| With-label render (1200) | **84 ms** | 121 ms | 1858 ms |
| Relative ranking | 🟢 1st | 🟢 2nd (close to HTML) | 🔴 3rd |

> **Note:** Plain HTML is the theoretical floor (no custom-element upgrade, no JS). `ch5-light-button` sits very close to it because its per-instance JS is tiny and all variants are CSS. `ch5-button` is heavier by design because it provides signals, modes, and feedback — features `ch5-light-button` intentionally omits.

### 7.4 How to reproduce the measurement

1. Build the component library and theme.
2. Load a page with **1200** instances of each button type (same shapes/sizes/types), one type per page.
3. Read the console `Page "<id>" load time (trigger → painted): <n> ms`.
4. Reload several times and record the **steady-state** value (ignore the first cold load, which includes one-time framework/i18next init).

---

## 8. Summary

`ch5-light-button` delivers the visual flexibility of `ch5-button` (shape, size, type, stretch, icon, icon position, icon URL, icon-url fill type, background image, background-image fill type, label, multi-line / truncated label) at a fraction of the runtime cost by:

- extending `HTMLElement` directly instead of `Ch5Common`,
- moving **all** variant styling to CSS attribute selectors,
- keeping the JS surface to just `label`, `iconclass`, `iconurl`, `backgroundimageurl`, and the label-wrapping `multilinesupport` / `truncatetext` (plus six opt-in button signals — `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl` and `receivestatebackgroundimageurl` — and the base class's `receivestateenable`, `receivestateshow` and `sendeventonshow`, that only activate when used),
- building the DOM off-screen and appending once.

The trade-off is a **deliberately minimal signal surface** — six opt-in button signals (`receivestatetype` for the button `type`, `receivestateselected` for the `selected` state, `receivestatelabel` for the label, and `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl` for the icon class, icon URL and background image URL), plus the base class's `receivestateenable` (enable/disable), `receivestateshow` (show/hide) and `sendeventonshow` (reports show state), and the button's send signal `sendeventonclick` — and no modes/feedback. Use `ch5-button` when full control-system interactivity is required, and `ch5-light-button` when you need many themeable buttons rendered fast.

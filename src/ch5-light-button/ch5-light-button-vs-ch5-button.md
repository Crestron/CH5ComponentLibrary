# ch5-light-button vs ch5-button

> A lightweight, presentation-only button web component built as an alternative to the full-featured `ch5-button`. This page documents the differences, the attributes implemented, the engineering challenges, the good practices followed, and the performance results.

---

## 1. Overview

`ch5-light-button` is a **lightweight custom element** that renders a themeable button with an optional label and icon. Unlike `ch5-button`, it does **not** extend `Ch5Common` and carries **no** always-on signal / join / contract machinery. Instead it extends a tiny, purpose-built base class, `Ch5LightBaseClass` (which extends `HTMLElement` directly), that adds only the shared presentation attributes `show` / `noshowtype` — with no `MutationObserver` or debounce timers. Signals are supported only as a **strictly opt-in** feature: six signal attributes — `receivestatetype` (drives the button `type`), `receivestateselected` (drives the `selected` state), `receivestatelabel` (drives the label), `receivestateiconclass` (drives the icon class), `receivestateiconurl` (drives the icon URL), and `receivestatebackgroundimageurl` (drives the background image URL) — can be used, and each costs nothing (no subscription, no closure, no signal object) unless its attribute is actually present. The first two style through a separate `data-signal-*` CSS channel (their targets are pure-CSS attributes); the last four are rendered in JS and so **write straight into the corresponding static slot** (`label` / `iconClass` / `iconUrl` / `backgroundImageUrl`). It is designed for pages that need a large number of visually-rich buttons where control-system binding is mostly not required, and where **render performance at scale** is the priority.

> This is **version one**. It intentionally ships a focused set of attributes that cover the most common presentation needs. Additional capabilities will be introduced **incrementally** in later versions (see the roadmap in section 2).

| | ch5-button | ch5-light-button |
|---|---|---|
| Base class | `Ch5Common` → `Ch5CommonInput` → `HTMLElement` | `Ch5LightBaseClass` → `HTMLElement` |
| Purpose | Full interactive control (signals, modes, feedback) | Presentation / lightweight button |
| Signal / join support | Yes (`receiveState*`, `sendEventOn*`, contracts) | Opt-in signals (`receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl`); zero cost when unused |
| Multi-mode support | Yes (`ch5-button-mode`, `-mode-state`, `-label`) | No |
| Styling of variants | Mix of JS class toggling + CSS | 100% CSS attribute selectors |
| DOM depth | Host → wrapper `div` → `button` → (label, icon, checkbox, span) | Host → `button` → (icon, label) |
| Per-instance JS work | High | Minimal |

---

## 2. Attributes implemented in ch5-light-button

The component's own JavaScript handles **four** presentation attributes (`label`, `iconclass`, `iconurl`, `backgroundimageurl`) plus **six opt-in signal** attributes (`receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl`). Two more — `show` and `noshowtype` — are handled in JavaScript by the shared lightweight base class (`Ch5LightBaseClass`), and `disabled` is resolved with **pure CSS**. Everything else is **pure CSS**, driven by attribute selectors on the host element.

| Attribute | Handled by | Values | Notes |
|---|---|---|---|
| `label` | **JavaScript** | any string | Renders a `<span class="ch5-light-button--label">`; created lazily only when a label is present. |
| `iconclass` | **JavaScript** | Font Awesome / Material class(es) | Renders an `<i class="ch5-light-button--icon ...">`; created lazily only when present. |
| `iconurl` | **JavaScript** | any image URL | Renders the icon as a background image on an `<i class="ch5-light-button--img">`. **Takes priority over `iconclass`** — when both are set, `iconurl` wins (the `--img` and `--icon` classes are mutually exclusive, matching `ch5-button`). Created lazily. |
| `backgroundimageurl` | **JavaScript** | any image URL | Applies the URL as an inline `background-image` **directly on the `<button>` element** (same approach as `ch5-button`). A URL from an attribute cannot be injected with pure CSS, so only this one line runs in JS. |
| `receivestatetype` | **JavaScript (opt-in signal)** | a string signal name | Subscribes to a Crestron **string** signal and writes its value (validated against the `type` list; unknown values fall back to `default`) to a **separate `data-signal-type` attribute — never the author's `type`**. The theme SCSS styles `[data-signal-type]` with priority over `[type]` (static `[type]` selectors carry a `:not([data-signal-type])` guard), so the signal has **absolute priority over the static `type` even if `type` is changed at runtime** — with no JS observe/render step. Removing the attribute simply removes `data-signal-type`, so the author's static `type` styles the button again. **Strictly opt-in and zero-cost when absent**: no signal object, subscription, or closure is created unless the attribute is present. Reuses the shared `Ch5SignalFactory`; the subscription is torn down on disconnect and re-established on reconnect. It shares its lazy subscription helper with `receivestateselected`. |
| `receivestateselected` | **JavaScript (opt-in signal)** | a boolean signal name | Subscribes to a Crestron **boolean** signal and writes its value to a **separate `data-signal-selected` attribute — never the author's `selected`**. The theme SCSS styles `[data-signal-selected]` with priority over `[selected]` (static `[selected]` selectors carry a `:not([data-signal-selected])` guard), so the signal has **absolute priority over the static `selected` even if `selected` is changed at runtime** — with no JS observe/render step. `data-signal-selected="true"` applies the selected look; `"false"` forces the not-selected look while still suppressing the static `selected`, so the signal can drive **either** state. The selected colours are type-dependent, so each signal rule resolves the effective type the same way the `type` channel does (`data-signal-type` wins over `type`). Removing the attribute removes `data-signal-selected`, so the author's static `selected` styles the button again. **Strictly opt-in and zero-cost when absent**: no signal object, subscription, or closure is created unless the attribute is present. Reuses the same lazy `Ch5LightSignal` helper as `receivestatetype`; the subscription is torn down on disconnect and re-established on reconnect. |
| `receivestateiconclass` | **JavaScript (opt-in signal)** | a string signal name | Subscribes to a Crestron **string** signal and **writes its value straight into the `iconClass` slot** (the same property the static `iconclass` uses), then re-renders through the normal icon pipeline. Unlike `type` / `selected` (which use a separate `data-signal-*` CSS channel), the icon is **rendered in JS**, so there is no CSS channel to duplicate — the signal simply supersedes the static value (the **write-through** pattern, same as `ch5-animation`). Relies on the platform contract that only the signal updates the icon class at runtime (the static `iconclass` is design-time only), so the signal is always the last writer and always wins. **Strictly opt-in and zero-cost when absent.** Reuses the shared lazy `Ch5LightSignal` helper; torn down on disconnect, re-established on reconnect. |
| `receivestateiconurl` | **JavaScript (opt-in signal)** | a string signal name | Same **write-through** pattern as `receivestateiconclass`, but into the `iconUrl` slot. `iconurl` still wins over `iconclass`, so a signal-driven URL renders the `--img` variant. The `iconurlfilltype` CSS keeps working unchanged because it is scoped to `[iconurlfilltype]` and the JS-created `--img` element (**not** to the `[iconurl]` attribute). **Opt-in and zero-cost when absent.** |
| `receivestatebackgroundimageurl` | **JavaScript (opt-in signal)** | a string signal name | Same **write-through** pattern into the `backgroundImageUrl` slot (inline `background-image` on the `<button>`). **Additionally reflects the `backgroundimageurl` attribute onto the host** so the `backgroundimageurlfilltype` CSS — which is scoped to `ch5-light-button[backgroundimageurl]` — matches for signal-driven URLs exactly as it does for static ones. Without this reflection the fill type would be ignored when the URL comes from a signal. **Opt-in and zero-cost when absent.** |
| `receivestatelabel` | **JavaScript (opt-in signal)** | a string signal name | Same **write-through** pattern as `receivestateiconclass`, but into the `label` slot (`handleLabel` renders/updates the `<span class="ch5-light-button--label">`). This is the simplest write-through case — the label has no fill-type CSS, so no host-attribute reflection is needed. Relies on the platform contract that only the signal updates the label at runtime (the static `label` is design-time only), so the signal is always the last writer and always wins. **Opt-in and zero-cost when absent.** |
| `sendeventonclick` | **JavaScript (opt-in signal, send)** | a boolean signal name | The first **send** (outbound) signal. On press (`pointerdown`) it publishes **`true`**; on release (`pointerup` / `pointerleave` / `pointercancel`) it publishes **`false`** — a plain **momentary boolean**, *not* the repeat-digital object form (matches `ch5-image`'s click behaviour). Publishing goes through a tiny stateless `Ch5LightSignal.sendBoolean()` (`getBooleanSignal(name).publish(value)`). A `_clickPressed` flag prevents a stray release (e.g. `pointerleave` with no prior press) sending a spurious `false`. **Strictly opt-in and zero-cost when absent**: the pointer listeners are attached only while the attribute is set, torn down on disconnect and re-attached on reconnect. A `disabled` button (host `pointer-events:none`) never fires `pointerdown`, so nothing is sent while disabled. |
| `show` | **JavaScript** (base class) | `true` (default), `false` | Shows / hides the host. Handled by `Ch5LightBaseClass` with **no signals** — it toggles a lightweight host CSS class (or performs a DOM detach for `noshowtype="remove"`). The hide strategy is chosen by `noshowtype`. |
| `noshowtype` | **JavaScript** (base class) | `display` (default), `visibility`, `remove` | Chooses how `show="false"` hides the element: `display` → adds `ch5-light-hide-display` (`display:none`); `visibility` → adds `ch5-light-hide-visibility` (`visibility:hidden`, keeps its layout space); `remove` → detaches the host from the DOM (caching parent / next sibling) and reattaches it when shown again. Mirrors `ch5-button` / `Ch5BaseClass` semantics, implemented by toggling two lightweight host CSS classes (shipped in the theme) rather than writing inline styles. |
| `disabled` | **CSS** | bare `disabled`, `true`, `false` | Greys out the button and blocks interaction (`pointer-events:none`, `user-select:none`, reduced opacity). The element is disabled for a bare `disabled` attribute or `disabled="true"`, but **not** for `disabled="false"` (case-insensitive). Resolved purely with the CSS selector `ch5-light-button[disabled]:not([disabled="false" i])` — no JavaScript. |
| `selected` | **CSS** | bare `selected`, `true`, `false` | Applies the selected visual state (per-type background, border, label and icon colours) using the existing `--ch5-light-button--{type}-selected-*` theme variables. Rules are generated per type and scoped to `ch5-light-button[type="…"][selected]:not([selected="false" i])` (plus a default-type variant), so each `[selected]` selector wins on specificity over its base type without `!important`. `selected="false"` is treated as not-selected. This is the **static** selected look only — no JS, no signal/toggle behaviour; a consumer sets or removes the attribute itself. It can be overridden at runtime by the `receivestateselected` signal, which styles through a **separate** `data-signal-selected` channel (every static `[selected]` selector is guarded with `:not([data-signal-selected])`), so the signal wins while active. |
| `iconposition` | **CSS** | `first` (default), `last`, `top`, `bottom` | Uses the CSS `order` property, so DOM order is irrelevant. Applies to both the `--icon` and `--img` variants. |
| `halignlabel` | **CSS** | `center` (default), `left`, `right` | Horizontally aligns the icon + label group inside the `<button>`. Pure CSS: maps to the flex container's `justify-content` (row layouts) or `align-items` (column layouts, i.e. `iconposition="top"/"bottom"`), plus `text-align` on the label for multi-line text. The `center` default is the flex centering already set by `iconposition`, so only `left`/`right` add rules. |
| `valignlabel` | **CSS** | `middle` (default), `top`, `bottom` | Vertically aligns the icon + label group inside the `<button>`. Pure CSS: maps to the flex container's `align-items` (row layouts) or `justify-content` (column layouts). The `middle` default is the flex centering already set by `iconposition`, so only `top`/`bottom` add rules. |
| `iconurlfilltype` | **CSS** | `null` (default), `stretch`, `stretch-aspect`, `center`, `tile`, `initial` | Sets how the `iconurl` image fills the button via the CSS `background-size` property. Only affects the `--img` (iconUrl) variant, never the `--icon` font glyph. For `stretch` / `stretch-aspect` / `center` / `tile` the image is taken out of flow and stretched to fill the whole button, with the label kept on top (`z-index`). |
| `backgroundimageurlfilltype` | **CSS** | `stretch-aspect` (default), `stretch`, `center`, `tile` | Sets how the `backgroundimageurl` image fills the button via the CSS `background-size` / `background-position` / `background-repeat` properties, applied to the `<button>` element itself. Rules are scoped to `ch5-light-button[backgroundimageurl]` so buttons without a background image are never matched. Matches `ch5-button`'s `BACKGROUND_IMAGE_FILL_TYPE`. |
| `shape` | **CSS** | `rounded-rectangle` (default), `rectangle`, `circle`, `oval`, `tab` | Attribute selectors + a shape mixin. |
| `size` | **CSS** | `regular` (default), `x-small`, `small`, `large`, `x-large` | Attribute selectors + a size mixin. |
| `type` | **CSS** | `default`, `primary`, `secondary`, `info`, `success`, `warning`, `danger`, `text` | Attribute selectors + a content/colour mixin. The author's `type` attribute is **never mutated** by the component. It can be overridden at runtime by the `receivestatetype` signal, which styles through a **separate** `data-signal-type` channel (see below); every static `[type]` selector is guarded with `:not([data-signal-type])` so the signal wins while active. |
| `stretch` | **CSS** | `width`, `height`, `both` | Overrides only the stretched dimension; keeps a per-size min-height. |

### Roadmap — introduced step by step

`ch5-light-button` follows a phased approach. **Version one** implements the attributes listed above. The following `ch5-button` capabilities are **not part of version one** and are candidates to be introduced in later versions as the need arises:

`labelInnerHTML`, `mode`, `orientation`, `checkboxPosition`, `sgIcon*`, `customClass`, `customStyle`, `formType`, and the remaining `receiveState*` / `sendEventOn*` signal attributes (of the signal attributes, only `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl`, and the send signal `sendeventonclick` are implemented in version one).

Keeping the initial surface small is deliberate — it is what lets version one stay lightweight and fast at scale. Features will be added only when required, so the component grows in controlled steps rather than carrying the full `ch5-button` weight up front.

---

## 3. What we changed compared to ch5-button

1. **Removed the `Ch5Common` inheritance.** `ch5-light-button` extends a tiny `Ch5LightBaseClass` (which extends `HTMLElement` directly). The base class adds only `show` / `noshowtype` (and the `disabled` attribute contract) with **no** always-on signal machinery. This removes, per instance: the property registry, the `MutationObserver`, blanket signal subscription/unsubscription, debounce timers, and the common attribute-processing pipeline. Signals are re-introduced only as **opt-in** `receivestatetype` / `receivestateselected` / `receivestatelabel` / `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl` attributes that subscribe lazily and cost nothing when unused.
2. **Removed the wrapper `<div>`.** In `ch5-button` the primary class lives on an internal wrapper `div`. In `ch5-light-button` the **host element itself** carries the `ch5-light-button` class and the `<button>` is its only structural child. This flattens the DOM.
3. **Moved all variant styling to CSS.** `shape`, `size`, `type`, `stretch`, `iconposition`, `halignlabel`, `valignlabel`, `selected`, `iconurlfilltype`, and `backgroundimageurlfilltype` are resolved entirely with **attribute selectors** (e.g. `ch5-light-button[shape="circle"]`) and **CSS custom properties**. No JavaScript runs for these.
4. **Minimised the JavaScript surface.** Only `label`, `iconclass`, `iconurl`, and `backgroundimageurl` are processed in JS, and all elements are created **lazily** (only when a value is present). When both `iconurl` and `iconclass` are set, `iconurl` wins. `backgroundimageurl` is a single inline-style assignment on the `<button>` (no element created). The six opt-in signal attributes subscribe only when present. `receivestatetype` and `receivestateselected` write their resolved values to separate `data-signal-type` / `data-signal-selected` attributes — styling stays 100% CSS, and the author's `type` / `selected` are never mutated. The other four (`receivestatelabel` / `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl`) drive JS-rendered content, so they **write straight into** the corresponding `label` / `iconClass` / `iconUrl` / `backgroundImageUrl` slot and re-render through the normal pipeline (`receivestatebackgroundimageurl` also reflects the `backgroundimageurl` host attribute so the fill-type CSS matches).
5. **Single, off-DOM build.** The button subtree is built while detached and appended to the host in **one** DOM mutation.

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

### JS write-through for `receivestatelabel` / `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl`

Unlike `type` / `selected` — which are **pure-CSS** attributes and therefore need a separate `data-signal-*` channel so the cascade can prioritise the signal — `label`, `iconclass`, `iconurl`, and `backgroundimageurl` are **rendered in JS**. There is no static CSS channel to override, so these signals take the simpler **write-through** approach used by `ch5-animation`: the signal value is written **straight into the same slot** the static attribute uses (`label` / `iconClass` / `iconUrl` / `backgroundImageUrl`), which re-renders through the normal label / icon / background pipeline. No new attribute channel, no duplicated CSS.

This is safe because of the platform contract that, **at runtime, only the signal updates these values** — the static `label` / `iconclass` / `iconurl` / `backgroundimageurl` are set once at design time and never re-written live. So the signal is always the last writer and therefore always wins.

One extra step is needed for the background image only: the `backgroundimageurlfilltype` CSS is scoped to the host selector `ch5-light-button[backgroundimageurl]` (for performance — buttons with no background image are never matched). A static author sets that attribute in markup, but a signal-driven URL would leave the host without it, so the fill type would be ignored (every mode looks identical). `applySignalBackgroundImageUrl` therefore **reflects the `backgroundimageurl` attribute onto the host** (removing it when the signal clears), so the fill type works identically for static and signal values. `receivestateiconurl` needs no such step: the `iconurlfilltype` CSS is scoped to `[iconurlfilltype]` and the JS-created `--img` element, **not** to the `[iconurl]` attribute.

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
| 19 | **Adding the first *send* signal (`sendeventonclick`) without reintroducing always-on listeners the light button avoids, and without pulling in the repeat-digital machinery.** | Attach the pointer listeners **only while the attribute is set** (lazy handlers, torn down on disconnect / clear, re-attached on reconnect — mirroring the receive-signal teardown), so signal-free buttons attach nothing. Publish a **plain** boolean via a tiny stateless `Ch5LightSignal.sendBoolean()` (`getBooleanSignal(name).publish(value)`) — `true` on `pointerdown`, `false` on `pointerup`/`pointerleave`/`pointercancel` — not the `{ [REPEAT_DIGITAL_KEY]: value }` object form. A `_clickPressed` flag keeps press/release balanced; `disabled` (host `pointer-events:none`) blocks events with no JS guard. |

---

## 5. Good practices followed

- **Build off-DOM, append once** — construct the entire `button > (icon + label)` subtree while detached, then perform a single `appendChild` to the host. Minimises layout/reflow.
- **Lazy element creation** — the `<i>` and `<span>` are created only when `iconclass` / `iconurl` / `label` are actually set (icon-only or label-only buttons stay minimal).
- **CSS-first variants** — `shape`, `size`, `type`, `stretch`, `iconposition`, `halignlabel`, `valignlabel`, `selected`, `iconurlfilltype`, `backgroundimageurlfilltype` are declarative CSS. Zero JS cost, and themeable via CSS custom properties.
- **`className =` over `classList.add()`** for freshly created nodes (single assignment vs API calls).
- **`appendChild` over `insertBefore`** — no `firstChild` lookup; position handled by CSS `order`.
- **Minimal `observedAttributes`** — only the JS-managed attributes (`label`, `iconclass`, `iconurl`, `backgroundimageurl`, `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, `receivestatebackgroundimageurl` plus the base class's `show` / `noshowtype`) are observed, so CSS-only attribute changes (`disabled`, `shape`, `size`, …) never trigger a JS callback.
- **Opt-in, lazy signals** — `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl`, and `receivestatebackgroundimageurl` are the only signal attributes. None creates a signal helper, subscription, or callback closure unless its attribute is actually present; the subscription callback is allocated at subscribe time rather than as a per-instance class field, so signal-free buttons stay at zero cost. The subscribe/unsubscribe plumbing lives in a tiny reusable helper (`Ch5LightSignal`, in `ch5-light-base`) that imports only `Ch5Signal` / `Ch5SignalFactory` (no lodash / `Ch5Property` / `Ch5Common`) and exposes a thin generic surface — `subscribe(name, type, onValue)`, per-signal `unsubscribe(name)` / `isSubscribedTo(name)`, and `unsubscribeAll()`. The button consolidates its signal wiring into three shared generics (`subscribeSignal` / `clearSignalSubscription` / `clearSignalChannel`), so each `receiveState*` is a thin wrapper and the signals never interfere. Two styling strategies are used: `type` / `selected` write a separate `data-signal-*` CSS channel (their targets are pure-CSS attributes), while `label` / `iconclass` / `iconurl` / `backgroundimageurl` are JS-rendered and so **write straight into** the matching `label` / `iconClass` / `iconUrl` / `backgroundImageUrl` slot. Each reuses the shared `Ch5SignalFactory`, tears down on disconnect, and re-subscribes on reconnect.
- **Change-detection in setters** — runtime property assignments only touch the DOM when the value actually changes.
- **Shared lightweight property store** — both the base class (`show` / `noshowtype`) and the button (`label` / `iconclass` / `iconurl` / `backgroundimageurl`) use a single, dependency-free `Ch5LightProperties` instance (plain key/value map + change detection, **no** signals / lodash / reflection). The button registers its own properties onto the base store via `add()`, so no second store is allocated.
- **Idempotent, reconnect-safe lifecycle** — `connectedCallback` fully rebuilds; `disconnectedCallback` is a no-op.

---

## 6. Main performance boosters

1. **No `Ch5Common` base class** — eliminates per-instance signal subscriptions, `MutationObserver`, debounce timers, and the property registry. This is the single biggest win. (The six signals that exist, `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl` and `receivestatebackgroundimageurl`, are opt-in and only subscribe when present.)
2. **CSS-only variants** — `shape` / `size` / `type` / `stretch` / `iconposition` / `halignlabel` / `valignlabel` / `selected` / `iconurlfilltype` / `backgroundimageurlfilltype` cost **zero** JavaScript.
3. **Off-DOM build + single append** — ~1 live-DOM mutation per instance instead of 3–4.
4. **Lazy icon/label creation** — no empty nodes, fewer elements to lay out.
5. **Flattened DOM** — no wrapper `div`; 2–3 nodes per button instead of 5+.
6. **Single-pass initialization** — property values written directly into the store, handlers run once.
7. **Minimal observed attributes** — fewer `attributeChangedCallback` invocations during parse.

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

`ch5-light-button` delivers the visual flexibility of `ch5-button` (shape, size, type, stretch, icon, icon position, icon URL, icon-url fill type, background image, background-image fill type, label) at a fraction of the runtime cost by:

- extending `HTMLElement` directly instead of `Ch5Common`,
- moving **all** variant styling to CSS attribute selectors,
- keeping the JS surface to just `label`, `iconclass`, `iconurl`, and `backgroundimageurl` (plus six opt-in signals, `receivestatetype`, `receivestateselected`, `receivestatelabel`, `receivestateiconclass`, `receivestateiconurl` and `receivestatebackgroundimageurl`, that only activate when used),
- building the DOM off-screen and appending once.

The trade-off is a **deliberately minimal signal surface** — six opt-in signals (`receivestatetype` for the button `type`, `receivestateselected` for the `selected` state, `receivestatelabel` for the label, and `receivestateiconclass` / `receivestateiconurl` / `receivestatebackgroundimageurl` for the icon class, icon URL and background image URL), and no modes/feedback. Use `ch5-button` when full control-system interactivity is required, and `ch5-light-button` when you need many themeable buttons rendered fast.

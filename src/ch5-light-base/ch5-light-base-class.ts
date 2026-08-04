import { Ch5Uid } from "../ch5-core";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log";
import { Ch5LightProperties, ICh5LightPropertySettings } from "./ch5-light-properties";
import { Ch5LightSignal } from "./ch5-light-signal";

/** How a light component hides itself — mirrors `Ch5BaseClass` noshowtype. */
export type TCh5LightShowType = 'display' | 'visibility' | 'remove';

/**
 * Lightweight base class for the "light" family of Ch5 components
 * (e.g. `ch5-light-button`).
 *
 * Unlike `Ch5Common` / `Ch5BaseClass` it deliberately carries **no** signal
 * machinery, **no** `MutationObserver`, **no** debounce timers and **no** lodash.
 * It extends `HTMLElement` directly and only adds the most common presentation
 * attributes — `show` (together with `noshowtype`) — through a minimal
 * `Ch5LightProperties` store. This keeps the per-instance cost close to a bare
 * custom element so the performance gains of the light components are preserved.
 *
 * `show` supports the same three `noshowtype` modes as `Ch5BaseClass`
 * (`display`, `visibility`, `remove`). For `display` / `visibility` it toggles
 * two lightweight host CSS classes (`ch5-light-hide-display` /
 * `ch5-light-hide-visibility`); for `remove` it detaches the host from the DOM.
 * The two hide classes must be shipped in the theme.
 *
 * `disabled` is styled entirely from CSS via the host `[disabled]` attribute
 * selector — the STATIC attribute needs no JS and is never mutated by this class.
 *
 * `receiveStateEnable` is a **strictly opt-in** boolean receive signal and the
 * only signal the base itself supports. It costs nothing when absent: no signal
 * helper, subscription or closure is created unless the attribute is present (the
 * `Ch5LightSignal` helper is created lazily on first subscribe), so 1000+
 * signal-free instances pay zero. A signal value of `true` enables the host,
 * `false` disables it. Mirroring the light button's `type` / `selected` signals,
 * the resolved state is written to a SEPARATE `data-signal-enable` channel
 * (never to the author's `disabled`); the theme CSS guards the static
 * `[disabled]` rule with `:not([data-signal-enable])` and styles
 * `[data-signal-enable="false"]` as disabled, so the signal takes **absolute
 * priority** over a static `disabled` (even if the author toggles it at runtime)
 * while the author's own `disabled` attribute is preserved and restored the
 * moment the signal is removed. The subscription is torn down on disconnect and
 * re-established on reconnect.
 *
 * Diagnostics mirror the heavy components but are kept allocation-free until
 * actually used:
 *  - Every instance gets a framework-unique `crId` (`cr-id-N`, from `Ch5Uid`) in
 *    the constructor (a counter increment + short string) and reflects it as the
 *    `data-ch5-id` attribute once in `connectedCallback`, exactly like
 *    `ch5-button` / `ch5-image` / `ch5-common`.
 *  - `debug` / `trace` are observed, reactive booleans (same semantics as
 *    `Ch5Common`). When both are off — the normal case — NO logger object is
 *    allocated at all: the shared leaf `Ch5CommonLog` is created LAZILY only on
 *    the first log while diagnostics are enabled, so 1000+ idle instances cost
 *    zero loggers. Use the guarded {@link log} helper for cheap no-op logging.
 *
 * `role` and `id` are exposed as **non-observed** attributes (they are never added
 * to `observedAttributes`, so they cost nothing on the hot attribute-change path):
 *  - `id` is the standard reflected HTML attribute — no JS is added for it.
 *  - `role` is an accessibility attribute applied automatically, once, in
 *    `connectedCallback`, and only when the author has not already set one (so a
 *    user-provided `role` always wins). Each concrete component supplies its own
 *    value by overriding {@link getDefaultRole}. The base ships a tiny,
 *    dependency-free default (no import of the heavy `Ch5RoleAttributeMapping`),
 *    so the per-instance cost is a single `hasAttribute` check.
 *
 * Derived components must:
 *  - merge `LIGHT_BASE_OBSERVED_ATTRIBUTES` into their static `observedAttributes`;
 *  - call `super.attributeChangedCallback(...)` for attributes they do not handle;
 *  - call `super.connectedCallback()` (after building their internal DOM) so the
 *    base attributes are applied and overridden handlers can reach child nodes.
 *
 * See ../ch5-light-button/ch5-light-button.md for the full design reference
 * (class hierarchy, extension playbook, GC/allocation rules) covering this
 * base class and its first concrete implementation, `Ch5LightButton`. Update
 * that document alongside any change to this base class's public contract.
 */
export abstract class Ch5LightBaseClass extends HTMLElement {

	//#region Constants

	/** Valid `noshowtype` values, in the same order as `Ch5BaseClass` (default first). */
	public static readonly NO_SHOW_TYPES: readonly TCh5LightShowType[] = ['display', 'visibility', 'remove'];

	/** Host CSS class that hides the element via `display:none` (shipped in the theme). */
	public static readonly HIDE_DISPLAY_CSS_CLASS = 'ch5-light-hide-display';

	/** Host CSS class that hides the element via `visibility:hidden` (shipped in the theme). */
	public static readonly HIDE_VISIBILITY_CSS_CLASS = 'ch5-light-hide-visibility';

	/**
	 * Attributes handled by this base class. A derived component must merge this
	 * list with its own in its static `observedAttributes` getter. `debug` /
	 * `trace` are observed so logging can be toggled at runtime; they cost nothing
	 * unless the attribute actually changes. `receivestateenable` is observed so the
	 * enable/disable signal can be attached / changed at runtime; it is strictly
	 * opt-in and allocates nothing (no signal helper, subscription or closure)
	 * unless the attribute is actually present.
	 *
	 * `class`, `style` and `dir` are NOT listed: they are standard, natively
	 * reflected HTML attributes and work directly on the host with no JS. The base
	 * only ever writes `classList` / `.style` on a concrete component's INTERNAL
	 * elements (e.g. the light button's inner `<button>`), so the author's host
	 * `class` / `style` / `dir` are never touched - observing them would cost
	 * hot-path work for behaviour the browser already provides for free.
	 */
	public static readonly LIGHT_BASE_OBSERVED_ATTRIBUTES = ['show', 'noshowtype', 'debug', 'trace', 'receivestateenable'];

	/**
	 * Separate styling channel the `receiveStateEnable` signal writes to (never the
	 * author's `disabled`), mirroring the light button's `data-signal-type` /
	 * `data-signal-selected`. MUST stay in sync with the theme SCSS, which guards the
	 * static `[disabled]` rule with `:not([data-signal-enable])` and styles
	 * `[data-signal-enable="false"]` as disabled.
	 */
	public static readonly SIGNAL_ENABLE_ATTRIBUTE = 'data-signal-enable';

	/**
	 * Settings passed to every `Ch5LightProperties` instance created by this base
	 * class. Hoisted to a STATIC field (computed once per class, not once per
	 * component instance) - at 1000+ instances, allocating this array/object
	 * literal (and the `enumeratedValues` copy) in the constructor would mean
	 * 1000 extra allocations for data that is identical every time. Safe to
	 * share: `Ch5LightProperties` only reads `name`/`default` from each entry
	 * during construction and never retains or mutates the array.
	 */
	private static readonly LIGHT_BASE_PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		{ name: 'show', default: true, type: 'boolean', valueOnAttributeEmpty: true },
		{
			name: 'noshowType',
			default: Ch5LightBaseClass.NO_SHOW_TYPES[0],
			type: 'enum',
			enumeratedValues: [...Ch5LightBaseClass.NO_SHOW_TYPES]
		},
		{ name: 'receiveStateEnable', default: '', type: 'string' }
	];

	//#endregion

	//#region Variables

	protected _ch5Properties: Ch5LightProperties;

	/** Framework-unique id (`cr-id-N`) assigned once in the constructor; reflected as `data-ch5-id`. */
	protected readonly _crId: string = Ch5Uid.getUid();

	/** Diagnostic flags. Both default OFF, so no logger is ever allocated in the common case. */
	protected _isDebugEnabled = false;
	protected _isTraceEnabled = false;

	/**
	 * `true` once the diagnostic flags have been authoritatively read from the DOM
	 * (in {@link initLightBaseAttributes}, i.e. on first connect). Until then the
	 * guarded log helpers cheaply re-sync the flags from the DOM so that logs which
	 * fire DURING the initial attribute batch — every `attributeChangedCallback`
	 * runs before `connectedCallback` and, because reactions are batched, before
	 * the `debug`/`trace` attribute's own callback has set the cached flag — are
	 * still emitted regardless of the order the author wrote the attributes in.
	 * After init this gate makes the sync a single boolean check, so there is zero
	 * ongoing cost on hot attribute-change paths.
	 */
	private _diagnosticsInitialized = false;

	/**
	 * Lazily-created logger. Stays `null` — and therefore un-allocated — until the
	 * first log call made while `debug`/`trace` is on. Reuses the shared leaf
	 * `Ch5CommonLog` (which itself only imports `Ch5Debug`), so no heavy
	 * `ch5-common` machinery is pulled in.
	 */
	private _logger: Ch5CommonLog | null = null;

	/** Cached parent/sibling used to reattach the host when `noshowtype` = 'remove'. */
	private _cachedParentEl: Node | null = null;
	private _cachedNextSibling: Node | null = null;
	private _isDetachedFromDom = false;

	// Cached onChange callback (see the identical pattern/rationale in
	// Ch5LightButton) - created ONCE per instance so repeated `show`/`noshowType`
	// writes (e.g. driven by a fast-changing signal) never allocate a new closure.
	private readonly _onShowChange = () => this.handleShow();

	// --- receiveStateEnable signal wiring (opt-in) ----------------------------
	// The only signal the base itself supports. Strictly opt-in: `_baseSignals`
	// stays null (nothing allocated) unless a `receivestateenable` attribute is
	// present, so 1000+ signal-free instances pay nothing. It is deliberately a
	// SEPARATE helper from any a concrete component owns (e.g. the button's own
	// receiveState* signals), so this base feature never depends on subclass state
	// and the two never clash. The signal drives the SEPARATE `data-signal-enable`
	// channel (never the author's `disabled`), which the theme CSS styles.
	private _baseSignals: Ch5LightSignal | null = null;
	// Cached name-change callback (created ONCE per instance). The signal NAME lives
	// in the `_ch5Properties` store (like the light button's receiveStateSelected),
	// so `_ch5Properties.set()` hands this callback the OLD name straight away -
	// no dedicated field is needed to bridge it for unsubscription.
	private readonly _onReceiveStateEnableChange = (oldSignalName: string) => this.handleReceiveStateEnable(oldSignalName);
	// Cached value callback (created ONCE per instance) so repeated (re)subscribes
	// never allocate a new closure.
	private readonly _onSignalEnableValue = (value: boolean) => this.applyEnableState(value);

	//#endregion

	//#region Getters and Setters

	public set show(value: boolean) {
		this._ch5Properties.set<boolean>('show', value, this._onShowChange);
	}
	public get show(): boolean {
		return this._ch5Properties.get<boolean>('show');
	}

	public set noshowType(value: TCh5LightShowType) {
		this._ch5Properties.set<TCh5LightShowType>('noshowType', value, this._onShowChange);
	}
	public get noshowType(): TCh5LightShowType {
		return this._ch5Properties.get<TCh5LightShowType>('noshowType');
	}

	/**
	 * Name of a Crestron **boolean** signal that enables/disables the host
	 * (`true` = enabled, `false` = disabled), mirroring `Ch5Common.receiveStateEnable`.
	 * The resolved state is written to the SEPARATE `data-signal-enable` channel
	 * (never the author's `disabled`), which the theme CSS styles with absolute
	 * priority over a static `disabled`. **Strictly opt-in and zero-cost when absent.**
	 *
	 * The name is stored in the shared `_ch5Properties` store (same pattern as the
	 * light button's `receiveStateSelected`) for the equality short-circuit;
	 * `_ch5Properties.set()` passes the OLD name straight to the cached
	 * `_onReceiveStateEnableChange` callback, which hands it to
	 * {@link handleReceiveStateEnable} for unsubscription - no extra field, no
	 * closure allocated per call.
	 */
	public set receiveStateEnable(value: string) {
		this._ch5Properties.set<string>('receiveStateEnable', value ?? '', this._onReceiveStateEnableChange);
	}
	public get receiveStateEnable(): string {
		return this._ch5Properties.get<string>('receiveStateEnable');
	}

	public set debug(value: boolean) {
		if (this._isDebugEnabled === value) {
			return;
		}
		this._isDebugEnabled = value;
		// Only touch the logger if it already exists; never allocate one just to
		// flip a flag that is off.
		if (this._logger) {
			this._logger.isDebugEnabled = value;
		}
	}
	public get debug(): boolean {
		return this._isDebugEnabled;
	}

	public set trace(value: boolean) {
		if (this._isTraceEnabled === value) {
			return;
		}
		this._isTraceEnabled = value;
		if (this._logger) {
			this._logger.isTraceEnabled = value;
		}
	}
	public get trace(): boolean {
		return this._isTraceEnabled;
	}

	/**
	 * The lazily-created logger. Accessing this getter allocates the logger on
	 * first use, so callers on cold paths should prefer the guarded {@link log}
	 * helper (or check `_isDebugEnabled`/`_isTraceEnabled`) to stay allocation-free
	 * when diagnostics are off.
	 */
	protected get logger(): Ch5CommonLog {
		return this._logger ??= new Ch5CommonLog(this._isDebugEnabled, this._isTraceEnabled, this._crId, this.id);
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		// Minimal, dependency-free property store (change detection + callback only).
		// The extra metadata (type / enumeratedValues / valueOnAttributeEmpty) is
		// purely descriptive — the store only reads `name` + `default`, so it adds
		// no runtime cost and simply mirrors the `Ch5Properties` config shape.
		// Settings array is a shared STATIC field (see LIGHT_BASE_PROPERTY_SETTINGS) - no
		// per-instance allocation here.
		this._ch5Properties = new Ch5LightProperties(Ch5LightBaseClass.LIGHT_BASE_PROPERTY_SETTINGS);
	}

	/**
	 * Applies the base attributes to the host. A derived component should call
	 * `super.connectedCallback()` from its own `connectedCallback`, after it has
	 * built its internal DOM (so overridden handlers can reach child elements).
	 */
	public connectedCallback(): void {
		// Reflect the framework id so it is inspectable in the DOM (data-ch5-id).
		// One setAttribute per connect; idempotent on reconnect.
		if (this.getAttribute('data-ch5-id') !== this._crId) {
			this.setAttribute('data-ch5-id', this._crId);
		}
		this.applyDefaultRole();
		this.initLightBaseAttributes();
		// Subscribe the opt-in enable signal (no-op when the attribute is absent).
		this.subscribeReceiveStateEnable();
	}

	public attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		switch (attr) {
			case 'show':
				this.show = Ch5LightBaseClass.toBoolean(newValue, true);
				break;
			case 'noshowtype':
				this.noshowType = Ch5LightBaseClass.toShowType(newValue);
				break;
			case 'debug':
				this.debug = this.hasAttribute('debug') ? Ch5LightBaseClass.toBoolean(newValue, true) : false;
				break;
			case 'trace':
				this.trace = this.hasAttribute('trace') ? Ch5LightBaseClass.toBoolean(newValue, true) : false;
				break;
			case 'receivestateenable':
				this.receiveStateEnable = newValue ?? '';
				break;
		}
	}

	/**
	 * Releases the opt-in `receiveStateEnable` subscription (if any) so a detached
	 * host holds no live listener; the signal NAME is kept so a reconnect
	 * re-subscribes transparently. A derived component that overrides
	 * `disconnectedCallback` MUST call `super.disconnectedCallback()`. No-op (a
	 * single null check) for components not using `receivestateenable`.
	 */
	public disconnectedCallback(): void {
		this.clearReceiveStateEnableSubscription(this.receiveStateEnable);
	}

	//#endregion

	//#region Protected Methods

	/**
	 * Returns the framework-unique id (`cr-id-N`) assigned to this component,
	 * mirroring `Ch5Common.getCrId()`.
	 */
	public getCrId(): string {
		return this._crId;
	}

	/**
	 * Pre-connect safety net that keeps early logs from being silently dropped.
	 *
	 * Custom-element attribute reactions are BATCHED: all of an element's initial
	 * attributes are set on the DOM node before the first `attributeChangedCallback`
	 * runs, and every one of those callbacks runs before `connectedCallback` (where
	 * {@link initLightBaseAttributes} normally reads the flags). So for markup like
	 * `<ch5-light-button label="test" debug>` the `label` callback fires while the
	 * cached `_isDebugEnabled` flag is still `false`, hiding its log even though
	 * `debug` is present. Reading the attributes straight from the DOM here — only
	 * until {@link _diagnosticsInitialized} flips on first connect — makes those
	 * early logs work no matter what order the attributes appear in. It never turns
	 * a flag OFF (the real read happens in `initLightBaseAttributes`) and only ever
	 * does up to two `hasAttribute` checks, so it stays allocation-free.
	 */
	private syncDiagnosticsFromDom(): void {
		if (this._diagnosticsInitialized) {
			return;
		}
		if (this.hasAttribute('debug')) {
			const debug = Ch5LightBaseClass.toBoolean(this.getAttribute('debug'), true);
			if (debug !== this._isDebugEnabled) {
				this.debug = debug;
			}
		}
		if (this.hasAttribute('trace')) {
			const trace = Ch5LightBaseClass.toBoolean(this.getAttribute('trace'), true);
			if (trace !== this._isTraceEnabled) {
				this.trace = trace;
			}
		}
	}

	/**
	 * Guarded, allocation-free log helper. When neither `debug` nor `trace` is on
	 * (the normal case) it is a single boolean check that returns immediately —
	 * the logger is never created and `Ch5CommonLog`'s stack-trace work never
	 * runs. Prefer this over touching {@link logger} directly on cold paths.
	 */
	protected log(...message: unknown[]): void {
		this.syncDiagnosticsFromDom();
		if (this._isDebugEnabled || this._isTraceEnabled) {
			this.logger.log(...message);
		}
	}

	/**
	 * Guarded `logger.start` (opens a trace group / emits a debug line for a
	 * method entry, mirroring `ch5-button`). Allocation-free no-op when both
	 * `debug` and `trace` are off. Pair with {@link logStop}.
	 */
	protected logStart(message: string): void {
		this.syncDiagnosticsFromDom();
		if (this._isDebugEnabled || this._isTraceEnabled) {
			this.logger.start(message, this.nodeName.toLowerCase());
		}
	}

	/**
	 * Guarded `logger.stop` (closes the trace group opened by {@link logStart}).
	 * No-op unless `trace` is on, and never allocates a logger.
	 */
	protected logStop(): void {
		this.syncDiagnosticsFromDom();
		if (this._isTraceEnabled && this._logger) {
			this._logger.stop();
		}
	}

	/**
	 * The default ARIA `role` for this component, or `null` when it has none.
	 *
	 * Overridden by concrete light components (e.g. `Ch5LightButton` returns
	 * `'button'`). Kept as a plain method returning a string literal so the base
	 * family stays fully self-contained — it deliberately does NOT import the
	 * shared `Ch5RoleAttributeMapping` constants used by the heavy components, so
	 * there is no extra module coupling and nothing to allocate per instance.
	 */
	protected getDefaultRole(): string | null {
		return null;
	}

	/**
	 * Applies the component's default `role` (see {@link getDefaultRole}) to the
	 * host, but only when the author has NOT already provided one — a user-set
	 * `role` always wins. `role` is intentionally a non-observed attribute, so
	 * this runs once per connect (a single `hasAttribute` check, plus one
	 * `setAttribute` on the first connect only) and never on the attribute-change
	 * hot path. Idempotent and safe to call on every (re)connect.
	 */
	protected applyDefaultRole(): void {
		if (!this.hasAttribute('role')) {
			const role = this.getDefaultRole();
			if (role) {
				this.setAttribute('role', role);
			}
		}
	}

	/**
	 * Subscribes to the `receiveStateEnable` boolean signal (opt-in). Lazily creates
	 * the signal helper only for components that actually use the signal. No-op when
	 * the name is empty, the host is disconnected, or it is already subscribed. On
	 * subscribe the helper delivers the signal's current value immediately, so
	 * {@link applyEnableState} runs right away.
	 */
	private subscribeReceiveStateEnable(): void {
		const name = this.receiveStateEnable;
		if (!name || !this.isConnected) {
			return;
		}
		if (this._baseSignals !== null && this._baseSignals.isSubscribedTo(name)) {
			return;
		}
		(this._baseSignals ??= new Ch5LightSignal()).subscribe<boolean>(name, 'boolean', this._onSignalEnableValue);
	}

	/**
	 * Handles a change to the `receiveStateEnable` signal NAME. `oldSignalName` is the
	 * name in effect before this change (captured by `_ch5Properties.set()`, since the
	 * store already holds the NEW name by the time this runs). Tears down the previous
	 * subscription and (re)subscribes to the new one when connected. When the name is
	 * cleared it drops the `data-signal-enable` channel so the author's static
	 * `disabled` applies again.
	 */
	private handleReceiveStateEnable(oldSignalName: string): void {
		this.clearReceiveStateEnableSubscription(oldSignalName);
		if (this.receiveStateEnable) {
			this.subscribeReceiveStateEnable();
		} else if (this.hasAttribute(Ch5LightBaseClass.SIGNAL_ENABLE_ATTRIBUTE)) {
			this.removeAttribute(Ch5LightBaseClass.SIGNAL_ENABLE_ATTRIBUTE);
		}
	}

	/** Releases the `receiveStateEnable` subscription for the given signal name. */
	private clearReceiveStateEnableSubscription(signalName: string): void {
		if (this._baseSignals !== null) {
			this._baseSignals.unsubscribe(signalName);
		}
	}

	/**
	 * Applies a `receiveStateEnable` value by writing the SEPARATE `data-signal-enable`
	 * channel (`true` = enabled, `false` = disabled) instead of the author's `disabled`
	 * attribute. The theme CSS gives this channel priority over the static `disabled`,
	 * so the signal always wins while it is active and the author's `disabled` is
	 * preserved (and restored when the signal is removed). Mirrors the button's
	 * `type` / `selected` signal channels.
	 */
	protected applyEnableState(enabled: boolean): void {
		const channelValue = enabled ? 'true' : 'false';
		if (this.getAttribute(Ch5LightBaseClass.SIGNAL_ENABLE_ATTRIBUTE) !== channelValue) {
			this.setAttribute(Ch5LightBaseClass.SIGNAL_ENABLE_ATTRIBUTE, channelValue);
		}
	}

	/**
	 * Reads `show` / `noshowtype` from the DOM straight into the property store
	 * (bypassing the setters) and applies the show handler once. The STATIC
	 * `disabled` needs no JS handling — it is styled from CSS via the `[disabled]`
	 * attribute; the opt-in `receiveStateEnable` signal drives a separate
	 * `data-signal-enable` channel and never mutates `disabled`.
	 * Idempotent and safe to call on every (re)connect.
	 */
	protected initLightBaseAttributes(): void {
		const show = this.hasAttribute('show') ? Ch5LightBaseClass.toBoolean(this.getAttribute('show'), true) : true;
		const noshowType = this.hasAttribute('noshowtype')
			? Ch5LightBaseClass.toShowType(this.getAttribute('noshowtype'))
			: Ch5LightBaseClass.NO_SHOW_TYPES[0];
		this._ch5Properties.setValue<boolean>('show', show);
		this._ch5Properties.setValue<TCh5LightShowType>('noshowType', noshowType);
		// Sync diagnostic flags from the DOM (attributeChangedCallback only fires on
		// change, not on reconnect). Reads straight into the flags; the logger stays
		// un-allocated unless one of them is on and something actually logs.
		this._isDebugEnabled = this.hasAttribute('debug') ? Ch5LightBaseClass.toBoolean(this.getAttribute('debug'), true) : false;
		this._isTraceEnabled = this.hasAttribute('trace') ? Ch5LightBaseClass.toBoolean(this.getAttribute('trace'), true) : false;
		// Flags are now authoritative; the guarded log helpers can stop re-reading
		// the DOM (see syncDiagnosticsFromDom) and revert to a single boolean check.
		this._diagnosticsInitialized = true;
		if (this._logger) {
			this._logger.isDebugEnabled = this._isDebugEnabled;
			this._logger.isTraceEnabled = this._isTraceEnabled;
		}
		// Sync the receiveStateEnable signal NAME into the store from the DOM without
		// firing the change callback (attributeChangedCallback does not fire on
		// reconnect). The subscription itself happens in connectedCallback via
		// subscribeReceiveStateEnable().
		this._ch5Properties.setValue<string>('receiveStateEnable', this.getAttribute('receivestateenable') ?? '');
		this.handleShow();
	}

	/**
	 * Applies the current `show` / `noshowtype` combination to the host. Mirrors
	 * the behaviour of `Ch5BaseClass` (display / visibility / remove) — it toggles
	 * two theme CSS classes for `display` / `visibility` and detaches the host for
	 * `remove`. Overridable.
	 */
	protected handleShow(): void {
		if (this.show) {
			this.applyShowState();
		} else {
			this.applyHideState();
		}
	}

	/** Reveals the host, reattaching it first if `noshowtype` = 'remove' detached it. */
	private applyShowState(): void {
		// Clear any hide class previously applied for 'display' / 'visibility'.
		this.classList.remove(Ch5LightBaseClass.HIDE_DISPLAY_CSS_CLASS, Ch5LightBaseClass.HIDE_VISIBILITY_CSS_CLASS);

		if (this._isDetachedFromDom && this._cachedParentEl) {
			const parent = this._cachedParentEl;
			const sibling = this._cachedNextSibling;
			this._cachedParentEl = null;
			this._cachedNextSibling = null;
			this._isDetachedFromDom = false;
			if (sibling && sibling.parentNode === parent) {
				parent.insertBefore(this, sibling);
			} else {
				parent.appendChild(this);
			}
		}
	}

	/** Hides the host according to `noshowtype`. */
	private applyHideState(): void {
		this.classList.remove(Ch5LightBaseClass.HIDE_DISPLAY_CSS_CLASS, Ch5LightBaseClass.HIDE_VISIBILITY_CSS_CLASS);
		switch (this.noshowType) {
			case 'visibility':
				this.classList.add(Ch5LightBaseClass.HIDE_VISIBILITY_CSS_CLASS);
				break;
			case 'remove':
				if (!this._isDetachedFromDom && this.parentNode) {
					this._cachedParentEl = this.parentNode;
					this._cachedNextSibling = this.nextSibling;
					this._isDetachedFromDom = true;
					this.parentNode.removeChild(this);
				}
				break;
			case 'display':
			default:
				this.classList.add(Ch5LightBaseClass.HIDE_DISPLAY_CSS_CLASS);
				break;
		}
	}

	//#endregion

	//#region Helpers

	/**
	 * Coerces an attribute value to boolean without pulling in lodash.
	 * An empty attribute (e.g. `disabled`) resolves to `valueOnEmpty`.
	 */
	protected static toBoolean(value: string | boolean | null | undefined, valueOnEmpty = true): boolean {
		if (value === null || value === undefined) {
			return false;
		}
		if (typeof value === 'boolean') {
			return value;
		}
		const normalized = value.toLowerCase().trim();
		if (normalized === '') {
			return valueOnEmpty;
		}
		return normalized !== 'false' && normalized !== '0';
	}

	/**
	 * Coerces an attribute value to a valid `noshowtype`, defaulting to 'display'.
	 */
	protected static toShowType(value: string | null | undefined): TCh5LightShowType {
		const normalized = (value ?? '').toLowerCase().trim() as TCh5LightShowType;
		return Ch5LightBaseClass.NO_SHOW_TYPES.includes(normalized)
			? normalized
			: Ch5LightBaseClass.NO_SHOW_TYPES[0];
	}

	//#endregion
}

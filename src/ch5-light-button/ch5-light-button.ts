import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { ICh5LightPropertySettings } from "../ch5-light-base/ch5-light-properties";
import { Ch5LightSignal, TCh5LightSignalType } from "../ch5-light-base/ch5-light-signal";

// See ch5-light-button.md (same folder) for the full design reference: class
// hierarchy, signal wiring lifecycle, the static-vs-signal `type`/`selected`
// channel split, and the GC/allocation rules this file follows. Update that
// document alongside any behavior/API change made here.
export class Ch5LightButton extends Ch5LightBaseClass {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-light-button';
	public static readonly PRIMARY_CSS_CLASS = 'ch5-light-button';
	public static readonly TYPES: readonly string[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];
	public static readonly SIGNAL_ATTRIBUTE_TYPE = 'data-signal-type';
	public static readonly SIGNAL_ATTRIBUTE_SELECTED = 'data-signal-selected';

	private static readonly OBSERVED_ATTRIBUTES = [
		'label', 
		'iconclass', 
		'iconurl', 
		'backgroundimageurl',
		'receivestatetype',
		'receivestateselected',
		'receivestateiconclass',
		'receivestateiconurl',
		'receivestatebackgroundimageurl'
	];

	/**
	 * Settings registered on the shared `_ch5Properties` store. Hoisted to a
	 * STATIC field (computed once per class, not once per component instance) -
	 * at 1000+ instances, building this array/object literal in the constructor
	 * would mean 1000 extra allocations for data that never changes. Safe to
	 * share: `Ch5LightProperties.add()` only reads `name`/`default` from each
	 * entry and never retains or mutates the array.
	 */
	private static readonly PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		{ name: 'label', default: '', type: 'string' },
		{ name: 'iconClass', default: '', type: 'string' },
		{ name: 'iconUrl', default: '', type: 'string' },
		{ name: 'backgroundImageUrl', default: '', type: 'string' },
		{ name: 'receiveStateType', default: '', type: 'string' },
		{ name: 'receiveStateSelected', default: '', type: 'string' },
		{ name: 'receiveStateIconClass', default: '', type: 'string' },
		{ name: 'receiveStateIconUrl', default: '', type: 'string' },
		{ name: 'receiveStateBackgroundImageUrl', default: '', type: 'string' }
	];

	//#endregion

	//#region Variables

	private _isInitialized = false;

	private _elContainer: HTMLElement = this;
	private _elButton: HTMLButtonElement | null = null;
	private _elIcon: HTMLElement | null = null;
	private _elSpanLabel: HTMLElement | null = null;

	// Cached onChange callbacks, created ONCE per instance (as class fields).
	// DO NOT replace the `_ch5Properties.set(...)` calls below with an inline
	// `() => this.handleX()` arrow function - an inline arrow allocates a NEW
	// closure on the heap every time the setter runs (even on a no-op set,
	// since JS evaluates the argument before `set()`'s equality check can
	// short-circuit). At 1000+ instances with frequent updates, that's
	// continuous GC churn this "light" component family is designed to avoid.
	private readonly _onLabelChange = () => this.handleLabel();
	private readonly _onIconChange = () => this.handleIcon();
	private readonly _onBackgroundImageChange = () => this.handleBackgroundImageUrl();

	// --- receiveStateType signal wiring --------------------------------------
	// Signals are strictly opt-in: the signal helper below is created LAZILY
	// (only when a `receivestatetype` attribute is actually present), so buttons
	// that do not use signals pay nothing (no helper object, no subscription, no
	// closure). `_signals` is a thin, reusable subscribe/unsubscribe helper (see
	// Ch5LightSignal) - adding another `receiveState*` attribute later is a 2-3
	// line call, not a new set of methods.
	// The signal NAMEs themselves live in the shared `_ch5Properties` store
	// (same as label/icon/backgroundImageUrl), so they get the same equality
	// short-circuit for free. `Ch5LightProperties.set()` hands the OLD name
	// (needed to unsubscribe it) directly to `onChange` as a parameter, so the
	// CACHED `_onReceiveState*Change` callbacks below need no extra field to
	// bridge it - same zero-per-call-allocation pattern as `_onLabelChange`.
	// The signal drives a SEPARATE styling channel (the `data-signal-type`
	// attribute), never the author's static `type` attribute. The theme SCSS gives
	// `[data-signal-type]` priority over `[type]`, so the signal always wins - even
	// if the author changes `type` at runtime - with no JS render/observe step.
	private _signals: Ch5LightSignal | null = null;
	private readonly _onReceiveStateTypeChange = (oldSignalName: string) => this.handleReceiveStateType(oldSignalName);
	private readonly _onReceiveStateSelectedChange = (oldSignalName: string) => this.handleReceiveStateSelected(oldSignalName);
	private readonly _onReceiveStateIconClassChange = (oldSignalName: string) => this.handleReceiveStateIconClass(oldSignalName);
	private readonly _onReceiveStateIconUrlChange = (oldSignalName: string) => this.handleReceiveStateIconUrl(oldSignalName);
	private readonly _onReceiveStateBackgroundImageUrlChange = (oldSignalName: string) => this.handleReceiveStateBackgroundImageUrl(oldSignalName);

	//#endregion

	//#region Getters and Setters

	public set label(value: string) {
		this._ch5Properties.set<string>('label', value, this._onLabelChange);
	}
	public get label(): string {
		return this._ch5Properties.get<string>('label');
	}

	public set iconClass(value: string) {
		this._ch5Properties.set<string>('iconClass', value, this._onIconChange);
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>('iconClass');
	}

	public set iconUrl(value: string) {
		this._ch5Properties.set<string>('iconUrl', value, this._onIconChange);
	}
	public get iconUrl(): string {
		return this._ch5Properties.get<string>('iconUrl');
	}

	public set backgroundImageUrl(value: string) {
		this._ch5Properties.set<string>('backgroundImageUrl', value, this._onBackgroundImageChange);
	}
	public get backgroundImageUrl(): string {
		return this._ch5Properties.get<string>('backgroundImageUrl');
	}

	/**
	 * Name of the string signal that drives the button `type`. When set, the
	 * signal writes the resolved type to the separate `data-signal-type` channel,
	 * which the theme styles with priority over the author's static `type`
	 * attribute; when cleared, `data-signal-type` is removed and the static `type`
	 * styles the button again. Stored in the shared `_ch5Properties` store (same
	 * as label/icon/backgroundImageUrl) for the equality short-circuit.
	 * `_ch5Properties.set()` passes the OLD name straight to the cached
	 * `_onReceiveStateTypeChange` callback, which hands it to
	 * `handleReceiveStateType` for unsubscription - no extra field, no closure
	 * allocated per call.
	 */
	public set receiveStateType(value: string) {
		this._ch5Properties.set<string>('receiveStateType', value ?? '', this._onReceiveStateTypeChange);
	}
	public get receiveStateType(): string {
		return this._ch5Properties.get<string>('receiveStateType');
	}

	/**
	 * Name of the boolean signal that drives the button `selected` state. When
	 * set, the signal writes the resolved state to the separate
	 * `data-signal-selected` channel, which the theme styles with priority over
	 * the author's static `selected` attribute; when cleared, `data-signal-selected`
	 * is removed and the static `selected` styles the button again. Stored in the
	 * shared property store for the same reasons as `receiveStateType`.
	 */
	public set receiveStateSelected(value: string) {
		this._ch5Properties.set<string>('receiveStateSelected', value ?? '', this._onReceiveStateSelectedChange);
	}
	public get receiveStateSelected(): string {
		return this._ch5Properties.get<string>('receiveStateSelected');
	}

	/**
	 * Name of the string signal that drives the button icon class. When a value
	 * arrives it is written straight into the shared `iconClass` slot (see
	 * {@link applySignalIconClass}), so the signal supersedes the author's static
	 * `iconclass`. This relies on the platform contract that, at runtime, only the
	 * signal ever updates the icon class - the static `iconclass` is set once at
	 * design time and never re-written live - so the signal value is always the
	 * last writer and therefore always wins. Stored in the shared `_ch5Properties`
	 * store (same as label/icon) for the equality short-circuit;
	 * `_ch5Properties.set()` passes the OLD name straight to the cached
	 * `_onReceiveStateIconClassChange` callback for unsubscription.
	 */
	public set receiveStateIconClass(value: string) {
		this._ch5Properties.set<string>('receiveStateIconClass', value ?? '', this._onReceiveStateIconClassChange);
	}
	public get receiveStateIconClass(): string {
		return this._ch5Properties.get<string>('receiveStateIconClass');
	}

	/**
	 * Name of the string signal that drives the button icon URL. When a value
	 * arrives it is written straight into the shared `iconUrl` slot (see
	 * {@link applySignalIconUrl}), so the signal supersedes the author's static
	 * `iconurl`. This relies on the platform contract that, at runtime, only the
	 * signal ever updates the icon URL - the static `iconurl` is set once at
	 * design time and never re-written live - so the signal value is always the
	 * last writer and therefore always wins. Stored in the shared `_ch5Properties`
	 * store (same as label/icon) for the equality short-circuit;
	 * `_ch5Properties.set()` passes the OLD name straight to the cached
	 * `_onReceiveStateIconUrlChange` callback for unsubscription.
	 */
	public set receiveStateIconUrl(value: string) {
		this._ch5Properties.set<string>('receiveStateIconUrl', value ?? '', this._onReceiveStateIconUrlChange);
	}
	public get receiveStateIconUrl(): string {
		return this._ch5Properties.get<string>('receiveStateIconUrl');
	}

	/**
	 * Name of the string signal that drives the button background image URL. When a
	 * value arrives it is written straight into the shared `backgroundImageUrl` slot
	 * (see {@link applySignalBackgroundImageUrl}), so the signal supersedes the
	 * author's static `backgroundimageurl`. This relies on the platform contract
	 * that, at runtime, only the signal ever updates the background image URL - the
	 * static `backgroundimageurl` is set once at design time and never re-written
	 * live - so the signal value is always the last writer and therefore always
	 * wins. Stored in the shared `_ch5Properties` store (same as label/icon) for the
	 * equality short-circuit; `_ch5Properties.set()` passes the OLD name straight to
	 * the cached `_onReceiveStateBackgroundImageUrlChange` callback for unsubscription.
	 */
	public set receiveStateBackgroundImageUrl(value: string) {
		this._ch5Properties.set<string>('receiveStateBackgroundImageUrl', value ?? '', this._onReceiveStateBackgroundImageUrlChange);
	}
	public get receiveStateBackgroundImageUrl(): string {
		return this._ch5Properties.get<string>('receiveStateBackgroundImageUrl');
	}

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5LightButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5LightButton.ELEMENT_NAME, Ch5LightButton);
		}
	}

	public static get observedAttributes(): string[] {
		return [
			...Ch5LightBaseClass.LIGHT_BASE_OBSERVED_ATTRIBUTES,
			...Ch5LightButton.OBSERVED_ATTRIBUTES
		];
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		// Register this component's own attributes on the SHARED light property
		// store created by Ch5LightBaseClass (no second store is allocated).
		// Settings array is a shared STATIC field (see PROPERTY_SETTINGS) - no
		// per-instance allocation here.
		this._ch5Properties.add(Ch5LightButton.PROPERTY_SETTINGS);
	}

	public attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		switch (attr) {
			case 'label':
				this.label = newValue ?? '';
				break;
			case 'iconclass':
				this.iconClass = newValue ?? '';
				break;
			case 'iconurl':
				this.iconUrl = newValue ?? '';
				break;
			case 'backgroundimageurl':
				this.backgroundImageUrl = newValue ?? '';
				break;
			case 'receivestatetype':
				this.receiveStateType = newValue ?? '';
				break;
			case 'receivestateselected':
				this.receiveStateSelected = newValue ?? '';
				break;
			case 'receivestateiconclass':
				this.receiveStateIconClass = newValue ?? '';
				break;
			case 'receivestateiconurl':
				this.receiveStateIconUrl = newValue ?? '';
				break;
			case 'receivestatebackgroundimageurl':
				this.receiveStateBackgroundImageUrl = newValue ?? '';
				break;
			default:
				// Delegate base attributes (show / disabled) to Ch5LightBaseClass.
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
	}

	/**
	 * Called when the Ch5LightButton component is first connected to the DOM
	 */
	public connectedCallback() {
		if (!this._isInitialized) {
			this.createInternalHtml();
			this.handleIcon();
			this.handleLabel();
			this.handleBackgroundImageUrl();
			this._isInitialized = true;
		}

		// Keep the internal subtree across disconnect/reconnect cycles and only
		// reattach when needed.
		if (this._elButton && this._elButton.parentNode !== this) {
			this._elContainer.appendChild(this._elButton);
		}

		// Apply the base attributes (show / disabled) last, once the button exists
		// so the overridden disabled handler can reach it. Cheap + idempotent on reconnect.
		super.connectedCallback();

		// (Re)subscribe to the type signal if one was set. No-op unless a
		// `receivestatetype` attribute is in use, so signal-free buttons are
		// unaffected. Safe on reconnect: disconnectedCallback tore the previous
		// subscription down while preserving the signal name.
		this.subscribeReceiveStateType();
		this.subscribeReceiveStateSelected();
		this.subscribeReceiveStateIconClass();
		this.subscribeReceiveStateIconUrl();
		this.subscribeReceiveStateBackgroundImageUrl();
	}

	public disconnectedCallback() {
		// Release the signal subscriptions (if any) so a detached button does not
		// keep active listeners. The signal names are kept so connectedCallback can
		// re-subscribe transparently.
		this.clearSignalSubscription(this.receiveStateType);
		this.clearSignalSubscription(this.receiveStateSelected);
		this.clearSignalSubscription(this.receiveStateIconClass);
		this.clearSignalSubscription(this.receiveStateIconUrl);
		this.clearSignalSubscription(this.receiveStateBackgroundImageUrl);
	}

	//#endregion

	//#region Private Methods

	private createInternalHtml() {
		this.clearComponentContent();

		// clearComponentContent() removed all previously created children, so the
		// cached label/icon references now point at detached elements. Reset them
		// to force handleLabel()/handleIconClass() to recreate them inside the new
		// button on every (re)connect, otherwise the label/icon go missing when the
		// component is disconnected and connected again.
		this._elSpanLabel = null;
		this._elIcon = null;

		this._elContainer = this;
		this._elContainer.classList.add(Ch5LightButton.PRIMARY_CSS_CLASS);

		// Create the button OFF-DOM. The icon/label are added to it (via the
		// handlers) while it is still detached, and the whole subtree is appended
		// to the host once in connectedCallback.
		this._elButton = document.createElement('button');
		this._elButton.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--btn`;
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		// Use a single native operation instead of repeated removeChild calls.
		this.replaceChildren();
	}

	private handleLabel() {
		if (!this._elButton) {
			return;
		}
		const label = this.label;
		if (label) {
			// Create the label element lazily the first time a label is set
			if (!this._elSpanLabel) {
				this._elSpanLabel = document.createElement('span');
				this._elSpanLabel.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--label`;
				this._elButton.appendChild(this._elSpanLabel);
			}
			this._elSpanLabel.textContent = label;
		} else if (this._elSpanLabel) {
			// Remove the label element when the label is cleared
			this._elSpanLabel.remove();
			this._elSpanLabel = null;
		}
	}

	private handleIcon() {
		if (!this._elButton) {
			return;
		}
		const iconUrl = this.iconUrl;
		// The `receivestateiconclass` signal (when active) writes its value straight
		// into `iconClass` (see applySignalIconClass), so reading `iconClass` here
		// already yields the signal value when a signal is driving it. The existing
		// iconUrl-over-iconClass priority is unchanged: an iconUrl still wins.
		const iconClass = this.iconClass;
		if (iconUrl || iconClass) {
			// Create the icon element lazily the first time an icon is set.
			// DOM order does not matter: the icon position is controlled by the CSS
			// `order` property (see _light-button-icon-position.scss).
			if (!this._elIcon) {
				this._elIcon = document.createElement('i');
				this._elButton.appendChild(this._elIcon);
			}
			if (iconUrl) {
				// iconUrl takes the highest priority over iconClass. Render the icon
				// as a background image using the --img modifier class. The --img and
				// --icon classes are mutually exclusive (same as ch5-button).
				this._elIcon.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--img`;
				this._elIcon.style.backgroundImage = `url("${iconUrl}")`;
			} else {
				// Fall back to the icon font class when no iconUrl is provided.
				this._elIcon.className = `${Ch5LightButton.PRIMARY_CSS_CLASS}--icon ${iconClass}`;
				this._elIcon.style.backgroundImage = '';
			}
		} else if (this._elIcon) {
			// Remove the icon element when both the icon class and url are cleared
			this._elIcon.remove();
			this._elIcon = null;
		}
	}

	private handleBackgroundImageUrl() {
		if (!this._elButton) {
			return;
		}
		// Set the background image directly on the button element (same approach as
		// ch5-button). A URL from an attribute cannot be injected via pure CSS, so
		// this is handled in JS; the value is applied as an inline background-image.
		const backgroundImageUrl = this.backgroundImageUrl;
		if (backgroundImageUrl) {
			this._elButton.style.backgroundImage = `url("${backgroundImageUrl}")`;
		} else {
			this._elButton.style.backgroundImage = '';
		}
	}

	// --- Shared signal plumbing ----------------------------------------------
	// The three helpers below hold the ONLY subscribe / unsubscribe / channel
	// teardown logic; each receiveState* attribute is a thin wrapper that supplies
	// its signal name, value type and value handler. None of these run on the hot
	// path - a signal VALUE change routes straight to an applySignal* method - so
	// sharing them has no performance cost (they fire only on connect / disconnect
	// / attribute change).

	/**
	 * Lazily creates the shared signal helper (only for buttons that actually use
	 * a signal) and subscribes `onValue` to `signalName`. Idempotent: no-op when
	 * the name is empty or already subscribed.
	 */
	private subscribeSignal<T extends string | number | boolean>(
		signalName: string,
		signalType: TCh5LightSignalType,
		onValue: (value: T) => void
	): void {
		if (!signalName || (this._signals !== null && this._signals.isSubscribedTo(signalName))) {
			return;
		}
		(this._signals ??= new Ch5LightSignal()).subscribe<T>(signalName, signalType, onValue);
	}

	/**
	 * Releases the subscription for a single signal name, leaving any coexisting
	 * receiveState* subscription (and the stored name) intact so a reconnect can
	 * re-subscribe. No-op when nothing was ever subscribed.
	 */
	private clearSignalSubscription(signalName: string): void {
		if (this._signals !== null) {
			this._signals.unsubscribe(signalName);
		}
	}

	/**
	 * Removes a `data-signal-*` styling channel so the matching author attribute
	 * regains control. Called when a receiveState* attribute is removed.
	 */
	private clearSignalChannel(attribute: string): void {
		if (this.hasAttribute(attribute)) {
			this.removeAttribute(attribute);
		}
	}

	/**
	 * Central handler for a change to the `receivestatetype` signal NAME. `oldSignalName`
	 * is the name that was in effect before this change (captured by the setter,
	 * since `_ch5Properties` already holds the NEW name by the time this runs).
	 * Tears down the previous subscription and either subscribes (when connected)
	 * or, when the signal is removed, drops the `data-signal-type` styling channel
	 * so the author's static `type` attribute styles the button again.
	 */
	private handleReceiveStateType(oldSignalName: string): void {
		this.clearSignalSubscription(oldSignalName);

		const signalName = this.receiveStateType;
		if (signalName) {
			if (this.isConnected) {
				this.subscribeReceiveStateType();
			}
		} else {
			// Leaving signal-driven mode: the static `type` regains priority.
			this.clearSignalChannel(Ch5LightButton.SIGNAL_ATTRIBUTE_TYPE);
		}
	}

	/** Subscribes the `receivestatetype` string signal to {@link applySignalType}. */
	private subscribeReceiveStateType(): void {
		this.subscribeSignal<string>(
			this.receiveStateType,
			'string',
			(newValue) => this.applySignalType(newValue)
		);
	}

	/**
	 * Applies a signal-delivered type to the SEPARATE `data-signal-type` channel
	 * (never the author's `type` attribute). The theme SCSS styles
	 * `[data-signal-type]` with priority over `[type]`, so writing this attribute
	 * is all that is needed - no extra JS styling and no render step. An unknown
	 * value falls back to `default` (mirrors ch5-button). Because the author's
	 * `type` is untouched, the signal keeps priority even if `type` changes at
	 * runtime.
	 */
	private applySignalType(value: string): void {
		const type = Ch5LightButton.TYPES.indexOf(value) >= 0 ? value : Ch5LightButton.TYPES[0];
		this.setAttribute(Ch5LightButton.SIGNAL_ATTRIBUTE_TYPE, type);
	}

	/**
	 * Central handler for a change to the `receivestateselected` signal NAME.
	 * `oldSignalName` is the name that was in effect before this change (captured
	 * by the setter, for the same reason as `handleReceiveStateType`). Tears down
	 * the previous subscription and either subscribes (when connected) or, when
	 * the signal is removed, drops the `data-signal-selected` styling channel so
	 * the author's static `selected` attribute styles the button again.
	 */
	private handleReceiveStateSelected(oldSignalName: string): void {
		this.clearSignalSubscription(oldSignalName);

		const signalName = this.receiveStateSelected;
		if (signalName) {
			if (this.isConnected) {
				this.subscribeReceiveStateSelected();
			}
		} else {
			// Leaving signal-driven mode: the static `selected` regains priority.
			this.clearSignalChannel(Ch5LightButton.SIGNAL_ATTRIBUTE_SELECTED);
		}
	}

	/** Subscribes the `receivestateselected` boolean signal to {@link applySignalSelected}. */
	private subscribeReceiveStateSelected(): void {
		this.subscribeSignal<boolean>(
			this.receiveStateSelected,
			'boolean',
			(newValue) => this.applySignalSelected(newValue)
		);
	}

	/**
	 * Applies a signal-delivered selected state to the SEPARATE
	 * `data-signal-selected` channel (never the author's `selected` attribute).
	 * The theme SCSS guards every static `[selected]` selector with
	 * `:not([data-signal-selected])` and adds a parallel `[data-signal-selected="true"]`
	 * channel, so writing this attribute is all that is needed - no extra JS
	 * styling and no render step. `"false"` keeps the attribute present so the
	 * static `selected` stays suppressed (the signal forces "not selected"), while
	 * `"true"` applies the selected look. Because the author's `selected` is
	 * untouched, the signal keeps priority even if `selected` changes at runtime.
	 */
	private applySignalSelected(value: boolean): void {
		this.setAttribute(Ch5LightButton.SIGNAL_ATTRIBUTE_SELECTED, value ? 'true' : 'false');
	}

	/**
	 * Central handler for a change to the `receivestateiconclass` signal NAME.
	 * `oldSignalName` is the name in effect before this change (captured by the
	 * setter, same rationale as handleReceiveStateType). Tears down the previous
	 * subscription and, when a signal is set and the button is connected,
	 * (re)subscribes. Removing the signal is a design-time change (a fresh instance
	 * renders the static `iconclass`), so there is no runtime override to unwind
	 * here - the last signal value simply remains in the `iconClass` slot.
	 */
	private handleReceiveStateIconClass(oldSignalName: string): void {
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateIconClass && this.isConnected) {
			this.subscribeReceiveStateIconClass();
		}
	}

	/** Subscribes the `receivestateiconclass` string signal to {@link applySignalIconClass}. */
	private subscribeReceiveStateIconClass(): void {
		this.subscribeSignal<string>(
			this.receiveStateIconClass,
			'string',
			(newValue) => this.applySignalIconClass(newValue)
		);
	}

	/**
	 * Applies a signal-delivered icon class. Unlike `type` / `selected` (pure-CSS,
	 * driven through a separate `data-signal-*` attribute channel), the icon class
	 * is rendered in JS by {@link handleIcon}, so the signal writes its value
	 * straight into the shared `iconClass` slot (same approach as ch5-animation's
	 * `startAnimating`). Because the platform only updates the icon class through
	 * the signal at runtime (the static `iconclass` is design-time only), the
	 * signal is always the last writer and therefore always wins. Setting
	 * `iconClass` runs the cached `_onIconChange` callback, which re-renders the
	 * icon; the store's equality short-circuit skips redundant re-renders.
	 */
	private applySignalIconClass(value: string): void {
		this.iconClass = value ?? '';
	}

	/**
	 * Central handler for a change to the `receivestateiconurl` signal NAME.
	 * `oldSignalName` is the name in effect before this change (captured by the
	 * setter, same rationale as handleReceiveStateType). Tears down the previous
	 * subscription and, when a signal is set and the button is connected,
	 * (re)subscribes. Removing the signal is a design-time change (a fresh instance
	 * renders the static `iconurl`), so there is no runtime override to unwind
	 * here - the last signal value simply remains in the `iconUrl` slot.
	 */
	private handleReceiveStateIconUrl(oldSignalName: string): void {
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateIconUrl && this.isConnected) {
			this.subscribeReceiveStateIconUrl();
		}
	}

	/** Subscribes the `receivestateiconurl` string signal to {@link applySignalIconUrl}. */
	private subscribeReceiveStateIconUrl(): void {
		this.subscribeSignal<string>(
			this.receiveStateIconUrl,
			'string',
			(newValue) => this.applySignalIconUrl(newValue)
		);
	}

	/**
	 * Applies a signal-delivered icon URL. Like {@link applySignalIconClass}, the
	 * icon URL is rendered in JS by {@link handleIcon}, so the signal writes its
	 * value straight into the shared `iconUrl` slot (same approach as
	 * ch5-animation's `startAnimating`). Because the platform only updates the icon
	 * URL through the signal at runtime (the static `iconurl` is design-time only),
	 * the signal is always the last writer and therefore always wins. Setting
	 * `iconUrl` runs the cached `_onIconChange` callback, which re-renders the icon;
	 * the store's equality short-circuit skips redundant re-renders.
	 */
	private applySignalIconUrl(value: string): void {
		this.iconUrl = value ?? '';
	}

	/**
	 * Central handler for a change to the `receivestatebackgroundimageurl` signal
	 * NAME. `oldSignalName` is the name in effect before this change (captured by the
	 * setter, same rationale as handleReceiveStateType). Tears down the previous
	 * subscription and, when a signal is set and the button is connected,
	 * (re)subscribes. Removing the signal is a design-time change (a fresh instance
	 * renders the static `backgroundimageurl`), so there is no runtime override to
	 * unwind here - the last signal value simply remains in the `backgroundImageUrl`
	 * slot.
	 */
	private handleReceiveStateBackgroundImageUrl(oldSignalName: string): void {
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateBackgroundImageUrl && this.isConnected) {
			this.subscribeReceiveStateBackgroundImageUrl();
		}
	}

	/** Subscribes the `receivestatebackgroundimageurl` string signal to {@link applySignalBackgroundImageUrl}. */
	private subscribeReceiveStateBackgroundImageUrl(): void {
		this.subscribeSignal<string>(
			this.receiveStateBackgroundImageUrl,
			'string',
			(newValue) => this.applySignalBackgroundImageUrl(newValue)
		);
	}

	/**
	 * Applies a signal-delivered background image URL. Like {@link applySignalIconUrl},
	 * the background image is rendered in JS by {@link handleBackgroundImageUrl}, so
	 * the signal writes its value straight into the shared `backgroundImageUrl` slot
	 * (same approach as ch5-animation's `startAnimating`). Because the platform only
	 * updates the background image URL through the signal at runtime (the static
	 * `backgroundimageurl` is design-time only), the signal is always the last writer
	 * and therefore always wins. Setting `backgroundImageUrl` runs the cached
	 * `_onBackgroundImageChange` callback, which re-renders the background; the
	 * store's equality short-circuit skips redundant re-renders.
	 *
	 * The background-image fill-type CSS is scoped to the host attribute selector
	 * `ch5-light-button[backgroundimageurl]` (for perf: buttons with no background
	 * are never matched). With a static author value that attribute is already on
	 * the host, but when the URL is signal-driven the author only sets
	 * `receivestatebackgroundimageurl`, so the host would carry no `backgroundimageurl`
	 * attribute and the fill-type rules would never match. Reflect the attribute here
	 * so `backgroundimagefilltype` works identically for static and signal values.
	 * Re-entering `attributeChangedCallback` -> the setter is harmless: the store's
	 * equality short-circuit stops any re-render loop.
	 */
	private applySignalBackgroundImageUrl(value: string): void {
		const url = value ?? '';
		if (url) {
			this.setAttribute('backgroundimageurl', url);
		} else {
			this.removeAttribute('backgroundimageurl');
		}
		this.backgroundImageUrl = url;
	}

	//#endregion
}

Ch5LightButton.registerCustomElement();
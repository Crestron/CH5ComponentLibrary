import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { Ch5LightSignal } from "../ch5-light-base/ch5-light-signal";

export class Ch5LightButton extends Ch5LightBaseClass {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-light-button';

	public static readonly PRIMARY_CSS_CLASS = 'ch5-light-button';

	/**
	 * Valid `type` values (same set + order as `ch5-button`, default first). A
	 * value delivered by the `receivestatetype` signal is validated against this
	 * list; anything unrecognised falls back to `default`.
	 */
	public static readonly TYPES: readonly string[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	/**
	 * Host attribute the `receivestatetype` signal writes its resolved type to.
	 * This is a SEPARATE channel from the author's `type` attribute; the theme
	 * SCSS (`_light-button-type.scss`) styles `[data-signal-type]` with priority
	 * over `[type]` (every static `[type]` selector is guarded with
	 * `:not([data-signal-type])`). Keep this string in sync with that SCSS.
	 */
	public static readonly SIGNAL_TYPE_ATTRIBUTE = 'data-signal-type';

	private static readonly OBSERVED_ATTRIBUTES = [
		'label', 
		'iconclass', 
		'iconurl', 
		'backgroundimageurl',
		'receivestatetype'
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
	// Signals are strictly opt-in: the fields below stay empty and the shared
	// signal helper is created LAZILY (only when a `receivestatetype` attribute is
	// actually present), so buttons that do not use signals pay nothing (no helper
	// object, no subscription, no closure). `_signals` is a thin, reusable
	// subscribe/unsubscribe helper (see Ch5LightSignal) - adding another
	// `receiveState*` attribute later is a 2-3 line call, not a new set of methods.
	// The signal drives a SEPARATE styling channel (the `data-signal-type`
	// attribute), never the author's static `type` attribute. The theme SCSS gives
	// `[data-signal-type]` priority over `[type]`, so the signal always wins - even
	// if the author changes `type` at runtime - with no JS render/observe step.
	private _signals: Ch5LightSignal | null = null;
	private _sigNameReceiveStateType = '';

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
	 * styles the button again. Not stored in the property store on purpose - it
	 * needs bespoke subscribe/unsubscribe logic, and keeping it as plain fields
	 * avoids touching the shared store for a rarely-used attribute.
	 */
	public set receiveStateType(value: string) {
		const newValue = value ?? '';
		if (newValue === this._sigNameReceiveStateType) {
			return;
		}
		this.handleReceiveStateType(newValue);
	}
	public get receiveStateType(): string {
		return this._sigNameReceiveStateType;
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
		this._ch5Properties.add([
			{ name: 'label', default: '', type: 'string' },
			{ name: 'iconClass', default: '', type: 'string' },
			{ name: 'iconUrl', default: '', type: 'string' },
			{ name: 'backgroundImageUrl', default: '', type: 'string' }
		]);
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
			// No attribute re-read here: attributeChangedCallback (per the Custom
			// Elements v1 upgrade order) already fires for every pre-existing
			// observed attribute before connectedCallback, so the property store
			// already holds the correct values. These calls just build the DOM
			// from whatever is currently in the store.
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
		// so the overridden disabled handler can reach it. Cheap + idempotent on
		// reconnect.
		super.connectedCallback();

		// (Re)subscribe to the type signal if one was set. No-op unless a
		// `receivestatetype` attribute is in use, so signal-free buttons are
		// unaffected. Safe on reconnect: disconnectedCallback tore the previous
		// subscription down while preserving the signal name.
		this.subscribeReceiveStateType();
	}

	public disconnectedCallback() {
		// Release the type signal subscription (if any) so a detached button does
		// not keep an active listener. The signal name is kept so connectedCallback
		// can re-subscribe transparently.
		this.clearReceiveStateTypeSubscription();
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
		// Button is only available after createInternalHtml() has run
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
		// Button is only available after createInternalHtml() has run
		if (!this._elButton) {
			return;
		}
		const iconUrl = this.iconUrl;
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
		// Button is only available after createInternalHtml() has run
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

	/**
	 * Central handler for a change to the `receivestatetype` signal NAME. Tears
	 * down any previous subscription and either subscribes (when connected) or,
	 * when the signal is removed, drops the `data-signal-type` styling channel so
	 * the author's static `type` attribute styles the button again.
	 */
	private handleReceiveStateType(signalName: string): void {
		this.clearReceiveStateTypeSubscription();
		this._sigNameReceiveStateType = signalName;

		if (signalName) {
			if (this.isConnected) {
				this.subscribeReceiveStateType();
			}
		} else {
			// Leaving signal-driven mode: the static `type` regains priority.
			this.clearSignalType();
		}
	}

	/**
	 * Subscribes to the configured type signal via the shared {@link Ch5LightSignal}
	 * helper. The signal helper is created lazily here (only when a signal is
	 * actually in use) and the subscription callback is allocated at subscribe
	 * time - so signal-free buttons never create the helper or the closure.
	 * Idempotent: does nothing if there is no signal name or a live subscription.
	 */
	private subscribeReceiveStateType(): void {
		if (!this._sigNameReceiveStateType || (this._signals !== null && this._signals.hasSubscriptions)) {
			return;
		}
		(this._signals ??= new Ch5LightSignal()).subscribe<string>(
			this._sigNameReceiveStateType,
			'string',
			(newValue: string) => this.applySignalType(newValue)
		);
	}

	/**
	 * Unsubscribes from the type signal (if subscribed). Keeps `_sigNameReceiveStateType`
	 * intact so a reconnect can transparently re-subscribe.
	 */
	private clearReceiveStateTypeSubscription(): void {
		if (this._signals !== null) {
			this._signals.unsubscribeAll();
		}
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
		this.setAttribute(Ch5LightButton.SIGNAL_TYPE_ATTRIBUTE, type);
	}

	/**
	 * Removes the `data-signal-type` styling channel so the author's static `type`
	 * attribute styles the button again. Called when the `receivestatetype`
	 * attribute is removed.
	 */
	private clearSignalType(): void {
		if (this.hasAttribute(Ch5LightButton.SIGNAL_TYPE_ATTRIBUTE)) {
			this.removeAttribute(Ch5LightButton.SIGNAL_TYPE_ATTRIBUTE);
		}
	}

	//#endregion
}

Ch5LightButton.registerCustomElement();
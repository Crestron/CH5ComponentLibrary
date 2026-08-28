import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { ICh5LightPropertySettings } from "../ch5-light-base/ch5-light-properties";
import { Ch5LightSignal, TCh5LightSignalType } from "../ch5-light-base/ch5-light-signal";
import { Ch5LightPressable } from "../ch5-light-base/ch5-light-pressable";
import { ICh5ButtonListContractObj } from "../ch5-button-list/interfaces/t-for-ch5-button-list-contract";

// See ch5-button.md (same folder) for the full design reference: class
// hierarchy, signal wiring lifecycle, the static-vs-signal `type`/`selected`
// channel split, and the GC/allocation rules this file follows. Update that
// document alongside any behavior/API change made here.
export class Ch5Button extends Ch5LightBaseClass {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-button';
	public static readonly PRIMARY_CSS_CLASS = 'ch5-button';
	public static readonly TYPES: readonly string[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];
	public static readonly SIGNAL_ATTRIBUTE_TYPE = 'data-signal-type';
	public static readonly SIGNAL_ATTRIBUTE_SELECTED = 'data-signal-selected';

	private static readonly OBSERVED_ATTRIBUTES = [
		'label', 
		'labelinnerhtml', 
		'iconclass', 
		'iconurl', 
		'backgroundimageurl',
		'receivestatetype',
		'receivestateselected',
		'receivestatelabel',
		'receivestatescriptlabelhtml',
		'receivestateiconclass',
		'receivestateiconurl',
		'receivestatebackgroundimageurl',
		'sendeventonclick',
		'multilinesupport',
		'truncatetext'
	];

	/**
	 * Property settings for the shared `_ch5Properties` store. STATIC so the array
	 * is built once per class, not per instance (avoids N allocations at scale).
	 * Safe to share: `add()` only reads each entry, never retains it.
	 */
	private static readonly PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		{ name: 'label', default: '', type: 'string' },
		{ name: 'labelInnerHTML', default: '', type: 'string' },
		{ name: 'iconClass', default: '', type: 'string' },
		{ name: 'iconUrl', default: '', type: 'string' },
		{ name: 'backgroundImageUrl', default: '', type: 'string' },
		{ name: 'receiveStateType', default: '', type: 'string', contractName: true },
		{ name: 'receiveStateSelected', default: '', type: 'string', contractName: true },
		{ name: 'receiveStateLabel', default: '', type: 'string', contractName: true },
		{ name: 'receiveStateScriptLabelHtml', default: '', type: 'string', contractName: true },
		{ name: 'scriptLabelHtml', default: '', type: 'string' },
		{ name: 'receiveStateIconClass', default: '', type: 'string', contractName: true },
		{ name: 'receiveStateIconUrl', default: '', type: 'string', contractName: true },
		{ name: 'receiveStateBackgroundImageUrl', default: '', type: 'string', contractName: true },
		{ name: 'sendEventOnClick', default: '', type: 'string', contractName: true },
		{ name: 'multilineSupport', default: false, type: 'boolean' },
		{ name: 'truncateText', default: true, type: 'boolean' }
	];

	//#endregion

	//#region Variables

	private _isInitialized = false;

	private _elContainer: HTMLElement = this;
	private _elButton: HTMLButtonElement | null = null;
	private _elIcon: HTMLElement | null = null;
	private _elSpanLabel: HTMLElement | null = null;

	// Cached onChange callbacks, allocated ONCE per instance. Do NOT inline these
	// as `() => this.handleX()` at the `set()` call sites: an inline arrow would
	// allocate a new closure on every setter call (even no-op sets), causing the GC
	// churn this "light" family avoids.
	private readonly _onLabelChange = () => this.handleLabel();
	private readonly _onIconChange = () => this.handleIcon();
	private readonly _onBackgroundImageChange = () => this.handleBackgroundImageUrl();
	// Shared by both multilineSupport and truncateText - they drive the same
	// label wrapping/clamp update, so one cached callback covers both setters.
	private readonly _onLabelWrapChange = () => this.updateLabelTextWrapping();

	// Coalesces multi-line clamp measurements into a SINGLE rAF read, so a same-tick
	// height change settles before the height is measured (no ResizeObserver in the
	// light family). Only scheduled while multilineSupport is on, so single-line
	// buttons allocate nothing.
	private _pendingFitHandle: number | null = null;
	private readonly _fitEllipsisFrame = () => {
		this._pendingFitHandle = null;
		// multilineSupport may have been turned off since scheduling.
		if (this.multilineSupport) {
			this.fitEllipsisForMultiline();
		}
	};

	// --- receiveState* signal wiring -----------------------------------------
	// Opt-in: `_signals` is created LAZILY on first use, so signal-free buttons pay
	// nothing. `_onReceiveState*Change`/`_onSignal*Value` are cached (subscribing
	// runs on every reconnect). type/selected write a SEPARATE `data-signal-*`
	// channel that the theme styles over the static `type`/`selected` (no JS render).
	private _signals: Ch5LightSignal | null = null;
	private readonly _onReceiveStateTypeChange = (oldSignalName: string) => this.handleReceiveStateType(oldSignalName);
	private readonly _onReceiveStateSelectedChange = (oldSignalName: string) => this.handleReceiveStateSelected(oldSignalName);
	private readonly _onReceiveStateLabelChange = (oldSignalName: string) => this.handleReceiveStateLabel(oldSignalName);
	private readonly _onReceiveStateScriptLabelHtmlChange = (oldSignalName: string) => this.handleReceiveStateScriptLabelHtml(oldSignalName);
	private readonly _onReceiveStateIconClassChange = (oldSignalName: string) => this.handleReceiveStateIconClass(oldSignalName);
	private readonly _onReceiveStateIconUrlChange = (oldSignalName: string) => this.handleReceiveStateIconUrl(oldSignalName);
	private readonly _onReceiveStateBackgroundImageUrlChange = (oldSignalName: string) => this.handleReceiveStateBackgroundImageUrl(oldSignalName);
	private readonly _onSignalTypeValue = (value: string) => this.applySignalType(value);
	private readonly _onSignalSelectedValue = (value: boolean) => this.applySignalSelected(value);
	private readonly _onSignalLabelValue = (value: string) => this.applySignalLabel(value);
	private readonly _onSignalScriptLabelHtmlValue = (value: string) => this.applySignalScriptLabelHtml(value);
	private readonly _onSignalIconClassValue = (value: string) => this.applySignalIconClass(value);
	private readonly _onSignalIconUrlValue = (value: string) => this.applySignalIconUrl(value);
	private readonly _onSignalBackgroundImageUrlValue = (value: string) => this.applySignalBackgroundImageUrl(value);

	// --- sendEventOnClick + repeat-digital -----------------------------------
	// Opt-in: driven by the pressable's onChange (`_onPressedChange`). Press sends
	// `true` and retriggers it every REPEAT_DIGITAL_PERIOD ms while held (like
	// ch5-button); release sends the final `false`. Zero cost when unset.
	private static readonly REPEAT_DIGITAL_PERIOD = 200;
	private _repeatDigitalInterval: number | null = null;
	private readonly _onSendEventOnClickChange = () => this.handleSendEventOnClick();
	
	private readonly _onFocus = (event: FocusEvent) => this.handleFocus(event);
	private readonly _onBlur = (event: FocusEvent) => this.handleBlur(event);
	private _focusListenersWired = false;

	// --- press / release (pressable) -----------------------------------------
	// Always-on press/release via the shared Ch5LightPressable (dependency-free
	// counterpart of Ch5Pressable). Drives the `pressed` state (host attribute, CSS)
	// + bubbling `press`/`release` events; its onChange (`_onPressedChange`) also
	// drives the click send signal. Created lazily and reused across reconnects.
	private readonly _onPressedChange = (pressed: boolean) => this.handlePressedChange(pressed);
	private _pressable: Ch5LightPressable | null = null;

	// --- ch5-button-list contract press wiring -------------------------------
	// Opt-in: populated only when a button-list constructs this button with a contract
	// object. When its contractName is set, presses publish the list's contract signals
	// (Button{n}ItemPress / ListItemClicked / ListItemHeld) instead of sendEventOnClick.
	private _buttonListContract: ICh5ButtonListContractObj = { index: -1, clickHoldTime: 0, contractName: '', parentComponent: '' };
	private _buttonListContractIsHeld = false;
	private _buttonListContractHoldInterval: number | null = null;

	//#endregion

	//#region Getters and Setters

	public set label(value: string) {
		this._ch5Properties.set<string>('label', value, this._onLabelChange);
	}
	public get label(): string {
		return this._ch5Properties.get<string>('label');
	}

	/**
	 * Raw HTML rendered inside the label span. Takes priority over the plain-text
	 * `label` (mirrors ch5-advance-button / ch5-text), EXCEPT while a
	 * `receiveStateLabel` signal is driving the label - the signal write-throughs
	 * into the `label` slot and must win. Rendered lazily (only when set), so
	 * label-free / text-only buttons pay nothing.
	 */
	public set labelInnerHTML(value: string) {
		this._ch5Properties.set<string>('labelInnerHTML', value ?? '', this._onLabelChange);
	}
	public get labelInnerHTML(): string {
		return this._ch5Properties.get<string>('labelInnerHTML');
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
	 * Enables multi-line label text: the label wraps and is clamped to the lines
	 * that fit the button's height (never resizes it). Default false. Measured only
	 * when true, so single-line buttons pay nothing.
	 */
	public set multilineSupport(value: boolean) {
		this._ch5Properties.set<boolean>('multilineSupport', value, this._onLabelWrapChange);
	}
	public get multilineSupport(): boolean {
		return this._ch5Properties.get<boolean>('multilineSupport');
	}

	/**
	 * Truncates overflowing label text with an ellipsis. Default true (on the last
	 * visible line when `multilineSupport` is on); when false the text is clipped
	 * without an ellipsis.
	 */
	public set truncateText(value: boolean) {
		this._ch5Properties.set<boolean>('truncateText', value, this._onLabelWrapChange);
	}
	public get truncateText(): boolean {
		return this._ch5Properties.get<boolean>('truncateText');
	}

	/**
	 * Name of the string signal driving the button `type`. Writes to the separate
	 * `data-signal-type` channel (styled over the static `type`); clearing restores
	 * the static `type`.
	 */
	public set receiveStateType(value: string) {
		this._ch5Properties.set<string>('receiveStateType', value ?? '', this._onReceiveStateTypeChange);
	}
	public get receiveStateType(): string {
		return this._ch5Properties.get<string>('receiveStateType');
	}

	/**
	 * Name of the boolean signal driving the button `selected` state. Writes to the
	 * separate `data-signal-selected` channel (styled over the static `selected`);
	 * clearing restores the static `selected`.
	 */
	public set receiveStateSelected(value: string) {
		this._ch5Properties.set<string>('receiveStateSelected', value ?? '', this._onReceiveStateSelectedChange);
	}
	public get receiveStateSelected(): string {
		return this._ch5Properties.get<string>('receiveStateSelected');
	}

	/**
	 * Name of the string signal driving the button label. Its value is written into
	 * the shared `label` slot (see {@link applySignalLabel}), so the signal always
	 * supersedes the static (design-time) `label`.
	 */
	public set receiveStateLabel(value: string) {
		this._ch5Properties.set<string>('receiveStateLabel', value ?? '', this._onReceiveStateLabelChange);
	}
	public get receiveStateLabel(): string {
		return this._ch5Properties.get<string>('receiveStateLabel');
	}

	/**
	 * Name of the string signal driving the button label as HTML. Its value is written
	 * into the shared `scriptLabelHtml` slot (see {@link applySignalScriptLabelHtml})
	 * and rendered via `innerHTML`. Ranks HIGHEST of the label sources
	 * (receivestatescriptlabelhtml > receivestatelabel > labelinnerhtml > label).
	 */
	public set receiveStateScriptLabelHtml(value: string) {
		this._ch5Properties.set<string>('receiveStateScriptLabelHtml', value ?? '', this._onReceiveStateScriptLabelHtmlChange);
	}
	public get receiveStateScriptLabelHtml(): string {
		return this._ch5Properties.get<string>('receiveStateScriptLabelHtml');
	}

	/**
	 * Runtime slot holding the HTML delivered by the `receivestatescriptlabelhtml`
	 * signal (rendered by {@link handleLabel} via `innerHTML`). Not an author attribute -
	 * written only by the signal; shares the `_onLabelChange` render callback.
	 */
	public set scriptLabelHtml(value: string) {
		this._ch5Properties.set<string>('scriptLabelHtml', value ?? '', this._onLabelChange);
	}
	public get scriptLabelHtml(): string {
		return this._ch5Properties.get<string>('scriptLabelHtml');
	}

	/**
	 * Name of the string signal driving the button icon class. Its value is written
	 * into the shared `iconClass` slot (see {@link applySignalIconClass}). Icon
	 * priority is resolved in {@link handleIcon} (receivestateiconurl >
	 * receivestateiconclass > iconurl > iconclass), so its presence outranks a
	 * static iconurl.
	 */
	public set receiveStateIconClass(value: string) {
		this._ch5Properties.set<string>('receiveStateIconClass', value ?? '', this._onReceiveStateIconClassChange);
	}
	public get receiveStateIconClass(): string {
		return this._ch5Properties.get<string>('receiveStateIconClass');
	}

	/**
	 * Name of the string signal driving the button icon URL. Its value is written
	 * into the shared `iconUrl` slot (see {@link applySignalIconUrl}). Ranks HIGHEST
	 * among the icon sources (resolved in {@link handleIcon}: receivestateiconurl >
	 * receivestateiconclass > iconurl > iconclass).
	 */
	public set receiveStateIconUrl(value: string) {
		this._ch5Properties.set<string>('receiveStateIconUrl', value ?? '', this._onReceiveStateIconUrlChange);
	}
	public get receiveStateIconUrl(): string {
		return this._ch5Properties.get<string>('receiveStateIconUrl');
	}

	/**
	 * Name of the string signal driving the button background image URL. Its value
	 * is written into the shared `backgroundImageUrl` slot (see
	 * {@link applySignalBackgroundImageUrl}), so the signal always supersedes the
	 * static (design-time) `backgroundimageurl`.
	 */
	public set receiveStateBackgroundImageUrl(value: string) {
		this._ch5Properties.set<string>('receiveStateBackgroundImageUrl', value ?? '', this._onReceiveStateBackgroundImageUrlChange);
	}
	public get receiveStateBackgroundImageUrl(): string {
		return this._ch5Properties.get<string>('receiveStateBackgroundImageUrl');
	}

	/**
	 * Name of the boolean signal to pulse on user interaction. Sends a plain
	 * momentary `true` on press - retriggered every REPEAT_DIGITAL_PERIOD ms while
	 * held - and `false` on release. Opt-in: no signal name means nothing is sent.
	 */
	public set sendEventOnClick(value: string) {
		this._ch5Properties.set<string>('sendEventOnClick', value ?? '', this._onSendEventOnClickChange);
	}
	public get sendEventOnClick(): string {
		return this._ch5Properties.get<string>('sendEventOnClick');
	}

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Button.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Button.ELEMENT_NAME, Ch5Button);
		}
	}

	public static get observedAttributes(): string[] {
		return [
			...Ch5LightBaseClass.LIGHT_BASE_OBSERVED_ATTRIBUTES,
			...Ch5Button.OBSERVED_ATTRIBUTES
		];
	}

	//#endregion

	//#region Component Lifecycle

	public constructor(buttonListContractObj?: ICh5ButtonListContractObj) {
		super();
		// Register this component's attributes on the SHARED property store from
		// Ch5LightBaseClass, using the static PROPERTY_SETTINGS (no per-instance alloc).
		this._ch5Properties.add(Ch5Button.PROPERTY_SETTINGS);
		if (buttonListContractObj) {
			this._buttonListContract = buttonListContractObj;
		}
	}

	public attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		this.logStart('attributeChangedCallback');
		this.log('ch5-button attributeChangedCallback(', attr, oldValue, newValue, ')');
		switch (attr) {
			case 'label':
				this.label = newValue ?? '';
				break;
			case 'labelinnerhtml':
				this.labelInnerHTML = newValue ?? '';
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
			case 'receivestatelabel':
				this.receiveStateLabel = newValue ?? '';
				break;
			case 'receivestatescriptlabelhtml':
				this.receiveStateScriptLabelHtml = newValue ?? '';
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
			case 'sendeventonclick':
				this.sendEventOnClick = newValue ?? '';
				break;
			case 'multilinesupport':
				this.multilineSupport = this.coerceBooleanAttribute('multilinesupport', false);
				break;
			case 'truncatetext':
				this.truncateText = this.coerceBooleanAttribute('truncatetext', true);
				break;
			default:
				// Delegate base attributes (show / disabled) to Ch5LightBaseClass.
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
		this.logStop();
	}

	/**
	 * Default host ARIA role (applied in `connectedCallback`) when the author has
	 * not set `role`. Non-observed, so it stays off the attribute-change path.
	 */
	protected getDefaultRole(): string | null {
		return 'button';
	}

	/**
	 * The button's STATIC property settings (the same array passed to
	 * `_ch5Properties.add()`), exposed so `Ch5LightBaseClass.applyContractName` can
	 * read the co-located `contractName: true` flags at connect — mirroring how
	 * `ch5-advance-button` declares the flag on its signal attribute registry
	 * entries. Returning the static array keeps the contract path zero-per-instance,
	 * and is only read when a `contractname` attribute is actually present.
	 */
	protected getContractPropertySettings(): readonly ICh5LightPropertySettings[] {
		return Ch5Button.PROPERTY_SETTINGS;
	}

	/**
	 * Called when the Ch5Button component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logStart('connectedCallback()');
		if (!this._isInitialized) {
			this.createInternalHtml();
			this.handleIcon();
			this.handleLabel();
			this.handleBackgroundImageUrl();
			this._isInitialized = true;
		}

		// Reattach the kept subtree only if it detached (survives reconnect cycles).
		if (this._elButton && this._elButton.parentNode !== this) {
			this._elContainer.appendChild(this._elButton);
		}

		// Apply base attributes (show / disabled) last, once the button exists so the
		// overridden disabled handler can reach it. Idempotent on reconnect.
		super.connectedCallback();

		// (Re)subscribe to any receiveState* signals. No-op when none are set; safe on
		// reconnect (disconnect tore down the subscriptions but kept the names).
		this.subscribeReceiveStateType();
		this.subscribeReceiveStateSelected();
		this.subscribeReceiveStateLabel();
		this.subscribeReceiveStateScriptLabelHtml();
		this.subscribeReceiveStateIconClass();
		this.subscribeReceiveStateIconUrl();
		this.subscribeReceiveStateBackgroundImageUrl();

		// (Re)attach the focus/blur listeners so the host re-emits those events.
		// Always-on; safe on reconnect (disconnect detached them).
		this.wireFocusBlur();

		// (Re)wire the pressable for the `pressed` state + bubbling `press`/`release`
		// events. Always-on (one idle `pointerdown` listener); safe on reconnect.
		this.wirePressable();

		// (Re)measure the multi-line clamp now the button is on-DOM (height is
		// unreadable off-DOM). No-op unless multilineSupport is on; scheduled so the
		// read lands after connect-time mutations settle.
		if (this.multilineSupport) {
			this.scheduleFitEllipsisForMultiline();
		}
		this.logStop();
	}

	public disconnectedCallback() {
		this.logStart('disconnectedCallback()');
		// Release the signal subscriptions (names kept so connectedCallback re-subscribes).
		this.clearSignalSubscription(this.receiveStateType);
		this.clearSignalSubscription(this.receiveStateSelected);
		this.clearSignalSubscription(this.receiveStateLabel);
		this.clearSignalSubscription(this.receiveStateScriptLabelHtml);
		this.clearSignalSubscription(this.receiveStateIconClass);
		this.clearSignalSubscription(this.receiveStateIconUrl);
		this.clearSignalSubscription(this.receiveStateBackgroundImageUrl);

		// Detach the focus/blur listeners; connectedCallback re-attaches.
		this.unwireFocusBlur();
		// Tear down the pressable's listeners (releases first if still pressed); connectedCallback re-wires it.
		this.unwirePressable();
		// Cancel any pending multi-line measurement (drops the scheduled callback) so a
		// detached button does no layout read.
		if (this._pendingFitHandle !== null) {
			window.cancelAnimationFrame(this._pendingFitHandle);
			this._pendingFitHandle = null;
		}
		// Stop any in-flight contract hold timer.
		this.clearButtonListContractHold();
		// Let the base release its own opt-in subscription (receiveStateEnable).
		super.disconnectedCallback();
		this.logStop();
	}

	//#endregion

	//#region Private Methods

	private createInternalHtml() {
		this.log('createInternalHtml()');
		this.clearComponentContent();

		// clearComponentContent() detached the old children, so null the cached label/icon
		// refs to force handleLabel()/handleIcon() to recreate them in the new button.
		this._elSpanLabel = null;
		this._elIcon = null;

		this._elContainer = this;
		this._elContainer.classList.add(Ch5Button.PRIMARY_CSS_CLASS);

		// Create the button OFF-DOM; the handlers add the icon/label while it is detached,
		// and connectedCallback appends the whole subtree to the host once.
		this._elButton = document.createElement('button');
		this._elButton.className = `${Ch5Button.PRIMARY_CSS_CLASS}--btn`;
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		// Use a single native operation instead of repeated removeChild calls.
		this.replaceChildren();
	}

	private handleLabel() {
		this.log('handleLabel(', this.label, ')');
		if (!this._elButton) {
			return;
		}
		// Resolve the active label source by priority (highest first):
		//   1. receivestatescriptlabelhtml (signal, HTML) -> innerHTML
		//   2. receivestatelabel           (signal, text) -> textContent
		//   3. labelinnerhtml              (static, HTML)  -> innerHTML
		//   4. label                       (static, text)  -> textContent
		// The two signals write-through into their own slots (scriptLabelHtml / label),
		// so it's the signal NAME's presence that selects the branch - a signal always
		// outranks the static sources below it. Mirrors ch5-advance-button / ch5-text.
		// Only ONE branch runs (a few cheap store reads, no allocation).
		let html = '';
		let text = '';
		if (this.receiveStateScriptLabelHtml) {
			html = this.scriptLabelHtml;
		} else if (this.receiveStateLabel) {
			text = this.label;
		} else if (this.labelInnerHTML) {
			html = this.labelInnerHTML;
		} else {
			text = this.label;
		}
		if (html || text) {
			// Create the label element lazily the first time content is set
			if (!this._elSpanLabel) {
				this._elSpanLabel = document.createElement('span');
				this._elSpanLabel.className = `${Ch5Button.PRIMARY_CSS_CLASS}--label`;
				this._elButton.appendChild(this._elSpanLabel);
				// Apply the current multiline/truncate classes to the fresh span. The inner
				// multiline measurement is skipped off-DOM (isConnected-guarded);
				// connectedCallback runs the real one.
				this.updateLabelTextWrapping();
			}
			if (html) {
				// Render decoded HTML only for the HTML sources; the decode + innerHTML write
				// cost is paid solely by buttons that actually use them.
				this._elSpanLabel.innerHTML = this.decodeInnerHTMLForAttribute(html);
			} else {
				// textContent (not innerHTML) both renders plain text and clears any HTML left
				// by a previous HTML pass.
				this._elSpanLabel.textContent = text;
			}
			// Refit the clamp when the content changes (depends on text length + button
			// height); only when multiline is on, and scheduled to catch same-tick height changes.
			if (this.multilineSupport) {
				this.scheduleFitEllipsisForMultiline();
			}
		} else if (this._elSpanLabel) {
			// Remove the label element when no source has content
			this._elSpanLabel.remove();
			this._elSpanLabel = null;
		}
	}

	/**
	 * Decodes the HTML entities allowed in the `labelInnerHTML` attribute before it
	 * is written into the label span. Mirrors ch5-advance-button / ch5-text exactly.
	 */
	private decodeInnerHTMLForAttribute(innerHTML: string): string {
		return innerHTML.replace('&amp;', "&")
			.replace('&lt;', "<")
			.replace('&gt;', ">")
			.replace('&quot;', '/"')
			.replace("&apos;", "/'");
	}

	/**
	 * Applies the multiline/truncate state to the label span via CSS classes (cheap,
	 * no layout read); only the opt-in multi-line path measures. Called from the
	 * `multilineSupport` / `truncateText` setters and when the span is first created.
	 */
	private updateLabelTextWrapping() {
		this.log('updateLabelTextWrapping()');
		const span = this._elSpanLabel;
		if (!span) {
			return;
		}
		const p = Ch5Button.PRIMARY_CSS_CLASS;
		span.classList.remove(
			`${p}--label-multiline-support-true`,
			`${p}--label-multiline-support-false`,
			`${p}--label-truncate-text-true`,
			`${p}--label-truncate-text-false`
		);
		span.classList.add(`${p}--label-multiline-support-${this.multilineSupport}`);
		span.classList.add(`${p}--label-truncate-text-${this.truncateText}`);
		if (this.multilineSupport) {
			this.scheduleFitEllipsisForMultiline();
		} else {
			// Drop any inline clamp/height set by a previous multi-line pass.
			span.style.removeProperty('-webkit-line-clamp');
			span.style.removeProperty('max-height');
		}
	}

	/**
	 * Requests a multi-line clamp refit, coalesced into a SINGLE rAF read so same-tick
	 * DOM/style mutations settle before the height is measured. Idempotent: repeat
	 * requests in one tick collapse onto the one pending frame.
	 */
	private scheduleFitEllipsisForMultiline(): void {
		if (this._pendingFitHandle !== null) {
			return;
		}
		this._pendingFitHandle = window.requestAnimationFrame(this._fitEllipsisFrame);
	}

	/**
	 * Computes how many label lines fit the button's height and writes the clamp
	 * inline. The ONLY layout-reading path, only when `multilineSupport` is on. No
	 * ResizeObserver (unlike ch5-button): measured on connect and label/attr changes.
	 */
	private fitEllipsisForMultiline() {
		this.log('fitEllipsisForMultiline()');
		const span = this._elSpanLabel;
		const button = this._elButton;
		// Height is only meaningful once the button is attached to the DOM.
		if (!span || !button || !button.isConnected) {
			return;
		}
		const lineHeight = this.getLabelLineHeight(span);
		if (lineHeight <= 0) {
			return;
		}
		const topAndBottomPadding = 20;
		const containerHeight = button.clientHeight - topAndBottomPadding;
		const numberOfLines = containerHeight < lineHeight ? 1 : Math.floor(containerHeight / lineHeight);
		if (this.truncateText) {
			span.style.removeProperty('max-height');
			span.style.setProperty('-webkit-line-clamp', String(numberOfLines));
		} else {
			span.style.removeProperty('-webkit-line-clamp');
			span.style.setProperty('max-height', `${numberOfLines * lineHeight}px`);
		}
	}

	/**
	 * Measures a single line's rendered height by briefly swapping in a non-breaking
	 * space, reading offsetHeight, then restoring the content. Mirrors ch5-button.
	 */
	private getLabelLineHeight(element: HTMLElement): number {
		const oldHtml = element.innerHTML;
		element.innerHTML = '&nbsp;';
		const lineHeight = element.offsetHeight;
		element.innerHTML = oldHtml;
		return lineHeight;
	}

	private handleIcon() {
		this.log('handleIcon()');
		if (!this._elButton) {
			return;
		}
		// Resolve the effective icon by source priority (highest first):
		//   1. receivestateiconurl   (signal image URL)  -> --img
		//   2. receivestateiconclass (signal icon class) -> --icon
		//   3. iconurl               (static image URL)  -> --img
		//   4. iconclass             (static icon class) -> --icon
		// A signal writes through into the same iconUrl/iconClass slot, so it's the
		// signal NAME's presence that selects the branch (a signal icon class outranks
		// a static iconurl).
		let iconUrl = '';
		let iconClass = '';
		if (this.receiveStateIconUrl) {
			iconUrl = this.iconUrl;
		} else if (this.receiveStateIconClass) {
			iconClass = this.iconClass;
		} else if (this.iconUrl) {
			iconUrl = this.iconUrl;
		} else {
			iconClass = this.iconClass;
		}
		if (iconUrl || iconClass) {
			// Create the icon element lazily on first use. DOM order doesn't matter -
			// the icon position is set by the CSS `order` property (see
			// _light-button-icon-position.scss).
			if (!this._elIcon) {
				this._elIcon = document.createElement('i');
				this._elButton.appendChild(this._elIcon);
			}
			if (iconUrl) {
				// Render the icon as a background image using the --img modifier class.
				// The --img and --icon classes are mutually exclusive (same as ch5-button).
				this._elIcon.className = `${Ch5Button.PRIMARY_CSS_CLASS}--img`;
				this._elIcon.style.backgroundImage = `url("${iconUrl}")`;
			} else {
				// Fall back to the icon font class.
				this._elIcon.className = `${Ch5Button.PRIMARY_CSS_CLASS}--icon ${iconClass}`;
				this._elIcon.style.backgroundImage = '';
			}
		} else if (this._elIcon) {
			// Remove the icon element when no icon source is set
			this._elIcon.remove();
			this._elIcon = null;
		}
	}

	private handleBackgroundImageUrl() {
		this.log('handleBackgroundImageUrl()');
		if (!this._elButton) {
			return;
		}
		// Apply the background image as an inline style on the button (same as
		// ch5-button); an attribute URL can't be injected via pure CSS, so it's done in JS.
		
		const backgroundImageUrl = this.backgroundImageUrl;
		if (backgroundImageUrl) {
			this._elButton.style.backgroundImage = `url("${backgroundImageUrl}")`;
		} else {
			// Empty value: drop the property entirely and remove the now-empty
			// `style` attribute so no leftover `style=""` is left in the DOM.
			this._elButton.style.removeProperty('background-image');
			if (this._elButton.getAttribute('style') === '') {
				this._elButton.removeAttribute('style');
			}
		}
	}

	// --- Shared signal plumbing ----------------------------------------------
	// The three helpers below hold the ONLY subscribe/unsubscribe/channel-teardown
	// logic; each receiveState* wrapper just supplies its name, type and value
	// handler. Off the hot path (fire only on connect/disconnect/attr change).

	/**
	 * Lazily creates the shared signal helper (only for buttons that use a signal)
	 * and subscribes `onValue` to `signalName`. Idempotent: no-op when the name is
	 * empty or already subscribed.
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
	 * Releases one signal name's subscription, leaving any coexisting receiveState*
	 * subscription (and the stored name) intact so a reconnect can re-subscribe.
	 * No-op when nothing was ever subscribed.
	 */
	private clearSignalSubscription(signalName: string): void {
		if (this._signals !== null) {
			this._signals.unsubscribe(signalName);
		}
	}

	/**
	 * Removes a `data-signal-*` styling channel so the matching author attribute
	 * regains control (called when a receiveState* attribute is removed).
	 */
	private clearSignalChannel(attribute: string): void {
		if (this.hasAttribute(attribute)) {
			this.removeAttribute(attribute);
		}
	}

	/**
	 * Reacts to a `receivestatetype` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when
	 * connected or drops the `data-signal-type` channel so the static `type` styles again.
	 */
	private handleReceiveStateType(oldSignalName: string): void {
		this.log('handleReceiveStateType(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		const signalName = this.receiveStateType;
		if (signalName) {
			if (this.isConnected) {
				this.subscribeReceiveStateType();
			}
		} else {
			// Leaving signal-driven mode: the static `type` regains priority.
			this.clearSignalChannel(Ch5Button.SIGNAL_ATTRIBUTE_TYPE);
		}
	}

	/** Subscribes the `receivestatetype` string signal to {@link applySignalType}. */
	private subscribeReceiveStateType(): void {
		this.log('subscribeReceiveStateType()');
		this.subscribeSignal<string>(
			this.receiveStateType,
			'string',
			this._onSignalTypeValue
		);
	}

	/**
	 * Writes a signal-delivered type to the SEPARATE `data-signal-type` channel (never
	 * the author's `type`), which the theme styles with priority. Unknown values fall
	 * back to `default`.
	 */
	private applySignalType(value: string): void {
		this.log('applySignalType(', value, ')');
		const type = Ch5Button.TYPES.indexOf(value) >= 0 ? value : Ch5Button.TYPES[0];
		this.setAttribute(Ch5Button.SIGNAL_ATTRIBUTE_TYPE, type);
	}

	/**
	 * Reacts to a `receivestateselected` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when
	 * connected or drops the `data-signal-selected` channel so the static `selected` styles again.
	 */
	private handleReceiveStateSelected(oldSignalName: string): void {
		this.log('handleReceiveStateSelected(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		const signalName = this.receiveStateSelected;
		if (signalName) {
			if (this.isConnected) {
				this.subscribeReceiveStateSelected();
			}
		} else {
			// Leaving signal-driven mode: the static `selected` regains priority.
			this.clearSignalChannel(Ch5Button.SIGNAL_ATTRIBUTE_SELECTED);
		}
	}

	/** Subscribes the `receivestateselected` boolean signal to {@link applySignalSelected}. */
	private subscribeReceiveStateSelected(): void {
		this.log('subscribeReceiveStateSelected()');
		this.subscribeSignal<boolean>(
			this.receiveStateSelected,
			'boolean',
			this._onSignalSelectedValue
		);
	}

	/**
	 * Writes a signal-delivered selected state to the SEPARATE `data-signal-selected`
	 * channel (never the author's `selected`), which the theme styles with priority.
	 * `"false"` stays on the attribute to keep the static `selected` suppressed;
	 * `"true"` applies the selected look.
	 */
	private applySignalSelected(value: boolean): void {
		this.log('applySignalSelected(', value, ')');
		this.setAttribute(Ch5Button.SIGNAL_ATTRIBUTE_SELECTED, value ? 'true' : 'false');
	}

	/**
	 * Reacts to a `receivestatelabel` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when a
	 * name is set and connected. Removal is design-time, so the last value stays in the `label` slot.
	 */
	private handleReceiveStateLabel(oldSignalName: string): void {
		this.log('handleReceiveStateLabel(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateLabel && this.isConnected) {
			this.subscribeReceiveStateLabel();
		}
	}

	/** Subscribes the `receivestatelabel` string signal to {@link applySignalLabel}. */
	private subscribeReceiveStateLabel(): void {
		this.log('subscribeReceiveStateLabel()');
		this.subscribeSignal<string>(
			this.receiveStateLabel,
			'string',
			this._onSignalLabelValue
		);
	}

	/**
	 * Writes a signal-delivered label into the shared `label` slot (rendered by
	 * {@link handleLabel}), so the runtime signal wins over the static `label`. The
	 * store's equality check skips redundant re-renders.
	 */
	private applySignalLabel(value: string): void {
		this.log('applySignalLabel(', value, ')');
		this.label = value ?? '';
	}

	/**
	 * Reacts to a `receivestatescriptlabelhtml` name change (`oldSignalName` = previous
	 * name, for unsubscription): tears down the old subscription, then (re)subscribes
	 * when a name is set and connected. Removal is design-time, so the last value stays
	 * in the `scriptLabelHtml` slot.
	 */
	private handleReceiveStateScriptLabelHtml(oldSignalName: string): void {
		this.log('handleReceiveStateScriptLabelHtml(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateScriptLabelHtml && this.isConnected) {
			this.subscribeReceiveStateScriptLabelHtml();
		}
	}

	/** Subscribes the `receivestatescriptlabelhtml` string signal to {@link applySignalScriptLabelHtml}. */
	private subscribeReceiveStateScriptLabelHtml(): void {
		this.log('subscribeReceiveStateScriptLabelHtml()');
		this.subscribeSignal<string>(
			this.receiveStateScriptLabelHtml,
			'string',
			this._onSignalScriptLabelHtmlValue
		);
	}

	/**
	 * Writes a signal-delivered HTML label into the shared `scriptLabelHtml` slot
	 * (rendered by {@link handleLabel} via `innerHTML`), so the runtime signal wins over
	 * every static label source. The store's equality check skips redundant re-renders.
	 */
	private applySignalScriptLabelHtml(value: string): void {
		this.log('applySignalScriptLabelHtml(', value, ')');
		this.scriptLabelHtml = value ?? '';
	}

	/**
	 * Reacts to a `receivestateiconclass` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when a
	 * name is set and connected. Removal is design-time, so the last value stays in the `iconClass` slot.
	 */
	private handleReceiveStateIconClass(oldSignalName: string): void {
		this.log('handleReceiveStateIconClass(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateIconClass && this.isConnected) {
			this.subscribeReceiveStateIconClass();
		}
	}

	/** Subscribes the `receivestateiconclass` string signal to {@link applySignalIconClass}. */
	private subscribeReceiveStateIconClass(): void {
		this.log('subscribeReceiveStateIconClass()');
		this.subscribeSignal<string>(
			this.receiveStateIconClass,
			'string',
			this._onSignalIconClassValue
		);
	}

	/**
	 * Writes a signal-delivered icon class into the shared `iconClass` slot (rendered
	 * by {@link handleIcon}). Priority (receivestateiconurl > receivestateiconclass >
	 * iconurl > iconclass) is resolved there, so its presence outranks a static iconurl.
	 */
	private applySignalIconClass(value: string): void {
		this.log('applySignalIconClass(', value, ')');
		this.iconClass = value ?? '';
	}

	/**
	 * Reacts to a `receivestateiconurl` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when a
	 * name is set and connected. Removal is design-time, so the last value stays in the `iconUrl` slot.
	 */
	private handleReceiveStateIconUrl(oldSignalName: string): void {
		this.log('handleReceiveStateIconUrl(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateIconUrl && this.isConnected) {
			this.subscribeReceiveStateIconUrl();
		}
	}

	/** Subscribes the `receivestateiconurl` string signal to {@link applySignalIconUrl}. */
	private subscribeReceiveStateIconUrl(): void {
		this.log('subscribeReceiveStateIconUrl()');
		this.subscribeSignal<string>(
			this.receiveStateIconUrl,
			'string',
			this._onSignalIconUrlValue
		);
	}

	/**
	 * Writes a signal-delivered icon URL into the shared `iconUrl` slot (rendered by
	 * {@link handleIcon}). `receivestateiconurl` ranks HIGHEST of the icon sources
	 * (receivestateiconurl > receivestateiconclass > iconurl > iconclass).
	 */
	private applySignalIconUrl(value: string): void {
		this.log('applySignalIconUrl(', value, ')');
		this.iconUrl = value ?? '';
	}

	/**
	 * Reacts to a `receivestatebackgroundimageurl` name change (`oldSignalName` =
	 * previous name, for unsubscription): tears down the old subscription, then
	 * (re)subscribes when a name is set and connected. Removal is design-time, so the
	 * last value stays in the `backgroundImageUrl` slot.
	 */
	private handleReceiveStateBackgroundImageUrl(oldSignalName: string): void {
		this.log('handleReceiveStateBackgroundImageUrl(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateBackgroundImageUrl && this.isConnected) {
			this.subscribeReceiveStateBackgroundImageUrl();
		}
	}

	/** Subscribes the `receivestatebackgroundimageurl` string signal to {@link applySignalBackgroundImageUrl}. */
	private subscribeReceiveStateBackgroundImageUrl(): void {
		this.log('subscribeReceiveStateBackgroundImageUrl()');
		this.subscribeSignal<string>(
			this.receiveStateBackgroundImageUrl,
			'string',
			this._onSignalBackgroundImageUrlValue
		);
	}

	/**
	 * Writes a signal-delivered background image URL into the shared `backgroundImageUrl`
	 * slot (rendered by {@link handleBackgroundImageUrl}), so the runtime signal wins
	 * over the static `backgroundimageurl`. Also reflects the `backgroundimageurl`
	 * attribute on the host, since the fill-type CSS is scoped to
	 * `ch5-button[backgroundimageurl]` (a signal-only author would otherwise never
	 * match it); the re-entrant setter is stopped by the store's equality check.
	 */
	private applySignalBackgroundImageUrl(value: string): void {
		this.log('applySignalBackgroundImageUrl(', value, ')');
		const url = value ?? '';
		if (url) {
			this.setAttribute('backgroundimageurl', url);
		} else {
			this.removeAttribute('backgroundimageurl');
		}
		this.backgroundImageUrl = url;
	}

	// --- sendEventOnClick ------------------------------------------------------

	/**
	 * Reacts to a `sendeventonclick` name change. The click signal is driven by the
	 * pressable's onChange (see `handlePressedChange`), so nothing is (un)wired here;
	 * we only stop an in-flight repeat-digital if the name was cleared mid-press.
	 */
	private handleSendEventOnClick(): void {
		this.log('handleSendEventOnClick()');
		if (!this.sendEventOnClick) {
			this.stopClickRepeatDigital();
		}
	}

	/**
	 * Pressable onChange handler: drives the opt-in `sendeventonclick` signal. Press
	 * starts sending (immediate `true` + repeat-digital); release stops and sends the
	 * final `false`. Zero cost when unset - `startClickRepeatDigital()` early-returns
	 * before any allocation.
	 */
	private handlePressedChange(pressed: boolean): void {
		this.log('handlePressedChange(', pressed, ')');
		// In a contract-driven ch5-button-list, presses publish the list's contract
		// signals instead of sendEventOnClick (mirrors Ch5AdvanceButton).
		if (this._buttonListContract.contractName !== '' && this._buttonListContract.parentComponent === 'ch5-button-list') {
			this.handleButtonListContractPress(pressed);
			return;
		}
		if (pressed) {
			this.startClickRepeatDigital();
		} else {
			this.stopClickRepeatDigital();
		}
	}

	/**
	 * Publishes the ch5-button-list contract press signals for this item, mirroring
	 * Ch5AdvanceButton's button-list path: Button{n}ItemPress on press/release,
	 * ListItemClicked on a plain release, and ListItemHeld once the hold threshold
	 * (clickHoldTime, 0 = immediate) elapses.
	 */
	private handleButtonListContractPress(pressed: boolean): void {
		const { contractName, index, clickHoldTime } = this._buttonListContract;
		const signals = (this._signals ??= new Ch5LightSignal());
		if (pressed) {
			signals.sendBoolean(`${contractName}.Button${index}ItemPress`, true);
			this.clearButtonListContractHold();
			if (clickHoldTime === 0) {
				this._buttonListContractIsHeld = true;
				signals.sendNumber(`${contractName}.ListItemHeld`, index);
			} else {
				this._buttonListContractHoldInterval = window.setInterval(() => {
					this._buttonListContractIsHeld = true;
					signals.sendNumber(`${contractName}.ListItemHeld`, index);
					this.clearButtonListContractHold();
				}, clickHoldTime);
			}
		} else {
			signals.sendBoolean(`${contractName}.Button${index}ItemPress`, false);
			if (this._buttonListContractIsHeld === false) {
				signals.sendNumber(`${contractName}.ListItemClicked`, index);
			}
			this.clearButtonListContractHold();
			this._buttonListContractIsHeld = false;
		}
	}

	/** Clears the pending ListItemHeld timer, if any. */
	private clearButtonListContractHold(): void {
		if (this._buttonListContractHoldInterval !== null) {
			window.clearInterval(this._buttonListContractHoldInterval);
			this._buttonListContractHoldInterval = null;
		}
	}

	/**
	 * Sends the initial `true`, then retriggers it every `REPEAT_DIGITAL_PERIOD` ms
	 * while held, mirroring ch5-button's repeat-digital. No-op (no interval allocated)
	 * unless a `sendeventonclick` signal name is set.
	 */
	private startClickRepeatDigital(): void {
		if (!this.sendEventOnClick) {
			return;
		}
		this.sendClickValue(true);
		if (this._repeatDigitalInterval !== null) {
			window.clearInterval(this._repeatDigitalInterval);
		}
		this._repeatDigitalInterval = window.setInterval(() => {
			this.sendClickValue(true);
		}, Ch5Button.REPEAT_DIGITAL_PERIOD);
	}

	/**
	 * Stops an in-flight repeat-digital and, if one was running, sends the final
	 * `false` release. Safe to call when nothing was running.
	 */
	private stopClickRepeatDigital(): void {
		const wasRepeating = this._repeatDigitalInterval !== null;
		if (this._repeatDigitalInterval !== null) {
			window.clearInterval(this._repeatDigitalInterval);
			this._repeatDigitalInterval = null;
		}
		if (wasRepeating && this.sendEventOnClick) {
			this.sendClickValue(false);
		}
	}

	/**
     * Publishes the `sendeventonclick` value in the REPEAT-DIGITAL object form
     * (`{ repeatdigital: value }`), exactly like `ch5-button` (and `ch5-image` /
     * `ch5-dpad`) — the light button supports repeat-digital, so it must send the
     * same object shape as its heavy twin for the control system to handle the
     * auto-repeat identically. Reuses the shared lazy `Ch5LightSignal` helper;
     * `sendRepeatDigital` is stateless, so it works whether or not any receive
     * signals are subscribed.
     */
    private sendClickValue(value: boolean): void {
        this.log('sendClickValue(', value, ')');
        const signalName = this.sendEventOnClick;
        if (!signalName) {
            return;
        }
        (this._signals ??= new Ch5LightSignal()).sendRepeatDigital(signalName, value);
    }

	/**
	 * Attaches the native `focus`/`blur` listeners to the inner button. No-op if
	 * already wired or if no button exists yet. The handlers are cached fields.
	 */
	private wireFocusBlur(): void {
		if (!this._elButton || this._focusListenersWired) {
			return;
		}
		this.log('wireFocusBlur()');
		this._focusListenersWired = true;
		this._elButton.addEventListener('focus', this._onFocus);
		this._elButton.addEventListener('blur', this._onBlur);
	}

	/**
	 * Detaches the native `focus`/`blur` listeners (cached handlers are never nulled,
	 * only re-attached on the next wire). Safe to call when nothing was wired.
	 */
	private unwireFocusBlur(): void {
		this.log('unwireFocusBlur()');
		if (this._elButton && this._focusListenersWired) {
			this._elButton.removeEventListener('focus', this._onFocus);
			this._elButton.removeEventListener('blur', this._onBlur);
		}
		this._focusListenersWired = false;
	}

	/** Focus: re-emit the (non-bubbling) native `focus` event from the host. */
	private handleFocus(event: FocusEvent): void {
		this.log('handleFocus()');
		this.reDispatchFocusEvent(event);
	}

	/**
	 * Blur: re-emit the native `blur` from the host and force-release any in-flight
	 * press so the button doesn't stay stuck `pressed` (mirrors ch5-button). No-op when
	 * not pressed.
	 */
	private handleBlur(event: FocusEvent): void {
		this.log('handleBlur()');
		this._pressable?.setPressed(false);
		this.reDispatchFocusEvent(event);
	}

	/**
	 * Clones the native focus/blur event and re-dispatches it from the host so
	 * `<ch5-button>` consumers receive it (these events don't bubble), then stops
	 * the original from propagating further. Mirrors ch5-button.
	 */
	private reDispatchFocusEvent(event: FocusEvent): void {
		const clonedEvent: Event = new Event(event.type, event);
		this.dispatchEvent(clonedEvent);
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * (Re)wires the shared Ch5LightPressable for the `pressed` state + bubbling
	 * `press`/`release` events. Listens on the inner `<button>` (a disabled
	 * `pointer-events:none` button blocks presses for free); created lazily and reused
	 * across reconnects. No-op if no button exists yet.
	 */
	private wirePressable(): void {
		if (!this._elButton) {
			return;
		}
		this.log('wirePressable()');
		if (!this._pressable) {
			this._pressable = new Ch5LightPressable(this, this._elButton, undefined, this._onPressedChange);
		}
		this._pressable.init();
	}

	/**
	 * Tears down the pressable's listeners (releasing first if a press is still in
	 * flight). The pressable object is kept for reuse; connectedCallback re-wires it.
	 * Safe to call when nothing was wired.
	 */
	private unwirePressable(): void {
		this.log('unwirePressable()');
		this._pressable?.destroy();
	}

	//#endregion
}

Ch5Button.registerCustomElement();
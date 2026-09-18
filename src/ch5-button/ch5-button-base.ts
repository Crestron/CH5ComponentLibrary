import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { ICh5LightPropertySettings } from "../ch5-light-base/ch5-light-properties";
import { Ch5LightSignal, TCh5LightSignalType } from "../ch5-light-base/ch5-light-signal";
import { Ch5LightPressable } from "../ch5-light-base/ch5-light-pressable";
import { ICh5ButtonListContractObj } from "../ch5-button-list/interfaces/t-for-ch5-button-list-contract";
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

// Shared implementation for the "button" family of light components. See
// ch5-button.md (same folder) for the full design reference: class hierarchy,
// signal wiring lifecycle, the static-vs-signal `type`/`selected` channel split,
// and the GC/allocation rules this file follows. Update that document alongside
// any behavior/API change made here.
//
// Concrete components (`Ch5Button`, `Ch5SliderButton`, ...) extend this class,
// mirroring the `Ch5AdvancedButtonBase` / `Ch5AdvancedButton` split: this base
// carries every getter/setter, lifecycle hook and rendering method, while each
// concrete subclass supplies its own `ELEMENT_NAME` / `PRIMARY_CSS_CLASS` and
// registers its own custom element, signal attribute types and
// `observedAttributes`. A subclass that needs FEWER attributes than the full
// button (e.g. `Ch5SliderButton`, which has no use for `size`/`stretch`/
// `multilinesupport`/...) simply lists a smaller `observedAttributes` set built
// from a subset of `PROPERTY_SETTINGS` (see {@link toObservedAttributeNames}) -
// every getter/setter below keeps working programmatically, it just stops being
// attribute-reactive for the omitted names, and costs nothing extra when unused.
export class Ch5ButtonBase extends Ch5LightBaseClass {

	//#region Constants

	/**
	 * Default identity for this class. Concrete subclasses declare their OWN
	 * `ELEMENT_NAME` / `PRIMARY_CSS_CLASS` (shadowing these), read back
	 * polymorphically through {@link ctor} so shared base-class code (icon/label
	 * rendering, `connectedCallback`, ...) always reflects the actual registered
	 * subclass instead of this base.
	 */
	public static readonly ELEMENT_NAME: string = 'ch5-button';
	public static readonly PRIMARY_CSS_CLASS: string = 'ch5-button';
	public static readonly TYPES: readonly string[] = ['default', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'text'];
	public static readonly SIZES: readonly string[] = ['regular', 'x-small', 'small', 'large', 'x-large'];
	public static readonly SHAPES: readonly string[] = ['rounded-rectangle', 'rectangle', 'circle', 'oval', 'tab'];
	public static readonly STRETCHES: readonly string[] = ['width', 'height', 'both'];
	public static readonly ICON_POSITIONS: readonly string[] = ['first', 'last', 'top', 'bottom'];
	public static readonly ORIENTATIONS: readonly string[] = ['horizontal', 'vertical'];
	public static readonly H_ALIGN_LABELS: readonly string[] = ['center', 'left', 'right'];
	public static readonly V_ALIGN_LABELS: readonly string[] = ['middle', 'top', 'bottom'];
	public static readonly CHECKBOX_POSITIONS: readonly string[] = ['left', 'right'];
	public static readonly ICON_URL_FILL_TYPES: readonly string[] = ['stretch', 'stretch-aspect', 'center', 'tile', 'initial'];
	public static readonly BACKGROUND_IMAGE_URL_FILL_TYPES: readonly string[] = ['stretch-aspect', 'stretch', 'center', 'tile'];
	public static readonly SIGNAL_ATTRIBUTE_TYPE = 'data-signal-type';
	public static readonly SIGNAL_ATTRIBUTE_SELECTED = 'data-signal-selected';

	/**
	 * Property settings for the shared `_ch5Properties` store. STATIC so the array
	 * is built once per class, not per instance (avoids N allocations at scale).
	 * Safe to share: `add()` only reads each entry, never retains it.
	 *
	 * Join type metadata (direction, booleanJoin, etc.) is also defined here for
	 * auto-generation of Ch5SignalAttributeRegistry entries - single source of truth.
	 *
	 * This is the FULL set used by `Ch5Button`. A subclass that needs fewer
	 * properties builds its own array (optionally filtering this one, e.g. via
	 * `Ch5ButtonBase.PROPERTY_SETTINGS.filter(...)`) plus any properties of its
	 * own, and registers it with `this._ch5Properties.add(...)` in its constructor.
	 */
	public static readonly PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		{ name: 'label', default: '', type: 'string' },
		{ name: 'labelInnerHTML', default: '', type: 'string', trimString: false },
		{ name: 'iconClass', default: '', type: 'string' },
		{ name: 'iconUrl', default: '', type: 'string' },
		{ name: 'backgroundImageUrl', default: '', type: 'string' },
		{ name: 'receiveStateType', default: '', type: 'string', contractName: true, direction: 'state', stringJoin: 1 },
		{ name: 'receiveStateSelected', default: '', type: 'string', contractName: true, direction: 'state', booleanJoin: 1 },
		{ name: 'receiveStateLabel', default: '', type: 'string', contractName: true, direction: 'state', stringJoin: 1 },
		{ name: 'receiveStateScriptLabelHtml', default: '', type: 'string', contractName: true, direction: 'state', stringJoin: 1 },
		{ name: 'scriptLabelHtml', default: '', type: 'string', trimString: false },
		{ name: 'receiveStateIconClass', default: '', type: 'string', contractName: true, direction: 'state', stringJoin: 1 },
		{ name: 'receiveStateIconUrl', default: '', type: 'string', contractName: true, direction: 'state', stringJoin: 1 },
		{ name: 'receiveStateBackgroundImageUrl', default: '', type: 'string', contractName: true, direction: 'state', stringJoin: 1 },
		{ name: 'sendEventOnClick', default: '', type: 'string', contractName: true, direction: 'event', booleanJoin: 1 },
		{ name: 'multilineSupport', default: false, type: 'boolean' },
		{ name: 'truncateText', default: true, type: 'boolean' }
	];

	/**
	 * Converts a PROPERTY_SETTINGS list into its lowercase attribute-name form
	 * (`labelInnerHTML` -> `labelinnerhtml`). Shared so every concrete subclass can
	 * auto-generate its OWN `observedAttributes` from its OWN PROPERTY_SETTINGS -
	 * the full list for `Ch5Button`, or a smaller subset plus extra properties
	 * (e.g. `Ch5SliderButton`'s `key`) for a lighter subclass.
	 */
	protected static toObservedAttributeNames(settings: readonly ICh5LightPropertySettings[]): string[] {
		return settings.map(setting => setting.name.replace(/([A-Z])/g, match => match.toLowerCase()).toLowerCase());
	}

	/**
	 * Pure-CSS attributes that can change the button's rendered dimensions. Not part
	 * of PROPERTY_SETTINGS (no property-store slot), so a subclass that wants them to
	 * be attribute-reactive (re-measuring multiline clamp / vertical fit on change,
	 * see {@link scheduleDimensionDependentRefit}) merges this into its own
	 * `observedAttributes` - `Ch5SliderButton` deliberately omits it (no use for
	 * size/shape/stretch/orientation).
	 */
	public static readonly DIMENSION_ATTRIBUTES: readonly string[] = ['size', 'shape', 'stretch', 'orientation'];

	/**
	 * Builds the `Ch5SignalAttributeRegistry` entries for a PROPERTY_SETTINGS list,
	 * merged with the light base class's own signal attribute entries. Shared by
	 * every concrete subclass's `registerSignalAttributeTypes()` so the
	 * auto-generation (DRY refactor described in
	 * ch5-button-vs-ch5-advanced-button.md) stays a single source of truth.
	 */
	protected static buildSignalAttributeRegistryEntries(settings: readonly ICh5LightPropertySettings[]): Ch5SignalElementAttributeRegistryEntries {
		const registryEntries = Ch5LightBaseClass.getBaseSignalAttributeEntries();
		(Ch5LightBaseClass as any).generateRegistryEntriesFromSettings(settings, registryEntries);
		return registryEntries;
	}

	//#endregion

	//#region Variables

	protected _isInitialized = false;

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
	// Vertical orientation parity with ch5-advanced-button: one coalesced rAF fit
	// maps the inner <button> dimensions to the host's current footprint
	// (width=hostHeight, height=hostWidth) so rotated content fills the host even
	// when external CSS sets custom host sizes.
	private _pendingVerticalFitHandle: number | null = null;
	private readonly _fitEllipsisFrame = () => {
		this._pendingFitHandle = null;
		// multilineSupport may have been turned off since scheduling.
		if (this.multilineSupport) {
			this.fitEllipsisForMultiline();
		}
	};
	private readonly _fitVerticalFrame = () => {
		this._pendingVerticalFitHandle = null;
		this.fitVerticalInnerButtonSize();
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
	// Hold delay before the repeat starts (matches ch5-advanced-button's TOUCH_TIMEOUT): a
	// tap released before this sends a single true/false; only a longer hold begins the repeat.
	private static readonly REPEAT_DIGITAL_HOLD_DELAY = 250;
	// Single timer handle for the whole press cycle: non-null means a `true` was sent and a
	// tick is scheduled (so it doubles as the "send the final false on release" flag). It is
	// the hold-delay timeout first, then reschedules itself every period while held.
	private _repeatDigitalTimer: number | null = null;
	private readonly _repeatDigitalTick = () => {
		this.sendClickValue(true);
		this._repeatDigitalTimer = window.setTimeout(this._repeatDigitalTick, Ch5ButtonBase.REPEAT_DIGITAL_PERIOD);
	};
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
		const normalizedValue = value ?? '';
		// While receiveStateLabel is bound, the signal owns the effective label slot.
		if (!this.receiveStateLabel) {
			this._ch5Properties.set<string>('label', normalizedValue, this._onLabelChange);
		}
		if (this._isInitialized) {
			this.setAttribute('label', normalizedValue);
		}
	}
	public get label(): string {
		if (this.receiveStateScriptLabelHtml) {
			return this.scriptLabelHtml;
		}
		return this._ch5Properties.get<string>('label');
	}

	/**
	 * Raw HTML rendered inside the label span. Takes priority over the plain-text
	 * `label` (mirrors ch5-advanced-button / ch5-text), EXCEPT while a
	 * `receiveStateLabel` signal is driving the label - the signal write-throughs
	 * into the `label` slot and must win. Rendered lazily (only when set), so
	 * label-free / text-only buttons pay nothing.
	 */
	public set labelInnerHTML(value: string) {
		const normalizedValue = value ?? '';
		this._ch5Properties.set<string>('labelInnerHTML', normalizedValue, this._onLabelChange);
		if (this._isInitialized) {
			this.setAttribute('labelInnerHTML', normalizedValue);
		}
	}
	public get labelInnerHTML(): string {
		return this._ch5Properties.get<string>('labelInnerHTML');
	}

	public set iconClass(value: string) {
		const normalizedValue = value ?? '';
		// While receiveStateIconClass is bound, the signal owns the effective iconClass slot.
		if (!this.receiveStateIconClass) {
			this._ch5Properties.set<string>('iconClass', normalizedValue, this._onIconChange);
		}
		if (this._isInitialized) {
			this.setAttribute('iconClass', normalizedValue);
		}
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>('iconClass');
	}

	public set iconUrl(value: string) {
		const normalizedValue = value ?? '';
		// While receiveStateIconUrl is bound, the signal owns the effective iconUrl slot.
		if (!this.receiveStateIconUrl) {
			this._ch5Properties.set<string>('iconUrl', normalizedValue, this._onIconChange);
		}
		if (this._isInitialized) {
			this.setAttribute('iconUrl', normalizedValue);
		}
	}
	public get iconUrl(): string {
		return this._ch5Properties.get<string>('iconUrl');
	}

	public set backgroundImageUrl(value: string) {
		const normalizedValue = value ?? '';
		// While receiveStateBackgroundImageUrl is bound, the signal owns the slot.
		if (!this.receiveStateBackgroundImageUrl) {
			this._ch5Properties.set<string>('backgroundImageUrl', normalizedValue, this._onBackgroundImageChange);
		}
		if (this._isInitialized) {
			this.setAttribute('backgroundImageUrl', normalizedValue);
		}
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
		const normalizedValue = Ch5LightBaseClass.normalizeBooleanValue(value, false, true);
		this._ch5Properties.set<boolean>('multilineSupport', normalizedValue, this._onLabelWrapChange);
		if (this._isInitialized) {
			this.setAttribute('multilineSupport', normalizedValue ? 'true' : 'false');
		}
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
		const normalizedValue = Ch5LightBaseClass.normalizeBooleanValue(value, true, true);
		this._ch5Properties.set<boolean>('truncateText', normalizedValue, this._onLabelWrapChange);
		if (this._isInitialized) {
			this.setAttribute('truncateText', normalizedValue ? 'true' : 'false');
		}
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
		if (this._isInitialized) {
			this.setAttribute('receiveStateType', value);
		}
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
		if (this._isInitialized) {
			this.setAttribute('receiveStateSelected', value);
		}
	}
	public get receiveStateSelected(): string {
		return this._ch5Properties.get<string>('receiveStateSelected');
	}

	/**
	 * Name of the string signal driving the button label. While present, it fully
	 * owns the effective `label` slot (including empty values), independent of
	 * whether static `label` is parsed before or after this attribute.
	 */
	public set receiveStateLabel(value: string) {
		this._ch5Properties.set<string>('receiveStateLabel', value ?? '', this._onReceiveStateLabelChange);
		if (this._isInitialized) {
			this.setAttribute('receiveStateLabel', value);
		}
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
		if (this._isInitialized) {
			this.setAttribute('receiveStateScriptLabelHtml', value);
		}
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
		if (this._isInitialized) {
			this.setAttribute('receiveStateIconClass', value);
		}
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
		if (this._isInitialized) {
			this.setAttribute('receiveStateIconUrl', value);
		}
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
		if (this._isInitialized) {
			this.setAttribute('receiveStateBackgroundImageUrl', value);
		}
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
		if (this._isInitialized) {
			this.setAttribute('sendEventOnClick', value);
		}
	}
	public get sendEventOnClick(): string {
		return this._ch5Properties.get<string>('sendEventOnClick');
	}

	// CSS-Based Attribute Setters and Getters
	// These attributes are read directly by CSS selectors. No property store, no
	// attributeChangedCallback, no handlers - just passive data for styling.

	/**
	 * Button size variant. Pure CSS attribute - no JS logic, just styling.
	 * Valid values: see {@link SIZES}
	 */
	public set size(value: string) {
		this.setEnumHostAttribute('size', value, Ch5ButtonBase.SIZES, Ch5ButtonBase.SIZES[0]);
	}
	public get size(): string {
		return this.getAttribute('size') || Ch5ButtonBase.SIZES[0];
	}

	/**
	 * Button shape variant. Pure CSS attribute - no JS logic, just styling.
	 * Valid values: see {@link SHAPES}
	 */
	public set shape(value: string) {
		this.setEnumHostAttribute('shape', value, Ch5ButtonBase.SHAPES, Ch5ButtonBase.SHAPES[0]);
	}
	public get shape(): string {
		return this.getAttribute('shape') || Ch5ButtonBase.SHAPES[0];
	}

	/**
	 * Stretches button in specified dimension(s). Pure CSS attribute.
	 * Valid values: see {@link STRETCHES}
	 */
	public set stretch(value: string | null | undefined) {
		this.setEnumHostAttributeOrRemove('stretch', value, Ch5ButtonBase.STRETCHES);
	}
	public get stretch(): string | null {
		return this.getAttribute('stretch');
	}

	/**
	 * Icon position relative to label. Pure CSS attribute - no JS logic.
	 * Valid values: see {@link ICON_POSITIONS}
	 */
	public set iconPosition(value: string) {
		this.setEnumHostAttribute('iconposition', value, Ch5ButtonBase.ICON_POSITIONS, Ch5ButtonBase.ICON_POSITIONS[0]);
	}
	public get iconPosition(): string {
		return this.getAttribute('iconposition') || Ch5ButtonBase.ICON_POSITIONS[0];
	}

	/**
	 * Layout orientation of the icon + label group. Pure CSS attribute.
	 * Valid values: see {@link ORIENTATIONS}
	 */
	public set orientation(value: string) {
		this.setEnumHostAttribute('orientation', value, Ch5ButtonBase.ORIENTATIONS, Ch5ButtonBase.ORIENTATIONS[0]);
	}
	public get orientation(): string {
		return this.getAttribute('orientation') || Ch5ButtonBase.ORIENTATIONS[0];
	}

	/**
	 * Horizontal alignment of icon + label group within button. Pure CSS attribute.
	 * Valid values: see {@link H_ALIGN_LABELS}
	 */
	public set hAlignLabel(value: string) {
		this.setEnumHostAttribute('halignlabel', value, Ch5ButtonBase.H_ALIGN_LABELS, Ch5ButtonBase.H_ALIGN_LABELS[0]);
	}
	public get hAlignLabel(): string {
		return this.getAttribute('halignlabel') || Ch5ButtonBase.H_ALIGN_LABELS[0];
	}

	/**
	 * Vertical alignment of icon + label group within button. Pure CSS attribute.
	 * Valid values: see {@link V_ALIGN_LABELS}
	 */
	public set vAlignLabel(value: string) {
		this.setEnumHostAttribute('valignlabel', value, Ch5ButtonBase.V_ALIGN_LABELS, Ch5ButtonBase.V_ALIGN_LABELS[0]);
	}
	public get vAlignLabel(): string {
		return this.getAttribute('valignlabel') || Ch5ButtonBase.V_ALIGN_LABELS[0];
	}

	/**
	 * Button type variant. Pure CSS attribute - no JS logic, just styling.
	 * Can be overridden by receiveStateType signal via data-signal-type channel.
	 * Valid values: see {@link TYPES}
	 */
	public set type(value: string) {
		this.setEnumHostAttribute('type', value, Ch5ButtonBase.TYPES, Ch5ButtonBase.TYPES[0]);
	}
	public get type(): string {
		return this.getAttribute('type') || Ch5ButtonBase.TYPES[0];
	}

	/**
	 * Static selected state. Pure CSS attribute - no JS logic, just styling.
	 * Can be overridden by receiveStateSelected signal via data-signal-selected channel.
	 * Setter accepts: `true`, `'true'`, `1`, `'1'`, and `''` as true.
	 * Any other value is normalized to false.
	 */
	public set selected(value: boolean | string | number | null | undefined) {
		const isSelected = value === true || value === 'true' || value === 1 || value === '1' || value === '';
		this.setAttribute('selected', isSelected ? 'true' : 'false');
	}
	public get selected(): boolean {
		const attr = this.getAttribute('selected');
		if (attr === null) return false;
		return attr.toLowerCase() === 'true' || attr === '1' || attr === '';
	}

	/**
	 * Shows checkbox glyph on the button. Pure CSS attribute.
	 * Setter accepts: `true`, `'true'`, `1`, `'1'`, and `''` as true.
	 * Any other value is normalized to false.
	 */
	public set checkboxShow(value: boolean | string | number | null | undefined) {
		const isChecked = value === true || value === 'true' || value === 1 || value === '1' || value === '';
		this.setAttribute('checkboxshow', isChecked ? 'true' : 'false');
	}
	public get checkboxShow(): boolean {
		const attr = this.getAttribute('checkboxshow');
		if (attr === null) return false;
		return attr.toLowerCase() === 'true' || attr === '1' || attr === '';
	}

	/**
	 * Checkbox position relative to icon/label group. Pure CSS attribute.
	 * Valid values: see {@link CHECKBOX_POSITIONS}
	 */
	public set checkboxPosition(value: string) {
		this.setEnumHostAttribute('checkboxposition', value, Ch5ButtonBase.CHECKBOX_POSITIONS, Ch5ButtonBase.CHECKBOX_POSITIONS[0]);
	}
	public get checkboxPosition(): string {
		return this.getAttribute('checkboxposition') || Ch5ButtonBase.CHECKBOX_POSITIONS[0];
	}

	/**
	 * Fill type for iconUrl background image. Pure CSS attribute.
	 * Valid values: see {@link ICON_URL_FILL_TYPES}
	 * When attribute is absent, value is `null`.
	 */
	public set iconUrlFillType(value: string | null | undefined) {
		if (value === null || value === undefined) {
			this.removeAttribute('iconurlfilltype');
			return;
		}
		this.setEnumHostAttributeOrRemove('iconurlfilltype', value, Ch5ButtonBase.ICON_URL_FILL_TYPES);
	}
	public get iconUrlFillType(): string | null {
		return this.getAttribute('iconurlfilltype');
	}

	/**
	 * Fill type for backgroundImageUrl. Pure CSS attribute.
	 * Valid values: see {@link BACKGROUND_IMAGE_URL_FILL_TYPES}
	 */
	public set backgroundImageFillType(value: string) {
		this.setEnumHostAttribute('backgroundImageFillType', value, Ch5ButtonBase.BACKGROUND_IMAGE_URL_FILL_TYPES, Ch5ButtonBase.BACKGROUND_IMAGE_URL_FILL_TYPES[0]);
	}
	public get backgroundImageFillType(): string {
		return this.getAttribute('backgroundImageFillType') || Ch5ButtonBase.BACKGROUND_IMAGE_URL_FILL_TYPES[0];
	}

	/**
	 * Polymorphic accessor for the concrete subclass's own static members (e.g.
	 * `ELEMENT_NAME` / `PRIMARY_CSS_CLASS`), so shared base-class code always uses
	 * the actual registered subclass's identity instead of this base's defaults.
	 * Mirrors `Ch5AdvancedButtonBase`'s instance-level `ELEMENT_NAME` /
	 * `primaryCssClass` fields, but keeps them as proper STATIC members (so
	 * `Ch5Button.ELEMENT_NAME` etc. keep working for external callers) by reading
	 * them off `this.constructor` instead.
	 */
	protected get ctor(): typeof Ch5ButtonBase {
		return this.constructor as typeof Ch5ButtonBase;
	}

	//#endregion

	//#region Component Lifecycle

	public constructor(buttonListContractObj?: ICh5ButtonListContractObj) {
		super();
		// Register this component's attributes on the SHARED property store from
		// Ch5LightBaseClass, using the static PROPERTY_SETTINGS (no per-instance alloc).
		this._ch5Properties.add(Ch5ButtonBase.PROPERTY_SETTINGS);
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
				if (this.receiveStateLabel || this.receiveStateScriptLabelHtml) {
					break;
				}
				this.label = newValue ?? '';
				break;
			case 'labelinnerhtml':
				this.labelInnerHTML = newValue ?? '';
				break;
			case 'iconclass':
				if (this.receiveStateIconClass) {
					break;
				}
				this.iconClass = newValue ?? '';
				break;
			case 'iconurl':
				if (this.receiveStateIconUrl) {
					break;
				}
				this.iconUrl = newValue ?? '';
				break;
			case 'backgroundimageurl':
				if (this.receiveStateBackgroundImageUrl) {
					break;
				}
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
			case 'size':
			case 'shape':
			case 'stretch':
			case 'orientation':
				// Pure-CSS attributes with no property-store slot: only their rendered
				// dimensions matter here, so just re-measure - covers both setAttribute()
				// and the JS property setter (which also writes the attribute).
				this.scheduleDimensionDependentRefit();
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
	 * `ch5-advanced-button` declares the flag on its signal attribute registry
	 * entries. Returning the static array keeps the contract path zero-per-instance,
	 * and is only read when a `contractname` attribute is actually present.
	 */
	protected getContractPropertySettings(): readonly ICh5LightPropertySettings[] {
		return Ch5ButtonBase.PROPERTY_SETTINGS;
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

		// Apply join offsets to template child elements (if any). Zero-cost when absent
		// (early exit in applyJoinOffsets when no offsets and no contract). Called after
		// super.connectedCallback() so contractname is resolved, and after internal HTML
		// creation so any child templates are present. Idempotent on reconnect.
		this.applyJoinOffsets();

		// (Re)measure the multi-line clamp now the button is on-DOM (height is
		// unreadable off-DOM). No-op unless multilineSupport is on; scheduled so the
		// read lands after connect-time mutations settle.
		if (this.multilineSupport) {
			this.scheduleFitEllipsisForMultiline();
		}
		this.scheduleVerticalInnerButtonFit();

		customElements.whenDefined(this.ctor.ELEMENT_NAME).then(() => {
			// Run the same deferred-on-connect fit pass after CE registration settles.
			if (this.multilineSupport) {
				this.scheduleFitEllipsisForMultiline();
			}
			this.scheduleVerticalInnerButtonFit();
			this.componentLoadedEvent(this.ctor.ELEMENT_NAME, this.id);
		});
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
		if (this._pendingVerticalFitHandle !== null) {
			window.cancelAnimationFrame(this._pendingVerticalFitHandle);
			this._pendingVerticalFitHandle = null;
		}
		// Stop any in-flight contract hold timer.
		this.clearButtonListContractHold();
		// Let the base release its own opt-in subscription (receiveStateEnable).
		super.disconnectedCallback();
		this.logStop();
	}

	//#endregion

	//#region Private Methods

	/**
	 * Sets an enum-backed host attribute with predictable fallback behavior.
	 * - exact valid string value     => set as-is
	 * - empty string                 => set explicit default value
	 * - null/undefined/non-string    => set explicit default value
	 * - any other string             => set explicit default value
	 */
	private setEnumHostAttribute(attributeName: string, value: unknown, validValues: readonly string[], defaultValue: string): void {
		if (typeof value !== 'string') {
			this.setAttribute(attributeName, defaultValue);
			return;
		}

		this.setAttribute(attributeName, validValues.indexOf(value) >= 0 ? value : defaultValue);
	}

	/**
	 * Sets an enum-backed host attribute only when valid; otherwise removes it.
	 * Used by strict CSS attributes where junk input should not remain on DOM.
	 */
	private setEnumHostAttributeOrRemove(attributeName: string, value: unknown, validValues: readonly string[]): void {
		if (typeof value !== 'string' || validValues.indexOf(value) < 0) {
			this.removeAttribute(attributeName);
			return;
		}
		this.setAttribute(attributeName, value);
	}

	/**
	 * Keeps a host attribute in sync with a runtime string value while skipping
	 * redundant DOM mutations (and the attributeChangedCallback work they trigger).
	 */
	private syncHostStringAttribute(attributeName: string, value: string): void {
		if (value) {
			if (this.getAttribute(attributeName) !== value) {
				this.setAttribute(attributeName, value);
			}
		} else if (this.hasAttribute(attributeName)) {
			this.removeAttribute(attributeName);
		}
	}

	private createInternalHtml() {
		this.log('createInternalHtml()');
		this.clearComponentContent();

		// clearComponentContent() detached the old children, so null the cached label/icon
		// refs to force handleLabel()/handleIcon() to recreate them in the new button.
		this._elSpanLabel = null;
		this._elIcon = null;

		this._elContainer = this;
		this._elContainer.classList.add(this.ctor.PRIMARY_CSS_CLASS);

		// Create the button OFF-DOM; the handlers add the icon/label while it is detached,
		// and connectedCallback appends the whole subtree to the host once.
		this._elButton = document.createElement('button');
		this._elButton.className = `${this.ctor.PRIMARY_CSS_CLASS}--btn`;
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
		// outranks the static sources below it. Mirrors ch5-advanced-button / ch5-text.
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
				this._elSpanLabel.className = `${this.ctor.PRIMARY_CSS_CLASS}--label`;
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
	 * is written into the label span. Mirrors ch5-advanced-button / ch5-text exactly.
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
		const p = this.ctor.PRIMARY_CSS_CLASS;
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
	 * Schedules a single vertical-size fit for the internal button. This is only
	 * needed because transform rotation does not participate in layout, and costs
	 * one coalesced frame at connect time.
	 */
	private scheduleVerticalInnerButtonFit(): void {
		if (this._pendingVerticalFitHandle !== null) {
			return;
		}
		this._pendingVerticalFitHandle = window.requestAnimationFrame(this._fitVerticalFrame);
	}

	/**
	 * Re-measures the multiline clamp + vertical inner-button size after a pure-CSS
	 * attribute (`size`/`shape`/`stretch`/`orientation`) that can resize the rendered
	 * button changes post-connect - those setters don't go through
	 * attributeChangedCallback/handleLabel, so nothing else would catch the resize.
	 * No-op off-DOM (nothing to measure until connectedCallback runs its own pass).
	 */
	private scheduleDimensionDependentRefit(): void {
		if (!this.isConnected) {
			return;
		}
		if (this.multilineSupport) {
			this.scheduleFitEllipsisForMultiline();
		}
		this.scheduleVerticalInnerButtonFit();
	}

	/**
	 * Mirrors ch5-advanced-button verticalOrientationHandler sizing for the light
	 * button without observers/listeners. For vertical non-circle buttons, set
	 * inner width/height from the host footprint so rotated content fully fills it.
	 */
	private fitVerticalInnerButtonSize(): void {
		const button = this._elButton;
		if (!button || !button.isConnected) {
			return;
		}

		if (this.orientation !== 'vertical' || this.shape === 'circle') {
			button.style.removeProperty('width');
			button.style.removeProperty('height');
			return;
		}

		const hostHeight = this.clientHeight;
		const hostWidth = this.clientWidth;
		if (hostHeight > 0 && hostWidth > 0) {
			button.style.width = `${hostHeight}px`;
			button.style.height = `${hostWidth}px`;
		}
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
				this._elIcon.className = `${this.ctor.PRIMARY_CSS_CLASS}--img`;
				this._elIcon.style.backgroundImage = `url("${iconUrl}")`;
			} else {
				// Fall back to the icon font class.
				this._elIcon.className = `${this.ctor.PRIMARY_CSS_CLASS}--icon ${iconClass}`;
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
		if (!signalName) {
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
			this.clearSignalChannel(Ch5ButtonBase.SIGNAL_ATTRIBUTE_TYPE);
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
		const type = Ch5ButtonBase.TYPES.indexOf(value) >= 0 ? value : Ch5ButtonBase.TYPES[0];
		this.setAttribute(Ch5ButtonBase.SIGNAL_ATTRIBUTE_TYPE, type);
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
			this.clearSignalChannel(Ch5ButtonBase.SIGNAL_ATTRIBUTE_SELECTED);
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
		this.setAttribute(Ch5ButtonBase.SIGNAL_ATTRIBUTE_SELECTED, value ? 'true' : 'false');
	}

	/**
	 * Reacts to a `receivestatelabel` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when a
	 * name is set and connected. While bound, signal priority is strict (even empty),
	 * so the effective `label` slot is reset to empty until signal data arrives.
	 */
	private handleReceiveStateLabel(oldSignalName: string): void {
		this.log('handleReceiveStateLabel(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateLabel) {
			// Enforce strict signal priority immediately, even before first publish.
			this._ch5Properties.set<string>('label', '', this._onLabelChange);
			if (this.isConnected) {
				this.subscribeReceiveStateLabel();
			}
		} else {
			// Signal removed: restore the static label reflected on the element.
			this._ch5Properties.set<string>('label', this.getAttribute('label') ?? '', this._onLabelChange);
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
	 * Writes a signal-delivered label into the effective `label` slot (rendered by
	 * {@link handleLabel}). Empty values are preserved so signal priority stays strict.
	 * The host `label` attribute is kept aligned with the signal-delivered value, and
	 * the store's equality check skips redundant re-renders.
	 */
	private applySignalLabel(value: string): void {
		this.log('applySignalLabel(', value, ')');
		const label = value ?? '';
		this.syncHostStringAttribute('label', label);
		this._ch5Properties.set<string>('label', label, this._onLabelChange);
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
		const html = value ?? '';
		this.scriptLabelHtml = html;
		// Keep a host-side label mirror for external observers/tooling while
		// receiveStateScriptLabelHtml remains the effective source in render priority.
		this.syncHostStringAttribute('label', html);
	}

	/**
	 * Reacts to a `receivestateiconclass` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when a
	 * name is set and connected. Removal is design-time, so the last value stays in the `iconClass` slot.
	 */
	private handleReceiveStateIconClass(oldSignalName: string): void {
		this.log('handleReceiveStateIconClass(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateIconClass) {
			// Enforce strict signal priority immediately, even before first publish.
			this._ch5Properties.set<string>('iconClass', '', this._onIconChange);
			if (this.isConnected) {
				this.subscribeReceiveStateIconClass();
			}
		} else {
			// Signal removed: restore the static icon class reflected on the element.
			this._ch5Properties.set<string>('iconClass', this.getAttribute('iconClass') ?? '', this._onIconChange);
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
	 * The host attribute is also kept in sync with the signal-delivered value.
	 */
	private applySignalIconClass(value: string): void {
		this.log('applySignalIconClass(', value, ')');
		const iconClass = value ?? '';
		this.syncHostStringAttribute('iconClass', iconClass);
		this._ch5Properties.set<string>('iconClass', iconClass, this._onIconChange);
	}

	/**
	 * Reacts to a `receivestateiconurl` name change (`oldSignalName` = previous name,
	 * for unsubscription): tears down the old subscription, then (re)subscribes when a
	 * name is set and connected. Removal is design-time, so the last value stays in the `iconUrl` slot.
	 */
	private handleReceiveStateIconUrl(oldSignalName: string): void {
		this.log('handleReceiveStateIconUrl(', oldSignalName, ')');
		this.clearSignalSubscription(oldSignalName);

		if (this.receiveStateIconUrl) {
			// Enforce strict signal priority immediately, even before first publish.
			this._ch5Properties.set<string>('iconUrl', '', this._onIconChange);
			if (this.isConnected) {
				this.subscribeReceiveStateIconUrl();
			}
		} else {
			// Signal removed: restore the static icon URL reflected on the element.
			this._ch5Properties.set<string>('iconUrl', this.getAttribute('iconUrl') ?? '', this._onIconChange);
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
	 * (receivestateiconurl > receivestateiconclass > iconurl > iconclass). The host
	 * `iconurl` attribute is also kept in sync with the signal-delivered value.
	 */
	private applySignalIconUrl(value: string): void {
		this.log('applySignalIconUrl(', value, ')');
		const iconUrl = value ?? '';
		this.syncHostStringAttribute('iconUrl', iconUrl);
		this._ch5Properties.set<string>('iconUrl', iconUrl, this._onIconChange);
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

		if (this.receiveStateBackgroundImageUrl) {
			// Enforce strict signal priority immediately, even before first publish.
			this._ch5Properties.set<string>('backgroundImageUrl', '', this._onBackgroundImageChange);
			if (this.isConnected) {
				this.subscribeReceiveStateBackgroundImageUrl();
			}
		} else {
			// Signal removed: restore the static background URL reflected on the element.
			this._ch5Properties.set<string>('backgroundImageUrl', this.getAttribute('backgroundImageUrl') ?? '', this._onBackgroundImageChange);
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
		this.syncHostStringAttribute('backgroundimageurl', url);
		this._ch5Properties.set<string>('backgroundImageUrl', url, this._onBackgroundImageChange);
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
		// signals instead of sendEventOnClick (mirrors Ch5AdvancedButton).
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
	 * Ch5AdvancedButton's button-list path: Button{n}ItemPress on press/release,
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
	 * Sends the initial `true` on press, then—only if the button is still held past
	 * `REPEAT_DIGITAL_HOLD_DELAY`—retriggers it every `REPEAT_DIGITAL_PERIOD` ms
	 * (mirrors ch5-advanced-button: a quick tap sends a single true, a hold repeats).
	 * No-op (nothing allocated) unless a `sendeventonclick` signal name is set.
	 */
	private startClickRepeatDigital(): void {
		if (!this.sendEventOnClick) {
			return;
		}
		this.sendClickValue(true);
		this._repeatDigitalTimer = window.setTimeout(this._repeatDigitalTick, Ch5ButtonBase.REPEAT_DIGITAL_HOLD_DELAY);
	}

	/**
	 * Ends the press cycle: if a `true` was sent (timer armed), cancel the pending tick
	 * and send the final `false`. Safe to call when nothing was running.
	 */
	private stopClickRepeatDigital(): void {
		if (this._repeatDigitalTimer === null) {
			return;
		}
		window.clearTimeout(this._repeatDigitalTimer);
		this._repeatDigitalTimer = null;
		this.sendClickValue(false);
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

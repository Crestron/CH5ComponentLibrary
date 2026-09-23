import { Ch5Uid, Ch5Signal, publishEvent, Ch5TranslationUtility, languageChangedSignalName } from "../ch5-core";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log";
import { Ch5LightProperties, ICh5LightPropertySettings } from "./ch5-light-properties";
import { Ch5LightSignal } from "./ch5-light-signal";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5LightShowType } from "./interfaces/t-ch5-light-base";
import { Ch5Config } from "../ch5-common/ch5-config";

export type { TCh5LightShowType };

/**
 * Lightweight base class for the "light" family of Ch5 components
 * (e.g. `ch5-button`).
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
 * two lightweight host CSS classes (`ch5-hide-dis` /
 * `ch5-hide-vis`); for `remove` it detaches the host from the DOM.
 * The two hide classes must be shipped in the theme.
 *
 * `disabled` is styled entirely from CSS via the host `[disabled]` attribute
 * selector — the STATIC attribute needs no JS and is never mutated by this class.
 *
 * `receiveStateEnable` is a **strictly opt-in** boolean receive signal and one
 * of only two signals the base itself supports. It costs nothing when absent: no
 * signal helper, subscription or closure is created unless the attribute is
 * present (the `Ch5LightSignal` helper is created lazily on first subscribe), so
 * 1000+ signal-free instances pay zero. A signal value of `true` enables the
 * host, `false` disables it. Mirroring the light button's `type` / `selected`
 * signals, the resolved state is written to a SEPARATE `data-signal-enable`
 * channel (never to the author's `disabled`); the theme CSS guards the static
 * `[disabled]` rule with `:not([data-signal-enable])` and styles
 * `[data-signal-enable="false"]` as disabled, so the signal takes **absolute
 * priority** over a static `disabled` (even if the author toggles it at runtime)
 * while the author's own `disabled` attribute is preserved and restored the
 * moment the signal is removed. The subscription is torn down on disconnect and
 * re-established on reconnect.
 *
 * `receiveStateShow` is the base's second **strictly opt-in** boolean receive
 * signal (same zero-cost-when-absent rules, reusing the same lazy helper). A
 * signal value of `true` shows the host, `false` hides it, honouring the current
 * `noshowtype` mode exactly like the static `show` attribute (it drives the same
 * `handleShow()` path — `display` / `visibility` CSS classes or DOM `remove`).
 * Unlike `receiveStateEnable`, `show` is a JS-driven state (not a pure-CSS one),
 * so the signal writes the effective value straight into the `show` property
 * store rather than to a separate channel — and while the signal is bound it has
 * **priority over the static `show` attribute** (direct `show` writes are
 * ignored, mirroring `Ch5Common`). The author's `show` attribute is never
 * mutated, so clearing the signal restores it. The subscription is torn down on
 * disconnect and re-established on reconnect.
 *
 * `sendEventOnShow` is the base's first **strictly opt-in** boolean SEND (event)
 * signal, the outbound counterpart of `receiveStateShow` (mirrors
 * `Ch5Common.sendEventOnShow`). When set, the host PUBLISHES its current show
 * state — `true` when shown, `false` when hidden — whenever the show state is
 * (re)applied through {@link handleShow}, regardless of what drove the change
 * (static `show`, `receiveStateShow`, or a programmatic write). It is stateless
 * and zero-cost when absent: nothing is published or allocated unless the
 * attribute is present, and publishing reuses the same lazy `Ch5LightSignal`
 * helper (`sendBoolean` publishes a plain boolean, not a repeat-digital object).
 * Being stateless there is nothing to unsubscribe on disconnect.
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
 * `Ch5Config`-based pre-configured attributes (`setAttributeForComponent` /
 * `setAttributeForId`) are applied once in {@link initLightBaseAttributes}, mirroring
 * `Ch5Common`. Gated by `Ch5Config.hasAttributesForElement`, an allocation-free
 * `hasOwnProperty` check, so the common case (nothing ever configured) costs no
 * object allocation - only components with an actual pre-configured attribute pay
 * for `getAttributesForElement`'s lookup/spread.
 *
 * Derived components must:
 *  - merge `LIGHT_BASE_OBSERVED_ATTRIBUTES` into their static `observedAttributes`;
 *  - call `super.attributeChangedCallback(...)` for attributes they do not handle;
 *  - call `super.connectedCallback()` (after building their internal DOM) so the
 *    base attributes are applied and overridden handlers can reach child nodes.
 *
 * See ../ch5-button/ch5-button.md for the full design reference
 * (class hierarchy, extension playbook, GC/allocation rules) covering this
 * base class and its first concrete implementation, `Ch5Button`. Update
 * that document alongside any change to this base class's public contract.
 */
export abstract class Ch5LightBaseClass extends HTMLElement {

	//#region Constants

	/** Valid `noshowtype` values, in the same order as `Ch5BaseClass` (default first). */
	public static readonly NO_SHOW_TYPES: readonly TCh5LightShowType[] = ['display', 'visibility', 'remove'];

	/** Host CSS class that hides the element via `display:none` (shipped in the theme). */
	public static readonly HIDE_DISPLAY_CSS_CLASS = 'ch5-hide-dis';

	/** Host CSS class that hides the element via `visibility:hidden` (shipped in the theme). */
	public static readonly HIDE_VISIBILITY_CSS_CLASS = 'ch5-hide-vis';

	/**
	 * Property settings for the shared `_ch5Properties` store. STATIC so the array
	 * is built once per class, not per instance (avoids N allocations at scale).
	 * Safe to share: `Ch5LightProperties` only reads `name`/`default` from each entry
	 * during construction and never retains or mutates the array.
	 *
	 * Join type metadata (direction, booleanJoin, etc.) is also defined here for
	 * signal attributes - single source of truth. Derived classes use
	 * getBaseSignalAttributeEntries() to merge base signal registrations with their own.
	 */
	private static readonly LIGHT_BASE_PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		{ name: 'show', default: true, type: 'boolean', valueOnAttributeEmpty: true },
		{
			name: 'noshowType',
			default: Ch5LightBaseClass.NO_SHOW_TYPES[0],
			type: 'enum',
			enumeratedValues: [...Ch5LightBaseClass.NO_SHOW_TYPES]
		},
		{ name: 'receiveStateEnable', default: '', type: 'string', contractName: true, direction: 'state', booleanJoin: 1 },
		{ name: 'receiveStateShow', default: '', type: 'string', contractName: true, direction: 'state', booleanJoin: 1 },
		{ name: 'sendEventOnShow', default: '', type: 'string', contractName: true, direction: 'event', booleanJoin: 1 },
		// Contract and join offset attributes - these are metadata for template processing, not signals themselves
		// Include registry metadata so they auto-generate in getBaseSignalAttributeEntries()
		{ name: 'contractName', default: '', type: 'string', contractName: true },
		{ name: 'booleanJoinOffset', default: 0, type: 'number', booleanJoin: 1 },
		{ name: 'numericJoinOffset', default: 0, type: 'number', numericJoin: 1 },
		{ name: 'stringJoinOffset', default: 0, type: 'number', stringJoin: 1 },
		// Diagnostic flags added for auto-generation of observed attributes
		{ name: 'debug', default: false, type: 'boolean' },
		{ name: 'trace', default: false, type: 'boolean' }
	];

	/**
	 * Attributes handled by this base class. A derived component must merge this
	 * list with its own in its static `observedAttributes` getter.
	 * Auto-generated from LIGHT_BASE_PROPERTY_SETTINGS - single source of truth.
	 *
	 * `class`, `style` and `dir` are NOT listed: they are standard, natively
	 * reflected HTML attributes and work directly on the host with no JS.
	 */
	public static readonly LIGHT_BASE_OBSERVED_ATTRIBUTES = Ch5LightBaseClass.LIGHT_BASE_PROPERTY_SETTINGS.map(
		setting => setting.name.replace(/([A-Z])/g, match => match.toLowerCase()).toLowerCase()
	);

	/**
	 * Separate styling channel the `receiveStateEnable` signal writes to (never the
	 * author's `disabled`), mirroring the light button's `data-signal-type` /
	 * `data-signal-selected`. MUST stay in sync with the theme SCSS, which guards the
	 * static `[disabled]` rule with `:not([data-signal-enable])` and styles
	 * `[data-signal-enable="false"]` as disabled.
	 */
	public static readonly SIGNAL_ATTRIBUTE_ENABLE = 'data-signal-enable';

	/** Shared empty settings list returned by the default {@link getContractPropertySettings} (no per-instance allocation). */
	private static readonly EMPTY_PROPERTY_SETTINGS: readonly ICh5LightPropertySettings[] = [];

	/**
	 * Shared helper that auto-generates registry entries from property settings.
	 * Extracts the common logic used by getBaseSignalAttributeEntries() and derived
	 * class registration methods to eliminate code duplication.
	 */
	private static generateRegistryEntriesFromSettings(
		settings: readonly ICh5LightPropertySettings[],
		target: Ch5SignalElementAttributeRegistryEntries = {}
	): Ch5SignalElementAttributeRegistryEntries {
		for (let i = 0; i < settings.length; i++) {
			const setting = settings[i];
			// Only register if it has join type metadata (direction, booleanJoin, numericJoin, stringJoin, or contractName flag)
			if (setting.direction || setting.booleanJoin || setting.numericJoin || setting.stringJoin || setting.contractName) {
				const attrName = setting.name.replace(/([A-Z])/g, (match) => match.toLowerCase()).toLowerCase();
				target[attrName] = {
					direction: setting.direction,
					booleanJoin: setting.booleanJoin,
					numericJoin: setting.numericJoin,
					stringJoin: setting.stringJoin,
					contractName: setting.contractName
				};
			}
		}
		return target;
	}

	/**
	 * Returns base signal attribute registry entries auto-generated from
	 * LIGHT_BASE_PROPERTY_SETTINGS. Derived classes should call this and merge the
	 * result with their own signal attribute entries when registering with
	 * Ch5SignalAttributeRegistry. Follows the DRY pattern implemented in ch5-button.
	 */
	public static getBaseSignalAttributeEntries(): Ch5SignalElementAttributeRegistryEntries {
		return Ch5LightBaseClass.generateRegistryEntriesFromSettings(
			Ch5LightBaseClass.LIGHT_BASE_PROPERTY_SETTINGS
		);
	}

	/**
	 * Registers the default join-offset / contract-name attribute entries for a
	 * light-family component so the subpage-reference carrier
	 * (`Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs`) will propagate its
	 * `booleanjoinoffset` / `numericjoinoffset` / `stringjoinoffset` / `contractname`
	 * onto this element when it appears inside a `<ch5-template>` widget. Mirrors
	 * `Ch5Common.registerSignalAttributeDefaults` so a light button behaves like the
	 * heavy `ch5-advanced-button` for offset propagation, WITHOUT pulling in any of
	 * the `Ch5Common` machinery. Concrete light buttons (e.g. `ch5-button`) call this
	 * alongside `registerSignalAttributeTypes()`. Scoped to the light-button family:
	 * it only adds a registry entry for the given element and does not alter the
	 * shared differentiation utility or any other component.
	 */
	public static registerSignalAttributeDefaults(componentName: string): void {
		Ch5SignalAttributeRegistry.instance.addElementDefaultAttributeEntries(componentName, {
			contractName: { attributes: ["contractname"], defaultValue: "" },
			booleanJoin: { attributes: ["booleanjoinoffset"], defaultValue: "0" },
			numericJoin: { attributes: ["numericjoinoffset"], defaultValue: "0" },
			stringJoin: { attributes: ["stringjoinoffset"], defaultValue: "0" }
		});
	}

	/** Matches `{{indexId}}`-style placeholders, stripped before the integer-signal test in {@link prependContractName}. */
	private static readonly CONTRACT_MOUSTACHE_RE = /({{[\w-]+}})/g;

	/** Join offset attribute names (lowercase HTML form) for loop-based parsing. */
	private static readonly JOIN_OFFSET_ATTRS = ['booleanjoinoffset', 'numericjoinoffset', 'stringjoinoffset'];
	/** Join offset property names (camelCase JS form) for loop-based storage. */
	private static readonly JOIN_OFFSET_PROPS = ['booleanJoinOffset', 'numericJoinOffset', 'stringJoinOffset'];



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
	// Ch5Button) - created ONCE per instance so repeated `show`/`noshowType`
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

	// --- receiveStateShow signal wiring (opt-in) ------------------------------
	// The base's second signal. Reuses the SAME lazy `_baseSignals` helper as
	// receiveStateEnable (keyed by signal name, so both can coexist). Strictly
	// opt-in: nothing is allocated unless a `receivestateshow` attribute is present.
	// Cached name-change callback (created ONCE per instance); the NAME lives in the
	// `_ch5Properties` store, so `set()` hands this callback the OLD name straight
	// away for clean unsubscription - no dedicated field needed.
	private readonly _onReceiveStateShowChange = (oldSignalName: string) => this.handleReceiveStateShow(oldSignalName);
	// Cached value callback (created ONCE per instance) so repeated (re)subscribes
	// never allocate a new closure. Drives the same `handleShow()` path as the
	// static `show` attribute, so `noshowtype` is honoured identically.
	private readonly _onSignalShowValue = (value: boolean) => this.applyShowSignal(value);
	// True only after the active receiveStateShow signal has delivered at least
	// one value. sendEventOnShow is gated by this so static/init show handling
	// does not publish before a receive-state value exists.
	private _hasReceiveStateShowValue = false;

	// --- sendEventOnShow signal wiring (opt-in) -------------------------------
	// The base's only outbound (event) signal. Stateless: the signal NAME lives in
	// the `_ch5Properties` store and publishing goes through `sendBoolean` on the
	// shared lazy `_baseSignals` helper, so there is no subscription, no listener
	// and nothing to tear down. Nothing is allocated or published unless a
	// `sendeventonshow` attribute is present. No cached name-change callback is
	// needed - setting the name has no side effect (publishing is driven by show
	// changes via handleShow), so the setter stores the name with no onChange.

	// Current language for each component
	public currentLanguage: string | null = '';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public translatableObjects: any = {} as any;

	//#endregion

	//#region Getters and Setters

	public set show(value: boolean) {
		// `receiveStateShow`, when bound, has priority over the static `show`
		// attribute (mirrors `Ch5Common`): while the show signal is driving the host,
		// direct `show` writes (attribute or programmatic) are ignored so they cannot
		// fight the signal. Clearing the signal restores the author's `show`.
		// Use BOTH the stored property and raw attribute presence so initial
		// attributeChangedCallback ordering cannot leak static `show` into the
		// effective state before `receiveStateShow` is synced.
		if (this.receiveStateShow || this.hasAttribute('receivestateshow')) {
			return;
		}
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
	 * Static disabled state. Pure CSS attribute owned by the light base.
	 * Can be overridden by receiveStateEnable via data-signal-enable channel.
	 * Setter accepts: `true`, `'true'`, `1`, `'1'`, and `''` as true.
	 * Any other value is normalized to false.
	 */
	public set disabled(value: boolean | string | number | null | undefined) {
		const isDisabled = value === true || value === 'true' || value === 1 || value === '1' || value === '';
		this.setAttribute('disabled', isDisabled ? 'true' : 'false');
	}
	public get disabled(): boolean {
		const attr = this.getAttribute('disabled');
		if (attr === null) {
			return false;
		}
		return attr.toLowerCase() === 'true' || attr === '1' || attr === '';
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

	/**
	 * Name of a Crestron **boolean** signal that shows/hides the host
	 * (`true` = shown, `false` = hidden), mirroring `Ch5Common.receiveStateShow`.
	 * The resolved value is written straight into the `show` property store and
	 * applied through {@link handleShow}, so it honours the current `noshowtype`
	 * mode (display / visibility / remove) exactly like the static `show`
	 * attribute. While bound, it has **priority over the static `show` attribute**
	 * (direct `show` writes are ignored); the author's `show` attribute is never
	 * mutated, so clearing the signal restores it. **Strictly opt-in and zero-cost
	 * when absent.**
	 *
	 * The name is stored in the shared `_ch5Properties` store (same pattern as
	 * `receiveStateEnable`); `_ch5Properties.set()` passes the OLD name straight to
	 * the cached `_onReceiveStateShowChange` callback, which hands it to
	 * {@link handleReceiveStateShow} for unsubscription - no extra field, no closure
	 * allocated per call.
	 */
	public set receiveStateShow(value: string) {
		this._ch5Properties.set<string>('receiveStateShow', value ?? '', this._onReceiveStateShowChange);
	}
	public get receiveStateShow(): string {
		return this._ch5Properties.get<string>('receiveStateShow');
	}

	/**
	 * Name of a Crestron **boolean** signal that the host PUBLISHES its show state
	 * to (`true` when shown, `false` when hidden), mirroring
	 * `Ch5Common.sendEventOnShow`. It is the outbound counterpart of
	 * `receiveStateShow`: whenever the show state is (re)applied through
	 * {@link handleShow} the current value is published via {@link sendShowSignal}.
	 * **Strictly opt-in and zero-cost when absent** (no publish, no helper).
	 *
	 * The name is simply stored in the shared `_ch5Properties` store for the
	 * equality short-circuit; unlike the receive signals it needs NO change
	 * callback, because setting the name has no side effect - the value is only
	 * ever published from the show-handling path, so `set()` is called without an
	 * `onChange` (nothing allocated per write).
	 */
	public set sendEventOnShow(value: string) {
		this._ch5Properties.set<string>('sendEventOnShow', value ?? '');
	}
	public get sendEventOnShow(): string {
		return this._ch5Properties.get<string>('sendEventOnShow');
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

		// Reuses the same lazy helper as the receiveState* signals (keyed by name, so they coexist).
		(this._baseSignals ??= new Ch5LightSignal()).subscribe<string>(languageChangedSignalName, 'string', (newValue: string) => {
			if (newValue !== '' && newValue !== this.currentLanguage) {
				this.currentLanguage = newValue;
				Object.keys(this.translatableObjects).forEach((propertyToTranslate: string) => {
					let propertyReference: { [key: string]: string } = this as {};

					if (propertyReference[propertyToTranslate as string] === undefined && propertyReference['attrModel' as string] !== undefined) {
						propertyReference = propertyReference['attrModel' as string] as {};
					}

					if (propertyReference[propertyToTranslate.toString()] !== undefined && this.translatableObjects[propertyToTranslate.toString()] !== undefined) {
						propertyReference[propertyToTranslate.toString()] = this.translatableObjects[propertyToTranslate];
						this.translateCallback(propertyToTranslate.toString());
					}
				})
			}
		});
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
		// Resolve the opt-in `contractname` contract, if any, BEFORE subscribing so
		// the store holds the contract-prefixed signal names (no-op when absent).
		this.applyContractName();
		// Subscribe the opt-in base signals (each a no-op when its attribute is absent).
		this.subscribeReceiveStateEnable();
		this.subscribeReceiveStateShow();
	}

	public attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		switch (attr) {
			case 'show':
				this.show = this.coerceBooleanAttribute('show', true);
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
			case 'receivestateshow':
				this.receiveStateShow = newValue ?? '';
				break;
			case 'sendeventonshow':
				this.sendEventOnShow = newValue ?? '';
				break;
			case 'contractname':
			case 'booleanjoinoffset':
			case 'numericjoinoffset':
			case 'stringjoinoffset':
				// Join offset attributes are read once in initLightBaseAttributes and
				// stored in _ch5Properties. Runtime changes are allowed but require the
				// concrete component to re-call applyJoinOffsets if it needs to reprocess
				// templates. Most components set these statically and never change them.
				break;
		}
	}

	/**
	 * Releases the opt-in `receiveStateEnable` / `receiveStateShow` subscriptions
	 * (if any) so a detached host holds no live listener; the signal NAMES are kept
	 * so a reconnect re-subscribes transparently. A derived component that overrides
	 * `disconnectedCallback` MUST call `super.disconnectedCallback()`. No-op (a
	 * single null check) for components not using either signal.
	 *
	 * A disconnect caused by our OWN `noshowtype="remove"` hide is deliberately NOT
	 * treated as a teardown: `applyHideState` sets `_isDetachedFromDom` before it
	 * detaches the host, so we bail out early and keep the subscriptions alive.
	 * Otherwise a `receiveStateShow="false"` would remove the host and immediately
	 * kill its own subscription, leaving no way for a later `true` to reattach it.
	 * On reattach (`applyShowState`) `connectedCallback` re-subscribes idempotently.
	 */
	public disconnectedCallback(): void {
		if (this._isDetachedFromDom) {
			return;
		}
		this._baseSignals?.unsubscribe(languageChangedSignalName);
		this.clearReceiveStateEnableSubscription(this.receiveStateEnable);
		this.clearReceiveStateShowSubscription(this.receiveStateShow);
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
	 * Publishes the standard native loaded event payload for this component,
	 * mirroring `Ch5Common.componentLoadedEvent` while keeping light components
	 * independent from `ch5-common` inheritance.
	 */
	protected componentLoadedEvent(elementName: string, idValue: string): void {
		publishEvent('object', elementName, { loaded: true, id: idValue });
	}

	/**
	 * Pre-connect safety net that keeps early logs from being silently dropped.
	 *
	 * Custom-element attribute reactions are BATCHED: all of an element's initial
	 * attributes are set on the DOM node before the first `attributeChangedCallback`
	 * runs, and every one of those callbacks runs before `connectedCallback` (where
	 * {@link initLightBaseAttributes} normally reads the flags). So for markup like
	 * `<ch5-button label="test" debug>` the `label` callback fires while the
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
	 * Applies pre-configured attributes (`Ch5Config.setAttributeForComponent` /
	 * `setAttributeForId`) to the host, same semantics as `Ch5Common`'s version.
	 * Gated by the allocation-free `hasAttributesForElement` check so the common
	 * case - nothing ever registered for this tag/id - costs a couple of
	 * `hasOwnProperty` lookups and nothing else (no object allocations), keeping
	 * 1000+ instances with no config zero-cost.
	 */
	protected applyPreConfiguredAttributes(): void {
		if (!Ch5Config.hasAttributesForElement(this)) {
			return;
		}
		const preConfiguredAttributes = Ch5Config.getAttributesForElement(this);
		for (const attrName in preConfiguredAttributes) {
			if (preConfiguredAttributes.hasOwnProperty(attrName)) {
				if (!this.hasAttribute(attrName)) {
					this.setAttribute(attrName, preConfiguredAttributes[attrName]);
				}
			}
		}
	}
	/**
	 * The default ARIA `role` for this component, or `null` when it has none.
	 *
	 * Overridden by concrete light components (e.g. `Ch5Button` returns
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
	 * The concrete component's STATIC property settings, so {@link applyContractName}
	 * can read the co-located `contractName: true` flags. Default returns a shared
	 * empty array; a component with signals (e.g. `Ch5Button`) overrides it to return
	 * its own STATIC settings, keeping the contract path zero-per-instance.
	 */
	protected getContractPropertySettings(): readonly ICh5LightPropertySettings[] {
		return Ch5LightBaseClass.EMPTY_PROPERTY_SETTINGS;
	}

	public _t(valueToTranslate: string) {
		let translatedValue = valueToTranslate;
		const translationUtility = Ch5TranslationUtility.getInstance();
		const identifiedValues = translationUtility.valuesToTranslation(valueToTranslate);

		if (identifiedValues && identifiedValues.length > 0) {
			identifiedValues.forEach(identifier => {
				const isTranslatable = translationUtility.isTranslationIdentifier(identifier);
				if (isTranslatable) {
					const characters = translationUtility.stripDownTranslationCharacters(identifier);
					const existTranslation = translationUtility.getTranslator().exists(characters);

					if (existTranslation) {
						const identifierTranslated = translationUtility.getTranslator().t(characters);
						translatedValue = translatedValue.replace(identifier, identifierTranslated);
					}
				}
			});
		}
		return translatedValue;
	}

	public _getTranslatedValue(valueToSave: string, valueToTranslate: string) {
		const translationUtility = Ch5TranslationUtility.getInstance();

		let translationKey = valueToTranslate;;
		let _value = valueToTranslate;
		let savedValue = this.translatableObjects[valueToSave];

		if (savedValue === valueToTranslate) {
			translationKey = savedValue;
		}

		const isTranslatableValue = translationUtility.isTranslationIdentifier(translationKey);

		if (!isTranslatableValue) {
			return valueToTranslate;
		}

		if (typeof savedValue === 'undefined') {
			savedValue = valueToTranslate;
			_value = this._t(valueToTranslate);
		} else {
			const isTranslatableLabel = translationUtility.isTranslationIdentifier(savedValue);
			if (!isTranslatableLabel) {
				if (savedValue !== valueToTranslate) {
					savedValue = valueToTranslate;
				}
				_value = this._t(valueToTranslate);
			} else {
				if (this._t(savedValue) !== valueToTranslate && translationUtility.hasMultipleIdentifiers(savedValue)) {
					savedValue = valueToTranslate;
				}
				_value = this._t(savedValue);
			}
		}
		this.translatableObjects[valueToSave] = savedValue;

		return _value;
	}

	/**
	 * Used after the language is changed when special actions has to be done
	 * For example when translating you have to parse the component children or some other actions
	 * @param {string} section
	 * @return {void}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected translateCallback(section: string): void {
		// if custom actions has to be done on translation
	}

	/**
	 * Applies the opt-in `contractname` contract like `ch5-advanced-button`, but without
	 * the global registry or DOM rewrites: each property flagged `contractName: true`
	 * (base plus the component's, via {@link getContractPropertySettings}) has its stored
	 * signal NAME prefixed IN THE STORE, so `<ch5-button contractname="C"
	 * receivestatelabel="Label">` resolves to the same `CLabel` advance-button would.
	 * Zero-cost when absent; a one-time connect pass, idempotent so reconnects never
	 * double-prefix. Resolved from INITIAL attributes only; runtime changes re-subscribe raw.
	 */
	protected applyContractName(): void {
		const contractName = this.getAttribute('contractname');
		if (!contractName) {
			return;
		}
		// Store contract name in properties for later use by applyJoinOffsets
		this._ch5Properties.setValue<string>('contractName', contractName);
		this.prefixContractSignals(Ch5LightBaseClass.LIGHT_BASE_PROPERTY_SETTINGS, contractName);
		this.prefixContractSignals(this.getContractPropertySettings(), contractName);
	}

	/**
	 * Applies join offsets to template child elements (opt-in, zero-cost when absent).
	 * Mirrors `ch5-advanced-button`'s usage of `Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs`
	 * but deferred until the component has child templates to process. Called by concrete
	 * components (e.g. `ch5-button`) when label templates are present. No per-instance
	 * allocation: reads offset attributes once, calls the shared utility, returns.
	 */
	protected applyJoinOffsets(): void {
		const contractName = this._ch5Properties.get<string>('contractName');
		const booleanOffset = this._ch5Properties.get<number>('booleanJoinOffset');
		const numericOffset = this._ch5Properties.get<number>('numericJoinOffset');
		const stringOffset = this._ch5Properties.get<number>('stringJoinOffset');

		// Zero-cost exit when no offsets and no contract - most buttons never use this
		if (!contractName && !booleanOffset && !numericOffset && !stringOffset) {
			return;
		}

		// Call the shared utility to increment join numbers and prefix contract names in template children
		Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(
			this,
			contractName || '',
			booleanOffset || 0,
			numericOffset || 0,
			stringOffset || 0
		);
	}

	/**
	 * Prefixes the contract name onto the stored signal name of every setting flagged
	 * `contractName: true`, writing it back via `setValue` (no callback). Skips
	 * unflagged, empty, or unchanged names so the store's equality short-circuits hold.
	 */
	private prefixContractSignals(settings: readonly ICh5LightPropertySettings[], contractName: string): void {
		for (let i = 0; i < settings.length; i++) {
			const setting = settings[i];
			if (!setting.contractName) {
				continue;
			}
			const raw = this._ch5Properties.get<string>(setting.name);
			if (!raw) {
				continue;
			}
			const resolved = Ch5LightBaseClass.prependContractName(raw, contractName);
			if (resolved !== raw) {
				this._ch5Properties.setValue<string>(setting.name, resolved);
			}
		}
	}

	/**
	 * Returns `value` prefixed with the contract name, mirroring
	 * `Ch5AugmentVarSignalsNames.incrementOrPrependAttrValue`: pure integer signal names
	 * (joins) are left untouched, and the prefix is idempotent so a reconnect cannot
	 * double-apply it. Any `{{indexId}}` placeholder is ignored for the integer test but
	 * preserved in the result.
	 */
	private static prependContractName(value: string, contractName: string): string {
		const bare = value.replace(Ch5LightBaseClass.CONTRACT_MOUSTACHE_RE, '');
		if (Ch5Signal.isIntegerSignalName(bare)) {
			return value;
		}
		if (value.startsWith(contractName)) {
			return value;
		}
		return contractName + value;
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
		} else if (this.hasAttribute(Ch5LightBaseClass.SIGNAL_ATTRIBUTE_ENABLE)) {
			this.removeAttribute(Ch5LightBaseClass.SIGNAL_ATTRIBUTE_ENABLE);
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
		if (this.getAttribute(Ch5LightBaseClass.SIGNAL_ATTRIBUTE_ENABLE) !== channelValue) {
			this.setAttribute(Ch5LightBaseClass.SIGNAL_ATTRIBUTE_ENABLE, channelValue);
		}
	}

	/**
	 * Subscribes to the `receiveStateShow` boolean signal (opt-in). Reuses the same
	 * lazy `_baseSignals` helper as `receiveStateEnable` (subscriptions are keyed by
	 * name, so both coexist). No-op when the name is empty, the host is
	 * disconnected, or it is already subscribed. On subscribe the helper delivers
	 * the signal's current value immediately, so {@link applyShowSignal} runs right
	 * away and the effective show state matches the signal from the first frame.
	 */
	private subscribeReceiveStateShow(): void {
		const name = this.receiveStateShow;
		if (!name || !this.isConnected) {
			return;
		}
		if (this._baseSignals !== null && this._baseSignals.isSubscribedTo(name)) {
			return;
		}
		(this._baseSignals ??= new Ch5LightSignal()).subscribe<boolean>(name, 'boolean', this._onSignalShowValue);
	}

	/**
	 * Handles a change to the `receiveStateShow` signal NAME. `oldSignalName` is the
	 * name in effect before this change (captured by `_ch5Properties.set()`, since
	 * the store already holds the NEW name by the time this runs). Tears down the
	 * previous subscription and (re)subscribes to the new one when connected. When
	 * the name is cleared it hands control back to the author's static `show`
	 * attribute (re-read from the DOM and re-applied through {@link handleShow}),
	 * since the signal never mutated that attribute.
	 */
	private handleReceiveStateShow(oldSignalName: string): void {
		this.clearReceiveStateShowSubscription(oldSignalName);
		if (this.receiveStateShow) {
			this._hasReceiveStateShowValue = false;
			this.subscribeReceiveStateShow();
		} else {
			this._hasReceiveStateShowValue = false;
			// Signal removed: restore the author's static `show` attribute (default true).
			const show = this.hasAttribute('show')
				? Ch5LightBaseClass.normalizeBooleanValue(this.getAttribute('show'), true, true)
				: true;
			this._ch5Properties.setValue<boolean>('show', show);
			this.handleShow();
		}
	}

	/** Releases the `receiveStateShow` subscription for the given signal name. */
	private clearReceiveStateShowSubscription(signalName: string): void {
		if (this._baseSignals !== null) {
			this._baseSignals.unsubscribe(signalName);
		}
	}

	/**
	 * Applies a `receiveStateShow` value (`true` = shown, `false` = hidden) by
	 * writing the effective state straight into the `show` property store and
	 * re-running {@link handleShow}, so the current `noshowtype` mode (display /
	 * visibility / remove) is honoured exactly like the static `show` attribute.
	 * The write bypasses the guarded `show` setter (via `setValue`) so the signal
	 * is never blocked by its own priority rule, and the author's `show` attribute
	 * is left untouched (and thus restorable when the signal is removed).
	 */
	protected applyShowSignal(shown: boolean): void {
		this._hasReceiveStateShowValue = true;
		this._ch5Properties.setValue<boolean>('show', shown);
		this.handleShow();
	}

	/**
	 * Reads `show` / `noshowtype` from the DOM straight into the property store
	 * (bypassing the setters) and applies the show handler once. The STATIC
	 * `disabled` needs no JS handling — it is styled from CSS via the `[disabled]`
	 * attribute; the opt-in `receiveStateEnable` signal drives a separate
	 * `data-signal-enable` channel and never mutates `disabled`.
	 * 
	 * Join offset attributes (`contractname`, `booleanjoinoffset`, etc.) are also
	 * read once and stored for later use by {@link applyJoinOffsets}.
	 * Idempotent and safe to call on every (re)connect.
	 */
	protected initLightBaseAttributes(): void {
		this.applyPreConfiguredAttributes();
		if (!this.hasAttribute('receivestateshow')) {
			const show = this.hasAttribute('show')
				? Ch5LightBaseClass.normalizeBooleanValue(this.getAttribute('show'), true, true)
				: true;
			this._ch5Properties.setValue<boolean>('show', show);
		}
		const noshowType = this.hasAttribute('noshowtype')
			? Ch5LightBaseClass.toShowType(this.getAttribute('noshowtype'))
			: Ch5LightBaseClass.NO_SHOW_TYPES[0];
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
		// Sync join offset attributes into the property store. These are opt-in and
		// zero-cost when absent: no helper, no subscription, just a simple property
		// read when applyJoinOffsets is called. Reading them here (not in
		// applyJoinOffsets) follows the same pattern as contractname - read once on
		// connect, idempotent on reconnect.
		for (let i = 0; i < Ch5LightBaseClass.JOIN_OFFSET_ATTRS.length; i++) {
			const value = this.hasAttribute(Ch5LightBaseClass.JOIN_OFFSET_ATTRS[i])
				? parseInt(this.getAttribute(Ch5LightBaseClass.JOIN_OFFSET_ATTRS[i]) || '0', 10) || 0
				: 0;
			this._ch5Properties.setValue<number>(Ch5LightBaseClass.JOIN_OFFSET_PROPS[i], value);
		}
		// Sync the receiveStateEnable / receiveStateShow signal NAMES into the store
		// from the DOM without firing the change callbacks (attributeChangedCallback
		// does not fire on reconnect). The subscriptions themselves happen in
		// connectedCallback via subscribeReceiveStateEnable() / subscribeReceiveStateShow().
		this._ch5Properties.setValue<string>('receiveStateEnable', this.getAttribute('receivestateenable') ?? '');
		this._ch5Properties.setValue<string>('receiveStateShow', this.getAttribute('receivestateshow') ?? '');
		// Sync the outbound sendEventOnShow signal NAME too, so the show state
		// published by the handleShow() call below targets the right signal on
		// (re)connect (attributeChangedCallback does not fire on reconnect).
		this._ch5Properties.setValue<string>('sendEventOnShow', this.getAttribute('sendeventonshow') ?? '');
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
		// Publish the resulting show state on the opt-in outbound signal. A no-op
		// (single store read + falsy check) when `sendeventonshow` is not set, so
		// signal-free instances pay nothing on this path.
		this.sendShowSignal(this.show);
	}

	/**
	 * Publishes the current show state (`true` = shown, `false` = hidden) to the
	 * opt-in `sendEventOnShow` boolean signal, mirroring `Ch5Common.sendShowSignal`.
	 * Zero-cost when the attribute is absent: it bails out on an empty name before
	 * touching the signal helper. Publishing goes through the shared lazy
	 * `Ch5LightSignal` helper's stateless `sendBoolean` (a plain boolean, not a
	 * repeat-digital object), so it works whether or not any receive signal is
	 * subscribed and needs no teardown on disconnect.
	 */
	protected sendShowSignal(value: boolean): void {
		const signalName = this.sendEventOnShow;
		if (!signalName || !this.receiveStateShow || !this._hasReceiveStateShowValue) {
			return;
		}
		(this._baseSignals ??= new Ch5LightSignal()).sendBoolean(signalName, value);
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
	 * Coerces a boolean-like value to a canonical boolean without pulling in lodash.
	 *
	 * `valueOnEmpty` controls the legacy HTML-attribute semantics: a bare attribute
	 * (presence without a value) means `true`, while a plain JS property value that is
	 * empty or invalid falls back to `defaultValue`.
	 */
	protected static normalizeBooleanValue(value: string | boolean | null | undefined, defaultValue: boolean, valueOnEmpty = defaultValue): boolean {
		if (value === null || value === undefined) {
			return defaultValue;
		}
		if (typeof value === 'boolean') {
			return value;
		}
		const normalized = String(value).trim().toLowerCase();
		if (normalized === '') {
			return valueOnEmpty;
		}
		if (normalized === 'true' || normalized === 'yes' || normalized === '1' || normalized === 'on') {
			return true;
		}
		if (normalized === 'false' || normalized === 'no' || normalized === '0' || normalized === 'off') {
			return false;
		}
		return defaultValue;
	}
	/**
	 * Coerces an attribute value to boolean without pulling in lodash.
	 * An empty attribute (e.g. `disabled`) resolves to `valueOnEmpty`.
	 */
	protected static toBoolean(value: string | boolean | null | undefined, valueOnEmpty = true): boolean {
		return Ch5LightBaseClass.normalizeBooleanValue(value, false, valueOnEmpty);
	}
	/**
	 * Reads a boolean attribute, resolves it to a clean boolean, then reflects the
	 * normalized `"true"` / `"false"` back onto the attribute so the DOM is corrected —
	 * mirroring `ch5-advanced-button` / `Ch5Property`, whose boolean handling rewrites a
	 * non-canonical attribute value.
	 *
	 * Resolution rules (match the heavy `Ch5Property`): an INVALID value falls back to
	 * the attribute's `defaultValue`, NOT to a hard `false`.
	 *  - attribute absent             -> `defaultValue`
	 *  - present but empty (bare)     -> `true` (its presence means "on")
	 *  - `"true"` / `"1"`             -> `true`
	 *  - `"false"` / `"0"`            -> `false`
	 *  - anything else ("kjgkjg", ...)-> `defaultValue`
	 *
	 * So e.g. `truncatetext="kjgkjg"` (default `true`) resolves to `true`, and
	 * `multilinesupport="kjgkjg"` (default `false`) resolves to `false`.
	 *
	 * The reflecting `setAttribute` re-enters `attributeChangedCallback`, but the
	 * second pass sees an already-canonical `"true"` / `"false"` value and does not
	 * reflect again, so there is no loop. Off the hot path (attribute changes only).
	 */
	protected coerceBooleanAttribute(attributeName: string, defaultValue: boolean): boolean {
		if (!this.hasAttribute(attributeName)) {
			return defaultValue;
		}
		const rawValue = this.getAttribute(attributeName);
		const resolved = Ch5LightBaseClass.normalizeBooleanValue(rawValue ?? '', defaultValue, true);
		// Reflect onto the DOM when the author's value isn't already canonical, so an
		// invalid or shorthand value ("kjgkjg", "1", "TRUE") is normalized in the DOM.
		if (rawValue !== 'true' && rawValue !== 'false' && rawValue !== '') {
			this.setAttribute(attributeName, resolved ? 'true' : 'false');
		}
		return resolved;
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

import { Ch5LightProperties, ICh5LightPropertySettings } from "./ch5-light-properties";

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
 * `disabled` is intentionally NOT handled in JS — it is styled entirely from CSS
 * via the host `[disabled]` attribute selector.
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
	 * list with its own in its static `observedAttributes` getter.
	 */
	public static readonly LIGHT_BASE_OBSERVED_ATTRIBUTES = ['show', 'noshowtype'];

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
		}
	];

	//#endregion

	//#region Variables

	protected _ch5Properties: Ch5LightProperties;

	/** Cached parent/sibling used to reattach the host when `noshowtype` = 'remove'. */
	private _cachedParentEl: Node | null = null;
	private _cachedNextSibling: Node | null = null;
	private _isDetachedFromDom = false;

	// Cached onChange callback (see the identical pattern/rationale in
	// Ch5LightButton) - created ONCE per instance so repeated `show`/`noshowType`
	// writes (e.g. driven by a fast-changing signal) never allocate a new closure.
	private readonly _onShowChange = () => this.handleShow();

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
		this.initLightBaseAttributes();
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
		}
	}

	//#endregion

	//#region Protected Methods

	/**
	 * Reads `show` / `noshowtype` from the DOM straight into the property store
	 * (bypassing the setters) and applies the show handler once. `disabled` needs
	 * no JS handling — it is styled from CSS via the `[disabled]` attribute.
	 * Idempotent and safe to call on every (re)connect.
	 */
	protected initLightBaseAttributes(): void {
		const show = this.hasAttribute('show') ? Ch5LightBaseClass.toBoolean(this.getAttribute('show'), true) : true;
		const noshowType = this.hasAttribute('noshowtype')
			? Ch5LightBaseClass.toShowType(this.getAttribute('noshowtype'))
			: Ch5LightBaseClass.NO_SHOW_TYPES[0];
		this._ch5Properties.setValue<boolean>('show', show);
		this._ch5Properties.setValue<TCh5LightShowType>('noshowType', noshowType);
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

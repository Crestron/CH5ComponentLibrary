import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { ICh5LightPropertySettings } from "../ch5-light-base/ch5-light-properties";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5ButtonBase } from "../ch5-button/ch5-button-base";
import { TCh5SliderButtonKey } from './interfaces/t-ch5-slider-button';

// Ch5SliderButton extends the shared Ch5ButtonBase (see
// ../ch5-button/ch5-button-base.ts) instead of the full Ch5Button, and only
// needs a SUBSET of the button's attributes (label / icon / send+receive
// signals) - this is the "define what properties I need and don't need"
// mechanism the base class enables: filter Ch5ButtonBase.PROPERTY_SETTINGS by
// name, then add the slider-specific `key` ('on' | 'off') on top. Every
// getter/setter NOT included below (size, stretch, multilinesupport, ...) is
// still inherited and works programmatically, it's just not attribute-reactive.
export class Ch5SliderButton extends Ch5ButtonBase {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-slider-button';
	public static readonly PRIMARY_CSS_CLASS = 'ch5-button';
	public static readonly KEY: readonly TCh5SliderButtonKey[] = ['on', 'off'];

	/** Names picked out of the FULL Ch5ButtonBase.PROPERTY_SETTINGS that this component actually uses. */
	private static readonly BUTTON_PROPERTY_NAMES: readonly string[] = [
		'label', 'labelInnerHTML', 'iconClass', 'iconUrl', 'iconUrlFillType', 
		'hAlignLabel', 'vAlignLabel', 
		'receiveStateLabel', 'receiveStateIconClass', 'receiveStateIconUrl',
		'sendEventOnClick', 'pressed', 'selected', 'type', 'shape'
	];

	/** Properties unique to ch5-slider-button, layered on top of the filtered button subset. */
	private static readonly OWN_PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		{ name: 'key', default: Ch5SliderButton.KEY[0], type: 'enum', enumeratedValues: [...Ch5SliderButton.KEY] }
	];

	public static readonly PROPERTY_SETTINGS: ICh5LightPropertySettings[] = [
		...Ch5ButtonBase.PROPERTY_SETTINGS.filter(setting => Ch5SliderButton.BUTTON_PROPERTY_NAMES.includes(setting.name)),
		...Ch5SliderButton.OWN_PROPERTY_SETTINGS
	];

	private static readonly OBSERVED_ATTRIBUTES = Ch5ButtonBase.toObservedAttributeNames(Ch5SliderButton.PROPERTY_SETTINGS);

	//#endregion

	//#region Variables

	private readonly _onKeyChange = () => this.updateKeyCssClass();

	//#endregion

	//#region Getters and Setters

	/** Used to set the type of button, i.e. 'on' or 'off'. Any other value normalizes to 'on'. */
	public set key(value: TCh5SliderButtonKey | string) {
		const normalizedValue: TCh5SliderButtonKey = value === 'off' ? 'off' : 'on';
		this._ch5Properties.set<string>('key', normalizedValue, this._onKeyChange);
		if (this._isInitialized) {
			this.setAttribute('key', normalizedValue);
		}
	}
	public get key(): TCh5SliderButtonKey {
		return this._ch5Properties.get<TCh5SliderButtonKey>('key');
	}

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5SliderButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5SliderButton.ELEMENT_NAME, Ch5SliderButton);
		}
	}

	public static registerSignalAttributeTypes(): void {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(
			Ch5SliderButton.ELEMENT_NAME,
			Ch5ButtonBase.buildSignalAttributeRegistryEntries(Ch5SliderButton.PROPERTY_SETTINGS)
		);
	}

	public static get observedAttributes(): string[] {
		return [
			...Ch5LightBaseClass.LIGHT_BASE_OBSERVED_ATTRIBUTES,
			...Ch5SliderButton.OBSERVED_ATTRIBUTES
		];
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this._ch5Properties.add(Ch5SliderButton.OWN_PROPERTY_SETTINGS);
	}

	protected getContractPropertySettings(): readonly ICh5LightPropertySettings[] {
		return Ch5SliderButton.PROPERTY_SETTINGS;
	}

	/**
	 * Called by the child <ch5-slider-button-label>'s debounced attribute sync (see
	 * ch5-slider-button-label.ts). Acts as a late retry: the HTML parser connects this
	 * button before its <ch5-slider-button-label> child is parsed/appended, so the
	 * child's own connect - which lands here once it settles - is what actually finds it.
	 */
	public setValues(): void {
		this.handleSliderButtonLabelLinkage();
	}

	public attributeChangedCallback(attr: string, oldValue: string | null, newValue: string | null): void {
		if (oldValue === newValue) {
			return;
		}
		if (attr === 'key') {
			this.key = newValue ?? Ch5SliderButton.KEY[0];
			return;
		}
		super.attributeChangedCallback(attr, oldValue, newValue);
	}

	/**
	 * Called when the Ch5SliderButton component is first connected to the DOM. A
	 * slider button only initializes once it has been moved by its parent
	 * <ch5-slider> into the `slider-on-button` / `slider-off-button` container
	 * (see ch5-slider.ts onOffButtonHelper()), and only for a valid `key`.
	 */
	public connectedCallback(): void {
		if (!this.isValidSliderPosition()) {
			return;
		}
		// The FIRST connect wipes host children (Ch5ButtonBase.createInternalHtml()
		// -> replaceChildren()); preserve any author-provided
		// <ch5-slider-button-label> child and restore it once the internal
		// <button>/icon/label are built.
		const preservedLabelChildren = this.getSliderButtonLabelChildren();
		super.connectedCallback();
		preservedLabelChildren.forEach(child => this.appendChild(child));
		this.applyDefaultIconPositionTop();
		this.updateKeyCssClass();
		this.handleSliderButtonLabelLinkage();
	}

	//#endregion

	//#region Private Methods

	private isValidSliderPosition(): boolean {
		if (!(this.parentElement?.classList.contains('slider-on-button') || this.parentElement?.classList.contains('slider-off-button'))) {
			return false;
		}
		const key = this.getAttribute('key');
		if (key && key.toLowerCase() !== 'on' && key.toLowerCase() !== 'off') {
			return false;
		}
		return true;
	}

	/** Defaults the icon to the top of the label, matching the slider button's legacy layout, unless the author overrides it. */
	private applyDefaultIconPositionTop(): void {
		if (!this.hasAttribute('iconposition')) {
			this.setAttribute('iconposition', 'top');
		}
	}

	/** Mirrors the on/off state as a CSS hook (`ch5-slider-button--key-on` / `--key-off`), matching the old COMPONENT_DATA.KEY.classListPrefix. */
	private updateKeyCssClass(): void {
		const p = this.ctor.PRIMARY_CSS_CLASS;
		this.classList.remove(`${p}--key-on`, `${p}--key-off`);
		this.classList.add(`${p}--key-${this.key}`);
	}

	private getSliderButtonLabelChildren(): Element[] {
		return Array.from(this.children).filter(child => child.tagName.toLowerCase() === 'ch5-slider-button-label');
	}

	/**
	 * Reads the linked <ch5-slider-button-label> child (its <template>, or its own
	 * `labelinnerhtml`/`label` attribute) and feeds it into THIS button's own
	 * label/labelInnerHTML, so Ch5ButtonBase renders it in the internal <span>. Only
	 * reads the child (never writes to it), so it can't re-trigger the child's own
	 * attributeChangedCallback - safe to call repeatedly from setValues().
	 */
	private handleSliderButtonLabelLinkage(): void {
		if (this.receiveStateLabel) {
			return;
		}
		if (this.hasAttribute('labelinnerhtml') || this.hasAttribute('label')) {
			return;
		}
		const labelChildren = this.getSliderButtonLabelChildren();
		if (labelChildren.length === 0) {
			return;
		}
		const labelChild = labelChildren[0];
		const templateEl = labelChild.querySelector('template') as HTMLTemplateElement | null;
		if (templateEl) {
			this.labelInnerHTML = templateEl.innerHTML;
		} else if (labelChild.hasAttribute('labelinnerhtml')) {
			this.labelInnerHTML = labelChild.getAttribute('labelinnerhtml') ?? '';
		} else if (labelChild.hasAttribute('label')) {
			this.label = labelChild.getAttribute('label') ?? '';
		} else {
			this.label = labelChild.textContent?.trim() ?? '';
		}
	}

	//#endregion

}

Ch5SliderButton.registerCustomElement();
Ch5SliderButton.registerSignalAttributeTypes();
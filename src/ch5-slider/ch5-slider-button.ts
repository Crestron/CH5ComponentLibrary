import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { ICh5LightPropertySettings } from "../ch5-light-base/ch5-light-properties";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";
import { Ch5ButtonBase } from "../ch5-button/ch5-button-base";
import { TCh5SliderButtonKey } from './interfaces/t-ch5-slider-button';
import type { Ch5SliderButtonLabel } from './ch5-slider-button-label';

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

	//#region Getters and Setters

	/** Used to set the type of button, i.e. 'on' or 'off'. Any other value normalizes to '' (matches the legacy enum property's fallback to its "" default). */
	public set key(value: TCh5SliderButtonKey | string) {
		const normalizedValue: TCh5SliderButtonKey | '' = value === 'on' || value === 'off' ? value : '';
		this._ch5Properties.set<string>('key', normalizedValue);
		if (this._isInitialized) {
			this.setAttribute('key', normalizedValue);
		}
	}
	public get key(): TCh5SliderButtonKey | '' {
		return this._ch5Properties.get<TCh5SliderButtonKey | ''>('key');
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
			this.key = newValue === 'on' || newValue === 'off' ? newValue : '';
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

	private getSliderButtonLabelChildren(): Ch5SliderButtonLabel[] {
		return Array.from(this.children).filter(child => child.tagName.toLowerCase() === 'ch5-slider-button-label') as unknown as Ch5SliderButtonLabel[];
	}

	/**
	 * Reads the linked <ch5-slider-button-label> child and feeds it into THIS button's
	 * own label/labelInnerHTML, so Ch5ButtonBase renders it in the internal <span>.
	 * Pulls the child's already-resolved `label`/`labelInnerHTML`/`receiveStateLabel`
	 * properties (rather than re-parsing its raw attributes), mirroring Ch5Label's own
	 * priority order so a signal-driven label on the child isn't silently dropped. Only
	 * reads the child (never writes to it), so it can't re-trigger the child's own
	 * attributeChangedCallback - safe to call repeatedly from setValues().
	 */
	private handleSliderButtonLabelLinkage(): void {
		if (this.receiveStateLabel) {
			return;
		}
		const labelChild = this.getSliderButtonLabelChildren()[0];
		if (!labelChild) {
			return;
		}
		// A present <ch5-slider-button-label> child always wins over the button's own
		// label/labelinnerhtml attributes. Mirrors Ch5Label.handleLabel()'s priority:
		// receiveStateLabel > labelInnerHTML > template > label.
		const templateEl = labelChild.getElementsByTagName('template')[0] as HTMLTemplateElement | undefined;
		if (labelChild.receiveStateLabel) {
			this.label = labelChild.label;
		} else if (labelChild.labelInnerHTML) {
			this.labelInnerHTML = labelChild.labelInnerHTML;
		} else if (templateEl instanceof HTMLTemplateElement) {
			this.labelInnerHTML = templateEl.innerHTML;
		} else if (labelChild.hasAttribute('label')) {
			this.label = labelChild.label;
		}
		// else: the child has no content of its own - leave the button's label/labelInnerHTML as-is.
	}

	/**
	 * Propagates the join offsets / contract name that the subpage-reference carrier
	 * stamped onto THIS button (see {@link registerSignalAttributeDefaults}) down onto
	 * its freshly-rendered label joins. Invoked by Ch5ButtonBase.handleLabel() right
	 * after the label span's HTML is (re)written, so it runs on every render - whether
	 * the label came from a `<ch5-slider-button-label>` child or the button's own
	 * `labelinnerhtml` attribute - and is naturally idempotent: each render recreates
	 * the joins at their base values, so a single increment always yields base + offset.
	 *
	 * The offsets are read from THIS button's own attributes (the carrier propagates them
	 * onto every registered-default descendant, ch5-slider-button included), exactly like
	 * the plain light ch5-button. The inherited one-shot {@link applyJoinOffsets} is
	 * overridden to a no-op so this per-render pass is the single point that offsets the
	 * label joins - the label can render after the base connectedCallback (its child links
	 * late), which the one-shot pass would miss. Scoped to ch5-slider-button; touches no
	 * shared augmentation code and no other component.
	 */
	protected applyLabelSignalOffsets(labelSpan: HTMLElement): void {
		const contractName = this.getAttribute('contractname') || '';
		const booleanOffset = parseInt(this.getAttribute('booleanjoinoffset') || '0', 10) || 0;
		const numericOffset = parseInt(this.getAttribute('numericjoinoffset') || '0', 10) || 0;
		const stringOffset = parseInt(this.getAttribute('stringjoinoffset') || '0', 10) || 0;
		if (!contractName && !booleanOffset && !numericOffset && !stringOffset) {
			return;
		}
		Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(labelSpan, contractName, booleanOffset, numericOffset, stringOffset);
	}

	/**
	 * Overridden to a no-op. The base applies join offsets once during connectedCallback,
	 * but a slider button's label can render later (its `<ch5-slider-button-label>` child
	 * links after connect), so offsets are instead applied per-render in
	 * {@link applyLabelSignalOffsets}. Suppressing the base's one-shot pass keeps that the
	 * single point of application and avoids double-incrementing.
	 */
	protected applyJoinOffsets(): void {
		/* no-op - see applyLabelSignalOffsets() */
	}

	//#endregion

}

Ch5SliderButton.registerCustomElement();
Ch5SliderButton.registerSignalAttributeTypes();
Ch5SliderButton.registerSignalAttributeDefaults(Ch5SliderButton.ELEMENT_NAME);
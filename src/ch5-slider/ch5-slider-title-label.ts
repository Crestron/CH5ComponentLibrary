import { ICh5SliderTitleLabelAttributes } from './interfaces/i-ch5-slider-title-label-attributes';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Slider } from ".";
import { Ch5Label } from "../ch5-label";
import _ from "lodash";
import { Ch5SignalAttributeRegistry } from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5SliderTitleLabel extends Ch5Label implements ICh5SliderTitleLabelAttributes {

	//#region Variables

	public static readonly ELEMENT = 'ch5-slider-title-label';

	public primaryCssClass = 'ch5-slider-title-label';

	private _parentCh5Slider: Ch5Slider;

	//#endregion


	//#region Component Lifecycle

	public constructor(public parent?: Ch5Slider) {
		super("ch5-slider");
		this.ignoreAttributes = ["disabled", "debug", "show", "customclass", "customstyle", "noshowtype", "receivestatecustomclass", "receivestatecustomstyle", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestateenable", "sendeventonshow", "gestureable", "dir", "appendclasswheninviewport"];
		this.logger.start('constructor()', Ch5SliderTitleLabel.ELEMENT_NAME);
		if (!_.isNil(parent)) {
			this._parentCh5Slider = parent;
			this.createInternalHtml();
			this.initAttributes();
			this.updateCssClass();
			this._parentCh5Slider.setValues("title", this.getTargetElementForCssClassesAndStyle());
		} else {
			this._parentCh5Slider = this.getParentButton();
		}
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Label.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5SliderTitleLabel.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderTitleLabel.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5SliderTitleLabel.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}
	
	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5SliderTitleLabel.ELEMENT, Ch5SliderTitleLabel.SIGNAL_ATTRIBUTE_TYPES);
	}
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-slider-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5SliderTitleLabel.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		if (this._parentCh5Slider.setValues) {
			this._parentCh5Slider.setValues("title", this.getTargetElementForCssClassesAndStyle());
		}
		this.logger.stop();
	}

	/**
	 * Called when the Ch5SliderTitleLabel component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5SliderTitleLabel.ELEMENT_NAME);
		super.connectedCallback();
		this.setAttribute('data-ch5-id', this.getCrId());
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.removeEventListeners();
		this.unsubscribeFromSignals();
		this.logger.stop();
	}

	//#endregion

	//#region Protected / Private Methods

	protected createInternalHtml() {
		super.createInternalHtml();
		this.logger.start('createInternalHtml()');
		this.logger.stop();
	}

	protected initAttributes() {
		super.initAttributes();
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5SliderTitleLabel.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderTitleLabel.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5SliderTitleLabel.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5SliderTitleLabel.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	public getParentButton(): Ch5Slider {
		const getTheMatchingParent = (node: Node): Ch5Slider => {
			if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-SLIDER") {
				return getTheMatchingParent(node.parentNode as Node);
			}
			return node as Ch5Slider;
		}
		return getTheMatchingParent(this.parentElement as Node);
	}

	protected attachEventListeners() {
		super.attachEventListeners();

	}

	protected removeEventListeners() {
		super.removeEventListeners();

	}

	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
	}

	protected updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClass();
		this.logger.stop();
	}



	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

}
if (typeof window === "object" &&
	typeof window.customElements === "object" &&
	typeof window.customElements.define === "function") {
	window.customElements.define(Ch5SliderTitleLabel.ELEMENT, Ch5SliderTitleLabel);
}
Ch5SliderTitleLabel.registerSignalAttributeTypes();

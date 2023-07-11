import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Label } from "../ch5-label";
import _ from "lodash";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SliderButton } from "./ch5-slider-button";

export class Ch5SliderButtonLabel extends Ch5Label {

	//#region Variables

	public static readonly ELEMENT = 'ch5-slider-button-label';

	public primaryCssClass = 'ch5-slider-button-label';

	private _parentCh5Slider: Ch5SliderButton;

	private debounceCreateBtnLabel = this.debounce(() => {
		if (_.isNil(this._parentCh5Slider)) {
			this._parentCh5Slider = this.getParentButton();
		}
		this._parentCh5Slider.setValues(); // this.getTargetElementForCssClassesAndStyle());
		// if (this._parentCh5Slider.setValues) {
		// 	this._parentCh5Slider.setValues("label", this.getTargetElementForCssClassesAndStyle());
		// }
	}, 50);

	//#endregion

	//#region Component Lifecycle

	public constructor(public parent?: Ch5SliderButton) {
		super("Ch5-slider-button");
		this.ignoreAttributes = ["disabled", "debug", "show", "customclass", "customstyle", "noshowtype", "receivestatecustomclass", "receivestatecustomstyle", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestateenable", "sendeventonshow", "gestureable", "dir", "appendclasswheninviewport"];
		this.logger.start('constructor()', Ch5SliderButtonLabel.ELEMENT_NAME);
		if (!_.isNil(parent)) {
			this._parentCh5Slider = parent;
		} else {
			this._parentCh5Slider = this.getParentButton();
		}
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Label.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5SliderButtonLabel.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderButtonLabel.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5SliderButtonLabel.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-slider-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5SliderButtonLabel.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.debounceCreateBtnLabel();
		this.logger.stop();
	}

	/**
	 * Called when the Ch5SliderButtonLabel component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5SliderButtonLabel.ELEMENT_NAME);
		this.setAttribute('role', Ch5RoleAttributeMapping.ch5SliderButton);
		this.setAttribute('data-ch5-id', this.getCrId());
		super.connectedCallback();
		this.createInternalHtml();
		this.initAttributes();
		this.updateCssClass();
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
		for (let i: number = 0; i < Ch5SliderButtonLabel.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderButtonLabel.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5SliderButtonLabel.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5SliderButtonLabel.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	public getParentButton(): Ch5SliderButton {
		const getTheMatchingParent = (node: Node): Ch5SliderButton => {
			if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-SLIDER-BUTTON") {
				return getTheMatchingParent(node.parentNode as Node);
			}
			return node as Ch5SliderButton;
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
		super.updateCssClasses();
		this.logger.stop();
	}

	protected handleLabel() {
		// // if (!this._parentCh5Slider && !this._parentCh5Slider.receiveStateLabel) {
		// // 	super.handleLabel();
		// // 	if (this.receiveStateLabel) {
		// // 		this._parentCh5Slider.label = this.labelRec;
		// // 		if (this.labelRec === "") {
		// // 			this.getTargetElementForCssClassesAndStyle().innerText = "";
		// // 		}
		// // 	}
		// }

	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

}
if (typeof window === "object" &&
	typeof window.customElements === "object" &&
	typeof window.customElements.define === "function") {
	window.customElements.define(Ch5SliderButtonLabel.ELEMENT, Ch5SliderButtonLabel);
}

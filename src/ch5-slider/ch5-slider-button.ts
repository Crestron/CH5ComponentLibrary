import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5ButtonBase } from "../ch5-button";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SliderButtonKey, } from './interfaces/t-ch5-slider-button';
import { ICh5SliderButtonAttributes } from './interfaces/i-ch5-slider-button-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Slider } from "./ch5-slider";
import { Ch5RoleAttributeMapping, Ch5SignalFactory } from "..";
import _ from "lodash";
import { Ch5SliderButtonLabel } from "./ch5-slider-button-label";

export class Ch5SliderButton extends Ch5ButtonBase implements ICh5SliderButtonAttributes {

	//#region Variables

	public static readonly KEY: TCh5SliderButtonKey[] = ['on', 'off'];
	public static readonly inheritedObsAttrs = ["key", "label", "sgicontheme", "iconclass", "iconurl", "filltype", "sendeventonclick", "receivestatelabel", "receivestateiconclass", "receivestateiconurl"];
	public static readonly COMPONENT_DATA: any = {
		KEY: {
			default: Ch5SliderButton.KEY[0],
			values: Ch5SliderButton.KEY,
			key: 'key',
			attribute: 'key',
			classListPrefix: '--key-'
		},
	};
	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

		{
			default: Ch5SliderButton.KEY[0],
			enumeratedValues: Ch5SliderButton.KEY,
			name: "key",
			removeAttributeOnNull: true,

			type: "enum",
			valueOnAttributeEmpty: Ch5SliderButton.KEY[0],
			isObservableProperty: true,

		},
	];

	public static readonly ELEMENT_NAME = 'ch5-slider-button';

	public primaryCssClass = 'ch5-button';

	private _parentCh5Slider: Ch5Slider;

	private sliderBtn: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters


	public set key(value: TCh5SliderButtonKey) {
		this._ch5Properties.set<TCh5SliderButtonKey>("key", value, () => {
			// if (this.key === "on") {
			// 	this.classList.add("ch5-slider-key--on");
			// } else {
			// 	this.classList.add("ch5-slider-key--off");
			// }
		});
	}
	public get key(): TCh5SliderButtonKey {
		return this._ch5Properties.get<TCh5SliderButtonKey>("key");
	}

	//#endregion

	//#region Static Methods

	//#endregion1

	//#region Component Lifecycle

	public constructor(public parent?: Ch5Slider) {
		super({ index: 0, clickHoldTime: 0, contractName: '', parentComponent: 'ch5-slider' });
		this.ignoreAttributes = ["disabled", "debug", "show", "customclass", "customstyle", "noshowtype", "receivestatecustomclass", "receivestatecustomstyle", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestateenable", "sendeventonshow", "gestureable", "dir", "appendclasswheninviewport"];
		this.logger.start('constructor()', Ch5SliderButton.ELEMENT_NAME);
		if (!_.isNil(parent)) {
			this._parentCh5Slider = parent;
			this.createInternalHtml();
			//	this._parentCh5Slider.setValues(this.key, this.getTargetElementForCssClassesAndStyle());
		} else {
			this._parentCh5Slider = this.getParentButton();
		}
		this.classList.add("ch5-slider-button");
		this._ch5Properties = new Ch5Properties(this, Ch5SliderButton.COMPONENT_PROPERTIES);
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = ["label", "sgicontheme", "iconclass", "iconurl", "filltype", "sendeventonclick", "receivestatelabel", "receivestateiconclass", "receivestateiconurl"];
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5SliderButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5SliderButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (!Ch5SliderButton.inheritedObsAttrs.includes(attr.toLowerCase())) {
			return;
		}
		if (oldValue !== newValue) {
			this.logger.log('ch5-slider-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5SliderButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		if (this._parentCh5Slider.setValues) {
			this._parentCh5Slider.setValues(this.key, this.getTargetElementForCssClassesAndStyle());
		}
		this.logger.stop();
	}

	private buttonIgonredAttributes() {
		const buttonIgnoredAttr = [
			'labelinnerhtml', 'iconposition', 'orientation', 'checkboxshow', 'checkboxposition', 'halignlabel', 'valignlabel', 'pressdelaytime', 'pressdelaydistance', 'shape', 'size', 'stretch', 'type', 'formtype', 'mode', 'pressed', 'selected', 'customclassselected', 'customclasspressed', 'customclassdisabled', 'receivestatemode', 'receivestateselected', 'receivestatescriptlabelhtml', 'receivestatetype', 'sendeventontouch', 'iconurlfilltype', 'backgroundimageurl', 'backgroundimagefilltype', 'receivestatebackgroundimageurl', 'receivestatecustomclass', 'receivestatecustomstyle', 'disabled', 'show', 'customclass', 'customstyle'
		];
		for (let i = 0; i < buttonIgnoredAttr.length; i++) {
			if (this.hasAttribute(buttonIgnoredAttr[i].toLowerCase())) {
				this.removeAttribute(buttonIgnoredAttr[i].toLowerCase());
			}
		}
	}

	/**
	 * Called when the Ch5SliderButton component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5SliderButton.ELEMENT_NAME);
		this.setAttribute('data-ch5-id', this.getCrId());
		// this.attachEventListeners();
		// this.initAttributes();
		// this.updateCssClass();
		this.buttonIgonredAttributes();
		super.connectedCallback();
		this.updateCssClass();
		this.handleLabel();
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
		this.clearComponentContent();
		this.logger.stop();
	}

	protected initAttributes() {
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5SliderButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5SliderButton.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5SliderButton.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		for (let i: number = 0; i < Ch5SliderButton.inheritedObsAttrs.length; i++) {
			if (this.hasAttribute(Ch5SliderButton.inheritedObsAttrs[i].toLowerCase())) {
				const key = Ch5SliderButton.inheritedObsAttrs[i].toLowerCase();
				thisRef[key] = this.getAttribute(key);
			}
		}
		//	super.initAttributes();
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
		this._ch5Properties.unsubscribe();
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	protected clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}


	private labelHelper() {
		const LabelSlider = this.getElementsByTagName("ch5-slider-button-label");

		Array.from(LabelSlider).forEach((label, index) => {
			if (index >= 1) {
				return;
			}
			var sliderTtl = new Ch5SliderButtonLabel(this);
			Ch5SliderButtonLabel.observedAttributes.forEach((attr) => {
				if (label.hasAttribute(attr)) {
					sliderTtl.setAttribute(attr, label.getAttribute(attr) + '');
				}
			});
		})
	}

	public setValues(elem: String, val: HTMLElement) {
		if (elem === "label" && !(this.receiveStateLabel !== null && this.receiveStateLabel.trim() !== "")) {
			this.label = val.innerHTML;
		}
	}

	private handleLabel() {
		if (this.receiveStateLabel !== null && this.receiveStateLabel.trim() !== "") {
			// something
		} else if (this.getElementsByTagName("ch5-slider-button-label").length >= 1) {
			this.labelHelper();
		}
	}

	public setButtonDisplay() {
		if (this.receiveStateLabel !== null && this.receiveStateLabel.trim() !== "") {
			return;
		}
		super.setButtonDisplay();
	}

	protected updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();
		this.classList.add("ch5-slider-key--" + this.key);
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
	window.customElements.define(Ch5SliderButton.ELEMENT_NAME, Ch5SliderButton);
}

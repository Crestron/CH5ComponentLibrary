import { Ch5ButtonBase } from "../ch5-button";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SliderButtonKey, } from './interfaces/t-ch5-slider-button';
import { ICh5SliderButtonAttributes } from './interfaces/i-ch5-slider-button-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Slider } from "./ch5-slider";
import _ from "lodash";
import { Ch5SliderButtonLabel } from "./ch5-slider-button-label";

export class Ch5SliderButton extends Ch5ButtonBase implements ICh5SliderButtonAttributes {

	//#region Variables

	public static readonly KEY: TCh5SliderButtonKey[] = ['on', 'off'];
	public static readonly inheritedObsAttrs = ["key", "label", "sgicontheme", "iconclass", "iconurl", "iconurlfilltype", "sendeventonclick", "receivestatelabel", "receivestateiconclass", "receivestateiconurl"];
	public static readonly COMPONENT_DATA: any = {
		KEY: {
			default: Ch5SliderButton.KEY[0],
			values: Ch5SliderButton.KEY,
			key: 'key',
			attribute: 'key',
			classListPrefix: '--key-'
		},
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

		{
			default: "",
			enumeratedValues: Ch5SliderButton.KEY,
			name: "key",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
	];

	public static readonly ELEMENT_NAME = 'ch5-slider-button';

	public primaryCssClass = 'ch5-button';


	private debounceCreateBtn = this.debounce(() => {
		this.setButtonDisplay();
		this.updateInternalHtml();
	}, 50);

	//#endregion

	//#region Getters and Setters


	public set key(value: TCh5SliderButtonKey) {
		this._ch5Properties.set<TCh5SliderButtonKey>("key", value, () => {
			this.debounceCreateBtn();
		});
	}
	public get key(): TCh5SliderButtonKey {
		return this._ch5Properties.get<TCh5SliderButtonKey>("key");
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		console.log("constructor");
		this.ignoreAttributes = ["disabled", "debug", "show", "customclass", "customstyle", "noshowtype", "receivestatecustomclass", "receivestatecustomstyle", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestateenable", "sendeventonshow", "gestureable", "dir", "appendclasswheninviewport"];
		this.logger.start('constructor()', Ch5SliderButton.ELEMENT_NAME);
		this._ch5Properties = new Ch5Properties(this, Ch5SliderButton.COMPONENT_PROPERTIES);
	}

	public static get observedAttributes(): string[] {
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5SliderButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5SliderButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5SliderButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return newObsAttrs.concat(Ch5SliderButton.inheritedObsAttrs);
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5SliderButton.ELEMENT_NAME, Ch5SliderButton.SIGNAL_ATTRIBUTE_TYPES);
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
		this.debounceCreateBtn();
		this.logger.stop();
	}

	private buttonIgonredAttributes() {
		const buttonIgnoredAttr = [
			'labelinnerhtml', 'iconposition', 'orientation', 'checkboxshow', 'checkboxposition', 'halignlabel', 'valignlabel', 'pressdelaytime', 'pressdelaydistance', 'shape', 'size', 'stretch', 'type', 'formtype', 'mode', 'pressed', 'selected', 'customclassselected', 'customclasspressed', 'customclassdisabled', 'receivestatemode', 'receivestateselected', 'receivestatescriptlabelhtml', 'receivestatetype', 'sendeventontouch', 'backgroundimageurl', 'backgroundimagefilltype', 'receivestatebackgroundimageurl', 'receivestatecustomclass', 'receivestatecustomstyle', 'disabled', 'show', 'customclass', 'customstyle'
		];
		for (let i = 0; i < buttonIgnoredAttr.length; i++) {
			if (this.hasAttribute(buttonIgnoredAttr[i].toLowerCase())) {
				this.removeAttribute(buttonIgnoredAttr[i].toLowerCase());
			}
		}
		this.setAttribute("iconPosition", "top");
	}

	/**
	 * Called when the Ch5SliderButton component is first connected to the DOM
	 */
	public connectedCallback() {
		console.log("connnectedCallback");
		this.logger.start('connectedCallback()', Ch5SliderButton.ELEMENT_NAME);
		this.setAttribute('data-ch5-id', this.getCrId());
		this.buttonIgonredAttributes();
		super.connectedCallback();
		this.updateCssClass();
		this.handleLabel();
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
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
		this.debounceCreateBtn();
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
		const labelSlider = this.getElementsByTagName("ch5-slider-button-label");
		Array.from(labelSlider).forEach((label, index) => {
			if (index >= 1) { return; }
			const sliderTtl = new Ch5SliderButtonLabel(this);
			Ch5SliderButtonLabel.observedAttributes.forEach((attr) => {
				if (label.hasAttribute(attr)) {
					sliderTtl.setAttribute(attr, label.getAttribute(attr) + '');
				}
			});
		})
	}

	public setValues(elem: string, val: HTMLElement) {
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
		super.setButtonDisplay();
	}

	protected updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();
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
Ch5SliderButton.registerSignalAttributeTypes();
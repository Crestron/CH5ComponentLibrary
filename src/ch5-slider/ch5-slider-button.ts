import { Ch5ButtonBase } from "../ch5-button";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SliderButtonKey, } from './interfaces/t-ch5-slider-button';
import { ICh5SliderButtonAttributes } from './interfaces/i-ch5-slider-button-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import _ from "lodash";
import { Ch5SliderButtonLabel } from "./ch5-slider-button-label";

export class Ch5SliderButton extends Ch5ButtonBase implements ICh5SliderButtonAttributes {

	//#region Variables

	public static readonly KEY: TCh5SliderButtonKey[] = ['on', 'off'];
	public static readonly inheritedObsAttrs = ["key", "labelinnerhtml", "label", "sgicontheme", "iconclass", "pressed", "selected", "shape", "halignlabel", "valignlabel", "type", "iconurl", "iconurlfilltype", "sendeventonclick", "receivestatelabel", "receivestateiconclass", "receivestateiconurl"];
	public static readonly COMPONENT_DATA: any = {
		KEY: {
			default: Ch5SliderButton.KEY[0],
			values: Ch5SliderButton.KEY,
			key: 'key',
			attribute: 'key',
			classListPrefix: '--key-'
		}
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
		{
			default: "",
			name: "labelInnerHTML",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		}
	];

	public static readonly ELEMENT_NAME = 'ch5-slider-button';

	public primaryCssClass = 'ch5-button';

	private debounceCreateSliderButton = this.debounce(() => {
		this.setButtonDisplay();
		this.updateInternalHtml();
	}, 50);

	//#endregion

	//#region Getters and Setters

	public set key(value: TCh5SliderButtonKey) {
		this._ch5Properties.set<TCh5SliderButtonKey>("key", value, () => {
			this.debounceCreateSliderButton();
		});
	}
	public get key(): TCh5SliderButtonKey {
		return this._ch5Properties.get<TCh5SliderButtonKey>("key");
	}

	public set labelInnerHTML(value: string) {
		this._ch5Properties.set<string>("labelInnerHTML", value, () => {
			this.createSliderButtonLabel();
			this.debounceCreateSliderButton();
		});
	}
	public get labelInnerHTML(): string {
		return this._ch5Properties.get<string>("labelInnerHTML");
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5SliderButton.ELEMENT_NAME);
		this.ignoreAttributes = ["disabled", "debug", "show", "customclass", "customstyle", "noshowtype", "receivestatecustomclass", "receivestatecustomstyle", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestateenable", "sendeventonshow", "gestureable", "dir", "appendclasswheninviewport"];
		this._ch5Properties = new Ch5Properties(this, Ch5SliderButton.COMPONENT_PROPERTIES);
	}

	public static get observedAttributes() {
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
		// console.log("attributeChangedCallback", attr, oldValue, newValue);
		if (Ch5SliderButton.inheritedObsAttrs.includes(attr.toLowerCase())) {
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
			this.debounceCreateSliderButton();
		}
		this.logger.stop();
	}

	private createSliderButtonLabel() {
		const buttonLabelList = this.getElementsByTagName("ch5-slider-button-label");
		const findButtonLabel = Array.prototype.slice.call(buttonLabelList).filter((x: { parentNode: { nodeName: { toString: () => string; }; }; }) => x.parentNode.nodeName.toString().toLowerCase() === this.nodeName.toString().toLowerCase());
		let childButtonLabel: any = null;
		if (findButtonLabel && findButtonLabel.length > 0 && !_.isNil(findButtonLabel[0].children[0])) {
			childButtonLabel = findButtonLabel[0];
		} else {
			childButtonLabel = document.createElement('ch5-slider-button-label');
			this.appendChild(childButtonLabel);
		}
		let templateEl = childButtonLabel.querySelector('template');
		if (templateEl !== null) {
			childButtonLabel.removeChild(templateEl);
		}
		templateEl = document.createElement('template');
		templateEl.innerHTML = this.decodeInnerHTMLForAttribute(this.labelInnerHTML);
		childButtonLabel.appendChild(templateEl);
	}

	private buttonIgnoredAttributes() {
		const buttonIgnoredAttr = [
			'iconposition', 'orientation', 'checkboxshow', 'checkboxposition', 'pressdelaytime', 'pressdelaydistance', 'size', 'stretch', 'formtype', 'mode', 'customclassselected', 'customclasspressed', 'customclassdisabled', 'receivestatemode', 'receivestateselected', 'receivestatescriptlabelhtml', 'receivestatetype', 'sendeventontouch', 'backgroundimageurl', 'backgroundimagefilltype', 'receivestatebackgroundimageurl', 'receivestatecustomclass', 'receivestatecustomstyle', 'disabled', 'show', 'customclass', 'customstyle'
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
		this.logger.start('connectedCallback()', Ch5SliderButton.ELEMENT_NAME);
		this.setAttribute('data-ch5-id', this.getCrId());
		this.buttonIgnoredAttributes();
		if (!(this.parentElement?.classList.contains('slider-on-button') || this.parentElement?.classList.contains('slider-off-button'))) {
			return;
		}
		if (this.getAttribute('key')) {
			if (this.getAttribute('key')?.toLowerCase() !== 'on' && this.getAttribute('key')?.toLowerCase() !== 'off') {
				return;
			}
		}
		super.connectedCallback();
		this.initAttributes();
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
		super.initAttributes();
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
		this.debounceCreateSliderButton();
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

	public setValues() {
		// if (elem === "label" && this.labelInnerHTML === "" && !(this.receiveStateLabel !== null && this.receiveStateLabel.trim() !== "")) {
		// 	console.log("val.innerHTML", this.labelInnerHTML, val.innerHTML);
		// 	// this.label = val.innerHTML;
		// }
		if (this.receiveStateLabel === "") {
			// this.label = val.innerHTML;
			this.debounceCreateSliderButton();
		}
	}

	private handleLabel() {
		if (this.receiveStateLabel !== null && this.receiveStateLabel.trim() !== "") {
			// Do Nothing
		} else if (this.hasAttribute("labelInnerHtml")) {
			// this.labelHelper();
		} else if (this.getElementsByTagName("ch5-slider-button-label").length >= 1) {
			this.labelHelper();
		}
	}

	public setButtonDisplay() {
		this.setButtonDisplayDetails("ch5-slider-button");
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
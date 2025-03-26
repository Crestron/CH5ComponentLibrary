import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

import { ICh5LabelAttributes } from './interfaces/i-ch5-label-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5Label extends Ch5Common implements ICh5LabelAttributes {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatelabel: { direction: "state", stringJoin: 1, contractName: true }
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "label",
			nameForSignal: "receiveStateLabel",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateLabel",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
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

	public static readonly ELEMENT_NAME = 'ch5-label';

	public primaryCssClass = 'ch5-label';

	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;
	public templateElement: HTMLTemplateElement = {} as HTMLTemplateElement;
	private parentElem: string = "";
	protected labelRec: string = "";

	//#endregion

	//#region Getters and Setters

	public set label(value: string) {
		this._ch5Properties.set<string>("label", value, () => {
			this.handleLabel();
			this.label = this._getTranslatedValue('label', this.label);
		});
		// if (this.label) {
		// 	this.classList.add("ch5-slider-title");
		// } else {
		// 	this.classList.remove("ch5-slider-title");
		// }
	}
	public get label(): string {
		return this._ch5Properties.get<string>("label");
	}

	public set labelInnerHTML(value: string) {
		this._ch5Properties.set<string>("labelInnerHTML", value, () => {
			this.handleLabel();
		});
	}
	public get labelInnerHTML(): string {
		return this._ch5Properties.get<string>("labelInnerHTML");
	}

	public set receiveStateLabel(value: string) {
		this._ch5Properties.set("receiveStateLabel", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("label", newValue, () => {
				this.labelRec = newValue;
				this.handleLabel();
			});
		});
	}
	public get receiveStateLabel(): string {
		return this._ch5Properties.get<string>('receiveStateLabel');
	}

	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Label.ELEMENT_NAME, Ch5Label.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Label.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Label.ELEMENT_NAME, Ch5Label);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor(public _parent?: string) {
		super();
		this.logger.start('constructor()', Ch5Label.ELEMENT_NAME);
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		if (_parent) {
			this.parentElem = _parent;
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5Label.COMPONENT_PROPERTIES);
		this.updateCssClass();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Label.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Label.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Label.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-label attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5Label.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.logger.stop();
	}

	/**
	 * Called when the Ch5Label component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5Label.ELEMENT_NAME);
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			// this.setAttribute('role', Ch5RoleAttributeMapping.ch5Label);
		}
		if (this._elContainer.parentElement !== this && this.parentElem === "") {
			this._elContainer.classList.add('ch5-label');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.updateCssClass();
		this.initCommonMutationObserver(this);
		this.handleLabel();
		customElements.whenDefined('ch5-label').then(() => {
			this.componentLoadedEvent(Ch5Label.ELEMENT_NAME, this.id);
		});
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
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer = document.createElement('div');
		this.logger.stop();
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5Label.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Label.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Label.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Label.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected attachEventListeners() {
		super.attachEventListeners();
	}

	protected removeEventListeners() {
		super.removeEventListeners();
	}

	protected unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	protected handleLabel() {
		if (!(this.templateElement instanceof HTMLTemplateElement)) {
			this.templateElement = this.getElementsByTagName('template')[0] as HTMLTemplateElement;
		}
		Array.from(this._elContainer.children).forEach(container => container.remove());

		this._elContainer.innerText = '';
		if (this.receiveStateLabel !== null && this.receiveStateLabel.trim() !== "") {
			this._elContainer.innerText = this.label;
		} else if (Ch5Common.isNotNil(this.labelInnerHTML)) {
			this._elContainer.innerHTML = this.decodeInnerHTMLForAttribute(this.labelInnerHTML);
		} else if (this.templateElement instanceof HTMLTemplateElement) {
			const documentContainer: HTMLTemplateElement = document.createElement('template');
			documentContainer.innerHTML = this.templateElement.innerHTML;
			this._elContainer.appendChild(((documentContainer as HTMLTemplateElement).content));
		} else {
			this._elContainer.innerText = this.label;
		}
	}

	private decodeInnerHTMLForAttribute(innerHTML: string) {
		return innerHTML.replace('&amp;', "&")
			.replace('&lt;', "<")
			.replace('&gt;', ">")
			.replace('&quot;', '/"')
			.replace("&apos;", "/'");
	}

	protected updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();
		this._elContainer.classList.add("ch5-label");
		this.logger.stop();
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

}

Ch5Label.registerCustomElement();
Ch5Label.registerSignalAttributeTypes();

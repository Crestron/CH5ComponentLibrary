import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5MpIndividualIconButton extends Ch5Common {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateiconclass: { direction: "state", stringJoin: 1, contractName: true },

	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "iconClass",
			nameForSignal: "receiveStateIconClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,

		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateIconClass",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",

			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "label",
			nameForSignal: "",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,

		},
	];

	public static readonly ELEMENT_NAME = 'ch5-mp-individual-icon-button';

	public primaryCssClass = 'ch5-mp-individual-icon-button';

	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;
	private _icon: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters


	public set iconClass(value: string) {
		this._ch5Properties.set<string>("iconClass", value, () => {
			this.handleIconClass(value);
		});
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>("iconClass");
	}

	public set label(value: string) {
		this._ch5Properties.set<string>("label", value, () => {
			this.handleIconClass(value);
		});
	}
	public get label(): string {
		return this._ch5Properties.get<string>("label");
	}

	public set receiveStateIconClass(value: string) {
		this._ch5Properties.set("receiveStateIconClass", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("iconClass", newValue, () => {
				this.handleReceiveStateIconClass();
			});
		});
	}
	public get receiveStateIconClass(): string {
		return this._ch5Properties.get<string>('receiveStateIconClass');
	}


	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5MpIndividualIconButton.ELEMENT_NAME, Ch5MpIndividualIconButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5MpIndividualIconButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5MpIndividualIconButton.ELEMENT_NAME, Ch5MpIndividualIconButton);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5MpIndividualIconButton.ELEMENT_NAME);
		this.ignoreAttributes = [];
		this._ch5Properties = new Ch5Properties(this, Ch5MpIndividualIconButton.COMPONENT_PROPERTIES);
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;

		this.updateCssClass();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5MpIndividualIconButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5MpIndividualIconButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5MpIndividualIconButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-mp-individual-icon-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5MpIndividualIconButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5MpIndividualIconButton component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5MpIndividualIconButton.ELEMENT_NAME);
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-mp-individual-icon-button');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);

		customElements.whenDefined('ch5-mp-individual-icon-button').then(() => {
			this.componentLoadedEvent(Ch5MpIndividualIconButton.ELEMENT_NAME, this.id);
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
		this.classList.add('ch5-mp-individual-icon-button-container');
		this._elContainer = document.createElement('button');

		this.setAttribute('iconClass', this.iconClass || 'fas fa-music');
		this._icon = document.createElement('i');
		this._icon.classList.add(...this.iconClass.split(' '));
		this._elContainer.appendChild(this._icon);
		this.logger.stop();
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5MpIndividualIconButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5MpIndividualIconButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5MpIndividualIconButton.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5MpIndividualIconButton.COMPONENT_PROPERTIES[i].name;
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


	private handleIconClass(value: string) {
		// Enter your Code here
		if (this._icon.classList && value) {
			this._icon.classList.remove(...Array.from(this._icon.classList));
			this._icon.classList.add(...value.split(' '));
		}

		this.updateCssClass();
	}
	private handleReceiveStateIconClass() {
		// Enter your Code here
	}

	private updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();

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

Ch5MpIndividualIconButton.registerCustomElement();
Ch5MpIndividualIconButton.registerSignalAttributeTypes();

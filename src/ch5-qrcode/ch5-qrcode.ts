import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5QrcodeAttributes } from './interfaces/i-ch5-qrcode-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5Qrcode extends Ch5Common implements ICh5QrcodeAttributes {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateqrcode: { direction: "state", stringJoin: 1, contractName: true },
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "qrcode",
			nameForSignal: "receiveStateQrcode",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateQrCode",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
	];

	public static readonly ELEMENT_NAME = 'ch5-qrcode';

	public primaryCssClass = 'ch5-qrcode';

	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters


	public set qrcode(value: string) {
		this._ch5Properties.set<string>("qrcode", value, () => {
			this.handleQrcode();
		});
	}
	public get qrcode(): string {
		return this._ch5Properties.get<string>("qrcode");
	}

	public set receiveStateQrCode(value: string) {
		this._ch5Properties.set("receiveStateQrCode", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<number>("qrcode", newValue, () => {
				this.handleReceiveStateQrCode();
			});
		});
	};
	public get receiveStateQrCode(): string {
		return this._ch5Properties.get<string>('receiveStateQrCode');
	}


	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Qrcode.ELEMENT_NAME, Ch5Qrcode.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Qrcode.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Qrcode.ELEMENT_NAME, Ch5Qrcode);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5Qrcode.ELEMENT_NAME);
		this.ignoreAttributes = ["appendclasswheninviewport", "customclass", "customstyle", "disabled", "receivestatecustomclass", "receivestatecustomstyle", "receivestateenable", "receivestateshowpulse", "receivestatehidepulse", "sendeventonshow",];
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5Qrcode.COMPONENT_PROPERTIES);
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Qrcode.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Qrcode.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Qrcode.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-qrcode attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5Qrcode.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5Qrcode component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5Qrcode.ELEMENT_NAME);
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Qrcode);
		}
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-qrcode');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);

		customElements.whenDefined('ch5-qrcode').then(() => {
			this.componentLoadedEvent(Ch5Qrcode.ELEMENT_NAME, this.id);
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
		for (let i: number = 0; i < Ch5Qrcode.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Qrcode.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Qrcode.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Qrcode.COMPONENT_PROPERTIES[i].name;
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


	private handleQrcode() {
		// Enter your Code here
	}
	private handleReceiveStateQrCode() {
		// Enter your Code here
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

}

Ch5Qrcode.registerCustomElement();
Ch5Qrcode.registerSignalAttributeTypes();

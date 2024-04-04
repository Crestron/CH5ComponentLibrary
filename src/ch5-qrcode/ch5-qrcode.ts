import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5QrCodeAttributes } from './interfaces/i-ch5-qrcode-attributes';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Base } from "../ch5-common/ch5-base";
import QRCode from "qrcode";

export class Ch5QrCode extends Ch5Base implements ICh5QrCodeAttributes {

	//#region Variables
	protected COMPONENT_NAME = "Ch5QrCode";

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Base.SIGNAL_ATTRIBUTE_TYPES,
		receivestateqrcode: { direction: "state", stringJoin: 1, contractName: true },
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "qrCode",
			nameForSignal: "receiveStateQrCode",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateQrCode",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		Ch5Base.COMMON_PROPERTIES.appendClassWhenInViewport,
		Ch5Base.COMMON_PROPERTIES.debug,
		Ch5Base.COMMON_PROPERTIES.id,
		Ch5Base.COMMON_PROPERTIES.noshowType,
		Ch5Base.COMMON_PROPERTIES.receiveStateShow,
		Ch5Base.COMMON_PROPERTIES.show,
		Ch5Base.COMMON_PROPERTIES.trace
	];

	// dir 
	public static readonly ELEMENT_NAME = 'ch5-qrcode';

	public primaryCssClass = 'ch5-qrcode';

	private _elContainer: HTMLElement = {} as HTMLElement;
	private _canvasContainer: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters

	public set qrCode(value: string) {
		this._ch5Properties.set<string>("qrCode", value, () => {
			this.handleQrCode(value);
		});
	}
	public get qrCode(): string {
		return this._ch5Properties.get<string>("qrCode");
	}

	public set receiveStateQrCode(value: string) {
		this._ch5Properties.set("receiveStateQrCode", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<number>("qrCode", newValue, () => {
				this.handleReceiveStateQrCode();
			});
		});
	}
	public get receiveStateQrCode(): string {
		return this._ch5Properties.get<string>('receiveStateQrCode');
	}


	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5QrCode.ELEMENT_NAME, Ch5QrCode.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5QrCode.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5QrCode.ELEMENT_NAME, Ch5QrCode);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super(Ch5QrCode.COMPONENT_PROPERTIES);
		this.logger.start('constructor()');
		if (!this._isInstantiated) {
			this.createInternalHtml();
		}
		this._isInstantiated = true;
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs: ICh5PropertySettings[] = Ch5QrCode.COMPONENT_PROPERTIES;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < inheritedObsAttrs.length; i++) {
			if (inheritedObsAttrs[i].isObservableProperty === true) {
				newObsAttrs.push(inheritedObsAttrs[i].name.toLowerCase());
			}
		}
		return newObsAttrs;
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback");
		if (oldValue !== newValue) {
			this.logger.log('attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5QrCode.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
				// } else {
				//   super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.logger.stop();
	}

	/**
	 * Called when the Ch5QrCode component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()');
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5QrCode);
		}
		// if (this._elContainer.parentElement !== this) {
		// 	this._elContainer.classList.add('ch5-qrcode');
		// 	this.appendChild(this._elContainer);
		// }
		this.initAttributes();
		this.initCommonMutationObserver(this);

		customElements.whenDefined('ch5-qrcode').then(() => {
			this.componentLoadedEvent(Ch5QrCode.ELEMENT_NAME, this.id);
		});
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.unsubscribeFromSignals();
		this.logger.stop();
	}

	//#endregion

	//#region Protected / Private Methods

	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer = document.createElement('div');
		this._canvasContainer = document.createElement('canvas');
		this._elContainer.appendChild(this._canvasContainer);
		this._elContainer.classList.add(this.primaryCssClass);
		this.appendChild(this._elContainer);
		this.logger.stop();
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5QrCode.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5QrCode.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5QrCode.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5QrCode.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}


	protected unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		//TODO - improve the method.
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	private handleQrCode(data: string) {
		QRCode.toCanvas(this._canvasContainer, data, function (error) {
			if (error) { console.error(error); }
		});
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

Ch5QrCode.registerCustomElement();
Ch5QrCode.registerSignalAttributeTypes();

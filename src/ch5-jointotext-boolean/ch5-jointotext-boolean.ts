import { Ch5Common } from "../ch5-common/ch5-common";
import { ICh5JoinToTextBooleanAttributes } from "./interfaces";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5JoinToTextBoolean extends Ch5Common implements ICh5JoinToTextBooleanAttributes {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", booleanJoin: 1, contractName: true }
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: false,
			name: "value",
			nameForSignal: "receiveStateValue",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		},
		{
			default: "",
			name: "textWhenTrue",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "textWhenFalse",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateValue",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
	];

	public static readonly ELEMENT_NAME = 'ch5-jointotext-boolean';

	private _ch5Properties: Ch5Properties;

	//#endregion

	//#region Setters and Getters

	public set value(value: boolean) {
		this._ch5Properties.set<boolean>("value", value, () => {
			this.toggleText();
		});
	}
	public get value(): boolean {
		return this._ch5Properties.get<boolean>("value");
	}
	public set textWhenTrue(value: string) {
		this._ch5Properties.set<string>("textWhenTrue", value, () => {
			this.toggleText();
		});
	}
	public get textWhenTrue(): string {
		return this._ch5Properties.get<string>("textWhenTrue");
	}

	public set textWhenFalse(value: string) {
		this._ch5Properties.set<string>("textWhenFalse", value, () => {
			this.toggleText();
		});
	}
	public get textWhenFalse(): string {
		return this._ch5Properties.get<string>("textWhenFalse");
	}

	public set receiveStateValue(value: string) {
		this._ch5Properties.set("receiveStateValue", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("value", newValue, () => {
				this.toggleText();
			});
		});
	}
	public get receiveStateValue(): string {
		return this._ch5Properties.get<string>('receiveStateValue');
	}

	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5JoinToTextBoolean.ELEMENT_NAME, Ch5JoinToTextBoolean.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5JoinToTextBoolean.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5JoinToTextBoolean.ELEMENT_NAME, Ch5JoinToTextBoolean);
		}
	}

	//#endregion

	//#region Component LifeCycle

	public constructor() {
		super();
		this._ch5Properties = new Ch5Properties(this, Ch5JoinToTextBoolean.COMPONENT_PROPERTIES);
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5JoinToTextBoolean.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5JoinToTextBoolean.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5JoinToTextBoolean.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public connectedCallback() {
		this.initAttributes();
		customElements.whenDefined(Ch5JoinToTextBoolean.ELEMENT_NAME).then(() => {
			this.toggleText(); // This is to handle specific case where the formatValue isn't called as component attributes are set to "default" values.
		});
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5JoinToTextBoolean.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5JoinToTextBoolean.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5JoinToTextBoolean.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5JoinToTextBoolean.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	public disconnectedCallback() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-jointotext-boolean attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5JoinToTextBoolean.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

	//#endregion

	//#region Private Methods

	private toggleText() {
		if (this.value === true) {
			this.textContent = this._getTranslatedValue('textwhentrue', this.textWhenTrue);
			return;
		} else if (this.value === false) {
			this.textContent = this._getTranslatedValue('textwhenfalse', this.textWhenFalse);
			return;
		}
		this.textContent = '';
	}


	//#endregion
}

Ch5JoinToTextBoolean.registerCustomElement();
Ch5JoinToTextBoolean.registerSignalAttributeTypes();

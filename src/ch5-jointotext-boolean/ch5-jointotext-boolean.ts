import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { Ch5Signal, Ch5SignalFactory } from "..";
import { ICh5JoinToTextBooleanAttributes } from "./interfaces";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

export class Ch5JoinToTextBoolean extends Ch5Common implements ICh5JoinToTextBooleanAttributes {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", booleanJoin: 1, contractName: true }
	};

	public static readonly ELEMENT_NAME = 'ch5-jointotext-boolean';

	private _value: boolean = false;
	private _textWhenTrue: string = '';
	private _textWhenFalse: string = '';
	private _receiveStateValue: string = '';
	private _subReceiveStateValue: string = '';

	//#endregion

	//#region Setters and Getters

	public set value(value: boolean) {
		if (value !== this.value) {
			if (isNil(value)) {
				value = false;
			}
			this._value = value;
			this.setAttribute('value', value + '');
			this.toggleText();
		}
	}

	public get value(): boolean {
		return this._value;
	}

	public set textWhenTrue(value: string) {
		if (value !== this._textWhenTrue) {
			if (isNil(value)) {
				value = '';
			}
			this._textWhenTrue = value;
			this.setAttribute('textWhenTrue', value);
			this.toggleText();
		}
	}

	public get textWhenTrue(): string {
		return this._textWhenTrue;
	}

	public set textWhenFalse(value: string) {
		if (value !== this._textWhenFalse) {
			if (isNil(value)) {
				value = '';
			}
			this._textWhenFalse = value;
			this.setAttribute('textWhenFalse', value);
			this.toggleText();
		}
	}

	public get textWhenFalse(): string {
		return this._textWhenFalse;
	}

	public set receiveStateValue(value: string) {
		if (isNil(value)) {
			return;
		}

		if (this.receiveStateValue !== ''
			&& this.receiveStateValue !== undefined
			&& this.receiveStateValue !== null
		) {
			const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
			const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveStateValue);
			}
		}

		this._receiveStateValue = value;
		this.setAttribute('receivestatevalue', value);

		// setup new subscription.
		const sigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
		const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(sigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveStateValue = receiveSignal.subscribe((newValue: boolean) => {
			if (newValue !== this.value) {
				this.setAttribute('value', newValue + '');
			}
		});
	}

	public get receiveStateValue(): string {
		return this._receiveStateValue;
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
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs = [
			'value',
			'textwhentrue',
			'textwhenfalse',
			'receivestatevalue',
		];
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
		if (this.hasAttribute('textwhentrue')) {
			this.textWhenTrue = this.getAttribute('textwhentrue') as string;
		}

		if (this.hasAttribute('textwhenfalse')) {
			this.textWhenFalse = this.getAttribute('textwhenfalse') as string;
		}

		if (this.hasAttribute('receivestatevalue')) {
			this.receiveStateValue = this.getAttribute('receivestatevalue') as string;
		}

		if (this.hasAttribute('value')) {
			this.value = this.convertValueToBoolean(this.getAttribute('value') as string);
		} else {
			this.value = false;
		}
	}

	public disconnectedCallback() {
		const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
		const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldSigName);

		if (oldSignal !== null) {
			oldSignal.unsubscribe(this._subReceiveStateValue);
			this._receiveStateValue = "";
		}
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		if (oldValue === newValue) {
			return;
		}

		switch (attr) {
			case 'value':
				this.value = this.convertValueToBoolean(newValue);
				break;
			case 'textwhentrue':
				this.textWhenTrue = newValue;
				break;
			case 'textwhenfalse':
				this.textWhenFalse = newValue;
				break;
			case 'receivestatevalue':
				this.receiveStateValue = newValue;
				break;
			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
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

	private convertValueToBoolean(value: string) {
		return value === "true";
	}

	//#endregion
}

Ch5JoinToTextBoolean.registerCustomElement();
Ch5JoinToTextBoolean.registerSignalAttributeTypes();

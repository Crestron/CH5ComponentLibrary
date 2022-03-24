import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { Ch5Signal, Ch5SignalFactory } from "..";
import { ICh5JoinToTextBooleanAttributes } from "./interfaces";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

export class Ch5JoinToTextBoolean extends Ch5Common implements ICh5JoinToTextBooleanAttributes {

	//#region " Variables "
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

	//#region " Setters and Getters "

	public set value(value: boolean) {
		if (isNil(value)) {
			return;
		}

		this._value = value;
		this.setAttribute('value', value + '');
		this.toggleText(value);
	}

	public get value(): boolean {
		return this._value;
	}

	public set textWhenTrue(value: string) {
		this._textWhenTrue = value;
		this.setAttribute('textWhenTrue', value);
	}

	public get textWhenTrue(): string {
		return this._textWhenTrue;
	}

	public set textWhenFalse(value: string) {
		this._textWhenFalse = value;
		this.setAttribute('textWhenFalse', value);
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
			const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
				.getBooleanSignal(oldSigName);

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

	//#region " Static Methods "

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

	private toggleText(value: boolean) {
		if (value === true) {
			this.textContent = this.textWhenTrue;
			return;
		} else if (value === false) {
			this.textContent = this.textWhenFalse;
			return;
		}
		this.textContent = '';
	}

	private convertValueToBoolean(value: string) {
		return value === "true";
	}

}

Ch5JoinToTextBoolean.registerCustomElement();
Ch5JoinToTextBoolean.registerSignalAttributeTypes();

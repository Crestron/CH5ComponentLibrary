import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { Ch5Signal, Ch5SignalFactory } from "..";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5JoinToTextStringAttributes } from "./interfaces/i-ch5-jointotext-string-attributes";

export class Ch5JoinToTextString extends Ch5Common implements ICh5JoinToTextStringAttributes {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", stringJoin: 1, contractName: true },
	};
	public static readonly ELEMENT_NAME = 'ch5-jointotext-string';

	private _receiveStateValue: string = '';
	private _textWhenEmpty: string = '';
	private _value: string = '';
	private _subReceiveStateValue: string = '';

	//#endregion

	//#region Getters and Setters

	public set textWhenEmpty(value: string) {
		if (this._textWhenEmpty !== value) {
			if (isNil(value)) {
				value = "";
			}

			this._textWhenEmpty = value;
			this.setAttribute('textWhenEmpty', value);
			this.setTextContent();
		}
	}

	public get textWhenEmpty(): string {
		return this._textWhenEmpty;
	}

	public set receiveStateValue(value: string) {
		if (this._receiveStateValue !== value) {
			if (isNil(value)) {
				return;
			}

			if (this.receiveStateValue !== ''
				&& this.receiveStateValue !== undefined
				&& this.receiveStateValue !== null
			) {
				const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
				const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);

				if (oldSignal !== null) {
					oldSignal.unsubscribe(this._subReceiveStateValue);
				}
			}

			this._receiveStateValue = value;
			this.setAttribute('receivestatevalue', value);

			// setup new subscription.
			const sigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
			const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigName);

			if (receiveSignal === null) {
				return;
			}

			this._subReceiveStateValue = receiveSignal.subscribe((newValue: string) => {
				if (newValue !== this.value) {
					this.setAttribute('value', newValue + '');
				}
			});
		}
	}

	public get receiveStateValue(): string {
		return this._receiveStateValue;
	}

	public set value(value: string) {
		if (this._value !== value) {
			if (isNil(value)) {
				value = "";
			}
			this._value = value;
			this.setAttribute('value', value + '');
			this.setTextContent();
		}
	}

	public get value(): string {
		return this._value;
	}

	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5JoinToTextString.ELEMENT_NAME, Ch5JoinToTextString.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5JoinToTextString.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5JoinToTextString.ELEMENT_NAME, Ch5JoinToTextString);
		}
	}

	//#endregion

	//#region Component LifeCycle

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs = [
			'value',
			'textwhenempty',
			'receivestatevalue'
		];
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public connectedCallback() {
		if (this.hasAttribute('textwhenempty')) {
			this.textWhenEmpty = this.getAttribute('textwhenempty') as string;
		}

		if (this.hasAttribute('value')) {
			this.value = this.getAttribute('value') as string;
		} else {
			this.value = '';
		}

		if (this.hasAttribute('receivestatevalue')) {
			this.receiveStateValue = this.getAttribute('receivestatevalue') as string;
		}

		customElements.whenDefined(Ch5JoinToTextString.ELEMENT_NAME).then(() => {
			this.setTextContent(); // This is to handle specific case where the formatValue isn't called as component attributes are set to "default" values.
		});
	}

	public disconnectedCallback() {
		const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
		const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);

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
				this.value = newValue;
				break;
			case 'textwhenempty':
				this.textWhenEmpty = newValue;
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

	private setTextContent() {
		if (!this.value) {
			this.textContent = this._getTranslatedValue('textwhenempty', this.textWhenEmpty);
			return;
		}
		this.textContent = this._getTranslatedValue('value', this.value);
	}

	//#endregion

}

Ch5JoinToTextString.registerCustomElement();
Ch5JoinToTextString.registerSignalAttributeTypes();
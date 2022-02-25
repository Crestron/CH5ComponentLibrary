import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { Ch5Signal, Ch5SignalFactory } from "..";
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5JoinToTextStringAttributes } from "./interfaces/i-ch5-jointotext-string-attributes";

export class Ch5JoinToTextString extends Ch5Common implements ICh5JoinToTextStringAttributes {

    public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
	};
    
    private _receiveStateValue: string = '';
    private _textWhenEmpty: string = '';
    private _value: string = '';

    private _subReceiveStateValue: string = '';


    public static get observedAttributes(): string[] {
        return [
            'value',
            'textwhenempty',
            'receivestatevalue',
        ]
    }

    public connectedCallback() {
        
        if (this.hasAttribute('textwhenempty')) {
            this.textWhenEmpty = this.getAttribute('textwhenempty') + '';
        }
        
        if (this.hasAttribute('value')) {
            this.value = this.getAttribute('value') + '';
        } else {
            this.value = '';
        }

        if (this.hasAttribute('receivestatevalue')) {
            this.receiveStateValue = this.getAttribute('receivestatevalue') + '';
        }
    }

    public disconnectedCallback() {
        const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
        const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
        .getStringSignal(oldSigName);
        
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
            case 'receviestatevalue':
                this.receiveStateValue = newValue;
                break;
        }
    }

    public set textWhenEmpty(value: string) {
        if (isNil(value)) {
            return;
        }

        this._textWhenEmpty = value;
        this.setAttribute('textWhenEmpty', value);
    }

    public get textWhenEmpty(): string {
        return this._textWhenEmpty;
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
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(oldSigName);
            
            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveStateValue);
            }
        }
        
        this._receiveStateValue = value;
        this.setAttribute('receivestatevalue', value);

        // setup new subscription.
        const sigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveStateValue = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this.value) {
                this.setAttribute('value', newValue + '');
            }
        });
    }

    public get receiveStateValue(): string {
        return this._receiveStateValue;
    }

    public set value(value: string) {
  
        this._value = value;
        this.replaceText(value);
    }

    public get value(): string {
        return this._value;
    }

    public replaceText(value: string) {
        if (!this.value) {
            this.textContent = this.textWhenEmpty;
            return;
        }

        this.textContent = value;
    }

}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-jointotext-string', Ch5JoinToTextString);

}

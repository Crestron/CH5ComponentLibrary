import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { Ch5Signal, Ch5SignalFactory } from "..";
import { ICh5JoinToTextBooleanAttributes } from "./interfaces";
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

export class Ch5JoinToTextBoolean extends Ch5Common implements ICh5JoinToTextBooleanAttributes {

    private _value: string = 'false'; 
    private _textWhenTrue: string = '';
    private _textWhenFalse: string = '';
    private _receiveStateValue: string = '';

    private _subReceiveStateValue: string = '';

    public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
	};

    public static get observedAttributes(): string[] {
        return [
            'value',
            'textwhentrue',
            'textwhenfalse',
            'receivestatevalue',
        ]
    }

    public connectedCallback() {

        if (this.hasAttribute('textwhentrue')) {
            this.textWhenTrue = this.getAttribute('textwhentrue') + '';
        }

        if (this.hasAttribute('textwhenfalse')) {
            this.textWhenFalse = this.getAttribute('textwhenfalse') + '';
        }

        if (this.hasAttribute('receivestatevalue')) {
            this.receiveStateValue = this.getAttribute('receivestatevalue') + '';
        }

        if (this.hasAttribute('value')) {
            this.value = this.getAttribute('value') + '';
        } else {
            this.value = 'false';
        }
    }

    public disconnectedCallback() {
        const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
        const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
        .getBooleanSignal(oldSigName);
        
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
            case 'textwhentrue':
                this.textWhenTrue = newValue;
                break;
            case 'textwhenfalse':
                this.textWhenFalse = newValue;
                break;
            case 'receivestatevalue':
                this.receiveStateValue = newValue;
                break;
        }
    }

    public toggleText(value: boolean) {
        if (value === true) {
            this.replaceTextContent(this.textWhenTrue);
            return;
        } else if (value === false) {
            this.replaceTextContent(this.textWhenFalse);
            return;
        }

        this.replaceTextContent('');
    }

    public replaceTextContent(text: string) {
        this.textContent = text;
    }

    public set value(value: string) {
        if (isNil(value)) {
            return;
        }

        this._value = value;
        this.setAttribute('value', value);
        this.toggleText(this.convertValueToBoolean());
    }

    public get value(): string {
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
        const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveStateValue = receiveSignal.subscribe((newValue: boolean) => {
            if (newValue !== this.convertValueToBoolean()) {
                this.setAttribute('value', newValue + '');
            }
        });
    }

    public get receiveStateValue(): string {
        return this._receiveStateValue;
    }

    public convertValueToBoolean() {
        return this.value === "true";
    }

}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-jointotext-boolean', Ch5JoinToTextBoolean);

}

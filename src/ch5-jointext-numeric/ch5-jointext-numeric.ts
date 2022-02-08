import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { NumericFormatFactory } from "./format/numeric-format-factory";
import { NumericFormats } from "./format/numeric-formats";
import { NumericFormat } from "./format/numeric-format";
import { Ch5Signal, Ch5SignalFactory } from "..";

export class Ch5JointextNumeric extends Ch5Common {

    private _receiveStateValue: string = '';
    private _subReceiveStateValue: string = '';
    private _value: string = '';
    private _formattedValue: number | null = null;
    private _type: NumericFormats = NumericFormats.decimal;

    private _numericFormatFactory = NumericFormatFactory.getInstance();
    private _currentNumericFormat: NumericFormat;

    public constructor() {
        super();

        this._currentNumericFormat = this._numericFormatFactory.getFormat(this.type);
    }

    public static get observedAttributes(): string[] {
        return [
            'receiveStateValue',
            'value',
            'type',
        ]
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        switch (attr) {
            case 'value':
                this.value = newValue;
                break;
            case 'receivestatevalue':
                this.receiveStateValue = newValue;
                break;
            case 'type':
                this.type = newValue as NumericFormats;
                break;
        }
    }

    public connectedCallback() {
        if (this.hasAttribute('value')) {
            this.value = this.getAttribute('value') + '';
        }

        if (this.hasAttribute('receivestatevalue')) {
            this.receiveStateValue = this.getAttribute('receivestatevalue') + '';
        }

        if (this.hasAttribute('type')) {
            this.type = this.getAttribute('type') as NumericFormats;
        }
    }

    public disconnectedCallback() {
        const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
        const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(oldSigName);
        
        if (oldSignal !== null) {
            oldSignal.unsubscribe(this._subReceiveStateValue);
        }
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
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(oldSigName);
            
            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveStateValue);
            }
        }
        
        
        this._receiveStateValue = value;
        this.setAttribute('receivestatevalue', value);

        // setup new subscription.
        const sigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
        const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveStateValue = receiveSignal.subscribe((newValue: number) => {
            if (newValue !== parseFloat(this.value)) {
                this.setAttribute('value', newValue + '');
            }
        });
    }

    public get receiveStateValue(): string {
        return this._receiveStateValue;
    }

    public set value(value: string) {
        this._value = value;
        this.setAttribute('value', value); 
    }

    public get value(): string {
        return this._value;
    }

    public set type(value: NumericFormats) {
        this._type = value;
        this.setAttribute('type', value);

        this._currentNumericFormat = this._numericFormatFactory.getFormat(value);

        this.formattedValue = this._currentNumericFormat.format(parseFloat(this.value));
    }

    public get type(): NumericFormats {
        return this._type;
    }

    public replceTextContent(value: string) {
        this.textContent = value;
    }

    public set formattedValue(value: number | null) {
        this._formattedValue = value;
        this.replceTextContent(value + '');

    }

    public get formattedValue(): number | null {
        return this._formattedValue;
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-jointext-numeric', Ch5JointextNumeric);

}

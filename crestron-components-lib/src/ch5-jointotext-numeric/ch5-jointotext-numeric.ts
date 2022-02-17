import { Ch5Common } from "../ch5-common/ch5-common";
import { isNil } from 'lodash';
import { NumericFormatFactory } from "./format/numeric-format-factory";
import { NumericFormats } from "./format/numeric-formats";
import { NumericFormat } from "./format/numeric-format";
import { Ch5Signal, Ch5SignalFactory } from "..";
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

export class Ch5JoinToTextNumeric extends Ch5Common {

    public static PERCENTAGE_MAX = 65535;

    private _receiveStateValue: string = '';
    private _subReceiveStateValue: string = '';
    private _value: string = '';

    // decimal related attributes
    private _decimalLength: number = 0;
    private _length: number = 0;

    // percetage related attributes
    private _min: number = 0;
    private _max: number = Ch5JoinToTextNumeric.PERCENTAGE_MAX;

    private _formattedValue: string | number | null = null;
    private _type: NumericFormats = NumericFormats.signed;

    private _numericFormatFactory = NumericFormatFactory.getInstance();
    private _currentNumericFormat: NumericFormat;

    public constructor() {
        super();

        this._currentNumericFormat = this._numericFormatFactory.getFormat(this.type);
    }

    public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
	};

    public static get observedAttributes(): string[] {
        return [
            'receiveStateValue',
            'value',
            'type',
            'length',
            'decimallength',
            'min',
            'max',
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
            case 'decimallength':
                this.decimalLength = parseFloat(newValue);
                break;
            case 'length':
                this.length = parseFloat(newValue);
                break;
            case 'min':
                this.min = parseFloat(newValue);
                break;
            case 'max':
                this.max = parseFloat(newValue);
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
        this.formatValue();
    }

    public get value(): string {
        return this._value;
    }

    public set type(value: NumericFormats) {
        this._type = value;
        this.setAttribute('type', value);

        this._currentNumericFormat = this._numericFormatFactory.getFormat(value);

        this.formatValue();
    }

    public get type(): NumericFormats {
        return this._type;
    }

    public set decimalLength(value: number) {
        this._decimalLength = value;
        this.setAttribute('decimalLength', value + '');

        this.formatValue();
    }

    public get decimalLength(): number {
        return this._decimalLength;
    }

    public set length(value: number) {
        this._length = value;
        this.setAttribute('length', value + '');
        this.formatValue();
    }

    public get length(): number { 
        return this._length;
    }

    public set min(value: number) {
        if (isNil(value)) {
            this._min = 0;
            
            if (this.type === NumericFormats.percentage) {
                this.setAttribute('min', value + '');
                this.formatValue();
            }
            return;
        }
        
        this._min = value;
        this.setAttribute('min', value + '');
        this.formatValue();
    }

    public get min(): number {
        return this._min;
    }

    public set max(value: number) {
        if (isNil(value)) {
            this._max = Ch5JoinToTextNumeric.PERCENTAGE_MAX;

            if (this.type === NumericFormats.percentage) {
                this.setAttribute('max', value);
                this.formatValue();
            }
            return;
        }

        this._max = value;
        this.setAttribute('max', value + '');
        this.formatValue();
    }

    public get max(): number {
        return this._max;
    }

    public replaceTextContent(value: string) {
        this.textContent = value;
    }

    public set formattedValue(value: string | number | null) {
        this._formattedValue = value;
        this.replaceTextContent(value + '');

    }

    public get formattedValue(): string | number | null {
        return this._formattedValue;
    }

    private formatValue() {
        this.formattedValue = this._currentNumericFormat.format(parseFloat(this.value), {
            decimalLength: this.decimalLength,
            length: this.length,
            min: this.min,
            max: this.max,
        });
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-jointotext-numeric', Ch5JoinToTextNumeric);

}

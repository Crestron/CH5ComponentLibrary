import { NumericFormat } from "./numeric-format";
import _ from "lodash";
export type FloatFormatOptions = {
    decimalLength: number;
    length: number;
}

export class FloatFormat extends NumericFormat {

    public static MAX_ANALOG: number = 65535;
    public static HALF_MAX_ANALOG: number = 32767;
    public static MIN_ANALOG: number = -65535;
    public static HALF_MIN_ANALOG: number = -32768;

    public format(value: number, {decimalLength, length}: FloatFormatOptions): string {
        if (isNaN(value)){
            return "0".padStart(length - decimalLength,"0") + "." + "0".padEnd(decimalLength,"0")
        }
        // holds the negative sign if the number is negative.
        let sign = (!_.isNil(value) && String(value) !== "" && !isNaN(value)) ? ((value < 0) ? "-" : "") : "";
        if (value > FloatFormat.HALF_MAX_ANALOG) {
            sign = "-";	
            value = value > FloatFormat.MAX_ANALOG ? FloatFormat.MAX_ANALOG : value;
            value -= FloatFormat.MAX_ANALOG + 1;
        } else if (value < FloatFormat.HALF_MIN_ANALOG){	
            sign = "";	
            value = value > FloatFormat.MIN_ANALOG ? value : FloatFormat.MIN_ANALOG;	
            value += FloatFormat.MAX_ANALOG + 1;	
        }
        value = Math.abs(value);
        const formattedText = (value / Math.pow(10,decimalLength)).toFixed(decimalLength);
        return sign + formattedText.padStart(length + 1 ,"0");
    }

}
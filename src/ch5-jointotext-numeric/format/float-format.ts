import { NumericFormat } from "./numeric-format";

export type FloatFormatOptions = {
    decimalLength: number;
    length: number;
}

export class FloatFormat extends NumericFormat {

    public static MAX_ANALOG: number = 65535;
    public static HALF_MAX_ANALOG: number = 32767;

    public format(textValue: number, {decimalLength, length}: FloatFormatOptions): string {

        // holds the negative sign if the number is negative.
        let prependage = ""; 
        let formattedText = "";
    
        if (textValue > FloatFormat.HALF_MAX_ANALOG) {
            prependage = "-";
            textValue -= FloatFormat.MAX_ANALOG + 1;
            textValue = Math.abs(textValue);
        }

        const valueAsText = textValue + "";
        const textLength = valueAsText.length;

        if (textLength - decimalLength > 0) {
            formattedText = valueAsText.slice(textLength - decimalLength);
        } else {
            formattedText = valueAsText;
        }

        // add trailing zeros if necessary
        const trailingZeros = decimalLength - formattedText.length;
        for (let i = 0; i < trailingZeros; i++) {
            formattedText += "0";
        }

        let leadingText = "";
        if (textLength - decimalLength > 0) {
            leadingText = valueAsText.slice(0, textLength - decimalLength);
        }

        let leadingZeros = length - decimalLength;
        
        if (leadingText.length) {
            leadingZeros -= leadingText.length;
        }
        
        formattedText = leadingText + "." + formattedText;

        for (let i = 0; i < leadingZeros; i++) {
            formattedText = "0" + formattedText;
        }

        formattedText = prependage + formattedText;

        return formattedText;
    }

}
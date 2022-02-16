import { NumericFormat } from "./numeric-format";

export type UnsignedFormatOptions = {
    length: number;
}

export class UnsignedFormat extends NumericFormat {

    public format(value: number, options: UnsignedFormatOptions) {
        
        const { length } = options;
        const textLength = (value + "").length;
        const leadingZeros = length - textLength;
        let formattedText = "";
        for (let i = 0; i < leadingZeros; i++) {
            formattedText += "0";
        } 
        
        formattedText += value;

        return formattedText;
    }

}
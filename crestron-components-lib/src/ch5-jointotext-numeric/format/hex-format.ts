import { NumericFormat } from "./numeric-format";

export type HexFormatOptions = {
    length: number;
}

export class HexFormat extends NumericFormat {

    public format(value: number, options: HexFormatOptions) {
        // hex - e.g. "%2x"
        const { length } = options;
        let formattedText = "";
        const hexValue = value.toString(16);
        const textLength = hexValue.length;
        const leadingZeros = length - textLength;
        
        for (let i = 0; i < leadingZeros; i++) {
            formattedText += "0";
        }

        formattedText += hexValue.toUpperCase();

        return formattedText;
    }

}
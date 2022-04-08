import _ from "lodash";
import { NumericFormat } from "./numeric-format";

export type SignedFormatOptions = {
    length: number;
}

export class SignedFormat extends NumericFormat {

    public format(value: number, options: SignedFormatOptions) {

        const { length } = options;

        const sign = (!_.isNil(value) && String(value) !== "" && !isNaN(value)) ? ((value < 0) ? "-" : "") : "";
        const MAX_ANALOG = 65535;
        const HALF_MAX_ANALOG = 32767;

        let formattedText = "";
        let textLength = (value + "").length - 1;;

        if (value > HALF_MAX_ANALOG) {
            formattedText = "-";
            value -= MAX_ANALOG + 1;
            textLength = (value + "").length - 1;
        }

        // signed integer - e.g. "%10d" -- adds leading zeros
        const leadingZeros = length - textLength;
        if (leadingZeros > 0 && textLength > 0) {
            for (let i = 0; i < leadingZeros; i++) {
                formattedText += "0";
            }
        }

        formattedText += Math.abs(value);

        return sign + formattedText;
    }

}
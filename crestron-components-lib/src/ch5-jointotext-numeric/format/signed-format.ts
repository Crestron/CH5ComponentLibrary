import _ from "lodash";
import { NumericFormat } from "./numeric-format";

export type SignedFormatOptions = {
    length: number;
}

export class SignedFormat extends NumericFormat {

    public format(value: number, options: SignedFormatOptions) {

        const { length } = options;
        if (isNaN(value)){
            return "".padStart(length,"0");
        }
        let sign = (!_.isNil(value) && String(value) !== "" && !isNaN(value)) ? ((value < 0) ? "-" : "") : "";
        const MAX_ANALOG = 65535;
        const HALF_MAX_ANALOG = 32767;
        const MIN_ANALOG = -65535;	
        const HALF_MIN_ANALOG = -32768;
        let formattedText = "";

        if (value > HALF_MAX_ANALOG) {
            sign = "-";	
            value = value > MAX_ANALOG ? MAX_ANALOG : value;
            value -= MAX_ANALOG + 1;
        } else if (value < HALF_MIN_ANALOG){	
            sign = "";	
            value = value > MIN_ANALOG ? value : MIN_ANALOG;	
            value += MAX_ANALOG + 1;	
        }

        // signed integer - e.g. "%10d" -- adds leading zeros
        formattedText = sign + Math.abs(value).toString().padStart(length,"0");
        return formattedText;
    }

}
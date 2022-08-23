import { NumericFormat } from "./numeric-format";

export type UnsignedFormatOptions = {
    length: number;
}

export class UnsignedFormat extends NumericFormat {

    public format(value: number, options: UnsignedFormatOptions) {
        const { length } = options;
        if (isNaN(value)){
            return "".padStart(length,"0");
       }
       value = Math.abs(value);
       value = value > 65535 ? 65535 : value;
 
        return value.toString().padStart(length,"0");
    }

}
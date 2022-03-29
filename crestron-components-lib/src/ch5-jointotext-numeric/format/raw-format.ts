import { NumericFormat } from "./numeric-format";

export type RawFormatOptions = {}

export class RawFormat extends NumericFormat {

    public format(value: number, options: RawFormatOptions) {
        // raw integer - e.g. "%r" -- used for a raw integer
        return value;
    }

}
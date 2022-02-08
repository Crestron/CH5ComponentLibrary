import { NumericFormat } from "./numeric-format";

export class PercentageFormat extends NumericFormat {

    public format(value: number): number {
        return value * 20000;
    }

}
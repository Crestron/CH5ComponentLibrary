import { NumericFormat } from "./numeric-format";

export class DecimalFormat extends NumericFormat {


    public format(value: number): number {

        return value * 1000;

    }

}
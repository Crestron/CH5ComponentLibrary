import { NumericFormat } from "./numeric-format";
import { isNaN } from 'lodash';

export type PercentageFormatOptions = {
    min: number,
    max: number,
    decimalLength: number,
    length: number,
}

export class PercentageFormat extends NumericFormat {

    public format(value: number, options: PercentageFormatOptions): string {
        const { min, max, length, decimalLength } = options;
        
        // percentage  - e.g. "%65535.3p"
        let maxValue = max;
        const decimalPointIndex = length - decimalLength;
        let decimalPoints = 0;
        
        if (decimalPointIndex > 0) {
            decimalPoints = decimalLength;
            maxValue = max;
        } else {
            maxValue = max;
        }
        if (maxValue === 0 || isNaN(maxValue)) {
            maxValue = max;
        }
         
        if (value > maxValue) {
            value = maxValue;
        }

        // Number.EPSILON hack courtesy of
        // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
        // const roundedPercent = ((value / maxValue) * 100.0 + Number.EPSILON)
        //     .toFixed(decimalPoints);

        const roundedPercent = (((value - min) * 100.0 + Number.EPSILON) / (max - min)).toFixed(decimalPoints);

        return roundedPercent;
    }

}
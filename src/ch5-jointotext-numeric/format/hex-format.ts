import { NumericFormat } from "./numeric-format";

export type HexFormatOptions = {
    length: number;
}

export class HexFormat extends NumericFormat {

    public format(value: number, options: HexFormatOptions) {
        // hex - e.g. "%2x"
        const { length } = options;
        // Invalid value
        if (isNaN(value)) {
            return '0'.padStart(length, '0');
        }
        // Set the max and minimum value to default if it is outside the range
        const MAX_ANALOG = 65535;
        const MIN_ANALOG = -65535;
        if (value > MAX_ANALOG) {
          value = MAX_ANALOG;
        } else if (value < MIN_ANALOG) {
          value = MIN_ANALOG;
        }
        if (value < 0) {
          value += MAX_ANALOG + 1;
        }
    
        // converting decimal to hexadecimal
        const hexValue = value.toString(16);
        return hexValue.toUpperCase().padStart(length, '0');
    }

}
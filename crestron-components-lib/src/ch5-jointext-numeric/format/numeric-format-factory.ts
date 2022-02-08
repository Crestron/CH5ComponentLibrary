import { DecimalFormat } from "./decimal-format";
import { NumericFormat } from "./numeric-format";
import { NumericFormats } from "./numeric-formats";
import { PercentageFormat } from "./percentage-format";

export class NumericFormatFactory {

    private static INSTANCE: NumericFormatFactory;

    private constructor() {}

    public static getInstance() {
        if (!(this.INSTANCE instanceof NumericFormatFactory)) {
            this.INSTANCE = new NumericFormatFactory();
        }

        return this.INSTANCE;
    }

    public getFormat(type: NumericFormats): NumericFormat {

        switch (type) {
            case NumericFormats.decimal:
                return new DecimalFormat();
            case NumericFormats.percentage:
                return new PercentageFormat();
            default:
                throw new Error('This format type is not defined');
        }
    }

}
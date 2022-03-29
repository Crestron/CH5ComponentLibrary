import { FloatFormat } from "./float-format";
import { HexFormat } from "./hex-format";
import { NumericFormat, NumericFormats } from "./numeric-format";
import { PercentageFormat } from "./percentage-format";
import { RawFormat } from "./raw-format";
import { SignedFormat } from "./signed-format";
import { TimeFormat } from "./time-format";
import { UnsignedFormat } from "./unsigned-format";

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
            case NumericFormats.float:
                return new FloatFormat();
            case NumericFormats.percentage:
                return new PercentageFormat();
            case NumericFormats.hex:
                return new HexFormat();
            case NumericFormats.raw:
                return new RawFormat();
            case NumericFormats.unsigned:
                return new UnsignedFormat();
            case NumericFormats.signed:
                return new SignedFormat()
            case NumericFormats.time:
                return new TimeFormat()
            default:
                throw new Error('This format type is not defined');
        }
    }

}
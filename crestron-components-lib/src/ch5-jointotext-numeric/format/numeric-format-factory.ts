import { TCh5JoinInfoNumericFormats } from "../interfaces/t-ch5-jointotext-numeric";
import { FloatFormat } from "./float-format";
import { HexFormat } from "./hex-format";
import { NumericFormat } from "./numeric-format";
import { PercentageFormat } from "./percentage-format";
import { RawFormat } from "./raw-format";
import { SignedFormat } from "./signed-format";
import { TimeFormat } from "./time-format";
import { UnsignedFormat } from "./unsigned-format";

export class NumericFormatFactory {

	private static INSTANCE: NumericFormatFactory;

	private constructor() { }

	public static getInstance() {
		if (!(this.INSTANCE instanceof NumericFormatFactory)) {
			this.INSTANCE = new NumericFormatFactory();
		}
		return this.INSTANCE;
	}

	public getFormat(type: TCh5JoinInfoNumericFormats): NumericFormat {
		switch (type.trim().toLowerCase()) {
			case "float":
				return new FloatFormat();
			case "percentage":
				return new PercentageFormat();
			case "hex":
				return new HexFormat();
			case "raw":
				return new RawFormat();
			case "unsigned":
				return new UnsignedFormat();
			case "signed":
				return new SignedFormat();
			case "time":
				return new TimeFormat();
			default:
				// Sending default value back
				return new SignedFormat();
		}
	}

}
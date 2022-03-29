export enum NumericFormats {
    float = 'float',
    percentage = 'percentage',
    hex = 'hex',
    raw = 'raw',
    unsigned = 'unsigned',
    signed = 'signed',
    time = 'time',
}

export abstract class NumericFormat {

    public abstract format(value: number, options: {}): string | number;

    protected prependZero(intLength: number, length: number) {
        let prependedZeros = "";
        for (let i = intLength; i < length; i++) {
            prependedZeros += 0;
        }
        return prependedZeros;
    }

}
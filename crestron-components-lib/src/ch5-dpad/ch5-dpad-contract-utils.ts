export class CH5DpadContractUtils {

    // the join number is applied to the top button, join+1 applies to bottom,
    // join+2 applies to left, join+3 applies to right, join+4 to center
    public static readonly sendEventOnClickSigCountToAdd = {
        top: 0,
        bottom: 1,
        left: 2,
        right: 3,
        center: 4
    };

    public static readonly contractSuffix = {
        top: '.Top',
        bottom: '.Bottom',
        left: '.Left',
        right: '.Right',
        center: '.Center'
    }
}
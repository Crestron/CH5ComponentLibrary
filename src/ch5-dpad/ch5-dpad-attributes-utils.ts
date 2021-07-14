
export class CH5DpadAttributesUtils {
    public static onParentContractBasedAttrChangedCallback(
        thisRef: any,
        attr: string,
        oldValue: string,
        newValue: string,
        parentContractName: string,
        callbackFn: (a: string, b: string, c: string) => void
    ): boolean {
        let isAttributeFound = true;
        switch (attr) {
            case 'receivestateiconclass':
            case 'receivestateiconurl':
            case 'receivestateshow':
            case 'receivestateenable':
                // all 4 above cases need the contractName attribute in DPad tag to be empty to be acceptable
                // checking if contractName is empty and callback function is defined, before proceeding 
                if (!Boolean(parentContractName)) {
                    if (Boolean(callbackFn)) {
                        callbackFn(attr, oldValue, newValue);
                    }
                } else {
                    thisRef.info(`Parent container DPad has a contract and so, ${attr} for ${thisRef.crId} is rendered void.`);
                }
                break;
            case 'show':
            case 'enable':
                break;
            default:
                isAttributeFound = false;
                break;
        }

        return isAttributeFound;
    }

    /**
     * Function to check and return the required value for a given params
     * @param hasAttribute pre-existing attribute status
     * @param valToAssign new value to assign
     * @param defaultValue defaultvalue if required
     * @returns final value assigned as attribute's value
     */
    public static setAttributesBasedValue = (hasAttribute: boolean, valToAssign: any, defaultValue: string) => {
        if (hasAttribute) {
            return valToAssign;
        } else {
            return defaultValue;
        }
    }
}
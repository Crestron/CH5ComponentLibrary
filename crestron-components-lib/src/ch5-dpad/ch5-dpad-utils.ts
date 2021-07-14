import { valid } from "semver";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5DpadCenter } from "./ch5-dpad-button-center";
import { signalStructure, TDpadChildElement, TParentControlledContractRules } from "./interfaces/t-ch5-dpad";

export class CH5DpadUtils {

    /**
     * Function to return the attribute as a string
     * @param thisRef 
     * @param keyToCheck 
     * @param defaultValue 
     * @returns 
     */
    public static getAttributeAsString(thisRef: any, keyToCheck: string, defaultValue: string = '') {
        let retVal = defaultValue;
        keyToCheck = keyToCheck.toLowerCase(); // precaution for attributes, to keep them lower cased
        if (thisRef.hasAttribute([keyToCheck])) {
            retVal = thisRef.getAttribute([keyToCheck]) as string;
        }
        return retVal;
    }

    /**
     * Function to return the attribute as a boolean
     * @param thisRef 
     * @param keyToCheck 
     * @param defaultValue 
     * @returns 
     */
    public static getAttributeAsBool(thisRef: any, keyToCheck: string, defaultValue: boolean) {
        let retVal = defaultValue;
        keyToCheck = keyToCheck.toLowerCase(); // precaution for attributes, to keep them lower cased
        if (thisRef.hasAttribute([keyToCheck])) {
            retVal = (thisRef.getAttribute([keyToCheck]) === 'true' ||
                thisRef.getAttribute([keyToCheck]) === true);
        }
        return retVal;
    }

    /**
     * Function to remove all child elements before creating them newly
     * @param thisRef 
     */
    public static clearComponentContent(thisRef: any) {
        const containers = thisRef.getElementsByClassName(thisRef.primaryCssClass);
        Array.from(containers as HTMLElement[]).forEach((container) => {
            container.remove();
        });
    }

    public static isNullOrUndefined(input: any) {
        return (typeof (input) === 'undefined' || input === null);
    }

    /**
     * Function to set defaultValue to an attribute if it doesn't have one already
     * @param thisRef html element
     * @param attr attribute to check if its undefined, sets the default value
     * @param defaultValue is set as attribute's value if it doesn't have one already
     */
    public static setAttributeToElement(thisRef: any, attr: string, defaultValue: string) {
        attr = attr.toLowerCase();
        let val = defaultValue;
        if (!thisRef.hasAttribute(attr) && defaultValue.length > 0) {
            thisRef.setAttribute(attr, defaultValue);
        } else if (thisRef.hasAttribute(attr)) {
            val = thisRef.getAttribute(attr);
        }
        return val;
    }

    /**
     * Function to convert string into boolean
     * @param str input
     * @returns boolean
     */
    public static getBoolFromString(str: string) {
        return (!CH5DpadUtils.isNullOrUndefined(str) && (str === 'true'));
    }

    /**
     * Function to check and return if there is a valid image URL to be added for dpad child element
     * @param thisRef dpad child element
     * @param buttonTag tag as a string
     * @returns image url if it exists
     */
    public static getImageUrl(thisRef: TDpadChildElement, buttonTag: string, isAllowedByParentContract: boolean): string {
        let retStr = '';
        const eleID = CH5DpadUtils.getAttributeAsString(thisRef, 'data-ch5-id', '');
        if (isAllowedByParentContract) {
            retStr = '';
        } else if (thisRef.receiveStateIconUrl.length > 0) {
            // TODO: check if its a valid URL
            retStr = thisRef.receiveStateIconUrl;
        } else if (thisRef.iconUrl.length > 0) {
            // TODO: check if its a valid URL
            retStr = thisRef.iconUrl;
        }

        return retStr;
    }

    /**
     * Function to check and return if there is a valid icon class to be added for dpad child element
     * @param thisRef dpad child element
     * @param buttonTag tag as a string
     * @returns icon class if it exists
     */
    public static getIconClass(thisRef: TDpadChildElement, buttonTag: string, isAllowedByParentContract: boolean): string {
        let retStr = '';
        const eleID = CH5DpadUtils.getAttributeAsString(thisRef, 'data-ch5-id', '');

        if (isAllowedByParentContract) {
            retStr = '';
        } else if (thisRef.receiveStateIconClass.length > 0) {
            // TODO: check if its a valid icon class
            retStr = thisRef.receiveStateIconClass;
        } else if (thisRef.iconClass.length > 0) {
            // TODO: check if its a valid icon class
            retStr = thisRef.iconClass;
        }

        return retStr;
    }

    /**
     * Function to check and return if there is a valid icon class to be added for dpad child element
     * useful only for dpad-button-center
     * @param thisRef dpad child element
     * @param buttonTag tag as a string
     * @returns icon class if it exists
     */
    public static getLabelText(thisRef: Ch5DpadCenter, buttonTag: string, isAllowedByParentContract: boolean): string {
        let retStr = '';
        const eleID = CH5DpadUtils.getAttributeAsString(thisRef, 'data-ch5-id', '');

        if (isAllowedByParentContract) {
            retStr = '';
        } else if (thisRef.receivestatescriptlabelhtml.length > 0) {
            retStr = thisRef.receivestatescriptlabelhtml; // label as HTML input from contract
        } else if (thisRef.receiveStateLabel.length > 0) {
            retStr = thisRef.receiveStateLabel; // label as string from contract
        } else if (thisRef.label.length > 0) {
            retStr = thisRef.label; // label as string from attribute
        }

        return retStr;
    }

    /**
     * Function to return a 'span' tag to be placed as icon for dpad child btn
     * @param imageUrl image url for icon
     * @returns HTMLElement, a 'span' tag
     */
    public static getImageContainer(imageUrl: string) {
        const retEle = document.createElement('span');
        retEle.classList.add('dpad-btn-icon');
        retEle.classList.add('image-url');
        retEle.setAttribute('data-img-url', imageUrl);
        return retEle;
    }

    /**
     * Function to return an 'i' tag to be placed as icon for dpad child btn
     * @param iconClass icon class for icon
     * @returns HTMLElement, a 'i' tag
     */
    public static getIconContainer() {
        const retEle = document.createElement('span');
        retEle.classList.add('dpad-btn-icon');
        retEle.classList.add('icon-class');
        retEle.classList.add('fas'); // 'fas'
        return retEle;
    }


    /**
     * Function to return an 'span' tag to be placed as label for dpad child btn
     * @param labelInput label instead of icon
     * @returns HTMLElement, a 'span' tag
     */
    public static getLabelContainer(labelClassName: string) {
        const retEle = document.createElement('span');
        retEle.classList.add(labelClassName);
        return retEle;
    }

    /**
     * Function to clear subscription and value based on them
     * @param csf ch5SignalFactory object
     * @param obj source object
     * @param receiveAttribute string
     * @param signalReceiveAttribute string
     */
    public static clearSignalValue(csf: Ch5SignalFactory, obj: any, receiveAttribute: string, signalReceiveAttribute: string) {
        if (obj[receiveAttribute] !== '' && obj[signalReceiveAttribute] !== '') {
            const receiveValueSigName: string = Ch5Signal.getSubscriptionSignalName(obj[signalReceiveAttribute]);
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(receiveValueSigName);
            if (null !== sigLabel) {
                sigLabel.unsubscribe(obj[receiveAttribute]);
                obj[signalReceiveAttribute] = '';
            }
        }
    }

    /**
     * Function to create and assign values for parentcontrolled contract rules
     */
    public static buildParentControlledContractRules(thisRef: any): TParentControlledContractRules {
        // the default value for all the flags are 'false'
        const contractName = CH5DpadUtils.getAttributeAsString(thisRef.parentElement, 'contractName', '');
        const isContractNameAvailable = Boolean(contractName); // if contractName exists, then assign true as default value
        const retObj: TParentControlledContractRules = {
            contractName,
            enable: CH5DpadUtils.getAttributeAsBool(thisRef.parentElement, 'useContractforEnable', isContractNameAvailable),
            show: CH5DpadUtils.getAttributeAsBool(thisRef.parentElement, 'useContractForShow', isContractNameAvailable),
            label: CH5DpadUtils.getAttributeAsBool(thisRef.parentElement, 'useContractforLabel', isContractNameAvailable),
            icon: CH5DpadUtils.getAttributeAsBool(thisRef.parentElement, 'useContractForIcons', isContractNameAvailable)
        };
        return retObj;
    }

    /**
     * Function to subscribe state generically per state/contract object requested
     * @param signalname signal name on which the subscription is to be created for
     * @param signalValue signal value or contract name on which the subscription is called on
     * @param onSubscribeStateHandler Function to execute when subscription completes
     */
    public static subscribeStateForContract(contractObj: signalStructure, onSubscribeStateHandler: () => void) {
        // clean up old subscription
        if (contractObj.signalName) {
            const oldReceiveIconClassSigName: string = Ch5Signal.getSubscriptionSignalName(contractObj.signalName);
            const oldSignal: Ch5Signal<string> | null =
                Ch5SignalFactory.getInstance().getStringSignal(oldReceiveIconClassSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(contractObj.signalValue);
            }
        }

        // setup new subscription.
        const receiveIconClassSigName: string = Ch5Signal.getSubscriptionSignalName(contractObj.signalName);
        const receiveSignal: Ch5Signal<string> | null =
            Ch5SignalFactory.getInstance().getStringSignal(receiveIconClassSigName);

        if (receiveSignal !== null) {
            contractObj.signalValue = receiveSignal.subscribe((newValue: string) => {
                if (contractObj.response !== newValue) {
                    contractObj.response = newValue;
                }
                onSubscribeStateHandler();
            });
        }
    }

    /**
     * Function to instantiate empty contract object
     * @returns signalStructure
     */
    public static getBlankContractObj(): signalStructure {
        const contractObj: signalStructure = {
            signalName: '',
            signalValue: '',
            response: ''
        };
        return contractObj;
    }
}
import { valid } from "semver";
import { Ch5DpadCenter } from "./ch5-dpad-button-center";
import { TDpadChildElement } from "./interfaces/t-ch5-dpad";

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
        const parentEle: HTMLElement = thisRef.parentElement as HTMLElement;
        const eleID = CH5DpadUtils.getAttributeAsString(thisRef, 'data-ch5-id', '');
        if (isAllowedByParentContract && thisRef.receiveStateIconUrl.length < 1) {
            throw new Error(`The contract based icon url for ${buttonTag}  
            seems to be incorrect. id = ${eleID}`);
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
        const parentEle: HTMLElement = thisRef.parentElement as HTMLElement;
        const eleID = CH5DpadUtils.getAttributeAsString(thisRef, 'data-ch5-id', '');

        if (isAllowedByParentContract && thisRef.receiveStateIconClass.length < 1) {
            throw new Error(`The contract based icon class for ${buttonTag}  
            seems to be incorrect. id = ${eleID}`);
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
        const parentEle: HTMLElement = thisRef.parentElement as HTMLElement;
        const eleID = CH5DpadUtils.getAttributeAsString(thisRef, 'data-ch5-id', '');

        if (isAllowedByParentContract && thisRef.receiveStateLabel.length < 1) {
            throw new Error(`The contract based label text for ${buttonTag}  
            seems to be incorrect. id = ${eleID}`);
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
        retEle.style.backgroundImage = `url(${imageUrl})`;
        return retEle;
    }

    /**
     * Function to return an 'i' tag to be placed as icon for dpad child btn
     * @param iconClass icon class for icon
     * @returns HTMLElement, a 'i' tag
     */
    public static getIconContainer(iconClass: string) {
        const retEle = document.createElement('i');
        retEle.classList.add('dpad-btn-icon');
        retEle.classList.add('icon-class');
        retEle.classList.add(iconClass);
        return retEle;
    }


    /**
     * Function to return an 'span' tag to be placed as label for dpad child btn
     * @param labelInput label instead of icon
     * @returns HTMLElement, a 'span' tag
     */
    public static getLabelContainer(labelInput: string) {
        const retEle = document.createElement('span');
        retEle.classList.add('dpad-btn-label');
        retEle.classList.add('label-class');
        retEle.innerHTML = labelInput;
        return retEle;
    }
}
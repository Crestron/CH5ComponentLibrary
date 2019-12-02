// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AttrsLog } from './ch5-attrs-log';
import { CH5_I18N_ATTRIBUTE_CONSTANT } from './utils/ch5-attrs-constants';
import { ICh5AttrsI18n } from '../_interfaces/ch5-custom-attrs/i-ch5-attrs-i18n';
import { randomFixedInteger } from './utils/ch5-attrs-utility';
import { SavedElementInfo, SubAtrribute } from '../_interfaces/ch5-custom-attrs/types/ch5-attr-i18n-types'
import { CustomAttribute } from '../_interfaces/ch5-custom-attrs/helpers/custom-attribute';
import { Ch5TranslationUtility } from "../ch5-core/ch5-translation-utility";

export class Ch5AttrsI18n extends CustomAttribute<string> implements ICh5AttrsI18n {
    public static DATA_CH5_ATTR_NAME: string = CH5_I18N_ATTRIBUTE_CONSTANT.dataCh5AttrName;
    public static DATA_CH5_EL_ID_PREFIX: string = CH5_I18N_ATTRIBUTE_CONSTANT.elementIdPrefix;
    public static RANDOM_NUMBER_LENGTH: number = CH5_I18N_ATTRIBUTE_CONSTANT.randomNumberLength;
    // sub attribute position ex:-data-ch5-i18n = '-+[attr=alt]locale.key+-'
    public static EXPECTED_SUBATTRIBUTE_POSITION: number = CH5_I18N_ATTRIBUTE_CONSTANT.subAttributePosition;
    public static SUBATTRIBUTE_TYPE: string = CH5_I18N_ATTRIBUTE_CONSTANT.subAttributeType;

    public translatableData: SavedElementInfo[] = [] as SavedElementInfo[];
    private initialIndexValue: number = CH5_I18N_ATTRIBUTE_CONSTANT.defaultIndex;
    /**
     * function updateLocaleTextOnLanguageChange trigger when 
     * language chnaged and it's iterate over element info that saved in array
     */
    public updateOnChange(): void {
        // remove element if its not available in dom
        this.removeExtraNode();
        this.translatableData.map((savedItem, index) => {
            const el: HTMLElement = document.getElementById(savedItem.uniqueElementId) as HTMLElement;
            const localeText: string = el.getAttribute(savedItem.attributeName) || '';
            this.updateValueToDom(el, localeText, index);
        });
    }

    /**
     * function handleBeingAddedToDom add the unique id to 
     * element for future refrance
     * @param {Element} el html element added to dom
     */
    public handleBeingAddedToDom(el: Element) {
        const localeText: string = el.getAttribute(Ch5AttrsI18n.DATA_CH5_ATTR_NAME) || '';
        const _debug: boolean = el.hasAttribute('debug');
        if (!el.id) { // Else use existing id for element reference.
            const elementUniqueId = Ch5AttrsI18n.DATA_CH5_EL_ID_PREFIX
                + randomFixedInteger(Ch5AttrsI18n.RANDOM_NUMBER_LENGTH).toString();
            el.setAttribute('id', elementUniqueId);
            Ch5AttrsLog.info(_debug,`unique id:-${elementUniqueId} added to element`,el);
        }

        this.updateValueToDom(el as HTMLElement, localeText);
    }

    /**
     * function getTextDisplayInfo get the data-ch5-locale-text attributeValue.
     * check and find out the sub attribute if exist
     * @param {string} attributeValue data-ch5-locale-text attributeValue.
     */
    private getTextDisplayInfo(attributeValue: string): SubAtrribute {
        const subAttributeInfo: SubAtrribute = { typeOfAttribute: '', attributeSelector: '', valueToTranslate: '', hasAttribute: false };
        const subAttributeInput: string = attributeValue.trim() as string;
        const hasSubAttribute = subAttributeInput.match(/\[(.*?)\]/);
        if (!subAttributeInput && !hasSubAttribute) {
            return subAttributeInfo;
        }
        if (subAttributeInput.indexOf('[') === Ch5AttrsI18n.EXPECTED_SUBATTRIBUTE_POSITION) {
            const [subAttribute, selector] = subAttributeInput.match(/\[(.*?)\]/)![1].split('=');
            subAttributeInfo.valueToTranslate = subAttributeInput.replace(subAttributeInput.match(/\[(.*?)\]/)![0], '') as string;
            subAttributeInfo.typeOfAttribute = subAttribute as string;
            subAttributeInfo.attributeSelector = selector as string;
            subAttributeInfo.hasAttribute = true;
        }
        return subAttributeInfo;
    }

    /**
     *
     * @param {HTMLElement} el html element having attribuite data-ch5-i18n
     * @param {string} localeText translatable key
     * @param {string} indexValue of object in array
     */
    private updateValueToDom(el: HTMLElement, localeText: string, indexValue: number = this.initialIndexValue) {
        const _debug: boolean = el.hasAttribute('debug');
        if (indexValue === this.initialIndexValue && this.translatableData) {
            this.removeExtraNode();
        }
        const subAttribuite: SubAtrribute = this.getTextDisplayInfo(localeText);
        let newTextValue = '';
        if (subAttribuite.hasAttribute) {
            newTextValue = this.getTranslatedValue(el, subAttribuite.valueToTranslate, indexValue);
            if (subAttribuite.typeOfAttribute === Ch5AttrsI18n.SUBATTRIBUTE_TYPE) {
                const newEl: HTMLElement = el.querySelector(subAttribuite.attributeSelector) as HTMLElement;
                newEl.innerHTML = newTextValue as string;
                Ch5AttrsLog.info(_debug, `updated value ${newTextValue} to inner html`, el);
            } else {
                if (el.hasAttribute(subAttribuite.attributeSelector)) {
                    el.removeAttribute(subAttribuite.attributeSelector);
                }
                el.setAttribute(subAttribuite.attributeSelector, newTextValue);
                Ch5AttrsLog.info(_debug, `updated value ${newTextValue} of atrribute ${subAttribuite.attributeSelector}`, el);
            }

        } else {
            newTextValue = this.getTranslatedValue(el, localeText, indexValue);
            el.innerHTML = newTextValue as string;
            Ch5AttrsLog.info(_debug, `updated text content ${newTextValue} `, el);
        }
    }

    private checkElementExistInDom(uniqueElementId: string): boolean {
        const isElementExist = document.getElementById(uniqueElementId );
        return !!isElementExist;
    }

    /**
     * function removeExtraNode filters removed element from 'translatableData' array
     */
    private removeExtraNode(): void {
        this.translatableData = this.translatableData.filter((item) => this.checkElementExistInDom(item.uniqueElementId ));
    }
    
    /**
     * 
     * @param el html element
     * @param valueToTranslate locale json file key
     * @param indexValue 
     */
    private getTranslatedValue(el: HTMLElement, valueToTranslate: string, indexValue: number = this.initialIndexValue): string {
        const saveTranslatedValues: SavedElementInfo = {} as SavedElementInfo;
        const translationUtility = Ch5TranslationUtility.getInstance();
        const isTranslatableValue = translationUtility.isTranslationIdentifier(valueToTranslate);
        const translatedValue = isTranslatableValue ? this.doTranslation(valueToTranslate) : '';

        if (!!translatedValue) {
            saveTranslatedValues.uniqueElementId = el.id;
            saveTranslatedValues.attributeName = Ch5AttrsI18n.DATA_CH5_ATTR_NAME;
            saveTranslatedValues.attributeValue = valueToTranslate;
            indexValue !== this.initialIndexValue
                ? this.translatableData[indexValue] = saveTranslatedValues
                : this.translatableData.push(saveTranslatedValues);
        }

        return translatedValue;
    }

    /**
     * function doTranslation takes key present in locale json files
     * and return the value of the key
     * @param valueToTranslate 
     */
    private doTranslation(valueToTranslate: string): string {
        let translatedValue = valueToTranslate;
        const translationUtility = Ch5TranslationUtility.getInstance();
        const identifiedValues = translationUtility.valuesToTranslation(valueToTranslate);

        if (identifiedValues && identifiedValues.length > 0) {
            identifiedValues.forEach(identifier => {
                const isTranslatable = translationUtility.isTranslationIdentifier(identifier);
                if (isTranslatable) {
                    const characters = translationUtility.stripDownTranslationCharacters(identifier);
                    const existTranslation = translationUtility.getTranslator().exists(characters);

                    if (existTranslation) {
                        const identifierTranslated = translationUtility.getTranslator().t(characters);
                        translatedValue = translatedValue.replace(identifier, identifierTranslated);
                    }
                }
            })
        }

        return translatedValue;
    }

}
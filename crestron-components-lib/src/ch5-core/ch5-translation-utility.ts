// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5TranslationConfiguration } from './ch5-translation-configuration';
import { translationFactory } from './ch5-translation-factory';
import { i18n } from 'i18next';

export class Ch5TranslationUtility {
    private static _instance: Ch5TranslationUtility;
    public _translatorBeginKey: string = '';
    public _translatorEndKey: string = '';


    public static getInstance(): Ch5TranslationUtility {
        if (Ch5TranslationUtility._instance === undefined) {
            Ch5TranslationUtility._instance = new Ch5TranslationUtility();
        }

        return Ch5TranslationUtility._instance;
    }

    constructor() {
        this.translatorBeginKey = Ch5TranslationConfiguration.translationTokenStartDelimiter;
        this.translatorEndKey = Ch5TranslationConfiguration.translationTokenEndDelimiter;
    }

    public getTranslator(): i18n {

        return translationFactory.translator;
    }

    public valuesToTranslation(valueToTranslation: string) {
        const patternIdentifier = new RegExp("(\\" + this.translatorBeginKey + ")([a-zA-Z0-9\\.]+)\\w+(\\" + this.translatorEndKey + ")", "g");
        return valueToTranslation.match(patternIdentifier);
    }

    public hasMultipleIdentifiers(valueToTranslation: string) {
        const patternIdentifier = new RegExp("(\\" + this.translatorBeginKey + ")([a-zA-Z0-9\\.]+)\\w+(\\" + this.translatorEndKey + ")", "g");
        if (valueToTranslation.match(patternIdentifier) &&
            (valueToTranslation.match(patternIdentifier) as RegExpExecArray).length > 1) {
            return true;
        }
        return false;
    }

    public isTranslationIdentifier(value: string) {
        const patternIdentifier = new RegExp("(\\" + this.translatorBeginKey + ")([a-zA-Z0-9\\.]+)\\w+(\\" + this.translatorEndKey + ")", "g");
        const pattern = patternIdentifier;
        return pattern.test(value);
    }

    public stripDownTranslationCharacters(value: string) {
        const pattern = new RegExp("^(\\" + this.translatorBeginKey + ")([a-zA-Z0-9\\.]+)(\\" + this.translatorEndKey + ")$",)
        let translatedCaracters: string = '';
        if (pattern.exec(value) && (pattern.exec(value) as RegExpExecArray).length > 0) {
            translatedCaracters = (pattern.exec(value) as RegExpExecArray)[2] as string;
        }
        return translatedCaracters;
    }

    public set translatorBeginKey(key: string) {
        if (key !== null && key !== undefined) {
            this._translatorBeginKey = key.split('').join('\\');
        }
    }

    public get translatorBeginKey(): string {
        return this._translatorBeginKey;
    }

    public set translatorEndKey(key: string) {
        if (key !== null && key !== undefined) {
            this._translatorEndKey = key.split('').join('\\');
        }
    }

    public get translatorEndKey(): string {
        return this._translatorEndKey;
    }

    private _t(valueToTranslate: string) {
        let translatedValue = valueToTranslate;
        const identifiedValues = this.valuesToTranslation(valueToTranslate);

        if (identifiedValues && identifiedValues.length > 0) {
            identifiedValues.forEach(identifier => {
                const isTranslatable = this.isTranslationIdentifier(identifier);
                if (isTranslatable) {
                    const characters = this.stripDownTranslationCharacters(identifier);
                    const existTranslation = this.getTranslator().exists(characters);

                    if (existTranslation) {
                        const identifierTranslated = this.getTranslator().t(characters);
                        translatedValue = translatedValue.replace(identifier, identifierTranslated);
                    }
                }
            })
        }

        return translatedValue;
    }

    public translatedValue(valueToTranslate:string){

        const isTranslatableValue = this.isTranslationIdentifier(valueToTranslate);
        let _value = valueToTranslate;

        if (isTranslatableValue) {
            _value = this._t(valueToTranslate);
        } else {
            _value = valueToTranslate;
        }


        return _value;
    }

}

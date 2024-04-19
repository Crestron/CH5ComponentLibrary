// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { languageChangedSignalName } from './ch5-translation-factory';
import { Ch5TranslationUtility } from './ch5-translation-utility';
import { Ch5SignalFactory } from './ch5-signal-factory';
import { isNotNil } from '../ch5-common/utils/common-functions';

export class Ch5TranslationClass {

	// Current language for each component
	public currentLanguage: string | null = '';

	public translatableObjects: any = {} as any;

	public constructor() {
		const receiveSignal = Ch5SignalFactory.getInstance().getStringSignal(languageChangedSignalName);

		if (isNotNil(receiveSignal)) {
			receiveSignal?.subscribe((newValue: string) => {
				if (newValue !== '' && newValue !== this.currentLanguage) {
					this.currentLanguage = newValue;
					Object.keys(this.translatableObjects).forEach((propertyToTranslate: string) => {
						let propertyReference: { [key: string]: string } = this as {};

						if (propertyReference[propertyToTranslate as string] === undefined && propertyReference['attrModel' as string] !== undefined) {
							propertyReference = propertyReference['attrModel' as string] as {};
						}

						if (propertyReference[propertyToTranslate.toString()] !== undefined && this.translatableObjects[propertyToTranslate.toString()] !== undefined) {
							propertyReference[propertyToTranslate.toString()] = this.translatableObjects[propertyToTranslate];
							this.translateCallback(propertyToTranslate.toString());
						}
					})
				}
			});
		}
	}

	/**
	 * Used after the language is changed when special actions has to be done
	 * For example when translating you have to parse the component children or some other actions
	 * @param {string} section
	 * @return {void}
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected translateCallback(section: string): void {
		// if custom actions has to be done on translation
	}

	public _getTranslatedValue(valueToSave: string, valueToTranslate: string) {
		const translationUtility = Ch5TranslationUtility.getInstance();

		let translationKey = valueToTranslate;;
		let _value = valueToTranslate;
		let savedValue = this.translatableObjects[valueToSave];

		if (savedValue === valueToTranslate) {
			translationKey = savedValue;
		}

		const isTranslatableValue = translationUtility.isTranslationIdentifier(translationKey);

		if (!isTranslatableValue) {
			return valueToTranslate;
		}

		if (typeof savedValue === 'undefined') {
			savedValue = valueToTranslate;
			_value = this._t(valueToTranslate);
		} else {
			const isTranslatableLabel = translationUtility.isTranslationIdentifier(savedValue);
			if (!isTranslatableLabel) {
				if (savedValue !== valueToTranslate) {
					savedValue = valueToTranslate;
				}
				_value = this._t(valueToTranslate);
			} else {
				if (this._t(savedValue) !== valueToTranslate && translationUtility.hasMultipleIdentifiers(savedValue)) {
					savedValue = valueToTranslate;
				}
				_value = this._t(savedValue);
			}
		}
		this.translatableObjects[valueToSave] = savedValue;

		return _value;
	}

	public _t(valueToTranslate: string) {
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
			});
		}
		return translatedValue;
	}

}

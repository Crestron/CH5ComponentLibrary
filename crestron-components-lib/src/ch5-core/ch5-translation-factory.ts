// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import i18next from 'i18next';
import { Ch5Signal } from "./ch5-signal";
import { Ch5TranslationListeners } from "./ch5-translation-listeners";

export class Ch5TranslationFactory {

  /**
   * Saves the signal subscription
   * 
   * @memberof Ch5TranslationFactory
   * @type {string}
   */
  public receiveUpdateSub: string = '';

  /**
   * Contains the translator helper. This will be usually a i18next interface
   * 
   * @memberof Ch5TranslationFactory
   * @protected
   */
  protected _translator: i18next.i18n = {} as i18next.i18n;

  /**
   * Getter for translator helper
   * 
   * @return {ITranslator}
   */
  public get translator(): i18next.i18n {

    return this._translator;
  }

  /**
   * Setter for translator helper
   * 
   * @param {ITranslator} translator
   */
  public set translator(translator:i18next.i18n) {

    if (Object.keys(translator).length > 0) {
      this._translator = translator;
      this.runListeners();
    }

    console.log(this.translator);
  }

  private runListeners() {
    return new Ch5TranslationListeners(this.translator);
  }
}

export const translationFactory = new Ch5TranslationFactory;
translationFactory.translator = i18next;

export const languageChangedSignalName = 'language_changed';
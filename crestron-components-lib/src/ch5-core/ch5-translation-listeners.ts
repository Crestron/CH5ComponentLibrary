// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { triggerTranslation } from "./utility-functions/trigger-translation";
import { i18n, TOptions } from "i18next";

export class Ch5TranslationListeners {

  public translator: i18n = {} as i18n;

  constructor(translator: i18n) {
    this.translator = translator;
    this.init();
  }

  protected init() {
    this.translator.on('initialized', this.onInitialized.bind(this));
    this.translator.on('loaded', this.onLoaded.bind(this));
    this.translator.on('added', this.onAdded.bind(this));
    this.translator.on('languageChanged', this.onLanguageChanged.bind(this));
  }

  /**
   * Gets fired after initialization
   *
   * @memberof Ch5TranslationListeners
   * @return {void}
   */
  protected onInitialized(options: TOptions): void {
    // console.log('The i18next was initialized');
    this.translate(options.language);
  }

  /**
   * Gets fired when the language is changed
   *
   * @memberof Ch5TranslationListeners
   * @return {void}
   */
  protected onLanguageChanged(lng: string): void {
    // console.log('The language was changed to ' + lng);
    this.translate(lng);
  }

  /**
   * Gets fired when loaded resources
   *
   * @memberof Ch5TranslationListeners
   * @return {void}
   */
  protected onLoaded(loaded: boolean): void {
    // console.log('The resource was loaded');
    this.translate();
  }

  /**
   * Gets fired when a resource got added
   *
   * @memberof Ch5TranslationListeners
   * @return {void}
   */
  protected onAdded(lng: string, ns: string): void {
    // console.log('New resource was added');
    this.translate();
  }

  /**
   * Fire a common action for all events
   *
   * @param {string} language
   * @memberof Ch5TranslationListeners
   * @return {void}
   */
  protected translate(language?: string): void {
    triggerTranslation(language);
  }

}

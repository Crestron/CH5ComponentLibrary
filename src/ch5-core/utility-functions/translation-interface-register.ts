// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { translationFactory } from "../ch5-translation-factory";
import { i18n } from "i18next";
import { Ch5TranslationConfiguration } from "../ch5-translation-configuration";
import { Ch5TranslationUtility } from "../ch5-translation-utility";

export function registerTranslationInterface(translator: i18n, beginWith?: string, endingWith?: string) {

  if (
    (beginWith !== undefined && endingWith !== undefined) &&
    (beginWith.trim() !== '' && endingWith.trim() !== '')
  ) {
    beginWith = beginWith.trim();
    endingWith = endingWith.trim();

    Ch5TranslationConfiguration.translationTokenStartDelimiter = Ch5TranslationUtility.getInstance().translatorBeginKey = beginWith;
    Ch5TranslationConfiguration.translationTokenEndDelimiter = Ch5TranslationUtility.getInstance().translatorEndKey = endingWith;
  }

  translationFactory.translator = translator;
}

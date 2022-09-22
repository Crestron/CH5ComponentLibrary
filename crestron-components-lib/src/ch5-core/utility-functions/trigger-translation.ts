// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { translationFactory, languageChangedSignalName } from "../ch5-translation-factory";
import { Ch5SignalFactory } from "../ch5-signal-factory";

export function triggerTranslation(language?: string) {
  
  const languageChangedSig = Ch5SignalFactory.getInstance().getStringSignal(languageChangedSignalName);
  let changedLanguage: string | undefined = translationFactory.translator.language;

  if ((changedLanguage === undefined || changedLanguage === null) && language !== '') {
    changedLanguage = language as string;
  }

  if (languageChangedSig !== null) {
    languageChangedSig.publish(changedLanguage as string);
  }
}
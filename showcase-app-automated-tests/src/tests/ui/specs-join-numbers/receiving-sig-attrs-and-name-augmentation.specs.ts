// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {PlaygroundPage} from '../page-objects';
import {EmulatorData} from "../data-providers/EmulatorData";
import {JoinNumbersData} from '../data-providers/JoinNumbersData';

describe('Join Number Signals: summary automated tests for receiveSignal* attributes and variable signal ' +
    'names augmentation', () => {
  it('ch5-select receiveSignalSize subscription to "fb25" that will result to a select with size=5 and ' +
      'each option attr data-ch5-appendclass will have a generated signal name signal from this interval [301, 305]',
      () => {
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.getReceiveJoinNrsSignalsScenario())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(JoinNumbersData.HTML_TMPL_SELECT)
            .clickPreviewBtn()
            .checkExistance(JoinNumbersData.SELECT_EL)
            .clickGeneratedElement(JoinNumbersData.TRIGGER_SELECT_EL_SIZE_UPDATE)
            .checkAttribute(JoinNumbersData.SELECT_EL, 'size', '5')
            .checkVariableSignalsJoinNrAugmentation(JoinNumbersData.SELECT_EL, 'ch5-select-option',
                'data-ch5-appendclass', 301, 'ch5-select-option > span',
                'item_');
      });

  it('ch5-spinner variable join number signal names augmentation (signals interval [401, 407])', () => {
    PlaygroundPage
        .openURL()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_SPINNER)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.SPINNER_EL)
        .checkVariableSignalsJoinNrAugmentation(JoinNumbersData.SPINNER_EL,
            '.ch5-spinner__item .spinner-item', 'data-ch5-appendstyle',
            401, 'label', 'Item ');
  });

  it('ch5-list variable join number signal names augmentation (signals interval [501, 510])', () => {
    PlaygroundPage
        .openURL()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_LIST)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.LIST_EL)
        .checkVariableSignalsJoinNrAugmentation(JoinNumbersData.LIST_EL,
            '.l-item', 'data-ch5-appendclass',
            501, '.l-item .list-item-label', 'item_');
  });

});

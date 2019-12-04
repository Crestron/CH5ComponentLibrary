// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {PlaygroundPage} from '../page-objects';
import {EmulatorData} from "../data-providers/EmulatorData";
import {JoinNumbersData} from '../data-providers/JoinNumbersData';

describe('Join Number Signals: utility functions', () => {
  it('CrComLib.publishEvent, CrComLib.subscribeState, CrComLib.unsubscribeState', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getUtilityFuncJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_UTILITY_FUNCTION)
        .goToEditorJs()
        .inputJsText(JoinNumbersData.SUBSCRIBE_22 + JoinNumbersData.PUBLISH_22_FIRST_TESTING_VALUE +
            JoinNumbersData.UNSUBSCRIBE_22 + JoinNumbersData.PUBLISH_22_SECOND_TESTING_VALUE)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.UTILITY_FUNCTION_TARGET_EL)
        .checkElementHTML(JoinNumbersData.UTILITY_FUNCTION_TARGET_EL, JoinNumbersData.SIGNAL_22_FIRST_VALUE);
  });

  it('CrComLib.subscribeStateScript, CrComLib.unsubscribeStateScript', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getUtilityFuncJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_UTILITY_FUNCTION)
        .goToEditorJs()
        .inputJsText(JoinNumbersData.SUBSCRIBE_SIGNAL_SCRIPT + JoinNumbersData.PUBLISH_SCRIPT_SIGNAL_1 +
            JoinNumbersData.UNSUBSCRIBE_SIGNAL_SCRIPT + JoinNumbersData.PUBLISH_SCRIPT_SIGNAL_2)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.UTILITY_FUNCTION_TARGET_EL)
        .checkElementHTML(JoinNumbersData.UTILITY_FUNCTION_TARGET_EL, JoinNumbersData.SCRIPT_VALUE_1);
  });

  it('CrComLib.getState', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getUtilityFuncJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_UTILITY_FUNCTION)
        .goToEditorJs()
        .inputJsText(JoinNumbersData.PUBLISH_22_FIRST_TESTING_VALUE + JoinNumbersData.GET_SIGNAL_VALUE)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.UTILITY_FUNCTION_TARGET_EL)
        .checkElementHTML(JoinNumbersData.UTILITY_FUNCTION_TARGET_EL, JoinNumbersData.SIGNAL_22_FIRST_VALUE);
  });
});

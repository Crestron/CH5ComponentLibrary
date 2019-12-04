// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {PlaygroundPage} from '../page-objects';
import {EmulatorData} from "../data-providers/EmulatorData";
import {JoinNumbersData} from '../data-providers/JoinNumbersData';

describe('Join Number Signals: data-ch5-* attributes', () => {
  it('data-ch5-show', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_SHOW)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_SHOW_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_SHOW_BTN)
        .checkVisibility(JoinNumbersData.DATA_SHOW_AREA);
  });

  it('data-ch5-showpulse', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_SHOWPULSE)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_SHOWPULSE_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_SHOWPULSE_BTN)
        .checkVisibility(JoinNumbersData.DATA_SHOWPULSE_AREA);
  });

  it('data-ch5-hidepulse', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_HIDEPULSE)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_HIDEPULSE_AREA)
        .checkVisibility(JoinNumbersData.DATA_HIDEPULSE_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_HIDEPULSE_BTN)
        .checkNoVisibility(JoinNumbersData.DATA_HIDEPULSE_AREA);
  });

  it('data-ch5-textcontent', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_TEXTCONTENT)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_TEXTCONTENT_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_TEXTCONTENT_BTN)
        .checkVisibility(JoinNumbersData.DATA_TEXTCONTENT_AREA)
        .checkTextContent(JoinNumbersData.DATA_TEXTCONTENT_AREA, JoinNumbersData.EXPECTED_TEXT_CONTENT);
  });

  it('data-ch5-innerhtml', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_INNERHTML)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_INNERHTML_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_INNERHTML_BTN)
        .checkVisibility(JoinNumbersData.DATA_INNERHTML_AREA)
        .checkHtmlContent(JoinNumbersData.DATA_INNERHTML_AREA, JoinNumbersData.EXPECTED_HTML_CONTENT)
  });

  it('data-ch5-appendstyle', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_APPENDSTYLE)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_APPENDSTYLE_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_APPENDSTYLE_BTN)
        .checkVisibility(JoinNumbersData.DATA_APPENDSTYLE_AREA)
        .checkAttribute(JoinNumbersData.DATA_APPENDSTYLE_AREA, 'style', JoinNumbersData.EXPECTED_STYLE)
  });

  it('data-ch5-appendclass', () => {
    PlaygroundPage
        .openURL()
        .goToEmulator()
        .inputEmulatorText(EmulatorData.getDataCh5AttrsJoinNrsSignalsScenario())
        .loadEmulator()
        .goToEditorHtml()
        .inputHtmlText(JoinNumbersData.HTML_TMPL_DATA_APPENDCLASS)
        .clickPreviewBtn()
        .checkExistance(JoinNumbersData.DATA_APPENDCLASS_AREA)
        .clickGeneratedElement(JoinNumbersData.DATA_APPENDCLASS_BTN)
        .checkVisibility(JoinNumbersData.DATA_APPENDCLASS_AREA)
        .checkAttribute(JoinNumbersData.DATA_APPENDCLASS_AREA, 'class', JoinNumbersData.EXPECTED_CLASS)
  });
});

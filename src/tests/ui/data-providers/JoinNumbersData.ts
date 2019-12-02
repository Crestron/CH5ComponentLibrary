// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class JoinNumbersData {

  public static HTML_TMPL_UTILITY_FUNCTION: string = '<div id="utility-ex-1"></div>';
  public static UTILITY_FUNCTION_TARGET_EL: string = '#utility-ex-1';
  public static SUBSCRIBE_22: string = 'const sig22SubKey = CrComLib.subscribeState(\'s\',\'22\', ' +
      'function (value) {' +
      '        document.getElementById(\'utility-ex-1\').textContent = value;' +
      '});';

  public static SIGNAL_22_FIRST_VALUE: string = 'Testing...';
  public static PUBLISH_22_FIRST_TESTING_VALUE: string = 'CrComLib.publishEvent(\'s\',\'22\', \'' +
      JoinNumbersData.SIGNAL_22_FIRST_VALUE+ '\');';
  public static PUBLISH_22_SECOND_TESTING_VALUE: string = 'CrComLib.publishEvent(\'s\',\'22\', ' +
      '\'Second testing value...\');';
  public static UNSUBSCRIBE_22: string = 'CrComLib.unsubscribeState(\'s\',\'22\', sig22SubKey);';

  public static SUBSCRIBE_SIGNAL_SCRIPT: string = 'const signalScript = \'CrComLib.textformat("City: {1}","{{s.23}}")\';' +
      'const callback = (result) => {' +
      '        document.getElementById(\'utility-ex-1\').textContent = result;' +
      '};' +
      'const scriptSubKey = CrComLib.subscribeStateScript(signalScript, callback, \'defaultValue\');';
  public static PUBLISH_SCRIPT_SIGNAL_1: string = 'CrComLib.publishEvent(\'b\',\'update_script_signal_1\', true);';
  public static PUBLISH_SCRIPT_SIGNAL_2: string = 'CrComLib.publishEvent(\'b\',\'update_script_signal_2\', true);';
  public static SCRIPT_VALUE_1: string = 'City: New York';
  public static UNSUBSCRIBE_SIGNAL_SCRIPT: string = 'CrComLib.unsubscribeStateScript(scriptSubKey);';

  public static GET_SIGNAL_VALUE: string = 'document.getElementById(\'utility-ex-1\').textContent = ' +
      'CrComLib.getState(\'s\', \'22\')';

  public static HTML_TMPL_SELECT: string = '<ch5-select id="select-ex-1" indexId="id" ' +
      'receiveStateSize="25">' +
      '<template><ch5-select-option data-ch5-appendclass="301{{id}}"><span>item_{{id}}</span></ch5-select-option>' +
      '</template></ch5-select>' +
      '<ch5-button id="setSelectSize" label="SendEvent" sendeventonclick="25"></ch5-button>';

  public static SELECT_EL: string = '#select-ex-1';
  public static TRIGGER_SELECT_EL_SIZE_UPDATE: string = '#setSelectSize';

  public static SPINNER_EL: string = '#augmented-spinner';
  public static HTML_TMPL_SPINNER: string = '<ch5-spinner id="augmented-spinner"' +
      'indexId="idx" label="item {{idx}}" itemHeight="40" size="7">' +
      '<template>' +
      '  <div class="spinner-item" data-ch5-appendstyle="401{{idx}}">' +
      '    <label>Item {{idx}}</label>' +
      '  </div>' +
      '</template>' +
      '</ch5-spinner>';

  public static LIST_EL: string = '#augmented-list';
  public static HTML_TMPL_LIST: string = '<ch5-list id="augmented-list" size="10"' +
      'orientation="horizontal" indexId="idx" minWidth="250px" maxWidth="500px" minHeight="100px" maxHeight="150px" ' +
      'itemWidth="125px" itemHeight="75px" scrollbar="true">' +
      '<template>' +
      '  <div class="l-item" data-ch5-appendclass="501{{idx}}">' +
      '    <span class="list-item-label">item_{{idx}}</span>' +
      '  </div>' +
      '</template>' +
      '</ch5-list>';

  public static DATA_SHOW_BTN: string = '#data-show-btn';
  public static DATA_SHOW_AREA: string = '#data-show-area';
  public static HTML_TMPL_DATA_SHOW: string = '<ch5-button id="data-show-btn" type="info" label="Toggle data-ch5-show"' +
      'sendEventOnClick="1"></ch5-button>' +
      '<div id="data-show-area" data-ch5-show="1" data-ch5-noshow-type="display">' +
      '   DIV: Testing data-ch5-show and noshow-type-visibility set to display' +
      '</div>';

  public static DATA_SHOWPULSE_BTN: string = '#data-showpulse-btn';
  public static DATA_SHOWPULSE_AREA: string = '#data-showpulse-area';
  public static HTML_TMPL_DATA_SHOWPULSE: string = '<ch5-button id="data-showpulse-btn" type="info"' +
      'label="Toggle data-ch5-showpulse" sendEventOnClick="2"></ch5-button>' +
      '<div id="data-showpulse-area" data-ch5-showpulse="2" data-ch5-noshow-type="visibility">' +
      '   DIV: Testing data-ch5-showpulse and noshow-type-visibility set to visibility' +
      '</div>';

  public static DATA_HIDEPULSE_BTN: string = '#data-hidepulse-btn';
  public static DATA_HIDEPULSE_AREA: string = '#data-hidepulse-area';
  public static HTML_TMPL_DATA_HIDEPULSE: string = '<ch5-button id="data-hidepulse-btn" type="info" ' +
      'label="Toggle data-ch5-hidepulse" sendEventOnClick="3"></ch5-button>' +
      '<div id="data-hidepulse-area" data-ch5-hidepulse="3" data-ch5-noshow-type="remove">' +
      '  DIV: Testing data-ch5-hidepulse and noshow-type-visibility set to remove' +
      '</div>';

  public static DATA_TEXTCONTENT_BTN: string = '#data-textcontent-btn';
  public static DATA_TEXTCONTENT_AREA: string = '#data-textcontent-area';
  public static HTML_TMPL_DATA_TEXTCONTENT: string = '<ch5-button id="data-textcontent-btn" type="info" ' +
      'label="Update content using data-ch5-textcontent" sendEventOnClick="4"></ch5-button>' +
      '<div id="data-textcontent-area" data-ch5-textcontent="4">' +
      '  DIV: Testing data-ch5-textcontent' +
      '</div>';
  public static EXPECTED_TEXT_CONTENT: string = '25 degrees Celsius';

  public static DATA_INNERHTML_BTN: string = '#data-innerhtml-btn';
  public static DATA_INNERHTML_AREA: string = '#data-innerhtml-area';
  public static HTML_TMPL_DATA_INNERHTML: string = '<ch5-button id="data-innerhtml-btn" type="info" ' +
    'label="Update HTML" sendEventOnClick="5"></ch5-button>' +
    '<div id="data-innerhtml-area" data-ch5-innerhtml="5"></div>';
  public static EXPECTED_HTML_CONTENT: string = '<strong>DIV: </strong><span class="c-green">innerHTML updated using ' +
  'signal defined by</span> <span class="c-blue">data-ch5-innerhtml attribute</span>';

  public static DATA_APPENDSTYLE_BTN: string = '#data-appendstyle-btn';
  public static DATA_APPENDSTYLE_AREA: string = '#data-appendstyle-area';
  public static HTML_TMPL_DATA_APPENDSTYLE: string = '<ch5-button id="data-appendstyle-btn" type="info" ' +
      'label="Update style" sendEventOnClick="6"></ch5-button>' +
      '<div id="data-appendstyle-area" data-ch5-appendstyle="6">' +
      '  DIV: Testing data-ch5-appendstyle' +
      '</div>';
  public static EXPECTED_STYLE: string = 'background-color: yellow; color: red; font-weight: bold;';

  public static DATA_APPENDCLASS_BTN: string = '#data-appendclass-btn';
  public static DATA_APPENDCLASS_AREA: string = '#data-appendclass-area';
  public static HTML_TMPL_DATA_APPENDCLASS: string = '<ch5-button id="data-appendclass-btn" type="info" ' +
    'label="Update class" sendEventOnClick="7"></ch5-button>' +
    '<div id="data-appendclass-area" data-ch5-appendclass="7">' +
    '   DIV: Testing data-ch5-appendclass' +
    '</div>';
  public static EXPECTED_CLASS: string = 'c-green';

}

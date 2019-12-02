// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ImageData } from './ImageData';
import { ButtonData } from './ButtonData';
import { ListData } from './ListData';
import { ToggleData } from './ToggleData';
import { SliderData } from './SliderData';
import { OverlayPanelData } from './OverlayPanelData';
import { TextInputData } from './TextInputData';
import { SelectData } from './SelectData';
import { SpinnerData } from './SpinnerData';
import { TriggerViewData } from './TriggerViewData';
import { TriggerViewChildData } from './TriggerViewChildData';


export class EmulatorData{

    public static receiveStateSelectedButton():string {
        var receiveStateSelectedButton = {
            "cues": [{
                "type": "boolean",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ButtonData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE,
                    "type": "boolean",
                    "logic": "toggle"
                    }]
                }]
            };

        return JSON.stringify(receiveStateSelectedButton);
    };

    public static receiveStateLabelButton(): string {
        var receiveStateLabelButton = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": "btn_receive_label",
                    "type": "string",
                    "logic": "set",
                    "value": ButtonData.RECEIVE_SIGNAL_LABEL_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateLabelButton);
    };

    public static receiveStateScriptLabelHTMLButton(): string {
        var receiveStateScriptLabelHTMLButton = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": "btn_receive_signal_script_label_html",
                    "type": "string",
                    "logic": "set",
                    "value": ButtonData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateScriptLabelHTMLButton);
    };

    public static receiveStateScrollTo(): string {
        var receiveStateScrollTo = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ListData.RECEIVE_SIGNAL_SCROLL_TO_ATTRIBUTE_VALUE,
                    "type": "number",
                    "logic": "increment",
                    "offset": 10
                    }]
                }]
            };

        return JSON.stringify(receiveStateScrollTo);
    };

    public static receiveStateSizeList(): string {
        var receiveStateSizeList = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ListData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE,
                    "type": "number",
                    "logic": "increment",
                    "offset": Number(ListData.NEW_SIZE_VALUE)
                    }]
                }]
            };

        return JSON.stringify(receiveStateSizeList);
    };

    public static receiveStateTemplateVarsList(): string {
        var receiveStateTemplateVarsList = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ListData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE,
                    "type": "string",
                    "logic": "set",
                    "value": ListData.RECEIVE_SIGNAL_TEMPLATE_VARS_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateTemplateVarsList);
    };

    public static receiveStateUrlImage(): string {
        var receiveStateUrlImage = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ImageData.RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE,
                    "type": "string",
                    "logic": "set",
                    "value": ImageData.RECEIVE_SIGNAL_URL_INNER_HTML_NEW_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateUrlImage);
    };

    public static feedbackModeToggle(): string {
        var feedbackModeToggle = {
            "cues": [{
                "type": "boolean",
                "event": "send_signal_on_submit",
                "trigger": "&change",
                "actions": [
                    {
                    "state": "receive_switch_value",
                    "type": "b",
                    "logic": "set",
                    "value": ToggleData.FEEDBACK_MODE_RECEIVE_SIGNAL_VALUE
                    }]
                }]
            };

        return JSON.stringify(feedbackModeToggle);
    };

    public static receiveStateBooleanValue(): string {
        var receiveStateBooleanValue = {
            "cues": [{
                "type": "boolean",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ToggleData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE,
                    "type": "b",
                    "logic": "set",
                    "value": true
                    }]
                }]
            };

        return JSON.stringify(receiveStateBooleanValue);
    };

    public static receiveStateScriptLabelHTMLToggle(): string {
        var receiveStateScriptLabelHTMLToggle = {
            "cues": [{
                "type": "boolean",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": ToggleData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE,
                    "type": "string",
                    "logic": "set",
                    "value": ToggleData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateScriptLabelHTMLToggle);
    };

    public static receiveStateNumberValue(): string {
        var receiveStateNumberValue = {
            "cues": [{
                "type": "boolean",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SliderData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE,
                    "type": "number",
                    "logic": "set",
                    "value": Number(SliderData.RECEIVE_SIGNAL_VALUE_VALUE)
                    }]
                }]
            };

        return JSON.stringify(receiveStateNumberValue);
    };

    public static receiveStateNumberValueHigh(): string {
        var receiveStateNumberValueHigh = {
            "cues": [{
                "type": "boolean",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SliderData.RECEIVE_SIGNAL_VALUE_HIGH_ATTRIBUTE_VALUE,
                    "type": "number",
                    "logic": "set",
                    "value": Number(SliderData.RECEIVE_SIGNAL_VALUE_HIGH_VALUE)
                    }]
                }]
            };

        return JSON.stringify(receiveStateNumberValueHigh);
    };

    public static feedbackModeSlider(): string {
        var feedbackModeSlider = {
            "cues": [{
                "type": "n",
                "event": "send_signal_on_submit",
                "trigger": "&change",
                "actions": [
                    {
                    "state": SliderData.FEEDBACK_MODE_RECEIVE_SIGNAL,
                    "type": "number",
                    "logic": "set",
                    "value": Number(SliderData.FEEDBACK_MODE_RECEIVE_SIGNAL_VALUE)
                    }]
                }]
            };

        return JSON.stringify(feedbackModeSlider);
    };

    public static receiveStatePositionTo(): string {
        var receiveStatePositionTo = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": OverlayPanelData.RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE_VALUE,
                    "type": "s",
                    "logic": "set",
                    "value": OverlayPanelData.RECEIVE_SIGNAL_POSITION_TO_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStatePositionTo);
    };

    public static receiveStatePositionOffset(): string {
        var receiveStatePositionOffset = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": OverlayPanelData.RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE_VALUE,
                    "type": "s",
                    "logic": "set",
                    "value": OverlayPanelData.RECEIVE_SIGNAL_POSITION_OFFSET_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStatePositionOffset);
    };

    public static receiveStateCustomClass(): string {
        var receiveStateCustomClass = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": "custom_signal",
                    "type": "s",
                    "logic": "set",
                    "value": "box"
                    }]
                }]
            };

        return JSON.stringify(receiveStateCustomClass);
    };

    public static receiveStateStyleClass(): string {
        var receiveStateStyleClass = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": "custom_style_signal",
                    "type": "s",
                    "logic": "set",
                    "value": "border:1px solid red;"
                    }]
                }]
            };

        return JSON.stringify(receiveStateStyleClass);
    };

    public static receiveStateShow(): string {
        var receiveStateShow = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": "show_signal",
                    "type": "b",
                    "logic": "set",
                    "value": true
                    }]
                }]
            };

        return JSON.stringify(receiveStateShow);
    };

    public static receiveStateShowPulse(): string {
        var receiveStateShowPulse = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": "show_pulse_signal",
                    "type": "b",
                    "logic": "pulse"
                    }]
                }]
            };

        return JSON.stringify(receiveStateShowPulse);
    };

    public static receiveStateHidePulse(): string {
        var receiveStateHidePulse = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": "hide_pulse_signal",
                    "type": "b",
                    "logic": "pulse"
                    }]
                }]
            };

        return JSON.stringify(receiveStateHidePulse);
    };

    public static receiveStateEnable(): string {
        var receiveStateHidePulse = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                    "state": "enable_signal",
                    "type": "b",
                    "logic": "set",
                    "value": true
                    }]
                }]
            };

        return JSON.stringify(receiveStateHidePulse);
    };

    public static sendEventOnShow(): string {
        const sendEventOnShow = {
            "cues": [{
                "type": "b",
                "event": "trigger_1",
                "trigger": true,
                "actions": [
                    {
                        "state": "receive_show",
                        "type": "b",
                        "logic": "set",
                        "value": true
                    }]
            }]
        };

        return JSON.stringify(sendEventOnShow);
    };

    public static receiveStateFocus(): string {
        var receiveStateFocus = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": TextInputData.RECEIVE_SIGNAL_FOCUS_ATTRIBUTE_VALUE,
                    "type": "b",
                    "logic": "set",
                    "value": TextInputData.RECEIVE_SIGNAL_FOCUS_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateFocus);
    };

    public static receiveStateValueTextInput(): string {
        var receiveStateValueTextInput = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": TextInputData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE,
                    "type": "s",
                    "logic": "set",
                    "value": TextInputData.RECEIVE_SIGNAL_VALUE_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateValueTextInput);
    };

    public static receiveStateUrlSelectOption(): string {
        var receiveStateUrlSelect = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": SelectData.RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE,
                        "type": "s",
                        "logic": "set",
                        "value": SelectData.RECEIVE_SIGNAL_URL_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateUrlSelect);
    };

    public static receiveStateValueSelect(): string {
        var receiveStateValueSelect = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SelectData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE,
                    "type": "n",
                    "logic": "set",
                    "value": SelectData.RECEIVE_SIGNAL_VALUE_EMULATOR_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateValueSelect);
    };

    public static receiveStateSizeSelect(): string {
        var receiveStateSizeSelect = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SelectData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE,
                    "type": "n",
                    "logic": "set",
                    "value": SelectData.RECEIVE_SIGNAL_SIZE_EMULATOR_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateSizeSelect);
    };

    public static receiveStateTemplateVarsSelect(): string {
        var receiveStateTemplateVarsSelect = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SelectData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE,
                    "type": "string",
                    "logic": "set",
                    "value": SelectData.RECEIVE_SIGNAL_TEMPLATE_VARS_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateTemplateVarsSelect);
    };

    public static receiveStateSelectedSelectOption():string {
        var receiveStateSelectedSelectOption = {
            "cues": [{
                "type": "boolean",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SelectData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE,
                    "type": "boolean",
                    "logic": "toggle"
                    }]
                }]
            };

        return JSON.stringify(receiveStateSelectedSelectOption);
    };

    public static receiveStateLabelSelectOption(): string {
        var receiveStateLabelSelectOption = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "type": "string",
                    "state": "receive_signal_label_0",
                    "logic": "set",
                    "value": "Option 1"
                    },
                    {
                    "type": "string",
                    "state": "receive_signal_label_1",
                    "logic": "set",
                    "value": "Option 2"
                    }]
                }]
            };

        return JSON.stringify(receiveStateLabelSelectOption);
    };

    public static receiveStateScriptLabelHTMLSelectOption(): string {
        var receiveStateScriptLabelHTMLSelectOption = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "type": "string",
                    "state": "receive_signal_script_label_html_0",
                    "logic": "set",
                    "value": SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE
                    },
                    {
                    "type": "string",
                    "state": "receive_signal_script_label_html_1",
                    "logic": "set",
                    "value": SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateScriptLabelHTMLSelectOption);
    };

    public static receiveStateValueSpinner(): string {
        var receiveStateValueSpinner = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SpinnerData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE,
                    "type": "n",
                    "logic": "set",
                    "value": SpinnerData.RECEIVE_SIGNAL_VALUE_EMULATOR_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateValueSpinner);
    };

    public static receiveStateSizeSpinner(): string {
        var receiveStateSizeSpinner = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "state": SpinnerData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE,
                    "type": "n",
                    "logic": "set",
                    "value": SpinnerData.RECEIVE_SIGNAL_SIZE_EMULATOR_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateSizeSpinner);
    };

    public static receiveStateLabelSpinner(): string {
        var receiveStateLabelSpinner = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                    "type": "string",
                    "state": "receive_signal_label_0",
                    "logic": "set",
                    "value": "Option 1"
                    },
                    {
                    "type": "string",
                    "state": "receive_signal_label_1",
                    "logic": "set",
                    "value": "Option 2"
                    }]
                }]
            };

        return JSON.stringify(receiveStateLabelSpinner);
    };

    public static receiveStateUrlSpinner(): string {
        var receiveStateUrlSpinner = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": "receive_signal_url_0",
                        "type": "s",
                        "logic": "set",
                        "value": SpinnerData.RECEIVE_SIGNAL_URL_VALUE
                    }]
                }]
            };

        return JSON.stringify(receiveStateUrlSpinner);
    };


    public static receiveStateShowChildIndex(): string {
        var receiveStateShowChildIndex = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": TriggerViewData.RECEIVE_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE,
                        "type": "n",
                        "logic": "set",
                        "value": 2
                    }]
                }]
            };

        return JSON.stringify(receiveStateShowChildIndex);
    };

    public static receiveStateShowTriggerViewChild(): string {
        var receiveStateShowTriggerViewChild = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": TriggerViewChildData.RECEIVE_SIGNAL_SHOW_CHILD_ATTRIBUTE_VALUE,
                        "type": "b",
                        "logic": "set",
                        "value": true
                    }]
                }]
            };

        return JSON.stringify(receiveStateShowTriggerViewChild);
    };

    public static dataCh5Show(): string {
        var dataCh5Show = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": "data_ch5_show_1",
                        "type": "boolean",
                        "logic": "toggle"
                    }]
                }]
            };

        return JSON.stringify(dataCh5Show);
    };

    public static dataCh5TextContent(): string {
        var dataCh5TextContent = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": "data_ch5_textcontent_1",
                        "type": "s",
                        "logic": "set",
                        "value": "New String"
                    }]
                }]
            };

        return JSON.stringify(dataCh5TextContent);
    };


    public static dataCh5InnerHtml(): string {
        var dataCh5InnerHtml = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": "data_ch5_innerhtml_signal_1",
                        "type": "s",
                        "logic": "set",
                        "value": "<strong>DIV: </strong><span class=\"c-green\">innerHTML updated using signal defined by</span> <span class=\"c-blue\">data-ch5-innerhtml attribute</span>"
                    }]
                }]
            };

        return JSON.stringify(dataCh5InnerHtml);
    };

    public static dataCh5AppendStyle(): string {
        var dataCh5AppendStyle = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": "data_ch5_appendstyle_signal_1",
                        "type": "s",
                        "logic": "set",
                        "value": "background-color: yellow; color: red; font-weight: bold;"
                    }]
                }]
            };

        return JSON.stringify(dataCh5AppendStyle);
    };

    public static dataCh5AppendClass(): string {
        var dataCh5AppendStyle = {
            "cues": [{
                "type": "b",
                "event": "signal",
                "trigger": true,
                "actions": [
                    {
                        "state": "data_ch5_appendclass_signal_1",
                        "type": "s",
                        "logic": "set",
                        "value": "blinking_red"
                    }]
                }]
            };

        return JSON.stringify(dataCh5AppendStyle);
    };

    public static getUtilityFuncJoinNrsSignalsScenario(): string {

        const emScenario = {
          "cues": [
            {
              "type": "s",
              "event": "22",
              "trigger": "&change",
              "actions": [
                {
                  "state": "22",
                  "type": "s",
                  "logic": "link"
                }
              ]
            },
            {
              "type": "b",
              "event": "update_script_signal_1",
              "trigger": true,
              "actions": [
                {
                  "state": "23",
                  "type": "s",
                  "logic": "set",
                  "value": "New York"
                }
              ]
            },
            {
              "type": "b",
              "event": "update_script_signal_2",
              "trigger": true,
              "actions": [
                {
                  "state": "23",
                  "type": "s",
                  "logic": "set",
                  "value": "Los Angeles"
                }
              ]
            }
          ]
        };
        return JSON.stringify(emScenario);
    }

  public static getReceiveJoinNrsSignalsScenario(): string {

    const emScenario = {
      "cues": [
        {
          "event": "25",
          "type": "b",
          "trigger": true,
          "actions": [
              {
                "state": "25",
                "type": "n",
                "logic": "set",
                "value": 5
              }
          ]
        }
      ]
    };
    return JSON.stringify(emScenario);
  }

  public static getDataCh5AttrsJoinNrsSignalsScenario(): string {
    const emScenario = {
      "cues": [
        {
          "type": "b",
          "event": "1",
          "trigger": true,
          "actions": [
            {
              "state": "1",
              "type": "b",
              "logic": "toggle"
            }
          ]
        },
        {
          "type": "b",
          "event": "2",
          "trigger": true,
          "actions": [
            {
              "state": "2",
              "type": "b",
              "logic": "pulse"
            }
          ]
        },
        {
          "type": "b",
          "event": "3",
          "trigger": true,
          "actions": [
            {
              "state": "3",
              "type": "b",
              "logic": "pulse"
            }
          ]
        },
        {
          "type": "b",
          "event": "4",
          "trigger": true,
          "actions": [
            {
              "state": "4",
              "type": "s",
              "logic": "set",
              "value": "25 degrees Celsius"
            }
          ]
        },
        {
          "type": "boolean",
          "event": "5",
          "trigger": true,
          "actions": [
            {
              "state": "5",
              "type": "s",
              "logic": "set",
              "value": "<strong>DIV: </strong><span class=\"c-green\">innerHTML updated using signal defined by</span> <span class=\"c-blue\">data-ch5-innerhtml attribute</span>"
            }
          ]
        },
        {
          "type": "b",
          "event": "6",
          "trigger": true,
          "actions": [
            {
              "state": "6",
              "type": "s",
              "logic": "set",
              "value": "background-color: yellow; color: red; font-weight: bold;"
            }
          ]
        },
        {
          "type": "b",
          "event": "7",
          "trigger": true,
          "actions": [
            {
              "state": "7",
              "type": "s",
              "logic": "set",
              "value": "c-green"
            }
          ]
        }
      ]
    };
    return JSON.stringify(emScenario);
  }
}

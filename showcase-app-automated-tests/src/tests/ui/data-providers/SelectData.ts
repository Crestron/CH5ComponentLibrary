// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class SelectData {

    public static GENERATED_SELECT: string = 'div.content.preview > ch5-select:nth-child(1)';
    public static GENERATED_SELECTED_OPTION: string = 'div.content.preview > ch5-select > div.ch5-select__main';
    public static GENERATED_OPTION_ONE_SELECT: string = 'div.content.preview > ch5-select > div.ch5-select__panel__items > ch5-select-option:nth-child(1)';
    public static GENERATED_OPTION_TWO_SELECT: string = 'div.content.preview > ch5-select > div.ch5-select__panel__items > ch5-select-option:nth-child(2)';

    public static OPTION_SELECT_ATTRIBUTE: string = 'data-ch5-opt-idx'

    public static NUMBER_OF_ITEMS: string = 'div.content.preview > ch5-select > div.ch5-select__panel__items > ch5-select-option';
    public static SIZE_ATTRIBUTE: string = 'size';
    public static SIZE_ATTRIBUTE_VALUE: string = '3';
    public static HTML_TEMPLATE_SIZE: string = '<ch5-select size="3" indexId="id"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static ICON_POSITION_SELECT_OPTION_VALUE: string = '1';
    public static ICON_POSITION_CLASS: string = 'ch5-image--dir--ltr';
    public static ICON_POSITION_ATTRIBUTE: string = 'iconPosition';
    public static ICON_POSITION_ATTRIBUTE_VALUE: string = 'last';
    public static HTML_TEMPLATE_ICON_POSITION: string = '<ch5-select size="3" indexId="id"> <template><ch5-select-option receiveStateUrl="receive_signal_url_{{id}}"  receiveStateLabel="label_signal_{{id}}" useDefaultTmpl iconPosition="last" ></ch5-select-option></template></ch5-select>' +
                                                        '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static MULTISELECT_SELECTED_OPTIONS: string = 'Option 1, Option 2';
    public static MULTISELECT_ATTRIBUTE: string = 'multiselect';
    public static HTML_TEMPLATE_MULTISELECT: string =   '<ch5-select size="2" indexId="id" multiselect> <template><ch5-select-option useDefaultTmpl receiveStateLabel="receive_signal_label_{{id}}"></ch5-select-option></template></ch5-select>'+
                                                        '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static SELECTED_VALUE_THIRD_ITEM: string = 'item_2';
    public static SELECTED_VALUE_ATTRIBUTE: string = 'selectedValue';
    public static SELECTED_VALUE_ATTRIBUTE_VALUE: string = '2';
    public static HTML_TEMPLATE_SELECTED_VALUE: string = '<ch5-select size="3" indexId="id" selectedValue="2"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static SCROLL_HEIGHT_STYLE: string = 'max-height: 200px;';
    public static SCROLL_HEIGHT_ATTRIBUTE: string = 'panelScrollHeight';
    public static SCROLL_HEIGHT_ATTRIBUTE_VALUE: string = '200px';
    public static HTML_TEMPLATE_SCROLL_HEIGHT: string = '<ch5-select size="10" indexId="id" panelScrollHeight="200px"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static MAXWIDTH_STYLE: string = 'max-width: 150px;';
    public static MAXWIDTH_ATTRIBUTE: string = 'maxWidth';
    public static MAXWIDTH_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_MAXWIDTH: string = '<ch5-select size="3" maxWidth="150px" indexId="id"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static MINWIDTH_STYLE: string = 'min-width: 450px;';
    public static MINWIDTH_ATTRIBUTE: string = 'minWidth';
    public static MINWIDTH_ATTRIBUTE_VALUE: string = '450px';
    public static HTML_TEMPLATE_MINWIDTH: string = '<ch5-select size="3" minWidth="450px" indexId="id"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static MAXHEIGHT_STYLE: string = 'max-height: 150px;';
    public static MAXHEIGHT_ATTRIBUTE: string = 'maxHeight';
    public static MAXHEIGHT_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_MAXHEIGHT: string = '<ch5-select size="3" maxHeight="150px" indexId="id"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static MINHEIGHT_STYLE: string = 'min-height: 150px;';
    public static MINHEIGHT_ATTRIBUTE: string = 'minHeight';
    public static MINHEIGHT_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_MINHEIGHT: string = '<ch5-select size="3" minHeight="150px" indexId="id"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static MODE_ATTRIBUTE: string = 'mode';
    public static MODE_ATTRIBUTE_VALUE: string = 'panel';
    public static HTML_TEMPLATE_MODE: string = '<ch5-select size="3" indexId="id" mode="panel"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static SIGNAL_VALUE_SYNC_TIMEOUT_SELECT_VALUE: string = 'item_1';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE: string = 'signalValueSyncTimeout';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE: string = '500';
    public static HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT: string = '<ch5-select size="3" indexId="id" signalValueSyncTimeout="500" receiveStateValue="receive_signal_value"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static INDEX_ID_ATTRIBUTE: string = 'indexId';
    public static INDEX_ID_ATTRIBUTE_VALUE: string = 'id';
    public static HTML_TEMPLATE_INDEX_ID: string = '<ch5-select size="3" indexId="id"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static RESIZE_ATTRIBUTE: string = 'resize';
    public static HTML_TEMPLATE_RESIZE: string = '<ch5-select size="3" indexId="id" resize> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static FEEDBACK_MODE_SELECT_VALUE: string = '1';
    public static FEEDBACK_MODE_BTN_SUBMIT: string  = '#btn';
    public static FEEDBACK_MODE_SEND_SIGNAL_ON_CHANGE: string = 'signal_on_change';
    public static FEEDBACK_MODE_ATTRIBUTE: string = 'feedbackMode';
    public static FEEDBACK_MODE_ATTRIBUTE_VALUE: string = 'submit';
    public static HTML_TEMPLATE_FEEDBACK_MODE: string = '<ch5-select size="3" indexId="id" id="select" sendEventOnChange="signal_on_change" feedbackmode="submit" > <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                        '<ch5-button id = "btn" label = "Submit"></ch5-button>';
    public static JS_TEMPLATE_FEEDBACK_MODE: string = 'var button = document.getElementById("btn"); var select = document.getElementById("select"); button.addEventListener("click", function(e){ select.submit();});';

    public static RECEIVE_SIGNAL_VALUE_EMULATOR_VALUE: number = 2;
    public static RECEIVE_SIGNAL_VALUE_VALUE: string = '2';
    public static RECEIVE_SIGNAL_VALUE_SELECT_VALUE: string = 'item_2';
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE: string = 'receiveStateValue';
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE: string = 'receive_signal_value';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE: string =  '<ch5-select size="3" indexId="id" receiveStateValue="receive_signal_value"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_SIZE_EMULATOR_VALUE: number = 5;
    public static RECEIVE_SIGNAL_SIZE_VALUE: string = '5';
    public static RECEIVE_SIGNAL_SIZE_ATTRIBUTE: string = 'receiveStateSize';
    public static RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE: string = 'receive_signal_size';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SIZE: string =  '<ch5-select size="3" indexId="id" receiveStateSize="receive_signal_size"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static FIRST_OPTION_LABEL_TEXT: string = 'item_labelSetViaTemplateVars'
    public static SECOND_OPTION_LABEL_TEXT: string = 'item_secondLabelSet'
    public static RECEIVE_SIGNAL_TEMPLATE_VARS_VALUE: string = '[{\"id\":\"labelSetViaTemplateVars\"},{\"id\":\"secondLabelSet\"}]';
    public static RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE: string = 'receiveStateTemplateVars';
    public static RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE: string = 'signalAddTemplateVars';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_TEMPLATE_VARS: string =  '<ch5-select size="3" receiveStateTemplateVars="signalAddTemplateVars"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                                        '<ch5-button label="SendEvent" sendEventOnClick="signal"></ch5-button>';

    public static SEND_SIGNAL_ON_FOCUS_ATTRIBUTE: string = 'sendEventOnFocus';
    public static SEND_SIGNAL_ON_FOCUS_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE: string = 'focus_input_pulse';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_FOCUS: string = '<ch5-select size="3" indexId="id" sendEventOnFocus="focus_input_pulse"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE: string = 'sendEventOnChange';
    public static SEND_SIGNAL_ON_CHANGE_VALUE: string = '0';
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE: string = 'send_signal_on_change';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE: string = '<ch5-select size="3" indexId="id" sendEventOnChange="send_signal_on_change"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static GENERATED_BTN_FOCUS: string = '#btn';
    public static FOCUS_TRIGGERED: string = 'Event triggered';
    public static HTML_TEMPLATE_FOCUS: string = '<ch5-select size="3" indexId="id" id="select"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                '<button id="btn">Waiting for event...</button>';
    public static JS_TEMPLATE_FOCUS: string = 'var v = document.getElementById("select"); var btn = document.getElementById("btn"); v.addEventListener("focus", function(){ btn.innerHTML = "Event triggered";});';

    public static GENERATED_BTN_BLUR: string = '#btn';
    public static BLUR_TRIGGERED: string = 'Event triggered';
    public static HTML_TEMPLATE_BLUR: string =  '<ch5-select size="3" indexId="id" id="select"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                '<button id="btn">Waiting for event...</button>';
    public static JS_TEMPLATE_BLUR: string = 'var v = document.getElementById("select"); var btn = document.getElementById("btn"); v.addEventListener("blur", function(){ btn.innerHTML = "Event triggered";});';

    public static RESET_SELECT_VALUE: string = 'item_1';
    public static GENERATED_BTN_RESET: string = '#reset';
    public static HTML_TEMPLATE_RESET: string = '<ch5-select size="3" indexId="id" id="select"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                '<button id="reset">reset</button>' + '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_RESET: string = 'var button = document.getElementById("reset"); var dirty = document.getElementById("dirty"); var select = document.getElementById("select"); button.addEventListener("click", function(e){ select.reset();}); dirty.addEventListener("click", function(){dirty.innerHTML = select.getDirty();});';

    public static GENERATED_BTN_GET_VALUE: string = '#value';
    public static HTML_TEMPLATE_GET_VALUE: string = '<ch5-select size="3" indexId="id" id="select"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                    '<button id="value">getValue</button>';
    public static JS_TEMPLATE_GET_VALUE: string = 'var value = document.getElementById("value"); var select = document.getElementById("select"); value.addEventListener("click", function(){value.innerHTML = select.getValue();});';

    public static SET_VALUE_VALUE: string = 'Value set by setValue';
    public static GENERATED_BTN_SET_VALUE: string = '#value';
    public static HTML_TEMPLATE_SET_VALUE: string = '<ch5-select size="3" indexId="id" id="select"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                    '<button id="value">setValue</button>';
    public static JS_TEMPLATE_SET_VALUE: string = 'var value = document.getElementById("value"); var select = document.getElementById("select"); value.addEventListener("click", function(){value.innerHTML = select.setValue("Value set by setValue");});';

    public static GET_DIRTY_FALSE: string = 'false';
    public static GET_DIRTY_TRUE: string = 'true';
    public static GENERATED_BTN_GET_DIRTY: string = '#dirty';
    public static HTML_TEMPLATE_GET_DIRTY: string = '<ch5-select size="3" indexId="id" id="select"> <template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>' +
                                                    '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_GET_DIRTY: string = 'var dirty = document.getElementById("dirty"); var select = document.getElementById("select"); dirty.addEventListener("click", function(){dirty.innerHTML = select.getDirty();});';

    public static RECEIVE_SIGNAL_SELECTED_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SELECTED_ATTRIBUTE: string = 'receiveStateSelected';
    public static RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE: string = 'receive_signal_selected';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SELECTED: string =   '<ch5-select size="3" indexId="id"> <template><ch5-select-option receiveStateSelected="receive_signal_selected"><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                    '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_LABEL_VALUE: string = 'Option 1';
    public static RECEIVE_SIGNAL_LABEL_ATTRIBUTE: string = 'receiveStateLabel';
    public static RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE: string = 'receive_signal_label_0';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_LABEL: string =  '<ch5-select size="2" indexId="id" > <template><ch5-select-option useDefaultTmpl  receiveStateLabel="receive_signal_label_{{id}}"></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_URL_VALUE: string = 'https://imgplaceholder.com/40x40/transparent/757575/glyphicon-star';
    public static RECEIVE_SIGNAL_URL_ATTRIBUTE: string = 'receiveStateUrl';
    public static RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE: string = 'receive_signal_url_0';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_URL: string =    '<ch5-select size="3" indexId="id"> <template><ch5-select-option receiveStateUrl="receive_signal_url_{{id}}" useDefaultTmpl ></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE: string = '<span style=\'color:green\'>Option toggle</span> <span style=\'color:red\'>label 4</span>';
    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE: string = 'receiveStateScriptLabelHTML';
    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE: string = 'receive_signal_script_label_html_0';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SCRIPT_LABEL_HTML: string =  '<ch5-select size="2" indexId="id" multiselect mode="panel"> <template><ch5-select-option useDefaultTmpl  receiveStateScriptLabelHTML="receive_signal_script_label_html_{{id}}"></ch5-select-option></template></ch5-select>'+
                                                                            '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE: string = 'sendEventOnClick';
    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE: string = 'send_signal_on_click';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CLICK: string = '<ch5-select size="3" indexId="id"> <template><ch5-select-option sendEventOnClick="send_signal_on_click"><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id';
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';
    public static HTML_TEMPLATE_ID: string = '<ch5-select id="id-el" size="3"indexId="id"><template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static CUSTOM_CLASS_CLASS: string = 'box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass';
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-select size="3" customClass="box" indexId="id"><template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle';
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-select customStyle="border:1px solid red;" size="3"indexId="id"><template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static SHOW_ATTRIBUTE: string = 'show';
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';
    public static HTML_TEMPLATE_SHOW: string = '<ch5-select show="false" size="3"indexId="id"><template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType';
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-select noshowType="visibility" size="3"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static DISABLED_ATTRIBUTE: string = 'disabled';
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-select disabled="true" size="3"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-select size="3" receiveStateCustomClass="custom_signal"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-select size="3" receiveStateStyleClass="custom_style_signal"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-select show="false" size="3" receiveStateShow="show_signal"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-select show="false" size="3" receiveStateShowPulse="show_pulse_signal"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-select size="3" receiveStateHidePulse="hide_pulse_signal"indexId="id"><template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-select size="3" receiveStateEnable="enable_signal"indexId="id"><template> <ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-select sendEventOnShow="signal_on_show" show="false" size="3" receiveStateShowPulse="trigger_1"indexId="id"><template><ch5-select-option><span>item_{{id}}</span></ch5-select-option></template></ch5-select>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

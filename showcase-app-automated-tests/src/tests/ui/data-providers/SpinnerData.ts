// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class SpinnerData {

    public static GENERATED_OVERLAY: string = 'div.content.preview > ch5-spinner:nth-child(1) > div.ch5-spinner__overlay';
    public static GENERATED_SPINNER: string = 'div.content.preview > ch5-spinner:nth-child(1)';
    public static GENERATED_OPTION_ONE: string = 'div.content.preview > ch5-spinner:nth-child(1) > div.ch5-spinner__wrapper > div.ch5-spinner__scrollarea--animate > :nth-child(1)';
    public static GENERATED_OPTION_TWO: string = 'div.content.preview > ch5-spinner:nth-child(1) > div.ch5-spinner__wrapper > div.ch5-spinner__scrollarea--animate > :nth-child(2)';
    public static GENERATED_OPTION_THREE: string = 'div.content.preview > ch5-spinner:nth-child(1) > div.ch5-spinner__wrapper > div.ch5-spinner__scrollarea--animate > :nth-child(3)';
    public static GENERATED_SPINNER_INNER_HTML: string = 'div.content.preview > ch5-spinner:nth-child(1) > div';
    public static IS_SELECTED: string = 'ch5-spinner--active';
    public static GENERATED_SPINNER_HANDLE: string = 'div.content.preview > ch5-spinner > div.ch5-spinner__wrapper > div.ch5-spinner__highlight';

    public static NUMBER_OF_ITEMS: string = 'div.content.preview > ch5-spinner:nth-child(1) > div > div:nth-child(2) > *';
    public static SIZE_ATTRIBUTE: string = 'size';
    public static SIZE_ATTRIBUTE_VALUE: string = '3';
    public static HTML_TEMPLATE_SIZE: string = '<ch5-spinner size="3" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static ICON_POSITION_CLASS: string = 'ch5-spinner__icon';
    public static ICON_POSITION_ATTRIBUTE: string = 'iconPosition';
    public static ICON_POSITION_ATTRIBUTE_VALUE: string = 'last';
    public static HTML_TEMPLATE_ICON_POSITION: string = '<ch5-spinner size="3" indexId="id" iconPosition="last"> <template><div><i class="ch5-spinner__icon fas fa-plane"></i><span class="ch5-spinner__label">item_{{id}}</span></div></template></ch5-spinner>';

    public static SELECTED_VALUE_ATTRIBUTE: string = 'selectedValue';
    public static SELECTED_VALUE_ATTRIBUTE_VALUE: string = '2';
    public static HTML_TEMPLATE_SELECTED_VALUE: string = '<ch5-spinner size="3" indexId="id" selectedValue="2" > <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static ITEMHEIGHT_STYLE: string = 'height: 50px;';
    public static ITEMHEIGHT_ATTRIBUTE: string = 'itemHeight';
    public static ITEMHEIGHT_ATTRIBUTE_VALUE: string = '50px';
    public static HTML_TEMPLATE_ITEMHEIGHT: string = '<ch5-spinner size="3" indexId="id"  itemHeight="50px"><template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static VISIBLE_ITEM_SCROLL_DISPLAY_AREA: string = 'div.content.preview > ch5-spinner:nth-child(1) > div.ch5-spinner__wrapper > div.ch5-spinner__scrollarea--animate';
    public static VISIBLE_ITEM_SCROLL_STYLE: string = 'transform: translate3d(0px, 66px, 0px);';
    public static VISIBLE_ITEM_SCROLL_ATTRIBUTE: string = 'visibleItemScroll';
    public static VISIBLE_ITEM_SCROLL_ATTRIBUTE_VALUE: string = '6';
    public static HTML_TEMPLATE_VISIBLE_ITEM_SCROLL: string = '<ch5-spinner size="10" indexId="id"  visibleItemScroll="6" > <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static RESIZE_WITDH: string = '{"width":697,"height":33}'
    public static RESIZE_ATTRIBUTE: string = 'resize';
    public static HTML_TEMPLATE_RESIZE: string = '<ch5-spinner size="3" indexId="id" resize><template> <span>item_{{id}}</span></template></ch5-spinner>';
    public static CSS_TEMPLATE_RESIZE: string = '.ch5-spinner__wrapper {width: 200px;}';

    public static MOVE_FIRST_VALUE: string = '-25';
    public static MOVE_SECOND_VALUE: string = '-50';
    public static MOVE_THIRD_VALUE: string = '-75';
    public static ENDLESS_LIST_SIZE: string = '7';
    public static ENDLESS_ATTRIBUTE: string = 'endless';
    public static HTML_TEMPLATE_ENDLESS: string = '<ch5-spinner size="3" endless indexId="id" ><template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static SECOND_OPTION_INDEX: string = '2';
    public static FEEDBACK_MODE_BTN_SUBMIT: string  = '#btn';
    public static FEEDBACK_MODE_SEND_SIGNAL_ON_CHANGE: string = 'signal_on_change';
    public static FEEDBACK_MODE_ATTRIBUTE: string = 'feedbackMode';
    public static FEEDBACK_MODE_ATTRIBUTE_VALUE: string = 'submit';
    public static HTML_TEMPLATE_FEEDBACK_MODE: string = '<ch5-spinner id="spinner" size="3" indexId="id" feedbackMode="submit" sendEventOnChange="signal_on_change"><template> <span>item_{{id}}</span></template></ch5-spinner><ch5-button id = "btn" label = "Submit"></ch5-button>';
    public static JS_TEMPLATE_FEEDBACK_MODE: string = 'var button = document.getElementById("btn"); var spinner = document.getElementById("spinner"); button.addEventListener("click", function(e){ spinner.submit();});';

    public static SIGNAL_VALUE_SYNC_TIMEOUT_SELECT_VALUE: string = 'item_0';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE: string = 'signalValueSyncTimeout';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE: string = '500';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_WAIT_VALUE: string = '600';
    public static HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT: string = '<ch5-spinner size="10" indexId="id" feedbackMode="direct" signalValueSyncTimeout="500" > <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static INDEX_ID_ATTRIBUTE: string = 'indexId';
    public static INDEX_ID_ATTRIBUTE_VALUE: string = 'id';
    public static HTML_TEMPLATE_INDEX_ID: string = '<ch5-spinner size="10" indexId="id" > <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static RECEIVE_SIGNAL_VALUE_EMULATOR_VALUE: number = 1;
    public static RECEIVE_SIGNAL_VALUE_VALUE: string = '1';
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE: string = 'receiveStateValue';
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE: string = 'receive_signal_value';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE: string =  '<ch5-spinner size="10" indexId="id" receiveStateValue="receive_signal_value" > <template> <span>item_{{id}}</span></template></ch5-spinner>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_SIZE_EMULATOR_VALUE: number = 5;
    public static RECEIVE_SIGNAL_SIZE_VALUE: string = '5';
    public static RECEIVE_SIGNAL_SIZE_ATTRIBUTE: string = 'receiveStateSize';
    public static RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE: string = 'receive_signal_size';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SIZE: string =   '<ch5-spinner size="10" indexId="id" receiveStateSize="receive_signal_size" > <template> <span>item_{{id}}</span></template></ch5-spinner>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_LABEL_VALUE: string = 'Option 1';
    public static RECEIVE_SIGNAL_LABEL_ATTRIBUTE: string = 'receiveStateLabel';
    public static RECEIVE_SIGNAL_LABEL_FIRST_OPTION_VALUE: string = 'receive_signal_label_0';
    public static RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE: string = 'receive_signal_label_{{id}}';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_LABEL: string =  '<ch5-spinner size="10" indexId="id" receiveStateLabel="receive_signal_label_{{id}}" ></ch5-spinner>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_URL_VALUE: string = 'https://imgplaceholder.com/40x40/transparent/757575/glyphicon-star';
    public static RECEIVE_SIGNAL_URL_ATTRIBUTE: string = 'receiveStateUrl';
    public static RECEIVE_SIGNAL_URL_FIRST_OPTION_VALUE: string = 'receive_signal_url_0';
    public static RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE: string = 'receive_signal_url_{{id}}';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_URL: string =    '<ch5-spinner size="10" indexId="id" receiveStateUrl="receive_signal_url_{{id}}" ></ch5-spinner>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static SEND_SIGNAL_ON_FOCUS_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_FOCUS_ATTRIBUTE: string = 'sendEventOnFocus';
    public static SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE: string = 'focus_input_pulse';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_FOCUS: string = '<ch5-spinner size="10" indexId="id" sendEventOnFocus="focus_input_pulse" > <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static SEND_SIGNAL_ON_CHANGE_VALUE: string = '2';
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE: string = 'sendEventOnChange';
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE: string = 'signal_on_change';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE: string = '<ch5-spinner size="10" indexId="id" sendEventOnChange="signal_on_change" > <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static SEND_SIGNAL_ON_OVERFLOW_ATTRIBUTE: string = 'sendEventOnOverflow';
    public static SEND_SIGNAL_ON_OVERFLOW_ATTRIBUTE_VALUE: string = 'signal_on_overflow';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_OVERFLOW: string = '<ch5-spinner size="2" indexId="id" sendEventOnOverflow="signal_on_overflow" endless> <template> <span>item_{{id}}</span></template></ch5-spinner>';


    public static MOVE_FIRST_VALUE_UNDERFLOW: string = '100';
    public static MOVE_SECOND_VALUE_UNDERFLOW: string = '200';
    public static SEND_SIGNAL_ON_UNDERFLOW_ATTRIBUTE: string = 'sendEventOnUnderflow';
    public static SEND_SIGNAL_ON_UNDERFLOW_ATTRIBUTE_VALUE: string = 'signal_on_underflow';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_UNDERFLOW: string = '<ch5-spinner size="2" indexId="id" sendEventOnUnderflow="signal_on_underflow" endless> <template> <span>item_{{id}}</span></template></ch5-spinner>';

    public static EMPTY_AFTER_RESET: string = '';
    public static GENERATED_BTN_RESET: string = '#reset';
    public static HTML_TEMPLATE_RESET: string = '<ch5-spinner id="spinner" size="10" indexId="id" > <template> <span>item_{{id}}</span></template></ch5-spinner>' +
                                                '<button id="reset">reset</button>' + '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_RESET: string = 'var button = document.getElementById("reset"); var dirty = document.getElementById("dirty"); var spinner = document.getElementById("spinner"); button.addEventListener("click", function(e){ spinner.reset();}); dirty.addEventListener("click", function(){dirty.innerHTML = spinner.getDirty();});';

    public static GET_DIRTY_FALSE: string = 'false';
    public static GET_DIRTY_TRUE: string = 'true';
    public static GENERATED_BTN_GET_DIRTY: string = '#dirty';
    public static HTML_TEMPLATE_GET_DIRTY: string = '<ch5-spinner id="spinner" size="10" indexId="id" > <template> <span>item_{{id}}</span></template></ch5-spinner>' +
                                                    '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_GET_DIRTY: string = 'var dirty = document.getElementById("dirty"); var spinner = document.getElementById("spinner"); dirty.addEventListener("click", function(){dirty.innerHTML = spinner.getDirty();});';

    public static GET_VALUE_VALUE: string = '1';
    public static GENERATED_BTN_GET_VALUE: string = '#value';
    public static HTML_TEMPLATE_GET_VALUE: string = '<ch5-spinner id="spinner" size="10" indexId="id" > <template> <span>item_{{id}}</span></template></ch5-spinner>' +
                                                    '<button id="value">getValue</button>';
    public static JS_TEMPLATE_GET_VALUE: string = 'var value = document.getElementById("value"); var spinner = document.getElementById("spinner"); value.addEventListener("click", function(){value.innerHTML = spinner.getValue();});';

    public static SET_VALUE_VALUE: string = '2';
    public static GENERATED_BTN_SET_VALUE: string = '#value';
    public static HTML_TEMPLATE_SET_VALUE: string = '<ch5-spinner id="spinner" size="10" indexId="id" > <template> <span>item_{{id}}</span></template></ch5-spinner>' +
                                                    '<button id="value">setValue</button>';
    public static JS_TEMPLATE_SET_VALUE: string = 'var value = document.getElementById("value"); var spinner = document.getElementById("spinner"); value.addEventListener("click", function(){value.innerHTML = spinner.setValue(2);});';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id';
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';
    public static HTML_TEMPLATE_ID: string = '<ch5-spinner id="id-el" size="3" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>';

    public static CUSTOM_CLASS_CLASS: string = 'box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass';
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-spinner size="3" customClass="box" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle';
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-spinner customStyle="border:1px solid red;" size="3" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>';

    public static SHOW_ATTRIBUTE: string = 'show';
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';
    public static HTML_TEMPLATE_SHOW: string = '<ch5-spinner show="false" size="3" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>';

    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType';
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-spinner noshowType="visibility" size="3" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>';

    public static DISABLED_ATTRIBUTE: string = 'disabled';
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-spinner disabled="true" size="3" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-spinner size="3" receiveStateCustomClass="custom_signal" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-spinner size="3" receiveStateStyleClass="custom_style_signal" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-spinner show="false" size="3" receiveStateShow="show_signal" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-spinner show="false" size="3" receiveStateShowPulse="show_pulse_signal" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-spinner size="3" itemHeight="30" receiveStateHidePulse="hide_pulse_signal" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-spinner size="3" receiveStateEnable="enable_signal" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-spinner sendEventOnShow="signal_on_show" show="false" size="3" receiveStateShowPulse="trigger_1" indexId="id"><template><span>item_{{id}}</span></template></ch5-spinner>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

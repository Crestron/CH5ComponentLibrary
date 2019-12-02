// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class TriggerViewData {

    public static GENERATED_TRIGGERVIEW: string = 'div.content.preview > ch5-triggerview:nth-child(1)';
    public static GENERATED_FIRST_TRIGGERVIEW_CHILD: string = 'div.content.preview > ch5-triggerview:nth-child(1) ch5-triggerview-child:nth-child(1)';
    public static GENERATED_SECOND_TRIGGERVIEW_CHILD: string = 'div.content.preview > ch5-triggerview:nth-child(1) ch5-triggerview-child:nth-child(2)';
    public static GENERATED_SECOND_TRIGGERVIEW_CHILD_ENDLESS: string = 'div.content.preview > ch5-triggerview:nth-child(1) ch5-triggerview-child:nth-child(3)';
    public static PREVIOUS_VIEW_BTN: string = '#prev';
    public static NEXT_VIEW_BTN: string = '#next';
    public static IS_SELECTED: string = 'aria-selected="true"';

    public static HTML_TEMPLATE_PREVIOUS_VIEW_CHILD_METHOD: string =    '<ch5-triggerview id="demo" activeView = 2> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                        '<ch5-button id="prev" label="prev"></ch5-button>';

    public static JS_TEMPLATE_PREVIOUS_VIEW_CHILD_METHOD: string = 'var demo = document.getElementById("demo"); var prev = document.getElementById("prev"); prev.addEventListener("click", function() { demo.previousViewChild(); })';

    public static HTML_TEMPLATE_NEXT_VIEW_CHILD_METHOD: string =    '<ch5-triggerview id="demo"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                    '<ch5-button id="next" label="next"></ch5-button>';

    public static JS_TEMPLATE_NEXT_VIEW_CHILD_METHOD: string = 'var demo = document.getElementById("demo"); var next = document.getElementById("next"); next.addEventListener("click", function() { demo.nextViewChild(); })';

    public static HTML_TEMPLATE_SET_ACTIVE_VIEW_CHILD_METHOD: string =  '<ch5-triggerview id="demo"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child id = "secondView"> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                        '<ch5-button id="set" label="setActiveViewChild"></ch5-button>';

    public static JS_TEMPLATE_SET_ACTIVE_VIEW_CHILD_METHOD: string = 'var demo = document.getElementById("demo"); var secondView = document.getElementById("secondView"); var set = document.getElementById("set"); set.addEventListener("click", function() { demo.setActiveViewChild(secondView); })';

    public static HTML_TEMPLATE_SET_ACTIVE_VIEW_METHOD: string =    '<ch5-triggerview id="demo"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                    '<ch5-button id="set" label="setActiveView"></ch5-button>';

    public static JS_TEMPLATE_SET_ACTIVE_VIEW_METHOD: string = 'var demo = document.getElementById("demo"); var set = document.getElementById("set"); set.addEventListener("click", function() { demo.setActiveView(2); })';

    public static SELECT_EVENT_VALUE = "1";
    public static HTML_TEMPLATE_SELECT_EVENT: string =  '<ch5-triggerview id="demo"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                        '<ch5-button id="next" label="next"></ch5-button>';
    public static JS_TEMPLATE_SELECT_EVENT: string = 'var demo = document.getElementById("demo"); var next = document.getElementById("next"); next.addEventListener("click", function() { demo.nextViewChild(); }); demo.addEventListener("select", function(e) { next.setAttribute("label", e.detail);});';

    public static ENDLESS_ATTRIBUTE_VALUE: string = 'true';
    public static ENDLESS_ATTRIBUTE: string = 'endless';
    public static HTML_TEMPLATE_ENDLESS: string =   '<ch5-triggerview id="demo" endless="true"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                    '<ch5-button id="prev" label="prev"></ch5-button><ch5-button id="next" label="next"></ch5-button>';
    public static JS_TEMPLATE_ENDLESS: string = 'var demo = document.getElementById("demo"); var prev = document.getElementById("prev"); var next = document.getElementById("next"); prev.addEventListener("click", function() { demo.previousViewChild(); }); next.addEventListener("click", function() { demo.nextViewChild(); });';

    public static ACTIVE_VIEW_ATTRIBUTE_VALUE: string = '1';
    public static ACTIVE_VIEW_ATTRIBUTE: string = 'activeView';
    public static HTML_TEMPLATE_ACTIVE_VIEW: string =   '<ch5-triggerview activeView="1"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>';

    public static MOVE_PIXELS_VALUE: string = '-100';
    public static GESTUREABLE_ATTRIBUTE_VALUE: string = 'true';
    public static GESTUREABLE_ATTRIBUTE: string = 'gestureable';
    public static HTML_TEMPLATE_GESTUREABLE: string =   '<ch5-triggerview gestureable="true"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>';

    public static DISABLE_ANIMATION_ATTRIBUTE_VALUE: string = 'true';
    public static DISABLE_ANIMATION_ATTRIBUTE: string = 'disableAnimation';
    public static HTML_TEMPLATE_DISABLE_ANIMATION: string = '<ch5-triggerview id="demo" disableAnimation="true"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                            '<ch5-button id="prev" label="prev"></ch5-button><ch5-button id="next" label="next"></ch5-button>';
    public static JS_TEMPLATE_DISABLE_ANIMATION: string = 'var demo = document.getElementById("demo"); var prev = document.getElementById("prev"); var next = document.getElementById("next"); prev.addEventListener("click", function() { demo.previousViewChild(); }); next.addEventListener("click", function() { demo.nextViewChild(); });';

    public static RECEIVE_SIGNAL_SHOW_CHILD_INDEX_VALUE: string = '2';
    public static RECEIVE_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE: string = 'receive_index_view';
    public static RECEIVE_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE: string = 'receiveStateShowChildIndex';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_CHILD_INDEX: string =   '<ch5-triggerview receiveStateShowChildIndex="receive_index_view"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                            '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static SEND_SIGNAL_SHOW_CHILD_INDEX_VALUE: string = '1';
    public static SEND_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE: string = 'send_index_view';
    public static SEND_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE: string = 'sendEventShowChildIndex';
    public static HTML_TEMPLATE_SEND_SIGNAL_SHOW_CHILD_INDEX: string =  '<ch5-triggerview id="demo" sendEventShowChildIndex="send_index_view"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                        '<ch5-button id="prev" label="prev"></ch5-button><ch5-button id="next" label="next"></ch5-button>';
    public static JS_TEMPLATE_SEND_SIGNAL_SHOW_CHILD_INDEX: string = 'var demo = document.getElementById("demo"); var prev = document.getElementById("prev"); var next = document.getElementById("next"); prev.addEventListener("click", function() { demo.previousViewChild(); }); next.addEventListener("click", function() { demo.nextViewChild(); });';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'data-ch5-id';
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';
    public static HTML_TEMPLATE_ID: string = '<ch5-triggerview data-ch5-id="id-el" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static CUSTOM_CLASS_CLASS: string = 'box"';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass';
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-triggerview customClass="box" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle';
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-triggerview customStyle="border:1px solid red;" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static SHOW_ATTRIBUTE: string = 'show';
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';
    public static HTML_TEMPLATE_SHOW: string = '<ch5-triggerview show="false" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType';
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-triggerview noshowType="visibility" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static DISABLED_ATTRIBUTE: string = 'disabled';
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-triggerview disabled="true" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-triggerview receiveStateCustomClass="custom_signal" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-triggerview receiveStateStyleClass="custom_style_signal" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-triggerview show="false" receiveStateShow="show_signal" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-triggerview show="false" receiveStateShowPulse="show_pulse_signal" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-triggerview receiveStateHidePulse="hide_pulse_signal" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-triggerview receiveStateEnable="enable_signal" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-triggerview sendEventOnShow="signal_on_show" show="false" receiveStateShowPulse="trigger_1" > <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class ListData {

    public static GENERATED_LIST: string = 'div.content.preview > ch5-list:nth-child(1)';
    public static GENERATED_LIST_INNER_HTML: string = 'div.content.preview > ch5-list:nth-child(1) > div';

    public static ORIENTATION_CLASS: string = 'ch5-list-horizontal';
    public static ORIENTATION_ATTRIBUTE: string = 'orientation';
    public static ORIENTATION_ATTRIBUTE_VALUE: string = 'horizontal';
    public static HTML_TEMPLATE_LIST_ORIENTATION: string = '<ch5-list orientation="horizontal" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static NUMBER_OF_LIST_ITEMS: string = 'div.content.preview > ch5-list:nth-child(1) > div.ch5-list-vertical > *';
    public static SIZE_ATTRIBUTE: string = 'size';
    public static SIZE_ATTRIBUTE_VALUE: string = '3';
    public static HTML_TEMPLATE_LIST_SIZE: string = '<ch5-list size="3" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static MAXWIDTH_STYLE: string = 'max-width: 150px;';
    public static MAXWIDTH_ATTRIBUTE: string = 'maxWidth';
    public static MAXWIDTH_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_LIST_MAXWIDTH: string = '<ch5-list size="3" maxWidth="150px" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static MINWIDTH_STYLE: string = 'min-width: 450px;';
    public static MINWIDTH_ATTRIBUTE: string = 'minWidth';
    public static MINWIDTH_ATTRIBUTE_VALUE: string = '450px';
    public static HTML_TEMPLATE_LIST_MINWIDTH: string = '<ch5-list size="3" minWidth="450px" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static MAXHEIGHT_STYLE: string = 'max-height: 150px;';
    public static MAXHEIGHT_ATTRIBUTE: string = 'maxHeight';
    public static MAXHEIGHT_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_LIST_MAXHEIGHT: string = '<ch5-list size="3" maxHeight="150px" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static MINHEIGHT_STYLE: string = 'min-height: 150px;';
    public static MINHEIGHT_ATTRIBUTE: string = 'minHeight';
    public static MINHEIGHT_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_LIST_MINHEIGHT: string = '<ch5-list size="3" minHeight="150px" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static ITEMHEIGHT_STYLE: string = 'height: 150px;';
    public static ITEMHEIGHT_ATTRIBUTE: string = 'itemHeight';
    public static ITEMHEIGHT_ATTRIBUTE_VALUE: string = '150px';
    public static HTML_TEMPLATE_LIST_ITEMHEIGHT: string = '<ch5-list size="3" itemHeight="150px" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static ITEMWIDTH_STYLE: string = 'width: 500px;';
    public static ITEMWIDTH_ATTRIBUTE: string = 'itemWidth';
    public static ITEMWIDTH_ATTRIBUTE_VALUE: string = '500px';
    public static HTML_TEMPLATE_LIST_ITEMWIDTH: string = '<ch5-list size="3" itemWidth="500px" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static INDEXID_TAG: string = 'id="cr-id-';
    public static INDEXID_ATTRIBUTE: string = 'indexId';
    public static INDEXID_ATTRIBUTE_VALUE: string = 'id';
    public static HTML_TEMPLATE_LIST_INDEXID: string = '<ch5-list size="3" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static ITEM_TO_SWIPE: string = 'div.content.preview > ch5-list:nth-child(1) > div > div:nth-child(10)';
    public static PAGEDSWIPE_ATTRIBUTE: string = 'pagedSwipe';
    public static PAGEDSWIPE_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_LIST_PAGEDSWIPE: string = '<ch5-list size="50" maxWidth="200px" maxHeight="350px" itemWidth="150px" itemHeight="50px" pagedSwipe="true" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static SCROLLBAR_ATTRIBUTE: string = 'scrollbar';
    public static SCROLLBAR_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_LIST_SCROLLBAR: string = '<ch5-list size="3" scrollbar="true" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>';

    public static SCROLL_TO_TIME_ATTRIBUTE: string = 'scrollToTime';
    public static SCROLL_TO_TIME_ATTRIBUTE_VALUE: string = '1000';
    public static HTML_TEMPLATE_LIST_SCROLL_TO_TIME: string = '<ch5-list size="100" scrollToTime="1000" receiveStateScrollTo="signalScroll" maxWidth="200px" maxHeight="350px" itemWidth="150px" itemHeight="50px" scrollbar="true" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>' +
                                                            '<ch5-button label="SendEvent" sendEventOnClick="signal"></ch5-button>';

    public static NEW_SIZE_VALUE: string = '10'
    public static RECEIVE_SIGNAL_SIZE_ATTRIBUTE: string = 'receiveStateSize';
    public static RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE: string = 'signalAddItems';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SIZE: string =   '<ch5-list size="1" receiveStateSize="signalAddItems" maxWidth="200px" maxHeight="350px" itemWidth="150px" itemHeight="50px" scrollbar="true" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>' +
                                                                '<ch5-button label="SendEvent" sendEventOnClick="signal"></ch5-button>';

    public static FIRST_ITEM_FROM_LIST: string = 'div.content.preview > ch5-list:nth-child(1) > div > div:nth-child(1)';
    public static RECEIVE_SIGNAL_SCROLL_TO_ATTRIBUTE: string = 'receiveStateScrollTo';
    public static RECEIVE_SIGNAL_SCROLL_TO_ATTRIBUTE_VALUE: string = 'signalScroll';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SCROLL_TO: string = '<ch5-list size="10" receiveStateScrollTo="signalScroll" maxWidth="200px" maxHeight="350px" itemWidth="150px" itemHeight="50px" scrollbar="true" indexId="id"> <template> <span>item_{{id}}</span></template></ch5-list>' +
                                                            '<ch5-button label="SendEvent" sendEventOnClick="signal"></ch5-button>';


    public static FIRST_ITEM_TEXT_FROM_LIST: string = 'item_0 labelSetViaTemplateVars'
    public static RECEIVE_SIGNAL_TEMPLATE_VARS_VALUE: string = '[{\"label\":\"labelSetViaTemplateVars\"},{\"label\":\"secondLabelSet\"}]';
    public static RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE: string = 'receiveStateTemplateVars';
    public static RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE: string = 'signalAddTemplateVars';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_TEMPLATE_VARS: string =  '<ch5-list size="3" receiveStateTemplateVars="signalAddTemplateVars" maxWidth="200px" maxHeight="350px" itemWidth="150px" itemHeight="50px" scrollbar="true" indexId="id"> <template> <span>item_{{id}} {{label}}</span></template></ch5-list>' +
                                                                        '<ch5-button label="SendEvent" sendEventOnClick="signal"></ch5-button>';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id';
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';
    public static HTML_TEMPLATE_ID: string = '<ch5-list id="id-el" size="3"indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>';

    public static CUSTOM_CLASS_CLASS: string = 'class="box"';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass';
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-list size="3" customClass="box" indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>';

    public static CUSTOM_STYLE_CLASS: string = 'style="border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle';
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-list customStyle="border:1px solid red;" size="3"indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>';

    public static SHOW_ATTRIBUTE: string = 'show';
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';
    public static HTML_TEMPLATE_SHOW: string = '<ch5-list show="false" size="3"indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>';

    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType';
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-list noshowType="visibility" size="3"indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>';

    public static DISABLED_ATTRIBUTE: string = 'disabled';
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-list disabled="true" size="3"indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-list size="3" receiveStateCustomClass="custom_signal" indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-list size="3" receiveStateStyleClass="custom_style_signal" indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-list show="false" size="3" receiveStateShow="show_signal" indexId="id" itemHeight="48px" itemWidth="100px"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string = '<ch5-list show="false" size="3" receiveStateShowPulse="show_pulse_signal" indexId="id" itemHeight="48px" itemWidth="100px"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-list size="3" receiveStateHidePulse="hide_pulse_signal" indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-list size="3" receiveStateEnable="enable_signal" indexId="id"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-list sendEventOnShow="signal_on_show" show="false" size="3" receiveStateShowPulse="receive_show" indexId="id" itemHeight="48px" itemWidth="100px"><template> <span>item_{{id}}</span></template></ch5-list>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

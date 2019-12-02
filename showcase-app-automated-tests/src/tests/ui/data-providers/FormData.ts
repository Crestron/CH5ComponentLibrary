// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class FormData {

    public static GENERATED_FORM: string = 'div.content.preview > ch5-form:nth-child(1)';
    public static GENERATED_FORM_SUBMIT: string = 'div.content.preview > ch5-form > ch5-button.ch5-form__submit';
    public static GENERATED_FORM_CANCEL: string = ' div.content.preview > ch5-form > ch5-button.ch5-form__cancel';

    public static HIDE_SUBMIT_BUTTON_ATTRIBUTE: string = 'hideSubmitButton';
    public static HIDE_SUBMIT_BUTTON_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_HIDE_SUBMIT_BUTTON: string ='<ch5-form hideSubmitButton="true"></ch5-form>';

    public static SUBMIT_BUTTON_LABEL_ATTRIBUTE: string = 'submitButtonLabel';
    public static SUBMIT_BUTTON_LABEL_ATTRIBUTE_VALUE: string = 'New Label';
    public static HTML_TEMPLATE_SUBMIT_BUTTON_LABEL: string ='<ch5-form submitButtonLabel="New Label"></ch5-form>';

    public static SUBMIT_BUTTON_ICON_CLASS: string = 'ch5-button--icon';
    public static SUBMIT_BUTTON_ICON_ATTRIBUTE: string = 'submitButtonIcon';
    public static SUBMIT_BUTTON_ICON_ATTRIBUTE_VALUE: string = 'fa fa-play';
    public static HTML_TEMPLATE_SUBMIT_BUTTON_ICON: string ='<ch5-form submitButtonIcon="fa fa-play"></ch5-form>';

    public static SUBMIT_BUTTON_STYLE_ATTRIBUTE: string = 'submitButtonStyle';
    public static SUBMIT_BUTTON_STYLE_ATTRIBUTE_VALUE: string = 'border: 1px solid red';
    public static HTML_TEMPLATE_SUBMIT_BUTTON_STYLE: string ='<ch5-form submitButtonStyle="border: 1px solid red"></ch5-form>';

    public static SUBMIT_BUTTON_CLASS: string = 'ch5-button--success';
    public static SUBMIT_BUTTON_TYPE_ATTRIBUTE: string = 'submitButtonType';
    public static SUBMIT_BUTTON_TYPE_ATTRIBUTE_VALUE: string = 'success';
    public static HTML_TEMPLATE_SUBMIT_BUTTON_TYPE: string ='<ch5-form submitButtonType="success"></ch5-form>';

    public static HIDE_CANCEL_BUTTON_ATTRIBUTE: string = 'hideCancelButton';
    public static HIDE_CANCEL_BUTTON_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_HIDE_CANCEL_BUTTON: string ='<ch5-form hideCancelButton="true"></ch5-form>';

    public static CANCEL_BUTTON_LABEL_ATTRIBUTE: string = 'cancelButtonLabel';
    public static CANCEL_BUTTON_LABEL_ATTRIBUTE_VALUE: string = 'New Label';
    public static HTML_TEMPLATE_CANCEL_BUTTON_LABEL: string ='<ch5-form cancelButtonLabel="New Label"></ch5-form>';

    public static CANCEL_BUTTON_ICON_CLASS: string = 'ch5-button--icon';
    public static CANCEL_BUTTON_ICON_ATTRIBUTE: string = 'cancelButtonIcon';
    public static CANCEL_BUTTON_ICON_ATTRIBUTE_VALUE: string = 'fa fa-play';
    public static HTML_TEMPLATE_CANCEL_BUTTON_ICON: string ='<ch5-form cancelButtonIcon="fa fa-play"></ch5-form>';

    public static CANCEL_BUTTON_STYLE_ATTRIBUTE: string = 'cancelButtonStyle';
    public static CANCEL_BUTTON_STYLE_ATTRIBUTE_VALUE: string = 'border: 1px solid red';
    public static HTML_TEMPLATE_CANCEL_BUTTON_STYLE: string ='<ch5-form cancelButtonStyle="border: 1px solid red"></ch5-form>';

    public static CANCEL_BUTTON_CLASS: string = 'ch5-button--success';
    public static CANCEL_BUTTON_TYPE_ATTRIBUTE: string = 'cancelButtonType';
    public static CANCEL_BUTTON_TYPE_ATTRIBUTE_VALUE: string = 'success';
    public static HTML_TEMPLATE_CANCEL_BUTTON_TYPE: string ='<ch5-form cancelButtonType="success"></ch5-form>';

    public static SUBMIT_ID_LABEL_VALUE: string = 'Click Triggered!';
    public static SUBMIT_ID_TRIGGER_BTN: string = '#trigger_submit';
    public static SUBMIT_ID_ATTRIBUTE: string = 'submitId';
    public static SUBMIT_ID_ATTRIBUTE_VALUE: string = 'submit_id';
    public static HTML_TEMPLATE_SUBMIT_ID: string = '<ch5-form submitId="submit_id"></ch5-form> <button id="trigger_submit">Trigger Submit</button>';
    public static JS_TEMPLATE_SUBMIT_ID: string =   '$(document).ready(function() {' +
     'var submitButton = document.getElementById("submit_id");' +
     'var triggerSubmit = document.getElementById("trigger_submit");' +
     'triggerSubmit.addEventListener("click", function(){ submitButton.setAttribute("disabled", "false"); submitButton.click(); });' +
     'submitButton.addEventListener("click", function(){ submitButton.setAttribute("label","Click Triggered!"); });});';

    public static CANCEL_ID_LABEL_VALUE: string = 'Click Triggered!';
    public static CANCEL_ID_TRIGGER_BTN: string = '#cancel_id';
    public static CANCEL_ID_ATTRIBUTE: string = 'cancelId';
    public static CANCEL_ID_ATTRIBUTE_VALUE: string = 'cancel_id';
    public static HTML_TEMPLATE_CANCEL_ID: string = '<ch5-form cancelId="cancel_id"></ch5-form> <button id="trigger_cancel">Trigger Cancel</button>';
    public static JS_TEMPLATE_CANCEL_ID: string =   '$(document).ready(function() {var cancelButton = document.getElementById("cancel_id"); var triggerSubmit = document.getElementById("trigger_cancel");' +
                                                    'triggerSubmit.addEventListener("click", function(){ cancelButton.click(); });   cancelButton.addEventListener("click", function(){ cancelButton.setAttribute("label","Click Triggered!"); });});';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id';
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';
    public static HTML_TEMPLATE_ID: string = '<ch5-form id="id-el" ></ch5-form>';

    public static CUSTOM_CLASS_CLASS: string = 'class="box"';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass';
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-form customClass="box" ></ch5-form>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle';
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-form customStyle="border:1px solid red;" ></ch5-form>';

    public static SHOW_ATTRIBUTE: string = 'show';
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';
    public static HTML_TEMPLATE_SHOW: string = '<ch5-form show="false" ></ch5-form>';

    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType';
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-form noshowType="visibility" ></ch5-form>';

    public static DISABLED_ATTRIBUTE: string = 'disabled';
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-form disabled="true" ></ch5-form>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-form  receiveStateCustomClass="custom_signal"></ch5-form>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-form  receiveStateStyleClass="custom_style_signal"></ch5-form>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-form show="false"  receiveStateShow="show_signal"></ch5-form>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-form show="false"  receiveStateShowPulse="show_pulse_signal"></ch5-form>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-form  receiveStateHidePulse="hide_pulse_signal"></ch5-form>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-form  receiveStateEnable="enable_signal"></ch5-form>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-form sendEventOnShow="signal_on_show" show="false" receiveStateShowPulse="trigger_1"></ch5-form>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { FormData } from '../data-providers/FormData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ButtonData } from '../data-providers/ButtonData';

describe('Ch5-form', ()=>{
    it('should have the hideSubmitButton attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_HIDE_SUBMIT_BUTTON)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_CANCEL)
            .checkNoVisibility(FormData.GENERATED_FORM_SUBMIT)
            .checkAttribute(FormData.GENERATED_FORM, FormData.HIDE_SUBMIT_BUTTON_ATTRIBUTE, FormData.HIDE_SUBMIT_BUTTON_ATTRIBUTE_VALUE);
    });

    it('should have the submitButtonLabel attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_SUBMIT_BUTTON_LABEL)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementText(FormData.GENERATED_FORM_SUBMIT, FormData.SUBMIT_BUTTON_LABEL_ATTRIBUTE_VALUE)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SUBMIT_BUTTON_LABEL_ATTRIBUTE, FormData.SUBMIT_BUTTON_LABEL_ATTRIBUTE_VALUE);
    });

    it('should have the submitButtonIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_SUBMIT_BUTTON_ICON)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementHTML(FormData.GENERATED_FORM_SUBMIT, FormData.SUBMIT_BUTTON_ICON_CLASS)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SUBMIT_BUTTON_ICON_ATTRIBUTE, FormData.SUBMIT_BUTTON_ICON_ATTRIBUTE_VALUE);
    });

    it('should have the submitButtonStyle attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_SUBMIT_BUTTON_STYLE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementHTML(FormData.GENERATED_FORM_SUBMIT, FormData.SUBMIT_BUTTON_STYLE_ATTRIBUTE_VALUE)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SUBMIT_BUTTON_STYLE_ATTRIBUTE, FormData.SUBMIT_BUTTON_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the submitButtonType attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_SUBMIT_BUTTON_TYPE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementHTML(FormData.GENERATED_FORM_SUBMIT, FormData.SUBMIT_BUTTON_CLASS)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SUBMIT_BUTTON_TYPE_ATTRIBUTE, FormData.SUBMIT_BUTTON_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the hideCancelButton attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_HIDE_CANCEL_BUTTON)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT)
            .checkNoVisibility(FormData.GENERATED_FORM_CANCEL)
            .checkAttribute(FormData.GENERATED_FORM, FormData.HIDE_CANCEL_BUTTON_ATTRIBUTE, FormData.HIDE_CANCEL_BUTTON_ATTRIBUTE_VALUE);
    });

    it('should have the cancelButtonLabel attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_CANCEL_BUTTON_LABEL)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementText(FormData.GENERATED_FORM_CANCEL, FormData.CANCEL_BUTTON_LABEL_ATTRIBUTE_VALUE)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CANCEL_BUTTON_LABEL_ATTRIBUTE, FormData.CANCEL_BUTTON_LABEL_ATTRIBUTE_VALUE);
    });

    it('should have the cancelButtonIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_CANCEL_BUTTON_ICON)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementHTML(FormData.GENERATED_FORM_CANCEL, FormData.CANCEL_BUTTON_ICON_CLASS)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CANCEL_BUTTON_ICON_ATTRIBUTE, FormData.CANCEL_BUTTON_ICON_ATTRIBUTE_VALUE);
    });

    it('should have the cancelButtonStyle attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_CANCEL_BUTTON_STYLE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementHTML(FormData.GENERATED_FORM_CANCEL, FormData.CANCEL_BUTTON_STYLE_ATTRIBUTE_VALUE)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CANCEL_BUTTON_STYLE_ATTRIBUTE, FormData.CANCEL_BUTTON_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the submitButtonType attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_CANCEL_BUTTON_TYPE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkElementHTML(FormData.GENERATED_FORM_CANCEL, FormData.CANCEL_BUTTON_CLASS)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CANCEL_BUTTON_TYPE_ATTRIBUTE, FormData.CANCEL_BUTTON_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the submitId attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputJsText(FormData.JS_TEMPLATE_SUBMIT_ID)
            .inputHtmlText(FormData.HTML_TEMPLATE_SUBMIT_ID)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SUBMIT_ID_ATTRIBUTE, FormData.SUBMIT_ID_ATTRIBUTE_VALUE)
            .clickGeneratedElement(FormData.SUBMIT_ID_TRIGGER_BTN)
            .checkElementText(FormData.GENERATED_FORM_SUBMIT, FormData.SUBMIT_ID_LABEL_VALUE);
    });

    it('should have the cancelId attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputJsText(FormData.JS_TEMPLATE_CANCEL_ID)
            .inputHtmlText(FormData.HTML_TEMPLATE_CANCEL_ID)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkVisibility(FormData.GENERATED_FORM, FormData.GENERATED_FORM_SUBMIT, FormData.GENERATED_FORM_CANCEL)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CANCEL_ID_ATTRIBUTE, FormData.CANCEL_ID_ATTRIBUTE_VALUE)
            .clickGeneratedElement(FormData.CANCEL_ID_TRIGGER_BTN)
            .checkElementText(FormData.GENERATED_FORM_CANCEL, FormData.CANCEL_ID_LABEL_VALUE);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.ID_ATTRIBUTE, FormData.ID_ATTRIBUTE_VALUE);
    });

    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CUSTOM_CLASS_ATTRIBUTE, FormData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(FormData.GENERATED_FORM, FormData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.CUSTOM_STYLE_ATTRIBUTE, FormData.CUSTOM_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM)
            .checkNoVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SHOW_ATTRIBUTE, FormData.SHOW_ATTRIBUTE_VALUE);
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.NOSHOW_TYPE_ATTRIBUTE, FormData.NOSHOW_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.DISABLED_ATTRIBUTE, FormData.DISABLED_ATTRIBUTE_VALUE);
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(FormData.GENERATED_FORM, FormData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, FormData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(FormData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(FormData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(FormData.GENERATED_FORM, FormData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, FormData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(FormData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(FormData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, FormData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(FormData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkBooleanSignal(FormData.RECEIVE_SIGNAL_SHOW_VALUE);
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(FormData.GENERATED_FORM)
            .checkAttribute(FormData.GENERATED_FORM, FormData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, FormData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(FormData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(FormData.GENERATED_FORM, FormData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, FormData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(FormData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(FormData.GENERATED_FORM)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(FormData.GENERATED_FORM, FormData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, FormData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(FormData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkBooleanSignal(FormData.RECEIVE_SIGNAL_ENABLE_VALUE);
    });

    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(FormData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(FormData.GENERATED_FORM, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(FormData.GENERATED_FORM, FormData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, FormData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(FormData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(FormData.GENERATED_FORM)
            .checkBooleanSignal(FormData.SEND_SIGNAL_ON_SHOW_VALUE);
    });
});

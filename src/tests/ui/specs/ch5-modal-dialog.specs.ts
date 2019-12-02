// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ModalDialogData } from '../data-providers/ModalDialogData';

describe('Ch5-modal-dialog', ()=>{
    it('should have the closable attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CLOSABLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.CLOSABLE_CLASS)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CLOSABLE_ATTRIBUTE);           
    });

    it('should have the closeIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CLOSE_ICON)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.CLOSE_ICON_CLASS)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CLOSE_ICON_ATTRIBUTE, ModalDialogData.CLOSE_ICON_ATTRIBUTE_VALUE);           
    });

    it('should have the dismissable attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_DISMISSABLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.DISMISSABLE_ATTRIBUTE, ModalDialogData.DISMISSABLE_ATTRIBUTE_VALUE)
            .clickTabPreview()
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG);           
    });

    it('should have the mask attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_MASK)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.MASK_ATTRIBUTE)
            .checkExistanceOfCssClasses(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.MASK_CLASS)
            .checkVisibility(ModalDialogData.MASK);                    
    });

    it('should have the maskStyle attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_MASK_STYLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.MASK_STYLE_ATTRIBUTE, ModalDialogData.MASK_STYLE_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.MASK_STYLE_CLASS)
            .checkVisibility(ModalDialogData.MASK);                    
    });

    it('should have the overflow attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_OVERFLOW)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.OVERFLOW_CLASS)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.OVERFLOW_ATTRIBUTE, ModalDialogData.OVERFLOW_ATTRIBUTE_VALUE);           
    });

    it('should have the width attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_WIDTH)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.WIDTH_STYLE)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.WIDTH_ATTRIBUTE, ModalDialogData.WIDTH_ATTRIBUTE_VALUE);           
    });

    it('should have the height attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_HEIGHT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.HEIGHT_STYLE)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.HEIGHT_ATTRIBUTE, ModalDialogData.HEIGHT_ATTRIBUTE_VALUE);           
    });

    it('should have the stretch attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_STRETCH)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.STRETCH_CLASS)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.STRETCH_ATTRIBUTE, ModalDialogData.STRETCH_ATTRIBUTE_VALUE);           
    });


    it('should have the title attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_TITLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.TITLE_ATTRIBUTE, ModalDialogData.TITLE_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.TITLE_CLASS)
            .checkElementText(ModalDialogData.GENERATED_TITLE, ModalDialogData.TITLE_ATTRIBUTE_VALUE);           
    });

    it('should have the hideOkButton attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_HIDE_OK_BTN)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.HIDE_OK_BTN_ATTRIBUTE, ModalDialogData.HIDE_OK_BTN_ATTRIBUTE_VALUE)
            .checkNoElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.HIDE_OK_BTN_CLASS)
            .checkNoVisibility(ModalDialogData.GENERATED_BTN_OK);           
    });

    it('should have the hideCancelButton attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_HIDE_CANCEL_BTN)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.HIDE_CANCEL_BTN_ATTRIBUTE, ModalDialogData.HIDE_CANCEL_BTN_ATTRIBUTE_VALUE)
            .checkNoElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.HIDE_CANCEL_BTN_CLASS)
            .checkNoVisibility(ModalDialogData.GENERATED_BTN_CANCEL);           
    });

    it('should have the okButtonLabel attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_OK_BTN_LABEL)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.OK_BTN_LABEL_ATTRIBUTE, ModalDialogData.OK_BTN_LABEL_ATTRIBUTE_VALUE)
            .checkElementText(ModalDialogData.GENERATED_BTN_OK, ModalDialogData.OK_BTN_LABEL_ATTRIBUTE_VALUE);           
    });

    it('should have the okButtonIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_OK_BTN_ICON)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.OK_BTN_ICON_ATTRIBUTE, ModalDialogData.OK_BTN_ICON_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.OK_BTN_ICON_CLASS);           
    });

    it('should have the okButtonStyle attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_OK_BTN_STYLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.OK_BTN_STYLE_ATTRIBUTE, ModalDialogData.OK_BTN_STYLE_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.OK_BTN_STYLE_CLASS);           
    });

    it('should have the cancelButtonLabel attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CANCEL_BTN_LABEL)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CANCEL_BTN_LABEL_ATTRIBUTE, ModalDialogData.CANCEL_BTN_LABEL_ATTRIBUTE_VALUE)
            .checkElementText(ModalDialogData.GENERATED_BTN_CANCEL, ModalDialogData.CANCEL_BTN_LABEL_ATTRIBUTE_VALUE);           
    });

    it('should have the cancelButtonIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CANCEL_BTN_ICON)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CANCEL_BTN_ICON_ATTRIBUTE, ModalDialogData.CANCEL_BTN_ICON_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.CANCEL_BTN_ICON_CLASS);           
    });

    it('should have the cancelButtonStyle attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CANCEL_BTN_STYLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CANCEL_BTN_STYLE_ATTRIBUTE, ModalDialogData.CANCEL_BTN_STYLE_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.CANCEL_BTN_STYLE_CLASS);           
    });

    it('should have the prompt attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_PROMPT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.PROMPT_ATTRIBUTE, ModalDialogData.PROMPT_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.PROMPT_CLASS);           
    });
    
    it('should have the promptIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_PROMPT_ICON)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.PROMPT_ICON_ATTRIBUTE, ModalDialogData.PROMPT_ICON_ATTRIBUTE_VALUE)
            .checkElementHTML(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.PROMPT_ICON_CLASS);           
    });

    it('should be able to send the sendEventOnBeforeShow signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_SHOW)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnAfterShow signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_SHOW)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnBeforeHide signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_HIDE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .clickTabPreview()
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnAfterHide signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_HIDE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .clickTabPreview()
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnOk signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_OK)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_OK_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_OK_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_OK_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_OK)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnCancel signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_CANCEL)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_CANCEL_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_CANCEL_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_CANCEL_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_CANCEL)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should have the show event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SHOW_EVENT)
            .inputJsText(ModalDialogData.JS_TEMPLATE_SHOW_EVENT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkVisibility(ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_TRIGGERED);
    });

    it('should have the hide event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_HIDE_EVENT)
            .inputJsText(ModalDialogData.JS_TEMPLATE_HIDE_EVENT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkVisibility(ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_TRIGGERED);
    });

    it('should have the beforeShow event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_BEFORE_SHOW_EVENT)
            .inputJsText(ModalDialogData.JS_TEMPLATE_BEFORE_SHOW_EVENT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkVisibility(ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_TRIGGERED);
    });

    
    it('should have the afterShow event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_AFTER_SHOW_EVENT)
            .inputJsText(ModalDialogData.JS_TEMPLATE_AFTER_SHOW_EVENT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkVisibility(ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_TRIGGERED);
    });

    it('should have the beforeHide event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_BEFORE_HIDE_EVENT)
            .inputJsText(ModalDialogData.JS_TEMPLATE_BEFORE_HIDE_EVENT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkVisibility(ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_TRIGGERED);
    });

    it('should have the afterHide event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_BEFORE_HIDE_EVENT)
            .inputJsText(ModalDialogData.JS_TEMPLATE_BEFORE_HIDE_EVENT)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkVisibility(ModalDialogData.GENERATED_BTN_TRIGGER, ModalDialogData.GENERATED_BTN_EVENT)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .clickGeneratedElement(ModalDialogData.GENERATED_BTN_TRIGGER)
            .checkElementText(ModalDialogData.GENERATED_BTN_EVENT, ModalDialogData.EVENT_TRIGGERED);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.ID_ATTRIBUTE, ModalDialogData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CUSTOM_CLASS_ATTRIBUTE, ModalDialogData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkExistanceOfCssClasses(ModalDialogData.GENERATED_MODAL_DIALOG_INNER_HTML, ModalDialogData.CUSTOM_CLASS_CLASS);           
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.CUSTOM_STYLE_ATTRIBUTE, ModalDialogData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SHOW_ATTRIBUTE, ModalDialogData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.NOSHOW_TYPE_ATTRIBUTE, ModalDialogData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.DISABLED_ATTRIBUTE, ModalDialogData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, ModalDialogData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ModalDialogData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ModalDialogData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, ModalDialogData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ModalDialogData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ModalDialogData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, ModalDialogData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanSignal(ModalDialogData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, ModalDialogData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, ModalDialogData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, ModalDialogData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanSignal(ModalDialogData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
  
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ModalDialogData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(ModalDialogData.GENERATED_MODAL_DIALOG, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ModalDialogData.GENERATED_MODAL_DIALOG, ModalDialogData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, ModalDialogData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ModalDialogData.GENERATED_MODAL_DIALOG)
            .checkBooleanSignal(ModalDialogData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });
});


// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { OverlayPanelData } from '../data-providers/OverlayPanelData';

describe('Ch5-overlay-panel', ()=>{
    it('should have the closable attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_CLOSABLE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementHTML(OverlayPanelData.GENERATED_OVERLAY_PANEL_INNER_HTML, OverlayPanelData.CLOSABLE_CLASS)
            .checkElementHTML(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.CLOSABLE_ATTRIBUTE);           
    });

    it('should have the closeIcon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_CLOSE_ICON)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementHTML(OverlayPanelData.GENERATED_OVERLAY_PANEL_INNER_HTML, OverlayPanelData.CLOSE_ICON_CLASS)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.CLOSE_ICON_ATTRIBUTE, OverlayPanelData.CLOSE_ICON_ATTRIBUTE_VALUE);           
    });

    it('should have the dismissable attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_DISMISSABLE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.DISMISSABLE_ATTRIBUTE, OverlayPanelData.DISMISSABLE_ATTRIBUTE_VALUE)
            .clickTabPreview()
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL);           
    });

    it('should have the overflow attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_OVERFLOW)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementHTML(OverlayPanelData.GENERATED_OVERLAY_PANEL_INNER_HTML, OverlayPanelData.OVERFLOW_CLASS)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.OVERFLOW_ATTRIBUTE, OverlayPanelData.OVERFLOW_ATTRIBUTE_VALUE);           
    });

    it('should have the stretch attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_STRETCH)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementHTML(OverlayPanelData.GENERATED_OVERLAY_PANEL_INNER_HTML, OverlayPanelData.STRETCH_CLASS)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.STRETCH_ATTRIBUTE, OverlayPanelData.STRETCH_ATTRIBUTE_VALUE);           
    });

    it('should have the positionTo attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_POSITION_TO)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.POSITION_TO_ATTRIBUTE, OverlayPanelData.POSITION_TO_ATTRIBUTE_VALUE);           
    });

    it('should have the positionOffset attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_POSITION_OFFSET)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.POSITION_OFFSET_ATTRIBUTE, OverlayPanelData.POSITION_OFFSET_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStatePositionTo signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStatePositionTo())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_POSITION_TO)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE_VALUE)
            .subscribeStringSignal(OverlayPanelData.RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(OverlayPanelData.RECEIVE_SIGNAL_POSITION_TO_VALUE);           
    });

    it('should be able to receive the receiveStatePositionOffset signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStatePositionOffset())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_POSITION_OFFSET)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE_VALUE)
            .subscribeStringSignal(OverlayPanelData.RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(OverlayPanelData.RECEIVE_SIGNAL_POSITION_OFFSET_VALUE);           
    });    

    it('should be able to send the sendEventOnBeforeShow signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_SHOW)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE, OverlayPanelData.SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnAfterShow signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_SHOW)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE, OverlayPanelData.SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnBeforeHide signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_HIDE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE, OverlayPanelData.SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .clickTabPreview()
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnAfterHide signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_HIDE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE, OverlayPanelData.SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .clickTabPreview()
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanPulseSignal();           
    });

    it('should have the show event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SHOW_EVENT)
            .inputJsText(OverlayPanelData.JS_TEMPLATE_SHOW_EVENT)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkVisibility(OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_TRIGGERED);
    });

    it('should have the hide event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_HIDE_EVENT)
            .inputJsText(OverlayPanelData.JS_TEMPLATE_HIDE_EVENT)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkVisibility(OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_TRIGGERED);
    });

    it('should have the beforeShow event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_BEFORE_SHOW_EVENT)
            .inputJsText(OverlayPanelData.JS_TEMPLATE_BEFORE_SHOW_EVENT)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkVisibility(OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_TRIGGERED);
    });

    
    it('should have the afterShow event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_AFTER_SHOW_EVENT)
            .inputJsText(OverlayPanelData.JS_TEMPLATE_AFTER_SHOW_EVENT)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkVisibility(OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_TRIGGERED);
    });

    it('should have the beforeHide event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_BEFORE_HIDE_EVENT)
            .inputJsText(OverlayPanelData.JS_TEMPLATE_BEFORE_HIDE_EVENT)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkVisibility(OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_TRIGGERED);
    });

    it('should have the afterHide event',() => {
        PlaygroundPage
            .openURL()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_BEFORE_HIDE_EVENT)
            .inputJsText(OverlayPanelData.JS_TEMPLATE_BEFORE_HIDE_EVENT)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkVisibility(OverlayPanelData.GENERATED_BTN_TRIGGER, OverlayPanelData.GENERATED_BTN_EVENT)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_NOT_TRIGGERED)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkElementText(OverlayPanelData.GENERATED_BTN_EVENT, OverlayPanelData.EVENT_TRIGGERED);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.ID_ATTRIBUTE, OverlayPanelData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.CUSTOM_CLASS_ATTRIBUTE, OverlayPanelData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkExistanceOfCssClasses(OverlayPanelData.GENERATED_OVERLAY_PANEL_INNER_HTML, OverlayPanelData.CUSTOM_CLASS_CLASS);           
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.CUSTOM_STYLE_ATTRIBUTE, OverlayPanelData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.SHOW_ATTRIBUTE, OverlayPanelData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.NOSHOW_TYPE_ATTRIBUTE, OverlayPanelData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.DISABLED_ATTRIBUTE, OverlayPanelData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(OverlayPanelData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkStringSignal(OverlayPanelData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(OverlayPanelData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkStringSignal(OverlayPanelData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanSignal(OverlayPanelData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, OverlayPanelData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(OverlayPanelData.GENERATED_BTN_TRIGGER)
            .checkNoVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanSignal(OverlayPanelData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
  
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(OverlayPanelData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(OverlayPanelData.GENERATED_OVERLAY_PANEL, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(OverlayPanelData.GENERATED_OVERLAY_PANEL, OverlayPanelData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, OverlayPanelData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(OverlayPanelData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(OverlayPanelData.GENERATED_OVERLAY_PANEL)
            .checkBooleanSignal(OverlayPanelData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });
});


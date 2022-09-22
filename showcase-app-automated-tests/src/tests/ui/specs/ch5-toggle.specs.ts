// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ToggleData } from '../data-providers/ToggleData';
 
describe('Ch5-toggle', ()=>{
    it('should have the label attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_LABEL)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.LABEL_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.LABEL_ATTRIBUTE, ToggleData.LABEL_ATTRIBUTE_VALUE);           
    });

    it('should have the labeloff attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_OFF_LABEL)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.OFF_LABEL_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.OFF_LABEL_ATTRIBUTE, ToggleData.OFF_LABEL_ATTRIBUTE_VALUE);           
    });

    it('should have the labelOn attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_ON_LABEL)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.ON_LABEL_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.ON_LABEL_ATTRIBUTE, ToggleData.ON_LABEL_ATTRIBUTE_VALUE);           
    });

    it('should have the iconOn attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_ON_ICON)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.ON_ICON_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.ON_ICON_ATTRIBUTE, ToggleData.ON_ICON_ATTRIBUTE_VALUE);           
    });

    it('should have the iconOff attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_OFF_ICON)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.OFF_ICON_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.OFF_ICON_ATTRIBUTE, ToggleData.OFF_ICON_ATTRIBUTE_VALUE);           
    });

    it('should have the handleShape attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_HANDLE_SHAPE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.HANDLE_SHAPE_CLASS)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.SHAPE_RECTANGLE_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.HANDLE_SHAPE_ATTRIBUTE, ToggleData.HANDLE_SHAPE_ATTRIBUTE_VALUE);           
    });

    it('should have the orientation attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_ORIENTATION)
            .clickPreviewBtn()        
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.ORIENTATION_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.ORIENTATION_ATTRIBUTE, ToggleData.ORIENTATION_ATTRIBUTE_VALUE);           
    });

    it('should have the value attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_VALUE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkElementHTML(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.VALUE_CLASS)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.VALUE_ATTRIBUTE, ToggleData.VALUE_ATTRIBUTE_VALUE);           
    });

    it('should have the signalValueSyncTimeout attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE, ToggleData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.TOGGLE_STATE_ATTRIBUTE, ToggleData.TOGGLE_ON)
            .waitForValueSyncTimeout(ToggleData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.TOGGLE_STATE_ATTRIBUTE, ToggleData.TOGGLE_OFF);           
    });

    it('should be able to send the sendEventOnClick signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_SEND_SIGNAL_ON_CLICK)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE, ToggleData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateScriptLabelHTML signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateScriptLabelHTMLToggle())
            .loadEmulator()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_SCRIPT_LABEL_HTML)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ToggleData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ToggleData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE);           
    });

    it('should be able to receive the receiveStateValue signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateBooleanValue())
            .loadEmulator()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.TOGGLE_STATE_ATTRIBUTE, ToggleData.TOGGLE_ON);           
    });

    it('should have the getDirty method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_GET_DIRTY_METHOD)
            .inputJsText(ToggleData.JS_TEMPLATE_GET_DIRTY_METHOD)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_GET_DIRTY)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_GET_DIRTY)
            .clickGeneratedElement(ToggleData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(ToggleData.GENERATED_BTN_GET_DIRTY, ToggleData.GET_DIRTY_FALSE)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.TOGGLE_STATE_ATTRIBUTE, ToggleData.TOGGLE_ON)
            .clickGeneratedElement(ToggleData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(ToggleData.GENERATED_BTN_GET_DIRTY, ToggleData.GET_DIRTY_TRUE);
    });

    it('should have the reset method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RESET_METHOD)
            .inputJsText(ToggleData.JS_TEMPLATE_RESET_METHOD)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_GET_DIRTY, ToggleData.GENERATED_BTN_RESET)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_GET_DIRTY, ToggleData.GENERATED_BTN_RESET)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.TOGGLE_STATE_ATTRIBUTE, ToggleData.TOGGLE_ON)
            .clickGeneratedElement(ToggleData.GENERATED_BTN_RESET)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.TOGGLE_STATE_ATTRIBUTE, ToggleData.TOGGLE_OFF)
            .clickGeneratedElement(ToggleData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(ToggleData.GENERATED_BTN_GET_DIRTY, ToggleData.GET_DIRTY_FALSE);           
    });

    it('should have the focus event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_FOCUS)
            .inputJsText(ToggleData.JS_TEMPLATE_FOCUS)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_FOCUS)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_FOCUS)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .checkElementText(ToggleData.GENERATED_BTN_FOCUS, ToggleData.FOCUS_TRIGGERED);
    });

    it('should have the blur event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_BLUR)
            .inputJsText(ToggleData.JS_TEMPLATE_BLUR)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_BLUR)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_BLUR)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .clickTabPreview()
            .checkElementText(ToggleData.GENERATED_BTN_BLUR, ToggleData.BLUR_TRIGGERED);
    });

    it('should have the submit method and feedbackMode attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.feedbackModeToggle())
            .loadEmulator()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_FEEDBACK_MODE)
            .inputJsText(ToggleData.JS_TEMPLATE_FEEDBACK_MODE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_SUBMIT)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ToggleData.GENERATED_BTN_SUBMIT)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.FEEDBACK_MODE_ATTRIBUTE, ToggleData.FEEDBACK_MODE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.FEEDBACK_MODE_SEND_SIGNAL)
            .subscribeBooleanSignal(ToggleData.FEEDBACK_MODE_RECEIVE_SIGNAL)
            .clickGeneratedElement(ToggleData.GENERATED_TOGGLE)
            .clickGeneratedElement(ToggleData.GENERATED_BTN_SUBMIT)       
            .checkBooleanSignal(ToggleData.FEEDBACK_MODE_RECEIVE_SIGNAL_VALUE)
            .checkBooleanPulseSignal();         
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.ID_ATTRIBUTE, ToggleData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.CUSTOM_CLASS_ATTRIBUTE, ToggleData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkExistanceOfCssClasses(ToggleData.GENERATED_TOGGLE_INNER_HTML, ToggleData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.CUSTOM_STYLE_ATTRIBUTE, ToggleData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkNoVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.SHOW_ATTRIBUTE, ToggleData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.NOSHOW_TYPE_ATTRIBUTE, ToggleData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.DISABLED_ATTRIBUTE, ToggleData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ToggleData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ToggleData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ToggleData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ToggleData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkBooleanSignal(ToggleData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ToggleData.GENERATED_TOGGLE)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ToggleData.GENERATED_TOGGLE)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, ToggleData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkBooleanSignal(ToggleData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
  
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ToggleData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(ToggleData.GENERATED_TOGGLE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ToggleData.GENERATED_TOGGLE, ToggleData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, ToggleData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ToggleData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ToggleData.GENERATED_TOGGLE)
            .checkBooleanSignal(ToggleData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });
});

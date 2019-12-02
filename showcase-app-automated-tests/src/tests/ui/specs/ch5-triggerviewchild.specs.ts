// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { TriggerViewChildData } from '../data-providers/TriggerViewChildData';
 
describe('Ch5-triggerview-child', ()=>{ 

    it('should be able to receive the receiveStateShowTriggerViewChild signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowTriggerViewChild())
            .loadEmulator()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_CHILD)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewChildData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_SHOW_CHILD_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_SHOW_CHILD_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_SHOW_CHILD_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_SHOW_CHILD_VALUE)
            .checkElementHTML(TriggerViewChildData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewChildData.IS_SELECTED);           
    });

    it('should send the sendEventOnShow signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW_CHILD)
            .inputJsText(TriggerViewChildData.JS_TEMPLATE_SEND_SIGNAL_ON_SHOW_CHILD)
            .clickPreviewBtn()           
            .checkExistance(TriggerViewChildData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewChildData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewChildData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewChildData.SEND_SIGNAL_ON_SHOW_CHILD_ATTRIBUTE, TriggerViewChildData.SEND_SIGNAL_ON_SHOW_CHILD_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.SEND_SIGNAL_ON_SHOW_CHILD_ATTRIBUTE_VALUE)
            .clickGeneratedElement(TriggerViewChildData.NEXT_VIEW_BTN)         
            .checkBooleanPulseSignal()
            .checkElementHTML(TriggerViewChildData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewChildData.IS_SELECTED); 
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.ID_ATTRIBUTE, TriggerViewChildData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.CUSTOM_CLASS_ATTRIBUTE, TriggerViewChildData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.CUSTOM_CLASS_CLASS);           
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.CUSTOM_STYLE_ATTRIBUTE, TriggerViewChildData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkNoVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.SHOW_ATTRIBUTE, TriggerViewChildData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.NOSHOW_TYPE_ATTRIBUTE, TriggerViewChildData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.DISABLED_ATTRIBUTE, TriggerViewChildData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TriggerViewChildData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TriggerViewChildData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TriggerViewChildData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TriggerViewChildData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, TriggerViewChildData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkBooleanSignal(TriggerViewChildData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
 
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewChildData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewChildData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, TriggerViewChildData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewChildData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewChildData.GENERATED_FIRST_TRIGGERVIEW_CHILD)
            .checkBooleanSignal(TriggerViewChildData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });

});

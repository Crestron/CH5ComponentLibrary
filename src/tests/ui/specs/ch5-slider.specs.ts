// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { SliderData } from '../data-providers/SliderData';

describe('Ch5-slider', ()=>{
    it('should have the handleShape attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_HANDLE_SHAPE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkElementHTML(SliderData.GENERATED_SLIDER, SliderData.HANDLE_SHAPE_CLASS)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.HANDLE_SHAPE_ATTRIBUTE, SliderData.HANDLE_SHAPE_ATTRIBUTE_VALUE);           
    });

    it('should have the range attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RANGE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, SliderData.HIGH_HANDLE)
            .checkVisibility(SliderData.GENERATED_SLIDER, SliderData.HIGH_HANDLE)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RANGE_ATTRIBUTE, SliderData.RANGE_ATTRIBUTE_VALUE);           
    });

    it('should have the value attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_VALUE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.VALUE_ATTRIBUTE, SliderData.VALUE_ATTRIBUTE_VALUE)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.VALUE_HANDLE_POSITION);           
    });

    it('should have the valueHigh attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_VALUE_HIGH)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.VALUE_HIGH_ATTRIBUTE, SliderData.VALUE_HIGH_ATTRIBUTE_VALUE)
            .checkAttribute(SliderData.HIGH_HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.VALUE_HIGH_HANDLE_POSITION);           
    });

    it('should have the min attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_MIN)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.MIN_ATTRIBUTE, SliderData.MIN_ATTRIBUTE_VALUE)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.MIN_HANDLE_POSITION);           
    });

    it('should have the max attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_MAX)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.MAX_ATTRIBUTE, SliderData.MAX_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.MAX_SLIDER_PIXELS)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.MAX_HANDLE_POSITION);           
    });

    it('should have the orientation attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_ORIENTATION)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.ORIENTATION_ATTRIBUTE, SliderData.ORIENTATION_ATTRIBUTE_VALUE)
            .checkElementHTML(SliderData.GENERATED_SLIDER, SliderData.ORIENTATION_CLASS);           
    });

    it('should have the size attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SIZE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SIZE_ATTRIBUTE, SliderData.SIZE_ATTRIBUTE_VALUE)
            .checkElementHTML(SliderData.GENERATED_SLIDER, SliderData.SIZE_CLASS);           
    });

    it('should have the handleSize attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_HANDLE_SIZE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.HANDLE_SIZE_ATTRIBUTE, SliderData.HANDLE_SIZE_ATTRIBUTE_VALUE)
            .checkElementHTML(SliderData.GENERATED_SLIDER, SliderData.HANDLE_SIZE_CLASS);           
    });

    it('should have the step attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_STEP)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.STEP_ATTRIBUTE, SliderData.STEP_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.STEP_SLIDER_PIXELS)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.STEP_HANDLE_POSITION);           
    });

    it('should have the ticks attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_TICKS)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.TICKS_VALUE_ATTRIBUTE, SliderData.TICKS_VALUE_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.TICKS_SLIDER_PIXELS_POSITION_ONE)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.TICKS_HANDLE_POSITION_ONE)
            .moveHandle(SliderData.HANDLE, SliderData.TICKS_SLIDER_PIXELS_POSITION_TWO)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.TICKS_HANDLE_POSITION_TWO);        
    });

    it('should have the showTickValues attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SHOW_TICK_VALUES)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SHOW_TICK_VALUE_ATTRIBUTE, SliderData.SHOW_TICK_VALUE_ATTRIBUTE_VALUE)
            .checkElementText(SliderData.FIRST_SHOW_TICK_VALUE_ELEMENT, SliderData.FIRST_SHOW_TICK_VALUE);        
    });

    it('should have the toolTipShowType attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_TOOLTIP_SHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.TOOLTIP_SHOW_TYPE_ATTRIBUTE, SliderData.TOOLTIP_SHOW_TYPE_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.TOOLTIP_SHOW_TYPE_SLIDER_PIXELS)
            .checkElementText(SliderData.GENERATED_TOOLTIP, SliderData.TOOLTIP_SHOW_TYPE_SLIDER_TEXT);        
    });

    it('should have the toolTipDisplayType attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_TOOLTIP_DISPLAY_TYPE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.TOOLTIP_DISPLAY_TYPE_ATTRIBUTE, SliderData.TOOLTIP_DISPLAY_TYPE_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.TOOLTIP_DISPLAY_TYPE_SLIDER_PIXELS)
            .checkElementText(SliderData.GENERATED_TOOLTIP, SliderData.TOOLTIP_DISPLAY_TYPE_HANDLE_POSITION);        
    });

    it('should have the signalValueSyncTimeout attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE, SliderData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.SIGNAL_VALUE_SYNC_TIMEOUT_SLIDER_PIXELS)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.SIGNAL_VALUE_SYNC_TIMEOUT_HANDLE_POSITION_VALUE)
            .waitForValueSyncTimeout(SliderData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.SLIDER_DEFAULT_PERCENTAGE);           
    });

    it('should be able to send the sendEventOnChange signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE, SliderData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SliderData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HANDLE, SliderData.SEND_SIGNAL_ON_CHANGE_SLIDER_PIXELS)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.SEND_SIGNAL_ON_CHANGE_HANDLE_POSITION_VALUE)
            .checkNumberSignal(SliderData.SEND_SIGNAL_ON_CHANGE_HANDLE_POSITION);                   
    });

    it('should be able to send the sendEventOnChangeHigh signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE_HIGH)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SEND_SIGNAL_ON_CHANGE_HIGH_ATTRIBUTE, SliderData.SEND_SIGNAL_ON_CHANGE_HIGH_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SliderData.SEND_SIGNAL_ON_CHANGE_HIGH_ATTRIBUTE_VALUE)
            .moveHandle(SliderData.HIGH_HANDLE, SliderData.SEND_SIGNAL_ON_CHANGE_HIGH_SLIDER_PIXELS)
            .checkAttribute(SliderData.HIGH_HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.SEND_SIGNAL_ON_CHANGE_HIGH_HANDLE_POSITION_VALUE)
            .checkNumberSignal(SliderData.SEND_SIGNAL_ON_CHANGE_HIGH_HANDLE_POSITION);                   
    });

    it('should be able to receive the receiveStateValue signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateNumberValue())
            .loadEmulator()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_VALUE_VALUE);           
    });

    it('should be able to receive the receiveStateValueHigh signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateNumberValueHigh())
            .loadEmulator()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE_HIGH)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_VALUE_HIGH_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_VALUE_HIGH_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.HIGH_HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_VALUE_HIGH_VALUE);           
    });

    it('should have the getDirty method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SliderData.HTML_TEMPLATE_GET_DIRTY_METHOD)
            .inputJsText(SliderData.JS_TEMPLATE_GET_DIRTY_METHOD)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, SliderData.GENERATED_BTN_GET_DIRTY)
            .checkVisibility(SliderData.GENERATED_SLIDER, SliderData.GENERATED_BTN_GET_DIRTY)
            .clickGeneratedElement(SliderData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SliderData.GENERATED_BTN_GET_DIRTY, SliderData.GET_DIRTY_FALSE)
            .moveHandle(SliderData.HANDLE, SliderData.GET_DIRTY_SLIDER_PIXELS)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.GET_DIRTY_HANDLE_POSITION_VALUE)
            .clickGeneratedElement(SliderData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SliderData.GENERATED_BTN_GET_DIRTY, SliderData.GET_DIRTY_TRUE);           
    });

    it('should have the reset method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RESET_METHOD)
            .inputJsText(SliderData.JS_TEMPLATE_RESET_METHOD)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, SliderData.GENERATED_BTN_GET_DIRTY, SliderData.GENERATED_BTN_RESET)
            .checkVisibility(SliderData.GENERATED_SLIDER, SliderData.GENERATED_BTN_GET_DIRTY, SliderData.GENERATED_BTN_RESET)
            .moveHandle(SliderData.HANDLE, SliderData.RESET_METHOD_SLIDER_PIXELS)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.RESET_METHOD_HANDLE_POSITION_VALUE)
            .clickGeneratedElement(SliderData.GENERATED_BTN_RESET)
            .checkAttribute(SliderData.HANDLE, SliderData.HANDLE_POSITION_ATTRIBUTE, SliderData.SLIDER_DEFAULT_PERCENTAGE)
            .clickGeneratedElement(SliderData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SliderData.GENERATED_BTN_GET_DIRTY, SliderData.GET_DIRTY_FALSE);           
    });

    it('should have the submit method and feedbackMode attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.feedbackModeSlider())
            .loadEmulator()
            .inputHtmlText(SliderData.HTML_TEMPLATE_FEEDBACK_MODE)
            .inputJsText(SliderData.JS_TEMPLATE_FEEDBACK_MODE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, SliderData.GENERATED_BTN_SUBMIT)
            .checkVisibility(SliderData.GENERATED_SLIDER, SliderData.GENERATED_BTN_SUBMIT)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.FEEDBACK_MODE_ATTRIBUTE, SliderData.FEEDBACK_MODE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SliderData.FEEDBACK_MODE_SEND_SIGNAL)
            .subscribeNumberSignal(SliderData.FEEDBACK_MODE_RECEIVE_SIGNAL)
            .moveHandle(SliderData.HANDLE, SliderData.FEEDBACK_MODE_SLIDER_PIXELS)
            .clickGeneratedElement(SliderData.GENERATED_BTN_SUBMIT)
            .checkNumberSignal(SliderData.FEEDBACK_MODE_HANDLE_POSITION)     
            .checkNumberSignal(SliderData.FEEDBACK_MODE_RECEIVE_SIGNAL_VALUE);         
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.ID_ATTRIBUTE, SliderData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.CUSTOM_CLASS_ATTRIBUTE, SliderData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(SliderData.GENERATED_SLIDER, SliderData.CUSTOM_CLASS_CLASS);           
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.CUSTOM_STYLE_ATTRIBUTE, SliderData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkNoVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SHOW_ATTRIBUTE, SliderData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.NOSHOW_TYPE_ATTRIBUTE, SliderData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.DISABLED_ATTRIBUTE, SliderData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SliderData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SliderData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SliderData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SliderData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SliderData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkBooleanSignal(SliderData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SliderData.GENERATED_SLIDER)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SliderData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SliderData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SliderData.GENERATED_SLIDER)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, SliderData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SliderData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkBooleanSignal(SliderData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
  
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SliderData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(SliderData.GENERATED_SLIDER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SliderData.GENERATED_SLIDER, SliderData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, SliderData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SliderData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SliderData.GENERATED_SLIDER)
            .checkBooleanSignal(SliderData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });    
});

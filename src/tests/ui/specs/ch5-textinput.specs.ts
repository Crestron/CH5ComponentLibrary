// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { TextInputData } from '../data-providers/TextInputData';

describe('Ch5-textinput', ()=>{
    it('should have the icon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_ICON)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.ICON_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.ICON_ATTRIBUTE, TextInputData.ICON_ATTRIBUTE_VALUE);          
    });

    it('should have the iconPositon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_ICON_POSITION)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.ICON_POSITION_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.ICON_POSITION_ATTRIBUTE, TextInputData.ICON_POSITION_ATTRIBUTE_VALUE);          
    });

    it('should have the value attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_VALUE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.VALUE_ATTRIBUTE_VALUE)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.VALUE_ATTRIBUTE_VALUE);          
    });

    it('should have the label attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_LABEL)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.LABEL_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.LABEL_ATTRIBUTE, TextInputData.LABEL_ATTRIBUTE_VALUE);          
    });

    it('should have the pattern attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_PATTERN)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT_WITH_FORM)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT_WITH_FORM)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.PATTERN_ATTRIBUTE, TextInputData.PATTERN_ATTRIBUTE_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT_WITH_FORM, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.SUBMIT_FORM_BTN)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.IS_INVALID);          
    });

    it('should have the type attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_TYPE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.TYPE_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.TYPE_ATTRIBUTE, TextInputData.TYPE_ATTRIBUTE_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.TYPE_TEXT);
    });

    it('should have the minLength attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_MIN_LENGTH)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT_WITH_FORM)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT_WITH_FORM)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.MIN_LENGTH_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.MIN_LENGTH_ATTRIBUTE, TextInputData.MIN_LENGTH_ATTRIBUTE_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT_WITH_FORM, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.SUBMIT_FORM_BTN)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.IS_INVALID);          
    });
 
    it('should have the maxLength attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_MAX_LENGTH)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.MAX_LENGTH_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.MAX_LENGTH_ATTRIBUTE, TextInputData.MAX_LENGTH_ATTRIBUTE_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.MAX_LENGTH_TEXT);          
    });

    it('should have the size attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SIZE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.SIZE_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.SIZE_ATTRIBUTE, TextInputData.SIZE_ATTRIBUTE_VALUE);          
    });

    it('should have the stretch attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_STRETCH)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.STRETCH_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.STRETCH_ATTRIBUTE, TextInputData.STRETCH_ATTRIBUTE_VALUE);          
    });

    it('should have the scaling attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SCALING)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.SCALING_ATTRIBUTE)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.SCALING_BEFORE_LONG_TEXT)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT_LONG)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.SCALING_AFTER_LONG_TEXT);          
    });

    it('should have the placeholder attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_PLACEHOLDER)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.PLACEHOLDER_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.PLACEHOLDER_ATTRIBUTE, TextInputData.PLACEHOLDER_ATTRIBUTE_VALUE);          
    });

    it('should have the required attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_REQUIRED)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT_WITH_FORM)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT_WITH_FORM)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.REQUIRED_ATTRIBUTE)
            .clickGeneratedElement(TextInputData.SUBMIT_FORM_BTN)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT_WITH_FORM, TextInputData.IS_INVALID);          
    });

    it('should have the mask attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_MASK)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.MASK_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.MASK_ATTRIBUTE, TextInputData.MASK_ATTRIBUTE_VALUE);          
    });

    it('should have the mask attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_MASK)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.MASK_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.MASK_ATTRIBUTE, TextInputData.MASK_ATTRIBUTE_VALUE);          
    });

    it('should have the tabIndex attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_TAB_INDEX)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.TAB_INDEX_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.TAB_INDEX_ATTRIBUTE, TextInputData.TAB_INDEX_ATTRIBUTE_VALUE)
            .clickGeneratedElement(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.IS_FOCUSED)
            .pressTabKeyTwice()
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT_THIRD, TextInputData.IS_FOCUSED);          
    });

    it('should have the text-transform attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_TEXT_TRANSFORM)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.TEXT_TRANSFORM_CLASS)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.TEXT_TRANSFORM_ATTRIBUTE, TextInputData.TEXT_TRANSFORM_ATTRIBUTE_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.SAMPLE_TEXT);
    });

    it('should be able to receive the receiveStateFocus signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateFocus())
            .loadEmulator()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_FOCUS)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_FOCUS_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_FOCUS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkElementHTML(TextInputData.GENERATED_TEXTINPUT, TextInputData.IS_FOCUSED);           
    });

    it('should be able to receive the receiveStateValue signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateValueTextInput())
            .loadEmulator()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TextInputData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TextInputData.RECEIVE_SIGNAL_VALUE_VALUE)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_VALUE_VALUE);           
    });

    it('should be able to send the sendEventOnFocus signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SEND_SIGNAL_ON_FOCUS)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE, TextInputData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(TextInputData.GENERATED_TEXTINPUT)
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnBlur signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SEND_SIGNAL_ON_BLUR)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.SEND_SIGNAL_ON_BLUR_ATTRIBUTE, TextInputData.SEND_SIGNAL_ON_BLUR_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.SEND_SIGNAL_ON_BLUR_ATTRIBUTE_VALUE)
            .clickGeneratedElement(TextInputData.GENERATED_TEXTINPUT)
            .clickTabPreview()
            .checkBooleanPulseSignal();           
    });

    it('should be able to send the sendEventOnChange signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE, TextInputData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TextInputData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .clickTabPreview()
            .checkStringSignal(TextInputData.SAMPLE_TEXT);           
    });

    it('should have the submit method and feedbackMode attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_FEEDBACK_MODE)
            .inputJsText(TextInputData.JS_TEMPLATE_FEEDBACK_MODE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.FEEDBACK_MODE_ATTRIBUTE, TextInputData.FEEDBACK_MODE_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TextInputData.FEEDBACK_MODE_SEND_SIGNAL_ON_CHANGE)           
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.FEEDBACK_MODE_BTN_SUBMIT)       
            .checkStringSignal(TextInputData.SAMPLE_TEXT);         
    });

    
    it('should have the validitychange event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_VALIDITY_CHANGE)
            .inputJsText(TextInputData.JS_TEMPLATE_VALIDITY_CHANGE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_VALIDITY_CHANGE)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_VALIDITY_CHANGE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALIDITY_CHANGE_INVALID)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_VALIDITY_CHANGE)
            .checkElementText(TextInputData.GENERATED_BTN_VALIDITY_CHANGE, TextInputData.VALIDITY_CHANGED_ONCE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALIDITY_CHANGE_VALID)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_VALIDITY_CHANGE)
            .checkElementText(TextInputData.GENERATED_BTN_VALIDITY_CHANGE, TextInputData.VALIDITY_CHANGED_TWICE);           
    });

    it('should have the reset method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RESET)
            .inputJsText(TextInputData.JS_TEMPLATE_RESET)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_DIRTY, TextInputData.GENERATED_BTN_RESET)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_DIRTY, TextInputData.GENERATED_BTN_RESET)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_RESET)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE, TextInputData.EMPTY_AFTER_RESET)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(TextInputData.GENERATED_BTN_GET_DIRTY, TextInputData.GET_DIRTY_FALSE);           
    });

    it('should have the getDirty method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_GET_DIRTY)
            .inputJsText(TextInputData.JS_TEMPLATE_GET_DIRTY)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_DIRTY)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_DIRTY)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(TextInputData.GENERATED_BTN_GET_DIRTY, TextInputData.GET_DIRTY_FALSE)     
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(TextInputData.GENERATED_BTN_GET_DIRTY, TextInputData.GET_DIRTY_TRUE);                
    });

    it('should have the getValid method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_GET_VALID)
            .inputJsText(TextInputData.JS_TEMPLATE_GET_VALID)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_VALID)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_VALID)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_GET_VALID)
            .checkElementText(TextInputData.GENERATED_BTN_GET_VALID, TextInputData.GET_VALID_FALSE);         
    });
   
    it('should have the getValue method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_GET_VALUE)
            .inputJsText(TextInputData.JS_TEMPLATE_GET_VALUE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_VALUE)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_GET_VALUE)
            .inputElementText(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.SAMPLE_TEXT)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_GET_VALUE)
            .checkElementText(TextInputData.GENERATED_BTN_GET_VALUE, TextInputData.SAMPLE_TEXT);         
    });

    it('should have the setValue method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SET_VALUE)
            .inputJsText(TextInputData.JS_TEMPLATE_SET_VALUE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_SET_VALUE)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, TextInputData.GENERATED_BTN_SET_VALUE)
            .clickGeneratedElement(TextInputData.GENERATED_BTN_SET_VALUE)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT_INPUT, TextInputData.VALUE_ATTRIBUTE,  TextInputData.SET_VALUE_VALUE);         
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.ID_ATTRIBUTE, TextInputData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.CUSTOM_CLASS_ATTRIBUTE, TextInputData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkExistanceOfCssClasses(TextInputData.GENERATED_TEXTINPUT, TextInputData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.CUSTOM_STYLE_ATTRIBUTE, TextInputData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkNoVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.SHOW_ATTRIBUTE, TextInputData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.NOSHOW_TYPE_ATTRIBUTE, TextInputData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.DISABLED_ATTRIBUTE, TextInputData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TextInputData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TextInputData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TextInputData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TextInputData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkBooleanSignal(TextInputData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, TextInputData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkBooleanSignal(TextInputData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
 
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TextInputData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(TextInputData.GENERATED_TEXTINPUT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TextInputData.GENERATED_TEXTINPUT, TextInputData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, TextInputData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TextInputData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TextInputData.GENERATED_TEXTINPUT)
            .checkBooleanSignal(TextInputData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });
});

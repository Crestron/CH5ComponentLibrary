// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';

describe('Ch5-button', ()=>{
    it('should have the label attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_LABEL)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.LABEL_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.LABEL_ATTRIBUTE, ButtonData.LABEL_ATTRIBUTE_VALUE);           
    });

    it('should have the icon attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_ICON)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.ICON_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.ICON_ATTRIBUTE, ButtonData.ICON_ATTRIBUTE_VALUE);           
    });

    it('should have the iconPosition attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_ICONPOSITION)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.ICONPOSITION_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.ICONPOSITION_ATTRIBUTE, ButtonData.ICONPOSITION_ATTRIBUTE_VALUE);           
    });

    it('should have the orientation attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_ORIENTATION)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.ORIENTATION_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.ORIENTATION_ATTRIBUTE, ButtonData.ORIENTATION_ATTRIBUTE_VALUE);           
    });

    it('should have the shape attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_SHAPE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.SHAPE_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.SHAPE_ATTRIBUTE, ButtonData.SHAPE_ATTRIBUTE_VALUE);           
    });

    it('should have the size attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_SIZE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.SIZE_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.SIZE_ATTRIBUTE, ButtonData.SIZE_ATTRIBUTE_VALUE);           
    });

    it('should have the stretch attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_STRETCH)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.STRECH_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.STRECH_ATTRIBUTE, ButtonData.STRETCH_ATTRIBUTE_VALUE);           
    });

    it('should have the type attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_TYPE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.TYPE_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.TYPE_ATTRIBUTE, ButtonData.TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the selected attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_SELECTED)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.SELECTED_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.SELECTED_ATTRIBUTE, ButtonData.SELECTED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateSelected signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateSelectedButton())
            .loadEmulator()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_SELECTED)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_TWO_INNER_HTML, ButtonData.SELECTED_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN_TWO, ButtonData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE)
            .checkAttribute(ButtonData.GENERATED_BTN_TWO, ButtonData.SELECTED_ATTRIBUTE, ButtonData.SELECTED_ATTRIBUTE_VALUE);       
    });

    it('should be able to receive the receiveStateLabel signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateLabelButton())
            .loadEmulator()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_LABEL)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkElementHTML(ButtonData.GENERATED_BTN_TWO_INNER_HTML, ButtonData.LABEL_CLASS)
            .checkAttribute(ButtonData.GENERATED_BTN_TWO, ButtonData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE)
            .checkAttribute(ButtonData.GENERATED_BTN_TWO, ButtonData.LABEL_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_LABEL_VALUE);            
    });

    it('should be able to receive the receiveStateScriptLabelHTML signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateScriptLabelHTMLButton())
            .loadEmulator()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_SCRIPT_LABEL_HTML)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN_TWO, ButtonData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE)
            .checkElementHTML(ButtonData.GENERATED_BTN_TWO, ButtonData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE);            
    });

    it('should be able to send the sendEventOnClick signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_BTN_CLICKED)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .subscribeBooleanSignal(ButtonData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkBooleanPulseSignal()
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE, ButtonData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE);
    });

    it('should have the focus event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_FOCUS)
            .inputJsText(ButtonData.JS_TEMPLATE_FOCUS)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_FOCUS)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_FOCUS)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkElementText(ButtonData.GENERATED_BTN_FOCUS, ButtonData.FOCUS_TRIGGERED);
    });

    it('should have the blur event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_BLUR)
            .inputJsText(ButtonData.JS_TEMPLATE_BLUR)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_BLUR)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_BLUR)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .clickTabPreview()
            .checkElementText(ButtonData.GENERATED_BTN_BLUR, ButtonData.BLUR_TRIGGERED);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.ID_ATTRIBUTE, ButtonData.ID_ATTRIBUTE_VALUE);           
    });

    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.CUSTOM_CLASS_ATTRIBUTE, ButtonData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkExistanceOfCssClasses(ButtonData.GENERATED_BTN_INNER_HTML, ButtonData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.CUSTOM_STYLE_ATTRIBUTE, ButtonData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkNoVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.SHOW_ATTRIBUTE, ButtonData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.NOSHOW_TYPE_ATTRIBUTE, ButtonData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.DISABLED_ATTRIBUTE, ButtonData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ButtonData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ButtonData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ButtonData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ButtonData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ButtonData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkBooleanSignal(ButtonData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ButtonData.GENERATED_BTN)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ButtonData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ButtonData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ButtonData.GENERATED_BTN)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, ButtonData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ButtonData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkBooleanSignal(ButtonData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
  
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ButtonData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(ButtonData.GENERATED_BTN, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ButtonData.GENERATED_BTN, ButtonData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, ButtonData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ButtonData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN)
            .checkBooleanSignal(ButtonData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });
});

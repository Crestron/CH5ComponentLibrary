// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ImageData } from '../data-providers/ImageData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ButtonData } from '../data-providers/ButtonData';
 
describe('Ch5-image', ()=>{
    it('should have the alt attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_ALT)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.ALT_ATTRIBUTE, ImageData.ALT_ATTRIBUTE_VALUE)
            .checkElementHTML(ImageData.GENERATED_IMAGE, ImageData.ALT_INNER_HTML);
    });

    it('should have the url attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_URL)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.URL_ATTRIBUTE, ImageData.URL_ATTRIBUTE_VALUE)
            .checkElementHTML(ImageData.GENERATED_IMAGE, ImageData.URL_INNER_HTML);
    });

    it('should have the width attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_WITDH)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.WIDTH_ATTRIBUTE, ImageData.WIDTH_ATTRIBUTE_VALUE)
            .checkElementHTML(ImageData.GENERATED_IMAGE, ImageData.WIDTH_INNER_HTML);
    });

    it('should have the height attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_HEIGHT)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.HEIGHT_ATTRIBUTE, ImageData.HEIGHT_ATTRIBUTE_VALUE)
            .checkElementHTML(ImageData.GENERATED_IMAGE, ImageData.HEIGHT_INNER_HTML);
    });

    it('should have the refreshRate attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_REFRESH_RATE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)           
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.REFRESH_RATE_ATTRIBUTE, ImageData.REFRESH_RATE_ATTRIBUTE_VALUE)
            .getImageUrl(ImageData.GENERATED_IMAGE_INNER_HTML, ImageData.URL_INNER_HTML_ATTRIBUTE)
            .waitImageUrlToChange()
            .checkImageUrl(ImageData.GENERATED_IMAGE_INNER_HTML, ImageData.URL_INNER_HTML_ATTRIBUTE)
            
    });

    it('should be able to receive the receiveStateUrl signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateUrlImage())
            .loadEmulator()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_URL)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)           
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_URL_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE)
            .getImageUrl(ImageData.GENERATED_IMAGE_INNER_HTML, ImageData.URL_INNER_HTML_ATTRIBUTE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkImageUrl(ImageData.GENERATED_IMAGE_INNER_HTML, ImageData.URL_INNER_HTML_ATTRIBUTE)
            .checkAttribute(ImageData.GENERATED_IMAGE_INNER_HTML, ImageData.URL_INNER_HTML_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_URL_INNER_HTML_NEW_VALUE);
    });

    it('should be able to send the sendEventOnClick signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ImageData.HTML_TEMPLATE_SEND_SIGNAL_ON_CLICK)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .subscribeBooleanSignal(ImageData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ImageData.GENERATED_IMAGE)
            .checkBooleanPulseSignal()
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE, ImageData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE);
    });

    it('should be able to send the sendEventOnError signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(ImageData.HTML_TEMPLATE_SEND_SIGNAL_ON_ERROR)
            .subscribeStringSignal(ImageData.SEND_SIGNAL_ON_ERROR_ATTRIBUTE_VALUE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.SEND_SIGNAL_ON_ERROR_ATTRIBUTE, ImageData.SEND_SIGNAL_ON_ERROR_ATTRIBUTE_VALUE)
            .checkStringSignal(ImageData.SEND_SIGNAL_ON_ERROR_VALUE);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.ID_ATTRIBUTE, ImageData.ID_ATTRIBUTE_VALUE);           
    }); 
    
    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.CUSTOM_CLASS_ATTRIBUTE, ImageData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(ImageData.GENERATED_IMAGE, ImageData.CUSTOM_CLASS_CLASS);           
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.CUSTOM_STYLE_ATTRIBUTE, ImageData.CUSTOM_STYLE_ATTRIBUTE_VALUE);           
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkNoVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.SHOW_ATTRIBUTE, ImageData.SHOW_ATTRIBUTE_VALUE);           
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.NOSHOW_TYPE_ATTRIBUTE, ImageData.NOSHOW_TYPE_ATTRIBUTE_VALUE);           
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.DISABLED_ATTRIBUTE, ImageData.DISABLED_ATTRIBUTE_VALUE);           
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ImageData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ImageData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);           
    }); 

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ImageData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ImageData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);           
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ImageData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkBooleanSignal(ImageData.RECEIVE_SIGNAL_SHOW_VALUE);           
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ImageData.GENERATED_IMAGE)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ImageData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ImageData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ImageData.GENERATED_IMAGE)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, ImageData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ImageData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkBooleanSignal(ImageData.RECEIVE_SIGNAL_ENABLE_VALUE);           
    });
  
    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ImageData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(ImageData.GENERATED_IMAGE, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ImageData.GENERATED_IMAGE, ImageData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, ImageData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ImageData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ImageData.GENERATED_IMAGE)
            .checkBooleanSignal(ImageData.SEND_SIGNAL_ON_SHOW_VALUE);           
    });

    it('should have property elementIsVisible false', () => {
        PlaygroundPage
        .openURL()
        .goToEditorHtml()
        .inputHtmlText(ImageData.HTML_TEMPLATE_ELEMENT_CONTAINER)
        .clickPreviewBtn()
        .checkComponentVisibility('image', false, 5000);
    });

    it('should not be visible in viewport', () => {
        PlaygroundPage.openURL('utility-functions/utility-subscribe-in-viewport-change.html')
        .testSubscribeInViewportChangeUtilityFunction('#second', '#firstResult', 'Element with id #first is not in viewport');
    });
});

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ButtonData } from '../data-providers/ButtonData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { TriggerViewData } from '../data-providers/TriggerViewData';

describe('Ch5-triggerview', ()=>{
    it('should have the previousViewChild method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_PREVIOUS_VIEW_CHILD_METHOD)
            .inputJsText(TriggerViewData.JS_TEMPLATE_PREVIOUS_VIEW_CHILD_METHOD)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.PREVIOUS_VIEW_BTN)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.PREVIOUS_VIEW_BTN)
            .clickGeneratedElement(TriggerViewData.PREVIOUS_VIEW_BTN)
            .checkElementHTML(TriggerViewData.GENERATED_FIRST_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    it('should have the nextViewChild method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_NEXT_VIEW_CHILD_METHOD)
            .inputJsText(TriggerViewData.JS_TEMPLATE_NEXT_VIEW_CHILD_METHOD)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NEXT_VIEW_BTN)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NEXT_VIEW_BTN)
            .clickGeneratedElement(TriggerViewData.NEXT_VIEW_BTN)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    it('should have the setActiveViewChild method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_SET_ACTIVE_VIEW_CHILD_METHOD)
            .inputJsText(TriggerViewData.JS_TEMPLATE_SET_ACTIVE_VIEW_CHILD_METHOD)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });


    it('should have the setActiveView method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_SET_ACTIVE_VIEW_METHOD)
            .inputJsText(TriggerViewData.JS_TEMPLATE_SET_ACTIVE_VIEW_METHOD)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    it('should have the select event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_SELECT_EVENT)
            .inputJsText(TriggerViewData.JS_TEMPLATE_SELECT_EVENT)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NEXT_VIEW_BTN)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NEXT_VIEW_BTN)
            .clickGeneratedElement(TriggerViewData.NEXT_VIEW_BTN)
            .checkAttribute(TriggerViewData.NEXT_VIEW_BTN, ButtonData.LABEL_ATTRIBUTE, TriggerViewData.SELECT_EVENT_VALUE);
    });

    it('should have the endless attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_ENDLESS)
            .inputJsText(TriggerViewData.JS_TEMPLATE_ENDLESS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NEXT_VIEW_BTN, TriggerViewData.PREVIOUS_VIEW_BTN)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NEXT_VIEW_BTN, TriggerViewData.PREVIOUS_VIEW_BTN)
            .clickGeneratedElement(TriggerViewData.PREVIOUS_VIEW_BTN)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD_ENDLESS, TriggerViewData.IS_SELECTED);
    });

    it('should have the activeView attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_ACTIVE_VIEW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.ACTIVE_VIEW_ATTRIBUTE, TriggerViewData.ACTIVE_VIEW_ATTRIBUTE_VALUE)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    // TODO: fix test in a future version; moveTriggerView does not swipe to second trigger view child
    // it('should have the gestureable attribute', () =>{
    //     PlaygroundPage
    //         .openURL()
    //         .inputHtmlText(TriggerViewData.HTML_TEMPLATE_GESTUREABLE)
    //         .clickPreviewBtn()
    //         .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
    //         .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
    //         .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.GESTUREABLE_ATTRIBUTE, TriggerViewData.GESTUREABLE_ATTRIBUTE_VALUE)
    //         .moveTriggerView(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.MOVE_PIXELS_VALUE)
    //         .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    // });

    it('should have the disableAnimation attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_DISABLE_ANIMATION)
            .inputJsText(TriggerViewData.JS_TEMPLATE_DISABLE_ANIMATION)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.DISABLE_ANIMATION_ATTRIBUTE, TriggerViewData.DISABLE_ANIMATION_ATTRIBUTE_VALUE)
            .clickGeneratedElement(TriggerViewData.NEXT_VIEW_BTN)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    it('should be able to receive the receiveStateShowChildIndex signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowChildIndex())
            .loadEmulator()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_CHILD_INDEX)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(TriggerViewData.RECEIVE_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNumberSignal(TriggerViewData.RECEIVE_SIGNAL_SHOW_CHILD_INDEX_VALUE)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    it('should send the sendEventShowChildIndex signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_SEND_SIGNAL_SHOW_CHILD_INDEX)
            .inputJsText(TriggerViewData.JS_TEMPLATE_SEND_SIGNAL_SHOW_CHILD_INDEX)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.SEND_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE, TriggerViewData.SEND_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(TriggerViewData.SEND_SIGNAL_SHOW_CHILD_INDEX_ATTRIBUTE_VALUE)
            .clickGeneratedElement(TriggerViewData.NEXT_VIEW_BTN)
            .checkNumberSignal(TriggerViewData.SEND_SIGNAL_SHOW_CHILD_INDEX_VALUE)
            .checkElementHTML(TriggerViewData.GENERATED_SECOND_TRIGGERVIEW_CHILD, TriggerViewData.IS_SELECTED);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.ID_ATTRIBUTE, TriggerViewData.ID_ATTRIBUTE_VALUE);
    });

    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.CUSTOM_CLASS_ATTRIBUTE, TriggerViewData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.CUSTOM_STYLE_ATTRIBUTE, TriggerViewData.CUSTOM_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkNoVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.SHOW_ATTRIBUTE, TriggerViewData.SHOW_ATTRIBUTE_VALUE);
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.NOSHOW_TYPE_ATTRIBUTE, TriggerViewData.NOSHOW_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.DISABLED_ATTRIBUTE, TriggerViewData.DISABLED_ATTRIBUTE_VALUE);
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TriggerViewData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TriggerViewData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(TriggerViewData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(TriggerViewData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkBooleanSignal(TriggerViewData.RECEIVE_SIGNAL_SHOW_VALUE);
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, TriggerViewData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkBooleanSignal(TriggerViewData.RECEIVE_SIGNAL_ENABLE_VALUE);
    });

    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(TriggerViewData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(TriggerViewData.GENERATED_TRIGGERVIEW, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(TriggerViewData.GENERATED_TRIGGERVIEW, TriggerViewData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, TriggerViewData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(TriggerViewData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(TriggerViewData.GENERATED_TRIGGERVIEW)
            .checkBooleanSignal(TriggerViewData.SEND_SIGNAL_ON_SHOW_VALUE);
    });

});

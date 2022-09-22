// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { SpinnerData } from '../data-providers/SpinnerData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ButtonData } from '../data-providers/ButtonData';

describe('Ch5-spinner', ()=>{
    it('should have the size attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SIZE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkNumberOfElements(SpinnerData.NUMBER_OF_ITEMS, SpinnerData.SIZE_ATTRIBUTE_VALUE)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SIZE_ATTRIBUTE, SpinnerData.SIZE_ATTRIBUTE_VALUE);
    });

    it('should have the iconPosition attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_ICON_POSITION)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_ONE, SpinnerData.ICON_POSITION_CLASS)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.ICON_POSITION_ATTRIBUTE, SpinnerData.ICON_POSITION_ATTRIBUTE_VALUE);
    });

    it('should have the selectedValue attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SELECTED_VALUE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_THREE, SpinnerData.IS_SELECTED)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SELECTED_VALUE_ATTRIBUTE, SpinnerData.SELECTED_VALUE_ATTRIBUTE_VALUE);
    });

    it('should have the itemHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_ITEMHEIGHT)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_ONE, SpinnerData.ITEMHEIGHT_STYLE)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.ITEMHEIGHT_ATTRIBUTE, SpinnerData.ITEMHEIGHT_ATTRIBUTE_VALUE);
    });

    it('should have the visibleItemScroll attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_VISIBLE_ITEM_SCROLL)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkElementHTML(SpinnerData.VISIBLE_ITEM_SCROLL_DISPLAY_AREA, SpinnerData.VISIBLE_ITEM_SCROLL_STYLE)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.VISIBLE_ITEM_SCROLL_ATTRIBUTE, SpinnerData.VISIBLE_ITEM_SCROLL_ATTRIBUTE_VALUE);
    });

    it('should have the resize attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RESIZE)
            .inputCssText(SpinnerData.CSS_TEMPLATE_RESIZE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkElementSize(SpinnerData.GENERATED_OPTION_ONE, SpinnerData.RESIZE_WITDH)
            .checkElementHTML(SpinnerData.GENERATED_SPINNER, SpinnerData.RESIZE_ATTRIBUTE);
    });

    it('should have the endless attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_ENDLESS)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .moveEndlessSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE, SpinnerData.MOVE_SECOND_VALUE, SpinnerData.MOVE_THIRD_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_THREE, SpinnerData.IS_SELECTED)
            .checkElementHTML(SpinnerData.GENERATED_SPINNER, SpinnerData.ENDLESS_ATTRIBUTE)
            .checkNumberOfElements(SpinnerData.NUMBER_OF_ITEMS, SpinnerData.ENDLESS_LIST_SIZE);
    });

    it('should have the submit method and feedbackMode attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_FEEDBACK_MODE)
            .inputJsText(SpinnerData.JS_TEMPLATE_FEEDBACK_MODE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.FEEDBACK_MODE_ATTRIBUTE, SpinnerData.FEEDBACK_MODE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SpinnerData.FEEDBACK_MODE_SEND_SIGNAL_ON_CHANGE)
            .moveSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE)
            .clickGeneratedElement(SpinnerData.FEEDBACK_MODE_BTN_SUBMIT)
            .checkNumberSignal(SpinnerData.SECOND_OPTION_INDEX);
    });

    it('should have the signalValueSyncTimeout attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE, SpinnerData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .moveSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_SECOND_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_TWO, SpinnerData.IS_SELECTED)
            .waitForValueSyncTimeout(SpinnerData.SIGNAL_VALUE_SYNC_TIMEOUT_WAIT_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_TWO, SpinnerData.IS_SELECTED);
    });

    it('should have the indexId attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_INDEX_ID)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.INDEX_ID_ATTRIBUTE, SpinnerData.INDEX_ID_ATTRIBUTE_VALUE);
    });

    it('should be able to receive the receiveStateValue signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateValueSpinner())
            .loadEmulator()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SpinnerData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNumberSignal(SpinnerData.RECEIVE_SIGNAL_VALUE_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_TWO, SpinnerData.IS_SELECTED);
    });

    it('should receive the receiveStateSize signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateSizeSpinner())
            .loadEmulator()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_SIZE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE)
            .checkNumberOfElements(SpinnerData.NUMBER_OF_ITEMS, SpinnerData.RECEIVE_SIGNAL_SIZE_VALUE)
    });

    it('should be able to receive the receiveStateLabel signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateLabelSpinner())
            .loadEmulator()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_LABEL)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SpinnerData.RECEIVE_SIGNAL_LABEL_FIRST_OPTION_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SpinnerData.RECEIVE_SIGNAL_LABEL_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_ONE, SpinnerData.RECEIVE_SIGNAL_LABEL_VALUE);
    });

    it('should be able to receive the receiveStateUrl signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateUrlSpinner())
            .loadEmulator()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_URL)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_URL_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SpinnerData.RECEIVE_SIGNAL_URL_FIRST_OPTION_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SpinnerData.RECEIVE_SIGNAL_URL_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_ONE, SpinnerData.RECEIVE_SIGNAL_URL_VALUE);
    });

    it('should send the sendEventOnFocus signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SEND_SIGNAL_ON_FOCUS)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE, SpinnerData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE)
            .moveSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE, false)
            .checkBooleanSignal(SpinnerData.SEND_SIGNAL_ON_FOCUS_VALUE);
    });

    it('should send the sendEventOnChange signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE, SpinnerData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SpinnerData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .moveSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE)
            .checkNumberSignal(SpinnerData.SEND_SIGNAL_ON_CHANGE_VALUE);
    });

    it('should have the sendEventOnOverflow attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SEND_SIGNAL_ON_OVERFLOW)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SEND_SIGNAL_ON_OVERFLOW_ATTRIBUTE, SpinnerData.SEND_SIGNAL_ON_OVERFLOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.SEND_SIGNAL_ON_OVERFLOW_ATTRIBUTE_VALUE)
            .moveEndlessSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE, SpinnerData.MOVE_SECOND_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_TWO, SpinnerData.IS_SELECTED)
            .checkBooleanPulseSignal();
    });

    it('should have the sendEventOnUnderflow attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SEND_SIGNAL_ON_UNDERFLOW)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SEND_SIGNAL_ON_UNDERFLOW_ATTRIBUTE, SpinnerData.SEND_SIGNAL_ON_UNDERFLOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.SEND_SIGNAL_ON_UNDERFLOW_ATTRIBUTE_VALUE)
            .moveEndlessSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE_UNDERFLOW, SpinnerData.MOVE_SECOND_VALUE_UNDERFLOW)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_TWO, SpinnerData.IS_SELECTED)
            .checkBooleanPulseSignal();
    });

    it('should have the reset method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RESET)
            .inputJsText(SpinnerData.JS_TEMPLATE_RESET)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_GET_DIRTY, SpinnerData.GENERATED_BTN_RESET)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_GET_DIRTY, SpinnerData.GENERATED_BTN_RESET)
            .moveSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_TWO, SpinnerData.IS_SELECTED)
            .clickGeneratedElement(SpinnerData.GENERATED_BTN_RESET)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_ONE, SpinnerData.IS_SELECTED)
            .clickGeneratedElement(SpinnerData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SpinnerData.GENERATED_BTN_GET_DIRTY, SpinnerData.GET_DIRTY_FALSE);
    });

    it('should have the getDirty method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_GET_DIRTY)
            .inputJsText(SpinnerData.JS_TEMPLATE_GET_DIRTY)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_GET_DIRTY)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_GET_DIRTY)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(SpinnerData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SpinnerData.GENERATED_BTN_GET_DIRTY, SpinnerData.GET_DIRTY_FALSE)
            .moveSpinner(SpinnerData.GENERATED_SPINNER_HANDLE, SpinnerData.MOVE_FIRST_VALUE)
            .clickGeneratedElement(SpinnerData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SpinnerData.GENERATED_BTN_GET_DIRTY, SpinnerData.GET_DIRTY_TRUE);
    });

    it('should have the getValue method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_GET_VALUE)
            .inputJsText(SpinnerData.JS_TEMPLATE_GET_VALUE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_GET_VALUE)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_GET_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(SpinnerData.GENERATED_BTN_GET_VALUE)
            .checkElementText(SpinnerData.GENERATED_BTN_GET_VALUE, SpinnerData.GET_VALUE_VALUE);
    });


    it('should have the setValue method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SET_VALUE)
            .inputJsText(SpinnerData.JS_TEMPLATE_SET_VALUE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_SET_VALUE)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, SpinnerData.GENERATED_BTN_SET_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(SpinnerData.GENERATED_BTN_SET_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_OPTION_THREE, SpinnerData.IS_SELECTED);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.ID_ATTRIBUTE, SpinnerData.ID_ATTRIBUTE_VALUE);
    });

    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.CUSTOM_CLASS_ATTRIBUTE, SpinnerData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(SpinnerData.GENERATED_SPINNER, SpinnerData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.CUSTOM_STYLE_ATTRIBUTE, SpinnerData.CUSTOM_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkNoVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SHOW_ATTRIBUTE, SpinnerData.SHOW_ATTRIBUTE_VALUE);
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.NOSHOW_TYPE_ATTRIBUTE, SpinnerData.NOSHOW_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.DISABLED_ATTRIBUTE, SpinnerData.DISABLED_ATTRIBUTE_VALUE);
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SpinnerData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SpinnerData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SpinnerData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SpinnerData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkBooleanSignal(SpinnerData.RECEIVE_SIGNAL_SHOW_VALUE);
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SpinnerData.GENERATED_SPINNER)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SpinnerData.GENERATED_SPINNER)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, SpinnerData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .WaitForSpinnerOverlay()
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkBooleanSignal(SpinnerData.RECEIVE_SIGNAL_ENABLE_VALUE);
    });

    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SpinnerData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(SpinnerData.GENERATED_SPINNER, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SpinnerData.GENERATED_SPINNER, SpinnerData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, SpinnerData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SpinnerData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SpinnerData.GENERATED_SPINNER)
            .checkBooleanSignal(SpinnerData.SEND_SIGNAL_ON_SHOW_VALUE);
    });
});

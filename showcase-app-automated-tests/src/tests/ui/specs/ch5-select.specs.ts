// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { SelectData } from '../data-providers/SelectData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ButtonData } from '../data-providers/ButtonData';

describe('Ch5-select', ()=>{
    it('should have the size attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SIZE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkNumberOfElements(SelectData.NUMBER_OF_ITEMS, SelectData.SIZE_ATTRIBUTE_VALUE)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SIZE_ATTRIBUTE, SelectData.SIZE_ATTRIBUTE_VALUE);
    });

    it('should have the iconPosition attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateUrlSelectOption())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_ICON_POSITION)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .checkElementHTML(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.ICON_POSITION_CLASS)
            .checkAttribute(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.ICON_POSITION_ATTRIBUTE, SelectData.ICON_POSITION_ATTRIBUTE_VALUE);
    });

    it('should have the multiselect attribute', () =>{
            PlaygroundPage
                .openURL()
                .goToEmulator()
                .inputEmulatorText(EmulatorData.receiveStateLabelSelectOption())
                .loadEmulator()
                .inputHtmlText(SelectData.HTML_TEMPLATE_MULTISELECT)
                .clickPreviewBtn()
                .checkExistance(SelectData.GENERATED_SELECT)
                .checkVisibility(SelectData.GENERATED_SELECT)
                .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
                .clickGeneratedElement(SelectData.GENERATED_SELECT)
                .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
                .clickGeneratedElement(SelectData.GENERATED_OPTION_TWO_SELECT)
                .checkElementHTML(SelectData.GENERATED_SELECTED_OPTION, SelectData.MULTISELECT_SELECTED_OPTIONS)
                .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.MULTISELECT_ATTRIBUTE);
        });

    it('should have the selectedValue attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SELECTED_VALUE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECTED_OPTION, SelectData.SELECTED_VALUE_THIRD_ITEM)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SELECTED_VALUE_ATTRIBUTE, SelectData.SELECTED_VALUE_ATTRIBUTE_VALUE);
    });

    it('should have the panelScrollHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SCROLL_HEIGHT)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.SCROLL_HEIGHT_STYLE)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SCROLL_HEIGHT_ATTRIBUTE, SelectData.SCROLL_HEIGHT_ATTRIBUTE_VALUE);
    });
    it('should have the maxWidth attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_MAXWIDTH)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.MAXWIDTH_STYLE)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.MAXWIDTH_ATTRIBUTE, SelectData.MAXWIDTH_ATTRIBUTE_VALUE);
    });

    it('should have the maxHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_MAXHEIGHT)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.MAXHEIGHT_STYLE)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.MAXHEIGHT_ATTRIBUTE, SelectData.MAXHEIGHT_ATTRIBUTE_VALUE);
    });

    it('should have the minWidth attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_MINWIDTH)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.MINWIDTH_STYLE)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.MINWIDTH_ATTRIBUTE, SelectData.MINWIDTH_ATTRIBUTE_VALUE);
    });

    it('should have the minHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_MINHEIGHT)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.MINHEIGHT_STYLE)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.MINHEIGHT_ATTRIBUTE, SelectData.MINHEIGHT_ATTRIBUTE_VALUE);
    });

    it('should have the mode attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_MODE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT, SelectData.GENERATED_OPTION_ONE_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.MODE_ATTRIBUTE, SelectData.MODE_ATTRIBUTE_VALUE);
    });

    it('should have the signalValueSyncTimeout attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE, SelectData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .waitForValueSyncTimeout(SelectData.SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE)
            .checkNoElementHTML(SelectData.GENERATED_SELECTED_OPTION, SelectData.SIGNAL_VALUE_SYNC_TIMEOUT_SELECT_VALUE);
    });

    it('should have the indexId attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_INDEX_ID)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.INDEX_ID_ATTRIBUTE, SelectData.INDEX_ID_ATTRIBUTE_VALUE);
    });

    it('should have the resize attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RESIZE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.RESIZE_ATTRIBUTE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .checkIfElementSizesAreNotEqual(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.GENERATED_SELECT);
    });

    it('should have the submit method and feedbackMode attribute', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_FEEDBACK_MODE)
            .inputJsText(SelectData.JS_TEMPLATE_FEEDBACK_MODE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.FEEDBACK_MODE_ATTRIBUTE, SelectData.FEEDBACK_MODE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SelectData.FEEDBACK_MODE_SEND_SIGNAL_ON_CHANGE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_TWO_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickTabPreview()
            .clickGeneratedElement(SelectData.FEEDBACK_MODE_BTN_SUBMIT)
            .checkNumberSignal(SelectData.FEEDBACK_MODE_SELECT_VALUE);
    });

    it('should be able to receive the receiveStateValue signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateValueSelect())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SelectData.RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNumberSignal(SelectData.RECEIVE_SIGNAL_VALUE_VALUE)
            .checkElementHTML(SelectData.GENERATED_SELECTED_OPTION, SelectData.RECEIVE_SIGNAL_VALUE_SELECT_VALUE);
    });

    it('should be able to receive the receiveStateSize signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateSizeSelect())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_SIZE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SelectData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNumberSignal(SelectData.RECEIVE_SIGNAL_SIZE_VALUE)
            .checkNumberOfElements(SelectData.NUMBER_OF_ITEMS, SelectData.RECEIVE_SIGNAL_SIZE_VALUE);
    });

    it('should receive the receiveStateTemplateVars signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateTemplateVarsSelect())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_TEMPLATE_VARS)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SelectData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SelectData.RECEIVE_SIGNAL_TEMPLATE_VARS_VALUE)
            .checkElementHTML(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.FIRST_OPTION_LABEL_TEXT)
            .checkElementHTML(SelectData.GENERATED_OPTION_TWO_SELECT, SelectData.SECOND_OPTION_LABEL_TEXT);
    });


    it('should send the sendEventOnFocus signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SEND_SIGNAL_ON_FOCUS)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE, SelectData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .checkBooleanSignal(SelectData.SEND_SIGNAL_ON_FOCUS_VALUE);
    });

    it('should send the sendEventOnChange signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE, SelectData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .subscribeNumberSignal(SelectData.SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .checkNumberSignal(SelectData.SEND_SIGNAL_ON_CHANGE_VALUE);
    });

    it('should have the focus event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_FOCUS)
            .inputJsText(SelectData.JS_TEMPLATE_FOCUS)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_FOCUS)
            .checkVisibility(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_FOCUS)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .checkElementText(SelectData.GENERATED_BTN_FOCUS, SelectData.FOCUS_TRIGGERED);
    });

    it('should have the blur event', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_BLUR)
            .inputJsText(SelectData.JS_TEMPLATE_BLUR)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_BLUR)
            .checkVisibility(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_BLUR)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickTabPreview()
            .checkElementText(SelectData.GENERATED_BTN_BLUR, SelectData.BLUR_TRIGGERED);
    });

    it('should have the reset method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RESET)
            .inputJsText(SelectData.JS_TEMPLATE_RESET)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_GET_DIRTY, SelectData.GENERATED_BTN_RESET)
            .checkVisibility(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_GET_DIRTY, SelectData.GENERATED_BTN_RESET)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .clickTabPreview()
            .clickGeneratedElement(SelectData.GENERATED_BTN_RESET)
            .checkNoElementHTML(SelectData.GENERATED_SELECTED_OPTION, SelectData.RESET_SELECT_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SelectData.GENERATED_BTN_GET_DIRTY, SelectData.GET_DIRTY_FALSE);
    });

    it('should have the getDirty method', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_GET_DIRTY)
            .inputJsText(SelectData.JS_TEMPLATE_GET_DIRTY)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_GET_DIRTY)
            .checkVisibility(SelectData.GENERATED_SELECT, SelectData.GENERATED_BTN_GET_DIRTY)
            .clickGeneratedElement(SelectData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SelectData.GENERATED_BTN_GET_DIRTY, SelectData.GET_DIRTY_FALSE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .clickTabPreview()
            .clickGeneratedElement(SelectData.GENERATED_BTN_GET_DIRTY)
            .checkElementText(SelectData.GENERATED_BTN_GET_DIRTY, SelectData.GET_DIRTY_TRUE);
    });

    it('should be able to receive the receiveStateSelected signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateSelectedSelectOption())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_SELECTED)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_TWO_SELECT)
            .clickTabPreview()
            .subscribeBooleanSignal(SelectData.RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkBooleanSignal(SelectData.RECEIVE_SIGNAL_SELECTED_VALUE);
    });

    it('should be able to receive the receiveStateLabel signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateLabelSelectOption())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_LABEL)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SelectData.RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SelectData.RECEIVE_SIGNAL_LABEL_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .checkElementText(SelectData.GENERATED_SELECTED_OPTION, SelectData.RECEIVE_SIGNAL_LABEL_VALUE);
    });

    it('should be able to receive the receiveStateUrl signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateUrlSelectOption())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_URL)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.RECEIVE_SIGNAL_URL_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SelectData.RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SelectData.RECEIVE_SIGNAL_URL_VALUE)
            .checkElementHTML(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.RECEIVE_SIGNAL_URL_VALUE);
    });

    it('should be able to receive the receiveStateScriptLabelHtml signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateScriptLabelHTMLSelectOption())
            .loadEmulator()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_SCRIPT_LABEL_HTML)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE)
            .checkElementHTML(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE);
    });

    it('should be able to send the sendEventOnClick signal', () =>{
        PlaygroundPage
            .openURL()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SEND_SIGNAL_ON_CLICK)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_OPTION_ONE_SELECT, SelectData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE, SelectData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE)
            .clickGeneratedElement(SelectData.GENERATED_SELECT)
            .clickGeneratedElement(SelectData.GENERATED_OPTION_ONE_SELECT)
            .checkBooleanPulseSignal();
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.ID_ATTRIBUTE, SelectData.ID_ATTRIBUTE_VALUE);
    });

    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.CUSTOM_CLASS_ATTRIBUTE, SelectData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(SelectData.GENERATED_SELECT, SelectData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.CUSTOM_STYLE_ATTRIBUTE, SelectData.CUSTOM_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkNoVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SHOW_ATTRIBUTE, SelectData.SHOW_ATTRIBUTE_VALUE);
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.NOSHOW_TYPE_ATTRIBUTE, SelectData.NOSHOW_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.DISABLED_ATTRIBUTE, SelectData.DISABLED_ATTRIBUTE_VALUE);
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SelectData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SelectData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(SelectData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(SelectData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkBooleanSignal(SelectData.RECEIVE_SIGNAL_SHOW_VALUE);
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SelectData.GENERATED_SELECT)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(SelectData.GENERATED_SELECT)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, SelectData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkBooleanSignal(SelectData.RECEIVE_SIGNAL_ENABLE_VALUE);
    });

    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(SelectData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(SelectData.GENERATED_SELECT, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(SelectData.GENERATED_SELECT, SelectData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, SelectData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(SelectData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(SelectData.GENERATED_SELECT)
            .checkBooleanSignal(SelectData.SEND_SIGNAL_ON_SHOW_VALUE);
    });
});

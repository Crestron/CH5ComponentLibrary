// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { ListData } from '../data-providers/ListData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ButtonData } from '../data-providers/ButtonData';

describe('Ch5-list', ()=>{
    it('should have the size attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_SIZE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkNumberOfElements(ListData.NUMBER_OF_LIST_ITEMS, ListData.SIZE_ATTRIBUTE_VALUE)
            .checkAttribute(ListData.GENERATED_LIST, ListData.SIZE_ATTRIBUTE, ListData.SIZE_ATTRIBUTE_VALUE);
    });

    it('should have the orientation attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_ORIENTATION)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkElementHTML(ListData.GENERATED_LIST_INNER_HTML, ListData.ORIENTATION_CLASS)
            .checkAttribute(ListData.GENERATED_LIST, ListData.ORIENTATION_ATTRIBUTE, ListData.ORIENTATION_ATTRIBUTE_VALUE);
    });

    it('should have the maxWidth attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_MAXWIDTH)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkElementHTML(ListData.GENERATED_LIST, ListData.MAXWIDTH_STYLE)
            .checkAttribute(ListData.GENERATED_LIST, ListData.MAXWIDTH_ATTRIBUTE, ListData.MAXWIDTH_ATTRIBUTE_VALUE);
    });

    it('should have the maxHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_MAXHEIGHT)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkElementHTML(ListData.GENERATED_LIST, ListData.MAXHEIGHT_STYLE)
            .checkAttribute(ListData.GENERATED_LIST, ListData.MAXHEIGHT_ATTRIBUTE, ListData.MAXHEIGHT_ATTRIBUTE_VALUE);
    });

    it('should have the minWidth attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_MINWIDTH)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkElementHTML(ListData.GENERATED_LIST, ListData.MINWIDTH_STYLE)
            .checkAttribute(ListData.GENERATED_LIST, ListData.MINWIDTH_ATTRIBUTE, ListData.MINWIDTH_ATTRIBUTE_VALUE);
    });

    it('should have the minHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_MINHEIGHT)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkElementHTML(ListData.GENERATED_LIST, ListData.MINHEIGHT_STYLE)
            .checkAttribute(ListData.GENERATED_LIST, ListData.MINHEIGHT_ATTRIBUTE, ListData.MINHEIGHT_ATTRIBUTE_VALUE);
    });

    it('should have the itemHeight attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_ITEMHEIGHT)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.ITEMHEIGHT_ATTRIBUTE, ListData.ITEMHEIGHT_ATTRIBUTE_VALUE);
    });

    it('should have the itemWidth attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_ITEMWIDTH)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.ITEMWIDTH_ATTRIBUTE, ListData.ITEMWIDTH_ATTRIBUTE_VALUE);
    });

    it('should have the indexId attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_INDEXID)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkElementHTML(ListData.GENERATED_LIST_INNER_HTML, ListData.INDEXID_TAG)
            .checkAttribute(ListData.GENERATED_LIST, ListData.INDEXID_ATTRIBUTE, ListData.INDEXID_ATTRIBUTE_VALUE);
    });

    it('should have the scrollToTime attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateScrollTo())
            .loadEmulator()
            .inputHtmlText(ListData.HTML_TEMPLATE_LIST_SCROLL_TO_TIME)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.SCROLL_TO_TIME_ATTRIBUTE, ListData.SCROLL_TO_TIME_ATTRIBUTE_VALUE);
    });

    it('should receive the receiveStateSize signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateSizeList())
            .loadEmulator()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_SIZE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE, ListData.RECEIVE_SIGNAL_SIZE_ATTRIBUTE_VALUE)
            .checkNumberOfElements(ListData.NUMBER_OF_LIST_ITEMS, ListData.NEW_SIZE_VALUE)
    });

    it('should receive the receiveStateScrollTo signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateScrollTo())
            .loadEmulator()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_SCROLL_TO)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_SCROLL_TO_ATTRIBUTE, ListData.RECEIVE_SIGNAL_SCROLL_TO_ATTRIBUTE_VALUE)
            .getElementPostition(ListData.FIRST_ITEM_FROM_LIST)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkElementPosition(ListData.FIRST_ITEM_FROM_LIST);
    });

    it('should receive the receiveStateTemplateVars signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateTemplateVarsList())
            .loadEmulator()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_TEMPLATE_VARS)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE, ListData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ListData.RECEIVE_SIGNAL_TEMPLATE_VARS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ListData.RECEIVE_SIGNAL_TEMPLATE_VARS_VALUE)
            .checkElementText(ListData.FIRST_ITEM_FROM_LIST, ListData.FIRST_ITEM_TEXT_FROM_LIST);
    });

    it('should have the id common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_ID)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.ID_ATTRIBUTE, ListData.ID_ATTRIBUTE_VALUE);
    });

    it('should have the customClass common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.CUSTOM_CLASS_ATTRIBUTE, ListData.CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .checkElementHTML(ListData.GENERATED_LIST, ListData.CUSTOM_CLASS_CLASS);
    });

    it('should have the customStyle common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_CUSTOM_STYLE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.CUSTOM_STYLE_ATTRIBUTE, ListData.CUSTOM_STYLE_ATTRIBUTE_VALUE);
    });

    it('should have the show common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_SHOW)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkNoVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.SHOW_ATTRIBUTE, ListData.SHOW_ATTRIBUTE_VALUE);
    });

    it('should have the noshowType common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_NOSHOW_TYPE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.NOSHOW_TYPE_ATTRIBUTE, ListData.NOSHOW_TYPE_ATTRIBUTE_VALUE);
    });

    it('should have the disabled common attribute', () =>{
        PlaygroundPage
            .openURL()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_DISABLED)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.DISABLED_ATTRIBUTE, ListData.DISABLED_ATTRIBUTE_VALUE);
    });

    it('should be able to receive the receiveStateCustomClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateCustomClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE, ListData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ListData.RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ListData.RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateStyleClass common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateStyleClass())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST ,ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE, ListData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(ListData.RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkStringSignal(ListData.RECEIVE_SIGNAL_STYLE_CLASS_VALUE);
    });

    it('should be able to receive the receiveStateShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST,
                ListData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE, ListData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ListData.RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkBooleanSignal(ListData.RECEIVE_SIGNAL_SHOW_VALUE);
    });

    it('should be able to receive the receiveStateShowPulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateShowPulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ListData.GENERATED_LIST)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE, ListData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ListData.RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateHidePulse common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateHidePulse())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE, ListData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ListData.RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkNoVisibility(ListData.GENERATED_LIST)
            .checkBooleanPulseSignal();
    });

    it('should be able to receive the receiveStateEnable common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.receiveStateEnable())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE, ListData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ListData.RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkBooleanSignal(ListData.RECEIVE_SIGNAL_ENABLE_VALUE);
    });

    it('should be able to send the sendEventOnShow common signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.sendEventOnShow())
            .loadEmulator()
            .goToEditorHtml()
            .inputHtmlText(ListData.HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW)
            .clickPreviewBtn()
            .checkExistance(ListData.GENERATED_LIST, ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ButtonData.GENERATED_BTN_TWO)
            .checkAttribute(ListData.GENERATED_LIST, ListData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE, ListData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(ListData.SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN_TWO)
            .checkVisibility(ListData.GENERATED_LIST)
            .checkBooleanSignal(ListData.SEND_SIGNAL_ON_SHOW_VALUE);
    });
});

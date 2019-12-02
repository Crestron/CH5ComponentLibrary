// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { PlaygroundPage } from '../page-objects';
import { CustomAttributesData } from '../data-providers/CustomAttributesData';
import { EmulatorData } from '../data-providers/EmulatorData';
import { ButtonData } from '../data-providers/ButtonData';

describe('Ch5-custom-attributes', ()=>{
    it('should be able to receive the data-ch5-show signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.dataCh5Show())
            .loadEmulator()
            .inputHtmlText(CustomAttributesData.HTML_TEMPLATE_DATA_CH5_SHOW)
            .clickPreviewBtn()
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkExistance(CustomAttributesData.GENERATED_DIV)
            .checkVisibility(CustomAttributesData.GENERATED_DIV)
            .checkAttribute(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_SHOW_ATTRIBUTE, CustomAttributesData.DATA_CH5_SHOW_ATTRIBUTE_VALUE)
            .subscribeBooleanSignal(CustomAttributesData.DATA_CH5_SHOW_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkNoVisibility(CustomAttributesData.GENERATED_DIV)
            .checkBooleanPulseSignal();           
    });

    it('should be able to receive the data-ch5-noshow-type signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.dataCh5Show())
            .loadEmulator()
            .inputHtmlText(CustomAttributesData.HTML_TEMPLATE_DATA_CH5_NOSHOW_TYPE)
            .clickPreviewBtn()
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkExistance(CustomAttributesData.GENERATED_DIV)
            .checkVisibility(CustomAttributesData.GENERATED_DIV)
            .checkAttribute(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_NOSHOW_TYPE_ATTRIBUTE, CustomAttributesData.DATA_CH5_NOSHOW_TYPE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkNoVisibility(CustomAttributesData.GENERATED_DIV)
            .checkExistance(CustomAttributesData.GENERATED_DIV)          
    });

    it('should be able to receive the data-ch5-textcontent signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.dataCh5TextContent())         
            .loadEmulator()
            .inputHtmlText(CustomAttributesData.HTML_TEMPLATE_DATA_CH5_TEXTCONTENT)
            .clickPreviewBtn()
            .checkExistance(CustomAttributesData.GENERATED_DIV)
            .checkNoVisibility(CustomAttributesData.GENERATED_DIV)
            .checkAttribute(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_TEXTCONTENT_ATTRIBUTE, CustomAttributesData.DATA_CH5_TEXTCONTENT_ATTRIBUTE_VALUE)
            .subscribeStringSignal(CustomAttributesData.DATA_CH5_TEXTCONTENT_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkStringSignal(CustomAttributesData.DATA_CH5_TEXTCONTENT_VALUE)
            .checkElementHTML(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_TEXTCONTENT_VALUE);           
    });

    it('should be able to receive the data-ch5-innerhtml signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.dataCh5InnerHtml())
            .loadEmulator()
            .inputHtmlText(CustomAttributesData.HTML_TEMPLATE_DATA_CH5_INNERHTML)
            .clickPreviewBtn()
            .checkExistance(CustomAttributesData.GENERATED_DIV)
            .checkNoVisibility(CustomAttributesData.GENERATED_DIV)
            .checkAttribute(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_INNERHTML_ATTRIBUTE, CustomAttributesData.DATA_CH5_INNERHTML_ATTRIBUTE_VALUE)
            .subscribeStringSignal(CustomAttributesData.DATA_CH5_INNERHTML_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkStringSignal(CustomAttributesData.DATA_CH5_INNERHTML_VALUE)
            .checkElementHTML(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_INNERHTML_VALUE);           
    });

    it('should be able to receive the data-ch5-appendstyle signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.dataCh5AppendStyle())
            .loadEmulator()
            .inputHtmlText(CustomAttributesData.HTML_TEMPLATE_DATA_CH5_APPENDSTYLE)
            .clickPreviewBtn()
            .checkExistance(CustomAttributesData.GENERATED_DIV)
            .checkVisibility(CustomAttributesData.GENERATED_DIV)
            .checkAttribute(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_APPENDSTYLE_ATTRIBUTE, CustomAttributesData.DATA_CH5_APPENDSTYLE_ATTRIBUTE_VALUE)
            .subscribeStringSignal(CustomAttributesData.DATA_CH5_APPENDSTYLE_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkStringSignal(CustomAttributesData.DATA_CH5_APPENDSTYLE_VALUE)
            .checkElementHTML(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_APPENDSTYLE_VALUE);           
    });

    it('should be able to receive the data-ch5-appendclass signal', () =>{
        PlaygroundPage
            .openURL()
            .goToEmulator()
            .inputEmulatorText(EmulatorData.dataCh5AppendClass())
            .loadEmulator()
            .inputHtmlText(CustomAttributesData.HTML_TEMPLATE_DATA_CH5_APPENDCLASS)
            .inputCssText(CustomAttributesData.CSS_TEMPLATE_DATA_CH5_APPENDCLASS)
            .clickPreviewBtn()
            .checkExistance(CustomAttributesData.GENERATED_DIV)
            .checkVisibility(CustomAttributesData.GENERATED_DIV)
            .checkAttribute(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_APPENDCLASS_ATTRIBUTE, CustomAttributesData.DATA_CH5_APPENDCLASS_ATTRIBUTE_VALUE)
            .subscribeStringSignal(CustomAttributesData.DATA_CH5_APPENDCLASS_ATTRIBUTE_VALUE)
            .clickGeneratedElement(ButtonData.GENERATED_BTN)
            .checkStringSignal(CustomAttributesData.DATA_CH5_APPENDCLASS_VALUE)
            .checkElementHTML(CustomAttributesData.GENERATED_DIV, CustomAttributesData.DATA_CH5_APPENDCLASS_VALUE);           
    });
});

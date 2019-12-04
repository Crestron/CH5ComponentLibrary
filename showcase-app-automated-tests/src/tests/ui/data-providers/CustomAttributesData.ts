// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class CustomAttributesData{

    public static GENERATED_DIV: string = 'div.content.preview > div';

    public static DATA_CH5_SHOW_ATTRIBUTE_VALUE: string = 'data_ch5_show_1';
    public static DATA_CH5_SHOW_ATTRIBUTE: string = 'data-ch5-show';
    public static HTML_TEMPLATE_DATA_CH5_SHOW: string = '<ch5-button sendEventOnClick="signal" label="Send Signal"></ch5-button><div data-ch5-show="data_ch5_show_1" >DIV: Testing data-ch5-show </div>';

    public static DATA_CH5_NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'display';
    public static DATA_CH5_NOSHOW_TYPE_ATTRIBUTE: string = 'data-ch5-noshow-type';
    public static HTML_TEMPLATE_DATA_CH5_NOSHOW_TYPE: string = '<ch5-button sendEventOnClick="signal" label="Send Signal"></ch5-button><div data-ch5-show="data_ch5_show_1" data-ch5-noshow-type="display">DIV: Testing data-ch5-show </div>';

    public static DATA_CH5_TEXTCONTENT_VALUE: string = 'New String';    
    public static DATA_CH5_TEXTCONTENT_ATTRIBUTE_VALUE: string = 'data_ch5_textcontent_1';
    public static DATA_CH5_TEXTCONTENT_ATTRIBUTE: string = 'data-ch5-textcontent';
    public static HTML_TEMPLATE_DATA_CH5_TEXTCONTENT: string = '<ch5-button sendEventOnClick="signal" label="Send Signal"></ch5-button><div data-ch5-textcontent="data_ch5_textcontent_1" > DIV: Testing data-ch5-textcontent </div>';

    public static DATA_CH5_INNERHTML_VALUE: string = '<strong>DIV: </strong><span class=\"c-green\">innerHTML updated using signal defined by</span> <span class=\"c-blue\">data-ch5-innerhtml attribute</span>';    
    public static DATA_CH5_INNERHTML_ATTRIBUTE_VALUE: string = 'data_ch5_innerhtml_signal_1';
    public static DATA_CH5_INNERHTML_ATTRIBUTE: string = 'data-ch5-innerhtml';
    public static HTML_TEMPLATE_DATA_CH5_INNERHTML: string = '<ch5-button sendEventOnClick="signal" label="Send Signal"></ch5-button><div data-ch5-innerhtml="data_ch5_innerhtml_signal_1" > DIV: Testing data-ch5-innerhtml </div>';

    public static DATA_CH5_APPENDSTYLE_VALUE: string = 'background-color: yellow; color: red; font-weight: bold;';    
    public static DATA_CH5_APPENDSTYLE_ATTRIBUTE_VALUE: string = 'data_ch5_appendstyle_signal_1';
    public static DATA_CH5_APPENDSTYLE_ATTRIBUTE: string = 'data-ch5-appendstyle';
    public static HTML_TEMPLATE_DATA_CH5_APPENDSTYLE: string = '<ch5-button sendEventOnClick="signal" label="Send Signal"></ch5-button><div data-ch5-appendstyle="data_ch5_appendstyle_signal_1" > DIV: Testing data-ch5-appendstyle </div>';


    public static DATA_CH5_APPENDCLASS_VALUE: string = 'blinking_red';    
    public static DATA_CH5_APPENDCLASS_ATTRIBUTE_VALUE: string = 'data_ch5_appendclass_signal_1';
    public static DATA_CH5_APPENDCLASS_ATTRIBUTE: string = 'data-ch5-appendclass';
    public static HTML_TEMPLATE_DATA_CH5_APPENDCLASS: string = '<ch5-button sendEventOnClick="signal" label="Send Signal"></ch5-button><div data-ch5-appendclass="data_ch5_appendclass_signal_1" > DIV: Testing data-ch5-appendclass </div>';
    public static CSS_TEMPLATE_DATA_CH5_APPENDCLASS: string = '.blinking_red {  color: red; animation: blinker 1s linear infinite;}'
}

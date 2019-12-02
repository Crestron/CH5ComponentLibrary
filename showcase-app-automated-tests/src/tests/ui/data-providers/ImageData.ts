// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class ImageData {

    public static GENERATED_IMAGE: string = 'div.content.preview > ch5-image:nth-child(1)';
    public static GENERATED_IMAGE_INNER_HTML: string = 'div.content.preview > ch5-image:nth-child(1) > img';

    public static ALT_INNER_HTML: string = 'alt="Image not available"';
    public static ALT_ATTRIBUTE: string = 'alt';    
    public static ALT_ATTRIBUTE_VALUE: string = 'Image not available';   
    public static HTML_TEMPLATE_ALT: string = '<ch5-image alt="Image not available"></ch5-image>';
    
    public static URL_INNER_HTML: string = 'src="https://www.crestron.com/Crestron/media/Crestron/GeneralSiteImages/Featured%20Pages/Digital%20Media/all-in-one.jpg"'
    public static URL_ATTRIBUTE: string = 'url';    
    public static URL_ATTRIBUTE_VALUE: string = 'https://www.crestron.com/Crestron/media/Crestron/GeneralSiteImages/Featured%20Pages/Digital%20Media/all-in-one.jpg';   
    public static HTML_TEMPLATE_URL: string = '<ch5-image url="https://www.crestron.com/Crestron/media/Crestron/GeneralSiteImages/Featured%20Pages/Digital%20Media/all-in-one.jpg"></ch5-image>';

    public static WIDTH_INNER_HTML: string = 'width: 100px';
    public static WIDTH_ATTRIBUTE: string = 'width';    
    public static WIDTH_ATTRIBUTE_VALUE: string = '100px';   
    public static HTML_TEMPLATE_WITDH: string = '<ch5-image width="100px" url="https://www.crestron.com/Crestron/media/Crestron/GeneralSiteImages/Featured%20Pages/Digital%20Media/all-in-one.jpg"></ch5-image>';

    public static HEIGHT_INNER_HTML: string = 'height: 100px';
    public static HEIGHT_ATTRIBUTE: string = 'height';    
    public static HEIGHT_ATTRIBUTE_VALUE: string = '100px';   
    public static HTML_TEMPLATE_HEIGHT: string = '<ch5-image height="100px" url="https://www.crestron.com/Crestron/media/Crestron/GeneralSiteImages/Featured%20Pages/Digital%20Media/all-in-one.jpg"></ch5-image>';

    public static URL_INNER_HTML_ATTRIBUTE = 'src';
    public static REFRESH_RATE_ATTRIBUTE: string = 'refreshRate';    
    public static REFRESH_RATE_ATTRIBUTE_VALUE: string = '1';   
    public static HTML_TEMPLATE_REFRESH_RATE: string = '<ch5-image refreshRate="1" url="https://picsum.photos/200/300/?random"></ch5-image>';
 
    public static RECEIVE_SIGNAL_URL_INNER_HTML_NEW_VALUE = 'https://www.crestron.com/Crestron/media/Crestron/GeneralSiteImages/Featured%20Pages/Digital%20Media/all-in-one.jpg'; 
    public static RECEIVE_SIGNAL_URL_ATTRIBUTE: string = 'receiveStateUrl';    
    public static RECEIVE_SIGNAL_URL_ATTRIBUTE_VALUE: string = 'receive_image_url';   
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_URL: string =    '<ch5-image receiveStateUrl="receive_image_url" url="http://via.placeholder.com/350x150"></ch5-image>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';
     
    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE: string = 'sendEventOnClick';    
    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE: string = 'signal';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CLICK: string = '<ch5-image sendEventOnClick="signal" url="http://via.placeholder.com/350x150"></ch5-image>';

    public static SEND_SIGNAL_ON_TOUCH_ATTRIBUTE: string = 'sendEventOnTouch';    
    public static SEND_SIGNAL_ON_TOUCH_ATTRIBUTE_VALUE: string = 'signal';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_TOUCH: string = '<ch5-image sendEventOnTouch="signal" url="http://via.placeholder.com/350x150"></ch5-image>';

    public static SEND_SIGNAL_ON_ERROR_VALUE: string = 'Error loading image with src: incorrect_url';
    public static SEND_SIGNAL_ON_ERROR_ATTRIBUTE: string = 'sendEventOnError';    
    public static SEND_SIGNAL_ON_ERROR_ATTRIBUTE_VALUE: string = 'error';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_ERROR: string = '<ch5-image sendEventOnError="error" url="incorrect_url"></ch5-image>';
           
    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-image id="id-el"  url="https://picsum.photos/200/300/?random" ></ch5-image>';

    public static CUSTOM_CLASS_CLASS: string = 'class="box"';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-image customClass="box" url="https://picsum.photos/200/300/?random" ></ch5-image>';

    public static CUSTOM_STYLE_CLASS: string = 'style="border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-image customStyle="border:1px solid red;"  url="https://picsum.photos/200/300/?random" ></ch5-image>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-image show="false"  url="https://picsum.photos/200/300/?random" ></ch5-image>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-image noshowType="visibility"  url="https://picsum.photos/200/300/?random" ></ch5-image>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-image disabled="true"  url="https://picsum.photos/200/300/?random" ></ch5-image>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-image  receiveStateCustomClass="custom_signal" url="https://picsum.photos/200/300/?random" ></ch5-image>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-image  receiveStateStyleClass="custom_style_signal" url="https://picsum.photos/200/300/?random" ></ch5-image>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-image show="false"  receiveStateShow="show_signal" url="https://picsum.photos/200/300/?random" ></ch5-image>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-image show="false"  receiveStateShowPulse="show_pulse_signal" url="https://picsum.photos/200/300/?random" ></ch5-image>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-image  receiveStateHidePulse="hide_pulse_signal" url="https://picsum.photos/200/300/?random" ></ch5-image>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-image  receiveStateEnable="enable_signal" url="https://picsum.photos/200/300/?random"></ch5-image>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-image sendEventOnShow="signal_on_show" show="false"  receiveStateShowPulse="trigger_1" url="https://picsum.photos/200/300/?random" ></ch5-image>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static HTML_TEMPLATE_ELEMENT_CONTAINER: string = '<button id="btn">Check visibility</button><div id="parent"><ch5-image id="image" url="https://picsum.photos/200/300/?random"></ch5-image></div>';
}

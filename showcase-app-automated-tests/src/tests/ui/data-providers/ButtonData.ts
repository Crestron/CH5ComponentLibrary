// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class ButtonData{

    public static GENERATED_BTN: string = 'div.content.preview > ch5-button:nth-child(1)';
    public static GENERATED_BTN_INNER_HTML: string = 'div.content.preview > ch5-button:nth-child(1) > div';
    public static GENERATED_BTN_TWO: string = 'div.content.preview > ch5-button:nth-child(2)';
    public static GENERATED_BTN_TWO_INNER_HTML: string = 'div.content.preview > ch5-button:nth-child(2) > div';
   
    public static LABEL_CLASS: string = 'ch5-button--label';
    public static LABEL_ATTRIBUTE: string = 'label';    
    public static LABEL_ATTRIBUTE_VALUE: string = 'Automated button';   
    public static HTML_TEMPLATE_LABEL: string = '<ch5-button label="Automated button"></ch5-button>';

    public static ICON_CLASS: string = 'ch5-button--icon';  
    public static ICON_ATTRIBUTE: string = 'iconClass';  
    public static ICON_ATTRIBUTE_VALUE: string = 'fas fa-anchor'; 
    public static HTML_TEMPLATE_ICON: string = '<ch5-button iconClass="fas fa-anchor"></ch5-button>';

    public static ICONPOSITION_CLASS: string = 'cx-button-icon-pos-last';
    public static ICONPOSITION_ATTRIBUTE: string = 'iconposition'; 
    public static ICONPOSITION_ATTRIBUTE_VALUE: string = 'last';  
    public static HTML_TEMPLATE_ICONPOSITION: string = '<ch5-button iconPosition="last" iconClass="fas fa-arrow-alt-circle-left"></ch5-button>';

    public static ORIENTATION_CLASS: string = 'ch5-button--vertical';
    public static ORIENTATION_ATTRIBUTE: string = 'orientation';   
    public static ORIENTATION_ATTRIBUTE_VALUE: string = 'vertical';   
    public static HTML_TEMPLATE_ORIENTATION: string = '<ch5-button orientation="vertical"></ch5-button>';

    public static SHAPE_CLASS: string = 'ch5-button--circle';
    public static SHAPE_ATTRIBUTE: string = 'shape';   
    public static SHAPE_ATTRIBUTE_VALUE: string = 'circle';
    public static HTML_TEMPLATE_SHAPE: string = '<ch5-button shape="circle"></ch5-button>';

    public static SIZE_CLASS: string = 'ch5-button--size-x-large';
    public static SIZE_ATTRIBUTE: string = 'size';  
    public static SIZE_ATTRIBUTE_VALUE: string = 'x-large';   
    public static HTML_TEMPLATE_SIZE: string = '<ch5-button size="x-large"></ch5-button>';

    public static STRECH_CLASS: string = 'ch5-button--stretch-width';
    public static STRECH_ATTRIBUTE: string = 'stretch';   
    public static STRETCH_ATTRIBUTE_VALUE: string = 'width';   
    public static HTML_TEMPLATE_STRETCH: string = '<ch5-button stretch="width"></ch5-button>';

    public static TYPE_CLASS: string = 'ch5-button--danger'; 
    public static TYPE_ATTRIBUTE: string = 'type';  
    public static TYPE_ATTRIBUTE_VALUE: string = 'danger';    
    public static HTML_TEMPLATE_TYPE: string = '<ch5-button type="danger"></ch5-button>';

    public static SELECTED_CLASS: string = 'ch5-button--selected';
    public static SELECTED_ATTRIBUTE: string = 'selected';  
    public static SELECTED_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_SELECTED: string = '<ch5-button selected="true"></ch5-button>';

    public static RECEIVE_SIGNAL_SELECTED_ATTRIBUTE: string = 'receiveStateSelected';
    public static RECEIVE_SIGNAL_SELECTED_ATTRIBUTE_VALUE: string = 'selected';       
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SELECTED: string =   '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>'+
                                                                    '<ch5-button label="ReceiveSelectedSignal" receiveStateSelected="selected"></ch5-button>'

    public static RECEIVE_SIGNAL_LABEL_VALUE: string = 'New Label';
    public static RECEIVE_SIGNAL_LABEL_ATTRIBUTE: string = 'receiveStateLabel';
    public static RECEIVE_SIGNAL_LABEL_ATTRIBUTE_VALUE: string = 'btn_receive_label';         
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_LABEL: string =  '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>'+
                                                                '<ch5-button label="Old Label" receiveStateLabel="btn_receive_label"></ch5-button>'

    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE: string = 'He<b>ll</b>o <span style="color:red">World</span><i style="color: blue;">!</i>';
    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE: string = 'receivestatescriptlabelhtml';
    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE: string = 'btn_receive_signal_script_label_html';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SCRIPT_LABEL_HTML: string =  '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>'+
                                                                            '<ch5-button receiveStateScriptLabelHtml="btn_receive_signal_script_label_html"></ch5-button>';

    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE:string = 'sendEventOnClick';                                                                        
    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE: string = 'btn_clicked';                                                                      
    public static HTML_TEMPLATE_BTN_CLICKED: string = '<ch5-button label="SendOnClick" sendEventOnClick="btn_clicked"></ch5-button>';

    public static SEND_SIGNAL_ON_TOUCH_ATTRIBUTE: string = 'sendEventOnTouch';
    public static SEND_SIGNAL_ON_TOUCH_ATTRIBUTE_VALUE: string = 'btn_touched';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_TOUCH: string = '<ch5-button label="SendOnTouch" sendEventOnTouch="btn_touched"></ch5-button>';

    public static GENERATED_BTN_FOCUS: string = '#btn';
    public static FOCUS_TRIGGERED: string = 'Event triggered';
    public static HTML_TEMPLATE_FOCUS: string = '<ch5-button id="button" label="Button"> </ch5-button>' +
                                                '<button id="btn">Waiting for event...</button>';
    public static JS_TEMPLATE_FOCUS: string = 'var v = document.getElementById("button"); var btn = document.getElementById("btn"); v.addEventListener("focus", function(){ btn.innerHTML = "Event triggered";});';

    public static GENERATED_BTN_BLUR: string = '#btn';
    public static BLUR_TRIGGERED: string = 'Event triggered';
    public static HTML_TEMPLATE_BLUR: string =  '<ch5-button id="button" label="Button"> </ch5-button>' +
                                                '<button id="btn">Waiting for event...</button>';
    public static JS_TEMPLATE_BLUR: string = 'var v = document.getElementById("button"); var btn = document.getElementById("btn"); v.addEventListener("blur", function(){ btn.innerHTML = "Event triggered";});';
     
    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-button id="id-el" ></ch5-button>';

    public static CUSTOM_CLASS_CLASS: string = 'box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-button customClass="box" ></ch5-button>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-button customStyle="border:1px solid red;" ></ch5-button>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-button show="false" ></ch5-button>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-button noshowType="visibility" ></ch5-button>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-button disabled="true" ></ch5-button>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-button  receiveStateCustomClass="custom_signal"></ch5-button>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-button  receiveStateStyleClass="custom_style_signal"></ch5-button>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-button show="false"  receiveStateShow="show_signal"></ch5-button>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-button show="false"  receiveStateShowPulse="show_pulse_signal"></ch5-button>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-button  receiveStateHidePulse="hide_pulse_signal"></ch5-button>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-button  receiveStateEnable="enable_signal"></ch5-button>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-button sendEventOnShow="signal_on_show" show="false" receiveStateShowPulse="trigger_1"></ch5-button>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

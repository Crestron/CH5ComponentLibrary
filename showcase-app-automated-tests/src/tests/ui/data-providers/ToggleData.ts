// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class ToggleData {

    public static GENERATED_TOGGLE: string = 'div.content.preview > ch5-toggle:nth-child(1)';
    public static GENERATED_TOGGLE_INNER_HTML: string = 'div.content.preview > ch5-toggle:nth-child(1) > div';
    public static TOGGLE_STATE_ATTRIBUTE: string = 'checked';
    public static TOGGLE_ON: string = 'true';
    public static TOGGLE_OFF: string = null;

    public static LABEL_CLASS: string = 'ch5-toggle__label';
    public static LABEL_ATTRIBUTE: string = 'label';    
    public static LABEL_ATTRIBUTE_VALUE: string = 'Toggle label';   
    public static HTML_TEMPLATE_LABEL: string = '<ch5-toggle label="Toggle label"></ch5-toggle>';

    public static OFF_LABEL_CLASS: string = 'ch5-toggle__off-label';
    public static OFF_LABEL_ATTRIBUTE: string = 'labelOff';    
    public static OFF_LABEL_ATTRIBUTE_VALUE: string = 'off Label';   
    public static HTML_TEMPLATE_OFF_LABEL: string = '<ch5-toggle labelOff="off Label"></ch5-toggle>';

    public static ON_LABEL_CLASS: string = 'ch5-toggle__on-label';
    public static ON_LABEL_ATTRIBUTE: string = 'labelOn';    
    public static ON_LABEL_ATTRIBUTE_VALUE: string = 'on Label';   
    public static HTML_TEMPLATE_ON_LABEL: string = '<ch5-toggle labelOn="on Label"></ch5-toggle>';

    public static ON_ICON_CLASS: string = 'ch5-toggle__on-icon';
    public static ON_ICON_ATTRIBUTE: string = 'iconOn';    
    public static ON_ICON_ATTRIBUTE_VALUE: string = 'fas fa-microphone-alt';   
    public static HTML_TEMPLATE_ON_ICON: string = '<ch5-toggle iconOn="fas fa-microphone-alt"></ch5-toggle>';

    public static OFF_ICON_CLASS: string = 'ch5-toggle__off-icon';
    public static OFF_ICON_ATTRIBUTE: string = 'iconOff';    
    public static OFF_ICON_ATTRIBUTE_VALUE: string = 'fas fa-microphone-alt-slash';   
    public static HTML_TEMPLATE_OFF_ICON: string = '<ch5-toggle iconOff="fas fa-microphone-alt-slash"></ch5-toggle>';

    public static SHAPE_RECTANGLE_CLASS: string = 'ch5-toggle--rectangle';
    public static HANDLE_SHAPE_CLASS: string = 'ch5-toggle__handle';
    public static HANDLE_SHAPE_ATTRIBUTE: string = 'handleShape';    
    public static HANDLE_SHAPE_ATTRIBUTE_VALUE: string = 'rectangle';   
    public static HTML_TEMPLATE_HANDLE_SHAPE: string = '<ch5-toggle handleShape="rectangle"></ch5-toggle>';

    public static ORIENTATION_CLASS: string = 'ch5-toggle--vertical';
    public static ORIENTATION_ATTRIBUTE: string = 'orientation';    
    public static ORIENTATION_ATTRIBUTE_VALUE: string = 'vertical';   
    public static HTML_TEMPLATE_ORIENTATION: string = '<ch5-toggle orientation="vertical"></ch5-toggle>';

    public static VALUE_CLASS: string = 'ch5-toggle--on';
    public static VALUE_ATTRIBUTE: string = 'value';    
    public static VALUE_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_VALUE: string = '<ch5-toggle value="true"></ch5-toggle>';
   
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE: string = 'signalValueSyncTimeout';    
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE: string = '500';   
    public static HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT: string = '<ch5-toggle signalValueSyncTimeout="500"></ch5-toggle>';

    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE: string = 'sendEventOnClick';    
    public static SEND_SIGNAL_ON_CLICK_ATTRIBUTE_VALUE: string = 'send_digital_pulse';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CLICK: string = '<ch5-toggle sendEventOnClick="send_digital_pulse"></ch5-toggle>';

    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_VALUE: string = '<span style="color:green">Hello</span><br/><span style="color:red">W</span>orld!'
    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE: string = 'receiveStateScriptLabelHtml';    
    public static RECEIVE_SIGNAL_SCRIPT_LABEL_HTML_ATTRIBUTE_VALUE: string = 'receive_html_script_label';  
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SCRIPT_LABEL_HTML: string =  '<ch5-toggle receiveStateScriptLabelHtml="receive_html_script_label"></ch5-toggle>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>'
    
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE: string = 'receiveStateValue';    
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE: string = 'receive_switch_value';  
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE: string =  '<ch5-toggle receiveStateValue="receive_switch_value"></ch5-toggle>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>'
    
    public static GET_DIRTY_FALSE: string = 'false';
    public static GET_DIRTY_TRUE: string = 'true';
    public static GENERATED_BTN_GET_DIRTY: string = '#dirty';
    public static HTML_TEMPLATE_GET_DIRTY_METHOD: string =  '<ch5-toggle id="toggle" feedbackmode="submit"> </ch5-toggle>' +
                                                            '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_GET_DIRTY_METHOD: string = 'var toggle = document.getElementById("toggle"); var dirty = document.getElementById("dirty"); dirty.addEventListener("click", function(e){dirty.innerHTML = toggle.getDirty();});';
    
    public static GENERATED_BTN_RESET: string = '#reset';
    public static HTML_TEMPLATE_RESET_METHOD: string = '<ch5-toggle id="toggle" signalValueSyncTimeout="5000"></ch5-toggle>' +
                                                        '<button id="reset">reset</button>' + '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_RESET_METHOD: string = 'var button = document.getElementById("reset"); var toggle = document.getElementById("toggle"); button.addEventListener("click", function(e){ toggle.reset();}); dirty.addEventListener("click", function(e){dirty.innerHTML = toggle.getDirty();});';

    public static GENERATED_BTN_FOCUS: string = '#btn';
    public static FOCUS_TRIGGERED: string = 'Event triggered';
    public static HTML_TEMPLATE_FOCUS: string = '<ch5-toggle id="toggle"> </ch5-toggle>' +
                                                '<button id="btn">Waiting for event...</button>';
    public static JS_TEMPLATE_FOCUS: string = 'var v = document.getElementById("toggle"); var btn = document.getElementById("btn"); v.addEventListener("focus", function(){ btn.innerHTML = "Event triggered";});';

    public static GENERATED_BTN_BLUR: string = '#btn';
    public static BLUR_TRIGGERED: string = 'Event triggered';
    public static HTML_TEMPLATE_BLUR: string =  '<ch5-toggle id="toggle"> </ch5-toggle>' +
                                                '<button id="btn">Waiting for event...</button>';
    public static JS_TEMPLATE_BLUR: string = 'var v = document.getElementById("toggle"); var btn = document.getElementById("btn"); v.addEventListener("blur", function(){ btn.innerHTML = "Event triggered";});';
    
    
    public static GENERATED_BTN_SUBMIT: string = '#btn_automated';
    public static FEEDBACK_MODE_SEND_SIGNAL: string = 'send_signal_on_submit';
    public static FEEDBACK_MODE_RECEIVE_SIGNAL: string = 'receive_switch_value';
    public static FEEDBACK_MODE_RECEIVE_SIGNAL_VALUE: boolean = false; 
    public static FEEDBACK_MODE_ATTRIBUTE: string = 'feedbackMode';    
    public static FEEDBACK_MODE_ATTRIBUTE_VALUE: string = 'submit';   
    public static HTML_TEMPLATE_FEEDBACK_MODE: string = '<ch5-toggle id="toggle" feedbackMode="submit" sendEventOnClick="send_signal_on_submit" receiveStateValue="receive_switch_value"></ch5-toggle>' +
                                                        '<button id="btn_automated">Submit</button>';
    public static JS_TEMPLATE_FEEDBACK_MODE: string = 'var button = document.getElementById("btn_automated"); var toggle = document.getElementById("toggle"); button.addEventListener("click", function(e){ toggle.submit();});'

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-toggle id="id-el" ></ch5-toggle>';

    public static CUSTOM_CLASS_CLASS: string = 'ch5-toggle box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-toggle customClass="box" ></ch5-toggle>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-toggle customStyle="border:1px solid red;" ></ch5-toggle>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-toggle show="false" ></ch5-toggle>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-toggle noshowType="visibility" ></ch5-toggle>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-toggle disabled="true" ></ch5-toggle>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-toggle  receiveStateCustomClass="custom_signal"></ch5-toggle>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-toggle  receiveStateStyleClass="custom_style_signal"></ch5-toggle>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-toggle show="false"  receiveStateShow="show_signal"></ch5-toggle>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-toggle show="false"  receiveStateShowPulse="show_pulse_signal"></ch5-toggle>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-toggle  receiveStateHidePulse="hide_pulse_signal"></ch5-toggle>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-toggle  receiveStateEnable="enable_signal"></ch5-toggle>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-toggle sendEventOnShow="signal_on_show" show="false"  receiveStateShowPulse="trigger_1"></ch5-toggle>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

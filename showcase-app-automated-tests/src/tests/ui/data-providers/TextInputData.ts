// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class TextInputData {

    public static GENERATED_TEXTINPUT_INPUT: string = 'div.content.preview > ch5-textinput:nth-child(1) > div > input';
    public static GENERATED_TEXTINPUT: string = 'div.content.preview > ch5-textinput:nth-child(1)';
    public static GENERATED_TEXTINPUT_INPUT_WITH_FORM: string = 'div.content.preview > form > ch5-textinput:nth-child(1) > div > input';
    public static GENERATED_TEXTINPUT_WITH_FORM: string = 'div.content.preview > form > ch5-textinput:nth-child(1)';
    public static GENERATED_TEXTINPUT_THIRD: string = 'div.content.preview > ch5-textinput:nth-child(3)';
    public static SUBMIT_FORM_BTN: string = 'div.content.preview > form > input[type="submit"]';
    public static IS_INVALID: string = 'ch5-textinput--error';
    public static IS_FOCUSED: string = 'ch5-textinput--focused';
    public static SAMPLE_TEXT: string = 'Sample text';
    public static SAMPLE_TEXT_LONG: string ='Loooooooooooooooooooooooooooooooooooooong Sample Text'
    
    public static ICON_CLASS: string = 'ch5-textinput__icon';
    public static ICON_ATTRIBUTE: string = 'icon';    
    public static ICON_ATTRIBUTE_VALUE: string = 'fa fa-plane';   
    public static HTML_TEMPLATE_ICON: string = ' <ch5-textinput icon="fa fa-plane" ></ch5-textinput>';

    public static ICON_POSITION_CLASS: string = 'ch5-textinput__icon--last';
    public static ICON_POSITION_ATTRIBUTE: string = 'iconPosition';    
    public static ICON_POSITION_ATTRIBUTE_VALUE: string = 'last';   
    public static HTML_TEMPLATE_ICON_POSITION: string = '<ch5-textinput iconPosition="last" icon="fa fa-plane" ></ch5-textinput>';

    public static VALUE_CLASS: string = 'value="First Name"';
    public static VALUE_ATTRIBUTE: string = 'value';    
    public static VALUE_ATTRIBUTE_VALUE: string = 'First Name';   
    public static HTML_TEMPLATE_VALUE: string = '<ch5-textinput value="First Name"></ch5-textinput>';

    public static LABEL_CLASS: string = 'ch5-textinput__label';
    public static LABEL_ATTRIBUTE: string = 'label';    
    public static LABEL_ATTRIBUTE_VALUE: string = 'First Name';   
    public static HTML_TEMPLATE_LABEL: string = '<ch5-textinput label="First Name"></ch5-textinput>';

    public static PATTERN_ATTRIBUTE: string = 'pattern';    
    public static PATTERN_ATTRIBUTE_VALUE: string = 'abc';   
    public static HTML_TEMPLATE_PATTERN: string = '<form><ch5-textinput pattern="abc" ></ch5-textinput><input type="submit"/></form>';

    public static TYPE_TEXT: string = '';
    public static TYPE_CLASS: string = 'type="number"';
    public static TYPE_ATTRIBUTE: string = 'type';    
    public static TYPE_ATTRIBUTE_VALUE: string = 'number';   
    public static HTML_TEMPLATE_TYPE: string = '<ch5-textinput type="number"></ch5-textinput>';

    //minLength attribute not working
    public static MIN_LENGTH_CLASS: string = 'minlength="20"';
    public static MIN_LENGTH_ATTRIBUTE: string = 'minLength';    
    public static MIN_LENGTH_ATTRIBUTE_VALUE: string = '20';   
    public static HTML_TEMPLATE_MIN_LENGTH: string = '<form><ch5-textinput  minLength="20" feedbackMode="submit" required ></ch5-textinput><input type="submit"/></form>';

    public static MAX_LENGTH_TEXT: string = 'Sa';
    public static MAX_LENGTH_CLASS: string = 'maxlength="2"';
    public static MAX_LENGTH_ATTRIBUTE: string = 'maxLength';    
    public static MAX_LENGTH_ATTRIBUTE_VALUE: string = '2';   
    public static HTML_TEMPLATE_MAX_LENGTH: string = '<ch5-textinput maxLength="2" feedbackMode="submit"></ch5-textinput>';

    public static SIZE_CLASS: string = 'ch5-textinput__input--x-small';
    public static SIZE_ATTRIBUTE: string = 'size';    
    public static SIZE_ATTRIBUTE_VALUE: string = 'x-small';   
    public static HTML_TEMPLATE_SIZE: string = ' <ch5-textinput size="x-small" ></ch5-textinput>';

    public static STRETCH_CLASS: string = 'ch5-textinput--width';
    public static STRETCH_ATTRIBUTE: string = 'stretch';    
    public static STRETCH_ATTRIBUTE_VALUE: string = 'width';   
    public static HTML_TEMPLATE_STRETCH: string = '<ch5-textinput stretch="width"></ch5-textinput>';

    public static SCALING_BEFORE_LONG_TEXT: string = 'font-size: 16px;';
    public static SCALING_AFTER_LONG_TEXT: string = 'font-size: 12px;';
    public static SCALING_ATTRIBUTE: string = 'scaling';      
    public static HTML_TEMPLATE_SCALING: string = '<ch5-textinput scaling></ch5-textinput>';

    public static PLACEHOLDER_CLASS: string = 'placeholder="Sample text"';
    public static PLACEHOLDER_ATTRIBUTE: string = 'placeholder';  
    public static PLACEHOLDER_ATTRIBUTE_VALUE: string = 'Sample text';     
    public static HTML_TEMPLATE_PLACEHOLDER: string = '<ch5-textinput placeholder="Sample text"></ch5-textinput>';

    public static REQUIRED_ATTRIBUTE: string = 'required';       
    public static HTML_TEMPLATE_REQUIRED: string = '<form><ch5-textinput required ></ch5-textinput><input type="submit"/></form>';

    public static MASK_CLASS: string = '_ch5-textinput-mask__letter';
    public static MASK_ATTRIBUTE: string = 'mask';  
    public static MASK_ATTRIBUTE_VALUE: string = 'Sample mask';     
    public static HTML_TEMPLATE_MASK: string = '<ch5-textinput mask="Sample mask" ></ch5-textinput>';
  
    public static TAB_INDEX_CLASS: string = 'tabindex="1"';
    public static TAB_INDEX_ATTRIBUTE: string = 'tabIndex';  
    public static TAB_INDEX_ATTRIBUTE_VALUE: string = '1';     
    public static HTML_TEMPLATE_TAB_INDEX: string = '<ch5-textinput tabIndex=1 ></ch5-textinput> <ch5-textinput tabIndex=3></ch5-textinput> <ch5-textinput tabIndex=2></ch5-textinput>';

    public static TEXT_TRANSFORM_CLASS: string = 'ch5-textinput__input--uppercase';
    public static TEXT_TRANSFORM_ATTRIBUTE: string = 'text-transform';  
    public static TEXT_TRANSFORM_ATTRIBUTE_VALUE: string = 'uppercase';     
    public static HTML_TEMPLATE_TEXT_TRANSFORM: string = '<ch5-textinput text-transform="uppercase"></ch5-textinput>';

    public static RECEIVE_SIGNAL_FOCUS_VALUE: boolean = true;    
    public static RECEIVE_SIGNAL_FOCUS_ATTRIBUTE: string = 'receiveStateFocus';    
    public static RECEIVE_SIGNAL_FOCUS_ATTRIBUTE_VALUE: string = 'receive_signal_focus';  
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_FOCUS: string =  '<ch5-textinput receiveStateFocus="receive_signal_focus"></ch5-textinput>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_VALUE_VALUE: string = 'value received by button';    
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE: string = 'receiveStateValue';    
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE: string = 'receive_signal_value';  
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE: string =  '<ch5-textinput receiveStateValue="receive_signal_value"></ch5-textinput>'+
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';
                                                                
    public static SEND_SIGNAL_ON_FOCUS_ATTRIBUTE: string = 'sendEventOnFocus';    
    public static SEND_SIGNAL_ON_FOCUS_ATTRIBUTE_VALUE: string = 'focus_input_pulse';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_FOCUS: string = '<ch5-textinput sendEventOnFocus="focus_input_pulse"></ch5-textinput>';  

    public static SEND_SIGNAL_ON_BLUR_ATTRIBUTE: string = 'sendEventOnBlur';    
    public static SEND_SIGNAL_ON_BLUR_ATTRIBUTE_VALUE: string = 'signal_on_blur';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_BLUR: string = '<ch5-textinput sendEventOnBlur="signal_on_blur"></ch5-textinput>';
    
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE: string = 'sendEventOnChange';    
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE: string = 'signal_on_change';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE: string = '<ch5-textinput sendEventOnChange="signal_on_change"></ch5-textinput>';
    
    public static FEEDBACK_MODE_BTN_SUBMIT: string  = '#btn';
    public static FEEDBACK_MODE_SEND_SIGNAL_ON_CHANGE: string = 'signal_on_change';
    public static FEEDBACK_MODE_ATTRIBUTE: string = 'feedbackMode';    
    public static FEEDBACK_MODE_ATTRIBUTE_VALUE: string = 'submit';   
    public static HTML_TEMPLATE_FEEDBACK_MODE: string = '<ch5-textinput id="textinput" feedbackMode="submit" sendEventOnChange="signal_on_change"></ch5-textinput><ch5-button id = "btn" label = "Submit"></ch5-button>';                                          
    public static JS_TEMPLATE_FEEDBACK_MODE: string = 'var button = document.getElementById("btn"); var textinput = document.getElementById("textinput"); button.addEventListener("click", function(e){ textinput.submit();});';
    
    public static VALIDITY_CHANGE_VALID: string = '8';
    public static VALIDITY_CHANGE_INVALID: string = '3';
    public static VALIDITY_CHANGE_INVALID_TWO: string = '1';
    public static VALIDITY_CHANGED_ONCE: string = 'validity has changed 1 times';
    public static VALIDITY_CHANGED_TWICE: string = 'validity has changed 2 times';
    public static GENERATED_BTN_VALIDITY_CHANGE: string = '#btn';
    public static HTML_TEMPLATE_VALIDITY_CHANGE: string =   '<ch5-textinput id="validity"  type="number"  minValue="5" maxValue="10" feedbackMode="submit"> </ch5-textinput>' +
                                                            '<button id="btn">Number of times validity has changed</button>';
    public static JS_TEMPLATE_VALIDITY_CHANGE: string = 'var i = 1; var v = document.getElementById("validity"); var btn = document.getElementById("btn"); v.addEventListener("validitychange", function(){ btn.innerHTML = "validity has changed "+ i + " times";  i++;});';

    public static EMPTY_AFTER_RESET: string = '';
    public static GENERATED_BTN_RESET: string = '#reset';
    public static HTML_TEMPLATE_RESET: string = '<ch5-textinput id="textinput"></ch5-textinput>' +
                                                '<button id="reset">reset</button>' + '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_RESET: string = 'var button = document.getElementById("reset"); var dirty = document.getElementById("dirty"); var textinput = document.getElementById("textinput"); button.addEventListener("click", function(e){ textinput.reset();}); dirty.addEventListener("click", function(){dirty.innerHTML = textinput.getDirty();});';

    public static GET_DIRTY_FALSE: string = 'false';
    public static GET_DIRTY_TRUE: string = 'true';
    public static GENERATED_BTN_GET_DIRTY: string = '#dirty';
    public static HTML_TEMPLATE_GET_DIRTY: string = '<ch5-textinput id="textinput" feedbackMode="submit"></ch5-textinput>' +
                                                    '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_GET_DIRTY: string = 'var dirty = document.getElementById("dirty"); var textinput = document.getElementById("textinput"); dirty.addEventListener("click", function(){dirty.innerHTML = textinput.getDirty();});';

    public static GENERATED_BTN_GET_VALID: string = '#valid';
    public static GET_VALID_FALSE: string = 'false';
    public static HTML_TEMPLATE_GET_VALID: string = '<ch5-textinput id="textinput" pattern="aaa"></ch5-textinput>' +
                                                    '<button id="valid">getValid</button>';
    public static JS_TEMPLATE_GET_VALID: string = 'var valid = document.getElementById("valid"); var textinput = document.getElementById("textinput"); valid.addEventListener("click", function(){valid.innerHTML = textinput.getValid();});';

    public static GENERATED_BTN_GET_VALUE: string = '#value';
    public static HTML_TEMPLATE_GET_VALUE: string = '<ch5-textinput id="textinput" pattern="aaa"></ch5-textinput>' +
                                                    '<button id="value">getValue</button>';
    public static JS_TEMPLATE_GET_VALUE: string = 'var value = document.getElementById("value"); var textinput = document.getElementById("textinput"); value.addEventListener("click", function(){value.innerHTML = textinput.getValue();});';

    public static SET_VALUE_VALUE: string = 'Value set by setValue';
    public static GENERATED_BTN_SET_VALUE: string = '#value';
    public static HTML_TEMPLATE_SET_VALUE: string = '<ch5-textinput id="textinput" pattern="aaa"></ch5-textinput>' +
                                                    '<button id="value">setValue</button>';
    public static JS_TEMPLATE_SET_VALUE: string = 'var value = document.getElementById("value"); var textinput = document.getElementById("textinput"); value.addEventListener("click", function(){value.innerHTML = textinput.setValue("Value set by setValue");});';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-textinput id="id-el" ></ch5-textinput>';

    public static CUSTOM_CLASS_CLASS: string = 'ch5-textinput box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-textinput customClass="box"></ch5-textinput>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-textinput customStyle="border:1px solid red;" ></ch5-textinput>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-textinput show="false" ></ch5-textinput>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-textinput noshowType="visibility" ></ch5-textinput>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-textinput disabled="true" ></ch5-textinput>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-textinput  receiveStateCustomClass="custom_signal"></ch5-textinput>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-textinput  receiveStateStyleClass="custom_style_signal"></ch5-textinput>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-textinput show="false"  receiveStateShow="show_signal"></ch5-textinput>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-textinput show="false"  receiveStateShowPulse="show_pulse_signal"></ch5-textinput>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-textinput  receiveStateHidePulse="hide_pulse_signal"></ch5-textinput>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-textinput  receiveStateEnable="enable_signal"></ch5-textinput>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-textinput sendEventOnShow="signal_on_show" show="false"  receiveStateShowPulse="trigger_1"></ch5-textinput>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

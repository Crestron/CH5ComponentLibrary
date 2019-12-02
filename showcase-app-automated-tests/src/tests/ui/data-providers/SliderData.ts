// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class SliderData {
    
    public static GENERATED_SLIDER: string = 'div.content.preview > ch5-slider:nth-child(1)';
    public static GENERATED_SLIDER_INNER_HTML: string = 'div.content.preview > ch5-slider:nth-child(1) > div';
    public static HANDLE: string = 'div.content.preview > ch5-slider:nth-child(1) > div > div > div:nth-child(2) > div';
    public static HIGH_HANDLE: string = 'div.content.preview > ch5-slider:nth-child(1) > div > div > div:nth-child(3) > div'; 
    public static HANDLE_POSITION_ATTRIBUTE = 'aria-valuetext';
    public static SLIDER_BAR = 'div.content.preview > ch5-slider > div > div > div.noUi-connects';
    public static GENERATED_TOOLTIP: string = 'div.noUi-tooltip';
    
    public static HANDLE_SHAPE_CLASS: string = 'ch5-slider--shape--circle';
    public static HANDLE_SHAPE_ATTRIBUTE: string = 'handleShape';    
    public static HANDLE_SHAPE_ATTRIBUTE_VALUE: string = 'circle';   
    public static HTML_TEMPLATE_HANDLE_SHAPE: string = '<ch5-slider handleShape="circle"></ch5-slider>';

    public static RANGE_ATTRIBUTE: string = 'range';    
    public static RANGE_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_RANGE: string = '<ch5-slider range="true"></ch5-slider>';

    public static VALUE_ATTRIBUTE: string = 'value';    
    public static VALUE_ATTRIBUTE_VALUE: string = '9500';
    public static VALUE_HANDLE_POSITION: string = '9500.00';   
    public static HTML_TEMPLATE_VALUE: string = '<ch5-slider value="9500"></ch5-slider>';

    public static VALUE_HIGH_ATTRIBUTE: string = 'valueHigh';    
    public static VALUE_HIGH_ATTRIBUTE_VALUE: string = '40000';
    public static VALUE_HIGH_HANDLE_POSITION: string = '40000.00';   
    public static HTML_TEMPLATE_VALUE_HIGH: string = '<ch5-slider valueHigh="40000" range="true"></ch5-slider>';

    public static MIN_ATTRIBUTE: string = 'min';    
    public static MIN_ATTRIBUTE_VALUE: string = '500';
    public static MIN_HANDLE_POSITION: string = '500.00';    
    public static HTML_TEMPLATE_MIN: string = '<ch5-slider min="500"></ch5-slider>';

    public static MAX_ATTRIBUTE: string = 'max';
    public static MAX_SLIDER_PIXELS: string = '100';    
    public static MAX_ATTRIBUTE_VALUE: string = '50000';
    public static MAX_HANDLE_POSITION: string = '18939.00';    
    public static HTML_TEMPLATE_MAX: string = '<ch5-slider max="50000"></ch5-slider>';

    public static ORIENTATION_CLASS: string = 'ch5-slider--orientation--vertical';
    public static ORIENTATION_ATTRIBUTE: string = 'orientation';    
    public static ORIENTATION_ATTRIBUTE_VALUE: string = 'vertical';   
    public static HTML_TEMPLATE_ORIENTATION: string = '<ch5-slider orientation="vertical"></ch5-slider>';

    public static SIZE_CLASS: string = 'ch5-slider--size--large';
    public static SIZE_ATTRIBUTE: string = 'size';    
    public static SIZE_ATTRIBUTE_VALUE: string = 'large';   
    public static HTML_TEMPLATE_SIZE: string = '<ch5-slider size="large"></ch5-slider>';

    public static HANDLE_SIZE_CLASS: string = 'ch5-slider--handle-size--x-large';
    public static HANDLE_SIZE_ATTRIBUTE: string = 'handleSize';    
    public static HANDLE_SIZE_ATTRIBUTE_VALUE: string = 'x-large';   
    public static HTML_TEMPLATE_HANDLE_SIZE: string = '<ch5-slider handleSize="x-large"></ch5-slider>';

    public static STEP_SLIDER_PIXELS: string = '50';
    public static STEP_HANDLE_POSITION: string = '15.00';
    public static STEP_ATTRIBUTE: string = 'step';    
    public static STEP_ATTRIBUTE_VALUE: string = '15';   
    public static HTML_TEMPLATE_STEP: string = '<ch5-slider step="15" min="0" max="90"></ch5-slider>';

    public static TICKS_HANDLE_POSITION_ONE: string = '433.00'; // changed from 500 TODO recheck
    public static TICKS_SLIDER_PIXELS_POSITION_ONE: string = '80';
    public static TICKS_HANDLE_POSITION_TWO: string = '590.96'; // changed from 550 TODO recheck
    public static TICKS_SLIDER_PIXELS_POSITION_TWO: string = '120';
    public static TICKS_VALUE_ATTRIBUTE: string = 'ticks';    
    public static TICKS_VALUE_ATTRIBUTE_VALUE: string = '{"0":"0", "35":"500", "40":"550", "100":"1000"}';   
    public static HTML_TEMPLATE_TICKS: string = '<ch5-slider ticks=\'{"0":"0", "35":"500", "40":"550", "100":"1000"}\'></ch5-slider>';

    public static FIRST_SHOW_TICK_VALUE_ELEMENT: string = 'div.content.preview > ch5-slider > div > div.noUi-pips.noUi-pips-horizontal > div:nth-child(2)';
    public static FIRST_SHOW_TICK_VALUE: string = '55';
    public static SHOW_TICK_VALUE_ATTRIBUTE: string = 'showTickValues';    
    public static SHOW_TICK_VALUE_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_SHOW_TICK_VALUES: string = '<ch5-slider ticks=\'{"0":"55", "25":"90"}\' showTickValues="true"></ch5-slider>';

    public static TOOLTIP_SHOW_TYPE_SLIDER_PIXELS: string = '20';
    public static TOOLTIP_SHOW_TYPE_SLIDER_TEXT: string = "8%";
    public static TOOLTIP_SHOW_TYPE_SIZE_CLASS: string = 'ch5-slider--tooltip--on';
    public static TOOLTIP_SHOW_TYPE_ATTRIBUTE: string = 'toolTipShowType';    
    public static TOOLTIP_SHOW_TYPE_ATTRIBUTE_VALUE: string = 'on';   
    public static HTML_TEMPLATE_TOOLTIP_SHOW_TYPE: string = '<ch5-slider toolTipShowType="on"></ch5-slider>';

    public static TOOLTIP_DISPLAY_TYPE_SLIDER_PIXELS: string = '45';
    public static TOOLTIP_DISPLAY_TYPE_HANDLE_POSITION: string = '11171';
    public static TOOLTIP_DISPLAY_TYPE_ATTRIBUTE: string = 'toolTipDisplayType';    
    public static TOOLTIP_DISPLAY_TYPE_ATTRIBUTE_VALUE: string = 'value';   
    public static HTML_TEMPLATE_TOOLTIP_DISPLAY_TYPE: string = '<ch5-slider toolTipShowType="on" toolTipDisplayType="value" feedbackmode="submit"></ch5-slider>';

    public static SLIDER_DEFAULT_PERCENTAGE: string = '0.00';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_SLIDER_PIXELS: string = '30';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_HANDLE_POSITION_VALUE: string = '7447.00';
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE: string = 'signalValueSyncTimeout';    
    public static SIGNAL_VALUE_SYNC_TIMEOUT_ATTRIBUTE_VALUE: string = '500';   
    public static HTML_TEMPLATE_SIGNAL_VALUE_SYNC_TIMEOUT: string = '<ch5-slider signalValueSyncTimeout="500"></ch5-slider>';
  
    public static SEND_SIGNAL_ON_CHANGE_SLIDER_PIXELS: string = '25';
    public static SEND_SIGNAL_ON_CHANGE_HANDLE_POSITION: string = '6206';
    public static SEND_SIGNAL_ON_CHANGE_HANDLE_POSITION_VALUE: string = '6206.00';
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE: string = 'sendEventOnChange';    
    public static SEND_SIGNAL_ON_CHANGE_ATTRIBUTE_VALUE: string = 'slider_value_on_change';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE: string = '<ch5-slider sendEventOnChange="slider_value_on_change"></ch5-slider>';
    
    public static SEND_SIGNAL_ON_CHANGE_HIGH_SLIDER_PIXELS: string = '65';
    public static SEND_SIGNAL_ON_CHANGE_HIGH_HANDLE_POSITION: string = '16136';
    public static SEND_SIGNAL_ON_CHANGE_HIGH_HANDLE_POSITION_VALUE: string = '16136.00';
    public static SEND_SIGNAL_ON_CHANGE_HIGH_ATTRIBUTE: string = 'sendEventOnChangeHigh';    
    public static SEND_SIGNAL_ON_CHANGE_HIGH_ATTRIBUTE_VALUE: string = 'slider_value_high_on_change';   
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CHANGE_HIGH: string = '<ch5-slider range="true" sendEventOnChangeHigh="slider_value_high_on_change"></ch5-slider>';

    public static RECEIVE_SIGNAL_VALUE_VALUE: string = '15000.00';
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE: string = 'receiveStateValue';    
    public static RECEIVE_SIGNAL_VALUE_ATTRIBUTE_VALUE: string = 'receive_slider_value';   
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE: string = '<ch5-slider receiveStateValue="receive_slider_value"></ch5-slider> <ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static RECEIVE_SIGNAL_VALUE_HIGH_VALUE: string = '25000.00';
    public static RECEIVE_SIGNAL_VALUE_HIGH_ATTRIBUTE: string = 'receiveStateValueHigh';    
    public static RECEIVE_SIGNAL_VALUE_HIGH_ATTRIBUTE_VALUE: string = 'receive_slider_value_high';   
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_VALUE_HIGH: string = '<ch5-slider receiveStateValueHigh="receive_slider_value_high" range="true"></ch5-slider> <ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';

    public static GET_DIRTY_SLIDER_PIXELS: string = '75';
    public static GET_DIRTY_HANDLE_POSITION_VALUE: string = '18618.00';
    public static GET_DIRTY_FALSE: string = 'false';
    public static GET_DIRTY_TRUE: string = 'true';
    public static GENERATED_BTN_GET_DIRTY: string = '#dirty';
    public static HTML_TEMPLATE_GET_DIRTY_METHOD: string =  '<ch5-slider id="slider" feedbackmode="submit"> </ch5-slider>' +
                                                            '<button id="dirty">getDirty</button>'
    public static JS_TEMPLATE_GET_DIRTY_METHOD: string = 'var slider = document.getElementById("slider"); var dirty = document.getElementById("dirty"); dirty.addEventListener("click", function(e){dirty.innerHTML = slider.getDirty();});';
    
    public static RESET_METHOD_SLIDER_PIXELS: string = '35';
    public static RESET_METHOD_HANDLE_POSITION_VALUE: string = '8688.00';
    public static GENERATED_BTN_RESET: string = '#reset';
    public static HTML_TEMPLATE_RESET_METHOD: string = '<ch5-slider id="slider" signalValueSyncTimeout="5000"></ch5-slider>' +
                                                        '<button id="reset">reset</button>' + '<button id="dirty">getDirty</button>';
    public static JS_TEMPLATE_RESET_METHOD: string = 'var button = document.getElementById("reset"); var slider = document.getElementById("slider"); button.addEventListener("click", function(e){ slider.reset();}); dirty.addEventListener("click", function(e){dirty.innerHTML = slider.getDirty();});'

    public static FEEDBACK_MODE_SLIDER_PIXELS: string = '30';
    public static FEEDBACK_MODE_HANDLE_POSITION: string = '7447';
    public static GENERATED_BTN_SUBMIT: string = '#btn_automated';
    public static FEEDBACK_MODE_SEND_SIGNAL: string = 'send_signal_on_submit';
    public static FEEDBACK_MODE_RECEIVE_SIGNAL: string = 'receive_switch_value';
    public static FEEDBACK_MODE_RECEIVE_SIGNAL_VALUE: string = '50000'; 
    public static FEEDBACK_MODE_ATTRIBUTE: string = 'feedbackMode';    
    public static FEEDBACK_MODE_ATTRIBUTE_VALUE: string = 'submit';   
    public static HTML_TEMPLATE_FEEDBACK_MODE: string = '<ch5-slider id="slider" feedbackMode="submit" range="true" sendEventOnChange="send_signal_on_submit" receiveStateValueHigh="receive_switch_value"></ch5-slider>' +
                                                        '<button id="btn_automated">Submit</button>';
    public static JS_TEMPLATE_FEEDBACK_MODE: string = 'var button = document.getElementById("btn_automated"); var slider = document.getElementById("slider"); button.addEventListener("click", function(e){ slider.submit();});'

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-slider id="id-el" ></ch5-slider>';

    public static CUSTOM_CLASS_CLASS: string = 'box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-slider customClass="box" ></ch5-slider>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-slider customStyle="border:1px solid red;" ></ch5-slider>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-slider show="false" ></ch5-slider>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-slider noshowType="visibility" ></ch5-slider>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-slider disabled="true" ></ch5-slider>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-slider  receiveStateCustomClass="custom_signal"></ch5-slider>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-slider  receiveStateStyleClass="custom_style_signal"></ch5-slider>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-slider show="false"  receiveStateShow="show_signal"></ch5-slider>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-slider show="false"  receiveStateShowPulse="show_pulse_signal"></ch5-slider>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-slider  receiveStateHidePulse="hide_pulse_signal"></ch5-slider>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-slider  receiveStateEnable="enable_signal"></ch5-slider>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-slider sendEventOnShow="signal_on_show" show="false"  receiveStateShowPulse="trigger_1"></ch5-slider>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

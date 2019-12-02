// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class OverlayPanelData {

    public static GENERATED_OVERLAY_PANEL: string = 'div.content.preview > ch5-overlay-panel:nth-child(1)';
    public static GENERATED_OVERLAY_PANEL_INNER_HTML: string = 'div.content.preview > ch5-overlay-panel:nth-child(1) > div:nth-child(1)';
  
    public static CLOSABLE_CLASS: string = 'ch5-overlay-panel-close-icon-btn';
    public static CLOSABLE_ATTRIBUTE: string = 'closable';    
    public static HTML_TEMPLATE_CLOSABLE: string = '<ch5-overlay-panel show="true" closable customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static CLOSE_ICON_CLASS: string = 'ch5-overlay-panel-close-icon';
    public static CLOSE_ICON_ATTRIBUTE: string = 'closeIcon'; 
    public static CLOSE_ICON_ATTRIBUTE_VALUE: string = 'fas fa-power-off';   
    public static HTML_TEMPLATE_CLOSE_ICON: string = '<ch5-overlay-panel show="true" closable closeIcon="fas fa-power-off" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static DISMISSABLE_ATTRIBUTE: string = 'dismissable'; 
    public static DISMISSABLE_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISMISSABLE: string = '<ch5-overlay-panel show="true" dismissable="true" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static OVERFLOW_CLASS: string = 'ch5-overlay-panel--overflow-scroll';
    public static OVERFLOW_ATTRIBUTE: string = 'overflow';  
    public static OVERFLOW_ATTRIBUTE_VALUE: string = 'scroll';
    public static HTML_TEMPLATE_OVERFLOW: string = '<ch5-overlay-panel show="true" overflow="scroll" customClass="box" customStyle="width:100px;height:150px;"><p>Sample text</p></ch5-overlay-panel>';
     
    public static POSITION_TO_ATTRIBUTE: string = 'positionTo';  
    public static POSITION_TO_ATTRIBUTE_VALUE: string = 'ref-el1';
    public static HTML_TEMPLATE_POSITION_TO: string = '<ch5-overlay-panel show="true" positionTo="ref-el1" customClass="box" ><p>Sample text</p></ch5-overlay-panel><div id="ref-el1" style="border:1px solid blue; width:200px; height: 25px"></div>';

    public static POSITION_OFFSET_ATTRIBUTE: string = 'positionOffset';  
    public static POSITION_OFFSET_ATTRIBUTE_VALUE: string = 'top-right';
    public static HTML_TEMPLATE_POSITION_OFFSET: string = '<ch5-overlay-panel show="true" positionOffset="top-right" positionTo="ref-el1" customClass="box" ><p>Sample text</p></ch5-overlay-panel><div id="ref-el1" style="border:1px solid blue; width:200px; height: 25px"></div>';

    public static STRETCH_CLASS: string = 'width:';
    public static STRETCH_ATTRIBUTE: string = 'stretch';  
    public static STRETCH_ATTRIBUTE_VALUE: string = 'width';
    public static HTML_TEMPLATE_STRETCH: string = '<ch5-overlay-panel show="true" stretch="width" customClass="box"><p>Sample text</p></ch5-overlay-panel>';
   
    public static RECEIVE_SIGNAL_POSITION_TO_VALUE: string = 'el-id';
    public static RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE: string = 'receiveStatePositionTo';  
    public static RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE_VALUE: string = 'sig_pos_to';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_POSITION_TO: string =    '<ch5-overlay-panel show="true" receiveStatePositionTo="sig_pos_to" positionTo="el-id" customClass="box" receiveStateHidePulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<ch5-button label="Position To" id="el-id" sendEventOnClick="trigger_1"></ch5-button>'; 
                                                                        
    public static RECEIVE_SIGNAL_POSITION_OFFSET_VALUE: string = 'el-id';
    public static RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE: string = 'receiveStatePositionOffset';  
    public static RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE_VALUE: string = 'sig_pos_offset';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_POSITION_OFFSET: string =    '<ch5-overlay-panel show="true" receiveStatePositionOffset="sig_pos_offset" positionTo="el-id" customClass="box" receiveStateHidePulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                            '<ch5-button label="Position Offset" id="el-id" sendEventOnClick="trigger_1"></ch5-button>';                                                                                                                                            

    public static SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE: string = 'sendEventOnBeforeShow';  
    public static SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_before_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_SHOW: string =    '<ch5-overlay-panel show="false" sendEventOnBeforeShow="signal_on_before_show" customClass="box" receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<ch5-button label="Show overlay" sendEventOnClick="trigger_1"></ch5-button>';                                                              

    public static SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE: string = 'sendEventOnAfterShow';  
    public static SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_after_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_SHOW: string =     '<ch5-overlay-panel show="false" sendEventOnAfterShow="signal_on_after_show" customClass="box" receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<ch5-button label="Show overlay" sendEventOnClick="trigger_1"></ch5-button>';  
                                                                        
    public static SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE: string = 'sendEventOnBeforeHide';  
    public static SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE_VALUE: string = 'signal_on_before_hide';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_HIDE: string =    '<ch5-overlay-panel show="false" sendEventOnBeforeHide="signal_on_before_hide" customClass="box" receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<ch5-button label="Show overlay" sendEventOnClick="trigger_1"></ch5-button>';   

    public static SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE: string = 'sendEventOnAfterHide';  
    public static SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE_VALUE: string = 'signal_on_after_hide';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_HIDE: string =     '<ch5-overlay-panel show="false" sendEventOnAfterHide="signal_on_after_hide" customClass="box" receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<ch5-button label="Show overlay" sendEventOnClick="trigger_1"></ch5-button>';
                                                                        
    public static EVENT_TRIGGERED: string = 'Event triggered!';
    public static EVENT_NOT_TRIGGERED: string = 'Waiting for event...';  
    public static GENERATED_BTN_TRIGGER: string = 'div.content.preview > ch5-button';
    public static GENERATED_BTN_EVENT: string = '#btn';
    public static HTML_TEMPLATE_SHOW_EVENT: string =    '<ch5-overlay-panel id="elem-id" receiveStateShowPulse="trigger_1"></ch5-overlay-panel><br><br/><br><br/>' +
                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_SHOW_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("show", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_HIDE_EVENT: string =    '<ch5-overlay-panel id="elem-id" receiveStateShowPulse="trigger_1"></ch5-overlay-panel><br><br/><br><br/>' +
                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_HIDE_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("hide", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_BEFORE_SHOW_EVENT: string = '<ch5-overlay-panel id="elem-id" receiveStateShowPulse="trigger_1"></ch5-overlay-panel><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_BEFORE_SHOW_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("beforeShow", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_AFTER_SHOW_EVENT: string =  '<ch5-overlay-panel id="elem-id" receiveStateShowPulse="trigger_1"></ch5-overlay-panel><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_AFTER_SHOW_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("afterShow", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_BEFORE_HIDE_EVENT: string = '<ch5-overlay-panel id="elem-id" receiveStateShowPulse="trigger_1"></ch5-overlay-panel><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_BEFORE_HIDE_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("beforeHide", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_AFTER_HIDE_EVENT: string =  '<ch5-overlay-panel id="elem-id" receiveStateShowPulse="trigger_1"></ch5-overlay-panel><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_AFTER_HIDE_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("afterHide", function(){ btn.innerHTML = "Event triggered!"});';
    
    
    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-overlay-panel show="true" id="id-el" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static CUSTOM_CLASS_CLASS: string = 'ch5-overlay-panel box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-overlay-panel show="true" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-overlay-panel show="true" customStyle="border:1px solid red;" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-overlay-panel show="false" customClass="box"><p>Sample text</p></ch5-overlay-panel>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-overlay-panel show="true" noshowType="visibility" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-overlay-panel show="true" disabled="true" customClass="box"><p>Sample text</p></ch5-overlay-panel>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-overlay-panel show="true" customClass="box" receiveStateCustomClass="custom_signal"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<br><br><br><br><ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-overlay-panel show="true" customClass="box" receiveStateStyleClass="custom_style_signal"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<br><br><br><br><ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-overlay-panel show="false" customClass="box" receiveStateShow="show_signal"><p>Sample text</p></ch5-overlay-panel>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-overlay-panel show="false" customClass="box" receiveStateShowPulse="show_pulse_signal"><p>Sample text</p></ch5-overlay-panel>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-overlay-panel show="true" customClass="box" receiveStateHidePulse="hide_pulse_signal"><p>Sample text</p></ch5-overlay-panel>'+
                                                                    '<br><br><br><br><ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-overlay-panel show="true" customClass="box" receiveStateEnable="enable_signal"><p>Sample text</p></ch5-overlay-panel>'+
                                                                '<br><br><br><br><ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-overlay-panel sendEventOnShow="signal_on_show" show="false" customClass="box" receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-overlay-panel>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}                                                                        

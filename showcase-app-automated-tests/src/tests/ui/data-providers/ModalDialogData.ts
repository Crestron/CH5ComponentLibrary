// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class ModalDialogData {

    public static GENERATED_MODAL_DIALOG: string = 'div.content.preview > ch5-modal-dialog:nth-child(1)';
    public static GENERATED_MODAL_DIALOG_INNER_HTML: string = 'div.content.preview > ch5-modal-dialog:nth-child(1) > div:nth-child(1)';
  
    public static CLOSABLE_CLASS: string = 'ch5-modal-dialog-close-icon-btn';
    public static CLOSABLE_ATTRIBUTE: string = 'closable';    
    public static HTML_TEMPLATE_CLOSABLE: string = '<ch5-modal-dialog closable show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static CLOSE_ICON_CLASS: string = 'ch5-modal-dialog-close-icon';
    public static CLOSE_ICON_ATTRIBUTE: string = 'closeIcon'; 
    public static CLOSE_ICON_ATTRIBUTE_VALUE: string = 'fas fa-power-off';   
    public static HTML_TEMPLATE_CLOSE_ICON: string = '<ch5-modal-dialog closable closeIcon="fas fa-power-off" show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static DISMISSABLE_ATTRIBUTE: string = 'dismissable'; 
    public static DISMISSABLE_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISMISSABLE: string = '<ch5-modal-dialog show="true" dismissable="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static MASK_CLASS: string = 'ch5-modal-dialog-mask ch5-modal-dialog-mask-default-style';
    public static MASK: string = 'ch5-modal-dialog > div.ch5-modal-dialog-mask.ch5-modal-dialog-mask-default-style';
    public static MASK_ATTRIBUTE: string = 'mask';  
    public static HTML_TEMPLATE_MASK: string = '<ch5-modal-dialog mask show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static MASK_STYLE_CLASS: string = 'background: rgba(200, 150, 100, 0.3);';
    public static MASK_STYLE_ATTRIBUTE: string = 'maskStyle';  
    public static MASK_STYLE_ATTRIBUTE_VALUE: string = 'background:rgba(200,150,100,0.3);';
    public static HTML_TEMPLATE_MASK_STYLE: string = '<ch5-modal-dialog mask maskStyle="background:rgba(200,150,100,0.3);" show="true"><p>Sample text</p></ch5-modal-dialog>';

    public static OVERFLOW_CLASS: string = 'ch5-modal-dialog--overflow-scroll';
    public static OVERFLOW_ATTRIBUTE: string = 'overflow';  
    public static OVERFLOW_ATTRIBUTE_VALUE: string = 'scroll';
    public static HTML_TEMPLATE_OVERFLOW: string = '<ch5-modal-dialog overflow="scroll"  customStyle="width:100px;height:150px;" show="true"><p>Sample text</p></ch5-modal-dialog>';
     
    public static WIDTH_STYLE: string = 'width: 250px;';
    public static WIDTH_ATTRIBUTE: string = 'width';  
    public static WIDTH_ATTRIBUTE_VALUE: string = '250px';
    public static HTML_TEMPLATE_WIDTH: string = '<ch5-modal-dialog show="true" width="250px" ><p>Sample text</p></ch5-modal-dialog>';

    public static HEIGHT_STYLE: string = 'height: 400px;';
    public static HEIGHT_ATTRIBUTE: string = 'height';  
    public static HEIGHT_ATTRIBUTE_VALUE: string = '400px';
    public static HTML_TEMPLATE_HEIGHT: string = '<ch5-modal-dialog show="true" height="400px" ><p>Sample text</p></ch5-modal-dialog>';
    
    public static POSITION_TO_ATTRIBUTE: string = 'positionTo';  
    public static POSITION_TO_ATTRIBUTE_VALUE: string = 'ref-el1';
    public static HTML_TEMPLATE_POSITION_TO: string = '<ch5-modal-dialog positionTo="ref-el1" show="true" ><p>Sample text</p></ch5-modal-dialog><div id="ref-el1" style="border:1px solid blue; width:200px; height: 25px"></div>';

    public static POSITION_OFFSET_ATTRIBUTE: string = 'positionOffset';  
    public static POSITION_OFFSET_ATTRIBUTE_VALUE: string = 'top-right';
    public static HTML_TEMPLATE_POSITION_OFFSET: string = '<ch5-modal-dialog positionOffset="top-right" positionTo="ref-el1" show="true" ><p>Sample text</p></ch5-modal-dialog><div id="ref-el1" style="border:1px solid blue; width:200px; height: 25px"></div>';

    public static STRETCH_CLASS: string = 'width:';
    public static STRETCH_ATTRIBUTE: string = 'stretch';  
    public static STRETCH_ATTRIBUTE_VALUE: string = 'width';
    public static HTML_TEMPLATE_STRETCH: string = '<ch5-modal-dialog stretch="width" show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static GENERATED_TITLE: string = 'div.content.preview > ch5-modal-dialog > div > div.ch5-modal-dialog-header';
    public static TITLE_CLASS: string = 'ch5-modal-dialog-header';
    public static TITLE_ATTRIBUTE: string = 'title';  
    public static TITLE_ATTRIBUTE_VALUE: string = 'A sample modal dialog';
    public static HTML_TEMPLATE_TITLE: string = '<ch5-modal-dialog show="true" title="A sample modal dialog"><p>Sample text</p></ch5-modal-dialog>';

    public static GENERATED_BTN_OK: string = 'div.content.preview > ch5-modal-dialog > div.ch5-modal-dialog > div.ch5-modal-dialog-footer > .ch5-modal-dialog-btn-ok';
    public static HIDE_OK_BTN_CLASS: string = 'ch5-modal-dialog-btn-ok';
    public static HIDE_OK_BTN_ATTRIBUTE: string = 'hideOkButton';  
    public static HIDE_OK_BTN_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_HIDE_OK_BTN: string = '<ch5-modal-dialog show="true" hideOkButton="true"><p>Sample text</p></ch5-modal-dialog>';

    public static GENERATED_BTN_CANCEL: string = 'div.content.preview > ch5-modal-dialog > div.ch5-modal-dialog > div.ch5-modal-dialog-footer > .ch5-modal-dialog-btn-cancel';
    public static HIDE_CANCEL_BTN_CLASS: string = 'ch5-modal-dialog-btn-cancel';
    public static HIDE_CANCEL_BTN_ATTRIBUTE: string = 'hideCancelButton';  
    public static HIDE_CANCEL_BTN_ATTRIBUTE_VALUE: string = 'true';
    public static HTML_TEMPLATE_HIDE_CANCEL_BTN: string = '<ch5-modal-dialog show="true" hideCancelButton="true"><p>Sample text</p></ch5-modal-dialog>';
 
    public static OK_BTN_LABEL_ATTRIBUTE: string = 'okButtonLabel';  
    public static OK_BTN_LABEL_ATTRIBUTE_VALUE: string = 'Confirm';
    public static HTML_TEMPLATE_OK_BTN_LABEL: string = '<ch5-modal-dialog show="true" okButtonLabel="Confirm"><p>Sample text</p></ch5-modal-dialog>';

    public static OK_BTN_ICON_CLASS: string = 'ch5-button--icon';
    public static OK_BTN_ICON_ATTRIBUTE: string = 'okButtonIcon';  
    public static OK_BTN_ICON_ATTRIBUTE_VALUE: string = 'fas fa-plus';
    public static HTML_TEMPLATE_OK_BTN_ICON: string = '<ch5-modal-dialog show="true" okButtonIcon="fas fa-plus"><p>Sample text</p></ch5-modal-dialog>';
   
    public static OK_BTN_STYLE_CLASS: string = 'color:#333;background:#efefef';
    public static OK_BTN_STYLE_ATTRIBUTE: string = 'okButtonStyle';  
    public static OK_BTN_STYLE_ATTRIBUTE_VALUE: string = 'color:#333;background:#efefef';
    public static HTML_TEMPLATE_OK_BTN_STYLE: string = '<ch5-modal-dialog show="true" okButtonStyle="color:#333;background:#efefef"><p>Sample text</p></ch5-modal-dialog>';

    public static CANCEL_BTN_LABEL_ATTRIBUTE: string = 'cancelButtonLabel';  
    public static CANCEL_BTN_LABEL_ATTRIBUTE_VALUE: string = 'Ignore';
    public static HTML_TEMPLATE_CANCEL_BTN_LABEL: string = '<ch5-modal-dialog show="true" cancelButtonLabel="Ignore"><p>Sample text</p></ch5-modal-dialog>';

    public static CANCEL_BTN_ICON_CLASS: string = 'ch5-button--icon';
    public static CANCEL_BTN_ICON_ATTRIBUTE: string = 'cancelButtonIcon';  
    public static CANCEL_BTN_ICON_ATTRIBUTE_VALUE: string = 'fas fa-plus';
    public static HTML_TEMPLATE_CANCEL_BTN_ICON: string = '<ch5-modal-dialog show="true" cancelButtonIcon="fas fa-plus"><p>Sample text</p></ch5-modal-dialog>';
   
    public static CANCEL_BTN_STYLE_CLASS: string = 'color:#333;background:#efefef';
    public static CANCEL_BTN_STYLE_ATTRIBUTE: string = 'cancelButtonStyle';  
    public static CANCEL_BTN_STYLE_ATTRIBUTE_VALUE: string = 'color:#333;background:#efefef';
    public static HTML_TEMPLATE_CANCEL_BTN_STYLE: string = '<ch5-modal-dialog show="true" cancelButtonStyle="color:#333;background:#efefef"><p>Sample text</p></ch5-modal-dialog>';

    public static PROMPT_CLASS: string = 'ch5-modal-dialog-prompt-text';
    public static PROMPT_ATTRIBUTE: string = 'prompt';  
    public static PROMPT_ATTRIBUTE_VALUE: string = 'Optional text';
    public static HTML_TEMPLATE_PROMPT: string = '<ch5-modal-dialog show="true" prompt="Optional text"><p>Sample text</p></ch5-modal-dialog>';

    public static PROMPT_ICON_CLASS: string = 'ch5-modal-dialog-prompt-icon';
    public static PROMPT_ICON_ATTRIBUTE: string = 'promptIcon';  
    public static PROMPT_ICON_ATTRIBUTE_VALUE: string = 'http://via.placeholder.com/350x150';
    public static HTML_TEMPLATE_PROMPT_ICON: string = '<ch5-modal-dialog show="true" promptIcon="http://via.placeholder.com/350x150"><p>Sample text</p></ch5-modal-dialog>';

    public static RECEIVE_SIGNAL_POSITION_TO_VALUE: string = 'el-id';
    public static RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE: string = 'receiveStatePositionTo';  
    public static RECEIVE_SIGNAL_POSITION_TO_ATTRIBUTE_VALUE: string = 'sig_pos_to';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_POSITION_TO: string =    '<ch5-modal-dialog show="true" receiveStatePositionTo="sig_pos_to" positionTo="el-id"  receiveStateHidePulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Position To" id="el-id" sendEventOnClick="trigger_1"></ch5-button>'; 
                                                                        
    public static RECEIVE_SIGNAL_POSITION_OFFSET_VALUE: string = 'el-id';
    public static RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE: string = 'receiveStatePositionOffset';  
    public static RECEIVE_SIGNAL_POSITION_OFFSET_ATTRIBUTE_VALUE: string = 'sig_pos_offset';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_POSITION_OFFSET: string =    '<ch5-modal-dialog show="true" receiveStatePositionOffset="sig_pos_offset" positionTo="el-id"  receiveStateHidePulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                            '<ch5-button label="Position Offset" id="el-id" sendEventOnClick="trigger_1"></ch5-button>';                                                                                                                                            

    public static SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE: string = 'sendEventOnBeforeShow';  
    public static SEND_SIGNAL_ON_BEFORE_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_before_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_SHOW: string =    '<ch5-modal-dialog show="false" sendEventOnBeforeShow="signal_on_before_show"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Show modal" sendEventOnClick="trigger_1"></ch5-button>';                                                              

    public static SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE: string = 'sendEventOnAfterShow';  
    public static SEND_SIGNAL_ON_AFTER_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_after_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_SHOW: string =     '<ch5-modal-dialog show="false" sendEventOnAfterShow="signal_on_after_show"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Show modal" sendEventOnClick="trigger_1"></ch5-button>';  
                                                                        
    public static SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE: string = 'sendEventOnBeforeHide';  
    public static SEND_SIGNAL_ON_BEFORE_HIDE_ATTRIBUTE_VALUE: string = 'signal_on_before_hide';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_BEFORE_HIDE: string =    '<ch5-modal-dialog show="false" sendEventOnBeforeHide="signal_on_before_hide"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Show modal" sendEventOnClick="trigger_1"></ch5-button>';   

    public static SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE: string = 'sendEventOnAfterHide';  
    public static SEND_SIGNAL_ON_AFTER_HIDE_ATTRIBUTE_VALUE: string = 'signal_on_after_hide';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_AFTER_HIDE: string =     '<ch5-modal-dialog show="false" sendEventOnAfterHide="signal_on_after_hide"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Show modal" sendEventOnClick="trigger_1"></ch5-button>';

    public static SEND_SIGNAL_ON_OK_ATTRIBUTE: string = 'sendEventOnOk';  
    public static SEND_SIGNAL_ON_OK_ATTRIBUTE_VALUE: string = 'signal_on_ok';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_OK: string =     '<ch5-modal-dialog show="true" sendEventOnOk="signal_on_ok"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                '<ch5-button label="Show modal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                        
    public static SEND_SIGNAL_ON_CANCEL_ATTRIBUTE: string = 'sendEventOnCancel';  
    public static SEND_SIGNAL_ON_CANCEL_ATTRIBUTE_VALUE: string = 'signal_on_cancel';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_CANCEL: string =     '<ch5-modal-dialog show="true" sendEventOnCancel="signal_on_cancel"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                    '<ch5-button label="Show modal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    public static EVENT_TRIGGERED: string = 'Event triggered!';
    public static EVENT_NOT_TRIGGERED: string = 'Waiting for event...';
    public static GENERATED_BTN_TRIGGER: string = 'div.content.preview > ch5-button';   
    public static GENERATED_BTN_EVENT: string = '#btn';
    public static HTML_TEMPLATE_SHOW_EVENT: string =    '<ch5-modal-dialog id="elem-id" receiveStateShowPulse="trigger_1"></ch5-modal-dialog><br><br/><br><br/>' +
                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_SHOW_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("show", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_HIDE_EVENT: string =    '<ch5-modal-dialog id="elem-id" receiveStateShowPulse="trigger_1"></ch5-modal-dialog><br><br/><br><br/>' +
                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_HIDE_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("hide", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_BEFORE_SHOW_EVENT: string = '<ch5-modal-dialog id="elem-id" receiveStateShowPulse="trigger_1"></ch5-modal-dialog><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_BEFORE_SHOW_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("beforeShow", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_AFTER_SHOW_EVENT: string =  '<ch5-modal-dialog id="elem-id" receiveStateShowPulse="trigger_1"></ch5-modal-dialog><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_AFTER_SHOW_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("afterShow", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_BEFORE_HIDE_EVENT: string = '<ch5-modal-dialog id="elem-id" receiveStateShowPulse="trigger_1"></ch5-modal-dialog><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_BEFORE_HIDE_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("beforeHide", function(){ btn.innerHTML = "Event triggered!"});';

    public static HTML_TEMPLATE_AFTER_HIDE_EVENT: string =  '<ch5-modal-dialog id="elem-id" receiveStateShowPulse="trigger_1"></ch5-modal-dialog><br><br/><br><br/>' +
                                                            '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button> <button id="btn">Waiting for event...</button>'
    public static JS_TEMPLATE_AFTER_HIDE_EVENT: string =  'var v = document.getElementById("elem-id"); var btn = document.getElementById("btn"); v.addEventListener("afterHide", function(){ btn.innerHTML = "Event triggered!"});';

    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-modal-dialog id="id-el" show="true"><p>Sample text</p></ch5-modal-dialog>';

    public static CUSTOM_CLASS_CLASS: string = 'ch5-modal-dialog box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-modal-dialog customClass="box" show="true"><p>Sample text</p></ch5-modal-dialog>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-modal-dialog customStyle="border:1px solid red;"show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-modal-dialog show="false" ><p>Sample text</p></ch5-modal-dialog>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-modal-dialog noshowType="visibility" show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-modal-dialog disabled="true" show="true" ><p>Sample text</p></ch5-modal-dialog>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-modal-dialog show="true" receiveStateCustomClass="custom_signal"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-modal-dialog show="true" receiveStateStyleClass="custom_style_signal"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-modal-dialog show="false"  receiveStateShow="show_signal"><p>Sample text</p></ch5-modal-dialog>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-modal-dialog show="false"  receiveStateShowPulse="show_pulse_signal"><p>Sample text</p></ch5-modal-dialog>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-modal-dialog show="true" receiveStateHidePulse="hide_pulse_signal"><p>Sample text</p></ch5-modal-dialog>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-modal-dialog show="true" receiveStateEnable="enable_signal"><p>Sample text</p></ch5-modal-dialog>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-modal-dialog sendEventOnShow="signal_on_show" show="false"  receiveStateShowPulse="trigger_1"><p>Sample text</p></ch5-modal-dialog>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}                                                                        

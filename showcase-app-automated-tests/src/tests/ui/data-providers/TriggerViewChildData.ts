// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class TriggerViewChildData {

    public static GENERATED_TRIGGERVIEW: string = 'div.content.preview > ch5-triggerview:nth-child(1)';
    public static GENERATED_FIRST_TRIGGERVIEW_CHILD: string = 'div.content.preview > ch5-triggerview:nth-child(1) > div.swiper-container > div.swiper-wrapper > ch5-triggerview-child:nth-child(1)';
    public static GENERATED_SECOND_TRIGGERVIEW_CHILD: string = 'div.content.preview > ch5-triggerview:nth-child(1) > div.swiper-container > div.swiper-wrapper > ch5-triggerview-child:nth-child(2)';
    public static PREVIOUS_VIEW_BTN: string = '#prev';
    public static NEXT_VIEW_BTN: string = '#next';
    public static IS_SELECTED: string = 'aria-selected="true"';

    public static RECEIVE_SIGNAL_SHOW_CHILD_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_CHILD_ATTRIBUTE_VALUE: string = 'show_second_view_signal';
    public static RECEIVE_SIGNAL_SHOW_CHILD_ATTRIBUTE: string = 'receiveStateShow';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_CHILD: string =   '<ch5-triggerview > <ch5-triggerview-child > <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child receiveStateShow="show_second_view_signal"> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                '<ch5-button label="SendEvent" sendeventonclick="signal"></ch5-button>';
                                                                        
    public static SEND_SIGNAL_ON_SHOW_CHILD_ATTRIBUTE_VALUE: string = 'second_child_is_shown';
    public static SEND_SIGNAL_ON_SHOW_CHILD_ATTRIBUTE: string = 'sendEventOnShow';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW_CHILD: string =  '<ch5-triggerview id="demo" sendSignalShowChildIndex="send_index_view"> <ch5-triggerview-child> <h1>First View</h1> </ch5-triggerview-child> <ch5-triggerview-child sendEventOnShow="second_child_is_shown"> <h1>Second View</h1></ch5-triggerview-child></ch5-triggerview>' +
                                                                        '<ch5-button id="prev" label="prev"></ch5-button><ch5-button id="next" label="next"></ch5-button>';                                                                        
    public static JS_TEMPLATE_SEND_SIGNAL_ON_SHOW_CHILD: string = 'var demo = document.getElementById("demo"); var prev = document.getElementById("prev"); var next = document.getElementById("next"); prev.addEventListener("click", function() { demo.previousViewChild(); }); next.addEventListener("click", function() { demo.nextViewChild(); });'                                                                  
   
    // COMMON ATTRIBUTES AND SIGNALS
    public static ID_ATTRIBUTE: string = 'id'; 
    public static ID_ATTRIBUTE_VALUE: string = 'id-el';   
    public static HTML_TEMPLATE_ID: string = '<ch5-triggerview  > <ch5-triggerview-child id="id-el"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static CUSTOM_CLASS_CLASS: string = 'box';
    public static CUSTOM_CLASS_ATTRIBUTE: string = 'customClass'; 
    public static CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'box';   
    public static HTML_TEMPLATE_CUSTOM_CLASS: string = '<ch5-triggerview  > <ch5-triggerview-child customClass="box"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static CUSTOM_STYLE_CLASS: string = 'border: 1px solid red;';
    public static CUSTOM_STYLE_ATTRIBUTE: string = 'customStyle'; 
    public static CUSTOM_STYLE_ATTRIBUTE_VALUE: string = 'border:1px solid red;';   
    public static HTML_TEMPLATE_CUSTOM_STYLE: string = '<ch5-triggerview  > <ch5-triggerview-child customStyle="border:1px solid red;"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static SHOW_ATTRIBUTE: string = 'show'; 
    public static SHOW_ATTRIBUTE_VALUE: string = 'false';   
    public static HTML_TEMPLATE_SHOW: string = '<ch5-triggerview  > <ch5-triggerview-child show="false"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';
    
    public static NOSHOW_TYPE_ATTRIBUTE: string = 'noshowType'; 
    public static NOSHOW_TYPE_ATTRIBUTE_VALUE: string = 'visibility';   
    public static HTML_TEMPLATE_NOSHOW_TYPE: string = '<ch5-triggerview  > <ch5-triggerview-child noshowType="visibility"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static DISABLED_ATTRIBUTE: string = 'disabled'; 
    public static DISABLED_ATTRIBUTE_VALUE: string = 'true';   
    public static HTML_TEMPLATE_DISABLED: string = '<ch5-triggerview  > <ch5-triggerview-child disabled="true"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>';

    public static RECEIVE_SIGNAL_CUSTOM_CLASS_VALUE: string = 'box';
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE: string = 'receiveStateCustomClass';  
    public static RECEIVE_SIGNAL_CUSTOM_CLASS_ATTRIBUTE_VALUE: string = 'custom_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_CUSTOM_CLASS: string =   '<ch5-triggerview > <ch5-triggerview-child receiveStateCustomClass="custom_signal" > <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_STYLE_CLASS_VALUE: string = 'border:1px solid red;';
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE: string = 'receiveStateStyleClass';  
    public static RECEIVE_SIGNAL_STYLE_CLASS_ATTRIBUTE_VALUE: string = 'custom_style_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_STYLE_CLASS: string =    '<ch5-triggerview  > <ch5-triggerview-child receiveStateStyleClass="custom_style_signal"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
                                                                      
    public static RECEIVE_SIGNAL_SHOW_VALUE: boolean = true;
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE: string = 'receiveStateShow';  
    public static RECEIVE_SIGNAL_SHOW_ATTRIBUTE_VALUE: string = 'show_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW: string =   '<ch5-triggerview  > <ch5-triggerview-child show="false" receiveStateShow="show_signal"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';     

    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE: string = 'receiveStateShowPulse';  
    public static RECEIVE_SIGNAL_SHOW_PULSE_ATTRIBUTE_VALUE: string = 'show_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_SHOW_PULSE: string =     '<ch5-triggerview  > <ch5-triggerview-child show="false" receiveStateShowPulse="show_pulse_signal"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                        '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';    

    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE: string = 'receiveStateHidePulse';  
    public static RECEIVE_SIGNAL_HIDE_PULSE_ATTRIBUTE_VALUE: string = 'hide_pulse_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_HIDE_PULSE: string = '<ch5-triggerview > <ch5-triggerview-child receiveStateHidePulse="hide_pulse_signal" > <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                    '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';

    public static RECEIVE_SIGNAL_ENABLE_VALUE: boolean = true;                                                                
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE: string = 'receiveStateEnable';  
    public static RECEIVE_SIGNAL_ENABLE_ATTRIBUTE_VALUE: string = 'enable_signal';
    public static HTML_TEMPLATE_RECEIVE_SIGNAL_ENABLE: string = '<ch5-triggerview  > <ch5-triggerview-child receiveStateEnable="enable_signal"> <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';                                                                        
    
    public static SEND_SIGNAL_ON_SHOW_VALUE: boolean = true;                                                            
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE: string = 'sendEventOnShow';  
    public static SEND_SIGNAL_ON_SHOW_ATTRIBUTE_VALUE: string = 'signal_on_show';
    public static HTML_TEMPLATE_SEND_SIGNAL_ON_SHOW: string =   '<ch5-triggerview > <ch5-triggerview-child sendEventOnShow="signal_on_show" show="false" receiveStateShowPulse="trigger_1" > <h1>First View</h1> </ch5-triggerview-child></ch5-triggerview>'+
                                                                '<ch5-button label="Send Signal" sendEventOnClick="trigger_1"></ch5-button>';
}

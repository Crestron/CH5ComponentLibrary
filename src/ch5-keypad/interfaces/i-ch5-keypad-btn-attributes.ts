// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Keypad Button
 * @isattribute false
 * @tagName ch5-keypad-button
 * @role container
 * @description Ch5 Keypad Button offers an approach to customize the child buttons within a keypad.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-keypad-button` element",
 * "***",
 * "The Keypad Child Button component is used to customize the button labels or icon."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-keypad-button:basic",
 *     "description": "Crestron Keypad Child Button",
 *     "body": [
 *       "<ch5-keypad-button key=\"button${1:Button_Key}\">",
 *       "</ch5-keypad-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad-button:labels",
 *     "description": "Crestron Keypad Child Button",
 *     "body": [
 *       "<ch5-keypad-button key=\"button${1:Button_Key}\"",
 *       "\tlabelmajor=\"${2:Label_Major}\"",
 *       "\tlabelminor=\"${3:Label_Minor}\"",
 *        ">",
 *       "</ch5-keypad-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad-button:iconclass",
 *     "description": "Crestron Keypad Child Button",
 *     "body": [
 *       "<ch5-keypad-button key=\"button${1:Button_Key}\"",
 *       "\ticonclass=\"${2:Icon_Class}\"",
 *        ">",
 *       "</ch5-keypad-button>$0"
 *     ]
 *   }
 * ]
 * 
 */
export interface ICh5KeypadButtonAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`labelMajor` attribute",
     * "***",
     * "Defines the primary/major text value of the button."
     * ]
     * @name labelMajor
     * @attributeType "string"
     */
    labelMajor: string;

    /**
     * @documentation
     * [
     * "`labelMinor` attribute",
     * "***",
     * "Defines the secondary/minor text value of the button."
     * ]
     * @name labelMinor
     * @attributeType "string"
     */
    labelMinor: string;

    /**
     * @documentation
     * [
     * "`iconClass` attribute",
     * "***",
     * "Defines the secondary/minor text value of the button."
     * ]
     * @name iconClass
     * @attributeType "iconClass"
     */
    iconClass: string;

    /**
     * @documentation
     * [
     * "`key` attribute",
     * "***",
     * "Defines the key value of the button."
     * ]
     * @name key
     * @attributeType "string"
     */
     key: string;

    /**
     * @documentation
     * [
     * "`sendEventOnClick` attribute",
     * "***",
     * "Sends an event on click or tap (mouse or swipe up and down quickly).",
     * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event.",
     * "Examples include the SIMPL Logic Symbol for Toggle a with description of ",
     * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
     * ]
     * @name sendEventOnClick
     * @attributeType "join"
     */
    sendEventOnClick: string;
    
    /**
     * @documentation
     * [
     * "`pressed` attribute",
     * "***",
     * "The default value is false.",
     * "This property reflects the pressed state of the component. If set to true, ",
     * "'keypad-btn-pressed' will be applied as the CSS class on the component."
     * ]
     * @name pressed
     * @default false
     * @attributeType "boolean"
     */
    pressed: boolean;
}
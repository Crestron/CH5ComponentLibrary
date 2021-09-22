// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Keypad Child Button
 * @isattribute false
 * @tagName ch5-keypad-child-button
 * @role container
 * @description Ch5 Keypad Child Button offers an approach to customize the child buttons within a keypad.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-keypad-child-button` element",
 * "***",
 * "The Keypad Child Button component is used to customize the button labels or icon."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-keypad-child-button:basic",
 *     "description": "Crestron Keypad Child Button",
 *     "body": [
 *       "<ch5-keypad-child-button key=\"button${1:Button_Key}\">",
 *       "</ch5-keypad-child-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad-child-button:labels",
 *     "description": "Crestron Keypad Child Button",
 *     "body": [
 *       "<ch5-keypad-child-button key=\"button${1:Button_Key}\"",
 *       "\tlabelmajor=\"${2:Label_Major}\"",
 *       "\tlabelminor=\"${3:Label_Minor}\"",
*        ">",
 *       "</ch5-keypad-child-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad-child-button:iconclass",
 *     "description": "Crestron Keypad Child Button",
 *     "body": [
 *       "<ch5-keypad-child-button key=\"button${1:Button_Key}\"",
 *       "\ticonclass=\"${2:Icon_Class}\"",
*        ">",
 *       "</ch5-keypad-child-button>$0"
 *     ]
 *   }
 * ]
 * 
 */
export interface ICh5KeypadBtnAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`labelMajor` attribute",
     * "***",
     * "Defines the primary/major text value of the button."
     * ]
     * @name labelMajor
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
     */
    iconClass: string;

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
     */
    sendEventOnClick: string;
}
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
 *       "\tlabelmajor=\"${2:}\"",
 *       "\tlabelminor=\"${3:}\"",
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
 *   },
 *   {
 *      "prefix": "ch5-keypad-button:all-attribute",
 *      "description":"Crestron Keypad Child Button (All attribute)",
 *      "body": [
 *        "<ch5-keypad-button key=\"button${1:Button_Key}\"",
 *        "\tlabelMajor=\"${2:}\"",
 *        "\tlabelMinor=\"${3:}\"",
 *        "\ticonClass=\"${4:}\"",
 *        "\tpressed=\"${5:false}\">",
 *        "</ch5-keypad-button>$0"
 *      ]
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
     * "Defines the primary/major text value of the button.",
     * "Not applicable to the extra button."
     * ]
     * @name labelmajor
     * @attributeType "String"
     * @hideWhen [
     *  { "showExtraButton": true }
     * ]
     */
    labelMajor: string;

    /**
     * @documentation
     * [
     * "`labelMinor` attribute",
     * "***",
     * "Defines the secondary/minor text value of the button.",
     * "Not applicable to the extra button."
     * ]
     * @name labelminor
     * @hideWhen [
     *  { "showExtraButton": true }
     * ]
     * @attributeType "String"
     */
    labelMinor: string;

    /**
     * @documentation
     * [
     * "`iconClass` attribute",
     * "***",
     * "Defines the secondary/minor text value of the button."
     * ]
     * @name iconclass
     * @attributeType "IconClass"
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
     * @attributeType "String"
     */
     key: string;

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
     * @attributeType "Boolean"
     */
    pressed: boolean;
}
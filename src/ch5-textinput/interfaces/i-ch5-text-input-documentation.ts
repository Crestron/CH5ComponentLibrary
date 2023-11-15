// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5TextInputAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Textinput
 * @isattribute false
 * @tagName ch5-textinput
 * @role input
 * @description Ch5 Textinput inherits the default html input behavior, but also provides extra features.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-textinput` attribute",
 * "***",
 * "The TextEntry component allows the user to enter textual input. Extending on a default ",
 * "input HTML element, it allows additional customization like icons, label among others."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-textinput:blank",
 *       "description": "Crestron Textinput (Blank)",
 *       "body": [
 *           "<ch5-textinput>",
 *           "</ch5-textinput>$0"
 *       ]
 *    },
 *    {
 *        "prefix": "ch5-textinput:phone",
 *        "description": "Crestron Textinput phone mask attribute",
 *        "body": [
 *            "<ch5-textinput",
 *            "    label=\"${1:Phone number:}\"",
 *            "    iconClass=\"${2:fa fa-phone}\"",
 *            "    size=\"${3:x-large}\"",
 *            "    placeholder=\"${4:Phone Number}\"",
 *            "    mask=\"${5:(+99) 999 999 999}\"",
 *            "    id=\"${7:phoneNumber}\">",
 *            "</ch5-textinput>"
 *        ]
 *    },
 *    {
 *        "prefix": "ch5-textinput:signals",
 *        "description": "Crestron Textinput phone mask attribute",
 *        "body": [
 *            "<ch5-textinput",
 *            "    label=\"${1:Phone number:}\"",
 *            "    iconClass=\"${2:fa fa-phone}\"",
 *            "    size=\"${3:x-large}\"",
 *            "    placeholder=\"${4:Phone Number}\"",
 *            "    mask=\"${5:(+99) 999 999 999}\"",
 *            "    id=\"${7:phoneNumber}\"",
 *            "    sendEventOnChange=\"${8:input_changed}\"",
 *            "    sendEventOnFocus=\"${9:input_focus}\"",
 *            "    sendEventOnBlur=\"${10:input_blur}\"",
 *            "    sendEventOnEnterKey=\"${11:input_enter_key_event}\"",
 *            "    sendEventOnEscKey=\"${12:input_esc_key_event}\">",
 *            "</ch5-textinput>"
 *        ]
 *    },
 *    {
 *     "prefix": "ch5-textinput:all-attributes",
 *     "description": "Crestron textinput (All Attributes)",
 *     "body": [
 *       "<ch5-textinput id=\"ch5-textinput_${1:id}\"",
 *       "\tmask=\"${2:}\"",
 *       "\ticonClass=\"${3:}\"",
 *       "\ticon=\"${4:}\"",
 *       "\tlabel=\"${5:}\"",
 *       "\tplaceholder=\"${6:}\"",
 *       "\ticonPosition=\"${7:first}\"",
 *       "\ttype=\"${8:text}\"",
 *       "\tminLength=\"${9:0}\"",
 *       "\tmaxLength=\"${10:0}\"",
 *       "\tminValue=\"${11:0}\"",
 *       "\tmaxValue=\"${12:0}\"",
 *       "\tsize=\"${13:regular}\"",
 *       "\ttext-transform=\"${15:none}\"",
 *       "\tscaling=\"${16:false}\"",
 *       "\tminimumFontSize=\"${17:12}\"",
 *       "\ttabIndex=\"${18:0}\"",
 *       "\treceiveStateFocus=\"${19:}\"",
 *       "\treceiveStateValue=\"${20:}\"",
 *       "\tsendEventOnChange=\"${21:}\"",
 *       "\tsendEventOnFocus=\"${22:}\"",
 *       "\tsendEventOnBlur=\"${23:}\"",
 *       "\tvalue=\"${24:}\">",
 *       "</ch5-textinput>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-textinput:default",
 *     "description": "Crestron textinput (default)",
 *     "body": [
 *       "<ch5-textinput id=\"ch5-textinput_${1:id}\"",
 *       "\tmask=\"${2:}\"",
 *       "\ticonClass=\"${3:}\"",
 *       "\ticon=\"${4:}\"",
 *       "\tlabel=\"${5:}\"",
 *       "\tplaceholder=\"${6:}\"",
 *       "\ticonPosition=\"${7:first}\"",
 *       "\ttype=\"${8:text}\"",
 *       "\tminLength=\"${9:0}\"",
 *       "\tmaxLength=\"${10:0}\"",
 *       "\tminValue=\"${11:0}\"",
 *       "\tmaxValue=\"${12:0}\"",
 *       "\tsize=\"${13:regular}\"",
 *       "\ttext-transform=\"${15:none}\"",
 *       "\tscaling=\"${16:false}\"",
 *       "\tminimumFontSize=\"${17:12}\"",
 *       "\ttabIndex=\"${18:0}\"",
 *       "\tvalue=\"${19:}\">",
 *       "</ch5-textinput>$0"
 *       ]
 *    }
 * ]
 * 
 */
export interface ICh5TextInputDocumentation extends ICh5Common, ICh5TextInputAttributes {
}
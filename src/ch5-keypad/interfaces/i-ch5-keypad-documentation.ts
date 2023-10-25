// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../../ch5-common/interfaces";
import { ICh5KeypadAttributes, ICh5KeypadButtonAttributes } from "./index";

/**
 * @name Ch5 Keypad
 * @isattribute false
 * @tagName ch5-keypad
 * @role container
 * @description Ch5 Keypad offers a control set of 12 buttons (+ 1 extra button)
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-keypad` element",
 * "***",
 * "The Keypad component is a flexible numeric keypad that always displays 0-9 like a standard telephone ",
 * "(along with * and #) and also allows for customizable button labels. ",
 * "The Keypad has a default theme associated with it. The extra button can contain customizable icon. ",
 * "Each button can send signals on click / touch events."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-keypad:blank",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad>",
 *       "</ch5-keypad>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:contractbased",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"keypad_${0:id}\"",
 *       "\tcontractname=\"${1:}\"",
 *        ">",
 *       "</ch5-keypad>"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:eventbased",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"keypad_${0:id}\"",
 *       "\tsendeventonclickstart=\"${1:}\"",
 *        ">",
 *       "</ch5-keypad>"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:all-attributes",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"keypad_${0:id}\"",
 *       "\tcontractname=\"${1:}\"",
 *       "\tshape=\"${2:rounded-rectangle}\"",
 *       "\ttype=\"${3:default}\"",
 *       "\ttextorientation=\"${4:top}\"",
 *       "\tshowextrabutton=\"${5:true}\"",
 *       "\treceivestateextrabuttonshow=\"${6:}\"",
 *       "\tusecontractforenable=\"${7:false}\"",
 *       "\tusecontractforshow=\"${8:false}\"",
 *       "\tusecontractforcustomclass=\"${9:false}\"",
 *       "\tusecontractforcustomstyle=\"${10:false}\"",
 *       "\tsendeventonclickstart=\"${11:}\"",
 *       "\thidePoundButton=\"${12:false}\"",
 *       "\thideAsteriskButton=\"${13:false}\"",
 *       "\treceiveStateHideAsteriskButton=\"${14:}\"",
 *       "\treceiveStateHidePoundButton=\"${15:}\"",
 *        ">",
 *       "</ch5-keypad>"
 *     ]
 *   }
 * ]
 */
export interface ICh5KeypadDocumentation extends ICh5Common, ICh5KeypadAttributes {
}
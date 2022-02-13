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
 * @description Ch5 Keypad offers a control set of 5 buttons to preform specific changes
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
 *       "<ch5-keypad id=\"btn_${0:id}\"",
 *       "\tcontractname=\"${1:Contract Name}\"",
 *        ">",
 *       "</ch5-keypad>"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:eventbased",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"btn_${0:id}\"",
 *       "\tsendeventonclickstart=\"${1:Event_Click_Index}\"",
 *        ">",
 *       "</ch5-keypad>"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:all-attributes",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"btn_${0:id}\"",
 *       "\tcontractname=\"${1:Contract Name}\"",
 *       "\tshape=\"${2:Shape}\"",
 *       "\ttype=\"${3:type}\"",
 *       "\tstretch=\"${4:stretch}\"",
 *       "\ttextorientation=\"${5:textOrientation}\"",
 *       "\tshowextrabutton=\"${6:showExtraButton}\"",
 *       "\treceivestateextrabuttonshow=\"${7:receiveStateExtraButtonShow}\"",
 *       "\tusecontractforenable=\"${8:useContractForEnable}\"",
 *       "\tusecontractforshow=\"${9:useContractForShow}\"",
 *       "\tusecontractforcustomclass=\"${10:useContractForCustomClass}\"",
 *       "\tusecontractforcustomstyle=\"${11:useContractForCustomStyle}\"",
 *       "\tsendeventonclickstart=\"${12:sendEventOnClickStart}\"",
 *        ">",
 *       "</ch5-keypad>"
 *     ]
 *   }
 * ]
 */
export interface ICh5KeypadDocumentation extends ICh5Common, ICh5KeypadAttributes, ICh5KeypadButtonAttributes {
}
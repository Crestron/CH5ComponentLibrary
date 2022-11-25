// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../../_interfaces";
import { ICh5ButtonListAttributes } from "./i-ch5-button-list-attributes";

/**
 * @name Ch5 Button List
 * @isattribute false
 * @tagName ch5-button-list
 * @role 
 * @description of the component.
 * @componentVersion 2.2.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-button-list` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-list:blank",
 *     "description": "Crestron button list",
 *     "body": [
 *       "<ch5-button-list>",
 *       "</ch5-button-list>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button-list:all-attributes",
 *     "description": "Crestron button list (All Attributes)",
 *     "body": [
 *       "<ch5-button-list id=\"ch5-button-list_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tbuttonType=\"${3:default}\"",
 *       "\tbuttonHAlignLabel=\"${4:center}\"",
 *       "\tbuttonVAlignLabel=\"${5:middle}\"",
 *       "\tbuttonCheckboxPosition=\"${6:left}\"",
 *       "\tbuttonIconPosition=\"${7:first}\"",
 *       "\tbuttonShape=\"${8:rounded-rectangle}\"",
 *       "\tscrollbar=\"${9:}\"",
 *       "\tcenterItems=\"${10:}\"",
 *       "\tendless=\"${11:}\"",
 *       "\tbuttonCheckboxShow=\"${12:}\"",
 *       "\tbuttonSelected=\"${13:}\"",
 *       "\tbuttonPressed=\"${14:}\"",
 *       "\tmaxNumItems=\"${15:10}\"",
 *       "\trows=\"${16:1}\"",
 *       "\tcolumns=\"${17:1}\"",
 *       "\tbuttonMode=\"${18:}\"",
 *       "\tclickHoldTime=\"${19:}\"",
 *       "\tsgIconStyle=\"${20:}\"",
 *       "\tbuttonIconClass=\"${21:}\"",
 *       "\tbuttonIconUrl=\"${22:}\"",
 *       "\tindexId=\"${23:idx}\"",
 *       "\tbuttonLabel=\"${24:}\"",
 *       "\tbuttonLabelInnerHtml=\"${25:}\"",
 *       "\treceiveStateButtonMode=\"${26:}\"",
 *       "\treceiveStateButtonSelected=\"${27:}\"",
 *       "\treceiveStateButtonLabel=\"${28:}\"",
 *       "\treceiveStateButtonScriptLabelHtml=\"${29:}\"",
 *       "\treceiveStateButtonIconClass=\"${30:}\"",
 *       "\treceiveStateButtonType=\"${31:}\"",
 *       "\treceiveStateButtonIconUrl=\"${32:}\"",
 *       "\tsendEventOnButtonClick=\"${33:}\"",
 *       "\tstretch=\"${34:}\"",
 *       "\tsendEventOnButtonTouch=\"${35:}\">",
 *       "</ch5-button-list>$0"
 *       ]
 *    }
      // TODO: DEV:CHANGES
 *  ]
 */
export interface ICh5ButtonListDocumentation extends ICh5Common, ICh5ButtonListAttributes {

}
// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5GenericListDocumentation } from "../../ch5-common/interfaces/i-ch5-generic-list-documentation";
import { ICh5ButtonListAttributes } from "./i-ch5-button-list-attributes";

/**
 * @name Ch5 Button List
 * @isattribute false
 * @tagName ch5-button-list
 * @role button-list
 * @description Ch5 Button List offers a wide range of functionality out-of-the-box.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-button-list` element",
 *   "***",
 *   "A list of custom buttons designed to provide options to add icons, label, text, multi-select among other powerful options."
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
 *     "prefix": "ch5-button-list:default",
 *     "description": "Crestron button list (default)",
 *     "body": [
 *       "<ch5-button-list id=\"ch5-button-list_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tscrollbar=\"${3:false}\"",
 *       "\tcenterItems=\"${4:false}\"",
 *       "\tendless=\"${5:false}\"",
 *       "\tmaxNumberOfItems=\"${6:10}\"",
 *       "\trows=\"${7:1}\"",
 *       "\tcolumns=\"${8:1}\"",
 *       "\tstretch=\"${9:both}\"",
 *       "\tindexId=\"${10:idx}\">",
 *       "</ch5-button-list>$0"
 *       ]
 *    },
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
 *       "\tscrollbar=\"${9:false}\"",
 *       "\tcenterItems=\"${10:false}\"",
 *       "\tendless=\"${11:false}\"",
 *       "\tbuttonCheckboxShow=\"${12:}\"",
 *       "\tbuttonSelected=\"${13:}\"",
 *       "\tbuttonPressed=\"${14:}\"",
 *       "\tmaxNumberOfItems=\"${15:10}\"",
 *       "\trows=\"${16:1}\"",
 *       "\tcolumns=\"${17:1}\"",
 *       "\tbuttonMode=\"${18:}\"",
 *       "\tstretch=\"${19:both}\"",
 *       "\tsendEventOnButtonClick=\"${20:}\"",
 *       "\tbuttonIconClass=\"${21:}\"",
 *       "\tbuttonIconUrl=\"${22:}\"",
 *       "\tindexId=\"${23:idx}\"",
 *       "\tbuttonLabelInnerHtml=\"${24:}\"",
 *       "\treceiveStateButtonMode=\"${25:}\"",
 *       "\treceiveStateButtonSelected=\"${26:}\"",
 *       "\treceiveStateButtonLabel=\"${27:}\"",
 *       "\treceiveStateButtonScriptLabelHtml=\"${28:}\"",
 *       "\treceiveStateButtonIconClass=\"${29:}\"",
 *       "\treceiveStateButtonType=\"${30:}\"",
 *       "\treceiveStateButtonIconUrl=\"${31:}\"",
 *       "\tsendEventOnButtonTouch=\"${32:}\">",
 *       "</ch5-button-list>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ButtonListDocumentation extends ICh5GenericListDocumentation, ICh5ButtonListAttributes {

}
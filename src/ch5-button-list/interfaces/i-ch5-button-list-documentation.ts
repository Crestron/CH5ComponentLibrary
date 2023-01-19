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
 *    {
 *      "tagName": "ch5-button-list-label",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "template",
 *          "optional": false,
 *          "childElements": []
 *        }
 *      ]
 *    },
 *    {
 *      "tagName": "ch5-button-list-individual-button",
 *      "optional": true,
 *      "childElements": []
 *    },
 *    {
 *      "tagName": "ch5-button-list-mode",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "ch5-button-list-label",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "template",
 *              "optional": false,
 *              "childElements": []
 *            }
 *          ]
 *        },
 *        {
 *          "tagName": "ch5-button-list-mode-state",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "ch5-button-list-label",
 *              "optional": true,
 *              "childElements": [
 *                {
 *                  "tagName": "template",
 *                  "optional": false,
 *                  "childElements": []
 *                }
 *              ]
 *            }
 *          ]
 *        } 
 *      ]
 *   }
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
 *       "\tnumberOfItems=\"${6:10}\"",
 *       "\trows=\"${7:1}\"",
 *       "\tcolumns=\"${8:1}\"",
 *       "\tindexId=\"${9:}\"",
 *       "\tstretch=\"${10:}\"",
 *       "\tscrollToPosition=\"${11:}\">",
 *       "</ch5-button-list>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-button-list:all-attributes",
 *     "description": "Crestron button list (All Attributes)",
 *     "body": [
 *       "<ch5-button-list id=\"ch5-button-list_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tscrollbar=\"${3:false}\"",
 *       "\tcenterItems=\"${4:false}\"",
 *       "\tendless=\"${5:false}\"",
 *       "\tnumberOfItems=\"${6:10}\"",
 *       "\trows=\"${7:1}\"",
 *       "\tcolumns=\"${8:1}\"",
 *       "\tindexId=\"${9:}\"",
 *       "\tstretch=\"${10:}\"",
 *       "\tscrollToPosition=\"${11:}\"",
 *       "\treceiveStateNumberOfItems=\"${12:}\"",
 *       "\treceiveStateScrollToPosition=\"${13:}\"",
 *       "\tbuttonType=\"${14:default}\"",
 *       "\tbuttonHAlignLabel=\"${15:center}\"",
 *       "\tbuttonVAlignLabel=\"${16:middle}\"",
 *       "\tbuttonCheckboxPosition=\"${17:left}\"",
 *       "\tbuttonIconPosition=\"${18:first}\"",
 *       "\tbuttonShape=\"${19:rectangle}\"",
 *       "\tbuttonCheckboxShow=\"${20:}\"",
 *       "\tbuttonSelected=\"${21:}\"",
 *       "\tbuttonPressed=\"${22:}\"",
 *       "\tbuttonMode=\"${23:}\"",
 *       "\tbuttonIconClass=\"${24:}\"",
 *       "\tbuttonIconUrl=\"${25:}\"",
 *       "\tbuttonReceiveStateMode=\"${26:}\"",
 *       "\tbuttonReceiveStateSelected=\"${27:}\"",
 *       "\tbuttonReceiveStateLabel=\"${28:}\"",
 *       "\tbuttonReceiveStateScriptLabelHtml=\"${29:}\"",
 *       "\tbuttonReceiveStateIconClass=\"${30:}\"",
 *       "\tbuttonReceiveStateIconUrl=\"${31:}\"",
 *       "\tbuttonSendEventOnClick=\"${32:}\"",
 *       "\tbuttonReceiveStateShow=\"${33:}\"",
 *       "\tbuttonReceiveStateEnable=\"${34:}\">",
 *       "</ch5-button-list>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ButtonListDocumentation extends ICh5GenericListDocumentation, ICh5ButtonListAttributes {

}
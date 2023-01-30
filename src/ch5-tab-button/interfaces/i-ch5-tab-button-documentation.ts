// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5GenericListDocumentation } from "../../ch5-common/interfaces/i-ch5-generic-list-documentation";
import { ICh5TabButtonAttributes } from "./i-ch5-tab-button-attributes";

/**
 * @name Ch5 Tab Button
 * @isattribute false
 * @tagName ch5-tab-button
 * @role tab-button
 * @description Ch5 Tab Button offers a wide range of functionality out-of-the-box.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    {
 *      "tagName": "ch5-tab-button-label",
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
 *      "tagName": "ch5-tab-button-individual-button",
 *      "optional": true,
 *      "childElements": []
 *    }
 * ]
 * @documentation
 * [
 *   "`ch5-tab-button` element",
 *   "***",
 *   "A list of custom buttons designed to provide options to add icons, label, text, multi-select among other powerful options."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-tab-button:blank",
 *     "description": "Crestron tab button",
 *     "body": [
 *       "<ch5-tab-button>",
 *       "</ch5-tab-button>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-tab-button:default",
 *     "description": "Crestron tab button (default)",
 *     "body": [
 *       "<ch5-tab-button id=\"ch5-tab-button_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tnumberOfItems=\"${3:3}\"",
 *       "\tindexId=\"${4:}\">",
 *       "</ch5-tab-button>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-tab-button:all-attributes",
 *     "description": "Crestron tab button (All Attributes)",
 *     "body": [
 *       "<ch5-tab-button id=\"ch5-tab-button_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tnumberOfItems=\"${3:3}\"",
 *       "\tindexId=\"${4:}\"",
 *       "\treceiveStateNumberOfItems=\"${5:}\"",
 *       "\tbuttonType=\"${6:default}\"",
 *       "\tbuttonHAlignLabel=\"${7:center}\"",
 *       "\tbuttonVAlignLabel=\"${8:middle}\"",
 *       "\tbuttonIconPosition=\"${10:first}\"",
 *       "\tbuttonShape=\"${11:rectangle}\"",
 *       "\tbuttonSelected=\"${13:}\"",
 *       "\tbuttonPressed=\"${14:}\"",
 *       "\tbuttonIconClass=\"${15:}\"",
 *       "\tbuttonIconUrl=\"${16:}\"",
 *       "\tbuttonReceiveStateSelected=\"${17:}\"",
 *       "\tbuttonReceiveStateLabel=\"${18:}\"",
 *       "\tbuttonReceiveStateScriptLabelHtml=\"${19:}\"",
 *       "\tbuttonReceiveStateIconClass=\"${20:}\"",
 *       "\tbuttonReceiveStateIconUrl=\"${21:}\"",
 *       "\tbuttonSendEventOnClick=\"${22:}\"",
 *       "\tbuttonReceiveStateShow=\"${23:}\"",
 *       "\tbuttonReceiveStateEnable=\"${24:}\">",
 *       "</ch5-tab-button>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5TabButtonDocumentation extends ICh5GenericListDocumentation, ICh5TabButtonAttributes {

}
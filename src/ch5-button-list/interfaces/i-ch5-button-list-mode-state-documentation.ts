// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonListModeStateAttributes } from "./i-ch5-button-list-mode-state-attributes";

/**
 * @name Ch5 Button List Mode State
 * @isattribute false
 * @tagName ch5-button-list-mode-state
 * @role 
 * @description Ch5 Button List Mode State is a child node for <ch5-button-list-mode>.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *     {
 *      "tagName": "ch5-button-list-label",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "template",
 *          "optional": false,
 *          "childElements": []
 *        }
 *      ]
 *    }
 * ]
 * @documentation
 * [
 *   "`ch5-button-list-mode-state` element",
 *   "***",
 *   "A child element designed to capture state level attributes for Ch5 Button List Mode component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-list-mode-state:blank",
 *     "description": "Crestron button list mode state",
 *     "body": [
 *       "<ch5-button-list-mode-state>",
 *       "</ch5-button-list-mode-state>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button-list-mode-state:default",
 *     "description": "Crestron button list mode state (default)",
 *     "body": [
 *       "<ch5-button-list-mode-state id=\"ch5-button-list-mode-state_${1:id}\"",
 *       "\tstate=\"${2:normal}\"",
 *       "\ttype=\"${3:default}\"",
 *       "\thAlignLabel=\"${4:center}\"",
 *       "\tvAlignLabel=\"${5:middle}\"",
 *       "\tcheckboxPosition=\"${6:left}\"",
 *       "\ticonPosition=\"${7:first}\"",
 *       "\ticonClass=\"${8:}\"",
 *       "\ticonUrl=\"${9:}\"",
 *       "\tcustomClass=\"${10:}\"",
 *       "\tcustomStyle=\"${11:}\">",
 *       "</ch5-button-list-mode-state>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-button-list-mode-state:all-attributes",
 *     "description": "Crestron button list mode state (All Attributes)",
 *     "body": [
 *       "<ch5-button-list-mode-state id=\"ch5-button-list-mode-state_${1:id}\"",
 *       "\tstate=\"${2:normal}\"",
 *       "\ttype=\"${3:default}\"",
 *       "\thAlignLabel=\"${4:center}\"",
 *       "\tvAlignLabel=\"${5:middle}\"",
 *       "\tcheckboxPosition=\"${6:left}\"",
 *       "\ticonPosition=\"${7:first}\"",
 *       "\ticonClass=\"${8:}\"",
 *       "\ticonUrl=\"${9:}\"",
 *       "\tcustomClass=\"${10:}\"",
 *       "\tcustomStyle=\"${11:}\">",
 *       "</ch5-button-list-mode-state>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ButtonListModeStateDocumentation extends ICh5ButtonListModeStateAttributes {

}
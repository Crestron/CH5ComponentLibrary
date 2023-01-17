// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5TabButtonModeStateAttributes } from "./i-ch5-tab-button-mode-state-attributes";

/**
 * @name Ch5 Tab Button Mode State
 * @isattribute false
 * @tagName ch5-tab-button-mode-state
 * @role 
 * @description Ch5 Tab Button Mode State is a child node for <ch5-tab-button-mode>.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *     {
 *      "tagName": "ch5-tab-button-label",
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
 *   "`ch5-tab-button-mode-state` element",
 *   "***",
 *   "A child element designed to capture state level attributes for Ch5 Tab Button Mode component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-tab-button-mode-state:blank",
 *     "description": "Crestron tab button mode state",
 *     "body": [
 *       "<ch5-tab-button-mode-state>",
 *       "</ch5-tab-button-mode-state>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-tab-button-mode-state:default",
 *     "description": "Crestron tab button mode state (default)",
 *     "body": [
 *       "<ch5-tab-button-mode-state id=\"ch5-tab-button-mode-state_${1:id}\"",
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
 *       "</ch5-tab-button-mode-state>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-tab-button-mode-state:all-attributes",
 *     "description": "Crestron tab button mode state (All Attributes)",
 *     "body": [
 *       "<ch5-tab-button-mode-state id=\"ch5-tab-button-mode-state_${1:id}\"",
 *       "\tstate=\"${2:normal}\"",
 *       "\ttype=\"${3:default}\"",
 *       "\thAlignLabel=\"${4:center}\"",
 *       "\tvAlignLabel=\"${5:middle}\"",
 *       "\tcheckboxPosition=\"${6:left}\"",
 *       "\ticonPosition=\"${7:first}\"",
 *       "\ticonClass=\"${8:}\"",
 *       "\ticonUrl=\"${9:}\"",
 *       "\tcustomClass=\"${10:}\"",
 *       "\tcustomStyle=\"${11:}\"",
 *       "\tlabelInnerHTML=\"${12:}\">",
 *       "</ch5-tab-button-mode-state>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5TabButtonModeStateDocumentation extends ICh5TabButtonModeStateAttributes {

}
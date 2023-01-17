// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5TabButtonModeAttributes } from "./i-ch5-tab-button-mode-attributes";

/**
 * @name Ch5 Tab Button Mode
 * @isattribute false
 * @tagName ch5-tab-button-mode
 * @role template
 * @description Ch5 Tab Button Mode is a child node for <ch5-tab-button>.
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
 *    },
 *    {
 *      "tagName": "ch5-tab-button-mode-state",
 *      "optional": true,
 *      "childElements": [
 *       {
 *         "tagName": "ch5-tab-button-label",
 *         "optional": true,
 *         "childElements": [
 *           {
 *             "tagName": "template",
 *             "optional": false,
 *             "childElements": []
 *           }
 *         ]
 *       }
 *     ]
 *   } 
 * ]
 * @documentation
 * [
 *   "`ch5-tab-button-mode` element",
 *   "***",
 *   "A child element designed to capture mode level attributes for Ch5 Tab Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-tab-button-mode:blank",
 *     "description": "Crestron tab button mode",
 *     "body": [
 *       "<ch5-tab-button-mode>",
 *       "</ch5-tab-button-mode>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-tab-button-mode:default",
 *     "description": "Crestron tab button mode (default)",
 *     "body": [
 *       "<ch5-tab-button-mode id=\"ch5-tab-button-mode_${1:id}\"",
 *       "\ttype=\"${2:default}\"",
 *       "\thAlignLabel=\"${3:center}\"",
 *       "\tvAlignLabel=\"${4:middle}\"",
 *       "\tcheckboxPosition=\"${5:left}\"",
 *       "\ticonPosition=\"${6:first}\"",
 *       "\ticonClass=\"${7:}\"",
 *       "\ticonUrl=\"${8:}\"",
 *       "\tcustomClass=\"${9:}\"",
 *       "\tcustomStyle=\"${10:}\">",
 *       "</ch5-tab-button-mode>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-tab-button-mode:all-attributes",
 *     "description": "Crestron tab button mode (All Attributes)",
 *     "body": [
 *       "<ch5-tab-button-mode id=\"ch5-tab-button-mode_${1:id}\"",
 *       "\ttype=\"${2:default}\"",
 *       "\thAlignLabel=\"${3:center}\"",
 *       "\tvAlignLabel=\"${4:middle}\"",
 *       "\tcheckboxPosition=\"${5:left}\"",
 *       "\ticonPosition=\"${6:first}\"",
 *       "\ticonClass=\"${7:}\"",
 *       "\ticonUrl=\"${8:}\"",
 *       "\tcustomClass=\"${9:}\"",
 *       "\tcustomStyle=\"${10:}\"",
 *       "\tlabelInnerHTML=\"${11:}\">",
 *       "</ch5-tab-button-mode>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5TabButtonModeDocumentation extends ICh5TabButtonModeAttributes {

}
// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonListModeAttributes } from "./i-ch5-button-list-mode-attributes";

/**
 * @name Ch5 Button List Mode
 * @isattribute false
 * @tagName ch5-button-list-mode
 * @role template
 * @description Ch5 Button List Mode is a child node for <ch5-button-list>.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-button-list-mode` element",
 *   "***",
 *   "A child element designed to capture mode level attributes for Ch5 Button list component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-list-mode:blank",
 *     "description": "Crestron button list mode",
 *     "body": [
 *       "<ch5-button-list-mode>",
 *       "</ch5-button-list-mode>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button-list-mode:all-attributes",
 *     "description": "Crestron button list mode (All Attributes)",
 *     "body": [
 *       "<ch5-button-list-mode id=\"ch5-button-list-mode_${1:id}\"",
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
 *       "</ch5-button-list-mode>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ButtonListModeDocumentation extends ICh5ButtonListModeAttributes {

}
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonModeCommonAttributes } from "./i-ch5-button-mode-common";

/**
 * @name Ch5 Button Mode
 * @isattribute false
 * @tagName ch5-button-mode
 * @role button
 * @description Ch5 Button Mode is a child node for <ch5-button>.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *   "`ch5-button-mode` element",
 *   "***",
 *   "A child element designed to capture mode level attributes for Ch5 Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-mode:blank",
 *     "description": "Crestron Button Mode",
 *     "body": [
 *       "<ch5-button-mode>",
 *       "</ch5-button-mode>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button-mode:all-attributes",
 *     "description": "Crestron Button Mode (All Attributes)",
 *     "body": [
 *       "<ch5-button-mode",
 *       "\ttype=\"${1|default,primary,info,text,danger,warning,success,secondary|}\"",
 *       "\tcustomClass=\"${2:customClass}\"",
 *       "\tcustomStyle=\"${3:customStyle}\"",
 *       "\tcheckboxposition=\"${4|left,right|}\"",
 *       "\thalignlabel=\"${5|center,left,right|}\"",
 *       "\tvalignlabel=\"${6|middle,top,bottom|}\"",
 *       "\ticonposition=\"${7|first,last,top,bottom|}\"",
 *       "\ticonClass=\"${8:iconClass}\"",
 *       "\ticonUrl=\"${9:iconUrl}\">",
 *       "</ch5-button-mode>$0"
 *       ]
 *    }
 * ]
 *
 */
export interface ICh5ButtonModeAttributes extends ICh5ButtonModeCommonAttributes {

}

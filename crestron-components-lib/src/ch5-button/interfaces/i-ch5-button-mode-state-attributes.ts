// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonModeCommonAttributes } from "./i-ch5-button-mode-common";
import { TCh5ButtonModeState } from "./t-ch5-button";

/**
 * @name Ch5 Button Mode State
 * @isattribute false
 * @tagName ch5-button-mode-state
 * @role button
 * @description Ch5 Button Mode State is a child node for <ch5-button-mode>.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *   "`ch5-button-mode-state` element",
 *   "***",
 *   "A child element designed to capture state level attributes for Ch5 Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-mode-state:blank",
 *     "description": "Crestron Button Mode State",
 *     "body": [
 *       "<ch5-button-mode-state>",
 *       "</ch5-button-mode-state>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button-mode-state:all-attributes",
 *     "description": "Crestron Button Mode State (All Attributes)",
 *     "body": [
 *       "<ch5-button-mode-state",
 *       "\tstate=\"${1|normal,pressed,selected|}\"",
 *       "\ttype=\"${2|default,primary,info,text,danger,warning,success,secondary|}\"",
 *       "\tcustomClass=\"${3:customClass}\"",
 *       "\tcustomStyle=\"${4:customStyle}\"",
 *       "\tcheckboxposition=\"${5|left,right|}\"",
 *       "\thalignlabel=\"${6|center,left,right|}\"",
 *       "\tvalignlabel=\"${7|middle,top,bottom|}\"",
 *       "\ticonposition=\"${8|first,last,top,bottom|}\"",
 *       "\ticonClass=\"${9:iconClass}\"",
 *       "\ticonUrl=\"${10:iconUrl}\">",
 *       "</ch5-button-mode-state>$0"
 *       ]
 *    }
 * ]
 *
 */
export interface ICh5ButtonModeStateAttributes extends ICh5ButtonModeCommonAttributes {

  /**
   * @documentation
   * [
   * "`state` attribute",
   * "***",
   * "Valid values: 'normal', 'pressed', 'selected'.",
   * "This attribute is used to define the ch5-button-mode-state attribues on the basis of the state of the parent ch5-button. ",
   * "If the button is neither in the 'pressed' state nor in the 'selected' state, then the button is considered to be in 'normal' state. ",
   * "The attributes of 'state' as 'normal' are considered in this case for the ch5-button. ",
   * "If the button is in the 'pressed' state, then the attributes of 'state' as 'pressed' are considered in this case for the ch5-button.  ",
   * "If the button is in the 'selected' state, then the attributes of 'state' as 'selected' are considered in this case for the ch5-button.  "
   * ]
   * @name state
   * @default normal
   */
  state: TCh5ButtonModeState;

}

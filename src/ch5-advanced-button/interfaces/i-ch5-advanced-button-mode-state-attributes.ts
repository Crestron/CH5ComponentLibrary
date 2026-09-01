// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5AdvancedButtonModeCommonAttributes } from "./i-ch5-advanced-button-mode-common";
import { TCh5AdvancedButtonModeState } from "./t-ch5-advanced-button";

/**
 * @name Ch5 Advance Button Mode State
 * @isattribute false
 * @tagName ch5-advanced-button-mode-state
 * @role button
 * @description Ch5 Advance Button Mode State is a child node for <ch5-advanced-button-mode>.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    {
 *      "tagName": "ch5-advanced-button-mode-state",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "ch5-advanced-button-label",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "template",
 *              "optional": false,
 *              "childElements": [
 *                  {
 *                     "tagName": "ch5-jointotext-boolean",
 *                     "optional": true,
 *                     "childElements": []
 *                  },
 *                  {
 *                     "tagName": "ch5-jointotext-numeric",
 *                     "optional": true,
 *                     "childElements": []
 *                  },
 *                  {
 *                     "tagName": "ch5-jointotext-string",
 *                     "optional": true,
 *                     "childElements": []
 *                  }
 *              ]
 *            }
 *          ]
 *        }
 *      ]
 *    }
 * ]
 * @documentation
 * [
 *   "`ch5-advanced-button-mode-state` element",
 *   "***",
 *   "A child element designed to capture state level attributes for Ch5 Advance Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-advanced-button-mode-state:blank",
 *     "description": "Crestron Button Mode State",
 *     "body": [
 *       "<ch5-advanced-button-mode-state>",
 *       "</ch5-advanced-button-mode-state>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-advanced-button-mode-state:all-attributes",
 *     "description": "Crestron Button Mode State (All Attributes)",
 *     "body": [
 *       "<ch5-advanced-button-mode-state",
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
 *       "</ch5-advanced-button-mode-state>$0"
 *       ]
 *    }
 * ]
 *
 */
export interface ICh5AdvancedButtonModeStateAttributes extends ICh5AdvancedButtonModeCommonAttributes {

  /**
   * @documentation
   * [
   * "`state` attribute",
   * "***",
   * "Valid values: 'normal', 'pressed', 'selected'.",
   * "This attribute is used to define the ch5-advanced-button-mode-state attributes on the basis of the state of the parent ch5-advanced-button. ",
   * "If the button is neither in the 'pressed' state nor in the 'selected' state, then the button is considered to be in 'normal' state. ",
   * "The attributes of 'state' as 'normal' are considered in this case for the ch5-advanced-button. ",
   * "If the button is in the 'pressed' state, then the attributes of 'state' as 'pressed' are considered in this case for the ch5-advanced-button.  ",
   * "If the button is in the 'selected' state, then the attributes of 'state' as 'selected' are considered in this case for the ch5-advanced-button.  "
   * ]
   * @name state
   * @default normal
   * @attributeType "EnumeratedValue"
   */
  state: TCh5AdvancedButtonModeState;

}

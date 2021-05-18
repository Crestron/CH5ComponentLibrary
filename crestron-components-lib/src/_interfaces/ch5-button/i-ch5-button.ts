// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonAttributes } from "./i-ch5-button-attributes";
import { ICh5Common } from "../ch5-common";
import { TBoolAttribute } from "../ch5-common/types/t-bool-attribute";

/**
 * @name Ch5 Button
 * @isattribute false
 * @tagName ch5-button
 * @role button
 * @description Ch5 Button offers a wide range of functionality out-of-the-box.
 * @documentation
 * [
 *   "`ch5-button` element",
 *   "***",
 *   "An extension to standard HTML ch5-button element with icons and simple formats."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button:blank",
 *     "description": "Crestron Button",
 *     "body": [
 *       "<ch5-button>",
 *       "</ch5-button>$0"
 *     ]
 *   },
 *   {
 *    "prefix": "ch5-button:default",
 *     "description": "Crestron Button",
 *     "body": [
 *       "<ch5-button id=\"btn_${1:id}\"",
 *       "\tlabel=\"${2:Crestron Button}\"",
 *       "\tsendeventonclick=\"${3:btn_${1}_clicked}\">",
 *       "</ch5-button>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button:all-attributes",
 *     "description": "Crestron Button (All Attributes)",
 *     "body": [
 *       "<ch5-button id=\"btn_${1:id}\"",
 *       "\tlabel=\"${2:Crestron Button}\"",
 *       "\ttype=\"${3|default,primary,info,text,danger,warning,success,secondary|}\"",
 *       "\tcustomClass=\"${4:customClass}\"",
 *       "\tshape=\"${5|rounded-rectangle,rectangle,tab,circle,oval|}\"",
 *       "\tsize=\"${6|regular,x-small,small,large,x-large|}\"",
 *       "\tstretch=\"${7|both,width,height|}\"",
 *       "\ticonposition=\"${8|first,last,top,bottom|}\"",
 *       "\ticonclass=\"${9:iconClass}\"",
 *       "\torientation=\"${10|horizontal,vertical|}\"",
 *       "\tsendeventonclick=\"${11:btn_${1}_clicked}\"",
 *       "\tsendeventontouch=\"${12:btn_${1}_touched}\"",
 *       "\treceivestateselected=\"${13}\"",
 *       "\treceivestatelabel=\"${14}\"",
 *       "\treceivestatescriptlabelhtml=\"${15}\">",
 *       "</ch5-button>$0"
 *     ]
 *   }
 * ]
 *
 */
export interface ICh5Button extends ICh5ButtonAttributes, ICh5Common {

  /**
   * @documentation
   * [
   * "`onpress` attribute",
   * "***",
   * "Runs when a press event is initiated."
   * ]
   * @name onpress
   */
  onpress: string;

  /**
   * @documentation
   * [
   * "`onrelease` attribute",
   * "***",
   * "Runs when a release event is initiated."
   * ]
   * @name onrelease
   */
  onrelease: string;

  /**
   * @documentation
   * [
   * "`selected` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the state of the component. If set to true, ",
   * "'ch5-button--selected' will be applied as the CSS class on the component."
   * ]
   * @name selected
   * @default false
   */
  selected: TBoolAttribute;

  /**
   * @documentation
   * [
   * "`customclassselected` attribute",
   * "***",
   * "Specifies a custom class for the selected state of the button."
   * ]
   * @name customclassselected
   */
  customClassSelected: string | null;
}
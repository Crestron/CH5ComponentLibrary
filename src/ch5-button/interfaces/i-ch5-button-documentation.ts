// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Button
 * @isattribute false
 * @tagName ch5-button
 * @role button
 * @description Ch5 Button offers a wide range of functionality out-of-the-box.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *   "`ch5-button` element",
 *   "***",
 *   "A custom component designed to provide options to add icons, label, text, multiselect among other powerful options."
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
 *       "\tcheckboxshow=\"${8|true,false|}\"",
 *       "\tcheckboxposition=\"${9|left,right|}\"",
 *       "\thalignlabel=\"${10|center,left,right|}\"",
 *       "\tvalignlabel=\"${11|middle,top,bottom|}\"",
 *       "\ticonposition=\"${12|first,last,top,bottom|}\"",
 *       "\ticonclass=\"${13:iconClass}\"",
 *       "\torientation=\"${14|horizontal,vertical|}\"",
 *       "\tsendeventonclick=\"${15:btn_${1}_clicked}\"",
 *       "\tsendeventontouch=\"${16:btn_${1}_touched}\"",
 *       "\treceivestateselected=\"${17}\"",
 *       "\treceivestatelabel=\"${18}\"",
 *       "\treceivestatescriptlabelhtml=\"${19}\">",
 *       "</ch5-button>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ButtonDocumentation extends ICh5Common, ICh5ButtonAttributes {

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
   * "`customclassselected` attribute",
   * "***",
   * "Specifies a custom class for the selected state of the button."
   * ]
   * @name customclassselected
   */
  customClassSelected: string | null;

}
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5LightBaseAttributes } from "../../ch5-light-base/interfaces/i-ch5-light-base-attributes";
import { ICh5ButtonAttributes } from "./i-ch5-button-attributes";

/**
 * @name Ch5 Button
 * @isattribute false
 * @tagName ch5-button
 * @role button
 * @description Ch5 Button offers a wide range of functionality out-of-the-box in a lightweight, high-performance implementation.
 * @componentVersion 1.0.0
 * @childElements []
 * @documentation
 * [
 *   "`ch5-button` element",
 *   "***",
 *   "A custom component designed to provide options to add icons, labels and text, apply type, size and shape styling, reflect selected and pressed states, display a checkbox, and drive behavior through Crestron signals."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button:blank",
 *    "description": "Crestron Button",
 *    "body": [
 *      "<ch5-button>",
 *      "</ch5-button>$0"
 *    ]
 *  },
 *  {
 *    "prefix": "ch5-button:default",
 *    "description": "Crestron Button",
 *    "body": [
 *      "<ch5-button id=\"btn_${1:id}\"",
 *      "\tlabel=\"${2:Crestron Button}\"",
 *      "\tsendeventonclick=\"${3:btn_${1}_clicked}\">",
 *      "</ch5-button>$0"
 *    ]
 *  },
 *  {
 *    "prefix": "ch5-button:all-attributes",
 *    "description": "Crestron Button (All Attributes)",
 *    "body": [
 *      "<ch5-button id=\"btn_${1:id}\"",
 *      "\tlabel=\"${2:Crestron Button}\"",
 *      "\ttype=\"${3|default,primary,secondary,info,success,warning,danger,text|}\"",
 *      "\tshape=\"${4|rounded-rectangle,rectangle,circle,oval,tab|}\"",
 *      "\tsize=\"${5|regular,x-small,small,large,x-large|}\"",
 *      "\tstretch=\"${6|both,width,height|}\"",
 *      "\tcheckboxshow=\"${7|true,false|}\"",
 *      "\tcheckboxposition=\"${8|left,right|}\"",
 *      "\thalignlabel=\"${9|center,left,right|}\"",
 *      "\tvalignlabel=\"${10|middle,top,bottom|}\"",
 *      "\ticonposition=\"${11|first,last,top,bottom|}\"",
 *      "\torientation=\"${12|horizontal,vertical|}\"",
 *      "\ticonclass=\"${13:iconClass}\"",
 *      "\ticonurl=\"${14}\"",
 *      "\ticonurlfilltype=\"${15|stretch,stretch-aspect,center,tile,initial|}\"",
 *      "\tbackgroundimageurl=\"${16}\"",
 *      "\tbackgroundimagefilltype=\"${17|stretch-aspect,stretch,center,tile|}\"",
 *      "\tselected=\"${18|false,true|}\"",
 *      "\tpressed=\"${19|false,true|}\"",
 *      "\tmultilinesupport=\"${20|false,true|}\"",
 *      "\ttruncatetext=\"${21|true,false|}\"",
 *      "\tsendeventonclick=\"${22:btn_${1}_clicked}\"",
 *      "\treceivestateselected=\"${23}\"",
 *      "\treceivestatelabel=\"${24}\"",
 *      "\treceivestatescriptlabelhtml=\"${25}\"",
 *      "\treceivestateiconclass=\"${26}\"",
 *      "\treceivestateiconurl=\"${27}\"",
 *      "\treceivestatetype=\"${28}\"",
 *      "\treceivestatebackgroundimageurl=\"${29}\">",
 *      "</ch5-button>$0"
 *    ]
 *  }
 * ]
 */
export interface ICh5ButtonDocumentation extends ICh5LightBaseAttributes, ICh5ButtonAttributes {

  /**
   * @documentation
   * [
   * "`onpress` attribute",
   * "***",
   * "Runs when a press event is initiated."
   * ]
   * @name onpress
   * @attributeType "String"
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
   * @attributeType "String"
   */
  onrelease: string;

}

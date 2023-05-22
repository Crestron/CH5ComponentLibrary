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
 * @childElements
 * [
 *    {
 *      "tagName": "ch5-button-label",
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
 *      "tagName": "ch5-button-mode",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "ch5-button-label",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "template",
 *              "optional": false,
 *              "childElements": []
 *            }
 *          ]
 *        },
 *        {
 *          "tagName": "ch5-button-mode-state",
 *          "optional": true,
 *          "childElements": [
 *            {
 *              "tagName": "ch5-button-label",
 *              "optional": true,
 *              "childElements": [
 *                {
 *                  "tagName": "template",
 *                  "optional": false,
 *                  "childElements": []
 *                }
 *              ]
 *            }
 *          ]
 *        } 
 *      ]
 *   }
 * ]
 * @documentation
 * [
 *   "`ch5-button` element",
 *   "***",
 *   "A custom component designed to provide options to add icons, label, text, multi-select among other powerful options."
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
 *       "\tcustomStyle=\"${5:customStyle}\"",
 *       "\tshape=\"${6|rounded-rectangle,rectangle,tab,circle,oval|}\"",
 *       "\tsize=\"${7|regular,x-small,small,large,x-large|}\"",
 *       "\tstretch=\"${8|both,width,height|}\"",
 *       "\tcheckboxshow=\"${9|true,false|}\"",
 *       "\tcheckboxposition=\"${10|left,right|}\"",
 *       "\thalignlabel=\"${11|center,left,right|}\"",
 *       "\tvalignlabel=\"${12|middle,top,bottom|}\"",
 *       "\ticonposition=\"${13|first,last,top,bottom|}\"",
 *       "\ticonclass=\"${14:iconClass}\"",
 *       "\torientation=\"${15|horizontal,vertical|}\"",
 *       "\tsendeventonclick=\"${16:btn_${1}_clicked}\"",
 *       "\tsendeventontouch=\"${17:btn_${1}_touched}\"",
 *       "\treceivestateselected=\"${18}\"",
 *       "\treceivestatelabel=\"${19}\"",
 *       "\treceivestatescriptlabelhtml=\"${20}\"",
 *       "\ticonurl=\"${21}\"",
 *       "\tmode=\"${22}\"",
 *       "\tformtype=\"${23}\"",
 *       "\treceivestatemode=\"${24}\"",
 *       "\treceivestateiconclass=\"${25}\"",
 *       "\treceivestatetype=\"${26}\"",
 *       "\treceivestateiconurl=\"${27}\"",
 *       "\tcustomclasspressed=\"${28}\"",
 *       "\tcustomclassdisabled=\"${29}\"",
 *       "\tselected=\"${30}\"",
 *       "\tpressed=\"${31}\"",
 *       "\tbackgroundimageurl=\"${32:}\"",
 *       "\tbackgroundimagefilltype=\"${33:stretch-aspect}\"",
 *       "\treceivestatesgiconnumeric=\"${34}\"",
 *       "\treceivestatesgiconstring=\"${35}\"",
 *       "\tsgicontheme=\"${36|icons-lg, icons-sm, media-transports-accents, media-transports-light, media-transports-dark|}\"",
 *       "\treceivestatebackgroundimageurl=\"${37:}\">",
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

  /**
   * @documentation
   * [
   * "`customclassselected` attribute",
   * "***",
   * "Specifies a custom class for the selected state of the button."
   * ]
   * @name customclassselected
   * @attributeType "String"
   */
  customClassSelected: string | null;

}
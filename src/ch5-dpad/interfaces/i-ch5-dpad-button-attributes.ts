// Copyleft (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5DpadChildBaseAttributes } from "./i-ch5-dpad-child-base-attributes";

/**
 * @name Ch5 Dpad Button
 * @isattribute false
 * @tagName ch5-dpad-button
 * @role container
 * @description Ch5 Dpad Button
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-button` element",
 * "***",
 * "DPad <ch5-dpad-button key=`value`> component can be added under a <ch5-dpad> tag ",
 * "for customization related to icon as a url or an icon class. ",
 * "Note: This tag can never be independently used and always needs the container <ch5-dpad> to render."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-dpad-button key=\"bottom\":blank",
 *     "description": "Crestron Dpad Button",
 *     "body": [
 *       "<ch5-dpad-button key=\"${1|center,top,bottom,left,right|}\">",
 *       "</ch5-dpad-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button:iconurl",
 *     "description": "Crestron Dpad Button Bottom",
 *     "body": [
 *       "<ch5-dpad-button key=\"${1|center,top,bottom,left,right|}\" iconurl=\"btn_${2:Icon Url}\">",
 *       "</ch5-dpad-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button:iconclass",
 *     "description": "Crestron Dpad Button Bottom",
 *     "body": [
 *       "<ch5-dpad-button key=\"${1|center,top,bottom,left,right|}\" iconclass=\"btn_${2:Icon Class}\">",
 *       "</ch5-dpad-button>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button:all-attributes",
 *     "description": "Crestron Dpad Button Bottom",
 *     "body": [
 *       "<ch5-dpad-button key=\"${1|center,top,bottom,left,right|}\">",
 *       "\ticonurl=\"btn_${2:IconUrl}\"",
 *       "\tshow=\"${3:Show}\"",
 *       "\tenable=\"${4:Enable}\"",
 *       "\tpressed=\"${5:Pressed}\"",
 *       "\tsendeventonclick=\"${6:sendEventOnClick}\"",
 *       "\ticonclass=\"${7:iconClass}\">",
 *       "</ch5-dpad-button>$0"
 *     ]
 *  }
 * ]
 * 
 */
export interface ICh5DpadButtonAttributes extends ICh5DpadChildBaseAttributes {
}

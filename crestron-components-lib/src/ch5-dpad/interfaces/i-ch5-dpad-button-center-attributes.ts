// Copyleft (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5DpadChildBaseAttributes } from "./i-ch5-dpad-child-base-attributes";

/**
 * @name Ch5 Dpad Center
 * @isattribute false
 * @tagName ch5-dpad-button-center
 * @role container
 * @description Ch5 Dpad Button Center
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-button-center` element",
 * "***",
 * "DPad <ch5-dpad-button-center> component can be added under a <ch5-dpad> tag ",
 * "for customization related to icon as a url or an icon class. ",
 * "Note: This tag can never be independently used and always needs the container 'ch5-dpad' to render."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-dpad-button-center:blank",
 *     "description": "Crestron Dpad Button Center",
 *     "body": [
 *       "<ch5-dpad-button-center>",
 *       "</ch5-dpad-button-center>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button-center:iconurl",
 *     "description": "Crestron Dpad Button Center",
 *     "body": [
 *       "<ch5-dpad-button-center iconurl=\"btn_${1:Icon Url}\">",
 *       "</ch5-dpad-button-center>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button-center:iconclass",
 *     "description": "Crestron Dpad Button Center",
 *     "body": [
 *       "<ch5-dpad-button-center iconclass=\"btn_${1:Icon Class}\">",
 *       "</ch5-dpad-button-center>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button-center:all-attributes",
 *     "description": "Crestron Dpad Button Center",
 *     "body": [
 *       "<ch5-dpad-button-center",
 *       "\ticonurl=\"btn_${1:Icon Url}\"",
 *       "\\tshow=\"${2:Show}\"",
 *       "\\tenable=\"${3:Enable}\"",
 *       ">",
 *       "</ch5-dpad-button-center>$0"
 *     ]
 *  }
 * ]
 * 
 */
export interface ICh5DpadCenterAttributes extends ICh5DpadChildBaseAttributes {
}

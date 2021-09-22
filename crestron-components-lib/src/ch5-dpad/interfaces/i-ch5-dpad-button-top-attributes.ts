// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5DpadChildBaseAttributes } from "./i-ch5-dpad-child-base-attributes";

/**
 * @name Ch5 Dpad Top
 * @isattribute false
 * @tagName ch5-dpad-button-top
 * @role container
 * @description Ch5 Dpad Button Top
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-button-top` element",
 * "***",
 * "DPad <ch5-dpad-button-top> component can be added under a <ch5-dpad> tag ",
 * "for customization related to icon as a url or an icon class. ",
 * "Note: This tag can never be independently used and always needs the container 'ch5-dpad' to render."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-dpad-button-top:blank",
 *     "description": "Crestron Dpad Button Top",
 *     "body": [
 *       "<ch5-dpad-button-top>",
 *       "</ch5-dpad-button-top>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button-top:iconurl",
 *     "description": "Crestron Dpad Button Top",
 *     "body": [
 *       "<ch5-dpad-button-top iconurl=\"btn_${1:Icon Url}\">",
 *       "</ch5-dpad-button-top>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button-top:iconclass",
 *     "description": "Crestron Dpad Button Top",
 *     "body": [
 *       "<ch5-dpad-button-top iconclass=\"btn_${1:Icon Class}\">",
 *       "</ch5-dpad-button-top>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad-button-top:all-attributes",
 *     "description": "Crestron Dpad Button Top",
 *     "body": [
 *       "<ch5-dpad-button-top",
 *       "\ticonurl=\"btn_${1:Icon Url}\"",
 *       "\\tshow=\"${2:Show}\"",
 *       "\\tenable=\"${3:Enable}\"",
 *       ">",
 *       "</ch5-dpad-button-top>$0"
 *     ]
 *  }
 * ]
 * 
 */
export interface ICh5DpadTopAttributes extends ICh5DpadChildBaseAttributes {
}

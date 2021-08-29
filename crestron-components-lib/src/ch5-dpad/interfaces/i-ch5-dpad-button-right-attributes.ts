// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5DpadChildBaseAttributes } from "./i-ch5-dpad-child-base-attributes";

/**
 * @name Ch5 Dpad Right
 * @isattribute false
 * @tagName ch5-Dpad Button Right
 * @role container
 * @description Ch5 Dpad Button Right
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-button-right` element",
 * "***",
 * "DPad <ch5-dpad-button-right> component can be added under a <ch5-dpad> tag ",
 * "for customization related to icon as a url or an icon class. ",
 * "Note: This tag can never be independently used and always needs the container 'ch5-dpad' to render."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-dpad:blank",
 *     "description": "Crestron Dpad Button Right",
 *     "body": [
 *       "<ch5-dpad-button-right>",
 *       "</ch5-dpad-button-right>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad:iconurl",
 *     "description": "Crestron Dpad Button Right",
 *     "body": [
 *       "<ch5-dpad-button-right iconurl=\"btn_${1:Icon Url}\">",
 *       "</ch5-dpad-button-right>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad:iconclass",
 *     "description": "Crestron Dpad Button Right",
 *     "body": [
 *       "<ch5-dpad-button-right iconclass=\"btn_${1:Icon Class}\">",
 *       "</ch5-dpad-button-right>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-dpad:all-attributes",
 *     "description": "Crestron Dpad Button Right",
 *     "body": [
 *       "<ch5-dpad-button-right",
 *       "\ticonurl=\"btn_${1:Icon Url}\"",
 *       "\\tshow=\"${2:Show}\"",
 *       "\\tenable=\"${3:Enable}\"",
 *       ">",
 *       "</ch5-dpad-button-right>$0"
 *     ]
 *  }
 * ]
 * 
 */
export interface ICh5DpadRightAttributes extends ICh5DpadChildBaseAttributes {
}

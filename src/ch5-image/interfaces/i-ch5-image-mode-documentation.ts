// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Image Mode
 * @isattribute false
 * @tagName ch5-image-mode
 * @role img
 * @description Enhances ch5-image to support multiple modes.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-image-mode` element",
 * "***",
 * "Enhances ch5-image to support multiple modes"
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-image-mode:blank",
 *      "description": "Crestron Image Mode (Blank)",
 *      "body": [
 *        "<ch5-image-mode>",
 *         "</ch5-image-mode>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-image-mode:default",
 *      "description": "Crestron Image Mode (Default)",
 *      "body": [
 *        "<ch5-image-mode url=\"${5:http://someServer/image.png}\">",
 *         "</ch5-image-mode>$0"
 *        ]
 *    }
 *   
 * ]
 * 
 */
export interface ICh5ImageModeDocumentation extends ICh5Common {
}
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5DpadChildBaseAttributes } from "./i-ch5-dpad-child-base";

/**
 * @name Ch5 Dpad Center
 * @isattribute false
 * @tagName ch5-Dpad Center
 * @role container
 * @description Ch5 Dpad Center
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-center` element",
 * "***",
 * "DPad <ch5-dpad-center> component"
 * ]
 * @snippets
 * [
 * ]
 * 
 */

export interface ICh5DpadCenterAttributes extends ICh5DpadChildBaseAttributes {
    /**
     * @documentation
     * [
     * "`type` label",
     * "***",
     * "Label for the center button. "
     * ]
     * @name label
     */
    label: string;
}

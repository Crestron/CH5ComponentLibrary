// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5DpadShape, TCh5DpadStretch, TCh5DpadType } from "./t-ch5-dpad";

/**
 * @name Ch5 Dpad Left
 * @isattribute false
 * @tagName ch5-Dpad Left
 * @role container
 * @description Ch5 Dpad Left
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-left` element",
 * "***",
 * "DPad <ch5-dpad-Left> component"
 * ]
 * @snippets
 * [
 * ]
 * 
 */

export interface ICh5DpadLeftAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`type` iconClass",
     * "***",
     * "The icon class gives the ability for the end developer to create custom arrow icons."
     * ]
     * @name iconClass
     */
    iconClass: string;

    /**
     * @documentation
     * [
     * "`type` iconUrl",
     * "***",
     * "A custom image that the user needs to pass the URL or the local file relative path, ",
     * "the iconUrl takes precedence over iconClass."
     * ]
     * @name iconUrl
     */
    iconUrl: string;

    /**
     * @documentation
     * [
     * "`type` disable",
     * "***",
     * "The default value is false. Enables or disables the button."
     * ]
     * @name disable
     * @default false
     */
    disable: boolean;

    /**
     * @documentation
     * [
     * "`type` show",
     * "***",
     * "The default value is true. Shows or hides the button."
     * ]
     * @name show
     * @default true
     */
    show: boolean;

    /**
     * @documentation
     * [
     * "`type` receiveStateIconClass",
     * "***",
     * "Use receiveStateIconClass attribute in order to change the icon through a signal. ",
     * "If a contract is used and 'useContractForIcons' is set to true, then the contract  ",
     * "will override the receiveStateIconClass."
     * ]
     * @name receiveStateIconClass
     */
    receiveStateIconClass: string;

    /**
     * @documentation
     * [
     * "`type` receiveStateIconUrl",
     * "***",
     * "Use receiveStateIconUrl attribute in order to change the icon through a signal.  If a ",
     * "contract is used and 'useContractForIcons' is set to true, then the contract will override ",
     * "the receiveStateIconUrl."
     * ]
     * @name receiveStateIconUrl
     */
    receiveStateIconUrl: string;
}
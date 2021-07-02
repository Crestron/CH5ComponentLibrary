// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

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

export interface ICh5DpadCenterAttributes extends ICh5CommonAttributes {

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
     * "`type` disabled",
     * "***",
     * "The default value is false. Enables or disables the button."
     * ]
     * @name disabled
     * @default false
     */
    disabled: boolean;

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
     * "`type` label",
     * "***",
     * "Label for the center button. "
     * ]
     * @name label
     */
    label: string;

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

    /**
     * @documentation
     * [
     * "`type` receiveStateLabel",
     * "***",
     * "Label for the center button. Only the label attribute for center button will be a part of ",
     * "<ch5-dpad> tag. Rest of the center button attributes will be a part of <ch5-dpad-button> tag."
     * ]
     * @name receiveStateLabel
     */
    receiveStateLabel: string;

    /**
     * @documentation
     * [
     * "`type` receivestatescriptlabelhtml",
     * "***",
     * "Html syntax string appropriate for element.innerHTML parameter. Signal ",
     * "script evaluation will be applied to the button.innerHTML.  Allows for ",
     * "multiline, multistyled labels."
     * ]
     * @name receivestatescriptlabelhtml
     */
    receivestatescriptlabelhtml: string;
}
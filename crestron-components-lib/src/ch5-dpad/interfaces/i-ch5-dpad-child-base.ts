// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Dpad Child
 * @isattribute false
 * @tagName ch5-Dpad Top
 * @role container
 * @description Ch5 Dpad Child Base
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-dpad-button-*` element",
 * "***",
 * "DPad <ch5-dpad-button-*> component"
 * ]
 * @snippets
 * [
 * ]
 * 
 */

export interface ICh5DpadChildBaseAttributes extends ICh5CommonAttributes {

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
     * "`sendeventonclick` attribute",
     * "***",
     * "Sends an event on click or tap (mouse or swipe up and down quickly).",
     * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event.",
     * "Examples include the SIMPL Logic Symbol for Toggle a with description of ",
     * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
     * ]
     * @name sendeventonclick
     */
    sendEventOnClick: string;
}
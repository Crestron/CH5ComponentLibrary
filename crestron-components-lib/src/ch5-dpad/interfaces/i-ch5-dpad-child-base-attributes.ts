// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5DpadChildButtonType } from "./t-ch5-dpad";

/**
 * @ignore
 */
export interface ICh5DpadChildBaseAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`iconClass` attribute",
     * "***",
     * "The icon class gives the ability for the end developer to create custom icons."
     * ]
     * @name iconclass
     * @attributeType "iconClass"
     */
    iconClass: string;

    /**
     * @documentation
     * [
     * "`iconUrl` attribute",
     * "***",
     * "A custom image that the user needs to pass the URL or the local file relative path, ",
     * "the iconUrl takes precedence over iconClass."
     * ]
     * @name iconurl
     * @attributeType "imageURL"
     */
    iconUrl: string;

    /**
     * @documentation
     * [
     * "`label` attribute",
     * "***",
     * "The label attributes gives the ability for the end developer to specify a label for the CENTER button only"
     * ]
     * @name label
     * @attributeType "string"
     * @hideWhen [
     *  { "key": ["up", "down", "left", "right"] }
     * ]
     * @showWhen [
     *  { "key": ["center"] }
     * ]
     */
    label: string;

    /**
     * @documentation
     * [
     * "`key` attribute",
     * "***",
     * "The key of the button to determine which button it is."
     * ]
     * @name key
     * @attributeType "string"
     */
     key: TCh5DpadChildButtonType;

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
     * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
     * @attributeType "join"
     */
    sendEventOnClick: string;

    /**
     * @documentation
     * [
     * "`pressed` attribute",
     * "***",
     * "The default value is false.",
     * "This property reflects the pressed state of the component. If set to true, ",
     * "'keypad-btn-pressed' will be applied as the CSS class on the component."
     * ]
     * @name pressed
     * @default false
     * @attributeType "boolean"
     */
    pressed: boolean;
}

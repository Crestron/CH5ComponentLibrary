// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ShowType } from "./types/t-ch5-show-type";

/**
 * @ignore
 */
export interface ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`id` attribute",
     * "***",
     * "This is a standard id HTML attribute"
     * ]
     * @name id
     */
    id: string;
    
    /**
     * @documentation
     * [
     * "`customclass` attribute",
     * "***",
     * "Contains a list of classes that are applies in the component. "
     * ]
     * @name customclass
     */
    customClass: string;

    /**
     * @documentation
     * [
     * "`customstyle` attribute",
     * "***",
     * "A list of space delimited style classes applied on the component."
     * ]
     * @name customstyle
     */
    customStyle: string;

    /**
     * @documentation
     * [
     * "`noshowtype` attribute",
     * "***",
     * "This property will reflect the type of the visibility of the item. See the 'data-ch5-noshow-type'",
     * "custom HTML attribute for further information"
     * ]
     * @name noshowtype
     */
    noshowType: TCh5ShowType;

    /**
     * @documentation
     * [
     * "`receivestatecustomclass` attribute",
     * "***",
     * "the value of this signal will be applied equivalent as a property on 'customClass'.",
     * "Change of value will remove prior value and then apply new value"
     * ]
     * @name receivestatecustomclass
     */
    receiveStateCustomClass: string;

    /**
     * @documentation
     * [
     * "`receivestatecustomstyle` attribute",
     * "***",
     * "the value of this signal will be applied equivalent as a property on 'styleClass'.",
     * "Change of value will remove prior value and then apply new value"
     * ]
     * @name receivestatecustomstyle
     */
    receiveStateCustomStyle: string;

    /**
     * @documentation
     * [
     * "`receivestateshow` attribute",
     * "***",
     * "While true, the boolean value of the signal determines if the component is seen by user"
     * ]
     * @name receivestateshow
     */
    receiveStateShow: string;

    /**
     * @documentation
     * [
     * "`'receivestateshowpulse` attribute",
     * "***",
     * "on transition from false to true, this signal will direct the component to be seen by user"
     * ]
     * @name receivestateshowpulse
     */
    receiveStateShowPulse: string;

    /**
     * @documentation
     * [
     * "`receivestatehidepulse` attribute",
     * "***",
     * "on transition from false to true, the signal will direct if the component to no longer be seen"
     * ]
     * @name receivestatehidepulse
     */
    receiveStateHidePulse: string;

    /**
     * @documentation
     * [
     * "`receivestateenable` attribute",
     * "***",
     * " while true, the boolean value of the signal determines if the component is enabled. Please note",
     * "the signal name is provided, the value of the signal has the opposite",
     * "convention of the 'disabled' attribute. This is to provide consistency with current programming practices. "
     * ]
     * @name receivestateenable
     */
    receiveStateEnable: string;

    /**
     * @documentation
     * [
     * "`sendeventonshow` attribute",
     * "***",
     * "boolean value of true when the component is visible and false when not visible.",
     * "Note, if component is completely covered by other visible elements, it is still considered visible."
     * ]
     * @name sendeventonshow
     */
    sendEventOnShow: string;

    /**
     * @documentation
     * [
     * "`appendclasswheninviewport` attribute",
     * "***",
     * "apply the provided value as class name while the component is visible and remove the class name when not visible"
     * ]
     * @name appendclasswheninviewport
     */
    appendClassWhenInViewPort: string;
}

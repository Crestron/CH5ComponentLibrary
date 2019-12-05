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
     * "This is the standard id HTML attribute."
     * ]
     * @name id
     */
    id: string;
    
    /**
     * @documentation
     * [
     * "`customclass` attribute",
     * "***",
     * "Contains a list of classes that are applied in the component."
     * ]
     * @name customclass
     */
    customClass: string;

    /**
     * @documentation
     * [
     * "`customstyle` attribute",
     * "***",
     * "Contains a list of space-delimited style classes applied in the component."
     * ]
     * @name customstyle
     */
    customStyle: string;

    /**
     * @documentation
     * [
     * "`noshowtype` attribute",
     * "***",
     * "This property reflects the visibility type of the item. See the 'data-ch5-noshow-type'",
     * "custom HTML attribute for further information."
     * ]
     * @name noshowtype
     */
    noshowType: TCh5ShowType;

    /**
     * @documentation
     * [
     * "`receivestatecustomclass` attribute",
     * "***",
     * "The value of this signal will be applied as an equivalent property on 'customClass'.",
     * "This value change will remove the prior value and then apply the new value."
     * ]
     * @name receivestatecustomclass
     */
    receiveStateCustomClass: string;

    /**
     * @documentation
     * [
     * "`receivestatecustomstyle` attribute",
     * "***",
     * "The value of this signal will be applied as an equivalent property on 'styleClass'.",
     * "This value change will remove the prior value and then apply the new value."
     * ]
     * @name receivestatecustomstyle
     */
    receiveStateCustomStyle: string;

    /**
     * @documentation
     * [
     * "`receivestateshow` attribute",
     * "***",
     * "The boolean value of the signal determines if the component is visible to the user."
     * "A true value indicates that the component is visible."
     * ]
     * @name receivestateshow
     */
    receiveStateShow: string;

    /**
     * @documentation
     * [
     * "`'receivestateshowpulse` attribute",
     * "***",
     * "On transition from false to true, this signal will reveal the component."
     * ]
     * @name receivestateshowpulse
     */
    receiveStateShowPulse: string;

    /**
     * @documentation
     * [
     * "`receivestatehidepulse` attribute",
     * "***",
     * "On transition from false to true, the signal will hide the component from view."
     * ]
     * @name receivestatehidepulse
     */
    receiveStateHidePulse: string;

    /**
     * @documentation
     * [
     * "`receivestateenable` attribute",
     * "***",
     * "The boolean value of the signal determines if the component is enabled."
     * "A true value indicates that the component is enabled. Note that ",
     * "the signal name is provided, and the value of the signal has the opposite",
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
     * "The boolean value is true when the component is visible and false when hidden.",
     * "Even if a component is covered completely by other visible elements, it is still considered visible."
     * ]
     * @name sendeventonshow
     */
    sendEventOnShow: string;

    /**
     * @documentation
     * [
     * "`appendclasswheninviewport` attribute",
     * "***",
     * "Apply the provided value as class name while the component is visible, and remove the class name when the component is hidden."
     * ]
     * @name appendclasswheninviewport
     */
    appendClassWhenInViewPort: string;
}

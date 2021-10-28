// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5TriggerviewAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`activeview` attribute",
     * "***",
     * "The default value is 0. Sets the view that will be shown using a 0-based index."
     * ]
     * @name activeview
     * @default 0
     */
    activeView: number;

    /**
     * @documentation
     * [
     * "`endless` attribute",
     * "***",
     * "The default value is false. The nextChildView method can be called on the last ChildView to open the first-child."
     * ]
     * @name endless
     * @default false
     */
    endless: boolean;

    /**
     * @documentation
     * [
     * "`gestureable` attribute",
     * "***",
     * "The default value is false. When set to true, gesturing will be supported. Adding this will ",
     * "change the behavior inside of the component. ",
     * "Refer to Gesture - Use Cases for more information."
     * ]
     * @name gestureable
     * @default false
     */
    gestureable: boolean;

    /**
     * @documentation
     * [
     * "`nested` attribute",
     * "***",
     * "The default value is false. ",
     * "A boolean attribute used to flag that ch5-triggerview is the child element on ch5-triggerview-child."
     * ]
     * @name nested
     * @default false
     */
    nested: boolean;

    /**
     * @documentation
     * [
     * "`sendeventshowchildindex` attribute",
     * "***",
     * "Sends the numeric value of the currently visible state.",
     * "Based on 0-based numbering."
     * ]
     * @name sendeventshowchildindex
     */
    sendEventShowChildIndex: string;

    /**
     * @documentation
     * [
     * "`receivestateshowchildindex` attribute",
     * "***",
     * "The receipt of the numeric value of this state will make ",
     * "the 0-based index of views in the component become visible."
     * ]
     * @name receivestateshowchildindex
     */
    receiveStateShowChildIndex: string;

    /**
     * @documentation
     * [
     * "`disableanimation` attribute",
     * "***",
     * "The default value is false. ",
     * "Disables the swipe-like animation when navigating through the ChildViews of the TriggerView."
     * ]
     * @name disableanimation
     * @default false
     */
    disableAnimation: boolean;
}

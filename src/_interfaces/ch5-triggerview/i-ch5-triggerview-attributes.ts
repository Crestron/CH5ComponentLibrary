// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";

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
     * "Disables the swipe-like animation when navigating through the ChildViews of the TriggerView."
     * ]
     * @name disableanimation
     */
    disableAnimation: boolean;
}

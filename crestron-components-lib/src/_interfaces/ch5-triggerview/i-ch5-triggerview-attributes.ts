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
     * "Default 0. Which view will be shown. 0-based index."
     * ]
     * @name activeview
     */
    activeView: number;

    /**
     * @documentation
     * [
     * "`sendeventshowchildindex` attribute",
     * "***",
     * "Send the numeric value of currently visible state.",
     * "Based on zero-based numbering."
     * ]
     * @name sendeventshowchildindex
     */
    sendEventShowChildIndex: string;


    /**
     * @documentation
     * [
     * "`receivestateshowchildindex` attribute",
     * "***",
     * "Receipt of the numeric value of this state will make",
     * "the zero based index of views in the component become visible."
     * ]
     * @name receivestateshowchildindex
     */
    receiveStateShowChildIndex: string;
    
    /**
     * @documentation
     * [
     * "`disableanimation` attribute",
     * "***",
     * "Disable swipe-like animation when navigating through the ChildViews of the TriggerView"
     * ]
     * @name disableanimation
     */
    disableAnimation: boolean;
}

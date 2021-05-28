// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @name Ch5 Trigger View
 * @isattribute false
 * @tagName ch5-triggerview
 * @role listbox
 * @description Ch5 Trigger View will be used to group content, each component will be wrap inside an ChildView Component
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-triggerview` element",
 * "***",
 * "A container-like component for organizing content into multiple subgroups (ch5-triggerview-child). Each ChildView can be viewed as a separate page or tab."
 * ]
 * @snippets
 * [
 *        {
 *            "prefix": "ch5-triggerview:blank",
 *            "body": [
 *                "<ch5-triggerview>",
 *                "    <ch5-triggerview-child>",
 *                "    </ch5-triggerview-child> ",
 *                "</ch5-triggerview>"
 *            ],
 *            "description": "Crestron Triggerview (Blank)"
 *        },
 *        {
 *            "prefix": "ch5-triggerview:default",
 *            "body": [
 *                "<ch5-triggerview activeview=\"${1:1}\" gestureable=\"${2:true}\" endless=\"${3:true}\"> ",
 *                "    <ch5-triggerview-child>",
 *                "        <div class=\"viewcontent\">",
 *                "            <h1>First View</h1>",
 *                "        </div>",
 *                "    </ch5-triggerview-child> ",
 *                "    <ch5-triggerview-child>",
 *                "        <div class=\"viewcontent\">",
 *                "            <h1>Second View</h1>",
 *                "        </div>",
 *                "    </ch5-triggerview-child>",
 *                "    <ch5-triggerview-child>",
 *                "        <div class=\"viewcontent\">",
 *                "            <h1>Third View</h1>",
 *                "        </div>",
 *                "    </ch5-triggerview-child>",
 *                "</ch5-triggerview>"
 *            ],
 *            "description": "Crestron Triggerview (Default)"
 *        },
 *        {
 *            "prefix": "ch5-triggerview:signals",
 *            "body": [
 *                "<ch5-triggerview activeview=\"${1:1}\" sendeventshowchildindex=\"${2:send_index_view}\" receivestateshowchildindex=\"${3:receive_index_view}\" > ",
 *                "    <ch5-triggerview-child>",
 *                "        <div class=\"viewcontent\">",
 *                "            <h1>First View</h1>",
 *                "        </div>",
 *                "    </ch5-triggerview-child> ",
 *                "    <ch5-triggerview-child>",
 *                "        <div class=\"viewcontent\">",
 *                "            <h1>Second View</h1>",
 *                "        </div>",
 *                "    </ch5-triggerview-child>",
 *                "    <ch5-triggerview-child>",
 *                "        <div class=\"viewcontent\">",
 *                "            <h1>Third View</h1>",
 *                "        </div>",
 *               "    </ch5-triggerview-child>",
 *                "</ch5-triggerview>"
 *            ],
 *            "description": "Crestron Triggerview Signals"
 *        }
 * ]
 *
 */

/**
 * @ignore
 */
export interface ICh5TriggerviewAttributes {

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
     */
    gestureable: boolean;

    /**
     * @documentation
     * [
     * "`nested` attribute",
     * "***",
     * "A boolean attribute used to flag that ch5-triggerview is the child element on ch5-triggerview-child."
     * ]
     * @name nested
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
     * "Disables the swipe-like animation when navigating through the ChildViews of the TriggerView."
     * ]
     * @name disableanimation
     */
    disableAnimation: boolean;
}

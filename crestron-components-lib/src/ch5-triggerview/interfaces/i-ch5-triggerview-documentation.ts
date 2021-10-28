// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5TriggerviewAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Trigger View
 * @isattribute false
 * @tagName ch5-triggerview
 * @role listbox
 * @description Ch5 Trigger View will be used to group content, each component will be wrap inside an ChildView Component
 * @componentVersion 1.0.0
 * @childElements
 * [
 *   {
 *     "tagName": "ch5-triggerview-child",
 *     "optional": false,
 *     "childElements": []
 *   }
 * ]
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
 export interface ICh5TriggerviewDocumentation extends ICh5Common, ICh5TriggerviewAttributes {
}
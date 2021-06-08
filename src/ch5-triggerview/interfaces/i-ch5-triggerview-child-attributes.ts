// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Trigger View Child
 * @isAttribute false
 * @tagName ch5-triggerview-child
 * @description Ch5 Trigger View Child - content wrapper for ch5-triggerview.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-triggerview-child` attribute",
 * "***",
 * "Each TriggerView child is similar to a standalone page, and navigating between pages is done via swiping."
 * ]
 * @snippets
 * [
 *     {
 *       "prefix": "ch5-triggerview:child-send-signals",
 *       "body": [
 *           "<ch5-triggerview activeview=\"${1:1}\"> ",
 *           "    <ch5-triggerview-child sendeventonshow=\"${2:first_child_is_shown}\">",
 *           "        <div class=\"viewcontent\">",
 *           "            <h1>First View</h1>",
 *           "        </div>",
 *           "    </ch5-triggerview-child > ",
 *           "    <ch5-triggerview-child sendeventonshow=\"${3:second_child_is_shown}\">",
 *           "        <div class=\"viewcontent\">",
 *           "            <h1>Second View </h1>",
 *           "        </div> ",
 *           "    </ch5-triggerview-child >",
 *           "    <ch5-triggerview-child sendeventonshow=\"${4:third_child_is_shown}\">",
 *           "        <div class=\"viewcontent\">",
 *           "            <h1>Third View </h1>",
 *           "        </div> ",
 *           "    </ch5-triggerview-child >",
 *           "</ch5-triggerview>"
 *       ],
 *       "description": "Crestron Triggerview Child Send Signals"
 *    },
 *    {
 *        "prefix": "ch5-triggerview:child-receive-signals",
 *        "body": [
 *            "<ch5-triggerview activeview=\"${1:1}\"> ",
 *            "    <ch5-triggerview-child receivestateshow=\"${2:show_first_view_signal}\">",
 *            "        <div class=\"viewcontent\">",
 *            "            <h1>First View</h1>",
 *            "        </div>",
 *            "    </ch5-triggerview-child > ",
 *            "    <ch5-triggerview-child receivestateshow=\"${3:show_second_view_signal}\">",
 *            "        <div class=\"viewcontent\">",
 *            "            <h1>Second View </h1>",
 *            "        </div> ",
 *            "    </ch5-triggerview-child >",
 *            "    <ch5-triggerview-child receivestateshow=\"${4:show_third_view_signal}\">",
 *            "        <div class=\"viewcontent\">",
 *            "            <h1>Third View </h1>",
 *            "        </div> ",
 *            "    </ch5-triggerview-child >",
 *            "</ch5-triggerview>"
 *        ],
 *        "description": "Crestron Triggerview Signals"
 *    }
 * ]
 */

export interface ICh5TriggerViewChildAttributes extends ICh5Common {
  
  /**
   * @documentation
   * [
   * "`sendeventonshow` attribute",
   * "***",
   * "Sends a digital pulse when a child view becomes visible. Allows the control system ",
   * "to take various actions based on which view is active."
   * ]
   * @name sendeventonshow
   */
  sendEventOnShow: string;

  /**
   * @documentation
   * [
   * "`receivestateshow` attribute",
   * "***",
   * "When true, this will tell the parent component (ch5-triggerview) to hide all the other ChildViews and to only show this one."
   * ]
   * @name receivestateshow
   */
  receiveStateShow: string;

}

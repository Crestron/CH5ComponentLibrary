// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5OverlayPanelAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Overlay Panel
 * @isattribute false
 * @tagName ch5-overlay-panel
 * @role dialog
 * @description Ch5 Overlay Panel
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-overlay-panel` element",
 * "***",
 * "The overlay panel component provides a content container for other components that ",
 * "'pop up' on top of and overlays the main content container."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-overlay-panel:blank",
 *       "description": "Crestron Overlay Panel (Blank)",
 *       "body": [
 *           "<ch5-overlay-panel>",
 *           "</ch5-overlay-panel>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-overlay-panel:default",
 *       "description": "Crestron Overlay Panel (Default)",
 *       "body": [
 *           "<ch5-overlay-panel receivestateshowpulse=\"${1:trigger_1}\" closable>",
 *           "    <p>Sample text</p>",
 *          "    <ch5-image id=\"${2:ex1-img}\" url=\"${3:some_server_url}\">",
 *           "    </ch5-image>",
 *           "</ch5-overlay-panel>$0"
 *       ]
 *    },
 *    {
 *        "prefix": "ch5-overlay-panel:signals",
 *        "description": "Crestron Overlay Panel Signals",
 *        "body": [
 *            "<ch5-overlay-panel",
 *            "    receivestateshowpulse=\"${1:trigger_1}\"",
 *            "    closable",
 *           "    sendeventonshow=\"${1:signal_on_show}\"",
 *            "    sendeventonbeforeshow=\"${2:signal_on_before_show}\"",
 *            "    sendeventonaftershow=\"${3:signal_on_after_show}\"",
 *            "    sendeventonbeforehide=\"${4:signal_on_before_hide}\"",
 *            "    sendeventonafterhide=\"${5:signal_on_after_hide}\"",
 *            "    >",
 *            "    <p>Sample text</p>",
 *            "    <ch5-image id=\"${8:ex1-img}\" url=\"${9:some_server_url}\">",
 *            "    </ch5-image>",
 *            "</ch5-overlay-panel>$0"
 *        ]
 *    }
 * ]
 */
 export interface ICh5OverlayPanelDocumentation extends ICh5Common, ICh5OverlayPanelAttributes {
}
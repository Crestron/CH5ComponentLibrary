// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5FormAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Form
 * @isattribute false
 * @tagName ch5-form
 * @role form
 * @description Ch5 Form offers a wide range of functionality out-of-the-box.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *   "`ch5-form` element",
 *   "***",
 *   " This component provides a container for which 'input' style components, such as TextEntry, ",
 *   "Slider, Toggle Switch, Select, and Spinner, can be grouped together to update their send signals upon a ",
 *   "Submit button press or to revert to their receive signal value upon a Cancel button press."
 * ]
 * @snippets
 * [
 *   {
 *    "prefix": "ch5-form:blank",
 *     "description": "Crestron Form (blank)",
 *     "body": [
 *       "<ch5-form>",
 *       "</ch5-form>$0"
 *     ]
 *   },
 *   {
 *       "prefix": "ch5-form:default",
 *       "description": "Crestron Form (default)",
 *       "body": [
 *           "<ch5-form>",
 *           "    <h2>Room X</h2>",
 *           "    ",
 *           "    <h5>Do not disturb</h5>",
 *           "    <ch5-toggle",
 *           "        labelon=\"On\"",
 *           "        labeloff=\"Off\"",
 *           "        feedbackmode=\"submit\"",
 *           "        receivestatevalue=\"room_donotdisturb_selected\"",
 *           "        sendeventonclick=\"room_donotdisturb_clicked\">",
 *           "    </ch5-toggle>",
 *           "",
 *           "",
 *           "    <h5>Temperature</h5>",
 *           "    <ch5-slider",
 *           "        feedbackmode=\"submit\"",
 *           "        receivestatevalue=\"room_thermostat_set_fb\"",
 *           "        sendeventonchange=\"room_thermostat_set\"",
 *           "        step=\"10\"",
 *           "        min=\"0\"",
 *           "        max=\"100\">",
 *           "    </ch5-slider>",
 *           "",
 *           "    ",
 *           "    <ch5-select size=\"4\" indexid=\"idx\" mode=\"panel\"",
 *           "                 feedbackmode=\"submit\"",
 *           "                 sendeventonchange=\"select_send_change_signal\"",
 *           "                 receivestatevalue=\"select_receive_signal_value\"",
 *           "                 noneselectedprompt=\"Select\">",
 *           "         <template>",
 *           "            <ch5-select-option>",
 *           "                <span>Option {{idx}}</span>",
 *           "            </ch5-select-option>",
 *           "         </template>",
 *           "    </ch5-select>",
 *           "</ch5-form>"
 *      ]
 *     },
 *   {
 *       "prefix": "ch5-form:custom-buttons",
 *       "description": "Crestron Form with custom submit and cancel buttons inside",
 *       "body": [
 *          "<ch5-form>",
 *           "    <h2>Room X</h2>",
 *           "    ",
 *           "    <h5>Do not disturb</h5>",
 *           "    <ch5-toggle",
 *           "        labelon=\"On\"",
 *           "        labeloff=\"Off\"",
 *           "        feedbackmode=\"submit\"",
 *           "        receivestatevalue=\"room_donotdisturb_selected\"",
 *           "        sendeventonclick=\"room_donotdisturb_clicked\">",
 *           "    </ch5-toggle>",
 *           "",
 *           "",
 *           "    <h5>Temperature</h5>",
 *           "    <ch5-slider",
 *           "        feedbackmode=\"submit\"",
 *           "        receivestatevalue=\"room_thermostat_set_fb\"",
 *           "        sendeventonchange=\"room_thermostat_set\"",
 *           "        step=\"10\"",
 *           "        min=\"0\"",
 *           "        max=\"100\">",
 *           "    </ch5-slider>",
 *           "",
 *           "    ",
 *           "    <ch5-select size=\"4\" indexId=\"idx\" mode=\"panel\"",
 *           "                 feedbackmode=\"submit\"",
 *           "                 sendeventonchange=\"select_send_change_signal\"",
 *           "                 receivestatevalue=\"select_receive_signal_value\"",
 *           "                 noneselectedprompt=\"Select\">",
 *           "         <template>",
 *           "            <ch5-select-option>",
 *           "                <span>Option {{idx}}</span>",
 *           "            </ch5-select-option>",
 *           "         </template>",
 *           "    </ch5-select>",
 *           "",
 *           "    <ch5-button id=\"room_submit_id\" formtype=\"submit\" label=\"Update Room\"></ch5-button>",
 *           "    <ch5-button id=\"room_cancel_id\" formtype=\"cancel\" label=\"Revert Changes\"></ch5-button>",
 *           "</ch5-form>"
 *       ]
 *     }
 * ]
 *
 */
export interface ICh5FormDocumentation extends ICh5Common, ICh5FormAttributes {
}
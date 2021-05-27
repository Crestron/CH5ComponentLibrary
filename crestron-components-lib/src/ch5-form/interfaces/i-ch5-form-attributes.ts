// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ButtonType } from "../../ch5-button/interfaces/t-ch5-button";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

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

/**
 * @ignore
 */
export interface ICh5FormAttributes extends ICh5CommonAttributes {

  /**
   * @name submitbuttonlabel
   * @documentation
   * [
   * "`submitbuttonlabel` attribute",
   * "***",
   * "Represents the label of the Submit button."
   * ]
   */
  submitButtonLabel: string;

  /**
   * @name submitbuttonicon
   * @documentation
   * [
   * "`submitbuttonicon` attribute",
   * "***",
   * "Represents the icon of the Submit button."
   * ]
   */
  submitButtonIcon: string;

  /**
   * @name submitbuttonstyle
   * @documentation
   * [
   * "`submitbuttonStyle` attribute",
   * "***",
   * "Represents the style of the Submit button."
   * ]
   */
  submitButtonStyle: string;

  /**
   * @name submitbuttontype
   * @documentation
   * [
   * "`submitbuttontype` attribute",
   *  "***",
   *  "Represents the type of the auto-generated Submit button."
   * ]
   */
    submitButtonType: TCh5ButtonType;

  /**
   * @name cancelbuttonlabel
   * @documentation
   * [
   * "`cancelbuttonlabel` attribute",
   * "***",
   * "Represents the label of the Cancel button."
   * ]
   */
  cancelButtonLabel: string;

  /**
   * @name cancelbuttonicon
   * @documentation
   * [
   * "`cancelbuttonicon` attribute",
   * "***",
   * "Represents the icon of the Cancel button."
   * ]
   */
  cancelButtonIcon: string;

  /**
   * @name cancelbuttonstyle
   * @documentation
   * [
   * "`cancelbuttonstyle` attribute",
   * "***",
   * "Represents the style of the Cancel button."
   * ]
   */
  cancelButtonStyle: string;

  /**
   * @name cancelbuttontype
   * @documentation
   * [
   * "`cancelButtonType` attribute",
   *  "***",
   *  "Represents the type of the auto-generated Cancel button."
   * ]
   */
  cancelButtonType: TCh5ButtonType;

  /**
   * @name submitid
   * @documentation
   * [
   * "`submitid` attribute",
   * "***",
   * "Represents the ID of the Submit button."
   * ]
   */
  submitId: string;

  /**
   * @name cancelid
   * @documentation
   * [
   * "`cancelId` attribute",
   * "***",
   * "Represents the ID of the Cancel button."
   * ]
   */
  cancelId: string;
}

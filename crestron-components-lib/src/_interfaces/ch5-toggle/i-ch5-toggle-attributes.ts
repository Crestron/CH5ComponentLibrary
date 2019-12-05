// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonInput, ICh5CommonInputAttributes } from "../ch5-common-input";
import { TCh5CommonInputFeedbackModes } from "../ch5-common-input/types";
import { TCh5ToggleOrientation, TCh5ToggleShape } from "./types";

/**
 * @ignore
 */
export interface ICh5ToggleAttributes extends ICh5CommonInputAttributes {

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "The label value."
   * ]
   * @name label
   */
  label: string;

  /**
   * @documentation
   * [
   * "`labelon` attribute",
   * "***",
   * "Custom text to display on the toggle when the toggle is ON."
   * ]
   * @name labelon
   */
  labelOn: string;

  /**
   * @documentation
   * [
   * "`labeloff` attribute",
   * "***",
   * "Custom text to display on the toggle when the toggle is OFF."
   * ]
   * @name labeloff
   */
  labelOff: string;

  /**
   * @documentation
   * [
   * "`iconon` attribute",
   * "***",
   * "Specifies a custom icon class when the toggle is ON."
   * ]
   * @name iconon
   */
  iconOn: string;

  /**
   * @documentation
   * [
   * "`iconoff` attribute",
   * "***",
   * "Specifies a custom icon class when the toggle is OFF."
   * ]
   * @name iconoff
   */
  iconOff: string;

  /**
   * @documentation
   * [
   * "`handleshape` attribute",
   * "***",
   * "The default value is 'circle'. Sets the shape that will also determine the shape",
   * "of the component (rectangle or circle)."
   * ]
   * @name handleshape
   */
  handleShape: TCh5ToggleShape;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'. Sets",
   * "the control elements in a horizontal or vertical orientation.",
   * "For vertical alignment, it will apply a CSS class that will rotate the ",
   * "component -90 degrees (270 degrees clockwise, 90 degrees counter clockwise)."
   * ]
   * @name orientation
   */
  orientation: TCh5ToggleOrientation;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "The default value is 1500. Defines the time between when the user clicks the",
   * "toggle and the time the toggle will check if the value is equal",
   * "with the value from the signal. If the value is not equal, it will apply",
   * "the value from the signal automatically. Apply only for feedbackMode direct."
   *
   * ]
   * @name signalvaluesynctimeout
   */
  signalValueSyncTimeout: string | number;

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "The default value is 'direct'. If direct, value send and receive will be",
   * "instant. On submit, it will send and listen for the first event received."
   * ]
   * @name feedbackmode
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`receivestatescriptlabelhtml` attribute",
   * "***",
   * "The value of the switch."
   * ]
   * @name receivestatescriptlabelhtml
   */
  receiveStateScriptLabelHtml: string;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "The receiving value from the signal."
   * ]
   * @name receivestatevalue
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "Sends a signal on a click or tap event (mouse or swipe up and down quickly)."
   * ]
   * @name sendeventonclick
   */
  sendEventOnClick: string;
}

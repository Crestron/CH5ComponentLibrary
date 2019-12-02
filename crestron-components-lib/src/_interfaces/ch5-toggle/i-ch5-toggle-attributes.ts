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
   * "Label value"
   * ]
   * @name label
   */
  label: string;

  /**
   * @documentation
   * [
   * "`labelon` attribute",
   * "***",
   * "Custom text to display on the toggle when the toggle is ON"
   * ]
   * @name labelon
   */
  labelOn: string;

  /**
   * @documentation
   * [
   * "`labeloff` attribute",
   * "***",
   * "Custom text to display on the toggle when the toggle is OFF"
   * ]
   * @name labeloff
   */
  labelOff: string;

  /**
   * @documentation
   * [
   * "`iconon` attribute",
   * "***",
   * "Specify a custom icon class when the toggle is ON"
   * ]
   * @name iconon
   */
  iconOn: string;

  /**
   * @documentation
   * [
   * "`iconoff` attribute",
   * "***",
   * "Specify a custom icon class when the toggle is OFF"
   * ]
   * @name iconoff
   */
  iconOff: string;

  /**
   * @documentation
   * [
   * "`handleshape` attribute",
   * "***",
   * "Default circle. Handle Shape. That will also determine the shape",
   * "of the component ( rectangle or circle )"
   * ]
   * @name handleshape
   */
  handleShape: TCh5ToggleShape;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "Default 'horizontal'. Valid values horizontal, vertical. Lays out",
   * "the elements of the control in a horizontal or vertical manner.",
   * "For vertical alignment it will apply a css class that will rotate the ",
   * "component -90 degrees ( 270 degrees clockwise, 90 degrees counter clockwise )."
   * ]
   * @name orientation
   */
  orientation: TCh5ToggleOrientation;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "Default 1500. Defines the time between the user click the",
   * "toggle and the time the toggle will check if the value is equal",
   * "with the value from the signal. If not it will automatically apply",
   * "the value from the signal. Apply only for feedbackMode direct "
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
   * "Default 'direct'. If direct, send and receive of value will be",
   * "instant. On submit it will send and listen for the first event receive."
   * ]
   * @name feedbackmode
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`receivestatescriptlabelhtml` attribute",
   * "***",
   * "The value of the switch"
   * ]
   * @name receivestatescriptlabelhtml
   */
  receiveStateScriptLabelHtml: string;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "Receiving value from signal"
   * ]
   * @name receivestatevalue
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "Send signal on click or tap event (mouse or finger up and down in a small period of time)"
   * ]
   * @name sendeventonclick
   */
  sendEventOnClick: string;
}

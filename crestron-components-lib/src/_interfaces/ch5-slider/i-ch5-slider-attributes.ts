// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import {
  TCh5SliderOrientation,
  TCh5SliderShape,
  TCh5SliderSize,
  TCh5SliderStretch,
  TCh5SliderTooltipDisplay,
  TCh5SliderTooltipType
} from "./types";
import { TCh5CommonInputFeedbackModes } from "../ch5-common-input/types";

/**
 * @ignore
 */
export interface ICh5SliderAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`handleshape` attribute",
   * "***",
   * "Default: rounded-rectangle. Valid Values: rectangle, circle, oval,",
   * "rounded-rectangle. Defines the handle shape."
   * ]
   * @name handleshape
   */
  handleShape: TCh5SliderShape;

  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "Initial values of single value or lower value if range=true"
   * ]
   * @name value
   */
  value: number | string;

  /**
   * @documentation
   * [
   * "`valuehigh` attribute",
   * "***",
   * "Higher value only applicable if range=true"
   * ]
   * @name valuehigh
   */
  valueHigh: number | string;

  /**
   * @documentation
   * [
   * "`max` attribute",
   * "***",
   * "Maximum value"
   * ]
   * @name max
   */
  max: number | string;

  /**
   * @documentation
   * [
   * "`min` attribute",
   * "***",
   * "Minimum value"
   * ]
   * @name min
   */
  min: number | string;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "Default horizontal. Valid values: horizontal, vertical"
   * ]
   * @name orientation
   */
  orientation: TCh5SliderOrientation;

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Default regular. Valid values: x-small, small, regular, large, xlarge"
   * ]
   * @name size
   */
  size: TCh5SliderSize;

  /**
   * @documentation
   * [
   * "`handlesize` attribute",
   * "***",
   * "Size of the handle",
   * "Default regular. Valid values: x-small, small, regular, large, x-large"
   * ]
   * @name handlesize
   */
  handleSize: TCh5SliderSize;

  /**
   * @documentation
   * [
   * "`step` attribute",
   * "***",
   * "Default 100. Maximum 100.",
   * "Defines the number of steps values in the slider.",
   * "If you want quarters 0, 25, 50, 75, 100 then 5 is the numbers of steps"
   * ]
   * @name step
   */
  step: number | string;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "Default both. Valid Values: width, height, both",
   * "When stretch property is set, the slider inherits the width or/and",
   * "height of the container"
   * ]
   * @name stretch
   */
  stretch: TCh5SliderStretch;

  /**
   * @documentation
   * [
   * "`ticks` attribute",
   * "***",
   * "Defines the ticks on the slider.",
   * "It will be an advanced tick scales: non-linear or logarithmic.",
   * "You can create sliders with ever-increasing increments by",
   * "specifying the value for the slider at certain intervals.",
   * "- The first value define the % position along the length of the slider scale to place a tick mark.",
   * "- The second value will be the label value to place next to the tick at that position.",
   * "***",
   * "An example would be [[0.0,'-60'], [0.25,'-40'], [0.50,'-20'],[0.75,'-10'], [1.0,'0']]"
   * ]
   * @name ticks
   */
  ticks: string;

  /**
   * @documentation
   * [
   * "`tooltipshowtype` attribute",
   * "***",
   * "Default 'off'.  Option to display a tooltip above (horizontal), right(vertical) of the handle.  Valid values are",
   * "-'off' not displayed",
   * "-'on' always displayed",
   * "-'auto' displayed while user interact with the slider"
   * ]
   * @name tooltipshowtype
   */
  toolTipShowType: TCh5SliderTooltipType

  /**
   * @documentation
   * [
   * "`tooltipdisplaytype` attribute",
   * "***",
   * "Default: percent. Option of what is displayed in the tooltip. Valid values are:",
   * "'%' - displayed as percent.",
   * "'value' - actual value provided"
   * ]
   * @name tooltipdisplaytype
   */
  toolTipDisplayType: TCh5SliderTooltipDisplay;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "Default 1500. Defines the time (milliseconds) between the user",
   * "release the handle of the slider and the time the slider will check",
   * "if the value is equal with the value from the signal. If not it will automatically apply the value from the signal. "
   * ]
   * @name signalvaluesynctimeout
   */
  signalValueSyncTimeout: string | number;

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "If direct send and receive of value will be instant. On submit it",
   * "will send and listen for the first event receive."
   * ]
   * @name feedbackmode
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "On receive, change the value of the slider handle"
   * ]
   * @name receivestatevalue
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`receivestatevaluehigh` attribute",
   * "***",
   * "On receive, change the value of the right slider handle, available when range is true"
   * ]
   * @name receivestatevaluehigh
   */
  receiveStateValueHigh: string;

  /**
   * @documentation
   * [
   * "`sendeventonchange` attribute",
   * "***",
   * "Send signal value on slider change"
   * ]
   * @name sendeventonchange
   */
  sendEventOnChange: string;

  /**
   * @documentation
   * [
   * "`sendeventonchangehigh` attribute",
   * "***",
   * "If range slider is set to true, send signal value high on slider change"
   * ]
   * @name sendeventonchangehigh
   */
  sendEventOnChangeHigh: string;

}

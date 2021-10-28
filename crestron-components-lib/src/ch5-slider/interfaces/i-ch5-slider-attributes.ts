// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5SliderShape, TCh5SliderOrientation, TCh5SliderSize, TCh5SliderStretch, TCh5SliderTooltipType, TCh5SliderTooltipDisplay } from ".";
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5SliderAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`handleshape` attribute",
   * "***",
   * "The default value is 'rounded-rectangle'. Valid Values: 'rectangle', 'circle', 'oval', ",
   * "'rounded-rectangle'. Defines the handle shape."
   * ]
   * @name handleshape
   * @default rounded-rectangle
   */
  handleShape: TCh5SliderShape;

  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "The initial values of single value or lower value if range=true."
   * ]
   * @name value
   */
  value: number | string;

  /**
   * @documentation
   * [
   * "`valuehigh` attribute",
   * "***",
   * "The higher value only applicable if range=true."
   * ]
   * @name valuehigh
   */
  valueHigh: number | string;

  /**
   * @documentation
   * [
   * "`max` attribute",
   * "***",
   * "The maximum value."
   * ]
   * @name max
   */
  max: number | string;

  /**
   * @documentation
   * [
   * "`min` attribute",
   * "***",
   * "The minimum value."
   * ]
   * @name min
   */
  min: number | string;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'. ",
   * "The orientation of the slider."
   * ]
   * @name orientation
   * @default horizontal
   */
  orientation: TCh5SliderOrientation;

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "The default value is 'regular'. Valid values: 'x-small', 'small', 'regular', 'large', 'xlarge'. ",
   * "The size of the slider."
   * ]
   * @name size
   * @default regular
   */
  size: TCh5SliderSize;

  /**
   * @documentation
   * [
   * "`handlesize` attribute",
   * "***",
   * "The default value is 'regular'. The size of the handle.",
   * "Valid values: 'x-small', 'small', 'regular', 'large', 'x-large'."
   * ]
   * @name handlesize
   * @default regular
   */
  handleSize: TCh5SliderSize;

  /**
   * @documentation
   * [
   * "`step` attribute",
   * "***",
   * "The default value is 100. The maximum value is 100. ",
   * "Defines the number of steps values in the slider. ",
   * "For example, if the slider should have quarters 0, 25, 50, 75, 100, then 5 is the numbers of steps."
   * ]
   * @name step
   * @default 100
   */
  step: number | string;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "The default value is 'both'. Valid Values: 'width', 'height', 'both'. ",
   * "When the stretch property is set, the slider inherits the width and/or ",
   * "height of the container."
   * ]
   * @name stretch
   * @default both
   */
  stretch: TCh5SliderStretch | null;

  /**
   * @documentation
   * [
   * "`ticks` attribute",
   * "***",
   * "Defines the ticks on the slider. ",
   * "This definition is based on advanced tick scales: non-linear or logarithmic. ",
   * "Sliders can be created with ever-increasing increments b ",
   * "specifying the value for the slider at certain intervals. ",
   * "- The first value defines the % position along the length of the slider scale to place a tick mark. ",
   * "- The second value is the label value to place next to the tick at that position.",
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
   * "The default value is 'off'.  Provides the ability to display a tooltip above (horizontal) or right (vertical) of the handle.  Valid values: ",
   * "-'off': Not displayed ",
   * "-'on': Always displayed ",
   * "-'auto': Displayed while user interacts with the slider"
   * ]
   * @name tooltipshowtype
   * @default off
   */
  toolTipShowType: TCh5SliderTooltipType

  /**
   * @documentation
   * [
   * "`tooltipdisplaytype` attribute",
   * "***",
   * "The default value is 'percent'. Sets what is displayed in the tooltip. Valid values: ",
   * "'%' - The value is displayed as a percent ",
   * "'value' - The actual value provided"
   * ]
   * @name tooltipdisplaytype
   * @default percent
   */
  toolTipDisplayType: TCh5SliderTooltipDisplay;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "The default value is 1500. Defines the time (milliseconds) between when the user ",
   * "releases the slider handle and the time the slider will check ",
   * "if the value is equal with the value from the signal. If not, it will automatically apply the value from the signal."
   * ]
   * @name signalvaluesynctimeout
   * @default 1500
   */
  signalValueSyncTimeout: string | number;

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "The default value is direct. ",
   * "If set to direct, value send and receive will be instant. On submit, it ",
   * "will send and listen for the first received event."
   * ]
   * @name feedbackmode
   * @default direct
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`onclean` attribute",
   * "***",
   * "Runs when a clean event is initiated."
   * ]
   * @name onclean
   */
  onclean: {};

  /**
   * @documentation
   * [
   * "`ondirty` attribute",
   * "***",
   * "Runs when a dirty event is initiated."
   * ]
   * @name ondirty
   */
  ondirty: {};

  /**
   * @documentation
   * [
   * "`range` attribute",
   * "***",
   * "The default value is false. If true, the slider will have two handles so two different values can be defined."
   * ]
   * @name range
   * @default false
   */
  range: boolean;

  /**
   * @documentation
   * [
   * "`showtickvalues` attribute",
   * "***",
   * "The default value is false. Provides the ability to display value labels next to tick marks ",
   * "at each tick increment."
   * ]
   * @name showtickvalues
   * @default false
   */
  showTickValues: boolean;

  /**
   * @documentation
   * [
   * "`noHandle` attribute",
   * "***",
   * "The default value is false. Hides the slider handle."
   * ]
   * @name nohandle
   * @default false
   */
  noHandle: boolean

  /**
   * @documentation
   * [
   * "`tapSettable` attribute",
   * "***",
   * "The default value is false. Sets the slider value on tap."
   * ]
   * @name tapsettable
   * @default false
   */
  tapSettable: boolean

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "On receive, changes the value of the slider handle."
   * ]
   * @name receivestatevalue
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`receivestatevaluehigh` attribute",
   * "***",
   * "On receive, changes the value of the right slider handle (available when range is true)."
   * ]
   * @name receivestatevaluehigh
   */
  receiveStateValueHigh: string;

  /**
   * @documentation
   * [
   * "`sendeventonchange` attribute",
   * "***",
   * "Sends a signal value on slider change."
   * ]
   * @name sendeventonchange
   */
  sendEventOnChange: string;

  /**
   * @documentation
   * [
   * "`sendeventonchangehigh` attribute",
   * "***",
   * "If a range slider is set to true, sends a signal value high on slider change."
   * ]
   * @name sendeventonchangehigh
   */
  sendEventOnChangeHigh: string;

}

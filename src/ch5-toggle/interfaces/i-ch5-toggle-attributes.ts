// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


import { ICh5CommonInputAttributes } from "../../ch5-common-input/interfaces/i-ch5-common-input-attributes";
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";
import { TCh5ToggleOrientation, TCh5ToggleShape } from "./index";

/**
 * @ignore
 */
export interface ICh5ToggleAttributes extends ICh5CommonInputAttributes {

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "The label of the toggle element."
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
   * "The default value is 'circle'. Sets the shape that will also determine the shape ",
   * "of the component (rectangle or circle)."
   * ]
   * @name handleshape
   * @default circle
   */
  handleShape: TCh5ToggleShape;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'. Sets ",
   * "the control elements in a horizontal or vertical orientation. ",
   * "For vertical alignment, it will apply a CSS class that will rotate the ",
   * "component -90 degrees (270 degrees clockwise, 90 degrees counter clockwise)."
   * ]
   * @name orientation
   * @default horizontal
   */
  orientation: TCh5ToggleOrientation;
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
   * "`value` attribute",
   * "***",
   * "The default value is false. The initial value of the component. ",
   * "When feedbackMode=submit, this property will change to the last ",
   * "value submitted. When reset, the value property will be changed to ",
   * "the initial value or last value on submit."
   * ]
   * @name value
   * @default false
   */
  value: boolean;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "The default value is 1500. Defines the time between when the user clicks the ",
   * "toggle and the time the toggle will check if the value is equal ",
   * "with the value from the signal. If the value is not equal, it will apply ",
   * "the value from the signal automatically. Apply only for feedbackMode direct."
   *
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
   * "The default value is 'direct'. If direct, value send and receive will be ",
   * "instant. On submit, it will send and listen for the first event received."
   * ]
   * @name feedbackmode
   * @default direct
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
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
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
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "Sends a signal on a click or tap event (mouse or swipe up and down quickly)."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   */
  sendEventOnClick: string;
}

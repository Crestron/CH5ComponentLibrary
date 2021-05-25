// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5SelectIconPosition, TCh5SelectMode } from ".";
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5SelectAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "The initial number of entries in a selection. The default value is 1. The accepted range is 1-30."
   * ]
   * @name size
   * @default 1
   */
  size: string | number;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "Valid values: 'first' and 'last'. The default value is 'first'. ",
   * "This attribute only applies when a template is not provided ",
   * "and the implied template is in use. If a template is provided, ",
   * "this property is ignored."
   * ]
   * @name iconposition
   * @default first
   */
  iconPosition: TCh5SelectIconPosition;

  /**
   * @documentation
   * [
   * "`selectedvalue` attribute",
   * "***",
   * "The default value is false. Set to true if multiple selections can be selected. ",
   * "If true, the value of the selection will be an array of values."
   * ]
   * @name selectedvalue
   */
  selectedValue: string | number;

  /**
   * @documentation
   * [
   * "`panelscrollheight` attribute",
   * "***",
   * "height of the panel containing the list of options, supports px, vw, vh and % (% is based on the parent height of the ch5-select. "
   * ]
   * @name panelscrollheight
   */
  panelScrollHeight: number;

  /**
   * @documentation
   * [
   * "`minwidth` attribute",
   * "***",
   * "The min width of the selection container."
   * ]
   * @name minwidth
   */
  minWidth: string | null;

  /**
   * @documentation
   * [
   * "`maxwidth` attribute",
   * "***",
   * "The max width of the selection container."
   * ]
   * @name maxwidth
   */
  maxWidth: string | null;

  /**
   * @documentation
   * [
   * "`minheight` attribute",
   * "***",
   * "The min height of the selection container."
   * ]
   * @name minheight
   */
  minHeight: string | null;

  /**
   * @documentation
   * [
   * "`maxheight` attribute",
   * "***",
   * "The max height of the selection container."
   * ]
   * @name maxheight
   */
  maxHeight: string | null;

  /**
   * @documentation
   * [
   * "`mode` attribute",
   * "***",
   * "Two values are possible as show below. The default value is 'plain'. ",
   * "plain - The select menu opens and closes as clicked by user. ",
   * "panel – The select menu stays open even when not in focus."
   * ]
   * @name mode
   * @default plain
   */
  mode: TCh5SelectMode;

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "Allows the form submission functionality. Valid values: 'direct', 'submit'."
   * ]
   * @name feedbackmode
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "The default valus is 1500. Defines the time between when the user releases the ",
   * "toggle handle and the time the toggle will check if the ",
   * "value is equal with the value from the signal. If the value is not equal, it will ",
   * "apply the value from the signal automatically. Apply only for feedbackMode direct."
   * ]
   * @name signalvaluesynctimeout
   * @default 1500
   */
  signalValueSyncTimeout: string | number;

  /**
   * @documentation
   * [
   * "`indexid` attribute",
   * "***",
   * "Provides the name of the offset identifier to be substituted with ",
   * "a 1-based index of the item in a list within the template item ",
   * "surrounded by {{ }} delimiters."
   * ]
   * @name indexid
   *
   */
  indexId: string | null;

  /**
   * @documentation
   * [
   * "`noneselectedprompt` attribute",
   * "***",
   * "Showed when no items are selected."
   * ]
   * @name noneselectedprompt
   */
  noneSelectedPrompt: string | null;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "When received, changes the selected value of this selector. This is only applicable for ",
   * "multiselect=false. A 1-based index is expected. ",
   * "Value 0 indicates all will be unselected."
   * ]
   * @name receivestatevalue
   *
   */
  receiveStateValue: string | null;

  /**
   * @documentation
   * [
   * "`receivestatesize` attribute",
   * "***",
   * "Sets the number of items in this component."
   * ]
   * @name receivestatesize
   *
   */
  receiveStateSize: string | null;

  /**
   * @documentation
   * [
   * "`receivestatetemplatevars` attribute",
   * "***",
   * "A JSON-encoded array of name/value objects, with one per item created from the template."
   * ]
   * @name receivestatetemplatevars
   *
   */
  receiveStateTemplateVars: string | null;

  /**
   * @documentation
   * [
   * "`snedsignalonfocus` attribute",
   * "***",
   * "Send a signal on the focus event. Set to true if in focus and set to false if not in focus."
   * ]
   * @name sendeventonfocus
   *
   */
  sendEventOnFocus: string | null;

  /**
   * @documentation
   * [
   * "`sendeventonchange` attribute",
   * "***",
   * "Sends a signal value on the selected change. Shis is only applicable for multiselect=false. ",
   * "A 1-based index is expected. Value 0 indicates all will be unselected."
   * ]
   * @name sendeventonchange
   *
   */
  sendEventOnChange: string | null;
}

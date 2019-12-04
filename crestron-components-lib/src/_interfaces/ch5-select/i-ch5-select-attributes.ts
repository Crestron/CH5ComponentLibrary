// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCh5SelectIconPosition, TCh5SelectMode } from "./types";
import { TCh5CommonInputFeedbackModes } from "../ch5-common-input/types";

/**
 * @ignore
 */
export interface ICh5SelectAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Initial number of entries in selection. Default to 1, Range 1-30"
   * ]
   * @name size
   *
   */
  size: string | number;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "Valid values are 'first' and 'last'. Default is 'first'.",
   * "This attribute only applies when a template is not provided",
   * "and the implied template is in use. If template is provided,",
   * "this property is ignored."
   * ]
   * @name iconposition
   *
   */
  iconPosition: TCh5SelectIconPosition;

  /**
   * @documentation
   * [
   * "`selectedvalud` attribute",
   * "***",
   * "Default of false, true if multiple selections can be selected.",
   * "If true, the value of the select will be an array of values"
   * ]
   * @name selectedvalue
   *
   */
  selectedValue: string | number;

  /**
   * @documentation
   * [
   * "`scrollheight` attribute",
   * "***",
   * "height of the panel containing the list of options"
   * ]
   * @name panelscrollheight
   *
   */
  panelScrollHeight: number;

  /**
   * @documentation
   * [
   * "`minwidth` attribute",
   * "***",
   * "Min width of the select container"
   * ]
   * @name minwidth
   */
  minWidth: string | null;

  /**
   * @documentation
   * [
   * "`maxwidth` attribute",
   * "***",
   * "Max width of the select container"
   * ]
   * @name maxwidth
   */
  maxWidth: string | null;

  /**
   * @documentation
   * [
   * "`minheight` attribute",
   * "***",
   * "Min height of the select container"
   * ]
   * @name minheight
   */
  minHeight: string | null;

  /**
   * @documentation
   * [
   * "`maxheight` attribute",
   * "***",
   * "Max height of the select container"
   * ]
   * @name maxheight
   */
  maxHeight: string | null;

  /**
   * @documentation
   * [
   * "`mode` attribute",
   * "***",
   * "Two choices below. Default is 'plain'",
   * "plain - select menu opens and closes as clicked by user",
   * "panel – select menu stays open even when not in focus"
   * ]
   * @name mode
   *
   */
  mode: TCh5SelectMode;

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "Allow the form submission functionality. direct, submit"
   * ]
   * @name feedbackmode
   *
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`signalvaluesynctimeout` attribute",
   * "***",
   * "Default 1500. Defines the time between the user release the",
   * "handle of the toggle and the time the toggle will check if the",
   * "value is equal with the value from the signal. If not it will",
   * "automatically apply the value from the signal. Apply only for feedbackMode direct"
   * ]
   * @name signalvaluesynctimeout
   *
   */
  signalValueSyncTimeout: string | number;

  /**
   * @documentation
   * [
   * "`indexid` attribute",
   * "***",
   * "Provides the name of the offset identifier to substituted with",
   * "1 based index of the item in list within the template item",
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
   * "Showed when none of the items is selected"
   * ]
   * @name noneselectedprompt
   */
  noneSelectedPrompt: string | null;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "When receive change the selected value of this selector. this is only applicable for",
   * "multiselect=false. 1 based index is expected.",
   * "Value 0 indicates all are be unselected"
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
   * "Sets the number of items in this component"
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
   * "Json encoded array of name/value objects, one per item created from the template."
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
   * "send signal on focus event. True in focus. False not in focus"
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
   * "send signal value on selected change. this is only applicable for multiselect=false.",
   * "1 based index is expected. Value 0 indicates all are be unselected"
   * ]
   * @name sendeventonchange
   *
   */
  sendEventOnChange: string | null;
}

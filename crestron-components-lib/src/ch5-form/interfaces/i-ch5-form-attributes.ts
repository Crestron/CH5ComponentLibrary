// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ButtonType } from "../../ch5-button/interfaces/t-ch5-button";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

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
   * "***",
   * "The default value is 'default'. ",
   * "Represents the type of the auto-generated Submit button."
   * ]
   * @default default
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
   * "***",
   * "The default value is 'default'. ",
   * "Represents the type of the auto-generated Cancel button."
   * ]
   * @default default
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

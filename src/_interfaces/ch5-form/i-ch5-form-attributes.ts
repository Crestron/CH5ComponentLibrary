// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCh5ButtonType } from "../ch5-button/types";

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
   * "Represents the label of the submit button."
   * ]
   */
  submitButtonLabel: string;

  /**
   * @name submitbuttonicon
   * @documentation
   * [
   * "`submitbuttonicon` attribute",
   * "***",
   * "Represents the icon of the submit button."
   * ]
   */
  submitButtonIcon: string;

  /**
   * @name submitbuttonstyle
   * @documentation
   * [
   * "`submitbuttonStyle` attribute",
   * "***",
   * "Represents the style of the submit button."
   * ]
   */
  submitButtonStyle: string;

  /**
   * @name submitbuttontype
   * @documentation
   * [
   * "`submitbuttontype` attribute",
   *  "***",
   *  "Represents the type of the auto-generated 'Submit' button."
   * ]
   */
    submitButtonType: TCh5ButtonType;

  /**
   * @name cancelbuttonlabel
   * @documentation
   * [
   * "`cancelbuttonlabel` attribute",
   * "***",
   * "Represents the label of the cancel button."
   * ]
   */
  cancelButtonLabel: string;

  /**
   * @name cancelbuttonicon
   * @documentation
   * [
   * "`cancelbuttonicon` attribute",
   * "***",
   * "Represents the icon of the cancel button."
   * ]
   */
  cancelButtonIcon: string;

  /**
   * @name cancelbuttonstyle
   * @documentation
   * [
   * "`cancelbuttonstyle` attribute",
   * "***",
   * "Represents the style of the cancel button."
   * ]
   */
  cancelButtonStyle: string;

  /**
   * @name cancelbuttontype
   * @documentation
   * [
   * "`cancelButtonType` attribute",
   *  "***",
   *  "Represents the type of the auto-generated 'Cancel' button."
   * ]
   */
  cancelButtonType: TCh5ButtonType;

  /**
   * @name submitid
   * @documentation
   * [
   * "`submitid` attribute",
   * "***",
   * "Represents the id of the submit button."
   * ]
   */
  submitId: string;

  /**
   * @name cancelid
   * @documentation
   * [
   * "`cancelId` attribute",
   * "***",
   * "Represents the id of the cancel button."
   * ]
   */
  cancelId: string;
}

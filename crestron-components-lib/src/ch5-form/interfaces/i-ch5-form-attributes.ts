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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "Join"
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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
   */
  cancelId: string;

  /**
   * @name hidecancelbutton
   * @documentation
   * [
   * "`hideCancelButton` attribute",
   * "***",
   * "Boolean for showing or hiding the Cancel button."
   * ]
   * @attributeType "Boolean"
   */
  hideCancelButton: boolean;

  /**
   * @name hidesubmitbutton
   * @documentation
   * [
   * "`hideSubmitButton` attribute",
   * "***",
   * "Boolean for showing or hiding the Submit button."
   * ]
   * @attributeType "Boolean"
   */
  hideSubmitButton: boolean;
}

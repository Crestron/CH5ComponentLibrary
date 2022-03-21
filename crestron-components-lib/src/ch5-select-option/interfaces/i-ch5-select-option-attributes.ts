// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5SelectOptionIconPosition } from "./types/t-ch5-select-option-icon-position";

/**
 * @ignore
 */
export interface ICh5SelectOptionAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "The default value is 'first'. Valid values: 'first' and 'last'. ",
   * "This attribute only applies when a template is not provided ",
   * "and the implied template is in use. If a template is provided, ",
   * "this property is ignored."
   * ]
   * @name iconposition
   * @default first
   * @attributeType "String"
   */
  iconPosition: TCh5SelectOptionIconPosition | string;

  /**
   * @documentation
   * [
   * "`useDefaultTmpl` attribute",
   * "***",
   * "The default value is false.",
   * "Provides the ability to initialise ch5-select with the default template."
   * ]
   * @name usedefaulttmpl
   * @default false
   * @attributeType "boolean"
   */
  useDefaultTmpl: boolean;

  /**
   * @documentation
   * [
   * "`receivestateselected` attribute",
   * "***",
   * "When received, applies a true value to the selected class (ch5-button--selected)."
   * ]
   * @name receivestateselected
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateSelected: string | null;

  /**
   * @documentation
   * [
   * "`receivestatelabel` attribute",
   * "***",
   * "The label or name of the ch5-select-option is received via this attribute."
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateLabel: string | null;

  /**
   * @documentation
   * [
   * "`receivestateurl` attribute",
   * "***",
   * "Provides the image or icon url."
   * ]
   * @name receivestateurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateUrl: string | null;

  /**
   * @documentation
   * [
   * "`receivestatescriptlabelhtml` attribute",
   * "***",
   * "A signal script evaluation will be applied to the ",
   * "button.innerHTML. Allows for multiline, multi-styled labels."
   * ]
   * @name receivestatescriptlabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScriptLabelHTML: string | null;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends an on click or tap event (mouse or swipe up and down quickly). ",
   * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event. ",
   * "Examples include the SIMPL Logic Symbol for Toggle with a description of ",
   * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnClick: string | null;
}

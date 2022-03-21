// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5SpinnerIconPosition } from ".";
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5SpinnerAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "The default value is 1. ",
   * "The number of of items that can be in a spinner element."
   * ]
   * @name size
   * @default 1
   * @limits [{"min": 0, "max": 99}]
   * @attributeType "integer"
   */
  size: number;

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "The label of the spinner element."
   * ]
   * @name label
   * @attributeType "String"
   */
  label: string;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "The default value is 'first'. Valid values: 'first' and 'last'. ",
   * "This attribute only applies when a template is not provided ",
   * "and the implied template is in use. ",
   * "If a template is provided, this property is ignored. ",
   * "If the direction attribute is 'ltr', as will be typical in locales with ",
   * "left-to-right language direction, 'first' is equivalent to the icon being ",
   * "placed on the left and the text on the right. Conversely, if the direction ",
   * "attribute is 'rtl', 'first' would place the icon on the right and ",
   * "the label to its left. Value of 'last' is the opposite of 'first'."
   * ]
   * @name iconposition
   * @default first
   * @attributeType "String"
   */
  iconPosition: TCh5SpinnerIconPosition;

  /**
   * @documentation
   * [
   * "`selectedValue` attribute",
   * "***",
   * "The default value is 0. ",
   * "The 1-based index of the selected item. Valid values are >=1",
   * "and <= size."
   * ]
   * @name selectedvalue
   * @default 0
   * @limits [{"min": 0, "max": 99}]
   * @attributeType "integer"
   */
  selectedValue: number;

  /**
   * @documentation
   * [
   * "`itemheight` attribute",
   * "***",
   * "The height of an item. The value of the height can be in px and vh. ",
   * "The item height is required. If this is not provided, ",
   * "CH5 calculates based on the first item height. ",
   * "Each item on the list must have the same height."
   * ]
   * @name itemheight
   * @attributeType "String"
   */
  itemHeight: string;

  /**
   * @documentation
   * [
   * "`visibleitemscroll` attribute",
   * "***",
   * "The default value is 3. The number of items to show in the ",
   * "upper/lower container around the selected item container. ",
   * "This information is needed to determine how many items ",
   * "are added to the top of the list and to the bottom. If this ",
   * "value is not set, the number of items can fit in scrollHeight ",
   * "must be calculated, which presents a probability that ",
   * "one item will not be fully visible in height. If there is a template ",
   * "including this, visibleItems will need to adjust on the height of ",
   * "the template given."
   * ]
   * @name visibleitemscroll
   * @default 3
   * @limits [{"min": 1, "max": 99}]
   * @attributeType "integer"
   */
  visibleItemScroll: number;

  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "The default value is 'direct'. Allows the form submission functionality. ",
   * "Valid values: 'direct', 'submit'."
   * ]
   * @name feedbackmode
   * @default direct
   * @attributeType "String"
   */
  feedbackMode: TCh5CommonInputFeedbackModes;

  /**
   * @documentation
   * [
   * "`signalValueSyncTimeout` attribute",
   * "***",
   * "The default value is 1500. Defines the time between the user releases a ",
   * "toggle and the time the toggle will check if the ",
   * "value is equal with the value from the signal. If the value is not equal, it will ",
   * "apply the value from the signal automatically. Apply only for ",
   * "feedbackMode direct."
   * ]
   * @name signalvaluesynctimeout
   * @default 1500
   * @attributeType "integer"
   */
  signalValueSyncTimeout: number;

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
   * @attributeType "String"
   */
  indexId: string;
  /**
   * @documentation
   * [
   * "`onclean` attribute",
   * "***",
   * "Runs when a clean event is initiated."
   * ]
   * @name onclean
   * @attributeType "String"
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
   * @attributeType "String"
   */
  ondirty: {};

  /**
   * @documentation
   * [
   * "`resize` attribute",
   * "***",
   * "The default value is false. ",
   * "If true, the options panel is resized to fit content width. ",
   * "Apply only with the CSS rule 'width=fit-content' and/or 'width =auto' ",
   * "(depending on the browser agent)."
   * ]
   * @name resize
   * @default false
   * @attributeType "boolean"
   */
  resize: boolean;

  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "The default value is false. Creates an infinite spinner. This will trigger the next ",
   * "element after the last to be the first element in the list."
   * ]
   * @name endless
   * @default false
   * @attributeType "boolean"
   */
  endless: boolean;

  /**
   * @documentation
   * [
   * "`autoSetItemHeight` attribute",
   * "***",
   * "The default value is false. ",
   * "Adjusts the height of ch5-spinner items automatically."
   * ]
   * @name autoSetItemHeight
   * @default false
   * @attributeType "boolean"
   */
  autoSetItemHeight: boolean;

  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "Provides the current value of the spinner."
   * ]
   * @name receivestatevalue
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "join"
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`receiveStateSize` attribute",
   * "***",
   * "Provides the size of the spinner."
   * ]
   * @name receivestatesize
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "join"
   */
  receiveStateSize: string;

  /**
   * @documentation
   * [
   * "`receiveStateLabel` attribute",
   * "***",
   * "Provides the label of the spinner."
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateLabel: string;

  /**
   * @documentation
   * [
   * "`receiveStateUrl` attribute",
   * "***",
   * "Provides the image or icon URL."
   * ]
   * @name receivestateurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateUrl: string;

  /**
   * @documentation
   * [
   * "`sendEventOnChange` attribute",
   * "***",
   * "Sends an event when the value of the spinner changes."
   * ]
   * @name sendeventonchange
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  sendEventOnChange: string;

  /**
   * @documentation
   * [
   * "`sendEventOnFocus` attribute",
   * "***",
   * "Sends an event on focus."
   * ]
   * @name sendeventonfocus
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  sendEventOnFocus: string;

  /**
   * @documentation
   * [
   * "`sendEventOnOverflow` attribute",
   * "***",
   * "Sends an event on overflow (endless attribute required)."
   * ]
   * @name sendeventonoverflow
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  sendEventOnOverflow: string;

  /**
   * @documentation
   * [
   * "`sendEventOnUnderflow` attribute",
   * "***",
   * "Sends an event on underflow (endless attribute required)."
   * ]
   * @name sendeventonunderflow
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  sendEventOnUnderflow: string;
}

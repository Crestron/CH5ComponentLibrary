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
 * @name Ch5 Spinner
 * @isattribute false
 * @tagName ch5-spinner
 * @role listbox
 * @description CH5 Spinner provides a list of items where items can be moved between by dragging the spinner element.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-spinner` element",
 * "***",
 * "Functionally, the Spinner component is similar to the Select component. The primary differences are in the visual representation. ",
 * "The Spinner component presents a vertical list of values centered around one centrally-orientated ",
 * "item, which is considered the single selected item. Swiping up and down on the items allow the user ",
 * "to see other selections, and placing an item in the center chooses that item."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-spinner:blank",
 *       "description": "Crestron Spinner (Blank)",
 *       "body": [
 *           "<ch5-spinner>",
 *           "</ch5-spinner>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-spinner:default",
 *       "description": "Crestron Spinner (Default)",
 *       "body": [
 *           "<ch5-spinner",
 *           "    label=\"${1:item {{idx}}}\"",
 *           "    indexid=\"${2:idx}\"",
 *           "    size=\"${3:40}\"",
 *           "    itemheight=\"${4:40}\"",
 *           "    visibleitemscroll=\"${5:3}\"",
 *           "    sendeventonchange=\"${6:changed_signal}\">",
 *           "</ch5-spinner>$0"
 *       ]
 *   },
 *     {
 *        "prefix": "ch5-spinner:endless",
 *        "description": "Crestron Spinner endless attribute allows the user to continuously drag the spinner.",
 *        "body": [
 *            "<ch5-spinner",
 *            "    label=\"${1:item {{idx}}}\"",
 *            "    indexid=\"${2:idx}\"",
 *            "    size=\"${3:20}\"",
 *            "    itemheight=\"${4:40}\"",
 *            "    visibleitemscroll=\"${5:3}\"",
 *            "    endless=\"${6:true}\">",
 *            "</ch5-spinner>$0"
 *        ]
 *   },
 *   {
 *      "prefix": "ch5-spinner:signals",
 *      "description": "Crestron Spinner sending signals when interact with the component.",
 *      "body": [
 *            "<ch5-spinner",
 *            "    label=\"${1:item {{idx}}}\"",
 *            "    indexid=\"${2:idx}\"",
 *            "    size=\"${3:20}\"",
 *            "    itemheight=\"${4:40}\"",
 *            "    visibleitemscroll=\"${5:3}\"",
 *            "    endless=\"${6:true}\"",
 *            "    sendeventonchange=\"${7:changed_signal}\"",
 *            "    sendeventonfocus=\"${8:spinner_focusin}\">",
 *            "</ch5-spinner>$0"
 *      ]
 *   }
 * ]
 */

/**
 * @ignore
 */
export interface ICh5SpinnerAttributes extends ICh5CommonAttributes {
  
  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "The number of of items that can be in a spinner element."
   * ]
   * @name size
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
   */
  label: string;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "Valid values: 'first' and 'last'. The default value is 'first'. ",
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
   */
  iconPosition: TCh5SpinnerIconPosition;

  /**
   * @documentation
   * [
   * "`selectedValue` attribute",
   * "***",
   * "The 1-based index of the selected item. Valid values are >=1",
   * "and <= size."
   * ]
   * @name selectedvalue
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
   * "`resize` attribute",
   * "***",
   * "If true, the options panel is resized to fit content width. ",
   * "Apply only with the CSS rule 'width=fit-content' and/or 'width =auto' ",
   * "(depending on the browser agent)."
   * ]
   * @name resize
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
   */
  endless: boolean;
  
  /**
   * @documentation
   * [
   * "`autoSetItemHeight` attribute",
   * "***",
   * "Adjusts the height of ch5-spinner items automatically."
   * ]
   * @name autoSetItemHeight
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
   */
  sendEventOnUnderflow: string;
}

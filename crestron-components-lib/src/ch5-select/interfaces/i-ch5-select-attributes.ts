// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5SelectIconPosition, TCh5SelectMode } from ".";
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";

/**
 * @name Ch5 Select
 * @isattribute false
 * @tagName ch5-select
 * @role listbox
 * @description Ch5 Select inherits the default html select, but provides a lot of extra features
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-select` element",
 * "***",
 * "The select component enables the user to select one or more choices from a list of options. ",
 * "The select component will not be a wrapper around the HTML input type select because other options ",
 * "must be covered that are not available on HTML input type select."
 * ]
 * @snippets
 * [
 *         {
 *           "prefix": "ch5-select:blank",
 *           "description": "Crestron Select (Blank)",
 *           "body": [
 *             "<ch5-select>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:all",
 *           "description": "Crestron Select (All Attributes)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\ticonposition=\"${2|first,last|}\"",
 *             "\tmultiselect=\"${3}\"",
 *             "\tselectedvalue=\"${4}\"",
 *             "\tnoneselectedprompt=\"${5}\"",
 *             "\tpanelscrollheight=\"${6}\"",
 *             "\tminwidth=\"${7}\"",
 *             "\tmaxwidth=\"${8}\"",
 *             "\tminheight=\"${9}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\"",
 *             "\treceivestatesize=\"${15}\"",
 *             "\treceivestatetemplatevars=\"${16}\"",
 *             "\tsendeventonfocus=\"${17}\"",
 *             "\tsendeventonchange=\"${18}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option receivestateselected=\"${19}\"",
 *             "\t\t\treceivestatelabel=\"${20}\"",
 *             "\t\t\treceivestateurl=\"${21}\"",
 *             "\t\t\treceivestatescriptlabelhtml=\"${22}\"",
 *             "\t\t\tsendeventonclick=\"${23}\">",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:single-selection",
 *           "description": "Crestron Select (single selection using receiveStateValue and sendEventOnChange",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tselectedvalue=\"${2}\"",
 *             "\tnoneselectedprompt=\"${3}\"",
 *             "\tpanelscrollheight=\"${4}\"",
 *             "\tminwidth=\"${5}\"",
 *             "\tmaxwidth=\"${6}\"",
 *             "\tminheight=\"${7}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\"",
 *             "\tsendeventonchange=\"${15}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option>",
 *             "\t\t\t<span>Option {{idx}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:single-selection2",
 *           "description": "Crestron Select (single selection using receiveStateValue and ch5-select-option.sendEventOnClick)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tselectedvalue=\"${2}\"",
 *             "\tnoneselectedprompt=\"${3}\"",
 *             "\tpanelscrollheight=\"${4}\"",
 *             "\tminwidth=\"${5}\"",
 *             "\tmaxwidth=\"${6}\"",
 *             "\tminheight=\"${7}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option sendeventonclick=\"${15}\">",
 *             "\t\t\t<span>Option {{idx}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:single-selection3",
 *           "description": "Crestron Select (single selection using ch5-select-option.receiveStateSelected and ch5-select-option.sendEventOnClick)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tselectedvalue=\"${2}\"",
 *             "\tnoneselectedprompt=\"${3}\"",
 *             "\tpanelscrollheight=\"${4}\"",
 *             "\tminwidth=\"${5}\"",
 *             "\tmaxwidth=\"${6}\"",
 *             "\tminheight=\"${7}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option sendeventonclick=\"${15}\"",
 *             "\t\t\treceivestateselected=\"${16}\">",
 *             "\t\t\t<span>Option {{idx}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:multiselection",
 *           "description": "Crestron Select (multi selection using ch5-select-option.receiveStateSelected, ch5-select-option.sendEventOnClick and ch5-select-option.receiveStateLabel)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tnoneselectedprompt=\"${2}\"",
 *             "\tpanelscrollheight=\"${3}\"",
 *             "\tminwidth=\"${4}\"",
 *             "\tmaxwidth=\"${5}\"",
 *             "\tminheight=\"${6}\"",
 *             "\tmaxheight=\"${7}\"",
 *             "\tresize=\"${8|true,false|}\"",
 *             "\tmode=\"${9|plain,panel|}\"",
 *             "\tmultiselect",
 *             "\tfeedbackmode=\"${10|direct,submit|}\"",
 *             "\tindexid=\"${11|idx|}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option sendeventonclick=\"${12}\"",
 *             "\t\t\treceivestateselected=\"${13}\"",
 *             "\t\t\treceivestatelabel=\"${14}\">",
 *             "\t\t\t<span>Option {{label}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:default",
 *           "description": "Crestron Select (using default template)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\ticonposition=\"${2|first,last|}\"",
 *             "\tselectedvalue=\"${3}\"",
 *             "\tnoneselectedprompt=\"${4}\"",
 *             "\tpanelscrollheight=\"${5}\"",
 *             "\tminwidth=\"${6}\"",
 *             "\tmaxwidth=\"${7}\"",
 *             "\tminheight=\"${8}\"",
 *             "\tmaxheight=\"${9}\"",
 *             "\tresize=\"${10|true,false|}\"",
 *             "\tmode=\"${11|plain,panel|}\"",
 *             "\tfeedbackmode=\"${12|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${13|1500|}\"",
 *             "\tindexid=\"${14|idx|}\">",
 *            "\t<template>",
 *             "\t\t<ch5-select-option receivestateselected=\"${15}\"",
 *             "\t\t\treceivestatelabel=\"${16}\"",
 *             "\t\t\treceivestateurl=\"${17}\"",
 *             "\t\t\treceivestatescriptlabelhtml=\"${18}\"",
 *             "\t\t\tsendeventonclick=\"${19}\">",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         }
 * ]
 * 
 */

/**
 * @ignore
 */
export interface ICh5SelectAttributes {

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
   * @default -1
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
   * @default 0
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
   * @default direct
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
   * "`multiselect` attribute",
   * "***",
   * "The default value is false. Set to true if multiple selections can be selected. ",
   * "If true, the value of the selection will be an array of values."
   * ]
   * @name multiselect
   * @default false
   * 
   */
  multiselect: boolean;

  /**
   * @documentation
   * [
   * "`resize` attribute",
   * "***",
   * "If true, the options panel will be resized to fit content width. ",
   * "The maximum width and height cannot be bigger then parent HTML element."
   * ]
   * @name resize
   * @default false
   * 
   */
  resize: boolean;

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

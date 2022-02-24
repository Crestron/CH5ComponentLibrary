// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces/i-ch5-common-attributes";
import {
  TCh5ButtonSize,
  TCh5ButtonIconPosition,
  TCh5ButtonOrientation,
  TCh5ButtonShape,
  TCh5ButtonStretch,
  TCh5ButtonType,
  TCh5ButtonActionType,
  TCh5ButtonHorizontalAlignLabel,
  TCh5ButtonVerticalAlignLabel,
  TCh5ButtonCheckboxPosition
} from "./t-ch5-button";

/**
 * @ignore
 */
export interface ICh5ButtonAttributes extends ICh5CommonAttributes {
  /**
   * @name size
   * @documentation
   * [
   * "`size` attribute",
   *  "***",
   *  "Overrides the appearance of the button with alternative CSS that is defined in classes defined with ch5-button--size, where size is the value of the property. If no `size` is provided, type of `default` is used."
   * ]
   * @default regular
   * @hideWhen [
   *  { "stretch": ["both", "height", "width"] }
   * ]
   * @attributeType "string"
   */
  size: TCh5ButtonSize;

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "The label of the button element."
   * ]
   * @name label
   * @attributeType "string"
   */
  label: string;

  /**
   * @documentation
   * [
   * "`iconClass` attribute",
   * "***",
   * "The icon class."
   * ]
   * @name iconclass
   * @attributeType "iconClass"
   */
  iconClass: string;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "The default value is 'first'.",
   * "Valid values: 'first', 'last', 'top', 'bottom'.",
   * "The icon position relative to the label."
   * ]
   * @name iconposition
   * @default first
   * @attributeType "string"
   */
  iconPosition: TCh5ButtonIconPosition;

  /**
   * @documentation
   * [
   * "`iconurl` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name iconurl
   * @attributeType "imageURL"
   */
  iconUrl: string;

  /**
   * @documentation
   * [
   * "`mode` attribute",
   * "***",
   * "The default value is 0.",
   * "This property is used to set or get the mode of the ch5-button in a multi-mode environment. ",
   * "The maximum value that can be set is 99."
   * ]
   * @name mode
   * @default 0
   * @limits [{"min": 0, "max": 99}]
   * @attributeType "integer"
   */
   mode: number;

  /**
   * @documentation
   * [
   * "`checkboxshow` attribute",
   * "***",
   * "The default value is false.",
   * "This property is used to display or hide a checkbox. If set to true, a checkbox is displayed and ",
   * "'ch5-button__checkbox' will be applied as the CSS class on the component."
   * ]
   * @name checkboxshow
   * @default false
   * @attributeType "boolean"
   */
  checkboxShow: boolean;

  /**
   * @documentation
   * [
   * "`checkboxposition` attribute",
   * "***",
   * "The default value is left.",
   * "This property is used to set the position of a checkbox in a button. The value left would set the checkbox to the left of the button,",
   * " and the value right would set the checkbox to the right of the button."
   * ]
   * @name checkboxposition
   * @default left
   * @attributeType "string"
   */
  checkboxPosition: TCh5ButtonCheckboxPosition;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'.",
   * "Positions the control elements in a horizontal or vertical orientation.",
   * "For vertical alignment, it will apply a CSS class that will rotate the ",
   * "component -90 degrees (270 degrees clockwise, 90 degrees counter clockwise)."
   * ]
   * @name orientation
   * @default horizontal
   * @attributeType "string"
   */
  orientation: TCh5ButtonOrientation;

  /**
   * @documentation
   * [
   * "`shape` attribute",
   * "***",
   * "The default value is 'rounded-rectangle'. Valid values: 'rounded-rectangle', ",
   * "'rectangle', 'tab', 'circle', 'oval'. The shape of the button."
   * ]
   * @name shape
   * @default rounded-rectangle
   * @attributeType "string"
   */
  shape: TCh5ButtonShape;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "Valid values: 'width', 'height', 'both'.",
   * "When the stretch property is set, the button element inherits the ",
   * "width and/or height of the container. If stretch=height is used, ",
   * "the button will be responsive based on the label length until it ",
   * "reaches the max-width of the container. If stretch=width is ",
   * "applied, there is no responsiveness after reaching the max-width, and ",
   * "the text will overflow. The same applies if stretch=both is used."
   * ]
   * @name stretch
   * @attributeType "string"
   */
  stretch: TCh5ButtonStretch | null;

  /**
   * @documentation
   * [
   * "`type` attribute",
   * "***",
   * "Valid values: 'default', 'info', 'text', 'danger', 'warning', 'success', 'primary', 'secondary'.",
   * "Overrides the appearance of the button with alternative CSS ",
   * "defined in classes defined with ch5-button--type, where type is ",
   * "the value of the property. If no 'type' is provided, the type of ",
   * "'default' is used."
   * ]
   * @name type
   * @default default
   * @attributeType "string"
   */
  type: TCh5ButtonType;

  /**
   * @documentation
   * [
   * "`halignlabel` attribute",
   * "***",
   * "Valid values: 'left', 'right', 'center'.",
   * "When the hAlignLabel property is set, the label and the icon of the button are horizontally aligned. ",
   * "The center property sets the horizontal alignment of the label to the center of the button. ",
   * "The left property sets the horizontal alignment of the label to the left of the button. ",
   * "The right property sets the horizontal alignment of the label to the right of the button. "
   * ]
   * @name halignlabel
   * @default center
   * @attributeType "string"
   */
  hAlignLabel: TCh5ButtonHorizontalAlignLabel;

  /**
   * @documentation
   * [
   * "`valignlabel` attribute",
   * "***",
   * "Valid values: 'top', 'bottom', 'middle'.",
   * "When the vAlignLabel property is set, the label and the icon of the button are vertically aligned. ",
   * "The middle property sets the horizontal alignment of the label to the middle of the button. ",
   * "The top property sets the horizontal alignment of the label to the top of the button. ",
   * "The bottom property sets the horizontal alignment of the label to the bottom of the button. "
   * ]
   * @name valignlabel
   * @default middle
   * @attributeType "string"
   */
  vAlignLabel: TCh5ButtonVerticalAlignLabel;

  /**
   * @documentation
   * [
   * "`formtype` attribute",
   * "***",
   * "Valid values: 'cancel' and 'submit'. ",
   * "submit: The value submit,submits the form data. ",
   * "cancel: The value cancel, reset all the controls of form to their initial values."
   * ]
   * @name formtype
   * @attributeType "string"
   */
  formType: TCh5ButtonActionType | null;

  /**
   * @documentation
   * [
   * "`receivestatemode` attribute",
   * "***",
   * "When received, applies a value to the mode attribute from the signal."
   * ]
   * @name receivestatemode
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "join"
   */
  receiveStateMode: string;

  /**
   * @documentation
   * [
   * "`receivestateselected` attribute",
   * "***",
   * "When received, applies a true value applied by the selected class (ch5-button--selected)."
   * ]
   * @name receivestateselected
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  receiveStateSelected: string;

  /**
   * @documentation
   * [
   * "`receivestatelabel` attribute",
   * "***",
   * "When received, applies the value on the label."
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateLabel: string;

  /**
   * @documentation
   * [
   * "`receivestatescriptlabelhtml` attribute",
   * "***",
   * "Allows the signal script evaluation to be applied to the ",
   * "button.inner HTML class. Allows for multiline, multistyled labels."
   * ]
   * @name receivestatescriptlabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateScriptLabelHtml: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends an event on click or tap (mouse or swipe up and down quickly).",
   * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event.",
   * "Examples include the SIMPL Logic Symbol for Toggle a with description of ",
   * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  sendEventOnClick: string;

  /**
   * @documentation
   * [
   * "`sendeventontouch` attribute",
   * "***",
   * "Sends a boolean true event when the screen is tapped and a boolean false event when released.",
   * "Use this when the control system takes an action on a level-sensitive boolean digital event.",
   * "Examples include the SIMPL Logic Symbol for Analog Ramp with a description of ",
   * "Digital input <up> 'High/1 (level sensitive) = Ramp up; Low/0 = Stop ramp'."
   * ]
   * @name sendeventontouch
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "join"
   */
  sendEventOnTouch: string;

  /**
   * @documentation
   * [
   * "`receivestateiconclass` attribute",
   * "***",
   * "The icon class received from the control system."
   * ]
   * @name receivestateiconclass
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateIconClass: string | null;

  /**
   * @documentation
   * [
   * "`receivestatetype` attribute",
   * "***",
   * "After receiving a stateType value from control system, this value is applied to the type attribute.",
   * "See description of the type attribute."
   * ]
   * @name receivestatetype
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateType: string | null;

  /**
   * @documentation
   * [
   * "`receivestateiconurl` attribute",
   * "***",
   * "After receiving stateIconUrl value from control system, this value is applied to the iconUrl attribute. ",
   * "See description of the iconUrl attribute."
   * ]
   * @name receivestateiconurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateIconUrl: string | null;

  /**
   * @documentation
   * [
   * "`customclasspressed` attribute",
   * "***",
   * "The name of the CSS class applied while the button is pressed by a user."
   * ]
   * @name customclasspressed
   * @attributeType "string"
   */
  customClassPressed: string | null;

  /**
   * @documentation
   * [
   * "`customclassdisabled` attribute",
   * "***",
   * "The name of the CSS class applied while the button is disabled."
   * ]
   * @name customclassdisabled
   * @attributeType "string"
   */
  customClassDisabled: string | null;

  /**
   * @documentation
   * [
   * "`selected` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the selected state of the component. If set to true, ",
   * "'ch5-button--selected' will be applied as the CSS class on the component."
   * ]
   * @name selected
   * @default false
   * @attributeType "boolean"
   */
  selected: boolean;

  /**
   * @documentation
   * [
   * "`pressed` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the pressed state of the component. If set to true, ",
   * "'ch5-button--pressed' will be applied as the CSS class on the component."
   * ]
   * @name pressed
   * @default false
   * @attributeType "boolean"
   */
  pressed: boolean;
}

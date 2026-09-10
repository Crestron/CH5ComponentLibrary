// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5LightBaseAttributes } from "../../ch5-light-base/interfaces/i-ch5-light-base-attributes";
import {
  TCh5ButtonType,
  TCh5ButtonSize,
  TCh5ButtonShape,
  TCh5ButtonStretch,
  TCh5ButtonIconPosition,
  TCh5ButtonOrientation,
  TCh5ButtonHorizontalAlignLabel,
  TCh5ButtonVerticalAlignLabel,
  TCh5ButtonCheckboxPosition,
  TCh5ButtonIconUrlFillType,
  TCh5ButtonBackgroundImageFillType
} from "./t-ch5-button";

/**
 * @ignore
 */
export interface ICh5ButtonAttributes extends ICh5LightBaseAttributes {

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "The label of the button element."
   * ]
   * @name label
   * @attributeType "String"
   */
  label: string;

  /**
   * @documentation
   * [
   * "`labelinnerhtml` attribute",
   * "***",
   * "Sets the label of the button using HTML content. Takes preference over the label attribute."
   * ]
   * @name labelinnerhtml
   * @attributeType "EncodedHTML"
   */
  labelInnerHTML: string;

  /**
   * @documentation
   * [
   * "`iconclass` attribute",
   * "***",
   * "The iconClass attribute with Font Awesome icons and Material Icons. We can declare more than one CSS class in the iconClass attribute."
   * ]
   * @name iconclass
   * @attributeType "IconClass"
   */
  iconClass: string;

  /**
   * @documentation
   * [
   * "`iconurl` attribute",
   * "***",
   * "The attribute used to add an SVG or image icon to the button."
   * ]
   * @name iconurl
   * @attributeType "ImageURL"
   */
  iconUrl: string;

  /**
   * @documentation
   * [
   * "`backgroundimageurl` attribute",
   * "***",
   * "Sets the image to be displayed as the background for the button. The attribute type is String and the default value is empty."
   * ]
   * @name backgroundimageurl
   * @attributeType "String"
   */
  backgroundImageUrl: string;

  /**
   * @documentation
   * [
   * "`receivestatetype` attribute",
   * "***",
   * "After receiving a stateType value from the control system, this value is applied to the type attribute.",
   * "See description of the type attribute."
   * ]
   * @name receivestatetype
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateType: string;

  /**
   * @documentation
   * [
   * "`receivestateselected` attribute",
   * "***",
   * "When received, a true value applies the selected state to the component."
   * ]
   * @name receivestateselected
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
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
   * @attributeType "Join"
   */
  receiveStateLabel: string;

  /**
   * @documentation
   * [
   * "`receivestatescriptlabelhtml` attribute",
   * "***",
   * "Allows the signal script evaluation to be applied to the button's inner HTML. Allows for multiline, multistyled labels."
   * ]
   * @name receivestatescriptlabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScriptLabelHtml: string;

  /**
   * @documentation
   * [
   * "`receivestateiconclass` attribute",
   * "***",
   * "The icon class received from the control system."
   * ]
   * @name receivestateiconclass
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateIconClass: string;

  /**
   * @documentation
   * [
   * "`receivestateiconurl` attribute",
   * "***",
   * "After receiving the stateIconUrl value from the control system, this value is applied to the iconUrl attribute.",
   * "See description of the iconUrl attribute."
   * ]
   * @name receivestateiconurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateIconUrl: string;

  /**
   * @documentation
   * [
   * "`receivestatebackgroundimageurl` attribute",
   * "***",
   * "After receiving the value from the control system, this value is applied to the backgroundImageUrl attribute.",
   * "See description of the backgroundImageUrl attribute."
   * ]
   * @name receivestatebackgroundimageurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateBackgroundImageUrl: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends an event on click or tap (mouse or swipe up and down quickly).",
   * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event.",
   * "Examples include the SIMPL Logic Symbol for Toggle with a description of ",
   * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnClick: string;

  /**
   * @documentation
   * [
   * "`multilinesupport` attribute",
   * "***",
   * "The default value is false. When true, the button label supports multiple lines."
   * ]
   * @name multilinesupport
   * @default false
   * @attributeType "Boolean"
   */
  multilineSupport: boolean;

  /**
   * @documentation
   * [
   * "`truncatetext` attribute",
   * "***",
   * "The default value is true. When true, overflowing label text is truncated with an ellipsis."
   * ]
   * @name truncatetext
   * @default true
   * @attributeType "Boolean"
   */
  truncateText: boolean;

  /**
   * @documentation
   * [
   * "`type` attribute",
   * "***",
   * "Valid values: 'default', 'primary', 'secondary', 'info', 'success', 'warning', 'danger', 'text'.",
   * "Overrides the appearance of the button with alternative CSS applied via the [type] attribute selector. ",
   * "If no 'type' is provided, the type of 'default' is used."
   * ]
   * @name type
   * @default default
   * @attributeType "EnumeratedValue"
   */
  type: TCh5ButtonType;

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Overrides the appearance of the button with alternative CSS applied via the [size] attribute selector, ",
   * "where size is the value of the property. If no 'size' is provided, the size of 'regular' is used."
   * ]
   * @name size
   * @default regular
   * @attributeType "EnumeratedValue"
   */
  size: TCh5ButtonSize;

  /**
   * @documentation
   * [
   * "`shape` attribute",
   * "***",
   * "The default value is 'rounded-rectangle'. Valid values: 'rounded-rectangle', 'rectangle', 'circle', 'oval', 'tab'.",
   * "The shape of the button."
   * ]
   * @name shape
   * @default rounded-rectangle
   * @attributeType "EnumeratedValue"
   */
  shape: TCh5ButtonShape;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "Valid values: 'width', 'height', 'both'.",
   * "When the stretch property is set, the button element inherits the width and/or height of the container. ",
   * "If stretch=height is used, the button will be responsive based on the label length until it reaches the ",
   * "max-width of the container. If stretch=width is applied, there is no responsiveness after reaching the ",
   * "max-width, and the text will overflow. The same applies if stretch=both is used."
   * ]
   * @name stretch
   * @attributeType "EnumeratedValue"
   */
  stretch: TCh5ButtonStretch;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "The default value is 'first'. Valid values: 'first', 'last', 'top', 'bottom'.",
   * "The icon position relative to the label."
   * ]
   * @name iconposition
   * @default first
   * @attributeType "EnumeratedValue"
   */
  iconPosition: TCh5ButtonIconPosition;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'.",
   * "Lays out the icon and label in a horizontal or vertical flow."
   * ]
   * @name orientation
   * @default horizontal
   * @attributeType "EnumeratedValue"
   */
  orientation: TCh5ButtonOrientation;

  /**
   * @documentation
   * [
   * "`halignlabel` attribute",
   * "***",
   * "Valid values: 'center', 'left', 'right'.",
   * "When the hAlignLabel property is set, the label and the icon of the button are horizontally aligned. ",
   * "The center property sets the horizontal alignment of the label to the center of the button. ",
   * "The left property sets the horizontal alignment of the label to the left of the button. ",
   * "The right property sets the horizontal alignment of the label to the right of the button."
   * ]
   * @name halignlabel
   * @default center
   * @attributeType "EnumeratedValue"
   */
  hAlignLabel: TCh5ButtonHorizontalAlignLabel;

  /**
   * @documentation
   * [
   * "`valignlabel` attribute",
   * "***",
   * "Valid values: 'middle', 'top', 'bottom'.",
   * "When the vAlignLabel property is set, the label and the icon of the button are vertically aligned. ",
   * "The middle property sets the vertical alignment of the label to the middle of the button. ",
   * "The top property sets the vertical alignment of the label to the top of the button. ",
   * "The bottom property sets the vertical alignment of the label to the bottom of the button."
   * ]
   * @name valignlabel
   * @default middle
   * @attributeType "EnumeratedValue"
   */
  vAlignLabel: TCh5ButtonVerticalAlignLabel;

  /**
   * @documentation
   * [
   * "`selected` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the selected state of the component. It is styled purely via CSS ",
   * "through the [selected] attribute selector; no CSS class is added."
   * ]
   * @name selected
   * @default false
   * @attributeType "Boolean"
   */
  selected: boolean;

  /**
   * @documentation
   * [
   * "`pressed` attribute",
   * "***",
   * "The default value is false.",
   * "This property reflects the pressed state of the component. It is styled purely via CSS ",
   * "through the [pressed] attribute selector; no CSS class is added."
   * ]
   * @name pressed
   * @default false
   * @attributeType "Boolean"
   */
  pressed: boolean;

  /**
   * @documentation
   * [
   * "`checkboxshow` attribute",
   * "***",
   * "The default value is false.",
   * "This property is used to display or hide a checkbox. When true, the checkbox is displayed, styled purely via CSS ",
   * "through the [checkboxshow] attribute selector."
   * ]
   * @name checkboxshow
   * @default false
   * @attributeType "Boolean"
   */
  checkboxShow: boolean;

  /**
   * @documentation
   * [
   * "`checkboxposition` attribute",
   * "***",
   * "The default value is left.",
   * "This property is used to set the position of a checkbox in a button. The value left would set the checkbox ",
   * "to the left of the button, and the value right would set the checkbox to the right of the button."
   * ]
   * @name checkboxposition
   * @default left
   * @attributeType "EnumeratedValue"
   */
  checkboxPosition: TCh5ButtonCheckboxPosition;

  /**
   * @documentation
   * [
   * "`iconurlfilltype` attribute",
   * "***",
   * "Valid values: 'stretch', 'stretch-aspect', 'center', 'tile', 'initial'.",
   * "Sets the fill type of the image set in iconUrl. Uses the CSS property background-size for the implementation."
   * ]
   * @name iconurlfilltype
   * @attributeType "EnumeratedValue"
   */
  iconUrlFillType: TCh5ButtonIconUrlFillType;

  /**
   * @documentation
   * [
   * "`backgroundimagefilltype` attribute",
   * "***",
   * "The default value is 'stretch-aspect'. Applicable values are 'stretch', 'stretch-aspect', 'center', 'tile'.",
   * "Sets the background image fill type for the button. Uses the CSS property background-size for the implementation."
   * ]
   * @name backgroundimagefilltype
   * @default stretch-aspect
   * @attributeType "EnumeratedValue"
   */
  backgroundImageFillType: TCh5ButtonBackgroundImageFillType;
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5AdvanceButtonCheckboxPosition, TCh5AdvanceButtonHorizontalAlignLabel, TCh5AdvanceButtonIconPosition, TCh5AdvanceButtonIconUrlFillType, TCh5AdvanceButtonType, TCh5AdvanceButtonVerticalAlignLabel } from ".";

/**
 * @ignore
 */
export interface ICh5AdvanceButtonModeCommonAttributes {

  /**
   * @documentation
   * [
   * "`labelinnerhtml` attribute",
   * "***",
   * "The labelInnerHTML of the button element."
   * ]
   * @name labelinnerhtml
   * @attributeType "EncodedHTML"
   * @hidden true
   */
  labelInnerHTML: string;

  /**
   * @documentation
   * [
   * "`type` attribute",
   * "***",
   * "Valid values: 'default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'.",
   * "Overrides the appearance of the button with alternative CSS ",
   * "defined in classes defined with ch5-advance-button--type, where type is ",
   * "the value of the property. If no 'type' is provided, the type of ",
   * "'default' is used."
   * ]
   * @name type
   * @default default
   * @attributeType "EnumeratedValue"
   */
  type: TCh5AdvanceButtonType | null;

  /**
   * @documentation
   * [
   * "`iconclass` attribute",
   * "***",
   * "The icon class."
   * ]
   * @name iconclass
   * @attributeType "IconClass"
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
   * @attributeType "EnumeratedValue"
   */
  iconPosition: TCh5AdvanceButtonIconPosition | null;

  /**
   * @documentation
   * [
   * "`iconurl` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name iconurl
   * @attributeType "ImageURL"
   */
  iconUrl: string;

  /**
   * @documentation
   * [
   * "`iconUrlFillType` attribute",
   * "***",
   * "Sets the icon url fill type. Default value is 'null'. Applicable values are 'null', 'stretch', 'stretch-aspect', 'center', 'tile', 'initial'. Uses the css property background-size for the implementation."
   * ]
   * @name iconurlfilltype
   * @default null
   * @attributeType "EnumeratedValue"
   */
  iconUrlFillType: TCh5AdvanceButtonIconUrlFillType | null;

  /**
   * @documentation
   * [
   * "`customclass` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name customclass
   * @attributeType "String"
   */
  customClass: string;

  /**
   * @documentation
   * [
   * "`customstyle` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name customstyle
   * @attributeType "String"
   */
  customStyle: string;

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
   * @attributeType "EnumeratedValue"
   */
  checkboxPosition: TCh5AdvanceButtonCheckboxPosition | null;

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
   * @attributeType "EnumeratedValue"
   */
  hAlignLabel: TCh5AdvanceButtonHorizontalAlignLabel | null;

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
   * @attributeType "EnumeratedValue"
   */
  vAlignLabel: TCh5AdvanceButtonVerticalAlignLabel | null;
}
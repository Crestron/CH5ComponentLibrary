// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5SliderHorizontalAlignLabel, TCh5SliderOrientation, TCh5SliderSize, TCh5SliderType, TCh5SliderVerticalAlignLabel } from "./t-ch5-slider";


/**
 * @ignore
 */
export interface ICh5SliderLabelAttributes {

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "The label of the button element."
   * ]
   * @name label
   */
  label: string;

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
   */
  orientation: TCh5SliderOrientation;

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
   */
  type: TCh5SliderType;

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
   */
  hAlignLabel: TCh5SliderHorizontalAlignLabel;

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
   */
  vAlignLabel: TCh5SliderVerticalAlignLabel;

  /**
   * @documentation
   * [
   * "`receivestatelabel` attribute",
   * "***",
   * "When received, applies the value on the label."
   * ]
   * @name receivestatelabel
   */
  receiveStateLabel: string;

}

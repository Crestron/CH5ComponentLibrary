// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ButtonCheckboxPosition, TCh5ButtonHorizontalAlignLabel, TCh5ButtonIconPosition, TCh5ButtonType, TCh5ButtonVerticalAlignLabel } from ".";

/**
 * @ignore
 */
export interface ICh5ButtonModeCommonAttributes {

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
   */
  type: TCh5ButtonType | null;

  /**
   * @documentation
   * [
   * "`icon` attribute",
   * "***",
   * "The icon class."
   * ]
   * @name iconclass
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
   */
  iconPosition: TCh5ButtonIconPosition | null;

  /**
   * @documentation
   * [
   * "`iconurl` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name iconurl
   */
  iconUrl: string;

  /**
   * @documentation
   * [
   * "`customClass` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name customClass
   */
  customClass: string;

  /**
   * @documentation
   * [
   * "`customStyle` attribute",
   * "***",
   * "The attribute used for add a SVG image."
   * ]
   * @name customStyle
   */
  customStyle: string;

  /**
   * @documentation
   * [
   * "`checkboxPosition` attribute",
   * "***",
   * "The default value is false.",
   * "This property is used to display or hide a checkbox. If set to true, a checkbox is displayed and ",
   * "'ch5-button__checkbox' will be applied as the CSS class on the component."
   * ]
   * @name checkboxPosition
   * @default false
   */
  checkboxPosition: TCh5ButtonCheckboxPosition | null;

  /**
    * @documentation
    * [
    * "`hAlignLabel` attribute",
    * "***",
    * "Valid values: 'width', 'height', 'both'.",
    * "When the stretch property is set, the button element inherits the ",
    * "width and/or height of the container. If stretch=height is used, ",
    * "the button will be responsive based on the label length until it ",
    * "reaches the max-width of the container. If stretch=width is ",
    * "applied, there is no responsiveness after reaching the max-width, and ",
    * "the text will overflow. The same applies if stretch=both is used. Note ",
    * "that if the button element shape is 'circle' or 'oval', the stretch ",
    * "property will be ignored."
    * ]
    * @name hAlignLabel
    */
  hAlignLabel: TCh5ButtonHorizontalAlignLabel | null;

  /**
  * @documentation
  * [
  * "`vAlignLabel` attribute",
  * "***",
  * "Valid values: 'width', 'height', 'both'.",
  * "When the stretch property is set, the button element inherits the ",
  * "width and/or height of the container. If stretch=height is used, ",
  * "the button will be responsive based on the label length until it ",
  * "reaches the max-width of the container. If stretch=width is ",
  * "applied, there is no responsiveness after reaching the max-width, and ",
  * "the text will overflow. The same applies if stretch=both is used. Note ",
  * "that if the button element shape is 'circle' or 'oval', the stretch ",
  * "property will be ignored."
  * ]
  * @name vAlignLabel
  */
  vAlignLabel: TCh5ButtonVerticalAlignLabel | null;
}

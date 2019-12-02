// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCh5BackgroundScale, TCh5BackgroundRepeat } from './types';


/**
 * @ignore
 */
export interface ICh5BackgroundAttributes extends ICh5CommonAttributes {
  /**
   * @documentation
   * [
   * "`url` attribute",
   * "***",
   * "When one or more image URLs to be used as background. ",
   * "Supported image types include JPEG, PNG, SVG, and BMP. ",
   * "Motion GIFs are not supported. Multiple urls can be provided ",
   * "separated by | (vertical bar) to have images replaced over time."
   * ]
   * @name url
   */
  url: string;

  /**
   * @documentation
   * [
   * "`backgroundcolor` attribute",
   * "***",
   * "When one or more color of background using CSS background-color property ",
   * "syntax including color names, #hex codes, rgb(), rgba(), hsl() and hsla().",
   * "Multiple colors can be provided separated by | (vertical bar) to have colors ",
   * "replaced based on time defined.",
   * "This attribute is superseded by the url attribute."
   * ]
   * @name backgroundcolor
   */
  backgroundColor: string;

  /**
   * @documentation
   * [
   * "`repeat` attribute",
   * "***",
   * "The repeat property sets how a background image will be repeated. In the absence of ",
   * "repeat attribute no-repeat will be considered as default. Support values no-repeat, ",
   * "repeat-x, repeat-y and repeat. ",
   * "The value repeat-x repeats image horizontally, repeat-y repeats image vertically, repeat ",
   * "repeats both vertically and horizontally. The last image will be clipped if it does not fit."
   * ]
   * @name repeat
   */
  repeat: TCh5BackgroundRepeat;

  /**
   * @documentation
   * [
   * "`scale` attribute",
   * "***",
   * "Default stretch. Valid values: stretch, fill, fit ",
   * "defines how an image will fill the component when the ",
   * "component and the image do not have the same aspect ratio. ",
   * "stretch will transform the image to have same aspect ratio as the component ",
   * "fill will size the image to leave no extra space ",
   * "but will crop off either top and bottom or left and right to ",
   * "completely fill the component and fit will preserve the image aspect ratio ",
   * "centering the image leaving either letter box on top and bottom or ",
   * "pillar box on left and right. For fit attribute, see related ",
   * "imgBackgroundColor attribute."
   * ]
   * @name scale
   */
  scale: TCh5BackgroundScale;

  /**
   * @documentation
   * [
   *  "`refreshrate` attribute",
   * "***",
   * "Default 600. min value 10 and max value 604800 ",
   * "when more than one image provided in url attribute ",
   * "this attribute provides length of time in seconds each ",
   * "image will be displayed. Values outside of min and max ",
   * "will be capped at closest valid value."
   * ]
   * @name refreshrate
   */
  refreshRate: number | string;

  /**
   * @documentation
   * [
   * "`imgbackgroundcolor` attribute",
   * "***",
   * "Default black",
   * "Related to the scale attribute having value of fit ",
   * "this attribute defines the color of the pillarbox or ",
   * "letterbox borders when image aspect ratio is not the ",
   * "same of the component aspect ratio."
   * ]
   * @name imgbackgroundcolor
   */
  imgBackgroundColor: string;

  /**
   * @documentation
   * [
   * "`transitioneffect` attribute",
   * "***",
   * "Default ease",
   * "when more than one image/color provided in url/backgroundcolor attribute ",
   * "this attribute provide type of transition using CSS transition-timing-syntax ",
   * "property syntax. See related attribute transition-duration."
   * ]
   * @name transitioneffect
   */
  transitionEffect: string;

  /**
   * @documentation
   * [
   * "`transitionduration` attribute",
   * "***",
   * "Default 1s",
   * "when more than one image/color provided in url/backgroundcolor attribute ",
   * "this attribute provides the time length of the transition ",
   * "using CSS transition-duration syntax."
   * ]
   * @name transitionduration
   */
  transitionDuration: string;

  /**
   * @documentation
   * [
   * "`receivestaterefreshrate` attribute",
   * "***",
   * "when defined, will set refreshRate attribute"
   * ]
   * @name receivestaterefreshrate
   */
  receiveStateRefreshRate: string;

  /**
   * @documentation
   * [
   * "`receivestateurl` attribute",
   * "***",
   * "when defined, will set url attribute"
   * ]
   * @name receivestateurl
   */
  receiveStateUrl: string;

  /**
   * @documentation
   * [
   * "`receivestatebackgroundcolor` attribute",
   * "***",
   * "when defined, will set the backgroundColor attribute"
   * ]
   * @name receivestatebackgroundcolor
   */
  receiveStateBackgroundColor: string;

}
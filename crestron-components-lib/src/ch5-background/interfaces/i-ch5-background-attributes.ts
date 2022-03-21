// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from '../../ch5-common/interfaces';
import { TCh5BackgroundScale, TCh5BackgroundRepeat } from './index';

/**
 * @ignore
 */
export interface ICh5BackgroundAttributes extends ICh5CommonAttributes {
  /**
   * @documentation
   * [
   * "`url` attribute",
   * "***",
   * "For when one or more image URLs will be used as the background.",
   * "Supported image types include JPEG, PNG, SVG, and BMP.",
   * "Animated GIFs are not supported. Multiple URLs can be provided ",
   * "separated by | (vertical bar) to have images cycle over time."
   * ]
   * @name url
   * @attributeType "ImageUrl"
   */
  url: string;

  /**
   * @documentation
   * [
   * "`backgroundcolor` attribute",
   * "***",
   * "Use when one or more background colors will be used via the CSS background-color property ",
   * "syntax including color names, #hex codes, rgb(), rgba(), hsl() and hsla().",
   * "Multiple colors can be provided separated by a | (vertical bar) to have colors ",
   * "cycled based on the time defined. A black color will be used for invalid input.",
   * "This attribute is superseded by the url attribute."
   * ]
   * @name backgroundcolor
   * @attributeType "String"
   */
  backgroundColor: string;

  /**
   * @documentation
   * [
   * "`repeat` attribute",
   * "***",
   * "The default value is 'no-repeat'. ",
   * "The repeat property sets how a background image will be repeated. In the absence of ",
   * "the repeat attribute. Valid values: 'no-repeat', ",
   * "'repeat-x', 'repeat-y', and 'repeat'.",
   * "The value 'repeat-x' repeats image horizontally, 'repeat-y' repeats the image vertically, and 'repeat' ",
   * "repeats both vertically and horizontally. The last image will be clipped if it does not fit."
   * ]
   * @name repeat
   * @default no-repeat
   * @attributeType "EnumeratedValue"
   */
  repeat: TCh5BackgroundRepeat;

  /**
   * @documentation
   * [
   * "`scale` attribute",
   * "***",
   * "The default value is 'stretch'. Valid values: 'stretch', 'fill', 'fit'.",
   * "Defines how an image will fill the component when the ",
   * "component and the image do not have the same aspect ratio.",
   * "'stretch' will transform the image to have the same aspect ratio as the component, ",
   * "'fill' will size the image to leave no extra space ",
   * "but will crop off either the top and bottom or left and right to ",
   * "fill the component completely, and 'fit' will preserve the image aspect ratio by ",
   * "centering the image and leaving either a letter box on the top and bottom or ",
   * "a pillar box on the left and right. For fit attribute, see the related ",
   * "imgBackgroundColor attribute.",
   * "This attribute will be superseded by the repeat attribute if both are provided."
   * ]
   * @name scale
   * @default stretch
   * @attributeType "EnumeratedValue"
   * @showWhen [{"repeat": null }]
   */
  scale: TCh5BackgroundScale;

  /**
   * @documentation
   * [
   *  "`refreshrate` attribute",
   * "***",
   * "The default value is 600. Min value is 10 and max value is 604800.",
   * "When more than one image is provided in the url attribute, ",
   * "this attribute provides the duration in seconds that each ",
   * "image will be displayed. Values outside of the min and max ",
   * "will be capped at the closest valid value.",
   * "This attribute supersedes the scale attribute if both are provided."
   * ]
   * @name refreshrate
   * @default 600
   * @attributeType "Integer"
   */
  refreshRate: number | string;

  /**
   * @documentation
   * [
   * "`imgbackgroundcolor` attribute",
   * "***",
   * "The default value is 'black'. ",
   * "Related to the scale attribute having a value of 'fit'. ",
   * "This attribute defines the color of the pillar box or ",
   * "letter box borders when the image aspect ratio is not the ",
   * "same as the component aspect ratio."
   * ]
   * @name imgbackgroundcolor
   * @default black
   * @attributeType "String"
   */
  imgBackgroundColor: string;

  /**
   * @documentation
   * [
   * "`transitioneffect` attribute",
   * "***",
   * "The default value is 'ease'. ",
   * "When more than one image or color is provided in url or backgroundcolor attribute, ",
   * "this attribute provide the type of transition using the CSS transition-timing-syntax ",
   * "property syntax. See the related attribute transition-duration."
   * ]
   * @name transitioneffect
   * @default ease
   * @attributeType "String"
   */
  transitionEffect: string;

  /**
   * @documentation
   * [
   * "`transitionduration` attribute",
   * "***",
   * "The default value is '1s'. ",
   * "when more than one image or color is provided in url or backgroundcolor attribute, ",
   * "this attribute provides the duration of the transition ",
   * "using CSS transition-duration syntax."
   * ]
   * @name transitionduration
   * @default 1s
   * @attributeType "String"
   */
  transitionDuration: string;

  /**
   * @documentation
   * [
   * "`receivestaterefreshrate` attribute",
   * "***",
   * "When defined, this will set the refreshRate attribute."
   * ]
   * @name receivestaterefreshrate
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateRefreshRate: string;

  /**
   * @documentation
   * [
   * "`receivestateurl` attribute",
   * "***",
   * "When defined, this will set the url attribute.  This attribute",
   * " takes precedence over backgroundcolor, url, and receiveStateBackgroundColor ",
   * " attributes."
   * ]
   * @name receivestateurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateUrl: string;

  /**
   * @documentation
   * [
   * "`receivestatebackgroundcolor` attribute",
   * "***",
   * "When defined, this will set the backgroundColor attribute. This attribute",
   * " is superseded by the receivestateurl attribute."
   * ]
   * @name receivestatebackgroundcolor
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateBackgroundColor: string;

}

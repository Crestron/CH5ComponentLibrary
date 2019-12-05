// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCh5ListElementOrientation } from './types';

/**
 * @ignore
 */
export interface ICh5ListAttributes extends ICh5CommonAttributes {

  /**
   * @name size
   * @documentation
   * [
   * "`size` attribute",
   *  "***",
   *  "The number of items in a list. The max value is 1000."
   * ]
   */
  size: number | null;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is vertical. Values are vertical or horizontal.",
   * "Places the control elements in a horizontal or vertical orientation.",
   * "This is done with the CSS overflow property. The overflow property specifies ",
   * "what happens if content overflows an element's box."
   * ]
   * @name orientation
   */
  orientation: TCh5ListElementOrientation | null;

  /**
   * @documentation
   * [
   * "`bufferammount` attribute",
   * "***",
   * "The number of elements to be rendered outside of the current container's",
   * "viewport (visible area)."
   * ]
   * @name bufferamount
   */
  bufferAmount: number | null;

  /**
   * @documentation
   * [
   * "`itemheight` attribute",
   * "***",
   * "The height of an item. The value of the height can be in px and vh.",
   * "The item height for a vertical infinite list is required. If this is not provided, ",
   * "CH5 will calculate based on the first item height.",
   * "Each item of a list must have the same height."
   * ]
   * @name itemheight
   */
  itemHeight: string | null;

  /**
   * @documentation
   * [
   * "`itemwidth` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes.",
   * "The width of an item. The value of the width can be in px and vh.",
   * "The item width for a vertical infinite list is required. If this is not provided, ",
   * "CH5 will calculate based on the first item width.",
   * "Each item of a list must have the same width."
   * ]
   * @name itemwidth
   */
  itemWidth: string | null;

  /**
   * @documentation
   * [
   * "`minWidth` attribute",
   * "***",
   * "Recommendation: use the same unit type for all width and height attributes.",
   * "The min width of the list container."
   * ]
   * @name minwidth
   */
  minWidth: string | null;

  /**
   * @documentation
   * [
   * "`minWidth` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes.",
   * "The max width of the list container."
   * ]
   * @name maxwidth
   */
  maxWidth: string | null;

  /**
   * @documentation
   * [
   * "`minHeight` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes.",
   * "The min height of the list container."
   * ]
   * @name minheight
   */
  minHeight: string | null;

  /**
   * @documentation
   * [
   * "`maxHeight` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes.",
   * "The max height of the list container."
   * ]
   * @name maxheight
   */
  maxHeight: string | null;

  /**
   * @documentation
   * [
   * "`scrollToTime` attribute",
   * "***",
   * "The default value is 500ms. The duration to animate changing a list location to scrollTo.",
   * "signal value"
   * ]
   * @name scrolltotime
   */
  scrollToTime: number;

  /**
   * @name indexid
   * @documentation
   * [
   * "`indexid` attribute",
   * "***",
   * "The pattern that will be replaced with the id from the list items iteration.",
   * "Example: {{ idx }}"
   * ]
   */
  indexId: string | null;

  /**
   * @name receivestatesize
   * @documentation
   * [
   * "`receivestatesize` attribute",
   * "***",
   * "Represents the size of the list received from Native."
   * ]
   */
  receiveStateSize: string | null | undefined;

  /**
   * @name receivestatescrollto
   * @documentation
   * [
   * "`receivestatescrollto` attribute",
   * "***",
   * "Represents the scroll position of the list received from Native.",
   * "Example: Value 10 of receivestatescrollto will scroll the list",
   * "to the 10th element."
   * ]
   */
  receiveStateScrollTo: string | null | undefined;

  /**
   * @name receivestatetemplatevars
   * @documentation
   * [
   * "`receivestatetemplatevars` attribute",
   * "***",
   * "Represents the template variables that are received from Native."
   * ]
   */
  receiveStateTemplateVars: string | null | undefined;
}

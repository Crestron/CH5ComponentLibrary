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
   *  "The number of items in a list. Max value is 1000"
   * ]
   */
  size: number | null;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "Default vertical. Values are vertical or horizontal",
   * "Lays out the elements of the control in a horizontal or vertical manner.",
   * "This is done with CSS overflow property. The overflow property specifies",
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
   * "viewport ( visible area )."
   * ]
   * @name bufferamount
   */
  bufferAmount: number | null;

  /**
   * @documentation
   * [
   * "`itemheight` attribute",
   * "***",
   * "Height of an item. The value of the height can be in px and vh.",
   * "We need the item height for vertical infinite list. If this will not be provided",
   * "we will calculate base on the first item height.",
   * "Each item of list needs to have the same height."
   * ]
   * @name itemheight
   */
  itemHeight: string | null;

  /**
   * @documentation
   * [
   * "`itemwidth` attribute",
   * "***",
   * "Recommendation: use the same unit type for all width/height attributes",
   * "Width of an item. The value of the height can be in px and vh.",
   * "We need the item horizontal for vertical infinite list. If this will not be",
   * "provided, we will calculate base on the first item width.",
   * "Each item on the list needs to have the same width"
   * ]
   * @name itemwidth
   */
  itemWidth: string | null;

  /**
   * @documentation
   * [
   * "`minWidth` attribute",
   * "***",
   * "Recommendation: use the same unit type for all width/height attributes",
   * "Min width of the list container"
   * ]
   * @name minwidth
   */
  minWidth: string | null;

  /**
   * @documentation
   * [
   * "`minWidth` attribute",
   * "***",
   * "Recommendation: use the same unit type for all width/height attributes",
   * "Max width of the list container"
   * ]
   * @name maxwidth
   */
  maxWidth: string | null;

  /**
   * @documentation
   * [
   * "`minHeight` attribute",
   * "***",
   * "Recommendation: use the same unit type for all width/height attributes",
   * "Min height of the list container"
   * ]
   * @name minheight
   */
  minHeight: string | null;

  /**
   * @documentation
   * [
   * "`maxHeight` attribute",
   * "***",
   * "Recommendation: use the same unit type for all width/height attributes",
   * "Max height of the list container"
   * ]
   * @name maxheight
   */
  maxHeight: string | null;

  /**
   * @documentation
   * [
   * "`scrollToTime` attribute",
   * "***",
   * "500ms default. How long to animate changing list location to scrollTo",
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
   * "Represents the size of the list received from Native"
   * ]
   */
  receiveStateSize: string | null | undefined;

  /**
   * @name receivestatescrollto
   * @documentation
   * [
   * "`receivestatescrollto` attribute",
   * "***",
   * "Represents the scroll position of the list received from Native",
   * "Example: value 10 of receivestatescrollto will scroll the list",
   * "to the 10th element"
   * ]
   */
  receiveStateScrollTo: string | null | undefined;

  /**
   * @name receivestatetemplatevars
   * @documentation
   * [
   * "`receivestatetemplatevars` attribute",
   * "***",
   * "Represents the template variables that are received from native"
   * ]
   */
  receiveStateTemplateVars: string | null | undefined;
}

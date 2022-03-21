// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from '../../ch5-common/interfaces';
import { TCh5ListElementOrientation } from '../interfaces/t-ch5-list';

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
   * "The default value is '1'. ",
   *  "The number of items in a list. The max value is 1000."
   * ]
   * @default 1
   * @attributeType "integer"
   */
  size: number | null;

  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'vertical'. Valid values: 'vertical' or 'horizontal'. ",
   * "Positions the control elements in a horizontal or vertical orientation. ",
   * "This is done with the CSS overflow property. The overflow property specifies ",
   * "what happens if content overflows an element's box."
   * ]
   * @name orientation
   * @default vertical
   * @attributeType "String"
   */
  orientation: TCh5ListElementOrientation | null;

  /**
   * @documentation
   * [
   * "`bufferammount` attribute",
   * "***",
   * "The default value is '0'. ",
   * "The number of elements to be rendered outside of the current container's ",
   * "viewport (visible area)."
   * ]
   * @name bufferamount
   * @default 0
   * @attributeType "integer"
   */
  bufferAmount: number | null;

  /**
   * @documentation
   * [
   * "`itemheight` attribute",
   * "***",
   * "The height of an item. The height value can be in px and vh. ",
   * "The item height is needed for a vertical infinite list. If the height is not provided, ",
   * "the infinite list is calculated based on the first item height. ",
   * "Each list item must have the same height."
   * ]
   * @name itemheight
   * @attributeType "String"
   */
  itemHeight: string | null;

  /**
   * @documentation
   * [
   * "`itemwidth` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes. ",
   * "The width of an item. The height value can be in px and vh. ",
   * "The item width is needed for a vertical infinite list. If the width is not provided, ",
   * "the infinite list is calculated based on the first item width. ",
   * "Each list item must have the same width."
   * ]
   * @name itemwidth
   * @attributeType "String"
   */
  itemWidth: string | null;

  /**
   * @documentation
   * [
   * "`minWidth` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width height attributes. ",
   * "The min width of the list container."
   * ]
   * @name minwidth
   * @attributeType "String"
   */
  minWidth: string | null;

  /**
   * @documentation
   * [
   * "`minWidth` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes. ",
   * "The max width of the list container."
   * ]
   * @name maxwidth
   * @attributeType "String"
   */
  maxWidth: string | null;

  /**
   * @documentation
   * [
   * "`minHeight` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes ",
   * "The min height of the list container."
   * ]
   * @name minheight
   * @attributeType "String"
   */
  minHeight: string | null;

  /**
   * @documentation
   * [
   * "`maxHeight` attribute",
   * "***",
   * "Recommendation: Use the same unit type for all width and height attributes. ",
   * "The max height of the list container."
   * ]
   * @name maxheight
   * @attributeType "String"
   */
  maxHeight: string | null;

  /**
   * @documentation
   * [
   * "`scrollToTime` attribute",
   * "***",
   * "The default value is 500ms. Sets how long to animate changing a list location to the scrollTo ",
   * "signal value."
   * ]
   * @name scrolltotime
   * @default 500ms
   * @limits [{"min": 0, "max": 1000}]
   * @attributeType "integer"
   */
  scrollToTime: number;

  /**
   * @name indexid
   * @documentation
   * [
   * "`indexid` attribute",
   * "***",
   * "The pattern that will be replaced with the id from the list items iteration. ",
   * "Example: {{ idx }}"
   * ]
   * @attributeType "String"
   */
  indexId: string | null;

  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "The default value is false. If true, shows a scrollbar for the list."
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "boolean"
   */
  scrollbar: boolean;

  /**
   * @documentation
   * [
   * "`pageswipe` attribute",
   * "***",
   * "The default value is false. If false, a swipe gesture moves the list with momentum as ",
   * "expected on 'throwable' lists. If true, a swipe gesture will move the list only ",
   * "woith the number of visible items, snapping the first visible item to the top ",
   * "for a vertical list or on left for dir='ltr' attribute lists."
   * ]
   * @name pagedswipe
   * @default false
   * @attributeType "boolean"
   */
  pagedSwipe: boolean;

  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "The default value is false. If false, continued swiping when reaching end of list reveals ",
   * "no items beyond the last. If true, if the attirbute is added without a value, ",
   * "the first list item will ",
   * "virtually follow the last item when the end of the list is reached. ",
   * "Swiping towards the beginning of the list items will also show the last item ",
   * "prior to the first."
   * ]
   * @name endless
   * @default false
   * @attributeType "boolean"
   */
  endless: boolean;

  /**
   * @name receivestatesize
   * @documentation
   * [
   * "`receivestatesize` attribute",
   * "***",
   * "Represents the size of the list received from Native."
   * ]
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "join"
   */
  receiveStateSize: string | null | undefined;

  /**
   * @name receivestatescrollto
   * @documentation
   * [
   * "`receivestatescrollto` attribute",
   * "***",
   * "Represents the scroll position of the list received from Native. ",
   * "Example: value 10 of receivestatescrollto will scroll the list ",
   * "to the 10th element."
   * ]
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "join"
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
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "join"
   */
  receiveStateTemplateVars: string | null | undefined;
}

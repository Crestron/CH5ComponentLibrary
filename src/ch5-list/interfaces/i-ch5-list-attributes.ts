// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ListElementOrientation } from '../interfaces/t-ch5-list';

/**
 * @name Ch5 List
 * @isattribute false
 * @tagName ch5-list
 * @role list
 * @description Ch5 List offers a wide range of functionality out-of-the-box.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-list` element",
 * "***",
 * " Used to display a list of items."
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-list:all",
 *      "description": "Crestron List (All Attributes)",
 *      "body": [
 *        "<ch5-list indexid=\"${1:idx}\"",
 *        "\tsize=\"${2:5}\"",
 *        "\torientation=\"${3:horizontal}\"",
 *        "\tbufferamount=\"${4:5}\"",
 *        "\titemheight=\"${5:75px}\"",
 *        "\titemwidth=\"${6:125px}\"",
 *        "\tminwidth=\"${7:250px}\"",
 *        "\tmaxwidth=\"${8:500px}\"",
 *        "\tminheight=\"${9:100px}\"",
 *        "\tmaxheight=\"${10:150px}\"",
 *        "\tpagedswipe=\"${11:false}\"",
 *        "\tendless=\"${12:false}\"",
 *        "\tscrollbar=\"${13:true}\"",
 *        "\tscrolltotime=\"${14}\"",
 *        "\treceivestatesize=\"${15}\"",
 *        "\treceivestatescrollto=\"${16}\"",
 *        "\treceivestatetemplatevars=\"${17}\">",
 *        "</ch5-list>$0"
 *      ]
 *    },
 *    {
 *      "prefix": "ch5-list",
 *      "description": "Crestron List",
 *      "body": [
 *        "<ch5-list size=\"${1:10}\" orientation=\"${2|vertical,horizontal|}\">",
 *        "\t<template>",
 *        "\t\t<ch5-button id=\"btn_${3:id}\"",
 *        "\t\t\tlabel=\"${4:Crestron Button}\"",
 *        "\t\t\tsendeventonclick=\"${5:btn_${3}_clicked}\">",
 *        "\t\t</ch5-button>",
 *        "\t</template>",
 *        "</ch5-list>$0"
 *      ]
 *    },
 *    {
 *      "prefix": "ch5-list-",
 *      "description": "Crestron List Extended",
 *      "body": [
 *        "<ch5-list size=\"${1:10}\" orientation=\"${2|vertical,horizontal|}\" minwidth=\"${3:900px}\" maxwidth=\"${4:1115px}\"",
 *        "\t minheight=\"${5:600px}\" maxheight=\"${6:700px}\" indexid=\"${7:idx}\" itemwidth=\"${8:150px}\">",
 *        "\t<template>",
 *        "\t\t<ch5-button stretch=\"${9|both,width,height|}\" label=\"${10:mute}\"",
 *        "\t\t\treceivestateselected=\"levels_mute_selected_${7}\">",
 *        "\t\t</ch5-button>",
 *        "\t</template>",
 *        "</ch5-list>$0"
 *      ]
 *    }
 *    
 * ]
 * 
 */

/**
 * @ignore
 */
export interface ICh5ListAttributes {

  /**
   * @name size
   * @documentation
   * [
   * "`size` attribute",
   *  "***",
   *  "The number of items in a list. The max value is 1000."
   * ]
   * @default 1
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
   */
  orientation: TCh5ListElementOrientation | null;

  /**
   * @documentation
   * [
   * "`bufferammount` attribute",
   * "***",
   * "The number of elements to be rendered outside of the current container's ",
   * "viewport (visible area)."
   * ]
   * @name bufferamount
   * @default 0
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

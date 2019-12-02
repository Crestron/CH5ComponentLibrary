// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../ch5-common";
import { ICh5ListAttributes } from "./i-ch5-list-attributes";
import { TBoolAttribute } from '../ch5-common/types/t-bool-attribute';
import { ICh5Gestureable } from "../ch5-common/i-ch5-gestureable";

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


/**
 * @name Ch5 List
 * @isattribute false
 * @tagName ch5-list
 * @description Ch5 List offers a wide range of functionality out-of-the-box.
 * @documentation
 * [
 * "`ch5-list` element",
 * "***",
 * " Use to display repetitive items."
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
export interface ICh5List extends ICh5Gestureable, ICh5ListAttributes, ICh5Common {

  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "Default false. If true show a scrollbar for the list"
   * ]
   * @name scrollbar
   */
  scrollbar: TBoolAttribute

  /**
   * @documentation
   * [
   * "`pageswipe` attribute",
   * "***",
   * "Default false. If false, swipe gesture moves the list with momentum as",
   * "expected on 'throwable' lists. If true, a swipe gesture will move the list only",
   * "the number of visible items at a time, snapping the first visible item to top",
   * "for vertical list or on left for dir='ltr' attribute lists."
   * ]
   * @name pagedswipe
   */
  pagedSwipe: TBoolAttribute;

  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "Default false. If false, continued swiping when reach end of list will reveal",
   * "no entries beyond the last entry. If true, or just added without a value, ", 
   * "the first entry of the list will",
   * "virtually follow the last entry of list when reaching the end of the entries.",
   * "Swiping towards the beginning of list entries will also review the last entry",
   * "prior to the first entry. "
   * ]
   * @name endless
   */
  endless: TBoolAttribute;

}

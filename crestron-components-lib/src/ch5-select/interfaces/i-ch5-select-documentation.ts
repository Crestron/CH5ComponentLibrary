// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5SelectAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Select
 * @isattribute false
 * @tagName ch5-select
 * @role listbox
 * @description Ch5 Select inherits the default html select, but provides a lot of extra features
 * @componentVersion 1.0.0
 * @childElements
 * [
 *   {
 *     "tagName": "template",
 *     "optional": false,
 *     "childElements": [
 *       {
 *         "tagName": "ch5-select-option",
 *         "optional": true,
 *         "childElements": []
 *       }
 *     ]
 *   }
 * ]
 * @documentation
 * [
 * "`ch5-select` element",
 * "***",
 * "The select component enables the user to select one or more choices from a list of options. ",
 * "The select component will not be a wrapper around the HTML input type select because other options ",
 * "must be covered that are not available on HTML input type select."
 * ]
 * @snippets
 * [
 *         {
 *           "prefix": "ch5-select:blank",
 *           "description": "Crestron Select (Blank)",
 *           "body": [
 *             "<ch5-select>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:all",
 *           "description": "Crestron Select (All Attributes)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\ticonposition=\"${2|first,last|}\"",
 *             "\tmultiselect",
 *             "\tselectedvalue=\"${4}\"",
 *             "\tnoneselectedprompt=\"${5}\"",
 *             "\tpanelscrollheight=\"${6}\"",
 *             "\tminwidth=\"${7}\"",
 *             "\tmaxwidth=\"${8}\"",
 *             "\tminheight=\"${9}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\"",
 *             "\treceivestatesize=\"${15}\"",
 *             "\treceivestatetemplatevars=\"${16}\"",
 *             "\tsendeventonfocus=\"${17}\"",
 *             "\tsendeventonchange=\"${18}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option receivestateselected=\"${19}\"",
 *             "\t\t\treceivestatelabel=\"${20}\"",
 *             "\t\t\treceivestateurl=\"${21}\"",
 *             "\t\t\treceivestatescriptlabelhtml=\"${22}\"",
 *             "\t\t\tsendeventonclick=\"${23}\">",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:single-selection",
 *           "description": "Crestron Select (single selection using receiveStateValue and sendEventOnChange",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tselectedvalue=\"${2}\"",
 *             "\tnoneselectedprompt=\"${3}\"",
 *             "\tpanelscrollheight=\"${4}\"",
 *             "\tminwidth=\"${5}\"",
 *             "\tmaxwidth=\"${6}\"",
 *             "\tminheight=\"${7}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\"",
 *             "\tsendeventonchange=\"${15}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option>",
 *             "\t\t\t<span>Option {{idx}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:single-selection2",
 *           "description": "Crestron Select (single selection using receiveStateValue and ch5-select-option.sendEventOnClick)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tselectedvalue=\"${2}\"",
 *             "\tnoneselectedprompt=\"${3}\"",
 *             "\tpanelscrollheight=\"${4}\"",
 *             "\tminwidth=\"${5}\"",
 *             "\tmaxwidth=\"${6}\"",
 *             "\tminheight=\"${7}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option sendeventonclick=\"${15}\">",
 *             "\t\t\t<span>Option {{idx}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:single-selection3",
 *           "description": "Crestron Select (single selection using ch5-select-option.receiveStateSelected and ch5-select-option.sendEventOnClick)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tselectedvalue=\"${2}\"",
 *             "\tnoneselectedprompt=\"${3}\"",
 *             "\tpanelscrollheight=\"${4}\"",
 *             "\tminwidth=\"${5}\"",
 *             "\tmaxwidth=\"${6}\"",
 *             "\tminheight=\"${7}\"",
 *             "\tmaxheight=\"${8}\"",
 *             "\tresize=\"${9|true,false|}\"",
 *             "\tmode=\"${10|plain,panel|}\"",
 *             "\tfeedbackmode=\"${11|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${12|1500|}\"",
 *             "\tindexid=\"${13|idx|}\"",
 *             "\treceivestatevalue=\"${14}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option sendeventonclick=\"${15}\"",
 *             "\t\t\treceivestateselected=\"${16}\">",
 *             "\t\t\t<span>Option {{idx}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:multiselection",
 *           "description": "Crestron Select (multi selection using ch5-select-option.receiveStateSelected, ch5-select-option.sendEventOnClick and ch5-select-option.receiveStateLabel)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\tnoneselectedprompt=\"${2}\"",
 *             "\tpanelscrollheight=\"${3}\"",
 *             "\tminwidth=\"${4}\"",
 *             "\tmaxwidth=\"${5}\"",
 *             "\tminheight=\"${6}\"",
 *             "\tmaxheight=\"${7}\"",
 *             "\tresize=\"${8|true,false|}\"",
 *             "\tmode=\"${9|plain,panel|}\"",
 *             "\tmultiselect",
 *             "\tfeedbackmode=\"${10|direct,submit|}\"",
 *             "\tindexid=\"${11|idx|}\">",
 *             "\t<template>",
 *             "\t\t<ch5-select-option sendeventonclick=\"${12}\"",
 *             "\t\t\treceivestateselected=\"${13}\"",
 *             "\t\t\treceivestatelabel=\"${14}\">",
 *             "\t\t\t<span>Option {{label}}</span>",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         },
 *         {
 *           "prefix": "ch5-select:default",
 *           "description": "Crestron Select (using default template)",
 *           "body": [
 *             "<ch5-select size=\"${1}\"",
 *             "\ticonposition=\"${2|first,last|}\"",
 *             "\tselectedvalue=\"${3}\"",
 *             "\tnoneselectedprompt=\"${4}\"",
 *             "\tpanelscrollheight=\"${5}\"",
 *             "\tminwidth=\"${6}\"",
 *             "\tmaxwidth=\"${7}\"",
 *             "\tminheight=\"${8}\"",
 *             "\tmaxheight=\"${9}\"",
 *             "\tresize=\"${10|true,false|}\"",
 *             "\tmode=\"${11|plain,panel|}\"",
 *             "\tfeedbackmode=\"${12|direct,submit|}\"",
 *             "\tsignalvaluesynctimeout=\"${13|1500|}\"",
 *             "\tindexid=\"${14|idx|}\">",
 *            "\t<template>",
 *             "\t\t<ch5-select-option receivestateselected=\"${15}\"",
 *             "\t\t\treceivestatelabel=\"${16}\"",
 *             "\t\t\treceivestateurl=\"${17}\"",
 *             "\t\t\treceivestatescriptlabelhtml=\"${18}\"",
 *             "\t\t\tsendeventonclick=\"${19}\">",
 *             "\t\t</ch5-select-option>",
 *             "\t</template>",
 *             "</ch5-select>$0"
 *           ]
 *         }
 * ]
 * 
 */
export interface ICh5SelectDocumentation extends ICh5Common, ICh5SelectAttributes {
}
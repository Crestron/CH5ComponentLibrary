// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5TextInputAttributes } from "./i-ch5-text-input-attributes";
import { ICh5CommonInput } from "../ch5-common-input";
import { ICh5Common } from "../ch5-common";
import { TBoolAttribute } from "../ch5-common/types/t-bool-attribute";

/**
 * @name Ch5 Textinput
 * @isattribute false
 * @tagName ch5-textinput
 * @description Ch5 Textinput inherits the default html input behavior, but also provides extra features.
 * @documentation
 * [
 * "`ch5-textinput` attribute",
 * "***",
 * "The TextEntry component allows the user to enter textual input. This is an extension of the",
 * "input HTML element."
 * ]
 * @snippets
 * [
 *    {
 *       "prefix": "ch5-textinput:blank",
 *       "description": "Crestron Textinput (Blank)",
 *       "body": [
 *           "<ch5-textinput>",
 *           "</ch5-textinput>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-textinput:default",
 *       "description": "Crestron Textinput (Default)",
 *       "body": [
 *           "<ch5-textinput",
 *           "     type=\"${1|text,number,month,week,email|}\">",
 *           "</ch5-textinput>$0"
 *       ]
 *   },
 *    {
 *        "prefix": "ch5-textinput:phone",
 *        "description": "Crestron Textinput phone mask attribute",
 *        "body": [
 *            "<ch5-textinput",
 *            "    label=\"${1:Phone number:}\"",
 *            "    icon=\"${2:fa fa-phone}\"",
 *            "    size=\"${3:x-large}\"",
 *            "    placeholder=\"${4:Phone Number}\"",
 *            "    mask=\"${5:(+99) 999 999 999}\"",
 *            "    id=\"${7:phoneNumber}\">",
 *            "</ch5-textinput>"
 *        ]
 *    },
 *    {
 *        "prefix": "ch5-textinput:signals",
 *        "description": "Crestron Textinput phone mask attribute",
 *        "body": [
 *            "<ch5-textinput",
 *            "    label=\"${1:Phone number:}\"",
 *            "    icon=\"${2:fa fa-phone}\"",
 *            "    size=\"${3:x-large}\"",
 *            "    placeholder=\"${4:Phone Number}\"",
 *            "    mask=\"${5:(+99) 999 999 999}\"",
 *            "    id=\"${7:phoneNumber}\"",
 *            "    sendeventonchange=\"${8:input_changed}\"",
 *            "    sendeventonfocus=\"${9:input_focus}\"",
 *            "    sendeventonblur=\"${10:input_blur}\">",
 *            "</ch5-textinput>"
 *        ]
 *    }
 * ]
 * 
 */
export interface ICh5TextInput extends ICh5TextInputAttributes, ICh5CommonInput, ICh5Common {

  /**
   * @documentation 
   * [
   *  "`onvaliditychange` attribute",
   *  "***",
   * "Run when validity state of a input has been change"
   * ]
   * @name onvaliditychange
   */
  onvaliditychange: string;

  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "The value attribute specifies the value of an input element."
   * ]
   * @name value
   */
  value: string;

  /**
   * @documentation
   * [
   * "`scaling` attribute",
   * "***",
   * "Scale the input font size when reaches the edge"
   * ]
   * @name scaling
   */
  scaling: TBoolAttribute;

  /**
   * @documentation
   * [
   * "`minimumfontsize` attribute",
   * "***",
   * "The minimum font size is applied when the input text exceeds the width of the input text box. ", 
   * "This will work only if scaling attribute is set."
   * ]
   * @name minimumfontsize
   */
  minimumfontsize: number;

  /**
   * @documentation
   * [
   * "`tabIndex` attribute",
   * "***",
   * "The tabindex global attribute indicates that its element",
   * "can be focused, and where it participates in sequential",
   * "keyboard navigation"
   * ]
   * @name tabindex
   */
  tabIndex: number;
}
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonInput } from "../../ch5-common-input/interfaces/i-ch5-common-input";
import { ICh5Common } from "../../ch5-common/interfaces";
import { ICh5TextInputAttributes } from "./i-ch5-text-input-attributes";

/**
 * @ignore
 */
export interface ICh5TextInput extends ICh5TextInputAttributes, ICh5CommonInput, ICh5Common {

  /**
   * @documentation 
   * [
   *  "`onvaliditychange` attribute",
   *  "***",
   * "Runs when the validity state of a input has been changed."
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
   * "`minimumfontsize` attribute",
   * "***",
   * "The minimum font size is applied when the input text exceeds the width of the input text box. ", 
   * "This will work only if a scaling attribute is set."
   * ]
   * @name minimumfontsize
   * @default 12
   */
  minimumfontsize: number;

  /**
   * @documentation
   * [
   * "`tabIndex` attribute",
   * "***",
   * "The tabIndex global attribute indicates that its element ",
   * "can be focused and indicates where it places in sequential ",
   * "keyboard navigation."
   * ]
   * @name tabindex
   * @default 0
   */
  tabIndex: number;
}
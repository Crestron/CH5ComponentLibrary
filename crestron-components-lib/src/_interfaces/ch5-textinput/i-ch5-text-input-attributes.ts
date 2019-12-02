// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonInputAttributes } from "../ch5-common-input";
import { TCh5TextInputStretch, TCh5TextInputSize, TCh5TextInputType, 
  TCh5TextInputTextTransform, TCh5TextInputIconPosition } from "./types";

/**
 * @ignore
 */
export interface ICh5TextInputAttributes extends ICh5CommonInputAttributes {

  /**
   * @documentation 
   * [
   *  "`mask` attribute",
   *  "***",
   * "Background pattern that will be present when the input is focus.", 
   * "We will allow the following combination of prebuild definitions:",
   * "a - alpha caracter",
   * "9- numeric character",
   * "*- alpha numeric character"
   * ]
   * @name mask
   */
  mask: string;

  /**
   * @documentation
   * [
   * "`icon` attribute",
   * "***",
   * "Icon to be show"
   * ]
   * @name icon
   */
  icon: string;
  
  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "Provides the label for the input"
   * ]
   * @name label
   */
  label: string;

  /**
   * @documentation
   * [
   * "`placeholder` attribute",
   * "***",
   * "Provides the placeholder for the input, it has the default behavior as for input html element"
   * ]
   * @name placeholder
   */
  placeholder: string;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "Valid values are 'first' and 'last'. Default is 'first'",
   * "If direction attribute is 'ltr', as will be typical in locales with left to right language",
   * "direction, 'first' is equivalent to icon being on the left and text on the",
   * "right",
   * " Conversely, if the direction attribute is 'rtl', the 'first' would have the icon on the ",
   * "right and the label to its left. Value of 'last' is",
   * "the opposite of 'first'."
   * ]
   * @name iconposition
   */
  iconPosition: TCh5TextInputIconPosition;

  /**
   * @documentation
   * [
   * "`type` attribute",
   * "***",
   * "Type of the input."
   * ]
   * @name type
   */
  inputType: TCh5TextInputType;

  /**
   * @documentation
   * [
   * "`minlength` attribute",
   * "***",
   * "Applicable only in feedbackmode='submit'."
   * ]
   * @name minlength
   */
  minLength: number;

  /**
   * @documentation
   * [
   * "`maxlength` attribute",
   * "***",
   * "Applicable only in feedbackmode='submit'."
   * ]
   * @name maxlength
   */
  maxLength: number;

  /**
   * @documentation
   * [
   * "`minvalue` attribute",
   * "***",
   * "Applicable only for type=numeric and feedbackmode='submit', field",
   * "will be in error if the value supplied by user is less than value of the attribute. "
   * ]
   * @name minvalue
   */
  minValue: number;

  /**
   * @documentation
   * [
   * "`maxvalue` attribute",
   * "***",
   * "Applicable only for type=numeric and feedbackmode='submit', field",
   * "will be in error if the value supplied by user is greater than value of",
   * "the attribute. "
   * ]
   * @name maxvalue
   */
  maxValue: number;

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Sets the relative size of this Component"
   * ]
   * @name size
   */
  size: TCh5TextInputSize;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "Default 'fixed'. Valid values 'fixed', 'width', and 'content'.",
   * "Sets the width of the input",
   * "***",
   * "Fixed - fixed position ( from CSS classes )",
   * "Width - Width of the parent content",
   * "Content - Width will be equal to the content width."
   * ]
   * @name stretch
   */
  stretch: TCh5TextInputStretch;

  /**
   * @documentation
   * [
   * "`text-transform` attribute",
   * "***",
   * "Only for type=text, default value 'none'. Valid values",
   * "'capitalize' – make all first characters of each word uppercase",
   * "'uppercase' – make all characters uppercase",
   * "'lowercase' – make all characters lowercase",
   * "'none' – don't change input"
   * ]
   * @name text-transform
   */
  textTransform: TCh5TextInputTextTransform;

  /**
   * @documentation
   * [
   * "`receivestatefocus` attribute",
   * "***",
   * "When focused, true, when unfocuses, send false"
   * ]
   * @name receivestatefocus
   */
  receiveStateFocus: string;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "When receive change the value of the text input field"
   * ]
   * @name receivestatevalue
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`sendeventonchange` attribute",
   * "***",
   * "Send event on value change"
   * ]
   * @name sendeventonchange
   */
  sendEventOnChange: string;

  /**
   * @documentation
   * [
   * "`sendeventonfocus` attribute",
   * "***",
   * "Send event on focus"
   * ]
   * @name sendeventonfocus
   */
  sendEventOnFocus: string;
  
  /**
   * @documentation
   * [
   * "`sendeventonblur` attribute",
   * "***",
   * "Send event on blur"
   * ]
   * @name sendeventonblur
   */
  sendEventOnBlur: string;
}

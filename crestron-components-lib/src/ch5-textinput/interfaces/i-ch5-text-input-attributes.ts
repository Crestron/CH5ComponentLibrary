// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonInputAttributes } from "../../ch5-common-input/interfaces/i-ch5-common-input-attributes";
import { TCh5TextInputStretch, 
          TCh5TextInputSize, 
          TCh5TextInputType, 
          TCh5TextInputTextTransform, 
          TCh5TextInputIconPosition 
} from "./index";

/**
 * @ignore
 */
export interface ICh5TextInputAttributes extends ICh5CommonInputAttributes {

  /**
   * @documentation 
   * [
   *  "`mask` attribute",
   *  "***",
   * "The background pattern that will be present when the input is focused. ", 
   * "The following combination of prebuilt definitions are permitted: ",
   * "a - alpha caracter ",
   * "9 - numeric character ",
   * "* - alphanumeric character"
   * ]
   * @name mask
   */
  mask: string;

  /**
   * @documentation
   * [
   * "`icon` attribute",
   * "***",
   * "The icon to be shown."
   * ]
   * @name icon
   */
  icon: string;
  
  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "Provides the label for the input."
   * ]
   * @name label
   */
  label: string;

  /**
   * @documentation
   * [
   * "`placeholder` attribute",
   * "***",
   * "Provides the placeholder for the input. This shares the default behavior of the input HMTL element."
   * ]
   * @name placeholder
   */
  placeholder: string;

  /**
   * @documentation
   * [
   * "`iconposition` attribute",
   * "***",
   * "Valid values: 'first' and 'last'. The default value is 'first'. ",
   * "If the direction attribute is 'ltr', as will be typical in locales with a left-to-right language ",
   * "direction, 'first' is equivalent to the icon being placed on the left and the text on the ",
   * "right. ",
   * "Conversely, if the direction attribute is 'rtl', first' would place the icon on the ",
   * "right and the label to its left. The Value of 'last' is ",
   * "the opposite of 'first'."
   * ]
   * @name iconposition
   * @default first
   */
  iconPosition: TCh5TextInputIconPosition;

  /**
   * @documentation
   * [
   * "`type` attribute",
   * "***",
   * "The type of the input."
   * ]
   * @name type
   */
  inputType: TCh5TextInputType;

  /**
   * @documentation
   * [
   * "`minlength` attribute",
   * "***",
   * "Applicable only in feedbackmode='submit'. The minimum length of the attribute."
   * ]
   * @name minlength
   */
  minLength: number;

  /**
   * @documentation
   * [
   * "`maxlength` attribute",
   * "***",
   * "Applicable only in feedbackmode='submit'. The maximum length of the attribute"
   * ]
   * @name maxlength
   */
  maxLength: number;

  /**
   * @documentation
   * [
   * "`minvalue` attribute",
   * "***",
   * "Applicable only for type=numeric and feedbackmode='submit'. ",
   * "The field will result in an error if the value supplied by user is less than value of the attribute."
   * ]
   * @name minvalue
   */
  minValue: number;

  /**
   * @documentation
   * [
   * "`maxvalue` attribute",
   * "***",
   * "Applicable only for type=numeric and feedbackmode='submit'. ",
   * "The field will result in an error if the value supplied by user is greater than value of ",
   * "the attribute."
   * ]
   * @name maxvalue
   */
  maxValue: number;

  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "Sets the relative size of this component."
   * ]
   * @name size
   */
  size: TCh5TextInputSize;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "The default value is 'fixed'. Valid values: 'fixed', 'width', and 'content'.",
   * "Sets the width of the input.",
   * "***",
   * "Fixed - fixed position (from CSS classes) ",
   * "Width - Width of the parent content ",
   * "Content - Width will be equal to the content width"
   * ]
   * @name stretch
   * @default fixed
   */
  stretch: TCh5TextInputStretch;

  /**
   * @documentation
   * [
   * "`text-transform` attribute",
   * "***",
   * "Only used for type=text. The default value is 'none'. ",
   * "Valid values: ",
   * "'capitalize' – Makes all first characters of each word uppercase ",
   * "'uppercase' – Makes all characters uppercase ",
   * "'lowercase' – Makes all characters lowercase ",
   * "'none' – Does not change the input"
   * ]
   * @name text-transform
   */
  textTransform: TCh5TextInputTextTransform;

  /**
   * @documentation
   * [
   * "`scaling` attribute",
   * "***",
   * "Scales the input font size when it reaches the edge."
   * ]
   * @name scaling
   */
  scaling: boolean;

  /**
   * @documentation
   * [
   * "`receivestatefocus` attribute",
   * "***",
   * "When focused, send true. When unfocusesd, send false."
   * ]
   * @name receivestatefocus
   */
  receiveStateFocus: string;

  /**
   * @documentation
   * [
   * "`receivestatevalue` attribute",
   * "***",
   * "When recevied, changes the value of the text input field."
   * ]
   * @name receivestatevalue
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`sendeventonchange` attribute",
   * "***",
   * "Sends an event on value change."
   * ]
   * @name sendeventonchange
   */
  sendEventOnChange: string;

  /**
   * @documentation
   * [
   * "`sendeventonfocus` attribute",
   * "***",
   * "Sends an event on focus."
   * ]
   * @name sendeventonfocus
   */
  sendEventOnFocus: string;
  
  /**
   * @documentation
   * [
   * "`sendeventonblur` attribute",
   * "***",
   * "Sends an event on blur."
   * ]
   * @name sendeventonblur
   */
  sendEventOnBlur: string;
}

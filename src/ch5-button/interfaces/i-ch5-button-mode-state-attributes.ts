// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonModeCommonAttributes } from "./i-ch5-button-mode-common";
import { TCh5ButtonModeState } from "./t-ch5-button";

/**
 * @name Ch5 Button Mode State
 * @isattribute false
 * @tagName ch5-button-mode-state
 * @role button
 * @description Ch5 Button Mode State is a child node for <ch5-button-mode>.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *   "`ch5-button-mode-state` element",
 *   "***",
 *   "A child element designed to capture mode level attributes for Ch5 Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-mode-state:blank",
 *     "description": "Crestron Button Mode State",
 *     "body": [
 *       "<ch5-button-mode-state>",
 *       "\t<template>",
 *       "\t$1",
 *       "\t</template>",
 *       "</ch5-button-mode-state>$0"
 *     ]
 *   }
 * ]
 *
 */export interface ICh5ButtonModeStateAttributes extends ICh5ButtonModeCommonAttributes {

  /**
  * @documentation
  * [
  * "`vAlignLabel` attribute",
  * "***",
  * "Valid values: 'width', 'height', 'both'.",
  * "When the stretch property is set, the button element inherits the ",
  * "width and/or height of the container. If stretch=height is used, ",
  * "the button will be responsive based on the label length until it ",
  * "reaches the max-width of the container. If stretch=width is ",
  * "applied, there is no responsiveness after reaching the max-width, and ",
  * "the text will overflow. The same applies if stretch=both is used. Note ",
  * "that if the button element shape is 'circle' or 'oval', the stretch ",
  * "property will be ignored."
  * ]
  * @name vAlignLabel
  */
  state: TCh5ButtonModeState;

}

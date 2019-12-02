// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common, ICh5CommonAttributes } from "../ch5-common";

/**
 * @ignore
 */
export interface ICh5ImageAttributes extends ICh5CommonAttributes {
  /**
   * @documentation
   * [
   * "`alt` attribute",
   * "***",
   * "Defines an alternative text description of the image"
   * ]
   * @name alt
   */
  alt: string;

  /**
   * @documentation
   * [
   * "`height` attribute",
   * "The intrinsic height of the image, in pixels. Must be a string of the form Npx or N%"
   * ]
   * @name height
   */
  height: string;

  /**
   * @documentation
   * [
   * "`width` attribute",
   * "The intrinsic width of the image, in pixels. Must be a string of the form Npx or N%"
   * ]
   * @name width
   */
  width: string;

  /**
   * @documentation
   * [
   *  "`refreshrate` attribute",
   * "***",
   * "Number of seconds between each refresh of the URL. If 0, the URL will not",
   * "be refresh."
   * ]
   * @name refreshrate
   */
  refreshRate: number | string;

  /**
   * @documentation
   * [
   * "`url` attribute",
   * "***",
   * "Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP"
   * ]
   * @name url
   */
  url: string;


  /**
   * @documentation
   * [
   * "`password` attribute",
   * "***",
   * "Password for authentication in order to get the image"
   * ]
   * @name password
   */
  password: string;

  /**
   * @documentation
   * [
   * "`dir` attribute",
   * "***",
   * "Image direction"
   * ]
   * @name dir
   */
  dir: string;

  /**
   * @documentation
   * [
   * "`user` attribute",
   * "***",
   * "User for authentication in order to get the image"
   * ]
   * @name user
   */
  user: string;

  /**
   * @documentation
   * [
   * "`receivestateurl` attribute",
   * "***",
   * "Image URL passed via state"
   * ]
   * @name receivestateurl
   */
  receiveStateUrl: string;

  /**
   * @documentation
   * [
   * "`sendeventontouch` attribute",
   * "***",
   * "Sends boolean true event when finger on glass and boolean false event when finger released",
   * "Use this when control system takes action on level sensitive boolean digital event",
   * "Examples include SIMPL Logic Symbol for Analog Ramp with description of",
   * "Digital input <up> 'High/1 (level sensitive) = Ramp up; Low/0 = Stop ramp'"
   * ]
   * @name sendeventontouch
   */
  sendEventOnTouch: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends event on click or tap event (mouse or finger up and down in a small period of time).",
   * "Use this when control system takes action on rising edge from false to true of boolean digital event.",
   * "Examples include SIMPL Logic Symbol for Toggle with description of",
   * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'"
   * ]   
   * @name sendeventonclick
   */
  sendEventOnClick: string;

  /**
   * @documentation
   * [
   * "`sendeventonerror` attribute",
   * "***",
   * "Sends event on error"
   * ]
   * @name sendeventonerror
   */
  sendEventOnError: string;
}
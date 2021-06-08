// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../../ch5-common/interfaces/";

/**
 * @name Ch5 Image
 * @isattribute false
 * @tagName ch5-image
 * @role img
 * @description Ch5 Image offers a wide range of functionality out-of-the-box.
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-image` element",
 * "***",
 * "A component to load images. Even with this component, the user can use the standard HTML ",
 * "<img> tag. This component allows for images to be loaded mainly from a security camera on a polled basis. ",
 * "The implementation of the Image Component in used to coordinate requests of images to be shared ",
 * "between different image components and video components that may be requesting the same image URL."
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-image:blank",
 *      "description": "Crestron Image (Blank)",
 *      "body": [
 *        "<ch5-image>",
 *         "</ch5-image>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-image:default",
 *      "description": "Crestron Image (Default)",
 *      "body": [
 *        "<ch5-image alt=\"${1:Outside driveway image}\"",
 *        "\theight=\"${2:900px}\"",
 *        "\twidth=\"${3:1600px}\"",
 *        "\trefreshrate=\"${4:2}\"",
 *        "\turl=\"${5:http://someServer/image.png}\">",
 *         "</ch5-image>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-image:receive-signal",
 *      "description": "Crestron Image (Receive Signal)",
 *      "body": [
 *        "<ch5-image alt=\"${1:Backyard image}\"",
 *        "\theight=\"${2:450px}\"",
 *        "\twidth=\"${3:800px}\"",
 *        "\trefreshrate=\"${4:1}\"",
 *        "\treceivestateurl=\"${5:url_for_image_signal}\">",
 *         "</ch5-image>$0"
 *        ] 
 *    }
 * ]
 * 
 */

export interface ICh5ImageAttributes extends ICh5Common {
  /**
   * @documentation
   * [
   * "`alt` attribute",
   * "***",
   * "Defines an alternative text description for the image."
   * ]
   * @name alt
   */
  alt: string;

  /**
   * @documentation
   * [
   * "`height` attribute",
   * "***",
   * "The intrinsic height of the image, in pixels. Must be a string of the form Npx or N%."
   * ]
   * @name height
   */
  height: string;

  /**
   * @documentation
   * [
   * "`width` attribute",
   * "***",
   * "The intrinsic width of the image, in pixels. Must be a string of the form Npx or N%."
   * ]
   * @name width
   */
  width: string;

  /**
   * @documentation
   * [
   *  "`refreshrate` attribute",
   * "***",
   * "The default value is '0'. ",
   * "The number of seconds between each URL refresh. If 0, the URL will not",
   * "be refreshed."
   * ]
   * @name refreshrate
   * @default 0
   */
  refreshRate: number;

  /**
   * @documentation
   * [
   * "`url` attribute",
   * "***",
   * "Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP."
   * ]
   * @name url
   */
  url: string;


  /**
   * @documentation
   * [
   * "`password` attribute",
   * "***",
   * "The authentication password required to get the image."
   * ]
   * @name password
   */
  password: string;

  /**
   * @documentation
   * [
   * "`dir` attribute",
   * "***",
   * "The image direction."
   * ]
   * @name dir
   */
  dir: string;

  /**
   * @documentation
   * [
   * "`user` attribute",
   * "***",
   * "The authentication username required to get the image."
   * ]
   * @name user
   */
  user: string;

  /**
   * @documentation
   * [
   * "`receivestateurl` attribute",
   * "***",
   * "The image URL passed via state."
   * ]
   * @name receivestateurl
   */
  receiveStateUrl: string;

  /**
   * @documentation
   * [
   * "`sendeventontouch` attribute",
   * "***",
   * "Sends a boolean true event when the screen is tapped and boolean false event when released. ",
   * "Use this when the control system takes an action on a level-sensitive boolean digital event. ",
   * "Examples include the SIMPL Logic Symbol for Analog Ramp with a description of ",
   * "Digital input <up> 'High/1 (level sensitive) = Ramp up; Low/0 = Stop ramp'."
   * ]
   * @name sendeventontouch
   */
  sendEventOnTouch: string;

  /**
   * @documentation
   * [
   * "`sendeventonclick` attribute",
   * "***",
   * "Sends an on click or tap event (mouse or swipe up and down quickly). ",
   * "Use this when the control system takes an action on the rising edge from false to true of a boolean digital event. ",
   * "Examples include the SIMPL Logic Symbol for Toggle with a description of ",
   * "Digital input <clock> 'High/1 (rising edge) = Toggle; Low/0 = No effect'."
   * ]   
   * @name sendeventonclick
   */
  sendEventOnClick: string;

  /**
   * @documentation
   * [
   * "`sendeventonerror` attribute",
   * "***",
   * "Sends an event on error."
   * ]
   * @name sendeventonerror
   */
  sendEventOnError: string;
}
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../ch5-common";
import { ICh5ImageAttributes } from "./i-ch5-image-attributes";

/**
 * @name Ch5 Image
 * @isattribute false
 * @tagName ch5-image
 * @description Ch5 Image offers a wide range of functionality out-of-the-box.
 * @documentation
 * [
 * "`ch5-image` element",
 * "***",
 * "A component to load images. Even with this component, the user can still use the standard HTML ",
 * "<img> tag. This component allows primarily for images to be loaded from a security camera on a polled basis.",
 * "The implementation of the Image component is used to coordinate a request of shared images",
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
export interface ICh5Image extends ICh5Common, ICh5ImageAttributes {
  /**
   * @documentation
   * [
   * "`onpress` attribute",
   * "***",
   * "Run when a press event is initiated."
   * ]
   * @name onpress
   */
  onpress: string;

  /**
   * @documentation
   * [
   * "`onrelease` attribute",
   * "***",
   * "Run when a release event is initiated."
   * ]
   * @name onrelease
   */
  onrelease: string;
}

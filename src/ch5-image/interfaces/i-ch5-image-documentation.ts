// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ImageAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

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
 *    },
 *    {
 *      "prefix": "ch5-image:support-touch-position-output",
 *      "description": "Crestron Image (Send touch position output)",
 *      "body": [
 *        "<ch5-image alt=\"${1:Backyard image}\"",
 *        "\theight=\"${2:450px}\"",
 *        "\twidth=\"${3:800px}\"",
 *        "\tallowValuesOnMove=\"${4:false}\"",
 *        "\tallowPositionDataToBeSent=\"${5:false}\"",
 *        "\treceiveStateAllowValuesOnMove=\"${6:}\"",
 *        "\treceiveStateAllowPositionDataToBeSent=\"${7:}\"",
 *        "\tsendEventXPosition=\"${8:}\"",
 *        "\tsendEventYPosition=\"${9:}\"",
 *        "\turl=\"${10:http://someServer/image.png}\">",
 *        "</ch5-image>$0"
 *        ] 
 *    }
 * ]
 * 
 */
export interface ICh5ImageDocumentation extends ICh5Common, ICh5ImageAttributes {
}
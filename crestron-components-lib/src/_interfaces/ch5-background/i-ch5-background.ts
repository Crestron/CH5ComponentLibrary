// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../ch5-common";
import { ICh5BackgroundAttributes } from './i-ch5-background-attributes';

/**
 * @name Ch5 Background
 * @isattribute false
 * @tagName ch5-background
 * @description Ch5 Background offers a wide range of functionality out-of-the-box.
 * @documentation
 * [
 * "`ch5-background` element",
 * "***",
 * "For backgrounds, standard HTML has a many available styles to provide backgrounds for HTML elements.",
 * "CH5 Video will be implemented using Alpha Blending, where portions of the HTML will become invisible to allow video ",
 * "playing below the HTML layer to be visible to the user. As such, to support background images and",
 * "colors of HTML element views that will be in CH5 projects, the ch5-background component provides much of the same",
 * "functionality, but works with the video component to make portions of the screen invisible to allow the video to appear."
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-background:blank",
 *      "description": "Crestron Background (Blank)",
 *      "body": [
 *        "<ch5-background>",
 *         "</ch5-background>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-background:default",
 *      "description": "Crestron Background (Default)",
 *      "body": [
 *        "<ch5-background url=\"${5:http://someServer/background.png}\">",
 *         "</ch5-background>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-background:all-attributes",
 *      "description": "Crestron Background (All Attributes)",
 *      "body": [
 *        "<ch5-background url=\"${5:http://someServer/background.png}\">",
 *         "\trefreshrate=\"${2:10}\"",
 *         "\tbackgroundcolor=\"${3:black}\"",
 *         "\trepeat=\"${4|no-repeat,repeat,repeat-x,repeat-y|}\"",
 *         "\tscale=\"${5|stretch,fill,fit|}\"",
 *         "\timgbackgroundcolor=\"${6:black}\"",
 *         "\ttransitioneffect=\"${7:ease}\"",
 *         "\transitionduration=\"${8:1s}\"",
 *         "\treceivestateurl=\"${9}\"",
 *         "\treceivestatebackgroundcolor=\"${10}\"",
 *         "\treceivestaterefreshrate=\"${11}\"",
 *         "</ch5-background>$0"
 *        ]
 *    }
 * ]
 * 
 */
export interface ICh5Background extends ICh5Common, ICh5BackgroundAttributes {
  
}

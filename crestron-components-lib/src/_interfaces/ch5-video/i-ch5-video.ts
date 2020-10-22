// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../ch5-common";
import { ICh5VideoAttributes } from "./i-ch5-video-attributes";

/**
 * @name Ch5 Video
 * @isattribute false
 * @tagName ch5-video
 * @description Ch5 Video offers a wide range of functionality out-of-the-box.
 * @documentation
 * [
 * "`ch5-video` element",
 * "***",
 * "Provides an overlay onto a streaming video window. ",
 * "Components that should reside above the video that need to be visible and active ",
 * "(such as buttons to control playback, text describing the video, ",
 * "and annotation controls) need to be defined as children elements to this component.",
 * 
 * "As a background, the <video> tag provided in modern HTML5 browsers will stream HTTP-based protocols ",
 * "such as HLS (HTTP Live Streaming) and DASH (dynamic adaptive Streaming over HTTP). ",
 * "These protocols are not employed on the vast majority of security cameras and the design of these protocols ",
 * "specify a great deal of buffering (i.e. time delay) that would not be appropriate for use cases associated with a security camera. ",
 * 
 * "The implementation of the <ch5-video> component will not attempt to render the streaming video within the HTML rendering engine. ",
 * "A three tier approach will be employed.  In the top tier, ",
 * "the HTML component will be responsible for creating invisible rectangles to expose content beneath the HTML rendering engine. ",
 * "The second tier will provide a surface (handle to raw buffer to display graphics) that will render the streaming video. ",
 * "The top tier and the second tier will coordinate the location and size of rendered video stream. ",
 * "The bottom tier is responsible for decoding the video stream and interfacing with the second tier to display the decoded video stream. ",
 * "The documentation below describes the configuration of the top tier HTML component <ch5-video>."
 * 
 * ]
 * @snippets
 * [
 *    {
 *      "prefix": "ch5-video:default",
 *      "description": "Provides a view onto a streaming video window. Components that are to reside above the video that need to be visible and active, examples include buttons to control playback, text describing the video, and annotation controls, need to be defined as children elements to this component.",
 *      "body": [
 *        "<ch5-video indexid=\"${1}\" aspectratio=\"${2:16:9}\" controls=\"${3:false}\" size=\"${4:large}\" sourcetype=\"${5:Network}\" userid=\"${6}\" snapshotuserid=\"${7}\" password=\"${8}\" snapshotpassword=\"${9}\" snapshoturl=\"${10}\" url=\"${11}\" stretch=\"${12:false}\" zindex=\"${13:0}\" snapshotrefreshrate=\"${14:0}\">",
 *         "</ch5-video>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-video:all-attributes",
 *      "description": "Provides a view onto a streaming video window. Components that are to reside above the video that need to be visible and active, examples include buttons to control playback, text describing the video, and annotation controls, need to be defined as children elements to this component.",
 *      "body": [
 *        "<ch5-video indexid=\"${1}\" aspectratio=\"${2:16:9}\" controls=\"${3:false}\" size=\"${4:large}\" sourcetype=\"${5:Network}\" userid=\"${6}\" snapshotuserid=\"${7}\" password=\"${8}\" snapshotpassword=\"${9}\" snapshoturl=\"${10}\" url=\"${11}\" stretch=\"${12:false}\" zindex=\"${13:0}\" snapshotrefreshrate=\"${14:0}\" receivestatesourcetype=\"${15}\" receivestateuserid=\"${16}\" receivestatepassword=\"${17}\" receivestatesnapshoturl=\"${18}\" receivestatesnapshotrefreshrate=\"${19}\" receivestatesnapshotuserid=\"${20}\" receivestatesnapshotpassword=\"${21}\" receivestateplay=\"${22}\" receivestateselect=\"${23}\" receivestateurl=\"${24}\" receivestatevideocount=\"${25}\" sendeventonclick=\"${26}\" sendeventstate=\"${27}\" sendeventselectionurl=\"${28}\" sendeventerrorcode=\"${29}\" sendeventerrormessage=\"${30}\" sendeventsnapshoturl=\"${31}\" sendeventselectionsourcetype=\"${32}\" sendeventselectionchange=\"${33}\" sendeventretrycount=\"${34}\" sendeventsnapshotlastupdatetime=\"${35}\" sendeventresolution=\"${36}\" sendeventsnapshotstatus=\"${37}\">",
 *         "</ch5-video>$0"
 *        ] 
 *    }
 * ]
 *
 */
export interface ICh5Video extends ICh5VideoAttributes, ICh5Common {

  /**
   * @documentation
   * [
   * "`onpress` attribute",
   * "***",
   * "Runs when a press event is initiated."
   * ]
   * @name onpress
   */
  onpress: string;

  /**
   * @documentation
   * [
   * "`onrelease` attribute",
   * "***",
   * "Runs when a release event is initiated."
   * ]
   * @name onrelease
   */
  onrelease: string;

}

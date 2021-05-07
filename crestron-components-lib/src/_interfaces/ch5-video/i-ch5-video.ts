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
 *        "<ch5-video aspectratio=\"${1:16:9}\" size=\"${2:large}\" sourcetype=\"${3:Network}\" userid=\"${4}\" snapshotuserid=\"${5}\" password=\"${6}\" snapshotpassword=\"${7}\" snapshoturl=\"${8}\" url=\"${9}\" stretch=\"${10:false}\" zindex=\"${11:0}\" snapshotrefreshrate=\"${12:0}\">",
 *         "</ch5-video>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-video:all-attributes",
 *      "description": "Provides a view onto a streaming video window. Components that are to reside above the video that need to be visible and active, examples include buttons to control playback, text describing the video, and annotation controls, need to be defined as children elements to this component.",
 *      "body": [
 *        "<ch5-video indexid=\"${1}\" aspectratio=\"${2:16:9}\" size=\"${3:large}\" sourcetype=\"${4:Network}\" userid=\"${5}\" snapshotuserid=\"${6}\" password=\"${7}\" snapshotpassword=\"${8}\" snapshoturl=\"${9}\" url=\"${10}\" stretch=\"${11:false}\" zindex=\"${12:0}\" snapshotrefreshrate=\"${13:0}\" receivestatesourcetype=\"${14}\" receivestateuserid=\"${15}\" receivestatepassword=\"${16}\" receivestatesnapshoturl=\"${17}\" receivestatesnapshotrefreshrate=\"${18}\" receivestatesnapshotuserid=\"${19}\" receivestatesnapshotpassword=\"${20}\" receivestateplay=\"${21}\" receivestateselect=\"${22}\" receivestateurl=\"${23}\" receivestatevideocount=\"${24}\" sendeventonclick=\"${25}\" sendeventstate=\"${26}\" sendeventselectionurl=\"${27}\" sendeventerrorcode=\"${28}\" sendeventerrormessage=\"${29}\" sendeventsnapshoturl=\"${30}\" sendeventselectionsourcetype=\"${31}\" sendeventselectionchange=\"${32}\" sendeventretrycount=\"${33}\" sendeventsnapshotlastupdatetime=\"${34}\" sendeventresolution=\"${35}\" sendeventsnapshotstatus=\"${36}\">",
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

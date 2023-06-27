// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces/i-ch5-common-attributes";
import { ICh5VideoAttributes } from "./i-ch5-video-attributes";

/**
 * @name Ch5 Video
 * @isattribute false
 * @tagName ch5-video
 * @role video
 * @description Ch5 Video offers a wide range of functionality out-of-the-box.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-video` element",
 *   "***",
 *   "Provides an overlay onto a streaming video window. ",
 *   "Components that should reside above the video that need to be visible and active ",
 *   "(such as buttons to control playback, text describing the video, ",
 *   "and annotation controls) need to be defined as children elements to this component.",
 * 
 *   "As a background, the <video> tag provided in modern HTML5 browsers will stream HTTP-based protocols ",
 *   "such as HLS (HTTP Live Streaming) and DASH (dynamic adaptive Streaming over HTTP). ",
 *   "These protocols are not employed on the vast majority of security cameras and the design of these protocols ",
 *   "specify a great deal of buffering (i.e. time delay) that would not be appropriate for use cases associated with a security camera. ",
 *   
 *   "The implementation of the <ch5-video> component will not attempt to render the streaming video within the HTML rendering engine. ",
 *   "A three tier approach will be employed.  In the top tier, ",
 *   "the HTML component will be responsible for creating invisible rectangles to expose content beneath the HTML rendering engine. ",
 *   "The second tier will provide a surface (handle to raw buffer to display graphics) that will render the streaming video. ",
 *   "The top tier and the second tier will coordinate the location and size of rendered video stream. ",
 *   "The bottom tier is responsible for decoding the video stream and interfacing with the second tier to display the decoded video stream. ",
 *   "The documentation below describes the configuration of the top tier HTML component <ch5-video>."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-video:blank",
 *     "description": "Crestron video",
 *     "body": [
 *       "<ch5-video>",
 *       "</ch5-video>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-video:all-attributes",
 *     "description": "Crestron video (All Attributes)",
 *     "body": [
 *       "<ch5-video id=\"ch5-video_${1:id}\"",
 *       "\tindexId=\"${2:}\"",
 *       "\taspectRatio=\"${3:16:9}\"",
 *       "\tstretch=\"${4:false}\"",
 *       "\turl=\"${5:}\"",
 *       "\tsourceType=\"${6:Network}\"",
 *       "\tuserId=\"${7:}\"",
 *       "\tpassword=\"${8:}\"",
 *       "\tsnapshotURL=\"${9:}\"",
 *       "\tsnapshotRefreshRate=\"${10:5}\"",
 *       "\tsnapshotUserId=\"${11:}\"",
 *       "\tsnapshotPassword=\"${12:}\"",
 *       "\tsize=\"${13:regular}\"",
 *       "\treceiveStatePlay=\"${14:}\"",
 *       "\treceiveStateSelect=\"${15:}\"",
 *       "\treceiveStateURL=\"${16:}\"",
 *       "\treceiveStateSourceType=\"${17:}\"",
 *       "\treceiveStateUserId=\"${18:}\"",
 *       "\treceiveStatePassword=\"${19:}\"",
 *       "\treceiveStateSnapshotURL=\"${20:}\"",
 *       "\treceiveStateSnapshotRefreshRate=\"${21:}\"",
 *       "\treceiveStateSnapshotUserId=\"${22:}\"",
 *       "\treceiveStateSnapshotPassword=\"${23:}\"",
 *       "\treceiveStateVideoCount=\"${24:}\"",
 *       "\tsendEventOnClick=\"${25:}\"",
 *       "\tsendEventSelectionChange=\"${26:}\"",
 *       "\tsendEventSelectionSourceType=\"${27:}\"",
 *       "\tsendEventSelectionURL=\"${28:}\"",
 *       "\tsendEventSnapshotURL=\"${29:}\"",
 *       "\tsendEventState=\"${30:}\"",
 *       "\tsendEventErrorCode=\"${31:}\"",
 *       "\tsendEventErrorMessage=\"${32:}\"",
 *       "\tsendEventRetryCount=\"${33:}\"",
 *       "\tsendEventResolution=\"${34:}\"",
 *       "\tsendEventSnapshotStatus=\"${35:}\"",
 *       "\tsendEventSnapshotLastUpdateTime=\"${36:}\">",
 *       "</ch5-video>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-video:default",
 *      "description": "Crestron video (Default)",
 *       "body": [
 *          "<ch5-video id=\"ch5-video_${1:id}\"",
 *          "\tindexId=\"${2:}\"",
 *          "\taspectRatio=\"${3:16:9}\"",
 *          "\tstretch=\"${4:false}\"",
 *          "\turl=\"${5:}\"",
 *          "\tsourceType=\"${6:Network}\"",
 *          "\tuserId=\"${7:}\"",
 *          "\tpassword=\"${8:}\"",
 *          "\tsnapshotURL=\"${9:}\"",
 *          "\tsnapshotRefreshRate=\"${10:5}\"",
 *          "\tsnapshotUserId=\"${11:}\"",
 *          "\tsnapshotPassword=\"${12:}\"",
 *          "\tsize=\"${13:regular}\">",
 *          "</ch5-video>$0"
 *        ]
 *    }
 *  ]
 */
export interface ICh5VideoDocumentation extends ICh5CommonAttributes, ICh5VideoAttributes {

}
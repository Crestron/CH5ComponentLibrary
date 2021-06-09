// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from '../../ch5-common/interfaces';
import { TCH5VideoStretch, TCH5VideoAspectRatio, TCH5VideoSize, TCH5VideoSourceType } from './types';

/**
 * @name Ch5 Video
 * @isattribute false
 * @tagName ch5-video
 * @role video
 * @description Ch5 Video offers a wide range of functionality out-of-the-box.
 * @componentVersion 1.0.0
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
 *        "<ch5-video aspectratio=\"${1:16:9}\" size=\"${2:large}\" sourcetype=\"${3:Network}\" userid=\"${4}\" snapshotuserid=\"${5}\" password=\"${6}\" snapshotpassword=\"${7}\" snapshoturl=\"${8}\" url=\"${9}\" stretch=\"${10:false}\" zindex=\"${11:0}\" snapshotrefreshrate=\"${12:60}\">",
 *         "</ch5-video>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-video:all-attributes",
 *      "description": "Provides a view onto a streaming video window. Components that are to reside above the video that need to be visible and active, examples include buttons to control playback, text describing the video, and annotation controls, need to be defined as children elements to this component.",
 *      "body": [
 *        "<ch5-video indexid=\"${1}\" aspectratio=\"${2:16:9}\" size=\"${3:large}\" sourcetype=\"${4:Network}\" userid=\"${5}\" snapshotuserid=\"${6}\" password=\"${7}\" snapshotpassword=\"${8}\" snapshoturl=\"${9}\" url=\"${10}\" stretch=\"${11:false}\" zindex=\"${12:0}\" snapshotrefreshrate=\"${13:60}\" receivestatesourcetype=\"${14}\" receivestateuserid=\"${15}\" receivestatepassword=\"${16}\" receivestatesnapshoturl=\"${17}\" receivestatesnapshotrefreshrate=\"${18}\" receivestatesnapshotuserid=\"${19}\" receivestatesnapshotpassword=\"${20}\" receivestateplay=\"${21}\" receivestateselect=\"${22}\" receivestateurl=\"${23}\" receivestatevideocount=\"${24}\" sendeventonclick=\"${25}\" sendeventstate=\"${26}\" sendeventselectionurl=\"${27}\" sendeventerrorcode=\"${28}\" sendeventerrormessage=\"${29}\" sendeventsnapshoturl=\"${30}\" sendeventselectionsourcetype=\"${31}\" sendeventselectionchange=\"${32}\" sendeventretrycount=\"${33}\" sendeventsnapshotlastupdatetime=\"${34}\" sendeventresolution=\"${35}\" sendeventsnapshotstatus=\"${36}\">",
 *         "</ch5-video>$0"
 *        ] 
 *    }
 * ]
 *
 */

export interface ICh5VideoAttributes extends ICh5CommonAttributes {

    /**
     * @name indexid
     * @documentation
     * [
     * "`indexId` attribute",
     *  "***",
     *  "Provides the name of the offset identifier to be substituted with a 0-based index of the list items within the signal names provided in other attributes surrounded by {{ }} delimiters."
     * ]
     */
    indexId: string;

    /**
     * @name userid
     * @documentation
     * [
     * "`userId` attribute",
     *  "***",
     *  "The user ID to access the video along with a password."
     * ]
     */
    userId: string;

    /**
     * @name snapshotuserid
     * @documentation
     * [
     * "`snapShotUserId` attribute",
     *  "***",
     *  "The user ID to access the snapshot along with a password."
     * ]
     */
    snapShotUserId: string;

    /**
     * @name password
     * @documentation
     * [
     * "`password` attribute",
     *  "***",
     *  "The password to access the video along with a user ID."
     * ]
     */
    password: string;

    /**
     * @name snapshotpassword
     * @documentation
     * [
     * "`snapShotPassword` attribute",
     *  "***",
     *  "The password to access the snapshot along with user ID."
     * ]
     */
    snapShotPassword: string;

    /**
     * @name snapshotrefreshrate
     * @documentation
     * [
     * "`snapShotRefreshRate` attribute",
     *  "***",
     *  "The refresh rate of the snapshot."
     * ]
     */
    snapShotRefreshRate: string;

    /**
     * @name aspectratio
     * @documentation
     * [
     * "`aspectRatio` attribute",
     *  "***",
     *  "Sets the width-to-height ration of the video. ",
     *  "The width and height of the component to be controlled by CSS style classes. ",
     *  "Values are 16:9 (default), 4:3, and custom.  When the size of the container does not match the aspect ratio, ",
     *  "the full height or width should be used and the dimension that is empty should be centered."
     * ]
     */
    aspectRatio: TCH5VideoAspectRatio | string;

    /**
     * @name stretch
     * @documentation
     * [
     * "`stretch` attribute",
     *  "***",
     *  "The default value is false. When true, video will occupy the size of the parent container. The user ",
     *  "needs to specify the width and height of the parent container for the video to appear correctly. ",
     *  "The video will be displayed as a letter or pillar box based on the aspect ratio and size of the ",
     *  "parent container. The parent container should not contain any tags other than ch5-background ",
     *  "and CH5-Video."
     * ]
     */
    stretch: TCH5VideoStretch | string;

    /**
     * @name url
     * @documentation
     * [
     * "`url` attribute",
     *  "***",
     *  "The source path of the video."
     * ]
     */
    url: string;

    /**
     * @name sourcetype
     * @documentation
     * [
     * "`sourceType` attribute",
     *  "***",
     *  "The video Source type, which can be 'Network', 'HDMI' or 'DM'."
     * ]
     */
    sourceType: TCH5VideoSourceType | string;

    /**
     * @name snapshoturl
     * @documentation
     * [
     * "`snapShotUrl` attribute",
     *  "***",
     *  "A snapshot of the video, if any."
     * ]
     */
    snapShotUrl: string;

    /**
     * @name size
     * @documentation
     * [
     * "`size` attribute",
     *  "***",
     * "The default value is large. ",
     *  "The display size for the video. The default size is 'large' if not entered. ",
     *  "The size options for the aspect ratio 16:9 and 4:3 are 'x-small' (width: 25vw, height: 25vh), ",
     *  "'small' (width: 40vw, height: 40vh), 'large' (width: 55vw, ",
     *  "height: 55vh), 'x-large' (width: 70vw, height: 70vh) and 'xx-large' (width: 85vw, height: 80vh). ",
     *  "The user needs to select the appropriate size to fit the container."
     * ]
     * @default large
     */
    size: TCH5VideoSize | string;

    /**
     * @name zindex
     * @documentation
     * [
     * "`zIndex` attribute",
     *  "***",
     *  "The video display moves back and forth with regards to the z-axis."
     * ]
     */
    zIndex: string;

    /**
     * @documentation
     * [
     * "`onpress` attribute",
     * "***",
     * "Runs when a press event is initiated."
     * ]
     * @name onpress
     */
    onpress: {};

    /**
     * @documentation
     * [
     * "`onrelease` attribute",
     * "***",
     * "Runs when a release event is initiated."
     * ]
     * @name onrelease
     */
    onrelease: {};

    /**
     * @name sendeventonclick
     * @documentation
     * [
     * "`sendEventOnClick` attribute",
     *  "***",
     *  "Sends a signal on a click or tap event (mouse or swipe up and down quickly)."
     * ]
     */
    sendEventOnClick: string;

    /**
     * @name sendeventselectionchange
     * @documentation
     * [
     * "`sendEventSelectionChange` attribute",
     *  "***",
     *  "Sends a signal on a source selection change when the source selection ",
     *  "is updated using the 'receivestateselect' attribute."
     * ]
     */
    sendEventSelectionChange: string;

    /**
     * @name sendeventselectionsourcetype
     * @documentation
     * [
     * "`sendEventSelectionSourceType` attribute",
     *  "***",
     *  "The current selected source type."
     * ]
     */
    sendEventSelectionSourceType: string;

    /**
     * @name sendeventselectionurl
     * @documentation
     * [
     * "`sendEventSelectionURL` attribute",
     *  "***",
     * "Sends a signal on an url change when the source url ",
     * "is updated using the 'receiveStateUrl' attribute."
     * ]
     */
    sendEventSelectionURL: string;

    /**
     * @name sendeventsnapshoturl
     * @documentation
     * [
     * "`sendEventSnapShotURL` attribute",
     *  "***",
     *  "The current selected snapshot URL."
     * ]
     */
    sendEventSnapShotURL: string;

    /**
     * @name sendeventerrorcode
     * @documentation
     * [
     * "`sendEventErrorCode` attribute",
     *  "***",
     *  "The current video error code state."
     * ]
     */
    sendEventErrorCode: string;

    /**
     * @name sendeventerrormessage
     * @documentation
     * [
     * "`sendEventErrorMessage` attribute",
     *  "***",
     *  "The current video error message state."
     * ]
     */
    sendEventErrorMessage: string;

    /**
     * @name sendeventretrycount
     * @documentation
     * [
     * "`sendEventRetryCount` attribute",
     *  "***",
     *  "The current video retry count state."
     * ]
     */
    sendEventRetryCount: string;

    /**
     * @name sendeventresolution
     * @documentation
     * [
     * "`sendEventResolution` attribute",
     *  "***",
     *  "The current video resolution."
     * ]
     */
    sendEventResolution: string;

    /**
     * @name sendeventstate
     * @documentation
     * [
     * "`sendEventState` attribute",
     *  "***",
     *  "The current state of the video associated with the current source selection."
     * ]
     */
    sendEventState: string;

    /**
     * @name sendeventsnapshotstatus
     * @documentation
     * [
     * "`sendEventSnapShotStatus` attribute",
     *  "***",
     *  "The current state of the snapshot associated with the current source selection."
     * ]
     */
    sendEventSnapShotStatus: string;

    /**
     * @name sendeventsnapshotlastupdatetime
     * @documentation
     * [
     * "`sendEventSnapShotLastUpdateTime` attribute",
     *  "***",
     *  "The timestamp of the last update time of the still image associated with the current source selection."
     * ]
     */
    sendEventSnapShotLastUpdateTime: string;

    /**
     * @name receivestateurl
     * @documentation
     * [
     * "`receiveStateUrl` attribute",
     *  "***",
     *  "The default value is empty. Defines the video URL as an attribute."
     * ]
     */
    receiveStateUrl: string;

    /**
     * @name receivestatesnapshoturl
     * @documentation
     * [
     * "`receiveStateSnapShotURL` attribute",
     *  "***",
     *  "Provides the still image URL to use when selection changes to an INDEX value."
     * ]
     */
    receiveStateSnapShotURL: string;

    /**
     * @name receivestateplay
     * @documentation
     * [
     * "`receiveStatePlay` attribute",
     *  "***",
     *  "When defined, this will play video only when the value is true and will stop video when the value is false. ",
     *  "If not defined, the video will play whenever the component is visible. If defined with a value of false, ",
     *  "the background of ch5-video--nosource css class is displayed."
     * ]
     */
    receiveStatePlay: string;

    /**
     * @name receivestateselect
     * @documentation
     * [
     * "`receiveStateSelect` attribute",
     *  "***",
     *  "When defined, this will play 0-based index of the video source list. ",
     *  "A value of <0 or >31 will select no video to play. A Value of 0 to 31 will play the selected video source ",
     *  "provided the video source type (see receiveStateVideoSourceType) is valid. When not defined, ",
     *  "the first video source defined (equivalent of index 0) in the list will be played."
     * ]
     */
    receiveStateSelect: string;

    /**
     * @name receivestatesourcetype
     * @documentation
     * [
     * "`receiveStateSourceType` attribute",
     *  "***",
     *  "Provides the video source type when the selection changes to an INDEX value."
     * ]
     */
    receiveStateSourceType: string;

    /**
     * @name receivestatesnapshotrefreshrate
     * @documentation
     * [
     * "`receiveStateSnapShotRefreshRate` attribute",
     *  "***",
     *  "Defines the refresh rate for a still image url. 0 indicates no refresh."
     * ]
     */
    receiveStateSnapShotRefreshRate: string;

    /**
     * @name receivestateuserid
     * @documentation
     * [
     * "`receiveStateUserId` attribute",
     *  "***",
     *  "Provides the user ID for credentials supplied to a camera for a video URL."
     * ]
     */
    receiveStateUserId: string;

    /**
     * @name receivestatesnapshotuserid
     * @documentation
     * [
     * "`receiveStateSnapShotUserId` attribute",
     *  "***",
     *  "Provides the user ID for credentials supplied to a camera for an image URL."
     * ]
     */
    receiveStateSnapShotUserId: string;

    /**
     * @name receivestatepassword
     * @documentation
     * [
     * "`receiveStatePassword` attribute",
     *  "***",
     *  "Provides the password for credentials supplied to a camera for a video URL."
     * ]
     */
    receiveStatePassword: string;

    /**
     * @name receivestatesnapshotpassword
     * @documentation
     * [
     * "`receiveStateSnapShotPassword` attribute",
     *  "***",
     *  "Provides the password for credentials supplied to a camera for an image URL."
     * ]
     */
    receiveStateSnapShotPassword: string;

    /**
     * @name receivestatevideocount
     * @documentation
     * [
     * "`receiveStateVideoCount` attribute",
     *  "***",
     *  "Provides the count of the videos."
     * ]
     */
    receiveStateVideoCount: string;
}

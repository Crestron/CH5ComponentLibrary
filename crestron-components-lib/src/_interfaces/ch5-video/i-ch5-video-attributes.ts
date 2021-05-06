// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCH5VideoStretch, TCH5VideoAspectRatio, TCH5VideoSize, TCH5VideoSourceType } from './types';

/**
 * @ignore
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
     *  "The display size for the video. The default size is 'small' if not entered. ",
     *  "The size options for the aspect ratio 16:9 and 4:3 are 'x-small' (width: 25vw, height: 25vh), ",
     *  "'small' (width: 40vw, height: 40vh), 'large' (width: 55vw, ",
     *  "height: 55vh), 'x-large' (width: 70vw, height: 70vh) and 'xx-large' (width: 85vw, height: 80vh). ",
     *  "The user needs to select the appropriate size to fit the container."
     * ]
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

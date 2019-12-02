// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../ch5-common";
import { TCH5VideoControls, TCH5VideoStretch, TCH5VideoAspectRatio, TCH5VideoSize, TCH5VideoSourceType } from './types';

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
     *  "Provides the name of the offset identifier to substituted with 0 based index of the item in list within the signal names provided in other attributes surrounded by {{ }} delimiters."
     * ]
     */
    indexId: string;

    /**
     * @name userid
     * @documentation
     * [
     * "`userId` attribute",
     *  "***",
     *  "Userid to access the video along with password."
     * ]
     */
    userId: string;

    /**
     * @name snapshotuserid
     * @documentation
     * [
     * "`snapShotUserId` attribute",
     *  "***",
     *  "Userid to access the snapshot along with password."
     * ]
     */
    snapShotUserId: string;

    /**
     * @name password
     * @documentation
     * [
     * "`password` attribute",
     *  "***",
     *  "Password to access the video along with userid."
     * ]
     */
    password: string;

    /**
     * @name snapshotpassword
     * @documentation
     * [
     * "`snapShotPassword` attribute",
     *  "***",
     *  "Password to access the snapshot along with userid."
     * ]
     */
    snapShotPassword: string;

    /**
     * @name snapshotrefreshrate
     * @documentation
     * [
     * "`snapShotRefreshRate` attribute",
     *  "***",
     *  "Refresh rate of the snapshot."
     * ]
     */
    snapShotRefreshRate: string;

    /**
     * @name aspectratio
     * @documentation
     * [
     * "`aspectRatio` attribute",
     *  "***",
     *  "Sets the ratio of width to height of the video.",
     *  "Width and height of the component to be controlled by css style classes.",
     *  "Values are 16:9 (default), 4:3, and custom.  When size of container is not match the aspect ratio, ",
     *  "the full height or the full width should be used and the dimension that is not full should be centered."
     * ]
     */
    aspectRatio: TCH5VideoAspectRatio | string;

    /**
     * @name stretch
     * @documentation
     * [
     * "`stretch` attribute",
     *  "***",
     *  "Default false.  When true, video will be displayed in the whole component.",
     *  "When false, video will be displayed as letter or pillar box based upon the aspect ratio of the video ",
     *  "feed and the size of the component.  Note: this attribute is independent of aspectRatio."
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
     *  "Video Source type can be Network, HDMI or DM."
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
     *  "The display size for the video. The default size will be small if not mentioned.",
     *  "The size options for the aspect ratio 16:9 are x-small (width: 256, height: 144), ",
     *  "small (width: 512, height: 288), regular (width: 768, height: 432), large (width: 1024, ",
     *  "height: 576), x-large (width: 1280, height: 720) and xx-large (width: 1920, height: 1080).",
     *  "The size options for the aspect ratio 4:3 are x-small (width: 192, height: 144), ",
     *  "small (width: 384, height: 288), regular (width: 576, height: 432), large width: 768, ",
     *  "height: 576), x-large (width: 960, height: 720) and xx-large (width: 1440, height: 1080).",
     *  "The user needs to select appropriate size to fit the container."
     * ]
     */
    size: TCH5VideoSize | string;

    /**
     * @name zindex
     * @documentation
     * [
     * "`zIndex` attribute",
     *  "***",
     *  "Display of the video moves front and back w.r.t z-axis."
     * ]
     */
    zIndex: string;

    /**
     * @name controls
     * @documentation
     * [
     * "`controls` attribute",
     *  "***",
     *  "When present, it specifies that video controls like start, stop, fullscreen should be displayed."
     * ]
     */
    controls: TCH5VideoControls | string;

    /**
     * @name sendeventonclick
     * @documentation
     * [
     * "`sendEventOnClick` attribute",
     *  "***",
     *  "Send signal on click or tap event (mouse or finger up and down in a small period of time)."
     * ]
     */
    sendEventOnClick: string;

    /**
     * @name sendeventselectionchange
     * @documentation
     * [
     * "`sendEventSelectionChange` attribute",
     *  "***",
     *  "Send signal on source selection change."
     * ]
     */
    sendEventSelectionChange: string;

    /**
     * @name sendeventselectionsourcetype
     * @documentation
     * [
     * "`sendEventSelectionSourceType` attribute",
     *  "***",
     *  "Current selected source type."
     * ]
     */
    sendEventSelectionSourceType: string;

    /**
     * @name sendeventselectionurl
     * @documentation
     * [
     * "`sendEventSelectionURL` attribute",
     *  "***",
     *  "Current selected video URL."
     * ]
     */
    sendEventSelectionURL: string;

    /**
     * @name sendeventsnapshoturl
     * @documentation
     * [
     * "`sendEventSnapShotURL` attribute",
     *  "***",
     *  "Current selected snapshot URL."
     * ]
     */
    sendEventSnapShotURL: string;

    /**
     * @name sendeventerrorcode
     * @documentation
     * [
     * "`sendEventErrorCode` attribute",
     *  "***",
     *  "Current state video error code."
     * ]
     */
    sendEventErrorCode: string;

    /**
     * @name sendeventerrormessage
     * @documentation
     * [
     * "`sendEventErrorMessage` attribute",
     *  "***",
     *  "Current state video error message."
     * ]
     */
    sendEventErrorMessage: string;

    /**
     * @name sendeventretrycount
     * @documentation
     * [
     * "`sendEventRetryCount` attribute",
     *  "***",
     *  "Current state video retry count."
     * ]
     */
    sendEventRetryCount: string;

    /**
     * @name sendeventresolution
     * @documentation
     * [
     * "`sendEventResolution` attribute",
     *  "***",
     *  "Current video resolution."
     * ]
     */
    sendEventResolution: string;

    /**
     * @name sendeventstate
     * @documentation
     * [
     * "`sendEventState` attribute",
     *  "***",
     *  "Current state of the video associated with the current source selection."
     * ]
     */
    sendEventState: string;

    /**
     * @name sendeventsnapshotstatus
     * @documentation
     * [
     * "`sendEventSnapShotStatus` attribute",
     *  "***",
     *  "Current state of the snapshot associated with the current source selection."
     * ]
     */
    sendEventSnapShotStatus: string;

    /**
     * @name sendstatesnapshotlastupdatetime
     * @documentation
     * [
     * "`sendStateSnapShotLastUpdateTime` attribute",
     *  "***",
     *  "The timestamp of the last update time of the still image associated with the current source selection."
     * ]
     */
    sendStateSnapShotLastUpdateTime: string;

    /**
     * @name receivestateurl
     * @documentation
     * [
     * "`receiveStateUrl` attribute",
     *  "***",
     *  "Default empty. Defines the video URL as an attribute."
     * ]
     */
    receiveStateUrl: string;

    /**
     * @name receivestatesnapshoturl
     * @documentation
     * [
     * "`receiveStateSnapShotURL` attribute",
     *  "***",
     *  "Provides the still image URL to use when selection changes to INDEX value."
     * ]
     */
    receiveStateSnapShotURL: string;

    /**
     * @name receivestateplay
     * @documentation
     * [
     * "`receiveStatePlay` attribute",
     *  "***",
     *  "When defined, will play video only when the value is true, will stop video when value is false.",
     *  "If not defined, the video will play whenever the component is visible.  If defined and value of false, ",
     *  "display background of ch5-video--nosource css class."
     * ]
     */
    receiveStatePlay: string;

    /**
     * @name receivestateselect
     * @documentation
     * [
     * "`receiveStateSelect` attribute",
     *  "***",
     *  "When defined, will play 0-based index of the video source list.",
     *  "Value of < 0 or > 31 will select no video to play Value of 0 to 31 will play the selected video source ",
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
     *  "Provides the video source type when the selection changes to INDEX value."
     * ]
     */
    receiveStateSourceType: string;

    /**
     * @name receivestatesnapshotrefreshrate
     * @documentation
     * [
     * "`receiveStateSnapShotRefreshRate` attribute",
     *  "***",
     *  "Defines the refresh rate for a still image url.  0 indicates no refresh."
     * ]
     */
    receiveStateSnapShotRefreshRate: string;

    /**
     * @name receivestateuserid
     * @documentation
     * [
     * "`receiveStateUserId` attribute",
     *  "***",
     *  "Provides the userid for credentials supplied to camera for video URL."
     * ]
     */
    receiveStateUserId: string;

    /**
     * @name receivestatesnapshotuserid
     * @documentation
     * [
     * "`receiveStateSnapShotUserId` attribute",
     *  "***",
     *  "provides the userid for credentials supplied to camera for image URL."
     * ]
     */
    receiveStateSnapShotUserId: string;

    /**
     * @name receivestatepassword
     * @documentation
     * [
     * "`receiveStatePassword` attribute",
     *  "***",
     *  "provides the password for credentials supplied to camera for video URL."
     * ]
     */
    receiveStatePassword: string;

    /**
     * @name receivestatesnapshotpassword
     * @documentation
     * [
     * "`receiveStateSnapShotPassword` attribute",
     *  "***",
     *  "Provides the password for credentials supplied to camera for image URL."
     * ]
     */
    receiveStateSnapShotPassword: string;

    /**
     * @name receivestatepositionchange
     * @documentation
     * [
     * "`receiveStatePositionChange` attribute",
     *  "***",
     *  "The user needs to add onscroll event listener to the page where the video is added. When ",
     *  "the user scrolls the page the event is fired and a boolean value true is published to indicate ",
     *  "the video position has changed. When user stops scrolling a boolean value false is published to indicate ",
     *  "the scroll has stopped. This helps the video component to know the position changes in the page and to ",
     *  "move the video to a new position. This value is triggered within the UI layer and do not expect ",
     *  "any value from the control system."
     * ]
     */
    receiveStatePositionChange: string;

}

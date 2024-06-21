// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributesVideo } from "../../ch5-common/interfaces/i-ch5-common-attributes-video";
import { TCh5VideoAspectRatio, TCh5VideoSourceType, TCh5VideoSize, } from './t-ch5-video';

/**
 * @ignore
 */
export interface ICh5VideoAttributes extends ICh5CommonAttributesVideo {
	/**
	 * @documentation
	 * [
	 * "`indexId` attribute",
	 * "***",
	 * "Provides the name of the offset identifier to be substituted with 0 based index of the item in list within the signal names provided in other attributes surrounded by '{{ delimiters }}'. See examples. Note: 0-based.  Other components, e.g. List, Spinner, Select, are currently 1-based, but will be changed to 0-based in the future.  This component will start as 0-based. "
	 * ]
	 * @name indexid
	 * @default 
	 * @attributeType "String"
	 */
	indexId: string;

	/**
	 * @documentation
	 * [
	 * "`aspectRatio` attribute",
	 * "***",
	 * "Sets the ratio of width to height of the video. Width and height of the component to be controlled by css style classes.",
	 * "Values are '16:9' (default), '4:3'. When size of container is not match the aspect ratio, the full height or the full width should be used and the dimension that is not full should be centered.",
	 * "In other words, use letterbox or pillarbox logic to place the video component view. Note: this attribute only defines the size of the component within the project, it does not define the size of video displayed within the component."
	 * ]
	 * @name aspectratio
	 * @default 16:9
	 * @attributeType "EnumeratedValue"
	 */
	aspectRatio: TCh5VideoAspectRatio;

	/**
	 * @documentation
	 * [
	 * "`stretch` attribute",
	 * "***",
	 * "Default false. When true, video will be displayed in the whole component. When false, video will be displayed as letter or pillar box based upon the aspect ratio of the video feed and the size of the component. Note: this attribute is independent of aspectRatio."
	 * ]
	 * @name stretch
	 * @default false
	 * @attributeType "Boolean"
	 */
	stretch: boolean;

	/**
	 * @documentation
	 * [
	 * "`url` attribute",
	 * "***",
	 * "Default empty. Defines the video URL as an attribute, superseded by receiveStateURL."
	 * ]
	 * @name url
	 * @default 
	 * @attributeType "String"
	 */
	url: string;

	/**
	 * @documentation
	 * [
	 * "`sourceType` attribute",
	 * "***",
	 * "Default 'Network'. Defines the type of Video stream, superseded by receiveStateSourceType. Possible values are Network and HDMI."
	 * ]
	 * @name sourcetype
	 * @default Network
	 * @attributeType "EnumeratedValue"
	 */
	sourceType: TCh5VideoSourceType;

	/**
	 * @documentation
	 * [
	 * "`userId` attribute",
	 * "***",
	 * "Default empty. Defines the userid passed to camera as credentials for video URL. Superseded by receiveStateUserId."
	 * ]
	 * @name userid
	 * @default 
	 * @attributeType "String"
	 */
	userId: string;

	/**
	 * @documentation
	 * [
	 * "`password` attribute",
	 * "***",
	 * "Default empty. Defines the password passed to the camera as credentials for the video URL. Superseded by receiveStatePassword."
	 * ]
	 * @name password
	 * @default 
	 * @attributeType "String"
	 */
	password: string;

	/**
	 * @documentation
	 * [
	 * "`snapshotURL` attribute",
	 * "***",
	 * "Default empty. Defines the still image URL as an attribute, superseded by receiveStateSnapshotURL."
	 * ]
	 * @name snapshoturl
	 * @default 
	 * @attributeType "String"
	 */
	snapshotURL: string;

	/**
	 * @documentation
	 * [
	 * "`snapshotRefreshRate` attribute",
	 * "***",
	 * "Default 5. Defines the refresh period for a snapshot URL in units of seconds. 0 indicates no refresh, max is 60. Superseded by receiveStateSnapshotRefreshRate."
	 * ]
	 * @name snapshotrefreshrate
	 * @default 5
	 * @limits [{"min": 0, "max": 60}]
	 * @attributeType "Integer"
	 */
	snapshotRefreshRate: number;

	/**
	 * @documentation
	 * [
	 * "`snapshotUserId` attribute",
	 * "***",
	 * "Default empty. Defines the userid passed to the camera as credentials for the image URL. Superseded by receiveStateSnapshotUserId."
	 * ]
	 * @name snapshotuserid
	 * @default 
	 * @attributeType "String"
	 */
	snapshotUserId: string;

	/**
	 * @documentation
	 * [
	 * "`snapshotPassword` attribute",
	 * "***",
	 * "Default empty. Defines the password passed to the camera as credentials for the image URL. Superseded by receiveStateSnapshotPassword."
	 * ]
	 * @name snapshotpassword
	 * @default 
	 * @attributeType "String"
	 */
	snapshotPassword: string;

	/**
	 * @documentation
	 * [
	 * "`size` attribute",
	 * "***",
	 * "Default regular. Defines the size of the video. The options available are 'x-small' | 'small' | 'regular' | 'large' | 'xlarge' | 'xx-large'."
	 * ]
	 * @name size
	 * @default regular
	 * @attributeType "EnumeratedValue"
	 */
	size: TCh5VideoSize;

	/**
	 * @documentation
	 * [
	 * "`receiveStatePlay` attribute",
	 * "***",
	 * "when defined, will play video only when the value is true, will stop video when value is false.  If not defined, the video will play whenever the component is visible.  If defined and value of false, display background of ch5-video--nosource css class."
	 * ]
	 * @name receivestateplay
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStatePlay: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateSelect` attribute",
	 * "***",
	 * "when defined, will play 0-based index of the video source list. Value of < 0 or > 31 will select no video to play Value of 0 to 31 will play the selected video source provided the video source type (see receiveStateSourceType) is valid. when not defined, the first video source defined (equivalent of index 0) in the list will be played."
	 * ]
	 * @name receivestateselect
	 * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateSelect: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateURL` attribute",
	 * "***",
	 * "provides the video URL to use when the selection changes to the INDEX value. INDEX is the value passed in the 'indexId' attribute that can be used as prefix or suffix of a signal template name. INDEX is 0-based offset into the list of up to maximum number of sources. As an example, if the value provided as indexId is 'INDEX' and the value provided for receiveStateURL is 'panel2.videourl[{{INDEX}}]', this video control will use 'panel2.videourl[0]', 'panel2.videourl[1]', ..., 'panel2.video_url[31]' as string state names to be associated with select value 0, 1, ..., 31."
	 * ]
	 * @name receivestateurl
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateURL: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateSourceType` attribute",
	 * "***",
	 * "provides the video source type when the selection changes to INDEX value. Values are 'Network', 'HDMI'."
	 * ]
	 * @name receivestatesourcetype
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateSourceType: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateUserId` attribute",
	 * "***",
	 * "provides the userid for credentials supplied to camera for video URL."
	 * ]
	 * @name receivestateuserid
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateUserId: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStatePassword` attribute",
	 * "***",
	 * "provides the password for credentials supplied to camera for video URL."
	 * ]
	 * @name receivestatepassword
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStatePassword: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateSnapshotURL` attribute",
	 * "***",
	 * "provides the still image URL to use when selection changes to INDEX value."
	 * ]
	 * @name receivestatesnapshoturl
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateSnapshotURL: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateSnapshotRefreshRate` attribute",
	 * "***",
	 * "Defines the refresh period for a still image url when the selection changes to INDEX value. 0 indicates no refresh."
	 * ]
	 * @name receivestatesnapshotrefreshrate
	 * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateSnapshotRefreshRate: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateSnapshotUserId` attribute",
	 * "***",
	 * "provides the userId for credentials supplied to camera for image URL."
	 * ]
	 * @name receivestatesnapshotuserid
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateSnapshotUserId: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateSnapshotPassword` attribute",
	 * "***",
	 * "provides the password for credentials supplied to camera for image URL."
	 * ]
	 * @name receivestatesnapshotpassword
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateSnapshotPassword: string;

	/**
	 * @documentation
	 * [
	 * "`receiveStateVideoCount` attribute",
	 * "***",
	 * "provides the count of videos."
	 * ]
	 * @name receivestatevideocount
	 * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateVideoCount: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventOnClick` attribute",
	 * "***",
	 * "send a signal on click or tap event (mouse or finger up and down in a small period of time)."
	 * ]
	 * @name sendeventonclick
	 * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventOnClick: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventSelectionChange` attribute",
	 * "***",
	 * "send signal on source selection change."
	 * ]
	 * @name sendeventselectionchange
	 * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventSelectionChange: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventSelectionSourceType` attribute",
	 * "***",
	 * "current selected source type."
	 * ]
	 * @name sendeventselectionsourcetype
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventSelectionSourceType: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventSelectionURL` attribute",
	 * "***",
	 * "current selected video URL."
	 * ]
	 * @name sendeventselectionurl
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventSelectionURL: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventSnapshotURL` attribute",
	 * "***",
	 * "current selected snapshot URL."
	 * ]
	 * @name sendeventsnapshoturl
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventSnapshotURL: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventState` attribute",
	 * "***",
	 * "current state of the video stream numeric enumeration 0 - no selected source or uninitialized 1 - stopped 2 - playing 3 - stop requested 4 - play requested, connecting 5 - play requested, buffering 6 - play requested, retrying 7 - play requested, error."
	 * ]
	 * @name sendeventstate
	 * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventState: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventErrorCode` attribute",
	 * "***",
	 * "current state video error code numeric enumeration, applicable only when state of video is 0-success, 1-HDMI no sync, 2 - DM no stream, -1 -connection refused / camera offline, -2 -no network, -1001 -credentials required or invalid, -1002 -hostname invalid, -1003 -unsupported codec, -9001 - unsupported sourceType, -9002 - invalid url, -9003 - request for greater than maximum simultaneous sessions per source type, -9004 - request for greater than maximum simultaneous sessions per device, -9007 - Unknown Error Message"
	 * ]
	 * @name sendeventerrorcode
	 * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventErrorCode: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventErrorMessage` attribute",
	 * "***",
	 * "current state video error message string - diagnostic information on error as propagated from the video rendering engine."
	 * ]
	 * @name sendeventerrormessage
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventErrorMessage: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventRetryCount` attribute",
	 * "***",
	 * "current state video  retry count numeric - the count of times the video engine has retried to stream the current video source."
	 * ]
	 * @name sendeventretrycount
	 * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventRetryCount: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventResolution` attribute",
	 * "***",
	 * "current video resolution string."
	 * ]
	 * @name sendeventresolution
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventResolution: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventSnapshotStatus` attribute",
	 * "***",
	 * "current state of the still image associated with the current source selection numeric - 0 not shown, 1 -currently shown, 2 - in error."
	 * ]
	 * @name sendeventsnapshotstatus
	 * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventSnapshotStatus: string;

	/**
	 * @documentation
	 * [
	 * "`sendEventSnapshotLastUpdateTime` attribute",
	 * "***",
	 * "The timestamp of  the last update time of the still image associated with the current source selection string - serial in RFC 3339 format."
	 * ]
	 * @name sendeventsnapshotlastupdatetime
	 * @join {"direction": "event", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventSnapshotLastUpdateTime: string;

}
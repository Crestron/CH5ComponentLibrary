import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5SampleAspectRatio, TCh5SampleSourceType, TCh5SampleSize, } from './t-ch5-sample';

/**
 * @ignore
 */
export interface ICh5SampleAttributes extends ICh5CommonAttributes {
      /**
            * @documentation
            * [
            * "`indexId` attribute",
            * "***",
            * "Provides the name of the offset identifier to be substituted with 0 based index of the item in list within the signal names provided in other attributes surrounded by {{ }} delimiters.   See examples. Note: 0-based.  Other components, e.g. List, Spinner, Select, are currently 1-based, but will be changed to 0-based in the future.  This component will start as 0-based. "
            * ]
            * @name indexid
            * @default 0
            * @attributeType "String"
            */
      indexId: string;
      /**
       * @documentation
       * [
       * "`aspectRatio` attribute",
       * "***",
       * "Sets the ratio of width to height of the video. Width and height of the component to be controlled by css style classes. Values are "16:9" (default), "4:3", and custom. When size of container is not match the aspect ratio, the full height or the full width should be used and the dimension that is not full should be centered. In other words, use letterbox or pillarbox logic to place the video component view. Note: this attribute only defines the size of the component within the project, it does not define the size of video displayed within the component."
       * ]
       * @name aspectratio
       * @default 16:9
       * @attributeType "EnumeratedValue"
       */
      aspectRatio: TCh5SampleAspectRatio;
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
       * "Default empty. Defines the video URL as an attribute, superseded by receiveStateURL"
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
       * "Default 'Network'. Defines the type of Video stream, superseded by receiveStateSourceType. See enumeration values in receiveStateSourceType."
       * ]
       * @name sourcetype
       * @default Network
       * @attributeType "EnumeratedValue"
       */
      sourceType: TCh5SampleSourceType;
      /**
      * @documentation
      * [
      * "`userId` attribute",
      * "***",
      * "Default empty. Defines the userid passed to camera as credentials for video URL. Superseded by receiveStateUserId,"
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
       * "Default empty. Defines the password passed to the camera as credentials for the video URL. Superseded by receiveStatePassword,"
       * ]
       * @name password
       * @default 
       * @attributeType "String"
       */
      password: string;
      /**
       * @documentation
       * [
       * "`snapShotURL` attribute",
       * "***",
       * "Default empty. Defines the still image URL as an attribute, superseded by receiveStateSnapshotURL"
       * ]
       * @name snapshoturl
       * @default 
       * @attributeType "String"
       */
      snapShotURL: string;
      /**
       * @documentation
       * [
       * "`snapShotRefershRate` attribute",
       * "***",
       * "Default 0. Defines the refresh period for a snapshot URL in units of seconds. 0 indicates no refresh. Superseded by receiveStateSnapShotRefreshrate"
       * ]
       * @name snapshotrefershrate
       * @default 0
       * @limits [{"min": 0, "max": 5}]
       * @attributeType "Integer"
       */
      snapShotRefershRate: number;
      /**
       * @documentation
       * [
       * "`snapShotUserId` attribute",
       * "***",
       * "Default empty. Defines the userid passed to the camera as credentials for the image URL. Superseded by receiveStateSnapShotUserId,"
       * ]
       * @name snapshotuserid
       * @default 
       * @attributeType "String"
       */
      snapShotUserId: string;
      /**
       * @documentation
       * [
       * "`snapShotPassword` attribute",
       * "***",
       * "Default empty. Defines the password passed to the camera as credentials for the image URL. Superseded by receiveStateSnapShotPassword."
       * ]
       * @name snapshotpassword
       * @default 
       * @attributeType "String"
       */
      snapShotPassword: string;
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
      size: TCh5SampleSize;
      /**
      * @documentation
      * [
      * "`zindex` attribute",
      * "***",
      * "Default 0. To overlap one video with the other, useful to create PIP (picture-in-picture). Not supported on Day 1 Release."
      * ]
      * @name zindex
      * @default 0
      * @limits [{"min": 0, "max": 999}]
      * @attributeType "Integer"
      */
      zindex: number;
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
       * "when defined, will play 0-based index of the video source list. Value of < 0 or > 31 will select no video to play Value of 0 to 31 will play the selected video source provided the video source type (see receiveStateSourceType) is valid. when not defined, the first video source defined (equivalent of index 0) in the list will be played"
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
       * "provides the video URL to use when the selection changes to the INDEX value. INDEX is the value passed in the 'indexId' attribute that can be used as prefix or suffix of a signal template name. INDEX is 0-based offset into the list of up to maximum number of sources. As an example, if the value provided as indexId is "INDEX" and the value provided for receiveStateURL is "panel2.videourl[{{INDEX}}]", this video control will use "panel2.videourl[0]", "panel2.videourl[1]", ..., "panel2.video_url[31]" as string state names to be associated with select value 0, 1, ..., 31."
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
       * "provides the video source type when the selection changes to INDEX value. See description of INDEX in receiveStateURL. enumerated values are “Network”, “HDMI”, and “DM”"
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
       * "provides the userid for credentials supplied to camera for video URL. See description of INDEX in receiveStateURL"
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
       * "provides the password for credentials supplied to camera for video URL. See description of INDEX in receiveStateURL"
       * ]
       * @name receivestatepassword
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      receiveStatePassword: string;
      /**
       * @documentation
       * [
       * "`receiveStateSnapShotURL` attribute",
       * "***",
       * "provides the still image URL to use when selection changes to INDEX value. See the description of INDEX in receiveStateURL."
       * ]
       * @name receivestatesnapshoturl
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      receiveStateSnapShotURL: string;
      /**
       * @documentation
       * [
       * "`receiveStateSnapShotRefreshRate` attribute",
       * "***",
       * "Defines the refresh period for a still image url when the selection changes to INDEX value. 0 indicates no refresh. See the description of INDEX in receiveStateURL."
       * ]
       * @name receivestatesnapshotrefreshrate
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      receiveStateSnapShotRefreshRate: string;
      /**
       * @documentation
       * [
       * "`receiveStateSnapShotUserId` attribute",
       * "***",
       * "provides the userid for credentials supplied to camera for image URL. See description of INDEX in receiveStateURL"
       * ]
       * @name receivestatesnapshotuserid
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      receiveStateSnapShotUserId: string;
      /**
       * @documentation
       * [
       * "`receiveStateSnapShotPassword` attribute",
       * "***",
       * "provides the password for credentials supplied to camera for image URL. See description of INDEX in receiveStateURL"
       * ]
       * @name receivestatesnapshotpassword
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      receiveStateSnapShotPassword: string;
      /**
       * @documentation
       * [
       * "`receivestatevideocount` attribute",
       * "***",
       * "provides the count of videos."
       * ]
       * @name receivestatevideocount
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      receivestatevideocount: string;
      /**
       * @documentation
       * [
       * "`sendEventOnClick` attribute",
       * "***",
       * "send a signal on click or tap event (mouse or finger up and down in a small period of time)"
       * ]
       * @name sendeventonclick
       * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
       * @attributeType "Join"
       */
      sendEventOnClick: string;
      /**
       * @documentation
       * [
       * "`sendEventSelectionChange` attribute",
       * "***",
       * "send signal on source selection change"
       * ]
       * @name sendeventselectionchange
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      sendEventSelectionChange: string;
      /**
       * @documentation
       * [
       * "`sendEventSelectionSourceType` attribute",
       * "***",
       * "current selected source type"
       * ]
       * @name sendeventselectionsourcetype
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      sendEventSelectionSourceType: string;
      /**
       * @documentation
       * [
       * "`sendEventSelectionURL` attribute",
       * "***",
       * "current selected video URL"
       * ]
       * @name sendeventselectionurl
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      sendEventSelectionURL: string;
      /**
       * @documentation
       * [
       * "`sendEventSnapShotURL` attribute",
       * "***",
       * "current selected snapshot URL"
       * ]
       * @name sendeventsnapshoturl
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      sendEventSnapShotURL: string;
      /**
       * @documentation
       * [
       * "`sendEventState` attribute",
       * "***",
       * "current state of the video stream numeric enumeration 0 - no selected source or uninitialized 1 - stopped 2 - playing 3 - stop requested 4 - play requested, connecting 5 - play requested, buffering 6 - play requested, retrying 7 - play requested, error"
       * ]
       * @name sendeventstate
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      sendEventState: string;
      /**
       * @documentation
       * [
       * "`sendEventErrorCode` attribute",
       * "***",
       * "current state video error code numeric enumeration, applicable only when state of video is error 0 - no error transient issues (retry is appropriate) > 0 1 - miscellaneous transient issue (error not known or none of the below) 2 - connection timeout (network issues, camera offline, etc) 3 - No input sync (HDMI not plugged in, DM not streaming) setup and system issues (retry is not appropriate) < 0 -1 - miscellaneous error (error not known or none of below) -2 - host name could not be resolved -3 - unsupported source type for this platform -4 - connection timeout -5 - invalid credentials -6 - unsupported streaming protocol -7 - unsupported codec"
       * ]
       * @name sendeventerrorcode
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      sendEventErrorCode: string;
      /**
       * @documentation
       * [
       * "`sendEventErrorMessage` attribute",
       * "***",
       * "current state video error message string - diagnostic information on error as propagated from the video rendering engine. Not intended for end user to see"
       * ]
       * @name sendeventerrormessage
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      sendEventErrorMessage: string;
      /**
       * @documentation
       * [
       * "`sendEventRetryCount` attribute",
       * "***",
       * "current state video  retry count numeric - the count of times the video engine has retried to stream the current video source"
       * ]
       * @name sendeventretrycount
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      sendEventRetryCount: string;
      /**
       * @documentation
       * [
       * "`sendEventResolution` attribute",
       * "***",
       * "current video resolution string - "0x0@0fps" for unknown and not streaming, WxH@Rfps where W is width, H is height and R is a frame rate when the valid video source"
       * ]
       * @name sendeventresolution
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      sendEventResolution: string;
      /**
       * @documentation
       * [
       * "`sendEventSnapShotStatus` attribute",
       * "***",
       * "current state of the still image associated with the current source selection numeric - 0 not shown, 1 -currently shown, 2 - in error"
       * ]
       * @name sendeventsnapshotstatus
       * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
       * @attributeType "Join"
       */
      sendEventSnapShotStatus: string;
      /**
       * @documentation
       * [
       * "`sendEventSnapShotLastUpdateTime` attribute",
       * "***",
       * "the timestamp of  the last update time of the still image associated with the current source selection string - serial in RFC 3339 format"
       * ]
       * @name sendeventsnapshotlastupdatetime
       * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
       * @attributeType "Join"
       */
      sendEventSnapShotLastUpdateTime: string;

}
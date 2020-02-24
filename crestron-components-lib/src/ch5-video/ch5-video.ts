// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory, subscribeState, unsubscribeState, unsubscribeStateScript } from "../ch5-core";
import { ICh5VideoAttributes } from "../_interfaces/ch5-video/i-ch5-video-attributes";
import { TDimension, TReceiveState, TSnapShotSignalName } from "../_interfaces/ch5-video/types";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { Ch5VideoEventHandler, ESVGIcons } from "./ch5-video-event-handler";
import { IPUBLISHEVENT, IBACKGROUND } from '../_interfaces/ch5-video/types/t-ch5-video-publish-event-request';
import { TCh5ProcessUriParams } from "../_interfaces/ch5-common/types/t-ch5-process-uri-params";
import { Observable, Subscription } from "rxjs";
import { aspectRatio } from './ch5-video-constants';
import { Ch5VideoSubscription } from "./ch5-video-subscription";
import { isSafariMobile } from "../ch5-core/utility-functions/is-safari-mobile";
import { Ch5VideoSnapshot } from "./ch5-video-snapshot";
import { getScrollableParent } from "../ch5-core/get-scrollable-parent";
import isNil from "lodash/isNil";

export type TSignalType = Ch5Signal<string> | Ch5Signal<number> | Ch5Signal<boolean> | null;

export type TSignalTypeT = string | number | boolean | any;

/**
 * COMPONENT ATTRIBUTES
 *
 * - indexId
 * - userId
 * - snapShotUserId
 * - password
 * - snapShotPassword
 * - aspectRatio
 * - stretch
 * - url
 * - sourceType
 * - snapShotUrl
 * - size
 * - snapshotRefreshRate
 * - sendEventSnapShotUrl
 * - sendEventOnClick
 * - sendEventSelectionChange
 * - sendEventSelectionSourceType
 * - sendEventSelectionURL
 * - sendEventErrorCode
 * - sendEventErrorMessage
 * - sendEventRetryCount
 * - sendEventResolution
 * - sendEventSnapShotStatus
 * - sendEventSnapShotLastUpdateTime
 * - receiveStateVideoCount
 * - receiveStateSnapShotURL
 * - receiveStateUrl
 * - receiveStatePlay
 * - receiveStateSelect
 * - receiveStateSourceType
 * - receiveStateSnapShotRefreshRate
 * - receiveStateUserId
 * - receiveStateSnapShotUserId
 * - receiveStatePassword
 * - receiveStateSnapShotPassword
 */

export class Ch5Video extends Ch5Common implements ICh5VideoAttributes {

    public static PLAY_LABEL: string = 'Play';
    public static STOP_LABEL: string = 'Stop';
    public static BUTTON_TYPE: string = 'default';
    public static EVENT_LIST: Observable<Event>;
    public static videoControls = 'videoControls';
    public static VIDEO_STYLE_CLASS: string = 'ch5-video__display__color';

    public primaryVideoCssClass = 'ch5-video';
    public preLoaderCssClass = 'preLoader';
    public loaderCssClass = 'loader';
    public fullScreenStyleClass = 'fullScreenStyle'
    public showControl: string = 'show-control';
    public fullScreenBodyClass: string = 'ch5-video-fullscreen';
    private videoErrorMessages = new Map<number, string>();
    private snapShotInfoMap = new Map();

    private appBgTimer: number = 0;
    private wasAppBackGrounded: boolean = false;
    private appCurrentStatus: boolean = false;
    private scrollableElm: HTMLElement = {} as HTMLElement;
    private isSlidemoved: boolean = false;

    /**
     * EVENTS
     * 
     * error - inherited
     */

    /**
     * Event error: error on loading the video
     */
    public errorEvent: Event;

    /**
     * CH5 Unique ID
     */
    public ch5UId: number = 0;

    /**
     * SVG Icons for the controls
     */

    private exitFullScreenIcon = ESVGIcons.EXIT_FULLSCREEN_ICON;

    private fullScreenIcon = ESVGIcons.FULLSCREEN_ICON;

    /**
     * Define HTML Elements
     */
    private vid: HTMLCanvasElement = {} as HTMLCanvasElement;
    private videoCanvasElement: HTMLElement = {} as HTMLElement;
    private vidControlPanel: HTMLElement = {} as HTMLElement;
    private controlFullScreen: HTMLElement = {} as HTMLElement;
    private fullScreenOverlay: HTMLElement = {} as HTMLElement;
    private snapShotTimer: any;
    private exitTimer: number = 0;

    private subscriptionEventList: Subscription[] = [];
    private context: any;
    private sizeObj: TDimension = { width: 0, height: 0 };
    private position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
    private retryCount = 0;
    private videoResponseSubscriptionId: string = "";
    private videoStopSubscriptionId: string = "";
    private videoResizeSubscriptionId: string = "";
    private slidemoveSubscriptionId: string = "";
    private touchendSubscriptionId: string = "";
    private slidechangeSubscriptionId: string = "";
    private selectObject: TReceiveState = {
        "subscriptionIds": {
            "url": "",
            "type": "",
            "user": "",
            "videoPass": "",
            "snapShotUrl": "",
            "snapShotRefreshRate": "",
            "snapShotUser": "",
            "snapShotPass": ""
        },
        "values": {
            "url": "",
            "type": "",
            "user": "",
            "videoPass": "",
            "snapShotUrl": "",
            "snapShotRefreshRate": "",
            "snapShotUser": "",
            "snapShotPass": ""
        }
    };

    /**
     * Number of seconds between each call to the image URL in order to get new data. If 0, no refresh will be done.
     *
     * @type {string}
     * @private
     */
    private _snapShotRefreshRate: string = "5";

    /**
     * Provides the name of the offset identifier to substituted with 0 based index of the item in list 
     * within the signal names provided in other attributes surrounded by {{ }} delimiters.
     * 
     * @type {string}
     * @private
     */
    private _indexId: string = '0';

    /**
     * Userid to access the video along with password
     *
     * @type {string}
     * @private
     */
    private _userId: string = '';

    /**
     * Userid to access the snapshot image along with password
     *
     * @type {string}
     * @private
     */
    private _snapShotUserId: string = '';

    /**
     * Password to access the video along with Userid
     *
     * @type {string}
     * @private
     */
    private _password: string = '';

    /**
     * Password to access the snapshot image along with Userid
     *
     * @type {string}
     * @private
     */
    private _snapShotPassword: string = '';

    /**
     * Sets the ratio of width to height of the video.  
     * Width and height of the component to be controlled by css style classes.  
     * Values are 16:9 (default), 4:3, and custom.  When size of container is not match the aspect ratio, 
     * the full height or the full width should be used and the dimension that is not full should be centered.
     *
     * @type {string}
     * @private
     */
    private _aspectRatio: string = '16:9';

    /**
     * Default false.  When true, video will be displayed in the whole component.  
     * When false, video will be displayed as letter or pillar box based upon the aspect ratio of the video 
     * feed and the size of the component.  Note: this attribute is independent of aspectRatio. 
     *
     * @type {string}
     * @private
     */
    private _stretch: string = "false";

    /**
     * A Snapshot of the video, if any.
     *
     * @type {string}
     * @private
     */
    private _snapShotUrl: string = '';

    /**
     * The source path of the video.
     *
     * @type {string}
     * @private
     */
    private _url: string = '';

    /**
     * Video Source type can be Network, HDMI or DM.
     *
     * @type {string}
     * @private
     */
    private _sourceType: string = 'Network';

    /**
     * The display size for the video. The default size will be small if not mentioned.
     *
     * @type {string}
     * @private
     */
    private _size: string = 'large';

    /**
     * The defines zIndex of the video. It works only with picture-in-picture(pip) mode.
     *
     * @type {string}
     * @private
     */
    private _zIndex: string = '0';

    /**
     * Controls that can manage the video
     *
     * @type {string}
     * @private
     */
    private _controls: string = 'false';

    /**
     * The timestamp of the last update time of the snapshot associated with the current source selection.
     */
    private _sendEventSnapShotLastUpdateTime: string = '';

    /**
     * Defines the maximum number of videos avaialble.
     */
    private _receiveStateVideoCount: string = '';

    /**
     * When defined, will play video only when the value is true, will stop video when value is false.  
     * If not defined, the video will play whenever the component is visible.  
     * If defined and value of false, display background of ch5-video--nosource css class.
     */
    private _receiveStatePlay: string = '';

    /**
     * When defined, will play 0-based index of the video source list. 
     * Value of < 0 or > 31 will select no video to play Value of 0 to 31 will play the selected video source 
     * provided the video source type (see receiveStateSourceType) is valid. 
     * When not defined, the first video source defined (equivalent of index 0) in the list will be played.
     */
    private _receiveStateSelect: string = '';

    /**
     * Provides the snapshot URL to use when selection changes to INDEX value.
     */
    private _receiveStateSnapShotURL: string = '';

    /**
     * Default empty. Defines the video URL as an attribute.
     */
    private _receiveStateUrl: string = '';

    /**
     * Provides the video source type when the selection changes to INDEX value.
     */
    private _receiveStateSourceType: string = '';

    /**
     * Defines the refresh rate for a snapshot url.  0 indicates no refresh. 
     */
    private _receiveStateSnapShotRefreshRate: string = '';

    /**
     * Provides the password of the camera
     */
    private _receiveStateUserId: string = '';

    /**
     * Provides the password of the camera
     */
    private _receiveStateSnapShotUserId: string = '';

    /**
     * Provides the password of the camera
     */
    private _receiveStatePassword: string = '';

    /**
     * Provides the password of the camera
     */
    private _receiveStateSnapShotPassword: string = '';

    /**
     * Subcribe the receiveStatePlay Signal
     */
    private subReceiveStatePlay: string = '';

    /**
     * Subcribe the receiveStateUrl Signal
     */
    private subReceiveStateUrl: string = '';

    /**
     * Subcribe the receiveStateSelect Signal
     */
    private subReceiveStateSelect: string = '';

    /**
     * Subcribe the receiveStateSourceType Signal
     */
    private subReceiveStateSourceType: string = '';

    /**
     * Subcribe the receiveStateSnapShotUrl Signal
     */
    private subReceiveStateSnapShotUrl: string = '';

    /**
     * Subcribe the receiveStateSnapShotRefreshRate Signal
     */
    private subReceiveStateSnapShotRefreshRate: string = '';

    /**
     * Subcribe the receiveStateUserId Signal
     */
    private subReceiveStateUserId: string = '';

    /**
     * Subcribe the receiveStateSnapShotUserId Signal
     */
    private subReceiveStateSnapShotUserId: string = '';

    /**
     * Subcribe the receiveStatePassword Signal
     */
    private subReceiveStatePassword: string = '';

    /**
     * Subcribe the receiveStateSnapShotPassword Signal
     */
    private subReceiveStateSnapShotPassword: string = '';

    /**
     * Subcribe the receiveStateVideoCount Signal
     */
    private subReceiveStateVideoCount: string = '';

    /**
     * X-Axis Position of the CH5-Video
     */
    private videoTop: number = -1;

    /**
     * The name of the boolean signal that will be sent to native on click or tap event (mouse or finger up and down in
     * a small period of time)
     *
     * HTML attribute name: sendEventOnClick or sendeventonclick
     */
    private _sigNameSendOnClick: string = '';

    /**
     * Y-Axis Position of the CH5-Video
     */
    private videoLeft: number = -1;
    private interval: any;
    private responseObj: any = [];
    private firstTime: boolean = true;
    private lastUpdatedStatus: string = '';
    private autoHideControlPeriod: number = 10;
    private originalPotraitVideoProperties: any = [];
    private originalLandscapeVideoProperties: any = [];
    private originalVideoProperties: any = [];
    private oldReceiveStateSelect: number = -1;
    private receiveStateAttributeCount: number = 0;
    private requestID: number = 0;
    private lastResponseStatus: string = '';
    private isSwipeInterval: any;
    private backgroundInterval: any;
    private isSwipeStarted = false;
    private isVideoPublished = false;
    private isOrientationChanged: boolean = false;
    private isPositionChanged: boolean = false;
    private isFullScreen: boolean = false;
    private isImageReady: boolean = false;
    private isVideoReady: boolean = false;
    private isInitialized: boolean = false;
    private playValue: boolean = true;
    private fromReceiveStatePlay: boolean = false;

    private _sigNameSelectionChange: string = '';
    private _sigNameSelectionSourceType: string = '';
    private _sigNameSnapShotUrl: string = '';
    private _sigNameSelectionUrl: string = '';
    private _sigNameEventState: string = '';
    private _sigNameErrorCode: string = '';
    private _sigNameErrorMessage: string = '';
    private _sigNameRetryCount: string = '';
    private _sigNameResolution: string = '';
    private _sigNameSnapShotStatus: string = '';
    private _sigNameSnapShotLastUpdateTime: string = '';
    private isPotraitMode: boolean = false;
    private lastLoadedImage: any;
    private isIntersectionObserve: boolean = false;
    private vidleft: number = 0;
    private vidTop: number = 0;
    private isAlphaBlend: boolean = true;
    private controlTimer: any;
    private controlTop: number = -1;
    private controlLeft: number = -1;
    private scrollTimer: number = 0;
    private isExitFullscreen: boolean = false;
    private oldResponseStatus: string = '';
    private oldResponseId: number = 0;

    private subsCsigAppCurrentSate: string = '';
    private subsCsigAppBackgrounded: string = '';
    private receivedStateSelect: number = 0;
    private vCountFlag: boolean = false;
    private maxVideoCount: number = 0;
    private exitFlagStartedResp: any;
    private exitFlagResizedResp: any;

    /**
     * Protocol for authentication in order to get the image
     *
     * @type {string}
     */
    private _protocol: string = '';

    /**
     * CONSTRUCTOR
     */
    public constructor() {
        super();

        // custom release event
        this.errorEvent = new CustomEvent("error", {
            bubbles: true,
            cancelable: false,
            detail: "ch5-video triggered constructor",
        });
        this.dispatchEvent(this.errorEvent);
        this.isInitialized = true;
        this.setErrorMessages();
        this.isPotraitMode = Ch5VideoEventHandler.isPortrait();
        this.videoResponseSubscriptionId = subscribeState('o', 'Csig.video.response',
                this.videoResponse.bind(this), this.errorResponse.bind(this));
    }

    /**
     * Set the video error messages for the respective error code or status code
     */
    private setErrorMessages() {
        this.videoErrorMessages.set(1, "Miscellaneous transient issue");
        this.videoErrorMessages.set(2, "Connection timeout");
        this.videoErrorMessages.set(3, "No input sync");
        this.videoErrorMessages.set(-1, "Miscellaneous error");
        this.videoErrorMessages.set(-2, "Hostname could not be resolved");
        this.videoErrorMessages.set(-3, "Unsupported source type for this platform");
        this.videoErrorMessages.set(-4, "Connection timeout");
        this.videoErrorMessages.set(-5, "Invalid credentials");
        this.videoErrorMessages.set(-6, "Unsupported streaming protocol");
        this.videoErrorMessages.set(-7, "Unsupported codec");
        this.videoErrorMessages.set(-1001, "Credentials required");
        this.videoErrorMessages.set(-1002, "Hostname invalid");
        this.videoErrorMessages.set(-1003, "Unsupported codec");
        this.videoErrorMessages.set(-9001, "Unsupported source type");
        this.videoErrorMessages.set(-9002, "Invalid URL");
        this.videoErrorMessages.set(-9003, "Request for greater than maximum simultaneous sessions per source type");
        this.videoErrorMessages.set(-9004, "Request for greater than maximum simultaneous sessions per device");
    }

    /**
     * To subscribe receive state attributes
     * @param index 
     */
    private subscribeVideos(index: string) {
        this.hideFullScreenIcon();
        this.sendEvent(this.sendEventSelectionChange, index, 'number');
        let responseCount = 0;
        if (this.hasAttribute("receivestateurl")) {
            const rsVURL = this.getAttribute("receivestateurl") as string;
            let selectObjectUrl: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectUrl = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestateurl', rsVURL, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.url = String(selectObjectUrl);
            this.selectObject.subscriptionIds.url = subscribeState('s', String(selectObjectUrl), (resp: any) => {
                if (resp) {
                    this.sendEvent(this.sendEventSelectionURL, this.url, 'string');
                    this.url = resp;
                } else if (this.hasAttribute('url')) {
                    this.url = this.getAttribute('url') as string;
                } else {
                    this.url = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('url')) {
                this.url = this.getAttribute('url') as string;
            } else {
                this.url = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesourcetype")) {
            const rsVSType = this.getAttribute("receivestatesourcetype") as string;
            let selectObjectSourceType: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectSourceType = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestatesourcetype', rsVSType, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.type = String(selectObjectSourceType);
            this.selectObject.subscriptionIds.type = subscribeState('s', String(selectObjectSourceType), (resp: any) => {
                if (resp) {
                    this.sourceType = resp;
                    this.sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                } else if (this.hasAttribute('sourcetype')) {
                    this.sourceType = this.getAttribute('sourcetype') as string;
                } else {
                    this.sourceType = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('sourcetype')) {
                this.sourceType = this.getAttribute('sourcetype') as string;
            } else {
                this.sourceType = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestateuserid")) {
            const rsVUserId = this.getAttribute("receivestateuserid") as string;
            let selectObjectUserId: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectUserId = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestateuserid', rsVUserId, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.user = String(selectObjectUserId);
            this.selectObject.subscriptionIds.user = subscribeState('s', String(selectObjectUserId), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.userId = resp.trim();
                } else if (this.hasAttribute('userid')) {
                    this.userId = this.getAttribute('userid') as string;
                } else {
                    this.userId = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('userid')) {
                this.userId = this.getAttribute('userid') as string;
            } else {
                this.userId = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatepassword")) {
            const rsVPassword = this.getAttribute("receivestatepassword") as string;
            let selectObjectPassword: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectPassword = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestatepassword', rsVPassword, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.videoPass = String(selectObjectPassword);
            this.selectObject.subscriptionIds.videoPass = subscribeState('s', String(selectObjectPassword), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.password = resp.trim();
                } else if (this.hasAttribute('password')) {
                    this.password = this.getAttribute('password') as string;
                } else {
                    this.password = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('password')) {
                this.password = this.getAttribute('password') as string;
            } else {
                this.password = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshoturl")) {
            const rsSIURL = this.getAttribute("receivestatesnapshoturl") as string;
            let selectObjectSnapShotUrl: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectSnapShotUrl = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestatesnapshoturl', rsSIURL, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotUrl = String(selectObjectSnapShotUrl);
            this.selectObject.subscriptionIds.snapShotUrl = subscribeState('s', String(selectObjectSnapShotUrl), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.snapShotUrl = resp.trim();
                    this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
                } else if (this.hasAttribute('snapshoturl')) {
                    this.snapShotUrl = this.getAttribute('snapshoturl') as string;
                } else {
                    this.snapShotUrl = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshoturl')) {
                this.snapShotUrl = this.getAttribute('snapshoturl') as string;
            } else {
                this.snapShotUrl = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshotrefreshrate")) {
            const rsSIRefreshRate = this.getAttribute("receivestatesnapshotrefreshrate") as string;
            let selectObjectSnapShotRefreshRate: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectSnapShotRefreshRate = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestatesnapshotrefreshrate', rsSIRefreshRate, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotRefreshRate = String(selectObjectSnapShotRefreshRate);
            this.selectObject.subscriptionIds.snapShotRefreshRate = subscribeState('n', String(selectObjectSnapShotRefreshRate), (resp: any) => {
                if (resp) {
                    this.snapShotRefreshRate = resp;
                } else if (this.hasAttribute('snapshotrefreshrate')) {
                    this.snapShotRefreshRate = this.getAttribute('snapshotrefreshrate') as string;
                } else {
                    this.snapShotRefreshRate = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotrefreshrate')) {
                this.snapShotRefreshRate = this.getAttribute('snapshotrefreshrate') as string;
            } else {
                this.snapShotRefreshRate = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshotuserid")) {
            const rsSIUserId = this.getAttribute("receivestatesnapshotuserid") as string;
            let selectObjectSnapShotUserId: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectSnapShotUserId = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestatesnapshotuserid', rsSIUserId, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotUser = String(selectObjectSnapShotUserId);
            this.selectObject.subscriptionIds.snapShotUser = subscribeState('s', String(selectObjectSnapShotUserId), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.snapShotUserId = resp.trim();
                } else if (this.hasAttribute('snapshotuserid')) {
                    this.snapShotUserId = this.getAttribute('snapshotuserid') as string;
                } else {
                    this.snapShotUserId = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotuserid')) {
                this.snapShotUserId = this.getAttribute('snapshotuserid') as string;
            } else {
                this.snapShotUserId = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshotpassword")) {
            const rsSIPassword = this.getAttribute("receivestatesnapshotpassword") as string;
            let selectObjectSnapShotPassword: string | number | undefined = 0;
            if (this.indexId !== null) {
                // replace indexId in attributes
                selectObjectSnapShotPassword = Ch5VideoSubscription
                    .getNewSignalName(this, 'receivestatesnapshotpassword', rsSIPassword, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotPass = String(selectObjectSnapShotPassword);
            this.selectObject.subscriptionIds.snapShotPass = subscribeState('s', String(selectObjectSnapShotPassword), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.snapShotPassword = resp.trim();
                } else if (this.hasAttribute('snapshotpassword')) {
                    this.snapShotPassword = this.getAttribute('snapshotpassword') as string;
                } else {
                    this.snapShotPassword = '';
                }
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotpassword')) {
                this.snapShotPassword = this.getAttribute('snapshotpassword') as string;
            } else {
                this.snapShotPassword = '';
            }
            responseCount++;
            this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }
    }

    private matchAttributeResponse(attributeCount: number, responseCount: number) {
        if (attributeCount === responseCount) {
            if (!this.context) {
                return;
            }
            this.vid.width = this.sizeObj.width;
            this.vid.height = this.sizeObj.height;
            this.context = this.vid.getContext("2d");
            this.calculation(this.vid);
            if (this.elementIsInViewPort) {
                setTimeout(() => {
                    this.sendEvent(this.sendEventSnapShotLastUpdateTime, this.rfc3339TimeStamp(), 'string');
                    this.calculatePositions();
                    if (this.elementIntersectionEntry.intersectionRatio >= 1) {
                        this.lastResponseStatus = 'stopped';
                        this.isVideoReady = false;
                        this.lastUpdatedStatus = "stop";
                        this.isExitFullscreen = false;
                        this.publishBackgroundEvent();
                        this.publishVideoEvent("start");
                    }
                }, 500);
                this.switchSnapShotLoad(this.receivedStateSelect);
            }
        }
    }

    private switchSnapShotLoad(activeIndex: number) {
        for (let idx = 0; idx < this.maxVideoCount; idx++) {
            const sData: Ch5VideoSnapshot = this.snapShotInfoMap.get(idx);
            if (activeIndex === idx) {
                if (sData.isSnapShotLoading) {
                    if (!!sData.snapShotImage) {
                        this.lastLoadedImage = sData.snapShotImage;
                        this.drawSnapShot(this.lastLoadedImage);
                    }
                }
            } else {
                if (!sData.isSnapShotLoading) {
                    sData.startLoadingSnapShot();
                }
            }
        }
    }


    /**
     * Publish send event
     * 
     * @param signalName name of the signal or join nmber
     * @param signalValue signal value
     * @param signalType type
     */
    private sendEvent(signalName: string, signalValue: TSignalTypeT, signalType: TSignalTypeT) {

        this.info("sendEventPublish : " + signalName + ", " + signalValue + ", " + signalType);
        switch (signalType) {
            case 'boolean':
                let sigVideoStateBoolean: Ch5Signal<boolean> | null = null;
                if (signalName) {
                    sigVideoStateBoolean = Ch5SignalFactory.getInstance().getBooleanSignal(signalName);
                    if (sigVideoStateBoolean !== null) {
                        sigVideoStateBoolean.publish(true);
                        sigVideoStateBoolean.publish(false);
                    }
                }
                break;
            case 'string':
                let sigVideoStateString: Ch5Signal<string> | null = null;
                if (signalName) {
                    sigVideoStateString = Ch5SignalFactory.getInstance().getStringSignal(signalName);
                    if (sigVideoStateString !== null) {
                        sigVideoStateString.publish(signalValue);
                    }
                }
                break;
            case 'number':
                let sigVideoStateNumber: Ch5Signal<number> | null = null;
                if (signalName) {
                    sigVideoStateNumber = Ch5SignalFactory.getInstance().getNumberSignal(signalName);
                    if (sigVideoStateNumber !== null) {
                        sigVideoStateNumber.publish(parseInt(signalValue, 0));
                    }
                }
                break;
        }
    }

    /**
     * To unsubscribe receive state attributes
     * @param selectObject 
     */
    private unSubscribeVideos(selectObject: TReceiveState) {
        if (selectObject.subscriptionIds.url) {
            unsubscribeState('s', selectObject.values.url, selectObject.subscriptionIds.url);
        }

        if (selectObject.subscriptionIds.type) {
            unsubscribeState('s', selectObject.values.type, selectObject.subscriptionIds.type);
        }

        if (selectObject.subscriptionIds.user) {
            unsubscribeState('s', selectObject.values.user, selectObject.subscriptionIds.user);
        }

        if (selectObject.subscriptionIds.videoPass) {
            unsubscribeState('s', selectObject.values.videoPass, selectObject.subscriptionIds.videoPass);
        }

        if (selectObject.subscriptionIds.snapShotUrl) {
            unsubscribeState('s', selectObject.values.snapShotUrl, selectObject.subscriptionIds.snapShotUrl);
        }

        if (selectObject.subscriptionIds.snapShotRefreshRate) {
            unsubscribeState('n', selectObject.values.snapShotRefreshRate, selectObject.subscriptionIds.snapShotRefreshRate);
        }

        if (selectObject.subscriptionIds.snapShotUser) {
            unsubscribeState('s', selectObject.values.snapShotUser, selectObject.subscriptionIds.snapShotUser);
        }

        if (selectObject.subscriptionIds.snapShotPass) {
            unsubscribeState('s', selectObject.values.snapShotPass, selectObject.subscriptionIds.snapShotPass);
        }
    }

    /**
     * Set canvas width and height when stretch is true
     * @param width Width of the canvas
     * @param height Height of the canvas
     */
    private setCanvasDimensions(width: number, height: number) {
        this.vid.width = width;
        this.vid.height = height;
    }

    /**
     * Initializes the elements of ch5-video
     */
    private initializeVideo() {
        this.createCanvas();
        this.drawCanvas(this.vid);
        this.initAttributes();
        this.cacheComponentChildrens();
        this.attachEventListeners();
        this.setAttribute("id", this.getCrId());
        const uID = this.getCrId().split('cr-id-');
        this.ch5UId = parseInt(uID[1], 0);
    }

    /**
     * Create the Video JSON object to start the video
     * @param actionStatus 
     * @param xPosition 
     * @param yPosition 
     * @param width 
     * @param height 
     * @param zIndex 
     */
    public videoStartObjJSON(actionStatus: string, uId: number, xPosition: number, yPosition: number,
        width: number, height: number, zIndex: number, alphaBlend: boolean, startTime: number, endTime: number): IPUBLISHEVENT {
        return {
            "action": actionStatus,
            "id": uId,
            "credentials": {
                "userid": this.userId,
                "password": this.password
            },
            "source": {
                "type": this.sourceType,
                "url": this.url
            },
            "location": {
                "top": Math.ceil(xPosition),
                "left": Math.ceil(yPosition),
                "width": Math.ceil(width),
                "height": Math.ceil(height),
                "z": zIndex
            },
            "alphablend": alphaBlend, // optional, default true, false indicates video displayed above the HTML
            "starttime": startTime, // milliseconds since 1-1-1970 UTC
            "endtime": endTime, // 2000 msecs later
            "timing": "linear" // only linear supported initially
        };
    }

    /**
     * Create the Video JSON object to stop the video
     * @param actionStatus 
     * @param uId 
     * @param xPosition 
     * @param yPosition 
     * @param width 
     * @param height 
     * @param zIndex 
     */
    public videoStopObjJSON(actionStatus: string, uId: number): IPUBLISHEVENT {
        return {
            "action": actionStatus,
            "id": uId
        };
    }

    /**
     * Create the Video JSON object to send the video for background
     * @param actionStatus 
     * @param xPosition 
     * @param yPosition 
     * @param width 
     * @param height 
     */
    public videoBGObjJSON(actionStatus: string, xPosition: number, yPosition: number,
        width: number, height: number): IBACKGROUND {
        return {
            "action": actionStatus,
            "id": this.ch5UId,
            "top": Math.ceil(xPosition),
            "left": Math.ceil(yPosition),
            "width": Math.ceil(width),
            "height": Math.ceil(height)
        };
    }


    /**
     * Getter and Setter functions for each attribute.
     */

    public get indexId(): string {
        return this._indexId;
    }
    public set indexId(value: string) {
        if (isNil(value)) {
            return;
        }

        this._indexId = value;
    }

    public get aspectRatio(): string {
        return this._aspectRatio;
    }

    public set aspectRatio(value: string) {
        if (isNil(value)) {
            return;
        }
        this._aspectRatio = value;
    }

    public get stretch(): string {
        return this._stretch;
    }

    public set stretch(value: string) {
        if (isNil(value)) {
            return;
        }
        this._stretch = value;
    }

    public get userId(): string {
        return this._userId;
    }

    public set userId(value: string) {
        if (isNil(value) || this._userId === value) {
            return;
        }
        this._userId = value;
    }

    public get snapShotUserId(): string {
        return this._snapShotUserId;
    }
    public set snapShotUserId(value: string) {
        if (isNil(value) || this._snapShotUserId === value) {
            return;
        }
        this._snapShotUserId = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(password: string) {
        if (isNil(password) || this._password === password) {
            return;
        }
        this._password = password;
    }

    public get snapShotPassword(): string {
        return this._snapShotPassword;
    }

    public set snapShotPassword(value: string) {
        if (isNil(value) || this._snapShotPassword === value) {
            return;
        }
        this._snapShotPassword = value;
    }

    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        if (isNil(value) || this._url === value) {
            return;
        }
        this._url = value;
    }

    public get zIndex(): string {
        return this._zIndex;
    }

    public set zIndex(value: string) {
        if (isNil(value) || this._zIndex === value) {
            return;
        }
        this._zIndex = value;
    }

    public get controls(): string {
        return this._controls;
    }

    public set controls(value: string) {
        if (isNil(value) || this._controls === value) {
            return;
        }
        this._controls = value;
    }

    public get sourceType(): string {
        return this._sourceType;
    }

    public set sourceType(value: string) {
        if (isNil(value)) {
            value = 'Network';
        }
        this._sourceType = value;
    }

    public get snapShotUrl(): string {
        return this._snapShotUrl;
    }

    public set snapShotUrl(value: string) {
        if (isNil(value) || this._snapShotUrl === value) {
            return;
        }
        this._snapShotUrl = value;
    }

    public get size(): string {
        return this._size;
    }

    public set size(value: string) {
        if (isNil(value) || this._size === value) {
            return;
        }
        this._size = value;
    }

    public get snapShotRefreshRate(): string {
        return this._snapShotRefreshRate;
    }

    public set snapShotRefreshRate(value: string) {
        this._snapShotRefreshRate = value;
    }

    public set protocol(protocol: string) {
        if (isNil(protocol) || this._protocol === protocol) {
            return;
        }
        this._protocol = protocol;
    }

    public get protocol(): string {
        return this._protocol;
    }

    /**
     * Getters and Setters for Signals
     */

    public set sendEventOnClick(value: string) {
        this.info('set sendEventOnClick(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSendOnClick)) {
            this._sigNameSendOnClick = value;
            this.setAttribute('sendeventonclick', value);
        }
    }

    public get sendEventOnClick(): string {
        return this._sigNameSendOnClick;
    }

    public get sendEventState(): string {
        return this._sigNameEventState;
    }
    public set sendEventState(value: string) {
        this.info('set sendEventState(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameEventState)) {
            this._sigNameEventState = value;
            this.setAttribute('sendeventstate', value);
        }
    }

    public get sendEventSelectionChange(): string {
        return this._sigNameSelectionChange;
    }

    public set sendEventSelectionChange(value: string) {
        this.info('Set sendEventSelectionChange(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSelectionChange)) {
            this._sigNameSelectionChange = value;
            this.setAttribute('sendeventselectionchange', value);
        }
    }

    public get sendEventSelectionSourceType(): string {
        return this._sigNameSelectionSourceType;
    }

    public set sendEventSelectionSourceType(value: string) {
        this.info('Set sendEventSelectionSourceType(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSelectionSourceType)) {
            this._sigNameSelectionSourceType = value;
            this.setAttribute('sendeventselectionsourcetype', value);
        }
    }

    public get sendEventSelectionURL(): string {
        return this._sigNameSelectionUrl;
    }

    public set sendEventSelectionURL(value: string) {
        this.info('Set sendEventSelectionURL(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSelectionUrl)) {
            this._sigNameSelectionUrl = value;
            this.setAttribute('sendeventselectionurl', value);
        }
    }

    public get sendEventSnapShotURL(): string {
        return this._sigNameSnapShotUrl;
    }

    public set sendEventSnapShotURL(value: string) {
        this.info('Set sendEventSnapShotURL(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSnapShotUrl)) {
            this._sigNameSnapShotUrl = value;
            this.setAttribute('sendeventsnapshoturl', value);
        }
    }

    public get sendEventErrorCode(): string {
        return this._sigNameErrorCode;
    }

    public set sendEventErrorCode(value: string) {
        this.info('Set sendEventErrorCode(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameErrorCode)) {
            this._sigNameErrorCode = value;
            this.setAttribute('sendeventerrorcode', value);
        }
    }

    public get sendEventErrorMessage(): string {
        return this._sigNameErrorMessage;
    }

    public set sendEventErrorMessage(value: string) {
        this.info('Set sendEventErrorMessage(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameErrorMessage)) {
            this._sigNameErrorMessage = value;
            this.setAttribute('sendeventerrormessage', value);
        }
    }

    public get sendEventRetryCount(): string {
        return this._sigNameRetryCount;
    }

    public set sendEventRetryCount(value: string) {
        this.info('Set sendEventRetryCount(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameRetryCount)) {
            this._sigNameRetryCount = value;
            this.setAttribute('sendeventretrycount', value);
        }
    }

    public get sendEventResolution(): string {
        return this._sigNameResolution;
    }
    public set sendEventResolution(value: string) {
        this.info('Set sendEventResolution(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameResolution)) {
            this._sigNameResolution = value;
            this.setAttribute('sendeventresolution', value);
        }
    }

    public get sendEventSnapShotStatus(): string {
        return this._sigNameSnapShotStatus;
    }

    public set sendEventSnapShotStatus(value: string) {
        this.info('Set sendEventSnapShotStatus(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSnapShotStatus)) {
            this._sigNameSnapShotStatus = value;
            this.setAttribute('sendeventsnapshotstatus', value);
        }
    }

    public get sendEventSnapShotLastUpdateTime(): string {
        return this._sendEventSnapShotLastUpdateTime;
    }

    public set sendEventSnapShotLastUpdateTime(value: string) {
        this.info('Set sendEventSnapShotLastUpdateTime(\'' + value + '\')');
        this._sendEventSnapShotLastUpdateTime = value;
        if (('' !== value) && (value !== this._sigNameSnapShotLastUpdateTime)) {
            this._sigNameSnapShotLastUpdateTime = value;
            this.setAttribute('sendeventsnapshotlastupdatetime', value);
        }
    }

    public get receiveStateVideoCount(): string {
        return this._receiveStateVideoCount;
    }

    public set receiveStateVideoCount(value: string) {
        this.info('Set receiveStateVideoCount(\'' + value + '\')');
        this._receiveStateVideoCount = value;

        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateVideoCount !== undefined
            && this._receiveStateVideoCount !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateVideoCount);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
                .getNumberSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateVideoCount);
            }
        }

        // setup new subscription.
        const sigNameStateVideoCount: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateVideoCount);
        const sigStateVideoCount: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(sigNameStateVideoCount);
        if (sigStateVideoCount) {
            this.subReceiveStateVideoCount = sigStateVideoCount.subscribe((newValue: any) => {
                this.info('receiveStateVideoCount Signal Subscribe Value: ' + newValue);
                if (!this.vCountFlag) {
                    this.maxVideoCount = parseInt(newValue, 0);
                    this.getAllSnapShotData(newValue);
                }
            });
        }
    }

    public get receiveStatePlay(): string {
        return this._attributeValueAsString('receivestateplay');
    }

    public set receiveStatePlay(value: string) {
        this.info('Set receiveStatePlay(\'' + value + '\')');
        this._receiveStatePlay = value;
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStatePlay !== undefined
            && this._receiveStatePlay !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePlay);
            const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
                .getBooleanSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStatePlay);
            }
        }

        // setup new subscription.
        const sigNameStatePlay: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePlay);
        const sigStatePlay: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(sigNameStatePlay);
        if (sigStatePlay) {
            this.subReceiveStatePlay = sigStatePlay.subscribe((newValue: any) => {
                this.info('receiveStatePlay Signal Subscribe Value: ' + newValue);
                newValue = !this.isIntersectionObserve ? null : newValue;
                if (this.playValue === newValue) {
                    return;
                }
                this.fromReceiveStatePlay = true;
                this.playValue = newValue;
                this.isExitFullscreen = false;
                if (newValue) {
                    if (this.lastLoadedImage) {
                        this.drawSnapShot(this.lastLoadedImage);
                        this.sendEvent(this.sendEventSnapShotStatus, 1, 'number');
                    }
                    this.isVideoReady = false;
                    this.lastUpdatedStatus = "stop";
                    if (this.elementIntersectionEntry.intersectionRatio >= 1 && !this.isFullScreen) {
                        this.publishVideoEvent("start");
                    } else if (this.isFullScreen) {
                        this.publishVideoEvent("start");
                    }
                } else {
                    this.isVideoReady = true;
                    this.lastUpdatedStatus = "start";
                    this.publishVideoEvent("stop");
                    this.loadImageWithAutoRefresh();
                }
            });
        }
    }

    private updateAppBackgroundStatus() {
        if (this.subsCsigAppBackgrounded !== '') {
            unsubscribeState('o', 'Csig.app.background', this.subsCsigAppBackgrounded);
        }
        this.subsCsigAppBackgrounded = subscribeState('o', 'Csig.app.background', (res: any) => {
            this.wasAppBackGrounded = res.isAppBackgrounded;
        });
    }

    private appCurrentBackgroundStatus() {
        if (this.subsCsigAppCurrentSate !== '') {
            unsubscribeState('o', 'Csig.app.background', this.subsCsigAppCurrentSate);
        }
        this.subsCsigAppCurrentSate = subscribeState('o', 'Csig.app.background', (res: any) => {
            this.appCurrentStatus = res.isAppBackgrounded;
        });
    }

    public get receiveStateSelect(): string {
        return this._attributeValueAsString('receivestateselect');
    }



    public set receiveStateSelect(value: string) {
        this.info('Set receiveStateSelect(\'' + value + '\')');
        this._receiveStateSelect = value;
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSelect !== undefined
            && this._receiveStateSelect !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSelect);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
                .getNumberSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateSelect);
            }
        }

        // setup new subscription.
        const sigNameStateSelect: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSelect);
        const sigStateSelect: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(sigNameStateSelect);
        if (sigStateSelect) {
            this.subReceiveStateSelect = sigStateSelect.subscribe((newValue: number) => {
                this.info('receiveStateSelect Signal Subscribe Value: ' + newValue);
                this._receiveStateSelect = newValue.toString();
                if (this.oldReceiveStateSelect !== newValue) {
                    this.oldReceiveStateSelect = newValue;
                    this.receivedStateSelect = newValue;
                    if (newValue >= 0 && newValue < 32) {
                        this.unSubscribeVideos(this.selectObject);
                        this.isVideoReady = false;
                        this.lastUpdatedStatus = "";
                        publishEvent('b', newValue + "", true);
                        publishEvent('b', newValue + "", false);
                        setTimeout(() => {
                            this.subscribeVideos(newValue.toString());
                        });
                    }
                }
            });
        }
    }

    private getAllSnapShotData(videoCount: string) {
        const vCount = parseInt(videoCount, 0);
        if (vCount === 0) {
            return;
        }
        for (let idx = 0; idx < vCount; idx++) {
            const snapShotObject: TSnapShotSignalName = {
                "index": 0,
                "snapShotUrl": "",
                "snapShotRefreshRate": "",
                "snapShotUser": "",
                "snapShotPass": ""
            };
            snapShotObject.index = idx;
            snapShotObject.snapShotUrl = String(Ch5VideoSubscription
                .getNewSignalName(this, 'receivestatesnapshoturl', this.receiveStateSnapShotURL, idx, this.indexId as string));

            snapShotObject.snapShotUser = String(Ch5VideoSubscription
                .getNewSignalName(this, 'receivestateuserid', this.receiveStateSnapShotUserId, idx, this.indexId as string));

            snapShotObject.snapShotPass = String(Ch5VideoSubscription
                .getNewSignalName(this, 'receivestatesnapshotpassword', this.receiveStateSnapShotPassword, idx, this.indexId as string));

            snapShotObject.snapShotRefreshRate = String(Ch5VideoSubscription

                .getNewSignalName(this, 'receivestatesnapshotrefreshrate', this.receiveStateSnapShotRefreshRate, idx, this.indexId as string));

            this.snapShotInfoMap.set(idx, new Ch5VideoSnapshot(snapShotObject));
            const sData = this.snapShotInfoMap.get(idx);
        }
        this.vCountFlag = true;
    }

    public get receiveStateSourceType(): string {
        return this._receiveStateSourceType;
    }
    public set receiveStateSourceType(value: string) {
        this._receiveStateSourceType = value;
        this.info('Set receiveStateSourceType(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSourceType !== undefined && this._receiveStateSourceType !== '') {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSourceType);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSourceType: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSourceType);
        const sigStateSourceType: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStateSourceType);
        if (sigStateSourceType) {
            this.subReceiveStateSourceType = sigStateSourceType.subscribe((newValue: string) => {
                this.info('receiveStateSourceType Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    if (newValue === this.sourceType) {
                        return;
                    }
                    this.sourceType = newValue;
                    this.sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                    setTimeout(() => {
                        if (this.elementIntersectionEntry.intersectionRatio >= 1) {
                            this.lastResponseStatus = 'stopped';
                            this.isVideoReady = false;
                            this.lastUpdatedStatus = "stop";
                            this.isExitFullscreen = false;
                            this.publishVideoEvent("start");
                        }
                    }, 100);
                }
            });
        }
    }

    public get receiveStateSnapShotRefreshRate(): string {
        return this._receiveStateSnapShotRefreshRate;
    }
    public set receiveStateSnapShotRefreshRate(value: string) {
        this._receiveStateSnapShotRefreshRate = value;
        this.info('Set receiveStateSnapShotRefreshRate(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotRefreshRate !== undefined) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotRefreshRate);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
                .getNumberSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotRefreshRate: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotRefreshRate);
        const sigStateSnapShotRefreshRate: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(sigNameStateSnapShotRefreshRate);
        if (sigStateSnapShotRefreshRate) {
            this.subReceiveStateSnapShotRefreshRate = sigStateSnapShotRefreshRate.subscribe((newValue: number) => {
                if (newValue) {
                    this.snapShotRefreshRate = newValue.toString();
                }
            });
        }
    }

    public get receiveStateSnapShotURL(): string {
        return this._receiveStateSnapShotURL;
    }
    public set receiveStateSnapShotURL(value: string) {
        this._receiveStateSnapShotURL = value;
        this.info('Set receiveStateSnapShotURL(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotURL !== undefined
            && this._receiveStateSnapShotURL !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotURL);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotUrl: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotURL);
        const sigStateSnapShotUrl: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStateSnapShotUrl);
        if (sigStateSnapShotUrl) {
            this.subReceiveStateSnapShotUrl = sigStateSnapShotUrl.subscribe((newValue: string) => {
                this.info('receiveStateSnapShotUrl Signal Subscribe Value: ' + newValue);
                this.snapShotUrl = newValue;
                this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
            });
        }
    }

    public get receiveStateUrl(): string {
        return this._attributeValueAsString('receivestateurl');
    }

    public set receiveStateUrl(value: string) {
        this._receiveStateUrl = value;
        this.info('Set receiveStateUrl(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateUrl !== undefined
            && this._receiveStateUrl !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateUrl: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
        const sigStateUrl: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStateUrl);
        if (sigStateUrl) {
            this.subReceiveStateUrl = sigStateUrl.subscribe((newValue: string) => {
                this.info('receiveStateUrl Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    if (newValue === this.url) {
                        return;
                    }
                    this.url = newValue;
                    this.sendEvent(this.sendEventSelectionURL, this.url, 'string');
                    if (this.elementIntersectionEntry.intersectionRatio >= 1) {
                        this.lastResponseStatus = 'stopped';
                        this.isVideoReady = false;
                        this.lastUpdatedStatus = "stop";
                        this.isExitFullscreen = false;
                        this.publishVideoEvent("start");
                    }
                }
            });
        }
    }

    public get receiveStateUserId(): string {
        return this._receiveStateUserId;
    }

    public set receiveStateUserId(value: string) {
        this._receiveStateUserId = value;
        this.info('Set receiveStateUserId(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateUserId !== undefined
            && this._receiveStateUserId !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUserId);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateUserId: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUserId);
        const sigStateUserId: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStateUserId);
        if (sigStateUserId) {
            this.subReceiveStateUserId = sigStateUserId.subscribe((newValue: string) => {
                this.info('receiveStateUserId Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    this.userId = newValue;
                }
            });
        }
    }

    public get receiveStateSnapShotUserId(): string {
        return this._receiveStateSnapShotUserId;
    }
    public set receiveStateSnapShotUserId(value: string) {
        this._receiveStateSnapShotUserId = value;
        this.info('Set receiveStateSnapShotUserId(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotUserId !== undefined
            && this._receiveStateSnapShotUserId !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotUserId);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotUserId: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotUserId);
        const sigStateSnapShotUserId: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStateSnapShotUserId);
        if (sigStateSnapShotUserId) {
            this.subReceiveStateSnapShotUserId = sigStateSnapShotUserId.subscribe((newValue: string) => {
                this.info('receiveStateSnapShotuserId Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    this.snapShotUserId = newValue;
                }

            });
        }
    }

    public get receiveStatePassword(): string {
        return this._receiveStatePassword;
    }
    public set receiveStatePassword(value: string) {
        this._receiveStatePassword = value;
        this.info('Set receiveStatePassword(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStatePassword !== undefined
            && this._receiveStatePassword !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePassword);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStatePassword: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePassword);
        const sigStatePassword: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStatePassword);
        if (sigStatePassword) {
            this.subReceiveStatePassword = sigStatePassword.subscribe((newValue: string) => {
                this.info('receiveStatePassword Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    this.password = newValue;
                }
            });
        }
    }

    public get receiveStateSnapShotPassword(): string {
        return this._receiveStateSnapShotPassword;
    }
    public set receiveStateSnapShotPassword(value: string) {
        this._receiveStateSnapShotPassword = value;
        this.info('Set receiveStateSnapShotPassword(\'' + value + '\')');
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotPassword !== undefined
            && this._receiveStateSnapShotPassword !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotPassword);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotPassword: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotPassword);
        const sigStateSnapShotPassword: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigNameStateSnapShotPassword);
        if (sigStateSnapShotPassword) {
            this.subReceiveStateSnapShotPassword = sigStateSnapShotPassword.subscribe((newValue: string) => {
                this.info('receiveStateSnapShotPassword Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    this.snapShotPassword = newValue;
                }
            });
        }
    }

    // Respond to attribute changes.
    static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;
        const ch5VideoAttributes = [
            // attributes
            'indexid',
            'userid',
            'snapshotuserid',
            'password',
            'snapshotpassword',
            'aspectratio',
            'stretch',
            'snapshotrefreshrate',
            'url',
            'sourcetype',
            'snapshoturl',
            'size',
            'zindex',
            'controls',

            // send signals
            'sendEventsnapshotUrl',
            'sendeventonclick',
            'sendeventselectionchange',
            'sendeventselectionsourcetype',
            'sendeventselectionurl',
            'sendeventsnapshoturl',
            'sendeventerrorcode',
            'sendeventerrormessage',
            'sendeventretrycount',
            'sendeventresolution',
            'sendeventsnapshotstatus',
            'sendeventsnapshotlastupdatetime',
            'sendeventstate',

            // receive signals
            'receivestatesnapshoturl',
            'receivestateurl',
            'receivestateplay',
            'receivestateselect',
            'receivestatesourcetype',
            'receivestatesnapshotrefreshrate',
            'receivestateuserid',
            'receivestatesnapshotuserid',
            'receivestatepassword',
            'receivestatevideocount',
            'receivestatesnapshotpassword'
        ];
        return commonAttributes.concat(ch5VideoAttributes);
    }


    public attributeChangedCallback(attr: string, oldValue: string, newValue: any) {
        switch (attr) {
            case 'indexid':
                if (this.hasAttribute('indexid')) {
                    this.indexId = newValue;
                } else {
                    this.indexId = '0';
                }
                break;
            case 'userid':
                if (this.hasAttribute('userid')) {
                    this.userId = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.userId = '';
                }
                break;
            case 'snapshotuserid':
                if (this.hasAttribute('snapshotuserid')) {
                    this.snapShotUserId = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.snapShotUserId = '';
                }
                break;
            case 'password':
                if (this.hasAttribute('password')) {
                    this.password = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.password = '';
                }
                break;
            case 'snapshotpassword':
                if (this.hasAttribute('snapshotpassword')) {
                    this.snapShotPassword = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.snapShotPassword = '';
                }
                break;
            case 'aspectratio':
                if (this.hasAttribute('aspectratio')) {
                    if (newValue === "16:9" || newValue === "4:3") {
                        this.aspectRatio = newValue;
                    } else {
                        this.aspectRatio = '16:9';
                    }
                } else {
                    this.aspectRatio = '16:9';
                }
                break;
            case 'stretch':
                if (this.hasAttribute('stretch')) {
                    this.stretch = newValue;
                } else {
                    this.stretch = 'false';
                }
                break;
            case 'snapshotrefreshrate':
                if (this.hasAttribute('snapshotrefreshrate')) {
                    this.snapShotRefreshRate = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.snapShotRefreshRate = '0';
                }
                break;
            case 'url':
                if (this.hasAttribute('url')) {
                    this.url = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.url = '';
                }
                break;
            case 'snapshoturl':
                if (this.hasAttribute('snapshoturl')) {
                    this.snapShotUrl = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.snapShotUrl = '';
                }
                break;
            case 'sourcetype':
                if (this.hasAttribute('sourcetype')) {
                    this.sourceType = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.sourceType = "Network";
                }
                break;
            case 'size':
                if (this.hasAttribute('size')) {
                    this.size = newValue;
                } else {
                    this.size = 'large';
                }
                break;
            case 'zindex':
                if (this.hasAttribute('zindex')) {
                    this.zIndex = newValue;
                } else {
                    this.zIndex = '0';
                }
                break;
            case 'controls':
                if (this.hasAttribute('controls')) {
                    this.controls = newValue;
                } else {
                    this.controls = 'false';
                }
                break;
            case 'sendeventstate':
                if (this.hasAttribute('sendeventstate')) {
                    this.sendEventState = newValue;
                } else {
                    this.sendEventState = '';
                }
                break;
            case 'sendeventonclick':
                if (this.hasAttribute('sendeventonclick')) {
                    this.sendEventOnClick = newValue;
                } else {
                    this.sendEventOnClick = '';
                }
                break;
            case 'sendeventselectionchange':
                if (this.hasAttribute('sendeventselectionchange')) {
                    this.sendEventSelectionChange = newValue;
                } else {
                    this.sendEventSelectionChange = '';
                }
                break;
            case 'sendeventselectionsourcetype':
                if (this.hasAttribute('sendeventselectionsourcetype')) {
                    this.sendEventSelectionSourceType = newValue;
                    this.sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                } else {
                    this.sendEventSelectionSourceType = '';
                }
                break;
            case 'sendeventsnapshoturl':
                if (this.hasAttribute('sendeventsnapshoturl')) {
                    this.sendEventSnapShotURL = newValue;
                    this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
                } else {
                    this.sendEventSnapShotURL = '';
                }
                break;
            case 'sendeventselectionurl':
                if (this.hasAttribute('sendeventselectionurl')) {
                    this.sendEventSelectionURL = newValue;
                    this.sendEvent(this.sendEventSelectionURL, this.url, 'string');
                } else {
                    this.sendEventSelectionURL = '';
                }
                break;
            case 'sendeventerrorcode':
                if (this.hasAttribute('sendeventerrorcode')) {
                    this.sendEventErrorCode = newValue;
                } else {
                    this.sendEventErrorCode = '';
                }
                break;
            case 'sendeventerrormessage':
                if (this.hasAttribute('sendeventerrormessage')) {
                    this.sendEventErrorMessage = newValue;
                } else {
                    this.sendEventErrorMessage = '';
                }
                break;
            case 'sendeventretrycount':
                if (this.hasAttribute('sendeventretrycount')) {
                    this.sendEventRetryCount = newValue;
                } else {
                    this.sendEventRetryCount = '';
                }
                break;
            case 'sendeventresolution':
                if (this.hasAttribute('sendeventresolution')) {
                    this.sendEventResolution = newValue;
                } else {
                    this.sendEventResolution = '0x0@0fps';
                }
                break;
            case 'sendeventsnapshotstatus':
                if (this.hasAttribute('sendeventsnapshotstatus')) {
                    this.sendEventSnapShotStatus = newValue;
                } else {
                    this.sendEventSnapShotStatus = '';
                }
                break;
            case 'sendeventsnapshotlastupdatetime':
                if (this.hasAttribute('sendeventsnapshotlastupdatetime')) {
                    this.sendEventSnapShotLastUpdateTime = newValue;
                } else {
                    this.sendEventSnapShotLastUpdateTime = '';
                }
                break;
            case 'receivestatevideocount':
                if (this.hasAttribute('receivestatevideocount')) {
                    this.receiveStateVideoCount = newValue;
                } else {
                    this.receiveStateVideoCount = '';
                }
                break;
            case 'receivestateplay':
                if (this.hasAttribute('receivestateplay')) {
                    this.receiveStatePlay = newValue;
                } else {
                    this.receiveStatePlay = '';
                }
                break;
            case 'receivestateselect':
                if (this.hasAttribute('receivestateselect')) {
                    this.receiveStateSelect = newValue;
                } else {
                    this.receiveStateSelect = '';
                }
                break;
            case 'receivestateurl':
                if (this.hasAttribute('receivestateurl')) {
                    this.receiveStateUrl = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateUrl = '';
                }
                break;
            case 'receivestatesourcetype':
                if (this.hasAttribute('receivestatesourcetype')) {
                    this.receiveStateSourceType = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateSourceType = '';
                }
                break;
            case 'receivestatesnapshoturl':
                if (this.hasAttribute('receivestatesnapshoturl')) {
                    this.receiveStateSnapShotURL = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateSnapShotURL = '';
                }
                break;
            case 'receivestatesnapshotrefreshrate':
                if (this.hasAttribute('receivestatesnapshotrefreshrate')) {
                    this.receiveStateSnapShotRefreshRate = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateSnapShotRefreshRate = '';
                }
                break;
            case 'receivestateuserid':
                if (this.hasAttribute('receivestateuserid')) {
                    this.receiveStateUserId = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateUserId = '';
                }
                break;
            case 'receivestatesnapshotuserid':
                if (this.hasAttribute('receivestatesnapshotuserid')) {
                    this.receiveStateSnapShotUserId = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateSnapShotUserId = '';
                }
                break;
            case 'receivestatepassword':
                if (this.hasAttribute('receivestatepassword')) {
                    this.receiveStatePassword = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStatePassword = '';
                }
                break;
            case 'receivestatesnapshotpassword':
                if (this.hasAttribute('receivestatesnapshotpassword')) {
                    this.receiveStateSnapShotPassword = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.receiveStateSnapShotPassword = '';
                }
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    /**
     * Unsubscribe signals
     */
    public unsubscribeFromSignals() {
        super.unsubscribeFromSignals();
        const csf = Ch5SignalFactory.getInstance();
        if (this.subReceiveStatePlay !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStatePlay);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStatePlay);
            }
        }
        if (this.subReceiveStateUrl !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateUrl);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateUrl);
            }
        }
        if (this.subReceiveStateSelect !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSelect);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSelect);
            }
        }
        if (this.subReceiveStateSourceType !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSourceType);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSourceType);
            }
        }
        if (this.subReceiveStateSnapShotUrl !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSnapShotURL);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSnapShotUrl);
            }
        }
        if (this.subReceiveStateSnapShotRefreshRate !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSnapShotRefreshRate);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSnapShotRefreshRate);
            }
        }
        if (this.subReceiveStateSelect !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSelect);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSelect);
            }
        }
        if (this.subReceiveStateSourceType !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSourceType);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSourceType);
            }
        }
        if (this.subReceiveStateUserId !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateUserId);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateUserId);
            }
        }
        if (this.subReceiveStateSnapShotUserId !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSnapShotUserId);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSnapShotUserId);
            }
        }
        if (this.subReceiveStatePassword !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStatePassword);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStatePassword);
            }
        }
        if (this.subReceiveStateSnapShotPassword !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSnapShotPassword);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSnapShotPassword);
            }
        }
        if (this.subReceiveStateVideoCount !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this.subReceiveStateVideoCount);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateVideoCount);
            }
        }

    }

    /**
     * 	Called every time the element is inserted into the DOM. 
     *  Useful for running setup code, such as fetching resources or rendering. 
     */
    public removeIfTagExist(): void {
        const hasCanvas = this.querySelector('canvas');
        const videoWrapper = this.querySelector('.video-wrapper');
        if (hasCanvas) {
            hasCanvas.remove();
        }
        if (videoWrapper) {
            videoWrapper.remove();
        }
    }

    /**
     * Create the elements in CH5Video tag
     */
    private createCanvas() {
        // Create the canvas
        this.vid = document.createElement('canvas');
        this.videoCanvasElement = document.createElement("div");
        // Create main control panel
        this.vidControlPanel = document.createElement("div");
        this.vidControlPanel.classList.add("control-panel");
        // Create div for the right side of the control panel
        this.controlFullScreen = document.createElement("a");
        this.controlFullScreen.classList.add("control");
        this.controlFullScreen.innerHTML = this.fullScreenIcon;
        this.vidControlPanel.appendChild(this.controlFullScreen);
        // add primary class
        this.vid.classList.add(this.primaryVideoCssClass + '--canvas');
        this.classList.add(this.primaryVideoCssClass);
        this.videoCanvasElement.classList.add('video-wrapper');

        if (!document.getElementById("fullScreenOverlay")) {
            this.fullScreenOverlay = document.createElement("div");
            this.fullScreenOverlay.setAttribute("id", "fullScreenOverlay");
            document.body.appendChild(this.fullScreenOverlay);
        }
    }

    public connectedCallback() {
        this.info('Ch5Video.connectedCallback()');

        if (this.isInitialized) {
            this.removeIfTagExist();
            customElements.whenDefined('ch5-video').then(() => {
                this.scrollableElm = getScrollableParent(this);
                this.initializeVideo();
                this.isInitialized = false;

                this.slidemoveSubscriptionId = subscribeState('b', 'triggerview.slidemove', (res: boolean) => {
                    if (res) {
                        publishEvent('o', 'ch5.video.background', { "action": "refill" });
                        this.isSlidemoved = true;
                    }
                });

                this.touchendSubscriptionId = subscribeState('b', 'triggerview.touchend', (res: boolean) => {
                    if (res && this.isSlidemoved) {
                        let timer: any;
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            this.publishVideoEvent("resize");
                            this.isSlidemoved = false;
                        }, 300);
                    }
                });

                this.slidechangeSubscriptionId = subscribeState('b', 'triggerview.slidechange', (res: boolean) => {
                    if (res && this.elementIsInViewPort) {
                        publishEvent('o', 'ch5.video.background', { "action": "refill" });
                        this.publishVideoEvent("stop");
                    }
                });
            });
        }
        Ch5CoreIntersectionObserver.getInstance().observe(this, this.videoIntersectionObserver);
        this.isIntersectionObserve = true;
    }

    /**
     * Send event to the ch5-background to cut the background layer
     */
    private publishBackgroundEvent() {
        this.backgroundInterval = setTimeout(() => {
            if (this.videoTop !== -1 && this.videoLeft !== -1) {
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON("start", this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height));
            }
        }, 1000);
    }

    /**
     * When the video element is more than 100% visible the video should start and
     * when the visibility is less than 100% the video should stop playing.
     */
    public videoIntersectionObserver() {
        this.info('Video visibility ' + this.elementIntersectionEntry.intersectionRatio);
        if (this.elementIntersectionEntry.intersectionRatio >= 1) {
            this.firstTime = false;
            clearTimeout(this.isSwipeInterval);
            this.isSwipeInterval = setTimeout(() => {
                this.calculation(this.vid);
                this.calculatePositions();
                if (!this.isFullScreen && !this.isExitFullscreen && !this.isOrientationChanged) {
                    this.lastResponseStatus = 'stopped';
                    this.lastUpdatedStatus = 'stop';
                    this.isVideoReady = false;
                    this.publishVideoEvent("start");
                }
            }, 1000);
        } else {
            // when the fullscreen is triggered in
            if (this.isFullScreen) {
                return;
            }
            clearTimeout(this.backgroundInterval);
            clearTimeout(this.isSwipeInterval);
            this.clearAllSnapShots();
            if (this.isSwipeInterval) {
                window.clearInterval(this.isSwipeInterval);
            }

            // In some of the iOS devices, there is a delay in getting orientation 
            // change information, a small delay solves this problem.
            setTimeout(() => {
                publishEvent('o', 'ch5.video.background', { "action": "refill" });
                if (!this.isExitFullscreen && !this.isOrientationChanged && !this.firstTime) {
                    this.publishVideoEvent("stop");
                }
            });
        }
    }

    private clearAllSnapShots() {
        if (this.maxVideoCount) {
            for (let idx = 0; idx < this.maxVideoCount; idx++) {
                const sData: Ch5VideoSnapshot = this.snapShotInfoMap.get(idx);
                sData.stopLoadingSnapShot();
            }
        }
    }

    /**
     * When the video element is visible
     */
    public videoVisibilityInViewport() {
        this.autoHideControls();
        if (this.elementIsInViewPort) {
            this.isSwipeStarted = true;
            this.isSwipeInterval = setTimeout(() => {
                this.calculation(this.vid);
                this.sendEvent(this.sendEventSnapShotLastUpdateTime, this.rfc3339TimeStamp(), 'string');
                this.calculatePositions();
                this.lastResponseStatus = 'stopped';
                this.isVideoReady = false;
                this.lastUpdatedStatus = "stop";
                this.publishBackgroundEvent();
                this.publishVideoEvent("start");
            }, 1000);
            window.clearTimeout(this.interval);
        } else {
            clearTimeout(this.backgroundInterval);
            clearTimeout(this.isSwipeInterval);
            publishEvent('o', 'ch5.video.background', { "action": "refill" });
            if (this.isFullScreen) {
                this.calculation(this.vid);
                this.publishVideoEvent("resize");
            } else {
                if (this.isSwipeStarted) {
                    if (this.isSwipeInterval) {
                        window.clearInterval(this.isSwipeInterval);
                    }
                    this.isVideoReady = true;
                    this.lastResponseStatus = "start";
                    this.publishVideoEvent("stop");
                }
            }
        }
    }

    /**
     * Play when the user clicks on the video or play/stop control button
     */
    private manageControls() {
        if (this.isFullScreen) {
            this.videoCanvasElement.removeEventListener('touchmove', this.handleTouchMoveEvent, false);
            this.exitFullScreen();
            return;
        }
        if (this.lastResponseStatus === 'started' || this.lastResponseStatus === 'resized') {
            this.showFullScreenIcon();
        } else {
            this.hideFullScreenIcon();
        }
        this.sendEvent(this.sendEventOnClick, true, 'boolean');
        this.autoHideControls();
    }

    /**
     * Refresh the snapshot based on the refresh rate
     */
    private loadImageWithAutoRefresh() {
        if (!this.context) {
            return;
        }
        this.vid.width = this.sizeObj.width;
        this.vid.height = this.sizeObj.height;
        this.context = this.vid.getContext("2d");
        this.calculation(this.vid);
        this.videoCanvasElement.appendChild(this.vid);
        this.context.fillStyle = "transparent";
        this.appendChild(this.videoCanvasElement);
        this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
        const videoRefreshRate = parseInt(this.snapShotRefreshRate, 0);
        if (!isNaN(videoRefreshRate) && videoRefreshRate > 0) {
            this.unsubscribeRefreshImage();
            this.snapShotTimer = setInterval(() => {
                if (this.snapShotUserId && this.snapShotPassword && !this.snapShotUrl.indexOf("http")) {
                    this.processUri();
                }
                if (this.snapShotUrl !== "") {
                    this.snapShotOnLoad();
                } else {
                    this.unsubscribeRefreshImage();
                }
            }, 1000 * videoRefreshRate);
        }
    }

    /**
     * Check the snapshot url and append web protocol and credentials to it
     */
    public processUri(): void {
        const processUriPrams: TCh5ProcessUriParams = {
            protocol: this.protocol,
            user: this.snapShotUserId,
            password: this.snapShotPassword,
            url: this.snapShotUrl
        };

        const getImageUrl = Ch5Common.processUri(processUriPrams);
        if (!!getImageUrl) {
            this.snapShotUrl = getImageUrl;
        }
    }

    /**
     * Calculate positions of the snapshot
     */
    private calculateSnapShotPositions() {
        const topOffset = this.vid.getBoundingClientRect().top;
        const leftOffset = this.vid.getBoundingClientRect().left;
        this.vidleft = this.videoLeft - leftOffset;
        this.vidTop = this.videoTop - topOffset;
    }

    /**
     * Draw the snapshot on the canvas
     * @param videoImage 
     */
    private drawSnapShot(videoImage: HTMLImageElement) {
        this.calculateSnapShotPositions();
        this.context.drawImage(videoImage, this.vidleft, this.vidTop, this.sizeObj.width, this.sizeObj.height);
        this.context.save();
        this.context.restore();
    }

    /**
     * Load the snapshot once on CH5-video load`
     */
    private snapShotOnLoad() {
        const videoImage = new Image();
        videoImage.onload = () => {
            this.info("Snapshot image loaded");
            this.lastLoadedImage = videoImage;
            this.sendEvent(this.sendEventSnapShotLastUpdateTime, this.rfc3339TimeStamp(), 'string');
        };
        videoImage.onerror = () => {
            this.info(videoImage.src);
            this.info("Error occurred while rendering the image");
            this.sendEvent(this.sendEventSnapShotStatus, 2, 'number');
            this.lastLoadedImage = '';
        }
        videoImage.src = this.snapShotUrl + "?" + new Date().getTime().toString();
    }

    /**
     * Unsubscribe the snapshot image refresh rate
     * @private
     * @memberof Ch5Video
     */
    private unsubscribeRefreshImage() {
        clearInterval(this.snapShotTimer);
    }

    /**
     * Clear the existing context
     */
    private clearSnapShot() {
        if (!!this.context) {
            this.context.clearRect(this.vidleft, this.vidTop, this.sizeObj.width, this.sizeObj.height);
        }
    }

    /**
     * Checks the 4 scenarios of receiveStatePlay value and Element Visibility
     * @param playVal 
     */
    private videoScenariosCheck(playVal: boolean) {
        let actionType: string = "stop";
        if (playVal && this.elementIsInViewPort) {
            this.isVideoReady = false;
            this.lastUpdatedStatus = "stop";
            actionType = "start";
        } else if (playVal && !this.elementIsInViewPort) {
            this.isVideoReady = true;
            this.isVideoPublished = true;
            this.lastUpdatedStatus = "start";
        } else if (!playVal && this.elementIsInViewPort) {
            this.isVideoPublished = true;
            this.isVideoReady = false;
            this.lastUpdatedStatus = "start";
            actionType = "stop";
        } else if (!playVal && !this.elementIsInViewPort) {
            this.isVideoReady = true;
            this.isVideoPublished = true;
            this.lastUpdatedStatus = "start";
        }
        this.fromReceiveStatePlay = false;
        return actionType;
    }

    /**
     * When the video exit from the full screen
     */
    private exitFullScreen() {
        this.vidControlPanel.classList.remove("fullScreen");
        this.orientationChangeComplete();
        this.controlFullScreen.innerHTML = '';
        this.controlFullScreen.innerHTML = this.fullScreenIcon;
        this.zIndex = "0";
        this.classList.remove(this.fullScreenStyleClass);
        this.autoHideControls();
        document.body.classList.remove(this.fullScreenBodyClass);
        this.style.visibility = '';
        this.isVideoReady = true;
        this.isOrientationChanged = false;
        this.isPositionChanged = false;
        this.isExitFullscreen = true;
        this.isFullScreen = false;
        window.clearTimeout(this.scrollTimer);
        window.clearTimeout(this.exitTimer);
        this.exitTimer = window.setTimeout(() => {
            if (isSafariMobile()) {
                if (Ch5VideoEventHandler.isPortrait()) {
                    if (Object.keys(this.originalPotraitVideoProperties).length > 0) {
                        this.sizeObj.width = this.originalPotraitVideoProperties.width;
                        this.sizeObj.height = this.originalPotraitVideoProperties.height;
                        this.videoTop = this.originalPotraitVideoProperties.top;
                        this.videoLeft = this.originalPotraitVideoProperties.left;
                        this.vid.width = this.originalPotraitVideoProperties.width;
                        this.vid.height = this.originalPotraitVideoProperties.height;
                    } else {
                        this.calculation(this.vid);
                    }
                } else if (Ch5VideoEventHandler.isLandscape()) {
                    if (Object.keys(this.originalLandscapeVideoProperties).length > 0) {
                        this.sizeObj.width = this.originalLandscapeVideoProperties.width;
                        this.sizeObj.height = this.originalLandscapeVideoProperties.height;
                        this.videoTop = this.originalLandscapeVideoProperties.top;
                        this.videoLeft = this.originalLandscapeVideoProperties.left;
                        this.vid.width = this.originalLandscapeVideoProperties.width;
                        this.vid.height = this.originalLandscapeVideoProperties.height;
                    } else {
                        this.calculation(this.vid);
                    }
                }
            } else {
                if (Object.keys(this.originalVideoProperties).length > 0) {
                    this.sizeObj.width = this.originalVideoProperties.width;
                    this.sizeObj.height = this.originalVideoProperties.height;
                    this.videoTop = this.originalVideoProperties.top;
                    this.videoLeft = this.originalVideoProperties.left;
                    this.vid.width = this.originalVideoProperties.width;
                    this.vid.height = this.originalVideoProperties.height;
                }
            }
            this.publishVideoEvent("resize");
        }, 500);
    }

    /**
     * Changes the full screen mode through controls
     */
    private handleTouchMoveEvent(ev: Event) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    }
    private fullScreen() {
        if (this.isFullScreen) {
            this.exitFullScreen();
        } else {
            this.isFullScreen = true;
            this.videoCanvasElement.addEventListener('touchmove', this.handleTouchMoveEvent, false);
            this.hideFullScreenIcon();
            if (isSafariMobile()) {
                if (Ch5VideoEventHandler.isPortrait()) {
                    this.isPotraitMode = true;
                    this.originalPotraitVideoProperties = [];
                    this.originalPotraitVideoProperties = {
                        "width": this.sizeObj.width,
                        "height": this.sizeObj.height,
                        "top": this.videoTop,
                        "left": this.videoLeft
                    };
                } else if (Ch5VideoEventHandler.isLandscape()) {
                    this.isPotraitMode = false;
                    this.originalLandscapeVideoProperties = [];
                    this.originalLandscapeVideoProperties = {
                        "width": this.sizeObj.width,
                        "height": this.sizeObj.height,
                        "top": this.videoTop,
                        "left": this.videoLeft
                    };
                }
            } else {
                this.originalVideoProperties = [];
                this.originalVideoProperties = {
                    "width": this.sizeObj.width,
                    "height": this.sizeObj.height,
                    "top": this.videoTop,
                    "left": this.videoLeft
                };
            }
            this.vidControlPanel.classList.add("fullScreen");
            this.controlFullScreen.innerHTML = '';
            this.controlFullScreen.innerHTML = this.exitFullScreenIcon;
            this.drawCanvas(this.vid);
            this.classList.add(this.fullScreenStyleClass);
            this.sizeObj.width = window.innerWidth;
            this.sizeObj.height = window.innerHeight;
            this.vid.width = window.innerWidth;
            this.vid.height = window.innerHeight;
            document.body.classList.add(this.fullScreenBodyClass);
            this.style.visibility = 'visible';
            this.isVideoReady = true;
            this.isOrientationChanged = false;
            this.isPositionChanged = false;
            this.calculation(this.vid);
            if (isSafariMobile()) {
                if (!this.isPotraitMode) {
                    this.calculatePositions();
                }
            }
            // publishEvent('o', 'ch5.video.background', { "action": "refill" });
            this.publishVideoEvent("fullscreen");
        }
    }

    /**
     * To auto hide the controls after particular time
     */
    private autoHideControls() {
        clearTimeout(this.controlTimer);
        this.controlTimer = setTimeout(() => {
            this.hideFullScreenIcon();
        }, this.autoHideControlPeriod * 1000);
    }

    private videoCP(event: Event) {
        event.stopPropagation();
    }

    /**
     * When the user scolls the page, video will disappear and when the scrolling gets stopped 
     * then video starts playing in the new position.
     */
    private positionChange() {
        if ((this.lastResponseStatus === '' || this.lastResponseStatus === 'started' || this.lastResponseStatus === 'resized')) {
            window.clearTimeout(this.exitTimer);
            window.clearTimeout(this.scrollTimer);
            publishEvent('o', 'ch5.video.background', { 'action': 'refill' });
            this.isExitFullscreen = false;
            this.scrollTimer = window.setTimeout(() => {
                if (this.elementIntersectionEntry.intersectionRatio >= 1) {
                    this.calculatePositions();
                    this.calculation(this.vid);
                    this.isPositionChanged = true;
                    this.publishVideoEvent('resize');
                }
            }, 500);
        }
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();
        this.controlFullScreen.addEventListener('click', this.fullScreen.bind(this));
        this.videoCanvasElement.addEventListener('click', this.manageControls.bind(this));
        this.vidControlPanel.addEventListener('click', this.videoCP.bind(this));
        window.addEventListener('orientationchange', this.orientationChange.bind(this));
        window.addEventListener('resize', this.orientationChange.bind(this));
        this.scrollableElm.addEventListener('scroll', this.positionChange.bind(this));
    }

    /**
     * Removes listeners
     */
    private removeEvents() {
        super.removeEventListeners();
        this.controlFullScreen.removeEventListener('click', this.fullScreen.bind(this));
        this.videoCanvasElement.removeEventListener('click', this.manageControls.bind(this));
        this.vidControlPanel.removeEventListener('click', this.videoCP.bind(this));
        window.removeEventListener('orientationchange', this.orientationChange.bind(this));
        window.removeEventListener('resize', this.orientationChange.bind(this));
        this.scrollableElm.removeEventListener('scroll', this.positionChange.bind(this));
    }

    /**
     * Called every time the element is removed from the DOM. 
     * Useful for running clean up code.
     */
    public disconnectedCallback() {
        this.info('Ch5Video.disconnectedCallback()');
        this.unsubscribeFromSignals();
        this.removeEvents();
        // disconnect common mutation observer
        this.unSubscribeVideos(this.selectObject);
        this.subscriptionEventList.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.clearAllSnapShots();
        setTimeout(() => {
            // Stop the Video
            this.isSwipeStarted = false;
            this.isVideoReady = true;
            this.lastUpdatedStatus = "start";
            this.publishVideoEvent("stop");
        });

        if (Ch5CoreIntersectionObserver.getInstance() instanceof Ch5CoreIntersectionObserver) {
            Ch5CoreIntersectionObserver.getInstance().unobserve(this);
            this.isIntersectionObserve = false;
        }
    }

    /**
     * detecting orientation has been changed
     */
    private orientationChanged() {
        const timeout = 120;
        return new Promise((resolve: any) => {
            const go = (i: number, height0: number) => {
                window.innerHeight !== height0 || i >= timeout ? resolve() : window.requestAnimationFrame(() => go(i + 1, height0));
            };
            go(0, window.innerHeight);
        });
    }

    /**
     * Send the resize request when the device orientation has been changed.
     */
    private orientationChange() {
        publishEvent('o', 'ch5.video.background', { "action": "refill" });
        if (this.elementIsInViewPort) {
            this.isOrientationChanged = true; // When the orientation happens inside the view port, isorientationChaged flag will be set to true
        }
        this.hideFullScreenIcon();
        this.orientationChanged().then(() => {
            publishEvent('o', 'ch5.video.background', { "action": "refill" });
            this.calculation(this.vid);
            if (this.isFullScreen) {
                if (!!this.fullScreenOverlay && !!this.fullScreenOverlay.classList) {
                    this.fullScreenOverlay.classList.add(this.primaryVideoCssClass + '--overlay');
                }
                setTimeout(() => {
                    if (Ch5VideoEventHandler.isLandscape()) {
                        this.calculatePositions();
                    }
                }, 1000);
            } else {
                window.clearTimeout(this.appBgTimer);
                this.appBgTimer = window.setTimeout(() => {
                    this.updateAppBackgroundStatus();
                }, 100);
                this.calculatePositions();
            }
            if (this.lastResponseStatus === '' || this.lastResponseStatus === "stopped" || this.lastUpdatedStatus === "stop") {
                this.lastUpdatedStatus = "stop";
                this.isVideoReady = false;
                this.lastResponseStatus = '';
                this.publishVideoEvent("start");
            } else {
                this.publishVideoEvent("resize");
            }

        });
    }

    /**
     * Returns the height for the given width based on the aspect ratio
     * @param aRatio 
     * @param width 
     * @param height
     */
    private _getDisplayWxH(aRatio: any, width: number, height: number) {
        let pixelsHeight: number = 0;
        let pixelsWidth: number = 0;
        if (aRatio === "16:9" || aRatio === "") {
            pixelsHeight = Math.round(width / 16 * 9);
            pixelsWidth = Math.round(height / 9 * 16);
            // Check for minimum width and height
            if (width < 256 || height < 144) {
                width = 256; height = 144;
            }
        } else if (aRatio === "4:3") {
            pixelsHeight = Math.round(width / 4 * 3);
            pixelsWidth = Math.round(height / 3 * 4);
            // Check for minimum width and height
            if (width < 192 || height < 144) {
                width = 192; height = 144;
            }
        }
        if (pixelsWidth > width) {
            pixelsWidth = width;
        } else if (pixelsHeight > height) {
            pixelsHeight = height;
        }
        return { width: pixelsWidth, height: pixelsHeight };
    }

    /**
     * Calculate the canvas position
     */
    private calculatePositions() {
        if (this.stretch === 'false' || this.isFullScreen) {
            this.videoTop = this.videoCanvasElement.getBoundingClientRect().top;
            this.videoLeft = this.videoCanvasElement.getBoundingClientRect().left;
            // Avoiding negative values and decimal values in video and background
            if (this.videoLeft > 0 && this.videoLeft < 1) {
                this.videoLeft = 0;
            }
            if (this.videoTop > 0 && this.videoTop < 1) {
                this.videoTop = 0;
            }
            this.position.xPos = this.videoLeft;
            this.position.yPos = this.videoTop;
        }
    }

    /**
     * Make a hole in the canvas to display the video from the video surface manager
     * 
     * @param video 
     */
    private drawCanvas(video: HTMLCanvasElement) {
        this.context = video.getContext("2d");
        this.calculation(video);
        this.videoCanvasElement.appendChild(this.vid);
        this.context.fillStyle = "transparent";
        if (this.controls === 'true') {
            this.videoCanvasElement.appendChild(this.vidControlPanel);
        }
        this.appendChild(this.videoCanvasElement);
    }

    /**
     * Cut the canvas to display video
     * @param context
     */
    private cutCanvas2DisplayVideo(context: any) {
        context.clearRect(0, 0, this.sizeObj.width, this.sizeObj.height);
        context.clip();
        context.restore();
    }

    /**
     * Send event to the backend based on the action Type
     * 
     * @param actionType Video request type
     */
    private publishVideoEvent(actionType: string) {
        // When we receive value from receiveStatePlay
        if (this.fromReceiveStatePlay) {
            actionType = this.videoScenariosCheck(this.playValue);
        }
        this.hideFullScreenIcon();
        this.sendEvent(this.sendEventResolution, this.sizeObj.width + "x" + this.sizeObj.height + "@24fps", 'string');
        this.responseObj = [];
        const d = new Date();
        if (this.isFullScreen) {
            this.isAlphaBlend = false;
        } else {
            this.isAlphaBlend = true;
        }
        this.clearOldResponseData();
        switch (actionType) {
            case 'start':
                this.isVideoPublished = true;
                // Check whether receiveStatePlay is defined and the value
                if (this.receiveStatePlay !== "") {
                    if (!this.playValue) {
                        return;
                    }
                }
                this.sendEvent(this.sendEventSelectionURL, this._url, 'string');
                if (!this.isVideoReady && this.lastUpdatedStatus !== 'start' && this.url && (this.lastResponseStatus === 'stopped' || this.lastResponseStatus === '' || this.wasAppBackGrounded) && !this.isExitFullscreen) {
                    this.lastUpdatedStatus = actionType;
                    this.isVideoReady = true;
                    publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType,
                        this.ch5UId, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0),
                        this.isAlphaBlend, d.getMilliseconds(), d.getMilliseconds() + 2000));
                    console.time("start");
                    this.info("Video Request (Start) : " + JSON.stringify(this.videoStartObjJSON(actionType,
                        this.ch5UId, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0),
                        this.isAlphaBlend, d.getMilliseconds(), d.getMilliseconds() + 2000)));
                    publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(
                        actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height));
                    this.info("Background Request (Start) : " + JSON.stringify(
                        this.videoBGObjJSON(actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height)));
                    this.requestID = this.ch5UId;
                } else {
                    this.sendEvent(this.sendEventState, 0, 'number');
                }
                break;
            case 'stop':
                if (!this.isVideoPublished) { // this flag avoids stop command since no video has started
                    return;
                }
                if (this.lastUpdatedStatus !== 'stop' && (this.lastResponseStatus === 'started' || !this.elementIsInViewPort || (this.lastResponseStatus === 'resized' && !this.isExitFullscreen))) {
                    this.lastUpdatedStatus = actionType;
                    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId));
                    console.timeEnd("stop");
                    this.info("Video Request (Stop) : " + JSON.stringify(this.videoStopObjJSON(actionType, this.ch5UId)));
                    this.isVideoReady = false;
                    this.sendEvent(this.sendEventState, 3, 'number');
                }
                break;
            case 'resize':
                // If the video has already stopped then there is no need to resize.
                if (this.lastResponseStatus === 'stopped' || this.lastResponseStatus === '' || this.lastUpdatedStatus === 'stop') {
                    return;
                }
                // if (this.elementIntersectionEntry.intersectionRatio >= 1) {
                this.lastUpdatedStatus = actionType;
                publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, this.ch5UId, this.videoTop,
                    this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0), this.isAlphaBlend, d.getMilliseconds(), d.getMilliseconds() + 2000));
                this.info("Video Request (Resize) : " + JSON.stringify(this.videoStartObjJSON(actionType, this.ch5UId, this.videoTop,
                    this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0), this.isAlphaBlend, d.getMilliseconds(), d.getMilliseconds() + 2000)));
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(
                    actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height));
                this.info(JSON.stringify("Background Request (Resize) : " + JSON.stringify(
                    this.videoBGObjJSON(actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height))));
                this.isVideoReady = false;
                // }
                break;
            case 'fullscreen':
                if (this.lastResponseStatus === 'started' || this.lastResponseStatus === 'resized') {
                    this.lastUpdatedStatus = actionType;
                    publishEvent('o', 'Csig.video.request', this.videoStartObjJSON('resize', this.ch5UId, this.videoTop,
                        this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0), this.isAlphaBlend, d.getMilliseconds(), d.getMilliseconds() + 2000));
                    this.info("Video Request (Resize) : " + JSON.stringify(this.videoStartObjJSON('resize', this.ch5UId, this.videoTop,
                        this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0), this.isAlphaBlend, d.getMilliseconds(), d.getMilliseconds() + 2000)));
                    this.isVideoReady = false;
                }
                break;
            default:
        }
    }

    /**
     * Call back function if the video response has an error
     * @param error 
     */
    private errorResponse(error: any) {
        this.info("Ch5Video - Error when the video response", error);
    }

    /**
     * Video Response on subscribe
     * @param response 
     */
    private videoResponse(response: any) {
        const isMyObjectEmpty = !Object.keys(response).length;
        this.appCurrentBackgroundStatus();

        if (this.wasAppBackGrounded && !this.appCurrentStatus) {
            this.isVideoReady = false;
            this.publishVideoEvent("start");
            this.updateAppBackgroundStatus();
        }
        if (isMyObjectEmpty) {
            this.isVideoReady = false;
            return;
        }

        if (typeof response === "string") {
            this.responseObj = JSON.parse(response);
        } else {
            this.responseObj = response;
        }

        // Return if the previous id and status of the response matches with current id and status of the response
        if (this.oldResponseStatus === this.responseObj.status && this.oldResponseId === this.responseObj.id) {
            return;
        }

        // Return if response object id is negative or empty
        if (this.responseObj.id === -1 || !this.responseObj.id) {
            return;
        }

        // Return if the request Id and response Id is not same
        if (this.requestID !== this.responseObj.id) {
            return;
        }

        // Return if response status is queued as we do not take any action in UI
        if (this.responseObj.status === "queued") {
            return;
        }

        this.info("Video Response : " + JSON.stringify(this.responseObj));

        this.oldResponseStatus = this.responseObj.status;
        this.oldResponseId = this.responseObj.id;
        const responseStatCode: number = this.responseObj.statusCode;
        const responseStatus = this.responseObj.status.toLowerCase();

        switch (responseStatus.toLowerCase()) {
            case 'stopped':
                this.info("TIME TAKEN TO STOP THE VIDEO");
                console.timeEnd("stop");
                if (this.isFullScreen && this.lastUpdatedStatus === 'stop') {
                    this.exitFullScreen();
                }
                this.retryCount = 0;
                this.isVideoReady = false;
                this.isImageReady = true;
                this.sendEvent(this.sendEventState, 1, 'number');
                this.hideFullScreenIcon();
                break;
            case 'connecting':
                this.isVideoReady = false;
                this.isImageReady = true;
                this.hideFullScreenIcon();
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 4, 'number');
                }
                break;
            case 'buffering':
                this.isVideoReady = false;
                this.hideFullScreenIcon();
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 5, 'number');
                }
                break;
            case 'started':
                this.info("TIME TAKEN TO START THE VIDEO");
                console.timeEnd("start");
                this.orientationChangeComplete();
                if (this.lastUpdatedStatus === "resize") {
                    this.lastUpdatedStatus = '';
                }
                this.clearSnapShot();
                this.unsubscribeRefreshImage();
                this.cutCanvas2DisplayVideo(this.context);
                this.sendEvent(this.sendEventSnapShotStatus, 0, 'number');
                this.retryCount = 0;
                this.isVideoReady = true;
                this.isImageReady = false;
                this.sendEvent(this.sendEventState, 2, 'number');
                clearTimeout(this.exitFlagStartedResp);
                this.exitFlagStartedResp = setTimeout(() => {
                    if (this.lastUpdatedStatus === "resize") {
                        this.isOrientationChanged = false;
                    }
                    this.isExitFullscreen = false;
                }, 3000);

                /* 
                 * If 'started' response is delayed Check visibility. 
                 * If the visibility is false send a stop request to stop the video
                 */
                if (this.elementIntersectionEntry.intersectionRatio < 1) {
                    this.info("Video not visible (" + this.elementIntersectionEntry.intersectionRatio + ").");
                    this.info("Received 'started' delayed response from VSM. Sending 'stop' request from UI.");
                    this.publishVideoEvent('stop');
                }
                break;
            case 'retrying':
                this.isVideoReady = false;
                this.isImageReady = true;
                this.hideFullScreenIcon();
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 6, 'number');
                }
                this.retryCount = this.retryCount + 1;
                this.sendEvent(this.sendEventRetryCount, this.retryCount, 'number');
                break;
            case 'resizing':
                this.isVideoReady = false;
                this.isImageReady = true;
                this.hideFullScreenIcon();
                break;
            case 'resized':
                this.orientationChangeComplete();
                if (this.lastUpdatedStatus === "resize") {
                    this.lastUpdatedStatus = '';
                    this.clearSnapShot();
                    this.unsubscribeRefreshImage();
                    this.calculation(this.vid);
                    this.cutCanvas2DisplayVideo(this.context);
                    this.isImageReady = false;
                    this.isVideoReady = true;
                    this.isPositionChanged = false;
                    clearTimeout(this.exitFlagResizedResp);
                    this.exitFlagResizedResp = setTimeout(() => {
                        this.isOrientationChanged = false;
                        this.isExitFullscreen = false;
                    }, 3000);
                }
                break;
            case 'error':
                this.info("Error case in Csig.video.response with status code : " + responseStatCode);
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 7, 'number');
                }
                if (this.responseObj.statusCode) {
                    this.sendEvent(this.sendEventErrorCode, this.responseObj.statusCode, 'number');
                    if (this.videoErrorMessages.has(this.responseObj.statusCode)) {
                        this.sendEvent(this.sendEventErrorMessage, this.videoErrorMessages.get(this.responseObj.statusCode), 'string');
                    } else {
                        this.sendEvent(this.sendEventErrorMessage, "Unknown Error Message", 'string');
                    }
                }
                this.isVideoReady = false;
                this.isImageReady = true;
                this.hideFullScreenIcon();
                break;
            default:
                this.info("Default case in Csig.video.response with status : " + responseStatus);
                this.isVideoReady = false;
                this.isImageReady = true;
                this.hideFullScreenIcon();
                // Increment the retryCount and send the feedback
                if (responseStatus === "retrying connection") {
                    this.retryCount = this.retryCount + 1;
                    this.sendEvent(this.sendEventRetryCount, this.retryCount, 'number');
                }
                break;
        }
        this.lastResponseStatus = responseStatus;
    }

    /**
     * Clear the previous response data
     */
    private clearOldResponseData() {
        this.oldResponseStatus = '';
        this.oldResponseId = 0;
    }

    /**
     * Hide the full screen icon
     */
    private hideFullScreenIcon() {
        if (!!this.vidControlPanel && !!this.vidControlPanel.classList) {
            this.vidControlPanel.classList.remove(this.showControl);
        }
    }

    /**
     * Show the full screen icon
     */
    private showFullScreenIcon() {
        if (!!this.vidControlPanel && !!this.vidControlPanel.classList) {
            this.vidControlPanel.classList.add(this.showControl);
        }
    }

    /**
     * When the Orientation change completes
     */
    private orientationChangeComplete() {
        if (!!this.fullScreenOverlay && !!this.fullScreenOverlay.classList) {
            this.fullScreenOverlay.classList.remove(this.primaryVideoCssClass + '--overlay');
        }
    }

    /**
     * Calculate the padding space for aspect ratio 4:3
     * @param availableWidth 
     * @param displayWidth 
     */
    private calculatePillarBoxPadding(availableWidth: number, displayWidth: number) {
        const yPos: number = 0;
        const xPos: number = Math.round((availableWidth - displayWidth) / 2);
        return { xPos, yPos };
    }

    /**
     * Calculate the padding space for aspect ratio 16:9
     * @param availableHeight 
     * @param displayHeight 
     */
    private calculateLetterBoxPadding(availableHeight: number, displayHeight: number) {
        const xPos: number = 0;
        const yPos: number = Math.round((availableHeight - displayHeight) / 2);
        return { xPos, yPos };
    }

    private setControlDimension() {
        this.vidControlPanel.style.width = this.sizeObj.width + 'px';
        this.vidControlPanel.style.left = this.controlLeft + 'px';
        this.vidControlPanel.style.top = this.controlTop + 'px';
    }

    private fullScreenCalculation() {
        const sWidth: number = window.innerWidth;
        const sHeight: number = window.innerHeight;
        const displaySize: { width: number, height: number } = this._getDisplayWxH(this.aspectRatio, sWidth, sHeight);
        if (displaySize.width < sWidth) {
            this.position = this.calculatePillarBoxPadding(sWidth, displaySize.width);
        } else if (displaySize.height < sHeight) {
            this.position = this.calculateLetterBoxPadding(sHeight, displaySize.height);
        }
        this.videoTop = this.position.yPos;
        this.videoLeft = this.position.xPos;
        this.sizeObj = displaySize;
    }

    /**
     * Calculate the size and position of the canvas
     * @param video
     */
    private calculation(video: HTMLCanvasElement) {
        this.sizeObj = { width: 0, height: 0 };
        if (this.stretch === "false") {
            if (this.isFullScreen) {
                this.fullScreenCalculation();
            } else {
                // Set the canvas width and height
                if (this.aspectRatio === "16:9") {
                    this.sizeObj = aspectRatio(16, 9, this.size);
                } else if (this.aspectRatio === "4:3") {
                    this.sizeObj = aspectRatio(4, 3, this.size);
                }
                video.width = this.sizeObj.width;
                video.height = this.sizeObj.height;
                this.setControlDimension();
                this.setCanvasDimensions(video.width, video.height);
            }
        } else if (this.stretch === "true") {
            let totalWidth: number = 0;
            let totalHeight: number = 0;
            let offsetTop: number = 0;
            let offsetLeft: number = 0;
            this.setCanvasDimensions(totalWidth, totalHeight);
            if (this.isFullScreen) {
                totalWidth = window.innerWidth;
                totalHeight = window.innerHeight;
            } else {
                if (this.parentElement) {
                    totalWidth = this.parentElement.clientWidth;
                    totalHeight = this.parentElement.clientHeight;

                    offsetTop = this.parentElement.getBoundingClientRect().top + this.parentElement.clientTop;
                    offsetLeft = this.parentElement.getBoundingClientRect().left + this.parentElement.clientLeft;
                    if (getComputedStyle(this.parentElement).getPropertyValue("padding-top")) {
                        offsetTop += parseInt(getComputedStyle(this.parentElement).getPropertyValue("padding-top"), 0);
                    }

                    if (getComputedStyle(this.parentElement).getPropertyValue("padding-left")) {
                        offsetLeft += parseInt(getComputedStyle(this.parentElement).getPropertyValue("padding-left"), 0);
                    }

                    if (getComputedStyle(this.parentElement).getPropertyValue("padding-right")) {
                        totalWidth = this.parentElement.clientWidth - (parseInt(getComputedStyle(this.parentElement).getPropertyValue("padding-right"), 0) + parseInt(getComputedStyle(this.parentElement).getPropertyValue("padding-left"), 0));
                    }

                    if (getComputedStyle(this.parentElement).getPropertyValue("padding-bottom")) {
                        totalHeight = this.parentElement.clientHeight - (parseInt(getComputedStyle(this.parentElement).getPropertyValue("padding-bottom"), 0) + parseInt(getComputedStyle(this.parentElement).getPropertyValue("padding-top"), 0));
                    }
                }
            }

            this.setCanvasDimensions(totalWidth, totalHeight);
            const displaySize: { width: number, height: number } = this._getDisplayWxH(this.aspectRatio, totalWidth, totalHeight);
            if (displaySize.width < totalWidth) {
                this.position = this.calculatePillarBoxPadding(totalWidth, displaySize.width);
            } else if (displaySize.height < totalHeight) {
                this.position = this.calculateLetterBoxPadding(totalHeight, displaySize.height);
            }

            this.controlTop = this.position.yPos;
            this.controlLeft = this.position.xPos;

            // Do not add during fullscreen mode
            if (!this.isFullScreen) {
                this.position.xPos += offsetLeft;
                this.position.yPos += offsetTop;
            }

            this.videoTop = this.position.yPos;
            this.videoLeft = this.position.xPos;

            // Avoiding negative values and decimal values in video and background
            if (this.videoLeft > 0 && this.videoLeft < 1) {
                this.videoLeft = 0;
            }
            if (this.videoTop > 0 && this.videoTop < 1) {
                this.videoTop = 0;
            }
            this.sizeObj = displaySize;
            this.setControlDimension();
        }
    }

    /**
     * To get the current timestamp in RFC3339 format
     */
    private rfc3339TimeStamp() {
        const d = new Date();
        return d.getFullYear() + "-" +
            this.pad(d.getMonth() + 1) + "-" +
            this.pad(d.getDate()) + "T" +
            this.pad(d.getHours()) + ":" +
            this.pad(d.getMinutes()) + ":" +
            this.pad(d.getSeconds()) +
            this.timezoneOffset(d.getTimezoneOffset());
    }

    private pad(n: any) {
        return n < 10 ? "0" + n : n;
    }

    private timezoneOffset(offset: any) {
        let sign: any;
        if (offset === 0) {
            return "Z";
        }
        sign = (offset > 0) ? "-" : "+";
        offset = Math.abs(offset);
        return sign + this.pad(Math.floor(offset / 60)) + ":" + this.pad(offset % 60);
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        super.initAttributes();
        if (this.hasAttribute('indexid')) {
            this.indexId = this.getAttribute('indexid') as string;
        }
        if (this.hasAttribute('userid')) {
            this.userId = this.getAttribute('userid') as string;
        }
        if (this.hasAttribute('snapshotuserid')) {
            this.snapShotUserId = this.getAttribute('snapshotuserid') as string;
        }
        if (this.hasAttribute('password')) {
            this.password = this.getAttribute('password') as string;
        }
        if (this.hasAttribute('snapshotpassword')) {
            this.snapShotPassword = this.getAttribute('snapshotpassword') as string;
        }
        if (this.hasAttribute('aspectratio')) {
            const aspRatio: string = this.getAttribute('aspectratio') as string;
            if (aspRatio === "16:9" || aspRatio === "4:3") {
                this.aspectRatio = aspRatio;
            } else {
                this.aspectRatio = "16:9";
            }
        }
        if (this.hasAttribute('stretch')) {
            this.stretch = this.getAttribute('stretch') as any;
        }
        if (this.hasAttribute('snapshoturl')) {
            this.snapShotUrl = this.getAttribute('snapshoturl') as string;
        }
        if (this.hasAttribute('url')) {
            this.url = this.getAttribute('url') as string;
        }
        if (this.hasAttribute('sourcetype')) {
            this.sourceType = this.getAttribute('sourcetype') as string;
        }
        if (this.hasAttribute('sendeventonclick')) {
            this.sendEventOnClick = this.getAttribute('sendeventonclick') as string;
        }
        if (this.hasAttribute('sendeventselectionchange')) {
            this.sendEventSelectionChange = this.getAttribute('sendeventselectionchange') as any;
        }
        if (this.hasAttribute('sendeventselectionsourcetype')) {
            this.sendEventSelectionSourceType = this.getAttribute('sendeventselectionsourcetype') as string;
        }
        if (this.hasAttribute('sendeventselectionurl')) {
            this.sendEventSelectionURL = this.getAttribute('sendeventselectionurl') as string;
        }
        if (this.hasAttribute('sendeventsnapshoturl')) {
            this.sendEventSnapShotURL = this.getAttribute('sendeventsnapshoturl') as string;
        }
        if (this.hasAttribute('sendeventstate')) {
            this.sendEventState = this.getAttribute('sendeventstate') as string;
        }
        if (this.hasAttribute('sendeventerrorcode')) {
            this.sendEventErrorCode = this.getAttribute('sendeventerrorcode') as any;
        }
        if (this.hasAttribute('sendeventerrormessage')) {
            this.sendEventErrorMessage = this.getAttribute('sendeventerrormessage') as string;
        }
        if (this.hasAttribute('sendeventretrycount')) {
            this.sendEventRetryCount = this.getAttribute('sendeventretrycount') as any;
        }
        if (this.hasAttribute('sendeventresolution')) {
            this.sendEventResolution = this.getAttribute('sendeventresolution') as string;
        }
        if (this.hasAttribute('sendeventsnapshotstatus')) {
            this.sendEventSnapShotStatus = this.getAttribute('sendeventsnapshotstatus') as any;
        }
        if (this.hasAttribute('sendeventsnapshotlastupdatetime')) {
            this.sendEventSnapShotLastUpdateTime = this.getAttribute('sendeventsnapshotlastupdatetime') as any;
        }
        if (this.hasAttribute('receivestatevideocount')) {
            this.receiveStateVideoCount = this.getAttribute('receivestatevideocount') as any;
        }
        if (this.hasAttribute('receivestateplay')) {
            this.receiveStatePlay = this.getAttribute('receivestateplay') as any;
        }
        if (this.hasAttribute('receivestateselect')) {
            this.receiveStateSelect = this.getAttribute('receivestateselect') as any;
        }
        if (this.hasAttribute('receivestateurl')) {
            this.receiveStateUrl = this.getAttribute('receivestateurl') as string;
        }
        if (this.hasAttribute('receivestatesourcetype')) {
            this.receiveStateSourceType = this.getAttribute('receivestatesourcetype') as string;
        }
        if (this.hasAttribute('receivestatesnapshoturl')) {
            this.receiveStateSnapShotURL = this.getAttribute('receivestatesnapshotURL') as string;
        }
        if (this.hasAttribute('receivestatesnapshotrefreshrate')) {
            this.receiveStateSnapShotRefreshRate = this.getAttribute('receivestatesnapshotrefreshrate') as any;
        }
        if (this.hasAttribute('receivestateuserid')) {
            this.receiveStateUserId = this.getAttribute('receivestateuserid') as string;
        }
        if (this.hasAttribute('receivestatesnapshotuserid')) {
            this.receiveStateSnapShotUserId = this.getAttribute('receivestatesnapshotuserid') as string;
        }
        if (this.hasAttribute('receivestatepassword')) {
            this.receiveStatePassword = this.getAttribute('receivestatepassword') as string;
        }
        if (this.hasAttribute('receivestatesnapshotpassword')) {
            this.receiveStateSnapShotPassword = this.getAttribute('receivestatesnapshotpassword') as string;
        }
        if (this.hasAttribute('size')) {
            this.size = this.getAttribute('size') as string;
        }
        if (this.hasAttribute('zindex')) {
            this.zIndex = this.getAttribute('zindex') as string;
        }
        if (this.hasAttribute('controls')) {
            this.controls = this.getAttribute('controls') as string;
        }
        if (this.hasAttribute('snapshotrefreshrate')) {
            this.snapShotRefreshRate = this.getAttribute('snapshotrefreshrate') as string;
        }
    }
}

/**
 * Create a custom element
 */
if (typeof window === "object" && typeof window.customElements === "object" && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-video', Ch5Video);
}

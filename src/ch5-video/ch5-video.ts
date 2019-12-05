// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory, subscribeState, unsubscribeState } from "../ch5-core";
import { ICh5VideoAttributes } from "../_interfaces/ch5-video/i-ch5-video-attributes";
import { TDimension, TReceiveState } from "../_interfaces/ch5-video/types";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { Ch5VideoEventHandler, EVideoWindowEvents, ESVGIcons } from "./ch5-video-event-handler";
import { IPUBLISHEVENT, IBACKGROUND } from '../_interfaces/ch5-video/types/t-ch5-video-publish-event-request';
import { Observable, Subscription } from "rxjs";
import { aspectRatio4x3, aspectRatio16x9 } from './ch5-video-constants';

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
 * - sendStateSnapShotLastUpdateTime
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
    public videoCssClassPrefix = "ch5-video"
    public videoCssClass = 'video';
    public preLoaderCssClass = 'preLoader';
    public loaderCssClass = 'loader';
    public fullScreenStyleClass = 'fullScreenStyle'

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

    private screenPlayIcon = ESVGIcons.SCREEN_PLAY_ICON;

    private screenStopIcon = ESVGIcons.SCREEN_STOP_ICON;

    /**
     * Define HTML Elements
     */
    private vid: HTMLCanvasElement = {} as HTMLCanvasElement;
    private videoImage: HTMLImageElement = {} as HTMLImageElement;
    private videoCanvas: HTMLElement = {} as HTMLElement;
    private vidControlPanel: HTMLElement = {} as HTMLElement;
    private vidControls: HTMLElement = {} as HTMLElement;
    private controlsLeft: HTMLElement = {} as HTMLElement;
    private controlsPlay: HTMLAnchorElement = {} as HTMLAnchorElement;
    private dropupMenu: HTMLElement = {} as HTMLElement;
    private controlsSize: HTMLAnchorElement = {} as HTMLAnchorElement;
    private controlsPlay1: HTMLElement = {} as HTMLElement;
    private faExpand: HTMLElement = {} as HTMLElement;
    private controlsRight: HTMLElement = {} as HTMLElement;
    private liveCard: HTMLElement = {} as HTMLElement;
    private snapShotTimer: any;

    private subscriptionEventList: Subscription[] = [];
    private context: any;
    private sizeObj: TDimension = { width: 0, height: 0 };
    private position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
    private retryCount = 0;
    private videoRequestSubscriptionId: string = "";
    private videoResponseSubscriptionId: string = "";
    private videoResizeSubscriptionId: string = "";
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
    private _size: string = 'regular';

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
     * Send signal on click or tap event (mouse or finger up and down in a small period of time).
     */
    private _sendEventOnClick: string = '';

    /**
     * Send signal on source selection change.
     */
    private _sendEventSelectionChange: string = '';

    /**
     * Current selected source type.
     */
    private _sendEventSelectionSourceType: string = '';

    /**
     * Current selected video URL.
     */
    private _sendEventSelectionURL: string = '';

    /**
     * Current selected snapshot URL.
     */
    private _sendEventSnapShotURL: string = '';

    /**
     * Defines the state of the video.
     */
    private _sendEventState: string = '';

    /**
     * Current state video error code.
     */
    private _sendEventErrorCode: string = '';

    /**
     * Current state video error message.
     */
    private _sendEventErrorMessage: string = '';

    /**
     * Current state video retry count.
     */
    private _sendEventRetryCount: string = '';

    /**
     * Current video resolution.
     */
    private _sendEventResolution: string = '';

    /**
     * Current state of the snapshot associated with the current source selection.
     */
    private _sendEventSnapShotStatus: string = '';

    /**
     * The timestamp of the last update time of the snapshot associated with the current source selection.
     */
    private _sendStateSnapShotLastUpdateTime: string = '';

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
     * Provides the value when the position of the video changes.
     */
    private _receiveStatePositionChange: string = '';

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
     * Subcribe the receiveStatePositionChange Signal
     */
    private subReceiveStatePositionChange: string = '';

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
    private originalVideoProperties: any = [];
    private oldReceiveStateSelect: number = -1;
    private receiveStateAttributeCount: number = 0;
    private requestID: number = 0;
    private lastAddedClass: string = '';
    private lastResponseStatus: string = '';
    private fullScreenMode: boolean = false;
    private isSwipeInterval: any;
    private backgroundInterval: any;
    private isSwipeStarted = false;
    private isVideoPublished = false;
    private isOrientationChanged: boolean = false;
    private isPosistionChanged: boolean = false;
    private isFullScreen: boolean = false;
    private isImageReady: boolean = false;
    private isVideoReady: boolean = false;
    private isInitialized: boolean = false;
    private playValue: boolean = true;
    private fromReceiveStatePlay: boolean = false;
    private videoControlsMarginBottom = '';

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


    /**
     * CONSTRUCTOR
     */
    public constructor() {
        super();
        // custom release event
        this.errorEvent = new CustomEvent("error", {
            bubbles: true,
            cancelable: false
        });
        this.isInitialized = true;
    }

    /**
     * To subscribe receive state attributes
     * @param index 
     */
    private subscribeVideos(index: string) {
        this.sendEvent(this.sendEventSelectionChange, index, 'number');
        let responseCount = 0;
        if (this.hasAttribute("receivestateurl")) {
            const rsVURL = this.getAttribute("receivestateurl") as string;
            this.selectObject.values.url = (parseInt(rsVURL, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.url = subscribeState('s', this.selectObject.values.url, (resp: any) => {
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
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.url = '';
            }
        }

        if (this.hasAttribute("receivestatesourcetype")) {
            const rsVSType = this.getAttribute("receivestatesourcetype") as string;
            this.selectObject.values.type = (parseInt(rsVSType, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.type = subscribeState('s', this.selectObject.values.type, (resp: any) => {
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
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.sourceType = '';
            }
        }

        if (this.hasAttribute("receivestateuserid")) {
            const rsVUserId = this.getAttribute("receivestateuserid") as string;
            this.selectObject.values.user = (parseInt(rsVUserId, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.user = subscribeState('s', this.selectObject.values.user, (resp: any) => {
                if (resp) {
                    this.userId = resp;
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
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.userId = '';
            }
        }

        if (this.hasAttribute("receivestatepassword")) {
            const rsVPassword = this.getAttribute("receivestatepassword") as string;
            this.selectObject.values.videoPass = (parseInt(rsVPassword, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.videoPass = subscribeState('s', this.selectObject.values.videoPass, (resp: any) => {
                if (resp) {
                    this.password = resp;
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
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.password = '';
            }
        }

        if (this.hasAttribute("receivestatesnapshoturl")) {
            const rsSIURL = this.getAttribute("receivestatesnapshoturl") as string;
            this.selectObject.values.snapShotUrl = (parseInt(rsSIURL, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.snapShotUrl = subscribeState('s', this.selectObject.values.snapShotUrl, (resp: any) => {
                this.snapShotUrl = resp;
                this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshoturl')) {
                this.password = this.getAttribute('snapshoturl') as string;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.password = '';
            }
        }

        if (this.hasAttribute("receivestatesnapshotrefreshrate")) {
            const rsSIRefreshRate = this.getAttribute("receivestatesnapshotrefreshrate") as string;
            this.selectObject.values.snapShotRefreshRate = (parseInt(rsSIRefreshRate, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.snapShotRefreshRate = subscribeState('n', this.selectObject.values.snapShotRefreshRate, (resp: any) => {
                this.snapShotRefreshRate = resp;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotrefreshrate')) {
                this.password = this.getAttribute('snapshotrefreshrate') as string;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.password = '';
            }
        }

        if (this.hasAttribute("receivestatesnapshotuserid")) {
            const rsSIUserId = this.getAttribute("receivestatesnapshotuserid") as string;
            this.selectObject.values.snapShotUser = (parseInt(rsSIUserId, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.snapShotUser = subscribeState('s', this.selectObject.values.snapShotUser, (resp: any) => {
                this.snapShotUserId = resp;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotuserid')) {
                this.password = this.getAttribute('snapshotuserid') as string;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.password = '';
            }
        }

        if (this.hasAttribute("receivesnapshotimagepassword")) {
            const rsSIPassword = this.getAttribute("receivestatesnapshotpassword") as string;
            this.selectObject.values.snapShotPass = (parseInt(rsSIPassword, 0) + parseInt(this.indexId, 0)).toString();
            this.selectObject.subscriptionIds.snapShotPass = subscribeState('s', this.selectObject.values.snapShotPass, (resp: any) => {
                this.snapShotPassword = resp;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotpassword')) {
                this.password = this.getAttribute('snapshotpassword') as string;
                responseCount++;
                this.matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            } else {
                this.password = '';
            }
        }
    }

    private matchAttributeResponse(attributeCount: number, responseCount: number) {
        if (attributeCount === responseCount) {
            this.videoVisibilityInViewport();
        }
    }


    /**
     * Publish send event
     * 
     * @param signalName name of the signal or join number
     * @param signalValue signal value
     * @param signalType type
     */
    private sendEvent(signalName: string, signalValue: TSignalTypeT, signalType: TSignalTypeT) {
        if (!signalName || (signalValue === null || signalValue === '' || signalValue < 0)) {
            return;
        }

        this.info("sendEventPublish : " + signalName + ", " + signalValue + ", " + signalType);
        switch (signalType) {
            case 'boolean':
                let sigVideoStateBoolean: Ch5Signal<boolean> | null = null;
                sigVideoStateBoolean = Ch5SignalFactory.getInstance().getBooleanSignal(signalName);
                if (sigVideoStateBoolean) {
                    sigVideoStateBoolean.publish(true);
                    sigVideoStateBoolean.publish(false);
                }
                break;
            case 'string':
                let sigVideoStateString: Ch5Signal<string> | null = null;
                sigVideoStateString = Ch5SignalFactory.getInstance().getStringSignal(signalName);
                if (sigVideoStateString) {
                    sigVideoStateString.publish(signalValue);
                }
                break;
            case 'number':
                let sigVideoStateNumber: Ch5Signal<number> | null = null;
                sigVideoStateNumber = Ch5SignalFactory.getInstance().getNumberSignal(signalName);
                if (sigVideoStateNumber) {
                    sigVideoStateNumber.publish(signalValue);
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
        width: number, height: number, zIndex: number): IPUBLISHEVENT {
        return {
            "action": actionStatus,
            "id": uId,
            "credentials": {
                "userid": this._userId,
                "password": this._password
            },
            "source": {
                "type": this._sourceType,
                "url": this._url
            },
            "location": {
                "top": Math.round(xPosition),
                "left": Math.round(yPosition),
                "width": width,
                "height": height,
                "z": zIndex
            }
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
            "top": Math.round(xPosition),
            "left": Math.round(yPosition),
            "width": width,
            "height": height
        };
    }


    /**
     * Getter and Setter functions for each attribute.
     */

    public get indexId(): string {
        return this._indexId;
    }
    public set indexId(value: string) {
        this._indexId = value;
    }

    public get aspectRatio(): string {
        return this._aspectRatio;
    }

    public set aspectRatio(value: string) {
        this._aspectRatio = value;
    }

    public get stretch(): string {
        return this._stretch;
    }

    public set stretch(value: string) {
        this._stretch = value;
    }

    public get userId(): string {
        return this._userId;
    }

    public set userId(value: string) {
        this._userId = value;
    }

    public get snapShotUserId(): string {
        return this._snapShotUserId;
    }
    public set snapShotUserId(value: string) {
        this._snapShotUserId = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(password: string) {
        if (!!password && this.password === password) {
            return;
        }
        this._password = password;
    }

    public get snapShotPassword(): string {
        return this._snapShotPassword;
    }

    public set snapShotPassword(value: string) {
        this._snapShotPassword = value;
    }

    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }

    public get zIndex(): string {
        return this._zIndex;
    }

    public set zIndex(value: string) {
        this._zIndex = value;
    }

    public get controls(): string {
        return this._controls;
    }

    public set controls(value: string) {
        this._controls = value;
    }

    public get sourceType(): string {
        return this._sourceType;
    }

    public set sourceType(value: string) {
        this._sourceType = value;
    }

    public get snapShotUrl(): string {
        return this._snapShotUrl;
    }

    public set snapShotUrl(value: string) {
        this._snapShotUrl = value;
    }

    public get size(): string {
        return this._size;
    }

    public set size(value: string) {
        this._size = value;
    }

    public get snapShotRefreshRate(): string {
        return this._snapShotRefreshRate;
    }

    public set snapShotRefreshRate(value: string) {
        this._snapShotRefreshRate = value;
    }

    /**
     * Getters and Setters for Signals
     */

    public set sendEventOnClick(value: string) {
        this.info('set sendEventOnClick(\'' + value + '\')');
        this._sendEventOnClick = value;
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
        this._sendEventState = value;
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
        this._sendEventSelectionChange = value;
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
        this._sendEventSelectionSourceType = value;
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
        this._sendEventSelectionURL = value;
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
        this._sendEventSnapShotURL = value;
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
        this._sendEventErrorCode = value;
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
        this._sendEventErrorMessage = value;
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
        this._sendEventRetryCount = value;
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
        this._sendEventResolution = value;
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
        this._sendEventSnapShotStatus = value;
        if (('' !== value) && (value !== this._sigNameSnapShotStatus)) {
            this._sigNameSnapShotStatus = value;
            this.setAttribute('sendeventsnapshotstatus', value);
        }
    }

    public get sendStateSnapShotLastUpdateTime(): string {
        return this._sendStateSnapShotLastUpdateTime;
    }

    public set sendStateSnapShotLastUpdateTime(value: string) {
        this.info('Set sendStateSnapShotLastUpdateTime(\'' + value + '\')');
        this._sendStateSnapShotLastUpdateTime = value;
        if (('' !== value) && (value !== this._sigNameSnapShotLastUpdateTime)) {
            this._sigNameSnapShotLastUpdateTime = value;
            this.setAttribute('sendstatesnapshotlastupdatetime', value);
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
        const sigStateVideoCount: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(sigNameStateVideoCount);
        if (sigStateVideoCount) {
            this.subReceiveStateVideoCount = sigStateVideoCount.subscribe((newValue: any) => {
                // TODO
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
                this.fromReceiveStatePlay = true;
                this._receiveStatePlay = newValue.toString();
                this.playValue = newValue;
                if (this._receiveStatePlay === "true" || this._receiveStatePlay !== "false") {
                    this.unsubscribeRefreshImage();
                    this.publishVideoEvent("start");
                } else {
                    this.publishVideoEvent("stop");
                }
            });
        }
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
                this._receiveStateSelect = newValue.toString();
                if (this.oldReceiveStateSelect !== newValue) {
                    this.oldReceiveStateSelect = newValue;
                    if (newValue >= 0 && newValue < 32) {
                        this.unSubscribeVideos(this.selectObject);
                        this.isVideoReady = false;
                        this.lastUpdatedStatus = "";
                        this.subscribeVideos(newValue.toString());
                    }
                }
            });
        }
    }

    public get receiveStatePositionChange(): string {
        return this._receiveStatePositionChange;
    }
    public set receiveStatePositionChange(value: string) {
        this.info('Set receiveStatePositionChange(\'' + value + '\')');
        this._receiveStatePositionChange = value;
        if (value === null
            || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStatePositionChange !== undefined
            && this._receiveStatePositionChange !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePositionChange);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
                .getNumberSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStatePosition: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePositionChange);
        const sigStatePosition: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(sigNameStatePosition);
        if (sigStatePosition) {
            this.subReceiveStatePositionChange = sigStatePosition.subscribe((newValue: any) => {
                if (newValue) {
                    if (this.videoTop === -1 && this.videoLeft === -1) {
                        return;
                    }
                    const videoTop = this.videoTop;
                    const videoLeft = this.videoLeft;
                    if (!this.firstTime) {
                        this.calculatePositions();
                        this._calculation(this.vid);
                        if (videoTop !== this.videoTop || videoLeft !== this.videoLeft) {
                            this.isPosistionChanged = true;
                            this.publishVideoEvent("resize");
                            this.isPosistionChanged = false;
                        }
                    }
                }
            });
        }
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
                if (newValue) {
                    if (newValue === this.sourceType) {
                        return;
                    }
                    this.sourceType = newValue;
                    this.sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                    if (this.isVideoReady) {
                        this.isVideoReady = false;
                        this.lastUpdatedStatus = "stop";
                        this.publishVideoEvent("start");
                    }
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
                if (newValue) {
                    this.snapShotUrl = newValue;
                    this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
                }
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
                if (newValue) {
                    if (newValue === this.url) {
                        return;
                    }
                    this.url = newValue;
                    this.sendEvent(this.sendEventSelectionURL, this.url, 'string');
                    this.isVideoReady = false;
                    this.lastUpdatedStatus = "stop";
                    this.publishVideoEvent("start");
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
                if (newValue) {
                    this.userId = newValue;
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
                if (newValue) {
                    this.userId = newValue;
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
            'sendstatesnapshotlastupdatetime',
            'sendeventstate',

            // receive signals
            'receivestatesnapshoturl',
            'receivestateurl',
            'receivestateplay',
            'receivestateselect',
            'receivestatepositionchange',
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

    protected getTargetElementForCssClassesAndStyle(): HTMLElement {
        return this.vid;
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
                    this.aspectRatio = newValue;
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
                    this._url = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this._url = '';
                }
                break;
            case 'snapshoturl':
                if (this.hasAttribute('snapshoturl')) {
                    this._snapShotUrl = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this._snapShotUrl = '';
                }
                break;
            case 'sourcetype':
                if (this.hasAttribute('sourcetype')) {
                    this.sourceType = newValue;
                    this.receiveStateAttributeCount++;
                } else {
                    this.sourceType = 'Network';
                }
                break;
            case 'size':
                if (this.hasAttribute('size')) {
                    this.size = newValue;
                } else {
                    this.size = 'regular';
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
            case 'sendstatesnapshotlastupdatetime':
                if (this.hasAttribute('sendstatesnapshotlastupdatetime')) {
                    this.sendStateSnapShotLastUpdateTime = newValue;
                } else {
                    this.sendStateSnapShotLastUpdateTime = '';
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
                    this.receiveStatePlay = 'true';
                }
                break;
            case 'receivestateselect':
                if (this.hasAttribute('receivestateselect')) {
                    this.receiveStateSelect = newValue;
                } else {
                    this.receiveStateSelect = '';
                }
                break;
            case 'receivestatepositionchange':
                if (this.hasAttribute('receivestatepositionchange')) {
                    this.receiveStatePositionChange = newValue;
                } else {
                    this.receiveStatePositionChange = '';
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
        if (this.subReceiveStatePositionChange !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStatePositionChange);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStatePositionChange);
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
        if (this.subReceiveStateSnapShotUrl !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStateSnapShotURL);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStateSnapShotUrl);
            }
        }
        if (this.subReceiveStatePositionChange !== '') {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._receiveStatePositionChange);
            if (sigLabel !== null) {
                sigLabel.unsubscribe(this.subReceiveStatePositionChange);
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
        const hasCh5Image = this.querySelector('ch5-image');
        const hasPreLoader = this.querySelector('div.preLoader');
        const videoElements = this.querySelector('.videoElements');
        if (hasCanvas) {
            hasCanvas.remove();
        }
        if (hasCh5Image) {
            hasCh5Image.remove();
        }
        if (hasPreLoader) {
            hasPreLoader.remove();
        }
        if (videoElements) {
            videoElements.remove();
        }
    }

    /**
     * Create the elements in CH5Video tag
     */
    private createCanvas() {
        // Create the canvas
        this.vid = document.createElement('canvas');
        this.videoCanvas = document.createElement("div");
        // Create main control panel
        this.vidControlPanel = document.createElement("div");
        this.vidControlPanel.classList.add("control-panel");
        this.vidControls = document.createElement("div");
        this.vidControls.classList.add("controls");
        this.vidControls.classList.add("main-control");
        // Create div for the left side of the control panel
        this.controlsLeft = document.createElement("div");
        this.controlsLeft.classList.add("controls-left");
        // Create control panel
        this.controlsPlay = document.createElement("a");
        this.controlsPlay.classList.add("controls");
        this.controlsPlay.classList.add("play");
        this.controlsLeft.appendChild(this.controlsPlay);
        // Create div for the right side of the control panel
        this.controlsRight = document.createElement("div");
        this.controlsRight.classList.add("controls-right");
        // Create live card in the control panel
        this.liveCard = document.createElement("div");
        this.liveCard.classList.add("live-card");
        this.liveCard.innerHTML = "&bull; Live";
        this.controlsLeft.appendChild(this.liveCard);
        this.dropupMenu = document.createElement("div");
        this.dropupMenu.classList.add("dropup-menu");
        this.dropupMenu.classList.add("open");
        // Create the element to define the sizes based on the video size
        this.controlsSize = document.createElement("a");
        this.controlsSize.classList.add("control");
        this.controlsSize.classList.add("size");
        this.controlsPlay1 = document.createElement("a");
        this.controlsPlay1.classList.add("controls");
        this.controlsPlay1.classList.add("play");
        // Create fullscreen button in the control panel
        this.faExpand = document.createElement("i");
        this.faExpand.classList.add("svgIcons");
        this.faExpand.innerHTML = this.fullScreenIcon;
        this.faExpand.setAttribute("aria-hidden", "true");
        this.controlsPlay1.appendChild(this.faExpand);
        this.controlsRight.appendChild(this.controlsPlay1);
        this.vidControls.appendChild(this.controlsLeft);
        this.vidControls.appendChild(this.controlsRight);
        this.vidControlPanel.appendChild(this.vidControls);
        this.setControlSize();
        // add primary class
        this.vid.classList.add(this.primaryVideoCssClass);
        this.classList.add(this.videoCssClass);
        this.videoCanvas.classList.add("videoElements");
        this._addDisplayClasses(this.stretch);
        this._addDisplayClasses(this.size);
        if (this.snapShotUrl) {
            this.videoImage = document.createElement("img");
        }
    }

    /**
     * Changing the selected video size 
     */
    private setControlSize() {
        this.vidControls.classList.add(this.size);
        this.controlsPlay.classList.add(this.size);
        this.controlsPlay1.classList.add(this.size);
        this.faExpand.classList.add(this.size);
        this.liveCard.classList.add(this.size);
        if (this.size === "x-small") {
            this.lastAddedClass = "x-small";
        } else if (this.size === "small") {
            this.lastAddedClass = "small";
        } else if (this.size === "regular") {
            this.lastAddedClass = "regular";
        } else if (this.size === "large") {
            this.lastAddedClass = "large";
        } else if (this.size === "x-large") {
            this.lastAddedClass = "x-large";
        } else if (this.size === "xx-large") {
            this.lastAddedClass = "xx-large";
        }
    }

    public connectedCallback() {
        this.info('Ch5Video.connectedCallback()');
        if (this.isInitialized) {
            this.removeIfTagExist();
            customElements.whenDefined('ch5-video').then(() => {
                this.initializeVideo();
                this.isInitialized = false;
            });
        }
        Ch5CoreIntersectionObserver.getInstance().observe(this, this.videoVisibilityInViewport);
    }

    public videoVisibilityInViewport() {
        this.autoHideControls();
        if (this.elementIsInViewPort) {
            this.isSwipeStarted = true;
            this.isSwipeInterval = setTimeout(() => {
                this._calculation(this.vid);
                this.sendEvent(this.sendStateSnapShotLastUpdateTime, this.rfc3339TimeStamp(), 'string');
                if (this.isOrientationChanged) {
                    if (this.isFullScreen) {
                        this.vidControls.style.width = window.innerWidth.toString() + "px";
                    } else {
                        this.calculatePositions();
                    }
                    this.publishVideoEvent("resize");
                    this.isOrientationChanged = false;
                } else {
                    this.calculatePositions();
                    this._receiveStatePlay = 'true';
                    this.publishVideoEvent("start");
                }
            }, 1000);
            window.clearTimeout(this.interval);
        } else {
            clearTimeout(this.backgroundInterval);
            publishEvent('o', 'ch5.video.background', { "action": "refill" });
            if (this.isFullScreen) {
                this._calculation(this.vid);
                this.sendStateSnapShotLastUpdateTime = this.rfc3339TimeStamp();
                this.publishVideoEvent("resize");
            } else {
                if (this.firstTime) {
                    this.firstTime = false;
                }
                if (this.isSwipeStarted) {
                    if (this.isSwipeInterval) {
                        window.clearInterval(this.isSwipeInterval);
                    }
                    this._receiveStatePlay = 'false';
                    this.publishVideoEvent("stop");
                }
            }
        }
    }

    /**
     * Play when the user clicks on the video or play/stop control button
     */
    private manageControls() {
        this.isImageReady = false;
        if (this.isImageReady) {
            this.vidControls.style.display = 'none';
        } else {
            this.vidControls.style.display = 'flex';
        }
        this.sendEvent(this.sendEventOnClick, true, 'boolean');
        this.autoHideControls();
    }

    /**
     * Refresh the snapshot based on the refresh rate
     */
    private loadImageWithAutoRefresh() {
        if (!!this.context) {
            this.context.clearRect(this.position.xPos, this.position.yPos, this.sizeObj.width, this.sizeObj.height);
        }
        this.vid.width = this.sizeObj.width;
        this.vid.height = this.sizeObj.height;
        this.context = this.vid.getContext("2d");
        this._calculation(this.vid);
        this.videoCanvas.appendChild(this.vid);
        this.context.fillStyle = "transparent";
        this.appendChild(this.videoCanvas);
        this.sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
        const videoRefreshRate = parseInt(this.snapShotRefreshRate, 0);
        if (this.snapShotUrl) {
            if (!isNaN(videoRefreshRate) && videoRefreshRate > 0) {
                this.snapShotTimer = setTimeout(() => {
                    this.snapShotOnLoad();
                }, 1000 * videoRefreshRate);
            }
        }
    }

    /**
     * Load the snapshot once on CH5-video load
     */
    private snapShotOnLoad() {
        const videoImage = new Image();
        videoImage.onload = (ev: Event) => {
            this.context.beginPath();
            this.context.drawImage(videoImage, 0, 0);
            this.context.save();
            this.context.restore();
        };
        videoImage.onerror = (ev: Event) => {
            this.sendEvent(this.sendEventSnapShotStatus, 2, 'number');
        }
        videoImage.src = this.snapShotUrl;
    }

    /**
     * Unsubscribe the snapshot image refresh rate
     *
     * @private
     * @memberof Ch5Video
     */
    private unsubscribeRefreshImage() {
        clearTimeout(this.snapShotTimer);
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
            setTimeout(() => {
                this.loadImageWithAutoRefresh();
            }, 1000);
        } else if (!playVal && !this.elementIsInViewPort) {
            this.isVideoReady = true;
            this.isVideoPublished = true;
            this.lastUpdatedStatus = "start";
        }
        this.fromReceiveStatePlay = false;
        return actionType;
    }

    /**
     * Changes the full screen mode through controls
     */
    private fullScreen() {
        if (this.isFullScreen) {
            this.fullScreenMode = false;
            this.vidControls.classList.remove("fullScreen");
            this.controlsPlay.classList.remove("fullScreen");
            this.controlsPlay1.classList.remove("fullScreen");
            this.faExpand.classList.remove("fullScreen");
            this.liveCard.classList.remove("fullScreen");
            this.dropupMenu.style.display = 'block';
            this.setControlSize();
            this.faExpand.innerHTML = '';
            this.faExpand.innerHTML = this.fullScreenIcon;
            this.isFullScreen = false;
            this.zIndex = "0";
            this.sizeObj.width = this.originalVideoProperties.width;
            this.sizeObj.height = this.originalVideoProperties.height;
            this.videoTop = this.originalVideoProperties.top;
            this.videoLeft = this.originalVideoProperties.left;
            this.vidControls.style.position = 'absolute';
            this.vid.width = this.originalVideoProperties.width;
            this.vid.height = this.originalVideoProperties.height;
            this.classList.remove(this.fullScreenStyleClass);
            this.autoHideControls();
            if (this.controls === 'true') {
                document.body.removeChild(this.vidControlPanel);
                this.videoCanvas.style.position = 'relative';
                this.videoCanvas.appendChild(this.vidControlPanel);
                this.setVideoControls();
            }
            if (this.stretch === "true") {
                this.vidControls.style.width = (this.originalVideoProperties.canvasWidth).toString() + "px";
                if (this.aspectRatio === "16:9") {
                    this.vidControls.style.marginBottom = (this.originalVideoProperties.videoControlMarginBottom).toString() + "px";
                }
                this.vidControls.style.marginLeft = (this.originalVideoProperties.videoControlLeft).toString() + "px";
            }
            document.body.style.visibility = "visible";
        } else {
            this.fullScreenMode = true;
            this.vidControls.classList.remove(this.lastAddedClass);
            this.controlsPlay.classList.remove(this.lastAddedClass);
            this.controlsPlay1.classList.remove(this.lastAddedClass);
            this.vidControls.classList.add("fullScreen");
            this.controlsPlay.classList.add("fullScreen");
            this.controlsPlay1.classList.add("fullScreen");
            this.faExpand.classList.remove(this.lastAddedClass);
            this.liveCard.classList.add("fullScreen");
            this.faExpand.classList.add("fullScreen");
            this.dropupMenu.style.display = 'none';
            this.faExpand.innerHTML = '';
            this.faExpand.innerHTML = this.exitFullScreenIcon;
            this.originalVideoProperties = [];
            const vidTop = this.offsetTop + this.sizeObj.height;
            const vidLeft = this.offsetLeft;
            this.originalVideoProperties = {
                "width": this.sizeObj.width,
                "height": this.sizeObj.height,
                "top": this.videoTop,
                "left": this.videoLeft,
                "videoTop": vidTop,
                "videoLeft": vidLeft,
                "videoControlWidth": parseInt(getComputedStyle(this.vidControls).width as string, 0),
                "videoControlHeight": parseInt(getComputedStyle(this.vidControls).height as string, 0),
                "videoControlLeft": parseInt(getComputedStyle(this.vidControls).marginLeft as string, 0),
                "videoControlMarginBottom": parseInt(this.videoControlsMarginBottom, 0),
                "canvasWidth": parseInt(getComputedStyle(this.vid).width as string, 0),
                "canvasHeight": parseInt(getComputedStyle(this.vid).height as string, 0)
            };
            this.isFullScreen = true;
            this.drawCanvas(this.vid);
            this.vidControls.style.position = 'fixed';
            this.vidControls.style.zIndex = '99999';
            this.vidControls.style.bottom = "0";
            this.videoTop = 0;
            this.videoLeft = 0;
            this.zIndex = "1";
            this.classList.add(this.fullScreenStyleClass);
            this.sizeObj.width = window.innerWidth;
            this.sizeObj.height = window.innerHeight;
            this.vidControls.style.display = 'flex';
            this.vidControls.style.visibility = 'visible';
            this.vidControls.style.width = (this.sizeObj.width).toString() + "px";
            this.vid.width = window.innerWidth;
            this.vid.height = window.innerHeight;
            this._calculation(this.vid);
            if (this.controls === 'true') {
                this.videoCanvas.removeChild(this.vidControlPanel);
                document.body.appendChild(this.vidControlPanel);
                this.setVideoControls();
            }
            if (this.stretch === "true") {
                this.vidControls.style.marginLeft = "0";
                if (this.aspectRatio === "16:9") {
                    this.vidControls.style.marginBottom = "0";
                }
            }
            document.body.style.visibility = "hidden";
            this.style.visibility = "visible";
        }
        this.isVideoReady = true;
        this.publishVideoEvent("resize");
    }

    /**
     * To set the width of the video controls
     */
    private setVideoControls() {
        this.vidControls.style.width = this.vid.width.toString() + "px";
    }

    /**
     * To auto hide the controls after particular time
     */
    private autoHideControls() {
        window.setTimeout(() => {
            this.vidControls.style.display = 'none';
        }, this.autoHideControlPeriod * 1000);
    }

    private videoCP(event: Event) {
        event.stopPropagation();
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();
        this.faExpand.addEventListener('click', this.fullScreen.bind(this));
        this.videoCanvas.addEventListener('click', this.manageControls.bind(this));
        this.vidControlPanel.addEventListener('click', this.videoCP.bind(this));

        Ch5Video.EVENT_LIST = Ch5VideoEventHandler.attachWindowEvents();
        const doSubscribe = Ch5Video.EVENT_LIST.subscribe((event: Event) => {
            this.subscriptionEventList.push(doSubscribe);
            if (event.type === EVideoWindowEvents.RESIZE_EVENT) {
                this.isOrientationChanged = true;
                this.videoVisibilityInViewport();
            }
        });
        if (this.snapShotUrl) {
            this.snapShotOnLoad(); // Listeners for snapshot image
        }
    }

    /**
     * Removes listeners
     */
    private removeEvents() {
        super.removeEventListeners();
        this.faExpand.removeEventListener('click', this.fullScreen.bind(this));
        this.videoCanvas.removeEventListener('click', this.manageControls.bind(this));
        this.vidControlPanel.removeEventListener('click', this.videoCP.bind(this));
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
        if (Ch5CoreIntersectionObserver.getInstance() instanceof Ch5CoreIntersectionObserver) {
            Ch5CoreIntersectionObserver.getInstance().unobserve(this);
        }
        this.unSubscribeVideos(this.selectObject);
        this.subscriptionEventList.forEach(subscription => {
            subscription.unsubscribe();
        });
        // Stop the Video
        this.isVideoReady = false;
    }

    /**
     * Returns the height for the given width based on the aspect ratio
     * @param aspectRatio 
     * @param width 
     */
    private _getDisplayWxH(aspectRatio: any, width: number, height: number) {
        let pixelsHeight: number = 0;
        let pixelsWidth: number = 0;
        if (aspectRatio === "16:9" || aspectRatio === "") {
            pixelsHeight = Math.round(width / 16 * 9);
            pixelsWidth = Math.round(height / 9 * 16);
            // Check for minimum width and height
            if (width < 256 || height < 144) {
                width = 256; height = 144;
            }
        } else if (aspectRatio === "4:3") {
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
     * Calculate the display size and return width and height
     * @param {string} videoSize video display size
     * @returns {object} Video Display Size 
     */
    private _addDisplayClasses(videoSize: string) {
        if (this.stretch === "true") {
            this.vid.classList.add(this.videoCssClassPrefix + "--display--" + videoSize);
        } else {
            if (this.aspectRatio === "16:9") {
                this.vid.classList.add(this.videoCssClassPrefix + "--aratio--" + "16x9");
            } else if (this.aspectRatio === "4:3") {
                this.vid.classList.add(this.videoCssClassPrefix + "--aratio--" + "4x3");
            }
        }
        this.vid.classList.add(this.videoCssClassPrefix + "--display--color");
    }

    /**
     * Calculate Canvas Position
     */
    private calculatePositions() {
        if (this.stretch === 'false') {
            this.videoTop = this.videoCanvas.getBoundingClientRect().top;
            this.videoLeft = this.videoCanvas.getBoundingClientRect().left;
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
        this._calculation(video);
        this.videoCanvas.appendChild(this.vid);
        this.context.fillStyle = "transparent";
        if (this.controls === 'true') {
            this.videoCanvas.appendChild(this.vidControlPanel);
            this.setVideoControls();
        }
        this.appendChild(this.videoCanvas);
    }

    /**
     * Cut the canvas to display video
     * @param context
     */
    private cutCanvas2DisplayVideo(context: any) {
        context.clearRect(this.position.xPos, this.position.yPos, this.sizeObj.width, this.sizeObj.height);
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
        if (this.fromReceiveStatePlay) {
            actionType = this.videoScenariosCheck(this.playValue);
        }
        this.responseObj = [];
        switch (actionType) {
            case 'start':
                this.isVideoPublished = true;
                if (this.videoTop < 0 || this.videoLeft < 0) {
                    return;
                }
                this.sendEvent(this.sendEventSelectionURL, this._url, 'string');
                if (!this.isVideoReady && this.lastUpdatedStatus !== 'start' && this._receiveStatePlay !== 'false' && this.url) {
                    publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType,
                        this.ch5UId, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0)));
                    this.info("Video Request (Start) : " + JSON.stringify(this.videoStartObjJSON(actionType,
                        this.ch5UId, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0))));
                    publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(
                        actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height));
                    this.info("Background Request (Start) : " + JSON.stringify(
                        this.videoBGObjJSON(actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height)));
                    this.requestID = this.ch5UId;
                    this.lastUpdatedStatus = actionType;
                } else {
                    this.sendEvent(this.sendEventState, 0, 'number');
                }
                if (!this.isVideoReady) {
                    if (this.videoRequestSubscriptionId) {
                        unsubscribeState('o', 'Csig.video.response', this.videoRequestSubscriptionId);
                    }
                    this.videoRequestSubscriptionId = subscribeState('o', 'Csig.video.response',
                        this.videoResponse.bind(this), this.errorResponse.bind(this));
                    this.isVideoReady = true;
                    this.sendEvent(this.sendEventSnapShotStatus, 0, 'number');
                }
                break;
            case 'stop':
                if (this.videoTop < 0 || this.videoLeft < 0) {
                    return;
                }
                if (!this.isVideoPublished) { // this flag avoids stop command since no video has started
                    return;
                }
                this.isVideoPublished = false;
                if (this.lastUpdatedStatus !== 'stop' && this._receiveStatePlay !== 'true') {
                    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId));
                    this.info("Video Request (Stop) : " + JSON.stringify(this.videoStopObjJSON(actionType, this.ch5UId)));
                    if (this.videoResponseSubscriptionId) {
                        unsubscribeState('o', 'Csig.video.response', this.videoResponseSubscriptionId);
                    }
                    this.videoResponseSubscriptionId = subscribeState('o', 'Csig.video.response',
                        this.videoResponse.bind(this), this.errorResponse.bind(this));
                    this.isVideoReady = false;
                    this.sendEvent(this.sendEventSnapShotStatus, 1, 'number');
                    this.sendEvent(this.sendEventState, 3, 'number');
                    this.lastUpdatedStatus = actionType;
                }
                break;
            case 'resize':
                publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, this.ch5UId, this.videoTop,
                    this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0)));
                this.info("Video Request (Resize) : " + JSON.stringify(this.videoStartObjJSON(actionType,
                    this.ch5UId, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height, parseInt(this.zIndex, 0))));
                if (this.isOrientationChanged || this.isPosistionChanged) {
                    publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(
                        actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height));
                    this.info(JSON.stringify("Background Request (Resize) : " + JSON.stringify(
                        this.videoBGObjJSON(actionType, this.videoTop, this.videoLeft, this.sizeObj.width, this.sizeObj.height))));
                }
                subscribeState('o', 'Csig.video.response', this.videoResponse.bind(this), this.errorResponse.bind(this));
                this.isVideoReady = false;
                this.lastUpdatedStatus = actionType;
                break;
            default:
        }
        this.sendEvent(this.sendEventResolution, this.sizeObj.width + "x" + this.sizeObj.height + "@24fps", 'string');
    }

    private errorResponse(error: any) {
        this.info("Ch5Video - Error when the video response", error);
    }

    /**
     * Video Response on subscribe
     * @param response 
     */
    private videoResponse(response: any) {
        const isMyObjectEmpty = !Object.keys(response).length;

        if (isMyObjectEmpty) {
            this.isVideoReady = false;
            return;
        }

        if (typeof response === "string") {
            this.responseObj = JSON.parse(response);
        } else {
            this.responseObj = response;
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

        // Return if the current status and last status is same, exception while retrying
        if (this.responseObj.status === this.lastResponseStatus &&
            (this.responseObj.status !== "retrying" || this.responseObj.status !== "retrying connection")) {
            return;
        }

        this.info("Video Response : " + JSON.stringify(this.responseObj));
        const responseStatCode: number = this.responseObj.statusCode;
        this.isVideoReady = true;
        const responseStatus = this.responseObj.status.toLowerCase();
        switch (responseStatus.toLowerCase()) {
            case 'stopped':
                this.retryCount = 0;
                this.isVideoReady = false;
                this.isImageReady = true;
                this.sendEvent(this.sendEventState, 1, 'number');
                if (this._indexId || this.receiveStateSelect) {
                    this.loadImageWithAutoRefresh();
                }
                // Unsubscribe when stopped
                if (this.videoResponseSubscriptionId) {
                    unsubscribeState('o', 'Csig.video.response', this.videoResponseSubscriptionId);
                }
                if (this.videoRequestSubscriptionId) {
                    unsubscribeState('o', 'Csig.video.response', this.videoRequestSubscriptionId);
                }
                if (this.videoResizeSubscriptionId) {
                    unsubscribeState('o', 'Csig.video.response', this.videoResizeSubscriptionId);
                }
                break;
            case 'connecting':
                this.isVideoReady = false;
                this.isImageReady = true;
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 4, 'number');
                }
                break;
            case 'buffering':
                this.isVideoReady = false;
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 5, 'number');
                }
                break;
            case 'started':
                this.cutCanvas2DisplayVideo(this.context);
                this.retryCount = 0;
                this.isVideoReady = true;
                this.isImageReady = false;
                this.sendEvent(this.sendEventState, 2, 'number');
                this.unsubscribeRefreshImage();
                // Unsubscribe when started
                if (this.videoResponseSubscriptionId) {
                    unsubscribeState('o', 'Csig.video.response', this.videoResponseSubscriptionId);
                }
                break;
            case 'retrying':
                this.isVideoReady = false;
                this.isImageReady = true;
                if (this.lastUpdatedStatus === 'start') {
                    this.sendEvent(this.sendEventState, 6, 'number');
                }
                this.sendEvent(this.sendEventRetryCount, this.retryCount++, 'number');
                break;
            case 'resizing':
                this.isVideoReady = false;
                this.isImageReady = true;
                break;
            case 'resized':
                if (this.lastUpdatedStatus === "resize") {
                    this._calculation(this.vid);
                    this.cutCanvas2DisplayVideo(this.context);
                    this.isImageReady = false;
                    this.isVideoReady = true;
                    this.unsubscribeRefreshImage();
                }
                break;
            case 'error':
                if (responseStatCode < 0 && responseStatCode >= -10000) {
                    this.publishVideoEvent("start");
                    if (this.lastUpdatedStatus === 'start') {
                        this.sendEvent(this.sendEventState, 7, 'number');
                    }
                    if (this.sendEventErrorCode && this.responseObj.statusCode) {
                        this.sendEvent(this.sendEventErrorCode, this.responseObj.statusCode, 'number');
                    }
                    if (this.sendEventErrorMessage && this.responseObj.status) {
                        this.sendEvent(this.sendEventErrorMessage, this.responseObj.status, 'string');
                    }
                }
                this.isVideoReady = false;
                this.isImageReady = true;
                break;
            default:
                this.isVideoReady = false;
                this.isImageReady = true;
                // Try to start the video when the error code is within the below range
                if (responseStatCode < 0 && responseStatCode >= -10000) {
                    this.publishVideoEvent("start");
                    this.sendEvent(this.sendEventRetryCount, this.retryCount++, 'number');
                }

                // Increment the retryCount and send the feedback
                if (responseStatus === "retrying connection") {
                    this.sendEvent(this.sendEventRetryCount, this.retryCount++, 'number');
                }
                break;
        }
        this.lastResponseStatus = responseStatus;
    }

    /**
     * Calculate the padding space for aspect ratio 4:3
     * @param availableWidth 
     * @param displayWidth 
     */
    private _calculatePillarBoxPadding(availableWidth: number, displayWidth: number) {
        const yPos: number = 0;
        const xPos: number = Math.round((availableWidth - displayWidth) / 2);
        return { xPos, yPos };
    }

    /**
     * Calculate the padding space for aspect ratio 16:9
     * @param availableHeight 
     * @param displayHeight 
     */
    private _calculateLetterBoxPadding(availableHeight: number, displayHeight: number) {
        const xPos: number = 0;
        const yPos: number = Math.round((availableHeight - displayHeight) / 2);
        return { xPos, yPos };
    }

    /**
     * Calculate the size and position of the canvas
     * @param video
     */
    private _calculation(video: HTMLCanvasElement) {
        if (this.stretch === "false") {
            if (this.isFullScreen) {
                const sWidth: number = window.innerWidth;
                const sHeight: number = window.innerHeight;
                const displaySize: { width: number, height: number } = this._getDisplayWxH(this.aspectRatio, sWidth, sHeight);
                if (displaySize.width < sWidth) {
                    this.position = this._calculatePillarBoxPadding(sWidth, displaySize.width);
                } else if (displaySize.height < sHeight) {
                    this.position = this._calculateLetterBoxPadding(sHeight, displaySize.height);
                }
                this.videoTop = this.position.yPos;
                this.videoLeft = this.position.xPos;
                this.sizeObj = displaySize;
            } else {
                // Set the canvas width and height
                if (this.aspectRatio === "16:9") {
                    this.sizeObj = aspectRatio16x9[this.size as keyof typeof aspectRatio16x9] as TDimension;
                } else if (this.aspectRatio === "4:3") {
                    this.sizeObj = aspectRatio4x3[this.size as keyof typeof aspectRatio4x3] as TDimension;
                }
                video.width = this.sizeObj.width;
                video.height = this.sizeObj.height;
            }

        } else {
            let totalWidth: number = 0;
            let totalHeight: number = 0;
            let offsetTop: number = 0;
            let offsetLeft: number = 0;
            if (this.isFullScreen) {
                totalWidth = window.innerWidth;
                totalHeight = window.innerHeight;
            } else {
                if (this.parentElement) {
                    totalWidth = this.parentElement.clientWidth;
                    totalHeight = this.parentElement.clientHeight;
                }
            }
            this.setCanvasDimensions(totalWidth, totalHeight);
            if (this.parentElement) {
                offsetTop = this.parentElement.getBoundingClientRect().top;
                offsetLeft = this.parentElement.getBoundingClientRect().left;
            }
            const displaySize: { width: number, height: number } = this._getDisplayWxH(this.aspectRatio, totalWidth, totalHeight);
            if (displaySize.width < totalWidth) {
                this.position = this._calculatePillarBoxPadding(totalWidth, displaySize.width);
            } else if (displaySize.height < totalHeight) {
                this.position = this._calculateLetterBoxPadding(totalHeight, displaySize.height);
            }

            // Do not add during fullscreen mode
            if (!this.isFullScreen) {
                this.position.xPos += offsetLeft;
                this.position.yPos += offsetTop;
            }

            this.videoTop = this.position.yPos;
            this.videoLeft = this.position.xPos;
            this.sizeObj = displaySize;
            if (!this.isFullScreen) {
                this.vidControls.style.width = this.sizeObj.width + "px";
                this.vidControls.style.marginLeft = (totalWidth - displaySize.width) / 2 + "px";
                this.videoControlsMarginBottom = (displaySize.height - totalHeight) + "px"
            }
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
            this._indexId = this.getAttribute('indexid') as string;
        }
        if (this.hasAttribute('userid')) {
            this._userId = this.getAttribute('userid') as string;
        }
        if (this.hasAttribute('snapshotuserid')) {
            this._snapShotUserId = this.getAttribute('snapshotuserid') as string;
        }
        if (this.hasAttribute('password')) {
            this._password = this.getAttribute('password') as string;
        }
        if (this.hasAttribute('snapshotpassword')) {
            this._snapShotPassword = this.getAttribute('snapshotpassword') as string;
        }
        if (this.hasAttribute('aspectratio')) {
            this._aspectRatio = this.getAttribute('aspectratio') as string;
        }
        if (this.hasAttribute('stretch')) {
            this._stretch = this.getAttribute('stretch') as any;
        }
        if (this.hasAttribute('snapshoturl')) {
            this._snapShotUrl = this.getAttribute('snapshoturl') as string;
        }
        if (this.hasAttribute('url')) {
            this._url = this.getAttribute('url') as string;
        }
        if (this.hasAttribute('sourcetype')) {
            this._sourceType = this.getAttribute('sourcetype') as string;
        }
        if (this.hasAttribute('sendeventonclick')) {
            this._sendEventOnClick = this.getAttribute('sendeventonclick') as string;
        }
        if (this.hasAttribute('sendeventselectionchange')) {
            this._sendEventSelectionChange = this.getAttribute('sendeventselectionchange') as any;
        }
        if (this.hasAttribute('sendeventselectionsourcetype')) {
            this._sendEventSelectionSourceType = this.getAttribute('sendeventselectionsourcetype') as string;
        }
        if (this.hasAttribute('sendeventselectionurl')) {
            this._sendEventSelectionURL = this.getAttribute('sendeventselectionurl') as string;
        }
        if (this.hasAttribute('sendeventsnapshoturl')) {
            this._sendEventSnapShotURL = this.getAttribute('sendeventsnapshoturl') as string;
        }
        if (this.hasAttribute('sendeventstate')) {
            this._sendEventState = this.getAttribute('sendeventstate') as string;
        }
        if (this.hasAttribute('sendeventerrorcode')) {
            this._sendEventErrorCode = this.getAttribute('sendeventerrorcode') as any;
        }
        if (this.hasAttribute('sendeventerrormessage')) {
            this._sendEventErrorMessage = this.getAttribute('sendeventerrormessage') as string;
        }
        if (this.hasAttribute('sendeventretrycount')) {
            this._sendEventRetryCount = this.getAttribute('sendeventretrycount') as any;
        }
        if (this.hasAttribute('sendeventresolution')) {
            this._sendEventResolution = this.getAttribute('sendeventresolution') as string;
        }
        if (this.hasAttribute('sendeventsnapshotstatus')) {
            this._sendEventSnapShotStatus = this.getAttribute('sendeventsnapshotstatus') as any;
        }
        if (this.hasAttribute('sendstatesnapshotlastupdatetime')) {
            this._sendStateSnapShotLastUpdateTime = this.getAttribute('sendstatesnapshotlastupdatetime') as any;
        }
        if (this.hasAttribute('receivestatevideocount')) {
            this._receiveStateVideoCount = this.getAttribute('receivestatevideocount') as any;
        }
        if (this.hasAttribute('receivestateplay')) {
            this._receiveStatePlay = this.getAttribute('receivestateplay') as any;
        }
        if (this.hasAttribute('receivestateselect')) {
            this._receiveStateSelect = this.getAttribute('receivestateselect') as any;
        }
        if (this.hasAttribute('receivestatepositionchange')) {
            this._receiveStatePositionChange = this.getAttribute('receivestatepositionchange') as any;
        }
        if (this.hasAttribute('receivestateurl')) {
            this._receiveStateUrl = this.getAttribute('receivestateurl') as string;
        }
        if (this.hasAttribute('receivestatesourcetype')) {
            this._receiveStateSourceType = this.getAttribute('receivestatesourcetype') as string;
        }
        if (this.hasAttribute('receivestatesnapshoturl')) {
            this._receiveStateSnapShotURL = this.getAttribute('receivestatesnapshotURL') as string;
        }
        if (this.hasAttribute('receivestatesnapshotrefreshrate')) {
            this._receiveStateSnapShotRefreshRate = this.getAttribute('receivestatesnapshotrefreshrate') as any;
        }
        if (this.hasAttribute('receivestateuserid')) {
            this._receiveStateUserId = this.getAttribute('receivestateuserid') as string;
        }
        if (this.hasAttribute('receivestatesnapshotuserid')) {
            this._receiveStateSnapShotUserId = this.getAttribute('receivestatesnapshotuserid') as string;
        }
        if (this.hasAttribute('receivestatepassword')) {
            this._receiveStatePassword = this.getAttribute('receivestatepassword') as string;
        }
        if (this.hasAttribute('receivestatesnapshotpassword')) {
            this._receiveStateSnapShotPassword = this.getAttribute('receivestatesnapshotpassword') as string;
        }
        if (this.hasAttribute('size')) {
            this._size = this.getAttribute('size') as string;
        }
        if (this.hasAttribute('zindex')) {
            this._zIndex = this.getAttribute('zindex') as string;
        }
        if (this.hasAttribute('controls')) {
            this._controls = this.getAttribute('controls') as string;
        }
        if (this.hasAttribute('snapshotrefreshrate')) {
            this._snapShotRefreshRate = this.getAttribute('snapshotrefreshrate') as string;
        }
    }
}

/**
 * Create a custom element
 */
if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-video', Ch5Video);
}

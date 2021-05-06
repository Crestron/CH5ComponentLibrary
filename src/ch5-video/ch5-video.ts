// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory, subscribeState, unsubscribeState } from "../ch5-core";
import { ICh5VideoAttributes } from "../_interfaces/ch5-video/i-ch5-video-attributes";
import { iElementDimensions, iTouchOrdinates, TDimension, TReceiveState, TSnapShotSignalName } from "../_interfaces/ch5-video/types";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { IPUBLISHEVENT, IBACKGROUND } from '../_interfaces/ch5-video/types/t-ch5-video-publish-event-request';
import { TCh5ProcessUriParams } from "../_interfaces/ch5-common/types/t-ch5-process-uri-params";
import { Subscription } from "rxjs";
import { Ch5VideoSubscription } from "./ch5-video-subscription";
import { Ch5VideoSnapshot } from "./ch5-video-snapshot";
import { isSafariMobile } from "../ch5-core/utility-functions/is-safari-mobile";
import { getScrollableParent } from "../ch5-core/get-scrollable-parent";
import isNil from "lodash/isNil";
import _ from "lodash";
import { CH5VideoUtils } from "./ch5-video-utils";

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

    //#region Variables

    /**
     * SVG Icons for the controls
     */
    private readonly ESVG_ICONS = {
        PLAY_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
        STOP_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 6h12v12H6z"/></svg>',
        EXIT_FULLSCREEN_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
        FULLSCREEN_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
        SCREEN_PLAY_ICON: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
        SCREEN_STOP_ICON: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 6h12v12H6z"/></svg>'
    }

    private readonly INTERSECTION_RATIO_VALUE: number = 0.98;
    private readonly primaryVideoCssClass: string = 'ch5-video';
    private readonly fullScreenStyleClass: string = 'fullScreenStyle'
    private readonly showControl: string = 'show-control';
    private readonly fullScreenBodyClass: string = 'ch5-video-fullscreen';
    private _videoErrorMessages = new Map<number, string>();
    private snapShotMap = new Map();
    private _performanceMap = new Map();
    private _appBgTimer: number = 0;
    private _wasAppBackGrounded: boolean = false;
    private _appCurrentStatus: boolean = false;
    private _scrollableElm: HTMLElement = {} as HTMLElement;
    private _isSlideMoved: boolean = false;
    private readonly VIDEO_ACTION = {
        START: 'start',
        STARTED: 'started',
        STOP: 'stop',
        RESIZE: 'resize',
        RESIZED: 'resized',
        REFILL: 'refill',
        SNAPSHOT: 'snapshot',
        MARK: 'mark',
        NOURL: 'nourl',
        FULLSCREEN: 'fullscreen',
        ERROR: 'error'
    }

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
     * Define HTML Elements
     */
    private vid: HTMLCanvasElement = {} as HTMLCanvasElement;
    private videoElement: HTMLDivElement = {} as HTMLDivElement;
    private videoParentElement: HTMLElement = {} as HTMLElement;
    private vidControlPanel: HTMLElement = {} as HTMLElement;
    private controlFullScreen: HTMLElement = {} as HTMLElement;
    private fullScreenOverlay: HTMLElement = {} as HTMLElement;
    private snapShotTimer: any;
    private exitSnapsShotTimer: any;
    private exitTimer: number = 0;
    private videoSubscriptionTimer: any;
    private isMultipleVideo: boolean = false; // Check whether receiveState is present

    private subscriptionEventList: Subscription[] = [];
    private sizeObj: TDimension = { width: 0, height: 0 };
    private position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
    private retryCount: number = 0;
    private errorCount: number = 0;
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
    private responseObj: any = [];
    private firstTime: boolean = true;
    private lastRequestStatus: string = '';
    private lastBackGroundRequest: string = '';
    private autoHideControlPeriod: number = 10;
    private originalPotraitVideoProperties: any = [];
    private originalLandscapeVideoProperties: any = [];
    private originalVideoProperties: any = [];
    private oldReceiveStateSelect: number = -1;
    private receiveStateAttributeCount: number = 0;
    private requestID: number = 0;
    private lastResponseStatus: string = '';
    private isSwipeDebounce: any;
    // private backgroundInterval: any; // HH : commenting cos not used anywhere
    private isVideoPublished = false;
    private isOrientationChanged: boolean = false;
    private isFullScreen: boolean = false;
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
    private lastLoadedImage: any;
    private isIntersectionObserve: boolean = false;
    private vidleft: number = 0;
    private vidTop: number = 0;
    private isAlphaBlend: boolean = true;
    private controlTimer: any;
    private controlTop: number = -1;
    private controlLeft: number = -1;
    private scrollTimer: any;
    private isExitFullscreen: boolean = false;
    private isPositionChanged: boolean = false;
    private oldResponseStatus: string = '';
    private oldResponseId: number = 0;
    private subsCsigAppCurrentSate: string = '';
    private subsCsigAppBackgrounded: string = '';
    private receivedStateSelect: number = 0;
    private isSnapShotArrayLoaded: boolean = false; // used when receivestatevideocount is present
    private maxVideoCount: number = 0;
    private lastRequestUrl: string = '';
    private fromExitFullScreen: boolean = false;
    private videoTagId: string = '';
    private orientationCount: number = 0;
    private landscapeOrientationTimeout: any;
    private previousXPos: number = 0;
    private previousYPos: number = 0;
    private observeInterval: any;

    // touch specific [params]
    private isTouchStartEvtBound: boolean = false;
    private isTouchEndEvtBound: boolean = false;
    private isTouchInProgress: boolean = false;
    private touchCoordinates: iTouchOrdinates = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    }; // instantiating empty object to proceed

    /**
     * Protocol for authentication in order to get the image
     *
     * @type {string}
     */
    private _protocol: string = '';

    //#endregion

    //#region Getter and Setter functions for each attribute

    /**
     * Provides the name of the offset identifier to substituted with 0 based index of the item in list within the signal names provided in other attributes surrounded by {{ }} delimiters.   
     * This component is 0-based. 
     */
    public get indexId(): string {
        return this._indexId;
    }

    public set indexId(value: string) {
        if (isNil(value)) {
            this.isMultipleVideo = false;
            return;
        }
        this.isMultipleVideo = true;
        this._indexId = value;
    }

    /**
     * Sets the ratio of width to height of the video.  
     * Width and height of the component to be controlled by css style classes.  
     * Values are 16:9 (default), 4:3, and custom. 
     * When size of container is not match the aspect ratio, the full height or the full width should be used and the dimension that is not full should be centered.  
     * In other words, use letterbox or pillerbox logic to place the video component view.  
     * This attribute only defines the size of the component within the project, it does not define the size of video displayed within the component.
     */
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
        this._stretch = String(value).toLowerCase();
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
        let rRate = parseInt(value, 0);
        rRate = (rRate < 5) ? 5 : rRate;
        this._snapShotRefreshRate = rRate.toString();
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
        if ((value !== '') && (value !== this._sigNameSendOnClick)) {
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
        if ((value !== '') && (value !== this._sigNameEventState)) {
            this._sigNameEventState = value;
            this.setAttribute('sendeventstate', value);
        }
    }

    public get sendEventSelectionChange(): string {
        return this._sigNameSelectionChange;
    }

    public set sendEventSelectionChange(value: string) {
        this.info('Set sendEventSelectionChange(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameSelectionChange)) {
            this._sigNameSelectionChange = value;
            this.setAttribute('sendeventselectionchange', value);
        }
    }

    public get sendEventSelectionSourceType(): string {
        return this._sigNameSelectionSourceType;
    }

    public set sendEventSelectionSourceType(value: string) {
        this.info('Set sendEventSelectionSourceType(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameSelectionSourceType)) {
            this._sigNameSelectionSourceType = value;
            this.setAttribute('sendeventselectionsourcetype', value);
        }
    }

    public get sendEventSelectionURL(): string {
        return this._sigNameSelectionUrl;
    }

    public set sendEventSelectionURL(value: string) {
        this.info('Set sendEventSelectionURL(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameSelectionUrl)) {
            this._sigNameSelectionUrl = value;
            this.setAttribute('sendeventselectionurl', value);
        }
    }

    public get sendEventSnapShotURL(): string {
        return this._sigNameSnapShotUrl;
    }

    public set sendEventSnapShotURL(value: string) {
        this.info('Set sendEventSnapShotURL(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameSnapShotUrl)) {
            this._sigNameSnapShotUrl = value;
            this.setAttribute('sendeventsnapshoturl', value);
        }
    }

    public get sendEventErrorCode(): string {
        return this._sigNameErrorCode;
    }

    public set sendEventErrorCode(value: string) {
        this.info('Set sendEventErrorCode(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameErrorCode)) {
            this._sigNameErrorCode = value;
            this.setAttribute('sendeventerrorcode', value);
        }
    }

    public get sendEventErrorMessage(): string {
        return this._sigNameErrorMessage;
    }

    public set sendEventErrorMessage(value: string) {
        this.info('Set sendEventErrorMessage(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameErrorMessage)) {
            this._sigNameErrorMessage = value;
            this.setAttribute('sendeventerrormessage', value);
        }
    }

    public get sendEventRetryCount(): string {
        return this._sigNameRetryCount;
    }

    public set sendEventRetryCount(value: string) {
        this.info('Set sendEventRetryCount(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameRetryCount)) {
            this._sigNameRetryCount = value;
            this.setAttribute('sendeventretrycount', value);
        }
    }

    public get sendEventResolution(): string {
        return this._sigNameResolution;
    }

    public set sendEventResolution(value: string) {
        this.info('Set sendEventResolution(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameResolution)) {
            this._sigNameResolution = value;
            this.setAttribute('sendeventresolution', value);
        }
    }

    public get sendEventSnapShotStatus(): string {
        return this._sigNameSnapShotStatus;
    }

    public set sendEventSnapShotStatus(value: string) {
        this.info('Set sendEventSnapShotStatus(\'' + value + '\')');
        if ((value !== '') && (value !== this._sigNameSnapShotStatus)) {
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
        if ((value !== '') && (value !== this._sigNameSnapShotLastUpdateTime)) {
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

        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateVideoCount !== undefined && this._receiveStateVideoCount !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateVideoCount);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateVideoCount);
            }
        }

        // setup new subscription.
        const sigNameStateVideoCount: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateVideoCount);
        const sigStateVideoCount: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(sigNameStateVideoCount);
        if (sigStateVideoCount) {
            this.subReceiveStateVideoCount = sigStateVideoCount.subscribe((newValue: any) => {
                this.info('receiveStateVideoCount Signal Subscribe Value: ' + newValue);
                this.maxVideoCount = parseInt(newValue, 0);
                if (!this.isSnapShotArrayLoaded && this.maxVideoCount > 0) {
                    this.info('this.isSnapShotArrayLoaded: ' + this.isSnapShotArrayLoaded);
                    this.info('this.maxVideoCount: ' + this.maxVideoCount);
                    this.isSnapShotArrayLoaded = true;
                    this.getAllSnapShotData(this.maxVideoCount);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStatePlay !== undefined && this._receiveStatePlay !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePlay);
            const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStatePlay);
            }
        }

        // setup new subscription.
        const sigNameStatePlay: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePlay);
        const sigStatePlay: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(sigNameStatePlay);
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
                    this._calculation(this.videoElement);
                    // this._calculatePositions();
                    this.isVideoReady = false;
                    this.lastRequestStatus = this.VIDEO_ACTION.STOP;
                    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && !this.isFullScreen) {
                        // RAGS
                        this.info("*** 9");
                        this._publishVideoEvent(this.VIDEO_ACTION.START);
                    } else if (this.isFullScreen) {
                        // RAGS
                        this.info("*** 10");
                        this._publishVideoEvent(this.VIDEO_ACTION.START);
                    }
                } else {
                    this.isVideoReady = true;
                    this.lastRequestStatus = this.VIDEO_ACTION.START;
                    this._publishVideoEvent(this.VIDEO_ACTION.STOP);
                    this._loadImageWithAutoRefresh();
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
        if (this._receiveStateSelect !== undefined && this._receiveStateSelect !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSelect);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateSelect);
            }
        }

        // setup new subscription.
        const sigNameStateSelect: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSelect);
        const sigStateSelect: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(sigNameStateSelect);
        if (sigStateSelect) {
            this.subReceiveStateSelect = sigStateSelect.subscribe((newValue: number) => {
                this.info('receiveStateSelect Signal Subscribe Value: ' + newValue);
                this._receiveStateSelect = newValue.toString();
                if (this.oldReceiveStateSelect !== newValue) {
                    this.oldReceiveStateSelect = newValue;
                    this.receivedStateSelect = newValue;
                    this.drawSnapShot();
                    this._unSubscribeVideos(this.selectObject);
                    this.isVideoReady = false;
                    this.lastRequestStatus = "";

                    clearTimeout(this.videoSubscriptionTimer);
                    this.videoSubscriptionTimer = setTimeout(() => {
                        this._subscribeVideos(newValue.toString());
                    }, 0);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSourceType !== undefined && this._receiveStateSourceType !== '') {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSourceType);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSourceType: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSourceType);
        const sigStateSourceType: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStateSourceType);
        if (sigStateSourceType) {
            this.subReceiveStateSourceType = sigStateSourceType.subscribe((newValue: string) => {
                this.info('receiveStateSourceType Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    if (newValue === this.sourceType) {
                        return;
                    }
                    this.sourceType = newValue;
                    this._sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                    setTimeout(() => {
                        if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
                            this.lastResponseStatus = '';
                            this.isVideoReady = false;
                            this.lastRequestStatus = '';
                            this.isExitFullscreen = false;
                            // RAGS
                            this.info("*** 1");
                            this._publishVideoEvent(this.VIDEO_ACTION.START);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotRefreshRate !== undefined) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotRefreshRate);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotRefreshRate: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotRefreshRate);
        const sigStateSnapShotRefreshRate: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(sigNameStateSnapShotRefreshRate);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotURL !== undefined && this._receiveStateSnapShotURL !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotURL);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotUrl: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotURL);
        const sigStateSnapShotUrl: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStateSnapShotUrl);
        if (sigStateSnapShotUrl) {
            this.subReceiveStateSnapShotUrl = sigStateSnapShotUrl.subscribe((newValue: string) => {
                this.info('receiveStateSnapShotUrl Signal Subscribe Value: ' + newValue);
                this.snapShotUrl = newValue;
                this._sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
            });
        }
    }

    public get receiveStateUrl(): string {
        return this._attributeValueAsString('receivestateurl');
    }

    public set receiveStateUrl(value: string) {
        this._receiveStateUrl = value;
        this.info('Set receiveStateUrl(\'' + value + '\')');
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateUrl !== undefined && this._receiveStateUrl !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateUrl: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
        const sigStateUrl: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStateUrl);
        if (sigStateUrl) {
            this.subReceiveStateUrl = sigStateUrl.subscribe((newValue: string) => {
                this.info('receiveStateUrl Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    if (newValue === this.url) {
                        return;
                    }
                    this.url = newValue;
                    this._sendEvent(this.sendEventSelectionURL, this.url, 'string');
                    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
                        this.lastResponseStatus = '';
                        this.isVideoReady = false;
                        this.lastRequestStatus = '';
                        this.isExitFullscreen = false;
                        // Rags - We cannot stop and start as we want to have the old video playing.
                        // if (!(this.lastResponseStatus === this.VIDEO_ACTION.STARTED || this.lastResponseStatus === this.VIDEO_ACTION.RESIZED)) {
                        //                            this.publishVideoEvent(this.VIDEO_ACTION.STOP);
                        // }
                        // RAGS
                        this.info("*** 2");
                        this._publishVideoEvent(this.VIDEO_ACTION.START);
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
        if (this._receiveStateUserId !== undefined && this._receiveStateUserId !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUserId);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateUserId: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUserId);
        const sigStateUserId: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStateUserId);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotUserId !== undefined && this._receiveStateSnapShotUserId !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotUserId);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotUserId: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotUserId);
        const sigStateSnapShotUserId: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStateSnapShotUserId);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStatePassword !== undefined && this._receiveStatePassword !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePassword);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStatePassword: string = Ch5Signal.getSubscriptionSignalName(this._receiveStatePassword);
        const sigStatePassword: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStatePassword);
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
        if (value === null || value === undefined) {
            return;
        }

        // clean up old subscription
        if (this._receiveStateSnapShotPassword !== undefined && this._receiveStateSnapShotPassword !== null) {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotPassword);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldSigName);
            if (oldSignal !== null) {
                oldSignal.unsubscribe('');
            }
        }

        // setup new subscription.
        const sigNameStateSnapShotPassword: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateSnapShotPassword);
        const sigStateSnapShotPassword: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigNameStateSnapShotPassword);
        if (sigStateSnapShotPassword) {
            this.subReceiveStateSnapShotPassword = sigStateSnapShotPassword.subscribe((newValue: string) => {
                this.info('receiveStateSnapShotPassword Signal Subscribe Value: ' + newValue);
                if (newValue) {
                    this.snapShotPassword = newValue;
                }
            });
        }
    }

    //#endregion

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
        this._setErrorMessages(); // Initializes all the error messages
        subscribeState('o', 'Csig.video.response', this._videoResponse.bind(this), this._errorResponse.bind(this)); // Rags - understand more
    }

    public connectedCallback() {
        this.info('Ch5Video.connectedCallback()');
        if (this.isInitialized) {
            this.removeIfTagExist(); // Rags - check if really required
            customElements.whenDefined('ch5-video').then(() => {
                this._scrollableElm = getScrollableParent(this); // TODO: Is not working in all the scenarios
                this._initializeVideo();
                this.isInitialized = false;
                this._initiateSubscriptions();
                if (!this.isMultipleVideo) {
                    this.getAllSnapShotData(1);
                }
                // Making the lastRequestStatus and isVideoReady to default
                this.lastRequestStatus = '';
                this.isVideoReady = false;
            });
        }
        this.videoParentElement = this.querySelector('#video-page') as HTMLElement; // initializing the parent
        Ch5CoreIntersectionObserver.getInstance().observe(this, this.videoIntersectionObserver);
        this.isIntersectionObserve = true;
        if (!this.isTouchStartEvtBound &&
            !!this.videoParentElement && this.videoParentElement != null && !!this.videoParentElement.classList) {
            this.isTouchStartEvtBound = true;
            this.videoParentElement.addEventListener('touchstart', this._handleTouchStartEvent_Swipe.bind(this));
        }
    }

    /**
     * Function to handle the subscrptions of state w.r.t video
     */
    private _initiateSubscriptions() {
        // HH : 
        subscribeState('b', 'triggerview.slidemove', (res: boolean) => {
            if (res) {
                if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'initiateSubscriptions');
                }
                this._isSlideMoved = true;
            }
        });
        subscribeState('b', 'triggerview.touchend', (res: boolean) => {
            if (res && this._isSlideMoved) {
                let timer: any;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (this.elementIntersectionEntry.intersectionRatio > 0.5) {
                        // Send the start request to avoid the second start request from intersection observer
                        // RAGS
                        this.info("*** 8");
                        this._publishVideoEvent(this.VIDEO_ACTION.START);
                    }
                    this._isSlideMoved = false;
                }, 1000);
            }
        });
        subscribeState('b', 'triggerview.slidechange', (res: boolean) => {
            if (res && this.elementIsInViewPort) {
                if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'triggerview.slidechange');
                }
                this._publishVideoEvent(this.VIDEO_ACTION.STOP);
            }
        });
    }

    /**
     * Called every time the element is removed from the DOM. 
     * Useful for running clean up code.
     */
    public disconnectedCallback() {
        this.info('Ch5Video.disconnectedCallback()');
        this.unsubscribeFromSignals();
        this._removeEvents();
        // disconnect common mutation observer
        this._unSubscribeVideos(this.selectObject);
        this.subscriptionEventList.forEach(subscription => {
            subscription.unsubscribe();
        });
        this._clearAllSnapShots();
        this.isVideoReady = true;
        this.lastRequestStatus = this.VIDEO_ACTION.START;
        // When the user navigates from video page to another page, stop has to be sent
        // Stop the Video
        this._publishVideoEvent(this.VIDEO_ACTION.STOP);

        // Disconnecting the intersection observer
        if (Ch5CoreIntersectionObserver.getInstance() instanceof Ch5CoreIntersectionObserver) {
            Ch5CoreIntersectionObserver.getInstance().unobserve(this);
            this.isIntersectionObserve = false;
        }
    }

    /**
     * Create the Video JSON object to start the video
     * @param actionType 
     * @param xPosition 
     * @param yPosition 
     * @param width 
     * @param height 
     * @param zIndex 
     */
    public videoStartObjJSON(actionType: string, logInfo: string): IPUBLISHEVENT {
        const uId: number = this.ch5UId;
        const xPosition: number = this.videoTop;
        const yPosition: number = this.videoLeft;
        const width: number = this.sizeObj.width;
        const height: number = this.sizeObj.height;
        const zIndex: number = parseInt(this.zIndex, 0);
        const alphaBlend: boolean = this.isAlphaBlend;
        const d = new Date();
        const startTime: number = d.getMilliseconds();
        const endTime: number = d.getMilliseconds() + 2000;
        this.lastRequestStatus = actionType;

        actionType = (actionType === this.VIDEO_ACTION.FULLSCREEN) ? this.VIDEO_ACTION.RESIZE : actionType;

        // HH : this needs to be false only after rendering video once
        // making it true here, since it needs to be updated after the publish event is successful
        if (this.firstTime) {
            setTimeout(() => {
                this.firstTime = false;
            }, 0);
        }

        const retObj = {
            "action": actionType,
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

        this.info(logInfo + JSON.stringify(retObj));
        return retObj;
    }

    /**
     * Create the Video JSON object to stop the video
     * @param actionType 
     * @param uId 
     * @param xPosition 
     * @param yPosition 
     * @param width 
     * @param height 
     * @param zIndex 
     */
    public videoStopObjJSON(actionType: string, uId: number): IPUBLISHEVENT {
        this.lastRequestStatus = actionType;
        return {
            "action": actionType,
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
    private videoBGObjJSON(actionStatus: string): IBACKGROUND {
        const retObj: IBACKGROUND = {
            "action": actionStatus,
            "id": this.videoTagId,
            "top": Math.ceil(this.videoTop),
            "left": Math.ceil(this.videoLeft),
            "width": Math.ceil(this.sizeObj.width),
            "height": Math.ceil(this.sizeObj.height),
            "image": {} as HTMLImageElement
        };

        if (actionStatus === this.VIDEO_ACTION.SNAPSHOT) {
            const sData: Ch5VideoSnapshot = this.snapShotMap.get(this.receivedStateSelect);
            retObj.image = sData.getSnapShot();
        }

        return retObj;
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
        this.info("attributeChangedCallback");
        switch (attr) {
            case 'indexid':
                this.indexId = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('indexid'), newValue, '0');
                break;
            case 'userid':
                this.userId = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('userid'), newValue, '');
                if (this.hasAttribute('userid')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'snapshotuserid':
                this.snapShotUserId = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('snapshotuserid'), newValue, '');
                if (this.hasAttribute('snapshotuserid')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'password':
                this.password = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('password'), newValue, '');
                if (this.hasAttribute('password')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'snapshotpassword':
                this.snapShotPassword = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('snapshotpassword'), newValue, '');
                if (this.hasAttribute('snapshotpassword')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'aspectratio':
                if (this.hasAttribute('aspectratio')) {
                    if (newValue === '16:9' || newValue === '4:3') {
                        this.aspectRatio = newValue;
                    } else {
                        this.aspectRatio = '16:9';
                    }
                } else {
                    this.aspectRatio = '16:9';
                }
                break;
            case 'stretch':
                this.stretch = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('stretch'), newValue, 'false');
                break;
            case 'snapshotrefreshrate':
                this.snapShotRefreshRate = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('snapshotrefreshrate'), newValue, '0');
                if (this.hasAttribute('snapshotrefreshrate')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'url':
                this.url = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('url'), newValue, '');
                if (this.hasAttribute('url')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'snapshoturl':
                this.snapShotUrl = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('snapshoturl'), newValue, '');
                if (this.hasAttribute('snapshoturl')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'sourcetype':
                this.sourceType = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sourcetype'), newValue, 'Network');
                if (this.hasAttribute('sourcetype')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'size':
                this.size = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('size'), newValue, 'large');
                break;
            case 'zindex':
                this.zIndex = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('zindex'), newValue, '0');
                break;
            case 'controls':
                this.controls = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('controls'), newValue, 'false');
                break;
            case 'sendeventstate':
                this.sendEventState = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventstate'), newValue, '');
                break;
            case 'sendeventonclick':
                this.sendEventOnClick = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventonclick'), newValue, '');
                break;
            case 'sendeventselectionchange':
                this.sendEventSelectionChange = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventselectionchange'), newValue, '');
                break;
            case 'sendeventselectionsourcetype':
                this.sendEventSelectionSourceType = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventselectionsourcetype'), newValue, '');
                if (this.hasAttribute('sendeventselectionsourcetype')) {
                    this._sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                }
                break;
            case 'sendeventsnapshoturl':
                this.sendEventSnapShotURL = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventsnapshoturl'), newValue, '');
                if (this.hasAttribute('sendeventsnapshoturl')) {
                    this._sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
                }
                break;
            case 'sendeventselectionurl':
                this.sendEventSelectionURL = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventselectionurl'), newValue, '');
                if (this.hasAttribute('sendeventselectionurl')) {
                    this._sendEvent(this.sendEventSelectionURL, this.url, 'string');
                }
                break;
            case 'sendeventerrorcode':
                this.sendEventErrorCode = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventerrorcode'), newValue, '');
                if (this.hasAttribute('sendeventerrorcode')) {
                    this.sendEventErrorCode = newValue;
                }
                break;
            case 'sendeventerrormessage':
                this.sendEventErrorMessage = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventerrormessage'), newValue, '');
                break;
            case 'sendeventretrycount':
                this.sendEventRetryCount = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventretrycount'), newValue, '');
                break;
            case 'sendeventresolution':
                this.sendEventResolution = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventresolution'), newValue, '0x0@0fps');
                break;
            case 'sendeventsnapshotstatus':
                this.sendEventSnapShotStatus = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventsnapshotstatus'), newValue, '');
                break;
            case 'sendeventsnapshotlastupdatetime':
                this.sendEventSnapShotLastUpdateTime = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('sendeventsnapshotlastupdatetime'), newValue, '');
                break;
            case 'receivestatevideocount':
                this.receiveStateVideoCount = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatevideocount'), newValue, '');
                break;
            case 'receivestateplay':
                this.receiveStatePlay = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestateselect'), newValue, '');
                break;
            case 'receivestateselect':
                this.receiveStateSelect = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestateselect'), newValue, '');
                break;
            case 'receivestateurl':
                this.receiveStateUrl = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestateurl'), newValue, '');
                if (this.hasAttribute('receivestateurl')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestatesourcetype':
                this.receiveStateSourceType = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatesourcetype'), newValue, '');
                if (this.hasAttribute('receivestatesourcetype')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestatesnapshoturl':
                this.receiveStateSnapShotURL = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatesnapshoturl'), newValue, '');
                if (this.hasAttribute('receivestatesnapshoturl')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestatesnapshotrefreshrate':
                this.receiveStateSnapShotRefreshRate = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatesnapshotrefreshrate'), newValue, '');
                if (this.hasAttribute('receivestatesnapshotrefreshrate')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestateuserid':
                this.receiveStateUserId = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestateuserid'), newValue, '');
                if (this.hasAttribute('receivestateuserid')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestatesnapshotuserid':
                this.receiveStateSnapShotUserId = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatesnapshotuserid'), newValue, '');
                if (this.hasAttribute('receivestatesnapshotuserid')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestatepassword':
                this.receiveStatePassword = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatepassword'), newValue, '');
                if (this.hasAttribute('receivestatepassword')) {
                    this.receiveStateAttributeCount++;
                }
                break;
            case 'receivestatesnapshotpassword':
                this.receiveStateSnapShotPassword = CH5VideoUtils.setAttributesBasedValue(this.hasAttribute('receivestatesnapshotpassword'), newValue, '');
                if (this.hasAttribute('receivestatesnapshotpassword')) {
                    this.receiveStateAttributeCount++;
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
        const videoWrapper = this.querySelector('.video-wrapper');
        if (videoWrapper) {
            videoWrapper.remove();
        }
    }

    /**
     * Check the snapshot url and append web protocol and credentials to it
     */
    public processSingleVideoUri(): void {
        this.info("this.protocol", this.protocol);
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
     * When the video element is more than 100% visible the video should start and
     * when the visibility is less than 100% the video should stop playing.
     */
    public videoIntersectionObserver() {
        this.info("videoIntersectionObserver");
        if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
            clearTimeout(this.observeInterval);
            if (this.firstTime) {
                // Time delay is required otherwise there will be an earlier cut
                this.observeInterval = setTimeout(() => {
                    this._onRatioAboveLimitToRenderVideo();
                }, 500);
            } else {
                this.observeInterval = setTimeout(() => {
                    this._onRatioAboveLimitToRenderVideo();
                }, 30);
            }
        } else {
            this._OnVideoAspectRatioConditionNotMet();
            // // This is called when the video component page is exited
            // if (this.lastResponseStatus === this.VIDEO_ACTION.STARTED) {
            //     this.ch5BackgroundAction(this.VIDEO_ACTION.STOP, 'OnVideoAspectRatioConditionNotMet');
            // }
            // this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'OnVideoAspectRatioConditionNotMet');
        }
    }

    /**
     * Function to render video if it is under the visible range | supposed to be shown 
     * this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE
     */
    private _onRatioAboveLimitToRenderVideo() {
        this.info("Task: Under ratio, render video - ",
            this.lastRequestStatus, this.isFullScreen, this.isExitFullscreen,
            this.fromExitFullScreen, this.isOrientationChanged);
        clearTimeout(this.isSwipeDebounce);
        this.isSwipeDebounce = setTimeout(() => {
            this._calculation(this.videoElement);
            // this._calculatePositions();

            // if (!this.isMultipleVideo) {
                this.drawSnapShot();
            // }

            let isPublished = false;
            if (this.lastRequestStatus === '' && this.isOrientationChanged ||
                this.lastRequestStatus === this.VIDEO_ACTION.START) {
                this.lastResponseStatus = '';
                this.lastRequestStatus = '';
                this.isVideoReady = false;
                isPublished = true;
                this._publishVideoEvent(this.VIDEO_ACTION.START);
            }
            if (!this.isFullScreen && !this.isExitFullscreen && !this.isOrientationChanged &&
                this.lastRequestStatus !== this.VIDEO_ACTION.FULLSCREEN && !this.fromExitFullScreen) {
                this.lastResponseStatus = '';
                this.lastRequestStatus = '';
                this.isVideoReady = false;
                if (!isPublished) {
                    this._publishVideoEvent(this.VIDEO_ACTION.START);
                }
            }
        }, 300); // TODO: Check whether this can be reduced by testing in all devices
    }

    /**
     * Function to render video if it is lesser than the necessary visible range | supposed to be hidden
     * this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE
     */
    private _OnVideoAspectRatioConditionNotMet() {
        // when the fullscreen is triggered in
        if (this.isFullScreen) {
            return;
        }
        // TODO : if the component is already in the required state (stopped | playing), continue
        this.info("Task: Video to be stopped.");

        if (this.isSwipeDebounce) {
            window.clearTimeout(this.isSwipeDebounce);
        }

        // During scroll, video goes out of the view port area but still running because of negative values in TSW
        if ((this.videoTop < 0 || this.videoLeft < 0) && this.lastRequestStatus !== this.VIDEO_ACTION.STOP && !this.firstTime) {
            this.info("HH logger 1");
            this._publishVideoEvent(this.VIDEO_ACTION.STOP);
        }

        // During scroll, video goes out of the view port area but still running because of negative values in iOS
        if (this.isPositionChanged && (this.lastRequestStatus === this.VIDEO_ACTION.RESIZE || this.lastRequestStatus === this.VIDEO_ACTION.START)) {
            this.info("HH logger 2");
            this._publishVideoEvent(this.VIDEO_ACTION.STOP);
        }

        // On exiting fullscreen and if the user swipes/leave the video page send the this.VIDEO_ACTION.STOP request
        if (this.isExitFullscreen && this.lastResponseStatus === this.VIDEO_ACTION.RESIZED && !this.elementIsInViewPort) {
            this.info("HH logger 3");
            this._publishVideoEvent(this.VIDEO_ACTION.STOP);
        }

        // In some of the iOS devices, there is a delay in getting orientation 
        // change information, a small delay solves this problem.
        // setTimeout(() => {
        if (!this.firstTime && !this.isExitFullscreen && !this.isPositionChanged) {
            // Avoid refilling when the project starts and the video page is not visible
            // isFullScreen and isExitFullscreen is added to avoid refill on full screen and on exit full screen
            if (!this.isFullScreen && this.lastResponseStatus !== this.VIDEO_ACTION.FULLSCREEN) {
                if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'OnVideoAspectRatioConditionNotMet');
                }
            }

            // The above refill can't be called inside this block as it produces an additional 
            // unecessary cut in the background sometimes.
            if (!this.isOrientationChanged && !this.elementIsInViewPort && !this.fromExitFullScreen) {
                this.info("HH logger 4");
                this._publishVideoEvent(this.VIDEO_ACTION.STOP);
            }
        }
        // });
    }

    /**
     * When the user makes the app to background by clicking on home button 
     * from video page and resume the app, the video has to play again
     */
    private _updateAppBackgroundStatus() {
        if (this.subsCsigAppBackgrounded !== '') {
            unsubscribeState('o', 'Csig.app.background', this.subsCsigAppBackgrounded);
        }
        this.subsCsigAppBackgrounded = subscribeState('o', 'Csig.app.background', (res: any) => {
            this._wasAppBackGrounded = res.isAppBackgrounded;
        });
    }

    /**
     * Get the app background status when the app goes to background
     */
    private _appCurrentBackgroundStatus() {
        if (this.subsCsigAppCurrentSate !== '') {
            unsubscribeState('o', 'Csig.app.background', this.subsCsigAppCurrentSate);
        }
        this.subsCsigAppCurrentSate = subscribeState('o', 'Csig.app.background', (res: any) => {
            this._appCurrentStatus = res.isAppBackgrounded;
        });
    }

    /**
     * Create the elements in CH5Video tag
     */
    private createHTMLElements() {
        this.classList.add(this.primaryVideoCssClass);
        this.style.width = "100%";
        this.style.height = "100%";
        this.videoElement = document.createElement("div");
        // Create main control panel
        this.vidControlPanel = document.createElement("div");
        this.vidControlPanel.classList.add("control-panel");
        // Create div for the right side of the control panel
        this.controlFullScreen = document.createElement("a");
        this.controlFullScreen.classList.add("control");
        this.controlFullScreen.innerHTML = this.ESVG_ICONS.FULLSCREEN_ICON;
        this.vidControlPanel.appendChild(this.controlFullScreen);

        this.videoElement.classList.add('video-wrapper');
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.appendChild(this.videoElement);

        this.videoElement.appendChild(this.vidControlPanel);

        if (!document.getElementById("fullScreenOverlay")) {
            this.fullScreenOverlay = document.createElement("div");
            this.fullScreenOverlay.setAttribute("id", "fullScreenOverlay");
            document.body.appendChild(this.fullScreenOverlay);
        }
    }

    /**
     * Get all the data of the snapshots based on the video count provided
     * @param videoCount 
     */
    private getAllSnapShotData(vCount: number) {
        if (vCount === 0) {
            return;
        }
        for (let idx = 0; idx < vCount; idx++) {
            const snapShotObject: TSnapShotSignalName = {
                "index": 0,
                "snapShotUrl": "",
                "snapShotRefreshRate": "",
                "snapShotUser": "",
                "snapShotPass": "",
                "isMultipleVideo": this.isMultipleVideo
            };
            snapShotObject.index = idx;

            if (this.isMultipleVideo) {
                snapShotObject.snapShotUrl = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshoturl', this.receiveStateSnapShotURL, idx, this.indexId as string));
                snapShotObject.snapShotUser = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestateuserid', this.receiveStateSnapShotUserId, idx, this.indexId as string));
                snapShotObject.snapShotPass = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotpassword', this.receiveStateSnapShotPassword, idx, this.indexId as string));
                snapShotObject.snapShotRefreshRate = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotrefreshrate', this.receiveStateSnapShotRefreshRate, idx, this.indexId as string));
            } else {
                snapShotObject.snapShotUrl = this.snapShotUrl;
                snapShotObject.snapShotUser = this.snapShotUserId;
                snapShotObject.snapShotUser = this.snapShotPassword;
                snapShotObject.snapShotRefreshRate = this.snapShotRefreshRate;
            }
            this.snapShotMap.set(idx, new Ch5VideoSnapshot(snapShotObject));
        }
    }

    /**
     * Clear all the video snapshots
     */
    private _clearAllSnapShots() {
        if (this.maxVideoCount) {
            for (let idx = 0; idx < this.maxVideoCount; idx++) {
                const sData: Ch5VideoSnapshot = this.snapShotMap.get(idx);
                sData.stopLoadingSnapShot();
            }
        }
    }

    /**
     * Play when the user clicks on the video or play/stop control button
     */
    private _manageControls() {
        if (this.isFullScreen) {
            this.videoElement.removeEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, false);
            if (!this.isTouchStartEvtBound &&
                !!this.videoParentElement && this.videoParentElement != null && !!this.videoParentElement.classList) {
                this.isTouchStartEvtBound = true;
                this.videoParentElement.addEventListener('touchstart', this._handleTouchStartEvent_Swipe.bind(this));
            }
            this._exitFullScreen();
            return;
        }

        this.info('lastRequestStatus is ' + this.lastRequestStatus + ' & lastResponseStatus is ' + this.lastResponseStatus);
        if (this.lastResponseStatus === this.VIDEO_ACTION.STARTED ||
            this.lastRequestStatus === this.VIDEO_ACTION.RESIZE ||
            this.lastResponseStatus === this.VIDEO_ACTION.RESIZED) {
            this._showFullScreenIcon();
        } else {
            this._hideFullScreenIcon();
        }
        this._sendEvent(this.sendEventOnClick, true, 'boolean');
        this._autoHideControls();
    }

    /**
     * Refresh the snapshot based on the refresh rate, for single video component
     */
    private _loadImageWithAutoRefresh() {
        this._sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
        const videoRefreshRate = parseInt(this.snapShotRefreshRate, 0);
        if (!isNaN(videoRefreshRate) && videoRefreshRate > 0) {
            this._unsubscribeRefreshImage();
            this.snapShotTimer = setInterval(() => {
                if (this.snapShotUserId && this.snapShotPassword && !this.snapShotUrl.indexOf("http")) {
                    this.processSingleVideoUri();
                }
                if (this.snapShotUrl !== '') {
                    this._snapShotOnLoad();
                } else {
                    this._unsubscribeRefreshImage();
                }
            }, 1000 * videoRefreshRate);
        }
    }

    /**
     * Set the video error messages for the respective error code / status code
     */
    private _setErrorMessages() {
        this._videoErrorMessages.set(1, "Miscellaneous transient issue");
        this._videoErrorMessages.set(2, "Connection timeout");
        this._videoErrorMessages.set(3, "No input sync");
        this._videoErrorMessages.set(-1, "Miscellaneous error");
        this._videoErrorMessages.set(-2, "Hostname could not be resolved");
        this._videoErrorMessages.set(-3, "Unsupported source type for this platform");
        this._videoErrorMessages.set(-4, "Connection timeout");
        this._videoErrorMessages.set(-5, "Invalid credentials");
        this._videoErrorMessages.set(-6, "Unsupported streaming protocol");
        this._videoErrorMessages.set(-7, "Unsupported codec");
        this._videoErrorMessages.set(-1001, "Credentials required");
        this._videoErrorMessages.set(-1002, "Hostname invalid");
        this._videoErrorMessages.set(-1003, "Unsupported codec");
        this._videoErrorMessages.set(-9001, "Unsupported source type");
        this._videoErrorMessages.set(-9002, "Invalid URL");
        this._videoErrorMessages.set(-9003, "Request for greater than maximum simultaneous sessions per source type");
        this._videoErrorMessages.set(-9004, "Request for greater than maximum simultaneous sessions per device");
    }

    /**
     * To subscribe receive state attributes
     * @param index 
     */
    private _subscribeVideos(index: string) {
        this._hideFullScreenIcon();
        this._sendEvent(this.sendEventSelectionChange, index, 'number');
        let responseCount = 0;

        if (this.hasAttribute("receivestateurl")) {
            const rsVURL = this.getAttribute("receivestateurl") as string;
            this.info('rsVURL: ' + rsVURL);
            let selectObjectUrl: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectUrl = Ch5VideoSubscription.getNewSignalName(this, 'receivestateurl', rsVURL, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.url = String(selectObjectUrl);
            this.info('selectObjectUrl: ' + selectObjectUrl);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.url = subscribeState('s', String(selectObjectUrl), (resp: any) => {
                if (resp) {
                    this._sendEvent(this.sendEventSelectionURL, this.url, 'string');
                    this.url = resp;
                } else if (this.hasAttribute('url')) {
                    this.url = this.getAttribute('url') as string;
                } else {
                    this.url = '';
                }
                this.info('ReceiveStateSelect Url is ' + this.url);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('url')) {
                this.url = this.getAttribute('url') as string;
            } else {
                this.url = '';
            }
            this.info('Basic Url is ' + this.url);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesourcetype")) {
            const rsVSType = this.getAttribute("receivestatesourcetype") as string;
            this.info('rsVSType: ' + rsVSType);
            let selectObjectSourceType: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectSourceType = Ch5VideoSubscription.getNewSignalName(this, 'receivestatesourcetype', rsVSType, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.type = String(selectObjectSourceType);
            this.info('selectObjectSourceType: ' + selectObjectSourceType);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.type = subscribeState('s', String(selectObjectSourceType), (resp: any) => {
                if (resp) {
                    this.sourceType = resp;
                    this._sendEvent(this.sendEventSelectionSourceType, this.sourceType, 'string');
                } else if (this.hasAttribute('sourcetype')) {
                    this.sourceType = this.getAttribute('sourcetype') as string;
                } else {
                    this.sourceType = '';
                }
                this.info('ReceiveStateSelect Source Type is ' + this.sourceType);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('sourcetype')) {
                this.sourceType = this.getAttribute('sourcetype') as string;
            } else {
                this.sourceType = '';
            }
            this.info('Basic Source Type is ' + this.sourceType);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestateuserid")) {
            const rsVUserId = this.getAttribute("receivestateuserid") as string;
            this.info('rsVUserId: ' + rsVUserId);
            let selectObjectUserId: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectUserId = Ch5VideoSubscription.getNewSignalName(this, 'receivestateuserid', rsVUserId, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.user = String(selectObjectUserId);
            this.info('selectObjectUserId: ' + selectObjectUserId);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.user = subscribeState('s', String(selectObjectUserId), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.userId = resp.trim();
                } else if (this.hasAttribute('userid')) {
                    this.userId = this.getAttribute('userid') as string;
                } else {
                    this.userId = '';
                }
                this.info('ReceiveStateSelect UserId is ' + this.userId);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('userid')) {
                this.userId = this.getAttribute('userid') as string;
            } else {
                this.userId = '';
            }
            this.info('Basic UserId is ' + this.url);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatepassword")) {
            const rsVPassword = this.getAttribute("receivestatepassword") as string;
            this.info('rsVPassword: ' + rsVPassword);
            let selectObjectPassword: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectPassword = Ch5VideoSubscription.getNewSignalName(this, 'receivestatepassword', rsVPassword, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.videoPass = String(selectObjectPassword);
            this.info('selectObjectPassword: ' + selectObjectPassword);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.videoPass = subscribeState('s', String(selectObjectPassword), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.password = resp.trim();
                } else if (this.hasAttribute('password')) {
                    this.password = this.getAttribute('password') as string;
                } else {
                    this.password = '';
                }
                this.info('ReceiveStateSelect Password is ' + this.password);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('password')) {
                this.password = this.getAttribute('password') as string;
            } else {
                this.password = '';
            }
            this.info('Basic Password is ' + this.password);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshoturl")) {
            const rsSIURL = this.getAttribute("receivestatesnapshoturl") as string;
            this.info('rsSIURL: ' + rsSIURL);
            let selectObjectSnapShotUrl: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectSnapShotUrl = Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshoturl', rsSIURL, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotUrl = String(selectObjectSnapShotUrl);
            this.info('selectObjectSnapShotUrl: ' + selectObjectSnapShotUrl);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.snapShotUrl = subscribeState('s', String(selectObjectSnapShotUrl), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.snapShotUrl = resp.trim();
                    this._sendEvent(this.sendEventSnapShotURL, this.snapShotUrl, 'string');
                } else if (this.hasAttribute('snapshoturl')) {
                    this.snapShotUrl = this.getAttribute('snapshoturl') as string;
                } else {
                    this.snapShotUrl = '';
                }
                this.info('ReceiveStateSelect SnapShot Url is ' + this.snapShotUrl);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshoturl')) {
                this.snapShotUrl = this.getAttribute('snapshoturl') as string;
            } else {
                this.snapShotUrl = '';
            }
            this.info('Basic SnapShot Url is ' + this.snapShotUrl);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshotrefreshrate")) {
            const rsSIRefreshRate = this.getAttribute("receivestatesnapshotrefreshrate") as string;
            this.info('rsSIRefreshRate: ' + rsSIRefreshRate);
            let selectObjectSnapShotRefreshRate: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectSnapShotRefreshRate = Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotrefreshrate', rsSIRefreshRate, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotRefreshRate = String(selectObjectSnapShotRefreshRate);
            this.info('selectObjectSnapShotRefreshRate: ' + selectObjectSnapShotRefreshRate);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.snapShotRefreshRate = subscribeState('n', String(selectObjectSnapShotRefreshRate), (resp: any) => {
                if (resp) {
                    this.snapShotRefreshRate = resp;
                } else if (this.hasAttribute('snapshotrefreshrate')) {
                    this.snapShotRefreshRate = this.getAttribute('snapshotrefreshrate') as string;
                } else {
                    this.snapShotRefreshRate = '';
                }
                this.info('ReceiveStateSelect SnapShot Refresh Rate is ' + this.snapShotRefreshRate);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotrefreshrate')) {
                this.snapShotRefreshRate = this.getAttribute('snapshotrefreshrate') as string;
            } else {
                this.snapShotRefreshRate = '';
            }
            this.info('Basic SnapShot Refresh Rate is ' + this.snapShotRefreshRate);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshotuserid")) {
            const rsSIUserId = this.getAttribute("receivestatesnapshotuserid") as string;
            this.info('rsSIUserId: ' + rsSIUserId);
            let selectObjectSnapShotUserId: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectSnapShotUserId = Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotuserid', rsSIUserId, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotUser = String(selectObjectSnapShotUserId);
            this.info('selectObjectSnapShotUserId: ' + selectObjectSnapShotUserId);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.snapShotUser = subscribeState('s', String(selectObjectSnapShotUserId), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.snapShotUserId = resp.trim();
                } else if (this.hasAttribute('snapshotuserid')) {
                    this.snapShotUserId = this.getAttribute('snapshotuserid') as string;
                } else {
                    this.snapShotUserId = '';
                }
                this.info('ReceiveStateSelect SnapShot UserId is ' + this.snapShotUserId);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotuserid')) {
                this.snapShotUserId = this.getAttribute('snapshotuserid') as string;
            } else {
                this.snapShotUserId = '';
            }
            this.info('Basic SnapShot UserId is ' + this.snapShotUserId);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }

        if (this.hasAttribute("receivestatesnapshotpassword")) {
            const rsSIPassword = this.getAttribute("receivestatesnapshotpassword") as string;
            this.info('rsSIPassword: ' + rsSIPassword);
            let selectObjectSnapShotPassword: string | number | undefined = 0;
            if (this.indexId !== null) {
                // Append or concatanate the index provided with the receive state join number
                selectObjectSnapShotPassword = Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotpassword', rsSIPassword, (parseInt(index, 0)), this.indexId as string);
            }
            this.selectObject.values.snapShotPass = String(selectObjectSnapShotPassword);
            this.info('selectObjectSnapShotPassword: ' + selectObjectSnapShotPassword);
            // Subscribe signalname and get the value
            this.selectObject.subscriptionIds.snapShotPass = subscribeState('s', String(selectObjectSnapShotPassword), (resp: any) => {
                if (!!resp && resp.length >= 0) {
                    this.snapShotPassword = resp.trim();
                } else if (this.hasAttribute('snapshotpassword')) {
                    this.snapShotPassword = this.getAttribute('snapshotpassword') as string;
                } else {
                    this.snapShotPassword = '';
                }
                this.info('ReceiveStateSelect SnapShot Password is ' + this.snapShotPassword);
                responseCount++;
                this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
            });
        } else {
            if (this.hasAttribute('snapshotpassword')) {
                this.snapShotPassword = this.getAttribute('snapshotpassword') as string;
            } else {
                this.snapShotPassword = '';
            }
            this.info('Basic SnapShot Password is ' + this.snapShotPassword);
            responseCount++;
            this._matchAttributeResponse(this.receiveStateAttributeCount, responseCount);
        }
    }

    /**
     * Checks whether the attribute count and receiveState attributes count w.r.t receiveStateSelect matches,
     * if matches this.VIDEO_ACTION.START video request will be sent to play the video
     * @param attributeCount 
     * @param responseCount 
     */
    private _matchAttributeResponse(attributeCount: number, responseCount: number) {
        if (attributeCount === responseCount) {
            if (this.elementIsInViewPort) {
                if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
                    this.lastResponseStatus = '';
                    this.isVideoReady = false;
                    this.lastRequestStatus = '';
                    this.isExitFullscreen = false;
                    // RAGS
                    this.info("*** 5");
                    this._publishVideoEvent(this.VIDEO_ACTION.START);
                }
            }
        }
    }

    /**
     * Stop loading snapshot when the camera is about to play video
     * @param activeIndex 
     */
    private stopLoadingSnapShot(): void {
        for (let idx = 0; idx < this.maxVideoCount; idx++) {
            const sData: Ch5VideoSnapshot = this.snapShotMap.get(this.receivedStateSelect);
            if (this.receivedStateSelect === idx) {
                sData.stopLoadingSnapShot();
            } else {
                sData.startLoadingSnapShot();
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
    private _sendEvent(signalName: string, signalValue: TSignalTypeT, signalType: TSignalTypeT) {
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
    private _unSubscribeVideos(selectObject: TReceiveState) {
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
     * Initializes the elements of ch5-video
     */
    private _initializeVideo() {
        this.createHTMLElements();
        this.initAttributes();
        this.cacheComponentChildrens();
        this.attachEventListeners();
        this.setAttribute("id", this.getCrId());
        const uID = this.getCrId().split('cr-id-');
        this.ch5UId = parseInt(uID[1], 0);
        this.videoTagId = this.getCrId();
        // A dummy call to make the video to play on first project load
        publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(this.VIDEO_ACTION.STOP, this.ch5UId));
    }

    /**
     * Draw the snapshot on the background
     */
    private drawSnapShot() {
        // return if not visible, exit timer
        if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
            if (this.snapShotMap.size > 0) {
                const sData: Ch5VideoSnapshot = this.snapShotMap.get(this.receivedStateSelect);
                if (sData.getSnapShotStatus()) {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.SNAPSHOT, 'drawSnapShot#1');
                    this._sendEvent(this.sendEventSnapShotStatus, this.receivedStateSelect, 'number');
                } else {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.MARK, 'drawSnapShot#2');
                }
            }
            clearTimeout(this.exitSnapsShotTimer);
            const refreshRate: number = parseInt(this.snapShotRefreshRate, 0);
            this.exitSnapsShotTimer = setTimeout(() => {
                this.info("Snapshot refreshed with new image");
                this.drawSnapShot();
            }, 1000 * refreshRate);
        } else {
            clearTimeout(this.exitSnapsShotTimer);
            return;
        }
    }

    /**
     * Load the snapshot once on CH5-video load`
     */
    private _snapShotOnLoad() {
        const videoImage = new Image();
        videoImage.onload = () => {
            this.info("Snapshot image loaded");
            this.lastLoadedImage = videoImage;
            this._sendEvent(this.sendEventSnapShotLastUpdateTime, CH5VideoUtils.rfc3339TimeStamp(), 'string');
        };
        videoImage.onerror = () => {
            this.info(videoImage.src);
            this.info("Error occurred while rendering the image");
            this._sendEvent(this.sendEventSnapShotStatus, 2, 'number');
        }
        videoImage.src = this.snapShotUrl + "?" + new Date().getTime().toString();
    }

    /**
     * Unsubscribe the snapshot image refresh rate
     * @private
     * @memberof Ch5Video
     */
    private _unsubscribeRefreshImage() {
        clearInterval(this.snapShotTimer);
    }

    /**
     * Checks the 4 scenarios of receiveStatePlay value and Element Visibility
     * @param playVal 
     */
    private _videoScenariosCheck(playVal: boolean) {
        let actionType: string = this.VIDEO_ACTION.STOP;
        if (playVal && this.elementIsInViewPort) {
            this.isVideoReady = false;
            this.lastRequestStatus = this.VIDEO_ACTION.STOP;
            actionType = this.VIDEO_ACTION.START;
        } else if (playVal && !this.elementIsInViewPort) {
            this.isVideoReady = true;
            this.isVideoPublished = true;
            this.lastRequestStatus = this.VIDEO_ACTION.START;
        } else if (!playVal && this.elementIsInViewPort) {
            this.isVideoPublished = true;
            this.isVideoReady = false;
            this.lastRequestStatus = this.VIDEO_ACTION.START;
            actionType = this.VIDEO_ACTION.STOP;
        } else if (!playVal && !this.elementIsInViewPort) {
            this.isVideoReady = true;
            this.isVideoPublished = true;
            this.lastRequestStatus = this.VIDEO_ACTION.START;
        }
        return actionType;
    }

    /**
     * When the video exit from the full screen
     */
    private _exitFullScreen() {
        this.info('Ch5Video.exitFullScreen()');
        this.vidControlPanel.classList.remove("fullScreen");
        // When the Orientation change completes
        if (!!this.fullScreenOverlay && !!this.fullScreenOverlay.classList) {
            this.fullScreenOverlay.classList.remove(this.primaryVideoCssClass + '--overlay');
        }
        this.controlFullScreen.innerHTML = '';
        this.controlFullScreen.innerHTML = this.ESVG_ICONS.FULLSCREEN_ICON;
        this.zIndex = "0";
        this.classList.remove(this.fullScreenStyleClass);
        this._autoHideControls();
        document.body.classList.remove(this.fullScreenBodyClass);
        this.style.visibility = '';
        this.isVideoReady = true;
        this.isOrientationChanged = false;
        this.isExitFullscreen = true;
        this.isFullScreen = false;
        clearTimeout(this.scrollTimer);
        window.clearTimeout(this.exitTimer);
        // Restoring the originalPotraitVideoProperties values, avoid recalculation
        this.exitTimer = window.setTimeout(() => {
            this._resetSizeConfigObjPostFullScreen();
            this._publishVideoEvent(this.VIDEO_ACTION.RESIZE);
        }, 0);
    }

    /**
     * Function to reset the config object for size and position objects stored at instance level
     */
    private _resetSizeConfigObjPostFullScreen() {
        if (Object.keys(this.originalVideoProperties).length > 0) {
            this.sizeObj.width = this.originalVideoProperties.width;
            this.sizeObj.height = this.originalVideoProperties.height;
            this.videoTop = this.originalVideoProperties.top;
            this.videoLeft = this.originalVideoProperties.left;
            if (this.parentElement) {
                const parentElementDimensions: iElementDimensions = CH5VideoUtils.getParentElementOffsetAndDimension(this.parentElement);
                this._getSizeAndPositionObj(parentElementDimensions.totalWidth, parentElementDimensions.totalHeight);
                this.controlTop = this.position.yPos;
                this.controlLeft = this.position.xPos;
            }
        } else {
            this._calculation(this.videoElement);
        }

        // Suresh: The below code needs to be uncommented, now the fullscreen exit functionality is not working
        // as expected.

        // HH : The entire code below is commented cos they essentially did the same update - handled above
        // if (isSafariMobile()) {
        //     if (ch5VideoUtils.isPortrait()) {
        //         if (Object.keys(this.originalPotraitVideoProperties).length > 0) {
        //             this.sizeObj.width = this.originalPotraitVideoProperties.width;
        //             this.sizeObj.height = this.originalPotraitVideoProperties.height;
        //             this.videoTop = this.originalPotraitVideoProperties.top;
        //             this.videoLeft = this.originalPotraitVideoProperties.left;
        //             // this._setCanvasDimensions(this.originalPotraitVideoProperties.width, this.originalPotraitVideoProperties.height);
        //         } else {
        //             this._calculation(this.videoElement);
        //         }
        //     } else if (ch5VideoUtils.isLandscape()) {
        //         if (Object.keys(this.originalLandscapeVideoProperties).length > 0) {
        //             this.sizeObj.width = this.originalLandscapeVideoProperties.width;
        //             this.sizeObj.height = this.originalLandscapeVideoProperties.height;
        //             this.videoTop = this.originalLandscapeVideoProperties.top;
        //             this.videoLeft = this.originalLandscapeVideoProperties.left;
        //             // this._setCanvasDimensions(this.originalLandscapeVideoProperties.width, this.originalLandscapeVideoProperties.height);
        //         } else {
        //             this._calculation(this.videoElement);
        //         }
        //     }
        // } else {
        //     if (Object.keys(this.originalVideoProperties).length > 0) {
        //         this.sizeObj.width = this.originalVideoProperties.width;
        //         this.sizeObj.height = this.originalVideoProperties.height;
        //         this.videoTop = this.originalVideoProperties.top;
        //         this.videoLeft = this.originalVideoProperties.left;
        //         // this._setCanvasDimensions(this.originalVideoProperties.width, this.originalVideoProperties.height);
        //     } else {
        //         this._calculation(this.videoElement);
        //     }
        // }
    }

    /**
     * Changes the full screen mode through controls
     */
    private _handleTouchMoveEvent_Fullscreen(ev: Event) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    }

    /**
     * Function to handle touch start actions
     * removed during fullscreen mode
     * should update manager if background needs to be hidden or redrawn etc
     */
    private _handleTouchStartEvent_Swipe() {
        this.isTouchInProgress = false;
        const ev = event as TouchEvent;
        this.touchCoordinates.startX = ev.touches[0].clientX;
        this.touchCoordinates.startY = ev.touches[0].clientY;
        if (!this.isTouchEndEvtBound) {
            this.isTouchEndEvtBound = true;
            this.videoParentElement.addEventListener('touchmove', this._handleTouchMoveEvent_Swipe.bind(this));
            this.videoParentElement.addEventListener('touchend', this._handleTouchEndEvent_Swipe.bind(this));
        }
    }

    /**
     * Function to handle touch start actions
     * removed during fullscreen mode
     * should update manager if background needs to be hidden or redrawn etc
     */
    private _handleTouchMoveEvent_Swipe() {
        if (!this.isTouchInProgress) {
            this.isTouchInProgress = true;
            const ev = event as TouchEvent;
            this.touchCoordinates.endX = ev.touches[0].clientX;
            this.touchCoordinates.endY = ev.touches[0].clientY;
            this.info('HH TEST : Touch move triggered');
            // TODO HH : Need to calculate the difference between the start and end values 
            // and run the "this._OnVideoAspectRatioConditionNotMet()" method to refill the background
            const xCord = Math.abs(this.touchCoordinates.endX - this.touchCoordinates.startX);
            const yCord = Math.abs(this.touchCoordinates.endY - this.touchCoordinates.startY);
            if (xCord > 20 || yCord > 20) {
                this._OnVideoAspectRatioConditionNotMet();
            }
        }
    }

    /**
     * Function to handle touch end actions
     * removed during fullscreen mode
     * should update manager if background needs to be hidden or redrawn etc
     */
    private _handleTouchEndEvent_Swipe() {
        this.isTouchInProgress = false;
        this.info('HH TEST : Coords - ', JSON.stringify(this.touchCoordinates));
        if (this.isTouchEndEvtBound) {
            this.isTouchEndEvtBound = false;
            this._onRatioAboveLimitToRenderVideo();
            this.videoParentElement.removeEventListener('touchmove', this._handleTouchMoveEvent_Swipe, false);
            this.videoParentElement.removeEventListener('touchend', this._handleTouchEndEvent_Swipe, false);
        }
    }

    /**
     * When the video goes to the full screen
     */
    private _enterFullScreen() {
        // TODO: check how can we optimize later
        if (this.isFullScreen) {
            this._exitFullScreen();
        } else {
            this.info('Ch5Video.enterFullScreen()');
            if (!!this.fullScreenOverlay && !!this.fullScreenOverlay.classList) {
                this.fullScreenOverlay.classList.add(this.primaryVideoCssClass + '--overlay');
            }

            this.isFullScreen = true;
            // To avoid swiping on the full screen
            this.videoElement.addEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, { passive: true });
            this.isTouchStartEvtBound = false;
            this.isTouchEndEvtBound = false;
            if (!!this.videoParentElement && this.videoParentElement != null && !!this.videoParentElement.classList) {
                this.videoParentElement.removeEventListener('touchstart', this._handleTouchStartEvent_Swipe);
            }
            this._hideFullScreenIcon();
            // Calculating the dimensions and storing in originalVideoProperties variable
            const isPortraitMode: boolean = CH5VideoUtils.isPortrait();
            const propertiesObject = {
                "width": this.sizeObj.width,
                "height": this.sizeObj.height,
                "top": this.videoTop,
                "left": this.videoLeft
            };
            // HH: Commenting below code as its repetitive
            // if (isSafariMobile()) {
            //     if (isPortraitMode) {
            //         // this.originalPotraitVideoProperties = []; // Rags - this line isnt required
            //         this.originalPotraitVideoProperties = JSON.parse(JSON.stringify(propertiesObject));
            //     } else { // if (Ch5VideoEventHandler.isLandscape()) {
            //         // This has to be landscape if not potrait, so we need not check
            //         // this.originalLandscapeVideoProperties = []; // Rags - this line isnt required
            //         this.originalLandscapeVideoProperties = JSON.parse(JSON.stringify(propertiesObject));
            //     }
            // } else {
            //     this.originalVideoProperties = [];
            //     this.originalVideoProperties = JSON.parse(JSON.stringify(propertiesObject));
            // }
            this.originalVideoProperties = JSON.parse(JSON.stringify(propertiesObject));

            this.vidControlPanel.classList.add("fullScreen");
            this.controlFullScreen.innerHTML = this.ESVG_ICONS.EXIT_FULLSCREEN_ICON;
            // this._drawCanvas(this.vid);
            this.classList.add(this.fullScreenStyleClass);
            this.sizeObj.width = window.innerWidth;
            this.sizeObj.height = window.innerHeight;
            // this._setCanvasDimensions(window.innerWidth, window.innerHeight);
            document.body.classList.add(this.fullScreenBodyClass);
            this.style.visibility = 'visible';
            this.isVideoReady = true;
            this.isOrientationChanged = false;
            this._calculation(this.videoElement);

            // Caclulating positions for iOS device.
            /*
            if (isSafariMobile()) {
                if (!isPortraitMode) {
                    this._calculatePositions();
                }
            }
            */
            this._publishVideoEvent(this.VIDEO_ACTION.FULLSCREEN);
        }
    }

    /**
     * To auto hide the controls after particular time
     */
    private _autoHideControls() {
        clearTimeout(this.controlTimer);
        this.controlTimer = setTimeout(() => {
            this._hideFullScreenIcon();
        }, this.autoHideControlPeriod * 1000);
    }

    /**
     * To avoid unwanted events on touch in the full screen mode
     * @param event 
     */
    private _videoCP(event: Event) {
        event.stopPropagation();
    }

    /**
     * The user scroll in iOS takes time to settle, sometimes soon sometimes late.
     * The pre-cut will have a problem.
     */
    private _observePositionChangesAfterScrollEnds() {
        this.info('Ch5Video.observePositionChangesAfterScrollEnds()');
        // this._calculatePositions();
        if (this.previousXPos !== this.videoLeft || this.previousYPos !== this.videoTop) {
            if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
                this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'observePositionChangesAfterScrollEnds');
            }
        }
        if (this.lastResponseStatus === this.VIDEO_ACTION.STARTED || this.lastResponseStatus === this.VIDEO_ACTION.RESIZED) {
            // this._calculatePositions(); // TODO: Remove after verifying
            this._calculation(this.videoElement);
            this._publishVideoEvent(this.VIDEO_ACTION.RESIZE);
            this.previousXPos = this.videoLeft;
            this.previousYPos = this.videoTop;
        }
    }

    /**
     * When the user scolls the page, video will disappear and when the scrolling gets stopped 
     * then video starts playing in the new position.
     */
    private _positionChange() {
        this.info('Ch5Video.positionChange()');
        if ((this.lastResponseStatus === '' || this.lastResponseStatus === this.VIDEO_ACTION.STARTED || this.lastResponseStatus === this.VIDEO_ACTION.RESIZED)) {
            this.isPositionChanged = true;
            window.clearTimeout(this.exitTimer); // clear timer if the user scrolls immediately after fullscreen exit
            clearTimeout(this.scrollTimer); // wait for half second
            if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
                this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'positionChange');
            }
            this.isExitFullscreen = false; // during scroll fullscreen is false
            this.scrollTimer = setTimeout(() => {
                if (this.elementIntersectionEntry.intersectionRatio >= 0.20) {
                    this._observePositionChangesAfterScrollEnds();
                }
            }, 500);
        }
    }

    /**
     * Removes listeners
     */
    private _removeEvents() {
        super.removeEventListeners();
        this.controlFullScreen.removeEventListener('click', this._enterFullScreen.bind(this));
        this.videoElement.removeEventListener('click', this._manageControls.bind(this));
        this.vidControlPanel.removeEventListener('click', this._videoCP.bind(this));
        window.removeEventListener('orientationchange', this._orientationChange.bind(this));
        window.removeEventListener(this.VIDEO_ACTION.RESIZE, this._orientationChange.bind(this));
        this.isTouchStartEvtBound = false;
        this.isTouchEndEvtBound = false;
        if (!!this.videoParentElement && this.videoParentElement != null && !!this.videoParentElement.classList) {
            this.videoParentElement.removeEventListener('touchstart', this._handleTouchStartEvent_Swipe);
        }
        this._scrollableElm.removeEventListener('scroll', _.debounce(this._positionChange.bind(this), 100, {
            'leading': true,
            'trailing': true
        }));
    }

    /**
     * detecting orientation has been changed
     */
    private _orientationChanged() {
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
    private _orientationChange() {
        // Rags - this can be a boolean instead of number
        this.info('Ch5Video.orientationChange()');

        // Check visibililty
        if (this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE) {
            return;
        }

        this.info('Ch5Video.orientationChange() -> 1');
        this.info('this.orientationCount -> ' + this.orientationCount);
        if (this.orientationCount === 1) {
            this.orientationCount = 0;
            this._hideFullScreenIcon();
            this._orientationChanged().then(() => {
                if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
                    // this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'orientationChange');
                }
                this._calculation(this.videoElement);
                if (this.isFullScreen) {
                    // Need to check, old code removed
                } else {
                    this._updateAppBackgroundStatus();
                }

                if (!this.isFullScreen) {
                    this.info('Ch5Video.orientationChange() -> 2');
                    // publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.RESIZE, 'orientationChange'));
                }

                if (this.lastResponseStatus === this.VIDEO_ACTION.STARTED ||
                    (this.lastResponseStatus === this.VIDEO_ACTION.RESIZED && this.lastRequestStatus === this.VIDEO_ACTION.RESIZE)) {
                    if (this.elementIsInViewPort) {
                        this.isOrientationChanged = true; // When the orientation happens inside the view port, isorientationChaged flag will be set to true
                    }
                    this._publishVideoEvent(this.VIDEO_ACTION.RESIZE);
                } else if ((this.lastResponseStatus === 'stopped' || this.lastResponseStatus === '') &&
                    this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
                    // RAGS
                    this.info("*** 6");
                    this._publishVideoEvent(this.VIDEO_ACTION.START);
                }
            });
        }
        this.orientationCount++;
    }

    /**
     * Function to calculate the position based on the requested dimensions
     * @param sWidth width of the requested element
     * @param sHeight height of the requested element
     * @returns this.position
     */
    private _getSizeAndPositionObj(sWidth: number, sHeight: number) {
        this.sizeObj = CH5VideoUtils.getDisplayWxH(this.aspectRatio, sWidth, sHeight);
        if (this.sizeObj.width < sWidth) {
            this.position = CH5VideoUtils.calculatePillarBoxPadding(sWidth, this.sizeObj.width);
        } else if (this.sizeObj.height < sHeight) {
            this.position = CH5VideoUtils.calculateLetterBoxPadding(sHeight, this.sizeObj.height);
        }
        return this.position;
    }

    /**
     * Calculate the canvas position
     */
    private _calculatePositions() {
        this.info("HH Test Pos 1 : ", this.stretch, this.isFullScreen);
        if (this.stretch === 'false' || this.isFullScreen) {
            this.videoTop = this.videoElement.getBoundingClientRect().top;
            this.videoLeft = this.videoElement.getBoundingClientRect().left;
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
        this.info("HH Test Pos 2 : ", JSON.stringify(this.position));
    }

    /**
     * Calculate the duration based on the key
     * @param key 
     * @param duration 
     * @param action 
     */
    private _performanceDuration(key: string, duration: number, action: string) {
        this.info("performanceDuration -> key: " + key + "; duration: " + duration + "; action: " + action);
        let totalTime = 0;
        if (action === 'timerStart') {
            this._performanceMap.set(key, duration)
        } else if (action === 'timerEnd' && this._performanceMap.has(key)) {
            const startTime = this._performanceMap.get(key);
            totalTime = 0.001 * (duration - startTime);
            this.info("Video " + key + " took " + totalTime.toFixed(2) + " seconds between request and response.");
            this._performanceMap.delete(key)
        }
        return totalTime;
    }

    /**
     * Send event to the backend based on the action Type
     * @param actionType Video request type
     */
    private _publishVideoEvent(actionType: string) {
        this.info('*** publishVideoEvent: actionType -> ' + actionType + '; lastRequestStatus -> ' + this.lastRequestStatus
            + '; lastResponseStatus -> ' + this.lastResponseStatus + '; CH5UID: ' + this.ch5UId);
        // When we receive value from receiveStatePlay
        if (this.fromReceiveStatePlay) {
            actionType = this._videoScenariosCheck(this.playValue);
        }
        this._hideFullScreenIcon();
        this._sendEvent(this.sendEventResolution, this.sizeObj.width + "x" + this.sizeObj.height + "@24fps", 'string');
        this.responseObj = [];
        this.isAlphaBlend = !this.isFullScreen;
        // Suresh TODO: Check whether _clearOldResponseData is serving any purpose
        this._clearOldResponseData();
        switch (actionType) {
            case this.VIDEO_ACTION.START:
                this.info("*** MyCase START", this.playValue, this.receiveStatePlay, this.fromReceiveStatePlay);
                this.isVideoPublished = true;
                // Check whether receiveStatePlay is defined and the value
                if (this.receiveStatePlay !== '') {
                    if (!this.playValue) {
                        return;
                    }
                }

                if (this.playValue && this.fromReceiveStatePlay) {
                    this._videoStartRequest(actionType);
                    this.fromReceiveStatePlay = false;
                    return;
                }

                this._sendEvent(this.sendEventSelectionURL, this._url, 'string');
                this.info('*** this.isVideoReady: ' + !this.isVideoReady + " && this.lastRequestStatus: " + this.lastRequestStatus
                    + " !== start && this.url: " + this.url + "&& (this.lastResponseStatus === " + this.lastResponseStatus
                    + "=== stopped || this.lastResponseStatus: " + this.lastResponseStatus + "=== '' || " + this.lastResponseStatus
                    + "this.wasAppBackGrounded: " + this._wasAppBackGrounded + ") && !this.isExitFullscreen: " + !this.isExitFullscreen);

                if (!this.isVideoReady && this.lastRequestStatus !== this.VIDEO_ACTION.START && this.url &&
                    (this.lastResponseStatus === 'stopped' || this.lastResponseStatus === '' ||
                        this.lastResponseStatus === 'error' || this._wasAppBackGrounded) && !this.isExitFullscreen) {
                    this.info("*** videoStartRequest");
                    this._videoStartRequest(actionType);
                } else {
                    this.info("*** this.sendEvent");
                    this._sendEvent(this.sendEventState, 0, 'number');
                }
                break;
            case this.VIDEO_ACTION.STOP:
                this.info("*** MyCase STOPPED");
                this.info("*** MyCase STOPPED - this.playValue", this.playValue);
                this.info("*** MyCase STOPPED - this.fromReceiveStatePlay", this.fromReceiveStatePlay);
                if (!this.playValue && this.fromReceiveStatePlay) {
                    this._videoStopRequest(actionType);
                    this.fromReceiveStatePlay = false;
                    return;
                }

                this.info("*** MyCase STOPPED - this.isVideoPublished", this.isVideoPublished);
                if (!this.isVideoPublished) { // this flag avoids stop command since no video has started
                    return;
                }
                this.info("*** MyCase STOPPED - this.lastRequestStatus", this.lastRequestStatus);
                this.info("*** MyCase STOPPED - this.lastResponseStatus", this.lastResponseStatus);
                this.info("*** MyCase STOPPED - this.elementIsInViewPort", this.elementIsInViewPort);
                this.info("*** MyCase STOPPED - this.isExitFullscreen", this.isExitFullscreen);
                if (this.lastRequestStatus !== this.VIDEO_ACTION.STOP && (this.lastResponseStatus === '' || this.lastResponseStatus === this.VIDEO_ACTION.STARTED || !this.elementIsInViewPort || ((this.lastResponseStatus === this.VIDEO_ACTION.RESIZED || this.lastResponseStatus === 'error') && !this.isExitFullscreen))) {
                    this.info("*** videoStopRequest");
                    this._videoStopRequest(actionType);
                }
                this.info("*** MyCase STOPPED - ENDS");
                break;
            case this.VIDEO_ACTION.RESIZE:
                this.info("*** MyCase RESIZE");
                // If the video has already stopped then there is no need to resize.
                if (this.lastResponseStatus === 'stopped' || this.lastResponseStatus === '' || this.lastRequestStatus === this.VIDEO_ACTION.STOP) {
                    return;
                }
                this.fromExitFullScreen = false;
                this._performanceDuration(this.VIDEO_ACTION.RESIZE, performance.now(), 'timerStart');
                publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));

                /*
                if (this.isPositionChanged) {
                    // To send the video request and background at a same time to avoid sending the different coordinates
                    // Without setTimeout(), the background request triggers faster than video request
                    if (this.lastResponseStatus !== 'stopped' && this.lastRequestStatus !== this.VIDEO_ACTION.STOP) {
                        publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.RESIZE, 'publishVideoEvent'));
                    }
                }*/
                this.isVideoReady = false;
                break;
            case this.VIDEO_ACTION.FULLSCREEN:
                if (this.lastResponseStatus === this.VIDEO_ACTION.STARTED || this.lastResponseStatus === this.VIDEO_ACTION.RESIZED) {
                    this.fromExitFullScreen = false;

                    // Fill the background, this will be useful when user gets into fullscreen mode in potrait,
                    // then turns the mobile to landscape and exits. Making a refill and recalculating during 
                    // exit will have bad UI experience.
                    if (isSafariMobile()) {
                        this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'publishVideoEvent');
                    }

                    publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
                    this.isVideoReady = false;
                }
                break;
            default:
        }
    }

    /**
     * Publish the video start request
     * @param actionType 
     */
    private _videoStartRequest(actionType: string) {
        // return if the url is empty
        if (this.url.trim() === '') {
            this.ch5BackgroundAction(this.VIDEO_ACTION.NOURL, 'videoStartRequest');
            return;
        }

        // Make a cut if snapshot not found
        this.fromExitFullScreen = false;
        this.lastRequestUrl = this.url;
        this.isVideoReady = true;
        this._performanceDuration(this.VIDEO_ACTION.START, performance.now(), 'timerStart');
        publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'videoStartRequest'));
        this.requestID = this.ch5UId;
    }

    /**
     * Publish the video stop request
     * @param actionType 
     */
    private _videoStopRequest(actionType: string) {
        if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
            this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, 'videoStopRequest');
        }
        this.fromExitFullScreen = false;
        this.lastRequestUrl = '';
        this._unsubscribeRefreshImage();
        this._performanceDuration(this.VIDEO_ACTION.STOP, performance.now(), 'timerStart');
        publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId));
        this.isVideoReady = false;
        this._sendEvent(this.sendEventState, 3, 'number');
    }

    private ch5BackgroundAction(actionType: string, calledBy: string): void {
        let isActionExecuted: boolean = true;
        switch (actionType) {
            case this.VIDEO_ACTION.MARK:
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.MARK));
                break;
            case this.VIDEO_ACTION.REFILL:
                if (this.lastBackGroundRequest !== actionType) {
                    publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.REFILL));
                } else {
                    isActionExecuted = false;
                }
                break;
            case this.VIDEO_ACTION.RESIZE:
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.RESIZE));
                break;
            case this.VIDEO_ACTION.SNAPSHOT:
                // the below condition prevents snapshot loading
                // if (this.lastResponseStatus !== this.VIDEO_ACTION.STARTED) {
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.SNAPSHOT));
                // Suresh TODO: Move it inside ch5-video-snapshot.ts, we need to send once snapshot image is loaded 
                this._sendEvent(this.sendEventSnapShotLastUpdateTime, CH5VideoUtils.rfc3339TimeStamp(), 'string');
                break;
            case this.VIDEO_ACTION.START:
                // Nothing here, place holder
                break;
            case this.VIDEO_ACTION.STARTED:
                clearTimeout(this.exitSnapsShotTimer); // clear timer to stop refreshing image
                this.stopLoadingSnapShot();
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.STARTED));
                break;
            case this.VIDEO_ACTION.STOP:
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.STOP));
                break;
            case this.VIDEO_ACTION.ERROR:
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.MARK));
                break;
            default:
                publishEvent('o', 'ch5.video.background', this.videoBGObjJSON(this.VIDEO_ACTION.MARK));
                break;
        }
        this.lastBackGroundRequest = isActionExecuted ? actionType : this.lastBackGroundRequest;
        this.info("\nCalling Method -> " + calledBy + 
        "\nPrevious BG Request -> " + this.lastBackGroundRequest + 
        "\nPresent BG Request -> " + actionType);
    }

    /**
     * Call back function if the video response has an error
     * @param error 
     */
    private _errorResponse(error: any) {
        this.info("Ch5Video - Error when the video response", error);
    }

    /**
     * Video Response on subscribe
     * @param response 
     */
    private _videoResponse(response: any) {
        const isMyObjectEmpty = !Object.keys(response).length;
        this._appCurrentBackgroundStatus();
        this.info('Video Response : ',
            this._wasAppBackGrounded,
            this._appCurrentStatus,
            isMyObjectEmpty,
            response,
            typeof response,
            JSON.stringify(this.responseObj),
            this.oldResponseStatus,
            this.requestID);
        if (this._wasAppBackGrounded && !this._appCurrentStatus) {
            this.isVideoReady = false;
            // RAGS
            this.info("*** 7");
            this._publishVideoEvent(this.VIDEO_ACTION.START);
            this._updateAppBackgroundStatus();
        }
        if (isMyObjectEmpty) {
            this.isVideoReady = false;
            return;
        }

        if (typeof response === 'string') {
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
        if (this.responseObj.status === 'queued') {
            return;
        }

        this.info("Video Response : " + JSON.stringify(this.responseObj));

        this.oldResponseStatus = this.responseObj.status;
        this.oldResponseId = this.responseObj.id;
        const responseStatCode: number = this.responseObj.statusCode;
        const responseStatus = this.responseObj.status.toLowerCase();
        this.info('Response Status: ' + responseStatus.toLowerCase());
        switch (responseStatus.toLowerCase()) {
            case 'stopped':
                this._performanceDuration(this.VIDEO_ACTION.STOP, performance.now(), 'timerEnd');
                if (this.isFullScreen && this.lastRequestStatus === this.VIDEO_ACTION.STOP) {
                    this._exitFullScreen();
                }

                // This condition makes sure not to draw a black rectangle when invisible
                if (this.elementIsInViewPort) {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.STOP, 'videoResponse');
                }

                // When the user continously clicks on play and stop without a gap, started
                const vidResponses = ['connecting', 'buffering', 'retrying', 'resizing', 'error'];
                if (vidResponses.indexOf(this.lastResponseStatus) !== -1) {
                    this.info('Stop Request when continous play and stop clicks');
                    this.lastRequestStatus = '';
                    this.lastResponseStatus = this.VIDEO_ACTION.STARTED;
                    this._publishVideoEvent(this.VIDEO_ACTION.STOP);
                }

                this.retryCount = 0;
                this.errorCount = 0;
                this.isVideoReady = false;
                this.isOrientationChanged = false;
                this.isExitFullscreen = false;
                this.isPositionChanged = false;
                this._sendEvent(this.sendEventState, 1, 'number');
                this._hideFullScreenIcon();
                break;
            case 'connecting':
                this.isVideoReady = false;
                this._hideFullScreenIcon();
                if (this.lastRequestStatus === this.VIDEO_ACTION.START) {
                    this._sendEvent(this.sendEventState, 4, 'number');
                }
                break;
            case 'buffering':
                this.isVideoReady = false;
                this._hideFullScreenIcon();
                if (this.lastRequestStatus === this.VIDEO_ACTION.START) {
                    this._sendEvent(this.sendEventState, 5, 'number');
                }
                break;
            case this.VIDEO_ACTION.STARTED:
                this._performanceDuration(this.VIDEO_ACTION.START, performance.now(), 'timerEnd');
                this._unsubscribeRefreshImage();
                this._sendEvent(this.sendEventSnapShotStatus, 0, 'number');
                this.retryCount = 0;
                this.errorCount = 0;
                this.isVideoReady = true;
                this._sendEvent(this.sendEventState, 2, 'number');
                this.isOrientationChanged = false;
                this.isExitFullscreen = false;
                this.isPositionChanged = false;
                this._setControlDimension();
                this.ch5BackgroundAction(this.VIDEO_ACTION.STARTED, 'videoResponse');

                /* 
                 * If this.VIDEO_ACTION.STARTED response is delayed Check visibility. 
                 * If the visibility is false send a stop request to stop the video
                 */
                if (this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE) {
                    this.info("Video not visible (" + this.elementIntersectionEntry.intersectionRatio + ").");
                    this.info("Received this.VIDEO_ACTION.STARTED delayed response from VSM. Sending this.VIDEO_ACTION.STOP request from UI.");
                    this._publishVideoEvent(this.VIDEO_ACTION.STOP);
                }
                break;
            case 'retrying':
                this.isVideoReady = false;
                this._hideFullScreenIcon();
                if (this.lastRequestStatus === this.VIDEO_ACTION.START) {
                    this._sendEvent(this.sendEventState, 6, 'number');
                }
                this.retryCount = this.retryCount + 1;
                this._sendEvent(this.sendEventRetryCount, this.retryCount, 'number');
                break;
            case 'resizing':
                this.isVideoReady = false;
                this._hideFullScreenIcon();
                break;
            case this.VIDEO_ACTION.RESIZED:
                this._performanceDuration(this.VIDEO_ACTION.RESIZE, performance.now(), 'timerEnd');
                this.isOrientationChanged = false;
                if (this.isExitFullscreen) {
                    this.isExitFullscreen = false;
                    this.fromExitFullScreen = true;
                }
                this.isPositionChanged = false;
                if (this.lastRequestStatus === this.VIDEO_ACTION.RESIZE) {
                    // this._clearSnapShot();
                    this._unsubscribeRefreshImage();
                    // this._calculation(this.videoCanvasElement);
                    this._setControlDimension();
                    this.ch5BackgroundAction(this.VIDEO_ACTION.STARTED, 'videoResponse');
                    this.isVideoReady = true;
                }
                break;
            case 'error':
                this.info("Error case in Csig.video.response with status code : " + responseStatCode);
                if (this.lastRequestStatus === this.VIDEO_ACTION.START) {
                    this._sendEvent(this.sendEventState, 7, 'number');
                }
                if (this.responseObj.statusCode) {
                    this._sendEvent(this.sendEventErrorCode, this.responseObj.statusCode, 'number');
                    if (this._videoErrorMessages.has(this.responseObj.statusCode)) {
                        this._sendEvent(this.sendEventErrorMessage, this._videoErrorMessages.get(this.responseObj.statusCode), 'string');
                    } else {
                        this._sendEvent(this.sendEventErrorMessage, "Unknown Error Message", 'string');
                    }
                }
                this.lastResponseStatus = 'error';
                this.lastRequestStatus = '';
                this.isVideoReady = false;
                // Increment the errorCount and send the background stop only once to avoid flickering during 
                // continuous error feedback
                if (this.errorCount === 0) {
                    this.ch5BackgroundAction(this.VIDEO_ACTION.ERROR, 'videoResponse');
                }
                this.errorCount = this.errorCount + 1;
                this._hideFullScreenIcon();
                break;
            default:
                this.info("Default case in Csig.video.response with status : " + responseStatus);
                this.isVideoReady = false;
                this._hideFullScreenIcon();
                // Increment the retryCount and send the feedback
                if (responseStatus === 'retrying connection') {
                    this.retryCount += this.retryCount;
                    this._sendEvent(this.sendEventRetryCount, this.retryCount, 'number');
                }
                break;
        }
        this.lastResponseStatus = responseStatus;
    }

    /**
     * Clear the previous response data
     */
    private _clearOldResponseData() {
        this.oldResponseStatus = '';
        this.oldResponseId = 0;
    }

    /**
     * Hide the full screen icon
     */
    private _hideFullScreenIcon() {
        if (!!this.vidControlPanel && !!this.vidControlPanel.classList) {
            this.vidControlPanel.classList.remove(this.showControl);
        }
    }

    /**
     * Show the full screen icon
     */
    private _showFullScreenIcon() {
        if (!!this.vidControlPanel && !!this.vidControlPanel.classList) {
            this.vidControlPanel.classList.add(this.showControl);
            this._setControlDimension();
        }
    }

    /**
     * Set the dimensions and position of the video control icon
     */
    private _setControlDimension() {
        this.vidControlPanel.style.position = "absolute";
        this.vidControlPanel.style.width = this.sizeObj.width + 'px';
        this.vidControlPanel.style.left = this.controlLeft + 'px';
        this.vidControlPanel.style.top = this.controlTop + 'px';
    }

    /**
     * Calculate the dimensions of the video and positions of the canvas when it is in the full screen mode
     */
    private _fullScreenCalculation() {
        const sWidth: number = window.innerWidth;
        const sHeight: number = window.innerHeight;
        this._getSizeAndPositionObj(sWidth, sHeight);
        this.videoTop = this.position.yPos;
        this.videoLeft = this.position.xPos;
    }

    /**
     * Calculate the size and position of the canvas
     * @param video
     */
    private _calculation(video: HTMLDivElement) {
        this.sizeObj = { width: 0, height: 0 };
        let totalWidth: number = 0;
        let totalHeight: number = 0;
        if (this.stretch === 'false') {
            // Calculation for fixed display size like small, medium large
            if (this.isFullScreen) {
                this._fullScreenCalculation();
            } else {
                if (this.parentElement) {
                    this.sizeObj = CH5VideoUtils.getAspectRatioForVideo(this.aspectRatio, this.size);
                    this.position = CH5VideoUtils.getSizeAndPositionForFixedSize(this.parentElement, this.sizeObj);
                    this.videoTop = this.position.yPos;
                    this.videoLeft = this.position.xPos;
                    this._setControlDimension();
                }
            }
        } else if (this.stretch === 'true') {
            let offsetTop: number = 0;
            let offsetLeft: number = 0;

            if (this.isFullScreen) {
                totalWidth = window.innerWidth;
                totalHeight = window.innerHeight;
            } else {
                if (this.parentElement) {
                    const parentElementDimensions: iElementDimensions = CH5VideoUtils.getParentElementOffsetAndDimension(this.parentElement);
                    totalHeight = parentElementDimensions.totalHeight;
                    totalWidth = parentElementDimensions.totalWidth;
                    offsetTop = parentElementDimensions.offsetTop;
                    offsetLeft = parentElementDimensions.offsetLeft;
                }
            }
            this._getSizeAndPositionObj(totalWidth, totalHeight);

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
        }
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();
        this.controlFullScreen.addEventListener('click', this._enterFullScreen.bind(this));
        this.videoElement.addEventListener('click', this._manageControls.bind(this));
        this.vidControlPanel.addEventListener('click', this._videoCP.bind(this));
        window.addEventListener('orientationchange', this._orientationChange.bind(this));
        window.addEventListener(this.VIDEO_ACTION.RESIZE, this._orientationChange.bind(this));
        this._scrollableElm.addEventListener('scroll', _.debounce(this._positionChange.bind(this), 100, {
            'leading': true,
            'trailing': true
        }));
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
            if (aspRatio === '16:9' || aspRatio === '4:3') {
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
if (typeof window === 'object' && typeof window.customElements === 'object' && typeof window.customElements.define === 'function') {
    window.customElements.define('ch5-video', Ch5Video);
}

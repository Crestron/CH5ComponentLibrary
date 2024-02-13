// Copyright (C) 2022 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { subscribeState } from "../ch5-core";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5Signal } from "../ch5-core/ch5-signal";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5VideoAspectRatio, TCh5VideoSourceType, TCh5VideoSize } from './interfaces/t-ch5-video';
import { ICh5VideoAttributes } from './interfaces/i-ch5-video-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { CH5VideoUtils } from "./ch5-video-utils";
import { ICh5VideoPublishEvent, ITouchOrdinates, TVideoResponse, TVideoTouchManagerParams } from "./interfaces";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { ICh5VideoBackground } from "./interfaces";
import { Ch5Background } from "../ch5-background";
import { Ch5VideoSnapshot } from "./ch5-video-snapshot";
import { Ch5VideoTouchManager } from "./ch5-video-touch-manager";
import _ from "lodash";

export class Ch5Video extends Ch5Common implements ICh5VideoAttributes {

  // #region Variables

  public static readonly SVG_ICONS = {
    FULLSCREEN_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
  };

  public static readonly ASPECT_RATIO: TCh5VideoAspectRatio[] = ['16:9', '4:3'];
  public static readonly SOURCE_TYPE: TCh5VideoSourceType[] = ['Network'];
  public static readonly SIZE: TCh5VideoSize[] = ['regular', 'x-small', 'small', 'large', 'x-large', 'xx-large'];
  public static readonly COMPONENT_DATA: any = {
    ASPECT_RATIO: {
      default: Ch5Video.ASPECT_RATIO[0],
      values: Ch5Video.ASPECT_RATIO,
      key: 'aspectRatio',
      attribute: 'aspectRatio',
      classListPrefix: '--aspect-ratio-'
    },
    SIZE: {
      default: Ch5Video.SIZE[0],
      values: Ch5Video.SIZE,
      key: 'size',
      attribute: 'size',
      classListPrefix: '--size-'
    }
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestateplay: { direction: "state", booleanJoin: 1, contractName: true },
    receivestateselect: { direction: "state", numericJoin: 1, contractName: true },
    receivestateurl: { direction: "state", stringJoin: 1, contractName: true },
    receivestatesourcetype: { direction: "state", stringJoin: 1, contractName: true },
    receivestateuserid: { direction: "state", stringJoin: 1, contractName: true },
    receivestatepassword: { direction: "state", stringJoin: 1, contractName: true },
    receivestatesnapshoturl: { direction: "state", stringJoin: 1, contractName: true },
    receivestatesnapshotrefreshrate: { direction: "state", numericJoin: 1, contractName: true },
    receivestatesnapshotuserid: { direction: "state", stringJoin: 1, contractName: true },
    receivestatesnapshotpassword: { direction: "state", stringJoin: 1, contractName: true },
    receivestatevideocount: { direction: "state", numericJoin: 1, contractName: true },

    sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
    sendeventselectionchange: { direction: "event", numericJoin: 1, contractName: true },
    sendeventselectionsourcetype: { direction: "event", stringJoin: 1, contractName: true },
    sendeventselectionurl: { direction: "event", stringJoin: 1, contractName: true },
    sendeventsnapshoturl: { direction: "event", stringJoin: 1, contractName: true },
    sendeventstate: { direction: "event", numericJoin: 1, contractName: true },
    sendeventerrorcode: { direction: "event", numericJoin: 1, contractName: true },
    sendeventerrormessage: { direction: "event", stringJoin: 1, contractName: true },
    sendeventretrycount: { direction: "event", numericJoin: 1, contractName: true },
    sendeventresolution: { direction: "event", stringJoin: 1, contractName: true },
    sendeventsnapshotstatus: { direction: "event", numericJoin: 1, contractName: true },
    sendeventsnapshotlastupdatetime: { direction: "event", stringJoin: 1, contractName: true }
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "",
      name: "indexId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: Ch5Video.ASPECT_RATIO[0],
      enumeratedValues: Ch5Video.ASPECT_RATIO,
      name: "aspectRatio",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Video.ASPECT_RATIO[0],
      isObservableProperty: true
    },
    {
      default: false,
      name: "stretch",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true
    },
    {
      default: "",
      name: "url",
      nameForSignal: "receiveStateURL",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: Ch5Video.SOURCE_TYPE[0],
      enumeratedValues: Ch5Video.SOURCE_TYPE,
      name: "sourceType",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateSourceType",
      type: "enum",
      valueOnAttributeEmpty: Ch5Video.SOURCE_TYPE[0],
      isObservableProperty: true
    },
    {
      default: "",
      name: "userId",
      nameForSignal: "receiveStateUserId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "password",
      nameForSignal: "receiveStatePassword",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "snapshotURL",
      nameForSignal: "receiveStateSnapshotURL",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: 5,
      name: "snapshotRefreshRate",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateSnapshotRefreshRate",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 60,
        conditionalMin: 0,
        conditionalMax: 60,
        conditionalMinValue: 0,
        conditionalMaxValue: 60
      },
      isObservableProperty: true
    },
    {
      default: "",
      name: "snapshotUserId",
      nameForSignal: "receiveStateSnapshotUserId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "snapshotPassword",
      nameForSignal: "receiveStateSnapshotPassword",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: Ch5Video.SIZE[0],
      enumeratedValues: Ch5Video.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Video.SIZE[0],
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStatePlay",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: true,
      name: "show",
      nameForSignal: "receiveStateShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateShow",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSelect",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSourceType",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateUserId",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStatePassword",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotRefreshRate",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotUserId",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotPassword",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateVideoCount",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnClick",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSelectionChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSelectionSourceType",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSelectionURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapshotURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventState",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventErrorCode",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventErrorMessage",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventRetryCount",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventResolution",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapshotStatus",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapshotLastUpdateTime",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-video';

  public primaryCssClass = 'ch5-video';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _fullScreenIcon: HTMLElement = {} as HTMLElement;

  private responseObj: TVideoResponse = {} as TVideoResponse;
  private parentCh5Background: Ch5Background[] = [] as Ch5Background[];

  private readonly INTERSECTION_RATIO_VALUE: number = 0.98;

  private playValue: boolean = true;
  private lastResponseStatus: string = '';
  private lastRequestStatus: string = '';

  private orientationChanged: boolean = false;
  private isVideoPublished: boolean = false;
  private isFullScreen: boolean = false;
  private isSwipeDebounce: any;
  private stopDebounce: any;
  private controlTimer: any;
  private snapshotImage = new Ch5VideoSnapshot();
  private videoErrorMessages = new Map<number, string>();
  private maxVideoCount = 1;
  private selectedVideo = 0;
  private retryCount = 0;
  public ch5UId: number = 0; // CH5 Unique ID

  // touch specific [params]
  private videoTouchHandler: Ch5VideoTouchManager = {} as Ch5VideoTouchManager;
  private isTouchInProgress: boolean = false;
  private readonly swipeDeltaCheckNum: number = 1;
  private touchCoordinates: ITouchOrdinates = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }; // instantiating empty object to proceed

  private signalHolder: any = [];

  // #endregion

  // #region Getters and Setters

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value.trim());
  }
  public get indexId(): string {
    return this._ch5Properties.get<string>("indexId");
  }

  public set aspectRatio(value: TCh5VideoAspectRatio) {
    this._ch5Properties.set<TCh5VideoAspectRatio>("aspectRatio", value, () => {
      this.handleAspectRatio();
    });
  }
  public get aspectRatio(): TCh5VideoAspectRatio {
    return this._ch5Properties.get<TCh5VideoAspectRatio>("aspectRatio");
  }

  public set stretch(value: boolean) {
    this._ch5Properties.set<boolean>("stretch", value, () => {
      this.handleStretch();
    });
  }
  public get stretch(): boolean {
    return this._ch5Properties.get<boolean>("stretch");
  }

  public set url(value: string) {
    this._ch5Properties.set<string>("url", value.trim(), () => {
      this.sendEvent(this.sendEventSelectionURL, this.url);
      this.checkUrl();
    });
  }
  public get url(): string {
    return this._ch5Properties.get<string>("url");
  }

  public set sourceType(value: TCh5VideoSourceType) {
    this._ch5Properties.set<TCh5VideoSourceType>("sourceType", value, () => {
      this.sendEvent(this.sendEventSelectionSourceType, this.sourceType);
      this.videoIntersectionObserver();
    });
  }
  public get sourceType(): TCh5VideoSourceType {
    return this._ch5Properties.get<TCh5VideoSourceType>("sourceType");
  }

  public set userId(value: string) {
    this._ch5Properties.set<string>("userId", value.trim(), () => {
      if (this.userId.trim().includes('@') || this.userId.trim().includes(':')) {
        console.warn("Please avoid using '@' and ':' characters for userid and password");
      }
      this.videoIntersectionObserver();
    });
  }
  public get userId(): string {
    return this._ch5Properties.get<string>("userId");
  }

  public set password(value: string) {
    this._ch5Properties.set<string>("password", value.trim(), () => {
      if (this.password.trim().includes('@') || this.password.trim().includes(':')) {
        console.warn("Please avoid using '@' and ':' characters for userid and password");
      }
      this.videoIntersectionObserver();
    });
  }
  public get password(): string {
    return this._ch5Properties.get<string>("password");
  }

  public set snapshotURL(value: string) {
    this._ch5Properties.set<string>("snapshotURL", value.trim(), () => {
      this.sendEvent(this.sendEventSnapshotURL, this.snapshotURL);
      this.validateAndAttachSnapshot();
    });
  }
  public get snapshotURL(): string {
    return this._ch5Properties.get<string>("snapshotURL");
  }

  public set snapshotRefreshRate(value: number) {
    this._ch5Properties.set<number>("snapshotRefreshRate", value, () => {
      this.validateAndAttachSnapshot();
    });
  }
  public get snapshotRefreshRate(): number {
    return this._ch5Properties.get<number>("snapshotRefreshRate");
  }

  public set snapshotUserId(value: string) {
    this._ch5Properties.set<string>("snapshotUserId", value, () => {
      this.validateAndAttachSnapshot();
    });
  }
  public get snapshotUserId(): string {
    return this._ch5Properties.get<string>("snapshotUserId");
  }

  public set snapshotPassword(value: string) {
    this._ch5Properties.set<string>("snapshotPassword", value, () => {
      this.validateAndAttachSnapshot();
    });
  }
  public get snapshotPassword(): string {
    return this._ch5Properties.get<string>("snapshotPassword");
  }

  public set size(value: TCh5VideoSize) {
    this._ch5Properties.set<TCh5VideoSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5VideoSize {
    return this._ch5Properties.get<TCh5VideoSize>("size");
  }

  public set receiveStatePlay(value: string) {
    this._ch5Properties.set("receiveStatePlay", value, null, (newValue: boolean) => {
      this.handleReceiveStatePlay(newValue);
    });
  }
  public get receiveStatePlay(): string {
    return this._ch5Properties.get<string>('receiveStatePlay');
  }

  public set receiveStateSelect(value: string) {
    this._ch5Properties.set("receiveStateSelect", value, null, (newValue: number) => {
      if (this.selectedVideo === newValue) { return; }
      this.selectedVideo = newValue;
      if (newValue >= 0 && newValue < this.maxVideoCount) {
        this.sendEvent(this.sendEventSelectionChange, this.selectedVideo);
        this.handleReceiveStateSelect(newValue);
      }
    });
  }
  public get receiveStateSelect(): string {
    return this._ch5Properties.get<string>('receiveStateSelect');
  }

  public set receiveStateURL(value: string) {
    this._ch5Properties.set("receiveStateURL", value, null);
  }
  public get receiveStateURL(): string {
    return this._ch5Properties.get<string>('receiveStateURL');
  }

  public set receiveStateSourceType(value: string) {
    this._ch5Properties.set("receiveStateSourceType", value, null);
  }
  public get receiveStateSourceType(): string {
    return this._ch5Properties.get<string>('receiveStateSourceType');
  }

  public set receiveStateUserId(value: string) {
    this._ch5Properties.set("receiveStateUserId", value, null);
  }
  public get receiveStateUserId(): string {
    return this._ch5Properties.get<string>('receiveStateUserId');
  }

  public set receiveStatePassword(value: string) {
    this._ch5Properties.set("receiveStatePassword", value, null);
  }
  public get receiveStatePassword(): string {
    return this._ch5Properties.get<string>('receiveStatePassword');
  }

  public set receiveStateSnapshotURL(value: string) {
    this._ch5Properties.set("receiveStateSnapshotURL", value, null);
  }
  public get receiveStateSnapshotURL(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotURL');
  }

  public set receiveStateSnapshotRefreshRate(value: string) {
    this._ch5Properties.set("receiveStateSnapshotRefreshRate", value, null);
  }
  public get receiveStateSnapshotRefreshRate(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotRefreshRate');
  }

  public set receiveStateSnapshotUserId(value: string) {
    this._ch5Properties.set("receiveStateSnapshotUserId", value, null);
  }
  public get receiveStateSnapshotUserId(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotUserId');
  }

  public set receiveStateSnapshotPassword(value: string) {
    this._ch5Properties.set("receiveStateSnapshotPassword", value, null);
  }
  public get receiveStateSnapshotPassword(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotPassword');
  }

  public set receiveStateVideoCount(value: string) {
    this._ch5Properties.set("receiveStateVideoCount", value, null, (newValue: number) => {
      if (newValue >= 1 && newValue <= 32) {
        this.maxVideoCount = newValue;
        if (this.selectedVideo >= 0 && this.selectedVideo < this.maxVideoCount) {
          this.handleReceiveStateSelect(this.selectedVideo);
        }
      }
    });
  }
  public get receiveStateVideoCount(): string {
    return this._ch5Properties.get<string>('receiveStateVideoCount');
  }

  public set sendEventOnClick(value: string) {
    this._ch5Properties.set("sendEventOnClick", value);
  }
  public get sendEventOnClick(): string {
    return this._ch5Properties.get<string>('sendEventOnClick');
  }

  public set sendEventSelectionChange(value: string) {
    this._ch5Properties.set("sendEventSelectionChange", value);
  }
  public get sendEventSelectionChange(): string {
    return this._ch5Properties.get<string>('sendEventSelectionChange');
  }

  public set sendEventSelectionSourceType(value: string) {
    this._ch5Properties.set("sendEventSelectionSourceType", value);
  }
  public get sendEventSelectionSourceType(): string {
    return this._ch5Properties.get<string>('sendEventSelectionSourceType');
  }

  public set sendEventSelectionURL(value: string) {
    this._ch5Properties.set("sendEventSelectionURL", value);
  }
  public get sendEventSelectionURL(): string {
    return this._ch5Properties.get<string>('sendEventSelectionURL');
  }

  public set sendEventSnapshotURL(value: string) {
    this._ch5Properties.set("sendEventSnapshotURL", value);
  }
  public get sendEventSnapshotURL(): string {
    return this._ch5Properties.get<string>('sendEventSnapshotURL');
  }

  public set sendEventState(value: string) {
    this._ch5Properties.set("sendEventState", value);
  }
  public get sendEventState(): string {
    return this._ch5Properties.get<string>('sendEventState');
  }

  public set sendEventErrorCode(value: string) {
    this._ch5Properties.set("sendEventErrorCode", value);
  }
  public get sendEventErrorCode(): string {
    return this._ch5Properties.get<string>('sendEventErrorCode');
  }

  public set sendEventErrorMessage(value: string) {
    this._ch5Properties.set("sendEventErrorMessage", value);
  }
  public get sendEventErrorMessage(): string {
    return this._ch5Properties.get<string>('sendEventErrorMessage');
  }

  public set sendEventRetryCount(value: string) {
    this._ch5Properties.set("sendEventRetryCount", value);
  }
  public get sendEventRetryCount(): string {
    return this._ch5Properties.get<string>('sendEventRetryCount');
  }

  public set sendEventResolution(value: string) {
    this._ch5Properties.set("sendEventResolution", value);
  }
  public get sendEventResolution(): string {
    return this._ch5Properties.get<string>('sendEventResolution');
  }

  public set sendEventSnapshotStatus(value: string) {
    this._ch5Properties.set("sendEventSnapshotStatus", value);
  }
  public get sendEventSnapshotStatus(): string {
    return this._ch5Properties.get<string>('sendEventSnapshotStatus');
  }

  public set sendEventSnapshotLastUpdateTime(value: string) {
    this._ch5Properties.set("sendEventSnapshotLastUpdateTime", value);
  }
  public get sendEventSnapshotLastUpdateTime(): string {
    return this._ch5Properties.get<string>('sendEventSnapshotLastUpdateTime');
  }

  public set show(value: boolean) {
    this._ch5Properties.set("show", value, () => {
      this.handleReceiveStateShow();
    });
  }
  public get show(): boolean {
    return this._ch5Properties.get<boolean>('show');
  }

  public set receiveStateShow(value: string) {
    this._ch5Properties.set("receiveStateShow", value, null, (newValue: boolean) => {
      this._ch5Properties.setForSignalResponse<boolean>("show", newValue, () => {
        this.handleReceiveStateShow();
      });
    });
  }
  public get receiveStateShow(): string {
    return this._ch5Properties.get<string>('receiveStateShow');
  }

  // #endregion

  // #region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Video.ELEMENT_NAME, Ch5Video.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5Video.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5Video.ELEMENT_NAME, Ch5Video);
    }
  }

  // #endregion

  // #region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ['show', 'receiveStateShow', 'receivestateshowpulse', 'receivestatehidepulse', 'sendeventonshow'];
    this.logger.start('constructor()', Ch5Video.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5Video.COMPONENT_PROPERTIES);
    this.updateCssClass();
    this.setErrorMessages();
    subscribeState('o', 'Csig.video.response', this._videoResponse.bind(this), this._errorResponse.bind(this));
    subscribeState('b', 'Csig.Backlight_Off_fb', this.standByOff.bind(this));
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5Video.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Video.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5Video.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-video attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5Video.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
      if (attributeChangedProperty) {
        const thisRef: any = this;
        const key = attributeChangedProperty.name;
        thisRef[key] = newValue;
      } else {
        super.attributeChangedCallback(attr, oldValue, newValue);
      }
    }
    this.logger.stop();
  }

  /**
   * Called when the Ch5Video component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5Video.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) { this.setAttribute('role', Ch5RoleAttributeMapping.ch5Video); }
    if (this._elContainer.parentElement !== this) { this.appendChild(this._elContainer); }

    this.ch5UId = parseInt(this.getCrId().split('cr-id-')[1], 0);
    this.setAttribute('data-ch5-id', this.getCrId());
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.sendEvent(this.sendEventState, 0);
    this.handleMultiVideo();
    customElements.whenDefined('ch5-video').then(() => {
      this.componentLoadedEvent(Ch5Video.ELEMENT_NAME, this.getCrId());
    });
    Ch5CoreIntersectionObserver.getInstance().observe(this, this.videoIntersectionObserver.bind(this));
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.clearMultiSignal();
    this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
    if (this.isVideoPublished === true) {
      this.refillBackground();
    }
    this.selectedVideo = 0;
    this.maxVideoCount = 1;
    this.logger.stop();
  }

  // #endregion

  // #region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');
    this._elContainer.classList.add(this.primaryCssClass);

    // Create full screen icon on top right corner of the container
    this._fullScreenIcon = document.createElement("a");
    this._fullScreenIcon.classList.add("full-screen-icon");
    this._fullScreenIcon.classList.add("hide");
    this._fullScreenIcon.innerHTML = Ch5Video.SVG_ICONS.FULLSCREEN_ICON;

    this._elContainer.appendChild(this._fullScreenIcon);
    this._elContainer.appendChild(this.snapshotImage.getImage());
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5Video.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Video.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5Video.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5Video.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._elContainer.addEventListener('click', this._manageControls.bind(this));
    this._fullScreenIcon.addEventListener('click', this.toggleFullScreen.bind(this));
    window.addEventListener('resize', this.handleOrientation);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elContainer.removeEventListener('click', this._manageControls.bind(this));
    this._fullScreenIcon.removeEventListener('click', this.toggleFullScreen.bind(this));
    window.removeEventListener('resize', this.handleOrientation);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  // Clear the content of component in order to avoid duplication of elements
  private clearComponentContent() {
    const containers = this.getElementsByTagName("div");
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }

  private standByOff(data: boolean) {
    if (data === false && this.responseObj?.id && this.responseObj?.id === this.ch5UId && this.isFullScreen) {
      this.orientationChanged = true;
    }
  }

  private handleAspectRatio() {
    Array.from(Ch5Video.COMPONENT_DATA.ASPECT_RATIO.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5Video.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + e.replace(':', '-'));
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5Video.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio.replace(':', '-'));
  }

  private handleStretch() {
    if (this.stretch === true) {
      this._elContainer.classList.add(this.primaryCssClass + '--stretch-true');
      this.style.width = '100%';
      this.style.height = '100%';
    } else {
      this._elContainer.classList.remove(this.primaryCssClass + '--stretch-true');
      this.style.removeProperty('width');
      this.style.removeProperty('height');
    }
  }

  private handleSize() {
    Array.from(Ch5Video.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5Video.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5Video.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }

  private handleReceiveStatePlay(value: boolean) {
    this.playValue = value;
    if (this.playValue === false) {
      this.snapshotImage.stopLoadingSnapshot();
      if (this.isFullScreen) {
        this.orientationChanged = true;
      }
      this.sendEvent(this.sendEventSnapshotStatus, 0);
      this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
    } else {
      // below 4 lines are used for ch5c-6947
      if (this.isFullScreen) {
        this.publishVideo('start');
      } else {
        this.videoIntersectionObserver()
      }
    }
  }

  private handleReceiveStateSelect(select: number) {
    const url = this.signalHolder[select].url.value;
    if (url) { this.urlCB(url); }
    const userId = this.signalHolder[select].userId.value;
    if (userId) { this.userIdCB(userId); }
    const password = this.signalHolder[select].password.value;
    if (password) { this.passwordCB(password); }
    const sourceType = this.signalHolder[select].sourceType.value;
    if (sourceType) { this.sourceTypeCB(sourceType); }
    const snapshotURL = this.signalHolder[select].snapshotURL.value;
    if (snapshotURL) { this.snapshotURLCB(snapshotURL); }
    const snapshotUserId = this.signalHolder[select].snapshotUserId.value;
    if (snapshotUserId) { this.snapshotUserIdCB(snapshotUserId); }
    const snapshotPassword = this.signalHolder[select].snapshotPassword.value;
    if (snapshotPassword) { this.snapshotPasswordCB(snapshotPassword); }
    const snapshotRefreshRate = this.signalHolder[select].snapshotRefreshRate.value;
    if (snapshotRefreshRate) { this.snapshotRefreshRateCB(snapshotRefreshRate); }
  }

  private handleReceiveStateShow() {
    if (this.show === true) {
      if (this.isFullScreen) {
        this.publishVideo('start');
      } else {
        this.videoIntersectionObserver()
      }
    } else {
      this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
      this.refillBackground();
    }
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._elContainer.classList.add(this.primaryCssClass + Ch5Video.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio.replace(':', '-'));
    this._elContainer.classList.add(this.primaryCssClass + Ch5Video.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  private stopAndRefill() {
    this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.REFILL);
    this.publishVideo('stop');
  }

  /**
   * When the video element is more than 100% visible the video should start and
   * when the visibility is less than 100% the video should stop playing.
   */
  public videoIntersectionObserver() {
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && this.playValue && this.show) {
      this.validateAndAttachSnapshot();
      this.videoInViewPort();
    } else {
      this.videoNotInViewport();
    }
    // Removes or Adds document level touch handlers if in view
    if (this.elementIntersectionEntry.intersectionRatio > 0.1 && this.playValue) {
      this.addTouchEvent();
    } else {
      this.stopAndRefill();
      this.removeTouchEvent();
    }
  }

  private videoInViewPort() {
    this.snapshotImage.startLoadingSnapshot();
    clearTimeout(this.isSwipeDebounce);
    this.isSwipeDebounce = setTimeout(() => {
      this.publishVideo(CH5VideoUtils.VIDEO_ACTION.START);
    }, 300); // reducing this will create a cut at wrong place
  }

  private videoNotInViewport() {
    if (this.isFullScreen) { return; }
    this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
    this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.REFILL);
  }

  private videoStopObjJSON(actionType: string, uId: number): ICh5VideoPublishEvent {
    const retObj: any = {
      action: actionType,
      id: uId
    };
    this.sendEvent(this.sendEventState, 3);
    return retObj;
  }

  // Create the Video JSON object to start the video
  public videoStartObjJSON(actionType: string): ICh5VideoPublishEvent {
    let { left: xPosition, top: yPosition, width, height } = this._elContainer.getBoundingClientRect();

    if (actionType === CH5VideoUtils.VIDEO_ACTION.FULLSCREEN || this.isFullScreen) {
      if (actionType === CH5VideoUtils.VIDEO_ACTION.FULLSCREEN) {
        actionType = CH5VideoUtils.VIDEO_ACTION.RESIZE;
      }
      xPosition = 0;
      yPosition = 0;
      width = window.innerWidth;
      height = window.innerHeight;
      // handling the aspect ratio in full screen video
      if (window.innerWidth < window.innerHeight) {
        if (this.aspectRatio === '4:3') {
          width = window.innerWidth;
          height = (window.innerWidth / 4) * 3;
          yPosition = (window.innerHeight - height) / 2;
        } else {
          width = window.innerWidth;
          height = (window.innerWidth / 16) * 9;
          yPosition = (window.innerHeight - height) / 2;
        }
      } else {
        if (this.aspectRatio === '4:3') {
          height = window.innerHeight;
          width = (window.innerHeight / 3) * 4;
          if (width > window.innerWidth) {
            width = window.innerWidth;
          }
          xPosition = (window.innerWidth - width) / 2;
        } else {
          height = window.innerHeight;
          width = (window.innerHeight / 9) * 16;
          if (width > window.innerWidth) {
            width = window.innerWidth;
          }
          xPosition = (window.innerWidth - width) / 2;
        }
      }
    }

    // any negative values in location object will throw backend error sometimes decimal values are returned by position related functions. Math.ceil is used to avoid this.
    const retObj = {
      action: actionType,
      id: this.ch5UId,
      credentials: {
        userid: this.userId,
        password: this.password
      },
      source: {
        type: this.sourceType,
        url: this.url
      },
      location: {
        top: Math.ceil(yPosition),
        left: Math.ceil(xPosition),
        width: Math.ceil(width),
        height: Math.ceil(height),
        z: 0
      },
      alphablend: !this.isFullScreen, // optional, default true, false indicates video displayed above the HTML
      starttime: new Date().getMilliseconds(), // milliseconds since 1-1-1970 UTC
      endtime: new Date().getMilliseconds() + 2000, // 2000 msecs later
      timing: "linear" // only linear supported initially
    };
    this.sendEvent(this.sendEventResolution, width + "x" + height);
    return retObj;
  }

  private validateVideoUrl(videoUrl: string): boolean {
    return (videoUrl.startsWith('rtsp://') || videoUrl.startsWith('http://') || videoUrl.startsWith('https://'))
  }

  // Send event to the backend based on the action Type
  private publishVideo(actionType: string) {
    switch (actionType) {
      case 'start':
        if (this.url === "" || this.validateVideoUrl(this.url) === false) {
          return this.checkUrl();
        }
        this.isVideoPublished = true;
        if (this.responseObj?.id && this.responseObj?.id !== this.ch5UId && this.responseObj?.status === 'started') {
          publishEvent('o', 'Csig.video.request', this.videoStopObjJSON('stop', this.responseObj?.id));
          setTimeout(() => { publishEvent('o', 'Csig.video.request', this.videoStartObjJSON('start')); }, 300);
        } else {
          publishEvent('o', 'Csig.video.request', this.videoStartObjJSON('start'));
        }
        break;
      case 'stop':
        if (this.isVideoPublished === false) { return; }
        window.clearTimeout(this.stopDebounce);
        this.stopDebounce = window.setTimeout(() => publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId)), 300);// Stop the video immediately
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZE:
        if (this.isVideoPublished === false) { return; }
        publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType));
        break;
      case CH5VideoUtils.VIDEO_ACTION.FULLSCREEN:
        if (this.isVideoPublished === false) { return; }
        publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType));
        break;
      default:
        break;
    }
    this.lastRequestStatus = actionType;
  }

  private _videoResponse(response: TVideoResponse) { // Process the backend response
    if (typeof response === 'string') {
      this.responseObj = JSON.parse(response);
    } else {
      this.responseObj = response;
    }

    const isMyObjectEmpty = !Object.keys(response).length;
    if (this.responseObj.id !== this.ch5UId || isMyObjectEmpty) {
      return;
    }
    if (isMyObjectEmpty) {
      return;
    }
    // Return if response object id is negative or empty
    if (this.responseObj.id === -1 || !this.responseObj.id) {
      return;
    }
    // Return if the request Id and response Id is not same
    if (this.ch5UId !== this.responseObj.id) {
      return;
    }
    // Return if response status is queued as we do not take any action in UI
    if (this.responseObj.status === 'queued') {
      return;
    }

    // this.logger.log("Video Response : " + JSON.stringify(this.responseObj));

    this.lastResponseStatus = this.responseObj.status.toLowerCase();
    if (!(this.lastResponseStatus === 'started' || (this.lastRequestStatus === 'resize' && this.lastResponseStatus === 'resized'))) {
      this._fullScreenIcon.classList.add('hide')
    }
    switch (this.responseObj.status.toLowerCase()) {
      case 'started':
        this.ch5BackgroundRequest('started');
        this.sendEvent(this.sendEventState, 2);
        break;
      case 'stopped':
        this.ch5BackgroundRequest('stop');
        this.sendEvent(this.sendEventState, 1);
        break;
      case 'error':
        this.ch5BackgroundRequest('error');
        this.sendEvent(this.sendEventState, 7);
        break;
      case 'connecting':
        this.sendEvent(this.sendEventState, 4);
        break;
      case 'retrying':
        this.sendEvent(this.sendEventState, 6);
        this.retryCount = this.retryCount + 1;
        this.sendEvent(this.sendEventRetryCount, this.retryCount);
        break;
      case 'buffering':
        this.sendEvent(this.sendEventState, 5);
        break;
      default:
        this.logger.log('video is in ' + this.responseObj.status.toLowerCase() + ' state')
        break;
    }
    this.sendEvent(this.sendEventErrorCode, Number(this.responseObj.statuscode));
    this.sendEvent(this.sendEventErrorMessage, this.videoErrorMessages.get(Number(this.responseObj.statuscode)) || 'Unknown Error Message');
  }

  // Call back function if the video response has an error
  private _errorResponse(error: any) {
    this.info("Ch5Video - Error when the video response", error);
  }

  private sendEvent(signalName: string, signalValue: string | boolean | number) {
    if (signalName?.trim().length === 0 || signalName === null || signalName === undefined) { return; }
    switch (typeof signalValue) {
      case 'boolean':
        Ch5SignalFactory.getInstance().getBooleanSignal(signalName)?.publish(true);
        Ch5SignalFactory.getInstance().getBooleanSignal(signalName)?.publish(false);
        break;
      case 'string':
        Ch5SignalFactory.getInstance().getStringSignal(signalName)?.publish(signalValue as string);
        break;
      case 'number':
        Ch5SignalFactory.getInstance().getNumberSignal(signalName)?.publish(signalValue as number)
        break;
    }
  }

  private ch5BackgroundRequest(actionType: string) {

    switch (actionType) {
      case 'nourl':
        this.clearBackgroundOfVideoWrapper(false);
        this.snapshotImage.stopLoadingSnapshot();
        this.sendEvent(this.sendEventSnapshotStatus, 0);
        this._elContainer.style.borderBottom = '1rem solid #828282'; // Gray color
        break;
      case 'refill':
        if (this.isVideoPublished === false) { return; }
        this.ch5BackgroundAction('refill');
        break;
      case 'resize':
        this.ch5BackgroundAction('resize');
        break;
      case 'started':
        this.clearBackgroundOfVideoWrapper(true);
        this._elContainer.style.removeProperty('border-bottom');
        this.snapshotImage.stopLoadingSnapshot();
        this.sendEvent(this.sendEventSnapshotStatus, 0);
        this.ch5BackgroundAction('started');
        break;
      case 'stop':
        this.clearBackgroundOfVideoWrapper(false);
        this._elContainer.style.removeProperty('border-bottom');
        this.ch5BackgroundAction('stop');
        break;
      case 'error':
        this.clearBackgroundOfVideoWrapper(false);
        this._elContainer.style.borderBottom = '1rem solid #CF142B'; // Red color
        break;
      default:
        // Nothing here as of now
        break;
    }
  }

  // This will call the methods in ch5-background component @param videoInfo send the video id, size and position details
  private ch5BackgroundAction(actionStatus: string) {

    const videoInfo: ICh5VideoBackground = {
      action: actionStatus,
      id: this.getCrId(),
      top: this._elContainer.getBoundingClientRect().top,
      left: this._elContainer.getBoundingClientRect().left,
      width: this._elContainer.getBoundingClientRect().width,
      height: this._elContainer.getBoundingClientRect().height,
    };

    // avoid calls before proper initialization
    if (videoInfo.width <= 0 || videoInfo.height <= 0 || videoInfo.id === '') {
      return;
    }

    if (this.parentCh5Background.length === 0) { this.getParentBackground(); }

    Array.from(this.parentCh5Background).forEach((ch5Background: Ch5Background) => {
      ch5Background?.videoBGRequest(videoInfo);
    });
  }

  // Function to add background color to bg if false and clears it if true, @param isShowVideoBehind if true, clears background
  private clearBackgroundOfVideoWrapper(isShowVideoBehind: boolean) {
    this._elContainer.style.background = isShowVideoBehind ? 'transparent' : 'black';
  }

  private _manageControls() {
    this.sendEvent(this.sendEventOnClick, true)
    // If ch5-video is in full screen mode then exit from the full screen
    if (this.isFullScreen) {
      this._elContainer.removeEventListener('touchmove', this.handleTouchEventOnFullScreen, false);
      this._exitFullScreen();
      return;
    }

    // Check whether the full screen option can be shown
    if (this.lastResponseStatus === 'started' || (this.lastRequestStatus === 'resize' && this.lastResponseStatus === 'resized')) {
      this._fullScreenIcon.classList.remove('hide')
    }

    // remove the full screen icon from the ch5-video after 10 seconds
    clearTimeout(this.controlTimer);
    this.controlTimer = setTimeout(() => {
      this._fullScreenIcon.classList.add('hide');
    }, 10000);
  }

  private toggleFullScreen(event: Event) {
    this.isFullScreen = true;
    this.orientationChanged = false;
    // To avoid swiping on the full screen
    this._elContainer.addEventListener('touchmove', this.handleTouchEventOnFullScreen, { passive: true });
    this.classList.add('full-screen');
    this._fullScreenIcon.classList.add('hide');
    document.body.classList.add('ch5-video-fullscreen');
    this.publishVideo(CH5VideoUtils.VIDEO_ACTION.FULLSCREEN);
    event.stopPropagation(); // to prevent the ch5-video from triggering click event 
  }

  private _exitFullScreen() {
    this.isFullScreen = false;
    this.classList.remove('full-screen');
    document.body.classList.remove('ch5-video-fullscreen');

    if (this.orientationChanged) {
      this.ch5BackgroundRequest('refill');
      this.publishVideo('stop');
      this.videoIntersectionObserver();
    } else {
      this.publishVideo('resize');
      setTimeout(() => { this.ch5BackgroundRequest('resize') }, 100); // workaround for CH5C-7463
    }
  }

  private handleTouchEventOnFullScreen(ev: Event) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  private handleMultiVideo() {
    const indexId = this.getAttribute('indexid')?.trim() + '' || this.indexId;
    for (let i = 0; i < 32; i++) {
      const url = this.receiveStateURL.replace(`{{${indexId}}}`, i.toString());
      const userId = this.receiveStateUserId.replace(`{{${indexId}}}`, i.toString());
      const password = this.receiveStatePassword.replace(`{{${indexId}}}`, i.toString());
      const sourceType = this.receiveStateSourceType.replace(`{{${indexId}}}`, i.toString());
      const snapshotURL = this.receiveStateSnapshotURL.replace(`{{${indexId}}}`, i.toString());
      const snapshotUserId = this.receiveStateSnapshotUserId.replace(`{{${indexId}}}`, i.toString());
      const snapshotPassword = this.receiveStateSnapshotPassword.replace(`{{${indexId}}}`, i.toString());
      const snapshotRefreshRate = this.receiveStateSnapshotRefreshRate.replace(`{{${indexId}}}`, i.toString());
      this.signalHolder.push({
        url: { signalState: "", url, value: null },
        userId: { signalState: "", userId, value: null },
        password: { signalState: "", password, value: null },
        sourceType: { signalState: "", sourceType, value: null },
        snapshotURL: { signalState: "", snapshotURL, value: null },
        snapshotUserId: { signalState: "", snapshotUserId, value: null },
        snapshotPassword: { signalState: "", snapshotPassword, value: null },
        snapshotRefreshRate: { signalState: "", snapshotRefreshRate, value: null }
      });
      if (url) {
        const urlSignalResponse = this.setSignalByString(url);
        if (!_.isNil(urlSignalResponse)) {
          this.signalHolder[i].url.signalState = urlSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].url.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.urlCB(newValue); }
          });
        }
      }

      if (userId) {
        const userIdSignalResponse = this.setSignalByString(userId);
        if (!_.isNil(userIdSignalResponse)) {
          this.signalHolder[i].userId.signalState = userIdSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].userId.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.userIdCB(newValue); }
          });
        }
      }

      if (password) {
        const passwordSignalResponse = this.setSignalByString(password);
        if (!_.isNil(passwordSignalResponse)) {
          this.signalHolder[i].password.signalState = passwordSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].password.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.passwordCB(newValue); }

          });
        }
      }

      if (sourceType) {
        const sourceTypeSignalResponse = this.setSignalByString(sourceType);
        if (!_.isNil(sourceTypeSignalResponse)) {
          this.signalHolder[i].sourceType.signalState = sourceTypeSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].sourceType.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.sourceTypeCB(newValue); }
          });
        }
      }

      if (snapshotURL) {
        const snapshotURLSignalResponse = this.setSignalByString(snapshotURL);
        if (!_.isNil(snapshotURLSignalResponse)) {
          this.signalHolder[i].snapshotURL.signalState = snapshotURLSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].snapshotURL.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.snapshotURLCB(newValue); }
          });
        }
      }
      if (snapshotUserId) {
        const snapshotUserIdSignalResponse = this.setSignalByString(snapshotUserId);
        if (!_.isNil(snapshotUserIdSignalResponse)) {
          this.signalHolder[i].snapshotUserId.signalState = snapshotUserIdSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].snapshotUserId.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.snapshotUserIdCB(newValue); }
          });
        }
      }

      if (snapshotPassword) {
        const snapshotPasswordSignalResponse = this.setSignalByString(snapshotPassword);
        if (!_.isNil(snapshotPasswordSignalResponse)) {
          this.signalHolder[i].snapshotPassword.signalState = snapshotPasswordSignalResponse.subscribe((newValue: string) => {
            this.signalHolder[i].snapshotPassword.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.snapshotPasswordCB(newValue); }
          });
        }
      }

      if (snapshotRefreshRate) {
        const snapshotRefreshRateSignalResponse = this.setSignalByNumber(snapshotRefreshRate);
        if (!_.isNil(snapshotRefreshRateSignalResponse)) {
          this.signalHolder[i].snapshotRefreshRate.signalState = snapshotRefreshRateSignalResponse.subscribe((newValue: number) => {
            this.signalHolder[i].snapshotRefreshRate.value = newValue;
            if (this.selectedVideo === i && this.maxVideoCount > this.selectedVideo) { this.snapshotRefreshRateCB(newValue); }
          });
        }
      }
    }
  }

  public setSignalByNumber(value: string): Ch5Signal<number> | null {
    // setup new subscription.
    const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(value);
    const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveLabelSigName);

    if (receiveSignal === null) {
      return null;
    }
    return receiveSignal;
  }


  private setSignalByString(value: string): Ch5Signal<string> | null {
    // setup new subscription.
    const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(value);
    const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);

    if (receiveSignal === null) {
      return null;
    }
    return receiveSignal;

  }

  private addTouchEvent() {
    this.videoTouchHandler = new Ch5VideoTouchManager({
      onTouchStartHandler: this.touchBeginHandler.bind(this),
      onTouchMoveHandler: this.touchMoveHandler.bind(this),
      onTouchEndHandler: this.touchEndHandler.bind(this),
      onTouchCancelHandler: this.touchEndHandler.bind(this),
      pollingDuration: 300,
      componentID: this.getCrId()
    } as TVideoTouchManagerParams);
  }

  // Function to remove touch listeners when polling is stopped
  private removeTouchEvent() {
    if (!!this.videoTouchHandler &&
      this.videoTouchHandler !== null &&
      typeof (this.videoTouchHandler) !== 'undefined' &&
      this.videoTouchHandler.destructor) {
      this.videoTouchHandler.destructor();
    }
  }

  // Function to handle touch start event
  private touchBeginHandler() {
    const boundedRect = this._elContainer.getBoundingClientRect();
    this.touchCoordinates.startX = boundedRect.left;
    this.touchCoordinates.startY = boundedRect.top;
    this.isTouchInProgress = false;
  }

  // Function to check if the touch swipe has stopped and video finally is a static position
  private touchMoveHandler() {
    if (!this.isTouchInProgress) {
      const boundedRect = this._elContainer.getBoundingClientRect();
      this.touchCoordinates.endX = boundedRect.left;
      this.touchCoordinates.endY = boundedRect.top;
      if (Math.abs(this.touchCoordinates.startX - this.touchCoordinates.endX) > this.swipeDeltaCheckNum ||
        Math.abs(this.touchCoordinates.startY - this.touchCoordinates.endY) > this.swipeDeltaCheckNum) {
        this.isTouchInProgress = true;
        // Adding stop over here
        this.clearBackgroundOfVideoWrapper(false);
        this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.STOP);
        this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
      }
    }
  }

  // Function to manage video play/stop based on the position on touch end or cancel
  private touchEndHandler() {
    this.isTouchInProgress ? setTimeout(() => this.videoIntersectionObserver(), 100) : this.isTouchInProgress = false;
  }

  private validateAndAttachSnapshot() {
    if (this.snapshotURL.trim() === '') {
      this.sendEvent(this.sendEventSnapshotStatus, 0)
    } else if (this.snapshotURL.trim() !== '' && this.url !== '') {
      this.snapshotImage.url = this.snapshotURL;
      this.snapshotImage.userId = this.snapshotUserId;
      this.snapshotImage.password = this.snapshotPassword;
      this.snapshotImage.refreshRate = this.snapshotRefreshRate;
      this.snapshotImage.sendEventSnapshotStatus = this.sendEventSnapshotStatus;
      this.snapshotImage.sendEventSnapshotLastUpdateTime = this.sendEventSnapshotLastUpdateTime;
      if (this.lastResponseStatus !== 'started') {
        if (this.playValue === true) {
          this.snapshotImage.startLoadingSnapshot();
        }
        if (this.snapshotImage.getImage().isConnected === false) {
          this._elContainer.appendChild(this.snapshotImage.getImage());
        }
      }
    }
  }

  public getParentBackground() {
    const getTheMatchingParent = (node: HTMLElement) => {
      if (node && node.classList.contains('ch5-background--parent')) {
        const parentElement = node.getElementsByTagName('ch5-background')[0] as Ch5Background;
        this.parentCh5Background.push(parentElement)
      }
      node && getTheMatchingParent(node.parentElement as HTMLElement);
    }
    getTheMatchingParent(this.parentElement as HTMLElement);
  }

  private handleOrientation = () => {
    if (this.isFullScreen) {
      this.orientationChanged = true;
      this.publishVideo('fullscreen')
    } else {
      if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && this.playValue && this.show) {
        // Below fix is for CH5C-6943 as a work-around. If firmware fixes it, the same can be removed.
        setTimeout(() => {
          this.publishVideo('resize');
          setTimeout(() => { this.ch5BackgroundRequest('resize'); }, 30);
        }, 70)
      }
    }
  }

  private checkUrl() {
    if (this.url === '') {
      this.ch5BackgroundRequest('nourl');
      this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
    } else if (this.validateVideoUrl(this.url) === false) {
      this.sendEvent(this.sendEventErrorMessage, 'Invalid URL');
      this.sendEvent(this.sendEventErrorCode, -9002);
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR);
      this.publishVideo(CH5VideoUtils.VIDEO_ACTION.STOP);
    } else {
      this.videoIntersectionObserver();
    }
  }

  private refillBackground() {
    if (this.parentCh5Background.length === 0) { this.getParentBackground(); }

    Array.from(this.parentCh5Background).forEach((ch5Background: Ch5Background) => {
      ch5Background?.refillBackground();
    });
  }

  private setErrorMessages() {
    this.videoErrorMessages.set(0, "success");
    // this.videoErrorMessages.set(1, "HDMI no sync");
    // this.videoErrorMessages.set(2, "DM no stream");
    // this.videoErrorMessages.set(3, "No input sync");
    this.videoErrorMessages.set(-1, "connection refused / camera offline");
    this.videoErrorMessages.set(-2, "no network");
    // this.videoErrorMessages.set(-3, "Unsupported source type for this platform");
    // this.videoErrorMessages.set(-4, "Connection timeout");
    // this.videoErrorMessages.set(-5, "Invalid credentials");
    // this.videoErrorMessages.set(-6, "Unsupported streaming protocol");
    // this.videoErrorMessages.set(-7, "Unsupported codec");
    this.videoErrorMessages.set(-1001, "Credentials required or invalid");
    this.videoErrorMessages.set(-1002, "Hostname invalid");
    this.videoErrorMessages.set(-1003, "Unsupported codec");
    this.videoErrorMessages.set(-9001, "Unsupported source type");
    this.videoErrorMessages.set(-9002, "Invalid URL");
    this.videoErrorMessages.set(-9003, "Request for greater than maximum simultaneous sessions per source type");
    this.videoErrorMessages.set(-9004, "Request for greater than maximum simultaneous sessions per device");
    this.videoErrorMessages.set(-9007, "Unknown Error Message");
  }

  private urlCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("url", newValue, () => {
      this.sendEvent(this.sendEventSelectionURL, this.url);
      this.checkUrl();
    });
  }

  private userIdCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("userId", newValue, () => {
      this.videoIntersectionObserver();
    });
  }

  private passwordCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("password", newValue, () => {
      this.videoIntersectionObserver();
    });
  }

  private sourceTypeCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("sourceType", newValue, () => {
      this.sendEvent(this.sendEventSelectionSourceType, this.sourceType);
      this.videoIntersectionObserver();
    });
  }

  private snapshotURLCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("snapshotURL", newValue, () => {
      this.sendEvent(this.sendEventSnapshotURL, this.snapshotURL);
      this.validateAndAttachSnapshot();
    });
  }

  private snapshotUserIdCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("snapshotUserId", newValue, () => {
      this.validateAndAttachSnapshot();
    });
  }

  private snapshotPasswordCB(newValue: string) {
    this._ch5Properties.setForSignalResponse<string>("snapshotPassword", newValue, () => {
      this.validateAndAttachSnapshot();
    });
  }

  private snapshotRefreshRateCB(newValue: number) {
    this._ch5Properties.setForSignalResponse<number>("snapshotRefreshRate", newValue, () => {
      this.validateAndAttachSnapshot();
    });
  }

  private clearOldSubscriptionNumber(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveStateSigName);

    if (oldSignal !== null) {
      oldSignal.unsubscribe(signalState as string);
    }
  }
  private clearOldSubscriptionString(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveStateSigName);

    if (oldSignal !== null) {
      oldSignal.unsubscribe(signalState as string);
    }
  }

  private clearMultiSignal() {
    this.signalHolder.forEach((obj: any) => {
      this.clearOldSubscriptionString(obj.url.signalValue, obj.url.signalState);
      this.clearOldSubscriptionString(obj.userId.signalValue, obj.userId.signalState);
      this.clearOldSubscriptionString(obj.password.signalValue, obj.password.signalState);
      this.clearOldSubscriptionString(obj.sourceType.signalValue, obj.sourceType.signalState);
      this.clearOldSubscriptionString(obj.snapshotURL.signalValue, obj.snapshotURL.signalState);
      this.clearOldSubscriptionString(obj.snapshotUserId.signalValue, obj.snapshotUserId.signalState);
      this.clearOldSubscriptionString(obj.snapshotPassword.signalValue, obj.snapshotPassword.signalState);
      this.clearOldSubscriptionNumber(obj.snapshotRefreshRate.signalValue, obj.snapshotRefreshRate.signalState);
    });
  }
  // #endregion

}

Ch5Video.registerCustomElement();
Ch5Video.registerSignalAttributeTypes();

import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { subscribeState } from "../ch5-core";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5VideoAspectRatio, TCh5VideoSourceType, TCh5VideoSize, } from './interfaces/t-ch5-video';
import { ICh5VideoAttributes } from './interfaces/i-ch5-video-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { CH5VideoUtils } from "./ch5-video-utils";
import { ICh5VideoPublishEvent, ITouchOrdinates, TDimension, TMultiVideoSignalName, TPosDimension, TVideoResponse, TVideoTouchManagerParams } from "./interfaces/interfaces-helper";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { ICh5VideoBackground } from "./interfaces/types/t-ch5-video-publish-event-request";
import { Ch5Background } from "../ch5-background";
import { getScrollableParent } from "../ch5-core/get-scrollable-parent";
import { Ch5VideoSnapshot } from "./ch5-video-snapshot";
import { Ch5VideoTouchManager } from "./ch5-video-touch-manager";

export class Ch5Video extends Ch5Common implements ICh5VideoAttributes {

  // #region Variables

  public static readonly ASPECT_RATIO: TCh5VideoAspectRatio[] = ['16:9', '4:3'];
  public static readonly SOURCE_TYPE: TCh5VideoSourceType[] = ['Network', 'HDMI', 'DM'];
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
    },
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
    sendeventsnapshotlastupdatetime: { direction: "event", stringJoin: 1, contractName: true },

  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "0",
      name: "indexId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "0",
      isObservableProperty: true,
    },
    {
      default: Ch5Video.ASPECT_RATIO[0],
      enumeratedValues: Ch5Video.ASPECT_RATIO,
      name: "aspectRatio",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Video.ASPECT_RATIO[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "stretch",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true,
    },
    {
      default: "",
      name: "url",
      nameForSignal: "receiveStateURL",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: Ch5Video.SOURCE_TYPE[0],
      enumeratedValues: Ch5Video.SOURCE_TYPE,
      name: "sourceType",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateSourceType",
      type: "enum",
      valueOnAttributeEmpty: Ch5Video.SOURCE_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: "",
      name: "userId",
      nameForSignal: "receiveStateUserId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "password",
      nameForSignal: "receiveStatePassword",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "snapshotURL",
      nameForSignal: "receiveStateSnapshotURL",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: 5,
      name: "snapshotRefreshRate",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateSnapshotRefreshRate",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 5,
        max: 60,
        conditionalMin: 5,
        conditionalMax: 60,
        conditionalMinValue: 5,
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
      isObservableProperty: true,
    },
    {
      default: "",
      name: "snapshotPassword",
      nameForSignal: "receiveStateSnapshotPassword",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: Ch5Video.SIZE[0],
      enumeratedValues: Ch5Video.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Video.SIZE[0],
      isObservableProperty: true,
    },
    {
      default: 0,
      name: "zindex",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 999,
        conditionalMin: 0,
        conditionalMax: 999,
        conditionalMinValue: 0,
        conditionalMaxValue: 999
      },
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
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSelect",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSourceType",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateUserId",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStatePassword",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotRefreshRate",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotUserId",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapshotPassword",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateVideoCount",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnClick",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSelectionChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSelectionSourceType",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSelectionURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapshotURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventState",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventErrorCode",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventErrorMessage",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventRetryCount",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventResolution",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapshotStatus",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapshotLastUpdateTime",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-video';

  public primaryCssClass = 'ch5-video';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _fullScreenIcon: HTMLElement = {} as HTMLElement;

  private responseObj: TVideoResponse = {} as TVideoResponse;
  private sizeObj: TDimension = { width: 0, height: 0 };
  private ch5BackgroundElements: HTMLCollectionOf<Ch5Background> = document.getElementsByTagName('ch5-background') as HTMLCollectionOf<Ch5Background>;

  private readonly INTERSECTION_RATIO_VALUE: number = 0.98;
  private playValue: boolean = true;
  private lastRequestStatus: string = '';
  private isVideoReady: boolean = false;
  private lastResponseStatus: string = '';
  private videoTagId: string = ''; //  to pass video bg object json
  private oldResponseStatus: string = '';
  private oldResponseId: number = 0;
  private requestID: number = 0; //  to cross check req id and resp id
  private isOrientationChanged: boolean = false;
  private isFullScreen: boolean = false;
  private isAlphaBlend: boolean = true;
  private isSwipeDebounce: any;
  private _wasAppBackGrounded: boolean = false;
  private isVideoPublished = false;
  private controlTimer: any;
  private scrollTimer: any;
  private snapshotImage = new Ch5VideoSnapshot();
  private maxVideoCount = 1;
  private selectedVideo = 0;
  private lastBackGroundRequest: string = '';
  private previousXPos: number = 0;
  private previousYPos: number = 0;
  public ch5UId: number = 0; //  CH5 Unique ID

  private firstTime: boolean = true;
  private orientationCount: number = 0;

  // touch specific [params]
  private videoTouchHandler: Ch5VideoTouchManager = {} as Ch5VideoTouchManager;
  private isTouchInProgress: boolean = false;
  private readonly swipeDeltaCheckNum: number = 20;
  private touchCoordinates: ITouchOrdinates = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  }; // instantiating empty object to proceed

  private multiVideoSignalName: TMultiVideoSignalName = {
    url: '',
    userId: '',
    password: '',
    sourceType: '',
    snapshotURL: '',
    snapshotUserId: '',
    snapshotPassword: '',
    snapshotRefreshRate: ''
  }

  // #endregion

  // #region Getters and Setters


  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value, () => {
      this.handleIndexId();
    });
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
    this._ch5Properties.set<string>("url", value, () => {
      this.handleReceiveStateURL();
    });
  }
  public get url(): string {
    return this._ch5Properties.get<string>("url");
  }

  public set sourceType(value: TCh5VideoSourceType) {
    this._ch5Properties.set<TCh5VideoSourceType>("sourceType", value, () => {
      this.handleReceiveStateURL();
    });
  }
  public get sourceType(): TCh5VideoSourceType {
    return this._ch5Properties.get<TCh5VideoSourceType>("sourceType");
  }

  public set userId(value: string) {
    this._ch5Properties.set<string>("userId", value, () => {
      this.handleReceiveStateURL();
    });
  }
  public get userId(): string {
    return this._ch5Properties.get<string>("userId");
  }

  public set password(value: string) {
    this._ch5Properties.set<string>("password", value, () => {
      this.handleReceiveStateURL();
    });
  }
  public get password(): string {
    return this._ch5Properties.get<string>("password");
  }

  public set snapshotURL(value: string) {
    this._ch5Properties.set<string>("snapshotURL", value, () => {
      if (this.snapshotURL.trim() !== '') { this.maxVideoCount = 1 }
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

  public set zindex(value: number) {
    this._ch5Properties.set<number>("zindex", value);
  }
  public get zindex(): number {
    return this._ch5Properties.get<number>("zindex");
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
      this.selectedVideo = newValue;
      if (newValue >= 0 && newValue < this.maxVideoCount) {
        if (this.sendEventSelectionChange.trim().length !== 0 && this.sendEventSelectionChange !== null && this.sendEventSelectionChange !== undefined) {
          Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventSelectionChange)?.publish(this.selectedVideo);
        }
        this.handleReceiveStateSelect(newValue);
      }
    });
  }
  public get receiveStateSelect(): string {
    return this._ch5Properties.get<string>('receiveStateSelect');
  }

  public set receiveStateURL(value: string) {
    this._ch5Properties.set("receiveStateURL", value, null, (newValue: string) => {
      if (this.receiveStateURL.includes(`{{${this.indexId}}}`)) {
        this.receiveStateURL = this.receiveStateURL.replace(`{{${this.indexId}}}`, this.selectedVideo.toString());
        console.log("selected video", this.selectedVideo, this.maxVideoCount);
      } else {
        this._ch5Properties.setForSignalResponse<string>("url", newValue, () => {
          if (this.sendEventSelectionURL.trim().length !== 0 && this.sendEventSelectionURL !== null && this.sendEventSelectionURL !== undefined) {
            Ch5SignalFactory.getInstance().getStringSignal(this.sendEventSelectionURL)?.publish(this.url);
          }
          this.handleReceiveStateURL();
        });
      }
    });
  }
  public get receiveStateURL(): string {
    return this._ch5Properties.get<string>('receiveStateURL');
  }

  public set receiveStateSourceType(value: string) {
    this._ch5Properties.set("receiveStateSourceType", value, null, (newValue: string) => {
      if (this.receiveStateSourceType.includes(`{{${this.indexId}}}`)) {
        this.receiveStateSourceType = this.receiveStateSourceType.replace(`{{${this.indexId}}}`, this.selectedVideo.toString())
      } else {
        this._ch5Properties.setForSignalResponse<string>("sourceType", newValue, () => {
          if (this.sendEventSelectionSourceType.trim().length !== 0 && this.sendEventSelectionSourceType !== null && this.sendEventSelectionSourceType !== undefined) {
            Ch5SignalFactory.getInstance().getStringSignal(this.sendEventSelectionSourceType)?.publish(this.sourceType);
          }
          this.handleReceiveStateURL();
        });
      }
    });
  }
  public get receiveStateSourceType(): string {
    return this._ch5Properties.get<string>('receiveStateSourceType');
  }

  public set receiveStateUserId(value: string) {
    this._ch5Properties.set("receiveStateUserId", value, null, (newValue: string) => {
      if (this.receiveStateUserId.includes(`{{${this.indexId}}}`)) {
        this.receiveStateUserId = this.receiveStateUserId.replace(`{{${this.indexId}}}`, this.selectedVideo.toString())
      } else {
        this._ch5Properties.setForSignalResponse<string>("userId", newValue, () => {
          this.handleReceiveStateURL();
        });
      }
    });
  }
  public get receiveStateUserId(): string {
    return this._ch5Properties.get<string>('receiveStateUserId');
  }

  public set receiveStatePassword(value: string) {
    this._ch5Properties.set("receiveStatePassword", value, null, (newValue: string) => {
      if (this.receiveStatePassword.includes(`{{${this.indexId}}}`)) {
        this.receiveStatePassword = this.receiveStatePassword.replace(`{{${this.indexId}}}`, this.selectedVideo.toString())
      } else {
        this._ch5Properties.setForSignalResponse<string>("password", newValue, () => {
          this.handleReceiveStateURL();
        });
      }
    });
  }
  public get receiveStatePassword(): string {
    return this._ch5Properties.get<string>('receiveStatePassword');
  }

  public set receiveStateSnapshotURL(value: string) {
    this._ch5Properties.set("receiveStateSnapshotURL", value, null, (newValue: string) => {
      if (this.receiveStateSnapshotURL.includes(`{{${this.indexId}}}`)) {
        this.receiveStateSnapshotURL = this.receiveStateSnapshotURL.replace(`{{${this.indexId}}}`, this.selectedVideo.toString())
      } else {
        this._ch5Properties.setForSignalResponse<string>("snapshotURL", newValue, () => {
          if (this.sendEventSnapshotURL.trim().length !== 0 && this.sendEventSnapshotURL !== null && this.sendEventSnapshotURL !== undefined) {
            Ch5SignalFactory.getInstance().getStringSignal(this.sendEventSnapshotURL)?.publish(this.snapshotURL);
          }
          this.validateAndAttachSnapshot();
        });
      }
    });
  }
  public get receiveStateSnapshotURL(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotURL');
  }

  public set receiveStateSnapshotRefreshRate(value: string) {
    this._ch5Properties.set("receiveStateSnapshotRefreshRate", value, null, (newValue: number) => {
      if (this.receiveStateSnapshotRefreshRate.includes(`{{${this.indexId}}}`)) {
        this.receiveStateSnapshotRefreshRate = this.receiveStateSnapshotRefreshRate.replace(`{{${this.indexId}}}`, this.selectedVideo.toString());
      } else {
        this._ch5Properties.setForSignalResponse<number>("snapshotRefreshRate", newValue, () => {
          this.validateAndAttachSnapshot();
        });
      }
    });
  }
  public get receiveStateSnapshotRefreshRate(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotRefreshRate');
  }

  public set receiveStateSnapshotUserId(value: string) {
    this._ch5Properties.set("receiveStateSnapshotUserId", value, null, (newValue: string) => {
      if (this.receiveStateSnapshotUserId.includes(`{{${this.indexId}}}`)) {
        this.receiveStateSnapshotUserId = this.receiveStateSnapshotUserId.replace(`{{${this.indexId}}}`, this.selectedVideo.toString())
      } else {
        this._ch5Properties.setForSignalResponse<string>("snapshotUserId", newValue, () => {
          this.validateAndAttachSnapshot();
        });
      }
    });
  }
  public get receiveStateSnapshotUserId(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotUserId');
  }

  public set receiveStateSnapshotPassword(value: string) {
    this._ch5Properties.set("receiveStateSnapshotPassword", value, null, (newValue: string) => {
      if (this.receiveStateSnapshotPassword.includes(`{{${this.indexId}}}`)) {
        this.receiveStateSnapshotPassword = this.receiveStateSnapshotPassword.replace(`{{${this.indexId}}}`, this.selectedVideo.toString())
      } else {
        this._ch5Properties.setForSignalResponse<string>("snapshotPassword", newValue, () => {
          this.validateAndAttachSnapshot();
        });
      }
    });
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
    this.ignoreAttributes = ['disabled', 'receiveStateEnable'];
    this.logger.start('constructor()', Ch5Video.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5Video.COMPONENT_PROPERTIES);
    this.updateCssClass();
    this.handleMultiVideo();
    subscribeState('o', 'Csig.video.response', this._videoResponse.bind(this), this._errorResponse.bind(this));
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
    //  WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5Video);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-video');
      this.appendChild(this._elContainer);
    }

    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-video').then(() => {
      this._initializeVideo();
      this.validateAndAttachSnapshot();
      this.componentLoadedEvent(Ch5Video.ELEMENT_NAME, this.id);
      this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.isVideoReady = false;
    });
    Ch5CoreIntersectionObserver.getInstance().observe(this, this.videoIntersectionObserver.bind(this));
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
    this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.REFILL, 'disconnect');
    this.logger.stop();
  }

  // #endregion

  // #region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');

    //  Create div for the right side of the control panel
    this._fullScreenIcon = document.createElement("a");
    this._fullScreenIcon.classList.add("full-screen-icon");
    this._fullScreenIcon.classList.add("hide");
    this._fullScreenIcon.innerHTML = CH5VideoUtils.SVG_ICONS.FULLSCREEN_ICON;

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
    this.addEventListener('click', this._manageControls.bind(this));
    this._fullScreenIcon.addEventListener('click', this.toggleFullScreen.bind(this));
    window.addEventListener('orientationchange', this._orientationChange.bind(this));
    window.addEventListener(CH5VideoUtils.VIDEO_ACTION.RESIZE, this._orientationChange.bind(this));
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this.removeEventListener('click', this._manageControls.bind(this));
    this._fullScreenIcon.removeEventListener('click', this.toggleFullScreen.bind(this));
    window.removeEventListener('orientationchange', this._orientationChange.bind(this));
    window.removeEventListener(CH5VideoUtils.VIDEO_ACTION.RESIZE, this._orientationChange.bind(this));
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  /**
   * Clear the content of component in order to avoid duplication of elements
   */
  private clearComponentContent() {
    const containers = this.getElementsByTagName("div");
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }

  // Initializes the elements of ch5-video
  private _initializeVideo() {
    const uID = this.getCrId().split('cr-id-')[1];
    this.ch5UId = parseInt(uID, 0);
    this.videoTagId = this.getCrId();
    this.setAttribute("id", this.getCrId());
    //  A dummy call to make the video to play on first project load
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(CH5VideoUtils.VIDEO_ACTION.STOP, this.ch5UId));
  }


  private handleIndexId() {
    //  Enter your Code here
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
      return this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
    }
    this.validateAndAttachSnapshot();
    this.handleReceiveStateURL();
  }

  private handleReceiveStateSelect(select: number) {
    if (this.multiVideoSignalName.url.includes(`{{${this.indexId}}}`)) { this.receiveStateURL = this.multiVideoSignalName.url.replace(`{{${this.indexId}}}`, select.toString()) }
    if (this.multiVideoSignalName.userId.includes(`{{${this.indexId}}}`)) { this.receiveStateUserId = this.multiVideoSignalName.userId.replace(`{{${this.indexId}}}`, select.toString()) }
    if (this.multiVideoSignalName.password.includes(`{{${this.indexId}}}`)) { this.receiveStatePassword = this.multiVideoSignalName.password.replace(`{{${this.indexId}}}`, select.toString()) }
    if (this.multiVideoSignalName.snapshotURL.includes(`{{${this.indexId}}}`)) { this.receiveStateSnapshotURL = this.multiVideoSignalName.snapshotURL.replace(`{{${this.indexId}}}`, select.toString()) }
    if (this.multiVideoSignalName.snapshotUserId.includes(`{{${this.indexId}}}`)) { this.receiveStateSnapshotUserId = this.multiVideoSignalName.snapshotUserId.replace(`{{${this.indexId}}}`, select.toString()) }
    if (this.multiVideoSignalName.snapshotPassword.includes(`{{${this.indexId}}}`)) { this.receiveStateSnapshotPassword = this.multiVideoSignalName.snapshotPassword.replace(`{{${this.indexId}}}`, select.toString()) }
    if (this.multiVideoSignalName.snapshotRefreshRate.includes(`{{${this.indexId}}}`)) { this.receiveStateSnapshotRefreshRate = this.multiVideoSignalName.snapshotRefreshRate.replace(`{{${this.indexId}}}`, select.toString()) }
  }

  private handleReceiveStateURL() {
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
      this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.isVideoReady = false;
      if (this.url === '') {
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        this.snapshotImage.stopLoadingSnapshot();
      } else {
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
      }
    }
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._elContainer.classList.add(this.primaryCssClass + Ch5Video.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio.replace(':', '-'));
    this._elContainer.classList.add(this.primaryCssClass + Ch5Video.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this._elContainer.classList.add(this.primaryCssClass);
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }


  private stopAndRefill() {
    this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.REFILL, 'OnVideoAspectRatioConditionNotMet');
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(CH5VideoUtils.VIDEO_ACTION.STOP, this.ch5UId));
  }

  /**
   * When the video element is more than 100% visible the video should start and
   * when the visibility is less than 100% the video should stop playing.
   */
  public videoIntersectionObserver() {
    this.logger.log("videoIntersectionObserver#intersectionRatio -> " + this.elementIntersectionEntry.intersectionRatio);
    this.lastBackGroundRequest = "";
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && this.playValue) {
      this._onRatioAboveLimitToRenderVideo();
    } else {
      this._OnVideoAspectRatioConditionNotMet();
    }
    //  Removes or Adds document level touch handlers if in view
    if (this.elementIntersectionEntry.intersectionRatio > 0.1 && this.playValue) {
      this.addTouchPollingForVideoMonitor();
    } else {
      this.stopAndRefill();
      this.removeTouchPollingForVideoMonitor();
    }
  }

  /**
   * Function to render video if it is under the visible range | supposed to be shown
   * this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE
   */
  private _onRatioAboveLimitToRenderVideo() {
    clearTimeout(this.isSwipeDebounce);
    this.isSwipeDebounce = setTimeout(() => {
      this.calculation();

      if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY && this.isOrientationChanged ||
        this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START || (!this.isFullScreen && !this.isOrientationChanged &&
          this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.FULLSCREEN)) {
        this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.isVideoReady = false;
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
      }
    }, 300); //  reducing this will create a cut at wrong place
  }

  /**
   * Function to render video if it is lesser than the necessary visible range | supposed to be hidden
   * this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE
   */
  private _OnVideoAspectRatioConditionNotMet() {
    if (this.isFullScreen) { return; }
    this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
    this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.REFILL, 'disconnect');
    //this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.REFILL, 'OnVideoAspectRatioConditionNotMet');
    //publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(CH5VideoUtils.VIDEO_ACTION.STOP, this.ch5UId)); // Stop the video immediately
  }

  /**
   * Calculate the size and position of the canvas
   */
  private calculation(): void {
    if (!this.isFullScreen) {
      this.sizeObj = {
        width: this._elContainer.getBoundingClientRect().width,
        height: this._elContainer.getBoundingClientRect().height
      };
    }
  }

  private videoStopObjJSON(actionType: string, uId: number): ICh5VideoPublishEvent {
    this.lastRequestStatus = actionType;
    const retObj: any = {
      "action": actionType,
      "id": uId
    };
    this.logger.log(JSON.stringify(retObj));
    console.log('return obj', JSON.stringify(retObj));
    return retObj;
  }

  // Create the Video JSON object to start the video
  public videoStartObjJSON(actionType: string, logInfo: string): ICh5VideoPublishEvent {
    let xPosition: number = this._elContainer.getBoundingClientRect().left;
    let yPosition: number = this._elContainer.getBoundingClientRect().top;
    let width: number = this.sizeObj.width;
    let height: number = this.sizeObj.height;

    if (actionType === CH5VideoUtils.VIDEO_ACTION.FULLSCREEN) {
      actionType = CH5VideoUtils.VIDEO_ACTION.RESIZE;
      xPosition = 0;
      yPosition = 0;
      width = window.innerWidth;
      height = window.innerHeight;
    }

    this.lastRequestStatus = actionType;
    this.clearBackgroundOfVideoWrapper(true); //  always clears the background of the video tag to display video behind it
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
        z: this.zindex
      },
      alphablend: this.isAlphaBlend, //  optional, default true, false indicates video displayed above the HTML
      starttime: new Date().getMilliseconds(), //  milliseconds since 1-1-1970 UTC
      endtime: new Date().getMilliseconds() + 2000, //  2000 msecs later
      timing: "linear" //  only linear supported initially
    };

    console.log(logInfo + JSON.stringify(retObj));
    return retObj;
  }

  // Publish the video start request
  private _videoStartRequest(actionType: string) {
    if (this.url.trim() === '') {
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.NOURL, 'videoStartRequest');
      return;
    }
    if (!CH5VideoUtils.validateVideoUrl(this.url)) { //  Invalid URL scenario, validation error                
      this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.ERROR;
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, 'videoStartRequest');
      return;
    }
    this.isVideoReady = true;
    if (this.responseObj?.id && this.responseObj?.id !== this.ch5UId && this.responseObj?.status === 'started') {
      publishEvent('o', 'Csig.video.request', this.videoStopObjJSON('stop', this.responseObj?.id));
      setTimeout(() => {
        publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'videoStartRequest'));
      }, 300);
    } else {
      publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'videoStartRequest'));
    }
    this.requestID = this.ch5UId;
  }

  private _videoStopRequest(actionType: string) { // Publish the video stop request
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId)); // Stop the video immediately
    this.isVideoReady = false;
    if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(3);
    }
  }

  // Send event to the backend based on the action Type
  private _publishVideoEvent(actionType: string) {
    // this.responseObj = {} as TVideoResponse; // TODO
    this.isAlphaBlend = !this.isFullScreen;
    if (this.sendEventResolution.trim().length !== 0 && this.sendEventResolution !== null && this.sendEventResolution !== undefined) {
      Ch5SignalFactory.getInstance().getStringSignal(this.sendEventResolution)?.publish(this.sizeObj.width + "x" + this.sizeObj.height + "@24fps");
    }
    this._clearOldResponseData(); //  reset old response, required to check whether the second response is same.
    switch (actionType) {
      case CH5VideoUtils.VIDEO_ACTION.START:
        this.isVideoPublished = true;
        if (!this.isVideoReady && this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.START && this.url &&
          (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
            this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR || this._wasAppBackGrounded)) {
          this.logger.log("*** videoStartRequest");
          this._videoStartRequest(actionType);
        } else {
          if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
            Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(0);
          }
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.STOP:
        if (!this.isVideoPublished) { //  this flag avoids stop command since no video has started
          return;
        }
        if (this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.STOP && (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
          this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED || !this.elementIsInViewPort ||
          ((this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR)))) {
          this._videoStopRequest(actionType);
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZE:
        //  If the video has already stopped then there is no need to resize.
        if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
          this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.STOP) {
          return;
        }
        this.calculation();
        publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
        this.isVideoReady = false;
        break;
      case CH5VideoUtils.VIDEO_ACTION.FULLSCREEN:
        if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED) {
          publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
          this.isVideoReady = false;
        }
        break;
      default:
    }
  }

  private _videoResponse(response: TVideoResponse) { //  Process the backend response
    if (typeof response === 'string') {
      this.responseObj = JSON.parse(response);
    } else {
      this.responseObj = response;
    }
    console.log("_videoResponse-->", JSON.stringify(this.responseObj));
    const isMyObjectEmpty = !Object.keys(response).length;
    if (this.responseObj.id !== this.ch5UId || isMyObjectEmpty) {
      return;
    }
    if (isMyObjectEmpty) {
      this.isVideoReady = false;
      return;
    }
    //  Return if the previous id and status of the response matches with current id and status of the response
    if (this.oldResponseStatus === this.responseObj.status && this.oldResponseId === this.responseObj.id) {
      return;
    }
    //  Return if response object id is negative or empty
    if (this.responseObj.id === -1 || !this.responseObj.id) {
      return;
    }
    //  Return if the request Id and response Id is not same
    if (this.requestID !== this.responseObj.id) {
      return;
    }
    //  Return if response status is queued as we do not take any action in UI
    if (this.responseObj.status === 'queued') {
      return;
    }

    this.logger.log("Video Response : " + JSON.stringify(this.responseObj));

    this.oldResponseStatus = this.responseObj.status;
    this.oldResponseId = this.responseObj.id;
    const responseStatCode: number = this.responseObj.statusCode || 0;
    const responseStatus = this.responseObj.status.toLowerCase();
    console.log('Response Status: ' + responseStatus.toLowerCase());
    switch (responseStatus.toLowerCase()) {
      case CH5VideoUtils.VIDEO_ACTION.STOPPED:
        //  When the user continously clicks on play and stop without a gap, started
        const vidResponses = ['connecting', 'buffering', 'retrying', 'resizing', 'error'];
        if (vidResponses.indexOf(this.lastResponseStatus) !== -1) {
          this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
          this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.STARTED;
          this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        }
        this.isVideoReady = false;
        this.isOrientationChanged = false;


        if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
          Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(1);
        }
        this._fullScreenIcon.classList.add('hide');
        break;
      case 'connecting':
        this.isVideoReady = false;
        if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
            Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(4);
          }
        }
        break;
      case 'buffering':
        this.isVideoReady = false;
        if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
            Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(5);
          }
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.STARTED:
        this.isVideoReady = true;
        this.isOrientationChanged = false;


        if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
          Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(2);
        }
        this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.STARTED, 'videoResponse');

        /*
         * If CH5VideoUtils.VIDEO_ACTION.STARTED response is delayed Check visibility.
         * If the visibility is false send a stop request to stop the video
         */
        if (this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE) {
          this.logger.log("Video not visible (" + this.elementIntersectionEntry.intersectionRatio + ").");
          this.logger.log("Received CH5VideoUtils.VIDEO_ACTION.STARTED delayed response from VSM. Sending CH5VideoUtils.VIDEO_ACTION.STOP request from UI.");
          this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        }
        break;
      case 'retrying':
        this.isVideoReady = false;
        if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
            Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(6);
          }
        }
        /* this.retryCount = this.retryCount + 1;
        this._sendEvent(this.sendEventRetryCount, this.retryCount, 'number'); */
        break;
      case 'resizing':
        this.isVideoReady = false;
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZED:
        this.isOrientationChanged = false;


        //  iOS devices never returns STARTED, it returns RESIZED after it starts the video
        /* if (isSafariMobile()) {
          if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
            this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.STARTED, 'videoResponse');
            this.isVideoReady = true;
          }
        } else {
          if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.RESIZE) {
            this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.STARTED, 'videoResponse');
            this.isVideoReady = true;
          }
        } */
        break;
      case 'error':
        this.info("Error case in Csig.video.response with status code : " + responseStatCode);
        if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          if (this.sendEventState.trim().length !== 0 && this.sendEventState !== null && this.sendEventState !== undefined) {
            Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventState)?.publish(7);
          }
        }
        /*  if (this.responseObj.statusCode) {
           this._sendEvent(this.sendEventErrorCode, this.responseObj.statusCode, 'number');
           if (this._videoErrorMessages.has(this.responseObj.statusCode)) {
             this._sendEvent(this.sendEventErrorMessage, this._videoErrorMessages.get(this.responseObj.statusCode), 'string');
           } else {
             this._sendEvent(this.sendEventErrorMessage, "Unknown Error Message", 'string');
           }
         } */
        this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.ERROR;
        this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.isVideoReady = false;
        //  Increment the errorCount and send the background stop only once to avoid flickering during
        //  continuous error feedback
        /* if (this.errorCount === 0) {
          this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, 'videoResponse');
        } */
        //  this.errorCount = this.errorCount + 1;
        break;
      default:
        this.info("Default case in Csig.video.response with status : " + responseStatus);
        this.isVideoReady = false;
        //  Increment the retryCount and send the feedback
        /* if (responseStatus === 'retrying connection') {
          this.retryCount += this.retryCount;
          this._sendEvent(this.sendEventRetryCount, this.retryCount, 'number');
        } */
        break;
    }
    this.lastResponseStatus = responseStatus;
  }

  // Call back function if the video response has an error
  private _errorResponse(error: any) {
    this.info("Ch5Video - Error when the video response", error);
  }

  private ch5BackgroundRequest(actionType: string, calledBy: string): void {
    let isActionExecuted: boolean = true;
    const nodeList: NodeList = this._elContainer.childNodes;

    switch (actionType) {
      case CH5VideoUtils.VIDEO_ACTION.NOURL:
        this.clearBackgroundOfVideoWrapper(false);
        if (nodeList.length > 1) {
          this._elContainer.childNodes[1].remove();
        }
        this._elContainer.style.borderBottom = '1rem solid #828282'; //  Gray color
        break;
      case CH5VideoUtils.VIDEO_ACTION.REFILL:
        if (this.lastBackGroundRequest !== actionType) {
          this.ch5BackgroundAction(CH5VideoUtils.VIDEO_ACTION.REFILL);
        } else {
          isActionExecuted = false;
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZE:
        this.ch5BackgroundAction(CH5VideoUtils.VIDEO_ACTION.RESIZE);
        break;
      case CH5VideoUtils.VIDEO_ACTION.STARTED:
        this.resetVideoElement();
        this.snapshotImage.stopLoadingSnapshot();
        // this.firstTime = false;
        this.ch5BackgroundAction(CH5VideoUtils.VIDEO_ACTION.STARTED);
        break;
      case CH5VideoUtils.VIDEO_ACTION.STOP:
        if (this.elementIsInViewPort) {
          this.resetVideoElement();
          this.ch5BackgroundAction(CH5VideoUtils.VIDEO_ACTION.STOP);
        } else {
          isActionExecuted = false;
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.ERROR:
        if (this.elementIsInViewPort) {
          this._elContainer.style.background = '#000';
          if (nodeList.length > 1) {
            this._elContainer.childNodes[1].remove();
          }
          this._elContainer.style.borderBottom = '1rem solid #CF142B'; //  Red color
        } else {
          isActionExecuted = false;
        }
        break;
      default:
        //  Nothing here as of now
        break;
    }
    this.lastBackGroundRequest = isActionExecuted ? actionType : this.lastBackGroundRequest;
  }

  // This will call the methods in ch5-background component @param videoInfo send the video id, size and position details
  private ch5BackgroundAction(actionStatus: string) {

    const videoInfo: ICh5VideoBackground = {
      action: actionStatus,
      id: this.videoTagId,
      top: this._elContainer.getBoundingClientRect().top,
      left: this._elContainer.getBoundingClientRect().left,
      width: this.sizeObj.width,
      height: this.sizeObj.height,
      image: {} as HTMLImageElement
    };

    // avoid calls before proper initialization
    if (videoInfo.width <= 0 || videoInfo.height <= 0 || videoInfo.id === '') {
      return;
    }

    let idx = this.ch5BackgroundElements.length;
    let bgElement: Ch5Background;
    while (idx > 0) {
      bgElement = this.ch5BackgroundElements[--idx];
      bgElement.videoBGRequest(videoInfo);
    }
  }

  // Clear the previous response data, This prevents execution of blocks if the response is same
  private _clearOldResponseData() {
    this.oldResponseStatus = '';
    this.oldResponseId = 0;
  }

  // Function to add background color to bg if false and clears it if true, @param isShowVideoBehind if true, clears background
  private clearBackgroundOfVideoWrapper(isShowVideoBehind: boolean) {
    this._elContainer.style.background = isShowVideoBehind ? 'transparent' : 'black';
  }


  // Delete any elements other than control panel element
  private resetVideoElement() {
    const nodeList: NodeList = this._elContainer.childNodes;
    this.clearBackgroundOfVideoWrapper(true);
    this._elContainer.style.removeProperty('border-bottom');
    if (nodeList.length > 1) {
      this._elContainer.childNodes[1].remove();
    }
  }

  private _manageControls() {
    // send event on ch5-video click
    if (this.sendEventOnClick.trim().length !== 0 && this.sendEventOnClick !== null && this.sendEventOnClick !== undefined) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(false);
    }

    // If ch5-video is in full screen mode then exit from the full screen
    if (this.isFullScreen) {
      this.removeEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, false);
      this._exitFullScreen();
      return;
    }

    // Check whether the full screen option can be shown
    if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED ||
      this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.RESIZE ||
      this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED) {
      this._fullScreenIcon.classList.remove('hide');
    } else {
      this._fullScreenIcon.classList.add('hide');
    }

    // remove the full screen icon from the ch5-video after 10 seconds
    clearTimeout(this.controlTimer);
    this.controlTimer = setTimeout(() => {
      this._fullScreenIcon.classList.add('hide');
    }, 10000);
  }

  private toggleFullScreen(event: Event) {
    this.info('Ch5Video.enterFullScreen()');
    this.isFullScreen = true;
    //  To avoid swiping on the full screen
    this.addEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, { passive: true });
    this.classList.add('full-screen');
    this._fullScreenIcon.classList.add('hide');
    document.body.classList.add('ch5-video-fullscreen');
    this.isVideoReady = true;
    this.isOrientationChanged = false;
    this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.FULLSCREEN);
    event.stopPropagation(); // to prevent the ch5-video from triggering click event 
  }

  private _exitFullScreen() {
    this.info('Ch5Video.exitFullScreen()');
    this.isVideoReady = true;
    this.isOrientationChanged = false;
    this.isFullScreen = false;
    this.classList.remove('full-screen');
    this.calculation();
    clearTimeout(this.scrollTimer);
    document.body.classList.remove('ch5-video-fullscreen');
    this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.RESIZE);
  }

  private _handleTouchMoveEvent_Fullscreen(ev: Event) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  private handleMultiVideo() {
    this.multiVideoSignalName.url = this.getAttribute('receiveStateURL')?.trim() ? this.getAttribute('receiveStateURL')?.trim() + '' : '';
    this.multiVideoSignalName.userId = this.getAttribute('receiveStateUserId')?.trim() ? this.getAttribute('receiveStateUserId')?.trim() + '' : '';
    this.multiVideoSignalName.password = this.getAttribute('receiveStatePassword')?.trim() ? this.getAttribute('receiveStatePassword')?.trim() + '' : '';
    this.multiVideoSignalName.sourceType = this.getAttribute('receiveStateSourceType')?.trim() ? this.getAttribute('receiveStateSourceType')?.trim() + '' : '';
    this.multiVideoSignalName.snapshotURL = this.getAttribute('receiveStateSnapshotURL')?.trim() ? this.getAttribute('receiveStateSnapshotURL')?.trim() + '' : '';
    this.multiVideoSignalName.snapshotUserId = this.getAttribute('receiveStateSnapshotUserId')?.trim() ? this.getAttribute('receiveStateSnapshotUserId')?.trim() + '' : '';
    this.multiVideoSignalName.snapshotPassword = this.getAttribute('receiveStateSnapshotPassword')?.trim() ? this.getAttribute('receiveStateSnapshotPassword')?.trim() + '' : '';
    this.multiVideoSignalName.snapshotRefreshRate = this.getAttribute('receiveStateSnapshotRefreshRate')?.trim() ? this.getAttribute('receiveStateSnapshotRefreshRate')?.trim() + '' : '';
  }

  private addTouchPollingForVideoMonitor() {
    this.videoTouchHandler = new Ch5VideoTouchManager({
      onTouchStartHandler: this.touchBeginHandler.bind(this),
      onTouchMoveHandler: this.checkIfVideoStoppedMoving.bind(this),
      onTouchEndHandler: this.touchEndHandler.bind(this),
      onTouchCancelHandler: this.touchEndHandler.bind(this),
      pollingDuration: 300,
      componentID: this.videoTagId
    } as TVideoTouchManagerParams);
  }

  // Function to remove touch listeners when polling is stopped
  private removeTouchPollingForVideoMonitor() {
    if (!!this.videoTouchHandler &&
      this.videoTouchHandler !== null &&
      typeof (this.videoTouchHandler) !== 'undefined' &&
      this.videoTouchHandler.destructor) {
      this.videoTouchHandler.destructor();
    }
  }

  // Function to handle touch start event
  private touchBeginHandler() {
    if (!this.firstTime) {
      const boundedRect = this.getBoundingClientRect();
      this.touchCoordinates.startX = boundedRect.left;
      this.touchCoordinates.startY = boundedRect.top;
      this.isTouchInProgress = false;
    }
  }

  // Function to check if the touch swipe has stopped and video finally is a static position
  private checkIfVideoStoppedMoving() {
    if (!this.isTouchInProgress) {
      const boundedRect = this.getBoundingClientRect();
      this.touchCoordinates.endX = boundedRect.left;
      this.touchCoordinates.endY = boundedRect.top;
      if (Math.abs(this.touchCoordinates.startX - this.touchCoordinates.endX) > this.swipeDeltaCheckNum ||
        Math.abs(this.touchCoordinates.startY - this.touchCoordinates.endY) > this.swipeDeltaCheckNum) {
        this.isTouchInProgress = true;
        // Adding stop over here
        this.clearBackgroundOfVideoWrapper(false);
        this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.STOP, '');
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
      }
    }
  }

  // Function to manage video play/stop based on the position on touch end or cancel
  private touchEndHandler() {
    if (this.isTouchInProgress) {
      setTimeout(() => {
        this.clearBackgroundOfVideoWrapper(true);
        this.videoIntersectionObserver();
      }, 100);
    }
    this.isTouchInProgress = false;
  }

  // detecting orientation has been changed
  private _orientationChanged() {
    const timeout = 120;
    return new Promise((resolve: any) => {
      const go = (i: number, height0: number) => {
        window.innerHeight !== height0 || i >= timeout ? resolve() : window.requestAnimationFrame(() => go(i + 1, height0));
      };
      go(0, window.innerHeight);
    });
  }

  // Send the resize request when the device orientation has been changed.
  private _orientationChange() {

    // Check visibililty
    if (this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE) {
      return;
    }

    if (this.orientationCount === 1) {
      this.orientationCount = 0;
      this._fullScreenIcon.classList.add('hide');
      this._orientationChanged().then(() => {
        this.calculation();
        if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED ||
          (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED && this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.RESIZE)) {
          if (this.elementIsInViewPort) {
            this.isOrientationChanged = true; // When the orientation happens inside the view port, isorientationChaged flag will be set to true
            if (this.isFullScreen) {
              this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.FULLSCREEN);
            } else {
              this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.RESIZE);
              // this._updateAppBackgroundStatus();
            }
          }
        } else if ((this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY) &&
          this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
          this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
        }
      });
    }
    this.orientationCount++;
  }

  private validateAndAttachSnapshot() {
    if (this.snapshotURL.trim() !== '' && this.url.trim() !== '') {
      this.snapshotImage.url = this.snapshotURL;
      this.snapshotImage.userId = this.snapshotUserId;
      this.snapshotImage.password = this.snapshotPassword;
      this.snapshotImage.refreshRate = this.snapshotRefreshRate;
      if (this.lastResponseStatus !== CH5VideoUtils.VIDEO_ACTION.STARTED) {
        this.snapshotImage.startLoadingSnapshot();
        if (this.snapshotImage.getImage().isConnected === false) {
          this._elContainer.appendChild(this.snapshotImage.getImage());
        }
      }
    }
    if (this.url === '' && this.lastBackGroundRequest !== CH5VideoUtils.VIDEO_ACTION.NOURL) {
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.NOURL, '');
    } else if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR) {
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, '');
    }
  }
  // #endregion

}

Ch5Video.registerCustomElement();
Ch5Video.registerSignalAttributeTypes();
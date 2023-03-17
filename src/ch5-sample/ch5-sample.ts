import { Ch5Common } from "../ch5-common/ch5-common";
import { subscribeState } from "../ch5-core";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SampleAspectRatio, TCh5SampleSourceType, TCh5SampleSize, } from './interfaces/t-ch5-sample';
import { ICh5SampleAttributes } from './interfaces/i-ch5-sample-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { CH5VideoUtils } from "./ch5-video-utils";
import { ICh5VideoPublishEvent, TDimension, TPosDimension, TSnapShotSignalName, TVideoResponse } from "./interfaces/interfaces-helper";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { ICh5VideoBackground } from "../ch5-video/interfaces/types/t-ch5-video-publish-event-request";
import { Ch5Background } from "../ch5-background";
import { Ch5VideoSnapshot } from "./ch5-video-snapshot";

export class Ch5Sample extends Ch5Common implements ICh5SampleAttributes {

  // #region Variables

  public static readonly ASPECT_RATIO: TCh5SampleAspectRatio[] = ['16:9', '4:3'];
  public static readonly SOURCE_TYPE: TCh5SampleSourceType[] = ['Network', 'HDMI', 'DM'];
  public static readonly SIZE: TCh5SampleSize[] = ['regular', 'x-small', 'small', 'large', 'x-large', 'xx-large'];
  public static readonly COMPONENT_DATA: any = {
    ASPECT_RATIO: {
      default: Ch5Sample.ASPECT_RATIO[0],
      values: Ch5Sample.ASPECT_RATIO,
      key: 'aspectRatio',
      attribute: 'aspectRatio',
      classListPrefix: '--aspect-ratio-'
    },
    SIZE: {
      default: Ch5Sample.SIZE[0],
      values: Ch5Sample.SIZE,
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
      default: Ch5Sample.ASPECT_RATIO[0],
      enumeratedValues: Ch5Sample.ASPECT_RATIO,
      name: "aspectRatio",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Sample.ASPECT_RATIO[0],
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
      default: Ch5Sample.SOURCE_TYPE[0],
      enumeratedValues: Ch5Sample.SOURCE_TYPE,
      name: "sourceType",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateSourceType",
      type: "enum",
      valueOnAttributeEmpty: Ch5Sample.SOURCE_TYPE[0],
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
      default: Ch5Sample.SIZE[0],
      enumeratedValues: Ch5Sample.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Sample.SIZE[0],
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
      name: "receivestatevideocount",
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

  public static readonly ELEMENT_NAME = 'ch5-sample';

  public primaryCssClass = 'ch5-sample';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _vidControlPanel: HTMLElement = {} as HTMLElement;
  private _controlFullScreen: HTMLElement = {} as HTMLElement;
  private _fullScreenOverlay: HTMLElement = {} as HTMLElement;


  private responseObj: TVideoResponse = {} as TVideoResponse;
  private fullScreenObj: TPosDimension = {} as TPosDimension;
  private sizeObj: TDimension = { width: 0, height: 0 };
  private ch5BackgroundElements: HTMLCollectionOf<Ch5Background> = document.getElementsByTagName('ch5-background') as HTMLCollectionOf<Ch5Background>;

  private readonly INTERSECTION_RATIO_VALUE: number = 0.98;
  private playValue: boolean = true;
  private lastRequestStatus: string = '';
  private isVideoReady: boolean = false;
  private lastResponseStatus: string = '';
  private videoTop: number = -1; //  X-Axis Position of the CH5-Video
  private videoLeft: number = -1; //  Y-Axis Position of the CH5-Video
  private videoTagId: string = ''; //  to pass video bg object json
  private oldResponseStatus: string = '';
  private oldResponseId: number = 0;
  private requestID: number = 0; //  to cross check req id and resp id
  private isOrientationChanged: boolean = false;
  private isFullScreen: boolean = false;
  private isExitFullscreen: boolean = false;
  private fromExitFullScreen: boolean = false;
  private isAlphaBlend: boolean = true;
  private isSwipeDebounce: any;
  private position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
  private _wasAppBackGrounded: boolean = false;
  private isVideoPublished = false;
  private controlTimer: any;
  private scrollTimer: any;
  private snapshotMap = new Map();
  private lastBackGroundRequest: string = '';
  private exitSnapsShotTimer: any;

  public ch5UId: number = 0; //  CH5 Unique ID

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

  public set aspectRatio(value: TCh5SampleAspectRatio) {
    this._ch5Properties.set<TCh5SampleAspectRatio>("aspectRatio", value, () => {
      this.handleAspectRatio();
    });
  }
  public get aspectRatio(): TCh5SampleAspectRatio {
    return this._ch5Properties.get<TCh5SampleAspectRatio>("aspectRatio");
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

  public set sourceType(value: TCh5SampleSourceType) {
    this._ch5Properties.set<TCh5SampleSourceType>("sourceType", value, () => {
      this.handleReceiveStateURL();
    });
  }
  public get sourceType(): TCh5SampleSourceType {
    return this._ch5Properties.get<TCh5SampleSourceType>("sourceType");
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
      this.handleSnapshotURL();
    });
  }
  public get snapshotURL(): string {
    return this._ch5Properties.get<string>("snapshotURL");
  }

  public set snapshotRefreshRate(value: number) {
    this._ch5Properties.set<number>("snapshotRefreshRate", value, () => {
      this.handlesnapshotRefreshRate();
    });
  }
  public get snapshotRefreshRate(): number {
    return this._ch5Properties.get<number>("snapshotRefreshRate");
  }

  public set snapshotUserId(value: string) {
    this._ch5Properties.set<string>("snapshotUserId", value, () => {
      this.handleSnapshotUserId();
    });
  }
  public get snapshotUserId(): string {
    return this._ch5Properties.get<string>("snapshotUserId");
  }

  public set snapshotPassword(value: string) {
    this._ch5Properties.set<string>("snapshotPassword", value, () => {
      this.handleSnapshotPassword();
    });
  }
  public get snapshotPassword(): string {
    return this._ch5Properties.get<string>("snapshotPassword");
  }

  public set size(value: TCh5SampleSize) {
    this._ch5Properties.set<TCh5SampleSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5SampleSize {
    return this._ch5Properties.get<TCh5SampleSize>("size");
  }

  public set zindex(value: number) {
    this._ch5Properties.set<number>("zindex", value, () => {
      this.handleZindex();
    });
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
      this.handleReceiveStateSelect();
    });
  }
  public get receiveStateSelect(): string {
    return this._ch5Properties.get<string>('receiveStateSelect');
  }

  public set receiveStateURL(value: string) {
    this._ch5Properties.set("receiveStateURL", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("url", newValue, () => {
        this.handleReceiveStateURL();
      });
    });
  }
  public get receiveStateURL(): string {
    return this._ch5Properties.get<string>('receiveStateURL');
  }

  public set receiveStateSourceType(value: string) {
    this._ch5Properties.set("receiveStateSourceType", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("sourceType", newValue, () => {
        this.handleReceiveStateURL();
      });
    });
  }
  public get receiveStateSourceType(): string {
    return this._ch5Properties.get<string>('receiveStateSourceType');
  }

  public set receiveStateUserId(value: string) {
    this._ch5Properties.set("receiveStateUserId", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("userId", newValue, () => {
        this.handleReceiveStateURL();
      });
    });
  }
  public get receiveStateUserId(): string {
    return this._ch5Properties.get<string>('receiveStateUserId');
  }

  public set receiveStatePassword(value: string) {
    this._ch5Properties.set("receiveStatePassword", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("password", newValue, () => {
        this.handleReceiveStateURL();
      });
    });
  }
  public get receiveStatePassword(): string {
    return this._ch5Properties.get<string>('receiveStatePassword');
  }

  public set receiveStateSnapshotURL(value: string) {
    this._ch5Properties.set("receiveStateSnapshotURL", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("snapshotURL", newValue, () => {
        this.handleReceiveStateSnapshotURL();
      });
    });
  }
  public get receiveStateSnapshotURL(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotURL');
  }

  public set receiveStateSnapshotRefreshRate(value: string) {
    this._ch5Properties.set("receiveStateSnapshotRefreshRate", value, null, (newValue: number) => {
      this.handleReceiveStateSnapshotURL();
    });
  }
  public get receiveStateSnapshotRefreshRate(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotRefreshRate');
  }

  public set receiveStateSnapshotUserId(value: string) {
    this._ch5Properties.set("receiveStateSnapshotUserId", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("snapshotUserId", newValue, () => {
        this.handleReceiveStateSnapshotURL();
      });
    });
  }
  public get receiveStateSnapshotUserId(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotUserId');
  }

  public set receiveStateSnapshotPassword(value: string) {
    this._ch5Properties.set("receiveStateSnapshotPassword", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("snapshotPassword", newValue, () => {
        this.handleReceiveStateSnapshotURL();
      });
    });
  }
  public get receiveStateSnapshotPassword(): string {
    return this._ch5Properties.get<string>('receiveStateSnapshotPassword');
  }

  public set receivestatevideocount(value: string) {
    this._ch5Properties.set("receivestatevideocount", value, null, (newValue: number) => {
      this.handleReceivestatevideocount();
    });
  }
  public get receivestatevideocount(): string {
    return this._ch5Properties.get<string>('receivestatevideocount');
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
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Sample.ELEMENT_NAME, Ch5Sample.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5Sample.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5Sample.ELEMENT_NAME, Ch5Sample);
    }
  }

  // #endregion

  // #region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ['disabled', 'receiveStateEnable'];
    this.logger.start('constructor()', Ch5Sample.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5Sample.COMPONENT_PROPERTIES);
    this.updateCssClass();
    subscribeState('o', 'Csig.video.response', this._videoResponse.bind(this), this._errorResponse.bind(this));
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5Sample.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Sample.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5Sample.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-sample attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5Sample.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5Sample component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5Sample.ELEMENT_NAME);
    //  WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5Video);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-sample');
      this.appendChild(this._elContainer);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-sample').then(() => {
      this._initializeVideo();
      //  if (!this.indexId) {
      this.getAllSnapShotData(1);
      this.loadAllSnapshots(); // start loading snapshots
      //}
      this.componentLoadedEvent(Ch5Sample.ELEMENT_NAME, this.id);
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
    this.snapshotMap.get(0)?.stopLoadingSnapShot();// TODO
    this.logger.stop();
  }

  // #endregion

  // #region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');

    this.classList.add(this.primaryCssClass);
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.display = "flex";
    this.style.justifyContent = "center";
    this.style.alignItems = "center";
    //  Create main control panel
    this._vidControlPanel = document.createElement("div");
    this._vidControlPanel.classList.add("control-panel");
    //  Create div for the right side of the control panel
    this._controlFullScreen = document.createElement("a");
    this._controlFullScreen.classList.add("control");
    this._controlFullScreen.innerHTML = CH5VideoUtils.SVG_ICONS.FULLSCREEN_ICON;
    this._vidControlPanel.appendChild(this._controlFullScreen);
    this._vidControlPanel.style.width = '100%';
    this._vidControlPanel.style.left = '-5px';
    this._vidControlPanel.style.top = '5px';

    this._elContainer.classList.add('video-wrapper');
    this._elContainer.style.background = '#000';
    this.appendChild(this._elContainer);
    this._elContainer.appendChild(this._vidControlPanel);
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5Sample.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Sample.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5Sample.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5Sample.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this.addEventListener('click', this._manageControls.bind(this));
    this._controlFullScreen.addEventListener('click', this.toggleFullScreen.bind(this));
    this._vidControlPanel.addEventListener('click', this._videoCP.bind(this));
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this.removeEventListener('click', this._manageControls.bind(this));
    this._controlFullScreen.removeEventListener('click', this.toggleFullScreen.bind(this));
    this._vidControlPanel.addEventListener('click', this._videoCP.bind(this));

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

  /**
   * Initializes the elements of ch5-video
   */
  private _initializeVideo() {
    const uID = this.getCrId().split('cr-id-')[1];
    this.ch5UId = parseInt(uID[1], 0);
    this.videoTagId = this.getCrId();
    this.setAttribute("id", this.getCrId());
    //  A dummy call to make the video to play on first project load
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(CH5VideoUtils.VIDEO_ACTION.STOP, this.ch5UId));
  }


  private handleIndexId() {
    //  Enter your Code here
  }
  private handleAspectRatio() {
    Array.from(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);
  }
  private handleStretch() {
    //  Enter your Code here
  }

  private handleSnapshotURL() {
    //  Enter your Code here
  }
  private handlesnapshotRefreshRate() {
    //  Enter your Code here
  }
  private handleSnapshotUserId() {
    //  Enter your Code here
  }
  private handleSnapshotPassword() {
    //  Enter your Code here
  }
  private handleSize() {
    Array.from(Ch5Sample.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5Sample.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }
  private handleZindex() {
    //  Enter your Code here
  }
  private handleReceiveStatePlay(value: boolean) {
    if (value === false) {
      return this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
    }
    this.beforeVideoDisplay();
    this.handleReceiveStateURL();
  }
  private handleReceiveStateSelect() {
    //  Enter your Code here
  }
  private handleReceiveStateURL() {
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
      this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.isVideoReady = false;
      this.isExitFullscreen = false;
      if (this.url === '') {
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        this.beforeVideoDisplay();
      } else {
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
      }
    }
  }

  private handleReceiveStateSnapshotURL() {
    this.getAllSnapShotData(1);
    this.loadAllSnapshots();
  }

  private handleReceivestatevideocount() {
    //  Enter your Code here
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    /*  this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);
     this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.SIZE.classListPrefix + this.size); */
    this._elContainer.classList.add(this.primaryCssClass);
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  /**
   * When the video element is more than 100% visible the video should start and
   * when the visibility is less than 100% the video should stop playing.
   */
  public videoIntersectionObserver() {
    this.info("videoIntersectionObserver#intersectionRatio -> " + this.elementIntersectionEntry.intersectionRatio);
    this.lastBackGroundRequest = "";
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && this.playValue) {
      //  this.loadAllSnapshots();
      this._onRatioAboveLimitToRenderVideo();
    } else {
      this._OnVideoAspectRatioConditionNotMet();
    }
    //  Removes or Adds document level touch handlers if in view
    /* if (this.elementIntersectionEntry.intersectionRatio > 0.1 && this.playValue) {
      this.addTouchPollingForVideoMonitor();
    } else {
      this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
      this.removeTouchPollingForVideoMonitor();
    } */
  }

  /**
   * Function to render video if it is under the visible range | supposed to be shown
   * this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE
   */
  private _onRatioAboveLimitToRenderVideo() {
    /* this.info("Task: Under ratio, render video - ",
      this.lastRequestStatus, this.isFullScreen, this.isExitFullscreen,
      this.fromExitFullScreen, this.isOrientationChanged); */
    clearTimeout(this.isSwipeDebounce);
    this.isSwipeDebounce = setTimeout(() => {
      this.calculation();

      // This condition will avoid drawing snapshot during orientation change in iOS devices
      if (this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.START && this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.RESIZE) {
        this.beforeVideoDisplay();
      }

      let isPublished = false;
      if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY && this.isOrientationChanged ||
        this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
        this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.isVideoReady = false;
        isPublished = true;
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
      }
      if (!this.isFullScreen && !this.isExitFullscreen && !this.isOrientationChanged &&
        this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.FULLSCREEN && !this.fromExitFullScreen) {
        this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
        this.isVideoReady = false;
        if (!isPublished) {
          this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
        }
      }
    }, 100); //  reducing this will create a cut at wrong place
  }

  /**
   * Function to render video if it is lesser than the necessary visible range | supposed to be hidden
   * this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE
   */
  private _OnVideoAspectRatioConditionNotMet() {
    /*
     * Return if the video is playing in fullscreen or
     * check firstTime flag to prevent execution of this from other pages
     * when the project starts
     */
    if (this.isFullScreen) {
      return;
    }

    //  On exiting fullscreen and if the user swipes/leave the video page send the CH5VideoUtils.VIDEO_ACTION.STOP request
    if (this.isExitFullscreen && this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED && !this.elementIsInViewPort) {
      this.info(">>> Stopping Video3");
      this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
    }
  }

  /**
   * Calculate the size and position of the canvas
   */
  private calculation(): void {
    if (!this.isFullScreen) {
      const rect = this.getBoundingClientRect();
      this.sizeObj = { width: 0, height: 0 };
      // this.sizeObj = CH5VideoUtils.getAspectRatioForVideo(this.aspectRatio, 'large');
      if (!this.stretch) {
        //  Calculation for fixed display size like small, medium large
        this.sizeObj = CH5VideoUtils.getAspectRatioForVideo(this.aspectRatio, this.size);
      } else if (this.stretch) {
        this.sizeObj = CH5VideoUtils.getDisplayWxH(this.aspectRatio, this.clientWidth, this.clientHeight);
      }
      this._getSizeAndPositionObj(this.sizeObj, this.clientWidth, this.clientHeight);
      this._vidControlPanel.style.left = -5 + "px";
      this._vidControlPanel.style.top = (this.position.yPos + 5) + "px";
      this.videoLeft = rect.left + this.position.xPos;
      this.videoTop = rect.top + this.position.yPos;
      this._elContainer.style.width = this.sizeObj.width + "px";
      this._elContainer.style.height = this.sizeObj.height + "px";
    }
  }

  private videoStopObjJSON(actionType: string, uId: number): ICh5VideoPublishEvent {
    this.lastRequestStatus = actionType;
    const retObj: any = {
      "action": actionType,
      "id": uId
    };
    this.info(JSON.stringify(retObj));
    return retObj;
  }

  /**
   * Create the Video JSON object to start the video
   * @param actionType
   * @param xPosition
   * @param yPosition
   * @param width
   * @param height
   * @param zindex
   */
  public videoStartObjJSON(actionType: string, logInfo: string): ICh5VideoPublishEvent {
    const d = new Date();
    const startTime: number = d.getMilliseconds();
    const endTime: number = d.getMilliseconds() + 2000;

    let xPosition: number = this.videoLeft;
    let yPosition: number = this.videoTop;
    let width: number = this.sizeObj.width;
    let height: number = this.sizeObj.height;

    if (actionType === CH5VideoUtils.VIDEO_ACTION.FULLSCREEN) {
      actionType = CH5VideoUtils.VIDEO_ACTION.RESIZE;
      this.fullScreenObj = CH5VideoUtils.getFullScreenDimensions(this.aspectRatio, window.innerWidth, window.innerHeight);
      xPosition = this.fullScreenObj.posX;
      yPosition = this.fullScreenObj.posY;
      width = this.fullScreenObj.width;
      height = this.fullScreenObj.height;
    }

    this.lastRequestStatus = actionType;
    //  always clears the background of the video tag to display video behind it
    this.clearBackgroundOfVideoWrapper(true);

    //  any negative values in location object will throw backend error
    //  sometimes decimal values are returned by position related functions
    //  Math.ceil is used to avoid this.
    const retObj = {
      "action": actionType,
      "id": this.ch5UId,
      "credentials": {
        "userid": this.userId,
        "password": this.password
      },
      "source": {
        "type": this.sourceType,
        "url": this.url
      },
      "location": {
        "top": Math.ceil(yPosition),
        "left": Math.ceil(xPosition),
        "width": Math.ceil(width),
        "height": Math.ceil(height),
        "z": this.zindex
      },
      "alphablend": this.isAlphaBlend, //  optional, default true, false indicates video displayed above the HTML
      "starttime": startTime, //  milliseconds since 1-1-1970 UTC
      "endtime": endTime, //  2000 msecs later
      "timing": "linear" //  only linear supported initially
    };

    this.info(logInfo + JSON.stringify(retObj));
    console.log(logInfo + JSON.stringify(retObj));
    return retObj;
  }

  /**
   * Publish the video start request
   * @param actionType
   */
  private _videoStartRequest(actionType: string) {
    //  Empty URL scenario
    if (this.url.trim() === '') {
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.NOURL, 'videoStartRequest');
      return;
    }

    //  Invalid URL scenario, validation error
    if (!CH5VideoUtils.validateVideoUrl(this.url)) {
      this.info("Invalid RTSP url -> " + this.url);
      this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.ERROR;
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, 'videoStartRequest');
      return;
    }

    //  Make a cut if snapshot not found
    this.fromExitFullScreen = false;
    this.isVideoReady = true;
    // this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.START, performance.now(), 'timerStart');
    publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'videoStartRequest'));
    this.requestID = this.ch5UId;
  }

  /**
   * Publish the video stop request
   * @param actionType
   */
  private _videoStopRequest(actionType: string) {
    //  Stop the video immediately
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId));
    // this.stopLoadingSnapshots();
    this.fromExitFullScreen = false;
    // this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.STOP, performance.now(), 'timerStart');
    this.isVideoReady = false;
    // this._sendEvent(this.sendEventState, 3, 'number');
  }

  /**
   * Send event to the backend based on the action Type
   * @param actionType Video request type
   */
  private _publishVideoEvent(actionType: string) {
    /* this.info('*** publishVideoEvent: actionType -> ' + actionType + '; lastRequestStatus -> ' + this.lastRequestStatus
      + '; lastResponseStatus -> ' + this.lastResponseStatus + '; CH5UID: ' + this.ch5UId); */
    this.responseObj = {} as TVideoResponse;
    this.isAlphaBlend = !this.isFullScreen;
    //  reset old response, required to check whether the second response is same.
    this._clearOldResponseData();
    switch (actionType) {
      case CH5VideoUtils.VIDEO_ACTION.START:
        // this.info("*** VIDEO_ACTION.START ", this.playValue, this.receiveStatePlay, this.fromReceiveStatePlay);
        this.isVideoPublished = true;
        if (!this.isVideoReady && this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.START && this.url &&
          (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
            this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR || this._wasAppBackGrounded) && !this.isExitFullscreen) {
          this.info("*** videoStartRequest");
          this._videoStartRequest(actionType);
        } else {
          // this.info("*** this.sendEvent");
          // this._sendEvent(this.sendEventState, 0, 'number');
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.STOP:
        this.info("VIDEO_ACTION.STOP - this.playValue", this.playValue);
        this.info("*** MyCase STOPPED - this.isVideoPublished", this.isVideoPublished);
        if (!this.isVideoPublished) { //  this flag avoids stop command since no video has started
          return;
        }
        this.info("*** MyCase STOPPED - this.lastRequestStatus", this.lastRequestStatus);
        this.info("*** MyCase STOPPED - this.lastResponseStatus", this.lastResponseStatus);
        this.info("*** MyCase STOPPED - this.elementIsInViewPort", this.elementIsInViewPort);
        this.info("*** MyCase STOPPED - this.isExitFullscreen", this.isExitFullscreen);
        if (this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.STOP && (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
          this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED || !this.elementIsInViewPort ||
          ((this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR) &&
            !this.isExitFullscreen))) {
          this.info("*** videoStopRequest");
          this._videoStopRequest(actionType);
        }
        this.info("*** MyCase STOPPED - ENDS");
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZE:
        this.info("*** MyCase RESIZE");
        //  If the video has already stopped then there is no need to resize.
        if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
          this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.STOP) {
          return;
        }
        this.fromExitFullScreen = false;
        this.calculation();
        this.beforeVideoDisplay();
        // this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.RESIZE, performance.now(), 'timerStart');
        publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
        this.isVideoReady = false;
        break;
      case CH5VideoUtils.VIDEO_ACTION.FULLSCREEN:
        if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED) {
          this.fromExitFullScreen = false;
          publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
          this.isVideoReady = false;
        }
        break;
      default:
    }
  }

  private _videoResponse(response: TVideoResponse) {
    //  Process the backend response
    if (typeof response === 'string') {
      this.responseObj = JSON.parse(response);
    } else {
      this.responseObj = response;
    }
    console.log("_videoResponse-->", JSON.stringify(this.responseObj));
    this.info(JSON.stringify(this.responseObj));

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

    this.info("Video Response : " + JSON.stringify(this.responseObj));

    this.oldResponseStatus = this.responseObj.status;
    this.oldResponseId = this.responseObj.id;
    const responseStatCode: number = this.responseObj.statusCode || 0;
    const responseStatus = this.responseObj.status.toLowerCase();
    this.info('Response Status: ' + responseStatus.toLowerCase());
    console.log('Response Status: ' + responseStatus.toLowerCase());
    switch (responseStatus.toLowerCase()) {
      case CH5VideoUtils.VIDEO_ACTION.STOPPED:
        //  When the user continously clicks on play and stop without a gap, started
        const vidResponses = ['connecting', 'buffering', 'retrying', 'resizing', 'error'];
        if (vidResponses.indexOf(this.lastResponseStatus) !== -1) {
          this.info('Stop Request when continous play and stop clicks');
          this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
          this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.STARTED;
          this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        }
        this.isVideoReady = false;
        this.isOrientationChanged = false;
        this.isExitFullscreen = false;
        break;
      case 'connecting':
        this.isVideoReady = false;
        /* if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          this._sendEvent(this.sendEventState, 4, 'number');
        } */
        break;
      case 'buffering':
        this.isVideoReady = false;
        /* if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          this._sendEvent(this.sendEventState, 5, 'number');
        } */
        break;
      case CH5VideoUtils.VIDEO_ACTION.STARTED:
        this.isVideoReady = true;
        this.isOrientationChanged = false;
        this.isExitFullscreen = false;
        this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.STARTED, 'videoResponse');

        /*
         * If CH5VideoUtils.VIDEO_ACTION.STARTED response is delayed Check visibility.
         * If the visibility is false send a stop request to stop the video
         */
        if (this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE) {
          this.info("Video not visible (" + this.elementIntersectionEntry.intersectionRatio + ").");
          this.info("Received CH5VideoUtils.VIDEO_ACTION.STARTED delayed response from VSM. Sending CH5VideoUtils.VIDEO_ACTION.STOP request from UI.");
          this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        }
        break;
      case 'retrying':
        this.isVideoReady = false;
        /* if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          this._sendEvent(this.sendEventState, 6, 'number');
        }
        this.retryCount = this.retryCount + 1;
        this._sendEvent(this.sendEventRetryCount, this.retryCount, 'number'); */
        break;
      case 'resizing':
        this.isVideoReady = false;
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZED:
        //  this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.RESIZE, performance.now(), 'timerEnd');
        this.isOrientationChanged = false;
        if (this.isExitFullscreen) {
          this.isExitFullscreen = false;
          this.fromExitFullScreen = true;
        }
        //  this.isPositionChanged = false;
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
        /* if (this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.START) {
          this._sendEvent(this.sendEventState, 7, 'number');
        }
        if (this.responseObj.statusCode) {
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
      case CH5VideoUtils.VIDEO_ACTION.MARK:
        this.clearBackgroundOfVideoWrapper(false);
        if (nodeList.length > 1) {
          this._elContainer.childNodes[1].remove();
        }
        this._elContainer.style.borderBottom = '1rem solid #FFBF00'; //  Amber color
        break;
      case CH5VideoUtils.VIDEO_ACTION.REFILL:
        if (this.lastBackGroundRequest !== actionType) {
          this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.REFILL));
        } else {
          isActionExecuted = false;
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZE:
        this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.RESIZE));
        break;
      case CH5VideoUtils.VIDEO_ACTION.STARTED:
        clearTimeout(this.exitSnapsShotTimer); //  clear timer to stop refreshing image
        this.resetVideoElement();
        //this.switchLoadingSnapshot();
        const sData: Ch5VideoSnapshot = this.snapshotMap.get(0); // TO DO Multiple video
        sData.stopLoadingSnapShot();
        // 	this.firstTime = false;
        this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.STARTED));
        break;
      case CH5VideoUtils.VIDEO_ACTION.STOP:
        clearTimeout(this.exitSnapsShotTimer); //  clear timer to stop refreshing image
        if (this.elementIsInViewPort) {
          this.resetVideoElement();
          this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.STOP));
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

  /**
   * Function to calculate the position based on the requested dimensions
   * @param sWidth width of the requested element
   * @param sHeight height of the requested element
   * @returns this.position
   */
  private _getSizeAndPositionObj(sizeObj: TDimension, sWidth: number, sHeight: number) {
    if (sizeObj.width < sWidth) {
      this.position = CH5VideoUtils.calculatePillarBoxPadding(sWidth, sizeObj.width);
    } else if (sizeObj.height < sHeight) {
      this.position = CH5VideoUtils.calculateLetterBoxPadding(sHeight, sizeObj.height);
    }
    return this.position;
  }

  /**
   * This will call the methods in ch5-background component
   * @param videoInfo send the video id, size and position details
   */
  private ch5BackgroundAction(videoInfo: ICh5VideoBackground) {
    //  avoid calls before proper initialization
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

  /**
   * Clear the previous response data
   * This prevents execution of blocks if the response is same
   */
  private _clearOldResponseData() {
    this.oldResponseStatus = '';
    this.oldResponseId = 0;
  }

  /**
   * Function to add background color to bg if false and clears it if true
   * @param isShowVideoBehind if true, clears background
   */
  private clearBackgroundOfVideoWrapper(isShowVideoBehind: boolean) {
    this._elContainer.style.background = isShowVideoBehind ? 'transparent' : 'black';
  }

  /**
   * Create the Video JSON object to send the video for background
   * @param actionStatus
   * @param xPosition
   * @param yPosition
   * @param width
   * @param height
   */
  private videoBGObjJSON(actionStatus: string): ICh5VideoBackground {
    const retObj: ICh5VideoBackground = {
      "action": actionStatus,
      "id": this.videoTagId,
      "top": this.videoTop,
      "left": this.videoLeft,
      "width": this.sizeObj.width,
      "height": this.sizeObj.height,
      "image": {} as HTMLImageElement
    };

    /* if (actionStatus === this.VIDEO_ACTION.Snapshot) {
      const sData: Ch5VideoSnapshot = this.snapshotMap.get(this.receivedStateSelect);
      retObj.image = sData.getSnapshot();
    } */
    console.log('videoBGObjJSON-->', JSON.stringify(retObj));
    return retObj;
  }

  /**
   * Delete any elements other than control panel element
   */
  private resetVideoElement() {
    const nodeList: NodeList = this._elContainer.childNodes;
    this.clearBackgroundOfVideoWrapper(true);
    this._elContainer.style.removeProperty('border-bottom');
    if (nodeList.length > 1) {
      this._elContainer.childNodes[1].remove();
    }
  }

  private _manageControls() {
    if (this.isFullScreen) {
      this.removeEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, false);
      this._exitFullScreen();
      return;
    }

    if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STARTED ||
      this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.RESIZE ||
      this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.RESIZED) {
      this._showFullScreenIcon();
    } else {
      this._hideFullScreenIcon();
    }
    if (this.sendEventOnClick.trim().length !== 0 && this.sendEventOnClick !== null && this.sendEventOnClick !== undefined) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(false);
    }
    this._autoHideControls();
  }

  private _showFullScreenIcon() {
    if (!!this._vidControlPanel && !!this._vidControlPanel.classList) {
      this._vidControlPanel.classList.add('show-control');
    }
  }

  private _hideFullScreenIcon() {
    if (!!this._vidControlPanel && !!this._vidControlPanel.classList) {
      this._vidControlPanel.classList.remove('show-control');
    }
  }

  private _autoHideControls() {
    clearTimeout(this.controlTimer);
    this.controlTimer = setTimeout(() => {
      this._hideFullScreenIcon();
    }, 10000);
  }


  private toggleFullScreen() {
    if (this.isFullScreen) {
      this._exitFullScreen();
    } else {
      this.info('Ch5Video.enterFullScreen()');
      this.isFullScreen = true;
      //  To avoid swiping on the full screen
      this.addEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, { passive: true });
      this._hideFullScreenIcon();

      if (!!this._fullScreenOverlay && !!this._fullScreenOverlay.classList) {
        this._fullScreenOverlay.classList.add(this.primaryCssClass + '--overlay');
      }
      this._vidControlPanel.classList.add("fullScreen");
      this._controlFullScreen.innerHTML = CH5VideoUtils.SVG_ICONS.EXIT_FULLSCREEN_ICON;
      this.classList.add('fullScreenStyle');
      document.body.classList.add('ch5-video-fullscreen');
      this.style.visibility = 'visible';
      this.isVideoReady = true;
      this.isOrientationChanged = false;
      this.style.width = "100%";
      this.style.height = "100%";
      this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.FULLSCREEN);
    }
  }

  private _exitFullScreen() {
    this.info('Ch5Video.exitFullScreen()');
    this._vidControlPanel.classList.remove("fullScreen");
    //  When the Orientation change completes
    if (!!this._fullScreenOverlay && !!this._fullScreenOverlay.classList) {
      this._fullScreenOverlay.classList.remove(this.primaryCssClass + '--overlay');
    }

    this._controlFullScreen.innerHTML = '';
    this._controlFullScreen.innerHTML = CH5VideoUtils.SVG_ICONS.FULLSCREEN_ICON;
    //  this.zIndex = "0";
    this.isVideoReady = true;
    this.isOrientationChanged = false;
    this.isExitFullscreen = true;

    this.isFullScreen = false;
    this._vidControlPanel.classList.remove("fullScreen");
    if (!!this._fullScreenOverlay && !!this._fullScreenOverlay.classList) {
      this._fullScreenOverlay.classList.remove(this.primaryCssClass + '--overlay');
    }
    this.classList.remove('fullScreenStyle');
    this._autoHideControls();
    this.style.visibility = '';
    this.calculation();
    clearTimeout(this.scrollTimer);
    document.body.classList.remove('ch5-video-fullscreen');
    this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.RESIZE);
  }

  private _handleTouchMoveEvent_Fullscreen(ev: Event) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  private _videoCP(event: Event) { // To avoid unwanted events on touch in the full screen mode
    event.stopPropagation();
  }

  /**
   * Draw the snapshot on the background
   */
  private beforeVideoDisplay() {
    // return if not visible, exit timer
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE &&
      this.lastResponseStatus !== CH5VideoUtils.VIDEO_ACTION.STARTED) {
      const nodeList: NodeList = this._elContainer.childNodes;
      if (this.snapshotMap.size > 0) {
        const sData: Ch5VideoSnapshot = this.snapshotMap.get(0);
        if (sData.getSnapShotStatus()) {
          if (nodeList.length > 1) {
            this._elContainer.childNodes[1].remove(); // remove the image tag
            this._elContainer.appendChild(sData.getSnapShot());
          } else {
            this._elContainer.appendChild(sData.getSnapShot());
          }
          this._elContainer.style.removeProperty('border-bottom'); // remove the border if any
          //	this._sendEvent(this.sendEventSnapShotStatus, this.receivedStateSelect, 'number');
        } else {
          this._elContainer.style.background = '#000';
          if (this.lastBackGroundRequest !== CH5VideoUtils.VIDEO_ACTION.MARK
            && this.url !== '' && this.lastResponseStatus !== CH5VideoUtils.VIDEO_ACTION.ERROR && this.playValue) {
            this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.MARK, 'drawSnapShot#3');
          } else {
            if (this.url === '' && this.lastBackGroundRequest !== CH5VideoUtils.VIDEO_ACTION.NOURL) {
              this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.NOURL, 'drawSnapShot#2');
            } else if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR) {
              this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, 'drawSnapShot#2');
            }
            clearTimeout(this.exitSnapsShotTimer); // stop the timer
            return; // lets break here
          }
        }
      }
      clearTimeout(this.exitSnapsShotTimer);
      const refreshRate: number = this.snapshotRefreshRate;
      this.exitSnapsShotTimer = setTimeout(() => {
        this.info("Snapshot refreshed with new image");
        this.beforeVideoDisplay();
      }, 1000 * refreshRate);
    } else {
      console.log("drawSnapShot#9");
      clearTimeout(this.exitSnapsShotTimer);
      return;
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
      const snapshotObject: TSnapShotSignalName = {
        "index": 0,
        "videoTagId": this.videoTagId,
        "snapshotURL": "",
        "snapshotRefreshRate": 0,
        "snapshotUser": "",
        "snapshotPass": "",
        "isMultipleVideo": this.indexId === '0' ? false : true
      };
      snapshotObject.index = idx;

      /* 	if (this.indexId !== '0') {
          snapShotObject.snapShotUrl = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshoturl', this.receiveStateSnapShotURL, idx, this.indexId as string));
          snapShotObject.snapShotUser = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestateuserid', this.receiveStateSnapShotUserId, idx, this.indexId as string));
          snapShotObject.snapShotPass = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotpassword', this.receiveStateSnapShotPassword, idx, this.indexId as string));
          snapShotObject.snapShotRefreshRate = String(Ch5VideoSubscription.getNewSignalName(this, 'receivestatesnapshotrefreshrate', this.receiveStateSnapShotRefreshRate, idx, this.indexId as string));
        } else { */
      snapshotObject.snapshotURL = this.snapshotURL;
      snapshotObject.snapshotUser = this.snapshotUserId;
      snapshotObject.snapshotPass = this.snapshotPassword;
      snapshotObject.snapshotRefreshRate = this.snapshotRefreshRate;
      //}
      this.snapshotMap.set(idx, new Ch5VideoSnapshot(snapshotObject));
    }
  }

  /**
   * Stop loading snapshot when the camera is about to play video
   * @param activeIndex
   */
  private loadAllSnapshots(): void {
    if (this.snapshotMap.size > 0) {
      for (let idx = 0; idx < 1; idx++) {
        const sData: Ch5VideoSnapshot = this.snapshotMap.get(idx);
        sData.startLoadingSnapShot();
      }
    }
  }

  // #endregion

}

Ch5Sample.registerCustomElement();
Ch5Sample.registerSignalAttributeTypes();

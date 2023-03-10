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
import { ICh5VideoPublishEvent, TDimension, TPosDimension, TVideoResponse } from "./interfaces/interfaces-helper";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { ICh5VideoBackground } from "../ch5-video/interfaces/types/t-ch5-video-publish-event-request";
import { Ch5Background } from "../ch5-background";

export class Ch5Sample extends Ch5Common implements ICh5SampleAttributes {

  //#region Variables

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
      name: "snapShotURL",
      nameForSignal: "receiveStateSnapShotURL",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: 0,
      name: "snapShotRefreshRate",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateSnapShotRefreshRate",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 5,
        conditionalMin: 0,
        conditionalMax: 5,
        conditionalMinValue: 0,
        conditionalMaxValue: 5
      },
      isObservableProperty: true
    },
    {
      default: "",
      name: "snapShotUserId",
      nameForSignal: "receiveStateSnapShotUserId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "snapShotPassword",
      nameForSignal: "receiveStateSnapShotPassword",
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
      name: "receiveStateSnapShotURL",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapShotRefreshRate",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapShotUserId",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSnapShotPassword",
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
      name: "sendEventSnapShotURL",
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
      name: "sendEventSnapShotStatus",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventSnapShotLastUpdateTime",
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

  private responseObj: TVideoResponse = {} as TVideoResponse;
  private fullScreenObj: TPosDimension = {} as TPosDimension;
  private sizeObj: TDimension = { width: 0, height: 0 };
  private ch5BackgroundElements: HTMLCollectionOf<Ch5Background> = document.getElementsByTagName('ch5-background') as HTMLCollectionOf<Ch5Background>;

  private readonly INTERSECTION_RATIO_VALUE: number = 0.98;
  private playValue: boolean = true;
  private lastRequestStatus: string = '';
  private isVideoReady: boolean = false;
  private lastResponseStatus: string = '';
  private videoTop: number = -1; // X-Axis Position of the CH5-Video
  private videoLeft: number = -1; // Y-Axis Position of the CH5-Video
  private videoTagId: string = ''; // to pass video bg object json
  private oldResponseStatus: string = '';
  private oldResponseId: number = 0;
  private requestID: number = 0; // to cross check req id and resp id
  private isOrientationChanged: boolean = false;
  private isFullScreen: boolean = false;
  private isExitFullscreen: boolean = false;
  private fromExitFullScreen: boolean = false;
  private isAlphaBlend: boolean = true;
  private isSwipeDebounce: any;
  private position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
  private _wasAppBackGrounded: boolean = false;
  private isVideoPublished = false;

  public ch5UId: number = 0; // CH5 Unique ID

  //#endregion

  //#region Getters and Setters


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

  public set snapShotURL(value: string) {
    this._ch5Properties.set<string>("snapShotURL", value, () => {
      this.handleSnapShotURL();
    });
  }
  public get snapShotURL(): string {
    return this._ch5Properties.get<string>("snapShotURL");
  }

  public set snapShotRefreshRate(value: number) {
    this._ch5Properties.set<number>("snapShotRefreshRate", value, () => {
      this.handlesnapShotRefreshRate();
    });
  }
  public get snapShotRefreshRate(): number {
    return this._ch5Properties.get<number>("snapShotRefreshRate");
  }

  public set snapShotUserId(value: string) {
    this._ch5Properties.set<string>("snapShotUserId", value, () => {
      this.handleSnapShotUserId();
    });
  }
  public get snapShotUserId(): string {
    return this._ch5Properties.get<string>("snapShotUserId");
  }

  public set snapShotPassword(value: string) {
    this._ch5Properties.set<string>("snapShotPassword", value, () => {
      this.handleSnapShotPassword();
    });
  }
  public get snapShotPassword(): string {
    return this._ch5Properties.get<string>("snapShotPassword");
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
      this.handleReceiveStatePlay();
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

  public set receiveStateSnapShotURL(value: string) {
    this._ch5Properties.set("receiveStateSnapShotURL", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("snapShotURL", newValue, () => {
        this.handleReceiveStateSnapShotURL();
      });
    });
  }
  public get receiveStateSnapShotURL(): string {
    return this._ch5Properties.get<string>('receiveStateSnapShotURL');
  }

  public set receiveStateSnapShotRefreshRate(value: string) {
    this._ch5Properties.set("receiveStateSnapShotRefreshRate", value, null, (newValue: number) => {
      this.handleReceiveStateSnapShotRefreshRate();
    });
  }
  public get receiveStateSnapShotRefreshRate(): string {
    return this._ch5Properties.get<string>('receiveStateSnapShotRefreshRate');
  }

  public set receiveStateSnapShotUserId(value: string) {
    this._ch5Properties.set("receiveStateSnapShotUserId", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("snapShotUserId", newValue, () => {
        this.handleReceiveStateSnapShotUserId();
      });
    });
  }
  public get receiveStateSnapShotUserId(): string {
    return this._ch5Properties.get<string>('receiveStateSnapShotUserId');
  }

  public set receiveStateSnapShotPassword(value: string) {
    this._ch5Properties.set("receiveStateSnapShotPassword", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("snapShotPassword", newValue, () => {
        this.handleReceiveStateSnapShotPassword();
      });
    });
  }
  public get receiveStateSnapShotPassword(): string {
    return this._ch5Properties.get<string>('receiveStateSnapShotPassword');
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
    this._ch5Properties.set("sendEventOnClick", value, null, (newValue: boolean) => {
      this.handleSendEventOnClick();
    });
  }
  public get sendEventOnClick(): string {
    return this._ch5Properties.get<string>('sendEventOnClick');
  }

  public set sendEventSelectionChange(value: string) {
    this._ch5Properties.set("sendEventSelectionChange", value, null, (newValue: number) => {
      this.handleSendEventSelectionChange();
    });
  }
  public get sendEventSelectionChange(): string {
    return this._ch5Properties.get<string>('sendEventSelectionChange');
  }

  public set sendEventSelectionSourceType(value: string) {
    this._ch5Properties.set("sendEventSelectionSourceType", value, null, (newValue: string) => {
      this.handleSendEventSelectionSourceType();
    });
  }
  public get sendEventSelectionSourceType(): string {
    return this._ch5Properties.get<string>('sendEventSelectionSourceType');
  }

  public set sendEventSelectionURL(value: string) {
    this._ch5Properties.set("sendEventSelectionURL", value, null, (newValue: string) => {
      this.handleSendEventSelectionURL();
    });
  }
  public get sendEventSelectionURL(): string {
    return this._ch5Properties.get<string>('sendEventSelectionURL');
  }

  public set sendEventSnapShotURL(value: string) {
    this._ch5Properties.set("sendEventSnapShotURL", value, null, (newValue: string) => {
      this.handleSendEventSnapShotURL();
    });
  }
  public get sendEventSnapShotURL(): string {
    return this._ch5Properties.get<string>('sendEventSnapShotURL');
  }

  public set sendEventState(value: string) {
    this._ch5Properties.set("sendEventState", value, null, (newValue: number) => {
      this.handleSendEventState();
    });
  }
  public get sendEventState(): string {
    return this._ch5Properties.get<string>('sendEventState');
  }

  public set sendEventErrorCode(value: string) {
    this._ch5Properties.set("sendEventErrorCode", value, null, (newValue: number) => {
      this.handleSendEventErrorCode();
    });
  }
  public get sendEventErrorCode(): string {
    return this._ch5Properties.get<string>('sendEventErrorCode');
  }

  public set sendEventErrorMessage(value: string) {
    this._ch5Properties.set("sendEventErrorMessage", value, null, (newValue: string) => {
      this.handleSendEventErrorMessage();
    });
  }
  public get sendEventErrorMessage(): string {
    return this._ch5Properties.get<string>('sendEventErrorMessage');
  }

  public set sendEventRetryCount(value: string) {
    this._ch5Properties.set("sendEventRetryCount", value, null, (newValue: number) => {
      this.handleSendEventRetryCount();
    });
  }
  public get sendEventRetryCount(): string {
    return this._ch5Properties.get<string>('sendEventRetryCount');
  }

  public set sendEventResolution(value: string) {
    this._ch5Properties.set("sendEventResolution", value, null, (newValue: string) => {
      this.handleSendEventResolution();
    });
  }
  public get sendEventResolution(): string {
    return this._ch5Properties.get<string>('sendEventResolution');
  }

  public set sendEventSnapShotStatus(value: string) {
    this._ch5Properties.set("sendEventSnapShotStatus", value, null, (newValue: number) => {
      this.handleSendEventSnapShotStatus();
    });
  }
  public get sendEventSnapShotStatus(): string {
    return this._ch5Properties.get<string>('sendEventSnapShotStatus');
  }

  public set sendEventSnapShotLastUpdateTime(value: string) {
    this._ch5Properties.set("sendEventSnapShotLastUpdateTime", value, null, (newValue: string) => {
      this.handleSendEventSnapShotLastUpdateTime();
    });
  }
  public get sendEventSnapShotLastUpdateTime(): string {
    return this._ch5Properties.get<string>('sendEventSnapShotLastUpdateTime');
  }


  //#endregion

  //#region Static Methods

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

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
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
    // WAI-ARIA Attributes
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
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

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
    // Create main control panel
    this._vidControlPanel = document.createElement("div");
    this._vidControlPanel.classList.add("control-panel");
    // Create div for the right side of the control panel
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

  }

  protected removeEventListeners() {
    super.removeEventListeners();

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
    // A dummy call to make the video to play on first project load
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(CH5VideoUtils.VIDEO_ACTION.STOP, this.ch5UId));
  }


  private handleIndexId() {
    // Enter your Code here
  }
  private handleAspectRatio() {
    Array.from(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);
  }
  private handleStretch() {
    // Enter your Code here
  }

  private handleSnapShotURL() {
    // Enter your Code here
  }
  private handlesnapShotRefreshRate() {
    // Enter your Code here
  }
  private handleSnapShotUserId() {
    // Enter your Code here
  }
  private handleSnapShotPassword() {
    // Enter your Code here
  }
  private handleSize() {
    Array.from(Ch5Sample.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5Sample.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }
  private handleZindex() {
    // Enter your Code here
  }
  private handleReceiveStatePlay() {
    // Enter your Code here
  }
  private handleReceiveStateSelect() {
    // Enter your Code here
  }
  private handleReceiveStateURL() {
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE) {
      this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.lastRequestStatus = CH5VideoUtils.VIDEO_ACTION.EMPTY;
      this.isVideoReady = false;
      this.isExitFullscreen = false;
      if (this.url === '') {
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.STOP);
        // this.beforeVideoDisplay();
      } else {
        this._publishVideoEvent(CH5VideoUtils.VIDEO_ACTION.START);
      }
    }
  }

  private handleReceiveStateSnapShotURL() {
    // Enter your Code here
  }
  private handleReceiveStateSnapShotRefreshRate() {
    // Enter your Code here
  }
  private handleReceiveStateSnapShotUserId() {
    // Enter your Code here
  }
  private handleReceiveStateSnapShotPassword() {
    // Enter your Code here
  }
  private handleReceivestatevideocount() {
    // Enter your Code here
  }
  private handleSendEventOnClick() {
    // Enter your Code here
    console.log('___________sendevent___________');
  }
  private handleSendEventSelectionChange() {
    // Enter your Code here
  }
  private handleSendEventSelectionSourceType() {
    // Enter your Code here
  }
  private handleSendEventSelectionURL() {
    // Enter your Code here
  }
  private handleSendEventSnapShotURL() {
    // Enter your Code here
  }
  private handleSendEventState() {
    // Enter your Code here
  }
  private handleSendEventErrorCode() {
    // Enter your Code here
  }
  private handleSendEventErrorMessage() {
    // Enter your Code here
  }
  private handleSendEventRetryCount() {
    // Enter your Code here
  }
  private handleSendEventResolution() {
    // Enter your Code here
  }
  private handleSendEventSnapShotStatus() {
    // Enter your Code here
  }
  private handleSendEventSnapShotLastUpdateTime() {
    // Enter your Code here
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();

    this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);

    this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.SIZE.classListPrefix + this.size);

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
    if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && this.playValue) {
      // this.loadAllSnapshots();
      this._onRatioAboveLimitToRenderVideo();
    } else {
      this._OnVideoAspectRatioConditionNotMet();
    }
    // Removes or Adds document level touch handlers if in view
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
    }, 100); // reducing this will create a cut at wrong place
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

    // On exiting fullscreen and if the user swipes/leave the video page send the CH5VideoUtils.VIDEO_ACTION.STOP request
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
      //this.sizeObj = CH5VideoUtils.getAspectRatioForVideo(this.aspectRatio, 'large');
      if (!this.stretch) {
        // Calculation for fixed display size like small, medium large
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
   * @param zIndex
   */
  public videoStartObjJSON(actionType: string, logInfo: string): ICh5VideoPublishEvent {
    const uId: number = this.ch5UId;
    const zIndex: number = parseInt('0', 0);
    const alphaBlend: boolean = this.isAlphaBlend;
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
    // always clears the background of the video tag to display video behind it
    this.clearBackgroundOfVideoWrapper(true);

    // any negative values in location object will throw backend error
    // sometimes decimal values are returned by position related functions
    // Math.ceil is used to avoid this.
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
        "top": Math.ceil(yPosition),
        "left": Math.ceil(xPosition),
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
    console.log(logInfo + JSON.stringify(retObj));
    return retObj;
  }

  /**
   * Publish the video start request
   * @param actionType
   */
  private _videoStartRequest(actionType: string) {
    // Empty URL scenario
    if (this.url.trim() === '') {
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.NOURL, 'videoStartRequest');
      return;
    }

    // Invalid URL scenario, validation error
    if (!CH5VideoUtils.validateVideoUrl(this.url)) {
      this.info("Invalid RTSP url -> " + this.url);
      this.lastResponseStatus = CH5VideoUtils.VIDEO_ACTION.ERROR;
      this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, 'videoStartRequest');
      return;
    }

    // Make a cut if snapshot not found
    this.fromExitFullScreen = false;
    //this.lastRequestUrl = this.url;
    this.isVideoReady = true;
    //this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.START, performance.now(), 'timerStart');
    publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'videoStartRequest'));
    this.requestID = this.ch5UId;
  }

  /**
 * Publish the video stop request
 * @param actionType
 */
  private _videoStopRequest(actionType: string) {
    // Stop the video immediately
    publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId));
    //	this.stopLoadingSnapShots();
    this.fromExitFullScreen = false;
    //this.lastRequestUrl = '';
    // /this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.STOP, performance.now(), 'timerStart');
    this.isVideoReady = false;
    //this._sendEvent(this.sendEventState, 3, 'number');
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
    // reset old response, required to check whether the second response is same.
    this._clearOldResponseData();
    switch (actionType) {
      case CH5VideoUtils.VIDEO_ACTION.START:
        //this.info("*** VIDEO_ACTION.START ", this.playValue, this.receiveStatePlay, this.fromReceiveStatePlay);
        this.isVideoPublished = true;
        if (!this.isVideoReady && this.lastRequestStatus !== CH5VideoUtils.VIDEO_ACTION.START && this.url &&
          (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
            this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.ERROR || this._wasAppBackGrounded) && !this.isExitFullscreen) {
          this.info("*** videoStartRequest");
          this._videoStartRequest(actionType);
        } else {
          this.info("*** this.sendEvent");
          //this._sendEvent(this.sendEventState, 0, 'number');
        }
        break;
      case CH5VideoUtils.VIDEO_ACTION.STOP:
        this.info("VIDEO_ACTION.STOP - this.playValue", this.playValue);

        this.info("*** MyCase STOPPED - this.isVideoPublished", this.isVideoPublished);
        if (!this.isVideoPublished) { // this flag avoids stop command since no video has started
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
        // If the video has already stopped then there is no need to resize.
        if (this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.STOPPED || this.lastResponseStatus === CH5VideoUtils.VIDEO_ACTION.EMPTY ||
          this.lastRequestStatus === CH5VideoUtils.VIDEO_ACTION.STOP) {
          return;
        }
        this.fromExitFullScreen = false;
        this.calculation();
        //this.beforeVideoDisplay();
        //this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.RESIZE, performance.now(), 'timerStart');
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

  /**
  * Video Response on subscribe
  * @param response
  */
  private _videoResponse(response: TVideoResponse) {
    // Process the backend response
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
    const responseStatCode: number = this.responseObj.statusCode || 0;
    const responseStatus = this.responseObj.status.toLowerCase();
    this.info('Response Status: ' + responseStatus.toLowerCase());
    console.log('Response Status: ' + responseStatus.toLowerCase());
    switch (responseStatus.toLowerCase()) {
      case CH5VideoUtils.VIDEO_ACTION.STOPPED:

        // When the user continously clicks on play and stop without a gap, started
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
        //this._performanceDuration(CH5VideoUtils.VIDEO_ACTION.RESIZE, performance.now(), 'timerEnd');
        this.isOrientationChanged = false;
        if (this.isExitFullscreen) {
          this.isExitFullscreen = false;
          this.fromExitFullScreen = true;
        }
        //this.isPositionChanged = false;
        // iOS devices never returns STARTED, it returns RESIZED after it starts the video
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
        // Increment the errorCount and send the background stop only once to avoid flickering during
        // continuous error feedback
        /* if (this.errorCount === 0) {
          this.ch5BackgroundRequest(CH5VideoUtils.VIDEO_ACTION.ERROR, 'videoResponse');
        } */
        //this.errorCount = this.errorCount + 1;
        break;
      default:
        this.info("Default case in Csig.video.response with status : " + responseStatus);
        this.isVideoReady = false;
        // Increment the retryCount and send the feedback
        /* if (responseStatus === 'retrying connection') {
          this.retryCount += this.retryCount;
          this._sendEvent(this.sendEventRetryCount, this.retryCount, 'number');
        } */
        break;
    }
    this.lastResponseStatus = responseStatus;
  }

  /**
   * Call back function if the video response has an error
   * @param error
   */
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
        this._elContainer.style.borderBottom = '1rem solid #828282'; // Gray color
        break;
      case CH5VideoUtils.VIDEO_ACTION.MARK:
        this.clearBackgroundOfVideoWrapper(false);
        if (nodeList.length > 1) {
          this._elContainer.childNodes[1].remove();
        }
        this._elContainer.style.borderBottom = '1rem solid #FFBF00'; // Amber color
        break;
      case CH5VideoUtils.VIDEO_ACTION.REFILL:
        /* if (this.lastBackGroundRequest !== actionType) {
          this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.REFILL));
        } else { */
        isActionExecuted = false;
        //}
        break;
      case CH5VideoUtils.VIDEO_ACTION.RESIZE:
        this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.RESIZE));
        break;
      case CH5VideoUtils.VIDEO_ACTION.STARTED:
        // clearTimeout(this.exitSnapsShotTimer); // clear timer to stop refreshing image
        this.resetVideoElement();
        //	this.switchLoadingSnapShot();
        //	this.firstTime = false;
        this.ch5BackgroundAction(this.videoBGObjJSON(CH5VideoUtils.VIDEO_ACTION.STARTED));
        break;
      case CH5VideoUtils.VIDEO_ACTION.STOP:
        //clearTimeout(this.exitSnapsShotTimer); // clear timer to stop refreshing image
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
          this._elContainer.style.borderBottom = '1rem solid #CF142B'; // Red color
        } else {
          isActionExecuted = false;
        }
        break;
      default:
        // Nothing here as of now
        break;
    }
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

    /* if (actionStatus === this.VIDEO_ACTION.SNAPSHOT) {
      const sData: Ch5VideoSnapshot = this.snapShotMap.get(this.receivedStateSelect);
      retObj.image = sData.getSnapShot();
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

  //#endregion

}

Ch5Sample.registerCustomElement();
Ch5Sample.registerSignalAttributeTypes();

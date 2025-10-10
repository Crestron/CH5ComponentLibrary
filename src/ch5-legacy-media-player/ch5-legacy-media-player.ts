import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5LegacyMediaPlayerAttributes } from './interfaces/i-ch5-legacy-media-player-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5LegacyMediaPlayerNowPlaying } from "./ch5-legacy-media-player-now-playing";
import { Ch5LegacyMediaPlayerMyMusic } from "./ch5-legacy-media-player-my-music";
import { MusicPlayerLib, publishEvent, subscribeState, TSignalNonStandardTypeName, TSignalValue, unsubscribeState } from "../ch5-core";
import { resizeObserver } from "../ch5-core/resize-observer";
import { createElement } from "./ch5-legacy-media-player-common";

export class Ch5LegacyMediaPlayer extends Ch5Common implements ICh5LegacyMediaPlayerAttributes {

  //#region Variables

  private busyChanged: any;
  private popUpData: any;

  private signalNameOnContract = {
    contractName: "",
    receiveStateEnable: "",
    receiveStateShow: "",
    receiveStateCustomClass: "",
    receiveStateCustomStyle: "",
    receiveStateCRPC: "",
    sendEventCRPC: "",
    receiveStateMessage: "",
    receiveStateRefreshMediaPlayer: "",
    receiveStateDeviceOffline: "",
    receiveStatePlayerName: ""
  }

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatecrpc: { direction: "state", stringJoin: 1, contractName: true },
    sendeventcrpc: { direction: "event", stringJoin: 1, contractName: true },
    receivestatemessage: { direction: "state", stringJoin: 1, contractName: true },
    receivestaterefreshmediaplayer: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatedeviceoffline: { direction: "state", booleanJoin: 1, contractName: true },
    receivestateplayername: { direction: "state", stringJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: false,
      name: "demoMode",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: "",
      name: "contractName",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateCRPC",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventCRPC",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateMessage",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateRefreshMediaPlayer",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateDeviceOffline",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStatePlayerName",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForEnable",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForCustomStyle",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForCustomClass",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    }
  ];

  public static readonly ELEMENT_NAME = 'ch5-legacy-media-player';

  public primaryCssClass = 'ch5-legacy-media-player';

  public musicPlayerLibInstance: MusicPlayerLib;

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private nowPlaying: Ch5LegacyMediaPlayerNowPlaying | null = null;
  private myMusic: Ch5LegacyMediaPlayerMyMusic | null = null;
  private _elMask: HTMLElement = {} as HTMLElement;
  private _elGenericDialogContent: HTMLElement = {} as HTMLElement;
  private _elMaskdialogTitle: HTMLElement = {} as HTMLElement;
  private _dialogFooter: HTMLElement = {} as HTMLElement;
  private _loadingIndicator: HTMLElement = {} as HTMLElement;
  private _dialogAutoCloseTimeout: number | null = null;

  //#endregion

  //#region Getters and Setters

  public set demoMode(value: boolean) {
    this._ch5Properties.set<boolean>("demoMode", value, () => {
      this.handleDemoMode();
    });
  }
  public get demoMode(): boolean {
    return this._ch5Properties.get<boolean>("demoMode");
  }

  public set contractName(value: string) {
    this._ch5Properties.set<string>("contractName", value, () => {
      this.handleContractName();
    });
  }
  public get contractName(): string {
    return this._ch5Properties.get<string>("contractName");
  }

  public set useContractForEnable(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForEnable", value, () => {
      this.contractDefaultHelper();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForShow", value, () => {
      this.contractDefaultHelper();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForShow");
  }

  public set useContractForCustomStyle(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
      this.contractDefaultHelper();
    });
  }
  public get useContractForCustomStyle(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomStyle");
  }

  public set useContractForCustomClass(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
      this.contractDefaultHelper();
    });
  }
  public get useContractForCustomClass(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomClass");
  }


  public set receiveStateCRPC(value: string) {
    this._ch5Properties.set("receiveStateCRPC", value, null, (newValue: string) => {
      this.publishMPEvent('s', "receiveStateCRPCResp", newValue);
    });
  }
  public get receiveStateCRPC(): string {
    return this._ch5Properties.get<string>('receiveStateCRPC');
  }

  public set sendEventCRPC(value: string) {
    this._ch5Properties.set("sendEventCRPC", value);
    this.publishMPEvent('s', 'sendEventCRPCJoinNo', this.sendEventCRPC);
  }
  public get sendEventCRPC(): string {
    return this._ch5Properties.get<string>('sendEventCRPC');
  }

  public set receiveStateMessage(value: string) {
    this._ch5Properties.set("receiveStateMessage", value, null, (newValue: string) => {
      this.logger.log('Source and Tag value', newValue);
      this.publishMPEvent('s', "receiveStateMessageResp", newValue);
    });
  }
  public get receiveStateMessage(): string {
    return this._ch5Properties.get<string>('receiveStateMessage');
  }

  public set receiveStateRefreshMediaPlayer(value: string) {
    this._ch5Properties.set("receiveStateRefreshMediaPlayer", value, null, (newValue: boolean) => {
      this.publishMPEvent('b', "receiveStateRefreshMediaPlayerResp", newValue);
    });
  }
  public get receiveStateRefreshMediaPlayer(): string {
    return this._ch5Properties.get<string>('receiveStateRefreshMediaPlayer');
  }

  public set receiveStateDeviceOffline(value: string) {
    this._ch5Properties.set("receiveStateDeviceOffline", value, null, (newValue: boolean) => {
      this.publishMPEvent('b', "receiveStateDeviceOfflineResp", newValue);
    });
  }
  public get receiveStateDeviceOffline(): string {
    return this._ch5Properties.get<string>('receiveStateDeviceOffline');
  }

  public set receiveStatePlayerName(value: string) {
    this._ch5Properties.set("receiveStatePlayerName", value, null, () => {
      this.handleReceiveStatePlayerName();
    });
  }
  public get receiveStatePlayerName(): string {
    return this._ch5Properties.get<string>('receiveStatePlayerName');
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5LegacyMediaPlayer.ELEMENT_NAME, Ch5LegacyMediaPlayer.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5LegacyMediaPlayer.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5LegacyMediaPlayer.ELEMENT_NAME, Ch5LegacyMediaPlayer);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5LegacyMediaPlayer.ELEMENT_NAME);
    this.musicPlayerLibInstance = new MusicPlayerLib();
    this.ignoreAttributes = ["appendclasswheninviewport", "receivestateshowpulse", "receivestatehidepulse", "sendeventonshow"];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES);
    this.updateCssClass();

    subscribeState('o', 'busyChanged', ((data: any) => {
      this.busyChanged = data;
      // if (this.busyChanged.on) {
      //   this.startMPLoading();
      // } else {
      //   this.stopMPLoading();
      // }
      this.logger.log('busyChanged', this.busyChanged);
    }));

    subscribeState('o', 'StatusMsgMenuChanged', ((data: any) => {
      this.popUpData = data;
      this.logger.log("Popup Data", this.popUpData);
      if (this._elMask && this._elMask.parentNode) {
        this._elMask.parentNode.removeChild(this._elMask);
      }
      if (this.popUpData.show) {
        this.keyboardInputDialog(this.popUpData.userInputRequired, this.popUpData.text, this.popUpData.textForItems, this.popUpData.initialUserInput, this.popUpData.timeoutSec);
      } else {
        if (this._elMask && this._elMask.parentNode) {
          this._elMask.parentNode.removeChild(this._elMask);
        }
      }
    }));
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-legacy-media-player attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5LegacyMediaPlayer component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5LegacyMediaPlayer.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5LegacyMediaPlayer);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-legacy-media-player');
      this.appendChild(this._elContainer);
    }
    this.addMusicTransition();
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.handleDemoMode(); // it is needed when attribute is set to true and then removed from the component
    customElements.whenDefined('ch5-legacy-media-player').then(() => {
      this.componentLoadedEvent(Ch5LegacyMediaPlayer.ELEMENT_NAME, this.id);
    });
    // setTimeout(() => {   //to show loader in showcase
    //   this.stopMPLoading();
    // }, 2000);
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.musicPlayerLibInstance.unsubscribeLibrarySignals();// unsubscribeLibrarySignals
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = createElement('div');
    this.nowPlaying = new Ch5LegacyMediaPlayerNowPlaying(this.musicPlayerLibInstance);
    this._elContainer.appendChild(this.nowPlaying.createInternalHtml());
    this.myMusic = new Ch5LegacyMediaPlayerMyMusic(this.musicPlayerLibInstance);
    this._elContainer.appendChild(this.myMusic.createInternalHtml());
    // this.startMPLoading();
    this.logger.stop();
  }

  private startMPLoading() {
    if (this._loadingIndicator && this._loadingIndicator.parentNode) {
      this._loadingIndicator.parentNode.removeChild(this._loadingIndicator);
    }
    this._loadingIndicator = createElement('div', ['mp-loading-indicator']);
    const loadingIndicatorText = createElement('span', ['mp-loading-indicator-text']);
    const loadingIndicatorTextIcon = createElement('i', ['fa-solid', 'fa-circle-notch', 'fa-spin', 'mp-loader-icon-size']);
    loadingIndicatorText.appendChild(loadingIndicatorTextIcon);
    this._loadingIndicator.appendChild(loadingIndicatorText);
    this._elContainer.appendChild(this._loadingIndicator);
  }

  private stopMPLoading() {
    if (this._loadingIndicator && this._loadingIndicator.parentNode) {
      this._loadingIndicator.parentNode.removeChild(this._loadingIndicator);
    }
  }

  //Generic Dialog
  protected genericDialog(dialogType: number, dialogHeading: string, dialogArray: Array<string>) {
    this.logger.log(dialogType);
    if (this._elMask) this._elMask.innerHTML = "";
    this.getDialogHeading(dialogHeading);// dialog heading
    this.getDialogFooter(dialogArray);// dialog footer buttons
    this._elMask.appendChild(this._elGenericDialogContent);
  }

  //Keyboard Input Dialog
  protected keyboardInputDialog(dialogType: string, dialogHeading: string, dialogArray: Array<string>, dialogInput: string, timeoutSec: number) {
    this.logger.log(dialogType);
    if (this._elMask) this._elMask.innerHTML = "";

    // Set dialog heading
    this.getDialogHeading(dialogHeading);
    const dialogContentInput = document.createElement("input");
    // Create input box 
    if (dialogType === "alphanumeric") {
      const dialogContent = createElement('div', ["dialog-content"]);
      dialogContentInput.classList.add('dialog-content-input');
      dialogContentInput.value = dialogInput;
      dialogContent.appendChild(dialogContentInput);
      this._elGenericDialogContent.appendChild(dialogContent);
    }
    this.getDialogFooter(dialogArray, dialogContentInput);
    this._elMask.appendChild(this._elGenericDialogContent);
    this._elContainer.appendChild(this._elMask);

    //Auto close dialog if user don't take any action for 10 seconds
    if (this._dialogAutoCloseTimeout) {
      clearTimeout(this._dialogAutoCloseTimeout);
    }
    this._dialogAutoCloseTimeout = window.setTimeout(() => {
      if (this._elMask && this._elMask.parentNode) {
        this._elMask.parentNode.removeChild(this._elMask);
      }
      this._dialogAutoCloseTimeout = null;
    }, timeoutSec * 1000);

    dialogContentInput.addEventListener('input', () => {
      if (this._dialogAutoCloseTimeout) {
        clearTimeout(this._dialogAutoCloseTimeout);
        this._dialogAutoCloseTimeout = null;
      }
    });
  }

  //Dialog Heading
  protected getDialogHeading(dialogHeading: string) {
    this._elMask = createElement('div', ['ch5-legacy-media-player--mask']);
    this._elContainer.appendChild(this._elMask);
    this._elGenericDialogContent = createElement('div', ['ch5-legacy-media-player--mask-content-generic']);
    this._elMaskdialogTitle = createElement('div', ['generic-dialog-title'], dialogHeading);
    this._elGenericDialogContent.appendChild(this._elMaskdialogTitle);
  }

  //Dialog Footer Buttons
  protected getDialogFooter(dialogArray: Array<string>, inputEle?: HTMLInputElement) {
    this._dialogFooter = createElement('div', ['generic-dialog-footer']);
    const dialogType = dialogArray.length;
    for (let i = 0; i < dialogType; i++) {
      const button = createElement('button', ['generic-dialog-button']);
      button.addEventListener("click", () => {
        //clear auto close timeout on footer button click
        if (this._dialogAutoCloseTimeout) {
          clearTimeout(this._dialogAutoCloseTimeout);
          this._dialogAutoCloseTimeout = null;
        }
        this.logger.log("Button Confirmation Id:", i + 1);
        this.logger.log("Input Value:", inputEle?.value);
        this.musicPlayerLibInstance.popUpAction(inputEle?.value, i + 1);
      });
      button.textContent = dialogArray[i];
      this._dialogFooter.appendChild(button);
    }
    if (dialogType > 2) {
      this._dialogFooter.classList.remove('generic-dialog-footer--row');
      this._dialogFooter.classList.add('generic-dialog-footer--column');
    } else {
      this._dialogFooter.classList.remove('generic-dialog-footer--column');
      this._dialogFooter.classList.add('generic-dialog-footer--row');
    }
    this._elGenericDialogContent.appendChild(this._dialogFooter);
  }

  public addMusicTransition() {
    this.querySelector(".now-playing-player-music-note-button")?.addEventListener("click", () => {
      this.querySelector(".ch5-legacy-media-player--my-music")?.classList.add("my-music-transition");
    });
  }

  protected initAttributes() {
    super.initAttributes();
    const thisRef: any = this;
    for (let i: number = 0; i < Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    resizeObserver(this._elContainer, this.handleResizeObserver);
  }

  private handleResizeObserver = () => {
    const { width } = this._elContainer.getBoundingClientRect();
    this.nowPlaying?.updateMarquee();

    if (width < 640) {
      if (!this._elContainer.classList.contains("portrait-mode-active")) {
        this._elContainer.classList.add("portrait-mode-active");
      }
    } else {
      this.querySelector(".ch5-legacy-media-player--my-music")?.classList.remove("my-music-transition"); // ?
      this._elContainer.classList.remove("portrait-mode-active");
    }
    // if (width >= 1200) {
    //   this._elContainer.classList.add("now-playing-max-width-1200");
    // } else {
    //   this._elContainer.classList.remove("now-playing-max-width-1200");
    // }
    // if (height < 500) {
    //   this._elContainer.classList.add("now-playing-image-shape-circular");
    // } else {
    //   this._elContainer.classList.remove("now-playing-image-shape-circular");
    // }
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
  private handleDemoMode() {
    this.nowPlaying?.handleDemoMode(this.demoMode);
    this.myMusic?.handleDemoMode(this.demoMode);
    if (!this.demoMode) {
      this.publishAllSignals();
    } else {
      this.musicPlayerLibInstance.resetMp();//Not deregister the player, its just clear values
    }
  }

  private handleContractName() {
    if (this.contractName.length === 0) {
      this.signalNameOnContract.contractName = "";
      this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
      this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
      this.receiveStateCustomClass = this.signalNameOnContract.receiveStateCustomClass;
      this.receiveStateCustomStyle = this.signalNameOnContract.receiveStateCustomStyle;
      this.receiveStateCRPC = this.signalNameOnContract.receiveStateCRPC;
      this.sendEventCRPC = this.signalNameOnContract.sendEventCRPC;
      this.receiveStateMessage = this.signalNameOnContract.receiveStateMessage;
      this.receiveStateRefreshMediaPlayer = this.signalNameOnContract.receiveStateRefreshMediaPlayer;
      this.receiveStateDeviceOffline = this.signalNameOnContract.receiveStateDeviceOffline;
      this.receiveStatePlayerName = this.signalNameOnContract.receiveStatePlayerName;
    } else if (this.signalNameOnContract.contractName === "") {
      this.signalNameOnContract.contractName = this.contractName;
      this.signalNameOnContract.receiveStateShow = this.receiveStateShow;
      this.signalNameOnContract.receiveStateEnable = this.receiveStateEnable;
      this.signalNameOnContract.receiveStateCustomClass = this.receiveStateCustomClass;
      this.signalNameOnContract.receiveStateCustomStyle = this.receiveStateCustomStyle;
      this.signalNameOnContract.receiveStateCRPC = this.receiveStateCRPC;
      this.signalNameOnContract.sendEventCRPC = this.sendEventCRPC;
      this.signalNameOnContract.receiveStateMessage = this.receiveStateMessage;
      this.signalNameOnContract.receiveStateRefreshMediaPlayer = this.receiveStateRefreshMediaPlayer;
      this.signalNameOnContract.receiveStateDeviceOffline = this.receiveStateDeviceOffline;
      this.signalNameOnContract.receiveStatePlayerName = this.receiveStatePlayerName;
    }
    this.contractDefaultHelper();
  }

  private contractDefaultHelper() {
    if (this.contractName !== "" && this.contractName !== null && this.contractName !== undefined) {
      this.receiveStateCRPC = this.contractName + '.CRPC_FB';
      this.sendEventCRPC = this.contractName + '.CRPC';
      this.receiveStateMessage = this.contractName + '.Message_FB';
      this.receiveStateRefreshMediaPlayer = this.contractName + '.Refresh';
      this.receiveStateDeviceOffline = this.contractName + '.Offline';
      this.receiveStatePlayerName = this.contractName + '.Player_Name';
      if (this.useContractForShow === true) {
        this.receiveStateShow = this.contractName + 'Visible';
      } else {
        this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
      }
      if (this.useContractForEnable === true) {
        this.receiveStateEnable = this.contractName + 'Enabled';
      } else {
        this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
      }
      if (this.useContractForCustomClass === true) {
        this.receiveStateCustomClass = this.contractName + 'CustomClass';
      } else {
        this.receiveStateCustomClass = this.signalNameOnContract.receiveStateCustomClass;
      }
      if (this.useContractForCustomStyle === true) {
        this.receiveStateCustomStyle = this.contractName + 'CustomStyle';
      } else {
        this.receiveStateCustomStyle = this.signalNameOnContract.receiveStateCustomStyle;
      }
    }
  }

  private handleReceiveStatePlayerName() {
    // Enter your Code here
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  private publishMPEvent(signalType: TSignalNonStandardTypeName, signalName: string, value: TSignalValue): void {
    if (this.demoMode === false) {
      publishEvent(signalType, signalName, value);
    }
  }

  private publishAllSignals() {

    publishEvent('s', 'sendEventCRPCJoinNo', this.sendEventCRPC);

    const subReceiveStateMessage = subscribeState('s', this.receiveStateMessage, ((value: any) => {
      publishEvent('s', "receiveStateMessageResp", value);
      setTimeout(() => {
        unsubscribeState('s', 'receiveStateMessage', subReceiveStateMessage);
      })
    }));

    const subReceiveStateRefreshMediaPlayer = subscribeState('b', this.receiveStateRefreshMediaPlayer, ((value: any) => {
      publishEvent('b', "receiveStateRefreshMediaPlayerResp", value);
      setTimeout(() => {
        unsubscribeState('b', 'receiveStateRefreshMediaPlayer', subReceiveStateRefreshMediaPlayer);
      })
    }));

    const subReceiveStateDeviceOffline = subscribeState('b', this.receiveStateDeviceOffline, ((value: any) => {
      publishEvent('b', "receiveStateDeviceOfflineResp", value);
      setTimeout(() => {
        unsubscribeState('s', 'receiveStateDeviceOffline', subReceiveStateDeviceOffline);
      })
    }));

  }

  //#endregion
}

Ch5LegacyMediaPlayer.registerCustomElement();
Ch5LegacyMediaPlayer.registerSignalAttributeTypes();
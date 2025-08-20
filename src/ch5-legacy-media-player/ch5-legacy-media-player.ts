import { Ch5Common } from "../ch5-common/ch5-common";
// import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

import { ICh5LegacyMediaPlayerAttributes } from './interfaces/i-ch5-legacy-media-player-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import {Ch5LegacyMediaPlayerMyMusic } from "./ch5-legacy-media-player-my-music";
import {Ch5LegacyMediaPlayerNowPlaying} from "./ch5-legacy-media-player-now-playing";

export class Ch5LegacyMediaPlayer extends Ch5Common implements ICh5LegacyMediaPlayerAttributes {

  //#region Variables


  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatecrpc: { direction: "state", stringJoin: 1, contractName: true },
    sendeventcrpc: { direction: "event", stringJoin: 1, contractName: true },
    receivestatemessage: { direction: "state", stringJoin: 1, contractName: true },
    sendeventmessage: { direction: "event", stringJoin: 1, contractName: true },
    receivestaterefreshmediaplayer: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatedeviceoffline: { direction: "state", booleanJoin: 1, contractName: true },
    receivestateusemessage: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatecontrolsystemoffline: { direction: "state", booleanJoin: 1, contractName: true },
    sendeventplayername: { direction: "event", stringJoin: 1, contractName: true },

  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

    {
      default: false,
      name: "demoMode",

      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
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
      name: "sendEventMessage",
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
      name: "receiveStateUseMessage",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateControlSystemOffline",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventPlayerName",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-legacy-media-player';

  public primaryCssClass = 'ch5-legacy-media-player';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _legacyMediaPlayerMyMusic: Ch5LegacyMediaPlayerMyMusic = {} as Ch5LegacyMediaPlayerMyMusic;
  private _legacyMediaPlayerNowPlaying: Ch5LegacyMediaPlayerNowPlaying = {} as Ch5LegacyMediaPlayerNowPlaying;
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

  public set receiveStateCRPC(value: string) {
    this._ch5Properties.set("receiveStateCRPC", value, null, (newValue: string) => {
      this.handleReceiveStateCRPC();
      console.log(newValue);
    });
  }
  public get receiveStateCRPC(): string {
    return this._ch5Properties.get<string>('receiveStateCRPC');
  }

  public set sendEventCRPC(value: string) {
    this._ch5Properties.set("sendEventCRPC", value, null, (newValue: string) => {
      this.handleSendEventCRPC();
      console.log(newValue);
    });
  }
  public get sendEventCRPC(): string {
    return this._ch5Properties.get<string>('sendEventCRPC');
  }

  public set receiveStateMessage(value: string) {
    this._ch5Properties.set("receiveStateMessage", value, null, (newValue: string) => {
      this.handleReceiveStateMessage();
      console.log(newValue);
    });
  }
  public get receiveStateMessage(): string {
    return this._ch5Properties.get<string>('receiveStateMessage');
  }

  public set sendEventMessage(value: string) {
    this._ch5Properties.set("sendEventMessage", value, null, (newValue: string) => {
      this.handleSendEventMessage();
      console.log(newValue);
    });
  }
  public get sendEventMessage(): string {
    return this._ch5Properties.get<string>('sendEventMessage');
  }

  public set receiveStateRefreshMediaPlayer(value: string) {
    this._ch5Properties.set("receiveStateRefreshMediaPlayer", value, null, (newValue: boolean) => {
      this.handleReceiveStateRefreshMediaPlayer();
      console.log(newValue);
    });
  }
  public get receiveStateRefreshMediaPlayer(): string {
    return this._ch5Properties.get<string>('receiveStateRefreshMediaPlayer');
  }

  public set receiveStateDeviceOffline(value: string) {
    this._ch5Properties.set("receiveStateDeviceOffline", value, null, (newValue: boolean) => {
      this.handleReceiveStateDeviceOffline();
      console.log(newValue);
    });
  }
  public get receiveStateDeviceOffline(): string {
    return this._ch5Properties.get<string>('receiveStateDeviceOffline');
  }

  public set receiveStateUseMessage(value: string) {
    this._ch5Properties.set("receiveStateUseMessage", value, null, (newValue: boolean) => {
      this.handleReceiveStateUseMessage();
      console.log(newValue);
    });
  }
  public get receiveStateUseMessage(): string {
    return this._ch5Properties.get<string>('receiveStateUseMessage');
  }

  public set receiveStateControlSystemOffline(value: string) {
    this._ch5Properties.set("receiveStateControlSystemOffline", value, null, (newValue: boolean) => {
      this.handleReceiveStateControlSystemOffline();
      console.log(newValue);
    });
  }
  public get receiveStateControlSystemOffline(): string {
    return this._ch5Properties.get<string>('receiveStateControlSystemOffline');
  }

  public set sendEventPlayerName(value: string) {
    this._ch5Properties.set("sendEventPlayerName", value, null, (newValue: string) => {
      this.handleSendEventPlayerName();
      console.log(newValue);
    });
  }
  public get sendEventPlayerName(): string {
    return this._ch5Properties.get<string>('sendEventPlayerName');
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
    this.ignoreAttributes = ["appendclasswheninviewport", "receivestateshowpulse", "receivestatehidepulse", "sendeventonshow",];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayer.COMPONENT_PROPERTIES);
    this.updateCssClass();
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
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-legacy-media-player').then(() => {
      this.componentLoadedEvent(Ch5LegacyMediaPlayer.ELEMENT_NAME, this.id);
    });
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
    this._legacyMediaPlayerMyMusic= new Ch5LegacyMediaPlayerMyMusic();
    this._legacyMediaPlayerNowPlaying= new Ch5LegacyMediaPlayerNowPlaying();
    this._elContainer = document.createElement('div');
    this._elContainer.appendChild(this._legacyMediaPlayerNowPlaying);
    this._elContainer.appendChild(this._legacyMediaPlayerMyMusic);
    this.logger.stop();
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
    // Enter your Code here
  }
  private handleContractName() {
    // Enter your Code here
  }
  private handleReceiveStateCRPC() {
    // Enter your Code here
  }
  private handleSendEventCRPC() {
    // Enter your Code here
  }
  private handleReceiveStateMessage() {
    // Enter your Code here
  }
  private handleSendEventMessage() {
    // Enter your Code here
  }
  private handleReceiveStateRefreshMediaPlayer() {
    // Enter your Code here
  }
  private handleReceiveStateDeviceOffline() {
    // Enter your Code here
  }
  private handleReceiveStateUseMessage() {
    // Enter your Code here
  }
  private handleReceiveStateControlSystemOffline() {
    // Enter your Code here
  }
  private handleSendEventPlayerName() {
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

  //#endregion

}

Ch5LegacyMediaPlayer.registerCustomElement();
Ch5LegacyMediaPlayer.registerSignalAttributeTypes();

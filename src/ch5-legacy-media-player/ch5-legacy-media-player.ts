import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5LegacyMediaPlayerAttributes } from './interfaces/i-ch5-legacy-media-player-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5LegacyMediaPlayerNowPlaying } from "./ch5-legacy-media-player-now-playing";
import { Ch5LegacyMediaPlayerMyMusic } from "./ch5-legacy-media-player-my-music";
import { MusicPlayerLib, publishEvent } from "../ch5-core";
import { resizeObserver } from "../ch5-core/resize-observer";

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
    receivestateplayername: { direction: "event", stringJoin: 1, contractName: true },
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
      name: "receiveStatePlayerName",
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

  private _elMask: HTMLElement = {} as HTMLElement;
  private _elGenericDialogContent: HTMLElement = {} as HTMLElement;

  //private _isShowPopup: boolean = false;
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
      publishEvent('s', "mpSigRPCIn", newValue);
      //this.handleReceiveStateCRPC();
    });
  }
  public get receiveStateCRPC(): string {
    return this._ch5Properties.get<string>('receiveStateCRPC');
  }

  public set sendEventCRPC(value: string) {
    publishEvent('s', 'mpSigRPCOut', "1");
    this._ch5Properties.set("sendEventCRPC", value, null, () => {
      // publishEvent('s', 'mpSigRPCOut', "1");
      //this.handleSendEventCRPC();
    });
  }
  public get sendEventCRPC(): string {
    return this._ch5Properties.get<string>('sendEventCRPC');
  }

  public set receiveStateMessage(value: string) {
    this._ch5Properties.set("receiveStateMessage", value, null, (newValue: string) => {
      publishEvent('s', "mpSigMessageIn", newValue);
      //this.handleReceiveStateMessage();
    });
  }
  public get receiveStateMessage(): string {
    return this._ch5Properties.get<string>('receiveStateMessage');
  }

  public set sendEventMessage(value: string) {
    this._ch5Properties.set("sendEventMessage", value, null, () => {
      this.handleSendEventMessage();
    });
  }
  public get sendEventMessage(): string {
    return this._ch5Properties.get<string>('sendEventMessage');
  }

  public set receiveStateRefreshMediaPlayer(value: string) {
    this._ch5Properties.set("receiveStateRefreshMediaPlayer", value, null, (newValue: boolean) => {
      //this.handleReceiveStateRefreshMediaPlayer();
      publishEvent('b', "mpSigRefresh", newValue);
    });
  }
  public get receiveStateRefreshMediaPlayer(): string {
    return this._ch5Properties.get<string>('receiveStateRefreshMediaPlayer');
  }

  public set receiveStateDeviceOffline(value: string) {
    this._ch5Properties.set("receiveStateDeviceOffline", value, null, (newValue: boolean) => {
      //this.handleReceiveStateDeviceOffline();
      publishEvent('b', "mpSigOffline", newValue);
    });
  }
  public get receiveStateDeviceOffline(): string {
    return this._ch5Properties.get<string>('receiveStateDeviceOffline');
  }

  public set receiveStateUseMessage(value: string) {
    this._ch5Properties.set("receiveStateUseMessage", value, null, (newValue: boolean) => {
      //this.handleReceiveStateUseMessage();
      publishEvent('b', "mpSigUseMessage", newValue);
    });
  }
  public get receiveStateUseMessage(): string {
    return this._ch5Properties.get<string>('receiveStateUseMessage');
  }

  public set receiveStateControlSystemOffline(value: string) {
    this._ch5Properties.set("receiveStateControlSystemOffline", value, null, (newValue: boolean) => {
      publishEvent('b', "mpSigCtrlSysOffline", newValue);
      // this.handleReceiveStateControlSystemOffline();
    });
  }
  public get receiveStateControlSystemOffline(): string {
    return this._ch5Properties.get<string>('receiveStateControlSystemOffline');
  }

  public set sendEventPlayerName(value: string) {
    this._ch5Properties.set("sendEventPlayerName", value, null, () => {
      this.handleSendEventPlayerName();
    });
  }
  public get sendEventPlayerName(): string {
    return this._ch5Properties.get<string>('sendEventPlayerName');
  }


  // set showPopup(value: boolean) {
  //   this._isShowPopup = value;
  //   if (this._elMask) {
  //     this._elMask.style.display = value ? '' : 'none';
  //   }
  // }
  // get showPopup() {
  //   return this._isShowPopup;
  // }

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
    MusicPlayerLib.getInstance();
    this.ignoreAttributes = ["appendclasswheninviewport", "receivestateshowpulse", "receivestatehidepulse", "sendeventonshow"];
    //this._isShowPopup = false;
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

    //this.showPopup = false;
    // if (this._elMask) {
    //   this._elMask.style.display = '';
    // }
    // setTimeout(() => {
    //   this.showPopup = false;
    //   if (this._elMask) {
    //     this._elMask.style.display = 'none';
    //   }
    // }, 3000);

    this.show

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
    this._elContainer = document.createElement('div');
    const nowPlaying = new Ch5LegacyMediaPlayerNowPlaying();
    this._elContainer.appendChild(nowPlaying.createInternalHtml());
    const myMusic = new Ch5LegacyMediaPlayerMyMusic();
    this._elContainer.appendChild(myMusic.createInternalHtml());
    this.logger.stop();
  }

  //Generic Dialog
  protected genericDialog(dialogType: string, dialogHeading: string) {
    console.log(dialogType);
    if(this._elMask) this._elMask.innerHTML = "";
    //dialog heading
    this.getDialogHeading(dialogHeading);
    //dialog footer buttons
    this.getDialogFooter("generic");

    this._elMask.appendChild(this._elGenericDialogContent);
  }

  //Keyboard Input Dialog
  protected keyboardInputDialog(dialogType: string, dialogHeading: string, dialogFor: string) {
    console.log(dialogType);
    if(this._elMask) this._elMask.innerHTML = "";
    //dialog heading
    this.getDialogHeading(dialogHeading);
    //dialog input box
    const dialogContent = document.createElement('div');
    dialogContent.classList.add("dialog-content");
    const dialogContentInput = document.createElement("input");
    dialogContentInput.classList.add('dialog-content-input');
    dialogContent.appendChild(dialogContentInput);
    this._elGenericDialogContent.appendChild(dialogContent);
    //dialog footer buttons
    this.getDialogFooter(dialogFor);

    //disable primary button in input empty
    dialogContentInput.addEventListener('input', () => {
      const primaryButton = this._elGenericDialogContent.getElementsByClassName('primary-dialog-button')[0] as HTMLButtonElement;
      if (dialogContentInput.value.trim() === '') {
        primaryButton?.setAttribute('disabled', 'true');
        primaryButton?.classList.add('disabled');
      } else {
        primaryButton?.removeAttribute('disabled');
        primaryButton?.classList.remove('disabled');
      }
    });

    this._elMask.appendChild(this._elGenericDialogContent);
  }

  //Action Group Dialog
  protected actionGroupDialog(dialogType: string, dialogHeading: string) {
    console.log(dialogType);
    if(this._elMask) this._elMask.innerHTML = "";
    //dialog heading
    this.getDialogHeading(dialogHeading);
    //dialog action buttons
    const dialogFooter = document.createElement('div');
    dialogFooter.classList.add('action-group-dialog-footer');
    const dialogFooterPrimaryButtonRename = document.createElement('div');
    dialogFooterPrimaryButtonRename.classList.add('action-group-dialog-button', 'primary-dialog-button');
    dialogFooterPrimaryButtonRename.textContent = "Rename Favorite";
    dialogFooterPrimaryButtonRename.onclick = () => {
      console.log("Rename button click");
      this._elMask.remove();
    }
    dialogFooter.appendChild(dialogFooterPrimaryButtonRename);

    const dialogFooterPrimaryButtonDelete = document.createElement('div');
    dialogFooterPrimaryButtonDelete.classList.add('action-group-dialog-button', 'primary-dialog-button');
    dialogFooterPrimaryButtonDelete.textContent = "Delete Favorite";
    dialogFooterPrimaryButtonDelete.onclick = () => {
      console.log("Delete button click");
      this._elMask.remove();
    }
    dialogFooter.appendChild(dialogFooterPrimaryButtonDelete);

    const dialogFooterSecondayButtonCancel = document.createElement('div');
    dialogFooterSecondayButtonCancel.classList.add('action-group-dialog-button', 'secondary-dialog-button');
    dialogFooterSecondayButtonCancel.textContent = 'Cancel';
    dialogFooterSecondayButtonCancel.onclick = () => this._elMask.remove();
    dialogFooter.appendChild(dialogFooterSecondayButtonCancel);
    this._elGenericDialogContent.appendChild(dialogFooter);

    this._elMask.appendChild(this._elGenericDialogContent);
  }

  //Dialog Heading
  protected getDialogHeading(dialogHeading: string){
    this._elMask = document.createElement('div');
    this._elMask.classList.add('ch5-legacy-media-player-mask');
    this._elContainer.appendChild(this._elMask);
    this._elGenericDialogContent = document.createElement('div');
    this._elGenericDialogContent.classList.add('ch5-legacy-media-player-mask-content-generic');
    const dialogTitle = document.createElement('div');
    dialogTitle.classList.add('generic-dialog-title');
    dialogTitle.textContent = dialogHeading;
    this._elGenericDialogContent.appendChild(dialogTitle);

    //Remove dialog box on click of overlay
    this._elMask.addEventListener('click', (event: MouseEvent) => {
      if(this._elMask){
        if(!this._elGenericDialogContent.contains(event.target as HTMLElement)) {
          this._elMask.remove();
        }
      }
    });
  }

  //Dialog Footer Buttons
  protected getDialogFooter(dialogFor: string){
    const dialogFooter = document.createElement('div');
    dialogFooter.classList.add('generic-dialog-footer');

    const dialogFooterSecondayButton = document.createElement('button');
    dialogFooterSecondayButton.classList.add('generic-dialog-button', 'secondary-dialog-button');
    dialogFooterSecondayButton.textContent = dialogFor === 'generic' ? 'Secondary' : 'Cancel';
    dialogFooterSecondayButton.onclick = () => this._elMask.remove();
    dialogFooter.appendChild(dialogFooterSecondayButton);

    const dialogFooterPrimaryButton = document.createElement('button');
    dialogFooterPrimaryButton.classList.add('generic-dialog-button', 'primary-dialog-button');
    dialogFooterPrimaryButton.textContent = dialogFor === 'generic' ? 'Primary'  : dialogFor === 'favorite' ? 'Ok' : 'Search';
    if(dialogFor != 'generic') {
      dialogFooterPrimaryButton.setAttribute('disabled', 'true');
      dialogFooterPrimaryButton.classList.add('disabled');
    }
    dialogFooterPrimaryButton.onclick = () => {
      console.log("Primary button click");
      this._elMask.remove();
      //needs to be updated based on the proper functionality
    }
    dialogFooter.appendChild(dialogFooterPrimaryButton);
    this._elGenericDialogContent.appendChild(dialogFooter);
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

    this._elContainer.addEventListener('show-favorite-dialog', () => {
      if(this._elMask) {
        this.keyboardInputDialog("keyboardInput", "What would you like to call this favorite?", "favorite");
      }
    });

    this._elContainer.addEventListener('show-search-dialog', () => {
      if(this._elMask) {
        this.keyboardInputDialog("keyboardInput", "Album Search", 'album');
      }
    });

    this._elContainer.addEventListener('show-change-favorite', () => {
      if(this._elMask) {
        this.actionGroupDialog('actionGroup', "What would you like to do?");
      }
    });

    this._elContainer.addEventListener('show-generic-dialog', () => {
      if(this._elMask) {
        this.genericDialog('generic', "This is a long dialog's title that expands on 2 lines.");
      }
    });
  }

  private handleResizeObserver = () => {
    const { width } = this._elContainer.getBoundingClientRect();
    if (width > 800) {
      document.querySelector(".ch5-legacy-media-player-my-music")?.classList.remove("my-music-transition");
    }
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

// import { Ch5Common } from "../ch5-common/ch5-common";
// import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

import { ICh5LegacyMediaPlayerMyMusicAttributes } from './interfaces/i-ch5-legacy-media-player-my-music-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";

export class Ch5LegacyMediaPlayerMyMusic extends Ch5Log implements ICh5LegacyMediaPlayerMyMusicAttributes {

  //#region Variables


  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    receivestateselectedprofile: { direction: "state", stringJoin: 1, contractName: true },

  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

    {
      default: "",
      isSignal: true,
      name: "receiveStateSelectedProfile",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "menuIconReceiveStateSelected",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "menuReceiveStateIconClass",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "menuReceiveStateIconUrl",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "menuIconReceiveStateShow",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "menuIconReceiveStateEnable",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "menuIconSendEventOnClick",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-legacy-media-player-my-music';

  public primaryCssClass = 'ch5-legacy-media-player-my-music';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;

  //#endregion

  //#region Getters and Setters


  public set receiveStateSelectedProfile(value: string) {
    this._ch5Properties.set("receiveStateSelectedProfile", value, null, (newValue: string) => {
      this.handleReceiveStateSelectedProfile();
      console.log(newValue);
    });
  }
  public get receiveStateSelectedProfile(): string {
    return this._ch5Properties.get<string>('receiveStateSelectedProfile');
  }

  public set menuIconReceiveStateSelected(value: string) {
    this._ch5Properties.set("menuIconReceiveStateSelected", value, null, (newValue: boolean) => {
      this.handleMenuIconReceiveStateSelected();
      console.log(newValue);
    });
  }
  public get menuIconReceiveStateSelected(): string {
    return this._ch5Properties.get<string>('menuIconReceiveStateSelected');
  }

  public set menuReceiveStateIconClass(value: string) {
    this._ch5Properties.set("menuReceiveStateIconClass", value, null, (newValue: string) => {
      this.handleMenuReceiveStateIconClass();
      console.log(newValue);
    });
  }
  public get menuReceiveStateIconClass(): string {
    return this._ch5Properties.get<string>('menuReceiveStateIconClass');
  }

  public set menuReceiveStateIconUrl(value: string) {
    this._ch5Properties.set("menuReceiveStateIconUrl", value, null, (newValue: boolean) => {
      this.handleMenuReceiveStateIconUrl();
      console.log(newValue);
    });
  }
  public get menuReceiveStateIconUrl(): string {
    return this._ch5Properties.get<string>('menuReceiveStateIconUrl');
  }

  public set menuIconReceiveStateShow(value: string) {
    this._ch5Properties.set("menuIconReceiveStateShow", value, null, (newValue: boolean) => {
      this.handleMenuIconReceiveStateShow();
      console.log(newValue);
    });
  }
  public get menuIconReceiveStateShow(): string {
    return this._ch5Properties.get<string>('menuIconReceiveStateShow');
  }

  public set menuIconReceiveStateEnable(value: string) {
    this._ch5Properties.set("menuIconReceiveStateEnable", value, null, (newValue: boolean) => {
      this.handleMenuIconReceiveStateEnable();
      console.log(newValue);
    });
  }
  public get menuIconReceiveStateEnable(): string {
    return this._ch5Properties.get<string>('menuIconReceiveStateEnable');
  }

  public set menuIconSendEventOnClick(value: string) {
    this._ch5Properties.set("menuIconSendEventOnClick", value, null, (newValue: boolean) => {
      this.handleMenuIconSendEventOnClick();
      console.log(newValue);
    });
  }
  public get menuIconSendEventOnClick(): string {
    return this._ch5Properties.get<string>('menuIconSendEventOnClick');
  }


  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME, Ch5LegacyMediaPlayerMyMusic.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME, Ch5LegacyMediaPlayerMyMusic);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME);
    this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES);
    this.createInternalHtml();
    this.updateCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Log.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-legacy-media-player-my-music attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5LegacyMediaPlayerMyMusic component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5LegacyMediaPlayerMyMusic);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-legacy-media-player-my-music');
      this.appendChild(this._elContainer);
    }
    this.initAttributes();

    // customElements.whenDefined('ch5-legacy-media-player-my-music').then(() => {
    //   this.componentLoadedEvent(Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME, this.id);
    // });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.unsubscribeFromSignals();
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');
    this._elContainer.innerText="My Music Container";
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }




  protected unsubscribeFromSignals() {
    // super.unsubscribeFromSignals();
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


  private handleReceiveStateSelectedProfile() {
    // Enter your Code here
  }
  private handleMenuIconReceiveStateSelected() {
    // Enter your Code here
  }
  private handleMenuReceiveStateIconClass() {
    // Enter your Code here
  }
  private handleMenuReceiveStateIconUrl() {
    // Enter your Code here
  }
  private handleMenuIconReceiveStateShow() {
    // Enter your Code here
  }
  private handleMenuIconReceiveStateEnable() {
    // Enter your Code here
  }
  private handleMenuIconSendEventOnClick() {
    // Enter your Code here
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    // super.updateCssClasses();
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

Ch5LegacyMediaPlayerMyMusic.registerCustomElement();
Ch5LegacyMediaPlayerMyMusic.registerSignalAttributeTypes();

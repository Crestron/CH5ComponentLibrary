// import { Ch5Common } from "../ch5-common/ch5-common";
// import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5LegacyMediaPlayerMyMusicAttributes } from './interfaces/i-ch5-legacy-media-player-my-music-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5MpIndividualIconButton } from "./ch5-mp-individual-icon-button";

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
  private _header: HTMLElement = {} as HTMLElement;
  private _backMenu: HTMLElement = {} as HTMLElement;
  private _backMenuIcon: HTMLElement = {} as HTMLElement;
  private _headerText: HTMLElement = {} as HTMLElement;
  private _headerLabel: HTMLElement = {} as HTMLElement;
  private _headerSubtitle: HTMLElement = {} as HTMLElement;
  private _sourceSection: HTMLElement = {} as HTMLElement;
  private _sourceMenu: HTMLElement = {} as HTMLElement;
  private _addSourceButton: HTMLElement = {} as HTMLElement;
  private _searchSourceButton: HTMLElement = {} as HTMLElement;
  private _favSourceButton: HTMLElement = {} as HTMLElement;
  private _sourceListButton: HTMLElement = {} as HTMLElement;
  private _sourceSettingsButton: HTMLElement = {} as HTMLElement;
  private _sourceMenuIcon: HTMLElement = {} as HTMLElement;
  private _item: HTMLElement = {} as HTMLElement;
  private _title: HTMLElement = {} as HTMLElement;
  private _subtitle: HTMLElement = {} as HTMLElement;
  private _nowPlayingIcon: HTMLElement = {} as HTMLElement;
  private _backToNowPlaying: HTMLElement = {} as HTMLElement;
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
    this._header = document.createElement("div");
    this._header.className = 'sourceBrowserHeader';

    this._backMenu = document.createElement("button");
    this._backMenu.classList.add('backMenu');
    this._backMenuIcon = document.createElement("i");
    this._backMenuIcon.className = 'fa fa-chevron-left';
    this._backMenu.append(this._backMenuIcon);

    this._headerText = document.createElement("div");
    this._headerText.className = 'headerText';

    this._headerLabel = document.createElement("h1");
    this._headerLabel.className = 'headerLabel';
    this._headerLabel.innerText = "HEADER TEXT";

    this._headerSubtitle = document.createElement("p");
    this._headerSubtitle.className = 'headerSubtitle';
    this._headerSubtitle.innerText = 'SUBTITLE';
    this._headerText.append(this._headerLabel, this._headerSubtitle);

    this._backToNowPlaying = document.createElement("button");
    this._backToNowPlaying.classList.add("backToNowPlaying");
    this._nowPlayingIcon = document.createElement("i");
    this._nowPlayingIcon.classList.add("fa-solid", "fa-signal");
    this._backToNowPlaying.appendChild(this._nowPlayingIcon);
    this._header.append(this._backMenu, this._headerText, this._backToNowPlaying);

    this._sourceSection = document.createElement("div");
    this._sourceSection.className = 'sourceSection';
    this.createLine('Text Line 1', 'Sub Line 1');
    this.createLine('Text Line 2', 'Sub Line 2');
    this.createLine('Text Line 3', 'Sub Line 3');
    this.createLine('Text Line 4', 'Sub Line 4');
    this.createLine('Text Line 5', 'Sub Line 5');
    this.createLine('Text Line 6', 'Sub Line 6');

    this._sourceMenu = document.createElement("div");
    this._sourceMenu.className = 'sourceMenuButtons';
    const actions = [
      { class: 'fa-solid fa-plus', label: 'Add Source', action: 'add' },
      { class: 'fa-solid fa-search', label: 'Search Source', action: 'search' },
      { class: 'fa-solid fa-icons', label: 'Favorites', action: 'fav' },
      { class: 'fa-solid fa-music', label: 'Source List', action: 'music list' },
      { class: 'fa-solid fa-gear', label: 'Settings', action: 'settings' },
      { class: 'fa-solid fa-ellipsis', label: 'More Options', action: 'More Options' },
    ];
    actions.forEach(action => {
      const button = new Ch5MpIndividualIconButton();
      button.setAttribute('iconClass', action.class);
      button.setAttribute('aria-label', action.label);
      this._sourceMenu.appendChild(button);
    });
    this._elContainer.append(this._header, this._sourceSection, this._sourceMenu);
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

  private createLine(text: string, subText: string) {

    this['_item'] = document.createElement('div');
    this['_item'].className = 'list-item';
    this['_title'] = document.createElement('div');
    this['_title'].className = 'sourceTitle';
    this['_title'].textContent = text;
    this['_subtitle'] = document.createElement('div');
    this['_subtitle'].className = 'sourceSubtitle';
    this['_subtitle'].textContent = subText;
    this['_item'].appendChild(this['_title']);
    this['_item'].appendChild(this['_subtitle']);
    this._sourceSection.appendChild(this['_item']);

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

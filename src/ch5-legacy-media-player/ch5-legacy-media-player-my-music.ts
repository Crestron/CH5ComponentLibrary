import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";
import { TCh5LegacyMediaPlayerMyMusicContentItem } from "./interfaces/t-ch5-legacy-media-player.ts";
import { subscribeState } from "../ch5-core/index.ts";

export class Ch5LegacyMediaPlayerMyMusic extends Ch5Log {

  //#region Variables

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {};

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [];

  public static readonly ELEMENT_NAME = 'ch5-legacy-media-player-my-music';

  public primaryCssClass = 'ch5-legacy-media-player-my-music';

  private _ch5Properties: Ch5Properties;
  private _myMusicContainer: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderSection: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderBackButton: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderTitle: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderTitleText: HTMLElement = {} as HTMLElement;
  private _myMusicheaderSubtitle: HTMLElement = {} as HTMLElement;
  private _myMusicContentSection: HTMLElement = {} as HTMLElement;
  private _myMusicFooterSection: HTMLElement = {} as HTMLElement;
  private _myMusicContentItem: HTMLElement = {} as HTMLElement;
  private _myMusicContentItemTitle: HTMLElement = {} as HTMLElement;
  private _myMusicContentItemSubtitle: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderNowPlayingButton: HTMLElement = {} as HTMLElement;
  private myMusicData: any;

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
    this.createMyMusic();
    this.updateCssClass();
    subscribeState('o', 'myMusicData', ((data: any) => {
      this.myMusicData = data;
      console.log('My Music Data', this.myMusicData);
    }));
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
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.unsubscribeFromSignals();
    this.logger.stop();
  }

  public createInternalHtml() {
    return this._myMusicContainer;
  }

  protected createMyMusic() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._myMusicContainer = document.createElement('div');
    this._myMusicContainer.classList.add("ch5-legacy-media-player-my-music");

    this._myMusicHeaderSection = document.createElement("div");
    this._myMusicHeaderSection.className = 'my-music-header';

    this._myMusicHeaderBackButton = new Ch5LegacyMediaPlayerIconButton();
    this._myMusicHeaderBackButton.setAttribute('iconClass', "mp-icon mp-chevron-left");
    this._myMusicHeaderBackButton.classList.add('my-music-header-back-button');

    this._myMusicHeaderTitle = document.createElement("div");
    this._myMusicHeaderTitle.className = 'my-music-header-title';

    this._myMusicHeaderTitleText = document.createElement("div");
    this._myMusicHeaderTitleText.className = 'my-music-header-title-text';
    this._myMusicHeaderTitleText.innerText = "HEADER TEXT";

    this._myMusicheaderSubtitle = document.createElement("div");
    this._myMusicheaderSubtitle.className = 'my-music-header-subtitle';
    this._myMusicheaderSubtitle.innerText = 'SUBTITLE';
    this._myMusicHeaderTitle.append(this._myMusicHeaderTitleText, this._myMusicheaderSubtitle);

    this._myMusicHeaderNowPlayingButton = new Ch5LegacyMediaPlayerIconButton();
    this._myMusicHeaderNowPlayingButton.setAttribute('iconClass', "mp-icon mp-animated-bar");
    this._myMusicHeaderNowPlayingButton.classList.add("my-music-header-now-playing-button");
    this._myMusicHeaderSection.append(this._myMusicHeaderBackButton, this._myMusicHeaderTitle, this._myMusicHeaderNowPlayingButton);

    this._myMusicContentSection = document.createElement("div");
    this._myMusicContentSection.className = 'my-music-content';
    const myMusicContentList: TCh5LegacyMediaPlayerMyMusicContentItem[] = [
      { titleText: 'Text Line 1', subTitleText: 'Sub Line 1', id: '1' },
      { titleText: 'Text Line 2', subTitleText: 'Sub Line 2', id: '2' },
      { titleText: 'Text Line 3', subTitleText: 'Sub Line 3', id: '3' },
      { titleText: 'Text Line 4', subTitleText: 'Sub Line 4', id: '4' },
      { titleText: 'Text Line 5', subTitleText: 'Sub Line 5', id: '5' },
      { titleText: 'Text Line 6', subTitleText: 'Sub Line 6', id: '6' }
    ];
    for (const item of myMusicContentList) {
      this.createLine(item.titleText, item.subTitleText, item.id);
    }

    this._myMusicFooterSection = document.createElement("div");
    this._myMusicFooterSection.className = 'my-music-footer';
    const actions = [
      { class: 'mp-icon mp-plus-circle', clickAction: this.onFavorite },
      { class: 'mp-icon mp-search-lg', clickAction: this.onSearch },
      { class: 'mp-icon mp-music-list-quick', clickAction: this.onChangeFavorite },
      { class: 'mp-icon mp-music-list', clickAction: this.onGeneric },
      { class: 'mp-icon mp-settings', clickAction: this.onGeneric },
      { class: 'mp-icon mp-dots-horizontal', clickAction: this.onGeneric },
    ];
    actions.forEach(action => {
      const button = new Ch5LegacyMediaPlayerIconButton();
      button.setAttribute('iconClass', action.class);
      button.onclick = action.clickAction ? (() => action.clickAction!()) : null;
      this._myMusicFooterSection.appendChild(button);
    });
    this._myMusicContainer.append(this._myMusicHeaderSection, this._myMusicContentSection, this._myMusicFooterSection);
    this.logger.stop();
  }

  protected onFavorite = () => {
    this._myMusicContainer.dispatchEvent(new CustomEvent("show-favorite-dialog", { bubbles: true, composed: true }));
    console.log("Favorite Click");
  }

  protected onSearch = () => {
    this._myMusicContainer.dispatchEvent(new CustomEvent("show-search-dialog", { bubbles: true, composed: true }));
    console.log("Search Click");
  }

  protected onChangeFavorite = () => {
    this._myMusicContainer.dispatchEvent(new CustomEvent("show-change-favorite", { bubbles: true, composed: true }));
    console.log("Music List Quick Click");
  }

  protected onGeneric = () => {
    this._myMusicContainer.dispatchEvent(new CustomEvent("show-generic-dialog", { bubbles: true, composed: true }));
    console.log("Music List Click");
  }

  protected createLine(text: string, subText: string, itemId: string) {
    this._myMusicContentItem = document.createElement('div');
    this._myMusicContentItem.className = 'my-music-content-item';
    this._myMusicContentItemTitle = document.createElement('div');
    this._myMusicContentItemTitle.className = 'my-music-content-item-title';
    this._myMusicContentItemTitle.textContent = text;
    this._myMusicContentItemSubtitle = document.createElement('div');
    this._myMusicContentItemSubtitle.className = 'my-music-content-item-subtitle';
    this._myMusicContentItemSubtitle.textContent = subText;
    this._myMusicContentItem.onclick = () => {
      console.log("content Item clicked");
      this._myMusicContentSection.textContent = "";
      const myMusicContentList: TCh5LegacyMediaPlayerMyMusicContentItem[] = [];
      for (let i = 0; i < parseInt(itemId); i++) {
        myMusicContentList.push({ titleText: 'Text Line 1 ' + itemId, subTitleText: 'Sub Line 1 ' + itemId, id: `${i + 1}` },);
      }
      for (const item of myMusicContentList) {
        this.createLine(item.titleText, item.subTitleText, item.id);
      }
    }

    this._myMusicContentItem.appendChild(this._myMusicContentItemTitle);
    this._myMusicContentItem.appendChild(this._myMusicContentItemSubtitle);
    this._myMusicContentSection.appendChild(this._myMusicContentItem);
  }
  //#endregion

  //#region Protected / Private Methods
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

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    // super.updateCssClasses();
    this.logger.stop();
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  //#endregion
}

Ch5LegacyMediaPlayerMyMusic.registerCustomElement();
Ch5LegacyMediaPlayerMyMusic.registerSignalAttributeTypes();

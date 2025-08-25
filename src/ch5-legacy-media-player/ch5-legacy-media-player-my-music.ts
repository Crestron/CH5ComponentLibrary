import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";

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
  private _myMusicHeaderBackButtonIcon: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderTitle: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderTitleText: HTMLElement = {} as HTMLElement;
  private _myMusicheaderSubtitle: HTMLElement = {} as HTMLElement;
  private _myMusicContentSection: HTMLElement = {} as HTMLElement;
  private _myMusicFooterSection: HTMLElement = {} as HTMLElement;
  private _myMusicContentItem: HTMLElement = {} as HTMLElement;
  private _myMusicContentItemTitle: HTMLElement = {} as HTMLElement;
  private _myMusicContentItemSubtitle: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderNowPlayingButtonIcon: HTMLElement = {} as HTMLElement;
  private _myMusicHeaderNowPlayingButton: HTMLElement = {} as HTMLElement;
  
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
    this._myMusicHeaderSection.className = 'my-music-header-section';

    this._myMusicHeaderBackButton = document.createElement("button");
    this._myMusicHeaderBackButton.classList.add('my-music-header-back-button');
    this._myMusicHeaderBackButtonIcon = document.createElement("i");
    this._myMusicHeaderBackButtonIcon.className = 'fa fa-chevron-left';
    this._myMusicHeaderBackButton.append(this._myMusicHeaderBackButtonIcon);

    this._myMusicHeaderTitle = document.createElement("div");
    this._myMusicHeaderTitle.className = 'my-music-header-title';

    this._myMusicHeaderTitleText = document.createElement("div");
    this._myMusicHeaderTitleText.className = 'my-music-header-title-text';
    this._myMusicHeaderTitleText.innerText = "HEADER TEXT";

    this._myMusicheaderSubtitle = document.createElement("div");
    this._myMusicheaderSubtitle.className = 'my-music-header-subtitle';
    this._myMusicheaderSubtitle.innerText = 'SUBTITLE';
    this._myMusicHeaderTitle.append(this._myMusicHeaderTitleText, this._myMusicheaderSubtitle);

    this._myMusicHeaderNowPlayingButton = document.createElement("button");
    this._myMusicHeaderNowPlayingButton.classList.add("my-music-header-now-playing-button");
    this._myMusicHeaderNowPlayingButtonIcon = document.createElement("i");
    this._myMusicHeaderNowPlayingButtonIcon.classList.add("fa-solid", "fa-signal");
    this._myMusicHeaderNowPlayingButton.appendChild(this._myMusicHeaderNowPlayingButtonIcon);
    this._myMusicHeaderSection.append(this._myMusicHeaderBackButton, this._myMusicHeaderTitle, this._myMusicHeaderNowPlayingButton);

    this._myMusicContentSection = document.createElement("div");
    this._myMusicContentSection.className = 'my-music-content-section';
    this.createLine('Text Line 1', 'Sub Line 1');
    this.createLine('Text Line 2', 'Sub Line 2');
    this.createLine('Text Line 3', 'Sub Line 3');
    this.createLine('Text Line 4', 'Sub Line 4');
    this.createLine('Text Line 5', 'Sub Line 5');
    this.createLine('Text Line 6', 'Sub Line 6');

    this._myMusicFooterSection = document.createElement("div");
    this._myMusicFooterSection.className = 'my-music-footer-section';
    const actions = [
      { class: 'fa-solid fa-plus' },
      { class: 'fa-solid fa-search' },
      { class: 'fa-solid fa-icons' },
      { class: 'fa-solid fa-music' },
      { class: 'fa-solid fa-gear' },
      { class: 'fa-solid fa-ellipsis' },
    ];
    actions.forEach(action => {
      const button = new Ch5LegacyMediaPlayerIconButton();
      button.setAttribute('iconClass', action.class);
      this._myMusicFooterSection.appendChild(button);
    });
    this._myMusicContainer.append(this._myMusicHeaderSection, this._myMusicContentSection, this._myMusicFooterSection);
    this.logger.stop();
  }

  protected createLine(text: string, subText: string) {
    this._myMusicContentItem = document.createElement('div');
    this._myMusicContentItem.className = 'my-music-content-item';
    this._myMusicContentItemTitle = document.createElement('div');
    this._myMusicContentItemTitle.className = 'my-music-content-item-title';
    this._myMusicContentItemTitle.textContent = text;
    this._myMusicContentItemSubtitle = document.createElement('div');
    this._myMusicContentItemSubtitle.className = 'my-music-content-item-subtitle';
    this._myMusicContentItemSubtitle.textContent = subText;
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

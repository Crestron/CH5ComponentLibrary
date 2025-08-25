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
  private _header: HTMLElement = {} as HTMLElement;
  private _backMenu: HTMLElement = {} as HTMLElement;
  private _backMenuIcon: HTMLElement = {} as HTMLElement;
  private _headerText: HTMLElement = {} as HTMLElement;
  private _headerLabel: HTMLElement = {} as HTMLElement;
  private _headerSubtitle: HTMLElement = {} as HTMLElement;
  private _sourceSection: HTMLElement = {} as HTMLElement;
  private _sourceMenu: HTMLElement = {} as HTMLElement;
  private _item: HTMLElement = {} as HTMLElement;
  private _title: HTMLElement = {} as HTMLElement;
  private _subtitle: HTMLElement = {} as HTMLElement;
  private _nowPlayingIcon: HTMLElement = {} as HTMLElement;
  private _backToNowPlaying: HTMLElement = {} as HTMLElement;
  
  //#endregion

  //#region Getters and Setters

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
      this._sourceMenu.appendChild(button);
    });
    this._myMusicContainer.append(this._header, this._sourceSection, this._sourceMenu);
    this.logger.stop();
  }

  protected createLine(text: string, subText: string) {
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

import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";
import { MusicPlayerLib, subscribeState } from "../ch5-core/index.ts";
// import { debounce } from "lodash";
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
  private musicPlayerLibInstance: MusicPlayerLib;

  private maxItemsToDisplay = 30;
  private loadItemsCount = 30;
  private itemData:any[]= [];
  private printedIndex = 0;
  private scrollPosition = 50;

  private myMusicDemoData = {
    Title: "HEADER TEXT",
    Subtitle: "SUBTITLE",
    IsMenuAvailable: true,
    ListItemIcons: true,
    ListSpecificFunctions: [
      "Create",
      "Find",
      "QuickList",
      "Advanced",
      "BackToTop",
      "Favorites"
    ],
    Sorted: "none",
    MenuData: [
      {
        L1: "Text Line 1",
        L2: "Sub Line 1",
      },
      {
        L1: "Text Line 2",
        L2: "",
      },
      {
        L1: "Text Line 3",
        L2: "Sub Line 3",
      },
      {
        L1: "Text Line 4",
        L2: "",
      }
    ]
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

  public constructor(musicPlayerLib: MusicPlayerLib) {
    super();
    this.musicPlayerLibInstance = musicPlayerLib;
    this.logger.start('constructor()', Ch5LegacyMediaPlayerMyMusic.ELEMENT_NAME);
    this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerMyMusic.COMPONENT_PROPERTIES);
    this._myMusicContainer = document.createElement('div');
    this.createDefaultMyMusic();
    this.updateCssClass();
    subscribeState('b', 'demoMode', ((value: boolean) => {
      subscribeState('o', 'myMusicData', ((data: any) => {
        if (value) {
          this.createMyMusic();
          this.myMusicData = this.myMusicDemoData;
          if (this.myMusicData && Object.keys(this.myMusicData).length > 0) this.apiChanges();
        } else if (data && Object.keys(data).length > 0) {
          this.myMusicData = data;
          if(this.myMusicData && this.myMusicData['MenuData'] && this.myMusicData['MenuData'].length <= this.musicPlayerLibInstance.maxReqItems){
            this.createMyMusic();
            this.printedIndex =0;
          }
          this.itemData = data['MenuData'] ? [...data['MenuData']] : [];
          console.log('My Music Data', this.myMusicData);
          if (this.myMusicData && Object.keys(this.myMusicData).length > 0 && this.myMusicData['MenuData'] && Object.keys(this.myMusicData['MenuData']).length > 0) this.apiChanges();
        } else {
          this.createDefaultMyMusic();
        }
        this.updateCssClass();
      }))
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

  //default my music
  protected createDefaultMyMusic() {
    if (this._myMusicContainer) {
      this._myMusicContainer.className = "";
      this._myMusicContainer.innerHTML = "";
    }
    //this._myMusicContainer = document.createElement('div');
    this._myMusicContainer.classList.add("ch5-legacy-media-player-my-music-default");
    const defaultHeaderContainer = document.createElement('div');
    defaultHeaderContainer.classList.add('default-header-container');
    const defaultBackIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultBackIcon.setAttribute('iconClass', "mp-icon mp-chevron-left");
    const headerTitleNone = document.createElement('div');
    headerTitleNone.classList.add('header-title-none');
    headerTitleNone.textContent = '— —';
    const defaultMusicIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultMusicIcon.setAttribute('iconClass', "mp-logo mp-animated-bar");
    defaultHeaderContainer.append(defaultBackIcon, headerTitleNone, defaultMusicIcon);
    const defaultItemsContainer = document.createElement("div");
    defaultItemsContainer.classList.add('default-item-container');
    const defaultItem = document.createElement('div');
    defaultItem.classList.add('default-item');
    defaultItem.textContent = 'No Content';
    defaultItemsContainer.append(defaultItem);
    const defaultFooterContainer = document.createElement('div');
    defaultFooterContainer.classList.add('default-footer-container');
    const defaultCreateIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultCreateIcon.setAttribute('iconClass', "mp-icon mp-plus-circle");
    const defaultFindIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultFindIcon.setAttribute('iconClass', "mp-icon mp-search-lg");
    defaultFooterContainer.append(defaultCreateIcon, defaultFindIcon);
    this._myMusicContainer.append(defaultHeaderContainer, defaultItemsContainer, defaultFooterContainer);
  }

  protected createMyMusic() {
    if (this._myMusicContainer) {
      this._myMusicContainer.className = "";
      this._myMusicContainer.innerHTML = "";
    }
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._myMusicContainer.classList.add("ch5-legacy-media-player-my-music");

    this._myMusicHeaderSection = document.createElement("div");
    this._myMusicHeaderSection.className = 'my-music-header';
    // this.myMusicHeader(true, "HEADER TEXT", "SUBTITLE");


    this._myMusicContentSection = document.createElement("div");
    this._myMusicContentSection.className = 'my-music-content';
    // for (let i = 1; i <= 6; i++) {
    //   this.createLine(`Text Line ${i}`, `Sub Line ${i}`, `item ${i}`, i + 1);
    // }

    let lastScrollTop = 0;
    this._myMusicContentSection.onscroll = () => {
      const scrollTop = window.pageYOffset || this._myMusicContentSection.scrollTop;;
      const scrollHeight: number = this._myMusicContentSection.scrollHeight;
      const clientHeight = this._myMusicContentSection.clientHeight || window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (scrollTop > lastScrollTop && this.myMusicData['MenuData'].length > this.loadItemsCount) {
        if (distanceFromBottom <= this.scrollPosition) {
          
          // delete 1st element and push element in the end
          const list = this._myMusicContentSection;
          const childrenArray = Array.from(list.children);
          const firstChild = childrenArray[0];
          if (firstChild) {
            list.removeChild(firstChild);
          }

          this.createLine(this.loadItemsCount, 'end')
          this.loadItemsCount = this.loadItemsCount + 1;
        }
      } else if (scrollTop < lastScrollTop && this.loadItemsCount > this.maxItemsToDisplay) {
        if (scrollTop <= this.scrollPosition) {
          
          // delete 1st element and push element in the end
          const list = this._myMusicContentSection;
          const childrenArray = Array.from(list.children);

          if (childrenArray.length >= this.maxItemsToDisplay) {
            list.removeChild(childrenArray[childrenArray.length - 1]);
          }

          this.loadItemsCount -= 1;
          this.createLine(this.loadItemsCount - this.maxItemsToDisplay, 'start');
        }
      }
      lastScrollTop = Math.max(scrollTop, 0);      
    };

    this._myMusicFooterSection = document.createElement("div");
    this._myMusicFooterSection.className = 'my-music-footer';
    // this.myMusicMenuIconSection(["Create", "Find", "QuickList", "Advanced", "BackToTop", "Favorites"])

    this._myMusicContainer.append(this._myMusicHeaderSection, this._myMusicContentSection, this._myMusicFooterSection);
    this.logger.stop();
  }


  protected createLine(index: number, position='end') {
    console.log("creating line for index", index, this.myMusicData['MenuData'], this.myMusicData['MenuData'].length);
    if(index+1 >= this.myMusicData['MenuData'].length){
      this.musicPlayerLibInstance.getItemData(true);
    }
    if(index > 0 && this.printedIndex === index) return;
    this.printedIndex = index;
    
    if(!this.myMusicData['MenuData'] || !this.myMusicData['MenuData'][index]) return;

    const text = this.myMusicData['MenuData'][index]['L1'];
    const subText = this.myMusicData['MenuData'][index]['L2'];
    const itemId = this.myMusicData['MenuData'][index]['Id'];

    this._myMusicContentItem = document.createElement('div');
    this._myMusicContentItem.className = 'my-music-content-item';
    this._myMusicContentItem.id = itemId;
    this._myMusicContentItemTitle = document.createElement('div');
    this._myMusicContentItemTitle.className = 'my-music-content-item-title';
    this._myMusicContentItemTitle.textContent = text;
    this._myMusicContentItemSubtitle = document.createElement('div');
    this._myMusicContentItemSubtitle.className = 'my-music-content-item-subtitle';
    this._myMusicContentItemSubtitle.textContent = subText;
    // this._myMusicContentItemSubtitle.style.visibility = subText ? 'visible' : 'hidden';

    if (this._myMusicHeaderTitleText.innerText === 'Favorites') {
      let holdTimer: number | null = null;
      let isHeld = false;

      this._myMusicContentItem.addEventListener('pointerdown', () => {
        isHeld = false;
        holdTimer = window.setTimeout(() => {
          isHeld = true;
          this.musicPlayerLibInstance.myMusicEvent('PressAndHold', index + 1); // PressAndHold action
        }, 3000); // 3 seconds
      });

      this._myMusicContentItem.addEventListener('pointerup', () => {
        if (holdTimer !== null) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      });

      this._myMusicContentItem.addEventListener('click', () => { // Click Action
        if (!isHeld) {
          this.musicPlayerLibInstance.myMusicEvent('Select', index + 1);
        }
      });
    } else {
      this._myMusicContentItem.onclick = () => {
        this.musicPlayerLibInstance.myMusicEvent('Select', index + 1);
      }
    }

    this._myMusicContentItem.appendChild(this._myMusicContentItemTitle);
    this._myMusicContentItem.appendChild(this._myMusicContentItemSubtitle);
    this._myMusicContentSection.appendChild(this._myMusicContentItem);
    
    const list = this._myMusicContentSection;
    if (position === 'start') {
      list.insertBefore(this._myMusicContentItem, list.firstChild);
    } else {
      list.appendChild(this._myMusicContentItem);
    }
    
  }

  protected myMusicHeader(backButton: boolean, myMusicHeaderTitleText: string, myMusicheaderSubtitle: string) {
    if (backButton) {
      this._myMusicHeaderBackButton = new Ch5LegacyMediaPlayerIconButton();
      this._myMusicHeaderBackButton.setAttribute('iconClass', "mp-icon mp-chevron-left");
      this._myMusicHeaderBackButton.classList.add('my-music-header-back-button');
      this._myMusicHeaderBackButton.onclick = () => {
        this.musicPlayerLibInstance.myMusicEvent('Back');
      }
      this._myMusicHeaderSection.prepend(this._myMusicHeaderBackButton);
    }

    this._myMusicHeaderTitle = document.createElement("div");
    this._myMusicHeaderTitle.className = 'my-music-header-title';

    this._myMusicHeaderTitleText = document.createElement("div");
    this._myMusicHeaderTitleText.className = 'my-music-header-title-text';
    this._myMusicHeaderTitleText.innerText = myMusicHeaderTitleText;
    this._myMusicheaderSubtitle = document.createElement("div");
    this._myMusicheaderSubtitle.className = 'my-music-header-subtitle';
    this._myMusicheaderSubtitle.innerText = myMusicheaderSubtitle;
    this._myMusicheaderSubtitle.style.visibility = myMusicheaderSubtitle ? 'visible' : 'hidden';

    this._myMusicHeaderTitle.append(this._myMusicHeaderTitleText, this._myMusicheaderSubtitle);

    this._myMusicHeaderNowPlayingButton = new Ch5LegacyMediaPlayerIconButton();
    this._myMusicHeaderNowPlayingButton.setAttribute('iconClass', "mp-logo mp-animated-bar");
    this._myMusicHeaderNowPlayingButton.classList.add("my-music-header-now-playing-button");
    this._myMusicHeaderNowPlayingButton.onclick = () => {
      this._myMusicContainer.classList.remove("my-music-transition");
    };
    this._myMusicHeaderSection.append(this._myMusicHeaderTitle, this._myMusicHeaderNowPlayingButton);
  }

  protected myMusicMenuIconSection(myMusicMenuIconArray: Array<string>) {
    const actions = [
      { class: 'mp-icon mp-plus-circle', name: 'Create' },
      { class: 'mp-icon mp-search-lg', name: 'Find' },
      { class: 'mp-icon mp-music-note-list', name: 'QuickList' },
      { class: 'mp-icon mp-settings', name: 'Advanced' },
      { class: 'mp-icon mp-music-list-home', name: 'BackToTop' },
      { class: 'mp-icon mp-music-list-favorites', name: 'Favorites' },
      { class: 'mp-icon mp-play-multi-square', name: 'PlayAll' },
    ];
    if (myMusicMenuIconArray?.length) {
      actions.forEach(action => {
        for (let i = 0; i < myMusicMenuIconArray.length; i++) {
          const item = myMusicMenuIconArray[i];
          if (item === action.name) {
            const button = new Ch5LegacyMediaPlayerIconButton();
            button.setAttribute('iconClass', action.class);
            button.id = item;
            button.onclick = () => {
              this.musicPlayerLibInstance.myMusicEvent(item);
            };
            this._myMusicFooterSection.appendChild(button);
          }
        };
      });
    }
  }

  private displayVisibleOnlyItems() {
    if(this.myMusicData['ItemCnt'] == this.myMusicData['MenuData'].length) {
      this.loadItemsCount = this.myMusicData['MenuData'].length;
    }
    console.log("displayVisibleOnlyItems");
    console.log("loadItemsCount -------->>>", this.loadItemsCount);
    console.log('this.itemData-------->>>>', this.itemData);

    if (this.myMusicData && this.myMusicData.MenuData && this.myMusicData['MenuData'].length <= this.musicPlayerLibInstance.maxReqItems) {
      for (let index = 0; index < this.loadItemsCount; index++) {
        this.createLine(index);
      }
    } else {
      this.createLine(this.printedIndex);
      this.loadItemsCount = this.printedIndex;
    }
  }
  
  protected apiChanges() {
    Array.from(this._myMusicHeaderSection.childNodes).forEach((child) => child.remove());
    // Array.from(this._myMusicContentSection.childNodes).forEach((child) => child.remove());
    Array.from(this._myMusicFooterSection.childNodes).forEach((child) => child.remove());

    this.myMusicHeader(this.myMusicData.IsMenuAvailable, this.myMusicData.Title, this.myMusicData.Subtitle);
    this.displayVisibleOnlyItems();
    if(this.myMusicData['MenuData'].length > this.maxItemsToDisplay && this.myMusicData['MenuData'].length > this.musicPlayerLibInstance.maxReqItems){
      // const scrollHeight: number = this._myMusicContentSection.scrollHeight;
      this._myMusicContentSection.scrollTop = this._myMusicContentSection.scrollTop - this.scrollPosition;
    }
    this.myMusicMenuIconSection(this.myMusicData.ListSpecificFunctions);
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

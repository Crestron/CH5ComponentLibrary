import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";
import { MusicPlayerLib, publishEvent, subscribeState } from "../ch5-core/index.ts";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log.ts";

export class Ch5LegacyMediaPlayerMyMusic {

  //#region Variables
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
  private demoModeValue: boolean = false;

  private readonly MAXIMUM_ROWS_TO_SHOW = 15;
  private loadItemsCount = 15;
  private printedIndex = 0;
  private scrollPosition = 100;

  private MY_MUSIC_DEMO_DATA = {
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
  private logger: Ch5CommonLog;

  //#endregion

  //#region Component Lifecycle

  public constructor(musicPlayerLib: MusicPlayerLib) {
    this.logger = new Ch5CommonLog(false, false, "LEGACY_MEDIA_PLAYER:MY_MUSIC");
    this.logger.start('constructor()', "LEGACY_MEDIA_PLAYER:MY_MUSIC");
    this.musicPlayerLibInstance = musicPlayerLib;
    this._myMusicContainer = this.createElement('div');
    this.createDefaultMyMusic();

    subscribeState('o', 'myMusicData', ((data: any) => {
      if (!this.demoModeValue) {
        this.loadItemsCount = this.MAXIMUM_ROWS_TO_SHOW;
        if (data && Object.keys(data).length > 0) {
          this.myMusicData = data;
          if (this.myMusicData && this.myMusicData['MenuData'] && this.myMusicData['MenuData'].length <= this.musicPlayerLibInstance.maxReqItems) {
            this.createMyMusic();
            this.printedIndex = 0;
          }
          this.logger.log('My Music Data', this.myMusicData);
          if (this.myMusicData['MenuData'] && Object.keys(this.myMusicData['MenuData']).length > 0) this.apiChanges();
        } else {
          this.createDefaultMyMusic();
        }
      }
    }));

    subscribeState('b', 'showMyMusicComponent', ((value: boolean) => {
      if (value) {
        this._myMusicContainer.classList.add("my-music-transition");
      } else {
        if (this._myMusicContainer && this._myMusicContainer.classList.contains("my-music-transition")) {
          this._myMusicContainer.classList.remove("my-music-transition");
        }
      }
    }));
  }

  public createInternalHtml() {
    return this._myMusicContainer;
  }

  public handleDemoMode(demoMode: boolean) {
    if (demoMode) {
      this.createMyMusic();
      this.myMusicData = this.MY_MUSIC_DEMO_DATA;
      this.apiChanges();
    }
  }

  //default my music
  protected createDefaultMyMusic() {
    if (this._myMusicContainer) {
      this._myMusicContainer.className = "";
      this._myMusicContainer.innerHTML = "";
    }
    this._myMusicContainer.classList.add("ch5-legacy-media-player--my-music-default");
    const defaultHeaderContainer = this.createElement('div', ['default-header-container']);
    const defaultBackIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultBackIcon.setAttribute('iconClass', "mp-icon mp-chevron-left");
    const headerTitleNone = this.createElement('div', ['header-title-none'], '— —');
    const defaultMusicIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultMusicIcon.setAttribute('iconClass', "mp-logo mp-animated-bar");
    defaultHeaderContainer.append(defaultBackIcon, headerTitleNone, defaultMusicIcon);
    const defaultItemsContainer = this.createElement("div", ['default-item-container']);
    const defaultItem = this.createElement('div', ['default-item'], 'No Content');
    defaultItemsContainer.append(defaultItem);
    const defaultFooterContainer = this.createElement('div', ['default-footer-container']);
    const defaultCreateIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultCreateIcon.setAttribute('iconClass', "mp-icon mp-plus-circle");
    const defaultFindIcon = new Ch5LegacyMediaPlayerIconButton();
    defaultFindIcon.setAttribute('iconClass', "mp-icon mp-search-lg");
    defaultFooterContainer.append(defaultCreateIcon, defaultFindIcon);
    this._myMusicContainer.append(defaultHeaderContainer, defaultItemsContainer, defaultFooterContainer);
  }

  protected createMyMusic() {
    if (this._myMusicContainer) {
      Array.from(this._myMusicContainer.childNodes).forEach((child) => child.remove());
      if (this._myMusicContainer.classList.contains("ch5-legacy-media-player--my-music-default"))
        this._myMusicContainer.classList.remove('ch5-legacy-media-player--my-music-default');

    }
    this.logger.start('createInternalHtml()');
    this._myMusicContainer.classList.add("ch5-legacy-media-player--my-music");

    this._myMusicHeaderSection = this.createElement("div", ['my-music-header']);
    this._myMusicContentSection = this.createElement("div", ['my-music-content']);

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
      } else if (scrollTop < lastScrollTop && this.loadItemsCount > this.MAXIMUM_ROWS_TO_SHOW) {
        if (scrollTop <= this.scrollPosition) {

          // delete last element and push element in the start of the list
          const list = this._myMusicContentSection;
          const childrenArray = Array.from(list.children);

          if (childrenArray.length >= this.MAXIMUM_ROWS_TO_SHOW) {
            list.removeChild(childrenArray[childrenArray.length - 1]);
          }

          this.loadItemsCount -= 1;
          this.createLine(this.loadItemsCount - this.MAXIMUM_ROWS_TO_SHOW, 'start');
        }
      }
      lastScrollTop = Math.max(scrollTop, 0);

      if (this.myMusicData['MenuData'].length - 1 > this.musicPlayerLibInstance.maxReqItems) {
        if (this.myMusicData['MenuData'].length - 1 > this.printedIndex && distanceFromBottom == 0) {
          this._myMusicContentSection.scrollTop = this._myMusicContentSection.scrollTop - this.scrollPosition;
        } else if (scrollTop == 0 && this.printedIndex !== 0) {
          this._myMusicContentSection.scrollTop = this.scrollPosition;
        }
      }
    };

    this._myMusicFooterSection = this.createElement("div", ['my-music-footer']);
    this._myMusicContainer.append(this._myMusicHeaderSection, this._myMusicContentSection, this._myMusicFooterSection);
    this.logger.stop();
  }

  protected createLine(index: number, position = 'end') {
    if (index + 1 >= this.myMusicData['MenuData'].length) {
      this.musicPlayerLibInstance.getItemData(true);
    }
    if (index > 0 && this.printedIndex === index) return;
    this.printedIndex = index;

    if (!this.myMusicData['MenuData'] || !this.myMusicData['MenuData'][index]) return;

    const text = this.myMusicData['MenuData'][index]['L1'];
    const subText = this.myMusicData['MenuData'][index]['L2'];
    const itemId = this.myMusicData['MenuData'][index]['Id'];

    this._myMusicContentItem = this.createElement('div', ['my-music-content-item']);
    this._myMusicContentItem.id = itemId;
    this._myMusicContentItemTitle = this.createElement('div', ['my-music-content-item-title'], this.musicPlayerLibInstance.replaceLanguageChars(text));
    this._myMusicContentItemSubtitle = this.createElement('div', ['my-music-content-item-subtitle'], this.musicPlayerLibInstance.replaceLanguageChars(subText));

    if (this._myMusicHeaderTitleText.innerText === 'Favorites') {
      let holdTimer: number | null = null;
      let isHeld = false;

      this._myMusicContentItem.addEventListener('pointerdown', () => {
        isHeld = false;
        holdTimer = window.setTimeout(() => {
          isHeld = true;
          this.musicPlayerLibInstance.myMusicEvent('PressAndHold', index + 1); // PressAndHold action
        }, 2000); // 2 seconds
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

    this._myMusicHeaderTitle = this.createElement("div", ['my-music-header-title']);
    this._myMusicHeaderTitleText = this.createElement("div", ['my-music-header-title-text'], this.musicPlayerLibInstance.replaceLanguageChars(myMusicHeaderTitleText));
    this._myMusicheaderSubtitle = this.createElement("div", ['my-music-header-subtitle'], this.musicPlayerLibInstance.replaceLanguageChars(myMusicheaderSubtitle));
    //this._myMusicheaderSubtitle.style.visibility = this.musicPlayerLibInstance.replaceLanguageChars(myMusicheaderSubtitle) ? 'visible' : 'hidden';
    if (myMusicheaderSubtitle) {
      this._myMusicheaderSubtitle.classList.remove('ch5-hide-vis');
      this._myMusicheaderSubtitle.classList.add('ch5-visible-vis');
    } else {
      this._myMusicheaderSubtitle.classList.remove('ch5-visible-vis');
      this._myMusicheaderSubtitle.classList.add('ch5-hide-vis');
    }
    this._myMusicHeaderTitle.append(this._myMusicHeaderTitleText, this._myMusicheaderSubtitle);

    this._myMusicHeaderNowPlayingButton = new Ch5LegacyMediaPlayerIconButton();
    this._myMusicHeaderNowPlayingButton.setAttribute('iconClass', "mp-logo mp-animated-bar");
    this._myMusicHeaderNowPlayingButton.classList.add("my-music-header-now-playing-button");
    this._myMusicHeaderNowPlayingButton.addEventListener('click', () => {
      publishEvent('b', 'showMyMusicComponent', false);
    });
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
    if (this.myMusicData['ItemCnt'] == this.myMusicData['MenuData'].length) {
      this.loadItemsCount = this.myMusicData['MenuData'].length;
    }

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
    // Array.from(this._myMusicContentSection.childNodes).forEach((child) => child.remove()); // this will rerender the dom when the next set of items are fetched from the service
    Array.from(this._myMusicFooterSection.childNodes).forEach((child) => child.remove());

    this.myMusicHeader(this.myMusicData.IsMenuAvailable, this.myMusicData.Title, this.myMusicData.Subtitle);
    this.displayVisibleOnlyItems();
    if (this.myMusicData['MenuData'].length > this.MAXIMUM_ROWS_TO_SHOW && this.myMusicData['MenuData'].length > this.musicPlayerLibInstance.maxReqItems) {
      this._myMusicContentSection.scrollTop = this._myMusicContentSection.scrollTop - this.scrollPosition;
    }
    this.myMusicMenuIconSection(this.myMusicData.ListSpecificFunctions);
  }

  //#endregion

  //#region Protected / Private Methods

  private createElement(tagName: string, clsName: string[] = [], textContent: string = '') {
    const element = document.createElement(tagName);
    if (clsName.length !== 0) { clsName.forEach((cs: string) => element.classList.add(cs)) }
    if (textContent !== '') { element.textContent = textContent; }
    return element;
  }

  //#endregion
}

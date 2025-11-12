import { Ch5MediaPlayerIconButton } from "./ch5-media-player-icon-button-base.ts";
import { publishEvent, subscribeState } from "../ch5-core/index.ts";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log.ts";
import { createElement, decodeString } from "./ch5-media-player-common.ts";
import { MusicPlayerLib } from "./music-player.ts";

export class Ch5MediaPlayerMyMusic {

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
  private menuListData: any;
  private musicPlayerLibInstance: MusicPlayerLib;
  private demoModeValue: boolean = false;

  private readonly MAXIMUM_ROWS_TO_SHOW = 40;
  private loadItemsCount = 40;
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
    ItemCnt: 4
  }

  private MY_MUSIC_MENU_DEMO_DATA = {
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
  };
  private logger: Ch5CommonLog;

  //#endregion

  //#region Component Lifecycle

  public constructor(musicPlayerLib: MusicPlayerLib) {
    this.logger = new Ch5CommonLog(false, false, "MEDIA_PLAYER:MY_MUSIC");
    this.logger.start('constructor()', "MEDIA_PLAYER:MY_MUSIC");
    this.musicPlayerLibInstance = musicPlayerLib;
    this._myMusicContainer = createElement('div');
    this.createDefaultMyMusic();

    subscribeState('o', 'myMusicData', ((data: any) => {
      this.logger.log('MyMusicData----', data);
      this.createMyMusic();
      if (!this.demoModeValue) {
        this.loadItemsCount = this.MAXIMUM_ROWS_TO_SHOW;
        if (data && Object.keys(data).length > 0) {
          this.myMusicData = data;
          this.logger.log('My Music Data', this.myMusicData);
          this.apiChanges();
        } else {
          this.createDefaultMyMusic();
        }
      }
    }));

    subscribeState('o', 'menuListData', ((data: any) => {
      this.menuListData = data;
      this.logger.log("My Music Menu list Data: ", this.menuListData);
      if (this.menuListData && this.menuListData['MenuData'] && this.menuListData['MenuData'].length <= this.musicPlayerLibInstance.maxReqItems) {
        this.printedIndex = 0;
      }
      this.menuApiChanges();
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
      this.menuListData = this.MY_MUSIC_MENU_DEMO_DATA;
      this.apiChanges();
      this.menuApiChanges();
      this._myMusicContentSection?.children[0]?.classList.add('active');
      this._myMusicFooterSection?.children[1]?.classList.add('active');
    } else {
      this.myMusicData = "";
      this.createDefaultMyMusic();
    }
  }

  //default my music
  protected createDefaultMyMusic() {
    if (this._myMusicContainer) {
      this._myMusicContainer.className = "";
      this._myMusicContainer.innerHTML = "";
    }
    this._myMusicContainer.classList.add("ch5-media-player--my-music-default");
    const defaultHeaderContainer = createElement('div', ['default-header-container']);
    const defaultBackIcon = new Ch5MediaPlayerIconButton();
    defaultBackIcon.setAttribute('iconClass', "mp-icon mp-chevron-left");
    defaultBackIcon.title = "Default Back";
    const headerTitleNone = createElement('div', ['header-title-none'], '— —');
    const defaultMusicIcon = new Ch5MediaPlayerIconButton();
    defaultMusicIcon.setAttribute('iconClass', "mp-logo mp-animated-bar");
    defaultMusicIcon.title = "Default Music";
    defaultHeaderContainer.append(defaultBackIcon, headerTitleNone, defaultMusicIcon);
    const defaultItemsContainer = createElement("div", ['default-item-container']);
    const defaultItem = createElement('div', ['default-item'], 'No Content');
    defaultItemsContainer.append(defaultItem);
    const defaultFooterContainer = createElement('div', ['default-footer-container']);
    const defaultCreateIcon = new Ch5MediaPlayerIconButton();
    defaultCreateIcon.setAttribute('iconClass', "mp-icon mp-plus-circle");
    defaultCreateIcon.title = "Default Create";
    const defaultFindIcon = new Ch5MediaPlayerIconButton();
    defaultFindIcon.setAttribute('iconClass', "mp-icon mp-search-lg");
    defaultFindIcon.title = "Default Find";
    defaultFooterContainer.append(defaultCreateIcon, defaultFindIcon);
    this._myMusicContainer.append(defaultHeaderContainer, defaultItemsContainer, defaultFooterContainer);
  }

  protected createMyMusic() {
    if (this._myMusicContainer && this._myMusicContainer.classList.contains("ch5-media-player--my-music-default")) {//:TO-DO
      // clear children efficiently
      while (this._myMusicContainer.firstChild) {
        this._myMusicContainer.removeChild(this._myMusicContainer.firstChild);
      }
      if (this._myMusicContainer.classList.contains("ch5-media-player--my-music-default")) {
        this._myMusicContainer.classList.remove('ch5-media-player--my-music-default');
      }


      this.logger.start('createInternalHtml()');
      this._myMusicContainer.classList.add("ch5-media-player--my-music");

      this._myMusicHeaderSection = createElement("div", ['my-music-header']);
      this._myMusicContentSection = createElement("div", ['my-music-content']);

      let lastScrollTop = 0;
      let ticking = false;

      const getMenuLength = () => this.menuListData?.MenuData?.length || 0;
      const getMaxReqItems = () => this.musicPlayerLibInstance?.maxReqItems || 0;

      const onScrollRaf = () => {
        const scrollTop = this._myMusicContentSection.scrollTop || 0;
        const scrollHeight = this._myMusicContentSection.scrollHeight || 0;
        const clientHeight = this._myMusicContentSection.clientHeight || window.innerHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        const menuLength = getMenuLength();
        const maxReqItems = getMaxReqItems();

        if (scrollTop > lastScrollTop && menuLength > this.loadItemsCount) {
          if (distanceFromBottom <= this.scrollPosition) {
            const first = this._myMusicContentSection.firstElementChild as HTMLElement | null;
            if (first) { this._myMusicContentSection.removeChild(first); }
            this.createLine(this.loadItemsCount, 'end');
            this.loadItemsCount += 1;
          }
        } else if (scrollTop < lastScrollTop && this.loadItemsCount > this.MAXIMUM_ROWS_TO_SHOW) {
          if (scrollTop <= this.scrollPosition) {
            const childrenCount = this._myMusicContentSection.children.length;
            if (childrenCount >= this.MAXIMUM_ROWS_TO_SHOW) {
              this._myMusicContentSection.removeChild(this._myMusicContentSection.children[childrenCount - 1]);
            }
            this.loadItemsCount -= 1;
            this.createLine(this.loadItemsCount - this.MAXIMUM_ROWS_TO_SHOW, 'start');
          }
        }

        lastScrollTop = Math.max(scrollTop, 0);

        if (menuLength - 1 > maxReqItems) {
          if (menuLength - 1 > this.printedIndex && distanceFromBottom === 0) {
            this._myMusicContentSection.scrollTop = Math.max(this._myMusicContentSection.scrollTop - this.scrollPosition, 0);
          } else if (scrollTop === 0 && this.printedIndex !== 0) {
            this._myMusicContentSection.scrollTop = this.scrollPosition;
          }
        }

        ticking = false;
      };

      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        // The requestAnimationFrame() method is a browser API used in JavaScript to schedule a function to be called before the next repaint of the browser window. It's commonly used for creating smooth animations
        requestAnimationFrame(onScrollRaf);
      };

      this._myMusicContentSection.onscroll = handleScroll;

      this._myMusicFooterSection = createElement("div", ['my-music-footer']);
      this._myMusicContainer.append(this._myMusicHeaderSection, this._myMusicContentSection, this._myMusicFooterSection);
      this.logger.stop();
    }
  }

  protected createLine(index: number, position = 'end') {
    if ((index + 1 >= this.menuListData['MenuData']?.length) && (index + 1 >= this.musicPlayerLibInstance.maxReqItems)) {
      this.musicPlayerLibInstance.getItemData(true);
    }

    // if (index > 0 && this.printedIndex === index) return;
    this.printedIndex = index;

    if (!this.menuListData['MenuData'] || !this.menuListData['MenuData'][index]) return;

    const text = this.menuListData['MenuData'][index]['L1'];
    const subText = this.menuListData['MenuData'][index]['L2'];
    const itemId = this.menuListData['MenuData'][index]['Id'];

    this._myMusicContentItem = createElement('div', ['my-music-content-item']);
    this._myMusicContentItem.id = itemId;
    this._myMusicContentItemTitle = createElement('div', ['my-music-content-item-title'], decodeString(text));
    this._myMusicContentItemSubtitle = createElement('div', ['my-music-content-item-subtitle'], decodeString(subText));

    if (this._myMusicHeaderTitleText.innerText === 'Favorites') {
      let holdTimer: number | null = null;
      let isHeld = false;
      let startX = 0;
      let startY = 0;
      const MOVE_THRESHOLD = 10; // pixels

      const clearHold = () => {
        if (holdTimer !== null) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      };

      const onPointerDown = (ev: PointerEvent) => {
        isHeld = false;
        startX = ev.clientX;
        startY = ev.clientY;
        try { (ev.target as Element).setPointerCapture?.(ev.pointerId); } catch { /* ignore */ }
        clearHold();
        holdTimer = window.setTimeout(() => {
          isHeld = true;
          holdTimer = null;
          this.musicPlayerLibInstance.myMusicEvent('PressAndHold', index + 1);
        }, 2000);
      };

      const onPointerMove = (ev: PointerEvent) => {
        if (!holdTimer) return;
        const dx = Math.abs(ev.clientX - startX);
        const dy = Math.abs(ev.clientY - startY);
        if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
          clearHold();
          try { (ev.target as Element).releasePointerCapture?.(ev.pointerId); } catch { /* ignore */ }
        }
      };

      const onPointerUp = (ev: PointerEvent) => {
        clearHold();
        try { (ev.target as Element).releasePointerCapture?.(ev.pointerId); } catch { /* ignore */ }
      };

      const onPointerCancel = (ev: PointerEvent) => {
        clearHold();
        try { (ev.target as Element).releasePointerCapture?.(ev.pointerId); } catch { /* ignore */ }
      };

      const onClick = () => {
        if (!isHeld) {
          this.musicPlayerLibInstance.myMusicEvent('Select', index + 1);
        }
      };

      this._myMusicContentItem.addEventListener('pointerdown', onPointerDown);
      this._myMusicContentItem.addEventListener('pointermove', onPointerMove);
      this._myMusicContentItem.addEventListener('pointerup', onPointerUp);
      this._myMusicContentItem.addEventListener('pointercancel', onPointerCancel);
      this._myMusicContentItem.addEventListener('click', onClick);
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
    this._myMusicHeaderBackButton = new Ch5MediaPlayerIconButton();
    this._myMusicHeaderBackButton.setAttribute('iconClass', "mp-icon mp-chevron-left");
    this._myMusicHeaderBackButton.title = "Previous Section";
    this._myMusicHeaderBackButton.classList.add('my-music-header-back-button');
    this._myMusicHeaderBackButton.onclick = () => {
      this.musicPlayerLibInstance.myMusicEvent('Back');
    }
    if (!backButton) {
      this._myMusicHeaderBackButton.classList.add('button-visibility');
    }
    else {
      this._myMusicHeaderBackButton.classList.remove('button-visibility');
    }
    this._myMusicHeaderSection.prepend(this._myMusicHeaderBackButton);

    this._myMusicHeaderTitle = createElement("div", ['my-music-header-title']);
    this._myMusicHeaderTitleText = createElement("div", ['my-music-header-title-text'], decodeString(myMusicHeaderTitleText));
    this._myMusicheaderSubtitle = createElement("div", ['my-music-header-subtitle'], decodeString(myMusicheaderSubtitle));
    if (myMusicheaderSubtitle) {
      this._myMusicheaderSubtitle.classList?.remove('ch5-hide-vis');
    } else {
      this._myMusicheaderSubtitle.classList?.add('ch5-hide-vis');
    }
    this._myMusicHeaderTitle.append(this._myMusicHeaderTitleText, this._myMusicheaderSubtitle);

    this._myMusicHeaderNowPlayingButton = new Ch5MediaPlayerIconButton();
    this._myMusicHeaderNowPlayingButton.setAttribute('iconClass', "mp-logo mp-animated-bar");
    this._myMusicHeaderNowPlayingButton.title = "Back to Now Playing";
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
            const button = new Ch5MediaPlayerIconButton();
            button.setAttribute('iconClass', action.class);
            button.title = action.name;
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


  protected apiChanges() {
    Array.from(this._myMusicHeaderSection.childNodes).forEach((child) => child.remove());
    // Array.from(this._myMusicContentSection.childNodes).forEach((child) => child.remove()); // this will rerender the dom when the next set of items are fetched from the service
    Array.from(this._myMusicFooterSection.childNodes).forEach((child) => child.remove());

    this.myMusicHeader(this.myMusicData.IsMenuAvailable, this.myMusicData.Title, this.myMusicData.Subtitle);
    this.myMusicMenuIconSection(this.myMusicData.ListSpecificFunctions);
  }

  protected menuApiChanges() {
    const menuData = this.menuListData?.MenuData ?? [];
    const menuLength = menuData.length;

    // Clear content section if no menu data
    //if (menuLength === 0) {
    // Array.from(this._myMusicContentSection.childNodes).forEach(child => child.remove());
    //return; // Early exit since no further processing is needed
    // }

    // Create lines if within max request limit
    // control will go in this if condition only on the first load of data. When the new data is fetched the item creation will work from the scroll event
    if (menuLength <= this.musicPlayerLibInstance.maxReqItems) {
      Array.from(this._myMusicContentSection.childNodes).forEach(child => child.remove());
      for (let index = 0; index < menuLength; index++) {
        this.createLine(index);
      }
    }

    // Adjust scroll if menu exceeds both limits
    if (menuLength > this.MAXIMUM_ROWS_TO_SHOW && menuLength > this.musicPlayerLibInstance.maxReqItems) {
      this._myMusicContentSection.scrollTop -= this.scrollPosition;
    }
  }

  //#endregion

}

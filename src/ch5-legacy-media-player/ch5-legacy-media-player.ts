import { Ch5Common } from "../ch5-common/ch5-common";
// import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

import { ICh5LegacyMediaPlayerAttributes } from './interfaces/i-ch5-legacy-media-player-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
// import {Ch5LegacyMediaPlayerMyMusic } from "./ch5-legacy-media-player-my-music";
// import {Ch5LegacyMediaPlayerNowPlaying} from "./ch5-legacy-media-player-now-playing";
import { Ch5MpIndividualIconButton } from "./ch5-mp-individual-icon-button";

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
  private _elContainer1: HTMLElement = {} as HTMLElement;
  private _elContainer2: HTMLElement = {} as HTMLElement;
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
  private _albumArt: HTMLImageElement = {} as HTMLImageElement;
	private _titleElem: HTMLDivElement = {} as HTMLDivElement;
	private _artistElem: HTMLSpanElement = {} as HTMLSpanElement;
	private _albumElem: HTMLSpanElement = {} as HTMLSpanElement;
	private _artistAlbum: HTMLDivElement = {} as HTMLDivElement;
	private _sourceElem: HTMLDivElement = {} as HTMLDivElement;
	private _fourthLineElem: HTMLDivElement = {} as HTMLDivElement;

	private _progressBarContainer: HTMLDivElement = {} as HTMLDivElement;
	private _progressBarInput: HTMLInputElement = {} as HTMLInputElement;
	private _audioElement: HTMLAudioElement = {} as HTMLAudioElement;
	private _currentTime: HTMLSpanElement = {} as HTMLSpanElement;
	private _duration: HTMLSpanElement = {} as HTMLSpanElement;

	private _actionButtonsContainer: HTMLDivElement = {} as HTMLDivElement;
	private _moreActionButtonsContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nextAndPreviousSongContainer: HTMLDivElement = {} as HTMLDivElement;

	private _nextSongLabel: HTMLSpanElement = {} as HTMLSpanElement;
	private _nextSongText: HTMLSpanElement = {} as HTMLSpanElement;
	
	private _transportControls: HTMLElement = {} as HTMLElement;
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
    this._elContainer = document.createElement('div');
    this.createNowPlaying();
    this.createMyMusic();
    this._elContainer.appendChild(this._elContainer1);
    this._elContainer.appendChild(this._elContainer2);
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
    document.getElementsByClassName('music-button')[0].addEventListener('click', () => {
      document.querySelector(".ch5-legacy-media-player-my-music")?.classList.add("my-music-transition");
    });

    document.getElementsByClassName('backToNowPlaying')[0].addEventListener('click', () => {
      document.querySelector(".ch5-legacy-media-player-my-music")?.classList.remove("my-music-transition");
    });
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

 public createMyMusic() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer2 = document.createElement('div');
    this._elContainer2.classList.add("ch5-legacy-media-player-my-music");

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
    this._elContainer2.append(this._header, this._sourceSection, this._sourceMenu);
    this.logger.stop();
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

protected createNowPlaying() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer1 = document.createElement('div');
        this._elContainer1.classList.add("ch5-legacy-media-player-now-playing");

		this._albumArt = document.createElement("img");
		this._albumArt.classList.add("album-art");
		this._albumArt.alt = "Album Art";
		this._albumArt.src = "https://i.ytimg.com/vi/ZUfWe-CkgBE/maxresdefault.jpg";

		const info = document.createElement("div");
		info.classList.add("info");

		this._titleElem = document.createElement("div");
		this._titleElem.classList.add("song-title");
		this._titleElem.textContent = "Song Title";

		this._artistAlbum = document.createElement("div");
		this._artistAlbum.classList.add("artist-album");

		this._artistElem = document.createElement("span");
		this._albumElem = document.createElement("span");
		const longDash = document.createElement("span");
		this._artistElem.classList.add("artist-name");
		this._albumElem.classList.add("album-name");
		longDash.classList.add("long-dash");
		longDash.textContent = ' — ';
		this._artistElem.textContent = "Artist Name";
		this._albumElem.textContent = "Album Name";
		this._artistAlbum.appendChild(this._artistElem);
		this._artistAlbum.appendChild(longDash);
		this._artistAlbum.appendChild(this._albumElem);

		this._fourthLineElem = document.createElement("div");
		this._fourthLineElem.classList.add("fourth-line");
		this._fourthLineElem.textContent = "Fourth Line";

		info.appendChild(this._titleElem);
		info.appendChild(this._artistAlbum);
		info.appendChild(this._fourthLineElem);

		this._sourceElem = document.createElement("div");
		this._sourceElem.classList.add("source");

		const selectDropdownDiv = document.createElement('div');
		selectDropdownDiv.classList.add('dropdown-div');
		const selectDropdown = document.createElement('select');
		selectDropdown.classList.add('menu-items');
		selectDropdown.id = 'menu-items';

		const placeholderOption = document.createElement('option');
		placeholderOption.value = ''; // Empty value for validation
		placeholderOption.classList.add('selectMenuPlaceholder');
		placeholderOption.textContent = 'Player Name';
		placeholderOption.disabled = true;
		placeholderOption.selected = true;
		selectDropdown.appendChild(placeholderOption);
		selectDropdownDiv.appendChild(selectDropdown);
		const optionsData = [
			{ value: 'pandora', text: 'Pandora' },
			{ value: 'spotify', text: 'Spotify' },
			{ value: 'tidal', text: 'Tidal' },
			{ value: 'podcast', text: 'Podcast' }
		];

		optionsData.forEach(optionData => {
			const option = document.createElement('option');
			option.value = optionData.value
			option.textContent = optionData.text;
			selectDropdown.appendChild(option);
		});

		const musicButton = new Ch5MpIndividualIconButton();
		musicButton.setAttribute('iconClass', "fas fa-music");
		musicButton.classList.add("music-button");

		this._sourceElem.appendChild(selectDropdownDiv);
		this._sourceElem.appendChild(musicButton);

		this._transportControls = document.createElement('div');
		this.renderProgressBar();
		this.renderActionButtons();
		this.renderMoreActionButtons();
		
		this._elContainer1.appendChild(this._sourceElem);
		this._elContainer1.appendChild(this._albumArt);
		this._elContainer1.appendChild(info);
		this._elContainer1.appendChild(this._transportControls);
		this.renderNextAndPreviousSong();

		this.logger.stop();
	}

	protected renderProgressBar() {
		// Audio element (hidden)
		this._audioElement = document.createElement('audio');
		this._audioElement.src = "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3";
		this._audioElement.preload = "auto";
		this._audioElement.style.display = "none";
		this._elContainer1.appendChild(this._audioElement);

		// Progress bar section
		this._progressBarContainer = document.createElement('div');
		this._progressBarContainer.classList.add('ch5-music-player-transport-controls--progressbar-container');
		// Progress bar input
		this._progressBarInput = document.createElement('input');
		this._progressBarInput.type = 'range';
		this._progressBarInput.min = '0';
		this._progressBarInput.max = '100';
		this._progressBarInput.value = '0';
		this._progressBarInput.classList.add('ch5-music-player-transport-controls--progressbar-input');
		this._progressBarContainer.appendChild(this._progressBarInput);

		// Current time and duration container
		const progressBarCurrentTimeDurationContainer = document.createElement('div');
		progressBarCurrentTimeDurationContainer.classList.add('ch5-music-player-transport-controls--progressbar-current-time-duration-container');
		// Current time
		this._currentTime = document.createElement('span');
		this._currentTime.classList.add('ch5-music-player-transport-controls--progressbar-current-time');
		this._currentTime.textContent = '0:00';
		progressBarCurrentTimeDurationContainer.appendChild(this._currentTime);
		// Duration
		this._duration = document.createElement('span');
		this._duration.classList.add('ch5-music-player-transport-controls--progressbar-duration');
		this._duration.textContent = '0:00';
		progressBarCurrentTimeDurationContainer.appendChild(this._duration);
		this._progressBarContainer.appendChild(progressBarCurrentTimeDurationContainer);
		// Append the progress bar container to the main container
		this._transportControls.appendChild(this._progressBarContainer);

		// Progress bar time update
		this._audioElement.addEventListener('timeupdate', () => {
			const current = this._audioElement.currentTime;
			const total = this._audioElement.duration || 0;
			this._progressBarInput.value = total ? String((current / total) * 100) : '0';
			this._currentTime.textContent = this.formatTime(current);
			this._duration.textContent = this.formatTime(total);
		});

		// Seek
		this._progressBarInput.addEventListener('input', () => {
			const total = this._audioElement.duration || 0;
			this._audioElement.currentTime = (parseFloat(this._progressBarInput.value) / 100) * total;
		});
	}

	protected renderActionButtons() {
		this._actionButtonsContainer = document.createElement('div');
		this._actionButtonsContainer.classList.add('ch5-music-player-transport-controls--action-buttons-container');

		const actions = [
			{ class: 'fas fa-thumbs-down', label: 'Dislike', action: 'dislike' },
			{ class: 'fas fa-step-backward', label: 'Previous', action: 'prev' },
			{ class: 'fas fa-backward', label: 'Backward', action: 'backward' },
			{ class: 'fas fa-play', label: 'Play', action: 'play' },
			{ class: 'fas fa-pause', label: 'Pause', action: 'pause', style: 'display:none;' },
			{ class: 'fas fa-forward', label: 'Forward', action: 'forward' },
			{ class: 'fas fa-step-forward', label: 'Next', action: 'next' },
			{ class: 'fas fa-thumbs-up', label: 'Like', action: 'like' },
		];
		actions.forEach(action => {
			const button = new Ch5MpIndividualIconButton();
			button.setAttribute('iconClass', action.class);
			button.setAttribute('aria-label', action.label);
			button.style.cssText = action.style || '';
			button.addEventListener('click', () => this.handleActionButtonClick(action.action));
			this._actionButtonsContainer.appendChild(button);
		});

		this._transportControls.appendChild(this._actionButtonsContainer);
	}

	protected renderMoreActionButtons() {
		this._moreActionButtonsContainer = document.createElement('div');
		this._moreActionButtonsContainer.classList.add('ch5-music-player-transport-controls--more-action-buttons-container');

		const actions = [
			{ class: 'fas fa-shuffle', label: 'Shuffle', action: 'shuffle' },
			{ class: 'fas fa-repeat', label: 'Repeat', action: 'repeat' },
			{ class: 'fas fa-notes-medical', label: 'Play Multi', action: 'playMulti' },
			{ class: 'fas fa-icons', label: 'Music Notes', action: 'musicNotes' },
			{ class: 'fas fa-user-plus', label: 'Users', action: 'users' },

		];
		actions.forEach(action => {
			const button = new Ch5MpIndividualIconButton();
			button.setAttribute('iconClass', action.class);
			button.setAttribute('aria-label', action.label);
			button.addEventListener('click', () => this.handleActionButtonClick(action.action));
			this._moreActionButtonsContainer.appendChild(button);
		});

		this._transportControls.appendChild(this._moreActionButtonsContainer);
	}

	protected renderNextAndPreviousSong() {
		this._nextAndPreviousSongContainer = document.createElement('div');
		this._nextAndPreviousSongContainer.classList.add('ch5-music-player-transport-controls--next-and-previous-song-container');
		// Next Song Section
		const nextSongSection = document.createElement('div');
		nextSongSection.classList.add('ch5-music-player-transport-controls--next-song-section');
		//Next Song Label
		this._nextSongLabel = document.createElement('span');
		this._nextSongLabel.classList.add('ch5-music-player-transport-controls--next-song-label');
		this._nextSongLabel.textContent = 'Next up:';
		nextSongSection.appendChild(this._nextSongLabel);
		//Next Song Text
		this._nextSongText = document.createElement('span');
		this._nextSongText.classList.add('ch5-music-player-transport-controls--next-song-text');
		this._nextSongText.textContent = 'Song Name Here';
		nextSongSection.appendChild(this._nextSongText);
		this._nextAndPreviousSongContainer.appendChild(nextSongSection);

		// Next and Previous Arrows
		const arrowsContainer = document.createElement('div');
		arrowsContainer.classList.add('ch5-music-player-transport-controls--arrows-container');
		const previousButton = document.createElement('button');
		previousButton.classList.add('fas', 'fa-chevron-left', 'ch5-music-player-transport-controls--arrow-left-button');
		arrowsContainer.appendChild(previousButton);
		const nextButton = document.createElement('button');
		nextButton.classList.add('fas', 'fa-chevron-right', 'ch5-music-player-transport-controls--arrow-right-button');
		arrowsContainer.appendChild(nextButton);
		this._nextAndPreviousSongContainer.appendChild(arrowsContainer);

		this._elContainer1.appendChild(this._nextAndPreviousSongContainer);
	}


private handleActionButtonClick(action: string) {
		switch (action) {
			case 'prev':
				this._audioElement.currentTime -= 10;
				break;
			case 'backward':
				this._audioElement.currentTime -= 5;
				break;
			case 'play': {
				this._audioElement.play();
				const iconPlayButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-play"]')!;
				iconPlayButton.style.display = 'none';
				const iconPauseButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-pause"]')!;
				iconPauseButton.style.display = 'block';
			}
				break;
			case 'pause': {
				this._audioElement.pause();
				const iconPlayButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-play"]')!;
				iconPlayButton.style.display = 'block';
				const iconPauseButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-pause"]')!;
				iconPauseButton.style.display = 'none';
			}
				break;
			case 'forward':
				this._audioElement.currentTime += 5;
				break;
			case 'next':
				this._audioElement.currentTime += 10;
				break;
			case 'like': {
				const iconLikeButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-thumbs-up"]')!;
				if (iconLikeButton.classList.contains('active')) {
					iconLikeButton.classList.remove('active');
				} else {
					iconLikeButton.classList.add('active');
				}
				const icondislikeButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-thumbs-down"]')!;
				icondislikeButton.classList.remove('active');
			}
				break;
			case 'dislike': {
				const icondislikeButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-thumbs-down"]')!;
				if (icondislikeButton.classList.contains('active')) {
					icondislikeButton.classList.remove('active');
				} else {
					icondislikeButton.classList.add('active');
				}
				const iconLikeButton: Ch5MpIndividualIconButton = document.querySelector('ch5-mp-individual-icon-button[iconClass="fas fa-thumbs-up"]')!;
				iconLikeButton.classList.remove('active');
			}

				break;
			default:
				console.warn(`Unknown action: ${action}`);
				break;
		}
	}

	// Utility: format time
	protected formatTime = (seconds: number): string => {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
		return `${min}:${sec < 10 ? '0' : ''}${sec}`;
	}
















  //#endregion

}

Ch5LegacyMediaPlayer.registerCustomElement();
Ch5LegacyMediaPlayer.registerSignalAttributeTypes();

import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";
import { MusicPlayerLib } from "../ch5-core/utility-functions/music-player.ts";
import { subscribeState } from "../ch5-core/index.ts";
import { TCh5LegacyMediaPlayerSourcePlayerIcons } from "./interfaces/t-ch5-legacy-media-player.ts";

export class Ch5LegacyMediaPlayerNowPlaying extends Ch5Log {

	//#region Variables

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [];

	public static readonly ELEMENT_NAME = 'ch5-legacy-media-player-now-playing';

	public primaryCssClass = 'ch5-legacy-media-player-now-playing';

	private _ch5Properties: Ch5Properties;
	private _nowPlayingContainer: HTMLElement = {} as HTMLElement;
	private _nowPlayingPlayerContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingImage: HTMLImageElement = {} as HTMLImageElement;
	private _nowPlayingTrackInfo: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingSongTitle: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingArtist: HTMLSpanElement = {} as HTMLSpanElement;
	private _nowPlayingAlbum: HTMLSpanElement = {} as HTMLSpanElement;
	private _nowPlayingArtistAlbum: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingSongAdditionalInfo: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingPlayerIconContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingPlayerIconImage: HTMLDivElement = {} as HTMLDivElement;
	private _nowPlayingPlayerIconName: HTMLDivElement = {} as HTMLDivElement;
	private _progressBarContainer: HTMLDivElement = {} as HTMLDivElement;
	private _progressBarInput: HTMLInputElement = {} as HTMLInputElement;
	private _currentTime: HTMLSpanElement = {} as HTMLSpanElement;
	private _playerState: HTMLSpanElement = {} as HTMLSpanElement;
	private _duration: HTMLSpanElement = {} as HTMLSpanElement;
	private _actionButtonsContainer: HTMLDivElement = {} as HTMLDivElement;
	private _moreActionButtonsContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nextAndPreviousSongContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nextSongLabel: HTMLSpanElement = {} as HTMLSpanElement;
	private _nextSongText: HTMLSpanElement = {} as HTMLSpanElement;
	private _transportControls: HTMLElement = {} as HTMLElement;
	private musicPlayerLibInstance: MusicPlayerLib;
	private nowPlayingData: any;
	private progressBarData: any;

	private _nowPlayingPlayerName: HTMLElement = {} as HTMLElement
	private _nowPlayingPlayerImage: HTMLImageElement = {} as HTMLImageElement;

	private _nowPlayingPlayerIconClass = TCh5LegacyMediaPlayerSourcePlayerIcons;

	private readonly DEMO_MODE_DATA = {
		nowPlaying: {
			classes: [
				"ch5-legacy-media-player-now-playing"
			]
		},
		albumArt: {
			classes: [
				"album-art"
			],
			alt: "Album Art",
			src: "https://i.ytimg.com/vi/ZUfWe-CkgBE/maxresdefault.jpg"
		},
		info: {
			classes: [
				"info"
			],
			titleElement: {
				classes: [
					"song-title"
				],
				textContent: "Song Title"
			},
			artistAlbum: {
				classes: [
					"artist-album"
				],
				textContent: "Song Title"
			},
			artistElement: {
				classes: [
					""
				],
				textContent: ""
			},
			longDash: {
				classes: [
					""
				],
				textContent: ""
			}
		},
		sourceElement: {
			options: [
				{ value: 'pandora', text: 'Pandora' },
				{ value: 'spotify', text: 'Spotify' },
				{ value: 'tidal', text: 'Tidal' },
				{ value: 'podcast', text: 'Podcast' }
			],
			musicButton: {
				icon: "mp-icon mp-music-note",
				class: "music-button"
			}
		},
		transportControls: {}
	};
	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME, Ch5LegacyMediaPlayerNowPlaying.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME, Ch5LegacyMediaPlayerNowPlaying);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor(musicPlayerLib: MusicPlayerLib) {
		super();
		this.musicPlayerLibInstance = musicPlayerLib;
		this.logger.start('constructor()', Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME);
		this.createNowPlaying();
		this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES);
		this.updateCssClass();
		subscribeState('o', 'nowPlayingData', ((data: any) => {
			this.nowPlayingData = data;
			if (this.nowPlayingData && Object.keys(this.nowPlayingData).length > 0) this.updatedNowPlayingContent();
			console.log('Now Playing Data', this.nowPlayingData);
		}));

		subscribeState('o', 'progressBarData', ((data: any) => {
			this.progressBarData = data;
			console.log('Progress bar data', this.progressBarData);
			this._progressBarInput.max = this.formatTime(this.progressBarData.TrackSec);
			this._progressBarInput.value = this.formatTime(this.progressBarData.ElapsedSec);
			this._currentTime.textContent = this.formatTime(this.progressBarData.ElapsedSec);
			this._duration.textContent = this.formatTime(this.progressBarData.TrackSec);
			const percent = (this.progressBarData.ElapsedSec / this.progressBarData.TrackSec) * 100;
			this._progressBarInput.style.backgroundSize = percent + "% 100%";
		}));
	}

	private updatedNowPlayingContent() {
		this._nowPlayingPlayerName.textContent = this.nowPlayingData.ProviderName || this.nowPlayingData.PlayerName;
		this._nowPlayingImage.src = this.nowPlayingData.AlbumArtUrl;
		this._nowPlayingSongTitle.textContent = this.nowPlayingData.Title;
		this._nowPlayingArtist.textContent = this.nowPlayingData.Artist;
		this._nowPlayingAlbum.textContent = this.nowPlayingData.Album;
		this._nowPlayingSongAdditionalInfo.textContent = `${this.nowPlayingData.TrackNum} of ${this.nowPlayingData.TrackCnt}  ${this.nowPlayingData.Genre}`;
		this._nowPlayingPlayerImage.src = this.nowPlayingData.PlayerIconURL;
		this._nowPlayingPlayerIconName.textContent = this.nowPlayingData.ProviderName || this.nowPlayingData.PlayerName;
		this.renderActionButtons(this.nowPlayingData.ActionsAvailable);
		this.renderMoreActionButtons(this.nowPlayingData.ActionsAvailable);
		this._nowPlayingContainer.appendChild(this._transportControls);
		this.renderNextAndPreviousSong(this.nowPlayingData.NextTitle);
		this._nowPlayingContainer.appendChild(this._nextAndPreviousSongContainer);
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Log.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-legacy-media-player-now-playing attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5LegacyMediaPlayerNowPlaying component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME);
		this.initAttributes();
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.unsubscribeFromSignals();
		this.logger.stop();
	}

	public createInternalHtml() {
		return this._nowPlayingContainer;
	}

	protected createNowPlaying() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._nowPlayingContainer = document.createElement('div');
		this._nowPlayingContainer.classList.add("ch5-legacy-media-player-now-playing");
		this.renderProviderOrPlayer();
		this.renderAlbumArt();
		this.renderTrackInfo();
		this._transportControls = document.createElement('div');
		this._transportControls.classList.add("now-playing-controls-container");
		this.renderProgressBar();
		this.renderActionButtons(["ThumbsDown", "PreviousTrack", "Rewind", "Play", "Pause", "Ffwd", "NextTrack", "ThumbsUp"], true);
		this.renderMoreActionButtons(["Shuffle", "Repeat", "PlayAll", "MusicNote", "UserNote"]);

		this._nowPlayingContainer.appendChild(this._transportControls);
		this.renderNextAndPreviousSong("Next Song Name here");
		this._nowPlayingContainer.appendChild(this._nextAndPreviousSongContainer);

		this.logger.stop();
	}

	protected renderProviderOrPlayer() {
		//Now playing player
		this._nowPlayingPlayerContainer = document.createElement("div");
		this._nowPlayingPlayerContainer.classList.add("now-playing-player-container");
		const nowPlayingPlayerLabel = document.createElement('div');
		nowPlayingPlayerLabel.classList.add('now-playing-player-label');
		this._nowPlayingPlayerName = document.createElement('label');
		this._nowPlayingPlayerName.classList.add("now-playing-player-name");
		this._nowPlayingPlayerName.textContent = "Player name";
		nowPlayingPlayerLabel.appendChild(this._nowPlayingPlayerName);
		this._nowPlayingPlayerContainer.appendChild(nowPlayingPlayerLabel);
		//Now Playing Player Music Note
		const nowPlayingPlayerMusicNoteButton = new Ch5LegacyMediaPlayerIconButton();
		nowPlayingPlayerMusicNoteButton.setAttribute('iconClass', "mp-icon mp-music-note");
		nowPlayingPlayerMusicNoteButton.classList.add("now-playing-player-music-note-button");
		this._nowPlayingPlayerContainer.appendChild(nowPlayingPlayerMusicNoteButton);

		this._nowPlayingContainer.appendChild(this._nowPlayingPlayerContainer);
	}

	protected renderAlbumArt() {
		//Now Playing Image
		this._nowPlayingImage = document.createElement("img");
		this._nowPlayingImage.classList.add("now-playing-image");
		this._nowPlayingImage.alt = "Album Art";
		this._nowPlayingImage.src = "https://www.clipartmax.com/png/full/30-301220_free-svg-music-symbols-music-note-that-looks-like-an-s.png";
		this._nowPlayingContainer.appendChild(this._nowPlayingImage);
	}

	protected renderTrackInfo() {
		//Now Playing Track Information
		this._nowPlayingTrackInfo = document.createElement("div");
		this._nowPlayingTrackInfo.classList.add("now-playing-track-info");
		//Now Playing Song Title
		this._nowPlayingSongTitle = document.createElement("div");
		this._nowPlayingSongTitle.classList.add("now-playing-song-title");
		this._nowPlayingSongTitle.textContent = "Song name here";
		//Now Playing Song Artist and Album
		this._nowPlayingArtistAlbum = document.createElement("div");
		this._nowPlayingArtistAlbum.classList.add("now-playing-artist-album");
		this._nowPlayingArtist = document.createElement("span");
		this._nowPlayingAlbum = document.createElement("span");
		const longDash = document.createElement("span");
		this._nowPlayingArtist.classList.add("now-playing-artist-name");
		this._nowPlayingAlbum.classList.add("now-playing-album-name");
		longDash.classList.add("long-dash");
		longDash.textContent = ' — ';
		this._nowPlayingArtist.textContent = "Artist Name";
		this._nowPlayingAlbum.textContent = "Album Name";
		this._nowPlayingArtistAlbum.appendChild(this._nowPlayingArtist);
		//if (artistName && albumName) this._nowPlayingArtistAlbum.appendChild(longDash);
		this._nowPlayingArtistAlbum.appendChild(longDash);
		this._nowPlayingArtistAlbum.appendChild(this._nowPlayingAlbum);
		//Now Playing Song Additional Information
		this._nowPlayingSongAdditionalInfo = document.createElement("div");
		this._nowPlayingSongAdditionalInfo.classList.add("now-playing-song-additional-info");
		this._nowPlayingSongAdditionalInfo.textContent = "Track count and Genre here";
		//Now Playing Player Icon Image and Name Container
		this._nowPlayingPlayerIconContainer = document.createElement('div');
		this._nowPlayingPlayerIconContainer.classList.add("now-playing-player-icon-container");
		//Now Playing Player Icon Image
		this._nowPlayingPlayerIconImage = document.createElement('div');
		this._nowPlayingPlayerIconImage.classList.add("now-playing-player-icon-image");
		this._nowPlayingPlayerImage = document.createElement('img');
		this._nowPlayingPlayerImage.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRslcO84eWfXP_4Ucd4Yfz6B8uqJmHaTo0iTw&s";// temporary value
		this._nowPlayingPlayerIconImage.appendChild(this._nowPlayingPlayerImage);
		//Now Playing Player Icon Name
		this._nowPlayingPlayerIconName = document.createElement('div');
		this._nowPlayingPlayerIconName.classList.add("now-playing-player-icon-name");
		this._nowPlayingPlayerIconName.textContent = "Spotify";
		this._nowPlayingPlayerIconContainer.appendChild(this._nowPlayingPlayerIconImage);
		this._nowPlayingPlayerIconContainer.appendChild(this._nowPlayingPlayerIconName);

		this._nowPlayingTrackInfo.appendChild(this._nowPlayingSongTitle);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingArtistAlbum);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingSongAdditionalInfo);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingPlayerIconContainer);

		this._nowPlayingContainer.appendChild(this._nowPlayingTrackInfo);
	}

	protected renderProgressBar() {
		// Progress bar section
		this._progressBarContainer = document.createElement('div');
		this._progressBarContainer.classList.add('now-playing-progressbar-container');
		// Progress bar input
		this._progressBarInput = document.createElement('input');
		this._progressBarInput.type = 'range';
		this._progressBarInput.min = '0';
		this._progressBarInput.max = this.formatTime(0);
		this._progressBarInput.value = this.formatTime(0);
		//const percent = (currentTime / duration) * 100;
		this._progressBarInput.style.backgroundSize = "0% 100%";
		this._progressBarInput.classList.add('now-playing-progressbar-input');
		this._progressBarContainer.appendChild(this._progressBarInput);

		// Current time and duration container
		const progressBarCurrentTimeDurationContainer = document.createElement('div');
		progressBarCurrentTimeDurationContainer.classList.add('now-playing-progressbar-current-time-duration-container');
		// Current time
		this._currentTime = document.createElement('span');
		this._currentTime.classList.add('now-playing-progressbar-current-time');
		this._currentTime.textContent = "0:00";
		progressBarCurrentTimeDurationContainer.appendChild(this._currentTime);
		// Player State
		this._playerState = document.createElement('span');
		this._playerState.classList.add('now-playing-progressbar-player-state');
		this._playerState.textContent = 'playerState';
		progressBarCurrentTimeDurationContainer.appendChild(this._playerState);
		// Duration
		this._duration = document.createElement('span');
		this._duration.classList.add('now-playing-progressbar-duration');
		this._duration.textContent = "0:00";
		progressBarCurrentTimeDurationContainer.appendChild(this._duration);
		this._progressBarContainer.appendChild(progressBarCurrentTimeDurationContainer);

		//Seek
		this._progressBarInput.addEventListener("input", () => {
			this._progressBarInput.style.backgroundSize = "0% 100%";
			this._currentTime.textContent = this.formatTime(parseInt(this._progressBarInput.value));
			this._duration.textContent = this._progressBarInput.max;
		});

		// Append the progress bar container to the main container
		this._transportControls.appendChild(this._progressBarContainer);

	}

	protected renderActionButtons(availableActions: string[], isShowCase: boolean = false) {
		if (this._actionButtonsContainer && this._actionButtonsContainer.parentNode) {
			this._actionButtonsContainer.parentNode.removeChild(this._actionButtonsContainer);
		}
		this._actionButtonsContainer = document.createElement('div');
		this._actionButtonsContainer.classList.add('now-playing-action-buttons-container');

		const actionIconMap: { [key: string]: { class: string, style?: string } } = {
			"ThumbsDown": { class: 'mp-icon mp-thumbs-down' },
			"PreviousTrack": { class: 'mp-icon mp-skip-back' },
			"Rewind": { class: 'mp-icon mp-fast-backward' },
			"Play": { class: 'mp-icon mp-play' },
			"Pause": { class: 'mp-icon mp-pause', style: 'display:none;' },
			"Ffwd": { class: 'mp-icon mp-fast-forward' },
			"NextTrack": { class: 'mp-icon mp-skip-forward' },
			"ThumbsUp": { class: 'mp-icon mp-thumbs-up' }
		};

		if (Array.isArray(availableActions)) {
			Object.keys(actionIconMap).forEach((action) => {
				// Always render Play and Pause, but hide if not available
				if (action === "Play" || action === "Pause") {
					const button = new Ch5LegacyMediaPlayerIconButton();
					button.setAttribute('iconClass', actionIconMap[action].class);
					if (action === "Play") {
						button.onclick =()=> { 
							this.onPlay;
							console.log(action);
						}; 
					}
					else {
						button.onclick =()=> { 
							this.onPause;
							console.log(action);
						}; 
					}
					button.style.display = availableActions.includes(action) ? '' : 'none';  //to hide based on api response
					if (isShowCase && action === "Pause") button.style.display = 'none'; //for pause to hide in showcase
					this._actionButtonsContainer.appendChild(button);
				} else if (availableActions.includes(action)) {
					// Render other actions only if present
					const button = new Ch5LegacyMediaPlayerIconButton();
					button.setAttribute('iconClass', actionIconMap[action].class);
					button.onclick = () => { console.log(action) };
					this._actionButtonsContainer.appendChild(button);
				} else {
					const button = new Ch5LegacyMediaPlayerIconButton();
					button.setAttribute('iconClass', actionIconMap[action].class);
					button.onclick = () => { console.log(action) };
					button.style.visibility = "hidden";
					this._actionButtonsContainer.appendChild(button);
				}
			});
		}
		this._transportControls.appendChild(this._actionButtonsContainer);
	}

	private onPlay = () => {
		this.musicPlayerLibInstance.nowPlayingvent('play');
		// const iconPlayButton: Ch5LegacyMediaPlayerIconButton = this._actionButtonsContainer.querySelector('.ch5-legacy-media-player-individual-icon-button-container[iconClass="mp-icon mp-play"]')!;
		// iconPlayButton.style.display = 'none';
		// const iconPauseButton: Ch5LegacyMediaPlayerIconButton = this._actionButtonsContainer.querySelector('.ch5-legacy-media-player-individual-icon-button-container[iconClass="mp-icon mp-pause"]')!;
		// iconPauseButton.style.display = 'flex';
	}

	private onPause = () => {
		this.musicPlayerLibInstance.nowPlayingvent('pause');
		// const iconPlayButton: Ch5LegacyMediaPlayerIconButton = this._actionButtonsContainer.querySelector('.ch5-legacy-media-player-individual-icon-button-container[iconClass="mp-icon mp-play"]')!;
		// iconPlayButton.style.display = 'flex';
		// const iconPauseButton: Ch5LegacyMediaPlayerIconButton = this._actionButtonsContainer.querySelector('.ch5-legacy-media-player-individual-icon-button-container[iconClass="mp-icon mp-pause"]')!;
		// iconPauseButton.style.display = 'none';
	}

	protected renderMoreActionButtons(availableActions: string[]) {
		if (this._moreActionButtonsContainer && this._moreActionButtonsContainer.parentNode) {
			this._moreActionButtonsContainer.parentNode.removeChild(this._moreActionButtonsContainer);
		}
		this._moreActionButtonsContainer = document.createElement('div');
		this._moreActionButtonsContainer.classList.add('now-playing-more-action-buttons-container');

		this._moreActionButtonsContainer.innerHTML = "";
		const moreActionIconMap: { [key: string]: { class: string, style?: string } } = {
			"Shuffle": { class: 'mp-icon mp-shuffle' },
			"Repeat": { class: 'mp-icon mp-repeat' },
			"PlayAll": { class: 'mp-icon mp-play-multi-square' },
			"MusicNote": { class: 'mp-icon mp-music-note-plus' },
			"UserNote": { class: 'mp-icon mp-image-user-plus' },
		};

		if (Array.isArray(availableActions)) {
			Object.keys(moreActionIconMap).forEach((action: string) => {
				if (availableActions.includes(action)) {
					const button = new Ch5LegacyMediaPlayerIconButton();
					button.setAttribute('iconClass', moreActionIconMap[action].class);
					button.onclick = () => { console.log(action) };
					this._moreActionButtonsContainer.appendChild(button);
				}
			});
		}
		this._transportControls.appendChild(this._moreActionButtonsContainer);
	}

	protected renderNextAndPreviousSong(nextSong: string) {
		if (this._nextAndPreviousSongContainer && this._nextAndPreviousSongContainer.parentNode) {
			this._nextAndPreviousSongContainer.parentNode.removeChild(this._nextAndPreviousSongContainer);
		}
		this._nextAndPreviousSongContainer = document.createElement('div');
		this._nextAndPreviousSongContainer.classList.add('now-playing-next-and-previous-song-container');
		// Next Song Section
		const nextSongSection = document.createElement('div');
		nextSongSection.classList.add('now-playing-next-song-container');
		//Next Song Label
		this._nextSongLabel = document.createElement('span');
		this._nextSongLabel.classList.add('now-playing-next-song-label');
		this._nextSongLabel.textContent = 'Next up';
		nextSongSection.appendChild(this._nextSongLabel);
		//Next Song Text
		this._nextSongText = document.createElement('span');
		this._nextSongText.classList.add('now-playing-next-song-text');
		this._nextSongText.textContent = nextSong;
		nextSongSection.appendChild(this._nextSongText);
		this._nextAndPreviousSongContainer.appendChild(nextSongSection);
		// Next and Previous Arrows
		const arrowsContainer = document.createElement('div');
		arrowsContainer.classList.add('now-playing-arrows-container');

		const previousButton = new Ch5LegacyMediaPlayerIconButton();
		previousButton.setAttribute('iconClass', "mp-icon mp-chevron-left");
		previousButton.classList.add("now-playing-arrow-left-button");
		previousButton.onclick = this.onPreviousSong;
		arrowsContainer.appendChild(previousButton);

		const nextButton = new Ch5LegacyMediaPlayerIconButton();
		nextButton.setAttribute('iconClass', "mp-icon mp-chevron-right");
		nextButton.classList.add("now-playing-arrow-right-button");
		nextButton.onclick = this.onNextSong;
		arrowsContainer.appendChild(nextButton);
		this._nextAndPreviousSongContainer.appendChild(arrowsContainer);
	}

	private onPreviousSong = () => {
		console.log("Previous Song button click")
	}

	private onNextSong = () => {
		console.log("Next Song button click")
	}

	// Utility: format time
	protected formatTime = (seconds: number = 0): string => {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
		return `${min}:${sec < 10 ? '0' : ''}${sec}`;
	}

	//#endregion

	//#region Protected / Private Methods

	protected initAttributes() {
		super.initAttributes();
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected unsubscribeFromSignals() {
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
		this.logger.stop();
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion
}

Ch5LegacyMediaPlayerNowPlaying.registerCustomElement();
Ch5LegacyMediaPlayerNowPlaying.registerSignalAttributeTypes();

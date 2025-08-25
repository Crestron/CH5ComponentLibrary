import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5LegacyMediaPlayerIconButton } from "./ch5-legacy-media-player-icon-button-base.ts";

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
	private _progressBarContainer: HTMLDivElement = {} as HTMLDivElement;
	private _progressBarInput: HTMLInputElement = {} as HTMLInputElement;
	private _currentTime: HTMLSpanElement = {} as HTMLSpanElement;
	private _duration: HTMLSpanElement = {} as HTMLSpanElement;
	private _actionButtonsContainer: HTMLDivElement = {} as HTMLDivElement;
	private _moreActionButtonsContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nextAndPreviousSongContainer: HTMLDivElement = {} as HTMLDivElement;
	private _nextSongLabel: HTMLSpanElement = {} as HTMLSpanElement;
	private _nextSongText: HTMLSpanElement = {} as HTMLSpanElement;
	private _transportControls: HTMLElement = {} as HTMLElement;

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
				icon: "fas fa-music",
				class: "music-button"
			}
		},
		transportControls: {}
	};
	//#endregion

	//#region Getters and Setters


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

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME);
		this.createNowPlaying();
		this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES);
		this.updateCssClass();
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

		this._nowPlayingImage = document.createElement("img");
		this._nowPlayingImage.classList.add("now-playing-image");
		this._nowPlayingImage.alt = "Album Art";
		this._nowPlayingImage.src = "https://i.ytimg.com/vi/ZUfWe-CkgBE/maxresdefault.jpg";

		this._nowPlayingTrackInfo = document.createElement("div");
		this._nowPlayingTrackInfo.classList.add("now-playing-track-info");

		this._nowPlayingSongTitle = document.createElement("div");
		this._nowPlayingSongTitle.classList.add("now-playing-song-title");
		this._nowPlayingSongTitle.textContent = "Song Title";

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
		this._nowPlayingArtistAlbum.appendChild(longDash);
		this._nowPlayingArtistAlbum.appendChild(this._nowPlayingAlbum);

		this._nowPlayingSongAdditionalInfo = document.createElement("div");
		this._nowPlayingSongAdditionalInfo.classList.add("now-playing-song-additional-info");
		this._nowPlayingSongAdditionalInfo.textContent = "Fourth Line";

		this._nowPlayingTrackInfo.appendChild(this._nowPlayingSongTitle);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingArtistAlbum);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingSongAdditionalInfo);

		this._nowPlayingPlayerContainer = document.createElement("div");
		this._nowPlayingPlayerContainer.classList.add("now-playing-player-container");

		const nowPlayingPlayerDropdown = document.createElement('div');
		nowPlayingPlayerDropdown.classList.add('now-playing-player-dropdown');
		const nowPlayingPlayerSelect = document.createElement('select');
		nowPlayingPlayerSelect.classList.add('now-playing-player-select');
		nowPlayingPlayerSelect.id = 'now-playing-player-select';

		const nowPlayingPlayerSelectOption = document.createElement('option');
		nowPlayingPlayerSelectOption.value = ''; // Empty value for validation
		nowPlayingPlayerSelectOption.classList.add('now-playing-player-select-option');
		nowPlayingPlayerSelectOption.textContent = 'Player Name';
		nowPlayingPlayerSelectOption.disabled = true;
		nowPlayingPlayerSelectOption.selected = true;
		nowPlayingPlayerSelect.appendChild(nowPlayingPlayerSelectOption);
		nowPlayingPlayerDropdown.appendChild(nowPlayingPlayerSelect);
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
			nowPlayingPlayerSelect.appendChild(option);
		});

		const nowPlayingPlayerMusicNoteButton = new Ch5LegacyMediaPlayerIconButton();
		nowPlayingPlayerMusicNoteButton.setAttribute('iconClass', "fas fa-music");
		nowPlayingPlayerMusicNoteButton.classList.add("now-playing-player-music-note-button");

		this._nowPlayingPlayerContainer.appendChild(nowPlayingPlayerDropdown);
		this._nowPlayingPlayerContainer.appendChild(nowPlayingPlayerMusicNoteButton);

		this._transportControls = document.createElement('div');
		this.renderProgressBar();
		this.renderActionButtons();
		this.renderMoreActionButtons();

		this._nowPlayingContainer.appendChild(this._nowPlayingPlayerContainer);
		this._nowPlayingContainer.appendChild(this._nowPlayingImage);
		this._nowPlayingContainer.appendChild(this._nowPlayingTrackInfo);
		this._nowPlayingContainer.appendChild(this._transportControls);
		this.renderNextAndPreviousSong();

		this.logger.stop();
	}

	protected renderProgressBar() {
		// Progress bar section
		this._progressBarContainer = document.createElement('div');
		this._progressBarContainer.classList.add('now-playing-progressbar-container');
		// Progress bar input
		this._progressBarInput = document.createElement('input');
		this._progressBarInput.type = 'range';
		this._progressBarInput.min = '0';
		this._progressBarInput.max = '100';
		this._progressBarInput.value = '0';
		this._progressBarInput.classList.add('now-playing-progressbar-input');
		this._progressBarContainer.appendChild(this._progressBarInput);

		// Current time and duration container
		const progressBarCurrentTimeDurationContainer = document.createElement('div');
		progressBarCurrentTimeDurationContainer.classList.add('now-playing-progressbar-current-time-duration-container');
		// Current time
		this._currentTime = document.createElement('span');
		this._currentTime.classList.add('now-playing-progressbar-current-time');
		this._currentTime.textContent = '0:00';
		progressBarCurrentTimeDurationContainer.appendChild(this._currentTime);
		// Duration
		this._duration = document.createElement('span');
		this._duration.classList.add('now-playing-progressbar-duration');
		this._duration.textContent = '0:00';
		progressBarCurrentTimeDurationContainer.appendChild(this._duration);
		this._progressBarContainer.appendChild(progressBarCurrentTimeDurationContainer);
		// Append the progress bar container to the main container
		this._transportControls.appendChild(this._progressBarContainer);
	}

	protected renderActionButtons() {
		this._actionButtonsContainer = document.createElement('div');
		this._actionButtonsContainer.classList.add('now-playing-action-buttons-container');

		const actions = [
			{ class: 'fas fa-thumbs-down' },
			{ class: 'fas fa-step-backward' },
			{ class: 'fas fa-backward' },
			{ class: 'fas fa-play' },
			{ class: 'fas fa-pause', style: 'display:none;' },
			{ class: 'fas fa-forward' },
			{ class: 'fas fa-step-forward' },
			{ class: 'fas fa-thumbs-up' },
		];
		actions.forEach(action => {
			const button = new Ch5LegacyMediaPlayerIconButton();
			button.setAttribute('iconClass', action.class);
			button.style.cssText = action.style || '';
			this._actionButtonsContainer.appendChild(button);
		});

		this._transportControls.appendChild(this._actionButtonsContainer);
	}

	protected renderMoreActionButtons() {
		this._moreActionButtonsContainer = document.createElement('div');
		this._moreActionButtonsContainer.classList.add('now-playing-more-action-buttons-container');

		const actions = [
			{ class: 'fas fa-shuffle' },
			{ class: 'fas fa-repeat' },
			{ class: 'fas fa-notes-medical' },
			{ class: 'fas fa-icons' },
			{ class: 'fas fa-user-plus' },

		];
		actions.forEach(action => {
			const button = new Ch5LegacyMediaPlayerIconButton();
			button.setAttribute('iconClass', action.class);
			this._moreActionButtonsContainer.appendChild(button);
		});

		this._transportControls.appendChild(this._moreActionButtonsContainer);
	}

	protected renderNextAndPreviousSong() {
		this._nextAndPreviousSongContainer = document.createElement('div');
		this._nextAndPreviousSongContainer.classList.add('now-playing-next-and-previous-song-container');
		// Next Song Section
		const nextSongSection = document.createElement('div');
		nextSongSection.classList.add('now-playing-next-song-section');
		//Next Song Label
		this._nextSongLabel = document.createElement('span');
		this._nextSongLabel.classList.add('now-playing-next-song-label');
		this._nextSongLabel.textContent = 'Next up';
		nextSongSection.appendChild(this._nextSongLabel);
		//Next Song Text
		this._nextSongText = document.createElement('span');
		this._nextSongText.classList.add('now-playing-next-song-text');
		this._nextSongText.textContent = 'Song Name Here';
		nextSongSection.appendChild(this._nextSongText);
		this._nextAndPreviousSongContainer.appendChild(nextSongSection);

		// Next and Previous Arrows
		const arrowsContainer = document.createElement('div');
		arrowsContainer.classList.add('now-playing-arrows-container');
		const previousButton = document.createElement('button');
		previousButton.classList.add('fas', 'fa-chevron-left', 'now-playing-arrow-left-button');
		arrowsContainer.appendChild(previousButton);
		const nextButton = document.createElement('button');
		nextButton.classList.add('fas', 'fa-chevron-right', 'now-playing-arrow-right-button');
		arrowsContainer.appendChild(nextButton);
		this._nextAndPreviousSongContainer.appendChild(arrowsContainer);

		this._nowPlayingContainer.appendChild(this._nextAndPreviousSongContainer);
	}


	// Utility: format time
	protected formatTime = (seconds: number): string => {
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

Ch5LegacyMediaPlayerNowPlaying.registerCustomElement();
Ch5LegacyMediaPlayerNowPlaying.registerSignalAttributeTypes();

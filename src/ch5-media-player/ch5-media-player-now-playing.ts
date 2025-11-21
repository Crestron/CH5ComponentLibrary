import { Ch5MediaPlayerIconButton } from "./ch5-media-player-icon-button-base.ts";
import { MusicPlayerLib } from "./music-player.ts";
import { publishEvent, subscribeState } from "../ch5-core/index.ts";
import { TCH5NowPlayingActions, TCh5MediaPlayerProgressbarData } from "./interfaces/t-ch5-media-player.ts";
import { Ch5CommonLog } from "../ch5-common/ch5-common-log.ts";
import { debounce } from "../ch5-common/utils/common-functions.ts";
import { createElement, decodeString, formatTime } from "./ch5-media-player-common.ts";

export class Ch5MediaPlayerNowPlaying {

	//#region Variables

	private _nowPlayingContainer: HTMLElement = {} as HTMLElement;
	private _nowPlayingPlayerContainer: HTMLElement = {} as HTMLElement;
	private _nowPlayingPlayerLabel: HTMLElement = {} as HTMLElement;
	private _nowPlayingImageParent: HTMLElement = {} as HTMLElement;
	private _nowPlayingTrackInfo: HTMLElement = {} as HTMLElement;
	private _nowPlayingSongTitle: HTMLElement = {} as HTMLElement;
	private _nowPlayingArtist: HTMLElement = {} as HTMLElement;
	private _nowPlayingAlbum: HTMLElement = {} as HTMLElement;
	private _nowPlayingArtistAlbum: HTMLElement = {} as HTMLElement;
	private _nowPlayingSongAdditionalInfo: HTMLElement = {} as HTMLElement;
	private _nowPlayingPlayerIconContainer: HTMLElement = {} as HTMLElement;
	private _nowPlayingPlayerIconImage: HTMLElement = {} as HTMLElement;
	private _nowPlayingPlayerIconName: HTMLElement = {} as HTMLElement;
	private _progressBarContainer: HTMLElement = {} as HTMLElement;
	private _progressBarInput: HTMLInputElement = {} as HTMLInputElement;
	private _currentTime: HTMLElement = {} as HTMLElement;
	private _streamState: HTMLElement = {} as HTMLElement;
	private _duration: HTMLElement = {} as HTMLElement;
	private _actionButtonsContainer: HTMLElement = {} as HTMLElement;
	private _moreActionButtonsContainer: HTMLElement = {} as HTMLElement;
	private _nextAndPreviousSongContainer: HTMLElement = {} as HTMLElement;
	private _nextSongLabel: HTMLElement = {} as HTMLElement;
	private _nextSongText: HTMLElement = {} as HTMLElement;
	private _transportControls: HTMLElement = {} as HTMLElement;
	private musicPlayerLibInstance: MusicPlayerLib;
	private nowPlayingData: any;
	private progressBarData: TCh5MediaPlayerProgressbarData = {
		StreamState: '',
		TrackSec: 0,
		ElapsedSec: 0,
		ProgressBar: false
	};

	private demoModeValue: boolean = false;
	private previousAlbumArtUrl: any;
	private previousPlayerIconUrl: any;
	private previousPlayerIcon: any;
	private _nowPlayingPlayerNameContainer: HTMLElement = {} as HTMLElement
	private _nowPlayingPlayerImage: HTMLImageElement = {} as HTMLImageElement;
	private playerName: string = '';

	private readonly NOW_PLAYING_ICONS: any = [
		"mp-logo mp-logo-unknown",
		"mp-logo mp-logo-xm-group",
		"mp-logo mp-logo-sirius-xm-group",
		"mp-logo mp-logo-am-fm-tuner",
		"mp-logo mp-logo-crestron",
		"mp-logo mp-logo-ipod",
		"mp-logo mp-logo-internet-radio",
		"mp-logo mp-logo-satelite",
		"mp-logo mp-logo-pandora",
		"mp-logo mp-logo-librivox",
		"mp-logo mp-logo-spotify",
		"mp-logo mp-logo-jukebox"
	];

	private _separator: HTMLElement = {} as HTMLElement;

	private _progressBarTimer: number | null = null;
	private _progressBarElapsedSec: number = 0;
	private _progressBarTrackSec: number = 0;
	private _progressStreamState: string = '';

	private logger: Ch5CommonLog;

	private readonly NOW_PLAYING_DEMO_DATA = {
		ActionsAvailable: [
			"Shuffle",
			"Repeat",
			"PlayAll",
			"NextTrack",
			"PreviousTrack",
			"Seek",
			"Ffwd",
			"Rewind",
			"Play",
			"ThumbsDown",
			"ThumbsUp"
		],
		Album: "Album Name",
		AlbumArt: true,
		AlbumArtUrl: "",
		AlbumArtUrlNAT: "",
		Artist: "Artist Name",

		ElapsedSec: 120,
		FfwdSpeed: 1,
		Genre: "Genre",
		NextTitle: "Song Name Here",
		PlayerIcon: 0,
		PlayerIconURL: "",
		PlayerName: "Player Name",
		PlayerState: "paused",
		ProgressBar: true,
		ProviderName: "",
		RepeatState: 0,
		RewindSpeed: 1,
		ShuffleState: 0,
		StationName: "Song Title",
		StreamState: "idle",
		Title: "Song Title",
		TrackCnt: 5,
		TrackNum: 2,
		TrackSec: 280
	}

	//#endregion

	//#region Component Lifecycle

	public constructor(musicPlayerLib: MusicPlayerLib) {
		this.logger = new Ch5CommonLog(false, false, "MEDIA_PLAYER:NOW_PLAYING");
		this.musicPlayerLibInstance = musicPlayerLib;
		this.logger.start('constructor()', "ch5-media-player:now-playing");
		this._nowPlayingContainer = createElement('div');
		this.createDefaultNowPlaying();

		subscribeState('o', 'nowPlayingData', ((data: any) => {
			this.logger.log('NowPlayingData----', data);
			if (this.demoModeValue === false) {
				if (data && Object.keys(data).length > 0) {
					this.nowPlayingData = data;
					this.createNowPlaying();
					this.updatedNowPlayingContent();
				} else {
					this.createDefaultNowPlaying();
				}
			}
		}));

		subscribeState('o', 'progressBarData', ((data: any) => {
			if (this._progressBarTimer) {
				clearInterval(this._progressBarTimer);
				this._progressBarTimer = null;
			}
			if (this.demoModeValue) {
				// TODO
				this.updateProgressBarDemoData();
			} else {
				this.progressBarData = data;
				this.logger.log("Progressbar data: ", data);
				if (!this.demoModeValue && this.progressBarData && Object.keys(this.progressBarData).length > 0) {
					if (!this.progressBarData.ProgressBar && this._progressBarContainer) {
						this._progressBarContainer.classList?.add('ch5-hide-dis');
						return;
					}
					this._progressBarContainer.classList?.remove('ch5-hide-dis');
					this._progressStreamState = this.progressBarData.StreamState;
					this._streamState.textContent = this._progressStreamState;
					this._progressBarTrackSec = this.progressBarData.TrackSec;
					this._progressBarElapsedSec = this.progressBarData.ElapsedSec;
					this._progressBarInput.max = this._progressBarTrackSec?.toString();
					this._progressBarInput.value = this._progressBarElapsedSec?.toString();
					if (this._progressBarElapsedSec && this._progressBarTrackSec) {
						this._progressBarInput.style.backgroundSize = ((this._progressBarElapsedSec / this._progressBarTrackSec) * 100) + "% 100%";
					}
					this._currentTime.textContent = formatTime(this._progressBarElapsedSec);
					this._duration.textContent = formatTime(this._progressBarTrackSec - this._progressBarElapsedSec);

					if (this.progressBarData.StreamState === 'streaming' && !this.demoModeValue) {
						this._progressBarTimer = window.setInterval(() => {
							if (this._progressBarElapsedSec < this._progressBarTrackSec) {
								this._progressBarElapsedSec += 1;
								const percent = (this._progressBarElapsedSec / this._progressBarTrackSec) * 100;
								this._progressBarInput.value = this._progressBarElapsedSec?.toString();
								this._progressBarInput.style.backgroundSize = percent + "% 100%";
								this._currentTime.textContent = formatTime(this._progressBarElapsedSec);
								this._duration.textContent = formatTime(this._progressBarTrackSec - this._progressBarElapsedSec);
							} else {
								clearInterval(this._progressBarTimer!);
								this._progressBarTimer = null;
							}
						}, 1000);
					}
				}
			}
		}));

		subscribeState('s', 'receiveStatePlayerNameResp', (value: string) => {
			this.updatePlayerName(value)
		});
	}

	private updateProgressBarDemoData() {
		this.progressBarData.ProgressBar = true;
		this._progressBarContainer.classList?.remove('ch5-hide-dis');
		this._progressBarElapsedSec = this.NOW_PLAYING_DEMO_DATA.ElapsedSec;
		this._progressBarTrackSec = this.NOW_PLAYING_DEMO_DATA.TrackSec;
		this._streamState.textContent = this.NOW_PLAYING_DEMO_DATA.StreamState;
		this._currentTime.textContent = formatTime(this._progressBarElapsedSec);
		this._duration.textContent = formatTime(this._progressBarTrackSec - this._progressBarElapsedSec);
		const percent = (this._progressBarElapsedSec / this._progressBarTrackSec) * 100;
		this._progressBarInput.style.backgroundSize = percent + "% 100%";
		this._progressBarInput.max = this._progressBarTrackSec?.toString();
		this._progressBarInput.value = this._progressBarElapsedSec?.toString();
	}

	public handleDemoMode(demoMode: boolean) {
		if (demoMode) {
			if (this._progressBarTimer) {
				clearInterval(this._progressBarTimer);
				this._progressBarTimer = null;
			}
			this.createNowPlaying();
			this.nowPlayingData = this.NOW_PLAYING_DEMO_DATA;
			this.updatePlayerName(this.nowPlayingData.PlayerName);
			this.updatedNowPlayingContent();
			this.updateProgressBarDemoData();
		} else {
			this.nowPlayingData = '';
			this.createDefaultNowPlaying();
		}
	}

	private updatedNowPlayingContent() {
		this._nowPlayingPlayerLabel.innerHTML = this.playerName === "" ? '&nbsp;' : this.playerName;
		if (this.playerName === "") {
			this._nowPlayingPlayerLabel.classList.add('button-visibility');
		} else {
			this._nowPlayingPlayerLabel.classList.remove('button-visibility');
		}
		this._nowPlayingImageParent.classList.add("now-playing-image-container");
		this._nowPlayingImageParent.classList.add('mp-fallback-album-art');
		const img = new Image();
		const currentAlbumArtUrl = this.nowPlayingData.AlbumArtUrl?.trim() ?? "";
		const currentAlbumArtUrlNat = this.nowPlayingData.AlbumArtUrlNAT?.trim() ?? "";

		if (currentAlbumArtUrl && currentAlbumArtUrl !== this.previousAlbumArtUrl) {
			const imageUrl = currentAlbumArtUrl;
			img.addEventListener('load', () => {
				this._nowPlayingImageParent.style.backgroundImage = `url('${imageUrl}')`;
				this.previousAlbumArtUrl = imageUrl;
			});
			img.addEventListener('error', () => {
				if (!this.previousAlbumArtUrl || this.previousAlbumArtUrl === imageUrl) {
					this._nowPlayingImageParent.style.removeProperty("backgroundImage");
					this.previousAlbumArtUrl = null;
				}
			});
			img.src = imageUrl;
		} else if (currentAlbumArtUrlNat && currentAlbumArtUrlNat !== this.previousAlbumArtUrl) {
			const imageUrl = currentAlbumArtUrlNat;
			img.addEventListener('load', () => {
				this._nowPlayingImageParent.style.backgroundImage = `url('${imageUrl}')`;
				this.previousAlbumArtUrl = imageUrl;
			});
			img.addEventListener('error', () => {
				if (!this.previousAlbumArtUrl || this.previousAlbumArtUrl === imageUrl) {
					this._nowPlayingImageParent.style.removeProperty("backgroundImage");
					this.previousAlbumArtUrl = null;
				}
			});
			img.src = imageUrl;
		} else if (!currentAlbumArtUrl && !currentAlbumArtUrlNat) {
			this._nowPlayingImageParent.style.removeProperty("backgroundImage");
			this.previousAlbumArtUrl = null;
		} else {
			if (this.previousAlbumArtUrl && (!this._nowPlayingImageParent.style.backgroundImage || this._nowPlayingImageParent.style.backgroundImage === '')) {
				this._nowPlayingImageParent.style.backgroundImage = `url('${this.previousAlbumArtUrl}')`;
			}
		}
		this._nowPlayingSongTitle.children[0].textContent = decodeString(this.nowPlayingData.Title);
		this.updateMarquee();

		this._nowPlayingArtist.textContent = decodeString(this.nowPlayingData.Artist);
		this._nowPlayingAlbum.textContent = decodeString(this.nowPlayingData.Album);
		if (!this.nowPlayingData.Album?.trim() || !this.nowPlayingData.Artist?.trim()) {
			this._separator.classList?.add('ch5-hide-dis');
		} else {
			this._separator.classList?.remove('ch5-hide-dis');
		}
		this._nowPlayingSongAdditionalInfo.textContent = this.nowPlayingData.TrackCnt > 0 ? `${this.nowPlayingData.TrackNum} of ${this.nowPlayingData.TrackCnt}  ${this.nowPlayingData.Genre}` : '';

		this._nowPlayingPlayerIconImage.classList.add("now-playing-player-icon-image");
		//this._nowPlayingPlayerIconImage.classList.add(...this.NOW_PLAYING_ICONS[0].split(' '));
		const currentPlayerIconUrl = this.nowPlayingData.PlayerIconURL?.trim() ?? "";
		const currentPlayerIcon = this.nowPlayingData.PlayerIcon;
		const playerIconImg = new Image();

		if (currentPlayerIconUrl && currentPlayerIconUrl !== this.previousPlayerIconUrl) {
			const imgUrl = currentPlayerIconUrl;
			playerIconImg.addEventListener('load', () => {
				this._nowPlayingPlayerIconImage.style.backgroundImage = `url('${imgUrl}')`;
				this.previousPlayerIconUrl = imgUrl;
				this.previousPlayerIcon = null;
			});
			playerIconImg.addEventListener('error', () => {
				if (!this.previousPlayerIconUrl || this.previousPlayerIconUrl === imgUrl) {
					this._nowPlayingPlayerIconImage.style.removeProperty("backgroundImage");
					this.previousPlayerIconUrl = null;
				}
			});
			playerIconImg.src = imgUrl;
		} else if (currentPlayerIcon && !isNaN(currentPlayerIcon) && currentPlayerIcon > 0 && currentPlayerIcon < this.NOW_PLAYING_ICONS.length && currentPlayerIcon !== this.previousPlayerIcon && currentPlayerIconUrl !== "") {
			this._nowPlayingPlayerIconImage.classList?.remove(...Array.from(this._nowPlayingPlayerIconImage.classList));
			this._nowPlayingPlayerIconImage.classList.add("now-playing-player-icon-image");
			this._nowPlayingPlayerIconImage.style.removeProperty("backgroundImage");
			if (this.NOW_PLAYING_ICONS[currentPlayerIcon]) {
				this._nowPlayingPlayerIconImage.classList.add(...this.NOW_PLAYING_ICONS[currentPlayerIcon].split(' '));
			}
			this.previousPlayerIcon = currentPlayerIcon;
			this.previousPlayerIconUrl = null;
		} else if (!currentPlayerIconUrl && (!currentPlayerIcon || isNaN(currentPlayerIcon) || currentPlayerIcon <= 0 || currentPlayerIcon >= this.NOW_PLAYING_ICONS.length)) {
			this._nowPlayingPlayerIconImage.style.removeProperty("backgroundImage");
			if (this.nowPlayingData.ProviderName || this.nowPlayingData.PlayerName) {
				this._nowPlayingPlayerIconImage.classList.add(...this.NOW_PLAYING_ICONS[0].split(' '));
			}
			this.previousPlayerIconUrl = null;
			this.previousPlayerIcon = null;
		} else {
			// Restore previous image if needed
			if (this.previousPlayerIconUrl && (!this._nowPlayingPlayerIconImage.style.backgroundImage || this._nowPlayingPlayerIconImage.style.backgroundImage === '' && currentPlayerIconUrl !== "")) {
				this._nowPlayingPlayerIconImage.style.backgroundImage = `url('${this.previousPlayerIconUrl}')`;
			}
			// Restore previous fallback class if no image and previous index exists
			else if (this.previousPlayerIcon !== null && (!this._nowPlayingPlayerIconImage.style.backgroundImage || this._nowPlayingPlayerIconImage.style.backgroundImage === '') && currentPlayerIconUrl !== "") {
				this._nowPlayingPlayerIconImage.classList?.remove(...Array.from(this._nowPlayingPlayerIconImage.classList));
				this._nowPlayingPlayerIconImage.classList.add("now-playing-player-icon-image");
				if (this.NOW_PLAYING_ICONS[this.previousPlayerIcon] && currentPlayerIconUrl !== "") {
					this._nowPlayingPlayerIconImage.classList.add(...this.NOW_PLAYING_ICONS[this.previousPlayerIcon].split(' '));
				}
			}
		}

		this._nowPlayingPlayerIconName.textContent = this.nowPlayingData.ProviderName || this.nowPlayingData.PlayerName;
		if (!this.nowPlayingData.ActionsAvailable.includes(TCH5NowPlayingActions.Seek)) {
			this._progressBarInput.classList.add('hide-progressbar-thumb');
			this._progressBarInput.removeEventListener('input', this.handleProgressbarInput);
		} else {
			this._progressBarInput.classList.remove('hide-progressbar-thumb');
			this._progressBarInput.addEventListener('input', this.handleProgressbarInput);
		}
		this.renderActionButtons(this.nowPlayingData.ActionsAvailable, this.nowPlayingData.PlayerState);
		this.renderMoreActionButtons(this.nowPlayingData.ActionsAvailable, this.nowPlayingData.RepeatState, this.nowPlayingData.ShuffleState);
		this._nowPlayingContainer.appendChild(this._transportControls);
		this.renderNextAndPreviousSong(this.nowPlayingData.NextTitle);
		if (!this.progressBarData.ProgressBar) {
			this._progressBarContainer.classList?.add('ch5-hide-dis');
		} else {
			this._progressBarContainer.classList?.remove('ch5-hide-dis');
		}
	}

	public updatePlayerName(value: string) {
		this.playerName = value;
		this._nowPlayingPlayerLabel.textContent = value;
	}

	public updateMarquee() {
		if ((this._nowPlayingSongTitle.children && this._nowPlayingSongTitle.children[0] as HTMLSpanElement)?.offsetWidth > this._nowPlayingSongTitle.offsetWidth) {
			this._nowPlayingSongTitle.classList?.add('marquee-item');
		} else {
			this._nowPlayingSongTitle.classList?.remove('marquee-item');
		}
	}

	public createInternalHtml() {
		return this._nowPlayingContainer;
	}

	//default now playing 
	protected createDefaultNowPlaying() {
		if (this._nowPlayingContainer) {
			this._nowPlayingContainer.className = "";
			this._nowPlayingContainer.innerHTML = "";
		}
		this._nowPlayingContainer.classList.add("ch5-media-player--now-playing-default");
		const defaultProviderContainer = createElement('div', ['default-provider-container'], 'No Content Provider');
		const defaultAlbumArtContainer = createElement('div', ["default-album-art-container"]);
		const defaultTrackInfoContainer = createElement('div', ['default-track-info-container']);
		const trackInfoNotPlaying = createElement('div', [], 'Not Playing');
		const trackInfoNone = createElement('div', [], '— —');
		defaultTrackInfoContainer.append(trackInfoNotPlaying, trackInfoNone);
		const defaultProgressbarContainer = createElement('div', ['default-progressbar-container']);
		const progressbarDefault = createElement('div', ['progressbar-default']);
		const progressbarDefaultTime = createElement('div', ['progressbar-default-time']);
		const progressbarTimeNone = createElement('div', [], '— : — —');
		progressbarDefaultTime.append(progressbarTimeNone, progressbarTimeNone.cloneNode(true));
		defaultProgressbarContainer.append(progressbarDefault, progressbarDefaultTime);
		const defaultActionsContainer = createElement('div', ['default-actions-container']);
		const defaultBackwardIcon = new Ch5MediaPlayerIconButton();
		defaultBackwardIcon.setAttribute('iconClass', "mp-icon mp-fast-backward");
		defaultBackwardIcon.title = "Default Backward ";
		const defaultPlayIcon = new Ch5MediaPlayerIconButton();
		defaultPlayIcon.setAttribute('iconClass', "mp-icon mp-play");
		defaultPlayIcon.title = "Default Play";
		const defaultforwardIcon = new Ch5MediaPlayerIconButton();
		defaultforwardIcon.setAttribute('iconClass', "mp-icon mp-fast-forward");
		defaultforwardIcon.title = "Default Forward";
		defaultActionsContainer.append(defaultBackwardIcon, defaultPlayIcon, defaultforwardIcon);
		this._nowPlayingContainer.append(defaultProviderContainer, defaultAlbumArtContainer, defaultTrackInfoContainer, defaultProgressbarContainer, defaultActionsContainer);
	}

	protected createNowPlaying() {
		if (this._nowPlayingContainer) {
			this._nowPlayingContainer.className = "";
			this._nowPlayingContainer.innerHTML = "";
		}
		this.logger.start('createInternalHtml()');
		this._nowPlayingContainer.classList.add("ch5-media-player--now-playing");
		this.renderProviderOrPlayer();
		this.renderAlbumArt();
		this.renderTrackInfo();
		this._transportControls = createElement('div', ["now-playing-controls-container"]);
		this.renderProgressBar();
		this.renderActionButtons([], "paused");
		this.renderMoreActionButtons([]);
		this._nowPlayingContainer.appendChild(this._transportControls);
		this.renderNextAndPreviousSong("");
		this.logger.stop();
	}

	protected renderProviderOrPlayer() {
		//Now playing player
		this._nowPlayingPlayerContainer = createElement("div", ["now-playing-player-container"]);
		this._nowPlayingPlayerNameContainer = createElement('div', ['now-playing-player-name-container']);
		this._nowPlayingPlayerLabel = createElement('div', ['now-playing-player-label']);
		this._nowPlayingPlayerNameContainer.appendChild(this._nowPlayingPlayerLabel);
		this._nowPlayingPlayerContainer.appendChild(this._nowPlayingPlayerNameContainer);

		//Now Playing Player Music Note
		const nowPlayingPlayerMusicNoteButton = new Ch5MediaPlayerIconButton();
		nowPlayingPlayerMusicNoteButton.setAttribute('iconClass', "mp-icon mp-music-note-dbl");
		nowPlayingPlayerMusicNoteButton.title = "My Music Section";
		nowPlayingPlayerMusicNoteButton.classList.add("now-playing-player-music-note-button");
		nowPlayingPlayerMusicNoteButton.addEventListener('click', () => {
			publishEvent('b', 'showMyMusicComponent', true);
		});
		this._nowPlayingPlayerContainer.appendChild(nowPlayingPlayerMusicNoteButton);
		this._nowPlayingContainer.appendChild(this._nowPlayingPlayerContainer);
	}

	protected renderAlbumArt() {
		//Now Playing Image
		this._nowPlayingImageParent = createElement("div", ["mp-fallback-album-art", "now-playing-image"]);
		this._nowPlayingContainer.appendChild(this._nowPlayingImageParent);
	}

	protected renderTrackInfo() {
		this._nowPlayingTrackInfo = createElement("div", ["now-playing-track-info"]); // Now Playing Track Information
		this._nowPlayingSongTitle = createElement("div", ["now-playing-song-title"]); //Now Playing Song Title
		const songTitleMarqueeSpan = createElement("span", [], '');
		this._nowPlayingSongTitle.appendChild(songTitleMarqueeSpan);
		//Now Playing Song Artist and Album
		this._nowPlayingArtistAlbum = createElement("div", ["now-playing-artist-album"]);
		this._nowPlayingArtist = createElement("span", ["now-playing-artist-name"]);
		this._nowPlayingAlbum = createElement("span", ["now-playing-album-name"]);
		this._separator = createElement("span", [], ' — ');

		this._nowPlayingArtistAlbum.appendChild(this._nowPlayingArtist);
		this._nowPlayingArtistAlbum.appendChild(this._separator);
		this._nowPlayingArtistAlbum.appendChild(this._nowPlayingAlbum);
		//Now Playing Song Additional Information
		this._nowPlayingSongAdditionalInfo = createElement("div", ["now-playing-song-additional-info"]);
		//Now Playing Player Icon Image and Name Container
		this._nowPlayingPlayerIconContainer = createElement('div', ["now-playing-player-icon-container"]);
		//Now Playing Player Icon Image
		this._nowPlayingPlayerIconImage = createElement('div', ["now-playing-player-icon-image"]);

		//Now Playing Player Icon Name
		this._nowPlayingPlayerIconName = createElement('div', ["now-playing-player-icon-name"]);
		this._nowPlayingPlayerIconContainer.appendChild(this._nowPlayingPlayerIconImage);
		this._nowPlayingPlayerIconContainer.appendChild(this._nowPlayingPlayerIconName);

		this._nowPlayingTrackInfo.appendChild(this._nowPlayingSongTitle);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingArtistAlbum);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingSongAdditionalInfo);
		this._nowPlayingTrackInfo.appendChild(this._nowPlayingPlayerIconContainer);

		this._nowPlayingContainer.appendChild(this._nowPlayingTrackInfo);
	}

	public seekApiCall = debounce(() => {
		this.musicPlayerLibInstance.nowPlayingvent(TCH5NowPlayingActions.Seek, this._progressBarInput.value);
	}, 150);

	protected renderProgressBar() {
		// Progress bar section
		this._progressBarContainer = createElement('div', ['now-playing-progressbar-container']);
		// Progress bar input
		this._progressBarInput = document.createElement('input');
		this._progressBarInput.type = 'range';
		this._progressBarInput.min = '0';
		this._progressBarInput.max = this._progressBarTrackSec ? this._progressBarTrackSec.toString() : '0';
		this._progressBarInput.value = this._progressBarElapsedSec?.toString();
		if (this._progressBarElapsedSec && this._progressBarTrackSec) {
			this._progressBarInput.style.backgroundSize = ((this._progressBarElapsedSec / this._progressBarTrackSec) * 100) + "% 100%";
		}
		this._progressBarInput.classList.add('now-playing-progressbar-input');
		this._progressBarContainer.appendChild(this._progressBarInput);

		// Current time and duration container
		const progressBarCurrentTimeDurationContainer = createElement('div', ['now-playing-progressbar-current-time-duration-container']);
		this._currentTime = createElement('span');
		this._currentTime.textContent = formatTime(this._progressBarElapsedSec);
		progressBarCurrentTimeDurationContainer.appendChild(this._currentTime);
		this._streamState = createElement('span');
		this._streamState.textContent = this._progressStreamState;
		progressBarCurrentTimeDurationContainer.appendChild(this._streamState);
		this._duration = createElement('span');
		this._duration.textContent = formatTime(parseInt(this._progressBarInput.max) - parseInt(this._progressBarInput.value));
		progressBarCurrentTimeDurationContainer.appendChild(this._duration);
		this._progressBarContainer.appendChild(progressBarCurrentTimeDurationContainer);

		//Seek
		this._progressBarInput.addEventListener("input", this.handleProgressbarInput);
		// Append the progress bar container to the main container
		this._transportControls.appendChild(this._progressBarContainer);
	}

	protected handleProgressbarInput = () => {
		this._progressBarInput.style.backgroundSize = ((parseInt(this._progressBarInput.value) / parseInt(this._progressBarInput.max)) * 100) + "% 100%";
		this._currentTime.textContent = formatTime(parseInt(this._progressBarInput.value));
		this._duration.textContent = formatTime(parseInt(this._progressBarInput.max) - parseInt(this._progressBarInput.value));
		this._progressBarElapsedSec = parseInt(this._progressBarInput.value);
		this.logger.log('_currentTime==', this._progressBarInput.value);
		this.seekApiCall();
	}

	protected renderActionButtons(availableActions: TCH5NowPlayingActions[], PlayerState: string) {
		if (this._actionButtonsContainer && this._actionButtonsContainer.parentNode) {
			this._actionButtonsContainer.parentNode.removeChild(this._actionButtonsContainer);
		}
		this._actionButtonsContainer = createElement('div', ['now-playing-action-buttons-container']);

		const actionIconMap: { [key: string]: { class: string } } = {
			[TCH5NowPlayingActions.ThumbsDown]: { class: 'mp-icon mp-thumbs-down' },
			[TCH5NowPlayingActions.PreviousTrack]: { class: 'mp-icon mp-skip-back' },
			[TCH5NowPlayingActions.Rewind]: { class: 'mp-icon mp-fast-backward' },
			[TCH5NowPlayingActions.Play]: { class: 'mp-icon mp-play' },
			[TCH5NowPlayingActions.Ffwd]: { class: 'mp-icon mp-fast-forward' },
			[TCH5NowPlayingActions.NextTrack]: { class: 'mp-icon mp-skip-forward' },
			[TCH5NowPlayingActions.ThumbsUp]: { class: 'mp-icon mp-thumbs-up' }
		};

		Object.keys(actionIconMap).forEach(actionItem => {
			const button = new Ch5MediaPlayerIconButton();
			button.title = actionItem;
			const action = TCH5NowPlayingActions[actionItem as keyof typeof TCH5NowPlayingActions];
			if (action === TCH5NowPlayingActions.Play) {
				if ((availableActions.includes(TCH5NowPlayingActions.Play) && availableActions.includes(TCH5NowPlayingActions.Pause)) && PlayerState !== 'playing') {
					button.setAttribute('iconClass', actionIconMap[action].class);
					button.onclick = () => {
						this.musicPlayerLibInstance.nowPlayingvent(action);
					};
				} else if (PlayerState === "stopped" || PlayerState === "") {
					button.setAttribute('iconClass', actionIconMap[action].class);
					button.onclick = () => {
						this.musicPlayerLibInstance.nowPlayingvent(action);
					};
				} else if (availableActions.includes(TCH5NowPlayingActions.Play) && PlayerState !== 'playing') {
					button.setAttribute('iconClass', actionIconMap[action].class);
					button.onclick = () => {
						this.musicPlayerLibInstance.nowPlayingvent(action);
					};
				} else {
					button.setAttribute('iconClass', "mp-icon mp-pause");
					button.title = TCH5NowPlayingActions.Pause;
					button.onclick = () => {
						this.musicPlayerLibInstance.nowPlayingvent(TCH5NowPlayingActions.Pause);
					};
				}
			} else {
				button.setAttribute('iconClass', actionIconMap[action].class);
				button.onclick = () => {
					this.musicPlayerLibInstance.nowPlayingvent(action);
				};
			}

			if (availableActions.includes(action)) {
				button.classList.remove('button-visibility');
				if (action === TCH5NowPlayingActions.Play) {
					button.removeAttribute('disableIconButton');
				}
				if (action === TCH5NowPlayingActions.ThumbsDown || action === TCH5NowPlayingActions.ThumbsUp) {
					if (this.nowPlayingData['Rating']?.current === -1 && action === TCH5NowPlayingActions.ThumbsDown) {
						button.classList.add('active');
					} else if (this.nowPlayingData['Rating']?.current === 1 && action === TCH5NowPlayingActions.ThumbsUp) {
						button.classList.add('active');
					} else {
						button.classList.remove('active');
					}
				}
			} else {
				if (action === TCH5NowPlayingActions.Play) {
					button.classList.remove('button-visibility');
					if (!availableActions.includes(TCH5NowPlayingActions.Pause)) {
						button.setAttribute('disableIconButton', 'true');
					}
				} else {
					button.classList.add('button-visibility');
				}
			}

			this._actionButtonsContainer.appendChild(button);
		});

		this._transportControls.appendChild(this._actionButtonsContainer);
	}

	protected renderMoreActionButtons(availableActions: string[], repeat: number = 2, shuffle: number = 1) {
		if (this._moreActionButtonsContainer && this._moreActionButtonsContainer.parentNode) {
			this._moreActionButtonsContainer.parentNode.removeChild(this._moreActionButtonsContainer);
		}
		this._moreActionButtonsContainer = createElement('div', ['now-playing-more-action-buttons-container']);

		this._moreActionButtonsContainer.innerHTML = "";
		const moreActionIconMap: { [key: string]: { class: string, style?: string } } = {
			[TCH5NowPlayingActions.Shuffle]: { class: shuffle === 0 ? 'mp-icon mp-shuffle-off' : 'mp-icon mp-shuffle-02' },
			[TCH5NowPlayingActions.Repeat]: { class: repeat === 0 ? 'mp-icon mp-repeat-off' : repeat === 1 ? 'mp-icon mp-repeat-1x_1' : 'mp-icon mp-repeat-03' },
			[TCH5NowPlayingActions.PlayAll]: { class: 'mp-icon mp-play-multi-square' },
			[TCH5NowPlayingActions.NextTrack]: { class: 'mp-icon mp-music-note-plus' },
			[TCH5NowPlayingActions.UserNote]: { class: 'mp-icon mp-image-user-plus' }
		};

		if (Array.isArray(availableActions)) {
			Object.keys(moreActionIconMap).forEach((action: string) => {
				if (availableActions?.includes(action)) {
					const button = new Ch5MediaPlayerIconButton();
					button.setAttribute('iconClass', moreActionIconMap[action].class);
					button.title = action;
					button.onclick = () => {
						this.musicPlayerLibInstance.nowPlayingvent(TCH5NowPlayingActions[action as keyof typeof TCH5NowPlayingActions]);
					}
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
		if (nextSong) {
			this._nextAndPreviousSongContainer = createElement('div', ['now-playing-next-and-previous-song-container']);
			// Next Song Section
			const nextSongSection = createElement('div', ['now-playing-next-song-container']);
			//Next Song Label
			this._nextSongLabel = createElement('span', ['now-playing-next-song-label'], 'Next up');
			nextSongSection.appendChild(this._nextSongLabel);
			//Next Song Text
			this._nextSongText = createElement('span', ['now-playing-next-song-text'], nextSong);
			nextSongSection.appendChild(this._nextSongText);
			this._nextAndPreviousSongContainer.appendChild(nextSongSection);

			this._nowPlayingContainer.appendChild(this._nextAndPreviousSongContainer);
		}
	}

	//#endregion

}

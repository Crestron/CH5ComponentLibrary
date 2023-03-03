import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SampleAspectRatio, } from './interfaces/t-ch5-sample';
import { ICh5SampleAttributes } from './interfaces/i-ch5-sample-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { ICh5VideoPublishEvent, TDimension, TPosDimension, TVideoResponse } from "./interfaces/interfaces-helper";
import { publishEvent } from '../ch5-core/utility-functions/publish-signal';
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { CH5VideoUtils } from "./ch5-video-utils";

export class Ch5Sample extends Ch5Common implements ICh5SampleAttributes {

	//#region Variables

	public static readonly ASPECT_RATIO: TCh5SampleAspectRatio[] = ['16:9', '4:3'];
	public static readonly COMPONENT_DATA: any = {
		ASPECT_RATIO: {
			default: Ch5Sample.ASPECT_RATIO[0],
			values: Ch5Sample.ASPECT_RATIO,
			key: 'aspectRatio',
			attribute: 'aspectRatio',
			classListPrefix: '--aspect-ratio-'
		},
	};
	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,

	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

		{
			default: Ch5Sample.ASPECT_RATIO[0],
			enumeratedValues: Ch5Sample.ASPECT_RATIO,
			name: "aspectRatio",
			removeAttributeOnNull: true,

			type: "enum",
			valueOnAttributeEmpty: Ch5Sample.ASPECT_RATIO[0],
			isObservableProperty: true,

		},
		{
			default: "",
			name: "indexId",

			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,

		},
		{
			default: "",
			name: "url",

			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,

		},
		{
			default: "",
			name: "userid",

			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,

		},
		{
			default: "",
			name: "password",

			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,

		},
	];

	public static readonly ELEMENT_NAME = 'ch5-sample';

	public primaryCssClass = 'ch5-sample';

	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;
	private _vidControlPanel: HTMLElement = {} as HTMLElement;
	private _controlFullScreen: HTMLElement = {} as HTMLElement;
	private _onClick: any = null;
	private lastRequestStatus: string = '';
	private isVideoReady: boolean = false;
	private readonly INTERSECTION_RATIO_VALUE: number = 0.98;
	private readonly primaryVideoCssClass: string = 'ch5-video';
	private readonly fullScreenStyleClass: string = 'fullScreenStyle'
	private readonly showControl: string = 'show-control';
	private playValue: boolean = true;
	private isSwipeDebounce: any;
	private lastResponseStatus: string = '';
	private isOrientationChanged: boolean = false;
	private isFullScreen: boolean = false;
	private isExitFullscreen: boolean = false;
	private fromExitFullScreen: boolean = false;
	private sizeObj: TDimension = { width: 0, height: 0 };
	private position: { xPos: number, yPos: number } = { xPos: 0, yPos: 0 };
	private responseObj: TVideoResponse = {} as TVideoResponse;
	private fullScreenObj: TPosDimension = {} as TPosDimension;
	private isAlphaBlend: boolean = true;
	private oldResponseStatus: string = '';
	private oldResponseId: number = 0;
	private _wasAppBackGrounded: boolean = false;
	private isVideoPublished = false;
	/**
	 * CH5 Unique ID
	 */
	public ch5UId: number = 0;
	/**
	 * X-Axis Position of the CH5-Video
	 */
	private videoTop: number = -1;
	/**
	 * Y-Axis Position of the CH5-Video
	 */
	/**
	 * The display size for the video. The default size will be small if not mentioned.
	 *
	 * @type {string}
	 * @private
	 */
	private size: string = 'large';
	private videoLeft: number = -1;
	private readonly VIDEO_ACTION = {
		START: 'start',
		STARTED: 'started',
		STOP: 'stop',
		STOPPED: 'stopped',
		RESIZE: 'resize',
		RESIZED: 'resized',
		REFILL: 'refill',
		SNAPSHOT: 'snapshot',
		MARK: 'mark',
		NOURL: 'nourl',
		FULLSCREEN: 'fullscreen',
		ERROR: 'error',
		EMPTY: ''
	}


	/**
	 * SVG Icons for the controls
	 */
	private readonly SVG_ICONS = {
		EXIT_FULLSCREEN_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
		FULLSCREEN_ICON: '<svg xmlns="http://www.w3.org/2000/svg" class="svgIconStyle" class="svgIconStyle" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
	}



	//#endregion

	//#region Getters and Setters


	public set aspectRatio(value: TCh5SampleAspectRatio) {
		this._ch5Properties.set<TCh5SampleAspectRatio>("aspectRatio", value, () => {
			this.handleAspectRatio();
		});
	}
	public get aspectRatio(): TCh5SampleAspectRatio {
		return this._ch5Properties.get<TCh5SampleAspectRatio>("aspectRatio");
	}

	public set indexId(value: string) {
		this._ch5Properties.set<string>("indexId", value, () => {
			this.handleIndexId();
		});
	}
	public get indexId(): string {
		return this._ch5Properties.get<string>("indexId");
	}

	public set url(value: string) {
		this._ch5Properties.set<string>("url", value, () => {
			this.handleUrl();
		});
	}
	public get url(): string {
		return this._ch5Properties.get<string>("url");
	}

	public set userid(value: string) {
		this._ch5Properties.set<string>("userid", value, () => {
			this.handleUserid();
		});
	}
	public get userid(): string {
		return this._ch5Properties.get<string>("userid");
	}

	public set password(value: string) {
		this._ch5Properties.set<string>("password", value, () => {
			this.handlePassword();
		});
	}
	public get password(): string {
		return this._ch5Properties.get<string>("password");
	}


	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Sample.ELEMENT_NAME, Ch5Sample.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Sample.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Sample.ELEMENT_NAME, Ch5Sample);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5Sample.ELEMENT_NAME);
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5Sample.COMPONENT_PROPERTIES);
		this._onClick = this.toggleFullScreen.bind(this);
		this.updateCssClass();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Sample.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Sample.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Sample.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-sample attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5Sample.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5Sample component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5Sample.ELEMENT_NAME);
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Video);
		}
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-sample');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);
		customElements.whenDefined('ch5-sample').then(() => {
			this._initializeVideo();
			this.componentLoadedEvent(Ch5Sample.ELEMENT_NAME, this.id);
			/* if (!this.isMultipleVideo) {
				this.getAllSnapShotData(1);
				this.loadAllSnapshots(); // start loading snapshots
			} */
			// Making the lastRequestStatus and isVideoReady to default
			this.lastRequestStatus = this.VIDEO_ACTION.EMPTY;
			this.isVideoReady = false;
		});
		Ch5CoreIntersectionObserver.getInstance().observe(this, this.videoIntersectionObserver.bind(this));
		//this.isIntersectionObserve = true;
		this.logger.stop();
	}

	/**
	 * Initializes the elements of ch5-video
	 */
	private _initializeVideo() {
		const uID = this.getCrId().split('cr-id-')[1];
		this.ch5UId = parseInt(uID[1], 0);
		//this.videoTagId = this.getCrId();
		// A dummy call to make the video to play on first project load
		publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(this.VIDEO_ACTION.STOP, this.ch5UId));
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
		this.classList.add(this.primaryVideoCssClass);
		this.style.width = "100%";
		this.style.height = "100%";
		this.style.display = "flex";
		this.style.justifyContent = "center";
		this.style.alignItems = "center";
		// Create main control panel
		this._vidControlPanel = document.createElement("div");
		this._vidControlPanel.classList.add("control-panel");
		// Create div for the right side of the control panel
		this._controlFullScreen = document.createElement("a");
		this._controlFullScreen.classList.add("control");
		this._controlFullScreen.innerHTML = this.SVG_ICONS.FULLSCREEN_ICON;
		this._vidControlPanel.appendChild(this._controlFullScreen);
		this._vidControlPanel.style.width = '100%';
		this._vidControlPanel.style.left = '-5px';
		this._vidControlPanel.style.top = '5px';

		this._elContainer.classList.add('video-wrapper');
		this._elContainer.style.background = '#000';
		this.appendChild(this._elContainer);
		this._elContainer.appendChild(this._vidControlPanel);
		this.logger.stop();
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5Sample.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Sample.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Sample.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Sample.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected attachEventListeners() {
		super.attachEventListeners();
		this._controlFullScreen.addEventListener('click', this._onClick);
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


	private handleAspectRatio() {
		Array.from(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.values).forEach((e: any) => {
			this._elContainer.classList.remove(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + e);
		});
		this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);
	}
	private handleIndexId() {
		// Enter your Code here
	}
	private handleUrl() {
		// Enter your Code here
	}
	private handleUserid() {
		// Enter your Code here
	}
	private handlePassword() {
		// Enter your Code here
	}

	/**
	 * When the video goes to the full screen
	 */
	private toggleFullScreen() {
		/* if (this.isFullScreen) {
			this._exitFullScreen();
		} else {
			this.info('Ch5Video.enterFullScreen()');
			this.isFullScreen = true;
			// To avoid swiping on the full screen
			this.addEventListener('touchmove', this._handleTouchMoveEvent_Fullscreen, { passive: true });
			this._hideFullScreenIcon();

			if (!!this.fullScreenOverlay && !!this.fullScreenOverlay.classList) {
				this.fullScreenOverlay.classList.add(this.primaryVideoCssClass + '--overlay');
			}
			this.vidControlPanel.classList.add("fullScreen");
			this.controlFullScreen.innerHTML = this.ESVG_ICONS.EXIT_FULLSCREEN_ICON;
			this.classList.add(this.fullScreenStyleClass);
			document.body.classList.add(this.fullScreenBodyClass);
			this.style.visibility = 'visible';
			this.isVideoReady = true;
			this.isOrientationChanged = false;
			this.style.width = "100%";
			this.style.height = "100%";
			this._publishVideoEvent(this.VIDEO_ACTION.FULLSCREEN);
		} */
	}

	private videoStopObjJSON(actionType: string, uId: number): ICh5VideoPublishEvent {
		this.lastRequestStatus = actionType;
		const retObj: any = {
			"action": actionType,
			"id": uId
		};
		this.info(JSON.stringify(retObj));
		return retObj;
	}

	private updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();

		this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);

		this.logger.stop();
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	/**
	 * When the video element is more than 100% visible the video should start and
	 * when the visibility is less than 100% the video should stop playing.
	 */
	public videoIntersectionObserver() {
		this.info("videoIntersectionObserver#intersectionRatio -> " + this.elementIntersectionEntry.intersectionRatio);
		//this.lastBackGroundRequest = "";
		if (this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE && this.playValue) {
			// this.loadAllSnapshots();
			this._onRatioAboveLimitToRenderVideo();
		} else {
			this._OnVideoAspectRatioConditionNotMet();
		}

		// Removes or Adds document level touch handlers if in view
		/* if (this.elementIntersectionEntry.intersectionRatio > 0.1 && this.playValue) {
			this.addTouchPollingForVideoMonitor();
		} else {
			this._publishVideoEvent(this.VIDEO_ACTION.STOP);
			this.removeTouchPollingForVideoMonitor();
		} */
	}

	/**
	 * Function to render video if it is under the visible range | supposed to be shown
	 * this.elementIntersectionEntry.intersectionRatio >= this.INTERSECTION_RATIO_VALUE
	 */
	private _onRatioAboveLimitToRenderVideo() {
		/* this.info("Task: Under ratio, render video - ",
			this.lastRequestStatus, this.isFullScreen, this.isExitFullscreen,
			this.fromExitFullScreen, this.isOrientationChanged); */
		clearTimeout(this.isSwipeDebounce);
		this.isSwipeDebounce = setTimeout(() => {
			// this.ch5BackgroundAction(this.VIDEO_ACTION.REFILL, "onRatioAboveLimitToRenderVideo()#isSwipeDebounce");
			this.calculation();

			// This condition will avoid drawing snapshot during orientation change in iOS devices
			/* if (this.lastRequestStatus !== this.VIDEO_ACTION.START && this.lastRequestStatus !== this.VIDEO_ACTION.RESIZE) {
				this.beforeVideoDisplay();
			} */

			let isPublished = false;
			if (this.lastRequestStatus === this.VIDEO_ACTION.EMPTY && this.isOrientationChanged ||
				this.lastRequestStatus === this.VIDEO_ACTION.START) {
				this.lastResponseStatus = this.VIDEO_ACTION.EMPTY;
				this.lastRequestStatus = this.VIDEO_ACTION.EMPTY;
				this.isVideoReady = false;
				isPublished = true;
				this._publishVideoEvent(this.VIDEO_ACTION.START);
			}
			if (!this.isFullScreen && !this.isExitFullscreen && !this.isOrientationChanged &&
				this.lastRequestStatus !== this.VIDEO_ACTION.FULLSCREEN && !this.fromExitFullScreen) {
				this.lastResponseStatus = this.VIDEO_ACTION.EMPTY;
				this.lastRequestStatus = this.VIDEO_ACTION.EMPTY;
				this.isVideoReady = false;
				if (!isPublished) {
					this._publishVideoEvent(this.VIDEO_ACTION.START);
				}
			}
		}, 100); // reducing this will create a cut at wrong place
	}

	/**
	 * Function to render video if it is lesser than the necessary visible range | supposed to be hidden
	 * this.elementIntersectionEntry.intersectionRatio < this.INTERSECTION_RATIO_VALUE
	 */
	private _OnVideoAspectRatioConditionNotMet() {
		/*
		 * Return if the video is playing in fullscreen or
		 * check firstTime flag to prevent execution of this from other pages
		 * when the project starts
		 */
		if (this.isFullScreen) {
			return;
		}

		// TODO : if the component is already in the required state (stopped | playing), continue
		this.info("Task: Video to be stopped.");


		// Suresh: Commenting this out, not allowing the video to play
		// if (this.isSwipeDebounce) {
		// window.clearTimeout(this.isSwipeDebounce);
		// }

		// During scroll, video goes out of the view port area but still running because of negative values in TSW
		/* if ((this.videoTop < 0 || this.videoLeft < 0) && this.lastRequestStatus !== this.VIDEO_ACTION.STOP && !this.firstTime) {
			this.info(">>> Stopping Video1");
			this._publishVideoEvent(this.VIDEO_ACTION.STOP);
		} */

		// During scroll, video goes out of the view port area but still running because of negative values in iOS
		/* if (this.isPositionChanged && (this.lastRequestStatus === this.VIDEO_ACTION.RESIZE || this.lastRequestStatus === this.VIDEO_ACTION.START)) {
			this.info(">>> Stopping Video2");
			this._publishVideoEvent(this.VIDEO_ACTION.STOP);
		} */

		// On exiting fullscreen and if the user swipes/leave the video page send the this.VIDEO_ACTION.STOP request
		if (this.isExitFullscreen && this.lastResponseStatus === this.VIDEO_ACTION.RESIZED && !this.elementIsInViewPort) {
			this.info(">>> Stopping Video3");
			this._publishVideoEvent(this.VIDEO_ACTION.STOP);
		}

		// In some of the iOS devices, there is a delay in getting orientation
		// change information, a small delay solves this problem.
		// setTimeout(() => {
		/* if (!this.firstTime && !this.isExitFullscreen && !this.isPositionChanged) {
			// Avoid refilling when the project starts and the video page is not visible
			// isFullScreen and isExitFullscreen is added to avoid refill on full screen and on exit full screen
			if (!this.isFullScreen && this.lastResponseStatus !== this.VIDEO_ACTION.FULLSCREEN) {
				if (this.lastBackGroundRequest !== this.VIDEO_ACTION.REFILL) {
					this.info(">>> Refilling Background1");
					this.ch5BackgroundRequest(this.VIDEO_ACTION.REFILL, 'OnVideoAspectRatioConditionNotMet');
				}
			}

			// The above refill can't be called inside this block as it produces an additional
			// unecessary cut in the background sometimes.
			if (!this.isOrientationChanged && !this.elementIsInViewPort && !this.fromExitFullScreen) {
				this.info(">>> Stopping Video4");
				this._publishVideoEvent(this.VIDEO_ACTION.STOP);
			}
		} */
		// });
	}

	/**
	 * Calculate the size and position of the canvas
	 */
	private calculation(): void {
		if (!this.isFullScreen) {
			const rect = this.getBoundingClientRect();
			console.log('*******************')
			console.log(rect.left);
			this.sizeObj = { width: 0, height: 0 };
			this.sizeObj = CH5VideoUtils.getAspectRatioForVideo(this.aspectRatio, this.size);
			/* if (this.stretch === 'false') {
				// Calculation for fixed display size like small, medium large
				this.sizeObj = CH5VideoUtils.getAspectRatioForVideo(this.aspectRatio, this.size);
			} else if (this.stretch === 'true') {
				this.sizeObj = CH5VideoUtils.getDisplayWxH(this.aspectRatio, this.clientWidth, this.clientHeight);
			} */
			this._getSizeAndPositionObj(this.sizeObj, this.clientWidth, this.clientHeight);
			this._vidControlPanel.style.left = -5 + "px";
			this._vidControlPanel.style.top = (this.position.yPos + 5) + "px";
			this.videoLeft = rect.left + this.position.xPos;
			this.videoTop = rect.top + this.position.yPos;
			this._elContainer.style.width = this.sizeObj.width + "px";
			this._elContainer.style.height = this.sizeObj.height + "px";
		}
	}

	/**
	 * Send event to the backend based on the action Type
	 * @param actionType Video request type
	 */
	private _publishVideoEvent(actionType: string) {
		/* this.info('*** publishVideoEvent: actionType -> ' + actionType + '; lastRequestStatus -> ' + this.lastRequestStatus
			+ '; lastResponseStatus -> ' + this.lastResponseStatus + '; CH5UID: ' + this.ch5UId); */
		// When we receive value from receiveStatePlay
		/* if (this.fromReceiveStatePlay) {
			actionType = this._videoScenariosCheck(this.playValue);
		} */
		this._hideFullScreenIcon();
		//this._sendEvent(this.sendEventResolution, this.sizeObj.width + "x" + this.sizeObj.height + "@24fps", 'string');
		this.responseObj = {} as TVideoResponse;
		this.isAlphaBlend = !this.isFullScreen;
		// reset old response, required to check whether the second response is same.
		this._clearOldResponseData();
		switch (actionType) {
			case this.VIDEO_ACTION.START:
				//this.info("*** VIDEO_ACTION.START ", this.playValue, this.receiveStatePlay, this.fromReceiveStatePlay);
				this.isVideoPublished = true;
				// Check whether receiveStatePlay is defined and the value
				/* if (this.receiveStatePlay !== '') {
					if (!this.playValue) {
						return;
					}
				} */

				/* if (this.playValue && this.fromReceiveStatePlay) {
					this._videoStartRequest(actionType);
					this.fromReceiveStatePlay = false;
					return;
				} */

				//this._sendEvent(this.sendEventSelectionURL, this._url, 'string');
				/* 	this.info('*** this.isVideoReady: ' + !this.isVideoReady + " && this.lastRequestStatus: " + this.lastRequestStatus
						+ " !== start && this.url: " + this.url + "&& (this.lastResponseStatus === " + this.lastResponseStatus
						+ "=== stopped || this.lastResponseStatus: " + this.lastResponseStatus + "=== '' || " + this.lastResponseStatus
						+ "this.wasAppBackGrounded: " + this._wasAppBackGrounded + ") && !this.isExitFullscreen: " + !this.isExitFullscreen); */

				if (!this.isVideoReady && this.lastRequestStatus !== this.VIDEO_ACTION.START && this.url &&
					(this.lastResponseStatus === this.VIDEO_ACTION.STOPPED || this.lastResponseStatus === this.VIDEO_ACTION.EMPTY ||
						this.lastResponseStatus === this.VIDEO_ACTION.ERROR || this._wasAppBackGrounded) && !this.isExitFullscreen) {
					this.info("*** videoStartRequest");
					this._videoStartRequest(actionType);
				} else {
					this.info("*** this.sendEvent");
					//this._sendEvent(this.sendEventState, 0, 'number');
				}
				break;
			case this.VIDEO_ACTION.STOP:
				this.info("VIDEO_ACTION.STOP - this.playValue", this.playValue);
				//this.info("VIDEO_ACTION.STOP - this.fromReceiveStatePlay", this.fromReceiveStatePlay);
				/* if (!this.playValue && this.fromReceiveStatePlay) {
					this._videoStopRequest(actionType);
					this.fromReceiveStatePlay = false;
					return;
				} */

				this.info("*** MyCase STOPPED - this.isVideoPublished", this.isVideoPublished);
				if (!this.isVideoPublished) { // this flag avoids stop command since no video has started
					return;
				}
				this.info("*** MyCase STOPPED - this.lastRequestStatus", this.lastRequestStatus);
				this.info("*** MyCase STOPPED - this.lastResponseStatus", this.lastResponseStatus);
				this.info("*** MyCase STOPPED - this.elementIsInViewPort", this.elementIsInViewPort);
				this.info("*** MyCase STOPPED - this.isExitFullscreen", this.isExitFullscreen);
				if (this.lastRequestStatus !== this.VIDEO_ACTION.STOP && (this.lastResponseStatus === this.VIDEO_ACTION.EMPTY ||
					this.lastResponseStatus === this.VIDEO_ACTION.STARTED || !this.elementIsInViewPort ||
					((this.lastResponseStatus === this.VIDEO_ACTION.RESIZED || this.lastResponseStatus === this.VIDEO_ACTION.ERROR) &&
						!this.isExitFullscreen))) {
					this.info("*** videoStopRequest");
					this._videoStopRequest(actionType);
				}
				this.info("*** MyCase STOPPED - ENDS");
				break;
			case this.VIDEO_ACTION.RESIZE:
				this.info("*** MyCase RESIZE");
				// If the video has already stopped then there is no need to resize.
				if (this.lastResponseStatus === this.VIDEO_ACTION.STOPPED || this.lastResponseStatus === this.VIDEO_ACTION.EMPTY ||
					this.lastRequestStatus === this.VIDEO_ACTION.STOP) {
					return;
				}
				this.fromExitFullScreen = false;
				this.calculation();
				//this.beforeVideoDisplay();
				//this._performanceDuration(this.VIDEO_ACTION.RESIZE, performance.now(), 'timerStart');
				publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
				this.isVideoReady = false;
				break;
			case this.VIDEO_ACTION.FULLSCREEN:
				if (this.lastResponseStatus === this.VIDEO_ACTION.STARTED || this.lastResponseStatus === this.VIDEO_ACTION.RESIZED) {
					this.fromExitFullScreen = false;
					// Fill the background, this will be useful when user gets into fullscreen mode in potrait,
					// then turns the mobile to landscape and exits. Making a refill and recalculating during
					// exit will have bad UI experience.
					// if (!isCrestronTouchscreen()) {
					// this.ch5BackgroundRequest(this.VIDEO_ACTION.REFILL, 'publishVideoEvent');
					// }
					publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'publishVideoEvent'));
					this.isVideoReady = false;
				}
				break;
			default:
		}
	}

	/**
	 * Function to calculate the position based on the requested dimensions
	 * @param sWidth width of the requested element
	 * @param sHeight height of the requested element
	 * @returns this.position
	 */
	private _getSizeAndPositionObj(sizeObj: TDimension, sWidth: number, sHeight: number) {
		if (sizeObj.width < sWidth) {
			this.position = CH5VideoUtils.calculatePillarBoxPadding(sWidth, sizeObj.width);
		} else if (sizeObj.height < sHeight) {
			this.position = CH5VideoUtils.calculateLetterBoxPadding(sHeight, sizeObj.height);
		}
		return this.position;
	}



	/**
	 * Hide the full screen icon
	 */
	private _hideFullScreenIcon() {
		if (!!this._vidControlPanel && !!this._vidControlPanel.classList) {
			this._vidControlPanel.classList.remove(this.showControl);
		}
	}

	/**
	 * Clear the previous response data
	 * This prevents execution of blocks if the response is same
	 */
	private _clearOldResponseData() {
		this.oldResponseStatus = '';
		this.oldResponseId = 0;
	}

	/**
	 * Publish the video start request
	 * @param actionType
	 */
	private _videoStartRequest(actionType: string) {
		// Empty URL scenario
		if (this.url.trim() === '') {
			this.ch5BackgroundRequest(this.VIDEO_ACTION.NOURL, 'videoStartRequest');
			return;
		}

		// Invalid URL scenario, validation error
		if (!this.validateVideoUrl(this.url)) {
			this.info("Invalid RTSP url -> " + this.url);
			this.lastResponseStatus = this.VIDEO_ACTION.ERROR;
			this.ch5BackgroundRequest(this.VIDEO_ACTION.ERROR, 'videoStartRequest');
			return;
		}

		// Make a cut if snapshot not found
		this.fromExitFullScreen = false;
		//this.lastRequestUrl = this.url;
		this.isVideoReady = true;
		//this._performanceDuration(this.VIDEO_ACTION.START, performance.now(), 'timerStart');
		publishEvent('o', 'Csig.video.request', this.videoStartObjJSON(actionType, 'videoStartRequest'));
		//	this.requestID = this.ch5UId;
	}

	/**
	 * Publish the video stop request
	 * @param actionType
	 */
	private _videoStopRequest(actionType: string) {
		// Stop the video immediately
		publishEvent('o', 'Csig.video.request', this.videoStopObjJSON(actionType, this.ch5UId));
		//	this.stopLoadingSnapShots();
		this.fromExitFullScreen = false;
		//this.lastRequestUrl = '';
		// /this._performanceDuration(this.VIDEO_ACTION.STOP, performance.now(), 'timerStart');
		this.isVideoReady = false;
		//this._sendEvent(this.sendEventState, 3, 'number');
	}

	/**
	 * Create the Video JSON object to start the video
	 * @param actionType
	 * @param xPosition
	 * @param yPosition
	 * @param width
	 * @param height
	 * @param zIndex
	 */
	public videoStartObjJSON(actionType: string, logInfo: string): ICh5VideoPublishEvent {
		const uId: number = this.ch5UId;
		//const zIndex: number = parseInt(this.zIndex, 0);
		const zIndex: number = parseInt('0', 0);
		const alphaBlend: boolean = this.isAlphaBlend;
		const d = new Date();
		const startTime: number = d.getMilliseconds();
		const endTime: number = d.getMilliseconds() + 2000;

		let xPosition: number = this.videoLeft;
		let yPosition: number = this.videoTop;
		let width: number = this.sizeObj.width;
		let height: number = this.sizeObj.height;

		if (actionType === this.VIDEO_ACTION.FULLSCREEN) {
			actionType = this.VIDEO_ACTION.RESIZE;
			this.fullScreenObj = CH5VideoUtils.getFullScreenDimensions(this.aspectRatio, window.innerWidth, window.innerHeight);
			xPosition = this.fullScreenObj.posX;
			yPosition = this.fullScreenObj.posY;
			width = this.fullScreenObj.width;
			height = this.fullScreenObj.height;
		}

		this.lastRequestStatus = actionType;
		// always clears the background of the video tag to display video behind it
		// this.clearBackgroundOfVideoWrapper(true);

		// any negative values in location object will throw backend error
		// sometimes decimal values are returned by position related functions
		// Math.ceil is used to avoid this.
		const retObj = {
			"action": actionType,
			"id": uId,
			"credentials": {
				"userid": this.userid,
				"password": this.password
			},
			"source": {
				//"type": this.sourceType,
				"type": "Network",
				"url": this.url
			},
			"location": {
				"top": Math.ceil(yPosition),
				"left": Math.ceil(xPosition),
				"width": Math.ceil(width),
				"height": Math.ceil(height),
				"z": zIndex
			},
			"alphablend": alphaBlend, // optional, default true, false indicates video displayed above the HTML
			"starttime": startTime, // milliseconds since 1-1-1970 UTC
			"endtime": endTime, // 2000 msecs later
			"timing": "linear" // only linear supported initially
		};

		this.info(logInfo + JSON.stringify(retObj));
		return retObj;
	}

	private ch5BackgroundRequest(actionType: string, calledBy: string): void {
		let isActionExecuted: boolean = true;
		const nodeList: NodeList = this._elContainer.childNodes;

		switch (actionType) {
			case this.VIDEO_ACTION.NOURL:
				//this.clearBackgroundOfVideoWrapper(false);
				if (nodeList.length > 1) {
					this._elContainer.childNodes[1].remove();
				}
				this._elContainer.style.borderBottom = '1rem solid #828282'; // Gray color
				break;
			case this.VIDEO_ACTION.MARK:
				//this.clearBackgroundOfVideoWrapper(false);
				if (nodeList.length > 1) {
					this._elContainer.childNodes[1].remove();
				}
				this._elContainer.style.borderBottom = '1rem solid #FFBF00'; // Amber color
				break;
			case this.VIDEO_ACTION.REFILL:
				/* if (this.lastBackGroundRequest !== actionType) {
					this.ch5BackgroundAction(this.videoBGObjJSON(this.VIDEO_ACTION.REFILL));
				} else { */
					isActionExecuted = false;
				//}
				break;
			case this.VIDEO_ACTION.RESIZE:
				//this.ch5BackgroundAction(this.videoBGObjJSON(this.VIDEO_ACTION.RESIZE));
				break;
			case this.VIDEO_ACTION.STARTED:
				//clearTimeout(this.exitSnapsShotTimer); // clear timer to stop refreshing image
			//	this.resetVideoElement();
				//this.switchLoadingSnapShot();
				//this.firstTime = false;
				//this.ch5BackgroundAction(this.videoBGObjJSON(this.VIDEO_ACTION.STARTED));
				break;
			case this.VIDEO_ACTION.STOP:
				//clearTimeout(this.exitSnapsShotTimer); // clear timer to stop refreshing image
				/* if (this.elementIsInViewPort) {
					this.resetVideoElement();
					this.ch5BackgroundAction(this.videoBGObjJSON(this.VIDEO_ACTION.STOP));
				} else { */
					isActionExecuted = false;
				//}
				break;
			case this.VIDEO_ACTION.ERROR:
				if (this.elementIsInViewPort) {
					this._elContainer.style.background = '#000';
					if (nodeList.length > 1) {
						this._elContainer.childNodes[1].remove();
					}
					this._elContainer.style.borderBottom = '1rem solid #CF142B'; // Red color
				} else {
					isActionExecuted = false;
				}
				break;
			default:
				// Nothing here as of now
				break;
		}

		//this.lastBackGroundRequest = isActionExecuted ? actionType : this.lastBackGroundRequest;
		/* this.info("\nVideo Id: " + this.videoTagId + "\nCalling Method -> " + calledBy +
			"\nPrevious BG Request -> " + this.lastBackGroundRequest +
			"\nPresent BG Request -> " + (isActionExecuted ? actionType : 'none')); */
	}

	/**
	 * Validate the video url for rtsp, http, https
	 * @param videoUrl video url
	 * @returns {boolean} returns true or false
	 */
	private validateVideoUrl(videoUrl: string): boolean {
		if (videoUrl.startsWith('rtsp://') || videoUrl.startsWith('http://')
			|| videoUrl.startsWith('https://')) {
			return true;
		} else {
			return false;
		}
	}



	//#endregion

}

Ch5Sample.registerCustomElement();
Ch5Sample.registerSignalAttributeTypes();

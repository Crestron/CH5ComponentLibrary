// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.
import { Ch5Common } from './../ch5-common/ch5-common';
import { ICh5BackgroundAttributes } from './interfaces/i-ch5-background-attributes';
import { Ch5Signal, Ch5SignalFactory, subscribeState, unsubscribeState, publishEvent } from '../ch5-core';
import { TCh5BackgroundScale, TCh5BackgroundRepeat, TCh5BackgroundTransitionEffect } from './interfaces';
import { ICh5VideoBackground } from './../ch5-video/interfaces';
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { resizeObserver } from '../ch5-core/resize-observer';
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import _ from 'lodash';

export class Ch5Background extends Ch5Common implements ICh5BackgroundAttributes {

	public static readonly ELEMENT_NAME = 'ch5-background';
	/**
	 * The first value is considered the default one
	 */
	public static SCALE: TCh5BackgroundScale[] = ['stretch', 'fill', 'fit'];
	/**
	 * The first value is considered the default one
	 */
	public static REPEAT: TCh5BackgroundRepeat[] = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'];

	public static REFRESHRATE: number = 600;
	public static IMGBGCOLOR: string = 'black';

	public static readonly COMPONENT_DATA: any = {
		SCALE: {
			default: Ch5Background.SCALE[0],
			values: Ch5Background.SCALE,
			key: 'scale',
			classListPrefix: '--'
		},
		REPEAT: {
			default: null,
			values: Ch5Background.REPEAT,
			key: 'repeat',
			classListPrefix: '--'
		}
	};

	/**
	 * COMPONENT ATTRIBUTES
	 *
	 * - url
	 * - backgroundColor, backgroundcolor
	 * - repeat
	 * - scale
	 * - refreshRate, refreshrate
	 * - imgBackgroundColor, imgbackgroundcolor
	 * - transitionEffect, transitioneffect
	 * - transitionDuration, transitionduration
	 * - receiveStateRefreshRate, receivestaterefreshrate
	 * - receiveStateUrl, receivestateurl
	 * - receiveStateBackgroundColor, receivestatebackgroundcolor
	 */

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestaterefreshrate: { direction: "state", numericJoin: 1, contractName: true },
		receivestateurl: { direction: "state", stringJoin: 1, contractName: true },
		receivestatebackgroundcolor: { direction: "state", stringJoin: 1, contractName: true }
	};

	public primaryCssClass = 'ch5-background';
	public parentCssClassPrefix = '--parent';
	public canvasCssClassPrefix = '--canvas';
	public isCanvasCreated: boolean = false;

	private _elCanvas: HTMLCanvasElement = {} as HTMLCanvasElement;
	private _canvasList: any;
	private _prevCanvasList: any[] = [];
	private _imgUrls: string[] = [];
	private _elImages: HTMLImageElement[] = [];
	private _elBackupImages: HTMLImageElement[] = [];
	private _bgColors: string[] = [];
	private _bgIdx: number = 0;
	private _interval: any;
	private _videoRes: ICh5VideoBackground = {} as ICh5VideoBackground;
	private _isVisible: boolean = false;
	private _videoDimensions: ICh5VideoBackground[] = [];
	private _isRefilled: boolean = true;
	private isInitialized: boolean = false;

	private readonly VIDEO_ACTION = {
		STARTED: 'started',
		STOP: 'stop',
		STOPPED: 'stopped',
		RESIZE: 'resize',
		REFILL: 'refill',
		SNAPSHOT: 'snapshot',
		MARK: 'mark',
		NOURL: 'nourl',
		ERROR: 'error'
	};

	private MARK_COLORS: Map<string, string> = new Map();

	/**
	 * background url supports background format, including JPEG, PNG, SVG, and BMP.
	 *
	 * @type {string}
	 * @private
	 */
	private _url: string = '';

	/**
	 * It supports all types of color format, including name, #hex codes, rgb(), rgba(), hsl() and hsla()
	 *
	 * @type {string}
	 * @private
	 */
	private _backgroundColor: string = Ch5Background.IMGBGCOLOR;

	/**
	 * repeat the background.
	 *
	 * @type {string}
	 * @private
	 */
	private _repeat: TCh5BackgroundRepeat | null = null;

	/**
	 * scale the background.
	 *
	 * @type {string}
	 * @private
	 */
	private _scale: TCh5BackgroundScale = Ch5Background.SCALE[0];

	/**
	 * refreshrate provides length of time in seconds each image will be displayed.
	 *
	 * @type {string}
	 * @private
	 */
	private _refreshRate: number = Ch5Background.REFRESHRATE;

	/**
	 * video crop object for crop the background.
	 *
	 * @type {string}
	 * @private
	 */
	private _videoCrop: string = '';

	/**
	 * background color of image.
	 *
	 * @type {string}
	 * @private
	 */
	private _imgBackgroundColor: string = '';

	/**
	 * background change transition effect.
	 *
	 * @type {string}
	 * @private
	 */
	private _transitionEffect: TCh5BackgroundTransitionEffect = 'ease';

	/**
	 * background change transition duration.
	 *
	 * @type {string}
	 * @private
	 */
	private _transitionDuration: string = '';

	/**
	 * The name of a string signal that will be applied to the interval time
	 *
	 * HTML attribute name: receiveStateRefreshRate or receivestaterefreshrate
	 */
	private _receiveStateRefreshRate: string = '';

	/**
	 * The subscription id for the receiveStateRefreshRate signal
	 */
	private _subReceiveRefreshRate: string = '';

	/**
	 * The name of a string signal that will be applied to the url
	 *
	 * HTML attribute name: receiveStateUrl or receivestateurl
	 */
	private _receiveStateUrl: string = '';

	/**
	 * The name of a string signal. The value of this string signal will be added to the url attribute
	 *
	 * HTML attribute name: receiveStateUrl or receivestateurl
	 */
	private _sigNameReceiveUrl: string = '';

	/**
	 * The subscription id for the receivestateurl signal
	 */
	private _subReceiveUrl: string = '';

	/**
	 * The name of a string signal that will be applied to background color
	 *
	 * HTML attribute name: receiveStateBackgroundColor or receivestatebackgroundcolor
	 */
	private _receiveStateBackgroundColor: string = '';

	/**
	 * The subscription id for the receivestatebackgroundcolor signal
	 */
	private _subReceiveBackgroundColor: string = '';

	/**
	 * The subscription id for the video background object
	 */
	private _videoSubscriptionId: string = '';

	private _canvasSubscriptionId: string = '';

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Background.ELEMENT_NAME, Ch5Background.SIGNAL_ATTRIBUTE_TYPES);
	}

	/**
	 * ATTR GETTERS AND SETTERS
	 */

	public get url(): string {
		return this._url;
	}

	public set url(value: string) {
		if (this._url !== value && !_.isNil(value) && value !== "") {
			this._url = value;
			this.getBackgroundUrl(this._url);
			this.setAttribute('url', this._url);
		}
	}

	public get backgroundColor(): string {
		return this._backgroundColor;
	}
	public set backgroundColor(value: string) {
		if (!this.hasAttribute('url') && !this.hasAttribute('receivestateurl')) {
			this._backgroundColor = (value.trim() !== "") ? this.imgBackgroundColor : 'value';
			this._backgroundColor = value;
			this.getBackgroundColor(this._backgroundColor);
			this.setAttribute('backgroundcolor', this._backgroundColor);
		}
	}

	public get repeat() {
		return this._repeat;
	}
	public set repeat(value: TCh5BackgroundRepeat | null) {
		if (!_.isNil(value)) {
			if (this._repeat !== value) {
				if (Ch5Background.REPEAT.indexOf(value) >= 0) {
					this._repeat = value;
					this.setAttribute('repeat', this._repeat);
				} else {
					this._repeat = null;
					this.removeAttribute('repeat');
				}
			}
		} else {
			this._repeat = null;
			this.removeAttribute('repeat');
		}
		this.updateBackground();
	}

	public get scale() {
		return this._scale;
	}
	public set scale(value: TCh5BackgroundScale) {
		if (this._scale !== value) {
			if (Ch5Background.SCALE.indexOf(value) >= 0) {
				this._scale = value;
			} else {
				this._scale = Ch5Background.SCALE[0];
			}
			this.setAttribute('scale', this._scale);
		}
	}

	public get refreshRate(): number {
		return this._refreshRate;
	}

	public set refreshRate(value: number) {
		if (isNaN(value)) {
			value = Ch5Background.REFRESHRATE;
		} else {
			value = Number(value);
		}
		if (value < 10) {
			value = 10;
		} else if (value > 604800) {
			value = 604800;
		}
		if (this._refreshRate !== value) {
			this._refreshRate = value;
			this.setAttribute('refreshrate', this._refreshRate.toString());
		}
	}

	public get videoCrop() {
		return this._videoCrop;
	}

	public set videoCrop(value: string) {
		if (this._videoCrop !== value) {
			this._videoCrop = value;
			this.setAttribute('videocrop', this._videoCrop);
		}
	}

	public get imgBackgroundColor(): string {
		return this._imgBackgroundColor;
	}

	public set imgBackgroundColor(value: string) {
		if (this._imgBackgroundColor !== value) {
			if (Ch5Background.IMGBGCOLOR) {
				this._imgBackgroundColor = value;
			} else {
				this._imgBackgroundColor = Ch5Background.IMGBGCOLOR;
			}
			this.setAttribute('imgbackgroundcolor', this._imgBackgroundColor);
		}
	}

	public get transitionEffect(): TCh5BackgroundTransitionEffect {
		return this._transitionEffect;
	}

	public set transitionEffect(value: TCh5BackgroundTransitionEffect) {
		if (this._transitionEffect !== value) {
			this._transitionEffect = value;
			this.setAttribute('transitioneffect', this._transitionEffect);
		}
	}

	public get transitionDuration(): string {
		return this._transitionDuration;
	}

	public set transitionDuration(value: string) {
		if (this._transitionDuration !== value) {
			this._transitionDuration = value;
			this.setAttribute('transitionduration', this._transitionDuration);
		}
		let countCharacter = 0;
		Array.from(this._transitionDuration).forEach((attribute: any) => {
			if (attribute.toUpperCase() !== attribute.toLowerCase()) {
				countCharacter++;
			}
		});
		if (countCharacter > 1) {
			this.setAttribute('transitionduration', '1s');
		}
		const specialChars = new RegExp(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/);
		if (specialChars.test(this._transitionDuration) === true) {
			this._transitionDuration = '1s';
			this.setAttribute('transitionduration', this._transitionDuration);
		}

		if (this._transitionDuration === '') {
			this.setAttribute('transitionduration', '1s');
		}
	}

	public set receiveStateRefreshRate(value: string) {
		this.info("set receiveStateRefreshRate('" + value + "')");
		if (!value || this._receiveStateRefreshRate === value) {
			return;
		}
		// clean up old subscription
		if (this._receiveStateRefreshRate) {
			const oldReceiveIntervalSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateRefreshRate);

			const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldReceiveIntervalSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveRefreshRate);
			}
		}

		this._receiveStateRefreshRate = value;
		this.setAttribute('receivestaterefreshrate', value);

		// setup new subscription.
		const receiveIntervalSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateRefreshRate);
		const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveIntervalSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveRefreshRate = receiveSignal.subscribe((newValue: number) => {
			if (Number(newValue) !== this.refreshRate) {
				this.setAttribute('refreshrate', String(newValue));
			}
		}
		);
	}

	public get receiveStateRefreshRate(): string {
		return this._attributeValueAsString('receivestaterefreshrate');
	}

	public set receiveStateUrl(value: string) {
		this.info('set receiveStateUrl(\'' + value + '\')');

		if ('' === value
			|| this._sigNameReceiveUrl === value
			|| null === value
			|| undefined === value) {
			return;
		}

		// clean up old subscription
		if (this._sigNameReceiveUrl !== ''
			&& this._sigNameReceiveUrl !== undefined
			&& this._sigNameReceiveUrl !== null) {

			const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveUrl);
			const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveUrl);
			}
		}

		this._sigNameReceiveUrl = value;
		this.setAttribute('receivestateurl', value);

		// setup new subscription.
		const sigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveUrl);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(sigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveUrl = receiveSignal.subscribe((newValue: string) => {
			if (newValue !== this._url) {
				this.setAttribute('url', newValue);
			}
		});
	}

	public get receiveStateUrl(): string {
		return this._attributeValueAsString('receivestateurl');
	}

	public set receiveStateBackgroundColor(value: string) {
		this.info("set receivestatebackgroundcolor('" + value + "')");
		if (!value || this._receiveStateBackgroundColor === value) {
			return;
		}
		// clean up old subscription
		if (this._receiveStateBackgroundColor) {

			const oldReceiveBackgroundColorSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateBackgroundColor);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveBackgroundColorSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveBackgroundColor);
			}
		}

		this._receiveStateBackgroundColor = value;
		this.setAttribute('receivestatebackgroundcolor', value);

		// setup new subscription.
		const receiveBackgroundColorSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateBackgroundColor);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveBackgroundColorSigName);

		if (receiveSignal === null) {
			return;
		}

		this._subReceiveBackgroundColor = receiveSignal.subscribe((newValue: string) => {
			if (newValue !== this.backgroundColor) {
				this.setAttribute('backgroundcolor', newValue);
			}
		});
	}

	public get receiveStateBackgroundColor(): string {
		return this._attributeValueAsString('receivestatebackgroundcolor');
	}

	/**
	 * CONSTRUCTOR
	 */
	public constructor() {
		super();

		customElements.whenDefined('ch5-background').then(() => {
			this.classList.add(this.primaryCssClass);

			if (this.parentElement && !this._isVisible) {
				this.parentElement.classList.add(this.primaryCssClass + this.parentCssClassPrefix);
			}

			this.MARK_COLORS.set('mark', '#FFBF00'); // amber
			this.MARK_COLORS.set('error', '#CF142B'); // red
			this.MARK_COLORS.set('nourl', '#828282'); // gray
			this.MARK_COLORS.set('stop', '#828282'); // black

			/**
			 * call on element resize using ResizeObserver
			 */
			if (this.parentElement) {
				resizeObserver(this.parentElement, this.updateCanvasDimensions.bind(this));
			}
			this.info("From connectedCallback of ch5-background");
		});
	}

	/**
	 *  Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.initAttributes();
		this.setAttribute('data-ch5-id', this.getCrId());
		customElements.whenDefined('ch5-background').then(() => {
			Ch5CoreIntersectionObserver.getInstance().observe(this, () => {
				if (this.elementIsInViewPort) {
					if (!this._isVisible) {
						if (this.parentElement) {
							this.parentElement.classList.add(this.primaryCssClass + this.parentCssClassPrefix);
						}
						this.updateCanvasDimensions();
						this._isVisible = true;
					}
				} else {
					this._isVisible = false;
					// Note: If you need a fading effect between two pages using ch5-background individually
					// then, remove the 'ch5bg-fadein' class here: this._canvasList[i].classList.remove('ch5bg-fadein'); 
				}
				this.isInitialized = true;
			});
		});
	}

	/**
	 * Identifies whether the passed element is in viewport or not
	 * @param elId
	 * @returns {boolean} return true or false
	 */
	private isInViewport(elId: string): boolean {
		const el: any = document.querySelector(`[data-ch5-id="${elId}"]`);
		if (el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		}
		return false;
	}

	/**
	 * Callback for the video subscription
	 * @param request
	 */
	public videoBGRequest(request: ICh5VideoBackground) {
		this.info("In videoBGRequest(): Video Tag Id -> " + request.id + " action: " + request.action);

		// return if not initialized
		if (!this.isInitialized || !this.elementIsInViewPort || request.id === '') {
			return;
		}

		if (request && Object.keys(request).length) {
			const tempObj: ICh5VideoBackground = Object.assign({}, request);

			this.setAttribute('videocrop', JSON.stringify(tempObj));

			/*
					1. STOP
							a. Remove the registered cut info from the array
							b. Refill the background
					2. RESIZE
							a. Refill the cut background
							b. Cut the background with new dimensions
					3. REFILL
							a. Refill the background
								 Ex: Moving out of video page
					4. SNAPSHOT
							a. Refill, need to if it is an orientation change.
							b. Draw / Re-Draw a snapshot with newly received values
					5. START
							a. cut the background only, this is to display the running video
			*/

			if (request.action === this.VIDEO_ACTION.REFILL && !this._isRefilled) {
				if (!this.isInViewport(request.id)) {
					this.refillBackground();
				}
			} else if (request.action === this.VIDEO_ACTION.STOP) {
				this.manageVideoInfo(request);
			} else if (request.action === this.VIDEO_ACTION.STARTED) {
				this.manageVideoInfo(request);
				this.videoBGAction();
			} else if (request.action === this.VIDEO_ACTION.RESIZE) {
				this.manageVideoInfo(request);
				this.refillBackground();
				this.videoBGAction();
			}
		}
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.info('called disconnectedCallback()');

		// disconnect common mutation observer
		if (Ch5CoreIntersectionObserver.getInstance() instanceof Ch5CoreIntersectionObserver) {
			Ch5CoreIntersectionObserver.getInstance().unobserve(this);
		}

		unsubscribeState('o', 'ch5.video.background', this._videoSubscriptionId);
		unsubscribeState('b', 'canvas.created', this._canvasSubscriptionId);
		this.unsubscribeFromSignals();
	}

	// Respond to attribute changes.
	static get observedAttributes() {
		const commonAttributes = Ch5Common.observedAttributes;

		const ch5BackgroundAttributes = [
			// attributes
			'url',
			'backgroundcolor',
			'repeat',
			'scale',
			'refreshrate',
			'videocrop',
			'imgbackgroundcolor',
			'transitioneffect',
			'transitionduration',
			'receivestaterefreshrate',
			'receivestateurl',
			'receivestatebackgroundcolor'
		];

		return commonAttributes.concat(ch5BackgroundAttributes);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}
		switch (attr) {
			case 'url':
				if (this.hasAttribute('url')) {
					this.url = newValue;
				} else {
					this.url = '';
				}
				this.createCanvas();
				this.updateBackground();
				break;
			case 'backgroundcolor':
				if (!this.hasAttribute('url') && !this.hasAttribute('receivestateurl')) {
					if (this.hasAttribute('backgroundcolor')) {
						this.backgroundColor = newValue;
					} else {
						this.backgroundColor = '';
					}
					this.createCanvas();
					this.updateBackground();
				}
				// }
				break;
			case 'repeat':
				this.repeat = this.getAttribute('repeat') as TCh5BackgroundRepeat;
				break;
			case 'scale':
				if (this.hasAttribute('scale')) {
					this.scale = newValue as TCh5BackgroundScale;
				} else {
					this.scale = Ch5Background.SCALE[0];
				}
				this.updateBackground();
				break;
			case 'refreshrate':
				if (this.hasAttribute('refreshrate')) {
					this.refreshRate = Number(newValue);
				} else {
					this.refreshRate = Ch5Background.REFRESHRATE;
				}
				this.updateBackground();
				break;
			case 'videocrop':
				if (this.hasAttribute('videocrop')) {
					this.videoCrop = newValue;
				} else {
					this.videoCrop = '';
				}
				break;
			case 'imgbackgroundcolor':
				if (this.hasAttribute('imgbackgroundcolor')) {
					this.imgBackgroundColor = newValue;
				} else {
					this.imgBackgroundColor = Ch5Background.IMGBGCOLOR;
				}
				this.updateBackground();
				break;
			case 'transitioneffect':
				if (this.hasAttribute('transitioneffect')) {
					this.transitionEffect = newValue as TCh5BackgroundTransitionEffect;
				} else {
					this.transitionEffect = 'ease';
				}
				this.setBgTransition();
				break;
			case 'transitionduration':
				if (this.hasAttribute('transitionduration')) {
					this.transitionDuration = newValue;
				} else {
					this.transitionDuration = '';
				}
				this.setBgTransition();
				break;
			case 'receivestaterefreshrate':
				if (this.hasAttribute('receivestaterefreshrate')) {
					this.receiveStateRefreshRate = newValue;
				} else {
					this.receiveStateRefreshRate = '';
				}
				break;
			case 'receivestateurl':
				if (this.hasAttribute('receivestateurl')) {
					this.receiveStateUrl = newValue;
				} else {
					this.receiveStateUrl = '';
				}
				break;
			case 'receivestatebackgroundcolor':
				if (!this.hasAttribute('url') && !this.hasAttribute('receivestateurl')) {
					if (this.hasAttribute('receivestatebackgroundcolor')) {
						this.receiveStateBackgroundColor = newValue;
					} else {
						this.receiveStateBackgroundColor = '';
					}
				}
				break;
			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals() {
		this.info('unsubscribeFromSignals()');
		super.unsubscribeFromSignals();

		const csf = Ch5SignalFactory.getInstance();
		if (this._subReceiveRefreshRate !== '' && this._receiveStateRefreshRate !== '') {

			const receiveIntervalSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateRefreshRate);
			const sigInterval: Ch5Signal<string> | null = csf.getStringSignal(receiveIntervalSigName);

			if (null !== sigInterval) {
				sigInterval.unsubscribe(this._subReceiveRefreshRate);
				this._receiveStateRefreshRate = '';
			}
		}

		if (this._subReceiveUrl !== '' && this._receiveStateUrl !== '') {
			const receiveUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
			const sigUrl: Ch5Signal<string> | null = csf.getStringSignal(receiveUrlSigName);

			if (null !== sigUrl) {
				sigUrl.unsubscribe(this._subReceiveUrl);
				this._receiveStateUrl = '';
			}
		}

		if (this._subReceiveBackgroundColor !== '' && this._receiveStateBackgroundColor !== '') {
			const receiveBackgroundColorSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateBackgroundColor);
			const sigBgColor: Ch5Signal<string> | null = csf.getStringSignal(receiveBackgroundColorSigName);

			if (null !== sigBgColor) {
				sigBgColor.unsubscribe(this._subReceiveBackgroundColor);
				this._receiveStateBackgroundColor = '';
			}
		}
		this.info('unsubscribeFromSignals() end');
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		super.initAttributes();

		if (this.hasAttribute('url')) {
			this.url = this.getAttribute('url') as string;
		}

		if (this.hasAttribute('backgroundcolor') && !this.hasAttribute('url') && !this.hasAttribute('receivestateurl')) {
			this.backgroundColor = this.getAttribute('backgroundcolor') as string;
		}

		this.repeat = this.getAttribute('repeat') as TCh5BackgroundRepeat;

		if (this.hasAttribute('scale')) {
			this.scale = this.getAttribute('scale') as TCh5BackgroundScale;
		}

		if (this.hasAttribute('refreshrate')) {
			this.refreshRate = Number(this.getAttribute('refreshrate')) as number;
		}

		if (this.hasAttribute('videocrop')) {
			this.videoCrop = this.getAttribute('videocrop') as string;
		}

		if (this.hasAttribute('imgbackgroundcolor')) {
			this.imgBackgroundColor = this.getAttribute('imgbackgroundcolor') as string;
		}

		if (this.hasAttribute('transitioneffect')) {
			this.transitionEffect = this.getAttribute('transitioneffect') as TCh5BackgroundTransitionEffect;
		}

		if (this.hasAttribute('transitionduration')) {
			this.transitionDuration = this.getAttribute('transitionduration') as string;
		}

		if (this.hasAttribute('receivestaterefreshrate')) {
			this.receiveStateRefreshRate = this.getAttribute('receivestaterefreshrate') as string;
		}

		if (this.hasAttribute('receivestateurl')) {
			this.receiveStateUrl = this.getAttribute('receivestateurl') as string;
		}

		if (this.hasAttribute('receivestatebackgroundcolor') && !this.hasAttribute('url') && !this.hasAttribute('receivestateurl')) {
			this.receiveStateBackgroundColor = this.getAttribute('receivestatebackgroundcolor') as string;
		}
	}

	/**
	 * Calling image and bg color function as per condition.
	 */
	protected updateBackground(): void {
		if (this._imgUrls.length) {
			this.setBgImage();
		} else if (this._bgColors.length) {
			this.setBgColor();
		} else {
			this.info('Something went wrong. One attribute is mandatory - either URL or backgroundColor.');
		}
	}

	protected updateBackgroundForEachCanvas(canvas: HTMLCanvasElement, idx: number): void {
		if (this._imgUrls.length) {
			this.setBgImageByCanvas(canvas, idx);
		} else if (this._bgColors.length) {
			this.setBgColorByCanvas(canvas, idx);
		} else {
			this.info('Something went wrong. One attribute is mandatory - either URL or backgroundColor.');
		}
	}

	/**
	 * This method is converting string to array of string
	 * @param values is string of image urls which are separated with '|'.
	 */
	private getBackgroundUrl(values: string) {
		this._imgUrls = values.split('|');
		this._imgUrls = this._imgUrls.map(url => url.trim());
	}

	/**
	 * This method is converting string to array of string
	 * @param values is string of background colors which are separated with '|'.
	 */
	private getBackgroundColor(values: string) {
		this._bgColors = values.split('|');
		this._bgColors = this._bgColors.map(color => color.trim());
	}

	/**
	 * This method will fill the image to the container and also maintain the aspect ratio.
	 * @param img is image object
	 * @param canvas is canvas object
	 * @param ctx is canvas context
	 */
	private scaleToFill(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: any) {
		const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
		const x = canvas.width / 2 - (img.width / 2) * scale;
		const y = canvas.height / 2 - (img.height / 2) * scale;
		ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
		publishEvent('b', 'canvas.created', true);
	}

	/**
	 * This method will fill width or height to the container, it depends on the image dimension and also maintain the aspect ratio.
	 * @param img is image object
	 * @param canvas is canvas object
	 * @param ctx is canvas context
	 */
	private scaleToFit(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: any) {
		const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
		const x = canvas.width / 2 - (img.width / 2) * scale;
		const y = canvas.height / 2 - (img.height / 2) * scale;
		ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
		publishEvent('b', 'canvas.created', true);
	}

	/**
	 * This method will stretch the image to fill the container but it will not maintain the aspect ratio.
	 * @param img is image object
	 * @param canvas is canvas object
	 * @param ctx is canvas context
	 */
	private scaleToStretch(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: any) {
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		publishEvent('b', 'canvas.created', true);
	}

	/**
	 * This method will update the scale according to value.
	 * @param img is image object
	 * @param canvas is canvas object
	 * @param ctx is canvas context
	 */
	private updateBgImageScale(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: any) {
		switch (this._scale) {
			case 'fill':
				this.scaleToFill(img, canvas, ctx);
				break;
			case 'fit':
				this.scaleToFit(img, canvas, ctx);
				break;
			case 'stretch':
				this.scaleToStretch(img, canvas, ctx);
				break;
			default:
				this.info('Scale value is wrong. it should be fill, fit or stretch(default)');
				break;
		}
	}

	/**
	 * This method will repeat the pattern image in repeat, repeat-x, repeat-y and no-repeat position
	 * @param img is image object
	 * @param canvas is canvas object
	 * @param ctx is canvas context
	 */
	private updateBgImageRepeat(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: any) {
		switch (this._repeat) {
			case 'repeat':
			case 'repeat-x':
			case 'repeat-y':
			case 'no-repeat':
				ctx.fillStyle = ctx.createPattern(img, this._repeat);
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				publishEvent('b', 'canvas.created', true);
				break;
			default:
				break;
		}
	}

	/**
	 * This method is creating the canvas template and setting the dimension.
	 */
	private canvasTemplate(count: number) {
		this.innerHTML = '';
		for (let i: number = 0; i < count; ++i) {
			this._elCanvas = document.createElement('canvas');
			this._elCanvas.classList.add(this.primaryCssClass + this.canvasCssClassPrefix);
			this.appendChild(this._elCanvas);
			this.setCanvasDimensions(this._elCanvas);
			if (i === (count - 1)) {
				this._canvasList = this.querySelectorAll<HTMLCanvasElement>('canvas');
			}
		}
		this.isCanvasCreated = true;
	}

	/**
	 * Manage Video dimensions
	 */
	private manageVideoInfo(response: ICh5VideoBackground) {
		const index = this._videoDimensions.findIndex((item: ICh5VideoBackground) => item.id === response.id);
		if (response.action === this.VIDEO_ACTION.STARTED || response.action === this.VIDEO_ACTION.RESIZE) {
			if (index > -1) {
				this._videoDimensions[index] = response;
				this.refillBackground();
			} else {
				this._videoDimensions.push(response);
				this.refillBackground();
			}
		} else if (response.action === this.VIDEO_ACTION.STOP) {
			if (index >= 0) {
				this._videoDimensions.splice(index, 1);
				this.refillBackground();
			}
		}
	}

	/**
	 * checking if has scrollbar
	 */
	private isScrollBar(elm: any, dir: string) {
		dir = (dir === 'vertical') ? 'scrollTop' : 'scrollLeft';
		let res: boolean = !!elm[dir];
		if (!res) {
			elm[dir] = 1;
			res = !!elm[dir];
			elm[dir] = 0;
		}
		return res;
	}

	/**
	 * Setting canvas dimensions
	 */
	private setCanvasDimensions(canvas: HTMLCanvasElement) {
		canvas.width = 0;
		canvas.height = 0;
		if (this.parentElement) {
			canvas.width = this.isScrollBar(this.parentElement, 'horizontal') ? this.parentElement.scrollWidth : this.parentElement.clientWidth;
			canvas.height = this.isScrollBar(this.parentElement, 'vertical') ? this.parentElement.scrollHeight : this.parentElement.clientHeight;
		}
	}

	/**
	 * 
	 */
	private updateCanvasDimensions() {
		if (this.isCanvasListValid()) {
			this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
				let processCanvasObject = true;
				if (this._prevCanvasList && this._prevCanvasList.length > 0) {
					let newWidth = canvas.width;
					let newHeight = canvas.height;
					if (this.parentElement) {
						newWidth = this.isScrollBar(this.parentElement, 'horizontal') ? this.parentElement.scrollWidth : this.parentElement.clientWidth;
						newHeight = this.isScrollBar(this.parentElement, 'vertical') ? this.parentElement.scrollHeight : this.parentElement.clientHeight;
					}
					if (this._prevCanvasList[idx] && this._prevCanvasList[idx].width === newWidth &&
						this._prevCanvasList[idx].height === newHeight) {
						processCanvasObject = false;
					} else if (newWidth === 0 && newHeight === 0) {
						// This condition is for display:none set and to avoid flickering
						processCanvasObject = false;
					}
				}
				if (processCanvasObject === true) {
					canvas.width = 0;
					canvas.height = 0;
					if (this.parentElement) {
						canvas.width = this.isScrollBar(this.parentElement, 'horizontal') ? this.parentElement.scrollWidth : this.parentElement.clientWidth;
						canvas.height = this.isScrollBar(this.parentElement, 'vertical') ? this.parentElement.scrollHeight : this.parentElement.clientHeight;
					}

					this.updateBackgroundForEachCanvas(canvas, idx);

					const prevListObj = this._prevCanvasList.find(getObj => getObj.id === idx);
					if (prevListObj) {
						this._prevCanvasList[idx].width = canvas.width;
						this._prevCanvasList[idx].height = canvas.height;
					} else {
						this._prevCanvasList.push({ id: idx, width: canvas.width, height: canvas.height });
					}
				}

			});
		}
	}

	/**
	 * Creating canvas
	 */
	private createCanvas() {
		if (this._imgUrls.length) {
			this.canvasTemplate(this._imgUrls.length);
		} else if (this._bgColors.length) {
			this.canvasTemplate(this._bgColors.length);
		} else {
			this.info('Something went wrong. One attribute is mandatory either URL or backgroundColor.');
		}
	}

	/**
	 * update transition effect and duration
	 */
	private setBgTransition() {
		setTimeout(() => {
			if (this.isCanvasListValid()) {
				this._canvasList.forEach((canvas: HTMLCanvasElement) => {
					if (this._transitionEffect) {
						canvas.style.transitionTimingFunction = this._transitionEffect;
					}
					if (this._transitionDuration) {
						canvas.style.transitionDuration = this._transitionDuration;
					}
				});
			}
		});
	}

	/**
	 * This method is creating canvas and image according to image length and setting image in background.
	 */
	private setBgImage(): void {
		if (this._canvasList && this._canvasList.length) {
			if (this.isCanvasListValid()) {
				this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
					this.setBgImageByCanvas(canvas, idx);
				});
				// Make a backup copy
				this._elBackupImages = [...this._elImages];
			}
		}
	}

	private setBgImageByCanvas(canvas: HTMLCanvasElement, idx: number): void {
		const ctx: any = canvas.getContext('2d');
		this._elImages[idx] = new Image();
		this._elImages[idx].src = this._imgUrls[idx];
		this._elImages[idx].onload = () => {
			this.updateBgImage(this._elImages[idx], ctx);
			if (this._imgUrls.length === idx + 1) {
				this.changeBackground(this._imgUrls.length);
			}
			this.videoBGUpdateAction();
			this._elImages[idx].onload = null;
		};

		// setting background color behind image
		ctx.fillStyle = this._imgBackgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	/**
	 * This method is creating canvas according to color length and setting background color.
	 */
	private setBgColor(): void {
		if (this.isCanvasListValid()) {
			this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
				this.setBgColorByCanvas(canvas, idx);
			});
		}
	}

	private setBgColorByCanvas(canvas: HTMLCanvasElement, idx: number): void {
		const ctx: any = canvas.getContext('2d');
		this.updateBgColor(this._bgColors[idx], ctx);
		if (this._bgColors.length === idx + 1) {
			this.changeBackground(this._bgColors.length);
		}
		this.videoBGUpdateAction();
	}

	private videoBGUpdateAction() {
		if (this._videoCrop !== "") {
			this._videoDimensions.forEach((video) => {
				if (this.isCanvasListValid()) {
					this._canvasList.forEach((canvas: HTMLCanvasElement) => {
						const ctx: any = canvas.getContext('2d');
						if (video.action === this.VIDEO_ACTION.STARTED) {
							ctx.clearRect(video.left, video.top, video.width, video.height);
							this._isRefilled = false;
						}
					})
				}
			});
		}
	}

	/**
	 * Updating background color and calling video crop function
	 * @param color is background color
	 * @param ctx is canvas context
	 */
	private updateBgColor(color: string, ctx: any) {
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, this._elCanvas.width, this._elCanvas.height);
		publishEvent('b', 'canvas.created', true);
	}

	/**
	 * Changing background image/color with fadein effect as per refresh rate time.
	 */
	private changeBackground(count: number) {
		clearInterval(this._interval);
		if (count > 1) {
			let isBackgroundSet: boolean = false;
			this._canvasList.forEach((c: HTMLCanvasElement) => {
				if (c.classList && c.classList.contains('ch5bg-fadein')) {
					isBackgroundSet = true;
					return;
				}
			});
			if (isBackgroundSet === false) {
				this._canvasList[0].classList.add('ch5bg-fadein');
			}
			// this._bgIdx = 1;
			this._interval = setInterval(() => {
				if (this.isCanvasListValid()) {
					this._canvasList.forEach((c: HTMLCanvasElement) => c.classList.remove('ch5bg-fadein'));
					this._canvasList[this._bgIdx].classList.add('ch5bg-fadein');
					this._bgIdx++;
					if (this._bgIdx === count) {
						this._bgIdx = 0;
					}
				}
			}, this._refreshRate * 1000);
		} else {
			this._canvasList[0].classList.add('ch5bg-fadein');
		}
	}

	/**
	 * Updating background image as per condition and calling video crop function.
	 * @param img is background image object
	 * @param ctx is canvas context
	 */
	private updateBgImage(img: HTMLImageElement, ctx: any) {
		if (!_.isNil(this._repeat)) {
			this.updateBgImageRepeat(img, this._elCanvas, ctx);
		} else {
			this.updateBgImageScale(img, this._elCanvas, ctx);
		}
	}

	/**
	 * Re-filling background
	 */
	public refillBackground() {
		if (this.isCanvasListValid()) {
			this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
				const ctx: any = canvas.getContext('2d');
				switch (this._canvasList.length) {
					case this._imgUrls.length:
						this._elImages = [...this._elBackupImages];
						this.updateBgImage(this._elImages[idx], ctx);
						break;
					case this._bgColors.length:
						this.updateBgColor(this._bgColors[idx], ctx);
						break;
				}
				this._isRefilled = true;
			});
		}
	}

	/**
	 * Cutting background as per video dimension and position
	 */
	private videoBGAction() {
		if (this._elCanvas && Object.keys(this._elCanvas).length === 0 && this._elCanvas.constructor === Object) {
			return;
		}

		if (this._videoCrop && typeof this._videoCrop === 'string') {
			this._videoRes = JSON.parse(this._videoCrop);
		}
		if (this._videoRes && this._videoRes.action !== this.VIDEO_ACTION.REFILL) {
			const topOffset = this._elCanvas.getBoundingClientRect().top;
			const leftOffset = this._elCanvas.getBoundingClientRect().left;
			this._videoRes.left = this._videoRes.left - leftOffset;
			this._videoRes.top = this._videoRes.top - topOffset;

			this._videoRes.left = Math.ceil(this._videoRes.left);
			this._videoRes.top = Math.ceil(this._videoRes.top);

			this.manageVideoInfo(this._videoRes);

			if (this._videoDimensions.length) {
				this._videoDimensions.map((video: ICh5VideoBackground) => {
					this.info("\nvideoBGAction() -> Video Tag Id " + video.id + " is in Viewport: " + this.isInViewport(video.id));
					if (this.isInViewport(video.id)) {
						if (this.isCanvasListValid()) {
							this._canvasList.forEach((canvas: HTMLCanvasElement, cIdx: number) => {
								const ctx: any = canvas.getContext('2d');
								if (video.action === this.VIDEO_ACTION.STARTED || video.action === this.VIDEO_ACTION.RESIZE) { // while playing video
									ctx.clearRect(video.left, video.top, video.width, video.height);
									this._isRefilled = false;
								} else if (video.action === this.VIDEO_ACTION.STOP || video.action === this.VIDEO_ACTION.MARK ||
									video.action === this.VIDEO_ACTION.ERROR || video.action === this.VIDEO_ACTION.NOURL) {
									ctx.fillStyle = Ch5Background.IMGBGCOLOR;
									ctx.fillRect(video.left, video.top, video.width, video.height);

									// Draw status line
									ctx.beginPath();
									const lHeight = Math.ceil(video.height * 0.04); // thickness of line
									ctx.lineWidth = lHeight;
									ctx.moveTo(video.left, (video.top + video.height) - Math.ceil(lHeight / 2)); // video.left, (video.top + video.height)
									ctx.lineTo((video.width + video.left), (video.top + video.height) - Math.ceil(lHeight / 2)); // (video.width + video.left), (video.top + video.height)
									ctx.strokeStyle = this.MARK_COLORS.get(video.action);
									ctx.setLineDash([]);
									if (video.action === this.VIDEO_ACTION.STOP) {
										ctx.setLineDash([Math.ceil(video.width / 2), 4, 6, 4]); // will show pause marks alternatively
									}
									ctx.stroke();
									this._isRefilled = false;
								}
							});
						}
					}
				})
			}
		}
	}

	/**
	 *
	 * @returns Function to check if the if the _canvasList is a valid attribute
	 */
	private isCanvasListValid() {
		return (!!this._canvasList && this._canvasList != null && this._canvasList.length > 0);
	}
}

if (typeof window === 'object' && typeof window.customElements === 'object' && typeof window.customElements.define === 'function') {
	window.customElements.define(Ch5Background.ELEMENT_NAME, Ch5Background);
}

Ch5Background.registerSignalAttributeTypes();

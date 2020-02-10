// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.
import { Ch5Common } from './../ch5-common/ch5-common';
import { ICh5BackgroundAttributes } from './../_interfaces/ch5-background/i-ch5-background-attributes';
import { Ch5Signal, Ch5SignalFactory, subscribeState, unsubscribeState, publishEvent } from '../ch5-core';
import { TCh5BackgroundScale, TCh5BackgroundRepeat } from './../_interfaces/ch5-background/types';
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface IVideoResponse {
    action: string;
    id: number;
    top: number;
    left: number;
    width: number;
    height: number;
}

export class Ch5Background extends Ch5Common implements ICh5BackgroundAttributes {
    /**
     * The first value is considered the default one
     */
    public static SCALE: TCh5BackgroundScale[] = ['stretch', 'fill', 'fit'];
    /**
     * The first value is considered the default one
     */
    public static REPEAT: TCh5BackgroundRepeat[] = ['', 'no-repeat', 'repeat', 'repeat-x', 'repeat-y'];

    public static REFRESHRATE: number = 600;
    public static IMGBGCOLOR: string = 'black';

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

    public primaryCssClass = 'ch5-background';
    public parentCssClassPrefix = '--parent';
    public canvasCssClassPrefix = '--canvas';

    private _elCanvas: HTMLCanvasElement = {} as HTMLCanvasElement;
    private _canvasList: any;
    private _imgUrls: string[] = [];
    private _elImages: HTMLImageElement[] = [];
    private _bgColors: string[] = [];
    private _bgIdx: number = 0;
    private _interval: any;
    private _videoRes: IVideoResponse = {} as IVideoResponse;
    private _isVisible: boolean = false;
    private _videoDimensions: IVideoResponse[] = [];
    private _isRefilled: boolean = true;

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
    private _repeat: TCh5BackgroundRepeat = Ch5Background.REPEAT[0];

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
    private _transitionEffect: string = '';

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

    /**
     * 
     */
    private _canvasSubscriptionId: string = '';

    /**
     * ATTR GETTERS AND SETTERS
     */

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {
        if (this._url !== value) {
            this._url = value;
            this.getBackgroundUrl(this._url);
            this.setAttribute('url', this._url);
        }
    }

    public get backgroundColor(): string {
        return this._backgroundColor;
    }

    public set backgroundColor(value: string) {
        if (this._backgroundColor !== value) {
            this._backgroundColor = value;
            this.getBackgroundColor(this._backgroundColor);
            this.setAttribute('backgroundcolor', this._backgroundColor);
        }
    }

    public get repeat() {
        return this._repeat;
    }

    public set repeat(value: TCh5BackgroundRepeat) {
        if (this._repeat !== value) {
            if (Ch5Background.REPEAT.indexOf(value) >= 0) {
                this._repeat = value;
            } else {
                this._repeat = Ch5Background.REPEAT[0];
            }
            this.setAttribute('repeat', this._repeat);
        }
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

    public get refreshRate() {
        return this._refreshRate;
    }

    public set refreshRate(value: number | string) {
        value = Number(value);
        if (value < 10) {
            value = 10;
        } else if (value > 604800) {
            value = 604800;
        } else if (isNaN(value)) {
            value = Ch5Background.REFRESHRATE;
        }
        if (this._refreshRate !== value) {
            if (Ch5Background.REFRESHRATE) {
                this._refreshRate = value;
            } else {
                this._refreshRate = Ch5Background.REFRESHRATE;
            }
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

    public get transitionEffect(): string {
        return this._transitionEffect;
    }

    public set transitionEffect(value: string) {
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
    }

    public set receiveStateRefreshRate(value: string) {
        this.info("set receiveStateRefreshRate('" + value + "')");
        if (!value || this._receiveStateRefreshRate === value) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateRefreshRate) {
            const oldReceiveIntervalSigName: string = Ch5Signal.getSubscriptionSignalName(
                this._receiveStateRefreshRate
            );

            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveIntervalSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveRefreshRate);
            }
        }

        this._receiveStateRefreshRate = value;
        this.setAttribute('receivestaterefreshrate', value);

        // setup new subscription.
        const receiveIntervalSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateRefreshRate);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveIntervalSigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveRefreshRate = receiveSignal.subscribe(
            (newValue: string) => {
                if (newValue !== '' && newValue !== this.refreshRate) {
                    this.setAttribute('refreshrate', newValue);
                }
            }
        );
    }

    public get receiveStateRefreshRate(): string {
        return this._attributeValueAsString('receivestaterefreshrate');
    }

    public set receiveStateUrl(value: string) {
        this.info("set receiveStateUrl('" + value + "')");
        if (!value || this._receiveStateUrl === value) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateUrl) {

            const oldReceiveUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveUrlSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveUrl);
            }
        }

        this._receiveStateUrl = value;
        this.setAttribute('receivestateurl', value);

        // setup new subscription.
        const receiveUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateUrl);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveUrlSigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveUrl = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== '' && newValue !== this.url) {
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

        this._subReceiveBackgroundColor = receiveSignal.subscribe(
            (newValue: string) => {
                if (newValue !== '' && newValue !== this.backgroundColor) {
                    this.setAttribute('backgroundcolor', newValue);
                }
            }
        );
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

            /**
             * on window resize
             */
            fromEvent(window, 'resize').pipe(debounceTime(400)).subscribe(() => {
                this.updateCanvasDimensions();
            });

            fromEvent(window, 'orientationchange').pipe(debounceTime(400)).subscribe(() => {
                this.updateCanvasDimensions();
            });

            // creating canvas
            this.createCanvas();
        });
    }

    /**
     *  Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());

        customElements.whenDefined('ch5-background').then(() => {
            Ch5CoreIntersectionObserver.getInstance().observe(this, () => {
                if (this.elementIsInViewPort) {
                    if (this._isVisible) {
                        if (this.parentElement) {
                            this.parentElement.classList.add(this.primaryCssClass + this.parentCssClassPrefix);
                        }
                        this.updateCanvasDimensions();
                        this._isVisible = false;
                    }

                    // getting video response
                    this._videoSubscriptionId = subscribeState('o', 'ch5.video.background', (response: any) => {
                        if (response && Object.keys(response).length) {
                            if (response.action === 'refill') {
                                if (this._videoRes.id) {
                                    this.refillBackground();
                                    this.setAttribute('videocrop', JSON.stringify(response));
                                    this._videoDimensions = [];
                                }
                            } else {
                                this.setAttribute('videocrop', JSON.stringify(response));
                            }
                        }
                    });
                } else {
                    this._isVisible = true;
                    if (this._videoSubscriptionId) {
                        unsubscribeState('o', 'ch5.video.background', this._videoSubscriptionId);
                    }
                    if (this._canvasSubscriptionId) {
                        unsubscribeState('b', 'canvas.created', this._canvasSubscriptionId);
                    }
                }
            });
        });
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
                this.updateBackground();
                if (oldValue !== null) {
                    this._canvasSubscriptionId = subscribeState('b', 'canvas.created', (response: boolean) => {
                        if (response) {
                            this.clearRectBackground();
                        }
                    });
                }
                break;
            case 'backgroundcolor':
                if (!this.hasAttribute('url')) {
                    if (this.hasAttribute('backgroundcolor')) {
                        this.backgroundColor = newValue;
                    } else {
                        this.backgroundColor = '';
                    }
                    this.updateBackground();
                    if (oldValue !== null) {
                        this._canvasSubscriptionId = subscribeState('b', 'canvas.created', (response: boolean) => {
                            if (response) {
                                this.clearRectBackground();
                            }
                        });
                    }
                }
                break;
            case 'repeat':
                if (this.hasAttribute('repeat')) {
                    this.repeat = newValue as TCh5BackgroundRepeat;
                } else {
                    this.repeat = Ch5Background.REPEAT[0];
                }
                this.updateBackground();
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
                    this.refreshRate = newValue;
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
                this.clearRectBackground();
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
                    this.transitionEffect = newValue;
                } else {
                    this.transitionEffect = '';
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
                if (this.hasAttribute('receivestatebackgroundcolor')) {
                    this.receiveStateBackgroundColor = newValue;
                } else {
                    this.receiveStateBackgroundColor = '';
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

        if (this.hasAttribute('backgroundcolor') && !this.hasAttribute('url')) {
            this.backgroundColor = this.getAttribute('backgroundcolor') as string;
        }

        if (this.hasAttribute('repeat')) {
            this.repeat = this.getAttribute('repeat') as TCh5BackgroundRepeat;
        }

        if (this.hasAttribute('scale')) {
            this.scale = this.getAttribute('scale') as TCh5BackgroundScale;
        }

        if (this.hasAttribute('refreshrate')) {
            this.refreshRate = this.getAttribute('refreshrate') as number | string;
        }

        if (this.hasAttribute('videocrop')) {
            this.videoCrop = this.getAttribute('videocrop') as string;
        }

        if (this.hasAttribute('imgbackgroundcolor')) {
            this.imgBackgroundColor = this.getAttribute('imgbackgroundcolor') as string;
        }

        if (this.hasAttribute('transitioneffect')) {
            this.transitionEffect = this.getAttribute('transitioneffect') as string;
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

        if (this.hasAttribute('receivestatebackgroundcolor')) {
            this.receiveStateBackgroundColor = this.getAttribute('receivestatebackgroundcolor') as string;
        }
    }

    /**
     * Calling image and bg color function as per condition.
     */
    protected updateBackground(): void {
        let timer: number = 0;
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (this._imgUrls.length) {
                this.setBgImage();
            } else if (this._bgColors.length) {
                this.setBgColor();
            } else {
                this.info('Something went wrong. One attribute is mandatory either URL or backgroundColor.');
            }
        });
    }

    /**
     * This method is converting string to array of string
     * @param values is string of image urls which are saprated with '|'.
     */
    private getBackgroundUrl(values: string) {
        this._imgUrls = values.split('|');
        this._imgUrls = this._imgUrls.map(url => url.trim());
    }

    /**
     * This method is converting string to array of string
     * @param values is string of background colors which are saprated with '|'.
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
        const x = 0;
        const y = 0;
        ctx.drawImage(img, x, y, canvas.width, canvas.height);
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
        let pattern: any;
        switch (this._repeat) {
            case 'repeat':
                pattern = ctx.createPattern(img, 'repeat');
                break;
            case 'repeat-x':
                pattern = ctx.createPattern(img, 'repeat-x');
                break;
            case 'repeat-y':
                pattern = ctx.createPattern(img, 'repeat-y');
                break;
            default:
                pattern = ctx.createPattern(img, 'no-repeat');
                break;
        }
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        publishEvent('b', 'canvas.created', true);
    }

    /**
     * This method is creating the canvas template and setting the dimension.
     */
    private canvasTemplate(count: number) {
        for (let i = 0; i < count; ++i) {
            this._elCanvas = document.createElement('canvas');
            this._elCanvas.classList.add(this.primaryCssClass + this.canvasCssClassPrefix);
            this.appendChild(this._elCanvas);
            this.setCanvasDimensions(this._elCanvas);
            if (i === (count - 1)) {
                this._canvasList = this.querySelectorAll<HTMLCanvasElement>('canvas');
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
     * updating canvas dimensions
     */
    private updateCanvasDimensions() {
        this._canvasList.forEach((canvas: HTMLCanvasElement) => {
            this.setCanvasDimensions(canvas);
        });

        this.updateBackground();
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
        let timer: number = 0;
        clearTimeout(timer);
        timer = setTimeout(() => {
            this._canvasList.forEach((canvas: HTMLCanvasElement) => {
                if (this._transitionEffect) {
                    canvas.style.transitionTimingFunction = this._transitionEffect;
                }
                if (this._transitionDuration) {
                    canvas.style.transitionDuration = this._transitionDuration;
                }
            });
        });
    }

    /**
     * This method is creating canvas and image according to image length and setting image in background.
     */
    private setBgImage(): void {
        this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
            const ctx: any = canvas.getContext('2d');
            this._elImages[idx] = new Image();
            this._elImages[idx].src = this._imgUrls[idx];
            this._elImages[idx].onload = () => {
                this.updateBgImage(this._elImages[idx], ctx);
                if (this._imgUrls.length === idx + 1) {
                    this.changeBackground(this._imgUrls.length);
                }
                delete this._elImages[idx].onload;
            };

            // setting background color behind image
            ctx.fillStyle = this._imgBackgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    /**
     * This method is creating canvas according to color length and setting background color.
     */
    private setBgColor(): void {
        this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
            const ctx: any = canvas.getContext('2d');
            this.updateBgColor(this._bgColors[idx], ctx);
            if (this._bgColors.length === idx + 1) {
                this.changeBackground(this._bgColors.length);
            }
        });
    }

    /**
     * Updating background color and calling video crop function
     * @param color is backround color
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
        this._canvasList[0].classList.add('ch5bg-fadein');
        clearInterval(this._interval);
        if (count > 1) {
            this._bgIdx = 1;
            this._interval = setInterval(() => {
                this._canvasList.forEach((c: HTMLCanvasElement) => c.classList.remove('ch5bg-fadein'));
                this._canvasList[this._bgIdx].classList.add('ch5bg-fadein');
                this._bgIdx++;
                if (this._bgIdx === count) {
                    this._bgIdx = 0;
                }
            }, this._refreshRate * 1000);
        }
    }

    /**
     * Updating background image as per condition and calling video crop function.
     * @param img is background image object
     * @param ctx is canvas context
     */
    private updateBgImage(img: HTMLImageElement, ctx: any) {
        if (this._repeat) {
            this.updateBgImageRepeat(img, this._elCanvas, ctx);
        } else {
            this.updateBgImageScale(img, this._elCanvas, ctx);
        }
    }

    /**
     * Re-filling background
     */
    private refillBackground() {
        if (!this._isRefilled) {
            let timer: number = 0;
            clearTimeout(timer);
            timer = setTimeout(() => {
                this._canvasList.forEach((canvas: HTMLCanvasElement, idx: number) => {
                    const ctx: any = canvas.getContext('2d');

                    switch (this._canvasList.length) {
                        case this._elImages.length:
                            this.updateBgImage(this._elImages[idx], ctx);
                            break;
                        case this._bgColors.length:
                            this.updateBgColor(this._bgColors[idx], ctx);
                            break;
                    }
                });
                this._isRefilled = true;
            });
        }
    }

    /**
     * Cutting background as per video dimension and position
     */
    private clearRectBackground() {
        if (this._videoCrop && typeof this._videoCrop === 'string') {
            this._videoRes = JSON.parse(this._videoCrop);
        }
        if (this._videoRes && (this._videoRes.action !== 'refill')) {
            const topOffset = this._elCanvas.getBoundingClientRect().top;
            const leftOffset = this._elCanvas.getBoundingClientRect().left;
            this._videoRes.left = this._videoRes.left - leftOffset;
            this._videoRes.top = this._videoRes.top - topOffset;
            if (this._videoRes.top < 0 || this._videoRes.left < 0) {
                this.refillBackground();
                return;
            }
            // Avoiding negative values and decimal values in video and background
            if (this._videoRes.left > 0 && this._videoRes.left < 1) {
                this._videoRes.left = 0;
            }
            if (this._videoRes.top > 0 && this._videoRes.top < 1) {
                this._videoRes.top = 0;
            }
            this._videoRes.left = Math.ceil(this._videoRes.left);
            this._videoRes.top = Math.ceil(this._videoRes.top);

            const index = this._videoDimensions.findIndex((item: IVideoResponse) => item.id === this._videoRes.id);
            if (index > -1) {
                this._videoDimensions[index] = this._videoRes;
            } else {
                this._videoDimensions.push(this._videoRes);
            }
            if (this._videoDimensions.length) {
                this._videoDimensions.map((video: IVideoResponse) => {
                    let timer: number = 0;
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        this._canvasList.forEach((canvas: HTMLCanvasElement) => {
                            const ctx: any = canvas.getContext('2d');
                            ctx.clearRect(video.left, video.top, video.width, video.height);
                        });
                    });
                })
                this._isRefilled = false;
            }
        }
    }
}

if (typeof window === 'object' && typeof window.customElements === 'object' && typeof window.customElements.define === 'function') {
    window.customElements.define('ch5-background', Ch5Background);
}

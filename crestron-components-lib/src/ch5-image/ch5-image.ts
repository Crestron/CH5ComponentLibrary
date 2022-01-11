// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5CoreIntersectionObserver } from "../ch5-core/ch5-core-intersection-observer";
import { isNil, isEmpty } from 'lodash';
import { Ch5RoleAttributeMapping } from "../utility-models";
import { TCh5ProcessUriParams } from "../ch5-common/interfaces";
import { ICh5ImageAttributes } from "./interfaces/i-ch5-image-attributes";
import {Ch5SignalElementAttributeRegistryEntries} from '../ch5-common/ch5-signal-attribute-registry';
import { Subscription } from "rxjs/internal/Subscription";

export interface IShowStyle {
    visibility: string;
    opacity: string;
    display: string;
}

export class Ch5Image extends Ch5Common implements ICh5ImageAttributes {

    public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
        ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
        receivestateurl: { direction: "state", stringJoin: 1, contractName: true },

        sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
        sendeventontouch: { direction: "event", booleanJoin: 1, contractName: true },
        sendeventonerror: { direction: "event", stringJoin: 1, contractName: true }
    };

    public static readonly COMPONENT_DATA: any = {
        DIRECTIONS: {
            default: Ch5Common.DIRECTION[0],
            values: Ch5Common.DIRECTION,
            key: 'direction',
            classListPrefix: 'ch5-image--dir--'
        },
    };

    public primaryCssClass = 'ch5-image';
    public cssClassPrefix = 'ch5-image';

    private _img: HTMLImageElement = {} as HTMLImageElement;

    /**
     * COMPONENT ATTRIBUTES
     *
     * - alt
     * - height
     * - width
     * - refreshRate
     * - url
     */

    /**
     * Alternative text to be shown for image
     *
     * @type {string}
     * @private
     */
    private _alt: string = '';

    /**
     * Height for image
     *
     * @type {string}
     * @private
     */
    private _height: string = '';

    /**
     * Width for image.
     *
     * @type {string}
     * @private
     */
    private _width: string = '';

    /**
     * Number of seconds between each call to the image URL in order to get new data. If 0, no refresh will be done.
     *
     * @type {number}
     * @private
     */
    private _refreshRate: number = 0;

    /**
     * image URL. Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP.
     *
     * @type {string}
     * @private
     */
    private _url: string = '';

    /**
     * image direction
     */
    private _direction: string = Ch5Common.DIRECTION[0];

    /**
     * COMPONENT RECEIVED SIGNALS
     *
     * - receiveStateUrl
     */

    /**
     * The name of a string signal. The value of this string signal will be added to the url attribute
     *
     * HTML attribute name: receiveStateUrl or receivestateurl
     */
    private _sigNameReceiveUrl: string = '';

    private _sigNameReceiveUser: string = '';

    private _sigNameReceivePassword: string = '';

    private _sigNameReceiveMode: string = '';

    /**
     * The subscription id for the receiveStateUrl signal
     */
    private _subReceiveUrl: string = '';

    private _subReceiveUser: string = '';
    
    private _subReceivePassword: string = '';

    private _subReceiveMode: string = '';

    /**
     * COMPONENT SEND SIGNALS
     *
     * - sendEventOnTouch
     * - sendEventOnClick
     * - sendEventOnError
     */

    /**
     * The name of the boolean signal that will be sent to native on click or tap event (mouse or finger up and down in
     * a small period of time)
     *
     * HTML attribute name: sendEventOnClick or sendeventonclick
     */
    private _sigNameSendOnClick: string = '';

    /**
     * HTML attribute name: sendEventOnError or sendeventonerror
     */
    private _sigNameSendOnError: string = '';


    /**
     * The name of the boolean signal that will be sent to native on touch.
     * boolean true while finger is on the glass, digital false when finger is released or “roll out”.
     * The signal will be sent with value true and reasserted true every 500ms while the finger is on the
     * component. The reassertion is needed to avoid unending ramp should there be a communications error, a failure of
     * the image itself or any intermediate proxy of the signal.
     * This signal should not be generated as part of a gesture swipe.
     *
     * HTML attribute name: sendEventOnTouch or sendeventontouch
     */
    private _sigNameSendOnTouch: string = '';

    /**
     * EVENTS
     *
     * click - inherited
     * press - custom/inherited
     * release - custom/inherited
     * error - inherited
     */

    /**
     * Ch5Pressable manager
     *
     * @private
     * @type {(Ch5Pressable | null)}
     * @memberof Ch5Image
     */
    private _pressable: Ch5Pressable | null = null;

    /**
     * Event error: error on loading the image
     */
    public errorEvent: Event;

    /**
     *
     */
    private _timerIdForTouch: number | null = null;

    /**
     * Reflects the long touch state of the component.
     */
    private _longTouch: boolean = false;

    /**
     * The interval id ( from setInterval ) for reenforcing the  onTouch signal
     * This id allow canceling the interval.
     */
    private _intervalIdForOnTouch: number | null = null;

    /**
     * Value in ms for reenforcing the  onTouch signal
     */
    private _intervalTimeoutForOnTouch: number = 500;

    /**
     * The interval id ( from setInterval ) for refresh rate interval
     * This id allow canceling the interval.
     */
    private _intervalIdForRefresh: number | null = null;

    private _imageWasLoaded: boolean = false;

    /**
     * User for authentication in order to get the image
     *
     * @type {string}
     */
    private _user: string = '';

    /**
     * Password for authentication in order to get the image
     *
     * @type {string}
     */
    private _password: string = '';

    /**
     * Protocol for authentication in order to get the image
     *
     * @type {string}
     */
    private _protocol: string = '';

    private _isPressedSubscription: Subscription | null = null;;

    private _buttonPressedInPressable = true;

    private _repeatDigitalInterval = 0;
    
    private STATE_CHANGE_TIMEOUTS = 500;
    private _mode?: number;

    /**
     * ATTR GETTERS AND SETTERS
     */

    public get alt() {
        return this._alt;
    }

    public set alt(value: string) {
        if (value === undefined || value === null) {
            value = '';
        }
        const trValue = this._getTranslatedValue('alt', value);
        if (this._alt !== trValue || this._img.alt !== trValue) {
            this._alt = trValue;
            this._img.alt = trValue;
            this.setAttribute('alt', trValue);
            this._img.setAttribute('alt', trValue);
        }
    }

    public get height() {
        return this._height;
    }

    public set height(value: string) {
        if (this._height !== value) {
            this._height = value || '';

            this.style.height = value || '';
            this.setAttribute('height', this._height);
        }
    }

    public get width() {
        return this._width;
    }

    public set width(value: string) {
        if (this._width !== value) {
            this._width = value || '';

            this.style.width = value || '';
            this.setAttribute('width', this._width);
        }
    }

    public get refreshRate() {
        return this._refreshRate;
    }

    public set refreshRate(value: number) {
        value = Number(value);

        if (isNaN(value)) {
            value = 0;
        }

        if (this._refreshRate !== value) {
            this._refreshRate = value;
        }
    }

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {

        if (!this._url) {
            this._img?.removeAttribute('src');
        }

        if (this._url !== value) {
            this.updateImageUrl(value);

            if (this.canProcessUri()) {
                this.processUri();
            }
        }
    }

    public get direction() {
        return this._direction;
    }

    public set direction(value: string | null) {
        if (value === this._direction) {
            return;
        }
        if (value == null) {
            value = Ch5Common.DIRECTION[0];
        }
        if (Ch5Common.DIRECTION.indexOf(value) >= 0) {
            this._direction = value;
        } else {
            this._direction = Ch5Common.DIRECTION[0];
        }
        this.setAttribute('dir', value);
    }

    public set mode(mode: number | undefined) {
        this.info('set mode to ' + mode)
        if (!isNil(mode) && this.mode !== mode) {
            this._mode = mode;
            this.setAttribute('mode', mode + '');

            setTimeout(() => {
                const modeNode = this.getModeNode(mode);
                if (modeNode.hasAttribute('url') && modeNode.getAttribute('url')) {
                    this.url = modeNode.getAttribute('url') as string;
                }
            });
        }
    }

    public get mode(): number | undefined {
        return this._mode;
    }

    public getModeNodes() {
        this.info('getModeNodes got called');
        return this.querySelectorAll('ch5-image-mode');
    }

    public getModeNode(index: number): Element {
        this.info('getting mode with index ' + index);
        const modeNodes = this.getModeNodes();

        if (!modeNodes[index]) {
            throw new Error('Mode is not defined');
        }

        return modeNodes[index];
    }

    /**
     * SIGNALS GETTERS AND SETTERS
     */

    public set receiveStateUser(value: string) {
        this.info('set receiveStateUser(\'' + value + '\')');

        if ('' === value
            || this._sigNameReceiveUser === value
            || null === value
            || undefined === value) {
            return;
        }

        this.user = '';

        // clean up old subscription
        if (this._sigNameReceiveUser !== ''
            && this._sigNameReceiveUser !== undefined
            && this._sigNameReceiveUser !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveUser);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveUser);
            }
        }

        this._sigNameReceiveUser = value;
        this.setAttribute('receiveStateUser', value);

        // setup new subscription.
        const sigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveUser);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveUser = receiveSignal.subscribe((newValue: string) => {
            if ('' !== newValue && newValue !== this._user) {
                this.setAttribute('user', newValue);
                this.user = newValue;
                this._initRefreshRate();
            }
        });
    }

    public get receiveStateUser(): string {
        return this._attributeValueAsString('receiveStateUser');
    }

    public set receiveStatePassword(value: string) {
        this.info('set receiveStatePassword(\'' + value + '\')');

        if ('' === value
            || this._sigNameReceivePassword === value
            || null === value
            || undefined === value) {
            return;
        }

        this.password = '';

        // clean up old subscription
        if (this._sigNameReceivePassword !== ''
            && this._sigNameReceivePassword !== undefined
            && this._sigNameReceivePassword !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePassword);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceivePassword);
            }
        }

        this._sigNameReceivePassword = value;
        this.setAttribute('receivestatepassword', value);

        // setup new subscription.
        const sigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePassword);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceivePassword = receiveSignal.subscribe((newValue: string) => {
            if ('' !== newValue && newValue !== this._password) {
                this.setAttribute('password', newValue);
                this.password = newValue;
                this._initRefreshRate();
            }
        });
    }

    public get receiveStatePassword(): string {
        return this._attributeValueAsString('receiveStatePassword');
    }

    public get receiveStateUrl(): string {
        // The internal property is changed if/when the element is removed from dom
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestateurl');
    }

    public set receiveStateUrl(value: string) {
        this.info('set receiveStateUrl(\'' + value + '\')');

        if ('' === value
            || this._sigNameReceiveUrl === value
            || null === value
            || undefined === value) {
            return;
        }

        this.url = '';

        // clean up old subscription
        if (this._sigNameReceiveUrl !== ''
            && this._sigNameReceiveUrl !== undefined
            && this._sigNameReceiveUrl !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveUrl);
            const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
                .getBooleanSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveUrl);
            }
        }


        this._sigNameReceiveUrl = value;
        this.setAttribute('receivestateurl', value);

        // setup new subscription.
        const sigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveUrl);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveUrl = receiveSignal.subscribe((newValue: string) => {
            if ('' !== newValue && newValue !== this._url) {
                this.setAttribute('url', newValue);
                this._initRefreshRate();
            }
        });
    }

    public get receiveStateMode(): string {
        return this._attributeValueAsString('receivestatemode');
    }

    public set receiveStateMode(value: string) {
        this.info('set receivestatemode(\'' + value + '\')');

        if ('' === value
            || this._sigNameReceiveMode === value
            || null === value
            || undefined === value) {
            return;
        }

        this.mode = 0;

        // clean up old subscription
        if (this._sigNameReceiveMode !== ''
            && this._sigNameReceiveMode !== undefined
            && this._sigNameReceiveMode !== null) {

            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveMode);
            const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
                .getNumberSignal(oldSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveMode);
            }
        }


        this._sigNameReceiveMode = value;
        this.setAttribute('receivestateurl', value);

        // setup new subscription.
        const sigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveMode);
        const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(sigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveMode = receiveSignal.subscribe((newValue: number) => {
            if (newValue !== this.mode) {
                this.setAttribute('mode', newValue + '');
                this._initRefreshRate();
            }
        });
    }

    public get sendEventOnClick(): string {
        return this._sigNameSendOnClick;
    }

    public set sendEventOnClick(value: string) {
        this.info('set sendEventOnClick(\'' + value + '\')');

        // prevent infinte loop
        if ('' === value) {
            return;
        }

        if (this._sigNameSendOnClick !== value) {
            this._sigNameSendOnClick = value;
            this.setAttribute('sendeventonclick', value);
        }
    }

    public set sendEventOnError(value: string) {
        this.info('set sendEventOnError(\'' + value + '\')');

        // prevent infinite loop
        if ('' === value) {
            return;
        }

        if (this._sigNameSendOnError !== value) {
            this._sigNameSendOnError = value;
            this.setAttribute('sendeventonerror', value);
        }
    }

    public get sendEventOnError(): string {
        return this._sigNameSendOnError;
    }

    public set sendEventOnTouch(value: string) {
        this.info('set sendEventOnTouch(\'' + value + '\')');

        // prevent infinite loop
        if ('' === value) {
            return;
        }

        if (this._sigNameSendOnTouch !== value) {
            this._sigNameSendOnTouch = value;
            this.setAttribute('sendeventontouch', value);
        }
    }

    public get sendEventOnTouch(): string {
        return this._sigNameSendOnTouch;
    }

    /**
     * @param {string} userName
     */
    public set user(userName: string) {
        if (isNil(userName) || this.user === userName) {
            return;
        }

        this._user = userName;
        if (this.canProcessUri()) {
            this.processUri();
        }
    }

    /**
     *
     * @return {string}
     */
    public get user(): string {
        return this._user;
    }

    /**
     * @param {string} password
     */
    public set password(password: string) {
        if (!isNil(password) && this.password === password) {
            return;
        }

        this._password = password;


        if (this.canProcessUri()) {
            this.processUri();
        }
    }

    /**
     * @return {string}
     */
    public get password(): string {
        return this._password;
    }

    public set protocol(protocol: string) {
        if (isNil(protocol)) {
            return;
        }

        this._protocol = protocol;
    }

    public get protocol(): string {
        return this._protocol;
    }

    /**
     * CONSTRUCTOR
     */
    public constructor() {
        super();

        // custom release event
        this.errorEvent = new CustomEvent("error", {
            bubbles: true,
            cancelable: false,
            detail: "ch5-image triggered error CustomEvent",
        });

        this._pressable = new Ch5Pressable(this);

        // events binding
        this._onClick = this._onClick.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchCancel = this._onTouchCancel.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onError = this._onError.bind(this);

        // check if the img element has been created by verifying one of its properties
        if (typeof this._img.classList === 'undefined') {
            // Create an <img> element that will load the image
            this._img = document.createElement('img');

            // add primary class
            this._img.classList.add(this.primaryCssClass);
        }
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.info(' connectedCallback() - start');

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5Image);
        }

        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());

        // init pressable before initAttributes because pressable subscribe to gestureable attribute
        if (null !== this._pressable) {
            this._pressable.init();
            this._subscribeToPressableIsPressed();
        }

        customElements.whenDefined('ch5-image').then(() => {
            this.cacheComponentChildrens();
            const img = this.querySelector('img');

            if (img) {
                img.remove();
            }

            if (this._img.parentElement !== this) {
                this.appendChild(this._img);
            }

            this.style.overflow = 'hidden';

            this.initAttributes();
            this.attachEventListeners();

            this.updateCssClasses();

            this._initRefreshRate(); // prepares to start refreshing the image ( if the proper conditions are met )

            this.initCommonMutationObserver(this);

            this.info(' connectedCallback() - end');
        });
    }

    /**
     * Called every time the element is removed from the DOM.
     * Useful for running clean up code.
     */
    public disconnectedCallback() {
        this.removeEvents();
        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();

        if (null !== this._intervalIdForRefresh) {
            window.clearInterval(this._intervalIdForRefresh);

            if (Ch5CoreIntersectionObserver.getInstance() instanceof Ch5CoreIntersectionObserver) {
                Ch5CoreIntersectionObserver.getInstance().unobserve(this);
            }
        }

        if (null !== this._timerIdForTouch) {
            window.clearTimeout(this._timerIdForTouch);
            this._timerIdForTouch = null;
        }

        if (null !== this._intervalIdForOnTouch) {
            window.clearInterval(this._intervalIdForOnTouch);
            this._intervalIdForOnTouch = null;
        }
    }

    // Respond to attribute changes.
    static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;

        const ch5ImageAttributes = [
            // attributes
            'alt',
            'width',
            'height',
            'user',
            'password',
            'url',
            'refreshrate',
            'dir',
            'mode',

            // receive signals
            'receivestateurl',

            // send signals
            'sendeventonclick',
            'sendeventonerror',
            'sendeventontouch'
        ];

        return commonAttributes.concat(ch5ImageAttributes);
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-image attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

        switch (attr) {
            case 'url':
                if (this.hasAttribute('url')) {
                    this.url = newValue;
                } else {
                    this.url = '';
                }
                break;
            case 'alt':
                if (this.hasAttribute('alt')) {
                    this.alt = newValue;
                    this.setAttribute('aria-label', this.alt);
                } else {
                    this.alt = '';
                    this.removeAttribute('aria-label');
                }
                break;
            case 'width':
                if (this.hasAttribute('width')) {
                    this.width = newValue;
                } else {
                    this.width = '';
                }
                break;
            case 'height':
                if (this.hasAttribute('height')) {
                    this.height = newValue;
                } else {
                    this.height = '';
                }
                break;
            case 'mode':
                if (this.hasAttribute('mode')) {
                    this.mode = parseFloat(newValue);
                }
            case 'refreshrate':
                if (this.hasAttribute('refreshrate')) {
                    this.refreshRate = Number(newValue);
                    if (this._refreshRate !== null &&
                        this._refreshRate !== 0) {
                        Ch5CoreIntersectionObserver.getInstance().observe(this, this.updateElementInViewportChange);
                    }
                } else {
                    this.refreshRate = 0;
                }
                this._initRefreshRate();
                break;
            case 'receivestateuser':
                if (this.hasAttribute('receivestateuser')) {
                    this.receiveStateUser = newValue;
                }
                break;
            case 'receivestatepassword':
                if (this.hasAttribute('receivestatepassword')) {
                    this.receiveStatePassword = newValue;
                }
                break;
            case 'receivestateurl':
                if (this.hasAttribute('receivestateurl')) {
                    this.receiveStateUrl = newValue;
                } else {
                    this.receiveStateUrl = '';
                }
                break;
            case 'receivestatemode':
                if (this.hasAttribute('receivestatemode')) {
                    this.receiveStateMode = newValue;
                } else {
                    this.receiveStateMode = '';
                }
                break;
            case 'sendeventonclick':
                if (this.hasAttribute('sendeventonclick')) {
                    this.sendEventOnClick = newValue;
                } else {
                    this.sendEventOnClick = '';
                }
                break;
            case 'sendeventontouch':
                if (this.hasAttribute('sendeventontouch')) {
                    this.sendEventOnTouch = newValue;
                } else {
                    this.sendEventOnTouch = '';
                }
                break;
            case 'sendeventonerror':
                if (this.hasAttribute('sendeventonerror')) {
                    this.sendEventOnError = newValue;
                } else {
                    this.sendEventOnError = '';
                }
                break;
            case 'dir':
                if (this.hasAttribute('dir')) {
                    this.direction = newValue.toLowerCase();
                } else {
                    this.direction = Ch5Common.DIRECTION[0];
                }
                this._img.classList.add(this.cssClassPrefix + '--dir--' + this.direction);
                break;
            case 'user':
                if (this.hasAttribute('user')) {
                    this.user = newValue;
                } else {
                    this.user = "";
                }
                break;
            case 'password':
                if (this.hasAttribute('password')) {
                    this.password = newValue;
                } else {
                    this.password = "";
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
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();
        if ('' !== this._subReceiveUrl && '' !== this._sigNameReceiveUrl) {
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(this._sigNameReceiveUrl);
            if (null !== sigLabel) {
                sigLabel.unsubscribe(this._subReceiveUrl);
                this._sigNameReceiveUrl = '';
            }
        }
    }

    public processUri(): void {
        const processUriPrams: TCh5ProcessUriParams = {
            protocol: this.protocol,
            user: this.user,
            password: this.password,
            url: this._url
        }
        const imageUri = Ch5Common.processUri(processUriPrams);
        if (!!imageUri) {
            this.updateImageUrl(imageUri);
        }
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        super.initAttributes();

        if (this.hasAttribute('receiveStateUrl')) {
            this.receiveStateUrl = this.getAttribute('receiveStateUrl') as string;
        }

        if (this.hasAttribute('receivestateuser')) {
            this.receiveStateUser = this.getAttribute('receivestateuser') as string;
        }

        if (this.hasAttribute('receivestatepassword')) {
            this.receiveStatePassword = this.getAttribute('receivestatepassword') as string;
        }

        if (this.hasAttribute('receivestatemode')) {
            this.receiveStateMode = this.getAttribute('receivestatemode') as string;
        }
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();

        this.addEventListener('click', this._onClick);

        this.addEventListener('touchstart', this._onTouchStart, { passive: true });
        this.addEventListener('touchend', this._onTouchEnd);
        this.addEventListener('touchmove', this._onTouchMove, { passive: true });
        this.addEventListener('touchcancel', this._onTouchCancel);

        this._img.addEventListener('error', this._onError);
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();
    }

    private _subscribeToPressableIsPressed() {
		const REPEAT_DIGITAL_PERIOD = 200;
		const MAX_REPEAT_DIGITALS = 30000 / REPEAT_DIGITAL_PERIOD;
		if (this._isPressedSubscription === null && this._pressable !== null) {
			this._isPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				this.info(`Ch5Button.pressableSubscriptionCb(${value})`);
				if (value !== this._buttonPressedInPressable) {

					this._buttonPressedInPressable = value;
					if (value === false) {
						if (this._repeatDigitalInterval !== null) {
							window.clearInterval(this._repeatDigitalInterval as number);
						}
						this.sendValueForRepeatDigitalWorking(false);
						setTimeout(() => {
							// this.setButtonDisplay();
						}, this.STATE_CHANGE_TIMEOUTS);
					} else {
						this.sendValueForRepeatDigitalWorking(true);
						if (this._repeatDigitalInterval !== null) {
							window.clearInterval(this._repeatDigitalInterval as number);
						}
						let numRepeatDigitals = 0;
						this._repeatDigitalInterval = window.setInterval(() => {
							this.sendValueForRepeatDigitalWorking(true);
							if (++numRepeatDigitals >= MAX_REPEAT_DIGITALS) {
								console.warn("Ch5Button MAXIMUM Repeat digitals sent");
								window.clearInterval(this._repeatDigitalInterval as number);
								this.sendValueForRepeatDigitalWorking(false);
							}
						}, REPEAT_DIGITAL_PERIOD);
					}
				}
			});
		}
	}


    private sendValueForRepeatDigitalWorking(value: boolean): void {
		this.info(`Ch5Button.sendValueForRepeatDigital(${value})`);
		if (!this._sigNameSendOnTouch && !this._sigNameSendOnClick) { return; }

		const touchSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
			.getObjectAsBooleanSignal(this._sigNameSendOnTouch);

		const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
			.getObjectAsBooleanSignal(this._sigNameSendOnClick);

		if (clickSignal && touchSignal && clickSignal.name === touchSignal.name) {
			// send signal only once if it has the same value
			clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
			return;
		}

		if (touchSignal && touchSignal.name) {
			touchSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
		}

		if (clickSignal && clickSignal.name) {
			clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
		}
	}

    public enableImageLoading() {
        this.info('enableImageLoading()');
        if (this._imageWasLoaded) {
            return;
        }

        this._img.src = ''; // clears source to avoid stale images
        if (null === this.refreshRate || this.refreshRate === 0) {
            this._maybeLoadImage(false);
        } else {
            this._initRefreshRate();
        }
    }

    public disableImageLoading() {
        this.info('disableImageLoading()');
        if (null !== this._intervalIdForRefresh) {
            window.clearInterval(this._intervalIdForRefresh);
            this._imageWasLoaded = false;
        }
    }

    public getCssClassDisabled() {
        return this.cssClassPrefix + '--disabled';
    }


    public canProcessUri(): boolean {
        if (
            (isNil(this.password) || isEmpty(this.password)) ||
            (isNil(this.user) || isEmpty(this.user)) ||
            (isNil(this._url) || isEmpty(this._url))
        ) {
            return false;
        }
        return true;
    }

    /**
     * Checks if a image element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @returns {boolean}
     * @memberof Ch5Image
     */
    public isVisible(): boolean {
        /**
         * @param (el)      the DOM element to check if is visible
         *
         * These params are optional that are sent in recursively,
         * you typically won't use these:
         *
         * @param (t)       Top corner position number
         * @param (r)       Right corner position number
         * @param (b)       Bottom corner position number
         * @param (l)       Left corner position number
         * @param (w)       Element width number
         * @param (h)       Element height number
         */
        function _isVisible(el: HTMLElement, t?: number, r?: number, b?: number, l?: number, w?: number, h?: number): boolean {
            const p = el.parentNode as HTMLElement;

            if (!_elementInDocument(el)) {
                return false;
            }

            // -- Return true for document node
            if (9 === p.nodeType) {
                return true;
            }

            // -- Return false if our element is invisible
            if (!_getStyle(el) || el.hasAttribute('inert')) {
                return false;
            }

            // -- If we have a parent, let's continue:
            if (p) {
                // -- Let's recursively check upwards:
                return _isVisible(p);
            }
            return true;
        }

        // -- Cross browser method to get style properties:
        function _getStyle(el: HTMLElement) {
            let styles: IShowStyle = {} as IShowStyle;

            if (document && document.defaultView) {
                styles = document.defaultView.getComputedStyle(el) as IShowStyle;

                if (styles.opacity === '0' || styles.visibility === 'hidden' || styles.display === 'none') {
                    return false;
                }
            }

            return true;
        }

        function _elementInDocument(element: any) {
            /* tslint:disable:no-conditional-assignment */
            while (element = element.parentNode) {
                if (element === document) {
                    return true;
                }
            }
            return false;
        }

        return _isVisible(this);
    };

    public updateElementVisibility(visible: boolean) {
        super.updateElementVisibility(visible);

        if (this.elementIsVisible && this.isVisible()) {
            this._show = true;
            if (this._img.src === '') {
                this.enableImageLoading();
            }
        } else {
            this._show = false;
        }
    }

    protected afterHandlingShow(): void {
        this.info('afterHandlingShow()');

        if (null === this.refreshRate || this.refreshRate === 0) {
            this._maybeLoadImage(false);
        } else {
            this._initRefreshRate();
        }
    }

    protected afterHandlingHide(): void {
        this.info('afterHandlingHide()');
        // image is not visible, stop refreshing
        if (null !== this._intervalIdForRefresh) {
            window.clearInterval(this._intervalIdForRefresh);
        }

        this._img.src = '';
    }

    /**
     * Removes listeners
     */
    private removeEvents() {
        super.removeEventListeners();

        this.removeEventListener('click', this._onClick);
        this.removeEventListener('touchstart', this._onTouchStart);
        this.removeEventListener('touchend', this._onTouchEnd);
        this.removeEventListener('touchmove', this._onTouchMove);
        this.removeEventListener('touchcancel', this._onTouchCancel);

        this._img.removeEventListener('error', this._onError);

        // remove press events from pressable
        if (null !== this._pressable) {
            this._pressable.destroy();
        }
    }

    /**
     * Load image
     */
    private _maybeLoadImage(refreshParam?: boolean): void {
        let candidateUrl = '';

        /**
         * this.show returns information about the show/visibility parameter of the current component
         * this.isVisible returns false if the component or one of its ancestors is not being displayed in the browser
         * ( it does not include the case of css property visibility:hidden - this is considered as visible since the
         * browser reserved space for the component)
         */
        if (this.elementIsVisible) {
            if (null !== this._url && '' !== this.url && true === this.show) {
                candidateUrl = refreshParam ? this._insertParamToUrl('__cr_avoid_cache', new Date().getTime().toString()) : this._url;

                this._img.src = candidateUrl;
                this._imageWasLoaded = true;

                this.info('image source ', this._img.src);
            }
        }
    }

    /**
     * Initializes the refresh calls
     */
    private _initRefreshRate() {
        this.info('initRefreshRate');

        if (this._intervalIdForRefresh) {
            window.clearInterval(this._intervalIdForRefresh);
        }

        if (null !== this._url &&
            '' !== this._url &&
            null !== this._refreshRate &&
            0 !== this._refreshRate
        ) {
            this._maybeLoadImage(true);
            this._intervalIdForRefresh = window.setInterval(() => { this._maybeLoadImage(true) }, this._refreshRate * 1000);
        }
    }

    /**
     *  EVENTS HANDLERS
     */

    protected _onTouchStart(inEvent: Event): void {
        this.info("Ch5Image._onTouchStart()");
        // inEvent.preventDefault();

        if (this._timerIdForTouch) {
            window.clearTimeout(this._timerIdForTouch);
        }

        this._onLongTouch();

    }

    protected _onTouchEnd(inEvent: Event): void {
        this.info("Ch5Image._onTouchEnd()");

        this._stopSendSignalOnTouch();
    }

    private _onTouchMove(inEvent: Event): void {
        // inEvent.preventDefault();
        this._stopSendSignalOnTouch();
    }

    protected _onTouchCancel(inEvent: Event): void {
        this._stopSendSignalOnTouch();
    }

    private _onClick(inEvent: Event): void {
        this.info("Ch5Image._onClick()");
        // inEvent.preventDefault();

        this._sendValueForClickSignal();
    }

    private _onError(inEvent: Event): void {
        this.dispatchEvent(this.errorEvent);
        // inEvent.preventDefault();

        const message = 'Error loading image with src: ' + this._url;

        this._sendValueForErrorSignal(message);
    }


    /**
     * sendEventOnTouch Handler
     */
    private _onLongTouch() {
        if (!this._longTouch) {
            this._longTouch = true;
        }

        this._sendValueForTouchSignal(true);

        // reassert sendEventOnTouch while finger is still on the glass
        if (this._intervalIdForOnTouch) {
            window.clearInterval(this._intervalIdForOnTouch);
        }

        this._intervalIdForOnTouch = window.setInterval(
            () => this._sendValueForTouchSignal(true),
            this._intervalTimeoutForOnTouch
        );
    }

    /**
     * Stop send/reassert sendEventOnTouch and send false when finger is released or “roll out”.
     */
    private _stopSendSignalOnTouch() {
        if (this._longTouch) {
            this._sendValueForTouchSignal(false);
            this._longTouch = false;
        }

        if (null !== this._timerIdForTouch) {
            window.clearTimeout(this._timerIdForTouch);
            this._timerIdForTouch = null;
        }

        if (null !== this._intervalIdForOnTouch) {
            window.clearInterval(this._intervalIdForOnTouch);
            this._intervalIdForOnTouch = null;
        }
    }

    /**
     * Send boolean signal for onTouch
     *
     * @param value
     */
    private _sendValueForTouchSignal(value: boolean): void {
        if (this._sigNameSendOnTouch !== '' && !isNil(this._sigNameSendOnTouch)) {

            const touchSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
                .getObjectAsBooleanSignal(this._sigNameSendOnTouch);

            if (touchSignal !== null) {
                touchSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
            }
        }
    }

    /**
     * Send boolean values for signal on click
     */
    private _sendValueForClickSignal(): void {
        let sigClick: Ch5Signal<boolean> | null = null;

        if ('' !== this._sigNameSendOnClick
            && undefined !== this._sigNameSendOnClick
            && null !== this._sigNameSendOnClick) {

            sigClick = Ch5SignalFactory.getInstance()
                .getBooleanSignal(this._sigNameSendOnClick);

            if (sigClick !== null) {
                sigClick.publish(true);
                sigClick.publish(false);
            }
        }
    }

    private _sendValueForErrorSignal(errorMessage: string): void {
        let sigError: Ch5Signal<string> | null = null;

        if ('' !== this._sigNameSendOnError
            && undefined !== this._sigNameSendOnError
            && null !== this._sigNameSendOnError) {

            sigError = Ch5SignalFactory.getInstance()
                .getStringSignal(this._sigNameSendOnError);

            if (null !== sigError) {
                sigError.publish(errorMessage);
            }
        }
    }

    /**
     * Insert parameter to _url, checks for other parameters
     *
     * @param key
     * @param value
     */
    private _insertParamToUrl(key: string, value: string): string {
        key = encodeURI(key); value = encodeURI(value);

        if (this._getUrlVars().size === 0) {
            return this._url + '?' + key + '=' + value;
        }

        const kvp = this.url.split('&');

        let i = kvp.length; let x; while (i--) {
            x = kvp[i].split('=');

            if (x[0] === key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

        return kvp.join('&');
    }

    /**
     * Get _url vars
     */
    private _getUrlVars() {
        const vars: Map<string, string> = new Map();
        let hash: string[];
        const questionMarkIndex = this._url.indexOf('?');

        if (questionMarkIndex > 1) {
            const hashes = this._url.slice(questionMarkIndex + 1).split('&');

            for (const iterator of hashes) {
                hash = iterator.split('=');
                vars.set(hash[0], hash[1]);
            }
        }

        return vars;
    }

    /**
     * Update the image url
     *
     * @param {string} url
     */
    private updateImageUrl(url: string): void {
        this._url = url;
        this.setAttribute('url', this._url);
        this._maybeLoadImage();
    }

    public updateElementInViewportChange(visibility: boolean) {
        // TODO: visibility here is an HTMLElement, not a boolean
        //       and for this reason, it will always go on the if branch
        if (visibility) {
            this._show = true;
            this._maybeLoadImage(true);
        } else {
            this._show = false;
        }
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-image', Ch5Image);

}

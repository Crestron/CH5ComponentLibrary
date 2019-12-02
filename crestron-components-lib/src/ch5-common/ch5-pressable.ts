// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from '../ch5-common/ch5-common';
import { Subscription } from 'rxjs';
import 'hammerjs';
import HtmlCallback from './utils/html-callback';

export interface ICh5PressableOptions {
    cssTargetElement: HTMLElement;
    cssPressedClass: string;
}

export class Ch5Pressable {

    private _ch5Component: Ch5Common;

    private _options: ICh5PressableOptions | null;

    /**
     * Event press: touchstart/mousedown
     */
    private _pressEvent: Event;

    /**
     * Event release: touchend/mouseup
     */
    private _releaseEvent: Event;

    /**
     * Reflects the touchstart state of the component.
     */
    private _touchStart: boolean = false;

    /**
     * Reflects the touchend state of the component.
     */
    private _touchEnd: boolean = false;

    /**
     * Reflectes the pressed state of the component
     *
     * @private
     */
    private _pressed: boolean = false;

    /**
     * Reflectes the released state of the component
     *
     * @private
     */
    private _released: boolean = true;

    /**
     * HammerManger used for managing gestures like press
     *
     * @private
     * @type {(HammerManager | null)}
     */
    private _hammerManager: HammerManager | null = null;

    /**
     * The subscription id for the gestureable property
     */
    private _gestureableSubscription: Subscription | null = null;

    /**
     * onPress callback
     * @private
     * @type {HtmlCallback | void}
     */
    private _onPressCallback: HtmlCallback = {} as HtmlCallback;

    /**
     * onRelease callback
     *
     * @private
     * @type {HtmlCallback | void}
     */
    private _onReleaseCallback: HtmlCallback = {} as HtmlCallback;

    /**
     * Creates an instance of Ch5Pressable.
     * @param {Ch5Common} component
     * @memberof Ch5Pressable
     */
    constructor (component: Ch5Common, options?:ICh5PressableOptions ) {
        this._ch5Component = component;
        this._options = options || null;

        // custom press event
        this._pressEvent = new CustomEvent("press", {
            bubbles: true,
            cancelable: false
        });

        // custom release event
        this._releaseEvent = new CustomEvent("release", {
            bubbles: true,
            cancelable: false
        });

        this._onClick =  this._onClick.bind(this);
        this._onMouseDown =  this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseLeave = this._onMouseLeave.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd =  this._onTouchEnd.bind(this);
        this._onTouchCancel = this._onTouchCancel.bind(this);
        this._onHold = this._onHold.bind(this);
        this._onRelease = this._onRelease.bind(this);
        this._onPanEnd = this._onPanEnd.bind(this);
    }

    public get ch5Component(): Ch5Common {
        return this._ch5Component;
    }

    /**
     * Initialize pressable
     *
     * @memberof Ch5Pressable
     */
    public init() {
        this._hammerManager = new Hammer(
            this._ch5Component,
            {
                touchAction: 'auto'
            }
        );

        this._subscribeToGestureableProp();
        this._attachEvents();
        this._callbackRegistration();
    }

    /**
     * Destroy pressable
     *
     * @memberof Ch5Pressable
     */
    public destroy() {
        this._unsubscribeFromGestureableProp();
        this._removeEvents();
    }

    public set onPressCallback(callback: HtmlCallback) {

        if (callback === undefined || callback === null) {
            callback = {} as HtmlCallback;
        }

        this._onPressCallback = callback;
    }

    public get onPressCallback(): HtmlCallback {
        return this._onPressCallback;
    }

    public set onReleaseCallback(callback: HtmlCallback) {
        if (callback === undefined || callback === null) {
            callback = {} as HtmlCallback;
        }

        this._onReleaseCallback = callback;
    }

    public get onReleaseCallback(): HtmlCallback {
        return this._onReleaseCallback;
    }

    /**
     * Add events listeners related in order to achive press and release events
     *
     * @memberof Ch5Pressable
     */
    private _attachEvents() {
        this._ch5Component.addEventListener('click', this._onClick);

        this._ch5Component.addEventListener('mousedown', this._onMouseDown, true);
        this._ch5Component.addEventListener('mouseup', this._onMouseUp);
        this._ch5Component.addEventListener('mouseleave', this._onMouseLeave);

        this._ch5Component.addEventListener('touchstart', this._onTouchStart, true);
        this._ch5Component.addEventListener('touchend', this._onTouchEnd);
        this._ch5Component.addEventListener('touchcancel', this._onTouchCancel);
    }

    /**
     * Remove events listeners
     *
     * @memberof Ch5Pressable
     */
    private _removeEvents() {
        this._ch5Component.removeEventListener('click', this._onClick);

        this._ch5Component.removeEventListener('mousedown', this._onMouseDown);
        this._ch5Component.removeEventListener('mouseup', this._onMouseUp);
        this._ch5Component.removeEventListener('mouseleave', this._onMouseLeave);

        this._ch5Component.removeEventListener('touchstart', this._onTouchStart);
        this._ch5Component.removeEventListener('touchend', this._onTouchEnd);
        this._ch5Component.removeEventListener('touchcancel', this._onTouchCancel);

        this._removeEventsFromHammer();
    }

    /**
     * Register callback functions
     */
    private _callbackRegistration() {

        if (this._ch5Component.hasAttribute('onpress')) {
            const onPressAttribute = this._ch5Component.getAttribute('onpress');
            this.onPressCallback = new HtmlCallback(this._ch5Component, onPressAttribute as string);
        }

        if (this._ch5Component.hasAttribute('onrelease')) {
            const onReleaseAttribute = this._ch5Component.getAttribute('onrelease');
            this.onReleaseCallback = new HtmlCallback(this._ch5Component, onReleaseAttribute as string);
        }
    }

    /**
     * Subscribe to gestureable observable
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _subscribeToGestureableProp() {
        if (this._gestureableSubscription === null) {
            this._gestureableSubscription =
                this._ch5Component.observableGestureableProperty.subscribe((value:boolean) => {
                    if (value) {
                        this._attachEventsFromHammer();
                    } else {
                        this._removeEventsFromHammer();
                    }
                });
        }
    }

    /**
     * Unsubscribe to gestureable observable
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _unsubscribeFromGestureableProp() {
        if (this._gestureableSubscription !== null) {
            this._gestureableSubscription.unsubscribe();
            this._gestureableSubscription = null;
        }
    }

    /**
     * Add events listeners related to hammerjs
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _attachEventsFromHammer() {
        if ( this._hammerManager !== null )
        {
            this._hammerManager.on('press', this._onHold);
            this._hammerManager.on('pressup', this._onRelease);
            this._hammerManager.on('panend', this._onPanEnd);
        }
    }


    /**
     * Remove events listeners related to hammerjs
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _removeEventsFromHammer() {
        if (this._hammerManager !== null )
        {
            this._hammerManager.off('press', this._onHold);
            this._hammerManager.off('pressup', this._onRelease);
            this._hammerManager.off('panend', this._onPanEnd);
        }
    }

    /**
     *  EVENTS HANDLERS
     */

    private _onClick(inEvent: Event): void {
        // reset touchstart/touchend flags
        this._touchStart = false;
        this._touchEnd = false;
    }

    private _onMouseDown(inEvent: Event): void {
        // ignore mousedown if touchstart
        if (this._touchStart) { return }

        if (!this._ch5Component.gestureable) {
            this._onHold();
        }
    }

    private _onMouseUp(inEvent: Event): void {
        // ignore mouseup if touchend
        if (this._touchEnd) { return }

        if (!this._ch5Component.gestureable) {
            this._onRelease();
        }
    }

    private _onMouseLeave(inEvent: Event): void {
        if (!this._ch5Component.gestureable) {
            this._onRelease();
        }
    }

    private _onTouchStart(inEvent: Event): void {
        if (!this._touchStart) {
            this._touchStart = true;
        }

        if (!this._ch5Component.gestureable) {
            this._onHold();
        }
    }

    private _onTouchEnd(inEvent: Event): void {
        if (!this._touchEnd) {
            this._touchEnd = true;
        }

        if (!this._ch5Component.gestureable) {
            this._onRelease();
        }
    }

    private _onTouchCancel(inEvent: Event): void {
        if (!this._ch5Component.gestureable) {
            this._onRelease();
        }
    }

    /**
     * Dispach press event. Add press css class
     *
     * @fires press
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _onHold() {
        if (!this._pressed) {
            this._addCssPressClass();
            this._ch5Component.dispatchEvent(this._pressEvent);
        }

        this._pressed = true;
        this._released = false;

        if (!(this._ch5Component.onpress instanceof Function) && this.onPressCallback instanceof HtmlCallback) {
            ((event) => {
                this.onPressCallback.run(event);
            })(this._pressEvent);
        } else if (this._ch5Component.onpress instanceof Function) {
            this._ch5Component.onpress.call(this._ch5Component, this._pressEvent);
        }
    }

    /**
     * Dispach release event. Remove press css class
     *
     * @fires press
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _onRelease() {
        if (!this._released) {
            this._removeCssPressClass();
            this._ch5Component.dispatchEvent(this._releaseEvent);

            if (!(this._ch5Component.onrelease instanceof Function) && this.onReleaseCallback instanceof HtmlCallback) {
                (event => {
                    this.onReleaseCallback.run(event);
                })(this._releaseEvent);
            } else if (this._ch5Component.onrelease instanceof Function) {
                this._ch5Component.onrelease.call(this._ch5Component, this._releaseEvent);
            }
        }

        this._pressed = false;
        this._released = true;

    }

    /**
     * Trigger _onRelease() in case that press gesture is followed by a pan gesture
     *
     * @private
     * @memberof Ch5Pressable
     */
    private _onPanEnd(){
        this._onRelease();
    }

    /**
     * Add css class when the component is pressed
     */
    private _addCssPressClass() {
        if (this._options !== null &&
            this._options.cssTargetElement.classList !== undefined)
        {
            this._options.cssTargetElement.classList.add(this._options.cssPressedClass);
        }
    }

    /**
     * Remove pressed css class when the component is released
     */
    private _removeCssPressClass() {
        if (this._options !== null &&
            this._options.cssTargetElement.classList !== undefined)
        {
            this._options.cssTargetElement.classList.remove(this._options.cssPressedClass);
        }
    }
}

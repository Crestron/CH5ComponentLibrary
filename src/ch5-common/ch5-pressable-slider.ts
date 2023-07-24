// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Subscription } from 'rxjs';
import 'hammerjs';
import { Subject } from 'rxjs';
import _ from 'lodash';

export interface ICh5PressableOptions {
	cssTargetElement: HTMLElement;
	cssPressedClass: string;
	pressDelayTime?: number | null;
	pressDelayDistance?: number | null;
	clickDelayDistance?: number | null;
}

enum Ch5PressableFingerStateMode {
	Idle,
	Start,
	FingerDown
}

export class Ch5PressableSlider {

	/**
	 * This class provides variables to be accessed between 
	 * touch and mouse events. 
	 * 
	 */
	// tslint:disable-next-line: variable-name max-classes-per-file
	private static FingerState = class {
		public mode: Ch5PressableFingerStateMode;
		public touchHoldTimer: number | null = null;
		public touchStartLocationX: number;
		public touchStartLocationY: number;
		public touchPointId: number = -1;

		public constructor() {
			this.mode = Ch5PressableFingerStateMode.Idle;
			this.touchStartLocationX = 0;
			this.touchStartLocationY = 0;
			this.touchPointId = -1;
			this.touchHoldTimer = null;
		}

		public getTouchFromTouchList(touchEvent: TouchEvent): Touch | null {
			if (touchEvent.changedTouches !== undefined) {
				// tslint:disable-next-line: prefer-for-of
				for (let i = 0; i < touchEvent.changedTouches.length; i++) {
					if (touchEvent.changedTouches[i].identifier === this.touchPointId) {
						return touchEvent.changedTouches[i];
					}
				}
			}
			return null;
		}

		public reset() {
			this.mode = Ch5PressableFingerStateMode.Idle;
			this.touchStartLocationX = 0;
			this.touchStartLocationY = 0;
			this.touchPointId = -1;
			if (this.touchHoldTimer !== null) {
				window.clearTimeout(this.touchHoldTimer);
				this.touchHoldTimer = null;
			}
		}
	}

	private _fingerState = new Ch5PressableSlider.FingerState();

	private _ch5Component: HTMLElement;

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
	 * Reflects the pressed state of the component
	 *
	 * @private
	 */
	public _pressed: boolean = false;

	/**
	 * Reflects the released state of the component
	 *
	 * @private
	 */
	public _released: boolean = true;

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
	 * An RxJs observable for the gestureable property.
	 * Other classes can subscribe to this and be notified when the gestureable property changes.
	 */
	public observablePressed: Subject<any>;

	private readonly TOUCH_TIMEOUT: number = 250; // Repeat Digital is triggered after 250 ms of press and hold.
	private readonly PRESS_MOVE_THRESHOLD: number = 10;
	private readonly CLICK_MOVE_THRESHOLD: number = 1;

	private isTouch: boolean = false;
	private isMouse: boolean = false;
	private sliderValue: string = '';

	/**
	 * Creates an instance of Ch5Pressable.
	 * @param {Ch5Common} component
	 * @memberof Ch5Pressable
	 */
	constructor(component: HTMLElement, options?: ICh5PressableOptions) {
		this._ch5Component = component;
		this._options = options || null;
		this.observablePressed = new Subject<boolean>();

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

		this._onClick = this._onClick.bind(this);
		this._onMouseDown = this._onMouseDown.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);
		this._onTouchStart = this._onTouchStart.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onTouchEnd = this._onTouchEnd.bind(this);
		this._onTouchCancel = this._onTouchCancel.bind(this);
		this._onTouchHoldTimer = this._onTouchHoldTimer.bind(this);
		this._onHold = this._onHold.bind(this);
		this._onRelease = this._onRelease.bind(this);
		this._onPanEnd = this._onPanEnd.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);
	}

	public get ch5Component(): HTMLElement {
		return this._ch5Component;
	}

	public get options(): ICh5PressableOptions | null {
		return this._options;
	}

	private get pressDelayTime(): number {
		if (this._options !== null && !_.isNil(this._options.pressDelayTime)) {
			return this._options.pressDelayTime;
		} else {
			return this.TOUCH_TIMEOUT;
		}
	}

	private get pressDelayMoveDistance(): number {
		if (this._options !== null && !_.isNil(this._options.pressDelayDistance)) {
			return this._options.pressDelayDistance;
		} else {
			return this.PRESS_MOVE_THRESHOLD;
		}
	}

	private get clickDelayMoveDistance(): number {
		if (this.options !== null && !_.isNil(this.options.clickDelayDistance)) {
			return this.options.clickDelayDistance;
		} else {
			return this.CLICK_MOVE_THRESHOLD;
		}
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
	}

	public setPressed(value: boolean) {
		if (this._pressed === true) {
			if (value === false) {
				this._onRelease();
			}
		} else {
			if (value === true) {
				this._onHold();
			}
		}
		// this._pressed = value;
		// this._released = !value;
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

	/**
	 * Add events listeners related in order to achieve press and release events
	 *
	 * @memberof Ch5Pressable
	 */
	private _attachEvents() {
		this._ch5Component.addEventListener('click', this._onClick);

		this._ch5Component.addEventListener('mousedown', this._onMouseDown, { passive: true });
		this._ch5Component.addEventListener('mouseup', this._onMouseUp);
		this._ch5Component.addEventListener('mousemove', this._onMouseMove);
		this._ch5Component.addEventListener('mouseleave', this._onMouseLeave);
		this._ch5Component.addEventListener('mouseout', this._onMouseLeave);

		this._ch5Component.addEventListener('touchstart', this._onTouchStart, { passive: true });
		this._ch5Component.addEventListener('touchmove', this._onTouchMove);
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
		this._ch5Component.removeEventListener('touchmove', this._onTouchMove);
		this._ch5Component.removeEventListener('touchend', this._onTouchEnd);
		this._ch5Component.removeEventListener('touchcancel', this._onTouchCancel);

		this._removeEventsFromHammer();
	}

	/**
	 * Subscribe to gestureable observable
	 *
	 * @private
	 * @memberof Ch5Pressable
	 */
	private _subscribeToGestureableProp() {
		this._attachEventsFromHammer();
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
		if (this._hammerManager !== null) {
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
		if (this._hammerManager !== null) {
			this._hammerManager.off('press', this._onHold);
			this._hammerManager.off('pressup', this._onRelease);
			this._hammerManager.off('panend', this._onPanEnd);
			this._hammerManager.destroy();
			this._hammerManager = null;
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

	private _onMouseDown(inEvent: MouseEvent): void {
		// ignore mousedown if touchstart
		if (this._touchStart) { return }
		if (this.isTouch) { return }

		this.isMouse = true;
		this.isTouch = false;
		const mouseEvent: MouseEvent = inEvent as MouseEvent;
		const clientX = inEvent.clientX;
		const clientY = inEvent.clientY;
		const { left, width, height, top } = this._ch5Component.getBoundingClientRect();
		const value = width > height ? (clientX - left) / width : (1 - (clientY - top) / height);
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Idle) {
			this._fingerState.mode = Ch5PressableFingerStateMode.Start;
			this._fingerState.touchHoldTimer = window.setTimeout(this._onTouchHoldTimer, this.pressDelayTime);
			this._fingerState.touchStartLocationX = mouseEvent.clientX;
			this._fingerState.touchStartLocationY = mouseEvent.clientY;
		}
		// handling the upper and lower click on advanced slider
		if (value <= 0.25) {
			this.sliderValue = 'lower';
		} else if (value >= 0.75) {
			this.sliderValue = 'upper';
		} else {
			this.sliderValue = '';
		}
	}

	private _onMouseMove(inEvent: Event): void {
		if (this.isTouch) {
			return;
		}

		// On a swipe motion we don't want to send a join or show visual feedback,
		// check if finger has moved
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
			const mouseEvent: MouseEvent = inEvent as MouseEvent;
			if (mouseEvent !== null) {
				const xMoveDistance = mouseEvent.clientX - this._fingerState.touchStartLocationX;
				const yMoveDistance = mouseEvent.clientY - this._fingerState.touchStartLocationY;
				const distanceMoved = Math.sqrt(xMoveDistance ** 2 + yMoveDistance ** 2);
				// this._ch5Component.info(`DELETE ME Ch5Pressable.onMouseMove() , ${mouseEvent.clientX}, ${mouseEvent.clientY}, ${distanceMoved}`);
				if (distanceMoved > this.clickDelayMoveDistance) {
					// this._ch5Component.info(`Ch5Pressable.onMouseMove() cancelling press, ${mouseEvent.clientX}, ${mouseEvent.clientY}, ${distanceMoved}`);
					this._touchStart = false;
					this._fingerState.reset();
				}
			}
		}
	}

	private _onMouseUp(inEvent: Event): void {

		if (this.isTouch) {
			return;
		}

		const mouseEvent: MouseEvent = inEvent as MouseEvent;
		if (mouseEvent !== null) {
			if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
				// quick tap, must do both press and release
				this._fingerIsDownActions();
			}

			if (!this._touchEnd) {
				this._touchEnd = true;
			}

			if (this._fingerState.mode === Ch5PressableFingerStateMode.FingerDown) {
				this._onRelease();
			}
			this._fingerState.reset();
		}

	}

	private _onMouseLeave(inEvent: Event): void {

		if (this.isTouch) {
			return;
		}

		const mouseEvent: MouseEvent = inEvent as MouseEvent;
		if (mouseEvent !== null) {
			if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
				// quick tap, must do both press and release
				this._fingerIsDownActions();
			}

			if (!this._touchEnd) {
				this._touchEnd = true;
			}

			if (this._fingerState.mode === Ch5PressableFingerStateMode.FingerDown) {
				this._onRelease();
			}
			this._fingerState.reset();
		}

	}

	private _onTouchStart(inEvent: TouchEvent): void {
		const clientX = inEvent.touches[0].clientX;
		const clientY = inEvent.touches[0].clientY;
		const { left, width, height, top } = this._ch5Component.getBoundingClientRect();
		const value = width > height ? (clientX - left) / width : (1 - (clientY - top) / height);
		if (value <= 0.25) {
			this.sliderValue = 'lower';
		} else if (value >= 0.75) {
			this.sliderValue = 'upper';
		} else {
			this.sliderValue = '';
		}
	}

	private _onTouchMove(inEvent: Event): void {
		if (this.isMouse) {
			return;
		}

		// On a swipe motion we don't want to send a join or show visual feedback,
		// check if finger has moved
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
			const touchEvent: TouchEvent = inEvent as TouchEvent;
			const touch: Touch | null = this._fingerState.getTouchFromTouchList(touchEvent);
			if (touch !== null) {
				// this._ch5Component.info(`Ch5Pressable._onTouchMove() , ${touch.clientX}, ${touch.clientY}, ${touch.identifier}`);
				const xMoveDistance = touch.clientX - this._fingerState.touchStartLocationX;
				const yMoveDistance = touch.clientY - this._fingerState.touchStartLocationY;
				const distanceMoved = Math.sqrt(xMoveDistance ** 2 + yMoveDistance ** 2);
				// this._ch5Component.info(`DELETE ME Ch5Pressable._onTouchMove() , ${touch.clientX}, ${touch.clientY}, ${touch.identifier}, ${distanceMoved}`);
				if (distanceMoved > this.pressDelayMoveDistance) {
					// this._ch5Component.info(`Ch5Pressable._onTouchMove() cancelling press, ${touch.clientX}, ${touch.clientY}, ${touch.identifier}, ${distanceMoved}`);
					this._touchStart = false;
					this._fingerState.reset();
				}
			}
		}
	}

	private _onTouchHoldTimer(event: Event): void {
		// this._ch5Component.info(`Ch5Pressable._onTouchHoldTimer(), ${this._fingerState.touchPointId}`);
		this._fingerState.touchHoldTimer = null;
		this._fingerIsDownActions();
	}

	private _fingerIsDownActions() {
		this._fingerState.mode = Ch5PressableFingerStateMode.FingerDown;
		// if (!this._ch5Component.gestureable) {
		this._onHold();
		// }
		if (this._fingerState.touchHoldTimer !== null) {
			window.clearTimeout(this._fingerState.touchHoldTimer);
			this._fingerState.touchHoldTimer = null;
		}
	}

	private _onTouchEnd(inEvent: Event): void {
		if (this._pressed) {
			this._onRelease();
		}

		if (this.isMouse) {
			return;
		}
		const touchEvent: TouchEvent = inEvent as TouchEvent;
		const touch: Touch | null = this._fingerState.getTouchFromTouchList(touchEvent);
		if (touch !== null) {
			if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
				// quick tap, must do both press and release
				this._fingerIsDownActions();
			}

			if (!this._touchEnd) {
				this._touchEnd = true;
			}

			if (this._fingerState.mode === Ch5PressableFingerStateMode.FingerDown) {
				this._onRelease();
			}
			this._fingerState.reset();
		}
	}

	private _onTouchCancel(inEvent: Event): void {
		this._onTouchEnd(inEvent);
	}

	/**
	 * Dispatch press event. Add press css class
	 *
	 * @fires press
	 *
	 * @private
	 * @memberof Ch5Pressable
	 */
	private _onHold() {
		// this._ch5Component.info(`Ch5Pressable._onHold() alreadyPressed:${this._pressed}`);
		if (!this._pressed) {
			// add the visual feedback
			this._addCssPressClass();

			this._pressed = true;
			this._released = false;
			if (this.sliderValue !== '') {
				this.observablePressed.next({ pressed: this._pressed, range: this.sliderValue });
			}
			// update state of the button and tell the button the state
			this._ch5Component.setAttribute("pressed", "true");

			// dispatch event for addEventListener consumers
			this._ch5Component.dispatchEvent(this._pressEvent);

			// dispatch event for onpress="" consumers 
			// simply eval()uate the on<event> text.   
			// This is consistent with how standard events are processed, example <div onclick="">
			const onPressAttrib = this._ch5Component.getAttribute('onpress');
			if (onPressAttrib !== null) {
				try {
					// tslint:disable-next-line: no-eval
					eval(onPressAttrib);
				}
				// tslint:disable-next-line: no-empty
				catch (e) { };
			}
		}

	}

	/**
	 * Dispatch release event. Remove press css class
	 *
	 * @fires press
	 *
	 * @private
	 * @memberof Ch5Pressable
	 */
	private _onRelease() {
		// this._ch5Component.info(`Ch5Pressable._onRelease() alreadyReleased:${this._released}`);
		if (!this._released) {
			// remove the visual feedback
			setTimeout(() => {
				this._removeCssPressClass();
			}, this.pressDelayTime);

			// update state of the button and tell the button the state
			this._pressed = false;
			this._released = true;
			if (this.sliderValue !== '') {
				this.observablePressed.next({ pressed: this._pressed, range: this.sliderValue });
			}
			this._ch5Component.removeAttribute("pressed");

			// dispatch event for addEventListener consumers
			this._ch5Component.dispatchEvent(this._releaseEvent);

			// dispatch event for onrelease="" consumers 
			// simply eval()uate the on<event> text.   
			// This is consistent with how standard events are processed, example <div onclick="">
			const onReleaseAttrib = this._ch5Component.getAttribute('onrelease');
			if (onReleaseAttrib !== null) {
				try {
					// tslint:disable-next-line: no-eval
					eval(onReleaseAttrib);
				}
				// tslint:disable-next-line: no-empty
				catch (e) { };
			}
		}
	}

	/**
	 * Trigger _onRelease() in case that press gesture is followed by a pan gesture
	 *
	 * @private
	 * @memberof Ch5Pressable
	 */
	private _onPanEnd() {
		// this._ch5Component.info('Ch5Pressable._onPanEnd()');
		this._onRelease();
	}

	/**
	 * Add css class when the component is pressed
	 */
	private _addCssPressClass() {
		if (this._options !== null &&
			this._options.cssTargetElement.classList !== undefined) {
			this._options.cssPressedClass.split(' ').forEach((ele) => {
				this._options?.cssTargetElement.classList.add(ele);
			});
		}
	}

	/**
	 * Remove pressed css class when the component is released
	 */
	private _removeCssPressClass() {
		if (this._options !== null &&
			this._options.cssTargetElement.classList !== undefined) {
			this._options.cssPressedClass.split(' ').forEach((ele) => {
				this._options?.cssTargetElement.classList.remove(ele);
			});
		}
	}
}

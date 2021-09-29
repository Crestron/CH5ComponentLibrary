// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from '../ch5-common/ch5-common';
import { Subscription } from 'rxjs';
import 'hammerjs';
import { Subject } from 'rxjs';

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
	 * An RxJs observable for the gestureable property.
	 * Other classes cand subscribe to this and be notified when the gestureable property changes.
	 */
	public observablePressed: Subject<boolean>;

	/**
	 * Creates an instance of Ch5Pressable.
	 * @param {Ch5Common} component
	 * @memberof Ch5Pressable
	 */
	constructor(component: Ch5Common, options?: ICh5PressableOptions) {
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
		this._onTouchEnd = this._onTouchEnd.bind(this);
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
	 * Add events listeners related in order to achive press and release events
	 *
	 * @memberof Ch5Pressable
	 */
	private _attachEvents() {
		this._ch5Component.addEventListener('click', this._onClick);

		this._ch5Component.addEventListener('mousedown', this._onMouseDown, { passive: true });
		this._ch5Component.addEventListener('mouseup', this._onMouseUp);
		this._ch5Component.addEventListener('mouseleave', this._onMouseLeave);

		this._ch5Component.addEventListener('touchstart', this._onTouchStart, { passive: true });
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
	 * Subscribe to gestureable observable
	 *
	 * @private
	 * @memberof Ch5Pressable
	 */
	private _subscribeToGestureableProp() {
		if (this._gestureableSubscription === null) {
			this._gestureableSubscription =
				this._ch5Component.observableGestureableProperty.subscribe((value: boolean) => {
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
		}
	}

	/**
	 *  EVENTS HANDLERS
	 */

	private _onClick(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onClick()');
		// reset touchstart/touchend flags
		this._touchStart = false;
		this._touchEnd = false;
	}

	private _onMouseDown(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onMouseDown()');
		// ignore mousedown if touchstart
		if (this._touchStart) { return }

		if (!this._ch5Component.gestureable) {
			this._onHold();
		}
	}

	private _onMouseUp(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onMouseUp()');
		// ignore mouseup if touchend
		if (this._touchEnd) { return }

		if (!this._ch5Component.gestureable) {
			this._onRelease();
		}
	}

	private _onMouseLeave(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onMouseLeave()');
		if (!this._ch5Component.gestureable) {
			this._onRelease();
		}
	}

	private _onTouchStart(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onTouchStart()');
		if (!this._touchStart) {
			this._touchStart = true;
		}

		if (!this._ch5Component.gestureable) {
			this._onHold();
		}
	}

	private _onTouchEnd(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onTouchEnd()');
		if (!this._touchEnd) {
			this._touchEnd = true;
		}

		if (!this._ch5Component.gestureable) {
			this._onRelease();
		}
	}

	private _onTouchCancel(inEvent: Event): void {
		this._ch5Component.info('Ch5Pressable._onCancel()');
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
		this._ch5Component.info(`Ch5Pressable._onHold() alreadyPressed:${this._pressed}`);
		if (!this._pressed) {
			// add the visual feedback
			this._addCssPressClass();

			// update state of the button and tell the button the state
			this._pressed = true;
			this.observablePressed.next(this._pressed);
			this._released = false;

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
	 * Dispach release event. Remove press css class
	 *
	 * @fires press
	 *
	 * @private
	 * @memberof Ch5Pressable
	 */
	private _onRelease() {
		this._ch5Component.info(`Ch5Pressable._onRelease() alreadyReleased:${this._released}`);
		if (!this._released) {
			// remove the visual feedback
			setTimeout(() => {
				this._removeCssPressClass();
			}, 100);

			// update state of the button and tell the button the state
			this._pressed = false;
			this.observablePressed.next(this._pressed);
			this._released = true;

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
		this._ch5Component.info('Ch5Pressable._onPanEnd()');
		this._onRelease();
	}

	/**
	 * Add css class when the component is pressed
	 */
	private _addCssPressClass() {
		if (this._options !== null &&
			this._options.cssTargetElement.classList !== undefined) {
			this._options.cssTargetElement.classList.add(this._options.cssPressedClass);
		}
	}

	/**
	 * Remove pressed css class when the component is released
	 */
	private _removeCssPressClass() {
		if (this._options !== null &&
			this._options.cssTargetElement.classList !== undefined) {
			this._options.cssTargetElement.classList.remove(this._options.cssPressedClass);
		}
	}

}

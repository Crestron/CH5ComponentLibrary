// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from '../ch5-common/ch5-common';
import { Subject } from 'rxjs';

export interface ICh5PressableOptions {
	cssTargetElement: HTMLElement;
	cssPressedClass: string;
}

enum Ch5PressableFingerStateMode {
	Idle,
	Start,
	FingerDown
}

export class Ch5Pressable {

	/**
	 * This class provides variables to be accessed between touch and mouse events.
	 */
	// tslint:disable-next-line: variable-name max-classes-per-file
	private static FingerState = class {
		public mode: Ch5PressableFingerStateMode = Ch5PressableFingerStateMode.Idle;
		public touchHoldTimer: number | null = null;
		public touchStartLocationX: number = 0;
		public touchStartLocationY: number = 0;
		public touchPointId: number = -1;

		public constructor() {
			// this.reset();
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

	private _fingerState = new Ch5Pressable.FingerState();

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
	 * Reflects the pressed state of the component
	 */
	public _pressed: boolean = false;

	/**
	 * Reflects the released state of the component
	 */
	public _released: boolean = true;

	/**
	 * An RxJs observable for the gestureable property.
	 * Other classes can subscribe to this and be notified when the gestureable property changes.
	 */
	public observablePressed: Subject<boolean>;

	private readonly TOUCH_TIMEOUT: number = 250; // Repeat Digital is triggered after 250 ms of press and hold.
	private readonly PRESS_MOVE_THRESHOLD: number = 10;
	private readonly CLICK_MOVE_THRESHOLD: number = 1;

	// private isTouch: boolean = false;
	// private isMouse: boolean = false;

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
		this._onMouseMove = this._onMouseMove.bind(this);
		// this._onTouchStart = this._onTouchStart.bind(this);
		// this._onTouchMove = this._onTouchMove.bind(this);
		// this._onTouchEnd = this._onTouchEnd.bind(this);
		// this._onTouchCancel = this._onTouchCancel.bind(this);
		this._onTouchHoldTimer = this._onTouchHoldTimer.bind(this);

		this._onHold = this._onHold.bind(this);
		this._onRelease = this._onRelease.bind(this);
	}

	public get ch5Component(): Ch5Common {
		return this._ch5Component;
	}

	public get options(): ICh5PressableOptions | null {
		return this._options;
	}

	/**
	 * Initialize pressable
	 */
	public init() {
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
	}

	/**
	 * Destroy pressable
	 */
	public destroy() {
		this.observablePressed?.complete();
		this._removeEvents();
	}

	/**
	 * Add events listeners related in order to achieve press and release events
	 */
	private _attachEvents() {
		this._ch5Component.addEventListener('click', this._onClick);

		this._ch5Component.addEventListener('pointerdown', this._onMouseDown); //, { passive: true });
		this._ch5Component.addEventListener('pointerup', this._onMouseUp);
		this._ch5Component.addEventListener('pointermove', this._onMouseMove);
		this._ch5Component.addEventListener('pointerleave', this._onMouseLeave);
		this._ch5Component.addEventListener('contextmenu', this._onContextMenu);
		// this._ch5Component.addEventListener('mouseout', this._onMouseLeave);

		// this._ch5Component.addEventListener('touchstart', this._onTouchStart);
		// this._ch5Component.addEventListener('touchmove', this._onTouchMove);
		// this._ch5Component.addEventListener('touchend', this._onTouchEnd);
		// this._ch5Component.addEventListener('touchcancel', this._onTouchCancel);
	}

	/**
	 * Remove events listeners
	 */
	private _removeEvents() {
		this._ch5Component.removeEventListener('click', this._onClick);

		this._ch5Component.removeEventListener('pointerdown', this._onMouseDown);
		this._ch5Component.removeEventListener('pointerup', this._onMouseUp);
		this._ch5Component.removeEventListener('pointermove', this._onMouseMove);
		this._ch5Component.removeEventListener('pointerleave', this._onMouseLeave);
		this._ch5Component.removeEventListener('contextmenu', this._onContextMenu);
		// this._ch5Component.removeEventListener('mouseout', this._onMouseLeave);

		// this._ch5Component.removeEventListener('touchstart', this._onTouchStart);
		// this._ch5Component.removeEventListener('touchmove', this._onTouchMove);
		// this._ch5Component.removeEventListener('touchend', this._onTouchEnd);
		// this._ch5Component.removeEventListener('touchcancel', this._onTouchCancel);
	}

	// // eslint-disable-next-line @typescript-eslint/no-unused-vars
	private _onClick(): void {
		// reset touchstart/touchend flags
		// this._touchStart = false;
		// this._touchEnd = false;
		// inEvent.preventDefault();
	}

	private _onContextMenu(inEvent: MouseEvent): void {
		inEvent.preventDefault();
	}

	private _onMouseDown(inEvent: Event): void {
		this._ch5Component.logger.log("this._onMouseDown"); //, this.isTouch, this.isMouse);
		// ignore mousedown if touchstart
		// if (this.isTouch) { return }
		// this._ch5Component.logger.log("this._onMouseDown Continues...", this.ch5Component.getCrId());

		// this.isMouse = true;
		// this.isTouch = false;
		const mouseEvent: MouseEvent = inEvent as MouseEvent;
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Idle) {
			this._fingerState.mode = Ch5PressableFingerStateMode.Start;
			// this._fingerState.touchHoldTimer = window.setTimeout(this._onTouchHoldTimer, this.TOUCH_TIMEOUT);
			this._fingerIsDownActions();
			this._fingerState.touchStartLocationX = mouseEvent.clientX;
			this._fingerState.touchStartLocationY = mouseEvent.clientY;
		}
	}

	private _onMouseMove(inEvent: Event): void {
		this._ch5Component.logger.log("this._onMouseMove");
		// if (this.isTouch) {
		// 	return;
		// }

		// On a swipe motion we don't want to send a join or show visual feedback, check if finger has moved
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
			const mouseEvent: MouseEvent = inEvent as MouseEvent;
			if (mouseEvent !== null) {
				const xMoveDistance = mouseEvent.clientX - this._fingerState.touchStartLocationX;
				const yMoveDistance = mouseEvent.clientY - this._fingerState.touchStartLocationY;
				const distanceMoved = Math.sqrt(xMoveDistance ** 2 + yMoveDistance ** 2);
				this._ch5Component.logger.log(`DELETE ME Ch5PressableButton.onMouseMove() , ${mouseEvent.clientX}, ${mouseEvent.clientY}, ${distanceMoved}`);
				if (distanceMoved > this.CLICK_MOVE_THRESHOLD) {
					this._ch5Component.logger.log(`Ch5PressableButton.onMouseMove() cancelling press, ${mouseEvent.clientX}, ${mouseEvent.clientY}, ${distanceMoved}`);
					this.resetFingerObject();
				}
			}
		}
	}

	private resetFingerObject() {
		// setTimeout(()=> {
		// this.isMouse = false;
		// this.isTouch = false;
		this._fingerState.reset();
		// });
	}

	private _onMouseUp(inEvent: Event): void {
		this._ch5Component.logger.log("this._onMouseUp");
		this._onMouseLeave(inEvent);
	}

	private _onMouseLeave(inEvent: Event): void {
		this._ch5Component.logger.log("this._onMouseLeave");
		// if (this.isTouch) {
		// 	return;
		// }

		const mouseEvent: MouseEvent = inEvent as MouseEvent;
		if (mouseEvent !== null) {
			this.fingerStateActions();
		}
	}

	/* private _onTouchStart(inEvent: Event): void {
		// inEvent.preventDefault();
		this._ch5Component.logger.log("this._onTouchStart"); //, this.isTouch, this.isMouse);
		// if (this.isMouse) {
		// 	return;
		// }
		// this._ch5Component.logger.log("this._onTouchStart Continues...", this.ch5Component.getCrId());

		// this.isTouch = true;
		// this.isMouse = false;

		const touchEvent: TouchEvent = inEvent as TouchEvent;
		const touch: Touch = touchEvent.changedTouches[0];
		// this._ch5Component.info(`Ch5PressableButton._onTouchStart(), ${touch.clientX}, ${touch.clientY}, ${touch.identifier}`);
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Idle) {
			this._fingerState.mode = Ch5PressableFingerStateMode.Start;
			this._fingerState.touchHoldTimer = window.setTimeout(this._onTouchHoldTimer, this.TOUCH_TIMEOUT);
			this._fingerState.touchStartLocationX = touch.clientX;
			this._fingerState.touchStartLocationY = touch.clientY;
			this._fingerState.touchPointId = touch.identifier;
		}
	} */

	/* private _onTouchMove(inEvent: Event): void {
		this._ch5Component.logger.log("this._onTouchMove");
		// if (this.isMouse) {
		// 	return;
		// }

		// On a swipe motion we don't want to send a join or show visual feedback, check if finger has moved
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
			const touchEvent: TouchEvent = inEvent as TouchEvent;
			const touch: Touch | null = this._fingerState.getTouchFromTouchList(touchEvent);
			if (touch !== null) {
				// this._ch5Component.info(`Ch5PressableButton._onTouchMove() , ${touch.clientX}, ${touch.clientY}, ${touch.identifier}`);
				const xMoveDistance = touch.clientX - this._fingerState.touchStartLocationX;
				const yMoveDistance = touch.clientY - this._fingerState.touchStartLocationY;
				const distanceMoved = Math.sqrt(xMoveDistance ** 2 + yMoveDistance ** 2);
				this._ch5Component.logger.log(`DELETE ME Ch5PressableButton._onTouchMove() , ${touch.clientX}, ${touch.clientY}, ${touch.identifier}, ${distanceMoved}`);
				if (distanceMoved > this.PRESS_MOVE_THRESHOLD) {
					this._ch5Component.logger.log(`Ch5PressableButton._onTouchMove() cancelling press, ${touch.clientX}, ${touch.clientY}, ${touch.identifier}, ${distanceMoved}`);
					this.resetFingerObject();
				}
			}
		}
	} */

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private _onTouchHoldTimer(event: Event): void {
		this._fingerState.touchHoldTimer = null;
		this._fingerIsDownActions();
	}

	private _fingerIsDownActions() {
		this._fingerState.mode = Ch5PressableFingerStateMode.FingerDown;
		this._onHold();
		if (this._fingerState.touchHoldTimer !== null) {
			window.clearTimeout(this._fingerState.touchHoldTimer);
			this._fingerState.touchHoldTimer = null;
		}
	}

	/* 	private _onTouchEnd(inEvent: Event): void {
			this._ch5Component.logger.log("this._onTouchEnd");
			// if (this.isMouse) {
			// 	return;
			// }
	
			const touchEvent: TouchEvent = inEvent as TouchEvent;
			const touch: Touch | null = this._fingerState.getTouchFromTouchList(touchEvent);
			if (touch !== null) {
				this.fingerStateActions();
			}
		} */

	private fingerStateActions() {
		if (this._fingerState.mode === Ch5PressableFingerStateMode.Start) {
			// quick tap, must do both press and release
			this._fingerIsDownActions();
		}

		if (this._fingerState.mode === Ch5PressableFingerStateMode.FingerDown) {
			this._onRelease();
		}
		this.resetFingerObject();
	}

	/* private _onTouchCancel(inEvent: Event): void {
		this._ch5Component.logger.log("this._onTouchCancel");
		this._onTouchEnd(inEvent);
	} */

	/**
	 * Dispatch press event. Add press css class.
	 */
	private _onHold() {
		this._ch5Component.logger.log(`Ch5PressableButton._onHold() alreadyPressed:${this._pressed}`);
		if (!this._pressed) {
			// add the visual feedback
			this.addCssPressClass();

			this._pressed = true;
			this._released = false;
			this.observablePressed.next(this._pressed);
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
				} catch (e) {
					// Ignore
				};
			}
		}
	}

	/**
	 * Dispatch release event. Remove press css class.
	 */
	private _onRelease() {
		this._ch5Component.logger.log(`Ch5PressableButton._onRelease() alreadyReleased:${this._released}`);
		if (!this._released) {
			// remove the visual feedback
			setTimeout(() => {
				this.removeCssPressClass();
			}, this.TOUCH_TIMEOUT);

			// update state of the button and tell the button the state
			this._pressed = false;
			this._released = true;
			this.observablePressed.next(this._pressed);
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
				} catch (e) {
					// Ignore
				};
			}
		}
	}

	/**
	 * Add css class when the component is pressed
	 */
	private addCssPressClass() {
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
	private removeCssPressClass() {
		if (this._options !== null &&
			this._options.cssTargetElement.classList !== undefined) {
			this._options.cssPressedClass.split(' ').forEach((ele) => {
				this._options?.cssTargetElement.classList.remove(ele);
			});
		}
	}

}
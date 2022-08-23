// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import isNil from "lodash/isNil";
import { Ch5List, Ch5ListItemAxis } from "./ch5-list";
import { getEvtListenerOptions } from "../ch5-list/passiveEventListeners";
import { normalizeEvent } from "../ch5-triggerview/utils";
import { Ch5ListAbstractHelper } from "./ch5-list-abstract-helper";
import { isCrestronDevice } from "../ch5-core/utility-functions/is-crestron-device";

// How strictly the ch5-list detects a horizontal drag.
// The angle (in degrees) should be in range (0, 90)
// 45 degrees is the neutral angle.
// The higher the value, the stricter the detection.

// Distance (in px) that has to be covered before the ch5-list starts
// detecting a horizontal vs vertical movement.
export const stepAllowancePx = 50;

export class Ch5ListEventManager extends Ch5ListAbstractHelper {

	/**
	 * Specific angle range to allow moving the list when the drag is not
	 * completly vertical
	 *
	 * @type {number}
	 * @protected
	 */
	protected _dragAllowanceAngle: number = 45;

	/**
	 * The drag angle registered on mousemove/touchmove
	 *
	 * @type {number}
	 * @protected
	 */
	protected _currentDragAngle: number = 0;

	protected _listHasMoved: boolean = false;

	private _hammer: HammerManager | null = null;

	/**
	 * Keeps the timeout instance
	 * @type {number}
	 * @private
	 */
	private _updateManager: number = 0;

	constructor(list: Ch5List) {
		super(list);

		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerEnd = this.onPointerEnd.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.onPointerCancel = this.onPointerCancel.bind(this);
		this.onOrientationChange = this.onOrientationChange.bind(this);
	}

	/**
	 * Removes listeners
	 */
	public removeEvents(additionalElement: HTMLElement) {
		this._list.info(`ch5-list-event-manager - removeEvents`);
		if (this._hammer !== null) {
			this._hammer.destroy();
			this._hammer = null;
		}

		window.removeEventListener('resize', this.onWindowResize);
		window.removeEventListener('touchcancel', this.onPointerCancel);
		window.removeEventListener('orientationchange', this.onOrientationChange);
		additionalElement.removeEventListener('touchstart', this.onPointerDown);
		additionalElement.removeEventListener('mousedown', this.onPointerDown);
		additionalElement.removeEventListener('touchmove', this.onPointerMove);
		additionalElement.removeEventListener('mousemove', this.onPointerMove);
		additionalElement.removeEventListener('touchend', this.onPointerEnd);
		additionalElement.removeEventListener('mouseup', this.onPointerEnd);

	}

	public initializeEvents(additionalElement: HTMLElement) {
		this._list.info(`ch5-list-event-manager - initializeEvents`);
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('orientationchange', this.onOrientationChange);

		if (isCrestronDevice()) {
			this.initializeTouchEvents(additionalElement);
		} else {
			this.initializeMouseEvents(additionalElement);
			this.initializeTouchEvents(additionalElement);
		}

		// fixes weird safari 10 bug where preventDefault is prevented
		// @see https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356
		window.addEventListener('touchmove', () => { return });
	}

	/**
	 * Attach touch events listeners for an additional element beloging to the list
	 *
	 * @param {HTMLElement} additionalElement
	 */
	protected initializeTouchEvents(additionalElement: HTMLElement): void {
		this._list.info(`ch5-list-event-manager - initializeTouchEvents`);

		window.addEventListener('touchcancel', this.onPointerCancel);
		additionalElement.addEventListener('touchstart', this.onPointerDown, { passive: true });
		additionalElement.addEventListener('touchmove', this.onPointerMove, { passive: true });
		additionalElement.addEventListener('touchend', this.onPointerEnd, true);

	}

	/**
	 * Attach mouse events listeners
	 * @param {HTMLElement} additionalElement
	 */
	protected initializeMouseEvents(additionalElement: HTMLElement): void {
		this._list.info(`initializeMouseEvents`);

		additionalElement.addEventListener('mousedown', this.onPointerDown);
		additionalElement.addEventListener('mousemove', this.onPointerMove, getEvtListenerOptions(false));
		additionalElement.addEventListener('mouseup', this.onPointerEnd, true);
	}

	/**
	 * Check if the current web view or browser supports touch events
	 *
	 * @returns {boolean}
	 */
	protected checkTouchSupport(): boolean {
		if (('ontouchstart' in window && 'ontouchmove' in window && 'ontouchend' in window && 'ontouchcancel' in window)
			|| (navigator.maxTouchPoints > 0)) {
			return true;
		}
		return false;
	}

	public onWindowResize() {
		this._list.templateHelper.resetListLayout();
	}

	/**
	 * Begins to track pointer events in order to drag the wrapper.
	 * @param {MouseEvent | TouchEvent} event The normalised pointer event.
	 * @private
	 */
	public onPointerDown(event: MouseEvent | TouchEvent) {
		this._list.info(`ch5-list-event-manager - onPointerDown: ${event}`);
		const e = normalizeEvent(event);

		if (this._list.decelerating) {
			e.event.stopPropagation();
		}

		if ((this._list.endless && !this._animationHelper.maxOffsetTranslate) || !this._list.endless) {
			this._list.sizeResolver.updateViewport(this._list);

			const bufferAmountState = !isNil(this._list.bufferAmount) && this._list.bufferAmount > 0;
			const maxOffsetTranslate = this._animationHelper.adjustMaxOffset(bufferAmountState);
			this._animationHelper.maxOffsetTranslate = maxOffsetTranslate;
		}

		const containerBounding = this._list.getBoundingClientRect();
		const firstChildBounding = this._list.items[0].element.getBoundingClientRect();

		let containerSize = containerBounding.width;
		let totalItemsSize = firstChildBounding.width * (this._list.size as number);
		this._templateHelper.resolveEndlessViewportSize();

		if (!this._list.isHorizontal) {
			containerSize = containerBounding.height;
			totalItemsSize = firstChildBounding.height * (this._list.size as number);
		}

		if (totalItemsSize > containerSize) {
			this._list.decelerating = false;
			this._list.isPointerActive = true;
			this._list.pointerId = e.id;
			this._list.pointerFirstX = this._list.pointerLastX = this._list.pointerCurrentX = e.x;
			this._list.pointerFirstY = this._list.pointerLastY = this._list.pointerCurrentY = e.y;
			this._list.lastDraggedLayoutIndex = this._list.items[this._list.selected].layoutIndex;

			this._list.pointerStartTime = this._list.pointerEndTime = Date.now();
			this._list.stepOnX = this._list.currentXPosition;
			this._list.stepOnY = this._list.currentYPosition;

			this._list.trackingPointsX = [];
			this._list.trackingPointsY = [];
			this._addTrackingPoint(this._list.pointerLastX, Ch5ListItemAxis.X);
			this._addTrackingPoint(this._list.pointerLastY, Ch5ListItemAxis.Y);

			this._list.animationHelper.stop();

			window.addEventListener('touchcancel', this.onPointerEnd);
		}
	}

	/**
	 * Tracks the pointer movement and reflects it to the UI.
	 * @param {MouseEvent | TouchEvent} event The normalised pointer event.
	 * @private
	 */
	public onPointerMove(event: MouseEvent | TouchEvent) {
		const e = normalizeEvent(event);

		const oppositeVectorSize = Math.abs(this._list.pointerFirstX - e.x);
		const adjacentVectorSize = Math.abs(this._list.pointerFirstY - e.y);

		let dragAngle = Math.atan2(oppositeVectorSize, adjacentVectorSize) * (180 / Math.PI);

		if (this._list.isHorizontal) {
			dragAngle = Math.atan2(adjacentVectorSize, oppositeVectorSize) * (180 / Math.PI);
		}

		this._currentDragAngle = dragAngle;

		// Checking the pointer id avoids running the same code twice
		// in case of touch screens.
		if (
			this._currentDragAngle >= 0 &&
			this._currentDragAngle <= this._dragAllowanceAngle &&
			this._list.isPointerActive
		) {
			// Always update the current value of the pointer.
			// Once per frame, it gets consumed and becomes the last value.
			this._list.info(`ch5-list-event-manager - onPointerMove: ${event}`);

			this._list.pointerCurrentX = e.x;
			this._list.pointerCurrentY = e.y;
			this._listHasMoved = true;

			const dX = this._list.currentXPosition + this._list.pointerCurrentX - this._list.pointerFirstX;
			const dY = this._list.currentYPosition + this._list.pointerCurrentY - this._list.pointerFirstY;

			const startingPoint = this._list.isHorizontal ? dX : dY;
			const endingPoint = this._list.isHorizontal ? this._list.stepOnX : this._list.stepOnY;

			// Updates on direction should be made px by px
			if (Math.abs(endingPoint - startingPoint) > 1) {
				this._list.animationHelper.direction = this._list.animationHelper.resolveDirection(startingPoint, endingPoint);
			}

			clearTimeout(this._updateManager);

			this._updateManager = window.setTimeout(() => {
				this._list.stepOnX = dX;
				this._list.stepOnY = dY;
				this._list.pointerStartTime = Date.now();
			}, 50);

			let coord = dX;

			if (!this._list.isHorizontal) {
				coord = dY;
			}

			this._templateHelper.computePage(Math.abs(coord));

			this._addTrackingPoint(this._list.pointerLastX, Ch5ListItemAxis.X);
			this._addTrackingPoint(this._list.pointerLastY, Ch5ListItemAxis.Y);

			if (this._animationHelper !== null) {
				this._animationHelper.updateDragPosition(coord);
			}
		} else {
			this._list.isPointerActive = false;
		}
	}

	/**
	 * Stops the pointer tracking.
	 * @param {MouseEvent | TouchEvent} event The normalised pointer event.
	 * @private
	 */
	public onPointerEnd(event: MouseEvent | TouchEvent) {
		this._list.info(`ch5-list-event-manager - onPointerEnd: ${event}`);
		this._list.pointerEndTime = Date.now();
		if (this._listHasMoved) {
			this._list.currentXPosition += this._list.pointerCurrentX - this._list.pointerFirstX;
			this._list.currentYPosition += this._list.pointerCurrentY - this._list.pointerFirstY;
			this.stopPointerTracking();
		}

		clearTimeout(this._updateManager);
		this._listHasMoved = false;
	}

	public onPointerCancel() {
		this._list.info(`ch5-list-event-manager - onPointerCancel`);
		this.stopPointerTracking();
	}

	/**
	 * Add/remove event listeners for pointer interactions.
	 * @private
	 */
	public updateDragEventListeners(element: HTMLElement) {
		this._list.info(`ch5-list-event-manager - updateDragEventListeners`);
		element.addEventListener('touchstart', this.onPointerDown, getEvtListenerOptions(true));
		element.addEventListener('mousedown', this.onPointerDown, getEvtListenerOptions(true));
	}

	/**
	 * Event listener for orientation change
	 */
	private onOrientationChange() {
		this._templateHelper.customScrollbar(this._list);
	}

	/**
	 * Stops the tracking of pointer events, resets the dragging logic,
	 * and possibly starts the deceleration.
	 */
	public stopPointerTracking() {
		this._list.info(`ch5-list-event-manager - stopPointerTracking`);
		this._list.isPointerActive = false;
		this._list.pointerId = 0;

		if (this._animationHelper !== null) {
			this._animationHelper.startDecelerating();
		}
	}

	/**
	 * Stores the last 100ms worth of tracking data from pointer events.
	 * @param {number} num The coordinate value to strore
	 * @param {Ch5ListItemAxis} axis The coordinate value to strore
	 * @private
	 */
	private _addTrackingPoint(num: number, axis: Ch5ListItemAxis) {
		const time = Date.now();

		switch (axis) {
			case Ch5ListItemAxis.X:
				// Keep only data from the last 100ms
				while (this._list.trackingPointsX.length > 0) {
					if (time - this._list.trackingPointsX[0].time <= 100) {
						break;
					}
					this._list.trackingPointsX.shift();
				}
				this._list.trackingPointsX.push({ num, time });
				break;

			case Ch5ListItemAxis.Y:
				// Keep only data from the last 100ms
				while (this._list.trackingPointsY.length > 0) {
					if (time - this._list.trackingPointsY[0].time <= 100) {
						break;
					}
					this._list.trackingPointsY.shift();
				}
				this._list.trackingPointsY.push({ num, time });
				break;

			default:
				break;
		}
	}

}

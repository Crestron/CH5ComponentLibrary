// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import isNil from "lodash/isNil";
import isUndefined from "lodash/isUndefined";
import { ICh5ListItemInfo, Ch5List } from "./ch5-list";
import { Ch5ListAbstractHelper } from "./ch5-list-abstract-helper";
import { TCh5ListElementOrientation } from "../_interfaces/ch5-list/types";
import { Ch5Animation, TAnimationCallback } from "./animation/ch5-animation";
import { Ch5Common } from "../ch5-common/ch5-common";

// horizontal % needed to trigger swipe
export const defaultTransitionDuration = 0;
export type TAnimateCallback = (
    element: HTMLElement,
    currentPosition: number,
    mode: TCh5ListElementOrientation,
    previousPosition?: number,
    callback?: TAnimationCallback,
) => void;

export enum EDragDirection {
    next = 1,
    previous = 0,
}

export const _swipeSensitivity = 40;

const _frictionForce = 0.95555;
const _defaultVelocityMultiplicationFactor = 50;
const _maxVelocityAmount = 2000;

export class Ch5ListAnimation extends Ch5ListAbstractHelper {

    public disableAnimation: boolean = false;
    public animationAPI: Ch5Animation = {} as Ch5Animation;
    public animationFrame: number = 0;

    public maxOffsetTranslate: number | undefined;
    public minOffsetTranslate: number = 0;

    public direction: number = 1;


    constructor(list: Ch5List, animationApi?: Ch5Animation) {
        super(list);

        if (animationApi instanceof Ch5Animation) {
            this.animationAPI = animationApi;
        }
    }

    public stop() {
        if (this._list.pagedSwipe) {
            return;
        }
        this._list.decelerating = false;
        cancelAnimationFrame(this.animationFrame);
    }

    public onFinishAnimation() {
        this._list.decelerating = false;
    }

    public addAnimationApi(api: Ch5Animation): boolean {
        if (api instanceof Ch5Animation) {
            this.animationAPI = api;

            return true;
        }
        return false;
    }

    /**
     * Computes the initial parameters of the deceleration.
     */
    public startDecelerating() {
        this._list.info(`ch5-list-template - startDecelerating`);

        if (!this._list.pagedSwipe && !this._list.endless) {
            this.minOffsetTranslate = 0;
        }

        this.listDeceleration();
    }

    public listDeceleration() {

        if (this.disableAnimation) {
            this._list.decelerating = false;
            return;
        } else {
            this._list.decelerating = true;
        }

        let coord: number = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;

        let velocity: number;
        const timeDiff = this._list.pointerEndTime - this._list.pointerStartTime;
        const isHorizontal = this._list.isHorizontal;
        const endCoord = isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;
        const startCoord = isHorizontal ? this._list.stepOnX : this._list.stepOnY;
        const distanceDiff = Math.abs(endCoord - startCoord);

        velocity = Math.round(distanceDiff / timeDiff) * _defaultVelocityMultiplicationFactor;

        if (this._list.endless) {
            this._infiniteLoopManager(coord);
        } else {
            coord = this.fixOffset(coord);
        }

        if (distanceDiff === 0) {
            this._list.decelerating = false;
            return;
        } else if (velocity > _maxVelocityAmount) {
            velocity = _maxVelocityAmount;
        }

        if (!this._list.pagedSwipe) {

            cancelAnimationFrame(this.animationFrame);

            const deceleration = () => {
                const isLtr = this._list.isLtr();
                const minOffsetTranslate = this.minOffsetTranslate || 0;
                const maxOffsetTranslate = this.maxOffsetTranslate || 0;
                const listPosition = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;

                if (!this._list.endless 
                    && (velocity < 1 
                        || (isLtr && (listPosition <= maxOffsetTranslate || listPosition >= 0))
                        || (!isLtr && (listPosition <= minOffsetTranslate || listPosition >= -maxOffsetTranslate ))
                    )
                ) {
                    cancelAnimationFrame(this.animationFrame);
                    this._list.decelerating = false;
                    return;
                }
                velocity *= _frictionForce;

                // decide the direction of the movement ( up/down or left/right )
                if (this._list.isHorizontal) {
                    if (this._list.pointerFirstX < this._list.pointerLastX) {
                        this._list.currentXPosition += velocity;
                    } else {
                        this._list.currentXPosition -= velocity;
                    }

                    coord = this._list.currentXPosition;
                } else {
                    if (this._list.pointerFirstY < this._list.pointerLastY) {
                        this._list.currentYPosition += velocity;
                    } else {
                        this._list.currentYPosition -= velocity;
                    }

                    coord = this._list.currentYPosition;
                }
                this.updateDragPosition(coord);
                this.animationFrame = requestAnimationFrame(deceleration);
            }

            if (velocity > 0) {
                deceleration();
            }
        } else {

            const viewportWidth = this._list.viewportClientWidth;
            const viewportHeight = this._list.viewportClientHeight;
            const pageSize = this._list.isHorizontal ? viewportWidth : viewportHeight;

            this._templateHelper.computePage(coord, startCoord, endCoord);
            coord = this._list.currentPage * pageSize;

            if (this._list.isHorizontal) {
                this._list.currentXPosition = coord;
            } else {
                this._list.currentYPosition = coord;
            }

            this.updateDragPosition(coord, this.animationAPI.animate);
        }

        if (this._list.bufferAmount) {
            this._list.bufferdItemsHelper.maybeAddBufferItems(coord);
        }
    }

    public fixOffset(coord: number) {
        this._list.info(`ch5-list-animation - fixOffset, coord: ${coord}`);

        const isLtr = this._list.isLtr();
        let maxOffset: number;
        let allowedOffset: number = 0;

        if (isUndefined(this.maxOffsetTranslate)) {
            this.maxOffsetTranslate = 0;
        }

        if (this._list.isHorizontal) {
            if (!isNil(this._list.itemOffsetWidth)) {
                maxOffset = (this.maxOffsetTranslate as number);
                allowedOffset = fix(coord, maxOffset, this.minOffsetTranslate);
            }
        } else {
            if (!isNil(this._list.itemOffsetHeight)) {
                maxOffset = (this.maxOffsetTranslate as number);
                allowedOffset = fix(coord, maxOffset, this.minOffsetTranslate);
            }
        }

        return allowedOffset;

        function fix(_coord: number, _maxOffset: number, _minOffset: number): number {

            let maxOffsetDistance = _maxOffset;
            let minOffsetDistance = _minOffset;

            if (!isLtr) {
                const maxOffsetPlaceholder = maxOffsetDistance;
                maxOffsetDistance = minOffsetDistance;
                minOffsetDistance = -maxOffsetPlaceholder;
            }

            if (_coord < maxOffsetDistance) {
                return maxOffsetDistance;
            } else if (_coord > minOffsetDistance) {
                return minOffsetDistance;
            }

            return _coord;

        }

    }

    /**
     * Move the list to an item  specified by a position number
     */
    public signalScrollTo(position: number): void {
        this._list.info(`ch5-list-animation - signalScrollTo, position: ${position}`);
        // Scroll the first visible item of the list to received value 1 based offset

        const isLtr = this._list.isLtr();
        let positionCondition = position >= 0;
        
        // special handling is needed for horizontal rtl; all other cases are the same
        if (this._list.isHorizontal && !isLtr) {
            position = -position;
            positionCondition = position <= 0;
        }

        if (this._list.divList.childElementCount > 0 && positionCondition) {
            const firstChild = this._list.divList.firstChild;
            const firstChildSizeData = (firstChild as HTMLElement).getBoundingClientRect();

            if (firstChildSizeData !== null) {
                const firstChildSize = this._list.isHorizontal ? firstChildSizeData.width : firstChildSizeData.height;

                const animate = this.animationAPI.animate.bind(this.animationAPI);
                const coord = -(firstChildSize * position);

                if (this._list.isHorizontal) {
                    this._list.currentXPosition = coord;
                } else {
                    this._list.currentYPosition = coord;
                }

                this._list.templateHelper._updateScrollBarPosition(coord, animate);
                this.updateDragPosition(coord, animate);


            }
        }
    }

    /**
     * Translates the list to show the target view.
     * @param {number} coord Coordinates.
     */
    public slideTo(coord: number) {

        if (this._list.isHorizontal) {
            this._templateHelper.setWrapperTranslateX(coord);
            return;
        }

        this._templateHelper.setWrapperTranslateY(coord);
    }

    /**
     * Determines the direction of the touch oranimation move
     * 
     * @see EDragDirection
     * @param {number} last 
     * @param {number} current
     * @return {number} 
     */
    public resolveDirection(last: number, current: number): number {
        if (last >= current) {
            return 0;
        }

        return 1;
    }

    /**
     * Updates the UI while the user is dragging the items.
     */
    public updateDragPosition(newPosition: number, animate?: TAnimateCallback) {
        if (!this._list.endless) {
            newPosition = this._computeNewPosition(newPosition);
        } else {
            this._infiniteLoopManager(newPosition);
        }

        let _animate: TAnimateCallback | undefined;

        if (animate !== undefined) {
            _animate = animate.bind(this.animationAPI);
        }

        // set wrapper translate
        if (this._list.isHorizontal) {
            this._templateHelper.setWrapperTranslateX(newPosition, _animate);
        } else {
            this._templateHelper.setWrapperTranslateY(newPosition, _animate);
        }


        // if there is scrollbar update his position
        if (this._list.scrollbar === true) {
            this._templateHelper._updateScrollBarPosition(newPosition, _animate);
        }

        this._list.pointerLastX = this._list.pointerCurrentX;
        this._list.pointerLastY = this._list.pointerCurrentY;
        this._list.dragTicking = false;

        // maybe add buffer items
        this._list.bufferdItemsHelper.maybeAddBufferItems(newPosition);
    }

    /**
     * The responsibility of this method is to adjust the max offset translate 
     * value. By default this method use the viewport size to set 
     * the max offset translate.
     * 
     * When dealing with buffered lists (lists that have `bufferAmount` attribute)
     * the viewport size increseas everytime it reaches the number of items 
     * defined in bufferAmount attribute, in this case the max offset translate
     * is calculated using the value from `size` attribute and the width/height
     * of the first list element.
     * 
     * @see Ch5List.size
     * @see Ch5List.bufferAmount
     * @see Ch5ListSizeResolver.hiddenListSize
     * @param {boolean} isBuffered default value is false
     * @return {number} the max offset translate value
     */
    public adjustMaxOffset(isBuffered: boolean = false): number {
        
        if (!isBuffered) {
            return this._list.sizeResolver.hiddenListSize;
        }

        this._templateHelper.updateViewportSize(
            this._list.sizeResolver.viewPortSize
        );

        const itemsPerPage = this._list.getItemsPerPage();
        const firstItemSize = this._list.getItemSize();
        const definedListSize = this._list.size || 0;
        const listSize = (definedListSize - itemsPerPage) * firstItemSize; 

        return listSize;
    }

    /**
     * This method is responsible to reset the min and max offset
     * Ideally to use when the list is updated ( e.g: the viewport size is changed
     * from landscape to portrait ) then we need this values to be reseted and 
     * recalculated with the new fresh layout information
     */
    public resetOffsets(): void {
        this.maxOffsetTranslate = undefined;
        this.minOffsetTranslate = 0;
    }


    private _infiniteLoopManager(newPosition: number) {
        const firstElement = this._list.items[0];
        const isLtr = this._list.isLtr();

        if (!firstElement) {
            return;
        }

        const itemSize = this._list.isHorizontal ? firstElement.element.offsetWidth : firstElement.element.offsetHeight;

        if (isNil(this.maxOffsetTranslate)) {
            return;
        }

        let currentItemToMove: number;
        let arrangementFn: () => void;
        this._log(newPosition);

        if ((this._list.isVertical || isLtr) && this._arrangementCondition(newPosition)) {
            if (this.direction === EDragDirection.next) {
                currentItemToMove = Math.ceil(Math.abs((newPosition - this.maxOffsetTranslate)) / itemSize);
                arrangementFn = this.stackInfinite;
            } else {
                currentItemToMove = Math.ceil(Math.abs(newPosition - this.minOffsetTranslate) / itemSize);
                arrangementFn = this.queueInfinite;
            }

            this._loop(currentItemToMove, arrangementFn);
        }

        // horizontal rtl needs special handling; all other cases are the same
        if (this._list.isHorizontal && !isLtr && this._arrangementCondition(newPosition)) {
            if (this.direction === EDragDirection.next) {
                currentItemToMove = Math.ceil(Math.abs((newPosition - this.minOffsetTranslate)) / itemSize);
                arrangementFn = this.queueInfinite;
            } else {
                // subtracts 1 so that the last element is removed only after it's gone out of view
                currentItemToMove = Math.ceil(Math.abs(newPosition - this.minOffsetTranslate) / itemSize) - 1;
                arrangementFn = this.stackInfinite;
            }

            this._loop(currentItemToMove, arrangementFn);
        }
    }

    private stackInfinite() {
        const elementToMove = this._list.items.shift();
        const isLtr = this._list.isLtr();

        if (!elementToMove || isNil(this.maxOffsetTranslate)) {
            return;
        }

        const nextPosition = this._list.sizeResolver.fullListSize;
        let itemSize = elementToMove.element.offsetWidth;

        // add nextPosition if ltr or vertical; subtract otherwise
        let signedNextPosition = nextPosition;
        if (this._list.isHorizontal && !isLtr) {
            signedNextPosition = -nextPosition;
        }

        this._list.items.push(elementToMove as ICh5ListItemInfo);
        if (this._list.isHorizontal) {
            const stackPosition = (elementToMove as ICh5ListItemInfo).translateX + signedNextPosition;
            this._templateHelper.setItemTranslateX(stackPosition, elementToMove as ICh5ListItemInfo);
        } else {
            const stackPosition = (elementToMove as ICh5ListItemInfo).translateY + signedNextPosition;
            this._templateHelper.setItemTranslateY(stackPosition, elementToMove as ICh5ListItemInfo);
            itemSize = elementToMove.element.offsetHeight;
        }

        // subtract itemSize if ltr or vertical ; add otherwise
        let signedItemSize = -itemSize;
        if (this._list.isHorizontal && !isLtr) {
            signedItemSize = itemSize;
        }

        this.maxOffsetTranslate = this.maxOffsetTranslate + signedItemSize;
        this.minOffsetTranslate = this.minOffsetTranslate + signedItemSize;
    }

    private queueInfinite() {
        const elementToMove = this._list.items.pop();
        const isLtr = this._list.isLtr();

        if (!elementToMove || isNil(this.maxOffsetTranslate)) {
            return;
        }

        const nextPosition = this._list.sizeResolver.fullListSize;
        let itemSize = elementToMove.element.offsetWidth;

        // subtract nextPosition if ltr or vertical; add otherwise
        let signedNextPosition = -nextPosition;
        if (this._list.isHorizontal && !isLtr) {
            signedNextPosition = nextPosition;
        }

        this._list.items.unshift(elementToMove as ICh5ListItemInfo);

        if (this._list.isHorizontal) {
            const queuedPosition = (elementToMove as ICh5ListItemInfo).translateX + signedNextPosition;
            this._templateHelper.setItemTranslateX(queuedPosition, elementToMove as ICh5ListItemInfo);
        } else {
            const queuedPosition = (elementToMove as ICh5ListItemInfo).translateY + signedNextPosition;
            this._templateHelper.setItemTranslateY(queuedPosition, elementToMove as ICh5ListItemInfo);
            itemSize = elementToMove.element.offsetHeight;
        }

        // add itemSize if ltr or vertical; subtract otherwise
        let signedItemSize = itemSize
        if (this._list.isHorizontal && !isLtr) {
            signedItemSize = -itemSize;
        }

        this.maxOffsetTranslate = this.maxOffsetTranslate + signedItemSize;
        this.minOffsetTranslate = this.minOffsetTranslate + signedItemSize;
    }

    private _calculateNextPosition() {
        const itemSize = this._list.getItemSize();

        return this._list.items.length * itemSize;
    }

    private _loop(currentItemToMove: number, arrangementFn: () => void) {
        let itemIndex = 0;
        while (itemIndex < currentItemToMove) {
            arrangementFn.apply(this);
            if (itemIndex > this._list.items.length) {
                itemIndex = 0;
                currentItemToMove = currentItemToMove - this._list.items.length;
            } else {
                itemIndex++;
            }
        }
    }

    private _arrangementCondition(newPosition: number) {
        const isLtr = this._list.isLtr();
        if (isNil(this.maxOffsetTranslate)) {
            return false;
        }

        if (this.direction === EDragDirection.next) {

            // special handling for horizontal rtl; all other cases are the same
            let threshold = this.maxOffsetTranslate;
            if (this._list.isHorizontal && !isLtr) {
                threshold = this.minOffsetTranslate;
            }
            return newPosition < threshold;
        }

        return newPosition > this.minOffsetTranslate;
    }

    /**
     * Computes new position based on the list direction and the previous new position
     * For non-endless list only
     * 
     * @param newPosition 
     * @return {number}
     */
    private _computeNewPosition(newPosition: number): number {
        // Current position based on orientation + the amount of drag happened since the last rAF.
        const offsetLimit = this.maxOffsetTranslate || 0;
        // X position 
        const positionCoord = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;
        const isLtr = this._list.isLtr();

        // horizontal rtl needs special handling; all other cases are the same
        if (this._list.isHorizontal && !isLtr) {
            if (positionCoord > -offsetLimit || newPosition > -offsetLimit) {
                return this._list.currentXPosition = this._list.currentYPosition = -offsetLimit;
            } else if (positionCoord < 0 || newPosition < 0) {
                return this._list.currentXPosition = this._list.currentYPosition = 0;
            }
        } else {
            if (positionCoord < offsetLimit || newPosition < offsetLimit) {
                return this._list.currentXPosition = this._list.currentYPosition = offsetLimit;
            } else if (positionCoord > 0 || newPosition > 0) {
                return this._list.currentXPosition = this._list.currentYPosition = 0;
            }
        }

        // no condition was matched; return same value
        return newPosition;
    }

    private _log(newPosition: number) {
        const isLtr = this._list.isLtr();

        if (isNil(this.maxOffsetTranslate)) {
            return;
        }

        let shouldStack: boolean;
        let shouldQueue: boolean;

        // horizontal rtl needs special handling; all other cases are the same
        if (this._list.isHorizontal && !isLtr) {
            shouldStack = newPosition > this.maxOffsetTranslate;
            shouldQueue = newPosition < this.minOffsetTranslate;
        } else {
            shouldStack = newPosition < this.maxOffsetTranslate;
            shouldQueue = newPosition > this.minOffsetTranslate;
        }

        this._list.info({
            'dir': this.direction,
            shouldStack,
            shouldQueue,
            'minOffset': this.minOffsetTranslate,
            'maxOffset': this.maxOffsetTranslate,
            'pos': newPosition,
        });
    }
}

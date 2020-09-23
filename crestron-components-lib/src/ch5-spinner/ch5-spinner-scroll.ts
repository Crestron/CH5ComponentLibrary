// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Spinner } from "./ch5-spinner";
import { Ch5SignalFactory } from "../ch5-core";
import { Ch5MouseVelocity } from "./ch5-mouse-velocity";
import { Ch5SpinnerTemplate } from "./ch5-spinner-template";

export class Ch5SpinnerScroll {

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {HTMLElement}
   */
  private element: Ch5Spinner = {} as Ch5Spinner;

  /**
   * This will be true when the mouse is pressed.
   * Used together with mousemove/drag event
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {boolean}
   */
  private mouseDown: boolean = false as boolean;

  /**
   * Determines where the mouse pointer is when click down
   * Helps to determine if the moving is down or up
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {number}
   */
  private initialMousePos: number = 0 as number;

  /**
   * Get the current Y offset of spinner component
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {number}
   */
  private currentYOffset: number = 0 as number;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {string}
   */
  private direction: string = '' as string;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {number}
   */
  private dragTimeout: number = 0;

  /**
   * Will be used to know if the spinner can dispatch the focus event
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {boolean}
   */
  private readyToFocus: boolean = true as boolean;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {number}
   */
  private _currentElement: number = 0;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _mouseDownListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _mouseUpListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _mouseMoveListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _touchstartListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _toucheendUpListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _touchmoveListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _mouseLeaveListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {EventListenerOrEventListenerObject}
   */
  private _touchendLeaveListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

  /**
   * Save the mouse coordinates in order to calculate
   * the speed of the dragging gesture whithin the list element
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {Ch5MouseVelocity}
   */
  private mouseVelocity: Ch5MouseVelocity = {} as Ch5MouseVelocity;

  private _runTimeout: number = 0;

  constructor(element: Ch5Spinner) {
    this.element = element;
    this.attachEventListeners();

    const selectedValue = this.element.selectedValue;
    this.selectTheItem(selectedValue);
  }

  public destruct() {
    this.detachEventListeners();
  }

  /**
   * Setter for currentElement property
   *
   * @param {number} index
   */
  public set currentElement(index: number) {
    this._currentElement = index;
  }

  /**
   * Getter for currentElement
   *
   * @return {number}
   */
  public get currentElement(): number {
    const childrenObject = this.element.templateHelper.childrenObject as [HTMLElement];

    if (this._currentElement <= 0 && !this.element.endless) {
      return 0;
    } else if (
      childrenObject !== null &&
      !this.element.endless &&
      this._currentElement >= childrenObject.length - 1
    ) {
      return childrenObject.length - 1;
    }

    if (childrenObject !== null && this.element.endless && childrenObject.length < this._currentElement) {
      return this._currentElement % childrenObject.length;
    }

    return this._currentElement;
  }

  /**
   * Get current element, the index will be get from data-initial-index attribute
   *
   * @return {number}
   */
  public getCleanCurrentElement(): number {

    try {
      const childrenObject = this.element.templateHelper.childrenObject as [HTMLElement];

      if (childrenObject !== null && this.currentElement >= 0 && this.currentElement <= childrenObject.length - 1) {
        return parseFloat((childrenObject[this.currentElement] as HTMLElement).getAttribute('data-initial-index') + '' as string);
      }

      return 0;

    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  /**
   * Get the curent element index based on 0
   *
   * @return {number}
   */
  public getCleanCurrentElementIndex(): number {
    return this.getCleanCurrentElement();
  }


  /**
   * Select a specified item in the spinner
   *
   * @param {number} item
   * @return {void}
   */
  public selectTheItem(item: number): void {

    if (isNaN(item) === false) {
      const itemHeightValue = this.element.getItemHeightValue();
      const highlightOffset = this.element.getHighlightOffsetValue();

      this.direction = '';
      this.currentElement = item;
      this.currentYOffset = highlightOffset - (this.getCleanCurrentElementIndex() * itemHeightValue);

      this.moveTheList();
    }
  }

  /**
   *
   * @protected
   * @memberof Ch5SpinnerScroll
   * @return {void}
   */
  protected attachEventListeners(): void {

    try {
      this._mouseDownListener = this._onMouseDown.bind(this);
      this._mouseUpListener = this._onMouseUp.bind(this);
      this._mouseMoveListener = this._onMouseMove.bind(this);
      this._touchstartListener = this._onMouseDown.bind(this);
      this._toucheendUpListener = this._onMouseUp.bind(this);
      this._touchmoveListener = this._onMouseMove.bind(this);
      this._mouseLeaveListener = this._onMouseLeave.bind(this);
      this._touchendLeaveListener = this._onMouseLeave.bind(this);

      this.element.templateHelper.wrapperElement.addEventListener('mousedown', this._mouseDownListener, { passive: true });
      this.element.addEventListener('mouseup', this._mouseUpListener);
      this.element.addEventListener('mousemove', this._mouseMoveListener);

      this.element.templateHelper.wrapperElement.addEventListener('touchstart', this._touchstartListener, { passive: true });
      this.element.addEventListener('touchend', this._toucheendUpListener);
      this.element.addEventListener('touchmove', this._touchmoveListener, { passive: true });

      // reset on mouse leave
      this.element.addEventListener('mouseleave', this._mouseLeaveListener);
      this.element.addEventListener('touchend', this._touchendLeaveListener);

    } catch (e) {
      console.log('Adding listeners have problems', e);
    }
  }

  /**
   *
   * @protected
   * @memberof Ch5SpinnerScroll
   * @return {void}
   */
  protected detachEventListeners(): void {

    try {
      if (
        this.element.templateHelper instanceof Ch5SpinnerTemplate &&
        this.element.templateHelper.wrapperElement instanceof HTMLElement
      ) {

        this.element.templateHelper.wrapperElement.removeEventListener('mousedown', this._mouseDownListener);
        this.element.removeEventListener('mouseup', this._mouseUpListener);
        this.element.removeEventListener('mousemove', this._mouseMoveListener);

        this.element.templateHelper.wrapperElement.removeEventListener('touchstart', this._touchstartListener);
        this.element.removeEventListener('touchend', this._toucheendUpListener);
        this.element.removeEventListener('touchmove', this._touchmoveListener);

        // reset on mouse leave
        this.element.removeEventListener('mouseleave', this._mouseLeaveListener);
        this.element.removeEventListener('touchend', this._touchendLeaveListener);
      }
    } catch (e) {
      console.log('Removing listeners have problems', e)
    }
  }

  /**
   * @protected
   * @memberof Ch5SpinnerScroll
   * @return {void}
   */
  protected moveTheList(velocity: number = 1): void {

    if (velocity === 0) {
      velocity = 1;
    }

    if (this.direction === 'up') {
      this.currentYOffset += this.element.getItemHeightValue() * velocity;
      this.currentElement--;
      this.currentElement -= velocity - 1;
    } else if (this.direction === 'down') {
      this.currentYOffset -= this.element.getItemHeightValue() * velocity;
      this.currentElement++;
      this.currentElement += velocity - 1;
    }

    const yTranslate = this.currentYOffset + this.element.getItemHeightMeasurementUnit();

    if (this.element.templateHelper.scrollableArea instanceof HTMLElement) {
      this.element.templateHelper.scrollableArea.style.transition = "all .1s ease";
      this.element.templateHelper.scrollableArea.style.transform = "translate3d(0," + yTranslate + ",0)";
    }

    this.toggleActiveItem();
  }

  /**
   * @protected
   * @memberof Ch5SpinnerScroll
   * @return {string}
   */
  protected detectDirection(currentPosition: number): string {

    if (this.initialMousePos < currentPosition) {
      this.direction = 'up';
    } else {
      this.direction = 'down';
    }

    return this.direction;
  }

  /**
   * Trigger mousedown and touchdown events
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  private _onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.initialMousePos = this.getMousePosition(event).y;

    const visibleItemScroll = this.element.visibleItemScroll;
    const size = this.element.size;

    if (this.mouseVelocity.constructor !== Ch5MouseVelocity) {
      this.mouseVelocity = new Ch5MouseVelocity(visibleItemScroll / size);
    }

    this.mouseVelocity.start = {
      x: this.getMousePosition(event).y,
      y: this.getMousePosition(event).y,
      time: new Date()
    }

    if (this.readyToFocus === true) {
      this.element.eventsHelper.dispatchFocus();
      this.readyToFocus = false;
    }

    this.dragTimeout = window.setTimeout(() => {
      this.mouseDown = true;
      this.handleCursor('drag');
      this.element.templateHelper.toggleOverlay(true);
    }, 50);
  }

  /**
   * Send signals when spinner overflows
   *
   * @private
   * @memberof Ch5Spinner
   * @return {void}
   */
  private sendEventOnOverflow(): void {

    const _sendEventOnOverflow = this.element.sendEventOnOverflow;

    if (
      '' !== _sendEventOnOverflow &&
      null !== _sendEventOnOverflow &&
      undefined !== _sendEventOnOverflow
    ) {
      const sigClick = Ch5SignalFactory.getInstance()
        .getBooleanSignal(_sendEventOnOverflow);

      if (sigClick !== null) {
        sigClick.publish(true);
        sigClick.publish(false);
      }
    }
  }

  private sendEventOnUnderflow(): void {

    const _sendEventOnUnderflow = this.element.sendEventOnUnderflow;

    if (
      '' !== _sendEventOnUnderflow &&
      null !== _sendEventOnUnderflow &&
      undefined !== _sendEventOnUnderflow
    ) {
      const sigClick = Ch5SignalFactory.getInstance()
        .getBooleanSignal(_sendEventOnUnderflow);

      if (sigClick !== null) {
        sigClick.publish(true);
        sigClick.publish(false);
      }
    }
  }


  /**
   * Trigger mouseup, touchend events
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  private _onMouseUp(event: MouseEvent): void {

    this.mouseDown = false;
    this.handleCursor();
    this.element.templateHelper.toggleOverlay(false);

    window.clearTimeout(this.dragTimeout);
    this.element.dirtyTimeHandler();

    this.mouseVelocity.end = {
      x: event.pageX,
      y: event.pageY,
      time: new Date()
    }

    this.element.eventsHelper.dispatchBlur();
    this.readyToFocus = true;

    if (this.getCleanCurrentElementIndex() !== this.element.cleanItem) {
      if (this.element.dirtyFlag === false) {
        this.element.eventsHelper.dispatchDirty(this.getCleanCurrentElement() + '' as string);
        this.element.dirtyFlag = true;
      }

      this.element.eventsHelper.dispatchChange(this.getCleanCurrentElement() + '' as string);

    }

    if (this.element.feedbackMode === 'direct') {
      this.element.cleanItem = this.element.selectedValueIndex;
    }
  }

  /**
   * Trigger mousemove, touchmove events
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  private _onMouseMove(event: MouseEvent): void {

    const mouseYPos = this.getMousePosition(event).y;

    if (this.mouseDown === true) {
      if ((Math.abs(this.initialMousePos - mouseYPos)) >= this.element.selectedItem.getBoundingClientRect().height * 0.3) {
        this.detectDirection(mouseYPos);

        const size = this.element.size;
        const highlightSectionTopOffset = this.element.getHighlightOffsetValue();
        const itemHeightValue = (this.element as Ch5Spinner).getItemHeightValue();
        const childrenObject = (this.element.templateHelper as Ch5SpinnerTemplate).childrenObject as [HTMLElement];
        const endless = this.element.endless;

        let velocity: number = 1;
        let offset = Number(this.element.visibleItemScroll) <= Number(size) ? this.element.visibleItemScroll : size;

        if (offset < Number(this.element.visibleItemScroll) && this.element.endless) {
          offset = this.element.visibleItemScroll;
        }

        const minimumTopOffset = (Math.ceil(offset / 2) - 1) * itemHeightValue;
        const maximumTopOffset = -(childrenObject.length * itemHeightValue - (minimumTopOffset + itemHeightValue));

        this.mouseVelocity.end = {
          x: this.getMousePosition(event).x,
          y: this.getMousePosition(event).y,
          time: new Date()
        }
        if (
          endless === true &&
          this._isBoundary(this.currentYOffset, minimumTopOffset, maximumTopOffset) &&
          childrenObject !== null
        ) {

          if (this.direction === 'down') {
            this.currentElement = -1;
            this._forceMovingTheSpinner(highlightSectionTopOffset + itemHeightValue);
            window.clearTimeout(this._runTimeout);
            this._runTimeout = 0;
            this.sendEventOnOverflow();

          } else if (this.direction === 'up') {
            this.currentElement = childrenObject.length;
            this._forceMovingTheSpinner(maximumTopOffset - itemHeightValue);
            this.sendEventOnUnderflow();
          }

        }

        if (this._runTimeout === 0) {
          this._runTimeout = window.setTimeout(() => {

            if (this.mouseVelocity.getYSteps() > 1) {
              velocity = this._handleVelocity(this.mouseVelocity.getYSteps(), minimumTopOffset, maximumTopOffset);
            }

            if (!this._isBoundary(this.currentYOffset, minimumTopOffset, maximumTopOffset) || endless) {
              this.moveTheList(velocity);
            }

            window.clearTimeout(this._runTimeout);
            this._runTimeout = 0;
          }, 50);
        }

        this.initialMousePos = mouseYPos;
      }
    }
  }

  /**
   * When step is calculated with velocity the number of steps
   * can be greater than the actual size of the spinner element
   * This method will ensure that the spinner will not overflow because
   * of velocity
   *
   * @param {number} velocity
   * @param {number} minimumTopOffset
   * @param {number} maximumTopOffset
   * @return {number}
   */
  private _handleVelocity(velocity: number, minimumTopOffset: number, maximumTopOffset: number): number {

    let offsetWithVelocity;
    if (this.direction === 'up') {
      offsetWithVelocity = this.currentYOffset + (this.element.getItemHeightValue() * velocity);
    } else {
      offsetWithVelocity = this.currentYOffset - (this.element.getItemHeightValue() * velocity);
    }

    if (this._isBoundary(offsetWithVelocity, minimumTopOffset, maximumTopOffset) &&
      velocity > 0
    ) {
      return this._handleVelocity(--velocity, minimumTopOffset, maximumTopOffset);
    }

    return velocity;
  }

  /**
   * Translate the spinner to a specific Y coordinate
   *
   * @param {number} position
   */
  private _forceMovingTheSpinner(position: number) {
    this.currentYOffset = position;
    this.element.templateHelper.scrollableArea.setAttribute(
      'style', 'transition: all 0s ease; transform: translate3d(0px,' + this.currentYOffset + this.element.getItemHeightMeasurementUnit() + ',0px)')
  }

  /**
   * Check if the currentOffset hits the edge
   *
   * @param {number} currentOffset
   * @param {number} minimumTopOffset
   * @param {number} maximumTopOffset
   * @return {boolean | string}
   */
  private _isBoundary(currentOffset: number, minimumTopOffset: number, maximumTopOffset: number): (boolean | string) {

    if (
      this.direction === 'up' &&
      currentOffset < minimumTopOffset ||
      this.direction === 'down' &&
      currentOffset > maximumTopOffset
    ) {
      return false;
    }

    return true;
  }

  /**
   * Trigger mouseleave event. Used to reset the things when
   * user leaves the component container
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  private _onMouseLeave(event: MouseEvent): void {
    if (this.mouseDown === true) {
      this.mouseDown = false;
    }

  }

  private getMousePosition(event: MouseEvent | TouchEvent) {

    const mousePosition = {
      x: 0,
      y: 0
    }

    if (
      (typeof TouchEvent !== "undefined" && TouchEvent !== null) &&
      event.constructor === TouchEvent
    ) {
      const touch: Touch = (event as TouchEvent).touches[0] as Touch;

      mousePosition.x = touch.clientX;
      mousePosition.y = touch.clientY;
    } else {
      mousePosition.x = (event as MouseEvent).clientX;
      mousePosition.y = (event as MouseEvent).clientY;
    }

    return mousePosition;
  }

  /**
   * Handle the cursor type, when user has to drag show a different cursor
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @param {string} action
   */
  private handleCursor(action: string = 'click') {

    if (action === 'click') {
      this.element.templateHelper.wrapperElement.style.cursor = 'pointer';
    } else if (action === 'drag') {
      this.element.templateHelper.wrapperElement.style.cursor = 'grabbing';
    }
  }

  /**
   *
   */
  private toggleActiveItem() {

    this.element.templateHelper.setActiveItem(this.currentElement);
  }
}

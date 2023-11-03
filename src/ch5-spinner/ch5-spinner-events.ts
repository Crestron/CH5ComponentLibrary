// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import isNull from 'lodash/isNull';
import { Ch5SignalFactory } from '../ch5-core';
import { Ch5Spinner } from './ch5-spinner';
import HtmlCallback from '../ch5-common/utils/html-callback';
import { Ch5Common } from '../ch5-common/ch5-common';

export class Ch5SpinnerEvents {

  /**
   * @protected
   * @memberof Ch5SpinnerEvents
   * @type {Ch5Spinner}
   */
  protected _element: Ch5Spinner = {} as Ch5Spinner;

  constructor(element: Ch5Spinner) {
    this.element = element;
  }

  public set element(element: Ch5Spinner) {
    if (element !== undefined && element !== null) {
      this._element = element;
    }
  }
  public get element(): Ch5Spinner {
    return this._element
  }

  /**
   * Dispatch the focus event 
   * @return {void} 
   */
  public dispatchFocus(): void {
    const sendEventOnFocus = this.element.sendEventOnFocus;
    if (Ch5Common.isNotNil(sendEventOnFocus)) {
      const sigFocus = Ch5SignalFactory.getInstance().getBooleanSignal(this.element.sendEventOnFocus);
      if (sigFocus !== null) {
        sigFocus.publish(true);
      }
    }
    this.dispatch('focus');
  }

  /**
   * Dispatch the blur event
   * @return {void}
   */
  public dispatchBlur(): void {
    const sendEventOnFocus = this.element.sendEventOnFocus;
    if (Ch5Common.isNotNil(sendEventOnFocus)) {
      const sigFocus = Ch5SignalFactory.getInstance().getBooleanSignal(sendEventOnFocus);
      if (!isNull(sigFocus)) {
        sigFocus.publish(false);
      }
    }

    this.dispatch('blur');
  }

  /**
   * Dispatch the change event
   * 
   * @param {string} message
   * @return {void} 
   */
  public dispatchChange(message: string): void {

    const sendEventOnChange = this.element.sendEventOnChange;

    if (this.element.feedbackMode === 'direct') {
      if ('' !== sendEventOnChange && null !== sendEventOnChange && undefined !== sendEventOnChange) {
        const sigClick = Ch5SignalFactory.getInstance()
          .getNumberSignal(this.element.sendEventOnChange);

        if (sigClick !== null) {
          sigClick.publish(parseFloat(message));
        }
      }
    }

    this.dispatch('change', message);
  }

  /**
   * Dispatch dirty event 
   * 
   * @param {string} message
   * @return {void} 
   */
  public dispatchDirty(message: string): void {
    const dirtyCustomEvent = this.dispatch('dirty', message, false);

    if (this.element.ondirty instanceof HtmlCallback) {
      this.element.ondirty.run(dirtyCustomEvent);
    } else if (this.element.ondirty instanceof Function) {
      this.element.ondirty.call(this.element, dirtyCustomEvent);
    }
  }

  /**
   * Dispatch clean event
   * 
   * @return {void}
   */
  public dispatchClean(): void {
    const cleanCustomEvent = this.dispatch('clean');

    if (this.element.onclean instanceof HtmlCallback) {
      this.element.onclean.run(cleanCustomEvent);
    } else if (this.element.onclean instanceof Function) {
      this.element.onclean.call(this.element, cleanCustomEvent);
    }
  }

  /**
   * Dispatch the event
   * 
   * @param {string} eventName 
   * @param {string} message 
   * @return {void}
   */
  protected dispatch(eventName: string, message: string = '', cancelable: boolean = true): CustomEvent {
    const event = this.createEvent(eventName, message, cancelable);
    this.element.dispatchEvent(event);
    return event;
  }

  /**
   * 
   * @param {string} eventName 
   * @param {string} message 
   * @param {boolean} cancelable
   * @return {CustomEvent}
   */
  protected createEvent(eventName: string, message: string, cancelable: boolean = true): CustomEvent {

    const event = new CustomEvent(eventName, {
      detail: {
        data: message
      },
      bubbles: true,
      cancelable
    });

    return event;
  }

  /**
   * Dispatch the mouseup event
   * @return {void}
   */
  public dispatchMouseUp(): void {
    this.dispatch('mouseup');
  }

  /**
   * Dispatch the mouseup event
   * @return {void}
   */
  public dispatchTouchEnd(): void {
    this.dispatch('touchend');
  }
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import {
  Ch5Debug,
  Ch5Platform,
  ICh5PlatformInfo,
  Ch5Signal,
  Ch5SignalFactory,
  publishEvent
} from "../ch5-core";

export enum Ch5TouchActivitySignals {
  CsigTime = "Csig.Time",
  CsigResetActivityTimer = "Csig.Reset_Activity_Timer",
  CsigTouchActivity = "Csig.Touch_Activity"
}

export class Ch5TouchActivity {

  private static _instance: Ch5TouchActivity;

  /**
   * Instance of Ch5SignalFactory for creating the
   * CSIG_TIME and CSIG_RESET_ACTIVITY_TIMER signals.
   */
  private readonly _ch5SignalFactory: Ch5SignalFactory;

  /**
   * Signal for CSIG_TIME.
   * Will be null if _supportsTouchActivity is true.
   */
  private _ch5TimeSignal: Ch5Signal<number> | null = null;

  /**
   * Signal for CSIG_RESET_ACTIVITY_TIMER.
   * Will be null if _supportsTouchActivity is true.
   */
  private _ch5ResetActivityTimerSignal: Ch5Signal<boolean> | null = null;

  /**
   * Used for getting the current platform information,
   * to set the supportsTouchActivity flag.
   */
  private _ch5Platform: Ch5Platform;

  /**
   * Based on this flag, we know whether the firmware supports touch activity.
   * In case it doesn't, the class will handle the signal updates for this.
   */
  private _supportsTouchActivity: boolean = true;

  /**
   * The number of seconds after which to wait for the last user activity.
   */
  private _touchInactivityPeriod: number = 0;

  /**
   * Timeout ID given for the touch activity false publish method.
   */
  private _touchActivityTimeoutId: number = 0;

  private constructor(ch5SignalFactory: Ch5SignalFactory, ch5Platform: Ch5Platform) {
    this._ch5SignalFactory = ch5SignalFactory;
    this._ch5Platform = ch5Platform;

    this._onTouchStart = this._onTouchStart.bind(this);
    document.addEventListener('touchstart', this._onTouchStart);
    this._onTouchMove = this._onTouchMove.bind(this);
    document.addEventListener('touchmove', this._onTouchMove);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    document.addEventListener('touchend', this._onTouchEnd);
    this._onTouchCancel = this._onTouchCancel.bind(this);
    document.addEventListener('touchcancel', this._onTouchCancel);
  }

  /**
   * Returns the Ch5TouchActivity instance.
   *
   * @param {Ch5SignalFactory} ch5SignalFactory - optional instance of signal factory
   * @param {Ch5Platform} ch5Platform - optional instance of platform
   *
   * @return {Ch5TouchActivity}
   */
  public static getInstance(ch5SignalFactory?: Ch5SignalFactory, ch5Platform?: Ch5Platform): Ch5TouchActivity {
    if (isNil(this._instance)) {
      if (isNil(ch5Platform)) {
        ch5Platform = Ch5Platform.getInstance();
      }

      if (isNil(ch5SignalFactory)) {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
      }

      this._instance = new Ch5TouchActivity(ch5SignalFactory, ch5Platform);
    }
    return this._instance;
  }

  /**
   * Initializes the Ch5TouchActivity instance for receiving the platform info.
   */
  public init(): void {
    this.setSupportsTouchActivity(this._ch5Platform.getPlatformInfo());
    this._ch5Platform.registerUpdateCallback((platformInfo: ICh5PlatformInfo) => {
      this.setSupportsTouchActivity(platformInfo);

      // we need to subscribe to the signals only when the platform does not support touch activity
      if (!this._supportsTouchActivity) {
        const {CsigTime, CsigResetActivityTimer} = Ch5TouchActivitySignals;
        Ch5Debug.info('Ch5TouchActivity', `No support for touch activity, subscribing to ${CsigTime} and ${CsigResetActivityTimer}`);
        this.subscribeToTimeSignal();
        this.subscribeToResetActivityTimerSignal();
      } else {
        Ch5Debug.info('Ch5TouchActivity', `Touch activity is supported`);
      }
    });
  }

  private setSupportsTouchActivity(ch5PlatformInfo: ICh5PlatformInfo) {
    this._supportsTouchActivity = !isNil(ch5PlatformInfo.capabilities) && ch5PlatformInfo.capabilities.supportsTouchActivity;
  }

  private subscribeToTimeSignal(): void {
    this._ch5TimeSignal = this._ch5SignalFactory.getNumberSignal(Ch5TouchActivitySignals.CsigTime, true);

    if (!isNil(this._ch5TimeSignal)) {
      this._ch5TimeSignal.subscribe((time: number) => {
        Ch5Debug.info('Ch5TouchActivity', `CSIG_TIME: ${time}`);
        this._touchInactivityPeriod = time;
        this.clearTouchInactivityTimeout();
        this.setTouchInactivityTimeout();
      });
    }
  }

  private subscribeToResetActivityTimerSignal(): void {
    this._ch5ResetActivityTimerSignal = this._ch5SignalFactory.getBooleanSignal(Ch5TouchActivitySignals.CsigResetActivityTimer, true);

    if (!isNil(this._ch5ResetActivityTimerSignal)) {
      this._ch5ResetActivityTimerSignal.subscribe((reset: boolean) => {
        Ch5Debug.info('Ch5TouchActivity', `CSIG_RESET_ACTIVITY_TIMER: ${reset}`);

        if (reset) {
          this.clearTouchInactivityTimeout();
          this.publishTouchActivityEvent(false);
          this.setTouchInactivityTimeout();
        }
      });
    }
  }

  private _onTouchStart(event: Event): void {
    Ch5Debug.info('Ch5TouchActivity', `_onTouchStart(${event.type})`);
    this.clearTouchInactivityTimeout();
    this.publishTouchActivity();
  }

  private _onTouchMove(event: Event): void {
    Ch5Debug.info('Ch5TouchActivity', `_onTouchMove(${event.type})`);
    this.clearTouchInactivityTimeout();
    this.publishTouchActivity();
  }

  private _onTouchEnd(event: Event): void {
    Ch5Debug.info('Ch5TouchActivity', `_onTouchEnd(${event.type})`);
    this.clearTouchInactivityTimeout();
    this.setTouchInactivityTimeout();
    this.publishTouchActivity();
  }

  private _onTouchCancel(event: Event): void {
    Ch5Debug.info('Ch5TouchActivity', `_onTouchCancel(${event.type})`);
    this.clearTouchInactivityTimeout();
    this.setTouchInactivityTimeout();
    this.publishTouchActivity();
  }

  private publishTouchActivity(): void {
    if (this._touchInactivityPeriod <= 0) {
      return;
    }

    Ch5Debug.info('Ch5TouchActivity', `Publish touch activity with true`);
    this.publishTouchActivityEvent(true);
  }

  private setTouchInactivityTimeout(): void {
    if (this._touchInactivityPeriod <= 0) {
      return;
    }

    Ch5Debug.info('Ch5TouchActivity', `Publish touch activity with false after ${this._touchInactivityPeriod}s`);
    this._touchActivityTimeoutId = window.setTimeout(() => {
      this.clearTouchInactivityTimeout();
      this.publishTouchActivityEvent(false);
    }, this._touchInactivityPeriod * 1000);
  }

  private clearTouchInactivityTimeout(): void {
    if (!isNil(this._touchActivityTimeoutId)) {
      window.clearTimeout(this._touchActivityTimeoutId);
    }
  }

  private publishTouchActivityEvent(touchActivityFlag: boolean): void {
    Ch5Debug.info('Ch5TouchActivity', `CSIG_TOUCH_ACTIVITY: ${touchActivityFlag}`);
    publishEvent('boolean', Ch5TouchActivitySignals.CsigTouchActivity, touchActivityFlag);
  }
}

Ch5TouchActivity.getInstance().init();

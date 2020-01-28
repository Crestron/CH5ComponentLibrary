// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Ch5Signal } from "./ch5-signal";
import { Ch5SignalFactory } from "./ch5-signal-factory";
import { ICh5PlatformInfo } from "./types/ch5-platform-info";

/**
 * The method signature is used for registering callback function with the Ch5Platform.registerUpdateCallback() method.
 * Ch5Platform will call it after it receives the signal with the platform information.
 */
export type ICh5PlatformUpdateCallback = (platformInfo: ICh5PlatformInfo) => void;

export class Ch5Platform {

  private static readonly CSIG_PLATFORM_INFO: string = "Csig.Platform_Info";

  private static _instance: Ch5Platform;

  private readonly _ch5PlatformInfoSignal: Ch5Signal<object> | null;

  /**
   * Holds the information about the device and container app
   * on which the CH5 app runs.
   *
   * The information is structured based on ICh5PlatformInfo.
   */
  private _ch5PlatformInfo: ICh5PlatformInfo;

  /**
   * List of functions to call after we receive the platform info signal update.
   */
  private _updateCallbacks: ICh5PlatformUpdateCallback[];

  private constructor(ch5SignalFactory: Ch5SignalFactory) {
    this._ch5PlatformInfoSignal = ch5SignalFactory.getObjectSignal(Ch5Platform.CSIG_PLATFORM_INFO, true);
    this._ch5PlatformInfo = {
      capabilities: {
        supportsTouchActivity: true,
        supportCredentialIntercept: {
          http: '',
          https: '',
        }
      },
      version: '',
      name: '',
    } as ICh5PlatformInfo;
    this._updateCallbacks = new Array<ICh5PlatformUpdateCallback>();
  }

  /**
   * Returns the Ch5Platform instance.
   *
   * @param {Ch5SignalFactory} ch5SignalFactory - optional instance for signal factory
   *
   * @return {Ch5Platform}
   */
  public static getInstance(ch5SignalFactory?: Ch5SignalFactory): Ch5Platform {
    if (isNil(this._instance)) {
      if (isNil(ch5SignalFactory)) {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
      }

      this._instance = new Ch5Platform(ch5SignalFactory);
    }
    return this._instance;
  }

  /**
   * Initializes the Ch5Platform instance for receiving the platform info.
   */
  public init(): void {
    if (isNil(this._ch5PlatformInfoSignal)) {
      return;
    }

    this._ch5PlatformInfoSignal.subscribe((platformInfo: object) => {

      if (isNil(platformInfo) || Object.keys(platformInfo).length === 0) {
        return;
      }

      if (!Object.isFrozen(this._ch5PlatformInfo))
      {
        const ch5PlatformInfo = platformInfo as ICh5PlatformInfo;
        this._ch5PlatformInfo = Object.freeze(ch5PlatformInfo);
      }

      this._updateCallbacks.forEach(callback => {
        callback(this._ch5PlatformInfo);
      });
    });
  }

  /**
   * Register update callback when the platform information is received.
   *
   * @param {ICh5PlatformUpdateCallback} callback - function called on platform signal update
   */
  public registerUpdateCallback(callback: ICh5PlatformUpdateCallback): void {
    callback(this._ch5PlatformInfo);
    this._updateCallbacks.push(callback);
  }

  /**
   * Returns the current platform information.
   *
   * @return {ICh5PlatformInfo}
   */
  public getPlatformInfo(): ICh5PlatformInfo {
    return this._ch5PlatformInfo;
  }
}

Ch5Platform.getInstance().init();

// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Debug } from "../ch5-core";

export class Ch5CommonLog {

  constructor(public isDebugEnabled: boolean, public crId: string = "") { }

  public start(message: string, componentName: string = "") {
    if (this.isDebugEnabled === true) {
      console.group((componentName !== "" ? componentName + " " : "") + message);
    }
  }

  /**
   * Helper method.
   * Allows writing debug/info messages using the console.
   * The messages are displayed only if _isDebugEnabled is true
   */
  public log(...message: any[]): void {
    if (true === this.isDebugEnabled) {
      let ts: string = '';
      if (Ch5Debug.CONSOLE_OVERRIDDEN === false) {
        ts = (new Date()).toISOString();
      }
      try {
        let callerName: string = String(new Error().stack).trim();
        if (callerName !== null) {
          if (callerName) { callerName = callerName.replace(/^Error\s+/, ''); }
          if (callerName) { callerName = callerName.split("\n")[1]; } // 1st item is this, 2nd item is caller
          if (callerName) { callerName = callerName.replace(/^\s+at Object./, ''); }
          if (callerName) { callerName = callerName.replace(/^\s+at HTMLElement./, ''); }
          if (callerName) { callerName = callerName.replace(/^\s+at /, ''); }
          if (callerName) { callerName = callerName.replace(/ \(.+\)$/, ''); }
          if (callerName) { callerName = callerName.replace(/\@.+/, ''); }
          if (callerName && callerName !== "") {
            callerName = "Method is " + callerName + ":";
          }
        }
        console.info(ts + ':' + this.crId + ':' + callerName + ':', message);
      } catch (e) {
        console.info(ts + ':' + this.crId + ':', message);
      }
    }
  }

  public stop() {
    if (this.isDebugEnabled === true) {
      console.groupEnd();
    }
  }

}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { subscribeState } from "../ch5-core/utility-functions/subscribe-signal";
import { publishEvent } from "../ch5-core/utility-functions/publish-signal";

enum Ch5HeartbeateSignals {
    CsigHeatbeatRequest  = "Csig.HeartbeatRequest",
    CsigHeatbeatResponse = "Csig.HeartbeatResponse"
}

export class Ch5Heartbeats {

  private static _instance: Ch5Heartbeats;

  private _heartbeatRequestSub: string;

  /**
   * Creates the instance
   */
  private constructor() {
    // console.log('Created singleton instance of Ch5Heartbeats');
    this._heartbeatRequestSub = subscribeState('object', 
        Ch5HeartbeateSignals.CsigHeatbeatRequest,
        (value:object) => {
            // console.log('received heartbeat request:' + JSON.stringify(value));
            publishEvent('object', Ch5HeartbeateSignals.CsigHeatbeatResponse, value);
        });
  }

  /**
   * Returns the Ch5Heatbeats instance.
   *
   * @return {Ch5Heartbeats}
   */
  public static getInstance(): Ch5Heartbeats {
    if (isNil(this._instance)) {
      this._instance = new Ch5Heartbeats();
    }
    return this._instance;
  }

}

Ch5Heartbeats.getInstance();

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ISigComSendToNative, ISigComSubscribe, ISigComUnsubscribe, ISigComSendWebkit } from './../interfaces-sig-com';

declare var JSInterface: ISigComUnsubscribe & ISigComSubscribe & ISigComSendToNative;
declare var webkit: ISigComSendWebkit;

/**
 * Returns if the touch screen is a Crestron device
 */
export function isCrestronTouchscreen() {
    if (window.navigator.userAgent.toLowerCase().includes("crestron")) {
        return true;
    }
    if (typeof(JSInterface) !== "undefined" && typeof(JSInterface.bridgeSendBooleanToNative) !== "undefined") {
        return true;
    }
    if (typeof(webkit) !== "undefined" && typeof(webkit.messageHandlers) !== "undefined" 
        && typeof(webkit.messageHandlers.bridgeSendBooleanToNative) !== "undefined") {
        return true;
    }
    return false;
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TSignalNonStandardTypeName } from "../core";
import { Ch5SignalFactory } from "../ch5-signal-factory";
import { Ch5Signal } from "../ch5-signal";
import {
    Ch5SignalErrorCallback,
    Ch5SignalUpdateCallback,
    TAllSignalSubscriptionUpdateCallbacks
} from "../types/callbacks";
import { isNil } from 'lodash';


/**
 * Utility function that subscribes to a signal
 * Returns the a string representing the subscriptionId.
 * Note: Can return an empty string.
 */
export function subscribeState(signalType: TSignalNonStandardTypeName, signalName: string,
                               callback: TAllSignalSubscriptionUpdateCallbacks,
                               errCallback?: Ch5SignalErrorCallback): string {
    /** The tslint comments provide a double purpose: to disable the linting error and to signal that the fallthrough was
     * intentional
     */
    const csf = Ch5SignalFactory.getInstance();
    let subId: string = '';
    
    // check for join number signal name and append prefix if needed (ex: 200 => fb200, test22 => test22)
    signalName = Ch5Signal.getSubscriptionSignalName(signalName);
    
    switch (signalType.toLowerCase()) {
        case 'b': // tslint:disable-line:no-switch-case-fall-through
        case 'boolean':
            const bSig = csf.getBooleanSignal(signalName);
            if (!isNil(bSig)) {
                subId = bSig.subscribe(callback as Ch5SignalUpdateCallback<boolean>,
                    errCallback as Ch5SignalUpdateCallback<boolean>);
            }
            break;
        case 'n': // tslint:disable-line:no-switch-case-fall-through
        case 'number': // tslint:disable-line:no-switch-case-fall-through
        case 'numeric':
            const nSig = csf.getNumberSignal(signalName);
            if (!isNil(nSig)) {
                subId = nSig.subscribe(callback as Ch5SignalUpdateCallback<number>,
                    errCallback as Ch5SignalUpdateCallback<number>);
            }
            break;
        case 's': // tslint:disable-line:no-switch-case-fall-through
        case 'string':
            const sSig = csf.getStringSignal(signalName);
            if (!isNil(sSig)) {
                subId = sSig.subscribe(callback as Ch5SignalUpdateCallback<string>,
                    errCallback as Ch5SignalUpdateCallback<string>);
            }
            break;
        case 'o': // tslint:disable-line:no-switch-case-fall-through
        case 'object':
            const oSig = csf.getObjectSignal(signalName);
            if (!isNil(oSig)) {
                subId = oSig.subscribe(callback as Ch5SignalUpdateCallback<object>,
                    errCallback as Ch5SignalUpdateCallback<object>);
            }
            break;
        default:
            if (!isNil(errCallback)) {
                errCallback(`Signal: ${signalName}, has unsupported type: ${signalType}`);
            }
    }
    return subId;
}

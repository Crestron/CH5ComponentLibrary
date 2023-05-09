// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {TSignalNonStandardTypeName, TSignalValue} from "../types/core";
import {Ch5SignalFactory} from "../ch5-signal-factory";

/**
 * Utility function that publishes a signal value
 */
export function publishEvent(signalType:TSignalNonStandardTypeName, signalName:string, value:TSignalValue):void {
    /** The tslint comments provide a double purpose: to disable the linting error and to signal that the fallthrough was
     * intentional
     */
    const csf = Ch5SignalFactory.getInstance();

    switch (signalType.toLowerCase()) {
        case 'b': // tslint:disable-line:no-switch-case-fall-through
        case 'boolean':
            const bSig = csf.getBooleanSignal(signalName);
            if ( null !== bSig ) {
                bSig.publish(value as boolean);
            }
            break;
        case 'n': // tslint:disable-line:no-switch-case-fall-through
        case 'number': // tslint:disable-line:no-switch-case-fall-through
        case 'numeric':
            const nSig = csf.getNumberSignal(signalName);
            if ( null !== nSig ){
                nSig.publish(value as number);
            }
            break;
        case 's': // tslint:disable-line:no-switch-case-fall-through
        case 'string':
            const sSig = csf.getStringSignal(signalName);
            if ( null !== sSig){
                sSig.publish(value as string);
            }
            break;
        case 'o': // tslint:disable-line:no-switch-case-fall-through
        case 'object':
            const oSig = csf.getObjectSignal(signalName);
            if ( null !== oSig ) {
                oSig.publish(value as object);
            }
            break;
    }
}

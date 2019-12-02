// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {TSignalNonStandardTypeName, TSignalValue} from "../core";
import {Ch5SignalFactory} from "../ch5-signal-factory";
import {Ch5Signal} from "../ch5-signal";

/**
 * Utility function that returns the current value of a signal, or a default value.
 */
export function getState(signalType:TSignalNonStandardTypeName, signalName:string, defaultValue?:TSignalValue):TSignalValue|null {
    /** The tslint comments provide a double purpose: to disable the linting error and to signal that the fallthrough was
     * intentional
     */
    let sigVal:TSignalValue|null = null;

    switch (signalType.toLowerCase()) {
        case 'b': // tslint:disable-line:no-switch-case-fall-through
        case 'boolean':
            if (typeof defaultValue !== 'undefined') {
                sigVal = getBooleanSignalValue(signalName, defaultValue as boolean);
            } else {
                sigVal = getBooleanSignalValue(signalName);
            }
            break;
        case 'n': // tslint:disable-line:no-switch-case-fall-through
        case 'number': // tslint:disable-line:no-switch-case-fall-through
        case 'numeric':
            if (typeof defaultValue !== 'undefined') {
                sigVal = getNumericSignalValue(signalName, defaultValue as number);
            } else {
                sigVal = getNumericSignalValue(signalName);
            }
            break;
        case 's': // tslint:disable-line:no-switch-case-fall-through
        case 'string':
            if (typeof defaultValue !== 'undefined') {
                sigVal = getStringSignalValue(signalName, defaultValue as string);
            } else {
                sigVal = getStringSignalValue(signalName);
            }
            break;
        case 'o': // tslint:disable-line:no-switch-case-fall-through
        case 'object':
            if (typeof defaultValue !== 'undefined') {
                sigVal = getObjectSignalValue(signalName, defaultValue as object);
            } else {
                sigVal = getObjectSignalValue(signalName);
            }
            break;
    }

    return sigVal;
}

/**
 * Utility function that returns the value of a boolean signal
 *
 * If the signal does not exist or has not been changed it returns null (or the value contained in the defaultValue param)
 */
export function getBooleanSignalValue(signalName:string, defaultValue?:boolean):boolean|null {
    const csf = Ch5SignalFactory.getInstance();

    let retVal: boolean|null = null;

    if (typeof defaultValue !== "undefined"
        && null !== defaultValue) {
        retVal = defaultValue;
    }

    // augment signal name in case of join numbers
    signalName = Ch5Signal.getSubscriptionSignalName(signalName);

    const booleanSig = csf.getBooleanSignal(signalName, false);
    if (null !== booleanSig && booleanSig.hasChangedSinceInit()) {
        retVal = booleanSig.value;
    }

    return retVal;
}

/**
 * Utility function that returns the value of a numeric/number signal
 *
 * If the signal does not exist or has not been changed it returns null (or the value contained in the defaultValue param)
 */
export function getNumericSignalValue(signalName: string, defaultValue?: number): number|null {
    const csf = Ch5SignalFactory.getInstance();

    let retVal: number|null = null;

    if (typeof defaultValue !== "undefined"
        && null !== defaultValue) {
        retVal = defaultValue;
    }

    // augment signal name in case of join numbers
    signalName = Ch5Signal.getSubscriptionSignalName(signalName);

    const numberSig = csf.getNumberSignal(signalName, false);
    if (null !== numberSig && numberSig.hasChangedSinceInit()) {
        retVal = numberSig.value;
    }

    return retVal;
}

/**
 * Utility function that returns the value of a string signal
 *
 * If the signal does not exist or has not been changed it returns null (or the value contained in the defaultValue param)
 */
export function getStringSignalValue(signalName: string, defaultValue?: string): string|null {
    const csf = Ch5SignalFactory.getInstance();

    let retVal: string|null = null;

    if (typeof defaultValue !== "undefined"
        && null !== defaultValue) {
        retVal = defaultValue;
    }

    // augment signal name in case of join numbers
    signalName = Ch5Signal.getSubscriptionSignalName(signalName);

    const stringSig = csf.getStringSignal(signalName, false);

    if (null !== stringSig && stringSig.hasChangedSinceInit()) {
        retVal = stringSig.value;
    }

    return retVal;
}

/**
 * Utility function that returns the value of an object signal
 *
 * If the signal does not exist or has not been changed it returns null (or the value contained in the defaultValue param)
 */
export function getObjectSignalValue(signalName: string, defaultValue?: object): object|null {
    const csf = Ch5SignalFactory.getInstance();

    let retVal: object|null = null;

    if (typeof defaultValue !== "undefined"
        && null !== defaultValue) {
        retVal = defaultValue;
    }

    // augment signal name in case of join numbers
    signalName = Ch5Signal.getSubscriptionSignalName(signalName);

    const objSig = csf.getObjectSignal(signalName, false);

    if (null !== objSig && objSig.hasChangedSinceInit()) {
        retVal = objSig.value;
    }

    return retVal;
}

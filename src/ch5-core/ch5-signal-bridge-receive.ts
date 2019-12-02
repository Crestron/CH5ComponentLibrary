// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {Ch5SignalFactory} from './ch5-signal-factory';
import {Ch5Debug} from "./ch5-debug";
import {Ch5Signal} from "./ch5-signal";

export type Ch5RcbSimpleObject = {
    'rcb':{
        'value':number, // integer value
        'time':number   // timestamp
    }
}

export type Ch5RcbExtendedObject={
    'rcb':{
        'value':number,  // integer value
        'time':number,   // timestamp
        'startv':number, // starting value
        'startt':number  // starting timestamp
    }
}

export type Ch5RcbObject = Ch5RcbSimpleObject | Ch5RcbExtendedObject;

type TCh5RcbIntervalTimersHashTable = {
    [signalName: string]: number
}
type TCh5RcbTimersHashTable = {
    [signalName: string]: number
}

const rcbIntervalTimers = {} as TCh5RcbIntervalTimersHashTable;
const rcbTimers = {} as TCh5RcbTimersHashTable;
const RCB_INTERVAL_DURATION_MS = 100;

export function bridgeReceiveIntegerFromNative(signalName: string, value: number): void {
    // Check for join number signal state name
    const _signalName: string = Ch5Signal.getSubscriptionSignalName(signalName);

    const dbgKey = 'bridgeReceiveIntegerFromNative';
    Ch5Debug.info(dbgKey,'"' + _signalName + '":' + value);

    clearTimersForSignal(_signalName);

    const s = Ch5SignalFactory.getInstance().getNumberSignal(_signalName);
    if (s !== null) {
        s.fromSignalBridge(value);
    }

    const o = Ch5SignalFactory.getInstance().getObjectSignal(_signalName);
    const obj:Ch5RcbSimpleObject = {'rcb':{'value':value,'time':0}};
    // Ch5Debug.info(dbgKey,' additional rcb signal ', 'signalName ' +signalName, ' value ',obj);
    if (o !== null){
        o.fromSignalBridge(obj);
    }
    // Ch5Debug.info(dbgKey,' end ');
}

export function bridgeReceiveBooleanFromNative(signalName: string, value: boolean): void {
    // Check for join number signal state name
    const _signalName: string = Ch5Signal.getSubscriptionSignalName(signalName);

    const dbgKey = 'bridgeReceiveBooleanFromNative';
    Ch5Debug.info(dbgKey,'"' + _signalName + '":' + value);

    const s = Ch5SignalFactory.getInstance().getBooleanSignal(_signalName);
    if (s !== null) {
        s.fromSignalBridge(value);
    }
    // Ch5Debug.info(dbgKey,' end ');
}

export function bridgeReceiveStringFromNative(signalName: string, value: string): void {
    // Check for join number signal state name
    const _signalName: string = Ch5Signal.getSubscriptionSignalName(signalName);

    const dbgKey = 'bridgeReceiveStringFromNative';
    Ch5Debug.info(dbgKey,'"' + _signalName + '":"' + value + '"');

    const s = Ch5SignalFactory.getInstance().getStringSignal(_signalName);
    if (s !== null) {
        s.fromSignalBridge(value);
    }
    // Ch5Debug.info(dbgKey,' end ');
}

export function bridgeReceiveObjectFromNative(signalName: string, value: object): void {
    // Check for join number signal state name
    const _signalName: string = Ch5Signal.getSubscriptionSignalName(signalName);

    const dbgKey = 'bridgeReceiveObjectFromNative';
    if (Ch5Debug.shouldDisplay(dbgKey)) {
        Ch5Debug.info(dbgKey,'"' + _signalName + '":\'' + JSON.stringify(value) + '\'');
    }
    const s = Ch5SignalFactory.getInstance().getObjectSignal(_signalName);
    if (s !== null) {
        if (isRcbObject(value)) {
            let scalarValue = 0;
            const n = Ch5SignalFactory.getInstance().getNumberSignal(_signalName);
            if (n !== null){
                scalarValue = n.value;
            }
            s.fromSignalBridge(processReceivedRcb(_signalName, value as Ch5RcbSimpleObject, scalarValue));
        } else {
            s.fromSignalBridge(value);
        }
    }
    // Ch5Debug.info(dbgKey,' end ');
}


function isRcbObject(obj: any):boolean {
    return (obj.hasOwnProperty('rcb')
        && obj.rcb.hasOwnProperty('value')
        && obj.rcb.hasOwnProperty('time'));
}

/**
 * This function processes an RCB
 */
function processReceivedRcb(signalName:string, rcbObj:Ch5RcbSimpleObject, currentScalarValue:number):Ch5RcbExtendedObject {
    const dbgKey = 'bridge.processReceivedRcb';
    Ch5Debug.info(dbgKey,' process rcb ', 'signalName ' + signalName, ' rcbObject ',rcbObj, ' current scalar value', currentScalarValue);
    clearTimersForSignal(signalName);
    const rcbObject:Ch5RcbExtendedObject = {
        'rcb':{
            'value': rcbObj.rcb.value,
            'time': rcbObj.rcb.time,
            'startv': currentScalarValue,
            'startt': Date.now()
        }
    };
    const timerId = window.setTimeout(rcbTimerCallback, rcbObj.rcb.time, signalName, rcbObject);
    rcbTimers[signalName] = timerId;
    if (RCB_INTERVAL_DURATION_MS < rcbObj.rcb.time) {
        const intervalId = window.setInterval(rcbIntervalTimerCallback, RCB_INTERVAL_DURATION_MS, signalName, rcbObject);
        rcbIntervalTimers[signalName] = intervalId;
    }

    return rcbObject;
}

/**
 * This function is used as a callback for the interval timer that runs every RCB_INTERVAL_DURATION_MS ms and updates the
 * number signal
 */
function rcbIntervalTimerCallback(signalName:string, rcbObject:Ch5RcbExtendedObject):void {
    const dbgKey = 'bridge.rcbIntervalTimerCallback';
    Ch5Debug.info(dbgKey,' start ', 'signalName ' + signalName, ' rcbObject ',rcbObject);

    if (rcbObject.rcb.time === 0) { // safeguard against undefined slope
        return;
    }

    /*
     * Computing the scalarValue considering a linear progression
     * A line equation is y=mx+b
     * where m is the slope and b is the y intercept
     * Knowing 2 points (x1,y1) and (x2,y2) the slope is m=(y2-y1)/(x2-x1)
     *
     * In our case:
     * x axis is time
     * y axis is signal value
     * x1 is 0
     * y1 is b is rcbObject.rcb.startv
     * x2 is rcbObject.rcb.time
     * y2 is rcbObject.rcb.value
     * y2-y1 is (rcbObject.rcb.value-rcbObject.rcb.startv)
     * x2-x1 is rcbObject.rcb.time
     * x is currentTime-starttime
     * y is the value we want to determine ( scalarValue )
     */
    const slope = (rcbObject.rcb.value - rcbObject.rcb.startv) / rcbObject.rcb.time;
    const x = (Date.now() - rcbObject.rcb.startt);
    let scalarValue = slope * x + rcbObject.rcb.startv;

    const s = Ch5SignalFactory.getInstance().getNumberSignal(signalName);


    /*
     * In order to avoid sending the target value before actually reaching it ( due to rounding float to integer )
     * we change the rounding method depending on the slope.
     */
    if (slope > 0) { // increasing
        scalarValue = Math.floor(scalarValue);
    } else if (slope < 0) { // decreasing
        scalarValue = Math.ceil(scalarValue);
    } else { // constant
        scalarValue = Math.round(scalarValue);
    }

    /*
      The following condition (s!==null && s.value!==scalarValue)
      can be used to avoid publishing the same value multiple times when the
      starting value is already the same as the end value
      Or you can check the slope ( it should be different from 0 ).

      Using only ( s!==null ) will allow sending the same value multiple times.
     */
    if ( s !== null && s.value !== scalarValue ) {
        s.fromSignalBridge(scalarValue);
    }
    /*
     if the remaining time until the next execution of this callback is less than the one until the rcbTimerCallback
     is executed then there is no need to cancel the interval here since it will be canceled in the rcbTimerCallback
     */
}

/**
 * This function is executed when the rcb timeout passes.
 * When the timeout expires this function publishes a numeric signal and an object ( rcb with time =0 ) signal
 */
function rcbTimerCallback(signalName:string, rcbObject:Ch5RcbObject):void {
    const dbgKey = 'bridge.rcbTimerCallback';
    Ch5Debug.info(dbgKey,' start ', 'signalName ' + signalName, ' rcbObject ',rcbObject);
    const value = rcbObject.rcb.value;

    const s = Ch5SignalFactory.getInstance().getNumberSignal(signalName);
    if (s !== null) {
        s.fromSignalBridge(value);
    }

    const o = Ch5SignalFactory.getInstance().getObjectSignal(signalName);
    const obj = {'rcb':{'value':value,'time':0}};
    if (o !== null){
        o.fromSignalBridge(obj);
    }

    clearTimersForSignal(signalName);
}

/**
 * Clears the timeout and the timer interval for a signal
 */
function clearTimersForSignal(signalName:string) {
    const dbgKey = 'bridge.clearTimersForSignal';
    Ch5Debug.info(dbgKey,' start ', 'signalName ' + signalName);
    if (rcbIntervalTimers.hasOwnProperty(signalName)){
        window.clearInterval(rcbIntervalTimers[signalName]);
        delete rcbIntervalTimers[signalName];
    }
    if (rcbTimers.hasOwnProperty(signalName)){
        window.clearTimeout(rcbTimers[signalName]);
        delete rcbTimers[signalName];
    }
}

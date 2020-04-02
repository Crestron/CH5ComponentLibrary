// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as core from '../ch5-core/index';
import {Ch5Signal, Ch5SignalBridge, Ch5SignalFactory} from "../ch5-core";
import { TActionLogic, TSignalNonStandardTypeName, TSignalValue, TRepeatDigitalSignalValue } from "../ch5-core";
import { Ch5SignalUpdateCallback } from '../ch5-core/types/callbacks';
import { TCh5Signal } from '../ch5-core/types/signal.type';
import { isNull, isUndefined, isBoolean, isString, isNumber, isObject } from 'lodash';

export type TScenarioOnStart = {
    type: TSignalNonStandardTypeName,
    state: string,
    value: TSignalValue
}

/**
 * Defines the format of the ch5-emulator logic input
 */
export interface IEmulatorScenario {
    cues: IEmulatorCue[],
    onStart?: TScenarioOnStart[]
}

/**
 * Defines the format of a ch5-emulator logic cue
 */
export interface IEmulatorCue {
    type: TSignalNonStandardTypeName,
    event: string,
    trigger: TSignalValue,
    actions: IEmulatorAction[]
}

/**
 * Defines the format of a ch5-emulator logic action
 */
export interface IEmulatorAction {
    state: string,
    type: TSignalNonStandardTypeName,
    logic: TActionLogic,
    value?: TSignalValue,
    offset?: number,
    time?: number
}

export class Ch5Emulator {
    private static _instance: Ch5Emulator;
    private static _scenario: IEmulatorScenario= {} as IEmulatorScenario;

    public static getInstance(): Ch5Emulator {
        if (isUndefined(Ch5Emulator._instance)) {
            Ch5Emulator._instance = new Ch5Emulator();
        }
        return Ch5Emulator._instance;
    }

    public static clear() {
        delete Ch5Emulator._instance;
        delete Ch5Emulator._scenario;
    }

    public loadScenario(scenario:IEmulatorScenario) {
        Ch5Emulator._scenario = scenario;
        if (isUndefined(scenario.cues)) {
            throw new Error('The loaded scenario has no cues');
        }

        scenario.cues.forEach(Ch5Emulator._instance.processCue);
    }

    public getScenario():IEmulatorScenario {
        return Ch5Emulator._scenario;
    }

    private processCue(cue:IEmulatorCue, index:number) {
        let cueSignal:Ch5Signal<boolean>|Ch5Signal<number>|Ch5Signal<string>|Ch5Signal<object>|null;
        let cueSigSubUpdate:Ch5SignalUpdateCallback<boolean>|Ch5SignalUpdateCallback<number>|Ch5SignalUpdateCallback<string>|Ch5SignalUpdateCallback<object>;
        let cueSignalName: string;

        if (isUndefined(cue.event)) {
            throw new Error('Property "signal" is not set in cue.');
        }

        if (isUndefined(cue.actions) || typeof cue.actions.forEach !== "function") {
            throw new Error('Property "actions" is not set in cue.');
        }
        cueSignalName = cue.event;

        // TODO try and find a better way of writing this ( maybe using a generic method )
        switch (cue.type) {
            case 'b': // ts-lint:disable-line:no-switch-case-fall-through
            case 'boolean':
                cueSignal = Ch5SignalFactory.getInstance().getBooleanSignal(cueSignalName);
                if (!isNull(cueSignal)) {
                    cueSigSubUpdate =  (newCueSignalValue:boolean) => {
                        const em = Ch5Emulator.getInstance();

                        if (!isNull(em) && em.isTriggered(cue.trigger, newCueSignalValue, cueSignal)) {
                            cue.actions.forEach((actionItem:IEmulatorAction, actionIndex:number, actionArray:IEmulatorAction[]) => {
                                em.processAction(actionItem, actionIndex, actionArray, newCueSignalValue);
                            });
                        }
                    };
                    cueSignal.subscribe(cueSigSubUpdate);
                } else {
                    throw new Error(`Error processing boolean type signal named ${cueSignalName}`);
                }
                break;
            case 's':  // ts-lint:disable-line:no-switch-case-fall-through
            case 'string':
                cueSignal = Ch5SignalFactory.getInstance().getStringSignal(cueSignalName);
                if (!isNull(cueSignal)) {
                    cueSigSubUpdate = (newCueSignalValue:string) => {
                        const em = Ch5Emulator.getInstance();
                        if ( !isNull(em) && em.isTriggered(cue.trigger, newCueSignalValue, cueSignal)) {
                            cue.actions.forEach((actionItem:IEmulatorAction, actionIndex:number, actionArray:IEmulatorAction[]) => {
                                em.processAction(actionItem, actionIndex, actionArray, newCueSignalValue);
                            });
                        }
                    };
                    cueSignal.subscribe(cueSigSubUpdate);
                } else {
                    throw new Error(`Error processing boolean type signal named ${cueSignalName}`);
                }
                break;
            case 'n':  // ts-lint:disable-line:no-switch-case-fall-through
            case 'numeric': // ts-lint:disable-line:no-switch-case-fall-through
            case 'number':
                cueSignal = Ch5SignalFactory.getInstance().getNumberSignal(cueSignalName);
                if (!isNull(cueSignal)) {
                    cueSigSubUpdate = (newCueSignalValue:number) => {
                        const em = Ch5Emulator.getInstance();
                        if (!isNull(em) && em.isTriggered(cue.trigger, newCueSignalValue, cueSignal)) {
                            cue.actions.forEach((actionItem:IEmulatorAction, actionIndex:number, actionArray:IEmulatorAction[]) => {
                                em.processAction(actionItem, actionIndex, actionArray, newCueSignalValue);
                            });
                        }
                    };
                    cueSignal.subscribe(cueSigSubUpdate);
                } else {
                    throw new Error(`Error processing boolean type signal named ${cueSignalName}`);
                }
                break;
            case 'o':  // ts-lint:disable-line:no-switch-case-fall-through
            case 'object':
                cueSignal = Ch5SignalFactory.getInstance().getObjectSignal(cueSignalName);
                if (!isNull(cueSignal)) {
                    cueSigSubUpdate = (newCueSignalValue:object) => {
                        const em = Ch5Emulator.getInstance();
                        if ( !isNull(em) && em.isTriggered(cue.trigger, newCueSignalValue, cueSignal)) {
                            cue.actions.forEach((actionItem:IEmulatorAction, actionIndex:number, actionArray:IEmulatorAction[]) => {
                                em.processAction(actionItem, actionIndex, actionArray, newCueSignalValue);
                            });
                        }
                    };
                    cueSignal.subscribe(cueSigSubUpdate);
                } else {
                    throw new Error(`Error processing object type signal named ${cueSignalName}`);
                }
                break;
            default:
                throw new Error(`Invalid cue type: ${cue.type}`);
            // break;
        }

    }

    public isTriggered(trigger:boolean|number|string|object,
                       nextSignalValue:boolean|number|string|object|TRepeatDigitalSignalValue,
                       signal:Ch5Signal<boolean>|Ch5Signal<number>|Ch5Signal<string>|Ch5Signal<object>|null) {

        let _nextSignalValue = nextSignalValue;
        const repeatDigitalValue = (_nextSignalValue as TRepeatDigitalSignalValue)[Ch5SignalBridge.REPEAT_DIGITAL_KEY];
        if (isObject(_nextSignalValue) && !isUndefined(repeatDigitalValue)) {
            _nextSignalValue = repeatDigitalValue;
        }

        const triggerType = typeof trigger;
        let isTriggered = false;

        switch (triggerType) {
            case 'boolean':
                isTriggered = (trigger === _nextSignalValue);
                break;
            case 'string':
                if (trigger === '&change'){
                    if (isObject(_nextSignalValue)) {
                        isTriggered = !isNull(signal) &&
                            (JSON.stringify(signal.prevValue) !== JSON.stringify(_nextSignalValue));
                    } else{
                        isTriggered = !isNull(signal) && (signal.prevValue !== _nextSignalValue);
                    }
                } else {
                    isTriggered = ( trigger === _nextSignalValue );
                }
                break;
            case 'number':
                isTriggered = ( trigger === _nextSignalValue );
                break;
            case 'object':
                isTriggered = ( JSON.stringify(trigger) === JSON.stringify(_nextSignalValue) );
                break;
        }

        return isTriggered;
    }

    public processAction(action:IEmulatorAction, actionIndex:number, actionArray:IEmulatorAction[], cueSignalValue:boolean|number|string|object){
        window.setTimeout(() => this.processActionAsync(action, actionIndex, actionArray, cueSignalValue), 30);
    }

    private processActionAsync(action:IEmulatorAction, actionIndex:number, actionArray:IEmulatorAction[], cueSignalValue:boolean|number|string|object){
        if (isUndefined(action.state)) {
            throw new Error('Property "state" is not set in action.');
        }

        switch (action.type) {
            case 'b': // ts-lint:disable-line:no-switch-case-fall-through
            case 'boolean':
                this.processBooleanAction(action, cueSignalValue);
                break;
            case 's':  // ts-lint:disable-line:no-switch-case-fall-through
            case 'string':
                this.processStringAction(action, cueSignalValue);
                break;
            case 'n':  // ts-lint:disable-line:no-switch-case-fall-through
            case 'numeric': // ts-lint:disable-line:no-switch-case-fall-through
            case 'number':
                this.processNumberAction(action, cueSignalValue);
                break;
            case 'o':  // ts-lint:disable-line:no-switch-case-fall-through
            case 'object':
                this.processObjectAction(action, cueSignalValue);
                break;
            default:
                throw new Error(`Invalid cue type: ${action.type}`);
            // break;
        }
    }

    private castToBoolean(val:any):boolean {
        let processedValue:boolean = false;

        if (typeof val === 'string') {
            switch (val.toLowerCase().trim()) {
                case 'true':  // ts-lint:disable-line:no-switch-case-fall-through
                case 'yes': // ts-lint:disable-line:no-switch-case-fall-through
                case '1':
                    processedValue = true;
                    break;
                case 'false': // ts-lint:disable-line:no-switch-case-fall-through
                case 'no': // ts-lint:disable-line:no-switch-case-fall-through
                case '0':
                    processedValue = false;
                    break;
                default:
                    processedValue = Boolean(val);
                    break;
            }
        } else { // types other than string
            processedValue = Boolean(val);
        }

        return processedValue;
    }

    private processBooleanAction(action:IEmulatorAction, cueSignalValue:boolean|number|string|object):void {
        // Check for join number signal state name. This is only for the emulator to work as expected even if
        // bridgeReceiveXXXFromNative core methods are checking for join number state names
        // (but that is required too for Control System to communicate with ch5 components)
        const signalName: string = Ch5Signal.getSubscriptionSignalName(action.state);
        const actionSignal:Ch5Signal<boolean>|Ch5Signal<number>|Ch5Signal<string>|Ch5Signal<object>|null
            = Ch5SignalFactory.getInstance().getBooleanSignal(signalName);

        if (!isNull(actionSignal)) {
            switch (action.logic){
                case "set":
                    if (!isUndefined(action.value)) {
                        // actionSignal.fromSignalBridge(action.value as boolean);
                        // uses the actual bridge functions to better simulate the behavior
                        core.bridgeReceiveBooleanFromNative(signalName, action.value as boolean);
                    }
                    break;
                case "link":
                    // actionSignal.fromSignalBridge(this.castToBoolean(cueSignalValue));
                    // uses the actual bridge functions to better simulate the behavior
                    core.bridgeReceiveBooleanFromNative(signalName, this.castToBoolean(cueSignalValue));
                    break;
                case "toggle":
                    // actionSignal.fromSignalBridge(!actionSignal.value);
                    // uses the actual bridge functions to better simulate the behavior
                    core.bridgeReceiveBooleanFromNative(signalName, !actionSignal.value);
                    break;
                case "pulse":
                    // actionSignal.fromSignalBridge(true);
                    // actionSignal.fromSignalBridge(false);
                    // uses the actual bridge functions to better simulate the behavior
                    core.bridgeReceiveBooleanFromNative(signalName, true);
                    core.bridgeReceiveBooleanFromNative(signalName, false);
                    break;
            }
        } else {
            throw new Error(`Error processing boolean type signal named ${signalName}`);
        }
    }

    private processNumberAction(action:IEmulatorAction, cueSignalValue: boolean|number|string|object):void {
        // Check for join number signal state name. This is only for the emulator to work as expected even if
        // bridgeReceiveXXXFromNative core methods are checking for join number state names
        // (but that is required too for Control System to communicate with ch5 components)
        const signalName: string = Ch5Signal.getSubscriptionSignalName(action.state);
        const actionSignal:Ch5Signal<boolean>|Ch5Signal<number>|Ch5Signal<string>|Ch5Signal<object>|null
            = Ch5SignalFactory.getInstance().getNumberSignal(signalName);

        if (!isNull(actionSignal)) {
            switch (action.logic){
                case "set":
                    if (isNumber(action.value)) {
                        // actionSignal.fromSignalBridge(action.value);
                        // uses the actual bridge functions to better simulate the behavior
                        core.bridgeReceiveIntegerFromNative(signalName, action.value);
                    }
                    break;
                case "link":
                    let parsedVal = parseInt('' + cueSignalValue,10);
                    if (isNaN(parsedVal)){
                        parsedVal = 0;
                    }
                    // actionSignal.fromSignalBridge(parsedVal as number);
                    // uses the actual bridge functions to better simulate the behavior
                    core.bridgeReceiveIntegerFromNative(signalName, parsedVal);
                    break;
                case "increment":
                    let increment = 1;
                    if (!isUndefined(action.offset)) {
                        increment = action.offset;
                    }
                    // actionSignal.fromSignalBridge(+actionSignal.value + increment);
                    // uses the actual bridge functions to better simulate the behavior
                    // the first plus sign is used for casting the value to a number +a == Number(a)
                    core.bridgeReceiveIntegerFromNative(signalName, +actionSignal.value + increment);
                    break;
                case "decrement":
                    let decrement = 1;
                    if (!isUndefined(action.offset)) {
                        decrement = action.offset;
                    }
                    // actionSignal.fromSignalBridge(+actionSignal.value - decrement);
                    // uses the actual bridge functions to better simulate the behavior
                    // the first plus sign is used for casting the value to a number +a == Number(a)
                    core.bridgeReceiveIntegerFromNative(signalName, +actionSignal.value - decrement);
                    break;
                // TODO remove this since rcb logic can be accomplished by sending an rcb object signal
                case "rcb":
                    if (!isUndefined(action.value) && !isUndefined(action.time)) {
                        setTimeout((signal: Ch5Signal<number>|null, val: number) => {
                                if (!isNull(signal)) {
                                    // sig.fromSignalBridge(val);
                                    core.bridgeReceiveIntegerFromNative(signalName, val);
                                }
                            }, action.time, actionSignal, action.value);
                    }
                    break;
            }
        } else {
            throw new Error(`Error processing numeric type signal named ${signalName}`);
        }
    }

    private processStringAction(action: IEmulatorAction, cueSignalValue: boolean | number | string | object): void {
        // Check for join number signal state name. This is only for the emulator to work as expected even if
        // bridgeReceiveXXXFromNative core methods are checking for join number state names
        // (but that is required too for Control System to communicate with ch5 components)
        const signalName: string = Ch5Signal.getSubscriptionSignalName(action.state);
        const actionSignal: Ch5Signal<boolean> | Ch5Signal<number> | Ch5Signal<string> | Ch5Signal<object> | null
            = Ch5SignalFactory.getInstance().getStringSignal(signalName);

        if (isNull(actionSignal)) {
            throw new Error(`Error processing string type signal named ${signalName}`);
        }
        switch (action.logic) {
            case "set":
                // uses the actual bridge functions to better simulate the behavior
                core.bridgeReceiveStringFromNative(signalName, String(action.value));
                break;
            case "link":
                // uses the actual bridge functions to better simulate the behavior
                core.bridgeReceiveStringFromNative(signalName, String(cueSignalValue));
                break;
        }
    }

    private processObjectAction(action: IEmulatorAction, cueSignalValue: boolean | number | string | object): void {
        // Check for join number signal state name. This is only for the emulator to work as expected even if
        // bridgeReceiveXXXFromNative core methods are checking for join number state names
        // (but that is required too for Control System to communicate with ch5 components)
        const signalName: string = Ch5Signal.getSubscriptionSignalName(action.state);
        const actionSignal: Ch5Signal<boolean> | Ch5Signal<number> | Ch5Signal<string> | Ch5Signal<object> | null
            = Ch5SignalFactory.getInstance().getObjectSignal(signalName);

        if (isNull(actionSignal)) {
            throw new Error(`Error processing object type signal named ${signalName}`);
        }
        switch (action.logic) {
            case "set":
                if (!isUndefined(action.value)) {
                    // actionSignal.fromSignalBridge(action.value);
                    // uses the actual bridge functions to better simulate the behavior
                    core.bridgeReceiveObjectFromNative(signalName, action.value as object);
                }
                break;
            case "link":
                // actionSignal.fromSignalBridge(cueSignalValue);
                // uses the actual bridge functions to better simulate the behavior
                core.bridgeReceiveObjectFromNative(signalName, cueSignalValue as object);
                break;
        }
    }

    public run():void {
        if (isUndefined(Ch5Emulator._scenario) || isUndefined(Ch5Emulator._scenario.cues)) {
            throw new Error('You must load a scenario before trying to run one.');
        }
        if (isUndefined(Ch5Emulator._scenario.onStart) || isUndefined(Ch5Emulator._scenario.onStart.forEach)) {
            // throw new Error('There are no rules defined for "onStart"');
            return ;
        }

        Ch5Emulator._scenario.onStart.forEach((item, index) => {
            // Check for join number signal state name for onStart queue too.
            // This is only for the emulator to work as expected even if
            // bridgeReceiveXXXFromNative core methods are checking for join number state names
            // (but that is required too for Control System to communicate with ch5 components)
            const signalName: string = Ch5Signal.getSubscriptionSignalName(item.state);
            let signal: TCh5Signal;
            switch (item.type) {
                case "b": // ts-lint:disable-line:no-switch-case-fall-through
                case "boolean":
                    signal = Ch5SignalFactory.getInstance().getBooleanSignal(signalName);
                    if (!isNull(signal) && isBoolean(item.value)) {
                        // signal.fromSignalBridge(item.value);
                        // uses the actual bridge functions to better simulate the behavior
                        core.bridgeReceiveBooleanFromNative(signalName, item.value);
                    } else {
                        throw new Error(`Error when setting initial value (${item.value}) for state: ${signalName}`);
                    }
                    break;
                case "n":  // ts-lint:disable-line:no-switch-case-fall-through
                case "numeric": // ts-lint:disable-line:no-switch-case-fall-through
                case "number":
                    signal = Ch5SignalFactory.getInstance().getNumberSignal(signalName);
                    const signalValue: number = Number(item.value);
                    if (!isNull(signal) && !isNaN(signalValue)) {
                        // signal.fromSignalBridge(item.value);
                        // uses the actual bridge functions to better simulate the behavior
                        core.bridgeReceiveIntegerFromNative(signalName, signalValue);
                    } else {
                        throw new Error(`Error when setting initial value (${item.value}) for state: ${signalName}`);
                    }
                    break;
                case "s":  // ts-lint:disable-line:no-switch-case-fall-through
                case "string":
                    signal = Ch5SignalFactory.getInstance().getStringSignal(signalName);
                    if (!isNull(signal) && isString(item.value)) {
                        // signal.fromSignalBridge(item.value);
                        // uses the actual bridge functions to better simulate the behavior
                        core.bridgeReceiveStringFromNative(signalName, item.value);
                    } else {
                        throw new Error(`Error when setting initial value (${item.value}) for state: ${signalName}`);
                    }
                    break;
                case "o":  // ts-lint:disable-line:no-switch-case-fall-through
                case "object":
                    signal = Ch5SignalFactory.getInstance().getObjectSignal(signalName);
                    if (!isNull(signal) && isObject(item.value)) {
                        // signal.fromSignalBridge(item.value);
                        // uses the actual bridge functions to better simulate the behavior
                        core.bridgeReceiveObjectFromNative(signalName, item.value as object);
                    } else {
                        throw new Error(`Error when setting initial value (${item.value}) for signal: ${signalName}`);
                    }
                    break;
                default:
                    throw new Error(`Invalid 'onStart' type: ${item.type}`);
                // break;
            }
        });
    }
}

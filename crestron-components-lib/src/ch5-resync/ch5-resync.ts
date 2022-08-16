// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalFactory } from "../ch5-core";
import { ICh5StatesAtDefaultValueModel } from "./models/ch5-states-at-default-value-model";
import { ICh5ExcludePrefixesModel } from "./models/ch5-exclude-prefixes-model";
import { ICh5ClearRangeDataModel } from "./models/ch5-clear-range-data-model";
import { Ch5ResyncConstants } from "./models/ch5-resync-constants";
import { Ch5Debug } from "../ch5-core";
import { ResetEventNames } from "./models/ch5-resync-reset-event-names-enum";

/**
 * Contains the business logic of the resynchronization with the Crestron Control System flows (single / multiple CCS)
 * @export
 * @class Ch5Resync
 */
export class Ch5Resync {

    private static _instance: Ch5Resync;
    private static START_OF_UPDATE_TIME_LIMIT = 60000; // 60 seconds

    public _statesAtDefaultValue: ICh5StatesAtDefaultValueModel;
    private readonly statesRef: any;
    private ch5SignalFactory = Ch5SignalFactory.getInstance();
    private LOG_KEY = 'Ch5Resync';

    private startOfUpdateTimer: number | undefined;
    private startOfUpdateCounter: number = 0;

    /**
     * Check if the state should be excluded from defaultStates
     * @param excludeStatesWithThesePrefixes
     * @param state
     */
    public static checkIfStateShouldBeIncluded(excludeStatesWithThesePrefixes: ICh5ExcludePrefixesModel, state: string) {
        if (state === 'Csig.State_Synchronization') {
            return false;
        }
        for (const excludePrefix of excludeStatesWithThesePrefixes.excludePrefixes) {
            if (state && state.startsWith(excludePrefix)) {
                return false;
            }
        }
        return true;
    }


    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        this.statesRef = this.ch5SignalFactory.getStates();
        this._statesAtDefaultValue = {};
    }

    /**
     * On ClearAll (Single Control System)
     * Store the name of all _signals
     * @memberof Ch5Resync
     */
    public onReceiveStartOfUpdate(excludeStatesWithThesePrefixes: ICh5ExcludePrefixesModel): void {
        Ch5Debug.info(this.LOG_KEY, `Start of Update called with ${JSON.stringify(excludeStatesWithThesePrefixes)}`);
        this.initializeStartOfUpdateTimer();
        this.startOfUpdateCounter += 1;

        this.setDefaultStatesOnStartOfUpdate(excludeStatesWithThesePrefixes); 
    }

    /**
     * On ClearRange (Multiple Control Systems)
     * @memberof Ch5Resync
     * @param statesToReset
     * @param excludePrefixes
     */
    public onReceiveStartOfUpdateRange(startOfUpdateMsg:string, statesToReset: ICh5ClearRangeDataModel, excludePrefixes: string[]): void {
        if (Ch5Debug.shouldDisplay(this.LOG_KEY)) {
            Ch5Debug.info(this.LOG_KEY, `Start of Update Range called with ${JSON.stringify(statesToReset)}`);
        }

        if (ResetEventNames.startOfUpdateRange === startOfUpdateMsg) {
            this.initializeStartOfUpdateTimer();
            this.startOfUpdateCounter += 1;    
        }

        // Add joined states to _statesAtDefaultValue
        this.addDefaultJoinsOnClearRange(statesToReset.boolean.joinLow, statesToReset.boolean.joinHigh, 'boolean');
        this.addDefaultJoinsOnClearRange(statesToReset.numeric.joinLow, statesToReset.numeric.joinHigh, 'number');
        this.addDefaultJoinsOnClearRange(statesToReset.string.joinLow, statesToReset.string.joinHigh, 'string');

        // Add events to _statesAtDefaultValue
        this.addDefaultStatesOnClearRange(statesToReset.boolean.stateNames, 'boolean', excludePrefixes);
        this.addDefaultStatesOnClearRange(statesToReset.numeric.stateNames, 'number', excludePrefixes);
        this.addDefaultStatesOnClearRange(statesToReset.string.stateNames, 'string', excludePrefixes);

        if (Ch5Debug.shouldDisplay(this.LOG_KEY)) {
            Ch5Debug.info(this.LOG_KEY, `Start Of Update Range:${JSON.stringify(this._statesAtDefaultValue)}`);
        }
    }

    /**
     * On UpdatedState, update the _signals (states) with values received from the CS and reset leftovers (_statesAtDefaultValue) to the default value
     * @param {string} stateName
     * @param {*} value
     * @param type
     * @returns
     * @memberof Ch5Resync
     */
    public onReceiveUpdatedState(stateName: string, value: any, type: any): void {
        if (!this.InUpdateState) {
            return;
        }
        Ch5Debug.info(this.LOG_KEY, `Updated ${type}:${stateName}`);
        if (this._statesAtDefaultValue[type] !== undefined && this._statesAtDefaultValue[type][stateName] !== undefined) {
            delete this._statesAtDefaultValue[type][stateName];
        }
    }

    /**
     * On EndOfUpdate, reset remaining states to default
     */
    public onReceiveEndOfUpdate(): void {
        Ch5Debug.info(this.LOG_KEY, `End of Update called with counter ${this.startOfUpdateCounter}`);

        if (this.startOfUpdateCounter > 0) {
            this.startOfUpdateCounter -= 1;
            if (this.startOfUpdateCounter === 0) {
                this.resetRemainingStates();
            }
        }

    }

    private resetRemainingStates(): void {
        this.startOfUpdateCounter = 0;  

        if (this.startOfUpdateCounter !== undefined) {
            window.clearTimeout(this.startOfUpdateTimer as number);
            this.startOfUpdateTimer = undefined;    
        }

        this.setRemainingStatesToDefaultValue();

        this._statesAtDefaultValue = {};
    }


    /**
     * Utility method
     * @param joinLow
     * @param joinHigh
     * @param eventType
     */
    public addDefaultJoinsOnClearRange(joinLow: number, joinHigh: number, eventType: string): void {
        if (joinLow === 0 && joinHigh === 0) {
            return;
        }
        if (this._statesAtDefaultValue[eventType] === undefined) {
            this._statesAtDefaultValue[eventType] = {};
        }
        for (let i = joinLow; i <= joinHigh; i++) {
            this._statesAtDefaultValue[eventType][Ch5ResyncConstants.JOIN_NUMBER_SIGNAL_NAME_PREFIX + i.toString()] = true;
        }
    }

    /**
     * Utility method
     * @param states
     * @param eventType
     */
    public addDefaultStatesOnClearRange(states: string[], eventType: string, excludePrefixes: string[]): void {
        if (states === undefined || states.length === 0) {
            return;
        }
        if (this._statesAtDefaultValue[eventType] === undefined) {
            this._statesAtDefaultValue[eventType] = {};
        }
        for (const state of states) {
            this._statesAtDefaultValue[eventType][state] = true;
        }
    }

    /**
     * Called on ClearAll, copy all the state names which meet the conditions
     * @memberof Ch5Resync
     */
    public setDefaultStatesOnStartOfUpdate(excludeStatesWithThesePrefixes: ICh5ExcludePrefixesModel): void {
        this._statesAtDefaultValue = {};
        for (const key in this.statesRef) {
            if (this.statesRef.hasOwnProperty(key)) {
                if (this._statesAtDefaultValue[key] === undefined) {
                    this._statesAtDefaultValue[key] = {};
                }
                for (const state in this.statesRef[key]) {
                    if (this.statesRef[key].hasOwnProperty(state)) {
                        const currentState = this.statesRef[key];
                        if (Ch5Resync.checkIfStateShouldBeIncluded(excludeStatesWithThesePrefixes, currentState[state]._name)
                            && currentState[state].receivedFromSignalBridge) {
                            this._statesAtDefaultValue[key][currentState[state]._name] = true;
                        }
                    }
                }
            }
        }
        if (Ch5Debug.shouldDisplay(this.LOG_KEY)) {
            Ch5Debug.info(this.LOG_KEY, `Start of Update:${JSON.stringify(this._statesAtDefaultValue)}`);
        }
    }

    /**
     * Set remaining states to their corresponding default value based on their type
     */
    public setRemainingStatesToDefaultValue(): void {
        if (Ch5Debug.shouldDisplay(this.LOG_KEY)) {
            Ch5Debug.info(this.LOG_KEY, `End Of Update:${JSON.stringify(this._statesAtDefaultValue)}`);
        }

        for (const stateType in this._statesAtDefaultValue) {
            if (Object.prototype.hasOwnProperty.call(this._statesAtDefaultValue, stateType)) {
                const statesInType = this._statesAtDefaultValue[stateType];
                for (const stateName in statesInType) {
                    if (Object.prototype.hasOwnProperty.call(statesInType, stateName)) {
                        if (!this.statesRef[stateType][stateName]) {
                            continue;
                        }
                        try {
                            switch (stateType) {
                                case 'boolean':
                                    this.statesRef[stateType][stateName].fromSignalBridge(false);
                                    break;
                                case 'number':
                                    this.statesRef[stateType][stateName].fromSignalBridge(0);

                                    if (this.statesRef.object[stateName]) {
                                        this.statesRef.object[stateName].fromSignalBridge({"rcb": {"value": 0, "time": 0}});
                                    }
                                    break;
                                case 'string':
                                    this.statesRef[stateType][stateName].fromSignalBridge('');
                                    break;
                                default:
                                    break;
                            }
                        } catch (exception) {
                            console.log('[INFO] Failed to publish signal: ' + stateName + ' of type: ' + stateType);
                        }
                    }
                }
            }
        }
    }

    private initializeStartOfUpdateTimer(time: number = Ch5Resync.START_OF_UPDATE_TIME_LIMIT) {
        window.clearTimeout(this.startOfUpdateTimer);
        this.startOfUpdateTimer = window.setTimeout(() => {
            Ch5Debug.info(this.LOG_KEY, `Timeout waiting for EndOfUpdate remainingEOUs:${this.startOfUpdateCounter}`);
            this.resetRemainingStates();
        }, time) as never as number;
    }

    private get InUpdateState() : boolean {
        return this.startOfUpdateTimer !== undefined; 
    }
}

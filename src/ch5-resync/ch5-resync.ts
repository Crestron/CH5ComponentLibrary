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

/**
 * Contains the business logic of the resynchronization with the Crestron Control System flows (single / multiple CCS)
 * @export
 * @class Ch5Resync
 */
export class Ch5Resync {

    private static _instance: Ch5Resync;
    public _statesAtDefaultValue: ICh5StatesAtDefaultValueModel[];
    private _inUpdateState: boolean = false;
    private readonly statesRef: any;
    private ch5SignalFactory = Ch5SignalFactory.getInstance();
    private LOG_KEY = 'Ch5Resync';

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
            if (state.startsWith(excludePrefix)) {
                return false;
            }
        }
        return true;
    }

    /**
     * On clear range filter the states based on the provided excludePrefixes
     * @param statesToCheck
     * @param excludePrefixes
     */
    public static excludeStateOnClearRange(statesToCheck: string[], excludePrefixes: string[]): string[] {
        for (const excludePrefix of excludePrefixes) {
            for (const booleanEvent of statesToCheck) {
                if (booleanEvent.startsWith(excludePrefix)) {
                    const index = statesToCheck.indexOf(booleanEvent, 0);
                    if (index > -1) {
                        statesToCheck.splice(index, 1);
                    }
                }
            }
        }
        return statesToCheck;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private constructor() {
        this.statesRef = this.ch5SignalFactory.getStates();
        this._statesAtDefaultValue = [];
    }

    /**
     * On ClearAll (Single Control System)
     * Store the name of all _signals
     * @memberof Ch5Resync
     */
    public onReceiveClearAll(excludeStatesWithThesePrefixes: ICh5ExcludePrefixesModel): void {
        this._inUpdateState = true;
        this.setDefaultStatesOnClearAll(excludeStatesWithThesePrefixes);
    }

    /**
     * On ClearRange (Multiple Control Systems)
     * @memberof Ch5Resync
     * @param statesToReset
     * @param excludePrefixes
     */
    public onReceiveClearRange(statesToReset: ICh5ClearRangeDataModel, excludePrefixes: string[]): void {
        console.log("[ch5-resync] Received ClearRange");
        this._inUpdateState = true;

        // Exclude prefixes
        if (excludePrefixes.length > 0) {
            statesToReset.boolean.stateNames = Ch5Resync.excludeStateOnClearRange(statesToReset.boolean.stateNames, excludePrefixes);
            statesToReset.numeric.stateNames = Ch5Resync.excludeStateOnClearRange(statesToReset.numeric.stateNames, excludePrefixes);
            statesToReset.string.stateNames = Ch5Resync.excludeStateOnClearRange(statesToReset.string.stateNames, excludePrefixes);
        }
        // Add joined states to _statesAtDefaultValue
        this.addDefaultJoinsOnClearRange(statesToReset.boolean.joinLow, statesToReset.boolean.joinHigh, 'boolean');
        this.addDefaultJoinsOnClearRange(statesToReset.numeric.joinLow, statesToReset.numeric.joinHigh, 'number');
        this.addDefaultJoinsOnClearRange(statesToReset.string.joinLow, statesToReset.string.joinHigh, 'string');

        // Add events to _statesAtDefaultValue
        this.addDefaultStatesOnClearRange(statesToReset.boolean.stateNames, 'boolean');
        this.addDefaultStatesOnClearRange(statesToReset.numeric.stateNames, 'number');
        this.addDefaultStatesOnClearRange(statesToReset.string.stateNames, 'string');
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
        if (!this._inUpdateState) {
            return;
        }
        for (let i = 0; i < this._statesAtDefaultValue.length; i++) {
            if (this._statesAtDefaultValue[i].name === stateName && this._statesAtDefaultValue[i].type === type) {
                // update the state
                this._statesAtDefaultValue.splice(i, 1);
                return;
            }
        }
    }

    /**
     * On EndOfUpdate, reset remaining states to default
     */
    public onReceiveEndOfUpdate(): void {
        this.setRemainingStatesToDefaultValue();
        this._inUpdateState = false;
        this._statesAtDefaultValue = [];
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
        for (let i = joinLow; i <= joinHigh; i++) {
            this._statesAtDefaultValue.push({
                name: Ch5ResyncConstants.JOIN_NUMBER_SIGNAL_NAME_PREFIX + i.toString(),
                type: eventType
            } as ICh5StatesAtDefaultValueModel);
        }
    }

    /**
     * Utility method
     * @param states
     * @param eventType
     */
    public addDefaultStatesOnClearRange(states: string[], eventType: string): void {
        if (states.length === 0) {
            return;
        }
        for (const state of states) {
            this._statesAtDefaultValue.push({
                name: state,
                type: eventType
            } as ICh5StatesAtDefaultValueModel);
        }
    }

    /**
     * Called on ClearAll, copy all the state names which meet the conditions
     * @memberof Ch5Resync
     */
    public setDefaultStatesOnClearAll(excludeStatesWithThesePrefixes: ICh5ExcludePrefixesModel): void {
        this._statesAtDefaultValue = [];
        for (const key in this.statesRef) {
            if (this.statesRef.hasOwnProperty(key)) {
                for (const state in this.statesRef[key]) {
                    if (this.statesRef[key].hasOwnProperty(state)) {
                        const currentState = this.statesRef[key];
                        if (Ch5Resync.checkIfStateShouldBeIncluded(excludeStatesWithThesePrefixes, currentState[state]._name)
                            && currentState[state].receivedFromSignalBridge) {
                            this._statesAtDefaultValue.push({
                                name: currentState[state]._name,
                                type: key
                            } as ICh5StatesAtDefaultValueModel);
                        }
                    }
                }
            }
        }
        if (Ch5Debug.shouldDisplay(this.LOG_KEY)) {
            Ch5Debug.info(this.LOG_KEY, `Clear All:${JSON.stringify(this._statesAtDefaultValue)}`);
        }
    }

    /**
     * Set remaining states to their corresponding default value based on their type
     */
    public setRemainingStatesToDefaultValue(): void {
        if (Ch5Debug.shouldDisplay(this.LOG_KEY)) {
            Ch5Debug.info(this.LOG_KEY, `End Of Update:${JSON.stringify(this._statesAtDefaultValue)}`);
        }
        if (this._statesAtDefaultValue.length === 0) {
            return;
        }
        this._statesAtDefaultValue
            .forEach(state => {
                try {
                    switch (state.type) {
                        case 'boolean':
                            this.statesRef[state.type][state.name].fromSignalBridge(false);
                            break;
                        case 'number':
                            this.statesRef[state.type][state.name].fromSignalBridge(0);
                            break;
                        case 'string':
                            this.statesRef[state.type][state.name].fromSignalBridge('');
                            break;
                        case 'object':
                            this.statesRef[state.type][state.name].fromSignalBridge({"rcb": {"value": 0, "time": 0}});
                            break;
                        default:
                            break;
                    }
                } catch (exception) {
                    console.log('[INFO] Failed to publish signal: ' + state.name + ' of type: ' + state.type);
                }
            });
    }
}

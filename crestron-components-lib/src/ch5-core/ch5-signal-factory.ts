// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

// import { TStringSet } from './core';
import { Ch5Signal } from './ch5-signal';
import { TSignal, TSignalBagByType } from './types/signal.type';

export class Ch5SignalFactory {
    private static _instance: Ch5SignalFactory;
    private _signals: TSignalBagByType;

    public static getInstance(): Ch5SignalFactory {
        if (Ch5SignalFactory._instance === undefined) {
            Ch5SignalFactory._instance = new Ch5SignalFactory();
        }

        return Ch5SignalFactory._instance;
    }

    public static clear() {
        if (typeof Ch5SignalFactory._instance !== "undefined") {
            delete Ch5SignalFactory._instance._signals;
            delete Ch5SignalFactory._instance;
        }
    }

    private constructor() {
        // this._signals = {};
        this._signals = {'boolean': {}, 'number': {}, 'string': {}, 'object': {}};
    }

    // Utility for testing purposes only
    public clearSignals(keepObjSignals: boolean) {
        keepObjSignals ? this._signals = {'boolean': {}, 'number': {}, 'string': {}, 'object': this._signals.object}
        : this._signals = {'boolean': {}, 'number': {}, 'string': {}, 'object': {}};
    }

    public getStates():any{
        return this._signals;
    }

    public getBooleanSignal(name: string, createNewIfNotFound=true): Ch5Signal<boolean> | null {
        return this.getState<boolean>(name, false, createNewIfNotFound);
    }

    public getObjectAsBooleanSignal(name: string, createNewIfNotFound=true): Ch5Signal<object|boolean> | null {
        return this.getState<object|boolean>(name, false, createNewIfNotFound);
    }

    public getNumberSignal(name: string, createNewIfNotFound=true): Ch5Signal<number> | null {
        return this.getState<number>(name, 0, createNewIfNotFound);
    }

    public getStringSignal(name: string, createNewIfNotFound=true): Ch5Signal<string> | null {
        return this.getState<string>(name, '', createNewIfNotFound);
    }

    public getObjectSignal(name: string, createNewIfNotFound=true): Ch5Signal<object> | null {
        return this.getState<object>(name, {}, createNewIfNotFound);
    }

    public getState<T extends TSignal>(name: string, typeInstance: T, createNewIfNotFound=true): Ch5Signal<T> | null {
        if (name === undefined) {
            return null;
        }
        const type: string = typeof(typeInstance);
        if (this._signals[type] === undefined) {
            return null;
        }

        if (this._signals[type][name] === undefined) {
            if (!createNewIfNotFound) {
                return null;
            }
            const newSignal = new Ch5Signal<T>(name, typeInstance);
            this._signals[type][name] = newSignal;

            return newSignal;
        } else {
            const existingSignal: Ch5Signal<T> = this._signals[type][name] as Ch5Signal<T>;
            if (existingSignal.type === typeof(typeInstance)) {
                // console.log("getState('" + name + "') return existing signal");
                return existingSignal;
            } else {
                //// not the same type !!! return null for now.
                // console.log("getState('" + name + "') return null");
                return null;
            }
        }
    }
}

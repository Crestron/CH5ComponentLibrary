// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Subscription } from 'rxjs';

import { TSignalStandardTypeName, TSignalSubscriptions } from "./core";
import { Ch5SignalBridge } from './ch5-signal-bridge';
import { Ch5SignalBehaviorSubject } from "./ch5-signal-behavior-subject";
import { TSignal } from './types/signal.type';
import { Ch5SignalErrorCallback, Ch5SignalUpdateCallback } from './types/callbacks';
import { Ch5Resync } from "../ch5-resync/ch5-resync";
import { subscribeState } from '.';
import { ResetEventNames } from "../ch5-resync/models/ch5-resync-reset-event-names-enum";
import { ICh5ExcludePrefixesModel } from "../ch5-resync/models/ch5-exclude-prefixes-model";
import { IResynchronizationRequestModel } from "../ch5-resync/models/resynchronization-request-model";
import { Ch5ResyncConstants } from "../ch5-resync/models/ch5-resync-constants";

export class Ch5Signal<T extends TSignal> {

    private static _resetEventsInitialized = false;
    private static _receivedClearEvent: boolean = false;
    private static _initialSubscriptionToResyncEvents: boolean = true;
    private _name: string;
    private _subject: Ch5SignalBehaviorSubject<T>;
    private _uninitializedValue: T;
    private _lastSubId: number;
    private _subscriptions: TSignalSubscriptions;
    private _signalBridge: Ch5SignalBridge;
    private _hasChangedSinceInit: boolean = false;
    private _receivedFromSignalBridge: boolean = false;
    private _ch5Resync: Ch5Resync;

    public static isIntegerSignalName(name: string): boolean {
        const n: number = parseInt(name, 10);
        return !isNaN(n) && n.toString() === name;
    }

    public static getJoinNumberSignalName(name: string): string {
        return Ch5ResyncConstants.JOIN_NUMBER_SIGNAL_NAME_PREFIX + name;
    }

    public static getSubscriptionSignalName(name: string): string {
        return Ch5Signal.isIntegerSignalName(name)
            ? Ch5Signal.getJoinNumberSignalName(name)
            : name;
    }

    private static _resetEventsInitialization() {
        if (Ch5Signal._resetEventsInitialized) {
            return;
        }

        Ch5Signal._resetEventsInitialized = true;
        const ch5Resync = Ch5Resync.Instance;

        const processResyncronizationCallback = (resyncRequest: IResynchronizationRequestModel) => {
            if (Ch5Signal._initialSubscriptionToResyncEvents) {
                Ch5Signal._initialSubscriptionToResyncEvents = false;
                return;
            }

            // CLEAR ALL
            if (resyncRequest.state === ResetEventNames.clearAll) {
                Ch5Signal._receivedClearEvent = true;
                if (resyncRequest.value !== undefined && resyncRequest.value.excludePrefixes !== undefined) {
                    const excludePrefixes: ICh5ExcludePrefixesModel = {
                        excludePrefixes: resyncRequest.value.excludePrefixes
                    };
                    ch5Resync.onReceiveClearAll(excludePrefixes);
                } else {
                    Ch5Signal._receivedClearEvent = false;
                    throw new Error('Invalid resyncRequest object');
                }
            }

            // CLEAR RANGE
            else if (resyncRequest.state === ResetEventNames.clearRange) {
                Ch5Signal._receivedClearEvent = true;
                if (resyncRequest.value !== undefined && resyncRequest.value.range !== undefined &&
                    resyncRequest.value.excludePrefixes !== undefined) {
                    ch5Resync.onReceiveClearRange(resyncRequest.value.range, resyncRequest.value.excludePrefixes);
                } else {
                    Ch5Signal._receivedClearEvent = false;
                    throw new Error('Invalid resyncRequest object');
                }
            }
            // END OF UPDATE
            else if (resyncRequest.state === ResetEventNames.endOfUpdate) {
                Ch5Signal._receivedClearEvent = false;
                ch5Resync.onReceiveEndOfUpdate();
            }
        };

        subscribeState('object', 'Csig.State_Synchronization', processResyncronizationCallback);
    }

    constructor(name: string, typeInstance: T) {
        this._name = name;
        this._uninitializedValue = this.uninitializedCreate(typeInstance);
        this._subject = new Ch5SignalBehaviorSubject<T>(this._uninitializedValue, this._uninitializedValue);
        this._lastSubId = 0;
        this._subscriptions = {};
        this._signalBridge = new Ch5SignalBridge();
        this._ch5Resync = Ch5Resync.Instance;
        Ch5Signal._resetEventsInitialization();
        this.subscribeToStates();
    }

    public subscribeToStates() {
        const subKey = 'stateSubscription';
        this._subscriptions[subKey] = this._subject.subscribe(() => {
            if (Ch5Signal._receivedClearEvent) {
                this._ch5Resync.onReceiveUpdatedState(this._name, this.value, this.type);
            }
        });
    }

    private uninitializedCreate(typeInstance: T): T {
        switch (typeof typeInstance) {
            case 'boolean':
                return false as T;
            case 'number':
                return 0 as T;
            case 'string':
                return '' as T;
            case 'object':
                return {} as T;
            default:
                // invalid ch5 signal type !!!!
                return {} as T;
        }
    }

    public get name(): string {
        return this._name;
    }

    public get type(): string {
        return typeof (this._uninitializedValue);
    }

    public get value(): T {
        return this._subject.value;
    }

    public get prevValue(): T {
        return this._subject.prevValue;
    }

    public hasChangedSinceInit(): boolean {
        return this._hasChangedSinceInit;
    }

    public get receivedFromSignalBridge(): boolean {
        return this._receivedFromSignalBridge;
    }

    public publish(value: T): void {
        this._hasChangedSinceInit = true;
        this._subject.next(value);
        this._signalBridge.publish(this._name, value);
    }

    public fromSignalBridge(value: T) { // for use only for signals received from native on signal bridge
        // console.log('from sb ',value,' subj',this._subject.observers);
        this._receivedFromSignalBridge = true;
        this._hasChangedSinceInit = true;
        this._subject.next(value);
        // console.log('from sb ',value,' subj',this._subject.getValue());
    }

    public subscribe(updatecb: Ch5SignalUpdateCallback<T>, errorcb?: Ch5SignalErrorCallback): string {
        this._lastSubId++; // add one to last subscription
        const subKey: string = this._name + '-' + ('00000' + this._lastSubId).slice(-5); // pad zeros
        let newSub: Subscription;
        if (errorcb !== undefined && errorcb !== null) {
            newSub = this._subject.subscribe(updatecb, errorcb);
        } else {
            newSub = this._subject.subscribe(updatecb);
        }
        this._subscriptions[subKey] = newSub;

        if (Object.keys(this._subscriptions).length === 1) {
            // implicit subscription to the signal bus signal of same name.
            this._signalBridge.subscribe(this._name, typeof (this._uninitializedValue) as TSignalStandardTypeName);
        }
        return subKey;
    }

    public unsubscribe(subKey: string) {

        const oldSub: Subscription = this._subscriptions[subKey];
        if (oldSub !== undefined) {
            oldSub.unsubscribe();
            delete this._subscriptions[subKey];
            if (Object.keys(this._subscriptions).length === 1) {
                // implicit unsubscription to the signal bus signal of same name.
                this._signalBridge.unsubscribe(this._name, typeof (this._uninitializedValue) as TSignalStandardTypeName);
            }
        }
    }

}


// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ISigComSendToNative, ISigComSubscribe, ISigComUnsubscribe, ISigComSendWebkit, ISWebXPanel } from './interfaces-sig-com';
declare var JSInterface: ISigComUnsubscribe & ISigComSubscribe & ISigComSendToNative;
declare var webkit: ISigComSendWebkit;
declare var CommunicationInterface: ISWebXPanel;

import { isObject, isUndefined, isFunction } from 'lodash';

import { TSignalsSubscriptionsByType, TSignalStandardTypeName, TRepeatDigitalSignalValue } from './core';
import { Ch5Debug } from "./ch5-debug";

export class Ch5SignalBridge {

    public static readonly REPEAT_DIGITAL_KEY: string = 'repeatdigital';

    private _subscriptions: TSignalsSubscriptionsByType;
    private _localPublishers: TSignalsSubscriptionsByType;
    private _isWebView: boolean = false;
    private _isWebKit: boolean = false;

    public constructor() {
        const dbgKey = 'Ch5SignalBridge.constructor';
        Ch5Debug.info(dbgKey, ' start ');
        this._subscriptions = {
            "boolean": new Set<string>(),
            "number": new Set<string>(),
            "object": new Set<string>(),
            "string": new Set<string>()
        };
        this._localPublishers = {
            "boolean": new Set<string>(),
            "number": new Set<string>(),
            "object": new Set<string>(),
            "string": new Set<string>()
        };

        this._isWebView = typeof (JSInterface) !== 'undefined'
            && typeof (JSInterface.bridgeSendBooleanToNative) === 'function'
            && typeof (JSInterface.bridgeSendIntegerToNative) === 'function'
            && typeof (JSInterface.bridgeSendStringToNative) === 'function';
        // TODO put this back && typeof (JSInterface.bridgeSendObjectToNative) === 'function';

        this._isWebKit = typeof (webkit) !== 'undefined'
            && typeof (webkit.messageHandlers) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSendBooleanToNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSendIntegerToNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSendStringToNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSendObjectToNative) !== 'undefined';

        // Ch5Debug.info(dbgKey,' end ');
    }


    /**
     * allows subscribing to signals from native
     *
     */
    public subscribe(signalName: string, type: TSignalStandardTypeName): void {
        const dbgKey = 'Ch5SignalBridge.subscribe';
        Ch5Debug.info(dbgKey, '"' + signalName + '":"' + type + '"');

        if (this._subscriptions[type].has(signalName) || this._localPublishers[type].has(signalName)) {
            return;
        }
        this._subscriptions[type].add(signalName);
        if (this._isWebView
            && typeof (JSInterface.bridgeSubscribeBooleanSignalFromNative) === 'function'
            && typeof (JSInterface.bridgeSubscribeIntegerSignalFromNative) === 'function'
            && typeof (JSInterface.bridgeSubscribeStringSignalFromNative) === 'function'
            && typeof (JSInterface.bridgeSubscribeObjectSignalFromNative) === 'function') {
            switch (type) {
                case 'boolean':
                    JSInterface.bridgeSubscribeBooleanSignalFromNative(signalName);
                    break;
                case 'number':
                    JSInterface.bridgeSubscribeIntegerSignalFromNative(signalName);
                    break;
                case 'string':
                    JSInterface.bridgeSubscribeStringSignalFromNative(signalName);
                    break;
                case 'object': // tslint:disable-line:no-switch-case-fall-through
                default:
                    JSInterface.bridgeSubscribeObjectSignalFromNative(signalName);
                    break;
            }

        } else if (
            this._isWebKit
            && typeof (webkit.messageHandlers.bridgeSubscribeBooleanSignalFromNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSubscribeIntegerSignalFromNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSubscribeStringSignalFromNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeSubscribeObjectSignalFromNative) !== 'undefined'
        ) {
            switch (type) {
                case 'boolean':
                    webkit.messageHandlers.bridgeSubscribeBooleanSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
                case 'number':
                    webkit.messageHandlers.bridgeSubscribeIntegerSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
                case 'string':
                    webkit.messageHandlers.bridgeSubscribeStringSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
                case 'object': // tslint:disable-line:no-switch-case-fall-through
                default:
                    webkit.messageHandlers.bridgeSubscribeObjectSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
            }
        } 
        // it is not an error to not have these functions defined.
        // Ch5Debug.info(dbgKey,' end ');
    }



    /**
     * Allows canceling the subscription to a signal.
     * After calling this the native end will no longer call the bridge 'receive' methods to notify the JS of changes on
     * that signal
     *
     */
    public unsubscribe(signalName: string, type: string): void {
        const dbgKey = 'Ch5SignalBridge.unsubscribe';
        Ch5Debug.info(dbgKey, '"' + signalName + '":"' + type + '"');

        if (!this._subscriptions[type].has(signalName)) {
            return;
        }
        this._subscriptions[type].delete(signalName);
        if (this._isWebView
            && typeof (JSInterface.bridgeUnsubscribeBooleanSignalFromNative) === 'function'
            && typeof (JSInterface.bridgeUnsubscribeIntegerSignalFromNative) === 'function'
            && typeof (JSInterface.bridgeUnsubscribeStringSignalFromNative) === 'function'
            && typeof (JSInterface.bridgeUnsubscribeObjectSignalFromNative) === 'function') {
            switch (type) {
                case 'boolean':
                    JSInterface.bridgeUnsubscribeBooleanSignalFromNative(signalName);
                    break;
                case 'number':
                    JSInterface.bridgeUnsubscribeIntegerSignalFromNative(signalName);
                    break;
                case 'string':
                    JSInterface.bridgeUnsubscribeStringSignalFromNative(signalName);
                    break;
                case 'object':
                    JSInterface.bridgeUnsubscribeObjectSignalFromNative(signalName);
                    break;
                default:
                    JSInterface.bridgeUnsubscribeObjectSignalFromNative(signalName);
                    break;
            }
        } else if (
            this._isWebKit
            && typeof (webkit.messageHandlers.bridgeUnsubscribeBooleanSignalFromNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeUnsubscribeIntegerSignalFromNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeUnsubscribeStringSignalFromNative) !== 'undefined'
            && typeof (webkit.messageHandlers.bridgeUnsubscribeStringSignalFromNative) !== 'undefined'
        ) {
            switch (type) {
                case 'boolean':
                    webkit.messageHandlers.bridgeUnsubscribeBooleanSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
                case 'number':
                    webkit.messageHandlers.bridgeUnsubscribeIntegerSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
                case 'string':
                    webkit.messageHandlers.bridgeUnsubscribeStringSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
                case 'object': // tslint:disable-line:no-switch-case-fall-through
                default:
                    webkit.messageHandlers.bridgeUnsubscribeStringSignalFromNative.postMessage(this.createPMParam(signalName));
                    break;
            }
        }
        // it is not an error to not have these functions defined.
        // Ch5Debug.info(dbgKey,' end ');
    }

    /**
     * Allows calling the send...ToNative methods from one place
     */
    public publish(signalName: string, value: boolean | number | string | object | TRepeatDigitalSignalValue): void {
        const dbgKey = 'Ch5SignalBridge.publish';
        Ch5Debug.info(dbgKey, '"' + signalName + '":' + value);

        const valueType: string = typeof (value);
        // only one publisher.  unsubscribe if local publisher
        this.unsubscribe(signalName, valueType);
        this._localPublishers[valueType].add(signalName);

        switch (valueType) {
            case 'boolean':
                this.sendBooleanToNative(signalName, value as boolean);
                break;
            case 'number':
                this.sendIntegerToNative(signalName, value as number);
                break;
            case 'string':
                this.sendStringToNative(signalName, value as string);
                break;
            default:
                this.sendObjectToNative(signalName, value as object);
                break;
        }
    }

    /**
     * Sends a boolean signal through the JSInterface bridge
     */
    private sendBooleanToNative(signalName: string, value: boolean | object): void {
        const dbgKey = 'Ch5SignalBridge.sendBooleanToNative';
        Ch5Debug.info(dbgKey, '"' + signalName + '":' + value);

        if (this._isWebView) {
            JSInterface.bridgeSendBooleanToNative(signalName, value);
        } else if (this._isWebKit) {
            webkit.messageHandlers.bridgeSendBooleanToNative.postMessage(this.createPMParam(signalName, value));
        } else if (this._isWebXPanel()) {
            CommunicationInterface.bridgeSendBooleanToNative(signalName, value);
        } else {
            // TODO find a way to use this without interfering with the mocha tests
            // throw new Error('sendBooleanToNative() not implemented on this platform');
        }

        // Ch5Debug.info(dbgKey,' end ');
    }

    /**
     * Sends a numeric signal through the JSInterface bridge
     */
    private sendIntegerToNative(signalName: string, value: number): void {
        const dbgKey = 'Ch5SignalBridge.sendIntegerToNative';
        Ch5Debug.info(dbgKey,'"' + signalName + '":' + value);

        if (this._isWebView) {
            JSInterface.bridgeSendIntegerToNative(signalName, value);
        } else if (this._isWebKit) {
            webkit.messageHandlers.bridgeSendIntegerToNative.postMessage(this.createPMParam(signalName, value));
        } else if (this._isWebXPanel()) {
            CommunicationInterface.bridgeSendIntegerToNative(signalName, value);
        } else {
            // TODO find a way to use this without interfering with the mocha tests
            // throw new Error('sendIntegerToNative() not implemented on this platform');
        }

        // Ch5Debug.info(dbgKey,' end ');
    }

    /**
     *
     * Sends a string signal through the JSInterface bridge
     */
    private sendStringToNative(signalName: string, value: string): void {
        const dbgKey = 'Ch5SignalBridge.sendStringToNative';
        Ch5Debug.info(dbgKey,'"' + signalName + '":"' + value + '"');

        if (this._isWebView) {
            JSInterface.bridgeSendStringToNative(signalName, value);
        } else if (this._isWebKit) {
            webkit.messageHandlers.bridgeSendStringToNative.postMessage(this.createPMParam(signalName, value));
        } else if (this._isWebXPanel()) {
            CommunicationInterface.bridgeSendStringToNative(signalName, value);
        } else {
            // TODO find a way to use this without interfering with the mocha tests
            // throw new Error('sendStringToNative() not implemented on this platform');
        }

        // Ch5Debug.info(dbgKey,' end ');
    }

    /**
     *
     * Sends an object signal through the JSInterface bridge
     */
    private sendObjectToNative(signalName: string, value: object): void {
        const dbgKey = 'Ch5SignalBridge.sendObjectToNative';
        if (Ch5Debug.shouldDisplay(dbgKey)) {
          Ch5Debug.info(dbgKey, `"${signalName}": ${JSON.stringify(value)}`);
        }

        if (this._isWebView) {
            JSInterface.bridgeSendObjectToNative(signalName, JSON.stringify(value));
        } else if (this._isWebKit) {
            webkit.messageHandlers.bridgeSendObjectToNative.postMessage(this.createPMParam(signalName, value));
        } else if (this._isWebXPanel()) {
            CommunicationInterface.bridgeSendObjectToNative(signalName, JSON.stringify(value));
        } else {
            // TODO find a way to use this without interfering with the mocha tests
            // throw new Error('sendObjectToNative() not implemented on this platform');
        }

        // Ch5Debug.info(dbgKey,' end ');
    }

    /**
     *
     * Sends an array of signals to native
     */
    private sendArrayToNative(signalArray: any[]): void {
        // TODO
    }

    private _isWebXPanel(): boolean {
        const isWebXPanel = (typeof (CommunicationInterface) !== 'undefined'
            && (
                isFunction(CommunicationInterface.bridgeSendBooleanToNative)
                && isFunction(CommunicationInterface.bridgeSendIntegerToNative)
                && isFunction(CommunicationInterface.bridgeSendStringToNative)
                && isFunction(CommunicationInterface.bridgeSendObjectToNative)
            )
        );

        if (isWebXPanel) {
            this._isWebView = false;
        }

        return isWebXPanel;
        
    }
    /**
     * Current iOS container app needs object to be sent as json format string instead of object
     * Use this function to format and then have one place to change if change back to object
     * @param signalName signal name
     * @param value optional value
     */
    private createPMParam(signalName: string, value?: boolean | number | string | object): object | string {
        let paramValue: object;
        if (value !== undefined) {
            paramValue = { 'signal': signalName, 'value': value };
        }
        else {
            paramValue = { 'signal': signalName };
        }
        return JSON.stringify(paramValue);
    }
}

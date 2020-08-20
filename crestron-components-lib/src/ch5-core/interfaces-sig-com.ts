// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Describes functions related to sending signal values to the native app
 */
export interface ISigComSendToNative {
    bridgeSendBooleanToNative(signalName: string, value: boolean | object):void;
    bridgeSendIntegerToNative(signalName: string, value: number):void;
    bridgeSendStringToNative(signalName: string, value: string):void;
    bridgeSendObjectToNative(signalName: string, jsonEncodedString: string):void;
    bridgeSendArrayToNative(jsonEncodedArray: any[]):void;
}

/**
 * Describes functions for subscribing to signals from the native app
 */
export interface ISigComSubscribe {
    bridgeSubscribeBooleanSignalFromNative(signalName: string):void;
    bridgeSubscribeIntegerSignalFromNative(signalName: string):void;
    bridgeSubscribeStringSignalFromNative(signalName: string):void;
    bridgeSubscribeObjectSignalFromNative(signalName: string):void;
}

/**
 * Describes functions for subscribing to signals from the native app
 */
export interface ISigComUnsubscribe {
    bridgeUnsubscribeBooleanSignalFromNative(signalName: string):void;
    bridgeUnsubscribeIntegerSignalFromNative(signalName: string):void;
    bridgeUnsubscribeStringSignalFromNative(signalName: string):void;
    bridgeUnsubscribeObjectSignalFromNative(signalName: string):void;
}

/**
 * Describes functions for receiving signals from the native app
 */
export interface ISigComReceiveFromNative {
    bridgeReceiveBooleanFromNative(signalName: string, value: boolean):void;
    bridgeReceiveIntegerFromNative(signalName: string, value: number):void;
    bridgeReceiveStringFromNative(signalName: string, value: string):void;
    bridgeReceiveObjectFromNative(signalName: string, value: object):void;
    bridgeReceiveArrayFromNative(nameValuePairs: any[]):void;
}

/**
 * Describes interface to iOS Webkit functions.
 */
export interface ISigComSendWebkit {
    messageHandlers: ISigComSendWebkitMessageHandlers;
}

export type ISWebXPanel = {
    bridgeSendBooleanToNative(signalName: string, value: boolean | object):void;
    bridgeSendIntegerToNative(signalName: string, value: number):void;
    bridgeSendStringToNative(signalName: string, value: string):void;
}

export interface ISigComSendWebkitMessageHandlers {
    bridgeSendBooleanToNative:IWebkitMessageHandler;
    bridgeSendIntegerToNative:IWebkitMessageHandler;
    bridgeSendStringToNative:IWebkitMessageHandler;
    bridgeSendObjectToNative:IWebkitMessageHandler;
    bridgeSendArrayToNative:IWebkitMessageHandler;

    bridgeSubscribeBooleanSignalFromNative:IWebkitMessageHandler;
    bridgeSubscribeIntegerSignalFromNative:IWebkitMessageHandler;
    bridgeSubscribeStringSignalFromNative:IWebkitMessageHandler;
    bridgeSubscribeObjectSignalFromNative:IWebkitMessageHandler;

    bridgeUnsubscribeBooleanSignalFromNative:IWebkitMessageHandler;
    bridgeUnsubscribeIntegerSignalFromNative:IWebkitMessageHandler;
    bridgeUnsubscribeStringSignalFromNative:IWebkitMessageHandler;
    bridgeUnsubscribeObjectSignalFromNative:IWebkitMessageHandler;
}

export interface IWebkitMessageHandler {
    postMessage(obj:object|string):void;
}
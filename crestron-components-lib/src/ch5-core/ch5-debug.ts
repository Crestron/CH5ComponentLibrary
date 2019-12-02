// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {LogLevelEnum} from '../ch5-logger/enums/index';

export type TCh5DebugConfig={
    [key:string]: boolean | string | LogLevelEnum
}

export class Ch5Debug {

    /**
     * Config key used for debug messages filtering
     */
    public static DEBUG_MESSAGE_FILTER_SOURCE_KEY: string = 'Logger.messagesFilter.source';

    /**
     * Config key used for debug messages filtering level
     */
    public static DEBUG_MESSAGE_FILTER_LEVEL_KEY: string = 'Logger.messagesFilter.defaultLevel';

    public static CONSOLE_OVERRIDDEN: boolean = false;

    protected static _defaultConfig:TCh5DebugConfig  = {
        'Ch5SignalBridge.constructor':false,
        'Ch5SignalBridge.subscribe':false,
        'Ch5SignalBridge.unsubscribe':false,
        'Ch5SignalBridge.publish':false,
        'Ch5SignalBridge.sendBooleanToNative':false,
        'Ch5SignalBridge.sendIntegerToNative':false,
        'Ch5SignalBridge.sendStringToNative':false,
        'Ch5SignalBridge.sendObjectToNative':false,
        'bridgeReceiveIntegerFromNative':false,
        'bridgeReceiveBooleanFromNative':false,
        'bridgeReceiveStringFromNative':false,
        'bridgeReceiveObjectFromNative':false,
        'bridge.rcbTimerCallback':false,
        'bridge.clearTimersForSignal':false,
        'bridge.rcbIntervalTimerCallback':false,
        'Logger.messagesFilter.defaultLevel': LogLevelEnum.warning
    };

    protected static _config:TCh5DebugConfig = Ch5Debug._defaultConfig;


    public static shouldDisplay(key:string){
        return (Ch5Debug._config.hasOwnProperty(key) && true === Ch5Debug._config[key]);
    }

    public static info(key:string, message?: any, ...optionalParams: any[]): void {

        if ( Ch5Debug.shouldDisplay(key)) {
            // TODO add option to add optional timestamp
            // const ts: string = (new Date()).toISOString();
            console.log(key + ':' + message, optionalParams);
        }
    }

    /**
     *
     * Loads a new configuration. Overrides the existing one.
     */
    public static loadConfig(config:TCh5DebugConfig) {
        Ch5Debug._config = config;
    }

    /**
     * Changes the value of a key from the configuration
     */
    public static setConfigKeyValue(key:string, value:boolean | string | LogLevelEnum) {
        Ch5Debug._config[key] = value;
    }

    public static getConfig() {
        return Ch5Debug._config;
    }

    public static getConfigKeyValue(key:string) {
        return Ch5Debug._config[key];
    }

    public static enableAll() {
        for (const prop in Ch5Debug._config) {
            if (Ch5Debug._config.hasOwnProperty(prop)){
                Ch5Debug._config[prop] = true;
            }
        }
    }

    public static disableAll() {
        for (const prop in Ch5Debug._config) {
            if (Ch5Debug._config.hasOwnProperty(prop)){
                Ch5Debug._config[prop] = false;
            }
        }
    }
}

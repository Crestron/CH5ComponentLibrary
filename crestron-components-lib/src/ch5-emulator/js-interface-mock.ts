// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Mock JSInterface used for testing
 */
export class JSInterface { // tslint:disable-line:variable-name
    public static debug = false;

    public static bridgeSendBooleanToNative(signalName: string, value: boolean):void {
        if (JSInterface.debug){
            console.log('JSInterface send event to native -> ',' type:', ' boolean   ', 'event name: ', signalName, ' value: ', value);
        }
    };

    public static bridgeSendIntegerToNative(signalName:string, value:number):void {
        if (JSInterface.debug) {
            console.log('JSInterface send event to native -> ', ' type:', ' integer   ', 'event name: ', signalName, ' value: ', value);
        }
    };

    public static bridgeSendStringToNative(signalName: string, value: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface send event to native -> ', ' type:', ' string   ', 'event name: ', signalName, ' value: ', value);
        }
    };

    public static bridgeSendObjectToNative(signalName: string, object: object):void {
        if (JSInterface.debug) {
            console.log('JSInterface send event to native -> ', ' type:', ' object   ', 'event name: ', signalName, ' value: ', object);
        }
    };

    public static bridgeSendArrayToNative(jsonEncodedArray: any[]):void {
        if (JSInterface.debug) {
            console.log('JSInterface send array to native -> ', jsonEncodedArray);
        }
    };

    public static bridgeSubscribeBooleanSignalFromNative(signalName: string):void {
        if (JSInterface.debug){
            console.log('JSInterface subscribe:',' state name:', signalName, ' type ', 'boolean');
        }
    }

    public static bridgeSubscribeIntegerSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface subscribe:', ' state name:', signalName, ' type ', 'integer');
        }
    }

    public static bridgeSubscribeStringSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface subscribe:', ' state name:', signalName, ' type ', 'string');
        }
    }

    public static bridgeSubscribeObjectSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface subscribe:', ' state name:', signalName, ' type ', 'object');
        }
    }

    public static bridgeUnsubscribeBooleanSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface unsubscribe:', ' state name:', signalName, ' type ', 'boolean');
        }
    }

    public static bridgeUnsubscribeIntegerSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface unsubscribe:', ' state name:', signalName, ' type ', 'integer');
        }
    }

    public static bridgeUnsubscribeStringSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface unsubscribe:', ' state name:', signalName, ' type ', 'string');
        }
    }

    public static bridgeUnsubscribeObjectSignalFromNative(signalName: string):void {
        if (JSInterface.debug) {
            console.log('JSInterface unsubscribe:', ' state name:', signalName, ' type ', 'object');
        }
    }

};
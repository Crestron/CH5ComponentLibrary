// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

// global JSInterface

if (typeof JSInterface === "undefined"
    && (typeof (webkit) === 'undefined'
        || typeof (webkit.messageHandlers) === 'undefined'
        || typeof(webkit.messageHandlers.bridgeSendBooleanToNative) === 'undefined')) {
    JSInterface = (function(){
        return {
            bridgeSendBooleanToNative: bridgeSendBooleanToNative,
            bridgeSendIntegerToNative: bridgeSendIntegerToNative,
            bridgeSendStringToNative: bridgeSendStringToNative,
            bridgeSendObjectToNative: bridgeSendObjectToNative,
            bridgeSendArrayToNative: bridgeSendArrayToNative,

            bridgeSubscribeBooleanSignalFromNative: bridgeSubscribeBooleanSignalFromNative,
            bridgeSubscribeIntegerSignalFromNative: bridgeSubscribeIntegerSignalFromNative,
            bridgeSubscribeStringSignalFromNative: bridgeSubscribeStringSignalFromNative,
            bridgeSubscribeObjectSignalFromNative: bridgeSubscribeObjectSignalFromNative,

            bridgeUnsubscribeBooleanSignalFromNative: bridgeUnsubscribeBooleanSignalFromNative,
            bridgeUnsubscribeIntegerSignalFromNative: bridgeUnsubscribeIntegerSignalFromNative,
            bridgeUnsubscribeStringSignalFromNative: bridgeUnsubscribeStringSignalFromNative,
            bridgeUnsubscribeObjectSignalFromNative: bridgeUnsubscribeObjectSignalFromNative
        };


        // bridgeSendBooleanToNative(signalName: string, value: boolean):void;
        function bridgeSendBooleanToNative(signalName, value){
            console.log('JSInterface send event to native -> ',' type:', ' boolean   ', 'event name: ', signalName, ' value: ', value);
        };

        // bridgeSendIntegerToNative(signalName: string, value: number):void;
        function bridgeSendIntegerToNative(signalName, value) {
            console.log('JSInterface send event to native -> ',' type:', ' integer   ', 'event name: ', signalName, ' value: ', value);
        };

        // bridgeSendStringToNative(signalName: string, value: string):void;
        function bridgeSendStringToNative(signalName, value) {
            console.log('JSInterface send event to native -> ',' type:', ' string   ', 'event name: ', signalName, ' value: ', value);
        };

        // bridgeSendObjectToNative(signalName: string, object: object):void;
        function bridgeSendObjectToNative(signalName, value) {
            console.log('JSInterface send event to native -> ',' type:', ' object   ', 'event name: ', signalName, ' value: ', value);
        };

        // bridgeSendArrayToNative(jsonEncodedArray: any[]):void;
        function bridgeSendArrayToNative(jsonEncodedArray) {
            console.log('JSInterface send array to native -> ', jsonEncodedArray);
        };



        // bridgeSubscribeBooleanSignalFromNative(signalName: string):void;
        function bridgeSubscribeBooleanSignalFromNative(signalName) {
            console.log('JSInterface subscribe:',' state name:', signalName, ' type ', 'boolean');
        }

        // bridgeSubscribeIntegerSignalFromNative(signalName: string):void;
        function bridgeSubscribeIntegerSignalFromNative(signalName) {
            console.log('JSInterface subscribe:',' state name:', signalName, ' type ', 'integer');
        }

        // bridgeSubscribeStringSignalFromNative(signalName: string):void;
        function bridgeSubscribeStringSignalFromNative(signalName) {
            console.log('JSInterface subscribe:',' state name:', signalName, ' type ', 'string');
        }

        // bridgeSubscribeObjectSignalFromNative(signalName: string):void;
        function bridgeSubscribeObjectSignalFromNative(signalName) {
            console.log('JSInterface subscribe:',' state name:', signalName, ' type ', 'object');
        }


        // bridgeUnsubscribeBooleanSignalFromNative(signalName: string):void;
        function bridgeUnsubscribeBooleanSignalFromNative(signalName) {
            console.log('JSInterface unsubscribe:',' state name:', signalName, ' type ', 'boolean');
        }

        // bridgeUnsubscribeIntegerSignalFromNative(signalName: string):void;
        function bridgeUnsubscribeIntegerSignalFromNative(signalName) {
            console.log('JSInterface unsubscribe:',' state name:', signalName, ' type ', 'integer');
        }

        // bridgeUnsubscribeStringSignalFromNative(signalName: string):void;
        function bridgeUnsubscribeStringSignalFromNative(signalName) {
            console.log('JSInterface unsubscribe:',' state name:', signalName, ' type ', 'string');
        }

        // bridgeUnsubscribeObjectSignalFromNative(signalName: string):void;
        function bridgeUnsubscribeObjectSignalFromNative(signalName) {
            console.log('JSInterface unsubscribe:',' state name:', signalName, ' type ', 'object');
        }

    })();  // (CrComLib);
}
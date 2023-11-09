// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { subscribeState } from "./subscribe-signal";
import { TSignalNonStandardTypeName } from "../types/core";
import { getState } from "./get-signal";
import { unsubscribeState } from "./unsubscribe-signal";
import { Ch5Signal } from "../ch5-signal";

export type TSigNameTypeSub = { sigName: string; sigType: 'b' | 'n' | 's'; sigSub: string; };
/**
 * A global hash table used to keep track of signal subscriptions used in the subscribeStateScript utility function
 */
export const subscribeStateScriptSigSubs: {
    [key: string]: TSigNameTypeSub[]
} = {};

let subSigScriptIndex = 0;
export function generateSubSigScriptKey(): string {
    return 'ch5SubSigScript-' + (++subSigScriptIndex);
}

/**
 * Unsubscribes from all the signals involved in a signalScript template string that was passed to the
 * subscribeStateScript function
 *
 * @param subKey string - the subscription key returned by the subscribeStateScript function
 */
export function unsubscribeStateScript(subKey: string) {
    if (!subscribeStateScriptSigSubs.hasOwnProperty(subKey)) {
        return;
    }
    subscribeStateScriptSigSubs[subKey].forEach((item: TSigNameTypeSub) => {
        unsubscribeState(item.sigType, item.sigName, item.sigSub);
    });
}

/**
 *
 * Signal tokens contained in the signalScript param are definded by {{type.signal_name}} where type can be:
 * - b for boolean
 * - n for number
 * - s for string
 * Example: For a string signal named customClass the token will be {{s.customClass}}
 * @returns string - a subscription key that references an array with all signal subscriptions used in the signalScript string
 */
export function subscribeStateScript(signalScript: string,
    callback: (update: string) => {},
    defaultValue?: string): string {
    const signalTokens = new Set<string>();

    if (typeof defaultValue === "undefined"
        || null === defaultValue) {
        defaultValue = "undefined";
    }

    // parse and extract signal names
    signalScript.replace(/{{([bns]\.([A-Za-z]|[0-9])([A-Za-z0-9_.])*)}}/g,
        (substring: string, ...args: any[]): string => {
            if (typeof args[0] === "undefined") {
                return '';
            }
            signalTokens.add(args[0]);
            return '';
        });

    let sigName = '';
    let sigType = '';
    const sigTokensIterator = signalTokens.values();
    let item: any = sigTokensIterator.next();
    const subKeys: TSigNameTypeSub[] = [];
    while (typeof item.value !== "undefined") {
        sigType = item.value.split('.')[0];
        const joinsList = (item.value.split('.')).slice(1);
        sigName = joinsList.join(".");

        // augment signal name in case of join numbers
        sigName = Ch5Signal.getSubscriptionSignalName(sigName);

        const subCallback = () => {
            const processedTempl = _callbackForSignalScriptOnSignalUpdate(signalTokens, signalScript, defaultValue as string);
            if (typeof callback === 'function') {
                callback.bind(null, processedTempl)();
            }
        };
        const subId: string = subscribeState(sigType as TSignalNonStandardTypeName, sigName, subCallback);
        const sigNameTypeSub: TSigNameTypeSub = {
            'sigName': sigName,
            'sigType': sigType as 'b' | 'n' | 's',
            'sigSub': subId
        };
        subKeys.push(sigNameTypeSub);
        item = sigTokensIterator.next();
    }
    const sigSubScriptKey = generateSubSigScriptKey();
    subscribeStateScriptSigSubs[sigSubScriptKey] = subKeys;

    const pTpl = _callbackForSignalScriptOnSignalUpdate(signalTokens, signalScript, defaultValue as string);
    if (typeof callback === 'function') {
        callback.bind(null, pTpl)();
    }

    return sigSubScriptKey;
}

function _callbackForSignalScriptOnSignalUpdate(signalTokens: Set<string>,
    scriptTemplate: string, defaultValue: string): string {
    let processedTemplate = scriptTemplate;

    const sigTokensIterator = signalTokens.values();
    let item: any = sigTokensIterator.next();
    let sigName = '';
    let sigType = '';
    while (typeof item.value !== "undefined") {
        sigType = item.value.split('.')[0];
        const joinsList = (item.value.split('.')).slice(1);
        sigName = joinsList.join(".");
        const sigVal = getState(sigType as TSignalNonStandardTypeName, sigName);
        if (sigVal === null) {
            processedTemplate = defaultValue;
            break;
        } else {
            processedTemplate = processedTemplate.replace(
                new RegExp('\\{\\{' + item.value + '\\}\\}', 'g'), sigVal as string);
        }

        item = sigTokensIterator.next();
    }

    if (defaultValue !== processedTemplate) {
        // interpret the js from the scriptTemplate string
        processedTemplate = (new Function("return " + processedTemplate))();
    }

    return processedTemplate;

}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {Ch5AttrsLog} from './ch5-attrs-log';
import {Ch5Signal, Ch5SignalFactory} from "../ch5-core";
import { CustomAttribute, ICh5AttrsInnerHTML } from './interfaces';

/**
 * TODO: Ch5AttrsTextContent, Ch5AttrsInnerhtml, Ch5AttrsAppendstyle, Ch5AttrsAppendclass are very similar.
 * Extract common functionality in a new class that is is extended by these classes (future task)
 */
export class Ch5AttrsInnerhtml extends CustomAttribute<string> implements ICh5AttrsInnerHTML{

    public static DATA_CH5_ATTR_NAME: string = 'data-ch5-innerhtml';
    public static CH5_ATTR_SIG_SUB_KEY: string = 'data-ch5-innerhtml-sub-key';

    public static handleBeingAddedToDom(el: Element) {
        const sigName: string = el.getAttribute(Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME) || '';
        const oldSubKey = el.getAttribute(Ch5AttrsInnerhtml.CH5_ATTR_SIG_SUB_KEY) as string;

        if (oldSubKey !== '') {
            Ch5AttrsInnerhtml.handleUnsubscribe(el, sigName, oldSubKey);
        }
        Ch5AttrsInnerhtml.handleSubscribe(el, sigName);
    }

    public static handleBeingRemovedFromDom(el: Element) {
        const sigName: string = el.getAttribute(Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME) || '';
        const oldSubKey = el.getAttribute(Ch5AttrsInnerhtml.CH5_ATTR_SIG_SUB_KEY) as string;

        Ch5AttrsInnerhtml.handleUnsubscribe(el, sigName, oldSubKey);
    }

    public static handleSubscribe(el: Element, sigName: string): string {
        if (sigName === '' || sigName === null) {
            return '';
        }

        const _debug: boolean = el.hasAttribute('debug');
        Ch5AttrsLog.info(_debug, `handleSubscribe ${sigName}`, el);

        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        const sig = Ch5SignalFactory.getInstance().getStringSignal(subSigName);
        let subKey = '';

        if (null !== sig) {
            subKey = sig.subscribe((sigVal: string): any => {
                if (el.innerHTML !== sigVal) {
                    el.innerHTML = sigVal;
                    Ch5AttrsLog.info(_debug, `innerHTML updated to ${sigVal}`, el);
                }
            });

            el.setAttribute(Ch5AttrsInnerhtml.CH5_ATTR_SIG_SUB_KEY, subKey);
        }
        Ch5AttrsLog.info(_debug, ` subscribed to ${sigName}, subKey is ${subKey}`, el);
        return subKey;
    }

    public static handleUnsubscribe(el: Element, sigName: string, subKey: string) {

        if (sigName === '' || subKey === '' || sigName === null || subKey === null) {
            return;
        }
        const _debug: boolean = el.hasAttribute('debug');
        Ch5AttrsLog.info(_debug,
            `handleUnsubscribe: preparing to unsubscribe from ${sigName} with subKey: ${subKey}`, el);

        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        const sig = Ch5SignalFactory.getInstance().getStringSignal(subSigName);

        if (null !== sig && subKey !== '') {
            sig.unsubscribe(subKey);
            Ch5AttrsLog.info(_debug, ` unsubscribed from ${sigName} with subKey: ${subKey}`, el);
        }
    }

    public static handleCh5InnerhtmlAttrChange(newValue: string | null, oldValue: string | null, el: Element): void {
        /**
         * cases:
         *  1. attribute value changes
         *  2. attribute value is null (attr deleted)
         *  3. attribute is added (prev val is null)
         */
        if (typeof oldValue === 'string' && oldValue !== '') {
            const oldSubKey = el.getAttribute(Ch5AttrsInnerhtml.CH5_ATTR_SIG_SUB_KEY) || '';
            if (oldSubKey !== '') {
                Ch5AttrsInnerhtml.handleUnsubscribe(el, oldValue, oldSubKey);
            }
        }

        if (typeof newValue === 'string' && newValue !== '' && newValue !== oldValue) {
            Ch5AttrsInnerhtml.handleSubscribe(el, newValue);
        }
    }

}

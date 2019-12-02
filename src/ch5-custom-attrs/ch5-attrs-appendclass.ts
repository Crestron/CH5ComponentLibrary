// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {Ch5AttrsLog} from './ch5-attrs-log';
import {Ch5Signal, Ch5SignalFactory} from "../ch5-core";
import {ICh5AttrsAppendclass} from '../_interfaces/ch5-custom-attrs/i-ch5-attrs-appendclass';
import { CustomAttribute } from '../_interfaces/ch5-custom-attrs/helpers/custom-attribute';
/**
 * TODO: Ch5AttrsTextContent, Ch5AttrsInnerhtml, Ch5AttrsAppendstyle, Ch5AttrsAppendclass are very similar.
 * Extract common functionality in a new class that is is extended by these classes (future task)
 */
export class Ch5AttrsAppendclass extends CustomAttribute<string> implements ICh5AttrsAppendclass {

    public static DATA_CH5_ATTR_NAME: string = 'data-ch5-appendclass';
    public static CH5_ATTR_SIG_SUB_KEY: string = 'data-ch5-appendclass-sub-key';

    public static handleBeingAddedToDom(el: Element) {
        const sigName: string = el.getAttribute(Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME) || '';
        const oldSubKey = el.getAttribute(Ch5AttrsAppendclass.CH5_ATTR_SIG_SUB_KEY) as string;

        if (oldSubKey !== '') {
            Ch5AttrsAppendclass.handleUnsubscribe(el, sigName, oldSubKey);
        }
        Ch5AttrsAppendclass.handleSubscribe(el, sigName);
    }

    public static handleBeingRemovedFromDom(el: Element) {
        const sigName: string = el.getAttribute(Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME) || '';
        const oldSubKey = el.getAttribute(Ch5AttrsAppendclass.CH5_ATTR_SIG_SUB_KEY) as string;

        Ch5AttrsAppendclass.handleUnsubscribe(el, sigName, oldSubKey);
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
                const newClassesList: string[] = sigVal.split(' ');

                const currentClasses: string = (el as any).currentCh5AppendclassVal;
                // remove prev added classes
                if (typeof currentClasses === 'string' && currentClasses !== "") {
                    const currentClassesList: string[] = currentClasses.split(' ');
                    if (currentClassesList.length > 0) {
                        currentClassesList.forEach((elClass: string) => {
                            if (elClass !== '' && el.classList.contains(elClass) &&
                                newClassesList.indexOf(elClass) === -1) {
                                // remove only if class was prev added and is not in the new received classes list
                                el.classList.remove(elClass);
                            }
                        });
                    }
                }
                // add new classes if not already present
                if (newClassesList.length > 0) {
                    newClassesList.forEach((newClass: string) => {
                        if (!el.classList.contains(newClass) && newClass !== '') {
                            el.classList.add(newClass);
                        }
                    });
                }
                Ch5AttrsLog.info(_debug, `innerHTML updated to ${sigVal}`, el);
                (el as any).currentCh5AppendclassVal = sigVal;
            });

            el.setAttribute(Ch5AttrsAppendclass.CH5_ATTR_SIG_SUB_KEY, subKey);
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

    public static handleCh5AppendclassAttrChange(newValue: string | null, oldValue: string | null, el: Element): void {
        /**
         * cases:
         *  1. attribute value changes
         *  2. attribute value is null (attr deleted)
         *  3. attribute is added (prev val is null)
         */
        if (typeof oldValue === 'string' && oldValue !== '') {
            const oldSubKey = el.getAttribute(Ch5AttrsAppendclass.CH5_ATTR_SIG_SUB_KEY) || '';
            if (oldSubKey !== '') {
                Ch5AttrsAppendclass.handleUnsubscribe(el, oldValue, oldSubKey);
            }
        }

        if (typeof newValue === 'string' && newValue !== '' && newValue !== oldValue) {
            Ch5AttrsAppendclass.handleSubscribe(el, newValue);
        }
    }

}

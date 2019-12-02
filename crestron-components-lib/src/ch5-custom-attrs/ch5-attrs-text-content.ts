// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AttrsLog } from './ch5-attrs-log';
import {Ch5Signal, Ch5SignalFactory} from "../ch5-core";
import { ICh5AttrsTextContent } from '../_interfaces/ch5-custom-attrs/i-ch5-attrs-text-content';
import { CustomAttribute } from '../_interfaces/ch5-custom-attrs/helpers/custom-attribute';

import {Ch5TranslationUtility} from "../ch5-core/ch5-translation-utility";

export class Ch5AttrsTextContent extends CustomAttribute<string> implements ICh5AttrsTextContent {

    public static DATA_CH5_ATTR_NAME: string = 'data-ch5-textcontent';
    // public static DEFAULT_STR_REPLACE_VAL: string = 'placeholder_for_signal_value';
    public static CH5_ATTR_SIG_SUB_KEY: string = 'data-ch5-sub-key';


    public static handleBeingAddedToDom(el:Element) {
        // const _debug: boolean = el.hasAttribute('debug');
        const sigName: string = el.getAttribute(Ch5AttrsTextContent.DATA_CH5_ATTR_NAME) || '';
        const oldSubKey =  el.getAttribute(Ch5AttrsTextContent.CH5_ATTR_SIG_SUB_KEY) as string;

        if (oldSubKey !== ''){
            Ch5AttrsTextContent.handleUnsubscribe(el, sigName, oldSubKey);
        }
        Ch5AttrsTextContent.handleSubscribe(el, sigName);
    }

    public static handleBeingRemovedFromDom(el: Element) {
        // const _debug: boolean = el.hasAttribute('debug');
        const sigName: string = el.getAttribute(Ch5AttrsTextContent.DATA_CH5_ATTR_NAME) || '';
        const oldSubKey =  el.getAttribute(Ch5AttrsTextContent.CH5_ATTR_SIG_SUB_KEY) as string;

        Ch5AttrsTextContent.handleUnsubscribe(el, sigName, oldSubKey);
    }

    public static handleSubscribe(el: Element, sigName: string):string {
        const _debug: boolean = el.hasAttribute('debug');

        Ch5AttrsLog.info(_debug, `handleSubscribe ${sigName}`, el);
        if (sigName === '') {
            return '';
        }

        let oldTextContent = el.textContent;
        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        const sig = Ch5SignalFactory.getInstance().getStringSignal(subSigName);
        let subKey='';

        if ( null !== sig) {
            subKey = sig.subscribe( (sigVal: string): any => {
                if (el.textContent !== sigVal){
                    el.textContent = Ch5TranslationUtility.getInstance().translatedValue(sigVal);
                    Ch5AttrsLog.info(_debug, `textContent changed from ${oldTextContent} to ${el.textContent}`, el);
                    oldTextContent = el.textContent;
                }
            });

            el.setAttribute(Ch5AttrsTextContent.CH5_ATTR_SIG_SUB_KEY, subKey);
        }
        Ch5AttrsLog.info(_debug, ` subscribed to ${sigName}, subKey is ${subKey}`, el);
        return subKey;
     }

    public static handleUnsubscribe(el: Element, sigName:string, subKey:string) {
        const _debug: boolean = el.hasAttribute('debug');
        Ch5AttrsLog.info(_debug, `handleUnsubscribe ${sigName}`, el);
        if (sigName === '' || subKey === '') {
            return;
        }
        Ch5AttrsLog.info(_debug, ` preparing to unsubscribe from ${sigName} with subKey: ${subKey}`, el);

        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        const sig = Ch5SignalFactory.getInstance().getStringSignal(subSigName);

        if (null !== sig && subKey !== '') {
            sig.unsubscribe(subKey);
            Ch5AttrsLog.info(_debug, ` unsubscribed from ${sigName} with subKey: ${subKey}`, el);
        }
    }

    public static handleCh5TextContentAttrChange(newValue: string | null, oldValue: string | null, el: Element): void {
        /**
         * cases:
         *  1. attribute value changes
         *  2. attribute value is null (attr deleted)
         *  3. attribute is added (prev val is null)
         */
        if (typeof oldValue === 'string' && oldValue !== '') {
            const oldSubKey =  el.getAttribute(Ch5AttrsTextContent.CH5_ATTR_SIG_SUB_KEY) || '';
            if (oldSubKey !== ''){
                Ch5AttrsTextContent.handleUnsubscribe(el, oldValue, oldSubKey);
            }
        }

        if (typeof newValue === 'string' && newValue !== '' && newValue !== oldValue) {
            Ch5AttrsTextContent.handleSubscribe(el, newValue);
        }
    }

}

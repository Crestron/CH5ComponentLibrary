// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AttrsLog } from './ch5-attrs-log';
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5AttrShowTypes } from '../_interfaces/ch5-custom-attrs/types/ch5-attr-show-types';
import { CustomAttribute } from '../_interfaces/ch5-custom-attrs/helpers/custom-attribute';
import { ICh5AttrsShow } from '../_interfaces/ch5-custom-attrs/i-ch5-attrs-show';

export class Ch5AttrsShow extends CustomAttribute<Ch5AttrShowTypes> implements ICh5AttrsShow {

    public static DATA_CH5_ATTR_NAME: string = 'data-ch5-show';
    public static NOSHOW_VALUES: string[] = ['visibility', 'display', 'remove'];
    public static DEFAULT_NOSHOW_VALUE: string = 'display';
    public static KEEP_SIG_SUBS_ATTR: string = 'data-ch5-keep-sig-subscription';
    public static SIGNAL_SUBSCRIPTION_KEY_ATTR: string = 'data-ch5-show-subs-key';

    public static checkAndSubscribeToSignal(el: Element): void {
        if (el.hasAttribute(Ch5AttrsShow.DATA_CH5_ATTR_NAME)) {
            const _debug: boolean = el.hasAttribute('debug');

            const csf: Ch5SignalFactory = Ch5SignalFactory.getInstance();
            const sigName: string = el.getAttribute(Ch5AttrsShow.DATA_CH5_ATTR_NAME) || '';
            const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
            const sig: Ch5Signal<boolean> | null = csf.getBooleanSignal(subSigName);

            if (sig) {
                const subscriptionKey: string = sig.subscribe((dataCh5ShowVal: boolean) => {
                    Ch5AttrsShow.handleDataCh5ShowReceived(el, dataCh5ShowVal);
                });
                Ch5AttrsLog.info(_debug, `Signal subscription complete... ${subscriptionKey}`, el);
                el.setAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR, subscriptionKey);
            }
        }
    }

    public static handleElAddedToDOM(el: Element) {
        if (el.hasAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR)) {
            const _debug: boolean = el.hasAttribute('debug');
            Ch5AttrsLog.info(_debug,
                `Added node already has data-ch5-show 
                    subs: ${el.getAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR)}`, el);
        } else {
            // not subscribed to signal => subscribe
            Ch5AttrsShow.checkAndSubscribeToSignal(el);
        }
    }

    public static elHasRemovableSigSubscription(el: Element) {
        return el.hasAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR) &&
            el.hasAttribute(Ch5AttrsShow.DATA_CH5_ATTR_NAME) &&
            !el.hasAttribute(Ch5AttrsShow.KEEP_SIG_SUBS_ATTR);
    }

    protected static unsubscribeDataCh5ShowSig(sigName: string, sigSubsKey: string): void {
        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        const oldSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(subSigName);
        if (oldSig) {
            oldSig.unsubscribe(sigSubsKey);
        }
    }

    public static removeSigSubscription(el: Element) {
        const sigSubsKey: string = el.getAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR) || '';
        Ch5AttrsLog.info(true,
            `Node removed without using signal value... signal subscription: 
                    ${sigSubsKey} needs to be canceled`, el);
        const sigName: string = el.getAttribute(Ch5AttrsShow.DATA_CH5_ATTR_NAME) || '';
        Ch5AttrsShow.unsubscribeDataCh5ShowSig(sigName, sigSubsKey);
    }

    public static handleCh5ShowAttributeChange(newValue: string | null, oldValue: string | null, n: Element): void {
        /**
         * cases:
         *  1. attribute value changes => unsubscribe old sig/subscribe to new sig
         *  2. attribute value is empty => unsubscribe
         *  3. attribute value is null (attr deleted) => unsubscribe
         *  4. attribute is added (prev val is null) => subscribe
         */
        const _debug: boolean = n.hasAttribute('debug');
        const _currentSigSubsKey: string = n.getAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR) || '';

        if (typeof oldValue === 'string' && oldValue !== '' && _currentSigSubsKey !== '') {
            // covers cases nr 1, 2 and 3
            Ch5AttrsLog.info(_debug, `Unsubscribing ${_currentSigSubsKey}`, n);
            this.unsubscribeDataCh5ShowSig(oldValue, _currentSigSubsKey);
            n.removeAttribute(Ch5AttrsShow.SIGNAL_SUBSCRIPTION_KEY_ATTR);
        }

        if (typeof newValue === 'string' && newValue !== '') {
            // subscribe to the new signal; covers cases nr 1 and 4
            Ch5AttrsShow.checkAndSubscribeToSignal(n);
        }
    }

    public static getNoShowType(el: Element): string {
        let _noShowType: string = '';
        if (el.hasAttribute('data-ch5-noshow-type')) {
            _noShowType = el.getAttribute('data-ch5-noshow-type') || '';
        } else {
            // get no show value defaults by tag name
            switch (el.tagName.toLowerCase()) {
                case 'p':
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    _noShowType = 'display';
                    break;
                case 'div':
                    _noShowType = 'remove';
                    break;
                default:
                    // default: img and other elements
                    _noShowType = 'visibility';
            }
        }

        // make sure no show value is valid before returning final value
        return (Ch5AttrsShow.NOSHOW_VALUES.indexOf(_noShowType) > -1)
            ? _noShowType
            : Ch5AttrsShow.DEFAULT_NOSHOW_VALUE;
    }


    public static handleDataCh5ShowReceived(el: Element, show: boolean): void {
        if (!show) {
            // hide element
            const noshowType: string = Ch5AttrsShow.getNoShowType(el);
            Ch5AttrsShow.hideElement(el, noshowType);
        } else {
            // show element
            Ch5AttrsShow.showElement(el);
        }
    }

    public static hideElement(el: Element, noshowType: string): void {
        Ch5AttrsLog.info(el.hasAttribute('debug'),
            `Hide element using NOSHOW_TYPE: ${noshowType}`,
            el);
        switch (noshowType) {
            case 'display':
                el.classList.add('ch5-hide-dis');
                el.classList.remove('ch5-hide-vis');
                break;
            case 'visibility':
                el.classList.add('ch5-hide-vis');
                el.classList.remove('ch5-hide-dis');
                break;
            default:
                // TODO: TBD
                el.setAttribute(Ch5AttrsShow.KEEP_SIG_SUBS_ATTR, '');

                // TODO: maybe we can use Object.defineProperty to define cachedP and sib?
                const parent: Node | null = el.parentElement;
                const sib: Node | null = el.nextSibling;

                if (parent) {
                    parent.removeChild(el);
                    (el as any).cachedP = parent;
                }
                if (sib) {
                    (el as any).sib = sib;
                }
        }
    }

    public static showElement(el: Element): void {
        const cachedP: Element | null = (el as any).cachedP;
        let debugMsg: string = 'Element visibility/display restored.';
        const debugOtp: any[] = [el];
        if (cachedP) {
            const elSib: Element | null = (el as any).sib;
            debugOtp.push(cachedP);
            if (elSib && cachedP === elSib.parentElement) { // both el and sib el are child elements of same parent
                cachedP.insertBefore(el, elSib);
                debugMsg = 'Element re-stamped to DOM using cached parent and sibling elements. ' + debugMsg;
                debugOtp.push(elSib);
                delete (el as any).sib;
            } else { // no sibling el, append directly to parent element
                cachedP.appendChild(el);
                debugMsg = 'Element re-stamped to DOM using only cached parent, no sibling element required. '
                    + debugMsg;
            }

            delete (el as any).cachedP;
            el.removeAttribute(Ch5AttrsShow.KEEP_SIG_SUBS_ATTR);
        }
        Ch5AttrsLog.info(el.hasAttribute('debug'), debugMsg, ...debugOtp);
        el.classList.remove('ch5-hide-vis');
        el.classList.remove('ch5-hide-dis');
    }

}

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

export class Ch5AttrsHidePulse extends CustomAttribute<Ch5AttrShowTypes> implements ICh5AttrsShow {

    public static DATA_CH5_ATTR_NAME: string = 'data-ch5-hidepulse';
    public static NOSHOW_VALUES: string[] = ['visibility', 'display', 'remove'];
    public static DEFAULT_NOSHOW_VALUE: string = 'display';
    public static KEEP_SIG_SUBS_ATTR: string = 'data-ch5-keep-sig-subscription';
    public static SIGNAL_SUBSCRIPTION_KEY_ATTR: string = 'data-ch5-hide-pulse-subs-key';

    public static checkAndSubscribeToSignal(el: Element): void {
        if (el.hasAttribute(Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME)) {
            const _debug: boolean = el.hasAttribute('debug');

            const csf: Ch5SignalFactory = Ch5SignalFactory.getInstance();
            const sigName: string = el.getAttribute(Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME) || '';
            const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
            const sig: Ch5Signal<boolean> | null = csf.getBooleanSignal(subSigName);

            if (sig !== null) {
                const subscriptionKey: string = sig.subscribe((dataCh5ShowVal: boolean) => {
                    // console.log('signal data-ch5-show received...', dataCh5ShowVal);
                    if (false === sig.prevValue && true === dataCh5ShowVal) {
                        Ch5AttrsHidePulse.handleDataCh5HidePulseReceived(el, dataCh5ShowVal);
                    }

                });
                Ch5AttrsLog.info(_debug, `Signal subscription complete... ${subscriptionKey}`, el);
                el.setAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR, subscriptionKey);
            }
        }
    }

    public static handleElAddedToDOM(el: Element) {
        if (el.hasAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR)) {
            const _debug: boolean = el.hasAttribute('debug');
            Ch5AttrsLog.info(_debug,
                `Added node already has data-ch5-show 
                    subs: ${el.getAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR)}`, el);
        } else {
            // not subscribed to signal => subscribe
            Ch5AttrsHidePulse.checkAndSubscribeToSignal(el);
        }
    }

    public static elHasRemovableSigSubscription(el: Element) {
        return el.hasAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR) &&
            el.hasAttribute(Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME) &&
            !el.hasAttribute(Ch5AttrsHidePulse.KEEP_SIG_SUBS_ATTR);
    }

    protected static unsubscribeDataCh5HidePulseSig(sigName: string, sigSubsKey: string): void {
        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        const oldSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(subSigName);
        if (oldSig) {
            oldSig.unsubscribe(sigSubsKey);
        }
    }

    public static removeSigSubscription(el: Element) {
        const sigSubsKey: string = el.getAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR) || '';
        Ch5AttrsLog.info(true,
            `Node removed without using signal value... signal subscription: 
                    ${sigSubsKey} needs to be canceled`, el);
        const sigName: string = el.getAttribute(Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME) || '';
        Ch5AttrsHidePulse.unsubscribeDataCh5HidePulseSig(sigName, sigSubsKey);
    }

    public static handleCh5HidePulseAttributeChange(newValue: string | null, oldValue: string | null, n: Element): void {
        /**
         * cases:
         *  1. attribute value changes => unsubscribe old sig/subscribe to new sig
         *  2. attribute value is empty => unsubscribe
         *  3. attribute value is null (attr deleted) => unsubscribe
         *  4. attribute is added (prev val is null) => subscribe
         */
        const _debug: boolean = n.hasAttribute('debug');
        const _currentSigSubsKey: string = n.getAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR) || '';

        if (typeof oldValue === 'string' && oldValue !== '' && _currentSigSubsKey !== '') {
            // covers cases nr 1, 2 and 3
            Ch5AttrsLog.info(_debug, `Unsubscribing ${_currentSigSubsKey}`, n);
            this.unsubscribeDataCh5HidePulseSig(oldValue, _currentSigSubsKey);
            n.removeAttribute(Ch5AttrsHidePulse.SIGNAL_SUBSCRIPTION_KEY_ATTR);
        }

        if (typeof newValue === 'string' && newValue !== '') {
            // subscribe to the new signal; covers cases nr 1 and 4
            Ch5AttrsHidePulse.checkAndSubscribeToSignal(n);
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
        return (Ch5AttrsHidePulse.NOSHOW_VALUES.indexOf(_noShowType) > -1)
            ? _noShowType
            : Ch5AttrsHidePulse.DEFAULT_NOSHOW_VALUE;
    }


    public static handleDataCh5HidePulseReceived(el: Element, show: boolean): void {
        if (show) {
            // hide element
            const noshowType: string = Ch5AttrsHidePulse.getNoShowType(el);
            Ch5AttrsHidePulse.hideElement(el, noshowType);
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
                el.setAttribute(Ch5AttrsHidePulse.KEEP_SIG_SUBS_ATTR, '');

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

}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AttrsLog } from './ch5-attrs-log';
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { CustomAttribute, ICh5AttrsEnable } from './interfaces';
import { Ch5SignalAttributeRegistry } from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5AttrsEnable extends CustomAttribute<string> implements ICh5AttrsEnable {

  public static DATA_CH5_ATTR_NAME: string = 'data-ch5-enable';
  public static KEEP_SIG_SUBS_ATTR: string = 'data-ch5-keep-sig-subscription';
  public static SIGNAL_SUBSCRIPTION_KEY_ATTR: string = 'data-ch5-enable-subs-key';

  public static checkAndSubscribeToSignal(el: Element): void {
    if (el.hasAttribute(Ch5AttrsEnable.DATA_CH5_ATTR_NAME)) {
      const _debug: boolean = el.hasAttribute('debug');

      const csf: Ch5SignalFactory = Ch5SignalFactory.getInstance();
      const sigName: string = el.getAttribute(Ch5AttrsEnable.DATA_CH5_ATTR_NAME) || '';
      const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
      const sig: Ch5Signal<boolean> | null = csf.getBooleanSignal(subSigName);

      if (sig) {
        const subscriptionKey: string = sig.subscribe((dataCh5EnableVal: boolean) => {
          Ch5AttrsEnable.handleDataCh5EnableReceived(el, dataCh5EnableVal);
        });
        Ch5AttrsLog.info(_debug, `Signal subscription complete... ${subscriptionKey}`, el);
        el.setAttribute(Ch5AttrsEnable.SIGNAL_SUBSCRIPTION_KEY_ATTR, subscriptionKey);
      }
    }
  }

  public static handleElAddedToDOM(el: Element) {
    if (!el.hasAttribute(Ch5AttrsEnable.SIGNAL_SUBSCRIPTION_KEY_ATTR)) {
      // not subscribed to signal => subscribe
      Ch5AttrsEnable.checkAndSubscribeToSignal(el);
    }
  }

  public static elHasRemovableSigSubscription(el: Element) {
    return el.hasAttribute(Ch5AttrsEnable.SIGNAL_SUBSCRIPTION_KEY_ATTR) &&
      el.hasAttribute(Ch5AttrsEnable.DATA_CH5_ATTR_NAME) &&
      !el.hasAttribute(Ch5AttrsEnable.KEEP_SIG_SUBS_ATTR);
  }

  protected static unsubscribeDataCh5EnableSig(sigName: string, sigSubsKey: string): void {
    const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
    const oldSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(subSigName);
    if (oldSig) {
      oldSig.unsubscribe(sigSubsKey);
    }
  }

  public static removeSigSubscription(el: Element) {
    const sigSubsKey: string = el.getAttribute(Ch5AttrsEnable.SIGNAL_SUBSCRIPTION_KEY_ATTR) || '';
    Ch5AttrsLog.info(true,
      `Node removed without using signal value... signal subscription: 
                    ${sigSubsKey} needs to be canceled`, el);
    const sigName: string = el.getAttribute(Ch5AttrsEnable.DATA_CH5_ATTR_NAME) || '';
    Ch5AttrsEnable.unsubscribeDataCh5EnableSig(sigName, sigSubsKey);
  }

  public static handleCh5EnableAttributeChange(newValue: string | null, oldValue: string | null, n: Element): void {
    /**
     * cases:
     *  1. attribute value changes => unsubscribe old sig/subscribe to new sig
     *  2. attribute value is empty => unsubscribe
     *  3. attribute value is null (attr deleted) => unsubscribe
     *  4. attribute is added (prev val is null) => subscribe
     */
    const _debug: boolean = n.hasAttribute('debug');
    const _currentSigSubsKey: string = n.getAttribute(Ch5AttrsEnable.SIGNAL_SUBSCRIPTION_KEY_ATTR) || '';

    if (typeof oldValue === 'string' && oldValue !== '' && _currentSigSubsKey !== '') {
      Ch5AttrsLog.info(_debug, `Unsubscribing ${_currentSigSubsKey}`, n);
      this.unsubscribeDataCh5EnableSig(oldValue, _currentSigSubsKey);
      n.removeAttribute(Ch5AttrsEnable.SIGNAL_SUBSCRIPTION_KEY_ATTR);
    }

    if (typeof newValue === 'string' && newValue !== '') {
      Ch5AttrsEnable.checkAndSubscribeToSignal(n);
    }
  }

  public static handleDataCh5EnableReceived(el: Element, enable: boolean): void {
    console.log(el, enable);
    if (!enable) {
      // disable element
      el.classList.add('ch5-disabled');
    } else {
      // enable element
      el.classList.remove('ch5-disabled');
    }
  }

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addCustomAttributeEntry(Ch5AttrsEnable.DATA_CH5_ATTR_NAME,
      { direction: "state", booleanJoin: 1, contractName: true });
  }
}

Ch5AttrsEnable.registerSignalAttributeTypes();
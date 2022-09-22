// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


import _ from 'lodash';
import { Ch5List, Ch5ListSignature } from "./ch5-list";
import { Ch5SignalFactory, Ch5Signal } from "../ch5-core";
import { Ch5ListAbstractHelper } from "./ch5-list-abstract-helper";
import { TSignal } from '../ch5-core/types/signal.type';
import {Ch5SignalUpdateCallback} from "../ch5-core/types/callbacks";

export type SignalSubscription = (sigName: string | null | undefined, subscriptionKey: string) => void;
export type SignalSubscriptionCallback = (newValue: string | number | boolean) => void;

export class Ch5ListSignalManager extends Ch5ListAbstractHelper {

  public unsubscribeFromSignals(clearStringSignalSubscription: SignalSubscription) {

    const _listComponent = this._list as Ch5List;

    this.clearSubscription(
      clearStringSignalSubscription, _listComponent.receiveStateScrollToSub as string, 'receiveStateScrollTo');
    this.clearSubscription(
      clearStringSignalSubscription, _listComponent.receiveStateSize as string, 'receiveStateSize');
    this.clearSubscription(
      clearStringSignalSubscription, _listComponent.receiveStateTemplateVarsSub as string, 'receiveStateTemplateVars');
  }

  public subscribeToSignal<T extends TSignal>(type: T, signalPropName: string, signalSub: string, callback: Ch5SignalUpdateCallback<T>): string {

    if (signalPropName === undefined || signalSub === undefined) {
      return '';
    }

    // augment signal name for join number signal names
    signalPropName = Ch5Signal.getSubscriptionSignalName(signalPropName);

    // remove old subscription, if exist
    if (signalPropName !== undefined && signalPropName !== null) {
      const oldSignal = this.getStateFromFactory(signalPropName, type);

      if (oldSignal !== null) {
        oldSignal.unsubscribe(signalSub);
      }
    }

    // add new subscription
    const receiveSignal: Ch5Signal<T> | null = this.getStateFromFactory(signalPropName, type);

    if (_.isNil(receiveSignal)) {
      return '';
    }

    return receiveSignal.subscribe(callback.bind(this._list));
  }

  /**
   *
   * @param {string} signalName
   * @param {number|string|boolean|object} type
   */
  public getStateFromFactory<T extends TSignal>(signalName: string, type: T): Ch5Signal<T> | null {
    const signal: Ch5Signal<T> | null = Ch5SignalFactory.getInstance().getState(signalName, type);
    return signal;
  }

  private clearSubscription(clearSubscription: SignalSubscription, signalSub: string, signalName: string) {

    const _listComponent: Ch5ListSignature = {
      ...this._list
    };

    if ((signalName in _listComponent) && _listComponent[signalName] !== null) {
      clearSubscription(signalName, signalSub);
      _listComponent[signalName] = '';
    }
  }

}

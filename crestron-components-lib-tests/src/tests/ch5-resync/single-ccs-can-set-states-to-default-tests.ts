// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { Ch5SignalFactory, publishEvent } from '../../../../crestron-components-lib/src/ch5-core';
import { Ch5Resync } from "../../../../crestron-components-lib/src/ch5-resync/ch5-resync";
import { Ch5ResyncTestUtilities } from "../../utilities/ch5-resync-test-utilities";

let ch5SignalFactory;
let ch5ResyncInstance;

describe('Ch5 Resync Single CCS Resync - Can set states to default', () => {

    beforeEach(() => {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
        ch5ResyncInstance = Ch5Resync.Instance;
    });

    it('After EndOfUpdate will set to default [BOOLEAN] signal if it was not updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const booleanEvent = ch5SignalFactory.getBooleanSignal('test_state_boolean', false);
        expect(booleanEvent.value).to.equal(false);
    });

    it('After EndOfUpdate will set to default [STRING] signal if it was not updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const stringEvent = ch5SignalFactory.getStringSignal('test_state_string', false);
        expect(stringEvent.value).to.equal('');
    });

    it('After EndOfUpdate will set to default [NUMBER] signal if it was not updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const numberEvent = ch5SignalFactory.getNumberSignal('test_state_numeric', false);
        expect(numberEvent.value).to.equal(0);
    });

    it('After EndOfUpdate will set to default [RCB OBJECT] signal if it was not updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const objectEvent = ch5SignalFactory.getObjectSignal('test_state_object_rcb', false);
        expect(objectEvent.value.rcb.value).to.equal(0);
        expect(objectEvent.value.rcb.time).to.equal(0);
    });
});

function publishTestSignals() {
    publishEvent('boolean', 'test_state_boolean', true);
    publishEvent('string', 'test_state_string', 'random_string');
    publishEvent('numeric', 'test_state_numeric', 50);
    publishEvent('object', 'test_state_object_rcb', {"rcb": {"value": 33, "time": 500}});
}


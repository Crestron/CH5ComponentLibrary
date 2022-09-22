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

describe('Ch5 Resync Single CCS Resync - Will not reset to default updated states', () => {

    beforeEach(() => {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
        ch5ResyncInstance = Ch5Resync.Instance;
    });

    it('After EndOfUpdate will not set to default [BOOLEAN] signal if it was updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent('boolean', 'test_state_boolean', true);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getBooleanSignal('test_state_boolean', false);
        expect(event.value).to.equal(true);
    });

    it('After EndOfUpdate will not set to default [STRING] signal if it was updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent('string', 'test_state_string', 'value_modified_after_clear_all');
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getStringSignal('test_state_string', false);
        expect(event.value).to.equal('value_modified_after_clear_all');
    });

    it('After EndOfUpdate will not set to default [NUMERIC] signal if it was updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent('numeric', 'test_state_numeric', 123);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getNumberSignal('test_state_numeric', false);
        expect(event.value).to.equal(123);
    });

    it('After EndOfUpdate will not set to default [RCB OBJECT] signal if it was updated after ClearAll', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);
        publishEvent('object', 'test_state_object_rcb', {"rcb": {"value": 3450, "time": 67000}});
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getObjectSignal('test_state_object_rcb', false);
        expect(event.value.rcb.value).to.equal(3450);
        expect(event.value.rcb.time).to.equal(67000);
    });
});

function publishTestSignals() {
    publishEvent('boolean', 'test_state_boolean', true);
    publishEvent('string', 'test_state_string', 'random_string');
    publishEvent('numeric', 'test_state_numeric', 50);
    publishEvent('object', 'test_state_object_rcb', {"rcb": {"value": 33, "time": 500}});
}


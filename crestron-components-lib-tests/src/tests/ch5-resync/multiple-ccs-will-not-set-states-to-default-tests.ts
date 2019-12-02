// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { Ch5SignalFactory, publishEvent } from '../../../../crestron-components-lib/src/ch5-core';
import { Ch5Resync } from "../../../../crestron-components-lib/src/ch5-resync/ch5-resync";
import { ICh5ClearRangeDataModel } from '../../../../crestron-components-lib/src/ch5-resync/models/ch5-clear-range-data-model';
import { IResynchronizationRequestModel } from "../../../../crestron-components-lib/src/ch5-resync/models/resynchronization-request-model";
import { Ch5ResyncConstants } from "../../../../crestron-components-lib/src/ch5-resync/models/ch5-resync-constants";
import { Ch5ResyncTestUtilities } from "../../utilities/ch5-resync-test-utilities";

let ch5SignalFactory;
let ch5ResyncInstance;

describe('Ch5 Resync Multiple CCS Resync - Will not set states to default', () => {

    beforeEach(() => {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
        ch5ResyncInstance = Ch5Resync.Instance;
    });

    it('On EndOfUpdate will ignore / not reset [BOOLEAN] element not received on ClearRange', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, resyncEventValueOnClearRange);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getBooleanSignal('boolean_toggle_element_not_part_of_clear_range_request', false);
        expect(event.value).to.equal(true);
    });

    it('On EndOfUpdate will ignore / not reset [STRING] element not received on ClearRange', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, resyncEventValueOnClearRange);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getStringSignal('string_input_element_not_part_of_clear_range_request', false);
        expect(event.value).to.equal('random_string_2');
    });

    it('On EndOfUpdate will ignore / not reset [NUMBER] element not received on ClearRange', () => {
        publishTestSignals();

        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, resyncEventValueOnClearRange);
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnEndOfUpdate);

        const event = ch5SignalFactory.getNumberSignal('numeric_input_element_not_part_of_clear_range_request', false);
        expect(event.value).to.equal(23);
    });
});

// Utilities
const resyncEventValueOnClearRange: IResynchronizationRequestModel = {
    id: "Mock_ID",
    state: "ClearRange",
    value: {
        excludePrefixes: ["Csig"],
        range: clearRangeDataModel()
    },
};

function publishTestSignals() {
    publishEvent('boolean', 'boolean_toggle_element', true);
    publishEvent('boolean', 'some_random_element', true);
    publishEvent('string', 'string_input_element', 'random_string');
    publishEvent('string', 'some_random_element', 'random_string');
    publishEvent('number', 'numeric_input_element', 50);
    publishEvent('number', 'some_random_element', 50);

    publishEvent('boolean', 'boolean_toggle_element_not_part_of_clear_range_request', true);
    publishEvent('string', 'string_input_element_not_part_of_clear_range_request', 'random_string_2');
    publishEvent('number', 'numeric_input_element_not_part_of_clear_range_request', 23);

    const joinStatesToPublish = clearRangeDataModel();
    publishJoinSignals(joinStatesToPublish.boolean.joinLow, joinStatesToPublish.boolean.joinHigh, 'boolean');
    publishJoinSignals(joinStatesToPublish.numeric.joinLow, joinStatesToPublish.numeric.joinHigh, 'number');
    publishJoinSignals(joinStatesToPublish.string.joinLow, joinStatesToPublish.string.joinHigh, 'string');
}

function publishJoinSignals(joinLow: number, joinHigh: number, eventType: string) {
    for (let i = joinLow; i <= joinHigh; i++) {
        switch (eventType) {
            case 'boolean':
                publishEvent(eventType, Ch5ResyncConstants.JOIN_NUMBER_SIGNAL_NAME_PREFIX + i.toString(), true);
                break;
            case 'number':
                publishEvent(eventType, Ch5ResyncConstants.JOIN_NUMBER_SIGNAL_NAME_PREFIX + i.toString(), 1243);
                break;
            case 'string':
                publishEvent(eventType, Ch5ResyncConstants.JOIN_NUMBER_SIGNAL_NAME_PREFIX + i.toString(), 'test_value_for_strings');
                break;
            default:
                break;
        }
    }
}

function clearRangeDataModel(): ICh5ClearRangeDataModel {
    return {
        boolean: {
            stateNames: ['boolean_toggle_element', 'some_random_element'],
            joinLow: 10,
            joinHigh: 40
        },
        numeric: {
            stateNames: ['numeric_input_element', 'some_random_element'],
            joinLow: 20,
            joinHigh: 30
        },
        string: {
            stateNames: ['string_input_element', 'some_random_element'],
            joinLow: 30,
            joinHigh: 70
        }
    } as ICh5ClearRangeDataModel;
}


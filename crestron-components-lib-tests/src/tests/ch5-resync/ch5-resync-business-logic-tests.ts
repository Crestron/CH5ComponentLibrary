// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { Ch5SignalFactory, publishEvent } from '../../../../crestron-components-lib/src/ch5-core';
import { Ch5Resync } from "../../../../crestron-components-lib/src/ch5-resync/ch5-resync";
import { ICh5StatesAtDefaultValueModel } from "../../../../crestron-components-lib/src/ch5-resync/models/ch5-states-at-default-value-model";
import { Ch5ResyncTestUtilities } from "../../utilities/ch5-resync-test-utilities";
import { IResynchronizationRequestModel } from "../../../../crestron-components-lib/src/ch5-resync/models/resynchronization-request-model";

let ch5SignalFactory;
let ch5ResyncInstance;

describe('Ch5 Resync Single CCS Resync - Business logic miscellaneous tests', () => {

    beforeEach(() => {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
        ch5ResyncInstance = Ch5Resync.Instance;
        ch5ResyncInstance._statesAtDefaultValue = [];
    });

    it('On EndOfUpdate if an event / state does not exist will move to the next one', () => {
        ch5ResyncInstance._statesAtDefaultValue.push({
            name: 'state_does_not_exist',
            type: 'boolean'
        } as ICh5StatesAtDefaultValueModel);
        publishEvent('string', 'next_state', true);
        ch5ResyncInstance._statesAtDefaultValue.push({
            name: 'next_state',
            type: 'string'
        } as ICh5StatesAtDefaultValueModel);

        ch5ResyncInstance.setRemainingStatesToDefaultValue();

        const modifiedStringState = ch5SignalFactory.getStringSignal('next_state', false);
        expect(modifiedStringState.value).to.equal('');
        const stateNotFound = ch5SignalFactory.getStringSignal('state_doe_not_exist', false);
        expect(stateNotFound).to.equal(null);
    });

    it('On ClearAll will not add Csig.State_Synchronization event to _statesAtDefaultValue', () => {
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearRange);

        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('Csig.State_Synchronization')).to.equal(-12);
    });

    it('On ClearRange will not add Csig.State_Synchronization event to _statesAtDefaultValue', () => {
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, Ch5ResyncTestUtilities.resyncEventValueOnClearAll);

        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('Csig.State_Synchronization')).to.equal(-1);
    });

    it('On ClearRange will update _statesAtDefaultValue with received [BOOLEAN] signals', () => {
        ch5ResyncInstance.onReceiveClearRange(Ch5ResyncTestUtilities.clearRangeDataModel(), ['Csig']);

        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'boolean').length).to.equal(33);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('boolean_toggle_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('some_random_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb10')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb40')).to.be.greaterThan(-1);
    });

    it('On ClearRange will update _statesAtDefaultValue with received [NUMBER] signals', () => {
        ch5ResyncInstance.onReceiveClearRange(Ch5ResyncTestUtilities.clearRangeDataModel(), ['Csig']);

        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'number').length).to.equal(13);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('numeric_input_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('some_random_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb20')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb30')).to.be.greaterThan(-1);
    });

    it('On ClearRange will update _statesAtDefaultValue with received [STRING] signals', () => {
        ch5ResyncInstance.onReceiveClearRange(Ch5ResyncTestUtilities.clearRangeDataModel(), ['Csig']);

        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'string').length).to.equal(43);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('string_input_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('some_random_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb30')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb70')).to.be.greaterThan(-1);
    });

    it('On ClearRange will not add join states if both joinLow and joinHigh are equal to 0', () => {
        const model = Ch5ResyncTestUtilities.clearRangeDataModel();
        model.boolean.joinLow = 0;
        model.boolean.joinHigh = 0;
        model.numeric.joinLow = 0;
        model.numeric.joinHigh = 0;
        model.string.joinLow = 0;
        model.string.joinHigh = 0;

        ch5ResyncInstance.onReceiveClearRange(model, ['boolean_toggle_element', 'some_random_element']);

        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'boolean').length).to.equal(0);
        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'number').length).to.equal(1);
        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'string').length).to.equal(1);
    });

    it('On ClearRange if no stateNames are provided for a given event type can still compute its joins and move to the next event type', () => {
        const model = Ch5ResyncTestUtilities.clearRangeDataModel();
        model.boolean.stateNames = [];

        ch5ResyncInstance.onReceiveClearRange(model, []);

        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'boolean').length).to.equal(31);
        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'string').length).to.equal(43);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('string_input_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('some_random_element')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb30')).to.be.greaterThan(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('fb70')).to.be.greaterThan(-1);
    });

    it('On ClearRange will not add any state of type object to _statesAtDefaultValue', () => {
        const model = Ch5ResyncTestUtilities.clearRangeDataModel();
        model.boolean.stateNames = [];

        ch5ResyncInstance.onReceiveClearRange(model, []);

        expect(ch5ResyncInstance._statesAtDefaultValue.filter(x => x.type === 'object').length).to.equal(0);
    });

    it('On ClearAll will exclude states based on excludePrefixes', () => {
        const onClearAll: IResynchronizationRequestModel = {
            id: "Mock_ID",
            state: "ClearAll",
            value: {excludePrefixes: ["test_state"]}
        };

        publishTestSignals();
        publishEvent('object', 'different_key_test_state_object_rcb', {"rcb": {"value": 33, "time": 500}});
        publishEvent(Ch5ResyncTestUtilities.resyncEventType, Ch5ResyncTestUtilities.resyncEventName, onClearAll);

        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('test_state_boolean')).to.equal(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('test_state_string')).to.equal(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('test_state_numeric')).to.equal(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('test_state_object_rcb')).to.equal(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('different_key_test_state_object_rcb')).to.be.greaterThan(-1);
    });

    it('On ClearRange will exclude states based on excludePrefixes', () => {
        ch5ResyncInstance.onReceiveClearRange(Ch5ResyncTestUtilities.clearRangeDataModel(), ['boolean_toggle_element', 'some_random_element', 'umeric_input_element']);

        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('boolean_toggle_element')).to.be.equal(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('some_random_element')).to.be.equal(-1);
        expect(ch5ResyncInstance._statesAtDefaultValue.map(x => x.name).indexOf('numeric_input_element')).to.be.greaterThan(-1);
    });
});

// Utilities:
function publishTestSignals() {
    publishEvent('boolean', 'test_state_boolean', true);
    publishEvent('string', 'test_state_string', 'random_string');
    publishEvent('numeric', 'test_state_numeric', 50);
    publishEvent('object', 'test_state_object_rcb', {"rcb": {"value": 33, "time": 500}});
}

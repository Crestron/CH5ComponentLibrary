// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { describe } from 'mocha';
import { TDataLog } from '../types';
import { LogLevelEnum } from '../enums';
import { LogMessagesFilter } from '../helpers/LogMessagesFilter';

describe('Ch5-debug-filter-message-tests', () => {

    let dataLog: TDataLog;
    let logFilter: LogMessagesFilter;

    beforeEach(() => {
        dataLog = {
            level: LogMessagesFilter.getDefaultLevel(),
            message: 'Test message',
            source: ''
        };

        logFilter = new LogMessagesFilter(LogLevelEnum.info, '', 'test');
    });

    // Log level filter tests
    it('Default logFilter level is warning', () => {
        const defaultLevel: LogLevelEnum = LogMessagesFilter.getDefaultLevel();
        expect(defaultLevel).to.be.equal(LogLevelEnum.warning);
    });

    it('Log messages with level >= filter level should be displayed', () => {
        dataLog.level = LogLevelEnum.info;
        logFilter.level = LogLevelEnum.error;

        const levelMatch1: boolean = logFilter.isMatchingFilterLevel(dataLog.level)
        const canBeDisplayed1 = logFilter.applyFilter(dataLog);

        // no match because filter log is bigger
        expect(levelMatch1).to.be.equal(false);
        expect(canBeDisplayed1).to.be.equal(false);

        dataLog.level = LogLevelEnum.error;
        logFilter.level = LogLevelEnum.warning;

        const levelMatch2: boolean = logFilter.isMatchingFilterLevel(dataLog.level)
        const canBeDisplayed2 = logFilter.applyFilter(dataLog);

        // match, because data log filter level is >= log filter level
        expect(levelMatch2).to.be.equal(true);
        expect(canBeDisplayed2).to.be.equal(true);
    });

    it('Will return true if log levels match and different than default level', () => {
        dataLog.level = LogLevelEnum.error;
        logFilter.level = LogLevelEnum.error;

        const levelMatch: boolean = logFilter.isMatchingFilterLevel(dataLog.level)
        const canBeDisplayed = logFilter.applyFilter(dataLog);

        expect(levelMatch).to.be.equal(true);
        expect(canBeDisplayed).to.be.equal(true);
    });

    // Log messages filter tests
    it('When filtering by message it is not case sensitive', () => {
        const regexMatch: boolean = logFilter.isMatchingFilterRegex(dataLog.message);
        const canBeDisplayed = logFilter.applyFilter(dataLog);

        expect(regexMatch).to.be.equal(true);
        expect(canBeDisplayed).to.be.equal(true);
    });

    it('Filtering by message using complex regex', () => {
        logFilter.regularExpression = '^test.*age$'; // starts with "test", ends with "age"
        const regexMatch: boolean = logFilter.isMatchingFilterRegex(dataLog.message);
        const canBeDisplayed = logFilter.applyFilter(dataLog);

        expect(regexMatch).to.be.equal(true);
        expect(canBeDisplayed).to.be.equal(true);

        logFilter.regularExpression = '^test.*gorilla$'; // starts with "test", ends with "gorilla"
        const rMatch: boolean = logFilter.isMatchingFilterRegex(dataLog.message);
        const canBeShown = logFilter.applyFilter(dataLog);

        expect(rMatch).to.be.equal(false);
        expect(canBeShown).to.be.equal(false);
    });


    // Log source filter tests
    it('Filter by source', () => {
        dataLog.source = 'Ch5SignalBridge.constructor';
        logFilter.source = 'Ch5SignalBridge.constructor';

        const fileMatch1: boolean = logFilter.isMatchingFilterSource(dataLog.source);
        const canBeDisplayed1 = logFilter.applyFilter(dataLog);

        expect(fileMatch1).to.be.equal(true);
        expect(canBeDisplayed1).to.be.equal(true);

        logFilter.source = 'Ch5SignalBridge.subscribe';

        const fileMatch2: boolean = logFilter.isMatchingFilterSource(dataLog.source);
        const canBeDisplayed2 = logFilter.applyFilter(dataLog);

        expect(fileMatch2).to.be.equal(false);
        expect(canBeDisplayed2).to.be.equal(false);
    });

});

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { Ch5Platform, Ch5SignalFactory, publishEvent } from "../../../../crestron-components-lib/src/ch5-core";
import { Ch5TouchActivity } from "../../../../crestron-components-lib/src/ch5-touch";

let ch5SignalFactory;
let ch5Platform;
let ch5TouchActivity;

describe('Ch5-Touch-Activity Tests', () => {
    beforeEach(() => {
        ch5SignalFactory = Ch5SignalFactory.getInstance();
        ch5SignalFactory.clearSignals(true);
        ch5Platform = Ch5Platform.getInstance();
        ch5TouchActivity = Ch5TouchActivity.getInstance();
    });

    it('Ch5Platform will create "Csig.Platform_Info" event of type object', () => {
        publishPlatformInfoEvent(false);

        expect(ch5SignalFactory.getObjectSignal("Csig.Platform_Info", false)).to.not.equal(null);
    });

    /*
    Given Csig.Platform signal is published at startup
    And supportsTouchActivity is false
    And Csig.Time signal is published with value 0 or less

    When user taps or presses the screen

    Then the Csig.Touch_Activity signal is not published at all
     */
    it('Case 1 - When Csig.Time is less or equal to zero, will not publish Csig.TouchActivity', (done) => {
        publishPlatformInfoEvent(false);
        publishEvent('n', 'Csig.Time', 0);

        setTimeout(() => {
            expect(ch5SignalFactory.getBooleanSignal("Csig.Touch_Activity", false)).to.equal(null);
            done();
        }, 10)
    });

    /*
    Given Csig.Platform signal is published at startup
    And supportsTouchActivity is false
    And Csig.Time signal is published with value X seconds > 0
    And the timer is set for X seconds
    And the timer is not over

    When user taps or presses the screen

    Then the Csig.Touch_Activity signal is published with the value true
    And the timer is reset to X seconds
     */
    it('Case 2 - Touch activity before touch inactivity timeout', (done) => {
        publishPlatformInfoEvent(false);
        publishEvent('n', 'Csig.Time', 10);
        const ev = new TouchEvent('touchstart');
        document.dispatchEvent(ev);

        expect(ch5SignalFactory.getBooleanSignal("Csig.Touch_Activity", false).value).to.equal(true);
        done();
    });

    /*
    Given Csig.Platform signal is published at startup
    And supportsTouchActivity is false
    And Csig.Time signal is published with value X seconds > 0
    And the timer is set for X seconds
    And the timer is over

    When user taps or presses the screen

    Then the Csig.Touch_Activity signal is published with the value true
    And the timer is re-enabled
     */
    it('Case 3 - Touch activity after touch inactivity timeout', (done) => {
        publishPlatformInfoEvent(false);
        publishEvent('n', 'Csig.Time', 1);

        setTimeout(() => {
            const ev = new TouchEvent('touchstart');
            document.dispatchEvent(ev);

            expect(ch5SignalFactory.getBooleanSignal("Csig.Touch_Activity", false).value).to.equal(true);
            expect(ch5SignalFactory.getBooleanSignal("Csig.Reset_Activity_Timer", false).value).to.equal(false);
            done();
        }, 1100);
    });

    /*
    Given Csig.Platform signal is published at startup
    And supportsTouchActivity is false
    And Csig.Time signal is published with value X seconds > 0
    And the timer is set for X seconds
    And the user doesn't tap the screen for X seconds

    When the timer is over

    Then the Csig.Touch_Activity signal is published with the value false
    And the timer is disabled
     */
    it('Case 4 - No touch activity before touch inactivity timeout', (done) => {
        publishPlatformInfoEvent(false);
        publishEvent('n', 'Csig.Time', 1);

        setTimeout(() => {
            expect(ch5SignalFactory.getBooleanSignal("Csig.Touch_Activity", false).value).to.equal(false);
            expect(ch5SignalFactory.getBooleanSignal("Csig.Reset_Activity_Timer", false).value).to.equal(false);
            done();
        }, 1100);
    });

    /*
    Given Csig.Platform signal is published at startup
    And supportsTouchActivity is false
    And the timer is set for X seconds
    And the timer is not over

    When Csig.Reset_Activity_Timer signal is published with value true

    Then the Csig.Touch_Activity signal is published with the value false
    And the timer is disabled
     */
    it('Case 5 - Activity timer should reset before it\'s over', (done) => {
        publishPlatformInfoEvent(false);
        publishEvent('n', 'Csig.Time', 5);

        setTimeout(() => {
            publishEvent('b', 'Csig.Reset_Activity_Timer', true);

            expect(ch5SignalFactory.getBooleanSignal("Csig.Touch_Activity", false).value).to.equal(false);
            done();
        }, 100);
    });

    /*
    Given Csig.Platform signal is published at startup
    And supportsTouchActivity is true

    When the user taps or presses the screen

    Then the Csig.Touch_Activity signal is not published at all
     */
    it('Case 6 - Device supports touch activity', (done) => {
        publishPlatformInfoEvent(true);
        const ev = new TouchEvent('touchstart');
        document.dispatchEvent(ev);

        setTimeout(() => {
            expect(ch5SignalFactory.getBooleanSignal("Csig.Touch_Activity", false)).to.equal(null);
            done();
        }, 1100);
    });
});

// Utilities
function publishPlatformInfoEvent(supportTouchActivity: boolean) {
    publishEvent('o', 'Csig.Platform_Info',
        {
            capabilities: {
                supportsTouchActivity: supportTouchActivity,
                supportCredentialIntercept: {
                    http: 'ch5-img-auth',
                    https: 'ch5-img-auths'
                }
            },
            version: '1.0.7',
            name: 'Crestron App'
        });
}



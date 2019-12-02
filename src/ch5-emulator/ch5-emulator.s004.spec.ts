// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import * as fs from 'fs-extra';
import { describe } from 'mocha';
import { fail } from "assert";

import {Ch5Emulator } from './index';
import {Ch5SignalFactory} from "../ch5-core";


describe('Ch5Emulator#scenario 004 single number-signal-cue with fixed value, multiple actions', () => {

//
//  Scenario 4
//
    describe('scenario004#cue(type=number,trigger=120)->action(b:link,set,toggle,pulse;n:link,set,increment,decrement,rcb;s:set:link)', () => {
        const emScenario = JSON.parse(fs.readFileSync(__dirname + '/../../../src/ch5-emulator/emulator.spec.testdata.scenario004.json','utf8'));
        const em = Ch5Emulator.getInstance();
        const sf = Ch5SignalFactory.getInstance();
        const sigCue = sf.getNumberSignal('s004_c1');

        const sigAction1 = sf.getBooleanSignal('s004_a1_b_set');
        const sigAction2 = sf.getBooleanSignal('s004_a2_b_link');
        const sigAction3 = sf.getBooleanSignal('s004_a3_b_toggle');
        const sigAction4 = sf.getBooleanSignal('s004_a4_b_pulse');

        const sigAction5 = sf.getNumberSignal('s004_a5_n_set');
        const sigAction6 = sf.getNumberSignal('s004_a6_n_link');
        const sigAction7 = sf.getNumberSignal('s004_a7_n_increment');
        const sigAction8 = sf.getNumberSignal('s004_a8_n_increment_offset');
        const sigAction9 = sf.getNumberSignal('s004_a9_n_decrement');
        const sigAction10 = sf.getNumberSignal('s004_a10_n_decrement_offset');
        const sigAction11 = sf.getNumberSignal('s004_a11_n_rcb');

        const sigAction12 = sf.getStringSignal('s004_a12_s_set');
        const sigAction13 = sf.getStringSignal('s004_a13_s_link');

        it('preload checks',() => {
            if (null !== sigAction1) {
                expect(sigAction1.value,'s004_a1_b_set is false before the scenario loads').to.be.equal(false);
            } else {
                fail('signal: s004_a1_b_set not found');
                return;
            }
            if (null !== sigAction2) {
                expect(sigAction2.value,'s004_a2_b_link is false before the scenario loads').to.be.equal(false);
            } else {
                fail('signal: s004_a2_b_link not found');
                return;
            }
            if (null !== sigAction3) {
                expect(sigAction3.value,'s004_a3_b_toggle is false before the scenario loads').to.be.equal(false);
            } else {
                fail('signal: s004_a3_b_toggle not found');
                return;
            }
            if (null !== sigAction4) {
                expect(sigAction4.value,'s004_a4_b_pulse is false before the scenario loads').to.be.equal(false);
            } else {
                fail('signal: s004_a4_b_pulse not found');
                return;
            }


            if (null !== sigAction5) {
                expect(sigAction5.value,'s004_a5_n_set is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a5_n_set not found');
                return;
            }
            if (null !== sigAction6) {
                expect(sigAction6.value,'s004_a6_n_link is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a6_n_link not found');
                return;
            }
            if (null !== sigAction7) {
                expect(sigAction7.value,'s004_a7_n_increment is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a7_n_increment not found');
                return;
            }
            if (null !== sigAction8) {
                expect(sigAction8.value,'s004_a8_n_increment_offset is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a8_n_increment_offset not found');
                return;
            }
            if (null !== sigAction9) {
                expect(sigAction9.value,'s004_a9_n_decrement is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a9_n_decrement not found');
                return;
            }
            if (null !== sigAction10) {
                expect(sigAction10.value,'s004_a10_n_decrement_offset is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a10_n_decrement_offset not found');
                return;
            }
            if (null !== sigAction11) {
                expect(sigAction11.value,'s004_a11_n_rcb is 0 before the scenario loads').to.be.equal(0);
            } else {
                fail('signal: s004_a11_n_rcb not found');
                return;
            }



            if (null !== sigAction12) {
                expect(sigAction12.value,'s004_a12_s_set is  ""').to.be.equal('');
            } else {
                fail('signal: s004_a12_s_set not found');
                return;
            }
            if (null !== sigAction13) {
                expect(sigAction13.value,'s004_a13_s_link is  ""').to.be.equal('');
            } else {
                fail('signal: s004_a13_s_link not found');
                return;
            }

        });
        it('scenario load, signal cue change',() => {
            em.loadScenario(emScenario);

            if (null !== sigCue) {
                expect(sigCue.value,'s004_c1 is 0 after loading the scenario').to.be.equal(0);
            } else {
                fail('signal: s004_c1 not found');
                return;
            }

            sigCue.publish(120);
        });

        it('s004_c1 is changed to true',() => {
            if (null !== sigCue) {
                expect(sigCue.value,'s004_c1').to.be.equal(120);
            }
        });
        it('s004_a1_b_set check',() => {
            if (null !== sigAction1){
                expect(sigAction1.value,'s004_a1_b_set').to.be.equal(true);
            }
        });
        it('s004_a2_b_link check',() => {
            if (null !== sigAction2){
                expect(sigAction2.value,'s004_a2_b_link').to.be.equal(true); // TODO recheck
            }
        });
        it('s004_a3_b_toggle check',() => {
            if (null !== sigAction3){
                expect(sigAction3.value,'s004_a3_b_toggle').to.be.equal(true);
            }
        });
        it('s004_a4_b_pulse check',() => {
            if (null !== sigAction4){
                expect(sigAction4.value,'s004_a4_b_pulse').to.be.equal(false);
            }
        });
        it('s004_a5_n_set check',() => {
            if (null !== sigAction5){
                expect(sigAction5.value,'s004_a5_n_set').to.be.equal(5);
            }
        });
        it('s004_a6_n_link check',() => {
            if (null !== sigAction6){
                expect(sigAction6.value,'s004_a6_n_link').to.be.equal(120);
            }
        });
        it('s004_a7_n_increment check',() => {
            if (null !== sigAction7) {
                expect(sigAction7.value,'s004_a7_n_increment').to.be.equal(1); // inc 1
            }
        });
        it('s004_a8_n_increment_offset check',() => {
            if (null !== sigAction8){
                expect(sigAction8.value,'s004_a8_n_increment_offset').to.be.equal(10); // inc 10
            }
        });
        it('s004_a9_n_decrement check',() => {
            if (null !== sigAction9){
                expect(sigAction9.value,'s004_a9_n_decrement').to.be.equal(-1); // dec 1
            }
        });
        it('s004_a10_n_decrement_offset check',() => {
            if (null !== sigAction10){
                expect(sigAction10.value,'s004_a10_n_decrement_offset').to.be.equal(-11); // dec 11
            }
        });
        it('s004_a11_n_rcb check before timeout',() => {
            if (null !== sigAction11){
                expect(sigAction11.value,'s004_a11_n_rcb').to.be.equal(0); // test before 100 ms
            }
        });
        it('s004_a11_n_rcb check after timeout',() => {
            if (null !== sigAction11){
                setTimeout(() => {
                    expect(sigAction11.value,'s004_a11_n_rcb').to.be.equal(1234); // test after 100 ms
                },110);
            }
        });
        it('s004_a12_s_set check',() => {
            if (null !== sigAction12){
                expect(sigAction12.value,'s004_a12_s_set').to.be.equal('Hello!');
            }
        });
        it('s004_a13_s_link check',() => {
            if (null !== sigAction13){
                expect(sigAction13.value,'s004_a13_s_link').to.be.equal('120');
            }
        });
        it('cue changes again to a non trigger value then to a trigger value',() => {
            if (null !== sigCue) {
                sigCue.publish(10);
                expect(sigCue.value,'s004_c1 is changed to 10').to.be.equal(10);
                sigCue.publish(120);
                expect(sigCue.value,'s004_c1 is changed to 120').to.be.equal(120);
            }
        });
        it('s004_a3_b_toggle recheck',() => {
            if (null !== sigAction3){
                expect(sigAction3.value,'s004_a3_b_toggle').to.be.equal(false);
            }
        });
        it('s004_a4_b_pulse recheck',() => {
            if (null !== sigAction4){
                expect(sigAction4.value,'s004_a4_b_pulse').to.be.equal(false);
            }
        });
        it('s004_a7_n_increment recheck',() => {
            if (null !== sigAction7) {
                expect(sigAction7.value,'s004_a7_n_increment').to.be.equal(2); // inc 1
            }
        });
        it('s004_a8_n_increment_offset recheck',() => {
            if (null !== sigAction8){
                expect(sigAction8.value,'s004_a8_n_increment_offset').to.be.equal(20); // inc 10
            }
        });
        it('s004_a9_n_decrement recheck',() => {
            if (null !== sigAction9){
                expect(sigAction9.value,'s004_a9_n_decrement').to.be.equal(-2); // dec 1
            }
        });
        it('s004_a10_n_decrement_offset recheck',() => {
            if (null !== sigAction10){
                expect(sigAction10.value,'s004_a10_n_decrement_offset').to.be.equal(-22); // dec 11
            }
        });
    });

});

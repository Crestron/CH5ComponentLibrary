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

import {Ch5Emulator, IEmulatorScenario} from './index';
import {Ch5SignalFactory} from "../ch5-core";
import * as delayFunction from "./mocha.async.delay";

describe('Ch5Emulator#scenario 001, 002, 003 ', () => {

    it('should return an instance of itself', () => {
        const em = Ch5Emulator.getInstance();

        expect(em).to.be.instanceOf(Ch5Emulator);
    });

        // let em = Ch5Emulator.getInstance();
        // let sf = Ch5SignalFactory.getInstance();
    
        // beforeEach(()=>{
        //     em = Ch5Emulator.getInstance();
        //     sf = Ch5SignalFactory.getInstance();
        // });
        // afterEach(()=>{
        //     Ch5Emulator.clear();
        //     Ch5SignalFactory.clear();
        // });

        describe('scenario001#cue(type=boolean,trigger=true)->action(type=boolean,logic=set,value=true)', () => {
            
            // let em = Ch5Emulator.getInstance();
            // let sf = Ch5SignalFactory.getInstance();
            // Ch5Emulator.clear();
            // Ch5SignalFactory.clear();
            const em = Ch5Emulator.getInstance();
            const sf = Ch5SignalFactory.getInstance();
            const emScenario = JSON.parse(fs.readFileSync(__dirname + '/../../../src/ch5-emulator/emulator.spec.testdata.scenario001.json','utf8'));
            const sigCue = sf.getBooleanSignal('hall_lights_tap');
            const sigAction = sf.getBooleanSignal('hall_lights_selected');
            it('preload checks',() => {
                if (null !== sigCue) {
                    expect(sigCue.value, 'cue signal is initially false').to.be.equal(false);
                } else {
                    fail('boolean signal: hall_lights_tap not found');
                }

                if (null !== sigAction) {
                    expect(sigAction.value,'action signal is initially false').to.be.equal(false);
                } else {
                    fail('boolean signal: hall_lights_selected not found');
                }
            });
            it('load scenario and change cue signal value',(done) => {
                em.loadScenario(emScenario);
                if (null !== sigCue) {

                    if (null !== sigAction) { 
                        delayFunction.emulatorAsyncDelay(done, () => {expect(sigAction.value, 'action signal changes to true').to.be.equal(true);});
                    }
                    else {
                        fail('boolean signal: hall_lights_selected not found');
                    }

                    sigCue.publish(true);
                    // sigCue.publish(false);
                    // sigCue.publish(true);
                    expect(sigCue.value, 'cue signal is true after publishing a true value on it').to.be.equal(true);
                } else {
                    fail('boolean signal: hall_lights_tap not found');
                }
            });
        });

        describe('scenario002#cue(type=boolean,trigger=true)->action(type=number,logic=set,value=65535),action(type=string,logic=set,value="Raising Volume!")', () => {
            // let em = Ch5Emulator.getInstance();
            // let sf = Ch5SignalFactory.getInstance();
            // Ch5Emulator.clear();
            // Ch5SignalFactory.clear();
            // em = Ch5Emulator.getInstance();
            // sf = Ch5SignalFactory.getInstance();
            const em = Ch5Emulator.getInstance();
            const sf = Ch5SignalFactory.getInstance();
            const emScenario = JSON.parse(fs.readFileSync(__dirname + '/../../../src/ch5-emulator/emulator.spec.testdata.scenario002.json','utf8'));

            const sigCue = sf.getBooleanSignal('volume_up_press');
            const sigAction1 = sf.getNumberSignal('volume_level');
            const sigAction2 = sf.getStringSignal('volume_level_desc');

            it('preload checks',() => {
                if (null !== sigAction1) {
                    expect(sigAction1.value,'sigAction1(volume_level) is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('boolean signal: volume_level not found');
                }
                if (null !== sigAction2) {
                    expect(sigAction2.value,'sigAction2(volume_level_desc) is  ""').to.be.equal('');
                } else {
                    fail('boolean signal: volume_level_desc not found');
                }
            });
            it('load scenario and change cue signal value',(done) => {
                em.loadScenario(emScenario);

                if (null !== sigCue && null !== sigAction1 && null !== sigAction2) {
                    delayFunction.emulatorAsyncDelay(done, () => {
                        expect(sigAction1.value,'sigAction1(volume_level) has changed to 65535').to.be.equal(65535);
                        expect(sigAction2.value,'sigAction2(volume_level_desc) has changed to "Raising Volume!"').to.be.equal('Raising Volume!');
                    });


                    expect(sigCue.value,'sigTrigger(volume_up_press) is false after loading the scenario').to.be.equal(false);
                    sigCue.publish(true);
                    expect(sigCue.value,'sigTrigger(volume_up_press) is changed to true').to.be.equal(true);
                } else {

                    if (null === sigCue) { fail('boolean signal: volume_up_press not found'); }
                    if (null === sigAction1) { fail('boolean signal: volume_level not found'); }
                    if (null === sigAction2) { fail('boolean signal: volume_level_desc not found'); }
                }
            });
        });

        describe('scenario003#cue(type=boolean,trigger=true)->action(b:link,set,toggle,pulse;n:link,set,increment,decrement,rcb;s:set:link)', () => {
            // let em = Ch5Emulator.getInstance();
            // let sf = Ch5SignalFactory.getInstance();
            // Ch5Emulator.clear();
            // Ch5SignalFactory.clear();
            // em = Ch5Emulator.getInstance();
            // sf = Ch5SignalFactory.getInstance();
            const emScenario = JSON.parse(fs.readFileSync(__dirname + '/../../../src/ch5-emulator/emulator.spec.testdata.scenario003.json','utf8'));
            const em = Ch5Emulator.getInstance();
            const sf = Ch5SignalFactory.getInstance();
            const sigCue = sf.getBooleanSignal('s003_c1');
            // const actions = [
            //     {name:"s003_a1_b_set",type:"b"},
            //     {name:"s003_a2_b_link",type:"b"},
            //     {name:"s003_a3_b_toggle",type:"b"},
            //     {name:"s003_a4_b_pulse",type:"b"},
            //
            //     {name:"s003_a5_n_set",type:"n"},
            //     {name:"s003_a6_n_link",type:"n"},
            //     {name:"s003_a7_n_increment",type:"n"},
            //     {name:"s003_a8_n_increment_offset",type:"n"},
            //     {name:"s003_a9_n_decrement",type:"n"},
            //     {name:"s003_a10_n_decrement_offset",type:"n"},
            //     {name:"s003_a11_n_rcb",type:"n"},
            //
            //     {name:"s003_a12_s_set",type:"s"},
            //     {name:"s003_a13_s_link",type:"s"},
            // ];

            const sigAction1 = sf.getBooleanSignal('s003_a1_b_set');
            const sigAction2 = sf.getBooleanSignal('s003_a2_b_link');
            const sigAction3 = sf.getBooleanSignal('s003_a3_b_toggle');
            const sigAction4 = sf.getBooleanSignal('s003_a4_b_pulse');

            const sigAction5 = sf.getNumberSignal('s003_a5_n_set');
            const sigAction6 = sf.getNumberSignal('s003_a6_n_link');
            const sigAction7 = sf.getNumberSignal('s003_a7_n_increment');
            const sigAction8 = sf.getNumberSignal('s003_a8_n_increment_offset');
            const sigAction9 = sf.getNumberSignal('s003_a9_n_decrement');
            const sigAction10 = sf.getNumberSignal('s003_a10_n_decrement_offset');
            const sigAction11 = sf.getNumberSignal('s003_a11_n_rcb');

            const sigAction12 = sf.getStringSignal('s003_a12_s_set');
            const sigAction13 = sf.getStringSignal('s003_a13_s_link');

            it('preload checks',() => {
                if (null !== sigAction1) {
                    expect(sigAction1.value,'s003_a1_b_set is false before the scenario loads').to.be.equal(false);
                } else {
                    fail('signal: s003_a1_b_set not found');
                    return;
                }
                if (null !== sigAction2) {
                    expect(sigAction2.value,'s003_a2_b_link is false before the scenario loads').to.be.equal(false);
                } else {
                    fail('signal: s003_a2_b_link not found');
                    return;
                }
                if (null !== sigAction3) {
                    expect(sigAction3.value,'s003_a3_b_toggle is false before the scenario loads').to.be.equal(false);
                } else {
                    fail('signal: s003_a3_b_toggle not found');
                    return;
                }
                if (null !== sigAction4) {
                    expect(sigAction4.value,'s003_a4_b_pulse is false before the scenario loads').to.be.equal(false);
                } else {
                    fail('signal: s003_a4_b_pulse not found');
                    return;
                }


                if (null !== sigAction5) {
                    expect(sigAction5.value,'s003_a5_n_set is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a5_n_set not found');
                    return;
                }
                if (null !== sigAction6) {
                    expect(sigAction6.value,'s003_a6_n_link is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a6_n_link not found');
                    return;
                }
                if (null !== sigAction7) {
                    expect(sigAction7.value,'s003_a7_n_increment is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a7_n_increment not found');
                    return;
                }
                if (null !== sigAction8) {
                    expect(sigAction8.value,'s003_a8_n_increment_offset is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a8_n_increment_offset not found');
                    return;
                }
                if (null !== sigAction9) {
                    expect(sigAction9.value,'s003_a9_n_decrement is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a9_n_decrement not found');
                    return;
                }
                if (null !== sigAction10) {
                    expect(sigAction10.value,'s003_a10_n_decrement_offset is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a10_n_decrement_offset not found');
                    return;
                }
                if (null !== sigAction11) {
                    expect(sigAction11.value,'s003_a11_n_rcb is 0 before the scenario loads').to.be.equal(0);
                } else {
                    fail('signal: s003_a11_n_rcb not found');
                    return;
                }



                if (null !== sigAction12) {
                    expect(sigAction12.value,'s003_a12_s_set is  ""').to.be.equal('');
                } else {
                    fail('signal: s003_a12_s_set not found');
                    return;
                }
                if (null !== sigAction13) {
                    expect(sigAction13.value,'s003_a13_s_link is  ""').to.be.equal('');
                } else {
                    fail('signal: s003_a13_s_link not found');
                    return;
                }

            });
            it('scenario load, signal cue change',() => {
                em.loadScenario(emScenario);

                if (null !== sigCue) {
                    expect(sigCue.value,'s003_c1 is false after loading the scenario').to.be.equal(false);
                } else {
                    fail('signal: s003_c1 not found');
                    return;
                }

                sigCue.publish(true);
            });

            it('s003_c1 is changed to true',() => {
                if (null !== sigCue) {
                    expect(sigCue.value,'s003_c1').to.be.equal(true);
                }
            });
            it('s003_a1_b_set check', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction1) {
                        expect(sigAction1.value, 's003_a1_b_set').to.be.equal(true);
                    }
                });

            });
            it('s003_a2_b_link check', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction2) {
                        expect(sigAction2.value, 's003_a2_b_link').to.be.equal(true); // TODO recheck
                    }
                });
            });
            it('s003_a3_b_toggle check', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction3) {
                        expect(sigAction3.value, 's003_a3_b_toggle').to.be.equal(true);
                    }
                });
            });
            it('s003_a4_b_pulse check',() => {
                if (null !== sigAction4){
                    expect(sigAction4.value,'s003_a4_b_pulse').to.be.equal(false);
                }
            });
            it('s003_a5_n_set check',() => {
                if (null !== sigAction5){
                    expect(sigAction5.value,'s003_a5_n_set').to.be.equal(5);
                }
            });
            it('s003_a6_n_link check',() => {
                if (null !== sigAction6){
                    expect(sigAction6.value,'s003_a6_n_link').to.be.equal(0); // fails conversion from boolean to number and defaults to 0
                }
            });
            it('s003_a7_n_increment check',() => {
                if (null !== sigAction7) {
                    expect(sigAction7.value,'s003_a7_n_increment').to.be.equal(1); // inc 1
                }
            });
            it('s003_a8_n_increment_offset check',() => {
                if (null !== sigAction8){
                    expect(sigAction8.value,'s003_a8_n_increment_offset').to.be.equal(10); // inc 10
                }
            });
            it('s003_a9_n_decrement check',() => {
                if (null !== sigAction9){
                    expect(sigAction9.value,'s003_a9_n_decrement').to.be.equal(-1); // dec 1
                }
            });
            it('s003_a10_n_decrement_offset check',() => {
                if (null !== sigAction10){
                    expect(sigAction10.value,'s003_a10_n_decrement_offset').to.be.equal(-11); // dec 11
                }
            });
            // it('s003_a11_n_rcb check before timeout', (done) => {
            //     delayFunction.emulatorAsyncDelay(done, () => {
            //         if (null !== sigAction11) {
            //             expect(sigAction11.value, 's003_a11_n_rcb').to.be.equal(0);
            //         }
            //     },120);
            // });
            it('s003_a11_n_rcb check after timeout',() => {
                if (null !== sigAction11){
                    setTimeout(() => {
                        expect(sigAction11.value,'s003_a11_n_rcb').to.be.equal(1234); // test after 100 ms
                    },110);
                }
            });
            it('s003_a12_s_set check',() => {
                if (null !== sigAction12){
                    expect(sigAction12.value,'s003_a12_s_set').to.be.equal('Hello!');
                }
            });
            it('s003_a13_s_link check',() => {
                if (null !== sigAction13){
                    expect(sigAction13.value,'s003_a13_s_link').to.be.equal('true'); // TODO recheck
                }
            });
            it('cue changes again to false then true',() => {
                if (null !== sigCue) {
                    sigCue.publish(false);
                    expect(sigCue.value,'s003_c1 is changed to false').to.be.equal(false);
                    sigCue.publish(true);
                    expect(sigCue.value,'s003_c1 is changed to true').to.be.equal(true);
                }
            });
            it('s003_a3_b_toggle recheck', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction3) {
                        expect(sigAction3.value, 's003_a3_b_toggle').to.be.equal(false);
                    }
                });

            });
            it('s003_a4_b_pulse recheck',() => {
                if (null !== sigAction4){
                    expect(sigAction4.value,'s003_a4_b_pulse').to.be.equal(false);
                }
            });

            it('s003_a7_n_increment recheck', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction7) {
                        expect(sigAction7.value, 's003_a7_n_increment').to.be.equal(2); // inc 1
                    }
                });
            });

            it('s003_a8_n_increment_offset recheck', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction8) {
                        expect(sigAction8.value, 's003_a8_n_increment_offset').to.be.equal(20); // inc 10
                    }
                });
            });

            it('s003_a9_n_decrement recheck', (done) => {
                delayFunction.emulatorAsyncDelay(done, () => {
                    if (null !== sigAction9) {
                        expect(sigAction9.value, 's003_a9_n_decrement').to.be.equal(-2); // dec 1
                    }
                });
            });

            it('s003_a10_n_decrement_offset recheck',() => {
                if (null !== sigAction10){
                    expect(sigAction10.value,'s003_a10_n_decrement_offset').to.be.equal(-22); // dec 11
                }
            });
        });

});

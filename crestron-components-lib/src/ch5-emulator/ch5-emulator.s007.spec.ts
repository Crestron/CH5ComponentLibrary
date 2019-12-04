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
import { TCh5SignalHashTable } from '../ch5-core/types/signal.table';
import { TCh5Signal } from '../ch5-core/types/signal.type';

describe('Ch5Emulator#scenario 007', () => {


        describe('scenario007#onStart', () => {
            const emScenario = JSON.parse(fs.readFileSync(__dirname + '/../../../src/ch5-emulator/emulator.spec.testdata.scenario007.json','utf8'));
            const em = Ch5Emulator.getInstance();
            const sf = Ch5SignalFactory.getInstance();
            // const sig1 = sf.getBooleanSignal('s007_sig1_b');
            // const sig2 = sf.getBooleanSignal('s007_sig2_b');
            // const sig3 = sf.getBooleanSignal('s007_sig3_b');
            // const sig4 = sf.getNumberSignal('s007_sig4_n');
            // const sig5 = sf.getNumberSignal('s007_sig5_n');
            // const sig6 = sf.getNumberSignal('s007_sig6_n');
            // const sig7 = sf.getStringSignal('s007_sig7_s');
            // const sig8 = sf.getNumberSignal('s007_sig8_n');
            // const sig9 = sf.getBooleanSignal('s007_sig9_b');
            // const sig10 = sf.getBooleanSignal('s007_sig10_b');
            // const sig11 = sf.getNumberSignal('s007_sig11_n');
            // const sig12 = sf.getNumberSignal('s007_sig12_n');
            // const sig13 = sf.getNumberSignal('s007_sig13_n');
            // const sig14 = sf.getStringSignal('s007_sig14_s');
            // const sig15 = sf.getStringSignal('s007_sig15_s');
            // const sig16 = sf.getBooleanSignal('s007_sig16_b');
            // const sig17 = sf.getBooleanSignal('s007_sig17_b');
            // const sig18 = sf.getNumberSignal('s007_sig18_n');
            // const sig19 = sf.getNumberSignal('s007_sig19_n');
            // const sig20 = sf.getNumberSignal('s007_sig20_n');
            // const sig21 = sf.getStringSignal('s007_sig21_s');
            // const sig22 = sf.getNumberSignal('s007_sig22_n');
            // const sig23 = sf.getNumberSignal('s007_sig23_n');
            const sigs: TCh5SignalHashTable={};
            const sigNames = [
                's007_sig1_b',     // cue , trigger &change, onStart set to true
                's007_sig2_b',
                's007_sig3_b',
                's007_sig4_n',
                's007_sig5_n',
                's007_sig6_n',
                's007_sig7_s',
                's007_sig8_n',     // cue, trigger &change, onStart set to 100
                's007_sig9_b',
                's007_sig10_b',    // action and cue, trigger &change
                's007_sig11_n',
                's007_sig12_n',
                's007_sig13_n',
                's007_sig14_s',
                's007_sig15_s',    // cue, trigger change, onStart set to 'hello'
                's007_sig16_b',
                's007_sig17_b',
                's007_sig18_n',
                's007_sig19_n',
                's007_sig20_n',
                's007_sig21_s',
                's007_sig22_n',    // action and cue, trigger &change
                's007_sig23_n'
            ];

            const signalCheck = (sigName:string, expectedValue:boolean|number|string|object|null) => {
                return it(sigName + ' is ' + expectedValue,(done:MochaDone) => {
                    const sig = sigs[sigName];
                    if (typeof sigName !== "undefined" && typeof sig !== undefined && null !== sig) {
                        expect(sig.value,sigName).to.be.equal(expectedValue);
                    } else {
                        done(new Error(sigName + " not found"));
                    }
                    done();
                });
            };

            it('preload checks',(done:MochaDone) => {
                sigNames.forEach((sigName, index) => {
                    const sigType = sigName.substr(sigName.length - 1);
                    // const sigType = sigName.split("_").pop();
                    let sig : TCh5Signal;
                    switch (sigType){
                        case 'b':
                            sig = sf.getBooleanSignal(sigName);
                            sigs[sigName] = sig;
                            if (null !== sig) {
                                expect(sig.value,sigName + ' is false before the scenario loads').to.be.equal(false);
                            } else {
                                done(new Error(sigName + ' not found'));
                            }
                            break;
                        case 'n':
                            sig = sf.getNumberSignal(sigName);
                            sigs[sigName] = sig;
                            if (null !== sig) {
                                expect(sig.value,sigName + ' is false before the scenario loads').to.be.equal(0);
                            } else {
                                done(new Error(sigName + ' not found'));
                            }
                            break;
                        case 's':
                            sig = sf.getStringSignal(sigName);
                            sigs[sigName] = sig;
                            if (null !== sig) {
                                expect(sig.value,sigName + ' is false before the scenario loads').to.be.equal('');
                            } else {
                                done(new Error(sigName + ' not found'));
                            }
                            break;
                    }
                });
                done();
            });
            it('scenario load, scenario run',() => {
                em.loadScenario(emScenario);
                em.run();
            });

            signalCheck('s007_sig1_b',true);
            signalCheck('s007_sig8_n',100);
            signalCheck('s007_sig15_s','hello');

            signalCheck('s007_sig2_b',true);
            signalCheck('s007_sig3_b',true);
            signalCheck('s007_sig4_n',0);
            signalCheck('s007_sig5_n',10);
            signalCheck('s007_sig6_n',-11);
            signalCheck('s007_sig7_s','true');
            signalCheck('s007_sig9_b',true);
            signalCheck('s007_sig10_b',true);
            signalCheck('s007_sig11_n',100);
            signalCheck('s007_sig12_n',10);
            signalCheck('s007_sig13_n',-11);
            signalCheck('s007_sig14_s','100');
            signalCheck('s007_sig16_b',true);
            signalCheck('s007_sig17_b',true);
            signalCheck('s007_sig18_n',0);
            signalCheck('s007_sig19_n',10);
            signalCheck('s007_sig20_n',-11);
            signalCheck('s007_sig21_s','hello');

            signalCheck('s007_sig22_n',10);
            signalCheck('s007_sig23_n',10);


            it('change s007_sig1_b to false',(done) => {
                const sigName = 's007_sig1_b';
                const sig = sf.getBooleanSignal(sigName);
                if (null !== sig) {
                    sig.publish(false);
                    expect(sig.value,sigName + ' changed to  false').to.be.equal(false);
                } else {
                    done(new Error(sigName + ' not found'));
                }
                done();
            });

            signalCheck('s007_sig2_b',false);
            signalCheck('s007_sig3_b',false);
            signalCheck('s007_sig4_n',0);
            signalCheck('s007_sig5_n',20);
            signalCheck('s007_sig6_n',-22);
            signalCheck('s007_sig7_s','false');

            it('change s007_sig8_n to 101',(done) => {
                const sigName = 's007_sig8_n';
                const sig = sf.getNumberSignal(sigName);
                if (null !== sig) {
                    sig.publish(101);
                    expect(sig.value,sigName + ' changed to 101').to.be.equal(101);
                } else {
                    done(new Error(sigName + ' not found'));
                }
                done();
            });

            signalCheck('s007_sig9_b',true);
            signalCheck('s007_sig10_b',false);
            signalCheck('s007_sig11_n',101);
            signalCheck('s007_sig12_n',20);
            signalCheck('s007_sig13_n',-22);
            signalCheck('s007_sig14_s','101');

            signalCheck('s007_sig22_n',20);
            signalCheck('s007_sig23_n',20);
        });

});

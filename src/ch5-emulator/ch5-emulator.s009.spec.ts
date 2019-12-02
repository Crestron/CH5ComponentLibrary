// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { describe } from 'mocha';

import {Ch5Emulator, IEmulatorScenario, IEmulatorAction, IEmulatorCue, TScenarioOnStart} from './index';
import {Ch5SignalFactory} from "../ch5-core";
import { TCh5SignalHashTable } from '../ch5-core/types/signal.table';
import { TCh5Signal } from '../ch5-core/types/signal.type';

describe('Ch5Emulator#scenario 009', () => {


    describe('tests for: loadScenario, onStart, run', () => {
        const action1: IEmulatorAction = {'state':'s009_sig2_b', 'type':'boolean', 'logic':'toggle'};
        const cue1: IEmulatorCue = {'event':'s009_sig1_b', 'type':'boolean', 'trigger':'&change','actions':[action1]};
        const onStart: TScenarioOnStart = {'state':'s009_sig2_b','type':'boolean','value': true};

        const emScenario1:IEmulatorScenario = {'cues':[cue1]};
        const emScenario2:IEmulatorScenario = {'cues':[cue1],'onStart':[onStart]};

        let em = Ch5Emulator.getInstance();
        let sf = Ch5SignalFactory.getInstance();
        const sigs: TCh5SignalHashTable={};
        const sigNames = [
            's009_sig1_b',     // cue , trigger &change, onStart set to true
            's009_sig2_b'
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
        it('loading a scenario with no cues throws an error',(done) => {
            try {
                em.loadScenario({} as IEmulatorScenario);
                done(new Error('Error not thrown'))
            } catch (e) {
                done();
            }
            // expect(em.loadScenario).to.throw(Error);
        });

        it('emulator run without loading scenario throws Error',(done) => {
            try {
                em.run();
                done(new Error('Error not thown'))
            } catch (e) {
                done();
            }
            // expect(em.run).to.throw(Error);
        });
        it('emulator run on a scenario without onStart does not throw an Error',(done) => {
            em.loadScenario(emScenario1);
            // expect(em.run()).to.throw(Exception);
            em.run();
            done();
        });

        it('emulator run on a scenario with onStart does not throw en Error',(done) => {
            Ch5SignalFactory.clear();
            Ch5Emulator.clear();
            em = Ch5Emulator.getInstance();
            sf = Ch5SignalFactory.getInstance();
            em.loadScenario(emScenario2);
            em.run();
            done();
        });

    });

});

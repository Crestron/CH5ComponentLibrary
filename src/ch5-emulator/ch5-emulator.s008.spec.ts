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

import { Ch5Emulator, IEmulatorScenario } from './index';
import { Ch5SignalFactory } from "../ch5-core";
import { TCh5SignalHashTable } from '../ch5-core/types/signal.table';
import { TCh5Signal } from '../ch5-core/types/signal.type';
import * as delayFunction from "./mocha.async.delay";

describe('Ch5Emulator#scenario 008', () => {


	describe('scenario008#onStart', () => {
		const emScenario = JSON.parse(fs.readFileSync(__dirname + '/../../../src/ch5-emulator/emulator.spec.testdata.scenario008.json', 'utf8'));

		const em = Ch5Emulator.getInstance();
		const sf = Ch5SignalFactory.getInstance();

		const sigs: TCh5SignalHashTable = {};
		const sigNames = [
			's008_sig1_b',     // cue , trigger &change, onStart set to true
			's008_sig2_o',
			's008_sig3_o',
			's008_sig4_n',     // cue, trigger &change, onStart set to 100
			's008_sig5_o',
			's008_sig6_o',
			's008_sig7_s',    // cue, trigger &change, onStart set to 'hello'
			's008_sig8_o',
			's008_sig9_o',
			's008_sig10_o',   // cue, trigger set {"s1":"value1", "n1":11}
			's008_sig11_b',
			's008_sig12_n',
			's008_sig13_o', // cue, trigger &change
			's008_sig14_n',
			's008_sig15_o', // cue, trigger &change OnStart set {"nKey":3}
			's008_sig16_n',
		];

		const signalCheck = (sigName: string, expectedValue: boolean | number | string | object | null) => {
			it(sigName + ' is ' + expectedValue, (done: MochaDone) => {
				delayFunction.emulatorAsyncDelay(done, () => {
					if (typeof sigName !== "undefined") {
						const sig = sigs[sigName];
						if (typeof sig !== "undefined" && null !== sig) {
							const sigType = sigName.substr(sigName.length - 1);
							if ('o' === sigType) {
								expect(sig.value, sigName).to.deep.equal(expectedValue);
							} else {
								expect(sig.value, sigName).to.be.equal(expectedValue);
							}
						} else {
							done(new Error(sigName + " not found"));
						}
					} else {
						done(new Error(sigName + " not found"));
					}
				});
			});
		};

		it('preload checks', (done: MochaDone) => {
			sigNames.forEach((sigName, index) => {
				const sigType = sigName.substr(sigName.length - 1);
				// const sigType = sigName.split("_").pop();
				let sig: TCh5Signal;
				switch (sigType) {
					case 'b':
						sig = sf.getBooleanSignal(sigName);
						sigs[sigName] = sig;
						if (null !== sig) {
							expect(sig.value, sigName + ' is false before the scenario loads').to.be.equal(false);
						} else {
							done(new Error(sigName + ' not found'));
						}
						break;
					case 'n':
						sig = sf.getNumberSignal(sigName);
						sigs[sigName] = sig;
						if (null !== sig) {
							expect(sig.value, sigName + ' is false before the scenario loads').to.be.equal(0);
						} else {
							done(new Error(sigName + ' not found'));
						}
						break;
					case 's':
						sig = sf.getStringSignal(sigName);
						sigs[sigName] = sig;
						if (null !== sig) {
							expect(sig.value, sigName + ' is false before the scenario loads').to.be.equal('');
						} else {
							done(new Error(sigName + ' not found'));
						}
						break;
					case 'o':
						sig = sf.getObjectSignal(sigName);
						sigs[sigName] = sig;
						if (null !== sig) {
							expect(sig.value, sigName + ' is empty before the scenario loads').to.deep.equal({});
						} else {
							done(new Error(sigName + ' not found'));
						}
						break;
				}
			});
			done();
		});
		it('scenario load, scenario run', () => {
			em.loadScenario(emScenario);
			em.run();
		});

		signalCheck('s008_sig1_b', true);
		signalCheck('s008_sig2_o', true);
		signalCheck('s008_sig3_o', { "s1": "value1", "n1": 101, "b1": true });

		signalCheck('s008_sig4_n', 100);
		signalCheck('s008_sig5_o', {});
		signalCheck('s008_sig6_o', { "s2": "value2" });

		signalCheck('s008_sig7_s', 'hello');
		signalCheck('s008_sig8_o', 'hello');
		signalCheck('s008_sig9_o', { "s3": "value3" });

		signalCheck('s008_sig10_o', {});
		signalCheck('s008_sig11_b', false);
		signalCheck('s008_sig12_n', 0);
		signalCheck('s008_sig13_o', {});
		signalCheck('s008_sig14_n', 0);
		signalCheck('s008_sig15_o', { "nKey": 3 });
		signalCheck('s008_sig16_n', 3);


		it('change s008_sig10_o to trigger value', (done) => {
			const sigName = 's008_sig10_o';
			const sig = sf.getObjectSignal(sigName);
			if (null !== sig) {
				const trigVal = { "s1": "value1", "n1": 11 };
				sig.publish(trigVal);
				expect(sig.value, sigName + ' changed to trigger value').to.deep.equal(trigVal);
			} else {
				done(new Error(sigName + ' not found'));
			}
			done();
		});

		signalCheck('s008_sig10_o', { "s1": "value1", "n1": 11 });
		signalCheck('s008_sig11_b', true);
		signalCheck('s008_sig12_n', 7);

		it('change s008_sig13_o', (done) => {
			const sigName = 's008_sig13_o';
			const sig = sf.getObjectSignal(sigName);
			if (null !== sig) {
				const trigVal = { "s1": "value1" };
				sig.publish(trigVal);
				expect(sig.value, sigName + ' changed ').to.deep.equal(trigVal);
			} else {
				done(new Error(sigName + ' not found'));
			}
			done();
		});

		signalCheck('s008_sig14_n', 10);

		it('change s008_sig15_o', (done) => {
			const sigName = 's008_sig15_o';
			const sig = sf.getObjectSignal(sigName);
			if (null !== sig) {
				const trigVal = { "a1": "v1" };
				sig.publish(trigVal);
				expect(sig.value, sigName + ' changed ').to.deep.equal(trigVal);
			} else {
				done(new Error(sigName + ' not found'));
			}
			done();
		});

		signalCheck('s008_sig16_n', 6);

		it('change s008_sig13_o again', (done) => {
			const sigName = 's008_sig13_o';
			const sig = sf.getObjectSignal(sigName);
			if (null !== sig) {
				const trigVal = { "n1": 12, "k2": "v2" };
				sig.publish(trigVal);
				expect(sig.value, sigName + ' changed ').to.deep.equal(trigVal);
			} else {
				done(new Error(sigName + ' not found'));
			}
			done();
		});

		signalCheck('s008_sig14_n', 20);
	});

});

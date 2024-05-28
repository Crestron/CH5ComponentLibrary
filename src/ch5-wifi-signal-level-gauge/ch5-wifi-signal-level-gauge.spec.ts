// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import 'jsdom-global/register';
import { describe } from 'mocha';
import { Ch5WifiSignalLevelGauge } from './ch5-wifi-signal-level-gauge';

describe('Ch5WifiSignalLevelGauge', () => {

	let cb = document.createElement('ch5-wifi-signal-level-gauge');

	beforeEach(() => {
		// const cb = new Ch5WifiSignalLevelGauge(); // cannot be instantiated like this
		cb = document.createElement('ch5-wifi-signal-level-gauge');
	});

	it('#create', () => {
		expect(typeof cb).to.be.equal('object');
	});


	let testCases = ['a', '', ' ', 'number', 'regular', 'small', 'large', 'x-large'];
	let expectedResult = ['regular', 'regular', 'regular', 'regular', 'regular', 'small', 'large', 'x-large'];
	testCases.forEach((ele, i) => {
		it('should allow setting only valid size', () => {
			cb.setAttribute('size', ele);
			expect(cb.getAttribute('size')).to.be.equal(expectedResult[i]);
		});
	});

});

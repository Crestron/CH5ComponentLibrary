// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import 'jsdom-global/register';
import { describe } from 'mocha';
import { Ch5Animation } from './../ch5-animation';
import { Ch5ColorPicker } from '../ch5-color-picker';

describe('Ch5Animation', () => {

	let cb = document.createElement('ch5-animation');
let ab: Ch5ColorPicker;

	beforeEach(() => {
		cb = document.createElement('ch5-animation');
		ab = new Ch5ColorPicker();
	});

	// const shouldCheckValidValues = (name: string, dataArray: any[], defaultValue: any) => {
	// 	describe('Ch5Animation ' + name + ' attribute', () => {
	// 		let cb = document.createElement('ch5-animation');

	// 		beforeEach(() => {
	// 			cb = document.createElement('ch5-animation');
	// 		});

	// 		it('should allow setting only valid ' + name, () => {
	// 			const validValues = dataArray;

	// 			for (let i = 0; i < validValues.length; i++) {
	// 				cb.setAttribute(name, validValues[i]);
	// 				expect(cb.getAttribute(name)).to.be.equal(validValues[i]);
	// 			}
	// 		});

	// 		it('should default to "' + defaultValue + '" for an invalid ' + name, () => {
	// 			const invalidTypes: any[] = ['junk1', null, '', ' ', undefined];

	// 			for (let i = 0; i < invalidTypes.length; i++) {
	// 				cb.setAttribute(name, invalidTypes[i]);
	// 				expect(cb.getAttribute(name)).to.be.equal(defaultValue);
	// 			}
	// 		});
	// 	});
	// };

	it('#create', () => {
		expect(typeof cb).to.be.equal('object');
	});

	// shouldCheckValidValues('size', Ch5Animation.SIZES, Ch5Animation.SIZES[0]);

	const name: string = 'size';
	// const defaultValue: any = Ch5Animation.SIZES[0];
	// it('should allow setting only valid ' + name, () => {
	// 	const validValues = dataArray;
	// 	for (let i = 0; i < validValues.length; i++) {
	// 		cb.setAttribute(name, validValues[i]);
	// 		expect(cb.getAttribute(name)).to.be.equal(validValues[i]);
	// 	}
	// });

	it('should allow setting only valid ', () => {
		// const dataArray: any = Ch5A.ELEMENT_NAME;
		const validValues = ['small'];
		for (let i = 0; i < validValues.length; i++) {
			cb.setAttribute('size', validValues[i]);
			expect(cb.getAttribute('size')).to.be.equal(validValues[i]);
		}
	});

	// it('should allow setting only valid size', () => {
	// 	const validValues = Ch5Animation.SIZES;

	// 	for (let i = 0, len = validValues.length; i < len; i++) {
	// 		cb.setAttribute('type', validValues[i]);
	// 		expect(cb.getAttribute('type')).to.be.equal(validValues[i]);
	// 	}
	// });

	// it('should default to "default" for an invalid type', () => {
	// 	const invalidTypes = ['ddd', 'tttt', 'info2'];

	// 	for (let i = 0, len = invalidTypes.length; i < len; i++) {
	// 		cb.setAttribute('type', invalidTypes[i]);
	// 		expect(cb.getAttribute('type')).to.be.equal('default');
	// 	}
	// });

});

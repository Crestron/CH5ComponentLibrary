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
import { Ch5ColorPicker } from './ch5-color-picker';

describe('Ch5ColorPicker', () => {

    let cb = document.createElement('ch5-color-picker');

    before(() => {
        // Ch5ColorPicker.registerCustomElement();
    });

    beforeEach(() => {
        // const cb = new ColorPicker(); // cannot be instantiated like this
        cb = document.createElement('ch5-color-picker');
    });

    it('#create', () => {
        expect(typeof cb).to.be.equal('object');
    });

    it('should allow setting only valid maxValue', () => {
        const validTypes = ['254', '255', '256', '65534', '65535', '65536'];

        for (let i = 0, len = validTypes.length; i < len; i++) {
            cb.setAttribute('maxValue', validTypes[i]);
            expect(cb.getAttribute('maxValue')).to.be.equal(validTypes[i]);
        }
    });

    it('should default to "255" for an invalid maxValue', () => {
        const invalidTypes = ['a', '', ' '];

        for (let i = 0, len = invalidTypes.length; i < len; i++) {
            cb.setAttribute('maxValue', invalidTypes[i]);
            setTimeout(() => {
                expect(cb.getAttribute('maxValue')).to.be.equal('255');
            }, 100)
        }
    })
});

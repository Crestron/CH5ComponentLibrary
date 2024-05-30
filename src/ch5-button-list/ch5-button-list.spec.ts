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
import { Ch5ButtonList } from './ch5-button-list';

describe('Ch5ButtonList', () => {

    let cb = document.createElement('ch5-button-list');

    before(() => {
        // Ch5ButtonList.registerCustomElement();
    });

    beforeEach(() => {
        // const cb = new Ch5Button(); // cannot be instantiated like this
        cb = document.createElement('ch5-button-list');
    });

    it('#create', () => {
        expect(typeof cb).to.be.equal('object');
    });

    it('should allow setting only valid orientation value', () => {
        const validTypes = ['horizontal', 'vertical'];

        for (let i = 0, len = validTypes.length; i < len; i++) {
            cb.setAttribute('orientation', validTypes[i]);
            expect(cb.getAttribute('orientation')).to.be.equal(validTypes[i]);
        }
    });

    it('should default to "horizontal" for an invalid orientation value', () => {
        const invalidTypes = ['ddd', 'tttt', 'info2'];

        for (let i = 0, len = invalidTypes.length; i < len; i++) {
            cb.setAttribute('orientation', invalidTypes[i]);
            setTimeout(() => {
                expect(cb.getAttribute('orientation')).to.be.equal('horizontal');
            }, 100)
        }
    });
});

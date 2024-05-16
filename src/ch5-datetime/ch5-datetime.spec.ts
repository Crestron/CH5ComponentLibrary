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
import { Ch5DateTime } from './ch5-datetime';

describe('Ch5DateTime', () => {

    let cb = document.createElement('ch5-datetime');

    before(() => {
        //Ch5DateTime.registerCustomElement();
    });

    beforeEach(() => {
        // const cb = new Ch5DateTime(); // cannot be instantiated like this
        cb = document.createElement('ch5-datetime');
    });

    it('#create', () => {
        expect(typeof cb).to.be.equal('object');
    });

    it('should allow setting only valid displayType', () => {
        const validTypes = ['datetime ', 'date', 'time'];

        for (let i = 0, len = validTypes.length; i < len; i++) {
            cb.setAttribute('displayType', validTypes[i]);
            expect(cb.getAttribute('displayType')).to.be.equal(validTypes[i]);
        }
    });
    /* 
        it('should default to "datetime" for an invalid displayType', () => {
            const invalidTypes = ['ddd', 'tttt', 'info2'];
    
            for (let i = 0, len = invalidTypes.length; i < len; i++) {
                cb.setAttribute('displayType', invalidTypes[i]);
                setTimeout(() => {
                    expect(cb.getAttribute('displayType')).to.be.equal('datetime');
                }, 100);
            }
        }); */
});

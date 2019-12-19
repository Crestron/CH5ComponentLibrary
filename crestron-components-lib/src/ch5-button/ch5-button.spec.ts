// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import {JSDOM} from 'jsdom';
import 'jsdom-global/register';
import { describe } from 'mocha';
import { Ch5Button } from './ch5-button';

describe('Ch5Button', () => {

    let cb = document.createElement('ch5-button');

    beforeEach(() => {
        // const cb = new Ch5Button(); // cannot be instantiated like this
        cb = document.createElement('ch5-button');
    });

    it('#create', () => {
        expect(typeof cb).to.be.equal('objet');
    });

    it('should allow setting only valid types', () => {
        const validTypes = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

        for (let i = 0,len=validTypes.length; i < len; i++) {
            cb.setAttribute('type', validTypes[i]);
            expect(cb.getAttribute('type')).to.be.equal(validTypes[i]);
        }
    });

    it('should default to "default" for an invalid type', () => {
        const invalidTypes = ['ddd', 'tttt', 'info2'];

        for (let i = 0, len = invalidTypes.length; i < len; i++) {
            cb.setAttribute('type', invalidTypes[i]);
            expect(cb.getAttribute('type')).to.be.equal(invalidTypes[i]);
        }
    });
});

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
import { Ch5Background } from './ch5-background';

describe('Ch5Background', () => {

    let cb = document.createElement('ch5-button-list');

    beforeEach(() => {
        // const cb = new Ch5Button(); // cannot be instantiated like this
        cb = document.createElement('ch5-background');
    });

    it('#create', () => {
        expect(typeof cb).to.be.equal('object');
    });

    it('should allow setting only valid backgroundcolor value', () => {
        cb.setAttribute("backgroundcolor", 'green');
        expect(cb.getAttribute('backgroundcolor')).to.be.equal('green');
    });

});

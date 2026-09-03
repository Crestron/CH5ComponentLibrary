// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import 'jsdom-global/register';
import { describe } from 'mocha';
import { Ch5Button } from './ch5-button';

describe('Ch5Button', () => {

    let cb = document.createElement('ch5-button');

    before(() => {
        Ch5Button.registerCustomElement();
    });

    beforeEach(() => {
        cb = document.createElement('ch5-button');
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should default multilineSupport to false for invalid JS setter values', () => {
        document.body.appendChild(cb);
        (cb as any).label = 'Test button';

        (cb as any).multilineSupport = 'safasf';

        expect((cb as any).multilineSupport).to.equal(false);

        const label = cb.querySelector('.ch5-button--label') as HTMLElement;
        expect(label).to.not.equal(null);
        expect(label.classList.contains('ch5-button--label-multiline-support-false')).to.equal(true);
        expect(label.classList.contains('ch5-button--label-multiline-support-safasf')).to.equal(false);
    });
});

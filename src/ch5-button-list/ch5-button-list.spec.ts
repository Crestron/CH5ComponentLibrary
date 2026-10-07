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

    it('should keep lightweight join-text and ch5-text templates on the light button', () => {
        const lightTemplates = [
            '<ch5-jointotext-boolean receiveStateValue="100" textWhenTrue="Pause" textWhenFalse="Play"></ch5-jointotext-boolean>',
            '<ch5-jointotext-numeric receiveStateValue="200"></ch5-jointotext-numeric>',
            '<ch5-jointotext-string receiveStateValue="300"></ch5-jointotext-string>',
            '<ch5-text receiveStateValue="400"></ch5-text>'
        ];

        for (const template of lightTemplates) {
            expect((cb as any).labelTemplateHasLiveBindings(template)).to.equal(false);
        }

        const advancedTemplates = [
            '<ch5-button-mode><ch5-button-mode-state></ch5-button-mode-state></ch5-button-mode>',
            '<ch5-button-list-label><template>{{idx}}</template></ch5-button-list-label>',
            '<ch5-advanced-button-label><template><ch5-jointotext-boolean></ch5-jointotext-boolean></template></ch5-advanced-button-label>'
        ];

        for (const template of advancedTemplates) {
            expect((cb as any).labelTemplateHasLiveBindings(template)).to.equal(true);
        }
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

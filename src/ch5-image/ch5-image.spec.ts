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
import { Ch5Image } from './ch5-image';

describe('Ch5Image', () => {

    const createCh5Image = (): Ch5Image => {
        const element = document.createElement('ch5-image');
        if (element instanceof Ch5Image) {
            return element;
        }
        return new Ch5Image();
    };

    let cb = createCh5Image();
    let originalIntersectionObserver: any;

    before(() => {
        originalIntersectionObserver = (global as any).IntersectionObserver;
        if (typeof (global as any).IntersectionObserver !== 'function') {
            (global as any).IntersectionObserver = class {
                public constructor(_callback?: any, _options?: any) { }
                public observe(_target: Element): void { }
                public unobserve(_target: Element): void { }
                public disconnect(): void { }
                public takeRecords(): any[] { return []; }
            };
        }
        //Ch5Image.registerCustomElement();
    });

    after(() => {
        if (typeof originalIntersectionObserver === 'undefined') {
            delete (global as any).IntersectionObserver;
        } else {
            (global as any).IntersectionObserver = originalIntersectionObserver;
        }
    });

    beforeEach(() => {
        // const cb = new Ch5DateTime(); // cannot be instantiated like this
        cb = createCh5Image();
    });

    it('#create', () => {
        expect(typeof cb).to.be.equal('object');
    });

    it('should call processUri exactly once for every order of url/user/password attributes', () => {
        const permutations: Array<Array<{ key: string, value: string }>> = [
            [
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
                { key: 'user', value: 'test' },
                { key: 'password', value: 'Crestron1!' }
            ],
            [
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
                { key: 'password', value: 'Crestron1!' },
                { key: 'user', value: 'test' }
            ],
            [
                { key: 'user', value: 'test' },
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
                { key: 'password', value: 'Crestron1!' }
            ],
            [
                { key: 'user', value: 'test' },
                { key: 'password', value: 'Crestron1!' },
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' }
            ],
            [
                { key: 'password', value: 'Crestron1!' },
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
                { key: 'user', value: 'test' }
            ],
            [
                { key: 'password', value: 'Crestron1!' },
                { key: 'user', value: 'test' },
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' }
            ]
        ];

        permutations.forEach((order) => {
            const imageElement = createCh5Image();

            const originalProcessUri = imageElement.processUri;
            let processUriEntryCount = 0;

            imageElement.processUri = (): void => {
                processUriEntryCount += 1;
                return originalProcessUri.call(imageElement);
            };

            order.forEach((item) => {
                (imageElement as any)[item.key] = item.value;
            });

            expect(processUriEntryCount).to.be.equal(1);
        });
    });

    it('should not call processUri when one of url/user/password is missing', () => {
        const combinations: Array<Array<{ key: string, value: string }>> = [
            [
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
                { key: 'user', value: 'test' }
            ],
            [
                { key: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
                { key: 'password', value: 'Crestron1!' }
            ],
            [
                { key: 'user', value: 'test' },
                { key: 'password', value: 'Crestron1!' }
            ]
        ];

        combinations.forEach((combination) => {
            const imageElement = createCh5Image();

            const originalProcessUri = imageElement.processUri;
            let processUriEntryCount = 0;

            imageElement.processUri = (): void => {
                processUriEntryCount += 1;
                return originalProcessUri.call(imageElement);
            };

            combination.forEach((item) => {
                (imageElement as any)[item.key] = item.value;
            });

            expect(processUriEntryCount).to.be.equal(0);
        });
    });

    it('should not call processUri when custom auth url has only inline credentials', () => {
        const imageElement = createCh5Image();

        const originalProcessUri = imageElement.processUri;
        let processUriEntryCount = 0;

        imageElement.processUri = (): void => {
            processUriEntryCount += 1;
            return originalProcessUri.call(imageElement);
        };

        imageElement.url = 'ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg';

        expect(processUriEntryCount).to.be.equal(0);
    });

    it('should call processUri when custom auth url has inline credentials and user/password attrs are provided', () => {
        const imageElement = createCh5Image();

        const originalProcessUri = imageElement.processUri;
        let processUriEntryCount = 0;

        imageElement.processUri = (): void => {
            processUriEntryCount += 1;
            return originalProcessUri.call(imageElement);
        };

        imageElement.url = 'ch5-img-auth://test:Crestron1!@disnamic.com/test/teaser1.jpg';
        imageElement.user = 'test';
        imageElement.password = 'Crestron1!';

        expect(processUriEntryCount).to.be.equal(1);
    });

    it('should include all ch5-image specific attributes in observedAttributes', () => {
        const expectedAttributes = [
            'alt',
            'width',
            'height',
            'user',
            'password',
            'url',
            'refreshrate',
            'dir',
            'mode',
            'allowpositiondatatobesent',
            'allowvaluesonmove',
            'receivestateurl',
            'receivestateallowvaluesonmove',
            'receivestateallowpositiondatatobesent',
            'sendeventonclick',
            'sendeventonerror',
            'sendeventontouch',
            'sendeventxposition',
            'sendeventyposition'
        ];

        const observedAttributes = Ch5Image.observedAttributes;
        expectedAttributes.forEach((attr) => {
            expect(observedAttributes.includes(attr)).to.be.equal(true, `Missing observed attribute: ${attr}`);
        });
    });

    it('should accept values for all ch5-image specific attributes', () => {
        const imageElement = createCh5Image();

        const attributeValues: Array<{ attr: string, value: string }> = [
            { attr: 'alt', value: 'sample-image' },
            { attr: 'width', value: '200px' },
            { attr: 'height', value: '100px' },
            { attr: 'user', value: 'test' },
            { attr: 'password', value: 'Crestron1!' },
            { attr: 'url', value: 'http://disnamic.com/test/teaser1.jpg' },
            { attr: 'refreshrate', value: '5' },
            { attr: 'dir', value: 'rtl' },
            { attr: 'mode', value: '0' },
            { attr: 'allowpositiondatatobesent', value: 'true' },
            { attr: 'allowvaluesonmove', value: 'true' },
            { attr: 'receivestateurl', value: 'ch5.test.url.join' },
            { attr: 'receivestateallowvaluesonmove', value: 'ch5.test.allow.values' },
            { attr: 'receivestateallowpositiondatatobesent', value: 'ch5.test.allow.position' },
            { attr: 'sendeventonclick', value: 'ch5.test.send.click' },
            { attr: 'sendeventonerror', value: 'ch5.test.send.error' },
            { attr: 'sendeventontouch', value: 'ch5.test.send.touch' },
            { attr: 'sendeventxposition', value: 'ch5.test.send.x' },
            { attr: 'sendeventyposition', value: 'ch5.test.send.y' }
        ];

        attributeValues.forEach(({ attr, value }) => {
            imageElement.setAttribute(attr, value);
            expect(imageElement.getAttribute(attr)).to.equal(value);
        });

        expect(imageElement.refreshRate).to.equal(5);
        expect(imageElement.direction).to.equal('rtl');
        expect(imageElement.mode).to.equal(0);
    });

    it('should handle invalid values for all ch5-image specific attributes', () => {
        const imageElement = createCh5Image();

        const invalidAttributeValues: Array<{ attr: string, value: string }> = [
            { attr: 'alt', value: '' },
            { attr: 'width', value: 'abc%' },
            { attr: 'height', value: 'bad-height' },
            { attr: 'user', value: '' },
            { attr: 'password', value: '' },
            { attr: 'url', value: 'not a url' },
            { attr: 'refreshrate', value: 'not-a-number' },
            { attr: 'dir', value: 'invalid-direction' },
            { attr: 'mode', value: '9999' },
            { attr: 'allowpositiondatatobesent', value: 'not-boolean' },
            { attr: 'allowvaluesonmove', value: 'not-boolean' },
            { attr: 'receivestateurl', value: '' },
            { attr: 'receivestateallowvaluesonmove', value: '' },
            { attr: 'receivestateallowpositiondatatobesent', value: '' },
            { attr: 'sendeventonclick', value: '' },
            { attr: 'sendeventonerror', value: '' },
            { attr: 'sendeventontouch', value: '' },
            { attr: 'sendeventxposition', value: '' },
            { attr: 'sendeventyposition', value: '' }
        ];

        invalidAttributeValues.forEach(({ attr, value }) => {
            expect(() => imageElement.setAttribute(attr, value)).to.not.throw();
        });

        // constrained attributes normalize to safe values
        expect(imageElement.refreshRate).to.equal(0);
        expect(imageElement.direction).to.equal('ltr');
        expect(imageElement.mode).to.equal(0);
        expect(imageElement.getAttribute('mode')).to.equal('0');
        expect(imageElement.allowPositionDataToBeSent).to.equal(false);
        expect(imageElement.allowValuesOnMove).to.equal(false);
    });

    it('should initialize expected default values for core attributes', () => {
        const imageElement = createCh5Image();

        expect(imageElement.alt).to.equal('');
        expect(imageElement.width).to.equal('');
        expect(imageElement.height).to.equal('');
        expect(imageElement.url).to.equal('');
        expect(imageElement.refreshRate).to.equal(0);
        expect(imageElement.direction).to.equal('ltr');
        expect(imageElement.mode).to.equal(0);
        expect(imageElement.user).to.equal('');
        expect(imageElement.password).to.equal('');
        expect(imageElement.allowPositionDataToBeSent).to.equal(false);
        expect(imageElement.allowValuesOnMove).to.equal(false);
        expect(imageElement.sendEventOnClick).to.equal('');
        expect(imageElement.sendEventOnError).to.equal('');
        expect(imageElement.sendEventOnTouch).to.equal('');
        expect(imageElement.sendEventXPosition).to.equal('');
        expect(imageElement.sendEventYPosition).to.equal('');
    });

    it('should normalize valid and negative values for constrained attributes', () => {
        const imageElement = createCh5Image();

        // refreshRate accepts negative numbers and resets to 0 for NaN
        imageElement.setAttribute('refreshrate', '-5');
        expect(imageElement.refreshRate).to.equal(-5);
        imageElement.setAttribute('refreshrate', 'NaN');
        expect(imageElement.refreshRate).to.equal(0);

        // direction accepts only ltr/rtl and falls back to ltr
        imageElement.setAttribute('dir', 'rtl');
        expect(imageElement.direction).to.equal('rtl');
        imageElement.setAttribute('dir', 'not-a-direction');
        expect(imageElement.direction).to.equal('ltr');

        // mode is accepted when corresponding ch5-image-mode exists
        const mode0 = document.createElement('ch5-image-mode');
        const mode1 = document.createElement('ch5-image-mode');
        imageElement.appendChild(mode0);
        imageElement.appendChild(mode1);
        imageElement.setAttribute('mode', '1');
        expect(imageElement.mode).to.equal(1);
        imageElement.setAttribute('mode', '-1');
        expect(imageElement.mode).to.equal(0);

        // boolean properties support canonical true/false values
        imageElement.setAttribute('allowpositiondatatobesent', '1');
        expect(imageElement.allowPositionDataToBeSent).to.equal(true);
        imageElement.setAttribute('allowvaluesonmove', '0');
        expect(imageElement.allowValuesOnMove).to.equal(false);
    });

});

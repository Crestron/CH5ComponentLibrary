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

    before(() => {
        //Ch5Image.registerCustomElement();
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

    /*   it('should allow setting only valid displayType', () => {
          const validTypes = ['datetime ', 'date', 'time'];
  
          for (let i = 0, len = validTypes.length; i < len; i++) {
              cb.setAttribute('displayType', validTypes[i]);
              expect(cb.getAttribute('displayType')).to.be.equal(validTypes[i]);
          }
      }); */
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

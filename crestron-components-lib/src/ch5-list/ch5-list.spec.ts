// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import 'jsdom-global/register';
import { describe } from 'mocha';
import { Ch5List } from './ch5-list';
import { TCh5ListElementOrientation } from '../_interfaces/ch5-list/types';

describe('Ch5List', () => {

    let cl = document.createElement('ch5-list');

    beforeEach(() => {
        cl = document.createElement('ch5-list');
    });

    it('#create', () => {
        expect(typeof cl).to.be.equal('object');
    });

    it('default values', () => {
        const list = cl as Ch5List;

        // check default value for size

        list.size = Number(list.getAttribute('size'));
        expect(list.size).to.be.equal(0);

        // check default value for orientation
        cl.setAttribute('orientation', "random");
        list.orientation = cl.getAttribute("orientation") as TCh5ListElementOrientation;
        // const assert = chai.assert;
        // assert.typeOf(list.orientation, TCh5ListElementOrientation)
        // expect(list.orientation as TCh5ListElementOrientation).to.be.equal("vertical");

        // check default value for pagedSwipe
        list.pagedSwipe = Boolean(cl.getAttribute('pagedSwipe'));
        expect(list.pagedSwipe).to.be.equal(false);

        // check default value for endless
        list.endless = Boolean(cl.getAttribute('endless'));
        expect(list.endless).to.be.equal(false);

        // check default value for scrollbar 
        list.scrollbar = Boolean(cl.getAttribute('scrollbar'))
        expect(list.scrollbar).to.be.equal(false);

        // check default value for scrollToTime
        // list.setAttribute('scrollToTime', '');
        // list.scrollToTime = Number(cl.getAttribute('scrollToTime'));
        // expect(list.scrollToTime).to.be.equal(500);
    });

    it('set value for "size" ', () => {
        const list = cl as Ch5List;
        list.setAttribute('size', "5");
        list.size = Number(list.getAttribute('size'));
        expect(list.size).to.be.equal(5);
    });
});
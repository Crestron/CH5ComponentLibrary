// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Tests for the Ch5Uid class
 */

import { expect } from 'chai';
import { describe } from 'mocha';
import {Ch5Uid} from "./ch5-uid";

describe('Ch5Uid', () => {
    it('Multiple calls to getUid should return different ids', (done:MochaDone) => {

        const ids:string[] = [];
        let id = '';

        for (let i = 0; i < 1000; i++) {
            id = Ch5Uid.getUid();
            expect(ids).to.not.contain(id);
            ids.push(id);
        }

        done();
    });
});
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect } from 'chai';
import { describe } from 'mocha';
import {fail} from "assert";

import {Ch5SignalFactory} from "../ch5-core";
describe('Ch5SignalFactory', () => {

    describe("#init",() => {
        it('boolean signal is false by default', () => {
            const sig = Ch5SignalFactory.getInstance().getBooleanSignal('sig1');

            if (null !== sig){
                expect(sig.value).to.be.equal(false);
            }else{
                fail('null signal');
            }
        });
        it('number signal is 0 by default', () => {
            const sig = Ch5SignalFactory.getInstance().getNumberSignal('sig2');

            if (null !== sig){
                expect(sig.value).to.be.equal(0);
            }else{
                fail('null signal');
            }

        });
        it('string signal is "" by default', () => {
            const sig = Ch5SignalFactory.getInstance().getStringSignal('sig3');

            if (null !== sig){
                expect(sig.value).to.be.equal('');
            }else{
                fail('null signal');
            }
        });
        it('object signal is {} by default', () => {
            const sig = Ch5SignalFactory.getInstance().getObjectSignal('sig4');

            if (null !== sig){
                expect(sig.value).to.be.an('object').that.is.empty; // tslint:disable-line:no-unused-expression
            }else{
                fail('null signal');
            }
        });
    });
});
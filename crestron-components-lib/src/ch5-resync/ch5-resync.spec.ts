// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { assert } from 'chai';
import { describe } from 'mocha';


import { bridgeReceiveObjectFromNative, bridgeReceiveBooleanFromNative, bridgeReceiveIntegerFromNative, bridgeReceiveStringFromNative } from "./../ch5-core/ch5-signal-bridge-receive"
import { subscribeState, unsubscribeState } from "../ch5-core";
import { Ch5Debug } from "../ch5-core/ch5-debug"


describe('Ch5Resync', () => {

    const boolA = 'fb1'
    let boolAVal: boolean = true;
    let boolASub: string; 
    
    const boolB = 'fb2'
    let boolBVal: boolean = true;
    let boolBSub: string; 

    const boolG = 'MyContract.BoolG';
    let boolGVal: boolean = true;
    let boolGSub: string; 

    const boolH = 'MyContract.BoolH';
    let boolHVal: boolean = true;
    let boolHSub: string; 
    
    const numberC = 'fb1';
    let numberCVal: number = 100;
    let numberCSub: string;

    const numberD = 'fb2';
    let numberDVal: number = 100;
    let numberDSub: string;

    const numberJ = 'MyContract.NumJ';
    let numberJVal: number = 100;
    let numberJSub: string;

    const numberK = 'MyContract.NumK';
    let numberKVal: number = 100;
    let numberKSub: string;
   
    const stringE = 'fb1';
    const stringF = 'fb2';
    const stringM = 'MyContract.StringM';
    const stringN = 'MyContract.StringN';
    const NOT_EMPTY = 'NOT EMPTY';
    const EMPTY = '';
    let stringEVal = NOT_EMPTY;
    let stringFVal = NOT_EMPTY;
    let stringMVal = NOT_EMPTY;
    let stringNVal = NOT_EMPTY;
    let stringESub:string;
    let stringFSub:string;
    let stringMSub:string;
    let stringNSub:string;    


    
    // tslint:disable-next-line: no-empty
    before(() => {
        // Ch5Debug.setConfigKeyValue('Ch5Resync', true);
    });

    // tslint:disable-next-line: no-empty
    after(() => {
        Ch5Debug.setConfigKeyValue('Ch5Resync', false);
    });

    beforeEach(() => {
        boolASub = subscribeState('b', boolA, (value: boolean) => { boolAVal = value;});
        boolBSub = subscribeState('b', boolB, (value: boolean) => { boolBVal = value;});
        boolGSub = subscribeState('b', boolG, (value: boolean) => { boolGVal = value;});
        boolHSub = subscribeState('b', boolH, (value: boolean) => { boolHVal = value;});
        numberCSub = subscribeState('n', numberC, (value: number) => { numberCVal = value;});
        numberDSub = subscribeState('n', numberD, (value: number) => { numberDVal = value;});
        numberJSub = subscribeState('n', numberJ, (value: number) => { numberJVal = value;});
        numberKSub = subscribeState('n', numberK, (value: number) => { numberKVal = value;});

        stringESub = subscribeState('s', stringE, (value: string) => { stringEVal = value;});
        stringFSub = subscribeState('s', stringF, (value: string) => { stringFVal = value;});
        stringMSub = subscribeState('s', stringM, (value: string) => { stringMVal = value;});
        stringNSub = subscribeState('s', stringN, (value: string) => { stringNVal = value;});

    });

    afterEach(() => {
        unsubscribeState('b', boolA, boolASub);
        unsubscribeState('b', boolB, boolBSub);
        unsubscribeState('b', boolG, boolGSub);
        unsubscribeState('b', boolH, boolHSub);

        unsubscribeState('n', numberC, numberCSub);
        unsubscribeState('n', numberD, numberCSub);
        unsubscribeState('n', numberJ, numberJSub);
        unsubscribeState('n', numberK, numberKSub);

        unsubscribeState('s', stringE, stringESub);
        unsubscribeState('s', stringF, stringFSub);
        unsubscribeState('s', stringM, stringMSub);
        unsubscribeState('s', stringN, stringNSub);

    });

    it('sanity', () => {
        assert.equal(boolBVal, false, "boolBVal not false at start");
        bridgeReceiveBooleanFromNative(boolB, true);
        assert.equal(boolBVal, true, "boolBVal not true after bridgeReceiveBoolFromNative sets to true");
    });

    const commonPreSOUSetJoins = () => {
        bridgeReceiveBooleanFromNative(boolB, false);
        bridgeReceiveBooleanFromNative(boolH, false);
        assert.equal(boolBVal, false, "boolBVal not false after bridgeReceiveBoolFromNative sets to false");
        assert.equal(boolHVal, false, "boolHVal not false after bridgeReceiveBoolFromNative sets to false");
        bridgeReceiveBooleanFromNative(boolA, true);
        bridgeReceiveBooleanFromNative(boolG, true);
        assert.equal(boolAVal, true, "boolAVal not true after bridgeReceiveBoolFromNative sets to true");
        assert.equal(boolGVal, true, "boolGVal not true after bridgeReceiveBoolFromNative sets to true");


        bridgeReceiveIntegerFromNative(numberD, 0);
        bridgeReceiveIntegerFromNative(numberK, 0);
        assert.equal(numberDVal, 0, "numberDVal not 0 after bridgeReceiveIntegerFromNative sets to 0");
        assert.equal(numberKVal, 0, "nubmerKVal not 0 after bridgeReceiveIntegerFromNative sets to 0");
        bridgeReceiveIntegerFromNative(numberC, 100);
        bridgeReceiveIntegerFromNative(numberJ, 100);
        assert.equal(numberCVal, 100, "numberCVal not 100 after bridgeReceiveIntegerFromNative sets to 100");
        assert.equal(numberJVal, 100, "numberJVal not 100 after bridgeReceiveIntegerFromNative sets to 100");

        bridgeReceiveStringFromNative(stringF, EMPTY);
        bridgeReceiveStringFromNative(stringE, NOT_EMPTY);
        bridgeReceiveStringFromNative(stringN, EMPTY);
        bridgeReceiveStringFromNative(stringM, NOT_EMPTY);
        assert.equal(stringFVal, EMPTY, `string:${stringF} not "${EMPTY}" after bridgeReceiveStringFromNative`);
        assert.equal(stringEVal, NOT_EMPTY, `string:${stringE} not "${NOT_EMPTY}" after bridgeReceiveStringFromNative`);
        assert.equal(stringNVal, EMPTY, `string:${stringN} not "${EMPTY}" after bridgeReceiveStringFromNative`);
        assert.equal(stringMVal, NOT_EMPTY, `string:${stringM} not "${NOT_EMPTY}" after bridgeReceiveStringFromNative`);

    };

    const commonBetweenSOUandEOUSetNumericJoins = () => {
        bridgeReceiveBooleanFromNative(boolB, true);
        bridgeReceiveIntegerFromNative(numberD, 100);
        bridgeReceiveStringFromNative(stringF, NOT_EMPTY);
    };

    const commonBetweenSOUandEOUSetSymbolJoins = () => {
        bridgeReceiveBooleanFromNative(boolH, true);
        bridgeReceiveIntegerFromNative(numberK, 100);
        bridgeReceiveStringFromNative(stringN, NOT_EMPTY);
    };

    const commonVerifyNumericJoins = () => {
        assert.equal(boolBVal, true, `boolean:${boolB} not true after EOU`);
        assert.equal(boolAVal, false, `boolean:${boolA} not false after EOU`);

        assert.equal(numberDVal, 100, `number:${numberD} not 100 after EOU`);
        assert.equal(numberCVal, 0, `number:${numberC} not 0 after EOU`);

        assert.equal(stringEVal, EMPTY, `string:${stringE} not "${EMPTY}" after EOU`);
        assert.equal(stringFVal, NOT_EMPTY, `string:${stringF} not "${NOT_EMPTY}" after EOU`);
    }

    const commonVerifySymbolicJoins = () => {
        assert.equal(boolHVal, true, `boolean:${boolH} not true after EOU`);
        assert.equal(boolGVal, false, `boolean ${boolG} not false after EOU`);

        assert.equal(numberKVal, 100, `number:${numberK} not 100 after EOU`);
        assert.equal(numberJVal, 0, `number:${numberJ} not 0 after EOU`);

        assert.equal(stringMVal, EMPTY, `string:${stringM} not "${EMPTY}" after EOU`);
        assert.equal(stringNVal, NOT_EMPTY, `string:${stringN} not "${NOT_EMPTY}" after EOU`);
    }

    it('SOU / EOU', () => {
        commonPreSOUSetJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"wss://192.168.1.244:49200/:0x48:","state":"StartOfUpdate","value":{"excludePrefixes":["Csig"]}});
        commonBetweenSOUandEOUSetNumericJoins();
        commonBetweenSOUandEOUSetSymbolJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"wss://192.168.1.244:49200/:0x48:","state":"EndOfUpdate"});
        commonVerifyNumericJoins();
        commonVerifySymbolicJoins();

    });


    it('SOU Range / EOU', () => {
        commonPreSOUSetJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 2} 
                }
            }
        });
        commonBetweenSOUandEOUSetNumericJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});
        commonVerifyNumericJoins();
    });    

    it('SOU Range / SOU Range SO / EOU', () => {
        commonPreSOUSetJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 0, "joinHigh": 0}, 
                    "numeric" : {"stateNames": [], "joinLow": 0, "joinHigh": 0}, 
                    "string" : {"stateNames": [], "joinLow": 0, "joinHigh": 0} 
                }
            }
        });
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRangeSO" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [boolG, boolH], "joinLow": 0, "joinHigh": 0}, 
                    "numeric" : {"stateNames": [numberJ, numberK], "joinLow": 0, "joinHigh": 0}, 
                    "string" : {"stateNames": [stringM, stringN], "joinLow": 0, "joinHigh": 0} 
                }
            }
        });
        commonBetweenSOUandEOUSetSymbolJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});
        // commonVerifyNumericJoins();
        assert.equal(boolAVal, true, "boolAVal changed by Range Reset with low=0, high=0");
        assert.equal(boolBVal, false, "boolBVal changed by Range Reset with low=0, high=0");

        assert.equal(numberDVal, 0, "numberDVal changed by Range Reset with low=0, high=0");
        assert.equal(numberCVal, 100, "numberCVal changed by Range Reset with low=0, high=0");

        assert.equal(stringFVal, EMPTY, `string:${stringF} not "${EMPTY}" changed by Range Reset with low=0, high=0`);
        assert.equal(stringEVal, NOT_EMPTY, `string:${stringE} not "${NOT_EMPTY}" changed by Range Reset with low=0, high=0`);

        commonVerifySymbolicJoins();
    });    

    it('SOU Range / SOU Range SO / SOU Range / EOU / EOU ', () => {
        commonPreSOUSetJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 0, "joinHigh": 0}, 
                    "numeric" : {"stateNames": [], "joinLow": 0, "joinHigh": 0}, 
                    "string" : {"stateNames": [], "joinLow": 0, "joinHigh": 0} 
                }
            }
        });
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRangeSO" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [boolG, boolH], "joinLow": 0, "joinHigh": 0}, 
                    "numeric" : {"stateNames": [numberJ, numberK], "joinLow": 0, "joinHigh": 0}, 
                    "string" : {"stateNames": [stringM, stringN], "joinLow": 0, "joinHigh": 0} 
                }
            }
        });
        commonBetweenSOUandEOUSetSymbolJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 2} 
                }
            }
        });
        commonBetweenSOUandEOUSetNumericJoins();
        
        
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});

        commonVerifyNumericJoins();
        commonVerifySymbolicJoins();
    });  
    
    it('SOU -> Clear joins within range -> EOU', () => {
        commonPreSOUSetJoins();
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 2} 
                }
            }
        });

        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});

        assert.equal(boolAVal, false, `${boolA} is not cleared`);
        assert.equal(boolBVal, false, `${boolB} is not cleared`);
        assert.equal(numberCVal, 0, `${numberC} is not cleared`);
        assert.equal(numberDVal, 0, `${numberD} is not cleared`);
        assert.equal(stringEVal, '', `${stringE} is not cleared`);
        assert.equal(stringFVal, '', `${stringF} is not cleared`);

    });

    it('Should not clear joins in case EOU is not received', () => {
        boolAVal = true;
        boolBVal = true;
        boolGVal = true;
        boolHVal = true;
        numberCVal = 100;
        numberDVal = 100;
        numberJVal = 100;
        numberKVal = 100;
        stringEVal = NOT_EMPTY;
        stringFVal = NOT_EMPTY;
        stringMVal = NOT_EMPTY;
        stringNVal = NOT_EMPTY;

        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 2} 
                }
            }
        });

        assert.equal(boolAVal, true, `${boolA} is cleared`);
        assert.equal(boolBVal, true, `${boolB} is cleared`);
        assert.equal(numberCVal, 100, `${numberC} is cleared`);
        assert.equal(numberDVal, 100, `${numberD} is cleared`);
        assert.equal(stringEVal, NOT_EMPTY, `${stringE} is cleared`);
        assert.equal(stringFVal, NOT_EMPTY, `${stringF} is cleared`);
    });

    it(`Should clear ${boolA} bool, ${numberC} number and ${stringE} string in case joinLow and joinHigh are the same`, () => {

        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 1} 
                }
            }
        });

        assert.equal(boolAVal, false, `${boolA} is cleared`);
        assert.equal(numberCVal, 0, `${numberC} is cleared`);
        assert.equal(stringEVal, '', `${stringE} is cleared`);
    });

    it(`Should clear ${boolA} bool, ${numberC} number, ${stringE} string in case of multiple SOU with overlapping joins range`, () => {
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 1} 
                }
            }
        });
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 2} 
                }
            }
        });

        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});

        assert.equal(boolAVal, false, `${boolA} is cleared`);
        assert.equal(numberCVal, 0, `${numberC} is cleared`);
        assert.equal(stringEVal, '', `${stringE} is cleared`);
    });

    it(`Should not clear ${boolA} bool, ${numberC} number, ${stringE} string in case of multiple SOU with only 1 EOU event received`, () => {
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 1} 
                }
            }
        });
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 2}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 2} 
                }
            }
        });

        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});
        
        assert.equal(boolAVal, false, `${boolA} bool is not cleared`);
        assert.equal(numberCVal, 0, `${numberC} bool is not cleared`);
        assert.equal(stringEVal, '', `${stringE} bool is not cleared`);
    });

    it(`Should set the value of ${boolA} bool received between SOU and EOU even though is contained in the joins range`, () => {
        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {
            id : "localhost-03", 
            state : "StartOfUpdateRange" ,
            value : {
                excludePrefixes : ["Csig"], 
                range: {
                    "boolean" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "numeric" : {"stateNames": [], "joinLow": 1, "joinHigh": 1}, 
                    "string" : {"stateNames": [], "joinLow": 1, "joinHigh": 1} 
                }
            }
        });
        
        bridgeReceiveBooleanFromNative('fb1', true);
        bridgeReceiveStringFromNative('fb1', NOT_EMPTY);
        bridgeReceiveIntegerFromNative('fb1', 101);

        bridgeReceiveObjectFromNative('Csig.State_Synchronization', {"id":"localhost-03","state":"EndOfUpdate"});
        
        assert.equal(boolAVal, true, `${boolA} bool received between SOU and EOU is cleared`);
        assert.equal(stringEVal, NOT_EMPTY, `${boolA} string received between SOU and EOU is cleared`);
        assert.equal(numberCVal, 101, `${boolA} number received between SOU and EOU is cleared`);

    });
});

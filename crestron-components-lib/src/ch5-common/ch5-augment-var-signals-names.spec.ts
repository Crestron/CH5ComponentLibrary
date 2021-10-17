// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect, assert } from 'chai';
import { describe } from 'mocha';
import { Ch5AugmentVarSignalsNames } from './ch5-augment-var-signals-names';
import { Ch5Button } from '../ch5-button/ch5-button';
import { Ch5Template } from '../ch5-template/ch5-template';
import { Ch5AttrsShow } from '../ch5-custom-attrs/ch5-attrs-show';
import { Ch5AttrsAppendclass } from '../ch5-custom-attrs/ch5-attrs-appendclass';
import { Ch5AttrsTextContent } from '../ch5-custom-attrs/ch5-attrs-text-content';

describe('Ch5AugmentVarSignalsNames', () => {
    let ch5TemplateParentEl: HTMLTemplateElement; //  = document.createElement('template');
    let ch5ButtonEl: HTMLElement;
    let stdDivEl: HTMLDivElement;
    let ch5TemplateChildEl: HTMLElement;

    before(() => {
        Ch5AttrsShow.registerSignalAttributeTypes();
        Ch5AttrsTextContent.registerSignalAttributeTypes();
        Ch5AttrsAppendclass.registerSignalAttributeTypes();
        Ch5Button.registerSignalAttributeTypes();
        Ch5Template.registerSignalAttributeTypes();
        Ch5Template.registerSignalAttributeDefaults();
    })

    beforeEach(() => {
        ch5TemplateParentEl = document.createElement('template');
        ch5ButtonEl = document.createElement('ch5-button');
        stdDivEl = document.createElement('div');
        ch5TemplateChildEl = document.createElement('ch5-template');
        ch5TemplateParentEl.content.appendChild(ch5ButtonEl);
        ch5TemplateParentEl.content.appendChild(ch5TemplateChildEl);
        ch5TemplateParentEl.content.appendChild(stdDivEl);
    });

    it('do not mess up something without {{}}', () => {
        const attributeName = 'sendeventonclick';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = '1234'; 
        const expectedValue = providedValue; 

        ch5ButtonEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5ButtonEl.getAttribute(attributeName), expectedValue);
    }); 

    it('should update attribute value from "101{{idx}}" when idx=3 to 104', () => {
        const attributeName = 'sendeventonclick';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `101{{${indexId}}}`; 
        const expectedValue = '104'; 

        ch5ButtonEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5ButtonEl.getAttribute(attributeName), expectedValue);        
    }); 


    it('should update attribute value from "101+{{idx}}" when idx=3 to 104', () => {
        const attributeName = 'sendeventonclick';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `101+{{${indexId}}}`; 
        const expectedValue = '104'; 

        ch5ButtonEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5ButtonEl.getAttribute(attributeName), expectedValue);        
    }); 

    it('should update attribute value from "100+10*{{idx}}" when idx=3 to 130', () => {
        const attributeName = 'booleanjoinoffset';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `100+10*{{${indexId}}}`; 
        const expectedValue = '130'; 

        ch5TemplateChildEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5TemplateChildEl.getAttribute(attributeName), expectedValue);        
    }); 



    it('should update attribute value from "{{idx}}101" when idx=3 to 104', () => {
        const attributeName = 'sendeventonclick';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `{{${indexId}}}101`; 
        const expectedValue = '104'; 

        ch5ButtonEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5ButtonEl.getAttribute(attributeName), expectedValue);        
    }); 

    it('should update attribute value from "MyList[{{idx}}].Click" when idx=3 to MyList[3].Click', () => {
        const attributeName = 'sendeventonclick';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `MyList[{{${indexId}}}].Click`; 
        const expectedValue = 'MyList[3].Click'; 

        ch5ButtonEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);        
        assert.equal(ch5ButtonEl.getAttribute(attributeName), expectedValue);        
    }); 

    it('template context should not mess up something without {{}}', () => {
        const attributeName = 'context';
        const indexId = 'idx';
        const indexValue = 3;    
        const providedValue = 'MYTEMPLATE_clickjoin:1234;MYTEMPLATE_selectedjoin:1234;'; 
        const expectedValue = providedValue; 

        ch5TemplateChildEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5TemplateChildEl.getAttribute(attributeName), expectedValue);
    }); 

    it('should update context value from "MYTEMPLATE_clickjoin:101{{idx}}" when idx=3" to 104', () => {
        const attributeName = 'context';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `MYTEMPLATE_clickjoin:101{{${indexId}}}`; 
        const expectedValue = 'MYTEMPLATE_clickjoin:104'; 

        ch5TemplateChildEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5TemplateChildEl.getAttribute(attributeName), expectedValue);
    }); 


    it('should update context value from "MYTEMPLATE_clickjoin:101{{idx}};" when idx=3" to 104', () => {
        const attributeName = 'context';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `MYTEMPLATE_clickjoin:101{{${indexId}}};`; 
        const expectedValue = 'MYTEMPLATE_clickjoin:104;'; 

        ch5TemplateChildEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5TemplateChildEl.getAttribute(attributeName), expectedValue);
    }); 

    it('should update context value from "MYTEMPLATE_clickjoin:101{{idx}};MYTEMPLATE_selectedjoin:101{{idx}};" when idx=3" to 104', () => {
        const attributeName = 'context';
        const indexId = 'idx';
        const indexValue = 3;
        const providedValue = `MYTEMPLATE_clickjoin:101{{${indexId}}};MYTEMPLATE_selectedjoin:101{{${indexId}}};`; 
        const expectedValue = 'MYTEMPLATE_clickjoin:104;MYTEMPLATE_selectedjoin:104;'; 

        ch5TemplateChildEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5TemplateChildEl.getAttribute(attributeName), expectedValue);
    }); 

    it('should update context value from "DIFFTMPLT_cj:AList[{{idx}}].Click;DIFFTMPLT_sj:AList[{{idx}}].Selected" when idx=8" to AList[8]...', () => {
        const attributeName = 'context';
        const indexId = 'idx';
        const indexValue = 8;
        const providedValue = `DIFFTMPLT_cj:AList[{{${indexId}}}].Click;DIFFTMPLT_sj:AList[{{${indexId}}}].Selected`; 
        const expectedValue = 'DIFFTMPLT_cj:AList[8].Click;DIFFTMPLT_sj:AList[8].Selected'; 

        ch5TemplateChildEl.setAttribute(attributeName, providedValue);
        Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(ch5TemplateParentEl, indexValue, indexId);
        assert.equal(ch5TemplateChildEl.getAttribute(attributeName), expectedValue);
    }); 


    it('should increment simple digital join number', () => {
        const attributeName = 'sendeventonclick';
        const providedValue = 25;
        const incrementValue = 31; 
        const expectedValue = `${providedValue + incrementValue}`; 
        const contractName = "ContractPrefix."; 

        ch5ButtonEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));        
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, incrementValue, 0, 0);
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });


    it('should increment digital join number with {{index}} postfix in a ch5-common attribute', () => {
        const attributeName = 'receivestateshow';
        const providedValue = 17;
        const incrementValue = 31; 
        const indexName = 'index';
        const expectedValue = `${providedValue + incrementValue}{{${indexName}}}`; 

        ch5ButtonEl.setAttribute(attributeName, `${providedValue}{{${indexName}}}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));               
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, "", incrementValue, 0, 0);        
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });

    it('should increment simple serial join number', () => {
        const attributeName = 'receivestatelabel';
        const providedValue = 16;
        const incrementValue = 29; 
        const expectedValue = `${providedValue + incrementValue}`; 

        ch5ButtonEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));           
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, "", 0, 0, incrementValue);        
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });

    it('should increment digital join in div data-ch5-show', () => {
        const attributeName = 'data-ch5-show';
        const providedValue = 22;
        const incrementValue = 100;
        const expectedValue = `${providedValue + incrementValue}`; 

        stdDivEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[2].getAttribute(attributeName), stdDivEl.getAttribute(attributeName));
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, "", incrementValue, 0, 0);
        assert.equal(theClone.children[2].getAttribute(attributeName), expectedValue);        
    });

    it('should increment serial join in div data-ch5-textcontent', () => {
        const attributeName = 'data-ch5-textcontent';
        const providedValue = 21;
        const incrementValue = 50;
        const expectedValue = `${providedValue + incrementValue}`; 

        stdDivEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[2].getAttribute(attributeName), stdDivEl.getAttribute(attributeName));
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, "", 0, 0, incrementValue);
        assert.equal(theClone.children[2].getAttribute(attributeName), expectedValue);        
    });

    it('should increment simple serial join number with white space', () => {
        const attributeName = 'receivestatelabel';
        const providedValue = 16;
        const incrementValue = 29; 
        const expectedValue = `${providedValue + incrementValue}`; 

        ch5ButtonEl.setAttribute(attributeName, ` ${providedValue} `);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));           
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, "", 0, 0, incrementValue);        
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });

    // test with numeric value, contract name, but no increment, should not change value
    it('should not increment when 0 provided as increment and simple digital join number', () => {
        const attributeName = 'sendeventonclick';
        const providedValue = 25;
        const incrementValue = 0; 
        const expectedValue = `${providedValue + incrementValue}`; 
        const contractName = "ContractPrefix."; 

        ch5ButtonEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));            
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, incrementValue, 0, 0);        
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });


    it('should increment serial join number with {{index}} prefix', () => {
        const attributeName = 'receivestatelabel';
        const providedValue = 16;
        const incrementValue = 110; 
        const contractName = "ContractPrefix."; 
        const indexName = 'index';
        const expectedValue = `${providedValue + incrementValue}{{${indexName}}}`; 

        ch5ButtonEl.setAttribute(attributeName, `{{${indexName}}}${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));         
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 0, 0, incrementValue);        
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });


    it('should prefix contract name on digital signal name ', () => {
        const attributeName = 'sendeventonclick';
        const providedValue = "Clicked";
        const contractName = "ContractPrefix."; 
        const expectedValue = `${contractName}${providedValue}`; 

        ch5ButtonEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[0].getAttribute(attributeName), ch5ButtonEl.getAttribute(attributeName));         
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 99, 0, 0);        
        assert.equal(theClone.children[0].getAttribute(attributeName), expectedValue);        
    });

    it('should prefix contract name on serial signal name custom attribute data-ch5-appendclass', () => {
        const attributeName = Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME;
        const providedValue = "ClassName";
        const contractName = "ContractPrefix."; 
        const expectedValue = `${contractName}${providedValue}`; 

        stdDivEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[2].getAttribute(attributeName), stdDivEl.getAttribute(attributeName));         
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 99, 0, 11);        
        assert.equal(theClone.children[2].getAttribute(attributeName), expectedValue);        
    });    

    it('should update ch5-template "contractname" attribute when prefix is provided', () => {
        const attributeName = 'contractname';
        const providedValue = "InnerContractPrefix.";
        const contractName = "OuterContractPrefix."; 
        const expectedValue = `${contractName}${providedValue}`; 

        ch5TemplateChildEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[1].getAttribute(attributeName), ch5TemplateChildEl.getAttribute(attributeName));     
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 99, 100, 101);        
        assert.equal(theClone.children[1].getAttribute(attributeName), expectedValue);        
    });

    it('should update ch5-template "contractname" attribute when prefix is not empty', () => {
        const attributeName = 'contractname';
        const providedValue = "";
        const contractName = "OuterContractPrefix."; 
        const expectedValue = `${contractName}${providedValue}`; 

        ch5TemplateChildEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        assert.equal(theClone.children[1].getAttribute(attributeName), ch5TemplateChildEl.getAttribute(attributeName));     

        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 99, 100, 101);        
        assert.equal(theClone.children[1].getAttribute(attributeName), expectedValue);        
    });

    it('should create ch5-template  "contractname" attribute when attribute is not provided', () => {
        const attributeName = 'contractname';
        // const providedValue = "";
        const contractName = "OuterContractPrefix."; 
        const expectedValue = `${contractName}`; 

        // ch5TemplateEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 99, 100, 101);        
        assert.equal(theClone.children[1].getAttribute(attributeName), expectedValue);        
    });

    it('should not create ch5-template "contractname" attribute when attribute and contractname are not provided ', () => {
        const attributeName = 'contractname';
        // const providedValue = "";
        const contractName = ""; 
        // const expectedValue = `${contractName}`; 

        // ch5TemplateEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, 99, 100, 101);        
        assert.isNull(theClone.children[1].getAttribute(attributeName));        
    });



    it('should update ch5-template booleanjoinoffset attribute when incrementValue is provided', () => {
        const attributeName = 'booleanjoinoffset';
        const providedValue = 15;
        const incrementValue = 100;
        const contractName = "OuterContractPrefix."; 
        const expectedValue = `${providedValue + incrementValue}`; 

        ch5TemplateChildEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, incrementValue, 100, 101);        
        assert.equal(theClone.children[1].getAttribute(attributeName), expectedValue);        
    });


    it('should create ch5-template booleanjoinoffset attribute when increment is provided ', () => {
        const attributeName = 'booleanjoinoffset';
        // const providedValue = "";
        const incrementValue = 100;
        const contractName = "OuterContractPrefix."; 
        const expectedValue = `${incrementValue}`; 

        // ch5TemplateEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, incrementValue, 100, 101);        
        assert.equal(theClone.children[1].getAttribute(attributeName), expectedValue);           
    });



    it('should not create ch5-template booleanjoinoffset attribute when increment is not provided ', () => {
        const attributeName = 'booleanjoinoffset';
        // const providedValue = "";
        const incrementValue = 0;
        const contractName = "OuterContractPrefix."; 

        // ch5TemplateEl.setAttribute(attributeName, `${providedValue}`);
        const theClone = ch5TemplateParentEl.content.cloneNode(true) as HTMLElement;
        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, contractName, incrementValue, 100, 101);        
        assert.isNull(theClone.children[1].getAttribute(attributeName));        
    });

    // support syntax with sendEventOnClick="100+{{idx}}"


    // should support syntax with booleanjoinoffset="100+10*{{idx}}"

});

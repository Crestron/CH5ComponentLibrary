// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { expect, assert } from 'chai';
import { describe } from 'mocha';
import { Ch5AugmentVarSignalsNames } from './ch5-augment-var-signals-names';
import { Ch5AdvancedButton } from '../ch5-advanced-button/ch5-advanced-button';
import { Ch5Button } from '../ch5-button/ch5-button';
import { Ch5Template } from '../ch5-template/ch5-template';
import { Ch5JoinToTextBoolean } from '../ch5-jointotext-boolean/ch5-jointotext-boolean';
import { Ch5JoinToTextNumeric } from '../ch5-jointotext-numeric/ch5-jointotext-numeric';
import { Ch5JoinToTextString } from '../ch5-jointotext-string/ch5-jointotext-string';
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
        Ch5AdvancedButton.registerSignalAttributeTypes();
        Ch5Button.registerSignalAttributeTypes();
        Ch5JoinToTextBoolean.registerSignalAttributeTypes();
        Ch5JoinToTextNumeric.registerSignalAttributeTypes();
        Ch5JoinToTextString.registerSignalAttributeTypes();
        Ch5Template.registerSignalAttributeTypes();
        Ch5Template.registerSignalAttributeDefaults(Ch5Template.ELEMENT_NAME);
    })

    beforeEach(() => {
        ch5TemplateParentEl = document.createElement('template');
        ch5ButtonEl = document.createElement('ch5-advanced-button');
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

    it('should increment boolean joins nested inside labelInnerHTML markup', () => {
        const button = document.createElement('ch5-button');
        button.setAttribute('labelinnerhtml', '<ch5-jointotext-boolean receiveStateValue="100"></ch5-jointotext-boolean>');

        const template = document.createElement('template');
        template.content.appendChild(button);
        const theClone = template.content.cloneNode(true) as HTMLElement;

        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, '', 30, 0, 0);

        const nested = theClone.querySelector('ch5-jointotext-boolean') as HTMLElement;
        assert.isNotNull(nested, 'expected nested ch5-jointotext-boolean to exist');
        assert.equal(nested.getAttribute('receivestatevalue'), '130');
    });

    it('should increment numeric joins nested inside labelInnerHTML markup', () => {
        const button = document.createElement('ch5-button');
        button.setAttribute('labelinnerhtml', '<ch5-jointotext-numeric receiveStateValue="200"></ch5-jointotext-numeric>');

        const template = document.createElement('template');
        template.content.appendChild(button);
        const theClone = template.content.cloneNode(true) as HTMLElement;

        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, '', 0, 30, 0);

        const nested = theClone.querySelector('ch5-jointotext-numeric') as HTMLElement;
        assert.isNotNull(nested, 'expected nested ch5-jointotext-numeric to exist');
        assert.equal(nested.getAttribute('receivestatevalue'), '230');
    });

    it('should increment string joins nested inside labelInnerHTML markup', () => {
        const button = document.createElement('ch5-button');
        button.setAttribute('labelinnerhtml', '<ch5-jointotext-string receiveStateValue="300"></ch5-jointotext-string>');

        const template = document.createElement('template');
        template.content.appendChild(button);
        const theClone = template.content.cloneNode(true) as HTMLElement;

        Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(theClone, '', 0, 0, 40);

        const nested = theClone.querySelector('ch5-jointotext-string') as HTMLElement;
        assert.isNotNull(nested, 'expected nested ch5-jointotext-string to exist');
        assert.equal(nested.getAttribute('receivestatevalue'), '340');
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

    // ---------------------------------------------------------------------------
    // <template> content is never descended into.
    //
    // Neither differentiateTmplElemsAttrs nor customDifferentiateTmplElemsAttrs
    // recurses into a nested <template>.content: iterateAttributesInTemplate only
    // walks querySelectorAll('*'), which by spec does not enter template content.
    // Consequences every consumer relies on:
    //   - Top-level joins (direct children of the processed fragment) are always
    //     incremented / contract-prefixed.
    //   - Joins that live inside a nested <template> are left pristine. The owning
    //     component offsets them itself: advanced-button / tab-button / button-list /
    //     select / spinner / list / subpage self-apply their propagated offset on
    //     connect, and ch5-slider-button self-applies its own offset onto the
    //     rendered label span (see Ch5SliderButton.applyLabelSignalOffsets). So the
    //     carrier must NOT descend, or those joins would be incremented twice.
    // ---------------------------------------------------------------------------
    describe('<template> content is not descended into', () => {
        const NUM_OFFSET = 200;
        const BOOL_OFFSET = 300;
        const STR_OFFSET = 100;

        const buildDetachedClone = (html: string): HTMLElement => {
            const container = document.createElement('template');
            container.innerHTML = html;
            return container.content.cloneNode(true) as unknown as HTMLElement;
        };

        // querySelector does NOT descend into <template>.content, so fetch the
        // template element first and query its content fragment.
        const nestedInTemplate = (root: ParentNode, selector: string): HTMLElement | null => {
            const tmpl = root.querySelector('template') as HTMLTemplateElement | null;
            return tmpl ? (tmpl.content.querySelector(selector) as HTMLElement | null) : null;
        };

        it('does NOT descend into a ch5-advanced-button label <template> (advanced-button self-applies later)', () => {
            const clone = buildDetachedClone(
                `<ch5-advanced-button>` +
                `<ch5-advanced-button-label>` +
                `<template>` +
                `<ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric>` +
                `<ch5-jointotext-boolean receivestatevalue="2"></ch5-jointotext-boolean>` +
                `<ch5-jointotext-string receivestatevalue="3"></ch5-jointotext-string>` +
                `</template>` +
                `</ch5-advanced-button-label>` +
                `</ch5-advanced-button>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, '', BOOL_OFFSET, NUM_OFFSET, STR_OFFSET);

            // The carrier must leave the button's private label template pristine; the
            // advanced-button re-applies the propagated offset itself on connect.
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-boolean')!.getAttribute('receivestatevalue'), '2');
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-string')!.getAttribute('receivestatevalue'), '3');
        });

        it('does NOT descend into a ch5-tab-button label <template>', () => {
            const clone = buildDetachedClone(
                `<ch5-tab-button>` +
                `<ch5-tab-button-label>` +
                `<template><ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric></template>` +
                `</ch5-tab-button-label>` +
                `</ch5-tab-button>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, '', 0, NUM_OFFSET, 0);

            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
        });

        it('does NOT descend into a ch5-slider-button-label <template> (ch5-slider-button self-applies its offset at render time)', () => {
            const clone = buildDetachedClone(
                `<ch5-slider>` +
                `<ch5-slider-button key="on">` +
                `<ch5-slider-button-label>` +
                `<template>` +
                `<ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric>` +
                `<ch5-jointotext-boolean receivestatevalue="2"></ch5-jointotext-boolean>` +
                `<ch5-jointotext-string receivestatevalue="3"></ch5-jointotext-string>` +
                `</template>` +
                `</ch5-slider-button-label>` +
                `</ch5-slider-button>` +
                `</ch5-slider>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, '', BOOL_OFFSET, NUM_OFFSET, STR_OFFSET);

            // Carrier leaves the slider label template pristine; ch5-slider-button applies
            // its own join offset onto the rendered label span (see applyLabelSignalOffsets).
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-boolean')!.getAttribute('receivestatevalue'), '2');
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-string')!.getAttribute('receivestatevalue'), '3');
        });

        it('does NOT descend into a self-rendering component <template> (button-list/select/spinner/list/plain carrier) - prevents double-apply', () => {
            // A plain (non slider-label) nested template is left untouched by the carrier;
            // the owning self-rendering component re-applies the propagated offset itself,
            // so descending here would double-count (the reported 11 -> 311 -> 611 bug).
            const clone = buildDetachedClone(
                `<div>` +
                `<template>` +
                `<ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric>` +
                `<ch5-jointotext-boolean receivestatevalue="2"></ch5-jointotext-boolean>` +
                `<ch5-jointotext-string receivestatevalue="3"></ch5-jointotext-string>` +
                `</template>` +
                `</div>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, '', BOOL_OFFSET, NUM_OFFSET, STR_OFFSET);

            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-boolean')!.getAttribute('receivestatevalue'), '2');
            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-string')!.getAttribute('receivestatevalue'), '3');
        });

        it('does NOT descend into a slider-label <template> when the carrier is connected (never re-process live DOM)', () => {
            const host = document.createElement('ch5-slider');
            host.innerHTML =
                `<ch5-slider-button-label>` +
                `<template><ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric></template>` +
                `</ch5-slider-button-label>`;
            document.body.appendChild(host);
            try {
                Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(host, '', 0, NUM_OFFSET, 0);
                assert.equal(nestedInTemplate(host, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
            } finally {
                document.body.removeChild(host);
            }
        });

        it('does NOT descend into a detached slider-title-label <template>', () => {
            const clone = buildDetachedClone(
                `<ch5-slider>` +
                `<ch5-slider-title-label>` +
                `<template><ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric></template>` +
                `</ch5-slider-title-label>` +
                `</ch5-slider>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, '', 0, NUM_OFFSET, 0);

            assert.equal(nestedInTemplate(clone, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
        });

        it('top-level joins are always incremented regardless of nested templates', () => {
            const clone = buildDetachedClone(
                `<ch5-jointotext-numeric receivestatevalue="5"></ch5-jointotext-numeric>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, '', 0, NUM_OFFSET, 0);

            assert.equal((clone.querySelector('ch5-jointotext-numeric') as HTMLElement).getAttribute('receivestatevalue'), '205');
        });

        it('customDifferentiateTmplElemsAttrs (ch5-slider) also does NOT descend into a <template>', () => {
            const host = document.createElement('div');
            host.innerHTML = `<template><ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric></template>`;
            document.body.appendChild(host);
            try {
                Ch5AugmentVarSignalsNames.customDifferentiateTmplElemsAttrs(host, '', 0, NUM_OFFSET, 0);
                assert.equal(nestedInTemplate(host, 'ch5-jointotext-numeric')!.getAttribute('receivestatevalue'), '1');
            } finally {
                document.body.removeChild(host);
            }
        });

        it('reproduces the reported ch5-template + advanced-button case as a single increment', () => {
            // <ch5-template numericjoinoffset="200" ...> instantiates a detached clone of
            // its widget definition and calls differentiateTmplElemsAttrs on it. The inner
            // advanced-button label joins must be offset exactly ONCE (1 -> 201), not twice.
            const clone = buildDetachedClone(
                `<ch5-advanced-button class="test-tg">` +
                `<ch5-advanced-button-label>` +
                `<template><ch5-jointotext-numeric receivestatevalue="1"></ch5-jointotext-numeric></template>` +
                `</ch5-advanced-button-label>` +
                `</ch5-advanced-button>`
            );

            Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(clone, 'Room.', 300, NUM_OFFSET, 100);

            // Carrier leaves the template pristine (button self-applies later) -> never 401.
            const nested = nestedInTemplate(clone, 'ch5-jointotext-numeric')!;
            assert.equal(nested.getAttribute('receivestatevalue'), '1');
            assert.notEqual(nested.getAttribute('receivestatevalue'), '401');
        });
    });

});

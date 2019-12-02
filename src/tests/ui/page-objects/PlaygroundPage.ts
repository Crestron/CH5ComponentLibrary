// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {BasePage} from '.';
import { ButtonData } from '../data-providers/ButtonData';
import { ListData } from '../data-providers/ListData';
import { ImageData } from '../data-providers/ImageData';
import { ToggleData } from '../data-providers/ToggleData';
import { SliderData } from '../data-providers/SliderData';
import { debug } from 'util';
import { SpinnerData } from '../data-providers/SpinnerData';

//chai initialize
let chai = require('chai');
let chaiWebdriver = require('chai-webdriverio').default;
chai.use(chaiWebdriver(browser));
let expect = chai.expect;

//globals
declare const browser: any;
declare const CrComLib: any;
declare const jQuery: any;
declare let _test_prevValuesString: any;
declare let _test_prevValuesNumber: any;
declare let _test_prevValuesBoolean: any;

export class PlaygroundPage extends BasePage {

    private static PlaygroundUrl: string = 'playground.html';
    private YPosition: any;
    private BtnRunEmulator: string = 'button.is-info.btn-run-scenario';
    private BtnLoadEmulator: string = 'button.is-info.btn-load-scenario';
    private BtnExpandEmulator: string = 'div.emulator-scenario > div.message-header > span';
    private BtnPreview: string = 'div.columns > div:nth-child(2) > div > button';
    private TabHTML: string = 'div.boxtest.example > div.columns > div:nth-child(2) > div > div.tabs.is-medium > ul > li:nth-child(1)';
    private TabJs: string = 'div.tabs.is-medium > ul > li:nth-child(2)';
    private TabCSS: string = 'div.tabs.is-medium > ul > li:nth-child(3)';
    private TabPreview: string = 'div.boxtest.example > div.columns > div:nth-child(1) > div > div.tabs.is-medium';
    private TextAreaHtml: string = 'div.block.block-html > pre';
    private TextAreaJs: string = 'div.block.block-js > pre';
    private TextAreaCss: string = 'div.block.block-css > pre';
    private TextAreaEmulator: string = 'div.emulator-scenario div.block.block-emulator > pre';

    // Opens the Playground URL
    public static openURL(url: string = this.PlaygroundUrl): PlaygroundPage {
        const page = new PlaygroundPage().open(url) as PlaygroundPage;
        return page;
    };

    // Checks one Attribute for each element from a list of elements agasint an array of expected values
    public checkAttributeValues(SelectorList: string, Attribute: string, ValueList: string[]): PlaygroundPage {
        var i = 0;
        var ElementsArray = browser.elements(SelectorList).value;

        ElementsArray.forEach(Elem => {
            expect(Elem.getAttribute(Attribute)).to.equal(ValueList[i]);
            i++;
        });
        return this;
    }

    // Checks one CSS propertiey for every element from a list of elements against an array of expected values
    public checkCssPropertyValues(SelectorList: string, Property: string, ValueList: string[]): PlaygroundPage {
        var i = 0;
        var ElementsArray = browser.elements(SelectorList).value;

        ElementsArray.forEach(Elem => {
            expect(Elem.getCssProperty(Property)['value']).to.equal(ValueList[i]);
            i++;
        });
        return this;
    }

    // Simulates pressing the tab key twice, used to check the tabIndex attribute from the ch5-textinput component
    public pressTabKeyTwice(): PlaygroundPage {
        browser.keys('\uE004');
        browser.keys('\uE004');
        return this;
    }

    // Inputs text to an element, mainly used to check the ch5-textinput component
    public inputElementText(Element:string, Text:string): PlaygroundPage {
        browser.setValue(Element, Text);
        return this;
    }

    // Checks if an element is not visible on the page
    public checkNoVisibility(Element: string): PlaygroundPage {
        expect(browser.isVisible(Element)).to.equal(false);
        return this;
    }

    // Clicks on the preview tab element, mainly used to check the dismissable attribute from the ch5-overlay-panel and ch5-modal-dialog components
    public clickTabPreview(): PlaygroundPage {
        browser.click(this.TabPreview);
        return this;
    }

    // Checks the signal values of a numberSignal from an array resulted from the subscribeNumberSignal() method
    public checkNumberSignal(SignalValue: string): PlaygroundPage {
        var s = browser.executeAsync(function(Value ,done){
            var v = _test_prevValuesNumber.pop();
            if (Value===v) {
                done(true);
            } else {
                done(false);
            }
         }, Number(SignalValue));

        expect(s.value).to.equal(true);
        return this;
    };

    // Used to move the handle of a ch5-slider component a certain number of pixels to the right or left
    public moveHandle(HandleElement: string, Pixels: string): PlaygroundPage {
        browser.moveToObject(HandleElement);
        browser.buttonDown(0);
        browser.moveToObject(SliderData.SLIDER_BAR, Number(Pixels), 0);
        browser.buttonUp(0);
        return this;
    }

    // Used to move the ch5-triggerview component with the gestureable attribute enabled a certain number of pixels to the right or left
    public moveTriggerView(TriggerViewElement: string, Pixels: string): PlaygroundPage {
        const wait = 2000;
        browser.moveToObject(TriggerViewElement);
        browser.pause(wait);
        browser.buttonDown(0);
        browser.pause(wait);
        browser.moveToObject(TriggerViewElement , Number(Pixels), 0);
        browser.pause(wait * 5);
        browser.buttonUp(0);
        browser.pause(wait);
        return this;
    }

    // Used to move a ch5-spinner component
    public moveSpinner(Element: string, Pixels: string, releaseButton: boolean = true): PlaygroundPage {
        browser.pause(500);
        browser.moveToObject(Element);
        browser.pause(500);
        browser.buttonDown(0);
        browser.pause(500);
        browser.moveToObject(Element, 0, Number(Pixels));
        browser.pause(500);
        if (releaseButton)
        {
            browser.buttonUp(0);
        }
        return this;
    }

    // Used to move a endless ch5-spinner component
    public moveEndlessSpinner(Element: string, Pixels: string, Pixels2: string, Pixels3?: string): PlaygroundPage {
        browser.pause(500);
        browser.moveToObject(Element);
        browser.pause(500);
        browser.buttonDown(0);
        browser.pause(500);
        browser.moveToObject(Element, 0, Number(Pixels));
        browser.pause(500);
        browser.moveToObject(Element, 0, Number(Pixels2));
        browser.pause(500);
        if(Pixels3 != undefined){
            browser.moveToObject(Element, 0, Number(Pixels3));
            browser.pause(500);
        }
        return this;
    }

    // Checks the signal values of a booleanSignal from an array resulted from the subscribeBooleanSignal() method
    public checkBooleanSignal(Value: boolean): PlaygroundPage {
        var s = browser.executeAsync(function(Value ,done){
            var v = _test_prevValuesBoolean.pop();
            if (Value===v) {
                done(true);
            } else {
                done(false);
            }
         }, Value);

        expect(s.value).to.equal(true);
        return this;
    };

    // Used to check the signalValueSyncTimeout attribute
    public waitForValueSyncTimeout(TimeoutValue: string): PlaygroundPage {
        browser.pause(Number(TimeoutValue));
        return this;
    }

    // Used to check the refreshRate attribute from the ch5-image component
    public waitImageUrlToChange(): PlaygroundPage {
        browser.pause(1000 * Number(ImageData.REFRESH_RATE_ATTRIBUTE_VALUE));
        return this;
    }

    // Checks if the attribute value of an element is NOT equal to an exepected value, used to check the URL value of an image from the ch5-image component
    public checkImageUrl(Element: string, Attribute: string): PlaygroundPage{
        expect(this.getImageUrl(Element, Attribute)).to.not.equal(browser.getAttribute(Element, Attribute));
        return this;
    }

    // Gets the attribute value of an element, used to get the URL value of an image from the ch5-image component
    public getImageUrl(Element: string, Attribute: string): PlaygroundPage {
        browser.getAttribute(Element, Attribute)
        return this;
    }

    // Checks if the displayed text of an element is equal to an expected value
    public checkElementText(Element: string, Text: string): PlaygroundPage {
        expect(browser.getText(Element)).to.equal(Text);
        return this;
    }

    // Determines an element’s y position on the page
    public getElementPostition(Element: string): PlaygroundPage {
        this.YPosition = browser.getLocation(Element, 'y');
        return this;
    }

    // Simulates the swipeUp gesture on a element
    public swipeElementUp(Element: string): PlaygroundPage {
        browser.swipeUp(Element, 0);
        return this;
    }

    // Checks if the value returned from the getElementPosition() method is NOT equal to an expected value, used to check if a list was succesfully swiped
    public checkElementPosition(Element: string): PlaygroundPage {
        expect(this.getElementPostition(Element)).to.not.equal(this.YPosition);
        return this;
    }

    // Checks if the number of elements returned by the getNumberOfElements() method is equal to an expected value
    public checkNumberOfElements(Element: string, Number: string): PlaygroundPage {
        expect(String(this.getNumberOfElements(Element))).to.be.equal(Number);
        return this;
    }

    // Gets the width and height for an element based on the given element selector
    public checkElementSize(Element:string, Size: string): PlaygroundPage {
        expect(JSON.stringify(browser.getElementSize(Element))).to.equal(Size);
        return this;
    }

    // Gets the width and height of two elements and checkes if the two element sizes are different based on the given element selectors
    public checkIfElementSizesAreNotEqual(Element:string, Element2: string): PlaygroundPage {
        expect(JSON.stringify(browser.getElementSize(Element))).is.not.equal(JSON.stringify(browser.getElementSize(Element2)));
        return this;
    }

    // Gets the width of two elements and checkes if the two element sizes are equal based on the given element selectors
    public checkIfElementWidthsAreEqual(Element:string, Element2: string): PlaygroundPage {
        expect(JSON.stringify(browser.getElementSize(Element, 'width'))).to.equal(JSON.stringify(browser.getElementSize(Element2, 'width')));
        return this;
    }

    // Gets the number of elements based on the given element selector
    public getNumberOfElements(Element: string): Number {
        return Object.keys(browser.elements(Element).value).length;
    }

    // Checks the signal values of a stringSignal from an array resulted from the subscribeStringSignal() method
    public checkStringSignal(StringValue: string): PlaygroundPage {
        var s = browser.executeAsync(function(Value, done){
            var v = _test_prevValuesString.pop();
            if (v === Value) {
                done(true);
            } else {
                done(false);
            }
         }, StringValue);

        expect(s.value).to.equal(true);
        return this;
    }

    // Checks the signal values of a touchSignal from an array resulted from the subscribeBooleanSignal() method
    public checkTouchSignal():PlaygroundPage {
        var s = browser.executeAsync(function(done){
            var v = _test_prevValuesBoolean.pop();
            var prev = _test_prevValuesBoolean.pop();
            var prev2 = _test_prevValuesBoolean.pop();
            if (true=== prev2 && true===prev && false===v) {
                done(true);
            } else {
                done(false);
            }
         });

        expect(s.value).to.equal(true);
        return this;
    }

    // Checks the signal values of a booleanPulseSignal from an array resulted from the subscribeBooleanSignal() method
    public checkBooleanPulseSignal(): PlaygroundPage {
        var s = browser.executeAsync(function(done){
            var v = _test_prevValuesBoolean.pop();
            var prev = _test_prevValuesBoolean.pop();
            if (true===prev && false===v) {
                done(true);
            } else {
                done(false);
            }
         });

        expect(s.value).to.equal(true);
        return this;
    };

    // Simulates a tap and hold gesture on a generated ch5 element from the Playground page, the browser should be in emulation mode for this method to work properly
    public touchGeneratedElement(Element: string): PlaygroundPage{
        browser.hold(Element);
        return this;
    }

    public WaitForSpinnerOverlay(): PlaygroundPage {
        browser.pause(1000);
        return this;
    }

    // Slicks on a generated ch5 element from the Playground page
    public clickGeneratedElement(Element: string): PlaygroundPage {
        browser.waitForVisible(Element);
        browser.click(Element);
        return this;
    };

    // Subscribes to a Boolean signal, the values from the sent or received signals are saved in an array for later assertions
    public subscribeBooleanSignal(SignalName: string): PlaygroundPage {
        this.subscribeSignal('boolean', SignalName);
        return this;
    };

    // Subscribes to a String signal, the values from the sent or received signals are saved in an array for later assertions
    public subscribeStringSignal(SignalName: string): PlaygroundPage {
        this.subscribeSignal('string', SignalName);
        return this;
    };

    // Subscribes to a Number signal, the values from the sent or received signals are saved in an array for later assertions
    public subscribeNumberSignal(SignalName: string): PlaygroundPage {
        this.subscribeSignal('number', SignalName);
        return this;
    };

    // Clicks on the Run button of the emulator editor from the Playground page
    public runEmulator(): PlaygroundPage {
        browser.click(this.BtnRunEmulator);
        return this;
    };

    // Clicks on the Load button of the emulator editor from the Playground page
    public loadEmulator(): PlaygroundPage {
        browser.click(this.BtnLoadEmulator);
        return this;
    };

    // Checks if the HTML code of an element is NOT equal to an expected value
    public checkNoElementHTML(Element: string, HTML: string): PlaygroundPage {
        expect(browser.getHTML(Element)).to.not.include(HTML);
        return this;
    };

    // Checks if the HTML code of an element is equal to an expected value
    public checkElementHTML(Element: string, HTML: string): PlaygroundPage {
        expect(browser.getHTML(Element)).to.include(HTML);
        return this;
    };

    // Checks if the cssClasses (string containing classes separated by space) are present on the Element
    public checkExistanceOfCssClasses(Element: string, cssClasses:string):PlaygroundPage {
        const cssClassesString = browser.getAttribute(Element, 'class');
        const cssClassesArray = cssClassesString.split(' ');
        expect(cssClassesArray,JSON.stringify(cssClassesArray)).to.include.members(cssClasses.split(' '));
        return this;
    }

    // Checks if the Attribute value of an element is equal to an expected value
    public checkAttribute(Element: string, Attribute: string, AttributeValue: string): PlaygroundPage {
        expect(browser.getAttribute(Element, Attribute)).to.be.equal(AttributeValue);
        return this;
    };

    // Check textContent value of an element
    public checkTextContent(Element: string, ExpectedTextContent: string): PlaygroundPage {
        expect(browser.$(Element).getText()).to.be.equal(ExpectedTextContent);
        return this;
    };
    // Check textContent value of an element
    public checkHtmlContent(Element: string, ExpectedHtmlContent: string): PlaygroundPage {
        const elHtml = browser.$(Element).getHTML();
        const elInnerHTML = elHtml.substring(elHtml.indexOf('>') + 1, elHtml.lastIndexOf('<'));
        expect(elInnerHTML).to.be.equal(ExpectedHtmlContent);
        return this;
    };

    // Checks if a indexId is replaced according with join nr specs for a specific attribute and text content
    public checkVariableSignalsJoinNrAugmentation(Element: string, ChildElems: string, Attribute: string,
                                                  SignalAugBase: number, TextContentSelector: string,
                                                  TextContentBase: string): PlaygroundPage {
        const options = browser.$(Element).$$(ChildElems);
        if (options.length) {
            for (let i = 0; i < options.length; i++) {
                expect(options[i].getAttribute(Attribute)).to.equal(String(SignalAugBase + i));
            }
        }

        const optionsTextContents = browser.$(Element).$$(TextContentSelector);
        if (optionsTextContents.length) {
            for (let i = 0; i < optionsTextContents.length; i++) {
                expect(optionsTextContents[i].getHTML().indexOf(TextContentBase + (i + 1)) > -1)
                    .to.equal(true);
            }
        }

        return this;
    };

    // Checks if the CssProperty of an element is equal to an expected value
    public checkCssProperty(Element: string, Property: string, PropertyValue: string): PlaygroundPage {
        expect(browser.getCssProperty(Element, Property)['value']).to.be.equal(PropertyValue);
        return this;
    };

    // Checks the visibility of an element on the page, can check up to 3 elements at once
    public checkVisibility(Element1: string ,Element2?: string, Element3?: string): PlaygroundPage {
        expect(browser.waitForVisible(Element1, 5000)).to.equal(true);

        if (Element2 != undefined)
            expect(browser.waitForVisible(Element2, 5000)).to.equal(true);

        if (Element3 != undefined)
            expect(browser.waitForVisible(Element3, 5000)).to.equal(true);

        return this;
    };

    // Checks the existance of an element on the page, can check up to 3 elements at once
    public checkExistance(Element1: string ,Element2?: string, Element3?: string): PlaygroundPage {
        expect(Element1).to.be.there();

        if (Element2 != undefined)
            expect(Element2).to.be.there();

        if (Element3 != undefined)
            expect(Element3).to.be.there();

        return this;
    };

    // Clicks the Preview button to generate inputted text from the HTML, JS, CSS editors
    public clickPreviewBtn(): PlaygroundPage{
        browser.waitForVisible(this.BtnPreview);
        browser.click(this.BtnPreview);
        return this;
    };

    // Clicks on the HTML edtior tab
    public goToEditorHtml(): PlaygroundPage {
        browser.scroll(this.TabHTML, 0, -100);
        browser.click(this.TabHTML);
        return this;
    };

    // Clicks on the JS edtior tab
    public goToEditorJs(): PlaygroundPage {
        browser.click(this.TabJs);
        return this;
    };

    // Clicks on the CSS edtior tab
    public goToEditorCss(): PlaygroundPage {
        browser.click(this.TabCSS);
        return this;
    };

    // Expands the emulator accordion from the Playground page
    public goToEmulator(): PlaygroundPage {
        browser.scroll(this.BtnExpandEmulator, 0, -100);
        browser.click(this.BtnExpandEmulator);
        return this;
    };

    // Input text in the HTML editor
    public inputHtmlText(HTMLText: string): PlaygroundPage {
        this.inputTextToEditor('html', HTMLText);
        return this;
    };

    // Input text in the JS editor
    public inputJsText(JsText: string): PlaygroundPage {
        this.inputTextToEditor('js', JsText);
        return this;
    };

    // Input text in the CSS editor
    public inputCssText(CSSText: string): PlaygroundPage {
        this.inputTextToEditor('css', CSSText);
        return this;
    };

    // Input text in the Emulator editor
    public inputEmulatorText(EmulatorText: string): PlaygroundPage {
        this.inputTextToEditor('emulator', EmulatorText);
        return this;
    };

    // Uses the selectorExecute() method to inject jQuery in the page to input text to each different editor
    private inputTextToEditor(EditorType: string, Text: string): void {
        switch(EditorType) {
            case 'html': {
                browser.selectorExecute(this.TextAreaHtml,(TextAreaHtml,Text)=>{
                    jQuery(TextAreaHtml).data('editor').setValue(Text);
                    },Text);
                break;
            }

            case 'js': {
                browser.selectorExecute(this.TextAreaJs,(TextAreaJs,Text)=>{
                    jQuery(TextAreaJs).data('editor').setValue(Text);
                    },Text);
                break;
            }

            case 'css': {
                browser.selectorExecute(this.TextAreaCss,(TextAreaCss,Text)=>{
                    jQuery(TextAreaCss).data('editor').setValue(Text);
                    },Text);
                break;
            }

            case 'emulator': {
                browser.selectorExecute(this.TextAreaEmulator,(TextAreaEmulator,Text)=>{
                    jQuery(TextAreaEmulator).data('editor').setValue(Text);
                    },Text);
                break;
            }
        }
    }

    // This method returns the last n messages from the console browser
    private getLastLogMessages(NumberOfMessages: number): any {
        var consolelog = browser.log('browser');
        var array = [];

        for (var i = consolelog.value.length-NumberOfMessages; i<consolelog.value.length;i++){
            array.push(this.getValueFromObjectByString(consolelog, 'value['+i+'].message'));
        }

        return array;

    }

    // This method returns the value of a key from a JS object
    // Use: getValueFromObjectByString(object, 'key[0].deepkey[0].etc')
    private getValueFromObjectByString(o, s): string {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

    // Uses the executeAsync() method to inject js in the page, it allows to subscribe to each different type of signal
    private subscribeSignal(SignalType: string, Signal: string): PlaygroundPage {
        switch(SignalType) {
            case 'boolean': {
                browser.executeAsync(function(Signal, done){
                    var k=CrComLib.Ch5SignalFactory.getInstance().getBooleanSignal(Signal);
                    _test_prevValuesBoolean = [];
                    var s = k.subscribe(function(v) {
                    _test_prevValuesBoolean.push(v);
                    });
                    done();
                },Signal);
                break;
            }

            case 'string': {
                browser.executeAsync(function(Signal, done){
                    var k=CrComLib.Ch5SignalFactory.getInstance().getStringSignal(Signal);
                    _test_prevValuesString = [];
                    var s = k.subscribe(function(v) {
                    _test_prevValuesString.push(v);
                    });
                    done();
                },Signal);
                break;
            }

            case 'number': {
                browser.executeAsync(function(Signal, done){
                    var k=CrComLib.Ch5SignalFactory.getInstance().getNumberSignal(Signal);
                    _test_prevValuesNumber = [];
                    var s = k.subscribe(function(v) {
                    _test_prevValuesNumber.push(v);
                    });
                    done();
                },Signal);
                break;
            }
        }
        return this;
    }

    public checkComponentVisibility(htmlSelector: string, propertyValue: boolean, waitingTime: number): PlaygroundPage {
        browser.execute(function(selector : string) {
            document.getElementById(selector).parentElement.setAttribute('style', 'display: none');
        }, htmlSelector);

        browser.waitUntil(() => {
            const result = browser.execute(function(selector : string) {
                return (document.getElementById(selector) as any).elementIsVisible;
            }, htmlSelector);

            return result.value === propertyValue;
          }, waitingTime);

        return this;
    }

    public testSubscribeInViewportChangeUtilityFunction(htmlFirstSelector: string, htmlSecondSelector: string, expectedResult: string) : PlaygroundPage {
        browser.scroll(htmlFirstSelector);
        expect($(htmlSecondSelector).getHTML(false)).to.be.equal(expectedResult);

        return this;
    }
}

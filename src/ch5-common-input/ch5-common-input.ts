// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import HtmlCallback from "../ch5-common/utils/html-callback";
import { ICh5CommonInputAttributes } from "./interfaces/i-ch5-common-input-attributes";
import { TCh5CommonInputFeedbackModes } from "./interfaces/t-ch5-common-input";

/** 
 * @class Ch5CommonInput
 */
export abstract class Ch5CommonInput extends Ch5Common implements ICh5CommonInputAttributes {

    /**
     * Contains the feedback modes
     * 
     * @type {TCh5CommonInputFeedbackModes}
     */
    public static FEEDBACKMODES: TCh5CommonInputFeedbackModes[]  = ["direct", "submit"];

    /**
     * The input element itself
     * 
     * @type {HTMLInputElement}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _elInput: HTMLInputElement = {} as HTMLInputElement;

    /**
     * Defines the time between the user click the
     * toggle and the time the toggle will check if the value is equal
     * with the value from the signal. If not it will automatically apply
     * the value from the signal. Apply only for feedbackMode direct 
     * 
     * @type {number}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _signalValueSyncTimeout: number = 1500;

    /**
     * This property stores the value which comes from signal
     * 
     * @type {string | number}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _cleanValue: (string | number | boolean) = '' as (string | number | boolean);

    /**
     * Flag - determine if the input has initial value or not
     * 
     * @type {boolean}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _clean: boolean = true as boolean;

    /**
     * Contains the changed value
     * 
     * @type {string | number}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _dirtyValue: (string | number | boolean) = '' as (string | number | boolean);

    /**
     * Flag - determine if the input was changed
     * 
     * @type {boolean}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _dirty: boolean = false as boolean;

    /**
     * Flag - determine if the form has been submited
     * 
     * @type {boolean}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _submitted: boolean = false as boolean;

    protected _dirtyTimerHandle: number|null = null;

    /**
     * Default direct. Valid values 'direct', 'submit'
     * 'direct' has updates trigger change event and sendEventOnChange
     * as user changes.
     * 'submit' triggers change event and updating signal in
     * sendEventOnChange attribute only when the submit() method is
     * called by a Form Component
     * 
     * @type {TCh5CommonInputFeedbackModes}
     * @protected 
     * @memberof Ch5CommonInput
     */
    protected _feedbackMode: TCh5CommonInputFeedbackModes = '' as TCh5CommonInputFeedbackModes;

    /**
     * Input value
     * 
     * @type {string | number}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _value: (string | number | boolean) = '' as (string | number | boolean);
    
    /**
     * Flag the required input
     * 
     * @type {boolean}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _required: boolean = false as boolean;

    protected _ondirtyCallback: HtmlCallback | {} = {} as HtmlCallback;

    protected _oncleanCallback: HtmlCallback | {} = {} as HtmlCallback;

    constructor() {
        super();
    }

    /**
     * Submit the value ( send a signal )
     * 
     * @abstract
     * @return void
     */
    public abstract submit(): void;

    /**
     * Reset value property
     * 
     * @abstract
     * @return void
     */
    public abstract reset(): void;

    /**
     * Returns true if feedbackmode='submit' and the displayed value is different than the actual value
     * 
     * @returns {boolean}
     */
    public getDirty(): boolean {
        if (this.feedbackMode === 'submit') {
            return this._dirty;
        }
        
        return false;
    }

    /**
     * Getter for feedbackMode property
     * 
     * @return {TCh5CommonInputFeedbackModes}
     */
    public get feedbackMode(): TCh5CommonInputFeedbackModes {

        return this._feedbackMode;
    }

    /**
     * Setter for feedbackMode property
     * 
     * @param {TCh5CommonInputFeedbackModes} mode
     */
    public set feedbackMode(mode: TCh5CommonInputFeedbackModes) {

        if (this._feedbackMode !== mode) {
            if (Ch5CommonInput.FEEDBACKMODES.indexOf(mode) < 0){
                mode = Ch5CommonInput.FEEDBACKMODES[0];
            }

            this.setAttribute('feedbackMode', mode);
            this._feedbackMode = mode;
        }
    }

    /**
     * Getter for signalValueSyncTimeout
     * 
     * @return {number}
     */
    public get signalValueSyncTimeout() {

        return this._signalValueSyncTimeout;
    }

    /**
     * Setter for signalValueSyncTimeout
     * 
     * @param {number} timeout
     */
	public set signalValueSyncTimeout(value: number | string ) {
        value = Number(value);
       
        if (isNaN(value)) {
            value = 1500;
        }

        if (this._signalValueSyncTimeout !== value) {
            this.setAttribute('signalValueSyncTimeout', value + '');
            this._signalValueSyncTimeout = value;
        }
    }

    /**
     * Setter for cleanValue
     * 
     * @param {string | number} value
     */
    public set cleanValue(value: (string | number | boolean)) {
        
        if (this.cleanValue !== value && (value === undefined || value === null)) {
            value = '';
        }
        this._cleanValue = value;
    }

    /**
     * Getter for cleanValue
     * 
     * @return {string | number}
     */
    public get cleanValue(): (string | number | boolean) {

        return this._cleanValue;
    }

    /**
     * Setter for dirtyValue
     * 
     * @param {string | number} value
     */
    public set dirtyValue(value: (string | number | boolean)) {

        if (this.dirtyValue !== value && (value === undefined || value === null)) {
            value = ''; 
        }

        this._dirtyValue = value;
    }

    /**
     * Getter for dirtyValue
     * 
     * @param {string | number | boolean}
     */
    public get dirtyValue(): string | number | boolean {
        
        return this._dirtyValue;
    }

    /**
     * Setter for value
     * 
     * @param {string | number | boolean} value
     */
    public set value(value: (string | number | boolean)) {

        this.info("Set input value (" + value + ")");

        if (this.value !== value) {
            if (value === undefined || value === null) {
                value = '';
            }
        }

        this._value = value;
        
        this.setAttribute('value',this.value as string);
    }

    /**
     * Getter for value
     * 
     * @return {string | number}
     */
    public get value(): (string | number | boolean) {

        return this._value;
    }

    /**
     * Set input value
     * 
     * @param {string|number} value
     */
    public setValue(value: string | number) {
        this.value = value;
    }

    /**
     * Get input value
     * 
     * @return {string | number | boolean}
     */
    public getValue(): string | number | boolean {

        return this.value;
    }

    public set required(required: boolean) {

        if (this.required !== required &&
            (required === undefined || required === null)) {
            required = false;
        }

        this._required = required;

        if (!(this._elInput instanceof HTMLElement)) {
          return;
        }

        if (this._required === true) {
          this._elInput.required = this._required;
          return;
        }
          
        this._elInput.removeAttribute('required');
        
    }

    public get required(): boolean {

        return this._required;
    }

    public set oncleanCallback(callback: HtmlCallback | {}) {
        if (callback === undefined || callback === null) {
            callback = {} as HtmlCallback;
        }

        this._oncleanCallback = callback;
    }

    public get oncleanCallback(): HtmlCallback | {} {
        return this._oncleanCallback;
    }

    public set onclean(callback: {}) {
        this.oncleanCallback = callback;
    }

    public get onclean(): {} {
        return this.oncleanCallback;
    }

    public set ondirtyCallback(callback: HtmlCallback | {}) {
        if (callback === undefined || callback === null) {
            callback = {};
        }

        this._ondirtyCallback = callback;
    }
    public get ondirtyCallback(): HtmlCallback | {} {
        return this._ondirtyCallback;
    }

    public set ondirty(callback: {}) {
        this.ondirtyCallback = callback;
    }
    public get ondirty(): {} {
        return this.ondirtyCallback;
    }

    /**
     * Clean the input
     * 
     * @return {void}
     */
    public setClean() {
        this._clean = true;
        this._dirty = false;
        this._submitted = false;
    }

    /**
     * Make input dirty, in generally when the input value is changed
     * 
     * @return {void}
     */
    public setDirty() {
        this._dirty = true;
        this._clean = false;
    }

    /**
     * Placeholder method. If needed can be overridden in child classes
     * 
     * @return {boolean}
     */
    public getValid(): boolean {
        return true;
    }

    public static get observedAttributes(){

        return [
            'required',
            'signalvaluesynctimeout',
            'feedbackmode',
            'onclean',
            'ondirty'
        ];

    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }
        super.attributeChangedCallback(attr, oldValue, newValue);

        switch (attr) {
            case 'required':
                this.required = newValue === 'false' ? false : true; 
                break;
            case 'signalvaluesynctimeout':
                if (this.hasAttribute('signalvaluesynctimeout')){
                    this.signalValueSyncTimeout = newValue;
                } else {
                    this.signalValueSyncTimeout = '';
                }
                break;
            case 'feedbackmode':
                if (this.hasAttribute('feedbackmode')){
                    this.feedbackMode = newValue as TCh5CommonInputFeedbackModes;
                } else {
                    this.feedbackMode = Ch5CommonInput.FEEDBACKMODES[0];
                }
                break;
            case 'onclean':
                this.onclean = new HtmlCallback(this, newValue);
                break;
            case 'ondirty':
                this.ondirty = new HtmlCallback(this, newValue);
                break;
        }
    }

    /**
     * Attributes Initialization
     * 
     * @protected
     * @memberof Ch5CommonInput
     * @return {void}
     */
    protected initAttributes() {
        super.initAttributes();

        if (this.hasAttribute('tabindex')) {
            this.tabIndex = Number(this.getAttribute('tabindex'));
        }


        if (this.hasAttribute('feedbackmode')) {
            this.feedbackMode = this.getAttribute('feedbackmode') as TCh5CommonInputFeedbackModes;
        } else {
            this.feedbackMode = Ch5CommonInput.FEEDBACKMODES[0];
        }

        if (this.hasAttribute('required')) {
            const required = this.getAttribute('required') === 'false' ? false : true;
            this.required = required;
        }

        if (this.hasAttribute('onclean')) {
            this.onclean = new HtmlCallback(this, this.getAttribute('onclean') as string);
        }

        if (this.hasAttribute('ondirty')) {
            this.ondirty = new HtmlCallback(this, this.getAttribute('ondirty') as string);
        }
    }

    /**
     * Add the related modifier if input is not valid
     * 
     * @protected
     * @memberof Ch5CommonInput
     * @return {void}
     */
    protected highlightInputIfNotValid(): void {

        if (!this.getValid()) {
            this.handleModifierClass('error');
        } else {
            this.handleModifierClass('error', 'remove')
        }
    }

    /**
     * Add modifier classes to the component and input elements
     * 
     * @param {string} className 
     * @param {string} action 
     * @protected
     * @memberof Ch5CommonInput
     * @return {void}
     */
    protected handleModifierClass(className: string, action: string = 'add'): void {

        const modifierClassName = this.primaryCssClass + '--' + className;

        if (action === 'add') {
            this.classList.add(modifierClassName);
            this._elInput.classList.add(modifierClassName);
        } else if (action === 'remove') {
            this.classList.remove(modifierClassName);
            this._elInput.classList.remove(modifierClassName);
        }
    }

    protected runEventHandlers(handler: string, event?: Event) {
        
        switch (handler) {
            case 'clean':
                this.runOncleanHandler(event);
                break;
            case 'dirty':
                this.runOndirtyHandler(event);
                break;
        }
    }

    private runOncleanHandler(event: Event | undefined) {
        if (this.onclean instanceof HtmlCallback) {
            this.onclean.run(event);
        } else if (this.onclean instanceof Function) {
            this.onclean.call(this, event);
        }

    }

    private runOndirtyHandler(event: Event | undefined) {
        if (this.ondirty instanceof HtmlCallback) {
            this.ondirty.run(event);
        } else if (this.ondirty instanceof Function) {
            this.ondirty.call(this, event);
        }
    }
}
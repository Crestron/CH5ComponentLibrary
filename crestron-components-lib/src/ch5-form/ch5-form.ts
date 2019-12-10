// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5CommonInput } from "../ch5-common-input/ch5-common-input";
import { Ch5Button } from "../ch5-button/ch5-button";
import { ICh5FormAttributes } from "../_interfaces/ch5-form";
import { TCh5ButtonType } from "../_interfaces/ch5-button/types";
import { isNil } from 'lodash';


export class Ch5Form extends Ch5Common implements ICh5FormAttributes {

    /**
     * COMPONENT DEFAULT VALUES
     */

    public static SUBMIT_LABEL: string = 'Submit';
    public static CANCEL_LABEL: string = 'Cancel';
    public static SUBMIT_TYPE: string = 'default';
    public static CANCEL_TYPE: string = 'warning';

    /**
     * CSS classes
     */
    public primaryCssClass = 'ch5-form';
    public cssClassPrefix = 'ch5-form';

    /**
     * COMPONENT ATTRIBUTES
     *
     * - hideSubmitButton
     * - submitButtonLabel
     * - submitButtonIcon
     * - submitButtonStyle
     * - submitButtonType
     * - hideCancelButton
     * - cancelButtonLabel
     * - cancelButtonIcon
     * - cancelButtonStyle
     * - cancelButtonType
     * - submitId
     * - cancelId
     */


    /**
     * Default false. If true hide the button.
     *
     * @private
     * @type {boolean}
     * @memberof Ch5Form
     */
    private _hideSubmitButton: boolean = false;

    /**
     * Submit button text. If absent or empty the default translated "Submit" text will show.
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _submitButtonLabel: string = '';

    /**
     * Submit button icon. If absent or empty, hide the icon
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _submitButtonIcon: string = '';

    /**
     * Inline style value for the submit button to override theme.
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _submitButtonStyle: string = '';

    /**
     * See Button Component Type attribute.
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _submitButtonType: TCh5ButtonType = 'default';

    /**
     * Default false. If true hide the button.
     *
     * @private
     * @type {boolean}
     * @memberof Ch5Form
     */
    private _hideCancelButton: boolean = false;

    /**
     * Cancel button text. If absent or empty the default translated "Cancel" text will show.
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _cancelButtonLabel: string = '';

    /**
     * Cancel button icon. If absent or empty, hide the icon
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _cancelButtonIcon: string = '';

    /**
     * Inline style value for the cancel button to override theme.
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _cancelButtonStyle: string = '';

    /**
     * See Button Component Type attribute.
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _cancelButtonType: TCh5ButtonType = 'default';

    /**
     * When hideSubmitButton='true', this field is the id of an element in which a 'click' event can be used to trigger the submit functionality.
     * This element should also honor the standard 'disabled' attribute to allow the form to disable the element if any of the inputs are in error
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _submitId: string = '';

    /**
     * When hideCancelButton='true', this field is the id of an element in which a 'click' event can be used to trigger the revert functionality
     *
     * @private
     * @type {string}
     * @memberof Ch5Form
     */
    private _cancelId: string = '';


    /**
     * COMPONENT INTERNAL ELEMENTS
     *
     * - inputElements
     * - submitButton
     * - cancelButton
     */

    /**
     * Used to store all ch5 elements with feedbackMode=submit
     *
     * @private
     * @type {Ch5CommonInput[]}
     */
    private _inputElements: Ch5CommonInput[] = [];

    /**
     * Used to store submit button
     *
     * @private
     * @type {Ch5Button}
     */
    private _submitButton: Ch5Button = {} as Ch5Button;

    /**
     * Used to store reset button
     *
     * @private
     * @type {Ch5Button}
     */
    private _cancelButton: Ch5Button = {} as Ch5Button;

    /**
     *  Reflect the state of submit button and submit method
     */
    private _submitShouldBeDisable: boolean = true;


    public ready: Promise<void>;

    /**
     * Getter inputElements
     * @return {Ch5CommonInput[] }
     */
    public get inputElements() {
        return this._inputElements;
    }

    /**
     * Getter submitButton
     * @return {Ch5Button }
     */
    public get submitButton(): Ch5Button {
        return this._submitButton;
    }

    /**
     * Setter submitButton
     * @param {Ch5Button } value
     */
    public set submitButton(value: Ch5Button) {
        this._submitButton = value;
    }


    /**
     * Getter cancelButton
     * @return {Ch5Button }
     */
    public get cancelButton(): Ch5Button {
        return this._cancelButton;
    }

    /**
     * Setter cancelButton
     * @param {Ch5Button } value
     */
    public set cancelButton(value: Ch5Button) {
        this._cancelButton = value;
    }


    /**
     * ATTR GETTERS AND SETTERS
     */


    /**
     * Getter hideSubmitButton
     * @return {boolean }
     */
    public get hideSubmitButton() {
        return this._hideSubmitButton;
    }

    /**
     * Setter hideSubmitButton
     * @param {boolean } value
     */
    public set hideSubmitButton(value: boolean | string) {
        this.info('Ch5Form set hideSubmitButton("' + value + '")');

        const isHidden = this._toBoolean(value);

        if (this._hideSubmitButton !== isHidden) {
            this._hideSubmitButton = isHidden;

            if (isHidden === true) {
                this.submitButton.setAttribute('hidden', '')
            } else {
                this.submitButton.removeAttribute('hidden');
            }
            this.setAttribute('hidesubmitbutton', isHidden.toString());
        }
    }

    public get hidesubmitbutton() {
        return this.hideSubmitButton;
    }

    public set hidesubmitbutton(value: boolean | string) {
        this.hideSubmitButton = value;
    }

    /**
     * Getter submitButtonLabel
     * @return {string }
     */
    public get submitButtonLabel(): string {
        return this._submitButtonLabel;
    }

    /**
     * Setter submitButtonLabel
     * @param {string } value
     */
    public set submitButtonLabel(value: string) {

        this.info('Ch5Form set submitButtonLabel("' + value + '")');

        if (value === undefined || value === null || value === '') {
            value = Ch5Form.SUBMIT_LABEL;
        }


        const trValue = this._getTranslatedValue('submitbuttonlabel', value);

        if (trValue !== this.submitButtonLabel) {
            this._submitButtonLabel = value;
            this.submitButton.setAttribute('label', trValue);
            this.setAttribute('submitbuttonlabel', trValue);
        }
    }

    /**
     * Getter submitButtonIcon
     * @return {string }
     */
    public get submitButtonIcon(): string {
        return this._submitButtonIcon;
    }

    /**
     * Setter submitButtonIcon
     * @param {string } value
     */
    public set submitButtonIcon(value: string) {
        this.info('Ch5Form set submitButtonIcon("' + value + '")');

        if (this._submitButtonIcon !== value) {
            if (value === undefined || value === null || value === '') {
                value = '';
            }

            const iconClass = `${value} ${this.cssClassPrefix}__submit__icon`;

            this._submitButtonIcon = value;
            this.setAttribute('submitbuttonicon', value);
            this.submitButton.setAttribute('iconClass', iconClass);
        }
    }

    /**
     * Getter submitButtonStyle
     * @return {string }
     */
    public get submitButtonStyle(): string {
        return this._submitButtonStyle;
    }

    /**
     * Setter submitButtonStyle
     * @param {string } value
     */
    public set submitButtonStyle(value: string) {
        this.info('Ch5Form set submitButtonStyle("' + value + '")');

        if (this._submitButtonStyle !== value) {
            if (value === undefined || value === null || value === '') {
                value = '';
            }

            this._submitButtonStyle = value;
            this.setAttribute('submitbuttonstyle', value);
            this.submitButton.setAttribute('customStyle', value);
        }
    }

    /**
     * Getter submitButtonType
     * @return {string }
     */
    public get submitButtonType(): TCh5ButtonType {
        return this._submitButtonType;
    }

    /**
     * Setter submitButtonType
     * @param {string } value
     */
    public set submitButtonType(value: TCh5ButtonType) {
        this.info('Ch5Form set submitButtonType("' + value + '")');

        if (this._submitButtonType !== value) {
            if (isNil(value)) {
                value = 'default';
            }

            this._submitButtonType = value;
            this.setAttribute('submitbuttontype', value);
            this.submitButton.setAttribute('type', value);
        }
    }

    /**
     * Getter hideCancelButton
     * @return {boolean }
     */
    public get hideCancelButton() {
        return this._hideCancelButton;
    }

    /**
     * Setter hideCancelButton
     * @param {boolean } value
     */
    public set hideCancelButton(value: boolean | string) {
        this.info('Ch5Form set hideCancelButton("' + value + '")');

        const isHidden = this._toBoolean(value);

        if (this._hideCancelButton !== isHidden) {
            this._hideCancelButton = isHidden;

            if (isHidden === true) {
                this.cancelButton.setAttribute('hidden', '');
            } else {
                this.cancelButton.removeAttribute('hidden');
            }

            this.setAttribute('hidecancelbutton', isHidden.toString());
        }
    }

    /**
     * Getter cancelButtonLabel
     * @return {string }
     */
    public get cancelButtonLabel(): string {
        return this._cancelButtonLabel;
    }

    /**
     * Setter cancelButtonLabel
     * @param {string } value
     */
    public set cancelButtonLabel(value: string) {
        this.info('Ch5Form set cancelButtonLabel("' + value + '")');

        if (value === undefined || value === null || value === '') {
            value = Ch5Form.CANCEL_LABEL;
        }

        const trValue = this._getTranslatedValue('cancelButtonLabel', value);

        if (trValue !== this.cancelButtonLabel) {
            this._cancelButtonLabel = trValue;
            this.cancelButton.setAttribute('label', trValue);
            this.setAttribute('cancelbuttonlabel', trValue);
        }
    }

    /**
     * Getter cancelButtonIcon
     * @return {string }
     */
    public get cancelButtonIcon(): string {
        return this._cancelButtonIcon;
    }

    /**
     * Setter cancelButtonIcon
     * @param {string } value
     */
    public set cancelButtonIcon(value: string) {
        this.info('Ch5Form set cancelButtonIcon("' + value + '")');

        if (this._cancelButtonIcon !== value) {
            if (value === undefined || value === null || value === '') {
                value = '';
            }

            const iconClass = `${value} ${this.cssClassPrefix}__cancel__icon`;

            this._cancelButtonIcon = value;
            this.setAttribute('cancelbuttonicon', value);
            this.cancelButton.setAttribute('iconclass', iconClass);
        }
    }

    /**
     * Getter cancelButtonStyle
     * @return {string }
     */
    public get cancelButtonStyle(): string {
        return this._cancelButtonStyle;
    }

    /**
     * Setter cancelButtonStyle
     * @param {string } value
     */
    public set cancelButtonStyle(value: string) {
        this.info('Ch5Form set cancelButtonStyle("' + value + '")');

        if (this._cancelButtonStyle !== value) {
            if (value === undefined || value === null || value === '') {
                value = '';
            }

            this._cancelButtonStyle = value;
            this.setAttribute('cancelbuttonstyle', value);
            this.cancelButton.setAttribute('customstyle', value);
        }
    }

    /**
     * Getter cancelButtonType
     * @return {string }
     */
    public get cancelButtonType(): TCh5ButtonType {
        return this._cancelButtonType;
    }

    /**
     * Setter cancelButtonType
     * @param {string } value
     */
    public set cancelButtonType(value: TCh5ButtonType) {
        this.info('Ch5Form set cancelButtonType("' + value + '")');

        if (this._cancelButtonType !== value) {
            if (isNil(value)) {
                value = 'default';
            }

            this._cancelButtonType = value;
            this.setAttribute('cancelbuttontype', value);
            this.cancelButton.setAttribute('type', value);
        }
    }

    /**
     * Getter submitId
     * @return {string }
     */
    public get submitId(): string {
        return this._submitId;
    }

    /**
     * Setter submitId
     * @param {string } value
     */
    public set submitId(value: string) {
        this.info('Ch5Form set submitId("' + value + '")');

        if (this._submitId !== value) {
            if (value === undefined || value === null || value === '') {
                value = '';
            }

            this._submitId = value;
            this.setAttribute('submitid', value);
            this.submitButton.setAttribute('id', value);
        }
    }

    /**
     * Getter cancelId
     * @return {string }
     */
    public get cancelId(): string {
        return this._cancelId;
    }

    /**
     * Setter cancelId
     * @param {string } value
     */
    public set cancelId(value: string) {
        this.info('Ch5Form set cancelId("' + value + '")');

        if (this._cancelId !== value) {
            if (value === undefined || value === null || value === '') {
                value = '';
            }

            this._cancelId = value;
            this.setAttribute('cancelid', value);
            this.cancelButton.setAttribute('id', value);
        }
    }

    constructor() {
        super(); // always call super() first in the constructor.

        this._onClickSubmitButton = this._onClickSubmitButton.bind(this);
        this._onClickCancelButton = this._onClickCancelButton.bind(this);
        this._checkSubmitShouldBeDisabled = this._checkSubmitShouldBeDisabled.bind(this);

        // used to create form buttons
        this._initFormButtons();

        // set ready property as promise
        this.ready = Promise.all([
            customElements.whenDefined('ch5-button'),
            customElements.whenDefined('ch5-toggle'),
            customElements.whenDefined('ch5-slider'),
            customElements.whenDefined('ch5-select'),
            customElements.whenDefined('ch5-list'),
            customElements.whenDefined('ch5-textinput'),
            customElements.whenDefined('ch5-spinner')
        ])
            .then(_ => {
                this._linkInputElements();
                this._linkFormButtons();

                this._wasInstatiated = true;
            });
    }

    /**
     *  Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'form');
        }

        this.ready.then(() => {
            this.cacheComponentChildrens();
            this.initAttributes();
            this.appendChild(this.submitButton);
            this.appendChild(this.cancelButton);

            this.attachEventListeners();
            this.initCommonMutationObserver(this);
        });
    }

    /**
     * Called every time the element is removed from the DOM.
     * Useful for running clean up code.
     */
    public disconnectedCallback() {
        this.removeEventListeners();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    /**
     * Respond to attribute changes.
     * @readonly
     */
    static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;
        const ch5FormAttributes: string[] = [
            'hidesubmitbutton',
            'submitbuttonlabel',
            'submitbuttonicon',
            'submitbuttonstyle',
            'submitbuttontype',
            'hidecancelbutton',
            'cancelbuttonlabel',
            'cancelbuttonicon',
            'cancelbuttonstyle',
            'cancelbuttontype',
            'submitid',
            'cancelid'
        ];

        return commonAttributes.concat(ch5FormAttributes);
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-form attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

        switch (attr) {
            case 'hidesubmitbutton':
                if (this.hasAttribute('hideSubmitButton')) {
                    this.hideSubmitButton = newValue;
                } else {
                    this.hideSubmitButton = false;
                }
                break;
            case 'submitbuttonlabel':
                if (this.hasAttribute('submitbuttonlabel')) {
                    this.submitButtonLabel = newValue;
                } else {
                    this.submitButtonLabel = '';
                }
                break;
            case 'submitbuttonicon':
                if (this.hasAttribute('submitbuttonicon')) {
                    this.submitButtonIcon = newValue;
                } else {
                    this.submitButtonIcon = '';
                }
                break;
            case 'submitbuttonstyle':
                if (this.hasAttribute('submitbuttonstyle')) {
                    this.submitButtonStyle = newValue;
                } else {
                    this.submitButtonStyle = '';
                }
                break;
            case 'submitbuttontype':
                if (this.hasAttribute('submitbuttontype')) {
                    this.submitButtonType = newValue as TCh5ButtonType;
                } else {
                    this.submitButtonType = 'default';
                }
                break;
            case 'hidecancelbutton':
                if (this.hasAttribute('hidecancelbutton')) {
                    this.hideCancelButton = newValue;
                } else {
                    this.hideCancelButton = false;
                }
                break;
            case 'cancelbuttonlabel':
                if (this.hasAttribute('cancelbuttonlabel')) {
                    this.cancelButtonLabel = newValue;
                } else {
                    this.cancelButtonLabel = '';
                }
                break;
            case 'cancelbuttonicon':
                if (this.hasAttribute('cancelbuttonicon')) {
                    this.cancelButtonIcon = newValue;
                } else {
                    this.cancelButtonIcon = '';
                }
                break;
            case 'cancelbuttonstyle':
                if (this.hasAttribute('cancelbuttonstyle')) {
                    this.cancelButtonStyle = newValue;
                } else {
                    this.cancelButtonStyle = '';
                }
                break;
            case 'cancelbuttontype':
                if (this.hasAttribute('cancelbuttontype')) {
                    this.cancelButtonType = newValue as TCh5ButtonType;
                } else {
                    this.cancelButtonType = 'default';
                }
                break;
            case 'submitid':
                if (this.hasAttribute('submitid')) {
                    this.submitId = newValue;
                } else {
                    this.submitId = '';
                }
                break;
            case 'cancelid':
                if (this.hasAttribute('cancelid')) {
                    this.cancelId = newValue;
                } else {
                    this.cancelId = '';
                }
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    /**
     * Called to initialize all attributes
     * @protected
     */
    protected initAttributes(): void {
        super.initAttributes();

        this._upgradeProperty('hideSubmitButton');
        this._upgradeProperty('submitButtonLabel');
        this._upgradeProperty('submitButtonIcon');
        this._upgradeProperty('submitButtonStyle');
        this._upgradeProperty('submitButtonType');
        this._upgradeProperty('hideCancelButton');
        this._upgradeProperty('cancelButtonLabel');
        this._upgradeProperty('cancelButtonIcon');
        this._upgradeProperty('cancelButtonStyle');
        this._upgradeProperty('cancelButtonType');
        this._upgradeProperty('submitId');
        this._upgradeProperty('cancelId');
    }

    /**
     * Called to bind proper listeners
     * @protected
     */
    protected attachEventListeners() {
        super.attachEventListeners();

        this.submitButton.addEventListener('click', this._onClickSubmitButton);
        this.cancelButton.addEventListener('click', this._onClickCancelButton);

        this._inputElements.forEach(element => {
            element.addEventListener('dirty', this._checkSubmitShouldBeDisabled);
            element.addEventListener('validitychange', this._checkSubmitShouldBeDisabled);
            element.addEventListener('clean', this._checkSubmitShouldBeDisabled);
        });
    }

    /**
     * Removes listeners
     * @protected
     */
    protected removeEvents() {
        super.removeEventListeners();

        this.submitButton.removeEventListener('click', this._onClickSubmitButton);
        this.cancelButton.removeEventListener('click', this._onClickCancelButton);

        this._inputElements.forEach(element => {
            element.removeEventListener('dirty', this._checkSubmitShouldBeDisabled);
            element.removeEventListener('validitychange', this._checkSubmitShouldBeDisabled);
            element.removeEventListener('clean', this._checkSubmitShouldBeDisabled);
        });
    }

    /**
     * COMPONENT METHODS
     *
     * - submit
     * - cancel
     */

    public submit() {
        if (!this._submitShouldBeDisable) {
            this._inputElements.forEach(element => {
                element.submit();
            });
        }
    }

    public cancel() {
        // disable submit button on reset
        this.submitButton.setAttribute('disabled', 'true');

        this._inputElements.forEach(element => {
            element.reset();
        });
    }

    /**
     * Link form input elements
     *
     * @private
     * @memberof Ch5Form
     */
    private _linkInputElements() {
        this._inputElements = Array.from(this.querySelectorAll("[feedbackmode='submit']")) as Ch5CommonInput[];
    }

    /**
     * Get input elements
     *
     * @private
     * @returns
     */
    private _getInputElements() {
        return this._inputElements;
    }

    /**
     *  Initialize form buttons
     */
    private _initFormButtons() {
        this.submitButton = this._createButton(Ch5Form.SUBMIT_LABEL, Ch5Form.SUBMIT_TYPE, 'submit', true);
        this.cancelButton = this._createButton(Ch5Form.CANCEL_LABEL, Ch5Form.CANCEL_TYPE, 'cancel');
    }

    /**
     * Link form submit and cancel buttons
     *
     * @private
     */
    private _linkFormButtons() {
        const submit = this.querySelector("[formtype='submit']") as Ch5Button;
        const cancel = this.querySelector("[formtype='cancel']") as Ch5Button;

        // if there is submit button replace the internal button
        if (null !== submit) {
            submit.setAttribute('disabled', 'true');
            this.submitButton = submit;
        }

        // if there is cancel button replace the internal button
        if (null !== cancel) {
            this.cancelButton = cancel;
        }
    }

    /**
     * Disable or enable submit button based on dirty and valid state of inputs
     *
     * @private
     * @returns
     */
    private _checkSubmitShouldBeDisabled() {
        // if an element is dirty then enable the submit
        this._inputElements.forEach((element) => {
            if (element.getDirty() === true) {
                this._submitShouldBeDisable = false;
                // stop foreach execution since is enough for just element to be dirty in order to enable buttons
                return;
            }
        });

        // if all elements are clean then disable submit
        this._submitShouldBeDisable = this._inputElements.every((elem) => elem.getDirty() === false);

        // if an element is invalid then disable the submit
        this._inputElements.forEach(element => {
            if (typeof element.getValid !== 'undefined' && element.getValid() === false) {
                this._submitShouldBeDisable = true;
                // stop foreach execution since is enough for just element to be invalid in order to disable buttons
                return;
            }
        });

        if (this._submitShouldBeDisable) {
            this.submitButton.setAttribute('disabled', 'true');
            this.submitButton.classList.add(this.cssClassPrefix + '__submit--disabled');
            return;
        }

        this.submitButton.removeAttribute('disabled');
        this.submitButton.classList.remove(this.cssClassPrefix + '__submit--disabled');
    }

    /**
     * Factory method for Ch5Button
     *
     * @param label
     * @param type
     * @param formType
     * @param disabled
     */
    private _createButton(label: string, type: string, formType: string, disable: boolean = false): Ch5Button {
        const button = new Ch5Button();

        button.setAttribute('label', label);
        button.setAttribute('type', type);
        button.setAttribute('formType', formType);
        button.classList.add(this.cssClassPrefix + '__' + formType)


        if (disable) {
            button.setAttribute('disabled', 'true');
            button.classList.add(this.cssClassPrefix + '__' + formType + '--disabled');
        }

        return button;
    }


    /**
     * COMPONENT EVENTS HANDLERS
     */


    /**
     * Call submit method on all input elements
     *
     * @private
     * @memberof Ch5Form
     */
    private _onClickSubmitButton() {
        this.submit();
    }

    /**
     * Call reset method on all input elements
     *
     * @private
     * @memberof Ch5Form
     */
    private _onClickCancelButton() {
        this.cancel();
    }

    /**
     * Upgrade the property on this element with the given name.
     *
     * @private
     * @param {string} prop
     *   The name of a property.
     */
    private _upgradeProperty(prop: string) {
        if (this.constructor.prototype.hasOwnProperty(prop)) {
            const val = (this as any)[prop];
            delete (this as any)[prop];
            (this as any)[prop] = val;
        }
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-form', Ch5Form);
}

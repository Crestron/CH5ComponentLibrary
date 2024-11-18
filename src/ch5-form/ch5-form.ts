// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5CommonInput } from "../ch5-common-input/ch5-common-input";
import { Ch5Button } from "../ch5-button/ch5-button";
import { TCh5ButtonType } from "../ch5-button/interfaces/t-ch5-button";
import { isEmpty, isNil } from 'lodash';
import { ICh5FormAttributes } from "./interfaces/i-ch5-form-attributes";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalElementAttributeRegistryEntries, Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5Form extends Ch5Common implements ICh5FormAttributes {

	public static readonly ELEMENT_NAME = 'ch5-form';
	public static SUBMIT_LABEL: string = 'Submit';
	public static CANCEL_LABEL: string = 'Cancel';
	public static SUBMIT_TYPE: string = 'default';
	public static CANCEL_TYPE: string = 'warning';
	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES
	};
	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: false,
			name: "hideCancelButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		},
		{
			default: false,
			name: "hideSubmitButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		}
	];
	private _ch5Properties: Ch5Properties;

	public set hideCancelButton(value: boolean) {
		this._ch5Properties.set<boolean>("hideCancelButton", value, () => {
			this.hideCancelButton ? this.cancelButton.setAttribute('hidden', '') : this.cancelButton.removeAttribute('hidden')
		});
	}
	public get hideCancelButton(): boolean {
		return this._ch5Properties.get<boolean>("hideCancelButton");
	}

	public set hideSubmitButton(value: boolean) {
		this._ch5Properties.set<boolean>("hideSubmitButton", value, () => {
			this.hideSubmitButton ? this.submitButton.setAttribute('hidden', '') : this.submitButton.removeAttribute('hidden')
		});
	}
	public get hideSubmitButton(): boolean {
		return this._ch5Properties.get<boolean>("hideSubmitButton");
	}

	public get inputElements() {
		return this._inputElements;
	}

	public get submitButton(): Ch5Button {
		return this._submitButton;
	}
	public set submitButton(value: Ch5Button) {
		this._submitButton = value;
	}

	public get cancelButton(): Ch5Button {
		return this._cancelButton;
	}
	public set cancelButton(value: Ch5Button) {
		this._cancelButton = value;
	}

	public get submitButtonLabel(): string {
		return this._submitButtonLabel;
	}
	public set submitButtonLabel(value: string) {
		this.info('Ch5Form set submitButtonLabel("' + value + '")');

		if (Ch5Common.isNil(value)) {
			value = Ch5Form.SUBMIT_LABEL;
		}

		const trValue = this._getTranslatedValue('submitbuttonlabel', value);

		if (trValue !== this.submitButtonLabel) {
			this._submitButtonLabel = value;
			this.submitButton.setAttribute('label', trValue);
			this.setAttribute('submitbuttonlabel', trValue);
		}
	}

	public get submitButtonIcon(): string {
		return this._submitButtonIcon;
	}
	public set submitButtonIcon(value: string) {
		this.info('Ch5Form set submitButtonIcon("' + value + '")');

		if (this._submitButtonIcon !== value) {
			if (Ch5Common.isNil(value)) {
				value = '';
			}

			const iconClass = `${value} ${this.primaryCssClass}__submit__icon`;

			this._submitButtonIcon = value;
			this.setAttribute('submitbuttonicon', value);
			this.submitButton.setAttribute('iconClass', iconClass);
		}
	}

	public get submitButtonStyle(): string {
		return this._submitButtonStyle;
	}
	public set submitButtonStyle(value: string) {
		this.info('Ch5Form set submitButtonStyle("' + value + '")');

		if (this._submitButtonStyle !== value) {
			if (Ch5Common.isNil(value)) {
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
			if (Ch5Common.isNil(value)) {
				value = 'default';
			}

			this._submitButtonType = value;
			this.setAttribute('submitbuttontype', value);
			this.submitButton.setAttribute('type', value);
		}
	}

	public get cancelButtonLabel(): string {
		return this._cancelButtonLabel;
	}
	public set cancelButtonLabel(value: string) {
		this.info('Ch5Form set cancelButtonLabel("' + value + '")');

		if (Ch5Common.isNil(value)) {
			value = Ch5Form.CANCEL_LABEL;
		}

		const trValue = this._getTranslatedValue('cancelButtonLabel', value);

		if (trValue !== this.cancelButtonLabel) {
			this._cancelButtonLabel = trValue;
			this.cancelButton.setAttribute('label', trValue);
			this.setAttribute('cancelbuttonlabel', trValue);
		}
	}

	public get cancelButtonIcon(): string {
		return this._cancelButtonIcon;
	}
	public set cancelButtonIcon(value: string) {
		this.info('Ch5Form set cancelButtonIcon("' + value + '")');

		if (this._cancelButtonIcon !== value) {
			if (Ch5Common.isNil(value)) {
				value = '';
			}

			const iconClass = `${value} ${this.primaryCssClass}__cancel__icon`;

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

		if (this._submitId !== value && !isNil(value)) {
			this._submitId = value;
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

		if (this._cancelId !== value && !isNil(value)) {
			this._cancelId = value;
		}
	}

	constructor() {
		super(); // always call super() first in the constructor.

		this._onClickSubmitButton = this._onClickSubmitButton.bind(this);
		this._onClickCancelButton = this._onClickCancelButton.bind(this);
		this._checkIfCancelOrSubmitShouldBeDisabled = this._checkIfCancelOrSubmitShouldBeDisabled.bind(this);
		this._ch5Properties = new Ch5Properties(this, Ch5Form.COMPONENT_PROPERTIES);

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
		]).then(() => {
			this._linkInputElements();
			this._linkFormButtons();
			this._wasInstatiated = true;
		});
	}

	/**
	 * Respond to attribute changes.
	 * @readonly
	 */
	static get observedAttributes() {
		const commonAttributes = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Form.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Form.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Form.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		const ch5FormAttributes: string[] = [
			'submitbuttonlabel',
			'submitbuttonicon',
			'submitbuttonstyle',
			'submitbuttontype',
			'cancelbuttonlabel',
			'cancelbuttonicon',
			'cancelbuttonstyle',
			'cancelbuttontype',
			'submitid',
			'cancelid'
		];

		return commonAttributes.concat(ch5FormAttributes.concat(newObsAttrs));
	}



	/**
	 * COMPONENT DEFAULT VALUES
	 */



	/**
	 * CSS classes
	 */
	public primaryCssClass = 'ch5-form';

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

	/**
	 *  Reflect the state of cancel button and submit method
	 */
	private _cancelShouldBeDisabled: boolean = true;

	/**
	 * Custom cancel button ref, if cancelId attr was supplied, used to add and remove events
	 */
	private _customCancelButtonRef: HTMLButtonElement | null = null;

	/**
	 * Custom submit button ref, if cancelId attr was supplied, used to add and remove events
	 */
	private _customSubmitButtonRef: HTMLButtonElement | null = null;

	public ready: Promise<void>;

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Form.ELEMENT_NAME, Ch5Form.SIGNAL_ATTRIBUTE_TYPES);
	}

	/**
	 * Find and set custom cancel btn, keep as reference to handle events
	 */
	private setCustomCancelBtn(): void {
		if (isNil(this.cancelId) || isEmpty(this.cancelId)) {
			// user did not set a custom cancel btn, safe to exit
			return;
		}
		this.info(`Ch5Form setCustomCancelBtn with id :${this.cancelId} ready`);
		this._customCancelButtonRef = document.getElementById(this.cancelId) as HTMLButtonElement;

		if (isNil(this._customCancelButtonRef)) {
			this.info(`Ch5Form Cannot find cancel button with id :${this.cancelId}`);
			return;
		}
		this._customCancelButtonRef.removeEventListener('click', this._onClickCancelButton);
		this._customCancelButtonRef.addEventListener('click', this._onClickCancelButton);
		this.info(`Ch5Form canel button with ${this.cancelId} found, events added`);
	}

	/**
	 * Find and set custom submit btn, keep as reference to handle events
	 */
	private setCustomSubmitBtn(): void {
		if (isNil(this.submitId) || isEmpty(this.submitId)) {
			// user did not set a custom submit btn, safe to exit
			return;
		}
		this.info(`Ch5Form setCustomSubmitBtn with id :${this.submitId} ready`);
		this._customSubmitButtonRef = document.getElementById(this.submitId) as HTMLButtonElement;
		if (isNil(this._customSubmitButtonRef)) {
			this.info(`Ch5Form cannot find submit button with id :${this.submitId}`);
			return;
		}
		this._customSubmitButtonRef.addEventListener('click', this._onClickSubmitButton);
		this.info(`Ch5Form submit button with ${this.submitId} found, events added`);
	}

	/**
	 *  Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Form);
		}

		this.ready.then(() => {
			this.cacheComponentChildrens();
			this.initAttributes();
			this.appendChild(this.submitButton);
			this.appendChild(this.cancelButton);

			this.attachEventListeners();
			this.initCommonMutationObserver(this);
			// set custom cancel/submit buttons if available, disable the custom submit button initially
			this.setCustomCancelBtn();
			this.setCustomSubmitBtn();
			this.checkIfCustomSubmitShouldBeDisabled(true);
			this.checkIfCustomCancelShouldBeDisabled(true);
		});
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.removeEvents();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}

	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		this.info('Ch5Form attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

		const attributeChangedProperty = Ch5Form.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => {
			return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true;
		});
		if (attributeChangedProperty) {
			const thisRef: any = this;
			const key = attributeChangedProperty.name;
			thisRef[key] = newValue;
		} else {
			switch (attr) {
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
	}

	/**
	 * Called to initialize all attributes
	 * @protected
	 */
	protected initAttributes(): void {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5Form.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Form.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Form.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Form.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		this._upgradeProperty('submitButtonLabel');
		this._upgradeProperty('submitButtonIcon');
		this._upgradeProperty('submitButtonStyle');
		this._upgradeProperty('submitButtonType');
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
			element.addEventListener('dirty', this._checkIfCancelOrSubmitShouldBeDisabled);
			element.addEventListener('validitychange', this._checkIfCancelOrSubmitShouldBeDisabled);
			element.addEventListener('clean', this._checkIfCancelOrSubmitShouldBeDisabled);
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
			element.removeEventListener('dirty', this._checkIfCancelOrSubmitShouldBeDisabled);
			element.removeEventListener('validitychange', this._checkIfCancelOrSubmitShouldBeDisabled);
			element.removeEventListener('clean', this._checkIfCancelOrSubmitShouldBeDisabled);
		});

		if (!isNil(this._customSubmitButtonRef)) {
			this._customSubmitButtonRef.removeEventListener('click', this._onClickSubmitButton);
		}
		if (!isNil(this._customCancelButtonRef)) {
			this._customCancelButtonRef.removeEventListener('click', this._onClickSubmitButton);
		}
	}

	protected updateSwipeGesture() {
		if (this.submitButton) {
			this.submitButton.swipeGestureEnabled = this.swipeGestureEnabled;
		}
		if (this.cancelButton) {
			this.cancelButton.swipeGestureEnabled = this.swipeGestureEnabled;
		}
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
		// the buttons are disabled by default
		this.submitButton = this._createButton(Ch5Form.SUBMIT_LABEL, Ch5Form.SUBMIT_TYPE, 'submit', true);
		this.cancelButton = this._createButton(Ch5Form.CANCEL_LABEL, Ch5Form.CANCEL_TYPE, 'cancel', true);
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
	private _checkIfCancelOrSubmitShouldBeDisabled() {
		// check cancel button status, without interfering
		// check if elements are clean
		const elementsAreClean = this._inputElements.every((elem) => elem.getDirty() === false);
		this._cancelShouldBeDisabled = elementsAreClean;

		// disable cancel buttons
		if (this._cancelShouldBeDisabled) {
			this.cancelButton.setAttribute('disabled', 'true');
			this.cancelButton.classList.add(this.primaryCssClass + '__submit--disabled');
		} else {
			this.cancelButton.removeAttribute('disabled');
			this.cancelButton.classList.remove(this.primaryCssClass + '__submit--disabled');
		}
		this.checkIfCustomCancelShouldBeDisabled(this._cancelShouldBeDisabled);

		// if an element is dirty then enable the submit
		this._inputElements.forEach((element) => {
			if (element.getDirty() === true) {
				this._submitShouldBeDisable = false;
				this.checkIfCustomSubmitShouldBeDisabled(this._submitShouldBeDisable);
				// stop foreach execution since is enough for just element to be dirty in order to enable buttons
				return;
			}
		});

		// if all elements are clean then disable submit
		this._submitShouldBeDisable = elementsAreClean;
		if (this._submitShouldBeDisable) {
			this.checkIfCustomSubmitShouldBeDisabled(this._submitShouldBeDisable);
		}

		// if an element is invalid then disable the submit
		this._inputElements.forEach(element => {
			if (typeof element.getValid !== 'undefined' && element.getValid() === false) {
				this._submitShouldBeDisable = true;
				this.checkIfCustomSubmitShouldBeDisabled(this._submitShouldBeDisable);
				// stop foreach execution since is enough for just element to be invalid in order to disable buttons
				return;
			}
		});

		if (this._submitShouldBeDisable) {
			this.submitButton.setAttribute('disabled', 'true');
			this.submitButton.classList.add(this.primaryCssClass + '__submit--disabled');
			return;
		}

		this.submitButton.removeAttribute('disabled');
		this.submitButton.classList.remove(this.primaryCssClass + '__submit--disabled');
	}

	private checkIfCustomSubmitShouldBeDisabled(disable: boolean) {
		if (!isNil(this._customSubmitButtonRef)) {
			// use the same class / css a ch5-button (default submit button) would use
			disable ? this._customSubmitButtonRef.classList.add('ch5-button--disabled') : this._customSubmitButtonRef.classList.remove('ch5-button--disabled');
		}
	}

	private checkIfCustomCancelShouldBeDisabled(disable: boolean) {
		if (!isNil(this._customCancelButtonRef)) {
			// use the same class / css a ch5-button (default submit button) would use
			disable ? this._customCancelButtonRef.classList.add('ch5-button--disabled') : this._customCancelButtonRef.classList.remove('ch5-button--disabled');
		}
	}

	/**
	 * Factory method for Ch5Button
	 *
	 * @param label
	 * @param type
	 * @param formType
	 * @param disable
	 */
	private _createButton(label: string, type: string, formType: string, disable: boolean = false): Ch5Button {
		const button = new Ch5Button();

		button.setAttribute('label', label);
		button.setAttribute('type', type);
		button.setAttribute('formType', formType);
		button.classList.add(this.primaryCssClass + '__' + formType)


		if (disable) {
			button.setAttribute('disabled', 'true');
			button.classList.add(this.primaryCssClass + '__' + formType + '--disabled');
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
	window.customElements.define(Ch5Form.ELEMENT_NAME, Ch5Form);
}

Ch5Form.registerSignalAttributeTypes();

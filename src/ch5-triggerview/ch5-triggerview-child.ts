// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5TriggerView } from "./ch5-triggerview";
import _ from "lodash";
import { TCh5ShowType } from "../ch5-common/interfaces";
import { ICh5TriggerViewChildAttributes } from "./interfaces/i-ch5-triggerview-child-attributes";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";

const _parentTriggerViewNodeName = 'CH5-TRIGGERVIEW';

export class Ch5TriggerViewChild extends Ch5Common implements ICh5TriggerViewChildAttributes {

	//#region " Attributes "
	get selected() {
		this.info('Ch5TriggerViewChild get selected()');
		return this.hasAttribute('selected');
	}

	set selected(value) {
		this.info('Ch5TriggerViewChild set selected()');

		value = Boolean(value);
		if (value) {
			this.setAttribute('selected', '');
			this.setAttribute('aria-selected', 'true');
		}
		else {
			this.removeAttribute('selected');
			this.setAttribute('aria-selected', 'false');
		}
	}


	/**
	 * SEND SIGNALS GETTERS AND SETTERS
	 */

	/**
	 * Getter sendEventOnShow
	 */
	public get sendEventOnShow(): string {
		return this._sendEventOnShowSigName;
	}

	/**
	 * Setter sendEventOnShow
	 */
	public set sendEventOnShow(value: string) {
		this.info('set sendEventOnShow(\'' + value + '\')');

		if ('' === value) {
			return;
		}

		if (this._sendEventOnShowSigName !== value) {
			this._sendEventOnShowSigName = value;
			this.setAttribute('sendeventonshow', value);
		}
	}

	/**
	 * RECEIVED SIGNALS GETTERS AND SETTERS
	 */

	/**
	 * Getter receiveStateShow
	 */
	public get receiveStateShow(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestateshow');
	}

	/**
	 * Setter receiveStateShow
	 */
	public set receiveStateShow(value: string) {
		this.info('set receiveStateShow(\'' + value + '\')');

		if ('' === value
			|| this._receiveStateShowSigName === value
			|| null === value
			|| undefined === value) {
			return;
		}

		// clean up old subscription
		if (this._receiveStateShowSigName !== ''
			&& this._receiveStateShowSigName !== undefined
			&& this._receiveStateShowSigName !== null) {

			const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowSigName);
			const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldSignalName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this._subReceiveSignalShowId);
			}
		}

		// setup new subscription.
		this._receiveStateShowSigName = value;
		this.setAttribute('receivestateshow', value);

		const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowSigName);
		const receiveState: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(receiveStateName);

		if (receiveState === null) {
			return;
		}

		let hasSignalChanged = false;
		this._subReceiveSignalShowId = receiveState.subscribe((newValue: boolean) => {
			if (newValue && newValue === true && receiveState.hasChangedSinceInit()) {
				const parentElement = this.getTriggerViewParent();
				if (parentElement !== null) {
					parentElement.setActiveViewChild(this);
					hasSignalChanged = true;
				}
			}

			if (newValue !== this.show && hasSignalChanged) {
				this.setAttribute('show', '' + newValue);
			}
		});
	}

	// ignore functionality from common sense in this case is not needed
	public set sigNameReceiveShow(value: string) {
		return;
	}

	//#endregion

	////// COMPONENT START ///////

	constructor() {
		super();
		this.info('Ch5TriggerViewChild.constructor()');
		this._listOfAllPossibleComponentCssClasses = this._generateListOfAllPossibleComponentCssClasses();
	}

	/**
	 * Respond to attribute changes.
	 * @readonly
	 */
	static get observedAttributes() {
		const commonAttributes = Ch5Common.observedAttributes;

		const ch5TriggerViewChildAttributes: string[] = [
			'selected',

			// SEND SIGNALS
			'sendeventonshow',

			// RECEIVE SIGNALS
			'receivestateshow'
		];

		return commonAttributes.concat(ch5TriggerViewChildAttributes);
	}

	public static readonly ELEMENT_NAME = 'ch5-triggerview-child';

	/**
	 * TriggerView child accepts only 'visibility' for noshowtype
	 */
	public static SHOW_TYPES: TCh5ShowType[] = ['visibility'];

	/**
	 * CSS classes
	 */
	public primaryCssClass = 'ch5-viewchild';
	public cssClassPrefix = 'ch5-viewchild';

	/**
	 * Set this._noshowType with only value accepted
	 */
	protected _noshowType = Ch5TriggerViewChild.SHOW_TYPES[0];

	/**
	 * COMPONENT SEND SIGNALS
	 *
	 * - sendEventOnShow
	 */

	/**
	 * The name of the digital pulse signal that will be sent to native of current visible item on select
	 *
	 * HTML attribute name: sendEventOnShow or sendeventonshow
	 * @private
	 * @type {string}
	 */
	private _sendEventOnShowSigName: string = '';


	/**
	 * COMPONENT RECEIVE SIGNALS
	 *
	 * - receiveStateShow
	 */

	/**
	 * The name of a boolean signal
	 * In case the value of this is true, it will tell the parent component ( trigger view)
	 * to hide all the other childview and show this one.
	 * 
	 * HTML attribute name: receiveStateShow or receivestateshow
	 */
	private _receiveStateShowSigName: string = '';

	/**
	 * The subscription id for the receiveStateShow signal
	 */
	private _subReceiveSignalShowId: string = '';

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5TriggerViewChild.ELEMENT_NAME, Ch5TriggerViewChild.SIGNAL_ATTRIBUTE_TYPES);
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.info('Ch5TriggerViewChild.connectedCallback()');
		this.cacheComponentChildrens();

		// TODO: temporarily disabled because in Ch5TriggerView was added a wrapper div
		// if (!(this.parentElement instanceof Ch5TriggerView)) {
		//     throw new Error(`Invalid parent element for ch5-triggerview-child. Required ch5-triggerview as parent`);
		// }

		// set noshowtype attribute
		this.setAttribute('noshowtype', Ch5TriggerViewChild.SHOW_TYPES[0]);

		this.updateCssClasses();

		// If this is executed, JavaScript is working and the element
		// changes its role to `triggerview-child`.
		this.setAttribute('role', Ch5RoleAttributeMapping.ch5TriggerViewChild);

		// set data-ch5-id
		this.setAttribute('data-ch5-id', this.getCrId());

		/**
		 * The tabindex global attribute indicates if its element can be focused.
		 * Makes available focus and blur events on element
		 *
		 */
		if (!this.hasAttribute('tabindex')) {
			this.tabIndex = -1;
		}

		// init attributes
		this.initAttributes();

		this.initCommonMutationObserver(this);
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.info('Ch5TriggerViewChild.disconnectedCallback()');

		this.unsubscribeFromSignals();

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
		this.info('Ch5TriggerViewChild.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

		switch (attr) {
			case 'selected':
				// only handling the *side effects* of setting the attribute.
				if (this.hasAttribute('selected')) {
					this.setAttribute('aria-selected', 'true');
					this._sendSignalValueOnShow();
				} else {
					this.setAttribute('aria-selected', 'false');
				}
				break;
			case 'sendeventonshow':
				if (this.hasAttribute('sendeventonshow')) {
					this.sendEventOnShow = newValue;
				} else {
					this.sendEventOnShow = '';
				}
				break;
			case 'receivestateshow':
				if (this.hasAttribute('receivestateshow')) {
					this.receiveStateShow = newValue;
				} else {
					this.receiveStateShow = '';
				}
				break;
			case 'noshowtype':
				//  assure that noshowtype attribute value is always 'visibility'
				this.noshowType = Ch5TriggerViewChild.SHOW_TYPES[0];
				break;
			case 'show':
				if (this.hasAttribute('show')) {
					const tmpShow = this.getAttribute('show') as string;
					if ('false' === tmpShow || '0' === tmpShow) {
						this.show = false;
					} else {
						this.show = true;
					}
				} else {
					this.show = true;
				}

				// assure that noshowtype attribute value is always 'visibility'
				this.noshowType = Ch5TriggerViewChild.SHOW_TYPES[0];

				this.updateForChangeInShowStatusOld();
				break;
			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals(): void {
		super.unsubscribeFromSignals();

		const csf = Ch5SignalFactory.getInstance();

		if ('' !== this._subReceiveSignalShowId && '' !== this._receiveStateShowSigName) {
			const sigSelectedName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowSigName);
			const sigSelected: Ch5Signal<number> | null = csf.getNumberSignal(sigSelectedName);
			if (null !== sigSelected) {
				sigSelected.unsubscribe(this._subReceiveSignalShowId);
				this._receiveStateShowSigName = '';
			}
		}
	}

	/**
	 * Returns css class when disabled
	 *
	 * @return {string }
	 */
	public getCssClassDisabled(): string {
		return this.cssClassPrefix + '--disabled';
	}

	public getTriggerViewParent(): Ch5TriggerView | null {
		const getTheMatchingParent = (node: Node): Ch5TriggerView => {
			if (!_.isNil(node) && node.nodeName !== _parentTriggerViewNodeName) {
				return getTheMatchingParent(node.parentNode as Node);
			}
			return node as Ch5TriggerView;
		}

		if (!_.isNil(this.parentElement)) {
			return getTheMatchingParent(this.parentElement as Node);
		}
		return null;
	}

	/**
	 * Called to initialize all attributes
	 * @protected
	 */
	protected initAttributes(): void {
		super.initAttributes();

		this._upgradeProperty('sendEventOnShow');
		this._upgradeProperty('receiveStateShow');
	}

	/**
	 * Apply css classes for attrs inherited from common (e.g. customClass, customStyle )
	 * @protected
	 */
	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
					// this.classList.add(cssClass);
					this.info('add CSS class', cssClass);
				} else {
					targetEl.classList.remove(cssClass);
					// this.classList.remove(cssClass);
					this.info('remove CSS class', cssClass);
				}
			});
		}
	}

	/**
	 * Called to bind proper listeners
	 * @protected
	 */
	protected attachEventListeners(): void {
		super.attachEventListeners();
	}

	/**
	 * Removes listeners
	 * @protected
	 */
	protected removeEvents(): void {
		super.removeEventListeners();
	}

	/**
	 * Generates a list of all possible components css classes
	 *
	 * @private
	 * @returns {string[]}
	 */
	private _generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;
		// primary class
		cssClasses.push(this.primaryCssClass);
		return cssClasses;
	}

	/**
	 * Send digital pulse(boolean values) when component is selected|active
	 * @private
	 */
	private _sendSignalValueOnShow(): void {
		this.info('Ch5TriggerViewChild._sendSignalValueOnShow()');

		let sigShow: Ch5Signal<boolean> | null = null;

		if ('' !== this._sendEventOnShowSigName
			&& undefined !== this._sendEventOnShowSigName
			&& null !== this._sendEventOnShowSigName) {

			sigShow = Ch5SignalFactory.getInstance()
				.getBooleanSignal(this._sendEventOnShowSigName);

			if (sigShow !== null) {
				sigShow.publish(true);
				sigShow.publish(false);
			}
		}
	}

	/**
	 * Upgrade the property on this element with the given name.
	 *
	 * @private
	 * @param {string} prop
	 * The name of a property.
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
	window.customElements.define(Ch5TriggerViewChild.ELEMENT_NAME, Ch5TriggerViewChild);
}

Ch5TriggerViewChild.registerSignalAttributeTypes();
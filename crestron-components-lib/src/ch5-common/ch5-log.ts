// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {
	Ch5Uid,
	Ch5Debug
} from '../ch5-core';
import { Ch5CommonLog } from './ch5-common-log';

export class Ch5Log extends HTMLElement {

	//#region Variables

	/**
	 * Standard html attribute.
	 */
	protected _id: string = '';

	/**
	 * If this param is true then the component will display debug/info messages in the browser's console
	 */
	// protected _isDebugEnabled: boolean = false;
	/**
	 * If this param is true then the component will display debug/info messages in the browser's console
	 */
	// protected _isTraceEnabled: boolean = false;

	/**
	 * Ch5 internal unique ID
	 */
	protected _crId: string = '';

	public logger: Ch5CommonLog;

	//#endregion

	//#region Lifecycle Hooks

	public constructor() {
		super();
		this._crId = Ch5Uid.getUid();
		this.logger = new Ch5CommonLog(false, false, this._crId);
	}

	//#endregion

	//#region Other Methods

	/**
	 *
	 */
	public static get observedAttributes() {
		return [
			'debug',
			'trace'
		]
	}

	/**
	 * Returns the internal ch5 unique identifier assigned to the component
	 */
	public getCrId(): string {
		return this._crId;
	}

	/**
	 * Helper method.
	 * Allows writing debug/info messages using the console.
	 * The messages are displayed only if _isDebugEnabled is true
	 */
	public info(message?: any, ...optionalParams: any[]): void {
		this.logger.info(message, optionalParams);
	}

	// /**
	//  * Returns true if debugging has been enabled on the component.
	//  * When this returns true the info method will output messages on the console ( assuming there are 'info' calls in
	//  * the component's code )
	//  */
	// public isDebug() {
	// 	return this._isDebugEnabled;
	// }

	// /**
	//  * Returns true if debugging has been enabled on the component.
	//  * When this returns true the info method will output messages on the console ( assuming there are 'info' calls in
	//  * the component's code )
	//  */
	// public isTrace() {
	// 	return this._isTraceEnabled;
	// }

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}
		this.info('ch5-common attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

		switch (attr) {
			case 'debug':
				if (this.hasAttribute('debug') && this.toBoolean(this.getAttribute('debug')) === true) {
					this.logger.isDebugEnabled = true;
				} else {
					this.logger.isDebugEnabled = false;
				}
				// this.logger.isDebugEnabled = this._isDebugEnabled;
				break;
			case 'trace':
				if (this.hasAttribute('trace') && this.toBoolean(this.getAttribute('trace')) === true) {
					this.logger.isTraceEnabled = true;
				} else {
					this.logger.isTraceEnabled = false;
				}
				// this.logger.isTraceEnabled = this._isTraceEnabled;
				break;
			default:
				break;
		}
	}

	/**
	 * Initializes the values of the common attributes, taking into account the attribute values declared in the HTML
	 */
	protected initAttributes() {
		if (this.hasAttribute('debug') && this.toBoolean(this.getAttribute('debug')) === true) {
			this.logger.isDebugEnabled = true;
		}
		if (this.hasAttribute('trace') && this.toBoolean(this.getAttribute('trace')) === true) {
			this.logger.isTraceEnabled = true;
		}
	}

	/**
	 * Converts value to boolean
	 *
	 * @private
	 * @param {string|boolean} str
	 * @returns {boolean}
	 */
	protected _toBoolean(val: any): boolean {
		const str = String(val);
		switch (str.toLowerCase().trim()) {
			case "true": case "yes": case "1": return true;
			case "false": case "no": case "0": case null: return false;
			default: return Boolean(false);
		}
	}

	/**
		* Converts value to boolean
		* Applicable for 'true', 'false', and null
		* @private
		* @param {string|boolean} str
		* @returns {boolean}
		*/
	protected toBoolean(val: any, isEmptyValueEqualToTrue = false): boolean {
		const str = String(val);
		switch (str.toLowerCase().trim()) {
			case "true": case "yes": case "1": return true;
			case "false": case "no": case "0": case null: return false;
			case "":
				if (isEmptyValueEqualToTrue === true) {
					return true;
				} else {
					return Boolean(false);
				}
			default:
				return Boolean(false);
		}
	}

	//#endregion 

}

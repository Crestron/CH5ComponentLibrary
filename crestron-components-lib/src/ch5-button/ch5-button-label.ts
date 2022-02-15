// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5Button } from "./ch5-button";
import { Ch5ButtonMode } from "./ch5-button-mode";
import { Ch5ButtonModeState } from "./ch5-button-mode-state";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Log } from "../ch5-common/ch5-log";
import { ICh5ButtonLabelAttributes } from "./interfaces/i-ch5-button-label-attributes";

export class Ch5ButtonLabel extends Ch5Log implements ICh5ButtonLabelAttributes {

	// private observer: MutationObserver | null = null;
	constructor() {
		super();
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback');

		if (!(this.parentElement instanceof Ch5Button || this.parentElement instanceof Ch5ButtonMode || this.parentElement instanceof Ch5ButtonModeState)) {
			throw new Error(`Invalid parent element for ch5-button-label.`);
		}

		this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonLabel);
		this.setAttribute('data-ch5-id', this.getCrId());
		this.initAttributes();

		// const callbackFn = (mutations: any) => {
		// 	(this.parentElement as Ch5Button).setButtonDisplay();
		// }
		// const configForMut = {
		// 	childList: true,
		// 	attributes: true,
		// 	subtree: true,
		// 	characterData: true
		// };
		// this.observer = new MutationObserver(callbackFn);
		// this.observer.observe(this, configForMut);
		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.log('Ch5ButtonLabel.disconnectedCallback()');
		// if (this.observer) {
		// 	this.observer.disconnect();
		// 	this.observer = null;
		// }
	}

}

if (typeof window === "object" && typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define('ch5-button-label', Ch5ButtonLabel);
}

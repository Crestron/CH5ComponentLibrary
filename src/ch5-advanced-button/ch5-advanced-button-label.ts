// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AdvancedButton } from "./ch5-advanced-button";
import { Ch5AdvancedButtonMode } from "./ch5-advanced-button-mode";
import { Ch5AdvancedButtonModeState } from "./ch5-advanced-button-mode-state";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Log } from "../ch5-common/ch5-log";
import { ICh5AdvancedButtonLabelAttributes } from "./interfaces/i-ch5-advanced-button-label-attributes";
import { Ch5SignalAttributeRegistry } from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5AdvancedButtonLabel extends Ch5Log implements ICh5AdvancedButtonLabelAttributes {

	public static readonly ELEMENT_NAME: string = 'ch5-advanced-button-label';

	constructor() {
		super();
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5AdvancedButtonLabel.ELEMENT_NAME, {
			contractname: { contractName: true },
			booleanjoinoffset: { booleanJoin: 1 },
			numericjoinoffset: { numericJoin: 1 },
			stringjoinoffset: { stringJoin: 1 },
		});
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback');

		if (!(this.parentElement instanceof Ch5AdvancedButton || this.parentElement instanceof Ch5AdvancedButtonMode || this.parentElement instanceof Ch5AdvancedButtonModeState)) {
			throw new Error(`Invalid parent element for ch5-advanced-button-label.`);
		}

		this.setAttribute('role', Ch5RoleAttributeMapping.ch5AdvancedButtonLabel);
		this.setAttribute('data-ch5-id', this.getCrId());
		this.initAttributes();
		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.log('Ch5AdvancedButtonLabel.disconnectedCallback()');
	}

}

if (typeof window === "object" && typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define(Ch5AdvancedButtonLabel.ELEMENT_NAME, Ch5AdvancedButtonLabel);
}

Ch5AdvancedButtonLabel.registerSignalAttributeTypes();
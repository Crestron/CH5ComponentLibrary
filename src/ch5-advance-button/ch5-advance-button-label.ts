// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AdvanceButton } from "./ch5-advance-button";
import { Ch5AdvanceButtonMode } from "./ch5-advance-button-mode";
import { Ch5AdvanceButtonModeState } from "./ch5-advance-button-mode-state";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Log } from "../ch5-common/ch5-log";
import { ICh5AdvanceButtonLabelAttributes } from "./interfaces/i-ch5-advance-button-label-attributes";
import { Ch5SignalAttributeRegistry } from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5AdvanceButtonLabel extends Ch5Log implements ICh5AdvanceButtonLabelAttributes {

	public static readonly ELEMENT_NAME: string = 'ch5-advance-button-label';

	constructor() {
		super();
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5AdvanceButtonLabel.ELEMENT_NAME, {
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

		if (!(this.parentElement instanceof Ch5AdvanceButton || this.parentElement instanceof Ch5AdvanceButtonMode || this.parentElement instanceof Ch5AdvanceButtonModeState)) {
			throw new Error(`Invalid parent element for ch5-advance-button-label.`);
		}

		this.setAttribute('role', Ch5RoleAttributeMapping.ch5AdvanceButtonLabel);
		this.setAttribute('data-ch5-id', this.getCrId());
		this.initAttributes();
		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.log('Ch5AdvanceButtonLabel.disconnectedCallback()');
	}

}

if (typeof window === "object" && typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define(Ch5AdvanceButtonLabel.ELEMENT_NAME, Ch5AdvanceButtonLabel);
}

Ch5AdvanceButtonLabel.registerSignalAttributeTypes();
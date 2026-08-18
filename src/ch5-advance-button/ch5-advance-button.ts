// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5AdvanceButtonBase } from "./ch5-advance-button-base";
import { ICh5ButtonListContractObj } from "./interfaces/t-for-ch5-button-list-contract";

export class Ch5AdvanceButton extends Ch5AdvanceButtonBase {

	public static readonly ELEMENT_NAME = 'ch5-advance-button';

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5AdvanceButton.ELEMENT_NAME, Ch5AdvanceButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5AdvanceButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5AdvanceButton.ELEMENT_NAME, Ch5AdvanceButton);
		}
	}

	constructor(public buttonListContractObj?: ICh5ButtonListContractObj) {
		super(buttonListContractObj);
	}

}

Ch5AdvanceButton.registerCustomElement();
Ch5AdvanceButton.registerSignalAttributeTypes();
Ch5AdvanceButton.registerSignalAttributeDefaults(Ch5AdvanceButton.ELEMENT_NAME);
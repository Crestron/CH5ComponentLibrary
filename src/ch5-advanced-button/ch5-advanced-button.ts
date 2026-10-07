// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5AdvancedButtonBase } from "./ch5-advanced-button-base";
import { ICh5ButtonListContractObj } from "./interfaces/t-for-ch5-button-list-contract";

export class Ch5AdvancedButton extends Ch5AdvancedButtonBase {

	public static readonly ELEMENT_NAME = 'ch5-advanced-button';

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5AdvancedButton.ELEMENT_NAME, Ch5AdvancedButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5AdvancedButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5AdvancedButton.ELEMENT_NAME, Ch5AdvancedButton);
		}
	}

	constructor(public buttonListContractObj?: ICh5ButtonListContractObj) {
		super(buttonListContractObj);
	}

}

Ch5AdvancedButton.registerCustomElement();
Ch5AdvancedButton.registerSignalAttributeTypes();
Ch5AdvancedButton.registerSignalAttributeDefaults(Ch5AdvancedButton.ELEMENT_NAME);
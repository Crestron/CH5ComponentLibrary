// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5ButtonBase } from "./ch5-button-base";
import { ICh5ButtonListContractObj } from "./interfaces/t-for-ch5-button-list-contract";

export class Ch5Button extends Ch5ButtonBase {

	public static readonly ELEMENT_NAME = 'ch5-button';

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Button.ELEMENT_NAME, Ch5Button.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerSignalAttributeDefaults() {
		Ch5SignalAttributeRegistry.instance.addElementDefaultAttributeEntries(Ch5Button.ELEMENT_NAME, {
			contractName: { attributes: ["contractname"], defaultValue: "" },
			booleanJoin: { attributes: ["booleanjoinoffset"], defaultValue: "0" },
			numericJoin: { attributes: ["numericjoinoffset"], defaultValue: "0" },
			stringJoin: { attributes: ["stringjoinoffset"], defaultValue: "0" }
		});
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Button.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Button.ELEMENT_NAME, Ch5Button);
		}
	}

	constructor(public buttonListContractObj?: ICh5ButtonListContractObj) {
		super(buttonListContractObj);
	}

}

Ch5Button.registerCustomElement();
Ch5Button.registerSignalAttributeTypes();
Ch5Button.registerSignalAttributeDefaults();
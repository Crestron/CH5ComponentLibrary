// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Dpad } from "./ch5-dpad";
import { Ch5DpadButtonBase } from "./ch5-dpad-button-base";
import { ICh5DpadButtonBaseAttributes } from "./interfaces/i-ch5-dpad-button-base-attributes";

export class Ch5DpadButton extends Ch5DpadButtonBase implements ICh5DpadButtonBaseAttributes {

	//#region 1. Variables

	public static readonly ELEMENT_NAME = 'ch5-dpad-button';

	//#endregion

	//#region 2. Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton);
		}
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor(parentDpad: Ch5Dpad, isDisabled: boolean = false) {
		super(parentDpad, isDisabled);
	}

	//#endregion

}

Ch5DpadButton.registerCustomElement();
Ch5DpadButton.registerSignalAttributeTypes();
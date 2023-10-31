// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5DpadButtonBase } from "./ch5-dpad-button-base";
import { ICh5DpadButtonBaseAttributes } from "./interfaces/i-ch5-dpad-button-base-attributes";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5DpadButton extends Ch5DpadButtonBase implements ICh5DpadButtonBaseAttributes {

	//#region 1. Variables

	public static readonly ELEMENT_NAME = 'ch5-dpad-button';

	public static readonly DEFAULT_ICONS = {
		up: 'fa-caret-up',
		down: 'fa-caret-down',
		left: 'fa-caret-left',
		right: 'fa-caret-right',
		center: 'fa-circle'
	};

	//#endregion

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton);
		}
	}

	//#region 2. Lifecycle Hooks

	public constructor() {
		super();
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5DpadButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-dpad-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5DpadButtonBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.logger.stop();
	}

	//#endregion

}

Ch5DpadButton.registerCustomElement();
Ch5DpadButton.registerSignalAttributeTypes();
// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5DpadChildBase } from "./ch5-dpad-child-base";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadChildBaseAttributes } from "./interfaces/i-ch5-dpad-child-base-attributes";
import { TCh5DpadChildButtonType } from "./interfaces/t-ch5-dpad";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { ComponentHelper } from "../ch5-common/utils/component-helper";

export class Ch5DpadButton extends Ch5DpadChildBase implements ICh5DpadChildBaseAttributes {

	//#region 1. Variables

	public static readonly ELEMENT_NAME = 'ch5-dpad-button';

	public static readonly DEFAULT_ICONS = {
		up: 'fa-caret-up',
		down: 'fa-caret-down',
		left: 'fa-caret-left',
		right: 'fa-caret-right',
		center: 'fa-circle'
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "key",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "iconClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "iconUrl",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "label",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: true,
			name: "pressed",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: false,
			isObservableProperty: true,
		}
	];

	//#endregion

	//#region 2. Lifecycle Hooks

	public constructor() {
		super();
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	/**
	 * Function to create all inner html elements required to complete dpad center button
	 */
	// public createHtmlElements(): void {
	// 	this.logger.start('createHtmlElements', this.COMPONENT_NAME);

	// 	if (this.primaryCssClass) {
	// 		this.classList.add(this.primaryCssClass);
	// 	}
	// 	this.classList.add(this.CSS_CLASS_LIST.commonBtnClass);
	// 	if (this.CSS_CLASS_LIST.primaryTagClass) {
	// 		this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
	// 	}
	// 	if (this.CSS_CLASS_LIST.defaultArrowClass) {
	// 		this.classList.add(this.CSS_CLASS_LIST.defaultArrowClass);
	// 	}

	// 	// Order of preference is:
	// 	// 0 parentContract
	// 	// 4 iconUrl
	// 	// 5 iconClass
	// 	// 6 label
	// 	if (this.iconUrl.length > 0) {
	// 		this._icon = CH5DpadUtils.getImageContainer(this.iconUrl);
	// 		this._icon.style.backgroundImage = `url(${this.iconUrl})`;
	// 	} else if (this.iconClass) {
	// 		this._icon = CH5DpadUtils.getIconContainer();
	// 		this._icon.classList.add(...(this.iconClass.split(' ').filter(element => element))); // the filter removes empty spaces;
	// 	} else if (this.label.length > 0 && this.key === 'center') {
	// 		this._icon = CH5DpadUtils.getLabelContainer(this.LABEL_CLASS);
	// 		this._icon.innerHTML = this.label;
	// 	} else {
	// 		// if nothing works, then render as default
	// 		this._icon = CH5DpadUtils.getIconContainer();
	// 		this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
	// 		this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
	// 	}

	// 	if (this._icon.parentElement !== this) {
	// 		this.appendChild(this._icon);
	// 	}

	// 	this.logger.stop();
	// }

	static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5DpadButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5DpadButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5DpadButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-dpad-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5DpadButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				if (key == "label") {
					CH5DpadUtils.createIconTag(this);
				}
				else if (key == "key") {
					CH5DpadUtils.createIconTag(this);
					super.initializeParams({
						primaryTagClass: newValue as TCh5DpadChildButtonType,
						defaultIconClass: Ch5DpadButton.DEFAULT_ICONS[newValue as TCh5DpadChildButtonType],
						defaultArrowClass: newValue === 'center' ? '' : 'direction-btn',
						btnType: newValue as TCh5DpadChildButtonType
					});
				}
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.logger.stop();
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		super.initAttributes();
		// below actions, set default value to the control's attribute if they dont exist, and assign them as a return value
		this.label = ComponentHelper.setAttributeToElement(this, 'label', this._label);
	}

	//#endregion

}

if (typeof window === "object"
	&& typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton);
}

Ch5DpadButton.registerSignalAttributeTypes();
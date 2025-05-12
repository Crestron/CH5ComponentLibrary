// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

// import * as _ from 'lodash';
import { Subscription } from "rxjs";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5SignalAttributeRegistry } from '../ch5-common/ch5-signal-attribute-registry';
import { Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5KeypadButtonAttributes } from "./interfaces/i-ch5-keypad-btn-attributes";
import { TKeypadButtonDefault } from "./interfaces/t-ch5-keypad";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { CH5KeypadUtils } from './ch5-keypad-utils';
import { Ch5Keypad } from './ch5-keypad';
import _ from "lodash";

export class Ch5KeypadButton extends Ch5Common implements ICh5KeypadButtonAttributes {

	//#region 1. Variables

	//#region 1.1 readonly variables

	public static readonly ELEMENT_NAME = 'ch5-keypad-button';

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "key",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "labelMajor",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "labelMinor",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "iconClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "sendEventOnClick",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: false,
			name: "pressed",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		}
	];

	public readonly primaryCssClass = 'keypad-btn';
	public readonly pressedCssClassPostfix = '-pressed';
	private readonly labelHasIconCssClass = 'has-icon';

	//#endregion

	//#region 1.2 private / protected variables

	private _ch5Properties: Ch5Properties;


	private labelMajorCssClass: string = 'label-major';
	private labelMinorCssClass: string = 'label-minor';

	private _elButton: HTMLElement = {} as HTMLElement;
	private _elMajorSpan: HTMLElement = {} as HTMLElement;
	private _elMinorSpan: HTMLElement = {} as HTMLElement;
	private _elIcon: HTMLElement = {} as HTMLElement;

	private defaultValue: TKeypadButtonDefault | null = null;

	private _pressable: Ch5Pressable | null = null;
	private _pressableIsPressedSubscription: Subscription | null = null;

	//#endregion

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5KeypadButton.ELEMENT_NAME, Ch5KeypadButton);
		}
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5KeypadButton.ELEMENT_NAME, Ch5KeypadButton.SIGNAL_ATTRIBUTE_TYPES);
	}

	//#endregion

	//#region 2. Setters and Getters

	public set labelMajor(value: string) {
		this._ch5Properties.set<string>("labelMajor", value, () => {
			if (this.labelMajor.trim() === "") {
				this.setAttribute('labelMajor', this.getDefaultValue('labelMajor'))
			}
			this.handleIconLabelMajor();
		});
	}
	public get labelMajor() {
		return this._ch5Properties.get<string>("labelMajor");
	}

	public set labelMinor(value: string) {
		this._ch5Properties.set<string>("labelMinor", value, () => {
			if (this.labelMinor.trim() === "") {
				this.setAttribute('labelMinor', this.getDefaultValue('labelMinor'))
			}
		});
		this.handleLabelMinor(); // Handle this irrespective of content inside the label minor or its availability
	}
	public get labelMinor(): string {
		return this._ch5Properties.get<string>("labelMinor")
	}

	public set iconClass(value: string) {
		this._ch5Properties.set<string>("iconClass", value, () => {
			this.handleIconLabelMajor();
		});
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>("iconClass")
	}

	public set sendEventOnClick(value: string) {
		this._ch5Properties.set<string>("sendEventOnClick", value);
	}
	public get sendEventOnClick() {
		return this._ch5Properties.get<string>("sendEventOnClick");
	}

	public set key(value: string) {
		this._ch5Properties.set<string>("key", value);
	}
	public get key(): string {
		return this._ch5Properties.get<string>('key');
	}

	public set pressed(value: boolean) {
		this._ch5Properties.set<boolean>("pressed", value, () => {
			this.handlePressed();
		});
	}
	public get pressed(): boolean {
		return this._ch5Properties.get<boolean>("pressed");
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor(defaultObj: TKeypadButtonDefault) {
		super();
		this.logger.start('constructor()', Ch5KeypadButton.ELEMENT_NAME);
		this.ignoreAttributes = ["show", "disabled", "receivestateenable", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestatecustomclass", "receivestatecustomstyle", "sendeventonshow"];
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;
		this.defaultValue = defaultObj;
		this._ch5Properties = new Ch5Properties(this, Ch5KeypadButton.COMPONENT_PROPERTIES);
		this.logger.stop();
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", Ch5KeypadButton.ELEMENT_NAME);
		super.initAttributes();
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5KeypadButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5KeypadButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5KeypadButton.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5KeypadButton.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				} else {
					const key = Ch5KeypadButton.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getDefaultValue(key);
				}
			}
		}
		this.logger.stop();
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', Ch5KeypadButton.ELEMENT_NAME);
		if (this.parentElement && this.parentElement.classList.contains('ch5-keypad') === false) {
			this.logger.stop();
			return;
		}

		if (this._elButton.parentElement !== this) {
			this.classList.add('keypad-btn');
			this.appendChild(this._elButton);
		}

		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5KeypadChild);
		}

		this.setAttribute('data-ch5-id', this.getCrId());

		this.initPressable(this.primaryCssClass + this.pressedCssClassPostfix);
		this.initAttributes();

		// this.attachEventListeners();
		this.setDefaultClasses();

		this.initCommonMutationObserver(this);
		this.logger.stop();
	}

	// protected attachEventListeners() {
	// 	if (!_.isNil(this._pressable)) {
	// 		this._pressable?.init();
	// 		this._subscribeToPressableIsPressed();
	// 	}
	// }

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.start('disconnectedCallback() - start', Ch5KeypadButton.ELEMENT_NAME);

		// if (this.parentElement && this.parentElement.classList.contains('ch5-keypad') === false) {
		// 	this.logger.stop();
		// 	return;
		// }

		// this.removeEventListeners();

		// destroy pressable
		if (null !== this._pressable) {
			this._pressable.destroy();
			this._pressable = null;
		}
		if (this._pressableIsPressedSubscription !== null) {
			this._pressableIsPressedSubscription.unsubscribe();
		}
		this._pressableIsPressedSubscription = null;

		this.unsubscribeFromSignals();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();


		this.logger.stop();
	}

	// public removeEventListeners() {
	// 	if (!_.isNil(this._pressable)) {
	// 		this._unsubscribeFromPressableIsPressed();
	// 	}
	// }

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5KeypadButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5KeypadButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5KeypadButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", Ch5KeypadButton.ELEMENT_NAME);
		if (oldValue !== newValue) {
			this.logger.log('ch5-keypad attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5KeypadButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

	//#region 4. Other Methods

	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elButton = document.createElement('button');
		this._elMajorSpan = document.createElement('span');
		this._elMinorSpan = document.createElement('span');
		this._elIcon = document.createElement('span');

		this._elMajorSpan.classList.add(this.labelMajorCssClass);
		this._elMinorSpan.classList.add(this.labelMinorCssClass);

		this._elButton.appendChild(this._elMajorSpan);
		this._elButton.appendChild(this._elMinorSpan);

		this.logger.stop();
	}

	private clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	/**
	 * Called when pressed class will be available
	 * @param pressedClass is class name. it will add after press the ch5 keypad button
	 */
	private initPressable(pressedClass: string) {
		const parent = this.parentElement?.parentElement as Ch5Keypad;
		if (!parent) {
			return;
		}
		this._pressable = new Ch5Pressable(this, {
			cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
			cssPressedClass: pressedClass,
			enableSwipe: parent.swipeGestureEnabled
		});
		if (this._pressable) {
			this._pressable.init();
			this._subscribeToPressableIsPressed();
		}
	}

	protected updateSwipeGesture() {
		const parent = this.parentElement?.parentElement as Ch5Keypad;
		if (!parent) {
			return;
		}
		if (this._pressable !== null && !_.isNil(this._pressable.options)) {
			this._pressable.options.enableSwipe = parent.swipeGestureEnabled;
		}
	}

	/**
	 * Sends the signal passed via sendEventOnClick or sendEventOnTouch
	 */
	protected handleSendEventOnClick() {
		if (this.sendEventOnClick) {
			Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(true);
			Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(false);
		}
	}

	protected _subscribeToPressableIsPressed() {
		if (this._pressableIsPressedSubscription !== null) {
			this._pressableIsPressedSubscription.unsubscribe();
			this._pressableIsPressedSubscription = null;
		}
		if (this._pressableIsPressedSubscription === null && this._pressable !== null) {
			this._pressableIsPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				if (value === false) {
					this.handleSendEventOnClick();
				}
			});
		}
	}

	// protected _unsubscribeFromPressableIsPressed() {
	// 	if (this._pressableIsPressedSubscription !== null) {
	// 		this._pressableIsPressedSubscription.unsubscribe();
	// 		this._pressableIsPressedSubscription = null;
	// 	}
	// }

	private handleIconLabelMajor() {
		if (this.iconClass.trim()) {
			this._elIcon.setAttribute('class', '');
			this.iconClass.trim().split(' ').forEach((cls: string) => this._elIcon.classList.add(cls));
			this._elMajorSpan.innerText = "";
			this._elMajorSpan.appendChild(this._elIcon);
			this._elMajorSpan.classList.add(this.labelHasIconCssClass);
		} else {
			this._elIcon.remove();
			this._elMajorSpan.innerText = this.labelMajor;
			this._elMajorSpan.classList.remove(this.labelHasIconCssClass);
		}
	}
	private handleLabelMinor() {
		const parent = this.parentElement?.parentElement as Ch5Keypad;
		if (parent) {
			if (parent.displayLabelMajorOnly === false && (!this.labelMinor || this.labelMinor.trim() === "")) {
				const getDefaultValue = this.getDefaultValue("labelMinor");
				if (getDefaultValue !== "") {
					this.labelMinor = "&nbsp;";
				}
			}
		}
		this._elMinorSpan.innerHTML = this.labelMinor;
	}
	private handlePressed() {
		// if (!this._pressable) {
		// 	this.initPressable(this.primaryCssClass + this.pressedCssClassPostfix);
		// }
		if (this._pressable) {
			if (this._pressable._pressed !== this.pressed) {
				this._pressable.setPressed(this.pressed);
			}
		}
	}
	private getDefaultValue(attr: string) {

		if (this.defaultValue) {
			const defaultVal: any = this.defaultValue;
			if (defaultVal.hasOwnProperty(attr)) {
				return defaultVal[attr];
			}
		}

		const key = this.getAttribute('key') || "";
		const index = CH5KeypadUtils.KEYPAD_BUTTON_KEY.findIndex((ele) => ele === key);

		if (index === -1) {
			return "";
		}

		const defaultValue: any = CH5KeypadUtils.KEYPAD_DEFAULT_VALUES[index];
		if (defaultValue.hasOwnProperty(attr)) {
			return defaultValue[attr];
		}
	}
	private setDefaultClasses() {
		const key = this.getAttribute('key') || "";
		const index = CH5KeypadUtils.KEYPAD_BUTTON_KEY.findIndex((ele) => ele === key);

		if (index === -1) {
			return;
		}

		const defaultValue: any = CH5KeypadUtils.KEYPAD_DEFAULT_VALUES[index];
		if (defaultValue.hasOwnProperty('defaultClasses')) {
			defaultValue.defaultClasses.forEach((cls: string) => this.classList.add(cls));
		}

		const parent = this.parentElement?.parentElement as Ch5Keypad;
		if (!parent) {
			return;
		}
		if (parent.hideAsteriskButton && index === 9) {
			this.classList.add('ch5-hide-vis');
		}

		if (parent.hidePoundButton && index === 11) {
			this.classList.add('ch5-hide-vis');
		}
	}

	//#endregion
}

Ch5KeypadButton.registerSignalAttributeTypes();
Ch5KeypadButton.registerCustomElement();
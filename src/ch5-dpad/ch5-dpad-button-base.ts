// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Subscription } from "rxjs";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadButtonBaseAttributes } from "./interfaces/i-ch5-dpad-button-base-attributes";
import { TCh5DpadChildButtonType } from "./interfaces/t-ch5-dpad";
import { Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";

export class Ch5DpadButtonBase extends Ch5Common implements ICh5DpadButtonBaseAttributes {

	//#region 1. Variables

	private _isDisabledOrHiddenButton: boolean = false;

	private _parentDpad: Ch5Dpad;

	public static readonly DEFAULT_ICONS = {
		up: 'fa-caret-up',
		down: 'fa-caret-down',
		left: 'fa-caret-left',
		right: 'fa-caret-right',
		center: 'fa-circle'
	};

	//#region 1.1 readonly variables
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
			name: "iconClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
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
			isObservableProperty: true
		},
		{
			default: false,
			name: "pressed",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnClick",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		}
	];

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true }
	};

	private readonly PRESSED_CSS_CLASS_SUFFIX: string = '--pressed';

	private readonly LABEL_CLASS: string = 'dpad-btn-label';

	//#region 1.2 protected variables
	public primaryCssClass = '';

	protected COMPONENT_NAME: string = "";
	protected componentPrefix: string = 'ch5-dpad-button-';
	protected readonly CSS_CLASS_LIST: any = {
		commonBtnClass: 'ch5-dpad-child',
		primaryIconClass: 'fas',
		imageClassName: 'image-url',
		primaryTagClass: '',
		defaultIconClass: '',
		defaultArrowClass: ''
	};
	private _ch5Properties: Ch5Properties;

	// elements specific vars
	protected _icon: HTMLElement = {} as HTMLElement;

	// state specific vars
	protected buttonType: TCh5DpadChildButtonType | null = null;

	protected _pressable: Ch5Pressable | null = null;
	private _isPressedSubscription: Subscription | null = null;
	private _repeatDigitalInterval: number | null = null;

	//#endregion

	//#region 2. Setters and Getters

	public set label(value: string) {
		this._ch5Properties.set<string>("label", value, () => {
			this.handleLabel();
		});
	}
	public get label() {
		return this._ch5Properties.get<string>("label");
	}

	public set key(value: TCh5DpadChildButtonType) {
		this._ch5Properties.set<TCh5DpadChildButtonType>("key", value, () => {
			this.handleKey();
		});
	}
	public get key() {
		return this._ch5Properties.get<TCh5DpadChildButtonType>("key");
	}

	public set iconClass(value: string) {
		const prevValue = this.iconClass;
		this._ch5Properties.set<string>("iconClass", value, () => {
			this.handleIconClass(prevValue);
		});
	}
	public get iconClass() {
		return this._ch5Properties.get<string>("iconClass");
	}

	public set iconUrl(value: string) {
		this._ch5Properties.set<string>("iconUrl", value, () => {
			this.handleIconUrl(value);
		});
	}
	public get iconUrl() {
		return this._ch5Properties.get<string>("iconUrl");
	}

	public set sendEventOnClick(value: string) {
		this._ch5Properties.set<string>("sendEventOnClick", value);
	}
	public get sendEventOnClick() {
		return this._ch5Properties.get<string>("sendEventOnClick");
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

	public constructor(parentDpad: Ch5Dpad, isDisabledOrHidden: boolean = false) {
		super();
		this.logger.start('constructor()', this.COMPONENT_NAME);
		this._isDisabledOrHiddenButton = isDisabledOrHidden;
		if (!_.isNil(parentDpad)) {
			this._parentDpad = parentDpad;
		} else {
			this._parentDpad = this.getParentDpad();
		}
		this.ignoreAttributes = ["show", "disabled", "receivestateenable", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestatecustomclass", "receivestatecustomstyle", "sendeventonshow"];
		this._ch5Properties = new Ch5Properties(this, Ch5DpadButtonBase.COMPONENT_PROPERTIES);

		ComponentHelper.clearComponentContent(this);

		this.logger.stop();
	}

	protected initializeParams(defaultIconClass: string, defaultArrowClass: string, btnType: TCh5DpadChildButtonType) {
		this.buttonType = btnType;
		this.COMPONENT_NAME = this.componentPrefix + btnType;
		this.CSS_CLASS_LIST.primaryTagClass = btnType;
		this.CSS_CLASS_LIST.defaultIconClass = defaultIconClass;
		if (Ch5Common.isNotNil(defaultArrowClass)) {
			this.CSS_CLASS_LIST.defaultArrowClass = defaultArrowClass;
		}
		this.primaryCssClass = this.componentPrefix + btnType;
		if (this.getDisabledOrHiddenDpadCenterButton() === false) {
			this.updatePressedClass(this.primaryCssClass + this.PRESSED_CSS_CLASS_SUFFIX);
		}
	}

	public getParentDpad(): Ch5Dpad {
		const getTheMatchingParent = (node: Node): Ch5Dpad => {
			if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-DPAD") {
				return getTheMatchingParent(node.parentNode?.parentNode as Node);
			}
			return node as Ch5Dpad;
		}
		return getTheMatchingParent(this.parentElement as Node);
	}

	private getDisabledOrHiddenDpadCenterButton() {
		if (this._isDisabledOrHiddenButton === false && this.key === "center") {
			if (this._parentDpad.hideCenterButton === true || this._parentDpad.disableCenterButton === true) {
				this.setDisabledOrHidden(true);
			}
		}
		return this._isDisabledOrHiddenButton;
	}
	public setDisabledOrHidden(disabledOrHiddenValue: boolean) {
		this._isDisabledOrHiddenButton = disabledOrHiddenValue;
		if (this._isDisabledOrHiddenButton === true) {
			this.pressed = false;
			if (null !== this._pressable) {
				this._pressable.destroy();
			}
			this._unsubscribeFromPressableIsPressed();
			this._pressable = null;
		} else {
			if (_.isNil(this._pressable)) {
				this._pressable = new Ch5Pressable(this, {
					cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
					cssPressedClass: this.primaryCssClass + this.PRESSED_CSS_CLASS_SUFFIX,
					enableSwipe: this._parentDpad.swipeGestureEnabled
				});
				this._pressable?.init();
			}
			if (this._isPressedSubscription === null) {
				this._subscribeToPressableIsPressed();
			}
		}
	}

	protected updateSwipeGesture() {
		if (this._pressable !== null && !_.isNil(this._pressable.options)) {
			this._pressable.options.enableSwipe = this._parentDpad.swipeGestureEnabled;
		}
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

		if (!this.parentElement || (this.parentElement && this.parentElement.nodeName.toLowerCase() === 'ch5-dpad')) {
			return;
		}

		if (this.parentElement && this.parentElement.parentElement && !(this.parentElement.parentElement instanceof Ch5Dpad)) {
			throw new Error(`Invalid parent element for ch5-dpad-button. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too.`);
		}

		this.setAttribute('data-ch5-id', this.getCrId());

		this.createElementsAndInitialize();

		// init pressable before initAttributes because pressable subscribe to gestureable attribute
		if (!_.isNil(this._pressable) && this.getDisabledOrHiddenDpadCenterButton() === false) {
			this._pressable.init();
			this._subscribeToPressableIsPressed();
		}

		// TODO - calling this again for pressed true on load - must be cleaned
		this.initAttributes();

		customElements.whenDefined('ch5-dpad-button').then(() => {
			this.initCommonMutationObserver(this);
		});

		this.logger.stop();
	}

	private createIconTag() {
		if (this._icon.classList === undefined || this._icon.classList.length <= 0) {
			this._icon = document.createElement('span');
		}
	}

	/**
	 * Function to create HTML elements of the components including child elements
	 */
	protected createElementsAndInitialize() {
		if (!this._wasInstatiated) {
			this.createIconTag();
		}
		this.initAttributes();

		if (!this._wasInstatiated) {
			this.createHtmlElements();
			this._wasInstatiated = true;
		}
		this.attachEventListeners();
		this.updateCssClasses();
	}

	/**
	 * Function to create all inner html elements required to complete dpad child-base button
	 */
	protected createHtmlElements(): void {
		this.logger.start('createHtmlElements', this.COMPONENT_NAME);
		if (Ch5Common.isNotNil(this.primaryCssClass)) {
			this.classList.add(this.primaryCssClass);
		}
		this.classList.add(this.CSS_CLASS_LIST.commonBtnClass);
		if (Ch5Common.isNotNil(this.CSS_CLASS_LIST.primaryTagClass)) {
			this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
		}
		if (Ch5Common.isNotNil(this.CSS_CLASS_LIST.defaultArrowClass)) {
			this.classList.add(this.CSS_CLASS_LIST.defaultArrowClass);
		}

		// Order of preference is:
		// 0 parentContract
		// 4 iconUrl
		// 5 iconClass
		// 6 label
		if (this.iconUrl.length > 0) {
			this._icon = this.getImageContainer(this.iconUrl);
			this._icon.style.backgroundImage = `url(${this.iconUrl})`;
		} else if (this.iconClass) {
			this._icon = this.getIconContainer();
			this._icon.classList.add(...(this.iconClass.split(' ').filter(element => element))); // the filter removes empty spaces
		} else if (this.label.length > 0 && this.key === 'center') {
			this._icon = this.getLabelContainer(this.LABEL_CLASS);
			this._icon.innerHTML = this.label;
		} else {
			// if nothing works, then render as default
			this._icon = this.getIconContainer();
			this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
			if (Ch5Common.isNotNil(this.CSS_CLASS_LIST.defaultIconClass)) {
				this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
			}
		}

		if (this._icon.parentElement !== this) {
			this.appendChild(this._icon);
		}

		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.start('disconnectedCallback() - start', this.COMPONENT_NAME);
		this.removeEventListeners();

		this.unsubscribeFromSignals();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
		this.logger.stop();
	}

	public removeEventListeners() {
		this.logger.start('removeEventListeners() - start', this.COMPONENT_NAME);
		super.removeEventListeners();
		this._unsubscribeFromPressableIsPressed();

		// destroy pressable
		if (null !== this._pressable) {
			this._pressable.destroy();
		}
		this.logger.stop();
	}

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
		for (let i: number = 0; i < Ch5DpadButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
		this.logger.log('ch5-dpad-button key=' + this.key + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
		if (oldValue !== newValue) {
			attr = attr.toLowerCase();
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

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", this.COMPONENT_NAME);
		super.initAttributes();

		ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5DpadChild); // WAI-ARIA Attributes

		// below actions, set default value to the control's attribute if they do not exist, and assign them as a return value
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5DpadButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5DpadButtonBase.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		const btnType = this.buttonType as TCh5DpadChildButtonType;
		this.logger.log("btnType", btnType);
		if (this.parentElement &&
			this.parentElement.parentElement) {
			const ele = this.parentElement.parentElement;
			const parentContractName: string = ComponentHelper.getAttributeAsString(ele, 'contractname', '')?.trim();
			const parentContractEvent: string = ComponentHelper.getAttributeAsString(ele, 'sendeventonclickstart', '')?.trim();
			if (parentContractName.length > 0) {
				this.sendEventOnClick = parentContractName + "." + CH5DpadUtils.contractSuffix[btnType];
			} else if (parentContractName.length <= 0 && parentContractEvent.length > 0) {
				this.sendEventOnClick = (parseInt(parentContractEvent, 10) + CH5DpadUtils.sendEventOnClickSigCountToAdd[btnType]).toString();
			} else {
				this.sendEventOnClick = "";
			}
		}

		if (this.hasAttribute('pressed')) {
			if (this._pressable) {
				this._pressable.setPressed(this.toBoolean((this.hasAttribute('pressed') && this.getAttribute('pressed') !== "false"), false));
			}
		}

		this.logger.stop();
	}

	/**
	 * Called to bind proper listeners
	 */
	protected attachEventListeners() {
		super.attachEventListeners();
		if (!_.isNil(this._pressable) && this.getDisabledOrHiddenDpadCenterButton() === false) {
			this._pressable?.init();
			this._subscribeToPressableIsPressed();
		}
	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle)
		super.updateCssClasses();
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Called when pressed class will be available
	 * @param pressedClass is class name. it will add after press the ch5 button
	 */
	protected updatePressedClass(pressedClass: string) {
		this._pressable = new Ch5Pressable(this, {
			cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
			cssPressedClass: pressedClass,
			enableSwipe: this._parentDpad.swipeGestureEnabled
		});
	}

	private handleLabel() {
		if (this._icon.innerHTML !== undefined) {
			this._icon.classList.remove('dpad-btn-icon', 'fas', Ch5DpadButtonBase.DEFAULT_ICONS.center);
			this._icon.classList.add("dpad-btn-label");
			this._icon.innerHTML = this.label;
		}
	}

	private handleKey() {
		this.createIconTag();
		this.initializeParams(Ch5DpadButtonBase.DEFAULT_ICONS[this.key as TCh5DpadChildButtonType],
			this.key === 'center' ? '' : 'direction-btn',
			this.key as TCh5DpadChildButtonType);
	}

	private handleIconClass(prevValue: string) {
		this.createIconTag();
		if (this.iconUrl.length < 1) {
			if (this.iconClass.length > 0) {
				this._icon.classList.remove(this.CSS_CLASS_LIST.primaryIconClass);
				if (this.CSS_CLASS_LIST.defaultIconClass) {
					this._icon.classList.remove(this.CSS_CLASS_LIST.defaultIconClass);
				}
				this._icon.classList.remove(...(prevValue.split(' ').filter(element => element)));
				this._icon.classList.add(...(this.iconClass.split(' ').filter(element => element))); // the filter removes empty spaces
			} else {
				this._icon.classList.remove(...(prevValue.split(' ').filter(element => element)));
				this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
				if (Ch5Common.isNotNil(this.CSS_CLASS_LIST.defaultIconClass)) {
					this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
				}
			}
		}
	}

	private handleIconUrl(value: string) {
		this.createIconTag();
		if (this.iconUrl.length > 0) {
			this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
			this._icon.style.backgroundImage = `url(${value})`;
		} else {
			this._icon.classList.remove(this.CSS_CLASS_LIST.imageClassName);
		}
	}

	private handlePressed() {
		const stateDisabledHidden = this.getDisabledOrHiddenDpadCenterButton();
		if (stateDisabledHidden === false) {
			this.setDisabledOrHidden(stateDisabledHidden);
			if (this._pressable?._pressed !== this.pressed) {
				this._pressable?.setPressed(this.pressed);
			}
			} else {
				this._pressable?.setPressed(false);
				this.setDisabledOrHidden(stateDisabledHidden);
			}
	}

	private _subscribeToPressableIsPressed() {
		if (this._isPressedSubscription === null && this._pressable !== null) {
			const REPEAT_DIGITAL_PERIOD = 200;
			// const MAX_REPEAT_DIGITALS = 30000 / REPEAT_DIGITAL_PERIOD;
			this._isPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				this.logger.log(`Ch5DpadButton.pressableSubscriptionCb(${value})`);
				if (value === false) {
					if (this._repeatDigitalInterval !== null) {
						window.clearInterval(this._repeatDigitalInterval as number);
					}
					this.sendValueForRepeatDigitalWorking(false);
				} else {
					this.sendValueForRepeatDigitalWorking(true);
					if (this._repeatDigitalInterval !== null) {
						window.clearInterval(this._repeatDigitalInterval as number);
					}
					// let numRepeatDigitals = 0;
					this._repeatDigitalInterval = window.setInterval(() => {
						this.sendValueForRepeatDigitalWorking(true);
						// if (++numRepeatDigitals >= MAX_REPEAT_DIGITALS) {
						// 	console.warn("Ch5DpadButton MAXIMUM Repeat digitals sent");
						// 	window.clearInterval(this._repeatDigitalInterval as number);
						// 	// this.sendValueForRepeatDigitalWorking(false);
						// 	this.pressed = false;
						// }
					}, REPEAT_DIGITAL_PERIOD);
				}
			});
		}
	}

	private sendValueForRepeatDigitalWorking(value: boolean): void {
		this.logger.log(`Ch5Button.sendValueForRepeatDigital(${value})`);
		if (Ch5Common.isNotNil(this.sendEventOnClick)) {
			const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this.sendEventOnClick);

			if (clickSignal && clickSignal.name) {
				// send signal only once if it has the same value
				clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
				return;
			}
		}
	}

	private _unsubscribeFromPressableIsPressed() {
		if (this._repeatDigitalInterval !== null) {
			window.clearInterval(this._repeatDigitalInterval as number);
		}
		if (this._isPressedSubscription !== null) {
			this._isPressedSubscription.unsubscribe();
			this._isPressedSubscription = null;
		}
	}

	//#endregion

	//#region 5. Private Methods 

	/**
	 * Function to return an 'i' tag to be placed as icon for dpad child btn
	 * @returns HTMLElement, a 'i' tag
	 */
	private getIconContainer() {
		const outputElement = document.createElement('span');
		outputElement.classList.add('dpad-btn-icon');
		outputElement.classList.add('fas');
		return outputElement;
	}

	/**
	 * Function to return an 'span' tag to be placed as label for dpad child btn
	 * @param labelInput label instead of icon
	 * @returns HTMLElement, a 'span' tag
	 */
	private getLabelContainer(labelClassName: string) {
		const outputElement = document.createElement('span');
		outputElement.classList.add(labelClassName);
		return outputElement;
	}

	/**
	 * Function to return a 'span' tag to be placed as icon for dpad child btn
	 * @param imageUrl image url for icon
	 * @returns HTMLElement, a 'span' tag
	 */
	private getImageContainer(imageUrl: string) {
		const outputElement = document.createElement('span');
		outputElement.classList.add('dpad-btn-icon');
		outputElement.classList.add('image-url');
		outputElement.setAttribute('data-img-url', imageUrl);
		return outputElement;
	}

	//#endregion

}

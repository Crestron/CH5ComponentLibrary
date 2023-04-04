// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Subscription } from "rxjs";
import { Ch5ButtonPressInfo } from "../ch5-button/ch5-button-pressinfo";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";
import { normalizeEvent } from "../ch5-triggerview/utils";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadChildBaseAttributes } from "./interfaces/i-ch5-dpad-child-base-attributes";
import { TCh5DpadButtonClassListType, TCh5DpadChildButtonType, TCh5DpadConstructorParam } from "./interfaces/t-ch5-dpad";
import { Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { Ch5DpadButton } from "./ch5-dpad-button";

export class Ch5DpadChildBase extends Ch5Common implements ICh5DpadChildBaseAttributes {

	//#region 1. Variables

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
			valueOnAttributeEmpty: false,
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

	public readonly pressedCssClassPostfix = '--pressed';

	private readonly LABEL_CLASS: string = 'dpad-btn-label';

	//#region 1.2 protected variables
	public primaryCssClass = '';

	protected readonly TOUCH_TIMEOUT: number = 250;
	protected readonly DEBOUNCE_PRESS_TIME: number = 200;
	protected readonly PRESS_MOVE_THRESHOLD: number = 10;
	protected readonly STATE_CHANGE_TIMEOUTS: number = 500;

	protected readonly MAX_MODE_LENGTH: number = 99;
	protected readonly DEBOUNCE_BUTTON_DISPLAY: number = 25;

	protected COMPONENT_NAME: string = "";
	protected componentPrefix: string = 'ch5-dpad-button-';
	protected readonly CSS_CLASS_LIST: TCh5DpadButtonClassListType = {
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
	protected isTouch: boolean = false;
	protected allowPress: boolean = true;
	protected allowPressTimeout: number = 0;
	// The interval id ( from setInterval ) for reenforcing the  onTouch signal
	// This id allow canceling the interval.
	protected _intervalIdForRepeatDigital: number | null = null;
	// this is last tap time used to determine if should send click pulse in focus event
	protected _lastTapTime: number = 0;
	protected _pressable: Ch5Pressable | null = null;
	protected _pressTimeout: number = 0;
	protected _pressed: boolean = false;
	protected _buttonPressedInPressable: boolean = false;
	private _isPressedSubscription: Subscription | null = null;
	private _repeatDigitalInterval: number | null = null;

	protected _pressHorizontalStartingPoint: number | null = null;
	protected _pressVerticalStartingPoint: number | null = null;

	protected _pressInfo: Ch5ButtonPressInfo = {} as Ch5ButtonPressInfo;

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

	public constructor() {
		super();
		this.logger.start('constructor()', this.COMPONENT_NAME);
		this.ignoreAttributes = ["show", "disabled", "receivestateenable", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "receivestatecustomclass", "receivestatecustomstyle", "sendeventonshow"];
		this._ch5Properties = new Ch5Properties(this, Ch5DpadChildBase.COMPONENT_PROPERTIES);

		ComponentHelper.clearComponentContent(this);

		this._pressInfo = new Ch5ButtonPressInfo();

		this.logger.stop();
	}

	protected initializeParams(params: TCh5DpadConstructorParam) {
		this.buttonType = params.btnType;
		this.COMPONENT_NAME = this.componentPrefix + params.btnType;
		this.CSS_CLASS_LIST.primaryTagClass = params.btnType;
		this.CSS_CLASS_LIST.defaultIconClass = params.defaultIconClass;
		if (params.defaultArrowClass && params.defaultArrowClass !== "") {
			this.CSS_CLASS_LIST.defaultArrowClass = params.defaultArrowClass;
		}
		this.primaryCssClass = this.componentPrefix + params.btnType;
		this.updatePressedClass(this.primaryCssClass + this.pressedCssClassPostfix);
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

		if (!this.parentElement ||
			(this.parentElement && this.parentElement.nodeName.toLowerCase() === 'ch5-dpad')) {
			return;
		}

		if (this.parentElement && this.parentElement.parentElement &&
			!(this.parentElement.parentElement instanceof Ch5Dpad)) {
			throw new Error(`Invalid parent element for ch5-dpad-button-${this.buttonType}. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too.`);
		}

		this.setAttribute('data-ch5-id', this.getCrId());

		// init pressable before initAttributes because pressable subscribe to gestureable attribute
		if (!_.isNil(this._pressable)) {
			this._pressable.init();
			this._subscribeToPressableIsPressed();
		}

		this.createElementsAndInitialize();

		customElements.whenDefined('ch5-dpad-button').then(() => {
			this.initCommonMutationObserver(this);
		});

		this.logger.stop();
	}

	/**
	 * Function to create HTML elements of the components including child elements
	 */
	protected createElementsAndInitialize() {
		if (!this._wasInstatiated) {
			CH5DpadUtils.createIconTag(this);
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
		if (this.primaryCssClass && this.primaryCssClass !== "") {
			this.classList.add(this.primaryCssClass);
		}
		this.classList.add(this.CSS_CLASS_LIST.commonBtnClass);
		if (this.CSS_CLASS_LIST.primaryTagClass && this.CSS_CLASS_LIST.primaryTagClass !== "") {
			this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
		}
		if (this.CSS_CLASS_LIST.defaultArrowClass && this.CSS_CLASS_LIST.defaultArrowClass !== "") {
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
			if (this.CSS_CLASS_LIST.defaultIconClass && this.CSS_CLASS_LIST.defaultIconClass !== "") {
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

		// destroy pressable
		if (null !== this._pressable) {
			this._pressable.destroy();
		}
		this.unsubscribeFromSignals();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
		this.logger.stop();
	}

	public removeEventListeners() {
		this.removeEventListener('mousedown', this._onPressClick);
		this.removeEventListener('click', this._onTapAction);
		this.removeEventListener('mouseup', this._onMouseUp);
		this.removeEventListener('touchstart', this._onPress);
		this.removeEventListener('mouseleave', this._onLeave);
		this.removeEventListener('touchend', this._onPressUp);
		this.removeEventListener('touchmove', this._onTouchMove);
		this.removeEventListener('touchend', this._onTouchEnd);

		if (!_.isNil(this._pressable)) {
			this._unsubscribeFromPressableIsPressed();
		}
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
		for (let i: number = 0; i < Ch5DpadChildBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5DpadChildBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5DpadChildBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
		attr = attr.toLowerCase();
		if (oldValue === newValue) {
			return;
		}

		this.info('ch5-dpad-button' + this.buttonType + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
		if (oldValue !== newValue) {
			this.logger.log('ch5-dpad-child-base attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5DpadChildBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

		// below actions, set default value to the control's attribute if they dont exist, and assign them as a return value
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5DpadChildBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5DpadChildBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5DpadChildBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5DpadChildBase.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		const btnType = this.buttonType as TCh5DpadChildButtonType;
		if (this.parentElement &&
			this.parentElement.parentElement) {
			const ele = this.parentElement.parentElement;
			const parentContractName: string = ComponentHelper.getAttributeAsString(ele, 'contractname', '');
			const parentContractEvent: string = ComponentHelper.getAttributeAsString(ele, 'sendeventonclickstart', '');
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
	 * Called to attach proper listeners
	 */
	protected attachEventListeners() {
		super.attachEventListeners();

		this.addEventListener('click', this._onTapAction);
		this.addEventListener('mousedown', this._onPressClick);
		this.addEventListener('mouseup', this._onMouseUp);
		this.addEventListener('touchstart', this._onPress, { passive: true });
		this.addEventListener('mouseleave', this._onLeave);
		this.addEventListener('touchend', this._onPressUp);
		this.addEventListener('touchmove', this._onTouchMove);
		this.addEventListener('touchend', this._onTouchEnd);

		if (!_.isNil(this._pressable)) {
			this._pressable?.init();
			this._subscribeToPressableIsPressed();
		}
	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
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
			cssPressedClass: pressedClass
		});
	}

	protected sendValueForRepeatDigital(value: boolean): void {
		if (!this.sendEventOnClick) { return; }

		const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this.sendEventOnClick);

		if (clickSignal && clickSignal.name) {
			clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
		}
	}

	/**
	 * Sends the signal passed via sendEventOnClick
	 */
	protected _sendOnClickSignal(preventTrue: boolean = false, preventFalse: boolean = false): void {
		let sigClick: Ch5Signal<boolean> | null = null;
		if (this.sendEventOnClick) {
			sigClick = Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick);

			if (sigClick !== null) {
				if (!preventTrue) {
					this.sendValueForRepeatDigital(true);
				}
				if (!preventFalse) {
					this.sendValueForRepeatDigital(false);
				}
			}
		}
	}

	protected stopRepeatDigital() {
		this.logger.log("stopRepeatDigital", this._intervalIdForRepeatDigital);
		if (this._intervalIdForRepeatDigital) {
			window.clearInterval(this._intervalIdForRepeatDigital);
			this.sendValueForRepeatDigital(false);
			this._intervalIdForRepeatDigital = null;
			return;
		}
		this.sendValueForRepeatDigital(true);

		this._intervalIdForRepeatDigital = window.setInterval(() => {
			this.sendValueForRepeatDigital(true);
		}, this.TOUCH_TIMEOUT);
	}

	private handleLabel() {
		if (this._icon.innerHTML !== undefined) {
			this._icon.classList.remove('dpad-btn-icon', 'fas', Ch5DpadButton.DEFAULT_ICONS.center);
			this._icon.classList.add("dpad-btn-label");
			this._icon.innerHTML = this.label;
		}
	}

	private handleKey() {
		CH5DpadUtils.createIconTag(this);
		this.initializeParams({
			primaryTagClass: this.key as TCh5DpadChildButtonType,
			defaultIconClass: Ch5DpadButton.DEFAULT_ICONS[this.key as TCh5DpadChildButtonType],
			defaultArrowClass: this.key === 'center' ? '' : 'direction-btn',
			btnType: this.key as TCh5DpadChildButtonType
		});
	}

	private handleIconClass(prevValue: string) {
		CH5DpadUtils.createIconTag(this);
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
				if (this.CSS_CLASS_LIST.defaultIconClass && this.CSS_CLASS_LIST.defaultIconClass !== "") {
					this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
				}
			}
		}
	}

	private handleIconUrl(value: string) {
		CH5DpadUtils.createIconTag(this);
		if (this.iconUrl.length > 0) {
			this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
			this._icon.style.backgroundImage = `url(${value})`;
		} else {
			this._icon.classList.remove(this.CSS_CLASS_LIST.imageClassName);
		}
	}

	private handlePressed() {
		if (this._pressable) {
			if (this._pressable._pressed !== this.pressed) {
				this._pressable.setPressed(this.pressed);
			}
		}
	}

	/**
	 * Press Handler
	 *
	 * @return {Promise}
	 */
	protected pressHandler(): Promise<boolean> {
		const pressHandler = () => {
			this.logger.log("CH5DpadButton._onPress()");
			this._pressed = true;
		}

		const pressPromise = new Promise<boolean>((resolve, reject) => {
			this._pressTimeout = window.setTimeout(() => {
				pressHandler();
				resolve(this._pressed);
			}, this.TOUCH_TIMEOUT);
		});

		return pressPromise;
	}

	protected cancelPress() {
		window.clearTimeout(this._pressTimeout);
		this._pressed = false;
	}

	protected reactivatePress(): void {
		clearTimeout(this.allowPressTimeout);
		this.allowPressTimeout = setTimeout(() => {
			this.allowPress = true;
		}, this.DEBOUNCE_PRESS_TIME) as never as number;
	}

	protected isExceedingPressMoveThreshold(x1: number, y1: number, x2: number, y2: number) {
		const startingPoint: number = x2 - x1;
		const endingPoint: number = y2 - y1;
		const distance: number = Math.sqrt(startingPoint ** 2 + endingPoint ** 2);
		return distance > this.PRESS_MOVE_THRESHOLD;
	}

	private _subscribeToPressableIsPressed() {
		const REPEAT_DIGITAL_PERIOD = 200;
		const MAX_REPEAT_DIGITALS = 30000 / REPEAT_DIGITAL_PERIOD;
		if (this._isPressedSubscription === null && this._pressable !== null) {
			this._isPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
				this.info(`Ch5DpadButton.pressableSubscriptionCb(${value})`);
				if (value !== this._buttonPressedInPressable) {

					this._buttonPressedInPressable = value;
					if (value === false) {
						if (this._repeatDigitalInterval !== null) {
							window.clearInterval(this._repeatDigitalInterval as number);
						}
					} else {
						if (this._repeatDigitalInterval !== null) {
							window.clearInterval(this._repeatDigitalInterval as number);
						}
						let numRepeatDigitals = 0;
						this._repeatDigitalInterval = window.setInterval(() => {
							if (++numRepeatDigitals >= MAX_REPEAT_DIGITALS) {
								window.clearInterval(this._repeatDigitalInterval as number);
							}
						}, REPEAT_DIGITAL_PERIOD);
					}
				}
			});
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

	//#region 5. Events - event binding

	protected _onTapAction() {
		this.logger.start(this.COMPONENT_NAME, "- _onTapAction");
		if (null !== this._intervalIdForRepeatDigital) {
			window.clearInterval(this._intervalIdForRepeatDigital);
			this.sendValueForRepeatDigital(false);
			this._intervalIdForRepeatDigital = null;
		} else {
			this._sendOnClickSignal(false, false);
		}
		this.logger.stop();
	}

	protected async _onPressClick(event: MouseEvent) {
		this.logger.start(this.COMPONENT_NAME, "- _onPressClick");
		if (this.isTouch) {
			return;
		}

		clearTimeout(this.allowPressTimeout);
		await this.pressHandler();

		this._pressHorizontalStartingPoint = event.clientX;
		this._pressVerticalStartingPoint = event.clientY;

		this._lastTapTime = new Date().valueOf();

		if (!this.allowPress) {
			return;
		}

		this.allowPress = false;
		this.stopRepeatDigital();
		this.logger.stop();
	}

	protected _onMouseUp() {
		if (this.isTouch) {
			((btnObj) => {
				setTimeout(() => {
					if (btnObj._intervalIdForRepeatDigital != null) {
						clearTimeout(btnObj._intervalIdForRepeatDigital);
						btnObj._intervalIdForRepeatDigital = null;
					}
					btnObj.sendValueForRepeatDigital(false);
				}, 200);
			})(this);
			return;
		}

		this.cancelPress();
		this.reactivatePress();

		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		} else if (this._pressed) {
			// this._onTapAction();
		}

		const timeSinceLastPress = new Date().valueOf() - this._lastTapTime;
		if (this._lastTapTime && timeSinceLastPress < this.DEBOUNCE_PRESS_TIME) {
			// sometimes a both click and press can happen on iOS/iPadOS, don't publish both
			this.logger.log('Ch5Button debouncing duplicate press/hold and click ' + timeSinceLastPress);
		}
	}

	protected async _onPress(event: TouchEvent) {
		const normalizedEvent = normalizeEvent(event);
		this.isTouch = true;
		clearTimeout(this.allowPressTimeout);
		this._pressInfo.saveStart(
			normalizedEvent.x,
			normalizedEvent.y
		);
		await this.pressHandler();
		if (!this.allowPress) {
			return;
		}
		this.allowPress = false;
		this.stopRepeatDigital();
	}

	protected _onLeave() {
		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		}
	}

	protected _onPressUp(): void {
		window.clearTimeout(this._pressTimeout);
		this.reactivatePress();
		if (this._pressed) {
			this.logger.log("Ch5Button._onPressUp()");

			this._pressed = false;

			if (this._intervalIdForRepeatDigital) {
				window.clearInterval(this._intervalIdForRepeatDigital);
				this.sendValueForRepeatDigital(false);
				this._intervalIdForRepeatDigital = null;
			}
		}
	}

	protected _onTouchMove(event: TouchEvent) {
		// The event must be cancelable
		if (event.cancelable) {
			event.preventDefault();
		}
		const normalizedEvent = normalizeEvent(event);

		this._pressInfo.saveEnd(
			normalizedEvent.x,
			normalizedEvent.y
		);

		const validPress = this._pressInfo.valid();

		if (!validPress) {
			window.clearTimeout(this._pressTimeout);
			if (this._intervalIdForRepeatDigital !== null) {
				this.stopRepeatDigital();
			}
			return;
		}
	}

	protected _onTouchEnd(): void {
		if (this._intervalIdForRepeatDigital) {
			this.stopRepeatDigital();
		}
	}

	//#endregion

	//#region 6. Private Methods 

	/**
	 * Function to return an 'i' tag to be placed as icon for dpad child btn
	 * @param iconClass icon class for icon
	 * @returns HTMLElement, a 'i' tag
	 */
	private getIconContainer() {
		const retEle = document.createElement('span');
		retEle.classList.add('dpad-btn-icon');
		retEle.classList.add('fas');
		return retEle;
	}

	/**
	 * Function to return an 'span' tag to be placed as label for dpad child btn
	 * @param labelInput label instead of icon
	 * @returns HTMLElement, a 'span' tag
	 */
	private getLabelContainer(labelClassName: string) {
		const retEle = document.createElement('span');
		retEle.classList.add(labelClassName);
		return retEle;
	}

	/**
	 * Function to return a 'span' tag to be placed as icon for dpad child btn
	 * @param imageUrl image url for icon
	 * @returns HTMLElement, a 'span' tag
	 */
	private getImageContainer(imageUrl: string) {
		const retEle = document.createElement('span');
		retEle.classList.add('dpad-btn-icon');
		retEle.classList.add('image-url');
		retEle.setAttribute('data-img-url', imageUrl);
		return retEle;
	}

	//#endregion

}

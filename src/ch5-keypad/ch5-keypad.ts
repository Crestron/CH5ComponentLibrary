// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5KeypadButton } from "./ch5-keypad-btn";
import { ICh5KeypadAttributes } from "./interfaces/i-ch5-keypad-attributes";
import { TCh5KeypadButtonCreateDTO, TCh5KeypadShape, TCh5KeypadSize, TCh5KeypadStretch, TCh5KeypadTextOrientation, TCh5KeypadType } from "./interfaces/t-ch5-keypad";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from "../ch5-core";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import _ from "lodash";

export class Ch5Keypad extends Ch5Common implements ICh5KeypadAttributes {

	//#region 1. Variables

	//#region 1.1 readonly variables

	public static readonly ELEMENT_NAME = 'ch5-keypad';

	private static readonly NUMBER_TYPE_BUTTON_CSS_CLASS = 'number-btn';
	private static readonly MISC_ONE_BUTTON_CSS_CLASS = 'misc-btn misc-btn-one';
	private static readonly MISC_TWO_BUTTON_CSS_CLASS = 'misc-btn misc-btn-two';
	private static readonly EXTRA_BUTTON_CSS_CLASS = 'extra-btn special-center';

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateextrabuttonshow: { direction: "state", stringJoin: 1, contractName: true },
		receivestatehideasteriskbutton: { direction: "state", booleanJoin: 1, contractName: true },
		receivestatehidepoundbutton: { direction: "state", booleanJoin: 1, contractName: true },
		sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
		sendeventontouch: { direction: "event", booleanJoin: 1, contractName: true },
		sendeventonclickstart: { direction: "event", booleanJoin: 1, contractName: true }
	};

	public static readonly TYPES: TCh5KeypadType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	public static readonly SHAPES: TCh5KeypadShape[] = ['rounded-rectangle', 'square', 'circle'];

	public static readonly STRETCHES: TCh5KeypadStretch[] = ['both', 'width', 'height'];

	public static readonly TEXT_ORIENTATIONS: TCh5KeypadTextOrientation[] = ['top', 'right', 'bottom', 'left'];

	public static readonly SIZES: TCh5KeypadSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	public static readonly btnTypeClassPrefix: string = "--type-";
	public static readonly btnStretchClassPrefix: string = "--stretch-";
	public static readonly btnShapeClassPrefix: string = "--shape-";
	public static readonly btnTextOrientationClassPrefix: string = "--orientation-";
	public static readonly btnSizeClassPrefix: string = "--size-";

	/**
	 * COMPONENT_DATA is required for sass-schema generator file to build sufficient data
	 */
	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5Keypad.TYPES[0],
			values: Ch5Keypad.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: Ch5Keypad.btnTypeClassPrefix
		},
		STRETCHES: {
			default: null,
			values: Ch5Keypad.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: Ch5Keypad.btnStretchClassPrefix
		},
		SHAPES: {
			default: Ch5Keypad.SHAPES[0],
			values: Ch5Keypad.SHAPES,
			key: 'shape',
			attribute: 'shape',
			classListPrefix: Ch5Keypad.btnShapeClassPrefix
		},
		TEXT_ORIENTATIONS: {
			default: Ch5Keypad.TEXT_ORIENTATIONS[0],
			values: Ch5Keypad.TEXT_ORIENTATIONS,
			key: 'textorientation',
			attribute: 'textorientation',
			classListPrefix: Ch5Keypad.btnTextOrientationClassPrefix
		},
		SIZES: {
			default: Ch5Keypad.SIZES[0],
			values: Ch5Keypad.SIZES,
			key: 'size',
			attribute: 'size',
			classListPrefix: '--size-'
		},
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: Ch5Keypad.TYPES[0],
			enumeratedValues: Ch5Keypad.TYPES,
			name: "type",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Keypad.TYPES[0],
			isObservableProperty: true
		},
		{
			default: Ch5Keypad.SHAPES[0],
			enumeratedValues: Ch5Keypad.SHAPES,
			name: "shape",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Keypad.SHAPES[0],
			isObservableProperty: true
		},
		{
			default: Ch5Keypad.SIZES[0],
			enumeratedValues: Ch5Keypad.SIZES,
			name: "size",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Keypad.SIZES[0],
			isObservableProperty: true
		},
		{
			default: null,
			enumeratedValues: Ch5Keypad.STRETCHES,
			name: "stretch",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Keypad.STRETCHES[0],
			isObservableProperty: true,
			isNullable: true
		},
		{
			default: false,
			name: "showExtraButton",
			nameForSignal: "receiveStateExtraButtonShow",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateExtraButtonShow",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: Ch5Keypad.TEXT_ORIENTATIONS[0],
			enumeratedValues: Ch5Keypad.TEXT_ORIENTATIONS,
			name: "textOrientation",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Keypad.TEXT_ORIENTATIONS[0],
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForEnable",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForShow",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForCustomStyle",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForCustomClass",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: true,
			name: "useContractForExtraButtonShow",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "",
			name: "contractName",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnClickStart",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: false,
			name: "hidePoundButton",
			nameForSignal: "receiveStateHidePoundButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		},
		{
			default: false,
			name: "hideAsteriskButton",
			nameForSignal: "receiveStateHideAsteriskButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateHideAsteriskButton",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateHidePoundButton",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: false,
			name: "useContractForHideAsteriskButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForHidePoundButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
	];

	public readonly primaryCssClass = 'ch5-keypad';

	//#endregion

	//#region 1.2 private / protected variables

	// state specific vars
	private isResizeInProgress: boolean = false;
	private readonly resizeDebounce: number = 500;

	// elements specific vars
	private _ch5Properties: Ch5Properties;
	private container: HTMLElement = {} as HTMLElement;
	private containerClass: string = 'keypad-container';
	private keysRowClass: string = 'keypad-row';
	private keysRowClassExtra: string = 'keypad-row-extra';
	private childButtonList: { [key: string]: Ch5KeypadButton; } = {};
	private runtimeChildButtonList: { [key: string]: TCh5KeypadButtonCreateDTO; } = {};

	private signalNameOnContract = {
		contractName: "",
		receiveStateEnable: "",
		receiveStateShow: "",
		receiveStateCustomClass: "",
		receiveStateCustomStyle: ""
	}

	//#endregion

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5Keypad.ELEMENT_NAME, Ch5Keypad);
		}
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Keypad.ELEMENT_NAME, Ch5Keypad.SIGNAL_ATTRIBUTE_TYPES);
	}

	//#region Static Methods

	//#region 2. Setters and Getters
	public set contractName(value: string) {
		this._ch5Properties.set<string>("contractName", value, () => {
			this.contractDefaultHandler();
		});
	}
	public get contractName(): string {
		return this._ch5Properties.get<string>("contractName")?.trim();
	}

	public set type(value: TCh5KeypadType) {
		this._ch5Properties.set<TCh5KeypadType>("type", value, () => {
			this.typeHandler();
		});
	}
	public get type(): TCh5KeypadType {
		return this._ch5Properties.get<TCh5KeypadType>("type");
	}

	public set shape(value: TCh5KeypadShape) {
		this._ch5Properties.set<TCh5KeypadType>("shape", value, () => {
			this.shapeHandler();
		});
	}
	public get shape(): TCh5KeypadShape {
		return this._ch5Properties.get<TCh5KeypadShape>("shape");
	}

	public set stretch(value: TCh5KeypadStretch | null) {
		this._ch5Properties.set<TCh5KeypadStretch | null>("stretch", value, () => {
			this.stretchHandler();
		});
	}
	public get stretch(): TCh5KeypadStretch | null {
		return this._ch5Properties.get<TCh5KeypadStretch | null>("stretch");
	}

	public set size(value: TCh5KeypadSize) {
		this._ch5Properties.set<TCh5KeypadType>("size", value, () => {
			this.sizeHandler();
		});
	}
	public get size() {
		return this._ch5Properties.get<TCh5KeypadSize>("size");
	}

	public set textOrientation(value: TCh5KeypadTextOrientation) {
		this._ch5Properties.set<TCh5KeypadTextOrientation>("textOrientation", value, () => {
			this.textOrientationHandler();
		});
	}
	public get textOrientation(): TCh5KeypadTextOrientation {
		return this._ch5Properties.get<TCh5KeypadTextOrientation>("textOrientation");
	}

	public set showExtraButton(value: boolean) {
		this._ch5Properties.set<boolean>("showExtraButton", value, () => {
			if (!this.useContractForExtraButtonShow) {
				this.showExtraButtonHandler();
			}
		});
	}
	public get showExtraButton(): boolean {
		return this._ch5Properties.get<boolean>("showExtraButton");
	}

	public set sendEventOnClickStart(value: string) {
		this._ch5Properties.set<string>("sendEventOnClickStart", value, () => {
			this.updateEventClickHandlers(parseInt(value, 10));
		});
	}
	public get sendEventOnClickStart(): string {
		return this._ch5Properties.get<string>("sendEventOnClickStart");
	}

	public set useContractForEnable(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForEnable", value, () => {
			if (this.useContractForEnable === true && !_.isNil(this.contractName) && this.contractName !== "") {
				this.receiveStateEnable = this.contractName + '.Enable';
			} else {
				if (this.signalNameOnContract.receiveStateEnable.trim() === "" && this.receiveStateEnable === this.contractName + '.Enable') {
					this.clearBooleanSignalSubscription(this._receiveStateEnable, this._subKeySigReceiveEnable);
					this.setAttribute('receiveStateEnable', this.signalNameOnContract.receiveStateEnable.trim());
					this.disabled = false;
				} else {
					this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable.trim() || this.receiveStateEnable;
				}
			}
		});
	}
	public get useContractForEnable(): boolean {
		return this._ch5Properties.get<boolean>("useContractForEnable");
	}

	public set useContractForShow(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForShow", value, () => {
			if (this.useContractForShow === true && !_.isNil(this.contractName) && this.contractName !== "") {
				this.receiveStateShow = this.contractName + '.Show';
			} else {
				if (this.signalNameOnContract.receiveStateShow.trim() === "" && this.receiveStateShow === this.contractName + '.Show') {
					this.clearBooleanSignalSubscription(this._receiveStateShow, this._subKeySigReceiveShow);
					this.setAttribute('receiveStateShow', this.signalNameOnContract.receiveStateShow.trim());
					this.show = true;
				} else {
					this.receiveStateShow = this.signalNameOnContract.receiveStateShow.trim() || this.receiveStateShow;
				}
			}
		});
	}
	public get useContractForShow(): boolean {
		return this._ch5Properties.get<boolean>("useContractForShow");
	}

	public set useContractForCustomStyle(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
			this.contractDefaultHelper();
		});
	}
	public get useContractForCustomStyle(): boolean {
		return this._ch5Properties.get<boolean>("useContractForCustomStyle");
	}

	public set useContractForCustomClass(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
			this.contractDefaultHelper();
		});
	}
	public get useContractForCustomClass(): boolean {
		return this._ch5Properties.get<boolean>("useContractForCustomClass");
	}

	public set useContractForExtraButtonShow(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForExtraButtonShow", value, () => {
			this.contractDefaultHelper();
		});
	}
	public get useContractForExtraButtonShow(): boolean {
		return this._ch5Properties.get<boolean>("useContractForExtraButtonShow");
	}

	public set receiveStateExtraButtonShow(value: string) {
		this._ch5Properties.set("receiveStateExtraButtonShow", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("showExtraButton", newValue, () => {
				this.showExtraButtonHandler();
			});
		});
	}
	public get receiveStateExtraButtonShow(): string {
		return this._ch5Properties.get<string>("receiveStateExtraButtonShow");
	}

	public set hidePoundButton(value: boolean) {
		this._ch5Properties.set<boolean>("hidePoundButton", value, () => {
			this.handleHidePoundButton();
		});
	}
	public get hidePoundButton(): boolean {
		return this._ch5Properties.get<boolean>("hidePoundButton");
	}

	public set hideAsteriskButton(value: boolean) {
		this._ch5Properties.set<boolean>("hideAsteriskButton", value, () => {
			this.handleHideAsteriskButton();
		});
	}
	public get hideAsteriskButton(): boolean {
		return this._ch5Properties.get<boolean>("hideAsteriskButton");
	}

	public set receiveStateHideAsteriskButton(value: string) {
		this._ch5Properties.set("receiveStateHideAsteriskButton", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("hideAsteriskButton", newValue, () => {
				this.handleHideAsteriskButton();
			});
		});
	}
	public get receiveStateHideAsteriskButton(): string {
		return this._ch5Properties.get<string>('receiveStateHideAsteriskButton');
	}

	public set receiveStateHidePoundButton(value: string) {
		this._ch5Properties.set("receiveStateHidePoundButton", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("hidePoundButton", newValue, () => {
				this.handleHidePoundButton();
			});
		});
	}
	public get receiveStateHidePoundButton(): string {
		return this._ch5Properties.get<string>('receiveStateHidePoundButton');
	}

	public set useContractForHidePoundButton(value: boolean) {
		this._ch5Properties.set<string>("useContractForHidePoundButton", value, () => {
			const contractName = this.contractName;
			if (contractName.length > 0) {
				if (this.useContractForHidePoundButton === true) {
					this.receiveStateHidePoundButton = contractName + '.HidePoundButton';
				}
			}
		});
	}
	public get useContractForHidePoundButton(): boolean {
		return this._ch5Properties.get<boolean>("useContractForHidePoundButton");
	}

	public set useContractForHideAsteriskButton(value: boolean) {
		this._ch5Properties.set<string>("useContractForHideAsteriskButton", value, () => {
			const contractName = this.contractName;
			if (contractName.length > 0) {
				if (this.useContractForHideAsteriskButton === true) {
					this.receiveStateHideAsteriskButton = contractName + '.HideAsteriskButton';
				}
			}
		});
	}
	public get useContractForHideAsteriskButton(): boolean {
		return this._ch5Properties.get<boolean>("useContractForHideAsteriskButton");
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5Keypad.ELEMENT_NAME);
		this._ch5Properties = new Ch5Properties(this, Ch5Keypad.COMPONENT_PROPERTIES);
		this.logger.stop();
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", Ch5Keypad.ELEMENT_NAME);
		super.initAttributes();
		this.setAttribute('data-ch5-id', this.getCrId());
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5Keypad.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Keypad.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Keypad.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Keypad.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				} else {
					const key = Ch5Keypad.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = Ch5Keypad.COMPONENT_PROPERTIES[i].default;
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
		this.logger.start('connectedCallback() - start', Ch5Keypad.ELEMENT_NAME);

		// set attributes based on onload attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Keypad);
		}
		// build child elements ref object
		this.buildRuntimeChildButtonList();
		ComponentHelper.clearComponentContent(this);
		this.onAllSubElementsCreated();
		subscribeInViewPortChange(this, () => {
			if (this.elementIsInViewPort) {
				this.stretchHandler();
			}
		});
		this.initCommonMutationObserver(this);
		this.logger.stop();
	}

	/**
	 * Create and bind events for Keypad once all the expected child elements are defined and ready for consumption
	 */
	private onAllSubElementsCreated() {
		this.logger.start('onAllSubElementsCreated() - start', Ch5Keypad.ELEMENT_NAME);
		customElements.whenDefined('ch5-keypad').then(() => {
			if (!this._wasInstatiated) {
				this.createHtmlElements();
			}
			this._wasInstatiated = true;

			// update class based on the current type chosen
			this.updateCssClasses();
			this.attachEventListeners();
			this.initAttributes();
			// required post initial setup
			this.stretchHandler();
		});
		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 */
	public disconnectedCallback() {
		this.logger.log("disconnectedCallback");
		this.removeEvents();
		this.unsubscribeFromSignals();
		unSubscribeInViewPortChange(this);
		if (this.container && this.container.style) {
			this.container.style.removeProperty('height');
			this.container.style.removeProperty('width');
		}

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}

	private removeEvents() {
		super.removeEventListeners();
		window.removeEventListener('resize', this.onWindowResizeHandler);
	}

	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Keypad.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Keypad.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Keypad.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", Ch5Keypad.ELEMENT_NAME);
		if (oldValue !== newValue) {
			this.logger.log('ch5-keypad attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5Keypad.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

	protected updateCssClasses(): void {
		super.updateCssClasses();

		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTypeClassPrefix + this.type);

		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnShapeClassPrefix + this.shape);

		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTextOrientationClassPrefix + this.textOrientation);

		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnSizeClassPrefix + this.size);

		if (!!this.stretch && this.stretch.length > 0) { // checking for length since it does not have a default value
			this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnStretchClassPrefix + this.stretch);
		}

		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTypeClassPrefix + (this.showExtraButton ? "extra-row-show" : "extra-row-hide"));
	}

	protected attachEventListeners() {
		super.attachEventListeners();
		window.addEventListener('resize', this.onWindowResizeHandler.bind(this));
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Create all the elements required under the parent Keypad tag
	 */
	protected createHtmlElements(): void {
		this.logger.start('createHtmlElements', Ch5Keypad.ELEMENT_NAME);
		this.classList.add(this.primaryCssClass);
		this.createAndAppendAllButtonsUnderKeypad();
		this.logger.stop();
	}

	/**
	 * Add all 13 buttons in the expected order if not added in the DOM
	 */
	private createAndAppendAllButtonsUnderKeypad() {
		// remove all child elements, since it will be created again in the right/expected order
		const childItems: Element[] = Array.from(this.children);
		for (const item of childItems) {
			item.remove();
		}
		this.createEmptyContainerDiv();
		const data: TCh5KeypadButtonCreateDTO[] =
			this.getBtnList(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
		let rowEle = this.appendKeysRowToContainer();
		for (let i = 0; i < data.length; i++) {
			if (i % 3 === 0) {
				rowEle = this.appendKeysRowToContainer();
				this.container.appendChild(rowEle);
			}
			const btn = data[i];
			const keyBtn = new Ch5KeypadButton(btn);
			this.childButtonList[btn.name] = keyBtn;
			rowEle.appendChild(keyBtn);
		}
		if (this.useContractForExtraButtonShow || this.showExtraButton) {
			this.showExtraButtonHandler();
		}
		this.contractDefaultHandler();
		this.handleHideAsteriskButton();
		this.handleHidePoundButton();
	}

	/**
	 * Create the container div which holds all the 13 buttons within keypad
	 */
	private createEmptyContainerDiv() {
		if (ComponentHelper.isNullOrUndefined(this.container) ||
			ComponentHelper.isNullOrUndefined(this.container.classList) ||
			this.container.classList.length === 0) {
			this.container = document.createElement('div');
			this.container.classList.add(this.containerClass);
		}
		if (this.container.parentElement !== this) {
			this.appendChild(this.container);
		}
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
	}

	/**
	 * Add the extra row of buttons if contract or attribute permits
	 */
	private showExtraButtonHandler() {
		this.logger.start(Ch5Keypad.ELEMENT_NAME + ' > showExtraButtonHandler');
		this.updateCssClasses();
		// check if the row already exists, if yes then remove it and build again
		const extraRow = this.getElementsByClassName(this.keysRowClassExtra);
		if (extraRow.length > 0) {
			Array.from(extraRow).forEach((row) => {
				row.remove();
			});
		}

		const doesContractPermit = (this.contractName.trim().length > 0 && this.useContractForExtraButtonShow);

		if ((doesContractPermit || (!doesContractPermit && this.showExtraButton)) &&
			(!!this.container.classList &&
				this.container.classList.contains(this.containerClass))) {
			if (this.contractName.trim() === ".") {
				return;
			}
			this.classList.add('ch5-keypad--for-extra-button');
			const rowEle = this.appendKeysRowToContainer();
			this.container.appendChild(rowEle);

			rowEle.classList.add(this.keysRowClassExtra);
			const extraBtns: TCh5KeypadButtonCreateDTO[] =
				this.getBtnList_Extra(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
			for (const btn of extraBtns) {
				const keyBtn = new Ch5KeypadButton(btn);
				this.childButtonList[btn.name] = keyBtn;
				rowEle.appendChild(keyBtn);
			}
		} else {
			this.classList.remove('ch5-keypad--for-extra-button');
		}
		this.logger.stop();
	}

	private appendKeysRowToContainer() {
		const divEle = document.createElement('section');
		divEle.classList.add(this.keysRowClass);
		return divEle;
	}

	private buildRuntimeChildButtonList() {
		const childElements: Element[] = Array.from(this.children);
		if (childElements.length > 0) {
			for (const ele of childElements) {
				if (ele.tagName.toLowerCase() === 'ch5-keypad-button') {
					const item = this.getChildBtnDTOFromElement(ele, this.contractName, this.sendEventOnClickStart);
					if (!this.runtimeChildButtonList.hasOwnProperty(item.name)) {
						this.runtimeChildButtonList[item.name] = item;
					}
				}
			}
		}
	}

	private shapeHandler() {
		this.logger.start(Ch5Keypad.ELEMENT_NAME + ' > shapeHandler');
		for (const typeVal of Ch5Keypad.SHAPES) {
			this.classList.remove(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnShapeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnShapeClassPrefix + this.shape);
		this.logger.stop();
	}

	private setContainerHeightAndWidth(height: number, width: number) {
		this.container.style.height = height + 'px';
		this.container.style.width = width + 'px';
	}

	private stretchHandler() {
		this.logger.start(Ch5Keypad.ELEMENT_NAME + ' > stretchHandler');
		for (const typeVal of Ch5Keypad.STRETCHES) {
			this.classList.remove(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnStretchClassPrefix + typeVal);
		}
		if (!!this.stretch && this.stretch.length > 0) {
			this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnStretchClassPrefix + this.stretch);
		}
		if (!!this.container.classList &&
			this.container.classList.contains(this.containerClass)) {
			if (!!this.stretch && this.stretch.length > 0) {
				const doesContractPermit = (this.contractName.length > 0 && this.useContractForExtraButtonShow);
				const rowCount = (doesContractPermit || (!doesContractPermit && this.showExtraButton)) ? 5 : 4;
				const colCount = 3;

				const requiredCellHeight: number = this.offsetHeight / rowCount;
				const requiredCellWidth: number = this.offsetWidth / colCount;

				const buttonGap: number = 6;
				if (!this.parentElement) {
					const cellDimensionToRender: number = Math.min(requiredCellHeight, requiredCellWidth);
					this.setContainerHeightAndWidth(cellDimensionToRender * rowCount, cellDimensionToRender * colCount);
					return this.logger.stop();
				}
				const { offsetHeight: parentHeight, offsetWidth: parentWidth } = this.parentElement;
				if (this.stretch === 'width' || (this.stretch === 'both' && parentWidth <= parentHeight)) {
					let buttonSize: number = Math.floor((parentWidth - (colCount + 1) * buttonGap) / colCount);
					while (buttonSize * rowCount + (rowCount + 1) * buttonGap > parentHeight)
						buttonSize--;
					this.setContainerHeightAndWidth(buttonSize * rowCount + (rowCount + 1) * buttonGap, buttonSize * colCount + (colCount + 1) * buttonGap);
				} else if (this.stretch === 'height' || (this.stretch === 'both' && parentHeight < parentWidth)) {
					let buttonSize: number = Math.floor((parentHeight - (rowCount + 1) * buttonGap) / rowCount);
					while (buttonSize * colCount + (colCount + 1) * buttonGap > parentWidth)
						buttonSize--;
					this.setContainerHeightAndWidth(buttonSize * rowCount + (rowCount + 1) * buttonGap, buttonSize * colCount + (colCount + 1) * buttonGap);
				}
			} else {
				this.container.style.removeProperty('height');
				this.container.style.removeProperty('width');
			}
		}
		this.logger.stop();
	}

	private typeHandler() {
		for (const typeVal of Ch5Keypad.TYPES) {
			this.classList.remove(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTypeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTypeClassPrefix + this.type);
	}

	private textOrientationHandler() {
		for (const typeVal of Ch5Keypad.TEXT_ORIENTATIONS) {
			this.classList.remove(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTextOrientationClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnTextOrientationClassPrefix + this.textOrientation);
	}

	private updateEventClickHandlers(startIndex: number) {
		let joinIndex = 0;
		if (this.contractName.length === 0) {
			for (const key in this.childButtonList) {
				if (this.childButtonList.hasOwnProperty(key)) {
					const btn = this.childButtonList[key];
					btn.setJoinBasedEventHandler(startIndex, joinIndex);
					joinIndex++;
				}
			}
		}
	}

	private sizeHandler() {
		for (const typeVal of Ch5Keypad.SIZES) {
			this.classList.remove(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnSizeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.ELEMENT_NAME + Ch5Keypad.btnSizeClassPrefix + this.size);
	}

	private contractDefaultHandler() {
		if (this.contractName.length === 0) {
			this.signalNameOnContract.contractName = "";
			this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
			this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
			this.receiveStateCustomStyle = this.signalNameOnContract.receiveStateCustomStyle;
			this.receiveStateCustomClass = this.signalNameOnContract.receiveStateCustomClass;
		} else if (this.signalNameOnContract.contractName === "") {
			this.signalNameOnContract.contractName = this.contractName;
			this.signalNameOnContract.receiveStateShow = this.receiveStateShow;
			this.signalNameOnContract.receiveStateEnable = this.receiveStateEnable;
			this.signalNameOnContract.receiveStateCustomStyle = this.receiveStateCustomStyle;
			this.signalNameOnContract.receiveStateCustomClass = this.receiveStateCustomClass;
		}
		this.contractDefaultHelper();
		this.updateContractBasedEvent();
	}

	private contractDefaultHelper() {
		if (!_.isNil(this.contractName) && this.contractName !== "") {
			if (this.useContractForCustomStyle === true) {
				this.receiveStateCustomStyle = this.contractName + '.CustomStyle';
			}

			if (this.useContractForCustomClass === true) {
				this.receiveStateCustomClass = this.contractName + '.CustomClass';
			}

			if (this.useContractForEnable === true) {
				this.receiveStateEnable = this.contractName + '.Enable';
			}

			if (this.useContractForShow === true) {
				this.receiveStateShow = this.contractName + '.Show';
			}

			if (this.useContractForHideAsteriskButton === true) {
				this.receiveStateHideAsteriskButton = this.contractName + '.HideAsteriskButton';
			}

			if (this.useContractForHidePoundButton === true) {
				this.receiveStateHidePoundButton = this.contractName + '.HidePoundButton';
			}

			if (this.useContractForExtraButtonShow === true) {
				this.showExtraButtonHandler();
			}
		}
	}

	private updateContractBasedEvent() {
		let joinIndex = 0;
		if (this.contractName.length > 0) {
			for (const key in this.childButtonList) {
				if (this.childButtonList.hasOwnProperty(key)) {
					const btn = this.childButtonList[key];
					btn.setJoinBasedContractEventHandler(this.contractName, joinIndex);
					joinIndex++;
				}
			}
		}
	}

	/**
	 * Handle the resize event for keypad to be redrawn if required
	 */
	private onWindowResizeHandler() {
		// since stretch has no default value, should fire stretchHandler only if required
		if (!!this.stretch && this.stretch.length > 0 && !this.isResizeInProgress) {
			this.isResizeInProgress = true;
			setTimeout(() => {
				this.stretchHandler();
				this.isResizeInProgress = false; // reset debounce once completed
			}, this.resizeDebounce);
		}
	}

	/**
	 * Generate a list of child button DTOs to create and render buttons
	 * @returns list of buttons
	 */
	public getBtnList(
		runtimeChildButtonList: { [key: string]: TCh5KeypadButtonCreateDTO; },
		parentContractName: string,
		sendEventOnClickStartVal: string
	): TCh5KeypadButtonCreateDTO[] {
		// populate by merging existing controls
		const retArr: TCh5KeypadButtonCreateDTO[] = [];
		const majors: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
		const minors: string[] = ['&nbsp;', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '+', ''];
		const contractList: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Star', '0', 'Hash'];
		const joinCountList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11]; // STAR is 10, ZERO is 9, when it comes to serial joins
		const classNameList: string[] = ['', '', '', '', '', '', '', '', '', Ch5Keypad.MISC_ONE_BUTTON_CSS_CLASS, '', Ch5Keypad.MISC_TWO_BUTTON_CSS_CLASS];

		for (let i = 0; i < majors.length; i++) {
			const name = 'button' + contractList[i];
			let toMerge = {};
			if (runtimeChildButtonList.hasOwnProperty(name)) {
				toMerge = runtimeChildButtonList[name];
			}
			const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[i]) : '';
			const className = classNameList[i].length > 0 ? classNameList[i] : Ch5Keypad.NUMBER_TYPE_BUTTON_CSS_CLASS;
			const joinCount = (contractName.length === 0 && sendEventOnClickStartVal.length > 0) ?
				parseInt(sendEventOnClickStartVal, 10) + joinCountList[i] : sendEventOnClickStartVal;
			const obj: TCh5KeypadButtonCreateDTO = {
				indexRef: i,
				name,
				major: majors[i],
				minor: minors[i],
				className,
				iconClass: [],
				contractName,
				contractKey: contractList[i],
				joinCountToAdd: joinCount.toString(),
				key: '',
				pressed: false,
				...toMerge
			};

			// If none major and minor are set, use default values
			if (!obj.major && !obj.minor) {
				obj.major = majors[i];
				obj.minor = minors[i];
			}

			retArr.push(obj);
		}
		return retArr;
	}

	/**
	 * Generate a list of child button DTOs to create and render buttons
	 * @returns list of buttons
	 */
	public getBtnList_Extra(
		runtimeChildButtonList: { [key: string]: TCh5KeypadButtonCreateDTO; },
		parentContractName: string,
		sendEventOnClickStartVal: string = ''
	): TCh5KeypadButtonCreateDTO[] {
		// populate by merging existing controls
		// DEV NOTE: below set of commented variables allow two extra buttons as part of the 5th row, if required
		// const nameList: string[] = ['left', 'center', 'right'];
		// const contractList: string[] = ['Star', 'ExtraButton', 'Hash'];
		// const classNameList: string[] = ['extra-btn empty-btn', 'extra-btn special-center', 'extra-btn empty-btn'];
		const retArr: TCh5KeypadButtonCreateDTO[] = [];
		const nameList: string[] = ['Extra'];
		const contractList: string[] = ['ExtraButton'];
		const classNameList: string[] = [Ch5Keypad.EXTRA_BUTTON_CSS_CLASS];
		const joinIndex: number = 12;
		for (let i = 0; i < nameList.length; i++) {
			const name: string = 'button' + contractList[i];
			let toMerge = {};
			if (runtimeChildButtonList.hasOwnProperty(name)) {
				toMerge = runtimeChildButtonList[name];
			}
			const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[i]) : '';
			const joinCount = (sendEventOnClickStartVal.length > 0) ?
				parseInt(sendEventOnClickStartVal, 10) + joinIndex : sendEventOnClickStartVal;
			const obj: TCh5KeypadButtonCreateDTO = {
				indexRef: joinIndex,
				name,
				major: '',
				minor: '',
				className: classNameList[i],
				iconClass: ['fas', 'fa-phone-alt'],
				contractName,
				contractKey: contractList[i],
				joinCountToAdd: joinCount.toString(),
				key: '',
				pressed: false,
				...toMerge
			};
			retArr.push(obj);
		}
		if (retArr[0].iconClass.length === 0) {
			retArr[0].iconClass = ['fas', 'fa-phone-alt'];
		}
		return retArr;
	}

	public getChildBtnDTOFromElement(ele: Element, parentContractName: string, sendEventOnClickStart: string): TCh5KeypadButtonCreateDTO {
		let obj: TCh5KeypadButtonCreateDTO = {} as TCh5KeypadButtonCreateDTO;
		const key = ele.getAttribute('key');
		const index = (!!key && key.length > 0) ? key.replace('button', '') : null;
		if (index !== null) {
			const contractList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Star', 'Hash', 'ExtraButton'];
			const indexRef = this.getIndexRefForChildBtn(index);
			const contractName = parentContractName.length > 0 ? (parentContractName + '.Press' + contractList[indexRef]) : '';
			const major = ele.getAttribute('labelmajor');
			const minor = ele.getAttribute('labelminor');
			const className = this.getClassNameForChildBtn(ele.getAttribute('classlist'), indexRef);
			const iconClass = ele.getAttribute('iconclass');
			const contractKey = contractList[indexRef];
			const pressed = ele.hasAttribute('pressed') && ele.getAttribute('pressed') !== "false";
			const joinCountToAdd = (contractName.length === 0 && sendEventOnClickStart.length > 0) ?
				parseInt(sendEventOnClickStart, 10) + indexRef : '';

			let extraAttributes = {};
			// tslint:disable-next-line:prefer-for-of
			for (let attrIndex = 0; attrIndex < ele.attributes.length; attrIndex++) {
				const attribute = ele.attributes[attrIndex];
				extraAttributes = {
					...extraAttributes,
					[attribute.nodeName]: attribute.nodeValue
				}
			}

			obj = {
				...extraAttributes,
				indexRef,
				name: 'button' + contractKey,
				major: !!major ? major : '',
				minor: !!minor ? minor : '',
				className,
				iconClass: !!iconClass ? iconClass.split(' ').filter(element => element) : [], // the filter removes empty spaces
				contractName,
				contractKey,
				joinCountToAdd: joinCountToAdd.toString(),
				key: !!key ? key : '',
				pressed: pressed === true,
			}
		}
		return obj;
	}

	private getIndexRefForChildBtn(str: string) {
		let ret: number = -1;
		switch (str.toLowerCase()) {
			case 'star':
				ret = 10;
				break;
			case 'hash':
				ret = 11;
				break;
			case 'extra':
				ret = 12;
				break;
			default:
				ret = parseInt(str, 10);
				break;
		}
		return ret;
	}

	private getClassNameForChildBtn(existingClassList: string | null, index: number) {
		const ret = !!existingClassList ? [existingClassList] : [];
		if (index > -1 && index < 9 || index === 10) {
			ret.push(Ch5Keypad.NUMBER_TYPE_BUTTON_CSS_CLASS);
		} else if (index === 9) {
			ret.push(Ch5Keypad.MISC_ONE_BUTTON_CSS_CLASS);
		} else if (index === 11) {
			ret.push(Ch5Keypad.MISC_TWO_BUTTON_CSS_CLASS);
		} else if (index === 12) {
			ret.push(Ch5Keypad.EXTRA_BUTTON_CSS_CLASS);
		}
		return ret.join(' ');
	}

	private handleHidePoundButton() {
		const centerBtn = this.querySelector('.keypad-btn.misc-btn-one');
		centerBtn?.classList.remove('ch5-hide-vis');
		if (this.hidePoundButton) {
			centerBtn?.classList.add('ch5-hide-vis');
		}
	}
	private handleHideAsteriskButton() {
		const centerBtn = this.querySelector('.keypad-btn.misc-btn-two');
		centerBtn?.classList.remove('ch5-hide-vis');
		if (this.hideAsteriskButton) {
			centerBtn?.classList.add('ch5-hide-vis');
		}
	}
	//#endregion

}

Ch5Keypad.registerSignalAttributeTypes();
Ch5Keypad.registerCustomElement();
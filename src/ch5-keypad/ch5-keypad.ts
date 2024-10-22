// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5KeypadButton } from "./ch5-keypad-btn";
import { ICh5KeypadAttributes } from "./interfaces/i-ch5-keypad-attributes";
import { TCh5KeypadShape, TCh5KeypadSize, TCh5KeypadStretch, TCh5KeypadTextOrientation, TCh5KeypadType } from "./interfaces/t-ch5-keypad";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { CH5KeypadUtils } from "./ch5-keypad-utils";
import { resizeObserver } from "../ch5-core/resize-observer";


export class Ch5Keypad extends Ch5Common implements ICh5KeypadAttributes {

	//#region 1. Variables

	public static readonly ELEMENT_NAME = 'ch5-keypad';

	private static readonly TOTAL_KEYPAD_BUTTONS = 13;

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateextrabuttonshow: { direction: "state", booleanJoin: 1, contractName: true },
		receivestatehideasteriskbutton: { direction: "state", booleanJoin: 1, contractName: true },
		receivestatehidepoundbutton: { direction: "state", booleanJoin: 1, contractName: true },
		sendeventonclickstart: { direction: "event", booleanJoin: 1, contractName: true }
	};

	public static readonly TYPES: TCh5KeypadType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	public static readonly SHAPES: TCh5KeypadShape[] = ['rounded-rectangle', 'square', 'circle'];

	public static readonly STRETCHES: TCh5KeypadStretch[] = ['both', 'width', 'height'];

	public static readonly TEXT_ORIENTATIONS: TCh5KeypadTextOrientation[] = ['top', 'right', 'bottom', 'left'];

	public static readonly SIZES: TCh5KeypadSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	/**
	 * COMPONENT_DATA is required for sass-schema generator file to build sufficient data
	 */
	public static readonly COMPONENT_DATA: any = {
		TYPE: {
			default: Ch5Keypad.TYPES[0],
			values: Ch5Keypad.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: "--type-"
		},
		STRETCH: {
			default: null,
			values: Ch5Keypad.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: "--stretch-"
		},
		SHAPE: {
			default: Ch5Keypad.SHAPES[0],
			values: Ch5Keypad.SHAPES,
			key: 'shape',
			attribute: 'shape',
			classListPrefix: "--shape-"
		},
		TEXT_ORIENTATION: {
			default: Ch5Keypad.TEXT_ORIENTATIONS[0],
			values: Ch5Keypad.TEXT_ORIENTATIONS,
			key: 'textOrientation',
			attribute: 'textOrientation',
			classListPrefix: "--orientation-"
		},
		SIZE: {
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
			default: false,
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
		{
			default: false,
			name: "displayLabelMajorOnly",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: false,
			isObservableProperty: true
		}
	];

	public readonly primaryCssClass = 'ch5-keypad';
	public readonly displayLabelMajorOnlyCssClass = '--display-label-major-only-'

	// private members
	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;

	private keypadButtons = new Array(Ch5Keypad.TOTAL_KEYPAD_BUTTONS).fill(null);

	private signalNameOnContract = {
		contractName: "",
		receiveStateEnable: "",
		receiveStateShow: "",
		receiveStateCustomClass: "",
		receiveStateCustomStyle: "",
		receiveStateExtraButtonShow: "",
		receiveStateHideAsteriskButton: "",
		receiveStateHidePoundButton: ""
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
			this.debounceContract();
		});
	}
	public get contractName(): string {
		return this._ch5Properties.get<string>("contractName")?.trim();
	}

	public set type(value: TCh5KeypadType) {
		this._ch5Properties.set<TCh5KeypadType>("type", value, () => {
			this.handleType();
		});
	}
	public get type(): TCh5KeypadType {
		return this._ch5Properties.get<TCh5KeypadType>("type");
	}

	public set shape(value: TCh5KeypadShape) {
		this._ch5Properties.set<TCh5KeypadType>("shape", value, () => {
			this.handleShape();
		});
	}
	public get shape(): TCh5KeypadShape {
		return this._ch5Properties.get<TCh5KeypadShape>("shape");
	}

	public set stretch(value: TCh5KeypadStretch | null) {
		this._ch5Properties.set<TCh5KeypadStretch | null>("stretch", value, () => {
			this.handleStretch();
		});
	}
	public get stretch(): TCh5KeypadStretch | null {
		return this._ch5Properties.get<TCh5KeypadStretch | null>("stretch");
	}

	public set size(value: TCh5KeypadSize) {
		this._ch5Properties.set<TCh5KeypadType>("size", value, () => {
			this.handleSize();
		});
	}
	public get size() {
		return this._ch5Properties.get<TCh5KeypadSize>("size");
	}

	public set textOrientation(value: TCh5KeypadTextOrientation) {
		this._ch5Properties.set<TCh5KeypadTextOrientation>("textOrientation", value, () => {
			this.handleTextOrientation();
		});
	}
	public get textOrientation(): TCh5KeypadTextOrientation {
		return this._ch5Properties.get<TCh5KeypadTextOrientation>("textOrientation");
	}

	public set showExtraButton(value: boolean) {
		this._ch5Properties.set<boolean>("showExtraButton", value, () => {
			this.handleShowExtraButton();
		});
	}
	public get showExtraButton(): boolean {
		return this._ch5Properties.get<boolean>("showExtraButton");
	}

	public set sendEventOnClickStart(value: string) {
		this._ch5Properties.set<string>("sendEventOnClickStart", value, () => {
			this.handleSendEventOnClickStart();
		});
	}
	public get sendEventOnClickStart(): string {
		return this._ch5Properties.get<string>("sendEventOnClickStart");
	}

	public set useContractForEnable(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForEnable", value, () => {
			this.debounceContract();
		});
	}
	public get useContractForEnable(): boolean {
		return this._ch5Properties.get<boolean>("useContractForEnable");
	}

	public set useContractForShow(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForShow", value, () => {
			this.debounceContract();
		});
	}
	public get useContractForShow(): boolean {
		return this._ch5Properties.get<boolean>("useContractForShow");
	}

	public set useContractForCustomStyle(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
			this.debounceContract();
		});
	}
	public get useContractForCustomStyle(): boolean {
		return this._ch5Properties.get<boolean>("useContractForCustomStyle");
	}

	public set useContractForCustomClass(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
			this.debounceContract();
		});
	}
	public get useContractForCustomClass(): boolean {
		return this._ch5Properties.get<boolean>("useContractForCustomClass");
	}

	public set useContractForExtraButtonShow(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForExtraButtonShow", value, () => {
			this.debounceContract();
		});
	}
	public get useContractForExtraButtonShow(): boolean {
		return this._ch5Properties.get<boolean>("useContractForExtraButtonShow");
	}

	public set receiveStateExtraButtonShow(value: string) {
		this._ch5Properties.set("receiveStateExtraButtonShow", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("showExtraButton", newValue, () => {
				this.handleShowExtraButton();
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
			this.debounceContract();
		});
	}
	public get useContractForHidePoundButton(): boolean {
		return this._ch5Properties.get<boolean>("useContractForHidePoundButton");
	}

	public set useContractForHideAsteriskButton(value: boolean) {
		this._ch5Properties.set<string>("useContractForHideAsteriskButton", value, () => {
			this.debounceContract();
		});
	}
	public get useContractForHideAsteriskButton(): boolean {
		return this._ch5Properties.get<boolean>("useContractForHideAsteriskButton");
	}

	public set displayLabelMajorOnly(value: boolean) {
		this._ch5Properties.set<boolean>("displayLabelMajorOnly", value, () => {
			this.handleDisplayLabelMajorOnly();
		});
	}
	public get displayLabelMajorOnly(): boolean {
		return this._ch5Properties.get<boolean>("displayLabelMajorOnly");
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5Keypad.ELEMENT_NAME);
		this.ignoreAttributes = [];
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5Keypad.COMPONENT_PROPERTIES);
		resizeObserver(this._elContainer, this.resizeHandler);
		this.updateCssClass();
	}

	private clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
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
		this.logger.start('connectedCallback()', Ch5Keypad.ELEMENT_NAME);
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5Keypad);
		}
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-keypad');
			this.appendChild(this._elContainer);
		}
		this.buildRuntimeChildButtonList();
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);

		this.createKeyPadButtons();

		customElements.whenDefined('ch5-keypad').then(() => {
			this.componentLoadedEvent(Ch5Keypad.ELEMENT_NAME, this.id);
		});
		this.logger.stop();
	}

	private handleDisplayLabelMajorOnly() {
        [true, false].forEach((bool: boolean) => {
            this._elContainer.classList.remove(this.primaryCssClass + this.displayLabelMajorOnlyCssClass + bool.toString());
        });
        this._elContainer.classList.add(this.primaryCssClass + this.displayLabelMajorOnlyCssClass + this.displayLabelMajorOnly);
    }

	private createKeyPadButtons() {
		this._elContainer.innerHTML = "";
		for (let i = 0; i < Ch5Keypad.TOTAL_KEYPAD_BUTTONS; i++) {
			const defaultObj = CH5KeypadUtils.KEYPAD_DEFAULT_VALUES[i];
			const keypadButton = this.keypadButtons[i];

			if (keypadButton === null) {
				const newBtn = new Ch5KeypadButton(defaultObj);
				this._elContainer.appendChild(newBtn);
			} else {
				this._elContainer.appendChild(keypadButton);
			}
		}
		this.handleSendEventOnClickStart();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 */
	public disconnectedCallback() {
		this.logger.log("disconnectedCallback");
		this.removeEvents();
		this.unsubscribeFromSignals();
		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}

	private removeEvents() {
		super.removeEventListeners();
	}

	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}
	public static get observedAttributes(): string[] {
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
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
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

	protected attachEventListeners() {
		super.attachEventListeners();
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Create all the elements required under the parent Keypad tag
	 */
	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer = document.createElement('div');

		this.logger.stop();
	}

	private buildRuntimeChildButtonList() {
		const childElements: Element[] = Array.from(this.children);
		if (childElements.length > 0) {
			const keypadButtonKey = CH5KeypadUtils.KEYPAD_BUTTON_KEY;
			for (const ele of childElements) {
				if (ele.tagName.toLowerCase() === 'ch5-keypad-button') {

					// find key
					const key = ele.getAttribute('key')?.trim().toLowerCase() || '';
					const index = keypadButtonKey.findIndex((ele) => ele === key);

					// check valid key and no duplicate
					if (index !== -1 && this.keypadButtons[index] === null) {
						this.keypadButtons[index] = ele;
					} else {
						ele.remove();
					}
				}
			}
		}
	}

	private handleType() {
		Array.from(Ch5Keypad.COMPONENT_DATA.TYPE.values).forEach((e: any) => {
			this._elContainer.classList.remove(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.TYPE.classListPrefix + e);
		});
		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.TYPE.classListPrefix + this.type);
	}

	private handleShape() {
		Array.from(Ch5Keypad.COMPONENT_DATA.SHAPE.values).forEach((e: any) => {
			this._elContainer.classList.remove(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.SHAPE.classListPrefix + e);
		});
		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.SHAPE.classListPrefix + this.shape);
	}

	private handleStretch() {
		Array.from(Ch5Keypad.COMPONENT_DATA.STRETCH.values).forEach((e: any) => {
			this._elContainer.classList.remove(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.STRETCH.classListPrefix + e);
		});
		if (this.stretch === 'both' || this.stretch === 'height' || this.stretch === 'width') {
			this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
		}
		this.handleStretchResize();
	}

	private handleTextOrientation() {
		Array.from(Ch5Keypad.COMPONENT_DATA.TEXT_ORIENTATION.values).forEach((e: any) => {
			this._elContainer.classList.remove(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.TEXT_ORIENTATION.classListPrefix + e);
		});
		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.TEXT_ORIENTATION.classListPrefix + this.textOrientation);
	}

	private handleSize() {
		Array.from(Ch5Keypad.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
			this._elContainer.classList.remove(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.SIZE.classListPrefix + e);
		});
		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.SIZE.classListPrefix + this.size);
	}

	private handleShowExtraButton() {
		if (this.showExtraButton === true) {
			this._elContainer.classList.add(this.primaryCssClass + '--show-extra-button');
		} else {
			this._elContainer.classList.remove(this.primaryCssClass + '--show-extra-button');
		}
	}

	private handleContract() {
		if (this.contractName.length === 0) {
			this.signalNameOnContract.contractName = "";
			this.receiveStateShow = this.signalNameOnContract.receiveStateShow || this.receiveStateShow;
			this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable || this.receiveStateEnable;
			this.receiveStateCustomStyle = this.signalNameOnContract.receiveStateCustomStyle || this.receiveStateCustomStyle;
			this.receiveStateCustomClass = this.signalNameOnContract.receiveStateCustomClass || this.receiveStateCustomClass;
			this.receiveStateExtraButtonShow = this.signalNameOnContract.receiveStateExtraButtonShow || this.receiveStateExtraButtonShow;
			this.receiveStateHideAsteriskButton = this.signalNameOnContract.receiveStateHideAsteriskButton || this.receiveStateHideAsteriskButton;
			this.receiveStateHidePoundButton = this.signalNameOnContract.receiveStateHidePoundButton || this.receiveStateHidePoundButton;
		} else if (this.signalNameOnContract.contractName === "") {
			this.signalNameOnContract.contractName = this.contractName;
			this.signalNameOnContract.receiveStateShow = this.receiveStateShow;
			this.signalNameOnContract.receiveStateEnable = this.receiveStateEnable;
			this.signalNameOnContract.receiveStateCustomStyle = this.receiveStateCustomStyle;
			this.signalNameOnContract.receiveStateCustomClass = this.receiveStateCustomClass;
			this.signalNameOnContract.receiveStateExtraButtonShow = this.receiveStateExtraButtonShow;
			this.signalNameOnContract.receiveStateHideAsteriskButton = this.receiveStateHideAsteriskButton;
			this.signalNameOnContract.receiveStateHidePoundButton = this.receiveStateHidePoundButton;
		}
		this.contractDefaultHelper();
		this.handleSendEventOnClickStart();
	}

	private contractDefaultHelper() {
		if (this.contractName !== "" ) {
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
				this.receiveStateExtraButtonShow = this.contractName + '.ExtraButtonShow';
			}
		}
	}

	private handleSendEventOnClickStart() {
		const containerChildren = Array.from(this._elContainer.children);

		// If contract available
		if (this.contractName !== "") {
			containerChildren.forEach((ele, index: number) => {
				const value = this.contractName + '.' + CH5KeypadUtils.CONTRACT_SEND_EVENT_ON_CLICK[index];
				ele.setAttribute('sendEventOnClick', value);
			});
			return;
		}

		// If sendEventOnClickStart is Invalid
		const start = parseInt(this.sendEventOnClickStart, 10);
		if (isNaN(start)) {
			containerChildren.forEach((ele) => ele.removeAttribute('sendEventOnClick'));
			return;
		}

		// If sendEventOnClickStart is valid
		containerChildren.forEach((ele, index: number) => {
			// Button 0
			if (index === 10) {
				ele.setAttribute('sendEventOnClick', start + '');
			}

			// pound or extra button
			else if (index === 11 || index === 12) {
				ele.setAttribute('sendEventOnClick', start + index + '');
			}

			// other buttons
			else {
				ele.setAttribute('sendEventOnClick', (start + index + 1) + '');
			}
		});

	}

	private handleStretchResize() {
		if (this.stretch === null || (this.stretch !== 'both' && this.stretch !== 'height' && this.stretch !== 'width')) {
			this._elContainer.style.removeProperty('width');
			this._elContainer.style.removeProperty('height');
			this.style.removeProperty('display');
			return;
		}

		if (!this.parentElement) {
			return;
		}
		const { offsetHeight: parentHeight, offsetWidth: parentWidth } = this.parentElement;

		const heightUnit = this.showExtraButton ? parentHeight / 5 : parentHeight / 4;
		const widthUnit = parentWidth / 3;

		// If Width is larger than needed
		if (heightUnit / widthUnit < 1) {
			this._elContainer.style.width = "unset";
			this._elContainer.style.height = parentHeight + 'px';
		} else {
			this._elContainer.style.width = parentWidth + 'px';
		}

		this.style.display = "block";
	}


	private handleHidePoundButton() {
		const centerBtn = this.querySelector('.keypad-btn.misc-btn-two');
		centerBtn?.classList.remove('ch5-hide-vis');
		if (this.hidePoundButton) {
			centerBtn?.classList.add('ch5-hide-vis');
		}
	}
	private handleHideAsteriskButton() {
		const centerBtn = this.querySelector('.keypad-btn.misc-btn-one');
		centerBtn?.classList.remove('ch5-hide-vis');
		if (this.hideAsteriskButton) {
			centerBtn?.classList.add('ch5-hide-vis');
		}
	}

	private updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();

		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.TYPE.classListPrefix + this.type);

		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.SHAPE.classListPrefix + this.shape);

		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.TEXT_ORIENTATION.classListPrefix + this.textOrientation);

		this._elContainer.classList.add(this.primaryCssClass + Ch5Keypad.COMPONENT_DATA.SIZE.classListPrefix + this.size);

		this._elContainer.classList.add(this.primaryCssClass + this.displayLabelMajorOnlyCssClass + this.displayLabelMajorOnly);
		
		this.logger.stop();
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	private resizeHandler = () => {
		this.handleStretchResize();
	}

	private debounceContract = this.debounce(() => {
		this.handleContract();
	}, 10);


	//#endregion

}

Ch5Keypad.registerSignalAttributeTypes();
Ch5Keypad.registerCustomElement();
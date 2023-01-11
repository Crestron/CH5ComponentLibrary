// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5Common, ICh5AttributeAndPropertySettings } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5DpadAttributes } from "./interfaces/i-ch5-dpad-attributes";
import { TCh5DpadShape, TCh5DpadStretch, TCh5DpadType, TCh5DpadSize } from "./interfaces/t-ch5-dpad";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5DpadButton } from "./ch5-dpad-button";
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from "../ch5-core";

export class Ch5Dpad extends Ch5Common implements ICh5DpadAttributes {

	//#region 1. Variables

	//#region 1.1 readonly variables
	public static readonly ELEMENT_NAME = 'ch5-dpad';

	/**
	 * The first value is considered the default one
	 */
	public static readonly TYPES: TCh5DpadType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SHAPES: TCh5DpadShape[] = ['plus', 'circle'];

	public static readonly STRETCHES: TCh5DpadStretch[] = ['both', 'width', 'height'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SIZES: TCh5DpadSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	public static readonly CSS_CLASS_PREFIX_STRETCH: string = "--stretch-";
	public static readonly CSS_CLASS_PREFIX_TYPE: string = "--type-";
	public static readonly CSS_CLASS_PREFIX_SHAPE: string = "--shape-";
	public static readonly CSS_CLASS_PREFIX_SIZE: string = "--size-";

	/**
	 * COMPONENT_DATA is required for sass-schema generator file to build sufficient data
	 */
	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5Dpad.TYPES[0],
			values: Ch5Dpad.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_TYPE
		},
		STRETCHES: {
			default: null,
			values: Ch5Dpad.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_STRETCH
		},
		SHAPES: {
			default: Ch5Dpad.SHAPES[0],
			values: Ch5Dpad.SHAPES,
			key: 'shape',
			attribute: 'shape',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_SHAPE
		},
		SIZES: {
			default: Ch5Dpad.SIZES[0],
			values: Ch5Dpad.SIZES,
			key: 'size',
			attribute: 'size',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_SIZE
		},
	};

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		sendeventonclickstart: { direction: "event", booleanJoin: 1, contractName: true },
		contractname: { contractName: true },
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
	};

	public readonly primaryCssClass = 'ch5-dpad';

	//#endregion

	//#region 1.2 private / protected variables

	private COMPONENT_NAME: string = "ch5-dpad";
	private _contractName: string = '';
	private _type: TCh5DpadType = Ch5Dpad.TYPES[0];
	private _shape: TCh5DpadShape = Ch5Dpad.SHAPES[0];
	private _stretch: TCh5DpadStretch | null = null;
	private _sendEventOnClickStart: string = '';
	private _useContractForEnable: boolean = true;
	private _useContractForShow: boolean = true;
	private _useContractForCustomStyle: boolean = false;
	private _useContractForCustomClass: boolean = false;
	private _useContractForEnableSignalValue: string = '';
	private _useContractForShowSignalValue: string = '';
	private _useContractForCustomStyleSignalValue: string = '';
	private _useContractForCustomClassSignalValue: string = '';

	private _size: TCh5DpadSize = Ch5Dpad.SIZES[0];

	// state specific vars
	private isComponentLoaded: boolean = false;
	private isResizeInProgress: boolean = false;
	private readonly RESIZE_DEBOUNCE: number = 500;

	// elements specific vars
	private container: HTMLElement = {} as HTMLElement;
	private containerClass: string = 'dpad-container';

	private readonly DPAD_PROPERTIES: {
		CONTRACT_NAME: ICh5AttributeAndPropertySettings,
		TYPE: ICh5AttributeAndPropertySettings,
		SHAPE: ICh5AttributeAndPropertySettings,
		STRETCH: ICh5AttributeAndPropertySettings,
		SIZE: ICh5AttributeAndPropertySettings
	} = {
			CONTRACT_NAME: {
				default: "",
				valueOnAttributeEmpty: "",
				variableName: "_contractName",
				attributeName: "contractName",
				propertyName: "contractName",
				type: "string",
				removeAttributeOnNull: true,
				enumeratedValues: [],
				componentReference: this,
				callback: this.updateContractNameBasedHandlers.bind(this)
			},
			TYPE: {
				default: Ch5Dpad.TYPES[0],
				valueOnAttributeEmpty: Ch5Dpad.TYPES[0],
				variableName: "_type",
				attributeName: "type",
				propertyName: "type",
				removeAttributeOnNull: true,
				type: "enum",
				enumeratedValues: Ch5Dpad.TYPES,
				componentReference: this,
				callback: this.updateCssClasses.bind(this)
			},
			SHAPE: {
				default: Ch5Dpad.SHAPES[0],
				valueOnAttributeEmpty: Ch5Dpad.SHAPES[0],
				variableName: "_shape",
				attributeName: "shape",
				propertyName: "shape",
				removeAttributeOnNull: false,
				type: "enum",
				enumeratedValues: Ch5Dpad.SHAPES,
				componentReference: this,
				callback: this.checkAndRestructureDomOfDpad.bind(this)
			},
			STRETCH: {
				default: null,
				valueOnAttributeEmpty: null,
				variableName: "_stretch",
				attributeName: "stretch",
				propertyName: "stretch",
				removeAttributeOnNull: true,
				type: "enum",
				enumeratedValues: Ch5Dpad.STRETCHES,
				componentReference: this,
				callback: this.stretchHandler.bind(this)
			},
			SIZE: {
				default: Ch5Dpad.SIZES[0],
				valueOnAttributeEmpty: Ch5Dpad.SIZES[0],
				variableName: "_size",
				attributeName: "size",
				propertyName: "size",
				removeAttributeOnNull: false,
				type: "enum",
				enumeratedValues: Ch5Dpad.SIZES,
				componentReference: this,
				callback: this.checkAndRestructureDomOfDpad.bind(this)
			}
		};

	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Dpad.ELEMENT_NAME, Ch5Dpad.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Dpad.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Dpad.ELEMENT_NAME, Ch5Dpad);
		}
	}

	//#endregion

	//#endregion

	//#region 2. Setters and Getters

	public set contractName(value: string) {
		this.logger.log('set contractName("' + value + '")');
		this.setAttributeAndProperty(this.DPAD_PROPERTIES.CONTRACT_NAME, value);
	}
	public get contractName(): string {
		return this._contractName;
	}

	public set type(value: TCh5DpadType) {
		this.logger.log('set type ("' + value + '")');
		this.setAttributeAndProperty(this.DPAD_PROPERTIES.TYPE, value);
	}
	public get type(): TCh5DpadType {
		return this._type;
	}

	public set shape(value: TCh5DpadShape) {
		this.logger.log('set shape ("' + value + '")');
		this.setAttributeAndProperty(this.DPAD_PROPERTIES.SHAPE, value);
	}
	public get shape(): TCh5DpadShape {
		return this._shape;
	}

	public set stretch(value: TCh5DpadStretch | null) {
		this.logger.log('set stretch ("' + value + '")');
		this.setAttributeAndProperty(this.DPAD_PROPERTIES.STRETCH, value);
	}
	public get stretch(): TCh5DpadStretch | null {
		return this._stretch;
	}

	public set size(value: TCh5DpadSize) {
		this.logger.log('set size ("' + value + '")');
		this.setAttributeAndProperty(this.DPAD_PROPERTIES.SIZE, value);
	}
	public get size() {
		return this._size;
	}

	public set sendEventOnClickStart(value: string) {
		this.logger.start('set sendEventOnClickStart("' + value + '")');

		if (_.isNil(value) || isNaN(parseInt(value, 10))) {
			value = '';
		}

		if (value === this.sendEventOnClickStart) {
			return;
		}

		this._sendEventOnClickStart = value;
		this.setAttribute('sendEventOnClickStart'.toLowerCase(), value);
		this.updateEventClickHandlers(parseInt(value, 10));
		this.logger.stop();
	}
	public get sendEventOnClickStart(): string {
		return this._sendEventOnClickStart;
	}

	public set useContractForEnable(value: boolean) {
		this.logger.start('Ch5Dpad set useContractForEnable("' + value + '")');

		const isUseContractForEnable = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || (this._useContractForEnable === isUseContractForEnable)) {
			return;
		}

		this.setAttribute('useContractForEnable'.toLowerCase(), isUseContractForEnable.toString());
		this._useContractForEnable = isUseContractForEnable;
		const sigVal = contractName + "Enable";

		const params: TCh5CreateReceiveStateSigParams = {
			caller: this,
			attrKey: 'useContractForEnable',
			value: sigVal,
			callbackOnSignalReceived: (newValue: string | boolean) => {
				newValue = (!newValue).toString();
				this.info(' subs callback for useContractForEnable: ', this._useContractForEnableSignalValue,
					' Signal has value ', newValue);
				ComponentHelper.setAttributeToElement(this, 'disabled', newValue);
			}
		};

		this.setValueForReceiveStateBoolean(params);
		this.logger.stop();
	}
	public get useContractForEnable(): boolean {
		return this._useContractForEnable;
	}

	public set useContractForShow(value: boolean) {
		this.logger.start('Ch5Dpad set useContractForShow("' + value + '")');

		const isUseContractForShow = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || (this._useContractForShow === isUseContractForShow)) {
			return;
		}

		this.setAttribute('useContractForShow'.toLowerCase(), isUseContractForShow.toString());
		const sigVal = contractName + "Show";

		const params: TCh5CreateReceiveStateSigParams = {
			caller: this,
			attrKey: 'useContractForShow',
			value: sigVal,
			callbackOnSignalReceived: (newValue: string | boolean) => {
				newValue = newValue.toString();
				this.info(' subs callback for signalReceiveShow: ', this._useContractForShowSignalValue, ' Signal has value ', newValue);
				ComponentHelper.setAttributeToElement(this, 'show', newValue);
			}
		};

		this.setValueForReceiveStateBoolean(params);
		this.logger.stop();
	}
	public get useContractForShow(): boolean {
		return this._useContractForShow;
	}

	public set useContractForCustomStyle(value: boolean) {
		this.logger.start('Ch5Dpad set useContractForCustomStyle("' + value + '")');

		const isUseContractForCustomStyle = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || (this._useContractForCustomStyle === isUseContractForCustomStyle)) {
			return;
		}

		this.setAttribute('usecontractforcustomstyle', isUseContractForCustomStyle.toString());
		this._useContractForCustomStyle = isUseContractForCustomStyle;
		const sigVal = contractName + "CustomStyle";

		const params: TCh5CreateReceiveStateSigParams = {
			caller: this,
			attrKey: 'useContractForCustomStyle',
			value: sigVal,
			callbackOnSignalReceived: (newValue: string | boolean) => {
				newValue = newValue as string;
				this.info(' subs callback for useContractForCustomStyle: ', this._useContractForCustomStyleSignalValue, ' Signal has value ', newValue);
				this.customStyle = newValue;
			}
		};

		this.setValueForReceiveStateString(params);
		this.logger.stop();
	}
	public get useContractForCustomStyle(): boolean {
		return this._useContractForCustomStyle;
	}

	public set useContractForCustomClass(value: boolean) {
		this.logger.start('Ch5Dpad set useContractForCustomClass("' + value + '")');

		const isUseContractForCustomClass = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || (this._useContractForCustomClass === isUseContractForCustomClass)) {
			return;
		}

		this.setAttribute('useContractForCustomClass', isUseContractForCustomClass.toString());
		this._useContractForCustomClass = isUseContractForCustomClass;
		const sigVal = contractName + "CustomClass";

		const params: TCh5CreateReceiveStateSigParams = {
			caller: this,
			attrKey: 'useContractForCustomClass',
			value: sigVal,
			callbackOnSignalReceived: (newValue: string | boolean) => {
				newValue = newValue as string;
				this.info(' subs callback for useContractForCustomClass: ', this._useContractForCustomClassSignalValue,
					' Signal has value ', newValue);
				this.customClass = newValue;
			}
		};

		this.setValueForReceiveStateString(params);
		this.logger.stop();
	}
	public get useContractForCustomClass(): boolean {
		return this._useContractForCustomClass;
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', this.COMPONENT_NAME);
		ComponentHelper.clearComponentContent(this);

		// set attributes based on onload attributes
		this.initAttributes();
		// add missing elements, remove extra ones, before Dpad is finally rendered
		this.checkAndRestructureDomOfDpad();

		this.logger.stop();
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);
		subscribeInViewPortChange(this, () => {
			if (this.elementIsInViewPort) {
				if (!_.isNil(this.stretch) && this.parentElement) {
					const { offsetHeight: parentHeight, offsetWidth: parentWidth } = this.parentElement;
					const setValue = parentWidth <= parentHeight ? parentWidth : parentHeight;
					this.container.style.height = setValue + 'px';
					this.container.style.width = setValue + 'px';
				}
			}
		});
		customElements.whenDefined('ch5-dpad').then(() => {
			// create element
			if (!this._wasInstatiated) {
				this.createHtmlElements();
			}
			this._wasInstatiated = true;

			// update class based on the current type chosen
			this.updateCssClasses();

			// events binding
			this.attachEventListeners();

			// check if the dpad element has been created by verifying one of its properties

			// // initialize mutation observer if any
			// this.initCommonMutationObserver(this);
			this.initAttributes(); // Why do we need this twice - once here and once in constructor

			// required post initial setup
			this.stretchHandler();

			this.isComponentLoaded = true;
		});

		Promise.all([
			customElements.whenDefined('ch5-dpad-button'),
		]).then(() => {
			// check if all components required to build dpad are ready, instantiated and available for consumption
			this.onAllSubElementsCreated();
		});
		this.logger.stop();
	}

	/**
	 * Function create and bind events for dpad once all the expected child elements are defined and
	 * ready for consumption
	 */
	private onAllSubElementsCreated() {
		this.logger.start('onAllSubElementsCreated() - start', this.COMPONENT_NAME);

		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.removeEvents();
		this.unsubscribeFromSignals();
		unSubscribeInViewPortChange(this);

		if (!!this.container && !!this.container.style) {
			this.container.style.removeProperty('height');
			this.container.style.removeProperty('width');
		}

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}

	private removeEvents() {
		// throw new Error("Method not implemented or element is not structured correctly.");
		super.removeEventListeners();
		window.removeEventListener('resize', this.onWindowResizeHandler);
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
	}

	static get observedAttributes() {
		const commonAttributes: string[] = Ch5Common.observedAttributes;

		// attributes
		const attributes: string[] = [
			"contractname",
			"type",
			"shape",
			"stretch",
			"size",
			"usecontractforenable",
			"usecontractforshow",
			"usecontractforcustomclass",
			"usecontractforcustomstyle"
		];

		// received signals
		const receivedSignals: string[] = [];

		// sent signals
		const sentSignals: string[] = ["sendeventonclickstart"];

		const ch5DpadAttributes = commonAttributes.concat(attributes).concat(receivedSignals).concat(sentSignals);

		return ch5DpadAttributes;
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
		if (oldValue === newValue) {
			this.logger.stop();
			return;
		}

		this.info('ch5-dpad attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
		const isValidContract: boolean = (ComponentHelper.getAttributeAsString(this, 'contractname', '').length > 0);
		switch (attr) {
			case 'usecontractforshow':
				this.useContractForShow = ComponentHelper.getBoolFromString(ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforshow') && this.getAttribute('usecontractforshow') !== "false"), ''));
				break;
			case 'usecontractforenable':
				this.useContractForEnable = ComponentHelper.getBoolFromString(ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforenable') && this.getAttribute('usecontractforenable') !== "false"), ''));
				break;
			case 'usecontractforcustomstyle':
				this.useContractForCustomStyle = ComponentHelper.getBoolFromString(ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforcustomstyle') && this.getAttribute('usecontractforcustomstyle') !== "false"), ''));
				break;
			case 'usecontractforcustomclass':
				this.useContractForCustomClass = ComponentHelper.getBoolFromString(ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforcustomclass') && this.getAttribute('usecontractforcustomclass') !== "false"), ''));
				break;
			case 'show':
			case 'receivestateshow':
			case 'receivestateenable':
			case 'receivestateshowpulse':
			case 'receivestatehidepulse':
			case 'receivestatecustomstyle':
			case 'receivestatecustomclass':
				if (!isValidContract) {
					super.attributeChangedCallback(attr, oldValue, newValue);
				}
				break;
			case 'sendeventonclickstart':
				if (!isValidContract) {
					this.sendEventOnClickStart = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'type':
				this.type = newValue as unknown as TCh5DpadType;
				break;
			case 'shape':
				this.shape = newValue as unknown as TCh5DpadShape;
				break;
			case 'stretch':
				this.stretch = newValue as unknown as TCh5DpadStretch;
				break;
			case 'contractname':
				// Match and replace all the ending dots in the contract name and remove them, adding only 1 dot at the end.
				if (newValue !== newValue.replace(/[\.]+$/, '') + '.') {
					this.setAttribute('contractname', newValue.replace(/[\.]+$/, '') + '.');
					break;
				}
				this.contractName = newValue;
				this.updateContractNameBasedHandlers();
				break;
			case 'size':
				this.size = newValue as TCh5DpadSize;
				break;
			default:
				this.logger.log("attributeChangedCallback: going to default");
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}

		this.logger.stop();
	}

	/**
	 * Function to create all the elements required under the parent DPAD tag
	 */
	protected createHtmlElements(): void {
		this.logger.start('createHtmlElements', this.COMPONENT_NAME);

		this.classList.add(this.primaryCssClass);

		const childItemsContainer = this.children as HTMLCollection;

		if (childItemsContainer.length === 0 || childItemsContainer[0].children.length === 0) {
			if (!_.cloneDeep(childItemsContainer[0]?.children)) {
				this.createAndAppendAllButtonsUnderDpad();
			} else {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer);
			}
		} else {
			const isValidStructureInChildDiv = this.checkIfOrderOfTagsAreInTheRightOrder(childItemsContainer[0].children);
			if (!isValidStructureInChildDiv) {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer);
			}
		}

		this.logger.stop();
	}

	protected updateHtmlElements(): void {
		this.logger.start('updateHtmlElements', this.COMPONENT_NAME);

		const childItemsContainer = this.children as HTMLCollection;
		if (childItemsContainer.length === 0 || childItemsContainer[0].children.length === 0) {
			if (!_.cloneDeep(childItemsContainer[0]?.children)) {
				this.createAndAppendAllButtonsUnderDpad();
			} else {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer[0].children);
			}
		} else {
			const isValidStructureInChildDiv = this.checkIfOrderOfTagsAreInTheRightOrder(childItemsContainer[0].children);
			if (!isValidStructureInChildDiv) {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer[0].children);
			}
		}

		this.logger.stop();
	}

	/**
	 * Function to create the container div which holds all the 5 buttons within dpad
	 */
	private createEmptyContainerDiv() {
		if (_.isNil(this.container) || _.isNil(this.container.classList) || this.container.classList.length === 0) {
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
	 * Function to add all 5 buttons in the expected order if not added in the DOM
	 */
	private createAndAppendAllButtonsUnderDpad() {
		const centerBtn = new Ch5DpadButton();
		centerBtn.setAttribute('key', 'center');
		const upBtn = new Ch5DpadButton();
		upBtn.setAttribute('key', 'up');
		const rightBtn = new Ch5DpadButton();
		rightBtn.setAttribute('key', 'right');
		const downBtn = new Ch5DpadButton();
		downBtn.setAttribute('key', 'down');
		const leftBtn = new Ch5DpadButton();
		leftBtn.setAttribute('key', 'left');

		this.createEmptyContainerDiv();

		// order of appending is --- center, up, left/right, right/left, down
		this.container.appendChild(centerBtn);
		this.container.appendChild(upBtn);

		if (this.shape === Ch5Dpad.SHAPES[0]) {
			// if the selected shape is 'plus'
			this.container.appendChild(leftBtn);
			this.container.appendChild(rightBtn);
		}
		else if (this.shape === Ch5Dpad.SHAPES[1]) {
			// if the selected shape is 'circle'
			this.container.appendChild(rightBtn);
			this.container.appendChild(leftBtn);
		} else {
			// if the selected shape is an invalid value
			throw new Error("Seems to be an invalid shape. Must be 'plus' or 'circle' as values.");
		}

		this.container.appendChild(downBtn);
	}

	private createAndAppendAllExistingButtonsUnderDpad(buttonsList: HTMLCollection) {
		if (!buttonsList.length) {
			return;
		}
		let centerBtn: any = null;
		let upBtn: any = null;
		let rightBtn: any = null;
		let downBtn: any = null;
		let leftBtn: any = null;
		Array.from(buttonsList).forEach(item => {
			switch (item.getAttribute('key')) {
				case 'center':
					centerBtn = item;
					break;
				case 'up':
					upBtn = item;
					break;
				case 'right':
					rightBtn = item;
					break;
				case 'down':
					downBtn = item;
					break;
				case 'left':
					leftBtn = item;
					break;
				default: throw new Error("Seems to be an invalid dpad Button value ");
			}
		});

		// if user forget one or more buttons the default ones will be added
		if (!centerBtn) {
			centerBtn = new Ch5DpadButton();
			centerBtn.setAttribute('key', 'center');
		}
		if (!upBtn) {
			upBtn = new Ch5DpadButton();
			upBtn.setAttribute('key', 'up');
		}
		if (!rightBtn) {
			rightBtn = new Ch5DpadButton();
			rightBtn.setAttribute('key', 'right');
		}
		if (!downBtn) {
			downBtn = new Ch5DpadButton();
			downBtn.setAttribute('key', 'down');
		}
		if (!leftBtn) {
			leftBtn = new Ch5DpadButton();
			leftBtn.setAttribute('key', 'left');
		}

		this.createEmptyContainerDiv();

		// order of appending is --- center, up, left/right, right/left, down
		this.container.appendChild(centerBtn);
		this.container.appendChild(upBtn);

		if (this.shape === Ch5Dpad.SHAPES[0]) {
			// if the selected shape is 'plus'
			this.container.appendChild(leftBtn);
			this.container.appendChild(rightBtn);
		}
		else if (this.shape === Ch5Dpad.SHAPES[1]) {
			// if the selected shape is 'circle'
			this.container.appendChild(rightBtn);
			this.container.appendChild(leftBtn);
		} else {
			// if the selected shape is an invalid value
			throw new Error("Seems to be an invalid shape. Must be 'plus' or 'circle' as values.");
		}

		this.container.appendChild(downBtn);
	}

	/**
	 * Function to check if the tags are sequenced in the right/expected order
	 * @param childItems 
	 * @returns true if the order is correct [order of appending is --- center, up, left/right, right/left, down]
	 */
	private checkIfOrderOfTagsAreInTheRightOrder(childItems: HTMLCollection) {
		let ret = false;
		if (childItems.length === 5) {
			const firstTag = this.shape === Ch5Dpad.SHAPES[0] ? 'left' : 'right'; // if 'plus'
			const secondTag = this.shape === Ch5Dpad.SHAPES[0] ? 'right' : 'left'; // if 'circle'

			ret = ((childItems[0].getAttribute('key') === 'center') &&
				(childItems[1].getAttribute('key') === 'up') &&
				(childItems[2].getAttribute('key') === firstTag) &&
				(childItems[3].getAttribute('key') === secondTag) &&
				(childItems[4].getAttribute('key') === 'down'));
		} else {
			// removing child tags and emptying DPAD if the tag count is neither 0 or 5
			if (childItems.length > 0) {
				for (const item of Array.from(childItems)) {
					item.remove();
				}
			}
		}
		return ret;
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", this.COMPONENT_NAME);
		super.initAttributes();
		// set data-ch5-id
		this.setAttribute('data-ch5-id', this.getCrId());

		ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5Dpad); // WAI-ARIA Attributes
		this.contractName = this.getAttribute('contractname') as unknown as string;
		this.sendEventOnClickStart = ComponentHelper.setAttributeToElement(this, 'sendEventOnClickStart'.toLowerCase(), this._sendEventOnClickStart);
		this.type = this.getAttribute('type') as unknown as TCh5DpadType;
		this.shape = this.getAttribute('shape') as unknown as TCh5DpadShape;
		this.stretch = this.getAttribute('stretch') as unknown as TCh5DpadStretch;
		this.size = this.getAttribute('size') as unknown as TCh5DpadSize;

		// DEV NOTE: if contract name exists, and the individual attribute values don't exist, 
		// then the default value is true for useContractFor*
		// else useContractFor* picks value from attributes
		this.useContractForEnable = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForEnable'.toLowerCase(), String(this._useContractForEnable)));
		this.useContractForShow = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForShow'.toLowerCase(), String(this._useContractForShow)));
		this.useContractForCustomStyle = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForCustomStyle'.toLowerCase(), String(this._useContractForCustomStyle)));
		this.useContractForCustomClass = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForCustomClass'.toLowerCase(), String(this._useContractForCustomClass)));

		// signals
		if (this.hasAttribute('receivestateenable')) {
			this.receiveStateEnable = this.getAttribute('receivestateenable') as unknown as string;
		}
		if (this.hasAttribute('receivestatecustomclass')) {
			this.receiveStateCustomClass = this.getAttribute('receivestatecustomclass') as unknown as string;
		}
		if (this.hasAttribute('receivestatehidepulse')) {
			this.receiveStateHidePulse = this.getAttribute('receivestatehidepulse') as unknown as string;
		}
		if (this.hasAttribute('receivestatecustomstyle')) {
			this.receiveStateCustomStyle = this.getAttribute('receivestatecustomstyle') as unknown as string;
		}
		if (this.hasAttribute('receivestateshow')) {
			this.receiveStateShow = this.getAttribute('receivestateshow') as unknown as string;
		}
		if (this.hasAttribute('receivestateshowpulse')) {
			this.receiveStateShowPulse = this.getAttribute('receivestateshowpulse') as unknown as string;
		}

		this.logger.stop();
	}

	/**
	 * Called to bind proper listeners
	 */
	protected attachEventListeners() {
		super.attachEventListeners();
		window.addEventListener('resize', this.onWindowResizeHandler.bind(this));
	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		for (const typeVal of Ch5Dpad.TYPES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_TYPE + typeVal);
		}
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_TYPE + this.type);

		for (const typeVal of Ch5Dpad.SHAPES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SHAPE + typeVal);
		}
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SHAPE + this.shape);

		for (const typeVal of Ch5Dpad.SIZES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + typeVal);
		}
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + this.size);

		for (const typeVal of Ch5Dpad.STRETCHES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_STRETCH + typeVal);
		}
		if (!!this.stretch && this.stretch.length > 0) { // checking for length since it does not have a default value
			this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_STRETCH + this.stretch);
			if (!!this.size && this.size.length > 0) {
				this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + this.size);
			}
		}
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Function to restructure initial DOM before rendering commences
	 */
	private checkAndRestructureDomOfDpad() {
		this.logger.start('checkAndRestructureDomOfDpad()', this.COMPONENT_NAME);
		// if (this.children.length === 0) {
		// 	// nothing to do, all buttons will be appended as required
		// 	return;
		// } else if (this.children.length === 1 &&
		// 	this.children[0].tagName.toLowerCase() === 'div' &&
		// 	this.children[0].classList.contains(this.containerClass)) {
		// 	this.removeDuplicateChildElements(this.children[0]);
		// } else {
		// 	this.removeDuplicateChildElements(this);
		// }
		this.updateHtmlElements();
		this.updateCssClasses();

		this.logger.stop();
	}

	private removeDuplicateChildElements(elementToCheck: Element = this) {
		let childItems: Element[] = Array.from(elementToCheck.children);

		const refobj: any = {}; // stores the reference of all buttons relevant for dpad

		// // FIRST -A: remove all duplicate entries under DPAD
		if (childItems.length > 0) {
			if (childItems.length === 5) {
				const keysArray = childItems.map((item) => item.getAttribute('key'));
				const isDuplicate = keysArray.some((item, index) => keysArray.indexOf(item) !== index);
				if (isDuplicate) {
					const duplicateElementIndex = keysArray.findIndex((item, index) => keysArray.indexOf(item) !== index);
					childItems[duplicateElementIndex].remove();
				}
			} else {
				for (const item of childItems) {
					const tagName = item.tagName.toLowerCase();
					if (tagName !== 'div') {
						refobj[tagName + '-' + item.getAttribute('key')] = item;
					} else {
						item.remove();
						childItems = childItems.filter((child) => child !== item)
					}
				}
			}
		}

		const childElementArray: string[] = [
			"ch5-dpad-button"
		];

		// SECOND: create and add all non existing child tags 
		if (refobj !== null) {
			for (const tagName of childElementArray) {
				if (!refobj.hasOwnProperty(tagName)) {
					const ele = new Ch5DpadButton();
					ele.setAttribute('key', tagName.split('-')[tagName.split('-').length - 1]);
					refobj[tagName] = ele as HTMLElement;
				}
			}
		}
	}

	/**
	 * Function to add the send event on click attribute to child elements if valid scenario
	 * contractName.length === 0 and eventKeyStart is a valid number
	 * @param eventKeyStart sendEventOnClickStart event's initial value
	 */
	private updateEventClickHandlers(eventKeyStart: number) {
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');
		const buttonList = this.getElementsByTagName("ch5-dpad-button");
		let centerBtn;
		let upBtn;
		let rightBtn;
		let downBtn;
		let leftBtn;
		if (buttonList.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let index = 0; index < buttonList.length; index++) {
				const elementKey = buttonList[index].getAttribute('key');
				if (elementKey) {
					switch (elementKey) {
						case 'center':
							centerBtn = buttonList[index];
							break;
						case 'up':
							upBtn = buttonList[index];
							break;
						case 'left':
							leftBtn = buttonList[index];
							break;
						case 'right':
							rightBtn = buttonList[index];
							break;
						case 'down':
							downBtn = buttonList[index];
							break;
						default:
							centerBtn = buttonList[index];
							break;
					}
				}
			}
		}

		if (contractName.length === 0 && !isNaN(eventKeyStart)) {
			if (!_.isNil(centerBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.center;
				centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(upBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.up;
				upBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(rightBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.right;
				rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(downBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.down;
				downBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(leftBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.left;
				leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
		}
	}
	private updateContractNameBasedHandlers() {
		const contractName = this._contractName;
		const buttonList = this.getElementsByTagName("ch5-dpad-button");
		let centerBtn;
		let upBtn;
		let rightBtn;
		let downBtn;
		let leftBtn;
		if (buttonList.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let index = 0; index < buttonList.length; index++) {
				const elementKey = buttonList[index].getAttribute('key');
				if (elementKey) {
					switch (elementKey) {
						case 'center':
							centerBtn = buttonList[index];
							break;
						case 'up':
							upBtn = buttonList[index];
							break;
						case 'left':
							leftBtn = buttonList[index];
							break;
						case 'right':
							rightBtn = buttonList[index];
							break;
						case 'down':
							downBtn = buttonList[index];
							break;
						default:
							centerBtn = buttonList[index];
							break;
					}
				}
			}
		}
		if (contractName.length > 0) {
			if (!_.isNil(centerBtn)) {
				const contractVal = contractName + CH5DpadUtils.contractSuffix.center;
				centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(upBtn)) {
				const contractVal = contractName + CH5DpadUtils.contractSuffix.up;
				upBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(rightBtn)) {
				const contractVal = contractName + CH5DpadUtils.contractSuffix.right;
				rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(downBtn)) {
				const contractVal = contractName + CH5DpadUtils.contractSuffix.down;
				downBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(leftBtn)) {
				const contractVal = contractName + CH5DpadUtils.contractSuffix.left;
				leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
		}
	}

	private stretchHandler() {
		this.logger.start(this.COMPONENT_NAME + ' > stretchHandler');
		this.updateCssClasses();
		const dpadHeight = this.offsetHeight;
		const dpadWidth = this.offsetWidth;
		let dimensionVal = Math.min(dpadHeight, dpadWidth);
		if (!!this.stretch && this.stretch.length === 0) {
			dimensionVal = 0;
		}
		if (!!this.container && !!this.container.style) {
			if (dimensionVal === 0) {
				this.container.style.removeProperty('height');
				this.container.style.removeProperty('width');
			}
			const parentElement = this.parentElement;
			if (!!this.stretch && this.stretch.trim().length > 0 && !!parentElement) {
				dimensionVal = Math.min(parentElement.offsetHeight, parentElement.offsetWidth);
				this.container.style.height = dimensionVal + 'px';
				this.container.style.width = dimensionVal + 'px';
			}
		}

		this.logger.stop();
	}

	/**
	 * Function to handle the resize event for dpad to be redrawn if required
	 */
	private onWindowResizeHandler() {
		// since stretch has no default value, should fire stretchHandler only if required
		if (!!this.stretch && this.stretch.length > 0 && !this.isResizeInProgress) {
			this.isResizeInProgress = true;
			setTimeout(() => {
				this.stretchHandler();
				this.isResizeInProgress = false; // reset debounce once completed
			}, this.RESIZE_DEBOUNCE);
		}
	}

	//#endregion

}

Ch5Dpad.registerCustomElement();
Ch5Dpad.registerSignalAttributeTypes();

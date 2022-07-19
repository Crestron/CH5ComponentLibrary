// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common, ICh5AttributeAndPropertySettings } from "../ch5-common/ch5-common";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5KeypadButton } from "./ch5-keypad-btn";
import { CH5KeypadButtonData } from "./ch5-keypad-btn-data";
import { ICh5KeypadAttributes } from "./interfaces/i-ch5-keypad-attributes";
import { TCh5KeypadButtonCreateDTO, TCh5KeypadShape, TCh5KeypadSize, TCh5KeypadStretch, TCh5KeypadTextOrientation, TCh5KeypadType } from "./interfaces/t-ch5-keypad";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5Keypad extends Ch5Common implements ICh5KeypadAttributes {
	//#region 1. Variables
	//#region 1.1 readonly variables

	public static readonly ELEMENT_NAME = 'ch5-keypad';

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateshow: { direction: "state", booleanJoin: 1, contractName: true },
		receivestateenable: { direction: "state", booleanJoin: 1, contractName: true },
		receivestateshowpulse: { direction: "state", booleanJoin: 1, contractName: true },
		receivestatehidepulse: { direction: "state", booleanJoin: 1, contractName: true },
		receivestatecustomstyle: { direction: "state", stringJoin: 1, contractName: true },
		receivestatecustomclass: { direction: "state", stringJoin: 1, contractName: true },
		receivestateextrabuttonshow: { direction: "state", stringJoin: 1, contractName: true },

		sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
		sendeventontouch: { direction: "event", booleanJoin: 1, contractName: true },
		sendeventonclickstart: { direction: "event", booleanJoin: 1, contractName: true },
		contractname: { contractName: true },
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
	};

	/**
	 * The first value is considered the default one
	 */
	public static readonly TYPES: TCh5KeypadType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SHAPES: TCh5KeypadShape[] = ['rounded-rectangle', 'square', 'circle'];

	/**
	 * No default value for Stretch
	 */
	public static readonly STRETCHES: TCh5KeypadStretch[] = ['both', 'width', 'height'];

	/**
	 * No default value for Text Orientation
	 * Value controls the way the major and minor render together
	 */
	public static readonly TEXT_ORIENTATIONS: TCh5KeypadTextOrientation[] = ['top', 'right', 'bottom', 'left'];

	/**
	 * The first value is considered the default one
	 */
	public static readonly SIZES: TCh5KeypadSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	public static readonly btnTypeClassPrefix: string = "ch5-keypad--type-";
	public static readonly btnStretchClassPrefix: string = "ch5-keypad--stretch-";
	public static readonly btnShapeClassPrefix: string = "ch5-keypad--shape-";
	public static readonly btnTextOrientationClassPrefix: string = "ch5-keypad--orientation-";
	public static readonly btnSizeClassPrefix: string = "ch5-keypad--size-";

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
			classListPrefix: 'ch5-keypad--size-'
		},
	};

	public readonly primaryCssClass = 'ch5-keypad';
	public readonly cssClassPrefix = 'ch5-keypad';

	private readonly KEYPAD_PROPERTIES: {
		SHOW_EXTRA_BUTTON: ICh5AttributeAndPropertySettings
	} = {
			SHOW_EXTRA_BUTTON: {
				default: false,
				valueOnAttributeEmpty: true,
				variableName: "_showExtraButton",
				attributeName: "showExtraButton",
				propertyName: "showExtraButton",
				type: "boolean",
				removeAttributeOnNull: true,
				enumeratedValues: ['true', 'false', '', true, false],
				componentReference: this,
				callback: this.showExtraButtonForNonContract.bind(this)
			}
		};

	//#endregion

	//#region 1.2 private / protected variables
	private COMPONENT_NAME: string = "ch5-keypad";
	private _contractName: string = '';
	private _type: TCh5KeypadType = Ch5Keypad.TYPES[0];
	private _shape: TCh5KeypadShape = Ch5Keypad.SHAPES[0];
	private _stretch: TCh5KeypadStretch | null = null;
	private _textOrientation: TCh5KeypadTextOrientation = Ch5Keypad.TEXT_ORIENTATIONS[0];
	private _sendEventOnClickStart: string = '';
	private _showExtraButton: boolean = false;
	private _receiveStateExtraButtonShow: string = '';
	private _subKeySigReceiveExtraButtonShow: string = '';
	private _useContractForEnable: boolean = true;
	private _useContractForShow: boolean = true;
	private _useContractForCustomStyle: boolean = false;
	private _useContractForCustomClass: boolean = false;
	private _useContractForExtraButtonShow: boolean = false;
	private _useContractForEnableSignalValue: string = '';
	private _useContractForShowSignalValue: string = '';
	private _useContractForCustomStyleSignalValue: string = '';
	private _useContractForCustomClassSignalValue: string = '';
	private _useContractForExtraButtonShowSignalValue: string = '';
	private _size: TCh5KeypadSize = Ch5Keypad.SIZES[0];

	// state specific vars
	private isComponentLoaded: boolean = false;
	private isResizeInProgress: boolean = false;
	private readonly resizeDebounce: number = 500;

	// elements specific vars
	private container: HTMLElement = {} as HTMLElement;
	private containerClass: string = 'keypad-container';
	private keysRowClass: string = 'keypad-row';
	private keysRowClassExtra: string = 'keypad-row-extra';
	private childButtonList: { [key: string]: Ch5KeypadButton; } = {};
	private runtimeChildButtonList: { [key: string]: TCh5KeypadButtonCreateDTO; } = {};


	//#endregion

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Keypad.ELEMENT_NAME, Ch5Keypad.SIGNAL_ATTRIBUTE_TYPES);
	}

	//#region 2. Setters and Getters
	public set contractName(value: string) {
		this.logger.start('set contractName("' + value + '")');

		value = (ComponentHelper.isNullOrUndefined(value)) ? '' : value;

		if (value !== this.contractName) {
			this._contractName = value;
			if (this.getAttribute('type') !== this._type) {
				this.setAttribute('contractname', this._contractName);
			}
		}
		this.logger.stop();
	}
	public get contractName(): string {
		return this._contractName;
	}

	public set type(value: TCh5KeypadType) {
		this.logger.start('set type ("' + value + '")');
		ComponentHelper.setAttributeValueOnControl(this, 'type', value, Ch5Keypad.TYPES,
			() => {
				this.typeHandler();
			}
		);
		this.logger.stop();
	}
	public get type(): TCh5KeypadType {
		return this._type;
	}

	public set shape(value: TCh5KeypadShape) {
		this.logger.start('set shape ("' + value + '")');
		ComponentHelper.setAttributeValueOnControl(this, 'shape', value, Ch5Keypad.SHAPES,
			() => {
				this.shapeHandler();
			}
		);
		this.logger.stop();
	}
	public get shape(): TCh5KeypadShape {
		return this._shape;
	}

	public set stretch(value: TCh5KeypadStretch | null) {
		this.logger.start('set stretch ("' + value + '")');
		if (value !== null) {
			if (this._stretch !== value) {
				if (Ch5Keypad.STRETCHES.indexOf(value) >= 0) {
					ComponentHelper.setAttributeValueOnControl(
						this, 'stretch', value, Ch5Keypad.STRETCHES,
						this.stretchHandler.bind(this)
					);
				}
			}
		}
		this.logger.stop();
	}
	public get stretch(): TCh5KeypadStretch | null {
		return this._stretch;
	}

	public set size(value: TCh5KeypadSize) {
		this.logger.start('set size ("' + value + '")');
		ComponentHelper.setAttributeValueOnControl(this, 'size', value, Ch5Keypad.SIZES,
			() => {
				this.sizeHandler();
			}
		);
		this.logger.stop();
	}
	public get size() {
		return this._size;
	}

	public set textOrientation(value: TCh5KeypadTextOrientation) {
		this.logger.start('set textOrientation ("' + value + '")');
		if (value !== null) {
			const orientations = [...Ch5Keypad.TEXT_ORIENTATIONS];
			ComponentHelper.setAttributeValueOnControl(
				this, 'textOrientation', value, orientations,
				this.textOrientationHandler.bind(this)
			);
		}
		this.logger.stop();
	}
	public get textOrientation(): TCh5KeypadTextOrientation {
		return this._textOrientation;
	}

	public set showExtraButton(value: boolean) {
		const isContractBased = this.checkIfContractAllows("useContractForExtraButtonShow", "receiveStateExtraButtonShow ", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateExtraButtonShow becomes void
			return;
		}
		this.logger.start('set showExtraButton ("' + value + '")');
		this.setAttributeAndProperty(this.KEYPAD_PROPERTIES.SHOW_EXTRA_BUTTON, value);
		// ComponentHelper.setAttributeValueOnControlAsBool(this, 'showExtraButton', value, false, () => {
		// 	if (!this._useContractForExtraButtonShow) {
		// 		this.showExtraButtonHandler();
		// 	}
		// });
	}
	public get showExtraButton(): boolean {
		return this._showExtraButton;
	}

	public set sendEventOnClickStart(value: string) {
		this.logger.start('set sendEventOnClickStart("' + value + '")');

		if (ComponentHelper.isNullOrUndefined(value) || isNaN(parseInt(value, 10))) {
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
		this.logger.start('Ch5Keypad set useContractForEnable("' + value + '")');

		const isUseContractForEnable = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || this._useContractForEnable === isUseContractForEnable) {
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

	/**
	 * useContractForShow specific getter-setter
	 */
	public set useContractForShow(value: boolean) {
		this.logger.start('Ch5Keypad set useContractForShow("' + value + '")');

		const isUseContractForShow = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || this._useContractForShow === isUseContractForShow) {
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
				this.info(' subs callback for signalReceiveShow: ', this._useContractForShowSignalValue,
					' Signal has value ', newValue);
				ComponentHelper.setAttributeToElement(this, 'show', newValue);
			}
		};

		this.setValueForReceiveStateBoolean(params);
		this.logger.stop();
	}
	public get useContractForShow(): boolean {
		return this._useContractForShow;
	}

	/**
	 * useContractForCustomStyle specific getter-setter
	 */
	public set useContractForCustomStyle(value: boolean) {
		this.logger.start('Ch5Keypad set useContractForCustomStyle("' + value + '")');

		const isUseContractForCustomStyle = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || this._useContractForCustomStyle === isUseContractForCustomStyle) {
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
				this.info(' subs callback for useContractForCustomStyle: ', this._useContractForCustomStyleSignalValue,
					' Signal has value ', newValue);
				this.customStyle = newValue;
			}
		};

		this.setValueForReceiveStateString(params);
		this.logger.stop();
	}
	public get useContractForCustomStyle(): boolean {
		return this._useContractForCustomStyle;
	}

	/**
	 * useContractForCustomClass specific getter-setter
	 */
	public set useContractForCustomClass(value: boolean) {
		this.logger.start(this.COMPONENT_NAME + ' set useContractForCustomClass("' + value + '")');

		const isUuseContractForCustomClass = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || this._useContractForCustomClass === isUuseContractForCustomClass) {
			return;
		}

		this.setAttribute('useContractForCustomClass', isUuseContractForCustomClass.toString());
		this._useContractForCustomClass = isUuseContractForCustomClass;
		const sigVal = contractName + "CustomClass";

		const params: TCh5CreateReceiveStateSigParams = {
			caller: this,
			attrKey: 'useContractForCustomClass',
			value: sigVal,
			callbackOnSignalReceived: (newValue: string | boolean) => {
				newValue = newValue as string;
				this.info(' subs callback for useContractForCustomClass: ',
					this._useContractForCustomClassSignalValue, ' Signal has value ', newValue);
				this.customClass = newValue;
			}
		};

		this.setValueForReceiveStateString(params);
		this.logger.stop();
	}
	public get useContractForCustomClass(): boolean {
		return this._useContractForCustomClass;
	}

	/**
	 * useContractForExtraButtonShow specific getter-setter
	 */
	public set useContractForExtraButtonShow(value: boolean) {
		this.logger.start(this.COMPONENT_NAME + ' set useContractForExtraButtonShow("' + value + '")');

		const isUseContractForExtraButtonShow = this.toBoolean(value);
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

		if (contractName.length === 0 || this._useContractForExtraButtonShow === isUseContractForExtraButtonShow) {
			return;
		}

		this.setAttribute('useContractForExtraButtonShow'.toLowerCase(), isUseContractForExtraButtonShow.toString());
		this._useContractForExtraButtonShow = isUseContractForExtraButtonShow;
		const sigVal = contractName + "ExtraButton";

		const params: TCh5CreateReceiveStateSigParams = {
			caller: this,
			attrKey: 'useContractForExtraButtonShow',
			value: sigVal,
			callbackOnSignalReceived: (newValue: string | boolean) => {
				newValue = newValue as boolean;
				this.info(' subs callback for useContractForExtraButtonShow: ', this._useContractForExtraButtonShowSignalValue,
					' Signal has value ', newValue);
				if (newValue || (!newValue && this.showExtraButton)) {
					this.showExtraButtonHandler();
				}
			}
		};

		this.setValueForReceiveStateString(params);
		this.logger.stop();
	}
	public get useContractForExtraButtonShow(): boolean {
		return this._useContractForExtraButtonShow;
	}

	public set receiveStateExtraButtonShow(value: string) {
		const isContractBased = this.checkIfContractAllows("useContractForExtraButtonShow", "receiveStateExtraButtonShow", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateExtraButtonShow becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateExtraButtonShow) {
			return;
		}

		this.clearBooleanSignalSubscription(this._receiveStateExtraButtonShow, this._subKeySigReceiveExtraButtonShow);

		this._receiveStateExtraButtonShow = value;
		this.setAttribute('receivestateextrabuttonshow', value);

		const recSigExtraButtonShowName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateExtraButtonShow);
		const recSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(recSigExtraButtonShowName);

		if (null === recSig) {
			return;
		}

		this._subKeySigReceiveExtraButtonShow = recSig.subscribe((newVal: boolean) => {
			this.info(' subs callback for signalReceiveExtraButtonShow: ', this._subKeySigReceiveExtraButtonShow, ' Signal has value ', newVal);
			this.showExtraButton = newVal;
			if (newVal) {
				this.classList.remove(Ch5Keypad.btnTypeClassPrefix + 'extra-row-hide');
				this.classList.add(Ch5Keypad.btnTypeClassPrefix + 'extra-row-show');
				this.classList.add('ch5-keypad--for-extra-button');
			} else {
				this.classList.remove(Ch5Keypad.btnTypeClassPrefix + 'extra-row-show');
				this.classList.add(Ch5Keypad.btnTypeClassPrefix + 'extra-row-hide');
				this.classList.remove('ch5-keypad--for-extra-button');
			}
		});
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', this.COMPONENT_NAME);

		this.logger.stop();
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", this.COMPONENT_NAME);
		super.initAttributes();
		// set data-ch5-id
		this.setAttribute('data-ch5-id', this.getCrId());
		// this.setAttribute('id', this.getCrId());

		ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5Keypad); // WAI-ARIA Attributes
		this.contractName = ComponentHelper.setAttributeToElement(this, 'contractName'.toLowerCase(), this._contractName);
		this.type = ComponentHelper.setAttributeToElement(this, 'type', this._type) as TCh5KeypadType;
		this.shape = ComponentHelper.setAttributeToElement(this, 'shape', this._shape) as TCh5KeypadShape;
		this.stretch = ComponentHelper.setAttributeToElement(this, 'stretch', this._stretch as string) as TCh5KeypadStretch;
		this.textOrientation = ComponentHelper.setAttributeToElement(this, 'textOrientation', this._textOrientation as string) as TCh5KeypadTextOrientation;
		this.sendEventOnClickStart = ComponentHelper.setAttributeToElement(this, 'sendEventOnClickStart'.toLowerCase(), this._sendEventOnClickStart);
		this.showExtraButton = this.getAttribute('showextrabutton') as unknown as boolean; // ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'showExtraButton', this._showExtraButton.toString()));
		this.size = ComponentHelper.setAttributeToElement(this, 'size', this._size) as TCh5KeypadSize;

		// DEV NOTE: if contract name exists, and the individual attribute values don't exist,
		// then the default value is true for useContractFor*
		// else useContractFor* picks value from attributes
		const isContractNameAvailable = Boolean(this.contractName).toString();
		this.useContractForEnable = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForEnable', isContractNameAvailable));
		this.useContractForShow = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForShow', isContractNameAvailable));
		this.useContractForCustomStyle = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForCustomStyle', isContractNameAvailable));
		this.useContractForCustomClass = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForCustomClass', isContractNameAvailable));
		this.useContractForExtraButtonShow = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForExtraButtonShow', isContractNameAvailable));

		// signals
		this.receiveStateEnable = ComponentHelper.setAttributesBasedValue(this.hasAttribute('receivestateenable'), this._receiveStateEnable, '');
		this.receiveStateCustomClass = ComponentHelper.setAttributesBasedValue(this.hasAttribute('receivestatecustomclass'), this._receiveStateCustomClass, '');
		this.receiveStateHidePulse = ComponentHelper.setAttributesBasedValue(this.hasAttribute('receivestatehidepulse'), this._receiveStateHidePulse, '');
		this.receiveStateCustomStyle = ComponentHelper.setAttributesBasedValue(this.hasAttribute('receivestatecustomstyle'), this._receiveStateCustomStyle, '');
		this.receiveStateShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute('receivestateshow'), this._receiveStateShow, '');
		this.receiveStateShowPulse = ComponentHelper.setAttributesBasedValue(this.hasAttribute('receivestateshowpulse'), this._receiveStateShowPulse, '');

		this.logger.stop();
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

		// set attributes based on onload attributes
		this.initAttributes();

		// build child elements ref object
		this.buildRuntimeChildButtonList();

		ComponentHelper.clearComponentContent(this);

		Promise.all([
			customElements.whenDefined('ch5-keypad-button')
		]).then(() => {
			// check if all components required to build Keypad are ready, instantiated and available for consumption
			this.onAllSubElementsCreated();
			this.initAttributes();
			if (this.isComponentLoaded) {
				this.info('connectedCallback() - rendered', this.COMPONENT_NAME);
			}
		});
		this.logger.stop();
	}

	/**
	 * Function create and bind events for Keypad once all the expected child elements are defined and
	 * ready for consumption
	 */
	private onAllSubElementsCreated() {
		this.logger.start('onAllSubElementsCreated() - start', this.COMPONENT_NAME);
		customElements.whenDefined('ch5-keypad').then(() => {
			// create element
			this.createElementsAndInitialize();

			// update class based on the current type chosen
			this.updateCssClasses();

			// events binding
			this.attachEventListeners();

			// check if the Keypad element has been created by verifying one of its properties

			// // initialize mutation observer if any
			// this.initCommonMutationObserver(this);

			// required post initial setup
			this.stretchHandler();

			this.isComponentLoaded = true;
		});
		this.logger.stop();
	}

	/**
	 * Function to create HTML elements of the components including child elements
	 */
	private createElementsAndInitialize() {
		if (!this._wasInstatiated) {
			this.createHtmlElements();
		}
		this._wasInstatiated = true;
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.logger.log("disconnectedCallback");
		this.removeEvents();
		this.unsubscribeFromSignals();

		if (this.container && this.container.style) {
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
			"showextrabutton",
			"sendeventonclickstart",
			"usecontractforenable",
			"usecontractforshow",
			"size",
			'receivestateextrabuttonshow',
			'usecontractforextrabuttonshow'
		];

		// received signals
		const receivedSignals: string[] = [];

		// sent signals
		const sentSignals: string[] = [];

		const ch5KeypadAttributes = commonAttributes.concat(attributes).concat(receivedSignals).concat(sentSignals);

		return ch5KeypadAttributes;
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
		if (oldValue === newValue) {
			this.logger.stop();
			return;
		}

		this.info('ch5-keypad attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
		const isValidContract: boolean = (ComponentHelper.getAttributeAsString(this, 'contractname', '').length > 0);

		switch (attr) {
			case 'usecontractforshow':
				this.useContractForShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforshow') && this.getAttribute('usecontractforshow') !== "false"), '');
				break;
			case 'usecontractforenable':
				this.useContractForEnable = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforenable') && this.getAttribute('usecontractforenable') !== "false"), '');
				break;
			case 'usecontractforcustomstyle':
				this.useContractForCustomStyle = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforcustomstyle') && this.getAttribute('usecontractforcustomstyle') !== "false"), '');
				break;
			case 'usecontractforcustomclass':
				this.useContractForCustomClass = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), (this.hasAttribute('usecontractforcustomclass') && this.getAttribute('usecontractforcustomclass') !== "false"), '');
				break;
			case 'receivestateextrabuttonshow':
				if (!isValidContract) {
					this.receiveStateExtraButtonShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
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
				this.type = newValue as TCh5KeypadType;
				break;
			case 'shape':
				this.shape = newValue as TCh5KeypadShape;
				break;
			case 'stretch':
				this.stretch = newValue as TCh5KeypadStretch;
				break;
			case 'textorientation':
				this.textOrientation = newValue as TCh5KeypadTextOrientation;
				break;
			case 'contractname':
				// Match and replace all the ending dots in the contract name and remove them, adding only 1 dot at the end.
				if (newValue !== newValue.replace(/[\.]+$/, '') + '.') {
					this.setAttribute('contractname', newValue.replace(/[\.]+$/, '') + '.');
					break;
				}
				this.contractName = newValue;
				this.updateContractNameBasedHandlers(this._contractName);
				break;
			case 'size':
				this.size = newValue as TCh5KeypadSize;
				break;
			case 'showextrabutton':
				this.showExtraButton = newValue as unknown as boolean;
				break;
			case 'show':
			case 'disabled':
				if (!isValidContract) {
					super.attributeChangedCallback(attr, oldValue, newValue);
				}
				break;
			default:
				this.logger.log("attributeChangedCallback: going to default");
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}

		this.logger.stop();
	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		for (const typeVal of Ch5Keypad.TYPES) {
			this.classList.remove(Ch5Keypad.btnTypeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.btnTypeClassPrefix + this.type);

		for (const typeVal of Ch5Keypad.SHAPES) {
			this.classList.remove(Ch5Keypad.btnShapeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.btnShapeClassPrefix + this.shape);

		for (const typeVal of Ch5Keypad.TEXT_ORIENTATIONS) {
			this.classList.remove(Ch5Keypad.btnTextOrientationClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.btnTextOrientationClassPrefix + this.textOrientation);

		for (const typeVal of Ch5Keypad.SIZES) {
			this.classList.remove(Ch5Keypad.btnSizeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Keypad.btnSizeClassPrefix + this.size);

		for (const typeVal of Ch5Keypad.STRETCHES) {
			this.classList.remove(Ch5Keypad.btnStretchClassPrefix + typeVal);
		}
		if (!!this.stretch && this.stretch.length > 0) { // checking for length since it does not have a default value
			this.classList.add(Ch5Keypad.btnStretchClassPrefix + this.stretch);
		}

		this.classList.add(Ch5Keypad.btnTypeClassPrefix +
			(this.showExtraButton ? "extra-row-show" : "extra-row-hide"));
	}

	protected attachEventListeners() {
		super.attachEventListeners();
		window.addEventListener('resize', this.onWindowResizeHandler.bind(this));
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Function to create all the elements required under the parent Keypad tag
	 */
	protected createHtmlElements(): void {
		this.logger.start('createHtmlElements', this.COMPONENT_NAME);
		this.classList.add(this.primaryCssClass);
		this.createAndAppendAllButtonsUnderKeypad();
		this.logger.stop();
	}

	/**
	 * Function to add all 5 buttons in the expected order if not added in the DOM
	 */
	private createAndAppendAllButtonsUnderKeypad() {
		// remove all child elements, since it will be created again in the right/expected order
		const childItems: Element[] = Array.from(this.children);
		for (const item of childItems) {
			item.remove();
		}
		this.createEmptyContainerDiv();
		const data: TCh5KeypadButtonCreateDTO[] =
			CH5KeypadButtonData.getBtnList(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
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
	}

	/**
	 * Function to create the container div which holds all the 5 buttons within dpad
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

	private showExtraButtonForNonContract() {
		if (!this._useContractForExtraButtonShow) {
			this.showExtraButtonHandler();
		}
	}
	/**
	 * Function to add the extra row of buttons if contract or attribute permits
	 */
	private showExtraButtonHandler() {
		this.logger.start(this.COMPONENT_NAME + ' > showExtraButtonHandler');
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
				CH5KeypadButtonData.getBtnList_Extra(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
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

	private checkIfContractAllows(attrToCheck: string, attrToSet: string, value: string | boolean): boolean {
		attrToCheck = attrToCheck.toLowerCase();
		attrToSet = attrToSet.toLowerCase();
		this.info('Ch5Keypad set ' + attrToCheck + '("' + value + '")');
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');
		const isContractBased = ComponentHelper.getAttributeAsBool(this, attrToSet, this.checkIfValueIsTruey(contractName));

		return isContractBased;
	}

	private buildRuntimeChildButtonList() {
		const childElements: Element[] = Array.from(this.children);
		if (childElements.length > 0) {
			for (const ele of childElements) {
				if (ele.tagName.toLowerCase() === 'ch5-keypad-button') {
					const item = CH5KeypadButtonData.getChildBtnDTOFromElement(ele, this.contractName, this.sendEventOnClickStart);
					if (!this.runtimeChildButtonList.hasOwnProperty(item.name)) {
						this.runtimeChildButtonList[item.name] = item;
					}
				}
			}
		}
	}

	private updateContractNameBasedHandlers(contractName: string) {
		this.logger.start(this.COMPONENT_NAME + ' > updateContractNameBasedHandlers');
		this.logger.stop();
	}

	private shapeHandler() {
		this.logger.start(this.COMPONENT_NAME + ' > shapeHandler');
		this.updateCssClasses();
		this.logger.stop();
	}

	private setContainerHeightAndWidth(height: number, width: number) {
		this.container.style.height = height + 'px';
		this.container.style.width = width + 'px';
		this.style.height = height + 'px';
		this.style.width = width + 'px';
	}

	private stretchHandler() {
		this.logger.start(this.COMPONENT_NAME + ' > stretchHandler');
		this.updateCssClasses();
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
		this.logger.start(this.COMPONENT_NAME + ' > typeHandler');
		this.updateCssClasses();
		this.logger.stop();
	}

	private textOrientationHandler() {
		this.logger.start(this.COMPONENT_NAME + ' > textOrientationHandler');
		this.updateCssClasses();
		this.logger.stop();
	}

	private updateEventClickHandlers(startIndex: number) {
		this.logger.start(this.COMPONENT_NAME + ' > updateEventClickHandlers');
		if (this.contractName.length <= 0) {
			for (const key in this.childButtonList) {
				if (this.childButtonList.hasOwnProperty(key)) {
					const btn = this.childButtonList[key];
					btn.setJoinBasedEventHandler(startIndex);
				}
			}
		}
		this.logger.stop();
	}

	private sizeHandler() {
		this.logger.start(this.COMPONENT_NAME + ' > sizeHandler');
		this.updateCssClasses();
		this.logger.stop();
	}

	/**
	 * Function to handle the resize event for keypad to be redrawn if required
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

	//#endregion

}

if (typeof window === "object"
	&& typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define(Ch5Keypad.ELEMENT_NAME, Ch5Keypad);
}

Ch5Keypad.registerSignalAttributeTypes();

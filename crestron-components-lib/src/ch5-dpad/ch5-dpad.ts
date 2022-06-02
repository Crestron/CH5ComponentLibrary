// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5DpadAttributes } from "./interfaces/i-ch5-dpad-attributes";
import { TCh5DpadShape, TCh5DpadStretch, TCh5DpadType, TCh5DpadSize } from "./interfaces/t-ch5-dpad";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5DpadButton } from "./ch5-dpad-button";

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

	/**
	 * No default value for Stretch
	 */
	public static readonly STRETCHES: TCh5DpadStretch[] = ['both', 'width', 'height'];

	public static readonly btnStretchClassPrefix: string = "ch5-dpad--stretch-";
	public static readonly btnTypeClassPrefix: string = "ch5-dpad--type-";
	public static readonly btnShapeClassPrefix: string = "ch5-dpad--shape-";
	public static readonly btnSizeClassPrefix: string = "ch5-dpad--size-";

	/**
	 * The first value is considered the default one
	 */
	public static readonly SIZES: TCh5DpadSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	/**
	 * COMPONENT_DATA is required for sass-schema generator file to build sufficient data
	 */
	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5Dpad.TYPES[0],
			values: Ch5Dpad.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: 'ch5-dpad--type-'
		},
		STRETCHES: {
			default: null,
			values: Ch5Dpad.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: Ch5Dpad.btnStretchClassPrefix
		},
		SHAPES: {
			default: Ch5Dpad.SHAPES[0],
			values: Ch5Dpad.SHAPES,
			key: 'shape',
			attribute: 'shape',
			classListPrefix: 'ch5-dpad--shape-'
		},
		SIZES: {
			default: Ch5Dpad.SIZES[0],
			values: Ch5Dpad.SIZES,
			key: 'size',
			attribute: 'size',
			classListPrefix: 'ch5-dpad--size-'
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
	public readonly cssClassPrefix = 'ch5-dpad';

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

	/**
	 * Size of the Dpad
	 */
	private _size: TCh5DpadSize = Ch5Dpad.SIZES[0];

	// state specific vars
	private isComponentLoaded: boolean = false;
	private isResizeInProgress: boolean = false;
	private readonly RESIZE_DEBOUNCE: number = 500;

	// elements specific vars
	private container: HTMLElement = {} as HTMLElement;
	private containerClass: string = 'dpad-container';

	//#endregion

	//#endregion

	//#region 2. Setters and Getters

	public set contractName(value: string) {
		this.logger.start('set contractName("' + value + '")');

		value = (_.isNil(value)) ? '' : value;

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

	public set type(value: TCh5DpadType) {
		this.logger.start('set type ("' + value + '")');
		ComponentHelper.setAttributeValueOnControl(this, 'type', value, Ch5Dpad.TYPES, this.updateCssClasses.bind(this));
		this.logger.stop();
	}
	public get type(): TCh5DpadType {
		return this._type;
	}

	public set shape(value: TCh5DpadShape) {
		this.logger.start('set shape ("' + value + '")');
		ComponentHelper.setAttributeValueOnControl(this, 'shape', value, Ch5Dpad.SHAPES,
			() => {
				this.checkAndRestructureDomOfDpad();
			}
		);
		this.logger.stop();
	}
	public get shape(): TCh5DpadShape {
		return this._shape;
	}

	public set stretch(value: TCh5DpadStretch | null) {
		this.logger.start('set stretch ("' + value + '")');
		if (value !== null) {
			const stretches = ['', ...Ch5Dpad.STRETCHES];
			ComponentHelper.setAttributeValueOnControl(this, 'stretch', value, stretches, this.stretchHandler.bind(this));
			this.stretchHandler();
		}
		this.logger.stop();
	}
	public get stretch(): TCh5DpadStretch | null {
		return this._stretch;
	}

	public set size(value: TCh5DpadSize) {
		this.logger.start('set size ("' + value + '")');
		ComponentHelper.setAttributeValueOnControl(this, 'size', value, Ch5Dpad.SIZES,
			() => {
				this.checkAndRestructureDomOfDpad();
			}
		);
		this.logger.stop();
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

	/**
	 * overriding default receiveStateShow specific getter-setter
	 */
	public set show(value: boolean) {
		const isContractBased = this.checkIfContractAllows("useContractForShow", "receiveStateShow", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateShow becomes void
			return;
		}
		if (value !== this._show) {
			this._show = value;
			this.setAttribute('show', value.toString());
		}
	}

	/**
	 *  overriding default receiveStateShow specific getter-setter
	 */
	public set disabled(value: boolean) {
		const isContractBased = this.checkIfContractAllows("useContractForEnable", "receiveStateEnable", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateEnable becomes void
			return;
		}
		if (null === value || undefined === value) {
			value = false;
		}
		if (value !== this._disabled) {
			this._disabled = this.toBoolean(value);
			if (this._disabled) {
				this.setAttribute('disabled', '');
			} else {
				this.removeAttribute('disabled');
			}
		}
	}

	/**
	 * overriding default receiveStateShow specific getter-setter
	 */
	public set receiveStateShow(value: string) {
		const isContractBased = this.checkIfContractAllows("useContractForShow", "receiveStateShow", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateShow becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateShow) {
			return;
		}

		this.clearBooleanSignalSubscription(this._receiveStateShow, this._subKeySigReceiveShow);

		this._receiveStateShow = value;
		this.setAttribute('receivestateshow', value);

		const recSigShowName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShow);
		const recSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(recSigShowName);

		if (null === recSig) {
			return;
		}

		this._subKeySigReceiveShow = recSig.subscribe((newVal: boolean) => {
			this.info(' subs callback for signalReceiveShow: ', this._subKeySigReceiveShow, ' Signal has value ', newVal);
			this.show = newVal;
		});
	}

	/**
	 * overriding default receiveStateEnable specific getter-setter
	 */
	public set receiveStateEnable(value: string) {
		const isContractBased = this.checkIfContractAllows("useContractForEnable", "receiveStateEnable", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateEnable becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateEnable) {
			return;
		}

		this.clearBooleanSignalSubscription(this._receiveStateEnable, this._subKeySigReceiveEnable);

		this._receiveStateEnable = value;
		this.setAttribute('receivestateenable', value);

		const recSigEnableName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateEnable);
		const recSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(recSigEnableName);

		if (null === recSig) {
			return;
		}
		let hasSignalChanged = false;
		this._subKeySigReceiveEnable = recSig.subscribe((newVal: boolean) => {
			this.info(' subs callback for signalReceiveEnable: ', this._subKeySigReceiveEnable, ' Signal has value ', newVal);

			if (!this.disabled !== newVal) {
				hasSignalChanged = true;
			}
			if (hasSignalChanged) {
				if (true === newVal) {
					this.removeAttribute('disabled');
				} else {
					this.setAttribute('disabled', '');
				}
			}
		});
	}

	/**
	 * overriding default receiveStateHidePulse specific getter-setter
	 */
	public set receiveStateHidePulse(value: string) {
		this.info('Ch5Dpad set receiveStateHidePulse("' + value + '")');
		const isContractBased = this.checkIfContractAllows("useContractForShow", "receiveStateHidePulse", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateHidePulse becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateHidePulse) {
			return;
		}

		this.clearBooleanSignalSubscription(this._receiveStateHidePulse, this._subKeySigReceiveHidePulse);

		this._receiveStateHidePulse = value;
		this.setAttribute('receivestatehidepulse', value);

		const recSigHidePulseName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateHidePulse);
		const recSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(recSigHidePulseName);

		if (null === recSig) {
			return;
		}

		this._subKeySigReceiveHidePulse = recSig.subscribe((newVal: boolean) => {
			this.info(' subs callback for signalReceiveHidePulse: ', this._subKeySigReceiveHidePulse, ' Signal has value ', newVal);
			if (null !== recSig) {
				if (false === recSig.prevValue && true === newVal) {
					this.setAttribute('show', 'false');
				}
			} else {
				this.info(' subs callback for signalReceiveHidePulse: ', this._subKeySigReceiveHidePulse, ' recSig is null');
			}
		});
	}

	/**
	 * overriding default receiveStateShowPulse specific getter-setter
	 */
	public set receiveStateShowPulse(value: string) {
		this.info('Ch5Dpad set receiveStateShowPulse("' + value + '")');
		const isContractBased = this.checkIfContractAllows("useContractForShow", "receiveStateShowPulse", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateShowPulse becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateShowPulse) {
			return;
		}

		this.clearBooleanSignalSubscription(this._receiveStateShowPulse, this._subKeySigReceiveShowPulse);

		this._receiveStateShowPulse = value;
		this.setAttribute('receivestateshowpulse', value);

		const recSigShowPulseName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowPulse);
		const recSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(recSigShowPulseName);

		if (null === recSig) {
			return;
		}

		this._subKeySigReceiveShowPulse = recSig.subscribe((newVal: boolean) => {
			this.info(' subs callback for signalReceiveShowPulse: ', this._subKeySigReceiveShowPulse, ' Signal has value ', newVal);
			if (null !== recSig) {
				const _newVal = (newVal as never as { repeatdigital: boolean }).repeatdigital !== undefined ? (newVal as never as { repeatdigital: boolean }).repeatdigital : newVal;
				if ((recSig.prevValue as never as { repeatdigital: boolean }).repeatdigital !== undefined) {
					if (false === (recSig.prevValue as never as { repeatdigital: boolean }).repeatdigital && true === _newVal) {
						this.setAttribute('show', 'true')
					}
					return;
				}
				if (false === recSig.prevValue && true === _newVal) {
					this.setAttribute('show', 'true')
				}
			}
		});
	}

	/**
	 * overriding default receiveStateCustomStyle specific getter-setter
	 */
	public set receiveStateCustomStyle(value: string) {
		const isContractBased = this.checkIfContractAllows("useContractForCustomStyle", "receiveStateCustomStyle", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateCustomStyle becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateCustomStyle) {
			return;
		}

		this.clearStringSignalSubscription(this._receiveStateCustomStyle, this._subKeySigReceiveCustomStyle);

		this._receiveStateCustomStyle = value;
		this.setAttribute('receivestatecustomstyle', value);

		const recSigCustomStyleName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateCustomStyle);
		const recSig: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(recSigCustomStyleName);

		if (null === recSig) {
			return;
		}

		let hasSignalChanged = false;
		this._subKeySigReceiveCustomStyle = recSig.subscribe((newVal: string) => {
			this.info(' subs callback for signalReceiveCustomStyle: ', this._subKeySigReceiveCustomStyle, ' Signal has value ', newVal);
			if ('' !== newVal) {
				hasSignalChanged = true;
			}
			if (newVal !== this.customStyle && hasSignalChanged) {
				this.setAttribute('customStyle', newVal);
			}
		});
	}

	/**
	 * overriding default receiveStateCustomClass specific getter-setter
	 */
	public set receiveStateCustomClass(value: string) {
		const isContractBased = this.checkIfContractAllows("useContractForCustomClass", "receiveStateCustomClass", value);
		if (isContractBased) {
			// contract name exists and attribute allows it to be based on contract, then receiveStateCustomClass becomes void
			return;
		}
		value = this._checkAndSetStringValue(value);
		if ('' === value || value === this._receiveStateCustomClass) {
			return;
		}

		this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);

		this._receiveStateCustomClass = value;
		this.setAttribute('receivestatecustomclass', value);

		const recSigCustomClassName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateCustomClass);
		const recSig: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(recSigCustomClassName);

		if (null === recSig) {
			return;
		}
		let hasSignalChanged = false;

		this._subKeySigReceiveCustomClass = recSig.subscribe((newVal: string) => {
			this.info('subs callback for signalReceiveCustomClass: ', this._receiveStateCustomClass, ' Signal has value ', newVal);
			if ('' !== newVal) {
				hasSignalChanged = true;
			}
			if (newVal !== this.customClass && hasSignalChanged) {
				// this.setAttribute('customclass', newVal);
				this.customClass = newVal;
			}
		});
	}

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

		Promise.all([
			customElements.whenDefined('ch5-dpad-button'),
		]).then(() => {
			// check if all components required to build dpad are ready, instantiated and available for consumption
			this.onAllSubElementsCreated();
			this.initAttributes();
		});
		if (this.isComponentLoaded) {
			this.info('connectedCallback() - rendered', this.COMPONENT_NAME);
		}
		this.logger.stop();
	}

	/**
	 * Function create and bind events for dpad once all the expected child elements are defined and
	 * ready for consumption
	 */
	private onAllSubElementsCreated() {
		this.logger.start('onAllSubElementsCreated() - start', this.COMPONENT_NAME);
		customElements.whenDefined('ch5-dpad').then(() => {
			// create element
			this.createElementsAndInitialize();

			// update class based on the current type chosen
			this.updateCssClasses();

			// events binding
			this.attachEventListeners();

			// check if the dpad element has been created by verifying one of its properties

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
		this.removeEvents();
		this.unsubscribeFromSignals();

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
			case 'receivestateshow':
				if (!isValidContract) {
					this.receiveStateShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'receivestateenable':
				if (!isValidContract) {
					this.receiveStateEnable = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'receivestateshowpulse':
				if (!isValidContract) {
					this.receiveStateShowPulse = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'receivestatehidepulse':
				if (!isValidContract) {
					this.receiveStateHidePulse = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'receivestatecustomstyle':
				if (!isValidContract) {
					this.receiveStateCustomStyle = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'receivestatecustomclass':
				if (!isValidContract) {
					this.receiveStateCustomClass = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'sendeventonclickstart':
				if (!isValidContract) {
					this.sendEventOnClickStart = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
				}
				break;
			case 'type':
				this.type = newValue as TCh5DpadType;
				break;
			case 'shape':
				this.shape = newValue as TCh5DpadShape;
				break;
			case 'stretch':
				this.stretch = newValue as TCh5DpadStretch;
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
				this.size = newValue as TCh5DpadSize;
				break;
			default:
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
		let centerBtn;
		let upBtn;
		let rightBtn;
		let downBtn;
		let leftBtn;
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
		})
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
		this.contractName = ComponentHelper.setAttributeToElement(this, 'contractName'.toLowerCase(), this._contractName);
		this.sendEventOnClickStart = ComponentHelper.setAttributeToElement(this, 'sendEventOnClickStart'.toLowerCase(), this._sendEventOnClickStart);
		this.type = ComponentHelper.setAttributeToElement(this, 'type', this._type) as TCh5DpadType;
		this.shape = ComponentHelper.setAttributeToElement(this, 'shape', this._shape) as TCh5DpadShape;
		this.stretch = ComponentHelper.setAttributeToElement(this, 'stretch', this._stretch as string) as TCh5DpadStretch;
		this.size = ComponentHelper.setAttributeToElement(this, 'size', this._size) as TCh5DpadSize;

		// DEV NOTE: if contract name exists, and the individual attribute values don't exist, 
		// then the default value is true for useContractFor*
		// else useContractFor* picks value from attributes
		const isContractNameAvailable = Boolean(this.contractName).toString();
		this.useContractForEnable = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForEnable'.toLowerCase(), String(this._useContractForEnable)));
		this.useContractForShow = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForShow'.toLowerCase(), String(this._useContractForShow)));
		this.useContractForCustomStyle = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForCustomStyle'.toLowerCase(), String(this._useContractForCustomStyle)));
		this.useContractForCustomClass = ComponentHelper.getBoolFromString(ComponentHelper.setAttributeToElement(this, 'useContractForCustomClass'.toLowerCase(), String(this._useContractForCustomClass)));

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
			this.classList.remove(Ch5Dpad.btnTypeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Dpad.btnTypeClassPrefix + this.type);

		for (const typeVal of Ch5Dpad.SHAPES) {
			this.classList.remove(Ch5Dpad.btnShapeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Dpad.btnShapeClassPrefix + this.shape);

		for (const typeVal of Ch5Dpad.SIZES) {
			this.classList.remove(Ch5Dpad.btnSizeClassPrefix + typeVal);
		}
		this.classList.add(Ch5Dpad.btnSizeClassPrefix + this.size);

		for (const typeVal of Ch5Dpad.STRETCHES) {
			this.classList.remove(Ch5Dpad.btnStretchClassPrefix + typeVal);
		}
		if (!!this.stretch && this.stretch.length > 0) { // checking for length since it does not have a default value
			this.classList.add(Ch5Dpad.btnStretchClassPrefix + this.stretch);
			if (!!this.size && this.size.length > 0) {
				this.classList.remove(Ch5Dpad.btnSizeClassPrefix + this.size);
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
		if (this.children.length === 0) {
			// nothing to do, all buttons will be appended as required
			return;
		} else if (this.children.length === 1 &&
			this.children[0].tagName.toLowerCase() === 'div' &&
			this.children[0].classList.contains(this.containerClass)) {
			this.removeDuplicateChildElements(this.children[0], true);
		} else {
			this.removeDuplicateChildElements(this, true);
		}
		this.updateCssClasses();

		this.logger.stop();
	}

	private removeDuplicateChildElements(elementToCheck: Element = this, isChildDiv: boolean = false) {
		let childItems: Element[] = Array.from(elementToCheck.children);

		const refobj: any = {}; // stores the reference of all buttons relevant for dpad

		// // FIRST -A: remove all duplciate entries under DPAD
		if (childItems.length > 0) {
			if (childItems.length === 5) {
				const keysArray = childItems.map((item) => item.getAttribute('key'));
				const isDuplicate = keysArray.some((item, index) => keysArray.indexOf(item) !== index);
				if (isDuplicate) {
					const dupicatElementIndex = keysArray.findIndex((item, index) => keysArray.indexOf(item) !== index);
					childItems[dupicatElementIndex].remove();
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

	private checkIfContractAllows(attrToCheck: string, attrToSet: string, value: string | boolean): boolean {
		attrToCheck = attrToCheck.toLowerCase();
		attrToSet = attrToSet.toLowerCase();
		this.info('Ch5Dpad checkIfContractAllows set ' + attrToCheck + '("' + value + '")');
		const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');
		const isContractBased = ComponentHelper.getAttributeAsBool(this, attrToSet, this.checkIfValueIsTruey(contractName));

		return isContractBased;
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
				const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.center;
				centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(upBtn)) {
				const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.up;
				upBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(rightBtn)) {
				const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.right;
				rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(downBtn)) {
				const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.down;
				downBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(leftBtn)) {
				const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.left;
				leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
		}
	}
	private updateContractNameBasedHandlers(contractName: string) {
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
				const contractVal = contractName + CH5DpadContractUtils.contractSuffix.center;
				centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(upBtn)) {
				const contractVal = contractName + CH5DpadContractUtils.contractSuffix.up;
				upBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(rightBtn)) {
				const contractVal = contractName + CH5DpadContractUtils.contractSuffix.right;
				rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(downBtn)) {
				const contractVal = contractName + CH5DpadContractUtils.contractSuffix.down;
				downBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(leftBtn)) {
				const contractVal = contractName + CH5DpadContractUtils.contractSuffix.left;
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
			if (dimensionVal > 0) {
				this.container.style.height = dimensionVal + 'px';
				this.container.style.width = dimensionVal + 'px';
			} else {
				this.container.style.removeProperty('height');
				this.container.style.removeProperty('width');
			}
		}
		// if the shape is a 'plus', line-height of icons need to be managed well
		if (this.shape === Ch5Dpad.SHAPES[0]) {
			const btns = Array.from(this.getElementsByClassName('direction-btn'));
			for (const btn of btns) {
				const ele = btn.getElementsByClassName('icon-class');
				if (!!ele && ele.length > 0 && dimensionVal > 0) {
					(ele[0] as HTMLElement).style.lineHeight = dimensionVal / 3 + 'px';
				}
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

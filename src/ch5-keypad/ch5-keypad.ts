// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5KeypadBtn } from "./ch5-keypad-btn";
import { CH5KeypadBtnData } from "./ch5-keypad-btn-data";
import { ICh5KeypadAttributes } from "./interfaces/i-ch5-keypad-interfaces";
import { TCh5KeypadBtnCreateDTO, TCh5KeypadShape, TCh5KeypadStretch, TCh5KeypadType } from "./interfaces/t-ch5-keypad";

export class Ch5Keypad extends Ch5Common implements ICh5KeypadAttributes {
    //#region 1. Variables
    //#region 1.1 readonly variables
    /**
     * The first value is considered the default one
     */
    public static readonly TYPES: TCh5KeypadType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

    /**
     * The first value is considered the default one
     */
    public static readonly SHAPES: TCh5KeypadShape[] = ['rounded', 'square', 'circle'];

    /**
     * No default value for Stretch
     */
    public static readonly STRETCHES: TCh5KeypadStretch[] = ['both', 'width', 'height'];

    public readonly primaryCssClass = 'ch5-keypad';
    public readonly cssClassPrefix = 'ch5-keypad';

    //#endregion

    //#region 1.2 private / protected variables
    // private setter getter specific vars
    private COMPONENT_NAME: string = "ch5-keypad";
    private _contractName: string = '';
    private _type: TCh5KeypadType = Ch5Keypad.TYPES[0];
    private _shape: TCh5KeypadShape = Ch5Keypad.SHAPES[0];
    private _stretch: TCh5KeypadStretch | null = null;
    private _sendEventOnClickStart: string = '';
    private _showExtraButton: boolean = false;
    private _useContractforEnable: boolean = false;
    private _useContractForShow: boolean = false;
    private _useContractForCustomStyle: boolean = false;
    private _useContractForCustomClass: boolean = false;
    private _useContractForExtraButtonShow: boolean = false;
    private _useContractforEnableSignalValue: string = '';
    private _useContractForShowSignalValue: string = '';
    private _useContractForCustomStyleSignalValue: string = '';
    private _useContractForCustomClassSignalValue: string = '';
    private _useContractForExtraButtonShowSignalValue: string = '';

    // state specific vars
    private isComponentLoaded: boolean = false;
    private btnTypeClassPrefix: string = "ch5-keypad--type-";
    private btnShapeClassPrefix: string = "ch5-keypad--shape-";

    // elements specific vars
    private container: HTMLElement = {} as HTMLElement;
    private containerClass: string = 'keypad-container';
    private keysRowClass: string = 'keypad-row';
    private keysRowClassExtra: string = 'keypad-row-extra';
    private childButtonList: { [key: string]: Ch5KeypadBtn; } = {};
    private runtimeChildButtonList: { [key: string]: TCh5KeypadBtnCreateDTO; } = {};

    //#endregion

    //#endregion

    //#region 2. Setters and Getters


    /**
     * contractName specif getter-setter
     */
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

    /**
     * type specif getter-setter
     */
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

    /**
     * shape specif getter-setter
     */
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

    /**
     * stretch specif getter-setter
     */
    public set stretch(value: TCh5KeypadStretch | null) {
        this.logger.start('set stretch ("' + value + '")');
        if (value !== null) {
            const stretches = ['', ...Ch5Keypad.STRETCHES];
            ComponentHelper.setAttributeValueOnControl(
                this, 'stretch', value, stretches,
                this.stretchHandler.bind(this)
            );
        }
        this.logger.stop();
    }
    public get stretch(): TCh5KeypadStretch | null {
        return this._stretch;
    }

    /**
     * showExtraButton specif getter-setter
     */
    public set showExtraButton(value: boolean) {
        this.logger.start('set showExtraButton ("' + value + '")');
        ComponentHelper.setAttributeValueOnControlAsBool(
            this, 'showExtraButton', value, false,
            () => {
                if (!this._useContractForExtraButtonShow) {
                    this.showExtraButtonHandler();
                }
            }
        );
    }
    public get showExtraButton(): boolean {
        return this._showExtraButton;
    }

    /**
     * sendEventOnClickStart specif getter-setter
     */
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

    /**
     * useContractforEnable specif getter-setter
     */
    public set useContractforEnable(value: boolean) {
        this.logger.start('Ch5Keypad set useContractforEnable("' + value + '")');

        const isUseContractforEnable = this.toBoolean(value);
        const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

        if (contractName.length === 0 || this._useContractForShow === isUseContractforEnable) {
            return;
        }

        this.setAttribute('useContractforEnable'.toLowerCase(), isUseContractforEnable.toString());
        this._useContractForCustomClass = isUseContractforEnable;
        const sigVal = contractName + ".Enable";

        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'useContractforEnable',
            value: sigVal,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                newValue = (!newValue).toString();
                this.info(' subs callback for useContractforEnable: ', this._useContractforEnableSignalValue,
                    ' Signal has value ', newValue);
                ComponentHelper.setAttributeToElement(this, 'disabled', newValue);
            }
        };

        this.setValueForReceiveStateBoolean(params);
        this.logger.stop();
    }
    public get useContractforEnable(): boolean {
        return this._useContractforEnable;
    }

    /**
     * useContractForShow specif getter-setter
     */
    public set useContractForShow(value: boolean) {
        this.logger.start('Ch5Keypad set useContractForShow("' + value + '")');

        const isUseContractForShow = this.toBoolean(value);
        const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

        if (contractName.length === 0 || this._useContractForShow === isUseContractForShow) {
            return;
        }

        this.setAttribute('useContractForShow'.toLowerCase(), isUseContractForShow.toString());
        const sigVal = contractName + ".Show";

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
     * useContractForCustomStyle specif getter-setter
     */
    public set useContractForCustomStyle(value: boolean) {
        this.logger.start('Ch5Keypad set useContractForCustomStyle("' + value + '")');

        const isUseContractForCustomStyle = this.toBoolean(value);
        const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

        if (contractName.length === 0 || this._useContractForCustomStyle === isUseContractForCustomStyle) {
            return;
        }

        this.setAttribute('usecontractforcustomstyle', isUseContractForCustomStyle.toString());
        this._useContractForCustomClass = isUseContractForCustomStyle;
        const sigVal = contractName + ".CustomStyle";

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
     * useContractForCustomClass specif getter-setter
     */
    public set useContractForCustomClass(value: boolean) {
        this.logger.start(this.COMPONENT_NAME + ' set useContractForCustomClass("' + value + '")');

        const isUuseContractForCustomClass = this.toBoolean(value);
        const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

        if (contractName.length === 0 || this._useContractForCustomClass === isUuseContractForCustomClass) {
            return;
        }

        this.setAttribute('useContractForCustomClass'.toLowerCase(), isUuseContractForCustomClass.toString());
        this._useContractForCustomClass = isUuseContractForCustomClass;
        const sigVal = contractName + ".CustomClass";

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
     * useContractForExtraButtonShow specif getter-setter
     */
    public set useContractForExtraButtonShow(value: boolean) {
        this.logger.start(this.COMPONENT_NAME + ' set useContractForExtraButtonShow("' + value + '")');

        const isUuseContractForExtraButtonShow = this.toBoolean(value);
        const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

        if (contractName.length === 0 || this._useContractForExtraButtonShow === isUuseContractForExtraButtonShow) {
            return;
        }

        this.setAttribute('useContractForExtraButtonShow'.toLowerCase(), isUuseContractForExtraButtonShow.toString());
        this._useContractForExtraButtonShow = isUuseContractForExtraButtonShow;
        const sigVal = contractName + ".CustomClass";

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

    /**
     *  overriding default receiveStateShow specif getter-setter
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
     *  overriding default receiveStateShow specif getter-setter
     */
    public set disabled(value: boolean) {
        const isContractBased = this.checkIfContractAllows("useContractforEnable", "receiveStateEnable", value);
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
     * overriding default receiveStateShow specif getter-setter
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
     * overriding default receiveStateEnable specif getter-setter
     */
    public set receiveStateEnable(value: string) {
        const isContractBased = this.checkIfContractAllows("useContractforEnable", "receiveStateEnable", value);
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
     * overriding default receiveStateHidePulse specif getter-setter
     */
    public set receiveStateHidePulse(value: string) {
        this.info('Ch5Keypad set receiveStateHidePulse("' + value + '")');
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
     * overriding default receiveStateShowPulse specif getter-setter
     */
    public set receiveStateShowPulse(value: string) {
        this.info('Ch5Keypad set receiveStateShowPulse("' + value + '")');
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
     * overriding default receiveStateCustomStyle specif getter-setter
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
     * overriding default receiveStateCustomClass specif getter-setter
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

    //#region 3. Lifecycle Hooks

    public constructor() {
        super();
        this.logger.start('constructor()', this.COMPONENT_NAME);

        // set attributes based on onload attributes
        this.initAttributes();

        // build child elements ref object
        this.buildRuntimeChildButtonList();
        
        ComponentHelper.clearComponentContent(this);

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

        ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5Keypad); // WAI-ARIA Attributes
        this.contractName = ComponentHelper.setAttributeToElement(this,
            'contractName'.toLowerCase(), this._contractName);
        this.type = ComponentHelper.setAttributeToElement(this,
            'type', this._type) as TCh5KeypadType;
        this.shape = ComponentHelper.setAttributeToElement(this,
            'shape', this._shape) as TCh5KeypadShape;
        this.stretch = ComponentHelper.setAttributeToElement(this,
            'stretch', this._stretch as string) as TCh5KeypadStretch;
        this.sendEventOnClickStart = ComponentHelper.setAttributeToElement(
            this, 'sendEventOnClickStart'.toLowerCase(), this._sendEventOnClickStart);

        this.showExtraButton = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'showExtraButton', this._showExtraButton.toString())
        );

        // DEV NOTE: if contract name exists, and the individual attribute values don't exist, 
        // then the default value is true for useContractFor*
        // else useContractFor* picks value from attributes
        const isContractNameAvailable = Boolean(this.contractName).toString();
        this.useContractforEnable = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractforEnable', isContractNameAvailable));
        this.useContractForShow = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForShow', isContractNameAvailable));
        this.useContractForCustomStyle = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForCustomStyle', isContractNameAvailable));
        this.useContractForCustomStyle = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForCustomClass', isContractNameAvailable));

        this.logger.stop();
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

        Promise.all([
            customElements.whenDefined('ch5-keypad-btn')
        ]).then(() => {
            // check if all components required to build Keypad are ready, instantiated and available for consumption
            this.onAllSubElementsCreated();
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
        this.removeEvents();
        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    private removeEvents() {
        // throw new Error("Method not implemented or element is not structured correctly.");
        super.removeEventListeners();
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
            "usecontractforshow"
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
                this.useContractForShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforenable':
                this.useContractforEnable = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforcustomstyle':
                this.useContractForCustomStyle = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforcustomclass':
                this.useContractForCustomClass = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
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
                this.type = newValue as TCh5KeypadType;
                break;
            case 'shape':
                this.shape = newValue as TCh5KeypadShape;
                break;
            case 'stretch':
                this.stretch = newValue as TCh5KeypadStretch;
                break;
            case 'contractname':
                this.contractName = newValue;
                this.updateContractNameBasedHandlers(this._contractName);
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }

        this.logger.stop();
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();

        for (const typeVal of Ch5Keypad.TYPES) {
            this.classList.remove(this.btnTypeClassPrefix + typeVal);
        }
        this.classList.add(this.btnTypeClassPrefix + this.type);

        for (const typeVal of Ch5Keypad.SHAPES) {
            this.classList.remove(this.btnShapeClassPrefix + typeVal);
        }
        this.classList.add(this.btnShapeClassPrefix + this.shape);

        this.classList.add(this.btnTypeClassPrefix +
            ((this.showExtraButton) ? "extra-row-hide" : "extra-row-hide"));
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
        const data: TCh5KeypadBtnCreateDTO[] =
            CH5KeypadBtnData.getBtnList(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
        let rowEle = this.appendKeysRowToContainer();
        for (let i = 0; i < data.length; i++) {
            if (i % 3 === 0) {
                rowEle = this.appendKeysRowToContainer();
                this.container.appendChild(rowEle);
            }
            const btn = data[i];
            const keyBtn = new Ch5KeypadBtn(btn);
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

        const doesContractPermit = (this.contractName.length > 0 && this.useContractForExtraButtonShow);

        if ((doesContractPermit || (!doesContractPermit && this.showExtraButton)) &&
            (!!this.container.classList &&
                this.container.classList.contains(this.containerClass))) {
            const rowEle = this.appendKeysRowToContainer();
            this.container.appendChild(rowEle);

            rowEle.classList.add(this.keysRowClassExtra);
            const extraBtns: TCh5KeypadBtnCreateDTO[] =
                CH5KeypadBtnData.getBtnList_Extra(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
            for (const btn of extraBtns) {
                const keyBtn = new Ch5KeypadBtn(btn);
                this.childButtonList[btn.name] = keyBtn;
                rowEle.appendChild(keyBtn);
            }
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
                if (ele.tagName.toLowerCase() === 'ch5-child-btn') {
                    const item = CH5KeypadBtnData.getChildBtnDTOFromElement(ele, this.contractName, this.sendEventOnClickStart);
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

    private stretchHandler() {
        this.logger.start(this.COMPONENT_NAME + ' > stretchHandler');
        this.updateCssClasses();
        this.logger.stop();
    }

    private typeHandler() {
        this.logger.start(this.COMPONENT_NAME + ' > typeHandler');
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



    //#endregion

    //#region 5. Events
    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-keypad', Ch5Keypad);
}
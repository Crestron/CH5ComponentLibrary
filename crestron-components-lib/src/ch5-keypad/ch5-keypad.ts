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
import { Ch5KeypadButton } from "./ch5-keypad-btn";
import { CH5KeypadButtonData } from "./ch5-keypad-btn-data";
import { ICh5KeypadAttributes } from "./interfaces/i-ch5-keypad-attributes";
import { TCh5KeypadButtonCreateDTO, TCh5KeypadShape, TCh5KeypadSize, TCh5KeypadStretch, TCh5KeypadTextOrientation, TCh5KeypadType } from "./interfaces/t-ch5-keypad";
import {Ch5SignalElementAttributeRegistryEntries} from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5Keypad extends Ch5Common implements ICh5KeypadAttributes {
    //#region 1. Variables
    //#region 1.1 readonly variables

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
        sendeventontouch: { direction: "event", booleanJoin: 1, contractName: true }
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
    private _receiveStateExtraButtonShow : string = '';
    private _subKeySigReceiveExtraButtonShow: string = '';
    private _useContractForEnable: boolean = false;
    private _useContractForShow: boolean = false;
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

    //#endregion

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

        const isUseContractforEnable = this.toBoolean(value);
        const contractName = ComponentHelper.getAttributeAsString(this, 'contractname', '');

        if (contractName.length === 0 || this._useContractForShow === isUseContractforEnable) {
            return;
        }

        this.setAttribute('useContractForEnable'.toLowerCase(), isUseContractforEnable.toString());
        this._useContractForCustomClass = isUseContractforEnable;
        const sigVal = contractName + ".Enable";

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
     * useContractForCustomClass specific getter-setter
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
     * useContractForExtraButtonShow specific getter-setter
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
     *  overriding default receiveStateShow specific getter-setter
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
                if (this.classList.contains(Ch5Keypad.btnTypeClassPrefix + 'extra-row-hide')) {
                    this.classList.remove(Ch5Keypad.btnTypeClassPrefix + 'extra-row-hide');
                }
                if (!this.classList.contains(Ch5Keypad.btnTypeClassPrefix + 'extra-row-show')) {
                    this.classList.add(Ch5Keypad.btnTypeClassPrefix + 'extra-row-show');
                }
            } else {
                if (this.classList.contains(Ch5Keypad.btnTypeClassPrefix + 'extra-row-show')) {
                    this.classList.remove(Ch5Keypad.btnTypeClassPrefix + 'extra-row-show');
                }
                if (!this.classList.contains(Ch5Keypad.btnTypeClassPrefix + 'extra-row-hide')) {
                    this.classList.add(Ch5Keypad.btnTypeClassPrefix + 'extra-row-hide');
                }
            }
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
     * overriding default receiveStateShowPulse specific getter-setter
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
        this.setAttribute('id', this.getCrId());

        ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5Keypad); // WAI-ARIA Attributes
        this.contractName = ComponentHelper.setAttributeToElement(this,
            'contractName'.toLowerCase(), this._contractName);
        this.type = ComponentHelper.setAttributeToElement(this,
            'type', this._type) as TCh5KeypadType;
        this.shape = ComponentHelper.setAttributeToElement(this,
            'shape', this._shape) as TCh5KeypadShape;
        this.stretch = ComponentHelper.setAttributeToElement(this,
            'stretch', this._stretch as string) as TCh5KeypadStretch;
        this.textOrientation = ComponentHelper.setAttributeToElement(this,
            'textOrientation', this._textOrientation as string) as TCh5KeypadTextOrientation;
        this.sendEventOnClickStart = ComponentHelper.setAttributeToElement(
            this, 'sendEventOnClickStart'.toLowerCase(), this._sendEventOnClickStart);

        this.showExtraButton = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'showExtraButton', this._showExtraButton.toString())
        );

        this.size = ComponentHelper.setAttributeToElement(this, 'size', this._size) as TCh5KeypadSize;

        // DEV NOTE: if contract name exists, and the individual attribute values don't exist,
        // then the default value is true for useContractFor*
        // else useContractFor* picks value from attributes
        const isContractNameAvailable = Boolean(this.contractName).toString();
        this.useContractForEnable = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForEnable', isContractNameAvailable));
        this.useContractForShow = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForShow', isContractNameAvailable));
        this.useContractForCustomStyle = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForCustomStyle', isContractNameAvailable));
        this.useContractForCustomStyle = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForCustomClass', isContractNameAvailable));
        this.useContractForExtraButtonShow = ComponentHelper.getBoolFromString(
            ComponentHelper.setAttributeToElement(this,
                'useContractForExtraButtonShow', isContractNameAvailable));

        this.logger.stop();
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

        Promise.all([
            customElements.whenDefined('ch5-keypad-button')
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
                this.useContractForShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforenable':
                this.useContractForEnable = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
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
            case 'receivestateextrabuttonshow':
                if (!isValidContract) {
                    this.receiveStateExtraButtonShow = ComponentHelper.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
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
            case 'textorientation':
                this.textOrientation = newValue as TCh5KeypadTextOrientation;
                break;
            case 'contractname':
                this.contractName = newValue;
                this.updateContractNameBasedHandlers(this._contractName);
                break;
            case 'size':
                this.size = newValue as TCh5KeypadSize;
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
            if (!!this.size && this.size.length > 0) {
				this.classList.remove(Ch5Keypad.btnSizeClassPrefix + this.size);
			}
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
            const extraBtns: TCh5KeypadButtonCreateDTO[] =
                CH5KeypadButtonData.getBtnList_Extra(this.runtimeChildButtonList, this.contractName, this.sendEventOnClickStart);
            for (const btn of extraBtns) {
                const keyBtn = new Ch5KeypadButton(btn);
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

                const cellDimensionToRender: number = Math.min(requiredCellHeight, requiredCellWidth);

                this.container.style.height = (cellDimensionToRender * rowCount) + 'px';
                this.container.style.width = (cellDimensionToRender * colCount) + 'px';
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
     * Function to handle the resize event for dpad to be redrawn if required
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

    //#region 5. Events
    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-keypad', Ch5Keypad);
}

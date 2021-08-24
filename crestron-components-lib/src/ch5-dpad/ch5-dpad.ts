import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5DpadCenter } from "./ch5-dpad-button-center";
import { Ch5DpadTop } from "./ch5-dpad-button-top";
import { Ch5DpadRight } from "./ch5-dpad-button-right";
import { Ch5DpadBottom } from "./ch5-dpad-button-bottom";
import { Ch5DpadLeft } from "./ch5-dpad-button-left";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadAttributes } from "./interfaces/i-ch5-dpad-interfaces";
import { TCh5DpadShape, TCh5DpadStretch, TCh5DpadType } from "./interfaces/t-ch5-dpad";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";

export class Ch5Dpad extends Ch5Common implements ICh5DpadAttributes {
    //#region 1. Variables

    //#region 1.1 readonly variables

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

    public readonly primaryCssClass = 'ch5-dpad';
    public readonly cssClassPrefix = 'ch5-dpad';

    //#endregion

    //#region 1.2 private / protected variables

    // private setter getter specific vars
    private COMPONENT_NAME: string = "ch5-dpad";
    private _contractName: string = '';
    private _type: TCh5DpadType = Ch5Dpad.TYPES[0];
    private _shape: TCh5DpadShape = Ch5Dpad.SHAPES[0];
    private _stretch: TCh5DpadStretch | null = null;
    private _sendEventOnClickStart: string = '';
    private _useContractforEnable: boolean = false;
    private _useContractForShow: boolean = false;
    private _useContractForCustomStyle: boolean = false;
    private _useContractForCustomClass: boolean = false;
    private _useContractforEnableSignalValue: string = '';
    private _useContractForShowSignalValue: string = '';
    private _useContractForCustomStyleSignalValue: string = '';
    private _useContractForCustomClassSignalValue: string = '';

    // state specific vars
    private isComponentLoaded: boolean = false;
    private btnTypeClassPrefix: string = "ch5-dpad--type-";
    private btnShapeClassPrefix: string = "ch5-dpad--shape-";

    // elements specific vars
    private container: HTMLElement = {} as HTMLElement;
    private containerClass: string = 'dpad-container';

    //#endregion

    //#endregion

    //#region 2. Setters and Getters

    /**
     * contractName specif getter-setter
     */
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

    /**
     * type specif getter-setter
     */
    public set type(value: TCh5DpadType) {
        this.logger.start('set type ("' + value + '")');
        CH5DpadUtils.setAttributeValueOnControl(this, 'type', value, Ch5Dpad.TYPES,
            this.updateCssClasses.bind(this));
        this.logger.stop();
    }
    public get type(): TCh5DpadType {
        return this._type;
    }

    /**
     * shape specif getter-setter
     */
    public set shape(value: TCh5DpadShape) {
        this.logger.start('set shape ("' + value + '")');
        CH5DpadUtils.setAttributeValueOnControl(this, 'shape', value, Ch5Dpad.SHAPES,
            () => {
                this.checkAndRestructureDomOfDpad();
                this.updateCssClasses();
            }
        );
        this.logger.stop();
    }
    public get shape(): TCh5DpadShape {
        return this._shape;
    }

    /**
     * stretch specif getter-setter
     */
    public set stretch(value: TCh5DpadStretch | null) {
        this.logger.start('set stretch ("' + value + '")');
        if (value !== null) {
            const stretches = ['', ...Ch5Dpad.STRETCHES];
            CH5DpadUtils.setAttributeValueOnControl(this, 'stretch', value, stretches,
                this.stretchHandler.bind(this));
        }
        this.logger.stop();
    }
    public get stretch(): TCh5DpadStretch | null {
        return this._stretch;
    }

    /**
     * sendEventOnClickStart specif getter-setter
     */
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

    /**
     * useContractforEnable specif getter-setter
     */
    public set useContractforEnable(value: boolean) {
        this.logger.start('Ch5Dpad set useContractforEnable("' + value + '")');

        const isUseContractforEnable = this.toBoolean(value);
        const contractName = CH5DpadUtils.getAttributeAsString(this, 'contractname', '');

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
                CH5DpadUtils.setAttributeToElement(this, 'disabled', newValue);
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
        this.logger.start('Ch5Dpad set useContractForShow("' + value + '")');

        const isUseContractForShow = this.toBoolean(value);
        const contractName = CH5DpadUtils.getAttributeAsString(this, 'contractname', '');

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
                CH5DpadUtils.setAttributeToElement(this, 'show', newValue);
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
        this.logger.start('Ch5Dpad set useContractForCustomStyle("' + value + '")');

        const isUseContractForCustomStyle = this.toBoolean(value);
        const contractName = CH5DpadUtils.getAttributeAsString(this, 'contractname', '');

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
        this.logger.start('Ch5Dpad set useContractForCustomClass("' + value + '")');

        const isUuseContractForCustomClass = this.toBoolean(value);
        const contractName = CH5DpadUtils.getAttributeAsString(this, 'contractname', '');

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
     * overriding default receiveStateShowPulse specif getter-setter
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

        CH5DpadUtils.clearComponentContent(this);

        // set attributes based on onload attributes
        this.initAttributes();
        // add missing elements, remove extra ones, before DPAD is finally rendered
        this.checkAndRestructureDomOfDpad();

        this.logger.stop();
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

        const ready = Promise.all([
            customElements.whenDefined('ch5-dpad-button-top'),
            customElements.whenDefined('ch5-dpad-button-left'),
            customElements.whenDefined('ch5-dpad-button-bottom'),
            customElements.whenDefined('ch5-dpad-button-right'),
            customElements.whenDefined('ch5-dpad-button-center')
        ]).then(() => {
            // check if all components required to build dpad are ready, instantiated and available for consumption
            this.onAllSubElementsCreated();
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
            "sendEventOnClickStart",
            "usecontractforenable",
            "usecontractforshow"
        ];

        // received signals
        const receivedSignals: string[] = [];

        // sent signals
        const sentSignals: string[] = [];

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
        const isValidContract: boolean = (CH5DpadUtils.getAttributeAsString(this, 'contractname', '').length > 0);

        switch (attr) {
            case 'usecontractforshow':
                this.useContractForShow = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforenable':
                this.useContractforEnable = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforcustomstyle':
                this.useContractForCustomStyle = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'usecontractforcustomclass':
                this.useContractForCustomClass = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'receivestateshow':
                if (!isValidContract) {
                    this.receiveStateShow = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestateenable':
                if (!isValidContract) {
                    this.receiveStateEnable = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestateshowpulse':
                if (!isValidContract) {
                    this.receiveStateShowPulse = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestatehidepulse':
                if (!isValidContract) {
                    this.receiveStateHidePulse = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestatecustomstyle':
                if (!isValidContract) {
                    this.receiveStateCustomStyle = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestatecustomclass':
                if (!isValidContract) {
                    this.receiveStateCustomClass = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'sendeventonclickstart':
                if (!isValidContract) {
                    this.sendEventOnClickStart = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
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
                this.contractName = newValue;
                this.updateContractNameBasedHandlers(this._contractName);
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
            this.createAndAppendAllButtonsUnderDpad();
        } else {
            const isValidStructureInChildDiv = this.checkIfOrderOfTagsAreinTheRightOrder(childItemsContainer[0].children);
            if (!isValidStructureInChildDiv) {
                throw new Error("ch5-dpad not constructed correctly, please refer documentation.");
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
        const centerBtn = new Ch5DpadCenter();
        const topBtn = new Ch5DpadTop();
        const rightBtn = new Ch5DpadRight();
        const bottomBtn = new Ch5DpadBottom();
        const leftBtn = new Ch5DpadLeft();

        this.createEmptyContainerDiv();

        // order of appending is --- center, top, left/right, right/left, bottom
        this.container.appendChild(centerBtn);
        this.container.appendChild(topBtn);

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

        this.container.appendChild(bottomBtn);
    }

    /**
     * Function to check if the tags are sequenced in the right/expected order
     * @param childItems 
     * @returns true if the order is correct [order of appending is --- center, top, left/right, right/left, bottom]
     */
    private checkIfOrderOfTagsAreinTheRightOrder(childItems: HTMLCollection) {
        let ret = false;
        if (childItems.length === 5) {
            const firstTag = this.shape === Ch5Dpad.SHAPES[0] ? 'left' : 'right'; // if 'plus'
            const secondTag = this.shape === Ch5Dpad.SHAPES[0] ? 'right' : 'left'; // if 'circle'

            ret = ((childItems[0].tagName.toLowerCase() === 'ch5-dpad-button-center') &&
                (childItems[1].tagName.toLowerCase() === 'ch5-dpad-button-top') &&
                (childItems[2].tagName.toLowerCase() === 'ch5-dpad-button-' + firstTag) &&
                (childItems[3].tagName.toLowerCase() === 'ch5-dpad-button-' + secondTag) &&
                (childItems[4].tagName.toLowerCase() === 'ch5-dpad-button-bottom'));
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

        CH5DpadUtils.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5Dpad); // WAI-ARIA Attributes
        this.contractName = CH5DpadUtils.setAttributeToElement(this, 'contractName'.toLowerCase(), this._contractName);
        this.type = CH5DpadUtils.setAttributeToElement(this, 'type', this._type) as TCh5DpadType;
        this.shape = CH5DpadUtils.setAttributeToElement(this, 'shape', this._shape) as TCh5DpadShape;
        this.stretch = CH5DpadUtils.setAttributeToElement(this, 'stretch', this._stretch as string) as TCh5DpadStretch;

        // DEV NOTE: if contract name exists, and the individual attribute values don't exist, 
        // then the default value is true for useContractFor*
        // else useContractFor* picks value from attributes
        const isContractNameAvailable = Boolean(this.contractName).toString();
        this.useContractforEnable = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractforEnable'.toLowerCase(), isContractNameAvailable));
        this.useContractForShow = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractForShow'.toLowerCase(), isContractNameAvailable));
        this.useContractForCustomStyle = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractForCustomStyle'.toLowerCase(), isContractNameAvailable));
        this.useContractForCustomStyle = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractForCustomClass'.toLowerCase(), isContractNameAvailable));

        this.logger.stop();
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();

        for (const typeVal of Ch5Dpad.TYPES) {
            this.classList.remove(this.btnTypeClassPrefix + typeVal);
        }
        this.classList.add(this.btnTypeClassPrefix + this.type);

        for (const typeVal of Ch5Dpad.SHAPES) {
            this.classList.remove(this.btnShapeClassPrefix + typeVal);
        }
        this.classList.add(this.btnShapeClassPrefix + this.shape);
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
        const childItems: Element[] = Array.from(elementToCheck.children);
        // DEV NOTE: DONT CHANGE THE SEQUENCE OF ENTRIES IN THIS ARRAY
        const childElementArray: string[] = [
            "ch5-dpad-button-center",
            "ch5-dpad-button-top",
            "ch5-dpad-button-left",
            "ch5-dpad-button-right",
            "ch5-dpad-button-bottom"
        ];

        const refobj: any = {}; // stores the reference of all buttons relevant for dpad

        // // FIRST -A: remove all duplciate entries under DPAD
        if (childItems.length > 0) {
            for (const item of childItems) {
                const tagName = item.tagName.toLowerCase();
                if (!refobj.hasOwnProperty(tagName) && childElementArray.indexOf(tagName) > -1) {
                    refobj[tagName] = item;
                } else {
                    item.remove(); // removing, as this is a duplicate node
                }
            }
            // remove all child elements, since it will be created again in the right/expected order
            for (const item of childItems) {
                item.remove();
            }
        }

        // FIRST -B : Remove the child elements of dpad to keep it clean and append 'dpad-container' div to it
        if (isChildDiv) {
            const childDivUnderThis: Element[] = Array.from(this.children);
            if (childDivUnderThis.length > 0) {
                // remove all child elements, since it will be created again in the right/expected order
                for (const child of childDivUnderThis) {
                    child.remove();
                }
            }
        }
        this.createEmptyContainerDiv();

        // SECOND: create and add all non existing child tags 
        if (refobj !== null) {
            for (const tagName of childElementArray) {
                if (!refobj.hasOwnProperty(tagName)) {
                    const ele = document.createElement(tagName);
                    refobj[tagName] = ele as HTMLElement;
                }
            }
        }
        // THIRD: Finally, add the elements in the right order (adding block just for developer)
        {
            this.container.appendChild(refobj[childElementArray[0]]);
            this.container.appendChild(refobj[childElementArray[1]]);
            if (this.shape === Ch5Dpad.SHAPES[0] && this !== null) {
                // if the selected shape is 'plus'
                // ORDER: center, top, left, right, bottom
                this.container.appendChild(refobj[childElementArray[2]]); // first, left element
                this.container.appendChild(refobj[childElementArray[3]]); // then, the right element
            } else if (this.shape === Ch5Dpad.SHAPES[1] && this !== null) {
                // if the selected shape is 'circle'
                // ORDER: center, top, right, left, bottom
                this.container.appendChild(refobj[childElementArray[3]]); // first, right element
                this.container.appendChild(refobj[childElementArray[2]]); // then, the left element
            }
            this.container.appendChild(refobj[childElementArray[4]]);
        }
    }

    private checkIfContractAllows(attrToCheck: string, attrToSet: string, value: string | boolean): boolean {
        attrToCheck = attrToCheck.toLowerCase();
        attrToSet = attrToSet.toLowerCase();
        this.info('Ch5Dpad set ' + attrToCheck + '("' + value + '")');
        const contractName = CH5DpadUtils.getAttributeAsString(this, 'contractname', '');
        const isContractBased = CH5DpadUtils.getAttributeAsBool(this, attrToSet, this.checkIfValueIsTruey(contractName));

        return isContractBased;
    }

    /**
     * Function to add the send event on click attribute to child elements if valid scenario
     * contractName.length === 0 and eventKeyStart is a valid number
     * @param eventKeyStart sendEventOnClickStart event's initial value
     */
    private updateEventClickHandlers(eventKeyStart: number) {
        const contractName = CH5DpadUtils.getAttributeAsString(this, 'contractname', '');
        if (contractName.length === 0 && !isNaN(eventKeyStart)) {
            const centerBtn = this.getElementsByTagName("ch5-dpad-button-center")[0];
            if (!_.isNil(centerBtn)) {
                const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.center;
                centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const topBtn = this.getElementsByTagName("ch5-dpad-button-top")[0];
            if (!_.isNil(topBtn)) {
                const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.top;
                topBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const rightBtn = this.getElementsByTagName("ch5-dpad-button-right")[0];
            if (!_.isNil(rightBtn)) {
                const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.right;
                rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const bottomBtn = this.getElementsByTagName("ch5-dpad-button-bottom")[0];
            if (!_.isNil(bottomBtn)) {
                const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.bottom;
                bottomBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const leftBtn = this.getElementsByTagName("ch5-dpad-button-left")[0];
            if (!_.isNil(leftBtn)) {
                const contractVal = eventKeyStart + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.left;
                leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
        }
    }
    private updateContractNameBasedHandlers(contractName: string) {
        if (contractName.length > 0) {
            const centerBtn = this.getElementsByTagName("ch5-dpad-button-center")[0];
            if (!_.isNil(centerBtn)) {
                const contractVal = contractName + '.' + CH5DpadContractUtils.contractSuffix.center;
                centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const topBtn = this.getElementsByTagName("ch5-dpad-button-top")[0];
            if (!_.isNil(topBtn)) {
                const contractVal = contractName + '.' + CH5DpadContractUtils.contractSuffix.top;
                topBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const rightBtn = this.getElementsByTagName("ch5-dpad-button-right")[0];
            if (!_.isNil(rightBtn)) {
                const contractVal = contractName + '.' + CH5DpadContractUtils.contractSuffix.right;
                rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const bottomBtn = this.getElementsByTagName("ch5-dpad-button-bottom")[0];
            if (!_.isNil(bottomBtn)) {
                const contractVal = contractName + '.' + CH5DpadContractUtils.contractSuffix.bottom;
                bottomBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
            const leftBtn = this.getElementsByTagName("ch5-dpad-button-left")[0];
            if (!_.isNil(leftBtn)) {
                const contractVal = contractName + '.' + CH5DpadContractUtils.contractSuffix.left;
                leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
            }
        }
    }

    private stretchHandler() {
        const dpadHeight = this.style.height;
        const dpadWidth = this.style.width;
        let dimensionVal = Math.min(parseInt(dpadHeight.replace(/\D/g, ''), 10), parseInt(dpadWidth.replace(/\D/g, ''), 10));
        let justifyContent = 'start';
        let alignItems = 'start';
        if (!!this.stretch && this.stretch.length === 0) {
            dimensionVal = 0;
        } else if (this.stretch === Ch5Dpad.STRETCHES[0]) { // 'both'
            justifyContent = 'center';
            alignItems = 'center';
        } else if (this.stretch === Ch5Dpad.STRETCHES[1]) { // 'width'
            justifyContent = 'center';
            alignItems = 'start';
        } else if (this.stretch === Ch5Dpad.STRETCHES[2]) { // 'height'
            justifyContent = 'start';
            alignItems = 'center';
        } else {
            // just like first one
            dimensionVal = 0;
        }
        if (!!this.container && !!this.container.style) {
            this.style.justifyContent = justifyContent;
            this.style.alignItems = alignItems;
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
    }

    //#endregion

    //#region 5. Events
    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {

    window.customElements.define('ch5-dpad', Ch5Dpad);
}
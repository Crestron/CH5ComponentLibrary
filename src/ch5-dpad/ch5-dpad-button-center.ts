import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces/t-ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadCenterAttributes } from "./interfaces/i-ch5-dpad-button-center-interfaces";
import { ICenterBtnContract } from "./interfaces/i-ch5-dpad-utils";
import { TButtonClassListType, TParentContractBasedState, TParentControlledContractRules } from "./interfaces/t-ch5-dpad";

export class Ch5DpadCenter extends Ch5Common implements ICh5DpadCenterAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public readonly primaryCssClass = 'ch5-dpad-button-center';
    public readonly cssClassPrefix = 'ch5-dpad-button-center';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-button-center";
    private labelClass: string = 'dpad-btn-label';
    private readonly CSS_CLASS_LIST: TButtonClassListType = {
        primaryTagClass: 'center',
        primaryIconClass: 'fas',
        defaultIconClass: 'fa-circle',
        imageClassName: 'image-url',
        defaultArrowClass: '' // not required for center button only
    };

    // private setter getter specific vars
    // private _disabled: boolean = true; // not required as its in common.ts
    // private _show: boolean = true; // not required as its in common.ts
    private _iconClass: string = '';
    private _iconUrl: string = '';
    private _label: string = '';
    private _receiveStateIconClass: string = '';
    private _receiveStateIconUrl: string = '';
    private _receivestatescriptlabelhtml: string = '';
    private _receiveStateLabel: string = '';
    // protected _receiveStateShow: string = '';
    // protected _receiveStateEnable: string = '';

    // signal based vars for each receive state
    private _receiveStateShowSignalName: string = '';
    private _receiveStateEnableSignalName: string = '';
    private _receiveStateShowPulseSignalName: string = '';
    private _receiveStateHidePulseSignalName: string = '';
    private _receiveStateIconClassSignalName: string = '';
    private _receiveStateIconUrlSignalName: string = '';
    private _receivestatescriptlabelhtmlSignalName: string = '';
    private _receiveStateLabelSignalName: string = '';
    private _receiveStateShowSignalValue: Ch5Signal<boolean> | null = null;
    private _receiveStateEnableSignalValue: Ch5Signal<boolean> | null = null;
    private _receiveStateShowPulseSignalValue: Ch5Signal<boolean> | null = null;
    private _receiveStateHidePulseSignalValue: Ch5Signal<boolean> | null = null;
    private _receiveStateIconClassSignalValue: Ch5Signal<string> | null = null;
    private _receiveStateIconUrlSignalValue: Ch5Signal<string> | null = null;
    private _receivestatescriptlabelhtmlSignalValue: Ch5Signal<string> | null = null;
    private _receiveStateLabelSignalValue: Ch5Signal<string> | null = null;

    // parent specific contract based signals for each receive state
    private parentContractBasedState: TParentContractBasedState = {
        click: CH5DpadUtils.getBlankContractObj(),
        show: CH5DpadUtils.getBlankContractObj(),
        enable: CH5DpadUtils.getBlankContractObj(),
        iconClass: CH5DpadUtils.getBlankContractObj(),
        iconUrl: CH5DpadUtils.getBlankContractObj(),
        label: CH5DpadUtils.getBlankContractObj()
    };


    // elements specific vars
    private _icon: HTMLElement = {} as HTMLElement;

    // state specific vars
    private crId: string = '';
    private parentControlledContractRules: TParentControlledContractRules = {
        contractName: '',
        label: false,
        enable: false,
        show: false,
        icon: false
    };

    //#endregion

    //#endregion

    //#region 2. Setters and Getters

    /**
     * iconClass specif getter-setter
     */
    public set iconClass(value: string) {
        this.info('set iconClass("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        let trValue: string = '';

        if (this.parentControlledContractRules.contractName.length === 0 ||
            (this.parentControlledContractRules.contractName.length > 0 && !this.parentControlledContractRules.icon)) {
            trValue = this.CSS_CLASS_LIST.defaultIconClass;
        }

        trValue = this._getTranslatedValue('iconClass', value);
        if (trValue === this.iconClass) {
            return;
        }

        this._iconClass = trValue;
        this.setAttribute('iconClass', trValue);
        if (this._iconClass.length > 0 && this._iconUrl.length < 1) {
            this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
            this._icon.classList.add(this._iconClass);
        } else {
            this._icon.classList.remove(this.CSS_CLASS_LIST.primaryIconClass);
        }
    }
    public get iconClass() {
        return this._iconClass;
    }

    /**
     * iconUrl specif getter-setter
     */
    public set iconUrl(value: string) {
        this.info('set iconUrl("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('iconUrl', value);
        if (trValue === this.iconUrl) {
            return;
        }

        this._iconUrl = trValue;
        this.setAttribute('iconUrl', trValue);
        if (this.iconUrl.length > 0) {
            this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
            this._icon.style.backgroundImage = `url(${trValue})`;
        } else {
            this._icon.classList.remove(this.CSS_CLASS_LIST.imageClassName);
        }
    }
    public get iconUrl() {
        return this._iconUrl;
    }

    /**
     * label specif getter-setter
     */
    public set label(value: string) {
        this.info('set label("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('label', value);
        if (trValue === this.label) {
            return;
        }

        this._label = trValue;
        this.setAttribute('label', trValue);
    }
    public get label() {
        return this._label;
    }

    /**
     * Overriding receiveStateShow to not do anything if parent has contractName attribute set
     */
    public set receiveStateShow(value: string) {
        this.info('set receiveStateShow("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }

        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateShow',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                newValue = newValue as boolean;
                this.info(' subs callback for signalReceiveShow: ', this._receiveStateShowSignalValue,
                    ' Signal has value ', newValue);
                this.show = newValue;
            }
        };

        this.setValueForReceiveStateBoolean(params);
    }

    /**
     * Overriding receiveStateEnable to not do anything if parent has contractName attribute set
     */
    public set receiveStateEnable(value: string) {
        this.info('set receiveStateEnable("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }

        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateEnable',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                newValue = newValue as boolean;
                this.info(' subs callback for signalReceiveEnable: ', this._receiveStateEnableSignalValue,
                    ' Signal has value ', newValue);
                if (!this.disabled !== newValue) {
                    if (true === newValue) {
                        this.removeAttribute('disabled');
                    } else {
                        this.setAttribute('disabled', '');
                    }
                }
            }
        };

        this.setValueForReceiveStateBoolean(params);
    }

    /**
     * Overriding receiveStateShowPulse to not do anything if parent has contractName attribute set
     */
    public set receiveStateShowPulse(value: string) {
        this.info('set receiveStateShowPulse("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }

        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateShowPulse',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                newValue = newValue as boolean;
                this.info(' subs callback for signalReceiveShowPulse: ',
                    this._receiveStateShowPulseSignalValue, ' Signal has value ', newValue);
                if (this._receiveStateShowPulseSignalValue !== null) {
                    const refVal = newValue as never as { repeatdigital: boolean };
                    const _newVal = refVal.repeatdigital !== undefined ? refVal.repeatdigital : newValue;
                    const recSigVal = this._receiveStateShowPulseSignalValue.prevValue as never as { repeatdigital: boolean };
                    if (recSigVal.repeatdigital !== undefined) {
                        if (recSigVal.repeatdigital === false && _newVal === true) {
                            this.setAttribute('show', 'true')
                        }
                        return;
                    }
                    if (this._receiveStateShowPulseSignalValue.prevValue === false && true === _newVal) {
                        this.setAttribute('show', 'true')
                    }
                }
            }
        };

        this.setValueForReceiveStateBoolean(params);
    }

    /**
     * Overriding receiveStateHidePulse to not do anything if parent has contractName attribute set
     */
    public set receiveStateHidePulse(value: string) {
        this.info('set receiveStateHidePulse("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }

        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateHidePulse',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                this.info(' subs callback for signalReceiveHidePulse: ',
                    this._receiveStateHidePulseSignalValue, ' Signal has value ', newValue);
                if (this._receiveStateHidePulseSignalValue !== null) {
                    if (false === this._receiveStateHidePulseSignalValue.prevValue && newValue === true) {
                        this.setAttribute('show', 'false');
                    }
                } else {
                    this.info(' subs callback for signalReceiveHidePulse: ', this._receiveStateHidePulseSignalValue, ' is null');
                }
            }
        };

        this.setValueForReceiveStateBoolean(params);
    }

    /**
     * receiveStateIconClass specif getter-setter
     */
    public set receiveStateIconClass(value: string) {
        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateIconClass',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                this.info(' subs callback for receiveStateIconClass: ',
                    this._receiveStateIconClassSignalValue, ' Signal has value ', newValue);
                newValue = newValue as string;
                if (newValue !== this.iconClass) {
                    if (this.parentControlledContractRules.contractName.length < 1 &&
                        this.receiveStateIconUrl.length < 1 &&
                        !this.parentControlledContractRules.icon &&
                        !this.parentControlledContractRules.label) {
                        this._icon.classList.add(newValue);
                    }
                }
            }
        };

        this.setValueForReceiveStateString(params);
    }
    public get receiveStateIconClass() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receiveStateIconClass'.toLowerCase());
    }

    /**
     * receiveStateIconUrl specif getter-setter
     */
    public set receiveStateIconUrl(value: string) {
        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateIconUrl',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                this.info(' subs callback for receiveStateIconUrl: ',
                    this._receiveStateIconUrlSignalValue, ' Signal has value ', newValue);
                newValue = newValue as string;
                if (newValue !== this.iconUrl) {
                    if (this.parentControlledContractRules.contractName.length < 1 &&
                        !this.parentControlledContractRules.icon &&
                        !this.parentControlledContractRules.label) {
                        this._icon.style.backgroundImage = `url(${newValue})`;
                        this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
                    }
                }
            }
        };

        this.setValueForReceiveStateString(params);
    }
    public get receiveStateIconUrl() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receiveStateIconUrl'.toLowerCase());
    }

    /**
     * receiveStateLabel specif getter-setter
     */
    public set receiveStateLabel(value: string) {
        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateLabel',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                this.info(' subs callback for receiveStateLabel: ',
                    this._receiveStateLabelSignalValue, ' Signal has value ', newValue);
                newValue = newValue as string;
                if (newValue !== this.label) {
                    this.setAttribute('label', newValue);
                    this._icon.innerHTML = newValue;
                }
            }
        };

        this.setValueForReceiveStateString(params);
    }
    public get receiveStateLabel() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatelabel'.toLowerCase());
    }

    /**
     * receivestatescriptlabelhtml specif getter-setter
     */
    public set receivestatescriptlabelhtml(value: string) {
        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receivestatescriptlabelhtml',
            value,
            callbackOnSignalReceived: (newValue: string | boolean) => {
                this.info(' subs callback for receivestatescriptlabelhtml: ',
                    this._receivestatescriptlabelhtmlSignalValue, ' Signal has value ', newValue);
                newValue = newValue as string;
                if ('' !== newValue && newValue !== this._icon.innerHTML) {
                    this._icon.innerHTML = newValue;
                }
            }
        };

        this.setValueForReceiveStateString(params);
    }
    public get receivestatescriptlabelhtml() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatescriptlabelhtml'.toLowerCase());
    }

    //#endregion

    //#region 3. Lifecycle Hooks

    public constructor() {
        super();
        this.logger.start('constructor()', this.COMPONENT_NAME);

        // events binding

        // check if the dpad element has been created by verifying one of its properties

        this.logger.stop();
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.info(' connectedCallback() - start');

        this.crId = this.getCrId();
        this.setAttribute('data-ch5-id', this.crId);

        if (!(this.parentElement instanceof Ch5Dpad)) {
            throw new Error(`Invalid parent element for ch5-dpad-button-center. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too. Reference id: ${this.crId}`);
        }

        // will have the flags ready for contract level content to be ready
        this.buildParentBasedContractRef();
        this.createElementsAndInitialize();

        customElements.whenDefined('ch5-dpad-button-center').then(() => {
            this.initCommonMutationObserver(this);
            this.info(' connectedCallback() - end');
        });
    }

    /**
     * Function to create HTML elements of the components including child elements
     */
    private createElementsAndInitialize() {
        if (!this._wasInstatiated) {
            if (this._icon.classList === undefined || this._icon.classList.length <= 0) {
                this._icon = document.createElement('span');
            }

            this.initAttributes();
            this.createHtmlElements();
            this.attachEventListeners();
            this.updateCssClasses();
        }
        this._wasInstatiated = true;
    }

    /**
     * Function to create all inner html elements required to complete dpad center button
     */
    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        this.classList.add(this.primaryCssClass);
        this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);

        const btnIconUrl = CH5DpadUtils.getImageUrl(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        const btnIconClass = CH5DpadUtils.getIconClass(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        const btnLabel = CH5DpadUtils.getLabelText(this, this.primaryCssClass, this.parentControlledContractRules.label as boolean);
        const isParentContractName: boolean = Boolean(this.parentControlledContractRules.contractName);
        // Order of preference is:
        // 0 parentContract
        // 1 recevieStateIconUrl
        // 2 receiveStateIconClass
        // 3 receiveStateLabel
        // 4 iconUrl
        // 5 iconClass
        // 6 label
        if (isParentContractName &&
            (this.parentControlledContractRules.icon || this.parentControlledContractRules.label)) {
            this._icon.classList.add('dpad-btn-icon');
            if (this.parentControlledContractRules.icon) {
                this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
                // below condition already handled
                // } else if (this.parentControlledContractRules.label) {
            }
        } else if (!isParentContractName && this.receiveStateIconUrl.length > 0 && this.receiveStateIconUrl === btnIconUrl) {
            this._icon = CH5DpadUtils.getImageContainer(this.receiveStateIconUrl);
        } else if (!isParentContractName && this.receiveStateIconClass && this.receiveStateIconClass === btnIconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
        } else if (!isParentContractName && this.receiveStateLabel.length > 0) {
            this._icon = CH5DpadUtils.getLabelContainer(this.labelClass);
        } else if (this.iconUrl.length > 0 && this.iconUrl === btnIconUrl) {
            this._icon = CH5DpadUtils.getImageContainer(this.iconUrl);
            this._icon.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass && this.iconClass === btnIconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(this.iconClass);
        } else if (this.label.length > 0) {
            this._icon = CH5DpadUtils.getLabelContainer(this.labelClass);
            this._icon.innerHTML = btnLabel;
        } else {
            // if nothing works, then render as default
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass); // 'fa-circle'
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
        this.removeEvents();
        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    private removeEvents() {
        throw new Error("Method not implemented or element is not structured correctly.");
    }

    /**
     * Unsubscribe signals
     */
    public unsubscribeFromSignals() {
        this.logger.start("unsubscribeFromSignals", this.COMPONENT_NAME);
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();
        const signalArr = ["receiveStateIconClass", "receiveStateIconUrl", "receiveStateLabel", "receivestatescriptlabelhtml"];
        for (const sigName of signalArr) {
            const attrKeyPvt = '_' + sigName;
            const attrKeySigName = attrKeyPvt + 'SignalValue';
            CH5DpadUtils.clearSignalValue(csf, this, "attrKeySigName", "attrKeyPvt");
        }

        this.logger.stop();
    }

    static get observedAttributes() {
        const commonAttributes: string[] = Ch5Common.observedAttributes;

        // attributes
        const attributes: string[] = [
            "iconclass",
            "iconurl",
            "label"
        ];

        // received signals
        const receivedSignals: string[] = [
            "receivestateiconclass",
            "receivestateiconurl",
            "receivestatelabel"
        ];

        // sent signals
        const sentSignals: string[] = [];

        const ch5DpadAttributes = commonAttributes.concat(attributes).concat(receivedSignals).concat(sentSignals);

        return ch5DpadAttributes;
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
        attr = attr.toLowerCase();
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-dpad-button-center attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
        const parentContractName: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'contractname', '');
        switch (attr) {
            case 'receivestateshow':
            case 'receivestateenable':
            case 'receivestateshowpulse':
            case 'receivestatehidepulse':
                // all 4 above cases need the contractName attribute in DPad tag to be empty to be acceptable
                // checking if contractName is empty and callback function is defined, before proceeding 
                if (!Boolean(parentContractName)) {
                    super.attributeChangedCallback(attr, oldValue, newValue);
                } else {
                    this.info(`Parent container DPad has a contract and so, ${attr} for ${this.crId} is rendered void.`);
                }
                break;
            // Order of preference is:
            // 0 parentContract
            // 1 recevieStateIconUrl
            // 2 receiveStateIconClass
            // 3 receiveStateLabel
            // 4 iconUrl
            // 5 iconClass
            // 6 label
            case 'receivestateiconclass':
                if (!Boolean(parentContractName)) {
                    this.receiveStateIconClass = CH5DpadUtils.setAttributesBasedValue(
                        this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestateiconurl':
                if (!Boolean(parentContractName)) {
                    this.receiveStateIconUrl = CH5DpadUtils.setAttributesBasedValue(
                        this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestatescriptlabelhtml': // higher than receivestatelabel and label
                if (!Boolean(parentContractName)) {
                    this.receivestatescriptlabelhtml = CH5DpadUtils.setAttributesBasedValue(
                        this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'receivestatelabel': // higher than label
                if (!Boolean(parentContractName)) {
                    this.receiveStateLabel = CH5DpadUtils.setAttributesBasedValue(
                        this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'label':
                // rules for label are:
                // 1. (parent contract name should not exist && useContractforLabel must be false) ||
                // 2. receivestatescriptlabelhtml && receivestatelabel must be empty, while parentContractName is empty
                const isParentContractLabel = CH5DpadUtils.getAttributeAsBool(
                    this.parentElement, 'usecontractforlabel', true);
                const stateLabel: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'receivestatelabel', '');
                const stateLabelHtml: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'receivestatescriptlabelhtml', '');
                if ((Boolean(parentContractName) && !isParentContractLabel) ||
                    (!Boolean(parentContractName) && !Boolean(stateLabel) && !Boolean(stateLabelHtml))) {
                    this.label = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'iconclass':
                // rules for icon are:
                // 1. (parent contract name should not exist && useContractForIcons must be false) ||
                // 2. receiveStateIconClass must be empty, while parentContractName is empty
                if (!Boolean(parentContractName)) {
                    this.iconUrl = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'iconurl':
                // rules for icon are:
                // 1. (parent contract name should not exist && useContractForIcons must be false) ||
                // 2. receiveStateIconUrl must be empty, while parentContractName is empty
                const stateIconUrl: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'receivestateiconurl', '');
                if (!Boolean(parentContractName)) {
                    this.iconUrl = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                }
                break;
            case 'show':
                // rules for show are:
                // 1. (parent contract name should not exist && useContractforShow must be false) ||
                // 2. receivestateshow must be empty, while parentContractName is empty
                const isParentContractShow = CH5DpadUtils.getAttributeAsBool(
                    this.parentElement, 'usecontractforshow', true);
                const stateShow: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'receivestateshow', '');
                if ((Boolean(parentContractName) && !isParentContractShow) ||
                    (!Boolean(parentContractName) && !Boolean(stateShow))) {
                    super.attributeChangedCallback(attr, oldValue, newValue);
                }
                break;
            case 'enable':
                // rules for enable are:
                // 1. (parent contract name should not exist && useContractforEnable must be false) ||
                // 2. receivestateenable must be empty, while parentContractName is empty
                const isParentContractEnable = CH5DpadUtils.getAttributeAsBool(
                    this.parentElement, 'usecontractforenable', true);
                const stateEnable: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'receivestateenable', '');
                if ((Boolean(parentContractName) && !isParentContractEnable) ||
                    (!Boolean(parentContractName) && !Boolean(stateEnable))) {
                    super.attributeChangedCallback(attr, oldValue, newValue);
                }
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }

        this.logger.stop();
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        this.logger.start("initAttributes", this.COMPONENT_NAME);
        super.initAttributes();


        CH5DpadUtils.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5DpadChild); // WAI-ARIA Attributes

        // below actions, set default value to the control's attribute if they dont exist, and assign them as a return value
        this.iconClass = CH5DpadUtils.setAttributeToElement(this, 'iconClass', this._iconClass);
        this.iconUrl = CH5DpadUtils.setAttributeToElement(this, 'iconUrl', this._iconUrl);
        this.label = CH5DpadUtils.setAttributeToElement(this, 'label', this._label);
        this.receiveStateIconClass =
            CH5DpadUtils.setAttributeToElement(this, 'receiveStateIconClass', this._receiveStateIconClass);
        this.receiveStateIconUrl = CH5DpadUtils.setAttributeToElement(this, 'receiveStateIconUrl', this._receiveStateIconUrl);
        this.receiveStateLabel = CH5DpadUtils.setAttributeToElement(this, 'receiveStateLabel', this._receiveStateLabel);
        this.receivestatescriptlabelhtml =
            CH5DpadUtils.setAttributeToElement(this, 'receivestatescriptlabelhtml', this._receivestatescriptlabelhtml);

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
    }

    //#endregion

    //#region 4. Other Methods

    /**
     * Function to build parent controlled contract rules and contract structure based on them
     */
    private buildParentBasedContractRef() {
        const contract: ICenterBtnContract = CH5DpadContractUtils.getCenterBtnContract();
        this.parentControlledContractRules = CH5DpadUtils.buildParentControlledContractRules(this);
        // TODO: need to set this value
        const { contractName, show, enable, icon, label } = this.parentControlledContractRules;
        if (Boolean(contractName)) {
            this._icon = document.createElement('span');
            CH5DpadContractUtils.checkAndUpdateClickHandler(this, `${contractName}.${contract.CenterClicked}`);
            if (show) {
                CH5DpadContractUtils.checkAndUpdateShowHandler(this, `${contractName}.${contract.CenterShow}`);
            }
            if (enable) {
                CH5DpadContractUtils.checkAndUpdateEnableHandler(this, `${contractName}.${contract.CenterEnable}`);
            }
            if (icon) {
                CH5DpadContractUtils.checkAndUpdateIconClassHandler(this, `${contractName}.${contract.CenterIconClass}`);
                CH5DpadContractUtils.checkAndUpdateIconUrlHandler(this, `${contractName}.${contract.CenterIconUrl}`);
            }
            if (label) {
                CH5DpadContractUtils.checkAndUpdateLabelHandler(this, this.labelClass, `${contractName}.${contract.CenterLabel}`);
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
    window.customElements.define('ch5-dpad-button-center', Ch5DpadCenter);
}
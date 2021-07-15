import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces/t-ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadTopAttributes } from "./interfaces/i-ch5-dpad-button-top-interfaces";
import { ITopBtnContract } from "./interfaces/i-ch5-dpad-utils";
import { TButtonClassListType, TParentContractBasedState, TParentControlledContractRules } from "./interfaces/t-ch5-dpad";

export class Ch5DpadTop extends Ch5Common implements ICh5DpadTopAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public readonly primaryCssClass = 'ch5-dpad-button-top';
    public readonly cssClassPrefix = 'ch5-dpad-button-top';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-button-top";
    private readonly CSS_CLASS_LIST: TButtonClassListType = {
        primaryTagClass: 'up',
        primaryIconClass: 'fas',
        defaultIconClass: 'fa-circle',
        imageClassName: 'image-url',
        defaultArrowClass: 'direction-btn'
    };

    // private setter getter specific vars
    // private _disabled: boolean = true; // not required as its in common.ts
    // private _show: boolean = true; // not required as its in common.ts
    private _iconClass: string = '';
    private _iconUrl: string = '';
    private _receiveStateIconClass: string = '';
    private _receiveStateIconUrl: string = '';

    // signal based vars for each receive state
    private _receiveStateIconClassSignalValue: string = '';
    private _receiveStateIconUrlSignalValue: string = '';

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

        const trValue: string = this._getTranslatedValue('iconClass', value);
        if (trValue === this.iconClass) {
            return;
        }

        this._iconClass = trValue;
        this.setAttribute('iconClass', trValue);
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
    }
    public get iconUrl() {
        return this._iconUrl;
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
            isBoolType: true,
            callbackOnSignalReceived: (newValue: string | boolean, recSig: Ch5Signal<string | boolean> | null) => {
                newValue = newValue as boolean;
                this.info(' subs callback for signalReceiveShow: ', this._subKeySigReceiveShow, ' Signal has value ', newValue);
                this.show = newValue;
            }
        };

        this.setValueForReceiveStateAttr(params);
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
            isBoolType: true,
            callbackOnSignalReceived: (newValue: string | boolean, recSig: Ch5Signal<string | boolean> | null) => {
                newValue = newValue as boolean;
                this.info(' subs callback for signalReceiveEnable: ', this._subKeySigReceiveEnable, ' Signal has value ', newValue);
                if (!this.disabled !== newValue) {
                    if (true === newValue) {
                        this.removeAttribute('disabled');
                    } else {
                        this.setAttribute('disabled', '');
                    }
                }
            }
        };

        this.setValueForReceiveStateAttr(params);
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
            isBoolType: true,
            callbackOnSignalReceived: (newValue: string | boolean, recSig: Ch5Signal<string | boolean> | null) => {
                newValue = newValue as boolean;
                this.info(' subs callback for signalReceiveShowPulse: ', this._subKeySigReceiveShowPulse, ' Signal has value ', newValue);
                if (null !== recSig) {
                    const refVal = newValue as never as { repeatdigital: boolean };
                    const _newVal = refVal.repeatdigital !== undefined ? refVal.repeatdigital : newValue;
                    const recSigVal = recSig.prevValue as never as { repeatdigital: boolean };
                    if (recSigVal.repeatdigital !== undefined) {
                        if (false === recSigVal.repeatdigital && true === _newVal) {
                            this.setAttribute('show', 'true')
                        }
                        return;
                    }
                    if (recSig.prevValue === false && true === _newVal) {
                        this.setAttribute('show', 'true')
                    }
                }
            }
        };

        this.setValueForReceiveStateAttr(params);
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
            isBoolType: true,
            callbackOnSignalReceived: (newValue: string | boolean, recSig: Ch5Signal<string | boolean> | null) => {
                this.info(' subs callback for signalReceiveHidePulse: ', this._subKeySigReceiveHidePulse, ' Signal has value ', newValue);
                if (null !== recSig) {
                    if (false === recSig.prevValue && newValue === true) {
                        this.setAttribute('show', 'false');
                    }
                } else {
                    this.info(' subs callback for signalReceiveHidePulse: ', this._subKeySigReceiveHidePulse, ' recSig is null');
                }
            }
        };

        this.setValueForReceiveStateAttr(params);
    }

    /**
     * receiveStateIconClass specif getter-setter
     */
    public set receiveStateIconClass(value: string) {
        const params: TCh5CreateReceiveStateSigParams = {
            caller: this,
            attrKey: 'receiveStateIconClass',
            value,
            isBoolType: false,
            callbackOnSignalReceived: (newValue: string | boolean, recSig: Ch5Signal<string | boolean> | null) => {
                newValue = newValue as string;
                if (newValue !== this.iconClass) {
                    if (this.receiveStateIconUrl.length < 1 &&
                        !this.parentControlledContractRules.icon) {
                        this._icon.classList.add(newValue);
                    }
                }
            }
        };

        this.setValueForReceiveStateAttr(params);
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
            isBoolType: false,
            callbackOnSignalReceived: (newValue: string | boolean, recSig: Ch5Signal<string | boolean> | null) => {
                newValue = newValue as string;
                if (newValue !== this.iconUrl) {
                    if (!this.parentControlledContractRules.icon) {
                        this._icon.style.backgroundImage = `url(${newValue})`;
                        this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
                    }
                }
            }
        };

        this.setValueForReceiveStateAttr(params);
    }
    public get receiveStateIconUrl() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receiveStateIconUrl'.toLowerCase());
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
            throw new Error(`Invalid parent element for ch5-dpad-button-top. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too. Reference id: ${this.crId}`);
        }

        // will have the flags ready for contract level content to be ready
        this.buildParentBasedContractRef();
        this.createElementsAndInitialize();

        customElements.whenDefined('ch5-dpad-button-top').then(() => {
            this.initCommonMutationObserver(this);
            this.info(' connectedCallback() - end');
        });
    }

    /**
     * Function to create HTML elements of the components including child elements
     */
    private createElementsAndInitialize() {
        if (!this._wasInstatiated) {
            this.initAttributes();
            this.createHtmlElements();
            this.attachEventListeners();
            this.updateCssClasses();
        }
        this._wasInstatiated = true;
    }

    /**
     * Function to create all inner html elements required to complete dpad top button
     */
    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        this.classList.add(this.primaryCssClass);
        this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
        this.classList.add(this.CSS_CLASS_LIST.defaultArrowClass);

        const btnIconUrl = CH5DpadUtils.getImageUrl(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        const btnIconClass = CH5DpadUtils.getIconClass(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        // Order of preference is:
        // 0 parentContract
        // 1 recevieStateIconUrl
        // 2 receiveStateIconClass
        // 4 iconUrl
        // 5 iconClass
        if (Boolean(this.parentControlledContractRules.contractName) &&
            this.parentControlledContractRules.icon) {
            if (this._icon.classList.length <= 0) {
                this._icon = document.createElement('span');
            }
            this._icon.classList.add('dpad-btn-icon');
            this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
        } else if (this.receiveStateIconUrl.length > 0 && this.receiveStateIconUrl === btnIconUrl) {
            this._icon = CH5DpadUtils.getImageContainer(this.receiveStateIconUrl);
        } else if (this.receiveStateIconClass && this.receiveStateIconClass === btnIconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
        } else if (this.iconUrl.length > 0 && this.iconUrl === btnIconUrl) {
            this._icon = CH5DpadUtils.getImageContainer(this.iconUrl);
            this._icon.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass && this.iconClass === btnIconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(this.iconClass);
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
        const signalArr = ["receiveStateIconClass", "receiveStateIconUrl"];
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
            "iconurl"
        ];

        // received signals
        const receivedSignals: string[] = [
            "receivestateiconclass",
            "receivestateiconurl"
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

        this.info('ch5-dpad-button-top attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
        const parentContractName: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'contractname', '');
        switch (attr) {
            case 'receivestateiconclass':
            case 'receivestateiconurl':
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
        this.receiveStateIconClass =
            CH5DpadUtils.setAttributeToElement(this, 'receiveStateIconClass', this._receiveStateIconClass);
        this.receiveStateIconUrl = CH5DpadUtils.setAttributeToElement(this, 'receiveStateIconUrl', this._receiveStateIconUrl);

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
        const contract: ITopBtnContract = CH5DpadContractUtils.getTopBtnContract();
        this.parentControlledContractRules = CH5DpadUtils.buildParentControlledContractRules(this);
        // TODO: need to set this value
        const { contractName, show, enable, icon } = this.parentControlledContractRules;
        if (Boolean(contractName)) {
            this._icon = document.createElement('span');
            CH5DpadContractUtils.checkAndUpdateClickHandler(this, `${contractName}.${contract.TopClicked}`);
            if (show) {
                CH5DpadContractUtils.checkAndUpdateShowHandler(this, `${contractName}.${contract.TopShow}`);
            }
            if (enable) {
                CH5DpadContractUtils.checkAndUpdateEnableHandler(this, `${contractName}.${contract.TopEnable}`);
            }
            if (icon) {
                CH5DpadContractUtils.checkAndUpdateIconClassHandler(this, `${contractName}.${contract.TopIconClass}`);
                CH5DpadContractUtils.checkAndUpdateIconUrlHandler(this, `${contractName}.${contract.TopIconUrl}`);
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
    window.customElements.define('ch5-dpad-button-top', Ch5DpadTop);
}
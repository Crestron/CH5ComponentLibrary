import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadAttributesUtils } from "./ch5-dpad-attributes-utils";
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

    // signal based vars for each receive state
    private _receiveStateIconClassSignalValue: string = '';
    private _receiveStateIconUrlSignalValue: string = '';
    private _receivestatescriptlabelhtmlSignalValue: string = '';
    private _receiveStateLabelSignalValue: string = '';

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
     * receiveStateIconClass specif getter-setter
     */
    public set receiveStateIconClass(value: string) {
        this.info('set receiveStateIconClass("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }
        if (!value || this._receiveStateIconClass === value) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateIconClass) {
            const oldReceiveIconClassSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconClass);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveIconClassSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateIconClassSignalValue);
            }
        }

        this._receiveStateIconClass = value;
        this.setAttribute('receiveStateIconClass', value);

        // setup new subscription.
        const receiveIconClassSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconClass);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveIconClassSigName);

        if (receiveSignal === null) {
            return;
        }

        this._receiveStateIconClassSignalValue = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this.iconClass) {
                if (this.receiveStateIconUrl.length < 1 &&
                    !this.parentControlledContractRules.icon &&
                    !this.parentControlledContractRules.label) {
                    this._icon.classList.add(newValue);
                }
            }
        });
    }
    public get receiveStateIconClass() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receiveStateIconClass'.toLowerCase());
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
        super.receiveStateShow = value;
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
        super.receiveStateEnable = value;
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
        super.receiveStateShowPulse = value;
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
        super.receiveStateHidePulse = value;
    }

    /**
     * receiveStateIconUrl specif getter-setter
     */
    public set receiveStateIconUrl(value: string) {
        this.info('set receiveStateIconUrl("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }
        if (!value || this._receiveStateIconUrl === value) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateIconUrl) {
            const oldReceiveIconUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconUrl);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveIconUrlSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateIconUrlSignalValue);
            }
        }

        this._receiveStateIconUrl = value;
        this.setAttribute('receiveStateIconUrl', value);

        // setup new subscription.
        const receiveIconUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconUrl);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveIconUrlSigName);

        if (receiveSignal === null) {
            return;
        }

        this._receiveStateIconUrlSignalValue = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this.iconUrl) {
                if (!this.parentControlledContractRules.icon &&
                    !this.parentControlledContractRules.label) {
                    this._icon.style.backgroundImage = `url(${newValue})`;
                    this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
                }
            }
        });
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
        this.info('set receiveStateLabel("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }

        if (!value || this._receiveStateLabel === value) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateLabel) {
            const oldReceiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateLabel);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveLabelSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receiveStateLabelSignalValue);
            }
        }

        this._receiveStateLabel = value;
        this.setAttribute('receivestatelabel', value);

        // setup new subscription.
        const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateLabel);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);

        if (receiveSignal === null) {
            return;
        }

        this._receiveStateLabelSignalValue = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this.label) {
                this.setAttribute('label', newValue);
                this._icon.innerHTML = newValue;
            }
        });
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
        this.info('set receivestatescriptlabelhtml("' + value + '")');
        // if contract name exists in parent, receiveState based values must be ignored
        if (Boolean(this.parentControlledContractRules.contractName)) {
            return;
        }

        if (!value || this._receivestatescriptlabelhtml === value) {
            return;
        }
        // clean up old subscription
        if (this._receivestatescriptlabelhtml) {
            const oldReceiveScriptLabelHtmlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receivestatescriptlabelhtml);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveScriptLabelHtmlSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._receivestatescriptlabelhtmlSignalValue);
            }
        }

        this._receivestatescriptlabelhtml = value;
        this.setAttribute('receivestatescriptlabelhtml', value);

        // setup new subscription.
        const receiveScriptLabelHtmlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receivestatescriptlabelhtml);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveScriptLabelHtmlSigName);

        if (receiveSignal === null) {
            return;
        }

        this._receivestatescriptlabelhtmlSignalValue = receiveSignal.subscribe((newValue: string) => {
            if ('' !== newValue && newValue !== this._icon.innerHTML) {
                this._icon.innerHTML = newValue;
            }
        });
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
        const btnLabel = CH5DpadUtils.getLabelText(this, this.primaryCssClass, this.parentControlledContractRules.label);
        let elementToRender = {} as HTMLElement;

        // Order of preference is:
        // 0 parentContract
        // 1 recevieStateIconUrl
        // 2 receiveStateIconClass
        // 3 receiveStateLabel
        // 4 iconUrl
        // 5 iconClass
        // 6 label
        if (Boolean(this.parentControlledContractRules.contractName) &&
            (this.parentControlledContractRules.icon || this.parentControlledContractRules.label)) {
            elementToRender = document.createElement('span');
            elementToRender.classList.add('dpad-btn-icon');
        } else if (this.receiveStateIconUrl.length > 0 && this.receiveStateIconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.receiveStateIconUrl);
        } else if (this.receiveStateIconClass && this.receiveStateIconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer();
        } else if (this.receiveStateLabel.length > 0) {
            elementToRender = CH5DpadUtils.getLabelContainer(this.labelClass);
        } else if (this.iconUrl.length > 0 && this.iconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.iconUrl);
            elementToRender.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass && this.iconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer();
            elementToRender.classList.add(this.iconClass);
        } else if (this.label.length > 0) {
            elementToRender = CH5DpadUtils.getLabelContainer(this.labelClass);
            elementToRender.innerHTML = btnLabel;
        } else {
            // if nothing works, then render as default
            elementToRender = CH5DpadUtils.getIconContainer();
            elementToRender.classList.add(this.CSS_CLASS_LIST.defaultIconClass); // 'fa-circle'
        }

        this._icon = elementToRender;

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
        CH5DpadUtils.clearSignalValue(csf, this, "_receiveStateLabelSignalValue", "_receiveStateLabel");
        CH5DpadUtils.clearSignalValue(csf, this, "_receivestatescriptlabelhtmlSignalValue", "_receivestatescriptlabelhtml");

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
        const callback = super.attributeChangedCallback.bind(this);
        const parentContractName: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'contractname', '');
        const isAttributeFound = CH5DpadAttributesUtils.onParentContractBasedAttrChangedCallback(
            this, attr, oldValue, newValue, parentContractName, callback
        );
        if (!isAttributeFound) {
            switch (attr) {
                case 'receivestatescriptlabelhtml': // higher than receivestatelabel and label
                    if (!Boolean(parentContractName)) {
                        this.receivestatescriptlabelhtml = CH5DpadAttributesUtils.setAttributesBasedValue(
                            this.hasAttribute(attr), newValue, '');
                    }
                    break;
                case 'receivestatelabel': // higher than label
                    if (!Boolean(parentContractName)) {
                        this.receiveStateLabel = CH5DpadAttributesUtils.setAttributesBasedValue(
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
                        this.label = CH5DpadAttributesUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                    }
                    break;
                case 'iconclass':
                    // rules for icon are:
                    // 1. (parent contract name should not exist && useContractForIcons must be false) ||
                    // 2. receiveStateIconClass must be empty, while parentContractName is empty
                    if (!Boolean(parentContractName)) {
                        this.iconUrl = CH5DpadAttributesUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                    }
                    break;
                case 'iconurl':
                    // rules for icon are:
                    // 1. (parent contract name should not exist && useContractForIcons must be false) ||
                    // 2. receiveStateIconUrl must be empty, while parentContractName is empty
                    const stateIconUrl: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'receivestateiconurl', '');
                    if (!Boolean(parentContractName)) {
                        this.iconUrl = CH5DpadAttributesUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                    }
                    break;
                default:
                    callback(attr, oldValue, newValue);
                    break;
            }
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
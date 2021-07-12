import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadLeftAttributes } from "./interfaces/i-ch5-dpad-button-left-interfaces";
import { ILeftBtnContract } from "./interfaces/i-ch5-dpad-utils";
import { TButtonClassListType, TParentContractBasedState, TParentControlledContractRules } from "./interfaces/t-ch5-dpad";

export class Ch5DpadLeft extends Ch5Common implements ICh5DpadLeftAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public readonly primaryCssClass = 'ch5-dpad-button-left';
    public readonly cssClassPrefix = 'ch5-dpad-button-left';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-button-left";
    private readonly CSS_CLASS_LIST: TButtonClassListType = {
        primaryTagClass: 'left',
        primaryIconClass: 'fas',
        defaultIconClass: 'fa-caret-left',
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
     * receiveStateIconClass specif getter-setter
     */
    public set receiveStateIconClass(value: string) {
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
                this.setAttribute('iconclass', newValue);
                if (this.receiveStateIconUrl.length < 1 || !this.parentControlledContractRules.icon) {
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
     * receiveStateIconUrl specif getter-setter
     */
    public set receiveStateIconUrl(value: string) {
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
                this.setAttribute('iconurl', newValue);
                this._icon.style.backgroundImage = `url(${newValue})`;
                this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
            }
        });
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
            throw new Error(`Invalid parent element for ch5-dpad-button-left. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too. Reference id: ${this.crId}`);
        }
        this.createElementsAndInitialize();

        customElements.whenDefined('ch5-dpad-button-left').then(() => {
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
     * Function to create all inner html elements required to complete dpad left button
     */
    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        this.classList.add(this.primaryCssClass);
        this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
        this.classList.add(this.CSS_CLASS_LIST.defaultArrowClass);

        const btnIconUrl = CH5DpadUtils.getImageUrl(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        const btnIconClass = CH5DpadUtils.getIconClass(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        let elementToRender = {} as HTMLElement;

        // Order of preference is:
        // 0 parentContract
        // 1 recevieStateIconUrl
        // 2 receiveStateIconClass
        // 3 iconUrl
        // 4 iconClass
        if (Boolean(this.parentControlledContractRules.contractName) &&
            this.parentControlledContractRules.icon) {
            elementToRender = document.createElement('span');
            elementToRender.classList.add('dpad-btn-icon');
        } else if (this.receiveStateIconUrl.length > 0 && this.receiveStateIconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.receiveStateIconUrl);
        } else if (this.receiveStateIconClass && this.receiveStateIconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer();
        } else if (this.iconUrl.length > 0 && this.iconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.iconUrl);
            elementToRender.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass && this.iconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer();
            elementToRender.classList.add(this.iconClass);
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
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-dpad-button-left attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

        switch (attr) {
            case 'iconclass':
                if (this.hasAttribute('iconclass')) {
                    this.iconClass = newValue;
                } else {
                    this.iconClass = '';
                }
                break;
            case 'iconurl':
                if (this.hasAttribute('iconurl')) {
                    this.iconUrl = newValue;
                } else {
                    this.iconUrl = '';
                }
                break;
            case 'receivestateiconclass':
                if (this.hasAttribute('receivestateiconclass')) {
                    this.receiveStateIconClass = newValue;
                } else {
                    this.receiveStateIconClass = '';
                }
                break;
            case 'receivestateiconurl':
                if (this.hasAttribute('receivestateiconurl')) {
                    this.receiveStateIconUrl = newValue;
                } else {
                    this.receiveStateIconUrl = '';
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

        // will have the flags ready for contract level content to be ready
        this.buildParentBasedContract();

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
    private buildParentBasedContract() {
        const contract: ILeftBtnContract = CH5DpadContractUtils.getLeftBtnContract();
        this.parentControlledContractRules = CH5DpadUtils.buildParentControlledContractRules(this);
        // TODO: need to set this value
        const { contractName, show, enable, icon } = this.parentControlledContractRules;
        if (Boolean(contractName)) {
            CH5DpadContractUtils.checkAndUpdateClickHandler(this, `${contractName}.${contract.LeftClicked}`);
            if (show) {
                CH5DpadContractUtils.checkAndUpdateShowHandler(this, `${contractName}.${contract.LeftShow}`);
            }
            if (enable) {
                CH5DpadContractUtils.checkAndUpdateEnableHandler(this, `${contractName}.${contract.LeftEnable}`);
            }
            if (icon) {
                CH5DpadContractUtils.checkAndUpdateIconClassHandler(this, `${contractName}.${contract.LeftIconClass}`);
                CH5DpadContractUtils.checkAndUpdateIconUrlHandler(this, `${contractName}.${contract.LeftIconUrl}`);
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
    window.customElements.define('ch5-dpad-button-left', Ch5DpadLeft);
}
import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadBottomAttributes } from "./interfaces/i-ch5-dpad-button-bottom-interfaces";
import { TButtonClassListType, TParentControlledContractRules } from "./interfaces/t-ch5-dpad";

export class Ch5DpadBottom extends Ch5Common implements ICh5DpadBottomAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public readonly primaryCssClass = 'ch5-dpad-button-bottom';
    public readonly cssClassPrefix = 'ch5-dpad-button-bottom';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-button-bottom";
    private arrowBtnClass:string = 'direction-btn';
    private readonly CSS_CLASS_LIST: TButtonClassListType = {
        primaryTagClass: 'bottom',
        primaryIconClass: 'fas',
        defaultIconClass: 'fa-caret-down'
    };

    // private setter getter specific vars
    // private _disabled: boolean = true; // not required as its in common.ts
    // private _show: boolean = true; // not required as its in common.ts
    private _iconClass: string = '';
    private _iconUrl: string = '';
    private _receiveStateIconClass: string = '';
    private _receiveStateIconUrl: string = '';

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
     * disable specif getter-setter
     */
    public set disabled(value: boolean) {
        this.info('Ch5Form set disable("' + value + '")');

        const isdisable = this._toBoolean(value);

        if (this._disabled !== isdisable) {
            this._disabled = isdisable;

            this.setAttribute('disable', isdisable.toString());
        }
    }
    public get disabled(): boolean {
        return this._disabled;
    }

    /**
     * show specif getter-setter
     */
    public set show(value: boolean) {
        this.info('Ch5Form set show("' + value + '")');

        const isshow = this._toBoolean(value);

        if (this._show !== isshow) {
            this._show = isshow;

            this.setAttribute('show', isshow.toString());
        }
    }
    public get show(): boolean {
        return this._show;
    }

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
        this.info('set receiveStateIconClass("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('receiveStateIconClass', value);
        if (trValue === this.receiveStateIconClass) {
            return;
        }

        this._receiveStateIconClass = trValue;
        this.setAttribute('receiveStateIconClass', trValue);
    }
    public get receiveStateIconClass() {
        return this._receiveStateIconClass;
    }

    /**
     * receiveStateIconUrl specif getter-setter
     */
    public set receiveStateIconUrl(value: string) {
        this.info('set receiveStateIconUrl("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('receiveStateIconUrl', value);
        if (trValue === this.receiveStateIconUrl) {
            return;
        }

        this._receiveStateIconUrl = trValue;
        this.setAttribute('receiveStateIconUrl', trValue);
    }
    public get receiveStateIconUrl() {
        return this._receiveStateIconUrl;
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
            throw new Error(`Invalid parent element for ch5-dpad-button-bottom. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too. Reference id: ${this.crId}`);
        }
        this.createElementsAndInitialize();

        customElements.whenDefined('ch5-dpad-button-bottom').then(() => {
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
     * Function to create all inner html elements required to complete dpad bottom button
     */
    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        this.classList.add(this.primaryCssClass);
        this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
        this.classList.add(this.arrowBtnClass);

        const btnIconUrl = CH5DpadUtils.getImageUrl(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        const btnIconClass = CH5DpadUtils.getIconClass(this, this.primaryCssClass, this.parentControlledContractRules.icon);
        let elementToRender = {} as HTMLElement;

        // Order of preference is:
        // 1 recevieStateIconUrl
        // 2 receiveStateIconClass
        // 3 receiveStateLabel
        // 4 iconUrl
        // 5 iconClass
        // 6 label
        if (this.receiveStateIconUrl.length > 0 && this.receiveStateIconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.receiveStateIconUrl);
        } else if (this.receiveStateIconClass && this.receiveStateIconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer(this.receiveStateIconClass);
            elementToRender.classList.add(this.CSS_CLASS_LIST.primaryIconClass); // 'fas'
        } else if (this.iconUrl.length > 0 && this.iconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.iconUrl);
        } else if (this.iconClass && this.iconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer(this.iconClass);
        } else {
            // if nothing works, then render as default
            elementToRender = CH5DpadUtils.getIconContainer(this.CSS_CLASS_LIST.defaultIconClass); // 'fa-circle'
            elementToRender.classList.add(this.CSS_CLASS_LIST.primaryIconClass); // 'fas'
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
        super.unsubscribeFromSignals();
    }

    static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;

        // attributes
        const attributes = [
            "iconclass",
            "iconurl"
        ];

        // received signals
        const receivedSignals = [
            "receivestateiconclass",
            "receivestateiconurl"
        ];

        // sent signals
        const sentSignals: string[] = [];

        const ch5DpadAttributes = commonAttributes.concat(attributes).concat(receivedSignals).concat(sentSignals);

        return ch5DpadAttributes;
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-dpad-button-bottom attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

        switch (attr) {
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        this.logger.start("initAttributes", this.COMPONENT_NAME);
        super.initAttributes();

        // will have the flags ready for contract level content to be ready
        this.buildParentControlledContractRules();

        CH5DpadUtils.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5DpadChild); // WAI-ARIA Attributes

        // below actions, set default value to the control's attribute if they dont exist, and assign them as a return value
        this.iconClass = CH5DpadUtils.setAttributeToElement(this, 'iconClass', this._iconClass);
        this.iconUrl = CH5DpadUtils.setAttributeToElement(this, 'iconUrl', this._iconUrl);
        this.updateDisableAttributeStatus(); // this updates "disabled" specific attribute
        this.show = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'show', this._show.toString())
        );
        this.receiveStateIconClass =
            CH5DpadUtils.setAttributeToElement(this, 'receiveStateIconClass', this._receiveStateIconClass);

        // update attributes based on dpad (parent container)'s contract name
        this.updateContractSpecificKeys_Show();
        this.updateContractSpecificKeys_Enable();

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
     * Function to create and assign values for parentcontrolled contract rules
     */
    private buildParentControlledContractRules() {
        // the default value for all the flags are 'false'
        this.parentControlledContractRules = {
            contractName: CH5DpadUtils.getAttributeAsString(this.parentElement, 'contractName', ''),
            enable: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractforEnable', false),
            show: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractForShow', false),
            label: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractforLabel', false),
            icon: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractForIcons', false)
        };
    }

    /**
     * Function to update the label based on the contract value
     */
    private updateContractSpecificKeys_Show() {
        const { show, contractName } = this.parentControlledContractRules;
        const bottomBtnContractShow = CH5DpadContractUtils.getBottomBtnContract().BottomShow;
        if (show) { // this meeans, DPAD enforces contract on this button
            if (contractName.length > 0) {
                const contractValue = `${contractName}.${bottomBtnContractShow}`;
                this.setAttribute("receiveStateShow", contractValue);
            } else {
                throw new Error(`Dpad has useContractForShow as true, but contract name is invalid. Reference id: ${this.crId}`);
            }
        }
    }

    /**
     * Function to update the label based on the contract value
     */
    private updateContractSpecificKeys_Enable() {
        const { enable, contractName } = this.parentControlledContractRules;
        const bottomBtnContractEnable = CH5DpadContractUtils.getBottomBtnContract().BottomEnable;
        if (enable) { // this meeans, DPAD enforces contract on this button
            if (contractName.length > 0) {
                const contractValue = `${contractName}.${bottomBtnContractEnable}`;
                this.setAttribute("receiveStateEnable", contractValue);
            } else {
                throw new Error(`Dpad has useContractForEnable as true, but contract name is invalid. Reference id: ${this.crId}`);
            }
        }
    }

    /**
     * Function to set disabled value and attribute if its true
     */
    private updateDisableAttributeStatus() {
        this.disabled = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'disabled', this._disabled.toString())
        );
        if (!this.disabled) {
            this.removeAttribute('disabled');
        } else {
            this.setAttribute('disabled', 'true');
        }
    }

    //#endregion

    //#region 5. Events
    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-dpad-button-bottom', Ch5DpadBottom);
}
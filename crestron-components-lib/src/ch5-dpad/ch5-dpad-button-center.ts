import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadCenterAttributes } from "./interfaces/i-ch5-dpad-button-center-interfaces";
import { TButtonClassListType, TParentControlledContractRules } from "./interfaces/t-ch5-dpad";

export class Ch5DpadCenter extends Ch5Common implements ICh5DpadCenterAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public readonly primaryCssClass = 'ch5-dpad-button-center';
    public readonly cssClassPrefix = 'ch5-dpad-button-center';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-button-center";
    private readonly CSS_CLASS_LIST: TButtonClassListType = {
        primaryTagClass: 'center',
        primaryIconClass: 'fas',
        defaultIconClass: 'fa-circle'
    };

    // private setter getter specific vars
    // private _disabled: boolean = true; // not required as its in common.ts
    // private _show: boolean = true; // not required as its in common.ts
    private _iconClass: string = '';
    private _iconUrl: string = '';
    private _label: string = '';
    private _receiveStateIconClass: string = '';
    private _receiveStateIconUrl: string = '';
    private _receiveStateLabel: string = '';
    private _receivestatescriptlabelhtml: string = '';

    // elements specific vars
    private _icon: HTMLElement = {} as HTMLElement;

    // state specific vars
    private parentControlledContractRules: TParentControlledContractRules = {
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

    /**
     * receiveStateLabel specif getter-setter
     */
    public set receiveStateLabel(value: string) {
        this.info('set receiveStateLabel("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('receiveStateLabel', value);
        if (trValue === this.receiveStateLabel) {
            return;
        }

        this._receiveStateLabel = trValue;
        this.setAttribute('receiveStateLabel', trValue);
    }
    public get receiveStateLabel() {
        return this._receiveStateLabel;
    }

    /**
     * receivestatescriptlabelhtml specif getter-setter
     */
    public set receivestatescriptlabelhtml(value: string) {
        this.info('set receivestatescriptlabelhtml("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('receivestatescriptlabelhtml', value);
        if (trValue === this.receivestatescriptlabelhtml) {
            return;
        }

        this._receivestatescriptlabelhtml = trValue;
        this.setAttribute('receivestatescriptlabelhtml', trValue);
    }
    public get receivestatescriptlabelhtml() {
        return this._receivestatescriptlabelhtml;
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

        const crId = this.getCrId();
        this.setAttribute('data-ch5-id', crId);

        if (!(this.parentElement instanceof Ch5Dpad)) {
            throw new Error(`Invalid parent element for ch5-dpad-buitton-center. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too. Reference id: ${crId}`);
        }
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
            this.checkElementStatus();
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
        } else if (this.receiveStateLabel.length > 0) {
            elementToRender = CH5DpadUtils.getLabelContainer(btnLabel);
        } else if (this.iconUrl.length > 0 && this.iconUrl === btnIconUrl) {
            elementToRender = CH5DpadUtils.getImageContainer(this.iconUrl);
        } else if (this.iconClass && this.iconClass === btnIconClass) {
            elementToRender = CH5DpadUtils.getIconContainer(this.iconClass);
        } else if (this.label.length > 0) {
            elementToRender = CH5DpadUtils.getLabelContainer(btnLabel);
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
            "iconurl",
            "label"
        ];

        // received signals
        const receivedSignals = [
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
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-dpad-button-center attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

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

        CH5DpadUtils.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5DpadChild); // WAI-ARIA Attributes

        // below actions, set default value to the control's attribute if they dont exist, and assign them as a return value
        this.iconClass = CH5DpadUtils.setAttributeToElement(this, 'iconClass', this._iconClass);
        this.iconUrl = CH5DpadUtils.setAttributeToElement(this, 'iconUrl', this._iconUrl);
        this.disabled = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'disabled', this._disabled.toString())
        );
        this.show = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'show', this._show.toString())
        );
        this.label = CH5DpadUtils.setAttributeToElement(this, 'label', this._label);
        this.receiveStateIconClass =
            CH5DpadUtils.setAttributeToElement(this, 'receiveStateIconClass', this._receiveStateIconClass);
        this.receiveStateLabel = CH5DpadUtils.setAttributeToElement(this, 'receiveStateLabel', this._receiveStateLabel);
        this.receiveStateLabel = CH5DpadUtils.setAttributeToElement(this, 'receiveStateLabel', this._receiveStateLabel);
        this.receivestatescriptlabelhtml =
            CH5DpadUtils.setAttributeToElement(this, 'receivestatescriptlabelhtml', this._receivestatescriptlabelhtml);

        this.buildParentControlledContractRules();

        this.logger.stop();
    }

    /**
     * Function to check if parent has contract and 
     * whether enable and show statuses must be controlled by them instead of self attributes
     */
    protected checkElementStatus() {
        const isForcedToEnableViaContractByParent = CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractforEnable', true);
        const isForcedToShowViaContractByParent = CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractForShow', true);
        if (isForcedToEnableViaContractByParent) {
            this.removeAttribute('disabled');
        }
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
            enable: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractforEnable', false),
            show: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractForShow', false),
            label: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractforLabel', false),
            icon: CH5DpadUtils.getAttributeAsBool(this.parentElement, 'useContractForIcons', false)
        };
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
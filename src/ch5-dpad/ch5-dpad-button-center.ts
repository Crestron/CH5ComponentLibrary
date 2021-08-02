import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadCenterAttributes } from "./interfaces/i-ch5-dpad-button-center-interfaces";
import { TButtonClassListType } from "./interfaces/t-ch5-dpad";

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
    private _sendEventOnClick: string = '';

    // signal based vars for each receive state

    // parent specific contract based signals for each receive state


    // elements specific vars
    private _icon: HTMLElement = {} as HTMLElement;

    // state specific vars
    private crId: string = '';

    //#endregion

    //#endregion

    //#region 2. Setters and Getters

    /**
     * iconClass specif getter-setter
     */
    public set iconClass(value: string) {
        this.info('set iconClass("' + value + '")');

        if (_.isNil(value)) {
            value = this.CSS_CLASS_LIST.defaultIconClass;
        }

        let trValue: string = '';

        trValue = this._getTranslatedValue('iconClass'.toLowerCase(), value);
        if (trValue === this.iconClass) {
            return;
        }

        this._iconClass = trValue;
        this.setAttribute('iconClass', trValue);
        if (this._iconUrl.length < 1) {
            if (this._iconClass.length > 0) {
                this._icon.classList.add(...(this._iconClass.split(' ')));
            } else {
                this._icon.classList.remove(this.CSS_CLASS_LIST.primaryIconClass);
                this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
            }
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

        const trValue: string = this._getTranslatedValue('iconUrl'.toLowerCase(), value);
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

        const trValue: string = this._getTranslatedValue('label'.toLowerCase(), value);
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
     * sendEventOnClick specif getter-setter
     */
    public set sendEventOnClick(value: string) {
        this.info('set sendEventOnClick("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('sendEventOnClick'.toLowerCase(), value);
        if (trValue === this.sendEventOnClick) {
            return;
        }

        this._sendEventOnClick = trValue;
        this.setAttribute('sendEventOnClick'.toLowerCase(), trValue);
    }
    public get sendEventOnClick() {
        return this._sendEventOnClick;
    }

    /**
     * overriding default receiveStateShow specif getter-setter
     */
    public set receiveStateShow(value: string) {
        this.removeAttribute("receiveStateShow".toLowerCase());
        return;
    }
    public get receiveStateShow() {
        return "";
    }

    /**
     * overriding default receiveStateEnable specif getter-setter
     */
    public set receiveStateEnable(value: string) {
        this.removeAttribute("receiveStateEnable".toLowerCase());
        return;
    }
    public get receiveStateEnable() {
        return "";
    }

    /**
     * overriding default receiveStateShowPulse specif getter-setter
     */
    public set receiveStateShowPulse(value: string) {
        this.removeAttribute("receiveStateShowPulse".toLowerCase());
        return;
    }
    public get receiveStateShowPulse() {
        return "";
    }

    /**
     * overriding default receivestateshow specif getter-setter
     */
    public set receiveStateHidePulse(value: string) {
        this.removeAttribute("receiveStateHidePulse".toLowerCase());
        return;
    }
    public get receiveStateHidePulse() {
        return "";
    }

    /**
     * overriding default receiveStateCustomStyle specif getter-setter
     */
    public set receiveStateCustomStyle(value: string) {
        this.removeAttribute("receiveStateCustomStyle".toLowerCase());
        return;
    }
    public get receiveStateCustomStyle() {
        return "";
    }

    /**
     * overriding default receiveStateCustomClass specif getter-setter
     */
    public set receiveStateCustomClass(value: string) {
        this.removeAttribute("receiveStateCustomClass".toLowerCase());
        return;
    }
    public get receiveStateCustomClass() {
        return "";
    }

    /**
     * overriding default dir specif getter-setter
     */
    public set dir(value: string) {
        this.removeAttribute("dir".toLowerCase());
        return;
    }
    public get dir() {
        return "";
    }

    //#endregion

    //#region 3. Lifecycle Hooks

    public constructor() {
        super();
        this.logger.start('constructor()', this.COMPONENT_NAME);

        CH5DpadUtils.clearComponentContent(this);

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

        // Order of preference is:
        // 0 parentContract
        // 4 iconUrl
        // 5 iconClass
        // 6 label
        if (this.iconUrl.length > 0) {
            this._icon = CH5DpadUtils.getImageContainer(this.iconUrl);
            this._icon.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(...(this.iconClass.split(' ')));
        } else if (this.label.length > 0) {
            this._icon = CH5DpadUtils.getLabelContainer(this.labelClass);
            this._icon.innerHTML = this.label;
        } else {
            // if nothing works, then render as default
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass); // 'fas'
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
        // throw new Error("Method not implemented or element is not structured correctly.");
    }

    /**
     * Unsubscribe signals
     */
    public unsubscribeFromSignals() {
        this.logger.start("unsubscribeFromSignals", this.COMPONENT_NAME);
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();
        const signalArr = [""];
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
            "label",
            "iconclass",
            "iconurl"
        ];

        // received signals
        const receivedSignals: string[] = [
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
        const isValidParentContractName = !Boolean(parentContractName);
        switch (attr) {
            case 'receivestateshow':
            case 'receivestateenable':
            case 'receivestateshowpulse':
            case 'receivestatehidepulse':
            case 'receivestatecustomstyle':
            case 'receivestatecustomclass':
            case 'dir':
                // Do nothing for any of the receiveState*
                break;
            case 'label':
                this.label = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'iconclass':
                this.iconClass = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'iconurl':
                this.iconUrl = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'show':
            case 'enable':
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
        this.label = CH5DpadUtils.setAttributeToElement(this, 'label', this._label);
        this.iconClass = CH5DpadUtils.setAttributeToElement(this, 'iconClass', this._iconClass);
        this.iconUrl = CH5DpadUtils.setAttributeToElement(this, 'iconUrl', this._iconUrl);

        const parentContractName: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'contractname', '');
        const parentContractEvent: string = CH5DpadUtils.getAttributeAsString(this.parentElement, 'sendeventonclickstart', '');
        if (parentContractName.length > 0) {
            const joinValue = parentContractName + '.Center';
            this.sendEventOnClick = joinValue.toString();
        } else if (parentContractEvent.length > 0) {
            const joinValue = parseInt(parentContractEvent, 10) + CH5DpadContractUtils.sendEventOnClickSigCountToAdd.center;
            this.sendEventOnClick = joinValue.toString();
        } else {
            this.sendEventOnClick = "";
        }

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

    // TODO: HH - Delete all commented code below if not used under this code-region
    // /**
    //  * Function to build parent controlled contract rules and contract structure based on them
    //  */
    //  private buildParentBasedContractRef() {
    //     const contract: ICenterBtnContract = CH5DpadContractUtils.getCenterBtnContract();
    //     this.parentControlledContractRules = CH5DpadUtils.buildParentControlledContractRules(this);
    //     // TODO: need to set this value
    //     const { contractName, show, enable, icon, label } = this.parentControlledContractRules;
    //     if (Boolean(contractName)) {
    //         this._icon = document.createElement('span');
    //         CH5DpadContractUtils.checkAndUpdateClickHandler(this, `${contractName}.${contract.CenterClicked}`);
    //         if (show) {
    //             CH5DpadContractUtils.checkAndUpdateShowHandler(this, `${contractName}.${contract.CenterShow}`);
    //         }
    //         if (enable) {
    //             CH5DpadContractUtils.checkAndUpdateEnableHandler(this, `${contractName}.${contract.CenterEnable}`);
    //         }
    //         if (icon) {
    //             CH5DpadContractUtils.checkAndUpdateIconClassHandler(this, `${contractName}.${contract.CenterIconClass}`);
    //             CH5DpadContractUtils.checkAndUpdateIconUrlHandler(this, `${contractName}.${contract.CenterIconUrl}`);
    //         }
    //         if (label) {
    //             CH5DpadContractUtils.checkAndUpdateLabelHandler(this, this.labelClass, `${contractName}.${contract.CenterLabel}`);
    //         }
    //     }
    // }

    //#endregion

    //#region 5. Events
    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-dpad-button-center', Ch5DpadCenter);
}
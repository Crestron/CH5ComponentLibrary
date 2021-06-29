import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { ICh5DpadRightAttributes } from "./interfaces/i-ch5-dpad-button-right-interfaces";

export class Ch5DpadRight extends Ch5Common implements ICh5DpadRightAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public readonly primaryCssClass = 'ch5-dpad-button-right';
    public readonly cssClassPrefix = 'ch5-dpad-button-right';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-button-right";

    // private setter getter specific vars
    private _iconClass: string = '';
    private _iconUrl: string = '';
    private _disable: boolean = true;
    // private _show: boolean = true; // not required
    private _receiveStateIconClass: string = '';
    private _receiveStateIconUrl: string = '';

    // elements specific vars
    private _icon: HTMLElement = {} as HTMLElement;

    /**
     * Ch5Pressable manager
     *
     * @private
     * @type {(Ch5Pressable | null)}
     * @memberof Ch5Image
     */
    private _pressable: Ch5Pressable | null = null;

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
     * disable specif getter-setter
     */
    public set disable(value: boolean) {
        this.info('Ch5Form set disable("' + value + '")');

        const isdisable = this._toBoolean(value);

        if (this._disable !== isdisable) {
            this._disable = isdisable;

            this.setAttribute('disable', isdisable.toString());
        }
    }
    public get disable(): boolean {
        return this._disable;
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

        this._pressable = new Ch5Pressable(this);

        // events binding

        // check if the dpad element has been created by verifying one of its properties
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.info(' connectedCallback() - start');

        if (!(this.parentElement instanceof Ch5Dpad)) {
            throw new Error(`Invalid parent element for ch5-dpad-buitton-right. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too.`);
        }

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5DpadChild);
        }

        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());

        // init pressable before initAttributes because pressable subscribe to gestureable attribute
        if (null !== this._pressable) {
            this._pressable.init();
        }

        customElements.whenDefined('ch5-dpad-button-right').then(() => {
            this.createElementsAndInitialize();
            this.initAttributes();
            this.attachEventListeners();

            this.updateCssClasses();

            this.initCommonMutationObserver(this);

            this.info(' connectedCallback() - end');
        });
    }

    /**
     * Function to create HTML elements of the components including child elements
     */
    private createElementsAndInitialize() {
        if (!this._wasInstatiated) {
            this.createHtmlElements();
        }
        this._wasInstatiated = true;

        if (this._icon.parentElement !== this) {
            this.appendChild(this._icon);
        }
    }

    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        this.classList.add(this.primaryCssClass);
        this.classList.add('direction-btn');
        this.classList.add('right');

        this._icon = document.createElement('i');
        this._icon.classList.add('fas');
        this._icon.classList.add('fa-caret-right');

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

        this.info('ch5-dpad-button-right attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

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
        super.initAttributes();
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
    //#endregion

    //#region 5. Events
    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {

    window.customElements.define('ch5-dpad-button-right', Ch5DpadRight);
}
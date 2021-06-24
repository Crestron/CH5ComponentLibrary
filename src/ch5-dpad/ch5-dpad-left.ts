import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5DpadLeftAttributes } from "./interfaces/i-ch5-dpad-left-interfaces";
import { TCh5DpadShape, TCh5DpadStretch, TCh5DpadType } from "./interfaces/t-ch5-dpad";

export class Ch5DpadLeft extends Ch5Common implements ICh5DpadLeftAttributes {

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

    public readonly primaryCssClass = 'ch5-dpad-left';
    public readonly cssClassPrefix = 'ch5-dpad-left';

    //#endregion

    //#region 1.2 private / protected variables
    private COMPONENT_NAME: string = "ch5-dpad-left";
    private _contractName: string = '';
    private _type: TCh5DpadType = 'default';
    private _shape: TCh5DpadShape = 'plus';
    private _stretch: TCh5DpadStretch = 'both';
    private _useContractforLabel: boolean = true;
    private _useContractforEnable: boolean = true;
    private _useContractForShow: boolean = true;
    private _useContractForIcons: boolean = true;

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
     * contractName specif getter-setter
     */
    public set contractName(value: string) {
        this.info('set contractName("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        const trValue: string = this._getTranslatedValue('contractName', value);
        if (trValue === this.contractName) {
            return;
        }

        this._contractName = trValue;
        this.setAttribute('contractName', trValue);
    }
    public get contractName(): string {
        return this._contractName;
    }

    /**
     * type specif getter-setter
     */
    public set type(value: TCh5DpadType) {
        this.info('set type("' + value + '")');

        if (_.isNil(value)) {
            value = 'default';
        }

        const trValue: TCh5DpadType = this._getTranslatedValue('type', value) as TCh5DpadType;
        if (trValue === this.type) {
            return;
        }

        this._type = trValue;
        this.setAttribute('type', trValue);
    }
    public get type(): TCh5DpadType {
        return this._type;
    }

    /**
     * shape specif getter-setter
     */
    public set shape(value: TCh5DpadShape) {
        this.info('set shape("' + value + '")');

        if (_.isNil(value)) {
            value = 'plus';
        }

        const trValue: TCh5DpadShape = this._getTranslatedValue('shape', value) as TCh5DpadShape;
        if (trValue === this.shape) {
            return;
        }

        this._shape = trValue;
        this.setAttribute('shape', trValue);
    }
    public get shape(): TCh5DpadShape {
        return this._shape;
    }

    /**
     * stretch specif getter-setter
     */
    public set stretch(value: TCh5DpadStretch) {
        this.info('set stretch("' + value + '")');

        if (_.isNil(value)) {
            value = 'both';
        }

        const trValue: TCh5DpadStretch = this._getTranslatedValue('stretch', value) as TCh5DpadStretch;
        if (trValue === this.stretch) {
            return;
        }

        this._stretch = trValue;
        this.setAttribute('stretch', trValue);
    }
    public get stretch(): TCh5DpadStretch {
        return this._stretch;
    }

    /**
     * useContractforLabel specif getter-setter
     */
    public set useContractforLabel(value: boolean) {
        this.info('Ch5Form set useContractforLabel("' + value + '")');

        const isUseContractforLabel = this._toBoolean(value);

        if (this._useContractforLabel !== isUseContractforLabel) {
            this._useContractforLabel = isUseContractforLabel;

            this.setAttribute('useContractforLabel', isUseContractforLabel.toString());
        }
    }
    public get useContractforLabel(): boolean {
        return this._useContractforLabel;
    }

    /**
     * useContractforEnable specif getter-setter
     */
    public set useContractforEnable(value: boolean) {
        this.info('Ch5Form set useContractforEnable("' + value + '")');

        const isUseContractforEnable = this._toBoolean(value);

        if (this._useContractforEnable !== isUseContractforEnable) {
            this._useContractforEnable = isUseContractforEnable;

            this.setAttribute('useContractforEnable', isUseContractforEnable.toString());
        }
    }
    public get useContractforEnable(): boolean {
        return this._useContractforEnable;
    }

    /**
     * useContractForShow specif getter-setter
     */
    public set useContractForShow(value: boolean) {
        this.info('Ch5Form set useContractForShow("' + value + '")');

        const isuseContractForShow = this._toBoolean(value);

        if (this._useContractForShow !== isuseContractForShow) {
            this._useContractForShow = isuseContractForShow;

            this.setAttribute('useContractForShow', isuseContractForShow.toString());
        }
    }
    public get useContractForShow(): boolean {
        return this._useContractForShow;
    }

    /**
     * useContractForIcons specif getter-setter
     */
    public set useContractForIcons(value: boolean) {
        this.info('Ch5Form set useContractForIcons("' + value + '")');

        const isuseContractForIcons = this._toBoolean(value);

        if (this._useContractForIcons !== isuseContractForIcons) {
            this._useContractForIcons = isuseContractForIcons;

            this.setAttribute('useContractForIcons', isuseContractForIcons.toString());
        }
    }
    public get useContractForIcons(): boolean {
        return this._useContractForIcons;
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

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5Dpad);
        }

        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());

        // init pressable before initAttributes because pressable subscribe to gestureable attribute
        if (null !== this._pressable) {
            this._pressable.init();
        }

        customElements.whenDefined('ch5-dpad-left').then(() => {

            this.initAttributes();
            this.attachEventListeners();

            this.updateCssClasses();

            this.initCommonMutationObserver(this);

            this.info(' connectedCallback() - end');
        });
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
        throw new Error("Method not implemented.");
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
            "contractname",
            "type",
            "shape",
            "stretch",
            "usecontractforlabel",
            "usecontractforenable",
            "usecontractforshow",
            "usecontractforicons"
        ];

        // received signals
        const receivedSignals = [
            "receiveStateCustomClass",
            "receiveStateCustomStyle",
            "receiveStateShow",
            "receiveStateShowPulse",
            "receiveStateHidePulse",
            "receiveStateEnable"
        ];

        // sent signals
        const sentSignals:string[] = [];

        const ch5DpadAttributes = commonAttributes.concat(attributes).concat(receivedSignals).concat(sentSignals);

        return ch5DpadAttributes;
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-dpad-left attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

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

    window.customElements.define('ch5-dpad-left', Ch5DpadLeft);
}
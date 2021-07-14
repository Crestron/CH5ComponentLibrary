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
    private _type: TCh5DpadType = 'default';
    private _shape: TCh5DpadShape = 'plus';
    private _stretch: TCh5DpadStretch = 'both';
    private _useContractforLabel: boolean = false;
    private _useContractforEnable: boolean = false;
    private _useContractForShow: boolean = false;
    private _useContractForIcons: boolean = false;

    // state specific vars
    private isComponentLoaded: boolean = false;

    // elements specific vars

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
        this.info(' connectedCallback() - start', this.COMPONENT_NAME);

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
            this.info('connectedCallback() - end', this.COMPONENT_NAME);
        }
        this.logger.stop();
    }

    /**
     * Function create and bind events for dpad once all the expected child elements are defined and
     * ready for consumption
     */
    private onAllSubElementsCreated() {
        this.info(' onAllSubElementsCreated() - start', this.COMPONENT_NAME);
        customElements.whenDefined('ch5-dpad').then(() => {
            // create element
            this.createElementsAndInitialize();

            // update class based on the current type chosen
            this.updateCssClasses();

            // events binding
            this.attachEventListeners();

            // check if the dpad element has been created by verifying one of its properties


            // initialize mutation observer if any
            this.initCommonMutationObserver(this);
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
        throw new Error("Method not implemented or element is not structured correctly.");
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
            "usecontractforlabel",
            "usecontractforenable",
            "usecontractforshow",
            "usecontractforicons"
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

        switch (attr) {
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
        this.classList.add(this.shape);

        const childItems = this.children;

        if (childItems.length === 0) {
            this.createAndAppendAllButtonsUnderDpad();
        } else {
            const isValidStructure = this.checkIfOrderOfTagsAreinTheRightOrder(childItems);
            if (!isValidStructure) {
                throw new Error("ch5-dpad not constructed correctly, please refer documentation.");
            }
        }

        this.logger.stop();
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
        // order of appending is --- center, top, left/right, right/left, bottom
        this.appendChild(centerBtn);
        this.appendChild(topBtn);

        if (this.shape === Ch5Dpad.SHAPES[0]) {
            // if the selected shape is 'plus'
            this.appendChild(leftBtn);
            this.appendChild(rightBtn);
        }
        else if (this.shape === Ch5Dpad.SHAPES[1]) {
            // if the selected shape is 'circle'
            this.appendChild(rightBtn);
            this.appendChild(leftBtn);
        } else {
            // if the selected shape is an invalid value
            throw new Error("Seems to be an invalid shape. Must be 'plus' or 'circle' as values.");
        }

        this.appendChild(bottomBtn);
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
        this.contractName = CH5DpadUtils.setAttributeToElement(this, 'contractName', this._contractName);
        this.type = CH5DpadUtils.setAttributeToElement(this, 'type', this._type) as TCh5DpadType;
        this.shape = CH5DpadUtils.setAttributeToElement(this, 'shape', this._shape) as TCh5DpadShape;
        this.stretch = CH5DpadUtils.setAttributeToElement(this, 'stretch', this._stretch) as TCh5DpadStretch;

        // DEV NOTE: if contract name exists, and the individual attribute values don't exist, 
        // then the default value is true for useContractFor*
        // else useContractFor* picks value from attributes
        const isContractNameAvailable = Boolean(this.contractName).toString();
        this.useContractforLabel = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractforLabel', isContractNameAvailable));
        this.useContractforEnable = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractforEnable', isContractNameAvailable));
        this.useContractForShow = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractForShow', isContractNameAvailable));
        this.useContractForIcons = CH5DpadUtils.getBoolFromString(
            CH5DpadUtils.setAttributeToElement(this, 'useContractForIcons', isContractNameAvailable));

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
     * Function to restructure initial DOM before rendering commences
     */
    private checkAndRestructureDomOfDpad() {
        this.logger.start('checkAndRestructureDomOfDpad()', this.COMPONENT_NAME);
        if (this.children.length === 0) {
            // nothing to do, all buttons will be appended as required
            return;
        } else {
            this.removeDuplicateChildElements();
        }

        this.logger.stop();
    }

    private removeDuplicateChildElements() {
        const childItems: Element[] = Array.from(this.children);
        // DEV NOTE: DONT CHANGE THE SEQUENCE OF ENTRIES IN THIS ARRAY
        const childElementArray: string[] = ["ch5-dpad-button-center",
            "ch5-dpad-button-top",
            "ch5-dpad-button-left",
            "ch5-dpad-button-right",
            "ch5-dpad-button-bottom"];

        const refobj: any = {}; // stores the reference of all buttons relevant for dpad

        // // FIRST: remove all duplciate entries under DPAD
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

        // // SECOND: create and add all non existing child tags 
        if (refobj !== null) {
            for (const tagName of childElementArray) {
                if (!refobj.hasOwnProperty(tagName)) {
                    const ele = document.createElement(tagName);
                    refobj[tagName] = ele as HTMLElement;
                }
            }
        }
        // // THIRD: Finally, add the elements in the right order
        if (this.shape === Ch5Dpad.SHAPES[0] && this !== null) {
            // if the selected shape is 'plus'
            // ORDER: center, top, left, right, bottom
            this.appendChild(refobj[childElementArray[0]]);
            this.appendChild(refobj[childElementArray[1]]);
            this.appendChild(refobj[childElementArray[2]]); // first, left element
            this.appendChild(refobj[childElementArray[3]]); // then, the right element
            this.appendChild(refobj[childElementArray[4]]);
        } else if (this.shape === Ch5Dpad.SHAPES[1] && this !== null) {
            // if the selected shape is 'circle'
            // ORDER: center, top, right, left, bottom
            this.appendChild(refobj[childElementArray[0]]);
            this.appendChild(refobj[childElementArray[1]]);
            this.appendChild(refobj[childElementArray[3]]); // first, right element
            this.appendChild(refobj[childElementArray[2]]); // then, the left element
            this.appendChild(refobj[childElementArray[4]]);
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
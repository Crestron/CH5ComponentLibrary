import _ from "lodash";
import { Ch5ButtonPressInfo } from "../ch5-button/ch5-button-pressinfo";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";
import { normalizeEvent } from "../ch5-triggerview/utils";
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
        commonBtnClass: 'ch5-dpad-child',
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
    private isTouch: boolean = false;
    private allowPress: boolean = true;
    private allowPressTimeout: number = 0;
    // The interval id ( from setInterval ) for reenforcing the  onTouch signal
    // This id allow canceling the interval.
    private _intervalIdForRepeatDigital: number | null = null;
    // this is last tap time used to determine if should send click pulse in focus event 
    private _lastTapTime: number = 0;
    private _pressable: Ch5Pressable | null = null;
    private _hammerManager: HammerManager = {} as HammerManager;
    // Time after that press will be triggered
    private _pressTimeout: number = 0;
    // State of the button ( pressed or not )
    private _pressed: boolean = false;
    private _buttonPressed: boolean = false;
    private _buttonPressedInPressable: boolean = false;

    private readonly TOUCH_TIMEOUT: number = 250;
    private readonly DEBOUNCE_PRESS_TIME: number = 200;
    private readonly PRESS_MOVE_THRESHOLD: number = 10;
    private readonly STATE_CHANGE_TIMEOUTS: number = 500;

    private _pressHorizontalStartingPoint: number | null = null;
    private _pressVerticalStartingPoint: number | null = null;

    /**
     * Information about start and end position
     * Including the threshold of px for valid presses
     */
    private _pressInfo: Ch5ButtonPressInfo = {} as Ch5ButtonPressInfo;

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

        const prevValue = this._iconClass;
        this._iconClass = trValue;
        this.setAttribute('iconClass', trValue);
        if (this._iconUrl.length < 1) {
            if (this._iconClass.length > 0) {
                this._icon.classList.remove(this.CSS_CLASS_LIST.primaryIconClass);
                this._icon.classList.remove(this.CSS_CLASS_LIST.defaultIconClass);
                this._icon.classList.add(...(this._iconClass.split(' ')));
            } else {
                this._icon.classList.remove(...(prevValue.split(' ')));
                this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
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

        if (value === this.sendEventOnClick) {
            return;
        }

        this._sendEventOnClick = value;
        this.setAttribute('sendEventOnClick'.toLowerCase(), value);
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
        this.bindEventListenersToThis();

        this.logger.stop();
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

        this.crId = this.getCrId();
        this.setAttribute('data-ch5-id', this.crId);

        if (this.parentElement &&
            this.parentElement.parentElement &&
            !(this.parentElement.parentElement instanceof Ch5Dpad)) {
            throw new Error(`Invalid parent element for ch5-dpad-button-center. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too. Reference id: ${this.crId}`);
        }

        // will have the flags ready for contract level content to be ready
        this.createElementsAndInitialize();

        customElements.whenDefined('ch5-dpad-button-center').then(() => {
            this.initCommonMutationObserver(this);
            this.logger.stop();
        });
    }

    /**
     * Function to create HTML elements of the components including child elements
     */
    private createElementsAndInitialize() {
        if (!this._wasInstatiated) {
            CH5DpadUtils.createIconTag(this);

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
        this.classList.add(this.CSS_CLASS_LIST.commonBtnClass);
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
        this.removeEventListeners();
        // this.unsubscribeFromSignals();

        // disconnect common mutation observer
        // this.disconnectCommonMutationObserver();
    }

    public removeEventListeners() {
        this.removeEventListener('mousedown', this._onPressClick);
        this.removeEventListener('mouseup', this._onMouseUp);
        this.removeEventListener('mousemove', this._onMouseMove);
        this.removeEventListener('touchstart', this._onPress);
        this.removeEventListener('mouseleave', this._onLeave);
        this.removeEventListener('touchend', this._onPressUp);
        this.removeEventListener('touchmove', this._onTouchMove);
        this.removeEventListener('touchend', this._onTouchEnd);
        this.removeEventListener('touchcancel', this._onTouchCancel);
        this.removeEventListener('focus', this._onFocus);
        this.removeEventListener('blur', this._onBlur);
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
                CH5DpadUtils.createIconTag(this);
                this.label = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'iconclass':
                CH5DpadUtils.createIconTag(this);
                this.iconClass = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'iconurl':
                CH5DpadUtils.createIconTag(this);
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

        if (this.parentElement &&
            this.parentElement.parentElement) {
            const ele = this.parentElement.parentElement;
            const parentContractName: string = CH5DpadUtils.getAttributeAsString(ele, 'contractname', '');
            const parentContractEvent: string = CH5DpadUtils.getAttributeAsString(ele, 'sendeventonclickstart', '');
            if (parentContractName.length > 0) {
                const joinValue = parentContractName + CH5DpadContractUtils.contractSuffix.center;
                this.sendEventOnClick = joinValue.toString();
            } else if (parentContractEvent.length > 0) {
                const joinValue = parseInt(parentContractEvent, 10) +
                    CH5DpadContractUtils.sendEventOnClickSigCountToAdd.center;
                this.sendEventOnClick = joinValue.toString();
            } else {
                this.sendEventOnClick = "";
            }
        }

        this.logger.stop();
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();

        if (this._pressable !== null && this._pressable.ch5Component.gestureable === false) {
            this._hammerManager.on('tap', this._onTap);
        }

        this.addEventListener('mousedown', this._onPressClick);
        this.addEventListener('mouseup', this._onMouseUp);
        this.addEventListener('mousemove', this._onMouseMove);
        this.addEventListener('touchstart', this._onPress, { passive: true });
        this.addEventListener('mouseleave', this._onLeave);
        this.addEventListener('touchend', this._onPressUp);
        this.addEventListener('touchmove', this._onTouchMove, { passive: true });
        this.addEventListener('touchend', this._onTouchEnd);
        this.addEventListener('touchcancel', this._onTouchCancel);
        this.addEventListener('focus', this._onFocus);
        this.addEventListener('blur', this._onBlur);
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();
    }

    //#endregion

    //#region 4. Other Methods
    private bindEventListenersToThis(): void {
        this._onTap = this._onTap.bind(this);
        this._onPressClick = this._onPressClick.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onPress = this._onPress.bind(this);
        this._onLeave = this._onLeave.bind(this);
        this._onPressUp = this._onPressUp.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchCancel = this._onTouchCancel.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }

    private sendValueForRepeatDigital(value: boolean): void {
        if (!this._sendEventOnClick) { return; }

        const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this._sendEventOnClick);

        if (clickSignal && clickSignal.name) {
            clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
        }
    }

    /**
     * Sends the signal passed via sendEventOnClick or sendEventOnTouch
     */
    private _sendOnClickSignal(preventTrue: boolean = false, preventFalse: boolean = false): void {
        let sigClick: Ch5Signal<boolean> | null = null;
        if (this._sendEventOnClick) {
            sigClick = Ch5SignalFactory.getInstance().getBooleanSignal(this._sendEventOnClick);

            if (sigClick !== null) {
                if (!preventTrue) {
                    this.sendValueForRepeatDigital(true);
                }
                if (!preventFalse) {
                    this.sendValueForRepeatDigital(false);
                }
            }
        }
    }

    private stopRepeatDigital() {
        this.logger.log("stopRepeatDigital", this._intervalIdForRepeatDigital);
        if (this._intervalIdForRepeatDigital) {
            window.clearInterval(this._intervalIdForRepeatDigital);
            this.sendValueForRepeatDigital(false);
            this._intervalIdForRepeatDigital = null;
            return;
        }
        this.sendValueForRepeatDigital(true);

        this._intervalIdForRepeatDigital = window.setInterval(() => {
            this.sendValueForRepeatDigital(true);
        }, this.TOUCH_TIMEOUT);
    }

    /**
     * Press Handler
     *
     * @return {Promise}
     */
    private pressHandler(): Promise<boolean> {
        const pressHandler = () => {
            this.logger.log("Ch5Button._onPress()");
            this._pressed = true;
        }

        const pressPromise = new Promise<boolean>((resolve, reject) => {
            this._pressTimeout = window.setTimeout(() => {
                pressHandler();
                resolve(this._pressed);
            }, this.TOUCH_TIMEOUT);
        });

        return pressPromise;
    }

    private cancelPress() {
        window.clearTimeout(this._pressTimeout);
        this._pressed = false;
    }

    private reactivatePress(): void {
        clearTimeout(this.allowPressTimeout);
        this.allowPressTimeout = setTimeout(() => {
            this.allowPress = true;
        }, this.DEBOUNCE_PRESS_TIME) as never as number;
    }

    private isExceedingPressMoveThreshold(x1: number, y1: number, x2: number, y2: number) {
        const startingPoint: number = x2 - x1;
        const endingPoint: number = y2 - y1;
        const distance: number = Math.sqrt(startingPoint ** 2 + endingPoint ** 2);
        return distance > this.PRESS_MOVE_THRESHOLD;
    }

    //#endregion


    //#region 5. Events - event binding

    private _onTap(): void {
        this.logger.log('_onTap()');
        this._onTapAction();
    }

    private _onTapAction() {
        if (null !== this._intervalIdForRepeatDigital) {
            window.clearInterval(this._intervalIdForRepeatDigital);
            this.sendValueForRepeatDigital(false);
            this._intervalIdForRepeatDigital = null;
        } else {
            this._sendOnClickSignal(false, false);
        }
    }

    private async _onPressClick(event: MouseEvent) {
        this.info(this.COMPONENT_NAME, "- _onPressClick - ", this.crId);
        if (this.isTouch) {
            return;
        }

        clearTimeout(this.allowPressTimeout);
        await this.pressHandler();

        this._pressHorizontalStartingPoint = event.clientX;
        this._pressVerticalStartingPoint = event.clientY;

        this._lastTapTime = new Date().valueOf();

        if (!this.allowPress) {
            return;
        }

        this.allowPress = false;
        this.stopRepeatDigital();
    }

    private _onMouseUp() {
        this.info("_onMouseUp - ", this.crId);
        if (this.isTouch) {
            ((btnObj) => {
                setTimeout(() => {
                    if (btnObj._intervalIdForRepeatDigital != null) {
                        clearTimeout(btnObj._intervalIdForRepeatDigital);
                        btnObj._intervalIdForRepeatDigital = null;
                    }
                    btnObj.sendValueForRepeatDigital(false);
                }, 200);
            })(this);
            return;
        }

        this.cancelPress();
        this.reactivatePress();

        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        } else if (this._pressed) {
            // this._onTapAction();
        }

        const timeSinceLastPress = new Date().valueOf() - this._lastTapTime;
        if (this._lastTapTime && timeSinceLastPress < this.DEBOUNCE_PRESS_TIME) {
            // sometimes a both click and press can happen on iOS/iPadOS, don't publish both
            this.logger.log('Ch5Button debouncing duplicate press/hold and click ' + timeSinceLastPress);
        }
    }

    private _onMouseMove(event: MouseEvent) {
        this.info("_onMouseMove - ", this.crId);
        if (!this.isTouch
            && this._intervalIdForRepeatDigital
            && this._pressHorizontalStartingPoint
            && this._pressVerticalStartingPoint
            && this.isExceedingPressMoveThreshold(
                this._pressHorizontalStartingPoint,
                this._pressVerticalStartingPoint,
                event.clientX,
                event.clientY)
        ) {
            this.stopRepeatDigital();
        }
    }

    private async _onPress(event: TouchEvent) {
        this.info("_onPress - ", this.crId);
        const normalizedEvent = normalizeEvent(event);
        this.isTouch = true;
        clearTimeout(this.allowPressTimeout);
        this._pressInfo.saveStart(
            normalizedEvent.x,
            normalizedEvent.y
        );
        await this.pressHandler();
        if (!this.allowPress) {
            return;
        }
        this.allowPress = false;
        this.stopRepeatDigital();
    }

    private _onLeave() {
        this.info("_onPressUp - ", this.crId);
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    private _onPressUp(): void {
        this.info("_onPressUp - ", this.crId);
        window.clearTimeout(this._pressTimeout);
        this.reactivatePress();
        if (this._pressed) {
            this.logger.log("Ch5Button._onPressUp()");

            this._pressed = false;

            if (this._intervalIdForRepeatDigital) {
                window.clearInterval(this._intervalIdForRepeatDigital);
                this.sendValueForRepeatDigital(false);
                this._intervalIdForRepeatDigital = null;
            }
        }
    }

    private _onTouchMove(event: TouchEvent) {
        this.info("_onTouchMove - ", this.crId);
        // The event must be cancelable
        if (event.cancelable) {
            event.preventDefault();
        }
        const normalizedEvent = normalizeEvent(event);

        this._pressInfo.saveEnd(
            normalizedEvent.x,
            normalizedEvent.y
        );

        const validPress = this._pressInfo.valid();

        if (!validPress) {
            window.clearTimeout(this._pressTimeout);
            if (this._intervalIdForRepeatDigital !== null) {
                this.stopRepeatDigital();
            }
            return;
        }
    }

    private _onTouchEnd(inEvent: Event): void {
        this.info("_onTouchEnd - ", this.crId);
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    private _onTouchCancel(inEvent: Event): void {
        this.info("_onTouchCancel - ", this.crId);
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    private _onFocus(inEvent: Event): void {
        this.info("_onFocus - ", this.crId);
        let clonedEvent: Event;
        clonedEvent = new Event(inEvent.type, inEvent);
        this.dispatchEvent(clonedEvent);

        inEvent.preventDefault();
        inEvent.stopPropagation();
    }

    private _onBlur(inEvent: Event): void {
        this.info("_onBlur - ", this.crId);
        let clonedEvent: Event;

        this.reactivatePress();

        clonedEvent = new Event(inEvent.type, inEvent);
        this.dispatchEvent(clonedEvent);

        inEvent.preventDefault();
        inEvent.stopPropagation();
    }

    //#endregion


}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-dpad-button-center', Ch5DpadCenter);
}
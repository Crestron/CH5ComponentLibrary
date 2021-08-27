// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Subscription } from "rxjs";
import { Ch5ButtonPressInfo } from "../ch5-button/ch5-button-pressinfo";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";
import { normalizeEvent } from "../ch5-triggerview/utils";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Dpad } from "./ch5-dpad";
import { CH5DpadContractUtils } from "./ch5-dpad-contract-utils";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadChildBaseAttributes } from "./interfaces/i-ch5-dpad-child-base-attributes";
import { TCh5DpadButtonClassListType, TCh5DpadChildBtnType, TCh5DpadConstructorParam } from "./interfaces/t-ch5-dpad";

export class Ch5DpadChildBase extends Ch5Common implements ICh5DpadChildBaseAttributes {

    //#region 1. Variables

    //#region 1.1 readonly variables
    public primaryCssClass = '';
    public cssClassPrefix = '';
    public readonly pressedCssClassPostfix = '-pressed';

    //#endregion

    //#region 1.2 protected / protected variables
    protected COMPONENT_NAME: string = "";
    protected componentPrefix: string = 'ch5-dpad-button-';
    protected readonly CSS_CLASS_LIST: TCh5DpadButtonClassListType = {
        commonBtnClass: 'ch5-dpad-child',
        primaryIconClass: 'fas',
        imageClassName: 'image-url',
        primaryTagClass: '',
        defaultIconClass: '',
        defaultArrowClass: ''
    };

    // protected setter getter specific vars
    // protected _disabled: boolean = true; // not required as its in common.ts
    // protected _show: boolean = true; // not required as its in common.ts
    protected _iconClass: string = '';
    protected _iconUrl: string = '';
    protected _sendEventOnClick: string = '';

    // signal based vars for each receive state

    // parent specific contract based signals for each receive state

    // elements specific vars
    protected _icon: HTMLElement = {} as HTMLElement;

    // state specific vars
    protected buttonType: TCh5DpadChildBtnType | null = null;
    protected isTouch: boolean = false;
    protected allowPress: boolean = true;
    protected allowPressTimeout: number = 0;
    // The interval id ( from setInterval ) for reenforcing the  onTouch signal
    // This id allow canceling the interval.
    protected _intervalIdForRepeatDigital: number | null = null;
    // this is last tap time used to determine if should send click pulse in focus event 
    protected _lastTapTime: number = 0;
    protected _pressable: Ch5Pressable | null = null;
    protected _hammerManager: HammerManager = {} as HammerManager;
    // Time after that press will be triggered
    protected _pressTimeout: number = 0;
    // State of the button ( pressed or not )
    protected _pressed: boolean = false;
    protected _buttonPressed: boolean = false;
    protected _buttonPressedInPressable: boolean = false;
    protected _pressableIsPressedSubscription: Subscription | null = null;
    // This variable ensures that the first time load on a project happens without debounce and buttons do not appear blank.
    protected isButtonInitated: boolean = false;

    protected readonly TOUCH_TIMEOUT: number = 250;
    protected readonly DEBOUNCE_PRESS_TIME: number = 200;
    protected readonly PRESS_MOVE_THRESHOLD: number = 10;
    protected readonly STATE_CHANGE_TIMEOUTS: number = 500;

    protected readonly MAX_MODE_LENGTH: number = 99;
    protected readonly DEBOUNCE_BUTTON_DISPLAY: number = 25;

    protected _pressHorizontalStartingPoint: number | null = null;
    protected _pressVerticalStartingPoint: number | null = null;

    /**
     * Information about start and end position
     * Including the threshold of px for valid presses
     */
    protected _pressInfo: Ch5ButtonPressInfo = {} as Ch5ButtonPressInfo;

    //#endregion

    //#endregion

    //#region 2. Setters and Getters

    /**
     * iconClass specif getter-setter
     */
    public set iconClass(value: string) {
        this.logger.start('set iconClass("' + value + '")');

        if (_.isNil(value)) {
            value = this.CSS_CLASS_LIST.defaultIconClass;
        }

        if (value === this.iconClass) {
            return;
        }

        const prevValue = this._iconClass;
        this._iconClass = value;
        this.setAttribute('iconClass', value);
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
        this.logger.start('set iconUrl("' + value + '")');

        if (_.isNil(value)) {
            value = '';
        }

        if (value === this.iconUrl) {
            return;
        }

        this._iconUrl = value;
        this.setAttribute('iconUrl', value);
        if (this.iconUrl.length > 0) {
            this._icon.classList.add(this.CSS_CLASS_LIST.imageClassName);
            this._icon.style.backgroundImage = `url(${value})`;
        } else {
            this._icon.classList.remove(this.CSS_CLASS_LIST.imageClassName);
        }
    }
    public get iconUrl() {
        return this._iconUrl;
    }

    /**
     * sendEventOnClick specif getter-setter
     */
    public set sendEventOnClick(value: string) {
        this.logger.start('set sendEventOnClick("' + value + '")');
        if ((value !== '') && (value !== this._sendEventOnClick)) {
            this._sendEventOnClick = value;
            this.setAttribute('sendEventOnClick'.toLowerCase(), value);
        }
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

    public constructor(params: TCh5DpadConstructorParam) {
        super();
        this.logger.start('constructor()', this.COMPONENT_NAME);
        this.initializeParams(params);

        CH5DpadUtils.clearComponentContent(this);

        // events binding
        this.bindEventListenersToThis();
        this.updatePressedClass(this.primaryCssClass + this.pressedCssClassPostfix);

        this.logger.stop();
    }

    protected initializeParams(params: TCh5DpadConstructorParam) {
        this.buttonType = params.btnType;
        this.COMPONENT_NAME = this.componentPrefix + params.btnType;
        this.CSS_CLASS_LIST.primaryTagClass = params.btnType;
        this.CSS_CLASS_LIST.defaultIconClass = params.defaultIconClass;
        this.CSS_CLASS_LIST.defaultArrowClass = params.defaultArrowClass;
        this.primaryCssClass = this.componentPrefix + params.btnType;
        this.cssClassPrefix = this.componentPrefix + params.btnType;
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

        if (!this.parentElement ||
            (this.parentElement && this.parentElement instanceof Ch5Dpad)) {
            // user created DOM structure brings the code here
            // can be ignored on this run, since its restructured under dpad
            // and will be rendered correctly skipping this step
            return;
        }

        if (this.parentElement &&
            this.parentElement.parentElement &&
            !(this.parentElement.parentElement instanceof Ch5Dpad)) {
            throw new Error(`Invalid parent element for ch5-dpad-button-${this.buttonType}. 
            Please ensure the parent tag is ch5-dpad, and other mandatory sibling 
            elements are available too.`);
        }

        this.setAttribute('data-ch5-id', this.getCrId());

        // init pressable before initAttributes because pressable subscribe to gestureable attribute
        if (!_.isNil(this._pressable)) {
            this._pressable.init();
            this._subscribeToPressableIsPressed();
        }

        this._hammerManager = new Hammer(this);

        // will have the flags ready for contract level content to be ready
        this.createElementsAndInitialize();

        customElements.whenDefined(`ch5-dpad-button-${this.buttonType}`).then(() => {
            this.initCommonMutationObserver(this);
            this.logger.stop();
        });
    }

    /**
     * Function to create HTML elements of the components including child elements
     */
    protected createElementsAndInitialize() {
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
     * Function to create all inner html elements required to complete dpad child-base button
     */
    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        this.classList.add(this.primaryCssClass);
        this.classList.add(this.CSS_CLASS_LIST.commonBtnClass);
        this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
        this.classList.add(this.CSS_CLASS_LIST.defaultArrowClass);

        // Order of preference is:
        // 0 parentContract
        // 4 iconUrl
        // 5 iconClass
        if (this.iconUrl.length > 0) {
            this._icon = CH5DpadUtils.getImageContainer(this.iconUrl);
            this._icon.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(...(this.iconClass.split(' ')));
        } else {
            // if nothing works, then render as default
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
            this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
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

        // destroy pressable
        if (null !== this._pressable) {
            this._pressable.destroy();
        }
        // this.unsubscribeFromSignals();

        // disconnect common mutation observer
        // this.disconnectCommonMutationObserver();
    }

    public removeEventListeners() {
        if (!!this._hammerManager && !!this._hammerManager.off) {
            this._hammerManager.off('tap', this._onTap);
        }
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

        this.info('ch5-dpad-button' + this.buttonType +
            ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
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
        this.iconClass = CH5DpadUtils.setAttributeToElement(this, 'iconClass', this._iconClass);
        this.iconUrl = CH5DpadUtils.setAttributeToElement(this, 'iconUrl', this._iconUrl);
        const btnType = this.buttonType as TCh5DpadChildBtnType;
        if (this.parentElement &&
            this.parentElement.parentElement) {
            const ele = this.parentElement.parentElement;
            const parentContractName: string = CH5DpadUtils.getAttributeAsString(ele, 'contractname', '');
            const parentContractEvent: string = CH5DpadUtils.getAttributeAsString(ele, 'sendeventonclickstart', '');
            if (parentContractName.length > 0) {
                const joinValue = parentContractName + '.' + CH5DpadContractUtils.contractSuffix[btnType];
                this.sendEventOnClick = joinValue.toString();
            } else if (parentContractEvent.length > 0) {
                const joinValue = parseInt(parentContractEvent, 10) +
                    CH5DpadContractUtils.sendEventOnClickSigCountToAdd[btnType];
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

    /**
     * Called when pressed class will be available
     * @param pressedClass is class name. it will add after press the ch5 button
     */
    protected updatePressedClass(pressedClass: string) {
        this._pressable = new Ch5Pressable(this, {
            cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
            cssPressedClass: pressedClass
        });
    }
    protected bindEventListenersToThis(): void {
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

    protected sendValueForRepeatDigital(value: boolean): void {
        if (!this._sendEventOnClick) { return; }

        const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this._sendEventOnClick);

        if (clickSignal && clickSignal.name) {
            clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
        }
    }

    /**
     * Sends the signal passed via sendEventOnClick or sendEventOnTouch
     */
    protected _sendOnClickSignal(preventTrue: boolean = false, preventFalse: boolean = false): void {
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

    protected stopRepeatDigital() {
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
    protected pressHandler(): Promise<boolean> {
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

    protected cancelPress() {
        window.clearTimeout(this._pressTimeout);
        this._pressed = false;
    }

    protected reactivatePress(): void {
        clearTimeout(this.allowPressTimeout);
        this.allowPressTimeout = setTimeout(() => {
            this.allowPress = true;
        }, this.DEBOUNCE_PRESS_TIME) as never as number;
    }

    protected isExceedingPressMoveThreshold(x1: number, y1: number, x2: number, y2: number) {
        const startingPoint: number = x2 - x1;
        const endingPoint: number = y2 - y1;
        const distance: number = Math.sqrt(startingPoint ** 2 + endingPoint ** 2);
        return distance > this.PRESS_MOVE_THRESHOLD;
    }

    protected _subscribeToPressableIsPressed() {
        if (this._pressableIsPressedSubscription === null && this._pressable !== null) {
            this._pressableIsPressedSubscription = this._pressable.observablePressed.subscribe((value: boolean) => {
                if (value !== this._buttonPressedInPressable) {
                    this._buttonPressedInPressable = value;
                    if (value === false) {
                        setTimeout(() => {
                            this.setButtonDisplay();
                        }, this.STATE_CHANGE_TIMEOUTS);
                    } else {
                        this.setButtonDisplay();
                    }
                }
            });
        }
    }

    protected _unsubscribeFromPressableIsPressed() {
        if (this._pressableIsPressedSubscription !== null) {
            this._pressableIsPressedSubscription.unsubscribe();
            this._pressableIsPressedSubscription = null;
        }
    }
    
    /**
     * If type node is updated via html or js or signal, the change set attribue of type;
     * if receivestate is true, then even if type attribute chagnes, just use receivestatevalue
     * if receivestate is false, then
     * if mode attribute is updated, always call this method, and update all attributes 
     * @param fromNode 
     * @param isModeAttributeUpdated 
     * @param attibuteName 
     */
    public setButtonDisplay() {
        this.setButtonDisplayDetails();
    }

    protected setButtonDisplayDetails() {
        this.logger.start("setButtonDisplayDetails");
        this.logger.stop();
    }

    //#endregion


    //#region 5. Events - event binding

    protected _onTap(): void {
        this.logger.start(this.COMPONENT_NAME, "- _onTap");
        this._onTapAction();
        this.logger.stop();
    }

    protected _onTapAction() {
        this.logger.start(this.COMPONENT_NAME, "- _onTapAction");
        if (null !== this._intervalIdForRepeatDigital) {
            window.clearInterval(this._intervalIdForRepeatDigital);
            this.sendValueForRepeatDigital(false);
            this._intervalIdForRepeatDigital = null;
        } else {
            this._sendOnClickSignal(false, false);
        }
        this.logger.stop();
    }

    protected async _onPressClick(event: MouseEvent) {
        this.logger.start(this.COMPONENT_NAME, "- _onPressClick");
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
        this.logger.stop();
    }

    protected _onMouseUp() {
        this.logger.start("_onMouseUp");
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
        this.logger.stop();
    }

    protected _onMouseMove(event: MouseEvent) {
        // this.logger.start("_onMouseMove");
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
        // this.logger.stop();
    }

    protected async _onPress(event: TouchEvent) {
        this.logger.start("_onPress");
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

    protected _onLeave() {
        this.logger.start("_onPressUp");
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    protected _onPressUp(): void {
        this.logger.start("_onPressUp");
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

    protected _onTouchMove(event: TouchEvent) {
        this.logger.start("_onTouchMove");
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

    protected _onTouchEnd(inEvent: Event): void {
        this.logger.start("_onTouchEnd");
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    protected _onTouchCancel(inEvent: Event): void {
        this.logger.start("_onTouchCancel");
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    protected _onFocus(inEvent: Event): void {
        this.logger.start("_onFocus");
        let clonedEvent: Event;
        clonedEvent = new Event(inEvent.type, inEvent);
        this.dispatchEvent(clonedEvent);

        inEvent.preventDefault();
        inEvent.stopPropagation();
    }

    protected _onBlur(inEvent: Event): void {
        this.logger.start("_onBlur");
        let clonedEvent: Event;

        this.reactivatePress();

        clonedEvent = new Event(inEvent.type, inEvent);
        this.dispatchEvent(clonedEvent);

        inEvent.preventDefault();
        inEvent.stopPropagation();
    }

    //#endregion
}

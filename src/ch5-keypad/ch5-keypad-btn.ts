// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Subscription } from "rxjs";
import { Ch5ButtonPressInfo } from "../ch5-button/ch5-button-pressinfo";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core";
import { normalizeEvent } from "../ch5-triggerview/utils";
import { Ch5Keypad } from "./ch5-keypad";
import { ICh5KeypadBtnAttributes } from "./interfaces/i-ch5-keypad-btn-interfaces";
import { TCh5KeypadBtnCreateDTO } from "./interfaces/t-ch5-keypad";

export class Ch5KeypadBtn extends Ch5Common implements ICh5KeypadBtnAttributes {
    //#region 1. Variables

    //#region 1.1 readonly variables

    public readonly primaryCssClass = 'keypad-btn';
    public readonly cssClassPrefix = 'keypad-btn-';

    //#endregion

    //#region 1.2 private / protected variables

    // private setter getter specific vars
    private COMPONENT_NAME: string = "ch5-keypad";
    private params: TCh5KeypadBtnCreateDTO = {} as TCh5KeypadBtnCreateDTO;
    protected componentPrefix: string = 'ch5-keypad-button-';
    private labelMajorCssClass: string = 'label-major';
    private labelMinorCssClass: string = 'label-minor';

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
    //#endregion

    //#region 3. Lifecycle Hooks

    public constructor(params: TCh5KeypadBtnCreateDTO) {
        super();
        this.logger.start('constructor()', this.COMPONENT_NAME);
        this.params = params;

        ComponentHelper.clearComponentContent(this);

        this.logger.stop();
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.logger.start('connectedCallback() - start', this.COMPONENT_NAME);

        this.setAttribute('data-ch5-id', this.getCrId());

        // init pressable before initAttributes because pressable subscribe to gestureable attribute
        if (!ComponentHelper.isNullOrUndefined(this._pressable) && !!this._pressable) {
            this._pressable.init();
            this._subscribeToPressableIsPressed();
        }

        this._hammerManager = new Hammer(this);

        // will have the flags ready for contract level content to be ready
        this.createElementsAndInitialize();

        customElements.whenDefined(`ch5-keypad-button-${this.params.name}`).then(() => {
            this.initCommonMutationObserver(this);
            this.logger.stop();
        });
    }

    /**
     * Function to create HTML elements of the components including child elements
     */
    protected createElementsAndInitialize() {
        if (!this._wasInstatiated) {
            this.initAttributes();
            this.createHtmlElements();
            this.attachEventListeners();
            this.updateCssClasses();
        }
        this._wasInstatiated = true;
    }

    /**
     * Function to create all inner html elements required to complete keypad child-base button
     */
    protected createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);
        ComponentHelper.clearComponentContent(this);
        this.classList.add(this.primaryCssClass);
        this.classList.add(...(this.params.className.split(' ')));
        const btn = document.createElement('button');
        btn.appendChild(this.createLabelElementAndAppend(this.labelMajorCssClass, this.params.major));
        btn.appendChild(this.createLabelElementAndAppend(this.labelMinorCssClass, this.params.minor));
        this.appendChild(btn);
        this.logger.stop();
    }

    //#endregion

    //#region 4. Other Methods

    protected createLabelElementAndAppend(className: string, value: string = '') {
        const labelEle = document.createElement('span');
        labelEle.classList.add(className);
        labelEle.innerHTML = value;
        return labelEle;
    }

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

        const clickSignal: Ch5Signal<object | boolean> | null =
            Ch5SignalFactory.getInstance().getObjectAsBooleanSignal(this._sendEventOnClick);

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

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-keypad-btn', Ch5KeypadBtn);
}
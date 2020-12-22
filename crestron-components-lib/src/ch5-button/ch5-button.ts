// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalBridge, Ch5SignalFactory } from "../ch5-core/index";
import isNil from 'lodash/isNil';

import {
    TCh5ButtonIconPosition,
    TCh5ButtonOrientation,
    TCh5ButtonShape,
    TCh5ButtonSize,
    TCh5ButtonStretch,
    TCh5ButtonType,
    TCh5ButtonActionType
} from '../_interfaces/ch5-button/types';

import { ICh5ButtonAttributes } from "../_interfaces/ch5-button/i-ch5-button-attributes";
import { Ch5Pressable } from "../ch5-common/ch5-pressable";
import Hammer from 'hammerjs';
import { isTouchDevice } from "../ch5-core/utility-functions/is-touch-device";
import { Ch5ButtonPressInfo } from "./ch5-button-pressinfo";
import { normalizeEvent } from "../ch5-triggerview/utils";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { isSafariMobile } from "../ch5-core/utility-functions/is-safari-mobile";

/**
 * Html Attributes
 *
 * - label
 * - iconClass, iconclass
 * - iconPosition, iconposition
 * - orientation
 * - shape
 * - size
 * - stretch
 * - type
 * - selected
 * - disabled
 * - customClassSelected, customclassselected
 * - customClassPressed, customclasspressed
 * - customClassDisabled, customclassdisabled
 * - id
 * - receiveStateSelected, receivestateselected
 * - receiveStateLabel, receivestatelabel,
 * - receiveStateScriptLabelHtml, receivestatescriptlabelhtml
 * - receiveStateIconClass, receivestateiconclass
 * - receiveStateIconUrl, receivestateiconurl
 * - sendEventOnTouch, sendeventontouch
 * - sendEventOnClick, sendeventonclick
 * - iconUrl, iconurl
 *
 *
 * CSS Classes applied for ch5-button
 *
 * | Name                              | Description                                                          |
 * |:--------------------------------- |:-------------------------------------------------------------------- |
 * | ch5-button                       | primary class
 * | ch5-button--label                | applied on button label
 * | ch5-button--icon                 | applied on button icon
 * | ch5-button--rectangle            | applied when shape is "rectangle"
 * | ch5-button--rounded-rectangle    | applied when shape is "rounded-rectangle"
 * | ch5-button--circle               | applied when shape is "circle"
 * | ch5-button--tab                  | applied when shape is "tab"
 * | ch5-button--oval                 | applied when shape is "oval"
 * | ch5-button--info,                | applied when type is "info"
 * | ch5-button--warning,             | applied when type is "warning"
 * | ch5-button--danger,              | applied when type is "danger"
 * | ch5-button--text,                | applied when type is "text"
 * | ch5-button--success,             | applied when type is "success"
 * | ch5-button--primary,             | applied when type is "primary"
 * | ch5-button--secondary,           | applied when type is "secondary"
 * | ch5-button--default,             | applied when type is "default"
 * | ch5-button--disabled             | applied when button is disabled
 * | ch5-button_selected              | applied when button is selected (when true was received on the receiveStateSelected signal
 * | ch5-button_pressed               | applied while the button is pressed
 */
export class Ch5Button extends Ch5Common implements ICh5ButtonAttributes {

    /**
     * The first value is considered the default one
     */
    public static TYPES: TCh5ButtonType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];
    /**
     * The first value is considered the default one
     */
    public static SHAPES: TCh5ButtonShape[] = ['rounded-rectangle', 'rectangle', 'tab', 'circle', 'oval'];
    /**
     * The first value is considered the default one
     */
    public static SIZES: TCh5ButtonSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];
    /**
     * The first value is considered the default one
     */
    public static STRETCHES: TCh5ButtonStretch[] = ['', 'both', 'width', 'height'];
    /**
     * The first value is considered the default one
     */
    public static ICON_POSITIONS: TCh5ButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];
    /**
     * The first value is considered the default one
     */
    public static ORIENTATIONS: TCh5ButtonOrientation[] = ['horizontal', 'vertical'];

    /**
     * Time needed for the sendOnTouch to trigger/reinforce
     */
    public static TOUCHTIMEOUT: number = 250;

    public static PRESS_MOVE_THRESHOLD = 10;

    public static CONTAINERCLASSNAME: string = 'cb-cntr';

    public static SVG: string = 'svg';

    private static DEBOUNCE_PRESS_TIME: number = 200;


    public primaryCssClass = 'ch5-button';
    public cssClassPrefix = 'ch5-button';
    public pressedCssClassPostfix = '--pressed';
    public selectedCssClassPostfix = '--selected';
    public iosCssClassPostfix = '--ios-vertical';


    private _elContainer: HTMLElement = {} as HTMLElement;
    private _elButton: HTMLElement = {} as HTMLElement;
    private _elLabel: HTMLElement = {} as HTMLElement;
    private _elIcon: HTMLElement = {} as HTMLElement;
    private _elImg: HTMLImageElement = {} as HTMLImageElement;
    private _elIosDots: HTMLElement = {} as HTMLElement;
    private _pressHorizontalStartingPoint: number | null = null;
    private _pressVerticalStartingPoint: number | null = null;

    private isLabelLoaded: boolean = false;

    /**
     * Time after that press will be triggered
     *
     * @type {number}
     * @private
     */
    private _pressTimeout: number = 0;

    /**
     * Information about start and end position
     * Including the threshold of px for valid presses
     *
     * @type {Ch5ButtonPressInfo}
     */
    private _pressInfo: Ch5ButtonPressInfo = {} as Ch5ButtonPressInfo;

    /**
     * State of the button ( pressed or not )
     *
     * @type {boolean}
     */
    private _pressed: boolean = false;

    /**
     * Contains the ch5-button's label.
     *
     * HTML attribute name: label
     */
    private _label: string = '';

    /**
     * The icon's CSS class name as defined in the iconClass HTML attribute
     *
     * HTML attribute name: iconClass or iconclass
     */
    private _iconClass: string = '';

    /**
     * Icon position relative to label
     *
     * HTML attribute name: iconPosition or iconposition
     */
    private _iconPosition: TCh5ButtonIconPosition = 'first';

    /**
     * Lays out the elements of the ch5-button in a horizontal or vertical manner.
     * For vertical alignment it will apply a CSS class that will rotate the component -90 degrees ( 270 deg clockwise,
     * 90 degrees counter clockwise )
     *
     * HTML attribute name: orientation
     */
    private _orientation: TCh5ButtonOrientation = 'horizontal';

    /**
     * Shape of the button
     *
     * HTML attribute name: shape
     */
    private _shape: TCh5ButtonShape = 'rounded-rectangle';

    /**
     * Size of the button
     *
     * HTML attribute name: size
     */
    private _size: TCh5ButtonSize = 'regular';

    /**
     * action type of the button
     *
     * HTML attribute name: actiontype
     */
    private _formType: TCh5ButtonActionType = '';

    /**
     * When stretch property is set, the button element inherits the width or/and height of the container.
     * If stretch by height is used, the button will be responsive based on the label length, until reaches the
     * max-width of the container.
     * If stretch width is applied, there is no responsiveness after reaching the max- width, the text will overflow.
     * Same if stretch both is used. Note that, if button element shape is "circle" or "oval", stretch property will be
     * ignored.
     *
     * HTML attribute name: stretch
     */
    private _stretch: TCh5ButtonStretch = '';

    /**
     * Valid values: default, info, text, danger, warning, success, primary, secondary.
     * Overrides the appearance of the button with alternative css defined in classes defined with ch5-button--type
     * where type is the value of the property. If no "type" is provided, type of 'default' is used.
     *
     * HTML attribute name: type
     */
    private _type: TCh5ButtonType = 'default';

    /**
     * Reflects the selected state of the component. If set to true a CSS class named 'ch5-button--..._selected' will be applied
     * on the button component
     *
     * HTML attribute name: selected
     */
    private _selected: boolean = false;

    /**
     * State class name as defined in customClassSelected, customClassPressed and customClassDisabled HTML attribute
     *
     * HTML attribute name: customclassselected, customclasspressed and customclassdisabled
     */
    private _customClassState: string = '';

    /**
     * The name of a boolean signal. When the signal is true the selected (ch5-button--selected) will be applied
     *
     * HTML attribute name: receiveStateSelected or receivestateselected
     */
    private _sigNameReceiveSelected: string = '';

    /**
     * The subscription id for the receiveStateSelected signal
     */
    private _subReceiveSelected: string = '';

    /**
     * The name of a string signal that will be applied to the label
     *
     * HTML attribute name: receiveStateLabel or receivestatelabel
     */
    private _sigNameReceiveLabel: string = '';

    /**
     * The subscription id for the receiveStateLabel signal
     */
    private _subReceiveLabel: string = '';

    /**
     * The name of the string signal for which the value will be applied to the component's label innerHtml
     *
     * HTML attribute name: receiveStateScriptLabelHtml or receivestatescriptlabelhtml
     */
    private _sigNameReceiveScriptLabelHtml: string = '';

    /**
     * The subscription id for the receiveStateScriptLabelHtml signal
     */
    private _subReceiveScriptLabelHtml: string = '';

    /**
     * The name of the boolean signal that will be sent to native on touch.
     * boolean true while finger is on the glass, digital false when finger is released or “roll out”.
     * The signal will be sent with value true and reasserted true every 200ms while the finger is on the
     * component. The reassertion is needed to avoid unending ramp should there be a communications error, a failure of
     * the button itself or any intermediate proxy of the signal.
     * This signal should not be generated as part of a gesture swipe.
     *
     * HTML attribute name: sendEventOnTouch or sendeventontouch
     */
    private _sigNameSendOnTouch: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnTouch
     */
    private _sigSendOnTouch: Ch5Signal<boolean> | null = null;

    /**
     * The name of the boolean signal that will be sent to native on click or tap event (mouse or finger up and down in
     * a small period of time)
     *
     * HTML attribute name: sendEventOnClick or sendeventonclick
     */
    private _sigNameSendOnClick: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnClick
     */
    private _sigSendOnClick: Ch5Signal<boolean> | null = null;

    /**
     * Changing iconClass through signal
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _receiveStateIconClass: string | null = null;

    /**
     * Changing iconUrl through signal
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _receiveStateIconSvgUrl: string = '';

    /**
     * Subscription reference for svg icon signal
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _subReceiveSignalSvgUrl: string | null = null;

    /**
     * Subscription reference for icon class signal
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _subReceiveSignalIconClass: string | null = null;

    /**
     * Changing the button type through signal
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _sigNameReceiveStateType: string | null = null;

    /**
     * Subscription reference for type signal
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _subReceiveSignalType: string | null = null;

    // private _wasInstatiated:boolean=false;

    /**
     * The interval id ( from setInterval ) for reenforcing the  onTouch signal
     * This id allow canceling the interval.
     */
    private _intervalIdForRepeatDigital: number | null = null;

    /**
     * this is last tap time used to determine if should send click pulse in focus event 
     */
    private _lastTapTime: number = 0;

    /**
     * this is last time press was released  
     */
    private _lastPressTime: number = 0;

    /**
     * Events
     * click - inherited
     * focus - inherited
     * blur - inherited
     * press - custom
     * release - custom
     */

    /**
     * Ch5Pressable manager
     *
     * @private
     * @type {(Ch5Pressable | null)}
     * @memberof Ch5Image
     */
    private _pressable: Ch5Pressable | null = null;

    private _hammerManager: HammerManager = {} as HammerManager;

    /**
     * image URL. Must be a supported image format, including JPEG, GIF, PNG, SVG, and BMP.
     *
     * @type {string}
     * @private
     */
    private _iconSvgUrl: string = '';

    /**
     * CSS class applied while the button is pressed by user.
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _customClassPressed: string | null = null;

    /**
     * CSS class applied while the button is disabled.
     *
     * @private
     * @memberof Ch5Button
     * @type {string | null}
     */
    private _customClassDisabled: string | null = null;

    private allowPress: boolean = true;
    private allowPressTimeout: number = 0;

    private isTouch: boolean = false;

    
    public constructor() {
        super();
        this.info('Ch5Button.constructor()');
        this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();

        if (!this._wasInstatiated) {
            this.createInternalHtml();
        }
        this._wasInstatiated = true;

        this.updatePressedClass(this.cssClassPrefix + this.pressedCssClassPostfix);

        this._pressInfo = new Ch5ButtonPressInfo();

        this._onBlur = this._onBlur.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onPress = this._onPress.bind(this);
        this._onPressUp = this._onPressUp.bind(this);
        this._onTap = this._onTap.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onTouchCancel = this._onTouchCancel.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onPressClick = this._onPressClick.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onLeave = this._onLeave.bind(this);
    }

    /**
     * Called when the ch5-button component is first connected to the DOM
     */
    public connectedCallback() {
        this.info('connectedCallback() start');
        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5Button);
        }

        if (this._elContainer.parentElement !== this) {
            this.appendChild(this._elContainer);
        }

        if (this.customClassState && this.hasAttribute('customclasspressed')) {
            this.updatePressedClass(this.customClassState);
        }

        // init pressable before initAttributes because pressable subscribe to gestureable attribute
        if (!isNil(this._pressable)) {
            this._pressable.init();
        }

        this._hammerManager = new Hammer(this._elContainer);

        this.initAttributes();
        this.updateCssClasses();
        this.updateForChangeInStretch();
        this.attachEventListeners();
        this.initCommonMutationObserver(this);
        if (!this.hasAttribute('customclasspressed')) {
            this.updateCssClassesForCustomState();
        }

        this.info('connectedCallback() end');
    }

    /**
     * Called when pressed class will be available
     * @param pressedClass is class name. it will add after press the ch5 button
     */
    private updatePressedClass(pressedClass: string) {
        this._pressable = new Ch5Pressable(this, {
            cssTargetElement: this.getTargetElementForCssClassesAndStyle(),
            cssPressedClass: pressedClass
        });
    }

    /**
     * Called this method if you have to wrap the element
     * @param el html elemen which you have to wrap
     * @param wrapper wrapper html element
     */
    private wrap(el: any, wrapper: HTMLElement) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    /**
     * Called when the ch5-button component is disconnected from the DOM
     */
    public disconnectedCallback() {
        this.info('called disconectedCallback()');
        this.removeEventListeners();
        this.unsubscribeFromSignals();

        // destroy pressable
        if (null !== this._pressable) {
            this._pressable.destroy();
        }

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    public getListOfAllPossibleComponentCssClasses(): string[] {
        return this._listOfAllPossibleComponentCssClasses;
    }

    private generateListOfAllPossibleComponentCssClasses(): string[] {
        const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;
        cssClasses.push(this.primaryCssClass);

        // shapes
        Ch5Button.SHAPES.forEach((shape: TCh5ButtonShape) => {
            const newClass = this.cssClassPrefix + '--' + shape;
            cssClasses.push(newClass);
        });

        // types
        Ch5Button.TYPES.forEach((type: TCh5ButtonType) => {
            const newCssClass = this.cssClassPrefix + '--' + type;
            cssClasses.push(newCssClass);
        });

        // sizes
        Ch5Button.SIZES.forEach((size: TCh5ButtonSize) => {
            cssClasses.push(this.cssClassPrefix + '--size-' + size);
        });

        // stretches
        Ch5Button.STRETCHES.forEach((stretch: TCh5ButtonStretch) => {
            if ('' !== stretch) {
                cssClasses.push(this.cssClassPrefix + '--stretch-' + stretch);
            }
        });

        // orientation
        Ch5Button.ORIENTATIONS.forEach((orientation: TCh5ButtonOrientation) => {
            cssClasses.push(this.cssClassPrefix + '--' + orientation);
        });

        // selected
        cssClasses.push(this.cssClassPrefix + this.selectedCssClassPostfix);

        return cssClasses;
    }


    public unsubscribeFromSignals() {
        this.info('unsubscribeFromSignals()');
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();
        if ('' !== this._subReceiveLabel && '' !== this._sigNameReceiveLabel) {
            const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveLabel);
            const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(receiveLabelSigName);
            if (null !== sigLabel) {
                sigLabel.unsubscribe(this._subReceiveLabel);
                this._sigNameReceiveLabel = '';
            }
        }

        if ('' !== this._subReceiveSignalType && '' !== this._sigNameReceiveStateType) {
            const receiveTypeSigName: string = Ch5Signal.getSubscriptionSignalName('' + this._sigNameReceiveStateType);
            const sigType: Ch5Signal<string> | null = csf.getStringSignal(receiveTypeSigName);
            if (null !== sigType) {
                sigType.unsubscribe('' + this._subReceiveSignalType);
                this._sigNameReceiveStateType = '';
            }
        }

        if ('' !== this._subReceiveSelected && '' !== this._sigNameReceiveSelected) {
            const receiveSelectedSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveSelected);
            const sigSelected: Ch5Signal<boolean> | null = csf.getBooleanSignal(receiveSelectedSigName);
            if (null !== sigSelected) {
                sigSelected.unsubscribe(this._subReceiveSelected);
                this._sigNameReceiveSelected = '';
            }
        }

        if ('' !== this._subReceiveScriptLabelHtml && '' !== this._sigNameReceiveScriptLabelHtml) {
            const receiveScriptLabelHtmlSigName: string =
                Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
            const sigLabelHtml: Ch5Signal<string> | null = csf.getStringSignal(receiveScriptLabelHtmlSigName);
            if (null !== sigLabelHtml) {
                sigLabelHtml.unsubscribe(this._subReceiveScriptLabelHtml);
                this._sigNameReceiveScriptLabelHtml = '';
            }
        }
        this.info('unsubscribeFromSignals() end');
    }

    public imgToSvg(img: HTMLImageElement) {
        const imgID = img.id;
        const imgClass = img.className;
        const imgURL = img.src;
        const imgType = imgURL.split('.').pop();
        if (!isNil(imgURL) && (imgType === Ch5Button.SVG)) {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(this.responseText, 'text/xml');
                    const svg = xmlDoc.getElementsByTagName(Ch5Button.SVG)[0];
                    if (!isNil(svg)) {
                        if (!isNil(imgID)) {
                            svg.setAttribute('id', imgID);
                        }
                        if (!isNil(imgClass)) {
                            svg.setAttribute('class', imgClass);
                        }
                        svg.removeAttribute('xmlns:a');
                        if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
                            svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('height')} ${svg.getAttribute('width')}`);
                        }
                        if (img.parentNode) {
                            img.parentNode.replaceChild(svg, img);
                        }
                    }
                }
            };
            xhttp.open('GET', imgURL, true);
            xhttp.send();
        }
    }

    protected createInternalHtml() {
        this.info('create internal Html');
        this.clearComponentContent();
        this._elContainer = document.createElement('div');
        this._elContainer.classList.add(Ch5Button.CONTAINERCLASSNAME);
        this._elButton = document.createElement('button');
        this._elButton.classList.add('cb-btn');
        this._elIcon = document.createElement('i');
        this._elIcon.classList.add('cb-icon');
        this._elLabel = document.createElement('span');
        this._elLabel.classList.add('cb-lbl');

        this._elImg = document.createElement('img');
        this._elImg.classList.add('cb-img');

        this._elContainer.classList.add(this.primaryCssClass);
        this._elButton.setAttribute('data-ch5-id', this.getCrId());
        this._elIcon.classList.add(this.cssClassPrefix + '--icon');
        this._elImg.classList.add(this.cssClassPrefix + '--img');
        this._elLabel.classList.add(this.cssClassPrefix + '--label');

        // The icon and label elements are not appended here since they might not always be displayed and the default
        // css ( like padding ... ) would be applied without having an actual icon or label
        // The elements are appended (if needed) in the updateInternalHtml method

        this._elContainer.appendChild(this._elButton);
    }

    // adding ellipsis in iOS device with vertical button
    protected createIosEllipsis() {
        if (isSafariMobile()) {
            const btnNodes: any = this._elButton.childNodes;
            btnNodes.forEach((node: any) => {
                if (node.className === (this.primaryCssClass + '--ios-label')) {
                    node.remove();
                }
            });

            if (this.isLabelLoaded) {
                this.createEllipsisTpl();
            } else {
                let timer: any;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    this.createEllipsisTpl();
                    this.isLabelLoaded = true;
                }, 2000);
            }
        }
    }

    // creating three dots for iOS
    private createEllipsisTpl() {
        if (this._elLabel.scrollHeight > this._elLabel.clientHeight) {
            this._elContainer.classList.add(this.primaryCssClass + this.iosCssClassPostfix);
            this._elIosDots = document.createElement('i');
            this._elIosDots.classList.add('dots');
            this._elIosDots.innerHTML = '...';
            this._elLabel.appendChild(this._elIosDots);
            const wrapper: HTMLElement = document.createElement('span');
            wrapper.classList.add(this.primaryCssClass + '--ios-label');
            if (!this._elLabel.closest('.ch5-button--ios-label')) {
                this.wrap(this._elLabel, wrapper);
            }
        }
    }

    /**
     * Clear the button content in order to avoid duplication of buttons
     * @return {void}
     */
    protected clearComponentContent() {
        const containers = this.getElementsByClassName(Ch5Button.CONTAINERCLASSNAME);

        Array.from(containers).forEach((container) => {
            container.remove();
        })
    }

    protected refreshComponent() {
        this.updateCssClasses();
        this.updateInternalHtml();
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();

        this.info('called updateCssClasses()');

        const setOfCssClassesToBeApplied = new Set<string>();

        // primary
        setOfCssClassesToBeApplied.add(this.primaryCssClass);

        // shape
        setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.shape);

        // type
        setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.type);

        // size
        setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--size-' + this.size);

        // stretch
        if ('' !== this.stretch) {
            setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--stretch-' + this.stretch);
        }

        // orientation
        if ('vertical' === this.orientation) {
            setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.orientation);
        }

        const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
        if (typeof targetEl.classList !== 'undefined') {
            this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
                if (setOfCssClassesToBeApplied.has(cssClass)) {
                    targetEl.classList.add(cssClass);
                    // this.info('add CSS class', cssClass);
                } else {
                    targetEl.classList.remove(cssClass);
                    // this.info('remove CSS class', cssClass);
                }
            });
        }

        this.updateCssClassesForSelected();
    }

    protected updateForChangeInStretch() {
        this.info('called updateForChangeInStretch()');

        const parentEl = this.parentElement as HTMLElement;
        const targetEl = this.getTargetElementForCssClassesAndStyle();
        if (!parentEl) {
            this.info('updateForChangeInStretch() - parent element not found');
            return;
        }
        let stretchCssClassNameToAdd = '';
        switch (this.stretch) {
            case 'width':
                stretchCssClassNameToAdd = this.cssClassPrefix + '--stretch-width';
                break;
            case 'height':
                stretchCssClassNameToAdd = this.cssClassPrefix + '--stretch-height';
                break;
            case 'both':
                stretchCssClassNameToAdd = this.cssClassPrefix + '--stretch-both';
                break;
        }
        Ch5Button.STRETCHES.forEach((stretch: TCh5ButtonStretch) => {
            if ('' !== stretch) {
                const cssClass = this.cssClassPrefix + '--stretch-' + stretch;
                if (cssClass !== stretchCssClassNameToAdd) {
                    targetEl.classList.remove(cssClass);
                }
            }
        });
        if ('' !== stretchCssClassNameToAdd) {
            targetEl.classList.add(stretchCssClassNameToAdd);
        }
    }

    protected updateCssClassesForSelected() {
        const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
        if (typeof targetEl.classList === 'undefined') {
            return;
        }
        const selectedCssClass = this.cssClassPrefix + this.selectedCssClassPostfix;
        if (this._selected) {
            targetEl.classList.add(selectedCssClass);
        } else {
            targetEl.classList.remove(selectedCssClass);
        }
    }

    protected updateCssClassesForCustomState() {
        const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
        if (typeof targetEl.classList === 'undefined') {
            return;
        }
        const customStateCssClass = this.customClassState;
        if (this._customClassState) {
            targetEl.classList.add(customStateCssClass);
        }
    }

    /**
     * Reorders ( if needed ) the position of the label and the icon inside the button
     */
    protected updateInternalHtml() {
        if (typeof this._elButton.insertBefore === "undefined"
            || typeof this._elIcon.classList === "undefined") {
            return;
        }
        this.info('update internal html');

        this._elIcon.classList.remove('cx-button-icon-pos-first');
        this._elIcon.classList.remove('cx-button-icon-pos-last');
        this._elIcon.classList.remove('cx-button-icon-pos-top');
        this._elIcon.classList.remove('cx-button-icon-pos-bottom');
        this._elIcon.classList.add('cx-button-icon-pos-' + this.iconPosition);

        this._elImg.classList.remove('cx-button-icon-pos-first');
        this._elImg.classList.remove('cx-button-icon-pos-last');
        this._elImg.classList.remove('cx-button-icon-pos-top');
        this._elImg.classList.remove('cx-button-icon-pos-bottom');
        this._elImg.classList.add('cx-button-icon-pos-' + this.iconPosition);

        // Handle vertical button with iconPosition top or bottom
        if (['top', 'bottom'].indexOf(this.iconPosition) >= 0 && this.orientation === Ch5Button.ORIENTATIONS[1]) {
            this._elButton.classList.add(`ch5-button--vertical--icon-${this.iconPosition}`)
        }

        let hasIcon = false;
        let hasLabel = false;
        let hasImage = false;
        let hasAriaLabel = false;

        if (this.hasAttribute('iconclass') && '' !== this.getAttribute('iconclass')) {
            hasIcon = true;
        }
        if (this.hasAttribute('iconurl') && '' !== this.getAttribute('iconurl')) {
            hasImage = true;
        }

        if ((this.hasAttribute('label') && '' !== this.getAttribute('label'))
            || (this.hasAttribute('receivestatescriptlabelhtml')
                && '' !== this.getAttribute('receivestatescriptlabelhtml'))) {
            hasLabel = true;
        }

        if (this.hasAttribute('aria-label') && '' !== this.getAttribute('aria-label')) {
            hasAriaLabel = true;
        }

        // updates the iconposition ( otherwise it might use the previous value of the attribute )
        if (this.hasAttribute('iconposition')) {
            this.iconPosition = this.getAttribute('iconposition') as TCh5ButtonIconPosition;
        }

        if (!hasLabel && hasAriaLabel && hasImage) {
            const ariaLabel = this.getAttribute('aria-label');
            if (ariaLabel) {
                this._elImg.setAttribute('alt', ariaLabel);
            }
        }

        if (hasLabel && hasIcon) {
            if ((this._elLabel as any).isConnected === false) {
                this._elButton.appendChild(this._elLabel);
            } else if (this._elIcon.parentNode !== (this._elButton as Node)) {
                this.info('add label element');
                this._elButton.appendChild(this._elLabel);
            }
            if (['last', 'bottom'].indexOf(this.iconPosition) >= 0) {
                this.info('insert icon after label');
                if (this._elIcon.parentNode !== (this._elButton as Node)) {
                    // if the icon element was not yet added to the button
                    this._elButton.appendChild(this._elIcon);
                } else {
                    // if the icon element was already added and needs to be switched with the label element
                    this._elButton.insertBefore(this._elLabel as Node, this._elIcon as Node);
                }

            } else if (['first', 'top'].indexOf(this.iconPosition) >= 0) {
                this.info('insert icon before label');
                if ((this._elLabel as any).isConnected === true) {
                    this._elButton.insertBefore(this._elIcon as Node, this._elLabel as Node);
                }
            }
        } else if (hasLabel && !hasIcon) {
            this._elButton.appendChild(this._elLabel);
            if (this._elIcon.parentNode) {
                this._elIcon.remove();
            }
        } else if (!hasLabel && hasIcon) {
            this._elButton.appendChild(this._elIcon);
            if (this._elLabel.parentNode) {
                this._elLabel.remove();
            }
        } else { // if no icon and no label
            if (this._elIcon.parentNode) {
                this._elIcon.remove();
            }
            if (this._elLabel.parentNode) {
                this._elLabel.remove();
            }
        }

        if (hasImage) {
            const hasSvg = this.querySelectorAll(`svg.${this.cssClassPrefix}--img`);
            if (hasSvg.length) {
                hasSvg[0].remove();
            }
            if (this._elIcon.parentNode) {
                this._elIcon.remove();
            }
            if (hasLabel) {
                this._elImg.setAttribute('alt', "");
                if ((this._elLabel as any).isConnected === false) {
                    this._elButton.appendChild(this._elLabel);
                } else if (this._elImg.parentNode !== (this._elButton as Node)) {
                    this.info('add label element');
                    this._elButton.appendChild(this._elLabel);
                }
                if (['last', 'bottom'].indexOf(this.iconPosition) >= 0) {
                    this.info('insert icon after label');
                    if (this._elImg.parentNode !== (this._elButton as Node)) {
                        // if the icon element was not yet added to the button
                        this._elButton.appendChild(this._elImg);
                    } else {
                        // if the icon element was already added and needs to be switched with the label element
                        this._elButton.insertBefore(this._elLabel as Node, this._elImg as Node);
                    }

                } else if (['first', 'top'].indexOf(this.iconPosition) >= 0) {
                    this.info('insert icon before label');
                    if ((this._elLabel as any).isConnected === true) {
                        this._elButton.insertBefore(this._elImg as Node, this._elLabel as Node);
                    }
                }
            } else {
                this._elButton.appendChild(this._elImg);
                if (this._elLabel.parentNode) {
                    this._elLabel.remove();
                }
            }
            this.imgToSvg(this._elImg);
        }

        // orientation
        if (this.orientation === 'vertical') {
            if (this.shape !== 'circle') {
                this.createIosEllipsis();
            }
        }
    }

    public static get observedAttributes() {
        const inheritedObsAttrs = Ch5Common.observedAttributes;
        const newObsAttrs = [
            'label',

            'iconclass',
            'iconposition',
            'orientation',
            'iconurl',


            'shape',
            'size',
            'stretch',
            'type',
            'formtype',

            'selected',
            'customclassselected',
            'customclasspressed',
            'customclassdisabled',
            'receivestateselected',
            'receivestatelabel',
            'receivestatescriptlabelhtml',
            'receivestateiconclass',
            'receivestateiconurl',

            'sendeventonclick',
            'sendeventontouch'
        ];

        return inheritedObsAttrs.concat(newObsAttrs);
    }

    protected initAttributes() {
        super.initAttributes();

        if (this.hasAttribute('label')) {
            this.label = this.getAttribute('label') as string;
        }
        if (this.hasAttribute('iconclass')) {
            this.iconClass = this.getAttribute('iconclass') as string;
        }
        if (this.hasAttribute('iconposition')) {
            this.iconPosition = this.getAttribute('iconposition') as TCh5ButtonIconPosition;
        }
        if (this.hasAttribute('iconurl')) {
            this.iconUrl = this.getAttribute('iconurl') as string;
        }
        if (this.hasAttribute('orientation')) {
            this.orientation = this.getAttribute('orientation') as TCh5ButtonOrientation;
        }
        if (this.hasAttribute('shape')) {
            this.shape = this.getAttribute('shape') as TCh5ButtonShape;
        }
        if (this.hasAttribute('size')) {
            this.size = this.getAttribute('size') as TCh5ButtonSize;
        }
        if (this.hasAttribute('stretch')) {
            this.stretch = this.getAttribute('stretch') as TCh5ButtonStretch;
        }
        if (this.hasAttribute('type')) {
            this.type = this.getAttribute('type') as TCh5ButtonType;
        }
        if (this.hasAttribute('formtype')) {
            this.formType = this.getAttribute('formtype') as TCh5ButtonActionType;
        }
        let isSelected = false;
        if (this.hasAttribute('selected') && !this.hasAttribute('customclassselected')) {
            const attrSelected = (this.getAttribute('selected') as string).toLowerCase();
            if (attrSelected !== 'false' && attrSelected !== '0') {
                isSelected = true;
            }
        }
        this.selected = isSelected;

        if (this.hasAttribute('customclassselected')) {
            this.customClassState = this.getAttribute('customclassselected') as string;
        }
        if (this.hasAttribute('customclasspressed')) {
            this.customClassPressed = this.getAttribute('customclasspressed') as string;
            this.customClassState = this.customClassPressed;
        }
        if (this.hasAttribute('customclassdisabled')) {
            this.customClassDisabled = this.getAttribute('customclassdisabled') as string;
            this.customClassState = this.customClassDisabled;
        }
        if (this.hasAttribute('receivestateselected')) {
            this.receiveStateSelected = this.getAttribute('receivestateselected') as string;
        }
        if (this.hasAttribute('receivestatelabel')) {
            this.receiveStateLabel = this.getAttribute('receivestatelabel') as string;
        }
        if (this.hasAttribute('receivestatescriptlabelhtml')) {
            this.receiveStateScriptLabelHtml = this.getAttribute('receivestatescriptlabelhtml') as string;
        }
        if (this.hasAttribute('receivestateiconclass')) {
            this.receiveStateIconClass = this.getAttribute('receivestateiconclass') as string;
        }

        if (this.hasAttribute('receivestateiconurl')) {
            this.receiveStateIconUrl = this.getAttribute('receivestateiconurl');
        }

        if (this.hasAttribute('receivestatetype')) {
            this.receiveStateType = this.getAttribute('receivestatetype') as string;
        }

        if (this.hasAttribute('sendeventonclick')) {
            this.sendEventOnClick = this.getAttribute('sendeventonclick') as string;
        }
        if (this.hasAttribute('sendeventontouch')) {
            this.sendEventOnTouch = this.getAttribute('sendeventontouch') as string;
        }
        this.updateInternalHtml();
    }


    protected attachEventListeners() {
        super.attachEventListeners();

        if (this._pressable !== null && this._pressable.ch5Component.gestureable === false) {
            this._hammerManager.on('tap', this._onTap);
        }

        this._elButton.addEventListener('mousedown', this._onPressClick);
        this._elButton.addEventListener('mouseup', this._onMouseUp);
        this._elButton.addEventListener('mousemove', this._onMouseMove);
        this._elButton.addEventListener('touchstart', this._onPress, { passive: true });
        this._elButton.addEventListener('mouseleave', this._onLeave);
        this._elButton.addEventListener('touchend', this._onPressUp);
        this._elButton.addEventListener('touchmove', this._onTouchMove, { passive: true });

        this._elButton.addEventListener('touchend', this._onTouchEnd);
        this._elButton.addEventListener('touchcancel', this._onTouchCancel);

        this._elButton.addEventListener('focus', this._onFocus);
        this._elButton.addEventListener('blur', this._onBlur);
    }

    protected removeEventListeners() {
        super.removeEventListeners();

        this._elButton.removeEventListener('touchstart', this._onPress);
        this._elButton.removeEventListener('touchend', this._onPressUp);
        this._hammerManager.off('tap', this._onTap);

        this._elButton.removeEventListener('touchend', this._onTouchEnd);
        this._elButton.removeEventListener('touchcancel', this._onTouchCancel);
        this._elButton.removeEventListener('touchmove', this._onTouchMove);

        this._elButton.removeEventListener('focus', this._onFocus);
        this._elButton.removeEventListener('blur', this._onBlur);
        this._elButton.removeEventListener('mousedown', this._onPressClick);
        this._elButton.removeEventListener('mouseup', this._onMouseUp);
        this._elButton.removeEventListener('mouseleave', this._onLeave);
    }

    protected getTargetElementForCssClassesAndStyle(): HTMLElement {
        return this._elContainer;
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

        switch (attr) {
            case 'label':
                if (this.hasAttribute('label')) {
                    this.label = newValue;
                } else {
                    this.label = '';
                }
                this.updateInternalHtml(); // updates label and icon elements if needed
                break;
            case 'iconclass':
                if (this.hasAttribute('iconclass')) {
                    this.iconClass = newValue;
                } else {
                    this.iconClass = '';
                }
                this.refreshComponent();  // updates classes and html content if needed
                break;
            case 'iconposition':
                if (this.hasAttribute('iconposition')) {
                    this.iconPosition = newValue as TCh5ButtonIconPosition;
                } else {
                    this.iconPosition = Ch5Button.ICON_POSITIONS[0];
                }
                this.refreshComponent();  // updates classes and html content if needed
                break;
            case 'iconurl':
                if (this.hasAttribute('iconurl')) {
                    this.iconUrl = newValue;
                } else {
                    this.iconUrl = '';
                }
                this.refreshComponent();  // updates classes and html content if needed
                break;
            case 'orientation':
                if (this.hasAttribute('orientation')) {
                    this.orientation = newValue as TCh5ButtonOrientation;
                } else {
                    this.orientation = Ch5Button.ORIENTATIONS[0];
                }
                this.updateCssClasses();
                break;
            case 'type':
                if (this.hasAttribute('type')) {
                    this.type = newValue as TCh5ButtonType;
                } else {
                    this.type = Ch5Button.TYPES[0];
                }
                this.updateCssClasses();
                break;
            case 'shape':
                if (this.hasAttribute('shape')) {
                    this.shape = newValue as TCh5ButtonShape;
                } else {
                    this.shape = Ch5Button.SHAPES[0];
                }
                this.updateCssClasses();
                break;
            case 'size':
                if (this.hasAttribute('size')) {
                    this.size = newValue as TCh5ButtonSize;
                } else {
                    this.size = Ch5Button.SIZES[0];
                }
                this.updateCssClasses();
                break;
            case 'stretch':
                if (this.hasAttribute('stretch')) {
                    this.stretch = newValue as TCh5ButtonStretch;
                } else {
                    this.stretch = '';
                }
                this.updateForChangeInStretch();
                break;
            case 'selected':
                if (!this.hasAttribute('customclassselected')) {
                    let isSelected = false;
                    if (this.hasAttribute('selected')) {
                        const attrSelected = (this.getAttribute('selected') as string).toLowerCase();
                        if ('false' !== attrSelected && '0' !== attrSelected) {
                            isSelected = true;
                        }
                    }
                    this.selected = isSelected;
                    this.updateCssClasses();
                }
                break;
            case 'formtype':
                if (this.hasAttribute('formtype')) {
                    const actionTypeValue = this.getAttribute('formtype') as TCh5ButtonActionType;
                    this.formType = actionTypeValue;
                }
                break;
            case 'customclassselected':
                if (this.hasAttribute('customclassselected')) {
                    this.customClassState = newValue;
                } else {
                    this.customClassState = '';
                }
                this.updateCssClassesForCustomState();
                break;
            case 'customclasspressed':
                if (this.hasAttribute('customclasspressed')) {
                    this.customClassPressed = newValue;
                } else {
                    this.customClassPressed = '';
                }
                this.customClassState = this.customClassPressed;
                this.updatePressedClass(this.customClassState);
                break;
            case 'customclassdisabled':
                if (this.hasAttribute('customclassdisabled')) {
                    this.customClassDisabled = newValue;
                } else {
                    this.customClassDisabled = '';
                }
                this.customClassState = this.customClassDisabled;
                this.updateCssClassesForCustomState();
                break;
            case 'receivestateselected':
                if (this.hasAttribute('receivestateselected')) {
                    this.receiveStateSelected = newValue;
                } else {
                    this.receiveStateSelected = '';
                }
                break;
            case 'receivestatelabel':
                if (this.hasAttribute('receivestatelabel')) {
                    this.receiveStateLabel = newValue;
                } else {
                    this.receiveStateLabel = '';
                }
                break;
            case 'receivestatescriptlabelhtml':
                if (this.hasAttribute('receivestatescriptlabelhtml')) {
                    this.receiveStateScriptLabelHtml = newValue;
                } else {
                    this.receiveStateScriptLabelHtml = '';
                }
                break;
            case 'sendeventonclick':
                if (this.hasAttribute('sendeventonclick')) {
                    this.sendEventOnClick = newValue;
                } else {
                    this.sendEventOnClick = '';
                }
                break;
            case 'sendeventontouch':
                if (this.hasAttribute('sendeventontouch')) {
                    this.sendEventOnTouch = newValue;
                } else {
                    this.sendEventOnTouch = '';
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
            case 'receivestatetype':
                if (this.hasAttribute('receivestatetype')) {
                    this.receiveStateType = newValue;
                } else {
                    this.receiveStateType = '';
                }
                break;

            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    public getCssClassDisabled() {
        return this.cssClassPrefix + '--disabled';
    }
    //
    // Attr getters and setters
    //

    public set label(value: string) {
        this.info('set label("' + value + '")');

        if (isNil(value)) {
            value = '';
        }

        const trValue = this._getTranslatedValue('label', value);
        if (trValue === this.label) {
            return;
        }

        this._elLabel.textContent = trValue;
        this._label = trValue;
        this.setAttribute('label', trValue);
    }

    public get label() {
        return this._label;
    }

    public set formType(value: TCh5ButtonActionType) {
        this.info('set formType("' + value + '")');
        if (!isNil(value)) {
            this.setAttribute('formType', value);
        } else {
            this.removeAttribute('formType');
        }
    }

    public get formType(): TCh5ButtonActionType {
        return this._formType;
    }

    public set iconClass(value: string) {
        if (typeof this._elIcon.classList === "undefined") {
            return;
        }
        this.info('set iconClass("' + value + '")');
        if (this._iconClass !== value) {
            if ('' !== this.iconClass) {
                this._iconClass.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        if (this.hasAttribute('iconurl')) {
                            this._elImg.classList.remove(className); // adds the new icon class if present
                        }
                        else {
                            this._elIcon.classList.remove(className); // adds the new icon class if present
                        }
                    }
                });
            }
            this._iconClass = value;
            if ('' !== this.iconClass) {
                this._iconClass.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        if (this.hasAttribute('iconurl')) {
                            this._elImg.classList.add(className); // adds the new icon class if present
                        }
                        else {
                            this._elIcon.classList.add(className); // adds the new icon class if present
                        }
                    }
                });
            }
            this.setAttribute('iconclass', value);
        }
    }
    public get iconClass(): string {
        return this._iconClass;
    }

    public set iconPosition(value: TCh5ButtonIconPosition) {
        this.info('set iconPosition("' + value + '")');
        if (this._iconPosition !== value) {
            if (Ch5Button.ICON_POSITIONS.indexOf(value) >= 0) {
                this._iconPosition = value;
            } else {
                this._iconPosition = Ch5Button.ICON_POSITIONS[0];
            }
            this.setAttribute('iconposition', this._iconPosition);
        }
    }
    public get iconPosition(): TCh5ButtonIconPosition {
        return this._iconPosition;
    }

    public get iconUrl(): string {
        return this._iconSvgUrl;
    }

    public set iconUrl(value: string) {
        if (!isNil(value) && this._iconSvgUrl !== value) {
            this._iconSvgUrl = value || '';
            this._elImg.src = this._iconSvgUrl;
            this.setAttribute('iconurl', value);
        }
    }

    public set orientation(value: TCh5ButtonOrientation) {
        this.info('set orientation("' + value + '")');
        if (this._orientation !== value) {
            if (Ch5Button.ORIENTATIONS.indexOf(value) >= 0) {
                this._orientation = value;
            } else {
                this._orientation = Ch5Button.ORIENTATIONS[0];
            }
            this.setAttribute('orientation', this._orientation);
        }
    }

    public get orientation(): TCh5ButtonOrientation {
        return this._orientation;
    }

    public set type(value: TCh5ButtonType) {
        this.info('set type("' + value + '")');
        if (this._type !== value && value !== null) {
            if (Ch5Button.TYPES.indexOf(value) >= 0) {
                this._type = value;
            } else {
                this._type = Ch5Button.TYPES[0];
            }
            this.setAttribute('type', this._type);
        }
    }

    public get type() {
        return this._type;
    }

    public set shape(value: TCh5ButtonShape) {
        this.info('set shape(\'' + value + '\')');
        if (this._shape !== value && value !== null) {
            if (Ch5Button.SHAPES.indexOf(value) >= 0) {
                this._shape = value;
            } else {
                this._shape = Ch5Button.SHAPES[0];
            }
            this.setAttribute('shape', this._shape);
        }
    }

    public get shape() {
        return this._shape;
    }

    public set size(value: TCh5ButtonSize) {
        this.info('set size(\'' + value + '\')');
        if (this._size !== value && null !== value) {
            if (Ch5Button.SIZES.indexOf(value) >= 0) {
                this._size = value;
            } else {
                this._size = Ch5Button.SIZES[0];
            }
            this.setAttribute('size', this._size);
        }
    }

    public get size() {
        return this._size;
    }

    public set stretch(value: TCh5ButtonStretch) {
        this.info('set stretch("' + value + '")');
        if (this._stretch !== value) {
            if (Ch5Button.STRETCHES.indexOf(value) >= 0) {
                this._stretch = value;
            } else {
                this._stretch = Ch5Button.STRETCHES[0];
            }
            this.setAttribute('stretch', this._stretch);
        }
    }

    public get stretch(): TCh5ButtonStretch {
        return this._stretch;
    }

    public set selected(value: boolean) {
        this.info('set selected("' + value + '")');
        if (this._selected !== value) {
            this._selected = value;
            if (value === true) {
                this.setAttribute('selected', '');
            } else {
                this.removeAttribute('selected');
            }

        }
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set customClassState(value: string) {
        this.info('set customclassstate("' + value + '")');
        if (this._customClassState !== value) {
            this._customClassState = value;
        }
    }
    public get customClassState(): string {
        return this._customClassState;
    }

    public set customClassPressed(value: string | null) {
        this.info('set customClassPressed("' + value + '")');
        if (this._customClassPressed !== value) {
            this._customClassPressed = value;
        }
    }
    public get customClassPressed(): string | null {
        return this._customClassPressed;
    }

    public set customClassDisabled(value: string | null) {
        this.info('set customClassDisabled("' + value + '")');
        if (this._customClassDisabled !== value) {
            this._customClassDisabled = value;
        }
    }
    public get customClassDisabled(): string | null {
        return this._customClassDisabled;
    }

    //
    // Signals
    //

    public set sendEventOnClick(value: string) {
        this.info('set sendEventOnClick(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSendOnClick)) {
            this._sigNameSendOnClick = value;
            this.setAttribute('sendeventonclick', value);
        }
    }

    public get sendEventOnClick(): string {
        return this._sigNameSendOnClick;
    }

    public set sendEventOnTouch(value: string) {
        this.info('set sendEventOnTouch(\'' + value + '\')');
        if (('' !== value) && (value !== this._sigNameSendOnTouch)) {
            this._sigNameSendOnTouch = value;
            this.setAttribute('sendeventontouch', value);
        }
    }

    public get sendEventOnTouch(): string {
        return this._sigNameSendOnTouch;
    }

    public set receiveStateSelected(value: string) {
        this.info('set receiveStateSelected(\'' + value + '\')');
        if (!value || this._sigNameReceiveSelected === value) {
            return;
        }
        // clean up old subscription
        if (this._sigNameReceiveSelected) {

            const oldReceiveSelectedSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveSelected);
            const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
                .getBooleanSignal(oldReceiveSelectedSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveSelected);
            }
        }

        // update internal property
        this._sigNameReceiveSelected = value;
        // update attribute
        // the condition at the start of the method stops an infinite loop ( property change <-> atribute changed callback)
        this.setAttribute('receiveStateSelected', value);

        // setup new subscription.
        const receiveSelectedSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveSelected);
        const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(receiveSelectedSigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveSelected = receiveSignal.subscribe((newValue: boolean) => {
            if (newValue !== this._selected) {
                this.setAttribute('selected', '' + newValue); // concatenates with empty string to convert to string
            }
        });
    }

    public get receiveStateSelected(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestateselected');
    }

    public set receiveStateLabel(value: string) {
        this.info('set receiveStateLabel(\'' + value + '\')');
        if (!value || this._sigNameReceiveLabel === value) {
            return;
        }
        // clean up old subscription
        if (this._sigNameReceiveLabel) {

            const oldReceiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveLabel);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldReceiveLabelSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveLabel);
            }
        }

        this._sigNameReceiveLabel = value;
        this.setAttribute('receivestatelabel', value);

        // setup new subscription.
        const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveLabel);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveLabelSigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveLabel = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this.label) {
                this.setAttribute('label', newValue);
            }
        });
    }

    public get receiveStateLabel(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatelabel');
    }

    public set receiveStateScriptLabelHtml(value: string) {
        this.info('set receiveStateScriptLabelHtml(\'' + value + '\')');
        if (!value || this._sigNameReceiveScriptLabelHtml === value) {
            return;
        }
        // clean up old subscription
        if (this._sigNameReceiveScriptLabelHtml) {

            const oldReceiveScriptLabelHtmlSigName: string =
                Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldReceiveScriptLabelHtmlSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveScriptLabelHtml);
            }
        }

        this._sigNameReceiveScriptLabelHtml = value;
        this.setAttribute('receivestatescriptlabelhtml', value);

        // setup new subscription.
        const receiveScriptLabelHtmlSigName: string =
            Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveScriptLabelHtmlSigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveScriptLabelHtml = receiveSignal.subscribe((newValue: string) => {
            if ('' !== newValue && newValue !== this._elLabel.innerHTML) {
                this._elLabel.innerHTML = newValue;
            }
        });
    }

    public get receiveStateScriptLabelHtml(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatescriptlabelhtml');
    }

    public set receiveStateIconClass(signalName: string | null) {
        this.info('set receiveStateIconClass(\'' + signalName + '\')');
        if (!signalName || this._receiveStateIconClass === signalName) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateIconClass) {

            const oldReceiveStateIconClass: string = Ch5Signal.getSubscriptionSignalName('' + this._receiveStateIconClass);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldReceiveStateIconClass);

            if (oldSignal !== null) {
                oldSignal.unsubscribe('' + this.subReceiveSignalIconClass);
            }
        }

        this._receiveStateIconClass = signalName;
        this.setAttribute('receivestateiconclass', signalName);

        // setup new subscription.
        const receiveSateIconClassSigName: string = Ch5Signal.getSubscriptionSignalName('' + this._receiveStateIconClass);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveSateIconClassSigName);

        if (receiveSignal === null) {
            return;
        }

        this.subReceiveSignalIconClass = receiveSignal.subscribe((newValue: string) => {
            this.iconClass = newValue;
        });
    }

    public get receiveStateIconClass(): string | null {
        return this._receiveStateIconClass;
    }

    public set subReceiveSignalIconClass(subscription: string | null) {
        this._subReceiveSignalIconClass = subscription;
    }

    public get subReceiveSignalIconClass(): string | null {
        return this._subReceiveSignalIconClass;
    }

    public set receiveStateIconUrl(signalName: string | null) {
        this.info('set receivestateiconurl(\'' + signalName + '\')');
        if (!signalName || this._receiveStateIconSvgUrl === signalName) {
            return;
        }
        // clean up old subscription
        if (this._receiveStateIconSvgUrl) {

            const oldReceiveIconUrlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconSvgUrl);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldReceiveIconUrlSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this.subReceiveSignalSvgUrl as string);
            }
        }

        this._receiveStateIconSvgUrl = signalName;
        this.setAttribute('receivestateiconurl', signalName);

        // setup new subscription.
        const receiveIconurlSigName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateIconSvgUrl);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveIconurlSigName);

        if (receiveSignal === null) {
            return;
        }

        this.subReceiveSignalSvgUrl = receiveSignal.subscribe((newValue: string) => {
            this.iconUrl = newValue;
        });
    }

    public get receiveStateIconUrl(): string | null {
        return this._attributeValueAsString('receivestateiconurl');
    }

    public set subReceiveSignalSvgUrl(subscription: string | null) {
        this._subReceiveSignalSvgUrl = subscription;
    }

    public get subReceiveSignalSvgUrl(): string | null {
        return this._subReceiveSignalSvgUrl;
    }

    public set receiveStateType(signalName: string | null) {
        this.info('set receiveStateType(\'' + signalName + '\')');

        if (this._sigNameReceiveStateType === signalName || signalName === null) {
            return;
        }
        // clean up old subscription
        if (this._sigNameReceiveStateType) {

            const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateType);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldReceiveStateSigName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveSignalType as string);
            }
        }

        this._sigNameReceiveStateType = signalName;
        this.setAttribute('receivestatetype', signalName);

        // setup new subscription.
        const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveStateType);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveLabelSigName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveSignalType = receiveSignal.subscribe((newValue: string) => {
            this.type = newValue as TCh5ButtonType;
        });
    }

    public get receiveStateType(): string | null {
        return this._attributeValueAsString('receivestatetype');
    }

    public set subReceiveSignalType(subscription: string | null) {
        this._subReceiveSignalType = subscription;
    }

    public get subReceiveSignalType(): string | null {
        return this._subReceiveSignalType;
    }

    private sendValueForRepeatDigital(value: boolean): void {
        if (!this._sigNameSendOnTouch && !this._sigNameSendOnClick) { return; }

        const touchSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
            .getObjectAsBooleanSignal(this._sigNameSendOnTouch);

        const clickSignal: Ch5Signal<object | boolean> | null = Ch5SignalFactory.getInstance()
            .getObjectAsBooleanSignal(this._sigNameSendOnClick);

        if (clickSignal && touchSignal && clickSignal.name === touchSignal.name) {
            // send signal only once if it has the same value
            clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
            return;
        }

        if (touchSignal && touchSignal.name) {
            touchSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
        }

        if (clickSignal && clickSignal.name) {
            clickSignal.publish({ [Ch5SignalBridge.REPEAT_DIGITAL_KEY]: value });
        }
    }



    //
    // Events
    //

    private _onTap(): void {
        this.info('Ch5Button._onTap()');

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

    private _onTouchMove(event: TouchEvent) {

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
    
    private _onLeave() {
        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    private async _onPressClick(event: MouseEvent) {

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

        if (this.isTouch) {
            return;
        }
        
        this.cancelPress();

        this.reactivatePress();

        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        } else if (this._pressed) {
            this._onTapAction();
        }

        const timeSinceLastPress = new Date().valueOf() - this._lastTapTime;
        if (this._lastTapTime && timeSinceLastPress < Ch5Button.DEBOUNCE_PRESS_TIME) {
            // sometimes a both click and press can happen on iOS/iPadOS, don't publish both
            this.info('Ch5Button debouncing duplicate press/hold and click ' + timeSinceLastPress);
        }
    }

    private _onMouseMove(event: MouseEvent) {

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

    private _onPressUp(): void {

        window.clearTimeout(this._pressTimeout);

        this.reactivatePress();

        if (this._pressed) {
            this.info("Ch5Button._onPressUp()");
    
            this._pressed = false;
    
            if (this._intervalIdForRepeatDigital) {
                window.clearInterval(this._intervalIdForRepeatDigital);
                this.sendValueForRepeatDigital(false);
                this._intervalIdForRepeatDigital = null;
                this._lastPressTime = new Date().valueOf();
            }
        }
    }

    private _onTouchEnd(inEvent: Event): void {

        this.info("Ch5Button._onTouchEnd()");

        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    private _onTouchCancel(inEvent: Event): void {

        this.info("Ch5Button._onTouchCancel()");

        if (this._intervalIdForRepeatDigital) {
            this.stopRepeatDigital();
        }
    }

    private _onBlur(inEvent: Event): void {
        this.info("Ch5Button._onBlur()");
        let clonedEvent: Event;

        this.reactivatePress();

        clonedEvent = new Event(inEvent.type, inEvent);
        this.dispatchEvent(clonedEvent);

        inEvent.preventDefault();
        inEvent.stopPropagation();
    }

    private _onFocus(inEvent: Event): void {
        this.info("Ch5Button._onFocus()");
        let clonedEvent: Event;

        clonedEvent = new Event(inEvent.type, inEvent);
        this.dispatchEvent(clonedEvent);

        inEvent.preventDefault();
        inEvent.stopPropagation();
    }

    /**
     * Sends the signal passed via sendEventOnClick or sendEventOnTouch
     */
    private _sendOnClickSignal(preventTrue: boolean = false, preventFalse: boolean = false): void {
        let sigClick: Ch5Signal<boolean> | null = null;

        if (this._sigNameSendOnClick) {
            sigClick = Ch5SignalFactory.getInstance()
                .getBooleanSignal(this._sigNameSendOnClick);

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

    private cancelPress() {
        window.clearTimeout(this._pressTimeout);
        this._pressed = false;
    }

    /**
     * Press Handler
     *
     * @return {Promise}
     */
    private pressHandler(): Promise<boolean> {
        const pressHandler = () => {
            this.info("Ch5Button._onPress()");
            this._pressed = true;
        }

        const pressPromise = new Promise<boolean>((resolve, reject) => {
            this._pressTimeout = window.setTimeout(() => {
                pressHandler();
                resolve(this._pressed);
            }, Ch5Button.TOUCHTIMEOUT);
        });

        return pressPromise;
    }

    private stopRepeatDigital() {
        if (this._intervalIdForRepeatDigital) {
            window.clearInterval(this._intervalIdForRepeatDigital);
            this.sendValueForRepeatDigital(false);
            this._intervalIdForRepeatDigital = null;
            return;
        }

        this.sendValueForRepeatDigital(true);

        this._intervalIdForRepeatDigital = window.setInterval(() => {
            this.sendValueForRepeatDigital(true);
        }, Ch5Button.TOUCHTIMEOUT);
    }

    private isExceedingPressMoveThreshold(x1: number, y1: number, x2: number, y2: number) {
        const startingPoint = x2 - x1;
        const endingPoint = y2 - y1;
        const distance = Math.sqrt(startingPoint ** 2 + endingPoint ** 2);

        return distance > Ch5Button.PRESS_MOVE_THRESHOLD;
    }

    private reactivatePress(): void {
        clearTimeout(this.allowPressTimeout);
        this.allowPressTimeout = setTimeout(() => {
            this.allowPress = true;
        }, Ch5Button.DEBOUNCE_PRESS_TIME) as never as number;
    }
}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {

    window.customElements.define('ch5-button', Ch5Button);
}

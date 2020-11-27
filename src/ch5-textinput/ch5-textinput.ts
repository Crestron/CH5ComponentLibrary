// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import {Ch5CommonInput} from "../ch5-common-input/ch5-common-input";
import {Ch5Signal, Ch5SignalFactory} from "../ch5-core";
import {Ch5TextInputScaling} from "./ch5-textinput-scaling";
import {Ch5tTextInputMask} from "./ch5-textinput-mask";
import {Ch5Common} from "../ch5-common/ch5-common";

import {TCh5TextInputType} from '../_interfaces/ch5-textinput/types/t-ch5-textinput-type';
import {TCh5TextInputTextTransform} from '../_interfaces/ch5-textinput/types/t-ch5-textinput-text-transform';
import {TCh5TextInputStretch} from '../_interfaces/ch5-textinput/types/t-ch5-textinput-stretch';
import {TCh5TextInputSize} from '../_interfaces/ch5-textinput/types/t-ch5-textinput-size';
import {TCh5TextInputIconPosition} from '../_interfaces/ch5-textinput/types/t-ch5-textinput-icon-position';
import {TCh5CommonInputFeedbackModes} from '../_interfaces/ch5-common-input/types';
import HtmlCallback from "../ch5-common/utils/html-callback";
import {ICh5TextInputAttributes} from "../_interfaces/ch5-textinput";
import {Ch5RoleAttributeMapping} from "../utility-models";

export class Ch5Textinput extends Ch5CommonInput implements ICh5TextInputAttributes {

    /**
     * Contains the values of type attribute
     *
     * @public
     * @static
     * @type {Array<TCh5TextInputType>}
     */
    public static TYPES: TCh5TextInputType[] = ['text', 'number', 'text', 'email'];

    /**
     * Contains the allowed size values
     *
     * @public
     * @static
     * @type {Array<TCh5TextInputSize>}
     */
    public static SIZES: TCh5TextInputSize[] = ['regular', 'x-small', 'small', 'large', 'x-large']

    /**
     * Contains the allowed stretch types
     *
     * @public
     * @static
     * @type {Array<TCh5TextInputStretch>}
     */
    public static STRETCH: TCh5TextInputStretch[] = ['fixed', 'width', 'content'];

    /**
     * Contains the allowed text-trasform types
     *
     * @public
     * @static
     * @type {Array<TCh5TextInputTextTransform>}
     */
    public static TEXTTRANSFORM: TCh5TextInputTextTransform[] = ['none', 'capitalize', 'uppercase', 'lowercase'];

    /**
     * Contains the allowed positions of the icon element
     *
     * @public
     * @static
     * @type {Array<TCh5TextInputIconPosition>}
     */
    public static ICONPOSITION: TCh5TextInputIconPosition[] = ['first', 'last'];

    /**
     * Css class postfix
     *
     * @public
     * @static
     * @type {string}
     */
    public static COMPONENT_CONTENT_POSTFIX: string = '__assets';

    /**
     * Primary css class
     *
     * @public
     * @type {string}
     */
    public primaryCssClass: string = 'ch5-textinput' as string;

    /**
     * Class prefix
     *
     * @public
     * @type {string}
     */
    public cssClassPrefix: string = 'ch5-textinput' as string;

    /**
     * The input element
     *
     * @protected
     * @memberof Ch5Textinput
     * @type {HTMLInputElement}
     */
    protected _elInput: HTMLInputElement = {} as HTMLInputElement;

    /**
     * The icon element
     *
     * @private
     * @memberof Ch5Textinput
     * @type {HTMLElement}
     */
    private _elIcon: HTMLElement = {} as HTMLElement;

    /**
     * The label element
     *
     * @private
     * @memberof Ch5Textinput
     * @type {HTMLLabelElement}
     */
    private _labelElement: HTMLLabelElement = {} as HTMLLabelElement;

    /**
     * Input placeholder
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _placeholder: string = '' as string;

    /**
     * Background pattern that will be present when the input is focus.
     * We will allow the following combination of prebuild definitions:
     * a - alpha caracter
     * 9- numeric character
     * *- alpha numeric character
     * See https://github.com/estelle/input-masking as example
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _mask: string = '' as string;

    /**
     * Type of the input. Default 'text'
     * Choice of input limited to 'password', 'number', 'text', 'email'
     * This will affect the validation, length of the component.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {TCh5TextInputType}
     */
    private _inputType: TCh5TextInputType = 'text' as TCh5TextInputType;

    /**
     * The pattern attribute specifies a regular expression that the
     * element's value is checked against. The regular expression syntax
     * must be consistent with MDN.
     * https://developer.mozilla.org/enUS/docs/Web/JavaScript/Guide/Regular_Expressions
     * If we use this property the mask property will be not taken in
     * consideration.
     * See https://developer.mozilla.org/enUS/docs/Web/HTML/Element/input
     * attribute of same name
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _pattern: string = '' as string;

    /**
     * TabIndex - default behavior
     *
     * @type {number}
     * @protected
     * @memberof Ch5CommonInput
     */
    protected _tabIndex: number = 0 as number;

    /**
     * Icon to be shown
     * Example: fa fa-plane
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _icon: string = '' as string;

    /**
     * Valid values are 'first' and 'last'. Default is 'first'. If direction attribute
     * s 'ltr', as will be typical in locales with left to right language
     * direction, 'first' is equivalent to icon being on the left and text on the
     * right. Conversely, if the direction attribute is 'rtl', the 'first' would
     * have the icon on the right and the label to its left. Value of 'last' is
     * the opposite of 'first'.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {TCh5TextInputIconPosition}
     */
    private _iconPosition: TCh5TextInputIconPosition = 'first';

    /**
     * Applicable only in feedbackmode='submit'.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {number}
     */
    private _minLength: number = 0 as number;

    /**
     * Applicable only in feedbackmode='submit'.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {number}
     */
    private _maxLength: number = 0 as number;

    /**
     * Applicable only for type=numeric and feedbackmode='submit', field
     * will be in error if the value supplied by user is less than value of the
     * attribute.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {number}
     */
    private _minValue: number = 0 as number;

    /**
     * Applicable only for type=numeric and feedbackmode='submit', field
     * will be in error if the value supplied by user is greater than value of
     * the attribute.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {number}
     */
    private _maxValue: number = 0 as number;

    /**
     * Default value 'regular'. Valid values 'x-small', 'small', 'regular',
     * 'large', and 'x-large'. Sets the relative size of this Component.
     *
     * @private
     * @memberof Ch5Textinput
     * @type {TCh5TextInputSize}
     */
    private _size: TCh5TextInputSize = 'regular' as TCh5TextInputSize;

    /**
     * Default 'fixed'. Valid values 'fixed', 'width', and 'content'.
     * Sets the width of the input
     * Fixed - fixed position ( from CSS classes )
     * Width - Width of the parent content
     * Content - Width will be equal to the content width
     * TODO: ONHOLD We need a library or an custom function that will read do Text
     * Metrics ( depending on font name, font size, bold and so on )
     *
     * @private
     * @memberof Ch5Textinput
     * @type {TCh5TextInputStretch}
     */
    private _stretch: TCh5TextInputStretch = 'fixed' as TCh5TextInputStretch;

    /**
     * Activate the scaling for the input
     *
     * @private
     * @memberof Ch5Textinput
     * @type {boolean}
     */
    private _scaling: boolean = false as boolean;

    /**
     * The minimum font size
     *
     * @private
     * @memberof Ch5Textinput
     * @type {number}
     */
    private _minimumFontSize: number = 12 as number;

    /**
     * The utility object which contains functionality for scaling
     *
     * @private
     * @memberof Ch5Textinput
     * @type {Ch5TextInputScaling}
     */
    private _scalingUtility: Ch5TextInputScaling = {} as Ch5TextInputScaling;

    /**
     * The utility object which contains functionality for masking
     *
     * @private
     * @memberof Ch5Textinput
     * @type {Ch5tTextInputMask}
     */
    private _maskingUtility: Ch5tTextInputMask = {} as Ch5tTextInputMask;

    /**
     * Only for type=text, default value 'none'. Valid values
     * 'capitalize' – make all first characters of each word uppercase
     * 'uppercase' – make all characters uppercase
     * 'lowercase' – make all characters lowercase
     * 'none' – don't change input
     *
     * @private
     * @memberof Ch5Textinput
     * @type {TCh5TextInputTextTransform}
     */
    private _textTransform: TCh5TextInputTextTransform = 'none';

    /**
     * Text for the label element
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _label: string = '' as string;

    /**
     * send signal on value change
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _sendEventOnChange: string = '' as string;

    /**
     * send signal on focus event
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _sendEventOnFocus: string = '' as string;

    /**
     * send signal on blur event
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _sendEventOnBlur: string = '' as string;

    /**
     * When focused, true, when unfocuses, send
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _receiveStateFocus: string = '' as string;

    /**
     * Receive signal with focus state
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _receiveStateFocusSub: string = '' as string;

    /**
     * When receive change the value of the text input field
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _receiveStateValue: string = '' as string;

    /**
     * Receive the value from signal
     *
     * @private
     * @memberof Ch5Textinput
     * @type {string}
     */
    private _receiveStateValueSub: string = '' as string;

    /**
     * ValidityChange event
     * When the input is going invalid from/to invalid
     * to/from valid (only applicable on
     * feedbackmode='submit')
     *
     * Bind to the validity change
     *
     * @private
     * @memberof Ch5Textinput
     * @type {CustomEvent}
     */
    private _validityChangeEvent: CustomEvent = {} as CustomEvent;

    /**
     * Fires on change if feedbackMode attribute has 'submit' value
     *
     * @private
     * @memberof Ch5Textinput
     * @type {CustomEvent}
     */
    private _dirtyCustomEvent: CustomEvent = {} as CustomEvent;

    /**
     * Fires when the input is getting clean
     *
     * @private
     * @memberof Ch5Textinput
     * @type {CustomEvent}
     */
    private _cleanCustomEvent: CustomEvent = {} as CustomEvent;

    /**
     * Stores the validation state of the input
     * Usually used with validityChange event because we have
     * to dispatch that event only if this valid value is different than the
     * current input valid value
     *
     * @private
     * @memberof Ch5Textinput
     * @type {boolean}
     */
    private _lastValidState: boolean = false as boolean;

    /**
     * @private
     * @memberof Ch5Textinput
     * @type {EventListenerOrEventListenerObject}
     */
    private _onFocusListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

    /**
     * @private
     * @memberof Ch5Textinput
     * @type {EventListenerOrEventListenerObject}
     */
    private _onBlurListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

    /**
     * @private
     * @memberof Ch5Textinput
     * @type {EventListenerOrEventListenerObject}
     */
    private _onChangeListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

    /**
     * @private
     * @memberof Ch5Textinput
     * @type {EventListenerOrEventListenerObject}
     */
    private _onKeyPressListener: EventListenerOrEventListenerObject = {} as EventListenerOrEventListenerObject;

    /**
     * @private
     * @memberof Ch5Textinput
     * @type {HTMLElement}
     */
    private _assetsWrapper: HTMLElement = {} as HTMLElement;

    /**
     * @private
     * @memberof Ch5Textinput
     * @type {HTMLElement}
     */
    private _onvaliditychange: HtmlCallback | (() => void) = {} as HtmlCallback;

    constructor() {
        super();
    }

    /**
     * @static
     * @return {Array.<String>}
     */
    public static get observedAttributes(){

        const superAttributes = Ch5CommonInput.observedAttributes;
        const commonAttributes = Ch5Common.observedAttributes;

        const contextAttributes = [
            'icon',
            'iconposition',
            'label',
            'stretch',
            'text-transform',
            'value',
            'type',
            'minlength',
            'maxlength',
            'minvalue',
            'maxvalue',
            'size',
            'tabindex',
            'feedbackmode',
            'scaling',
            'minimumfontsize',
            'mask',
            'pattern',
            'placeholder',
            // 'signalValueSyncTimeout'
            'receivestatefocus',
            'receivestatevalue',
            'sendeventonchange',
            'sendeventonfocus',
            'sendeventonblur'
        ];

        return contextAttributes.concat(superAttributes, commonAttributes);

    }

    public connectedCallback(): void {

        this.info('<ch5-textinput/>.connectedCallback()');

        Promise.all([
            customElements.whenDefined('ch5-textinput'),
        ]).then(() => {
            // WAI-ARIA Attributes
            if (!this.hasAttribute('role')) {
                this.setAttribute('role', Ch5RoleAttributeMapping.ch5TextInput);
            }

            /**
             * The tabindex global attribute indicates if its element can be focused.
             * Makes available focus and blur events on element
             *
             * tabindex="0" will take an element and make it focusable. It doesn’t set the element’s position in the tab order,
             * it just allows a user to focus the element in the order determined by its location with the DOM.
             *
             * tabindex="-1" allows you to set an element’s focus with script, but does not put it in the tab order of the page.
             * This is handy when you need to move focus to something you have updated via script or outside of user action.
             */
            if (!this.hasAttribute('tabindex')) {
                this.setAttribute('tabindex', '0');
            }

            if (!this._wasInstatiated) {
                this.createInternalHTML();
            }
            this._wasInstatiated = true;

            this.initAttributes();
            this.attachEventListeners();
            this._addAriaAttributes();

            this.initCommonMutationObserver(this);

            this.lastValidState = this.getValid();
            this.info('Ch5TextInput --- Callback loaded');
        });
    }

    public disconnectedCallback(): void {
        this.info('<ch5-textinput/>.disconnectedCallback()');

        this.removeEvents();
        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    public unsubscribeFromSignals() {
        this.info('ch5-textinput unsubscribeFromSignals()')
        super.unsubscribeFromSignals();

        this.clearBooleanSignalSubscription(this._receiveStateFocus, this._receiveStateFocusSub);
        this._receiveStateFocus = '';
        this.clearStringSignalSubscription(this._receiveStateValue, this._receiveStateValueSub);
        this._receiveStateValue = '';
    }
    /**
     *
     * @param {string} attr
     * @param {string} oldValue
     * @param {string} newValue
     * @return {void}
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        super.attributeChangedCallback(attr, oldValue, newValue);

        this.info('<ch5-textinput/>.attributeChangedCallback(' + attr + ',' + oldValue + ',' + newValue + ')');

        if (this._wasInstatiated && newValue !== '') {
            switch (attr) {
                case 'label':
                    this.label = this.attributeChangeHandler(
                        'label', oldValue, newValue
                    ) as string;
                case 'stretch':
                    this.stretch = this.attributeChangeHandler(
                        'stretch', oldValue, newValue) as TCh5TextInputStretch;

                    break;
                case 'text-transform':
                    if (this.inputType === 'text') {
                        this.textTransform = this.attributeChangeHandler(
                            'text-transform', oldValue, newValue) as TCh5TextInputTextTransform;
                    }
                    break;
                case 'value':
                    this.value = this.attributeChangeHandler(
                        'value', oldValue, newValue
                    );
                    break;
                case 'placeholder':

                    this.placeholder = this.attributeChangeHandler(
                        'placeholder', oldValue, newValue
                    );

                    break;
                // case 'mask': tbd
                case 'pattern':
                    this.pattern = this.attributeChangeHandler(
                        'pattern', oldValue, newValue
                    );
                    break;
                case 'icon':
                    this.icon = this.attributeChangeHandler(
                        'icon', oldValue, newValue);
                    this.iconPositioning();
                    this._addModifierClass(this.size, Ch5Textinput.SIZES as [string], true);
                    break;
                case 'iconposition':
                    this.iconPosition = this.attributeChangeHandler(
                        'iconposition', oldValue, newValue
                    ) as TCh5TextInputIconPosition;
                    this.iconPositioning();
                    break;
                case 'mask':
                    this.mask = this.getAttribute('mask') as string;
                    break;
                case 'type':
                    this.inputType = this.attributeChangeHandler(
                        'type', oldValue, newValue
                    ) as TCh5TextInputType;
                    break;
                case 'minlength':
                    this.minLength = Number(this.attributeChangeHandler(
                        'minlength', oldValue, newValue
                    ));
                    break;
                case 'maxlength':
                    this.maxLength = Number(this.attributeChangeHandler(
                        'maxlength', oldValue, newValue
                    ));
                    break;
                case 'minvalue':
                    this.minValue = Number(this.attributeChangeHandler(
                        'minvalue', oldValue, newValue
                    ));
                    break;
                case 'maxvalue':
                    this.maxValue = Number(this.attributeChangeHandler(
                        'maxvalue', oldValue, newValue
                    ));
                    break;
                case 'size':
                    this.size = this.attributeChangeHandler(
                        'size', oldValue, newValue
                    ) as TCh5TextInputSize;

                    if (this._maskingUtility.constructor === Ch5tTextInputMask) {
                        this._maskingUtility._makeMaskElementLookAsInputPlaceholder();
                    }
                    break;
                case 'scaling':
                    this.scaling = newValue === 'false' ? false : true;
                    break;
                case 'minimumfontsize':
                    this.minimumFontSize = Number(this.attributeChangeHandler(
                        'minimumfontsize', oldValue, newValue
                    ));
                case 'tabindex':
                    this.tabIndex = Number(this.attributeChangeHandler(
                        'tabindex', oldValue, newValue
                    ));
                    break;
                case 'feedbackmode':
                    this.feedbackMode = this.attributeChangeHandler(
                        'feedbackmode', oldValue, newValue
                    ) as TCh5CommonInputFeedbackModes;
                    break;
                // case 'signalValueSyncTimeout':
                case 'receivestatefocus':
                    this.receiveStateFocus = this.attributeChangeHandler(
                        'receivestatefocus', oldValue, newValue
                    );
                    break;
                case 'receivestatevalue':
                    this.receiveStateValue = this.attributeChangeHandler(
                        'receivestatevalue', oldValue, newValue
                    );
                    break;
                case 'sendeventonchange':
                    this.sendEventOnChange = this.attributeChangeHandler(
                        'sendeventonchange', oldValue, newValue
                    );
                    break;
                case 'sendeventonfocus':
                    this.sendEventOnFocus = this.attributeChangeHandler(
                        'sendeventonfocus', oldValue, newValue
                    );
                    break;
                case 'sendeventonblur':
                    this.sendEventOnBlur = this.attributeChangeHandler(
                        'sendeventonblur', oldValue, newValue
                    );
                    break;
                default:
                    break;
            }

            this._addAriaAttributes();
        }
    }

    // ========================================================
    // =============== SETTERS AND GETTERS ====================
    // ========================================================

    /**
     * Setter for tabIndex
     *
     * @param {number} index
     */
    public set tabIndex(index: number) {

        if (
            this.tabIndex !== index &&
            (index === undefined || index === null)
        ) {
            index = 0;
        }

        this._tabIndex = index;
        this._elInput.tabIndex = this.tabIndex;
    }

    /**
     * Getter for tabIndex
     *
     * @return {number}
     */
    public get tabIndex(): number {

        return this._tabIndex;
    }

    /**
     * Setter for placeholder
     *
     * @param {string} placeholder
     */
    public set placeholder(placeholder:string) {

        let _placeholder = placeholder;
        this.info("set <ch5-textinput placeholder='" + placeholder + "'/>");

        if ((placeholder === undefined || placeholder === null)) {
            _placeholder = '';
        } else {
            _placeholder = this._getTranslatedValue('placeholder', placeholder);
        }

        // TODO: Refactoring
        if (_placeholder !== placeholder) {
            this.setAttribute('placeholder', _placeholder);
        }

        this._placeholder = _placeholder;
        this._elInput.setAttribute('placeholder', _placeholder);
    }

    /**
     * Getter for placeholder
     *
     * @return {string}
     */
    public get placeholder(): string {

        this.info("get <ch5-textinput placeholder />");

        return this._placeholder;
    }

    /**
     * Setter for icon
     *
     * @param {string} icon
     */
    public set icon(icon: string) {

        this.info("set <ch5-textinput icon='" + icon + "'/>");

        if (this.icon !== icon) {
            if (icon === undefined || icon === null) {
                icon = '';
            }

            this.setAttribute('icon', icon);
        }

        this._icon = icon;

        // reset the class attribute
        this._elIcon.className = '';

        if (this._elIcon !== undefined) {
            this.icon.split(' ').forEach(
                (className: string) => {
                    this._elIcon.classList.add(className);
                }
            )
            this._elIcon.classList.add(this.cssClassPrefix + '__icon');
        }

    }

    /**
     * Getter for icon
     *
     * @return {string}
     */
    public get icon(): string {

        this.info('get <ch5-textinput icon />');

        return this._icon;
    }

    /**
     * Setter for iconPosition
     *
     * @param {TCh5TextInputIconPosition} position
     */
    public set iconPosition(position: TCh5TextInputIconPosition) {

        this.info("set <ch5-textinput iconposition='" + position + "'/>");

        if (
            this.iconPosition !== position &&
            (position === undefined || position === null)
        ) {
            position = 'first';
        }

        let _iconPositionIndex = Ch5Textinput.ICONPOSITION.indexOf(position);
        if (_iconPositionIndex === -1) {
            _iconPositionIndex = 0;
        }

        position = Ch5Textinput.ICONPOSITION[_iconPositionIndex];

        if (position !== this.iconPosition) {
            this.setAttribute('iconPosition', position);
        }

        this._iconPosition = position;

        if (this._elIcon.constructor === HTMLElement) {
            this._removeModifierClass(Ch5Textinput.ICONPOSITION as [string]);
            this._elIcon.classList.add(this.cssClassPrefix + '__icon--' + position);
        }
    }

    /**
     * Getter for iconPosition
     *
     * @return {TCh5TextInputIconPosition}
     */
    public get iconPosition(): TCh5TextInputIconPosition {

        this.info('get <ch5-textinput iconposition />')

        return this._iconPosition;
    }

    /**
     * Setter for input type
     *
     * @param {TCh5TextInputType} type
     */
    public set inputType(type: TCh5TextInputType) {

        this.info("set <ch5-textinput type='" + type + "'/>");

        if (this.inputType !== type && (type === undefined || type === null)) {
            type = 'text';
        }

        const currentType = Ch5Textinput.TYPES.filter(t => {
            return t === type;
        });

        if (currentType.length > 0) {
            this._inputType = currentType[0];
        } else {
            this._inputType = 'text';
        }

        this._elInput.setAttribute('type', this._inputType);
    }

    /**
     * Getter for input type
     *
     * @return {TCh5TextInputType}
     */
    public get inputType(): TCh5TextInputType {

        this.info('get <ch5-textiput type />');

        return this._inputType;
    }

    /**
     * Setter for minLength
     *
     * @param {number} length
     */
    public set minLength(length: number) {

        this.info('set <ch5-textinput minlength="' + length + '"');

        if (
            this.minLength !== length &&
            (length === undefined || length === null)
        ) {
            length = 0;
        }

        this._minLength = length;
        this._elInput.setAttribute('minlength', length + '');
        this._elInput.minLength = length;
    }

    /**
     * Getter for minLength
     *
     * @return {number}
     */
    public get minLength(): number {

        this.info('get <ch5-textinput minlength />');

        return this._minLength;
    }

    /**
     * Setter for maxLength
     *
     * @param {number} length
     */
    public set maxLength(length: number) {

        this.info('set <ch5-textinput maxlength="' + length + '"');

        if (
            this.maxLength !== length &&
            (length === undefined || length === null)
        ) {
            length = 0;
        }

        this._maxLength = length;
        this._elInput.maxLength = length;
        this._elInput.setAttribute('maxlength', String(length));
    }

    /**
     * Getter for maxLength
     *
     * @return {number}
     */
    public get maxLength(): number {

        this.info('get <ch5-textinput maxlength />');

        return this._maxLength;
    }

    /**
     * Setter for minValue
     *
     * @param {number} minValue
     */
    public set minValue(minValue: number) {

        this.info('set <ch5-textinput minvalue="' + minValue + '"');

        if (
            this.minValue &&
            (minValue === undefined || minValue === null)
        ){
            minValue = 0;
        }

        this._minValue = minValue;
        this._elInput.setAttribute('min', String(this.minValue));
    }

    /**
     * Getter for minValue
     *
     * @return {number}
     */
    public get minValue(): number {

        this.info('get <ch5-textinput minvalue />');

        return this._minValue;
    }

    /**
     * Setter for maxValue
     *
     * @param {number} maxValue
     */
    public set maxValue(maxValue: number) {

        this.info('set <ch5-textinput maxvalue="' + maxValue + '"');

        if (
            this.maxValue !== maxValue &&
            (maxValue === undefined || maxValue === null)
        ) {
            maxValue = 0;
        }

        this._maxValue = maxValue;
        this._elInput.setAttribute('max', String(this.maxValue));
    }

    /**
     * Getter for maxValue
     *
     * @return {number}
     */
    public get maxValue(): number {

        this.info('get <ch5-textinput maxvalue />');

        return this._maxValue;
    }

    /**
     * Setter for stretch
     *
     * @param {TCh5TextInputStretch} value
     */
    public set stretch(value: TCh5TextInputStretch) {

        this.info('set <ch5-textinput stretch="' + value + '"');

        if (this.stretch !== value) {
            if (value === undefined || value === null) {
                value = 'fixed';
            }
        }

        let _stretchIndex = Ch5Textinput.STRETCH.indexOf(value);

        if (_stretchIndex === -1) {
            _stretchIndex = 0;
        }

        value = Ch5Textinput.STRETCH[_stretchIndex];

        if (value !== this.stretch) {
            this.setAttribute('stretch', value);
        }

        this._stretch = value;
        this._addModifierClass(this.stretch, Ch5Textinput.STRETCH as [string]);
    }

    /**
     * Getter for stretch
     *
     * @return {TCh5TextInputStretch}
     */
    public get stretch(): TCh5TextInputStretch {

        this.info('get <ch5-textinput stretch />');

        return this._stretch;
    }

    /**
     * Setter for textTransform
     *
     * @param {TCh5TextInputTextTransform} style
     */
    public set textTransform(style: TCh5TextInputTextTransform) {

        this.info('set <ch5-textinput text-transform="' + style + '"');

        if (
            this.textTransform !== style &&
            (style === undefined || style === null)
        ){
            style = 'none';
        }

        let _styleIndex = Ch5Textinput.TEXTTRANSFORM.indexOf(style);

        if (_styleIndex === -1) {
            _styleIndex = 0;
        }

        style = Ch5Textinput.TEXTTRANSFORM[_styleIndex];

        if (style !== this.textTransform) {
            this.setAttribute('text-transform', style);
        }

        this._textTransform = style;

        // adding modifier also to the childrens
        this._addModifierClass(this.textTransform, Ch5Textinput.TEXTTRANSFORM as [string], true);
    }

    /**
     * Getter for textTransform
     *
     * @return {TCh5TextInputTextTransform}
     */
    public get textTransform(): TCh5TextInputTextTransform {

        this.info('get <ch5-textinput text-transform />');

        return this._textTransform;
    }

    /**
     * Setter for label
     *
     * @param {string} text
     */
    public set label(text: string) {

        let _label = text;
        this.info('set <ch5-textinput label="' + text + '"');

        if (
            this.label !== text &&
            (text === undefined || text === null)
        ) {
            _label = '';
        } else {
            _label = this._getTranslatedValue('label', text);
        }


        if (_label !== text) {
            this.setAttribute('label', _label);
        }
        this._label = _label;

        this._addLabel();
        this.iconPositioning();
    }

    /**
     * Getter for label
     *
     * @return {string}
     */
    public get label(): string {

        this.info('get <ch5-textinput label />');

        return this._label;
    }

    /**
     * Setter for pattern
     *
     * @param {string} value
     */
    public set pattern(value: string) {

        this.info('set <ch5-textinput pattern="' + value + '" />')

        if (
            this.pattern !== value &&
            (value === undefined || value === null)
        ) {
            value = '';
        }

        this._pattern = value;
        this._elInput.setAttribute('pattern', this.pattern);

        if (value !== null && this.hasAttribute('mask') !== false) {
            this.mask = '';
            this.removeAttribute('mask');
            this.repaint();
        }
    }

    /**
     * Getter for pattern
     *
     * @return {string}
     */
    public get pattern(): string {

        this.info('get <ch5-textinput pattern />');
        return this._pattern;
    }

    /**
     * Setter for sendEventOnChange
     *
     * @param {string} value
     */
    public set sendEventOnChange(value: string) {

        this.info('set <ch5-textinput sendEventOnChange="' + value + '"');

        if (this.sendEventOnChange !== value) {
            if (value === undefined || value === null) {
                value = '';
            }

            this.setAttribute('sendEventOnChange', value);
        }

        this._sendEventOnChange = value;
    }

    /**
     * Getter for sendEventOnChange
     *
     * @return {string}
     */
    public get sendEventOnChange(): string {

        this.info('get <ch5-textinput sendEventOnChange />');

        return this._sendEventOnChange;
    }

    /**
     * Setter for sendEventOnFocus
     *
     * @param {string} value
     */
    public set sendEventOnFocus(value: string) {

        this.info('set <ch5-textinput sendEventOnFocus="' + value + '"');

        if (this.sendEventOnFocus !== value) {
            if (value === undefined || value === null) {
                value = '';
            }

            this.setAttribute('sendEventOnFocus', value);
        }

        this._sendEventOnFocus = value;
    }

    /**
     * Getter for sendEventOnFocus
     *
     * @return {string}
     */
    public get sendEventOnFocus(): string {

        this.info('get <ch5-textinput sendEventOnFocus />');

        return this._sendEventOnFocus;
    }

    /**
     * Setter for sendEventOnBlur
     *
     * @param {string} value
     */
    public set sendEventOnBlur(value: string) {

        this.info('set <ch5-textinput sendEventOnBlur="' + value + '"');

        if (this.sendEventOnBlur !== value) {
            if (value === undefined || value === null) {
                value = '';
            }

            this.setAttribute('sendEventOnBlur', value);
        }

        this._sendEventOnBlur = value;
    }

    /**
     * Getter for sendEventOnBlur
     *
     * @return {string}
     */
    public get sendEventOnBlur(): string {

        this.info('get <ch5-textinput sendEventOnBlur />');

        return this._sendEventOnBlur;
    }

    /**
     * Setter for receiveStateFocus
     *
     * @param {string} value
     */
    public set receiveStateFocus(value: string) {

        this.info('set <ch5-textinput receivestatefocus="' + value + '"');

        if ('' === value
            || this._receiveStateFocus === value
            || null === value
            || undefined === value) {
            return;
        }

        // remove old subcription, if exist
        this.clearBooleanSignalSubscription(this._receiveStateFocus, this._receiveStateFocusSub);

        this._receiveStateFocus = value;
        this.setAttribute('receiveStateFocus', value);

        // add new subscription
        const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateFocus);
        const receiveState: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(receiveStateName);

        if (receiveState === null) {
            return;
        }

        this._receiveStateFocusSub = receiveState.subscribe((newValue: boolean) => {
            if (newValue !== undefined) {
                this.focusTheInput(newValue);
            }
        });
    }

    /**
     * Getter for receiveStateFocus
     *
     * @return {string}
     */
    public get receiveStateFocus(): string {

        this.info('get <ch5-textinput receivestatefocus />');

        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatefocus');
    }

    /**
     * Setter for receiveStateValue
     *
     * @return {string} value
     */
    public set receiveStateValue(value: string) {

        this.info('set <ch5-textinput receivestatevalue="' + value + '"');

        if ('' === value
            || this._receiveStateValue === value
            || null === value
            || undefined === value) {
            return;
        }

        // remove old subscription, if exist
        this.clearStringSignalSubscription(this._receiveStateValue, this._receiveStateValueSub);

        this._receiveStateValue = value;
        this.setAttribute('receivestatevalue', value);


        // add new subscription
        const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateValue);
        const receiveState: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveStateName);

        if (receiveState === null) {
            return
        }

        this._receiveStateValueSub = receiveState.subscribe((newValue: string) => {
            if (newValue !== null && newValue !== undefined) {
                this.updateValue(newValue, true);
            }
        });
    }

    /**
     * Getter for receiveStateValue
     *
     * @return {string}
     */
    public get receiveStateValue(): string {

        this.info('get <ch5-textinput receivestatevalue />');

        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatevalue');
    }

    /**
     * Setter for validityChangeEvent
     *
     * @param {CustomEvent} inEvent
     */
    public set validityChangeEvent(inEvent: CustomEvent) {

        this.info('set <ch5-textinput validitychangeevent');

        if (this.validityChangeEvent !== inEvent) {
            if (inEvent !== undefined && inEvent !== null) {
                this._validityChangeEvent = inEvent;
            }
        }
    }

    /**
     * Getter for validityChangeEvent
     *
     * @return {CustomEvent}
     */
    public get validityChangeEvent(): CustomEvent {

        this.info('get <ch5-textinput validitychangeevent />');

        return this._validityChangeEvent;
    }

    /**
     * Setter for _dirtyCustomEvent property
     *
     * @param {CustomEvent} inEvent
     */
    public set dirtyCustomEvent(inEvent: CustomEvent) {

        this.info('set <ch5-textinput dirtycustomevent />');

        if (this.dirtyCustomEvent !== inEvent) {
            if (inEvent !== undefined && inEvent !== null){
                this._dirtyCustomEvent = inEvent;
            }
        }
    }

    /**
     * Getter for _dirtyCustomEvent property
     *
     * @return {CustomEvent}
     */
    public get dirtyCustomEvent(): CustomEvent {

        this.info('get <ch5-textinput dirtycustomevent />');

        return this._dirtyCustomEvent;
    }

    /**
     * Setter for cleanCustomEvent
     *
     * @param {CustomEvent} inEvent
     */
    public set cleanCustomEvent(inEvent: CustomEvent) {
        this.info('set <ch5-textinput cleancustomevent />');

        if (this.cleanCustomEvent !== inEvent) {
            if (inEvent !== undefined && inEvent !== null) {
                this._cleanCustomEvent = inEvent;
            }
        }
    }

    /**
     * Getter for cleanCustomEvent
     *
     * @return {CustomEvent}
     */
    public get cleanCustomEvent(): CustomEvent {
        this.info('get <ch5-textinput cleancustomevent />');

        return this._cleanCustomEvent;
    }

    /**
     * Setter for lastValidState
     *
     * @param {boolean} state
     */
    public set lastValidState(state: boolean) {

        this.info('set <ch5-textinput lastvalidstate="' + state + '"');

        if (this.lastValidState !== state && (state === undefined || state === null)) {
            state = false;
        }

        this._lastValidState = state;
    }

    /**
     * Getter for lastValidState
     *
     * @return {boolean}
     */
    public get lastValidState(): boolean {

        this.info('get ch5-textinput lastvalidstate />');

        return this._lastValidState;
    }

    /**
     * Set value to the input
     *
     * @param {string} value
     */
    public setValue(value: string) {
        this.value = value;
        this._elInput.value = value;
    }

    /**
     * Setter for mask
     *
     * @param {string} mask
     */
    public set mask(mask: string) {

        this.info('set <ch5-textinput mask="' + mask + '"');

        if (this.mask === mask) {
            // In Angular the setter is triggered twice, but even so it does not make sense to re-init the
            // mask attribute if the value was not changed
            return;
        }

        if (this.mask !== mask && (mask === undefined || mask === null)) {
            mask = '';
        }

        this._mask = mask;
        this._elInput.setAttribute('mask',this.mask);
        this._maskInit();

        if (this.hasAttribute('placeholder')) {
            this._maskingUtility.placeholder = this.placeholder;
        }
    }

    /**
     * Getter for mask
     *
     * @return {string}
     */
    public get mask(): string {

        this.info('get <ch5-textinput mask />');

        return this._mask;
    }

    /**
     * Setter for size
     *
     * @param {TCh5TextInputSize} size
     */
    public set size(size: TCh5TextInputSize) {

        this.info('set <ch5-textinput size="' + size + '"');

        let _sizeIndex = Ch5Textinput.SIZES.indexOf(size);

        if (_sizeIndex === -1) {
            _sizeIndex = 0;
        }

        size = Ch5Textinput.SIZES[_sizeIndex];

        if (this.size !== size){

            if (size === undefined || size === null) {
                size = 'regular';
            }

            this._size = size;
            this.setAttribute('size', size);
        }

        this._addModifierClass(this.size, Ch5Textinput.SIZES as [string], true);


        if (this.scaling === true) {
            this._scalingUtility.updateDefaultFontSize();
        }
    }

    /**
     * Getter for size
     *
     * @return {TCh5TextInputSize}
     */
    public get size(): TCh5TextInputSize {

        this.info('get <ch5-textinput size />');

        return this._size;
    }

    /**
     * Setter for scaling
     *
     * @param {boolean} scale
     */
    public set scaling(scale: boolean) {

        this.info('set <ch5-textinput scaling="' + scale + '" />');

        if (
            this.scaling !== scale &&
            (scale === undefined || scale === null)
        ) {
            scale = false;
        } else if (this.scaling !== scale) {
            this.setAttribute('scaling', scale + '');
        }

        this._scaling = scale;

        /**
         * TODO Andrei Todorut
         * Create a destruct method which will detach all listeners related to scaling
         */
        if (this.scaling === true) {
            this._scalingUtility = new Ch5TextInputScaling(this._elInput);
        }
    }

    /**
     * Getter for scaling
     *
     * @return {boolean}
     */
    public get scaling(): boolean {

        this.info('get <ch5-textinput scaling />');

        return this._scaling;
    }

    /**
     * Setter for minimumFontSize
     *
     * @param {number} fontSize
     */
    public set minimumFontSize(fontSize: number) {

        this.info('set <ch5-textinput minimumfontsize="' + fontSize + '"');

        if (
            this.minimumFontSize !== fontSize &&
            (fontSize === undefined || fontSize === null)
        ) {
            fontSize = 12;

        }

        if (this.scaling === false) {
            this.scaling = true;
        }

        this._minimumFontSize = fontSize;
        this._scalingUtility.minimumFontSize = this._minimumFontSize;
    }

    /**
     * Getter for minimumFontSize
     *
     * @return {number}
     */
    public get minimumFontSize(): number {

        this.info('get <ch5-textinput minimumfontsize />');

        return this._minimumFontSize;
    }

    public set onvaliditychange(callback: HtmlCallback | (() => void)) {
        if (_.isNil(callback)) {
            callback = {} as HtmlCallback;
        }

        if (callback instanceof HtmlCallback && this.onvaliditychange instanceof Function) {
            return;
        }

        this._onvaliditychange = callback;
    }

    public get onvaliditychange(): HtmlCallback | (() => void) {
        return this._onvaliditychange;
    }

    // =============================================================
    // ========== END OF SETTERS AND GETTERS SECTION ===============
    // =============================================================

    /**
     * Submit the input
     *
     * @return {void}
     */
    public submit(): void {

        this.info('<ch5-textinput />.submit()');

        if (this.feedbackMode === 'submit' && this.getValid() === true) {

            if (this.value !== this.cleanValue && this.dirtyValue !== this.value) {
                this._onChangeSignal(this._elInput, this.value as string);
            }

            this._submitted = true;
            this._dirty = false;
            this.dirtyValue = this._elInput.value;
            this.dirtyTimerHandle();
            this._clean = true;


        }
    }

    /**
     * @return {void}
     */
    public dirtyTimerHandle(): void {

        this.info('<ch5-textinput />.dirtyTimeHandle()');

        if (this._dirtyTimerHandle !== null) {
            clearTimeout(this._dirtyTimerHandle);
        }

        this._dirtyTimerHandle = window.setTimeout(
            () => this.valueSync(),
            this.signalValueSyncTimeout as number
        );

    }

    /**
     * @return {void}
     */
    public valueSync(): void {

        this.info('<ch5-textinput />.valueSync()');

        this._dirtyTimerHandle = null;

        if (this._elInput.value !== this.cleanValue) {

            this._createCleanCustomEvent();
            this.dispatchEvent(this.cleanCustomEvent);
            this.runEventHandlers('clean', this.cleanCustomEvent);

            this.value = Ch5Common.handlingTextTransformValue(this.cleanValue as string, this.textTransform);
            this._elInput.value = this.value + '';
            this._clean = true;
            this._dirty = false;

            if (this.mask !== '' && this._maskingUtility.constructor === Ch5tTextInputMask) {

                const lastValueLength = this._maskingUtility.lastValueLength;
                const valueLength = (this.value as string).length;
                this._maskingUtility.dispatchMaskUpdateEvent();

                for (let i = lastValueLength; i >= valueLength; i--) {
                    this._maskingUtility._updateCharactersInMask();
                    this._maskingUtility.lastValueLength--;
                }

                if ((this.value as string).length === 0) {
                    const focusEvent = new Event('focus');
                    this._elInput.dispatchEvent(focusEvent);
                }
            }
        }
    }

    public getCssClassDisabled() {
        return this.cssClassPrefix + '--disabled';
    }

    /**
     * Reset the input
     *
     * @return {void}
     */
    public reset() {
        this.info('<ch5-textinput />.reset()');
        this._clean = true;
        this._dirty = false;
        this.value = this._cleanValue;
        this._elInput.value = this.value + '';

        this._createCleanCustomEvent();
        this.dispatchEvent(this.cleanCustomEvent);

        if (this.onclean instanceof HtmlCallback) {
            this.onclean.run({} as Event);
        } else if (this.onclean instanceof Function) {
            this.onclean();
        }

    }

    /**
     * Update the input value
     *
     * @param {string} value
     */
    public updateValue(value: string, signalResult: boolean = false) {
        this.info('<ch5-textinput />.updateValue(' + value + ')');
        this.dirtyValue = value;
        this.value = this._elInput.value = value;

        if (signalResult === true) {
            this.cleanValue = value;
        }

        this._elInput.setAttribute('value', this.cleanValue + '');
    }

    /**
     * Focus the input, basically used along with signals
     *
     * @param {boolean} value
     */
    public focusTheInput(value: boolean) {
        this.info('<ch5-textinput />.focusTheInput(' + value + ')');
        if (value === undefined || value === null) {
            value = false;
        }

        if (value === true) {
            this._elInput.focus();
        } else {
            this._elInput.blur();
        }
    }

    /**
     * Get the valid property from the input
     *
     * @return {boolean}
     */
    public getValid(): boolean {

        return this._elInput.validity.valid &&
            !this._elInput.validity.tooLong &&
            !this._elInput.validity.tooShort;
    }

    public _onKeyPress(inEvent: Event) {
        this.info("<ch5-textinput />._onKeyUp()");

        if (this.feedbackMode === 'direct') {

            const currentElement = inEvent.currentTarget as HTMLInputElement;

            this._dirty = true;
            this._clean = false;
            this.dirtyValue = currentElement.value
        }

    }

    /**
     * @param {Event} inEvent
     */
    public _onChange(inEvent: Event) {
        this.info("<ch5-textinput />._onChange()");
        const currentElement = inEvent.currentTarget as HTMLInputElement;

        this.value = (inEvent.currentTarget as HTMLInputElement).value;
        this._dirty = true;
        this._clean = false;

        if (this.feedbackMode === 'direct') {
            this._onChangeSignal(currentElement, currentElement.value);
            this.dirtyTimerHandle();
        }

        if (this.feedbackMode === 'submit') {
            this._createValidityChangeEvent(currentElement.value);
            this._createDirtyCustomEvent(currentElement.value);

            // dispatch dirty event
            (currentElement as HTMLElement).dispatchEvent(this.dirtyCustomEvent as CustomEvent);
            this.runEventHandlers('dirty', this.dirtyCustomEvent);

            if (this.lastValidState !== this.getValid()) {
                // dispatch validitychange event
                (currentElement as HTMLElement).dispatchEvent(this.validityChangeEvent as CustomEvent);

                if (this.onvaliditychange instanceof HtmlCallback) {
                    this.onvaliditychange.run(this.validityChangeEvent);
                } else if (this.onvaliditychange instanceof Function) {
                    this.onvaliditychange.call(this, this.validityChangeEvent);
                }
            }

            this.lastValidState = this.getValid();
        }
        this.highlightInputIfNotValid();
    }

    /**
     *
     * @param {Event} inEvent
     */
    public _onFocus(inEvent: Event) {

        this.info("<ch5-textinput />._onFocus()");

        if (this.lastValidState === undefined || this.lastValidState === null) {
            this.lastValidState = this.getValid();
        }

        let sigClick;

        this.classList.add(this.primaryCssClass + '--focused');

        if (
            this.sendEventOnFocus !== '' &&
            (this.sendEventOnFocus !== undefined || this.sendEventOnFocus !== null)
        ) {
            sigClick = Ch5SignalFactory
                .getInstance()
                .getBooleanSignal(this.sendEventOnFocus);

            if (sigClick !== null) {
                sigClick.publish(true);
                sigClick.publish(false);
            }
        }

        this.highlightInputIfNotValid();
    }

    /**
     *
     * @param {Event} inEvent
     */
    public _onBlur(inEvent: Event) {
        this.info("<ch5-textinput />._onBlur()");

        let sigClick;

        this.classList.remove(this.primaryCssClass + '--focused');

        if (
            this.sendEventOnBlur !== '' &&
            (this.sendEventOnBlur !== undefined || this.sendEventOnBlur !== null)
        ) {
            sigClick = Ch5SignalFactory
                .getInstance()
                .getBooleanSignal(this.sendEventOnBlur);

            if (sigClick !== null) {
                sigClick.publish(true);
                sigClick.publish(false);
            }
        }

        this.highlightInputIfNotValid();
    }

    /**
     * Sending signal on change event
     *
     * @param {HTMLElement} currentElement
     * @param {string} value
     */
    protected _onChangeSignal(currentElement: HTMLElement, value: string) {
        let sigClick;

        if ('' !== this.sendEventOnChange
            && undefined !== this.sendEventOnChange
            && null !== this.sendEventOnChange) {

            sigClick = Ch5SignalFactory.getInstance()
                .getStringSignal(this.sendEventOnChange);

            if (sigClick !== null) {
                sigClick.publish(Ch5Common.handlingTextTransformValue(value, this.textTransform));
            }
        }
    }

    /**
     * Method clearComponentContent clean the content of component
     * before creating view for ch5-textinput
     */
    protected clearComponentContent() {
        const containers = this.getElementsByClassName(this.cssClassPrefix + Ch5Textinput.COMPONENT_CONTENT_POSTFIX);
        Array.from(containers).forEach((container) => {
            container.remove();
        })
    }

    /**
     * Generate the inner markup
     *
     * @return void
     */
    protected createInternalHTML() {
        this.info("<ch5-textinput />.createInternalHTML()");
        this.clearComponentContent();
        this.classList.add(this.primaryCssClass);

        this._elIcon = document.createElement('i');
        this._elIcon.classList.add(this.cssClassPrefix + '__icon');

        this._elInput = document.createElement('input');
        this._elInput.classList.add(this.cssClassPrefix + '__input');

        this._assetsWrapper = document.createElement('div');
        this._assetsWrapper.classList.add(this.cssClassPrefix + Ch5Textinput.COMPONENT_CONTENT_POSTFIX);

        this._assetsWrapper.appendChild(this._elInput);

        this.appendChild(this._assetsWrapper);

        this.info('END: Rendering has been finished');
    }

    /**
     * Decide where the icon has to be ( left || right side of the input)
     *
     * @protected
     * @memberof Ch5Textinput
     * @see iconPositioningHandler()
     * @return {void}
     */
    protected iconPositioning(): void {

        this.info("<ch5-textinput />.iconPositioning()");

        if (
            this.icon !== undefined &&
            this.icon !== '' &&
            (this._elInput !== undefined || this._elInput !== null)
        ) {
            this.iconPositioningHandler();
        }
    }

    /**
     * Handles the icon positioning
     *
     * @protected
     * @memberof Ch5Textinput
     * @return {void}
     */
    protected iconPositioningHandler(): void {
        this.info("<ch5-textinput />.iconPositioningHandler()");

        if (this._elIcon.constructor === HTMLElement) {
            this._elIcon.remove();
        }

        if (this.iconPosition === Ch5Textinput.ICONPOSITION[1]){
            this._assetsWrapper.appendChild(this._elIcon);
        } else {
            (this._elInput.parentNode as HTMLElement).insertBefore(
                this._elIcon, this._elInput);
        }
    }

    /**
     * First initialization of attributes
     *
     * @protected
     * @memberof Ch5Textinput
     * @return {void}
     */
    protected initAttributes() {

        super.initAttributes();

        this.inputType = this.getAttribute('type') as TCh5TextInputType;
        this.size = this.getAttribute('size') as TCh5TextInputSize;
        this.stretch = this.getAttribute('stretch') as TCh5TextInputStretch;
        this.value = this._elInput.value = this.getAttribute('value') as string;

        this.info("<ch5-textinput />.initAttributes()");

        if (!this.hasAttribute('type')) {
            this.setAttribute('type', this.inputType);
        }

        if (this.inputType === 'text') {
            this.textTransform = this.getAttribute('text-transform') as TCh5TextInputTextTransform;
        }

        if (this.hasAttribute('placeholder')) {
            this.placeholder = this.getAttribute('placeholder') as string;
        }

        if (this.hasAttribute('value')) {
            this.value = this.getAttribute('value') as string;
            this.cleanValue = this.value;
        }

        // TODO: mask and pattern attributes must be implemented

        if (this.hasAttribute('icon')) {

            this.icon = this.getAttribute('icon') as string;
            this.iconPosition = this.getAttribute('iconPosition') as TCh5TextInputIconPosition;
            this.setAttribute('iconPosition', this.iconPosition);
            this.iconPositioning();
            this._addModifierClass(this.size, Ch5Textinput.SIZES as [string], true);
        }

        if (this.hasAttribute('label')) {
            this.label = this.getAttribute('label') as string;
        }

        if (this.hasAttribute('pattern')) {
            this.pattern = this.getAttribute('pattern') as string;
        }

        if (this.feedbackMode === 'submit' && this.hasAttribute('minlength')) {
            this.minLength = Number(this.getAttribute('minlength')) as number;
        }

        if (this.feedbackMode === 'submit' && this.hasAttribute('maxlength')) {
            this.maxLength = Number(this.getAttribute('maxlength')) as number;
        }

        if (this.inputType === 'number' && this.feedbackMode === 'submit') {
            if (this.hasAttribute('minValue')) {
                this.minValue = Number(this.getAttribute('minvalue')) as number;
            }

            if (this.hasAttribute('maxValue')) {
                this.maxValue = Number(this.getAttribute('maxvalue')) as number;
            }
        }

        if (this.hasAttribute('scaling')) {
            const scaling = this.getAttribute('scaling') === 'false' ? false : true;
            this.scaling = scaling;
        }

        if (this.hasAttribute('minimumfontsize')) {
            this.minimumFontSize = Number(this.getAttribute('minimumfontsize'));
        }

        if (this.hasAttribute('mask') && !this.hasAttribute('pattern')) {
            this.mask = this.getAttribute('mask') as string;

        }

        // =================================================================
        // ===================== SIGNALS SETUP =============================
        // =================================================================

        if (this.hasAttribute('sendeventonchange')) {
            this.sendEventOnChange = this.getAttribute('sendeventonchange') as string;
        }

        if (this.hasAttribute('sendeventonfocus')) {
            this.sendEventOnFocus = this.getAttribute('sendeventonfocus') as string;
        }

        if (this.hasAttribute('sendeventonblur')) {
            this.sendEventOnBlur = this.getAttribute('sendeventonblur') as string;
        }

        if (this.hasAttribute('receivestatefocus')) {
            this.receiveStateFocus = this.getAttribute('receivestatefocus') as string;
        }

        if (this.hasAttribute('receivestatevalue')) {
            this.receiveStateValue = this.getAttribute('receivestatevalue') as string;
        }

        if (this.hasAttribute('onvaliditychange')) {
            this.onvaliditychange = new HtmlCallback(this, this.getAttribute('onvaliditychange') as string);
        }
    }

    /**
     * Attach event listeners to the elements
     *
     * @protected
     * @memberof Ch5TextInput
     * @return {void}
     */
    protected attachEventListeners(): void {
        this.info("<ch5-textinput />.attachEventListeners()");
        
        this.removeEvents();
        this._onChangeListener = this._onChange.bind(this);
        this._onBlurListener = this._onBlur.bind(this);
        this._onFocusListener = this._onFocus.bind(this);
        this._onKeyPressListener = this._onKeyPress.bind(this);

        this._elInput.addEventListener('keyup', this._onChangeListener);
        this._elInput.addEventListener('focus', this._onFocusListener);
        this._elInput.addEventListener('blur', this._onBlurListener);
        this._elInput.addEventListener('input', this._onKeyPressListener);
    }

    /**
     * Detach the events
     * Used when the element is detached from the DOM
     *
     * @protected
     * @memberof Ch5Textinput
     * @return {void}
     */
    protected removeEvents(): void {
        this.info("<ch5-textinput />.removeEvents()");

        super.removeEventListeners();

        if (_.isElement(this._elInput)) {
            this._elInput.removeEventListener('keyup', this._onChangeListener);
            this._elInput.removeEventListener('focus', this._onFocusListener);
            this._elInput.removeEventListener('blur', this._onBlurListener);
            this._elInput.removeEventListener('input', this._onKeyPressListener);
        }
    }

    /**
     * Mask functionality
     *
     * @private
     * @memberof Ch5Textinput
     * @return {void}
     */
    private _maskInit(): void {
        this.info("<ch5-textinput />._maskInit()");

        this._maskingUtility = new Ch5tTextInputMask(this._elInput, this.mask);
        this._maskingUtility.init();
    }

    /**
     * Create the validityChange event
     *
     * @private
     * @memberof Ch5Textinput
     * @param {string} message
     * @return void
     */
    private _createValidityChangeEvent(message: string): void {
        this.info("<ch5-textinput />._createValidityChangeEvent(" + message + ")");

        this.validityChangeEvent = this._createCustomEvent('validitychange', message);
    }

    /**
     * @private
     * @memberof Ch5Textinput
     * @param {string} message
     * @return {void}
     */
    private _createDirtyCustomEvent(message: string): void {
        this.info("<ch5-textinput />._createDirtyCustomEvent(" + message + ")");

        this.dirtyCustomEvent = this._createCustomEvent('dirty', message);
    }

    private _createCleanCustomEvent(): void {
        this.info("<ch5-textinput />._createCleanCustomEvent()");

        this.cleanCustomEvent = this._createCustomEvent('clean');
    }

    /**
     *
     * @private
     * @memberof Ch5Textinput
     * @param {string} eventName
     * @param {string} message
     * @return {CustomEvent}
     */
    private _createCustomEvent(eventName: string, message: string = ''): CustomEvent {
        this.info("<ch5-textinput />._createCustomEvent(" + eventName + "," + message + ")");

        const event = new CustomEvent(eventName, {
            detail: {
                message,
                time: new Date()
            },
            bubbles: true,
            cancelable: true
        });

        return event;
    }

    /**
     * @private
     * @memberof Ch5Textinput
     * @return {void}
     */
    private _addLabel(): void {
        this.info("<ch5-textinput />._addLabel()");

        if (this.querySelector('label') === null) {
            this._labelElement = document.createElement('label');
            this._labelElement.innerHTML = this.label;
            this._labelElement.classList.add(this.cssClassPrefix + '__label');

            let element: HTMLElement = this._assetsWrapper as HTMLElement;

            if (this._elIcon !== undefined && this._elIcon.constructor === HTMLLabelElement) {
                element = this._elIcon as HTMLElement;
            }

            (element.parentNode as HTMLElement).insertBefore(this._labelElement, element);
        } else if (this._labelElement instanceof HTMLElement) {
            this._labelElement.innerHTML = this.label;
        }
    }

    /**
     *
     * @param {string} className the segment after '--' separator
     * @param {string} toChildrens set the modifier class also to childrens
     * @param {[string]} staticClasses contains the classes list
     * @return {void}
     */
    private _addModifierClass(className: string, staticClasses: [string], toChildrens: boolean = false): void {
        this.info("<ch5-textinput />._addModifierClass(" + className + "," + toChildrens + ")");

        this._removeModifierClass(staticClasses as [string]);
        this.classList.add(this.cssClassPrefix + '--' + className);

        if (toChildrens === true) {
            this._elInput.classList.add(this.cssClassPrefix + '__input--' + className);
            this._assetsWrapper.classList.add(this.cssClassPrefix + '__assets--' + className);

            if (this._labelElement !== undefined && this._labelElement.constructor === HTMLLabelElement) {
                this._labelElement.classList.add(this.cssClassPrefix + '__label--' + className);
            }

            if (this._elIcon !== undefined && this._elIcon.constructor === HTMLElement) {
                this._elIcon.classList.add(this.cssClassPrefix + '__icon--' + className);
            }
        }
    }

    /**
     * Reset modifiers when set a new modifier class
     *
     * @param {[string]} classes
     */
    private _removeModifierClass(classes: [string]): void {

        this.info('<ch5-textinput />._removeModifierClass()');

        classes.forEach((className) => {
            this.classList.remove(this.cssClassPrefix + '--' + className);
            this._elInput.classList.remove(this.cssClassPrefix + '__input--' + className);
            if (this._labelElement !== undefined && this._labelElement.constructor === HTMLLabelElement) {
                this._labelElement.classList.remove(this.cssClassPrefix + '__label--' + className);
            }

            if (this._elIcon.constructor === HTMLElement) {
                this._elIcon.classList.remove(this.cssClassPrefix + '__icon--' + className);
            }
        })

    }

    /**
     * Adding aria-* attributes
     *
     * @return {void}
     */
    private _addAriaAttributes() {

        this._elInput.setAttribute('aria-placeholder', this.placeholder);
        this._elInput.setAttribute('aria-multiline', 'false');
        this._elInput.setAttribute('role', 'textbox');

        if (this.required === true) {
            this._elInput.setAttribute('aria-required', 'true');
        } else {
            this._elInput.setAttribute('aria-required', 'false');
        }

        if (this._labelElement.constructor === HTMLLabelElement) {
            this._labelElement.setAttribute('aria-label', this.label);
            this._elInput.setAttribute('aria-labeledby', this.label);
        }

        if (this._elIcon.constructor === HTMLElement) {
            this._elIcon.setAttribute('role', 'icon');
        }
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-textinput', Ch5Textinput);
}

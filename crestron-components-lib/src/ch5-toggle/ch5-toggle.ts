// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory, Ch5Uid } from "../ch5-core";
import { Ch5CommonInput } from "../ch5-common-input/ch5-common-input";

import HtmlCallback from "../ch5-common/utils/html-callback";
import { Ch5MutationObserver } from "../ch5-common/ch5-mutation-observer";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5ToggleAttributes, TCh5ToggleShape, TCh5ToggleOrientation, TCh5ToggleFeedbackMode } from "./interfaces";

export class Ch5Toggle extends Ch5CommonInput implements ICh5ToggleAttributes {

    /**
     * The first value is considered the default one
     */
    public static SHAPES: TCh5ToggleShape[] = ['circle', 'rectangle'];
    /**
     * The first value is considered the default one
     */
    public static ORIENTATIONS: TCh5ToggleOrientation[] = ['horizontal', 'vertical'];
    /**
     * The first value is considered the default one
     */
    public static MODES: TCh5ToggleFeedbackMode[] = ['direct', 'submit'];

    public static readonly COMPONENT_DATA: any = {
        SHAPES: {
            default: Ch5Toggle.SHAPES[0],
            values: Ch5Toggle.SHAPES,
            key: 'shape',
            classListPrefix: 'ch5-toggle--'
        },
        ORIENTATIONS: {
            default: Ch5Toggle.ORIENTATIONS[0],
            values: Ch5Toggle.ORIENTATIONS,
            key: 'orientation',
            classListPrefix: 'ch5-toggle--'
        },
        MODES: {
            default: Ch5Toggle.MODES[0],
            values: Ch5Toggle.MODES,
            key: 'mode',
            classListPrefix: 'ch5-toggle--'
        },
        DIRECTION: {
            default: Ch5Common.DIRECTION[0],
            values: Ch5Common.DIRECTION,
            key: 'mode',
            classListPrefix: 'ch5-toggle--dir--'
        },
    };

    /**
     * Component internal HTML elements
     */
    private _elBody: HTMLElement = {} as HTMLElement;
    private _elContainer: HTMLElement = {} as HTMLElement;
    private _elLabel: HTMLElement = {} as HTMLElement;
    private _elHandle: HTMLElement = {} as HTMLElement;
    private _elOnContainer: HTMLElement = {} as HTMLElement;
    private _elLabelOn: HTMLElement = {} as HTMLElement;
    private _elIconOn: HTMLElement = {} as HTMLElement;
    private _elOffContainer: HTMLElement = {} as HTMLElement;
    private _elLabelOff: HTMLElement = {} as HTMLElement;
    private _elIconOff: HTMLElement = {} as HTMLElement;
    private _elKnob: HTMLElement = {} as HTMLElement;


    /**
     * CSS classes
     */
    public primaryCssClass = 'ch5-toggle';
    public cssClassPrefix = 'ch5-toggle';


    /**
     * COMPONENT ATTRIBUTES
     *
     * - label
     * - labelOn
     * - labelOff
     * - iconOn
     * - iconOff
     * - handleShape
     * - value
     * - signalValueSyncTimeout
     * - feedbackMode
     */

    /**
     * Label value
     *
     * @type {string}
     * @private
     * @memberof Ch5Toggle
     */
    private _label: string = '';

    /**
     * On label, if different than label
     *
     * @type {string}
     * @private
     * @memberof Ch5Toggle
     */
    private _labelOn: string = '';

    /**
     * Off label, if different than label
     *
     * @type {string}
     * @private
     * @memberof Ch5Toggle
     */
    private _labelOff: string = '';

    /**
     * On Icon class
     *
     * @type {string}
     * @private
     * @memberof Ch5Toggle
     */
    private _iconOn: string = '';

    /**
     * Off Icon class
     *
     * @type {string}
     * @private
     * @memberof Ch5Toggle
     */
    private _iconOff: string = '';

    /**
     * Default circle. Handle Shape. That will also determine the shape of the component ( rectangle or circle )
     *
     * @type {TCh5ToggleShape}
     * @private
     * @memberof Ch5Toggle
     */
    private _handleShape: TCh5ToggleShape = 'circle';

    /**
     * Default Horizontal. Orientation
     *
     * @private
     * @type {TCh5ToggleOrientation}
     * @memberof Ch5Toggle
     */
    private _orientation: TCh5ToggleOrientation = 'horizontal';

    /**
     * toggle direction support
     */
     private _direction: string = Ch5Common.DIRECTION[0];

    /**
     * Default false, Initial value of the component.
     * When feedbackMode= submit, this property will change to the last value submit.
     * When reset, the value property will be change to the initial value or last value on submit
     *
     * @private
     * @type {boolean}
     * @memberof Ch5Toggle
     */
    protected _value: boolean = false;

    /**
     * COMPONENT RECEIVE SIGNALS
     *
     * - receiveStateValue
     * - receiveStateScriptLabelHtml
     */

    /**
     * The name of a string signal that will be applied to the value
     *
     * HTML attribute name: receiveStateValue or receivestatevalue
     */
    private _sigNameReceiveValue: string = '';

    /**
     * The subscription id for the receiveStateValue signal
     */
    private _subReceiveValueId: string = '';

    /**
     * The name of the string signal for which the value will be applied to the component's label innerHtml
     *
     * HTML attribute name: receiveStateScriptLabelHtml or receivestatescriptlabelhtml
     */
    private _sigNameReceiveScriptLabelHtml: string = '';

    /**
     * The subscription id for the receiveStateScriptLabelHtml signal
     */
    private _subReceiveScriptLabelHtmlId: string = '';


    /**
     * COMPONENT SEND SIGNALS
     *
     * - sendEventOnClick
     */

    /**
     * The name of the boolean signal that will be sent to native on click or tap event (mouse or finger up and down in
     * a small period of time)
     *
     * HTML attribute name: sendEventOnClick or sendeventonclick
     */
    private _sigNameSendOnClick: string = '';


    /**
     * COMPONENT EVENTS
     *
     * change - custom event.
     * click - inerhit
     * focus - custom
     * blur - custom
     * dirty - custom
     */

    /**
     * Event change: Fires when the component's `checked` value changes due to user interaction.
     */
    public changeEvent: Event = {} as Event;


    /**
     * Event dirty: Fires when the component is on feedbackMode='submit' and displayed value is different than the actual value
     */
    public dirtyEvent: Event = {} as Event;

    /**
     * Event clean: Fires when the component is on feedbackMode='submit' and displayed value is the actual value
     */
    public cleanEvent: Event = {} as Event;

    /**
     * The dirty value flag must be initially set to false when the element is created,
     * and must be set to true whenever the user interacts with the control in a way that changes the value.
     * @private
     * @type {boolean}
     */
    protected _dirty: boolean = false;

    /**
     * The clean value flag must be initially set to true when the element is created,
     * and must be set to false whenever the user interacts with the control in a way that changes the value.
     * @private
     * @type {boolean}
     */
    protected _clean: boolean = true;

    /**
     * The submitted flag must be set to false when the element is created
     * and must be set to true whenerer the user submit the control
     * @private
     * @type {boolean}
     */
    protected _submitted: boolean = false;

    /**
     * Last value set by user
     * @private
     * @type {(boolean|string)}
     */
    protected _dirtyValue: boolean | string = '';

    /**
     * Initial value or last value received from signal
     * @private
     * @type {(boolean|string)}
     */
    protected _cleanValue: boolean | string = '';

    /**
     * Defines the timeout between the user click the toggle and the time the toggle will check if the value is equal with the value from the signal
     * @private
     * @type {(number|null)}
     */
    protected _dirtyTimerHandle: number | null = null;


    /**
     * ATTR GETTERS AND SETTERS
     */

    /**
     * Getter label
     * @return {string }
     */
    public get label(): string {
        return this._label;
    }

    /**
     * Setter label
     * @param {string } value
     */
    public set label(value: string) {

        let _value = value;
        if ('' !== value
            && undefined !== value
            && null !== value) {

            _value = this._getTranslatedValue('label', value);

            this._elLabel.innerHTML = value;
            this._elLabel.hidden = false;
            this._label = _value;

            if (_value !== value) {
                this.setAttribute('label', _value);
            }
        }
    }

    /**
     * Getter labelOn
     * @return {string }
     */
    public get labelOn(): string {
        return this._labelOn;
    }

    /**
     * Setter labelOn
     * @param {string } value
     */
    public set labelOn(value: string) {

        let _value = value;

        if (value === undefined || value === null) {
            _value = '';
        } else {
            _value = this._getTranslatedValue('labelOn', value);
        }

        this._elLabelOn.innerText = _value;
        this._labelOn = _value;

        if (_value !== value) {
            this.setAttribute('labelon', _value);
        }

    }

    /**
     * Getter labelOff
     * @return {string }
     */
    public get labelOff(): string {
        return this._labelOff;
    }

    /**
     * Setter labelOff
     * @param {string } value
     */
    public set labelOff(value: string) {

        let _value = value;

        if (value === undefined || value === null) {
            _value = '';
        }  else {
            _value = this._getTranslatedValue('labelOff', value);
        }

        this._elLabelOff.innerText = _value;
        this._labelOff = _value;

        if (_value !== value) {
            this.setAttribute('labeloff', _value);
        }
    }

    /**
     * Getter iconOn
     * @return {string }
     */
    public get iconOn(): string {
        return this._iconOn;
    }

    /**
     * Setter iconOn
     * @param {string } value
     */
    public set iconOn(value: string) {
        if (this._iconOn !== value) {
            if ('' !== this.iconOn) {
                this._iconOn.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        this._elIconOn.classList.remove(className); // remove previous class
                    }
                });
            }

            this._iconOn = value;
            if ('' !== this.iconOn) {
                this._iconOn.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        this._elIconOn.classList.add(className); // adds the new icon class if present
                    }
                });
            }

            this.setAttribute('iconon', value);
        }
    }

    /**
     * Getter iconOff
     * @return {string }
     */
    public get iconOff(): string {
        return this._iconOff;
    }

    /**
     * Setter iconOff
     * @param {string } value
     */
    public set iconOff(value: string) {
        if (this._iconOff !== value) {
            if ('' !== this.iconOff) {
                this._iconOff.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        this._elIconOff.classList.remove(className); // remove previous class
                    }
                });
            }

            this._iconOff = value;
            if ('' !== this.iconOff) {
                this._iconOff.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        this._elIconOff.classList.add(className); // adds the new icon class if present
                    }
                });
            }

            this.setAttribute('iconoff', value);
        }
    }

    /**
     * Getter handleShape
     * @return {TCh5ToggleShape }
     */
    public get handleShape(): TCh5ToggleShape {
        return this._handleShape;
    }

    /**
     * Setter handleShape
     * @param {TCh5ToggleShape } value
     */
    public set handleShape(value: TCh5ToggleShape) {
        if (this._handleShape !== value && value !== null) {
            if (Ch5Toggle.SHAPES.indexOf(value) >= 0) {
                this._handleShape = value;
            } else {
                this._handleShape = Ch5Toggle.SHAPES[0];
            }

            this.setAttribute('handleshape', this._handleShape);
        }
    }

    /**
     * Getter orientation
     * @return {TCh5ToggleOrientation }
     */
    public get orientation(): TCh5ToggleOrientation {
        return this._orientation;
    }

    /**
     * Setter orientation
     * @param {TCh5ToggleOrientation } value
     */
    public set orientation(value: TCh5ToggleOrientation) {
        if (this._orientation !== value) {
            if (Ch5Toggle.ORIENTATIONS.indexOf(value) >= 0) {
                this._orientation = value;
            } else {
                this._orientation = Ch5Toggle.ORIENTATIONS[0];
            }

            this.setAttribute('orientation', this._orientation);
        }
    }


    /**
     * Getter value
     */
    public get value() {
        return this._value;
    }

    /**
     * Setter value
     * @param {boolean} value
     */
    public set value(value: boolean) {
        const booleanValue = this._toBoolean(value);

        if (this._dirtyTimerHandle !== null) {
            clearTimeout(this._dirtyTimerHandle);
        }

        if (this._value !== booleanValue) {
            this._value = booleanValue;
            this.setAttribute('value', this._value.toString());
        }
    }

    /**
     * States whether or not this element is checked.
     */
    public get checked() {
        return this.hasAttribute('checked');
    }

    /**
     * Setter for `checked`.
     *
     * @public
     * @param {boolean} value
     *   If truthy, `checked` will be set to true, otherwise `checked` will be set to false.
     */
    public set checked(value: boolean | string) {
        const isChecked = this._toBoolean(value);

        if (isChecked) {
            this.setAttribute('checked', '');
            this._elBody.classList.add(this.primaryCssClass + '--on')
        } else {
            this.removeAttribute('checked');
            this._elBody.classList.remove(this.primaryCssClass + '--on')
        }
    }

    public get direction() {
        return this._direction;
    }

    public set direction(value: string | null) {
        if (value == null) {
            value = Ch5Common.DIRECTION[0];
        }
        if (Ch5Common.DIRECTION.indexOf(value) >= 0) {
            this._direction = value;
        }
        else {
            this._direction = Ch5Common.DIRECTION[0];
        }
    }

    /**
     * RECEIVED SIGNALS GETTERS AND SETTERS
     */

    /**
     * Getter receiveStateValue
     * @type {string}
     * @memberof Ch5Toggle
     */
    public get receiveStateValue(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatevalue');
    }

    /**
     * Setter receiveStateValue
     * @memberof Ch5Toggle
     */
    public set receiveStateValue(value: string) {
        this.info('Ch5Toggle receiveStateValue: ' + value);

        if ('' === value
            || this._sigNameReceiveValue === value
            || null === value
            || undefined === value) {
            return;
        }

        // clean up old subscription
        if (this._sigNameReceiveValue !== ''
            && this._sigNameReceiveValue !== undefined
            && this._sigNameReceiveValue !== null) {

            const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveValue);
            const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
                .getBooleanSignal(oldSignalName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveValueId);
            }
        }

        // setup new subscription.
        this._sigNameReceiveValue = value;
        this.setAttribute('receivesignalvalue', value);

        const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveValue);
        const receiveState: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(receiveStateName);

        if (receiveState === null) {
            return;
        }

        this._subReceiveValueId = receiveState.subscribe((newValue: boolean) => {
            this.setAttribute('value', '' + newValue);
            this._cleanValue = newValue;

            this.checked = newValue;

            // set ch5-toggle as clean
            this.setClean();
        });
    }

    /**
     * Getter receiveStateScriptLabelHtml
     * @type {string}
     * @memberof Ch5Toggle
     */
    public get receiveStateScriptLabelHtml(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatescriptlabelhtml');
    }

    /**
     * Setter receiveStateScriptLabelHtml
     * @memberof Ch5Toggle
     */
    public set receiveStateScriptLabelHtml(value: string) {
        this.info('set receiveStateScriptLabelHtml(\'' + value + '\')');
        if ('' === value
            || this._sigNameReceiveScriptLabelHtml === value
            || null === value
            || undefined === value) {
            return;
        }

        // clean up old subscription
        if (this._sigNameReceiveScriptLabelHtml !== ''
            && this._sigNameReceiveScriptLabelHtml !== undefined
            && this._sigNameReceiveScriptLabelHtml !== null) {

            const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSignalName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceiveScriptLabelHtmlId);
            }
        }

        // setup new subscription.
        this._sigNameReceiveScriptLabelHtml = value;
        this.setAttribute('receivestatescriptlabelhtml', value);

        const receiveSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveSignalName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceiveScriptLabelHtmlId = receiveSignal.subscribe((newValue: string) => {
            if ('' !== newValue && newValue !== this._label) {
                this.setAttribute('label', newValue)
            }
        });
    }

    /**
     * SEND SIGNALS GETTERS AND SETTERS
     */
    public get sendEventOnClick(): string {
        return this._sigNameSendOnClick;
    }

    public set sendEventOnClick(value: string) {
        this.info('set sendEventOnClick(\'' + value + '\')');
        if ('' === value ) {
            return;
        }

        if (this._sigNameSendOnClick !== value) {
            this._sigNameSendOnClick = value;

            this.setAttribute('sendeventonclick', value)
        }
    }


    /**
     * CONSTRUCTOR
     */
    constructor() {
        super();

        this._listOfAllPossibleComponentCssClasses = this._generateListOfAllPossibleComponentCssClasses();
        this.createInternalHtml();

        this._onClick = this._onClick.bind(this);
    }

    /**
     * Called every time the element is inserted into the DOM.
     * Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {

        this.contentCleanUp();

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5Toggle);
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

        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());
        this.cacheComponentChildrens();

        if (this._elBody.parentElement !== this) {
            this.appendChild(this._elBody);
        }

        this.initAttributes();
        this.updateCssClasses();
        this.attachEventListeners();

        this.initCommonMutationObserver(this);

        this._cleanValue = this.value;
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

    /**
     * Respond to attribute changes.
     *
     * @readonly
     * @static
     */
    static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;
        const commonInputAttributes = Ch5CommonInput.observedAttributes;
        const ch5ToggleAttributes: string[] = [
            // attributes
            'checked',
            'label',
            'labelon',
            'labeloff',
            'iconon',
            'iconoff',
            'handleshape',
            'orientation',
            'value',
            'signalvaluesynctimeout',
            'dir',

            // receive signals
            'receivestatevalue',
            'receivestatescriptlabelhtml',

            // send signals
            'sendeventonclick'

        ];

        return commonAttributes.concat(ch5ToggleAttributes, commonInputAttributes);
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     *
     * @param {string} attr
     * @param {string} oldValue
     * @param {string} newValue
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }
        this.info('ch5-toggle attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');
        const hasValue = newValue !== null;

        switch (attr) {
            case 'checked':
                if (this.hasAttribute('checked')) {
                    this.value = true;
                } else {
                    this.value = false;
                }
                this.setAttribute('aria-checked', hasValue.toString());
                break;
            case 'label':
                if (this.hasAttribute('label')) {
                    this.label = newValue;
                } else {
                    this.label = '';
                }
                break;
            case 'labelon':
                if (this.hasAttribute('labelon')) {
                    this.labelOn = newValue;
                } else {
                    this.labelOn = '';
                }
                break;
            case 'labeloff':
                if (this.hasAttribute('labeloff')) {
                    this.labelOff = newValue;
                } else {
                    this.labelOff = '';
                }
                break;
            case 'iconon':
                if (this.hasAttribute('iconon')) {
                    this.iconOn = newValue;
                } else {
                    this.iconOn = '';
                }
                break;
            case 'iconoff':
                if (this.hasAttribute('iconoff')) {
                    this.iconOff = newValue;
                } else {
                    this.iconOff = '';
                }
                break;
            case 'handleshape':
                if (this.hasAttribute('handleshape')) {
                    this.handleShape = newValue as TCh5ToggleShape;
                } else {
                    this.handleShape = Ch5Toggle.SHAPES[0];
                }
                this.updateCssClasses();
                break;
            case 'orientation':
                if (this.hasAttribute('orientation')) {
                    this.orientation = newValue as TCh5ToggleOrientation;
                } else {
                    this.orientation = Ch5Toggle.ORIENTATIONS[0];
                }
                this.updateCssClasses();
                break;
            case 'value':
                if (this.hasAttribute('value')) {
                    this.value = this.checkIfValueIsTruey(newValue);
                    this.checked = newValue;
                } else {
                    this.value = false;
                }
                break;
            case 'signalvaluesynctimeout':
                if (this.hasAttribute('signalvaluesynctimeout')) {
                    this.signalValueSyncTimeout = newValue;
                } else {
                    this.signalValueSyncTimeout = '';
                }
                break;
            case 'receivestatevalue':
                if (this.hasAttribute('receivestatevalue')) {
                    this.receiveStateValue = newValue;
                } else {
                    this.receiveStateValue = '';
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
            case 'dir':
                if (this.hasAttribute('dir')) {
                    this.direction = newValue.toLowerCase();
                } else {
                    this.direction = Ch5Common.DIRECTION[0];
                }
                this.getTargetElementForCssClassesAndStyle().classList.add(this.cssClassPrefix + '--dir--' + this.direction);
                break;
            case 'disabled':
                this._disabled = hasValue;
                this.setAttribute('aria-disabled', hasValue.toString());

                // The `tabindex` attribute does not provide a way to fully remove
                // focusability from an element.
                // Elements with `tabindex=-1` can still be focused with
                // a mouse or by calling `focus()`.
                // To make sure an element is disabled and not focusable, remove the
                // `tabindex` attribute.
                if (hasValue) {
                    this.removeAttribute('tabindex');
                    // If the focus is currently on this element, unfocus it by
                    // calling the `HTMLElement.blur()` method.
                    this.blur();
                } else {
                    this.setAttribute('tabindex', '0');
                }
                this.updateForChangeInDisabledStatus();
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    /**
     * Unsubscribe signals
     */
    public unsubscribeFromSignals() {
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();
        if ('' !== this._subReceiveValueId && '' !== this._sigNameReceiveValue) {
            const sigSelectedName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveValue);
            const sigSelected: Ch5Signal<boolean> | null = csf.getBooleanSignal(sigSelectedName);
            if (null !== sigSelected) {
                sigSelected.unsubscribe(this._subReceiveValueId);
                this._sigNameReceiveValue = '';
            }
        }

        if ('' !== this._subReceiveScriptLabelHtmlId && '' !== this._sigNameReceiveScriptLabelHtml) {
            const sigLabelHtmlName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceiveScriptLabelHtml);
            const sigLabelHtml: Ch5Signal<string> | null = csf.getStringSignal(sigLabelHtmlName);
            if (null !== sigLabelHtml) {
                sigLabelHtml.unsubscribe(this._subReceiveScriptLabelHtmlId);
                this._sigNameReceiveScriptLabelHtml = '';
            }
        }
    }

    /**
     * METHODS
     *
     * - submit
     * - reset
     * - getDirty
     */

    /**
     * Submit the value ( send a signal )
     */
    public submit() {
        if (this.feedbackMode === 'submit' && this._dirty === true) {
            this._submitted = true;
            this._setDirtyHandler();
            this._sendValueForClickSignal();
        }
    }

    /**
     * Reset value property
     */
    public reset() {
        this.setClean();
        this.value = this._cleanValue as boolean;
        this.checked = this._cleanValue;
    }

    /**
     * Returns true if feedbackmode='submit' and the displayed value is different than the actual value
     * @returns {boolean}
     */
    public getDirty(): boolean {
        if (this.feedbackMode === 'submit') {
            return this._dirty;
        }

        return false;
    }

    /**
     * Set the ch5-toggle to a dirty state
     *
     * @fires dirty
     */
    public setDirty(): void {
        this._dirty = true;
        this._clean = false;

        // fire dirty event
        if (this.feedbackMode === 'submit') {
            const detail = { value: this.checked };
            /**
             * Fired when the component's value changes due to user interaction.
             *
             * @event dirty
             */
            this.dispatchEvent(
                this.dirtyEvent = new CustomEvent('dirty', {
                    bubbles: true,
                    cancelable: false,
                    detail
                })

            );

            if (this.ondirty instanceof HtmlCallback) {
                (this.ondirty as HtmlCallback).run({} as Event);
            } else if (this.onclean instanceof Function) {
                this.onclean();
            }
        }
    }

    /**
     * Set the ch5-toggle to a clean state
     */
    public setClean(): void {
        if (this._dirtyTimerHandle !== null) {
            clearTimeout(this._dirtyTimerHandle);
        }

        this._dirty = false;
        this._clean = true;
        this._submitted = false;

        // fire clean event
        if (this.feedbackMode === 'submit') {
            const detail = { value: this.checked };
            /**
             * Fired when the component's becomes clean.
             *
             * @event clean
             */
            this.dispatchEvent(
                this.cleanEvent = new CustomEvent('clean', {
                    bubbles: true,
                    cancelable: false,
                    detail
                })
            );

            if (this.onclean instanceof HtmlCallback) {
                (this.onclean as HtmlCallback).run({} as Event);
            } else if (this.onclean instanceof Function) {
                this.onclean();
            }
        }
    }

    /**
     * Returns css class when disabled
     *
     * @return {string }
     */
    public getCssClassDisabled(): string {
        return this.cssClassPrefix + '--disabled';
    }

    /**
     * Creates the internal html element of the component
     *
     * @protected
     */
    protected createInternalHtml() {
        // element body
        this._elBody = document.createElement('div');

        // element container
        this._elContainer = document.createElement('div');

        // element label
        this._elLabel = document.createElement('span');
        this._elLabel.hidden = true;
        this._elLabel.classList.add(this.primaryCssClass + '__label');

        // element handle
        this._elHandle = document.createElement('span');
        this._elHandle.classList.add(this.primaryCssClass + '__handle');

        // element iconOn/labelOn
        this._elIconOn = document.createElement('i');
        this._elIconOn.classList.add(this.primaryCssClass + '__on-icon');
        this._elLabelOn = document.createElement('span');
        this._elLabelOn.classList.add(this.primaryCssClass + '__on-label');
        this._elOnContainer = document.createElement('div');
        this._elOnContainer.appendChild(this._elIconOn);
        this._elOnContainer.appendChild(this._elLabelOn);

        // element iconOff/labeloff
        this._elIconOff = document.createElement('i');
        this._elIconOff.classList.add(this.primaryCssClass + '__off-icon');
        this._elLabelOff = document.createElement('span');
        this._elLabelOff.classList.add(this.primaryCssClass + '__off-label');
        this._elOffContainer = document.createElement('div');
        this._elOffContainer.appendChild(this._elIconOff);
        this._elOffContainer.appendChild(this._elLabelOff);

        // element knob
        this._elKnob = document.createElement('a');

        // append childrens
        this._elContainer.appendChild(this._elLabel);
        this._elContainer.appendChild(this._elHandle);
        this._elHandle.appendChild(this._elOffContainer);
        this._elHandle.appendChild(this._elOnContainer);
        this._elHandle.appendChild(this._elKnob);

        this._elBody.appendChild(this._elContainer);
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        super.initAttributes();

        this._upgradeProperty('checked');

        // if(this.hasAttribute('label')) {
        //     this.label = this.getAttribute('label') as string;
        // }
        this._upgradeProperty('label');
        this._upgradeProperty('labelOn');
        this._upgradeProperty('labelOff');
        this._upgradeProperty('iconOn');
        this._upgradeProperty('iconOff');
        this._upgradeProperty('handleShape');
        this._upgradeProperty('value');
        this._upgradeProperty('signalValueSyncTimeout');
        this._upgradeProperty('feedbackMode');
        this._upgradeProperty('disabled');
        this._upgradeProperty('receiveStateValue');
        this._upgradeProperty('receiveStateScriptLabelHtml');
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();

        const setOfCssClassesToBeApplied = new Set<string>();

        // primary
        setOfCssClassesToBeApplied.add(this.primaryCssClass);

        // shape
        setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.handleShape);

        // orientation
        setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--' + this.orientation);

        const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
        if (typeof targetEl.classList !== 'undefined') {
            this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
                if (setOfCssClassesToBeApplied.has(cssClass)) {
                    targetEl.classList.add(cssClass);
                    // this.classList.add(cssClass);
                    this.info('add CSS class', cssClass);
                } else {
                    targetEl.classList.remove(cssClass);
                    // this.classList.remove(cssClass);
                    this.info('remove CSS class', cssClass);
                }
            });
        }
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();

        this.addEventListener('click', this._onClick);
    }

    /**
     * Removes listeners
     */
    protected removeEvents() {
        super.removeEventListeners();

        this.removeEventListener('click', this._onClick);
    }

    /**
     * @private
     * @returns {HTMLElement}
     */
    protected getTargetElementForCssClassesAndStyle(): HTMLElement {
        return this._elBody;
    }


    /**
     * Generates a list of all possible components css classes
     *
     * @private
     * @returns {string[]}
     */
    private _generateListOfAllPossibleComponentCssClasses(): string[] {
        const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;
        cssClasses.push(this.primaryCssClass);

        // shapes
        Ch5Toggle.SHAPES.forEach((shape: TCh5ToggleShape) => {
            const newClass = this.cssClassPrefix + '--' + shape;
            cssClasses.push(newClass);
        });

        // orientation
        Ch5Toggle.ORIENTATIONS.forEach((orientation: TCh5ToggleOrientation) => {
            cssClasses.push(this.cssClassPrefix + '--' + orientation);
        });

        return cssClasses;
    }

    /**
     * Called when this element is clicked.
     *
     * @private
     * @memberof Ch5Toggle
     */
    private _onClick(inEvent: Event): void {
        this.info("Ch5Toggle._onClick()");
        // Don't do anything if disabled.
        if (this.disabled) {
            return;
        }

        inEvent.preventDefault();
        inEvent.stopPropagation();

        this.toggleChecked()
    }


    /**
     * `toggleChecked()` calls the either the `checked` setter and flips its state.
     * Because `toggleChecked()` is only caused by a user action, it will
     * also dispatch a change event.
     *
     * @fires change
     *
     * @private
     */
    public toggleChecked() {
        // The detail of the event.
        let detail;

        // Change the value of checked.
        this.checked = !this.checked;
        detail = { value: this.checked };

        // set dirty state and dirty value
        if (!this._dirty) {
            // set dirty value
            this._dirtyValue = this.checked;
            // set dirty state
            this.setDirty();
        } else {
            // set state as clean
            this.setClean();
        }

        // set dirty handler immediately if feedbackMode is not submit and send click signal
        if (this._feedbackMode !== 'submit') {
            this._setDirtyHandler();
            this._sendValueForClickSignal();
        }

        // dispatch 'change' event
        this._dispatchEvents(detail);
    }

    /**
     * Dirty handler
     * @private
     */
    private _setDirtyHandler() {
        this.info('Ch5Toggle._setDirtyHandler');
        if (this._dirtyTimerHandle !== null) {
            clearTimeout(this._dirtyTimerHandle);
        }

        this._dirtyTimerHandle = window.setTimeout(
            () => this._onDirtyTimerFinished(),
            this._signalValueSyncTimeout
        );
    }

    private _onDirtyTimerFinished() {
        this.info('Ch5Toggle._onDirtyTimerFinished');
        this._dirtyTimerHandle = null;

        if (this._dirtyValue !== this._cleanValue) {
            // set ui view value
            this.checked = this._cleanValue;

            // set state as clean
            this.setClean();
        }
    }

    /**
     * Dispatch change event
     *
     * @private
     * @param {*} detail
     * @memberof Ch5Toggle
     */
    private _dispatchEvents(detail: any): void {
        /**
         * Fired when the component's `checked` value changes due to user interaction.
         *
         * @event change
         */
        this.dispatchEvent(
            this.changeEvent = new CustomEvent('change', {
                detail,
                bubbles: true
            })
        );
    }

    /**
     * Upgrade the property on this element with the given name.
     *
     * @private
     * @param {string} prop
     *   The name of a property.
     */

    private _upgradeProperty(prop: string) {
        if (this.constructor.prototype.hasOwnProperty(prop)) {
            const val = (this as any)[prop];
            delete (this as any)[prop];
            (this as any)[prop] = val;
        }
    }

    /**
     * Send digital pulse(boolean values) for signal on click
     * @private
     */
    private _sendValueForClickSignal(): void {
        let sigClick: Ch5Signal<boolean> | null = null;

        if ('' !== this._sigNameSendOnClick
            && undefined !== this._sigNameSendOnClick
            && null !== this._sigNameSendOnClick) {

            sigClick = Ch5SignalFactory.getInstance()
                .getBooleanSignal(this._sigNameSendOnClick);

            if (sigClick !== null) {
                sigClick.publish(true);
                sigClick.publish(false);
            }
        }
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-toggle', Ch5Toggle);
}

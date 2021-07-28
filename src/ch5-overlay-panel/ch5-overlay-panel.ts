// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5OverlayPanelAttributes, TCh5OverlayPanelOverflow, TCh5OverlayPanelPositionOffset, TCh5OverlayPanelStretch } from "./interfaces";

/**
 * Html Attributes
 *
 * - dismissable
 * - closable
 * - closeIcon
 * - mask
 * - maskStyle
 * - stretch
 * - overflow
 * - positionTo
 * - positionOffset
 *
 * - receiveStatePositionTo
 * - receiveStatePositionOffset
 * - sendEventOnBeforeShow
 * - sendEventOnAfterShow
 * - sendEventOnBeforeHide
 * - sendEventOnAfterHide
 *
 * Inherited
 * - customClass
 * - customStyle
 * - receiveStateCustomClass
 * - receiveStateCustomStyle
 * - receiveStateShow
 * - receiveStateShowPulse
 * - receiveStateHidePulse
 * - sendEventOnShow
 *
 */
export class Ch5OverlayPanel extends Ch5Common implements ICh5OverlayPanelAttributes {

    /**
     * The first value is considered the default one
     */
    public static POSITION_OFFSETS: TCh5OverlayPanelPositionOffset[] = ['top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right', 'left-center', 'right-center'];
    /**
     * The first value is considered the default one
     */
    public static STRETCHES: TCh5OverlayPanelStretch[] = ['both', 'width', 'height'];
    /**
     * The first value is considered the default one
     */
    public static OVERFLOWS: TCh5OverlayPanelOverflow[] = ['scroll', 'show'];


    public static readonly COMPONENT_DATA: any = {
        POSITION_OFFSETS: {
            default: Ch5OverlayPanel.POSITION_OFFSETS[0],
            values: Ch5OverlayPanel.POSITION_OFFSETS,
            key: 'position_offset',
            classListPrefix: 'ch5-overlay-panel--pos-'
        },
        STRETCH: {
            default: Ch5OverlayPanel.STRETCHES[0],
            values: Ch5OverlayPanel.STRETCHES,
            key: 'stretch',
            classListPrefix: 'ch5-overlay-panel--stretch-'
        },
        OVERFLOWS: {
            default: Ch5OverlayPanel.OVERFLOWS[0],
            values: Ch5OverlayPanel.OVERFLOWS,
            key: 'overflow',
            classListPrefix: 'ch5-overlay-panel--overflow-'
        },
    };

    public primaryCssClass = 'ch5-overlay-panel';
    public cssClassPrefix = 'ch5-overlay-panel';

    /**
     * A div element that wraps the internal structure of the overlay
     */
    protected _elContainer: HTMLElement = {} as HTMLElement;
    /**
     * An element that wraps the contents of the overlay. The contents are the html elements that were initially enclosed
     * between the overlay tags
     */
    protected _elContents: HTMLElement = {} as HTMLElement;
    /**
     * The close icon element. ( This si wrapped in the _elCloseIconBtn element
     */
    protected _elCloseIcon: HTMLElement = {} as HTMLElement;
    /**
     * The button that wraps the close icon
     */
    protected _elCloseIconBtn: HTMLElement = {} as HTMLElement;

    /**
     * Controls the ability to hide the panel when a touch/click event is detected outside of it
     * Defaults to false.
     *
     * HTML attribute name: dismissable
     */
    protected _dismissable: boolean = true;

    /**
     * If true, a close icon will be shown on the corner of the panel.
     * Defaults to false.
     *
     * HTML attribute name: closable
     */
    protected _closable: boolean = false;

    protected _mask: boolean = false;

    /**
     * A string containing css class names that will be added to the close icon element.
     *
     * HTML attribute name: closeIcon
     */
    protected _closeIcon: string = '';

    /**
     * When stretch property is set, the element inherits the width or/and height of the container.
     *
     * HTML attribute name: stretch
     */
    protected _stretch: TCh5OverlayPanelStretch | null = null;

    /**
     * Valid values: scroll, show.
     * Specifies whether to add scrollbars when an element's content is too big to fit in a specified area
     *
     * HTML attribute name: overflow
     */
    protected _overflow: TCh5OverlayPanelOverflow = 'scroll';

    /**
     * Positions the element related to window or to an element specified by id
     * If not specified it will be positioned related to window
     *
     * HTML attribute name: positionTo
     */
    protected _positionTo: string = '';

    /**
     * Specifies the position of the panel with respect to the 'positionTo' attribute
     *
     * HTML attribute name: positionOffset
     */
    protected _positionOffset: TCh5OverlayPanelPositionOffset = 'top-left';

    /**
     * The name of a string signal.
     * Updates the 'positionTo' attribute
     *
     * HTML attribute name: receiveStatePositionTo
     */
    protected _sigNameReceivePositionTo: string = '';

    /**
     * The subscription id for the receiveStatePositionTo signal
     */
    protected _subReceivePositionTo: string = '';

    /**
     * The name of a string signal
     * Updates the 'positionOffset' attribute
     *
     * HTML attribute name: receiveStatePositionOffset
     */
    protected _sigNameReceivePositionOffset: string = '';

    /**
     * The subscription id for the receiveStateLabel signal
     */
    protected _subReceivePositionOffset: string = '';


    /**
     * The name of the boolean signal that will be sent to native just before the panel is being shown.
     * It is a pulse signal.
     *
     * HTML attribute name: sendEventOnBeforeShow
     */
    protected _sigNameSendOnBeforeShow: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnBeforeShow
     */
    protected _sigSendOnBeforeShow: Ch5Signal<boolean> | null = null;

    /**
     * The name of the boolean signal that will be sent to native just after the panel was shown.
     * It is a pulse signal.
     *
     * HTML attribute name: sendEventOnAfterShow
     */
    protected _sigNameSendOnAfterShow: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnAfterShow
     */
    protected _sigSendOnAfterShow: Ch5Signal<boolean> | null = null;

    /**
     * The name of the boolean signal that will be sent to native just before the panel is being hidden.
     * It is a pulse signal.
     *
     * HTML attribute name: sendEventOnBeforeHide
     */
    protected _sigNameSendOnBeforeHide: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnBeforeHide
     */
    protected _sigSendOnBeforeHide: Ch5Signal<boolean> | null = null;

    /**
     * The name of the boolean signal that will be sent to native just after the panel was hidden.
     * It is a pulse signal.
     *
     * HTML attribute name: sendEventOnAfterHide
     */
    protected _sigNameSendOnAfterHide: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnAfterHide
     */
    protected _sigSendOnAfterHide: Ch5Signal<boolean> | null = null;


    protected _wasInstatiated: boolean = false;


    protected _isShown: boolean = false;

    protected _ready: Promise<any>;

    /**
     * Override the default value from Ch5Common
     */
    protected _show: boolean = false;

    /**
     * Events
     *
     * show
     * hide
     * beforeShow
     * afterShow
     * beforeHide
     * afterHide
     */

    protected _showEvent: Event;

    protected _hideEvent: Event;

    protected _beforeShowEvent: Event;

    protected _afterShowEvent: Event;

    protected _beforeHideEvent: Event;

    protected _afterHideEvent: Event;

    public constructor() {
        super();
        this.info('Ch5OverlayPanel.constructor()');
        this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();


        if (!this._wasInstatiated) {
            this.createInternalHtml();
            this._rebindEventCallbacks();
            this._closeIcon = this.cssClassPrefix + '-default-close-icon';
        }
        this._wasInstatiated = true;


        this._showEvent = new CustomEvent('show', {
            bubbles: true,
            cancelable: false
        });

        this._hideEvent = new CustomEvent('hide', {
            bubbles: true,
            cancelable: false
        });

        this._beforeShowEvent = new CustomEvent('beforeShow', {
            bubbles: true,
            cancelable: false
        });

        this._afterShowEvent = new CustomEvent('afterShow', {
            bubbles: true,
            cancelable: false
        });

        this._beforeHideEvent = new CustomEvent('beforeHide', {
            bubbles: true,
            cancelable: false
        });

        this._afterHideEvent = new CustomEvent('afterHide', {
            bubbles: true,
            cancelable: false
        });

        this._ready = this._getReadyCheckPromise();
    }

    /**
     * Called when the ch5-button component is first connected to the DOM
     */
    public connectedCallback() {
        this.info('called connectedCallback()');

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5OverlayPanel);
        }

        if (!this.hasAttribute('show')) {
            this.setAttribute('show', '' + this._show);
        }

        this._ready.then(() => {
            this._initialize();
            this.initCommonMutationObserver(this);
        }
        );
    }

    /**
     * Called when the ch5-button component is disconnected from the DOM
     */
    public disconnectedCallback() {
        this.info('called disconnectedCallback()');
        this.removeEventListeners();
        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    public getListOfAllPossibleComponentCssClasses(): string[] {
        return this._listOfAllPossibleComponentCssClasses;
    }

    protected _initialize() {
        this.info('ch5-overlay-panel _initialize()');
        if (this._elContainer.parentElement !== this) {
            while (this.childNodes.length) {
                this._elContents.appendChild(this.childNodes[0]);
            }
            this.appendChild(this._elContainer);
        }

        this.cacheComponentChildrens();
        this.initAttributes();
        this.updateCssClasses();
        this.attachEventListeners();
    }

    protected generateListOfAllPossibleComponentCssClasses(): string[] {
        const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;
        cssClasses.push(this.primaryCssClass);

        // position offsets
        Ch5OverlayPanel.POSITION_OFFSETS.forEach((posOffset: TCh5OverlayPanelPositionOffset) => {
            const newCssClass = this.cssClassPrefix + '--pos-' + posOffset;
            cssClasses.push(newCssClass);
        });

        // overflows
        Ch5OverlayPanel.OVERFLOWS.forEach((overflow: TCh5OverlayPanelOverflow) => {
            cssClasses.push(this.cssClassPrefix + '--overflow-' + overflow);
        });

        // stretches
        Ch5OverlayPanel.STRETCHES.forEach((stretch: TCh5OverlayPanelStretch) => {
            if (stretch !== null) {
                cssClasses.push(this.cssClassPrefix + '--stretch-' + stretch);
            }
        });

        return cssClasses;
    }


    public unsubscribeFromSignals() {
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();
        if ('' !== this._subReceivePositionOffset && '' !== this._sigNameReceivePositionOffset) {
            const subSignalOffsetName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePositionOffset);
            const sigOffset: Ch5Signal<string> | null = csf.getStringSignal(subSignalOffsetName);
            if (null !== sigOffset) {
                sigOffset.unsubscribe(this._subReceivePositionOffset);
                this._sigNameReceivePositionOffset = '';
            }
        }

        if ('' !== this._subReceivePositionTo && '' !== this._sigNameReceivePositionTo) {
            const subSignalPosToName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePositionOffset);
            const sigPosTo: Ch5Signal<boolean> | null = csf.getBooleanSignal(subSignalPosToName);
            if (null !== sigPosTo) {
                sigPosTo.unsubscribe(this._subReceivePositionTo);
                this._sigNameReceivePositionTo = '';
            }
        }

    }

    protected createInternalHtml() {
        this.info('ch5-overlay-panel create internal Html');

        this._elContainer = document.createElement('div');

        this._elCloseIconBtn = document.createElement('button');
        this._elCloseIconBtn.setAttribute('type', 'button');
        this._elCloseIconBtn.classList.add(this.cssClassPrefix + '-close-icon-btn');
        this._elCloseIconBtn.setAttribute('aria-label', 'Close');

        this._elCloseIcon = document.createElement('span');
        this._elCloseIcon.setAttribute('aria-hidden', 'true');
        this._elCloseIcon.classList.add(this.cssClassPrefix + '-close-icon');
        this._elCloseIcon.classList.add(this.cssClassPrefix + '-default-close-icon');

        this._elCloseIconBtn.appendChild(this._elCloseIcon);

        this._elContents = document.createElement('div');
        this._elContents.classList.add(this.cssClassPrefix + '-contents');

        this._elContainer.classList.add(this.primaryCssClass);
        this._elContainer.setAttribute('data-ch5-id', this.getCrId());

        // this._elContainer.appendChild(this._elCloseIconBtn);
        this._elContainer.appendChild(this._elContents);

    }

    protected refreshComponent() {
        this.updateCssClasses();
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        super.updateCssClasses();

        this.info('called updateCssClasses()');


        // let stretchCssClassName = '';
        const setOfCssClassesToBeApplied = new Set<string>();

        // primary
        setOfCssClassesToBeApplied.add(this.primaryCssClass);

        // overflow
        setOfCssClassesToBeApplied.add(this.cssClassPrefix + '--overflow-' + this.overflow);

        const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
        if (typeof targetEl.classList !== 'undefined') {
            this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
                if (setOfCssClassesToBeApplied.has(cssClass)) {
                    targetEl.classList.add(cssClass);
                    this.info('add CSS class', cssClass);
                } else {
                    targetEl.classList.remove(cssClass);
                    this.info('remove CSS class', cssClass);
                }
            });
        }

    }

    public static get observedAttributes() {
        const inheritedObsAttrs = Ch5Common.observedAttributes;
        const newObsAttrs = [
            'dismissable',
            'closable',
            'closeicon',
            'mask',
            'maskstyle',
            'stretch',
            'overflow',
            'positionto',
            'positionoffset',

            'receivestatepositionto',
            'receivestatepositionoffset',
            'sendeventonbeforeshow',
            'sendeventonaftershow',
            'sendeventonbeforehide',
            'sendeventonafterhide'
        ];

        return inheritedObsAttrs.concat(newObsAttrs);
    }

    protected initAttributes() {
        super.initAttributes();


        if (this.hasAttribute('dismissable')) {
            const tmpDismissable = this.getAttribute('dismissable') as string;
            if ('0' === tmpDismissable
                || 'false' === tmpDismissable.toLowerCase()) {
                this.dismissable = false;
            } else {
                this.dismissable = true;
            }
        } else {
            this.dismissable = true;
        }
        this.updateForChangeInDismissable();

        if (this.hasAttribute('closable')) {
            const tmpClosable = this.getAttribute('closable') as string;
            if ('0' === tmpClosable
                || 'false' === tmpClosable.toLowerCase()) {
                this.closable = false;
            } else {
                this.closable = true;
            }
        } else {
            this.closable = false;
        }
        this.updateForChangeInClosable();

        if (this.hasAttribute('closeicon')) {
            this.closeIcon = this.getAttribute('closeicon') as string;
        }

        if (this.hasAttribute('stretch')) {
            this.stretch = this.getAttribute('stretch') as TCh5OverlayPanelStretch;
        }

        if (this.hasAttribute('overflow')) {
            this.overflow = this.getAttribute('overflow') as TCh5OverlayPanelOverflow;
        }

        if (this.hasAttribute('positionto')) {
            this.positionTo = this.getAttribute('positionto') as string;
        }

        if (this.hasAttribute('positionoffset')) {
            this.positionOffset = this.getAttribute('positionoffset') as TCh5OverlayPanelPositionOffset;
        }

        if (this.hasAttribute('receivestatepositionto')) {
            this.receiveStatePositionTo = this.getAttribute('receivestatepositionto') as string;
        }

        if (this.hasAttribute('receivestatepositionoffset')) {
            this.receiveStatePositionOffset = this.getAttribute('receivestatepositionoffset') as string;
        }

        if (this.hasAttribute('sendeventonbeforeshow')) {
            this.sendEventOnBeforeShow = this.getAttribute('sendeventonbeforeshow') as string;
        }

        if (this.hasAttribute('sendeventonaftershow')) {
            this.sendEventOnAfterShow = this.getAttribute('sendeventonaftershow') as string;
        }

        if (this.hasAttribute('sendeventonbeforehide')) {
            this.sendEventOnBeforeHide = this.getAttribute('sendeventonbeforehide') as string;
        }

        if (this.hasAttribute('sendeventonafterhide')) {
            this.sendEventOnAfterHide = this.getAttribute('sendeventonafterhide') as string;
        }

    }

    protected attachEventListeners() {
        super.attachEventListeners();

        if (this._elCloseIconBtn) {
            this._elCloseIconBtn.addEventListener('click', this._clickedOnClose);
        }
        this.addEventListener('click', this._clickAndTouchEvent);
        this.addEventListener('touch', this._clickAndTouchEvent);

        this.addEventListener('show', this._onShow);
        this.addEventListener('hide', this._onHide);
        this.addEventListener('beforeShow', this._onBeforeShow);
        this.addEventListener('afterShow', this._onAfterShow);
        this.addEventListener('beforeHide', this._onBeforeHide);
        this.addEventListener('afterHide', this._onAfterHide);

    }

    protected removeEventListeners() {
        super.removeEventListeners();

        this._elCloseIconBtn.removeEventListener('click', this._clickedOnClose);

        this.removeEventListener('show', this._onShow);
        this.removeEventListener('hide', this._onHide);
        this.removeEventListener('beforeShow', this._onBeforeShow);
        this.removeEventListener('afterShow', this._onAfterShow);
        this.removeEventListener('beforeHide', this._onBeforeHide);
        this.removeEventListener('afterHide', this._onAfterHide);

    }

    protected _rebindEventCallbacks() {
        this._onShow = this._onShow.bind(this);
        this._onHide = this._onHide.bind(this);
        this._onBeforeShow = this._onBeforeShow.bind(this);
        this._onAfterShow = this._onAfterShow.bind(this);
        this._onBeforeHide = this._onBeforeHide.bind(this);
        this._onAfterHide = this._onAfterHide.bind(this);
        this._clickedOnClose = this._clickedOnClose.bind(this);
        this._dismissElement = this._dismissElement.bind(this);
        this._clickAndTouchEvent = this._clickAndTouchEvent.bind(this);
    }

    protected getTargetElementForCssClassesAndStyle(): HTMLElement {
        return this._elContainer;
    }

    protected _clickedOnClose(inEvent: Event) {
        this.info('_clickedOnClose()');
        this.setAttribute('show', 'false');
    }

    protected _getReadyCheckPromise(): Promise<any> {
        return Promise.all([
            customElements.whenDefined('ch5-button'),
            customElements.whenDefined('ch5-form'),
            customElements.whenDefined('ch5-image'),
            customElements.whenDefined('ch5-list'),
            customElements.whenDefined('ch5-modal-dialog'),
            customElements.whenDefined('ch5-overlay-panel'),
            customElements.whenDefined('ch5-select'),
            customElements.whenDefined('ch5-slider'),
            customElements.whenDefined('ch5-spinner'),
            customElements.whenDefined('ch5-textinput'),
            customElements.whenDefined('ch5-toggle'),
            customElements.whenDefined('ch5-triggerview'),
            customElements.whenDefined('ch5-triggerview-child'),
        ]);
    }
    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-overlay-panel attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')');

        switch (attr) {
            case 'dismissable':
                if (this.hasAttribute('dismissable')) {
                    const tmpDismissable = this.getAttribute('dismissable') as string;
                    if ('0' === tmpDismissable
                        || 'false' === tmpDismissable.toLowerCase()) {
                        this.dismissable = false;
                    } else {
                        this.dismissable = true;
                    }
                } else {
                    this.dismissable = true;
                }
                this.updateForChangeInDismissable();
                break;
            case 'closable':
                if (this.hasAttribute('closable')) {
                    const tmpClosable = this.getAttribute('closable') as string;
                    if ('0' === tmpClosable
                        || 'false' === tmpClosable.toLowerCase()) {
                        this.closable = false;
                    } else {
                        this.closable = true;
                    }
                } else {
                    this.closable = false;
                }
                this.updateForChangeInClosable();
                break;
            case 'closeicon':
                if (this.hasAttribute('closeicon')) {
                    this.closeIcon = newValue;
                } else {
                    this.closeIcon = '';
                }
                break;
            case 'stretch':
                if (this.hasAttribute('stretch')) {
                    this.stretch = newValue as TCh5OverlayPanelStretch | null;
                } else {
                    this.stretch = null;
                }
                this.updateForChangeInStretch();
                break;
            case 'overflow':
                if (this.hasAttribute('overflow')) {
                    this.overflow = newValue as TCh5OverlayPanelOverflow;
                } else {
                    this.overflow = Ch5OverlayPanel.OVERFLOWS[0];
                }
                break;
            case 'positionto':
                if (this.hasAttribute('positionto')) {
                    this.positionTo = newValue;
                } else {
                    this.positionTo = '';
                }
                this.updateForChangeInPositionTo();
                break;
            case 'positionoffset':
                if (this.hasAttribute('positionoffset')) {
                    this.positionOffset = newValue as TCh5OverlayPanelPositionOffset;
                } else {
                    this.positionOffset = Ch5OverlayPanel.POSITION_OFFSETS[0];
                }
                this.updateForChangeInPositionOffset();
                break;
            case 'receivestatepositionto':
                if (this.hasAttribute('receivestatepositionto')) {
                    this.receiveStatePositionTo = newValue;
                } else {
                    this.receiveStatePositionTo = '';
                }
                break;
            case 'receivestatepositionoffset':
                if (this.hasAttribute('receivestatepositionoffset')) {
                    this.receiveStatePositionOffset = newValue;
                } else {
                    this.receiveStatePositionOffset = '';
                }
                break;
            case 'sendeventonbeforeshow':
                if (this.hasAttribute('sendeventonbeforeshow')) {
                    this.sendEventOnBeforeShow = newValue;
                } else {
                    this.sendEventOnBeforeShow = '';
                }
                break;
            case 'sendeventonaftershow':
                if (this.hasAttribute('sendeventonaftershow')) {
                    this.sendEventOnAfterShow = newValue;
                } else {
                    this.sendEventOnAfterShow = '';
                }
                break;
            case 'sendeventonbeforehide':
                if (this.hasAttribute('sendeventonbeforehide')) {
                    this.sendEventOnBeforeHide = newValue;
                } else {
                    this.sendEventOnBeforeHide = '';
                }
                break;
            case 'sendeventonafterhide':
                if (this.hasAttribute('sendeventonafterhide')) {
                    this.sendEventOnAfterHide = newValue;
                } else {
                    this.sendEventOnAfterHide = '';
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

    protected updateForChangeInDismissable() {
        this.info('updateForChangeInDismissable()')
    }

    protected updateForChangeInStretch() {
        const parentEl = this.parentElement as HTMLElement;
        const targetEl = this.getTargetElementForCssClassesAndStyle();
        if (!parentEl) {
            this.info('updateForChangeInStretch() - parent element not found');
            return;
        }
        switch (this.stretch) {
            case 'width':
                targetEl.style.width = parentEl.offsetWidth + 'px';
                break;
            case 'height':
                targetEl.style.height = parentEl.offsetHeight + 'px';
                break;
            case 'both':
                targetEl.style.width = parentEl.offsetWidth + 'px';
                targetEl.style.height = parentEl.offsetHeight + 'px';
                break;
        }
    }

    protected updateForChangeInPositionTo() {
        this.updatePosition();
    }

    protected updateForChangeInPositionOffset() {
        this.updatePosition();
    }

    protected updatePosition() {
        let refElementId = this.positionTo || '';
        if (refElementId === '') {
            this.info('updateForChangeInPositionTo() - incorrect reference id ');
            return;
        }
        if (refElementId.charAt(0) !== '#') {
            refElementId = '#' + refElementId;
        }

        const referenceElement = document.querySelector(refElementId) as HTMLElement;
        if (referenceElement && this.parentElement !== referenceElement.parentElement) {
            this._insertAfter(this, referenceElement);
        }

        const elementToReposition = this.getTargetElementForCssClassesAndStyle();
        if (!referenceElement) {
            this.info('updateForChangeInPositionTo() - reference element not found for id ' + refElementId);
            return;
        }

        switch (this.positionOffset) {
            // case '': // ts-lint:disable-line:no-switch-case-fall-through
            case 'top-left':
                elementToReposition.style.top = (referenceElement.offsetTop - elementToReposition.offsetHeight) + 'px';
                elementToReposition.style.left = referenceElement.offsetLeft + 'px';
                break;
            case 'top-center':
                elementToReposition.style.top = (referenceElement.offsetTop - elementToReposition.offsetHeight) + 'px';
                elementToReposition.style.left = (referenceElement.offsetLeft
                    + Math.floor(referenceElement.offsetWidth / 2)
                    - Math.floor(elementToReposition.offsetWidth / 2)
                ) + 'px';
                break;
            case 'top-right':
                elementToReposition.style.top = (referenceElement.offsetTop - elementToReposition.offsetHeight) + 'px';
                elementToReposition.style.left = (referenceElement.offsetLeft
                    + referenceElement.offsetWidth
                    - elementToReposition.offsetWidth) + 'px';
                break;
            case 'bottom-left':
                elementToReposition.style.top = (referenceElement.offsetTop + referenceElement.offsetHeight) + 'px';
                elementToReposition.style.left = referenceElement.offsetLeft + 'px';
                break;
            case 'bottom-center':
                elementToReposition.style.top = (referenceElement.offsetTop + referenceElement.offsetHeight) + 'px';
                elementToReposition.style.left = (referenceElement.offsetLeft
                    + Math.floor(referenceElement.offsetWidth / 2)
                    - Math.floor(elementToReposition.offsetWidth / 2)
                ) + 'px';
                break;
            case 'bottom-right':
                elementToReposition.style.top = (referenceElement.offsetTop + referenceElement.offsetHeight) + 'px';
                elementToReposition.style.left = (referenceElement.offsetLeft
                    + referenceElement.offsetWidth
                    - elementToReposition.offsetWidth) + 'px';
                break;
            case 'left-center':
                elementToReposition.style.top = (referenceElement.offsetTop
                    - Math.floor(elementToReposition.offsetHeight / 2)
                    + Math.floor(referenceElement.offsetHeight / 2)
                ) + 'px';
                elementToReposition.style.left = (referenceElement.offsetLeft - elementToReposition.offsetWidth) + 'px';
                break;
            case 'right-center':
                elementToReposition.style.top = (referenceElement.offsetTop
                    - Math.floor(elementToReposition.offsetHeight / 2)
                    + Math.floor(referenceElement.offsetHeight / 2)
                ) + 'px';
                elementToReposition.style.left = (referenceElement.offsetLeft + referenceElement.offsetWidth) + 'px';
                break;
        }
    }

    protected _dismissElement(inEvent: Event) {
        this.info('_dismissElement()');

        if (false === this.dismissable) {
            this.info('_dismissElement() return ( dismissable is false)');
            return;
        }
        if (false === this._isShown) {
            this.info('_dismissElement() return ( _isShown is false)');
            return;
        }

        this.info('_dismissElement() inEvent', inEvent);
        this.setAttribute('show', 'false');
    }

    protected _clickAndTouchEvent(event: Event) {
        event.stopPropagation();
    }

    protected updateForChangeInClosable() {
        if (true === this.closable) {
            this._elContainer.insertBefore(this._elCloseIconBtn, this._elContents);
        } else {
            this._elCloseIconBtn.remove();
        }
    }

    /**
     * Runs when the show state was changed to true, before the change was processed.
     */
    protected beforeHandlingShow(): void {
        this.info('beforeHandlingShow()');
        this.dispatchEvent(this._beforeShowEvent);
        this.dispatchEvent(this._showEvent);
        this._sendPulse(this._sigNameSendOnBeforeShow);

        return;
    }

    /**
     * Runs when the show state was changed to true, after the change was processed.
     */
    protected afterHandlingShow(): void {
        this.info('afterHandlingShow()');
        this.dispatchEvent(this._afterShowEvent);
        this._sendPulse(this._sigNameSendOnAfterShow);
        this.updatePosition();
        this._isShown = true;

        // Using EventLoop to attach event listener
        // to document only after all event pipeline was called ( mousedown -> mouseup -> click)
        // Attaching it when mousedown is triggered and that event being attached to document
        // this will be triggerd as well.
        setTimeout(() => {
            document.addEventListener("click", this._dismissElement);
        });
    }

    /**
     * Runs when the show state was changed to false, before the change is being handled
     */
    protected beforeHandlingHide(): void {
        this.info('beforeHandlingHide()');
        this.dispatchEvent(this._beforeHideEvent);
        this._sendPulse(this._sigNameSendOnBeforeHide);

        document.removeEventListener("click", this._dismissElement);
    }

    /**
     * Runs when the show state was changed to false, after the change was processed
     */
    protected afterHandlingHide(): void {
        this.info('afterHandlingHide()');
        this.dispatchEvent(this._hideEvent);
        this.dispatchEvent(this._afterHideEvent);
        this._sendPulse(this._sigNameSendOnAfterHide);
        this._isShown = false;
        return;
    }

    //
    // Attr getters and setters
    //

    public set dismissable(value: boolean) {
        this.info('set dismissable("' + value + '")');
        if (this._dismissable !== value) {
            if (value === undefined || value === null) {
                value = false;
            }
            this._dismissable = value;
            this.setAttribute('dismissable', value.toString());
        }
    }

    public get dismissable(): boolean {
        return this._dismissable;
    }

    public set closable(value: boolean) {
        this.info('set closable("' + value + '")');
        if (this._closable !== value) {
            if (value === undefined || value === null) {
                value = false;
            }
            this._closable = value;
            this.setAttribute('closable', value.toString());
        }
    }

    public get closable(): boolean {
        return this._closable;
    }

    /**
     * TODO: This proprety was not existing earlier, but is consumed/referred within the code
     * This property is created for the same and needs to be tested
     */
    public set mask(value: boolean) {
        this.info('set mask("' + value + '")');
        if (this._mask !== value) {
            if (value === undefined || value === null) {
                value = false;
            }
            this._mask = value;
            this.setAttribute('mask', value.toString());
        }
    }

    public get mask(): boolean {
        return this._mask;
    }

    public set closeIcon(value: string) {
        if (typeof this._elCloseIcon.classList === "undefined") {
            return;
        }
        this.info('set closeIcon("' + value + '")');
        if (this._closeIcon !== value) {
            if ('' !== this._closeIcon) {
                this._closeIcon.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        this._elCloseIcon.classList.remove(className); // remove previous class
                    }
                });
            }
            this._closeIcon = value;
            if ('' !== this._closeIcon) {
                this._closeIcon.split(' ').forEach((className: string) => {
                    className = className.trim();
                    if ('' !== className) {
                        this._elCloseIcon.classList.add(className); // adds the new icon class if present
                    }
                });
            }
            this.setAttribute('closeicon', value);
        }
    }

    public get closeIcon(): string {
        return this._closeIcon;
    }

    /**
     * Setter step
     * @param {TCh5OverlayPanelStretch | null} value
     */
    public set stretch(value: TCh5OverlayPanelStretch | null) {
        if (value !== null) {
            if (this._stretch !== value) {
                if (Ch5OverlayPanel.STRETCHES.indexOf(value) >= 0) {
                    this._stretch = value;
                    this.setAttribute('stretch', this._stretch);
                } else {
                    this._stretch = null;
                }
            }
        } else {
            this._stretch = null;
        }
    }

    public get stretch(): (TCh5OverlayPanelStretch | null) {
        return this._stretch;
    }

    public set overflow(value: TCh5OverlayPanelOverflow) {
        this.info('set overflow("' + value + '")');
        if (this._overflow !== value) {
            if (Ch5OverlayPanel.OVERFLOWS.indexOf(value) >= 0) {
                this._overflow = value;
            } else {
                this._overflow = Ch5OverlayPanel.OVERFLOWS[0];
            }
            this.setAttribute('overflow', this._overflow);
        }
    }

    public get overflow(): TCh5OverlayPanelOverflow {
        return this._overflow;
    }

    public set positionTo(value: string) {
        this.info('set positionTo("' + value + '")');
        if (this._positionTo !== value) {
            this._positionTo = value;
            this.setAttribute('positionto', value);
        }
    }

    public get positionTo(): string {
        return this._positionTo;
    }

    public set positionOffset(value: TCh5OverlayPanelPositionOffset) {
        this.info('set positionOffset("' + value + '")');
        if (this._positionOffset !== value) {
            if (Ch5OverlayPanel.POSITION_OFFSETS.indexOf(value) >= 0) {
                this._positionOffset = value;
            } else {
                this._positionOffset = Ch5OverlayPanel.POSITION_OFFSETS[0];
            }
            this.setAttribute('positionoffset', this._positionOffset);
        }
    }

    public get positionOffset(): TCh5OverlayPanelPositionOffset {
        return this._positionOffset;
    }

    //
    // Signal related attribute setter/getters
    //

    public set receiveStatePositionTo(value: string) {
        this.info('set receiveStatePositionTo(\'' + value + '\')');
        if ('' === value
            || this._sigNameReceivePositionTo === value
            || null === value
            || undefined === value) {
            return;
        }
        // clean up old subscription
        if (this._sigNameReceivePositionTo !== ''
            && this._sigNameReceivePositionTo !== undefined
            && this._sigNameReceivePositionTo !== null) {

            const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePositionTo);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSignalName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceivePositionTo);
            }
        }

        this._sigNameReceivePositionTo = value;
        this.setAttribute('receivestatepositionto', value);

        // setup new subscription.
        const receiveSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePositionTo);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveSignalName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceivePositionTo = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this._positionTo) {
                this.setAttribute('positionto', newValue)
            }
        });
    }

    public get receiveStatePositionTo(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatepositionto');
    }

    public set receiveStatePositionOffset(value: string) {
        this.info('set receiveStatePositionOffset(\'' + value + '\')');
        if ('' === value
            || this._sigNameReceivePositionOffset === value
            || null === value
            || undefined === value) {
            return;
        }
        // clean up old subscription
        if (this._sigNameReceivePositionOffset !== ''
            && this._sigNameReceivePositionOffset !== undefined
            && this._sigNameReceivePositionOffset !== null) {
            const oldSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePositionOffset);
            const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSignalName);

            if (oldSignal !== null) {
                oldSignal.unsubscribe(this._subReceivePositionOffset);
            }
        }

        this._sigNameReceivePositionOffset = value;
        this.setAttribute('receivestatepositionoffset', value);

        // setup new subscription.
        const subSignalName: string = Ch5Signal.getSubscriptionSignalName(this._sigNameReceivePositionOffset);
        const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(subSignalName);

        if (receiveSignal === null) {
            return;
        }

        this._subReceivePositionOffset = receiveSignal.subscribe((newValue: string) => {
            if (newValue !== this._positionOffset) {
                this.setAttribute('positionoffset', newValue)
            }
        });
    }

    public get receiveStatePositionOffset(): string {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatepositionoffset');
    }

    public set sendEventOnBeforeShow(value: string) {
        this.info('set sendEventOnBeforeShow(\'' + value + '\')');
        if ('' !== value && value !== this.sendEventOnBeforeShow) {
            this._sigNameSendOnBeforeShow = value;
            this.setAttribute('sendeventonbeforeshow', value);
        }
    }

    public get sendEventOnBeforeShow(): string {
        return this._sigNameSendOnBeforeShow;
    }

    public set sendEventOnAfterShow(value: string) {
        this.info('set sendEventOnAfterShow(\'' + value + '\')');
        if ('' !== value && value !== this.sendEventOnAfterShow) {
            this._sigNameSendOnAfterShow = value;
            this.setAttribute('sendeventonaftershow', value);
        }
    }

    public get sendEventOnAfterShow(): string {
        return this._sigNameSendOnAfterShow;
    }

    public set sendEventOnBeforeHide(value: string) {
        this.info('set sendEventOnBeforeHide(\'' + value + '\')');
        if ('' !== value && value !== this.sendEventOnBeforeHide) {
            this._sigNameSendOnBeforeHide = value;
            this.setAttribute('sendeventonbeforehide', value);
        }
    }

    public get sendEventOnBeforeHide(): string {
        return this._sigNameSendOnBeforeHide;
    }

    public set sendEventOnAfterHide(value: string) {
        this.info('set sendEventOnAfterHide(\'' + value + '\')');
        if ('' !== value && value !== this.sendEventOnAfterHide) {
            this._sigNameSendOnAfterHide = value;
            this.setAttribute('sendeventonafterhide', value);
        }
    }

    public get sendEventOnAfterHide(): string {
        return this._sigNameSendOnAfterHide;
    }

    //
    // Events
    //

    //
    protected _onShow(inEvent: Event): void {
        this.info('_onShow()');

    }

    protected _onHide(inEvent: Event): void {
        this.info('_onHide()');
        this._onAfterHide(inEvent);
    }

    protected _onBeforeShow(inEvent: Event): void {
        this.info('_onBeforeShow()');
        // this._sendPulse(this._sigNameSendOnBeforeShow);
    }

    protected _onAfterShow(inEvent: Event): void {
        this.info('_onAfterShow()');
        // this._sendPulse(this._sigNameSendOnAfterShow);
    }

    protected _onBeforeHide(inEvent: Event): void {
        this.info('_onBeforeHide()');
        // this._sendPulse(this._sigNameSendOnBeforeHide);
    }

    protected _onAfterHide(inEvent: Event): void {
        this.info('_onAfterHide()');
        // this._sendPulse(this._sigNameSendOnAfterHide);
    }

    protected _sendPulse(sigName: string) {
        let sigToSend: Ch5Signal<boolean> | null = null;
        if ('' !== sigName
            && 'undefined' !== typeof sigName
            && null !== sigName) {

            sigToSend = Ch5SignalFactory.getInstance().getBooleanSignal(sigName);

            if (null !== sigToSend) {
                sigToSend.publish(true);
                sigToSend.publish(false);
            }
        }
    }

    private _insertAfter(el: Element, referenceNode: Element) {
        if (null !== referenceNode && null !== referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        }
    }
}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {

    window.customElements.define('ch5-overlay-panel', Ch5OverlayPanel);
}

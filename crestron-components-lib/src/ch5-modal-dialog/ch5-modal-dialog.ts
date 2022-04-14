// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5OverlayPanel, } from "../ch5-overlay-panel/index";
import { Ch5Signal } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Button } from "../ch5-button/ch5-button";
import { ICh5ModalDialogAttributes } from "./interfaces/i-ch5-modal-dialog-attributes";
import {Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries} from '../ch5-common/ch5-signal-attribute-registry';
import {Ch5Common} from '../ch5-common/ch5-common';

// @ts-ignore
/**
 * Html Attributes
 *
 * - width
 * - height
 * - title
 * - hideOkButton
 * - okButtonLabel
 * - okButtonIcon
 * - okButtonStyle
 * - hideCancelButton
 * - cancelButtonLabel
 * - cancelButtonIcon
 * - cancelButtonStyle
 * - prompt
 * - promptIcon
 *
 * - sendEventOnOk
 * - sendEventOnCancel
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
 * Inherited from Ch5Common
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
export class Ch5ModalDialog extends Ch5OverlayPanel implements ICh5ModalDialogAttributes {

    public static readonly ELEMENT_NAME: string = 'ch5-modal-dialog';

    public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
        ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
        receivestatepositionto: { direction: "state", numericJoin: 1, contractName: true },
        receivestatepositionoffset: { direction: "state", numericJoin: 1, contractName: true },

        sendeventonbeforeshow: { direction: "state", booleanJoin: 1, contractName: true },
        sendeventonaftershow: { direction: "state", booleanJoin: 1, contractName: true },
        sendeventonbeforehide: { direction: "state", booleanJoin: 1, contractName: true },
        sendeventonafterhide: { direction: "state", booleanJoin: 1, contractName: true },
        sendeventonok: {direction: "state", booleanJoin: 1, contractName: true},
        contractname: {contractName: true},
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
    };

    public static readonly COMPONENT_DATA: any = {
        POSITION_OFFSETS: {
            default: Ch5OverlayPanel.POSITION_OFFSETS[0],
            values: Ch5OverlayPanel.POSITION_OFFSETS,
            key: 'position_offset',
            classListPrefix: 'ch5-modal-dialog--pos-'
        },
        STRETCH: {
            default: Ch5OverlayPanel.STRETCHES[0],
            values: Ch5OverlayPanel.STRETCHES,
            key: 'stretch',
            classListPrefix: 'ch5-modal-dialog--stretch-'
        },
        OVERFLOWS: {
            default: Ch5OverlayPanel.OVERFLOWS[0],
            values: Ch5OverlayPanel.OVERFLOWS,
            key: 'overflow',
            classListPrefix: 'ch5-modal-dialog--overflow-'
        },
    };

    public primaryCssClass = 'ch5-modal-dialog';
    public cssClassPrefix = 'ch5-modal-dialog';

    /**
     * A div element that is external to this component. Its role is to provide mask that stretches over the entire
     * viewport. The overlay will be displayed over this mask. The mask will capture click/touch events made outside
     * the overlay.
     */
    protected _elMask: HTMLElement = {} as HTMLElement;

    /**
     * The HTML element that contains the text specified in the title attribute
     */
    protected _elHeader: HTMLElement = {} as HTMLElement;

    /**
     * The div element that contains the prompt section
     */
    protected _elPrompt: HTMLElement = {} as HTMLElement;

    protected _elPromptIcon: HTMLElement = {} as HTMLElement;

    protected _elPromptText: HTMLElement = {} as HTMLElement;

    /**
     * The div element that contains the buttons
     */
    protected _elFooter: HTMLElement = {} as HTMLElement;

    protected _elBtnOk: Ch5Button = {} as Ch5Button;

    protected _elBtnCancel: Ch5Button = {} as Ch5Button;

    /**
     * The width of the window
     *
     * HTML attribute: width
     */
    protected _width: string = '';

    /**
     * The height of the window
     *
     * HTML attribute: height
     */
    protected _height: string = '';

    /**
     * Header title text
     * if absent or empty hides the title bar
     * HTML attribute: title
     */
    protected _title: string = '';

    /**
     * Default false
     * If true apply a background mask.
     *
     * HTML attribute name: mask
     */
    protected _mask: boolean = false;

    /**
     * Inline css style added to the background mask
     *
     * HTML attribute name: maskStyle
     */
    protected _maskStyle: string = '';

    /**
     * If true hides the ok button
     * HTML attribute: hideOkButton
     */
    protected _hideOkButton: boolean = false;

    /**
     * Text that will be used for the okButton.
     *
     * HTML attribute: okButtonLabel
     */
    protected _okButtonLabel: string = '';

    /**
     * Icon that will be used for the ok button
     *
     * HTML attribute: okButtonIcon
     */
    protected _okButtonIcon: string = '';

    /**
     * Inline style that will be used for the okButton
     *
     * HTML attribute: okButtonStyle
     */
    protected _okButtonStyle: string = '';

    /**
     * If true hides the cancelButton
     * HTML attribute: hideCancelButton
     */
    protected _hideCancelButton: boolean = false;

    /**
     * Text that will be used for the cancelButton.
     *
     * HTML attribute: cancelButtonLabel
     */
    protected _cancelButtonLabel: string = '';

    /**
     * Icon that will be used for the cancelButton
     *
     * HTML attribute: cancelButtonIcon
     */
    protected _cancelButtonIcon: string = '';

    /**
     * Inline style that will be used for the cancelButton
     *
     * HTML attribute: cancelButtonStyle
     */
    protected _cancelButtonStyle: string = '';

    /**
     * Optional message text
     *
     * HTML attribute: prompt
     */
    protected _prompt: string = '';

    /**
     * Icon that appears next to the prompt text
     *
     * HTML attribute: promptIcon
     */
    protected _promptIcon: string = '';

    /**
     * The name of the boolean signal that will be sent when the Ok button is pressed
     *
     * HTML attribute name: sendEventOnOk
     */
    protected _sigNameSendOnOk: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnOk
     */
    protected _sigSendOnOk: Ch5Signal<boolean> | null = null;

    /**
     * The name of the boolean signal that will be sent when the Cancel button is pressed
     *
     * HTML attribute name: sendEventOnCancel
     */
    protected _sigNameSendOnCancel: string = '';

    /**
     * The boolean Ch5Signal for sendEventOnCancel
     */
    protected _sigSendOnCancel: Ch5Signal<boolean> | null = null;

    protected _btnOkDefaultLabelText = 'Ok';

    protected _btnCancelDefaultLabelText = 'Cancel';

    /**
     * Events
     * Inherited
     * show
     * hide
     * beforeShow
     * afterShow
     * beforeHide
     * afterHide
     */

    private _okEvent: Event;

    private _cancelEvent: Event;

    private _crModalWasInstatiated: boolean = false;


    public constructor() {
        super();
        this.info('Ch5ModalDialog.constructor()');
        this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();

        if (!this._crModalWasInstatiated) {
            this._rebindEventCallbacks();
            this.createInternalHtml();
            this._closeIcon = this.cssClassPrefix + '-default-close-icon';
        }
        this._crModalWasInstatiated = true;

        this._okEvent = new CustomEvent('ok', {
            bubbles: true,
            cancelable: false
        });

        this._cancelEvent = new CustomEvent('cancel', {
            bubbles: true,
            cancelable: false
        });

        this._cancelButtonLabel = this._btnCancelDefaultLabelText;
        this._okButtonLabel = this._btnOkDefaultLabelText;

    }

    public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ModalDialog.ELEMENT_NAME, Ch5ModalDialog.SIGNAL_ATTRIBUTE_TYPES);
	}


    protected attachEventListeners() {
        super.attachEventListeners();

        if (!this._elBtnCancel) {
            return;
        }

        if (!this._elBtnOk) {
            return;
        }

        this._elBtnOk.addEventListener('click', this._onOkClick);
        this._elBtnCancel.addEventListener('click', this._onCancelClick);
    }

    protected removeEventListeners() {
        super.removeEventListeners();

        this._elBtnOk.removeEventListener('click', this._onOkClick);
        this._elBtnCancel.removeEventListener('click', this._onCancelClick);

    }

    protected _rebindEventCallbacks() {
        super._rebindEventCallbacks();

        this._onOkClick = this._onOkClick.bind(this);
        this._onCancelClick = this._onCancelClick.bind(this);

        this._clickedOnMask = this._clickedOnMask.bind(this);
    }

    protected _onOkClick(inEvent: Event) {
        this.info('_onOkClick()');
        this.dispatchEvent(this._okEvent);
        this.setAttribute('show', 'false');
    }

    protected _onCancelClick(inEvent: Event) {
        this.info('_onCancelClick()');
        this.dispatchEvent(this._cancelEvent);
        this.setAttribute('show', 'false');
    }

    protected _parseSizeAttr(value: string) {
        let retVal: string = value.trim().toLowerCase();

        if (retVal.indexOf('px') === -1) {
            retVal += 'px';
        }

        return retVal;
    }

    protected _clickedOnMask(inEvent: Event) {
        this.info('_clickedOnMask()');
        if (true === this.mask && true === this.dismissable) {
            this.setAttribute('show', 'false');
        }
        inEvent.stopPropagation();
        return false;
    }

    protected _checkAndAttachMaskIfNeeded() {
        if (true === this.mask
            && this._elMask.parentElement !== this
            && this._elContainer.parentElement === this) {
            this.insertBefore(this._elMask, this._elContainer);
        }
    }

    protected getTargetElementForCssClassesAndStyle(): HTMLElement {
        return this._elContainer;
    }

    protected updatePosition() {
        // do nothing since ch5-modal-dialog does not implement positionTo and positionOffset
    }

    protected updateForChangeInClosable() {
        this.adjustInternalHtmlStructure();
    }

    protected updateForChangeInStretch() {
        const targetEl = this.getTargetElementForCssClassesAndStyle();
        const horizontalMargin = 10;
        const verticalMargin = 5;

        switch (this.stretch) {
            case 'width':
                if (!this.hasAttribute('width')) {
                    targetEl.style.width = window.innerWidth - (2 * horizontalMargin) + 'px';
                }
                break;
            case 'height':
                if (!this.hasAttribute('height')) {
                    targetEl.style.height = window.innerHeight - (2 * verticalMargin) + 'px';
                }
                break;
            case 'both':
                if (!this.hasAttribute('width')) {
                    targetEl.style.width = window.innerWidth - (2 * horizontalMargin) + 'px';
                }
                if (!this.hasAttribute('height')) {
                    targetEl.style.height = window.innerHeight - (2 * verticalMargin) + 'px';
                }
                break;
        }
    }

    public connectedCallback() {
        // super.connectedCallback();
        this.info('ch5-modal connectedCallback()');
        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5ModalDialog);
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

    public disconnectedCallback() {
        this.info('ch5-modal disconnectedCallback()');
        super.disconnectedCallback();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    public static get observedAttributes() {
        const inheritedObsAttrs = Ch5OverlayPanel.observedAttributes;

        // remove positionTo, positionOffset, receiveStatePositionTo, receiveStatePositionOffset
        inheritedObsAttrs.filter((attr: string) => {
            let skip = false;
            const lcAttr = attr.toLowerCase();
            if (lcAttr === 'positionto' || lcAttr === 'positionoffset'
                || lcAttr === 'receivestatepositionto'
                || lcAttr === 'receivestatepositionoffset') {
                skip = true;
            }

            return skip;
        });

        const newObsAttrs = [

            'width',
            'height',
            'title',
            'hideokbutton',
            'okbuttonlabel',
            'okbuttonicon',
            'okbuttonstyle',
            'hidecancelbutton',
            'cancelbuttonlabel',
            'cancelbuttonicon',
            'cancelbuttonstyle',
            'prompt',
            'prompticon',
            'mask',
            'maskstyle',


            'sendeventonok',
            'sendeventoncancel'

        ];

        return inheritedObsAttrs.concat(newObsAttrs);
    }

    public getListOfAllPossibleComponentCssClasses(): string[] {
        return super.getListOfAllPossibleComponentCssClasses();
    }

    protected _initialize() {
        this.info('ch5-modal _initialize()');

        const existingModal = this.querySelector(`.${this.primaryCssClass}`);

        if (!existingModal) {
            while (this.childNodes.length) {
                this._elContents.appendChild(this.childNodes[0]);
            }
            this.appendChild(this._elContainer);
            this.adjustInternalHtmlStructure();

            this.cacheComponentChildrens();
        }

        this.initAttributes();
        this._checkAndAttachMaskIfNeeded();
        this.updateCssClasses();
        this.attachEventListeners();
    }

    protected initAttributes() {
        super.initAttributes();

        if (this.hasAttribute('width')
            && null !== this.getAttribute('width')) {
            this.width = this._parseSizeAttr(this.getAttribute('width') as string);
        }

        if (this.hasAttribute('height')
            && null !== this.getAttribute('height')) {
            this.height = this._parseSizeAttr(this.getAttribute('height') as string);
        }

        if (this.hasAttribute('title')
            && null !== this.getAttribute('title')) {
            this.title = this.getAttribute('title') as string;
        }

        if (this.hasAttribute('hideokbutton')) {
            const tmpHideOk = this.getAttribute('hideokbutton') as string;
            if ('0' === tmpHideOk || 'false' === tmpHideOk.toLowerCase()) {
                this.hideOkButton = false;
            } else {
                this.hideOkButton = true;
            }
        } else {
            this.hideOkButton = false;
        }

        if (this.hasAttribute('okbuttonlabel')
            && null !== this.getAttribute('okbuttonlabel')) {
            this.okButtonLabel = this.getAttribute('okbuttonlabel') as string;
        }

        if (this.hasAttribute('okbuttonicon')
            && null !== this.getAttribute('okbuttonicon')) {
            this.okButtonIcon = this.getAttribute('okbuttonicon') as string;
        }

        if (this.hasAttribute('okbuttonstyle')
            && null !== this.getAttribute('okbuttonstyle')) {
            this.okButtonStyle = this.getAttribute('okbuttonstyle') as string;
        }

        if (this.hasAttribute('hidecancelbutton')) {
            const tmpHideCancel = this.getAttribute('hidecancelbutton') as string;
            if ('0' === tmpHideCancel || 'false' === tmpHideCancel.toLowerCase()) {
                this.hideCancelButton = false;
            } else {
                this.hideCancelButton = true;
            }
        } else {
            this.hideCancelButton = false;
        }

        if (this.hasAttribute('cancelbuttonlabel')
            && null !== this.getAttribute('cancelbuttonlabel')) {
            this.cancelButtonLabel = this.getAttribute('cancelbuttonlabel') as string;
        }

        if (this.hasAttribute('cancelbuttonicon')
            && null !== this.getAttribute('cancelbuttonicon')) {
            this.cancelButtonIcon = this.getAttribute('cancelbuttonicon') as string;
        }

        if (this.hasAttribute('cancelbuttonstyle')
            && null !== this.getAttribute('cancelbuttonstyle')) {
            this.cancelButtonStyle = this.getAttribute('cancelbuttonstyle') as string;
        }

        if (this.hasAttribute('prompt')
            && null !== this.getAttribute('prompt')) {
            this.prompt = this.getAttribute('prompt') as string;
        }

        if (this.hasAttribute('prompticon')
            && null !== this.getAttribute('prompticon')) {
            this.promptIcon = this.getAttribute('prompticon') as string;
        }

        if (this.hasAttribute('mask')) {
            const tmpMask = this.getAttribute('mask') as string;
            if ('0' === tmpMask
                || 'false' === tmpMask.toLowerCase()) {
                this.mask = false;
            } else {
                this.mask = true;
            }
        } else {
            this.mask = false;
        }

        if (this.hasAttribute('maskstyle')
            && null !== this.getAttribute('maskstyle')) {
            this.maskStyle = this.getAttribute('maskstyle') as string;
        } else {
            this.maskStyle = '';
        }

        if (this.hasAttribute('sendeventonok')
            && null !== this.getAttribute('sendeventonok')) {
            this.sendEventOnOk = this.getAttribute('sendeventonok') as string;
        } else {
            this.sendEventOnOk = '';
        }

        if (this.hasAttribute('sendeventoncancel')
            && null !== this.getAttribute('sendeventoncancel')) {
            this.sendEventOnCancel = this.getAttribute('sendeventoncancel') as string;
        } else {
            this.sendEventOnCancel = '';
        }

        this._checkAndAttachMaskIfNeeded();
        this.adjustInternalHtmlStructure();

        if (this.hasAttribute('positionto')) {
            this.removeAttribute('positionto');
        }

        if (this.hasAttribute('positionoffset')) {
            this.removeAttribute('positionoffset');
        }

        if (this.hasAttribute('receivestatepositionto')) {
            this.removeAttribute('receivestatepositionto');
        }

        if (this.hasAttribute('receivestatepositionoffset')) {
            this.removeAttribute('receivestatepositionoffset');
        }

    }

    protected generateListOfAllPossibleComponentCssClasses(): string[] {
        return super.generateListOfAllPossibleComponentCssClasses();
    }

    protected updateCssClasses(): void {
        // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
        // super.updateCssClasses();
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

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-modal-dialog attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')');

        switch (attr) {
            case 'width':
                if (this.hasAttribute('width')) {
                    this.width = this._parseSizeAttr(this.getAttribute('width') as string);
                }
                break;

            case 'height':
                if (this.hasAttribute('height')) {
                    this.height = this._parseSizeAttr(this.getAttribute('height') as string);
                }
                break;
            case 'title':
                if (this.hasAttribute('title')) {
                    this.title = this.getAttribute('title') as string;
                }
                this.adjustInternalHtmlStructure();
                break;
            case 'hideokbutton':
                if (this.hasAttribute('hideokbutton')) {
                    const tmpHideOk = this.getAttribute('hideokbutton') as string;
                    if ('0' === tmpHideOk || 'false' === tmpHideOk.toLowerCase()) {
                        this.hideOkButton = false;
                    } else {
                        this.hideOkButton = true;
                    }
                } else {
                    this.hideOkButton = false;
                }
                this.adjustInternalHtmlStructure();
                break;
            case 'okbuttonlabel':
                if (this.hasAttribute('okbuttonlabel')) {
                    this.okButtonLabel = this.getAttribute('okbuttonlabel') as string;
                }
                break;
            case 'okbuttonicon':
                if (this.hasAttribute('okbuttonicon')) {
                    this.okButtonIcon = this.getAttribute('okbuttonicon') as string;
                }
                break;
            case 'okbuttonstyle':
                if (this.hasAttribute('okbuttonstyle')) {
                    this.okButtonStyle = this.getAttribute('okbuttonstyle') as string;
                }
                break;
            case 'hidecancelbutton':
                if (this.hasAttribute('hidecancelbutton')) {
                    const tmpHideCancel = this.getAttribute('hidecancelbutton') as string;
                    if ('0' === tmpHideCancel || 'false' === tmpHideCancel.toLowerCase()) {
                        this.hideCancelButton = false;
                    } else {
                        this.hideCancelButton = true;
                    }
                } else {
                    this.hideCancelButton = false;
                }
                this.adjustInternalHtmlStructure();
                break;
            case 'cancelbuttonlabel':
                if (this.hasAttribute('cancelbuttonlabel')) {
                    this.cancelButtonLabel = this.getAttribute('cancelbuttonlabel') as string;
                }
                break;
            case 'cancelbuttonicon':
                if (this.hasAttribute('cancelbuttonicon')) {
                    this.cancelButtonIcon = this.getAttribute('cancelbuttonicon') as string;
                }
                break;
            case 'cancelbuttonstyle':
                if (this.hasAttribute('cancelbuttonstyle')) {
                    this.cancelButtonStyle = this.getAttribute('cancelbuttonstyle') as string;
                }
                break;
            case 'prompt':
                if (this.hasAttribute('prompt')) {
                    this.prompt = this.getAttribute('prompt') as string;
                }
                this.adjustInternalHtmlStructure();
                break;
            case 'prompticon':
                if (this.hasAttribute('prompticon')) {
                    this.promptIcon = this.getAttribute('prompticon') as string;
                }
                this.adjustInternalHtmlStructure();
                break;
            case 'mask':
                if (this.hasAttribute('mask')) {
                    const tmpMask = this.getAttribute('mask') as string;
                    if ('0' === tmpMask
                        || 'false' === tmpMask.toLowerCase()) {
                        this.mask = false;
                    } else {
                        this.mask = true;
                    }
                } else {
                    this.mask = false;
                }
                this._checkAndAttachMaskIfNeeded();
                break;
            case 'maskstyle':
                if (this.hasAttribute('maskstyle')) {
                    this.maskStyle = newValue;
                } else {
                    this.maskStyle = '';
                }
                break;
            case 'sendeventonok':
                if (this.hasAttribute('sendeventonok')) {
                    this.sendEventOnOk = newValue;
                } else {
                    this.sendEventOnOk = '';
                }
                break;
            case 'sendeventoncancel':
                if (this.hasAttribute('sendeventoncancel')) {
                    this.sendEventOnCancel = newValue;
                } else {
                    this.sendEventOnCancel = '';
                }
                break;
            case 'positionto':
                // do nothing
                break;
            case 'positionoffset':
                // do nothing
                break;
            case 'receivestatepositionto':
                // do nothing
                break;
            case 'receivestatepositionoffset':
                // do nothing
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    protected createInternalHtml() {
        // super.createInternalHtml();

        const existingModal = this.querySelector(`.${this.primaryCssClass}`);

        if (!existingModal) {

            this.info('ch5-modal-dialog create internal Html');
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

            this._elHeader = document.createElement('div');
            this._elHeader.classList.add(this.cssClassPrefix + '-header');

            this._elPrompt = document.createElement('div');
            this._elPrompt.classList.add(this.cssClassPrefix + '-prompt');
            this._elPromptIcon = document.createElement('img');
            this._elPromptIcon.classList.add(this.cssClassPrefix + '-prompt-icon');
            this._elPromptText = document.createElement('span');
            this._elPromptText.classList.add(this.cssClassPrefix + '-prompt-text');

            this._elFooter = document.createElement('div');
            this._elFooter.classList.add(this.cssClassPrefix + '-footer');

            this._elBtnOk = new Ch5Button();
            this._elBtnOk.setAttribute('type', 'success');
            this._elBtnOk.setAttribute('label', this._btnOkDefaultLabelText);
            // this._elBtnOk.setAttribute('customClass', this.cssClassPrefix + '-btn-ok');
            this._elBtnOk.classList.add(this.cssClassPrefix + '-btn-ok');

            this._elBtnCancel = new Ch5Button();
            this._elBtnCancel.setAttribute('type', 'warning');
            this._elBtnCancel.setAttribute('label', this._btnCancelDefaultLabelText);
            // this._elBtnCancel.setAttribute('customClass', this.cssClassPrefix + '-btn-cancel');
            this._elBtnCancel.classList.add(this.cssClassPrefix + '-btn-cancel');

            this._elContents = document.createElement('div');
            this._elContents.classList.add(this.cssClassPrefix + '-contents');

            this._elContainer.classList.add(this.primaryCssClass);
            this._elContainer.setAttribute('data-ch5-id', this.getCrId());

            // this._elContainer.appendChild(this._elCloseIconBtn);
            // this._elContainer.appendChild(this._elContents);


            this._elMask = document.createElement('div');
            this._elMask.classList.add(this.cssClassPrefix + '-mask');
            this._elMask.classList.add(this.cssClassPrefix + '-mask-default-style');
            this._elMask.setAttribute('cr-id', this.getCrId() + '-mask');
        } else {
            this._elCloseIconBtn = this.querySelector(`.${this.cssClassPrefix}-close-icon-btn`) as HTMLElement;
            this._elCloseIcon = this.querySelector(`.${this.cssClassPrefix}-close-icon`) as HTMLElement;
            this._elHeader = this.querySelector(`.${this.cssClassPrefix}-header`) as HTMLElement;
            this._elPrompt = this.querySelector(`.${this.cssClassPrefix}-prompt`) as HTMLElement;
            this._elPromptIcon = this.querySelector(`.${this.cssClassPrefix}-prompt-icon`) as HTMLElement;
            this._elPromptText = this.querySelector(`.${this.cssClassPrefix}-prompt-text`) as HTMLElement;
            this._elFooter = this.querySelector(`.${this.cssClassPrefix}-footer`) as HTMLElement;
            this._elBtnOk = this.querySelector(`.${this.cssClassPrefix}-btn-ok`) as Ch5Button;
            this._elBtnCancel = this.querySelector(`.${this.cssClassPrefix}-btn-cancel`) as Ch5Button;
            this._elContents = this.querySelector(`.${this.cssClassPrefix}-contents`) as HTMLElement;
            this._elContainer = existingModal as HTMLElement;
            this._elMask = this.querySelector(`.${this.cssClassPrefix}-mask`) as HTMLElement;
        }

    }

    protected adjustInternalHtmlStructure() {
        const docFrag = document.createDocumentFragment();

        if (this.closable) {
            docFrag.appendChild(this._elCloseIconBtn);
        } else {
            this._elCloseIconBtn.remove();
        }

        if (this.title !== '') {
            this._elHeader.textContent = this.title;
            docFrag.appendChild(this._elHeader);
        } else if (this._elHeader) {
            this._elHeader.remove();
        }

        if (this.prompt !== '' || this.promptIcon !== '') {
            if (this.promptIcon !== '') {
                this._elPromptIcon.setAttribute('src', this.promptIcon);
                this._elPrompt.appendChild(this._elPromptIcon);
            } else if (this._elPromptIcon) {
                this._elPromptIcon.remove();
            }

            if (this.prompt !== '' && this._elPromptText instanceof Node) {
                this._elPromptText.textContent = this.prompt;
                this._elPrompt.appendChild(this._elPromptText);
                if (this._elPromptIcon instanceof Node) {
                    this._elPrompt.insertBefore(this._elPromptIcon, this._elPromptText);
                }
            } else if (this._elPromptText instanceof Node) {
                this._elPromptText.remove();
            }

            docFrag.appendChild(this._elPrompt);
        } else if (this._elPrompt) {
            this._elPrompt.remove();
        }

        docFrag.appendChild(this._elContents);

        if (!this.hideOkButton || !this.hideCancelButton) {
            docFrag.appendChild(this._elFooter);
            if (!this.hideOkButton) {
                this._elFooter.appendChild(this._elBtnOk);
            } else if (this._elBtnOk) {
                this._elBtnOk.remove();
            }

            if (!this.hideCancelButton) {
                this._elFooter.appendChild(this._elBtnCancel);
            } else if (this._elBtnCancel) {
                this._elBtnCancel.remove();
            }
        } else if (this._elFooter) {
            this._elFooter.remove();
        }

        this._elContainer.appendChild(docFrag);
    }

    protected afterHandlingShow() {
        super.afterHandlingShow();
        // Using EventLoop to attach event listener
        // to document only after all event pipeline was called ( mousedown -> mouseup -> click)
        // Attaching it when mousedown is triggered and that event being attached to document
        // this will be triggerd as well.
        setTimeout(() => {
            if (this._elMask) {
                this._elMask.addEventListener('click', this._clickedOnMask);
            }
        })
    }

    protected afterHandlingHide() {
        super.afterHandlingHide();
        if (this._elMask) {
            this._elMask.removeEventListener('click', this._clickedOnMask);
        }
    }

    // Getters and setters
    public set width(value: string) {
        this.info('set width' + value);
        if (value !== this._width) {
            this._width = value;
            const targetEl = this.getTargetElementForCssClassesAndStyle();
            if (targetEl) {
                targetEl.style.width = this._parseSizeAttr(this._width);
            }
            this.setAttribute('width', value);
        }
    }

    public get width(): string {
        return this._width;
    }

    public set height(value: string) {
        this.info('set height' + value);
        if (value !== this._height) {
            this._height = value;
            const targetEl = this.getTargetElementForCssClassesAndStyle();
            if (targetEl) {
                targetEl.style.height = this._parseSizeAttr(this._height);
            }
            this.setAttribute('height', value);
        }
    }

    public get height(): string {
        return this._height;
    }

    public set title(value: string) {
        this.info('set title ' + value);

        if (value === undefined || value === null) {
            value = '';
        }
        const trValue = this._getTranslatedValue('title', value);

        if (trValue === this.title) {
            return;
        }

        this._title = trValue;
        this.setAttribute('title', trValue);

        if (this._elHeader instanceof HTMLElement) {
            this._elHeader.textContent = trValue;
        }

    }

    public get title(): string {
        return this._title;
    }

    public set mask(value: boolean) {
        this.info('set mask("' + value + '")');
        if (this._mask !== value) {
            if (typeof value === 'undefined' || null === value) {
                value = false;
            }
            this._mask = value;
            this.setAttribute('mask', value.toString());
        }
        if (true === this._mask) {
            this._elMask.classList.add(this.primaryCssClass + '-mask-default-style');
        } else {
            this._elMask.classList.remove(this.primaryCssClass + '-mask-default-style');
        }
    }

    public get mask(): boolean {
        return this._mask;
    }

    public set maskStyle(value: string) {
        this.info('set maskStyle("' + value + '")');
        if (this._maskStyle !== value) {
            this._maskStyle = value;
            this._elMask.style.cssText = value;
            this.setAttribute('maskstyle', value);
        }
    }

    public get maskStyle() {
        return this._maskStyle;
    }

    public set hideOkButton(value: boolean) {
        this.info('set hideOkButton("' + value + '")');
        if (value !== this._hideOkButton) {
            this._hideOkButton = value;
            this.setAttribute('hideokbutton', value.toString());
        }
    }

    public get hideOkButton(): boolean {
        return this._hideOkButton;
    }

    public set okButtonLabel(value: string) {
        this.info('set okButtonLabel' + value);

        if (value === undefined || value === null) {
            value = '';
        }
        const trValue = this._getTranslatedValue('okButtonLabel', value);

        if (this.okButtonLabel === trValue) {
            return;
        }

        this._okButtonLabel = trValue;
        if (this._elBtnOk instanceof HTMLElement) {
            this._elBtnOk.setAttribute('label', trValue);
        }
        this.setAttribute('okbuttonlabel', trValue);

    }

    public get okButtonLabel(): string {
        return this._okButtonLabel;
    }

    public set okButtonIcon(value: string) {
        this.info('set okButtonIcon ' + value);

        if (this._okButtonIcon !== value) {
            this._okButtonIcon = value;
            this._elBtnOk.setAttribute('iconClass', value);
            this.setAttribute('okbuttonicon', value);
        }
    }

    public get okButtonIcon(): string {
        return this._okButtonIcon;
    }

    public set okButtonStyle(value: string) {
        this.info('set okButtonStyle ' + value);
        if (value !== this._okButtonStyle) {
            this._okButtonStyle = value;
            this._elBtnOk.setAttribute('customStyle', value);
            this.setAttribute('okbuttonstyle', value);
        }
    }

    public get okButtonStyle(): string {
        return this._okButtonStyle;
    }

    public set hideCancelButton(value: boolean) {
        this.info('set hideCancelButton' + value);
        if (value !== this._hideCancelButton) {
            this._hideCancelButton = value;
            this.setAttribute('hidecancelbutton', value.toString());
        }
    }

    public get hideCancelButton(): boolean {
        return this._hideCancelButton;
    }

    public set cancelButtonLabel(value: string) {
        this.info('set cancelButtonLabel' + value);


        if (value === undefined || value === null) {
            value = '';
        }
        const trValue = this._getTranslatedValue('cancelButtonLabel', value);

        if (this.cancelButtonLabel === trValue) {
            return;
        }

        this._cancelButtonLabel = trValue;

        if (this._elBtnCancel instanceof HTMLElement) {
            this._elBtnCancel.setAttribute('label', trValue);
        }
        this.setAttribute('cancelbuttonlabel', trValue);
    }

    public get cancelButtonLabel(): string {
        return this._cancelButtonLabel;
    }

    public set cancelButtonIcon(value: string) {
        this.info('set cancelButtonIcon ' + value);

        if (this._cancelButtonIcon !== value) {
            this._cancelButtonIcon = value;
            this._elBtnCancel.setAttribute('iconClass', value);
            this.setAttribute('cancelbuttonicon', value);
        }

    }

    public get cancelButtonIcon(): string {
        return this._cancelButtonIcon;
    }

    public set cancelButtonStyle(value: string) {
        this.info('set cancelButtonStyle ' + value);
        if (value !== this._cancelButtonStyle) {
            this._cancelButtonStyle = value;
            this._elBtnCancel.setAttribute('customStyle', value);
            this.setAttribute('cancelbuttonstyle', value);
        }
    }

    public get cancelButtonStyle(): string {
        return this._cancelButtonStyle;
    }

    public set prompt(value: string) {
        this.info('set prompt ' + value);

        const _value = value;

        if (value === undefined || value === null) {
            value = '';
        }
        const trValue = this._getTranslatedValue('prompt', value);

        if (this.prompt === trValue) {
            return;
        }
        this._prompt = trValue;

        if (this._elPromptText instanceof HTMLElement) {
            this._elPromptText.textContent = trValue;
        }
        this.setAttribute('prompt', trValue);

    }

    public get prompt(): string {
        return this._prompt
    }

    public set promptIcon(value: string) {
        this.info('set promptIcon ' + value);
        if (value !== this._promptIcon) {
            this._promptIcon = value;
            this.setAttribute('prompticon', value);
        }
    }

    public get promptIcon(): string {
        return this._promptIcon;
    }

    public set sendEventOnOk(value: string) {
        this.info('set sendEventOnOk ' + value);
        if (value !== this._sigNameSendOnOk) {
            this._sigNameSendOnOk = value;
            this._elBtnOk.setAttribute('sendEventOnClick', value);
            this.setAttribute('sendeventonok', value);
        }
    }

    public get sendEventOnOk(): string {
        return this._sigNameSendOnOk;
    }

    public set sendEventOnCancel(value: string) {
        this.info('set sendEventOnCancel ' + value);
        if (value !== this._sigNameSendOnCancel) {
            this._sigNameSendOnCancel = value;
            this._elBtnCancel.setAttribute('sendEventOnClick', value);
            this.setAttribute('sendeventoncancel', value);
        }
    }

    public get sendEventOnCancel(): string {
        return this._sigNameSendOnCancel;
    }


}
if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define(Ch5ModalDialog.ELEMENT_NAME, Ch5ModalDialog);
}

Ch5ModalDialog.registerSignalAttributeTypes();
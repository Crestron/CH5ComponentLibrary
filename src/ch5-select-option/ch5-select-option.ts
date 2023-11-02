// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import "hammerjs";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory, Ch5Uid } from "../ch5-core";
import { Ch5Select } from "../ch5-select/ch5-select";
import { Ch5Toggle } from "../ch5-toggle/ch5-toggle";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5SelectOptionAttributes } from "./interfaces/i-ch5-select-option-attributes";
import {Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries} from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5SelectOption extends Ch5Common implements ICh5SelectOptionAttributes {

    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
        this._onPress = this._onPress.bind(this);
        this._onPressUp = this._onPressUp.bind(this);
    }

    public static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;
        const ch5SelectOptionAttributes: string[] = ['iconposition', 'receivestateselected', 'receivestatelabel',
            'receivestateurl', 'receivestatescriptlabelhtml', 'sendeventonclick', 'data-ch5-opt-idx'];

        return commonAttributes.concat(ch5SelectOptionAttributes);
    }

    public get iconPosition() {
        return this._iconPosition;
    }

    public set iconPosition(value: string) {
        value = this._checkAndSetStringValue(value);
        if (this._iconPosition !== value) {
            this._iconPosition = value;
            this.setAttribute('iconposition', value);
        }
    }

    /**
     * TODO: This proprety was not existing earlier, but is consumed/referred within the code
     * This property is created for the same and needs to be tested
     */
    public get useDefaultTmpl() {
        return this._useDefaultTmpl;
    }

    public set useDefaultTmpl(value: boolean) {
        value = this.checkIfValueIsTruey(value.toString());
        if (this._useDefaultTmpl !== value) {
            this._useDefaultTmpl = value;
            // TODO: BELOW CODE CHANGE NOT REQUIRED
            // NEEDS TO BE VERIFIED BEFORE SETTING THE ATTRIBUTE WITH THE VALUE IF REQUIRED
            // this.setAttribute('useDefaultTmpl', value.toString());
        }
    }

    // receive signal attributes
    public get receiveStateSelected() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestateselected');
    }

    public set receiveStateSelected(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateSelected !== value) {
            this._receiveStateSelected = value;
            this.setAttribute('receivestateselected', value);
            // subscribe to signal
            this._handleReceiveSignalSelected();

            if (this._ch5Toggle !== null && this.defaultTmplIsUsed()) {
                this._ch5Toggle.setAttribute('receiveStateSelected', value as string);
            }
        }
    }

    public get receiveStateLabel() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatelabel');
    }

    public set receiveStateLabel(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateLabel !== value) {
            this._receiveStateLabel = value;
            this.setAttribute('receivestatelabel', value);
            this._handleReceiveSignalLabel();
        }
    }

    public get receiveStateUrl() {
        return this._receiveStateUrl;
    }

    public set receiveStateUrl(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateUrl !== value) {
            this._receiveStateUrl = value;
            this.setAttribute('receivestateurl', value);
        }
    }

    public get receiveStateScriptLabelHTML() {
        return this._receiveStateScriptLabelHTML;
    }

    public set receiveStateScriptLabelHTML(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateScriptLabelHTML !== value) {
            this._receiveStateScriptLabelHTML = value;
            this.setAttribute('receivestatescriptlabelhtml', value);
            if (this._ch5Toggle !== null && this.defaultTmplIsUsed()) {
                this._ch5Toggle.setAttribute('receiveStateScriptLabelHTML', value as string);
            }
        }
    }

    public get sendEventOnClick() {
        return this._sendEventOnClick;
    }

    public set sendEventOnClick(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._sendEventOnClick !== value) {
            this._sendEventOnClick = value;
            this.setAttribute('sendeventonclick', value);
            if (this._ch5Toggle !== null && this.defaultTmplIsUsed()) {
                this._ch5Toggle.setAttribute('sendEventOnClick', value as string);
            }
        }
    }

    public get idx() {
        return this._idx;
    }

    public set idx(value: number) {
        if (this._idx !== value) {
            this._idx = value;
        }
    }

    public get optLabel() {
        return this._optLabel;
    }

    public set optLabel(value: string) {
        if (this._optLabel !== value) {
            this._optLabel = value;
            if (this.hasAttribute('useDefaultTmpl')) {
                // update label in default template mode any time optLabel is set
                const defaultTmplLabelEl: HTMLElement | null =
                    this.querySelector('#' + this._getDefaultTmplLabelId());
                if (defaultTmplLabelEl instanceof HTMLElement) {
                    defaultTmplLabelEl.textContent = value;
                }
            }
        }
    }

    public static readonly ELEMENT_NAME = 'ch5-select-option';

    public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
        ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
        receivestateselected: { direction: "state", booleanJoin: 1, contractName: true },
        receivestatelabel: { direction: "state", stringJoin: 1, contractName: true },
        receivestateurl: { direction: "state", stringJoin: 1, contractName: true },
        receivestatescriptlabelhtml: { direction: "state", stringJoin: 1, contractName: true },

        sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true }
    };

    public static ICON_POSITION_VALUES: string[] = ['first', 'last'];
    public static ITEM_STYLE_CLASS: string = 'ch5-select__panel__item';
    public static ITEM_STYLE_DEFAULT_TMPL_CLASS: string = 'ch5-select__panel__item__default_tmpl';

    /**
     * Option base 0 index in ch5-select options list
     * @type {number}
     */
    private _idx: number = -1;

    public receiveStateSelectedSubscription: string = '';

    /**
     * Valid values are 'first' and 'last'. Default is 'first'.
     * This attribute only applies when a template is not provided and the implied template is in use.
     * If template is provided, this property is ignored. If direction attribute is 'ltr', as will be typical
     * in locales with left to right language direction, 'first' is equivalent to icon being on the left and
     * text on the right. Conversely, if the direction attribute is 'rtl', the 'first' would have the icon
     * on the right and the label to its left. Value of 'last' is the opposite of 'first'.
     * @type {string}
     * @private
     */
    private _iconPosition: string = Ch5SelectOption.ICON_POSITION_VALUES[0];

    private _useDefaultTmpl: boolean = false

    /**
     * Item is selected
     */
    private _receiveStateSelected: string | null = null;

    /**
     * Only in default template mode (e.g. when template is not provided), provides label for the item
     */
    private _receiveStateLabel: string | null = null;
    private _receiveStateLabelSubscription: string = '';
    public _optLabel: string = '';

    /**
     * Only in default template mode (e.g. when template not provided), provides a URL for icon
     */
    private _receiveStateUrl: string | null = null;


    /**
     * Html syntax string appropriate for element.innerHTML parameter.
     * Only in default template mode(e.g. when template not provided). Signal script evaluation will be
     * applied to the button.innerHTML. Allows for multiline, multistyled labels.
     */
    private _receiveStateScriptLabelHTML: string | null = null;

    /**
     * Send signal on click or tap event (mouse or finger up and down in a small period of time);
     * boolean pulse
     * @type {null}
     */
    private _sendEventOnClick: string | null = null;

    private _parentCh5Select: Element | null = null;

    private _optionHammer: HammerManager | null = null;

    private _ch5Toggle: Ch5Toggle | null = null;

    public static registerSignalAttributeTypes() {
        Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5SelectOption.ELEMENT_NAME, Ch5SelectOption.SIGNAL_ATTRIBUTE_TYPES);
    }

    public connectedCallback() {
        this._parentCh5Select = this.closest('ch5-select');

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5SelectOption);
        }

        this._initDefaultTemplate();
        this.intializations();
        this.attachEventListeners();
    }

    public disconnectedCallback() {
        this.removeEventListeners();
        this.unsubscribeFromSignals();
    }

    public unsubscribeFromSignals() {
        this.info('unsubscribeFromSignals()');
        super.unsubscribeFromSignals();

        this.clearBooleanSignalSubscription(this._receiveStateSelected, this.receiveStateSelectedSubscription);
        this._receiveStateSelected = '';
        this.clearStringSignalSubscription(this._receiveStateLabel, this._receiveStateLabelSubscription)
        this._receiveStateLabel = '';
    }

    public intializations(): void {

        this.setAttribute('data-ch5-id', this.getCrId());

        // For ARIA
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5SelectOption);
        }

        if (!this.classList.contains(Ch5SelectOption.ITEM_STYLE_CLASS)) {
            this.classList.add(Ch5SelectOption.ITEM_STYLE_CLASS);
        }

        this.initializeAttributes();
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-select-option attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')');

        switch (attr) {
            case 'iconposition':
                this.iconPosition = this.getAttribute('iconPosition') ||
                    Ch5SelectOption.ICON_POSITION_VALUES[0];
                break;
            case 'receivestateselected':
                this.receiveStateSelected = this.getAttribute('receiveStateSelected');
                break;
            case 'receivestatelabel':
                this.receiveStateLabel = this.getAttribute('receiveStateLabel');
                break;
            case 'receivestateurl':
                this.receiveStateUrl = this.getAttribute('receiveStateUrl');
                break;
            case 'receivestatescriptlabelhtml':
                this.receiveStateScriptLabelHTML = this.getAttribute('receiveStateScriptLabelHTML');
                break;
            case 'sendeventonclick':
                this.sendEventOnClick = this.getAttribute('sendEventOnClick');
                break;
            case 'data-ch5-opt-idx':
                this.idx = Number(newValue);
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    /**
     *  Called to initialize all attributes
     */
    private initializeAttributes() {
        super.initAttributes();
        this.iconPosition = this.getAttribute('iconPosition') ||
            Ch5SelectOption.ICON_POSITION_VALUES[0];
        this.receiveStateSelected = this.getAttribute('receiveStateSelected');
        this.receiveStateLabel = this.getAttribute('receiveStateLabel');
        this.receiveStateUrl = this.getAttribute('receiveStateUrl');
        this.receiveStateScriptLabelHTML = this.getAttribute('receiveStateScriptLabelHTML');
        this.sendEventOnClick = this.getAttribute('sendEventOnClick');
        this.idx = Number(this.getAttribute('data-ch5-opt-idx'));
    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners() {
        super.attachEventListeners();
        this._optionHammer = new Hammer.Manager(this);
        // click is handled by hammerjs automatically (as tap for mouse actions)
        this._optionHammer.add(new Hammer.Tap({ event: 'tap' }));
        this._optionHammer.on('tap', this._onClick);

        this._optionHammer.add(new Hammer.Press({ time: 500 }));
        this._optionHammer.on('press', this._onPress);
        this._optionHammer.on('pressup', this._onPressUp);
    }
    /**
     * Removes listeners
     */
    protected removeEventListeners() {
        super.removeEventListeners();
        if (this._optionHammer !== null) {
            this._optionHammer.off('tap', this._onClick);
            this._optionHammer.off('press', this._onPress);
            this._optionHammer.off('pressup', this._onPressUp);
        }
    }

    protected repaint() {
        this.info('<ch5-select-option /> doen\'t need repaint');
    }

    private _initDefaultTemplate(): void {
        if (this.hasAttribute('useDefaultTmpl')) {
            // use default template
            this.innerHTML = this._getDefaultTemplate();
            this.classList.add(Ch5SelectOption.ITEM_STYLE_DEFAULT_TMPL_CLASS);
            this._ch5Toggle = this.querySelector('ch5-toggle');
        }
    }

    private _isParentMultiselect(): boolean {
        return this._parentCh5Select !== null && (this._parentCh5Select as any).multiselect;
    }

    private _parentHasFeedbackModeSubmit(): boolean {
        return this._parentCh5Select !== null &&
            (this._parentCh5Select as any).feedbackMode === Ch5Select.FEEDBACK_MODE_VALUES[1];
    }

    private _getParentSyncTimeout(): number {
        return (this._parentCh5Select as any).signalValueSyncTimeout;
    }

    // private _canClickOnOption(): boolean {
    //     const _parent: Element | null = this.closest('ch5-select');
    //     return _parent !== null && _parent.nodeName.toLowerCase() === 'ch5-select' &&
    //         !_parent.classList.contains(Ch5Select.SELECTION_IN_PROGRESS_STYLE_CLASS);
    // }

    private _getDefaultTmplLabelId(): string {
        return this.getCrId() + '-opt-label';
    }

    private _getDefaultTemplate(): string {
        // default template image
        let imgHTML: string = `<ch5-image refreshRate="0"`;
        if (this.receiveStateUrl !== null && this.receiveStateUrl !== '') {
            imgHTML += ` receiveStateUrl="${this.receiveStateUrl}"`;
        }
        imgHTML += '></ch5-image>';

        // default template label
        const labelHTML: string = `<span id="${this._getDefaultTmplLabelId()}">${this.optLabel}</span>`;

        // default template ch5-toggle in case of multiselect
        let checkboxHTML: string = '<ch5-toggle';
        if (this.receiveStateScriptLabelHTML !== null && this.receiveStateScriptLabelHTML !== '') {
            checkboxHTML += ` receiveStateScriptLabelHTML="${this.receiveStateScriptLabelHTML}"`;
        }
        if (this.sendEventOnClick !== null && this.sendEventOnClick !== '') {
            checkboxHTML += ` sendEventOnClick="${this.sendEventOnClick}"`;
        }
        if (this.receiveStateSelected !== null && this.receiveStateSelected !== '') {
            checkboxHTML += ` receiveStateValue="${this.receiveStateSelected}"`;
        }
        if (this._parentHasFeedbackModeSubmit()) {
            checkboxHTML += ' feedbackMode="submit"';
        }
        checkboxHTML += ` signalValueSyncTimeout="${this._getParentSyncTimeout()}"></ch5-toggle>`;

        let tmplHtml: string = '';
        if (this.iconPosition === Ch5SelectOption.ICON_POSITION_VALUES[0]) {
            // icon first
            tmplHtml += imgHTML + (this._isParentMultiselect() ? checkboxHTML : '') + labelHTML;
        } else {
            // last last
            tmplHtml += labelHTML + (this._isParentMultiselect() ? checkboxHTML : '') + imgHTML;
        }
        tmplHtml += '';
        return tmplHtml;
    }

    public defaultTmplIsUsed(): boolean {
        return this.classList.contains(Ch5SelectOption.ITEM_STYLE_DEFAULT_TMPL_CLASS);
    }

    public triggerToggleClickSignal(expectedOptSelectedState: boolean): void {
        if (this._ch5Toggle === null) {
            return;
        }
        // get toggle elem and fire signal
        if ((this._ch5Toggle as Ch5Toggle).value !== expectedOptSelectedState) {
            // in case toggle state is different from option state, states must be equal
            (this._ch5Toggle as Ch5Toggle).toggleChecked();
        }
    }

    private _clickReceivedFromCh5Toggle(targetEl: HTMLElement): boolean {
        if (targetEl.tagName.toLowerCase() === 'ch5-toggle') {
            return true;
        } else {
            const targetCh5ToggleParent: Element | null =
                targetEl.closest('ch5-select-option > ch5-toggle');
            return !!targetCh5ToggleParent;
        }
    }

    public setToggleValue(val: boolean): void {
        if (this._ch5Toggle !== null) {
            this._ch5Toggle.setClean();
            this._ch5Toggle.value = val;
            // this._ch5Toggle.checked = val;
        }
    }

    private _onClick(e: any) {
        // if (!this._canClickOnOption()) {
        //     return;
        // }

        this.info("Ch5SelectOption._onClick()");

        // no toggle set on => select toggle and send click signal
        if (this.defaultTmplIsUsed() && this._isParentMultiselect()) {
            const expectedOptSelectedState: boolean = !this.classList.contains(Ch5Select.ITEM_SELECTED_STYLE_CLASS);
            this.dispatchEvent(this._getOptionSelectedEvent());
            if (!this._clickReceivedFromCh5Toggle(e.target)) {
                this.triggerToggleClickSignal(expectedOptSelectedState);
            }
            return;
        }

        this.dispatchEvent(this._getOptionSelectedEvent(true));

        if (!this._parentHasFeedbackModeSubmit()) {
            // send signal on click/tap (boolean pulse)
            // if default tmpl is used sending click signal will be delegated to ch5-toggle
            this.sendClickSignal();
        }
    }

    public sendClickSignal(): void {
        if (typeof this.sendEventOnClick === 'string' && this.sendEventOnClick !== '') {
            const sigClick: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
                .getBooleanSignal(this.sendEventOnClick);

            if (sigClick !== null) {
                sigClick.publish(true);
                sigClick.publish(false);
            }
        }
    }

    /**
     *
     * @param {boolean} setAction
     * @param {boolean} confirmed - used for setting a flag to reset dirty in parent element after selection,
     *                              or to confirm multiselected options
     * @returns {CustomEvent}
     * @private
     */
    private _getOptionSelectedEvent(setAction?: boolean, confirmed?: boolean): CustomEvent {
        const eventPayload: object = {
            idx: this.idx,
            set: typeof setAction === 'boolean'
                ? setAction
                : !this.classList.contains(Ch5Select.ITEM_SELECTED_STYLE_CLASS)
        };
        confirmed = typeof confirmed !== 'boolean' ? false : confirmed;
        if (!this._isParentMultiselect()) {
            // single
            (eventPayload as any).resetDirty = confirmed;
        } else {
            // multi
            (eventPayload as any).confirmed = confirmed;
        }

        return new CustomEvent("option-selected", {
            detail: eventPayload,
            bubbles: true,
            cancelable: false
        });
    }

    public applySelectedStyleClass(): void {
        this.classList.add(Ch5Select.ITEM_SELECTED_STYLE_CLASS);
    }

    public removeSelectedStyleClass(): void {
        this.classList.remove(Ch5Select.ITEM_SELECTED_STYLE_CLASS);
    }

    private _handleReceiveSignalSelected(): void {
        // remove old subscription, if exist
        if (this.receiveStateSelected !== '' && this.receiveStateSelectedSubscription !== '') {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateSelected as string);
            const oldSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
                .getBooleanSignal(oldSigName);
            if (oldSig !== null && this.receiveStateSelectedSubscription !== '') {
                oldSig.unsubscribe(this.receiveStateSelectedSubscription);
                this.receiveStateSelectedSubscription = '';

            }
        }

        if (this.receiveStateSelected === '' || this.receiveStateSelected === null) {
            return;
        }

        const receiveSignalSelectedName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateSelected as string);
        const receiveStateSelected: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(receiveSignalSelectedName);

        if (receiveStateSelected !== null) {
            // add new subscription
            this.receiveStateSelectedSubscription = receiveStateSelected.subscribe((newValue: boolean) => {
                this.info(`Option ${this.idx} received selected signal value: ${newValue}`);
                this.dispatchEvent(this._getOptionSelectedEvent(newValue, true));
            });
        }
    }

    private _handleReceiveSignalLabel(): void {
        // remove old subscription, if exist
        if (this.receiveStateLabel !== '' && this._receiveStateLabelSubscription !== '') {
            const oldSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateLabel as string);
            const oldSig: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
                .getStringSignal(oldSigName);
            if (oldSig !== null && this._receiveStateLabelSubscription !== '') {
                oldSig.unsubscribe(this._receiveStateLabelSubscription);
                this._receiveStateLabelSubscription = '';

            }
        }

        if (this.receiveStateLabel === '' || this.receiveStateLabel === null) {
            return;
        }


        const receiveSignalLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateLabel);
        const receiveStateLabelSig: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(receiveSignalLabelSigName);

        if (receiveStateLabelSig !== null) {
            // add new subscription
            this._receiveStateLabelSubscription = receiveStateLabelSig.subscribe((labelVal: string) => {
                this.optLabel = labelVal;
            });
        }
    }

    public getCssClassDisabled() {
        return 'ch5-select__panel__item--disabled';
    }

    private _onPress(): void {
        if (this._parentCh5Select !== null) {
            this._parentCh5Select.classList.add('ch5-select—pressed');
        }
    }

    private _onPressUp(): void {
        if (this._parentCh5Select !== null) {
            this._parentCh5Select.classList.remove('ch5-select—pressed');
        }
    }

}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define(Ch5SelectOption.ELEMENT_NAME, Ch5SelectOption);
}

Ch5SelectOption.registerSignalAttributeTypes();
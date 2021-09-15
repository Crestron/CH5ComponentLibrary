// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Questions:
 *  - Do we really need signal properties in default ch5-select-option template?
 *  because ch5-select-option has those signal attributes
 *
 * TODO:
 *  - RTL (_applyResize)
 *  - events improvements
 */

import "hammerjs";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Config } from "../ch5-common/ch5-config";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import { Ch5SelectOption } from "../ch5-select-option";
import HtmlCallback from "../ch5-common/utils/html-callback";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { isNil } from "lodash";
import { TCh5CommonInputFeedbackModes } from "../ch5-common-input/interfaces/t-ch5-common-input";
import { ICh5SelectAttributes, TCh5SelectMode, TCh5SelectIconPosition } from "./interfaces";

export class Ch5Select extends Ch5Common implements ICh5SelectAttributes {

    // Options number can no be > 30
    public static MAX_SIZE: number = 30;
    public static MODE_VALUES: TCh5SelectMode[] = ['plain', 'panel'];
    public static FEEDBACK_MODE_VALUES: TCh5CommonInputFeedbackModes[] = ['direct', 'submit'];
    public static readonly COMPONENT_DATA: any = {
        MODE_VALUES: {
            default: Ch5Select.MODE_VALUES[0],
            values: Ch5Select.MODE_VALUES,
            key: 'mode_values',
            classListPrefix: 'ch5-select--'
        },
        FEEDBACK_MODE_VALUES: {
            default: Ch5Select.FEEDBACK_MODE_VALUES[0],
            values: Ch5Select.FEEDBACK_MODE_VALUES,
            key: 'feedback_mode_values',
            classListPrefix: 'ch5-select--'
        },
    };
    public static DEFAULT_SIGNAL_VALUE_SYNC_TIMEOUT: number = 1500;
    public static PLACEHOLDER_DEFAULT: string = '';

    public static CH5_SELECT_MAIN_STYLE_CLASS: string = 'ch5-select';
    public static OPENED_STYLE_CLASS: string = 'ch5-select__panel-open';
    public static MAIN_PANEL_STYLE_CLASS: string = 'ch5-select__main';
    public static SELECTED_ITEMS_STYLE_CLASS: string = 'ch5-select__selected_items';
    public static MODE_PANEL_STYLE_CLASS: string = 'ch5-select__panel';
    public static MODE_COMBO_STYLE_CLASS: string = 'ch5-select__combo';
    public static PANEL_ITEMS_STYLE_CLASS: string = 'ch5-select__panel__items';
    public static COMBO_TRIGGER_STYLE_CLASS: string = 'ch5-select__combo_trigger';
    public static PANEL_ITEM_STYLE_CLASS: string = 'ch5-select__panel__item';
    public static SELECTION_IN_PROGRESS_STYLE_CLASS: string = 'ch5-select__selection-in-progress';

    // TODO: declaring this static property in Ch5SelectOption makes build process to not generate correctly
    // Ch5SelectOption.ITEM_SELECTED_STYLE_CLASS will be converted to
    // ch5_select_option_1.Ch5SelectOption.ITEM_SELECTED_STYLE_CLASS
    public static ITEM_SELECTED_STYLE_CLASS: string = 'ch5-select__panel__item--selected';

    public cssClassPrefix = 'ch5-select';

    /**
     * Used only to validate the interface for metadata generation
     * @ignore
     */
    public iconPosition: TCh5SelectIconPosition = 'first';
    public mainPanel: HTMLElement = {} as HTMLElement;
    public selectedOptionsPanel: HTMLElement = {} as HTMLElement;
    public selectPanel: HTMLElement = {} as HTMLElement;
    public comboTrigger: HTMLElement = {} as HTMLElement;
    public templateVarsData: object[] = [];
    public _selectionTimeout: number | null = null;
    public _multiselectionTimeout: number | null = null;
    public receiveStateSizeSubscription: string = '';
    public receiveStateValueSubscription: string = '';
    public receiveStateTemplateVarsSubscription: string = '';

    private _optionTemplateHTML: string = '';

    /**
     * Used to keep option selection, number for single selection, array of numbers for multiselection
     * @type {null}
     */
    private _lastReceivedSignalValue: number = -1;
    private _cleanValue: number = -1;
    private _lastSelectedOptIdx: number | null = null;

    // COMPONENT ATTRIBUTES

    /**
     * Initial number of entries in selection. Default to 1, Range 1-30
     * @type {number}
     * @private
     */
    private _size: number = 0;

    /**
     * Default of false, true if multiple selections can be selected.
     * If true, the value of the select will be an array of values
     * @type {boolean}
     * @private
     */
    private _multiselect: boolean = false;

    /**
     * The 0 based index of the selected item. -1 indicates none
     * selected. This attribute does not apply to multiselect='true'.
     * @type {number}
     * @private
     */
    private _selectedValue: number = -1;
    /**
     * Same as _selectedValue, but for multi-selection
     * @type {any[]}
     * @private
     */
    private _selectedValues: number[] = [];
    private _cleanValues: number[] = [];
    private _multiselectedValuesMap: object[] = [];

    /**
     * Height of the panel containing the list of options
     * @type {number}
     * @private
     */
    private _panelScrollHeight: string = "0px";

    /**
     * min width of the select panel
     * @type {string}
     * @private
     */
    private _minWidth: string = '';

    /**
     * max width of the select panel
     * @type {string}
     * @private
     */
    private _maxWidth: string = '';

    /**
     * min height of the select panel
     * @type {string}
     * @private
     */
    private _minHeight: string = '';

    /**
     * max height of the select panel
     * @type {string}
     * @private
     */
    private _maxHeight: string = '';

    /**
     * If true, then resize the options panel to fit content width.
     * The maximum width and height cannot be bigger then
     * parent HTML element
     * @type {boolean}
     * @private
     */
    private _resize: boolean = false;

    /**
     * Two choices below. Default is 'plain'
     * plain - select menu opens and closes as clicked by user
     * panel – select menu stays open even when not in focus
     * @type {string}
     * @private
     */
    private _mode: TCh5SelectMode = Ch5Select.MODE_VALUES[0];

    /**
     * allow the form submission functionality. direct, submit
     * @type {string}
     * @private
     */
    private _feedbackMode: TCh5CommonInputFeedbackModes = Ch5Select.FEEDBACK_MODE_VALUES[0];

    /**
     * Default 1500. Defines the time between the user release the handle of the toggle and the time
     * the toggle will check if the value is equal with the value from the signal. If not it will
     * automatically apply the value from the signal. Apply only for feedbackMode direct
     * @type {number}
     * @private
     */
    private _signalValueSyncTimeout: number = Ch5Select.DEFAULT_SIGNAL_VALUE_SYNC_TIMEOUT;

    /**
     * Provides the name of the offset identifier to substituted with 1 based index of the item in list within
     * the template item surrounded by {{ }} delimiters.
     * @type {string}
     * @private
     */
    private _indexId: string = '';

    // RECEIVE SIGNAL ATTRIBUTES

    /**
     * When receive change the selected value of this selector. this is only applicable for
     * multiselect=false. 1 based index is expected. Value 0 indicates all are be unselected.
     */
    private _receiveStateValue: string | null = null;

    /**
     * Sets the number of items in this component
     */
    private _receiveStateSize: string | null = null;

    /**
     * Json encoded array of name/value objects, one per item created from the template. See Configuration Section
     * for description of template variable substitution.
     */
    private _receiveStateTemplateVars: string | null = null;

    // SEND SIGNAL ATTRIBUTES

    /**
     * send signal on focus event. True in focus. False not in focus
     */
    private _sendEventOnFocus: string | null = null;

    /**
     * send signal value on selected change. this is only applicable for multiselect=false. 1 based
     * index is expected. Value 0 indicates all are be unselected.
     */
    private _sendEventOnChange: string | null = null;

    private _dirty: boolean = false;

    private _ondirtyCallback: HtmlCallback | {} = {} as HtmlCallback;

    private _oncleanCallback: HtmlCallback | {} = {} as HtmlCallback;

    private _noneSelectedPrompt: string = Ch5Select.PLACEHOLDER_DEFAULT;

    private _comboTriggerHammer: HammerManager | null = null;

    constructor() {
        super();

        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._handleSelectPanelToggle = this._handleSelectPanelToggle.bind(this);
        this._handleOptionSelected = this._handleOptionSelected.bind(this);
        this.closeSelectPanel = this.closeSelectPanel.bind(this);
        this._wasInstatiated = false;

    }

    public set ondirtyCallback(callback: HtmlCallback | {}) {
        if (callback === undefined || callback === null) {
            callback = {} as HtmlCallback;
        }

        this._ondirtyCallback = callback;
    }

    public get ondirtyCallback(): HtmlCallback | {} {
        return this._ondirtyCallback;
    }

    public set ondirty(callback: {}) {
        this.ondirtyCallback = callback;
    }

    public get ondirty(): {} {
        return this.ondirtyCallback;
    }

    public set oncleanCallback(callback: HtmlCallback | {}) {
        if (callback === undefined || callback === null) {
            callback = {} as HtmlCallback;
        }

        this._oncleanCallback = callback;
    }

    public get oncleanCallback(): HtmlCallback | {} {
        return this._oncleanCallback;
    }

    public set onclean(callback: {}) {
        this.oncleanCallback = callback;
    }

    public get onclean(): {} {
        return this.oncleanCallback;
    }

    public connectedCallback() {
      const setup = () => {
        this.info('connectedCallback()');

        // WAI-ARIA Attributes
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5Select);
        }

        this.setAttribute('data-ch5-id', this.getCrId());

        // For ARIA
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', Ch5RoleAttributeMapping.ch5Spinner);
        }
        if (!this.hasAttribute('tabindex')) {
            // set tabindex to enable focus/blur events
            this.setAttribute('tabindex', '0');
        }

        // init option template
        this._initOptionTemplate();

        // angular additions in case _initOptionTemplate has not found any template
        if (this._optionTemplateHTML === '') {
            this.info('add mutation observer in order to extract template data');
            // for angular
            this._startReadyObserver();
        } else {
            this.info('connectedCallback initializations');
            this.initializations();
        }

        this.initCommonMutationObserver(this);

        this.info("Callback loaded - ch5-select");
        this._wasInstatiated = true;
      }

      Promise.all([
        customElements.whenDefined('ch5-select')
      ]).then(setup);
    }

    public disconnectedCallback() {
        this.removeEventListeners();
        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
    }

    public unsubscribeFromSignals() {
        this.info('unsubscribeFromSignal()');
        super.unsubscribeFromSignals();

        this.clearStringSignalSubscription(this._receiveStateSize, this.receiveStateSizeSubscription);
        this._receiveStateSize = '';
        this.clearStringSignalSubscription(this._receiveStateTemplateVars, this.receiveStateTemplateVarsSubscription);
        this._receiveStateTemplateVars = '';
        this.clearStringSignalSubscription(this._receiveStateValue, this.receiveStateValueSubscription);
        this._receiveStateValue = '';
    }

    private initializations(): void {
        this._addMainClass();
        this._updateModeClass();

        this.initAttributes();

        // init clean value
        if (!this.multiselect) {
            this._cleanValue = this.selectedValue as number;
        } else {
            this._cleanValues = this.selectedValues.slice(0);
        }

        this._createMainPanel();
        // init template vars using global configuration data
        this.templateVarsData = this._getTemplateVarsFromDefaultConfig();

        this.selectedOptionsPanel.innerHTML = this.noneSelectedPrompt as string;
        this._updateCh5SelectDimensions();

        this.shouldComputeDropdownHeight();

        this._createSelectPanel();
        this.attachEventListeners();
    }

    // required for panelScrollHeight if set in %
    private shouldComputeDropdownHeight(): void {
        if (this.panelScrollHeight.toString().includes('%') && !isNil(this.parentElement) &&
            this.parentElement.offsetHeight > 0) {
            const panelScrollHeightPercentage = parseInt(this.panelScrollHeight, 10);
            if (panelScrollHeightPercentage > 0) {
                // set the height of the panel/dropdown based on the height of the ch5-select parent
                this.panelScrollHeight = `${(this.parentElement.offsetHeight / 100) * panelScrollHeightPercentage}px`;
            } else {
                // fallback to 100% maxHeight of the ch5-select parent
                this.panelScrollHeight = '';
            }
        }
    }

    private _initOptionTemplate(): void {
        // get option template
        if (this._optionTemplateHTML !== '' || this._wasInstatiated === true) {
            return;
        }
        const optionTemplate = this.getElementsByTagName('template')[0] as HTMLElement;
        if (optionTemplate && optionTemplate.innerHTML && optionTemplate.innerHTML.length > 0) {
            // when not used in angular
            this.info('optionTemplate.innerHtml ', optionTemplate.innerHTML);
            this._validateTmplFirstElAsCh5SelectOption((optionTemplate as any).content);
            this._optionTemplateHTML = optionTemplate.innerHTML.trim();
            // remove the template element from the DOM
            optionTemplate.remove();
        } else if (optionTemplate && optionTemplate.firstElementChild &&
            optionTemplate.firstElementChild.outerHTML && optionTemplate.firstElementChild.outerHTML.length > 0) {
            // when used in angular with router
            this.info('optionTemplate.firstElementChild.outerHTML ',
                optionTemplate.firstElementChild.outerHTML);
            this._validateTmplFirstElAsCh5SelectOption(optionTemplate);
            this._optionTemplateHTML = optionTemplate.firstElementChild.outerHTML.trim();
            // remove the template element from the DOM
            optionTemplate.remove();
        }
    }

    private _startReadyObserver(): void {

        if (this.querySelector('.' + Ch5Select.MAIN_PANEL_STYLE_CLASS)) {

            this.mainPanel = this.querySelector('.' + Ch5Select.MAIN_PANEL_STYLE_CLASS) as HTMLElement;
            this.selectedOptionsPanel = this.querySelector('.' + Ch5Select.SELECTED_ITEMS_STYLE_CLASS) as HTMLElement;
            this.selectPanel = this.querySelector('.' + Ch5Select.PANEL_ITEMS_STYLE_CLASS) as HTMLElement;

            this.attachEventListeners();
            return;
        }

        const templateNodeName: string = 'template';
        const observer = new MutationObserver((mutations) => {
            this.info('mutationObserver Callback');
            mutations.forEach((mutation) => {
                this.info('mutation', mutation);
                if ((mutation.type !== 'childList') || !mutation.addedNodes) {
                    return;
                }

                if (mutation.addedNodes.length > 0) {
                    let templateElement: any | null = null;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        if (mutation.addedNodes[i].nodeName.toLowerCase() === templateNodeName) {
                            templateElement = mutation.addedNodes[i];
                            break;
                        }
                    }

                    if (null !== templateElement) {
                        this.info('templateElement innerhtml', templateElement.innerHTML);
                        this._validateTmplFirstElAsCh5SelectOption(templateElement);
                        let tplHtml = templateElement.innerHTML;
                        if (tplHtml.trim() === '') {
                            // Normally this should be taken from template.contents but angular appears to change the template element
                            // see https://github.com/angular/angular/issues/15557
                            tplHtml = templateElement.firstElementChild.outerHTML;
                            this._optionTemplateHTML = tplHtml;
                            this.initializations();
                            // disconnect observer
                            observer.disconnect();
                            templateElement.remove(); // remove the template element from DOM
                        }
                    }
                }
            });
        });

        observer.observe(this, {childList: true, subtree: false, attributes: false, characterData: false});
    }

    private _validateTmplFirstElAsCh5SelectOption(tmpl: HTMLElement): void {
        // TODO: this could be just a warning
        if ((tmpl as any).firstElementChild.nodeName.toLowerCase() !== 'ch5-select-option') {
            throw new Error(`ch5-select, id: ${this.getAttribute('data-ch5-id')}
                - no ch5-select-option provided`);
        }
    }

    /**
     * Set element dimensions
     * @private
     */
    private _updateCh5SelectDimensions(): void {
        let styleText: string = (this._getStyleWidthProps() + this._getStyleHeightProps()).trim();
        if (styleText === '') {
            // no nim/max width/height provided => set component width to parent width
            styleText = this._getCssDimensionsUsingParent(true);
        }
        this.style.cssText = styleText;
        if (this._isValidElement(this.mainPanel)) {
            this.mainPanel.style.cssText = this._getStyleHeightProps();
        }
    }

    /**
     * Create main panel that will host the selected options and open trigger icon btn
     * @private
     */
    private _createMainPanel(): void {
        if (this._wasInstatiated === true) {
            return;
        }

        this.mainPanel = document.createElement('div');
        this.mainPanel.classList.add(Ch5Select.MAIN_PANEL_STYLE_CLASS);

        this.selectedOptionsPanel = document.createElement('div');
        this.selectedOptionsPanel.classList.add(Ch5Select.SELECTED_ITEMS_STYLE_CLASS);
        this.mainPanel.appendChild(this.selectedOptionsPanel);

        this._createComboTrigger();
        this.appendChild(this.mainPanel);
    }

    private _createSelectPanel(): void {
        if (this.selectPanel instanceof HTMLElement) {
            this.selectPanel.remove();
            this.selectPanel = {} as HTMLElement;
        }
        this.selectPanel = document.createElement('div');
        this.selectPanel.classList.add(Ch5Select.PANEL_ITEMS_STYLE_CLASS);
        this.appendChild(this.selectPanel);

        this._updateSelectPanelScrollHeight();

        this._applyResize();
        this.renderCh5SelectOptions();
    }

    private _createComboTrigger(): void {
        if (this._isPanel() || !this._isValidElement(this.mainPanel)) {
            // no combo trigger icon for mode panel or mainPanel is not created yet
            return;
        }
        this.comboTrigger = document.createElement('span');
        this.comboTrigger.classList.add(Ch5Select.COMBO_TRIGGER_STYLE_CLASS);
        this.comboTrigger.innerHTML = this._getCh5SelectOpenTriggerIcon();
        this.mainPanel.appendChild(this.comboTrigger);
    }

    private _handleSelectPanelToggle(): void {
        if (!this._isOpened()) {
            this.openSelectPanel();
        } else {
            this.closeSelectPanel();
        }
    }

    private _isOpened(): boolean {
        return this.classList.contains(Ch5Select.OPENED_STYLE_CLASS);
    }

    public openSelectPanel(): void {
        if (this.classList.contains(Ch5Select.SELECTION_IN_PROGRESS_STYLE_CLASS)) {
            return;
        }
        this.classList.add(Ch5Select.OPENED_STYLE_CLASS);
    }

    public closeSelectPanel(): void {
        this.classList.remove(Ch5Select.OPENED_STYLE_CLASS);
    }

    public static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;
        const ch5SelectAttributes: string[] = ['size', 'iconposition', 'multiselect', 'selectedvalue',
            'panelscrollheight', 'minwidth', 'maxwidth', 'minheight', 'maxheight', 'resize', 'mode', 'feedbackmode',
            'signalvaluesynctimeout', 'indexid', 'receivestatevalue', 'receivestatesize', 'receivestatetemplatevars',
            'sendeventonfocus', 'sendeventonchange', 'noneselectedprompt','ondirty', 'onclean'];
        return commonAttributes.concat(ch5SelectAttributes);
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-select attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')');

        switch (attr) {
            case 'size':
                this.size = this.getAttribute('size') || 1;
                break;

            case 'multiselect':
                this.multiselect = this.hasAttribute('multiselect');
                break;

            case 'selectedvalue':
                this.selectedValue = this.getAttribute('selectedValue') || 0;
                break;

            case 'panelscrollheight':
                this.panelScrollHeight = this.getAttribute('panelScrollHeight') || '';
                break;

            case 'minwidth':
                this.minWidth = this.getAttribute('minWidth') || '';
                break;

            case 'maxwidth':
                this.maxWidth = this.getAttribute('maxWidth') || '';
                break;

            case 'minheight':
                this.minHeight = this.getAttribute('minHeight') || '';
                break;

            case 'maxheight':
                this.maxHeight = this.getAttribute('maxHeight') || '';
                break;

            case 'resize':
                this.resize = this.hasAttribute('resize');
                break;

            case 'mode':
                this.mode = (this.getAttribute('mode') || Ch5Select.MODE_VALUES[0]) as TCh5SelectMode;
                break;

            case 'feedbackmode':
                this.feedbackMode = (this.getAttribute('feedbackMode') ||
                    Ch5Select.FEEDBACK_MODE_VALUES[0]) as TCh5CommonInputFeedbackModes;
                break;

            case 'signalvaluesynctimeout':
                this.signalValueSyncTimeout = this.getAttribute('signalValueSyncTimeout') ||
                    Ch5Select.DEFAULT_SIGNAL_VALUE_SYNC_TIMEOUT;
                break;

            case 'indexid':
                this.indexId = this.getAttribute('indexId') || '';
                break;

            case 'receivestatevalue':
                this.receiveStateValue = this.getAttribute('receiveStateValue') || '';
                break;
            case 'receivestatesize':
                this.receiveStateSize = this.getAttribute('receiveStateSize') || '';
                break;
            case 'receivestatetemplatevars':
                this.receiveStateTemplateVars = this.getAttribute('receiveStateTemplateVars') || '';
                break;
            case 'sendeventonfocus':
                this.sendEventOnFocus = this.getAttribute('sendEventOnFocus') || '';
                break;
            case 'sendeventonchange':
                this.sendEventOnChange = this.getAttribute('sendEventOnChange') || '';
                break;

            case 'noneselectedprompt':
                this.noneSelectedPrompt = this.getAttribute('noneSelectedPrompt');
                break;
            case 'ondirty':
                this.ondirtyCallback = new HtmlCallback(this, this.getAttribute('ondirty') as string);
                break;
            case 'onclean':
                this.oncleanCallback = new HtmlCallback(this, this.getAttribute('onclean') as string);
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }

        if (attr === 'dir') {
            this._updateOptionsDirAttr();
        }
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        super.initAttributes();

        this.info('initAttributes()');

        if (this.hasAttribute('size')) {
            this.size = this.getAttribute('size') as string;
        }

        this.multiselect = this.hasAttribute('multiselect');

        if (this.hasAttribute('selectedValue')) {
            this.selectedValue = this.getAttribute('selectedValue') as string;
        }

        if (this.hasAttribute('panelScrollHeight')) {
            this.panelScrollHeight = this.getAttribute('panelScrollHeight') as string;
        }

        if (this.hasAttribute('minWidth')) {
            this.minWidth = this.getAttribute('minWidth') as string;
        }

        if (this.hasAttribute('maxWidth')) {
            this.maxWidth = this.getAttribute('maxWidth') as string;
        }

        if (this.hasAttribute('minHeight')) {
            this.minHeight = this.getAttribute('minHeight') as string;
        }

        if (this.hasAttribute('maxHeight')) {
            this.maxHeight = this.getAttribute('maxHeight') as string;
        }

        this.resize = this.hasAttribute('resize');

        if (this.hasAttribute('mode')) {
            this.mode = this.getAttribute('mode') as TCh5SelectMode;
        }

        if (this.hasAttribute('feedbackMode')) {
            this.feedbackMode = this.getAttribute('feedbackMode') as TCh5CommonInputFeedbackModes;
        }

        if (this.hasAttribute('signalValueSyncTimeout')) {
            this.signalValueSyncTimeout = this.getAttribute('signalValueSyncTimeout') as string;
        }

        if (this.hasAttribute('indexId')) {
            this.indexId = this.getAttribute('indexId') as string;
        }

        if (this.hasAttribute('receiveStateValue')) {
            this.receiveStateValue = this.getAttribute('receiveStateValue') as string;
        }

        if (this.hasAttribute('receiveStateSize')) {
            this.receiveStateSize = this.getAttribute('receiveStateSize') as string;
        }

        if (this.hasAttribute('receiveStateTemplateVars')) {
            this.receiveStateTemplateVars = this.getAttribute('receiveStateTemplateVars') as string;
        }

        if (this.hasAttribute('sendEventOnFocus')) {
            this.sendEventOnFocus = this.getAttribute('sendEventOnFocus') as string;
        }

        if (this.hasAttribute('sendEventOnChange')) {
            this.sendEventOnChange = this.getAttribute('sendEventOnChange') as string;
        }

        if (this.hasAttribute('noneSelectedPrompt')) {
            this.noneSelectedPrompt = this.getAttribute('noneSelectedPrompt') as string;
        }

    }

    /**
     * Called to bind proper listeners
     */
    protected attachEventListeners(): void {
        super.attachEventListeners();
        this.removeEventListeners();
        this.addEventListener('focus', this._onFocus);
        this.addEventListener('blur', this._onBlur);

        this.addEventListener('option-selected', this._handleOptionSelected);

        if (this._isPlain()) {
            this.addEventListener('blur', this.closeSelectPanel);

            this._comboTriggerHammer = new Hammer.Manager(this.mainPanel);
            // click is handled by hammerjs automatically (as tap for mouse actions)
            this._comboTriggerHammer.add(new Hammer.Tap({event: 'tap'}));
            this._comboTriggerHammer.on('tap', this._handleSelectPanelToggle);

        }
    }

    /**
     * Removes listeners
     */
    protected removeEventListeners(): void {
        super.removeEventListeners();

        this.removeEventListener('focus', this._onFocus);
        this.removeEventListener('blur', this._onBlur);

        this.removeEventListener('option-selected', this._handleOptionSelected);

        if (this._isPlain()) {
            if (this._comboTriggerHammer !== null) {
                this._comboTriggerHammer.off('tap', this._handleSelectPanelToggle);
            }
            this.removeEventListener('blur', this.closeSelectPanel);
        }
    }

    public set size(value: string | number) {
        value = Number(value);
        if (isNaN(value) || value < 1) {
            value = 1;
        }
        if (this._size !== value) {
            this._size = value;
            this.setAttribute('size', value.toString());
            this.renderCh5SelectOptions();
        }
    }

    // Handle size based on template vars, see showcase example
    public get size() {
        if (this.hasTemplateVars() && this.templateVarsData.length > this._size) {
            return this._size;
        } else if (this.hasTemplateVars()) {
            return this.templateVarsData.length;
        } else {
            return this._size;
        }
    }

    public set multiselect(value: boolean) {
        if (this._multiselect !== value) {
            this._multiselect = value;
            if (value === true){
                this.setAttribute('multiselect', value.toString());
            } else {
                this.removeAttribute('multiselect');
            }

        }
    }

    public get multiselect() {
        return this._multiselect;
    }

    public set selectedValue(value: string | number) {
        value = Number(value);
        if (isNaN(value)) {
            value = 0;
        }
        if (this._selectedValue !== value) {
            this._selectedValue = value;
            this.setAttribute('selectedvalue', value.toString());
            // apply selected UI/class
            this._markOptionAsSelected(this.selectedValue as number);

            this._updateSingleSelectionInMainPanel();

            if (this.getDirty() === true && this._selectedValue === this._cleanValue) {
                this.dirty = false;
            }
        }
    }

    public get selectedValue() {
        return this._selectedValue;
    }

    public set selectedValues(selectedValues: number[]) {
        if (selectedValues instanceof Array === false) {
            selectedValues = [];
        }
        this._selectedValues = selectedValues;

        this._updateMultiSelectionInMainPanel();
    }

    public get selectedValues() {
        return this._selectedValues;
    }

    public set panelScrollHeight(value: any) {
        value = this._checkAndSetStringValue(value);
        if (this._panelScrollHeight !== value) {
            this._panelScrollHeight = value;
            this.setAttribute('panelscrollheight', value.toString());
            this._updateSelectPanelScrollHeight();
        }
    }

    public get panelScrollHeight() {
        return this._panelScrollHeight;
    }

    public set minWidth(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._minWidth !== value) {
            this._minWidth = value;
            this.setAttribute('minwidth', value);
        }
    }

    public get minWidth() {
        return this._minWidth;
    }

    public set maxWidth(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._maxWidth !== value) {
            this._maxWidth = value;
            this.setAttribute('maxwidth', value);
        }
    }

    public get maxWidth() {
        return this._maxWidth;
    }

    public set minHeight(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._minHeight !== value) {
            this._minHeight = value;
            this.setAttribute('minheight', value);
        }
    }

    public get minHeight() {
        return this._minHeight;
    }

    public set maxHeight(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._maxHeight !== value) {
            this._maxHeight = value;
            this.setAttribute('maxheight', value);
        }
    }

    public get maxHeight() {
        return this._maxHeight;
    }

    public set resize(value: boolean) {
        if (this._resize !== value) {
            this._resize = value;
            if (value === true) {
                this.setAttribute('resize', value.toString());
            } else {
                this.removeAttribute('resize');
            }
            this._applyResize();
        }
    }

    public get resize() {
        return this._resize;
    }

    public set mode(value: TCh5SelectMode) {
        if (!Ch5Select.MODE_VALUES.some(v => v === value)) {
            value = Ch5Select.MODE_VALUES[0];
        }
        if (this._mode !== value) {
            this._mode = value;
            this.setAttribute('mode', value.toString());
            this._updateModeClass();
        }
    }

    public get mode() {
        return this._mode;
    }

    private _isPlain() {
        return this.mode === Ch5Select.MODE_VALUES[0];
    }

    private _isPanel() {
        return this.mode === Ch5Select.MODE_VALUES[1];
    }

    public set feedbackMode(value: TCh5CommonInputFeedbackModes) {
        if (!Ch5Select.FEEDBACK_MODE_VALUES.some(v => v === value)) {
            value = Ch5Select.FEEDBACK_MODE_VALUES[0];
        }
        if (this._feedbackMode !== value) {
            this._feedbackMode = value;
            this.setAttribute('feedbackmode', value.toString());
        }
    }

    public get feedbackMode() {
        return this._feedbackMode;
    }

    public set signalValueSyncTimeout(value: string | number) {
        value = Number(value);
        if (isNaN(value) || value < 0) {
            value = Ch5Select.DEFAULT_SIGNAL_VALUE_SYNC_TIMEOUT;
        }
        if (this._signalValueSyncTimeout !== value) {
            this._signalValueSyncTimeout = value;
            this.setAttribute('signalvaluesynctimeout', value.toString());
        }
    }

    public get signalValueSyncTimeout() {
        return this._signalValueSyncTimeout;
    }

    public set indexId(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._indexId !== value) {
            this._indexId = value;
            this.setAttribute('indexid', value);
        }
    }

    public get indexId() {
        return this._indexId;
    }

    public set receiveStateValue(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateValue !== value) {
            this._receiveStateValue = value;
            this.setAttribute('receivestatevalue', value);

            // subscribe to signal
            this._handleReceiveSignalValue();
        }
    }

    public get receiveStateValue() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatevalue');
    }

    public set receiveStateSize(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateSize !== value) {
            this._receiveStateSize = value;
            this.setAttribute('receivestatesize', value);
            // subscribe to signal
            this._handleReceiveSignalSize();
        }
    }

    public get receiveStateSize() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatesize');
    }

    public set receiveStateTemplateVars(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._receiveStateTemplateVars !== value) {
            this._receiveStateTemplateVars = value;
            this.setAttribute('receivestatetemplatevars', value);
            // subscribe to signal
            this._handleReceiveSignalTemplateVars();
        }
    }

    public get receiveStateTemplateVars() {
        // The internal property is changed if/when the element is removed from DOM
        // Returning the attribute instead of the internal property preserves functionality
        return this._attributeValueAsString('receivestatetemplatevars');
    }

    public set sendEventOnFocus(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._sendEventOnFocus !== value) {
            this._sendEventOnFocus = value;
            this.setAttribute('sendeventonfocus', value);
        }
    }

    public get sendEventOnFocus() {
        return this._sendEventOnFocus;
    }

    public set sendEventOnChange(value: string | null) {
        value = this._checkAndSetStringValue(value);
        if (this._sendEventOnChange !== value) {
            this._sendEventOnChange = value;
            this.setAttribute('sendeventonchange', value);
        }
    }

    public get sendEventOnChange() {
        return this._sendEventOnChange;
    }

    private _getStyleWidthProps(): string {
        const _minWidth = (this.minWidth === null || this.minWidth === '') ? '' : `min-width:${this.minWidth};`;
        const _maxWidth = (this.maxWidth == null || this._maxWidth === '') ? '' : `max-width:${this.maxWidth};`;
        return `${_minWidth} ${_maxWidth}`;
    }

    private _getStyleHeightProps(): string {
        const _minHeight = (this.minHeight === null || this.minHeight === '') ? '' : `min-height:${this.minHeight};`;
        const _maxHeight = (this.maxHeight === null || this.maxHeight === '') ? '' : `max-height:${this.maxHeight};`;
        return `${_minHeight} ${_maxHeight}`;
    }

    private _getCh5SelectOpenTriggerIcon(): string {
        return '<svg role="img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">'
          + '<path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 '
          + '0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
    }

    /**
     * Usually used for resize attribute, the ch5-select has dynamic size,
     * width and height cannot be bigger that parent HTML element
     * @param {boolean} onlyWidth
     * @returns {string}
     * @private
     */
    private _getCssDimensionsUsingParent(onlyWidth?: boolean): string {
        const _parent: HTMLElement | null = this.parentElement;
        if (_parent && this._isValidElement(_parent)) {
            const _parentSize: ClientRect = _parent.getBoundingClientRect();
            let wCss = '';
            if (_parentSize.width > 0) {
                wCss = `min-width: 0; max-width:${_parentSize.width}px;`;
            }
            if (onlyWidth) {
                return wCss;
            }
            let hCss = '';
            if (_parentSize.height > 0) {
                hCss = `min-height: 0; max-height:${_parentSize.height}px;`;
            }
            return wCss + hCss;

        }
        return '';
    }

    private _updateSelectPanelScrollHeight(): void {
        if (this._isValidElement(this.selectPanel)) {
            this.selectPanel.style.maxHeight = (parseFloat(this.panelScrollHeight) > 0) ? this.panelScrollHeight : '';
        }
    }

    private _applyResize(): void {
        const _parent: HTMLElement | null = this.parentElement;

        if (!_parent || !this._isValidElement(this.selectPanel)) {
            return;
        }

        if (this.resize) {
            _parent.style.position = 'relative';
            this.style.position = 'static';

            const _parentSize: ClientRect = _parent.getBoundingClientRect();
            this.selectPanel.style.width = 'auto';
            this.selectPanel.style.maxWidth = `${_parentSize.width}px`;

            const _ch5SelectSize: ClientRect = this.getBoundingClientRect();
            const _left = Math.abs(_parentSize.left - _ch5SelectSize.left);
            this.selectPanel.style.left = `${_left}px`;

        } else {
            // reset position and width style
            _parent.style.position = 'inherit';
            this.style.position = '';
            this.selectPanel.style.width = '';
            this.selectPanel.style.maxWidth = '';
            this.selectPanel.style.left = '';
        }
    }

    private _isValidElement(el: any): boolean {
        return typeof el === 'object' && el instanceof HTMLElement;
    }

    private _addMainClass() {
        this.classList.add(Ch5Select.CH5_SELECT_MAIN_STYLE_CLASS);
    }

    private _updateModeClass(): void {
        if (this._isPlain()) {
            // plain
            this.classList.remove(Ch5Select.MODE_PANEL_STYLE_CLASS);
            this.classList.add(Ch5Select.MODE_COMBO_STYLE_CLASS);
        } else {
            // panel
            this.classList.remove(Ch5Select.MODE_COMBO_STYLE_CLASS);
            this.classList.add(Ch5Select.MODE_PANEL_STYLE_CLASS);
        }
    }

    private _getOptionTemplateWithReplacedVars(optHTML: string, index: number): string {
        const templateVars: object | null = this.getOptionTemplateVars(index);
        if (templateVars !== null) {
            Object.keys(templateVars).forEach((k: string) => {
                const keyToReplace: string = '{{' + k + '}}';
                const keyValue: string = (templateVars as any)[k];
                optHTML = this.textReplace(optHTML, keyToReplace, keyValue, true);
            });
        }
        return optHTML;
    }

    private _getProcessedOptionEl(index: number): HTMLElement {
        // replace indexId
        let optHTML: string = this._optionTemplateHTML;

        // replace template vars
        if (this.hasTemplateVars()) {
            optHTML = this._getOptionTemplateWithReplacedVars(optHTML, index);
        }

        const documentContainer: HTMLTemplateElement = document.createElement('template');
        documentContainer.innerHTML = optHTML;

        if (this.indexId !== null) {
            // replace indexId in attributes
            Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(documentContainer, index, this.indexId as string);
            // replace remaining Idx from content using innerHTML and replace
            Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(documentContainer, index, this.indexId as string);
        }

        return (documentContainer as any).content.firstChild;
    }

    public getOptionsListSize(): number {
        const optionsList: NodeList = this.selectPanel.querySelectorAll('ch5-select-option');
        return optionsList.length;
    }

    public buildOptions(startingIndex?: number): void {
        startingIndex = typeof startingIndex !== 'undefined' ? startingIndex : 0;
        this.info(`Build ch5-select options starting with index: ${startingIndex}`);
        for (let i = startingIndex; i < this.size; i++) {
            const o: HTMLElement = this._getProcessedOptionEl(i);
            const optIdx = i;
            o.setAttribute('data-ch5-opt-idx', String(optIdx));
            o.classList.add(Ch5Select.PANEL_ITEM_STYLE_CLASS);
            o.dir = this.dir;
            this.selectPanel.appendChild(o);
        }
    }

    public removeLastOptsFromList(startingIndex: number, oldOptsNr: number): void {
        for (let i = startingIndex; i < oldOptsNr; i++) {
            const oIdx: number = i;
            const o: HTMLElement | null = this._getOptionElByIdx(oIdx);
            if (o instanceof HTMLElement) {
                this.info(`Removing ch5-select-option ${oIdx}`);
                o.remove();
            }
        }
    }

    public renderCh5SelectOptions(): void {
        if (!this._isValidElement(this.selectPanel)) {
            return;
        }

        const optionsNr: number = this.getOptionsListSize();
        if (optionsNr === 0) {
            this.buildOptions();
        } else if (this.size < optionsNr) {
            // remove some options
            this.removeLastOptsFromList(this.size as number, optionsNr);
        } else if (this.size > optionsNr) {
            // add missing options
            this.buildOptions(optionsNr);
        }

        if (!this.multiselect) {
            this._markOptionAsSelected(this.selectedValue as number);
            this._updateSingleSelectionInMainPanel();
        }
    }

    public textReplace(fullText: string, toReplace: string, replaceWith: string, replaceGlobal: boolean): string {
        let result = '';
        if (typeof fullText === 'string' && fullText !== '') {
            if (replaceGlobal === true) {
                result = fullText.replace(new RegExp(toReplace, 'g'), replaceWith);
            } else {
                result = fullText.replace(new RegExp(toReplace), replaceWith);
            }
        }
        return result;
    }

    private _getTemplateVarsFromDefaultConfig() {
        return Ch5Config.getTemplateVarsForElement(this);
    }

    protected hasTemplateVars() {
        return this.templateVarsData.length > 0;
    }

    protected getOptionTemplateVars(index: number): object | null {
        const tVarsObj = this.templateVarsData[index];
        return (tVarsObj !== null && typeof tVarsObj === 'object' &&
            Object.keys(tVarsObj).length > 0) ? tVarsObj : null;
    }

    private _unsubscribeOldSignal(sigName: string, sigSubsKey: string, type: string): void {
        let oldSig: Ch5Signal<number> | Ch5Signal<string> | null = null;
        const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
        switch (type) {
            case 'number':
                oldSig = Ch5SignalFactory.getInstance().getNumberSignal(subSigName);
                break;
            case 'string':
                oldSig = Ch5SignalFactory.getInstance().getStringSignal(subSigName);
                break;
        }

        if (oldSig !== null && sigSubsKey !== '') {
            oldSig.unsubscribe(sigSubsKey);
            this.receiveStateSizeSubscription = '';
        }


    }

    private _handleReceiveSignalSize(): void {
        // remove old subscription, if exist
        if (this.receiveStateSize !== '' && this.receiveStateSizeSubscription !== '') {
            this._unsubscribeOldSignal(this.receiveStateSize as string,
                this.receiveStateSizeSubscription, 'number');
            this.receiveStateSizeSubscription = '';

        }

        if (this.receiveStateSize === '' || this.receiveStateSize === null) {
            return;
        }

        const subReceiveStateSignalName = Ch5Signal.getSubscriptionSignalName(this.receiveStateSize);
        const receiveSizeSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(subReceiveStateSignalName);


        if (receiveSizeSignal !== null) {
            // add new subscription
            this.receiveStateSizeSubscription = receiveSizeSignal.subscribe((newValue: number) => {
                const newNrVal = Number(newValue);
                if (!isNaN(newNrVal) && receiveSizeSignal.hasChangedSinceInit()) {
                    this.info(`Received new size signal value: ${newValue}`);
                    this.setAttribute('size', String(newNrVal));
                } else {
                    this.info('Ch5Select receiveSizeSignal signal value for ' +
                        this.getAttribute('data-ch5-id') + ' is invalid');
                }
            });
        }
    }

    private _handleReceiveSignalTemplateVars() {
        // remove old subscription, if exist
        if (this.receiveStateTemplateVars !== '' && this.receiveStateTemplateVarsSubscription !== '') {
            this._unsubscribeOldSignal(this.receiveStateTemplateVars as string,
                this.receiveStateTemplateVarsSubscription, 'string');
            this.receiveStateTemplateVarsSubscription = '';

        }

        if (this.receiveStateTemplateVars === '' || this.receiveStateTemplateVars === null) {
            return;
        }

        const subReceiveTmplVarsSignalName = Ch5Signal.getSubscriptionSignalName(this.receiveStateTemplateVars);
        const receiveTmplVarsSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
            .getStringSignal(subReceiveTmplVarsSignalName);


        if (receiveTmplVarsSignal !== null) {
            // add new subscription
            this.receiveStateTemplateVarsSubscription = receiveTmplVarsSignal.subscribe(
                (newValue: string) => {
                    let newTmplVarsVal: object[] | null = null;
                    try {
                        newTmplVarsVal = JSON.parse(newValue);
                    } catch (e) {
                        this.info('Ch5Select receiveTemplateVarsSignal signal value for ' +
                            this.getAttribute('data-ch5-id') + ' cannot be parsed');
                    }
                    if (newTmplVarsVal instanceof Array && newTmplVarsVal !== null) {
                        // update interval template vars property
                        this.templateVarsData = newTmplVarsVal;
                        // re-render options
                        this.selectPanel.innerHTML = '';
                        this.renderCh5SelectOptions();
                    } else {
                        this.info('Ch5Select receiveTemplateVarsSignal signal value for ' +
                            this.getAttribute('data-ch5-id') + ' is invalid');
                    }
                });
        }
    }

    /**
     * For each single selection a callback will run after signalValueSyncTimeout ms to ensure the value sent using
     * sendEventOnChange or ch5-select-option.sendEventOnClick is also received by receiveStateValue.
     * If the received value is not the same, selection will be updated to the last value received as selected
     * @param {number} newSelectedVal
     * @private
     */
    private _setSelectionTimeoutCallback(newSelectedVal: number): void {
        const emptyReceiveSignalValAttr: boolean = this.receiveStateValue === '' || this.receiveStateValue === null ||
            typeof this.receiveStateValue === 'undefined' || this.receiveStateValueSubscription === '';

        const receiveSigSelectedIsUsed: boolean = this._optionsHaveReceiveSignalSelectedAttr();

        if (emptyReceiveSignalValAttr && !receiveSigSelectedIsUsed) {
            // stop setting a timeout if there are no receiveStateValue and no receiveStateSelected subscriptions
            return;
        }
        if (this._selectionTimeout !== null) {
            clearTimeout(this._selectionTimeout as number);
            this._selectionTimeout = null;
        }
        this.info(`New selection timeout set...`);
        this._selectionTimeout = window.setTimeout(() => {
            const lastReceivedValue: number =
                receiveSigSelectedIsUsed ? this._cleanValue : this.lastReceivedSignalValue;

            if (lastReceivedValue !== newSelectedVal) {
                this.setAttribute('selectedValue', String(lastReceivedValue));
                // fire change event
                this._fireChangeEvent(lastReceivedValue, newSelectedVal);
                this.info('Selection timeout: selectedValue was updated to the last value received ' +
                    'from receivedSignalValue or receiveStateSelected signals: ' + lastReceivedValue);
                this.dirty = false;
            }
            clearTimeout(this._selectionTimeout as number);
            this._selectionTimeout = null;
        }, this._signalValueSyncTimeout);
    }

    private _handleOptionSelected(e: Event): void {
        const setSelected: boolean = (e as any).detail.set;
        let newSelectedVal: number = (e as any).detail.idx;

        if (!this.multiselect) {
            const oldSelectedVal: number = this.selectedValue as number;

            if ((e as any).detail.resetDirty) {
                /**
                 * This case is for a selection made by receiveStateSelected attribute
                 * and there is no receivedSignalValue used to validate selection and reset dirty property.
                 */
                this.dirty = false;
                this._cleanValue = (!setSelected && oldSelectedVal === newSelectedVal) ? 0 : newSelectedVal;
            }

            if (!setSelected) {
                if (oldSelectedVal === newSelectedVal) {
                    // value to be unselected is === with current selected value => unselect current value
                    newSelectedVal = -1;
                    this._lastSelectedOptIdx = oldSelectedVal;
                } else {
                    // unselect action for an option that is not selected => abort
                    return;
                }
            }

            if (oldSelectedVal !== newSelectedVal) {

                const ch5SelectOption: Ch5SelectOption | null = this._getOptionElByIdx(
                    setSelected ? newSelectedVal : oldSelectedVal);
                if (ch5SelectOption instanceof HTMLElement) {
                    if (setSelected) {
                        this._markOptionAsSelected(newSelectedVal, ch5SelectOption);
                    } else {
                        this._unsetOptionSelected(ch5SelectOption);
                    }

                    this._closeSelectPanelIfPlain();
                    // new value selected, selection confirmed and complete
                    // setting selectedValue attribute will also populate selectedValue property
                    this.setAttribute('selectedValue', String(newSelectedVal));
                    if ((e as any).detail.resetDirty !== true && newSelectedVal !== this._cleanValue) {
                        /**
                         * Avoid setting the element dirty after current option is selected by
                         * receiveStateSelected signal
                         */
                        this.dirty = true;
                    }
                    // fire change event
                    this._fireChangeEvent(newSelectedVal, oldSelectedVal);

                    if (!this._hasFeedbackModeSubmit()) {
                        // set selection timeout callback
                        this._setSelectionTimeoutCallback(newSelectedVal);
                        // send change signal
                        this.sendOnChangeSignal(newSelectedVal);
                    }
                }
            } else if (oldSelectedVal === newSelectedVal) {
                 this._closeSelectPanelIfPlain();
            }
        } else {
            // multi-selection is available only in panel mode
            const ch5SelectOption = this._getOptionElByIdx(newSelectedVal);
            const confirmed: boolean = (e as any).detail.confirmed || false;
            this._updateMultiselectedValuesMap(setSelected, newSelectedVal, confirmed);
            if (setSelected) {
                this._addToSelectedOptions(newSelectedVal);
                this._setOptionSelected(ch5SelectOption);
            } else {
                this._removeFromSelectedOptions(newSelectedVal);
                this._unsetOptionSelected(ch5SelectOption);
            }

            this.dirty = true;

            if (!this._hasFeedbackModeSubmit()) {
                this._setMultiselectionTimeoutCallback();
            }

            if (this._multiselectValuesAreAllConfirmed()) {
                this.info(`Multi-selection confirmed, cancel confirmation timeout fallback...`);
                if (this._multiselectionTimeout !== null) {
                    clearTimeout(this._multiselectionTimeout as number);
                    this._multiselectionTimeout = null;
                }
                this._multiselectionTimeoutCallback();
            }
        }
    }

    private _multiselectValuesAreAllConfirmed(): boolean {
        return (this._multiselectedValuesMap as any).every((m: any) => m.confirmed === true);
    }

    private _optionsHaveReceiveSignalSelectedAttr(): boolean {
        const tempTmpl = document.createElement('template');
        tempTmpl.innerHTML = this._optionTemplateHTML;
        const optElTmpl: HTMLElement | null = (tempTmpl as any).content.firstChild;
        return optElTmpl !== null && optElTmpl.hasAttribute('receiveStateSelected') &&
            optElTmpl.getAttribute('receiveStateSelected') !== null;
    }

    private _setMultiselectionTimeoutCallback(): void {
        if (!this._optionsHaveReceiveSignalSelectedAttr()) {
            // If receiveStateSelected is not set on options there is no way
            // of confirming the multiselect selected options. No need for timeout in this case.
            return;
        }
        if (this._multiselectionTimeout !== null) {
            clearTimeout(this._multiselectionTimeout as number);
            this._multiselectionTimeout = null;
        }
        this.info(`New multi-selection timeout set...`);
        this._multiselectionTimeout = window.setTimeout(() => {

            this._multiselectionTimeoutCallback();

            clearTimeout(this._multiselectionTimeout as number);
            this._multiselectionTimeout = null;
        }, this._signalValueSyncTimeout);
    }

    private _multiselectionTimeoutCallback(): void {
        // set as values selected all values that are confirmed
        const newSelectedVals = this._multiselectedValuesMap.length > 0
            ? (this._multiselectedValuesMap as any).filter((m: any) => {
                const _isCleanVal = this._isCleanValue(m.idx);
                if ((!_isCleanVal && m.selected && m.confirmed) ||
                    (_isCleanVal && !m.selected && !m.confirmed)) {
                    // keep new selected and confirmed values
                    // keep old selected, marked as unselected, but unconfirmed values
                    // Don't exclude zero.
                    return m.idx === 0 ? '0' : m.idx;
                }
            }).map((m:any) => m.idx)
            : [];

        const unselectedCleanVals = this._multiselectedValuesMap.length > 0
            ? (this._multiselectedValuesMap as any).filter((m: any) => {
                /* tslint:disable */
                const _isCleanVal = this._isCleanValue(m.idx);
                if ((_isCleanVal || _isCleanVal === 0) && !m.selected && m.confirmed) {
                     // Don't exclude zero.
                    return m.idx === 0 ? '0' : m.idx;
                }
                /* tslint:enable */
            }).map((m:any) => m.idx)
            : [];

        // keep previous and unmodified selected values
        const prevSelected = this._cleanValues.filter(
            cVal => newSelectedVals.indexOf(cVal) === -1 && unselectedCleanVals.indexOf(cVal) === -1);

        const newValues = [...newSelectedVals, ...prevSelected].sort((a, b) => a - b);
        this.info('Update multiselect selected values using confirmed values ' +
            'and previous unchanged selected values', newValues);
        this.setValue(newValues);
    }

    private _isCleanValue(optionIdx: number) {
        return this._cleanValues.filter(cVal => cVal === optionIdx)[0];
    }

    private _updateMultiselectedValuesMap(setSelected: boolean, optionIdx: number, confirmed: boolean): void {
        if (typeof optionIdx !== 'number') {
            return;
        }

        const _isCleanVal = this._isCleanValue(optionIdx);

        const mappedSelection: object = (this._multiselectedValuesMap as any[])
            .filter(sOpt => sOpt.idx === optionIdx)[0];

        if (this._hasFeedbackModeSubmit() && mappedSelection && !_isCleanVal && !setSelected) {
            // in feedback mode submit if opt is unselected and is not in clean values list we can remove
            // it from selected values map
            this._multiselectedValuesMap = (this._multiselectedValuesMap as any[])
                .filter(sOpt => sOpt.idx !== optionIdx);
            return;
        }

        /* tslint:disable */
        if (!mappedSelection) {
            // opt has not been prev selected
            this._multiselectedValuesMap.push({
                idx: optionIdx,
                selected: setSelected,
                confirmed: confirmed
            });
        } else {
            (mappedSelection as any).selected = setSelected;
            (mappedSelection as any).confirmed = confirmed;
        }
        /* tslint:disable */
    }

    private _hasFeedbackModeSubmit(): boolean {
        return this.feedbackMode === Ch5Select.FEEDBACK_MODE_VALUES[1];
    }

    private _fireChangeEvent(newVal: number | number[] | null, oldVal?: number | number[] | null): void {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {newValue: newVal, oldValue: oldVal},
            bubbles: true,
            cancelable: false
        }));
    }

    private _fireDirtyOrCleanEvent() {
        if (!this._hasFeedbackModeSubmit()) {
            return;
        }
        if (this.dirty) {
            this.dispatchEvent(new CustomEvent('dirty', {
                bubbles: true,
                cancelable: false
            }));

            if(this.ondirtyCallback instanceof HtmlCallback) {
                this.ondirtyCallback.run({} as Event);
            } else if(this.ondirtyCallback instanceof Function) {
                this.ondirtyCallback();
            }

        } else {
            this.dispatchEvent(new CustomEvent('clean', {
                bubbles: true,
                cancelable: false
            }));

            if(this.oncleanCallback instanceof HtmlCallback) {
                (this.oncleanCallback as HtmlCallback).run({} as Event);
            } else if(this.oncleanCallback instanceof Function) {
                this.oncleanCallback();
            }
        }
    }

    private sendOnChangeSignal(selectedIdx: number): void {
        if (!(typeof this.sendEventOnChange === 'string' && this.sendEventOnChange !== '')) {
            return;
        }

        const sigOnChange: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(this.sendEventOnChange);

        if (sigOnChange !== null) {
            sigOnChange.publish(selectedIdx);
        }
    }

    /**
     * Valid only for single selection curx-select
     * @param {number} selectedIndex
     * @param {Ch5SelectOption | null} ch5SelectOption
     * @private
     */
    private _markOptionAsSelected(selectedIndex: number, ch5SelectOption?: Ch5SelectOption | null): void {
        if (this.multiselect || !this._isValidElement(this.selectPanel)) {
            return;
        }
        // search current selected value and reset UI selected state
        const selectedOption: Ch5SelectOption | null = this.querySelector(
            'ch5-select-option.' + Ch5Select.ITEM_SELECTED_STYLE_CLASS);
        this._unsetOptionSelected(selectedOption);

        if (selectedIndex >= 0) {
            if (typeof ch5SelectOption === 'undefined') {
                ch5SelectOption = null;
            }
            const optToMarkAsSelected: Ch5SelectOption | null = (ch5SelectOption !== null) ? ch5SelectOption
                : this._getOptionElByIdx(selectedIndex);

            this._setOptionSelected(optToMarkAsSelected);
        }

    }

    private _setOptionSelected(opt: Ch5SelectOption | null): void {
        if (opt instanceof HTMLElement &&
            typeof opt.applySelectedStyleClass === 'function') {
            opt.applySelectedStyleClass();
        }
    }

    private _unsetOptionSelected(opt: Ch5SelectOption | null): void {
        if (opt instanceof HTMLElement &&
            typeof opt.removeSelectedStyleClass === 'function') {
            opt.removeSelectedStyleClass();
        }
    }

    private _getOptionElByIdx(idx: number): Ch5SelectOption | null {
        return this.querySelector(`ch5-select-option[data-ch5-opt-idx="${idx}"]`);
    }

    private _handleReceiveSignalValue(): void {
        // remove old subscription, if exist
        if (this.receiveStateValue !== '' && this.receiveStateValueSubscription !== '') {
            this._unsubscribeOldSignal(this.receiveStateValue as string,
                this.receiveStateValueSubscription, 'number');
            this.receiveStateValueSubscription = '';

        }

        if (this.multiselect || this.receiveStateValue === '' || this.receiveStateValue === null) {
            return;
        }

        const subReceiveValueSignalName = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
        const receiveValueSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
            .getNumberSignal(subReceiveValueSignalName);


        if (receiveValueSignal !== null) {
            // add new subscription
            this.receiveStateValueSubscription = receiveValueSignal.subscribe((newValue: number) => {
                const newNrVal = Number(newValue);
                if (!isNaN(newNrVal) && receiveValueSignal.hasChangedSinceInit()) {
                    this.info(`Received signal value: ${newValue}`);
                    this.lastReceivedSignalValue = newNrVal;

                    if (this._selectionTimeout === null) {
                        const oldSelectedVal = this.selectedValue;
                        // no selection timeout set; no selection in progress; update attribute with the new value
                        this.setAttribute('selectedValue', String(this.lastReceivedSignalValue));
                        this.dirty = false;
                        // fire change event (NOTE: UI will be changed after selectedValue setter runs)
                        this._fireChangeEvent(this.lastReceivedSignalValue, oldSelectedVal as number);
                    } else {
                        // at least one option has been selected and timeout callback
                        // will adjust the selection if needed

                        // do not wait for the timeout callback to run; if received value is the same as the selected
                        // value => update dirty property
                        if (Number(this.selectedValue) === this.lastReceivedSignalValue) {
                            this.dirty = false;
                        }
                    }

                } else {
                    this.info('Ch5Select receiveStateValue signal value for ' +
                        this.getAttribute('data-ch5-id') + ' is invalid');
                }
            });
        }
    }

    private _addToSelectedOptions(optionIdx: number): void {
        if (typeof optionIdx !== 'number') {
            return;
        }
        if (this.selectedValues.indexOf(optionIdx) === -1) {
            this.selectedValues.push(optionIdx);
            this.selectedValues.sort((a, b) => a - b);
            this._updateMultiSelectionInMainPanel();
        }
    }

    private _removeFromSelectedOptions(optionIdx: number): void {
        if (typeof optionIdx !== 'number') {
            return;
        }
        this.selectedValues = this.selectedValues.filter(o => o !== optionIdx);
    }

    private _closeSelectPanelIfPlain(): void {
        // for plain mode only close select panel
        if (this._isPlain()) {
            setTimeout(() => {
                // option selection started => close panel => wait for bg option change processing
                this.closeSelectPanel();
            }, 100);
        }
    }

    public submit(): void {
        if (!(this._hasFeedbackModeSubmit() && this.getDirty())) {
            return;
        }
        if (!this.multiselect) {
            // set selection timeout callback
            this._setSelectionTimeoutCallback(this.selectedValue as number);
            // send change signal if there is an attribute value for this
            this.sendOnChangeSignal(this.selectedValue as number);

            // trigger selected option sendEventOnClick
            let optIdxForSendSignalOnClick: number = this.selectedValue as number;
            if (optIdxForSendSignalOnClick === 0) {
                /**
                 * the element is dirty, but the selected option has been unselected
                 */
                if (Number(this._lastSelectedOptIdx) > 0) {
                    /**
                     * The sendEventOnClick will be fired from last selected option and it will only work as expected
                     * if the signal will trigger toggle receiveStateSelected signal of the option.
                     *  TODO: this is an edge case and it more likely to cause other issues that I cannot know right now
                     */
                    optIdxForSendSignalOnClick = this._lastSelectedOptIdx as number;
                }
            }
            this.info('submit():', optIdxForSendSignalOnClick);
            this._triggerOptSendSignalOnClick(optIdxForSendSignalOnClick);
        } else {
            this.info('submit():', this._multiselectedValuesMap);
            this._setMultiselectionTimeoutCallback();
            if (this._multiselectedValuesMap.length > 0) {
                (this._multiselectedValuesMap as any).forEach(
                    (opt: any) => this._triggerOptSendSignalOnClick(opt.idx));
            }
        }
    }

    private _triggerOptSendSignalOnClick(optIdx: number): void {
        const ch5SelectOption: Ch5SelectOption | null = this._getOptionElByIdx(optIdx);
        if (ch5SelectOption instanceof HTMLElement) {
            ch5SelectOption.sendClickSignal();
        }
    }

    public get dirty(): boolean {
        return this._dirty;
    }

    public set dirty(isDirty: boolean) {
        if (this._dirty !== isDirty) {
            this._dirty = isDirty;
            // fire custom dirty event
            this._fireDirtyOrCleanEvent();
        }
    }

    /**
     * Returns true if feedbackmode='submit' and the displayed value is different than the actual value
     * @returns {boolean}
     */
    public getDirty(): boolean {
        return this.dirty;
    }

    public reset(): void {
        if (!this._hasFeedbackModeSubmit() && !this.getDirty()) {
            return;
        }

        if (!this.multiselect) {
            this.info('reset() to:', this._cleanValue);
            this.setAttribute('selectedValue', String(this._cleanValue));
            this.dirty = false;
            this._fireChangeEvent(this.lastReceivedSignalValue, this.selectedValue as number);
        } else {
            this.info('reset() to:', this._cleanValues);
            this.setValue(this._cleanValues);
        }
    }

    public setValue(value: number | number[]): void {
        this.info('setValue() to:', value);
        if (!this.multiselect) {
            const oldVal: number = this.selectedValue as number;
            this.lastReceivedSignalValue = value as number; // set needed to be able to reset to the right value
            this.dirty = false;
            this.setAttribute('selectedValue', String(value));
            this._fireChangeEvent(value, oldVal);
        } else {
            const optsToUnselect: number[] = this.selectedValues.filter(
                (sVal: number) => (value as number[]).indexOf(sVal) === -1);
            if (optsToUnselect.length > 0) {
                // unselect prev selected options
                optsToUnselect.forEach((optIdx: number) => {
                    const optUnselected = this._getOptionElByIdx(optIdx);
                    this._removeFromSelectedOptions(optIdx);
                    this._unsetOptionSelected(optUnselected);

                    if (optUnselected !== null && optUnselected.defaultTmplIsUsed()) {
                        (optUnselected as any).setToggleValue(false);
                    }
                });
            }

            const newOptsToSelect: number[] = (value as number[]).filter(
                (sVal: number) => (this.selectedValues as number[]).indexOf(sVal) === -1);
            if (newOptsToSelect.length > 0) {
                newOptsToSelect.forEach((optIdx: number) => {
                    const ch5SelectOption = this._getOptionElByIdx(optIdx);
                    this._addToSelectedOptions(optIdx);
                    this._setOptionSelected(ch5SelectOption);

                    if (ch5SelectOption !== null && ch5SelectOption.defaultTmplIsUsed()) {
                        (ch5SelectOption as any).setToggleValue(true);
                    }
                });
            }
            this.dirty = false;
            this._multiselectedValuesMap = [];
            this._cleanValues = this.selectedValues.slice(0);
        }
    }

    public getValue(): number | number[] {
        if (!this.multiselect) {
            this.info('getValue():', this.selectedValue);
            return this.selectedValue as number;
        } else {
            this.info('getValue():', this.selectedValues);
            return this.selectedValues;
        }
    }

    public get lastReceivedSignalValue() {
        return this._lastReceivedSignalValue;
    }

    public set lastReceivedSignalValue(val: number) {
        if (this._lastReceivedSignalValue !== val) {
            this._lastReceivedSignalValue = val;
            this._cleanValue = val; // if receiveStateValue is used lastReceivedSignalValue is considered clean value
        }
    }

    private _updateSingleSelectionInMainPanel(): void {
        const ch5SelectOption: Ch5SelectOption | null = this._getOptionElByIdx(this.selectedValue as number);
        if (ch5SelectOption instanceof HTMLElement) {
            // is valid option
            this.selectedOptionsPanel.innerHTML = ch5SelectOption.innerHTML;
            this._setSelectedClass(true);
        } else {
            this.selectedOptionsPanel.innerHTML = this.noneSelectedPrompt as string;
            this._setSelectedClass(false);
        }
    }

    public get noneSelectedPrompt(): string | null {
        return this._getTranslatedValue('noneSelectedPrompt', this._noneSelectedPrompt) || this._noneSelectedPrompt;
    }

    public set noneSelectedPrompt(value: string | null) {

        value = this._checkAndSetStringValue(value, Ch5Select.PLACEHOLDER_DEFAULT);

        const trValue = this._getTranslatedValue('noneSelectedPrompt', value);

        if(trValue === this._noneSelectedPrompt) {
            return;
        }

        this.setAttribute('noneSelectedPrompt', trValue);
        this._noneSelectedPrompt = value;

        // update placeholder text if needed
        if ((!this.multiselect && this.selectedValue === -1) ||
            (this.multiselect && this.selectedValues.length === 0)) {
            this.selectedOptionsPanel.innerHTML = trValue;
        }

    }

    private _updateMultiSelectionInMainPanel(): void {
        if (this.selectedValues.length > 0) {
            let labels: string[] = [];
            this.selectedValues.forEach((optIdx: number) => {
                const ch5SelectOption: Ch5SelectOption | null = this._getOptionElByIdx(optIdx);
                if (ch5SelectOption instanceof HTMLElement) {
                    // is valid option
                    labels.push(ch5SelectOption.optLabel);
                }
            });
            const labelsStr = labels.join(', ');
            const selectedOptionsPanelSize: ClientRect = this.selectedOptionsPanel.getBoundingClientRect();

            const labelsEl = document.createElement('span');
            labelsEl.style.position = 'absolute';
            labelsEl.style.visibility = 'hidden';
            labelsEl.style.fontSize = window.getComputedStyle(this.mainPanel).fontSize;
            labelsEl.textContent = labelsStr;
            this.appendChild(labelsEl);
            const labelsElSize: ClientRect = labelsEl.getBoundingClientRect();
            if (labelsElSize.width <= selectedOptionsPanelSize.width) {
                this.selectedOptionsPanel.innerHTML = labelsStr;
            } else {
                this.selectedOptionsPanel.innerHTML = `${this.selectedValues.length} items selected`;
            }
            this.removeChild(labelsEl);
            this._setSelectedClass(true);
        } else {
            this.selectedOptionsPanel.innerHTML = this.noneSelectedPrompt as string;
            this._setSelectedClass(false);
        }
    }

    private _isFocused(): boolean {
        return this.hasAttribute('focused');
    }

    private _onFocus(e: Event): void {
        if (this._isFocused()) {
            e.stopImmediatePropagation();
            return;
        }
        this.info('Ch5Select._onFocus()');
        this.setAttribute('focused', '');

        this._sendFocusSignal(true);

        let clonedEvent: Event;
        clonedEvent = new Event(e.type, e);
        this.dispatchEvent(clonedEvent);

        e.preventDefault();
        e.stopPropagation();
    }

    private _onBlur(e: Event): void {
        if (!this._isFocused()) {
            e.stopImmediatePropagation();
            return;
        }
        this.info('Ch5Select._onBlur()');
        this.removeAttribute('focused');
        this._sendFocusSignal(false);

        let clonedEvent: Event;
        clonedEvent = new Event(e.type, e);
        this.dispatchEvent(clonedEvent);

        e.preventDefault();
        e.stopPropagation();
    }

    private _sendFocusSignal(focus: boolean): void {
        const hasOnFocusSignal: boolean = typeof this.sendEventOnFocus === 'string' && this.sendEventOnFocus !== '';
        if (!hasOnFocusSignal) {
            return;
        }
        const focusSig: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance()
            .getBooleanSignal(this.sendEventOnFocus as string);

        if (focusSig !== null) {
            focusSig.publish(focus);
        }
    }

    public getCssClassDisabled(): string {
        return `${this.cssClassPrefix}--disabled`;
    }

    private _setSelectedClass(set: boolean) : void {
        if (set) {
            this.classList.add('ch5-select—selected')
        } else {
            this.classList.remove('ch5-select—selected');
        }
    }

    private _updateOptionsDirAttr(): void {
        if (!this._isValidElement(this.selectPanel)) {
            return;
        }
        const opts: NodeList = this.selectPanel.querySelectorAll(
            '.' + Ch5Select.PANEL_ITEM_STYLE_CLASS);
        if (opts.length === 0) {
            return;
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < opts.length; i++) {
            (opts[i] as HTMLElement).dir = this.dir;
        }
    }
}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-select', Ch5Select);
}

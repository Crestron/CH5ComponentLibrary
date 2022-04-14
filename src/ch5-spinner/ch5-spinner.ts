// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from 'lodash';
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SpinnerTemplate } from "./ch5-spinner-template";
import { Ch5SpinnerMutationObserver } from "./ch5-spinner-mutation-observer";
import { Ch5SpinnerScroll } from "./ch5-spinner-scroll";
import { Ch5SpinnerEvents } from "./ch5-spinner-events";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";

import HtmlCallback from "../ch5-common/utils/html-callback";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5SpinnerAttributes } from './interfaces/i-ch5-spinner-attributes';
import { TCh5CommonInputFeedbackModes } from '../ch5-common-input/interfaces/t-ch5-common-input';
import { TCh5SpinnerIconPosition } from './interfaces';
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';

export class Ch5Spinner extends Ch5Common implements ICh5SpinnerAttributes {

  public static get observedAttributes() {

    const commonObservedAttributes = Ch5Common.observedAttributes;

    const contextObservedAttributes = [
      'size',
      'iconposition',
      'selectedvalue',
      'itemheight',
      'visibleitemscroll',
      'resize',
      'endless',
      'indexid',
      'label',
      'feedbackmode',
      'signalvaluesynctimeout',
      'sendeventonchange',
      'sendeventonfocus',
      'sendeventonoverflow',
      'sendEventOnUnderflow',
      'receivestatevalue',
      'receivestatesize',
      'receivestatelabel',
      'receivestateurl',
      'show'
    ];

    return contextObservedAttributes.concat(commonObservedAttributes);
  }

  constructor() {
    super();

    this._mutationObserver = new Ch5SpinnerMutationObserver(this);
  }

  public set ondirty(callback: HtmlCallback | {}) {
    if (isNil(callback)) {
      callback = {} as HtmlCallback;
    }

    if (callback instanceof HtmlCallback && this.ondirty instanceof Function) {
      return;
    }

    this._ondirty = callback;
  }

  public get ondirty(): HtmlCallback | {} {
    return this._ondirty;
  }

  public set onclean(callback: HtmlCallback | {}) {
    if (isNil(callback)) {
      callback = {} as HtmlCallback;
    }

    if (callback instanceof HtmlCallback && this.onclean instanceof Function) {
      return;
    }

    this._onclean = callback;
  }

  public get onclean(): HtmlCallback | {} {
    return this._onclean;
  }

  /**
   * Setter for templateHelper property
   *
   * @param {Ch5SpinnerTemplate} templateHelper
   */
  public set templateHelper(templateHelper: Ch5SpinnerTemplate) {
    this.info("<ch5-spinner />.set templateHelper");
    this._templateHelper = templateHelper;
  }

  /**
   * Getter for templateHelper property
   *
   * @return {Ch5SpinnerTemplate}
   */
  public get templateHelper(): Ch5SpinnerTemplate {
    this.info("<ch5-spinner />.get templateHelper");
    return this._templateHelper;
  }


  /**
   * Getter scrollHelper
   * @return {Ch5SpinnerScroll}
   */
  public get scrollHelper(): Ch5SpinnerScroll {
    return this._scrollHelper;
  }

  /**
   * Setter scrollHelper
   * @param {Ch5SpinnerScroll} value
   */
  public set scrollHelper(value: Ch5SpinnerScroll) {
    this._scrollHelper = value;
  }


  /**
   * Getter eventsHelper
   * @return {Ch5SpinnerEvents}
   */
  public get eventsHelper(): Ch5SpinnerEvents {
    return this._eventsHelper;
  }

  /**
   * Setter eventsHelper
   * @param {Ch5SpinnerEvents} value
   */
  public set eventsHelper(value: Ch5SpinnerEvents) {
    this._eventsHelper = value;
  }


  /**
   * Getter selectedItem
   * @return {HTMLElement}
   */
  public get selectedItem(): HTMLElement {
    return this._selectedItem;
  }

  /**
   * Setter selectedItem
   * @param {HTMLElement} value
   */
  public set selectedItem(value: HTMLElement) {
    this._selectedItem = value;
  }


  /**
   * Getter cleanItem
   * @return {number}
   */
  public get cleanItem(): number {
    return this._cleanItem;
  }

  /**
   * Setter cleanItem
   * @param {number} value
   */
  public set cleanItem(value: number) {
    this._cleanItem = value;
  }


  /**
   * Getter receiveStateValueSub
   * @return {string}
   */
  public get receiveStateValueSub(): string {
    return this._receiveStateValueSub;
  }

  /**
   * Setter receiveStateValueSub
   * @param {string} value
   */
  public set receiveStateValueSub(value: string) {
    this._receiveStateValueSub = value;
  }


  /**
   * Getter receiveStateSizeSub
   * @return {string}
   */
  public get receiveStateSizeSub(): string {
    return this._receiveStateSizeSub;
  }

  /**
   * Setter receiveStateSizeSub
   * @param {string} value
   */
  public set receiveStateSizeSub(value: string) {
    this._receiveStateSizeSub = value;
  }

  /**
   * Getter wasInstantiated
   * @return {boolean}
   */
  public get wasInstantiated(): boolean {
    return this._wasInstantiated;
  }

  /**
   * Setter wasInstantiated
   * @param {boolean} value
   */
  public set wasInstantiated(value: boolean) {
    this._wasInstantiated = value;
  }

  /**
   * Setter for size property
   *
   * @param {number} size
   */
  public set size(size: number) {
    const _size: number = (this.size !== size && isNil(size))
      ? 1
      : this.adjustMaxSizeValue(size);

    if (this.size !== _size) {
      this.setAttribute('size', _size + '');
    }

    this._size = _size;
  }

  /**
   * Getter for size property
   *
   * @return {number}
   */
  public get size(): number {

    return this._size;
  }

  /**
   * Setter for icon Position
   *
   * @param {TCh5SpinnerIconPosition} position
   */
  public set iconPosition(position: TCh5SpinnerIconPosition) {

    if (this.iconPosition !== position && isNil(position)) {
      position = 'first';
    }

    const iconPosition = Ch5Spinner.ICONPOSITIONS.filter(_pos => position.trim() === _pos);

    if (iconPosition.length > 0) {
      position = iconPosition[0];
    } else {
      position = Ch5Spinner.ICONPOSITIONS[0];
    }

    if (document.dir === 'rtl') {
      if (position === Ch5Spinner.ICONPOSITIONS[0]) {
        position = Ch5Spinner.ICONPOSITIONS[1];
      } else {
        position = Ch5Spinner.ICONPOSITIONS[0];
      }
    }

    if (position !== this._iconPosition) {
      this.setAttribute('iconposition', position);
      this.repaint();
    }

    this._iconPosition = position;
  }

  /**
   * Getter for iconPosition property
   *
   * @return {TCh5SpinnerIconPosition}
   */
  public get iconPosition(): TCh5SpinnerIconPosition {

    return this._iconPosition;
  }

  /**
   * Setter for selectedValue property
   *
   * @param {number} value
   */
  public set selectedValue(value: number) {

    if (this.selectedValue !== value && isNil(value)) {
      value = 0;
    }

    if (value !== this.selectedValue) {
      this.setAttribute('selectedValue', value + '');

      if (this.scrollHelper instanceof Ch5SpinnerScroll) {
        this._scrollHelper.selectTheItem(value);
      }
    }

    this._selectedValue = value;
  }

  /**
   * Getter for selectedValue property
   *
   * @return {number}
   */
  public get selectedValue(): number {

    return this._selectedValue;
  }

  public get selectedValueIndex() {
    return this.selectedValue;
  }

  /**
   * Setter for itemHeight
   *
   * @param {string} height
   */
  public set itemHeight(height: string) {

    if (this.itemHeight !== height && isNil(height)) {
      height = '';

    }

    if (height.indexOf('px') === -1 && height.indexOf('vh') === -1) {
      height = height + 'px';
    }

    if (height !== '' && this.itemHeight !== height) {
      this.setAttribute('itemheight', height);
    }

    this._itemHeight = height;
  }

  /**
   * Getter for itemHeight property
   *
   * @return {string}
   */
  public get itemHeight(): string {

    return this._itemHeight;
  }

  /**
   * Setter for visibleItemScroll
   *
   * @param {number} items
   */
  public set visibleItemScroll(items: number) {

    if (this.visibleItemScroll !== items && isNil(items)) {
      items = Ch5Spinner.VISIBLEITEMSCROLL;
    }

    if (items > this.size) {
      items = this.size;
    }

    if (items !== this.visibleItemScroll) {
      this.repaint();
    }

    this._visibleItemScroll = items;
  }

  /**
   * Getter for visibleItemScroll property
   *
   * @return {number}
   */
  public get visibleItemScroll(): number {

    return this._visibleItemScroll;
  }

  /**
   * Setter for resize property
   *
   * @param {bolean} resize
   */
  public set resize(resize: boolean) {

    if (this.resize !== resize && isNil(resize)) {
      resize = false;
    }

    if (resize !== this.resize) {
      this.setAttribute('resize', resize + '');
    }

    this._resize = resize;
  }

  /**
   * Getter for resize property
   *
   * @return {boolean}
   */
  public get resize(): boolean {

    return this._resize;
  }

  /**
   * Setter for endless property
   *
   * @param {boolean} endless
   */
  public set endless(endless: boolean) {

    if (this.endless !== endless && isNil(endless)) {
      endless = false;
    }

    if (endless !== this._endless) {
      this.setAttribute('endless', endless + '');
      this.repaint();
    }

    this._endless = endless;
  }

  /**
   * Getter for endless property
   *
   * @return {boolean}
   */
  public get endless(): boolean {

    return this._endless;
  }
  /**
   * Setter for indexId property
   *
   * @param {string} id
   */
  public set indexId(id: string) {

    if (this.indexId !== id && isNil(id)) {
      id = '';
    }

    if (id !== this.indexId) {
      this.setAttribute('indexId', id);
      this.repaint();
    }

    this._indexId = id;
  }

  /**
   * Getter for indexId property
   *
   * @return {string}
   */
  public get indexId(): string {

    return this._indexId;
  }

  /**
   * Setter for receiveStateValue
   *
   * @param {string} value
   */
  public set receiveStateValue(value: string) {

    if (this.receiveStateValue !== value && isNil(value)) {

      value = '';
    }

    if (value !== this.receiveStateValue) {
      this.setAttribute('receiveStateValue', value);
      this.registerReceiveSignalValue();
    }

    this._receiveStateValue = value;
  }

  /**
   * Getter for receiveStateValue
   *
   * @return {string}
   */
  public get receiveStateValue(): string {
    // The internal property is changed if/when the element is removed from DOM
    // Returning the attribute instead of the internal property preserves functionality
    return this._attributeValueAsString('receivestatevalue');
  }

  /**
   * Setter for receiveStateSize
   *
   * @param {string} value
   */
  public set receiveStateSize(value: string) {
    if (this.receiveStateSize !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.receiveStateSize) {
      this.setAttribute('receiveStateSize', value);
      this.repaint();
    }

    this._receiveStateSize = value;
  }

  /**
   * Getter for receiveStateSize
   *
   * @return {string}
   */
  public get receiveStateSize(): string {
    // The internal property is changed if/when the element is removed from DOM
    // Returning the attribute instead of the internal property preserves functionality
    return this._attributeValueAsString('receivestatesize');
  }

  /**
   * Setter for receiveStateLabel
   *
   * @param {string} value
   */
  public set receiveStateLabel(value: string) {

    if (this.receiveStateLabel !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.receiveStateLabel) {
      this.setAttribute('receiveStateLabel', value);
      this.repaint();
    }

    this._receiveStateLabel = value;
  }

  /**
   * Getter for receiveStateLabel
   *
   * @return {string}
   */
  public get receiveStateLabel(): string {
    // The internal property is changed if/when the element is removed from DOM
    // Returning the attribute instead of the internal property preserves functionality
    return this._attributeValueAsString('receivestatelabel');
  }

  /**
   * Setter for receiveStateUrl
   *
   * @param {string} value
   */
  public set receiveStateUrl(value: string) {

    if (this.receiveStateValue !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.receiveStateUrl) {
      this.setAttribute('receiveStateUrl', value);
      this.repaint();
    }

    this._receiveStateUrl = value;
  }

  /**
   * Getter for receiveStateUrl
   *
   * @return {string}
   */
  public get receiveStateUrl(): string {
    // The internal property is changed if/when the element is removed from DOM
    // Returning the attribute instead of the internal property preserves functionality
    return this._attributeValueAsString('receivestateurl');
  }

  /**
   * Setter for sendEventOnFocus property
   *
   * @param {string} value
   */
  public set sendEventOnFocus(value: string) {

    if (this.sendEventOnFocus !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.sendEventOnFocus) {
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

    return this._sendEventOnFocus;
  }

  /**
   * Setter for sendEventOnChange
   *
   * @param {string} value
   */
  public set sendEventOnChange(value: string) {

    if (this.sendEventOnChange !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.sendEventOnChange) {
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

    return this._sendEventOnChange;
  }

  /**
   * Setter for sendEventOnOverflow
   *
   * @param {string} value
   */
  public set sendEventOnOverflow(value: string) {

    if (this.sendEventOnOverflow !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.sendEventOnOverflow) {
      this.setAttribute('sendEventOnOverflow', value);
    }

    this._sendEventOnOverflow = value;
  }

  /**
   * Getter for sendEventOnOverflow
   *
   * @return {string}
   */
  public get sendEventOnOverflow(): string {

    return this._sendEventOnOverflow;
  }

  /**
   * Setter for sendEventOnUnderflow
   *
   * @param {string} value
   */
  public set sendEventOnUnderflow(value: string) {

    if (this.sendEventOnUnderflow !== value && isNil(value)) {
      value = '';
    }

    if (value !== this.sendEventOnUnderflow) {
      this.setAttribute('sendEventOnUnderflow', value);
    }

    this._sendEventOnUnderflow = value;
  }

  /**
   * Getter for sendEventOnUnderflow
   *
   * @return {string}
   */
  public get sendEventOnUnderflow(): string {

    return this._sendEventOnUnderflow;
  }

  /**
   * Setter for feedbackMode property
   *
   * @param {TCh5CommonInputFeedbackModes} value
   */
  public set feedbackMode(value: TCh5CommonInputFeedbackModes) {

    if (this.feedbackMode !== value && isNil(value)) {
      value = 'direct';
    }

    if (Ch5Spinner.FEEDBACKMODES.indexOf(value) < 0) {
      value = Ch5Spinner.FEEDBACKMODES[0];
    }

    if (value !== this._feedbackMode) {
      this.setAttribute('feedbackMode', value);
    }

    this._feedbackMode = value;
  }

  /**
   * Getter for feedbackMode property
   *
   * @return {TCh5CommonInputFeedbackModes}
   */
  public get feedbackMode(): TCh5CommonInputFeedbackModes {

    return this._feedbackMode;
  }

  /**
   * Setter for signalValueSyncTimeout
   *
   * @param {number} value
   */
  public set signalValueSyncTimeout(value: number) {

    if (this.signalValueSyncTimeout !== value && isNil(value)) {
      value = 1500;
    }

    if (value !== this.signalValueSyncTimeout) {
      this.setAttribute('signalValueSyncTimeout', value + '');
    }

    this._signalValueSyncTimeout = value;
  }

  /**
   * Getter for signalValueSyncTimeout
   *
   * @return {number}
   */
  public get signalValueSyncTimeout(): number {

    return this._signalValueSyncTimeout;
  }

  /**
   * Setter for label
   *
   * @param {string} value
   */
  public set label(value: string) {

    // keeps the clean value
    const _value = value;

    if (this.label !== value && isNil(value)) {
      value = '';
    } else {
      value = this._getTranslatedValue('label', value);
    }

    if (value !== '' && this.label !== value && _value !== value) {
      this.setAttribute('label', value);
    }

    this._label = value;
  }

  /**
   * Getter for label
   *
   * @return {string}
   */
  public get label(): string {

    return this._label;
  }

  /**
   * Setter for manualSetItemHeight
   */
  public set autoSetItemHeight(value: boolean) {

    if (this.autoSetItemHeight !== value && isNil(value)) {
      value = false;
    }

    this._autoSetItemHeight = value;
  }

  /**
   * Getter for manualSetItemHeight
   */
  public get autoSetItemHeight(): boolean {

    return this._autoSetItemHeight;
  }

  public static readonly ELEMENT_NAME = 'ch5-spinner';

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatevalue: { direction: "state", stringJoin: 1, contractName: true },
    receivestatesize: { direction: "state", numericJoin: 1, contractName: true },
    receivestatelabel: { direction: "state", stringJoin: 1, contractName: true },
    receivestateurl: { direction: "state", stringJoin: 1, contractName: true },

    sendeventonchange: { direction: "event", booleanJoin: 1, contractName: true },
    sendeventonfocus: { direction: "event", booleanJoin: 1, contractName: true },
    sendeventonoverflow: { direction: "event", booleanJoin: 1, contractName: true },
    sendEventonunderflow: { direction: "event", booleanJoin: 1, contractName: true },
    contractname: {contractName: true},
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
  };

  public static primaryCssClass = 'ch5-spinner';
  public static cssClassPrefix = 'ch5-spinner';

  public static VISIBLEITEMSCROLL = 3;

  public static SYNCTIMEOUT = 1500;

  public static ITEM_HEIGHT_WHEN_EMPTY = '33'

  /**
   * Icon positions
   * @type {TCh5SpinnerIconPosition}
   */
  public static ICONPOSITIONS: TCh5SpinnerIconPosition[] = ['first', 'last'] as TCh5SpinnerIconPosition[];

  /**
   * Feedback mode
   * @type {TCh5CommonInputFeedbackModes}
   */
  public static FEEDBACKMODES: TCh5CommonInputFeedbackModes[] = ['direct', 'submit'] as TCh5CommonInputFeedbackModes[];

  public static readonly COMPONENT_DATA: any = {
    ICON_POSITIONS: {
      default: Ch5Spinner.ICONPOSITIONS[0],
      values: Ch5Spinner.ICONPOSITIONS,
      key: 'icon_position',
      classListPrefix: 'ch5-spinner--'
    },
    FEEDBACK_MODES: {
      default: Ch5Spinner.FEEDBACKMODES[0],
      values: Ch5Spinner.FEEDBACKMODES,
      key: 'feedback_modes',
      classListPrefix: 'ch5-spinner--'
    },
  };

  /**
   * Spinner can have max 30 items
   * @type {number}
   */
  private static MAX_SIZE: number = 30;

  /**
   * Initial number of entries in selection. Default to 1, Range 1-30
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {number}
   */
  private _size: number = 1;

  /**
   * Valid values are 'first' and 'last'. Default is 'first'.
   * This attribute only applies when a template is not provided
   * and the implied template is in use. If template is provided,
   * this property is ignored.
   * If direction attribute is 'ltr', as will be typical in locales with left
   * to right language direction, 'first' is equivalent to icon being
   * Crestron Electronics, Inc. – Copyright ©2018 Page 56
   * Name Type Comments
   * on the left and text on the right. Conversely, if the direction
   * attribute is 'rtl', the 'first' would have the icon on the right and
   * the label to its left. Value of 'last' is the opposite of 'first'.
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _iconPosition: TCh5SpinnerIconPosition = '' as TCh5SpinnerIconPosition;

  /**
   * The 1 based index of the selected item. Valid values >=1 and <= size
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {number}
   */
  private _selectedValue: number = 0;

  /**
   * Height of an item. The value of the height can be in px and
   * vh. We need the item height. If this will not be provided we
   * will calculate base on the first item height.
   * Each item on the list needs to have the same height.
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {number}
   */
  private _itemHeight: string = '';

  /**
   * The number of items to be visible in the
   * upper/lower container around the selected item container.
   * This information is needed so we can know how many items
   * to add to the top of the list and to the bottom. If we do not
   * have this value set, that means we have to calculate how
   * many items can fit in the scrollHeight and the probability that
   * one item will not be fully visible is high. If there is a template
   * including this visibleItems will need to adjust on the height of
   * the template given.
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {number}
   */
  private _visibleItemScroll: number = 0;

  /**
   * If true, then resize the options panel to fit content width.
   * apply only this css rule “width=fit-content” and/or “width =
   * auto” ( depending on the browser agent )
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {boolean}
   */
  private _resize: boolean = false;

  /**
   * endless spinner. This will trigger that the next
   * element after the last to be the first element in the list.
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {boolean}
   */
  private _endless: boolean = false;

  /**
   * Default direct. allow the form submission functionality.
   * direct, submit
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {TCh5CommonInputFeedbackModes}
   */
  private _feedbackMode: TCh5CommonInputFeedbackModes = '' as TCh5CommonInputFeedbackModes;

  /**
   * Defines the time between the user release the
   * handle of the toggle and the time the toggle will check if the
   * value is equal with the value from the signal. If not it will
   * automatically apply the value from the signal. Apply only for
   * feedbackMode direct
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {number}
   */
  private _signalValueSyncTimeout: number = 0;

  /**
   * Provides the name of the offset identifier to substituted with
   * 1 based index of the item in list within the template item
   * surrounded by {{ }} delimiters. See examples.
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _indexId: string = '';

  /**
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _label: string = '';

  /**
   * when receive change the selected value of
   * this selector. 1 based index is expected.
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _receiveStateValue: string = '';

  /**
   * Sets the number of items in this component
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _receiveStateSize: string = '';

  /**
   * Sets the item icon
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _receiveStateUrl: string = '';

  /**
   * Send signal on focus event
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _sendEventOnFocus: string = '';

  /**
   * Send signal on change event
   *
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _sendEventOnChange: string = '';

  /**
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _sendEventOnOverflow: string = '';

  /**
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _sendEventOnUnderflow: string = '';

  /**
   * @private
   * @memberof Ch5SpinnerAttributes
   * @type {string}
   */
  private _autoSetItemHeight: boolean = false;

  /**
   * @type {Ch5SpinnerTemplate}
   */
  private _templateHelper: Ch5SpinnerTemplate = {} as Ch5SpinnerTemplate;

  /**
   * @type {Ch5SpinnerScroll}
   */
  private _scrollHelper: Ch5SpinnerScroll = {} as Ch5SpinnerScroll;

  /**
   * @type {Ch5SpinnerEvents}
   */
  private _eventsHelper: Ch5SpinnerEvents = {} as Ch5SpinnerEvents;

  /**
   * @type {HTMLElement}
   */
  private _selectedItem: HTMLElement = {} as HTMLElement;

  /**
   * @type {number}
   */
  private _cleanItem: number = 0;

  /**
   * @type {string}
   */
  private _receiveStateValueSub: string = '';

  /**
   * @type {string}
   */
  public _receiveStateLabelSub: string = '';

  /**
   * @type {string}
   */
  private _receiveStateSizeSub: string = '';

  /**
   * @type {string}
   */
  private _receiveStateLabel: string = '';

  /**
   * @type {HtmlCallback | {}}
   */
  private _onclean: HtmlCallback | {} = {} as HtmlCallback;

  /**
   * @type {HtmlCallback | {}}
   */
  private _ondirty: HtmlCallback | {} = {} as HtmlCallback;


  /**
   * @type {boolean}
   */
  private _wasInstantiated: boolean = false;

  /**
   * @type {boolean}
   */
  public dirtyFlag: boolean = false;

  private _mutationObserver: Ch5SpinnerMutationObserver = {} as Ch5SpinnerMutationObserver;

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Spinner.ELEMENT_NAME, Ch5Spinner.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerSignalAttributeDefaults() {
		Ch5SignalAttributeRegistry.instance.addElementDefaultAttributeEntries(Ch5Spinner.ELEMENT_NAME, {
			contractName: { attributes: ["contractname"], defaultValue: "" },
			booleanJoin: { attributes: ["booleanjoinoffset"], defaultValue: "0" },
			numericJoin: { attributes: ["numericjoinoffset"], defaultValue: "0" },
			stringJoin: { attributes: ["stringjoinoffset"], defaultValue: "0" }
		});
	}

  /**
   * Triggered when the component is attached to the DOM
   *
   * @return {void}
   */
  public connectedCallback(): void {
    this.info("<ch5-spinner />.connectedCallback()")

    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5Spinner);
    }

    this.contentCleanUp();

    Promise.all([
      customElements.whenDefined('ch5-spinner')
    ]).then(() => {
      if (!this._wasInstantiated) {
        this.cacheComponentChildrens();
        this._wasInstantiated = true;
        this.initUtilities();

        this.initCommonMutationObserver(this);
      }
    });
  }

  public initSignals() {
    this.info("<ch5-spinner />.initSignals()");
    if (this.hasAttribute('receiveStateValue')) {
      this.registerReceiveSignalValue();
    }

    if (this.hasAttribute('receiveStateSize')) {
      this.registerReceiveSignalSize();
    }

    if (this.hasAttribute('receiveStateLabel')) {
      this.registerReceiveSignalLabel();
    }
  }

  /**
   * @protected
   * @memberof Ch5SpinnerAttributes
   * @return {void}
   */
  public dirtyTimeHandler() {
    this.info("<ch5-spinner />.dirtyTimeHandler()");
    window.setTimeout(
      this.dirtyHandler.bind(this), this.signalValueSyncTimeout
    );
  }

  /**
   * Triggered when the component is detached to the DOM
   *
   * @return {void}
   */
  public disconnectedCallback(): void {
    this.info("<ch5-spinner />.disconnectedCallback()");
    this._wasInstantiated = false;
    if (typeof this._scrollHelper.destruct !== "undefined") {
      this._scrollHelper.destruct();
    }
    if (typeof this.templateHelper.destruct !== "undefined") {
      this.templateHelper.destruct();
    }

    this.unsubscribeFromSignals();

    // disconnect common mutation observer
    this.disconnectCommonMutationObserver();
  }

  public unsubscribeFromSignals() {
    this.info("<ch5-spinner />.unsubscribeFromSignals()");
    super.unsubscribeFromSignals();

    if (false === this._keepListeningOnSignalsAfterRemoval) {
      this.clearNumberSignalSubscription(this._receiveStateSize, this._receiveStateSizeSub);
      this._receiveStateUrl = '';
      this.clearNumberSignalSubscription(this._receiveStateValue, this._receiveStateValueSub);
      this._receiveStateValue = '';
      this.clearStringSignalSubscription(this._receiveStateLabel, this._receiveStateLabelSub);
      this._receiveStateLabel = '';
    }
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    this.info('<ch5-spinner />.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
    super.attributeChangedCallback(attr, oldValue, newValue);

    if (this._wasInstantiated && oldValue !== newValue) {
      switch (attr) {
        case 'size':
          if (this.hasAttribute('receiveStateSize') === false) {
            this.size = parseFloat(newValue);
            this.repaint();
          }
          break;
        case 'iconposition':
          this.iconPosition = newValue as TCh5SpinnerIconPosition;
          break;
        case 'selectedvalue':
          this.selectedValue = parseFloat(newValue) as number;
          this._cleanItem = parseFloat(newValue) as number;
          if (this._scrollHelper.constructor === Ch5SpinnerScroll) {
            this._scrollHelper.selectTheItem(parseFloat(newValue));
          }
          break;
        case 'itemheight':
          this.itemHeight = newValue as string;
          this.repaint();
          break;
        case 'visibleitemscroll':
          this.visibleItemScroll = parseFloat(newValue) as number;
          this.repaint();
          break;
        case 'indexid':
          this.indexId = newValue;
          break;
        case 'feedbackmode':
          this.feedbackMode = newValue as TCh5CommonInputFeedbackModes;
          break;
        case 'signalvaluesynctimeout':
          this.signalValueSyncTimeout = parseFloat(newValue) as number;
          break;
        case 'sendeventonchange':
          this.sendEventOnChange = newValue;
          break;
        case 'sendeventonfocus':
          this.sendEventOnFocus = newValue;
          break;
        case 'sendeventonoverflow':
          this.sendEventOnOverflow = newValue;
          break;
        case 'sendEventOnUnderflow':
          this.sendEventOnUnderflow = newValue;
          break;
        case 'receivestatevalue':
          this.receiveStateValue = newValue;
          break;
        case 'receivestatesize':
          this.receiveStateSize = newValue;
          break;
        case 'receivestatelabel':
          this.receiveStateLabel = newValue;
          break;
        case 'receivestateurl':
          this.receiveStateUrl = newValue;
          break;
        case 'show':
          if (!this.itemHeight && newValue) {
            this.templateHelper.handleDefaultItemHeight((this.templateHelper.childrenObject as [HTMLElement])[0] as HTMLElement);
          }
      }

      this.addAriaAttributes();
    }
  }

  /**
   * Adding aria attributes
   *
   * @return {void}
   */
  public addAriaAttributes() {

    if (
      this.templateHelper.constructor === Ch5SpinnerTemplate &&
      this.templateHelper.wrapperElement.constructor === HTMLDivElement
    ) {
      (this.templateHelper.wrapperElement as HTMLDivElement).setAttribute('role', 'listbox');
    }
  }

  /**
   * Subscribe for receiveStateValue
   *
   * @return {void}
   */
  public registerReceiveSignalValue(): void {
    this.info("<ch5-spinner />.registerReceiveSignalValue()");

    // remove old subcription, if exist
    this.clearStringSignalSubscription(this.receiveStateValue, this._receiveStateValueSub);

    // add new subscription
    const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateValue);
    const receiveState: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
      .getNumberSignal(receiveStateName);

    if (receiveState === null) {
      return
    }

    this._receiveStateValueSub = receiveState.subscribe((newValue: number) => {
      if ((newValue !== null || newValue !== undefined) && newValue >= 0) {
        this.selectedValue = newValue;
        this._cleanItem = newValue;
        this._scrollHelper.selectTheItem(newValue);
      }
    });
  }

  /**
   * Subscribe for receiveStateLabel
   *
   * @return {void}
   */
  public registerReceiveSignalLabel(): void {
    this.info("<ch5-spinner />.registerReceiveSignalLabel()");

    // remove old subcription, if exist
    this.clearStringSignalSubscription(this.receiveStateLabel, this._receiveStateLabelSub);

    // add new subscription
    const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateLabel);
    const receiveState: Ch5Signal<string> | null = Ch5SignalFactory.getInstance()
      .getStringSignal(receiveStateName);

    if (receiveState === null) {
      return
    }

    this._receiveStateLabelSub = receiveState.subscribe((newValue: string) => {
      if (newValue !== null || newValue !== undefined) {
        this.setAttribute('label', newValue);
      }
    });
  }

  /**
   * Subscribe for receiveStateSize
   *
   * @return {void}
   */
  public registerReceiveSignalSize(): void {
    this.info("<ch5-spinner />.registerReceiveSignalSize()");

    // remove old subcription, if exist
    this.clearStringSignalSubscription(this.receiveStateSize, this._receiveStateSizeSub);

    // add new subscription
    const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this.receiveStateSize);
    const receiveState: Ch5Signal<number> | null = Ch5SignalFactory.getInstance()
      .getNumberSignal(receiveStateName);

    if (receiveState === null) {
      return
    }

    this._receiveStateSizeSub = receiveState.subscribe((newValue: number) => {
      newValue = this.adjustMaxSizeValue(newValue);
      if (isNil(newValue) || newValue === 0 || this.size === newValue) {
        return;
      }

      this.size = newValue;
      this.repaint();
    });
  }

  /**
   * Repaint the spinner
   *
   * @return {void}
   */
  public repaint(): void {
    this.info("<ch5-spinner />.repaint()");

    try {
      if (this.templateHelper.constructor === Ch5SpinnerTemplate && this.parentNode !== null && this.hasChildNodes()) {
        for (let i = this.childNodes.length - 1; i >= 0; i--) {
          if ((this.childNodes[i] as HTMLElement).tagName === 'TEMPLATE') {
            continue;
          }
          this.removeChild(this.childNodes[i]);
        }

        if (
          !this.hasChildNodes() ||
          (
            this.childNodes[0] !== null &&
            (this.childNodes[0] as HTMLElement).tagName === 'TEMPLATE'
          )
        ) {

          const _shortLifeElement = document.createElement('div');

          (this.parentNode as HTMLElement).insertBefore(_shortLifeElement, this.nextSibling);
          this.remove();
          (_shortLifeElement.parentNode as HTMLElement).insertBefore(this, _shortLifeElement.nextSibling);
          _shortLifeElement.remove();
        }
      }
    } catch (e) {
      console.error('Something wrong with component regeneration', e);
    }
  }

  /**
   * Submit the spinner
   *
   * @return {void}
   */
  public submit() {
    this.info("<ch5-spinner />.submit()");

    if (this.feedbackMode === 'submit') {

      this.dirtyTimeHandler();

      if (this._scrollHelper.getCleanCurrentElementIndex() !== this._cleanItem) {
        const sendEventOnChange = this.sendEventOnChange;

        if ('' !== sendEventOnChange && null !== sendEventOnChange && undefined !== sendEventOnChange) {
          const sigClick = Ch5SignalFactory.getInstance()
            .getNumberSignal(this.sendEventOnChange);

          if (sigClick !== null) {
            sigClick.publish(this._scrollHelper.getCleanCurrentElement());
          }
        }
      }
    }
  }

  /**
   * Reset the selectedItem to the first one
   * or to the value defined in selectedValue attribute
   *
   * @return {void}
   */
  public reset() {
    this.info("<ch5-spinner />.reset()");

    this._scrollHelper.selectTheItem(this.selectedValue);
    this._cleanItem = this._scrollHelper.getCleanCurrentElementIndex();
    this.dirtyFlag = false;

    this._eventsHelper.dispatchClean();
  }

  /**
   * Get the current selected item
   *
   * @return {number}
   */
  public getValue() {
    this.info("<ch5-spinner />.getValue()");

    return this._scrollHelper.getCleanCurrentElement();
  }

  /**
   * Set the selected item
   *
   * @param {number} value
   */
  public setValue(value: number) {
    this.info("<ch5-spinner />.setValue()");

    this._scrollHelper.selectTheItem(value);
  }

  /**
   * Check if the spinner has changed the value
   *
   * @return {boolean}
   */
  public getDirty(): boolean {
    this.info("<ch5-spinner />.getDirty()");

    if (this._cleanItem !== this._scrollHelper.getCleanCurrentElementIndex()) {
      return true;
    }
    return false;
  }

  /**
   * Adjust spinner items max number
   * @param size
   * @private
   */
  private adjustMaxSizeValue(size: number): number {
    return size > Ch5Spinner.MAX_SIZE ? Ch5Spinner.MAX_SIZE : size;
  }

  public getItemHeightValue(): number {

    const value = parseFloat(this.itemHeight);

    if (isNaN(value) !== true) {
      return value;
    } else {
      return 0;
    }
  }

  public getItemHeightMeasurementUnit(): string {

    if (this.itemHeight.indexOf('px') > -1) {
      return 'px';
    } else if (this.itemHeight.indexOf('vh') > -1) {
      return 'vh';
    } else {
      return 'px';
    }
  }

  /**
   * Get the highlight offset
   * This will be everytime in the middle of the panel
   *
   * @return {number}
   */
  public getHighlightOffsetValue(): number {
    const visibleItemScroll = this.visibleItemScroll;
    const itemHeightValue = this.getItemHeightValue();

    return (Math.ceil(visibleItemScroll / 2) - 1) * itemHeightValue;
  }

  /**
   * Get the highlight offset value with measurment unit
   *
   * @return {string}
   */
  public getHighlightOffset(): string {

    return this.getHighlightOffsetValue() + this.getItemHeightMeasurementUnit();
  }

  /**
   * Initialize the class properties from html attributes
   */
  public initAttributes() {

    super.initAttributes();

    if (this.hasAttribute('autosetitemheight') === true) {
      this.autoSetItemHeight = true;
    }

    if (this.hasAttribute('itemHeight')) {
      this.itemHeight = this.getAttribute('itemHeight') !== null ? this.getAttribute('itemHeight') as string : '';
    }

    if (this.hasAttribute('itemHeight') === false || this.itemHeight === null) {
      this.autoSetItemHeight = true;
      if (isNil(this.templateHelper.element)) {
        this.itemHeight = Ch5Spinner.ITEM_HEIGHT_WHEN_EMPTY;
      }
      this.setAttribute('autosetitemheight', '');
    }

    if (this.hasAttribute('size')) {
      this.size = this.getAttribute('size') !== null ? parseFloat(this.getAttribute('size') as string) as number : this.size;
    }

    if (this.hasAttribute('iconPosition')) {
      this.iconPosition = this.getAttribute('iconPosition') !== null ? this.getAttribute('iconPosition') as TCh5SpinnerIconPosition : Ch5Spinner.ICONPOSITIONS[0];
    } else {
      this.iconPosition = Ch5Spinner.ICONPOSITIONS[0];
    }

    if (this.hasAttribute('selectedValue')) {
      this.selectedValue = this.getAttribute('selectedvalue') !== null ? parseFloat(this.getAttribute('selectedvalue') as string) as number : this.selectedValue;
    }

    if (this.hasAttribute('visibleItemScroll')) {
      this.visibleItemScroll = this.getAttribute('visibleItemScroll') !== null ? parseFloat(this.getAttribute('visibleItemScroll') as string) as number : this.visibleItemScroll;
    } else {
      this.visibleItemScroll = Ch5Spinner.VISIBLEITEMSCROLL;
    }

    if (this.hasAttribute('resize')) {
      this.resize = this.hasAttribute('resize') ? true : false;
    }

    if (this.hasAttribute('endless')) {
      const endless = this.getAttribute('endless') === 'false' ? false : true;
      this.endless = endless;
    }

    if (this.hasAttribute('indexId')) {
      this.indexId = this.getAttribute('indexId') !== null ? this.getAttribute('indexId') as string : '';
    }

    if (this.hasAttribute('label')) {
      this.label = this.getAttribute('label') !== null ? this.getAttribute('label') as string : '';
    }

    if (this.hasAttribute('feedbackMode')) {
      this.feedbackMode = this.getAttribute('feedbackMode') !== null ? this.getAttribute('feedbackMode') as TCh5CommonInputFeedbackModes : 'direct' as TCh5CommonInputFeedbackModes;
    } else {
      this.feedbackMode = Ch5Spinner.FEEDBACKMODES[0];
    }

    if (this.hasAttribute('signalValueSyncTimeout')) {
      this.signalValueSyncTimeout = this.getAttribute('signalValueSyncTimeout') !== null ? parseFloat(this.getAttribute('signalValueSyncTimeout') + '') : 1500;
    } else {
      this.signalValueSyncTimeout = Ch5Spinner.SYNCTIMEOUT;
    }

    if (this.hasAttribute('sendEventOnChange')) {
      this.sendEventOnChange = this.getAttribute('sendEventOnChange') !== null ? this.getAttribute('sendEventOnChange') as string : '';
    }

    if (this.hasAttribute('sendEventOnFocus')) {
      this.sendEventOnFocus = this.getAttribute('sendEventOnFocus') !== null ? this.getAttribute('sendEventOnFocus') as string : '';
    }

    if (this.hasAttribute('sendEventOnOverflow')) {
      this.sendEventOnOverflow = this.getAttribute('sendEventOnOverflow') !== null ? this.getAttribute('sendEventOnOverflow') as string : '';
    }

    if (this.hasAttribute('sendEventOnUnderflow')) {
      this.sendEventOnUnderflow = this.getAttribute('sendEventOnUnderflow') !== null ? this.getAttribute('sendEventOnUnderflow') as string : '';
    }

    if (this.hasAttribute('receiveStateValue')) {
      this.receiveStateValue = this.getAttribute('receiveStateValue') !== null ? this.getAttribute('receiveStateValue') as string : '';
    }

    if (this.hasAttribute('receiveStateSize')) {
      this.receiveStateSize = this.getAttribute('receiveStateSize') !== null ? this.getAttribute('receiveStateSize') as string : '';
    }

    if (this.hasAttribute('receiveStateLabel')) {
      this.receiveStateLabel = this.getAttribute('receiveStateLabel') !== null ? this.getAttribute('receiveStateLabel') as string : '';
    }

    if (this.hasAttribute('receiveStateUrl')) {
      this.receiveStateUrl = this.getAttribute('receiveStateUrl') !== null ? this.getAttribute('receiveStateUrl') as string : '';
    }

    if (this.hasAttribute('onclean')) {
      this.onclean = new HtmlCallback(this, this.getAttribute('onclean') as string);
    }

    if (this.hasAttribute('ondirty')) {
      this.ondirty = new HtmlCallback(this, this.getAttribute('ondirty') as string);
    }
  }

  protected initUtilities() {
    this.info("<ch5-spinner />.initUtilities()");

    this.classList.add(Ch5Spinner.cssClassPrefix);

    this.initAttributes();

    this._eventsHelper = new Ch5SpinnerEvents(this);

    this._templateHelper = new Ch5SpinnerTemplate(this);

    this.resolveTemplateChildren(this._templateHelper.templateElement);

    this._templateHelper.generateTemplate(this.size);

    this._scrollHelper = new Ch5SpinnerScroll(this);
    this.addAriaAttributes();

    this.initSignals();
  }

  protected dirtyHandler() {
    this.info("<ch5-spinner />.dirtyHandler()");

    if (this.dirtyFlag) {
      this._scrollHelper.selectTheItem(this._cleanItem);
      this._eventsHelper.dispatchClean();
      this.dirtyFlag = false;
    }
  }

  protected translateCallback(section: string) {
    this.info("<ch5-spinner />.translateCallback()");

    if (section === 'label') {
      if (this.templateHelper.childrenObject !== null && this.templateHelper.childrenObject.length > 0) {
        this.templateHelper.childrenObject.forEach((child, index) => {
          // make a child clone and update translation for label
          const clonedChild = child.cloneNode(true) as HTMLElement;
          clonedChild.innerHTML = this._getTranslatedValue('label', child.innerHTML);
          // replace indexId if needed
          // TODO: find out if replace indexId is still needed... if not remove it!
          const childWithIndexIdReplaced: DocumentFragment | undefined =
            this.templateHelper.resolveId(index, [clonedChild]);
          if (childWithIndexIdReplaced !== undefined) {
            child.innerHTML = childWithIndexIdReplaced.children[0].innerHTML;
          } else {
            child.innerHTML = clonedChild.innerHTML;
          }
        });
      }
    }
  }
}

if (
  typeof window === "object" &&
  typeof window.customElements === "object" &&
  typeof window.customElements.define === "function"
) {
  window.customElements.define(Ch5Spinner.ELEMENT_NAME, Ch5Spinner);
}

Ch5Spinner.registerSignalAttributeTypes();
Ch5Spinner.registerSignalAttributeDefaults();
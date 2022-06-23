// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export type TCh5TextInputUserBehavior = 'none' | 'fill' | 'erase';

export class Ch5TextInputScaling {

  /**
   * Determines user behavior
   * 
   * @static
   */
  public static USERBEHAVIORS: TCh5TextInputUserBehavior[] = ['none', 'fill', 'erase'] as TCh5TextInputUserBehavior[];

  /**
   * The change factor for fontSize increase/decrease actions
   * 
   * @static
   */
  public static CHANGEFACTOR: number = 0.07 as number;

  /**
   * @type {number}
   * @private
   * @memberof Ch5TextInputScaling
   */
  private _fontSize: number = 16 as number;

  /**
   * @type {number}
   * @private
   * @memberof Ch5TextInputScaling
   */
  private _minimumFontSize: number = 12 as number;

  /**
   * @type {number}
   * @private
   * @memberof Ch5TextInputScaling
   */
  private _maximumFontSize: (number | undefined);

  /**
   * @type {number}
   * @private 
   * @memberof Ch5TextInputScaling
   */
  private _currentFontSize: (number | undefined);

  /**
   * @type {boolean}
   * @private 
   * @memberof Ch5TextInputScaling
   */
  private _edge: (boolean | undefined);

  /**
   * This contains the greater value length which input had
   * 
   * @type {number}
   * @private 
   * @memberof Ch5TextInputScaling
   */
  private _lastValueLength: number = 0 as number;

  /**
   * This contains the value length when the input text hit the edge
   * 
   * @type {number}
   * @private
   * @memberof Ch5TextInputScaling
   */
  private _valueLengthOnHitTheEdge: (number | undefined);

  /**
   * Contains the current value length, 
   * especially used to determine the user behavior
   * 
   * @type {number}
   * @private
   * @memberof Ch5TextInputScaling
   */
  private _valueLength: number = 0 as number;

  /**
   * @type {HTMLInputElement}
   * @private 
   * @memberof Ch5TextInputScaling
   */
  private _input: HTMLInputElement = {} as HTMLInputElement;

  /**
   * @type {HTMLElement}
   * @private
   * @memberof Ch5TextInputScaling
   */
  private _inputPlaceholder: HTMLElement = {} as HTMLElement;

  /**
   * @param {HTMLInputElement} input
   */
  constructor(input: HTMLInputElement) {
    this._input = input;
    this.updateDefaultFontSize();
    this._addInputPlaceholder();
    // adding styles for inputPlaceholder
    this._makeInputPlaceholderFeelLikeInput();
    // make the placeholder unreachable by the user
    this._makeInputPlaceholderUnreachable();
    this.attachEventListener();
  }

  /**
   * Scale the font size within the input
   * 
   * CASES ON INPUT FILL:
   * 
   * Input get fill as much as input can fill
   *  - flag the length which exactly fits the input width
   *  - reset lastGreaterLength
   *  - flag that the value length is at edge
   * 
   * Input overflows - then reduce font size
   *  - store the _lastGreaterLength
   *  - then _edge must be false
   * 
   * Input has a minimum font size up to which the font size can be reduced
   *  - flag the value length when the input reaches minimum font size
   *  - _edge is everytime true  
   *   
   * 
   * @return {void}
   */
  public scaleUp() {

    let action = 'decrease';

    this._fillInputPlaceholder();
    this._flagTheLengthWhichExactlyFits();
    this._resetFontSizeWhenExactlyFits();

    if (this.detectUserBehavior() === 'erase') {
      action = 'increase'
    }

    // if the text width reaches the edge of the input 
    // on typing flag this on edge property
    // if the user erase data from the input then the user 
    // may be already on the edge of the input and the font scaling when data 
    // is erased has to be done only if the text width doesn't reach the 
    // edge of the input 
    if (this._isTextWidthGreaterThanInputWidth() === true) {
      this.edge = true;
    } else if (action === 'increase' && this._isTextWidthGreaterThanInputWidth() === false) {
      this.edge = false;
    }

    if (this.edge === true && action === 'decrease' && this.currentFontSize >= this.minimumFontSize) {
      this._scaleFontSize(action);
      this.edge = false;
    } else if (this.edge === false && action === 'increase') {
      this._scaleFontSize(action);
      this.edge = false;
    }

    // update the valueLength property
    this.valueLength = this._input.value.length;
  }

  /**
   * Restore the input 
   * When the input don't need scale - ensure that the input is using the 
   * right parameters
   * 
   * @return {void}
   */
  public restoreTheInput() {
    this._fillInputPlaceholder();
    this._flagTheLengthWhichExactlyFits();
    this._resetFontSizeWhenExactlyFits();

    this.valueLength = this._input.value.length;
  }

  /**
   * Setter for the fontSize property
   * 
   * @param {number} fontSize
   */
  public set fontSize(fontSize: number) {

    if (
      this.fontSize !== fontSize &&
      (fontSize === undefined || fontSize === null)
    ) {
      fontSize = 16;
    }

    this._fontSize = fontSize;
    this._setFontSizeToInput(fontSize);
  }

  /**
   * Getter for the fontSize property
   */
  public get fontSize(): number {

    return this._fontSize;
  }

  /**
   * Setter for minimumFontSize
   * 
   * @param {number} fontSize
   */
  public set minimumFontSize(fontSize: number) {

    if (
      this.minimumFontSize !== fontSize &&
      (fontSize === undefined || fontSize === null)
    ) {
      fontSize = 12;
    }

    this._minimumFontSize = fontSize;
  }

  /**
   * Getter for minimumFontSize
   * 
   * @return {number}
   */
  public get minimumFontSize(): number {

    return this._minimumFontSize;
  }

  /**
   * Setter for maximumFontSize
   * 
   * @param {number} fontSize
   */
  public set maximumFontSize(fontSize: number) {

    if (
      this.maximumFontSize !== fontSize &&
      (fontSize === undefined || fontSize === null)
    ) {
      fontSize = 20;
    }

    this._maximumFontSize = fontSize;
  }

  /**
   * Getter for maximumFontSize
   * 
   * @return {number}
   */
  public get maximumFontSize(): number {

    return this._maximumFontSize as number;
  }

  /**
   * Setter for valueLength
   * 
   * @param {number} length
   */
  public set valueLength(length: number) {

    if (this.valueLength !== length && (length === undefined || length === null)) {
      length = 0;
    }

    this._valueLength = length;
  }

  /**
   * Getter for valueLength
   * 
   * @return {number}
   */
  public get valueLength(): number {

    return this._valueLength;
  }

  /**
   * Setter for edge property
   * 
   * @param {boolean} isEdge
   * @return {void}
   */
  public set edge(isEdge: boolean) {

    if (
      this.edge !== isEdge &&
      (isEdge !== undefined || isEdge !== null)) {
      this._edge = isEdge;
    }
  }

  /**
   * Getter for edge property
   * 
   * @return {boolean}
   */
  public get edge(): boolean {

    return this._edge as boolean;
  }

  /**
   * Getter for currentFontSize
   * 
   * @return {number}
   */
  public get currentFontSize(): number {

    return this._currentFontSize as number;
  }

  /**
   * Setter for currentFontSize
   * 
   * @param {number} fontSize
   */
  public set currentFontSize(fontSize: number) {

    if (
      this.currentFontSize !== fontSize &&
      (fontSize === undefined || fontSize === null)
    ) {
      fontSize = 16;
    }

    if (!this._validateFontSizeValue(fontSize, 'min')) {
      fontSize = this.minimumFontSize;
    } else if (!this._validateFontSizeValue(fontSize, 'max')) {
      fontSize = this.maximumFontSize;
    }

    this._currentFontSize = fontSize;
  }

  /**
   * Update default font size
   * 
   * @return {void}
   */
  public updateDefaultFontSize(): void {

    this.maximumFontSize = parseFloat(
      (this._input.style.fontSize || window.getComputedStyle(this._input).fontSize) as string
    );

    this.currentFontSize = this.maximumFontSize;
  }

  /**
   * Detecting the user behavior
   * 
   * @return {TCh5TextInputUserBehavior}
   */
  public detectUserBehavior(): TCh5TextInputUserBehavior {

    const inputValueLength = this._input.value.length;
    let behavior = 0;

    if (inputValueLength > this.valueLength) {
      behavior = 1;
    } else if (inputValueLength < this.valueLength) {
      behavior = 2;
    }

    return Ch5TextInputScaling.USERBEHAVIORS[behavior];
  }

  protected attachEventListener() {

    this._input.addEventListener('blur', this.restoreTheInput.bind(this));
    this._input.addEventListener('change', this.restoreTheInput.bind(this));
    this._input.addEventListener('keydown', this.scaleUp.bind(this));
  }

  /**
   * Add a <span> element containing the input value
   * This will help to scale up the font size within the input element
   * 
   * @return {void}
   */
  private _addInputPlaceholder(): void {

    // append the input placeholder
    (this._input.parentNode as HTMLElement)
      .appendChild(this._createInputPlaceholder());

  }

  /**
   * Create the placeholder for the input value
   * 
   * @private
   * @return {HTMLSpanElement}
   */
  private _createInputPlaceholder(): HTMLSpanElement {

    const inputPlaceholder = document.createElement('span');
    inputPlaceholder.style.whiteSpace = 'nowrap';

    this._inputPlaceholder = inputPlaceholder;

    return inputPlaceholder;
  }

  /**
   * Fill the inputPlaceholder with the input value
   * 
   * @param {string} value
   * @return {void}
   */
  private _fillInputPlaceholder(): void {

    // convert spaces to &nbsp;
    const inputValue = this._input.value.replace(/\s/g, '&nbsp;');
    this._inputPlaceholder.innerHTML = inputValue;
  }

  private _makeInputPlaceholderFeelLikeInput(): void {

    const inputStyles = window.getComputedStyle(this._input);

    this._inputPlaceholder.style.fontSize = inputStyles.fontSize;
    this._inputPlaceholder.style.paddingLeft = inputStyles.paddingLeft;
    this._inputPlaceholder.style.paddingRight = inputStyles.paddingRight;

  }

  /**
   * Input placeholder is used only for text width calculation
   * The user should not be able to reach this element
   * 
   * @private
   * @memberof Ch5TextInputScaling
   * @return {void}
   */
  private _makeInputPlaceholderUnreachable(): void {

    this._inputPlaceholder.style.position = 'absolute';
    this._inputPlaceholder.style.top = '-1000px';
    this._inputPlaceholder.style.zIndex = '-9999';
  }

  /**
   * Check if the Text width is greater than the input width
   * 
   * @private 
   * @memberof Ch5TextInputScaling
   * @return {boolean}
   */
  private _isTextWidthGreaterThanInputWidth(): boolean {

    // getting the current overflow value of input tag
    const curOverflow = this._input.style.overflow;
    // checking the overflow is same as default value
    if (!curOverflow || curOverflow === "visible") {
      // Will temporarily modify the "overflow" style to detect this
      this._input.style.overflow = "hidden";
    }
    // returns true if the text is overflows
    const isOverflowing = this._input.clientWidth < this._input.scrollWidth;
    // setting the overflow style to default
    this._input.style.overflow = curOverflow;
    return isOverflowing;
  }

  /**
   * Flag the value length which exactly fits the input width
   * (example {|value|})
   * 
   * @private
   * @memberof Ch5TextInputScaling
   * @return {void}
   */
  private _flagTheLengthWhichExactlyFits(): void {

    const inputPlaceholderWidth = this._inputPlaceholder.getBoundingClientRect().width;
    const inputWidth = this._input.clientWidth;

    if (this._valueLengthOnHitTheEdge === undefined && inputPlaceholderWidth > inputWidth - 10) {
      this._valueLengthOnHitTheEdge = this._input.value.length;
    }
  }

  /**
   * Set input fontSize to initial value when the value length reaches
   * a point when it can do that without overflowing the input again
   * 
   * @private
   * @memberof Ch5TextInputScaling
   * @return {void}
   */
  private _resetFontSizeWhenExactlyFits(): void {

    if (this._valueLengthOnHitTheEdge !== undefined && this._input.value.length <= this._valueLengthOnHitTheEdge) {
      this.currentFontSize = this.maximumFontSize;
    }

    this._setFontSizeToInput(this.currentFontSize);
  }

  /**
   * Scale the font size
   * 
   * @param {string} action
   * @private 
   * @memberof Ch5TextInputScaling
   * @return {void}
   */
  private _scaleFontSize(action: string = 'increase'): void {
    const changeFactor = this.currentFontSize * Ch5TextInputScaling.CHANGEFACTOR;
    this.currentFontSize = (action === 'increase') ? this.currentFontSize + changeFactor : this.currentFontSize - changeFactor;
    this._setFontSizeToInput(this.currentFontSize);
  }

  /**
   * Check if the currentFontSize reaches the min/max value
   * 
   * @param {string} edge can get min/max values
   * @param {number} fontSize
   * @private
   * @memberof Ch5TextInputScaling
   * @return {boolean}
   */
  private _validateFontSizeValue(fontSize: number, edge: string = 'min' as string): boolean {

    if (edge === 'min' && fontSize < this.minimumFontSize) {
      return false;
    } else if (edge === 'max' && fontSize > this.maximumFontSize) {
      return false;
    }

    return true;
  }

  /**
   * Set the font size to the input element and placeholder
   * 
   * @param {number} fontSize
   * @private 
   * @memberof Ch5TextInputScaling
   * @return {string}
   */
  private _setFontSizeToInput(fontSize: number): string {
    return this._input.style.fontSize = this._inputPlaceholder.style.fontSize = fontSize + 'px';
  }
}
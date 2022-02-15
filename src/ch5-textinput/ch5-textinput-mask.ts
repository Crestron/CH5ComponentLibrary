// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

interface ICustomInputEvent {
  data: string
  inputType: string
}

export class Ch5tTextInputMask {

  /**
   * Used for id or classes attributes
   *
   * @type {string}
   */
  public prefix: string = '_ch5-textinput-mask' as string;

  /**
   * Modifier separator used to add classes for special cases (active|inactive)
   *
   * @type {string}
   */
  public modifierSeparator: string = '--' as string;

  /**
   * Prefix added before the block class
   *
   * @type {string}
   */
  public blockSeparator: string = '__' as string;

  /**
   * Determines if the mask element was added to the DOM
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {boolean}
   */
  private _didMounted: boolean = false as boolean;

  /**
   * Determines if the input was wrapped in a wrapper element
   * example(<div><input /></div>)
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {boolean}
   */
  private _wasWrapped: boolean = false as boolean;

  /**
   * Contains the id of the wrapper element
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {boolean}
   */
  private _wrapperId: number = 0 as number;

  /**
   * The input element on which the mask feature will be used
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {HTMLInputElement}
   */
  private _input: HTMLInputElement = {} as HTMLInputElement;

  /**
   * Contains the element which keep the mask pattern and show it
   * to the user
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {HTMLElement}
   */
  private _maskElement: HTMLElement = {} as HTMLElement;

  /**
   * Contains the mask pattern and it is used for input validation and for showing
   * to the user
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {string}
   */
  private _maskValue: string = '' as string;

  /**
   * Determines the last value length. Help to find the user behavior
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {number}
   */
  private _lastValueLength: number = 0 as number;

  /**
   * Contains the action made by the user in input
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {string}
   */
  private _inputType: string = '' as string;

  /**
   * Determines when the mask will be shown
   * Default value will show the mask only on input focus,
   * otherwise will be shown every time
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {boolean}
   */
  private _alwaysShow: boolean = false as boolean;

  /**
   * Determines the show behavior of mask element
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {boolean}
   */
  private _show: boolean = false as boolean;

  /**
   * Contains the input placeholder
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {string}
   */
  private _placeholder: string = '' as string;

  /**
   * Listener for input event
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {Function}
   */
  private _inputListener: EventListenerOrEventListenerObject;

  /**
   * Listener for input keyUp event
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {EventListenerOrEventListenerObject}
   */
  private _inputKeyUpListener: EventListenerOrEventListenerObject;

  /**
   * Listener for input keyDown event
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {EventListenerOrEventListenerObject}
   */
  private _inputKeyDownListener: EventListenerOrEventListenerObject;

  /**
   * Listener for input blur event
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {EventListenerOrEventListenerObject}
   */
  private _inputBlurListener: EventListenerOrEventListenerObject;

  /**
   * Listener for input focus event
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @type {EventListenerOrEventListenerObject}
   */
  private _inputFocusListener: EventListenerOrEventListenerObject;

  constructor(input: HTMLInputElement, pattern: string, alwaysShow: boolean = false as boolean) {

    this.wrapperId = Math.random() * new Date().getTime();
    this.input = input;
    this.maskValue = pattern;
    this.alwaysShow = alwaysShow;

    this._cleanTheInput();

    this._inputListener = this._onInput.bind(this) as unknown as EventListener;
    this._inputKeyUpListener = this._onInputKeyUp.bind(this) as unknown as EventListener;
    this._inputKeyDownListener = this._onInputKeyDown.bind(this) as unknown as EventListener;
    this._inputFocusListener = this._onInputFocus.bind(this) as unknown as EventListener;
    this._inputBlurListener = this._onInputBlur.bind(this) as unknown as EventListener;
  }

  /**
   * Initialize the mask
   */
  public init() {

    if (!this._wasWrapped && !this.didMounted) {
      this._wrap();
    }

    if (this.alwaysShow === false) {
      this.show = false;
    } else {
      this.show = true;
    }

    this._attachEventListeners();
  }

  public stop() {

    this._detachEventListeners();
  }

  /**
   * Dispatch maskError event
   *
   * @see {@link _createInputMaskErrorEvent}
   * @param {string} errorType (invalidCharacter | invalidLength)
   * @return {void}
   */
  public dispatchMaskErrorEvent(errorType: string = 'invalidCharacter'): void {

    if (errorType !== 'invalidCharacter') {
      errorType = 'invalidLength';
    }

    const maskErrorEvent = this._createInputMaskErrorEvent(errorType);
    this.input.dispatchEvent(maskErrorEvent);
    this.maskElement.dispatchEvent(maskErrorEvent);

    this.input.setCustomValidity(errorType);
  }

  /**
   * Dispatch mask update event
   *
   * @see {@link _createMaskUpdateEvent}
   * @return {void}
   */
  public dispatchMaskUpdateEvent(): void {

    const maskUpdateEvent = this._createMaskUpdateEvent(this.input.value);
    this.maskElement.dispatchEvent(maskUpdateEvent);
    this.input.dispatchEvent(maskUpdateEvent);
  }

  /**
   * Dispatch the complete event
   *
   * @see {@link _createInputMaskCompleteEvent}
   * @return {void}
   */
  public dispatchMaskCompleteEvent(): void {

    const maskCompleteEvent = this._createInputMaskCompleteEvent();
    this.maskElement.dispatchEvent(maskCompleteEvent);
    this.input.dispatchEvent(maskCompleteEvent);

    // remove custom validity from the input element
    this.input.setCustomValidity('');
  }

  /**
   * Setter for didMounted property
   *
   * @param {boolean} mounted
   */
  public set didMounted(mounted: boolean) {

    if (this.didMounted !== mounted &&
      (mounted === undefined || mounted === null)
    ) {
      mounted = false;
    }

    this._didMounted = mounted;
  }

  /**
   * Getter for didMounted property
   *
   * @return {boolean}
   */
  public get didMounted(): boolean {

    return this._didMounted;
  }

  /**
   * Setter for input element
   *
   * @param {HTMLInputElement} input
   */
  public set input(input: HTMLInputElement) {

    this._input = input;
  }

  /**
   * Getter for input element
   *
   * @return {HTMLInputElement}
   */
  public get input(): HTMLInputElement {

    return this._input;
  }

  /**
   * Setter for wasWrapped property
   *
   * @param {boolean} wrapped
   */
  public set wasWrapped(wrapped: boolean) {
    if (
      this.wasWrapped !== wrapped &&
      (wrapped === undefined || wrapped === null)
    ) {
      wrapped = false;
    }

    this._wasWrapped = wrapped;
  }

  /**
   * Getter for wasWrapped property
   *
   * @return {boolean}
   */
  public get wasWrapped(): boolean {

    return this._wasWrapped;
  }

  /**
   * Getter for wrapperId property
   *
   * @param {number} id
   */
  public set wrapperId(id: number) {

    if (this.wrapperId !== id && (id === undefined || id === null)) {
      id = Math.random() * 1000;
    }

    this._wrapperId = Math.round(id) as number;
  }

  /**
   * Setter for wrapperId
   *
   * @return {number}
   */
  public get wrapperId(): (number) {

    return this._wrapperId as (number);
  }

  /**
   * Setter for maskElement
   *
   * @param {HTMLElement} element
   */
  public set maskElement(element: HTMLElement) {

    this._maskElement = element;
  }

  /**
   * Getter for maskElement
   *
   * @return {HTMLElement}
   */
  public get maskElement(): HTMLElement {

    return this._maskElement;
  }

  /**
   * Setter for maskValue
   *
   * @param {string} value
   */
  public set maskValue(value: string) {

    if (
      this.maskValue !== value &&
      (value === undefined || value === null)
    ) {
      value = '';
    }

    this._maskValue = value;
  }

  /**
   * Getter for maskValue
   *
   * @return {string}
   */
  public get maskValue(): string {

    return this._maskValue;
  }

  /**
   * Getting the input styles
   *
   * @return {CSSStyleDeclaration}
   */
  public getInputStyles(): CSSStyleDeclaration {

    const inputStyles = window.getComputedStyle(this.input);
    return inputStyles;
  }

  /**
   * Getter for lastValueLength
   *
   * @param {number} length
   */
  public set lastValueLength(length: number) {

    if (
      this.lastValueLength !== length &&
      (length === undefined || length === null)) {
      length = 0;
    }

    this._lastValueLength = length;
  }

  /**
   * Getter for lastValueLength
   *
   * @return {number}
   */
  public get lastValueLength(): number {

    return this._lastValueLength;
  }

  /**
   * Setter for inputType property
   *
   * @param {string} code
   */
  public set inputType(action: string) {

    if (
      this.inputType !== action &&
      (action === undefined || action === null)
    ) {
      action = '';
    }

    this._inputType = action;
  }

  /**
   * Getter for inputType property
   *
   * @return {string}
   */
  public get inputType(): string {

    return this._inputType;
  }

  /**
   * Setter for alwaysShow property
   *
   * @param {boolean} show
   */
  public set alwaysShow(show: boolean) {
    if (
      this.alwaysShow !== show &&
      (show === undefined || show === null)
    ) {
      show = false;
    }

    this._alwaysShow = show;
  }

  /**
   * Getter for alwaysShow property
   *
   * @return {boolean}
   */
  public get alwaysShow(): boolean {

    return this._alwaysShow;
  }

  /**
   * Setter for show property
   *
   * @param {boolean} show
   */
  public set show(show: boolean) {

    if (
      this.show !== show &&
      (show === undefined || show === null)
    ) {
      show = false;
    }

    this._show = show;

    if (this.input.value.length === 0) {
      this.maskElement.style.zIndex = this.show === true ? '99' : '-1';
    }
  }

  /**
   * Getter for show property
   *
   * @return {boolean}
   */
  public get show(): boolean {

    return this._show;
  }

  /**
   * Setter for placeholder property
   *
   * @param {string} placeholder
   */
  public set placeholder(placeholder: string) {

    if (
      this.placeholder !== placeholder &&
      (placeholder === undefined || placeholder === null)) {
      placeholder = '';
    }

    this._placeholder = placeholder;
  }

  /**
   * Getter for placeholder property
   *
   * @return {void}
   */
  public get placeholder(): string {

    return this._placeholder;
  }

  /**
   * Adding styles to the input and maskElement for making maskElement feel & look
   * like an input
   *
   * @return {void}
   */
  public _makeMaskElementLookAsInputPlaceholder(): void {

    const inputStyles = this.getInputStyles();

    // styling the maskElement
    this.maskElement.style.position = 'absolute';
    this.maskElement.style.top = '0px';
    this.maskElement.style.left = '0px';
    this.maskElement.style.paddingLeft = inputStyles.paddingLeft;
    this.maskElement.style.paddingRight = inputStyles.paddingRight;
    this.maskElement.style.fontSize = inputStyles.fontSize;
    this.maskElement.style.fontWeight = inputStyles.fontWeight;
    this.maskElement.style.pointerEvents = 'none';
    this.maskElement.style.lineHeight = inputStyles.lineHeight;

    const minWidth: string = this.input.style.minWidth;
    if (parseInt(minWidth) < this.maskElement.getBoundingClientRect().width) {
      this.input.style.minWidth = this.maskElement.getBoundingClientRect().width + 'px';
    }
  }

  /**
   * Adding static characters from the mask to input value
   * example("-","_","#")
   *
   * @return {void}
   */
  public addStaticCharactersToInputValue(letterIndex: number): void {

    const nextLetter = this.maskValue.substr(letterIndex, 1) !== '' ?
      this.maskValue.substr(letterIndex, 1) : null;

    if (
      this._isUserTyping() &&
      nextLetter !== null &&
      nextLetter.match(/[-_#().,\\\/=@$&\s+]/g) !== null
    ) {

      this.dispatchMaskUpdateEvent();

      this.input.value = this.input.value + nextLetter;
      this.lastValueLength++;

      this.addStaticCharactersToInputValue(++letterIndex);
    }
  }

  /**
   * Update the characters in the mask element
   * That's because the mask element should look like an placeholder
   * and some letters doesn't have the same dimensions
   *
   * @return {void}
   */
  public _updateCharactersInMask() {

    const inputValueLength = this.lastValueLength - 1;
    const letter = this.maskElement.childNodes[inputValueLength] !== undefined ?
      this.maskElement.childNodes[inputValueLength] : null;

    let childNode = {};

    if ((letter !== undefined || letter !== null) && inputValueLength < this.maskValue.length) {
      let currentLetter;

      if (this._isUserTyping() === true && this.input.value.length > 0) {
        currentLetter = this.input.value.substr(inputValueLength, 1);
      } else {
        currentLetter = this.maskValue.substr(inputValueLength, 1);
      }

      childNode = this.maskElement.childNodes[inputValueLength];

      if (childNode !== undefined) {
        (childNode as HTMLElement).innerHTML = currentLetter;
      }
    }
  }

  /**
   * If alwaysShow=false toggle placeholder on blur/focus events
   *
   * @return {void}
   */
  public togglePlaceholder(): void {

    if (this.alwaysShow === false) {
      if (this.show === false) {
        this.input.setAttribute('placeholder', this.placeholder);
      } else {
        this.input.removeAttribute('placeholder');
      }
    }
  }

  /**
   * Attach event listeners on input and maskElement
   * For maskElement will be a custom event which is fired
   * when input has any of key type events
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {void}
   */
  public _attachEventListeners(): void {

    this.input.addEventListener('keydown', this._inputKeyDownListener);
    this.input.addEventListener('input', this._inputListener);
    this.input.addEventListener('keyup', this._inputKeyUpListener);
    this.input.addEventListener('focus', this._inputFocusListener);
    this.input.addEventListener('blur', this._inputBlurListener);
    this.maskElement.addEventListener('update', this._onMaskUpdate.bind(this));
  }

  /**
   * Detach the event listeners
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {void}
   */
  public _detachEventListeners(): void {
    this.input.removeEventListener('keydown', this._inputKeyDownListener);
    this.input.removeEventListener('input', this._inputListener);
    this.input.removeEventListener('keyup', this._inputKeyUpListener);
    this.input.removeEventListener('focus', this._inputFocusListener);
    this.input.removeEventListener('blur', this._inputBlurListener);
  }

  /**
   * Create the mask element
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @param {HTMLElement} wrapper
   * @return {void}
   */
  private _mount(wrapper: HTMLElement): void {

    // creating the mask element
    this._createTheMaskElement();
    wrapper.appendChild(this.maskElement);

    this.didMounted = true;
  }

  /**
   * Moving the input and mask element inside the wrapper
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {void}
   */
  private _wrap(): void {

    // append the wrapper element in component
    const wrapper = ((this._input as HTMLInputElement).parentNode as HTMLElement)
      .appendChild(this._createTheWrapper());

    wrapper.appendChild(this.input);
    this._mount(wrapper);
    this._makeMaskElementLookAsInputPlaceholder();

    this.wasWrapped = true;
  }

  /**
   * Create the wrapper element, the place where the mask element and input
   * will be moved
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {HTMLElement}
   */
  private _createTheWrapper(): HTMLElement {

    const wrapper = document.createElement('span');
    wrapper.id = '_ch5-textinput' + this.blockSeparator + this.wrapperId;
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';

    return wrapper;
  }

  /**
   * Create the mask element
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {void}
   */
  private _createTheMaskElement(): void {

    const htmlMaskValue = this._wrapEachCharacter();

    this.maskElement = document.createElement('span');
    this.maskElement.setAttribute('data-mask', this.maskValue);

    this.maskElement.innerHTML = htmlMaskValue;
  }

  /**
   * Clean the placeholder and pattern attributes
   * Using mask element the placeholder and pattern attributes are not needed
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {void}
   */
  private _cleanTheInput(): void {

    if (this.alwaysShow === true && this.input.hasAttribute('placeholder')) {
      this.input.removeAttribute('placeholder');
    }

    if (this.input.hasAttribute('pattern')) {
      this.input.removeAttribute('pattern');
    }
  }

  /**
   * Single wrapping of each character from the maskElement
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {string}
   */
  private _wrapEachCharacter(): string {

    const letters = this.maskValue.split('');

    letters.forEach((value, i) => {
      letters[i] = '<span class="' + this.prefix + this.blockSeparator + 'letter">' + value + '</span>';
    });

    return letters.join('');
  }

  /**
   * Create keydown event
   *
   * @param {string} message
   * @private
   * @memberof Ch5tTextInputMask
   * @return {CustomEvent}
   */
  private _createMaskUpdateEvent(message: string): CustomEvent {

    const keydownEvent = new CustomEvent('update', {
      detail: {
        message,
        time: new Date().getTime()
      },
      bubbles: true,
      cancelable: true

    });

    return keydownEvent;
  }

  /**
   * This event will be dispatched when the input value doesn't respect
   * the mask
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @param {string} errorType
   * @return {CustomEvent}
   */
  private _createInputMaskErrorEvent(errorType: string): CustomEvent {

    const errorCustomEvent = new CustomEvent('maskerror', {
      detail: {
        errorType,
        time: new Date().getTime()
      },
      bubbles: true,
      cancelable: false
    });

    return errorCustomEvent;
  }

  /**
   * Create complete event, this event is fired when the input value completely match the mask pattern
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @return {CustomEvent}
   */
  private _createInputMaskCompleteEvent(): CustomEvent {

    const completeEvent = new CustomEvent('maskcomplete', {
      detail: {
        message: 'completed',
        time: new Date().getTime()
      },
      bubbles: true,
      cancelable: true
    });

    return completeEvent;
  }

  /**
   * Mask the pattern character
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @param {number} letterIndex
   * @return {void}
   */
  private _maskCharacterOnTyping(letterIndex: number): void {

    if (letterIndex > this.maskValue.length) {
      letterIndex = this.maskValue.length;
    }

    const letters = this.maskElement.childNodes;
    const letter = letters[letterIndex] !== undefined ? letters[letterIndex] : null;

    if (letter !== null) {
      (letter as HTMLElement).style.visibility = 'hidden';

      this._maskCharacterOnTyping(--letterIndex);
    }
  }

  /**
   * Unmask the pattern character
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @param {number} letterIndex
   * @return {void}
   */
  private _unmaskCharacterOnTyping(letterIndex: number): void {

    if (letterIndex > this.maskValue.length) {
      letterIndex = this.maskValue.length;
    }

    const letters = this.maskElement.childNodes;
    const letter = letters[letterIndex] !== undefined ? letters[letterIndex] : null;

    if (letter !== null && letterIndex >= this.input.value.length) {
      (letter as HTMLElement).style.visibility = 'visible';
    }

    if (letterIndex >= 0) {
      this._unmaskCharacterOnTyping(--letterIndex);
    }
  }

  /**
   * Check if user is typing
   * Returning false means that user is erasing the input
   *
   * @return {boolean}
   */
  private _isUserTyping(): boolean {

    if (this.input.value.length < this.lastValueLength) {
      return false;
    }

    return true;
  }

  /**
   * - more characters than mask has should not be allowed
   * - following the character type
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @param {string} key
   * @return {void}
   */
  private _isKeyAllowed(key: string): boolean {

    if (this.maskValue.substr(this.input.value.length - 1, 1) !== '') {
      const letter = this.maskValue.substr(this.input.value.length - 1, 1);

      let _key: (string | number) = key as string;

      if (letter.match(/[^a-zA-Z0-9*]/g) !== null) {
        return false;
      }

      if (isNaN(parseFloat(key)) === false && letter !== '*') {
        _key = parseFloat(key);
      }

      if (
        String(_key).match(/[^a-zA-Z0-9]/g) !== null ||
        typeof _key !== this._getDataType(letter)
      ) {
        if (this.input.value.length > 0) {
          this.dispatchMaskErrorEvent();
        }
        return false;
      }
    }

    return true;
  }

  /**
   * @private
   * @memberof Ch5tTextInputMask
   * @return {boolean}
   */
  private _isValueLengthValid(): boolean {

    if (this.lastValueLength < this.maskValue.length) {
      if (this.lastValueLength > 0) {
        this.dispatchMaskErrorEvent('invalidLength');
      } else {
        this.input.setCustomValidity('');
      }
      return true;
    } else if (this.lastValueLength > 0) {
      this.dispatchMaskCompleteEvent();
    }

    return false;
  }

  /**
   * Getting the data type from a character
   *
   * @private
   * @memberof Ch5tTextInputMask
   * @param {string} character
   * @return {string}
   */
  private _getDataType(character: string): string {

    let dataType: string;

    switch (character) {
      case 'A':
      case 'a':
        dataType = 'string';
        break;
      case '9':
        dataType = 'number';
        break;
      default:
        dataType = 'string';
        break;
    }

    return dataType;
  }

  /**
   *
   * @param {string} character
   */
  private _getCapsType(character: string) {

    if (character !== null && character !== '*') {
      if (character === character.toUpperCase()) {
        return 'uppercase';
      } else if (character === character.toLowerCase()) {
        return 'lowercase';
      }
    }

    return 'normal';
  }

  /**
   * Change caps following the mask patter
   *
   * @param {number} letterIndex
   */
  private _transformLetterCapsType(letterIndex: number) {

    if (letterIndex > this.maskValue.length - 1) {
      letterIndex = this.maskValue.length - 1;
    }

    const letter = this.maskValue.substr(letterIndex, 1) !== '' ?
      this.maskValue.substr(letterIndex, 1) : null;
    const character = this.input.value.split('')[letterIndex];
    const letterElement = this.maskElement.childNodes[letterIndex];

    if (letter !== null && character !== undefined) {

      const letterCapsType = this._getCapsType(letter);
      const typedKeyCapsType = this._getCapsType(character);

      // contains the input value until the last value inserted
      const inputValue = this.input.value.substr(0, letterIndex);
      // contains only the last letter
      const currentLetter = this.input.value.substr(letterIndex, 1);
      const inputValueRight = this.input.value.substr(letterIndex + 1);

      if (letterCapsType === 'uppercase' && typedKeyCapsType !== 'uppercase') {
        this.input.value = inputValue + currentLetter.toUpperCase() + inputValueRight;
        (letterElement as HTMLElement).innerHTML = currentLetter.toUpperCase();
      } else if (letterCapsType === 'lowercase' && typedKeyCapsType !== 'lowercase') {
        this.input.value = inputValue + currentLetter.toLowerCase() + inputValueRight;
        (letterElement as HTMLElement).innerHTML = currentLetter.toLowerCase();
      }

      this._transformLetterCapsType(--letterIndex);
    }
  }

  /**
   *
   * @param {KeyboardEvent} inEvent
   */
  private _onInputKeyDown(inEvent: KeyboardEvent): void {

    this.inputType = inEvent.key;

    if (this._isUserTyping()) {
      this.addStaticCharactersToInputValue(this.input.value.length);
    }

    this.lastValueLength = this.input.value.length;

    if (this.input.selectionStart !== null && this.input.selectionStart < this.lastValueLength) {
      inEvent.preventDefault();
    }
  }

  /**
   *
   * @param inEvent
   */
  private _onInput(inputEvent: ICustomInputEvent) {

    this.inputType = inputEvent.inputType;

    let key = inputEvent.data;

    if (key !== null && key.length > 1) {
      const keys = key.split('');
      key = keys[keys.length - 1];
    }

    if (
      this._isUserTyping() &&
      (!this._isKeyAllowed(key) || !this._isValueLengthValid())
    ) {
      this.input.value = this.input.value.substr(0, this.lastValueLength);
    } else {
      this.dispatchMaskUpdateEvent();
      this._updateCharactersInMask();
    }

    if (this._isUserTyping()) {
      this.lastValueLength = this.input.value.length;
    }
  }

  /**
   *
   * @param {KeyboardEvent} inEvent
   */
  private _onInputKeyUp(inEvent: KeyboardEvent): void {

    this._isKeyAllowed(inEvent.key);
    this._isValueLengthValid();
    this._transformLetterCapsType(this.input.value.length);
  }

  /**
   *
   * @param {MouseEvent} inEvent
   */
  private _onInputFocus(inEvent: MouseEvent): void {

    if (this.alwaysShow === false) {
      this.show = true;
      this.togglePlaceholder();
    }
  }

  /**
   *
   * @param {MouseEvent} inEvent
   */
  private _onInputBlur(inEvent: MouseEvent): void {
    if (this.alwaysShow === false) {
      this.show = false;
      this.togglePlaceholder();
    }

    if (this.input.value.length === 0) {
      this.lastValueLength = 0;
    }

    this._transformLetterCapsType(this.input.value.length);
    this._isValueLengthValid();
  }

  /**
   * Fire custom keydown event
   *
   * @param {CustomEvent} inEvent
   */
  private _onMaskUpdate(inEvent: any): void {

    if (this._isUserTyping()) {
      this._maskCharacterOnTyping(this.lastValueLength);
    } else {
      this._unmaskCharacterOnTyping(this.lastValueLength);
    }
  }
}

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

export class Ch5TextInputMask {

  private _didMounted = false;
  private _wasWrapped = false;
  private _wrapperId = 0;
  private _maskValue = "";
  private _lastValueLength = 0;
  private _alwaysShow = false;
  private _show = false;
  private _placeholder = "";

  private _input: HTMLInputElement = {} as HTMLInputElement;
  private _maskElement: HTMLElement = {} as HTMLElement;

  public set didMounted(value: boolean) {
    this._didMounted = value;
  }
  public get didMounted(): boolean {
    return this._didMounted;
  }

  public set wasWrapped(value: boolean) {
    this._wasWrapped = value;
  }
  public get wasWrapped(): boolean {
    return this._wasWrapped;
  }

  public set wrapperId(value: number) {
    this._wrapperId = value;
  }
  public get wrapperId(): number {
    return this._wrapperId;
  }

  public set input(value: HTMLInputElement) {
    this._input = value;
  }
  public get input(): HTMLInputElement {
    return this._input;
  }

  public set maskElement(value: HTMLElement) {
    this._maskElement = value;
  }
  public get maskElement(): HTMLElement {
    return this._maskElement
  }

  public set maskValue(value: string) {
    this._maskValue = value;
  }
  public get maskValue(): string {
    return this._maskValue;
  }

  public set lastValueLength(value: number) {
    this._lastValueLength = value;
  }
  public get lastValueLength(): number {
    return this._lastValueLength;
  }

  public set alwaysShow(value: boolean) {
    this._alwaysShow = value;
  }
  public get alwaysShow(): boolean {
    return this._alwaysShow;
  }

  public set show(value: boolean) {
    this._show = value;
    if (this.input.value.length === 0) {
      this.maskElement.style.zIndex = this.show === true ? '99' : '-1';
    }
  }
  public get show(): boolean {
    return this._show;
  }

  public set placeholder(value: string) {
    this._placeholder = value;
  }
  public get placeholder(): string {
    return this._placeholder;
  }


  public prefix: string = 'ch5-textinput-mask' as string;
  public readonly BLOCK_SEPARATOR: string = '--';

  private _inputListener: EventListenerOrEventListenerObject;
  private _inputKeyUpListener: EventListenerOrEventListenerObject;
  private _inputKeyDownListener: EventListenerOrEventListenerObject;
  private _inputBlurListener: EventListenerOrEventListenerObject;
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

  public init() {

    if (!this.wasWrapped && !this.didMounted) {
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

  public dispatchMaskErrorEvent(errorType: string = 'invalidCharacter'): void {

    if (errorType !== 'invalidCharacter') {
      errorType = 'invalidLength';
    }

    const maskErrorEvent = this._createInputMaskErrorEvent(errorType);
    this.input.dispatchEvent(maskErrorEvent);
    this.maskElement.dispatchEvent(maskErrorEvent);

    this.input.setCustomValidity(errorType);
  }

  public dispatchMaskUpdateEvent(): void {

    const maskUpdateEvent = this._createMaskUpdateEvent(this.input.value);
    this.maskElement.dispatchEvent(maskUpdateEvent);
    this.input.dispatchEvent(maskUpdateEvent);
  }

  public dispatchMaskCompleteEvent(): void {

    const maskCompleteEvent = this._createInputMaskCompleteEvent();
    this.maskElement.dispatchEvent(maskCompleteEvent);
    this.input.dispatchEvent(maskCompleteEvent);

    // remove custom validity from the input element
    this.input.setCustomValidity('');
  }

  public _makeMaskElementLookAsInputPlaceholder(): void {
    this.maskElement.style.lineHeight = window.getComputedStyle(this.input).lineHeight;
  }

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

  public togglePlaceholder(): void {

    if (this.alwaysShow === false) {
      if (this.show === false) {
        this.input.setAttribute('placeholder', this.placeholder);
      } else {
        this.input.removeAttribute('placeholder');
      }
    }
  }

  public _attachEventListeners(): void {
    this.input.addEventListener('keydown', this._inputKeyDownListener);
    this.input.addEventListener('input', this._inputListener);
    this.input.addEventListener('keyup', this._inputKeyUpListener);
    this.input.addEventListener('focus', this._inputFocusListener);
    this.input.addEventListener('blur', this._inputBlurListener);
    this.maskElement.addEventListener('update', this._onMaskUpdate.bind(this));
  }

  public _detachEventListeners(): void {
    this.input.removeEventListener('keydown', this._inputKeyDownListener);
    this.input.removeEventListener('input', this._inputListener);
    this.input.removeEventListener('keyup', this._inputKeyUpListener);
    this.input.removeEventListener('focus', this._inputFocusListener);
    this.input.removeEventListener('blur', this._inputBlurListener);
  }

  private _mount(wrapper: HTMLElement): void {

    // creating the mask element
    this._createTheMaskElement();
    wrapper.appendChild(this.maskElement);

    this.didMounted = true;
  }

  private _wrap(): void {

    // append the wrapper element in component
    const wrapper = ((this._input as HTMLInputElement).parentNode as HTMLElement)
      .appendChild(this._createTheWrapper());

    wrapper.appendChild(this.input);
    this._mount(wrapper);
    this._makeMaskElementLookAsInputPlaceholder();

    this.wasWrapped = true;
  }

  private _createTheWrapper(): HTMLElement {

    const wrapper = document.createElement('span');
    wrapper.id = 'ch5-textinput' + this.BLOCK_SEPARATOR + this.wrapperId;
    return wrapper;
  }

  private _createTheMaskElement(): void {

    const htmlMaskValue = this._wrapEachCharacter();

    this.maskElement = document.createElement('span');
    this.maskElement.setAttribute('data-mask', this.maskValue);
    this.maskElement.classList.add(this.prefix);

    this.maskElement.innerHTML = htmlMaskValue;
  }

  private _cleanTheInput(): void {

    if (this.alwaysShow === true && this.input.hasAttribute('placeholder')) {
      this.input.removeAttribute('placeholder');
    }

    if (this.input.hasAttribute('pattern')) {
      this.input.removeAttribute('pattern');
    }
  }

  private _wrapEachCharacter(): string {

    const letters = this.maskValue.split('');

    letters.forEach((value, i) => {
      letters[i] = '<span class="' + this.prefix + this.BLOCK_SEPARATOR + 'letter">' + value + '</span>';
    });

    return letters.join('');
  }

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

  private _isUserTyping(): boolean {

    if (this.input.value.length < this.lastValueLength) {
      return false;
    }

    return true;
  }

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

  private _onInputKeyDown(inEvent: KeyboardEvent): void {
    if (this._isUserTyping()) {
      this.addStaticCharactersToInputValue(this.input.value.length);
    }

    this.lastValueLength = this.input.value.length;

    if (this.input.selectionStart !== null && this.input.selectionStart < this.lastValueLength) {
      inEvent.preventDefault();
    }
  }

  private _onInput(inputEvent: ICustomInputEvent) {
    let key = inputEvent.data;

    if (key !== null && key.length > 1) {
      const keys = key.split('');
      key = keys[keys.length - 1];
    }

    if (this._isUserTyping() && (!this._isKeyAllowed(key) || !this._isValueLengthValid())) {
      this.input.value = this.input.value.substr(0, this.lastValueLength);
    } else {
      this.dispatchMaskUpdateEvent();
      this._updateCharactersInMask();
    }

    if (this._isUserTyping()) {
      this.lastValueLength = this.input.value.length;
    }
  }

  private _onInputKeyUp(inEvent: KeyboardEvent): void {
    this._isKeyAllowed(inEvent.key);
    this._isValueLengthValid();
    this._transformLetterCapsType(this.input.value.length);
  }

  private _onInputFocus(): void {
    if (this.alwaysShow === false) {
      this.show = true;
      this.togglePlaceholder();
    }
  }

  private _onInputBlur(): void {

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

  private _onMaskUpdate(): void {
    this._isUserTyping() ? this._maskCharacterOnTyping(this.lastValueLength) : this._unmaskCharacterOnTyping(this.lastValueLength);
  }
}
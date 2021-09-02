// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common";
import _ from 'lodash';

export interface ICallback {
  arguments: Array<string | {}>;
  reference: string;
}

export default class HtmlCallback {
  
  protected _pattern = new RegExp('([\\w\\.]*)\\((.*)\\)','i');
  protected _callbacks: ICallback[] = [];
  protected _context: HTMLElement = {} as HTMLElement;
  
  constructor(context: HTMLElement, callbacks: string) {
    this.context = context;
    this.prepareCallbacks(callbacks);
  }
  
  public run(target: Event | HTMLElement | undefined): void {
    this._callbacks.forEach((callback: ICallback) => {

      const methodReference = this.getNestedMethod(callback.reference);

      if (!_.isNil(methodReference)) {
        if (this.isNativeMethod(methodReference)) {
          methodReference.apply(null, callback.arguments);
        } else {
          let args = callback.arguments;
          if (_.isNil(target)) {
            args = callback.arguments;
          } else {
            args[0] = target;
          }
          methodReference.apply(this.context, args);
        }
      }
    });
  }

  public set callbacks(callbacks: ICallback[]) {
    this._callbacks = callbacks;
  }

  public get callbacks(): ICallback[] {
    return this._callbacks;
  }

  public set context(element: HTMLElement) {
    this._context = element;
  }

  public get context(): HTMLElement {
    return this._context;
  }

  protected prepareCallbacks(callbacks: string) {
    if (_.isNil(callbacks)) {
      return;
    }

    const _window = window as {[key: string]: any};
    const callbacksList = callbacks.split(';');

    this._callbacks = callbacksList.filter(callback => {
      if (this._pattern.test(callback)) {
        const callbackMethodSplitted = callback.match(this._pattern);
        const callbackMethodName = !_.isNil(callbackMethodSplitted) ? callbackMethodSplitted[1] : '';

        if (!_.isUndefined(this.getNestedMethod(callbackMethodName))) {
          return true;
        } else {
          console.warn('Undefined method ' + callback);
        }
      }

      

      return false;
    }).map(
      callback => {

        const callbackMethodSplitted = callback.match(this._pattern);
        const callbackMethodName = !_.isNil(callbackMethodSplitted) ? callbackMethodSplitted[1] : '';
        const callbackMethodArguments = !_.isNil(callbackMethodSplitted) && !_.isNil(callbackMethodSplitted[2]) ? callbackMethodSplitted[2] : '';
        let methodArguments = callbackMethodArguments.split(',');
        
        methodArguments = methodArguments.map(stringArgument => {

          const _stringArgument = stringArgument.replace(/['"]/g, '');

          if (stringArgument.indexOf('\'') > -1) {
            return _stringArgument;
          } else if (!_.isNaN(parseFloat(stringArgument))) {
            return parseFloat(_stringArgument);
          }

          if (_stringArgument === "true" || _stringArgument === "false") {
            return _stringArgument === "true";
          }

          return _window[_stringArgument];
        }); 

        return {
          reference: callbackMethodName,
          arguments: methodArguments
        } as ICallback;
    });
  }

  /**
   * Get method reference from multi level objects
   * 
   * @param nestedObject 
   */
  protected getNestedMethod(_nestedObject: string, ref?: {[key: string]: any}): (() => void) | undefined {

    const _window = window as {[key: string]: any};

    if (_.isNil(_nestedObject)) {
      return;
    }
      
    const nestedObject = _nestedObject.split('.');
    let methodReference = null;

    if (!_.isUndefined(ref)) {
      methodReference = ref[nestedObject[0]];
    } else {
      methodReference = _window[nestedObject[0]];
    }
    
    if (_.isObject(methodReference) && !_.isFunction(methodReference)) {
      methodReference = this.getNestedMethod(nestedObject[1], methodReference as {[key: string]: string});
    }

    return methodReference;
    
  }

  /**
   * Check if method is native or not
   * 
   * @param {() => void} methodReference 
   * @return {boolean}
   */
  protected isNativeMethod(methodReference: (() => void)): boolean {

    const methodString: string = methodReference.toString();

    if (methodString.indexOf('[native code]') === -1) {
      return false;
    }

    return true;
  }
}

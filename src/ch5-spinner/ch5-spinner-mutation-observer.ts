// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Spinner } from "./ch5-spinner";

export class Ch5SpinnerMutationObserver {

  public static _observer: MutationObserver = {} as MutationObserver;

  constructor(element: Ch5Spinner) {

    if (Ch5SpinnerMutationObserver._observer.constructor !== MutationObserver) {
      Ch5SpinnerMutationObserver._observer = new MutationObserver(this.mutationsCallback);
    }

    this.registerElement(element);
  }


  /**
   * Register the element to observer
   * 
   * @private 
   * @memberof Ch5SpinnerMutationObserver
   * @param {HTMLElement} element
   * @return {void}
   */
  private registerElement(element: HTMLElement) {
    Ch5SpinnerMutationObserver._observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }


  /**
   * @private 
   * @memberof Ch5SpinnerMutationObserver
   * @param {MutationRecord[]} mutations
   * @return {void}
   */
  private mutationsCallback(mutations: MutationRecord[]): void {
    // console.log('Mutations TBD');
  }

}

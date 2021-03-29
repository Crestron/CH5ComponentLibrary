// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Signal } from "../ch5-core";

/**
 * For ch5 video that contains a receiveState appending INDEX with indexId attribute,
 * we need to update this is like this:
 *    - if the indexId is part of element text content => just replace the indexId with the item base 1 index
 *    - if the indexId is part of a signal name we have 2 cases according with Join Number Signals specs. Ex:
 *
 *        `<i class="fas" data-ch5-appendclass="N{{Idx}}"></i>`
 *
 *         - N is NOT numeric => data-ch5-appendclass = N + base 1 item idx
 *          (ex: N = item, data-ch5-appendclass = item1 | item2 |item3...)
 *
 *         - N is numberic => data-ch5-appendclass = N + base 0 item idx
 *          (ex: N = 201, data-ch5-appendclass = 201 | 202 | 203)
 *
 */

export class Ch5VideoSubscription {

  public static subscriptionValue: string | number | undefined;

  public static getNewSignalName(n: Element, 
                                attrName: string, 
                                attrVal: string,
                                index: number, 
                                indexId: string): string | number | undefined {
    const placeholder: string = `{{${indexId}}}`;
    if (attrVal.indexOf(placeholder) > -1) {
      // replace indexId
      const valWithoutIndexIdPlaceholder: string = attrVal.replace(new RegExp(placeholder, 'g'), '').trim();
      if (Ch5Signal.isIntegerSignalName(valWithoutIndexIdPlaceholder)) {
        // augment signal name according with join numbers signal specs
        // add base 0 index to remaining int value
        const newIntAttrValue: number = parseInt(valWithoutIndexIdPlaceholder, 10) + index;
        // n.setAttribute(attrName, String(newIntAttrValue));
        this.subscriptionValue = newIntAttrValue;
      } else {
        // normal case, no join number signal found
        // replace Idx with base 1 index
        const newAttrValue: string = attrVal.replace(new RegExp(placeholder, 'g'), String(index)).trim();
        // n.setAttribute(attrName, String(newAttrValue));
        this.subscriptionValue = newAttrValue;
      }
    }
    return this.subscriptionValue;
  }

  public static replaceIndexIdInTmplElemsAttrs(documentContainer: HTMLElement, index: number, indexId: string) {
    // get all attributes containing indexId placeholder
    // @ts-ignore
    Ch5VideoSubscription.replaceAttrIdxPlaceholder(documentContainer, this.name, this.value, index, indexId);
  }

  public static replaceIndexIdInTmplElemsContent(documentContainer: HTMLElement, index: number, indexId: string) {
    let html: string = documentContainer.innerHTML;
    const placeholder: string = `${indexId}`;
    if (html.indexOf(placeholder) > -1) {
      // replace all placeholder values with item base 1 index
      html = html.replace(new RegExp(placeholder, 'g'), String(index));
      documentContainer.innerHTML = html;
    }
  }

}

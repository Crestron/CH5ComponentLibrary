// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Signal } from "../ch5-core";
import { Ch5SignalAttributeRegistry, CH5SignalElementDefaultAttributeEntries, CH5SignalElementDefaultAttributeEntry } from "../ch5-common/ch5-signal-attribute-registry"

type IterateAttributesInTemplateFn = (element: Element, attributeName: string, attributeVal: string) => void;
type IterateElementsInTemplateFn = (element: Element) => void;

/**
 * For ch5 components with multiple items created using a template that contains an indexId,
 * we need to update this is like this:
 *    - if the indexId is part of element text content => just replace the indexId with the item base 0 index
 *    - if the indexId is part of a signal name we have 2 cases according with Join Number Signals specs. Ex:
 *
 *        `<i class="fas" data-ch5-appendclass="N{{Idx}}"></i>`
 *
 *         - N is NOT numeric => data-ch5-appendclass = N + base 0 item idx
 *          (ex: N = item, data-ch5-appendclass = item[0] | item[1] | item[2] ...)
 *
 *         - N is numeric => data-ch5-appendclass = N + base 0 item idx
 *          (ex: N = 201, data-ch5-appendclass = 201 | 202 | 203)
 *
 */

export class Ch5AugmentVarSignalsNames {

  /**
   * This utility function is responsible to update an attribute value with a {{idx}} value in it.
   * If the attribute is only an integer number, then index value is added to that result 
   * becomes the value of the attribute
   * @param value 
   * @param placeholder - the "{{idx}}" literal string
   * @param index - the numeric value to replace the placeholder
   * @returns the value of the attribute after the substitution
   */
  private static getUpdatedAttrIdxPlaceholderValue(value: string, placeholder: string, index: number): string {
    const placeHolderRegEx = new RegExp(placeholder, 'g');
    if (!placeHolderRegEx.test(value)) {
      // console.log("no work to do");
      return value;
    }
    const valWithoutIndexIdPlaceholder = value.replace(placeHolderRegEx, '').trim();
    // console.log("withoutPH:" + valWithoutIndexIdPlaceholder);

    // test ##+##*{{idx}}
    // pattern is whitespace(optional) \s*, digits \d+, whitespace (optional) \s*, one '+' \+{1}, 
    // whitespace (optional) \s*, digits \d+, whitspace (optional) \s*, one '*' \*{1}, whitespace (optional) \s*
    const joinMultiplierAndOffsetRegEx = /\s*(\d+)\s*\+{1}\s*(\d+)\s*\*{1}\s*/;
    const jmaoExec = joinMultiplierAndOffsetRegEx.exec(valWithoutIndexIdPlaceholder);
    if (jmaoExec !== null && jmaoExec[0] === valWithoutIndexIdPlaceholder) {
      const offset = parseInt(jmaoExec[1], 10);
      const multiplier = parseInt(jmaoExec[2], 10);
      return (multiplier * index + offset).toString();
    }

    // test ##+{{idx}}, ##{{idx}}, and {{idx}}##
    // pattern is whitespace(optional) \s*, digits \d+, whitespace (optional) \s*, zero or one '+' \+{0,1}, 
    // whitespace (optional) \s*, 
    const joinOffsetRegEx = /\s*(\d+)\s*\+{0,1}\s*/;
    const joExec = joinOffsetRegEx.exec(valWithoutIndexIdPlaceholder);
    if (joExec !== null && joExec[0] === valWithoutIndexIdPlaceholder) {
      const offset = parseInt(joExec[1], 10);
      return (index + offset).toString();
    }

    // normal case, no join number signal found
    // replace Idx with base 0 index
    return value.replace(placeHolderRegEx, String(index)).trim();
  }

  private static replaceAttrIdxPlaceholder(n: Element, attrName: string, attrVal: string,
    index: number, indexId: string) {

    const placeholder: string = `{{${indexId}}}`;
    if (attrVal.indexOf(placeholder) > -1) {
      if (attrName === 'context') {
        // This is the use case where parameter passed to ch5-template via context attribute. 
        // format of the "context" attribute is "NAME:VALUE[;NAME:VALUE][;NAME:VALUE]"
        // first split on semi-colon
        // then split on colon
        // then update only the value
        const nameValuePairs = attrVal.split(';');
        for (let cnt = 0; cnt < nameValuePairs.length; cnt++) {
          const nameValuePair = nameValuePairs[cnt];
          const colonIdx = nameValuePair.indexOf(":");
          if (colonIdx > 0 && nameValuePair.length > colonIdx + 1) { // found and key greater than one character
            const value = nameValuePair.substr(colonIdx + 1);
            if (value.indexOf(placeholder) > -1) {
              nameValuePairs[cnt] = nameValuePair.substring(0, colonIdx + 1)
                + Ch5AugmentVarSignalsNames.getUpdatedAttrIdxPlaceholderValue(value, placeholder, index);
            }
          }
        }
        n.setAttribute(attrName, String(nameValuePairs.join(";")));
      } else {
        // replace the whole attribute.
        n.setAttribute(attrName, Ch5AugmentVarSignalsNames.getUpdatedAttrIdxPlaceholderValue(attrVal, placeholder, index));
      }
    }
  }

  private static iterateAttributesInTemplate(templateContainer: DocumentFragment | HTMLElement,
    attribCb: IterateAttributesInTemplateFn,
    elementCb?: IterateElementsInTemplateFn): void {
    // get all attributes containing indexId placeholder
    const variableSignalsElems = templateContainer.querySelectorAll('*');
    if (variableSignalsElems.length === 0) {
      return;
    }

    // Note for-of not allowed for NodeListOf<Element>
    // tslint:disable-next-line: prefer-for-of
    for (let cnt = 0; cnt < variableSignalsElems.length; cnt++) {
      const element = variableSignalsElems[cnt];
      if (elementCb !== undefined) {
        elementCb(element);
      }
      Array.from(element.attributes).forEach((attribute: Attr) => {
        const attribValue = attribute.value.trim();
        // if (attribValue.length > 0) {
        attribCb(element, attribute.name, attribValue);
        // }
      });
    }
  }


  private static incrementOrPrependAttrValue(element: Element, attrName: string, value: string, increment: number, contractNamePrefix: string): void {
    const doubleMoustcheRe = /({{[\w\-]+}})/g;

    const valWithoutDoubleMoustaches = value.replace(doubleMoustcheRe, '');
    if (Ch5Signal.isIntegerSignalName(valWithoutDoubleMoustaches)) {
      // only change value if it will change attribute value
      if (increment > 0) {
        // when it's a number, increment it's value and put back
        const incrementedValue: number = parseInt(valWithoutDoubleMoustaches, 10) + increment;

        // if applicable, put back the double moustaches
        const doubleMoustachesMatches: RegExpMatchArray | null = value.match(doubleMoustcheRe);
        const incrementedAttrValue = doubleMoustachesMatches !== null ?
          `${incrementedValue}${doubleMoustachesMatches.join('')}` :
          `${incrementedValue}`;

        element.setAttribute(attrName, incrementedAttrValue);
      }
    }
    else {
      element.setAttribute(attrName, `${contractNamePrefix}${value}`);
    }
  }

  /**
   * Utility function that increments join numbers in certain attributes by an offset.   
   * This would be used in the "subpageReference" use case where different instances of the "subpage"
   * would have different join numbers.   In the CH5 vernacular, "subpage" is closest to a <template>/widget 
   * definition and "subpageReference" is closest to <ch5-template>/widget instance
   * @param templateContent - the template content to have incremented join numbers or prepended with contract name 
   * @param contractNamePrefix - the contract name to be prefixed to contract names already in template
   * @param booleanJoinOffset - the increment for digital/boolean joins 
   * @param numericJoinOffset - the increment for analog/numeric joins
   * @param stringJoinOffset - the increment for serial/string joins
   */
  public static differentiateTmplElemsAttrs(templateContent: HTMLElement, contractNamePrefix: string,
    booleanJoinOffset: number, numericJoinOffset: number, stringJoinOffset: number) {
    Ch5AugmentVarSignalsNames.iterateAttributesInTemplate(templateContent, (element: Element, attrName: string, attrValue: string) => {
      // callback called for each attribute in each element in the template definition 
      const signalJoinTypes = Ch5SignalAttributeRegistry.instance.getElementAttributeEntry(element.tagName, attrName);
      if (signalJoinTypes !== undefined) {
        const effectiveContractNamePrefix = signalJoinTypes[Ch5SignalAttributeRegistry.CONTRACT_NAME] ? contractNamePrefix : "";
        let increment = 0;
        if (signalJoinTypes[Ch5SignalAttributeRegistry.BOOLEAN_JOIN] !== undefined) {
          increment = booleanJoinOffset;
        }
        else if (signalJoinTypes[Ch5SignalAttributeRegistry.NUMERIC_JOIN] !== undefined) {
          increment = numericJoinOffset;
        }
        else if (signalJoinTypes[Ch5SignalAttributeRegistry.STRING_JOIN] !== undefined) {
          increment = stringJoinOffset;
        }
        Ch5AugmentVarSignalsNames.incrementOrPrependAttrValue(element, attrName, attrValue, increment, effectiveContractNamePrefix);
      }
    }, (element: Element) => {
      // callback called for each element in the template definition
      const defaultAttributes = Ch5SignalAttributeRegistry.instance.getElementDefaultAttributeEntries(element.tagName);
      if (defaultAttributes !== undefined) {
        // add attribute if one does not exist for those contract name attributes that need to be defaulted
        if (contractNamePrefix.length > 0) {
          Ch5AugmentVarSignalsNames.addDefaultEntriesForDifferentiation(element, defaultAttributes.contractName);
        }

        // add attribute if one does not exist for those digital join attributes that need to be defaulted 
        if (booleanJoinOffset > 0) {
          Ch5AugmentVarSignalsNames.addDefaultEntriesForDifferentiation(element, defaultAttributes.booleanJoin);
        }

        // add attribute if one does not exist for those analog join attributes that need to be defaulted 
        if (numericJoinOffset > 0) {
          Ch5AugmentVarSignalsNames.addDefaultEntriesForDifferentiation(element, defaultAttributes.numericJoin);
        }

        // add attribute if one does not exist for those string join attributes that need to be defaulted 
        if (stringJoinOffset > 0) {
          Ch5AugmentVarSignalsNames.addDefaultEntriesForDifferentiation(element, defaultAttributes.stringJoin);
        }
      }
    });
  }

  private static addDefaultEntriesForDifferentiation(element: Element, defaultEntry: CH5SignalElementDefaultAttributeEntry | undefined) {
    if (defaultEntry !== undefined) {
      defaultEntry.attributes.forEach(attributeNameToBeDefaulted => {
        if (element.getAttribute(attributeNameToBeDefaulted) === null) {
          element.setAttribute(attributeNameToBeDefaulted, defaultEntry.defaultValue);
        }
      });
    }
  }

  /**
   * Utility function that replaces {{${indexId}}} with ${index} in attributes found in the provided documentContainer.
   * In cases where the attribute has syntax of ###{{idx}}, where a number preceeds double moustache, the value of the index
   * is added to the number.  As example sendeventonclick="101{{idx}}" where the current index value is 3, will update the 
   * attribute to sendeventonclick="104"
   * @param documentContainer 
   * @param index 
   * @param indexId 
   * @returns 
   */
  public static replaceIndexIdInTmplElemsAttrs(documentContainer: HTMLTemplateElement, index: number, indexId: string) {
    Ch5AugmentVarSignalsNames.iterateAttributesInTemplate(documentContainer.content,
      (element: Element, attrName: string, attrValue: string) => {
        Ch5AugmentVarSignalsNames.replaceAttrIdxPlaceholder(element, attrName, attrValue, index, indexId);
      },
      (element: Element) => {
        if (element.tagName === 'TEMPLATE') {
          Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(element as HTMLTemplateElement, index, indexId);
        }
      }
    );
  }

  /**
   * Utility function that replaces {{${indexId}}} with ${index} in the documentContainer.innerHTML.
   * Used for template processing within ch5-list, ch5-select, and other components that allow ch5 developers
   * to place {{idx}} in their template for replacement at runtime.
   * @param documentContainer 
   * @param index 
   * @param indexId 
   */
  public static replaceIndexIdInTmplElemsContent(documentContainer: HTMLElement, index: number, indexId: string) {
    let html: string = documentContainer.innerHTML;
    const placeholder: string = `{{${indexId}}}`;
    if (html.indexOf(placeholder) > -1) {
      // replace all placeholder values with item base 1 index
      html = html.replace(new RegExp(placeholder, 'g'), String(index));
      documentContainer.innerHTML = html;
    }
  }

}

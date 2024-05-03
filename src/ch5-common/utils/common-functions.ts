// Copyright (C) 2023 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from 'lodash';

/**
 * Simple no-op function that we use to wrap up any promises.
 */
export const noop = () => undefined;

export const isNil = (value: any, validateWithTrim: boolean = true) => {
  if (validateWithTrim === true) {
    return _.isNil(value) || (value === "") || value.toString().trim() === "";
  } else {
    return _.isNil(value) || (value === "");
  }
}

export const isNotNil = (value: any, validateWithTrim: boolean = true) => {
  return !isNil(value, validateWithTrim);
}

/**
 * Getting the measurement unit from size (eg. 35px, returned value gonna be px)
 *
 * @return {string}
 */
export const getMeasurementUnitFromSizeValue = (sizeValue: string): string => {
  const pattern = new RegExp("^(?:[0-9]+)(\\w*|%)$");
  let measurementUnit: string = 'px';
  if (isNotNil(sizeValue)) {
    const matchedValues = sizeValue.match(pattern);
    if (matchedValues !== null) {
      if (isNotNil(matchedValues[1])) {
        measurementUnit = matchedValues[1];
      }
    }
  }
  return measurementUnit;
}

/**
 * Getting the measurement number value in px from size. If unit is not pixel, convert the value to px first
 *
 * @return {number}
 */
export const getMeasurementPxNumber = (sizeValue: string): number => {
  const actualUnit: string = getMeasurementUnitFromSizeValue(sizeValue);
  return actualUnit !== 'px'
    ? convertAltUnitsToPx(sizeValue)
    : Math.round(extractMeasurementNumber(sizeValue));
}

/**
 * Convert alternative units such as vh,vw in px
 *
 * @param {string} sizeValue
 */
export const convertAltUnitsToPx = (sizeValue: string): number => {
  const measurementUnit = getMeasurementUnitFromSizeValue(sizeValue);
  const size = parseFloat(sizeValue);
  let _size = size;

  switch (measurementUnit) {
    case 'vh':
      _size = convertVhUnitsToPx(size);
      break;
    case 'vw':
      _size = convertVwUnitsToPx(size);
      break;
  }

  return Math.round(_size);
}

export const convertPxUnitToAlt = (px: number, measurementUnit: string): number => {
  let altValue = px;
  switch (measurementUnit) {
    case 'vw':
      altValue = convertPxUnitToVw(px);
      break;
    case 'vh':
      altValue = convertPxUnitToVh(px);
      break;
  }
  return Math.ceil(altValue);
}

export const convertVhUnitsToPx = (vh: number): number => {
  const height = window.innerHeight || document.documentElement.clientHeight;
  return (vh * height) / 100;
}

export const convertVwUnitsToPx = (vw: number): number => {
  const width = window.innerWidth || document.documentElement.clientWidth;
  return (vw * width) / 100;
}

export const convertPxUnitToVh = (px: number): number => {
  const height = window.innerHeight || document.documentElement.clientHeight;
  return (px / height) * 100;
}

export const convertPxUnitToVw = (px: number): number => {
  const width = window.innerWidth || document.documentElement.clientWidth;
  return (px / width) * 100;
}

/**
 * Getting the measurement number value from size (eg. 35px, returned value gonna be 35)
 *
 * @return {number}
 */
export const extractMeasurementNumber = (sizeValue: string): number => {
  const pattern = new RegExp("^-?\\d+\\.?\\d*");
  let n: number = 0;
  if (sizeValue !== null && sizeValue !== undefined) {
    const matchedValues = sizeValue.match(pattern);

    if (matchedValues !== null && matchedValues[0] !== undefined) {
      n = Number(matchedValues[0]);
    }
  }
  return n;
}

/**
 * This method will ensure that the value which should be affected
 * by a textTransform property is properly done.
 *
 * @param {string} textTransform
 * @param {string} value
 * @return {string}
 */
export const handlingTextTransformValue = (value: string, textTransform: string): string => {
  let processedValue = value;
  if (value === undefined || value === null) {
    return '';
  }

  switch (textTransform) {
    case 'capitalize':
      processedValue = processedValue.replace(
        /\b\w/g,
        (firstLetterOfWord) => firstLetterOfWord.toUpperCase());
      break;
    case 'uppercase':
      processedValue = processedValue.toUpperCase();
      break;
    case 'lowercase':
      processedValue = processedValue.toLowerCase();
      break;
    default:
      break;
  }

  return processedValue;
}

// Returns a function, that, as long as it continues to be invoked, will not be triggered. 
// The function will be called after it stops being called for `wait` milliseconds.
export const debounce = (func: any, wait: number) => {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      window.clearTimeout(timeout);
      func(...args);
    };
    // if (timeout) {
    window.clearTimeout(timeout);
    // }
    timeout = window.setTimeout(later, wait);
  };
};

/**
 * Converts value to boolean
 * Applicable for 'true', 'false', and null
 * @private
 * @param {string|boolean} str
 * @returns {boolean}
 */
export const toBoolean = (val: any, isEmptyValueEqualToTrue = false): boolean => {
  const str = String(val).toLowerCase().trim();
  switch (str) {
    case "true": case "yes": case "1":
      return true;
    case "false": case "no": case "0":
      return false;
    case "": case null: case undefined: case "null": case "undefined":
      if (isEmptyValueEqualToTrue === true) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
}

/**
 * Check if the input string is truey or not
 * @param str input string to check if its truey or not
 * @returns boolean
 */
export const checkIfValueIsTruey = (str: string = ''): boolean => {
  return (!!str && str.length > 0 && str !== 'false' && str !== '0' && str !== null);
}

// export const registerCustomElement<T> = (component: T) => {
//   if (typeof window === "object"
//     && typeof window.customElements === "object"
//     && typeof window.customElements.define === "function"
//     && window.customElements.get(component.ELEMENT_NAME) === undefined) {
//     window.customElements.define(component.ELEMENT_NAME, component);
//   }
// }

// export const registerSignalAttributeTypes = (component: any) => {
//   Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(component["ELEMENT_NAME"], component["SIGNAL_ATTRIBUTE_TYPES"]);
// }
// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Clamps a number between a min and a max.
 * @param {number} x The number to be clamped.
 * @param {number} [min] The min value.
 * @param {number} [max] The max value.
 * @return {number} The clamped number.
 * @throws {RangeError} min must be strictly less than max.
 */
export function clamp(x: number, min: number = x, max: number = x): number {
    let clamped = x;

    if (min > max) {
        throw new RangeError(`'min' ${min} should be lower than 'max' ${max}`);
    }

    if (x < min) {
        clamped = min;
    }

    if (x > max) {
        clamped = max;
    }

    return clamped;
}

/**
 * Clamps a number according to its absolute value, but still retainig its sign.
 * @param {number} x The number to be clamped.
 * @param {number} [min] The min value.
 * @param {number} [max] The max value.
 * @return {number} The clamped number.
 */
export function clampAbs(x: number, min: number, max: number): number {
    if (x === 0) {
        throw new RangeError('x must be different from `0`');
    }

    return x / Math.abs(x) * clamp(Math.abs(x), min, max);
}

/**
 * Computes the tan of an angle in degress, and rounds it to 2 decimals.
 * @param {number} deg The angle in degrees.
 * @return {number} The rounded tan.
 */
export function roundedTan(deg: number) {
    return Math.round(Math.tan(deg * Math.PI / 180) * 100) / 100
}

/**
 * Standard setter for a Custom Element boolean property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {boolean} flag
 */
export function booleanSetter(element: HTMLElement, attributeName: string, flag: boolean) {
    element.setAttribute(attributeName, flag.toString());
}

/**
 * Standard getter for a Custom Element boolean property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @return {boolean} Whether the element has that specific attribute
 */
export function booleanGetter(element: HTMLElement, attributeName: string, defaultValue = false): boolean {
    const value = element.getAttribute(attributeName);

    return value === null ? defaultValue : _toBoolean(value);
}

/**
 * Standard setter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {number} value
 */
export function intSetter(element: HTMLElement, attributeName: string, value: number) {
    element.setAttribute(attributeName, value.toString());
}

/**
 * Standard getter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {string} [defaultValue=0]
 * @return {number} Whether the element has that specific attribute
 */
export function intGetter(element: HTMLElement, attributeName: string, defaultValue = 0): number {
    const value = element.getAttribute(attributeName);
    return value === null ? defaultValue : parseInt(value, 10);
}

/**
 * An object representing either a touch event or a mouse event.
 * @typedef {object} INormalisedPointerEvent
 * @property {number} x The x coordinate.
 * @property {number} y The y coordinate.
 * @property {?number} id The pointer identifier.
 * @property {MouseEvent|TouchEvent} event The original event object.
 */

/**
 * Normalises touch and mouse events into an object with the same properties.
 * @param {MouseEvent|TouchEvent} ev The mouse or touch event.
 * @returns {INormalisedPointerEvent}
 * @private
 */
export function normalizeEvent(ev: any) {
    // touch
    if (ev.type === 'touchstart' ||
        ev.type === 'touchmove' ||
        ev.type === 'touchend') {
        const touch = ev.changedTouches[0];
        return {
            x: touch.clientX,
            y: touch.clientY,
            id: touch.identifier,
            event: ev,
            targetElement: touch.target
        };

        // mouse
    } else {
        return {
            x: ev.clientX,
            y: ev.clientY,
            id: null,
            event: ev,
            targetElement: ev.target
        };
    }
}

/**
 * Gets the value of a CSS Custom property on a HTML Element.
 * @param {HTMLElement} element The element to get the property from.
 * @param {string} propertyName The property name.
 * @return {string} The property value.
 */
export function getCSSCustomProperty(element: HTMLElement, propertyName: string): string {
    const cssStyles = getComputedStyle(element);
    return String(cssStyles.getPropertyValue(propertyName)).trim();
}

/**
 * Sets the value of a CSS Custom property on a HTML Element.
 * @param {HTMLElement} element The element to get the property onto.
 * @param {string} propertyName The property name.
 * @param {string|number} propertyValue The property value.
 */
export function setCSSCustomProperty(element: HTMLElement, propertyName: string, propertyValue: string) {
    element.style.setProperty(propertyName, propertyValue);
}

/**
 * Converts value to boolean
 *
 * @private
 * @param {string|boolean} str
 * @returns {boolean}
 */
function _toBoolean(val: string | boolean): boolean {
    const str = String(val);
    switch (str.toLowerCase().trim()) {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(false);
    }
}

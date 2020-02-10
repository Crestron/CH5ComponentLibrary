// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Utility function that returns the first scrollable parent
 */
export function resizeObserver(node: HTMLElement, callback: any) {
    const myObserver = new ResizeObserver(callback);
    myObserver.observe(node);
}
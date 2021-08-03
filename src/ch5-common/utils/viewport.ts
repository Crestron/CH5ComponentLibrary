// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AddInitialTick } from './tick';
import { Ch5Common } from "../../ch5-common/ch5-common";

export interface IViewportDetails {
    width: number;
    height: number;
    heightCollapsedControls: number;
    scrollX: number;
    scrollY: number;
    resized: boolean;
    scrolled: boolean;
}

// A psuedo element is used to calculate heightCollapsedControls as the window.height value changes
// on iOS as the user scrolls and the browser chrome shrinks
const vhElem: HTMLElement = addHeightElement();

// State
let initialised: boolean = false;
let width: number = window.innerWidth;
let heightCollapsedControls: number = vhElem.offsetHeight;
let height: number = window.innerHeight;
let scrollX: number = window.pageXOffset;
let scrollY: number = window.pageYOffset;
let resized: boolean = false;
let scrolled: boolean = false;

// Previous State
let previousWidth: number = width;
let previousHeight: number = heightCollapsedControls;
let previousScrollX: number = scrollX;
let previousScrollY: number = scrollY;

// Public functions
export function GetViewportDetails(): IViewportDetails {
    if (!initialised) {
        initialised = true;
        AddInitialTick(setDetails);
    }

    return {
        width,
        height,
        heightCollapsedControls,
        scrollX,
        scrollY,
        resized,
        scrolled,
    };

}

// Private functions
function setDetails(): void {
    // Set current
    width = window.innerWidth;
    height = window.innerHeight;
    heightCollapsedControls = vhElem.offsetHeight;
    scrollX = window.pageXOffset;
    scrollY = window.pageYOffset;

    // Set resized and scrolled
    resized = previousWidth !== width || previousHeight !== height;
    scrolled = previousScrollX !== scrollX || previousScrollY !== scrollY;

    // Set previous
    previousWidth = width;
    previousHeight = height;
    previousScrollX = scrollX;
    previousScrollY = scrollY;
}

function addHeightElement(): HTMLElement {
    const elem: HTMLElement = document.createElement('div');
    elem.style.position = 'fixed';
    elem.style.height = '100vh';
    if (document && document.documentElement) {
        document.documentElement.appendChild(elem);
    }
    return elem;
}

function getAspectRatioWidth(pixelWidth: number, aRatio: any) {
    let pHeight: number = 0;
    pHeight = pixelWidth / aRatio.width * aRatio.height;
    pHeight = parseFloat(pHeight.toFixed(2));
    return pHeight;
}

function getAspectRatioHeight(pixelHeight: number, aRatio: any) {
    let pWidth: number = 0;
    pWidth = pixelHeight / aRatio.height * aRatio.width;
    pWidth = parseFloat(pWidth.toFixed(2));
    return pWidth;
}

function aspectRatioCalculation(ratioWidth: number, ratioHeight: number, pixelWidth: number, pixelHeight: number) {
    const pWidth: number = pixelWidth - (pixelWidth % ratioWidth);
    const pHeight: number = pixelHeight - (pixelHeight % ratioHeight);

    const roundedWidth: number = pWidth - (pWidth % ratioWidth);
    const roundedHeight: number = pHeight - (pHeight % ratioHeight);

    let pw = roundedWidth;
    let ph = roundedHeight;

    const aRatio = { width: ratioWidth, height: ratioHeight };
    ph = getAspectRatioWidth(roundedWidth, aRatio);

    if (ph > pHeight) {
        ph = roundedHeight;
        pw = getAspectRatioHeight(roundedHeight, aRatio);
    }

    return ({ width: pw, height: ph });
}

export function getAspectRatio(ratioWidth: number, ratioHeight: number, viewPortSize: number) {
    const pixelVH = Ch5Common.convertVhUnitsToPx(viewPortSize);
    const pixelVW = Ch5Common.convertVwUnitsToPx(viewPortSize);
    return aspectRatioCalculation(ratioWidth, ratioHeight, pixelVW, pixelVH);
}

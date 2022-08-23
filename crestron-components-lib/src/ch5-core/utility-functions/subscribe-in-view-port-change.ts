// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5CoreIntersectionObserver } from "../ch5-core-intersection-observer";

export type subscribeInViewPortChangeCallback = (isInViewPort: boolean) => void;

export function subscribeInViewPortChange(el: HTMLElement, callback: subscribeInViewPortChangeCallback) {
    // implement the logic to observe the element 
    // update the isInViewPort with the returned value from IntersectionObserver
    // the value related to visibility of the specified element

    // out of library, this method may be called with CrComLib.subscribeInViewPortChange([add params]);
    Ch5CoreIntersectionObserver.getInstance().observe(el as Element, callback);
}

export function unSubscribeInViewPortChange(el: HTMLElement) {
    // implement the logic to observe the element 
    // update the isInViewPort with the returned value from IntersectionObserver
    // the value related to visibility of the specified element

    // out of library, this method may be called with CrComLib.subscribeInViewPortChange([add params]);
    if (Ch5CoreIntersectionObserver.getInstance() instanceof Ch5CoreIntersectionObserver) {
        Ch5CoreIntersectionObserver.getInstance().unobserve(el as Element);
    }
}

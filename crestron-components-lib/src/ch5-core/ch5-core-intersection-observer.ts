// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { subscribeInViewPortChangeCallback } from "./utility-functions/subscribe-in-view-port-change";
import _ from 'lodash';
import { Ch5Common } from "../ch5-common/ch5-common";

export class Ch5CoreIntersectionObserver {

    public static observerTreshhold = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.91, 0.92, 0.93];
    public static observerRootMargin: string = '0px';
    private static _instance: Ch5CoreIntersectionObserver;
    private _intersectionObserverConfig: object;
    private _intersectionObserver: IntersectionObserver;

    private constructor() {
        this._intersectionObserverConfig = {
            root: null,
            rootMargin: Ch5CoreIntersectionObserver.observerRootMargin,
            threshold: Ch5CoreIntersectionObserver.observerTreshhold
        };

        this._intersectionObserver = new IntersectionObserver(this.intersectionObserverCallback, this._intersectionObserverConfig);
    }

    public static getInstance(): Ch5CoreIntersectionObserver {
        if (Ch5CoreIntersectionObserver._instance instanceof Ch5CoreIntersectionObserver) {
            return Ch5CoreIntersectionObserver._instance;
        } else {
            Ch5CoreIntersectionObserver._instance = new Ch5CoreIntersectionObserver();
        }

        return Ch5CoreIntersectionObserver._instance;
    }

    private intersectionObserverCallback(entries: any[], observer: IntersectionObserver) {
        entries.forEach((entry) => {
            const ch5Component = entry.target as Ch5Common;
            ch5Component.elementIntersectionEntry = entry as IntersectionObserverEntry;
            ch5Component.elementIsInViewPort = entry.isIntersecting;
            (entry.target as any).viewportCallBack(entry.target as HTMLElement, entry.isIntersecting);
        });
    }

    public observe(element: Element, callback: subscribeInViewPortChangeCallback) {
        if (!_.isNil(element)) {
            (element as any).viewportCallBack = callback;
            this._intersectionObserver.observe(element);
        }
    }

    public unobserve(element: Element) {
        if (!_.isNil(element)) {
            delete (element as any).viewportCallBack;
            this._intersectionObserver.unobserve(element);
        }
    }

    public disconnect() {
        if (this._intersectionObserver instanceof IntersectionObserver) {
            this._intersectionObserver.disconnect();
        }
    }
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5BaseClass } from "../ch5-base/ch5-base-class";
import { Ch5Common } from "./ch5-common";
import { Ch5SharedMutationObserver } from "../ch5-core/ch5-shared-mutation-observer";
import _ from "lodash";

export interface IShowStyle {
    visibility: string;
    opacity: string;
}

/**
 * Per-component facade over the singleton MutationObserver pool.
 *
 * Historically this class constructed one browser-level MutationObserver
 * per component, producing N observers for N components. It now delegates
 * to {@link Ch5SharedMutationObserver} — a singleton that watches every
 * registered target through ONE underlying observer.
 *
 * The public API (constructor, observe, disconnectObserver, isConnected,
 * static checkElementValidity, static ELEMENTS_MO_EXCEPTION) is preserved
 * so the 30+ existing call sites do not need to change.
 */
export class Ch5MutationObserver {

    public static ELEMENTS_MO_EXCEPTION = ['swiper-wrapper'];

    private static readonly _MUTATION_CONFIG: MutationObserverInit = {
        attributes: true,
        attributeOldValue: true,
        childList: false,
        subtree: false,
        attributeFilter: ['style', 'inert'],
    };

    public isConnected = false;
    private _element: Ch5Common | Ch5BaseClass = {} as Ch5Common | Ch5BaseClass;
    private _observedTargets: Node[] = [];

    public static checkElementValidity(target: HTMLElement): boolean {
        return (
            !_.isNil(target) &&
            target.nodeName !== 'BODY' &&
            (
                (target.classList === undefined) ||
                (target.classList.length <= 0) ||
                (Ch5MutationObserver.ELEMENTS_MO_EXCEPTION.indexOf(target.classList[0]) < 0)
            )
        );
    }

    constructor(element: Ch5Common | Ch5BaseClass) {
        this._element = element;
    }

    public observe(target: Node) {
        Ch5SharedMutationObserver.getInstance().observe(
            target,
            Ch5MutationObserver._MUTATION_CONFIG,
            (node) => this._updateComponentVisibility(node),
        );
        this._observedTargets.push(target);
    }

    public disconnectObserver() {
        if (this._observedTargets.length === 0) return;
        this.isConnected = false;
        const shared = Ch5SharedMutationObserver.getInstance();
        for (const target of this._observedTargets) {
            shared.unobserve(target);
        }
        this._observedTargets = [];
    }

    private _updateComponentVisibility(node: Node) {
        const htmlElement = node as HTMLElement;
        if (_.isNil(htmlElement.offsetParent)) {
            this._element.updateElementVisibility(false);
        } else {
            if (this._shouldUpdateComponentVisibility(node) === false) {
                this._element.updateElementVisibility(false);
            } else {
                this._element.updateElementVisibility(true);
            }
        }
    }

    private _shouldUpdateComponentVisibility(node: Node) {
        let styles: IShowStyle = {} as IShowStyle;

        if (document && document.defaultView) {
            styles = document.defaultView.getComputedStyle(node as Element) as IShowStyle;

            if (styles.opacity === '0' || styles.visibility === 'hidden' || (node as Element).hasAttribute('inert')) {
                return false;
            }
        }

        return true;
    }
}

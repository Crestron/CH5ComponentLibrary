// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

// import { Ch5Base } from "../ch5-base/ch5-base";
import { Ch5BaseClass } from "../ch5-base/ch5-base-class";
import { Ch5Common } from "./ch5-common";
import _ from "lodash";

export interface IShowStyle {
    visibility: string;
    opacity: string;
}

export class Ch5MutationObserver {

    /**
     * The containing components will not be observed by MutationObserver
     * @type {string[]}
     */
    public static ELEMENTS_MO_EXCEPTION = ['swiper-wrapper'];

    /**
     * Shared registry: a single native MutationObserver is kept per observed DOM node,
     * fanning out to every Ch5MutationObserver instance that cares about that node.
     * This avoids creating one native MutationObserver per component per ancestor
     * (which, for deeply nested component trees with many siblings, previously meant
     * hundreds/thousands of native observers redundantly watching the exact same shared
     * ancestor nodes).
     */
    private static _sharedObserverEntries: Map<Node, { observer: MutationObserver; subscribers: Set<(mutations: MutationRecord[]) => void> }> = new Map();

    public isConnected = false;
    private _mutationsObserverConfig: object;
    private _element: Ch5Common | Ch5BaseClass = {} as Ch5Common | Ch5BaseClass;
    private _callback: (mutations: MutationRecord[]) => void;
    private _observedTargets: Set<Node> = new Set();

    /**
     * Check the element validity to be observed by Mutation Observer
     *
     * @param {HTMLElement} target
     * @return {boolean}
     */
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

        this._mutationsObserverConfig = {
            attributes: true, // attribute changes will be observed | on add/remove/change attributes
            attributeOldValue: true, // will show oldValue of attribute | on add/remove/change attributes | default: null
            childList: false, // target children will be observed | on add/remove
            subtree: false, // target children will be observed | on attributes/characterData changes if they observed on target
            attributeFilter: ['style', 'inert'] // filter for attributes | array of attributes that should be observed
        };

        this._callback = (mutations: MutationRecord[]) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'inert')) {
                    this._updateComponentVisibility(mutation.target);
                }
            });
        };
    }

    public observe(target: Node) {
        this._observedTargets.add(target);
        let entry = Ch5MutationObserver._sharedObserverEntries.get(target);
        if (!entry) {
            const subscribers = new Set<(mutations: MutationRecord[]) => void>();
            const observer = new MutationObserver((mutations) => {
                subscribers.forEach((subscriberCallback) => subscriberCallback(mutations));
            });
            observer.observe(target, this._mutationsObserverConfig);
            entry = { observer, subscribers };
            Ch5MutationObserver._sharedObserverEntries.set(target, entry);
        }
        entry.subscribers.add(this._callback);
    }

    public disconnectObserver() {
        this.isConnected = false;
        this._observedTargets.forEach((target) => {
            const entry = Ch5MutationObserver._sharedObserverEntries.get(target);
            if (entry) {
                entry.subscribers.delete(this._callback);
                if (entry.subscribers.size === 0) {
                    entry.observer.disconnect();
                    Ch5MutationObserver._sharedObserverEntries.delete(target);
                }
            }
        });
        this._observedTargets.clear();
    }

    /**
     * Check for node children of containing ch5 components and perform related visibility operation
     *
     * @private
     * @param {Node} node
     * @memberof Ch5MutationObserver
     */
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

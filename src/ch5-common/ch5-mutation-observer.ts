// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Base } from "./ch5-base";
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

    public isConnected = false;
    private _mutationsObserver: MutationObserver;
    private _mutationsObserverConfig: object;
    private _element: Ch5Common | Ch5Base = {} as Ch5Common | Ch5Base;

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

    constructor(element: Ch5Common | Ch5Base) {
        this._element = element;

        this._mutationsObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'inert')) {
                    this._updateComponentVisibility(mutation.target);
                }
            });
        });

        this._mutationsObserverConfig = {
            attributes: true, // attribute changes will be observed | on add/remove/change attributes
            attributeOldValue: true, // will show oldValue of attribute | on add/remove/change attributes | default: null
            childList: false, // target children will be observed | on add/remove
            subtree: false, // target children will be observed | on attributes/characterData changes if they observed on target
            attributeFilter: ['style', 'inert'] // filter for attributes | array of attributes that should be observed
        };
    }

    public observe(target: Node) {
        this._mutationsObserver.observe(target, this._mutationsObserverConfig);
    }

    public disconnectObserver() {
        if (this._mutationsObserver instanceof MutationObserver) {
            this.isConnected = false;
            this._mutationsObserver.disconnect();
        }
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

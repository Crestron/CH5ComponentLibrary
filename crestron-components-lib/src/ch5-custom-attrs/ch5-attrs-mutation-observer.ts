// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {Ch5AttrsLog} from './ch5-attrs-log';

export class Ch5AttrsMutationObserver {

    protected _mutationsObserver: MutationObserver | null = null;
    protected _mutationsObserverConfig: object = {};

    protected _skipedNodesNamesPrefix: string = 'ch5-'; // nodes to be skipped by observer
    protected _skipedNodesNames: string[] = ['script', 'link', 'style'];
    protected _nodeTypesToUse: number[] = [0, Node.ELEMENT_NODE]; // 0 is for custom components, like ch5-button

    protected _isValidObserver(observer: any): boolean {
        return observer instanceof MutationObserver;
    }

    public startBodyMutationsObserver(): void {
        if (this._mutationsObserver && this._isValidObserver(this._mutationsObserver)) {
            this._mutationsObserver.observe(document, this._mutationsObserverConfig);
        }
    }

    public stopBodyMutationsObserver(): void {
        if (this._mutationsObserver && this._isValidObserver(this._mutationsObserver)) {
            this._mutationsObserver.disconnect();
        }
    }

    protected _hasCh5Attributes(node: any): boolean {
        // node has any attribute that starts with `data-ch5`
        const attributes: string[] = typeof node.getAttributeNames === 'function'
            ? node.getAttributeNames()
            : [];

        return attributes.length > 0 &&
            attributes.some((attr: string) =>
                (this._mutationsObserverConfig as any).attributeFilter.indexOf(attr) > -1);
    }

    /**
     * Include only elements like div, p, h, span... and custom components &&
     * skip irrelevant elements like script, link, style &&
     * skip ch5 elements that already have this functionality (ex: ch5-button, ch5-list) &&
     * it has ch5 attributes
     */
    protected _viableForCh5Attributes(n: Element): boolean {
        const nodeName = n.nodeName.toLowerCase();
        // console.log('viable for ch5 attrs...', nodeName, this._nodeTypesToUse.indexOf(n.nodeType),
        //     this._skipedNodesNames.indexOf(nodeName), nodeName.search(this._skipedNodesNamesPrefix));
        return this._nodeTypesToUse.indexOf(n.nodeType) > -1 &&
            this._skipedNodesNames.indexOf(nodeName) === -1 &&
            nodeName.search(this._skipedNodesNamesPrefix) === -1;
    }

    protected _getNodesViableForCh5Attributes(nodeList: NodeList) {
        let _viableForCh5: Element[] = [];
        for (const n of (nodeList as any)) {
            if (this._viableForCh5Attributes(n as Element) && this._hasCh5Attributes(n as Element)) {
                _viableForCh5.push(n as Element);
            }
            const childElementsHavingCh5Attrs:Element[] = this.getChildElementsHavingCh5Attr(n);
            _viableForCh5 = _viableForCh5.concat(childElementsHavingCh5Attrs);
        }
        return _viableForCh5;
    }

    protected _childNodesWereAdded(mutation: MutationRecord): boolean {
        return mutation.type === 'childList' &&
            mutation.addedNodes.length > 0;
    }

    protected _childNodesWereRemoved(mutation: MutationRecord): boolean {
        return mutation.type === 'childList' &&
            mutation.removedNodes.length > 0;
    }

    /**
     * Get all elements that have ch5 custom attributes from the entire document
     */
    protected getAllRegularElementsHavingCh5Attr(): Element[] {
        return this.getChildElementsHavingCh5Attr(document);
    }

    /**
     * Get child elements having ch5 custom attributes
     */
    protected getChildElementsHavingCh5Attr(el:Element|Document): Element[] {
        if (!el || typeof el.querySelectorAll === 'undefined') {
            return [];
        }
        const elementsSelectors: string = (this._mutationsObserverConfig as any).attributeFilter.map(
            (attr: string) => `[${attr}]`).join(',');

        return Array.from(el.querySelectorAll(elementsSelectors))
            .filter((item:Element) => this._viableForCh5Attributes(item));
    }

    protected getNewAttributeValue(mutation: MutationRecord) {
        const newAttrValue: string | null =
            (mutation.target as any).getAttribute(mutation.attributeName);
        const _debug = (mutation.target as any).getAttribute('debug');
        Ch5AttrsLog.info(_debug,
            `The ${mutation.attributeName} attribute was modified to: 
                        ${newAttrValue} (previous value: ${mutation.oldValue}`,
            mutation);
        return newAttrValue;
    }
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalFactory, languageChangedSignalName } from '../ch5-core';
import { Ch5AttrsMutationObserver } from "./ch5-attrs-mutation-observer";
import { Ch5AttrsShow } from './ch5-attrs-show';
import { Ch5AttrsShowPulse } from './ch5-attrs-showpulse';
import { Ch5AttrsHidePulse } from './ch5-attrs-hidepulse';
import { Ch5AttrsTextContent } from "./ch5-attrs-text-content";
import { Ch5AttrsInnerhtml } from "./ch5-attrs-innerhtml";
import { Ch5AttrsAppendstyle } from "./ch5-attrs-appendstyle";
import { Ch5AttrsAppendclass } from "./ch5-attrs-appendclass";
import { Ch5AttrsI18n } from "./ch5-attrs-i18n";
import { Ch5AttrsEnable } from './ch5-attrs-enable';

export class Ch5CustomAttributes extends Ch5AttrsMutationObserver {

    public static preventUnsubscribe: boolean = false;

    private static _instance: Ch5CustomAttributes;
    private static ch5AttrsI18nInstance: Ch5AttrsI18n;

    protected _mutationsObserverConfig: {
        attributes: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        attributeFilter: string[]
    } = {
            attributes: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            attributeFilter: [
                Ch5AttrsEnable.DATA_CH5_ATTR_NAME,
                Ch5AttrsShow.DATA_CH5_ATTR_NAME,
                Ch5AttrsShowPulse.DATA_CH5_ATTR_NAME,
                Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME,
                Ch5AttrsTextContent.DATA_CH5_ATTR_NAME,
                Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME,
                Ch5AttrsAppendstyle.DATA_CH5_ATTR_NAME,
                Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME,
                Ch5AttrsI18n.DATA_CH5_ATTR_NAME
            ]
        };
    public constructor() {
        super();
        Ch5CustomAttributes.ch5AttrsI18nInstance = new Ch5AttrsI18n();
        const receiveSignal = Ch5SignalFactory.getInstance().getStringSignal(languageChangedSignalName);
        // Get the signal when language change
        if (!!receiveSignal) {
            receiveSignal.subscribe((newValue: string) => {
                if (newValue !== '') {
                    Ch5CustomAttributes.ch5AttrsI18nInstance.updateOnChange();
                }
            });
        }
    }

    public static getInstance(): Ch5CustomAttributes {
        if (!Ch5CustomAttributes._instance) {
            Ch5CustomAttributes._instance = new Ch5CustomAttributes();
        }
        return Ch5CustomAttributes._instance;
    }

    /**
     * Initialize ch5 custom attributes after page load
     */
    public initCh5Attributes(): void {
        if (document.readyState !== 'loading') {
            this.initCh5AttributesOnLoad();
        } else {
            document.addEventListener('DOMContentLoaded',
                this.initCh5AttributesOnLoad.bind(Ch5CustomAttributes._instance));
        }
    }

    public initCh5AttrsMutationsObserver(): void {
        this._mutationsObserver = new MutationObserver(
            this._mutationsCallback.bind(Ch5CustomAttributes._instance));
        this.startBodyMutationsObserver();
    }

    protected _mutationsCallback(mutationsList: MutationRecord[]): void {
        for (const mutation of mutationsList) {
            switch (mutation.type) {
                case 'attributes':
                    this.handleAttributeChanges(mutation);
                    break;

                default:
                    if (this._childNodesWereRemoved(mutation)) {
                        const removedNodes: Element[] =
                            this._getNodesViableForCh5Attributes(mutation.removedNodes as NodeListOf<Element>);
                        if (removedNodes.length) {
                            this.handleNodesRemovalFromDOM(removedNodes);
                        }
                    }
                    if (this._childNodesWereAdded(mutation)) {
                        const addedNodes: Element[] =
                            this._getNodesViableForCh5Attributes(mutation.addedNodes as NodeListOf<Element>);
                        if (addedNodes.length) {
                            this.handleNodesStampedIntoDOM(addedNodes);
                        }
                    }
            }
        }
    }

    /**
     * Ch5 attributes should be applied to:
     *      - existing elements on page load
     *      - elements added/modified/deleted from DOM after page was loaded
     */
    public initCh5AttributesOnLoad(): void {
        // 1. find existing elements and bind ch5 attrs functionality to them
        const elements: Element[] = this.getAllRegularElementsHavingCh5Attr();

        if (elements.length > 0) {
            for (const el of (elements as any)) {
                if (el.hasAttribute(Ch5AttrsEnable.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsEnable.checkAndSubscribeToSignal(el);
                }
                if (el.hasAttribute(Ch5AttrsShow.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsShow.checkAndSubscribeToSignal(el);
                }
                if (el.hasAttribute(Ch5AttrsShowPulse.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsShowPulse.checkAndSubscribeToSignal(el);
                }
                if (el.hasAttribute(Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsHidePulse.checkAndSubscribeToSignal(el);
                }
                if (el.hasAttribute(Ch5AttrsTextContent.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsTextContent.handleBeingAddedToDom(el);
                }
                if (el.hasAttribute(Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsInnerhtml.handleBeingAddedToDom(el);
                }
                if (el.hasAttribute(Ch5AttrsAppendstyle.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsAppendstyle.handleBeingAddedToDom(el);
                }
                if (el.hasAttribute(Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME)) {
                    Ch5AttrsAppendclass.handleBeingAddedToDom(el);
                }
                if (el.hasAttribute(Ch5AttrsI18n.DATA_CH5_ATTR_NAME)) {
                    Ch5CustomAttributes.ch5AttrsI18nInstance.handleBeingAddedToDom(el);
                }
            }
        }
        /**
         * 2. activate mutation observer for ch5 custom attributes
         * NOTE: init mutation observer only after all existing elements are subscribed to
         * the custom attributes signals, otherwise signal binding will be made twice
         */
        this.initCh5AttrsMutationsObserver();
    }

    protected handleNodesStampedIntoDOM(addedNodes: Element[]): void {
        addedNodes.forEach((n) => {
            if (n.hasAttribute(Ch5AttrsEnable.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsEnable.handleElAddedToDOM(n);
            }

            if (n.hasAttribute(Ch5AttrsShow.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsShow.handleElAddedToDOM(n);
            }

            if (n.hasAttribute(Ch5AttrsShowPulse.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsShowPulse.handleElAddedToDOM(n);
            }

            if (n.hasAttribute(Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsHidePulse.handleElAddedToDOM(n);
            }

            if (n.hasAttribute(Ch5AttrsTextContent.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsTextContent.handleBeingAddedToDom(n);
            }

            if (n.hasAttribute(Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsInnerhtml.handleBeingAddedToDom(n);
            }

            if (n.hasAttribute(Ch5AttrsAppendstyle.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsAppendstyle.handleBeingAddedToDom(n);
            }

            if (n.hasAttribute(Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsAppendclass.handleBeingAddedToDom(n);
            }
            if (n.hasAttribute(Ch5AttrsI18n.DATA_CH5_ATTR_NAME)) {
                Ch5CustomAttributes.ch5AttrsI18nInstance.handleBeingAddedToDom(n);
            }
        });
    }

    protected handleNodesRemovalFromDOM(removedNodes: Element[]) {

        if (Ch5CustomAttributes.preventUnsubscribe === true) {
            Ch5CustomAttributes.preventUnsubscribe = true;
            return;
        }

        removedNodes.forEach((el: Element) => {
            if (Ch5AttrsEnable.elHasRemovableSigSubscription(el)) {
                Ch5AttrsEnable.removeSigSubscription(el);
            }

            if (Ch5AttrsShow.elHasRemovableSigSubscription(el)) {
                Ch5AttrsShow.removeSigSubscription(el);
            }

            if (Ch5AttrsShowPulse.elHasRemovableSigSubscription(el)) {
                Ch5AttrsShowPulse.removeSigSubscription(el);
            }

            if (Ch5AttrsHidePulse.elHasRemovableSigSubscription(el)) {
                Ch5AttrsHidePulse.removeSigSubscription(el);
            }

            if (el.hasAttribute(Ch5AttrsTextContent.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsTextContent.handleBeingRemovedFromDom(el);
            }

            if (el.hasAttribute(Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsInnerhtml.handleBeingRemovedFromDom(el);
            }

            if (el.hasAttribute(Ch5AttrsAppendstyle.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsAppendstyle.handleBeingRemovedFromDom(el);
            }

            if (el.hasAttribute(Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME)) {
                Ch5AttrsAppendclass.handleBeingRemovedFromDom(el);
            }
        });
    }

    /**
     *
     */
    protected handleAttributeChanges(mutation: MutationRecord) {
        const newAttrValue: string | null = this.getNewAttributeValue(mutation);
        if (mutation.attributeName === Ch5AttrsEnable.DATA_CH5_ATTR_NAME) {
            Ch5AttrsEnable.handleCh5EnableAttributeChange(newAttrValue, mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsShow.DATA_CH5_ATTR_NAME) {
            Ch5AttrsShow.handleCh5ShowAttributeChange(newAttrValue, mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsShowPulse.DATA_CH5_ATTR_NAME) {
            Ch5AttrsShowPulse.handleCh5ShowPulseAttributeChange(newAttrValue, mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsHidePulse.DATA_CH5_ATTR_NAME) {
            Ch5AttrsHidePulse.handleCh5HidePulseAttributeChange(newAttrValue, mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsTextContent.DATA_CH5_ATTR_NAME) {
            Ch5AttrsTextContent.handleCh5TextContentAttrChange(newAttrValue,
                mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsInnerhtml.DATA_CH5_ATTR_NAME) {
            Ch5AttrsInnerhtml.handleCh5InnerhtmlAttrChange(newAttrValue,
                mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsAppendstyle.DATA_CH5_ATTR_NAME) {
            Ch5AttrsAppendstyle.handleCh5AppendstyleAttrChange(newAttrValue,
                mutation.oldValue, mutation.target as Element);
        }

        if (mutation.attributeName === Ch5AttrsAppendclass.DATA_CH5_ATTR_NAME) {
            Ch5AttrsAppendclass.handleCh5AppendclassAttrChange(newAttrValue,
                mutation.oldValue, mutation.target as Element);
        }
    }

}

Ch5CustomAttributes.getInstance().initCh5Attributes();


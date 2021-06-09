// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import _ from "lodash";
import { Ch5Button } from "./ch5-button";

// const _parentTriggerviewNodeName = 'CH5-BUTTON';
// const COMPONENT_NAME: string = "ch5-button-label";

export class Ch5ButtonLabel extends Ch5Common {

    public getParentButton(): Ch5Button {
        const getTheMatchingParent = (node: Node): Ch5Button => {
            if (!_.isNil(node) && node.nodeName !== "CH5-BUTTON") {
                return getTheMatchingParent(node.parentNode as Node);
            }
            return node as Ch5Button;
        }

        // if (!_.isNil(this.parentElement)) {
        return getTheMatchingParent(this.parentElement as Node);
        // }
    }

    constructor() {
        super();
        this.info('Ch5ButtonLabel.constructor()');
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.info('Ch5ButtonLabel.connectedCallback()');
        this.cacheComponentChildrens();

        // if (!(this.parentElement instanceof Ch5TriggerView)) {
        //     throw new Error(`Invalid parent element for ch5-triggerview-child. Required ch5-triggerview as parent`);
        // }

        // // If this is executed, JavaScript is working and the element
        // // changes its role to `triggerview-child`.
        // this.setAttribute('role', Ch5RoleAttributeMapping.ch5TriggerViewChild);

        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());

        // init attributes
        this.initAttributes();

        this.initCommonMutationObserver(this);

        const templateData = this.children[0];
        if (templateData) {
            if (this.shouldUpdateLabelAttribute()) {
                this.getParentButton().labelHtml = templateData.innerHTML;
            }
        }
        const callbackFn = (mutations: any) => console.log("mutations", mutations);
        const configForMut = {
            attributes: true,
            subtree: true,
            characterData: true
        };
        const observer = new MutationObserver(callbackFn);
        observer.observe(this, configForMut);

        // observer.disconnect();



        // if (this.children && this.children.length > 0) {
        //     Array.from(this.children).forEach((newChild) => {
        //         if (newChild.nodeName.toString().toLowerCase() === "ch5-button-label") {
        //             const templateData = newChild.children[0];
        //             if (templateData && templateData.nodeName.toString().toLowerCase() === "template") {
        //                 // this.info("templateData.innerHTML", templateData.innerHTML);
        //                 // this.setAttribute('label', templateData.innerHTML);
        //                 this._elLabel.innerHTML = templateData.innerHTML;
        //                 // break;
        //             }
        //         } else if (newChild.nodeName.toString().toLowerCase() === "ch5-button-mode") {
        //             // const templateData: Ch5ButtonMode = this.children[i].children[0];
        //             // this._childButtonModes.push(templateData);
        //             const optionTemplate = this.getElementsByTagName('ch5-button-mode')[0] as HTMLElement;
        //             if (optionTemplate && optionTemplate.innerHTML && optionTemplate.innerHTML.length > 0) {
        //                 this.info("optionTemplate.innerHTML", optionTemplate.innerHTML);
        //             }
        //         }
        //     });
        // }
        this.info("READY ch5-button-label");
    }

    /**
     * The concept revolves around which child node should update the attributes of ch5-button.
     * To start off, I am aware of 
     *      current child node name, 
     *      parent node, and 
     *      ch5-button (and its properties like mode, data-ch5-id etc - including child element properties)
     * TODO - Multiple junk nodes like 2 ch5-button-label in ch5-button
     * TODO = check state by state name
     * @returns 
     */
    private shouldUpdateLabelAttribute(): boolean {
        /*
        <ch5-button mode="0">
            <ch5-button-label></ch5-button-label>
            <ch5-button-mode>
                <ch5-button-label></ch5-button-label>
                <ch5-button-mode-state>
                    <ch5-button-label></ch5-button-label>
                </ch5-button-mode-state>
            </ch5-button-mode>
        <ch5-button>                
        */

        const ch5Button: Ch5Button = this.getParentButton();
        const selectedMode: number = ch5Button.mode;
        const parentNode: HTMLElement | null = this.parentElement;

        if (parentNode) {
            const parentNodeName: string = parentNode.nodeName.toString().toLowerCase();

            if (parentNodeName === "ch5-button") {
                // Case: "ch5-button-label" is an immediate child for the parent "ch5-button"
                // Check if ch5-button-mode exists
                const ch5ButtonModesArray = parentNode.getElementsByTagName("ch5-button-mode");
                if (ch5ButtonModesArray && ch5ButtonModesArray.length > 0) {
                    // Implies multi-mode is true
                    // Now check if ch5-button-label exists in ch5-button-mode or ch5-button-mode-state
                    const ch5ButtonModeLabelArray = ch5ButtonModesArray[selectedMode].getElementsByTagName("ch5-button-label");
                    if (ch5ButtonModeLabelArray && ch5ButtonModeLabelArray.length > 0) {
                        // Since there is "ch5-button-label" in ch5ButtonModesArray (for selected mode), so the "ch5-button-label" 
                        // immediately inside the parent "ch5-button" must be ignored.
                        return false;
                    } else {
                        // No "ch5-button-label" in ch5ButtonModesArray (for selected mode)
                        // Check if ch5-button-mode-state exists
                        const ch5ButtonModeStatesArray = ch5ButtonModesArray[selectedMode].getElementsByTagName("ch5-button-mode-state");
                        console.log("ch5ButtonModeStatesArray[j]", ch5ButtonModeStatesArray);
                        if (ch5ButtonModeStatesArray && ch5ButtonModeStatesArray.length > 0) {
                            // Now check if ch5-button-label exists in ch5-button-mode-state
                            let stateModeIndex: number = -1;
                            for (let j: number = 0; j < ch5ButtonModeStatesArray.length; j++) {
                                console.log("ch5ButtonModeStatesArray[j]", ch5ButtonModeStatesArray[j]);
                                if (ch5ButtonModeStatesArray[j].getAttribute("state") === "selected" && ch5Button.selected === true) {
                                    stateModeIndex = j;
                                    break;
                                } else if (ch5ButtonModeStatesArray[j].getAttribute("state") === "normal" && ch5Button.selected === false) {
                                    console.log("instate");
                                    stateModeIndex = j;
                                    break;
                                }
                            }
                            const ch5ButtonModeStateLabelArray = ch5ButtonModeStatesArray[stateModeIndex].getElementsByTagName("ch5-button-label");
                            if (ch5ButtonModeStateLabelArray && ch5ButtonModeStateLabelArray.length > 0) {
                                return false;
                            } else {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }
                } else {
                    // Implies multi-mode is false
                    // So if the current node is "ch5-button-label" and parent is "ch5-button", 
                    // and there are no "ch5-button-mode" elements, then "ch5-button-label" takes preference.
                    return true;
                }
            } else if (parentNodeName === "ch5-button-mode") {
                // Implies multi-mode is true
                // Check if ch5-button-mode-state exists
                const ch5ButtonModeStatesArray = parentNode.getElementsByTagName("ch5-button-mode-state");
                if (ch5ButtonModeStatesArray && ch5ButtonModeStatesArray.length > 0) {
                    // Now check if ch5-button-label exists in ch5-button-mode-state
                    const ch5ButtonModeLabelArray = ch5ButtonModeStatesArray[0].getElementsByTagName("ch5-button-label");
                    if (ch5ButtonModeLabelArray && ch5ButtonModeLabelArray.length > 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } else if (parentNodeName === "ch5-button-mode-state") {
                const ch5ButtonModesArray = ch5Button.getElementsByTagName("ch5-button-mode");
                if (ch5ButtonModesArray && ch5ButtonModesArray.length > 0) {
                    let buttonModeIndex: number = -1;
                    // for (let i: number = 0; i < ch5ButtonModesArray.length; i++) {
                    // const ch5ButtonModeStatesArray = ch5ButtonModesArray[i].getElementsByTagName("ch5-button-mode-state");
                    const ch5ButtonModeStatesArray = ch5ButtonModesArray[selectedMode].getElementsByTagName("ch5-button-mode-state");
                    if (ch5ButtonModeStatesArray && ch5ButtonModeStatesArray.length > 0) {

                        for (let j: number = 0; j < ch5ButtonModeStatesArray.length; j++) {
                            if (ch5ButtonModeStatesArray[j].getAttribute("data-ch5-id") === parentNode.getAttribute("data-ch5-id")) {
                                if (parentNode.getAttribute("state") === "selected" && ch5Button.selected === true) {
                                    buttonModeIndex = j;
                                } else if (parentNode.getAttribute("state") === "normal" && ch5Button.selected === false) {
                                    buttonModeIndex = j;
                                }
                                break;
                            }
                        }
                    }
                    if (buttonModeIndex !== -1) {
                        const ch5ButtonModeLabelArray = ch5ButtonModeStatesArray[buttonModeIndex].getElementsByTagName("ch5-button-label");
                        if (ch5ButtonModeLabelArray && ch5ButtonModeLabelArray.length > 0) {
                            // Since there is "ch5-button-label" in ch5ButtonModesArray (for selected mode), so the "ch5-button-label" 
                            // immediately inside the parent "ch5-button" must be ignored.
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    // /**
    //  * Called every time the element is removed from the DOM.
    //  * Useful for running clean up code.
    //  */
    // public disconnectedCallback() {

    // }

}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-button-label', Ch5ButtonLabel);
}

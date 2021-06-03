// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core";
import _ from "lodash";
import { ICh5ButtonModeAttributes, TCh5ButtonCheckboxPosition, TCh5ButtonHorizontalAlignLabel, TCh5ButtonIconPosition, TCh5ButtonType, TCh5ButtonVerticalAlignLabel } from "./interfaces";
import { Ch5Button } from "./ch5-button";

const COMPONENT_NAME: string = "ch5-button-mode";

export class Ch5ButtonMode extends Ch5Common implements ICh5ButtonModeAttributes {

    //#region 1. Setters and Getters

    public set iconClass(value: string) {
        this.info('set iconClass("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        if (parentElement !== null) {
            parentElement.iconClass = value;
        }
    }
    public get iconClass(): string {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.iconClass;
    }

    public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel) {
        this.info('set hAlignLabel("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        parentElement.hAlignLabel = value;
    }
    public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.hAlignLabel;
    }

    public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel) {
        this.info('set vAlignLabel("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        parentElement.vAlignLabel = value;
    }
    public get vAlignLabel(): TCh5ButtonVerticalAlignLabel {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.vAlignLabel;
    }

    public set checkboxPosition(value: TCh5ButtonCheckboxPosition) {
        this.info('set checkboxPosition("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        parentElement.checkboxPosition = value;
    }
    public get checkboxPosition(): TCh5ButtonCheckboxPosition {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.checkboxPosition;
    }

    public set iconPosition(value: TCh5ButtonIconPosition) {
        this.info('set iconPosition("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        parentElement.iconPosition = value;
    }
    public get iconPosition(): TCh5ButtonIconPosition {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.iconPosition;
    }

    public set iconUrl(value: string) {
        this.info('set type("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        parentElement.iconUrl = value;
    }
    public get iconUrl(): string {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.type;
    }

    public set type(value: TCh5ButtonType) {
        this.info('set type("' + value + '")');
        const parentElement: Ch5Button = this.getParentButton();
        parentElement.activeType = value;
    }
    public get type(): TCh5ButtonType {
        const parentElement: Ch5Button = this.getParentButton();
        return parentElement.activeType;
    }

    //#endregion

    //#region 2. Life Cycle Hooks

    constructor() {
        super();
        this.info('Ch5ButtonMode.constructor()');
        // this._isDebugEnabled = true; // TODO - fix this
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.log.start('connectedCallback()', COMPONENT_NAME);
        this.cacheComponentChildrens();

        // if (!(this.parentElement instanceof Ch5TriggerView)) {
        //     throw new Error(`Invalid parent element for ch5-triggerview-child. Required ch5-triggerview as parent`);
        // }

        // // set noshowtype attribute
        // this.setAttribute('noshowtype', Ch5ButtonMode.SHOW_TYPES[0]);

        // this.updateCssClasses();

        // // If this is executed, JavaScript is working and the element
        // // changes its role to `triggerview-child`.
        // this.setAttribute('role', Ch5RoleAttributeMapping.ch5TriggerViewChild);

        this.setAttribute('data-ch5-id', this.getCrId());
        this.initAttributes();

        this.initCommonMutationObserver(this);
        this.log.stop();
    }

    /**
     * Called every time the element is removed from the DOM.
     * Useful for running clean up code.
     */
    public disconnectedCallback() {
        this.log.start('disconnectedCallback()', COMPONENT_NAME);

        this.unsubscribeFromSignals();

        // disconnect common mutation observer
        this.disconnectCommonMutationObserver();
        this.log.stop();
    }

    /**
     * Respond to attribute changes.
     */
    static get observedAttributes() {
        const commonAttributes = Ch5Common.observedAttributes;

        const ch5ButtonModeChildAttributes: string[] = [
            'type',
            'iconclass',
            'halignlabel',
            'valignlabel',
            'checkboxposition',
            'iconposition',
            'iconurl'
        ];

        return commonAttributes.concat(ch5ButtonModeChildAttributes);
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        this.log.start("attributeChangedCallback", COMPONENT_NAME);
        if (oldValue !== newValue) {

            this.info('Ch5ButtonMode.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

            switch (attr) {
                case 'type':
                    // only handling the *side effects* of setting the attribute.
                    if (this.hasAttribute('type')) {
                        // this.setAttribute('aria-selected', 'true');
                        // this._sendSignalValueOnShow();
                    } else {
                        // this.setAttribute('aria-selected', 'false');
                    }
                    this.type = newValue as TCh5ButtonType;
                    // this.setAttribute("type", newValue);
                    break;

                case 'iconclass':
                    if (this.hasAttribute('iconclass')) {
                        this.iconClass = newValue as string;
                    }
                    break;

                case 'hAlignLabel':
                    if (this.hasAttribute('halignlabel')) {
                        this.hAlignLabel = newValue as TCh5ButtonHorizontalAlignLabel;
                    }
                    break;

                case 'vAlignLabel':
                    if (this.hasAttribute('valignlabel')) {
                        this.vAlignLabel = newValue as TCh5ButtonVerticalAlignLabel;
                    }
                    break;

                case 'checkboxPosition':
                    if (this.hasAttribute('checkboxposition')) {
                        this.checkboxPosition = newValue as TCh5ButtonCheckboxPosition;
                    }
                    break;

                case 'iconPosition':
                    if (this.hasAttribute('iconposition')) {
                        this.iconPosition = newValue as TCh5ButtonIconPosition;
                    }
                    break;

                case 'iconurl':
                    if (this.hasAttribute('iconurl')) {
                        this.iconUrl = newValue as string;
                    }
                    break;

                // default:
                //     super.attributeChangedCallback(attr, oldValue, newValue);
                //     break;
            }
        }
        this.log.stop();
    }

    /**
     * Unsubscribe signals
     */
    public unsubscribeFromSignals(): void {
        super.unsubscribeFromSignals();

        const csf = Ch5SignalFactory.getInstance();

        // if ('' !== this._subReceiveSignalShowId && '' !== this._receiveStateShowSigName) {
        //     const sigSelectedName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowSigName);
        //     const sigSelected:Ch5Signal<number>|null=csf.getNumberSignal(sigSelectedName);
        //     if (null !== sigSelected){
        //         sigSelected.unsubscribe(this._subReceiveSignalShowId);
        //         this._receiveStateShowSigName = '';
        //     }
        // }
    }

    //#endregion

    //#region 3. Other Methods


  private  shouldUpdateButtonModeAttributes(thisNode: Ch5ButtonMode): boolean {
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
    const ch5Button: Ch5Button = thisNode.getParentButton();
    const selectedMode: number = ch5Button.mode;
    const currentNode = thisNode;
    const currentNodeName = currentNode.nodeName.toString().toLowerCase();
    const parentNode: HTMLElement | null = thisNode.parentElement;

    if (parentNode) {
      const parentNodeName: string = parentNode.nodeName.toString().toLowerCase();

      if (currentNodeName === "ch5-button-label") {
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
                  if (currentNode.getAttribute("state") === "selected" && ch5Button.selected === true) {
                    buttonModeIndex = selectedMode;
                  } else if (currentNode.getAttribute("state") === "normal" && ch5Button.selected === false) {
                    buttonModeIndex = selectedMode;
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
              } else {
                // TODO: Pending implementation
              }
              return false;
            }
          }
        }
      } else if (currentNodeName === "ch5-button-mode") {
        // Implies multi-mode is true
        if (parentNodeName === "ch5-button") {
          const ch5ButtonModesArray = ch5Button.getElementsByTagName("ch5-button-mode");
          if (ch5ButtonModesArray && ch5ButtonModesArray.length > 0) {
            if (ch5ButtonModesArray[selectedMode] && currentNode && (String(ch5ButtonModesArray[selectedMode].getAttribute("data-ch5-id")) === currentNode.getAttribute("data-ch5-id"))) {
              return true;
            }
          }
        }
      } else if (currentNodeName === "ch5-button-mode-state") {
        // Implies multi-mode is true
        if (parentNodeName === "ch5-button-mode") {
          const ch5ButtonModesArray = ch5Button.getElementsByTagName("ch5-button-mode");
          if (ch5ButtonModesArray && ch5ButtonModesArray.length > 0) {
            if (ch5ButtonModesArray[selectedMode] &&
              (String(ch5ButtonModesArray[selectedMode].getAttribute("data-ch5-id")) === parentNode.getAttribute("data-ch5-id"))) {
              if (currentNode.getAttribute("state") === "selected" && ch5Button.selected === true) {
                return true;
              } else if (currentNode.getAttribute("state") === "normal" && ch5Button.selected === false) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    }

    return false;
  }


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

    // /**
    //  * Returns css class when disabled
    //  *
    //  * @return {string }
    //  */
    // public getCssClassDisabled(): string {
    //     return this.cssClassPrefix + '--disabled';
    // }

    // public getTriggerViewParent(): Ch5TriggerView | null {

    //     const getTheMatchingParent = (node: Node): Ch5TriggerView => {
    //         if (!_.isNil(node) && node.nodeName !== _parentTriggerviewNodeName) {
    //             return getTheMatchingParent(node.parentNode as Node);
    //         }

    //         return node as Ch5TriggerView;
    //     }

    //     if (!_.isNil(this.parentElement)) {
    //         return getTheMatchingParent(this.parentElement as Node);
    //     }

    //     return null;

    // }

    // /**
    //  * Called to initialize all attributes
    //  * @protected
    //  */
    // protected initAttributes(): void {
    //     super.initAttributes();

    //     this._upgradeProperty('sendEventOnShow');
    //     this._upgradeProperty('receiveStateShow');
    // }

    // /**
    //  * Apply css classes for attrs inherited from common (e.g. customClass, customStyle )
    //  * @protected
    //  */
    // protected updateCssClasses(): void {
    //     // apply css classes for attrs inherited from common (e.g. customClass, customStyle )
    //     super.updateCssClasses();

    //     const setOfCssClassesToBeApplied = new Set<string>();

    //     // primary
    //     setOfCssClassesToBeApplied.add(this.primaryCssClass);

    //     const targetEl:HTMLElement = this.getTargetElementForCssClassesAndStyle();
    //     if (typeof targetEl.classList !== 'undefined') {
    //         this._listOfAllPossibleComponentCssClasses.forEach((cssClass:string) => {
    //             if (setOfCssClassesToBeApplied.has(cssClass)){
    //                 targetEl.classList.add(cssClass);
    //                 // this.classList.add(cssClass);
    //                 this.info('add CSS class',cssClass);
    //             } else {
    //                 targetEl.classList.remove(cssClass);
    //                 // this.classList.remove(cssClass);
    //                 this.info('remove CSS class',cssClass);
    //             }
    //         });
    //     }
    // }

    // /**
    //  * Called to bind proper listeners
    //  * @protected
    //  */
    // protected attachEventListeners(): void {
    //     super.attachEventListeners();
    // }

    // /**
    //  * Removes listeners
    //  * @protected
    //  */
    // protected removeEvents(): void {
    //     super.removeEventListeners();
    //     // TODO
    // }

     //#endregion

}

if (typeof window === "object" &&
    typeof window.customElements === "object" &&
    typeof window.customElements.define === "function") {
    window.customElements.define('ch5-button-mode', Ch5ButtonMode);
}

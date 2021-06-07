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

  private _parentCh5Button: Ch5Button;

  //#region 1. Setters and Getters

  public set iconClass(value: string) {
    console.log('set iconClass("' + value + '")');
    // if (this.value !== null && this._iconClass !== value) {
    //   if (this.iconClass !== '') {
    //     this._iconClass.split(' ').forEach((className: string) => {
    //       className = className.trim();
    //       if (className !== '') {
    //         if (this.hasAttribute('iconurl')) {
    //           this._elImg.classList.remove(className); // adds the new icon class if present
    //         }
    //         else {
    //           this._elIcon.classList.remove(className); // adds the new icon class if present
    //         }
    //       }
    //     });
    //   }
    //   this._iconClass = value;
    //   if ('' !== this.iconClass) {
    //     this._iconClass.split(' ').forEach((className: string) => {
    //       className = className.trim();
    //       if ('' !== className) {
    //         if (this.hasAttribute('iconurl')) {
    //           this._elImg.classList.add(className); // adds the new icon class if present
    //         }
    //         else {
    //           this._elIcon.classList.add(className); // adds the new icon class if present
    //         }
    //       }
    //     });
    //   }
    //   this.setAttribute('iconclass', value);
    //   this.changeAttributesOnModeChange(this);
    // }

    // if (value !== null && value.trim() !== '') {
    //   if (parentElement.TYPES.indexOf(value) >= 0) {
    //     this.setAttribute('type', value);
    //     parentElement.changeAttributesOnModeChange(this);
    //   } else {
    //     this.removeAttribute("type");
    //     // parentElement.resetActiveAttribute(this, "type"); is not required here. The set type will be called again to 
    //     // go the below else block and the changeAttributesOnModeChange is called
    //   }
    // } else {
    //   this.removeAttribute("type");
    //   parentElement.changeAttributesOnModeChange(this);
    // }
  }
  public get iconClass(): string {
    return this.getAttribute("iconClass") as string;
  }

  public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel | null) {
    console.log('set hAlignLabel("' + value + '")');
    this.validateAndSetAttributeWithCustomType("halignlabel", this._parentCh5Button.HORIZONTAL_LABEL_ALIGNMENTS, value);
  }
  public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel | null {
    return this.getAttribute("hAlignLabel") as TCh5ButtonHorizontalAlignLabel | null;
  }

  public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel | null) {
    console.log('set vAlignLabel("' + value + '")');
    this.validateAndSetAttributeWithCustomType("valignlabel", this._parentCh5Button.VERTICAL_LABEL_ALIGNMENTS, value);
  }
  public get vAlignLabel(): TCh5ButtonVerticalAlignLabel | null {
    return this.getAttribute("vAlignLabel") as TCh5ButtonVerticalAlignLabel | null;
  }

  public set checkboxPosition(value: TCh5ButtonCheckboxPosition | null) {
    console.log('set checkboxPosition("' + value + '")');
    this.validateAndSetAttributeWithCustomType("checkboxposition", this._parentCh5Button.CHECKBOX_POSITIONS, value);
  }
  public get checkboxPosition(): TCh5ButtonCheckboxPosition | null {
    return this.getAttribute("checkboxPosition") as TCh5ButtonCheckboxPosition | null;
  }

  public set iconPosition(value: TCh5ButtonIconPosition | null) {
    console.log('set iconPosition("' + value + '")');
    this.validateAndSetAttributeWithCustomType("iconposition", this._parentCh5Button.ICON_POSITIONS, value);
  }
  public get iconPosition(): TCh5ButtonIconPosition | null {
    return this.getAttribute("iconPosition") as TCh5ButtonIconPosition | null;
  }

  public set iconUrl(value: string) {
    console.log('set type("' + value + '")');
    this._parentCh5Button.iconUrl = value;
  }
  public get iconUrl(): string {
    return this.getAttribute("iconUrl") as string;
  }

  public set type(value: TCh5ButtonType | null) {
    console.log('set type("' + value + '")');
    this.validateAndSetAttributeWithCustomType("type", this._parentCh5Button.TYPES, value);
  }
  public get type(): TCh5ButtonType | null {
    return this.getAttribute("type") as TCh5ButtonType | null;
  }

  //#endregion

  //#region 2. Life Cycle Hooks

  constructor() {
    super();
    console.log('Ch5ButtonMode.constructor()');
    this._parentCh5Button = this.getParentButton();
    console.log("this._parentCh5Button", this._parentCh5Button);
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

      console.log('Ch5ButtonMode.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

      switch (attr) {
        case 'type':
          if (this.hasAttribute('type')) {
            this.type = newValue as TCh5ButtonType;
          } else {
            this.type = null;
          }
          break;

        case 'iconclass':
          if (this.hasAttribute('iconclass')) {
            this.iconClass = newValue as string;
          }
          break;

        case 'halignlabel':
          if (this.hasAttribute('halignlabel')) {
            this.hAlignLabel = newValue as TCh5ButtonHorizontalAlignLabel;
          } else {
            this.hAlignLabel = null;
          }
          break;

        case 'valignlabel':
          if (this.hasAttribute('valignlabel')) {
            this.vAlignLabel = newValue as TCh5ButtonVerticalAlignLabel;
          } else {
            this.vAlignLabel = null;
          }
          break;

        case 'checkboxposition':
          if (this.hasAttribute('checkboxposition')) {
            this.checkboxPosition = newValue as TCh5ButtonCheckboxPosition;
          }
          break;

        case 'iconposition':
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

  private validateAndSetAttributeWithCustomType(attributeName: string, parentMasterData: any, value: any) {
    if (value !== null) {
      if (parentMasterData.indexOf(value) >= 0) {
        this.setAttribute(attributeName, value);
        this._parentCh5Button.changeAttributesOnModeChange(this);
      } else {
        this.removeAttribute(attributeName);
        // parentElement.changeAttributesOnModeChange(this); is not required here. The set type will be called again to 
        // go the below else block and the changeAttributesOnModeChange is called
      }
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5Button.changeAttributesOnModeChange(this);
    }
  }

  private setIconUrlAndClass(oldValue: string, newValue: string) {
    // if (this.iconClass !== '') {
    //   this.iconClass.split(' ').forEach((className: string) => {
    //     className = className.trim();
    //     if (className !== '') {
    //       if (this.hasAttribute('iconurl')) {
    //         this._elImg.classList.remove(className); // adds the new icon class if present
    //       }
    //       else {
    //         this._elIcon.classList.remove(className); // adds the new icon class if present
    //       }
    //     }
    //   });
    // }
    // let valueInput = value;
    // valueInput.split(' ').forEach((className: string) => {
    //   className = className.trim();
    //   if (className !== '') {
    //     if (this.hasAttribute('iconurl')) {
    //       this._elImg.classList.add(className); // adds the new icon class if present
    //     }
    //     else {
    //       this._elIcon.classList.add(className); // adds the new icon class if present
    //     }
    //   }
    // });
  }
  private validateAndSetAttributeForString(attributeName: string, value: any) {
    // if (value !== null) {
    //   if (this.iconClass !== '') {
    //     this.iconClass.split(' ').forEach((className: string) => {
    //       className = className.trim();
    //       if (className !== '') {
    //         if (this.hasAttribute('iconurl')) {
    //           this._elImg.classList.remove(className); // adds the new icon class if present
    //         }
    //         else {
    //           this._elIcon.classList.remove(className); // adds the new icon class if present
    //         }
    //       }
    //     });
    //   }
    //   let valueInput = value;
    //   valueInput.split(' ').forEach((className: string) => {
    //     className = className.trim();
    //     if (className !== '') {
    //       if (this.hasAttribute('iconurl')) {
    //         this._elImg.classList.add(className); // adds the new icon class if present
    //       }
    //       else {
    //         this._elIcon.classList.add(className); // adds the new icon class if present
    //       }
    //     }
    //   });
    //   this.setAttribute('iconclass', value);
    //   this._parentCh5Button.changeAttributesOnModeChange(this);
    // } else {
    //   this.removeAttribute(attributeName);
    //   this._parentCh5Button.changeAttributesOnModeChange(this);
    // }
  }

  private shouldUpdateButtonModeAttributes(attributeName: string): boolean {
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
    const currentNode = this;
    const currentNodeName = currentNode.nodeName.toString().toLowerCase();
    const parentNode: HTMLElement | null = this.parentElement;

    if (parentNode) {
      const parentNodeName: string = parentNode.nodeName.toString().toLowerCase();

      if (currentNodeName === "ch5-button-mode") {
        // Implies multi-mode is true
        if (parentNodeName === "ch5-button") {
          const ch5ButtonModesArray = ch5Button.getElementsByTagName("ch5-button-mode");
          if (ch5ButtonModesArray && ch5ButtonModesArray.length > 0) {
            if (ch5ButtonModesArray[selectedMode] && (String(ch5ButtonModesArray[selectedMode].getAttribute("data-ch5-id")) === currentNode.getAttribute("data-ch5-id"))) {
              const ch5ButtonModeStatesArray = ch5ButtonModesArray[selectedMode].getElementsByTagName("ch5-button-mode-state");
              if (ch5ButtonModeStatesArray && ch5ButtonModeStatesArray.length > 0) {
                let buttonModeIndex: number = -1;
                for (let j: number = 0; j < ch5ButtonModeStatesArray.length; j++) {
                  if (ch5ButtonModeStatesArray[j].getAttribute("state") === "selected" && ch5Button.selected === true) {
                    buttonModeIndex = j;
                    break;
                  } else if (ch5ButtonModeStatesArray[j].getAttribute("state") === "normal" && ch5Button.selected === false) {
                    buttonModeIndex = j;
                    break;
                  }
                }
                if (buttonModeIndex !== -1) {
                  if (ch5ButtonModeStatesArray[buttonModeIndex].getAttribute(attributeName) && ch5ButtonModeStatesArray[buttonModeIndex].getAttribute(attributeName) !== "") {
                    // We dont need to check if the attributeName content is valid - this is checked inside setter
                    // mode-state has attribute
                    return true;
                  } else {
                    // since mode-state does not have attribute , check with mode
                    if (currentNode.getAttribute(attributeName) && currentNode.getAttribute(attributeName) !== "") {
                      return true;
                    }
                  }
                }
              } else {
                // We dont need to check if the attributeName content is valid - this is checked inside setter
                if (currentNode.getAttribute(attributeName) && currentNode.getAttribute(attributeName) !== "") {
                  return true;
                }
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
  //                 console.log('add CSS class',cssClass);
  //             } else {
  //                 targetEl.classList.remove(cssClass);
  //                 // this.classList.remove(cssClass);
  //                 console.log('remove CSS class',cssClass);
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

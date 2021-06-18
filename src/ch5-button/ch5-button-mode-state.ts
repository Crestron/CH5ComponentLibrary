// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import _ from "lodash";
import { ICh5ButtonModeStateAttributes, TCh5ButtonCheckboxPosition, TCh5ButtonHorizontalAlignLabel, TCh5ButtonIconPosition, TCh5ButtonModeState, TCh5ButtonType, TCh5ButtonVerticalAlignLabel } from "./interfaces";
import { Ch5Button } from "./ch5-button";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5ButtonMode } from "./ch5-button-mode";

const COMPONENT_NAME: string = "ch5-button-mode-state";

export class Ch5ButtonModeState extends Ch5Common implements ICh5ButtonModeStateAttributes {

  private _state: TCh5ButtonModeState = "normal";
  private _parentCh5Button: Ch5Button;

  //#region 1. Setters and Getters

  public set state(value: TCh5ButtonModeState) {
    this.info('set state("' + value + '")');
    if (this._state !== value) {
      this._state = value;
    }
  }
  public get state(): TCh5ButtonModeState {
    return this._state
  }

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

  public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel | null) {
    this.info('set hAlignLabel("' + value + '")');
    this.validateAndSetAttributeWithCustomType("halignlabel", value);
  }
  public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel | null {
    const parentElement: Ch5Button = this.getParentButton();
    return parentElement.hAlignLabel;
  }

  public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel | null) {
    this.info('set vAlignLabel("' + value + '")');
    this.validateAndSetAttributeWithCustomType("valignlabel", value);
  }
  public get vAlignLabel(): TCh5ButtonVerticalAlignLabel | null {
    const parentElement: Ch5Button = this.getParentButton();
    return parentElement.vAlignLabel;
  }

  public set checkboxPosition(value: TCh5ButtonCheckboxPosition | null) {
    this.info('set checkboxPosition("' + value + '")');
    this.validateAndSetAttributeWithCustomType("checkboxposition", value);
  }
  public get checkboxPosition(): TCh5ButtonCheckboxPosition | null {
    const parentElement: Ch5Button = this.getParentButton();
    return parentElement.checkboxPosition;
  }

  public set iconPosition(value: TCh5ButtonIconPosition | null) {
    this.info('set iconPosition("' + value + '")');
    this.validateAndSetAttributeWithCustomType("iconposition", value);
  }
  public get iconPosition(): TCh5ButtonIconPosition | null {
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

  public set type(value: TCh5ButtonType | null) {
    this.info('set type("' + value + '")');
    this.validateAndSetAttributeWithCustomType("type", value);
  }
  public get type(): TCh5ButtonType | null {
    const parentElement: Ch5Button = this.getParentButton();
    return parentElement.activeType;
  }

  //#endregion

  //#region 2. Life Cycle Hooks

  constructor() {
    super();
    this.info('Ch5ButtonMode.constructor()');
    this._parentCh5Button = this.getParentButton();
  }

  /**
   * 	Called every time the element is inserted into the DOM.
   *  Useful for running setup code, such as fetching resources or rendering.
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', COMPONENT_NAME);
    this.cacheComponentChildrens();

    if (!(this.parentElement instanceof Ch5ButtonMode)) {
      throw new Error(`Invalid parent element for ch5-button-mode-state.`);
    }
    if (_.isNil(this._parentCh5Button)) {
      throw new Error(`Missing parent ch5-button element for ch5-button-mode-state.`);
    }

    // // set noshowtype attribute
    // this.setAttribute('noshowtype', Ch5ButtonMode.SHOW_TYPES[0]);

    this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonModeState);

    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();

    this.initCommonMutationObserver(this);
    this.logger.stop();
  }

  /**
   * Called every time the element is removed from the DOM.
   * Useful for running clean up code.
   */
  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', COMPONENT_NAME);

    this.unsubscribeFromSignals();

    // disconnect common mutation observer
    this.disconnectCommonMutationObserver();
    this.logger.stop();
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
      'iconurl',
      'state'
    ];

    return commonAttributes.concat(ch5ButtonModeChildAttributes);
  }

  /**
   * Called when an HTML attribute is changed, added or removed
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    this.logger.start("attributeChangedCallback", COMPONENT_NAME);
    if (oldValue !== newValue) {

      this.info('Ch5ButtonModeState.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

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

        case 'state':
          if (this.hasAttribute('state')) {
            this.state = newValue as TCh5ButtonModeState;
          }
          break;

        // default:
        //     super.attributeChangedCallback(attr, oldValue, newValue);
        //     break;
      }
    }
    this.logger.stop();
  }

  //#endregion

  //#region 3. Other Methods

  private validateAndSetAttributeWithCustomType(attributeName: string, value: any) {
    if (value !== null) {
      if (Ch5Button.TYPES.indexOf(value) >= 0) {
        this.setAttribute(attributeName, value);
        this._parentCh5Button.changeAttributesOnModeChange(this);
      } else {
        this.removeAttribute(attributeName);
        // parentElement.resetActiveAttribute(this, attributeName); is not required here. The set type will be called again to 
        // go the below else block and the changeAttributesOnModeChange is called
      }
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5Button.changeAttributesOnModeChange(this);
    }
  }

  public getParentButton(): Ch5Button {
    const getTheMatchingParent = (node: Node): Ch5Button => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-BUTTON") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5Button;
    }

    return getTheMatchingParent(this.parentElement as Node);
  }

  //#endregion

}

if (typeof window === "object" &&
  typeof window.customElements === "object" &&
  typeof window.customElements.define === "function") {
  window.customElements.define('ch5-button-mode-state', Ch5ButtonModeState);
}

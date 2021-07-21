// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import _ from "lodash";
import { ICh5ButtonModeAttributes, TCh5ButtonCheckboxPosition, TCh5ButtonHorizontalAlignLabel, TCh5ButtonIconPosition, TCh5ButtonType, TCh5ButtonVerticalAlignLabel } from "./interfaces";
import { Ch5Button } from "./ch5-button";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Log } from "../ch5-common/ch5-log";

const COMPONENT_NAME: string = "ch5-button-mode";

export class Ch5ButtonMode extends Ch5Log implements ICh5ButtonModeAttributes {

  private _parentCh5Button: Ch5Button;

  //#region 1. Setters and Getters

  public set iconClass(value: string) {
    this.info('set iconClass("' + value + '")');
    this.validateAndSetAttributeWithStringType("iconclass", value);
  }
  public get iconClass(): string {
    return this.getAttribute("iconclass") as string;
  }

  public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel | null) {
    this.info('set hAlignLabel("' + value + '")');
    this.validateAndSetAttributeWithCustomType("halignlabel", Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS, value);
  }
  public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel | null {
    return this.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel | null;
  }

  public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel | null) {
    this.info('set vAlignLabel("' + value + '")');
    this.validateAndSetAttributeWithCustomType("valignlabel", Ch5Button.VERTICAL_LABEL_ALIGNMENTS, value);
  }
  public get vAlignLabel(): TCh5ButtonVerticalAlignLabel | null {
    return this.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel | null;
  }

  public set checkboxPosition(value: TCh5ButtonCheckboxPosition | null) {
    this.info('set checkboxPosition("' + value + '")');
    this.validateAndSetAttributeWithCustomType("checkboxposition", Ch5Button.CHECKBOX_POSITIONS, value);
  }
  public get checkboxPosition(): TCh5ButtonCheckboxPosition | null {
    return this.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition | null;
  }

  public set iconPosition(value: TCh5ButtonIconPosition | null) {
    this.info('set iconPosition("' + value + '")');
    this.validateAndSetAttributeWithCustomType("iconposition", Ch5Button.ICON_POSITIONS, value);
  }
  public get iconPosition(): TCh5ButtonIconPosition | null {
    return this.getAttribute("iconposition") as TCh5ButtonIconPosition | null;
  }

  public set iconUrl(value: string) {
    this.info('set iconUrl("' + value + '")');
    this.validateAndSetAttributeWithStringType("iconurl", value);
  }
  public get iconUrl(): string {
    return this.getAttribute("iconurl") as string;
  }

  public set type(value: TCh5ButtonType | null) {
    this.info('set type("' + value + '")');
    this.validateAndSetAttributeWithCustomType("type", Ch5Button.TYPES, value);
  }
  public get type(): TCh5ButtonType | null {
    return this.getAttribute("type") as TCh5ButtonType | null;
  }

  public set customClass(value: string) {
    this.info('set customClass("' + value + '")');
    this.validateAndSetAttributeWithStringType("customclass", value);
  }
  public get customClass(): string {
    return this.getAttribute("customclass") as string;
  }

  public set customStyle(value: string) {
    this.info('set customStyle("' + value + '")');
    this.validateAndSetAttributeWithStringType("customstyle", value);
  }
  public get customStyle(): string {
    return this.getAttribute("customstyle") as string;
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
    if (!(this._parentCh5Button instanceof Ch5Button)) {
      throw new Error(`Invalid parent element for ch5-button-mode.`);
    }
    this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonMode);

    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();
    this.logger.stop();
  }

  /**
   * Called every time the element is removed from the DOM.
   * Useful for running clean up code.
   */
  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', COMPONENT_NAME);
    this.logger.stop();
  }

  /**
   * Respond to attribute changes.
   */
  static get observedAttributes() {
    const commonAttributes = Ch5Log.observedAttributes;

    const ch5ButtonModeChildAttributes: string[] = [
      'type',
      'iconclass',
      'halignlabel',
      'valignlabel',
      'checkboxposition',
      'iconposition',
      'iconurl',
      'customclass',
      'customstyle'
    ];

    return commonAttributes.concat(ch5ButtonModeChildAttributes);
  }

  /**
   * Called when an HTML attribute is changed, added or removed
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    this.logger.start("attributeChangedCallback", COMPONENT_NAME);
    if (oldValue !== newValue) {

      this.info('Ch5ButtonMode.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

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

        case 'customclass':
          if (this.hasAttribute('customclass')) {
            this.customClass = newValue as string;
          }
          break;

        case 'customstyle':
          if (this.hasAttribute('customstyle')) {
            this.customStyle = newValue as string;
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

        default:
          super.attributeChangedCallback(attr, oldValue, newValue);
          break;
      }
    }
    this.logger.stop();
  }

  //#endregion

  //#region 3. Other Methods

  private validateAndSetAttributeWithCustomType(attributeName: string, parentMasterData: any, value: any) {
    if (value !== null) {
      if (parentMasterData.indexOf(value) >= 0) {
        this.setAttribute(attributeName, value);
        this._parentCh5Button.setButtonDisplay(this);
      } else {
        this.removeAttribute(attributeName);
        // parentElement.changeAttributesOnModeChange(this); is not required here. The set type will be called again to 
        // go the below else block and the  is called
      }
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5Button.setButtonDisplay(this);
    }
  }

  private validateAndSetAttributeWithStringType(attributeName: string, value: any) {
    if (value !== null) {
      this.setAttribute(attributeName, value);
      this._parentCh5Button.setButtonDisplay(this);
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5Button.setButtonDisplay(this);
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
  window.customElements.define('ch5-button-mode', Ch5ButtonMode);
}

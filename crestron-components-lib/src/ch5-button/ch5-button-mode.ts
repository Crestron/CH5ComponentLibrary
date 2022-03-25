// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonModeAttributes, TCh5ButtonCheckboxPosition, TCh5ButtonHorizontalAlignLabel, TCh5ButtonIconPosition, TCh5ButtonType, TCh5ButtonVerticalAlignLabel } from "./interfaces";
import { Ch5Button } from "./ch5-button";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Log } from "../ch5-common/ch5-log";
import _ from "lodash";

const COMPONENT_NAME: string = "ch5-button-mode";

export class Ch5ButtonMode extends Ch5Log implements ICh5ButtonModeAttributes {

  private _parentCh5Button: Ch5Button;

  //#region 1. Setters and Getters

  public set labelInnerHTML(value: string) {
    const attributeName: string = "labelInnerHTML";
    this.logger.start('set ' + attributeName + '("' + value + '")');
    if (value !== null) {
      this.setAttribute(attributeName.toLowerCase(), value);
    } else {
      this.removeAttribute(attributeName);
    }
    this._parentCh5Button.createButtonLabel(this);
    this._parentCh5Button.setButtonDisplay();
    this.logger.stop();
  }
  public get labelInnerHTML(): string {
    return this.getAttribute("labelinnerhtml") as string;
  }

  public set iconClass(value: string) {
    this.validateAndSetAttributeWithStringType("iconClass", value);
  }
  public get iconClass(): string {
    return this.getAttribute("iconclass") as string;
  }

  public set hAlignLabel(value: TCh5ButtonHorizontalAlignLabel | null) {
    this.validateAndSetAttributeWithCustomType("hAlignLabel", Ch5Button.HORIZONTAL_LABEL_ALIGNMENTS, value);
  }
  public get hAlignLabel(): TCh5ButtonHorizontalAlignLabel | null {
    return this.getAttribute("halignlabel") as TCh5ButtonHorizontalAlignLabel | null;
  }

  public set vAlignLabel(value: TCh5ButtonVerticalAlignLabel | null) {
    this.validateAndSetAttributeWithCustomType("vAlignLabel", Ch5Button.VERTICAL_LABEL_ALIGNMENTS, value);
  }
  public get vAlignLabel(): TCh5ButtonVerticalAlignLabel | null {
    return this.getAttribute("valignlabel") as TCh5ButtonVerticalAlignLabel | null;
  }

  public set checkboxPosition(value: TCh5ButtonCheckboxPosition | null) {
    this.validateAndSetAttributeWithCustomType("checkboxPosition", Ch5Button.CHECKBOX_POSITIONS, value);
  }
  public get checkboxPosition(): TCh5ButtonCheckboxPosition | null {
    return this.getAttribute("checkboxposition") as TCh5ButtonCheckboxPosition | null;
  }

  public set iconPosition(value: TCh5ButtonIconPosition | null) {
    this.validateAndSetAttributeWithCustomType("iconPosition", Ch5Button.ICON_POSITIONS, value);
  }
  public get iconPosition(): TCh5ButtonIconPosition | null {
    return this.getAttribute("iconposition") as TCh5ButtonIconPosition | null;
  }

  public set iconUrl(value: string) {
    this.validateAndSetAttributeWithStringType("iconUrl", value);
  }
  public get iconUrl(): string {
    return this.getAttribute("iconurl") as string;
  }

  public set type(value: TCh5ButtonType | null) {
    this.logger.log('set type("' + value + '")');
    this.validateAndSetAttributeWithCustomType("type", Ch5Button.TYPES, value);
  }
  public get type(): TCh5ButtonType | null {
    return this.getAttribute("type") as TCh5ButtonType | null;
  }

  public set customClass(value: string) {
    this.logger.log('set customClass("' + value + '")');
    this.validateAndSetAttributeWithStringType("customClass", value);
  }
  public get customClass(): string {
    return this.getAttribute("customclass") as string;
  }

  public set customStyle(value: string) {
    this.validateAndSetAttributeWithStringType("customStyle", value);
  }
  public get customStyle(): string {
    return this.getAttribute("customstyle") as string;
  }

  //#endregion

  //#region 2. Life Cycle Hooks

  constructor() {
    super();
    this.logger.start('constructor()');
    this._parentCh5Button = this.getParentButton();
    this.logger.stop();
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
      'customstyle',
      'labelinnerhtml'
    ];

    return commonAttributes.concat(ch5ButtonModeChildAttributes);
  }

  /**
   * Called when an HTML attribute is changed, added or removed
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    this.logger.start("attributeChangedCallback", COMPONENT_NAME);
    if (oldValue !== newValue) {

      this.logger.log('Ch5ButtonMode.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

      switch (attr) {
        case 'type':
          if (this.hasAttribute('type')) {
            this.type = newValue as TCh5ButtonType;
          } else {
            this.type = null;
          }
          break;

        case 'labelinnerhtml':
          if (this.hasAttribute('labelinnerhtml')) {
            this.labelInnerHTML = newValue as string;
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
        this.setAttribute(attributeName.toLowerCase(), value);
        this._parentCh5Button.setButtonDisplay();
      } else {
        this.removeAttribute(attributeName);
        // parentElement.setButtonDisplay(); is not required here.
      }
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5Button.setButtonDisplay();
    }
  }

  private validateAndSetAttributeWithStringType(attributeName: string, value: any) {
    if (value !== null) {
      this.setAttribute(attributeName.toLowerCase(), value);
    } else {
      this.removeAttribute(attributeName);
    }
    this._parentCh5Button.setButtonDisplay();
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

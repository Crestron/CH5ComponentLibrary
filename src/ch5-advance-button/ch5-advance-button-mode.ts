// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5AdvanceButtonModeAttributes, TCh5AdvanceButtonCheckboxPosition, TCh5AdvanceButtonHorizontalAlignLabel, TCh5AdvanceButtonIconPosition, TCh5AdvanceButtonIconUrlFillType, TCh5AdvanceButtonType, TCh5AdvanceButtonVerticalAlignLabel } from "./interfaces";
import { Ch5AdvanceButton } from "./ch5-advance-button";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Log } from "../ch5-common/ch5-log";
import _ from "lodash";

const COMPONENT_NAME: string = "ch5-advance-button-mode";

export class Ch5AdvanceButtonMode extends Ch5Log implements ICh5AdvanceButtonModeAttributes {

  public static readonly ELEMENT_NAME: string = 'ch5-advance-button-mode';

  private _parentCh5AdvanceButton: Ch5AdvanceButton;

  //#region 1. Setters and Getters

  public set labelInnerHTML(value: string) {
    const attributeName: string = "labelInnerHTML";
    this.logger.start('set ' + attributeName + '("' + value + '")');
    if (value !== null) {
      this.setAttribute(attributeName.toLowerCase(), value);
    } else {
      this.removeAttribute(attributeName);
    }
    this._parentCh5AdvanceButton.createButtonLabel(this);
    this._parentCh5AdvanceButton.setButtonDisplay();
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

  public set hAlignLabel(value: TCh5AdvanceButtonHorizontalAlignLabel | null) {
    this.validateAndSetAttributeWithCustomType("hAlignLabel", Ch5AdvanceButton.HORIZONTAL_LABEL_ALIGNMENTS, value);
  }
  public get hAlignLabel(): TCh5AdvanceButtonHorizontalAlignLabel | null {
    return this.getAttribute("halignlabel") as TCh5AdvanceButtonHorizontalAlignLabel | null;
  }

  public set vAlignLabel(value: TCh5AdvanceButtonVerticalAlignLabel | null) {
    this.validateAndSetAttributeWithCustomType("vAlignLabel", Ch5AdvanceButton.VERTICAL_LABEL_ALIGNMENTS, value);
  }
  public get vAlignLabel(): TCh5AdvanceButtonVerticalAlignLabel | null {
    return this.getAttribute("valignlabel") as TCh5AdvanceButtonVerticalAlignLabel | null;
  }

  public set checkboxPosition(value: TCh5AdvanceButtonCheckboxPosition | null) {
    this.validateAndSetAttributeWithCustomType("checkboxPosition", Ch5AdvanceButton.CHECKBOX_POSITIONS, value);
  }
  public get checkboxPosition(): TCh5AdvanceButtonCheckboxPosition | null {
    return this.getAttribute("checkboxposition") as TCh5AdvanceButtonCheckboxPosition | null;
  }

  public set iconPosition(value: TCh5AdvanceButtonIconPosition | null) {
    this.validateAndSetAttributeWithCustomType("iconPosition", Ch5AdvanceButton.ICON_POSITIONS, value);
  }
  public get iconPosition(): TCh5AdvanceButtonIconPosition | null {
    return this.getAttribute("iconposition") as TCh5AdvanceButtonIconPosition | null;
  }

  public set iconUrl(value: string) {
    this.validateAndSetAttributeWithStringType("iconUrl", value);
  }
  public get iconUrl(): string {
    return this.getAttribute("iconurl") as string;
  }

  public set type(value: TCh5AdvanceButtonType | null) {
    this.logger.log('set type("' + value + '")');
    this.validateAndSetAttributeWithCustomType("type", Ch5AdvanceButton.TYPES, value);
  }
  public get type(): TCh5AdvanceButtonType | null {
    return this.getAttribute("type") as TCh5AdvanceButtonType | null;
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

  public set iconUrlFillType(value: TCh5AdvanceButtonIconUrlFillType | null) {
      this.validateAndSetAttributeWithCustomType("iconUrlFillType", Ch5AdvanceButton.ICON_URL_FILL_TYPE, value);
  }
  public get iconUrlFillType(): TCh5AdvanceButtonIconUrlFillType | null {
    return this.getAttribute("iconurlfilltype") as TCh5AdvanceButtonIconUrlFillType | null;
  }

  //#endregion

  //#region 2. Life Cycle Hooks

  constructor(public parentButton?: Ch5AdvanceButton) {
    super();
    this.logger.start('constructor()');
    if (!_.isNil(parentButton)) {
      this._parentCh5AdvanceButton = parentButton;
    } else {
      this._parentCh5AdvanceButton = this.getParentButton();
    }
    this.logger.stop();
  }

  /**
   * 	Called every time the element is inserted into the DOM.
   *  Useful for running setup code, such as fetching resources or rendering.
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', COMPONENT_NAME);
    if (!(this._parentCh5AdvanceButton instanceof Ch5AdvanceButton)) {
      throw new Error(`Invalid parent element for ch5-advance-button-mode.`);
    }
    this.setAttribute('role', Ch5RoleAttributeMapping.ch5AdvanceButtonMode);

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

    const ch5AdvanceButtonModeChildAttributes: string[] = [
      'type',
      'iconclass',
      'halignlabel',
      'valignlabel',
      'checkboxposition',
      'iconposition',
      'iconurl',
      'customclass',
      'customstyle',
      'labelinnerhtml',
      'iconurlfilltype'
    ];

    return commonAttributes.concat(ch5AdvanceButtonModeChildAttributes);
  }

  /**
   * Called when an HTML attribute is changed, added or removed
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    this.logger.start("attributeChangedCallback", COMPONENT_NAME);
    if (oldValue !== newValue) {

      this.logger.log('Ch5AdvanceButtonMode.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

      switch (attr) {
        case 'type':
          if (this.hasAttribute('type')) {
            this.type = newValue as TCh5AdvanceButtonType;
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
            this.hAlignLabel = newValue as TCh5AdvanceButtonHorizontalAlignLabel;
          } else {
            this.hAlignLabel = null;
          }
          break;

        case 'valignlabel':
          if (this.hasAttribute('valignlabel')) {
            this.vAlignLabel = newValue as TCh5AdvanceButtonVerticalAlignLabel;
          } else {
            this.vAlignLabel = null;
          }
          break;

        case 'checkboxposition':
          if (this.hasAttribute('checkboxposition')) {
            this.checkboxPosition = newValue as TCh5AdvanceButtonCheckboxPosition;
          }
          break;

        case 'iconposition':
          if (this.hasAttribute('iconposition')) {
            this.iconPosition = newValue as TCh5AdvanceButtonIconPosition;
          }
          break;

        case 'iconurl':
          if (this.hasAttribute('iconurl')) {
            this.iconUrl = newValue as string;
          }
          break;

        case 'iconurlfilltype':
          if (this.hasAttribute('iconurlfilltype')) {
            this.iconUrlFillType = newValue as TCh5AdvanceButtonIconUrlFillType;
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
        this._parentCh5AdvanceButton.setButtonDisplay();
      } else {
        this.removeAttribute(attributeName);
        // parentElement.setButtonDisplay(); is not required here.
      }
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5AdvanceButton.setButtonDisplay();
    }
  }

  private validateAndSetAttributeWithStringType(attributeName: string, value: any) {
    if (value !== null) {
      this.setAttribute(attributeName.toLowerCase(), value);
    } else {
      this.removeAttribute(attributeName);
    }
    this._parentCh5AdvanceButton.setButtonDisplay();
  }

  public getParentButton(): Ch5AdvanceButton {
    const getTheMatchingParent = (node: Node): Ch5AdvanceButton => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-ADVANCE-BUTTON") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5AdvanceButton;
    }
    return getTheMatchingParent(this.parentElement as Node);
  }

  //#endregion

}

if (typeof window === "object" &&
  typeof window.customElements === "object" &&
  typeof window.customElements.define === "function") {
  window.customElements.define(Ch5AdvanceButtonMode.ELEMENT_NAME, Ch5AdvanceButtonMode);
}

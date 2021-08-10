// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonModeStateAttributes, TCh5ButtonCheckboxPosition, TCh5ButtonHorizontalAlignLabel, TCh5ButtonIconPosition, TCh5ButtonModeState, TCh5ButtonType, TCh5ButtonVerticalAlignLabel } from "./interfaces";
import { Ch5Button } from "./ch5-button";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5ButtonMode } from "./ch5-button-mode";
import { Ch5Log } from "../ch5-common/ch5-log";
import _ from "lodash";

const COMPONENT_NAME: string = "ch5-button-mode-state";

export class Ch5ButtonModeState extends Ch5Log implements ICh5ButtonModeStateAttributes {

  //#region 1. Variables

  private static readonly STATES: TCh5ButtonModeState[] = ["normal", "pressed", "selected"];
  private _state: TCh5ButtonModeState = "normal";
  private _parentCh5Button: Ch5Button;

  //#endregion

  //#region 2. Setters and Getters

  public set state(value: TCh5ButtonModeState) {
    this.logger.log('set state("' + value + '")');
    if (this._state !== value) {
      if (Ch5ButtonModeState.STATES.indexOf(value) >= 0) {
        this._state = value;
      } else {
        this._state = Ch5ButtonModeState.STATES[0];
      }
      this.setAttribute("state", this._state);
      this._parentCh5Button.setButtonDisplay();
    }
  }
  public get state(): TCh5ButtonModeState {
    return this._state
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
    this.validateAndSetAttributeWithCustomType("type", Ch5Button.TYPES, value);
  }
  public get type(): TCh5ButtonType | null {
    return this.getAttribute("type") as TCh5ButtonType | null;
  }

  public set customClass(value: string) {
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

  //#region 3. Life Cycle Hooks

  constructor() {
    super();
    this.logger.start('constructor');
    this._parentCh5Button = this.getParentButton();
    this.logger.stop();
  }

  /**
   * 	Called every time the element is inserted into the DOM.
   *  Useful for running setup code, such as fetching resources or rendering.
   */
  public connectedCallback() {
    this.logger.start('connectedCallback');

    if (!(this.parentElement instanceof Ch5ButtonMode)) {
      throw new Error(`Invalid parent element for ch5-button-mode-state.`);
    }
    if (_.isNil(this._parentCh5Button)) {
      throw new Error(`Missing parent ch5-button element for ch5-button-mode-state.`);
    }

    this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonModeState);

    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();
    this.logger.stop();
  }

  /**
   * Called every time the element is removed from the DOM.
   * Useful for running clean up code.
   */
  public disconnectedCallback() {
    this.logger.start('disconnectedCallback');
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
      'state',
      'customclass',
      'customstyle'
    ];

    return commonAttributes.concat(ch5ButtonModeChildAttributes);
  }

  /**
   * Called when an HTML attribute is changed, added or removed
   */
  public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
    this.logger.start("attributeChangedCallback");
    if (oldValue !== newValue) {

      this.logger.log('Ch5ButtonModeState.attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

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

        case 'state':
          if (this.hasAttribute('state')) {
            this.state = newValue as TCh5ButtonModeState;
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

  //#region 4. Other Methods

  private validateAndSetAttributeWithCustomType<T>(attributeName: string, parentMasterData: T[], value: T | null, removeAttribute: boolean = true) {
    this.logger.start('set ' + attributeName + '("' + value + '")');
    if (value !== null) {
      if (parentMasterData.indexOf(value) >= 0) {
        this.setAttribute(attributeName.toLowerCase(), String(value));
        this._parentCh5Button.setButtonDisplay();
      } else {
        if (removeAttribute === true) {
          this.removeAttribute(attributeName);
          // parentElement.setButtonDisplay(); is not required here. The set type will be called again to 
          // go the below else block and the  is called
        } else {
          this.setAttribute(attributeName.toLowerCase(), String(parentMasterData[0]));
          this._parentCh5Button.setButtonDisplay();
        }
      }
    } else {
      if (removeAttribute === true) {
        this.removeAttribute(attributeName);
        this._parentCh5Button.setButtonDisplay();
      } else {
        this.setAttribute(attributeName.toLowerCase(), String(parentMasterData[0]));
        this._parentCh5Button.setButtonDisplay();
      }
    }
    this.logger.stop();
  }

  private validateAndSetAttributeWithStringType(attributeName: string, value: any) {
    this.logger.start('set ' + attributeName + '("' + value + '")');
    if (value !== null) {
      this.setAttribute(attributeName.toLowerCase(), value);
      this._parentCh5Button.setButtonDisplay();
    } else {
      this.removeAttribute(attributeName);
      this._parentCh5Button.setButtonDisplay();
    }
    this.logger.stop();
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

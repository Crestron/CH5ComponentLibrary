import _ from "lodash";
import { Ch5ButtonListModeBase } from "./base-classes/ch5-button-list-mode-base";
import { Ch5ButtonList } from "./ch5-button-list";

export class Ch5ButtonListMode extends Ch5ButtonListModeBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-button-list-mode';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ButtonListMode.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonListMode.ELEMENT_NAME, Ch5ButtonListMode);
    }
  }

  //#endregion

  /**
   * Called when the Ch5ButtonListModeBase component is first connected to the DOM
   */
  public connectedCallback() {
    const _parentCh5ButtonList = this.getParentButton();

    if (!(this.parentElement instanceof Ch5ButtonList)) {
      throw new Error(`Invalid parent element for ch5-button-list-mode.`);
    }

    if (_.isNil(_parentCh5ButtonList)) {
      throw new Error(`Invalid parent element for ${this.nodeName}.`);
    }
    super.connectedCallback();
    this.parentComponent = _parentCh5ButtonList;
  }

  public getParentButton(): Ch5ButtonList {
    const getTheMatchingParent = (node: Node): Ch5ButtonList => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-BUTTON-LIST") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5ButtonList;
    }
    return getTheMatchingParent(this.parentElement as Node);
  }

}

Ch5ButtonListMode.registerCustomElement();

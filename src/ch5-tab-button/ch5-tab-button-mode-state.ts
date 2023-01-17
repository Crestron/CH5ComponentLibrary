import _ from "lodash";
import { Ch5ButtonListModeStateBase } from "./../ch5-button-list/base-classes/ch5-button-list-mode-state-base";
import { Ch5TabButton } from "./ch5-tab-button";

export class Ch5TabButtonModeState extends Ch5ButtonListModeStateBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-tab-button-mode-state';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TabButtonModeState.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TabButtonModeState.ELEMENT_NAME, Ch5TabButtonModeState);
    }
  }

  //#endregion

  /**
   * Called when the Ch5ButtonListModeBase component is first connected to the DOM
   */
  public connectedCallback() {
    const _parentCh5TabButton = this.getParentButton();
    if (_.isNil(_parentCh5TabButton)) {
      throw new Error(`Invalid parent element for ${this.nodeName}.`);
    }
    super.connectedCallback();
    this.parentComponent = _parentCh5TabButton;
  }

  public getParentButton(): Ch5TabButton {
    const getTheMatchingParent = (node: Node): Ch5TabButton => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-TAB-BUTTON") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5TabButton;
    }
    return getTheMatchingParent(this.parentElement as Node);
  }

}

Ch5TabButtonModeState.registerCustomElement();

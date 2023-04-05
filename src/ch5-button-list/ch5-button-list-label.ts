import { Ch5ButtonListLabelBase } from "./base-classes/ch5-button-list-label-base";
import { Ch5ButtonList } from "./ch5-button-list";
import { Ch5ButtonListMode } from "./ch5-button-list-mode";
import { Ch5ButtonListModeState } from "./ch5-button-list-mode-state";

export class Ch5ButtonListLabel extends Ch5ButtonListLabelBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-button-list-label';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ButtonListLabel.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonListLabel.ELEMENT_NAME, Ch5ButtonListLabel);
    }
  }

  //#endregion

  /**
   * Called when the Ch5ButtonListLabel component is first connected to the DOM
   */
  public connectedCallback() {
    if (!(this.parentElement instanceof Ch5ButtonList || this.parentElement instanceof Ch5ButtonListMode || this.parentElement instanceof Ch5ButtonListModeState)) {
      throw new Error(`Invalid parent element for ${Ch5ButtonListLabel.ELEMENT_NAME}.`);
    }
    super.connectedCallback();
  }

}

Ch5ButtonListLabel.registerCustomElement();

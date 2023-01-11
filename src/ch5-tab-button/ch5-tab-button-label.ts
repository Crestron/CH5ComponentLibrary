import { Ch5ButtonListLabelBase } from "./../ch5-button-list/base-classes/ch5-button-list-label-base";
import { Ch5TabButton } from "./ch5-tab-button";
import { Ch5TabButtonMode } from "./ch5-tab-button-mode";
import { Ch5TabButtonModeState } from "./ch5-tab-button-mode-state";

export class Ch5TabButtonLabel extends Ch5ButtonListLabelBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-tab-button-label';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TabButtonLabel.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TabButtonLabel.ELEMENT_NAME, Ch5TabButtonLabel);
    }
  }

  //#endregion


  public connectedCallback() {
    if (!(this.parentElement instanceof Ch5TabButton || this.parentElement instanceof Ch5TabButtonMode || this.parentElement instanceof Ch5TabButtonModeState)) {
      throw new Error(`Invalid parent element for ${Ch5TabButtonLabel.ELEMENT_NAME}.`);
    }
    super.connectedCallback();
  }

}

Ch5TabButtonLabel.registerCustomElement();

import { Ch5ButtonListLabelBase } from "./base-classes/ch5-button-list-label-base";

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

}

Ch5ButtonListLabel.registerCustomElement();

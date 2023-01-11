import { Ch5ButtonListLabelBase } from "./../ch5-button-list/base-classes/ch5-button-list-label-base";

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

}

Ch5TabButtonLabel.registerCustomElement();

import _ from "lodash";
import { Ch5ButtonListModeBase } from "./base-classes/ch5-button-list-mode-base";

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

}

Ch5ButtonListMode.registerCustomElement();

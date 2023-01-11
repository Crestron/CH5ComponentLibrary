import _ from "lodash";
import { Ch5ButtonListModeBase } from "./../ch5-button-list/base-classes/ch5-button-list-mode-base";

export class Ch5TabButtonMode extends Ch5ButtonListModeBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-tab-button-mode';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TabButtonMode.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TabButtonMode.ELEMENT_NAME, Ch5TabButtonMode);
    }
  }

  //#endregion

}

Ch5TabButtonMode.registerCustomElement();

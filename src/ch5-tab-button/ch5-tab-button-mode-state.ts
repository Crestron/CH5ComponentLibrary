import _ from "lodash";
import { Ch5ButtonListModeStateBase } from "./../ch5-button-list/base-classes/ch5-button-list-mode-state-base";

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

}

Ch5TabButtonModeState.registerCustomElement();

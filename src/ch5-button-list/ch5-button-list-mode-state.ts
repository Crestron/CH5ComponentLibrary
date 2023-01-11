import _ from "lodash";
import { Ch5ButtonListModeStateBase } from "./base-classes/ch5-button-list-mode-state-base";

export class Ch5ButtonListModeState extends Ch5ButtonListModeStateBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-button-list-mode-state';

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ButtonListModeState.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonListModeState.ELEMENT_NAME, Ch5ButtonListModeState);
    }
  }

  //#endregion

}

Ch5ButtonListModeState.registerCustomElement();

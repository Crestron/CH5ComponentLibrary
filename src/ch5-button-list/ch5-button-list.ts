import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5ButtonListBase } from "./ch5-button-list-base";

export class Ch5ButtonList extends Ch5ButtonListBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-button-list';
  public cssClassPrefix = 'ch5-button-list';
  public primaryCssClass = 'ch5-button-list';

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ButtonList.ELEMENT_NAME, Ch5ButtonList.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ButtonList.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonList.ELEMENT_NAME, Ch5ButtonList);
    }
  }

  //#endregion

}

Ch5ButtonList.registerCustomElement();
Ch5ButtonList.registerSignalAttributeTypes();

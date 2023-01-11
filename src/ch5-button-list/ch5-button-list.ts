import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5GenericListAttributes } from "../ch5-generic-list-attributes/ch5-generic-list-attributes";
import { Ch5ButtonListBase } from "./base-classes/ch5-button-list-base";

export class Ch5ButtonList extends Ch5ButtonListBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-button-list';

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5GenericListAttributes.SIGNAL_ATTRIBUTE_TYPES,
  };

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ButtonList.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonList.ELEMENT_NAME, Ch5ButtonList);
    }
  }

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ButtonList.ELEMENT_NAME, Ch5ButtonList.SIGNAL_ATTRIBUTE_TYPES);
  }

  //#endregion

  constructor() {
    super();
    this.primaryCssClass = Ch5ButtonList.ELEMENT_NAME;
    this.cssClassPrefix = Ch5ButtonList.ELEMENT_NAME;
  }
}

Ch5ButtonList.registerCustomElement();

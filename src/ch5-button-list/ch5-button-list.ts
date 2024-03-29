import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5ButtonListBase } from "./base-classes/ch5-button-list-base";

export class Ch5ButtonList extends Ch5ButtonListBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-button-list';

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5ButtonListBase.SIGNAL_ATTRIBUTE_TYPES,
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

  //#region Component Lifecycle

  constructor() {
    super();
    this.primaryCssClass = Ch5ButtonList.ELEMENT_NAME;
    // this.componentStructure = {
    //   key: Ch5ButtonList.ELEMENT_NAME,
    //   children: [
    //     {
    //       key: "ch5-button-list-individual-button",
    //       children: []
    //     },
    //     {
    //       key: "ch5-button-list-label",
    //       children: []
    //     },
    //     {
    //       key: "ch5-button-list-mode",
    //       children: [
    //         {
    //           key: "ch5-button-list-mode-state",
    //           children: [{
    //             key: "ch5-button-list-label",
    //             children: []
    //           }]
    //         },
    //         {
    //           key: "ch5-button-list-label",
    //           children: []
    //         }
    //       ]
    //     }
    //   ]
    // };
  }
}

Ch5ButtonList.registerCustomElement();
Ch5ButtonList.registerSignalAttributeTypes();

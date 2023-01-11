import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5ButtonListBase } from "../ch5-button-list/base-classes/ch5-button-list-base";

export class Ch5TabButton extends Ch5ButtonListBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-tab-button';

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5TabButton.ELEMENT_NAME, Ch5TabButton.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TabButton.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TabButton.ELEMENT_NAME, Ch5TabButton);
    }
  }

  //#endregion

  //#region Component Lifecycle

  constructor() {
    super();
    this.primaryCssClass = Ch5TabButton.ELEMENT_NAME;
  }

  public connectedCallback() {
    super.connectedCallback();

    // preset attributes
    this.scrollbar = false;
    this.endless = false;
  }

  public static get observedAttributes() {
    const availableAttributes: string[] = super.observedAttributes;
    // Remove attributes that should not follow changes to DOM
    availableAttributes.splice(availableAttributes.indexOf("scrollbar"), 1);
    availableAttributes.splice(availableAttributes.indexOf("endless"), 1);
    return availableAttributes;
  }

  //#endregion

  //#region Protected / Private Methods

  //#endregion

}

Ch5TabButton.registerCustomElement();
Ch5TabButton.registerSignalAttributeTypes();




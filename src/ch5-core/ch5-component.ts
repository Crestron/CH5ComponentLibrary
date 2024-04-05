import { Ch5Base } from "../ch5-base/ch5-base";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";

export type CustomConstructor<T> = { new (): T }

export class Ch5ComponentLibrary {

  // public static registerComponent1(elementName: string, entries: Ch5SignalElementAttributeRegistryEntries, constructor: CustomElementConstructor) {
  //   Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(elementName, entries);
  //   if (typeof window === "object"
  //     && typeof window.customElements === "object"
  //     && typeof window.customElements.define === "function"
  //     && window.customElements.get(elementName) === undefined) {
  //     window.customElements.define(elementName, constructor);
  //   }
  // }

  public static registerComponent(customComponent: typeof Ch5Base)  {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(customComponent.ELEMENT_NAME, customComponent.getSignalElementAttributeRegistryEntries(customComponent.COMPONENT_PROPERTIES));
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(customComponent.ELEMENT_NAME) === undefined) {
      window.customElements.define(customComponent.ELEMENT_NAME, customComponent as any);
    }
  }

}
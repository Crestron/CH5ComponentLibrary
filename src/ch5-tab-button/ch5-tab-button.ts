import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5ButtonListBase } from "../ch5-button-list/base-classes/ch5-button-list-base";
import { Ch5GenericListAttributes } from "../ch5-generic-list-attributes/ch5-generic-list-attributes";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
export class Ch5TabButton extends Ch5ButtonListBase {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-tab-button';

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5GenericListAttributes.SIGNAL_ATTRIBUTE_TYPES,
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: 3,
      name: "numberOfItems",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateNumberOfItems",
      type: "number",
      valueOnAttributeEmpty: 3,
      numberProperties: {
        min: 2,
        max: 15,
        conditionalMin: 2,
        conditionalMax: 15,
        conditionalMinValue: 2,
        conditionalMaxValue: 15
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateNumberOfItems",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    }
  ];

  private _ch5PropertiesTabButton: Ch5Properties;

  //#endregion

  //#region Getters and Setters

  public set numberOfItems(value: number) {
    this._ch5PropertiesTabButton.set<number>("numberOfItems", value, () => {
      super.handleRowsAndColumn();
    });
  }
  public get numberOfItems(): number {
    return this._ch5PropertiesTabButton.get<number>("numberOfItems");
  }

  public set receiveStateNumberOfItems(value: string) {
    this._ch5PropertiesTabButton.set("receiveStateNumberOfItems", value, null, (newValue: number) => {
      this._ch5PropertiesTabButton.setForSignalResponse<number>("numberOfItems", newValue, () => {
        super.handleRowsAndColumn();
      });
    });
  }
  public get receiveStateNumberOfItems(): string {
    return this._ch5PropertiesTabButton.get<string>('receiveStateNumberOfItems');
  }

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TabButton.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TabButton.ELEMENT_NAME, Ch5TabButton);
    }
  }

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5TabButton.ELEMENT_NAME, Ch5TabButton.SIGNAL_ATTRIBUTE_TYPES);
  }

  //#endregion

  //#region Component Lifecycle

  constructor() {
    super();
    this.primaryCssClass = Ch5TabButton.ELEMENT_NAME;
    this._ch5PropertiesTabButton = new Ch5Properties(this, Ch5TabButton.COMPONENT_PROPERTIES);
  }

  public connectedCallback() {
    super.connectedCallback();

    // preset attributes
    this.scrollbar = false;
    this.endless = false;
    this.scrollToPosition = 0;
    this.receiveStateScrollToPosition = "";
    this.rows = 1;
    this.columns = 1;
    this.stretch = "both";
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




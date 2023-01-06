import { Ch5Common } from "../ch5-common/ch5-common";
import { TCh5GenericListAttributesOrientation } from './interfaces/t-ch5-generic-list-attributes';
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5GenericListAttributesAttributes } from './interfaces/i-ch5-generic-list-attributes-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export abstract class Ch5GenericListAttributes extends Ch5Common implements ICh5GenericListAttributesAttributes {

  //#region Variables

  public static readonly ORIENTATION: TCh5GenericListAttributesOrientation[] = ['horizontal', 'vertical'];
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receiveStateNumberOfItems: { direction: "state", numericJoin: 1, contractName: true },
  };
  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5GenericListAttributes.ORIENTATION[0],
      enumeratedValues: Ch5GenericListAttributes.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5GenericListAttributes.ORIENTATION[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "scrollbar",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "centerItems",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "endless",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: 1,
      name: "rows",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
      numberProperties: {
        min: 1,
        max: 500,
        conditionalMin: 1,
        conditionalMax: 500,
        conditionalMinValue: 1,
        conditionalMaxValue: 500
      },
      isObservableProperty: true
    },
    {
      default: 1,
      name: "columns",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
      numberProperties: {
        min: 1,
        max: 500,
        conditionalMin: 1,
        conditionalMax: 500,
        conditionalMinValue: 1,
        conditionalMaxValue: 500
      },
      isObservableProperty: true
    },
    {
      default: "",
      name: "indexId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: 10,
      name: "numberOfItems",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateNumberOfItems",
      type: "number",
      valueOnAttributeEmpty: 10,
      numberProperties: {
        min: 1,
        max: 500,
        conditionalMin: 1,
        conditionalMax: 500,
        conditionalMinValue: 1,
        conditionalMaxValue: 500
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

  private _ch5PropertiesBase: Ch5Properties;

  //#endregion

  //#region Getters and Setters

  public set orientation(value: TCh5GenericListAttributesOrientation) {
    this._ch5PropertiesBase.set<TCh5GenericListAttributesOrientation>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5GenericListAttributesOrientation {
    return this._ch5PropertiesBase.get<TCh5GenericListAttributesOrientation>("orientation");
  }

  public set scrollbar(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("scrollbar", value, () => {
      this.handleScrollbar();
    });
  }
  public get scrollbar(): boolean {
    return this._ch5PropertiesBase.get<boolean>("scrollbar");
  }

  public set centerItems(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("centerItems", value, () => {
      this.handleCenterItems();
    });
  }
  public get centerItems(): boolean {
    return this._ch5PropertiesBase.get<boolean>("centerItems");
  }

  public set endless(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("endless", value, () => {
      this.handleEndless();
    });
  }
  public get endless(): boolean {
    return this._ch5PropertiesBase.get<boolean>("endless");
  }

  public set numberOfItems(value: number) {
    this._ch5PropertiesBase.set<number>("numberOfItems", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get numberOfItems(): number {
    return +this._ch5PropertiesBase.get<number>("numberOfItems");
  }

  public set rows(value: number) {
    this._ch5PropertiesBase.set<number>("rows", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get rows(): number {
    return +this._ch5PropertiesBase.get<number>("rows");
  }

  public set columns(value: number) {
    this._ch5PropertiesBase.set<number>("columns", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get columns(): number {
    return +this._ch5PropertiesBase.get<number>("columns");
  }

  public set indexId(value: string) {
    this._ch5PropertiesBase.set<string>("indexId", value);
  }
  public get indexId(): string {
    return this._ch5PropertiesBase.get<string>("indexId");
  }

  public set receiveStateNumberOfItems(value: string) {
    this._ch5PropertiesBase.set("receiveStateNumberOfItems", value, null, (newValue: number) => {
      this._ch5PropertiesBase.setForSignalResponse<number>("numberOfItems", newValue, () => {
        this.handleRowsAndColumn();
      });
    });
  }
  public get receiveStateNumberOfItems(): string {
    return this._ch5PropertiesBase.get<string>('receiveStateNumberOfItems');
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ['receiveStateCustomClass', 'receiveStateCustomStyle', 'sendEventOnShow'];
    this._ch5PropertiesBase = new Ch5Properties(this, Ch5GenericListAttributes.COMPONENT_PROPERTIES);
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5GenericListAttributes.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5GenericListAttributes.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5GenericListAttributes.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-generic-list-attributes attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5GenericListAttributes.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
      if (attributeChangedProperty) {
        const thisRef: any = this;
        const key = attributeChangedProperty.name;
        thisRef[key] = newValue;
      } else {
        super.attributeChangedCallback(attr, oldValue, newValue);
      }
    }
    this.logger.stop();
  }

  /**
   * Called when the Ch5GenericListAttributes component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback() generic list attributes',);
    this.attachEventListeners();
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods
  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5GenericListAttributes.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5GenericListAttributes.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5GenericListAttributes.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5GenericListAttributes.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }


  abstract handleOrientation(): void;
  abstract handleScrollbar(): void;
  abstract handleCenterItems(): void;
  abstract handleEndless(): void;
  abstract handleRowsAndColumn(): void;

  //#endregion

}


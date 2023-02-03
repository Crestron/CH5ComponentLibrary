import { Ch5Common } from "../ch5-common/ch5-common";
import { TCh5GenericListAttributesOrientation, TCh5GenericListAttributesStretch, TCh5GenericListContractItemLabelType, TCh5GenericListContractItemIconType, TCh5GenericListContractNumItemsType, TCh5GenericListContractScrollToType } from './interfaces/t-ch5-generic-list-attributes';
import { Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5GenericListAttributesAttributes } from './interfaces/i-ch5-generic-list-attributes-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export abstract class Ch5GenericListAttributes extends Ch5Common implements ICh5GenericListAttributesAttributes {

  //#region Variables

  public static readonly ORIENTATION: TCh5GenericListAttributesOrientation[] = ['horizontal', 'vertical'];
  public static readonly STRETCH: TCh5GenericListAttributesStretch[] = ['both'];
  public static readonly CONTRACT_ITEM_LABEL_TYPE: TCh5GenericListContractItemLabelType[] = ['none', 'textContent', 'innerHTML'];
  public static readonly CONTRACT_ITEM_ICON_TYPE: TCh5GenericListContractItemIconType[] = ['none', 'iconClass', 'url', 'sgStateName', 'sgStateNumber'];
  public static readonly CONTRACT_NUM_ITEMS_TYPE: TCh5GenericListContractNumItemsType[] = ['absolute', 'visible', 'none'];
  public static readonly CONTRACT_SCROLL_TO_TYPE: TCh5GenericListContractScrollToType[] = ['absolute', 'visible'];
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receiveStateNumberOfItems: { direction: "state", numericJoin: 1, contractName: true },
    receiveStateScrollToPosition: { direction: "state", numericJoin: 1, contractName: true },
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
      default: null,
      enumeratedValues: Ch5GenericListAttributes.STRETCH,
      name: "stretch",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: null,
      isObservableProperty: true,
      isNullable: true,
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
    },
    {
      default: 0,
      name: "scrollToPosition",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateScrollToPosition",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 499,
        conditionalMin: 0,
        conditionalMax: 499,
        conditionalMinValue: 0,
        conditionalMaxValue: 499
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateScrollToPosition",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "contractName",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForEnable",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForItemEnable",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForItemShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForCustomStyle",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForCustomClass",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: Ch5GenericListAttributes.CONTRACT_ITEM_LABEL_TYPE[0],
      enumeratedValues: Ch5GenericListAttributes.CONTRACT_ITEM_LABEL_TYPE,
      name: "contractItemLabelType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5GenericListAttributes.CONTRACT_ITEM_LABEL_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5GenericListAttributes.CONTRACT_ITEM_ICON_TYPE[0],
      enumeratedValues: Ch5GenericListAttributes.CONTRACT_ITEM_ICON_TYPE,
      name: "contractItemIconType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5GenericListAttributes.CONTRACT_ITEM_ICON_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5GenericListAttributes.CONTRACT_NUM_ITEMS_TYPE[0],
      enumeratedValues: Ch5GenericListAttributes.CONTRACT_NUM_ITEMS_TYPE,
      name: "contractNumItemsType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5GenericListAttributes.CONTRACT_NUM_ITEMS_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5GenericListAttributes.CONTRACT_SCROLL_TO_TYPE[0],
      enumeratedValues: Ch5GenericListAttributes.CONTRACT_SCROLL_TO_TYPE,
      name: "contractScrollToType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5GenericListAttributes.CONTRACT_SCROLL_TO_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForNumItems",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
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

  public set stretch(value: TCh5GenericListAttributesStretch | null) {
    this._ch5PropertiesBase.set<TCh5GenericListAttributesStretch | null>("stretch", value, () => {
      this.handleStretch();
    });
  }
  public get stretch(): TCh5GenericListAttributesStretch | null {
    return this._ch5PropertiesBase.get<TCh5GenericListAttributesStretch | null>("stretch");
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
    return this._ch5PropertiesBase.get<number>("numberOfItems");
  }

  public set rows(value: number) {
    this._ch5PropertiesBase.set<number>("rows", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get rows(): number {
    return this._ch5PropertiesBase.get<number>("rows");
  }

  public set columns(value: number) {
    this._ch5PropertiesBase.set<number>("columns", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get columns(): number {
    return this._ch5PropertiesBase.get<number>("columns");
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

  public set scrollToPosition(value: number) {
    this._ch5PropertiesBase.set<number>("scrollToPosition", value, () => {
      this.debounceHandleScrollToPosition(this.scrollToPosition);
    });
  }
  public get scrollToPosition(): number {
    return this._ch5PropertiesBase.get<number>("scrollToPosition");
  }

  public set receiveStateScrollToPosition(value: string) {
    this._ch5PropertiesBase.set("receiveStateScrollToPosition", value, null, (newValue: number) => {
      this._ch5PropertiesBase.setForSignalResponse<number>("scrollToPosition", newValue, () => {
        this.debounceHandleScrollToPosition(newValue);
      });
    });
  }
  public get receiveStateScrollToPosition(): string {
    return this._ch5PropertiesBase.get<string>('receiveStateScrollToPosition');
  }

  public set contractName(value: string) {
    this._ch5PropertiesBase.set<string>("contractName", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractName(): string {
    return this._ch5PropertiesBase.get<string>("contractName");
  }

  public set useContractForEnable(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForEnable", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForShow");
  }

  public set useContractForItemEnable(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForItemEnable", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForItemEnable(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForItemEnable");
  }

  public set useContractForItemShow(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForItemShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForItemShow(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForItemShow");
  }

  public set useContractForCustomStyle(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForCustomStyle", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForCustomStyle(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForCustomStyle");
  }

  public set useContractForCustomClass(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForCustomClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForCustomClass(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForCustomClass");
  }

  public set contractItemLabelType(value: TCh5GenericListContractItemLabelType) {
    this._ch5PropertiesBase.set<TCh5GenericListContractItemLabelType>("contractItemLabelType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractItemLabelType(): TCh5GenericListContractItemLabelType {
    return this._ch5PropertiesBase.get<TCh5GenericListContractItemLabelType>("contractItemLabelType");
  }

  public set contractItemIconType(value: TCh5GenericListContractItemIconType) {
    this._ch5PropertiesBase.set<TCh5GenericListContractItemIconType>("contractItemIconType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractItemIconType(): TCh5GenericListContractItemIconType {
    return this._ch5PropertiesBase.get<TCh5GenericListContractItemIconType>("contractItemIconType");
  }

  public set contractNumItemsType(value: TCh5GenericListContractNumItemsType) {
    this._ch5PropertiesBase.set<TCh5GenericListContractNumItemsType>("contractNumItemsType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractNumItemsType(): TCh5GenericListContractNumItemsType {
    return this._ch5PropertiesBase.get<TCh5GenericListContractNumItemsType>("contractNumItemsType");
  }

  public set contractScrollToType(value: TCh5GenericListContractScrollToType) {
    this._ch5PropertiesBase.set<TCh5GenericListContractScrollToType>("contractScrollToType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractScrollToType(): TCh5GenericListContractScrollToType {
    return this._ch5PropertiesBase.get<TCh5GenericListContractScrollToType>("contractScrollToType");
  }

  public set useContractForNumItems(value: boolean) {
    this._ch5PropertiesBase.set<boolean>("useContractForNumItems", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForNumItems(): boolean {
    return this._ch5PropertiesBase.get<boolean>("useContractForNumItems");
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ['receivestatecustomclass', 'receivestatecustomstyle', 'sendeventonshow'];
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

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5PropertiesBase.unsubscribe();
  }


  abstract handleOrientation(): void;
  abstract handleScrollbar(): void;
  abstract handleCenterItems(): void;
  abstract handleEndless(): void;
  abstract handleRowsAndColumn(): void;
  abstract handleStretch(): void;
  abstract debounceHandleScrollToPosition(value: number): void;
  abstract debounceButtonDisplay(): void;

  //#endregion

}


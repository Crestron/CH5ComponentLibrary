import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SubpageReferenceListStretch, } from './interfaces/t-ch5-subpage-reference-list';
import { ICh5SubpageReferenceListAttributes } from './interfaces/i-ch5-subpage-reference-list-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5SubpageReferenceList extends Ch5Common implements ICh5SubpageReferenceListAttributes {

  //#region Variables

  public static readonly STRETCH: TCh5SubpageReferenceListStretch[] = ['null', 'both'];
  public static readonly COMPONENT_DATA: any = {
    STRETCH: {
      default: Ch5SubpageReferenceList.STRETCH[0],
      values: Ch5SubpageReferenceList.STRETCH,
      key: 'stretch',
      attribute: 'stretch',
      classListPrefix: 'ch5-subpage-reference-list--stretch-'
    },
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    booleanjoinoffset: { direction: "state", booleanJoin: 1, contractName: true },
    numericjoinoffset: { direction: "state", numericJoin: 1, contractName: true },
    stringjoinoffset: { direction: "state", stringJoin: 1, contractName: true },
    subpagereceivestateenable: { direction: "state", stringJoin: 1, contractName: true },
    subpagereceivestatevisible: { direction: "state", stringJoin: 1, contractName: true },
    subpagereceivestatescrollto: { direction: "state", numericJoin: 1, contractName: true },
    receivestatenumberofitems: { direction: "state", numericJoin: 1, contractName: true },

  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

    {
      default: "horizontal",
      name: "orientation",

      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "horizonatal",
      isObservableProperty: true,

    },
    {
      default: "",
      name: "controlJoinID",

      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,

    },
    {
      default: false,
      name: "endless",

      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true,

    },
    {
      default: false,
      name: "centerItems",

      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true,

    },
    {
      default: 1,
      name: "rows",
      removeAttributeOnNull: true,

      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 600,
        conditionalMin: 1,
        conditionalMax: 600,
        conditionalMinValue: 1,
        conditionalMaxValue: 600
      },

      isObservableProperty: true
    },
    {
      default: 1,
      name: "column",
      removeAttributeOnNull: true,

      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 600,
        conditionalMin: 1,
        conditionalMax: 600,
        conditionalMinValue: 1,
        conditionalMaxValue: 600
      },

      isObservableProperty: true
    },
    {
      default: false,
      name: "scrollBar",

      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true,

    },
    {
      default: "",
      isSignal: true,
      name: "booleanJoinOffset",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "numericJoinOffset",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "stringJoinOffset",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "subpageReceiveStateEnable",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "subpageReceiveStateVisible",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "subpage",

      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,

    },
    {
      default: "",
      isSignal: true,
      name: "subpageReceiveStateScrollTo",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",

      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: null,
      enumeratedValues: Ch5SubpageReferenceList.STRETCH,
      name: "stretch",

      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: null,
      isObservableProperty: true,

    },
    {
      default: 10,
      name: "numberOfItems",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateNumberOfItems",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 600,
        conditionalMin: 1,
        conditionalMax: 600,
        conditionalMinValue: 1,
        conditionalMaxValue: 600
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
      default: "",
      name: "indexId",

      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,

    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-subpage-reference-list';

  public cssClassPrefix = 'ch5-subpage-reference-list';
  public primaryCssClass = 'ch5-subpage-reference-list';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;

  //#endregion

  //#region Getters and Setters


  public set orientation(value: string) {
    this._ch5Properties.set<string>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): string {
    return this._ch5Properties.get<string>("orientation");
  }

  public set controlJoinID(value: string) {
    this._ch5Properties.set<string>("controlJoinID", value, () => {
      this.handleControlJoinID();
    });
  }
  public get controlJoinID(): string {
    return this._ch5Properties.get<string>("controlJoinID");
  }

  public set endless(value: boolean) {
    this._ch5Properties.set<boolean>("endless", value, () => {
      this.handleEndless();
    });
  }
  public get endless(): boolean {
    return this._ch5Properties.get<boolean>("endless");
  }

  public set centerItems(value: boolean) {
    this._ch5Properties.set<boolean>("centerItems", value, () => {
      this.handleCenterItems();
    });
  }
  public get centerItems(): boolean {
    return this._ch5Properties.get<boolean>("centerItems");
  }

  public set rows(value: number) {
    this._ch5Properties.set<number>("rows", value, () => {
      this.handleRows();
    });
  }
  public get rows(): number {
    return this._ch5Properties.get<number>("rows");
  }

  public set column(value: number) {
    this._ch5Properties.set<number>("column", value, () => {
      this.handleColumn();
    });
  }
  public get column(): number {
    return this._ch5Properties.get<number>("column");
  }

  public set scrollBar(value: boolean) {
    this._ch5Properties.set<boolean>("scrollBar", value, () => {
      this.handleScrollBar();
    });
  }
  public get scrollBar(): boolean {
    return this._ch5Properties.get<boolean>("scrollBar");
  }

  public set booleanJoinOffset(value: string) {
    this._ch5Properties.set("booleanJoinOffset", value, null, (newValue: boolean) => {
      this.handleBooleanJoinOffset();
    });
  }
  public get booleanJoinOffset(): string {
    return this._ch5Properties.get<string>('booleanJoinOffset');
  }

  public set numericJoinOffset(value: string) {
    this._ch5Properties.set("numericJoinOffset", value, null, (newValue: number) => {
      this.handleNumericJoinOffset();
    });
  }
  public get numericJoinOffset(): string {
    return this._ch5Properties.get<string>('numericJoinOffset');
  }

  public set stringJoinOffset(value: string) {
    this._ch5Properties.set("stringJoinOffset", value, null, (newValue: string) => {
      this.handleStringJoinOffset();
    });
  }
  public get stringJoinOffset(): string {
    return this._ch5Properties.get<string>('stringJoinOffset');
  }

  public set subpageReceiveStateEnable(value: string) {
    this._ch5Properties.set("subpageReceiveStateEnable", value, null, (newValue: string) => {
      this.handleSubpageReceiveStateEnable();
    });
  }
  public get subpageReceiveStateEnable(): string {
    return this._ch5Properties.get<string>('subpageReceiveStateEnable');
  }

  public set subpageReceiveStateVisible(value: string) {
    this._ch5Properties.set("subpageReceiveStateVisible", value, null, (newValue: string) => {
      this.handleSubpageReceiveStateVisible();
    });
  }
  public get subpageReceiveStateVisible(): string {
    return this._ch5Properties.get<string>('subpageReceiveStateVisible');
  }

  public set subpage(value: string) {
    this._ch5Properties.set<string>("subpage", value, () => {
      this.handleSubpage();
    });
  }
  public get subpage(): string {
    return this._ch5Properties.get<string>("subpage");
  }

  public set subpageReceiveStateScrollTo(value: string) {
    this._ch5Properties.set("subpageReceiveStateScrollTo", value, null, (newValue: number) => {
      this.handleSubpageReceiveStateScrollTo();
    });
  }
  public get subpageReceiveStateScrollTo(): string {
    return this._ch5Properties.get<string>('subpageReceiveStateScrollTo');
  }

  public set stretch(value: TCh5SubpageReferenceListStretch | null) {
    this._ch5Properties.set<TCh5SubpageReferenceListStretch | null>("stretch", value, () => {
      this.handleStretch();
    });
  }
  public get stretch(): TCh5SubpageReferenceListStretch | null {
    return this._ch5Properties.get<TCh5SubpageReferenceListStretch | null>("stretch");
  }

  public set numberOfItems(value: number) {
    this._ch5Properties.set<number>("numberOfItems", value, () => {
      this.handleNumberOfItems();
    });
  }
  public get numberOfItems(): number {
    return this._ch5Properties.get<number>("numberOfItems");
  }

  public set receiveStateNumberOfItems(value: string) {
    this._ch5Properties.set("receiveStateNumberOfItems", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("numberOfItems", newValue, () => {
        this.handleReceiveStateNumberOfItems();
      });
    });
  }
  public get receiveStateNumberOfItems(): string {
    return this._ch5Properties.get<string>('receiveStateNumberOfItems');
  }

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value, () => {
      this.handleIndexId();
    });
  }
  public get indexId(): string {
    return this._ch5Properties.get<string>("indexId");
  }


  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5SubpageReferenceList.ELEMENT_NAME, Ch5SubpageReferenceList.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5SubpageReferenceList.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5SubpageReferenceList.ELEMENT_NAME, Ch5SubpageReferenceList);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5SubpageReferenceList.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5SubpageReferenceList.COMPONENT_PROPERTIES);
    this.updateCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5SubpageReferenceList.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5SubpageReferenceList.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5SubpageReferenceList.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-subpage-reference-list attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5SubpageReferenceList.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5SubpageReferenceList component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5SubpageReferenceList.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      // this.setAttribute('role', Ch5RoleAttributeMapping.ch5SubpageReferenceList);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-subpage-reference-list');
      this.appendChild(this._elContainer);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-subpage-reference-list').then(() => {
      this.componentLoadedEvent(Ch5SubpageReferenceList.ELEMENT_NAME, this.id);
    });
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

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');

    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5SubpageReferenceList.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5SubpageReferenceList.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5SubpageReferenceList.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5SubpageReferenceList.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();

  }

  protected removeEventListeners() {
    super.removeEventListeners();

  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  /**
   * Clear the content of component in order to avoid duplication of elements
   */
  private clearComponentContent() {
    const containers = this.getElementsByTagName("div");
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }


  private handleOrientation() {
    // Enter your Code here
  }
  private handleControlJoinID() {
    // Enter your Code here
  }
  private handleEndless() {
    // Enter your Code here
  }
  private handleCenterItems() {
    // Enter your Code here
  }
  private handleRows() {
    // Enter your Code here
  }
  private handleColumn() {
    // Enter your Code here
  }
  private handleScrollBar() {
    // Enter your Code here
  }
  private handleBooleanJoinOffset() {
    // Enter your Code here
  }
  private handleNumericJoinOffset() {
    // Enter your Code here
  }
  private handleStringJoinOffset() {
    // Enter your Code here
  }
  private handleSubpageReceiveStateEnable() {
    // Enter your Code here
  }
  private handleSubpageReceiveStateVisible() {
    // Enter your Code here
  }
  private handleSubpage() {
    // Enter your Code here
  }
  private handleSubpageReceiveStateScrollTo() {
    // Enter your Code here
  }
  private handleStretch() {
    Array.from(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + e);
    });
    if (!this.stretch) {
      this._elContainer.classList.add(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }
  }
  private handleNumberOfItems() {
    // Enter your Code here
  }
  private handleReceiveStateNumberOfItems() {
    // Enter your Code here
  }
  private handleIndexId() {
    // Enter your Code here
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();

    if (this.stretch) {
      this._elContainer.classList.add(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }

    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.cssClassPrefix + '--disabled';
  }

  //#endregion

}

Ch5SubpageReferenceList.registerCustomElement();
Ch5SubpageReferenceList.registerSignalAttributeTypes();

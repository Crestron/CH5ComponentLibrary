import { Ch5Common } from "../ch5-common/ch5-common";
import { isEmpty, isNil } from 'lodash';
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SubpageReferenceListOrientation, TCh5SubpageReferenceListStretch, TCh5SubpageReferenceListAttributesLoadItems } from './interfaces/t-ch5-subpage-reference-list';
import { ICh5SubpageReferenceListAttributes } from './interfaces/i-ch5-subpage-reference-list-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { resizeObserver } from "../ch5-core/resize-observer";
import { Ch5AugmentVarSignalsNames } from '../ch5-common/ch5-augment-var-signals-names';
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core';
import { ch5subpageReferenceListSubject } from "./refresh-ch5-subpage-reference-list";
import { Subscription } from "rxjs";
import { Ch5Signal } from "../ch5-core/ch5-signal";
import { Ch5SignalFactory } from "./../ch5-core/ch5-signal-factory";
import _ from "lodash";
export class Ch5SubpageReferenceList extends Ch5Common implements ICh5SubpageReferenceListAttributes {

  //#region Variables
  // ClassList Prefix
  //public static readonly ROWS_CLASSLIST_PREFIX: string = '--rows-';
  //public static readonly COLUMNS_CLASSLIST_PREFIX: string = '--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = '--scrollbar-';
  public static readonly CENTER_ITEMS_CLASSLIST_PREFIX: string = '--center-items-';

  // Subpage container dimension and Buffer values
  public static readonly SUBPAGE_CONTAINER_BUFFER: number = 4;
  public static readonly STRETCH: TCh5SubpageReferenceListStretch[] = ['both'];
  public static readonly ORIENTATION: TCh5SubpageReferenceListOrientation[] = ['horizontal', 'vertical'];
  public static readonly LOAD_ITEMS: TCh5SubpageReferenceListAttributesLoadItems[] = ['visible-only', 'load-new', 'all'];
  public static readonly COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5SubpageReferenceList.ORIENTATION[0],
      values: Ch5SubpageReferenceList.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
    }, LOAD_ITEMS: {
      default: Ch5SubpageReferenceList.LOAD_ITEMS[0],
      values: Ch5SubpageReferenceList.LOAD_ITEMS,
      key: 'loadItems',
      attribute: 'loadItems',
      classListPrefix: '--load-items-'
    },
    STRETCH: {
      default: Ch5SubpageReferenceList.STRETCH[0],
      values: Ch5SubpageReferenceList.STRETCH,
      key: 'stretch',
      attribute: 'stretch',
      classListPrefix: '--stretch-'
    }
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    booleanjoinincrement: { direction: "state", booleanJoin: 1, contractName: true },
    numericjoinincrement: { direction: "state", numericJoin: 1, contractName: true },
    stringjoinincrement: { direction: "state", stringJoin: 1, contractName: true },
    subpagereceivestatescrollto: { direction: "state", numericJoin: 1, contractName: true },
    receivestatenumberofitems: { direction: "state", numericJoin: 1, contractName: true }
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5SubpageReferenceList.ORIENTATION[0],
      enumeratedValues: Ch5SubpageReferenceList.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SubpageReferenceList.ORIENTATION[0],
      isObservableProperty: true
    },
    {
      default: "",
      name: "contractName",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
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
      default: false,
      name: "useContractForNumItems",
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
      isObservableProperty: true
    },
    {
      default: false,
      name: "centerItems",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: 1,
      name: "rows",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
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
      name: "columns",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
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
      default: 0,
      name: "scrollToPosition",
      removeAttributeOnNull: true,
      nameForSignal: "subpageReceiveStateScrollTo",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 599,
        conditionalMin: 0,
        conditionalMax: 599,
        conditionalMinValue: 0,
        conditionalMaxValue: 599
      },
      isObservableProperty: true
    },
    {
      default: false,
      name: "scrollbar",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: "0",
      isSignal: true,
      name: "booleanJoinIncrement",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "0",
      isSignal: true,
      name: "numericJoinIncrement",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "0",
      isSignal: true,
      name: "stringJoinIncrement",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "subpageReceiveStateEnable",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "subpageReceiveStateShow",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "widgetId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "subpageReceiveStateScrollTo",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: null,
      enumeratedValues: Ch5SubpageReferenceList.STRETCH,
      name: "stretch",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: null,
      isObservableProperty: true,
      isNullable: true
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
      isObservableProperty: true
    },
    {
      default: "",
      name: "indexId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: Ch5SubpageReferenceList.LOAD_ITEMS[0],
      enumeratedValues: Ch5SubpageReferenceList.LOAD_ITEMS,
      name: "loadItems",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SubpageReferenceList.LOAD_ITEMS[0],
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-subpage-reference-list';

  public primaryCssClass = 'ch5-subpage-reference-list';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _scrollbarContainer: HTMLElement = {} as HTMLElement;
  private _scrollbar: HTMLElement = {} as HTMLElement;
  private _templateElement: HTMLTemplateElement = {} as HTMLTemplateElement;
  // private members used for mouse up and down
  private isDown = false;
  private startX: number = 0;
  private startY: number = 0;
  private scrollListLeft: number = 0;
  private scrollListTop: number = 0;
  private scrollbarDimension: number = 0;
  private subpageWidth: number = 0;
  private subpageHeight: number = 0;
  private containerHeight: number = 0;
  private containerWidth: number = 0;
  private reInit: boolean = true;
  /**
   * The subscription id of listener for refresh 
   */
  private _refreshSubId: Subscription | null = null;

  private previousSignalValues = {
    contractName: "",
    receiveStateCustomClass: "",
    receiveStateCustomStyle: "",
    receiveStateEnable: "",
    receiveStateShow: "",
    subpageReceiveStateScrollTo: "",
    receiveStateNumberOfItems: ""
  }

  // Default Row and Column value
  private rowClassValue: number = 1;
  private columnClassValue: number = 1;

  private showSignalHolder: any = [];
  private loadSubpageForShow: boolean = false;
  private allSubpageVisible: boolean = false;

  public debounceSubpageShow = this.debounce(() => {
    this.subpageShow();
  }, 150);

  public debounceSubpageDisplay = this.debounce((isReceiveStateScrollTo = false) => {
    if (this.loadItems === "visible-only") {
      this.subpageDisplay(isReceiveStateScrollTo);
    } else if (this.loadItems === "load-new") {
      this.subpageDisplayForLoadItemsNew(isReceiveStateScrollTo);
    } else {
      this.subpageDisplayForLoadItemsAll(isReceiveStateScrollTo);
    }

    this.setCustomAttributesInChildComponents(this);
  }, 100);

  private setCustomAttributesInChildComponents(parentElement: any) {
    const found: any = [];
    const allElements = parentElement.getElementsByTagName('*');

    for (const element of allElements) {
      const elementTagName = element.tagName;
      if (elementTagName.startsWith('CH5-')) {
        element.setAttribute("swipeGestureEnabled", "true");
        found.push(element);
      }
    }
    return found;
  }

  public debounceInitScrollBar = this.debounce(() => {
    this.initScrollbar();
  }, 400);

  public scrollAfterSomeTime = this.debounce((dir: string, value: number) => {
    dir === "left" ? this._elContainer.scrollLeft = value : this._elContainer.scrollTop = value;
  }, 400)

  //#endregion

  //#region Getters and Setters


  public set orientation(value: TCh5SubpageReferenceListOrientation) {
    this._ch5Properties.set<string>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5SubpageReferenceListOrientation {
    return this._ch5Properties.get<TCh5SubpageReferenceListOrientation>("orientation");
  }

  public set contractName(value: string) {
    this._ch5Properties.set<string>("contractName", value, () => {
      this.handleContractName();
    });
  }
  public get contractName(): string {
    return this._ch5Properties.get<string>("contractName");
  }

  public set useContractForEnable(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForEnable", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForShow", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForShow");
  }


  public set useContractForItemEnable(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForItemEnable", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForItemEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForItemEnable");
  }

  public set useContractForItemShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForItemShow", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForItemShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForItemShow");
  }

  public set useContractForCustomStyle(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForCustomStyle(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomStyle");
  }

  public set useContractForCustomClass(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForCustomClass(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomClass");
  }

  public set useContractForNumItems(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForNumItems", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get useContractForNumItems(): boolean {
    return this._ch5Properties.get<boolean>("useContractForNumItems");
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

  public set loadItems(value: TCh5SubpageReferenceListAttributesLoadItems) {
    this._ch5Properties.set<TCh5SubpageReferenceListAttributesLoadItems>("loadItems", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get loadItems(): TCh5SubpageReferenceListAttributesLoadItems {
    return this._ch5Properties.get<TCh5SubpageReferenceListAttributesLoadItems>("loadItems");
  }

  public set rows(value: number) {
    this._ch5Properties.set<number>("rows", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get rows(): number {
    return this._ch5Properties.get<number>("rows");
  }

  public set columns(value: number) {
    this._ch5Properties.set<number>("columns", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get columns(): number {
    return this._ch5Properties.get<number>("columns");
  }

  public set scrollToPosition(value: number) {
    this._ch5Properties.set<number>("scrollToPosition", value, () => {
      const withinValidRange = this.scrollToPosition < this.numberOfItems && this.scrollToPosition >= 0;
      const scrollToApplicable = ((this.orientation === 'horizontal' && this.rows === 1) || (this.orientation === "vertical" && this.columns === 1));
      if (withinValidRange && scrollToApplicable) {
        this.debounceSubpageDisplay(true);
      }
    });
  }
  public get scrollToPosition(): number {
    return this._ch5Properties.get<number>("scrollToPosition");
  }

  public set scrollbar(value: boolean) {
    this._ch5Properties.set<boolean>("scrollbar", value, () => {
      this.handleScrollbar();
    });
  }
  public get scrollbar(): boolean {
    return this._ch5Properties.get<boolean>("scrollbar");
  }

  public set booleanJoinIncrement(value: string) {
    this._ch5Properties.set("booleanJoinIncrement", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get booleanJoinIncrement(): string {
    return this._ch5Properties.get<string>('booleanJoinIncrement');
  }

  public set numericJoinIncrement(value: string) {
    this._ch5Properties.set("numericJoinIncrement", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get numericJoinIncrement(): string {
    return this._ch5Properties.get<string>('numericJoinIncrement');
  }

  public set stringJoinIncrement(value: string) {
    this._ch5Properties.set("stringJoinIncrement", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get stringJoinIncrement(): string {
    return this._ch5Properties.get<string>('stringJoinIncrement');
  }

  public set subpageReceiveStateEnable(value: string) {
    this._ch5Properties.set<string>("subpageReceiveStateEnable", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get subpageReceiveStateEnable(): string {
    return this._ch5Properties.get<string>('subpageReceiveStateEnable');
  }

  public set subpageReceiveStateShow(value: string) {
    this._ch5Properties.set<string>("subpageReceiveStateShow", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get subpageReceiveStateShow(): string {
    return this._ch5Properties.get<string>('subpageReceiveStateShow');
  }

  public set widgetId(value: string) {
    this._ch5Properties.set<string>("widgetId", value, () => {
      this.handleWidgetID();
    });
  }
  public get widgetId(): string {
    return this._ch5Properties.get<string>("widgetId");
  }

  public set subpageReceiveStateScrollTo(value: string) {
    this._ch5Properties.set("subpageReceiveStateScrollTo", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("scrollToPosition", newValue, () => {
        const withinValidRange = this.scrollToPosition < this.numberOfItems && this.scrollToPosition >= 0;
        const scrollToApplicable = ((this.orientation === 'horizontal' && this.rows === 1) || (this.orientation === "vertical" && this.columns === 1));
        if (withinValidRange && scrollToApplicable) {
          this.reInit = true;
          this.debounceSubpageDisplay(true);
        }
      });
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
      this.handleRowsAndColumn();
    });
  }
  public get numberOfItems(): number {
    return this._ch5Properties.get<number>("numberOfItems");
  }

  public set receiveStateNumberOfItems(value: string) {
    this._ch5Properties.set("receiveStateNumberOfItems", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("numberOfItems", newValue, () => {
        if (this.useContractForNumItems === false) {
          this.previousSignalValues.receiveStateNumberOfItems = this.receiveStateNumberOfItems;
        }
        this.handleRowsAndColumn();
      });
    });
  }
  public get receiveStateNumberOfItems(): string {
    return this._ch5Properties.get<string>('receiveStateNumberOfItems');
  }

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value);
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
    this.ignoreAttributes = ["receivestatehidepulse", "receivestateshowpulse", "sendeventonshow"];
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
        attr = attr.toLowerCase();
        if (attr === "receivestatecustomclass") {
          if (this.useContractForCustomClass === false) {
            super.attributeChangedCallback(attr, oldValue, newValue);
            this.previousSignalValues.receiveStateCustomClass = this.receiveStateCustomClass;
          }
        } else if (attr === "receivestatecustomstyle") {
          if (this.useContractForCustomStyle === false) {
            super.attributeChangedCallback(attr, oldValue, newValue);
            this.previousSignalValues.receiveStateCustomStyle = this.receiveStateCustomStyle;
          }
        } else if (attr === "receivestateshow") {
          if (this.useContractForShow === false) {
            super.attributeChangedCallback(attr, oldValue, newValue);
            this.previousSignalValues.receiveStateShow = this.receiveStateShow;
          }
        } else if (attr === "receivestateenable") {
          if (this.useContractForEnable === false) {
            super.attributeChangedCallback(attr, oldValue, newValue);
            this.previousSignalValues.receiveStateEnable = this.receiveStateEnable;
          }
        }
        super.attributeChangedCallback(attr, oldValue, newValue);
        this.debounceSubpageDisplay();
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
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5SubpageReferenceList);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-subpage-reference-list');
      this.appendChild(this._elContainer);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.debounceSubpageDisplay();
    resizeObserver(this._elContainer, this.resizeHandler);
    customElements.whenDefined(this.nodeName.toLowerCase()).then(() => {
      this.componentLoadedEvent(this.nodeName.toLowerCase(), this.id);
    });
    // needed for preload-true 
    subscribeInViewPortChange(this, () => {
      if (this.elementIsInViewPort && this.reInit) {
        this.reInit = false;
        this.debounceSubpageDisplay();
        this.debounceInitScrollBar();
      }
    });

    this.listenForCh5SubpageReferenceListRefreshRequests();
    this.logger.stop();
  }
  /**
   * function to setup a subscription for a change 
   * This functionality is primarily to support CCIDE update the template definition after a template 
   * instance has been put onto the CCIDE canvas. 
   * The implementation is 'good enough' for design time to show updated widget, but in a runtime environment,
   * it will leak references over time. 
   */
  private listenForCh5SubpageReferenceListRefreshRequests() {
    this.info('Ch5SubpageReferenceList.listenForCh5SubpageReferenceListRefreshRequests()');

    this._refreshSubId = ch5subpageReferenceListSubject.subscribe((ch5SubpageReferenceListId: string) => {
      this.info(`Ch5SubpageReferenceList.listenForCh5SubpageReferenceListRefreshRequests() new request for ${ch5SubpageReferenceListId}`);

      if (this.getAttribute('widgetId') === ch5SubpageReferenceListId) {
        this.initializations();
      }
    });
  }

  private initializations(): void {

    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-subpage-reference-list');
      this.appendChild(this._elContainer);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.handleWidgetID();
    this.initCommonMutationObserver(this);
    this.debounceSubpageDisplay();
    this.info('Ch5SubpageReferenceList --- Initialization Finished');

  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    unSubscribeInViewPortChange(this);
    this.reInitialize();
    if (this._refreshSubId !== null) {
      this._refreshSubId.unsubscribe();
      this._refreshSubId = null;
    }
    this.showSignalHolder.forEach((el: { signalValue: string, signalState: string, value: number }) => this.clearOldSubscription(el.signalValue, el.signalState));
    this.showSignalHolder = [];
    this.logger.stop();
  }

  private reInitialize() {
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.reInit = true;
  }
  //#endregion

  //#region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');
    this._scrollbarContainer = document.createElement('div');
    this._scrollbar = document.createElement('div');
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
    this.initialize();
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._elContainer.addEventListener('mousedown', this.handleMouseDown);
    this._elContainer.addEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._elContainer.addEventListener('mouseup', this.handleMouseUpAndLeave);
    this._elContainer.addEventListener('mousemove', this.handleMouseMove);
    this._elContainer.addEventListener('scroll', this.handleScrollEvent);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elContainer.removeEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._elContainer.removeEventListener('mouseup', this.handleMouseUpAndLeave);
    this._elContainer.removeEventListener('mousedown', this.handleMouseDown);
    this._elContainer.removeEventListener('mousemove', this.handleMouseMove);
    this._elContainer.removeEventListener('scroll', this.handleScrollEvent);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }
  private handleMouseDown = (e: MouseEvent) => {
    this.isDown = true;
    this._elContainer.classList.add('active');
    this.startX = e.pageX - this._elContainer.offsetLeft;
    this.startY = e.pageY - this._elContainer.offsetTop;
    this.scrollListLeft = this._elContainer.scrollLeft;
    this.scrollListTop = this._elContainer.scrollTop;
  };
  private handleMouseUpAndLeave = this.debounce(() => {
    this.isDown = false;
    this._elContainer.classList.remove('active');
  }, 10);

  private handleMouseMove = this.debounce((e: MouseEvent) => {
    if (!this.isDown) { return; }
    e.preventDefault();
    const x = e.pageX - this._elContainer.offsetLeft;
    const y = e.pageY - this._elContainer.offsetTop;
    const walkX = (x - this.startX) * 3;
    const walkY = (y - this.startY) * 3;
    this._elContainer.scrollLeft = this.scrollListLeft - walkX;
    this._elContainer.scrollTop = this.scrollListTop - walkY;
  }, 10);

  private handleScrollEvent = () => {
    // update the scrollbar width and position
    this.initScrollbar();

    // endless is handled in endlessHelper method
    if (this.endless) {
      if (this.loadItems === "all") {
        this.subpageWidth = this._elContainer.children[0].getBoundingClientRect().width;
        this.subpageHeight = this._elContainer.children[0].getBoundingClientRect().height;
        return this.endlessHelper();
      } else if (this.loadItems === "load-new") {
        return this.endlessHelperForNew();
      }
      return this.endlessHelper();
    }
    if (this.loadItems === "visible-only") {
      this.scrollHelper();
    } else if (this.loadItems === "load-new") {
      this.scrollHelperForNew();
    }
    this.setCustomAttributesInChildComponents(this);
  };


  private scrollHelperForNew() {
    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.subpageWidth) { return; }
      let lastElement = this.getLastChild();
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.subpageWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(++lastElement);
          if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
            let showValue = lastElement;
            while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
              this.createSubpage(++showValue);
            }
          }
        }
        this.initScrollbar();
      }
    } else if (this.orientation === 'horizontal') {
      // auto  addition of subpages is handled
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.subpageWidth) { return; }
      let lastElement = this.getLastChild();
      if (scrollLeft + offsetWidth > scrollWidth - this.subpageWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createSubpage(++lastElement);
            if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createSubpage(++showValue);
              }
            }
          }
        }
        this.initScrollbar();
      }
    } else {
      const { offsetHeight, scrollTop, scrollHeight } = this._elContainer;
      if (scrollHeight - offsetHeight < this.subpageHeight) { return; }
      let lastElement = this.getLastChild();
      if (scrollTop + offsetHeight > scrollHeight - this.subpageHeight && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.columns; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createSubpage(++lastElement);
            if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createSubpage(++showValue);
              }
            }
          }
        }
        this.initScrollbar();
      }
    }
  }

  private scrollHelper() {
    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.subpageWidth) { return; }
      let firstElement = this.getFirstChild();
      let lastElement = this.getLastChild();
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.subpageWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(++lastElement);
          if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
            let showValue = lastElement;
            while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
              this.createSubpage(++showValue);
            }
          }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft += this.subpageWidth;
      }
      else if (Math.abs(scrollLeft) < this.subpageWidth && firstElement !== 0) {
        let lastColumnElements = (lastElement + 1) % this.rows;
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(--firstElement, false);
          if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
            let showValue = firstElement;
            while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
              this.createSubpage(--showValue, false);
            }
          }
          if ((lastElement + 1) % this.rows !== 0) {
            if (lastColumnElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollLeft -= this.subpageWidth;
      }
    } else if (this.orientation === 'horizontal') {
      // auto deletion and addition of subpages is handled
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.subpageWidth) { return; }
      let firstElement = this.getFirstChild();
      let lastElement = this.getLastChild();
      if (scrollLeft < 5 && firstElement !== 0) {
        let lastColumnElements = (lastElement + 1) % this.rows;
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(--firstElement, false);
          if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
            let showValue = firstElement;
            while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
              this.createSubpage(--showValue, false);
            }
          }
          if ((lastElement + 1) % this.rows !== 0) {
            if (lastColumnElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollLeft += 5;
      } else if (scrollLeft + offsetWidth > scrollWidth - 5 && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createSubpage(++lastElement);
            if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createSubpage(++showValue);
              }
            }
          }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft -= 5;
      }
    } else {
      const { offsetHeight, scrollTop, scrollHeight } = this._elContainer;
      let firstElement = this.getFirstChild();
      let lastElement = this.getLastChild();
      if (scrollTop < 5 && firstElement !== 0) {
        let lastRowElements = (lastElement + 1) % this.columns;
        for (let i = 0; i < this.columns; i++) {
          this.createSubpage(--firstElement, false);
          if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
            let showValue = firstElement;
            while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
              this.createSubpage(--showValue, false);
            }
          }
          if ((lastElement + 1) % this.columns !== 0) {
            if (lastRowElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollTop += 5;
      } else if (scrollTop + offsetHeight > scrollHeight - 5 && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.columns; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createSubpage(++lastElement);
            if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createSubpage(++showValue);
              }
            }
          }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollTop -= 5;
      }
    }
  }
  private endlessHelper() {
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + this.subpageWidth < scrollWidth : offsetHeight + this.subpageHeight < scrollHeight;
    if (endlessScrollable === false) { return; }
    if (this.orientation === 'horizontal' && this.dir === 'rtl') {
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.subpageWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(++showValue);
          }
        }
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollLeft += this.subpageWidth / 2;
      } else if (Math.abs(scrollLeft) < this.subpageWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(--showValue, false);
          }
        }
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollLeft -= this.subpageWidth / 2;
      }
    } else if (this.orientation === 'horizontal') {
      if (scrollLeft < this.subpageWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(--showValue, false);
          }
        }
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollLeft += this.subpageWidth / 2;
      } else if (scrollLeft + offsetWidth > scrollWidth - this.subpageWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(++showValue);
          }
        }
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollLeft -= this.subpageWidth / 2;
      }
    } else {
      if (scrollTop < this.subpageHeight / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(--showValue, false);
          }
        }
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollTop += this.subpageHeight / 2;
      } else if (scrollTop + offsetHeight > scrollHeight - this.subpageHeight / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(++showValue);
          }
        }
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollTop -= this.subpageHeight / 2;
        if (this.scrollToPosition === this.numberOfItems - 1 && index === 0) { this._elContainer.scrollTop += this.subpageHeight; }
      }
    }
  }

  private endlessHelperForNew() {
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + this.subpageWidth < scrollWidth : offsetHeight + this.subpageHeight < scrollHeight;
    if (endlessScrollable === false) { return; }
    if (this.orientation === 'horizontal' && this.dir === 'rtl') {
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.subpageWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(++showValue);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft += this.subpageWidth / 2;
      } else if (Math.abs(scrollLeft) < this.subpageWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(--showValue, false);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.lastElementChild?.remove();
        }
        this._elContainer.scrollLeft -= this.subpageWidth / 2;
      }
    } else if (this.orientation === 'horizontal') {
      if (scrollLeft < this.subpageWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(--showValue, false);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.lastElementChild?.remove();
        }
        this._elContainer.scrollLeft += this.subpageWidth / 2;
      } else if (scrollLeft + offsetWidth > scrollWidth - this.subpageWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(++showValue);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft -= this.subpageWidth / 2;
      }
    } else {
      if (scrollTop < this.subpageHeight / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(--showValue, false);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.lastElementChild?.remove();
        }
        this._elContainer.scrollTop += this.subpageHeight / 2;
      } else if (scrollTop + offsetHeight > scrollHeight - this.subpageHeight / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        if (this.loadSubpageForShow === true && this.allSubpageVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createSubpage(++showValue);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollTop -= this.subpageHeight / 2;
        if (this.scrollToPosition === this.numberOfItems - 1 && index === 0) { this._elContainer.scrollTop += this.subpageHeight; }
      }
    }
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

  public handleOrientation() {
    Array.from(Ch5SubpageReferenceList.COMPONENT_DATA.ORIENTATION.values).forEach((orientation: any) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COMPONENT_DATA.ORIENTATION.classListPrefix + orientation);
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this.handleRowsAndColumn();
  }

  public handleEndless() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    if (this.endless && this.scrollbar === true) { this.scrollbar = false; }
    // This behavior is handled in scroll event
  }
  public handleCenterItems() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
    if (this.centerItems === true) {
      this.debounceSubpageDisplay();
    }
  }
  public handleRowsAndColumn() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.orientation === "horizontal") {
      // Remove Previous loaded class for both rows and columns
      // this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      // this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      this._elContainer.style.removeProperty("grid-template-columns");
      this._elContainer.style.removeProperty("grid-template-rows");

      // Calculate New Row class value
      this.rowClassValue = this.rows < this.numberOfItems ? this.rows : this.numberOfItems;

      // Add the new class to the container
      // this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      this._elContainer.style.setProperty("grid-template-rows", "repeat(" + this.rowClassValue + ", 1fr)");
    } else {

      // Remove Previous loaded class for both rows and columns
      // this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      // this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      this._elContainer.style.removeProperty("grid-template-columns");
      this._elContainer.style.removeProperty("grid-template-rows");

      // Calculate New Row class value
      this.columnClassValue = this.columns < this.numberOfItems ? this.columns : this.numberOfItems;

      // Add the new class to the container
      // this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      this._elContainer.style.setProperty("grid-template-columns", "repeat(" + this.columnClassValue + ", 1fr)");
    }
    this.debounceSubpageDisplay();
  }

  public handleScrollbar() {
    if (this.endless === true && this.scrollbar === true) { this.scrollbar = false; }
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this.initScrollbar();
  }

  public handleScrollToPosition(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the subpage list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }
    this.subpageWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageWidth;
    this.subpageHeight = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageHeight;
    // Remove all the children in the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    if ((this.contractName.length !== 0 && this.useContractForItemShow === true) || (this.subpageReceiveStateShow.length !== 0 && this.subpageReceiveStateShow.trim().includes(`{{${this.indexId}}}`) === true)) {
      this.loadSubpageForShow = true;
      if (this.showSignalHolder.length === 0) { this.signalHolder(); }
      const visibleButtons = this.showSignalHolder.filter((btn: any) => btn?.value === true).length
      this.allSubpageVisible = visibleButtons === this.numberOfItems ? true : false;
    } else {
      this.loadSubpageForShow = false;
    }

    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width || this.containerWidth;
      const loadableSubpages = Math.ceil(containerWidth / this.subpageWidth) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      // Right Edge case
      if (value >= this.numberOfItems - (loadableSubpages - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableSubpages; i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollLeft = value === this.numberOfItems - 1 ? this.subpageWidth * 5 * -1 : this.subpageWidth * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER * -1;
        if (this.allSubpageVisible === false && this.loadSubpageForShow === true) { this.scrollToRightEdgeRange(); }
      }
      // In between the range
      else if (value >= Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER) {
        for (let i = value - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER; i < value + loadableSubpages && i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollLeft = this.subpageWidth * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER * -1;
        if (this.allSubpageVisible === false && this.loadSubpageForShow === true) { this.scrollToMiddleRange(); }
      }
      // Left Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableSubpages && i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollLeft = this.subpageWidth * value * -1;
        if (this.allSubpageVisible === false && this.loadSubpageForShow === true) { this.scrollToLeftEdgeRange(); }
      }
    } else if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width || this.containerWidth;
      const loadableSubPageList = Math.ceil(containerWidth / this.subpageWidth) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      // Right Edge case
      if (value >= this.numberOfItems - (loadableSubPageList - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableSubPageList; i < this.numberOfItems; i++) { this.createSubpage(i); }
        this.scrollAfterSomeTime("left", value === this.numberOfItems - 1 ? this.subpageWidth * 5 : this.subpageWidth * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER);
      }
      // In between the range
      else if (value >= Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER) {
        for (let i = value - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER; i < value + loadableSubPageList && i < this.numberOfItems; i++) { this.createSubpage(i); }
        this.scrollAfterSomeTime("left", this.subpageWidth * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER);
      }
      // Left Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableSubPageList && i < this.numberOfItems; i++) { this.createSubpage(i); }
        this.scrollAfterSomeTime("left", this.subpageWidth * value);
      }
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height || this.containerHeight;
      const loadableSubpages = Math.ceil(containerHeight / this.subpageHeight) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      // If container height is not set then display all the subpage
      if (containerHeight === 0) {
        for (let i = 0; i < this.numberOfItems; i++) { this.createSubpage(i); }
      }
      // Bottom Edge case
      else if (value >= this.numberOfItems - (loadableSubpages - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableSubpages; i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollTop = value === this.numberOfItems - 1 ? this.subpageHeight * 5 : this.subpageHeight * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
        if (this.allSubpageVisible === false && this.loadSubpageForShow === true) { this.scrollToRightEdgeRange(); }
      }
      // In between the range
      else if (value >= Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER) {
        for (let i = value - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER; i < value + loadableSubpages && i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollTop = this.subpageHeight * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
        if (this.allSubpageVisible === false && this.loadSubpageForShow === true) { this.scrollToMiddleRange(); }
      }
      // Top Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableSubpages && i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollTop = this.subpageHeight * value;
        if (this.allSubpageVisible === false && this.loadSubpageForShow === true) { this.scrollToLeftEdgeRange(); }
      }
    }
    this.debounceInitScrollBar();
  }

  public handleScrollToPositionForNew(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the subpage list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    if (this.subpageWidth === 0 || this.subpageHeight === 0) {
      if (this._elContainer.children.length === 0) {
        this.createSubpage(0);
        this.subpageWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageWidth;
        this.subpageHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.subpageHeight;
        this._elContainer.firstElementChild?.remove();
      } else {
        this.subpageWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageWidth;
        this.subpageHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.subpageHeight;
      }
    }

    if ((this.contractName.length !== 0 && this.useContractForItemShow === true) || (this.subpageReceiveStateShow.length !== 0 && this.subpageReceiveStateShow.trim().includes(`{{${this.indexId}}}`) === true)) {
      this.loadSubpageForShow = true;
      if (this.showSignalHolder.length === 0) { this.signalHolder(); }
      const visibleButtons = this.showSignalHolder.filter((btn: any) => btn?.value === true).length
      this.allSubpageVisible = visibleButtons === this.numberOfItems ? true : false;
    } else {
      this.loadSubpageForShow = false;
    }

    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width || this.containerWidth;
      const loadableButtons = Math.ceil(containerWidth / this.subpageWidth) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      if (this._elContainer.children.length === 0) {
        for (let index = 0; index < this.numberOfItems && index < value + loadableButtons - 1; index++) { this.createSubpage(index); }
      } else if (this.getLastChild() < value + loadableButtons) {
        for (let index = this.getLastChild() + 1; index < this.numberOfItems && index < value + loadableButtons; index++) { this.createSubpage(index); }
      }
      this._elContainer.scrollLeft = value !== 0 ? (value * this.subpageWidth) * -1 : 0;
    } else if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width || this.containerWidth;
      const loadableButtons = Math.ceil(containerWidth / this.subpageWidth) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      if (this._elContainer.children.length === 0) {
        for (let index = 0; index < this.numberOfItems && index < value + loadableButtons - 1; index++) { this.createSubpage(index); }
      } else if (this.getLastChild() < value + loadableButtons) {
        for (let index = this.getLastChild() + 1; index < this.numberOfItems && index < value + loadableButtons; index++) { this.createSubpage(index); }
      }
      this._elContainer.scrollLeft = value !== 0 ? value * this.subpageWidth : 0;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height || this.containerHeight;
      const loadableButtons = Math.ceil(containerHeight / this.subpageHeight) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      // If container height is not set then display all the subpage
      if (containerHeight <= 10 || containerHeight <= this.subpageHeight + 10) {
        for (let i = 0; i < this.numberOfItems; i++) { this.createSubpage(i); }
      } else {
        if (this._elContainer.children.length === 0) {
          for (let index = 0; index < this.numberOfItems && index < value + loadableButtons - 1; index++) { this.createSubpage(index); }
        } else if (this.getLastChild() < value + loadableButtons) {
          for (let index = this.getLastChild() + 1; index < this.numberOfItems && index < value + loadableButtons; index++) { this.createSubpage(index); }
        }
      }
      this._elContainer.scrollTop = value !== 0 ? value * this.subpageHeight : 0;
    }
    if (this.allSubpageVisible === false && this.loadSubpageForShow === true) {
      let counter = 0;
      for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
        if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
      }
      let k = 0;
      while (counter !== 0 && k < counter && this.getLastChild() !== this.numberOfItems - 1) {
        if (this.showSignalHolder[this.getLastChild() + 1].value === true) { k = k + 1; }
        this.createSubpage(this.getLastChild() + 1);
      }
    }
    this.initScrollbar();
  }

  public handleScrollToPositionForAll(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the subpage list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    this.subpageWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageWidth;
    this.subpageHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.subpageHeight;

    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      this._elContainer.scrollLeft = (value * this.subpageWidth) * -1;
    } else if (this.orientation === 'horizontal') {
      this._elContainer.scrollLeft = value * this.subpageWidth;
    } else {
      this._elContainer.scrollTop = value * this.subpageHeight;
    }
    this.initScrollbar();
  }

  private handleWidgetID() {
    if (isEmpty(this.widgetId)) {
      throw new Error('[ch5-subpage-reference-list] Error: No widgetId was provided');
    }

    const template = document.getElementById(this.widgetId) as HTMLTemplateElement;

    if (!(isNil(template))) {
      this._templateElement = template as HTMLTemplateElement;
    } else {
      throw new Error(`[ch5-subpage-reference-list] Error: No template with the id: "${this.widgetId}" found`);
    }
    this.debounceSubpageDisplay();
  }

  private handleStretch() {
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.stretch === null) {
      this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');
    } else {
      this.debounceSubpageDisplay();
    }
  }
  public subpageDisplay(isReceiveStateScrollTo = false) {
    this.contractDefaultHelper();

    // Needed for page startup and receiveStateScrollToPosition executed first
    if (isReceiveStateScrollTo === true) { return this.handleScrollToPosition(this.scrollToPosition); }

    // The below line is added to remove the stretch class before calculating the subpage dimension
    this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // create first subpage and find the dimension of the subpage
    this.createSubpage(0);
    this.subpageWidth = this._elContainer.children[0].getBoundingClientRect().width;
    this.subpageHeight = this._elContainer.children[0].getBoundingClientRect().height;
    let loadedSubpages = 0;
    if (this.orientation === 'horizontal') {
      // Find the number of initial subpages which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width || this.containerWidth;
      loadedSubpages = Math.floor(containerWidth / this.subpageWidth) * this.rows + this.rows * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height || this.containerHeight;
      // Check whether the container is set with custom height
      if (containerHeight > this.subpageHeight) {
        loadedSubpages = Math.floor(containerHeight / this.subpageHeight) * this.columns + this.columns * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;;
      } else {
        loadedSubpages = this.numberOfItems;
      }
    }
    loadedSubpages = loadedSubpages > this.numberOfItems ? this.numberOfItems : loadedSubpages;
    for (let index = 1; index < loadedSubpages; index++) {
      this.createSubpage(index);
    }
    if (this.endless) {
      this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5;
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    this.checkCenterItems();
    this.signalHolder();
    if (this.scrollToPosition !== 0) { this.handleScrollToPosition(this.scrollToPosition); }
  }

  public subpageDisplayForLoadItemsNew(isReceiveStateScrollTo = false) {
    this.contractDefaultHelper();

    // Needed for page startup and receiveStateScrollToPosition executed first
    if (isReceiveStateScrollTo === true) { return this.handleScrollToPositionForNew(this.scrollToPosition); }

    // The below line is added to remove the stretch class before calculating the subpage dimension
    this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // create first subpage and find the dimension of the subpage
    this.createSubpage(0);
    this.subpageWidth = this._elContainer.children[0].getBoundingClientRect().width;
    this.subpageHeight = this._elContainer.children[0].getBoundingClientRect().height;
    let loadedButtons = 0;
    if (this.orientation === 'horizontal') {
      // Find the number of initial subpages which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width || this.containerWidth;
      loadedButtons = Math.floor(containerWidth / this.subpageWidth) * this.rows + this.rows * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height || this.containerHeight;
      // Check whether the container is set with custom height
      if (containerHeight > this.subpageHeight + 10) {
        loadedButtons = Math.floor(containerHeight / this.subpageHeight) * this.columns + this.columns * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      } else {
        loadedButtons = this.numberOfItems;
      }
    }
    loadedButtons = loadedButtons > this.numberOfItems ? this.numberOfItems : loadedButtons;
    for (let index = 1; index < loadedButtons; index++) {
      this.createSubpage(index);
    }
    if (this.endless) {
      this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5;
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    this.checkCenterItems();
    this.signalHolder();
    if (this.scrollToPosition !== 0) { this.handleScrollToPositionForNew(this.scrollToPosition); }
  }

  public subpageDisplayForLoadItemsAll(isReceiveStateScrollTo = false) {
    this.contractDefaultHelper();

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    for (let index = 0; index < this.numberOfItems; index++) { this.createSubpage(index); }

    if (this.endless) { this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5; }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    this.checkCenterItems();
    if (isReceiveStateScrollTo === true && this.scrollToPosition === 0) {
      this.orientation === "horizontal" ? this._elContainer.scrollLeft = 0 : this._elContainer.scrollTop = 0;
    }
    if (this.scrollToPosition !== 0) { this.handleScrollToPositionForAll(this.scrollToPosition); }
  }

  private replaceAll(str: string, find: string, replace: string) {
    if (str && String(str).trim() !== "") {
      return String(str).split(find).join(replace);
    } else {
      return str;
    }
  }
  private createSubpage(index: number, append: boolean = true) {
    if (index < 0 || index >= this.numberOfItems) { return };
    if (isNil(this._templateElement)) {
      throw new Error('[ch5-subpage-reference-list] Error: Incorrect tag used');
    }
    const documentContainer: HTMLTemplateElement = document.createElement('template');
    documentContainer.innerHTML = this._templateElement.innerHTML;
    const spgContainer = document.createElement("div");
    spgContainer.setAttribute('id', this.getCrId() + '-' + index);
    if (this.contractName !== "" && this.useContractForItemShow === true) {
      spgContainer.setAttribute('data-ch5-noshow-type', 'display');
      spgContainer.setAttribute('data-ch5-show', this.contractName + `.List_Item${index + 1}_Visible`);
    } else {
      if (this.getAttribute('subpageReceiveStateShow')?.trim().includes(`{{${this.indexId}}}`) === false) {
        const attrValue = this.getAttribute('subpageReceiveStateShow')?.trim();
        if (attrValue) {
          spgContainer.setAttribute('data-ch5-noshow-type', 'display');
          spgContainer.setAttribute('data-ch5-show', attrValue.trim());
        }
      } else if (this.hasAttribute('subpageReceiveStateShow') && this.getAttribute("subpageReceiveStateShow")?.trim()) {
        const attrValue = this.replaceAll(this.getAttribute("subpageReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        spgContainer.setAttribute('data-ch5-noshow-type', 'display');
        if (isNumber) {
          spgContainer.setAttribute('data-ch5-show', Number(attrValue) + index + '');
        } else {
          spgContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("subpageReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
        }
      }
    }
    if (this.contractName !== "" && this.useContractForItemEnable === true) {
      spgContainer.setAttribute('data-ch5-enable', this.contractName + `.List_Item${index + 1}_Enable`);
    } else {
      if (this.getAttribute('subpageReceiveStateEnable')?.trim().includes(`{{${this.indexId}}}`) === false) {
        const attrValue = this.getAttribute('subpageReceiveStateEnable')?.trim();
        if (attrValue) {
          spgContainer.setAttribute('data-ch5-enable', attrValue.trim());
        }
      } else if (this.hasAttribute('subpageReceiveStateEnable') && this.getAttribute("subpageReceiveStateEnable")?.trim()) {
        const attrValue = this.replaceAll(this.getAttribute("subpageReceiveStateEnable")?.trim() + '', `{{${this.indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        if (isNumber) {
          spgContainer.setAttribute('data-ch5-enable', Number(attrValue) + index + '');
        } else {
          spgContainer.setAttribute('data-ch5-enable', this.replaceAll(this.getAttribute("subpageReceiveStateEnable")?.trim() + '', `{{${this.indexId}}}`, index + ''));
        }
      }
    }
    spgContainer.classList.add(this.nodeName.toLowerCase() + "--subpage-container");
    if (this.indexId !== null) {
      // replace indexId in attributes
      Ch5AugmentVarSignalsNames
        .replaceIndexIdInTmplElemsAttrs(documentContainer, (index), this.indexId as string);
      // replace remaining Idx from content using innerHTML and replace
      Ch5AugmentVarSignalsNames
        .replaceIndexIdInTmplElemsContent(documentContainer, (index), this.indexId as string);
    }
    spgContainer.appendChild(((documentContainer as HTMLTemplateElement).content));
    if (this.contractName !== "") {
      // update templateContent attributes to prefix contract name
      Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(spgContainer, this.contractName + '.Items[' + index + '].', 0, 0, 0);
    } else {
      // update templateContent attributes to increment join numbers
      Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(spgContainer, '',
        parseInt(this.booleanJoinIncrement, 10) * index || 0,
        parseInt(this.numericJoinIncrement, 10) * index || 0,
        parseInt(this.stringJoinIncrement, 10) * index || 0);
    }
    append ? this._elContainer.appendChild(spgContainer) : this._elContainer.prepend(spgContainer);
  }

  private handleContractName() {
    if (this.contractName.trim().length === 0) {
      this.previousSignalValues.contractName = "";
      this.receiveStateShow = this.previousSignalValues.receiveStateShow;
      this.receiveStateEnable = this.previousSignalValues.receiveStateEnable;
      this.receiveStateCustomStyle = this.previousSignalValues.receiveStateCustomStyle;
      this.receiveStateCustomClass = this.previousSignalValues.receiveStateCustomClass;
      this.receiveStateNumberOfItems = this.previousSignalValues.receiveStateNumberOfItems;
      this.subpageReceiveStateScrollTo = this.previousSignalValues.subpageReceiveStateScrollTo;
    }
    this.debounceSubpageDisplay();
  }

  private initialize() {
    if (this.previousSignalValues.contractName === "") {
      this.previousSignalValues.contractName = this.contractName;
      this.previousSignalValues.receiveStateShow = this.receiveStateShow;
      this.previousSignalValues.receiveStateEnable = this.receiveStateEnable;
      this.previousSignalValues.receiveStateCustomStyle = this.receiveStateCustomStyle;
      this.previousSignalValues.receiveStateCustomClass = this.receiveStateCustomClass;
      this.previousSignalValues.receiveStateNumberOfItems = this.receiveStateNumberOfItems;
      this.previousSignalValues.subpageReceiveStateScrollTo = this.subpageReceiveStateScrollTo;
    }
  }

  private contractDefaultHelper() {
    if (this.contractName !== "") {

      if (this.useContractForCustomStyle === true) {
        this.receiveStateCustomStyle = this.contractName + '.CustomStyle';
      } else {
        this.receiveStateCustomStyle = this.previousSignalValues.receiveStateCustomStyle;
      }

      if (this.useContractForCustomClass === true) {
        this.receiveStateCustomClass = this.contractName + '.CustomClass';
      } else {
        this.receiveStateCustomClass = this.previousSignalValues.receiveStateCustomClass;
      }

      if (this.useContractForEnable === true) {
        this.receiveStateEnable = this.contractName + '.List_Enable';
      } else {
        this.receiveStateEnable = this.previousSignalValues.receiveStateEnable;
      }

      if (this.useContractForShow === true) {
        this.receiveStateShow = this.contractName + '.List_Visible';
      } else {
        this.receiveStateShow = this.previousSignalValues.receiveStateShow;
      }

      if (this.useContractForNumItems === true) {
        this.receiveStateNumberOfItems = this.contractName + `.Set_Number_Of_Items`;
      } else {
        this.receiveStateNumberOfItems = this.previousSignalValues.receiveStateNumberOfItems;
      }
      this.subpageReceiveStateScrollTo = this.contractName + `.ListScrollToItem`;
    }
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();

    if (this.stretch) {
      this._elContainer.classList.add(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    // Set default rows 
    // this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rows);
    this._elContainer.style.setProperty("grid-template-rows", "repeat(" + this.rows + ", 1fr)");

    // Sets default scroll bar class
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    // sets default center item class
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
    this.logger.stop();
  }
  private initScrollbar() {
    this.subpageWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageWidth;
    this.subpageHeight = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageHeight;
    if (this.orientation === "horizontal" && this.dir === 'rtl') {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(Math.abs(scrollLeft) / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = (100 - this.scrollbarDimension) - scrollbarLeft + '%';
    } else if (this.orientation === "horizontal") {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(scrollLeft / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = scrollbarLeft + '%';
    } else {
      const { scrollHeight, offsetHeight, scrollTop } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      const scrollbarTop = Math.ceil(scrollTop / scrollHeight * 100);
      this._scrollbar.style.removeProperty('width');
      this._scrollbar.style.removeProperty('left');
      this._scrollbar.style.height = this.scrollbarDimension + '%';
      this._scrollbar.style.top = scrollbarTop + '%';
    }

    this.subpageWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.subpageWidth;
    this.subpageHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.subpageHeight;

    if (this.scrollbar) {
      if (this.scrollbarDimension === 100) {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      } else {
        this.checkCenterItems();
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
      }
    }
  }

  private checkInternalHTML() {
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add(this.nodeName.toLowerCase());
      this.appendChild(this._elContainer);
    }
    if (this._scrollbar.parentElement !== this._scrollbarContainer) {
      this._scrollbar.classList.add('scrollbar');
      this._scrollbarContainer.appendChild(this._scrollbar);
    }
    if (this._scrollbarContainer.parentElement !== this) {
      this._scrollbarContainer.classList.add('scrollbar-container');
      this.appendChild(this._scrollbarContainer);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private resizeHandler = (event: Event) => {
    const { width, height } = this._elContainer.getBoundingClientRect();
    if (this.containerWidth === 0 && width !== 0) {
      this.containerWidth = width;
      this.debounceSubpageDisplay();
    } else if (this.containerHeight === 0 && height !== 0) {
      this.containerHeight = height;
      this.debounceSubpageDisplay();
    }
    this.debounceInitScrollBar();
  }

  private signalHolder() {
    if ((this.contractName.length !== 0 && this.useContractForItemShow === true)) {
      this.showSignalHolder.forEach((el: { signalValue: string, signalState: string, value: number }) => this.clearOldSubscription(el.signalValue, el.signalState));
      this.showSignalHolder = [];
      this.loadSubpageForShow = true;
      for (let i = 1; i <= this.numberOfItems; i++) {
        const signalValue = `${this.contractName}.List_Item${i}_Visible`;
        const signalResponse = this.setSignalByBoolean(signalValue);
        this.showSignalHolder.push({ signalState: "", signalValue, value: false });
        if (!_.isNil(signalResponse)) {
          this.showSignalHolder[i - 1].signalState = signalResponse.subscribe((newValue: boolean) => {
            this.showSignalHolder[i - 1].value = newValue;
            this.debounceSubpageShow();
            return true;
          });
        }
      }
    } else if (this.subpageReceiveStateShow.length !== 0 && this.subpageReceiveStateShow.trim().includes(`{{${this.indexId}}}`) === true) {
      this.showSignalHolder.forEach((el: { signalValue: string, signalState: string, value: number }) => this.clearOldSubscription(el.signalValue, el.signalState));
      this.showSignalHolder = [];
      this.loadSubpageForShow = true;
      const attrValue = this.replaceAll(this.getAttribute('subpageReceiveStateShow')?.trim() + '', `{{${this.indexId}}}`, '');
      const isNumber = /^[0-9]+$/.test(attrValue);
      for (let i = 0; i < this.numberOfItems; i++) {
        const signalValue = isNumber ? Number(attrValue) + i + '' : this.replaceAll(this.getAttribute('subpageReceiveStateShow')?.trim() + '', `{{${this.indexId}}}`, i + '');
        this.showSignalHolder.push({ signalState: "", signalValue, value: false });
        const signalResponse = this.setSignalByBoolean(signalValue);
        if (!_.isNil(signalResponse)) {
          this.showSignalHolder[i].signalState = signalResponse.subscribe((newValue: boolean) => {
            this.showSignalHolder[i].value = newValue;
            this.debounceSubpageShow();
            return true;
          });
        }
      }
    }
  }

  private clearOldSubscription(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveStateSigName);

    if (oldSignal !== null) {
      oldSignal.unsubscribe(signalState as string);
    }
  }

  public setSignalByBoolean(signalValue: string): Ch5Signal<boolean> | null {
    // setup new subscription.
    const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(receiveLabelSigName);

    if (receiveSignal === null) {
      return null;
    }
    return receiveSignal;
  }

  private subpageShow() {
    // check whether all subpages are visible 
    const visibleButtons = this.showSignalHolder.filter((btn: any) => btn?.value === true).length
    this.allSubpageVisible = visibleButtons === this.numberOfItems ? true : false;
    if (this.allSubpageVisible === true) { return; }

    // check if any subpage needs to be added to make the container scrollable
    this.scrollToMiddleRange();
    if (this.centerItems === true) {
      const { scrollWidth, offsetWidth, scrollHeight, offsetHeight } = this._elContainer;
      this.scrollbarDimension = this.orientation === "horizontal" ? Math.floor(offsetWidth / scrollWidth * 100) : Math.floor(offsetHeight / scrollHeight * 100);
      this.checkCenterItems();
    }
  }

  private getFirstChild() {
    return Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
  }

  private getLastChild() {
    return Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
  }


  private scrollToRightEdgeRange() {
    let counter = 0;
    for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
      if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
    }
    let k = 0;
    while (counter !== 0 && k < counter && this.getFirstChild() !== 0) {
      if (this.showSignalHolder[this.getFirstChild() - 1].value === true) { k = k + 1; }
      this.createSubpage(this.getFirstChild() - 1, false);
    }
  }

  private scrollToMiddleRange() {
    let counter = 0;
    for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
      if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
    }
    let k = 0;
    while (counter !== 0 && k < counter && this.getFirstChild() !== 0) {
      if (this.showSignalHolder[this.getFirstChild() - 1].value === true) { k = k + 1; }
      this.createSubpage(this.getFirstChild() - 1, false);
    }
    while (counter !== 0 && k < counter && this.getLastChild() !== this.numberOfItems - 1) {
      if (this.showSignalHolder[this.getLastChild() + 1].value === true) { k = k + 1; }
      this.createSubpage(this.getLastChild() + 1);
    }
  }

  private scrollToLeftEdgeRange() {
    let counter = 0;
    for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
      if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
    }
    let k = 0;
    while (counter !== 0 && k < counter && this.getLastChild() !== this.numberOfItems - 1) {
      if (this.showSignalHolder[this.getLastChild() + 1].value === true) { k = k + 1; }
      this.createSubpage(this.getLastChild() + 1);
    }
  }

  private checkCenterItems() {
    if (this.centerItems === true) {
      if (this.scrollbarDimension < 100) {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + "true");
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + "false");
      } else {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + "false");
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + "true");
      }
    }
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  //#endregion

}

Ch5SubpageReferenceList.registerCustomElement();
Ch5SubpageReferenceList.registerSignalAttributeTypes();

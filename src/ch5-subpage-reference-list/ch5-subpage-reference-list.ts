import { Ch5Common } from "../ch5-common/ch5-common";
import { isEmpty, isNil } from 'lodash';
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SubpageReferenceListOrientation, TCh5SubpageReferenceListStretch, } from './interfaces/t-ch5-subpage-reference-list';
import { ICh5SubpageReferenceListAttributes } from './interfaces/i-ch5-subpage-reference-list-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { resizeObserver } from "../ch5-core/resize-observer";

export class Ch5SubpageReferenceList extends Ch5Common implements ICh5SubpageReferenceListAttributes {

  //#region Variables
  // ClassList Prefix
  public static readonly ROWS_CLASSLIST_PREFIX: string = '--rows-';
  public static readonly COLUMNS_CLASSLIST_PREFIX: string = '--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = '--scrollbar-';
  public static readonly CENTER_ITEMS_CLASSLIST_PREFIX: string = '--center-items-';

  // Subpage container dimension and Buffer values
  public static readonly SUBPAGE_CONTAINER_BUFFER: number = 2;
  public static readonly STRETCH: TCh5SubpageReferenceListStretch[] = ['null', 'both'];
  public static readonly ORIENTATION: TCh5SubpageReferenceListOrientation[] = ['horizontal', 'vertical'];
  public static readonly COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5SubpageReferenceList.ORIENTATION[0],
      values: Ch5SubpageReferenceList.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
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
    booleanjoinoffset: { direction: "state", booleanJoin: 1, contractName: true },
    numericjoinoffset: { direction: "state", numericJoin: 1, contractName: true },
    stringjoinoffset: { direction: "state", stringJoin: 1, contractName: true },
    subpagereceivestateenable: { direction: "state", stringJoin: 1, contractName: true },
    subpagereceivestatevisible: { direction: "state", stringJoin: 1, contractName: true },
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
      name: "columns",
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
      name: "scrollbar",
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
      name: "widgetId",
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
  private loadedSubpages: number = 0;
  private destroyedSubpagesLeft: number = 0;
  private destroyedSubpagesRight: number = 0;
  private scrollbarReachedEnd: boolean = false;
  private scrollbarDimension: number = 0;
  private subpageWidth: number = 0;
  private subpageHeight: number = 0;

  // Default Row and Column value
  private rowClassValue: number = 1;
  private columnsClassValue: number = 1;
  public debounceSubpageDisplay = this.debounce(() => {
    this.subpageDisplay();
  }, 100);
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

  public set scrollbar(value: boolean) {
    this._ch5Properties.set<boolean>("scrollbar", value, () => {
      this.handleScrollbar();
    });
  }
  public get scrollbar(): boolean {
    return this._ch5Properties.get<boolean>("scrollbar");
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
      this.handleRowsAndColumn();
    });
  }
  public get numberOfItems(): number {
    return this._ch5Properties.get<number>("numberOfItems");
  }

  public set receiveStateNumberOfItems(value: string) {
    this._ch5Properties.set("receiveStateNumberOfItems", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("numberOfItems", newValue, () => {
        this.handleRowsAndColumn();
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
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.initMembers();
    this.initCommonMutationObserver(this);
    this.debounceSubpageDisplay();
    resizeObserver(this._elContainer, this.resizeHandler);
    customElements.whenDefined(this.nodeName.toLowerCase()).then(() => {
      this.componentLoadedEvent(this.nodeName.toLowerCase(), this.id);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.initMembers();
    this.logger.stop();
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
  }

  private handleMouseUpAndLeave = () => {
    this.isDown = false;
    this._elContainer.classList.remove('active');
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this._elContainer.offsetLeft;
    const y = e.pageY - this._elContainer.offsetTop;
    const walkX = (x - this.startX) * 3;
    const walkY = (y - this.startY) * 3;
    this._elContainer.scrollLeft = this.scrollListLeft - walkX;
    this._elContainer.scrollTop = this.scrollListTop - walkY;
  }

  private handleScrollEvent = () => {
    // update the scrollbar width and position
    this.initScrollbar();
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    // Checking whether endless can be achieved
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + 20 < scrollWidth : offsetHeight + 20 < scrollHeight;
    // working of endless for left and top scroll
    if (this.loadedSubpages === this.numberOfItems && this.endless && endlessScrollable) {
      if (this.orientation === 'horizontal' && scrollLeft < 5) {
        for (let i = 0; i < this.rows; i++) {
          if (this._elContainer.lastElementChild) {
            this._elContainer.prepend(this._elContainer.lastElementChild);
          }
        }
        this._elContainer.scrollLeft += 5;
      } else if (this.orientation === 'vertical' && scrollTop < 5) {
        for (let i = 0; i < this.columns; i++) {
          if (this._elContainer.lastElementChild) {
            this._elContainer.prepend(this._elContainer.lastElementChild);
          }
        }
        this._elContainer.scrollTop += 5;
      }
    }

    let rowColumnValue = 0;
    if (this.endless && endlessScrollable) {
      if (this.orientation === "horizontal") {
        if (offsetWidth + scrollLeft < scrollWidth - 5) { return; }
        rowColumnValue = this.rows;
      } else {
        if (offsetHeight + scrollTop < scrollHeight - 5) { return; }
        rowColumnValue = this.columns;
      }
    } else {
      this.subpageDestroyHelper();
      if (this.orientation === "horizontal") {
        if (offsetWidth + scrollLeft < scrollWidth - this.subpageWidth) { return; }
        rowColumnValue = this.rows;
      } else {
        if (offsetHeight + scrollTop < scrollHeight - this.subpageHeight) { return; }
        rowColumnValue = this.columns;
      }
    }

    // check whether all the subpages are loaded
    if (this.loadedSubpages !== this.numberOfItems) {
      for (let i = this.loadedSubpages; i < this.loadedSubpages + rowColumnValue * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER && i < this.numberOfItems; i++) { this.createSubpage(i); }
      this.loadedSubpages = this.loadedSubpages + rowColumnValue * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER > this.numberOfItems ? this.numberOfItems : this.loadedSubpages + rowColumnValue * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
    }

    // working of endless for right and bottom scroll
    if (this.loadedSubpages === this.numberOfItems && this.endless && endlessScrollable) {
      if (this.orientation === 'horizontal') {
        for (let i = 0; i < this.rows; i++) {
          if (this._elContainer.firstElementChild) {
            this._elContainer.appendChild(this._elContainer.firstElementChild);
          }
        }
        this._elContainer.scrollLeft -= 5;
      } else if (this.orientation === 'vertical') {
        for (let i = 0; i < this.columns; i++) {
          if (this._elContainer.firstElementChild) {
            this._elContainer.appendChild(this._elContainer.firstElementChild);
          }
        }
        this._elContainer.scrollTop -= 5;
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
  private handleControlJoinID() {
    // Enter your Code here
  }
  public handleEndless() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    // This behavior is handled in scroll event
  }
  public handleCenterItems() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
  }
  public handleRowsAndColumn() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.orientation === "horizontal") {
      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COLUMNS_CLASSLIST_PREFIX + this.columnsClassValue);

      // Calculate New Row class value
      this.rowClassValue = this.rows < this.numberOfItems ? this.rows : this.numberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
    } else {

      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COLUMNS_CLASSLIST_PREFIX + this.columnsClassValue);
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);

      // Calculate New Row class value
      this.columnsClassValue = this.columns < this.numberOfItems ? this.columns : this.numberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.COLUMNS_CLASSLIST_PREFIX + this.columnsClassValue);
    }
    this.debounceSubpageDisplay();
  }

  public handleScrollbar() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this.initScrollbar();
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
  // Get the contents of the template

  private handleWidgetID() {

    if (isEmpty(this.widgetId)) {
      throw new Error('[ch5-subpage-reference-list] Error: No templateId was provided');
    }

    const template = document.getElementById(this.widgetId) as HTMLTemplateElement;
    if (!(template.tagName === "CH5-TEMPLATE"))
      throw new Error('[ch5-subpage-reference-list] Error: Incorrect tag used');

    if (!(isNil(template))) {
      this._templateElement = template as HTMLTemplateElement;
      this.info("Ch5TemplateStructure --- the following template will be used:", this._templateElement);
    } else {
      throw new Error(`[ch5-subpage-reference-list] Error: No ch5-template with the id: "${this.widgetId}" found`);
    }
    this.debounceSubpageDisplay();
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
  private handleIndexId() {
    // Enter your Code here
  }
  public subpageDisplay() {
    // The below line is added to remove the stretch class before calculating the subpage dimension
    this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // create first subpage and find the dimension of the subpage
    this.createSubpage(0);
    this.subpageWidth = this._elContainer.children[0].getBoundingClientRect().width;
    this.subpageHeight = this._elContainer.children[0].getBoundingClientRect().height;
    if (this.orientation === 'horizontal') {
      // Find the number of initial subpages which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      this.loadedSubpages = Math.floor(containerWidth / this.subpageWidth) * this.rows + this.rows * 2;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > this.subpageHeight) {
        this.loadedSubpages = Math.floor(containerHeight / this.subpageHeight) * this.columns + this.columns * 2;
      } else {
        this.loadedSubpages = this.numberOfItems;
      }
    }
    this.loadedSubpages = this.loadedSubpages > this.numberOfItems ? this.numberOfItems : this.loadedSubpages;
    for (let index = 1; index < this.loadedSubpages; index++) {
      this.createSubpage(index);
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    if (this.centerItems === true && this.scrollbarDimension < 100) { this.centerItems = false; }
  }
  private createSubpage(index: number, append: boolean = true) {
    if (isNil(this._templateElement)) {
      throw new Error('[ch5-subpage-reference-list] Error: Incorrect tag used');
    }
    const documentContainer: HTMLTemplateElement = document.createElement('template');
    // const documentInnerContainer: HTMLElement = document.createElement('div');
    // documentInnerContainer.appendChild(this._templateElement)
    // documentContainer.innerHTML = documentInnerContainer.innerHTML;
    documentContainer.innerHTML = this._templateElement.innerHTML;
    const spgContainer = document.createElement("div");
    spgContainer.classList.add(this.nodeName.toLowerCase() + "--subpage-container");
    spgContainer.appendChild(((documentContainer as HTMLTemplateElement).content));
    append ? this._elContainer.appendChild(spgContainer) : this._elContainer.prepend(spgContainer);
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();

    if (this.stretch) {
      this._elContainer.classList.add(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    // Set default rows 
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.ROWS_CLASSLIST_PREFIX + this.rows);
    // Sets default scroll bar class
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    // sets default center item class
    this._elContainer.classList.add(Ch5SubpageReferenceList.ELEMENT_NAME + Ch5SubpageReferenceList.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
    this.logger.stop();
    this.logger.stop();
  }
  private initScrollbar() {
    if (this.orientation === "horizontal") {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(scrollLeft / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = scrollbarLeft + '%';
      if (scrollLeft === 0) {
        this.scrollbarReachedEnd = false;
      } else if (this.scrollbarDimension + scrollbarLeft === 100 && this.numberOfItems === this.loadedSubpages) {
        this.scrollbarReachedEnd = true;
      }
    } else {
      const { scrollHeight, offsetHeight, scrollTop } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      const scrollbarTop = Math.ceil(scrollTop / scrollHeight * 100);
      this._scrollbar.style.removeProperty('width');
      this._scrollbar.style.removeProperty('left');
      this._scrollbar.style.height = this.scrollbarDimension + '%';
      this._scrollbar.style.top = scrollbarTop + '%';
      if (scrollTop === 0) {
        this.scrollbarReachedEnd = false;
      } else if (this.scrollbarDimension + scrollbarTop === 100 && this.numberOfItems === this.loadedSubpages) {
        this.scrollbarReachedEnd = true;
      }
    }
    if (this.scrollbar) {
      if (this.scrollbarDimension === 100) {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5SubpageReferenceList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      } else {
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
  private subpageDestroyHelper() {
    if (this.orientation === 'horizontal') {
      const { scrollLeft, scrollWidth, offsetWidth } = this._elContainer;
      if (scrollLeft < this.subpageWidth && this.destroyedSubpagesLeft !== 0) {
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(this.destroyedSubpagesLeft - 1, false);
          this.destroyedSubpagesLeft--;
        }
        this._elContainer.scrollLeft += this.subpageWidth;
      }
      if (scrollLeft > this.subpageWidth * 2.5 && this.scrollbarReachedEnd === false) {
        if (scrollLeft + offsetWidth > scrollWidth - this.subpageWidth) { return }
        for (let i = 0; i < this.rows; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedSubpagesLeft++;
        }
        this._elContainer.scrollLeft -= this.subpageWidth;
      }
      if (scrollLeft + offsetWidth < scrollWidth - this.subpageWidth * 2.5 && this.scrollbarReachedEnd) {
        if (scrollLeft <= this.subpageWidth) { return; }
        for (let i = 0; i < this.rows; i++) {
          this._elContainer.lastElementChild?.remove();
          this.destroyedSubpagesRight++;
        }
      }
      if (scrollLeft + offsetWidth > scrollWidth - this.subpageWidth && this.destroyedSubpagesRight !== 0) {
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(this.numberOfItems - this.destroyedSubpagesRight, true);
          this.destroyedSubpagesRight--;
        }
      }
    } else {
      const { scrollTop, scrollHeight, offsetHeight } = this._elContainer;
      if (scrollTop < this.subpageHeight && this.destroyedSubpagesLeft !== 0) {
        for (let i = 0; i < this.columns; i++) {
          this.createSubpage(this.destroyedSubpagesLeft - 1, false);
          this.destroyedSubpagesLeft--;
        }
        this._elContainer.scrollTop += this.subpageHeight;
      }
      if (scrollTop > this.subpageHeight * 3 && this.scrollbarReachedEnd === false) {
        if (scrollTop + offsetHeight > scrollHeight - this.subpageHeight) { return }
        for (let i = 0; i < this.columns; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedSubpagesLeft++;
        }
        this._elContainer.scrollTop -= this.subpageHeight;
      }
      if (scrollTop + offsetHeight < scrollHeight - this.subpageHeight * 3 && this.scrollbarReachedEnd) {
        if (scrollTop <= this.subpageHeight) { return; }
        for (let i = 0; i < this.columns; i++) {
          this._elContainer.lastElementChild?.remove();
          this.destroyedSubpagesRight++;
        }
      }
      if (scrollTop + offsetHeight > scrollHeight - this.subpageHeight && this.destroyedSubpagesRight !== 0) {
        for (let i = 0; i < this.columns; i++) {
          this.createSubpage(this.numberOfItems - this.destroyedSubpagesRight, true);
          this.destroyedSubpagesRight--;
        }
      }
    }
  }
  private resizeHandler = () => {
    if (this.orientation === 'horizontal' && this._elContainer.children.length !== 0) {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      let loadableSubpages = Math.floor(containerWidth / this.subpageWidth) * this.rows + this.rows * 2;
      loadableSubpages = loadableSubpages > this.numberOfItems ? this.numberOfItems : loadableSubpages;
      for (let i = this.loadedSubpages; i < loadableSubpages; i++) {
        this.createSubpage(this.loadedSubpages++);
      }
    }
    this.initScrollbar();
  }
  private initMembers() {
    this.destroyedSubpagesLeft = 0;
    this.destroyedSubpagesRight = 0;
    this.scrollbarReachedEnd = false;
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

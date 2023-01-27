import { Ch5Common } from "../ch5-common/ch5-common";
import { isEmpty, isNil } from 'lodash';
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SubpageReferenceListOrientation, TCh5SubpageReferenceListStretch, } from './interfaces/t-ch5-subpage-reference-list';
import { ICh5SubpageReferenceListAttributes } from './interfaces/i-ch5-subpage-reference-list-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { resizeObserver } from "../ch5-core/resize-observer";
import { Ch5AugmentVarSignalsNames } from '../ch5-common/ch5-augment-var-signals-names';
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core';

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
      type: "number",
      valueOnAttributeEmpty: 0,
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
      valueOnAttributeEmpty: true,
      isObservableProperty: true,

    },
    {
      default: "0",
      isSignal: true,
      name: "booleanJoinOffset",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "0",
      isSignal: true,
      name: "numericJoinOffset",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "0",
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
      name: "subpageReceiveStateEnable",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "subpageReceiveStateVisible",
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

  public debounceHandleScrollToPosition = this.debounce((value: number) => {
    this.handleScrollToPosition(value);
  }, 400);

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

  public set controlJoinID(value: string) {
    this._ch5Properties.set<string>("controlJoinID", value, () => {
      // enter Code
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

  public set scrollToPosition(value: number) {
    this._ch5Properties.set<number>("scrollToPosition", value, () => {
      this.debounceHandleScrollToPosition(this.scrollToPosition);
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

  public set booleanJoinOffset(value: string) {
    this._ch5Properties.set("booleanJoinOffset", value, null, (newValue: boolean) => {
      // enter code
    });
  }
  public get booleanJoinOffset(): string {
    return this._ch5Properties.get<string>('booleanJoinOffset');
  }

  public set numericJoinOffset(value: string) {
    this._ch5Properties.set("numericJoinOffset", value, null, (newValue: number) => {
      // enter code
    });
  }
  public get numericJoinOffset(): string {
    return this._ch5Properties.get<string>('numericJoinOffset');
  }

  public set stringJoinOffset(value: string) {
    this._ch5Properties.set("stringJoinOffset", value, null, (newValue: string) => {
      // enter code
    });
  }
  public get stringJoinOffset(): string {
    return this._ch5Properties.get<string>('stringJoinOffset');
  }

  public set subpageReceiveStateEnable(value: string) {
    this._ch5Properties.set<string>("subpageReceiveStateEnable", value, () => {
      this.debounceSubpageDisplay();
    });
  }
  public get subpageReceiveStateEnable(): string {
    return this._ch5Properties.get<string>('subpageReceiveStateEnable');
  }

  public set subpageReceiveStateVisible(value: string) {
    this._ch5Properties.set<string>("subpageReceiveStateVisible", value, () => {
      this.debounceSubpageDisplay();
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
      this._ch5Properties.setForSignalResponse<number>("scrollToPosition", newValue, () => {
        this.debounceHandleScrollToPosition(newValue);
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
        this.handleRowsAndColumn();
      });
    });
  }
  public get receiveStateNumberOfItems(): string {
    return this._ch5Properties.get<string>('receiveStateNumberOfItems');
  }

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value, () => {
      // enter code
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
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "receivestatehidepulse", "receivestateshowpulse", "sendeventonshow"];
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
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5SubpageReferenceList);
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
    // needed for preload-true for the calculation of bars height and width depending upon parent
    subscribeInViewPortChange(this, () => {
      if (this.elementIsInViewPort) {
        this.debounceSubpageDisplay();
        this.debounceHandleScrollToPosition(this.scrollToPosition);
      }
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.initMembers();
    unSubscribeInViewPortChange(this);
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
    if (!this.isDown) { return; }
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

    // endless is handled in endlessHelper method
    if (this.endless) { return this.endlessHelper(); }

    // auto deletion and addition of subpages is handled
    if (this.orientation === 'horizontal') {
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.subpageWidth) { return; }
      let firstElement = Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
      let lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
      if (scrollLeft < 5 && firstElement !== 0) {
        let lastColumnElements = (lastElement + 1) % this.rows;
        for (let i = 0; i < this.rows; i++) {
          this.createSubpage(--firstElement, false);
          if ((lastElement + 1) % this.rows !== 0) {
            if (lastColumnElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollLeft += 5;
      } else if (scrollLeft + offsetWidth > scrollWidth - 5 && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          if (lastElement + 1 < this.numberOfItems) { this.createSubpage(++lastElement); }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft -= 5;
      }
    } else {
      const { offsetHeight, scrollTop, scrollHeight } = this._elContainer;
      let firstElement = Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
      let lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
      if (scrollTop < 5 && firstElement !== 0) {
        let lastRowElements = (lastElement + 1) % this.columns;
        for (let i = 0; i < this.columns; i++) {
          this.createSubpage(--firstElement, false);
          if ((lastElement + 1) % this.columns !== 0) {
            if (lastRowElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollTop += 5;
      } else if (scrollTop + offsetHeight > scrollHeight - 5 && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.columns; i++) {
          if (lastElement + 1 < this.numberOfItems) { this.createSubpage(++lastElement); }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollTop -= 5;
      }
    }
  }
  private endlessHelper() {
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + 20 < scrollWidth : offsetHeight + 20 < scrollHeight;
    if (endlessScrollable === false) { return; }
    if (this.orientation === 'horizontal') {
      if (scrollLeft < 5) {
        const firstElement = Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollLeft += 10;
      } else if (scrollLeft + offsetWidth > scrollWidth - 5) {
        const lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollLeft -= 10;
      }
    } else {
      if (scrollTop < 5) {
        const firstElement = Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createSubpage(index, false);
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollTop += 10;
      } else if (scrollTop + offsetHeight > scrollHeight - 5) {
        const lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createSubpage(index);
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollTop -= 10;
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

  public handleScrollToPosition(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the button list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    // return if all the buttons fits in the container
    if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const totalButtonWidth = this.subpageWidth * this.numberOfItems;
      if (containerWidth > totalButtonWidth) { return; }
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      const totalButtonHeight = this.subpageHeight * this.numberOfItems;
      if (containerHeight > totalButtonHeight) { return; }
    }

    // Remove all the children in the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const loadableSubPageList = Math.ceil(containerWidth / this.subpageWidth) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      // Right Edge case
      if (value >= this.numberOfItems - (loadableSubPageList - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableSubPageList; i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollLeft = value === this.numberOfItems - 1 ? this.subpageWidth * 3 : this.subpageWidth * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      }
      // In between the range
      else if (value >= Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER) {
        for (let i = value - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER; i < value + loadableSubPageList; i++) { this.createSubpage(i); }
        this._elContainer.scrollLeft = this.subpageWidth * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      }
      // Left Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableSubPageList; i++) { this.createSubpage(i); }
        this._elContainer.scrollLeft = this.subpageWidth * value;
      }
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      const loadableSubPageList = Math.ceil(containerHeight / this.subpageHeight) + Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      // Bottom Edge case
      if (value >= this.numberOfItems - (loadableSubPageList - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableSubPageList; i < this.numberOfItems; i++) { this.createSubpage(i); }
        this._elContainer.scrollTop = value === this.numberOfItems - 1 ? this.subpageHeight * 3 : this.subpageHeight * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      }
      // In between the range
      else if (value >= Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER) {
        for (let i = value - Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER; i < value + loadableSubPageList; i++) { this.createSubpage(i); }
        this._elContainer.scrollTop = this.subpageHeight * Ch5SubpageReferenceList.SUBPAGE_CONTAINER_BUFFER;
      }
      // Top Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableSubPageList; i++) { this.createSubpage(i); }
        this._elContainer.scrollTop = this.subpageHeight * value;
      }
    }
    this.initScrollbar();
  }

  private handleWidgetID() {

    if (isEmpty(this.widgetId)) {
      throw new Error('[ch5-subpage-reference-list] Error: No templateId was provided');
    }

    const template = document.getElementById(this.widgetId) as HTMLTemplateElement;
    // if (!(template.tagName === "CH5-TEMPLATE")){
    //   throw new Error('[ch5-subpage-reference-list] Error: Incorrect tag used'); }

    if (!(isNil(template))) {
      this._templateElement = template as HTMLTemplateElement;
    } else {
      throw new Error(`[ch5-subpage-reference-list] Error: No ch5-template with the id: "${this.widgetId}" found`);
    }
    this.debounceSubpageDisplay();
  }

  private handleStretch() {
    Array.from(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + e);
    });
    if (!this.stretch) {
      this._elContainer.classList.add(Ch5SubpageReferenceList.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }
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
  private replaceAll(str: string, find: string, replace: string) {
    if (str && String(str).trim() !== "") {
      return String(str).split(find).join(replace);
    } else {
      return str;
    }
  }
  private createSubpage(index: number, append: boolean = true) {
    if (isNil(this._templateElement)) {
      throw new Error('[ch5-subpage-reference-list] Error: Incorrect tag used');
    }
    const documentContainer: HTMLTemplateElement = document.createElement('template');
    documentContainer.innerHTML = this._templateElement.innerHTML;
    const spgContainer = document.createElement("div");
    spgContainer.setAttribute('id', this.getCrId() + '-' + index);
    if (this.hasAttribute('subpageReceiveStateVisible') && this.getAttribute("subpageReceiveStateVisible")?.trim() && !this.hasAttribute('receiveStateShow')) {

      spgContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("subpageReceiveStateVisible")?.trim() + '', `{{${this.indexId}}}`, index + ''));
      spgContainer.setAttribute('data-ch5-noshow-type', 'display');
    } else if (this.hasAttribute('receiveStateShow')) {
      spgContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("receiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
      spgContainer.setAttribute('data-ch5-noshow-type', 'display');
    }
    if (this.hasAttribute('subpageReceiveStateEnable') && this.getAttribute("subpageReceiveStateEnable")?.trim() && !this.hasAttribute('receiveStateEnable')) {

      spgContainer.setAttribute('data-ch5-enable', this.replaceAll(this.getAttribute("subpageReceiveStateEnable")?.trim() + '', `{{${this.indexId}}}`, index + ''));
    } else if (this.hasAttribute('receiveStateEnable')) {
      spgContainer.setAttribute('data-ch5-enable', this.replaceAll(this.getAttribute("receiveStateEnable")?.trim() + '', `{{${this.indexId}}}`, index + ''));
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
    // update templateContent attributes to increment join numbers and prefix contract name
    Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(spgContainer, this.controlJoinID || '',
      parseInt(this.booleanJoinOffset, 10) || 0,
      parseInt(this.numericJoinOffset, 10) || 0,
      parseInt(this.stringJoinOffset, 10) || 0);
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

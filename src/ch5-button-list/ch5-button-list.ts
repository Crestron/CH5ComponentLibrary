import { Ch5Button } from "../ch5-button/ch5-button";
import { Ch5ButtonMode } from "../ch5-button/ch5-button-mode";
import { Ch5ButtonLabel } from "../ch5-button/ch5-button-label";
import { Ch5GenericListAttributes } from "../ch5-generic-list-attributes/ch5-generic-list-attributes";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape, } from './interfaces/t-ch5-button-list';
import { ICh5ButtonListAttributes } from './interfaces/i-ch5-button-list-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5ButtonListMode } from "../ch5-button-list/ch5-button-list-mode";
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core/index';

export class Ch5ButtonList extends Ch5GenericListAttributes implements ICh5ButtonListAttributes {

  // ClassList Prefix

  public static readonly ROWS_CLASSLIST_PREFIX: string = 'ch5-button-list--rows-';
  public static readonly COLUMNS_CLASSLIST_PREFIX: string = 'ch5-button-list--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = 'ch5-button-list--scrollbar-';
  public static readonly DEFAULT_BUTTON_WIDTH_PX: number = 92;
  //#region Variables

  public static readonly BUTTON_TYPE: TCh5ButtonListButtonType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly BUTTON_HALIGN_LABEL: TCh5ButtonListButtonHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly BUTTON_VALIGN_LABEL: TCh5ButtonListButtonVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly BUTTON_CHECKBOX_POSITION: TCh5ButtonListButtonCheckboxPosition[] = ['left', 'right'];
  public static readonly BUTTON_ICON_POSITION: TCh5ButtonListButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];
  public static readonly BUTTON_SHAPE: TCh5ButtonListButtonShape[] = ['rounded-rectangle', 'rectangle'];
  public static readonly COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5ButtonList.ORIENTATION[0],
      values: Ch5ButtonList.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: 'ch5-button-list--orientation-'
    },

    STRETCH: {
      default: Ch5ButtonList.STRETCH[0],
      values: Ch5ButtonList.STRETCH,
      key: 'stretch',
      attribute: 'stretch',
      classListPrefix: 'ch5-button-list--stretch-'
    },

    BUTTON_TYPE: {
      default: Ch5ButtonList.BUTTON_TYPE[0],
      values: Ch5ButtonList.BUTTON_TYPE,
      key: 'buttonType',
      attribute: 'buttonType',
      classListPrefix: 'ch5-button-list--button-type-'
    },

    BUTTON_HALIGN_LABEL: {
      default: Ch5ButtonList.BUTTON_HALIGN_LABEL[0],
      values: Ch5ButtonList.BUTTON_HALIGN_LABEL,
      key: 'buttonHAlignLabel',
      attribute: 'buttonHAlignLabel',
      classListPrefix: 'ch5-button-list--button-halign-label-'
    },

    BUTTON_VALIGN_LABEL: {
      default: Ch5ButtonList.BUTTON_VALIGN_LABEL[0],
      values: Ch5ButtonList.BUTTON_VALIGN_LABEL,
      key: 'buttonVAlignLabel',
      attribute: 'buttonVAlignLabel',
      classListPrefix: 'ch5-button-list--button-valign-label-'
    },

    BUTTON_CHECKBOX_POSITION: {
      default: Ch5ButtonList.BUTTON_CHECKBOX_POSITION[0],
      values: Ch5ButtonList.BUTTON_CHECKBOX_POSITION,
      key: 'buttonCheckboxPosition',
      attribute: 'buttonCheckboxPosition',
      classListPrefix: 'ch5-button-list--button-checkbox-position-'
    },

    BUTTON_ICON_POSITION: {
      default: Ch5ButtonList.BUTTON_ICON_POSITION[0],
      values: Ch5ButtonList.BUTTON_ICON_POSITION,
      key: 'buttonIconPosition',
      attribute: 'buttonIconPosition',
      classListPrefix: 'ch5-button-list--button-icon-position-'
    },

    BUTTON_SHAPE: {
      default: Ch5ButtonList.BUTTON_SHAPE[0],
      values: Ch5ButtonList.BUTTON_SHAPE,
      key: 'buttonShape',
      attribute: 'buttonShape',
      classListPrefix: 'ch5-button-list--button-shape-'
    },
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5GenericListAttributes.SIGNAL_ATTRIBUTE_TYPES,
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5ButtonList.BUTTON_TYPE[0],
      enumeratedValues: Ch5ButtonList.BUTTON_TYPE,
      name: "buttonType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonList.BUTTON_HALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonList.BUTTON_HALIGN_LABEL,
      name: "buttonHAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_HALIGN_LABEL[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonList.BUTTON_VALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonList.BUTTON_VALIGN_LABEL,
      name: "buttonVAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_VALIGN_LABEL[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonList.BUTTON_CHECKBOX_POSITION[0],
      enumeratedValues: Ch5ButtonList.BUTTON_CHECKBOX_POSITION,
      name: "buttonCheckboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_CHECKBOX_POSITION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonList.BUTTON_ICON_POSITION[0],
      enumeratedValues: Ch5ButtonList.BUTTON_ICON_POSITION,
      name: "buttonIconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_ICON_POSITION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonList.BUTTON_SHAPE[0],
      enumeratedValues: Ch5ButtonList.BUTTON_SHAPE,
      name: "buttonShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_SHAPE[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "buttonCheckboxShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "buttonSelected",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "buttonPressed",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: 0,
      name: "buttonMode",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 99,
        conditionalMin: 0,
        conditionalMax: 99,
        conditionalMinValue: 0,
        conditionalMaxValue: 99
      },
      isObservableProperty: true
    },
    {
      default: 0,
      name: "clickHoldTime",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 50000,
        conditionalMin: 0,
        conditionalMax: 50000,
        conditionalMinValue: 0,
        conditionalMaxValue: 50000
      },
      isObservableProperty: true
    },
    {
      default: 0,
      name: "sgIconStyle",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 100,
        conditionalMin: 0,
        conditionalMax: 100,
        conditionalMinValue: 0,
        conditionalMaxValue: 100
      },
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "buttonIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "buttonLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "buttonLabelInnerHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonMode",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonSelected",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonScriptLabelHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonType",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateButtonIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "sendEventOnButtonClick",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "sendEventOnButtonTouch",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-button-list';

  public cssClassPrefix = 'ch5-button-list';
  public primaryCssClass = 'ch5-button-list';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _scrollbarContainer: HTMLElement = {} as HTMLElement;
  private _scrollbar: HTMLElement = {} as HTMLElement;

  private isDown = false;
  private startX: number = 0;
  private scrollListLeft: number = 0;
  private loadedButtons: number = 0;

  // private members used for window resize events
  private isResizeInProgress: boolean = false;
  private readonly RESIZE_DEBOUNCE: number = 500;



  private rowClassValue = 1;
  private columnClassValue = 1;


  //#endregion

  //#region Getters and Setters

  public set buttonType(value: TCh5ButtonListButtonType) {
    this._ch5Properties.set<TCh5ButtonListButtonType>("buttonType", value);
  }
  public get buttonType(): TCh5ButtonListButtonType {
    return this._ch5Properties.get<TCh5ButtonListButtonType>("buttonType");
  }

  public set buttonHAlignLabel(value: TCh5ButtonListButtonHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel", value);
  }
  public get buttonHAlignLabel(): TCh5ButtonListButtonHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel");
  }

  public set buttonVAlignLabel(value: TCh5ButtonListButtonVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel", value);
  }
  public get buttonVAlignLabel(): TCh5ButtonListButtonVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel");
  }

  public set buttonCheckboxPosition(value: TCh5ButtonListButtonCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition", value);
  }
  public get buttonCheckboxPosition(): TCh5ButtonListButtonCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition");
  }

  public set buttonIconPosition(value: TCh5ButtonListButtonIconPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonIconPosition>("buttonIconPosition", value);
  }
  public get buttonIconPosition(): TCh5ButtonListButtonIconPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonIconPosition>("buttonIconPosition");
  }

  public set buttonShape(value: TCh5ButtonListButtonShape) {
    this._ch5Properties.set<TCh5ButtonListButtonShape>("buttonShape", value);
  }
  public get buttonShape(): TCh5ButtonListButtonShape {
    return this._ch5Properties.get<TCh5ButtonListButtonShape>("buttonShape");
  }

  public set buttonCheckboxShow(value: boolean) {
    this._ch5Properties.set<boolean>("buttonCheckboxShow", value);
  }
  public get buttonCheckboxShow(): boolean {
    return this._ch5Properties.get<boolean>("buttonCheckboxShow");
  }

  public set buttonSelected(value: boolean) {
    this._ch5Properties.set<boolean>("buttonSelected", value);
  }
  public get buttonSelected(): boolean {
    return this._ch5Properties.get<boolean>("buttonSelected");
  }

  public set buttonPressed(value: boolean) {
    this._ch5Properties.set<boolean>("buttonPressed", value);
  }
  public get buttonPressed(): boolean {
    return this._ch5Properties.get<boolean>("buttonPressed");
  }

  public set buttonMode(value: number) {
    this._ch5Properties.set<number>("buttonMode", value);
  }
  public get buttonMode(): number {
    return +this._ch5Properties.get<number>("buttonMode");
  }

  public set clickHoldTime(value: number) {
    this._ch5Properties.set<number>("clickHoldTime", value, () => {
      this.handleClickHoldTime();
    });
  }
  public get clickHoldTime(): number {
    return +this._ch5Properties.get<number>("clickHoldTime");
  }

  public set sgIconStyle(value: number) {
    this._ch5Properties.set<number>("sgIconStyle", value, () => {
      this.handleSgIconStyle();
    });
  }
  public get sgIconStyle(): number {
    return +this._ch5Properties.get<number>("sgIconStyle");
  }

  public set buttonIconClass(value: string) {
    this._ch5Properties.set<string>("buttonIconClass", value);
  }
  public get buttonIconClass(): string {
    return this._ch5Properties.get<string>("buttonIconClass");
  }

  public set buttonIconUrl(value: string) {
    this._ch5Properties.set<string>("buttonIconUrl", value);
  }
  public get buttonIconUrl(): string {
    return this._ch5Properties.get<string>("buttonIconUrl");
  }

  public set buttonLabel(value: string) {
    this._ch5Properties.set<string>("buttonLabel", value);
  }
  public get buttonLabel(): string {
    return this._ch5Properties.get<string>("buttonLabel");
  }

  public set buttonLabelInnerHtml(value: string) {
    this._ch5Properties.set<string>("buttonLabelInnerHtml", value);
  }
  public get buttonLabelInnerHtml(): string {
    return this._ch5Properties.get<string>("buttonLabelInnerHtml");
  }

  public set receiveStateButtonMode(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonMode", value);
  }
  public get receiveStateButtonMode(): string {
    return this._ch5Properties.get<string>("receiveStateButtonMode");
  }

  public set receiveStateButtonSelected(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonSelected", value);
  }
  public get receiveStateButtonSelected(): string {
    return this._ch5Properties.get<string>("receiveStateButtonSelected");
  }

  public set receiveStateButtonLabel(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonLabel", value);
  }
  public get receiveStateButtonLabel(): string {
    return this._ch5Properties.get<string>("receiveStateButtonLabel");
  }

  public set receiveStateButtonScriptLabelHtml(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonScriptLabelHtml", value);
  }
  public get receiveStateButtonScriptLabelHtml(): string {
    return this._ch5Properties.get<string>("receiveStateButtonScriptLabelHtml");
  }

  public set receiveStateButtonIconClass(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonIconClass", value);
  }
  public get receiveStateButtonIconClass(): string {
    return this._ch5Properties.get<string>("receiveStateButtonIconClass");
  }

  public set receiveStateButtonType(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonType", value);
  }
  public get receiveStateButtonType(): string {
    return this._ch5Properties.get<string>("receiveStateButtonType");
  }

  public set receiveStateButtonIconUrl(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonIconUrl", value);
  }
  public get receiveStateButtonIconUrl(): string {
    return this._ch5Properties.get<string>("receiveStateButtonIconUrl");
  }

  public set sendEventOnButtonClick(value: string) {
    this._ch5Properties.set<string>("sendEventOnButtonClick", value);
  }
  public get sendEventOnButtonClick(): string {
    return this._ch5Properties.get<string>("sendEventOnButtonClick");
  }

  public set sendEventOnButtonTouch(value: string) {
    this._ch5Properties.set<string>("sendEventOnButtonTouch", value);
  }
  public get sendEventOnButtonTouch(): string {
    return this._ch5Properties.get<string>("sendEventOnButtonTouch");
  }


  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ButtonList.ELEMENT_NAME, Ch5ButtonList.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ButtonList.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonList.ELEMENT_NAME, Ch5ButtonList);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5ButtonList.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5ButtonList.COMPONENT_PROPERTIES);
    this.initializeCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5GenericListAttributes.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5ButtonList.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonList.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5ButtonList.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-button-list attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ButtonList.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonList component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5ButtonList.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonList);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.buttonDisplay();
    subscribeInViewPortChange(this, () => {
      if (this.elementIsInViewPort) {
        this.initScrollbar();
      }
    });
    customElements.whenDefined('ch5-button-list').then(() => {
      this.componentLoadedEvent(Ch5ButtonList.ELEMENT_NAME, this.id);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
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
    for (let i: number = 0; i < Ch5ButtonList.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonList.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ButtonList.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ButtonList.COMPONENT_PROPERTIES[i].name;
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
    window.addEventListener('resize', this.onWindowResizeHandler.bind(this));

  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elContainer.removeEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._elContainer.removeEventListener('mouseup', this.handleMouseUpAndLeave);
    this._elContainer.removeEventListener('mousedown', this.handleMouseDown);
    this._elContainer.removeEventListener('mousemove', this.handleMouseMove);
    this._elContainer.removeEventListener('scroll', this.handleScrollEvent);
    window.removeEventListener('resize', this.onWindowResizeHandler);

  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  private handleMouseDown = (e: MouseEvent) => {
    this.isDown = true;
    this._elContainer.classList.add('active');
    this.startX = e.pageX - this._elContainer.offsetLeft;
    this.scrollListLeft = this._elContainer.scrollLeft;
  }
  private handleMouseUpAndLeave = () => {
    this.isDown = false;
    this._elContainer.classList.remove('active');
  }
  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this._elContainer.offsetLeft;
    const walk = (x - this.startX) * 3; // scroll-fast
    this._elContainer.scrollLeft = this.scrollListLeft - walk;
  }

  private handleScrollEvent = () => {
    const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;

    // update the scrollbar width and position

    this.initScrollbar();


    // return if scrollbar does not reach the end
    if (offsetWidth + scrollLeft < scrollWidth) {
      return;
    }

    // check whether all the buttons are loaded
    if (this.loadedButtons !== this.maxNumItems) {

      // if scrollbar reached the end then add the buffed elements
      for (let i = this.loadedButtons; i < this.rows + this.loadedButtons && i < this.maxNumItems; i++) { this.createButton(i); }
      this.loadedButtons = this.loadedButtons + this.rows > this.maxNumItems ? this.maxNumItems : this.loadedButtons + this.rows;

    } else if (this.endless) {
      console.log("endless");
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
    Array.from(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.values).forEach((orientation: any) => {
      this._elContainer.classList.remove(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.classListPrefix + orientation);
    });
    this._elContainer.classList.add(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
  }

  public handleStretch() {
    Array.from(Ch5ButtonList.COMPONENT_DATA.STRETCH.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5ButtonList.COMPONENT_DATA.STRETCH.classListPrefix + e);
    });
    if (!this.stretch) {
      this._elContainer.classList.add(Ch5ButtonList.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }
  }

  public handleScrollbar() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
  }

  public handleRowsAndColumn() {
    if (this.orientation === "horizontal") {
      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(Ch5ButtonList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      this._elContainer.classList.remove(Ch5ButtonList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);

      // Calculate New Row class value
      this.rowClassValue = this.rows < this.maxNumItems ? this.rows : this.maxNumItems;

      // Add the new class to the container
      this._elContainer.classList.add(Ch5ButtonList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
    } else {

      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(Ch5ButtonList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      this._elContainer.classList.remove(Ch5ButtonList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);

      // Calculate New Row class value
      this.columnClassValue = this.columns < this.maxNumItems ? this.columns : this.maxNumItems;

      // Add the new class to the container
      this._elContainer.classList.add(Ch5ButtonList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
    }
    this.buttonDisplay();
  }
  public handleCenterItems() {
    // Enter your Code here
  }
  public handleEndless() {
    // Enter your Code here
  }
  private handleClickHoldTime() {
    // Enter your Code here
  }
  private handleSgIconStyle() {
    // Enter your Code here
  }
  private buttonDisplay() {
    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // Find the number of initial buttons which can be loaded based on container width
    const containerWidth = this._elContainer.getBoundingClientRect().width;
    this.loadedButtons = Math.floor(containerWidth / Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) * this.rows + this.rows;
    for (let index = 0; index < this.loadedButtons && index < this.maxNumItems; index++) {
      this.createButton(index);
    }

    // init the scrollbar after loading the initial buttons 
    this.initScrollbar();
  }
  private createButton(index: number) {
    const btn = new Ch5Button();

    // Set all the button Attributes
    btn.setAttribute('stretch', 'both');
    Ch5ButtonList.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
      if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
        const attrValue = this.getAttribute(attr.name)?.trim().replace(`${this.indexId}`, index + '');
        if (attrValue) {
          btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue)
        }
      }
    });

    this.advancedButtonHelper(btn, index);

    // Add the button to container 
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("button-container");
    btnContainer.appendChild(btn);
    this._elContainer.appendChild(btnContainer);
  }

  private advancedButtonHelper(btn: Ch5Button, index: number) {
    const buttonListLabels = this.getElementsByTagName('ch5-button-list-label');
    if (buttonListLabels && buttonListLabels.length > 0) {
      Array.from(buttonListLabels).forEach((buttonListLabel) => {
        if (buttonListLabel.parentElement instanceof Ch5ButtonList) {
          const buttonListLabelTemplate = buttonListLabel.getElementsByTagName("template");
          if (buttonListLabelTemplate && buttonListLabelTemplate.length > 0) {
            const ch5ButtonLabel = new Ch5ButtonLabel();
            const template = document.createElement('template');
            template.innerHTML = buttonListLabelTemplate[0].innerHTML.replace(`${this.indexId}`, index.toString());
            ch5ButtonLabel.appendChild(template);
            btn.appendChild(ch5ButtonLabel);
          }
        }
      });
    }

    const buttonListModes = this.getElementsByTagName('ch5-button-list-mode');
    if (buttonListModes && buttonListModes.length > 0) {
      Array.from(buttonListModes).forEach((buttonListMode) => {
        if (buttonListMode.parentElement instanceof Ch5ButtonList) {
          const ch5ButtonMode = new Ch5ButtonMode();
          // ch5ButtonMode.setAttribute('debug', '');
          Ch5ButtonMode.observedAttributes.forEach((attr) => {
            if (buttonListMode.hasAttribute(attr)) {
              ch5ButtonMode.setAttribute(attr, buttonListMode.getAttribute(attr) + '');
            }
          });
          const buttonListModeLabels = buttonListMode.getElementsByTagName('ch5-button-list-label');
          if (buttonListModeLabels && buttonListModeLabels.length > 0) {
            Array.from(buttonListModeLabels).forEach((buttonListModeLabel) => {
              if (buttonListModeLabel.parentElement instanceof Ch5ButtonListMode) {
                const buttonListModeLabelTemplate = buttonListModeLabel.getElementsByTagName("template");
                if (buttonListModeLabelTemplate && buttonListModeLabelTemplate.length > 0) {
                  const ch5ButtonLabel = new Ch5ButtonLabel();
                  const template = document.createElement('template');
                  template.innerHTML = buttonListModeLabelTemplate[0].innerHTML.replace(`${this.indexId}`, index.toString());
                  ch5ButtonLabel.appendChild(template);
                  ch5ButtonMode.appendChild(ch5ButtonLabel);
                }
              }
            })
          }
          btn.appendChild(ch5ButtonMode);
        }
      })
    }
  }

  private initializeCssClass() {
    this.logger.start('initializeCssClass');

    // Default Orientation
    this._elContainer.classList.add(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);

    // Set default rows 
    this._elContainer.classList.add(Ch5ButtonList.ROWS_CLASSLIST_PREFIX + this.rows);

    // Sets default scroll bar class
    this._elContainer.classList.add(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);

    this.logger.stop();
  }

  private initScrollbar() {
    const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
    this._scrollbar.style.width = Math.floor(offsetWidth / scrollWidth * 100) + '%';
    this._scrollbar.style.left = Math.ceil(scrollLeft / scrollWidth * 100) + '%';
    if (this.scrollbar) {
      if (this._scrollbar.style.width === '100%') {
        this._elContainer.classList.remove(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
        this._elContainer.classList.add(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      } else {
        this._elContainer.classList.remove(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
        this._elContainer.classList.add(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
      }
    }

  }

  private checkInternalHTML() {
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-button-list');
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

  private onWindowResizeHandler() {
    if (!this.isResizeInProgress) {
      this.isResizeInProgress = true;
      setTimeout(() => {
        this.initScrollbar();
        this.isResizeInProgress = false; // reset debounce once completed
      }, this.RESIZE_DEBOUNCE);
    }
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.cssClassPrefix + '--disabled';
  }

  //#endregion

}

Ch5ButtonList.registerCustomElement();
Ch5ButtonList.registerSignalAttributeTypes();

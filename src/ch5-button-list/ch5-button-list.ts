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
import { Ch5ButtonListModeState } from "../ch5-button-list/ch5-button-list-mode-state";
import { Ch5ButtonModeState } from "../ch5-button/ch5-button-mode-state";
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core/index';

export class Ch5ButtonList extends Ch5GenericListAttributes implements ICh5ButtonListAttributes {

  //#region Variables

  // ClassList Prefix
  public static readonly ROWS_CLASSLIST_PREFIX: string = 'ch5-button-list--rows-';
  public static readonly COLUMNS_CLASSLIST_PREFIX: string = 'ch5-button-list--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = 'ch5-button-list--scrollbar-';

  // Button container dimension and Buffer values
  public static readonly BUTTON_CONTAINER_BUFFER: number = 3;
  public static readonly DEFAULT_BUTTON_WIDTH_PX: number = 100;
  public static readonly DEFAULT_BUTTON_HEIGHT_PX: number = 60;

  // Enum types
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
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_HALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonList.BUTTON_HALIGN_LABEL,
      name: "buttonHAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_HALIGN_LABEL[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_VALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonList.BUTTON_VALIGN_LABEL,
      name: "buttonVAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_VALIGN_LABEL[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_CHECKBOX_POSITION[0],
      enumeratedValues: Ch5ButtonList.BUTTON_CHECKBOX_POSITION,
      name: "buttonCheckboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_CHECKBOX_POSITION[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_ICON_POSITION[0],
      enumeratedValues: Ch5ButtonList.BUTTON_ICON_POSITION,
      name: "buttonIconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_ICON_POSITION[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_SHAPE[0],
      enumeratedValues: Ch5ButtonList.BUTTON_SHAPE,
      name: "buttonShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_SHAPE[0],
      isObservableProperty: true
    },
    {
      default: false,
      name: "buttonCheckboxShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: false,
      name: "buttonSelected",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: false,
      name: "buttonPressed",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
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
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonLabelInnerHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonMode",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonSelected",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonScriptLabelHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonType",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "receiveStateButtonIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "sendEventOnButtonClick",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "sendEventOnButtonTouch",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-button-list';

  public cssClassPrefix = 'ch5-button-list';
  public primaryCssClass = 'ch5-button-list';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _scrollbarContainer: HTMLElement = {} as HTMLElement;
  private _scrollbar: HTMLElement = {} as HTMLElement;

  // private members used for mouse up and down
  private isDown = false;
  private startX: number = 0;
  private startY: number = 0;
  private scrollListLeft: number = 0;
  private scrollListTop: number = 0;
  private loadedButtons: number = 0;

  // private members used for window resize events
  private isResizeInProgress: boolean = false;
  private readonly RESIZE_DEBOUNCE: number = 500;

  // Default Row and Column value
  private rowClassValue: number = 1;
  private columnClassValue: number = 1;

  //#endregion

  //#region Getters and Setters

  public set buttonType(value: TCh5ButtonListButtonType) {
    this._ch5Properties.set<TCh5ButtonListButtonType>("buttonType", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonType(): TCh5ButtonListButtonType {
    return this._ch5Properties.get<TCh5ButtonListButtonType>("buttonType");
  }

  public set buttonHAlignLabel(value: TCh5ButtonListButtonHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonHAlignLabel(): TCh5ButtonListButtonHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel");
  }

  public set buttonVAlignLabel(value: TCh5ButtonListButtonVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonVAlignLabel(): TCh5ButtonListButtonVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel");
  }

  public set buttonCheckboxPosition(value: TCh5ButtonListButtonCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonCheckboxPosition(): TCh5ButtonListButtonCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition");
  }

  public set buttonIconPosition(value: TCh5ButtonListButtonIconPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonIconPosition>("buttonIconPosition", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonIconPosition(): TCh5ButtonListButtonIconPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonIconPosition>("buttonIconPosition");
  }

  public set buttonShape(value: TCh5ButtonListButtonShape) {
    this._ch5Properties.set<TCh5ButtonListButtonShape>("buttonShape", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonShape(): TCh5ButtonListButtonShape {
    return this._ch5Properties.get<TCh5ButtonListButtonShape>("buttonShape");
  }

  public set buttonCheckboxShow(value: boolean) {
    this._ch5Properties.set<boolean>("buttonCheckboxShow", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonCheckboxShow(): boolean {
    return this._ch5Properties.get<boolean>("buttonCheckboxShow");
  }

  public set buttonSelected(value: boolean) {
    this._ch5Properties.set<boolean>("buttonSelected", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonSelected(): boolean {
    return this._ch5Properties.get<boolean>("buttonSelected");
  }

  public set buttonPressed(value: boolean) {
    this._ch5Properties.set<boolean>("buttonPressed", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonPressed(): boolean {
    return this._ch5Properties.get<boolean>("buttonPressed");
  }

  public set buttonMode(value: number) {
    this._ch5Properties.set<number>("buttonMode", value, () => {
      this.buttonDisplay();
    });
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
    this._ch5Properties.set<string>("buttonIconClass", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonIconClass(): string {
    return this._ch5Properties.get<string>("buttonIconClass");
  }

  public set buttonIconUrl(value: string) {
    this._ch5Properties.set<string>("buttonIconUrl", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonIconUrl(): string {
    return this._ch5Properties.get<string>("buttonIconUrl");
  }

  public set buttonLabel(value: string) {
    this._ch5Properties.set<string>("buttonLabel", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonLabel(): string {
    return this._ch5Properties.get<string>("buttonLabel");
  }

  public set buttonLabelInnerHtml(value: string) {
    this._ch5Properties.set<string>("buttonLabelInnerHtml", value, () => {
      this.buttonDisplay();
    });
  }
  public get buttonLabelInnerHtml(): string {
    return this._ch5Properties.get<string>("buttonLabelInnerHtml");
  }

  public set receiveStateButtonMode(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonMode", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonMode(): string {
    return this._ch5Properties.get<string>("receiveStateButtonMode");
  }

  public set receiveStateButtonSelected(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonSelected", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonSelected(): string {
    return this._ch5Properties.get<string>("receiveStateButtonSelected");
  }

  public set receiveStateButtonLabel(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonLabel", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonLabel(): string {
    return this._ch5Properties.get<string>("receiveStateButtonLabel");
  }

  public set receiveStateButtonScriptLabelHtml(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonScriptLabelHtml", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonScriptLabelHtml(): string {
    return this._ch5Properties.get<string>("receiveStateButtonScriptLabelHtml");
  }

  public set receiveStateButtonIconClass(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonIconClass", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonIconClass(): string {
    return this._ch5Properties.get<string>("receiveStateButtonIconClass");
  }

  public set receiveStateButtonType(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonType", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonType(): string {
    return this._ch5Properties.get<string>("receiveStateButtonType");
  }

  public set receiveStateButtonIconUrl(value: string) {
    this._ch5Properties.set<string>("receiveStateButtonIconUrl", value, () => {
      this.buttonDisplay();
    });
  }
  public get receiveStateButtonIconUrl(): string {
    return this._ch5Properties.get<string>("receiveStateButtonIconUrl");
  }

  public set sendEventOnButtonClick(value: string) {
    this._ch5Properties.set<string>("sendEventOnButtonClick", value, () => {
      this.buttonDisplay();
    });
  }
  public get sendEventOnButtonClick(): string {
    return this._ch5Properties.get<string>("sendEventOnButtonClick");
  }

  public set sendEventOnButtonTouch(value: string) {
    this._ch5Properties.set<string>("sendEventOnButtonTouch", value, () => {
      this.buttonDisplay();
    });
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
    this.initCssClass();
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
    subscribeInViewPortChange(this, () => {
      if (this.elementIsInViewPort) {
        this.buttonDisplay();
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
    this._elContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this._elContainer.addEventListener('mouseleave', this.handleMouseUpAndLeave.bind(this));
    this._elContainer.addEventListener('mouseup', this.handleMouseUpAndLeave.bind(this));
    this._elContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this._elContainer.addEventListener('scroll', this.handleScrollEvent.bind(this));
    window.addEventListener('resize', this.onWindowResizeHandler.bind(this));
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elContainer.removeEventListener('mouseleave', this.handleMouseUpAndLeave.bind(this));
    this._elContainer.removeEventListener('mouseup', this.handleMouseUpAndLeave.bind(this));
    this._elContainer.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this._elContainer.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this._elContainer.removeEventListener('scroll', this.handleScrollEvent.bind(this));
    window.removeEventListener('resize', this.onWindowResizeHandler.bind(this));
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  private handleMouseDown(e: MouseEvent) {
    this.isDown = true;
    this._elContainer.classList.add('active');
    if (this.orientation === "horizontal") {
      this.startX = e.pageX - this._elContainer.offsetLeft;
      this.scrollListLeft = this._elContainer.scrollLeft;
    } else {
      this.startY = e.pageY - this._elContainer.offsetTop;
      this.scrollListTop = this._elContainer.scrollTop;
    }
  }

  private handleMouseUpAndLeave() {
    this.isDown = false;
    this._elContainer.classList.remove('active');
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    if (this.orientation === "horizontal") {
      const x = e.pageX - this._elContainer.offsetLeft;
      const walk = (x - this.startX) * 3; // scroll-fast
      this._elContainer.scrollLeft = this.scrollListLeft - walk;
    } else {
      const y = e.pageY - this._elContainer.offsetTop;
      const walk = (y - this.startY) * 3;
      this._elContainer.scrollTop = this.scrollListTop - walk;
    }
  }

  private handleScrollEvent() {
    // update the scrollbar width and position
    this.initScrollbar();

    let rowColumnValue = 0;
    if (this.orientation === "horizontal") {
      if (this._elContainer.offsetWidth + this._elContainer.scrollLeft < this._elContainer.scrollWidth - Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) { return; }
      rowColumnValue = this.rows;
    } else {
      if (this._elContainer.offsetHeight + this._elContainer.scrollTop < this._elContainer.scrollHeight - Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) { return; }
      rowColumnValue = this.columns;
    }

    // check whether all the buttons are loaded
    if (this.loadedButtons !== this.maxNumItems) {
      for (let i = this.loadedButtons; i < this.loadedButtons + rowColumnValue * Ch5ButtonList.BUTTON_CONTAINER_BUFFER && i < this.maxNumItems; i++) { this.createButton(i); }
      this.loadedButtons = this.loadedButtons + rowColumnValue * Ch5ButtonList.BUTTON_CONTAINER_BUFFER > this.maxNumItems ? this.maxNumItems : this.loadedButtons + rowColumnValue * Ch5ButtonList.BUTTON_CONTAINER_BUFFER;
    } else if (this.endless) {
      this.logger.log("endless");
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
    this.initScrollbar();
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

  public buttonDisplay() {
    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    if (this.orientation === 'horizontal') {
      // Find the number of initial buttons which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      this.loadedButtons = Math.floor(containerWidth / Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) * this.rows + this.rows * 3;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) {
        this.loadedButtons = Math.floor(containerHeight / Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) * this.columns + this.columns * 3;
      } else {
        this.loadedButtons = this.maxNumItems;
      }
    }
    this.loadedButtons = this.loadedButtons > this.maxNumItems ? this.maxNumItems : this.loadedButtons;
    for (let index = 0; index < this.loadedButtons && index < this.maxNumItems; index++) {
      this.createButton(index);
    }
    // init the scrollbar after loading the initial buttons 
    this.initScrollbar();
  }


  private createButton(index: number) {
    const btn = new Ch5Button();
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("button-container");
    btnContainer.appendChild(btn);
    this._elContainer.appendChild(btnContainer);

    // button attributes helper
    this.buttonModeHelper(btn, index);
    this.buttonLabelHelper(btn, index);
    this.buttonHelper(btn, index);
  }

  private buttonModeHelper(btn: Ch5Button, index: number) {
    const buttonListModes = this.getElementsByTagName('ch5-button-list-mode');
    if (buttonListModes && buttonListModes.length > 0) {
      Array.from(buttonListModes).forEach((buttonListMode) => {
        if (buttonListMode.parentElement instanceof Ch5ButtonList) {
          const ch5ButtonMode = new Ch5ButtonMode(btn);
          Ch5ButtonMode.observedAttributes.forEach((attr) => {
            if (buttonListMode.hasAttribute(attr)) {
              ch5ButtonMode.setAttribute(attr, buttonListMode.getAttribute(attr) + '');
            }
          });

          const buttonListModeStates = buttonListMode.getElementsByTagName('ch5-button-list-mode-state');
          if (buttonListModeStates && buttonListModeStates.length > 0) {
            Array.from(buttonListModeStates).forEach(buttonListModeState => {
              if (buttonListModeState.parentElement instanceof Ch5ButtonListMode) {
                const buttonModeState = new Ch5ButtonModeState(btn);
                Ch5ButtonModeState.observedAttributes.forEach((attr) => {
                  if (buttonListModeState.hasAttribute(attr)) {
                    buttonModeState.setAttribute(attr, buttonListModeState.getAttribute(attr) + '');
                  }
                });

                const buttonModeStateLabels = buttonListModeState.getElementsByTagName("ch5-button-list-label");
                if (buttonModeStateLabels && buttonModeStateLabels.length > 0) {
                  Array.from(buttonModeStateLabels).forEach((buttonModeStateLabel) => {
                    if (buttonModeStateLabel.parentElement instanceof Ch5ButtonListModeState) {
                      const buttonModeStateLabelTemplate = buttonModeStateLabel.getElementsByTagName("template");
                      if (buttonModeStateLabelTemplate && buttonModeStateLabelTemplate.length > 0) {
                        const ch5ButtonLabel = new Ch5ButtonLabel();
                        const template = document.createElement('template');
                        template.innerHTML = buttonModeStateLabelTemplate[0].innerHTML.replace(`${this.indexId}`, index.toString());
                        ch5ButtonLabel.appendChild(template);
                        buttonModeState.appendChild(ch5ButtonLabel);
                      }
                    }
                  });
                }
                ch5ButtonMode.appendChild(buttonModeState);
              }
            });
          }
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
            });
          }
          btn.appendChild(ch5ButtonMode);
        }
      });
    }
  }

  private buttonLabelHelper(btn: Ch5Button, index: number) {
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
  }

  private async buttonHelper(btn: Ch5Button, index: number) {
    const individualButtons = this.getElementsByTagName('ch5-button-list-individual-button');
    const individualButtonsLength = individualButtons.length;
    btn.setAttribute('stretch', 'both');
    Ch5ButtonList.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
      if (index < individualButtonsLength) {
        if (attr.name === 'buttonLabelInnerHtml') {
          const attrValue = individualButtons[index].getAttribute('buttonlabelinnerhtml');
          if (attrValue) {
            btn.setAttribute('labelinnerhtml', attrValue);
          }
        } else if (attr.name === 'buttonIconClass') {
          const attrValue = individualButtons[index].getAttribute('iconclass');
          if (attrValue) {
            btn.setAttribute('iconclass', attrValue);
          }
        } else if (attr.name.toLowerCase() === 'buttoniconurl') {
          const attrValue = individualButtons[index].getAttribute('iconurl');
          if (attrValue) {
            btn.setAttribute('iconurl', attrValue);
          }
        } else {
          if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`${this.indexId}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue)
            }
          }
        }
      } else {
        if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
          const attrValue = this.getAttribute(attr.name)?.trim().replace(`${this.indexId}`, index + '');
          if (attrValue) {
            btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue)
          }
        }
      }
    });
  }

  private initCssClass() {
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
    if (this.scrollbar === false) { return; }

    let scrollbarDimension: number = 0;
    if (this.orientation === "horizontal") {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      this._scrollbar.style.width = scrollbarDimension + '%';
      this._scrollbar.style.left = Math.ceil(scrollLeft / scrollWidth * 100) + '%';
    } else {
      const { scrollHeight, offsetHeight, scrollTop } = this._elContainer;
      scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      this._scrollbar.style.height = scrollbarDimension + '%';
      this._scrollbar.style.top = Math.ceil(scrollTop / scrollHeight * 100) + '%';
    }
    if (scrollbarDimension === 100) {
      this._elContainer.classList.remove(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
      this._elContainer.classList.add(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
    } else {
      this._elContainer.classList.remove(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      this._elContainer.classList.add(Ch5ButtonList.SCROLLBAR_CLASSLIST_PREFIX + 'true');
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

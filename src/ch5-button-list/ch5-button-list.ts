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
import { resizeObserver } from "../ch5-core/resize-observer";

export class Ch5ButtonList extends Ch5GenericListAttributes implements ICh5ButtonListAttributes {

  //#region Variables

  // ClassList Prefix
  public static readonly ROWS_CLASSLIST_PREFIX: string = 'ch5-button-list--rows-';
  public static readonly COLUMNS_CLASSLIST_PREFIX: string = 'ch5-button-list--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = 'ch5-button-list--scrollbar-';
  public static readonly CENTER_ITEMS_CLASSLIST_PREFIX: string = 'ch5-button-list--center-items-';

  // Button container dimension and Buffer values
  public static readonly BUTTON_CONTAINER_BUFFER: number = 2;
  public static readonly DEFAULT_BUTTON_WIDTH_PX: number = 100;
  public static readonly DEFAULT_BUTTON_HEIGHT_PX: number = 58;

  // Enum types
  public static readonly BUTTON_TYPES: TCh5ButtonListButtonType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly BUTTON_HALIGN_LABEL_POSITIONS: TCh5ButtonListButtonHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly BUTTON_VALIGN_LABEL_POSITIONS: TCh5ButtonListButtonVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly BUTTON_CHECKBOX_POSITIONS: TCh5ButtonListButtonCheckboxPosition[] = ['left', 'right'];
  public static readonly BUTTON_ICON_POSITIONS: TCh5ButtonListButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];
  public static readonly BUTTON_SHAPES: TCh5ButtonListButtonShape[] = ['rounded-rectangle', 'rectangle'];

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
      default: Ch5ButtonList.BUTTON_TYPES[0],
      values: Ch5ButtonList.BUTTON_TYPES,
      key: 'buttonType',
      attribute: 'buttonType',
      classListPrefix: 'ch5-button-list--button-type-'
    },
    BUTTON_HALIGN_LABEL: {
      default: Ch5ButtonList.BUTTON_HALIGN_LABEL_POSITIONS[0],
      values: Ch5ButtonList.BUTTON_HALIGN_LABEL_POSITIONS,
      key: 'buttonHAlignLabel',
      attribute: 'buttonHAlignLabel',
      classListPrefix: 'ch5-button-list--button-halign-label-'
    },
    BUTTON_VALIGN_LABEL: {
      default: Ch5ButtonList.BUTTON_VALIGN_LABEL_POSITIONS[0],
      values: Ch5ButtonList.BUTTON_VALIGN_LABEL_POSITIONS,
      key: 'buttonVAlignLabel',
      attribute: 'buttonVAlignLabel',
      classListPrefix: 'ch5-button-list--button-valign-label-'
    },
    BUTTON_CHECKBOX_POSITION: {
      default: Ch5ButtonList.BUTTON_CHECKBOX_POSITIONS[0],
      values: Ch5ButtonList.BUTTON_CHECKBOX_POSITIONS,
      key: 'buttonCheckboxPosition',
      attribute: 'buttonCheckboxPosition',
      classListPrefix: 'ch5-button-list--button-checkbox-position-'
    },
    BUTTON_ICON_POSITION: {
      default: Ch5ButtonList.BUTTON_ICON_POSITIONS[0],
      values: Ch5ButtonList.BUTTON_ICON_POSITIONS,
      key: 'buttonIconPosition',
      attribute: 'buttonIconPosition',
      classListPrefix: 'ch5-button-list--button-icon-position-'
    },
    BUTTON_SHAPE: {
      default: Ch5ButtonList.BUTTON_SHAPES[0],
      values: Ch5ButtonList.BUTTON_SHAPES,
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
      default: Ch5ButtonList.BUTTON_TYPES[0],
      enumeratedValues: Ch5ButtonList.BUTTON_TYPES,
      name: "buttonType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_TYPES[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_HALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonList.BUTTON_HALIGN_LABEL_POSITIONS,
      name: "buttonHAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_HALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_VALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonList.BUTTON_VALIGN_LABEL_POSITIONS,
      name: "buttonVAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_VALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_CHECKBOX_POSITIONS[0],
      enumeratedValues: Ch5ButtonList.BUTTON_CHECKBOX_POSITIONS,
      name: "buttonCheckboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_CHECKBOX_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_ICON_POSITIONS[0],
      enumeratedValues: Ch5ButtonList.BUTTON_ICON_POSITIONS,
      name: "buttonIconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_ICON_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonList.BUTTON_SHAPES[0],
      enumeratedValues: Ch5ButtonList.BUTTON_SHAPES,
      name: "buttonShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonList.BUTTON_SHAPES[0],
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
      name: "buttonLabelInnerHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateMode",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateSelected",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateScriptLabelHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateType",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonSendEventOnClick",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonSendEventOnTouch",
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
  private destroyedButtonsLeft: number = 0;
  private destroyedButtonsRight: number = 0;
  private scrollbarReachedEnd: boolean = false;

  // private members used for window resize events
  private isResizeInProgress: boolean = false;
  private readonly RESIZE_DEBOUNCE: number = 500;

  // Default Row and Column value
  private rowClassValue: number = 1;
  private columnClassValue: number = 1;

  public debounceButtonDisplay = this.debounce(() => {
    this.buttonDisplay();
  }, 100);

  //#endregion

  //#region Getters and Setters

  public set buttonType(value: TCh5ButtonListButtonType) {
    this._ch5Properties.set<TCh5ButtonListButtonType>("buttonType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonType(): TCh5ButtonListButtonType {
    return this._ch5Properties.get<TCh5ButtonListButtonType>("buttonType");
  }

  public set buttonHAlignLabel(value: TCh5ButtonListButtonHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonHAlignLabel(): TCh5ButtonListButtonHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel");
  }

  public set buttonVAlignLabel(value: TCh5ButtonListButtonVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonVAlignLabel(): TCh5ButtonListButtonVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel");
  }

  public set buttonCheckboxPosition(value: TCh5ButtonListButtonCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonCheckboxPosition(): TCh5ButtonListButtonCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition");
  }

  public set buttonIconPosition(value: TCh5ButtonListButtonIconPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonIconPosition>("buttonIconPosition", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconPosition(): TCh5ButtonListButtonIconPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonIconPosition>("buttonIconPosition");
  }

  public set buttonShape(value: TCh5ButtonListButtonShape) {
    this._ch5Properties.set<TCh5ButtonListButtonShape>("buttonShape", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonShape(): TCh5ButtonListButtonShape {
    return this._ch5Properties.get<TCh5ButtonListButtonShape>("buttonShape");
  }

  public set buttonCheckboxShow(value: boolean) {
    this._ch5Properties.set<boolean>("buttonCheckboxShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonCheckboxShow(): boolean {
    return this._ch5Properties.get<boolean>("buttonCheckboxShow");
  }

  public set buttonSelected(value: boolean) {
    this._ch5Properties.set<boolean>("buttonSelected", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonSelected(): boolean {
    return this._ch5Properties.get<boolean>("buttonSelected");
  }

  public set buttonPressed(value: boolean) {
    this._ch5Properties.set<boolean>("buttonPressed", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonPressed(): boolean {
    return this._ch5Properties.get<boolean>("buttonPressed");
  }

  public set buttonMode(value: number) {
    this._ch5Properties.set<number>("buttonMode", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonMode(): number {
    return +this._ch5Properties.get<number>("buttonMode");
  }

  public set buttonIconClass(value: string) {
    this._ch5Properties.set<string>("buttonIconClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconClass(): string {
    return this._ch5Properties.get<string>("buttonIconClass");
  }

  public set buttonIconUrl(value: string) {
    this._ch5Properties.set<string>("buttonIconUrl", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconUrl(): string {
    return this._ch5Properties.get<string>("buttonIconUrl");
  }

  public set buttonLabelInnerHtml(value: string) {
    this._ch5Properties.set<string>("buttonLabelInnerHtml", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonLabelInnerHtml(): string {
    return this._ch5Properties.get<string>("buttonLabelInnerHtml");
  }

  public set buttonReceiveStateMode(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateMode", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateMode(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateMode");
  }

  public set buttonReceiveStateSelected(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateSelected", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateSelected(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateSelected");
  }

  public set buttonReceiveStateLabel(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateLabel(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateLabel");
  }

  public set buttonReceiveStateScriptLabelHtml(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateScriptLabelHtml", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateScriptLabelHtml(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateScriptLabelHtml");
  }

  public set buttonReceiveStateIconClass(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateIconClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateIconClass(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateIconClass");
  }

  public set buttonReceiveStateType(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateType(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateType");
  }

  public set buttonReceiveStateIconUrl(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateIconUrl", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateIconUrl(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateIconUrl");
  }

  public set buttonSendEventOnClick(value: string) {
    this._ch5Properties.set<string>("buttonSendEventOnClick", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonSendEventOnClick(): string {
    return this._ch5Properties.get<string>("buttonSendEventOnClick");
  }

  public set buttonSendEventOnTouch(value: string) {
    this._ch5Properties.set<string>("buttonSendEventOnTouch", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonSendEventOnTouch(): string {
    return this._ch5Properties.get<string>("buttonSendEventOnTouch");
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
    this.debounceButtonDisplay();
    resizeObserver(this._elContainer, this.resizeHandler.bind(this));
    customElements.whenDefined('ch5-button-list').then(() => {
      this.componentLoadedEvent(Ch5ButtonList.ELEMENT_NAME, this.id);
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
    this.startX = e.pageX - this._elContainer.offsetLeft;
    this.startY = e.pageY - this._elContainer.offsetTop;
    this.scrollListLeft = this._elContainer.scrollLeft;
    this.scrollListTop = this._elContainer.scrollTop;
  }

  private handleMouseUpAndLeave() {
    this.isDown = false;
    this._elContainer.classList.remove('active');
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this._elContainer.offsetLeft;
    const y = e.pageY - this._elContainer.offsetTop;
    const walkX = (x - this.startX) * 3;
    const walkY = (y - this.startY) * 3;
    this._elContainer.scrollLeft = this.scrollListLeft - walkX;
    this._elContainer.scrollTop = this.scrollListTop - walkY;
  }

  private handleScrollEvent() {
    // update the scrollbar width and position
    this.initScrollbar();
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    // Checking whether endless can be achieved
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + 20 < scrollWidth : offsetHeight + 20 < scrollHeight;
    // working of endless for left and top scroll
    if (this.loadedButtons === this.maxNumberOfItems && this.endless && endlessScrollable) {
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
      this.buttonDestroyHelper();
      if (this.orientation === "horizontal") {
        if (offsetWidth + scrollLeft < scrollWidth - Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) { return; }
        rowColumnValue = this.rows;
      } else {
        if (offsetHeight + scrollTop < scrollHeight - Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) { return; }
        rowColumnValue = this.columns;
      }
    }

    // check whether all the buttons are loaded
    if (this.loadedButtons !== this.maxNumberOfItems) {
      for (let i = this.loadedButtons; i < this.loadedButtons + rowColumnValue * Ch5ButtonList.BUTTON_CONTAINER_BUFFER && i < this.maxNumberOfItems; i++) { this.createButton(i); }
      this.loadedButtons = this.loadedButtons + rowColumnValue * Ch5ButtonList.BUTTON_CONTAINER_BUFFER > this.maxNumberOfItems ? this.maxNumberOfItems : this.loadedButtons + rowColumnValue * Ch5ButtonList.BUTTON_CONTAINER_BUFFER;
    }

    // working of endless for right and bottom scroll
    if (this.loadedButtons === this.maxNumberOfItems && this.endless && endlessScrollable) {
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
    Array.from(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.values).forEach((orientation: any) => {
      this._elContainer.classList.remove(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.classListPrefix + orientation);
    });
    this._elContainer.classList.add(Ch5ButtonList.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this.style.display = this.orientation === 'horizontal' ? 'grid' : 'inline-grid';
  }

  public handleStretch() {
    Array.from(Ch5ButtonList.COMPONENT_DATA.STRETCH.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5ButtonList.COMPONENT_DATA.STRETCH.classListPrefix + e);
    });
    if (this.stretch) {
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
      this.rowClassValue = this.rows < this.maxNumberOfItems ? this.rows : this.maxNumberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(Ch5ButtonList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
    } else {

      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(Ch5ButtonList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      this._elContainer.classList.remove(Ch5ButtonList.ROWS_CLASSLIST_PREFIX + this.rowClassValue);

      // Calculate New Row class value
      this.columnClassValue = this.columns < this.maxNumberOfItems ? this.columns : this.maxNumberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(Ch5ButtonList.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
    }
    this.debounceButtonDisplay();
  }

  public handleCenterItems() {
    this._elContainer.classList.remove(Ch5ButtonList.CENTER_ITEMS_CLASSLIST_PREFIX + true.toString());
    if (this.centerItems) {
      this._elContainer.classList.add(Ch5ButtonList.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems.toString());
    }
  }

  public handleReceiveStateMaxNumberOfItems() {
    this.debounceButtonDisplay();
  }

  public handleEndless() {
    // This behavior is handled in scroll event
  }

  public buttonDisplay() {
    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    if (this.orientation === 'horizontal') {
      // Find the number of initial buttons which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      this.loadedButtons = Math.floor(containerWidth / Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) * this.rows + this.rows * 2;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) {
        this.loadedButtons = Math.floor(containerHeight / Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) * this.columns + this.columns * 2;
      } else {
        this.loadedButtons = this.maxNumberOfItems;
      }
    }
    this.loadedButtons = this.loadedButtons > this.maxNumberOfItems ? this.maxNumberOfItems : this.loadedButtons;
    for (let index = 0; index < this.loadedButtons && index < this.maxNumberOfItems; index++) {
      this.createButton(index);
    }
    // init the scrollbar after loading the initial buttons 
    this.initScrollbar();
    this.checkButtonDisplay();
  }


  private createButton(index: number, append: boolean = true) {
    const btn = new Ch5Button();
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("button-container");
    btnContainer.appendChild(btn);
    append ? this._elContainer.appendChild(btnContainer) : this._elContainer.prepend(btnContainer);
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
                        template.innerHTML = buttonModeStateLabelTemplate[0].innerHTML.replace(`{{${this.indexId}}}`, index.toString());
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
                  template.innerHTML = buttonListModeLabelTemplate[0].innerHTML.replace(`{{${this.indexId}}}`, index.toString());
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
            template.innerHTML = buttonListLabelTemplate[0].innerHTML.replace(`{{${this.indexId}}}`, index.toString());
            ch5ButtonLabel.appendChild(template);
            btn.appendChild(ch5ButtonLabel);
          }
        }
      });
    }
  }

  private buttonHelper(btn: Ch5Button, index: number) {
    const buttonSignals = ['buttonReceiveStateMode', 'buttonReceiveStateSelected', 'buttonReceiveStateLabel', 'buttonReceiveStateScriptLabelHtml', 'buttonReceiveStateIconClass', 'buttonReceiveStateType', 'buttonReceiveStateIconUrl', 'buttonSendEventOnClick', 'buttonSendEventOnTouch'];
    const individualButtons = this.getElementsByTagName('ch5-button-list-individual-button');
    const individualButtonsLength = individualButtons.length;
    Ch5ButtonList.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
      if (index < individualButtonsLength) {
        if (attr.name.toLowerCase() === 'buttonlabelinnerhtml') {
          const attrValue = individualButtons[index].getAttribute('buttonlabelinnerhtml');
          if (attrValue) {
            btn.setAttribute('labelinnerhtml', attrValue);
          }
        } else if (attr.name.toLowerCase() === 'buttoniconclass') {
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
          if (buttonSignals.includes(attr.name)) {
            if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
              if (this.getAttribute(attr.name)) {
                const attrValue = Number(this.getAttribute(attr.name)) ? Number(this.getAttribute(attr.name)) + index : index;
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.toString());
              }
            }
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim();
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue);
            }
          }
        }
      } else {
        if (buttonSignals.includes(attr.name)) {
          if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            if (this.getAttribute(attr.name)) {
              const attrValue = Number(this.getAttribute(attr.name)) ? Number(this.getAttribute(attr.name)) + index : index;
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.toString());
            }
          }
        } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
          const attrValue = this.getAttribute(attr.name);
          if (attrValue) {
            btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
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
    let scrollbarDimension: number = 0;
    if (this.orientation === "horizontal") {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(scrollLeft / scrollWidth * 100);
      this._scrollbar.style.width = scrollbarDimension + '%';
      this._scrollbar.style.left = scrollbarLeft + '%';
      if (scrollLeft === 0) {
        this.scrollbarReachedEnd = false;
      } else if (scrollbarDimension + scrollbarLeft === 100) {
        this.scrollbarReachedEnd = true;
      }
    } else {
      const { scrollHeight, offsetHeight, scrollTop } = this._elContainer;
      scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      const scrollbarTop = Math.ceil(scrollTop / scrollHeight * 100);
      this._scrollbar.style.height = scrollbarDimension + '%';
      this._scrollbar.style.top = scrollbarTop + '%';
      if (scrollTop === 0) {
        this.scrollbarReachedEnd = false;
      } else if (scrollbarDimension + scrollbarTop === 100) {
        this.scrollbarReachedEnd = true;
      }
    }
    if (this.scrollbar) {
      if (scrollbarDimension === 100) {
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
        this.checkButtonDisplay();
        this.isResizeInProgress = false; // reset debounce once completed
      }, this.RESIZE_DEBOUNCE);
    }
  }

  private buttonDestroyHelper() {
    if (this.orientation === 'horizontal') {
      const { scrollLeft, scrollWidth, offsetWidth } = this._elContainer;
      if (scrollLeft < Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX && this.destroyedButtonsLeft !== 0) {
        for (let i = 0; i < this.rows; i++) {
          this.createButton(this.destroyedButtonsLeft - 1, false);
          this.destroyedButtonsLeft--;
        }
        this._elContainer.scrollLeft += Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX;
      }
      if (scrollLeft > Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX * 2.5 && this.scrollbarReachedEnd === false) {
        if (scrollLeft + offsetWidth > scrollWidth - Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) { return }
        for (let i = 0; i < this.rows; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedButtonsLeft++;
        }
        this._elContainer.scrollLeft -= Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX;
      }
      if (scrollLeft + offsetWidth < scrollWidth - Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX * 2.5 && this.scrollbarReachedEnd) {
        if (scrollLeft <= Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX) { return; }
        for (let i = 0; i < this.rows; i++) {
          this._elContainer.lastElementChild?.remove();
          this.destroyedButtonsRight++;
        }
      }
      if (scrollLeft + offsetWidth > scrollWidth - Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX && this.destroyedButtonsRight !== 0) {
        for (let i = 0; i < this.rows; i++) {
          this.createButton(this.maxNumberOfItems - this.destroyedButtonsRight, true);
          this.destroyedButtonsRight--;
        }
      }
    } else {
      const { scrollTop, scrollHeight, offsetHeight } = this._elContainer;
      if (scrollTop < Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX && this.destroyedButtonsLeft !== 0) {
        for (let i = 0; i < this.columns; i++) {
          this.createButton(this.destroyedButtonsLeft - 1, false);
          this.destroyedButtonsLeft--;
        }
        this._elContainer.scrollTop += Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX;
      }
      if (scrollTop > Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX * 3 && this.scrollbarReachedEnd === false) {
        if (scrollTop + offsetHeight > scrollHeight - Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) { return }
        for (let i = 0; i < this.columns; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedButtonsLeft++;
        }
        this._elContainer.scrollTop -= Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX;
      }
      if (scrollTop + offsetHeight < scrollHeight - Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX * 3 && this.scrollbarReachedEnd) {
        if (scrollTop <= Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX) { return; }
        for (let i = 0; i < this.columns; i++) {
          this._elContainer.lastElementChild?.remove();
          this.destroyedButtonsRight++;
        }
      }
      if (scrollTop + offsetHeight > scrollHeight - Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX && this.destroyedButtonsRight !== 0) {
        for (let i = 0; i < this.columns; i++) {
          this.createButton(this.maxNumberOfItems - this.destroyedButtonsRight, true);
          this.destroyedButtonsRight--;
        }
      }
    }
  }

  private resizeHandler() {
    this.initScrollbar();
  }

  private checkButtonDisplay() {
    if (this.orientation === 'horizontal') {
      const widthRequired = Math.ceil(this.loadedButtons / this.rows) * Ch5ButtonList.DEFAULT_BUTTON_WIDTH_PX;
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      if (widthRequired < containerWidth) {
        this.style.display = 'inline-grid';
      }
    } else {
      const heightRequired = Math.ceil(this.loadedButtons / this.columns) * Ch5ButtonList.DEFAULT_BUTTON_HEIGHT_PX;
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      if (heightRequired < containerHeight) {
        this.style.display = 'inline-grid';
      }
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

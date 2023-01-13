import { Ch5Button } from "../../ch5-button/ch5-button";
import { Ch5ButtonMode } from "../../ch5-button/ch5-button-mode";
import { Ch5ButtonLabel } from "../../ch5-button/ch5-button-label";
import { Ch5GenericListAttributes } from "../../ch5-generic-list-attributes/ch5-generic-list-attributes";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape } from './../interfaces/t-ch5-button-list';
import { ICh5ButtonListAttributes } from './../interfaces/i-ch5-button-list-attributes';
import { Ch5Properties } from "../../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../../ch5-core/ch5-property";
import { Ch5ButtonListMode } from "../../ch5-button-list/ch5-button-list-mode";
import { Ch5ButtonListModeState } from "../../ch5-button-list/ch5-button-list-mode-state";
import { Ch5ButtonModeState } from "../../ch5-button/ch5-button-mode-state";
import { resizeObserver } from "../../ch5-core/resize-observer";

export class Ch5ButtonListBase extends Ch5GenericListAttributes implements ICh5ButtonListAttributes {

  //#region Variables

  // ClassList Prefix
  public static readonly ROWS_CLASSLIST_PREFIX: string = '--rows-';
  public static readonly COLUMNS_CLASSLIST_PREFIX: string = '--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = '--scrollbar-';
  public static readonly CENTER_ITEMS_CLASSLIST_PREFIX: string = '--center-items-';

  // Button container dimension and Buffer values
  public static readonly BUTTON_CONTAINER_BUFFER: number = 2;
  public static readonly MODES_MAX_COUNT: number = 5;

  // Enum types
  public static readonly BUTTON_TYPES: TCh5ButtonListButtonType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly BUTTON_HALIGN_LABEL_POSITIONS: TCh5ButtonListButtonHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly BUTTON_VALIGN_LABEL_POSITIONS: TCh5ButtonListButtonVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly BUTTON_CHECKBOX_POSITIONS: TCh5ButtonListButtonCheckboxPosition[] = ['left', 'right'];
  public static readonly BUTTON_ICON_POSITIONS: TCh5ButtonListButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];
  public static readonly BUTTON_SHAPES: TCh5ButtonListButtonShape[] = ['rounded-rectangle', 'rectangle'];

  public static COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5ButtonListBase.ORIENTATION[0],
      values: Ch5ButtonListBase.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
    },
    STRETCH: {
      default: Ch5ButtonListBase.STRETCH[0],
      values: Ch5ButtonListBase.STRETCH,
      key: 'stretch',
      attribute: 'stretch',
      classListPrefix: '--stretch-'
    },
    BUTTON_TYPE: {
      default: Ch5ButtonListBase.BUTTON_TYPES[0],
      values: Ch5ButtonListBase.BUTTON_TYPES,
      key: 'buttonType',
      attribute: 'buttonType',
      classListPrefix: '--button-type-'
    },
    BUTTON_HALIGN_LABEL: {
      default: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS,
      key: 'buttonHAlignLabel',
      attribute: 'buttonHAlignLabel',
      classListPrefix: '--button-halign-label-'
    },
    BUTTON_VALIGN_LABEL: {
      default: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS,
      key: 'buttonVAlignLabel',
      attribute: 'buttonVAlignLabel',
      classListPrefix: '--button-valign-label-'
    },
    BUTTON_CHECKBOX_POSITION: {
      default: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS,
      key: 'buttonCheckboxPosition',
      attribute: 'buttonCheckboxPosition',
      classListPrefix: '--button-checkbox-position-'
    },
    BUTTON_ICON_POSITION: {
      default: Ch5ButtonListBase.BUTTON_ICON_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_ICON_POSITIONS,
      key: 'buttonIconPosition',
      attribute: 'buttonIconPosition',
      classListPrefix: '--button-icon-position-'
    },
    BUTTON_SHAPE: {
      default: Ch5ButtonListBase.BUTTON_SHAPES[0],
      values: Ch5ButtonListBase.BUTTON_SHAPES,
      key: 'buttonShape',
      attribute: 'buttonShape',
      classListPrefix: '--button-shape-'
    }
  };

  public static readonly COMPONENT_COMMON_PROPERTIES = ['disabled', 'show'];
  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5ButtonListBase.BUTTON_TYPES[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_TYPES,
      name: "buttonType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_TYPES[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS,
      name: "buttonHAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS,
      name: "buttonVAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS,
      name: "buttonCheckboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_ICON_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_ICON_POSITIONS,
      name: "buttonIconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_ICON_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_SHAPES[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_SHAPES,
      name: "buttonShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_SHAPES[0],
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
      name: "buttonReceiveStateShow",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "buttonReceiveStateEnable",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    }
  ];

  public primaryCssClass = '';
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
  private scrollbarDimension: number = 0;
  private buttonWidth: number = 0;
  private buttonHeight: number = 0;

  // Default Row and Column value
  private rowClassValue: number = 1;
  private columnClassValue: number = 1;

  public debounceButtonDisplay = this.debounce(() => {
    this.buttonDisplay();
  }, 100);

  public debounceHandleScrollToPosition = this.debounce((value: number) => {
    this.handleScrollToPosition(value);
  }, 400);

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

  public set buttonReceiveStateShow(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateShow(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateShow");
  }

  public set buttonReceiveStateEnable(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateEnable", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateEnable(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateEnable");
  }

  //#endregion

  //#region Static Methods

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()');
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5ButtonListBase.COMPONENT_PROPERTIES);
    this.initCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5GenericListAttributes.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5ButtonListBase.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5ButtonListBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.nodeName);
    if (oldValue !== newValue) {
      this.logger.log('attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ButtonListBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonListBase component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()');
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonList);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.initMembers();
    this.initCommonMutationObserver(this);
    this.debounceButtonDisplay();
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
    for (let i: number = 0; i < Ch5ButtonListBase.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ButtonListBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ButtonListBase.COMPONENT_PROPERTIES[i].name;
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
    if (this.loadedButtons === this.numberOfItems && this.endless && endlessScrollable) {
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
        if (offsetWidth + scrollLeft < scrollWidth - this.buttonWidth) { return; }
        rowColumnValue = this.rows;
      } else {
        if (offsetHeight + scrollTop < scrollHeight - this.buttonHeight) { return; }
        rowColumnValue = this.columns;
      }
    }

    // check whether all the buttons are loaded
    if (this.loadedButtons !== this.numberOfItems) {
      for (let i = this.loadedButtons; i < this.loadedButtons + rowColumnValue * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER && i < this.numberOfItems; i++) { this.createButton(i); }
      this.loadedButtons = this.loadedButtons + rowColumnValue * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER > this.numberOfItems ? this.numberOfItems : this.loadedButtons + rowColumnValue * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
    }

    // working of endless for right and bottom scroll
    if (this.loadedButtons === this.numberOfItems && this.endless && endlessScrollable) {
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
    Array.from(Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.values).forEach((orientation: any) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.classListPrefix + orientation);
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this.handleRowsAndColumn();
  }

  public handleScrollbar() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this.initScrollbar();
  }

  public handleRowsAndColumn() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.orientation === "horizontal") {
      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);

      // Calculate New Row class value
      this.rowClassValue = this.rows < this.numberOfItems ? this.rows : this.numberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
    } else {

      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rowClassValue);

      // Calculate New Row class value
      this.columnClassValue = this.columns < this.numberOfItems ? this.columns : this.numberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
    }
    this.debounceButtonDisplay();
  }

  public handleStretch(): void {
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.stretch === null) { this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both'); }
  }

  public handleCenterItems() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
  }

  public handleEndless() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    // This behavior is handled in scroll event
  }
  public handleScrollToPosition(value: number) {
    if (value > this.numberOfItems || value < 0) { return; }
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }
    const firstElementInDOM = Number(this._elContainer?.children[0]?.getAttribute('id' + '')?.replace(this.getCrId() + '-', ''));
    if (this.orientation === 'horizontal') {
      if (value > firstElementInDOM) {
        const distanceBetweenCurrentAndRequired = value - firstElementInDOM;
        this._elContainer.scrollLeft = 0;
        for (let i = 0; i < distanceBetweenCurrentAndRequired; i++) {
          if (this.loadedButtons !== this.numberOfItems && this.loadedButtons < this.numberOfItems) {
            this.createButton(this.loadedButtons++);
          } else {
            const lastElementInDOM = Number(this._elContainer?.lastElementChild?.getAttribute('id' + '')?.replace(this.getCrId() + '-', ''));
            if (lastElementInDOM < this.numberOfItems - 1) {
              this.createButton(lastElementInDOM + 1);
            }
          }
          this._elContainer.scrollLeft += this.buttonWidth;
        }
      } else {
        const distanceBetweenCurrentAndRequired = firstElementInDOM - value;
        for (let i = 0; i < distanceBetweenCurrentAndRequired; i++) {
          this.createButton(--this.destroyedButtonsLeft, false)
          this._elContainer.scrollLeft -= this.buttonWidth;
        }
      }
    } else {
      if (value > firstElementInDOM + 2) {
        const distanceBetweenCurrentAndRequired = value - firstElementInDOM;
        for (let i = 0; i < distanceBetweenCurrentAndRequired; i++) {
          if (this.loadedButtons !== this.numberOfItems) {
            this.createButton(this.loadedButtons++);
            this._elContainer.scrollTop += this.buttonHeight;
          } else {
            const lastElementInDOM = Number(this._elContainer?.lastElementChild?.getAttribute('id' + '')?.replace(this.getCrId() + '-', ''));
            if (lastElementInDOM < this.numberOfItems - 1) {
              this.createButton(lastElementInDOM + 1);
              this._elContainer.scrollTop += this.buttonHeight;
            }
          }
        }
        const firstElement = Number(this._elContainer?.children[0]?.getAttribute('id' + '')?.replace(this.getCrId() + '-', ''))
        const loadableButtons = this._elContainer.getBoundingClientRect().height / this.buttonHeight + 2;
        for (let i = firstElement; i < value - 3 && this._elContainer.children.length > loadableButtons; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedButtonsLeft++;
        }
        this._elContainer.scrollTop = this.buttonHeight * 3
      } else {
        const distanceBetweenCurrentAndRequired = firstElementInDOM - value + 3;
        for (let i = 0; i < distanceBetweenCurrentAndRequired && this.destroyedButtonsLeft > 0; i++) {
          this.createButton(--this.destroyedButtonsLeft, false);
          this._elContainer.scrollTop -= this.buttonHeight;
        }
        if (this._elContainer.scrollTop < this.buttonHeight * 2.5) {
          this._elContainer.scrollTop = this.buttonHeight * 3;
        }
        if (value >= 0 && value <= 2) {
          this._elContainer.scrollTop = this.buttonHeight * value;
        }
      }
    }
  }

  public buttonDisplay() {
    // The below line is added to remove the stretch class before calculating the button dimension
    this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // create first button and find the dimension of the button
    this.createButton(0);
    this.buttonWidth = this._elContainer.children[0].getBoundingClientRect().width;
    this.buttonHeight = this._elContainer.children[0].getBoundingClientRect().height;

    if (this.orientation === 'horizontal') {
      // Find the number of initial buttons which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      this.loadedButtons = Math.floor(containerWidth / this.buttonWidth) * this.rows + this.rows * 2;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > this.buttonHeight) {
        this.loadedButtons = Math.floor(containerHeight / this.buttonHeight) * this.columns + this.columns * 2;
      } else {
        this.loadedButtons = this.numberOfItems;
      }
    }
    this.loadedButtons = this.loadedButtons > this.numberOfItems ? this.numberOfItems : this.loadedButtons;
    for (let index = 1; index < this.loadedButtons; index++) {
      this.createButton(index);
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    if (this.centerItems === true && this.scrollbarDimension < 100) { this.centerItems = false; }
  }


  private createButton(index: number, append: boolean = true) {
    const btn = new Ch5Button();
    const btnContainer = document.createElement("div");
    btnContainer.setAttribute('id', this.getCrId() + '-' + index);
    btnContainer.classList.add(this.nodeName.toLowerCase() + "--button-container");
    btnContainer.appendChild(btn);
    append ? this._elContainer.appendChild(btnContainer) : this._elContainer.prepend(btnContainer);
    // button attributes helper
    this.buttonModeHelper(btn, index);
    this.buttonLabelHelper(btn, index);
    this.buttonHelper(btn, index);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_TYPE.classListPrefix + this.buttonType);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_SHAPE.classListPrefix + this.buttonShape);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_ICON_POSITION.classListPrefix + this.buttonIconPosition);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_CHECKBOX_POSITION.classListPrefix + this.buttonCheckboxPosition);
  }

  private buttonModeHelper(btn: Ch5Button, i: number) {
    const buttonListModes = this.getElementsByTagName(this.nodeName.toLowerCase() + "-mode");
    if (buttonListModes && buttonListModes.length > 0) {
      Array.from(buttonListModes).forEach((buttonListMode, index) => {
        if (index < Ch5ButtonListBase.MODES_MAX_COUNT) {
          if (buttonListMode.parentElement instanceof Ch5ButtonListBase) {
            const ch5ButtonMode = new Ch5ButtonMode(btn);
            Ch5ButtonMode.observedAttributes.forEach((attr) => {
              if (buttonListMode.hasAttribute(attr)) {
                ch5ButtonMode.setAttribute(attr, buttonListMode.getAttribute(attr) + '');
              }
            });

            const buttonListModeStates = buttonListMode.getElementsByTagName(this.nodeName.toLowerCase() + "-mode-state");
            if (buttonListModeStates && buttonListModeStates.length > 0) {
              Array.from(buttonListModeStates).forEach(buttonListModeState => {
                if (buttonListModeState.parentElement instanceof Ch5ButtonListMode) {
                  const buttonModeState = new Ch5ButtonModeState(btn);
                  Ch5ButtonModeState.observedAttributes.forEach((attr) => {
                    if (buttonListModeState.hasAttribute(attr)) {
                      buttonModeState.setAttribute(attr, buttonListModeState.getAttribute(attr) + '');
                    }
                  });

                  const buttonModeStateLabels = buttonListModeState.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
                  if (buttonModeStateLabels && buttonModeStateLabels.length > 0) {
                    Array.from(buttonModeStateLabels).forEach((buttonModeStateLabel) => {
                      if (buttonModeStateLabel.parentElement instanceof Ch5ButtonListModeState) {
                        const buttonModeStateLabelTemplate = buttonModeStateLabel.getElementsByTagName("template");
                        if (buttonModeStateLabelTemplate && buttonModeStateLabelTemplate.length > 0) {
                          const ch5ButtonLabel = new Ch5ButtonLabel();
                          const template = document.createElement('template');
                          template.innerHTML = buttonModeStateLabelTemplate[0].innerHTML.replace(`{{${this.indexId}}}`, i.toString());
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
            const buttonListModeLabels = buttonListMode.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
            if (buttonListModeLabels && buttonListModeLabels.length > 0) {
              Array.from(buttonListModeLabels).forEach((buttonListModeLabel) => {
                if (buttonListModeLabel.parentElement instanceof Ch5ButtonListMode) {
                  const buttonListModeLabelTemplate = buttonListModeLabel.getElementsByTagName("template");
                  if (buttonListModeLabelTemplate && buttonListModeLabelTemplate.length > 0) {
                    const ch5ButtonLabel = new Ch5ButtonLabel();
                    const template = document.createElement('template');
                    template.innerHTML = buttonListModeLabelTemplate[0].innerHTML.replace(`{{${this.indexId}}}`, i.toString());
                    ch5ButtonLabel.appendChild(template);
                    ch5ButtonMode.appendChild(ch5ButtonLabel);
                  }
                }
              });
            }
            btn.appendChild(ch5ButtonMode);
          }
        }
      });
    }
  }

  private buttonLabelHelper(btn: Ch5Button, index: number) {
    const buttonListLabels = this.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
    if (buttonListLabels && buttonListLabels.length > 0) {
      Array.from(buttonListLabels).forEach((buttonListLabel) => {
        if (buttonListLabel.parentElement instanceof Ch5ButtonListBase) {
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
    const individualButtons = this.getElementsByTagName(this.nodeName.toLowerCase() + '-individual-button');
    const individualButtonsLength = individualButtons.length;
    btn.setAttribute('stretch', 'both');
    Ch5ButtonListBase.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
      if (index < individualButtonsLength) {
        if (attr.name.toLowerCase() === 'buttonlabelinnerhtml') {
          if (individualButtons[index].hasAttribute('buttonlabelinnerhtml')) {
            const attrValue = individualButtons[index].getAttribute('buttonlabelinnerhtml')?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute('labelinnerhtml', attrValue);
            }
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else if (attr.name.toLowerCase() === 'buttoniconclass') {
          if (individualButtons[index].hasAttribute('iconclass')) {
            const attrValue = individualButtons[index].getAttribute('iconclass')?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute('iconclass', attrValue);
            }
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else if (attr.name.toLowerCase() === 'buttoniconurl') {
          if (individualButtons[index].hasAttribute('iconurl')) {
            const attrValue = individualButtons[index].getAttribute('iconurl')?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute('iconurl', attrValue);
            }
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else {
          if (attr.name.toLowerCase() === 'buttonreceivestateshow' && this.hasAttribute('receivestateshow')) {
            btn.setAttribute('receivestateshow', this.getAttribute('receivestateshow') + '');
          }
          else if (attr.name.toLowerCase() === 'buttonreceivestateenable' && this.hasAttribute('receivestateenable')) {
            btn.setAttribute('receivestateenable', this.getAttribute('receivestateenable') + '');
          }
          else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue);
            }
          }
        }
      } else {
        if (attr.name.toLowerCase() === 'buttonreceivestateshow' && this.hasAttribute('receivestateshow')) {
          btn.setAttribute('receivestateshow', this.getAttribute('receivestateshow') + '');
        }
        else if (attr.name.toLowerCase() === 'buttonreceivestateenable' && this.hasAttribute('receivestateenable')) {
          btn.setAttribute('receivestateenable', this.getAttribute('receivestateenable') + '');
        }
        else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
          const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
          if (attrValue) {
            btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
          }
        }
      }
    });

    Ch5ButtonListBase.COMPONENT_COMMON_PROPERTIES.forEach((attr: string) => {
      if (this.hasAttribute(attr)) {
        btn.setAttribute(attr, this.getAttribute(attr) + '');
      }
    });

    if (index < individualButtonsLength && individualButtons[index].hasAttribute('onRelease')) {
      const attrValue = individualButtons[index].getAttribute('onRelease')?.trim().replace(`{{${this.indexId}}}`, index + '');
      if (attrValue) {
        btn.setAttribute('onRelease', attrValue);
      }
    }
  }

  private initCssClass() {
    this.logger.start('initializeCssClass');
    // Default Orientation
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    // Set default rows 
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rows);
    // Sets default scroll bar class
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    // sets default center item class
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
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
      } else if (this.scrollbarDimension + scrollbarLeft === 100 && this.numberOfItems === this.loadedButtons) {
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
      } else if (this.scrollbarDimension + scrollbarTop === 100 && this.numberOfItems === this.loadedButtons) {
        this.scrollbarReachedEnd = true;
      }
    }
    if (this.scrollbar) {
      if (this.scrollbarDimension === 100) {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'true');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      } else {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'false');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'true');
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

  private buttonDestroyHelper() {
    if (this.orientation === 'horizontal') {
      const { scrollLeft, scrollWidth, offsetWidth } = this._elContainer;
      if (scrollLeft < this.buttonWidth && this.destroyedButtonsLeft !== 0) {
        for (let i = 0; i < this.rows; i++) {
          this.createButton(this.destroyedButtonsLeft - 1, false);
          this.destroyedButtonsLeft--;
        }
        this._elContainer.scrollLeft += this.buttonWidth;
      }
      if (scrollLeft > this.buttonWidth * 2.5 && this.scrollbarReachedEnd === false) {
        if (scrollLeft + offsetWidth > scrollWidth - this.buttonWidth) { return }
        for (let i = 0; i < this.rows; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedButtonsLeft++;
        }
        this._elContainer.scrollLeft -= this.buttonWidth;
      }
      if (scrollLeft + offsetWidth < scrollWidth - this.buttonWidth * 2.5 && this.scrollbarReachedEnd) {
        if (scrollLeft <= this.buttonWidth) { return; }
        for (let i = 0; i < this.rows; i++) {
          this._elContainer.lastElementChild?.remove();
          this.destroyedButtonsRight++;
        }
      }
      if (scrollLeft + offsetWidth > scrollWidth - this.buttonWidth && this.destroyedButtonsRight !== 0) {
        for (let i = 0; i < this.rows; i++) {
          this.createButton(this.numberOfItems - this.destroyedButtonsRight, true);
          this.destroyedButtonsRight--;
        }
      }
    } else {
      const { scrollTop, scrollHeight, offsetHeight } = this._elContainer;
      if (scrollTop < this.buttonHeight && this.destroyedButtonsLeft !== 0) {
        for (let i = 0; i < this.columns; i++) {
          this.createButton(this.destroyedButtonsLeft - 1, false);
          this.destroyedButtonsLeft--;
        }
        this._elContainer.scrollTop += this.buttonHeight;
      }
      if (scrollTop > this.buttonHeight * 3 && this.scrollbarReachedEnd === false) {
        if (scrollTop + offsetHeight > scrollHeight - this.buttonHeight) { return }
        for (let i = 0; i < this.columns; i++) {
          this._elContainer.children[0]?.remove();
          this.destroyedButtonsLeft++;
        }
        this._elContainer.scrollTop -= this.buttonHeight;
      }
      if (scrollTop + offsetHeight < scrollHeight - this.buttonHeight * 3 && this.scrollbarReachedEnd) {
        if (scrollTop <= this.buttonHeight) { return; }
        for (let i = 0; i < this.columns; i++) {
          this._elContainer.lastElementChild?.remove();
          this.destroyedButtonsRight++;
        }
      }
      if (scrollTop + offsetHeight > scrollHeight - this.buttonHeight && this.destroyedButtonsRight !== 0) {
        for (let i = 0; i < this.columns; i++) {
          this.createButton(this.numberOfItems - this.destroyedButtonsRight, true);
          this.destroyedButtonsRight--;
        }
      }
    }
  }

  private resizeHandler = () => {
    if (this.orientation === 'horizontal' && this._elContainer.children.length !== 0) {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      let loadableButtons = Math.floor(containerWidth / this.buttonWidth) * this.rows + this.rows * 2;
      loadableButtons = loadableButtons > this.numberOfItems ? this.numberOfItems : loadableButtons;
      for (let i = this.loadedButtons; i < loadableButtons; i++) {
        this.createButton(this.loadedButtons++);
      }
    }
    this.initScrollbar();
  }

  private initMembers() {
    this.destroyedButtonsLeft = 0;
    this.destroyedButtonsRight = 0;
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
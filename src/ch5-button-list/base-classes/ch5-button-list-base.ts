import { Ch5Button } from "../../ch5-button/ch5-button";
import { Ch5ButtonMode } from "../../ch5-button/ch5-button-mode";
import { Ch5ButtonLabel } from "../../ch5-button/ch5-button-label";
import { Ch5GenericListAttributes } from "../../ch5-generic-list-attributes/ch5-generic-list-attributes";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape } from './../interfaces/t-ch5-button-list';
import { ICh5ButtonListAttributes } from './../interfaces/i-ch5-button-list-attributes';
import { Ch5Properties } from "../../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../../ch5-core/ch5-property";
import { Ch5ButtonListModeBase } from "./ch5-button-list-mode-base";
import { Ch5ButtonListModeStateBase } from "./ch5-button-list-mode-state-base";
import { Ch5ButtonModeState } from "../../ch5-button/ch5-button-mode-state";
import { resizeObserver } from "../../ch5-core/resize-observer";
import { Ch5AugmentVarSignalsNames } from '../../ch5-common/ch5-augment-var-signals-names';
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../../ch5-core';

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
  public static readonly BUTTON_SHAPES: TCh5ButtonListButtonShape[] = ['rectangle', 'rounded-rectangle'];

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
        max: 4,
        conditionalMin: 0,
        conditionalMax: 4,
        conditionalMinValue: 0,
        conditionalMaxValue: 0
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
  private firstLoad: boolean = false;
  private isDown = false;
  private startX: number = 0;
  private startY: number = 0;
  private scrollListLeft: number = 0;
  private scrollListTop: number = 0;
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
    this.initCommonMutationObserver(this);
    this.debounceButtonDisplay();
    resizeObserver(this._elContainer, this.resizeHandler);
    subscribeInViewPortChange(this, () => {
      if (this.elementIsInViewPort && this.firstLoad === false) {
        this.debounceButtonDisplay();
        this.firstLoad = true;
      }
    });
    customElements.whenDefined(this.nodeName.toLowerCase()).then(() => {
      this.componentLoadedEvent(this.nodeName.toLowerCase(), this.id);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    unSubscribeInViewPortChange(this);
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

    // endless is handled in endlessHelper method
    if (this.endless) { return this.endlessHelper(); }

    // auto deletion and addition of buttons is handled
    if (this.orientation === 'horizontal') {
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.buttonWidth) { return; }
      let firstElement = Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
      let lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
      if (scrollLeft < 5 && firstElement !== 0) {
        let lastColumnElements = (lastElement + 1) % this.rows;
        for (let i = 0; i < this.rows; i++) {
          this.createButton(--firstElement, false);
          if ((lastElement + 1) % this.rows !== 0) {
            if (lastColumnElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollLeft += 5;
      } else if (scrollLeft + offsetWidth > scrollWidth - 5 && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          if (lastElement + 1 < this.numberOfItems) { this.createButton(++lastElement); }
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
          this.createButton(--firstElement, false);
          if ((lastElement + 1) % this.columns !== 0) {
            if (lastRowElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollTop += 5;
      } else if (scrollTop + offsetHeight > scrollHeight - 5 && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.columns; i++) {
          if (lastElement + 1 < this.numberOfItems) { this.createButton(++lastElement); }
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
        this.createButton(index, false);
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollLeft += 10;
      } else if (scrollLeft + offsetWidth > scrollWidth - 5) {
        const lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollLeft -= 10;
      }
    } else {
      if (scrollTop < 5) {
        const firstElement = Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollTop += 10;
      } else if (scrollTop + offsetHeight > scrollHeight - 5) {
        const lastElement = Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
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
    if (this.stretch === null) {
      this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');
    } else {
      this.debounceButtonDisplay();
    }
  }

  public handleCenterItems() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
    if (this.centerItems === true) {
      this.debounceButtonDisplay();
    }
  }

  public handleEndless() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    // This behavior is handled in scroll event
  }

  public handleScrollToPosition(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the button list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    // Remove all the children in the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const loadableButtons = Math.ceil(containerWidth / this.buttonWidth) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      // Right Edge case
      if (value >= this.numberOfItems - (loadableButtons - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableButtons; i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = value === this.numberOfItems - 1 ? this.buttonWidth * 3 : this.buttonWidth * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      }
      // In between the range
      else if (value >= Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER) {
        for (let i = value - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER; i < value + loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = this.buttonWidth * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      }
      // Left Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = this.buttonWidth * value;
      }
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      const loadableButtons = Math.ceil(containerHeight / this.buttonHeight) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      // If container height is not set then display all the button
      if (containerHeight <= 10 || containerHeight <= this.buttonHeight + 10) {
        for (let i = 0; i < this.numberOfItems; i++) { this.createButton(i); }
      }
      // Bottom Edge case
      else if (value >= this.numberOfItems - (loadableButtons - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableButtons; i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollTop = value === this.numberOfItems - 1 ? this.buttonHeight * 3 : this.buttonHeight * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      }
      // In between the range
      else if (value >= Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER) {
        for (let i = value - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER; i < value + loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollTop = this.buttonHeight * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      }
      // Top Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollTop = this.buttonHeight * value;
      }
    }
    this.initScrollbar();
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
    let loadedButtons = 0;
    if (this.orientation === 'horizontal') {
      // Find the number of initial buttons which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      loadedButtons = Math.floor(containerWidth / this.buttonWidth) * this.rows + this.rows * 2;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > this.buttonHeight + 10) {
        loadedButtons = Math.floor(containerHeight / this.buttonHeight) * this.columns + this.columns * 2;
      } else {
        loadedButtons = this.numberOfItems;
      }
    }
    loadedButtons = loadedButtons > this.numberOfItems ? this.numberOfItems : loadedButtons;
    for (let index = 1; index < loadedButtons; index++) {
      this.createButton(index);
    }
    if (this.endless) {
      this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5;
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    if (this.centerItems === true && this.scrollbarDimension < 100) { this.centerItems = false; }
    if (this.scrollToPosition !== 0) { this.debounceHandleScrollToPosition(this.scrollToPosition); }
  }

  private createButton(index: number, append: boolean = true) {
    if (index < 0) { return };
    const btn = new Ch5Button();
    const btnContainer = document.createElement("div");
    btnContainer.setAttribute('id', this.getCrId() + '-' + index);
    if (this.hasAttribute('buttonReceiveStateShow') && this.getAttribute("buttonReceiveStateShow")?.trim() && !this.hasAttribute('receiveStateShow')) {
      btnContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("buttonReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
      btnContainer.setAttribute('data-ch5-noshow-type', 'display');
    } else if (this.hasAttribute('receiveStateShow')) {
      btnContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("receiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
      btnContainer.setAttribute('data-ch5-noshow-type', 'display');
    }
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

  protected buttonModeHelper(btn: Ch5Button, i: number) {
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
                if (buttonListModeState.parentElement instanceof Ch5ButtonListModeBase) {
                  const buttonModeState = new Ch5ButtonModeState(btn);
                  Ch5ButtonModeState.observedAttributes.forEach((attr) => {
                    if (buttonListModeState.hasAttribute(attr)) {
                      buttonModeState.setAttribute(attr, buttonListModeState.getAttribute(attr) + '');
                    }
                  });

                  const buttonModeStateLabels = buttonListModeState.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
                  if (buttonModeStateLabels && buttonModeStateLabels.length > 0) {
                    Array.from(buttonModeStateLabels).forEach((buttonModeStateLabel) => {
                      if (buttonModeStateLabel.parentElement instanceof Ch5ButtonListModeStateBase) {
                        const buttonModeStateLabelTemplate = buttonModeStateLabel.getElementsByTagName("template");
                        if (buttonModeStateLabelTemplate && buttonModeStateLabelTemplate.length > 0) {
                          const ch5ButtonLabel = new Ch5ButtonLabel();
                          const template = document.createElement('template');
                          template.innerHTML = buttonModeStateLabelTemplate[0].innerHTML;
                          Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(template, i, this.indexId);
                          Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(template, i, this.indexId);
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
                if (buttonListModeLabel.parentElement instanceof Ch5ButtonListModeBase) {
                  const buttonListModeLabelTemplate = buttonListModeLabel.getElementsByTagName("template");
                  if (buttonListModeLabelTemplate && buttonListModeLabelTemplate.length > 0) {
                    const ch5ButtonLabel = new Ch5ButtonLabel();
                    const template = document.createElement('template');
                    template.innerHTML = buttonListModeLabelTemplate[0].innerHTML;
                    Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(template, i, this.indexId);
                    Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(template, i, this.indexId);
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
            template.innerHTML = buttonListLabelTemplate[0].innerHTML;
            Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(template, index, this.indexId);
            Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(template, index, this.indexId);
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
    btn.setAttribute('shape', 'rectangle');
    Ch5ButtonListBase.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
      if (index < individualButtonsLength) {
        if (attr.name.toLowerCase() === 'buttoniconclass') {

          if (individualButtons[index] && individualButtons[index].hasAttribute('iconclass')) {
            const attrValue = individualButtons[index].getAttribute('iconclass')?.trim();
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
          if (individualButtons[index] && individualButtons[index].hasAttribute('iconurl')) {
            const attrValue = individualButtons[index].getAttribute('iconurl')?.trim();
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
            if (this.getAttribute(attr.name)?.trim().includes(`{{${this.indexId}}}`) === false) {
              const attrValue = this.getAttribute(attr.name)?.trim();
              if (attrValue) {
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
              }
            } else if (this.getAttribute(attr.name)?.trim().length !== 0) {
              const attrValue = this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, '');
              const isNumber = /^[0-9]+$/.test(attrValue);
              if (isNumber) {
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
              } else {
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, index + ''));
              }
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
          if (this.getAttribute(attr.name)?.trim().includes(`{{${this.indexId}}}`) === false) {
            const attrValue = this.getAttribute(attr.name)?.trim();
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          } else if (this.getAttribute(attr.name)?.trim().length !== 0) {
            const attrValue = this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, '');
            const isNumber = /^[0-9]+$/.test(attrValue);
            if (isNumber) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
            } else {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, index + ''));
            }
          }
        }
      }
    });

    Ch5ButtonListBase.COMPONENT_COMMON_PROPERTIES.forEach((attr: string) => {
      if (this.hasAttribute(attr)) {
        btn.setAttribute(attr, this.getAttribute(attr) + '');
      }
    });

    const individualButtonAttributes = ['onRelease', 'labelInnerHTML'];
    individualButtonAttributes.forEach((attr: string) => {
      if (index < individualButtonsLength && individualButtons[index] && individualButtons[index].hasAttribute(attr)) {
        const attrValue = individualButtons[index].getAttribute(attr)?.trim();
        if (attrValue) {
          btn.setAttribute(attr, attrValue.trim());
        }
      }
    });
  }

  private replaceAll(str: string, find: string, replace: string) {
    if (str && String(str).trim() !== "") {
      return String(str).split(find).join(replace);
    } else {
      return str;
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
    } else {
      const { scrollHeight, offsetHeight, scrollTop } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      const scrollbarTop = Math.ceil(scrollTop / scrollHeight * 100);
      this._scrollbar.style.removeProperty('width');
      this._scrollbar.style.removeProperty('left');
      this._scrollbar.style.height = this.scrollbarDimension + '%';
      this._scrollbar.style.top = scrollbarTop + '%';
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

  private resizeHandler = () => {
    if (this.orientation === 'horizontal' && this._elContainer.children.length !== 0) {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      let loadableButtons = Math.floor(containerWidth / this.buttonWidth) * this.rows + this.rows * 2;
      loadableButtons = loadableButtons > this.numberOfItems ? this.numberOfItems : loadableButtons;
      let containerChildren = this._elContainer.children.length;
      for (let i = containerChildren; i < loadableButtons; i++) {
        this.createButton(containerChildren++);
      }
    }
    this.initScrollbar();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  //#endregion

}
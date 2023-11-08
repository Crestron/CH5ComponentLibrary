import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5TextInputIconPosition, TCh5TextInputType, TCh5TextInputSize, TCh5TextInputStretch, TCh5TextInputTextTransform, } from './interfaces/t-ch5-text-input';
import { ICh5TextInputAttributes } from './interfaces/i-ch5-text-input-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5CommonInput } from "../ch5-common-input/ch5-common-input";
import { Ch5TextInputMask } from "./ch5-textinput-mask";
import { Ch5TextInputScaling } from "./ch5-textinput-scaling";
import HtmlCallback from "../ch5-common/utils/html-callback";


export class Ch5TextInput extends Ch5CommonInput implements ICh5TextInputAttributes {

  //#region Variables

  public static readonly ICON_POSITION: TCh5TextInputIconPosition[] = ['first', 'last'];
  public static readonly INPUT_TYPE: TCh5TextInputType[] = ['text', 'number', 'email', 'password'];
  public static readonly SIZE: TCh5TextInputSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];
  public static readonly STRETCH: TCh5TextInputStretch[] = ['fixed', 'width', 'content'];
  public static readonly TEXT_TRANSFORM: TCh5TextInputTextTransform[] = ['none', 'capitalize', 'uppercase', 'lowercase'];
  public static readonly COMPONENT_DATA: any = {
    ICON_POSITION: {
      default: Ch5TextInput.ICON_POSITION[0],
      values: Ch5TextInput.ICON_POSITION,
      key: 'iconPosition',
      attribute: 'iconPosition',
      classListPrefix: '--icon-position-'
    },
    INPUT_TYPE: {
      default: Ch5TextInput.INPUT_TYPE[0],
      values: Ch5TextInput.INPUT_TYPE,
      key: 'type',
      attribute: 'type',
      classListPrefix: '--input-type-'
    },
    SIZE: {
      default: Ch5TextInput.SIZE[0],
      values: Ch5TextInput.SIZE,
      key: 'size',
      attribute: 'size',
      classListPrefix: '-container--size-'
    },
    STRETCH: {
      default: Ch5TextInput.STRETCH[0],
      values: Ch5TextInput.STRETCH,
      key: 'stretch',
      attribute: 'stretch',
      classListPrefix: '-container--stretch-'
    },
    TEXT_TRANSFORM: {
      default: Ch5TextInput.TEXT_TRANSFORM[0],
      values: Ch5TextInput.TEXT_TRANSFORM,
      key: 'text-transform',
      attribute: 'text-transform',
      classListPrefix: '--text-transform-'
    },
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatefocus: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatevalue: { direction: "state", stringJoin: 1, contractName: true },
    sendeventonchange: { direction: "event", stringJoin: 1, contractName: true },
    sendeventonfocus: { direction: "event", stringJoin: 1, contractName: true },
    sendeventonblur: { direction: "event", stringJoin: 1, contractName: true },
    sendeventonenterkey: { direction: "event", booleanJoin: 1, contractName: true },
    sendeventonesckey: { direction: "event", booleanJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "",
      name: "pattern",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "mask",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "iconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "icon",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "label",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "placeholder",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: Ch5TextInput.ICON_POSITION[0],
      enumeratedValues: Ch5TextInput.ICON_POSITION,
      name: "iconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TextInput.ICON_POSITION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5TextInput.INPUT_TYPE[0],
      enumeratedValues: Ch5TextInput.INPUT_TYPE,
      name: "type",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TextInput.INPUT_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: 0,
      name: "minLength",
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
      name: "maxLength",
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
      name: "minValue",
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
      name: "maxValue",
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
      default: Ch5TextInput.SIZE[0],
      enumeratedValues: Ch5TextInput.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TextInput.SIZE[0],
      isObservableProperty: true,
    },
    {
      default: null,
      enumeratedValues: Ch5TextInput.STRETCH,
      name: "stretch",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: null,
      isObservableProperty: true,
      isNullable: true,
    },
    {
      default: Ch5TextInput.TEXT_TRANSFORM[0],
      enumeratedValues: Ch5TextInput.TEXT_TRANSFORM,
      name: "text-transform",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TextInput.TEXT_TRANSFORM[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "scaling",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: 12,
      name: "minimumFontSize",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 10000,
        conditionalMin: 0,
        conditionalMax: 10000,
        conditionalMinValue: 0,
        conditionalMaxValue: 10000
      },
      isObservableProperty: true
    },
    {
      default: 0,
      name: "tabIndex",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 100000,
        conditionalMin: 0,
        conditionalMax: 100000,
        conditionalMinValue: 0,
        conditionalMaxValue: 100000
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateFocus",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateValue",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnChange",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnFocus",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnBlur",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "onValidityChange",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "value",
      nameForSignal: "receiveStateValue",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnEnterKey",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnEscKey",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-textinput';

  public primaryCssClass = 'ch5-textinput';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;

  protected _elInput: HTMLInputElement = {} as HTMLInputElement;
  private _elIcon: HTMLElement = {} as HTMLElement;
  private _labelElement: HTMLLabelElement = {} as HTMLLabelElement;

  private _maskingUtility: Ch5TextInputMask | null = null;
  private _scalingUtility: Ch5TextInputScaling | null = null;

  private lastValidState: boolean = false as boolean;
  private dirtyCustomEvent: CustomEvent = {} as CustomEvent;
  private validityChangeEvent: CustomEvent = {} as CustomEvent;
  private cleanCustomEvent: CustomEvent = {} as CustomEvent;
  private _onValidityChange: HtmlCallback | ((this: any, arg: any) => void) = {} as HtmlCallback;
  //#endregion

  //#region Getters and Setters

  public set pattern(value: string) {
    this._ch5Properties.set<string>("pattern", value, () => {
      this.handlePattern();
    });
  }
  public get pattern(): string {
    return this._ch5Properties.get<string>("pattern");
  }
  public set mask(value: string) {
    this._ch5Properties.set<string>("mask", value, () => {
      this.handleMask();
    });
  }
  public get mask(): string {
    return this._ch5Properties.get<string>("mask");
  }

  public set iconClass(value: string) {
    this._ch5Properties.set<string>("iconClass", value, () => {
      this.handleIconClass();
    });
  }
  public get iconClass(): string {
    return this._ch5Properties.get<string>("iconClass");
  }

  public set icon(value: string) {
    this._ch5Properties.set<string>("icon", value, () => {
      this.handleIcon();
    });
  }
  public get icon(): string {
    return this._ch5Properties.get<string>("icon");
  }

  public set label(value: string) {
    this._ch5Properties.set<string>("label", value, () => {
      this.handleLabel();
    });
  }
  public get label(): string {
    return this._ch5Properties.get<string>("label");
  }

  public set placeholder(value: string) {
    this._ch5Properties.set<string>("placeholder", value, () => {
      this.handlePlaceholder();
    });
  }
  public get placeholder(): string {
    return this._ch5Properties.get<string>("placeholder");
  }

  public set iconPosition(value: TCh5TextInputIconPosition) {
    this._ch5Properties.set<TCh5TextInputIconPosition>("iconPosition", value, () => {
      this.handleIconPosition();
    });
  }
  public get iconPosition(): TCh5TextInputIconPosition {
    return this._ch5Properties.get<TCh5TextInputIconPosition>("iconPosition");
  }

  public set type(value: TCh5TextInputType) {
    this._ch5Properties.set<TCh5TextInputType>("type", value, () => {
      this.handleType();
    });
  }
  public get type(): TCh5TextInputType {
    return this._ch5Properties.get<TCh5TextInputType>("type");
  }

  public set minLength(value: number) {
    this._ch5Properties.set<number>("minLength", value, () => {
      this._elInput.minLength = this.minLength;
      this._elInput.setAttribute('minlength', this.minLength + '');
    });
  }
  public get minLength(): number {
    return this._ch5Properties.get<number>("minLength");
  }

  public set maxLength(value: number) {
    this._ch5Properties.set<number>("maxLength", value, () => {
      this._elInput.maxLength = this.maxLength;
      this._elInput.setAttribute('maxlength', this.maxLength + '');
    });
  }
  public get maxLength(): number {
    return this._ch5Properties.get<number>("maxLength");
  }

  public set minValue(value: number) {
    this._ch5Properties.set<number>("minValue", value, () => {
      this.handleMinValue();
    });
  }
  public get minValue(): number {
    return this._ch5Properties.get<number>("minValue");
  }

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value, () => {
      this.handleMaxValue();
    });
  }
  public get maxValue(): number {
    return this._ch5Properties.get<number>("maxValue");
  }

  public set size(value: TCh5TextInputSize) {
    this._ch5Properties.set<TCh5TextInputSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5TextInputSize {
    return this._ch5Properties.get<TCh5TextInputSize>("size");
  }

  public set stretch(value: TCh5TextInputStretch | null) {
    this._ch5Properties.set<TCh5TextInputStretch | null>("stretch", value, () => {
      this.handleStretch();
    });
  }
  public get stretch(): TCh5TextInputStretch | null {
    return this._ch5Properties.get<TCh5TextInputStretch | null>("stretch");
  }

  public set textTransform(value: TCh5TextInputTextTransform) {
    this._ch5Properties.set<TCh5TextInputTextTransform>("text-transform", value, () => {
      this.handleTextTransform();
    });
  }
  public get textTransform(): TCh5TextInputTextTransform {
    return this._ch5Properties.get<TCh5TextInputTextTransform>("text-transform");
  }

  public set scaling(value: boolean) {
    this._ch5Properties.set<boolean>("scaling", value, () => {
      this.handleScaling();
    });
  }
  public get scaling(): boolean {
    return this._ch5Properties.get<boolean>("scaling");
  }

  public set minimumFontSize(value: number) {
    this._ch5Properties.set<number>("minimumFontSize", value, () => {
      if (this._scalingUtility !== null) { this._scalingUtility.minimumFontSize = this.minimumFontSize; }
    });
  }
  public get minimumFontSize(): number {
    return this._ch5Properties.get<number>("minimumFontSize");
  }

  public set tabIndex(value: number) {
    this._ch5Properties.set<number>("tabIndex", value, () => {
      this._elInput.tabIndex = value;
      this._elInput.setAttribute('tabindex', this.tabIndex + '');
    });
  }
  public get tabIndex(): number {
    return this._ch5Properties.get<number>("tabIndex");
  }

  public set receiveStateFocus(value: string) {
    this._ch5Properties.set("receiveStateFocus", value, null, (newValue: boolean) => {
      newValue === true ? this._elInput.focus() : this._elInput.blur();
    });
  }
  public get receiveStateFocus(): string {
    return this._ch5Properties.get<string>('receiveStateFocus');
  }

  public set receiveStateValue(value: string) {
    this._ch5Properties.set("receiveStateValue", value, null, (newValue: string) => {
      this.updateValue(newValue);
    });
  }
  public get receiveStateValue(): string {
    return this._ch5Properties.get<string>('receiveStateValue');
  }

  public set sendEventOnChange(value: string) {
    this._ch5Properties.set("sendEventOnChange", value);
  }
  public get sendEventOnChange(): string {
    return this._ch5Properties.get<string>('sendEventOnChange');
  }

  public set sendEventOnFocus(value: string) {
    this._ch5Properties.set("sendEventOnFocus", value);
  }
  public get sendEventOnFocus(): string {
    return this._ch5Properties.get<string>('sendEventOnFocus');
  }

  public set sendEventOnBlur(value: string) {
    this._ch5Properties.set("sendEventOnBlur", value);
  }
  public get sendEventOnBlur(): string {
    return this._ch5Properties.get<string>('sendEventOnBlur');
  }

  public set value(value: string) {
    this._ch5Properties.set<string>("value", value);
  }
  public get value(): string {
    return this._ch5Properties.get<string>("value");
  }


  public set sendEventOnEnterKey(value: string) {
    this._ch5Properties.set("sendEventOnEnterKey", value);
  }
  public get sendEventOnEnterKey(): string {
    return this._ch5Properties.get<string>('sendEventOnEnterKey');
  }

  public set sendEventOnEscKey(value: string) {
    this._ch5Properties.set("sendEventOnEscKey", value);
  }
  public get sendEventOnEscKey(): string {
    return this._ch5Properties.get<string>('sendEventOnEscKey');
  }

  public set onValidityChange(callback: HtmlCallback | ((this: any, arg: any) => void)) {
    if (callback === null || callback === undefined) {
      callback = {} as HtmlCallback;
    }
    if (callback instanceof HtmlCallback && this.onValidityChange instanceof Function) { return; }
    this._onValidityChange = callback;
  }

  public get onValidityChange(): HtmlCallback | ((this: any, arg: any) => void) {
    return this._onValidityChange;
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5TextInput.ELEMENT_NAME, Ch5TextInput.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TextInput.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TextInput.ELEMENT_NAME, Ch5TextInput);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5TextInput.ELEMENT_NAME);
    this.ignoreAttributes = [];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5TextInput.COMPONENT_PROPERTIES);
    this.updateCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes.concat(Ch5CommonInput.observedAttributes);
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5TextInput.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5TextInput.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5TextInput.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-textinput attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5TextInput.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
      if (attributeChangedProperty) {
        const thisRef: any = this;
        const key = attributeChangedProperty.name;
        thisRef[key] = newValue;
      } else {
        super.attributeChangedCallback(attr, oldValue, newValue);
      }
      this._addAriaAttributes();
      if (attr === 'disabled') {
        this.disabled === true ? this._elInput.setAttribute('disabled', '') : this._elInput.removeAttribute('disabled');
      }
    }
    this.logger.stop();
  }

  /**
   * Called when the Ch5TextInput component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5TextInput.ELEMENT_NAME);
    this.createInternalHtml();
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5TextInput);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-textinput');
      this.appendChild(this._elContainer);
    }
    if (this.hasAttribute('value')) {
      this.value = this.getAttribute('value') as string;
      this.cleanValue = this.value;
      this._elInput.value = this.cleanValue;
    }
    this.attachEventListeners();
    this.initAttributes();
    this._addAriaAttributes();
    this.initCommonMutationObserver(this);
    this.lastValidState = this.getValid();
    customElements.whenDefined('ch5-textinput').then(() => {
      this.componentLoadedEvent(Ch5TextInput.ELEMENT_NAME, this.id);
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
    this.classList.add(this.primaryCssClass);

    this._elContainer = document.createElement('div');
    this._elContainer.classList.add(this.primaryCssClass + '-container');

    this._elIcon = document.createElement('i');
    this._elIcon.classList.add(this.primaryCssClass + '--icon');

    this._elInput = document.createElement('input');
    this._elInput.classList.add(this.primaryCssClass + '--input');

    this._labelElement = document.createElement('label');
    this._labelElement.classList.add(this.primaryCssClass + '--label');

    this._elContainer.appendChild(this._elInput);

    this._elIcon.setAttribute('role', 'icon');
    this._elInput.setAttribute('aria-multiline', 'false');
    this._elInput.setAttribute('role', 'textbox');
    this.appendChild(this._elContainer);

    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5TextInput.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5TextInput.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5TextInput.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5TextInput.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._elInput.addEventListener('keyup', this.onChangeHandler);
    this._elInput.addEventListener('keydown', this.keyDownHandler);
    this._elInput.addEventListener('focus', this.onFocusHandler);
    this._elInput.addEventListener('blur', this.onBlurHandler);
    this._elInput.addEventListener('input', this.onKeyPressHandler);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elInput.removeEventListener('keyup', this.onChangeHandler);
    this._elInput.removeEventListener('keydown', this.keyDownHandler)
    this._elInput.removeEventListener('focus', this.onFocusHandler);
    this._elInput.removeEventListener('blur', this.onBlurHandler);
    this._elInput.removeEventListener('input', this.onKeyPressHandler);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  /**
   * Clear the content of component in order to avoid duplication of elements
   */
  private clearComponentContent() {
    const containers = this.children;
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }

  private handlePattern() {
    this._elInput.setAttribute('pattern', this.pattern);
    if (this.mask !== "") {
      this._elInput.removeAttribute('mask');
      this.mask = "";
      this._maskingUtility = null;
      this.repaint();
    }
  }

  private handleMask() {
    if (this.hasAttribute('pattern') && this.getAttribute('pattern') !== null && this.getAttribute('pattern') !== "") { return; }
    this._elInput.setAttribute('mask', this.mask);
    this._maskingUtility = new Ch5TextInputMask(this._elInput, this.mask);
    this._maskingUtility.init();
    if (this.hasAttribute('placeholder')) {
      this._maskingUtility.placeholder = this.placeholder;
    }
  }

  private handleIconClass() {
    this._elIcon.className = '';
    this._elIcon.classList.add(this.primaryCssClass + '--icon')
    this._elIcon.classList.add(this.primaryCssClass + '--icon-position-' + this.iconPosition)
    this.iconClass.split(' ').forEach((clsName: string) => this._elIcon.classList.add(clsName));
    this.iconClass === '' ? this._elIcon.remove() : this.iconPosition === 'first' ? this._elInput.parentElement?.prepend(this._elIcon) : this._elInput.parentElement?.appendChild(this._elIcon);
  }

  private handleIcon() {
    this._elIcon.className = '';
    this._elIcon.classList.add(this.primaryCssClass + '--icon');
    this._elIcon.classList.add(this.primaryCssClass + '--icon-position-' + this.iconPosition)
    this.icon.split(' ').forEach((clsName: string) => this._elIcon.classList.add(clsName));
    this.iconClass === '' ? this._elIcon.remove() : this.iconPosition === 'first' ? this._elInput.parentElement?.prepend(this._elIcon) : this._elInput.parentElement?.appendChild(this._elIcon);
  }

  private handleLabel() {
    this.label = this._getTranslatedValue('label', this.label);
    this._labelElement.innerHTML = this.label;
    this.label === "" ? this.removeChild(this._labelElement) : this.prepend(this._labelElement);
  }

  private handlePlaceholder() {
    this.placeholder = this._getTranslatedValue('placeholder', this.placeholder);
    this._elInput.setAttribute('placeholder', this.placeholder);
    if (this._maskingUtility !== null) {
      this._maskingUtility.placeholder = this.placeholder;
    }
  }

  private handleIconPosition() {
    this._elIcon.classList.remove(this.primaryCssClass + '--icon-position-' + 'left');
    this._elIcon.classList.remove(this.primaryCssClass + '--icon-position-' + 'right');
    this._elIcon.classList.add(this.primaryCssClass + '--icon-position-' + this.iconPosition);
  }
  private handleType() {
    this._elInput.setAttribute('type', this.type);
  }

  private handleMinValue() {
    this._elInput.setAttribute('min', this.minValue + '');
  }

  private handleMaxValue() {
    this._elInput.setAttribute('max', this.maxValue + '');
  }
  private handleSize() {
    Array.from(Ch5TextInput.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    Array.from(Ch5TextInput.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._labelElement.classList.remove(this.primaryCssClass + '--label-' + e);
    });
    this._labelElement.classList.add(this.primaryCssClass + '--label-' + this.size);
    this._scalingUtility?.updateDefaultFontSize();
    this._maskingUtility?._makeMaskElementLookAsInputPlaceholder();
  }

  private handleStretch() {
    Array.from(Ch5TextInput.COMPONENT_DATA.STRETCH.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.STRETCH.classListPrefix + e);
    });
    if (this.stretch) {
      this._elContainer.classList.add(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.STRETCH.classListPrefix + this.stretch);
    }
  }

  private handleTextTransform() {
    Array.from(Ch5TextInput.COMPONENT_DATA.TEXT_TRANSFORM.values).forEach((e: any) => {
      this._elInput.classList.remove(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.TEXT_TRANSFORM.classListPrefix + e);
    });
    this._elInput.classList.add(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.TEXT_TRANSFORM.classListPrefix + this.textTransform);
  }

  private handleScaling() {
    this._scalingUtility = this.scaling === true ? new Ch5TextInputScaling(this._elInput) : null;
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._elContainer.classList.add(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this._labelElement.classList.add(this.primaryCssClass + '--label-' + this.size);
    this._elIcon.classList.add(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.ICON_POSITION.classListPrefix + this.iconPosition);
    this._elInput.classList.add(this.primaryCssClass + Ch5TextInput.COMPONENT_DATA.TEXT_TRANSFORM.classListPrefix + this.textTransform)
    this.logger.stop();
  }

  public onChangeHandler = (inEvent: Event) => {
    const currentElement = inEvent.currentTarget as HTMLInputElement;

    this.value = (inEvent.currentTarget as HTMLInputElement).value;
    this._dirty = true;
    this._clean = false;

    if (this.feedbackMode === 'direct') {
      this._onChangeSignal(currentElement.value);
      this.dirtyTimerHandle();
    } else if (this.feedbackMode === 'submit') {
      this._createValidityChangeEvent(currentElement.value);
      this._createDirtyCustomEvent(currentElement.value);

      // dispatch dirty event
      (currentElement as HTMLElement).dispatchEvent(this.dirtyCustomEvent as CustomEvent);
      this.runEventHandlers('dirty', this.dirtyCustomEvent);

      if (this.lastValidState !== this.getValid()) {
        // dispatch validitychange event
        (currentElement as HTMLElement).dispatchEvent(this.validityChangeEvent as CustomEvent);

        if (this.onValidityChange instanceof HtmlCallback) {
          this.onValidityChange.run(this.validityChangeEvent);
        } else if (this.onValidityChange instanceof Function) {
          this.onValidityChange.call(this, this.validityChangeEvent);
        }
      }

      this.lastValidState = this.getValid();
    }
    this.highlightInputIfNotValid();
  }

  protected _onChangeSignal(value: string) {
    if (this.sendEventOnChange) {
      Ch5SignalFactory.getInstance().getStringSignal(this.sendEventOnChange)?.publish(Ch5Common.handlingTextTransformValue(value, this.textTransform))
    }
  }

  public dirtyTimerHandle(): void {
    if (this._dirtyTimerHandle !== null) { clearTimeout(this._dirtyTimerHandle); }
    this._dirtyTimerHandle = window.setTimeout(() => this.valueSync(), this.signalValueSyncTimeout as number);
  }

  public valueSync(): void {
    this._dirtyTimerHandle = null;
    if (this._elInput.value !== this.cleanValue) {
      this._createCleanCustomEvent();
      this.dispatchEvent(this.cleanCustomEvent);
      this.runEventHandlers('clean', this.cleanCustomEvent);

      this.value = Ch5Common.handlingTextTransformValue(this.cleanValue as string, this.textTransform);
      this._elInput.value = this.value + '';
      this._clean = true;
      this._dirty = false;

      if (this.mask !== '' && this._maskingUtility !== null) {

        const lastValueLength = this._maskingUtility.lastValueLength;
        const valueLength = (this.value as string).length;
        this._maskingUtility.dispatchMaskUpdateEvent();

        for (let i = lastValueLength; i >= valueLength; i--) {
          this._maskingUtility._updateCharactersInMask();
          this._maskingUtility.lastValueLength--;
        }

        if ((this.value as string).length === 0) {
          const focusEvent = new Event('focus');
          this._elInput.dispatchEvent(focusEvent);
        }
      }
    }
  }

  private keyDownHandler = (inEvent: KeyboardEvent) => {
    const isEnterDown = inEvent.keyCode === 13 || inEvent.code === 'Enter' || inEvent.key === 'Enter'
    // code for esc is Escape or Esc on different browsers
    const isEscDown = inEvent.keyCode === 27 || inEvent.code.includes('Esc') || inEvent.key.includes('Esc')

    if (isEnterDown || isEscDown) {
      const currentElement = inEvent.currentTarget as HTMLInputElement;
      this._dirty = true;
      this._clean = false;
      this.dirtyValue = currentElement.value;
    }

    if (isEnterDown && this.sendEventOnEnterKey) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnEnterKey)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnEnterKey)?.publish(false);
    } else if (isEscDown && this.sendEventOnEscKey) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnEscKey)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnEscKey)?.publish(false);
    }
  }

  private onFocusHandler = () => {
    if (this.lastValidState === undefined || this.lastValidState === null) { this.lastValidState = this.getValid(); }
    if (this.sendEventOnFocus) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnFocus)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnFocus)?.publish(false);
    }
    this.classList.add(this.primaryCssClass + '--focused');
    this.highlightInputIfNotValid();
  }

  public onBlurHandler = () => {
    if (this.sendEventOnBlur) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnBlur)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnBlur)?.publish(false);
    }
    this.classList.remove(this.primaryCssClass + '--focused');
    this.highlightInputIfNotValid();
  }

  protected highlightInputIfNotValid(): void {
    const modifierClassName = this.primaryCssClass + '--error';
    if (!this.getValid()) {
      this.classList.add(modifierClassName);
      this._elInput.classList.add(modifierClassName);
    } else {
      this.classList.remove(modifierClassName);
      this._elInput.classList.remove(modifierClassName);
    }
  }

  public onKeyPressHandler = (inEvent: Event) => {
    if (this.feedbackMode === 'direct') {
      const currentElement = inEvent.currentTarget as HTMLInputElement;
      this._dirty = true;
      this._clean = false;
      this.dirtyValue = currentElement.value
    }
  }

  public setValue(value: string) {
    this.value = value;
    this._elInput.value = value;
  }

  public submit(): void {
    if (this.feedbackMode === 'submit' && this.getValid() === true) {
      if (this.value !== this.cleanValue && this.dirtyValue !== this.value) {
        this._onChangeSignal(this.value as string);
      }
      this._submitted = true;
      this._dirty = false;
      this.dirtyValue = this._elInput.value;
      this.dirtyTimerHandle();
      this._clean = true;
    }
  }

  public reset() {
    this._clean = true;
    this._dirty = false;
    this.value = this._cleanValue as string;
    this._elInput.value = this.value + '';

    this._createCleanCustomEvent();
    this.dispatchEvent(this.cleanCustomEvent);

    if (this.onclean instanceof HtmlCallback) {
      this.onclean.run({} as Event);
    } else if (this.onclean instanceof Function) {
      this.onclean();
    }

  }

  public updateValue(value: string) {
    this.dirtyValue = value;
    this.value = this._elInput.value = value;
    this.cleanValue = value;
    this._elInput.setAttribute('value', this.cleanValue + '');
  }

  public getValid(): boolean {
    return this._elInput.validity.valid && !this._elInput.validity.tooLong && !this._elInput.validity.tooShort;
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  private _createValidityChangeEvent(message: string): void {
    this.validityChangeEvent = this._createCustomEvent('validitychange', message);
  }

  private _createDirtyCustomEvent(message: string): void {
    this.dirtyCustomEvent = this._createCustomEvent('dirty', message);
  }

  private _createCleanCustomEvent(): void {
    this.cleanCustomEvent = this._createCustomEvent('clean');
  }

  private _createCustomEvent(eventName: string, message: string = ''): CustomEvent {
    const event = new CustomEvent(eventName, {
      detail: {
        message,
        time: new Date()
      },
      bubbles: true,
      cancelable: true
    });

    return event;
  }

  private _addAriaAttributes() {
    this._elInput.setAttribute('aria-placeholder', this.placeholder);
    this._elInput.setAttribute('aria-required', this.required + '');
    this._labelElement.setAttribute('aria-label', this.label);
    this._elInput.setAttribute('aria-labeledby', this.label);
  }
  //#endregion
}

Ch5TextInput.registerCustomElement();
Ch5TextInput.registerSignalAttributeTypes();

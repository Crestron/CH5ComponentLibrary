import { Ch5Button } from "../ch5-button/ch5-button";
import { Ch5ButtonLabel } from "../ch5-button/ch5-button-label";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5TabButtonButtonType, TCh5TabButtonButtonHAlignLabel, TCh5TabButtonButtonVAlignLabel, TCh5TabButtonButtonShape, TCh5TabButtonButtonIconPosition, TCh5TabButtonAttributesOrientation, ICh5ButtonListContractObj } from "./interfaces/t-ch5-tab-button";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { ICh5TabButtonAttributes } from "./interfaces/i-ch5-tab-button-attributes";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";
import { Ch5Common } from "../ch5-common/ch5-common";
export class Ch5TabButton extends Ch5Common implements ICh5TabButtonAttributes {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-tab-button';

  // Enum types
  public static readonly BUTTON_TYPES: TCh5TabButtonButtonType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly BUTTON_HALIGN_LABEL_POSITIONS: TCh5TabButtonButtonHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly BUTTON_VALIGN_LABEL_POSITIONS: TCh5TabButtonButtonVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly BUTTON_SHAPES: TCh5TabButtonButtonShape[] = ['rectangle', 'rounded-rectangle', 'tab'];
  public static readonly BUTTON_ICON_POSITIONS: TCh5TabButtonButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];
  public static readonly ORIENTATION: TCh5TabButtonAttributesOrientation[] = ['horizontal', 'vertical'];

  public static COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5TabButton.ORIENTATION[0],
      values: Ch5TabButton.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
    },
    BUTTON_TYPE: {
      default: Ch5TabButton.BUTTON_TYPES[0],
      values: Ch5TabButton.BUTTON_TYPES,
      key: 'buttonType',
      attribute: 'buttonType',
      classListPrefix: '--button-type-'
    },
    BUTTON_HALIGN_LABEL: {
      default: Ch5TabButton.BUTTON_HALIGN_LABEL_POSITIONS[0],
      values: Ch5TabButton.BUTTON_HALIGN_LABEL_POSITIONS,
      key: 'buttonHAlignLabel',
      attribute: 'buttonHAlignLabel',
      classListPrefix: '--button-halign-label-'
    },
    BUTTON_VALIGN_LABEL: {
      default: Ch5TabButton.BUTTON_VALIGN_LABEL_POSITIONS[0],
      values: Ch5TabButton.BUTTON_VALIGN_LABEL_POSITIONS,
      key: 'buttonVAlignLabel',
      attribute: 'buttonVAlignLabel',
      classListPrefix: '--button-valign-label-'
    },
    BUTTON_ICON_POSITION: {
      default: Ch5TabButton.BUTTON_ICON_POSITIONS[0],
      values: Ch5TabButton.BUTTON_ICON_POSITIONS,
      key: 'buttonIconPosition',
      attribute: 'buttonIconPosition',
      classListPrefix: '--button-icon-position-'
    },
    BUTTON_SHAPE: {
      default: Ch5TabButton.BUTTON_SHAPES[0],
      values: Ch5TabButton.BUTTON_SHAPES,
      key: 'buttonShape',
      attribute: 'buttonShape',
      classListPrefix: '--button-shape-'
    }
  };

  public static readonly COMPONENT_COMMON_PROPERTIES = ['disabled', 'show'];
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "",
      name: "indexId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: 3,
      name: "numberOfItems",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 3,
      numberProperties: {
        min: 2,
        max: 15,
        conditionalMin: 2,
        conditionalMax: 15,
        conditionalMinValue: 2,
        conditionalMaxValue: 15
      },
      isObservableProperty: true
    },
    {
      default: Ch5TabButton.ORIENTATION[0],
      enumeratedValues: Ch5TabButton.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TabButton.ORIENTATION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5TabButton.BUTTON_TYPES[0],
      enumeratedValues: Ch5TabButton.BUTTON_TYPES,
      name: "buttonType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TabButton.BUTTON_TYPES[0],
      isObservableProperty: true
    },
    {
      default: Ch5TabButton.BUTTON_HALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5TabButton.BUTTON_HALIGN_LABEL_POSITIONS,
      name: "buttonHAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TabButton.BUTTON_HALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5TabButton.BUTTON_VALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5TabButton.BUTTON_VALIGN_LABEL_POSITIONS,
      name: "buttonVAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TabButton.BUTTON_VALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5TabButton.BUTTON_ICON_POSITIONS[0],
      enumeratedValues: Ch5TabButton.BUTTON_ICON_POSITIONS,
      name: "buttonIconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TabButton.BUTTON_ICON_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5TabButton.BUTTON_SHAPES[0],
      enumeratedValues: Ch5TabButton.BUTTON_SHAPES,
      name: "buttonShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5TabButton.BUTTON_SHAPES[0],
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
    },
    {
      default: "",
      name: "contractName",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
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
    }
  ];

  public primaryCssClass = 'ch5-tab-button';
  protected _ch5Properties: Ch5Properties;
  protected _elContainer: HTMLElement = {} as HTMLElement;

  private signalNameOnContract = {
    contractName: "",
    receiveStateCustomClass: "",
    receiveStateCustomStyle: "",
    receiveStateEnable: "",
    receiveStateShow: "",
  }

  public debounceButtonDisplay = this.debounce(() => {
    this.tabButtonDisplay();
  }, 50);

  //#endregion

  //#region Getters and Setters

  public set buttonType(value: TCh5TabButtonButtonType) {
    this._ch5Properties.set<TCh5TabButtonButtonType>("buttonType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonType(): TCh5TabButtonButtonType {
    return this._ch5Properties.get<TCh5TabButtonButtonType>("buttonType");
  }

  public set buttonHAlignLabel(value: TCh5TabButtonButtonHAlignLabel) {
    this._ch5Properties.set<TCh5TabButtonButtonHAlignLabel>("buttonHAlignLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonHAlignLabel(): TCh5TabButtonButtonHAlignLabel {
    return this._ch5Properties.get<TCh5TabButtonButtonHAlignLabel>("buttonHAlignLabel");
  }

  public set buttonVAlignLabel(value: TCh5TabButtonButtonVAlignLabel) {
    this._ch5Properties.set<TCh5TabButtonButtonVAlignLabel>("buttonVAlignLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonVAlignLabel(): TCh5TabButtonButtonVAlignLabel {
    return this._ch5Properties.get<TCh5TabButtonButtonVAlignLabel>("buttonVAlignLabel");
  }

  public set buttonIconPosition(value: TCh5TabButtonButtonIconPosition) {
    this._ch5Properties.set<TCh5TabButtonButtonIconPosition>("buttonIconPosition", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconPosition(): TCh5TabButtonButtonIconPosition {
    return this._ch5Properties.get<TCh5TabButtonButtonIconPosition>("buttonIconPosition");
  }

  public set buttonShape(value: TCh5TabButtonButtonShape) {
    this._ch5Properties.set<TCh5TabButtonButtonShape>("buttonShape", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonShape(): TCh5TabButtonButtonShape {
    return this._ch5Properties.get<TCh5TabButtonButtonShape>("buttonShape");
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

  public set numberOfItems(value: number) {
    this._ch5Properties.set<number>("numberOfItems", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get numberOfItems(): number {
    return this._ch5Properties.get<number>("numberOfItems");
  }

  public set orientation(value: TCh5TabButtonAttributesOrientation) {
    this._ch5Properties.set<TCh5TabButtonAttributesOrientation>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5TabButtonAttributesOrientation {
    return this._ch5Properties.get<TCh5TabButtonAttributesOrientation>("orientation");
  }

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value);
  }
  public get indexId(): string {
    return this._ch5Properties.get<string>("indexId");
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
      this.debounceButtonDisplay();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForShow");
  }

  public set useContractForCustomStyle(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForCustomStyle(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomStyle");
  }

  public set useContractForCustomClass(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForCustomClass(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomClass");
  }


  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5TabButton.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5TabButton.ELEMENT_NAME, Ch5TabButton);
    }
  }

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5TabButton.ELEMENT_NAME, Ch5TabButton.SIGNAL_ATTRIBUTE_TYPES);
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ['receivestateshowpulse', 'receivestatehidepulse', 'sendeventonshow'];
    this.logger.start('constructor()');
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5TabButton.COMPONENT_PROPERTIES);
    this.initCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5TabButton.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5TabButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5TabButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.nodeName);
    if (oldValue !== newValue) {
      this.logger.log('attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5TabButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

  public connectedCallback() {
    this.logger.start('connectedCallback()');
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5TabButton);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.debounceButtonDisplay();
    customElements.whenDefined(this.nodeName.toLowerCase()).then(() => {
      this.componentLoadedEvent(this.nodeName.toLowerCase(), this.id);
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
    for (let i: number = 0; i < Ch5TabButton.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5TabButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5TabButton.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5TabButton.COMPONENT_PROPERTIES[i].name;
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

  private initCssClass() {
    this.logger.start('UpdateCssClass');
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5TabButton.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this.logger.stop();
  }

  private checkInternalHTML() {
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add(this.nodeName.toLowerCase());
      this.appendChild(this._elContainer);
    }
  }

  private clearComponentContent() {
    const containers = this.getElementsByTagName("div");
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }

  private handleOrientation() {
    Array.from(Ch5TabButton.COMPONENT_DATA.ORIENTATION.values).forEach((orientation: any) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5TabButton.COMPONENT_DATA.ORIENTATION.classListPrefix + orientation);
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5TabButton.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
  }

  private tabButtonDisplay() {
    Array.from(this._elContainer.children).forEach(container => container.remove());
    // Contract Helper
    this.contractDefaultHelper();
    for (let i = 0; i < this.numberOfItems; i++) {
      this.createButton(i);
    }
    Array.from(this._elContainer.children).forEach(container => container.firstElementChild?.firstElementChild?.classList.add(this.primaryCssClass + '--center-tab-style'));
    this._elContainer.firstElementChild?.firstElementChild?.firstElementChild?.classList.replace(`${this.primaryCssClass + '--center-tab-style'}`, `${this.primaryCssClass + '--start-tab-style'}`);
    this._elContainer.lastElementChild?.firstElementChild?.firstElementChild?.classList.replace(`${this.primaryCssClass + '--center-tab-style'}`, `${this.primaryCssClass + '--end-tab-style'}`);
  }

  private contractDefaultHelper() {
    if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
      // useContractForEnable and receiveStateEnable
      if (this.useContractForEnable === true) {
        this.receiveStateEnable = this.contractName + '.Enable';
      }
      // useContractForShow and receiveStateShow
      if (this.useContractForShow === true) {
        this.receiveStateShow = this.contractName + '.Visible';
      }
      // useContractForCustomStyle and receiveStateCustomStyle
      if (this.useContractForCustomStyle === true) {
        this.receiveStateCustomStyle = this.contractName + '.CustomStyle';
      }
      // useContractForCustomClass and receiveStateCustomClass
      if (this.useContractForCustomClass === true) {
        this.receiveStateCustomClass = this.contractName + '.CustomClass';
      }
    }
  }

  private createButton(index: number, append: boolean = true) {
    if (index < 0 || index >= this.numberOfItems) { return };
    const buttonListContractObj: ICh5ButtonListContractObj = { index: index + 1, clickHoldTime: 0, contractName: this.contractName, parentComponent: 'ch5-tab-button' };
    const btn = this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined ? new Ch5Button(buttonListContractObj) : new Ch5Button();
    const btnContainer = document.createElement("div");
    btnContainer.setAttribute('id', this.getCrId() + '-' + index);
    if (this.hasAttribute('buttonReceiveStateShow') && this.getAttribute("buttonReceiveStateShow")?.trim() && !this.hasAttribute('receiveStateShow')) {
      const attrValue = this.replaceAll(this.getAttribute("buttonReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, '');
      const isNumber = /^[0-9]+$/.test(attrValue);
      if (isNumber) {
        btnContainer.setAttribute('data-ch5-show', Number(attrValue) + index + '');
      } else {
        btnContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("buttonReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
      }
      btnContainer.setAttribute('data-ch5-noshow-type', 'display');
    } else if (this.hasAttribute('receiveStateShow')) {
      btnContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("receiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
      btnContainer.setAttribute('data-ch5-noshow-type', 'display');
    }
    btnContainer.classList.add(this.nodeName.toLowerCase() + "--button-container");
    btnContainer.appendChild(btn);
    append ? this._elContainer.appendChild(btnContainer) : this._elContainer.prepend(btnContainer);
    // button attributes helper
    this.buttonLabelHelper(btn, index);
    this.buttonHelper(btn, index);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5TabButton.COMPONENT_DATA.BUTTON_TYPE.classListPrefix + this.buttonType);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5TabButton.COMPONENT_DATA.BUTTON_SHAPE.classListPrefix + this.buttonShape);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5TabButton.COMPONENT_DATA.BUTTON_ICON_POSITION.classListPrefix + this.buttonIconPosition);
  }

  private buttonLabelHelper(btn: Ch5Button, index: number) {
    const buttonListLabels = this.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
    if (buttonListLabels && buttonListLabels.length > 0) {
      Array.from(buttonListLabels).forEach((buttonListLabel) => {
        if (buttonListLabel.parentElement instanceof Ch5TabButton) {
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
    Ch5TabButton.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
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
        } else if (attr.name.toLowerCase() === 'buttonreceivestateselected') {
          if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
            btn.setAttribute('receiveStateSelected', this.contractName + `.Tab${index + 1}_Selected`);
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
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
        else if (attr.name.toLowerCase() === 'buttonsendeventonclick') {
          if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
            // Ignore this attribute since it is handled in ch5-button when contract name is available
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
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
        else if (attr.name.toLowerCase() === 'buttonreceivestateselected') {
          if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
            btn.setAttribute('receiveStateSelected', this.contractName + `.Tab${index + 1}_Selected`);
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
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
        else if (attr.name.toLowerCase() === 'buttonsendeventonclick') {
          if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
            // Ignore this attribute since it is handled in ch5-button when contract name is available
          } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
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
        } else if (attr.name.toLowerCase().includes('button') && this.hasAttribute(attr.name)) {
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
    Ch5TabButton.COMPONENT_COMMON_PROPERTIES.forEach((attr: string) => {
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

  private handleContractName() {
    if (this.contractName.trim().length === 0) {
      this.signalNameOnContract.contractName = "";
      this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
      this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
      this.receiveStateCustomStyle = this.signalNameOnContract.receiveStateCustomStyle;
      this.receiveStateCustomClass = this.signalNameOnContract.receiveStateCustomClass;
    } else if (this.signalNameOnContract.contractName === "") {
      this.signalNameOnContract.contractName = this.contractName;
      this.signalNameOnContract.receiveStateShow = this.receiveStateShow;
      this.signalNameOnContract.receiveStateEnable = this.receiveStateEnable;
      this.signalNameOnContract.receiveStateCustomStyle = this.receiveStateCustomStyle;
      this.signalNameOnContract.receiveStateCustomClass = this.receiveStateCustomClass;
    }
    this.debounceButtonDisplay();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }
  //#endregion

}

Ch5TabButton.registerCustomElement();
Ch5TabButton.registerSignalAttributeTypes();




import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "..";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5ColorChipAttributes } from './interfaces/i-ch5-color-chip-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import Ch5ColorUtils from '../ch5-common/utils/ch5-color-utils';

export class Ch5ColorChip extends Ch5Common implements ICh5ColorChipAttributes {

  //#region Variables

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
    receivestateredvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestategreenvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestatebluevalue: { direction: "state", numericJoin: 1, contractName: true },
    sendeventcolorredonchange: { direction: "event", numericJoin: 1, contractName: true },
    sendeventcolorgreenonchange: { direction: "event", numericJoin: 1, contractName: true },
    sendeventcolorblueonchange: { direction: "event", numericJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "rgb(0,0,0)",
      name: "previewColor",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "rgb(0,0,0)",
      isObservableProperty: true
    },
    {
      default: 255,
      name: "maxValue",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 255,
      numberProperties: {
        min: 50,
        max: 65535,
        conditionalMin: 50,
        conditionalMax: 65535,
        conditionalMinValue: 50,
        conditionalMaxValue: 65535
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnClick",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateRedValue",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateGreenValue",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateBlueValue",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventColorRedOnChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventColorGreenOnChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventColorBlueOnChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    }
  ];

  public static readonly ELEMENT_NAME = 'ch5-color-chip';

  public primaryCssClass = 'ch5-color-chip';
  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private redValue: number = 0;
  private greenValue: number = 0;
  private blueValue: number = 0;
  private _onClick: any = null;

  //#endregion

  //#region Getters and Setters

  public set previewColor(value: string) {
    this._ch5Properties.set<string>("previewColor", value, () => {
      this.handlePreviewColor();
    });
  }
  public get previewColor(): string {
    return this._ch5Properties.get<string>("previewColor");
  }

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value);
  }
  public get maxValue(): number {
    return this._ch5Properties.get<number>("maxValue");
  }

  public set sendEventOnClick(value: string) {
    this._ch5Properties.set("sendEventOnClick", value);
  }
  public get sendEventOnClick(): string {
    return this._ch5Properties.get<string>('sendEventOnClick');
  }

  public set receiveStateRedValue(value: string) {
    this._ch5Properties.set("receiveStateRedValue", value, null, (newValue: number) => {
      const colorValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
      if (newValue <= this.maxValue && this.redValue !== colorValue) {
        this.redValue = colorValue;
        this.handleSendSignals('red');
      }
    });
  }
  public get receiveStateRedValue(): string {
    return this._ch5Properties.get<string>('receiveStateRedValue');
  }

  public set receiveStateGreenValue(value: string) {
    this._ch5Properties.set("receiveStateGreenValue", value, null, (newValue: number) => {
      const colorValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
      if (newValue <= this.maxValue && this.greenValue !== colorValue) {
        this.greenValue = colorValue;
        this.handleSendSignals('green');
      }
    });
  }
  public get receiveStateGreenValue(): string {
    return this._ch5Properties.get<string>('receiveStateGreenValue');
  }

  public set receiveStateBlueValue(value: string) {
    this._ch5Properties.set("receiveStateBlueValue", value, null, (newValue: number) => {
      const colorValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
      if (newValue <= this.maxValue && this.blueValue !== colorValue) {
        this.blueValue = colorValue;
        this.handleSendSignals('blue');
      }
    });
  }
  public get receiveStateBlueValue(): string {
    return this._ch5Properties.get<string>('receiveStateBlueValue');
  }

  public set sendEventColorRedOnChange(value: string) {
    this._ch5Properties.set("sendEventColorRedOnChange", value);
  }
  public get sendEventColorRedOnChange(): string {
    return this._ch5Properties.get<string>('sendEventColorRedOnChange');
  }

  public set sendEventColorGreenOnChange(value: string) {
    this._ch5Properties.set("sendEventColorGreenOnChange", value);
  }
  public get sendEventColorGreenOnChange(): string {
    return this._ch5Properties.get<string>('sendEventColorGreenOnChange');
  }

  public set sendEventColorBlueOnChange(value: string) {
    this._ch5Properties.set("sendEventColorBlueOnChange", value);
  }
  public get sendEventColorBlueOnChange(): string {
    return this._ch5Properties.get<string>('sendEventColorBlueOnChange');
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ColorChip.ELEMENT_NAME, Ch5ColorChip.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ColorChip.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ColorChip.ELEMENT_NAME, Ch5ColorChip);
    }
  }

  //#endregion

  //#region Component LifeCycle

  public constructor() {
    super();
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "receivestatehidepulse", "receivestateshowpulse", "sendeventonshow", "customstyle"];
    this.logger.start('constructor()', Ch5ColorChip.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5ColorChip.COMPONENT_PROPERTIES);
    this._onClick = this.handleSendEventOnClick.bind(this);
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5ColorChip.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ColorChip.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5ColorChip.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-color-chip attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

      const attributeChangedProperty = Ch5ColorChip.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ColorChip component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5ColorChip.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ColorChip);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-color-chip').then(() => {
      this.componentLoadedEvent(Ch5ColorChip.ELEMENT_NAME, this.id);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', Ch5ColorChip.ELEMENT_NAME);
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this._elContainer = document.createElement('div');
    this._elContainer.classList.add('ch5-color-chip')
    this.appendChild(this._elContainer);
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();
    const thisRef: any = this;
    for (let i: number = 0; i < Ch5ColorChip.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ColorChip.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ColorChip.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ColorChip.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._elContainer.addEventListener('click', this._onClick);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elContainer.removeEventListener('click', this._onClick);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  private handlePreviewColor() {
    const color = Ch5ColorUtils.col2rgb(this.previewColor);
    if (color && !this.hasAttribute('receiveStateBlueValue') && !this.hasAttribute('receiveStateGreenValue') && !this.hasAttribute('receiveStateRedValue')) {
      this.redValue = Number(color[0]);
      this.greenValue = Number(color[1]);
      this.blueValue = Number(color[2]);
      this._elContainer.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }
    this.previewColor = `rgb(${this.redValue}, ${this.greenValue}, ${this.blueValue})`;
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  private handleSendSignals(color: string) {
    if (color === 'red' && this.sendEventColorRedOnChange !== '') {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorRedOnChange)?.publish(Ch5ColorUtils.getAnalogValue(this.redValue, this.maxValue));
    } else if (color === 'green' && this.sendEventColorGreenOnChange !== '') {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorGreenOnChange)?.publish(Ch5ColorUtils.getAnalogValue(this.greenValue, this.maxValue));
    } else if (color === 'blue' && this.sendEventColorBlueOnChange !== '') {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorBlueOnChange)?.publish(Ch5ColorUtils.getAnalogValue(this.blueValue, this.maxValue));
    }
    this._elContainer.style.backgroundColor = `rgb(${this.redValue}, ${this.greenValue}, ${this.blueValue})`;
    // this.setAttribute('previewcolor', `rgb(${this.redValue}, ${this.greenValue}, ${this.blueValue})`);
  }

  private handleSendEventOnClick(): void {
    if (this.sendEventOnClick) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(false);
    }
  }

  //#endregion

}

Ch5ColorChip.registerCustomElement();
Ch5ColorChip.registerSignalAttributeTypes();

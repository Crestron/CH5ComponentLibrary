import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping, Ch5Signal, Ch5SignalFactory } from "..";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5ColorPickerAttributes } from './interfaces/i-ch5-color-picker-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import Ch5ColorUtils from "../ch5-common/utils/ch5-color-utils";

export class Ch5ColorPicker extends Ch5Common implements ICh5ColorPickerAttributes {

  //#region Variables

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestateredvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestategreenvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestatebluevalue: { direction: "state", numericJoin: 1, contractName: true },
    sendredonchange: { direction: "event", numericJoin: 1, contractName: true },
    sendgreenonchange: { direction: "event", numericJoin: 1, contractName: true },
    sendblueonchange: { direction: "event", numericJoin: 1, contractName: true },

  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: 255,
      name: "maxValue",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 255,
      numberProperties: {
        min: 255,
        max: 65535,
        conditionalMin: 255,
        conditionalMax: 65535,
        conditionalMinValue: 255,
        conditionalMaxValue: 65535
      },
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
      name: "sendRedOnChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendGreenOnChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "sendBlueOnChange",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-color-picker';

  public cssClassPrefix = 'ch5-color-picker';
  public primaryCssClass = 'ch5-color-picker';
  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private redValue: number = 0;
  private greenValue: number = 0;
  private blueValue: number = 0;

  //#endregion

  //#region Getters and Setters

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value);
  }
  public get maxValue(): number {
    return this._ch5Properties.get<number>("maxValue");
  }

  public set receiveStateRedValue(value: string) {
    this._ch5Properties.set("receiveStateRedValue", value, (newValue: number) => {
      if (newValue <= this.maxValue && this.redValue !== Ch5ColorUtils.getDigitalValue(newValue, this.maxValue)) {
        this.redValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.handleSendSignals('red');
      }
    });
  }
  public get receiveStateRedValue(): string {
    return this._ch5Properties.get<string>('receiveStateRedValue');
  }

  public set receiveStateGreenValue(value: string) {
    this._ch5Properties.set("receiveStateGreenValue", value, null, (newValue: number) => {
      if (newValue <= this.maxValue && this.greenValue !== Ch5ColorUtils.getDigitalValue(newValue, this.maxValue)) {
        this.greenValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.handleSendSignals('green');
      }
    });
  }
  public get receiveStateGreenValue(): string {
    return this._ch5Properties.get<string>('receiveStateGreenValue');
  }

  public set receiveStateBlueValue(value: string) {
    this._ch5Properties.set("receiveStateBlueValue", value, null, (newValue: number) => {
      if (newValue <= this.maxValue && this.blueValue !== Ch5ColorUtils.getDigitalValue(newValue, this.maxValue)) {
        this.blueValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.handleSendSignals('blue');
      }
    });
  }
  public get receiveStateBlueValue(): string {
    return this._ch5Properties.get<string>('receiveStateBlueValue');
  }

  public set sendRedOnChange(value: string) {
    this._ch5Properties.set("sendRedOnChange", value);
  }
  public get sendRedOnChange(): string {
    return this._ch5Properties.get<string>('sendRedOnChange');
  }

  public set sendGreenOnChange(value: string) {
    this._ch5Properties.set("sendGreenOnChange", value);
  }
  public get sendGreenOnChange(): string {
    return this._ch5Properties.get<string>('sendGreenOnChange');
  }

  public set sendBlueOnChange(value: string) {
    this._ch5Properties.set("sendBlueOnChange", value);
  }
  public get sendBlueOnChange(): string {
    return this._ch5Properties.get<string>('sendBlueOnChange');
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ColorPicker.ELEMENT_NAME, Ch5ColorPicker.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5ColorPicker.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ColorPicker.ELEMENT_NAME, Ch5ColorPicker);
    }
  }

  //#endregion

  //#region Component LifeCycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5ColorPicker.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5ColorPicker.COMPONENT_PROPERTIES);

  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5ColorPicker.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ColorPicker.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5ColorPicker.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-color-picker attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ColorPicker.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
      if (attributeChangedProperty) {
        const thisRef: any = this;
        const key = attributeChangedProperty.name;
        thisRef[key] = newValue;
      } else {
        super.attributeChangedCallback(attr, oldValue, newValue);
      }
      this.updateCssClass();
    }
    this.logger.stop();
  }

  /**
   * Called when the Ch5ColorPicker component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5ColorPicker.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ColorPicker);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-color-picker')
      this.appendChild(this._elContainer);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    customElements.whenDefined('ch5-color-picker').then(() => {
      this.componentLoadedEvent(Ch5ColorPicker.ELEMENT_NAME, this.id);
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
    for (let i: number = 0; i < Ch5ColorPicker.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ColorPicker.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ColorPicker.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ColorPicker.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
    this.updateCssClass();
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

  /**
   * Clear the content of component in order to avoid duplication of elements
   */
  private clearComponentContent() {
    const containers = this.getElementsByTagName("div");
    Array.from(containers).forEach((container) => {
      container.remove();
    });
  }


  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this.logger.stop();
  }
  public getCssClassDisabled() {
    return this.cssClassPrefix + '--disabled';
  }

  //#endregion
  private handleSendSignals(color: string) {
    if (color === 'red' && this.sendRedOnChange) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendRedOnChange)?.publish(this.redValue);
    } else if (color === 'green' && this.sendGreenOnChange) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendGreenOnChange)?.publish(this.greenValue);
    } else if (color === 'blue' && this.sendBlueOnChange) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendBlueOnChange)?.publish(this.blueValue);
    }
    // add the code for div to respond on new color
  }
}

Ch5ColorPicker.registerCustomElement();
Ch5ColorPicker.registerSignalAttributeTypes();

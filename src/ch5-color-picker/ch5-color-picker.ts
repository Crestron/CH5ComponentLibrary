import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5ColorPickerAttributes } from './interfaces/i-ch5-color-picker-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import Ch5ColorUtils from "../ch5-common/utils/ch5-color-utils";
import { ColorPicker } from "./color-picker";
import { Subscription } from "rxjs";

export class Ch5ColorPicker extends Ch5Common implements ICh5ColorPickerAttributes {

  //#region Variables

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestateredvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestategreenvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestatebluevalue: { direction: "state", numericJoin: 1, contractName: true },
    sendeventcolorredonchange: { direction: "event", numericJoin: 1, contractName: true },
    sendeventcolorgreenonchange: { direction: "event", numericJoin: 1, contractName: true },
    sendeventcolorblueonchange: { direction: "event", numericJoin: 1, contractName: true }
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
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
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-color-picker';

  public cssClassPrefix = 'ch5-color-picker';
  public primaryCssClass = 'ch5-color-picker';
  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _elColorPicker: HTMLElement = {} as HTMLElement;
  private redValue: number = 0;
  private greenValue: number = 0;
  private blueValue: number = 0;
  private redValuePrevious: number = 0;
  private greenValuePrevious: number = 0;
  private blueValuePrevious: number = 0;
  private pickerId: string = "";
  private colorPicker: ColorPicker | null = null;
  private _colorChangedSubscription: Subscription | null = null;
  private readonly COLOR_BLACK = "#000000";
  private _dirty: boolean = false;
  private isSendReceiveSignalEqual: boolean = false;
  private sendingValue: boolean = false;
  private receiveingValue: boolean = false;
  // Initial value or last value received from signal
  private _cleanValue: string = this.COLOR_BLACK;

  private debounceSendSignals = this.debounce(() => {
    this.handleSendSignals();
    this.debounceSetColor();
  }, 100);

  private debounceSetColor = this.debounce(() => {
    if (this.colorPicker && !((this.sendingValue && this.receiveingValue && this.isSendReceiveSignalEqual) || this.sendingValue)) {
      if (this.colorPicker.picker.get().css() !== Ch5ColorUtils.hexToRgb(this._cleanValue)) {
        this.colorPicker.setColor(this._cleanValue);
      }
    }
    this.receiveingValue = false;
  }, 1500);
  //#endregion

  //#region Getters and Setters

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value);
  }
  public get maxValue(): number {
    return this._ch5Properties.get<number>("maxValue");
  }

  public set receiveStateRedValue(value: string) {
    this._ch5Properties.set("receiveStateRedValue", value, null, (newValue: number) => {
      if (newValue <= this.maxValue) {
        this.redValuePrevious = this.redValue;
        this.redValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.setColor();
      }
    });
  }
  public get receiveStateRedValue(): string {
    return this._ch5Properties.get<string>('receiveStateRedValue');
  }

  public set receiveStateGreenValue(value: string) {
    this._ch5Properties.set("receiveStateGreenValue", value, null, (newValue: number) => {
      if (newValue <= this.maxValue) {
        this.greenValuePrevious = this.greenValue;
        this.greenValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.setColor();
      }
    });
  }
  public get receiveStateGreenValue(): string {
    return this._ch5Properties.get<string>('receiveStateGreenValue');
  }

  public set receiveStateBlueValue(value: string) {
    this._ch5Properties.set("receiveStateBlueValue", value, null, (newValue: number) => {
      if (newValue <= this.maxValue) {
        this.blueValuePrevious = this.blueValue;
        this.blueValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.setColor();
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
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "receivestatehidepulse", "receivestateshowpulse", "sendeventonshow"];
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
    this._elContainer.classList.add('ch5-color-picker');

    if (this._elContainer.parentElement !== this) {
      this._elColorPicker = document.createElement('div');
      this.pickerId = this.getCrId();
      this._elColorPicker.setAttribute("id", this.pickerId);
      this._elContainer.appendChild(this._elColorPicker);
      this.appendChild(this._elContainer);
    }
    this.colorPicker = new ColorPicker(this.pickerId, this._cleanValue);
    this._colorChangedSubscription = this.colorPicker.colorChanged.subscribe((value: number[]) => {
      if (value.length > 0 && this.colorPicker) {
        if (this.redValuePrevious !== value[0] || this.greenValuePrevious !== value[1] || this.blueValuePrevious !== value[2]) {
          this.redValue = value[0];
          this.greenValue = value[1];
          this.blueValue = value[2];
          this.debounceSendSignals();
          this._dirty = true;
          if (this.isSendReceiveSignalEqual) {
            this._cleanValue = Ch5ColorUtils.rgbToHex(this.redValue, this.greenValue, this.blueValue);;
          }
        }
      }
    });
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-color-picker').then(() => {
      this.componentLoadedEvent(Ch5ColorPicker.ELEMENT_NAME, this.id);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', Ch5ColorPicker.ELEMENT_NAME);
    this._elColorPicker.replaceChildren(); // Remove all content
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    if (this._colorChangedSubscription !== null) {
      this._colorChangedSubscription.unsubscribe();
      this._colorChangedSubscription = null;
    }
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  private setColor() {
    this.receiveingValue = true;
    if (this.redValuePrevious === this.redValue && this.greenValuePrevious === this.greenValue && this.blueValuePrevious === this.blueValue && this._dirty === true) {
      this.isSendReceiveSignalEqual = true;
    }
    const color: string = Ch5ColorUtils.rgbToHex(this.redValue, this.greenValue, this.blueValue);
    this._cleanValue = color;
    if (this.colorPicker) {
      if ((this.colorPicker.picker.get().css() !== Ch5ColorUtils.hexToRgb(color))) {
        this.debounceSetColor();
      }
    }
  }

  protected createInternalHtml() {
    this.logger.start('createInternalHtml');
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

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.cssClassPrefix + '--disabled';
  }

  private handleSendSignals() {
    if (this.colorPicker) {
      const colorValue = Ch5ColorUtils.rgbFormat(this.colorPicker.picker.get().css());
      this.redValue = Number(colorValue[0]);
      this.greenValue = Number(colorValue[1]);
      this.blueValue = Number(colorValue[2]);
    }
    if (this.sendEventColorRedOnChange !== "" && this.redValue !== this.redValuePrevious) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorRedOnChange)?.publish(Ch5ColorUtils.getAnalogValue(this.redValue, this.maxValue));
      this.sendingValue = true;
    }
    if (this.sendEventColorGreenOnChange !== "" && this.greenValue !== this.greenValuePrevious) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorGreenOnChange)?.publish(Ch5ColorUtils.getAnalogValue(this.greenValue, this.maxValue));
      this.sendingValue = true;
    }
    if (this.sendEventColorBlueOnChange !== "" && this.blueValue !== this.blueValuePrevious) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorBlueOnChange)?.publish(Ch5ColorUtils.getAnalogValue(this.blueValue, this.maxValue));
      this.sendingValue = true;
    }
    if (!this.receiveingValue)
      this.sendingValue = false;
  }

  //#endregion

}

Ch5ColorPicker.registerCustomElement();
Ch5ColorPicker.registerSignalAttributeTypes();

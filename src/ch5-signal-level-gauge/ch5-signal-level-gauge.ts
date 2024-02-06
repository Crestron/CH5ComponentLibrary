import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SignalLevelGaugeOrientation, TCh5SignalLevelGaugeSize, } from './interfaces/t-ch5-signal-level-gauge';
import { ICh5SignalLevelGaugeAttributes } from './interfaces/i-ch5-signal-level-gauge-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core';

export class Ch5SignalLevelGauge extends Ch5Common implements ICh5SignalLevelGaugeAttributes {

  //#region Variables

  public static readonly ORIENTATION: TCh5SignalLevelGaugeOrientation[] = ['horizontal', 'vertical'];
  public static readonly SIZE: TCh5SignalLevelGaugeSize[] = ['regular', 'small', 'large', 'x-large'];

  public static readonly COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5SignalLevelGauge.ORIENTATION[0],
      values: Ch5SignalLevelGauge.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
    },
    SIZE: {
      default: Ch5SignalLevelGauge.SIZE[0],
      values: Ch5SignalLevelGauge.SIZE,
      key: 'size',
      attribute: 'size',
      classListPrefix: '--size-'
    }
  };

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5SignalLevelGauge.ORIENTATION[0],
      enumeratedValues: Ch5SignalLevelGauge.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SignalLevelGauge.ORIENTATION[0],
      isObservableProperty: true
    },
    {
      default: 0,
      name: "value",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateValue",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 65535,
        conditionalMin: 0,
        conditionalMax: 65535,
        conditionalMinValue: 0,
        conditionalMaxValue: 65535
      },
      isObservableProperty: true
    },
    {
      default: 0,
      name: "minValue",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 0,
      numberProperties: {
        min: 0,
        max: 65534,
        conditionalMin: 0,
        conditionalMax: 65534,
        conditionalMinValue: 0,
        conditionalMaxValue: 65534
      },
      isObservableProperty: true
    },
    {
      default: 65535,
      name: "maxValue",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 65535,
      numberProperties: {
        min: 1,
        max: 65535,
        conditionalMin: 1,
        conditionalMax: 65535,
        conditionalMinValue: 1,
        conditionalMaxValue: 65535
      },
      isObservableProperty: true
    },
    {
      default: 6,
      name: "numberOfBars",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 6,
      numberProperties: {
        min: 1,
        max: 15,
        conditionalMin: 1,
        conditionalMax: 15,
        conditionalMinValue: 1,
        conditionalMaxValue: 15
      },
      isObservableProperty: true
    },
    {
      default: 1,
      name: "signalBarSpacing",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
      numberProperties: {
        min: 0,
        max: 6,
        conditionalMin: 0,
        conditionalMax: 6,
        conditionalMinValue: 0,
        conditionalMaxValue: 6
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateValue",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: Ch5SignalLevelGauge.SIZE[0],
      enumeratedValues: Ch5SignalLevelGauge.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SignalLevelGauge.SIZE[0],
      isObservableProperty: true
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-signal-level-gauge';

  public primaryCssClass = 'ch5-signal-level-gauge';
  private _resizeObserver: ResizeObserver | null = null;

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;

  //#endregion

  //#region Getters and Setters

  public set orientation(value: TCh5SignalLevelGaugeOrientation) {
    this._ch5Properties.set<TCh5SignalLevelGaugeOrientation>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5SignalLevelGaugeOrientation {
    return this._ch5Properties.get<TCh5SignalLevelGaugeOrientation>("orientation");
  }

  public set minValue(value: number) {
    this._ch5Properties.set<number>("minValue", value, () => {
      if (value >= this.maxValue) {
        this.minValue = 0;
      }
      this.handleValue();
    });
  }
  public get minValue(): number {
    return this._ch5Properties.get<number>("minValue");
  }

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value, () => {
      if (value <= this.minValue) {
        this.maxValue = 65535;
      }
      this.handleValue();
    });
  }
  public get maxValue(): number {
    return this._ch5Properties.get<number>("maxValue");
  }

  public set numberOfBars(value: number) {
    this._ch5Properties.set<number>("numberOfBars", value, () => {
      this.handleNumberOfBars();
    });
  }
  public get numberOfBars(): number {
    return this._ch5Properties.get<number>("numberOfBars");
  }

  public set signalBarSpacing(value: number) {
    this._ch5Properties.set<number>("signalBarSpacing", value, () => {
      this._elContainer.style.gap = this.signalBarSpacing + 'px';
    });
  }
  public get signalBarSpacing(): number {
    return this._ch5Properties.get<number>("signalBarSpacing");
  }

  public set value(value: number) {
    this._ch5Properties.set<number>("value", value, () => {
      if (value < this.minValue) {
        this.value = this.minValue;
      } else if (value > this.maxValue) {
        this.value = this.maxValue;
      }
      this.handleValue();
    });
  }
  public get value(): number {
    return this._ch5Properties.get<number>("value");
  }

  public set receiveStateValue(value: string) {
    this._ch5Properties.set("receiveStateValue", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("value", newValue, () => {
        this.handleValue();
      });
    });
  }
  public get receiveStateValue(): string {
    return this._ch5Properties.get<string>('receiveStateValue');
  }

  public set size(value: TCh5SignalLevelGaugeSize) {
    this._ch5Properties.set<TCh5SignalLevelGaugeSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5SignalLevelGaugeSize {
    return this._ch5Properties.get<TCh5SignalLevelGaugeSize>("size");
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5SignalLevelGauge.ELEMENT_NAME, Ch5SignalLevelGauge.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5SignalLevelGauge.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5SignalLevelGauge.ELEMENT_NAME, Ch5SignalLevelGauge);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "receivestatehidepulse", "receivestateshowpulse", "sendeventonshow"]
    this.logger.start('constructor()', Ch5SignalLevelGauge.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._resizeObserverCallBack = this._resizeObserverCallBack.bind(this);
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5SignalLevelGauge.COMPONENT_PROPERTIES);
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5SignalLevelGauge.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5SignalLevelGauge.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5SignalLevelGauge.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-signal-level-gauge attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5SignalLevelGauge.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5SignalLevelGauge component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5SignalLevelGauge.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5SignalLevelGauge);
    }

    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.handleNumberOfBars();
    this._elContainer.style.gap = this.signalBarSpacing + 'px';
    customElements.whenDefined('ch5-signal-level-gauge').then(() => {
      this.componentLoadedEvent(Ch5SignalLevelGauge.ELEMENT_NAME, this.id);
    });
    // needed for preload-true for the calculation of bars height and width depending upon parent
    subscribeInViewPortChange(this, () => {
      if (this.elementIsInViewPort) {
        this.handleNumberOfBars();
      }
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
    this._elContainer = document.createElement('div');
    this._elContainer.classList.add('ch5-signal-level-gauge');
    this.appendChild(this._elContainer);
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();
    const thisRef: any = this;
    for (let i: number = 0; i < Ch5SignalLevelGauge.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5SignalLevelGauge.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5SignalLevelGauge.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5SignalLevelGauge.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
    this.updateCssClass();
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._resizeObserver = new ResizeObserver(this._resizeObserverCallBack);
    this._resizeObserver.observe(this._elContainer)
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._resizeObserver?.unobserve(this._elContainer);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  private _resizeObserverCallBack() {
    console.log('inside CallBack');
    this.handleNumberOfBars();
  }

  private handleOrientation() {
    Array.from(Ch5SignalLevelGauge.COMPONENT_DATA.ORIENTATION.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5SignalLevelGauge.ELEMENT_NAME + Ch5SignalLevelGauge.COMPONENT_DATA.ORIENTATION.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5SignalLevelGauge.ELEMENT_NAME + Ch5SignalLevelGauge.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this.handleNumberOfBars();
  }

  private handleValue() {
    this._elContainer.querySelectorAll('.ch5-signal-level-gauge--selected-bar-color').forEach((ele) => ele.classList.remove('ch5-signal-level-gauge--selected-bar-color'));
    const currBar = Math.floor(((this.value - this.minValue) * this.numberOfBars) / (this.maxValue - this.minValue));
    Array.from(this._elContainer.children).forEach((ele, i) => {
      if (i < currBar && i < this.numberOfBars) {
        ele.classList.add(this.primaryCssClass + '--selected-bar-color');
        ele.classList.remove(this.primaryCssClass + '--bar-color');
      } else {
        ele.classList.remove(this.primaryCssClass + '--selected-bar-color');
        ele.classList.add(this.primaryCssClass + '--bar-color');
      }
    });
  }

  private handleNumberOfBars() {
    Array.from(this._elContainer.children).forEach((ele) => ele.remove());
    const heightBar = this._elContainer.offsetHeight / this.numberOfBars;
    const widthBar = this._elContainer.offsetWidth / this.numberOfBars;
    for (let i = 1; i <= this.numberOfBars; i++) {
      const bar = document.createElement("div");
      bar.classList.add('ch5-signal-level-gauge--bar-color');
      bar.style.height = this.orientation === 'horizontal' ? (heightBar * i) + 'px' : heightBar + 'px';
      bar.style.width = this.orientation === 'horizontal' ? widthBar + 'px' : (widthBar * i) + 'px';
      this._elContainer.appendChild(bar);
    }
    this.handleValue();
  }

  private handleSize() {
    Array.from(Ch5SignalLevelGauge.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5SignalLevelGauge.ELEMENT_NAME + Ch5SignalLevelGauge.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5SignalLevelGauge.ELEMENT_NAME + Ch5SignalLevelGauge.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this.handleNumberOfBars();
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._elContainer.classList.add(Ch5SignalLevelGauge.ELEMENT_NAME + Ch5SignalLevelGauge.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this._elContainer.classList.add(Ch5SignalLevelGauge.ELEMENT_NAME + Ch5SignalLevelGauge.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this._elContainer.style.gap = this.signalBarSpacing + 'px';
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  //#endregion

}

Ch5SignalLevelGauge.registerCustomElement();
Ch5SignalLevelGauge.registerSignalAttributeTypes();

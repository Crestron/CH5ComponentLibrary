import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5WifiSignalLevelGaugeGaugeStyle, TCh5WifiSignalLevelGaugeAlignment, TCh5WifiSignalLevelGaugeSize, } from './interfaces/t-ch5-wifi-signal-level-gauge';
import { ICh5WifiSignalLevelGaugeAttributes } from './interfaces/i-ch5-wifi-signal-level-gauge-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";

export class Ch5WifiSignalLevelGauge extends Ch5Common implements ICh5WifiSignalLevelGaugeAttributes {

  //#region Variables

  public static readonly NUMBER_OF_BARS_MIN: number = 0;
  public static readonly NUMBER_OF_BARS_MAX: number = 3;
  public static readonly GAUGE_STYLE: TCh5WifiSignalLevelGaugeGaugeStyle[] = ['light', 'accents', 'dark'];
  public static readonly ALIGNMENT: TCh5WifiSignalLevelGaugeAlignment[] = ['up', 'down', 'left', 'right'];
  public static readonly SIZE: TCh5WifiSignalLevelGaugeSize[] = ['regular', 'small', 'large', 'x-large'];
  public static readonly COMPONENT_DATA: any = {
    GAUGE_STYLE: {
      default: Ch5WifiSignalLevelGauge.GAUGE_STYLE[0],
      values: Ch5WifiSignalLevelGauge.GAUGE_STYLE,
      key: 'gaugeStyle',
      attribute: 'gaugeStyle',
      classListPrefix: 'ch5-wifi-signal-level-gauge--gauge-style-'
    },
    ALIGNMENT: {
      default: Ch5WifiSignalLevelGauge.ALIGNMENT[0],
      values: Ch5WifiSignalLevelGauge.ALIGNMENT,
      key: 'alignment',
      attribute: 'alignment',
      classListPrefix: 'ch5-wifi-signal-level-gauge--alignment-'
    },
    SIZE: {
      default: Ch5WifiSignalLevelGauge.SIZE[0],
      values: Ch5WifiSignalLevelGauge.SIZE,
      key: 'size',
      attribute: 'size',
      classListPrefix: 'ch5-wifi-signal-level-gauge--size-'
    }
  };

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatevalue: { direction: "state", numericJoin: 1, contractName: true }
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
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
      default: Ch5WifiSignalLevelGauge.GAUGE_STYLE[0],
      enumeratedValues: Ch5WifiSignalLevelGauge.GAUGE_STYLE,
      name: "gaugeStyle",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5WifiSignalLevelGauge.GAUGE_STYLE[0],
      isObservableProperty: true
    },
    {
      default: Ch5WifiSignalLevelGauge.ALIGNMENT[0],
      enumeratedValues: Ch5WifiSignalLevelGauge.ALIGNMENT,
      name: "alignment",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5WifiSignalLevelGauge.ALIGNMENT[0],
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
      default: 100,
      name: "maxValue",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 100,
        conditionalMin: 1,
        conditionalMax: 100,
        conditionalMinValue: 1,
        conditionalMaxValue: 100
      },
      isObservableProperty: true
    },
    {
      default: Ch5WifiSignalLevelGauge.SIZE[0],
      enumeratedValues: Ch5WifiSignalLevelGauge.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5WifiSignalLevelGauge.SIZE[0],
      isObservableProperty: true
    }
  ];

  public static readonly ELEMENT_NAME = 'ch5-wifi-signal-level-gauge';

  public cssClassPrefix = 'ch5-wifi-signal-level-gauge';
  public primaryCssClass = 'ch5-wifi-signal-level-gauge';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _elInnerContainer: HTMLElement = {} as HTMLElement;
  private value: number = 0;

  //#endregion

  //#region Getters and Setters

  public set receiveStateValue(value: string) {
    this._ch5Properties.set("receiveStateValue", value, null, (newValue: number) => {
      this.value = newValue < this.minValue ? this.minValue : newValue > this.maxValue ? this.maxValue : newValue;
      this.handleValue();
    });
  }
  public get receiveStateValue(): string {
    return this._ch5Properties.get<string>('receiveStateValue');
  }

  public set gaugeStyle(value: TCh5WifiSignalLevelGaugeGaugeStyle) {
    this._ch5Properties.set<TCh5WifiSignalLevelGaugeGaugeStyle>("gaugeStyle", value, () => {
      this.handleGaugeStyle();
    });
  }
  public get gaugeStyle(): TCh5WifiSignalLevelGaugeGaugeStyle {
    return this._ch5Properties.get<TCh5WifiSignalLevelGaugeGaugeStyle>("gaugeStyle");
  }

  public set alignment(value: TCh5WifiSignalLevelGaugeAlignment) {
    this._ch5Properties.set<TCh5WifiSignalLevelGaugeAlignment>("alignment", value, () => {
      this.handleAlignment();
    });
  }
  public get alignment(): TCh5WifiSignalLevelGaugeAlignment {
    return this._ch5Properties.get<TCh5WifiSignalLevelGaugeAlignment>("alignment");
  }

  public set minValue(value: number) {
    this._ch5Properties.set<number>("minValue", value, () => {
      if (this.minValue >= this.maxValue) {
        this.minValue = 0;
      }
      this.handleValue();
    });
  }
  public get minValue(): number {
    return +this._ch5Properties.get<number>("minValue");
  }

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value, () => {
      if (this.maxValue <= this.minValue) {
        this.maxValue = 100;
      }
      this.handleValue();
    });
  }
  public get maxValue(): number {
    return +this._ch5Properties.get<number>("maxValue");
  }

  public set size(value: TCh5WifiSignalLevelGaugeSize) {
    this._ch5Properties.set<TCh5WifiSignalLevelGaugeSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5WifiSignalLevelGaugeSize {
    return this._ch5Properties.get<TCh5WifiSignalLevelGaugeSize>("size");
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5WifiSignalLevelGauge.ELEMENT_NAME, Ch5WifiSignalLevelGauge.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5WifiSignalLevelGauge.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5WifiSignalLevelGauge.ELEMENT_NAME, Ch5WifiSignalLevelGauge);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "receivestatehidepulse", "receivestateshowpulse", "sendeventonshow"]
    this.logger.start('constructor()', Ch5WifiSignalLevelGauge.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES);
    this.initCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-wifi-signal-level-gauge attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5WifiSignalLevelGauge component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5WifiSignalLevelGauge.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5WifiSignalLevelGauge);
    }
    if (this._elContainer.parentElement !== this) {
      this.appendChild(this._elContainer);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.handleValue();
    customElements.whenDefined('ch5-wifi-signal-level-gauge').then(() => {
      this.componentLoadedEvent(Ch5WifiSignalLevelGauge.ELEMENT_NAME, this.id);
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
    this._elInnerContainer = document.createElement('div');
    this._elContainer.classList.add("ch5-wifi-signal-level-gauge");
    this._elInnerContainer.classList.add("ch5-wifi-signal-level-gauge--inner-container");
    this._elContainer.appendChild(this._elInnerContainer);
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5WifiSignalLevelGauge.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
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

  private handleGaugeStyle() {
    Array.from(Ch5WifiSignalLevelGauge.COMPONENT_DATA.GAUGE_STYLE.values).forEach((gaugeStyle: any) => {
      this._elContainer.classList.remove(Ch5WifiSignalLevelGauge.COMPONENT_DATA.GAUGE_STYLE.classListPrefix + gaugeStyle);
    });
    this._elContainer.classList.add(Ch5WifiSignalLevelGauge.COMPONENT_DATA.GAUGE_STYLE.classListPrefix + this.gaugeStyle);
  }
  private handleAlignment() {
    Array.from(Ch5WifiSignalLevelGauge.COMPONENT_DATA.ALIGNMENT.values).forEach((alignment: any) => {
      this._elContainer.classList.remove(Ch5WifiSignalLevelGauge.COMPONENT_DATA.ALIGNMENT.classListPrefix + alignment);
    });
    this._elContainer.classList.add(Ch5WifiSignalLevelGauge.COMPONENT_DATA.ALIGNMENT.classListPrefix + this.alignment);
  }

  private handleValue() {
    for (let i: number = 0; i <= Ch5WifiSignalLevelGauge.NUMBER_OF_BARS_MAX; i++) {
      this._elInnerContainer.classList.remove("ch5-wifi-bars-selected-" + i.toString());
    };
    let currBar = Math.floor(((this.value - this.minValue) * Ch5WifiSignalLevelGauge.NUMBER_OF_BARS_MAX) / (this.maxValue - this.minValue));
    if (currBar > Ch5WifiSignalLevelGauge.NUMBER_OF_BARS_MAX) {
      currBar = Ch5WifiSignalLevelGauge.NUMBER_OF_BARS_MAX;
    } else if (currBar < Ch5WifiSignalLevelGauge.NUMBER_OF_BARS_MIN) {
      currBar = Ch5WifiSignalLevelGauge.NUMBER_OF_BARS_MIN;
    }
    this._elInnerContainer.classList.add("ch5-wifi-bars-selected-" + currBar.toString());
  }

  private handleSize() {
    Array.from(Ch5WifiSignalLevelGauge.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5WifiSignalLevelGauge.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5WifiSignalLevelGauge.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }

  private initCssClass() {
    this.logger.start('initCssClass');

    this._elContainer.classList.add(Ch5WifiSignalLevelGauge.COMPONENT_DATA.GAUGE_STYLE.classListPrefix + this.gaugeStyle);

    this._elContainer.classList.add(Ch5WifiSignalLevelGauge.COMPONENT_DATA.ALIGNMENT.classListPrefix + this.alignment);

    this._elContainer.classList.add(Ch5WifiSignalLevelGauge.COMPONENT_DATA.SIZE.classListPrefix + this.size);

    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.cssClassPrefix + '--disabled';
  }

  //#endregion

}

Ch5WifiSignalLevelGauge.registerCustomElement();
Ch5WifiSignalLevelGauge.registerSignalAttributeTypes();

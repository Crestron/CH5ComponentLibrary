import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SegmentedGaugeOrientation, TCh5SegmentedGaugeGaugeLedStyle, TCh5SegmentedGaugeStateGraphic } from './interfaces/t-ch5-segmented-gauge';
import { ICh5SegmentedGaugeAttributes } from './interfaces/i-ch5-segmented-gauge-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5SegmentedGauge extends Ch5Common implements ICh5SegmentedGaugeAttributes {

  //#region Variables

  public static readonly ORIENTATION: TCh5SegmentedGaugeOrientation[] = ['horizontal', 'vertical'];
  public static readonly GAUGE_LED_STYLE: TCh5SegmentedGaugeGaugeLedStyle[] = ['rectangle', 'circle'];
  public static readonly STATE_GRAPHIC: TCh5SegmentedGaugeStateGraphic[] = ['green', 'yellow', 'red', 'blue', 'orange', 'white', 'inactive'];
  public static readonly COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5SegmentedGauge.ORIENTATION[0],
      values: Ch5SegmentedGauge.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: 'ch5-segmented-gauge--orientation-'
    },
    GAUGE_LED_STYLE: {
      default: Ch5SegmentedGauge.GAUGE_LED_STYLE[0],
      values: Ch5SegmentedGauge.GAUGE_LED_STYLE,
      key: 'gaugeLedStyle',
      attribute: 'gaugeLedStyle',
      classListPrefix: 'ch5-segmented-gauge--gauge-led-style-'
    },
    PRIMARY_STATE_GRAPHIC: {
      default: Ch5SegmentedGauge.STATE_GRAPHIC[0],
      values: Ch5SegmentedGauge.STATE_GRAPHIC,
      key: 'primaryStateGraphic',
      attribute: 'primaryStateGraphic',
      classListPrefix: 'ch5-segmented-gauge--segment-state-graphic-'
    },
    SECONDARY_STATE_GRAPHIC: {
      default: Ch5SegmentedGauge.STATE_GRAPHIC[1],
      values: Ch5SegmentedGauge.STATE_GRAPHIC,
      key: 'secondaryStateGraphic',
      attribute: 'secondaryStateGraphic',
      classListPrefix: 'ch5-segmented-gauge--segment-state-graphic-'
    },
    TERTIARY_STATE_GRAPHIC: {
      default: Ch5SegmentedGauge.STATE_GRAPHIC[2],
      values: Ch5SegmentedGauge.STATE_GRAPHIC,
      key: 'tertiaryStateGraphic',
      attribute: 'tertiaryStateGraphic',
      classListPrefix: 'ch5-segmented-gauge--segment-state-graphic-'
    }
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    sendeventonclick: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5SegmentedGauge.ORIENTATION[0],
      enumeratedValues: Ch5SegmentedGauge.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SegmentedGauge.ORIENTATION[0],
      isObservableProperty: true
    },
    {
      default: Ch5SegmentedGauge.GAUGE_LED_STYLE[0],
      enumeratedValues: Ch5SegmentedGauge.GAUGE_LED_STYLE,
      name: "gaugeLedStyle",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SegmentedGauge.GAUGE_LED_STYLE[0],
      isObservableProperty: true
    },
    {
      default: Ch5SegmentedGauge.STATE_GRAPHIC[0],
      enumeratedValues: Ch5SegmentedGauge.STATE_GRAPHIC,
      name: "primaryStateGraphic",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SegmentedGauge.STATE_GRAPHIC[0],
      isObservableProperty: true
    },
    {
      default: Ch5SegmentedGauge.STATE_GRAPHIC[1],
      enumeratedValues: Ch5SegmentedGauge.STATE_GRAPHIC,
      name: "secondaryStateGraphic",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SegmentedGauge.STATE_GRAPHIC[1],
      isObservableProperty: true
    },
    {
      default: Ch5SegmentedGauge.STATE_GRAPHIC[2],
      enumeratedValues: Ch5SegmentedGauge.STATE_GRAPHIC,
      name: "tertiaryStateGraphic",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5SegmentedGauge.STATE_GRAPHIC[2],
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
      default: 20,
      name: "numberOfSegments",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 20,
      numberProperties: {
        min: 1,
        max: 50,
        conditionalMin: 1,
        conditionalMax: 50,
        conditionalMinValue: 1,
        conditionalMaxValue: 50
      },
      isObservableProperty: true
    },
    {
      default: true,
      name: "touchSettable",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
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
      name: "receiveStateValue",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    }
  ];

  public static readonly ELEMENT_NAME = 'ch5-segmented-gauge';
  public cssClassPrefix = 'ch5-segmented-gauge';
  public primaryCssClass = 'ch5-segmented-gauge';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private value: number = 0;
  private defaultMaxValue: number = 65535;
  private defaultMinValue: number = 0;
  // Last value set by user
  private _dirtyValue: number = 0;
  // Initial value or last value received from signal
  private _cleanValue: number = 0;

  private debounceSignalHandling = this.debounce(() => {
    this.handleSendEventOnClick();
    this.setDirtyHandler();
  }, 10);

  private setDirtyHandler = this.debounce(() => {
    if (this._dirtyValue !== this._cleanValue) {
      this.value = this._cleanValue;
      this.setValueForSegments();
    }
  }, 1500);

  //#endregion

  //#region Getters and Setters

  public set orientation(value: TCh5SegmentedGaugeOrientation) {
    this._ch5Properties.set<TCh5SegmentedGaugeOrientation>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5SegmentedGaugeOrientation {
    return this._ch5Properties.get<TCh5SegmentedGaugeOrientation>("orientation");
  }

  public set gaugeLedStyle(value: TCh5SegmentedGaugeGaugeLedStyle) {
    this._ch5Properties.set<TCh5SegmentedGaugeGaugeLedStyle>("gaugeLedStyle", value, () => {
      this.handleGaugeLedStyle();
    });
  }
  public get gaugeLedStyle(): TCh5SegmentedGaugeGaugeLedStyle {
    return this._ch5Properties.get<TCh5SegmentedGaugeGaugeLedStyle>("gaugeLedStyle");
  }

  public set primaryStateGraphic(value: TCh5SegmentedGaugeStateGraphic) {
    this._ch5Properties.set<TCh5SegmentedGaugeStateGraphic>("primaryStateGraphic", value, () => {
      this.setValueForSegments();
    });
  }
  public get primaryStateGraphic(): TCh5SegmentedGaugeStateGraphic {
    return this._ch5Properties.get<TCh5SegmentedGaugeStateGraphic>("primaryStateGraphic");
  }

  public set secondaryStateGraphic(value: TCh5SegmentedGaugeStateGraphic) {
    this._ch5Properties.set<TCh5SegmentedGaugeStateGraphic>("secondaryStateGraphic", value, () => {
      this.setValueForSegments();
    });
  }
  public get secondaryStateGraphic(): TCh5SegmentedGaugeStateGraphic {
    return this._ch5Properties.get<TCh5SegmentedGaugeStateGraphic>("secondaryStateGraphic");
  }

  public set tertiaryStateGraphic(value: TCh5SegmentedGaugeStateGraphic) {
    this._ch5Properties.set<TCh5SegmentedGaugeStateGraphic>("tertiaryStateGraphic", value, () => {
      this.setValueForSegments();
    });
  }
  public get tertiaryStateGraphic(): TCh5SegmentedGaugeStateGraphic {
    return this._ch5Properties.get<TCh5SegmentedGaugeStateGraphic>("tertiaryStateGraphic");
  }

  public set minValue(value: number) {
    this._ch5Properties.set<number>("minValue", value, () => {
      if (value >= this.maxValue) {
        this.minValue = this.defaultMinValue;
      }
      this.setValueForSegments();
    });
  }

  public get minValue(): number {
    return +this._ch5Properties.get<number>("minValue");
  }

  public set maxValue(value: number) {
    this._ch5Properties.set<number>("maxValue", value, () => {
      if (value <= this.minValue) {
        this.maxValue = this.defaultMaxValue;
      }
      this.setValueForSegments();
    });
  }

  public get maxValue(): number {
    return +this._ch5Properties.get<number>("maxValue");
  }

  public set numberOfSegments(value: number) {
    this._ch5Properties.set<number>("numberOfSegments", value, () => {
      this.handleNumberOfSegments();
    });
  }

  public get numberOfSegments(): number {
    return +this._ch5Properties.get<number>("numberOfSegments");
  }

  public set touchSettable(value: boolean) {
    this._ch5Properties.set<boolean>("touchSettable", value);
  }
  public get touchSettable(): boolean {
    return this._ch5Properties.get<boolean>("touchSettable");
  }

  public set sendEventOnClick(value: string) {
    this._ch5Properties.set("sendEventOnClick", value);
  }
  public get sendEventOnClick(): string {
    return this._ch5Properties.get<string>('sendEventOnClick');
  }

  public set receiveStateValue(value: string) {
    this._ch5Properties.set("receiveStateValue", value, null, (newValue: number) => {
      if (newValue > this.maxValue) {
        this.value = this.maxValue;
      } else if (newValue < this.minValue) {
        this.value = this.minValue;
      } else {
        this.value = newValue;
      }
      this._cleanValue = this.value;
      this.setValueForSegments();
    });
  }
  public get receiveStateValue(): string {
    return this._ch5Properties.get<string>('receiveStateValue');
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5SegmentedGauge.ELEMENT_NAME, Ch5SegmentedGauge.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5SegmentedGauge.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5SegmentedGauge.ELEMENT_NAME, Ch5SegmentedGauge);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "receivestateshowpulse", "receivestatehidepulse", "sendeventonshow"];
    this.logger.start('constructor()', Ch5SegmentedGauge.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5SegmentedGauge.COMPONENT_PROPERTIES);
    this.initCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5SegmentedGauge.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5SegmentedGauge.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5SegmentedGauge.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-segmented-gauge attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5SegmentedGauge.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5SegmentedGauge component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5SegmentedGauge.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5SegmentedGauge);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-segmented-gauge');
      this.appendChild(this._elContainer);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.handleNumberOfSegments();
    customElements.whenDefined('ch5-segmented-gauge').then(() => {
      this.componentLoadedEvent(Ch5SegmentedGauge.ELEMENT_NAME, this.id);
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
    for (let i: number = 0; i < Ch5SegmentedGauge.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5SegmentedGauge.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5SegmentedGauge.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5SegmentedGauge.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    if (this.touchSettable) {
      this.addEventListener('click', this.handleTouchSettable);
    }
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this.removeEventListener('click', this.handleTouchSettable);
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

  private handleOrientation() {
    Array.from(Ch5SegmentedGauge.COMPONENT_DATA.ORIENTATION.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5SegmentedGauge.COMPONENT_DATA.ORIENTATION.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
  }
  private handleGaugeLedStyle() {
    Array.from(Ch5SegmentedGauge.COMPONENT_DATA.GAUGE_LED_STYLE.values).forEach((e: any) => {
      this._elContainer.classList.remove(Ch5SegmentedGauge.COMPONENT_DATA.GAUGE_LED_STYLE.classListPrefix + e);
    });
    this._elContainer.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.GAUGE_LED_STYLE.classListPrefix + this.gaugeLedStyle);
  }
  private handleNumberOfSegments() {
    Array.from(this._elContainer.children).forEach((childEle) => childEle.remove());

    for (let i = 0; i < this.numberOfSegments; i++) {
      const segments = document.createElement('div');
      segments.classList.add(this.primaryCssClass + "-segment");
      this._elContainer.appendChild(segments);
    }
    this.setValueForSegments();
  }
  private handleTouchSettable(e: MouseEvent) {
    if (this.orientation === 'horizontal') {
      const { left, right } = this._elContainer.getBoundingClientRect();
      const roundPercent = Math.round(((e.clientX - left) * 100.0) / (right - left));
      this.value = Math.round(((roundPercent * (this.maxValue - this.minValue)) / 100) + this.minValue);
    } else {
      const { top, bottom } = this._elContainer.getBoundingClientRect();
      const roundPercent = Math.abs(Math.round(((e.clientY - top) * 100.0) / (bottom - top)) - 100);
      this.value = Math.round(((roundPercent * (this.maxValue - this.minValue)) / 100) + this.minValue);
    }
    this._dirtyValue = this.value;
    // this.setValueForSegments();
    this.debounceSignalHandling();
  }
  private handleSendEventOnClick(): void {
    if (this.sendEventOnClick && this.sendEventOnClick !== null && this.sendEventOnClick !== undefined) {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventOnClick)?.publish(this.value);
    }
  }
  private setValueForSegments() {
    const segmentChildren = this._elContainer.children;
    const segmentBars = Math.round(((this.value - this.minValue) * this.numberOfSegments) / (this.maxValue - this.minValue));
    const primarySegments = Math.round((60 * this.numberOfSegments) / 100);
    const secondarySegments = Math.round((30 * this.numberOfSegments) / 100);
    const tertiarySegments = Math.round((10 * this.numberOfSegments) / 100);

    Array.from(segmentChildren).forEach((ele) => ele.className = this.primaryCssClass + "-segment");

    Array.from(segmentChildren).forEach((element, i) => {
      if (i < this.numberOfSegments && i < segmentBars && i < primarySegments) {
        element.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.PRIMARY_STATE_GRAPHIC.classListPrefix + this.primaryStateGraphic);
      } else if (i < this.numberOfSegments && i < segmentBars && i < primarySegments + secondarySegments) {
        element.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.SECONDARY_STATE_GRAPHIC.classListPrefix + this.secondaryStateGraphic);
      } else if (i < this.numberOfSegments && i < segmentBars && i < primarySegments + secondarySegments + tertiarySegments) {
        element.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.TERTIARY_STATE_GRAPHIC.classListPrefix + this.tertiaryStateGraphic);
      }
    });
  }

  private initCssClass() {
    this.logger.start('initCssClass');

    this._elContainer.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);

    this._elContainer.classList.add(Ch5SegmentedGauge.COMPONENT_DATA.GAUGE_LED_STYLE.classListPrefix + this.gaugeLedStyle);

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

Ch5SegmentedGauge.registerCustomElement();
Ch5SegmentedGauge.registerSignalAttributeTypes();

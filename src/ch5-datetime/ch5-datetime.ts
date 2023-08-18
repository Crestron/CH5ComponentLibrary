import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5DateTimeStyleForDate, TCh5DateTimeHorizontalAlignment, TCh5DateTimeDisplayType } from './interfaces/t-ch5-datetime';
import { ICh5DateTimeAttributes } from './interfaces/i-ch5-datetime-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { toFormat } from "./date-time-util";

export class Ch5DateTime extends Ch5Common implements ICh5DateTimeAttributes {

  //#region Variables

  public static readonly STYLE_FOR_DATE: TCh5DateTimeStyleForDate[] = ['MM-dd-yyyy', 'M-dd-yyyy', 'M-d-yyyy', 'MM-dd-yy', 'M-dd-yy', 'M-d-yy', 'dd_MM_yyyy', 'd_MM_yyyy', 'd_M_yyyy', 'dd_MM_yy', 'd_MM_yy', 'd_M_yy', 'd MMM yyyy', 'MMM d yyyy', 'd MMMM yyyy', 'MMMM d yyyy', 'yyyy-MM-dd', 'yyyy_MM_dd', 'MMM d, yyyy', 'yyyy MM, dd', 'yyyy MMMM, dd', 'MMMM d, yyyy'];
  public static readonly HORIZONTAL_ALIGNMENT: TCh5DateTimeHorizontalAlignment[] = ['center', 'left', 'right'];
  public static readonly DISPLAY_TYPE: TCh5DateTimeDisplayType[] = ['datetime', 'date', 'time'];
  public static readonly COMPONENT_DATA: any = {
    STYLE_FOR_DATE: {
      default: Ch5DateTime.STYLE_FOR_DATE[0],
      values: Ch5DateTime.STYLE_FOR_DATE,
      key: 'styleForDate',
      attribute: 'styleForDate'
    },
    HORIZONTAL_ALIGNMENT: {
      default: Ch5DateTime.HORIZONTAL_ALIGNMENT[0],
      values: Ch5DateTime.HORIZONTAL_ALIGNMENT,
      key: 'horizontalAlignment',
      attribute: 'horizontalAlignment',
      classListPrefix: '--horizontal-alignment-'
    },
    DISPLAY_TYPE: {
      default: Ch5DateTime.DISPLAY_TYPE[0],
      values: Ch5DateTime.DISPLAY_TYPE,
      key: 'displayType',
      attribute: 'displayType'
    }
  };

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatetimeoffsethours: { direction: "state", numericJoin: 1, contractName: true }
  };
  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: false,
      name: "display24HourFormat",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: true,
      name: "displayAmPm",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "displayTwoDigitsHour",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "displaySeconds",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: Ch5DateTime.STYLE_FOR_DATE[0],
      enumeratedValues: Ch5DateTime.STYLE_FOR_DATE,
      name: "styleForDate",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5DateTime.STYLE_FOR_DATE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5DateTime.HORIZONTAL_ALIGNMENT[0],
      enumeratedValues: Ch5DateTime.HORIZONTAL_ALIGNMENT,
      name: "horizontalAlignment",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5DateTime.HORIZONTAL_ALIGNMENT[0],
      isObservableProperty: true,
    },
    {
      default: Ch5DateTime.DISPLAY_TYPE[0],
      enumeratedValues: Ch5DateTime.DISPLAY_TYPE,
      name: "displayType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5DateTime.DISPLAY_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: 0,
      name: "timeOffsetHours",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateTimeOffsetHours",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: -32768,
        max: 32767,
        conditionalMin: -32768,
        conditionalMax: 32767,
        conditionalMinValue: -32768,
        conditionalMaxValue: 32767
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateTimeOffsetHours",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    }
  ];

  public static readonly ELEMENT_NAME = 'ch5-datetime';

  public primaryCssClass = 'ch5-datetime';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private dateTimeId: number | null = null;
  private componentFormat: string = "";

  private debounceRender = this.debounce(() => {
    this.render();
  }, 50);

  //#endregion

  //#region Getters and Setters

  public set display24HourFormat(value: boolean) {
    this._ch5Properties.set<boolean>("display24HourFormat", value, () => {
      this.debounceRender();
    });
  }
  public get display24HourFormat(): boolean {
    return this._ch5Properties.get<boolean>("display24HourFormat");
  }

  public set displayAmPm(value: boolean) {
    this._ch5Properties.set<boolean>("displayAmPm", value, () => {
      this.debounceRender();
    });
  }
  public get displayAmPm(): boolean {
    return this._ch5Properties.get<boolean>("displayAmPm");
  }

  public set displayTwoDigitsHour(value: boolean) {
    this._ch5Properties.set<boolean>("displayTwoDigitsHour", value, () => {
      this.debounceRender();
    });
  }
  public get displayTwoDigitsHour(): boolean {
    return this._ch5Properties.get<boolean>("displayTwoDigitsHour");
  }

  public set displaySeconds(value: boolean) {
    this._ch5Properties.set<boolean>("displaySeconds", value, () => {
      this.debounceRender();
    });
  }
  public get displaySeconds(): boolean {
    return this._ch5Properties.get<boolean>("displaySeconds");
  }

  public set styleForDate(value: TCh5DateTimeStyleForDate) {
    this._ch5Properties.set<TCh5DateTimeStyleForDate>("styleForDate", value, () => {
      this.debounceRender();
    });
  }
  public get styleForDate(): TCh5DateTimeStyleForDate {
    return this._ch5Properties.get<TCh5DateTimeStyleForDate>("styleForDate");
  }

  public set horizontalAlignment(value: TCh5DateTimeHorizontalAlignment) {
    this._ch5Properties.set<TCh5DateTimeHorizontalAlignment>("horizontalAlignment", value, () => {
      this.updateCssClass();
    });
  }
  public get horizontalAlignment(): TCh5DateTimeHorizontalAlignment {
    return this._ch5Properties.get<TCh5DateTimeHorizontalAlignment>("horizontalAlignment");
  }

  public set displayType(value: TCh5DateTimeDisplayType) {
    this._ch5Properties.set<TCh5DateTimeDisplayType>("displayType", value, () => {
      this.debounceRender();
    });
  }
  public get displayType(): TCh5DateTimeDisplayType {
    return this._ch5Properties.get<TCh5DateTimeDisplayType>("displayType");
  }

  public set timeOffsetHours(value: number) {
    this._ch5Properties.set<number>("timeOffsetHours", value, () => {
      this.changeTime();
    });
  }
  public get timeOffsetHours(): number {
    return this._ch5Properties.get<number>("timeOffsetHours");
  }

  public set receiveStateTimeOffsetHours(value: string) {
    this._ch5Properties.set("receiveStateTimeOffsetHours", value, null, (newValue: number) => {
      const convertedNewValue: number = this.convertAnalogValueBasedOnSignalResponse(newValue);
      this._ch5Properties.setForSignalResponse<number>("timeOffsetHours", (convertedNewValue), () => {
        this.changeTime();
      });
    });
  }
  public get receiveStateTimeOffsetHours(): string {
    return this._ch5Properties.get<string>('receiveStateTimeOffsetHours');
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5DateTime.ELEMENT_NAME, Ch5DateTime.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5DateTime.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5DateTime.ELEMENT_NAME, Ch5DateTime);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5DateTime.ELEMENT_NAME);
    this.ignoreAttributes = ["disabled", "appendClassWhenInViewPort", "sendEventOnShow", "receiveStateEnable", "receiveStateHidePulse", "receiveStateShowPulse"];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5DateTime.COMPONENT_PROPERTIES);
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5DateTime.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5DateTime.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5DateTime.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-datetime attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5DateTime.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5DateTime component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5DateTime.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5DateTime);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-datetime');
      this.appendChild(this._elContainer);
    }
    this.initAttributes();
    this.debounceRender();
    this.updateCssClass();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-datetime').then(() => {
      this.componentLoadedEvent(Ch5DateTime.ELEMENT_NAME, this.id);
      this.changeTime();
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.unsubscribeFromSignals();
    if (this.dateTimeId !== null) {
      window.clearTimeout(this.dateTimeId as number);
    }
    this.componentFormat = "";
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  private changeTime() {
    if (this.dateTimeId !== null) {
      window.clearTimeout(this.dateTimeId as number);
    }
    if (this.componentFormat !== "") {
      const newDate = new Date();
      let dateInNumberFormat: Date
      dateInNumberFormat = this.calculateTimeOffsetHours(newDate);
      this._elContainer.textContent = toFormat(dateInNumberFormat, this.componentFormat);
      this.dateTimeId = window.setTimeout(() => {
        this.changeTime();
      }, 1000);
    }
  }

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();
    const thisRef: any = this;
    for (let i: number = 0; i < Ch5DateTime.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5DateTime.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5DateTime.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5DateTime.COMPONENT_PROPERTIES[i].name;
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

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    Array.from(Ch5DateTime.HORIZONTAL_ALIGNMENT).forEach((alignment: string) => {
      this._elContainer.classList.remove(Ch5DateTime.ELEMENT_NAME + Ch5DateTime.COMPONENT_DATA.HORIZONTAL_ALIGNMENT.classListPrefix + alignment);
    });
    this._elContainer.classList.add(Ch5DateTime.ELEMENT_NAME + Ch5DateTime.COMPONENT_DATA.HORIZONTAL_ALIGNMENT.classListPrefix + this.horizontalAlignment);
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  private render() {
    /** @ts-ignore */
    const dateFormat = this.styleForDate.replaceAll('d', 'D').replaceAll('y', 'Y').replaceAll('_', '/');
    let timeFormat = '';
    /* append the time formats only if it is time or datetime type display */
    if ([Ch5DateTime.DISPLAY_TYPE[0], Ch5DateTime.DISPLAY_TYPE[2]].includes(this.displayType)) {
      timeFormat = `H:MI`; // by default show time in single digits with minutes
      if (this.display24HourFormat) {
        timeFormat = timeFormat.replace('H', 'H24'); // replace format to 24 hours
      }
      if (this.displaySeconds) {
        timeFormat = `${timeFormat}:SS`; // append seconds to the format
      }
      if (this.displayAmPm && !this.display24HourFormat) {
        timeFormat = `${timeFormat} PP`; // append AM PM to the format
      }
      if (this.displayTwoDigitsHour) {
        timeFormat = timeFormat.replace('H', 'HH'); // replace format to show in two digits
      }
    }

    let format = '';
    if (this.displayType === 'datetime') {
      format = dateFormat + " " + timeFormat;
    } else if (this.displayType === 'date') {
      format = dateFormat;
    } else if (this.displayType === 'time') {
      format = timeFormat;
    }

    this.componentFormat = format.trim();
    this.changeTime();
  }

  private calculateTimeOffsetHours(dateValue: Date): Date {
    const timeSetHours = this.timeOffsetHours;
    if (timeSetHours && timeSetHours !== 0 && timeSetHours >= -32768 && timeSetHours <= 32767) {
      const resultDate = dateValue;
      resultDate.setMinutes(resultDate.getMinutes() + Math.round((timeSetHours * 60)));
      return resultDate;
    } else {
      return dateValue;
    }
  }

  //#endregion

}

Ch5DateTime.registerCustomElement();
Ch5DateTime.registerSignalAttributeTypes();

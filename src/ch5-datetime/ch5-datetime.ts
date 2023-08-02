import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5DatetimeStyleForDate, TCh5DatetimeHorizontalAlignment, TCh5DatetimeDisplayType } from './interfaces/t-ch5-datetime';
import { ICh5DatetimeAttributes } from './interfaces/i-ch5-datetime-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { offsetTimeHours, toFormat } from "./interfaces/date-time-util";

export class Ch5Datetime extends Ch5Common implements ICh5DatetimeAttributes {

  //#region Variables

  public static readonly STYLE_FOR_DATE: TCh5DatetimeStyleForDate[] = ['MM-dd-yyyy', 'M-dd-yyyy', 'M-d-yyyy', 'MM-dd-yy', 'M-dd-yy', 'M-d-yy', 'dd_MM_yyyy', 'd_MM_yyyy', 'd_M_yyyy', 'dd_MM_yy', 'd_MM_yy', 'd_M_yy', 'd MMM yyyy', 'MMM d yyyy', 'd MMMM yyyy', 'MMMM d yyyy', 'yyyy-MM-dd', 'yyyy_MM_dd', 'MMM d, yyyy', 'yyyy MM, dd', 'yyyy MMMM, dd', 'MMMM d, yyyy'];
  public static readonly HORIZONTAL_ALIGNMENT: TCh5DatetimeHorizontalAlignment[] = ['center', 'left', 'right'];
  public static readonly DISPLAY_TYPE: TCh5DatetimeDisplayType[] = ['datetime', 'date', 'time'];
  public static readonly COMPONENT_DATA: any = {
    STYLE_FOR_DATE: {
      default: Ch5Datetime.STYLE_FOR_DATE[0],
      values: Ch5Datetime.STYLE_FOR_DATE,
      key: 'styleForDate',
      attribute: 'styleForDate'
    },
    HORIZONTAL_ALIGNMENT: {
      default: Ch5Datetime.HORIZONTAL_ALIGNMENT[0],
      values: Ch5Datetime.HORIZONTAL_ALIGNMENT,
      key: 'horizontalAlignment',
      attribute: 'horizontalAlignment',
      classListPrefix: '--horizontal-alignment-'
    },
    DISPLAY_TYPE: {
      default: Ch5Datetime.DISPLAY_TYPE[0],
      values: Ch5Datetime.DISPLAY_TYPE,
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
      valueOnAttributeEmpty: false,
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
      valueOnAttributeEmpty: false,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "displaySeconds",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true,
    },
    {
      default: Ch5Datetime.STYLE_FOR_DATE[0],
      enumeratedValues: Ch5Datetime.STYLE_FOR_DATE,
      name: "styleForDate",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Datetime.STYLE_FOR_DATE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5Datetime.HORIZONTAL_ALIGNMENT[0],
      enumeratedValues: Ch5Datetime.HORIZONTAL_ALIGNMENT,
      name: "horizontalAlignment",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Datetime.HORIZONTAL_ALIGNMENT[0],
      isObservableProperty: true,
    },
    {
      default: Ch5Datetime.DISPLAY_TYPE[0],
      enumeratedValues: Ch5Datetime.DISPLAY_TYPE,
      name: "displayType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Datetime.DISPLAY_TYPE[0],
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
        min: -37768,
        max: 37767,
        conditionalMin: -37768,
        conditionalMax: 37767,
        conditionalMinValue: -37768,
        conditionalMaxValue: 37767
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
  private dateTimeId: any;

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

  public set styleForDate(value: TCh5DatetimeStyleForDate) {
    this._ch5Properties.set<TCh5DatetimeStyleForDate>("styleForDate", value, () => {
      this.debounceRender();
    });
  }
  public get styleForDate(): TCh5DatetimeStyleForDate {
    return this._ch5Properties.get<TCh5DatetimeStyleForDate>("styleForDate");
  }

  public set horizontalAlignment(value: TCh5DatetimeHorizontalAlignment) {
    this._ch5Properties.set<TCh5DatetimeHorizontalAlignment>("horizontalAlignment", value, () => {
      this.debounceRender();
    });
  }
  public get horizontalAlignment(): TCh5DatetimeHorizontalAlignment {
    return this._ch5Properties.get<TCh5DatetimeHorizontalAlignment>("horizontalAlignment");
  }

  public set displayType(value: TCh5DatetimeDisplayType) {
    this._ch5Properties.set<TCh5DatetimeDisplayType>("displayType", value, () => {
      this.debounceRender();
    });
  }
  public get displayType(): TCh5DatetimeDisplayType {
    return this._ch5Properties.get<TCh5DatetimeDisplayType>("displayType");
  }

  public set timeOffsetHours(value: number) {
    this._ch5Properties.set<number>("timeOffsetHours", value, () => {
      this.debounceRender();
    });
  }
  public get timeOffsetHours(): number {
    return this._ch5Properties.get<number>("timeOffsetHours");
  }

  public set receiveStateTimeOffsetHours(value: string) {
    this._ch5Properties.set("receiveStateTimeOffsetHours", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("timeOffsetHours", (newValue / 100), () => {
        this.debounceRender();
      });
    });
  }
  public get receiveStateTimeOffsetHours(): string {
    return this._ch5Properties.get<string>('receiveStateTimeOffsetHours');
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Datetime.ELEMENT_NAME, Ch5Datetime.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5Datetime.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5Datetime.ELEMENT_NAME, Ch5Datetime);
    }
  }
  
  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5Datetime.ELEMENT_NAME);
    this.ignoreAttributes = ["appendClassWhenInViewPort", "sendEventOnShow", "receiveStateEnable", "receiveStateHidePulse", "receiveStateShowPulse",];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5Datetime.COMPONENT_PROPERTIES);
    this.updateCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5Datetime.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Datetime.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5Datetime.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-datetime attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5Datetime.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5Datetime component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5Datetime.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5Datetime);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-datetime');
      this.appendChild(this._elContainer);
    }
    this.initAttributes();
    this.render();
    this.initCommonMutationObserver(this);

    customElements.whenDefined('ch5-datetime').then(() => {
      this.componentLoadedEvent(Ch5Datetime.ELEMENT_NAME, this.id);
      this.dateTimeId = setInterval(() => this.debounceRender(), 1000);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.unsubscribeFromSignals();
    clearInterval(this.dateTimeId);
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
    for (let i: number = 0; i < Ch5Datetime.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Datetime.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5Datetime.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5Datetime.COMPONENT_PROPERTIES[i].name;
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

    this._elContainer.classList.add(Ch5Datetime.ELEMENT_NAME + Ch5Datetime.COMPONENT_DATA.HORIZONTAL_ALIGNMENT.classListPrefix + this.horizontalAlignment);

    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  private render() {
    /** @ts-ignore */
    const dateFormat = this.styleForDate.replaceAll('d', 'D').replaceAll('y', 'Y').replaceAll('_', '/');
    let format = this.displayType !== 'time' ? dateFormat : '';
    /* append the time formats only if it is time or datetime type display */
    if ([Ch5Datetime.DISPLAY_TYPE[0], Ch5Datetime.DISPLAY_TYPE[2]].includes(this.displayType)) {
      format = `${format} H:MI`; // by default show time in single digits with minutes
      if (this.display24HourFormat) {
        format = format.replace('H', 'HH24'); // replace format to 24 hours
      }
      if (this.displaySeconds) {
        format = `${format}:SS`; // append seconds to the format
      }
      if (this.displayAmPm && !this.display24HourFormat) {
        format = `${format} PP`; // append AM PM to the format
      }
      if (this.displayTwoDigitsHour) {
        format = format.replace('H', 'HH'); // replace format to show in two digits for 24 hour format
      }
    }
    /* trim any spaces that could have been introduced to the above conditional appending of format */
    format = format.trim();
    let content = toFormat(new Date(), format);
    if (this.timeOffsetHours) {
      const timeOffset = offsetTimeHours(new Date(), this.timeOffsetHours * 60);
      content = toFormat(timeOffset, format);
    }
    this._elContainer.textContent = String(content);
  }

  //#endregion

}

Ch5Datetime.registerCustomElement();
Ch5Datetime.registerSignalAttributeTypes();

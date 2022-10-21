import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping, Ch5Signal, Ch5SignalFactory } from "..";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5ColorPickerAttributes } from './interfaces/i-ch5-color-picker-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import Ch5ColorUtils from "../ch5-common/utils/ch5-color-utils";
import * as colorjoe from "colorjoe";

export class Ch5ColorPicker extends Ch5Common implements ICh5ColorPickerAttributes {

  //#region Variables

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestateredvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestategreenvalue: { direction: "state", numericJoin: 1, contractName: true },
    receivestatebluevalue: { direction: "state", numericJoin: 1, contractName: true },
    sendEventColorRedOnChange: { direction: "event", numericJoin: 1, contractName: true },
    sendEventColorGreenOnChange: { direction: "event", numericJoin: 1, contractName: true },
    sendEventColorBlueOnChange: { direction: "event", numericJoin: 1, contractName: true }
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
  private redValue: number = 0;
  private greenValue: number = 0;
  private blueValue: number = 0;
  private pickerId: string = "";
  private colorPickerObject: any = null;

  /**
   * Event change: Fires when the component's `checked` value changes due to user interaction.
   */
  private changeEvent: Event = {} as Event;

  /**
   * Event dirty: Fires when the component is on feedbackMode='submit' and displayed value is different than the actual value
   */
  private dirtyEvent: Event = {} as Event;

  /**
   * Event clean: Fires when the component is on feedbackMode='submit' and displayed value is the actual value
   */
  private cleanEvent: Event = {} as Event;

  /**
   * The dirty value flag must be initially set to false when the element is created,
   * and must be set to true whenever the user interacts with the control in a way that changes the value.
   * @private
   * @type {boolean}
   */
  private _dirty: boolean = false;

  /**
   * The clean value flag must be initially set to true when the element is created,
   * and must be set to false whenever the user interacts with the control in a way that changes the value.
   * @private
   * @type {boolean}
   */
  private _clean: boolean = true;


  /**
   * Last value set by user
   * @private
   * @type {(string)}
   */
  private _dirtyValue: string = '';

  /**
   * Initial value or last value received from signal
   * @private
   * @type {(string)}
   */
  private _cleanValue: string = '';

  /**
   * Defines the timeout between the user click the toggle and the time the toggle will check if the value is equal with the value from the signal
   * @private
   * @type {(number|null)}
   */
  private _dirtyTimerHandle: number | null = null;

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
      if (newValue <= this.maxValue && this.redValue !== Ch5ColorUtils.getDigitalValue(newValue, this.maxValue)) {
        this.redValue = Ch5ColorUtils.getDigitalValue(newValue, this.maxValue);
        this.updateColor();
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
        this.updateColor();
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
        this.updateColor();
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
      // this.setAttribute('role', Ch5RoleAttributeMapping.ch5ColorPicker);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-color-picker');
      this.pickerId = this.getCrId();
      this._elContainer.setAttribute("id", this.pickerId);
      this.appendChild(this._elContainer);
      // colorjoe.hsl(id, '#113c38', [
      //   'currentColor',
      //   'hex'
      // ]).on('change', (c: any) => {
      //   const complement = "#" + this.invertHex(c.hex().replace("#", ""));
      //   const thisColorDiv = document.getElementById(id);
      //   if (thisColorDiv) {
      //     const queryObj = thisColorDiv.querySelectorAll<HTMLElement>('.oned')[0].querySelectorAll<HTMLElement>('.shape')[0];
      //     queryObj.style.backgroundColor = c.css();
      //     queryObj.style.borderColor = complement;
      //   }
      // }).update();
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    customElements.whenDefined('ch5-color-picker').then(() => {
      this.updateColor();
      this.componentLoadedEvent(Ch5ColorPicker.ELEMENT_NAME, this.id);
    });
    this.logger.stop();
  }

  private invertHex(hex: string) {
    return '#' + hex.match(/[a-f0-9]{2}/ig)?.map(e => (255 - parseInt(e, 16) || 0).toString(16).replace(/^([a-f0-9])$/, '0$1')).join(''); // (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  private updateColor() {
    const newColor: string = Ch5ColorUtils.rgbToHex(this.redValue, this.greenValue, this.blueValue)
    if (!this.colorPickerObject) {
      this.colorPickerObject = colorjoe.hsl(this.pickerId, newColor, [
        'currentColor',
        'hex'
      ]).on('change', (c: any) => {
        const complement = this.invertHex(c.hex());
        const thisColorDiv = document.getElementById(this.pickerId);
        if (thisColorDiv) {
          const queryObj = thisColorDiv.querySelectorAll<HTMLElement>('.oned')[0].querySelectorAll<HTMLElement>('.shape')[0];
          queryObj.style.backgroundColor = c.css();
          queryObj.style.borderColor = complement;
        }
      }).update();
    }
    this.colorPickerObject.set(newColor);
  }

  // /**
  //  * Because `colorChanged()` is only caused by a user action, it will
  //  * also dispatch a change event.
  //  */
  // private colorChanged() {
  //   // The detail of the event.
  //   let detail;

  //   // Change the value of checked.
  //   this.checked = !this.checked;
  //   detail = { value: this.checked };

  //   // set dirty state and dirty value
  //   if (!this._dirty) {
  //     // set dirty value
  //     this._dirtyValue = this.checked;
  //     // set dirty state
  //     this.setDirty();
  //   } else {
  //     // set state as clean
  //     this.setClean();
  //   }

  //   // set dirty handler immediately if feedbackMode is not submit and send click signal
  //   if (this._feedbackMode !== 'submit') {
  //     this._setDirtyHandler();
  //     this.sendSignalForClickAndTouch();
  //   }

  //   // dispatch 'change' event
  //   this._dispatchEvents(detail);
  // }

  // /**
  //  * Dirty handler
  //  * @private
  //  */
  // private _setDirtyHandler() {
  //   this.info('Ch5Toggle._setDirtyHandler');
  //   if (this._dirtyTimerHandle !== null) {
  //     clearTimeout(this._dirtyTimerHandle);
  //   }

  //   this._dirtyTimerHandle = window.setTimeout(
  //     () => this._onDirtyTimerFinished(),
  //     this._signalValueSyncTimeout
  //   );
  // }

  // private _onDirtyTimerFinished() {
  //   this.info('Ch5Toggle._onDirtyTimerFinished');
  //   this._dirtyTimerHandle = null;

  //   if (this._dirtyValue !== this._cleanValue) {
  //     // set ui view value
  //     this.checked = this._cleanValue;

  //     // set state as clean
  //     this.setClean();
  //   }
  // }

  // /**
  //  * Dispatch change event
  //  *
  //  * @private
  //  * @param {*} detail
  //  * @memberof Ch5Toggle
  //  */
  // private _dispatchEvents(detail: any): void {
  //   /**
  //    * Fired when the component's `checked` value changes due to user interaction.
  //    *
  //    * @event change
  //    */
  //   this.dispatchEvent(
  //     this.changeEvent = new CustomEvent('change', {
  //       detail,
  //       bubbles: true
  //     })
  //   );
  // }

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
    if (color === 'red' && this.sendEventColorRedOnChange !== "") {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorRedOnChange)?.publish(this.redValue);
    } else if (color === 'green' && this.sendEventColorGreenOnChange !== "") {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorGreenOnChange)?.publish(this.greenValue);
    } else if (color === 'blue' && this.sendEventColorBlueOnChange !== "") {
      Ch5SignalFactory.getInstance().getNumberSignal(this.sendEventColorBlueOnChange)?.publish(this.blueValue);
    }
    // add the code for div to respond on new color
  }
}

Ch5ColorPicker.registerCustomElement();
Ch5ColorPicker.registerSignalAttributeTypes();

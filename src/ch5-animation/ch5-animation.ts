import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping, Ch5Signal, Ch5SignalFactory } from "..";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5AnimationSize, TCh5AnimationStyle, } from './interfaces/t-ch5-animation';
import { ICh5AnimationAttributes } from './interfaces/i-ch5-animation-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5Animation extends Ch5Common implements ICh5AnimationAttributes {

  //#region Variables

  public static readonly SIZE: TCh5AnimationSize[] = ['regular', 'small', 'large', 'x-large'];
  public static readonly ANIMTION_STYLE: TCh5AnimationStyle[] = ['spinner', 'ring', 'roller'];
  public static readonly COMPONENT_DATA: any = {
    SIZE: {
      default: Ch5Animation.SIZE[0],
      values: Ch5Animation.SIZE,
      key: 'size',
      attribute: 'size',
      classListPrefix: 'ch5-animation--size-'
    },
    ANIMATION_STYLE: {
      default: Ch5Animation.ANIMTION_STYLE[0],
      values: Ch5Animation.ANIMTION_STYLE,
      key: 'animationstyle',
      attribute: 'animationstyle',
      classListPrefix: 'ch5-animation--style-'
    }
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    sendeventonclick: { direction: "state", booleanJoin: 1, contractName: true },
    receivestateanimate: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatemode: { direction: "state", numericJoin: 1, contractName: true },
    receivestatevalue: { direction: "state", numericJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: true,
      name: "startAnimating",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: 6,
      name: "framesPerSecond",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateMode",
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
      default: Ch5Animation.SIZE[0],
      enumeratedValues: Ch5Animation.SIZE,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Animation.SIZE[0],
      isObservableProperty: true
    },
    {
      default: Ch5Animation.ANIMTION_STYLE[0],
      enumeratedValues: Ch5Animation.ANIMTION_STYLE,
      name: "animationStyle",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Animation.ANIMTION_STYLE[0],
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
      default: "true",
      isSignal: true,
      name: "receiveStateAnimate",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateMode",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateValue",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-animation';

  public cssClassPrefix = 'ch5-animation';
  public primaryCssClass = 'ch5-animation';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _iconContainer: HTMLElement = {} as HTMLElement;

  //#endregion

  //#region Getters and Setters

  public set startAnimating(value: boolean) {
    this._ch5Properties.set<boolean>("startAnimating", value, () => {
      this.handleStartAnimating();
    });
  }
  public get startAnimating(): boolean {
    return this._ch5Properties.get<boolean>("startAnimating");
  }

  public set framesPerSecond(value: number) {
    this._ch5Properties.set<number>("framesPerSecond", value, () => {
      this.handleFramesPerSecond(value);
    });
  }
  public get framesPerSecond(): number {
    return this._ch5Properties.get<number>("framesPerSecond");
  }

  public set size(value: TCh5AnimationSize) {
    this._ch5Properties.set<TCh5AnimationSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5AnimationSize {
    return this._ch5Properties.get<TCh5AnimationSize>("size");
  }

  public set animationStyle(value: TCh5AnimationStyle) {
    this._ch5Properties.set<TCh5AnimationStyle>("animationStyle", value, () => {
      this.handleAnimationStyle(value);
    });
  }
  public get animationStyle(): TCh5AnimationStyle {
    return this._ch5Properties.get<TCh5AnimationStyle>("animationStyle");
  }

  public set sendEventOnClick(value: string) {
    this._ch5Properties.set("sendEventOnClick", value, null, (newValue: boolean) => {
      // 
    });
  }
  public get sendEventOnClick(): string {
    return this._ch5Properties.get<string>('sendEventOnClick');
  }

  public set receiveStateAnimate(value: string) {
    this._ch5Properties.set("receiveStateAnimate", value, null, (newValue: boolean) => {
      this._ch5Properties.setForSignalResponse<boolean>("startAnimating", newValue, () => {
        this.handleStartAnimating();
      });
    });
  }
  public get receiveStateAnimate(): string {
    return this._ch5Properties.get<string>('receiveStateAnimate');
  }

  public set receiveStateMode(value: string) {
    this._ch5Properties.set("receiveStateMode", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("framesPerSecond", newValue, () => {
        this.handleFramesPerSecond(newValue);
      });
    });
  }
  public get receiveStateMode(): string {
    return this._ch5Properties.get<string>('receiveStateMode');
  }

  public set receiveStateValue(value: string) {
    this._ch5Properties.set("receiveStateValue", value, null, (newValue: TCh5AnimationStyle) => {
      this._ch5Properties.setForSignalResponse<TCh5AnimationStyle>("animationStyle", newValue, () => {
        this.handleAnimationStyle(newValue);
      });
    });
  }
  public get receiveStateValue(): string {
    return this._ch5Properties.get<string>('receiveStateValue');
  }


  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Animation.ELEMENT_NAME, Ch5Animation.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5Animation.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5Animation.ELEMENT_NAME, Ch5Animation);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5Animation.ELEMENT_NAME);
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5Animation.COMPONENT_PROPERTIES);
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5Animation.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Animation.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5Animation.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-animation attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5Animation.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5Animation component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5Animation.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5Animation);
    }

    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.handleFramesPerSecond(6);
    customElements.whenDefined('ch5-animation').then(() => {
      this.componentLoadedEvent(Ch5Animation.ELEMENT_NAME, this.id);
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
    this._elContainer = document.createElement('div');
    this._iconContainer = document.createElement('i');
    this._iconContainer.classList.add('fas');
    this._iconContainer.classList.add('fa-spinner');
    this._iconContainer.classList.add('fa-spin');

    this._elContainer.appendChild(this._iconContainer);
    this._elContainer.classList.add('ch5-animation');
    this.appendChild(this._elContainer);
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5Animation.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Animation.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5Animation.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5Animation.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
    this.updateCssClass();
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this.addEventListener("click", this.handleSendEventOnClick);
    this.addEventListener("release", this.handleSendEventOnRelease);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this.removeEventListener("click", this.handleSendEventOnClick);
    this.removeEventListener("release", this.handleSendEventOnRelease);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }


  private handleStartAnimating() {
    ['true', 'false'].forEach((e: any) => {
      this._iconContainer.classList.remove('ch5-animation--startAnimating-' + e);
    });
    this._iconContainer.classList.add('ch5-animation--startAnimating-' + this.startAnimating.toString());
  }
  private handleFramesPerSecond(value: number) {
    let framesPerSecondMatch: number;
    framesPerSecondMatch = (100 - value) * 10;
    this._iconContainer.setAttribute('style', `animation-duration:${framesPerSecondMatch}ms;`);
  }
  private handleSize() {
    Array.from(Ch5Animation.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._iconContainer.classList.remove(Ch5Animation.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._iconContainer.classList.add(Ch5Animation.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }
  private handleAnimationStyle(value: TCh5AnimationStyle) {
    ["fa-spinner", "fa-circle-notch", "fa-sync"].forEach((clsName) => {
      this._iconContainer.classList.remove(clsName);
    });

    this._iconContainer.classList.add(value === 'spinner' ? 'fa-spinner' : value === 'ring' ? 'fa-circle-notch' : value === 'roller' ? 'fa-sync' : 'fa-spinner');
  }
  private handleSendEventOnClick() {
    const sigChange: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick);
    if (sigChange) {
      sigChange.publish(true);
    }
  }

  private handleSendEventOnRelease() {
    const sigChange: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick);
    if (sigChange) {
      sigChange.publish(false);
    }
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._iconContainer.classList.add(Ch5Animation.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this._iconContainer.classList.add('ch5-animation--startAnimating-' + this.startAnimating.toString());
    this.logger.stop();
  }
  public getCssClassDisabled() {
    return this.cssClassPrefix + '--disabled';
  }

  //#endregion

}

Ch5Animation.registerCustomElement();
Ch5Animation.registerSignalAttributeTypes();

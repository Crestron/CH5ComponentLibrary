import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "..";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5AnimationSize, TCh5AnimationStyle, } from './interfaces/t-ch5-animation';
import { ICh5AnimationAttributes } from './interfaces/i-ch5-animation-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5Animation extends Ch5Common implements ICh5AnimationAttributes {

  //#region Variables

  public static readonly SIZES: TCh5AnimationSize[] = ['regular', 'small', 'large', 'x-large'];
  public static readonly ANIMATION_STYLES: TCh5AnimationStyle[] = ['ring', 'spinner', 'roller'];
  public static readonly ANIMATION_STYLES_CLASS: string[] = ['fa-circle-notch', 'fa-spinner', 'fa-sync'];
  public static readonly COMPONENT_DATA: any = {
    SIZE: {
      default: Ch5Animation.SIZES[0],
      values: Ch5Animation.SIZES,
      key: 'size',
      attribute: 'size',
      classListPrefix: 'ch5-animation--size-'
    },
    ANIMATION_STYLE: {
      default: Ch5Animation.ANIMATION_STYLES[0],
      values: Ch5Animation.ANIMATION_STYLES,
      key: 'animationstyle',
      attribute: 'animationstyle',
      classListPrefix: 'ch5-animation--style-'
    }
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestateanimate: { direction: "state", booleanJoin: 1, contractName: true },
    receivestateframespersecond: { direction: "state", numericJoin: 1, contractName: true },
    receivestateanimationstyle: { direction: "state", stringJoin: 1, contractName: true },
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
      default: Ch5Animation.SIZES[0],
      enumeratedValues: Ch5Animation.SIZES,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Animation.SIZES[0],
      isObservableProperty: true
    },
    {
      default: Ch5Animation.ANIMATION_STYLES[0],
      enumeratedValues: Ch5Animation.ANIMATION_STYLES,
      name: "animationStyle",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Animation.ANIMATION_STYLES[0],
      isObservableProperty: true
    },
    {
      default: "",
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
      name: "receiveStateFramesPerSecond",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateAnimationStyle",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-animation';
  public static readonly defaultFramesPerSecond = 1500;
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

  public set receiveStateFramesPerSecond(value: string) {
    this._ch5Properties.set("receiveStateFramesPerSecond", value, null, (newValue: number) => {
      this.handleFramesPerSecond(newValue);
    });
  }
  public get receiveStateFramesPerSecond(): string {
    return this._ch5Properties.get<string>('receiveStateFramesPerSecond');
  }

  public set receiveStateAnimationStyle(value: string) {
    this._ch5Properties.set("receiveStateAnimationStyle", value, null, (newValue: TCh5AnimationStyle) => {
      this._ch5Properties.setForSignalResponse<TCh5AnimationStyle>("animationStyle", newValue, () => {
        this.handleAnimationStyle(newValue);
      });
    });
  }
  public get receiveStateAnimationStyle(): string {
    return this._ch5Properties.get<string>('receiveStateAnimationStyle');
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

    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    customElements.whenDefined('ch5-animation').then(() => {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', Ch5RoleAttributeMapping.ch5Animation);
      }
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
    this._iconContainer.classList.add(Ch5Animation.ANIMATION_STYLES_CLASS[0]);
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
  }

  protected removeEventListeners() {
    super.removeEventListeners();
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
    const framesPerSecondMatch: number = value < 0 ? Ch5Animation.defaultFramesPerSecond : (100 - value) * 15;
    this._iconContainer.setAttribute('style', `animation-duration:${framesPerSecondMatch > 0 ? framesPerSecondMatch : 15}ms;`);
  }
  private handleSize() {
    Array.from(Ch5Animation.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._iconContainer.classList.remove(Ch5Animation.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._iconContainer.classList.add(Ch5Animation.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }
  private handleAnimationStyle(value: TCh5AnimationStyle) {
    Ch5Animation.ANIMATION_STYLES_CLASS.forEach((clsName) => {
      this._iconContainer.classList.remove(clsName);
    });
    this._iconContainer.classList.add(value === 'spinner' ? Ch5Animation.ANIMATION_STYLES_CLASS[1] : value === 'ring' ? Ch5Animation.ANIMATION_STYLES_CLASS[0] : value === 'roller' ? Ch5Animation.ANIMATION_STYLES_CLASS[2] : Ch5Animation.ANIMATION_STYLES_CLASS[0]);
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._iconContainer.classList.add(Ch5Animation.COMPONENT_DATA.SIZE.classListPrefix + this.size);
    this._iconContainer.classList.add('ch5-animation--startAnimating-' + this.startAnimating.toString());
    this._iconContainer.setAttribute('style', `animation-duration:${Ch5Animation.defaultFramesPerSecond}ms;`);
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

Ch5Animation.registerCustomElement();
Ch5Animation.registerSignalAttributeTypes();

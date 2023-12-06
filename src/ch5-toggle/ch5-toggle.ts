import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5ToggleHandleShape, TCh5ToggleOrientation, TCh5ToggleSize, TCh5ToggleFeedbackMode } from './interfaces/t-ch5-toggle';
import { ICh5ToggleAttributes } from './interfaces/i-ch5-toggle-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5CommonInput } from "../ch5-common-input/ch5-common-input";
import HtmlCallback from "../ch5-common/utils/html-callback";

export class Ch5Toggle extends Ch5CommonInput implements ICh5ToggleAttributes {

  //#region Variables

  public static readonly HANDLE_SHAPE: TCh5ToggleHandleShape[] = ['circle', 'rectangle'];
  public static readonly ORIENTATION: TCh5ToggleOrientation[] = ['horizontal', 'vertical'];
  public static readonly SIZES: TCh5ToggleSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];
  public static MODES: TCh5ToggleFeedbackMode[] = ['direct', 'submit'];
  public static readonly COMPONENT_DATA: any = {
    HANDLE_SHAPE: {
      default: Ch5Toggle.HANDLE_SHAPE[0],
      values: Ch5Toggle.HANDLE_SHAPE,
      key: 'handleShape',
      attribute: 'handleShape',
      classListPrefix: '--handle-shape-'
    },
    ORIENTATION: {
      default: Ch5Toggle.ORIENTATION[0],
      values: Ch5Toggle.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
    },
    SIZE: {
      default: Ch5Toggle.SIZES[0],
      values: Ch5Toggle.SIZES,
      key: 'size',
      classListPrefix: '--size-'
    },
    MODES: {
      default: Ch5Toggle.MODES[0],
      values: Ch5Toggle.MODES,
      key: 'mode',
      classListPrefix: '--'
    },
  };
  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receivestatevalue: { direction: "state", booleanJoin: 1, contractName: true },
    receivestatescriptlabelhtml: { direction: "state", stringJoin: 1, contractName: true },
    sendeventonclick: { direction: "event", booleanJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5Toggle.HANDLE_SHAPE[0],
      enumeratedValues: Ch5Toggle.HANDLE_SHAPE,
      name: "handleShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Toggle.HANDLE_SHAPE[0],
      isObservableProperty: true,
    },
    {
      default: "",
      name: "label",
      nameForSignal: "receiveStateScriptLabelHTML",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "labelOn",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "labelOff",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "iconOn",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "iconOff",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: Ch5Toggle.ORIENTATION[0],
      enumeratedValues: Ch5Toggle.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Toggle.ORIENTATION[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "value",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: false,
      isObservableProperty: true,
    },
    {
      default: Ch5Toggle.SIZES[0],
      enumeratedValues: Ch5Toggle.SIZES,
      name: "size",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5Toggle.SIZES[0],
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateValue",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateScriptLabelHTML",
      signalType: "string",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "sendEventOnClick",
      signalType: "boolean",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-toggle';

  public primaryCssClass = 'ch5-toggle';
  public changeEvent: Event = {} as Event;
  public cleanEvent: Event = {} as Event;
  public dirtyEvent: Event = {} as Event;

  protected _dirtyTimerHandle: number | null = null;
  protected _dirty: boolean = false;
  protected _clean: boolean = true;

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  private _elBody: HTMLElement = {} as HTMLElement;
  private _elLabel: HTMLElement = {} as HTMLElement;
  private _elHandle: HTMLElement = {} as HTMLElement;
  private _elIconOn: HTMLElement = {} as HTMLElement;
  private _elIconOff: HTMLElement = {} as HTMLElement;
  private _elLabelOn: HTMLElement = {} as HTMLElement;
  private _elLabelOff: HTMLElement = {} as HTMLElement;
  private _elOnContainer: HTMLElement = {} as HTMLElement;
  private _elOffContainer: HTMLElement = {} as HTMLElement;
  private _elKnob: HTMLElement = {} as HTMLElement;

  //#endregion

  //#region Getters and Setters

  public set handleShape(value: TCh5ToggleHandleShape) {
    this._ch5Properties.set<TCh5ToggleHandleShape>("handleShape", value, () => {
      this.handleHandleShape();
    });
  }
  public get handleShape(): TCh5ToggleHandleShape {
    return this._ch5Properties.get<TCh5ToggleHandleShape>("handleShape");
  }

  public set label(value: string) {
    this._ch5Properties.set<string>("label", value, () => {
      this.handleLabel();
    });
  }
  public get label(): string {
    return this._ch5Properties.get<string>("label");
  }

  public set labelOn(value: string) {
    this._ch5Properties.set<string>("labelOn", value, () => {
      this._elLabelOn.innerText = this._getTranslatedValue('labelOn', this.labelOn);
    });
  }
  public get labelOn(): string {
    return this._ch5Properties.get<string>("labelOn");
  }

  public set labelOff(value: string) {
    this._ch5Properties.set<string>("labelOff", value, () => {
      this._elLabelOff.innerText = this._getTranslatedValue('labelOff', this.labelOff);
    });
  }
  public get labelOff(): string {
    return this._ch5Properties.get<string>("labelOff");
  }

  public set iconOn(value: string) {
    this._ch5Properties.set<string>("iconOn", value, () => {
      this.handleIconOn();
    });
  }
  public get iconOn(): string {
    return this._ch5Properties.get<string>("iconOn");
  }

  public set iconOff(value: string) {
    this._ch5Properties.set<string>("iconOff", value, () => {
      this.handleIconOff();
    });
  }
  public get iconOff(): string {
    return this._ch5Properties.get<string>("iconOff");
  }

  public set orientation(value: TCh5ToggleOrientation) {
    this._ch5Properties.set<TCh5ToggleOrientation>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5ToggleOrientation {
    return this._ch5Properties.get<TCh5ToggleOrientation>("orientation");
  }

  public set value(value: boolean) {
    this._ch5Properties.set<boolean>("value", value, () => {
      this.handleValue();
    });
  }
  public get value(): boolean {
    return this._ch5Properties.get<boolean>("value");
  }

  public set size(value: TCh5ToggleSize) {
    this._ch5Properties.set<TCh5ToggleSize>("size", value, () => {
      this.handleSize();
    });
  }
  public get size(): TCh5ToggleSize {
    return this._ch5Properties.get<TCh5ToggleSize>("size");
  }

  public set receiveStateValue(value: string) {
    this._ch5Properties.set("receiveStateValue", value, null, (newValue: boolean) => {
      this.value = newValue;
      this.cleanValue = newValue;
      this._dirty = false;
      this._clean = true;
      if (this._dirtyTimerHandle !== null) { clearTimeout(this._dirtyTimerHandle); }
    });
  }
  public get receiveStateValue(): string {
    return this._ch5Properties.get<string>('receiveStateValue');
  }

  public set receiveStateScriptLabelHTML(value: string) {
    this._ch5Properties.set("receiveStateScriptLabelHTML", value, null, (newValue: string) => {
      this._ch5Properties.setForSignalResponse<string>("label", newValue, () => {
        this.handleLabel();
      });
    });
  }
  public get receiveStateScriptLabelHTML(): string {
    return this._ch5Properties.get<string>('receiveStateScriptLabelHTML');
  }

  public set sendEventOnClick(value: string) {
    this._ch5Properties.set("sendEventOnClick", value);
  }
  public get sendEventOnClick(): string {
    return this._ch5Properties.get<string>('sendEventOnClick');
  }


  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Toggle.ELEMENT_NAME, Ch5Toggle.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5Toggle.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5Toggle.ELEMENT_NAME, Ch5Toggle);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5Toggle.ELEMENT_NAME);
    this.ignoreAttributes = [];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }

    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5Toggle.COMPONENT_PROPERTIES);
    this.updateCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5Toggle.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Toggle.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5Toggle.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-toggle attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5Toggle.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
      if (attributeChangedProperty) {
        const thisRef: any = this;
        const key = attributeChangedProperty.name;
        thisRef[key] = newValue;
      } else {
        super.attributeChangedCallback(attr, oldValue, newValue);
      }
    }
    this.addAriaAttributes();
    this.logger.stop();
  }

  /**
   * Called when the Ch5Toggle component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5Toggle.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5Toggle);
    }
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-toggle');
      this.appendChild(this._elContainer);
    }
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this._cleanValue = this.value;

    customElements.whenDefined('ch5-toggle').then(() => {
      this.componentLoadedEvent(Ch5Toggle.ELEMENT_NAME, this.id);
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
    this._elBody = document.createElement('div');

    this._elLabel = document.createElement('span');
    this._elLabel.hidden = true;
    this._elLabel.classList.add(this.primaryCssClass + '__label');

    // element handle
    this._elHandle = document.createElement('span');
    this._elHandle.classList.add(this.primaryCssClass + '__handle');

    // element iconOn/labelOn
    this._elIconOn = document.createElement('i');
    this._elIconOn.classList.add(this.primaryCssClass + '__on-icon');
    this._elLabelOn = document.createElement('span');
    this._elLabelOn.classList.add(this.primaryCssClass + '__on-label');
    this._elOnContainer = document.createElement('div');
    this._elOnContainer.appendChild(this._elIconOn);
    this._elOnContainer.appendChild(this._elLabelOn);

    // element iconOff/labeloff
    this._elIconOff = document.createElement('i');
    this._elIconOff.classList.add(this.primaryCssClass + '__off-icon');
    this._elLabelOff = document.createElement('span');
    this._elLabelOff.classList.add(this.primaryCssClass + '__off-label');
    this._elOffContainer = document.createElement('div');
    this._elOffContainer.appendChild(this._elIconOff);
    this._elOffContainer.appendChild(this._elLabelOff);

    // element knob
    this._elKnob = document.createElement('a');

    // append childrens
    this._elBody.appendChild(this._elLabel);
    this._elBody.appendChild(this._elHandle);
    this._elHandle.appendChild(this._elOffContainer);
    this._elHandle.appendChild(this._elOnContainer);
    this._elHandle.appendChild(this._elKnob);
    this._elContainer.appendChild(this._elBody);
    this.setAttribute('tabindex', '0');

    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();
    const thisRef: any = this;
    for (let i: number = 0; i < Ch5Toggle.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5Toggle.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5Toggle.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5Toggle.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this.addEventListener('click', this.handleClick);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this.removeEventListener('click', this.handleClick);
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

  private handleHandleShape() {
    Array.from(Ch5Toggle.COMPONENT_DATA.HANDLE_SHAPE.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + "--" + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + "--" + this.handleShape);
  }

  private handleLabel() {
    this._elLabel.innerHTML = this._getTranslatedValue('label', this.label);
    this._elLabel.hidden = false;
  }

  private handleIconOn() {
    this.iconOn.split(' ').forEach((className: string) => {
      if (className.trim() !== "") {
        this._elIconOn.classList.remove(className);
      }
    });
    this.iconOn.split(' ').forEach((className: string) => {
      if (className.trim() !== "") {
        this._elIconOn.classList.add(className);
      }
    });
  }

  private handleIconOff() {
    this.iconOff.split(' ').forEach((className: string) => {
      if (className.trim() !== "") {
        this._elIconOff.classList.remove(className);
      }
    });
    this.iconOff.split(' ').forEach((className: string) => {
      if (className.trim() !== "") {
        this._elIconOff.classList.add(className);
      }
    });
  }

  private handleOrientation() {
    Array.from(Ch5Toggle.COMPONENT_DATA.ORIENTATION.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + "--" + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + "--" + this.orientation);
  }

  private handleSize() {
    Array.from(Ch5Toggle.COMPONENT_DATA.SIZE.values).forEach((e: any) => {
      this._elHandle.classList.remove(this.primaryCssClass + '__handle' + Ch5Toggle.COMPONENT_DATA.SIZE.classListPrefix + e);
    });
    this._elHandle.classList.add(this.primaryCssClass + '__handle' + Ch5Toggle.COMPONENT_DATA.SIZE.classListPrefix + this.size);
  }

  private handleSendEventOnClick() {
    if (this.sendEventOnClick) {
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnClick)?.publish(false);
    }
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();

    this._elContainer.classList.add(this.primaryCssClass + `--${this.handleShape}`);

    this._elContainer.classList.add(this.primaryCssClass + `--${this.orientation}`);

    this._elHandle.classList.add(this.primaryCssClass + '__handle' + Ch5Toggle.COMPONENT_DATA.SIZE.classListPrefix + this.size);

    this.logger.stop();
  }

  private handleClick = () => {
    if (this.disabled) {
      return;
    }
    this.toggleChecked();
  }

  private _dispatchEvents(detail: any): void {
    this.dispatchEvent(
      this.changeEvent = new CustomEvent('change', {
        detail,
        bubbles: true
      })
    );
  }

  private addAriaAttributes() {
    if (this.disabled) {
      this.removeAttribute('tabindex');
      this.blur();
    } else {
      this.setAttribute('tabindex', '0');
    }
    this.setAttribute('aria-checked', this.value + '');
    this.setAttribute('aria-disabled', this.disabled + '');
  }

  private handleValue() {
    this.dirtyValue = this.value;
    this._clean = false;
    if (this.value) {
      this.setAttribute('checked', '');
      this._elContainer.classList.add(this.primaryCssClass + '--on');
    } else {
      this.removeAttribute('checked');
      this._elContainer.classList.remove(this.primaryCssClass + '--on');
    }
  }

  private setDirtyHandler() {
    if (this._dirtyTimerHandle !== null) { clearTimeout(this._dirtyTimerHandle); }

    this._dirtyTimerHandle = window.setTimeout(() => this.valueSync(), this._signalValueSyncTimeout);
  }

  private valueSync() {
    if (this._dirtyTimerHandle !== null) { clearTimeout(this._dirtyTimerHandle); }

    if (this.dirtyValue !== this.cleanValue) {
      this.value = this.cleanValue as boolean;
      this.setClean();
    }
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  public submit(): void {
    if (this.feedbackMode === 'submit' && this.dirtyValue !== this.cleanValue) {
      this._submitted = true;
      this.setDirtyHandler();
      this.handleSendEventOnClick();
    }
  };

  public reset(): void {
    this.setClean();
    this.value = this.cleanValue as boolean;
  }

  public toggleChecked() {
    // Change the value of checked.
    this.value = !this.value;
    // The detail of the event.
    const detail = { value: this.value };
    // set dirty state and dirty value
    if (!this._dirty) {
      // set dirty value
      this._dirtyValue = this.value;
      // set dirty state
      this.setDirty();
    } else {
      // set state as clean
      this.setClean();
    }

    // set dirty handler immediately if feedbackMode is not submit and send click signal
    if (this.feedbackMode !== 'submit') {
      this.setDirtyHandler();
      this.handleSendEventOnClick();
    }
    // dispatch 'change' event
    this._dispatchEvents(detail);
  }

  public getDirty(): boolean {
    if (this.feedbackMode === 'submit') {
      return this._dirty;
    }
    return false;
  }

  public setDirty(): void {
    this._dirty = true;
    this._clean = false;

    // fire dirty event
    if (this.feedbackMode === 'submit') {
      const detail = { value: this.value };
      /**
       * Fired when the component's value changes due to user interaction.
       *
       * @event dirty
       */
      this.dispatchEvent(
        this.dirtyEvent = new CustomEvent('dirty', {
          bubbles: true,
          cancelable: false,
          detail
        })

      );

      if (this.ondirty instanceof HtmlCallback) {
        (this.ondirty as HtmlCallback).run({} as Event);
      } else if (this.onclean instanceof Function) {
        this.onclean();
      }
    }
  }

  public setClean(): void {
    if (this._dirtyTimerHandle !== null) { clearTimeout(this._dirtyTimerHandle); }

    this._dirty = false;
    this._clean = true;
    this._submitted = false;

    // fire clean event
    if (this.feedbackMode === 'submit') {
      const detail = { value: this.value };
      /**
       * Fired when the component's becomes clean.
       *
       * @event clean
       */
      this.dispatchEvent(
        this.cleanEvent = new CustomEvent('clean', {
          bubbles: true,
          cancelable: false,
          detail
        })
      );

      if (this.onclean instanceof HtmlCallback) {
        (this.onclean as HtmlCallback).run({} as Event);
      } else if (this.onclean instanceof Function) {
        this.onclean();
      }
    }
  }

  //#endregion

}

Ch5Toggle.registerCustomElement();
Ch5Toggle.registerSignalAttributeTypes();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as dragDropTouch from "drag-drop-touch";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5VideoSwitcherSourceListPosition, TCh5VideoSwitcherScreenAspectRatio, TCh5VideoSwitcherContractSourceLabelType, TCh5VideoSwitcherContractScreenLabelType, } from './interfaces/t-ch5-video-switcher';
import { ICh5VideoSwitcherAttributes } from './interfaces/i-ch5-video-switcher-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import _ from "lodash";

export class Ch5VideoSwitcher extends Ch5Common implements ICh5VideoSwitcherAttributes {

  //#region Variables

  public static readonly SOURCE_LIST_POSITION: TCh5VideoSwitcherSourceListPosition[] = ['top', 'left', 'right', 'bottom'];
  public static readonly SCREEN_ASPECT_RATIO: TCh5VideoSwitcherScreenAspectRatio[] = ['stretch', '16-9', '4-3'];
  public static readonly CONTRACT_SOURCE_LABEL_TYPE: TCh5VideoSwitcherContractSourceLabelType[] = ['none', 'textContent', 'innerHTML'];
  public static readonly CONTRACT_SCREEN_LABEL_TYPE: TCh5VideoSwitcherContractScreenLabelType[] = ['none', 'textContent', 'innerHTML'];
  public static readonly COMPONENT_DATA: any = {
    SOURCE_LIST_POSITION: {
      default: Ch5VideoSwitcher.SOURCE_LIST_POSITION[0],
      values: Ch5VideoSwitcher.SOURCE_LIST_POSITION,
      key: 'sourceListPosition',
      attribute: 'sourceListPosition',
      classListPrefix: '--source-list-position-'
    },

    SCREEN_ASPECT_RATIO: {
      default: Ch5VideoSwitcher.SCREEN_ASPECT_RATIO[0],
      values: Ch5VideoSwitcher.SCREEN_ASPECT_RATIO,
      key: 'screenAspectRatio',
      attribute: 'screenAspectRatio',
      classListPrefix: '--screen-aspect-ratio-'
    },

    CONTRACT_SOURCE_LABEL_TYPE: {
      default: Ch5VideoSwitcher.CONTRACT_SOURCE_LABEL_TYPE[0],
      values: Ch5VideoSwitcher.CONTRACT_SOURCE_LABEL_TYPE,
      key: 'contractSourceLabelType',
      attribute: 'contractSourceLabelType',
      classListPrefix: '--contract-source-label-type-'
    },

    CONTRACT_SCREEN_LABEL_TYPE: {
      default: Ch5VideoSwitcher.CONTRACT_SCREEN_LABEL_TYPE[0],
      values: Ch5VideoSwitcher.CONTRACT_SCREEN_LABEL_TYPE,
      key: 'contractScreenLabelType',
      attribute: 'contractScreenLabelType',
      classListPrefix: '--contract-screen-label-type-'
    },
  };

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    sendeventondrop: { direction: "event", numericJoin: 1, contractName: true },
    sendeventonchange: { direction: "event", booleanJoin: 1, contractName: true },
    receivestatesourcechanged: { direction: "state", numericJoin: 1, contractName: true },
    receivestatesourcelabel: { direction: "state", stringJoin: 1, contractName: true },
    receivestatescriptsourcelabelhtml: { direction: "state", stringJoin: 1, contractName: true },
    receivestatescreenlabel: { direction: "state", stringJoin: 1, contractName: true },
    receivestatescriptscreenlabelhtml: { direction: "state", stringJoin: 1, contractName: true },
    receivestatenumberofscreens: { direction: "state", numericJoin: 1, contractName: true },
  };

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5VideoSwitcher.SOURCE_LIST_POSITION[0],
      enumeratedValues: Ch5VideoSwitcher.SOURCE_LIST_POSITION,
      name: "sourceListPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5VideoSwitcher.SOURCE_LIST_POSITION[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "endless",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: 1,
      name: "numberOfSourceListDivisions",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 10,
        conditionalMin: 1,
        conditionalMax: 10,
        conditionalMinValue: 1,
        conditionalMaxValue: 10
      },
      isObservableProperty: true
    },
    {
      default: false,
      name: "scrollbar",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: 5,
      name: "numberOfSources",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 256,
        conditionalMin: 1,
        conditionalMax: 256,
        conditionalMinValue: 1,
        conditionalMaxValue: 256
      },
      isObservableProperty: true
    },
    {
      default: 0,
      name: "numberOfScreenColumns",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 10,
        conditionalMin: 0,
        conditionalMax: 10,
        conditionalMinValue: 0,
        conditionalMaxValue: 10
      },
      isObservableProperty: true
    },
    {
      default: "",
      name: "indexId",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: true,
      name: "displayScreenLabel",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: Ch5VideoSwitcher.SCREEN_ASPECT_RATIO[0],
      enumeratedValues: Ch5VideoSwitcher.SCREEN_ASPECT_RATIO,
      name: "screenAspectRatio",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5VideoSwitcher.SCREEN_ASPECT_RATIO[0],
      isObservableProperty: true,
    },
    {
      default: 2,
      name: "numberOfScreens",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateNumberOfScreens",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 1,
        max: 36,
        conditionalMin: 1,
        conditionalMax: 36,
        conditionalMinValue: 1,
        conditionalMaxValue: 36
      },
      isObservableProperty: true
    },
    {
      default: "fa-solid fa-video",
      name: "sourceIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "sendEventOnDrop",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "sendEventOnChange",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateSourceChanged",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateSourceLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateScriptSourceLabelHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateScreenLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "receiveStateScriptScreenLabelHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateNumberOfScreens",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "contractName",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForEnable",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: Ch5VideoSwitcher.CONTRACT_SOURCE_LABEL_TYPE[0],
      enumeratedValues: Ch5VideoSwitcher.CONTRACT_SOURCE_LABEL_TYPE,
      name: "contractSourceLabelType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5VideoSwitcher.CONTRACT_SOURCE_LABEL_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5VideoSwitcher.CONTRACT_SCREEN_LABEL_TYPE[0],
      enumeratedValues: Ch5VideoSwitcher.CONTRACT_SCREEN_LABEL_TYPE,
      name: "contractScreenLabelType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5VideoSwitcher.CONTRACT_SCREEN_LABEL_TYPE[0],
      isObservableProperty: true,
    },
  ];

  public static readonly ELEMENT_NAME = 'ch5-video-switcher';
  public primaryCssClass = 'ch5-video-switcher';
  public sourceListCssClass = '--source-list';
  public screenListCssClass = '--screen-list';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = '--source-list-scrollbar-';
  public static readonly DISPLAY_SCREEN_LABEL: string = '--screen-list-display-screen-label-';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  public _sourceListContainer: HTMLElement = {} as HTMLElement;
  public _screenListContainer: HTMLElement = {} as HTMLElement;
  private _scrollbarContainer: HTMLElement = {} as HTMLElement;
  private _scrollbar: HTMLElement = {} as HTMLElement;


  private eventHandler: any = { "dragstart": [], "dragend": [] };
  private eventHandlerForsourceOnScreen: any = { "dragstart": [], "dragend": [] };
  private eventHandlerForScreen: any = { "dragover": [], "drop": [], 'dragleave': [] };

  private isDown = false;
  private startX: number = 0;
  private startY: number = 0;
  private scrollListLeft: number = 0;
  private scrollListTop: number = 0;
  private scrollbarDimension: number = 0;
  private sourceWidth: number = 0;
  private sourceHeight: number = 0;
  private signalHolder: any = [];

/*   public debounceCreateSource = this.debounce(() => {
    this.createSource();
  }, 0) */;

  //#endregion

  //#region Getters and Setters

  public set sourceListPosition(value: TCh5VideoSwitcherSourceListPosition) {
    this._ch5Properties.set<TCh5VideoSwitcherSourceListPosition>("sourceListPosition", value, () => {
      this.handleSourceListPosition();
    });
  }
  public get sourceListPosition(): TCh5VideoSwitcherSourceListPosition {
    return this._ch5Properties.get<TCh5VideoSwitcherSourceListPosition>("sourceListPosition");
  }

  public set endless(value: boolean) {
    this._ch5Properties.set<boolean>("endless", value, () => {
      this.handleEndless();
    });
  }
  public get endless(): boolean {
    return this._ch5Properties.get<boolean>("endless");
  }

  public set numberOfSourceListDivisions(value: number) {
    this._ch5Properties.set<number>("numberOfSourceListDivisions", value, () => {
      this.handleNumberOfSourceListDivisions();
    });
  }
  public get numberOfSourceListDivisions(): number {
    return this._ch5Properties.get<number>("numberOfSourceListDivisions");
  }

  public set scrollbar(value: boolean) {
    this._ch5Properties.set<boolean>("scrollbar", value, () => {
      this.handleScrollbar();
    });
  }
  public get scrollbar(): boolean {
    return this._ch5Properties.get<boolean>("scrollbar");
  }

  public set numberOfSources(value: number) {
    this._ch5Properties.set<number>("numberOfSources", value, () => {
      this.handleNumberOfSources();
    });
  }
  public get numberOfSources(): number {
    return this._ch5Properties.get<number>("numberOfSources");
  }

  public set numberOfScreenColumns(value: number) {
    this._ch5Properties.set<number>("numberOfScreenColumns", value, () => {
      this.handleNumberOfScreenColumns();
    });
  }
  public get numberOfScreenColumns(): number {
    return this._ch5Properties.get<number>("numberOfScreenColumns");
  }

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value);
  }
  public get indexId(): string {
    return this._ch5Properties.get<string>("indexId");
  }

  public set displayScreenLabel(value: boolean) {
    this._ch5Properties.set<boolean>("displayScreenLabel", value, () => {
      this.handleDisplayScreenLabel();
    });
  }
  public get displayScreenLabel(): boolean {
    return this._ch5Properties.get<boolean>("displayScreenLabel");
  }

  public set screenAspectRatio(value: TCh5VideoSwitcherScreenAspectRatio) {
    this._ch5Properties.set<TCh5VideoSwitcherScreenAspectRatio>("screenAspectRatio", value, () => {
      this.handleScreenAspectRatio();
    });
  }
  public get screenAspectRatio(): TCh5VideoSwitcherScreenAspectRatio {
    return this._ch5Properties.get<TCh5VideoSwitcherScreenAspectRatio>("screenAspectRatio");
  }

  public set numberOfScreens(value: number) {
    this._ch5Properties.set<number>("numberOfScreens", value, () => {
      this.handleNumberOfScreens();
    });
  }
  public get numberOfScreens(): number {
    return this._ch5Properties.get<number>("numberOfScreens");
  }

  public set sourceIconClass(value: string) {
    this._ch5Properties.set<string>("sourceIconClass", value, () => {
      this.handleSourceIconClass();
    });
  }
  public get sourceIconClass(): string {
    return this._ch5Properties.get<string>("sourceIconClass");
  }

  public set sendEventOnDrop(value: string) {
    this._ch5Properties.set("sendEventOnDrop", value);
  }
  public get sendEventOnDrop(): string {
    return this._ch5Properties.get<string>('sendEventOnDrop');
  }

  public set sendEventOnChange(value: string) {
    this._ch5Properties.set("sendEventOnChange", value);
  }
  public get sendEventOnChange(): string {
    return this._ch5Properties.get<string>('sendEventOnChange');
  }

  public set receiveStateSourceChanged(value: string) {
    this._ch5Properties.set("receiveStateSourceChanged", value, () => {
      this.handleReceiveStateSourceChanged();
    });
  }
  public get receiveStateSourceChanged(): string {
    return this._ch5Properties.get<string>('receiveStateSourceChanged');
  }

  public set receiveStateSourceLabel(value: string) {
    this._ch5Properties.set("receiveStateSourceLabel", value, null, (newValue: string) => {
      console.log(newValue);
      this.handleReceiveStateSourceLabel();
    });
  }
  public get receiveStateSourceLabel(): string {
    return this._ch5Properties.get<string>('receiveStateSourceLabel');
  }

  public set receiveStateScriptSourceLabelHtml(value: string) {
    this._ch5Properties.set("receiveStateScriptSourceLabelHtml", value, null, (newValue: string) => {
      console.log(newValue);
      this.handleReceiveStateScriptSourceLabelHtml();
    });
  }
  public get receiveStateScriptSourceLabelHtml(): string {
    return this._ch5Properties.get<string>('receiveStateScriptSourceLabelHtml');
  }

  public set receiveStateScreenLabel(value: string) {
    this._ch5Properties.set("receiveStateScreenLabel", value, null, (newValue: string) => {
      console.log(newValue);
      this.handleReceiveStateScreenLabel();
    });
  }
  public get receiveStateScreenLabel(): string {
    return this._ch5Properties.get<string>('receiveStateScreenLabel');
  }

  public set receiveStateScriptScreenLabelHtml(value: string) {
    this._ch5Properties.set("receiveStateScriptScreenLabelHtml", value, null, (newValue: string) => {
      console.log(newValue);
      this.handleReceiveStateScriptScreenLabelHtml();
    });
  }
  public get receiveStateScriptScreenLabelHtml(): string {
    return this._ch5Properties.get<string>('receiveStateScriptScreenLabelHtml');
  }

  public set receiveStateNumberOfScreens(value: string) {
    this._ch5Properties.set("receiveStateNumberOfScreens", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("numberOfScreens", newValue, () => {
        this.handleNumberOfScreens();
      });
    });
  }
  public get receiveStateNumberOfScreens(): string {
    return this._ch5Properties.get<string>('receiveStateNumberOfScreens');
  }

  public set contractName(value: string) {
    this._ch5Properties.set<string>("contractName", value, () => {
      this.handleContractName();
    });
  }
  public get contractName(): string {
    return this._ch5Properties.get<string>("contractName");
  }

  public set useContractForEnable(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForEnable", value, () => {
      this.handleUseContractForEnable();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForShow", value, () => {
      this.handleUseContractForShow();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForShow");
  }

  public set contractSourceLabelType(value: TCh5VideoSwitcherContractSourceLabelType) {
    this._ch5Properties.set<TCh5VideoSwitcherContractSourceLabelType>("contractSourceLabelType", value, () => {
      this.handleContractSourceLabelType();
    });
  }
  public get contractSourceLabelType(): TCh5VideoSwitcherContractSourceLabelType {
    return this._ch5Properties.get<TCh5VideoSwitcherContractSourceLabelType>("contractSourceLabelType");
  }

  public set contractScreenLabelType(value: TCh5VideoSwitcherContractScreenLabelType) {
    this._ch5Properties.set<TCh5VideoSwitcherContractScreenLabelType>("contractScreenLabelType", value, () => {
      this.handleContractScreenLabelType();
    });
  }
  public get contractScreenLabelType(): TCh5VideoSwitcherContractScreenLabelType {
    return this._ch5Properties.get<TCh5VideoSwitcherContractScreenLabelType>("contractScreenLabelType");
  }

  //#endregion

  //#region Static Methods

  public static registerSignalAttributeTypes() {
    Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5VideoSwitcher.ELEMENT_NAME, Ch5VideoSwitcher.SIGNAL_ATTRIBUTE_TYPES);
  }

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5VideoSwitcher.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5VideoSwitcher.ELEMENT_NAME, Ch5VideoSwitcher);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5VideoSwitcher.ELEMENT_NAME);
    this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "sendeventonshow",];
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5VideoSwitcher.COMPONENT_PROPERTIES);
    this.updateCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5VideoSwitcher.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5VideoSwitcher.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5VideoSwitcher.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-video-switcher attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5VideoSwitcher.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5VideoSwitcher component is first connected to the DOM
   */
  public connectedCallback() {
    // console.log(dragDropTouch);
    this.logger.start('connectedCallback()', Ch5VideoSwitcher.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcher);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    const sourceChild = this.getElementsByTagName(this.nodeName.toLowerCase() + "-source");
    Array.from(sourceChild).forEach((element, index) => {
      element.setAttribute('id', this.getCrId() + '-' + index);
    });
    const screenChild = this.getElementsByTagName(this.nodeName.toLowerCase() + "-screen");
    Array.from(screenChild).forEach((element, index) => {
      element.setAttribute('id', this.getCrId() + '-' + index);
    });
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.handleNumberOfSources();
    this.handleNumberOfScreens();
    customElements.whenDefined('ch5-video-switcher').then(() => {
      this.componentLoadedEvent(Ch5VideoSwitcher.ELEMENT_NAME, this.id);
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
    this._sourceListContainer = document.createElement('div');
    this._screenListContainer = document.createElement('div');

    this._scrollbarContainer = document.createElement('div');
    this._scrollbar = document.createElement('div');

    this._screenListContainer.classList.add(this.primaryCssClass + this.screenListCssClass);
    this._sourceListContainer.classList.add(this.primaryCssClass + this.sourceListCssClass);
    this._elContainer.appendChild(this._sourceListContainer);
    this._elContainer.appendChild(this._screenListContainer);

    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5VideoSwitcher.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5VideoSwitcher.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5VideoSwitcher.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5VideoSwitcher.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._sourceListContainer.addEventListener('mousedown', this.handleMouseDown);
    this._sourceListContainer.addEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._sourceListContainer.addEventListener('mouseup', this.handleMouseUpAndLeave);
    this._sourceListContainer.addEventListener('mousemove', this.handleMouseMove);
    this._sourceListContainer.addEventListener('scroll', this.handleScrollEvent);

  }

  private handleMouseDown = (e: MouseEvent) => {
    this.isDown = true;
    this._sourceListContainer.classList.add('active');
    this.startX = e.pageX - this._sourceListContainer.offsetLeft;
    this.startY = e.pageY - this._sourceListContainer.offsetTop;
    this.scrollListLeft = this._sourceListContainer.scrollLeft;
    this.scrollListTop = this._sourceListContainer.scrollTop;
  }

  private handleMouseUpAndLeave = () => {
    this.isDown = false;
    this._sourceListContainer.classList.remove('active');
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this._sourceListContainer.offsetLeft;
    const y = e.pageY - this._sourceListContainer.offsetTop;
    const walkX = (x - this.startX) * 3;
    const walkY = (y - this.startY) * 3;
    this._sourceListContainer.scrollLeft = this.scrollListLeft - walkX;
    this._sourceListContainer.scrollTop = this.scrollListTop - walkY;
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    Array.from(this._sourceListContainer.children).forEach((source, i) => {
      source.removeEventListener("dragstart", this.eventHandler.dragstart[i]);
      source.removeEventListener("dragend", this.eventHandler.dragend[i]);
    });

    Array.from(this._screenListContainer.children).forEach((screen, i) => {
      screen.removeEventListener("dragover", this.eventHandlerForScreen.dragover[i]);
      screen.removeEventListener("drop", this.eventHandlerForScreen.drop[i]);
      screen.removeEventListener("dragleave", this.eventHandlerForScreen.dragleave[i]);
    });

    Array.from(this._screenListContainer.children).forEach((screen, i) => {
      Array.from(screen.children).forEach((source) => {
        source.removeEventListener("dragstart", this.eventHandlerForsourceOnScreen.dragstart[i]);
        // source.removeEventListener("dragend", this.eventHandlerForsourceOnScreen.dragend[i]);
      })
    });

    this._sourceListContainer.removeEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._sourceListContainer.removeEventListener('mouseup', this.handleMouseUpAndLeave);
    this._sourceListContainer.removeEventListener('mousedown', this.handleMouseDown);
    this._sourceListContainer.removeEventListener('mousemove', this.handleMouseMove);
    this._sourceListContainer.removeEventListener('scroll', this.handleScrollEvent);
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

  private checkInternalHTML() {
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add('ch5-video-switcher');
      this.appendChild(this._elContainer);
    }
    if (this._scrollbar.parentElement !== this._scrollbarContainer) {
      this._scrollbar.classList.add('scrollbar');
      this._scrollbarContainer.appendChild(this._scrollbar);
    }
    if (this._scrollbarContainer.parentElement !== this._elContainer) {
      this._scrollbarContainer.classList.add('scrollbar-container');
      this._elContainer.appendChild(this._scrollbarContainer);
    }
  }

  private handleSourceListPosition() {
    Array.from(Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + this.sourceListPosition);
  }
  private handleEndless() {
    if (this.endless) { this.endless = this.numberOfSourceListDivisions === 1; }
    if (this.endless && this.scrollbar === true) { this.scrollbar = false; }
  }
  private handleNumberOfSourceListDivisions() {
    this.createSource();
  }
  private handleScrollbar() {
    if (this.endless === true && this.scrollbar === true) { this.scrollbar = false; }
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this.initScrollbar();
  }
  private handleNumberOfSources() {
    this.createSource();
  }
  private handleNumberOfScreenColumns() {
    // Enter your Code here
  }
  private handleDisplayScreenLabel() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.DISPLAY_SCREEN_LABEL + bool.toString());
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.DISPLAY_SCREEN_LABEL + this.displayScreenLabel);
  }
  private handleScreenAspectRatio() {
    Array.from(Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.values).forEach((e: any) => {
      this._screenListContainer.classList.remove(this.primaryCssClass + this.screenListCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + e);
    });
    this._screenListContainer.classList.add(this.primaryCssClass + this.screenListCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + this.screenAspectRatio);
  }
  private handleNumberOfScreens() {
    this.createScreen();
  }
  private handleSourceIconClass() {
    this.createSource();
  }
  private handleSendEventOnDrop(signalName: string, signalValue: number) {
    //console.log('signalName', signalName, 'signalValue', signalValue)
    if(this.sendEventOnDrop){
      const sigName = this.replaceAll(this.sendEventOnDrop.trim(), `{{${this.indexId}}}`, signalName);
      Ch5SignalFactory.getInstance().getNumberSignal(sigName)?.publish(signalValue as number);
    }
    if(this.sendEventOnChange){
      this.handleSendEventOnChange(signalName);
    }
  }
  private handleSendEventOnChange(signalName: string) {
    const sigName = this.replaceAll(this.sendEventOnChange.trim(), `{{${this.indexId}}}`, signalName);
    Ch5SignalFactory.getInstance().getBooleanSignal(sigName)?.publish(true);
    Ch5SignalFactory.getInstance().getBooleanSignal(sigName)?.publish(false);
  }

  private handleReceiveStateSourceChanged() {
    this.signalHolder.forEach((obj: any) => {
      this.clearOldSubscriptionNumber(obj.signalValue, obj.signalState);
    });
    console.log('handleReceiveStateSourceChanged');
    const indexId = this.getAttribute('indexid')?.trim() + '' || this.indexId;
    for (let i = 0; i < 36; i++) {
      const screen = this.receiveStateSourceChanged.replace(`{{${indexId}}}`, (i + 1).toString());
      this.signalHolder.push(
        { signalState: "", signalValue: screen, value: null },
      );
      if (screen) {
        const screenSignalResponse = this.setSignalByNumber(screen);
        if (!_.isNil(screenSignalResponse)) {
          this.signalHolder[i].signalState = screenSignalResponse.subscribe((newValue: number) => {
            this.signalHolder[i].value = newValue;
            console.log('source-', newValue, 'screen-', i);
          });
        }
      }
    }
  }

  private clearOldSubscriptionNumber(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveStateSigName);

    if (oldSignal !== null) {
      oldSignal.unsubscribe(signalState as string);
    }
  }

  public setSignalByNumber(value: string): Ch5Signal<number> | null {
    // setup new subscription.
    const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(value);
    const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveLabelSigName);

    if (receiveSignal === null) {
      return null;
    }
    return receiveSignal;
  }

  private handleReceiveStateSourceLabel() {
    // Enter your Code here
  }
  private handleReceiveStateScriptSourceLabelHtml() {
    // Enter your Code here
  }
  private handleReceiveStateScreenLabel() {
    // Enter your Code here
  }
  private handleReceiveStateScriptScreenLabelHtml() {
    // Enter your Code here
  }
  private handleContractName() {
    // Enter your Code here
  }
  private handleUseContractForEnable() {
    // Enter your Code here
  }
  private handleUseContractForShow() {
    // Enter your Code here
  }

  private handleScrollEvent = () => {
    this.initScrollbar();
    if (this.endless) {
      this.sourceWidth = this._elContainer.children[0].getBoundingClientRect().width;
      this.sourceHeight = this._elContainer.children[0].getBoundingClientRect().height;
      return this.endlessHelper();
    }
  }

  private endlessHelper() {
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._sourceListContainer;
    const endlessScrollable = (this.sourceListPosition === 'top' || this.sourceListPosition === "bottom") ? offsetWidth + this.sourceWidth < scrollWidth : offsetHeight + this.sourceHeight < scrollHeight;
    if (endlessScrollable === false) { return; }
    if (this.sourceListPosition === 'top' || this.sourceListPosition === 'bottom') {
      if (scrollLeft < this.sourceWidth / 2) {
        this._sourceListContainer.appendChild(this._sourceListContainer.firstElementChild as Element)
        this._sourceListContainer.scrollLeft += this.sourceWidth;
      } else if (scrollLeft + offsetWidth > scrollWidth - this.sourceWidth / 2) {
        this._sourceListContainer.prepend(this._sourceListContainer.lastElementChild as Element)
        this._sourceListContainer.scrollLeft -= this.sourceWidth;
      }
      console.log(scrollTop);
    } else {
      if (scrollTop < this.sourceHeight / 2) {
        this._sourceListContainer.prepend(this._sourceListContainer.lastElementChild as Element)
        this._sourceListContainer.scrollTop -= this.sourceHeight;
      } else if (scrollTop + offsetHeight > scrollHeight - this.sourceHeight / 2) {
        this._sourceListContainer.appendChild(this._sourceListContainer.firstElementChild as Element)
        this._sourceListContainer.scrollTop += this.sourceHeight;
      }
    }
  }

  private initScrollbar() {
    if (this.sourceListPosition === "top" && this.dir === 'rtl') {
      const { scrollWidth, offsetWidth, scrollLeft } = this._sourceListContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(Math.abs(scrollLeft) / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = (100 - this.scrollbarDimension) - scrollbarLeft + '%';
    } else if (this.sourceListPosition === "top") {
      const { scrollWidth: scrollWidth, offsetWidth: offsetWidth, scrollLeft: scrollLeft } = this._sourceListContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(scrollLeft / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = scrollbarLeft + '%';
    } else {
      const { scrollHeight: scrollHeight, offsetHeight: offsetHeight, scrollTop: scrollTop } = this._sourceListContainer;
      this.scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      const scrollbarTop = Math.ceil(scrollTop / scrollHeight * 100);
      this._scrollbar.style.removeProperty('width');
      this._scrollbar.style.removeProperty('left');
      this._scrollbar.style.height = this.scrollbarDimension + '%';
      this._scrollbar.style.top = scrollbarTop + '%';
    }

    if (this.scrollbar) {
      if (this.scrollbarDimension === 100) {
        this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + 'true');
        this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      } else {
        this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + 'false');
        this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + 'true');
      }
    }
  }
  private handleContractSourceLabelType() {
    Array.from(Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.classListPrefix + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.classListPrefix + this.contractSourceLabelType);
  }
  private handleContractScreenLabelType() {
    Array.from(Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.values).forEach((e: any) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.classListPrefix + e);
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.classListPrefix + this.contractScreenLabelType);
  }

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._elContainer.classList.add(this.primaryCssClass);
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + this.sourceListPosition);
    this._screenListContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + this.screenAspectRatio);
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.DISPLAY_SCREEN_LABEL + this.displayScreenLabel);
    /*   this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.classListPrefix + this.contractSourceLabelType);
     this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.classListPrefix + this.contractScreenLabelType); */
    this.logger.stop();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  private createSource() {
    Array.from(this._sourceListContainer.querySelectorAll(".source-container")).forEach((childEle) => childEle.remove());
    for (let i = 0; i < this.numberOfSources; i++) {
      const source = document.createElement("div");
      source.setAttribute('sourceId', (i + 1) + '');
      const sourceIcon = document.createElement('i');
      const label = document.createElement('label');

      source.setAttribute('draggable', 'true');
      source.classList.add('source-container');
      source.classList.add('draggable');
      source.classList.add(this.primaryCssClass + this.sourceListCssClass + '-label-center');

      sourceIcon.classList.add('source-icon');
      if (this.sourceIconClass) {
        this.sourceIconClass.split(' ').forEach((className: string) => {
          className = className.trim();
          if (className !== '') {
            sourceIcon.classList.add(className);
          }
        });
      } else {
        sourceIcon.classList.add('fa-solid');
        sourceIcon.classList.add('fa-video');
      }
      label.innerText = 'Source' + i;
      label.classList.add(this.primaryCssClass + this.sourceListCssClass + '-label');
      if (this.sourceListPosition === 'top' || this.sourceListPosition === 'bottom') {
        source.style.setProperty('height', 'calc(calc(100% /' + this.numberOfSourceListDivisions + ') - 20px)');
      } else {
        source.style.setProperty('width', 'calc(calc(100% /' + this.numberOfSourceListDivisions + ') - 20px)');
      }

      source.appendChild(sourceIcon);
      source.appendChild(label);

      this._sourceListContainer.appendChild(source);
      this.eventHandler.dragstart.push(this.handleDragStartSource.bind(this, i));
      this.eventHandler.dragend.push(this.handleDragEndSource.bind(this, i));

      source.addEventListener('dragstart', this.eventHandler.dragstart[i]);
      source.addEventListener('dragend', this.eventHandler.dragend[i])
      // this.sourceChildHelper(i, sourceIcon);
    }
    this.initScrollbar();
  }

  private sourceChildHelper(index: number, sourceIcon: HTMLElement) {
    console.log(sourceIcon);
    const sourceChild = this.getElementsByTagName(this.nodeName.toLowerCase() + "-source");
    console.log(sourceChild, index);
    /*  Array.from(sourceChild).forEach((element, index) => {
       element.setAttribute('id', index+"");
     }); */

    /*  Ch5VideoSwitcher.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
       if (index < sourceChild.length) {
         if (attr.name.toLowerCase() === 'sourceiconclass') {
           if (sourceChild[index] && sourceChild[index].hasAttribute('iconClass')) {
             const attrValue = sourceChild[index].getAttribute('iconClass')?.trim();
             if (attrValue) {
               //this.setAttribute('sourceIconClass', attrValue);
               this.sourceIconClass.split(' ').forEach((className: string) => {
                 className = className.trim();
                 if (className !== '') {
                   sourceIcon.classList.add(className);
                 }
               });
             }
           }
         }
       } else {
         if (this.sourceIconClass) {
           this.sourceIconClass.split(' ').forEach((className: string) => {
             className = className.trim();
             if (className !== '') {
               sourceIcon.classList.add(className);
             }
           });
         } else {
           sourceIcon.classList.add('fa-solid');
           sourceIcon.classList.add('fa-video');
         }
       }
     }) */

  }

  private createScreen() {
    Array.from(this._screenListContainer.querySelectorAll(".screen-container")).forEach((childEle) => childEle.remove());
    /* const screenListArea = this._screenListContainer.getBoundingClientRect();
    const possibleCol = screenListArea.width / 100;
    const possibleRow = (screenListArea.height - 20) / 80;
    let finalCol;
  
    if (possibleCol > this.numberOfScreenColumns) {
      finalCol = this.numberOfScreenColumns;
      this._screenListContainer.style.setProperty('grid-template-columns', 'repeat(' + this.numberOfScreenColumns + ',minmax(80px, 1fr))');
    } else {
      finalCol = Math.floor(possibleCol);
      this._screenListContainer.style.setProperty('grid-template-columns', 'repeat(' + Math.floor(possibleCol) + ', minmax(80px, 1fr))');
    }
  
    const requiredRows = this.numberOfScreens / Math.floor(finalCol);
  
    if (Math.floor(possibleRow) <= Math.ceil(requiredRows)) {
      this._screenListContainer.style.setProperty('grid-template-rows', 'repeat(' + Math.floor(possibleRow) + ', minmax(60px, 1fr) )');
    } else {
      this._screenListContainer.style.setProperty('grid-template-rows', 'repeat(' + Math.ceil(requiredRows) + ', minmax(60px, 1fr) )');
    }
  
    const screen_Final = this.numberOfScreens < finalCol * Math.floor(possibleRow) ? this.numberOfScreens : finalCol * Math.floor(possibleRow); */


    for (let i = 0; i < this.numberOfScreens; i++) {
      const screen = document.createElement("div");
      const label = document.createElement('label');
      screen.setAttribute('screenId', (i + 1) + '');
      label.innerText = 'Screen' + i;
      screen.appendChild(label);
      screen.setAttribute('screenId', (i + 1) + '');
      screen.classList.add('screen-container');
      screen.classList.add('screen-number-' + i);
      label.classList.add(this.primaryCssClass + this.screenListCssClass + '-label');
      screen.classList.add(this.primaryCssClass + this.screenListCssClass + '-label-center');

      /* if (this.screenAspectRatio === 'stretch') {
        screen.style.minHeight = '100%';
        screen.style.minWidth = '100%';
      } */

      this._screenListContainer.appendChild(screen);

      this.eventHandlerForScreen.dragover.push(this.handleDragoverScreen.bind(this, i));
      this.eventHandlerForScreen.drop.push(this.handleDropScreen.bind(this, i));
      this.eventHandlerForScreen.dragleave.push(this.handleDragleaveScreen.bind(this, i));

      screen.addEventListener('dragover', this.eventHandlerForScreen.dragover[i]);
      screen.addEventListener('drop', this.eventHandlerForScreen.drop[i])
      screen.addEventListener('dragleave', this.eventHandlerForScreen.dragleave[i]);
    }
  }

  private handleDragStartSource(srcNumber: number) {
    this._sourceListContainer.children[srcNumber].classList.add('dragging');
  }

  private handleDragEndSource(srcNumber: number) {
    this._sourceListContainer.children[srcNumber].classList.remove('dragging');
  }

  private handleDragoverScreen(scrNumber: number, event: any) {
    event.preventDefault();
  }

  private handleDropScreen(scrNumber: number, event: Event) {
    const draggedElement = document.querySelector(".dragging") as HTMLElement;
    let backup: any;
    if (Array.from(draggedElement?.classList).includes('source-onscreen')) {
      console.log('source on screen');
      const targetEl = event?.target as HTMLElement;
      if (targetEl.children.length || targetEl.parentElement?.classList.contains('source-onscreen')) {
        if (targetEl.parentElement?.classList.contains('source-onscreen')) {
          console.log('element exist');
          backup = targetEl.parentElement.outerHTML;
        }
        else if (targetEl.classList.contains('screen-container')) {
          console.log('valid drop');
          backup = targetEl.innerHTML;
        } else {
          backup = targetEl.parentElement?.innerHTML;
        }
        // console.log(backup);
        this.addSourceToScreen(draggedElement, this._screenListContainer.children[scrNumber], scrNumber); // add source element from screen to target screen
        this.addbackuptoScreen(backup, draggedElement.parentElement);
      } else {
        this.removeChildren(draggedElement.parentElement); //  remove element from the previous screen
        this.addSourceToScreen(draggedElement, this._screenListContainer.children[scrNumber], scrNumber);
      }
    }
    else {
      this.addSourceToScreen(draggedElement, this._screenListContainer.children[scrNumber], scrNumber);
    }
  }

  private handleDragleaveScreen(scrNumber: number) {
    console.log(scrNumber, 'leave')
    /*     const source_elem = document.querySelectorAll(".source_onscreen");
        source_elem.forEach(s_ele => {
            s_ele.addEventListener("dragend", (e) => {
                if (e.dataTransfer.dropEffect !== 'copy') {
                    e.target.remove();
                }
            });
        }); */
  }

  private addSourceToScreen(ele: any, screen: any, scrNumber: number) {
    const indexId = ele.getAttribute('sourceId');
    const se = document.createElement('div');
    se.innerHTML = ele.innerHTML;
    se.classList.add('draggable');
    se.classList.add('source-onscreen');
    se.setAttribute('draggable', 'true');

    Array.from(screen?.children)?.forEach((item: any) => item?.remove());
    this.eventHandlerForsourceOnScreen.dragstart.push(this.handleDragStartForSourceOnScreen.bind(this, scrNumber));
    this.eventHandlerForsourceOnScreen.dragend.push(this.handleDragEndForSourceOnScreen.bind(this, scrNumber));
    se.addEventListener('dragstart', this.eventHandlerForsourceOnScreen.dragstart[scrNumber]);
    se.addEventListener('dragend', this.eventHandlerForsourceOnScreen.dragend[scrNumber]);

    screen.appendChild(se);
    this.handleSendEventOnDrop(screen.getAttribute('screenId'), indexId);
  }

  private addbackuptoScreen(ele: any, screen: any) {
    Array.from(screen?.children)?.forEach((item: any) => item?.remove());
    screen.innerHTML = ele;
    // to find the parent screen index
    const classIndex = (Array.from(screen.classList)).findIndex((className: any) => {
      return className.startsWith('screen-number-');
    }, 'screen-number-');
    const screenIndex = +screen.classList[classIndex].split('-')[2];

    this.eventHandlerForsourceOnScreen.dragstart.push(this.handleDragStartForSourceOnScreen.bind(this, screenIndex));
    this.eventHandlerForsourceOnScreen.dragend.push(this.handleDragEndForSourceOnScreen.bind(this, screenIndex));
    screen.addEventListener('dragstart', this.eventHandlerForsourceOnScreen.dragstart[screenIndex]);
    screen.addEventListener('dragend', this.eventHandlerForsourceOnScreen.dragend[screenIndex]);
  }

  private handleDragStartForSourceOnScreen(index: number) {
    this._screenListContainer.children[index].children[0].classList.add('dragging');
  }

  private handleDragEndForSourceOnScreen(index: number, event: any) {
    this._screenListContainer.children[index].children[0].classList.remove('dragging');
    // remove element on drop outside screen
    if (event.dataTransfer.dropEffect !== 'copy') {
      event.target.remove();
    }
  }

  // Remove children using  parent element
  private removeChildren(parentElement: any) {
    // parentElement.removeChild(parentElement?.children?.length === 2 ? parentElement?.children[1] : '');
    parentElement.removeChild(parentElement.children[0]);
  }

  private replaceAll(str: string, find: string, replace: string) {
    if (str && String(str).trim() !== "") {
      return String(str).split(find).join(replace);
    } else {
      return str;
    }
  }
  //#endregion

}

Ch5VideoSwitcher.registerCustomElement();
Ch5VideoSwitcher.registerSignalAttributeTypes();

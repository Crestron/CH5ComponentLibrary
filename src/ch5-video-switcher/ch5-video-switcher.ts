import { DragDropTouch } from "./drag-drop-touch"
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5VideoSwitcherSourceListPosition, TCh5VideoSwitcherScreenAspectRatio, TCh5VideoSwitcherContractSourceLabelType, TCh5VideoSwitcherContractScreenLabelType, } from './interfaces/t-ch5-video-switcher';
import { ICh5VideoSwitcherAttributes } from './interfaces/i-ch5-video-switcher-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";
import _ from "lodash";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";
import { Ch5VideoSwitcherScreen } from "./ch5-video-switcher-screen";
import { Ch5VideoSwitcherSource } from "./ch5-video-switcher-source";
export class Ch5VideoSwitcher extends Ch5Common implements ICh5VideoSwitcherAttributes {

  //#region Variables

  public static readonly SOURCE_LIST_POSITION: TCh5VideoSwitcherSourceListPosition[] = ['top', 'left', 'right', 'bottom'];
  public static readonly SCREEN_ASPECT_RATIO: TCh5VideoSwitcherScreenAspectRatio[] = ['stretch', '16:9', '4:3'];
  public static readonly CONTRACT_SOURCE_LABEL_TYPE: TCh5VideoSwitcherContractSourceLabelType[] = ['none', 'textContent', 'innerHTML'];
  public static readonly CONTRACT_SCREEN_LABEL_TYPE: TCh5VideoSwitcherContractScreenLabelType[] = ['none', 'textContent', 'innerHTML'];
  public static readonly DEFAULT_SOURCE_ICON: string = 'fa-solid fa-video';
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
  };

  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    sendeventondrop: { direction: "event", numericJoin: 1, contractName: true },
    sendeventonchange: { direction: "event", booleanJoin: 1, contractName: true },
    receivestatesourcechanged: { direction: "state", numericJoin: 1, contractName: true },
    receivestatesourcelabel: { direction: "state", stringJoin: 1, contractName: true },
    receivestateScriptsourcelabelhtml: { direction: "state", stringJoin: 1, contractName: true },
    receivestatescreenlabel: { direction: "state", stringJoin: 1, contractName: true },
    receiveStatescriptscreenlabelhtml: { direction: "state", stringJoin: 1, contractName: true },
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
      default: Ch5VideoSwitcher.DEFAULT_SOURCE_ICON,
      name: "sourceIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: Ch5VideoSwitcher.DEFAULT_SOURCE_ICON,
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

  private isDown = false;
  private startX: number = 0;
  private startY: number = 0;
  private scrollListLeft: number = 0;
  private scrollListTop: number = 0;
  private scrollbarDimension: number = 0;

  private signalHolder: any = [];
  private signalHolderForSourceLabel: any = {
    receiveStateScriptSourceLabelHtml: [],
    receiveStateSourceLabel: [],
  };
  private signalHolderForScreenLabel: any = {
    receiveStateScriptScreenLabelHtml: [],
    receiveStateScreenLabel: [],
  }
  private signalNameOnContract = {
    contractName: "",
    receiveStateEnable: "",
    receiveStateShow: "",
    receiveStateNumberOfScreens: ""
  }
  private validDropo: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

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
      this.createSource();
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
      this.createScreen();
    });
  }
  public get numberOfScreens(): number {
    return this._ch5Properties.get<number>("numberOfScreens");
  }

  public set sourceIconClass(value: string) {
    this._ch5Properties.set<string>("sourceIconClass", value, () => {
      this.createSource();
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
    this._ch5Properties.set("receiveStateSourceLabel", value, () => {
      this.handleSourceLabel();
    });
  }
  public get receiveStateSourceLabel(): string {
    return this._ch5Properties.get<string>('receiveStateSourceLabel');
  }

  public set receiveStateScriptSourceLabelHtml(value: string) {
    this._ch5Properties.set("receiveStateScriptSourceLabelHtml", value, () => {
      this.handleSourceLabel();
    });
  }
  public get receiveStateScriptSourceLabelHtml(): string {
    return this._ch5Properties.get<string>('receiveStateScriptSourceLabelHtml');
  }

  public set receiveStateScreenLabel(value: string) {
    this._ch5Properties.set("receiveStateScreenLabel", value, () => {
      this.handleScreenLabel();
    });
  }
  public get receiveStateScreenLabel(): string {
    return this._ch5Properties.get<string>('receiveStateScreenLabel');
  }

  public set receiveStateScriptScreenLabelHtml(value: string) {
    this._ch5Properties.set("receiveStateScriptScreenLabelHtml", value, () => {
      this.handleScreenLabel();
    });
  }
  public get receiveStateScriptScreenLabelHtml(): string {
    return this._ch5Properties.get<string>('receiveStateScriptScreenLabelHtml');
  }

  public set receiveStateNumberOfScreens(value: string) {
    this._ch5Properties.set("receiveStateNumberOfScreens", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("numberOfScreens", newValue, () => {
        this.createScreen();
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
      this.contractDefaultHelper();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForShow", value, () => {
      this.contractDefaultHelper();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForShow");
  }

  public set contractSourceLabelType(value: TCh5VideoSwitcherContractSourceLabelType) {
    this._ch5Properties.set<TCh5VideoSwitcherContractSourceLabelType>("contractSourceLabelType", value, () => {
      this.contractDefaultHelper();
    });
  }
  public get contractSourceLabelType(): TCh5VideoSwitcherContractSourceLabelType {
    return this._ch5Properties.get<TCh5VideoSwitcherContractSourceLabelType>("contractSourceLabelType");
  }

  public set contractScreenLabelType(value: TCh5VideoSwitcherContractScreenLabelType) {
    this._ch5Properties.set<TCh5VideoSwitcherContractScreenLabelType>("contractScreenLabelType", value, () => {
      this.contractDefaultHelper();
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
    DragDropTouch.getInstance();
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
    this.logger.start('connectedCallback()', Ch5VideoSwitcher.ELEMENT_NAME);
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcher);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    const sourceChild = this.getElementsByTagName(this.nodeName.toLowerCase() + "-source");
    Array.from(sourceChild).forEach((element, index) => {
      element.setAttribute('id', this.getCrId() + '-source-' + index);
      const labelEle = element.getElementsByTagName(this.nodeName.toLowerCase() + "-source-label");
      if (labelEle.length !== 0) {
        labelEle[0].setAttribute('id', this.getCrId() + '-source-label-' + index);
      }
    });
    const screenChild = this.getElementsByTagName(this.nodeName.toLowerCase() + "-screen");
    Array.from(screenChild).forEach((element, index) => {
      element.setAttribute('id', this.getCrId() + '-screen-' + index);
      const labelEle = element.getElementsByTagName(this.nodeName.toLowerCase() + "-screen-label");
      if (labelEle.length !== 0) {
        labelEle[0].setAttribute('id', this.getCrId() + '-screen-label-' + index);
      }
    });
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.createSource();
    this.createScreen();
    customElements.whenDefined('ch5-video-switcher').then(() => {
      this.componentLoadedEvent(Ch5VideoSwitcher.ELEMENT_NAME, this.id);
    });
    this.logger.stop();
  }

  private contractDefaultHelper() {
    if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
      // useContractForEnable and receiveStateEnable
      if (this.useContractForEnable === true) {
        this.receiveStateEnable = this.contractName + '.Enable';
      } else {
        this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
      }
      // useContractForShow and receiveStateShow
      if (this.useContractForShow === true) {
        this.receiveStateShow = this.contractName + '.Visible';
      } else {
        this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
      }

      this.receiveStateNumberOfScreens = this.contractName + '.NumberOfScreens';
    }
    this.handleSourceLabel();
    this.handleScreenLabel();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.disconnectCommonMutationObserver();
    this.clearSubscriptions();
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
    this.resizeObserver = new ResizeObserver(this.resizeObereverHandler);
    this.resizeObserver.observe(this._elContainer);
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
    const walkX = (x - this.startX) * (this.endless ? 1 : 3);
    const walkY = (y - this.startY) * (this.endless ? 1 : 3);
    this._sourceListContainer.scrollLeft = this.scrollListLeft - walkX;
    this._sourceListContainer.scrollTop = this.scrollListTop - walkY;
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._sourceListContainer.removeEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._sourceListContainer.removeEventListener('mouseup', this.handleMouseUpAndLeave);
    this._sourceListContainer.removeEventListener('mousedown', this.handleMouseDown);
    this._sourceListContainer.removeEventListener('mousemove', this.handleMouseMove);
    this._sourceListContainer.removeEventListener('scroll', this.handleScrollEvent);
    this.resizeObserver?.unobserve(this._elContainer);
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
    this.initScrollbar();
  }

  private handleEndless() {
    if (this.endless) { this.endless = this.numberOfSourceListDivisions === 1; }
    if (this.endless && this.scrollbar === true) { this.scrollbar = false; }
  }

  private handleNumberOfSourceListDivisions() {
    this._sourceListContainer.style.setProperty('--number-of-source-list-divisions', this.numberOfSourceListDivisions + '');
    this.initScrollbar();
  }

  private handleScrollbar() {
    if (this.endless === true && this.scrollbar === true) { this.scrollbar = false; }
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this.initScrollbar();
  }

  private handleDisplayScreenLabel() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.DISPLAY_SCREEN_LABEL + bool.toString());
    });
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.DISPLAY_SCREEN_LABEL + this.displayScreenLabel);
  }

  private handleScreenAspectRatio() {
    Array.from(Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.values).forEach((e: any) => {
      this._screenListContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + e.replace(':', '-'));
    });
    this._screenListContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + this.screenAspectRatio.replace(':', '-'));
    this.handleNumberOfScreenColumns();
  }

  private handleSendEventOnDrop(signalName: string, value: number | any) {
    // console.log('drop--Screen-->', signalName, 'Source-->', (+value) + 1);
    if (this.contractName.trim()) {
      signalName = this.contractName + '.Source' + ((+signalName) + 1) + '_Selection';
      Ch5SignalFactory.getInstance().getNumberSignal(signalName)?.publish((+value + 1) as number);
    } else {
      if (this.sendEventOnDrop) {
        const attrValue = this.replaceAll(this.sendEventOnDrop.trim(), `{{${this.indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        if (isNumber) {
          Ch5SignalFactory.getInstance().getNumberSignal(+attrValue + (+signalName) + '')?.publish((+value + 1) as number);
        } else {
          const sigName = this.replaceAll(this.sendEventOnDrop.trim(), `{{${this.indexId}}}`, signalName);
          Ch5SignalFactory.getInstance().getNumberSignal(sigName)?.publish((+value + 1) as number);
        }
      }
    }
  }

  private handleSendEventOnChange(signalName: string) {
    if (this.contractName.trim()) {
      signalName = this.contractName + '.Screen_' + ((+signalName) + 1) + '_Changed';
      Ch5SignalFactory.getInstance().getBooleanSignal(signalName)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(signalName)?.publish(false);
    } else if (this.sendEventOnChange) {
      const attrValue = this.replaceAll(this.sendEventOnChange.trim(), `{{${this.indexId}}}`, '');
      const isNumber = /^[0-9]+$/.test(attrValue);
      if (isNumber) {
        Ch5SignalFactory.getInstance().getBooleanSignal(+attrValue + (+signalName) + ' ')?.publish(true);
        Ch5SignalFactory.getInstance().getBooleanSignal(+attrValue + (+signalName) + ' ')?.publish(false);
      } else {
        const sigName = this.replaceAll(this.sendEventOnChange.trim(), `{{${this.indexId}}}`, signalName);
        Ch5SignalFactory.getInstance().getBooleanSignal(sigName)?.publish(true);
        Ch5SignalFactory.getInstance().getBooleanSignal(sigName)?.publish(false);
      }
    }
  }

  private handleReceiveStateSourceChanged() {
    this.signalHolder.forEach((obj: any) => {
      this.clearOldSubscriptionNumber(obj.signalValue, obj.signalState);
    });

    if (this.contractName.trim()) {
      for (let i = 0; i < this.numberOfScreens; i++) {
        const screen = this.contractName + `.Source${i + 1}_Feedback`;
        this.signalHolder.push(
          { signalState: "", signalValue: screen, value: null },
        );
        const screenSignalResponse = this.setSignalByNumber(screen);
        if (!_.isNil(screenSignalResponse)) {
          this.signalHolder[i].signalState = screenSignalResponse.subscribe((newValue: number) => {
            this.signalHolder[i].value = newValue;
            // console.log('subscribe State for contract-- > screen-', i + ' source-', newValue);
            this.addSourceToScreenOnFB(i, newValue);
          });
        }
      }
    } else {
      const indexId = this.getAttribute('indexid')?.trim() + '' || this.indexId;
      for (let i = 0; i < this.numberOfScreens; i++) {
        let screen = this.replaceAll(this.receiveStateSourceChanged.trim(), `{{${indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(screen);
        if (isNumber) {
          screen = (+screen + i) + '';
        } else {
          screen = this.replaceAll(this.receiveStateSourceChanged.trim(), `{{${indexId}}}`, i + '');
        }
        this.signalHolder.push(
          { signalState: "", signalValue: screen, value: null },
        );
        if (screen) {
          const screenSignalResponse = this.setSignalByNumber(screen);
          if (!_.isNil(screenSignalResponse)) {
            this.signalHolder[i].signalState = screenSignalResponse.subscribe((newValue: number) => {
              if (this.signalHolder[i]) this.signalHolder[i].value = newValue;
              // console.log('subscribe State -- > screen-', i + ' source-', newValue);
              this.addSourceToScreenOnFB(i, newValue);
            });
          }
        }
      }
    }
  }


  private clearOldSubscriptionNumber(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldReceiveStateSigName);

    if (oldSignal !== null) {
      oldSignal.unsubscribe(signalState as string);
    }
  }

  private clearOldSubscriptionString(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveStateSigName);

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

  private setSignalByString(value: string): Ch5Signal<string> | null {
    // setup new subscription.
    const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(value);
    const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);
    if (receiveSignal === null) {
      return null;
    }
    return receiveSignal;

  }

  private handleSourceLabel() {
    Object.keys(this.signalHolderForSourceLabel).forEach((key: any) => {
      this.signalHolderForSourceLabel[key].forEach((item: any) => {
        this.clearOldSubscriptionString(item.signalValue, item.signalState);
      });
      this.signalHolderForSourceLabel[key] = [];
    });
    const indexId = this.getAttribute('indexid')?.trim() + '' || this.indexId;
    for (let i = 0; i < this.numberOfSources; i++) {
      if (this.contractName.trim() && this.contractSourceLabelType === 'innerHTML') {
        const sigValue = this.contractName + `.Source_${i + 1}_Label`;
        this.getSubscription(this.signalHolderForSourceLabel['receiveStateScriptSourceLabelHtml'], this.sourcelabelHelper, i, sigValue, true);
      } else if (this.contractName.trim() && this.contractSourceLabelType === 'textContent') {
        const sigValue = this.contractName + `.Source_${i + 1}_Label`;
        this.getSubscription(this.signalHolderForSourceLabel['receiveStateSourceLabel'], this.sourcelabelHelper, i, sigValue);
      } else if (this.receiveStateScriptSourceLabelHtml.trim()) {
        const attrValue = this.replaceAll(this.receiveStateScriptSourceLabelHtml.trim(), `{{${indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        if (isNumber) {
          this.getSubscription(this.signalHolderForSourceLabel['receiveStateScriptSourceLabelHtml'], this.sourcelabelHelper, i, (+attrValue) + i + '', true);
        } else {
          const sigValue = this.replaceAll(this.receiveStateScriptSourceLabelHtml.trim(), `{{${indexId}}}`, i + '');
          this.getSubscription(this.signalHolderForSourceLabel['receiveStateScriptSourceLabelHtml'], this.sourcelabelHelper, i, sigValue, true);
        }
      } else if (this.receiveStateSourceLabel.trim()) {
        const attrValue = this.replaceAll(this.receiveStateSourceLabel.trim(), `{{${indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        if (isNumber) {
          this.getSubscription(this.signalHolderForSourceLabel['receiveStateSourceLabel'], this.sourcelabelHelper, i, (+attrValue) + i + '', true);
        } else {
          const sigValue = this.replaceAll(this.receiveStateSourceLabel.trim(), `{{${indexId}}}`, i + '');
          this.getSubscription(this.signalHolderForSourceLabel['receiveStateSourceLabel'], this.sourcelabelHelper, i, sigValue, true);
        }
      } else {
        this.sourceLabelHelperCreate(i);
      }
    }
  }

  private handleScreenLabel() {
    Object.keys(this.signalHolderForScreenLabel).forEach((key: any) => {
      this.signalHolderForScreenLabel[key].forEach((item: any) => {
        this.clearOldSubscriptionString(item.signalValue, item.signalState);
      });
      this.signalHolderForScreenLabel[key] = [];
    });

    const indexId = this.getAttribute('indexid')?.trim() + '' || this.indexId;
    for (let i = 0; i < this.numberOfScreens; i++) {
      if (this.contractName.trim() && this.contractScreenLabelType === 'innerHTML') {
        const sigValue = this.contractName + `.Screen${i + 1}_Label`;
        this.getSubscription(this.signalHolderForScreenLabel['receiveStateScriptScreenLabelHtml'], this.screenlabelHelper, i, sigValue, true);
      } else if (this.contractName.trim() && this.contractScreenLabelType === 'textContent') {
        const sigValue = this.contractName + `.Screen${i + 1}_Label`;
        this.getSubscription(this.signalHolderForScreenLabel['receiveStateScreenLabel'], this.screenlabelHelper, i, sigValue);
      } else if (this.receiveStateScriptScreenLabelHtml.trim()) {
        const attrValue = this.replaceAll(this.receiveStateScriptScreenLabelHtml.trim(), `{{${indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        if (isNumber) {
          this.getSubscription(this.signalHolderForScreenLabel['receiveStateScriptScreenLabelHtml'], this.screenlabelHelper, i, (+attrValue) + i + '', true);
        } else {
          const sigValue = this.replaceAll(this.receiveStateScriptScreenLabelHtml.trim(), `{{${indexId}}}`, i + '');
          this.getSubscription(this.signalHolderForScreenLabel['receiveStateScriptScreenLabelHtml'], this.screenlabelHelper, i, sigValue, true);
        }
      } else if (this.receiveStateScreenLabel.trim()) {
        const attrValue = this.replaceAll(this.receiveStateScreenLabel.trim(), `{{${indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        if (isNumber) {
          this.getSubscription(this.signalHolderForScreenLabel['receiveStateScreenLabel'], this.screenlabelHelper, i, (+attrValue) + i + '', true);
        } else {
          const sigValue = this.replaceAll(this.receiveStateScreenLabel.trim(), `{{${indexId}}}`, i + '');
          this.getSubscription(this.signalHolderForScreenLabel['receiveStateScreenLabel'], this.screenlabelHelper, i, sigValue, true);
        }
      } else {
        this.screenLabelHelperCreate(i);
      }
    }
  }

  private getSubscription(input: any, cb: any, index: number, sigValue: string, innerHTML: boolean = false) {
    input.push({ signalState: "", signalValue: sigValue, value: null });
    const strSignalResponse = this.setSignalByString(sigValue);
    if (!_.isNil(strSignalResponse)) {
      input[index].signalState = strSignalResponse.subscribe((newValue: string) => {
        input[index].value = newValue;
        cb.call(this, newValue, index, innerHTML);
      });
    }
  }

  private sourcelabelHelper(newValue: string, index: number, isInnerHTML: boolean) {
    const spanEl = this._sourceListContainer.querySelector(`[sourceid="${index}"] > span`);
    if (spanEl) {
      isInnerHTML ? spanEl.innerHTML = newValue : spanEl.textContent = newValue;
    }
  }

  private screenlabelHelper(newValue: string, index: number, isInnerHTML: boolean) {
    const spanEl = this._screenListContainer.querySelector(`[screenid="${index}"] > span`);
    if (spanEl) {
      isInnerHTML ? spanEl.innerHTML = newValue : spanEl.textContent = newValue;
    }
  }

  private handleContractName() {
    if (this.contractName.trim().length === 0) {
      this.signalNameOnContract.contractName = "";
      this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
      this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
      this.receiveStateNumberOfScreens = this.signalNameOnContract.receiveStateNumberOfScreens;
    } else if (this.signalNameOnContract.contractName === "") {
      this.signalNameOnContract.contractName = this.contractName;
      this.signalNameOnContract.receiveStateShow = this.receiveStateShow;
      this.signalNameOnContract.receiveStateEnable = this.receiveStateEnable;
      this.signalNameOnContract.receiveStateNumberOfScreens = this.receiveStateNumberOfScreens;
    }
    this.contractDefaultHelper();
  }

  private handleScrollEvent = () => {
    const draggedElement = this.querySelector(".dragging") as HTMLElement;
    if (!draggedElement) {// Scrollbar moves when drag happens
      this.initScrollbar();
      if (this.endless) {
        return this.endlessHelper();
      }
    }
  }

  private endlessHelper() {
    const { offsetWidth, scrollLeft, scrollWidth, offsetHeight, scrollTop, scrollHeight } = this._sourceListContainer;
    const { width: sourceWidth, height: sourceHeight } = this._sourceListContainer.children[0].getBoundingClientRect();

    const isHorizontal = (this.sourceListPosition === 'top' || this.sourceListPosition === 'bottom');
    const endlessScrollable = isHorizontal ? (scrollWidth - offsetWidth) > sourceWidth : (scrollHeight - offsetHeight) > sourceHeight;

    if (endlessScrollable) {
      if (isHorizontal) {
        if (scrollLeft < sourceWidth / 4) {
          const length = this._sourceListContainer.children.length;
          const lastElement = this._sourceListContainer.children[length - 1];
          this._sourceListContainer.prepend(lastElement);
          this._sourceListContainer.scrollLeft += sourceWidth / 2;
        } else if (scrollLeft + offsetWidth > scrollWidth - (sourceWidth / 4)) {
          const firstChild = this._sourceListContainer.children[0];
          this._sourceListContainer.appendChild(firstChild);
          this._sourceListContainer.scrollLeft -= sourceWidth / 2;
        }
      } else {
        if (scrollTop < sourceHeight / 4) {
          const length = this._sourceListContainer.children.length;
          const lastElement = this._sourceListContainer.children[length - 1];
          this._sourceListContainer.prepend(lastElement);
          this._sourceListContainer.scrollTop += sourceHeight / 2;
        } else if (scrollTop + offsetHeight > scrollHeight - (sourceHeight / 4)) {
          const firstChild = this._sourceListContainer.children[0];
          this._sourceListContainer.appendChild(firstChild);
          this._sourceListContainer.scrollTop -= sourceHeight / 2;
        }
      }
    }
  }

  private initScrollbar() {
    if (this.sourceListPosition === "top" || this.sourceListPosition === "bottom") {
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

  private updateCssClass() {
    this.logger.start('UpdateCssClass');
    super.updateCssClasses();
    this._elContainer.classList.add(this.primaryCssClass);
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + this.sourceListPosition);
    this._screenListContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + this.screenAspectRatio.replace(':', '-'));
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.DISPLAY_SCREEN_LABEL + this.displayScreenLabel);
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
      source.setAttribute('sourceId', i + '');
      const sourceIcon = document.createElement('i');
      const label = document.createElement('span');

      source.setAttribute('draggable', 'true');
      source.classList.add('source-container');
      source.classList.add('draggable');
      sourceIcon.classList.add('source-icon');

      label.classList.add(this.primaryCssClass + this.sourceListCssClass + '-label');
      source.appendChild(sourceIcon);
      source.appendChild(label);

      this._sourceListContainer.appendChild(source);
      this.sourceLabelHelperCreate(i);
      this.sourceIconHelperCreate(i, sourceIcon);
      this.sourceAlignLabelHelperCreate(i, source);

      source.addEventListener('dragstart', this.handleDragStartSource.bind(this, i));
      source.addEventListener('dragend', this.handleDragEndSource.bind(this, i))
    }
    if (this.endless) {
      if (this.sourceListPosition === 'top' || this.sourceListPosition === 'bottom') {
        this._sourceListContainer.scrollLeft += 5;
      } else {
        this._sourceListContainer.scrollTop += 5;
      }
    }
    setTimeout(() => {
      this.initScrollbar(); // Initially when the component load scrollbar handle does not appear, fixing this issue by adding timeout
    }, 50);
    this.handleSourceLabel();
  }

  private createScreen() {
    Array.from(this._screenListContainer.querySelectorAll(".screen-container")).forEach((childEle) => childEle.remove());

    for (let i = 0; i < this.numberOfScreens; i++) {
      const screen = document.createElement("div");
      const label = document.createElement('span');
      screen.setAttribute('screenId', i + '');
      screen.appendChild(label);
      screen.classList.add('screen-container');
      label.classList.add(this.primaryCssClass + this.screenListCssClass + '-label');

      this._screenListContainer.appendChild(screen);
      this.screenLabelHelperCreate(i);
      this.screenAlignLabelHelperCreate(i, screen);
      if (this.signalHolder[i] && this.signalHolder[i].value && this.signalHolder[i].value > 0) {
        this.addSourceToScreenOnFB(i, this.signalHolder[i].value);// if value hold on CS
      }
      screen.addEventListener('dragover', this.handleDragoverScreen.bind(this, i));
      screen.addEventListener('drop', this.handleDropScreen.bind(this, i))
    }
    this.handleNumberOfScreenColumns();
    this.handleReceiveStateSourceChanged();
    this.handleScreenLabel();
  }

  private resizeObereverHandler = () => {
    if (this._elContainer.getBoundingClientRect().width === 0) {
      return;
    }
    this.handleNumberOfScreenColumns();
  }

  private handleNumberOfScreenColumns() {
    const possibleCol = (this._screenListContainer.offsetWidth) / 82;
    const possibleRow = (this._screenListContainer.offsetHeight) / 62;
    let requiredRows: number = 1;
    if (this.numberOfScreenColumns > 0) {
      // columns
      this._screenListContainer.style.removeProperty('grid-template-columns');
      this._screenListContainer.style.removeProperty('grid-template-rows');
      if (possibleCol > this.numberOfScreenColumns) {
        requiredRows = this.numberOfScreens / Math.floor(this.numberOfScreenColumns);
        this._screenListContainer.style.setProperty('grid-template-columns', 'repeat(' + this.numberOfScreenColumns + ',minmax(80px, 1fr))');
      } else {
        requiredRows = this.numberOfScreens / Math.floor(possibleCol);
        this._screenListContainer.style.setProperty('grid-template-columns', 'repeat(auto-Fit, minmax(80px, 1fr))');
      }
      // rows
      if (Math.floor(possibleRow) <= Math.ceil(requiredRows)) {
        const eleHeight = Math.max(60, Math.floor((Math.floor(this._screenListContainer.offsetHeight) / Math.floor(possibleRow))));
        this._screenListContainer.style.setProperty('grid-template-rows', 'repeat(' + Math.floor(possibleRow) + ', minmax(' + (eleHeight - 1) + 'px, 1fr) )');
      } else {
        const eleHeight = Math.max(60, Math.floor((Math.floor(this._screenListContainer.offsetHeight) / Math.ceil(requiredRows))));
        this._screenListContainer.style.setProperty('grid-template-rows', 'repeat(' + Math.ceil(requiredRows) + ', minmax(' + (eleHeight - 2) + 'px, 1fr) )');
      }
    } else {
      requiredRows = this.numberOfScreens / Math.floor(possibleCol);
      const eleHeight = Math.max(60, Math.floor((Math.floor(this._screenListContainer.offsetHeight) / Math.floor(possibleRow))));
      // columns
      this._screenListContainer.style.setProperty('grid-template-columns', 'repeat(auto-fit, minmax(80px, 1fr) )');
      // rows
      if (Math.floor(possibleRow) <= Math.ceil(requiredRows)) {
        this._screenListContainer.style.setProperty('grid-template-rows', 'repeat(' + Math.floor(possibleRow) + ', minmax(' + (eleHeight - 1) + 'px, 1fr) )');
      } else if (Math.floor(possibleRow) >= Math.ceil(requiredRows)) {
        this._screenListContainer.style.setProperty('grid-template-rows', 'repeat(' + Math.ceil(requiredRows) + ', minmax(' + (eleHeight) + 'px, 1fr) )');
      } else {
        this._screenListContainer.style.setProperty('grid-template-rows', '1fr');
      }
    }
    for (let i = 0; i < this.numberOfScreens; i++) {
      const screen = this._screenListContainer.querySelector(`[screenid="${i}"]`) as HTMLElement;
      if (!screen) {
        continue;
      }
      const eleHeight = Math.max(60, Math.floor((Math.floor(this._screenListContainer.offsetHeight) / Math.floor(possibleRow))));
      this._screenListContainer.style.removeProperty('width');
      this._screenListContainer.style.removeProperty('height');
      if (this.numberOfScreenColumns > 0) {
        if (this.screenAspectRatio === '16:9') {
          if (this.numberOfScreens === 1) {
            screen.style.width = Math.max(80, Math.floor((Math.floor(this._screenListContainer.offsetHeight) / this.numberOfScreenColumns))) + 'px';
          } else if (this.numberOfScreenColumns > Math.floor(possibleCol)) {
            screen.style.width = '80px';
          } else {
            screen.style.width = eleHeight + 'px';
          }
        } else {
          if (this.numberOfScreens === 1) {
            screen.style.width = (Math.max(60, Math.floor((Math.floor(this._screenListContainer.offsetHeight) / this.numberOfScreenColumns))) - 2) + 'px';
          } else if (this.numberOfScreenColumns >= Math.floor(possibleCol)) {
            screen.style.width = '80px';
          } else {
            screen.style.height = (eleHeight - 2) + 'px';
          }
        }
      } else {
        if (this.numberOfScreens === 1) {
          if ((this.screenAspectRatio === "4:3" || this.screenAspectRatio === "16:9") && (this.sourceListPosition === 'left' || this.sourceListPosition === 'right')) {
            screen.style.width = (this._screenListContainer.offsetWidth - 2) + 'px';
          } else {
            screen.style.height = (this._screenListContainer.offsetHeight - 2) + 'px';
          }
        } else if (this.screenAspectRatio === "4:3" && this.sourceListPosition === 'left' || this.sourceListPosition === 'right') { // edge case when listposion is on left or right
          screen.style.height = (eleHeight - 2) + 'px';
        }
      }
    }
  }

  public screenLabelHelperCreate(index: number, labelInnerHTML: string = '') {
    if (!this._screenListContainer.children[index]) { return; }
    const labelEl = this.querySelector(`#${this.getCrId()}-screen-label-${index}`);
    const content = labelEl ? labelEl.children[0] as HTMLTemplateElement : null;

    const screen = this.querySelector(`#${this.getCrId()}-screen-${index}`) as Ch5VideoSwitcherScreen;
    labelInnerHTML = screen ? screen.labelInnerHTML : labelInnerHTML;

    if (this.contractName.trim() && this.contractScreenLabelType === 'innerHTML') {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForScreenLabel.receiveStateScriptScreenLabelHtml[index]?.value;
    } else if (this.contractName.trim() && this.contractScreenLabelType === 'textContent') {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForScreenLabel.receiveStateScreenLabel[index]?.value;
    } else if (this.hasAttribute('receiveStateScriptscreenlabelhtml') && this.receiveStateScriptScreenLabelHtml) {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForScreenLabel.receiveStateScriptScreenLabelHtml[index]?.value;
    } else if (this.hasAttribute('receiveStateScreenLabel') && this.receiveStateScreenLabel) {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForScreenLabel.receiveStateScreenLabel[index]?.value;
    } else if (content) {
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(content, index, this.indexId);
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(content, index, this.indexId);
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = content.innerHTML;
    } else if (labelInnerHTML) {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = labelInnerHTML;
    }
  }

  public sourceLabelHelperCreate(index: number, labelInnerHTML: string = '',) {
    if (!this._sourceListContainer.children[index]) { return; }
    const labelEl = this.querySelector(`#${this.getCrId()}-source-label-${index}`);
    const content = labelEl ? labelEl.children[0] as HTMLTemplateElement : null;

    const screen = this.querySelector(`#${this.getCrId()}-source-${index}`) as Ch5VideoSwitcherSource;
    labelInnerHTML = screen ? screen.labelInnerHTML : labelInnerHTML;

    if (this.contractName.trim() && this.contractSourceLabelType === 'innerHTML') {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForSourceLabel.receiveStateScriptSourceLabelHtml[index]?.value;
    } else if (this.contractName.trim() && this.contractSourceLabelType === 'textContent') {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForSourceLabel.receiveStateSourceLabel[index]?.value;
    } else if (this.hasAttribute('receiveStateScriptSourceLabelHtml') && this.receiveStateScriptSourceLabelHtml) {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForSourceLabel.receiveStateScriptSourceLabelHtml[index]?.value;
    } else if (this.hasAttribute('receiveStateSourceLabel') && this.receiveStateSourceLabel) {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForSourceLabel.receiveStateSourceLabel[index]?.value;
    } else if (content) {
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(content, index, this.indexId);
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(content, index, this.indexId);
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = content.innerHTML;
    } else if (labelInnerHTML) {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = labelInnerHTML;
    }
  }

  private sourceIconHelperCreate(index: number, sourceIcon: HTMLElement) {
    const source = this.querySelector(`#${this.getCrId()}-source-${index}`) as Ch5VideoSwitcherSource;
    const iconClass = source && source.iconClass ? source.iconClass : this.sourceIconClass ? this.sourceIconClass : Ch5VideoSwitcher.DEFAULT_SOURCE_ICON
    iconClass.split(' ').forEach((className: string) => {
      className = className.trim();
      if (className !== '') {
        sourceIcon.classList.add(className);
      }
    });
  }

  private sourceAlignLabelHelperCreate(index: number, sourceEl: HTMLElement) {
    const alignLabelClassPrefix = this.primaryCssClass + '--source-list-label-'
    const sourceAlignLabel = ['center', 'left', 'right'];
    Array.from(sourceAlignLabel).forEach((alignLabel) => {
      sourceEl.classList.remove(alignLabelClassPrefix + alignLabel);
    })
    const source = this.querySelector(`#${this.getCrId()}-source-${index}`) as Ch5VideoSwitcherSource;
    if (source && source.alignLabel) {
      sourceEl.classList.add(alignLabelClassPrefix + source.alignLabel);
    } else {
      sourceEl.classList.add(alignLabelClassPrefix + sourceAlignLabel[0]);
    }
  }

  private screenAlignLabelHelperCreate(index: number, screenEl: HTMLElement) {
    const alignLabelClassPrefix = this.primaryCssClass + '--screen-list-label-'
    const screenAlignLabel = ['center', 'left', 'right'];
    Array.from(screenAlignLabel).forEach((alignLabel) => {
      screenEl.classList.remove(alignLabelClassPrefix + alignLabel);
    })
    const screen = this.querySelector(`#${this.getCrId()}-screen-${index}`) as Ch5VideoSwitcherScreen;
    if (screen && screen.alignLabel) {
      screenEl.classList.add(alignLabelClassPrefix + screen.alignLabel);
    } else {
      screenEl.classList.add(alignLabelClassPrefix + screenAlignLabel[0]);
    }
  }

  private handleDragStartSource(srcNumber: number) {
    const source = this._sourceListContainer.querySelector(`[sourceid="${srcNumber}"]`)
    source?.classList.add('dragging');
  }

  private handleDragEndSource(srcNumber: number) {
    const source = this._sourceListContainer.querySelector(`[sourceid="${srcNumber}"]`)
    source?.classList.remove('dragging');
  }

  private handleDragoverScreen(scrNumber: number, event: any) {
    event.preventDefault();
  }

  private handleDropScreen(scrNumber: number) {
    this.validDropo = true;
    const draggedElement = this.querySelector(".dragging") as HTMLElement;
    if (draggedElement && draggedElement.classList.contains('source-onscreen')) { // Move source from screen to screen
      const screenEl = this.querySelector(`[screenid="${scrNumber}"]`) as HTMLElement;
      const existingSource = screenEl.children.length === 2 ? Number(screenEl.children[1].getAttribute('sourceId')) : -1;
      this.handleSendEventOnDrop(draggedElement.parentElement?.getAttribute('screenid') + '', existingSource);
      this.handleSendEventOnDrop(scrNumber + '', draggedElement.getAttribute('sourceId'));
      this.handleSendEventOnChange(scrNumber + '');
      this.handleSendEventOnChange(draggedElement.parentElement?.getAttribute('screenid') + '');
    } else {// Move source from sourcelist  to screen
      if (this.sendEventOnChange) {
        this.handleSendEventOnChange(scrNumber + 1 + '');
      }
      if (draggedElement && draggedElement.getAttribute('sourceId') && this.sendEventOnDrop) {
        this.handleSendEventOnDrop(scrNumber + '', draggedElement.getAttribute('sourceId'));
      }
      if (!this.receiveStateSourceChanged) {
        this.addSourceToScreen(draggedElement, this._screenListContainer.children[scrNumber] as HTMLElement, scrNumber, false);
      }
    }
  }

  private addSourceToScreenOnFB(scrNumber: number, sourceId: number) {
    const sourceEle = this._sourceListContainer.querySelector(`[sourceid="${sourceId - 1}"]`);
    const screenEle = this._screenListContainer.querySelector(`[screenid="${scrNumber}"]`) as HTMLElement;
    if (sourceId === 0) { // remove elements from the screen
      if (screenEle?.children.length === 2) {
        screenEle?.removeChild(screenEle?.children[1]);
      }
    }
    if (sourceEle && screenEle) {
      this.addSourceToScreen(sourceEle, screenEle, scrNumber, true);
    }
  }

  private addSourceToScreen(ele: Element, screen: HTMLElement, scrNumber: number, drop: boolean) {
    const se = document.createElement('div');
    se.innerHTML = ele?.innerHTML;
    se.classList.add('draggable');
    se.classList.add('source-onscreen');
    se.setAttribute('draggable', 'true');
    if (ele && ele?.getAttribute('sourceid')) {
      se.setAttribute('sourceId', ele?.getAttribute('sourceid') + '');
    }
    se.style.height = screen.offsetHeight * 0.4 + 'px';
    se.style.width = screen.offsetHeight * 0.4 + 'px';
    if (screen?.children.length === 2) {
      screen?.removeChild(screen?.children[1]);
    }
    if (drop) {
      se.addEventListener('dragstart', this.handleDragStartForSourceOnScreen.bind(this, scrNumber));
      se.addEventListener('dragend', this.handleDragEndForSourceOnScreen.bind(this, scrNumber));
      screen.appendChild(se);
    } else {
      screen.appendChild(se);
      setTimeout(() => {
        if (screen?.children.length === 2) {
          screen?.removeChild(screen?.children[1]);
        }
      }, 1500);
    }
  }

  private handleDragStartForSourceOnScreen(index: number) {
    this.validDropo = false;
    this._screenListContainer.children[index].children[1].classList.add('dragging');
  }

  private handleDragEndForSourceOnScreen(index: number, event: any) {
    this._screenListContainer.children[index]?.children[1]?.classList?.remove('dragging');
    // remove element on drop outside screen
    if (event.dataTransfer.dropEffect !== 'copy' && !this.validDropo) {
      if (this.sendEventOnDrop) {
        this.handleSendEventOnDrop(index + '', -1);
      }
      if (this.sendEventOnChange) {
        this.handleSendEventOnChange(index + '');
      }
      event.target.remove();
    }
  }

  private clearSubscriptions() {
    this.signalHolder.forEach((obj: any) => {
      this.clearOldSubscriptionNumber(obj.signalValue, obj.signalState);
    });
    this.signalHolder.length = 0;

    Object.keys(this.signalHolderForSourceLabel).forEach((key: any) => {
      this.signalHolderForSourceLabel[key].forEach((item: any) => {
        this.clearOldSubscriptionString(item.signalValue, item.signalState);
      });
      this.signalHolderForSourceLabel[key] = [];
    });

    Object.keys(this.signalHolderForScreenLabel).forEach((key: any) => {
      this.signalHolderForScreenLabel[key].forEach((item: any) => {
        this.clearOldSubscriptionString(item.signalValue, item.signalState);
      });
      this.signalHolderForScreenLabel[key] = [];
    });
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
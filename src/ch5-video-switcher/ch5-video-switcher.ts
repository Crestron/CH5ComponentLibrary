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
      name: "sourceIconUrl",
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
  public screenListParentCssClass = '--screen-list-parent';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = '--source-list-scrollbar-';
  public static readonly DISPLAY_SCREEN_LABEL: string = '--screen-list-display-screen-label-';

  private _ch5Properties: Ch5Properties;
  private _elContainer: HTMLElement = {} as HTMLElement;
  public _sourceListContainer: HTMLElement = {} as HTMLElement;
  public _screenListParentContainer: HTMLElement = {} as HTMLElement;
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
  private numberOfScreenBackup: number = 1;
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
  private validDrop: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  public debounceNumberOfItems = this.debounce((newValue: number) => {
    this.setNumberOfItems(newValue);
  }, 150);

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

  public set sourceIconUrl(value: string) {
    this._ch5Properties.set<string>("sourceIconUrl", value, () => {
      this.createSource();
    });
  }
  public get sourceIconUrl(): string {
    return this._ch5Properties.get<string>("sourceIconUrl");
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
      // Debounce is used to resolve CH5C-21364
      this.debounceNumberOfItems(newValue);
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
      // fix for https://crestroneng.atlassian.net/browse/CH5C-21734 DO NOT remove
      if (attr.toLowerCase() === 'receivestatenumberofscreens' && this.contractName !== '' && newValue.startsWith(this.contractName) === false) {
        return;
      }
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
      this.createSource();
      this.createScreen();
    });
    this.logger.stop();
  }

  private contractDefaultHelper() {
    if (this.contractName !== "" && this.contractName !== null && this.contractName !== undefined) {
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
    this._screenListParentContainer = document.createElement('div');
    this._screenListContainer = document.createElement('div');
    this._scrollbarContainer = document.createElement('div');
    this._scrollbar = document.createElement('div');
    this._screenListParentContainer.classList.add(this.primaryCssClass + this.screenListParentCssClass);
    this._screenListContainer.classList.add(this.primaryCssClass + this.screenListCssClass);
    this._sourceListContainer.classList.add(this.primaryCssClass + this.sourceListCssClass);
    this._screenListParentContainer.appendChild(this._screenListContainer);
    this._elContainer.appendChild(this._sourceListContainer);
    this._elContainer.appendChild(this._screenListParentContainer);
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
    this.resizeObserver = new ResizeObserver(this.resizeObserverHandler);
    this.resizeObserver.observe(this._elContainer);
  }

  private handleMouseDown = this.debounce((e: MouseEvent) => {
    this.isDown = true;
    this._sourceListContainer.classList.add('active');
    this.startX = e.pageX - this._sourceListContainer.offsetLeft;
    this.startY = e.pageY - this._sourceListContainer.offsetTop;
    this.scrollListLeft = this._sourceListContainer.scrollLeft;
    this.scrollListTop = this._sourceListContainer.scrollTop;
  }, 10);

  private handleMouseUpAndLeave = this.debounce(() => {
    this.isDown = false;
    this._sourceListContainer.classList.remove('active');
  }, 10);

  private handleMouseMove = this.debounce((e: MouseEvent) => {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this._sourceListContainer.offsetLeft;
    const y = e.pageY - this._sourceListContainer.offsetTop;
    const walkX = (x - this.startX) * (this.endless ? 1 : 3);
    const walkY = (y - this.startY) * (this.endless ? 1 : 3);
    this._sourceListContainer.scrollLeft = this.scrollListLeft - walkX;
    this._sourceListContainer.scrollTop = this.scrollListTop - walkY;
  }, 10);

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
    this.handleNumberOfScreenColumns();
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
    if (this.contractName) {
      signalName = this.contractName + '.Source' + ((+signalName) + 1) + '_Selection';
      Ch5SignalFactory.getInstance().getNumberSignal(signalName)?.publish((+value + 1) as number);
    } else {
      if (this.sendEventOnDrop) {
        const sigName = this.getSignalName(this.sendEventOnDrop, +signalName)
        Ch5SignalFactory.getInstance().getNumberSignal(sigName)?.publish((+value + 1) as number);
      }
    }
  }

  private handleSendEventOnChange(signalName: string) {
    if (this.contractName) {
      signalName = this.contractName + '.Screen_' + ((+signalName) + 1) + '_Changed';
      Ch5SignalFactory.getInstance().getBooleanSignal(signalName)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(signalName)?.publish(false);
    } else if (this.sendEventOnChange) {
      const sigName = this.getSignalName(this.sendEventOnChange, +signalName);
      Ch5SignalFactory.getInstance().getBooleanSignal(sigName)?.publish(true);
      Ch5SignalFactory.getInstance().getBooleanSignal(sigName)?.publish(false);
    }
  }

  private handleReceiveStateSourceChanged() {
    this.signalHolder.forEach((obj: any) => {
      this.clearOldSubscriptionNumber(obj.signalValue, obj.signalState);
    });

    for (let i = 0; i < this.numberOfScreens; i++) {
      const screen = this.contractName ? this.contractName + `.Source${i + 1}_Feedback` : this.getSignalName(this.receiveStateSourceChanged, i);
      this.signalHolder.push({ signalState: "", signalValue: screen, value: null });
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

  private getSignalName(attr: string, index: number) {
    const indexId = this.getAttribute('indexid')?.trim() + '' || this.indexId;
    if (attr.includes(`{{${indexId}}}`) === false) {
      return attr;
    } else {
      const screen = this.replaceAll(attr, `{{${indexId}}}`, '');
      const isNumber = /^[0-9]+$/.test(screen);
      if (isNumber) {
        return (+screen + index) + '';
      } else {
        return this.replaceAll(attr, `{{${indexId}}}`, index + '');
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
    for (let i = 0; i < this.numberOfSources; i++) {
      if (this.contractName && this.contractSourceLabelType === 'innerHTML') {
        const sigValue = this.contractName + `.Source_${i + 1}_Label`;
        this.getSubscription(this.signalHolderForSourceLabel['receiveStateScriptSourceLabelHtml'], this.sourcelabelHelper, i, sigValue, true);
      } else if (this.contractName && this.contractSourceLabelType === 'textContent') {
        const sigValue = this.contractName + `.Source_${i + 1}_Label`;
        this.getSubscription(this.signalHolderForSourceLabel['receiveStateSourceLabel'], this.sourcelabelHelper, i, sigValue);
      } else if (this.receiveStateScriptSourceLabelHtml) {
        const sigValue = this.getSignalName(this.receiveStateScriptSourceLabelHtml, i);
        this.getSubscription(this.signalHolderForSourceLabel['receiveStateScriptSourceLabelHtml'], this.sourcelabelHelper, i, sigValue, true);
      } else if (this.receiveStateSourceLabel) {
        const sigValue = this.getSignalName(this.receiveStateSourceLabel, i);
        this.getSubscription(this.signalHolderForSourceLabel['receiveStateSourceLabel'], this.sourcelabelHelper, i, sigValue);
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

    for (let i = 0; i < this.numberOfScreens; i++) {
      if (this.contractName && this.contractScreenLabelType === 'innerHTML') {
        const sigValue = this.contractName + `.Screen${i + 1}_Label`;
        this.getSubscription(this.signalHolderForScreenLabel['receiveStateScriptScreenLabelHtml'], this.screenlabelHelper, i, sigValue, true);
      } else if (this.contractName && this.contractScreenLabelType === 'textContent') {
        const sigValue = this.contractName + `.Screen${i + 1}_Label`;
        this.getSubscription(this.signalHolderForScreenLabel['receiveStateScreenLabel'], this.screenlabelHelper, i, sigValue);
      } else if (this.receiveStateScriptScreenLabelHtml) {
        const sigValue = this.getSignalName(this.receiveStateScriptScreenLabelHtml, i);
        this.getSubscription(this.signalHolderForScreenLabel['receiveStateScriptScreenLabelHtml'], this.screenlabelHelper, i, sigValue, true);
      } else if (this.receiveStateScreenLabel) {
        const sigValue = this.getSignalName(this.receiveStateScreenLabel, i);
        this.getSubscription(this.signalHolderForScreenLabel['receiveStateScreenLabel'], this.screenlabelHelper, i, sigValue);
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
    const screenSpanEl = this._screenListContainer.querySelectorAll(`[sourceid="${index}"] > span`);
    Array.from(screenSpanEl).forEach((spanEl) => {
      isInnerHTML ? spanEl.innerHTML = newValue : spanEl.textContent = newValue;
    })
  }

  private screenlabelHelper(newValue: string, index: number, isInnerHTML: boolean) {
    const spanEl = this._screenListContainer.querySelector(`[screenid="${index}"] > span`);
    if (spanEl) {
      isInnerHTML ? spanEl.innerHTML = newValue : spanEl.textContent = newValue;
    }
  }

  private handleContractName() {
    if (this.contractName.length === 0) {
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

  private handleScrollEvent = this.debounce(() => {
    const draggedElement = this.querySelector(".dragging") as HTMLElement;
    if (!draggedElement) {// Scrollbar moves when drag happens
      this.initScrollbar();
      if (this.endless) {
        return this.endlessHelper();
      }
    }
  }, 10)

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

  private resizeObserverHandler = () => {
    if (this._elContainer.getBoundingClientRect().width === 0) {
      return;
    }
    this.handleNumberOfScreenColumns();
    this.handleResizeComponent();
  }

  private handleNumberOfScreenColumns() {
    const containerHeight = (this._screenListParentContainer.offsetHeight - 10);
    const containerWidth = (this._screenListParentContainer.offsetWidth - 10);
    const possibleCol = containerWidth / 82;
    const possibleRow = containerHeight / 62;
    const minColWidth: number = 80;
    const minRowHieght: number = 60;
    let finalColNumber: number = 0;
    let finalRowNumber: number = 0;
    let setCol: boolean = true;
    let setRow: boolean = true;
    let requiredRows: number = 1;
    let visible_screens: number = 0;
    let rowHeight: any = 0;
    let colWidth: any = 0;

    this._screenListContainer.style.removeProperty('grid-template-columns');
    this._screenListContainer.style.removeProperty('grid-template-rows');

    if (this.numberOfScreenColumns > 0) {
      // columns
      if (Math.floor(possibleCol) >= this.numberOfScreenColumns) {
        requiredRows = this.numberOfScreens / Math.floor(this.numberOfScreenColumns);
        finalColNumber = this.numberOfScreenColumns;
      } else if (Math.floor(possibleCol) >= this.numberOfScreens) {
        requiredRows = this.numberOfScreens / Math.floor(possibleCol);
        finalColNumber = Math.floor(possibleCol);
      } else {
        requiredRows = this.numberOfScreens / Math.floor(possibleCol);
        finalColNumber = Math.floor(possibleCol);
        setCol = false;
      }

      // rows
      if (Math.floor(possibleRow) <= Math.ceil(requiredRows)) {
        visible_screens = finalColNumber * Math.floor(possibleRow);
        finalRowNumber = Math.floor(possibleRow)
      } else {
        visible_screens = finalColNumber * Math.ceil(requiredRows);
        finalRowNumber = Math.ceil(requiredRows);
      }

      let col = setCol ? finalColNumber : 'auto-fit';
      let row = 'repeat(' + finalRowNumber + ', minmax(' + minRowHieght + 'px, 1fr) )'
      if (setCol && (col > this.numberOfScreens + '')) { // to center items is screens are les than number of col
        colWidth = (Math.floor(possibleCol) > this.numberOfScreenColumns) ? (containerWidth / this.numberOfScreenColumns) : (containerWidth / Math.floor(possibleCol));
        col = 'repeat(' + this.numberOfScreens + ',' + colWidth + 'px)';
      } else {
        // To center align items when screenaspect is 16:9 and 4:3
        if (this.screenAspectRatio === "16:9" || this.screenAspectRatio === "4:3") {
          if ((Math.floor(possibleCol) >= finalColNumber) && (Math.floor(possibleRow) >= finalRowNumber)) {
            const SW = containerWidth / finalColNumber;
            const SH = containerHeight / finalRowNumber;
            const reHeight = this.screenAspectRatio === '16:9' ? (SW * (9 / 16)) : (SW * (3 / 4));
            if (SH >= reHeight) {
              colWidth = (containerWidth / finalColNumber) - 2;
              rowHeight = reHeight;
            } else {
              rowHeight = this.getRowHeightColWidth(false, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
              colWidth = this.getRowHeightColWidth(true, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
            }
          } else {
            rowHeight = this.getRowHeightColWidth(false, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
            colWidth = this.getRowHeightColWidth(true, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
          }
          col = 'repeat(' + col + ',' + colWidth + 'px)';
        } else {
          col = 'repeat(' + col + ',minmax(' + minColWidth + 'px, 1fr))';
        }
      }
      if (rowHeight > 0) {
        row = 'repeat(' + finalRowNumber + ',' + rowHeight + 'px)';
      }
      this._screenListContainer.style.setProperty('grid-template-columns', col);
      this._screenListContainer.style.setProperty('grid-template-rows', row);
    } else {
      requiredRows = this.numberOfScreens / Math.floor(possibleCol);
      if (this.screenAspectRatio === '16:9' || this.screenAspectRatio === '4:3') {
        if (Math.floor(possibleCol) >= this.numberOfScreens) {
          finalColNumber = this.numberOfScreens;
        } else {
          finalColNumber = Math.floor(possibleCol);
        }
      }

      // rows
      if (Math.floor(possibleRow) <= Math.ceil(requiredRows)) {
        visible_screens = Math.floor(possibleRow) * Math.floor(possibleCol);
        finalRowNumber = Math.floor(possibleRow);
      } else if (Math.floor(possibleRow) >= Math.ceil(requiredRows)) {
        finalRowNumber = Math.ceil(requiredRows)
        visible_screens = Math.ceil(requiredRows) * Math.floor(possibleCol);
      } else {
        setRow = false;
      }

      let col = 'repeat(auto-fit, minmax(' + minColWidth + 'px, 1fr) )';
      let rowHeight: any = 0;
      if (this.screenAspectRatio === "16:9" || this.screenAspectRatio === "4:3") {
        let colWidth: any = 0;
        if ((Math.floor(possibleCol) >= finalColNumber) && (Math.floor(possibleRow) >= finalRowNumber)) {
          const SW = containerWidth / finalColNumber;
          const SH = containerHeight / finalRowNumber;
          const reHeight = this.screenAspectRatio === '16:9' ? (SW * (9 / 16)) : (SW * (3 / 4));
          if (SH >= reHeight) {
            colWidth = (containerWidth / finalColNumber) - 2;
            rowHeight = reHeight;
          } else {
            rowHeight = this.getRowHeightColWidth(false, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
            colWidth = this.getRowHeightColWidth(true, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
          }
        } else {
          rowHeight = this.getRowHeightColWidth(false, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
          colWidth = this.getRowHeightColWidth(true, containerHeight, containerWidth, finalRowNumber, finalColNumber, this.screenAspectRatio);
        }
        col = 'repeat(auto-fit,' + colWidth + 'px)';
      }
      let row = '';
      if (rowHeight > 0) {
        row = 'repeat(' + finalRowNumber + ',' + rowHeight + 'px)';
      } else {
        row = setRow ? 'repeat(' + finalRowNumber + ', minmax(' + minRowHieght + 'px, 1fr) )' : 'minmax(' + minRowHieght + 'px, 1fr)';
      }

      this._screenListContainer.style.setProperty('grid-template-columns', col);
      this._screenListContainer.style.setProperty('grid-template-rows', row);
    }
    for (let i = 0; i < this.numberOfScreens; i++) {
      const screen = this._screenListContainer.querySelector(`[screenid="${i}"]`) as HTMLElement;
      if (!screen) {
        continue;
      }
      screen.style.removeProperty('width');
      screen.style.removeProperty('height');
      screen.classList.remove('hideScreen');
      if (i >= visible_screens && !screen.classList.contains('hideScreen')) {
        screen.classList.add('hideScreen');
      }

      if (this.screenAspectRatio === '4:3' || this.screenAspectRatio === '16:9') {
        if ((Math.floor(possibleCol) >= finalColNumber) && (Math.floor(possibleRow) >= finalRowNumber)) {
          const SW = containerWidth / finalColNumber;
          const SH = containerHeight / finalRowNumber;
          const reHeight = this.screenAspectRatio === '16:9' ? (SW * (9 / 16)) : (SW * (3 / 4));
          if (SH >= reHeight) {
            screen.style.width = (containerWidth / finalColNumber) - 2 + 'px';
          } else {
            if ((containerHeight / finalRowNumber) < (containerWidth / finalColNumber)) {
              screen.style.height = (containerHeight / finalRowNumber) - 2 + 'px';
            } else {
              screen.style.height = (containerWidth / finalColNumber) - 2 + 'px';
            }
          }
        } else {
          if ((containerHeight / finalRowNumber) < (containerWidth / finalColNumber)) {
            screen.style.height = (containerHeight / finalRowNumber) - 2 + 'px';
          } else {
            screen.style.height = (containerWidth / finalColNumber) - 2 + 'px';
          }
        }
      }
    }
  }

  getRowHeightColWidth(colWidth: boolean = false, containerHeight: number, containerWidth: number, finalRowNumber: number, finalColNumber: number, aspectRatio: string) {
    let colWidthSize = 0
    let rowHeightSize = 0;
    if ((containerHeight / finalRowNumber) < (containerWidth / finalColNumber)) {
      rowHeightSize = (containerHeight / finalRowNumber) - 2;
      colWidthSize = aspectRatio === '4:3' ? (((containerHeight / finalRowNumber) - 2) * (4 / 3)) : (((containerHeight / finalRowNumber) - 2) * (16 / 9));
    } else {
      rowHeightSize = (containerWidth / finalColNumber) - 2;
      colWidthSize = aspectRatio === '4:3' ? (((containerWidth / finalColNumber) - 2) * (4 / 3)) : (((containerWidth / finalColNumber) - 2) * (16 / 9));
    }
    return colWidth ? colWidthSize : rowHeightSize;
  }

  public screenLabelHelperCreate(index: number, labelInnerHTML: string = '') {
    if (!this._screenListContainer.children[index]) { return; }
    const labelEl = this.querySelector(`#${this.getCrId()}-screen-label-${index}`);
    const content = labelEl ? labelEl.children[0] as HTMLTemplateElement : null;

    const screen = this.querySelector(`#${this.getCrId()}-screen-${index}`) as Ch5VideoSwitcherScreen;
    labelInnerHTML = screen ? screen.labelInnerHTML : labelInnerHTML;

    if (this.contractName && this.contractScreenLabelType === 'innerHTML') {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForScreenLabel.receiveStateScriptScreenLabelHtml[index]?.value;
    } else if (this.contractName && this.contractScreenLabelType === 'textContent') {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForScreenLabel.receiveStateScreenLabel[index]?.value;
    } else if (this.hasAttribute('receiveStateScriptScreenLabelHtml') && this.receiveStateScriptScreenLabelHtml) {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForScreenLabel.receiveStateScriptScreenLabelHtml[index]?.value;
    } else if (this.hasAttribute('receiveStateScreenLabel') && this.receiveStateScreenLabel) {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForScreenLabel.receiveStateScreenLabel[index]?.value;
    } else if (content) {
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(content, index, this.indexId);
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(content, index, this.indexId);
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = content.innerHTML.trim();
    } else if (labelInnerHTML) {
      this._screenListContainer.children[index].getElementsByTagName('span')[0].innerHTML = labelInnerHTML.trim();
    }
  }

  public sourceLabelHelperCreate(index: number, labelInnerHTML: string = '',) {
    if (!this._sourceListContainer.children[index]) { return; }
    const labelEl = this.querySelector(`#${this.getCrId()}-source-label-${index}`);
    const content = labelEl ? labelEl.children[0] as HTMLTemplateElement : null;

    const screen = this.querySelector(`#${this.getCrId()}-source-${index}`) as Ch5VideoSwitcherSource;
    labelInnerHTML = screen ? screen.labelInnerHTML : labelInnerHTML;

    if (this.contractName && this.contractSourceLabelType === 'innerHTML') {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForSourceLabel.receiveStateScriptSourceLabelHtml[index]?.value;
    } else if (this.contractName && this.contractSourceLabelType === 'textContent') {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForSourceLabel.receiveStateSourceLabel[index]?.value;
    } else if (this.hasAttribute('receiveStateScriptSourceLabelHtml') && this.receiveStateScriptSourceLabelHtml) {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = this.signalHolderForSourceLabel.receiveStateScriptSourceLabelHtml[index]?.value;
    } else if (this.hasAttribute('receiveStateSourceLabel') && this.receiveStateSourceLabel) {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].textContent = this.signalHolderForSourceLabel.receiveStateSourceLabel[index]?.value;
    } else if (content) {
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(content, index, this.indexId);
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(content, index, this.indexId);
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = content.innerHTML.trim();
    } else if (labelInnerHTML) {
      this._sourceListContainer.children[index].getElementsByTagName('span')[0].innerHTML = labelInnerHTML.trim();
    }
  }

  private sourceIconHelperCreate(index: number, sourceIcon: HTMLElement) {
    const source = this.querySelector(`#${this.getCrId()}-source-${index}`) as Ch5VideoSwitcherSource;
    if (source && source.iconUrl) {
      sourceIcon.style.removeProperty('backgroundImage');
      sourceIcon.classList.add('source-icon-url');
      sourceIcon.style.backgroundImage = `url(${source.iconUrl})`;
    } else if (this.sourceIconUrl) {
      sourceIcon.style.removeProperty('backgroundImage');
      sourceIcon.classList.add('source-icon-url');
      sourceIcon.style.backgroundImage = `url(${this.sourceIconUrl})`;
    } else {
      const iconClass = source && source.iconClass ? source.iconClass : this.sourceIconClass ? this.sourceIconClass : Ch5VideoSwitcher.DEFAULT_SOURCE_ICON;
      iconClass.split(' ').forEach((className: string) => {
        className = className.trim();
        if (className !== '') {
          sourceIcon.classList.add(className);
        }
      });
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
    this.validDrop = true;
    const draggedElement = this.querySelector(".dragging") as HTMLElement;
    if (scrNumber !== +(draggedElement.parentElement?.getAttribute('screenid') + '')) {
      if (draggedElement && draggedElement.classList.contains('source-onscreen')) { // Move source from screen to screen
        const screenEl = this.querySelector(`[screenid="${scrNumber}"]`) as HTMLElement;
        const existingSource = screenEl.children.length === 2 ? Number(screenEl.children[1].getAttribute('sourceId')) : -1;
        this.handleSendEventOnDrop(draggedElement.parentElement?.getAttribute('screenid') + '', existingSource);
        this.handleSendEventOnDrop(scrNumber + '', draggedElement.getAttribute('sourceId'));
        this.handleSendEventOnChange(scrNumber + '');
        this.handleSendEventOnChange(draggedElement.parentElement?.getAttribute('screenid') + '');
      } else {// Move source from sourcelist  to screen
        this.handleSendEventOnChange(scrNumber + '');
        if (draggedElement && draggedElement.getAttribute('sourceId')) {
          this.handleSendEventOnDrop(scrNumber + '', draggedElement.getAttribute('sourceId'));
        }
        if (!this.receiveStateSourceChanged && !this.contractName) {
          this.addSourceToScreen(draggedElement, this._screenListContainer.children[scrNumber] as HTMLElement, scrNumber, false);
        }
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
    const iconElement = se.children[0] as HTMLElement;
    if (iconElement.classList.contains('source-icon-url')) {
      iconElement.style.height = screen.offsetHeight * 0.27 + 'px';
      iconElement.style.width = '100%';
    }
    se.style.fontSize = screen.offsetHeight * 0.27 + 'px';
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

  private handleResizeComponent() {
    for (let i = 0; i < this.numberOfScreens; i++) {
      if (this._screenListContainer.children[i].children.length > 1) {
        const screen = this._screenListContainer.children[i] as HTMLElement;
        const sourceOnScreen = this._screenListContainer.children[i].children[1] as HTMLElement;
        sourceOnScreen.style.fontSize = screen.offsetHeight * 0.27 + 'px';
        const iconElement = sourceOnScreen.children[0] as HTMLElement;
        if (iconElement.classList.contains('source-icon-url')) {
          iconElement.style.height = screen.offsetHeight * 0.27 + 'px';
          iconElement.style.width = '100%';
        }
      }
    }
    if (this.endless) {
      if (this.sourceListPosition === 'top' || this.sourceListPosition === 'bottom') {
        this._sourceListContainer.scrollLeft += 5;
      } else {
        this._sourceListContainer.scrollTop += 5;
      }
    }
    this.initScrollbar();
  }

  private handleDragStartForSourceOnScreen(index: number) {
    this.validDrop = false;
    this._screenListContainer.children[index].children[1].classList.add('dragging');
  }

  private handleDragEndForSourceOnScreen(index: number, event: any) {
    this._screenListContainer.children[index]?.children[1]?.classList?.remove('dragging');
    // remove element on drop outside screen
    if (event.dataTransfer.dropEffect !== 'copy' && !this.validDrop) {
      this.handleSendEventOnDrop(index + '', -1);
      this.handleSendEventOnChange(index + '');
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

  private setNumberOfItems(newValue: number) {
    this._ch5Properties.setForSignalResponse<number>("numberOfScreens", newValue, () => {
      if (this.numberOfScreenBackup > this.numberOfScreens) {
        for (let i = this.numberOfScreens; i < this.numberOfScreenBackup; i++) {
          this.handleSendEventOnDrop(i + '', -1);
          this.handleSendEventOnChange(i + '');
        }
      }
      this.numberOfScreenBackup = this.numberOfScreens;
      this.createScreen();
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

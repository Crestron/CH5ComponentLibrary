import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5VideoSwitcherSourceListPosition, TCh5VideoSwitcherScreenAspectRatio, TCh5VideoSwitcherContractSourceLabelType, TCh5VideoSwitcherContractScreenLabelType,  } from './interfaces/t-ch5-video-switcher';
import { ICh5VideoSwitcherAttributes } from './interfaces/i-ch5-video-switcher-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5VideoSwitcher extends Ch5Common implements ICh5VideoSwitcherAttributes {

	//#region Variables

	public static readonly SOURCE_LIST_POSITION: TCh5VideoSwitcherSourceListPosition[] = ['top','left','right','bottom'];
      public static readonly SCREEN_ASPECT_RATIO: TCh5VideoSwitcherScreenAspectRatio[] = ['stretch','16:9','4:3'];
      public static readonly CONTRACT_SOURCE_LABEL_TYPE: TCh5VideoSwitcherContractSourceLabelType[] = ['none','textContent','innerHTML'];
      public static readonly CONTRACT_SCREEN_LABEL_TYPE: TCh5VideoSwitcherContractScreenLabelType[] = ['none','textContent','innerHTML'];
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
            name:"numberOfSourceListDivisions",
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
            name:"numberOfSources",
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
            name:"numberOfScreenColumns",
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
            name:"numberOfScreens",
            removeAttributeOnNull: true,
            nameForSignal:"receiveStateNumberOfScreens",
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
          isSignal: true,
          name: "sendEventOnDrop",
          signalType: "number",
          removeAttributeOnNull: true,
          type: "string",
          
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
        },
          {
          default: "",
          isSignal: true,
          name: "sendEventOnChange",
          signalType: "boolean",
          removeAttributeOnNull: true,
          type: "string",
          
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
        },
          {
          default: "",
          isSignal: true,
          name: "receiveStateSourceChanged",
          signalType: "number",
          removeAttributeOnNull: true,
          type: "string",
          
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
        },
          {
          default: "",
          isSignal: true,
          name: "receiveStateSourceLabel",
          signalType: "string",
          removeAttributeOnNull: true,
          type: "string",
          
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
        },
          {
          default: "",
          isSignal: true,
          name: "receiveStateScriptSourceLabelHtml",
          signalType: "string",
          removeAttributeOnNull: true,
          type: "string",
          
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
        },
          {
          default: "",
          isSignal: true,
          name: "receiveStateScreenLabel",
          signalType: "string",
          removeAttributeOnNull: true,
          type: "string",
          
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
        },
          {
          default: "",
          isSignal: true,
          name: "receiveStateScriptScreenLabelHtml",
          signalType: "string",
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
	
	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;
	
	//#endregion

	//#region Getters and Setters
	
	
        public set sourceListPosition(value: TCh5VideoSwitcherSourceListPosition) {
          this._ch5Properties.set<TCh5VideoSwitcherSourceListPosition>("sourceListPosition", value, () => {
            this.handleSourceListPosition();          });
        }
        public get sourceListPosition(): TCh5VideoSwitcherSourceListPosition {
          return this._ch5Properties.get<TCh5VideoSwitcherSourceListPosition>("sourceListPosition");
        }
        
        public set endless(value: boolean) {
          this._ch5Properties.set<boolean>("endless", value, () => {
              this.handleEndless();
          });
        }
        public get endless():boolean {
          return this._ch5Properties.get<boolean>("endless");
        }
        
        public set numberOfSourceListDivisions(value: number) {
          this._ch5Properties.set<number>("numberOfSourceListDivisions", value, () => {
              this.handleNumberOfSourceListDivisions();
          });
        }
        public get numberOfSourceListDivisions():number {
          return this._ch5Properties.get<number>("numberOfSourceListDivisions");
        }
        
        public set scrollbar(value: boolean) {
          this._ch5Properties.set<boolean>("scrollbar", value, () => {
              this.handleScrollbar();
          });
        }
        public get scrollbar():boolean {
          return this._ch5Properties.get<boolean>("scrollbar");
        }
        
        public set numberOfSources(value: number) {
          this._ch5Properties.set<number>("numberOfSources", value, () => {
              this.handleNumberOfSources();
          });
        }
        public get numberOfSources():number {
          return this._ch5Properties.get<number>("numberOfSources");
        }
        
        public set numberOfScreenColumns(value: number) {
          this._ch5Properties.set<number>("numberOfScreenColumns", value, () => {
              this.handleNumberOfScreenColumns();
          });
        }
        public get numberOfScreenColumns():number {
          return this._ch5Properties.get<number>("numberOfScreenColumns");
        }
        
        public set indexId(value: string) {
          this._ch5Properties.set<string>("indexId", value, () => {
              this.handleIndexId();
          });
        }
        public get indexId():string {
          return this._ch5Properties.get<string>("indexId");
        }
        
        public set displayScreenLabel(value: boolean) {
          this._ch5Properties.set<boolean>("displayScreenLabel", value, () => {
              this.handleDisplayScreenLabel();
          });
        }
        public get displayScreenLabel():boolean {
          return this._ch5Properties.get<boolean>("displayScreenLabel");
        }
        
        public set screenAspectRatio(value: TCh5VideoSwitcherScreenAspectRatio) {
          this._ch5Properties.set<TCh5VideoSwitcherScreenAspectRatio>("screenAspectRatio", value, () => {
            this.handleScreenAspectRatio();          });
        }
        public get screenAspectRatio(): TCh5VideoSwitcherScreenAspectRatio {
          return this._ch5Properties.get<TCh5VideoSwitcherScreenAspectRatio>("screenAspectRatio");
        }
        
        public set numberOfScreens(value: number) {
          this._ch5Properties.set<number>("numberOfScreens", value, () => {
              this.handleNumberOfScreens();
          });
        }
        public get numberOfScreens():number {
          return this._ch5Properties.get<number>("numberOfScreens");
        }
        
        public set sourceIconClass(value: string) {
          this._ch5Properties.set<string>("sourceIconClass", value, () => {
              this.handleSourceIconClass();
          });
        }
        public get sourceIconClass():string {
          return this._ch5Properties.get<string>("sourceIconClass");
        }
        
        public set sendEventOnDrop(value: string) {
          this._ch5Properties.set("sendEventOnDrop", value, null, (newValue: number) => {
            this.handleSendEventOnDrop();
          });
        }
        public get sendEventOnDrop(): string {
          return this._ch5Properties.get<string>('sendEventOnDrop');
        }
        
        public set sendEventOnChange(value: string) {
          this._ch5Properties.set("sendEventOnChange", value, null, (newValue: boolean) => {
            this.handleSendEventOnChange();
          });
        }
        public get sendEventOnChange(): string {
          return this._ch5Properties.get<string>('sendEventOnChange');
        }
        
        public set receiveStateSourceChanged(value: string) {
          this._ch5Properties.set("receiveStateSourceChanged", value, null, (newValue: number) => {
            this.handleReceiveStateSourceChanged();
          });
        }
        public get receiveStateSourceChanged(): string {
          return this._ch5Properties.get<string>('receiveStateSourceChanged');
        }
        
        public set receiveStateSourceLabel(value: string) {
          this._ch5Properties.set("receiveStateSourceLabel", value, null, (newValue: string) => {
            this.handleReceiveStateSourceLabel();
          });
        }
        public get receiveStateSourceLabel(): string {
          return this._ch5Properties.get<string>('receiveStateSourceLabel');
        }
        
        public set receiveStateScriptSourceLabelHtml(value: string) {
          this._ch5Properties.set("receiveStateScriptSourceLabelHtml", value, null, (newValue: string) => {
            this.handleReceiveStateScriptSourceLabelHtml();
          });
        }
        public get receiveStateScriptSourceLabelHtml(): string {
          return this._ch5Properties.get<string>('receiveStateScriptSourceLabelHtml');
        }
        
        public set receiveStateScreenLabel(value: string) {
          this._ch5Properties.set("receiveStateScreenLabel", value, null, (newValue: string) => {
            this.handleReceiveStateScreenLabel();
          });
        }
        public get receiveStateScreenLabel(): string {
          return this._ch5Properties.get<string>('receiveStateScreenLabel');
        }
        
        public set receiveStateScriptScreenLabelHtml(value: string) {
          this._ch5Properties.set("receiveStateScriptScreenLabelHtml", value, null, (newValue: string) => {
            this.handleReceiveStateScriptScreenLabelHtml();
          });
        }
        public get receiveStateScriptScreenLabelHtml(): string {
          return this._ch5Properties.get<string>('receiveStateScriptScreenLabelHtml');
        }
        
        public set receiveStateNumberOfScreens(value: string) {
          this._ch5Properties.set("receiveStateNumberOfScreens", value, null, (newValue: number) => {
            this._ch5Properties.setForSignalResponse<number> ("numberOfScreens", newValue, () => {
            this.handleReceiveStateNumberOfScreens();
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
        public get contractName():string {
          return this._ch5Properties.get<string>("contractName");
        }
        
        public set useContractForEnable(value: boolean) {
          this._ch5Properties.set<boolean>("useContractForEnable", value, () => {
              this.handleUseContractForEnable();
          });
        }
        public get useContractForEnable():boolean {
          return this._ch5Properties.get<boolean>("useContractForEnable");
        }
        
        public set useContractForShow(value: boolean) {
          this._ch5Properties.set<boolean>("useContractForShow", value, () => {
              this.handleUseContractForShow();
          });
        }
        public get useContractForShow():boolean {
          return this._ch5Properties.get<boolean>("useContractForShow");
        }
        
        public set contractSourceLabelType(value: TCh5VideoSwitcherContractSourceLabelType) {
          this._ch5Properties.set<TCh5VideoSwitcherContractSourceLabelType>("contractSourceLabelType", value, () => {
            this.handleContractSourceLabelType();          });
        }
        public get contractSourceLabelType(): TCh5VideoSwitcherContractSourceLabelType {
          return this._ch5Properties.get<TCh5VideoSwitcherContractSourceLabelType>("contractSourceLabelType");
        }
        
        public set contractScreenLabelType(value: TCh5VideoSwitcherContractScreenLabelType) {
          this._ch5Properties.set<TCh5VideoSwitcherContractScreenLabelType>("contractScreenLabelType", value, () => {
            this.handleContractScreenLabelType();          });
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
	  this.ignoreAttributes = ["receivestatecustomclass", "receivestatecustomstyle", "sendeventonshow", ];
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
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-video-switcher');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);

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

	
        private handleSourceListPosition(){
          Array.from(Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.values).forEach((e: any) => {
            this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + e);
          });
          this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + this.sourceListPosition);
        }
        private handleEndless(){
          // Enter your Code here
        }
        private handleNumberOfSourceListDivisions(){
          // Enter your Code here
        }
        private handleScrollbar(){
          // Enter your Code here
        }
        private handleNumberOfSources(){
          // Enter your Code here
        }
        private handleNumberOfScreenColumns(){
          // Enter your Code here
        }
        private handleIndexId(){
          // Enter your Code here
        }
        private handleDisplayScreenLabel(){
          // Enter your Code here
        }
        private handleScreenAspectRatio(){
          Array.from(Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.values).forEach((e: any) => {
            this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + e);
          });
          this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + this.screenAspectRatio);
        }
        private handleNumberOfScreens(){
          // Enter your Code here
        }
        private handleSourceIconClass(){
          // Enter your Code here
        }
        private handleSendEventOnDrop(){
          // Enter your Code here
        }
        private handleSendEventOnChange(){
          // Enter your Code here
        }
        private handleReceiveStateSourceChanged(){
          // Enter your Code here
        }
        private handleReceiveStateSourceLabel(){
          // Enter your Code here
        }
        private handleReceiveStateScriptSourceLabelHtml(){
          // Enter your Code here
        }
        private handleReceiveStateScreenLabel(){
          // Enter your Code here
        }
        private handleReceiveStateScriptScreenLabelHtml(){
          // Enter your Code here
        }
        private handleReceiveStateNumberOfScreens(){
          // Enter your Code here
        }
        private handleContractName(){
          // Enter your Code here
        }
        private handleUseContractForEnable(){
          // Enter your Code here
        }
        private handleUseContractForShow(){
          // Enter your Code here
        }
        private handleContractSourceLabelType(){
          Array.from(Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.values).forEach((e: any) => {
            this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.classListPrefix + e);
          });
          this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.classListPrefix + this.contractSourceLabelType);
        }
        private handleContractScreenLabelType(){
          Array.from(Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.values).forEach((e: any) => {
            this._elContainer.classList.remove(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.classListPrefix + e);
          });
          this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.classListPrefix + this.contractScreenLabelType);
        }

	private updateCssClass() {
	  this.logger.start('UpdateCssClass');
		super.updateCssClasses();
	
        this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SOURCE_LIST_POSITION.classListPrefix + this.sourceListPosition);
      
        this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.SCREEN_ASPECT_RATIO.classListPrefix + this.screenAspectRatio);
      
        this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SOURCE_LABEL_TYPE.classListPrefix + this.contractSourceLabelType);
      
        this._elContainer.classList.add(this.primaryCssClass + Ch5VideoSwitcher.COMPONENT_DATA.CONTRACT_SCREEN_LABEL_TYPE.classListPrefix + this.contractScreenLabelType);
      
    this.logger.stop();
  }

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

	public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

	//#endregion

}

Ch5VideoSwitcher.registerCustomElement();
Ch5VideoSwitcher.registerSignalAttributeTypes();

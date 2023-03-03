import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { TCh5SampleAspectRatio,  } from './interfaces/t-ch5-sample';
import { ICh5SampleAttributes } from './interfaces/i-ch5-sample-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5Sample extends Ch5Common implements ICh5SampleAttributes {

	//#region Variables

	public static readonly ASPECT_RATIO: TCh5SampleAspectRatio[] = ['16:9','4:3'];
      public static readonly COMPONENT_DATA: any = {
          ASPECT_RATIO: {
            default: Ch5Sample.ASPECT_RATIO[0],
            values: Ch5Sample.ASPECT_RATIO,
            key: 'aspectRatio',
            attribute: 'aspectRatio',
            classListPrefix: '--aspect-ratio-'
          },
          };
	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		
          {
          default: Ch5Sample.ASPECT_RATIO[0],
          enumeratedValues: Ch5Sample.ASPECT_RATIO,
          name: "aspectRatio",
          removeAttributeOnNull: true,
          
          type: "enum",
          valueOnAttributeEmpty: Ch5Sample.ASPECT_RATIO[0],
          isObservableProperty: true,
          
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
          default: "",
          name: "url",
          
          removeAttributeOnNull: true,
          type: "string",
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
          
        },
          {
          default: "",
          name: "userid",
          
          removeAttributeOnNull: true,
          type: "string",
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
          
        },
          {
          default: "",
          name: "password",
          
          removeAttributeOnNull: true,
          type: "string",
          valueOnAttributeEmpty: "",
          isObservableProperty: true,
          
        },
	];

	public static readonly ELEMENT_NAME = 'ch5-sample';
	
  public primaryCssClass = 'ch5-sample';
	
	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;
	
	//#endregion

	//#region Getters and Setters
	
	
        public set aspectRatio(value: TCh5SampleAspectRatio) {
          this._ch5Properties.set<TCh5SampleAspectRatio>("aspectRatio", value, () => {
            this.handleAspectRatio();          });
        }
        public get aspectRatio(): TCh5SampleAspectRatio {
          return this._ch5Properties.get<TCh5SampleAspectRatio>("aspectRatio");
        }
        
        public set indexId(value: string) {
          this._ch5Properties.set<string>("indexId", value, () => {
              this.handleIndexId();
          });
        }
        public get indexId():string {
          return this._ch5Properties.get<string>("indexId");
        }
        
        public set url(value: string) {
          this._ch5Properties.set<string>("url", value, () => {
              this.handleUrl();
          });
        }
        public get url():string {
          return this._ch5Properties.get<string>("url");
        }
        
        public set userid(value: string) {
          this._ch5Properties.set<string>("userid", value, () => {
              this.handleUserid();
          });
        }
        public get userid():string {
          return this._ch5Properties.get<string>("userid");
        }
        
        public set password(value: string) {
          this._ch5Properties.set<string>("password", value, () => {
              this.handlePassword();
          });
        }
        public get password():string {
          return this._ch5Properties.get<string>("password");
        }
        
	
	//#endregion

	//#region Static Methods
	
	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Sample.ELEMENT_NAME, Ch5Sample.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Sample.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Sample.ELEMENT_NAME, Ch5Sample);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5Sample.ELEMENT_NAME);
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5Sample.COMPONENT_PROPERTIES);
		this.updateCssClass();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Sample.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Sample.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Sample.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-sample attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5Sample.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5Sample component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5Sample.ELEMENT_NAME);
	  // WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			// this.setAttribute('role', Ch5RoleAttributeMapping.ch5Sample);
		}
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-sample');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);

		customElements.whenDefined('ch5-sample').then(() => {
			this.componentLoadedEvent(Ch5Sample.ELEMENT_NAME, this.id);
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
		for (let i: number = 0; i < Ch5Sample.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Sample.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Sample.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Sample.COMPONENT_PROPERTIES[i].name;
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

	
        private handleAspectRatio(){
          Array.from(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.values).forEach((e: any) => {
            this._elContainer.classList.remove(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + e);
          });
          this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);
        }
        private handleIndexId(){
          // Enter your Code here
        }
        private handleUrl(){
          // Enter your Code here
        }
        private handleUserid(){
          // Enter your Code here
        }
        private handlePassword(){
          // Enter your Code here
        }

	private updateCssClass() {
	  this.logger.start('UpdateCssClass');
		super.updateCssClasses();
	
        this._elContainer.classList.add(Ch5Sample.COMPONENT_DATA.ASPECT_RATIO.classListPrefix + this.aspectRatio);
      
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

Ch5Sample.registerCustomElement();
Ch5Sample.registerSignalAttributeTypes();

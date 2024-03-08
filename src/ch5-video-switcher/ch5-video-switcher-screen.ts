import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5VideoSwitcher } from "./ch5-video-switcher";
import { ICh5VideoSwitcherScreenAttributes } from "./interfaces";

export class Ch5VideoSwitcherScreen extends Ch5Log implements ICh5VideoSwitcherScreenAttributes {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-video-switcher-screen';

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "",
      name: "labelInnerHTML",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
  ];

  private _ch5Properties: Ch5Properties;
  private parentComponent: Ch5VideoSwitcher | null = null;

  //#endregion

  //#region Getters and Setters

  public set labelInnerHTML(value: string) {
    this._ch5Properties.set<string>("labelInnerHTML", value, () => {
      const screenEleId = this.getAttribute('id');
      const indexOfScreen = screenEleId?.split('-') ? screenEleId?.split('-') : [];
      if (this.parentComponent) {
        this.parentComponent.screenLabelHelperCreate(+indexOfScreen[4], this.labelInnerHTML);
      }
    });
  }
  public get labelInnerHTML(): string {
    return this._ch5Properties.get<string>("labelInnerHTML");
  }

  //#endregion

  //#region Static Methods

  public static registerCustomElement() {
    if (typeof window === "object"
      && typeof window.customElements === "object"
      && typeof window.customElements.define === "function"
      && window.customElements.get(Ch5VideoSwitcherScreen.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5VideoSwitcherScreen.ELEMENT_NAME, Ch5VideoSwitcherScreen);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()');
    this._ch5Properties = new Ch5Properties(this, Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES);
  }

  public static get observedAttributes(): string[] {
    const commonAttributes = Ch5Log.observedAttributes;
    for (let i: number = 0; i < Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        commonAttributes.push(Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return commonAttributes;
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this.logger.log(this.nodeName + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonListModeBase component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()');
    if (this.parentElement?.nodeName.toLowerCase() !== 'ch5-video-switcher') {
      throw new Error(`Invalid parent element for ch5-video-switcher-screen.`);
    }
    this.parentComponent = this.parentElement as Ch5VideoSwitcher;
    this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcherScreen);
    this.screenLabelHelper();
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected initAttributes() {
    super.initAttributes();
    const thisRef: any = this;
    for (let i: number = 0; i < Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5VideoSwitcherScreen.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  private screenLabelHelper() {
    const screenEleId = this.getAttribute('id');
    const indexOfScreen = screenEleId?.split('-') ? screenEleId?.split('-') : [];
    if (this.parentComponent) {
      this.parentComponent.screenLabelHelperCreate(+indexOfScreen[4]);
    }
  }

  //#endregion

}

Ch5VideoSwitcherScreen.registerCustomElement();
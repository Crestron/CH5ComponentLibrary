import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5VideoSwitcher } from "./ch5-video-switcher";
import { ICh5VideoSwitcherSourceAttributes } from "./interfaces";
import _ from "lodash";

export class Ch5VideoSwitcherSource extends Ch5Log implements ICh5VideoSwitcherSourceAttributes {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-video-switcher-source';

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: "",
      name: "iconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "iconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
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

  public set iconClass(value: string) {
    this._ch5Properties.set<string>("iconClass", value, () => {
      this.handleIcon();
    });
  }
  public get iconClass(): string {
    return this._ch5Properties.get<string>("iconClass");
  }

  public set iconUrl(value: string) {
    this._ch5Properties.set<string>("iconClass", value, () => {
      this.handleIcon();
    });
  }
  public get iconUrl(): string {
    return this._ch5Properties.get<string>("iconUrl");
  }

  public set labelInnerHTML(value: string) {
    this._ch5Properties.set<string>("labelInnerHTML", value, () => {
      const index = Number(this.getAttribute('id')?.split('-').pop());
      if (this.parentComponent) {
        this.parentComponent.sourceLabelHelperCreate(index, this.labelInnerHTML);
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
      && window.customElements.get(Ch5VideoSwitcherSource.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5VideoSwitcherSource.ELEMENT_NAME, Ch5VideoSwitcherSource);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()');
    this._ch5Properties = new Ch5Properties(this, Ch5VideoSwitcherSource.COMPONENT_PROPERTIES);
    this.parentComponent = this.getParentElement();
  }

  public static get observedAttributes(): string[] {
    const commonAttributes = Ch5Log.observedAttributes;
    for (let i: number = 0; i < Ch5VideoSwitcherSource.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5VideoSwitcherSource.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        commonAttributes.push(Ch5VideoSwitcherSource.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return commonAttributes;
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this.logger.log(this.nodeName + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5VideoSwitcherSource.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
      throw new Error(`Invalid parent element for ch5-video-switcher-source.`);
    }
    this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcherSource);
    this.sourceLabelHelper();
    this.initAttributes();
    this.logger.stop();
  }

  private getParentElement(): Ch5VideoSwitcher {
    const getTheMatchingParent = (node: Node): Ch5VideoSwitcher => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-VIDEO-SWITCHER") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5VideoSwitcher;
    }
    return getTheMatchingParent(this.parentElement as Node);
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
    for (let i: number = 0; i < Ch5VideoSwitcherSource.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5VideoSwitcherSource.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5VideoSwitcherSource.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5VideoSwitcherSource.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  private sourceLabelHelper() {
    const sourceEleId = this.getAttribute('id');
    const indexOfSource = sourceEleId?.split('-') ? sourceEleId?.split('-') : [];
    if (this.parentComponent) {
      this.parentComponent.sourceLabelHelperCreate(+indexOfSource[4]);
    }
  }

  private handleIcon() {
    if (this.iconUrl) {
      const index = Number(this.getAttribute('id')?.split('-').pop());
      if (this.parentComponent && this.parentComponent._sourceListContainer.children[index]) {
        const ele = this.parentComponent._sourceListContainer.children[index].getElementsByTagName('i');
        ele[0].setAttribute('class', '');
        ele[0].classList.add('source-icon-url');
        ele[0].style.backgroundImage = `url${this.iconUrl}`;
      }
    } else {
      const index = Number(this.getAttribute('id')?.split('-').pop());
      if (this.parentComponent && this.parentComponent._sourceListContainer.children[index]) {
        const ele = this.parentComponent._sourceListContainer.children[index].getElementsByTagName('i');
        ele[0].setAttribute('class', '');
        ele[0].classList.add('source-icon');
        this.iconClass.split(' ').forEach((className: string) => {
          className = className.trim();
          if (className !== '') {
            ele[0].classList.add(className);
          }
        });
      }
    }
  }
  
  //#endregion

}

Ch5VideoSwitcherSource.registerCustomElement();
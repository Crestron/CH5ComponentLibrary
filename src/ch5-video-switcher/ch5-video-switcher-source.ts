import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { TCh5VideoSwitcherSourceAlignLabel } from "./interfaces/t-ch5-video-switcher";
import { Ch5VideoSwitcher } from "./ch5-video-switcher";
import { ICh5VideoSwitcherSourceAttributes } from "./interfaces";

export class Ch5VideoSwitcherSource extends Ch5Log implements ICh5VideoSwitcherSourceAttributes {

  //#region Variables

  public static ELEMENT_NAME = 'ch5-video-switcher-source';

  public static readonly ALIGN_LABEL: TCh5VideoSwitcherSourceAlignLabel[] = ['center', 'left', 'right'];

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5VideoSwitcherSource.ALIGN_LABEL[0],
      enumeratedValues: Ch5VideoSwitcherSource.ALIGN_LABEL,
      name: "alignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5VideoSwitcherSource.ALIGN_LABEL[0],
      isObservableProperty: true,
    },
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

  public set alignLabel(value: TCh5VideoSwitcherSourceAlignLabel) {
    this._ch5Properties.set<TCh5VideoSwitcherSourceAlignLabel>("alignLabel", value, () => {
      if (this.parentComponent) {
        const sourecEleId = this.getAttribute('id');
        const indexOfSource = sourecEleId?.split('-') ? sourecEleId?.split('-') : [];
        if (this.parentComponent) {
          Array.from(Ch5VideoSwitcherSource.ALIGN_LABEL).forEach((e: any) => {
            this.parentComponent?._sourceListContainer.children[+indexOfSource[3]].classList.remove('ch5-video-switcher--source-list-label-' + e);
          });
          this.parentComponent._sourceListContainer.children[+indexOfSource[3]].classList.add('ch5-video-switcher--source-list-label-' + this.alignLabel);
        }
      }
    });
  }
  public get alignLabel(): TCh5VideoSwitcherSourceAlignLabel {
    return this._ch5Properties.get<TCh5VideoSwitcherSourceAlignLabel>("alignLabel");
  }

  public set iconClass(value: string) {
    this._ch5Properties.set<string>("iconClass", value, () => {
      const sourecEleId = this.getAttribute('id');
      const indexOfSource = sourecEleId?.split('-') ? sourecEleId?.split('-') : [];
      if (this.parentComponent) {
        const ele = this.parentComponent._sourceListContainer.children[+indexOfSource[3]].getElementsByTagName('i');
        ele[0].setAttribute('class', '');
        ele[0].classList.add('source-icon');
        this.iconClass.split(' ').forEach((className: string) => {
          className = className.trim();
          if (className !== '') {
            ele[0].classList.add(className);
          }
        });
      }
    });
  }
  public get iconClass(): string {
    return this._ch5Properties.get<string>("iconClass");
  }

  public set labelInnerHTML(value: string) {
    this._ch5Properties.set<string>("labelInnerHTML", value, () => {
      const sourecEleId = this.getAttribute('id');
      const indexOfSource = sourecEleId?.split('-') ? sourecEleId?.split('-') : [];
      if (this.parentComponent) {
        this.parentComponent.sourceLabelHelperCreate(+indexOfSource[3], this.labelInnerHTML);
        // const ele = this.parentComponent._sourceListContainer.children[+indexOfSource[3]].getElementsByTagName('span');
        // ele[0].innerHTML = this.labelInnerHTML;
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
    // console.log(this.parentNode);
    if (this.parentElement?.nodeName.toLowerCase() !== 'ch5-video-switcher') {
      throw new Error(`Invalid parent element for ch5-video-switcher-source.`);
    }
    this.parentComponent = this.parentElement as Ch5VideoSwitcher;
    this.setAttribute('role', Ch5RoleAttributeMapping.ch5VideoSwitcherSource);
    // console.log(this.getAttribute('id'));

    this.sourceLabelHelper();

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
    const sourceLabel = this.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
    const sourceLabelTemplate = sourceLabel[0].getElementsByTagName("template");
    const sourecEleId = this.getAttribute('id');
    const indexOfSource = sourecEleId?.split('-') ? sourecEleId?.split('-') : [];
    if (sourceLabelTemplate && sourceLabelTemplate.length > 0) {
      const template = document.createElement('template');
      template.innerHTML = sourceLabelTemplate[0].innerHTML;
      if (this.parentComponent) {
        this.parentComponent.sourceLabelHelperCreate(+indexOfSource[3], '', template);
      }
    }
  }

  //#endregion

}

Ch5VideoSwitcherSource.registerCustomElement();
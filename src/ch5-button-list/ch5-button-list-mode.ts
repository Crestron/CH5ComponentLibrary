import _ from "lodash";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5ButtonList } from "./ch5-button-list";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5ButtonListModeAttributes } from './interfaces/i-ch5-button-list-mode-attributes';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { TCh5ButtonListModeType, TCh5ButtonListModeHAlignLabel, TCh5ButtonListModeVAlignLabel, TCh5ButtonListModeCheckboxPosition, TCh5ButtonListModeIconPosition, } from './interfaces/t-ch5-button-list-mode';

export class Ch5ButtonListMode extends Ch5Log implements ICh5ButtonListModeAttributes {

  //#region Variables

  public static readonly TYPE: TCh5ButtonListModeType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly H_ALIGN_LABEL: TCh5ButtonListModeHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly V_ALIGN_LABEL: TCh5ButtonListModeVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly CHECKBOX_POSITION: TCh5ButtonListModeCheckboxPosition[] = ['left', 'right'];
  public static readonly ICON_POSITION: TCh5ButtonListModeIconPosition[] = ['first', 'last', 'top', 'bottom'];

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5ButtonListMode.TYPE[0],
      enumeratedValues: Ch5ButtonListMode.TYPE,
      name: "type",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListMode.TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListMode.H_ALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonListMode.H_ALIGN_LABEL,
      name: "hAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListMode.H_ALIGN_LABEL[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListMode.V_ALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonListMode.V_ALIGN_LABEL,
      name: "vAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListMode.V_ALIGN_LABEL[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListMode.CHECKBOX_POSITION[0],
      enumeratedValues: Ch5ButtonListMode.CHECKBOX_POSITION,
      name: "checkboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListMode.CHECKBOX_POSITION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListMode.ICON_POSITION[0],
      enumeratedValues: Ch5ButtonListMode.ICON_POSITION,
      name: "iconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListMode.ICON_POSITION[0],
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
      name: "iconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "customClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "customStyle",
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

  public static readonly ELEMENT_NAME = 'ch5-button-list-mode';

  private _ch5Properties: Ch5Properties;
  private _parentCh5ButtonList: Ch5ButtonList;

  //#endregion

  //#region Getters and Setters

  public set type(value: TCh5ButtonListModeType) {
    this._ch5Properties.set<TCh5ButtonListModeType>("type", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get type(): TCh5ButtonListModeType {
    return this._ch5Properties.get<TCh5ButtonListModeType>("type");
  }

  public set hAlignLabel(value: TCh5ButtonListModeHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListModeHAlignLabel>("hAlignLabel", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get hAlignLabel(): TCh5ButtonListModeHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListModeHAlignLabel>("hAlignLabel");
  }

  public set vAlignLabel(value: TCh5ButtonListModeVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListModeVAlignLabel>("vAlignLabel", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get vAlignLabel(): TCh5ButtonListModeVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListModeVAlignLabel>("vAlignLabel");
  }

  public set checkboxPosition(value: TCh5ButtonListModeCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListModeCheckboxPosition>("checkboxPosition", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get checkboxPosition(): TCh5ButtonListModeCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListModeCheckboxPosition>("checkboxPosition");
  }

  public set iconPosition(value: TCh5ButtonListModeIconPosition) {
    this._ch5Properties.set<TCh5ButtonListModeIconPosition>("iconPosition", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get iconPosition(): TCh5ButtonListModeIconPosition {
    return this._ch5Properties.get<TCh5ButtonListModeIconPosition>("iconPosition");
  }

  public set iconClass(value: string) {
    this._ch5Properties.set<string>("iconClass", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get iconClass(): string {
    return this._ch5Properties.get<string>("iconClass");
  }

  public set iconUrl(value: string) {
    this._ch5Properties.set<string>("iconUrl", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get iconUrl(): string {
    return this._ch5Properties.get<string>("iconUrl");
  }

  public set customClass(value: string) {
    this._ch5Properties.set<string>("customClass", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get customClass(): string {
    return this._ch5Properties.get<string>("customClass");
  }

  public set customStyle(value: string) {
    this._ch5Properties.set<string>("customStyle", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
    });
  }
  public get customStyle(): string {
    return this._ch5Properties.get<string>("customStyle");
  }

  public set labelInnerHTML(value: string) {
    this._ch5Properties.set<string>("labelInnerHTML", value, () => {
      this._parentCh5ButtonList.debounceButtonDisplay();
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
      && window.customElements.get(Ch5ButtonListMode.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonListMode.ELEMENT_NAME, Ch5ButtonListMode);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5ButtonListMode.ELEMENT_NAME);
    this._ch5Properties = new Ch5Properties(this, Ch5ButtonListMode.COMPONENT_PROPERTIES);
    this._parentCh5ButtonList = this.getParentButton();
  }

  public static get observedAttributes(): string[] {
    const commonAttributes = Ch5Log.observedAttributes;
    for (let i: number = 0; i < Ch5ButtonListMode.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListMode.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        commonAttributes.push(Ch5ButtonListMode.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return commonAttributes;
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this.logger.log('ch5-button-list-mode attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ButtonListMode.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonListMode component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5ButtonListMode.ELEMENT_NAME);
    if (_.isNil(this._parentCh5ButtonList)) {
      throw new Error(`Invalid parent element for ch5-button-list-mode.`);
    }
    this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonListMode);
    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', Ch5ButtonListMode.ELEMENT_NAME);
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5ButtonListMode.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListMode.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ButtonListMode.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ButtonListMode.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  public getParentButton(): Ch5ButtonList {
    const getTheMatchingParent = (node: Node): Ch5ButtonList => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-BUTTON-LIST") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5ButtonList;
    }
    return getTheMatchingParent(this.parentElement as Node);
  }

  //#endregion

}

Ch5ButtonListMode.registerCustomElement();

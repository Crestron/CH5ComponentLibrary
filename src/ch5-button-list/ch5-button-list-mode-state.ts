import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { TCh5ButtonListModeStateState, TCh5ButtonListModeStateType, TCh5ButtonListModeStateHAlignLabel, TCh5ButtonListModeStateVAlignLabel, TCh5ButtonListModeStateCheckboxPosition, TCh5ButtonListModeStateIconPosition, } from './interfaces/t-ch5-button-list-mode-state';
import { ICh5ButtonListModeStateAttributes } from './interfaces/i-ch5-button-list-mode-state-attributes';
import { Ch5ButtonListMode } from "./ch5-button-list-mode";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5ButtonList } from "./ch5-button-list";
import _ from "lodash";

export class Ch5ButtonListModeState extends Ch5Common implements ICh5ButtonListModeStateAttributes {

  //#region Variables

  public static readonly STATE: TCh5ButtonListModeStateState[] = ['normal', 'pressed', 'selected'];
  public static readonly TYPE: TCh5ButtonListModeStateType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly H_ALIGN_LABEL: TCh5ButtonListModeStateHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly V_ALIGN_LABEL: TCh5ButtonListModeStateVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly CHECKBOX_POSITION: TCh5ButtonListModeStateCheckboxPosition[] = ['left', 'right'];
  public static readonly ICON_POSITION: TCh5ButtonListModeStateIconPosition[] = ['first', 'last', 'top', 'bottom'];

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5ButtonListModeState.STATE[0],
      enumeratedValues: Ch5ButtonListModeState.STATE,
      name: "state",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeState.STATE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeState.TYPE[0],
      enumeratedValues: Ch5ButtonListModeState.TYPE,
      name: "type",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeState.TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeState.H_ALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonListModeState.H_ALIGN_LABEL,
      name: "hAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeState.H_ALIGN_LABEL[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeState.V_ALIGN_LABEL[0],
      enumeratedValues: Ch5ButtonListModeState.V_ALIGN_LABEL,
      name: "vAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeState.V_ALIGN_LABEL[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeState.CHECKBOX_POSITION[0],
      enumeratedValues: Ch5ButtonListModeState.CHECKBOX_POSITION,
      name: "checkboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeState.CHECKBOX_POSITION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeState.ICON_POSITION[0],
      enumeratedValues: Ch5ButtonListModeState.ICON_POSITION,
      name: "iconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeState.ICON_POSITION[0],
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

  public static readonly ELEMENT_NAME = 'ch5-button-list-mode-state';

  private _ch5Properties: Ch5Properties;
  private _parentCh5Button: Ch5ButtonList;

  //#endregion

  //#region Getters and Setters

  public set state(value: TCh5ButtonListModeStateState) {
    this._ch5Properties.set<TCh5ButtonListModeStateState>("state", value);
  }
  public get state(): TCh5ButtonListModeStateState {
    return this._ch5Properties.get<TCh5ButtonListModeStateState>("state");
  }

  public set type(value: TCh5ButtonListModeStateType) {
    this._ch5Properties.set<TCh5ButtonListModeStateType>("type", value);
  }
  public get type(): TCh5ButtonListModeStateType {
    return this._ch5Properties.get<TCh5ButtonListModeStateType>("type");
  }

  public set hAlignLabel(value: TCh5ButtonListModeStateHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListModeStateHAlignLabel>("hAlignLabel", value);
  }
  public get hAlignLabel(): TCh5ButtonListModeStateHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListModeStateHAlignLabel>("hAlignLabel");
  }

  public set vAlignLabel(value: TCh5ButtonListModeStateVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListModeStateVAlignLabel>("vAlignLabel", value);
  }
  public get vAlignLabel(): TCh5ButtonListModeStateVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListModeStateVAlignLabel>("vAlignLabel");
  }

  public set checkboxPosition(value: TCh5ButtonListModeStateCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListModeStateCheckboxPosition>("checkboxPosition", value);
  }
  public get checkboxPosition(): TCh5ButtonListModeStateCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListModeStateCheckboxPosition>("checkboxPosition");
  }

  public set iconPosition(value: TCh5ButtonListModeStateIconPosition) {
    this._ch5Properties.set<TCh5ButtonListModeStateIconPosition>("iconPosition", value);
  }
  public get iconPosition(): TCh5ButtonListModeStateIconPosition {
    return this._ch5Properties.get<TCh5ButtonListModeStateIconPosition>("iconPosition");
  }

  public set iconClass(value: string) {
    this._ch5Properties.set<string>("iconClass", value);
  }
  public get iconClass(): string {
    return this._ch5Properties.get<string>("iconClass");
  }

  public set iconUrl(value: string) {
    this._ch5Properties.set<string>("iconUrl", value);
  }
  public get iconUrl(): string {
    return this._ch5Properties.get<string>("iconUrl");
  }

  public set customClass(value: string) {
    this._ch5Properties.set<string>("customClass", value);
  }
  public get customClass(): string {
    return this._ch5Properties.get<string>("customClass");
  }

  public set customStyle(value: string) {
    this._ch5Properties.set<string>("customStyle", value);
  }
  public get customStyle(): string {
    return this._ch5Properties.get<string>("customStyle");
  }

  public set labelInnerHTML(value: string) {
    this._ch5Properties.set<string>("labelInnerHTML", value);
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
      && window.customElements.get(Ch5ButtonListModeState.ELEMENT_NAME) === undefined) {
      window.customElements.define(Ch5ButtonListModeState.ELEMENT_NAME, Ch5ButtonListModeState);
    }
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5ButtonListModeState.ELEMENT_NAME);
    this.ignoreAttributes = ['customclass', 'customstyle', 'show', 'noshowtype', 'disabled', 'gestureable', 'receivestatecustomclass', 'receivestatecustomstyle',
      'receivestateshow', 'receivestateshowpulse', 'receivestatehidepulse', 'receivestateenable', 'sendeventonshow', 'dir', 'appendclasswheninviewport'];
    this._ch5Properties = new Ch5Properties(this, Ch5ButtonListModeState.COMPONENT_PROPERTIES);
    this._parentCh5Button = this.getParentButton();
    this.logger.stop();

  }

  public static get observedAttributes(): string[] {
    const newObsAttrs: string[] = ['debug', 'trace'];
    for (let i: number = 0; i < Ch5ButtonListModeState.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListModeState.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5ButtonListModeState.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return newObsAttrs;
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.primaryCssClass);
    if (oldValue !== newValue) {
      this.logger.log('ch5-button-list-mode-state attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ButtonListModeState.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonListModeState component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5ButtonListModeState.ELEMENT_NAME);

    if (!(this.parentElement instanceof Ch5ButtonListMode)) {
      throw new Error(`Invalid parent element for ch5-button-list-mode-state.`);
    }
    if (_.isNil(this._parentCh5Button)) {
      throw new Error(`Missing parent ch5-button-list element for ch5-button-list-mode-state.`);
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonListModeState);
    }
    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', Ch5ButtonListModeState.ELEMENT_NAME);
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5ButtonListModeState.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListModeState.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ButtonListModeState.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ButtonListModeState.COMPONENT_PROPERTIES[i].name;
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

Ch5ButtonListModeState.registerCustomElement();

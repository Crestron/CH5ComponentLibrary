import _ from "lodash";
import { Ch5Log } from "../../ch5-common/ch5-log";
import { Ch5ButtonList } from "./../ch5-button-list";
import { Ch5Properties } from "../../ch5-core/ch5-properties";
import { Ch5ButtonListModeBase } from "./ch5-button-list-mode-base";
import { ICh5PropertySettings } from "../../ch5-core/ch5-property";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import { ICh5ButtonListModeStateAttributes } from './../interfaces/i-ch5-button-list-mode-state-attributes';
import { TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonModeState, TCh5ButtonListButtonType, TCh5ButtonListButtonVAlignLabel } from "./../interfaces/t-ch5-button-list";

export class Ch5ButtonListModeStateBase extends Ch5Log implements ICh5ButtonListModeStateAttributes {

  //#region Variables

  public static readonly STATES: TCh5ButtonListButtonModeState[] = ['normal', 'pressed', 'selected'];
  public static readonly BUTTON_TYPES: TCh5ButtonListButtonType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly BUTTON_HALIGN_LABEL_POSITIONS: TCh5ButtonListButtonHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly BUTTON_VALIGN_LABEL_POSITIONS: TCh5ButtonListButtonVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly BUTTON_CHECKBOX_POSITIONS: TCh5ButtonListButtonCheckboxPosition[] = ['left', 'right'];
  public static readonly BUTTON_ICON_POSITIONS: TCh5ButtonListButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];

  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5ButtonListModeStateBase.STATES[0],
      enumeratedValues: Ch5ButtonListModeStateBase.STATES,
      name: "state",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeStateBase.STATES[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeStateBase.BUTTON_TYPES[0],
      enumeratedValues: Ch5ButtonListModeStateBase.BUTTON_TYPES,
      name: "type",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeStateBase.BUTTON_TYPES[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeStateBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonListModeStateBase.BUTTON_HALIGN_LABEL_POSITIONS,
      name: "hAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeStateBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeStateBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonListModeStateBase.BUTTON_VALIGN_LABEL_POSITIONS,
      name: "vAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeStateBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeStateBase.BUTTON_CHECKBOX_POSITIONS[0],
      enumeratedValues: Ch5ButtonListModeStateBase.BUTTON_CHECKBOX_POSITIONS,
      name: "checkboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeStateBase.BUTTON_CHECKBOX_POSITIONS[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListModeStateBase.BUTTON_ICON_POSITIONS[0],
      enumeratedValues: Ch5ButtonListModeStateBase.BUTTON_ICON_POSITIONS,
      name: "iconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListModeStateBase.BUTTON_ICON_POSITIONS[0],
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

  public static ELEMENT_NAME = 'ch5-button-list-mode-state';

  private _ch5Properties: Ch5Properties;
  private _parentCh5ButtonList: Ch5ButtonList;

  //#endregion

  //#region Getters and Setters

  public set state(value: TCh5ButtonListButtonModeState) {
    this._ch5Properties.set<TCh5ButtonListButtonModeState>("state", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get state(): TCh5ButtonListButtonModeState {
    return this._ch5Properties.get<TCh5ButtonListButtonModeState>("state");
  }

  public set type(value: TCh5ButtonListButtonType) {
    this._ch5Properties.set<TCh5ButtonListButtonType>("type", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get type(): TCh5ButtonListButtonType {
    return this._ch5Properties.get<TCh5ButtonListButtonType>("type");
  }

  public set hAlignLabel(value: TCh5ButtonListButtonHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonHAlignLabel>("hAlignLabel", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get hAlignLabel(): TCh5ButtonListButtonHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonHAlignLabel>("hAlignLabel");
  }

  public set vAlignLabel(value: TCh5ButtonListButtonVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonVAlignLabel>("vAlignLabel", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get vAlignLabel(): TCh5ButtonListButtonVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonVAlignLabel>("vAlignLabel");
  }

  public set checkboxPosition(value: TCh5ButtonListButtonCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonCheckboxPosition>("checkboxPosition", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get checkboxPosition(): TCh5ButtonListButtonCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonCheckboxPosition>("checkboxPosition");
  }

  public set iconPosition(value: TCh5ButtonListButtonIconPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonIconPosition>("iconPosition", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get iconPosition(): TCh5ButtonListButtonIconPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonIconPosition>("iconPosition");
  }

  public set iconClass(value: string) {
    this._ch5Properties.set<string>("iconClass", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get iconClass(): string {
    return this._ch5Properties.get<string>("iconClass");
  }

  public set iconUrl(value: string) {
    this._ch5Properties.set<string>("iconUrl", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get iconUrl(): string {
    return this._ch5Properties.get<string>("iconUrl");
  }

  public set customClass(value: string) {
    this._ch5Properties.set<string>("customClass", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get customClass(): string {
    return this._ch5Properties.get<string>("customClass");
  }

  public set customStyle(value: string) {
    this._ch5Properties.set<string>("customStyle", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get customStyle(): string {
    return this._ch5Properties.get<string>("customStyle");
  }

  public set labelInnerHTML(value: string) {
    this._ch5Properties.set<string>("labelInnerHTML", value, () => {
      if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
        this._parentCh5ButtonList.debounceButtonDisplay();
      }
    });
  }
  public get labelInnerHTML(): string {
    return this._ch5Properties.get<string>("labelInnerHTML");
  }

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.logger.start('constructor()', Ch5ButtonListModeStateBase.ELEMENT_NAME);
    this._ch5Properties = new Ch5Properties(this, Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES);
    this._parentCh5ButtonList = this.getParentButton();
    this.logger.stop();

  }

  public static get observedAttributes(): string[] {
    const commonAttributes = Ch5Log.observedAttributes;
    for (let i: number = 0; i < Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        commonAttributes.push(Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return commonAttributes;
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback " + Ch5ButtonListModeStateBase.ELEMENT_NAME);
    if (oldValue !== newValue) {
      this.logger.log(Ch5ButtonListModeStateBase.ELEMENT_NAME + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonListModeStateBase component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()', Ch5ButtonListModeStateBase.ELEMENT_NAME);

    if (!(this.parentElement instanceof Ch5ButtonListModeBase)) {
      throw new Error(`Invalid parent element for ${Ch5ButtonListModeStateBase.ELEMENT_NAME}.`);
    }
    if (_.isNil(this._parentCh5ButtonList)) {
      throw new Error(`Missing parent ${Ch5ButtonList.ELEMENT_NAME} element for ${Ch5ButtonListModeStateBase.ELEMENT_NAME}.`);
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonListModeState);
    }
    this.setAttribute('data-ch5-id', this.getCrId());
    this.initAttributes();
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()', Ch5ButtonListModeStateBase.ELEMENT_NAME);
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ButtonListModeStateBase.COMPONENT_PROPERTIES[i].name;
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


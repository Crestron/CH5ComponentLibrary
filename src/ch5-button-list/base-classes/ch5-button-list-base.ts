import { Ch5Button } from "../../ch5-button/ch5-button";
import { Ch5Common } from "../../ch5-common/ch5-common";
import { Ch5ButtonMode } from "../../ch5-button/ch5-button-mode";
import { Ch5ButtonLabel } from "../../ch5-button/ch5-button-label";
import { Ch5SignalElementAttributeRegistryEntries } from "../../ch5-common/ch5-signal-attribute-registry";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import {
  TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel,
  TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape,
  TCh5ButtonListAttributesOrientation, TCh5ButtonListAttributesStretch, TCh5ButtonListContractItemLabelType,
  TCh5ButtonListContractItemIconType, TCh5ButtonListSgIconTheme, TCh5ButtonListAttributesLoadItems, TCh5ButtonListButtonIconUrlFillType
} from './../interfaces/t-ch5-button-list';
import { ICh5ButtonListContractObj } from '../interfaces/t-for-ch5-button-list-contract';
import { ICh5ButtonListAttributes } from './../interfaces/i-ch5-button-list-attributes';
import { Ch5Properties } from "../../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../../ch5-core/ch5-property";
import { Ch5ButtonListModeBase } from "./ch5-button-list-mode-base";
import { Ch5ButtonListModeStateBase } from "./ch5-button-list-mode-state-base";
import { Ch5ButtonModeState } from "../../ch5-button/ch5-button-mode-state";
import { resizeObserver } from "../../ch5-core/resize-observer";
import { Ch5AugmentVarSignalsNames } from '../../ch5-common/ch5-augment-var-signals-names';
import { Ch5Signal } from "../../ch5-core/ch5-signal";
import { Ch5SignalFactory } from "../../ch5-core/ch5-signal-factory";
import _ from "lodash";

export class Ch5ButtonListBase extends Ch5Common implements ICh5ButtonListAttributes {

  //#region Variables

  // ClassList Prefix
  public static readonly ROWS_CLASSLIST_PREFIX: string = '--rows-';
  public static readonly COLUMNS_CLASSLIST_PREFIX: string = '--columns-';
  public static readonly SCROLLBAR_CLASSLIST_PREFIX: string = '--scrollbar-';
  public static readonly CENTER_ITEMS_CLASSLIST_PREFIX: string = '--center-items-';

  // Button container dimension and Buffer values
  public static readonly BUTTON_CONTAINER_BUFFER: number = 4;
  public static readonly MODES_MAX_COUNT: number = 5;

  // Enum types
  public static readonly ORIENTATION: TCh5ButtonListAttributesOrientation[] = ['horizontal', 'vertical'];
  public static readonly LOAD_ITEMS: TCh5ButtonListAttributesLoadItems[] = ['visible-only', 'load-new', 'all'];
  public static readonly STRETCH: TCh5ButtonListAttributesStretch[] = ['both'];
  public static readonly CONTRACT_ITEM_LABEL_TYPE: TCh5ButtonListContractItemLabelType[] = ['none', 'textContent', 'innerHTML'];
  public static readonly CONTRACT_ITEM_ICON_TYPE: TCh5ButtonListContractItemIconType[] = ['none', 'iconClass', 'url', 'sgStateName', 'sgStateNumber'];
  public static readonly BUTTON_TYPES: TCh5ButtonListButtonType[] = ['default', 'danger', 'text', 'warning', 'info', 'success', 'primary', 'secondary'];
  public static readonly BUTTON_HALIGN_LABEL_POSITIONS: TCh5ButtonListButtonHAlignLabel[] = ['center', 'left', 'right'];
  public static readonly BUTTON_VALIGN_LABEL_POSITIONS: TCh5ButtonListButtonVAlignLabel[] = ['middle', 'top', 'bottom'];
  public static readonly BUTTON_CHECKBOX_POSITIONS: TCh5ButtonListButtonCheckboxPosition[] = ['left', 'right'];
  public static readonly BUTTON_ICON_POSITIONS: TCh5ButtonListButtonIconPosition[] = ['first', 'last', 'top', 'bottom'];
  public static readonly BUTTON_SHAPES: TCh5ButtonListButtonShape[] = ['rectangle', 'rounded-rectangle'];
  public static readonly BUTTON_ICON_URL_FILL_TYPE: TCh5ButtonListButtonIconUrlFillType[] = ['stretch', 'stretch-aspect', 'center', 'tile', 'initial'];
  public static readonly SG_ICON_THEME: TCh5ButtonListSgIconTheme[] = ['icons-lg', 'icons-sm', 'media-transports-accents', 'media-transports-light', 'media-transports-dark'];

  public static COMPONENT_DATA: any = {
    ORIENTATION: {
      default: Ch5ButtonListBase.ORIENTATION[0],
      values: Ch5ButtonListBase.ORIENTATION,
      key: 'orientation',
      attribute: 'orientation',
      classListPrefix: '--orientation-'
    },
    LOAD_ITEMS: {
      default: Ch5ButtonListBase.LOAD_ITEMS[0],
      values: Ch5ButtonListBase.LOAD_ITEMS,
      key: 'loadItems',
      attribute: 'loadItems',
      classListPrefix: '--load-items-'
    },
    STRETCH: {
      default: Ch5ButtonListBase.STRETCH[0],
      values: Ch5ButtonListBase.STRETCH,
      key: 'stretch',
      attribute: 'stretch',
      classListPrefix: '--stretch-'
    },
    BUTTON_TYPE: {
      default: Ch5ButtonListBase.BUTTON_TYPES[0],
      values: Ch5ButtonListBase.BUTTON_TYPES,
      key: 'buttonType',
      attribute: 'buttonType',
      classListPrefix: '--button-type-'
    },
    BUTTON_HALIGN_LABEL: {
      default: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS,
      key: 'buttonHAlignLabel',
      attribute: 'buttonHAlignLabel',
      classListPrefix: '--button-halign-label-'
    },
    BUTTON_VALIGN_LABEL: {
      default: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS,
      key: 'buttonVAlignLabel',
      attribute: 'buttonVAlignLabel',
      classListPrefix: '--button-valign-label-'
    },
    BUTTON_CHECKBOX_POSITION: {
      default: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS,
      key: 'buttonCheckboxPosition',
      attribute: 'buttonCheckboxPosition',
      classListPrefix: '--button-checkbox-position-'
    },
    BUTTON_ICON_POSITION: {
      default: Ch5ButtonListBase.BUTTON_ICON_POSITIONS[0],
      values: Ch5ButtonListBase.BUTTON_ICON_POSITIONS,
      key: 'buttonIconPosition',
      attribute: 'buttonIconPosition',
      classListPrefix: '--button-icon-position-'
    },
    BUTTON_SHAPE: {
      default: Ch5ButtonListBase.BUTTON_SHAPES[0],
      values: Ch5ButtonListBase.BUTTON_SHAPES,
      key: 'buttonShape',
      attribute: 'buttonShape',
      classListPrefix: '--button-shape-'
    },
    BUTTON_ICON_URL_FILL_TYPE: {
      default: Ch5ButtonListBase.BUTTON_ICON_URL_FILL_TYPE[0],
      values: Ch5ButtonListBase.BUTTON_ICON_URL_FILL_TYPE,
      key: 'buttonIconUrlFillType',
      attribute: 'buttonIconUrlFillType',
      classListPrefix: '--button-icon-url-fill-type-'
    },
    CONTRACT_ITEM_LABEL_TYPE: {
      default: Ch5ButtonListBase.CONTRACT_ITEM_LABEL_TYPE[0],
      values: Ch5ButtonListBase.CONTRACT_ITEM_LABEL_TYPE,
      key: 'contractItemLabelType',
      attribute: 'contractItemLabelType',
      classListPrefix: 'ch5-general--contract-item-label-type-'
    },
    CONTRACT_ITEM_ICON_TYPE: {
      default: Ch5ButtonListBase.CONTRACT_ITEM_ICON_TYPE[0],
      values: Ch5ButtonListBase.CONTRACT_ITEM_ICON_TYPE,
      key: 'contractItemIconType',
      attribute: 'contractItemIconType',
      classListPrefix: 'ch5-general--contract-item-icon-type-'
    }
  };


  public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
    ...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
    receiveStateNumberOfItems: { direction: "state", numericJoin: 1, contractName: true },
    receiveStateScrollToPosition: { direction: "state", numericJoin: 1, contractName: true },
    receivestateselectedbutton: { direction: "state", numericJoin: 1, contractName: true },
  };
  public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
    {
      default: Ch5ButtonListBase.ORIENTATION[0],
      enumeratedValues: Ch5ButtonListBase.ORIENTATION,
      name: "orientation",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.ORIENTATION[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListBase.LOAD_ITEMS[0],
      enumeratedValues: Ch5ButtonListBase.LOAD_ITEMS,
      name: "loadItems",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.LOAD_ITEMS[0],
      isObservableProperty: true,
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
      default: false,
      name: "centerItems",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: null,
      enumeratedValues: Ch5ButtonListBase.STRETCH,
      name: "stretch",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: null,
      isObservableProperty: true,
      isNullable: true,
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
      name: "rows",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
      numberProperties: {
        min: 1,
        max: 500,
        conditionalMin: 1,
        conditionalMax: 500,
        conditionalMinValue: 1,
        conditionalMaxValue: 500
      },
      isObservableProperty: true
    },
    {
      default: 1,
      name: "columns",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: 1,
      numberProperties: {
        min: 1,
        max: 500,
        conditionalMin: 1,
        conditionalMax: 500,
        conditionalMinValue: 1,
        conditionalMaxValue: 500
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
      default: 10,
      name: "numberOfItems",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateNumberOfItems",
      type: "number",
      valueOnAttributeEmpty: 10,
      numberProperties: {
        min: 1,
        max: 500,
        conditionalMin: 1,
        conditionalMax: 500,
        conditionalMinValue: 1,
        conditionalMaxValue: 500
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateNumberOfItems",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: 0,
      name: "scrollToPosition",
      removeAttributeOnNull: true,
      nameForSignal: "receiveStateScrollToPosition",
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 499,
        conditionalMin: 0,
        conditionalMax: 499,
        conditionalMinValue: 0,
        conditionalMaxValue: 499
      },
      isObservableProperty: true
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateScrollToPosition",
      signalType: "number",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      isSignal: true,
      name: "receiveStateSelectedButton",
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
      default: false,
      name: "useContractForItemEnable",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForItemShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForCustomStyle",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForCustomClass",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForEachButtonSelection",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListBase.CONTRACT_ITEM_LABEL_TYPE[0],
      enumeratedValues: Ch5ButtonListBase.CONTRACT_ITEM_LABEL_TYPE,
      name: "contractItemLabelType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.CONTRACT_ITEM_LABEL_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListBase.CONTRACT_ITEM_ICON_TYPE[0],
      enumeratedValues: Ch5ButtonListBase.CONTRACT_ITEM_ICON_TYPE,
      name: "contractItemIconType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.CONTRACT_ITEM_ICON_TYPE[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "useContractForNumItems",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true,
    },
    {
      default: Ch5ButtonListBase.BUTTON_TYPES[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_TYPES,
      name: "buttonType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_TYPES[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS,
      name: "buttonHAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_HALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS,
      name: "buttonVAlignLabel",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_VALIGN_LABEL_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS,
      name: "buttonCheckboxPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_CHECKBOX_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_ICON_POSITIONS[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_ICON_POSITIONS,
      name: "buttonIconPosition",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_ICON_POSITIONS[0],
      isObservableProperty: true
    },
    {
      default: Ch5ButtonListBase.BUTTON_SHAPES[0],
      enumeratedValues: Ch5ButtonListBase.BUTTON_SHAPES,
      name: "buttonShape",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.BUTTON_SHAPES[0],
      isObservableProperty: true
    },
    {
      default: null,
      enumeratedValues: Ch5ButtonListBase.BUTTON_ICON_URL_FILL_TYPE,
      name: "buttonIconUrlFillType",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: null,
      isObservableProperty: true,
      isNullable: true
    },
    {
      default: Ch5ButtonListBase.SG_ICON_THEME[0],
      enumeratedValues: Ch5ButtonListBase.SG_ICON_THEME,
      name: "buttonSgIconTheme",
      removeAttributeOnNull: true,
      type: "enum",
      valueOnAttributeEmpty: Ch5ButtonListBase.SG_ICON_THEME[0],
      isObservableProperty: true,
    },
    {
      default: false,
      name: "buttonCheckboxShow",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: false,
      name: "buttonSelected",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: false,
      name: "buttonPressed",
      removeAttributeOnNull: true,
      type: "boolean",
      valueOnAttributeEmpty: true,
      isObservableProperty: true
    },
    {
      default: 0,
      name: "buttonMode",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 4,
        conditionalMin: 0,
        conditionalMax: 4,
        conditionalMinValue: 0,
        conditionalMaxValue: 0
      },
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonLabelInnerHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateMode",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateSelected",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateLabel",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateScriptLabelHtml",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateIconClass",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateIconUrl",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateSGIconNumeric",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateSGIconString",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonSendEventOnClick",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true
    },
    {
      default: "",
      name: "buttonReceiveStateShow",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: "",
      name: "buttonReceiveStateEnable",
      removeAttributeOnNull: true,
      type: "string",
      valueOnAttributeEmpty: "",
      isObservableProperty: true,
    },
    {
      default: 1500,
      name: "clickHoldTime",
      removeAttributeOnNull: true,
      type: "number",
      valueOnAttributeEmpty: null,
      numberProperties: {
        min: 0,
        max: 120000,
        conditionalMin: 0,
        conditionalMax: 120000,
        conditionalMinValue: 0,
        conditionalMaxValue: 120000
      },
      isObservableProperty: true
    }
  ];

  public primaryCssClass = '';
  protected _ch5Properties: Ch5Properties;
  protected _elContainer: HTMLElement = {} as HTMLElement;
  private _scrollbarContainer: HTMLElement = {} as HTMLElement;
  private _scrollbar: HTMLElement = {} as HTMLElement;

  // private members used for mouse up and down
  private isDown = false;
  private startX: number = 0;
  private startY: number = 0;
  private scrollListLeft: number = 0;
  private scrollListTop: number = 0;
  private scrollbarDimension: number = 0;
  private buttonWidth: number = 0;
  private buttonHeight: number = 0;

  private signalNameOnContract = {
    contractName: "",
    receiveStateCustomClass: "",
    receiveStateCustomStyle: "",
    receiveStateEnable: "",
    receiveStateShow: "",
    receiveStateScrollToPosition: "",
    receiveStateNumberOfItems: "",
    receiveStateSelectedButton: ""
  }

  // Default Row and Column value
  private rowClassValue: number = 1;
  private columnClassValue: number = 1;
  private selectedButton: number = 0;

  private showSignalHolder: any = [];
  private loadButtonForShow: boolean = false;
  private allButtonsVisible: boolean = false;

  public debounceButtonDisplay = this.debounce((isReceiveStateScrollTo = false) => {
    if (this.loadItems === "visible-only") {
      this.buttonDisplay(isReceiveStateScrollTo);
    } else if (this.loadItems === "load-new") {
      this.buttonDisplayForLoadItemsNew(isReceiveStateScrollTo);
    } else {
      this.buttonDisplayForLoadItemsAll(isReceiveStateScrollTo);
    }
  }, 100);

  public debounceButtonShow = this.debounce(() => {
    this.buttonShow();
  }, 150);

  //#endregion

  //#region Getters and Setters


  public set orientation(value: TCh5ButtonListAttributesOrientation) {
    this._ch5Properties.set<TCh5ButtonListAttributesOrientation>("orientation", value, () => {
      this.handleOrientation();
    });
  }
  public get orientation(): TCh5ButtonListAttributesOrientation {
    return this._ch5Properties.get<TCh5ButtonListAttributesOrientation>("orientation");
  }

  public set loadItems(value: TCh5ButtonListAttributesLoadItems) {
    this._ch5Properties.set<TCh5ButtonListAttributesLoadItems>("loadItems", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get loadItems(): TCh5ButtonListAttributesLoadItems {
    return this._ch5Properties.get<TCh5ButtonListAttributesLoadItems>("loadItems");
  }

  public set scrollbar(value: boolean) {
    this._ch5Properties.set<boolean>("scrollbar", value, () => {
      this.handleScrollbar();
    });
  }
  public get scrollbar(): boolean {
    return this._ch5Properties.get<boolean>("scrollbar");
  }

  public set centerItems(value: boolean) {
    this._ch5Properties.set<boolean>("centerItems", value, () => {
      this.handleCenterItems();
    });
  }
  public get centerItems(): boolean {
    return this._ch5Properties.get<boolean>("centerItems");
  }

  public set stretch(value: TCh5ButtonListAttributesStretch | null) {
    this._ch5Properties.set<TCh5ButtonListAttributesStretch | null>("stretch", value, () => {
      this.handleStretch();
    });
  }
  public get stretch(): TCh5ButtonListAttributesStretch | null {
    return this._ch5Properties.get<TCh5ButtonListAttributesStretch | null>("stretch");
  }

  public set buttonIconUrlFillType(value: TCh5ButtonListButtonIconUrlFillType | null) {
    this._ch5Properties.set<TCh5ButtonListButtonIconUrlFillType | null>("buttonIconUrlFillType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconUrlFillType(): TCh5ButtonListButtonIconUrlFillType | null {
    return this._ch5Properties.get<TCh5ButtonListButtonIconUrlFillType | null>("buttonIconUrlFillType");
  }

  public set endless(value: boolean) {
    this._ch5Properties.set<boolean>("endless", value, () => {
      this.handleEndless();
    });
  }
  public get endless(): boolean {
    return this._ch5Properties.get<boolean>("endless");
  }

  public set numberOfItems(value: number) {
    this._ch5Properties.set<number>("numberOfItems", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get numberOfItems(): number {
    return this._ch5Properties.get<number>("numberOfItems");
  }

  public set rows(value: number) {
    this._ch5Properties.set<number>("rows", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get rows(): number {
    return this._ch5Properties.get<number>("rows");
  }

  public set columns(value: number) {
    this._ch5Properties.set<number>("columns", value, () => {
      this.handleRowsAndColumn();
    });
  }
  public get columns(): number {
    return this._ch5Properties.get<number>("columns");
  }

  public set indexId(value: string) {
    this._ch5Properties.set<string>("indexId", value);
  }
  public get indexId(): string {
    return this._ch5Properties.get<string>("indexId");
  }

  public set receiveStateNumberOfItems(value: string) {
    this._ch5Properties.set("receiveStateNumberOfItems", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("numberOfItems", newValue, () => {
        this.handleRowsAndColumn();
      });
    });
  }
  public get receiveStateNumberOfItems(): string {
    return this._ch5Properties.get<string>('receiveStateNumberOfItems');
  }

  public set scrollToPosition(value: number) {
    this._ch5Properties.set<number>("scrollToPosition", value, () => {
      const withinValidRange = this.scrollToPosition < this.numberOfItems && this.scrollToPosition >= 0;
      const scrollToApplicable = ((this.orientation === 'horizontal' && this.rows === 1) || (this.orientation === "vertical" && this.columns === 1));
      if (withinValidRange && scrollToApplicable) {
        this.debounceButtonDisplay(true);
      }
    });
  }
  public get scrollToPosition(): number {
    return this._ch5Properties.get<number>("scrollToPosition");
  }

  public set receiveStateScrollToPosition(value: string) {
    this._ch5Properties.set("receiveStateScrollToPosition", value, null, (newValue: number) => {
      this._ch5Properties.setForSignalResponse<number>("scrollToPosition", newValue, () => {
        const withinValidRange = this.scrollToPosition < this.numberOfItems && this.scrollToPosition >= 0;
        const scrollToApplicable = ((this.orientation === 'horizontal' && this.rows === 1) || (this.orientation === "vertical" && this.columns === 1));
        if (withinValidRange && scrollToApplicable) {
          this.debounceButtonDisplay(true);
        }
      });
    });
  }
  public get receiveStateScrollToPosition(): string {
    return this._ch5Properties.get<string>('receiveStateScrollToPosition');
  }

  public set receiveStateSelectedButton(value: string) {
    this._ch5Properties.set("receiveStateSelectedButton", value, null, (newValue: number) => {
      const fromJoin = this.contractName === "";
      const fromContract = this.contractName !== "" && this.useContractForEachButtonSelection === true && this.receiveStateSelectedButton === this.contractName + '.ItemSelected';
      if (fromJoin || fromContract) {
        this.selectedButton = newValue;
        this.handleReceiveStateSelectedButton();
      }
    });
  }
  public get receiveStateSelectedButton(): string {
    return this._ch5Properties.get<string>('receiveStateSelectedButton');
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
      this.debounceButtonDisplay();
    });
  }
  public get useContractForEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEnable");
  }

  public set useContractForShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForShow");
  }

  public set useContractForItemEnable(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForItemEnable", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForItemEnable(): boolean {
    return this._ch5Properties.get<boolean>("useContractForItemEnable");
  }

  public set useContractForItemShow(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForItemShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForItemShow(): boolean {
    return this._ch5Properties.get<boolean>("useContractForItemShow");
  }

  public set useContractForCustomStyle(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForCustomStyle(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomStyle");
  }

  public set useContractForCustomClass(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForCustomClass(): boolean {
    return this._ch5Properties.get<boolean>("useContractForCustomClass");
  }

  public set useContractForEachButtonSelection(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForEachButtonSelection", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForEachButtonSelection(): boolean {
    return this._ch5Properties.get<boolean>("useContractForEachButtonSelection");
  }

  public set contractItemLabelType(value: TCh5ButtonListContractItemLabelType) {
    this._ch5Properties.set<TCh5ButtonListContractItemLabelType>("contractItemLabelType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractItemLabelType(): TCh5ButtonListContractItemLabelType {
    return this._ch5Properties.get<TCh5ButtonListContractItemLabelType>("contractItemLabelType");
  }

  public set contractItemIconType(value: TCh5ButtonListContractItemIconType) {
    this._ch5Properties.set<TCh5ButtonListContractItemIconType>("contractItemIconType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get contractItemIconType(): TCh5ButtonListContractItemIconType {
    return this._ch5Properties.get<TCh5ButtonListContractItemIconType>("contractItemIconType");
  }

  public set useContractForNumItems(value: boolean) {
    this._ch5Properties.set<boolean>("useContractForNumItems", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get useContractForNumItems(): boolean {
    return this._ch5Properties.get<boolean>("useContractForNumItems");
  }

  public set buttonType(value: TCh5ButtonListButtonType) {
    this._ch5Properties.set<TCh5ButtonListButtonType>("buttonType", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonType(): TCh5ButtonListButtonType {
    return this._ch5Properties.get<TCh5ButtonListButtonType>("buttonType");
  }

  public set buttonHAlignLabel(value: TCh5ButtonListButtonHAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonHAlignLabel(): TCh5ButtonListButtonHAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonHAlignLabel>("buttonHAlignLabel");
  }

  public set buttonVAlignLabel(value: TCh5ButtonListButtonVAlignLabel) {
    this._ch5Properties.set<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonVAlignLabel(): TCh5ButtonListButtonVAlignLabel {
    return this._ch5Properties.get<TCh5ButtonListButtonVAlignLabel>("buttonVAlignLabel");
  }

  public set buttonCheckboxPosition(value: TCh5ButtonListButtonCheckboxPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonCheckboxPosition(): TCh5ButtonListButtonCheckboxPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonCheckboxPosition>("buttonCheckboxPosition");
  }

  public set buttonIconPosition(value: TCh5ButtonListButtonIconPosition) {
    this._ch5Properties.set<TCh5ButtonListButtonIconPosition>("buttonIconPosition", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconPosition(): TCh5ButtonListButtonIconPosition {
    return this._ch5Properties.get<TCh5ButtonListButtonIconPosition>("buttonIconPosition");
  }

  public set buttonShape(value: TCh5ButtonListButtonShape) {
    this._ch5Properties.set<TCh5ButtonListButtonShape>("buttonShape", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonShape(): TCh5ButtonListButtonShape {
    return this._ch5Properties.get<TCh5ButtonListButtonShape>("buttonShape");
  }

  public set buttonCheckboxShow(value: boolean) {
    this._ch5Properties.set<boolean>("buttonCheckboxShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonCheckboxShow(): boolean {
    return this._ch5Properties.get<boolean>("buttonCheckboxShow");
  }

  public set buttonSelected(value: boolean) {
    this._ch5Properties.set<boolean>("buttonSelected", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonSelected(): boolean {
    return this._ch5Properties.get<boolean>("buttonSelected");
  }

  public set buttonPressed(value: boolean) {
    this._ch5Properties.set<boolean>("buttonPressed", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonPressed(): boolean {
    return this._ch5Properties.get<boolean>("buttonPressed");
  }

  public set buttonMode(value: number) {
    this._ch5Properties.set<number>("buttonMode", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonMode(): number {
    return +this._ch5Properties.get<number>("buttonMode");
  }

  public set buttonIconClass(value: string) {
    this._ch5Properties.set<string>("buttonIconClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconClass(): string {
    return this._ch5Properties.get<string>("buttonIconClass");
  }

  public set buttonIconUrl(value: string) {
    this._ch5Properties.set<string>("buttonIconUrl", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonIconUrl(): string {
    return this._ch5Properties.get<string>("buttonIconUrl");
  }

  public set buttonLabelInnerHtml(value: string) {
    this._ch5Properties.set<string>("buttonLabelInnerHtml", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonLabelInnerHtml(): string {
    return this._ch5Properties.get<string>("buttonLabelInnerHtml");
  }

  public set buttonReceiveStateMode(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateMode", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateMode(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateMode");
  }

  public set buttonReceiveStateSelected(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateSelected", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateSelected(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateSelected");
  }

  public set buttonReceiveStateLabel(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateLabel", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateLabel(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateLabel");
  }

  public set buttonReceiveStateScriptLabelHtml(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateScriptLabelHtml", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateScriptLabelHtml(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateScriptLabelHtml");
  }

  public set buttonReceiveStateIconClass(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateIconClass", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateIconClass(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateIconClass");
  }

  public set buttonReceiveStateIconUrl(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateIconUrl", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateIconUrl(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateIconUrl");
  }
  public set buttonReceiveStateSGIconString(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateSGIconString", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateSGIconString(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateSGIconString");
  }
  public set buttonReceiveStateSGIconNumeric(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateSGIconNumeric", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateSGIconNumeric(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateSGIconNumeric");
  }
  public set buttonSgIconTheme(value: TCh5ButtonListSgIconTheme) {
    this._ch5Properties.set<TCh5ButtonListSgIconTheme>("buttonSgIconTheme", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonSgIconTheme(): TCh5ButtonListSgIconTheme {
    return this._ch5Properties.get<TCh5ButtonListSgIconTheme>("buttonSgIconTheme");
  }

  public set buttonSendEventOnClick(value: string) {
    this._ch5Properties.set<string>("buttonSendEventOnClick", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonSendEventOnClick(): string {
    return this._ch5Properties.get<string>("buttonSendEventOnClick");
  }

  public set buttonReceiveStateShow(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateShow", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateShow(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateShow");
  }

  public set buttonReceiveStateEnable(value: string) {
    this._ch5Properties.set<string>("buttonReceiveStateEnable", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get buttonReceiveStateEnable(): string {
    return this._ch5Properties.get<string>("buttonReceiveStateEnable");
  }
  public set clickHoldTime(value: number) {
    this._ch5Properties.set<number>("clickHoldTime", value, () => {
      this.debounceButtonDisplay();
    });
  }
  public get clickHoldTime(): number {
    return this._ch5Properties.get<number>("clickHoldTime");
  }

  //#endregion

  //#region Static Methods

  //#endregion

  //#region Component Lifecycle

  public constructor() {
    super();
    this.ignoreAttributes = ['receivestatehidepulse', 'receivestateshowpulse', 'sendeventonshow'];
    this.logger.start('constructor()');
    if (!this._wasInstatiated) {
      this.createInternalHtml();
    }
    this._wasInstatiated = true;
    this._ch5Properties = new Ch5Properties(this, Ch5ButtonListBase.COMPONENT_PROPERTIES);
    this.initCssClass();
  }

  public static get observedAttributes(): string[] {
    const inheritedObsAttrs = Ch5Common.observedAttributes;
    const newObsAttrs: string[] = [];
    for (let i: number = 0; i < Ch5ButtonListBase.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        newObsAttrs.push(Ch5ButtonListBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
      }
    }
    return inheritedObsAttrs.concat(newObsAttrs);
  }

  public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
    this.logger.start("attributeChangedCallback", this.nodeName);
    if (oldValue !== newValue) {
      this.logger.log('attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
      const attributeChangedProperty = Ch5ButtonListBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
   * Called when the Ch5ButtonListBase component is first connected to the DOM
   */
  public connectedCallback() {
    this.logger.start('connectedCallback()');
    // WAI-ARIA Attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonList);
    }
    this.checkInternalHTML();
    this.attachEventListeners();
    this.initAttributes();
    this.initCommonMutationObserver(this);
    this.debounceButtonDisplay();
    resizeObserver(this._elContainer, this.resizeHandler);
    customElements.whenDefined(this.nodeName.toLowerCase()).then(() => {
      this.componentLoadedEvent(this.nodeName.toLowerCase(), this.id);
    });
    this.logger.stop();
  }

  public disconnectedCallback() {
    this.logger.start('disconnectedCallback()');
    this.removeEventListeners();
    this.unsubscribeFromSignals();
    this.showSignalHolder.forEach((el: { signalValue: string, signalState: string, value: number }) => this.clearOldSubscription(el.signalValue, el.signalState));
    this.showSignalHolder = [];
    this.logger.stop();
  }

  //#endregion

  //#region Protected / Private Methods

  protected createInternalHtml() {
    this.logger.start('createInternalHtml()');
    this.clearComponentContent();
    this._elContainer = document.createElement('div');
    this._scrollbarContainer = document.createElement('div');
    this._scrollbar = document.createElement('div');
    this.logger.stop();
  }

  protected initAttributes() {
    super.initAttributes();

    const thisRef: any = this;
    for (let i: number = 0; i < Ch5ButtonListBase.COMPONENT_PROPERTIES.length; i++) {
      if (Ch5ButtonListBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
        if (this.hasAttribute(Ch5ButtonListBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
          const key = Ch5ButtonListBase.COMPONENT_PROPERTIES[i].name;
          thisRef[key] = this.getAttribute(key);
        }
      }
    }
  }

  protected attachEventListeners() {
    super.attachEventListeners();
    this._elContainer.addEventListener('mousedown', this.handleMouseDown);
    this._elContainer.addEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._elContainer.addEventListener('mouseup', this.handleMouseUpAndLeave);
    this._elContainer.addEventListener('mousemove', this.handleMouseMove);
    this._elContainer.addEventListener('scroll', this.handleScrollEvent);
  }

  protected removeEventListeners() {
    super.removeEventListeners();
    this._elContainer.removeEventListener('mouseleave', this.handleMouseUpAndLeave);
    this._elContainer.removeEventListener('mouseup', this.handleMouseUpAndLeave);
    this._elContainer.removeEventListener('mousedown', this.handleMouseDown);
    this._elContainer.removeEventListener('mousemove', this.handleMouseMove);
    this._elContainer.removeEventListener('scroll', this.handleScrollEvent);
  }

  protected unsubscribeFromSignals() {
    super.unsubscribeFromSignals();
    this._ch5Properties.unsubscribe();
  }

  private handleMouseDown = (e: MouseEvent) => {
    this.isDown = true;
    this._elContainer.classList.add('active');
    this.startX = e.pageX - this._elContainer.offsetLeft;
    this.startY = e.pageY - this._elContainer.offsetTop;
    this.scrollListLeft = this._elContainer.scrollLeft;
    this.scrollListTop = this._elContainer.scrollTop;
  }

  private handleMouseUpAndLeave = () => {
    this.isDown = false;
    this._elContainer.classList.remove('active');
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this._elContainer.offsetLeft;
    const y = e.pageY - this._elContainer.offsetTop;
    const walkX = (x - this.startX) * 3;
    const walkY = (y - this.startY) * 3;
    this._elContainer.scrollLeft = this.scrollListLeft - walkX;
    this._elContainer.scrollTop = this.scrollListTop - walkY;
  }

  private handleScrollEvent = () => {
    // update the scrollbar width and position
    this.initScrollbar();

    // endless is handled in endlessHelper method
    if (this.endless) {
      if (this.loadItems === "all") {
        this.buttonWidth = this._elContainer.children[0].getBoundingClientRect().width;
        this.buttonHeight = this._elContainer.children[0].getBoundingClientRect().height;
        return this.endlessHelper();
      } else if (this.loadItems === "load-new") {
        return this.endlessHelperForNew();
      }
      return this.endlessHelper();
    }

    if (this.loadItems === "visible-only") {
      this.scrollHelper();
    } else if (this.loadItems === "load-new") {
      this.scrollHelperForNew();
    }
  }

  private scrollHelperForNew() {
    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.buttonWidth) { return; }
      let lastElement = this.getLastChild();
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.buttonWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          this.createButton(++lastElement);
          if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
            let showValue = lastElement;
            while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
              this.createButton(++showValue);
            }
          }
        }
        this.initScrollbar();
      }
    } else if (this.orientation === 'horizontal') {
      // auto  addition of buttons is handled
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.buttonWidth) { return; }
      let lastElement = this.getLastChild();
      if (scrollLeft + offsetWidth > scrollWidth - this.buttonWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createButton(++lastElement);
            if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createButton(++showValue);
              }
            }
          }
        }
        this.initScrollbar();
      }
    } else {
      const { offsetHeight, scrollTop, scrollHeight } = this._elContainer;
      if (scrollHeight - offsetHeight < this.buttonHeight) { return; }
      let lastElement = this.getLastChild();
      if (scrollTop + offsetHeight > scrollHeight - this.buttonHeight && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.columns; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createButton(++lastElement);
            if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createButton(++showValue);
              }
            }
          }
        }
        this.initScrollbar();
      }
    }
  }

  private scrollHelper() {
    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.buttonWidth) { return; }
      let firstElement = this.getFirstChild();
      let lastElement = this.getLastChild();
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.buttonWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          this.createButton(++lastElement);
          if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
            let showValue = lastElement;
            while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
              this.createButton(++showValue);
            }
          }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft += this.buttonWidth;
      }
      else if (Math.abs(scrollLeft) < this.buttonWidth && firstElement !== 0) {
        let lastColumnElements = (lastElement + 1) % this.rows;
        for (let i = 0; i < this.rows; i++) {
          this.createButton(--firstElement, false);
          if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
            let showValue = firstElement;
            while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
              this.createButton(--showValue, false);
            }
          }
          if ((lastElement + 1) % this.rows !== 0) {
            if (lastColumnElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollLeft -= this.buttonWidth;
      }
    } else if (this.orientation === 'horizontal') {
      // auto deletion and addition of buttons is handled
      const { offsetWidth, scrollLeft, scrollWidth } = this._elContainer;
      if (scrollWidth - offsetWidth < this.buttonWidth) { return; }
      let firstElement = this.getFirstChild();
      let lastElement = this.getLastChild();
      if (scrollLeft < this.buttonWidth && firstElement !== 0) {
        let lastColumnElements = (lastElement + 1) % this.rows;
        for (let i = 0; i < this.rows; i++) {
          this.createButton(--firstElement, false);
          if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
            let showValue = firstElement;
            while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
              this.createButton(--showValue, false);
            }
          }
          if ((lastElement + 1) % this.rows !== 0) {
            if (lastColumnElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollLeft += this.buttonWidth;
      } else if (scrollLeft + offsetWidth > scrollWidth - this.buttonWidth && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.rows; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createButton(++lastElement);
            if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createButton(++showValue);
              }
            }
          }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft -= this.buttonWidth;
      }
    } else {
      const { offsetHeight, scrollTop, scrollHeight } = this._elContainer;
      if (scrollHeight - offsetHeight < this.buttonHeight) { return; }
      let firstElement = this.getFirstChild();
      let lastElement = this.getLastChild();
      if (scrollTop < this.buttonHeight && firstElement !== 0) {
        let lastRowElements = (lastElement + 1) % this.columns;
        for (let i = 0; i < this.columns; i++) {
          this.createButton(--firstElement, false);
          if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
            let showValue = firstElement;
            while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
              this.createButton(--showValue, false);
            }
          }
          if ((lastElement + 1) % this.columns !== 0) {
            if (lastRowElements-- > 0) { this._elContainer.lastElementChild?.remove(); }
          } else {
            this._elContainer.lastElementChild?.remove();
          }
        }
        this._elContainer.scrollTop += this.buttonHeight;
      } else if (scrollTop + offsetHeight > scrollHeight - this.buttonHeight && lastElement !== this.numberOfItems - 1) {
        for (let i = 0; i < this.columns; i++) {
          if (lastElement + 1 < this.numberOfItems) {
            this.createButton(++lastElement);
            if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
              let showValue = lastElement;
              while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
                this.createButton(++showValue);
              }
            }
          }
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollTop -= this.buttonHeight;
      }
    }
  }

  private endlessHelper() {
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + this.buttonWidth < scrollWidth : offsetHeight + this.buttonHeight < scrollHeight;
    if (endlessScrollable === false) { return; }
    if (this.orientation === 'horizontal' && this.dir === 'rtl') {
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.buttonWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(++showValue);
          }
        }
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollLeft += this.buttonWidth / 2;
      } else if (Math.abs(scrollLeft) < this.buttonWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(--showValue, false);
          }
        }
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollLeft -= this.buttonWidth / 2;
      }
    } else if (this.orientation === 'horizontal') {
      if (scrollLeft < this.buttonWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(--showValue, false);
          }
        }
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollLeft += this.buttonWidth / 2;
      } else if (scrollLeft + offsetWidth > scrollWidth - this.buttonWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(++showValue);
          }
        }
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollLeft -= this.buttonWidth / 2;
      }
    } else {
      if (scrollTop < this.buttonHeight / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(--showValue, false);
          }
        }
        this._elContainer.lastElementChild?.remove();
        this._elContainer.scrollTop += this.buttonHeight / 2;
      } else if (scrollTop + offsetHeight > scrollHeight - this.buttonHeight / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(++showValue);
          }
        }
        this._elContainer.firstElementChild?.remove();
        this._elContainer.scrollTop -= this.buttonHeight / 2;
        if (this.scrollToPosition === this.numberOfItems - 1 && index === 0) { this._elContainer.scrollTop += this.buttonHeight; }
      }
    }
  }

  private endlessHelperForNew() {
    const { offsetHeight, offsetWidth, scrollLeft, scrollTop, scrollWidth, scrollHeight } = this._elContainer;
    const endlessScrollable = this.orientation === 'horizontal' ? offsetWidth + this.buttonWidth < scrollWidth : offsetHeight + this.buttonHeight < scrollHeight;
    if (endlessScrollable === false) { return; }
    if (this.orientation === 'horizontal' && this.dir === 'rtl') {
      if (Math.abs(scrollLeft) + offsetWidth > scrollWidth - this.buttonWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(++showValue);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft += this.buttonWidth / 2;
      } else if (Math.abs(scrollLeft) < this.buttonWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(--showValue, false);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.lastElementChild?.remove();
        }
        this._elContainer.scrollLeft -= this.buttonWidth / 2;
      }
    } else if (this.orientation === 'horizontal') {
      if (scrollLeft < this.buttonWidth / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(--showValue, false);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.lastElementChild?.remove();
        }
        this._elContainer.scrollLeft += this.buttonWidth / 2;
      } else if (scrollLeft + offsetWidth > scrollWidth - this.buttonWidth / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(++showValue);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollLeft -= this.buttonWidth / 2;
      }
    } else {
      if (scrollTop < this.buttonHeight / 4) {
        const firstElement = this.getFirstChild();
        const index = (this.numberOfItems + firstElement - 1) % this.numberOfItems;
        this.createButton(index, false);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue > 0 && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(--showValue, false);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.lastElementChild?.remove();
        }
        this._elContainer.scrollTop += this.buttonHeight / 2;
      } else if (scrollTop + offsetHeight > scrollHeight - this.buttonHeight / 4) {
        const lastElement = this.getLastChild();
        const index = (this.numberOfItems + lastElement + 1) % this.numberOfItems;
        this.createButton(index);
        if (this.loadButtonForShow === true && this.allButtonsVisible === false) {
          let showValue = index;
          while (showValue < this.numberOfItems && this.showSignalHolder[showValue]?.value === false) {
            this.createButton(++showValue);
          }
        }
        while (this._elContainer.children.length > this.numberOfItems) {
          this._elContainer.firstElementChild?.remove();
        }
        this._elContainer.scrollTop -= this.buttonHeight / 2;
        if (this.scrollToPosition === this.numberOfItems - 1 && index === 0) { this._elContainer.scrollTop += this.buttonHeight; }
      }
    }
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

  public handleOrientation() {
    Array.from(Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.values).forEach((orientation: any) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.classListPrefix + orientation);
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    this.handleRowsAndColumn();
  }

  public handleScrollbar() {
    this._scrollbarContainer.style.display = this.endless ? 'none' : 'block';
    if (this.endless === true && this.scrollbar === true) { this.scrollbar = false; }
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    this.initScrollbar();
  }

  public handleRowsAndColumn() {
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.orientation === "horizontal") {
      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);

      // Calculate New Row class value
      this.rowClassValue = this.rows < this.numberOfItems ? this.rows : this.numberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rowClassValue);
    } else {

      // Remove Previous loaded class for both rows and columns
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rowClassValue);

      // Calculate New Row class value
      this.columnClassValue = this.columns < this.numberOfItems ? this.columns : this.numberOfItems;

      // Add the new class to the container
      this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.COLUMNS_CLASSLIST_PREFIX + this.columnClassValue);
    }
    this.debounceButtonDisplay();
  }

  public handleStretch(): void {
    if (this.stretch === 'both') { this.stretch = this.orientation === 'horizontal' ? this.rows === 1 ? 'both' : null : this.columns === 1 ? 'both' : null; }
    if (this.stretch === null) {
      this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');
    } else {
      this.debounceButtonDisplay();
    }
  }

  public handleCenterItems() {
    [true, false].forEach((bool: boolean) => {
      this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + bool.toString());
    });
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
    if (this.centerItems === true) {
      this.debounceButtonDisplay();
    }
  }

  public handleEndless() {
    this._scrollbarContainer.style.display = this.endless ? 'none' : 'block';
    if (this.endless) { this.endless = this.orientation === 'horizontal' ? this.rows === 1 : this.columns === 1; }
    if (this.endless && this.scrollbar === true) { this.scrollbar = false; }
    // This behavior is handled in scroll event
  }

  public handleScrollToPosition(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the button list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    if (this.buttonWidth === 0 || this.buttonHeight === 0) {
      this.createButton(0, false);
      this.buttonWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.buttonWidth;
      this.buttonHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.buttonHeight;
    }

    // Remove all the children in the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    if ((this.contractName.length !== 0 && this.useContractForItemShow === true) || (this.buttonReceiveStateShow.length !== 0 && this.buttonReceiveStateShow.trim().includes(`{{${this.indexId}}}`) === true)) {
      this.loadButtonForShow = true;
      if (this.showSignalHolder.length === 0) { this.signalHolder(); }
      const visibleButtons = this.showSignalHolder.filter((btn: any) => btn?.value === true).length
      this.allButtonsVisible = visibleButtons === this.numberOfItems ? true : false;
    } else {
      this.loadButtonForShow = false;
    }

    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const loadableButtons = Math.ceil(containerWidth / this.buttonWidth) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      // Right Edge case
      if (value >= this.numberOfItems - (loadableButtons - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableButtons; i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = value === this.numberOfItems - 1 ? this.buttonWidth * 5 * -1 : this.buttonWidth * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER * -1;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToRightEdgeRange(); }
      }
      // In between the range
      else if (value >= Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER) {
        for (let i = value - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER; i < value + loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = this.buttonWidth * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER * -1;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToMiddleRange(); }
      }
      // Left Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = this.buttonWidth * value * -1;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToLeftEdgeRange(); }
      }
    } else if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const loadableButtons = Math.ceil(containerWidth / this.buttonWidth) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      // Right Edge case
      if (value >= this.numberOfItems - (loadableButtons - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableButtons; i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = value === this.numberOfItems - 1 ? this.buttonWidth * 5 : this.buttonWidth * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToRightEdgeRange(); }
      }
      // In between the range
      else if (value >= Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER) {
        for (let i = value - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER; i < value + loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = this.buttonWidth * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToMiddleRange(); }
      }
      // Left Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollLeft = this.buttonWidth * value;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToLeftEdgeRange(); }
      }
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      const loadableButtons = Math.ceil(containerHeight / this.buttonHeight) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      // If container height is not set then display all the button
      if (containerHeight <= 10 || containerHeight <= this.buttonHeight + 10) {
        for (let i = 0; i < this.numberOfItems; i++) { this.createButton(i); }
      }
      // Bottom Edge case
      else if (value >= this.numberOfItems - (loadableButtons - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER)) {
        for (let i = this.numberOfItems - loadableButtons; i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollTop = value === this.numberOfItems - 1 ? this.buttonHeight * 5 : this.buttonHeight * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToRightEdgeRange(); }
      }
      // In between the range
      else if (value >= Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER) {
        for (let i = value - Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER; i < value + loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollTop = this.buttonHeight * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToMiddleRange(); }
      }
      // Top Edge case - value - (0,1) 
      else {
        for (let i = 0; i < loadableButtons && i < this.numberOfItems; i++) { this.createButton(i); }
        this._elContainer.scrollTop = this.buttonHeight * value;
        if (this.allButtonsVisible === false && this.loadButtonForShow === true) { this.scrollToLeftEdgeRange(); }
      }
    }
    this.initScrollbar();
  }

  public handleScrollToPositionForNew(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the button list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    if (this.buttonWidth === 0 || this.buttonHeight === 0) {
      if (this._elContainer.children.length === 0) {
        this.createButton(0);
        this.buttonWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.buttonWidth;
        this.buttonHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.buttonHeight;
        this._elContainer.firstElementChild?.remove();
      } else {
        this.buttonWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.buttonWidth;
        this.buttonHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.buttonHeight;
      }
    }

    if ((this.contractName.length !== 0 && this.useContractForItemShow === true) || (this.buttonReceiveStateShow.length !== 0 && this.buttonReceiveStateShow.trim().includes(`{{${this.indexId}}}`) === true)) {
      this.loadButtonForShow = true;
      if (this.showSignalHolder.length === 0) { this.signalHolder(); }
      const visibleButtons = this.showSignalHolder.filter((btn: any) => btn?.value === true).length
      this.allButtonsVisible = visibleButtons === this.numberOfItems ? true : false;
    } else {
      this.loadButtonForShow = false;
    }

    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const loadableButtons = Math.ceil(containerWidth / this.buttonWidth) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      if (this._elContainer.children.length === 0) {
        for (let index = 0; index < this.numberOfItems && index < value + loadableButtons - 1; index++) { this.createButton(index); }
      } else if (this.getLastChild() < value + loadableButtons) {
        for (let index = this.getLastChild() + 1; index < this.numberOfItems && index < value + loadableButtons; index++) { this.createButton(index); }
      }
      this._elContainer.scrollLeft = value !== 0 ? (value * this.buttonWidth) * -1 : 0;
    } else if (this.orientation === 'horizontal') {
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      const loadableButtons = Math.ceil(containerWidth / this.buttonWidth) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      if (this._elContainer.children.length === 0) {
        for (let index = 0; index < this.numberOfItems && index < value + loadableButtons - 1; index++) { this.createButton(index); }
      } else if (this.getLastChild() < value + loadableButtons) {
        for (let index = this.getLastChild() + 1; index < this.numberOfItems && index < value + loadableButtons; index++) { this.createButton(index); }
      }
      this._elContainer.scrollLeft = value !== 0 ? value * this.buttonWidth : 0;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      const loadableButtons = Math.ceil(containerHeight / this.buttonHeight) + Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      // If container height is not set then display all the button
      if (containerHeight <= 10 || containerHeight <= this.buttonHeight + 10) {
        for (let i = 0; i < this.numberOfItems; i++) { this.createButton(i); }
      } else {
        if (this._elContainer.children.length === 0) {
          for (let index = 0; index < this.numberOfItems && index < value + loadableButtons - 1; index++) { this.createButton(index); }
        } else if (this.getLastChild() < value + loadableButtons) {
          for (let index = this.getLastChild() + 1; index < this.numberOfItems && index < value + loadableButtons; index++) { this.createButton(index); }
        }
      }
      this._elContainer.scrollTop = value !== 0 ? value * this.buttonHeight : 0;
    }
    if (this.allButtonsVisible === false && this.loadButtonForShow === true) {
      let counter = 0;
      for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
        if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
      }
      let k = 0;
      while (counter !== 0 && k < counter && this.getLastChild() !== this.numberOfItems - 1) {
        if (this.showSignalHolder[this.getLastChild() + 1].value === true) { k = k + 1; }
        this.createButton(this.getLastChild() + 1);
      }
    }
    this.initScrollbar();
  }

  public handleScrollToPositionForAll(value: number) {
    // return if the value is less than 0 or more than equal to numberOfItems
    if (value >= this.numberOfItems || value < 0) { return; }

    // return if the button list contains more than one row or one column
    if ((this.orientation === 'horizontal' && this.rows !== 1) || (this.orientation === 'vertical' && this.columns !== 1)) { return; }

    this.buttonWidth = this._elContainer.firstElementChild?.getBoundingClientRect().width || this.buttonWidth;
    this.buttonHeight = this._elContainer.firstElementChild?.getBoundingClientRect().height || this.buttonHeight;

    if (this.dir === 'rtl' && this.orientation === 'horizontal') {
      this._elContainer.scrollLeft = (value * this.buttonWidth) * -1;
    } else if (this.orientation === 'horizontal') {
      this._elContainer.scrollLeft = value * this.buttonWidth;
    } else {
      this._elContainer.scrollTop = value * this.buttonHeight;
    }
    this.initScrollbar();
  }

  public buttonDisplay(isReceiveStateScrollTo = false) {
    this.contractDefaultHelper();

    // Needed for page startup and receiveStateScrollToPosition executed first
    if (isReceiveStateScrollTo === true) { return this.handleScrollToPosition(this.scrollToPosition); }

    // The below line is added to remove the stretch class before calculating the button dimension
    this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // create first button and find the dimension of the button
    this.createButton(0);
    this.buttonWidth = this._elContainer.children[0].getBoundingClientRect().width;
    this.buttonHeight = this._elContainer.children[0].getBoundingClientRect().height;
    let loadedButtons = 0;
    if (this.orientation === 'horizontal') {
      // Find the number of initial buttons which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      loadedButtons = Math.floor(containerWidth / this.buttonWidth) * this.rows + this.rows * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > this.buttonHeight + 10) {
        loadedButtons = Math.floor(containerHeight / this.buttonHeight) * this.columns + this.columns * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      } else {
        loadedButtons = this.numberOfItems;
      }
    }
    loadedButtons = loadedButtons > this.numberOfItems ? this.numberOfItems : loadedButtons;
    for (let index = 1; index < loadedButtons; index++) {
      this.createButton(index);
    }
    if (this.endless) {
      this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5;
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    if (this.centerItems === true && this.scrollbarDimension < 100) { this.centerItems = false; }
    this.signalHolder();
    if (this.scrollToPosition !== 0) { this.handleScrollToPosition(this.scrollToPosition); }
  }

  public buttonDisplayForLoadItemsNew(isReceiveStateScrollTo = false) {
    this.contractDefaultHelper();

    // Needed for page startup and receiveStateScrollToPosition executed first
    if (isReceiveStateScrollTo === true) { return this.handleScrollToPositionForNew(this.scrollToPosition); }

    // The below line is added to remove the stretch class before calculating the button dimension
    this._elContainer.classList.remove(this.primaryCssClass + '--stretch-both');

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    // create first button and find the dimension of the button
    this.createButton(0);
    this.buttonWidth = this._elContainer.children[0].getBoundingClientRect().width;
    this.buttonHeight = this._elContainer.children[0].getBoundingClientRect().height;
    let loadedButtons = 0;
    if (this.orientation === 'horizontal') {
      // Find the number of initial buttons which can be loaded based on container width
      const containerWidth = this._elContainer.getBoundingClientRect().width;
      loadedButtons = Math.floor(containerWidth / this.buttonWidth) * this.rows + this.rows * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
    } else {
      const containerHeight = this._elContainer.getBoundingClientRect().height;
      // Check whether the container is set with custom height
      if (containerHeight > this.buttonHeight + 10) {
        loadedButtons = Math.floor(containerHeight / this.buttonHeight) * this.columns + this.columns * Ch5ButtonListBase.BUTTON_CONTAINER_BUFFER;
      } else {
        loadedButtons = this.numberOfItems;
      }
    }
    loadedButtons = loadedButtons > this.numberOfItems ? this.numberOfItems : loadedButtons;
    for (let index = 1; index < loadedButtons; index++) {
      this.createButton(index);
    }
    if (this.endless) {
      this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5;
    }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    if (this.centerItems === true && this.scrollbarDimension < 100) { this.centerItems = false; }
    this.signalHolder();
    if (this.scrollToPosition !== 0) { this.handleScrollToPositionForNew(this.scrollToPosition); }
  }

  public buttonDisplayForLoadItemsAll(isReceiveStateScrollTo = false) {
    this.contractDefaultHelper();

    // Remove all the children containers from the container
    Array.from(this._elContainer.children).forEach(container => container.remove());

    for (let index = 0; index < this.numberOfItems; index++) { this.createButton(index); }

    if (this.endless) { this.orientation === 'horizontal' ? this._elContainer.scrollLeft = 5 : this._elContainer.scrollTop = 5; }
    this.initScrollbar();
    if (this.stretch === 'both') { this._elContainer.classList.add(this.primaryCssClass + '--stretch-both'); }
    if (this.centerItems === true && this.scrollbarDimension < 100) { this.centerItems = false; }
    if (isReceiveStateScrollTo === true && this.scrollToPosition === 0) {
      this.orientation === "horizontal" ? this._elContainer.scrollLeft = 0 : this._elContainer.scrollTop = 0;
    }
    if (this.scrollToPosition !== 0) { this.handleScrollToPositionForAll(this.scrollToPosition); }
  }

  private createButton(index: number, append: boolean = true) {
    if (index < 0 || index >= this.numberOfItems) { return };
    const buttonListContractObj: ICh5ButtonListContractObj = { index: index + 1, clickHoldTime: this.clickHoldTime, contractName: this.contractName, parentComponent: 'ch5-button-list' };
    const btn = new Ch5Button(buttonListContractObj);
    const btnContainer = document.createElement("div");
    btnContainer.setAttribute('id', this.getCrId() + '-' + index);
    if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined && this.useContractForItemShow === true) {
      btnContainer.setAttribute('data-ch5-noshow-type', 'display');
      btnContainer.setAttribute('data-ch5-show', this.contractName + `.Button${index + 1}Visible`);
    } else {
      if (this.getAttribute('buttonReceiveStateShow')?.trim().includes(`{{${this.indexId}}}`) === false) {
        const attrValue = this.getAttribute('buttonReceiveStateShow')?.trim();
        if (attrValue) {
          btnContainer.setAttribute('data-ch5-noshow-type', 'display');
          btnContainer.setAttribute('data-ch5-show', attrValue.trim());
        }
      } else if (this.hasAttribute('buttonReceiveStateShow') && this.getAttribute("buttonReceiveStateShow")?.trim()) {
        const attrValue = this.replaceAll(this.getAttribute("buttonReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, '');
        const isNumber = /^[0-9]+$/.test(attrValue);
        btnContainer.setAttribute('data-ch5-noshow-type', 'display');
        if (isNumber) {
          btnContainer.setAttribute('data-ch5-show', Number(attrValue) + index + '');
        } else {
          btnContainer.setAttribute('data-ch5-show', this.replaceAll(this.getAttribute("buttonReceiveStateShow")?.trim() + '', `{{${this.indexId}}}`, index + ''));
        }
      }
    }
    btnContainer.classList.add(this.nodeName.toLowerCase() + "--button-container");
    btnContainer.appendChild(btn);
    append ? this._elContainer.appendChild(btnContainer) : this._elContainer.prepend(btnContainer);
    // button attributes helper
    this.buttonModeHelper(btn, index);
    this.buttonLabelHelper(btn, index);
    this.buttonHelper(btn, index);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_TYPE.classListPrefix + this.buttonType);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_SHAPE.classListPrefix + this.buttonShape);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_ICON_POSITION.classListPrefix + this.buttonIconPosition);
    btn.addContainerClass(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.BUTTON_CHECKBOX_POSITION.classListPrefix + this.buttonCheckboxPosition);
  }

  protected buttonModeHelper(btn: Ch5Button, i: number) {
    const buttonListModes = this.getElementsByTagName(this.nodeName.toLowerCase() + "-mode");
    if (buttonListModes && buttonListModes.length > 0) {
      Array.from(buttonListModes).forEach((buttonListMode, index) => {
        if (index < Ch5ButtonListBase.MODES_MAX_COUNT) {
          if (buttonListMode.parentElement instanceof Ch5ButtonListBase) {
            const ch5ButtonMode = new Ch5ButtonMode(btn);
            Ch5ButtonMode.observedAttributes.forEach((attr) => {
              if (buttonListMode.hasAttribute(attr)) {
                ch5ButtonMode.setAttribute(attr, buttonListMode.getAttribute(attr) + '');
              }
            });

            const buttonListModeStates = buttonListMode.getElementsByTagName(this.nodeName.toLowerCase() + "-mode-state");
            if (buttonListModeStates && buttonListModeStates.length > 0) {
              Array.from(buttonListModeStates).forEach(buttonListModeState => {
                if (buttonListModeState.parentElement instanceof Ch5ButtonListModeBase) {
                  const buttonModeState = new Ch5ButtonModeState(btn);
                  Ch5ButtonModeState.observedAttributes.forEach((attr) => {
                    if (buttonListModeState.hasAttribute(attr)) {
                      buttonModeState.setAttribute(attr, buttonListModeState.getAttribute(attr) + '');
                    }
                  });

                  const buttonModeStateLabels = buttonListModeState.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
                  if (buttonModeStateLabels && buttonModeStateLabels.length > 0) {
                    Array.from(buttonModeStateLabels).forEach((buttonModeStateLabel) => {
                      if (buttonModeStateLabel.parentElement instanceof Ch5ButtonListModeStateBase) {
                        const buttonModeStateLabelTemplate = buttonModeStateLabel.getElementsByTagName("template");
                        if (buttonModeStateLabelTemplate && buttonModeStateLabelTemplate.length > 0) {
                          const ch5ButtonLabel = new Ch5ButtonLabel();
                          const template = document.createElement('template');
                          template.innerHTML = buttonModeStateLabelTemplate[0].innerHTML;
                          Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(template, i, this.indexId);
                          Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(template, i, this.indexId);
                          ch5ButtonLabel.appendChild(template);
                          buttonModeState.appendChild(ch5ButtonLabel);
                        }
                      }
                    });
                  }
                  ch5ButtonMode.appendChild(buttonModeState);
                }
              });
            }
            const buttonListModeLabels = buttonListMode.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
            if (buttonListModeLabels && buttonListModeLabels.length > 0) {
              Array.from(buttonListModeLabels).forEach((buttonListModeLabel) => {
                if (buttonListModeLabel.parentElement instanceof Ch5ButtonListModeBase) {
                  const buttonListModeLabelTemplate = buttonListModeLabel.getElementsByTagName("template");
                  if (buttonListModeLabelTemplate && buttonListModeLabelTemplate.length > 0) {
                    const ch5ButtonLabel = new Ch5ButtonLabel();
                    const template = document.createElement('template');
                    template.innerHTML = buttonListModeLabelTemplate[0].innerHTML;
                    Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(template, i, this.indexId);
                    Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(template, i, this.indexId);
                    ch5ButtonLabel.appendChild(template);
                    ch5ButtonMode.appendChild(ch5ButtonLabel);
                  }
                }
              });
            }
            btn.appendChild(ch5ButtonMode);
          }
        }
      });
    }
  }

  private buttonLabelHelper(btn: Ch5Button, index: number) {
    const buttonListLabels = this.getElementsByTagName(this.nodeName.toLowerCase() + "-label");
    if (buttonListLabels && buttonListLabels.length > 0) {
      Array.from(buttonListLabels).forEach((buttonListLabel) => {
        if (buttonListLabel.parentElement instanceof Ch5ButtonListBase) {
          const buttonListLabelTemplate = buttonListLabel.getElementsByTagName("template");
          if (buttonListLabelTemplate && buttonListLabelTemplate.length > 0) {
            const ch5ButtonLabel = new Ch5ButtonLabel();
            const template = document.createElement('template');
            template.innerHTML = buttonListLabelTemplate[0].innerHTML;
            Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(template, index, this.indexId);
            Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(template, index, this.indexId);
            ch5ButtonLabel.appendChild(template);
            btn.appendChild(ch5ButtonLabel);
          }
        }
      });
    }
  }

  private buttonHelper(btn: Ch5Button, index: number) {
    btn.setAttribute('stretch', 'both');
    btn.setAttribute('shape', 'rectangle');
    // Contract Helper
    if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {
      return this.contractButtonHelper(btn, index);
    }
    const individualButtons = this.getElementsByTagName(this.nodeName.toLowerCase() + '-individual-button');
    const individualButtonsLength = individualButtons.length;
    Ch5ButtonListBase.COMPONENT_PROPERTIES.forEach((attr: ICh5PropertySettings) => {
      if (index < individualButtonsLength) {
        if (attr.name.toLowerCase() === 'buttoniconclass') {
          if (individualButtons[index] && individualButtons[index].hasAttribute('iconclass')) {
            const attrValue = individualButtons[index].getAttribute('iconclass')?.trim();
            if (attrValue) {
              btn.setAttribute('iconclass', attrValue);
            }
          } else if (attr.name.toLowerCase().startsWith('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else if (attr.name.toLowerCase() === 'buttoniconurl') {
          if (individualButtons[index] && individualButtons[index].hasAttribute('iconurl')) {
            const attrValue = individualButtons[index].getAttribute('iconurl')?.trim();
            if (attrValue) {
              btn.setAttribute('iconurl', attrValue);
            }
          } else if (attr.name.toLowerCase().startsWith('button') && this.hasAttribute(attr.name)) {
            const attrValue = this.getAttribute(attr.name)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else {
          if (attr.name.toLowerCase().startsWith('button') && this.hasAttribute(attr.name)) {
            if (this.getAttribute(attr.name)?.trim().includes(`{{${this.indexId}}}`) === false) {
              const attrValue = this.getAttribute(attr.name)?.trim();
              if (attrValue) {
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
              }
            } else if (this.getAttribute(attr.name)?.trim().length !== 0) {
              const attrValue = this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, '');
              const isNumber = /^[0-9]+$/.test(attrValue);
              if (isNumber) {
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
              } else {
                btn.setAttribute(attr.name.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, index + ''));
              }
            }
          }
        }
      } else {
        if (attr.name.toLowerCase().startsWith('button') && this.hasAttribute(attr.name)) {
          if (this.getAttribute(attr.name)?.trim().includes(`{{${this.indexId}}}`) === false) {
            const attrValue = this.getAttribute(attr.name)?.trim();
            if (attrValue) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), attrValue.trim());
            }
          } else if (this.getAttribute(attr.name)?.trim().length !== 0) {
            const attrValue = this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, '');
            const isNumber = /^[0-9]+$/.test(attrValue);
            if (isNumber) {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
            } else {
              btn.setAttribute(attr.name.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr.name)?.trim() + '', `{{${this.indexId}}}`, index + ''));
            }
          }
        }
      }
    });

    if (this.receiveStateSelectedButton.trim() !== "") {
      btn.removeAttribute('receiveStateSelected');
      btn.removeAttribute('selected');
      if (this.selectedButton === index) {
        btn.setAttribute('selected', 'true');
      }
    }

    const individualButtonAttributes = ['onRelease', 'labelInnerHTML'];
    individualButtonAttributes.forEach((attr: string) => {
      if (index < individualButtonsLength && individualButtons[index] && individualButtons[index].hasAttribute(attr)) {
        const attrValue = individualButtons[index].getAttribute(attr)?.trim();
        if (attrValue) {
          btn.setAttribute(attr, attrValue.trim());
        }
      }
    });
  }

  private replaceAll(str: string, find: string, replace: string) {
    if (str && String(str).trim() !== "") {
      return String(str).split(find).join(replace);
    } else {
      return str;
    }
  }

  private contractDefaultHelper() {
    if (this.contractName.trim() !== "" && this.contractName !== null && this.contractName !== undefined) {

      if (this.useContractForCustomStyle === true) {
        this.receiveStateCustomStyle = this.contractName + '.CustomStyle';
      }

      if (this.useContractForCustomClass === true) {
        this.receiveStateCustomClass = this.contractName + '.CustomClass';
      }

      if (this.useContractForEnable === true) {
        this.receiveStateEnable = this.contractName + '.ListEnabled';
      }

      if (this.useContractForShow === true) {
        this.receiveStateShow = this.contractName + '.ListVisible';
      }

      if (this.useContractForNumItems === true) {
        this.receiveStateNumberOfItems = this.contractName + `.ListNumberOfItems`;
      }

      if (this.useContractForEachButtonSelection === true) {
        this.receiveStateSelectedButton = this.contractName + `.ItemSelected`;
      }
      this.receiveStateScrollToPosition = this.contractName + `.ListScrollToItem`;
    }
  }

  private contractButtonHelper(btn: Ch5Button, index: number) {
    if (this.useContractForItemEnable === true) {
      btn.setAttribute('receiveStateEnable', this.contractName + `.Button${index + 1}Enabled`);
    } else if (this.hasAttribute('buttonReceiveStateEnable') && this.getAttribute('buttonReceiveStateEnable')?.trim()) {
      this.indexIdReplaceHelper(btn, 'buttonReceiveStateEnable', index);
    }

    if (this.useContractForItemShow === true) {
      btn.setAttribute('receiveStateShow', this.contractName + `.Button${index + 1}Visible`);
    } else if (this.hasAttribute('buttonReceiveStateShow') && this.getAttribute('buttonReceiveStateShow')?.trim()) {
      this.indexIdReplaceHelper(btn, 'buttonReceiveStateShow', index);
    }

    if (this.contractItemIconType === "iconClass") {
      btn.setAttribute('receiveStateIconClass', this.contractName + `.Button${index + 1}IconClass`);
    } else if (this.contractItemIconType === "url") {
      btn.setAttribute('receiveStateIconUrl', this.contractName + `.Button${index + 1}IconURL`);
    } else if (this.contractItemIconType === "sgStateNumber") {
      btn.setAttribute('receiveStateSGIconNumeric', this.contractName + `.Button${index + 1}IconAnalog`);
    } else if (this.contractItemIconType === "sgStateName") {
      btn.setAttribute('receiveStateSGIconString', this.contractName + `.Button${index + 1}IconSerial`);
    } else if (this.contractItemIconType === "none") {
      if (this.hasAttribute('buttonReceiveStateIconClass') && this.getAttribute('buttonReceiveStateIconClass')?.trim()) {
        this.indexIdReplaceHelper(btn, 'buttonReceiveStateIconClass', index);
      }
      if (this.hasAttribute('buttonReceiveStateIconUrl') && this.getAttribute('buttonReceiveStateIconUrl')?.trim()) {
        this.indexIdReplaceHelper(btn, 'buttonReceiveStateIconUrl', index);
      }
    }

    if (this.contractItemLabelType === "textContent") {
      btn.setAttribute('receiveStateLabel', this.contractName + `.Button${index + 1}Text`);
    } else if (this.contractItemLabelType === "innerHTML") {
      btn.setAttribute('receiveStateScriptLabelHtml', this.contractName + `.Button${index + 1}Text`);
    } else {
      if (this.hasAttribute('buttonReceiveStateLabel') && this.getAttribute('buttonReceiveStateLabel')?.trim()) {
        this.indexIdReplaceHelper(btn, 'buttonReceiveStateLabel', index);
      }
      if (this.hasAttribute('buttonReceiveStateScriptLabelHtml') && this.getAttribute('buttonReceiveStateScriptLabelHtml')?.trim()) {
        this.indexIdReplaceHelper(btn, 'buttonReceiveStateScriptLabelHtml', index);
      }
    }

    btn.setAttribute('receiveStateMode', this.contractName + `.Button${index + 1}Mode`);
    if (this.useContractForEachButtonSelection === false) { btn.setAttribute('receiveStateSelected', this.contractName + `.Button${index + 1}ItemSelected`); }
    if (index === this.selectedButton && this.useContractForEachButtonSelection === true) { btn.setAttribute('selected', 'true'); }
    btn.setAttribute('sgIconTheme', this.buttonSgIconTheme);

    const remainingAttributes = ['buttonCheckboxPosition', 'buttonCheckboxShow', 'buttonVAlignLabel', 'buttonHAlignLabel', 'buttonIconClass',
      'buttonIconPosition', 'buttonIconUrl', 'buttonShape', 'buttonType', 'buttonPressed', 'buttonLabelInnerHtml', 'buttonIconUrlFillType'];
    const individualButtons = this.getElementsByTagName(this.nodeName.toLowerCase() + '-individual-button');
    const individualButtonsLength = individualButtons.length;
    remainingAttributes.forEach((attr: string) => {
      if (index < individualButtonsLength) {
        if (attr.toLowerCase() === 'buttoniconclass') {
          if (individualButtons[index] && individualButtons[index].hasAttribute('iconclass')) {
            const attrValue = individualButtons[index].getAttribute('iconclass')?.trim();
            if (attrValue) {
              btn.setAttribute('iconclass', attrValue);
            }
          } else if (attr.toLowerCase().startsWith('button') && this.hasAttribute(attr)) {
            const attrValue = this.getAttribute(attr)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else if (attr.toLowerCase() === 'buttoniconurl') {
          if (individualButtons[index] && individualButtons[index].hasAttribute('iconurl')) {
            const attrValue = individualButtons[index].getAttribute('iconurl')?.trim();
            if (attrValue) {
              btn.setAttribute('iconurl', attrValue);
            }
          } else if (attr.toLowerCase().startsWith('button') && this.hasAttribute(attr)) {
            const attrValue = this.getAttribute(attr)?.trim().replace(`{{${this.indexId}}}`, index + '');
            if (attrValue) {
              btn.setAttribute(attr.toLowerCase().replace('button', ''), attrValue.trim());
            }
          }
        } else {
          if (attr.toLowerCase() === 'buttonreceivestateshow' && this.hasAttribute('receivestateshow')) {
            btn.setAttribute('receivestateshow', this.getAttribute('receivestateshow') + '');
          }
          else if (attr.toLowerCase() === 'buttonreceivestateenable' && this.hasAttribute('receivestateenable')) {
            btn.setAttribute('receivestateenable', this.getAttribute('receivestateenable') + '');
          }
          else if (attr.toLowerCase().startsWith('button') && this.hasAttribute(attr)) {
            if (this.getAttribute(attr)?.trim().includes(`{{${this.indexId}}}`) === false) {
              const attrValue = this.getAttribute(attr)?.trim();
              if (attrValue) {
                btn.setAttribute(attr.toLowerCase().replace('button', ''), attrValue.trim());
              }
            } else if (this.getAttribute(attr)?.trim().length !== 0) {
              const attrValue = this.replaceAll(this.getAttribute(attr)?.trim() + '', `{{${this.indexId}}}`, '');
              const isNumber = /^[0-9]+$/.test(attrValue);
              if (isNumber) {
                btn.setAttribute(attr.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
              } else {
                btn.setAttribute(attr.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr)?.trim() + '', `{{${this.indexId}}}`, index + ''));
              }
            }
          }
        }
      } else {
        if (attr.toLowerCase() === 'buttonreceivestateshow' && this.hasAttribute('receivestateshow')) {
          btn.setAttribute('receivestateshow', this.getAttribute('receivestateshow') + '');
        }
        else if (attr.toLowerCase() === 'buttonreceivestateenable' && this.hasAttribute('receivestateenable')) {
          btn.setAttribute('receivestateenable', this.getAttribute('receivestateenable') + '');
        }
        else if (attr.toLowerCase().startsWith('button') && this.hasAttribute(attr)) {
          if (this.getAttribute(attr)?.trim().includes(`{{${this.indexId}}}`) === false) {
            const attrValue = this.getAttribute(attr)?.trim();
            if (attrValue) {
              btn.setAttribute(attr.toLowerCase().replace('button', ''), attrValue.trim());
            }
          } else if (this.getAttribute(attr)?.trim().length !== 0) {
            const attrValue = this.replaceAll(this.getAttribute(attr)?.trim() + '', `{{${this.indexId}}}`, '');
            const isNumber = /^[0-9]+$/.test(attrValue);
            if (isNumber) {
              btn.setAttribute(attr.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
            } else {
              btn.setAttribute(attr.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr)?.trim() + '', `{{${this.indexId}}}`, index + ''));
            }
          }
        }
      }
    });

    const individualButtonAttributes = ['onRelease', 'labelInnerHTML'];
    individualButtonAttributes.forEach((attr: string) => {
      if (index < individualButtonsLength && individualButtons[index] && individualButtons[index].hasAttribute(attr)) {
        const attrValue = individualButtons[index].getAttribute(attr)?.trim();
        if (attrValue) {
          btn.setAttribute(attr, attrValue.trim());
        }
      }
    });
  }

  private indexIdReplaceHelper(btn: Ch5Button, attr: string, index: number) {
    if (this.getAttribute(attr)?.trim().includes(`{{${this.indexId}}}`) === false) {
      const attrValue = this.getAttribute(attr)?.trim();
      if (attrValue) {
        btn.setAttribute(attr.toLowerCase().replace('button', ''), attrValue.trim());
      }
    } else if (this.getAttribute(attr)?.trim().length !== 0) {
      const attrValue = this.replaceAll(this.getAttribute(attr)?.trim() + '', `{{${this.indexId}}}`, '');
      const isNumber = /^[0-9]+$/.test(attrValue);
      if (isNumber) {
        btn.setAttribute(attr.toLowerCase().replace('button', ''), Number(attrValue) + index + '');
      } else {
        btn.setAttribute(attr.toLowerCase().replace('button', ''), this.replaceAll(this.getAttribute(attr)?.trim() + '', `{{${this.indexId}}}`, index + ''));
      }
    }
  }

  private initCssClass() {
    this.logger.start('initializeCssClass');
    // Default Orientation
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.COMPONENT_DATA.ORIENTATION.classListPrefix + this.orientation);
    // Set default rows 
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.ROWS_CLASSLIST_PREFIX + this.rows);
    // Sets default scroll bar class
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + this.scrollbar);
    // sets default center item class
    this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.CENTER_ITEMS_CLASSLIST_PREFIX + this.centerItems);
    this.logger.stop();
  }

  protected initScrollbar() {

    if (this.orientation === "horizontal" && this.dir === 'rtl') {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(Math.abs(scrollLeft) / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = (100 - this.scrollbarDimension) - scrollbarLeft + '%';
    } else if (this.orientation === "horizontal") {
      const { scrollWidth, offsetWidth, scrollLeft } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetWidth / scrollWidth * 100);
      const scrollbarLeft = Math.ceil(scrollLeft / scrollWidth * 100);
      this._scrollbar.style.removeProperty('height');
      this._scrollbar.style.removeProperty('top');
      this._scrollbar.style.width = this.scrollbarDimension + '%';
      this._scrollbar.style.left = scrollbarLeft + '%';
    } else {
      const { scrollHeight, offsetHeight, scrollTop } = this._elContainer;
      this.scrollbarDimension = Math.floor(offsetHeight / scrollHeight * 100);
      const scrollbarTop = Math.ceil(scrollTop / scrollHeight * 100);
      this._scrollbar.style.removeProperty('width');
      this._scrollbar.style.removeProperty('left');
      this._scrollbar.style.height = this.scrollbarDimension + '%';
      this._scrollbar.style.top = scrollbarTop + '%';
    }
    if (this.scrollbar) {
      if (this.scrollbarDimension === 100) {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'true');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'false');
      } else {
        this._elContainer.classList.remove(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'false');
        this._elContainer.classList.add(this.nodeName.toLowerCase() + Ch5ButtonListBase.SCROLLBAR_CLASSLIST_PREFIX + 'true');
      }
    }
  }

  private checkInternalHTML() {
    if (this._elContainer.parentElement !== this) {
      this._elContainer.classList.add(this.nodeName.toLowerCase());
      this.appendChild(this._elContainer);
    }
    if (this._scrollbar.parentElement !== this._scrollbarContainer) {
      this._scrollbar.classList.add('scrollbar');
      this._scrollbarContainer.appendChild(this._scrollbar);
    }
    if (this._scrollbarContainer.parentElement !== this) {
      this._scrollbarContainer.classList.add('scrollbar-container');
      this.appendChild(this._scrollbarContainer);
    }
  }

  private handleContractName() {
    if (this.contractName.trim().length === 0) {
      this.signalNameOnContract.contractName = "";
      this.receiveStateShow = this.signalNameOnContract.receiveStateShow;
      this.receiveStateEnable = this.signalNameOnContract.receiveStateEnable;
      this.receiveStateCustomStyle = this.signalNameOnContract.receiveStateCustomStyle;
      this.receiveStateCustomClass = this.signalNameOnContract.receiveStateCustomClass;
      this.receiveStateNumberOfItems = this.signalNameOnContract.receiveStateNumberOfItems;
      this.receiveStateSelectedButton = this.signalNameOnContract.receiveStateSelectedButton;
      this.receiveStateScrollToPosition = this.signalNameOnContract.receiveStateScrollToPosition;
    } else if (this.signalNameOnContract.contractName === "") {
      this.signalNameOnContract.contractName = this.contractName;
      this.signalNameOnContract.receiveStateShow = this.receiveStateShow;
      this.signalNameOnContract.receiveStateEnable = this.receiveStateEnable;
      this.signalNameOnContract.receiveStateCustomStyle = this.receiveStateCustomStyle;
      this.signalNameOnContract.receiveStateCustomClass = this.receiveStateCustomClass;
      this.signalNameOnContract.receiveStateNumberOfItems = this.receiveStateNumberOfItems;
      this.signalNameOnContract.receiveStateSelectedButton = this.receiveStateSelectedButton;
      this.signalNameOnContract.receiveStateScrollToPosition = this.receiveStateScrollToPosition;
    }
    this.debounceButtonDisplay();
  }

  private signalHolder() {
    if ((this.contractName.length !== 0 && this.useContractForItemShow === true)) {
      this.showSignalHolder.forEach((el: { signalValue: string, signalState: string, value: number }) => this.clearOldSubscription(el.signalValue, el.signalState));
      this.showSignalHolder = [];
      this.loadButtonForShow = true;
      for (let i = 1; i <= this.numberOfItems; i++) {
        const signalValue = `${this.contractName}.Button${i}Visible`;
        const signalResponse = this.setSignalByBoolean(signalValue);
        this.showSignalHolder.push({ signalState: "", signalValue, value: false });
        if (!_.isNil(signalResponse)) {
          this.showSignalHolder[i - 1].signalState = signalResponse.subscribe((newValue: boolean) => {
            this.showSignalHolder[i - 1].value = newValue;
            this.debounceButtonShow();
            return true;
          });
        }
      }
    } else if (this.buttonReceiveStateShow.length !== 0 && this.buttonReceiveStateShow.trim().includes(`{{${this.indexId}}}`) === true) {
      this.showSignalHolder.forEach((el: { signalValue: string, signalState: string, value: number }) => this.clearOldSubscription(el.signalValue, el.signalState));
      this.showSignalHolder = [];
      this.loadButtonForShow = true;
      const attrValue = this.replaceAll(this.getAttribute('buttonReceiveStateShow')?.trim() + '', `{{${this.indexId}}}`, '');
      const isNumber = /^[0-9]+$/.test(attrValue);
      for (let i = 0; i < this.numberOfItems; i++) {
        const signalValue = isNumber ? Number(attrValue) + i + '' : this.replaceAll(this.getAttribute('buttonReceiveStateShow')?.trim() + '', `{{${this.indexId}}}`, i + '');
        this.showSignalHolder.push({ signalState: "", signalValue, value: false });
        const signalResponse = this.setSignalByBoolean(signalValue);
        if (!_.isNil(signalResponse)) {
          this.showSignalHolder[i].signalState = signalResponse.subscribe((newValue: boolean) => {
            this.showSignalHolder[i].value = newValue;
            this.debounceButtonShow();
            return true;
          });
        }
      }
    }
  }

  private clearOldSubscription(signalValue: string, signalState: string) {
    // clean up old subscription
    const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveStateSigName);

    if (oldSignal !== null) {
      oldSignal.unsubscribe(signalState as string);
    }
  }

  public setSignalByBoolean(signalValue: string): Ch5Signal<boolean> | null {
    // setup new subscription.
    const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(signalValue);
    const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(receiveLabelSigName);

    if (receiveSignal === null) {
      return null;
    }
    return receiveSignal;
  }

  private buttonShow() {
    // check whether all buttons are visible 
    const visibleButtons = this.showSignalHolder.filter((btn: any) => btn?.value === true).length
    this.allButtonsVisible = visibleButtons === this.numberOfItems ? true : false;
    if (this.allButtonsVisible === true) { return; }

    // check if any button needs to be added to make the container scrollable
    this.scrollToMiddleRange();
  }

  private getFirstChild() {
    return Number(this._elContainer.firstElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
  }

  private getLastChild() {
    return Number(this._elContainer.lastElementChild?.getAttribute('id')?.replace(this.getCrId() + '-', ''));
  }

  private scrollToRightEdgeRange() {
    let counter = 0;
    for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
      if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
    }
    let k = 0;
    while (counter !== 0 && k < counter && this.getFirstChild() !== 0) {
      if (this.showSignalHolder[this.getFirstChild() - 1].value === true) { k = k + 1; }
      this.createButton(this.getFirstChild() - 1, false);
    }
  }

  private scrollToMiddleRange() {
    let counter = 0;
    for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
      if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
    }
    let k = 0;
    while (counter !== 0 && k < counter && this.getFirstChild() !== 0) {
      if (this.showSignalHolder[this.getFirstChild() - 1].value === true) { k = k + 1; }
      this.createButton(this.getFirstChild() - 1, false);
    }
    while (counter !== 0 && k < counter && this.getLastChild() !== this.numberOfItems - 1) {
      if (this.showSignalHolder[this.getLastChild() + 1].value === true) { k = k + 1; }
      this.createButton(this.getLastChild() + 1);
    }
  }

  private scrollToLeftEdgeRange() {
    let counter = 0;
    for (let j = this.getFirstChild(); j <= this.getLastChild(); j++) {
      if (this.showSignalHolder[j].value === false) { counter = counter + 1; }
    }
    let k = 0;
    while (counter !== 0 && k < counter && this.getLastChild() !== this.numberOfItems - 1) {
      if (this.showSignalHolder[this.getLastChild() + 1].value === true) { k = k + 1; }
      this.createButton(this.getLastChild() + 1);
    }
  }


  private handleReceiveStateSelectedButton() {
    Array.from(this._elContainer.children).forEach((btnContainer) => {
      const btn = btnContainer.children[0] as HTMLElement;
      btn.removeAttribute('selected');
      if (Number(btnContainer.getAttribute('id')?.replace(this.getCrId() + '-', '')) === this.selectedButton) {
        btn.setAttribute('selected', 'true');
      }
    });
  }

  private resizeHandler = () => {
    this.debounceButtonDisplay();
  }

  protected getTargetElementForCssClassesAndStyle(): HTMLElement {
    return this._elContainer;
  }

  public getCssClassDisabled() {
    return this.primaryCssClass + '--disabled';
  }

  //#endregion

}
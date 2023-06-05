import { ICh5ButtonListCommonAttributes } from "../../ch5-common/interfaces/i-ch5-button-list-attributes";
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape, TCh5ButtonListAttributesOrientation, TCh5ButtonListAttributesStretch, TCh5ButtonListContractItemLabelType, TCh5ButtonListContractItemIconType, TCh5ButtonListSgIconTheme, TCh5ButtonListAttributesLoadItems } from './t-ch5-button-list';

/**
 * @ignore
 */
export interface ICh5ButtonListAttributes extends ICh5ButtonListCommonAttributes {
  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal' or 'vertical'. Positions the list elements in a horizontal or vertical orientation."
   * ]
   * @name orientation
   * @default horizontal
   * @attributeType "EnumeratedValue"
   */
  orientation: TCh5ButtonListAttributesOrientation;

  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "The default value is false. If scrollbar is true, then shows a scrollbar for the button list."
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "Boolean"
   */
  scrollbar: boolean;
  /**
   * @documentation
   * [
   * "`centerItems` attribute",
   * "***",
   * "The default value is false. This attribute sets the buttons in the list to be center aligned. If Stretch attribute is set to both then stretch attribute will take more priority than centerItems attribute."
   * ]
   * @name centeritems
   * @default false
   * @attributeType "Boolean"
   */
  centerItems: boolean;
  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "The default value is null. Valid values are null and 'both'. NOTE: stretch is set to null whenever there are multiple rows and columns. Stretch attribute is set to both will take more priority than centerItems attribute."
   * ]
   * @name stretch
   * @default null
   * @attributeType "EnumeratedValue"
   */
  stretch: TCh5ButtonListAttributesStretch | null;
  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "The default value is false. If false, continued swiping when reaching end of list reveals no items beyond the last. If true, if the attribute is added without a value, the first list item will virtually follow the last item when the end of the list is reached. Swiping towards the beginning of the list items will also show the last item prior to the first. Note: Endless is set to false whenever there are multiple rows and columns."
   * ]
   * @name endless
   * @default false
   * @attributeType "Boolean"
   */
  endless: boolean;
  /**
  * @documentation
  * [
  * "`numberOfItems` attribute",
  * "***",
  * "Default value is 10,  Minimum value is 1 and Maximum value is 500. This attribute sets the number of buttons in the button lists"
  * ]
  * @name numberofitems
  * @default 10
  * @limits [{"min": 1, "max": 500}]
  * @attributeType "Integer"
  */
  numberOfItems: number;
  /**
   * @documentation
   * [
   * "`rows` attribute",
   * "***",
   * "Default value is 1, Minimum value 1 and Maximum value 500. By using rows attribute the designer can align the buttons in multiple rows of the list when the orientation is horizontal."
   * ]
   * @name rows
   * @default 1
   * @limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"horizontal"}]
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "Default value is 1, Minimum value 1 and Maximum value 500. By using columns attribute the designer can align the buttons in multiple columns of the list when the orientation is vertical."
   * ]
   * @name columns
   * @default 1
   * @limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"vertical"}]
   */
  columns: number;
  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "This attribute helps to replace the pattern with the index on the ch5-button-list."
   * ]
   * @name indexid
   * @attributeType "String"
   */
  indexId: string;
  /**
   * @documentation
   * [
   * "`receiveStateNumberOfItems` attribute",
   * "***",
   * "signal value received from the receiveStateNumberOfItems Join will be constrained for numberOfItems attribute."
   * ]
   * @name receivestatenumberofitems
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateNumberOfItems: string;
  /**
  * @documentation
  * [
  * "`scrollToPosition` attribute",
  * "***",
  * "Default value is 0, Minimum value is 0 and Maximum value is 499. Indicates the index of the button to scrollTo. This is applicable only for single row and column."
  * ]
  * @name scrolltoposition
  * @default 0
  * @limits [{"min": 0, "max": 499}]
  * @attributeType "Integer"
  */
  scrollToPosition: number;
  /**
   * @documentation
   * [
   * "`receiveStateScrollToPosition` attribute",
   * "***",
   * "Signal indicates the index of the button to scrollTo. This is applicable only for single row and column."
   * ]
   * @name receivestatescrolltoposition
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScrollToPosition: string;
  /**
   * @documentation
   * [
   * "`contractName` attribute",
   * "***",
   * "ContractName attribute sets the name of the contract"
   * ]
   * @name contractname
   * @default 
   * @attributeType "String"
   */
  contractName: string;
  /**
   * @documentation
   * [
   * "`useContractForEnable` attribute",
   * "***",
   * "When true, contract 'Enable' state determines if the list is enabled. When false, the 'receiveStateEnable' join may be applied. Consistent with other components, if the 'receiveStateEnable' join is provide, the value of that join determines if the component is enabled. "
   * ]
   * @name usecontractforenable
   * @default false
   * @attributeType "Boolean"
   */
  useContractForEnable: boolean;
  /**
   * @documentation
   * [
   * "`useContractForShow` attribute",
   * "***",
   * " When true, contract 'Show' state determines if the list is enabled. When false, the 'receiveStateShow' join may be applied. Consistent with other components, if the 'receiveStateShow' join is provide, the value of that join determines if the component is visible. "
   * ]
   * @name usecontractforshow
   * @default false
   * @attributeType "Boolean"
   */
  useContractForShow: boolean;
  /**
   * @documentation
   * [
   * "`useContractForItemEnable` attribute",
   * "***",
   * "When true, contract 'ItemEnable[x]' state determines if an individual button x is enabled. "
   * ]
   * @name usecontractforitemenable
   * @default false
   * @attributeType "Boolean"
   */
  useContractForItemEnable: boolean;
  /**
   * @documentation
   * [
   * "`useContractForItemShow` attribute",
   * "***",
   * "When true, contract 'ItemShow[x]' state determines if an individual button x is visible. "
   * ]
   * @name usecontractforitemshow
   * @default false
   * @attributeType "Boolean"
   */
  useContractForItemShow: boolean;
  /**
   * @documentation
   * [
   * "`useContractForCustomStyle` attribute",
   * "***",
   * "contract for custom style "
   * ]
   * @name usecontractforcustomstyle
   * @default false
   * @attributeType "Boolean"
   */
  useContractForCustomStyle: boolean;
  /**
   * @documentation
   * [
   * "`useContractForCustomClass` attribute",
   * "***",
   * "contract for custom class"
   * ]
   * @name usecontractforcustomclass
   * @default false
   * @attributeType "Boolean"
   */
  useContractForCustomClass: boolean;
  /**
   * @documentation
   * [
   * "`contractItemLabelType` attribute",
   * "***",
   * "Valid values are 'textContent', 'innerHTML', 'none'.   When 'none', contract 'ItemLabel[x]', will not change the label of button x. When 'textContent', change in value of contract 'ItemLabel[x]', will change the label as if it were text, not HTML markup. When 'innerHTML', change in value of contract 'ItemLabel[x]', will change the label as if it were HTML content"
   * ]
   * @name contractitemlabeltype
   * @default none
   * @attributeType "EnumeratedValue"
   */
  contractItemLabelType: TCh5ButtonListContractItemLabelType;
  /**
  * @documentation
  * [
  * "`contractItemIconType` attribute",
  * "***",
  * "Valid values are 'none', 'iconClass', 'url', 'sgStateName' and 'sgStateNumber'. The last two are reserved for backward compatibility to Smart Graphics Extenders used for Dynamic Button List.  They should not be provided as choices for projects that are not converted from VtPro/Smart Graphics."
  * ]
  * @name contractitemicontype
  * @default none
  * @attributeType "EnumeratedValue"
  */
  contractItemIconType: TCh5ButtonListContractItemIconType;
  /**
  * @documentation
  * [
  * "`useContractForNumItems` attribute",
  * "***",
  * "When false, the 'receiveStateNumberOfItems' join may be applied. Consistent with other components, if the 'receiveStateNumberOfItems' join is provide, the value of that join determines how many items in the list to show. "
  * ]
  * @name usecontractfornumitems
  * @default false
  * @attributeType "Boolean"
  */
  useContractForNumItems: boolean;
  /**
  * @documentation
  * [
  * "`buttonType` attribute",
  * "***",
  * "buttonType sets the button background for all the buttons in the list. Valid values are default, danger, text, warning, info, success, primary, secondary."
  * ]
  * @name buttontype
  * @default default
  * @attributeType "EnumeratedValue"
  */
  buttonType: TCh5ButtonListButtonType;
  /**
  * @documentation
  * [
  * "`buttonHAlignLabel` attribute",
  * "***",
  * "Default attribute is center.  Possible values are 'center', 'left', 'right'. When the buttonHAlignLabel property is set, the label and the icon of the button are horizontally aligned.The center property sets the horizontal alignment of the label to the center of the button. The left property sets the horizontal alignment of the label to the left of the button.  The right property sets the horizontal alignment of the label to the right of the button."
  * ]
  * @name buttonhalignlabel
  * @default center
  * @attributeType "EnumeratedValue"
  */
  buttonHAlignLabel: TCh5ButtonListButtonHAlignLabel;
  /**
  * @documentation
  * [
  * "`buttonVAlignLabel` attribute",
  * "***",
  * "Default attribute is middle. Possible values are 'middle', 'top', 'bottom'. When the buttonVAlignLabel property is set, the label and the icon of the button are vertically aligned.  The middle property sets the vertical alignment of the label to the middle of the button.  The top property sets the vertical alignment of the label to the top of the button.   The bottom property sets the vertical alignment of the label to the bottom of the button."
  * ]
  * @name buttonvalignlabel
  * @default middle
  * @attributeType "EnumeratedValue"
  */
  buttonVAlignLabel: TCh5ButtonListButtonVAlignLabel;
  /**
  * @documentation
  * [
  * "`buttonCheckboxPosition` attribute",
  * "***",
  * "Default value is left. Valid values are 'left', 'right'. This property is used to set the position of a checkbox in a button. The value left would set the checkbox to the left of the button and the value right would set the checkbox to the right of the button."
  * ]
  * @name buttoncheckboxposition
  * @default left
  * @attributeType "EnumeratedValue"
  * @showWhen [{"buttonCheckboxShow":true}]
  */
  buttonCheckboxPosition: TCh5ButtonListButtonCheckboxPosition;
  /**
  * @documentation
  * [
  * "`buttonIconPosition` attribute",
  * "***",
  * "The default value is 'first', Valid values: 'first', 'last', 'top', 'bottom'. The icon position relative to the label."
  * ]
  * @name buttoniconposition
  * @default first
  * @attributeType "EnumeratedValue"
  */
  buttonIconPosition: TCh5ButtonListButtonIconPosition;
  /**
  * @documentation
  * [
  * "`buttonShape` attribute",
  * "***",
  * "The default value is 'rectangle'. Valid values: 'rectangle', 'rounded-rectangle'. This attribute sets shape of the button."
  * ]
  * @name buttonshape
  * @default rectangle
  * @attributeType "EnumeratedValue"
  */
  buttonShape: TCh5ButtonListButtonShape;
  /**
   * @documentation
   * [
   * "`buttonCheckboxShow` attribute",
   * "***",
   * "The default value is false. This property is used to display or hide a checkbox.  If set to true, a checkbox is displayed."
   * ]
   * @name buttoncheckboxshow
   * @default false
   * @attributeType "Boolean"
   */
  buttonCheckboxShow: boolean;
  /**
   * @documentation
   * [
   * "`buttonSelected` attribute",
   * "***",
   * "The default value is false. This property reflects the selected state of the component."
   * ]
   * @name buttonselected
   * @default false
   * @attributeType "Boolean"
   */
  buttonSelected: boolean;
  /**
   * @documentation
   * [
   * "`buttonPressed` attribute",
   * "***",
   * "The default value is false. This property reflects the pressed state of the component."
   * ]
   * @name buttonpressed
   * @default false
   * @attributeType "Boolean"
   */
  buttonPressed: boolean;
  /**
   * @documentation
   * [
   * "`buttonMode` attribute",
   * "***",
   * "The default value is 0. This property is used to set or get the mode of the ch5-button in a multi-mode environment. The maximum value that can be set is 4."
   * ]
   * @name buttonmode
   * @default 0
   * @limits [{"min": 0, "max": 4}]
   * @attributeType "Integer"
   */
  buttonMode: number;
  /**
   * @documentation
   * [
   * "`buttonIconClass` attribute",
   * "***",
   * "The buttoniconclass attribute with Font Awesome icons and Material Icons. We can declare more than one css class in the buttonIconClass attribute."
   * ]
   * @name buttoniconclass
   * @default 
   * @attributeType "String"
   */
  buttonIconClass: string;
  /**
   * @documentation
   * [
   * "`buttonIconUrl` attribute",
   * "***",
   * "The buttonIconUrl  attribute with SVG icons and PNG Icons we can pass only one url in the buttonIconUrl attribute"
   * ]
   * @name buttoniconurl
   * @default 
   * @attributeType "String"
   */
  buttonIconUrl: string;
  /**
   * @documentation
   * [
   * "`buttonLabelInnerHtml` attribute",
   * "***",
   * "This attribute provides the ability of a template that applies for all the buttons in the list."
   * ]
   * @name buttonlabelinnerhtml
   * @attributeType "EncodedHTML"
   * @hidden true
   */
  buttonLabelInnerHtml: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateMode` attribute",
   * "***",
   * "When received, applies a value to the mode attribute from the signal on all the buttons in the button list."
   * ]
   * @name buttonreceivestatemode
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateMode: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateSelected` attribute",
   * "***",
   * "When received, applies a true value applied by the selected class (ch5-button--selected) on all the buttons in the button list."
   * ]
   * @name buttonreceivestateselected
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateSelected: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateLabel` attribute",
   * "***",
   * "When received, applies the value on the label on all the buttons in the button list."
   * ]
   * @name buttonreceivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateLabel: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateScriptLabelHtml` attribute",
   * "***",
   * "Allows the signal script evaluation to be applied to the button.innerHTML class. Allows for multiline, multiStyled labels."
   * ]
   * @name buttonreceivestatescriptlabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateScriptLabelHtml: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateIconClass` attribute",
   * "***",
   * "After receiving stateIconClass value from control system, this value is applied to the iconClass attribute of all the buttons in the list."
   * ]
   * @name buttonreceivestateiconclass
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateIconClass: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonIconUrl` attribute",
   * "***",
   * "After receiving stateIconUrl value from control system, this value is applied to the iconUrl attribute of all the buttons in the list."
   * ]
   * @name buttonreceivestateiconurl
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateIconUrl: string;
  /**
   * @documentation
   * [
   * "`buttonSendEventOnClick` attribute",
   * "***",
   * "Sends an event on click or tap (mouse or swipe up and down quickly). Use this when the control system takes an action on the rising edge from false to true of a boolean digital event."
   * ]
   * @name buttonsendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonSendEventOnClick: string;
  /**
  * @documentation
  * [
  * "`buttonReceiveStateShow` attribute",
  * "***",
  * ". When the signal is low, the component will not be displayed, and the area will not be pressable. If receiveStateShow attribute is given for ch5-button-list than it takes more preference over buttonReceiveStateShow attribute."
  * ]
  * @name buttonreceivestateshow
  * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}   
  * @attributeType "Join"
  * @applicableToListItem true
  */
  buttonReceiveStateShow: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateEnable` attribute",
   * "***",
   * "When the signal is low, the look of the component will change to represent a disabled state and the component will not be pressable. If receiveStateEnable attribute is given for ch5-button-list than it takes more preference over buttonReceiveStateEnable attribute."
   * ]
   * @name buttonreceivestateenable
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}   
   * @attributeType "Join"
   * @applicableToListItem true
   */
  buttonReceiveStateEnable: string;
  /**
   * @documentation
   * [
   * "`clickHoldTime` attribute",
   * "***",
   * "The number of milliseconds that differentiates a tap from a press and hold for ItemClicked and ItemHeld Joins"
   * ]
   * @name clickholdtime
   * @default 1500
   * @limits [{"min": 300, "max": 30000}]
   * @attributeType "Integer"
   */
  clickHoldTime: number;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateSGIconNumeric` attribute",
   * "***",
   * "This would contain a mapping on analog joins to each of the sg icons."
   * ]
   * @name buttonreceivestatesgiconnumeric
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  buttonReceiveStateSGIconNumeric: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateSGIconString` attribute",
   * "***",
   * "This would contain a mapping of serial joins to each of the sg icons."
   * ]
   * @name buttonreceivestatesgiconstring
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  buttonReceiveStateSGIconString: string;
  /**
   * @documentation
   * [
   * "`buttonSgIconTheme:` attribute",
   * "***",
   * "This will contain an enumeration of 5 values - icons-lg, icons-sm, media-transports-accents, media-transports-light, media-transports-dark. Default. value is icons-lg."
   * ]
   * @name buttonsgicontheme
   * @attributeType "EnumeratedValue"
   * @default icons-lg
   */
  buttonSgIconTheme: TCh5ButtonListSgIconTheme;
  /**
   * @documentation
   * [
   * "`loadItems:` attribute",
   * "***",
   * "The default value is visible-only. The possible values are visible-only, load-new, all. This attribute allows for buttons to be created and loaded on demand. Will determine if buttons are removed or not after they are no longer invisibility."
   * ]
   * @name loaditems
   * @attributeType "EnumeratedValue"
   * @default visible-only
   */
  loadItems: TCh5ButtonListAttributesLoadItems;
}
import { TCh5TabButtonAttributesOrientation } from '../interfaces/t-ch5-tab-button';
import {
  TCh5TabButtonButtonType, TCh5TabButtonButtonHAlignLabel, TCh5TabButtonButtonVAlignLabel, TCh5TabButtonButtonIconPosition,
  TCh5TabButtonButtonShape, TCh5TabButtonButtonIconUrlFillType
} from '../../ch5-tab-button/interfaces/t-ch5-tab-button';
import { ICh5TabButtonCommonAttributes } from '../../ch5-common/interfaces/i-ch5-tab-button-attributes';
/**
 * @ignore
 */
export interface ICh5TabButtonAttributes extends ICh5TabButtonCommonAttributes {
  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "Possible value are 'horizontal'(default), 'vertical'. Aligns the tab button according to orientation value."
   * ]
   * @name orientation
   * @default horizontal
   * @attributeType "EnumeratedValue"
   */
  orientation: TCh5TabButtonAttributesOrientation;
  /**
   * @documentation
   * [
   * "`numberOfItems` attribute",
   * "***",
   * "Default value is 3, Minimum value is 2 and Maximum value is 15. This attribute sets the number of buttons in the tab button"
   * ]
   * @name numberofitems
   * @default 3
   * @limits [{"min": 2, "max": 15}]
   * @attributeType "Integer"
   */
  numberOfItems: number;
  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "This attribute helps to replace the pattern with the index on the ch5-tab-button."
   * ]
   * @name indexid
   * @attributeType "String"
   */
  indexId: string;
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
  buttonType: TCh5TabButtonButtonType;
  /**
   * @documentation
   * [
   * "`buttonLabelInnerHtml` attribute",
   * "***",
   * "This attribute provides the ability of a template that applies for all the buttons in the tab button."
   * ]
   * @name buttonlabelinnerhtml
   * @attributeType "EncodedHTML"
   * @hidden true
   */
  buttonLabelInnerHtml: string;
  /**
   * @documentation
   * [
   * "`buttonHAlignLabel` attribute",
   * "***",
   * "Default value is center. Possible values are 'center', 'left', 'right'. When the buttonHAlignLabel property is set, the label and the icon of the button are horizontally aligned.The center property sets the horizontal alignment of the label to the center of the button. The left property sets the horizontal alignment of the label to the left of the button. The right property sets the horizontal alignment of the label to the right of the button."
   * ]
   * @name buttonhalignlabel
   * @default center
   * @attributeType "EnumeratedValue"
   */
  buttonHAlignLabel: TCh5TabButtonButtonHAlignLabel;
  /**
   * @documentation
   * [
   * "`buttonVAlignLabel` attribute",
   * "***",
   * "Default value is middle. Possible values are 'middle', 'top', 'bottom'. When the buttonVAlignLabel property is set, the label and the icon of the button are vertically aligned. The middle property sets the vertical alignment of the label to the middle of the button. The top property sets the vertical alignment of the label to the top of the button. The bottom property sets the vertical alignment of the label to the bottom of the button."
   * ]
   * @name buttonvalignlabel
   * @default middle
   * @attributeType "EnumeratedValue"
   */
  buttonVAlignLabel: TCh5TabButtonButtonVAlignLabel;
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
  buttonIconPosition: TCh5TabButtonButtonIconPosition;
  /**
   * @documentation
   * [
   * "`buttonShape` attribute",
   * "***",
   * "Valid values are 'rectangle(default)', 'rounded-rectangle' and 'tab'. This attribute sets shape of the button."
   * ]
   * @name buttonshape
   * @default rectangle
   * @attributeType "EnumeratedValue"
   */
  buttonShape: TCh5TabButtonButtonShape;
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
   * "The buttonIconUrl attribute with SVG icons and PNG Icons we can pass only one url in the buttonIconUrl attribute"
   * ]
   * @name buttoniconurl
   * @default 
   * @attributeType "String"
   */
  buttonIconUrl: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateSelected` attribute",
   * "***",
   * "When received, applies a true value applied by the selected class (ch5-button--selected) on all the buttons in the tab button."
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
   * "When received, applies the value on the label on all the buttons in the tab button."
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
   * "After receiving stateIconClass value from control system, this value is applied to the iconClass attribute of all the tab button."
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
   * "`buttonReceiveStateIconUrl` attribute",
   * "***",
   * "After receiving stateIconUrl value from control system, this value is applied to the iconUrl attribute of all the buttons in the tab button."
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
   * "Sends an event on click or tap. Use this when the control system takes an action on the rising edge from false to true of a boolean digital event."
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
   * "When the signal is low, the component will not be displayed, and the area will not be pressable. Note: If receiveStateShow attribute is given for ch5-tab-button then it will over ride buttonReceiveStateShow attribute"
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
   * "When the signal is low, the look of the component will change to represent a disabled state and the component will not be pressable. Note: If receiveStateEnable attribute is given for ch5-tab-button then it will over ride buttonReceiveStateEnable attribute"
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
   * "Default value is false. When true, contract 'Enable' state determines if the list is enabled. When false, the 'receiveStateEnable' join may be applied. Consistent with other components, if the 'receiveStateEnable' join is provide, the value of that join determines if the component is enabled. "
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
   * "Default value is false. When true, contract 'Show' state determines if the list is enabled. When false, the 'receiveStateShow' join may be applied. Consistent with other components, if the 'receiveStateShow' join is provide, the value of that join determines if the component is visible. "
   * ]
   * @name usecontractforshow
   * @default false
   * @attributeType "Boolean"
   */
  useContractForShow: boolean;
  /**
   * @documentation
   * [
   * "`useContractForCustomStyle` attribute",
   * "***",
   * "Default value is false. Contract for custom style "
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
   * "Default value is false. Contract for custom class"
   * ]
   * @name usecontractforcustomclass
   * @default false
   * @attributeType "Boolean"
   */
  useContractForCustomClass: boolean;
  /**
   * @documentation
   * [
   * "`buttonIconUrlFillType` attribute",
   * "***",
   * "Sets the icon url fill type for all the buttons. Default value is 'null'. Applicable values are 'null', 'stretch', 'stretch-aspect', 'center', 'tile', 'initial'. Uses the css property background-size for the implementation."
   * ]
   * @name buttoniconurlfilltype
   * @default null
   * @attributeType "EnumeratedValue"
   */
  buttonIconUrlFillType: TCh5TabButtonButtonIconUrlFillType | null;
  /**
   * @documentation
   * [
   * "`receiveStateSelectedButton` attribute",
   * "***",
   * "ReceiveStateSelectedButton attribute helps the user to select an item on tab button by using an analog join."
   * ]
   * @name receivestateselectedbutton
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateSelectedButton: string;
  /**
   * @documentation
   * [
   * "`useContractForEachButtonSelection` attribute",
   * "***",
   * "The default value is false. If the value is true then the selected state of the buttons is taken from the contractName.TabSelected else from contractName.Tab[X]_Selected."
   * ]
   * @name usecontractforeachbuttonselection
   * @default false
   * @attributeType "Boolean"
   */
  useContractForEachButtonSelection: boolean;
}
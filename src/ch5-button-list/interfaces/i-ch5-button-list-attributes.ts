import { ICh5GenericListAttributesAttributes } from "../../ch5-generic-list-attributes/interfaces";
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape } from './t-ch5-button-list';

/**
 * @ignore
 */
export interface ICh5ButtonListAttributes extends ICh5GenericListAttributesAttributes {
  /**
  * @documentation
  * [
  * "`buttonType` attribute",
  * "***",
  * "buttonType sets the button backgrountd for all the buttons in the list. Valid values are default, danger, text, warning, info, success, primary, secondary."
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
   * "The buttonIconUrl  attribute with SVG icons and PNG Icons we can pass only one url in the buttonIconUrl  attribute"
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
   * "`buttonOnRelease` attribute",
   * "***",
   * "The buttonOnRelease attribute allows selection of a page to be made visible on clicking of the button."
   * ]
   * @name buttononrelease
   * @default 
   * @attributeType "String"
   */
  buttonOnRelease: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateMode` attribute",
   * "***",
   * "When received, applies a value to the mode attribute from the signal on all the buttons in the button list."
   * ]
   * @name buttonreceivestatemode
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
   */
  buttonReceiveStateLabel: string;
  /**
   * @documentation
   * [
   * "`buttonReceiveStateScriptLabelHtml` attribute",
   * "***",
   * "Allows the signal script evaluation to be applied to the button.innerHTML class.  Allows for multiline, multiStyled labels."
   * ]
   * @name buttonreceivestatescriptlabelhtml
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
  * @default 
  * @attributeType "String"
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
   * @default 
   * @attributeType "String"
   */
  buttonReceiveStateEnable: string;
}
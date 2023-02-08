import { TCh5GenericListAttributesOrientation } from '../../ch5-generic-list-attributes/interfaces/t-ch5-generic-list-attributes';
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape } from '../../ch5-button-list/interfaces/t-ch5-button-list';
import { ICh5GenericListAttributes } from "../../ch5-common/interfaces/i-ch5-generic-list-attributes";

/**
 * @ignore
 */
export interface ICh5TabButtonAttributes extends ICh5GenericListAttributes {
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
  orientation: TCh5GenericListAttributesOrientation;
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
  buttonType: TCh5ButtonListButtonType;
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
  buttonHAlignLabel: TCh5ButtonListButtonHAlignLabel;
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
  buttonVAlignLabel: TCh5ButtonListButtonVAlignLabel;
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
   * "Valid values are 'rectangle(default)', 'rounded-rectangle'. This attribute sets shape of the button."
   * ]
   * @name buttonshape
   * @default rectangle
   * @attributeType "EnumeratedValue"
   */
  buttonShape: TCh5ButtonListButtonShape;
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
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
   * @default 
   * @attributeType "String"
   */
  buttonReceiveStateEnable: string;
}
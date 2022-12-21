import { ICh5GenericListAttributesAttributes } from "../../ch5-generic-list-attributes/interfaces";
import { TCh5ButtonListButtonType, TCh5ButtonListButtonHAlignLabel, TCh5ButtonListButtonVAlignLabel, TCh5ButtonListButtonCheckboxPosition, TCh5ButtonListButtonIconPosition, TCh5ButtonListButtonShape, } from './t-ch5-button-list';

/**
 * @ignore
 */
export interface ICh5ButtonListAttributes extends ICh5GenericListAttributesAttributes {
  /**
  * @documentation
  * [
  * "`buttonType` attribute",
  * "***",
  * "buttonType sets the button background for all the buttons in the list. 
  * Possible values are default, danger, text, warning, info, success, primary, secondary."
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
  * "Default attribute is center. 
  * Possible values are 'center', 'left', 'right'. 
  * When the buttonHAlignLabel property is set, the label and the icon of the button are horizontally aligned.  
  * The center property sets the horizontal alignment of the label to the center of the button. 
  * The left property sets the horizontal alignment of the label to the left of the button.   
  * The right property sets the horizontal alignment of the label to the right of the button."
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
  * "Default attribute is middle. 
  * Possible values are 'middle', 'top', 'bottom'. 
  * When the buttonVAlignLabel property is set, the label and the icon of the button are vertically aligned. 
  * The middle property sets the vertical alignment of the label to the middle of the button. 
  * The top property sets the vertical alignment of the label to the top of the button.  
  * The bottom property sets the vertical alignment of the label to the bottom of the button."
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
  * "Default value is left. 
  * Valid values are 'left', 'right'. 
  * This property is used to set the position of a checkbox in a button. 
  * The value left would set the checkbox to the left of the button and the value right would set the checkbox to the right of the button."
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
  * "The default value is 'first',
  * Valid values: 'first', 'last', 'top', 'bottom'.
  * The icon position relative to the label."
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
  * "The default value is 'rounded-rectangle'. 
  * Valid values: 'rounded-rectangle', 'rectangle'.  
  * This attribute sets shape of the button."
  * ]
  * @name buttonshape
  * @default rounded-rectangle
  * @attributeType "EnumeratedValue"
  */
  buttonShape: TCh5ButtonListButtonShape;
  /**
   * @documentation
   * [
   * "`buttonCheckboxShow` attribute",
   * "***",
   * "The default value is false. 
   * This property is used to display or hide a checkbox.  
   * If set to true, a checkbox is displayed."
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
   * "The default value is false. 
   * This property reflects the selected state of the component."
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
   * "ButtonPressed"
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
   * "The default value is 0. 
   * This property is used to set or get the mode of the ch5-button in a multi-mode environment.
   * The maximum value that can be set is 99."
   * ]
   * @name buttonmode
   * @default 0
   * @limits [{"min": 0, "max": 99}]
   * @attributeType "Integer"
   */
  buttonMode: number;
  /**
   * @documentation
   * [
   * "`buttonIconClass` attribute",
   * "***",
   * "The iconClass attribute with Font Awesome icons and Material Icons. 
   * You can declare more than one css class in the iconClass attribute."
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
   * "The iconUrl attribute with SVG icons and PNG Icons we can pass only one url in the iconUrl attribute"
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
   * "Ability to provide a template that applies for all the buttons in the list"
   * ]
   * @name buttonlabelinnerhtml
   * @attributeType "EncodedHTML"
   * @hidden true
   */
  buttonLabelInnerHtml: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonMode` attribute",
   * "***",
   * "When received, applies a value to the mode attribute from the signal."
   * ]
   * @name receivestatebuttonmode
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonMode: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonSelected` attribute",
   * "***",
   * "When received, applies a true value applied by the selected class (ch5-button--selected)."
   * ]
   * @name receivestatebuttonselected
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonSelected: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonLabel` attribute",
   * "***",
   * "When received, applies the value on the label."
   * ]
   * @name receivestatebuttonlabel
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonLabel: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonScriptLabelHtml` attribute",
   * "***",
   * "Allows the signal script evaluation to be applied to the button.inner HTML class. 
   * Allows for multiline, multistyled labels."
   * ]
   * @name receivestatebuttonscriptlabelhtml
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonScriptLabelHtml: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonIconClass` attribute",
   * "***",
   * "The icon class received from the control system."
   * ]
   * @name receivestatebuttoniconclass
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonIconClass: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonType` attribute",
   * "***",
   * "After receiving a stateType value from control system, this value is applied to the type attribute. 
   * See description of the type attribute."
   * ]
   * @name receivestatebuttontype
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonType: string;
  /**
   * @documentation
   * [
   * "`receiveStateButtonIconUrl` attribute",
   * "***",
   * "After receiving stateIconUrl value from control system, this value is applied to the iconUrl attribute. 
   * See description of the iconUrl attribute."
   * ]
   * @name receivestatebuttoniconurl
   * @default 
   * @attributeType "String"
   */
  receiveStateButtonIconUrl: string;
  /**
   * @documentation
   * [
   * "`sendEventOnButtonClick` attribute",
   * "***",
   * "Sends an event on click or tap (mouse or swipe up and down quickly). 
   * Use this when the control system takes an action on the rising edge from false to true of a boolean digital event."
   * ]
   * @name sendeventonbuttonclick
   * @default 
   * @attributeType "String"
   */
  sendEventOnButtonClick: string;
  /**
   * @documentation
   * [
   * "`sendEventOnButtonTouch` attribute",
   * "***",
   * "Sends a boolean true event when the screen is tapped and a boolean false event when released. 
   * Use this when the control system takes an action on a level-sensitive boolean digital event."
   * ]
   * @name sendeventonbuttontouch
   * @default 
   * @attributeType "String"
   */
  sendEventOnButtonTouch: string;
}
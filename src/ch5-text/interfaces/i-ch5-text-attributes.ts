import { ICh5CommonAttributesText } from "../../ch5-common/interfaces/i-ch5-common-attributes-text";
import { TCh5TextHorizontalAlignment, TCh5TextVerticalAlignment, } from './t-ch5-text';

/**
 * @ignore
 */
export interface ICh5TextAttributes extends ICh5CommonAttributesText {
  /**
  * @documentation
  * [
  * "`horizontalAlignment` attribute",
  * "***",
  * "Sets the text horizontally aligned to the container."
  * ]
  * @name horizontalalignment
  * @default center
  * @attributeType "EnumeratedValue"
  */
  horizontalAlignment: TCh5TextHorizontalAlignment;
  /**
  * @documentation
  * [
  * "`verticalAlignment` attribute",
  * "***",
  * "Sets the text vertically aligned to the container."
  * ]
  * @name verticalalignment
  * @default middle
  * @attributeType "EnumeratedValue"
  */
  verticalAlignment: TCh5TextVerticalAlignment;
  /**
  * @documentation
  * [
  * "`multilineSupport` attribute",
  * "***",
  * "Enables or disables support for multi-line text. Text will be truncated when the text content area does not allow for a second line. This shall not resize the text area to fit the text."
  * ]
  * @name multilinesupport
  * @default false
  * @attributeType "Boolean"
  */
  multilineSupport: boolean;
  /**
   * @documentation
   * [
   * "`truncateText` attribute",
   * "***",
   * "Enables or disables text truncation depending on the length of text and the size of the control. This attribute when set to true will show an ellipsis when the text extends beyond the horizontally and vertically allocated space."
   * ]
   * @name truncatetext
   * @default false
   * @attributeType "Boolean"
   */
  truncateText: boolean;
  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "Sets the text displayed on the label."
   * ]
   * @name label
   * @default 
   * @attributeType "String"
   */
  label: string;
  /**
   * @documentation
   * [
   * "`receiveStateLabel` attribute",
   * "***",
   * "Select a serial join to receive feedback from the control system. The value of this join gets assigned to the label as text. NOTE: Due to a clearing of all joins at design time, if a join is set, the design time label will not display any text."
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateLabel: string;
  /**
   * @documentation
   * [
   * "`labelInnerHtml` attribute",
   * "***",
   * "Used to set the label displayed for the text. This attribute takes the preference over the label attribute."
   * ]
   * @name labelinnerhtml
   * @default 
   * @attributeType "EncodedHTML"
   * @hidden true
   */
  labelInnerHtml: string;
  /**
  * @documentation
  * [
  * "`receivestatescriptlabelhtml` attribute",
  * "***",
  * "The value of the receiveStateScriptLabelHTML attribute is the name of a string signal. The signal should contain valid HTML. This HTML code will be placed in the label part of the ch5-text."
  * ]
  * @name receivestatescriptlabelhtml
  * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
  * @attributeType "Join"
  */
    receiveStateScriptLabelHtml: string;

}
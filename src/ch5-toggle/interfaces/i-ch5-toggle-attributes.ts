import { ICh5CommonAttributesToggle } from "../../ch5-common/interfaces/i-ch5-common-attributes-toggle";
import { TCh5ToggleHandleShape, TCh5ToggleOrientation, } from './t-ch5-toggle';

/**
 * @ignore
 */
export interface ICh5ToggleAttributes extends ICh5CommonAttributesToggle {
  /**
  * @documentation
  * [
  * "`handleShape` attribute",
  * "***",
  * "The default value is 'circle'. Sets the shape that will also determine the shape of the component (rectangle or circle)."
  * ]
  * @name handleshape
  * @default circle
  * @attributeType "EnumeratedValue"
  */
  handleShape: TCh5ToggleHandleShape;
  /**
  * @documentation
  * [
  * "`label` attribute",
  * "***",
  * "The label attribute allows a string value to be defined that will be used as the label for the ch5-toggle."
  * ]
  * @name label
  * @default 
  * @attributeType "String"
  */
  label: string;
  /**
   * @documentation
   * [
   * "`labelOn` attribute",
   * "***",
   * "Custom text to display on the toggle when the toggle is ON."
   * ]
   * @name labelon
   * @default 
   * @attributeType "String"
   */
  labelOn: string;
  /**
   * @documentation
   * [
   * "`labelOff` attribute",
   * "***",
   * "Custom text to display on the toggle when the toggle is OFF."
   * ]
   * @name labeloff
   * @default 
   * @attributeType "String"
   */
  labelOff: string;
  /**
   * @documentation
   * [
   * "`iconOn` attribute",
   * "***",
   * "Specifies a custom icon class when the toggle is ON."
   * ]
   * @name iconon
   * @default 
   * @attributeType "String"
   */
  iconOn: string;
  /**
   * @documentation
   * [
   * "`iconOff` attribute",
   * "***",
   * "Specifies a custom icon class when the toggle is OFF."
   * ]
   * @name iconoff
   * @default 
   * @attributeType "String"
   */
  iconOff: string;
  /**
   * @documentation
   * [
   * "`orientation` attribute",
   * "***",
   * "The default value is 'horizontal'. Valid values: 'horizontal', 'vertical'. Sets the control elements in a horizontal or vertical orientation. ", For vertical alignment, it will apply a CSS class that will rotate the ", component -90 degrees (270 degrees clockwise, 90 degrees counter clockwise)"
   * ]
   * @name orientation
   * @default horizontal
   * @attributeType "EnumeratedValue"
   */
  orientation: TCh5ToggleOrientation;
  /**
  * @documentation
  * [
  * "`value` attribute",
  * "***",
  * "The default value is false. The initial value of the component. When feedbackMode=submit, this property will change to the last, value submitted. When reset, the value property will be changed to, the initial value or last value on submit."
  * ]
  * @name value
  * @default false
  * @attributeType "Boolean"
  */
  value: boolean;
  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "The receiving value from the signal."
   * ]
   * @name receivestatevalue
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  receiveStateValue: string;
  /**
   * @documentation
   * [
   * "`receiveStateScriptLabelHTML` attribute",
   * "***",
   * "The value of the receiveStateScriptLabelHTML attribute is the name of a string signal. The signal should contain valid HTML. This HTML code will be placed in the label part of the ch5-toggle"
   * ]
   * @name receivestatescriptlabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScriptLabelHTML: string;
  /**
   * @documentation
   * [
   * "`sendEventOnClick` attribute",
   * "***",
   * "Sends a signal on a click or tap event (mouse or swipe up and down quickly)."
   * ]
   * @name sendeventonclick
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnClick: string;

}
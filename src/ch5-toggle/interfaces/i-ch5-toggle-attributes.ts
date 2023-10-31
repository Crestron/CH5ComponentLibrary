import { ICh5CommonAttributesToggle } from "../../ch5-common/interfaces/i-ch5-common-attributes-toggle";
import { TCh5ToggleHandleShape, TCh5ToggleOrientation, TCh5ToggleSize } from './t-ch5-toggle';
import { TCh5CommonInputFeedbackModes } from "../../ch5-common-input/interfaces/t-ch5-common-input";

/**
 * @ignore
 */
export interface ICh5ToggleAttributes extends ICh5CommonAttributesToggle {
  /**
  * @documentation
  * [
  * "`handleShape` attribute",
  * "***",
  * "The default value is 'circle'. Possible values are circle, rectangle. Sets the shape that will determine the shape of the component."
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
   * "Allows string values to be defined for the labelOn."
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
   * "Allows string values to be defined for the labelOff."
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
   * "Allows icons to be defined for the on state of the ch5-toggle. You can declare CSS class in the iconOn attribute."
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
   * "Allows icons to be defined for the off state of the ch5-toggle. You can declare CSS class in the iconOff attribute."
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
   * "The default value is horizontal. Possible values are 'horizontal' or 'vertical'. Sets the control elements in a horizontal or vertical orientation. ", For vertical alignment, it will apply a CSS class that will rotate the ", component 90 degrees (-90 degrees counter clockwise)"
   * ]
   * @name orientation
   * @default horizontal
   * @attributeType "EnumeratedValue"
   */
  orientation: TCh5ToggleOrientation;
  /**
   * @documentation
   * [
   * "`size` attribute",
   * "***",
   * "The default value is regular. Possible values are regular, x-small, small, large, x-large."
   * ]
   * @name size
   * @default regular
   * @attributeType "EnumeratedValue"
   */
  size: TCh5ToggleSize;
  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "The default value is false. Possible values are true, false. When feedbackMode=submit, this property will change to the last, value submitted. When reset, the value property will be changed to, the initial value or last value on submit."
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
   * "The toggle value gets updated with the newly received value from signal."
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
  /**
   * @documentation
   * [
   * "`feedbackmode` attribute",
   * "***",
   * "The default value is 'direct'. If direct, value send and receive will be ",
   * "instant. On submit, it will send and listen for the first event received."
   * ]
   * @name feedbackmode
   * @default direct
   * @attributeType "EnumeratedValue"
   */
  feedbackMode: TCh5CommonInputFeedbackModes;
}
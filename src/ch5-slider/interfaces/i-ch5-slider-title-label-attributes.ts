/**
 * @ignore
 */
export interface ICh5SliderTitleLabelAttributes {

  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "It adds the label to the slider Title."
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
   * "When received, applies the value to set the label displayed for the title of the advance slider."
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateLabel: string;
}
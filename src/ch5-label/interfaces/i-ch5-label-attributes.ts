import { ICh5CommonAttributes } from "../../ch5-common/interfaces";


/**
 * @ignore
 */
export interface ICh5LabelAttributes extends ICh5CommonAttributes {
  /**
   * @documentation
   * [
   * "`label` attribute",
   * "***",
   * "Label"
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
   * "Select a serial join to receive feedback from the control system. The value of this join gets assigned to the label as text.  "
   * ]
   * @name receivestatelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateLabel: string;

}
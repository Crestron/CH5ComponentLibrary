import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

export interface ICh5JoinTextStringAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "Defines an value for the jointext."
   * ]
   * @name value
   * @attributeType "string"
   */
    value: string;

  /**
   * @documentation
   * [
   * "`textWhenEmpty` attribute",
   * "***",
   * "Defines an text that will be displayed on value is empty for the jointext."
   * ]
   * @name textWhenEmpty
   * @attributeType "string"
   */
    textWhenEmpty: string;
    
  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "Defines the receivestatevalue state name."
   * ]
   * @name receiveStateValue
   * @attributeType "string"
   */
   receiveStateValue: string;
}
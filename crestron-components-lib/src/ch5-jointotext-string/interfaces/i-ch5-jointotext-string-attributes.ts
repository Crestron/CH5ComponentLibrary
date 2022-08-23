import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5JoinToTextStringAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "Defines an value for the jointotext."
   * ]
   * @name value
   * @default ""
   * @attributeType "String"
   */
    value: string;

  /**
   * @documentation
   * [
   * "`textWhenEmpty` attribute",
   * "***",
   * "Defines an text that will be displayed on value is empty for the jointotext."
   * ]
   * @name textwhenempty
   * @default ""
   * @attributeType "String"
   */
    textWhenEmpty: string;
    
  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "Defines the receivestatevalue state name."
   * ]
   * @name receivestatevalue
   * @default ""
   * @attributeType "Join"
   */
   receiveStateValue: string;
}
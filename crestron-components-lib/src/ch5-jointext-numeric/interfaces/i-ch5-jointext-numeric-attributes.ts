import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { NumericFormats } from "../format/numeric-formats";

export interface ICh5JointextNumericAttributes extends ICh5CommonAttributes {
   
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
     * "`type` attribute",
     * "***",
     * "Defines the numeric type."
     * ]
     * @name type
     * @attributeType "string"
     */
    type: NumericFormats;

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
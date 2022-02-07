import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5JointextBooleanAttributes extends ICh5CommonAttributes {

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
   * "`textWhenTrue` attribute",
   * "***",
   * "Defines an text that will be displayed on value=true for the jointext."
   * ]
   * @name textWhenTrue
   * @attributeType "string"
   */
    textWhenTrue: string;

  /**
   * @documentation
   * [
   * "`textWhenFalse` attribute",
   * "***",
   * "Defines an text that will be displayed on value=false for the jointext."
   * ]
   * @name textWhenFalse
   * @attributeType "string"
   */
    textWhenFalse: string;

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
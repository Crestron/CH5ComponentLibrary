import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @ignore
 */
export interface ICh5JoinToTextBooleanAttributes extends ICh5CommonAttributes {

  /**
   * @documentation
   * [
   * "`value` attribute",
   * "***",
   * "Defines an value for the jointotext."
   * ]
   * @name value
   * @default ""
   * @attributeType "string"
   */
    value: string;

  /**
   * @documentation
   * [
   * "`textWhenTrue` attribute",
   * "***",
   * "Defines an text that will be displayed on value=true for the jointotext."
   * ]
   * @name textWhenTrue
   * @default ""
   * @attributeType "string"
   */
    textWhenTrue: string;

  /**
   * @documentation
   * [
   * "`textWhenFalse` attribute",
   * "***",
   * "Defines an text that will be displayed on value=false for the jointotext."
   * ]
   * @name textWhenFalse
   * @default ""
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
   * @default ""
   * @attributeType "string"
   */
   receiveStateValue: string;

}
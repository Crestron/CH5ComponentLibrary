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
   * "Defines an value for the jointotext-boolean."
   * ]
   * @name value
   * @default false
   * @attributeType "string"
   */
    value: boolean;

  /**
   * @documentation
   * [
   * "`textWhenTrue` attribute",
   * "***",
   * "Defines an text that will be displayed on value=true for the jointotext-boolean."
   * ]
   * @name textwhentrue
   * @default ""
   * @attributeType "string"
   */
    textWhenTrue: string;

  /**
   * @documentation
   * [
   * "`textWhenFalse` attribute",
   * "***",
   * "Defines an text that will be displayed on value=false for the jointotext-boolean."
   * ]
   * @name textwhenfalse
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
   * @name receivestatevalue
   * @default ""
   * @attributeType "string"
   */
   receiveStateValue: string;

}
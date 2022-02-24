import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { NumericFormats } from "../format/numeric-formats";

/**
 * @ignore
 */
export interface ICh5JoinToTextNumericAttributes extends ICh5CommonAttributes {

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
   * "`type` attribute",
   * "***",
   * "Defines the numeric type."
   * ]
   * @name type
   * @default signed
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
   * @default ""
   * @attributeType "string"
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`decimalLength` attribute",
   * "***",
   * "Defines the floating point position."
   * ]
   * @name decimalLength
   * @default 2
   * @attributeType "string"
   */
  decimalLength: number;

  /**
   * @documentation
   * [
   * "`length` attribute",
   * "***",
   * "Defines the whole number min length."
   * ]
   * @name length
   * @default 0
   * @attributeType "string"
   */
  length: number;

  /**
   * @documentation
   * [
   * "`min` attribute",
   * "***",
   * "Defines the min range used only for percentage type."
   * ]
   * @name min
   * @default 0
   * @attributeType "string"
   */
  min: number;

  /**
   * @documentation
   * [
   * "`max` attribute",
   * "***",
   * "Defines the max range used only for percentage type."
   * ]
   * @name max
   * @default 65535
   * @attributeType "string"
   */
  max: number;
}
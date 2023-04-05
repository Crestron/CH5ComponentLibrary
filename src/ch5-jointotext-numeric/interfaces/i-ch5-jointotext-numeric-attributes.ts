import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5JoinInfoNumericFormats } from "./t-ch5-jointotext-numeric";

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
   * @attributeType "String"
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
   * @attributeType "EnumeratedValue"
   */
  type: TCh5JoinInfoNumericFormats;

  /**
   * @documentation
   * [
   * "`receiveStateValue` attribute",
   * "***",
   * "Defines the receivestatevalue state name."
   * ]
   * @name receivestatevalue
   * @default ""
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateValue: string;

  /**
   * @documentation
   * [
   * "`decimalLength` attribute",
   * "***",
   * "Defines the floating point position."
   * ]
   * @name decimallength
   * @default 2
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
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
   * @attributeType "String"
   */
  max: number;
}
import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5GenericListAttributesOrientation, TCh5GenericListAttributesStretch, } from './t-ch5-generic-list-attributes';

/**
 * @ignore
 */
export interface ICh5GenericListAttributesAttributes extends ICh5CommonAttributes {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "default horizontal. direction of scroll/pan of adjacent "
  * ]
  * @name orientation
  * @default horizontal
  * @attributeType "EnumeratedValue"
  */
  orientation: TCh5GenericListAttributesOrientation;
  /**
  * @documentation
  * [
  * "`stretch` attribute",
  * "***",
  * "default empty. When not empty provides adds CSS classes to define width, height or both as size of containing element"
  * ]
  * @name stretch
  * @attributeType "EnumeratedValue"
  */
  stretch: TCh5GenericListAttributesStretch | null;
  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "default value is false"
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "Boolean"
   */
  scrollbar: boolean;
  /**
   * @documentation
   * [
   * "`centerItems` attribute",
   * "***",
   * "default false"
   * ]
   * @name centeritems
   * @default false
   * @attributeType "Boolean"
   */
  centerItems: boolean;
  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "default false"
   * ]
   * @name endless
   * @default false
   * @attributeType "Boolean"
   */
  endless: boolean;
  /**
  * @documentation
  * [
  * "`maxNumberOfItems` attribute",
  * "***",
  * "MaxNumberOfItems the ability to designate the largest number of items they wish the list to include"
  * ]
  * @name maxnumberofitems
  * @default 10
  * limits [{"min": 1, "max": 500}]
  * @attributeType "Integer"
  */
  maxNumberOfItems: number;
  /**
   * @documentation
   * [
   * "`rows` attribute",
   * "***",
   * "showWhen orientation is horizontal"
   * ]
   * @name rows
   * @default 1
   * limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":["horizontal"]}]
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "show When orientation is vertical"
   * ]
   * @name columns
   * @default 1
   * limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":["vertical"]}]
   */
  columns: number;
  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "default value is idx.  Allows differentiation of each item in the list in the <ch5-button-list-label> element. "
   * ]
   * @name indexid
   * @default idx
   * @attributeType "String"
   */
  indexId: string;
  /**
   * @documentation
   * [
   * "`receiveStateMaxNumberOfItems` attribute",
   * "***",
   * "Value received from the receiveStateMaxNumberOfItems Join will be constrained for maxNumberOfItems attribute. "
   * ]
   * @name receivestatemaxnumberofitems
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateMaxNumberOfItems: string;

}
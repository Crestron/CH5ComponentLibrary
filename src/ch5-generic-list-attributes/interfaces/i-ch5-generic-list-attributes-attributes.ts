import { ICh5GenericListAttributes } from "../../ch5-common/interfaces/i-ch5-generic-list-attributes";
import { TCh5GenericListAttributesOrientation, TCh5GenericListAttributesStretch, } from './t-ch5-generic-list-attributes';

/**
 * @ignore
 */
export interface ICh5GenericListAttributesAttributes extends ICh5GenericListAttributes {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "The default value is 'horizontal'. Valid values: 'horizontal' or 'vertical'. Positions the list elements in a horizontal or vertical orientation."
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
   * "The default value is false. If true, shows a scrollbar for the list."
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
   * "The default value is false. NOTE: Parent container has to be set a fixed height and width to see the expected behaviour."
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
   * "The default value is false. If false, continued swiping when reaching end of list reveals no items beyond the last. If true, if the attribute is added without a value, the first list item will virtually follow the last item when the end of the list is reached. Swiping towards the beginning of the list items will also show the last item prior to the first."
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
   * "sets the number of rows for the list only when the orientation is horizontal."
   * ]
   * @name rows
   * @default 1
   * limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"horizontal"}]
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "sets the number of columns for the list only when the orientation is vertical."
   * ]
   * @name columns
   * @default 1
   * limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"vertical"}]
   */
  columns: number;
  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "default value is idx. Allows differentiation of each item in the list in the ch5-button-list-label element."
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
   * "Value received from the receiveStateMaxNumberOfItems Join will be constrained for maxNumberOfItems attribute."
   * ]
   * @name receivestatemaxnumberofitems
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateMaxNumberOfItems: string;

}
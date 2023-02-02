import { ICh5GenericListAttributes } from "../../ch5-common/interfaces/i-ch5-generic-list-attributes";
import { TCh5GenericListAttributesOrientation, TCh5GenericListAttributesStretch } from './t-ch5-generic-list-attributes';

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
   * "`scrollbar` attribute",
   * "***",
   * "The default value is false. If scrollbar is true, then shows a scrollbar for the button list."
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
   * "The default value is false. This attribute sets the buttons in the list to be center aligned. If Stretch attribute is set to both then stretch attribute will take more priority than centerItems attribute."
   * ]
   * @name centeritems
   * @default false
   * @attributeType "Boolean"
   */
  centerItems: boolean;
  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "The default value is null. Valid values are null and 'both'. NOTE: stretch is set to null whenever there are multiple rows and columns. Stretch attribute is set to both will take more priority than centerItems attribute."
   * ]
   * @name stretch
   * @default false
   * @attributeType "Boolean"
   */
  stretch: TCh5GenericListAttributesStretch | null;
  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "The default value is false. If false, continued swiping when reaching end of list reveals no items beyond the last. If true, if the attribute is added without a value, the first list item will virtually follow the last item when the end of the list is reached. Swiping towards the beginning of the list items will also show the last item prior to the first. Note: Endless is set to false whenever there are multiple rows and columns."
   * ]
   * @name endless
   * @default false
   * @attributeType "Boolean"
   */
  endless: boolean;
  /**
  * @documentation
  * [
  * "`numberOfItems` attribute",
  * "***",
  * "Default value is 10,  Minimum value is 1 and Maximum value is 500. This attribute sets the number of buttons in the button lists"
  * ]
  * @name numberofitems
  * @default 10
  * @limits [{"min": 1, "max": 500}]
  * @attributeType "Integer"
  */
  numberOfItems: number;
  /**
   * @documentation
   * [
   * "`rows` attribute",
   * "***",
   * "Default value is 1, Minimum value 1 and Maximum value 500. By using rows attribute the designer can align the buttons in multiple rows of the list when the orientation is horizontal."
   * ]
   * @name rows
   * @default 1
   * @limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"horizontal"}]
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "Default value is 1, Minimum value 1 and Maximum value 500. By using columns attribute the designer can align the buttons in multiple columns of the list when the orientation is vertical."
   * ]
   * @name columns
   * @default 1
   * @limits [{"min": 1, "max": 500}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"vertical"}]
   */
  columns: number;
  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "This attribute helps to replace the pattern with the index on the ch5-button-list."
   * ]
   * @name indexid
   * @attributeType "String"
   */
  indexId: string;
  /**
   * @documentation
   * [
   * "`receiveStateNumberOfItems` attribute",
   * "***",
   * "signal value received from the receiveStateNumberOfItems Join will be constrained for numberOfItems attribute."
   * ]
   * @name receivestatenumberofitems
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateNumberOfItems: string;
  /**
  * @documentation
  * [
  * "`scrollToPosition` attribute",
  * "***",
  * "Default value is 0, Minimum value is 0 and Maximum value is 499. Indicates the index of the button to scrollTo. This is applicable only for single row and column."
  * ]
  * @name scrolltoposition
  * @default 0
  * @limits [{"min": 0, "max": 499}]
  * @attributeType "Integer"
  */
  scrollToPosition: number;
  /**
   * @documentation
   * [
   * "`receiveStateScrollToPosition` attribute",
   * "***",
   * "Signal indicates the index of the button to scrollTo. This is applicable only for single row and column."
   * ]
   * @name receivestatescrolltoposition
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScrollToPosition: string;

}
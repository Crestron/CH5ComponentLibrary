import { ICh5SubpageReferenceListCommonAttributes } from "../../ch5-common/interfaces/i-ch5-subpage-reference-list-attributes";
import { TCh5SubpageReferenceListAttributesLoadItems, TCh5SubpageReferenceListOrientation, TCh5SubpageReferenceListStretch, } from './t-ch5-subpage-reference-list';

/**
 * @ignore
 */
export interface ICh5SubpageReferenceListAttributes extends ICh5SubpageReferenceListCommonAttributes {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "Positions the subpage elements in a horizontal or vertical orientation. Default value is 'horizontal'."
  * ]
  * @name orientation
  * @default horizontal
  * @attributeType "EnumeratedValue"
  */
  orientation: TCh5SubpageReferenceListOrientation;
  /**
   * @documentation
   * [
   * "`contractName` attribute",
   * "***",
   * "The contract Name is an encapsulated join type that links a smart control with a CED in SIMPL."
   * ]
   * @name contractname
   * @default 
   * @attributeType "String"
   */
  contractName: string;
  /**
   * @documentation
   * [
   * "`useContractForEnable` attribute",
   * "***",
   * "When true, contract 'Enable' state determines if the list is enabled. When false, the 'receiveStateEnable' join may be applied. Consistent with other components, if the 'receiveStateEnable' join is provide, the value of that join determines if the component is enabled. "
   * ]
   * @name usecontractforenable
   * @default false
   * @attributeType "Boolean"
   */
  useContractForEnable: boolean;
  /**
   * @documentation
   * [
   * "`useContractForShow` attribute",
   * "***",
   * " When true, contract 'Show' state determines if the list is enabled. When false, the 'receiveStateShow' join may be applied. Consistent with other components, if the 'receiveStateShow' join is provide, the value of that join determines if the component is visible. "
   * ]
   * @name usecontractforshow
   * @default false
   * @attributeType "Boolean"
   */
  useContractForShow: boolean;
  /**
   * @documentation
   * [
   * "`useContractForItemEnable` attribute",
   * "***",
   * "When true, contract 'List_Item{{x}}_Enable' state determines if an individual subpage x is enabled. "
   * ]
   * @name usecontractforitemenable
   * @default false
   * @attributeType "Boolean"
   */
  useContractForItemEnable: boolean;
  /**
   * @documentation
   * [
   * "`useContractForItemShow` attribute",
   * "***",
   * "When true, contract 'List_Item{{x}}_Visible' state determines if an individual subpage x is visible. "
   * ]
   * @name usecontractforitemshow
   * @default false
   * @attributeType "Boolean"
   */
  useContractForItemShow: boolean;
  /**
   * @documentation
   * [
   * "`useContractForCustomStyle` attribute",
   * "***",
   * "contract for custom style "
   * ]
   * @name usecontractforcustomstyle
   * @default false
   * @attributeType "Boolean"
   */
  useContractForCustomStyle: boolean;
  /**
   * @documentation
   * [
   * "`useContractForCustomClass` attribute",
   * "***",
   * "contract for custom class"
   * ]
   * @name usecontractforcustomclass
   * @default false
   * @attributeType "Boolean"
   */
  useContractForCustomClass: boolean;
  /**
   * @documentation
   * [
   * "`useContractForNumItems` attribute",
   * "***",
   * "When false, the 'receiveStateNumberOfItems' join may be applied. Consistent with other components, if the 'receiveStateNumberOfItems' join is provide, the value of that join determines how many items in the list to show. "
   * ]
   * @name usecontractfornumitems
   * @default false
   * @attributeType "Boolean"
   */
  useContractForNumItems: boolean;
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
   * "`centerItems` attribute",
   * "***",
   * "It will center the list items, if the number and size of the list items is less than the size of the control.If Stretch attribute is set to both then stretch attribute will take more priority than centerItems attribute. Default value is false."
   * ]
   * @name centeritems
   * @default false
   * @attributeType "Boolean"
   */
  centerItems: boolean;
  /**
   * @documentation
   * [
   * "`rows` attribute",
   * "***",
   * "Sets the number of rows the contents of the list will be divided into.  It can range from 1 to 600 and default value is 1."
   * ]
   * @name rows
   * @default 1
   * @limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"horizontal"}]
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "Sets the number of columns the contents of the list will be divided into. It can range from 1 to 600 and default value is 1."
   * ]
   * @name columns
   * @default 1
   * @limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   * @showWhen [{"orientation":"vertical"}]
   */
  columns: number;
  /**
  * @documentation
  * [
  * "`scrollToPosition` attribute",
  * "***",
  * "Indicates the index of the subpage to scrollTo. This is applicable only for single row and column. The default value is 0, Minimum value is 0 and Maximum value is 599."
  * ]
  * @name scrolltoposition
  * @default 0   
  * @limits [{"min": 0, "max": 599}]
  * @attributeType "Integer"
  */
  scrollToPosition: number;
  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "Determines whether or not the scrollbar will be visible on the subpage-reference list. Default Value is false."
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "Boolean"
   */
  scrollbar: boolean;
  /**
   * @documentation
   * [
   * "`booleanJoinIncrement` attribute",
   * "***",
   * "The Digital Join Increment will be used to increment the digital joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used."
   * ]
   * @name booleanjoinincrement
   * @attributeType "Integer"
   */
  booleanJoinIncrement: string;
  /**
   * @documentation
   * [
   * "`numericJoinIncrement` attribute",
   * "***",
   * "The Analog Join Increment will be used to increment the analog joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used."
   * ]
   * @name numericjoinincrement
   * @attributeType "Integer"
   */
  numericJoinIncrement: string;
  /**
   * @documentation
   * [
   * "`stringJoinIncrement` attribute",
   * "***",
   * "The Serial Join Increment will be used to increment the serial joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used."
   * ]
   * @name stringjoinincrement
   * @attributeType "Integer"
   */
  stringJoinIncrement: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateEnable` attribute",
   * "***",
   * "Enables use of enable joins on each list item. With this enabled, if a list item is not programmatically driven HIGH through the control system, the list item will be disabled."
   * ]
   * @name subpagereceivestateenable
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   * @applicableToListItem true
   */
  subpageReceiveStateEnable: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateShow` attribute",
   * "***",
   * "Enables use of visibility joins on each list item.If a list item is not programmatically driven HIGH through the control system, the list item will not be visible."
   * ]
   * @name subpagereceivestateshow
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   * @applicableToListItem true
   */
  subpageReceiveStateShow: string;
  /**
   * @documentation
   * [
   * "`widgetId` attribute",
   * "***",
   * "It provides the widgetId to be included in the subpage reference."
   * ]
   * @name widgetid
   * @default 
   * @attributeType "String"
   */
  widgetId: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateScrollTo` attribute",
   * "***",
   * "It scrolls to the position of the subpage in subpage-reference list based on the signal received."
   * ]
   * @name subpagereceivestatescrollto
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  subpageReceiveStateScrollTo: string;

  /**
   * @documentation
   * [
   * "`stretch` attribute",
   * "***",
   * "The default value is null. Valid values are null and 'both'. NOTE: stretch is set to null whenever there are multiple rows and columns. Stretch attribute is set to both will take more priority than centerItems attribute."
   * ]
   * @name stretch
   * @attributeType "EnumeratedValue"
   */
  stretch: TCh5SubpageReferenceListStretch | null;

  /**
   * @documentation
   * [
   * "`numberOfItems` attribute",
   * "***",
   * "Specifies the number of subpage references to be added to the list.Its Min value is 1 and Max value is 600. Its default value is 10."
   * ]
   * @name numberofitems
   * @default 10
   * @limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  numberOfItems: number;
  /**
   * @documentation
   * [
   * "`receiveStateNumberOfItems` attribute",
   * "***",
   * "It sets the number of subpage references to be added to the list on the basis of signal received."
   * ]
   * @name receivestatenumberofitems
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateNumberOfItems: string;

  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "This attribute helps to replace the pattern with the index on the ch5-subpage-reference-list"
   * ]
   * @name indexid
   * @attributeType "String"
   */
  indexId: string;

  /**
   * @documentation
   * [
   * "`loadItems:` attribute",
   * "***",
   * "The default value is visible-only. The possible values are visible-only, load-new, all. This attribute allows for subpages to be created and loaded on demand. Will determine if subpages are removed or not after they are no longer in visibility."
   * ]
   * @name loaditems
   * @attributeType "EnumeratedValue"
   * @default visible-only
   */
  loadItems: TCh5SubpageReferenceListAttributesLoadItems;

}
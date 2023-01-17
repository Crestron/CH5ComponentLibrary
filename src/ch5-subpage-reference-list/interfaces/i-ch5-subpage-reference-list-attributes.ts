import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5SubpageReferenceListStretch, } from './t-ch5-subpage-reference-list';

/**
 * @ignore
 */
export interface ICh5SubpageReferenceListAttributes extends ICh5CommonAttributes {
  /**
  * @documentation
  * [
  * "`orientation` attribute",
  * "***",
  * "default horizontal. direction of scroll/pan of adjacent objects"
  * ]
  * @name orientation
  * @default horizontal
  * @attributeType "EnumeratedValue"
  */
  orientation: string;
  /**
   * @documentation
   * [
   * "`controlJoinID` attribute",
   * "***",
   * "The Control Jion ID is an encapsulated join type that links a smart control with a CED in SIMPL."
   * ]
   * @name controljoinid
   * @default 
   * @attributeType "String"
   */
  controlJoinID: string;
  /**
   * @documentation
   * [
   * "`endless` attribute",
   * "***",
   * "EndlessCCIDE designers will have the ability to configure the list to have the last item and first item of the list scroll next to each other. This shall only apply to single row and columns lists. If multiple rows and columns are defined, then endless is considered false."
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
   * "CCIDE designers will have the ability to configure the list to center objects in the list "
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
   * "CCIDE designer will have the ability to configure the list to show more than one object in each item of the list  ."
   * ]
   * @name rows
   * @default 1
   * limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  rows: number;
  /**
   * @documentation
   * [
   * "`columns` attribute",
   * "***",
   * "CCIDE designer will have the ability to configure the list to show more than one object in each item of the list."
   * ]
   * @name columns
   * @default 1
   * limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  columns: number;
   /**
   * @documentation
   * [
   * "`scrollToPosition` attribute",
   * "***",
   * "Indicates the index of the button to scrollTo. This is applicable only for single row and column. The default value is 0"
   * ]
   * @name scrolltoposition
   * @default 0   
   * limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
   scrollToPosition: number;
  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "ScrollBar"
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "Boolean"
   */
  scrollbar: boolean;
  /**
   * @documentation
   * [
   * "`booleanJoinOffset` attribute",
   * "***",
   * "The Digital Join Increment will be used to increment the digital joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used  "
   * ]
   * @name booleanjoinoffset
   * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  booleanJoinOffset: string;
  /**
   * @documentation
   * [
   * "`numericJoinOffset` attribute",
   * "***",
   * "The Analog Join Increment will be used to increment the analog joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used"
   * ]
   * @name numericjoinoffset
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  numericJoinOffset: string;
  /**
   * @documentation
   * [
   * "`stringJoinOffset` attribute",
   * "***",
   * "The Serial Join Increment will be used to increment the serial joins of each Sub Page reference in the list. If 0, the value of the Join Increment will be used"
   * ]
   * @name stringjoinoffset
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  stringJoinOffset: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateEnable` attribute",
   * "***",
   * "Enables use of enable joins on each    list item. With this enabled, if a list item is not programmatically driven HIGH through the control system, the list item will be disabled   . . "
   * ]
   * @name subpagereceivestateenable
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  subpageReceiveStateEnable: string;
  /**
   * @documentation
   * [
   * "`subpageReceiveStateVisible` attribute",
   * "***",
   * "Enables use of visibility joins on each list item. With this  checkbox enabled, if a list item is not programmatically driven HIGH through the control system, the list item will not be visible."
   * ]
   * @name subpagereceivestatevisible
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  subpageReceiveStateVisible: string;
  /**
   * @documentation
   * [
   * "`widgetId` attribute",
   * "***",
   * "Each list item will be populated  with a widgetId Reference from the projects existing subpages in CCIDE. Note that there is currently a limit on the types of controls that can be used in a subpage  "
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
   * "Scrolls to the position of the subpage."
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
   * "Sub pages can be stetched to meet the size of container if the stretch is set to both and the size of the number of items is less than container size. Stretch is set to null whenever there are multiple rows and columns. Stretch attribute  set to both will always override centerItems. "
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
   * "NumberOfItems"
   * ]
   * @name numberofitems
   * @default 10
   * limits [{"min": 1, "max": 600}]
   * @attributeType "Integer"
   */
  numberOfItems: number;
  /**
   * @documentation
   * [
   * "`receiveStateNumberOfItems` attribute",
   * "***",
   * "Signal to get the number of items"
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
   * "default value is idx. Allows differentiation of each item in the list in the ch5-subpage-reference-list element."
   * ]
   * @name indexid
   * @default 
   * @attributeType "String"
   */
  indexId: string;

}
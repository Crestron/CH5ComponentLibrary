import { ICh5GenericListAttributes } from "../../ch5-common/interfaces/i-ch5-generic-list-attributes";
import { TCh5GenericListAttributesOrientation, TCh5GenericListAttributesStretch, TCh5GenericListContractItemLabelType, TCh5GenericListContractItemIconType, TCh5GenericListContractNumItemsType, TCh5GenericListContractScrollToType } from './t-ch5-generic-list-attributes';
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
  /**
   * @documentation
   * [
   * "`contractName` attribute",
   * "***",
   * "ContractName attribute sets the name of the contract"
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
   * "When true, contract 'ItemEnable[x]' state determines if an individual button x is enabled. "
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
   * "When true, contract 'ItemShow[x]' state determines if an individual button x is visible. "
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
   * "`contractItemLabelType` attribute",
   * "***",
   * "Valid values are 'textContent', 'innerHTML', 'none'.   When 'none', contract 'ItemLabel[x]', will not change the label of button x. When 'textContent', change in value of contract 'ItemLabel[x]', will change the label as if it were text, not HTML markup. When 'innerHTML', change in value of contract 'ItemLabel[x]', will change the label as if it were HTML content"
   * ]
   * @name contractitemlabeltype
   * @default none
   * @attributeType "EnumeratedValue"
   */
  contractItemLabelType: TCh5GenericListContractItemLabelType;
  /**
  * @documentation
  * [
  * "`contractItemIconType` attribute",
  * "***",
  * "Valid values are 'none', 'iconClass', 'url', 'sgStateName' and 'sgStateNumber'. The last two are reserved for backward compatibility to Smart Graphics Extenders used for Dynamic Button List.  They should not be provided as choices for projects that are not converted from VtPro/Smart Graphics."
  * ]
  * @name contractitemicontype
  * @default none
  * @attributeType "EnumeratedValue"
  */
  contractItemIconType: TCh5GenericListContractItemIconType;
  /**
  * @documentation
  * [
  * "`contractNumItemsType` attribute",
  * "***",
  * ". Valid values are 'absolute', 'visible' and 'none'. When 'none', contract NumItems join will not change the number of items displayed in the list. When 'absolute', if the value of the NumItems join is X, the items displayed are only those items where Show[0] through Show[X-1] is true. When 'visible', if the value of NumItems is X, the list will display up to X items, even displaying items X and higher if they are visible and lower numbered items are invisible. For example, first 3 item in a list have Show[0] = true, Show[1] = false, and Show[2] = true. If the type is 'absolute' and NumItems = 2, just item 0 is shown. If the type is 'visible' and NumItems = 2, item 0 and item 2 are shown."
  * ]
  * @name contractnumitemstype
  * @default absolute
  * @attributeType "EnumeratedValue"
  */
  contractNumItemsType: TCh5GenericListContractNumItemsType;
  /**
  * @documentation
  * [
  * "`contractScrollToType` attribute",
  * "***",
  * "Valid values are 'absolute' and 'visible'.  See contractNumItemsType for differentiation between 'absolute' and 'visible' enumeration values. "
  * ]
  * @name contractscrolltotype
  * @default absolute
  * @attributeType "EnumeratedValue"
  */
  contractScrollToType: TCh5GenericListContractScrollToType;
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

}
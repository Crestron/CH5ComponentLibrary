import { ICh5CommonAttributesVideoSwitcher } from "../../ch5-common/interfaces/i-ch5-common-attributes-video-switcher";
import { TCh5VideoSwitcherSourceListPosition, TCh5VideoSwitcherScreenAspectRatio, TCh5VideoSwitcherContractSourceLabelType, TCh5VideoSwitcherContractScreenLabelType, } from './t-ch5-video-switcher';

/**
 * @ignore
 */
export interface ICh5VideoSwitcherAttributes extends ICh5CommonAttributesVideoSwitcher {
  /**
  * @documentation
  * [
  * "`sourceListPosition` attribute",
  * "***",
  * "The position of the drag and drop list in relation to the area where the droppable screens are rendered."
  * ]
  * @name sourcelistposition
  * @default top
  * @attributeType "EnumeratedValue"
  */
  sourceListPosition: TCh5VideoSwitcherSourceListPosition;
  /**
  * @documentation
  * [
  * "`endless` attribute",
  * "***",
  * "When endless scrolling is selected the items in the list will loop when the end is reached creating the illusion that there is an 'endless'. Only works when numberOfSourceListDivisions is 1. "
  * ]
  * @name endless
  * @default false
  * @attributeType "Boolean"
  */
  endless: boolean;
  /**
   * @documentation
   * [
   * "`numberOfSourceListDivisions` attribute",
   * "***",
   * "This property determines the number of rows (when the list is at the top or bottom i.e. horizontal) or columns (when the list is on the left or right i.e. vertical) the contents of the list will be divided into user sets a default location attribute. This is an attribute for the sources. "
   * ]
   * @name numberofsourcelistdivisions
   * @default 1
   * @limits [{"min": 1, "max": 10}]
   * @attributeType "Integer"
   */
  numberOfSourceListDivisions: number;
  /**
   * @documentation
   * [
   * "`scrollbar` attribute",
   * "***",
   * "Determines whether or not the scrollbar will be visible on the list. The scrollbar position shall be bottom for horizontal and right for vertical. "
   * ]
   * @name scrollbar
   * @default false
   * @attributeType "Boolean"
   */
  scrollbar: boolean;
  /**
   * @documentation
   * [
   * "`numberOfSources` attribute",
   * "***",
   * "Sets the number of sources on the control (range: 1-256) default 5."
   * ]
   * @name numberofsources
   * @default 5
   * @limits [{"min": 1, "max": 256}]
   * @attributeType "Integer"
   */
  numberOfSources: number;
  /**
   * @documentation
   * [
   * "`numberOfScreenColumns` attribute",
   * "***",
   * "Sets the number of columns in the screen view. Setting to zero disables this feature and returns to standard calculations. *NOTE* A minimum screen size of 80Wx60H will be enforced. Your total number of columns may be limited automatically if the width of the control is exceeded. "
   * ]
   * @name numberofscreencolumns
   * @default 0
   * @limits [{"min": 0, "max": 10}]
   * @attributeType "Integer"
   */
  numberOfScreenColumns: number;
  /**
   * @documentation
   * [
   * "`indexId` attribute",
   * "***",
   * "Provides the name of the offset identifier to be substituted with 0 based index of the item in a list within the template item surrounded by {{ }} delimiters. "
   * ]
   * @name indexid
   * @default 
   * @attributeType "String"
   */
  indexId: string;
  /**
   * @documentation
   * [
   * "`displayScreenLabel` attribute",
   * "***",
   * "Enables or disables the display of all labels on screens. "
   * ]
   * @name displayscreenlabel
   * @default true
   * @attributeType "Boolean"
   */
  displayScreenLabel: boolean;
  /**
   * @documentation
   * [
   * "`screenAspectRatio` attribute",
   * "***",
   * "The aspect ratio of the drag and drop screen area. If this value is set the screens will always maintain the specified aspect ratio. "
   * ]
   * @name screenaspectratio
   * @default stretch
   * @attributeType "EnumeratedValue"
   */
  screenAspectRatio: TCh5VideoSwitcherScreenAspectRatio;
  /**
  * @documentation
  * [
  * "`numberOfScreens` attribute",
  * "***",
  * "Sets the maximum number of screens on the control (range: 1-36). *NOTE* A minimum screen size of 80Wx60H will be enforced. Your total number of screens may be limited automatically if the size of the control is exceeded. "
  * ]
  * @name numberofscreens
  * @default 2
  * @limits [{"min": 1, "max": 36}]
  * @attributeType "Integer"
  */
  numberOfScreens: number;
  /**
   * @documentation
   * [
   * "`sourceIconClass` attribute",
   * "***",
   * "Sets the default icon for each source. The iconClass in the <ch5-video-switcher-source> tag will override this value.  "
   * ]
   * @name sourceiconclass
   * @default fa-solid fa-video
   * @attributeType "String"
   */
  sourceIconClass: string;
  /**
   * @documentation
   * [
   * "`sendEventOnDrop` attribute",
   * "***",
   * "Index sent to the control system for each icon when it is dropped on a screen "
   * ]
   * @name sendeventondrop
   * @join {"direction": "event", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnDrop: string;
  /**
   * @documentation
   * [
   * "`sendEventOnChange` attribute",
   * "***",
   * "Boolean signal (always send true and false) sent to the control system for each icon dropped on the screen. No Repeat digital in this case."
   * ]
   * @name sendeventonchange
   * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
   * @attributeType "Join"
   */
  sendEventOnChange: string;
  /**
   * @documentation
   * [
   * "`receiveStateSourceChanged` attribute",
   * "***",
   * "Index of the screen changed.  "
   * ]
   * @name receivestatesourcechanged
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateSourceChanged: string;
  /**
   * @documentation
   * [
   * "`receiveStateSourceLabel` attribute",
   * "***",
   * "Serial join to apply a label to a source "
   * ]
   * @name receivestatesourcelabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateSourceLabel: string;
  /**
   * @documentation
   * [
   * "`receiveStateScriptSourceLabelHtml` attribute",
   * "***",
   * "Serial string to apply script for evaluation for source inner html label. "
   * ]
   * @name receivestatescriptsourcelabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScriptSourceLabelHtml: string;
  /**
   * @documentation
   * [
   * "`receiveStateScreenLabel` attribute",
   * "***",
   * "Serial join to apply a label to a screen "
   * ]
   * @name receivestatescreenlabel
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScreenLabel: string;
  /**
   * @documentation
   * [
   * "`receiveStateScriptScreenLabelHtml` attribute",
   * "***",
   * "Serial string to apply script for evaluation for screen inner html label."
   * ]
   * @name receivestatescriptscreenlabelhtml
   * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
   * @attributeType "Join"
   */
  receiveStateScriptScreenLabelHtml: string;
  /**
   * @documentation
   * [
   * "`receiveStateNumberOfScreens` attribute",
   * "***",
   * "Analog join to set the number of visible screens. This overrides numberOfScreens. "
   * ]
   * @name receivestatenumberofscreens
   * @join {"direction": "state", "isContractName": true, "numericJoin": 1}
   * @attributeType "Join"
   */
  receiveStateNumberOfScreens: string;
  /**
   * @documentation
   * [
   * "`contractName` attribute",
   * "***",
   * "Name of the contract "
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
   * "default false. When true, contract 'Enable' state determines if the component is enabled. When false, the 'receiveStateEnable' join may be applied. Consistent with other components, if the 'receiveStateEnable' join is provide, the value of that join determines if the component is enabled "
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
   * "default false. When true, contract 'Show' state determines if the component is enabled. When false, the 'receiveStateShow' join may be applied. Consistent with other components, if the 'receiveStateShow' join is provided, the value of that join determines if the component is visible."
   * ]
   * @name usecontractforshow
   * @default false
   * @attributeType "Boolean"
   */
  useContractForShow: boolean;
  /**
   * @documentation
   * [
   * "`contractSourceLabelType` attribute",
   * "***",
   * "default 'none'. When 'none', contract ‘Source_X_Label’, will not change the label of source x. When 'textContent', change in value of contract 'Source_X_Label’, will change the label as if it were text, not HTML markup. When 'innerHTML', change in value of contract ‘Source_X_Label’, will change the label as if it were HTML content"
   * ]
   * @name contractsourcelabeltype
   * @default none
   * @attributeType "EnumeratedValue"
   */
  contractSourceLabelType: TCh5VideoSwitcherContractSourceLabelType;
  /**
  * @documentation
  * [
  * "`contractScreenLabelType` attribute",
  * "***",
  * "default 'none'. When 'none', contract ‘Screen_X_Label’, will not change the label of source x. When 'textContent', change in value of contract 'Screen_X_Label’, will change the label as if it were text, not HTML markup. When 'innerHTML', change in value of contract ‘Screen_X_Label’, will change the label as if it were HTML content "
  * ]
  * @name contractscreenlabeltype
  * @default none
  * @attributeType "EnumeratedValue"
  */
  contractScreenLabelType: TCh5VideoSwitcherContractScreenLabelType;

}
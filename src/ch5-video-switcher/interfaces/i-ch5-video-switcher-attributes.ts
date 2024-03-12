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
   * "The position of the drag and drop list in relation to the area where the droppable screens are rendered. Possible values are top(default), left, right, bottom"
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
   * "When endless scrolling is selected the items in the list will loop when the end is reached creating the illusion  that there is an 'endless'. Only works when numberOfSourceListDivisions is 1. Default value is false."
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
   * "This property determines the number of rows (when the list is at the top or bottom i.e. horizontal) or columns (when the list is on the left or right i.e. vertical) the contents of the list will be divided into user sets a default location attribute. This is an attribute for the sources. Default value is 1, Minimum value is 1 and Maximum value is 10."
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
   * "Determines whether or not the scrollbar will be visible on the list. The scrollbar position shall be bottom for horizontal and right for vertical. Default value is false."
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
   * "Sets the number of sources on the control. Default value is 5, Minimum value is 1 and Maximum value is 256."
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
   * "Sets the number of columns in the screen view. Setting to zero disables this feature and returns to standard calculations. Note: A minimum screen size of 80Wx60H will be enforced. Your total number of columns may be limited automatically if the width of the control is exceeded. Default value is 0, Minimum value is 0 and Maximum value is 10."
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
   * "Provides the name of the offset identifier to be substituted with 0 based index of the item in a list within the template item surrounded by {{ }} delimiters."
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
   * "Enables or disables the display of all labels on screens. Default value is true."
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
   * "The aspect ratio of the drag and drop screen area. If this value is set the screens will always maintain the specified aspect ratio. Possible value are stretch(default), 16:9, 4:3."
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
   * "Sets the maximum number of screens on the control. Note: A minimum screen size of 80Wx60H will be enforced. Your total number of screens may be limited automatically if the size of the control is exceeded. Default value is 2, Minimum value is 1 and Maximum value is 36."
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
   * "Sets the default icon for each source. The iconClass in the ch5-video-switcher-source tag will override this value. Default value is fa-solid fa-video"
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
   * "Index sent to the control system for each icon when it is dropped on a screen."
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
   * "Boolean signal sent to the control system for each source dropped on the screen. No Repeat digital in this case."
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
   * "Index of the screen changed."
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
   * "After receiving value from control system, this value is applied to the label attribute of all the sources in the list."
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
   * "Allows the signal script evaluation to be applied to the source label. Allows for multiline, multiStyled labels."
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
   * "After receiving value from control system, this value is applied to the label attribute of all the screens."
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
   * "Allows the signal script evaluation to be applied to the screen label. Allows for multiline, multiStyled screen labels."
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
   * "Value received from the receiveStateNumberOfScreens Join will be set to the numberOfScreens attribute."
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
   * "ContractName attribute sets the name of the contract."
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
   * "Default value is false. When true, contract 'Enable' state determines if the component is enabled. When false, the 'receiveStateEnable' join may be applied. Consistent with other components, if the 'receiveStateEnable' join is provided, the value of that join determines if the component is enabled "
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
   * "Default value is false. When true, contract 'Show' state determines if the component is enabled. When false, the 'receiveStateShow' join may be applied. Consistent with other components, if the 'receiveStateShow' join is provided, the value of that join determines if the component is visible."
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
   * "Default value is 'none'. When 'none', contract ‘Source_X_Label’, will not change the label of source x. When 'textContent', change in value of contract 'Source_X_Label’, will change the label as if it were text, not HTML markup. When 'innerHTML', change in value of contract ‘Source_X_Label’, will change the label as if it were HTML content"
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
   * "Default value is 'none'. When 'none', contract ‘Screen_X_Label’, will not change the label of source x. When 'textContent', change in value of contract 'Screen_X_Label’, will change the label as if it were text, not HTML markup. When 'innerHTML', change in value of contract ‘Screen_X_Label’, will change the label as if it were HTML content "
   * ]
   * @name contractscreenlabeltype
   * @default none
   * @attributeType "EnumeratedValue"
   */
  contractScreenLabelType: TCh5VideoSwitcherContractScreenLabelType;
}
import { ICh5CommonForClass } from "../../ch5-common/interfaces/common/i-ch5-common-class";
import { ICh5CommonForDebug } from "../../ch5-common/interfaces/common/i-ch5-common-debug";
import { ICh5CommonForDisabled } from "../../ch5-common/interfaces/common/i-ch5-common-disabled";
import { ICh5CommonForRole } from "../../ch5-common/interfaces/common/i-ch5-common-role";
import { ICh5CommonForStyle } from "../../ch5-common/interfaces/common/i-ch5-common-style";
import { ICh5WidgetListAttributes } from "./i-ch5-widget-list-attributes";

/**
 * @name Ch5 Subpage Reference List
 * @isattribute false
 * @tagName ch5-widget-list
 * @role widget-list
 * @description The Subpage Reference List allows multiple instances of a given widget to be displayed and managed in a list.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-widget-list` element",
 *   "***",
 *   "The Subpage Reference List is a component that has a collection of widgets that can be used in a CH5 project."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-widget-list:blank",
 *     "description": "Crestron subpage reference list",
 *     "body": [
 *       "<ch5-widget-list>",
 *       "</ch5-widget-list>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-widget-list:default",
 *     "description": "Crestron subpage reference list (default)",
 *     "body": [
 *       "<ch5-widget-list id=\"ch5-widget-list_${1:id}\"",
 *       "\twidgetId=\"${2:}\"",
 *       "\torientation=\"${3:horizontal}\"",
 *       "\tscrollbar=\"${4:false}\"",
 *       "\tcenterItems=\"${5:false}\"",
 *       "\tendless=\"${6:false}\"",
 *       "\tnumberOfItems=\"${7:10}\"",
 *       "\trows=\"${8:1}\"",
 *       "\tcolumns=\"${9:1}\"",
 *       "\tindexId=\"${10:}\"",
 *       "\tloadItems=\"${11:visible-only}\"",
 *       "\tscrollToPosition=\"${12:0}\">",
 *       "</ch5-widget-list>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-widget-list:all-attributes",
 *     "description": "Crestron subpage reference list (All Attributes)",
 *     "body": [
 *       "<ch5-widget-list id=\"ch5-widget-list_${1:id}\"",
 *       "\torientation=\"${2|horizontal,vertical|}\"",
 *       "\tcontractName=\"${3:}\"",
 *       "\tendless=\"${4:false}\"",
 *       "\tcenterItems=\"${5:false}\"",
 *       "\trows=\"${6:1}\"",
 *       "\tcolumns=\"${7:1}\"",
 *       "\tscrollbar=\"${8:false}\"",
 *       "\tbooleanJoinIncrement=\"${9:}\"",
 *       "\tnumericJoinIncrement=\"${10:}\"",
 *       "\tstringJoinIncrement=\"${11:}\"",
 *       "\tsubpageReceiveStateEnable=\"${12:}\"",
 *       "\tsubpageReceiveStateShow=\"${13:}\"",
 *       "\twidgetId=\"${14:}\"",
 *       "\tsubpageReceiveStateScrollTo=\"${15:}\"",
 *       "\tnumberOfItems=\"${16:10}\"",
 *       "\treceiveStateNumberOfItems=\"${17:}\"",
 *       "\tscrollToPosition=\"${18:}\"",
 *       "\tuseContractForEnable=\"${19:false}\"",
 *       "\tuseContractForShow=\"${20:false}\"",
 *       "\tuseContractForItemEnable=\"${21:false}\"",
 *       "\tuseContractForItemShow=\"${22:false}\"",
 *       "\tuseContractForCustomStyle=\"${23:false}\"",
 *       "\tuseContractForCustomClass=\"${24:false}\"",
 *       "\tuseContractForNumItems=\"${25:false}\"",
 *       "\tloadItems=\"${26:visible-only}\"",
 *       "\tindexId=\"${27:}\">",
 *       "</ch5-widget-list>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-widget-list:contractbased",
 *      "description": "Crestron Subpage Reference List",
 *      "body": [
 *        "<ch5-widget-list id=\"ch5-widget-list_${1:id}\"",
 *        "\tcontractName=\"${2:}\">",
 *        "</ch5-widget-list>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-widget-list:contractbased-attributes",
 *      "description": "Crestron Button List",
 *      "body": [
 *        "<ch5-widget-list id=\"ch5-widget-list_${1:id}\"",
 *        "\tcontractName=\"${2:}\"",
 *        "\tuseContractForEnable=\"${3:false}\"",
 *        "\tuseContractForShow=\"${4:false}\"",
 *        "\tuseContractForItemEnable=\"${5:false}\"",
 *        "\tuseContractForItemShow=\"${6:false}\"",
 *        "\tuseContractForCustomStyle=\"${7:false}\"",
 *        "\tuseContractForCustomClass=\"${8:false}\"",
 *        "\tuseContractForNumItems=\"${9:false}\">",
 *        "</ch5-widget-list>$0"
 *        ]
 *    }
 *  ]
 */
export interface ICh5WidgetListDocumentation extends ICh5CommonForDisabled, ICh5CommonForDebug, ICh5CommonForRole, ICh5CommonForStyle, ICh5CommonForClass, ICh5WidgetListAttributes {

}
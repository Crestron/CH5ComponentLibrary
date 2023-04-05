import { ICh5SubpageReferenceListCommonDocumentation } from "../../ch5-common/interfaces/i-ch5-subpage-reference-list-documentation";
import { ICh5SubpageReferenceListAttributes } from "./i-ch5-subpage-reference-list-attributes";

/**
 * @name Ch5 Subpage Reference List
 * @isattribute false
 * @tagName ch5-subpage-reference-list
 * @role subpage-reference-list
 * @description The Subpage Reference List allows multiple instances of a given subpage to be displayed and managed in a list.
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-subpage-reference-list` element",
 *   "***",
 *   "The Subpage Reference List allows multiple instances of a given subpage to be displayed and managed in a list."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-subpage-reference-list:blank",
 *     "description": "Crestron subpage reference list",
 *     "body": [
 *       "<ch5-subpage-reference-list>",
 *       "</ch5-subpage-reference-list>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-subpage-reference-list:default",
 *     "description": "Crestron subpage reference list (default)",
 *     "body": [
 *       "<ch5-subpage-reference-list id=\"ch5-subpage-reference-list_${1:id}\"",
 *       "\twidgetId=\"${2:}\"",
 *       "\torientation=\"${3:horizontal}\"",
 *       "\tscrollbar=\"${4:false}\"",
 *       "\tcenterItems=\"${5:false}\"",
 *       "\tendless=\"${6:false}\"",
 *       "\tnumberOfItems=\"${7:10}\"",
 *       "\trows=\"${8:1}\"",
 *       "\tcolumns=\"${9:1}\"",
 *       "\tindexId=\"${10:}\"",
 *       "\tscrollToPosition=\"${11:0}\">",
 *       "</ch5-subpage-reference-list>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-subpage-reference-list:all-attributes",
 *     "description": "Crestron subpage reference list (All Attributes)",
 *     "body": [
 *       "<ch5-subpage-reference-list id=\"ch5-subpage-reference-list_${1:id}\"",
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
 *       "\tindexId=\"${26:}\">",
 *       "</ch5-subpage-reference-list>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-subpage-reference-list:contractbased",
 *      "description": "Crestron Subpage Reference List",
 *      "body": [
 *        "<ch5-subpage-reference-list id=\"ch5-subpage-reference-list_${1:id}\"",
 *        "\tcontractName=\"${2:}\">",
 *        "</ch5-subpage-reference-list>$0"
 *        ]
 *    },
 *    {
 *      "prefix": "ch5-subpage-reference-list:contractbased-attributes",
 *      "description": "Crestron Button List",
 *      "body": [
 *        "<ch5-subpage-reference-list id=\"ch5-subpage-reference-list_${1:id}\"",
 *        "\tcontractName=\"${2:}\"",
 *        "\tuseContractForEnable=\"${3:false}\"",
 *        "\tuseContractForShow=\"${4:false}\"",
 *        "\tuseContractForItemEnable=\"${5:false}\"",
 *        "\tuseContractForItemShow=\"${6:false}\"",
 *        "\tuseContractForCustomStyle=\"${7:false}\"",
 *        "\tuseContractForCustomClass=\"${8:false}\"",
 *        "\tuseContractForNumItems=\"${9:false}\">",
 *        "</ch5-subpage-reference-list>$0"
 *        ]
 *    }
 *  ]
 */
export interface ICh5SubpageReferenceListDocumentation extends ICh5SubpageReferenceListCommonDocumentation, ICh5SubpageReferenceListAttributes {

}
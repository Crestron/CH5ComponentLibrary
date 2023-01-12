import { ICh5Common } from "../../_interfaces";
import { ICh5SubpageReferenceListAttributes } from "./i-ch5-subpage-reference-list-attributes";

/**
 * @name Ch5 Subpage Reference List
 * @isattribute false
 * @tagName ch5-subpage-reference-list
 * @role 
 * @description of the component.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-subpage-reference-list` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
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
 *     "prefix": "ch5-subpage-reference-list:all-attributes",
 *     "description": "Crestron subpage reference list (All Attributes)",
 *     "body": [
 *       "<ch5-subpage-reference-list id=\"ch5-subpage-reference-list_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tcontrolJoinID=\"${3:}\"",
 *       "\tendless=\"${4:}\"",
 *       "\tcenterItems=\"${5:}\"",
 *       "\trows=\"${6:1}\"",
 *       "\tcolumn=\"${7:1}\"",
 *       "\tscrollBar=\"${8:}\"",
 *       "\tbooleanJoinOffset=\"${9:}\"",
 *       "\tnumericJoinOffset=\"${10:}\"",
 *       "\tstringJoinOffset=\"${11:}\"",
 *       "\tsubpageReceiveStateEnable=\"${12:}\"",
 *       "\tsubpageReceiveStateVisible=\"${13:}\"",
 *       "\tsubpage=\"${14:}\"",
 *       "\tsubpageReceiveStateScrollTo=\"${15:}\"",
 *       "\tstretch=\"${16:}\"",
 *       "\tnumberOfItems=\"${17:10}\"",
 *       "\treceiveStateNumberOfItems=\"${18:}\"",
 *       "\tindexId=\"${19:}\">",
 *       "</ch5-subpage-reference-list>$0"
 *       ]
 *    }
      // TODO: DEV:CHANGES
 *  ]
 */
export interface ICh5SubpageReferenceListDocumentation extends ICh5Common, ICh5SubpageReferenceListAttributes {

}
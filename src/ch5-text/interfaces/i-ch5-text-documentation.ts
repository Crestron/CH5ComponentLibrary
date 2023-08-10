import { ICh5Common } from "../../_interfaces";
import { ICh5TextAttributes } from "./i-ch5-text-attributes";

/**
 * @name Ch5 Text
 * @isattribute false
 * @tagName ch5-text
 * @role label
 * @description The Formatted Text control is used to display advanced text on a touch panel.  It supports HTML text via an Indirect Text Serial Join as well as static text defined at design time. Additionally, it can be used as multiline and/or truncated text, and supports all of the CIP tags documented in the CIP HTML tag document..
 * @componentVersion 2.5.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-text` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-text:blank",
 *     "description": "Crestron text",
 *     "body": [
 *       "<ch5-text>",
 *       "</ch5-text>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-text:all-attributes",
 *     "description": "Crestron text (All Attributes)",
 *     "body": [
 *       "<ch5-text id=\"ch5-text_${1:id}\"",
 *       "\thorizontalAlignment=\"${2:center}\"",
        *       "\tmultilineSupport=\"${3:false}\"",
        *       "\ttruncateText=\"${4:false}\"",
        *       "\tlabel=\"${5:}\"",
        *       "\treceiveStateLabel=\"${6:}\"",
        *       "\tlabelInnerHtml=\"${7:}\"",
        *       "\ttextStyle=\"${8:}\">",
 *       "</ch5-text>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-text:default",
 *     "description": "Crestron text (default)",
 *     "body": [
 *       "<ch5-text id=\"ch5-text_${1:id}\"",
 *       "\thorizontalAlignment=\"${2:center}\"",
          *       "\tmultilineSupport=\"${3:false}\"",
          *       "\ttruncateText=\"${4:false}\"",
          *       "\tlabel=\"${5:}\"",
          *       "\tlabelInnerHtml=\"${7:}\"",
          *       "\ttextStyle=\"${8:}\">",
 *       "</ch5-text>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5TextDocumentation extends ICh5Common, ICh5TextAttributes {

}
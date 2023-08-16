import { ICh5CommonText } from "../../ch5-common/interfaces/i-ch5-common-documentation-text";
import { ICh5TextAttributes } from "./i-ch5-text-attributes";

/**
 * @name Ch5 Text
 * @isattribute false
 * @tagName ch5-text
 * @role label
 * @description The Formatted Text control is used to display advanced text on a touch panel.
 * @componentVersion 2.5.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-text` element",
 *   "***",
 *   "The Formatted Text control is used to display advanced text on a touch panel. It supports HTML text via Serial Join as well as static text. Additionally, it can be used as multiline and/or truncated text."
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
 *       "\tverticalAlignment=\"${3:middle}\"",
 *       "\tmultilineSupport=\"${4:false}\"",
 *       "\ttruncateText=\"${5:false}\"",
 *       "\tlabel=\"${6:}\"",
 *       "\treceiveStateLabel=\"${7:}\">",
 *       "</ch5-text>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-text:default",
 *     "description": "Crestron text (default)",
 *     "body": [
 *       "<ch5-text id=\"ch5-text_${1:id}\"",
 *       "\thorizontalAlignment=\"${2:center}\"",
 *       "\tverticalAlignment=\"${3:middle}\"",
 *       "\tmultilineSupport=\"${4:false}\"",
 *       "\ttruncateText=\"${5:false}\"",
 *       "\tlabel=\"${6:}\">",
 *       "</ch5-text>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5TextDocumentation extends ICh5CommonText, ICh5TextAttributes {}

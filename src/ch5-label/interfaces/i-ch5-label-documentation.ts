import { ICh5Common } from "../../_interfaces";
import { ICh5LabelAttributes } from "./i-ch5-label-attributes";

/**
 * @name Ch5 Label
 * @isattribute false
 * @tagName ch5-label
 * @role 
 * @description This label component is used as a child component to extend the label values.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-label` element",
 *   "***",
 *   "This component consists of labelm labelInnerHtml, and receiveStateLabel."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-label:blank",
 *     "description": "Crestron label",
 *     "body": [
 *       "<ch5-label>",
 *       "</ch5-label>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-label:all-attributes",
 *     "description": "Crestron label (All Attributes)",
 *     "body": [
 *       "<ch5-label id=\"ch5-label_${1:id}\"",
 *       "\tlabel=\"${2:}\"",
        *       "\treceiveStateLabel=\"${3:}\">",
 *       "</ch5-label>$0"
 *       ]
 *    }
      // TODO: DEV:CHANGES
 *  ]
 */
export interface ICh5LabelDocumentation extends ICh5Common, ICh5LabelAttributes {

}
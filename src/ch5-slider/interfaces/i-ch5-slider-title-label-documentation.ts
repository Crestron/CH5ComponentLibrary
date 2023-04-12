import { ICh5Common } from "../../_interfaces";
import { ICh5SliderTitleLabelAttributes } from "./i-ch5-slider-title-label-attributes";

/**
 * @name Ch5 slidre-title-Label
 * @isattribute false
 * @tagName ch5-slider-title-label
 * @role 
 * @description of the component.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-slider-title-label` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
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
export interface ICh5LabelDocumentation extends ICh5Common, ICh5SliderTitleLabelAttributes {

}
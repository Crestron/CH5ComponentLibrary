import { ICh5Common } from "../../_interfaces";
import { ICh5SliderButtonAttributes } from "./i-ch5-slider-button-attributes";

/**
 * @name Ch5 Slider Button
 * @isattribute false
 * @tagName ch5-slider-button
 * @role 
 * @description of the component.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-slider-button` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-slider-button:blank",
 *     "description": "Crestron slider button",
 *     "body": [
 *       "<ch5-slider-button>",
 *       "</ch5-slider-button>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-slider-button:all-attributes",
 *     "description": "Crestron slider button (All Attributes)",
 *     "body": [
 *       "<ch5-slider-button id=\"ch5-slider-button_${1:id}\"",
 *       "\tkey=\"${2:on}\">",
 *       "</ch5-slider-button>$0"
 *       ]
 *    }
      // TODO: DEV:CHANGES
 *  ]
 */
export interface ICh5SliderButtonDocumentation extends ICh5Common, ICh5SliderButtonAttributes {

}
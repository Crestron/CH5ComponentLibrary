import { ICh5Common } from "../../_interfaces";
import { ICh5SampleAttributes } from "./i-ch5-sample-attributes";

/**
 * @name Ch5 Sample
 * @isattribute false
 * @tagName ch5-sample
 * @role 
 * @description of the component.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-sample` element",
 *   "***",
 *   "Component description"
      // TODO: DEV:CHANGES
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-sample:blank",
 *     "description": "Crestron sample",
 *     "body": [
 *       "<ch5-sample>",
 *       "</ch5-sample>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-sample:all-attributes",
 *     "description": "Crestron sample (All Attributes)",
 *     "body": [
 *       "<ch5-sample id=\"ch5-sample_${1:id}\"",
 *       "\taspectRatio=\"${2:16:9}\"",
        *       "\tindexId=\"${3:}\"",
        *       "\turl=\"${4:}\"",
        *       "\tuserid=\"${5:}\"",
        *       "\tpassword=\"${6:}\">",
 *       "</ch5-sample>$0"
 *       ]
 *    }
      // TODO: DEV:CHANGES
 *  ]
 */
export interface ICh5SampleDocumentation extends ICh5Common, ICh5SampleAttributes {

}
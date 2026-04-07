import { ICh5CommonHtmlDiv } from "../../ch5-common/interfaces/i-ch5-common-documentation-html-div";
import { ICh5HtmlDivAttributes } from "./i-ch5-html-div-attributes";

/**
 * @name Ch5 Html Div
 * @isattribute false
 * @tagName ch5-html-div
 * @role html-div
 * @description CH5 HTML Div component.
 * @componentVersion 1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-html-div` element",
 *   "***",
 *   "CH5 HTML Div component"
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-html-div:blank",
 *     "description": "Crestron html div",
 *     "body": [
 *       "<ch5-html-div>",
 *       "</ch5-html-div>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-html-div:all-attributes",
 *     "description": "Crestron html div (All Attributes)",
 *     "body": [
 *       "<ch5-html-div id=\"ch5-html-div_${1:id}\"",
 *       "\tlabel=\"${2:}\"",
 *       "\tlabelInnerHTML=\"${3:}\">",
 *       "</ch5-html-div>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-html-div:default",
 *     "description": "Crestron html div (default)",
 *     "body": [
 *       "<ch5-html-div id=\"ch5-html-div_${1:id}\"",
 *       "\tlabel=\"${2:}\"",
 *       "\tlabelInnerHTML=\"${3:}\">",
 *       "</ch5-html-div>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5HtmlDivDocumentation extends ICh5CommonHtmlDiv, ICh5HtmlDivAttributes {

}
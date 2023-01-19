import { ICh5TabButtonIndividualButtonAttributes } from "./i-ch5-tab-button-individual-button-attributes";

/**
 * @name Ch5 Tab Button Individual Button
 * @isattribute false
 * @tagName ch5-tab-button-individual-button
 * @role template
 * @description Ch5 Tab Button Individual Button tag to provide ability to enter individual button labels and individual icons for each button in the tab button 
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-tab-button-individual-button` element",
 *   "***",
 *   "Ch5 tab button Individual Button tag to provide ability to enter individual button labels and individual icons for each button in the tab button."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-tab-button-individual-button:blank",
 *     "description": "Crestron tab button individual button",
 *     "body": [
 *       "<ch5-tab-button-individual-button>",
 *       "</ch5-tab-button-individual-button>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-tab-button-individual-button:default",
 *     "description": "Crestron tab button individual button (default)",
 *     "body": [
 *       "<ch5-tab-button-individual-button id=\"ch5-tab-button-individual-button_${1:id}\"",
 *       "\ticonUrl=\"${2:}\"",
 *       "\tonRelease=\"${3:}\"",
 *       "\ticonClass=\"${4:}\">",
 *       "</ch5-tab-button-individual-button>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-tab-button-individual-button:all-attributes",
 *     "description": "Crestron tab button individual button (All Attributes)",
 *     "body": [
 *       "<ch5-tab-button-individual-button id=\"ch5-tab-button-individual-button_${1:id}\"",
 *       "\tlabelInnerHtml=\"${2:}\"",
 *       "\ticonUrl=\"${3:}\"",
 *       "\tonRelease=\"${4:}\"",
 *       "\ticonClass=\"${5:}\">",
 *       "</ch5-tab-button-individual-button>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5TabButtonIndividualButtonDocumentation extends ICh5TabButtonIndividualButtonAttributes {

}
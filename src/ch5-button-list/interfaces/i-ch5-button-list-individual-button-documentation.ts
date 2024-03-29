import { ICh5ButtonListIndividualButtonAttributes } from "./i-ch5-button-list-individual-button-attributes";

/**
 * @name Ch5 Button List Individual Button
 * @isattribute false
 * @tagName ch5-button-list-individual-button
 * @role template
 * @description A child element designed to handle individual buttons for Ch5 Button list component
 * @componentVersion 2.3.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-button-list-individual-button` element",
 *   "***",
 *   "Ch5 Button List Individual Button tag to provide ability to enter individual button labels and individual icons for each button in the list."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-list-individual-button:blank",
 *     "description": "Crestron button list individual button",
 *     "body": [
 *       "<ch5-button-list-individual-button>",
 *       "</ch5-button-list-individual-button>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-button-list-individual-button:default",
 *     "description": "Crestron button list individual button (default)",
 *     "body": [
 *       "<ch5-button-list-individual-button id=\"ch5-button-list-individual-button_${1:id}\"",
 *       "\ticonUrl=\"${2:}\"",
 *       "\tonRelease=\"${3:}\"",
 *       "\ticonClass=\"${4:}\">",
 *       "</ch5-button-list-individual-button>$0"
 *       ]
 *    },
 *   {
 *     "prefix": "ch5-button-list-individual-button:all-attributes",
 *     "description": "Crestron button list individual button (All Attributes)",
 *     "body": [
 *       "<ch5-button-list-individual-button id=\"ch5-button-list-individual-button_${1:id}\"",
 *       "\tlabelInnerHTML=\"${2:}\"",
 *       "\ticonUrl=\"${3:}\"",
 *       "\tonRelease=\"${4:}\"",
 *       "\ticonClass=\"${5:}\">",
 *       "</ch5-button-list-individual-button>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ButtonListIndividualButtonDocumentation extends ICh5ButtonListIndividualButtonAttributes {

}
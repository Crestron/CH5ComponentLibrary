import { ICh5CommonToggle } from "../../ch5-common/interfaces/i-ch5-common-documentation-toggle";
import { ICh5ToggleAttributes } from "./i-ch5-toggle-attributes";

/**
 * @name Ch5 Toggle
 * @isattribute false
 * @tagName ch5-toggle
 * @role switch
 * @description Ch5 Toggle represents an input with two states behaving like a switch.
 * @componentVersion 2.7.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-toggle` element",
 *   "***",
 *   "Appears as a two-state switch with easy transition between states. The component has the,functionality of an HTML checkbox-type input element."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-toggle:blank",
 *     "description": "Crestron toggle",
 *     "body": [
 *       "<ch5-toggle>",
 *       "</ch5-toggle>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-toggle:all-attributes",
 *     "description": "Crestron toggle (All Attributes)",
 *     "body": [
 *       "<ch5-toggle id=\"ch5-toggle_${1:id}\"",
 *       "\thandleShape=\"${2:circle}\"",
          *       "\tlabel=\"${3:}\"",
          *       "\tlabelOn=\"${4:}\"",
          *       "\tlabelOff=\"${5:}\"",
          *       "\ticonOn=\"${6:}\"",
          *       "\ticonOff=\"${7:}\"",
          *       "\torientation=\"${8:horizontal}\"",
          *       "\tvalue=\"${9:false}\"",
          *       "\treceiveStateValue=\"${10:}\"",
          *       "\treceiveStateScriptLabelHTML=\"${11:}\"",
          *       "\tsendEventOnClick=\"${12:}\">",
 *       "</ch5-toggle>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-toggle:default",
 *     "description": "Crestron toggle (default)",
 *     "body": [
 *       "<ch5-toggle id=\"ch5-toggle_${1:id}\"",
 *       "\thandleShape=\"${2:circle}\"",
            *       "\tlabel=\"${3:}\"",
            *       "\tlabelOn=\"${4:}\"",
            *       "\tlabelOff=\"${5:}\"",
            *       "\ticonOn=\"${6:}\"",
            *       "\ticonOff=\"${7:}\"",
            *       "\torientation=\"${8:horizontal}\"",
            *       "\tvalue=\"${9:false}\"",
            
 *       "</ch5-toggle>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ToggleDocumentation extends ICh5CommonToggle, ICh5ToggleAttributes {

}
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
 *       "\tsize=\"${10:regular}\"",
 *       "\treceiveStateValue=\"${11:}\"",
 *       "\treceiveStateScriptLabelHTML=\"${12:}\"",
 *       "\tsendEventOnClick=\"${13:}\"",
 *       "\tsendEventOnTouch=\"${14:}\">",
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
 *       "\tsize=\"${9:regular}\"",
 *       "\tvalue=\"${10:false}\">",
 *       "</ch5-toggle>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-toggle:label-on-off",
 *      "description": "Crestron Toggle (Default)",
 *       "body": [
 *         "<ch5-toggle label=\"${1:Alarm}\"",
 *        "\tvalue=\"${2:false}\"",
 *         "\tlabelOn=\"${3:On}\"",
 *         "\tlabelOff=\"${4:Off}\"",
 *         "\tsendeventOnClick=\"${5:send_switch_value}\"",
 *         "\treceiveStateValue=\"${5:receive_switch_value}\">",
 *         "</ch5-toggle>$0"
 *       ]
 *    },
 *    {
 *       "prefix": "ch5-toggle:icon-on-off",
 *       "description": "Crestron Toggle (Default)",
 *       "body": [
 *         "<ch5-toggle label=\"${1:Alarm}\"",
 *         "\tvalue=\"${2:false}\"",
 *         "\ticonOn=\"${3:fas fa-bell}\"",
 *         "\ticonOff=\"${4:fas fa-bell-slash}\"",
 *         "\tsendeventOnClick=\"${5:send_switch_value}\"",
 *         "\treceiveStateValue=\"${5:receive_switch_value}\">",
 *         "</ch5-toggle>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ToggleDocumentation extends ICh5CommonToggle, ICh5ToggleAttributes {

}
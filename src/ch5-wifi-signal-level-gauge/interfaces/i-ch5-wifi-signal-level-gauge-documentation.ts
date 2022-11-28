import { ICh5Common3 } from "../../ch5-common/interfaces/i-ch5-common-set3";
import { ICh5WifiSignalLevelGaugeAttributes } from "./i-ch5-wifi-signal-level-gauge-attributes";

/**
 * @name Ch5 Wifi Signal Level Gauge
 * @isattribute false
 * @tagName ch5-wifi-signal-level-gauge
 * @role wifi-signal-level-gauge
 * @description The Wifi Signal Level Gauge control is used to display a signal strength from an analog join.
 * @componentVersion 2.2.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-wifi-signal-level-gauge` element",
 *   "***",
 *   "The Wifi Signal Level Gauge control is used to display a signal strength from an analog join."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-wifi-signal-level-gauge:blank",
 *     "description": "Crestron wifi signal level gauge",
 *     "body": [
 *       "<ch5-wifi-signal-level-gauge>",
 *       "</ch5-wifi-signal-level-gauge>$0"
 *     ]
 *   },
 *   {
 *    "prefix": "ch5-wifi-signal-level-gauge:default",
 *    "description": "Crestron wifi signal level gauge",
 *    "body": [
 *       "<ch5-wifi-signal-level-gauge gaugeStyle=\"${1:1}\"",
 *       "\treceiveStateValue=\"${2}\">",
 *       "</ch5-signal-level-gauge>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-wifi-signal-level-gauge:all-attributes",
 *     "description": "Crestron wifi signal level gauge (All Attributes)",
 *     "body": [
 *       "<ch5-wifi-signal-level-gauge
 *       "\treceiveStateValue=\"${2:}\"",
 *       "\tgaugeStyle=\"${3:|light,accents,dark|}\"",
 *       "\talignment=\"${4:|up,down,left,right|}\"",
 *       "\tminValue=\"${5:}\"",
 *       "\tmaxValue=\"${6:100}\"",
 *       "\tsize=\"${7|regular,small,X-large,large|}\">",
 *      "</ch5-wifi-signal-level-gauge>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5WifiSignalLevelGaugeDocumentation extends ICh5Common3, ICh5WifiSignalLevelGaugeAttributes {

}
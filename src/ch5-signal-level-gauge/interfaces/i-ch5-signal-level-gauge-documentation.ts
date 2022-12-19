import { ICh5Common3 } from "../../ch5-common/interfaces/i-ch5-common-set3";
import { ICh5SignalLevelGaugeAttributes } from "./i-ch5-signal-level-gauge-attributes";

/**
 * @name Ch5 Signal Level Gauge
 * @isattribute false
 * @tagName ch5-signal-level-gauge
 * @role signal-level-gauge
 * @description The Signal Level Gauge displays feedback from an Analog Join.
 * @componentVersion 2.1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-signal-level-gauge` element",
 *   "***",
 *   "The Signal Level Gauge displays feedback from an Analog Join."
 * ]
 * @snippets
 * [ 
 *  {
 *    "prefix": "ch5-signal-level-gauge:blank",
 *    "description": "Crestron SignalLevelGauge",
 *    "body": [
 *      "<ch5-signal-level-gauge>",
 *      "</ch5-signal-level-gauge>$0"
 *    ]
 *   },
 *   {
 *    "prefix": "ch5-signal-level-gauge:default",
 *    "description": "Crestron SignalLevelGauge",
 *    "body": [
 *       "<ch5-signal-level-gauge signalBarSpacing=\"${1:1}\"",
 *       "\tvalue=\"${2:0}\"",
 *       "\treceiveStateValue=\"${3}\">",
 *       "</ch5-signal-level-gauge>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-signal-level-gauge:all-attributes",
 *     "description": "Crestron SignalLevelGauge (All Attributes)",
 *     "body": [
 *       "<ch5-signal-level-gauge orientation=\"${1|horizontal,vertical|}\"",
 *       "\treceiveStateValue=\"${2}\"",
 *       "\tsignalBarSpacing=\"${3:1}\"",
 *       "\tminValue=\"${4:0}\"",
 *       "\tmaxValue=\"${5:65535}\"",
 *       "\tnumberOfBars=\"${6:6}\"",
 *       "\tvalue=\"${7:0}\"",
 *       "\tsize=\"${8|regular,small,large,x-large|}\">",
 *       "</ch5-signal-level-gauge>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5SignalLevelGaugeDocumentation extends ICh5Common3, ICh5SignalLevelGaugeAttributes {

}

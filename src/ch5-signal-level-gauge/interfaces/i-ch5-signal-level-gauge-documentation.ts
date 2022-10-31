import { ICh5Common3 } from "../../ch5-common/interfaces/i-ch5-common-set3";
import { ICh5SignalLevelGaugeAttributes } from "./i-ch5-signal-level-gauge-attributes";

/**
 * @name ch5 signal-level-gauge
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
 * {
 *    "prefix": "ch5-signal-level-gauge:default",
 *    "description": "Crestron SignalLevelGauge",
 *    "body": [
 *       "<ch5-signal-level-gauge signalBarSpacing=\"${1:1}\"",
 *       "\treceivestatevalue=\"${2}\">",
 *       "</ch5-signal-level-gauge>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-signal-level-gauge:all-attributes",
 *     "description": "Crestron SignalLevelGauge (All Attributes)",
 *     "body": [
 *       "<ch5-signal-level-gauge orientation=\"${1|horizontal,vertical|}\"",
 *       "\treceivestatevalue=\"${2}\"",
 *       "\tsignalBarSpacing=\"${3:1}\"",
 *       "\tminValue=\"${4:0}\"",
 *       "\tmaxValue=\"${5:65535}\"",
 *       "\tnumberOfBars=\"${6:6}\"",
 *       "\tsize=\"${7|regular,small,X-large,large|}\">",
 *       "</ch5-signal-level-gauge>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5SignalLevelGaugeDocumentation extends ICh5Common3, ICh5SignalLevelGaugeAttributes {

}
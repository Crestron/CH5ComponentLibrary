import { ICh5Common } from "../../_interfaces";
import { ICh5SignalLevelGaugeAttributes } from "./i-ch5-signal-level-gauge-attributes";

/**
 * @name ch5 signal-level-gauge
 * @isattribute false
 * @tagName ch5-signal-level-gauge
 * @role signal-level-gauge
 * @description The Signal Level Gauge displays feedback from an Analog Join.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   {
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
 *       "<ch5-signal-level-gauge orientation=\"${1:|horizontal,vertical|}\"",
 *       "\treceivestatevalue=\"${2}\"",
 *       "\tsignalBarSpacing=\"${3:1}\"",
 *       "\tminValue=\"${4:0}\"",
 *       "\tmaxValue=\"${5:65535}\"",
 *       "\tnoOfBars=\"${6:6}\"",
 *       "\tsize=\"${7:|regular,small,X-large,large|}\">",
 *       "</ch5-color-chip>$0"
 *       ]
 *    }
 *  ]
 * @snippets
 * [
 *  
 *  ]
 */
export interface ICh5SignalLevelGaugeDocumentation extends ICh5Common, ICh5SignalLevelGaugeAttributes {

}
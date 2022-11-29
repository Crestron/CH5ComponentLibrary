import { ICh5Common } from "../../_interfaces";
import { ICh5SegmentedGaugeAttributes } from "./i-ch5-segmented-gauge-attributes";

/**
 * @name Ch5 Segmented Gauge
 * @isattribute false
 * @tagName ch5-segmented-gauge
 * @role segmented-gauge
 * @description The Segmented Gauge is used to display feedback from an analog join by scaling the analog value on the touch panel instead of via programming on the control system.
 * @componentVersion 2.2.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-segmented-gauge` element",
 *   "***",
 *   "The Segmented Gauge is used to display feedback from an analog join by scaling the analog value on the touch panel instead of via programming on the control system."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-segmented-gauge:blank",
 *     "description": "Crestron segmented gauge",
 *     "body": [
 *       "<ch5-segmented-gauge>",
 *       "</ch5-segmented-gauge>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-segmented-gauge:all-attributes",
 *     "description": "Crestron segmented gauge (All Attributes)",
 *     "body": [
 *       "<ch5-segmented-gauge id=\"ch5-segmented-gauge_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tgaugeLedStyle=\"${3:segmentedGaugeRectPip}\"",
 *       "\tprimaryStateGraphic=\"${4:green}\"",
 *       "\tsecondaryStateGraphic=\"${5:yellow}\"",
 *       "\ttertiaryStateGraphic=\"${6:red}\"",
 *       "\tminValue=\"${7:0}\"",
 *       "\tmaxValue=\"${8:65535}\"",
 *       "\tnumberOfSegments=\"${9:20}\"",
 *       "\ttouchSettable=\"${10:true}\"",
 *       "\tsendEventOnClick=\"${11:}\"",
 *       "\treceiveStateValue=\"${12:}\">",
 *       "</ch5-segmented-gauge>$0"
 *       ]
 *    },
 *    {
 *     "prefix": "ch5-segmented-gauge:default",
 *      "description": "Crestron segmented gauge (Default)",
 *      "body": [
 *       "<ch5-segmented-gauge id=\"ch5-segmented-gauge_${1:id}\"",
 *       "\torientation=\"${2:horizontal}\"",
 *       "\tgaugeLedStyle=\"${3:segmentedGaugeRectPip}\"",
 *       "\tprimaryStateGraphic=\"${4:green}\"",
 *       "\tsecondaryStateGraphic=\"${5:yellow}\"",
 *       "\ttertiaryStateGraphic=\"${6:red}\"",
 *       "\tminValue=\"${7:0}\"",
 *       "\tmaxValue=\"${8:65535}\"",
 *       "\tnumberOfSegments=\"${9:20}\"",
 *       "\ttouchSettable=\"${10:true}\">",
 *       "</ch5-segmented-gauge>$0"
 *       ]
 *     }
 *  ]
 */
export interface ICh5SegmentedGaugeDocumentation extends ICh5Common, ICh5SegmentedGaugeAttributes {

}
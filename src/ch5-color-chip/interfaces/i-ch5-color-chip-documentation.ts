import { ICh5CommonAttributesColorChip } from "../../ch5-common/interfaces/i-ch5-common-color-chip";
import { ICh5ColorChipAttributes } from "./i-ch5-color-chip-attributes";

/**
 * @name Ch5 Color Chip
 * @isattribute false
 * @tagName ch5-color-chip
 * @role color-chip
 * @description Color Chip is used as a display source of Red, Blue, and Green values.
 * @componentVersion 2.1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-color-chip` element",
 *   "***",
 *   "The Color Chip widget provides two functions: It provides additional feedback of an RGB color combination, potentially from the Color Picker, but could be any source of Red, Green and Blue values. It also acts as a simple flat color image that can be pressed by user and provides a digital join to control system to indicate it has been pressed."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-color-chip:blank",
 *    "description": "Crestron color chip",
 *    "body": [
 *      "<ch5-color-chip>",
 *      "</ch5-color-chip>$0"
 *    ]
 *   }, 
 *   {
 *    "prefix": "ch5-color-chip:default",
 *    "description": "Crestron ColorChip",
 *    "body": [
 *       "<ch5-color-chip previewColor=\"${1:black}\"",
 *       "\treceiveStateRedValue=\"${2}\"",
 *       "\treceiveStateGreenValue=\"${3}\"",
 *       "\treceiveStateBlueValue=\"${4}\">",
 *       "</ch5-color-chip>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-color-chip:all-attributes",
 *     "description": "Crestron ColorChip (All Attributes)",
 *     "body": [
 *       "<ch5-color-chip previewColor=\"${1:black}\"",
 *       "\tmaxValue=\"${2:255}\"",
 *       "\tsendEventOnClick=\"${3:colorChip_${id}_clicked}\"",
 *       "\treceiveStateRedValue=\"${4}\"",
 *       "\treceiveStateGreenValue=\"${5}\"",
 *       "\treceiveStateBlueValue=\"${6}\"",
 *       "\tsendEventColorRedOnChange=\"${7:colorChip_${id}_redChange}\"",
 *       "\tsendEventColorGreenOnChange=\"${8:colorChip_${id}_greenChange}\"",
 *       "\tsendEventColorBlueOnChange=\"${9:colorChip_${id}_blueChange}\">",
 *       "</ch5-color-chip>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ColorChipDocumentation extends ICh5CommonAttributesColorChip, ICh5ColorChipAttributes {

}
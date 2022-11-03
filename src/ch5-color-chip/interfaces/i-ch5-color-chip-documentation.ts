import { ICh5Common3 } from "../../ch5-common/interfaces/i-ch5-common-set3";
import { ICh5ColorChipAttributes } from "./i-ch5-color-chip-attributes";

/**
 * @name ch5 Color Chip
 * @isattribute false
 * @tagName ch5-color-chip
 * @role color-chip
 * @description Component to render an Color Chip.
 * @componentVersion 2.1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-color-chip` element",
 *   "***",
 *   "Component description"
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
export interface ICh5ColorChipDocumentation extends ICh5Common3, ICh5ColorChipAttributes {

}
import { ICh5Common3 } from "../../ch5-common/interfaces/i-ch5-common-set3"
import { ICh5ColorChipAttributes } from "./i-ch5-color-chip-attributes";

/**
 * @name ch5 color-chip
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
 *   {
 *    "prefix": "ch5-color-chip:default",
 *    "description": "Crestron ColorChip",
 *    "body": [
 *       "<ch5-color-chip previewcolor=\"${1:black}\"",
 *       "\treceivestateredvalue=\"${2}\"",
 *       "\treceivestategreenvalue=\"${3}\"",
 *       "\treceivestatebluevalue=\"${4}\">",
 *       "</ch5-color-chip>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-color-chip:all-attributes",
 *     "description": "Crestron ColorChip (All Attributes)",
 *     "body": [
 *       "<ch5-color-chip previewcolor=\"${1:black}\"",
 *       "\tmaxvalue=\"${2:255}\"",
 *       "\tsendeventonclick=\"${3:colorChip_${id}_clicked}\"",
 *       "\treceivestateredvalue=\"${4}\"",
 *       "\treceivestategreenvalue=\"${5}\"",
 *       "\treceivestatebluevalue=\"${6}\"",
 *       "\tsendeventcolorredonchange=\"${7:colorChip_${id}_redChange}\"",
 *       "\tsendeventcolorgreenonchange=\"${8:colorChip_${id}_greenChange}\"",
 *       "\tsendeventcolorblueonchange=\"${9:colorChip_${id}_blueChange}\">",
 *       "</ch5-color-chip>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ColorChipDocumentation extends ICh5Common3, ICh5ColorChipAttributes {

}
import { ICh5Common } from "../../_interfaces";
import { ICh5ColorPickerAttributes } from "./i-ch5-color-picker-attributes";

/**
 * @name ch5 color-picker
 * @isattribute false
 * @tagName ch5-color-picker
 * @role color-picker
 * @description component to render the color picker.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-color-picker` element",
 *   "***",
 *   "Component description"
 * ]
 * @snippets
 * [
 *   {
 *    "prefix": "ch5-color-picker:default",
 *    "description": "Crestron ColorPicker",
 *    "body": [
 *       "<ch5-color-picker receivestateredvalue=\"${1}\"",
 *       "\treceivestategreenvalue=\"${2}\"",
 *       "\treceivestatebluevalue=\"${3}\">",
 *       "</ch5-color-picker>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-color-picker:all-attributes",
 *     "description": "Crestron ColorPicker (All Attributes)",
 *     "body": [
 *       "<ch5-color-picker maxvalue=\"${1:255}\"",
 *        "\treceivestateredvalue=\"${2}\"",
 *       "\treceivestategreenvalue=\"${3}\"",
 *       "\treceivestatebluevalue=\"${4}\"",
 *       "\tsendredonchange=\"${5:colorPicker_${id}_redChange}\"",
 *       "\tsendgreenonchange=\"${6:colorPicker_${id}_greenChange}\"",
 *       "\tsendblueonchange=\"${7:colorPicker_${id}_blueChange}\">",
 *       "</ch5-color-picker>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ColorPickerDocumentation extends ICh5Common, ICh5ColorPickerAttributes {

}
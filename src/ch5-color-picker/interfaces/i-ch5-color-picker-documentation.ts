import { ICh5Common3 } from "../../ch5-common/interfaces/i-ch5-common-set3";
import { ICh5ColorPickerAttributes } from "./i-ch5-color-picker-attributes";

/**
 * @name Ch5 Color Picker
 * @isattribute false
 * @tagName ch5-color-picker
 * @role color-picker
 * @description The Color Picker control will comprise of a rectangular image of various colors and a vertical slider of various luminance values.
 * @componentVersion 2.1.0
 * @childElements
 * [
 *    
 * ]
 * @documentation
 * [
 *   "`ch5-color-picker` element",
 *   "***",
 *   "The color picker is a widget that allows users to see and select full 24 bit range of colors in manner similar to popular image editing software such as Adobe Photoshop, GNU Gimp and Microsoft Paint."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-color-picker:blank",
 *    "description": "Crestron color picker",
 *    "body": [
 *      "<ch5-color-picker>",
 *      "</ch5-color-picker>$0"
 *    ]
 *   },
 *   {
 *    "prefix": "ch5-color-picker:default",
 *    "description": "Crestron ColorPicker",
 *    "body": [
 *       "<ch5-color-picker receiveStateRedValue=\"${1}\"",
 *       "\treceiveStateGreenValue=\"${2}\"",
 *       "\treceiveStateBlueValue=\"${3}\">",
 *       "</ch5-color-picker>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-color-picker:all-attributes",
 *     "description": "Crestron ColorPicker (All Attributes)",
 *     "body": [
 *       "<ch5-color-picker maxValue=\"${1:255}\"",
 *        "\treceiveStateRedValue=\"${2}\"",
 *       "\treceiveStateGreenValue=\"${3}\"",
 *       "\treceiveStateBlueValue=\"${4}\"",
 *       "\tsendEventColorRedOnChange=\"${5:colorPicker_${id}_redChange}\"",
 *       "\tsendEventColorGreenOnChange=\"${6:colorPicker_${id}_greenChange}\"",
 *       "\tsendEventColorBlueOnChange=\"${7:colorPicker_${id}_blueChange}\">",
 *       "</ch5-color-picker>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5ColorPickerDocumentation extends ICh5Common3, ICh5ColorPickerAttributes {

}
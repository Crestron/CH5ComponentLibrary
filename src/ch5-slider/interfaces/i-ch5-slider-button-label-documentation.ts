import { ICh5SliderButtonLabelAttributes } from "./i-ch5-slider-button-label-attributes";

/**
 * @name Ch5 slider button label
 * @isattribute false
 * @tagName ch5-slider-button-label
 * @role slider-button-label
 * @description Ch5 Slider Button Label tag provide the ability to set label of the on/off buttons of the advance slider.
 * @componentVersion 2.4.0
 * @childElements
 * [
 *    {
 *     "tagName": "template",
 *     "optional": false,
 *     "childElements": []
 *    }
 * ]
 * @documentation
 * [
 *   "`ch5-slider-button-label` element",
 *   "***",
 *   "Ch5 Slider Button Label tag provide the ability to set label of the on/off buttons of the advance slider."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-slider-button-label:blank",
 *     "description": "Crestron slider button label",
 *     "body": [
 *       "<ch5-slider-button-label>",
 *       "\t<template>",
 *       "\t$1",
 *       "\t</template>",
 *       "</ch5-slider-button-label>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-slider-button-label:all-attributes",
 *     "description": "Crestron slider button label (All Attributes)",
 *     "body": [
 *       "<ch5-slider-button-label id=\"ch5-slider-button-label_${1:id}\"",
 *       "\tlabel=\"${2:}\"",
 *       "\treceiveStateLabel=\"${3:}\">",
 *       "</ch5-slider-button-label>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-slider-button-label:default",
 *      "description": "Crestron slider button label (Default)",
 *      "body": [
 *        "<ch5-slider-button-label label=\"${1:}\">",
 *        "</ch5-slider-button-label>$0"
 *      ]
 *    }
 *  ]
 */
export interface ICh5SliderButtonLabelDocumentation extends ICh5SliderButtonLabelAttributes {

}
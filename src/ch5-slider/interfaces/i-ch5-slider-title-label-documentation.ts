import { ICh5SliderTitleLabelAttributes } from "./i-ch5-slider-title-label-attributes";

/**
 * @name Ch5 slider-title-Label
 * @isattribute false
 * @tagName ch5-slider-title-label
 * @role slider-title-label
 * @description Ch5 Slider title Label tag provide the ability to set label of the title of the advance slider.
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
 *   "`ch5-slider-title-label` element",
 *   "***",
 *   "Ch5 Slider title Label tag provide the ability to set label of the title of the advance slider."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-slider-title-label:blank",
 *     "description": "Crestron Slider Title Label",
 *     "body": [
 *       "<ch5-slider-title-label>",
 *       "\t<template>",
 *       "\t$1",
 *       "\t</template>",
 *       "</ch5-slider-title-label>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-slider-title-label:all-attributes",
 *     "description": "Crestron Slider Title Label (All Attributes)",
 *     "body": [
 *       "<ch5-slider-title-label id=\"ch5-slider-title-label_${1:id}\"",
 *       "\tlabel=\"${2:}\"",
 *       "\treceiveStateLabel=\"${3:}\">",
 *       "</ch5-slider-title-label>$0"
 *       ]
 *    },
 *    {
 *      "prefix": "ch5-slider-title-label:default",
 *      "description": "Crestron Slider Title Label (Default)",
 *      "body": [
 *        "<ch5-slider-title-label label=\"${1:}\">",
 *        "</ch5-slider-title-label>$0"
 *       ]
 *    }
 *  ]
 */
export interface ICh5SliderTitleLabelDocumentation extends ICh5SliderTitleLabelAttributes {
}
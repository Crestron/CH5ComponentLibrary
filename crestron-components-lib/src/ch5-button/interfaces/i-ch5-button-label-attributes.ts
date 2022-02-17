// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @name Ch5 Button Label
 * @isattribute false
 * @tagName ch5-button-label
 * @role button
 * @description Ch5 Button Label is a child node for <ch5-button>, <ch5-button-mode> and <ch5-button-mode-state>.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *    {
 *      "tagName": "ch5-button-label",
 *      "optional": true,
 *      "childElements": [
 *        {
 *          "tagName": "template",
 *          "optional": false,
 *          "childElements": [
 *               {
 *                  "tagName": "ch5-jointotext-boolean",
 *                  "optional": true,
 *                  "childElements": []
 *               },
 *               {
 *                  "tagName": "ch5-jointotext-numeric",
 *                  "optional": true,
 *                  "childElements": []
 *               },
 *               {
 *                  "tagName": "ch5-jointotext-string",
 *                  "optional": true,
 *                  "childElements": []
 *               }
 *          ]
 *        }
 *      ]
 *    }
 * ]
 * @documentation
 * [
 *   "`ch5-button-label` element",
 *   "***",
 *   "A child element designed to capture the label for Ch5 Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-button-label:blank",
 *     "description": "Crestron Button Label",
 *     "body": [
 *       "<ch5-button-label>",
 *       "\t<template>",
 *       "\t$1",
 *       "\t</template>",
 *       "</ch5-button-label>$0"
 *     ]
 *   }
 * ]
 *
 */
export interface ICh5ButtonLabelAttributes {

}

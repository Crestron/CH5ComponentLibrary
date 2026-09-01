// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @name Ch5 Advance Button Label
 * @isattribute false
 * @tagName ch5-advanced-button-label
 * @role button
 * @description Ch5 Advance Button Label is a child node for <ch5-advanced-button>, <ch5-advanced-button-mode> and <ch5-advanced-button-mode-state>.
 * @componentVersion 1.0.0
 * @childElements
 * [
 *     {
 *        "tagName": "ch5-jointotext-boolean",
 *        "optional": true,
 *        "childElements": []
 *     },
 *     {
 *        "tagName": "ch5-jointotext-numeric",
 *        "optional": true,
 *        "childElements": []
 *     },
 *     {
 *        "tagName": "ch5-jointotext-string",
 *        "optional": true,
 *        "childElements": []
 *     }
 * ]
 * @documentation
 * [
 *   "`ch5-advanced-button-label` element",
 *   "***",
 *   "A child element designed to capture the label for Ch5 Advance Button component."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-advanced-button-label:blank",
 *     "description": "Crestron Button Label",
 *     "body": [
 *       "<ch5-advanced-button-label>",
 *       "\t<template>",
 *       "\t$1",
 *       "\t</template>",
 *       "</ch5-advanced-button-label>$0"
 *     ]
 *   }
 * ]
 *
 */
export interface ICh5AdvancedButtonLabelAttributes {

}

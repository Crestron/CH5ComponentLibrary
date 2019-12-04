// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { CompositeType } from "./composite-type";
import { Ch5Base } from "./ch5-base";

/**
 * @name Ch5 Slider
 * @tagName ch5-slider
 * @isattribute false
 * @description Ch5 Slider offers a wide range of functionality out-of-the-box.
 * @documentation
 * [
 *   "`ch5-slider` element",
 *   "***",
 *   "Extension to standard HTML ch5-button element with icons and simple formats."
 * ]
 * @snippets
 * [
 *   {
 *    "prefix": "ch5-button",
 *     "description": "Crestron Button",
 *     "body": [
 *       "<ch5-slider id=\"btn_${1:id}\"",
 *       "\tlabel=\"${2:Crestron Button}\"",
 *       "\tsendSignalOnClick=\"${3:btn_${1}_clicked}\">",
 *       "</ch5-slider>$0"
 *     ]
 *   },
 *   {
 *     "prefix": "ch5-slider-",
 *     "description": "Crestron Slider (All Attributes)",
 *     "body": [
 *       "<ch5-slider id=\"btn_${1:id}\"",
 *       "\tlabel=\"${2:Crestron Button}\"",
 *       "\ttype=\"${3|default,primary,info,text,danger,warning,success,secondary|}\"",
 *       "\tcustomClass=\"${4:customClass}\"",
 *       "\tshape=\"${5|rounded-rectangle,rectangle,tab,circle,oval|}\"",
 *       "\tsize=\"${6|regular,x-small,small,large,x-large|}\"",
 *       "\tstretch=\"${7|both,width,height|}\"",
 *       "\ticonPosition=\"${8|first,last,top,bottom|}\"",
 *       "\ticonClass=\"${9:iconClass}\"",
 *       "\torientation=\"${8|horizontal,vertical|}\"",
 *       "\tsendSignalOnClick=\"${9:btn_${1}_clicked}\"",
 *       "\tsendSignalOnTouch=\"${10:btn_${1}_touched}\"",
 *       "\treceiveSignalSelected=\"${11}\"",
 *       "\treceiveSignalLabel=\"${12}\"",
 *       "\treceiveSignalScriptLabelHtml=\"${13}\">",
 *       "</ch5-slider>$0"
 *     ]
 *   }
 * ]
 *
 */
export interface Ch5Slider extends Ch5Base {
    /**
     * @name composite
     * @documentation
     * [
     * "`size` attribute",
     *  "***",
     *  "Valid values: default, info, text, danger, warning, success, primary, secondary.",
     *  "",
     *  "Overrides the appearance of the button with alternative css defined in classes defined with ch5-button--type where type is the value of the property.If no `size` is provided, type of `default` is used."
     * ]
     */
    size: CompositeType;

    /**
     * @name id
     */
    id: string;
}

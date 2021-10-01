// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5KeypadShape, TCh5KeypadStretch, TCh5KeypadType } from "./t-ch5-keypad";

/**
 * @name Ch5 Keypad
 * @isattribute false
 * @tagName ch5-keypad
 * @role container
 * @description Ch5 Keypad offers a control set of 5 buttons to preform specific changes
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-keypad` element",
 * "***",
 * "The Keypad component is a flexible numeric keypad that always displays 0-9 like a standard telephone ",
 * "(along with * and #) and also allows for customizable button labels. ",
 * "The Keypad has a default theme associated with it. The extra button can contain customizable icon. ",
 * "Each button can send signals on click / touch events."
 * ]
 * @snippets
 * [
 *  {
 *    "prefix": "ch5-keypad:blank",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad>",
 *       "</ch5-keypad>$0"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:contractbased",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"btn_${0:id}\"",
 *       "\tcontractname=\"${1:Contract Name}\"",
*        ">",
 *       "</ch5-keypad>"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:eventbased",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"btn_${0:id}\"",
 *       "\tsendeventonclickstart=\"${1:Event_Click_Index}\"",
*        ">",
 *       "</ch5-keypad>"
 *     ]
 *  },
 *  {
 *    "prefix": "ch5-keypad:all-attributes",
 *     "description": "Crestron Keypad",
 *     "body": [
 *       "<ch5-keypad id=\"btn_${0:id}\"",
 *       "\tcontractname=\"${1:Contract Name}\"",
 *       "\tshape=\"${2:Shape}\"",
 *       "\ttype=\"${3:type}\"",
 *       "\tstretch=\"${4:stretch}\"",
 *       "\ttextorientation=\"${5:textOrientation}\"",
 *       "\tshowextrabutton=\"${6:showExtraButton}\"",
 *       "\tusecontractforenable=\"${7:useContractforEnable}\"",
 *       "\tusecontractforshow=\"${8:useContractForShow}\"",
 *       "\tusecontractforcustomclass=\"${9:useContractForCustomClass}\"",
 *       "\tusecontractforcustomstyle=\"${10:useContractForCustomStyle}\"",
 *       "\tsendeventonclickstart=\"${11:sendEventOnClickStart}\"",
*        ">",
 *       "</ch5-keypad>"
 *     ]
 *   }
 * ]
 */
export interface ICh5KeypadAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`contractName` attribute",
     * "***",
     * "Defines the primary contract name to derive the component's contract details."
     * ]
     * @name contractName
     */
    contractName: string;

    /**
     * @documentation
     * [
     * "`type` attribute",
     * "***",
     * "Overrides the appearance of each of the buttons inside <ch5-keypad> with alternative CSS ",
     * "defined in classes defined with ch5-keypad--type where type is the value of the property. ",
     * "If no 'type' is provided, type of 'primary' is used."
     * ]     
     * @name type
     * @default primary
     */
     type: TCh5KeypadType;

    /**
     * @documentation
     * [
     * "`type` shape",
     * "***",
     * "Sets the overall <ch5-Keypad> component shape to plus or circle."
     * ]
     * @name shape
     * @default plus
     */
    shape: TCh5KeypadShape;

    /**
     * @documentation
     * [
     * "`type` stretch",
     * "***",
     * "When the stretch property is set, the component inherits the width or/and height of the container. ",
     * "If stretch by height is used, the <ch5-Keypad> will be responsive based on the width of the container. ",
     * "If stretch width is applied, the <ch5-Keypad> will be responsive based on the height of the container. ",
     * "This implies that the container height is picked for width and container width is picked for height ",
     * "to ensure that the overall shape of the component is a 'square' in nature (equal in width and height ",
     * "for the shapes of plus and circle)."
     * ]
     * @name stretch
     */
    stretch: TCh5KeypadStretch | null;

    /**
     * @documentation
     * [
     * "`type` textOrientation",
     * "***",
     * "Default value is 'top'. ",
     * "Allows to customize the orientation of the keypad buttons' major-minor. ",
     * "The value dictates the position of the labelMajor and labelMinor is complimented. ",
     * "If value is top: then, major will be on top and minor will be below it. ",
     * "join+2 applies to left, join+3 applies to right, join+4 to center ."
     * ]
     * @name textOrientation
     * @default top
     */
    textOrientation: string;

    /**
     * @documentation
     * [
     * "`type` useContractforEnable",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered to enable ",
     * "<ch5-Keypad> tag and also to enable the buttons under <ch5-Keypad> component i.e. <ch5-Keypad-button-left>, ",
     * "<ch5-Keypad-button-right>, <ch5-Keypad-button-top>, <ch5-Keypad-button-bottom>, <ch5-Keypad-button-center>. ",
     * "The names from the contract will be different for each of the buttons and the overall <ch5-Keypad> component. ",
     * "The details can be seen in the table above."
     * ]
     * @name useContractforEnable
     * @default false
     */
    useContractforEnable: boolean;

    /**
     * @documentation
     * [
     * "`type` useContractForShow",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered to show / hide ",
     * "<ch5-Keypad> tag. The names from the contract will be different for each of the buttons and the overall ",
     * "<ch5-Keypad> component. The details can be seen in the table above."
     * ]
     * @name useContractForShow
     * @default false
     */
    useContractForShow: boolean;

    /**
     * @documentation
     * [
     * "`type` useContractForCustomClass",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered for remaining ",
     * "ch5-Keypad button as a custom class."
     * ]
     * @name useContractForCustomClass 
     * @default false
     */
    useContractForCustomClass: boolean;

    /**
     * @documentation
     * [
     * "`type` useContractForCustomStyle",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered ",
     * "for the custom style."
     * ]
     * @name useContractForCustomStyle
     * @default false
     */
    useContractForCustomStyle: boolean;

    /**
     * @documentation
     * [
     * "`type` useContractForExtraButtonShow",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered ",
     * "for the custom style."
     * ]
     * @name useContractForExtraButtonShow
     * @default false
     */
    useContractForExtraButtonShow: boolean;

    /**
     * @documentation
     * [
     * "`type` showExtraButton",
     * "***",
     * "The default value is false. This allows the keypad to have a ",
     * "special row of buttons with a single button visiblethat shows a Phone icon. ",
     * "The row when displayed, will add on to the existing height."
     * ]
     * @name showExtraButton
     * @default false
     */
    showExtraButton: boolean;

    /**
     * @documentation
     * [
     * "`type` sendEventOnClickStart",
     * "***",
     * "Only applies if contractName is not provided, if this parameter is supplied,",
     * " the join number is applied to the top button, join+1 applies to bottom, ",
     * "join+2 applies to left, join+3 applies to right, join+4 to center ."
     * ]
     * @name sendEventOnClickStart
     */
    sendEventOnClickStart: string;
}
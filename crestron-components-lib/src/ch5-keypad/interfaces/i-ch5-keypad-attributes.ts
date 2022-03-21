// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";
import { TCh5KeypadShape, TCh5KeypadSize, TCh5KeypadStretch, TCh5KeypadTextOrientation, TCh5KeypadType } from "./t-ch5-keypad";

/**
 * @ignore
 */
export interface ICh5KeypadAttributes extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`contractName` attribute",
     * "***",
     * "Defines the primary contract name to derive the component's contract details."
     * ]
     * @name contractname
     * @attributeType "String"
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
     * @default default
     * @attributeType "String"
     */
     type: TCh5KeypadType;

    /**
     * @documentation
     * [
     * "`shape` attribute",
     * "***",
     * "Sets the overall <ch5-keypad> component shape to plus or circle."
     * ]
     * @name shape
     * @default plus
     * @attributeType "String"
     */
    shape: TCh5KeypadShape;

    /**
     * @documentation
     * [
     * "`stretch` attribute",
     * "***",
     * "When the stretch property is set, the component inherits the width or/and height of the container. ",
     * "If stretch by height is used, the <ch5-keypad> will be responsive based on the width of the container. ",
     * "If stretch width is applied, the <ch5-keypad> will be responsive based on the height of the container. ",
     * "This implies that the container height is picked for width and container width is picked for height ",
     * "to ensure that the overall shape of the component is a 'square' in nature (equal in width and height ",
     * "for the shapes of plus and circle)."
     * ]
     * @name stretch
     * @attributeType "String"
     */
    stretch: TCh5KeypadStretch | null;

    /**
     * @documentation
     * [
     * "`textOrientation` attribute",
     * "***",
     * "Default value is 'top'. ",
     * "Allows to customize the orientation of the keypad buttons' major-minor. ",
     * "The value dictates the position of the labelMajor and labelMinor is complimented. ",
     * "If value is top: then, major will be on top and minor will be below it. ",
     * "join+2 applies to left, join+3 applies to right, join+4 to center ."
     * ]
     * @name textorientation
     * @default top
     * @attributeType "String"
     */
    textOrientation: TCh5KeypadTextOrientation;

    /**
     * @name size
     * @documentation
     * [
     * "`size` attribute",
     *  "***",
     *  "Overrides the appearance of the button with alternative CSS that is defined in classes defined with ch5-keypad--size, where size is the value of the property. If no `size` is provided, type of `default` is used."
     * ]
     * @default regular
     * @attributeType "String"
     */
    size: TCh5KeypadSize;

    /**
     * @documentation
     * [
     * "`useContractForEnable` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered to enable ",
     * "<ch5-keypad> tag and also to enable the buttons under <ch5-keypad> component i.e. <ch5-keypad-button-left>, ",
     * "<ch5-keypad-button-right>, <ch5-keypad-button-top>, <ch5-keypad-button-bottom>, <ch5-keypad-button-center>. ",
     * "The names from the contract will be different for each of the buttons and the overall <ch5-keypad> component. ",
     * "The details can be seen in the table above."
     * ]
     * @name usecontractforenable
     * @default false
     * @attributeType "boolean"
     */
    useContractForEnable: boolean;

    /**
     * @documentation
     * [
     * "`useContractForShow` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered to show / hide ",
     * "<ch5-keypad> tag. The names from the contract will be different for each of the buttons and the overall ",
     * "<ch5-keypad> component. The details can be seen in the table above."
     * ]
     * @name usecontractforshow
     * @default false
     * @attributeType "boolean"
     */
    useContractForShow: boolean;

    /**
     * @documentation
     * [
     * "`useContractForCustomClass` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered for remaining ",
     * "ch5-keypad button as a custom class."
     * ]
     * @name usecontractforcustomclass
     * @default false
     * @attributeType "boolean"
     */
    useContractForCustomClass: boolean;

    /**
     * @documentation
     * [
     * "`useContractForCustomStyle` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered ",
     * "for the custom style."
     * ]
     * @name usecontractforcustomstyle
     * @default false
     * @attributeType "boolean"
     */
    useContractForCustomStyle: boolean;

    /**
     * @documentation
     * [
     * "`useContractForExtraButtonShow` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered ",
     * "for the custom style."
     * ]
     * @name usecontractforextrabuttonshow
     * @default false
     * @attributeType "boolean"
     */
    useContractForExtraButtonShow: boolean;

    /**
     * @documentation
     * [
     * "`showExtraButton` attribute",
     * "***",
     * "The default value is false. This allows the keypad to have a ",
     * "special row of buttons with a single button visible that shows a Phone icon. ",
     * "The row when displayed, will add on to the existing height."
     * ]
     * @name showextrabutton
     * @default false
     * @attributeType "boolean"
     */
    showExtraButton: boolean;

    /**
     * @documentation
     * [
     * "`receiveStateExtraButtonShow` attribute",
     * "***",
     * "The boolean value of the signal determines if the dial button is seen by the user. ",
     * "Only applicable if contractName is not provided as a parameter."
     * ]
     * @name receivestateextrabuttonshow
     * @attributeType "boolean"
     */
    receiveStateExtraButtonShow: string;

    /**
     * @documentation
     * [
     * "`sendEventOnClickStart` attribute",
     * "***",
     * "Only applies if contractName is not provided, if this parameter is supplied,",
     * " the join number is applied to the top button, join+1 applies to bottom, ",
     * "join+2 applies to left, join+3 applies to right, join+4 to center ."
     * ]
     * @name sendeventonclickstart
     * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
     * @attributeType "join"
     */
    sendEventOnClickStart: string;
}

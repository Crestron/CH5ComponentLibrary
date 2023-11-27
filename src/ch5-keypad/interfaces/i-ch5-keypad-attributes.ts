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
     * @join { isContractName: true }
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
     * @attributeType "EnumeratedValue"
     */
    type: TCh5KeypadType;

    /**
     * @documentation
     * [
     * "`shape` attribute",
     * "***",
     * "Sets the overall <ch5-keypad> component shape to rounded-rectangle, square or circle."
     * ]
     * @name shape
     * @default rounded-rectangle
     * @attributeType "EnumeratedValue"
     */
    shape: TCh5KeypadShape;

    /**
     * @documentation
     * [
     * "`stretch` attribute",
     * "***",
     * "When the stretch property is set, the component inherits the width or/and height of the container. ",
     * "If stretch by height is used, the <ch5-keypad> will be responsive based on the width of the container. ",
     * "If stretch width is applied, the <ch5-keypad> will be responsive based on the height of the container. "
     * ]
     * @name stretch
     * @attributeType "EnumeratedValue"
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
     * "If value is top: then, major will be on top and minor will be below it. "
     * ]
     * @name textorientation
     * @default top
     * @attributeType "EnumeratedValue"
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
     * @attributeType "EnumeratedValue"
     */
    size: TCh5KeypadSize;

    /**
     * @documentation
     * [
     * "`useContractForEnable` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered to enable ",
     * "<ch5-keypad> tag and also to enable the buttons under <ch5-keypad> component.",
     * "The names from the contract will be different for each of the buttons and the overall <ch5-keypad> component. ",
     * "The details can be seen in the table above."
     * ]
     * @name usecontractforenable
     * @default false
     * @attributeType "Boolean"
     */
    useContractForEnable: boolean;

    /**
     * @documentation
     * [
     * "`useContractForShow` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered to show / hide ",
     * "<ch5-keypad> tag. The names from the contract will be different for each of the buttons and the overall ",
     * "<ch5-keypad> component. The details can be seen in the table above."
     * ]
     * @name usecontractforshow
     * @default false
     * @attributeType "Boolean"
     */
    useContractForShow: boolean;

    /**
     * @documentation
     * [
     * "`useContractForCustomClass` attribute",
     * "***",
     * "If the contract name exists, by default this becomes true. ",
     * "If the contract name does not exist, by default this becomes false. ",
     * "If this value is set to true then the value received from the contract will be considered for remaining ",
     * "ch5-keypad button as a custom class."
     * ]
     * @name usecontractforcustomclass
     * @default false
     * @attributeType "Boolean"
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
     * @attributeType "Boolean"
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
     * @attributeType "Boolean"
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
     * @attributeType "Boolean"
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
     * @join { "direction": "state", "booleanJoin": 1, "isContractName": true }
     * @attributeType "Join"
     */
    receiveStateExtraButtonShow: string;

    /**
     * @documentation
     * [
     * "`sendEventOnClickStart` attribute",
     * "***",
     * "Only applies if contractName is not provided, if this parameter is supplied,",
     * " the join + 1 number is applied to the #1 button, join+2 applies to #2 button, ",
     * "join+3 applies #3 button, join+4 applies #4 button, join+5 applies #5 button, ",
     * "join+6 applies #6 button, join+7 applies #7 button, join+8 applies #8 button, ",
     * "join+9 applies #9 button, join applies #0 button, join+10 applies star button,",
     * "join+11 applies hash button and join+12 applies to extra button."
     * ]
     * @name sendeventonclickstart
     * @join {"direction": "event", "booleanJoin": 13}
     * @attributeType "Join"
     */
    sendEventOnClickStart: string;

    /**
     * @documentation
     * [
     * "`hidePoundButton` attribute",
     * "***",
     * "Attribute to hide the pound button of the Keypad. Default value is false."
     * ]
     * @name hidepoundbutton
     * @default false
     * @attributeType "Boolean"
     */
    hidePoundButton: boolean;

    /**
     * @documentation
     * [
     * "`hideAsteriskButton` attribute",
     * "***",
     * "Attribute to hide the asterisk button of the Keypad. Default value is false."
     * ]
     * @name hideasteriskbutton
     * @default false
     * @attributeType "Boolean"
     */
    hideAsteriskButton: boolean;

    /**
     * @documentation
     * [
     * "`receiveStateHideAsteriskButton` attribute",
     * "***",
     * "Boolean signal to hide the asterisk button of the Keypad. This will override hideAsteriskButton."
     * ]
     * @name receivestatehideasteriskbutton
     * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
     * @attributeType "Join"
     */
    receiveStateHideAsteriskButton: string;

    /**
     * @documentation
     * [
     * "`receiveStateHidePoundButton` attribute",
     * "***",
     * "Boolean signal to hide the pound button of the Keypad. This will override hidePoundButton."
     * ]
     * @name receivestatehidepoundbutton
     * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
     * @attributeType "Join"
     */
    receiveStateHidePoundButton: string;
}

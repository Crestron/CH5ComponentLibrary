// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces/i-ch5-common-attributes";
import { TCh5DpadShape, TCh5DpadSize, TCh5DpadStretch, TCh5DpadType } from "./t-ch5-dpad";

/**
 * @ignore
 */
export interface ICh5DpadAttributes extends ICh5CommonAttributes {

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
	 * "Overrides the appearance of dpad with alternative CSS that is defined in classes ",
	 * "defined with ch5-dpad--type-typeValue where typeValue is the value of 'type' ",
	 * "property. If no 'type' is provided, type of 'default' is used."
	 * ]
	 * @name type
	 * @default default
	 * @attributeType "EnumeratedValue"
	 */
	type: TCh5DpadType;

	/**
	 * @documentation
	 * [
	 * "`shape` attribute",
	 * "***",
	 * "Sets the overall <ch5-dpad> component shape to plus or circle.",
	 * "CSS class of ch5-dpad--shape-shapeValue is added to the dpad, where shapeValue ",
	 * "is the value of 'shape' property. If no 'shape' is provided, shape of 'plus' is used."
	 * ]
	 * @name shape
	 * @default plus
	 * @attributeType "EnumeratedValue"
	 */
	shape: TCh5DpadShape;

	/**
	 * @documentation
	 * [
	 * "`stretch` attribute",
	 * "***",
	 * "When the stretch property is set, the component inherits the width or/and height of the container. ",
	 * "If stretch by height is used, the <ch5-dpad> will be responsive based on the width of the container. ",
	 * "If stretch width is applied, the <ch5-dpad> will be responsive based on the height of the container. ",
	 * "This implies that the container height is picked for width and container width is picked for height ",
	 * "to ensure that the overall shape of the component is a 'square' in nature (equal in width and height ",
	 * "for the shapes of plus and circle)."
	 * ]
	 * @name stretch
	 * @attributeType "EnumeratedValue"
	 */
	stretch: TCh5DpadStretch | null;

	/**
	 * @name size
	 * @documentation
	 * [
	 * "`size` attribute",
	 *  "***",
	 * "Overrides the appearance of dpad with alternative CSS that is defined in classes ",
	 * "defined with ch5-dpad--size-sizeValue where sizeValue is the value of 'size'.",
	 * "If no 'size' is provided, type of 'default' is used."
	 * ]
	 * @default regular
	 * @attributeType "EnumeratedValue"
	 */
	size: TCh5DpadSize;

	/**
	 * @documentation
	 * [
	 * "`useContractForEnable` attribute",
	 * "***",
	 * "If the contract name exists, by default this becomes true. ",
	 * "If the contract name does not exist, by default this becomes false. ",
	 * "If this value is set to true then the value received from the contract will be considered to enable ",
	 * "<ch5-dpad> tag and also to enable the buttons under <ch5-dpad> component i.e. <ch5-dpad-button>.",
	 * "The names from the contract will be different for each of the buttons and the overall <ch5-dpad> component. ",
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
	 * "If this value is set to true then the value received from the contract will be considered to show / hide ",
	 * "<ch5-dpad> tag. The names from the contract will be different for each of the buttons and the overall ",
	 * "<ch5-dpad> component. The details can be seen in the table above."
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
	 * "If this value is set to true then the value received from the contract will be considered for remaining ",
	 * "ch5-dpad button as a custom class."
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
	 * "`sendEventOnClickStart` attribute",
	 * "***",
	 * "Only applies if contractName is not provided, if this parameter is supplied,",
	 * " the join number is applied to the up button, join+1 applies to down, ",
	 * "join+2 applies to left, join+3 applies to right, join+4 to center ."
	 * ]
	 * @name sendeventonclickstart
	 * @join {"direction": "event", "booleanJoin": 5}
	 * @attributeType "Join"
	 */
	sendEventOnClickStart: string;
}

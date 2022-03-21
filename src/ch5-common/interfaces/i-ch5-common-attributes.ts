// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ShowType } from "./t-ch5-common";

/**
 * @ignore
 */
export interface ICh5CommonAttributes {

	/**
	 * @documentation
	 * [
	 * "`id` attribute",
	 * "***",
	 * "This is a standard id HTML attribute."
	 * ]
	 * @name id
	 * @attributeType "String"
	 */
	id: string;

	/**
	 * @documentation
	 * [
	 * "`customclass` attribute",
	 * "***",
	 * "Contains a list of classes that are applied on the component"
	 * ]
	 * @name customclass
	 * @hideWhen [
	 *  {"receiveStateCustomClass": ["true"] }
	 * ]
	 * @attributeType "String"
	 */
	customClass: string;

	/**
	 * @documentation
	 * [
	 * "`customstyle` attribute",
	 * "***",
	 * "Contains a list of space-delimited style classes applied on the component."
	 * ]
	 * @name customstyle
	 * @attributeType "String"
	 */
	customStyle: string;

	/**
	 * @documentation
	 * [
	 * "`noshowtype` attribute",
	 * "***",
	 * "This property reflects the type of the visibility of the item. See the 'data-ch5-noshow-type' ",
	 * "custom HTML attribute for further information."
	 * ]
	 * @name noshowtype
	 * @attributeType "String"
	 */
	noshowType: TCh5ShowType;

	/**
	 * @documentation
	 * [
	 * "`receivestatecustomclass` attribute",
	 * "***",
	 * "The value of this signal will be applied as an equivalent property on 'customClass'.",
	 * "The change of value will remove the prior value and apply the new value."
	 * ]
	 * @name receivestatecustomclass
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "join"
	 */
	receiveStateCustomClass: string;

	/**
	 * @documentation
	 * [
	 * "`receivestatecustomstyle` attribute",
	 * "***",
	 * "The value of this signal will be applied as an equivalent property on 'styleClass'.",
	 * "The change of value will remove the prior value and apply the new value."
	 * ]
	 * @name receivestatecustomstyle
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "join"
	 */
	receiveStateCustomStyle: string;

	/**
	 * @documentation
	 * [
	 * "`receivestateshow` attribute",
	 * "***",
	 * "When true, the boolean value of the signal determines if the component is visible."
	 * ]
	 * @name receivestateshow
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "join"
	 */
	receiveStateShow: string;

	/**
	 * @documentation
	 * [
	 * "`'receivestateshowpulse` attribute",
	 * "***",
	 * "on transition from false to true, this signal directs the component to become visible."
	 * ]
	 * @name receivestateshowpulse
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "join"
	 */
	receiveStateShowPulse: string;

	/**
	 * @documentation
	 * [
	 * "`receivestatehidepulse` attribute",
	 * "***",
	 * "on transition from false to true, this signal will direct if the component is no longer visible."
	 * ]
	 * @name receivestatehidepulse
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "join"
	 */
	receiveStateHidePulse: string;

	/**
	 * @documentation
	 * [
	 * "`receivestateenable` attribute",
	 * "***",
	 * "When true, the boolean value of the signal determines if the component is enabled.",
	 * "Note that the signal name is provided, and the value of the signal has the opposite ",
	 * "convention of the 'disabled' attribute. This is to provide consistency with current programming practices."
	 * ]
	 * @name receivestateenable
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "join"
	 */
	receiveStateEnable: string;

	/**
	 * @documentation
	 * [
	 * "`sendeventonshow` attribute",
	 * "***",
	 * "Has a boolean value of true when the component is visible and false when not visible.",
	 * "Note that even if component is completely covered by other visible elements, it is still considered visible."
	 * ]
	 * @name sendeventonshow
	 * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "join"
	 */
	sendEventOnShow: string;

	/**
	 * @documentation
	 * [
	 * "`appendclasswheninviewport` attribute",
	 * "***",
	 * "Applies the provided value as class name while the component is visible and removes the class name when not visible."
	 * ]
	 * @name appendclasswheninviewport
	 * @attributeType "String"
	 */
	appendClassWhenInViewPort: string;

	/**
	 * @documentation
	 * [
	 * "`show` attribute",
	 * "***",
	 * "The visibility of the component depends upon the boolean value. The component is visible ",
	 * "when the value is true and hides when it is false."
	 * ]
	 * @name show
	 * @default true
	 * @attributeType "boolean"
	 */
	show: boolean;

	/**
	 * @documentation
	 * [
	 * "`dir` attribute",
	 * "***",
	 * "An enumerated attribute indicating the directionality of the element's text. It can have the following values:",
	 * "ltr, which means left to right and is to be used for languages that are written from the left to the right (like English) ",
	 * "rtl, which means right to left and is to be used for languages that are written from the right to the left (like Arabic) ",
	 * "auto, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it ",
	 * "finds a character with a strong directionality then it applies that directionality to the whole element."
	 * ]
	 * @name dir
	 * @attributeType "String"
	 */
	dir: string;

}

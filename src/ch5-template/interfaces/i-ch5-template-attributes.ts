// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributesTemplate } from "../../ch5-common/interfaces/i-ch5-common-attributes-template";
import { TCh5TransitionInType, TCh5TransitionOutType } from "./t-ch5-template";

/**
 * @ignore
 */
export interface ICh5TemplateAttributes extends ICh5CommonAttributesTemplate {
    /**
     * @isattribute true
     * @documentation
     * [
     * "`templateid` attribute",
     * "***",
     * "The ID of the template to be instantiated."
     * ]
     * @name templateid
     * @attributeType "String"
     *
     */
    templateId: string;

    /**
     * @isattribute true
     * @documentation
     * [
     * "`context` attribute",
     * "***",
     *  "In the format of 'original:replacement;' original is the value to be replaced, and replacement ",
     *  "is the replacement value."
     * ]
     * @name context
     * @attributeType "String"
     */
    context: string;

    /**
     * @isattribute true
     * @documentation
     * [
     * "`contractName` attribute",
     * "***",
     *  "A name to be prefixed to all signal names in the template.  ",
     *  ""
     * ]
     * @name contractname
     * @attributeType "String"
     */
    contractName: string;

    /**
     * @isattribute true
     * @documentation
     * [
     * "`booleanJoinOffset` attribute",
     * "***",
     *  "A value to be added to all digital/boolean join numbers provided in the template.  ",
     *  ""
     * ]
     * @name booleanjoinoffset
     * @attributeType "String"
     */
    booleanJoinOffset: string;

    /**
     * @isattribute true
     * @documentation
     * [
     * "`numericJoinOffset` attribute",
     * "***",
     *  "A value to be added to all analog/numeric join numbers provided in the template.  ",
     *  ""
     * ]
     * @name numericjoinoffset
     * @attributeType "String"
     */
    numericJoinOffset: string;

    /**
     * @isattribute true
     * @documentation
     * [
     * "`stringJoinOffset` attribute",
     * "***",
     *  "A value to be added to all serial/string join numbers provided in the template.  ",
     *  ""
     * ]
     * @name stringjoinoffset
     * @attributeType "String"
     */
    stringJoinOffset: string;

    /**
     * @documentation
     * [
     * "`transitionIn` attribute",
     * "***",
     * "Animation transition class when component enters the viewport.The default value is null."
     * ]
     * @name transitionin
     * @default null
     * @attributeType "EnumeratedValue"
     */
    transitionIn: TCh5TransitionInType | null;
    /**
     * @documentation
     * [
     * "`transitionOut` attribute",
     * "***",
     * "Animation transition class when the component exits the viewport.The default value is null."
     * ]
     * @name transitionout
     * @default null
     * @attributeType "EnumeratedValue"
     */
    transitionOut: TCh5TransitionOutType | null;
    /**
     * @documentation
     * [
     * "`transitionDuration` attribute",
     * "***",
     * "Animation transition duration when the component enters or exits from the viewport.The default value is '1s'. Both seconds (s) and milliseconds (ms) are acceptable values."
     * ]
     * @name transitionduration
     * @default 1s
     * @attributeType "String"
     */
    transitionDuration: string;
    /**
     * @documentation
     * [
     * "`transitionDelay` attribute",
     * "***",
     * "Animation transition delay occurs when the component enters or exits the viewport. The default value is '0s'. Both seconds (s) and milliseconds (ms) are acceptable values."
     * ]
     * @name transitiondelay
     * @default 0s
     * @attributeType "String"
     */
    transitionDelay: string;

}

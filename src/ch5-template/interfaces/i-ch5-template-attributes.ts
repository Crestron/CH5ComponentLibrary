// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Template
 * @isattribute false
 * @tagName ch5-template
 * @role template
 * @description ch5-template create new instances of the user provided <template>.
 * @componentVersion 1.0.0
 * @documentation
 * [
 *   "`ch5-template` element",
 *   "***",
 *   "The primary functionality of this component is to create new instances ",
 *   "of the user-provided <template> and to substitute event and state names ",
 *   "where indicated by the developer.  ",
 *   "Upon completion of creating a new instance of the the user-provided ",
 *   "<template>, a container element is provided with a unique ",
 *   "id attribute that is unique across all created instances.  ",
 *   "Each top level element provided in user-provided <template> will ",
 *   "also be provided a unique id, unless the element already has an id. "
 * ]
 * @snippets
 * [
 *   {
 *       "prefix": "ch5-template:default",
 *       "description": "Crestron Ch5-Template (default)",
 *       "body": [
 *           "<ch5-template templateId=\"[provideTemplateId]\" context=\"[original]:[replacement]\"></ch5-template>"
 *      ]
 *     }
 * ]
 *
 */

export interface ICh5TemplateAttributes extends ICh5CommonAttributes {
    /**
     * @isattribute true
     * @name templateId
     * @documentation
     * [
     * "`templateid` attribute",
     * "***",
     * "The ID of the template to be instantiated."
     * ]
     * @name templateid
     *
     */
    templateId: string;

    /**
     * @isattribute true
     * @name context
     * @documentation
     * [
     * "`context` attribute",
     * "***",
     *  "In the format of 'original:replacement;' original is the value to be replaced, and replacement ",
     *  "is the replacement value."
     * ]
     * @name context
     */
    context: string;

    /**
     * @isattribute true
     * @name contractName
     * @documentation
     * [
     * "`contractName` attribute",
     * "***",
     *  "A name to be prefixed to all signal names in the template.  ",
     *  ""
     * ]
     * @name contractName
     */
    contractName: string;


    /**
     * @isattribute true
     * @name booleanJoinOffset
     * @documentation
     * [
     * "`booleanJoinOffset` attribute",
     * "***",
     *  "A value to be added to all digital/boolean join numbers provided in the template.  ",
     *  ""
     * ]
     * @name booleanJoinOffset
     */
    booleanJoinOffset: string;

    /**
     * @isattribute true
     * @name numericJoinOffset
     * @documentation
     * [
     * "`numericJoinOffset` attribute",
     * "***",
     *  "A value to be added to all analog/numeric join numbers provided in the template.  ",
     *  ""
     * ]
     * @name numericJoinOffset
     */
    numericJoinOffset: string;

    /**
     * @isattribute true
     * @name stringJoinOffset
     * @documentation
     * [
     * "`stringJoinOffset` attribute",
     * "***",
     *  "A value to be added to all serial/string join numbers provided in the template.  ",
     *  ""
     * ]
     * @name stringJoinOffset
     */
    stringJoinOffset: string;

}

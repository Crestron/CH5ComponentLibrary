// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../ch5-common";
import { ICh5TemplateAttributes } from "./i-ch5-template-attributes";

/**
 * @name Ch5 Template
 * @isattribute false
 * @tagName ch5-template
 * @description ch5-template create new instances of the user provided <template>.
 * @documentation
 * [
 *   "`ch5-template` element",
 *   "***",
 *   "The primary functionality of this component is to create new instances",
 *   "of the user-provided <template> and to substitute event and state names",
 *   "where indicated by the integrator."
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
export interface ICh5Template extends ICh5TemplateAttributes, ICh5Common {}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5SelectOptionAttributes } from "./i-ch5-select-option-attributes";
import { ICh5Common } from "../ch5-common";
import { TBoolAttribute } from "../ch5-common/types/t-bool-attribute";

/**
 * @name Ch5 Select option
 * @isattribute false
 * @tagName ch5-select-option
 * @description
 * @documentation
 * [
 * "`ch5-select-option` element",
 * "***",
 * "Extension to standard HTML option element"
 * ]
 */
export interface ICh5SelectOption extends ICh5SelectOptionAttributes, ICh5Common {
    /**
     * @documentation
     * [
     * "`useDefaultTmpl` attribute",
     * "***",
     * "Option to initialise ch5-select with the default template"
     * ]
     * @name usedefaulttmpl
     */
    useDefaultTmpl: TBoolAttribute;
}

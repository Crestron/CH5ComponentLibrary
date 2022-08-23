// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5SelectOptionAttributes } from ".";
import { ICh5Common } from "../../ch5-common/interfaces";

/**
 * @name Ch5 Select option
 * @isattribute false
 * @tagName ch5-select-option
 * @role option
 * @description
 * @componentVersion 1.0.0
 * @documentation
 * [
 * "`ch5-select-option` element",
 * "***",
 * "An extension to standard HTML option element."
 * ]
 */
export interface ICh5SelectOptionDocumentation extends ICh5Common, ICh5SelectOptionAttributes {
}
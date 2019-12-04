// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AttrValues } from "./attribute-values";
import { ICustomAttribute } from "./custom-attribute";

/**
 * @name Ch5 Show Attribute
 * @tagName ch5-show-attribute
 * @isattribute true
 * @documentation
 * [
 *   "`ch5-show-attribute` element",
 *   "***",
 *   "Extension to standard HTML attributes."
 * ]
 */
export interface ICh5ShowAttribute extends ICustomAttribute<AttrValues> {

}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICustomAttribute } from "./helpers/i-custom-attribute";
import { Ch5AttrShowTypes } from "./types/ch5-attr-show-types";

// tslint:disable-next-line:no-unused-expression
/**
 * @isattribute true
 * @name data-ch5-noshow-type
 * @documentation
 * [
 *  "`data-ch5-noshow-type` custom attribute",
 *  "***",
 *  "The 'data-ch5-noshow-type' custom attribute is related to HTML custom attribute 'data-ch5-show'",
 *  "and overrides the way in which a component is made invisible.",
 *  "Crestron Components library will default the 'noshow' type based upon the element type."
 * ]
 */
export interface ICh5AttrsNoshowType extends ICustomAttribute<Ch5AttrShowTypes> {

}

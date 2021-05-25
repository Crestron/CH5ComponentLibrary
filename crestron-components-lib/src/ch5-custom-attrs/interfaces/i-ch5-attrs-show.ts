// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICustomAttribute } from "./helpers/i-custom-attribute";

// tslint:disable-next-line:no-unused-expression
/**
 * @isattribute true
 * @name data-ch5-show
 * @documentation 
 * [  
 *  "`data-ch5-show` custom attribute",
 *  "***",
 *  "Specifies whether or not an element is visible based upon the value of the state. Works with standard HTML elements. ",
 *  "The data-ch5-noshow-type attribute can be supplied to set how an HTML element will be hidden from view."
 * ]
 */
export interface ICh5AttrsShow extends ICustomAttribute<string> {

}

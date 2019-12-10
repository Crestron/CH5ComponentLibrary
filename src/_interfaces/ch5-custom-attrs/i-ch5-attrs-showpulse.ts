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
 * @name data-ch5-showpulse
 * @documentation 
 * [  
 *  "`data-ch5-showpulse` custom attribute",
 *  "***",
 *  "Works similarly to data-ch5-show, but does not offer toggle functionality (can only make the elements visible).",
 *  "Works with standard HTML elements.",
 *  "The data-ch5-noshow-type attribute can be supplied to set how an HTML element will be hidden from view."
 * ]
 */

// tslint:disable-next-line:no-empty-interface
export interface ICh5AttrsShowPulse extends ICustomAttribute<string>  {

}

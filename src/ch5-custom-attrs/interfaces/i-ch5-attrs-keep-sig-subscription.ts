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
 * @name data-ch5-keep-sig-subscription
 * @documentation
 * [
 *  "`data-ch5-keep-sig-subscription` custom attribute",
 *  "***",
 *  "Keeps the state subscription key generated by hidepulse, showpulse, or show custom attributes."
 * ]
 */

// tslint:disable-next-line:no-empty-interface
export interface ICh5AttrsKeepSigSubscription extends ICustomAttribute<string>  {

}

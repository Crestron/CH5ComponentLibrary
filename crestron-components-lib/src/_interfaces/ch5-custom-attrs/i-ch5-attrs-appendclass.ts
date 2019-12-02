// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICustomAttribute } from "./helpers/i-custom-attribute";

/**
 * @isattribute true
 * @name data-ch5-appendclass
 * @documentation 
 * [  
 *  "`data-ch5-appendclass` custom attribute",
 *  "***",
 *  "The 'data-ch5-appendclass' custom HTML attribute appends the value of a signal to the 'class' attribute",
 *  "on a standard HTML element. A change in the value of the signal will remove the prior value of the",
 *  "signal and append the new value. "
 * 
 * ]
 */
// tslint:disable-next-line:no-empty-interface
export interface ICh5AttrsAppendclass extends ICustomAttribute<string> {}

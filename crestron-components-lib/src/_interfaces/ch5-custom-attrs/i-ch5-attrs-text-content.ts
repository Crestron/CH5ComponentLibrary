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
 * @name data-ch5-textcontent
 * @documentation 
 * [  
 *  "`data-ch5-textcontent` custom attribute",
 *  "***",
 *  "The 'data-ch5-textcontent' custom HTML attribute allows for dynamic text content to be applied to",
 *  "standard HTML elements such as <p> and <h1-6>. The attribute value is signalScript as described in the",
 *  "ch5.subscribeStateScript utility function description."
 * ]
 */

// tslint:disable-next-line:no-empty-interface
export interface ICh5AttrsTextContent extends ICustomAttribute<string> {

}

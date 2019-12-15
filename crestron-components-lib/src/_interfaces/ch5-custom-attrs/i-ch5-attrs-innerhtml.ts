// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICustomAttribute } from "./helpers/i-custom-attribute";

/**
 * @isattribute true
 * @name data-ch5-innerhtml
 * @documentation 
 * [  
 *  "`data-ch5-innerhtml` custom attribute",
 *  "***",
 *  "The 'data-ch5-innerhtml' custom HTML attribute allows for dynamic HTML content to be applied to ",
 *  "standard HTML elements such as <div>. This is a very powerful construct that, when used incorrecly, ",
 *  "can lead to functional and performance issues if used to inject badly-formed HTML. The ",
 *  "attribute value is signalScript as described in the ch5.subscribeStateScript utility function description."
 * ]
 */

// tslint:disable-next-line:no-empty-interface
export interface ICh5AttrsInnerHTML extends ICustomAttribute<string>  {

}

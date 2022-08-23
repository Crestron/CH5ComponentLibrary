// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TBoolAttribute } from "./../t-ch5-common";

/**
 * @ignore
 */
export interface ICh5CommonForDebug {

    /**
     * @documentation
     * [
     * "`debug` attribute",
     * "***",
     * "The default value is false. Used to get useful developer-related information about component behavior."
     * ]
     * @name debug
     * @default true
     * @attributeType "Boolean"
     */
    debug: TBoolAttribute;

}

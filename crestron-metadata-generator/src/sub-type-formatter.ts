// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TypeFormatter } from "./type-formatter";
import { BaseType } from "./type/base-type";

export interface SubTypeFormatter extends TypeFormatter {
    supportsType(type: BaseType): boolean;
}

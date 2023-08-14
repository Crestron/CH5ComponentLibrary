// Copyright (C) 2023 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonForClass } from "./common/i-ch5-common-class";
import { ICh5CommonForDebug } from "./common/i-ch5-common-debug";
import { ICh5CommonForDisabled } from "./common/i-ch5-common-disabled";
import { ICh5CommonForRole } from "./common/i-ch5-common-role";
import { ICh5CommonForStyle } from "./common/i-ch5-common-style";
import { ICh5CommonAttributesText } from "./i-ch5-common-attributes-text";

/**
 * @ignore
 */
export interface ICh5CommonText extends ICh5CommonForDisabled, ICh5CommonForDebug, ICh5CommonForRole, ICh5CommonForStyle, ICh5CommonForClass, ICh5CommonAttributesText {}

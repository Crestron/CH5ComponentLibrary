// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5Common } from "../../ch5-common/interfaces";
import {
    ICh5DpadBottomAttributes,
    ICh5DpadCenterAttributes,
    ICh5DpadLeftAttributes,
    ICh5DpadRightAttributes,
    ICh5DpadTopAttributes,
    ICh5DpadAttributes
} from "./index";

/**
 * @ignore
 */
export interface ICh5DpadDocumentation extends
    ICh5Common,
    ICh5DpadAttributes,
    ICh5DpadCenterAttributes,
    ICh5DpadTopAttributes,
    ICh5DpadLeftAttributes,
    ICh5DpadRightAttributes,
    ICh5DpadBottomAttributes {
}
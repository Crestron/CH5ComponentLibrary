// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BaseCompositeType } from "./base-composite-type";

/**
 * @ignore
 */
export interface Ch5Base {
    /**
     * @name type
     * @documentation
     * [
     *  "`type` attribute",
     *  "***",
     *  "Valid values: default, info, text, danger, warning, success, primary, secondary.",
     *  "",
     *  "Overrides the appearance of the button with alternative css defined in classes defined with ch5-button--type where type is the value of the property.If no `type` is provided, type of `default` is used."
     * ]
     */
    type: BaseCompositeType;
}

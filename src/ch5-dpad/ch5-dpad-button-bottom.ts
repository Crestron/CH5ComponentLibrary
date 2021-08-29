// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5DpadChildBase } from "./ch5-dpad-child-base";
import { ICh5DpadBottomAttributes } from "./interfaces/i-ch5-dpad-button-bottom-attributes";

export class Ch5DpadBottom extends Ch5DpadChildBase implements ICh5DpadBottomAttributes {

    //#region 1. Variables
    //#region 1.1 readonly variables
    //#endregion
    //#region 1.2 private / protected variables
    //#endregion
    //#endregion

    //#region 2. Setters and Getters
    //#endregion

    //#region 3. Lifecycle Hooks

    public constructor() {
        super({
            primaryTagClass: 'bottom',
            defaultIconClass: 'fa-caret-down',
            defaultArrowClass: 'direction-btn',
            btnType: 'bottom'
        });
    }

    //#endregion

    //#region 4. Other Methods
    //#endregion

    //#region 5. Events - event binding
    //#endregion
}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-dpad-button-bottom', Ch5DpadBottom);
}
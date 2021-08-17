import _ from "lodash";
import { Ch5DpadChildBase } from "./ch5-dpad-child-base";
import { ICh5DpadRightAttributes } from "./interfaces/i-ch5-dpad-button-right-interfaces";

export class Ch5DpadRight extends Ch5DpadChildBase implements ICh5DpadRightAttributes {

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
            primaryTagClass: 'right',
            defaultIconClass: 'fa-caret-right',
            defaultArrowClass: 'direction-btn',
            btnType: 'right'
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
    window.customElements.define('ch5-dpad-button-right', Ch5DpadRight);
}
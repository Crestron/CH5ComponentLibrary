import _ from "lodash";
import { Ch5DpadChildBase } from "./ch5-dpad-child-base";
import { ICh5DpadLeftAttributes } from "./interfaces/i-ch5-dpad-button-left-interfaces";

export class Ch5DpadLeft extends Ch5DpadChildBase implements ICh5DpadLeftAttributes {

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
            primaryTagClass: 'left',
            defaultIconClass: 'fa-caret-left',
            defaultArrowClass: 'direction-btn',
            btnType: 'left'
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
    window.customElements.define('ch5-dpad-button-left', Ch5DpadLeft);
}
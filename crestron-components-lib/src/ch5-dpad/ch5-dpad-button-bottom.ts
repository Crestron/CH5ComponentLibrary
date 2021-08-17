import _ from "lodash";
import { Ch5DpadChildBase } from "./ch5-dpad-child-base";
import { ICh5DpadBottomAttributes } from "./interfaces/i-ch5-dpad-button-bottom-interfaces";

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
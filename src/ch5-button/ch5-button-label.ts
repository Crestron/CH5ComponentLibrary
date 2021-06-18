// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import _ from "lodash";
import { Ch5Button } from "./ch5-button";
import { Ch5ButtonMode } from "./ch5-button-mode";
import { Ch5ButtonModeState } from "./ch5-button-mode-state";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";

export class Ch5ButtonLabel extends Ch5Common {

    constructor() {
        super();
        this.info('Ch5ButtonLabel.constructor()');
    }

    /**
     * 	Called every time the element is inserted into the DOM.
     *  Useful for running setup code, such as fetching resources or rendering.
     */
    public connectedCallback() {
        this.info('Ch5ButtonLabel.connectedCallback()');
        this.cacheComponentChildrens();

        if (!(this.parentElement instanceof Ch5Button || this.parentElement instanceof Ch5ButtonMode || this.parentElement instanceof Ch5ButtonModeState)) {
            throw new Error(`Invalid parent element for ch5-button-label.`);
        }

        this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonLabel);

        // set data-ch5-id
        this.setAttribute('data-ch5-id', this.getCrId());

        this.initAttributes();
        this.initCommonMutationObserver(this);

        // const callbackFn = (mutations: any) => console.log("mutations", mutations);
        // const configForMut = {
        //     attributes: true,
        //     subtree: true,
        //     characterData: true
        // };
        // const observer = new MutationObserver(callbackFn);
        // observer.observe(this, configForMut);
        // observer.disconnect();
        //     Array.from(this.children).forEach((newChild) => {
    }

    /**
     * Called every time the element is removed from the DOM.
     * Useful for running clean up code.
     */
    public disconnectedCallback() {
        // Placeholder
    }

}

if (typeof window === "object" && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define('ch5-button-label', Ch5ButtonLabel);
}

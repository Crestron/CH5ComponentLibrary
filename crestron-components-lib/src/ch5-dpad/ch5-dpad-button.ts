// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5DpadChildBase } from "./ch5-dpad-child-base";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ICh5DpadChildBaseAttributes } from "./interfaces/i-ch5-dpad-child-base-attributes";
import { TCh5DpadChildButtonType } from "./interfaces/t-ch5-dpad";

export class Ch5DpadButton extends Ch5DpadChildBase implements ICh5DpadChildBaseAttributes {
    public static readonly ELEMENT_NAME = 'ch5-dpad-button';
    //#region 1. Variables

    //#region 1.1 readonly variables
    public static readonly DEFAULT_ICONS = {
        up: 'fa-caret-up',
        down: 'fa-caret-down',
        left: 'fa-caret-left',
        right: 'fa-caret-right',
        center: 'fa-circle'
    };

    //#endregion

    //#region 1.2 private / protected variables
    private labelClass: string = 'dpad-btn-label';

    //#endregion

    //#endregion

    //#region 2. Lifecycle Hooks

    public constructor() {
        super();
    }

    public static registerSignalAttributeTypes() {
        Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton.SIGNAL_ATTRIBUTE_TYPES);
    }

    /**
     * Function to create all inner html elements required to complete dpad center button
     */
    public createHtmlElements(): void {
        this.logger.start('createHtmlElements', this.COMPONENT_NAME);

        if (this.primaryCssClass) {
            this.classList.add(this.primaryCssClass);
        }
        this.classList.add(this.CSS_CLASS_LIST.commonBtnClass);
        if (this.CSS_CLASS_LIST.primaryTagClass) {
            this.classList.add(this.CSS_CLASS_LIST.primaryTagClass);
        }
        if (this.CSS_CLASS_LIST.defaultArrowClass) {
            this.classList.add(this.CSS_CLASS_LIST.defaultArrowClass);
        }

        // Order of preference is:
        // 0 parentContract
        // 4 iconUrl
        // 5 iconClass
        // 6 label
        if (this.iconUrl.length > 0) {
            this._icon = CH5DpadUtils.getImageContainer(this.iconUrl);
            this._icon.style.backgroundImage = `url(${this.iconUrl})`;
        } else if (this.iconClass) {
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(...(this.iconClass.split(' ')));
        } else if (this.label.length > 0 && this.key === 'center') {
            this._icon = CH5DpadUtils.getLabelContainer(this.labelClass);
            this._icon.innerHTML = this.label;
        } else {
            // if nothing works, then render as default
            this._icon = CH5DpadUtils.getIconContainer();
            this._icon.classList.add(this.CSS_CLASS_LIST.primaryIconClass);
            this._icon.classList.add(this.CSS_CLASS_LIST.defaultIconClass);
        }

        if (this._icon.parentElement !== this) {
            this.appendChild(this._icon);
        }

        this.logger.stop();
    }

    static get observedAttributes() {
        const commonAttributes: string[] = Ch5Common.observedAttributes;

        // attributes
        const attributes: string[] = [
            "label",
            "iconclass",
            "iconurl",
            'key',
            'pressed'
        ];

        // received signals
        const receivedSignals: string[] = [
        ];

        // sent signals
        const sentSignals: string[] = [];

        const ch5DpadAttributes = commonAttributes.concat(attributes).concat(receivedSignals).concat(sentSignals);

        return ch5DpadAttributes;
    }

    public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
        this.logger.start("attributeChangedCallback", this.COMPONENT_NAME);
        attr = attr.toLowerCase();

        if (oldValue === newValue) {
            return;
        }

        this.info('ch5-dpad-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
        switch (attr) {
            case 'label':
                CH5DpadUtils.createIconTag(this);
                this.label = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            case 'key':
                CH5DpadUtils.createIconTag(this);
                this.key = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                if (newValue) {
                    super.initializeParams({
                        primaryTagClass: newValue as TCh5DpadChildButtonType,
                        defaultIconClass: Ch5DpadButton.DEFAULT_ICONS[newValue as TCh5DpadChildButtonType],
                        defaultArrowClass: newValue  === 'center' ? '' : 'direction-btn',
                        btnType: newValue as TCh5DpadChildButtonType
                    });
                }
                break;
            case 'pressed':
                CH5DpadUtils.setAttributeToElement(this, 'pressed', newValue);
                this.pressed = CH5DpadUtils.setAttributesBasedValue(this.hasAttribute(attr), newValue, '');
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }

        this.logger.stop();
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        super.initAttributes();
        // below actions, set default value to the control's attribute if they dont exist, and assign them as a return value
        this.label = CH5DpadUtils.setAttributeToElement(this, 'label', this._label);

        this.logger.stop();
    }

    //#endregion

}

if (typeof window === "object"
    && typeof window.customElements === "object"
    && typeof window.customElements.define === "function") {
    window.customElements.define(Ch5DpadButton.ELEMENT_NAME, Ch5DpadButton);
}

Ch5DpadButton.registerSignalAttributeTypes();
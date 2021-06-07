// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5TemplateStructure } from "./ch5-template-structure";
import { ICh5TemplateAttributes } from "./interfaces/i-ch5-template-attributes";
import { publishEvent } from "../ch5-core";

export class Ch5Template extends Ch5Common implements ICh5TemplateAttributes {

    public static CH5_TEMPLATE_STYLE_CLASS: string = 'ch5-template';

    // COMPONENT ATTRIBUTES

    /**
     * The id of the template to be instantiated
     * @type {string}
     * @private
     * HTML attribute name: templateId
     */
    private _templateId: string = '';

    /**
     * A list of replacement strings to modify the template to particular instance.
     * In format of "original:replacement;"  original it the value to be replaced, replacement is the replacement value.
     * Pairs of original:replacement can be separated by semi-colon;
     * @type {string}
     * @private
     * HTML attribute name: context
     */
    private _context: string = '';

    /**
     * @type {Ch5TemplateStructure}
     */
    private _templateHelper: Ch5TemplateStructure = {} as Ch5TemplateStructure;

    public static get observedAttributes() {
        const commonObservedAttributes = Ch5Common.observedAttributes;
        const contextObservedAttributes = [
            'templateid',
            'context'
        ];

        return contextObservedAttributes.concat(commonObservedAttributes);
    }

    public set templateId(value: string) {
        if (this._templateId !== value) {
            this._templateId = value;
            this.setAttribute('templateid', value.toString());
        }
    }

    public get templateId() {
        return this._templateId;
    }

    public set context(value: string) {
        if (this._context !== value) {
            this._context = value;
            this.setAttribute('context', value.toString());
        }
    }

    public get context() {
        return this._context;
    }

    public connectedCallback() {
        this.info('Ch5Template.connectedCallback()');
        Promise.all([
            customElements.whenDefined('ch5-template'),
        ]).then(() => {
            this.initializations();
            this.info('Ch5Template --- Callback loaded');
        })
    }

    /**
     *  Called to initialize all attributes
     */
    protected initAttributes(): void {
        super.initAttributes();
        this.info('Ch5Template.initAttributes()');

        if (this.hasAttribute('templateid')) {
            this.templateId = this.getAttribute('templateid') as string;
        }

        if (this.hasAttribute('context')) {
            this.context = this.getAttribute('context') as string;
        }
    }

    private initializations(): void {
        this.info('Ch5Template.initializations()');
        this.classList.add(Ch5Template.CH5_TEMPLATE_STYLE_CLASS);
        this.initAttributes();
        this._templateHelper = new Ch5TemplateStructure(this);
        this._templateHelper.generateTemplate(this.templateId, this.context);
        this.info('Ch5Template --- Initialization Finished');
    }

    /**
     * Called when an HTML attribute is changed, added or removed
     */
    public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
        if (oldValue === newValue) {
            return;
        }

        this.info(`Ch5Template.attributeChangedCallback("${attr}", "${oldValue}", "${newValue}")`);

        switch (attr) {
            case 'templateId':
                this.templateId = this.getAttribute('templateId') as string;
                break;
            case 'context':
                this.context = this.getAttribute('context') as string;
                break;
            default:
                super.attributeChangedCallback(attr, oldValue, newValue);
                break;
        }
    }

    /**
     * Called when disconnected from the document tree.
     * 
     */
    public disconnectedCallback() {
        this.info('Ch5Template.disconnectedCallback()');
        // tell the world that no longer on DOM
        if (this._templateHelper && this._templateHelper.instanceId) {
            // keep this in sync with ch5-template-structure
            publishEvent('object', `ch5-template:${this.templateId}`, {loaded: false, id: this._templateHelper.instanceId});
        }

        // , then undo the work in initializations 
        this.classList.remove(Ch5Template.CH5_TEMPLATE_STYLE_CLASS);
        if (this.firstElementChild) { // this should be only child
            this.removeChild(this.firstElementChild);
        }
        this._templateHelper = {} as Ch5TemplateStructure;
    }
}

if (typeof window === "object" &&
    typeof window.customElements === "object" &&
    typeof window.customElements.define === "function") {
    window.customElements.define('ch5-template', Ch5Template);
}

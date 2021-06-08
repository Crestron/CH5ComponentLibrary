// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "./i-ch5-common-attributes";
import { TBoolAttribute } from "./t-ch5-common";

/**
 * @ignore
 * TODO - to remove this file, the below properties must be in ICh5CommonAttributes
 */
export interface ICh5Common extends ICh5CommonAttributes {

    /**
     * @documentation
     * [
     * "`class` attribute",
     * "***",
     * "This is a standard class HTML attribute."
     * ]
     * @name class
     */
    class: string;
    
    /**
     * @documentation
     * [
     * "`style` attribute",
     * "***",
     * "This is a standard style HTML attribute."
     * ]
     * @name style
     */
    style: string;
    
    /**
     * @documentation
     * [
     * "`role` attribute",
     * "***",
     * "This is an accessibility attribute implemented by all ch5-components and added automatically if not set by the user. ",
     * "Where possible, it represents the closest supported type for a ch5-component. In the case of a ch5-button, the value of the role attribute is 'button', for a ch5-modal-dialog the value is 'dialog', and so on. ",
     * "The default value for this ch5-component can be overridden via this attribute."
     * ]
     * @name role
     */
    role: string;

    /**
     * @documentation
     * [
     * "`debug` attribute",
     * "***",
     * "The default value is false. Used to get useful developer-related information about component behavior."
     * ]
     * @name debug
     * @default true
     */
    debug: TBoolAttribute;

    /**
     * @documentation
     * [
     * "`disabled` attribute",
     * "***",
     * "The default value is false. This property will direct the component to change CSS and event listeners ",
     * "to reflect a disabled state when true."
     * ]
     * @name disabled
     * @default false
     */
    disabled: TBoolAttribute;
}

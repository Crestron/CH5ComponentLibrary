// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonForRole  {
    
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
     * @attributeType "String"
     */
    role: string;

}

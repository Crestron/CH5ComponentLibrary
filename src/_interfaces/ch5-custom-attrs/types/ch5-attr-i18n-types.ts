// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export type SavedElementInfo = {

    /**
     * Unique id of element with ch5-attr-i18n attribute
     */
    uniqueElementId: string;

    /**
     * Attribute Name i.e. data-ch5-attr-i18n
     */
    attributeName: string;

    /**
     * value of attribute should be locale key
     */
    attributeValue: string;
}

/**
 * data-ch5-attr-i18n can have attribute
 * like data-ch5-i18n='-+[attr=alt]locale.key+-'
 */
export type SubAtrribute = {

    /**
     * Type of attribute (i.e. inner,attr)
     */
    typeOfAttribute: string;

    /**
     *  Target child element
     */
    attributeSelector: string;

    /**
     * Localized string or key 
     */
    valueToTranslate: string;

    /**
     *  To check whether data-ch5-i18n 
     *  has attribute or not
     */
    hasAttribute: boolean;
};
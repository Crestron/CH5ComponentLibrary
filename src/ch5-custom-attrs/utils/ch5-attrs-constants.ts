// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface Ich5AttributeTranlate {
    dataCh5AttrName: string;
    elementIdPrefix: string;
    randomNumberLength: number;
    subAttributePosition: number;
    subAttributeType: string;
    defaultIndex: number;
}

export const CH5_I18N_ATTRIBUTE_CONSTANT: Ich5AttributeTranlate = {
    dataCh5AttrName: 'data-ch5-i18n',
    elementIdPrefix: 'ch5_translate_',
    randomNumberLength: 10,
    subAttributePosition: 2,
    subAttributeType: 'inner',
    defaultIndex: -1
};

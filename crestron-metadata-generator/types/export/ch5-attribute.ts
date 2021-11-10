// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class Ch5Attribute {
    public name: string;
    public type?: string;
    public value: string[];
    public documentation?: string[];
    public default?: string;
    public hideWhen?: object[];
    public showWhen?: object[];

    public static New(): Ch5Attribute {
        const result = new Ch5Attribute();
        result.documentation = [];
        result.value = [];
        return result;
    }
}

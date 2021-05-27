// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Attribute } from "./ch5-attribute";
import { Ch5Snippet } from "./ch5-snippet";

export class Ch5Element {
    public name: string;
    public tagName: string;
    public role?: string;
    public description?: string;
    public attributes: Ch5Attribute[];
    public documentation?: string[];
    public snippets?: Ch5Snippet[];
    public componentVersion?: string;

    public static New(): Ch5Element {
        const result = new Ch5Element();
        result.attributes = [];
        result.documentation = [];
        result.snippets = [];

        return result;
    }
}

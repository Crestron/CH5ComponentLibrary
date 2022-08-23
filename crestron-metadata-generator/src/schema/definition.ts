// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { RawType } from "./raw-type";

export interface DefinitionTuple {
    name: string;
    definition: Definition;
}

export interface Definition {
    $ref?: string;
    description?: string;
    not?: Definition;
    allOf?: Definition[];
    oneOf?: Definition[];
    anyOf?: Definition[];
    title?: string;
    isattribute?: boolean;
    type?: string | string[];
    format?: string;
    items?: Definition | Definition[];
    minItems?: number;
    maxItems?: number;
    additionalItems?: Definition;
    enum?: (RawType | Definition)[];
    default?: RawType | Object;
    additionalProperties?: false | Definition;
    required?: string[];
    propertyOrder?: string[];
    attributes?: Map<string, Definition>;
    defaultProperties?: string[];
    isAliasType?: boolean;
    typeof?: "function";
    role?: string;
    componentVersion?: string;
}


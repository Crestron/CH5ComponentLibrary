// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { BaseType } from "../type/base-type";
import { OptionalType } from "../type/optional-type";
import { RestType } from "../type/rest-type";
import { TupleType } from "../type/tuple-type";

export class TupleTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: TupleType): boolean {
        return type instanceof TupleType;
    }
    public getDefinition(type: TupleType, isRoot?: boolean): Definition {
        const subTypes = type.getTypes();

        const requiredElements = subTypes.filter(t => !(t instanceof OptionalType) && !(t instanceof RestType));
        const optionalElements  = subTypes.filter(t => t instanceof OptionalType) as OptionalType[];
        const restElements = subTypes.filter(t => t instanceof RestType) as RestType[];

        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item, isRoot));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item, isRoot));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;

        const restType = restElements.length ? restElements[0].getType().getItem() : undefined;
        const restDefinition = restType ? this.childTypeFormatter.getDefinition(restType, isRoot) : undefined;

        return {
            type: "array",
            minItems: requiredDefinitions.length,
            ...(itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}), // with items
            ...(!itemsTotal && restDefinition ? { items: restDefinition } : {}), // with only rest param
            ...(!itemsTotal && !restDefinition ? { maxItems: 0 } : {}), // empty
            ...(restDefinition && itemsTotal ? { additionalItems: restDefinition } : {}), // with items and rest
            ...(!restDefinition && itemsTotal ? { maxItems: itemsTotal } : {}), // without rest
        };
    }
    public getChildren(type: TupleType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}

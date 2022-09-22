// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isArray } from "util";
import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { AnnotatedType } from "../type/annotated-type";
import { BaseType } from "../type/base-type";

export function makeAttribute(def: Definition, attributeValue: boolean | undefined) {
    def.isattribute = attributeValue;
}

export function makeAliasType(def: Definition, isAlias: boolean | undefined) {
    def.isAliasType = isAlias;
}

export function makeNullable(def: Definition) {
    const union: Definition[] | undefined = def.oneOf || def.anyOf;
    if (union && union.filter((d: Definition) => d.type === "null").length === 0) {
        union.push({ type: "null" });
    } else if (def.type && def.type !== "object") {
        if (isArray(def.type)) {
            if (def.type.indexOf("null") === -1) {
                def.type.push("null");
            }
        } else if (def.type !== "null") {
            def.type = [def.type, "null"];
        }

        // enums need null as an option
        if (def.enum && def.enum.indexOf(null) === -1) {
            def.enum.push(null);
        }
    } else {
        const subdef: Definition = {};

        if ("anyOf" in def) {
            for (const d of def.anyOf!) {
                if (d.type === "null") {
                    return def;
                }
            }
        }

        for (const k in def) {
            if (def.hasOwnProperty(k) && k !== "description" && k !== "title" && k !== "default") {
                const key: keyof Definition = k as keyof Definition;
                subdef[key] = def[k];
                delete def[k];
            }
        }
        def.anyOf = [subdef, { type: "null" }];
    }
    return def;
}

export class AnnotatedTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: AnnotatedType): boolean {
        return type instanceof AnnotatedType;
    }
    public getDefinition(type: AnnotatedType, isRoot?: boolean): Definition {
        const def: Definition = {
            ...this.childTypeFormatter.getDefinition(type.getType(), !isRoot),
            ...type.getAnnotations(),
        };

        if (isRoot) {
            if (type.isAttribute()) {
                makeAttribute(def, true);
            } else {
                makeAttribute(def, false);
            }
        } else {
            makeAttribute(def, undefined);
        }

        if (type.isNullable()) {
            return makeNullable(def);
        }
        return def;
    }
    public getChildren(type: AnnotatedType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}

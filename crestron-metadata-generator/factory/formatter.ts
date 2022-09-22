// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ChainTypeFormatter } from "../src/chain-type-formatter";
import { CircularReferenceTypeFormatter } from "../src/circular-reference-type-formatter";
import { Config } from "../src/config";
import { TypeFormatter } from "../src/type-formatter";
import { AliasTypeFormatter } from "../src/type-formatter/alias-type-formatter";
import { AnnotatedTypeFormatter } from "../src/type-formatter/annotated-type-formatter";
import { AnyTypeFormatter } from "../src/type-formatter/any-type-formatter";
import { ArrayTypeFormatter } from "../src/type-formatter/array-type-formatter";
import { BooleanTypeFormatter } from "../src/type-formatter/boolean-type-formatter";
import { DefinitionTypeFormatter } from "../src/type-formatter/definition-type-formatter";
import { EnumTypeFormatter } from "../src/type-formatter/enum-type-formatter";
import { IntersectionTypeFormatter } from "../src/type-formatter/intersection-type-formatter";
import { LiteralTypeFormatter } from "../src/type-formatter/literal-type-formatter";
import { LiteralUnionTypeFormatter } from "../src/type-formatter/literal-union-type-formatter";
import { NullTypeFormatter } from "../src/type-formatter/null-type-formatter";
import { NumberTypeFormatter } from "../src/type-formatter/number-type-formatter";
import { ObjectTypeFormatter } from "../src/type-formatter/object-type-formatter";
import { OptionalTypeFormatter } from "../src/type-formatter/optional-type-formatter";
import { PrimitiveUnionTypeFormatter } from "../src/type-formatter/primitive-union-type-formatter";
import { ReferenceTypeFormatter } from "../src/type-formatter/reference-type-formatter";
import { RestTypeFormatter } from "../src/type-formatter/rest-type-formatter";
import { StringTypeFormatter } from "../src/type-formatter/string-type-formatter";
import { TupleTypeFormatter } from "../src/type-formatter/tuple-type-formatter";
import { UndefinedTypeFormatter } from "../src/type-formatter/undefined-type-formatter";
import { UnionTypeFormatter } from "../src/type-formatter/union-type-formatter";



export function createFormatter(config: Config): TypeFormatter {
    const chainTypeFormatter = new ChainTypeFormatter([]);
    const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter(chainTypeFormatter);

    chainTypeFormatter
        .addTypeFormatter(new AnnotatedTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new StringTypeFormatter())
        .addTypeFormatter(new NumberTypeFormatter())
        .addTypeFormatter(new BooleanTypeFormatter())
        .addTypeFormatter(new NullTypeFormatter())

        .addTypeFormatter(new AnyTypeFormatter())
        .addTypeFormatter(new UndefinedTypeFormatter())

        .addTypeFormatter(new LiteralTypeFormatter())
        .addTypeFormatter(new EnumTypeFormatter())

        .addTypeFormatter(new ReferenceTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new DefinitionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new LiteralUnionTypeFormatter())

        .addTypeFormatter(new OptionalTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new RestTypeFormatter(circularReferenceTypeFormatter))

        .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter))
        .addTypeFormatter(new IntersectionTypeFormatter(circularReferenceTypeFormatter));

    return circularReferenceTypeFormatter;
}

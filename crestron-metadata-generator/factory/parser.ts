// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { BasicAnnotationsReader } from "../src/annotation-reader/basic-annotations-reader";
import { ExtendedAnnotationsReader } from "../src/annotation-reader/extended-annotations-reader";
import { ChainNodeParser } from "../src/chain-node-parser";
import { CircularReferenceNodeParser } from "../src/circular-reference-node-parser";
import { Config } from "../src/config";
import { ExposeNodeParser } from "../src/expose-node-parser";
import { NodeParser } from "../src/node-parser";
import { AnnotatedNodeParser } from "../src/node-parser/annotated-node-parser";
import { AnyTypeNodeParser } from "../src/node-parser/any-type-node-parser";
import { ArrayNodeParser } from "../src/node-parser/array-node-parser";
import { BooleanLiteralNodeParser } from "../src/node-parser/boolean-literal-node-parser";
import { BooleanTypeNodeParser } from "../src/node-parser/boolean-type-node-parser";
import { CallExpressionParser } from "../src/node-parser/call-expression-parser";
import { EnumNodeParser } from "../src/node-parser/enum-node-parser";
import { ExpressionWithTypeArgumentsNodeParser } from "../src/node-parser/expression-with-type-arguments-node-parser";
import { IndexedAccessTypeNodeParser } from "../src/node-parser/indexed-access-type-node-parser";
import { InterfaceNodeParser } from "../src/node-parser/interface-node-parser";
import { IntersectionNodeParser } from "../src/node-parser/intersection-node-parser";
import { LiteralNodeParser } from "../src/node-parser/literal-node-parser";
import { MappedTypeNodeParser } from "../src/node-parser/mapped-type-node-parser";
import { NullLiteralNodeParser } from "../src/node-parser/null-literal-node-parser";
import { NumberLiteralNodeParser } from "../src/node-parser/number-literal-node-parser";
import { NumberTypeNodeParser } from "../src/node-parser/number-type-node-parser";
import { ObjectTypeNodeParser } from "../src/node-parser/object-type-node-parser";
import { OptionalTypeNodeParser } from "../src/node-parser/optional-type-node-parser";
import { ParenthesizedNodeParser } from "../src/node-parser/parenthesized-node-parser";
import { RestTypeNodeParser } from "../src/node-parser/rest-type-node-parser";
import { StringLiteralNodeParser } from "../src/node-parser/string-literal-node-parser";
import { StringTypeNodeParser } from "../src/node-parser/string-type-node-parser";
import { TupleNodeParser } from "../src/node-parser/tuple-node-parser";
import { TypeAliasNodeParser } from "../src/node-parser/type-alias-node-parser";
import { TypeLiteralNodeParser } from "../src/node-parser/type-literal-node-parser";
import { TypeOperatorNodeParser } from "../src/node-parser/type-operator-node-parser";
import { TypeReferenceNodeParser } from "../src/node-parser/type-reference-node-parser";
import { TypeofNodeParser } from "../src/node-parser/typeof-node-parser";
import { UndefinedTypeNodeParser } from "../src/node-parser/undefined-type-node-parser";
import { UnionNodeParser } from "../src/node-parser/union-node-parser";
import { SubNodeParser } from "../src/sub-node-parser";
import { TopRefNodeParser } from "../src/top-ref-node-parser";

export function createParser(program: ts.Program, config: Config): NodeParser {
    const typeChecker = program.getTypeChecker();

    const chainNodeParser = new ChainNodeParser(typeChecker, []);

    function withExpose(nodeParser: SubNodeParser): SubNodeParser {
        return new ExposeNodeParser(typeChecker, nodeParser, config.expose);
    }
    function withTopRef(nodeParser: NodeParser): NodeParser {
        /**
         * NOTE: intentionally making it false.
         */
        return new TopRefNodeParser(chainNodeParser, false);
    }
    function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
        if (config.jsDoc === "extended") {
            return new AnnotatedNodeParser(nodeParser, new ExtendedAnnotationsReader(typeChecker));
        } else if (config.jsDoc === "basic") {
            return new AnnotatedNodeParser(nodeParser, new BasicAnnotationsReader());
        } else {
            return nodeParser;
        }
    }
    function withCircular(nodeParser: SubNodeParser): SubNodeParser {
        return new CircularReferenceNodeParser(nodeParser);
    }

    chainNodeParser
        .addNodeParser(new StringTypeNodeParser())
        .addNodeParser(new NumberTypeNodeParser())
        .addNodeParser(new BooleanTypeNodeParser())
        .addNodeParser(new AnyTypeNodeParser())
        .addNodeParser(new UndefinedTypeNodeParser())
        .addNodeParser(new ObjectTypeNodeParser())

        .addNodeParser(new StringLiteralNodeParser())
        .addNodeParser(new NumberLiteralNodeParser())
        .addNodeParser(new BooleanLiteralNodeParser())
        .addNodeParser(new NullLiteralNodeParser())

        .addNodeParser(new LiteralNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ParenthesizedNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new IndexedAccessTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeofNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new MappedTypeNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TypeOperatorNodeParser(typeChecker, chainNodeParser))

        .addNodeParser(new UnionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new IntersectionNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new TupleNodeParser(typeChecker, chainNodeParser))
        .addNodeParser(new OptionalTypeNodeParser(chainNodeParser))
        .addNodeParser(new RestTypeNodeParser(chainNodeParser))

        .addNodeParser(new CallExpressionParser(typeChecker, chainNodeParser))

        .addNodeParser(withCircular(withExpose(withJsDoc(
            new TypeAliasNodeParser(typeChecker, chainNodeParser)))))
        .addNodeParser(withExpose(withJsDoc(new EnumNodeParser(typeChecker))))
        .addNodeParser(withCircular(withExpose(withJsDoc(
            new InterfaceNodeParser(typeChecker, withJsDoc(chainNodeParser)),
        ))))
        .addNodeParser(withCircular(withExpose(withJsDoc(
            new TypeLiteralNodeParser(withJsDoc(chainNodeParser)),
        ))))

        .addNodeParser(new ArrayNodeParser(chainNodeParser));

    return withTopRef(chainNodeParser);
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { ExtendedAnnotationsReader } from "../annotation-reader/extended-annotations-reader";
import { AnnotationsReader } from "../annotations-reader";
import { Context } from "../node-parser";
import { SubNodeParser } from "../sub-node-parser";
import { AnnotatedType } from "../type/annotated-type";
import { BaseType } from "../type/base-type";

export class AnnotatedNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: SubNodeParser,
        private annotationsReader: AnnotationsReader,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, typeName: string, context: Context): BaseType {
        const baseType = this.childNodeParser.createType(node, typeName, context);
        const annotatedNode = this.getAnnotatedNode(node);
        const annotations = this.annotationsReader.getAnnotations(annotatedNode);
        const nullable = this.annotationsReader instanceof ExtendedAnnotationsReader ?
            this.annotationsReader.isNullable(annotatedNode) : false;
        const isAttribute = this.annotationsReader instanceof ExtendedAnnotationsReader ?
            this.annotationsReader.isAttribute(annotatedNode) : false;

        return !annotations && !nullable ? baseType : new AnnotatedType(baseType, annotations || {}, nullable, isAttribute);
    }

    private getAnnotatedNode(node: ts.Node): ts.Node {
        if (!node.parent) {
            return node;
        } else if (node.parent.kind === ts.SyntaxKind.PropertySignature) {
            return node.parent;
        } else if (node.parent.kind === ts.SyntaxKind.IndexSignature) {
            return node.parent;
        } else {
            return node;
        }
    }
}

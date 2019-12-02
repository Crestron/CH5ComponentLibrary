// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import * as ts from "typescript";
import { Annotations } from "../type/annotated-type";
import { symbolAtNode } from "../utils/symbol-at-node";
import { BasicAnnotationsReader } from "./basic-annotations-reader";

export class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    constructor(private typeChecker: ts.TypeChecker) {
        super();
    }

    public getAnnotations(node: ts.Node): Annotations | undefined {
        const annotations: Annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getTypeAnnotation(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }

    public isAttribute(node: ts.Node): boolean {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return false;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
            (tag: ts.JSDocTagInfo) => tag.name === "isattribute");

        if (jsDocTag === undefined) {
            return false;
        } else {
            const text = jsDocTag.text;
            if (isNil(text)) {
                return true;
            } else {
                return text.toLowerCase() === "true";
            }
        }
    }

    public isNullable(node: ts.Node): boolean {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return false;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
            (tag: ts.JSDocTagInfo) => tag.name === "nullable");
        return !!jsDocTag;
    }

    private getDescriptionAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const comments: ts.SymbolDisplayPart[] = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }

        return {description: comments.map((comment) => comment.text).join(" ")};
    }
    private getTypeAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const jsDocTag = jsDocTags.find((tag) => tag.name === "asType");
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }

        return {type: jsDocTag.text};
    }
}

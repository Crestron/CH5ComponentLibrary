// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { JsonTagsConfiguration } from "../annotation-tags/json-tags-configuration";
import { TextTagsConfiguration } from "../annotation-tags/text-tags-configuration";
import { AnnotationsReader } from "../annotations-reader";
import { ConsoleDebugger } from "../debug/console-debugger";
import { Annotations } from "../type/annotated-type";
import { symbolAtNode } from "../utils/symbol-at-node";

export class BasicAnnotationsReader implements AnnotationsReader {
    public getAnnotations(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const annotations = jsDocTags.reduce((result: Annotations, jsDocTag) => {
            const value = this.parseJsDocTag(jsDocTag);
            if (value !== undefined) {
                result[jsDocTag.name] = value;
            }

            ConsoleDebugger.log("value of annotation: ", result);
            return result;
        }, {});
        return Object.keys(annotations).length ? annotations : undefined;
    }

    private parseJsDocTag(jsDocTag: ts.JSDocTagInfo): any {
        if (!jsDocTag.text) {
            return undefined;
        }

        if (TextTagsConfiguration.TEXT_TAGS.indexOf(jsDocTag.name) >= 0) {
            return jsDocTag.text;
        } else if (JsonTagsConfiguration.JSON_TAGS.indexOf(jsDocTag.name) >= 0) {
            return this.parseJson(jsDocTag.text);
        } else {
            return undefined;
        }
    }

    private parseJson(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return undefined;
        }
    }
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ConsoleDebugger } from "../debug/console-debugger";
import { ISnippet, isSnippet } from "../type/i-snippet";

export type CheckFunction = (value: string) => boolean;
export type ExampleFunction = () => any;
export interface SpecialTag {
    name: string;
    check: CheckFunction;
    provideExample: ExampleFunction;
}

export class SpecialJsonTags {
    public static GetSpecialTags(): SpecialTag[] {
        return [
            <SpecialTag>{
                /**
                 * Snippets property actually contains JSON
                 */
                name: "snippets",
                check: SpecialJsonTags.isSnippetsTagValid,
                provideExample: SpecialJsonTags.getSnippetExample,
            },
            <SpecialTag>{
                /**
                 * Documentation property actually contains JSON
                 */
                name: "documentation",
                check: SpecialJsonTags.isDocumentationTagValid,
                provideExample: SpecialJsonTags.getDocumentationExample,
            },
            <SpecialTag>{
                /**
                 * childElements property actually contains JSON
                 */
                name: "childElements",
                check: SpecialJsonTags.isChildElementsTagValid,
                provideExample: SpecialJsonTags.getChildElementsExample,
            },
            <SpecialTag>{
                /**
                 * Attribute property actually contains bool value.
                 */
                name: "isattribute",
                check: SpecialJsonTags.isAttributeTagValid,
                provideExample: SpecialJsonTags.getIsAttributeExample,
            },
        ];
    }

    private static isDocumentationTagValid(documentationTag: string): boolean {
        try {
            const documentationIsValid = SpecialJsonTags.isArray(JSON.parse(documentationTag));
            return documentationIsValid;
        } catch (error) {
            ConsoleDebugger.error("Documentation tag not valid", error);
            return false;
        }
    }

    private static isChildElementsTagValid(childElementsTag: string): boolean {
        try {
            const childElementsIsValid = SpecialJsonTags.isArray(JSON.parse(childElementsTag));
            return childElementsIsValid;
        } catch (error) {
            ConsoleDebugger.error("childElements tag not valid", error);
            return false;
        }
    }

    private static isAttributeTagValid(attributeTag: string): boolean {
        try {
            const documentationIsValid = Boolean(attributeTag);
            return true;
        } catch (error) {
            ConsoleDebugger.error("Attribute tag not a boolean", error);
            return false;
        }
    }

    private static isSnippetsTagValid(snippetsTag: string): boolean {
        try {
            const object = JSON.parse(snippetsTag);
            if (SpecialJsonTags.isArray(object)) {
                for (const element of (object as any[])) {
                    if (!isSnippet(element)) {
                       return false;
                    }
                }

                return true;
            } else {
                return false;
            }
        } catch (error) {
            ConsoleDebugger.error("Snippet tag not valid", error);
            return false;
        }
    }

    private static getDocumentationExample(): string[] {
        return [
            "Documentation",
            "Multiline",
        ];
    }

    private static getChildElementsExample(): string[] {
        return [
            "childElements",
            "Multiline",
        ];
    }

    private static getIsAttributeExample(): string {
        return "true";
    }

    private static getSnippetExample(): ISnippet {
        return <ISnippet>{
            body: ["Snippet", "lines"],
            description: "Snipped description",
            prefix: "Prefix definition",
        };
    }

    private static isArray(valueToCheck: any): boolean {
        return Object.prototype.toString.call(valueToCheck) === "[object Array]";
    }
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { StringBuilder } from "../../utils/string-builder/string-builder";
import { DebugConfiguration } from "../debug-configuration";

export class ProcessDebugger {

    public static log(message?: any, ...optionalParams: any[]): void {
        this.logInternal(DebugConfiguration.shouldPrintToOutputStream(), message, optionalParams);
    }

    public static error(message?: any, ...optionalParams: any[]): void {
        this.errorInternal(DebugConfiguration.shouldPrintToOutputStream(), message, optionalParams);
    }

    private static logInternal(debug: boolean, message?: any, optionalParams?: any[]): void {
        if (debug) {
            const messageToShow = this.prepareMessageInternal(message, optionalParams);
            process.stdout.write(messageToShow);

            // write new line.
            process.stderr.write(DebugConfiguration.NEWLINE);
        }
    }

    private static errorInternal(debug: boolean, message?: any, optionalParams?: any[]): void {
        if (debug) {
            const messageToShow = this.prepareMessageInternal(message, optionalParams);
            process.stderr.write(messageToShow);

            // write new line.
            process.stderr.write(DebugConfiguration.NEWLINE);
        }
    }

    private static prepareOptionalParameters (optionalParams?: any[]): string {
        let stringifiedPayload = "";
        if (optionalParams !== undefined && optionalParams.length > 0) {
            const builder = new StringBuilder();
            for (const param of optionalParams) {
                const stringified = JSON.stringify(param, undefined, "\t");
                builder.AppendLine(stringified);
            }

            stringifiedPayload = builder.ToString();
        }

        return stringifiedPayload;
    }

    private static prepareMessageInternal(message?: any, optionalParams?: any[]): string {

        const stringifiedPayload = this.prepareOptionalParameters(optionalParams);

        const ts: string = (new Date()).toISOString();
        const messageToShow =
            `(${ts}) ${DebugConfiguration.CONSOLE_PREFIX} ${DebugConfiguration.CONSOLE_SEPARATOR} \
${message} ${DebugConfiguration.NEWLINE}
${stringifiedPayload} ${DebugConfiguration.NEWLINE}`;

        return messageToShow;
    }
}

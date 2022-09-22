// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as commander from "commander";
import * as fs from "fs";
import { isNil } from "lodash";
import * as path from "path";
import { createFormatter } from "./factory/formatter";
import { createParser } from "./factory/parser";
import { createProgram } from "./factory/program";
import { Config, DEFAULT_CONFIG } from "./src/config";
import { ConsoleDebugger } from "./src/debug/console-debugger";
import { ProcessDebugger } from "./src/debug/process/process-debugger";
import { BaseError } from "./src/error/base-error";
import { LogicError } from "./src/error/logic-error";
import { reflectTypes } from "./src/export/utils/reflect-utils";
import { SchemaGenerator } from "./src/schema-generator";
import { formatError } from "./src/utils/format-error";
import { Metadata } from "./types/export/metadata";

// to split types
function list(value: string) {
    return value.split(",");
}

const args: any = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --types <names>", "Type name", list)
    .option("-wr, --writeto <path>", "Write schema to path")
    .option(
        "-e, --expose <expose>",
        "Type exposing",
        /^(all|none|export)$/,
        "export",
    )
    .option(
        "-j, --jsDoc <extended>",
        "Read JsDoc annotations",
        /^(extended|none|basic)$/,
        "extended",
    )
    .option(
        "-s, --strictTuples",
        "Do not allow additional items on tuples",
    )
    .option(
        "-at, --allTypes",
        "Get all user types (except those in node_modules)",
    )
    .parse(process.argv);

const config: Config = {
    ...DEFAULT_CONFIG,
    path: args.path,
    types: args.types,
    expose: args.expose,
    topRef: args.topRef,
    jsDoc: args.jsDoc,
    strictTuples: args.strictTuples,
    writeFileTo: args.writeto,
    allTypes: args.allTypes,
};

function writeFile(pathToFile: string, contents: string): void {
    fs.writeFile(pathToFile, contents, (_) => {
        if (_ !== null) {
            ConsoleDebugger.error("Possible error with writing file: ", _);
            throw _;
        }
    });
}

function deleteFile(pathToFile: string): void {
    fs.unlinkSync(pathToFile);
}

function checkFileExists(pathToFile: string): boolean {
    return fs.existsSync(pathToFile);
}

function WriteSchema(schema: string, writeToPath?: string): void {
    let schemaFilePath: string | undefined = "";
    if (!isNil(writeToPath)) {
        schemaFilePath = writeToPath;
    } else {
        const filePath = config.path;

        if (filePath === undefined) {
            throw new LogicError("Could not find the filepath specified");
        }

        const directory = path.dirname(filePath);

        if (directory === undefined) {
            throw new LogicError("Could not find the directory of the filepath specified");
        }

        let newFile: string;
        if (directory.endsWith("/")) {
            newFile = directory + "schema.json";
        } else {
            newFile = directory + "/" + "schema.json";
        }

        schemaFilePath = path.join(__dirname, newFile);
    }

    if (schemaFilePath === undefined) {
        throw new LogicError("Schema file path is undefined");
    }

    if (checkFileExists(schemaFilePath)) {
        deleteFile(schemaFilePath);
    }

    writeFile(schemaFilePath, schema);
}

function Serialize(schema: Metadata): string {
    const serializedSchema = JSON.stringify(schema, undefined, 2);

    return serializedSchema;
}

function logConfig() {
    ProcessDebugger.log("Configuration object: ", config);
    ProcessDebugger.log("======================");
}

function logError(error: any) {
    ProcessDebugger.error("Error received: ", error);
    ProcessDebugger.error("======================");
}

function execute() {
    try {
        logConfig();
        const program = createProgram(config);
        // const generator = createGenerator(config);
        // const program = generator.getProgram();
        let types: string[] = [];
        if (!isNil(config.allTypes) && config.allTypes) {
            types = reflectTypes(program);
        } else {
            types = config.types;
        }

        if (types.length === 0) {
            throw new Error("Could not find any types to generate metadata for");
        } else {
            const parser = createParser(program, config);
            const formatter = createFormatter(config);
            const schemaGenerator = new SchemaGenerator(program, parser, formatter);
            const metadata = schemaGenerator.createMetadata(types);
            const serializedSchema = Serialize(metadata);
            WriteSchema(serializedSchema, config.writeFileTo);
            // sanity test
            console.log("Schema generated OK");
        }
    } catch (error) {
        logError(error);
        if (error instanceof BaseError) {
            process.stderr.write(formatError(error));
            process.exit(1);
        } else {
            throw error;
        }
    }
}

execute();

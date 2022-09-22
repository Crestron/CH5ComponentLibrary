// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as glob from "glob";
import * as path from "path";
import * as ts from "typescript";

import { Config } from "../src/config";
import { DiagnosticError } from "../src/error/diagnostic-error";
import { LogicError } from "../src/error/logic-error";

function createProgramFromConfig(configFile: string): ts.Program {
    const config = ts.parseConfigFileTextToJson(
        configFile,
        ts.sys.readFile(configFile)!,
    );
    if (config.error) {
        throw new DiagnosticError([config.error]);
    } else if (!config.config) {
        throw new LogicError(`Invalid parsed config file "${configFile}"`);
    }

    const parseResult = ts.parseJsonConfigFileContent(
        config.config,
        ts.sys,
        path.dirname(configFile),
        {},
        configFile,
    );
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;

    const program = ts.createProgram(
        parseResult.fileNames,
        parseResult.options,
    );

    return program;
}
function createProgramFromGlob(fileGlob: string): ts.Program {
    return ts.createProgram(glob.sync(path.resolve(fileGlob)), {
        noEmit: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        strictNullChecks: false,
    });
}

export function createProgram(config: Config): ts.Program {
    const program: ts.Program = path.extname(config.path) === ".json" ?
        createProgramFromConfig(config.path) :
        createProgramFromGlob(config.path);

    return program;
}

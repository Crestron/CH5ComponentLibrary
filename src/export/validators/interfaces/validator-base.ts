// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ValidationError } from "../../../error/validation-error";
import { Definition } from "../../../schema/definition";
import { Schema } from "../../../schema/schema";
import { isSchema } from "../../utils/type-guards";
import { ValidationResult } from "../validation-result";
import { IValidator, ValidationKind } from "./i-validator";

export abstract class ValidatorBase implements IValidator {

    public abstract name: string;
    public abstract kind: ValidationKind;
    public validate(definition: Definition | Schema): ValidationResult {
        if (isSchema(definition)) {
            return this.validateSchema(<Schema>definition);
        } else {
            return this.validateDefinition(<Definition>definition);
        }
    }

    protected abstract validateSchema(definition: Schema): ValidationResult;
    protected abstract validateDefinition(definition: Definition): ValidationResult;

    protected validResult(): ValidationResult {
        return <ValidationResult>{
            error: undefined,
            name: this.name,
            success: true,
        };
    }

    protected invalidResult(message: string): ValidationResult {
        return <ValidationResult>{
            error: <ValidationError>{
                message,
            },
            name: this.name,
            success: false,
        };
    }
}



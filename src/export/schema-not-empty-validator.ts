// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ValidationError } from "../error/validation-error";
import { Definition } from "../schema/definition";
import { Schema } from "../schema/schema";
import * as _ from "./utils/schema-utils";
import { SchemaValidatorBase } from "./validators/interfaces/schema-validator-base";
import { ValidationResult } from "./validators/validation-result";

export class SchemaNotEmptyValidator extends SchemaValidatorBase {
    public get name() {
        return "Schema is not empty validator";
    }

    protected validateSchema(definition: Schema): ValidationResult {
        if (!_.hasKeys(definition)) {
            return this.invalidResult("Schema is empty");
        }

        return this.validResult();
    }

    // tslint:disable-next-line:variable-name
    protected validateDefinition(_definition: Definition): ValidationResult {
        throw new ValidationError("Schema not empty does not validate definitions.");
    }
}

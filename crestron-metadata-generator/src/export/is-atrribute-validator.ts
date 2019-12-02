// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ValidationError } from "../error/validation-error";
import { Definition } from "../schema/definition";
import { Schema } from "../schema/schema";
import { getName } from "./utils/schema-utils";
import { SchemaValidatorBase } from "./validators/interfaces/schema-validator-base";
import { ValidationResult } from "./validators/validation-result";

export class IsAttributeValidator extends SchemaValidatorBase {
    public get name() {
        return "Is Atrribute validator";
    }

    protected validateSchema(definition: Schema): ValidationResult {
        const definitions = definition.definitions;
        const types: string[] = [];

        let allValid = true;
        for (const item of definitions) {
            if (item[1].isAliasType) {
                continue;
            }

            const itemValidity = item[1].isattribute !== undefined;
            if (!itemValidity) {
                types.push(getName(item[1]));
            }

            allValid = allValid && itemValidity;
        }

        if (!allValid) {
            return this.invalidResult("Not all types specify if they're attributes or not. Specifying this is done using @isattribute true/false");
        }

        return this.validResult();
    }
    // tslint:disable-next-line:variable-name
    protected validateDefinition(_definition: Definition): ValidationResult {
        throw new ValidationError("Schema not empty does not validate definitions.");
    }
}


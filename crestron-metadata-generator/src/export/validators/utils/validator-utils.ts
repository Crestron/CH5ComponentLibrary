// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Definition, DefinitionTuple } from "../../../schema/definition";
import { Schema } from "../../../schema/schema";
import { getAliasTypes, getTypes } from "../../utils/schema-utils";
import { IValidator } from "../interfaces/i-validator";
import { ValidationResult } from "../validation-result";
import { ValidationResults } from "../validation-results";

function getSchemaValidators(validators: IValidator[]): IValidator[] {
    return validators.filter(x => x.kind === "schema");
}

function getAliasTypeValidators(validators: IValidator[]): IValidator[] {
    return validators.filter(x => x.kind === "aliasType");
}

function getTypeValidators(validators: IValidator[]): IValidator[] {
    return validators.filter(x => x.kind === "type");
}

function getAttributeValidators(validators: IValidator[]): IValidator[] {
    return validators.filter(x => x.kind === "attribute");
}

function validate(validators: IValidator[], schema: Schema): ValidationResults {
    const schemaValidators = getSchemaValidators(validators);
    const attributeValidators = getAttributeValidators(validators);
    const aliasValidators = getAliasTypeValidators(validators);
    const typeValidators = getTypeValidators(validators);

    const schemaValidationResults = validateSchema(schema, schemaValidators);
    const aliasTypesValidationResults = validateAliasTypes(schema, aliasValidators);
    const typeValidationResults = validateTypes(schema, typeValidators);
    const attributeValidationResults = validateAttributes(schema, attributeValidators);

    const allValidationResults = [...schemaValidationResults, ...aliasTypesValidationResults, ...typeValidationResults, ...attributeValidationResults];
    return new ValidationResults(allValidationResults);
}

function validateSchema(schema: Schema, validators: IValidator[]): ValidationResult[] {
    return validators.map(x => x.validate(schema));
}

function validateAliasTypes(schema: Schema, validators: IValidator[]): ValidationResult[] {
    const types = getAliasTypes(schema);
    return types.reduce((result: ValidationResult[], tuple: DefinitionTuple) => {
        result.push(...validators.map(x => x.validate(tuple.definition)));
        return result;
    }, []);
}

function validateTypes(schema: Schema, validators: IValidator[]): ValidationResult[] {
    const types = getTypes(schema);
    return types.reduce((result: ValidationResult[], definition: Definition) => {
        result.push(...validators.map(x => x.validate(definition)));
        return result;
    }, []);
}

function validateAttributes(schema: Schema, validators: IValidator[]): ValidationResult[] {
    const types = getTypes(schema);

    return types.reduce((result: ValidationResult[], definition: Definition) => {
        result.push(...validateTypeAttribute(definition, validators));
        return result;
    }, []);
}

function validateTypeAttribute(definition: Definition, validators: IValidator[]): ValidationResult[] {
    const result: ValidationResult[] = [];
    if (isNil(definition.attributes)) {
        return [];
    }

    const attributes = definition.attributes;

    if (isNil(attributes)) {
        return [];
    }

    const attributeKeys = Array.from(attributes.keys() || []);

    if (isNil(attributeKeys) || attributeKeys.length === 0) {
        return [];
    }

    for (const key of attributeKeys) {
        const propertyMetadata = attributes.get(key);
        if (!isNil(propertyMetadata)) {
            result.push(...validators.map(x => x.validate(propertyMetadata)));
        }
    }

    return result;
}

export {
    validate,
};

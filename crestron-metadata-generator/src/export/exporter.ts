// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Metadata } from "../../types/export/metadata";
import { ValidationError } from "../error/validation-error";
import { Definition, DefinitionTuple } from "../schema/definition";
import { Schema } from "../schema/schema";
import * as packageJson from "./../../package.json";

import { IsAttributeValidator } from "./is-atrribute-validator";
import { SchemaNotEmptyValidator } from "./schema-not-empty-validator";
import * as metadataUtils from "./utils/metadata-utils";
import * as schemaUtils from "./utils/schema-utils";
import { IValidator } from "./validators/interfaces/i-validator";
import * as validator from "./validators/utils/validator-utils";

export class Exporter {
    private schema: Schema;
    private validators: IValidator[];

    constructor(schema: Schema, validators: IValidator[]) {
        this.schema = schema;
        this.validators = validators;
    }

    public static GetExporterFor(schema: Schema): Exporter {
        return new Exporter(schema, [
            new IsAttributeValidator(), new SchemaNotEmptyValidator(),
        ]);
    }

    public Validate(): void {
        const validationResults = validator.validate(this.validators, this.schema);
        if (!validationResults.success) {
            const humanReadableMessage = validationResults.toHumanReadable();
            throw new ValidationError(humanReadableMessage);
        }
    }

    public ConvertToMetadata(): Metadata {
        const result: Metadata = Metadata.New();
        if (!schemaUtils.hasKeys(this.schema)) {
            throw new ValidationError("No definitions were extracted");
        }
        const aliases: DefinitionTuple[] = schemaUtils.getAliasTypes(this.schema);
        const actualTypes: Definition[] = schemaUtils.getTypes(this.schema);

        result.version = packageJson.version;
        for (const definition of actualTypes) {
            if (definition.isattribute) {
                const attributeDefinition = metadataUtils.addAttributeDefinition(definition, aliases);
                result.htmlElements.common.attributes.push(attributeDefinition);
            } else {
                const typeDefinition = metadataUtils.addTypeDefinition(definition, aliases);
                result.ch5Elements.elements.push(typeDefinition);
            }
        }
        return result;
    }
}

// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import Enumerable = require("linq");
import { isNil } from "lodash";
import { ValidationError } from "../../error/validation-error";
import { StringBuilder } from "../../utils/string-builder/string-builder";
import { ValidationResult } from "./validation-result";
import { ValidationResultGroup } from "./validation-result-group";

export class ValidationResults {
    public success: boolean;
    public errors: ValidationResultGroup[];

    public constructor(results: ValidationResult[]) {
        this.initializeState(results);
    }

    public toHumanReadable(): string {
        if (this.success) {
            return "All validations passed. Metadata generated successfully.";
        } else {
            const builder = new StringBuilder();
            builder.AppendLine("There have been a few errors: ");
            for (const validationResult of this.errors) {
                builder.Append(`Error regarding ${validationResult.name}`);

                for (const error of validationResult.errors) {
                    builder.Append(`Validation failure: ${error.message}`);
                }
            }

            return builder.ToString();
        }
    }

    private initializeState(results: (ValidationResult | undefined)[]) {

        const resultsDefined: ValidationResult[] = [];

        for (const result of results) {
            if (!isNil(result)) {
                resultsDefined.push(result);
            }
        }

        this.success = resultsDefined.map(x => x.success).reduce((a, b) => a && b, true);

        if (!this.success) {
            const linq = Enumerable.from(resultsDefined);

            this.errors = [];
            const groupped = linq.groupBy(x => x.name).toArray();
            if (groupped.length) {
                for (const group of groupped) {
                    const groupKey = group.key();
                    const values = group.toArray();

                    if (values.length > 0) {
                        const notEmptyErrors = values.filter(x => !x.success && !isNil(x.error)).map(x => this.unProxify(x.error));
                        if (!isNil(notEmptyErrors) && notEmptyErrors.length > 0) {
                            this.errors.push(new ValidationResultGroup(groupKey, notEmptyErrors));
                        }
                    }
                }
            }
        } else {
            this.errors = [];
        }
    }

    private unProxify<T>(parameter?: T): T {
        if (parameter !== undefined) {
            return parameter;
        } else {
            throw new ValidationError("Could not unproxify");
        }
    }
}






// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BaseType } from "./base-type";

export class ObjectProperty {
    public constructor(
        private name: string,
        private type: BaseType,
        private required: boolean,
    ) {
    }

    public getName(): string {
        return this.name;
    }
    public getType(): BaseType {
        return this.type;
    }
    public isRequired(): boolean {
        return this.required;
    }
}

export class ObjectType extends BaseType {
    public constructor(
        private id: string,
        private baseTypes: BaseType[],
        private properties: ObjectProperty[],
        private additionalProperties: BaseType|boolean,
    ) {
        super();
    }

    public getId(): string {
        return this.id;
    }

    public getBaseTypes(): BaseType[] {
        return this.baseTypes;
    }
    public getProperties(): ObjectProperty[] {
        return this.properties;
    }
    public getAdditionalProperties(): BaseType|boolean {
        return this.additionalProperties;
    }
}

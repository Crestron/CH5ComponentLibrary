// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil, isEmpty } from 'lodash';

export type TSchemas = {
  http: string;
  https?: string;
}

export class Ch5ImageUriModel {

    protected _schemas: TSchemas = {} as TSchemas;
    protected _user: string = '';
    protected _password: string = '';
    protected _location: string = '';
    protected _protocol: string = '';


    constructor(
        schemas: TSchemas,
        user: string,
        password: string,
        location: string
    ) {
        this.schemas = schemas;
        this._protocol = this.getProtocol(location);
        this.user = user;
        this.password = password;
        this.location = location;

    }

    public set schemas(schemas: TSchemas) {
        if (isNil(schemas) || isEmpty(schemas)) {
            return;
        }

        this._schemas = schemas;
    }

    public get schemas(): TSchemas {
        return this._schemas
    }

    public set user(user: string) {
        if (isNil(user) || isEmpty(user)) {
            return;
        }

        this._user = user;
    }

    public get user(): string {

        return this._user;
    }

    public set password(password: string) {
        if (isNil(password) || isEmpty(password)) {
            return;
        }

        this._password = password
    }

    public get password(): string {
        return this._password;
    }

    public set location(location: string) {
        if (isNil(location) || isEmpty(location)) {
            return;
        }

        const protocolRegex = new RegExp('http(s?)[://]+(www\.)*');
        const matchedProtocol = location.match(protocolRegex);

        if (!isNil(matchedProtocol) && matchedProtocol.length > 0) {
            location = location.replace(matchedProtocol[0], '');
        }

        this._location = location;
    }

    public get location(): string {
        return this._location;
    }

    public toString() {
        if (!this.isValidAuthenticationUri()){
            return '';
        }

        return `${this._protocol}://${this.user}:${this.password}@${this.location}`;
    }

    public isValidAuthenticationUri() { 
        if (
            (isNil(this.password) || isEmpty(this.password)) || 
            (isNil(this.user) || isEmpty(this.user)) || 
            (isNil(this.schemas) || isEmpty(this.schemas) && this.schemas.http)
        ) {
            return false;
        }

        return true;
    }

    /**
     * Get the protocol from the capabilities, matching the secure/no-secure
     * of the previous protocol
     * 
     * @param {string} location - the full url
     * @return the protocol 
     */
    private getProtocol(location: string): string {

      const protocolRegex = new RegExp('^http(?:s?)');
      const matchedProtocol = location.match(protocolRegex);

      if (matchedProtocol && matchedProtocol[0] === 'https' && this.schemas.https) {
        return this.schemas.https;
      }

      return this.schemas.http;
    }
}

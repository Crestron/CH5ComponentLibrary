// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { uriSchemaValidation } from "../utility/uriSchemaValidation";
import Axios, { AxiosStatic, AxiosResponse } from "axios";
import { LogMessage, LogMessagesFilter } from "../helpers/index";

export class RequestService {

    private _uri: string = '';
    private _requestAPI: AxiosStatic = {} as AxiosStatic;

    constructor(uri: string) {
        this.uri = uri;
        this._requestAPI = Axios;
    }

    public async post(endpoint: string, data: LogMessage) {
        const response = await this._requestAPI.post(`${this._uri}/${endpoint}`, JSON.stringify(data), {
          headers: {
              'content-type': 'application/json;charset=utf8'
          }
        });

        return response.status === 200;
    }

    public get(endpoint: string): Promise<AxiosResponse<LogMessagesFilter>> | boolean {
      try {
        const response = this._requestAPI.get(`${this._uri}/${endpoint}`);
        return response;
      } catch (e) {
        return false;
      }

      
    }

    public set uri(uri: string) {
        if (uriSchemaValidation(uri)) {
            this._uri = uri;
        } else {
            throw new Error('Invalid URI schema');
        }
    }

    public get uri(): string {
        return this._uri;
    }
}

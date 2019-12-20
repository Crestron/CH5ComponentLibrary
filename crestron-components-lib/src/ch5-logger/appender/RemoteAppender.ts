/*
* Copyright (C) 2018 to the present, Crestron Electronics, Inc.
* All rights reserved.
* No part of this software may be reproduced in any form, machine
* or natural, without the express written consent of Crestron Electronics.
* Use of this source code is subject to the terms of the Crestron Software License Agreement
* under which you licensed this source code.
*/

import { AbstractAppender } from "./AbstractAppender";
import { RequestService } from "../services/index";
import { LogEndpointsEnum } from "../enums/index";
import { LogMessage, LogMessagesFilter } from "../helpers/index";
import { Logger } from "../logger";

export class RemoteAppender extends AbstractAppender {

    private _requestService: RequestService = {} as RequestService;
    private _address: string = '';

    /**
     * Logging the messages
     * The log level is 1
     * 
     * @param {LogMessage} data 
     */
    public log(data: LogMessage) {
      this.sendLogTimeOffset.subscribe(() => {
        this._requestService.post(LogEndpointsEnum.log, data)
      });
    }

    /**
     * Set the remote server IP
     * Initializing the request for the remote server
     * 
     * @param {string} ip
     * @param {string} port 
     * @param {boolean} secure 
     */
    public setIP(ip: string, port?: string, secure?: boolean) {

        const protocol = secure ? 'https' : 'http';

        const uri = `${protocol}://${ip}:${port}`;

        this._address = `${ip}:${port}`;
        this.initialiseRequest(uri);        
    }

    public configObserver(helper: Logger, hasFilterConfig: boolean) {

      if (!hasFilterConfig) {
        const responsePromise = this._requestService.get('configuration')
        
        if (responsePromise && responsePromise instanceof Promise) {
          responsePromise.then(response => {
            const filter = response.data;
            helper.logFilter = new LogMessagesFilter(filter.level, filter.source, filter.regularExpression);
            this.isInitialized = true;
            this.isInitializedSubject.next(true);
          })
        }
      }

      const websocket = new WebSocket(`ws://${this._address}`);
      websocket.onopen = () => {

        websocket.onmessage = (message) => {
          const data = JSON.parse(message.data);
          const filterObject = data.filter;
          helper.logFilter = new LogMessagesFilter(filterObject.level, filterObject.source, filterObject.regularExpression);
        }
      }
    }

    /**
     * Initialized the Request service 
     * Used to send requests to the remote server
     * 
     * @param {string} uri 
     */
    protected initialiseRequest(uri: string) {
        this._requestService = new RequestService(uri);
    }
}

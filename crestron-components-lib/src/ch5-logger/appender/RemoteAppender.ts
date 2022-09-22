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
import { TAppenderConfig } from "../types";

export class RemoteAppender extends AbstractAppender {
  private static _instance: RemoteAppender;
  private webSocket = {} as WebSocket;
  private _requestService: RequestService = {} as RequestService;
  private _address: string = '';

  public static getInstance(sendLogTimeOffsetInMiliseconds: number, appenderConfig: TAppenderConfig): RemoteAppender {
    if (RemoteAppender._instance === undefined) {
      RemoteAppender._instance = new RemoteAppender(sendLogTimeOffsetInMiliseconds, appenderConfig);
    }
    return RemoteAppender._instance;
  }

  /**
   * Close the websocket connection
   */
  public closeSocketConnection() {
    if (this.webSocket && this.webSocket.readyState && this.webSocket.readyState === 1) {
      this.webSocket.close();
    }
  }

  private constructor(sendLogTimeOffsetInMiliseconds: number, appenderConfig: TAppenderConfig) {
    super(sendLogTimeOffsetInMiliseconds);
    if (appenderConfig.hostname && appenderConfig.port) {
      this.setIP(appenderConfig);
    }
  }

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
   * Reset the remote server hostname/ip and port
   * 
   * @param hostname Hostname/IP of the remotelogger
   * @param port  Port number
   * @param secure by default false, true for secure connection 
   */
  public resetIP(hostname: string, port: string, secure: boolean = false) {
    const appenderConfig: TAppenderConfig = { hostname, port, secure };
    this.setIP(appenderConfig);
  }

  /**
   * Set the remote server hostname/ip and port
   * Initializing the request for the remote server
   * 
   * @param {TAppenderConfig} appenderConfig
   */
  private setIP(appenderConfig: TAppenderConfig) {
    // return when empty
    if (appenderConfig.hostname === "" || appenderConfig.port === "") {
      return;
    }

    const protocol = appenderConfig.secure ? 'https' : 'http';
    const uri = `${protocol}://${appenderConfig.hostname}:${appenderConfig.port}`;
    this._address = `${appenderConfig.hostname}:${appenderConfig.port}`;
    this.initialiseRequest(uri);
  }

  public configObserver(helper: Logger, hasFilterConfig: boolean) {
    helper.subscribeDockerStatus.next("DOCKER_CONNECTING");
    if (!hasFilterConfig) {
      const responsePromise = this._requestService.get('configuration')
      if (responsePromise && responsePromise instanceof Promise) {
        responsePromise.then(response => {
          const filter = response.data;
          helper.logFilter = new LogMessagesFilter(filter.level, filter.source, filter.regularExpression);
          this.isInitialized = true;
          this.isInitializedSubject.next(this.isInitialized);
          helper.subscribeDockerStatus.next("DOCKER_CONNECTED");
        })
      }
    }

    this.webSocket = new WebSocket(`ws://${this._address}`);

    this.webSocket.onopen = () => {
      this.webSocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        const filterObject = data.filter;
        helper.logFilter = new LogMessagesFilter(filterObject.level, filterObject.source, filterObject.regularExpression);
        helper.subscribeDockerStatus.next("DOCKER_CONNECTED");
      }
    }

    this.webSocket.onclose = (evt) => {
      let msg = "";
      if (evt.code === 3001 || evt.code === 1000) {
        msg = "DOCKER_DISCONNECTED";
        this.webSocket = {} as WebSocket;
        helper.logFilter = new LogMessagesFilter();
        this.isInitialized = false;
        this.isInitializedSubject.next(this.isInitialized);
        helper.subscribeDockerStatus.next(msg);
      }
    }

    this.webSocket.onerror = (error) => {
      helper.subscribeDockerStatus.next("DOCKER_ERROR");
    };
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

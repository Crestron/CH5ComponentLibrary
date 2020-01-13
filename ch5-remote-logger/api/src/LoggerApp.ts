/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import * as express from 'express';
import { server, connection, IMessage } from 'websocket';
import { Server } from 'http';
import { WebSocket } from './WebSocket';
import { resolve, join } from 'path';
export class LoggerApp {

  public port: number = 80;
  private _app: express.Application = {} as express.Application;
  private _ws: server = {} as server;

  constructor(port?: number) {
    if (port) {
      this.port = port;
    }
  }

  public run() {
    this.listen();
  }

  public get app(): Express.Application {
    return this._app;
  }

  public get ws(): server {
    return this._ws;
  }

  /**
   * Create the express App
   *
   * @return { Express.Application }
   */
  protected create() {
    this._app = express();
    (this._app as any).use(express.static(resolve('api/public')));
    return this._app;
  }

  protected websocketInit(runServer: Server) {
    this._ws = new server({
      httpServer: runServer,
      autoAcceptConnections: true,
    });

    new WebSocket(this._ws);

  }

  /**
   * Start the server on specified port
   *
   * @return {void}
   */
  protected listen() {
    const runServer = this.create().listen(this.port);
    this.websocketInit(runServer);
  }
}

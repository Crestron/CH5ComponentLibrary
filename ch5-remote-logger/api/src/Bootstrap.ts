import { isNil, isArray } from 'lodash';

import { LoggerApp }  from './LoggerApp';
import { useExpressServer } from 'routing-controllers';
import { AbstractController } from './controllers/AbstractController';
import { Request, Response, NextFunction, static as _static } from 'express';
import { TerminalAppender } from './appenders/TerminalAppender';
import { FileAppender } from './appenders/FileAppender';
import { FileSystem } from './services/FileSystem';

/**
 * Creates the express app
 * Attaches to it the controllers and delegators
 * Attaches to it the middlewares needed for logger to run properly
 */
export class Bootstrap {

  /**
   * Web API controllers
   *
   * @type { AbstractController }
   * @private
   */
  private _controllers: AbstractController[] = [];

  constructor(controllers: AbstractController[]) {
    this.controllers = controllers;
  }

  /**
   * Initialize the express app
   *
   * @return {void}
   */
  public init() {
    const app = this.createApp();
    this.resolveCors(app);
    this.registerControllers(app);
    this.setupAppenders(app);

    return app;
  }

  public set controllers(controllers: AbstractController[]) {
    if (isNil(controllers) || !isArray(controllers)) {
      this.controllers = [];
      return;
    }

    this._controllers = controllers;
  }

  public get controllers(): AbstractController[] {
    return this._controllers;
  }

  /**
   * Create the logger app
   *
   * @return {void}
   */
  private createApp() {
    const loggerApp = new LoggerApp();
    loggerApp.run();

    return loggerApp.app;
  }

  /**
   * Using router controllers package
   * (routing-controllers: https://github.com/typestack/routing-controllers)
   *
   * @param {Express.Application} app
   * @return {void}
   */
  private registerControllers(app: Express.Application) {
    useExpressServer(app, {
      controllers: this._controllers as Function[],
    });
  }

  /**
   * Remote logger should accept request from any origin
   *
   * @todo App param is of type `any` because Express.Application doesn't export
   * .use() method
   *
   * @param {any} app
   * @return {void}
   */
  private resolveCors(app: any): void {
    app.use((request: Request, response: Response, next: NextFunction) => {
      response.header('Accept', 'application/json;charset=utf8');
      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      response.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With',
      );

      // intercept OPTIONS method
      if ('OPTIONS' === request.method) {
        response.sendStatus(200);
      } else {
        next();
      }
    });
  }

  private setupAppenders(app: any): void {

    const fileSystem = new FileSystem('log');

    app.set('logAppenders', [
      new TerminalAppender(),
      new FileAppender(fileSystem),
    ]);
  }
}

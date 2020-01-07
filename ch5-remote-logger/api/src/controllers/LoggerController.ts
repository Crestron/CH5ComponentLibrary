import { Post, Body, Res, JsonController, Req } from 'routing-controllers';
import { AbstractController } from './AbstractController';
import { Request } from 'express';
import { Message } from '../model/Message';
import { TLog } from '../types';
import { IAppender } from '../appenders/IAppender';

@JsonController()
export class LoggerController extends AbstractController {

  @Post('/log')
  public post(@Body() message: TLog, @Req() request: Request) {
    const messageModel = new Message(message);
    const appenders: IAppender[] = request.app.get('logAppenders');

    appenders.forEach((appender) => {
      appender.append(messageModel);
    });

    return `${messageModel}`;
  }
}

import { IAppender } from './IAppender';
import { ConsoleMessageFormat } from '../format/ConsoleMessageFormat';
import { Message } from '../model/Message';

export class TerminalAppender implements IAppender {

  public append(message: Message) {

    const level = message.level;
    let logMethod = console.log;

    if (level === 1) {
      logMethod = console.info;
    } else if (level === 2) {
      logMethod = console.warn;
    } else if (level === 3) {
      logMethod = console.error;
    }

    const consoleMessage = new ConsoleMessageFormat(message);

    logMethod(consoleMessage.getMessage());
  }

}

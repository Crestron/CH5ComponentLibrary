import { AbstractMessageFormat } from './AbstractMessageFormat';

export class ConsoleMessageFormat extends AbstractMessageFormat {

  protected formatMessage() {

    let message = this._message.toString();

    if (this._message.level === 1) {
      message = `\x1b[34m${this._message.toString()}\x1b[0m`;
    } else if (this._message.level === 2) {
      message = `\x1b[33m${this._message.toString()}\x1b[0m`;
    } else if (this._message.level === 3) {
      message = `\x1b[31m${this._message.toString()}\x1b[0m`;
    }

    return message;
  }
}

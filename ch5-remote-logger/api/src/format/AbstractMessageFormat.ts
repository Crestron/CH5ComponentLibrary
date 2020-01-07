import { Message } from '../model/Message';

export abstract class AbstractMessageFormat {

  protected readonly _message: Message;

  constructor(message: Message) {
    this._message = message;
  }

  public getMessage(): string {
    return this.formatMessage();
  }

  public get message(): Message {
    return this._message;
  }

  protected abstract formatMessage(): string;

}
